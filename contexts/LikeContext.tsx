import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface LikeContextType {
  likedArtworkIds: Set<string>;
  likeArtwork: (artworkId: string) => void;
  unlikeArtwork: (artworkId: string) => void;
  isLiked: (artworkId: string) => boolean;
  isLoading: boolean;
}

const LikeContext = createContext<LikeContextType | undefined>(undefined);

const API_URL = 'http://localhost:4000/api';

export const LikeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [likedArtworkIds, setLikedArtworkIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { currentUser } = useAuth();

  // Load initial likes from the backend when the user changes
  useEffect(() => {
    if (!currentUser) {
      setLikedArtworkIds(new Set());
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      setIsLoading(false);
      return;
    }

    fetch(`${API_URL}/user/likes`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch likes');
        }
        return response.json();
      })
      .then(data => {
        console.log('Loaded likes from backend:', data);
        setLikedArtworkIds(new Set(data.likes || []));
      })
      .catch(error => {
        console.error('Error fetching likes:', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [currentUser]);

  const likeArtwork = useCallback((artworkId: string) => {
    if (!currentUser) return;
    
    const token = localStorage.getItem('auth_token');
    if (!token) return;

    // Optimistic update
    setLikedArtworkIds(prevIds => new Set(prevIds).add(artworkId));

    // Make API call to backend
    fetch(`${API_URL}/user/likes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ artwork_id: artworkId })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to like artwork');
        }
        return response.json();
      })
      .then(data => {
        console.log('Like response:', data);
      })
      .catch(error => {
        console.error('Error liking artwork:', error);
        // Revert optimistic update on error
        setLikedArtworkIds(prevIds => {
          const newIds = new Set(prevIds);
          newIds.delete(artworkId);
          return newIds;
        });
      });
  }, [currentUser]);

  const unlikeArtwork = useCallback((artworkId: string) => {
    if (!currentUser) return;
    
    const token = localStorage.getItem('auth_token');
    if (!token) return;

    // Optimistic update
    setLikedArtworkIds(prevIds => {
      const newIds = new Set(prevIds);
      newIds.delete(artworkId);
      return newIds;
    });

    // Make API call to backend
    fetch(`${API_URL}/user/likes`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ artwork_id: artworkId })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to unlike artwork');
        }
        return response.json();
      })
      .then(data => {
        console.log('Unlike response:', data);
      })
      .catch(error => {
        console.error('Error unliking artwork:', error);
        // Revert optimistic update on error
        setLikedArtworkIds(prevIds => new Set(prevIds).add(artworkId));
      });
  }, [currentUser]);

  const isLiked = useCallback((artworkId: string) => {
    return likedArtworkIds.has(artworkId);
  }, [likedArtworkIds]);

  return (
    <LikeContext.Provider value={{ likedArtworkIds, likeArtwork, unlikeArtwork, isLiked, isLoading }}>
      {children}
    </LikeContext.Provider>
  );
};

export const useLike = (): LikeContextType => {
  const context = useContext(LikeContext);
  if (context === undefined) {
    throw new Error('useLike must be used within a LikeProvider');
  }
  return context;
};