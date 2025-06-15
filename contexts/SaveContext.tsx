import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';

interface SaveContextType {
  savedArtworkIds: Set<string>;
  saveArtwork: (artworkId: string) => void;
  unsaveArtwork: (artworkId: string) => void;
  isSaved: (artworkId: string) => boolean;
}

const SaveContext = createContext<SaveContextType | undefined>(undefined);

export const SaveProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [savedArtworkIds, setSavedArtworkIds] = useState<Set<string>>(new Set());

  const saveArtwork = useCallback((artworkId: string) => {
    setSavedArtworkIds(prevIds => new Set(prevIds).add(artworkId));
  }, []);

  const unsaveArtwork = useCallback((artworkId: string) => {
    setSavedArtworkIds(prevIds => {
      const newIds = new Set(prevIds);
      newIds.delete(artworkId);
      return newIds;
    });
  }, []);

  const isSaved = useCallback((artworkId: string) => {
    return savedArtworkIds.has(artworkId);
  }, [savedArtworkIds]);

  return (
    <SaveContext.Provider value={{ savedArtworkIds, saveArtwork, unsaveArtwork, isSaved }}>
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