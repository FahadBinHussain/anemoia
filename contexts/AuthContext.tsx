import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import { User } from '../types';
import { GOOGLE_CLIENT_ID } from '../config';

// Extend window interface to include google
declare global {
  interface Window {
    google: any;
  }
}

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => void;
  demoLogin: () => void; // Added for demo purposes
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USER: User = {
  id: 'demo-user-007',
  name: 'Demo Voyager',
  email: 'demo@anemoia.io',
  avatarUrl: 'https://picsum.photos/seed/demovoyager/100/100',
  givenName: 'Demo',
  familyName: 'Voyager',
  coverPhotoUrl: 'https://picsum.photos/seed/demovoyager-cover/1200/400', // Added cover photo
};

const LOCAL_STORAGE_KEY = 'google_credential';
const API_URL = 'http://localhost:4000/api';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Keep loading true initially

  // Helper to decode JWT and extract user
  const decodeCredential = (credential: string): User | null => {
    try {
      const base64Url = credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      const payload = JSON.parse(jsonPayload);
      return {
        id: payload.sub,
        name: payload.name,
        email: payload.email,
        avatarUrl: payload.picture,
        givenName: payload.given_name,
        familyName: payload.family_name,
      };
    } catch (e) {
      console.error('Failed to decode Google credential:', e);
      return null;
    }
  };

  // On mount, restore user from localStorage if present
  useEffect(() => {
    const storedCredential = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedCredential) {
      // Send the credential to the backend to verify and get user data
      fetch(`${API_URL}/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ credential: storedCredential }),
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to verify token with backend');
          }
          return response.json();
        })
        .then(data => {
          console.log("AuthContext: useEffect - Backend auth response:", data);
          if (data.user) {
            // Transform the user object to match our User type
            const user: User = {
              id: data.user.id,
              name: data.user.name,
              email: data.user.email,
              avatarUrl: data.user.avatar_url,
              givenName: data.user.given_name || undefined,
              familyName: data.user.family_name || undefined,
            };
            setCurrentUser(user);
            localStorage.setItem('auth_token', data.token); // Store the JWT from the backend
          }
        })
        .catch(error => {
          console.error("AuthContext: useEffect - Backend auth error:", error);
          localStorage.removeItem(LOCAL_STORAGE_KEY);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  // Placeholder for GSI credential response handling
  const handleCredentialResponse = useCallback((response: any) => {
    console.log("AuthContext: handleCredentialResponse - START. Credential response received.", response);
    if (response.credential) {
      localStorage.setItem(LOCAL_STORAGE_KEY, response.credential); // Persist credential
      
      // Send the credential to the backend
      fetch(`${API_URL}/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ credential: response.credential }),
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to authenticate with backend');
          }
          return response.json();
        })
        .then(data => {
          console.log("AuthContext: handleCredentialResponse - Backend auth response:", data);
          if (data.user) {
            // Transform the user object to match our User type
            const user: User = {
              id: data.user.id,
              name: data.user.name,
              email: data.user.email,
              avatarUrl: data.user.avatar_url,
              givenName: data.user.given_name || undefined,
              familyName: data.user.family_name || undefined,
            };
            setCurrentUser(user);
            localStorage.setItem('auth_token', data.token); // Store the JWT from the backend
          } else {
            setCurrentUser(null);
          }
        })
        .catch(error => {
          console.error("AuthContext: handleCredentialResponse - Backend auth error:", error);
          setCurrentUser(null);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      console.error("AuthContext: handleCredentialResponse - No credential in response.");
      setCurrentUser(null);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    console.log("AuthContext: useEffect - Initializing Google Identity Services (for rendered button).");
    if (!GOOGLE_CLIENT_ID) {
      console.error("AuthContext: useEffect - GOOGLE_CLIENT_ID is not set. Skipping GSI initialization and button rendering.");
      setIsLoading(false);
      return;
    }

    let retryCount = 0;
    const maxRetries = 30; // 3 seconds max
    const retryDelay = 100;

    const waitForGsiAndButton = (cb: () => void) => {
      if (
        window.google &&
        window.google.accounts &&
        window.google.accounts.id &&
        document.getElementById('google-signin-button')
      ) {
        cb();
      } else if (retryCount < maxRetries) {
        retryCount++;
        setTimeout(() => waitForGsiAndButton(cb), retryDelay);
      } else {
        console.error('AuthContext: GSI script or button container not found after retries.');
        setIsLoading(false);
      }
    };

    waitForGsiAndButton(() => {
      try {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
        });
        const buttonContainer = document.getElementById('google-signin-button');
        window.google.accounts.id.renderButton(
          buttonContainer,
          { type: "standard", theme: "outline", size: "large", width: "360" }
        );
        setIsLoading(false);
        console.log("AuthContext: Google Sign-In button rendered.");
      } catch (error) {
        console.error("AuthContext: Error during GSI initialization or rendering:", error);
        setIsLoading(false);
      }
    });

    return () => {
      console.log("AuthContext: useEffect - CLEANUP.");
    };
  }, [handleCredentialResponse]);

  // The 'login' function is now a placeholder as the rendered button handles the click.
  // We keep it to satisfy the AuthContextType interface.
  const login = useCallback(async () => {
      console.log("AuthContext: login - Called (via button click). GSI flow handled by rendered button.");
      // isLoading will be managed by the GSI flow and handleCredentialResponse
  }, []);


  const logout = useCallback(() => {
    console.log("AuthContext: logout - START (GSI).");
    localStorage.removeItem(LOCAL_STORAGE_KEY); // Remove credential
    localStorage.removeItem('auth_token'); // Remove backend JWT
    
    if (currentUser && currentUser.id === DEMO_USER.id) {
        setCurrentUser(null);
        setIsLoading(false);
        console.log("AuthContext: logout - Demo user signed out.");
        return;
    }

    if (window.google && window.google.accounts && window.google.accounts.id) {
        console.log("AuthContext: logout - Calling google.accounts.id.disableAutoSelect().");
        window.google.accounts.id.disableAutoSelect();
        setCurrentUser(null);
        setIsLoading(false);
        console.log("AuthContext: logout - Google user signed out (GSI).");
    } else {
        console.warn("AuthContext: logout - Google Identity Services not available. Cannot perform GSI logout.");
        setCurrentUser(null);
        setIsLoading(false);
    }
  }, [currentUser]);

  const demoLogin = useCallback(() => {
    console.log("AuthContext: demoLogin - START");
    setCurrentUser(DEMO_USER);
    setIsLoading(false);
    console.log("AuthContext: demoLogin - Demo user set. currentUser:", DEMO_USER);
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, isLoading, login, logout, demoLogin }}>
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