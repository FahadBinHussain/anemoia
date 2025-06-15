import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';

interface LikeContextType {
  likedArtworkIds: Set<string>;
  likeArtwork: (artworkId: string) => void;
  unlikeArtwork: (artworkId: string) => void;
  isLiked: (artworkId: string) => boolean;
}

const LikeContext = createContext<LikeContextType | undefined>(undefined);

export const LikeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [likedArtworkIds, setLikedArtworkIds] = useState<Set<string>>(new Set());

  const likeArtwork = useCallback((artworkId: string) => {
    setLikedArtworkIds(prevIds => new Set(prevIds).add(artworkId));
  }, []);

  const unlikeArtwork = useCallback((artworkId: string) => {
    setLikedArtworkIds(prevIds => {
      const newIds = new Set(prevIds);
      newIds.delete(artworkId);
      return newIds;
    });
  }, []);

  const isLiked = useCallback((artworkId: string) => {
    return likedArtworkIds.has(artworkId);
  }, [likedArtworkIds]);

  return (
    <LikeContext.Provider value={{ likedArtworkIds, likeArtwork, unlikeArtwork, isLiked }}>
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