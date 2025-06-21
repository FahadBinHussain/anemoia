import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useAuthModal } from './AuthModalContext';

interface SaveContextType {
  savedArtworkIds: Set<string>;
  saveArtwork: (artworkId: string) => void;
  unsaveArtwork: (artworkId: string) => void;
  isSaved: (artworkId: string) => boolean;
  isLoading: boolean;
}

const SaveContext = createContext<SaveContextType | undefined>(undefined);

const API_URL = 'http://localhost:4000/api';

export const SaveProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [savedArtworkIds, setSavedArtworkIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { currentUser } = useAuth();
  const { openAuthModal } = useAuthModal();

  // Load initial saved artworks from the backend when the user changes
  useEffect(() => {
    if (!currentUser) {
      setSavedArtworkIds(new Set());
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      setIsLoading(false);
      return;
    }

    fetch(`${API_URL}/user/saved`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch saved artworks');
        }
        return response.json();
      })
      .then(data => {
        console.log('Loaded saved artworks from backend:', data);
        setSavedArtworkIds(new Set(data.saved || []));
      })
      .catch(error => {
        console.error('Error fetching saved artworks:', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [currentUser]);

  const saveArtwork = useCallback((artworkId: string) => {
    if (!currentUser) {
      openAuthModal();
      return;
    }
    
    const token = localStorage.getItem('auth_token');
    if (!token) return;

    // Optimistic update
    setSavedArtworkIds(prevIds => new Set(prevIds).add(artworkId));

    // Make API call to backend
    fetch(`${API_URL}/user/saved`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ artwork_id: artworkId })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to save artwork');
        }
        return response.json();
      })
      .then(data => {
        console.log('Save response:', data);
      })
      .catch(error => {
        console.error('Error saving artwork:', error);
        // Revert optimistic update on error
        setSavedArtworkIds(prevIds => {
          const newIds = new Set(prevIds);
          newIds.delete(artworkId);
          return newIds;
        });
      });
  }, [currentUser, openAuthModal]);

  const unsaveArtwork = useCallback((artworkId: string) => {
    if (!currentUser) {
      openAuthModal();
      return;
    }
    
    const token = localStorage.getItem('auth_token');
    if (!token) return;

    // Optimistic update
    setSavedArtworkIds(prevIds => {
      const newIds = new Set(prevIds);
      newIds.delete(artworkId);
      return newIds;
    });

    // Make API call to backend
    fetch(`${API_URL}/user/saved`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ artwork_id: artworkId })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to unsave artwork');
        }
        return response.json();
      })
      .then(data => {
        console.log('Unsave response:', data);
      })
      .catch(error => {
        console.error('Error unsaving artwork:', error);
        // Revert optimistic update on error
        setSavedArtworkIds(prevIds => new Set(prevIds).add(artworkId));
      });
  }, [currentUser, openAuthModal]);

  const isSaved = useCallback((artworkId: string) => {
    return savedArtworkIds.has(artworkId);
  }, [savedArtworkIds]);

  return (
    <SaveContext.Provider value={{ savedArtworkIds, saveArtwork, unsaveArtwork, isSaved, isLoading }}>
      {children}
    </SaveContext.Provider>
  );
};

export const useSave = (): SaveContextType => {
  const context = useContext(SaveContext);
  if (context === undefined) {
    throw new Error('useSave must be used within a SaveProvider');
  }
  return context;
};