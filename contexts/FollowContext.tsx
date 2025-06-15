
import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';

interface FollowContextType {
  followedArtistIds: Set<string>;
  followArtist: (artistId: string) => void;
  unfollowArtist: (artistId: string) => void;
  isFollowing: (artistId: string) => boolean;
}

const FollowContext = createContext<FollowContextType | undefined>(undefined);

export const FollowProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [followedArtistIds, setFollowedArtistIds] = useState<Set<string>>(new Set());

  const followArtist = useCallback((artistId: string) => {
    setFollowedArtistIds(prevIds => new Set(prevIds).add(artistId));
  }, []);

  const unfollowArtist = useCallback((artistId: string) => {
    setFollowedArtistIds(prevIds => {
      const newIds = new Set(prevIds);
      newIds.delete(artistId);
      return newIds;
    });
  }, []);

  const isFollowing = useCallback((artistId: string) => {
    return followedArtistIds.has(artistId);
  }, [followedArtistIds]);

  return (
    <FollowContext.Provider value={{ followedArtistIds, followArtist, unfollowArtist, isFollowing }}>
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
