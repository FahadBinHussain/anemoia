import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface FollowContextType {
  followedArtistIds: Set<string>;
  followArtist: (artistId: string) => void;
  unfollowArtist: (artistId: string) => void;
  isFollowing: (artistId: string) => boolean;
  isLoading: boolean;
}

const FollowContext = createContext<FollowContextType | undefined>(undefined);

const API_URL = 'http://localhost:4000/api';

export const FollowProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [followedArtistIds, setFollowedArtistIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { currentUser } = useAuth();

  // Load initial follows from the backend when the user changes
  useEffect(() => {
    if (!currentUser) {
      setFollowedArtistIds(new Set());
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      setIsLoading(false);
      return;
    }

    fetch(`${API_URL}/user/follows`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch follows');
        }
        return response.json();
      })
      .then(data => {
        console.log('Loaded follows from backend:', data);
        setFollowedArtistIds(new Set(data.follows || []));
      })
      .catch(error => {
        console.error('Error fetching follows:', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [currentUser]);

  const followArtist = useCallback((artistId: string) => {
    if (!currentUser) return;
    
    const token = localStorage.getItem('auth_token');
    if (!token) return;

    // Optimistic update
    setFollowedArtistIds(prevIds => new Set(prevIds).add(artistId));

    // Make API call to backend
    fetch(`${API_URL}/user/follows`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ artist_id: artistId })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to follow artist');
        }
        return response.json();
      })
      .then(data => {
        console.log('Follow response:', data);
      })
      .catch(error => {
        console.error('Error following artist:', error);
        // Revert optimistic update on error
        setFollowedArtistIds(prevIds => {
          const newIds = new Set(prevIds);
          newIds.delete(artistId);
          return newIds;
        });
      });
  }, [currentUser]);

  const unfollowArtist = useCallback((artistId: string) => {
    if (!currentUser) return;
    
    const token = localStorage.getItem('auth_token');
    if (!token) return;

    // Optimistic update
    setFollowedArtistIds(prevIds => {
      const newIds = new Set(prevIds);
      newIds.delete(artistId);
      return newIds;
    });

    // Make API call to backend
    fetch(`${API_URL}/user/follows`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ artist_id: artistId })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to unfollow artist');
        }
        return response.json();
      })
      .then(data => {
        console.log('Unfollow response:', data);
      })
      .catch(error => {
        console.error('Error unfollowing artist:', error);
        // Revert optimistic update on error
        setFollowedArtistIds(prevIds => new Set(prevIds).add(artistId));
      });
  }, [currentUser]);

  const isFollowing = useCallback((artistId: string) => {
    return followedArtistIds.has(artistId);
  }, [followedArtistIds]);

  return (
    <FollowContext.Provider value={{ followedArtistIds, followArtist, unfollowArtist, isFollowing, isLoading }}>
      {children}
    </FollowContext.Provider>
  );
};

export const useFollow = (): FollowContextType => {
  const context = useContext(FollowContext);
  if (context === undefined) {
    throw new Error('useFollow must be used within a FollowProvider');
  }
  return context;
};
