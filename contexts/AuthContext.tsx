
import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { User } from '../types';

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const login = useCallback(async () => {
    setIsLoading(true);
    // Simulate API call for Google Sign-In
    await new Promise(resolve => setTimeout(resolve, 1000));
    setCurrentUser({
      id: 'mock-user-123',
      name: 'Neon Voyager',
      email: 'voyager@anemoia.art',
      avatarUrl: 'https://picsum.photos/seed/useravatar/100/100'
    });
    setIsLoading(false);
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
