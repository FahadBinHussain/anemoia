import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { Comment, User } from '../types';
import { useAuth } from './AuthContext';
import { useAuthModal } from './AuthModalContext';

interface CommentContextType {
  commentsMap: Map<string, Comment[]>;
  getComments: (artworkId: string) => Comment[];
  addComment: (artworkId: string, text: string) => void;
}

const CommentContext = createContext<CommentContextType | undefined>(undefined);

export const CommentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [commentsMap, setCommentsMap] = useState<Map<string, Comment[]>>(new Map());
  const { currentUser } = useAuth();
  const { openAuthModal } = useAuthModal();

  const getComments = useCallback((artworkId: string): Comment[] => {
    return commentsMap.get(artworkId) || [];
  }, [commentsMap]);

  const addComment = useCallback((artworkId: string, text: string) => {
    if (!currentUser) {
      openAuthModal();
      return;
    }
    
    const newComment: Comment = {
      id: `comment-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      artworkId,
      user: currentUser,
      text,
      createdAt: Date.now(),
    };

    setCommentsMap(prevMap => {
      const newMap = new Map(prevMap);
      const existingComments = newMap.get(artworkId) || [];
      newMap.set(artworkId, [...existingComments, newComment]);
      return newMap;
    });
  }, [currentUser, openAuthModal]);

  return (
    <CommentContext.Provider value={{ commentsMap, getComments, addComment }}>
      {children}
    </CommentContext.Provider>
  );
};

export const useComment = (): CommentContextType => {
  const context = useContext(CommentContext);
  if (context === undefined) {
    throw new Error('useComment must be used within a CommentProvider');
  }
  return context;
};