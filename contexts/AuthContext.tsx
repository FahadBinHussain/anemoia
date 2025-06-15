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

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Keep loading true initially

  // Placeholder for GSI credential response handling
  const handleCredentialResponse = useCallback((response: any) => {
    console.log("AuthContext: handleCredentialResponse - START. Credential response received.", response);
    if (response.credential) {
      // Decode the JWT and set user
      const base64Url = response.credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      const payload = JSON.parse(jsonPayload);
      console.log("AuthContext: handleCredentialResponse - Decoded JWT payload:", payload);

      const user: User = {
        id: payload.sub,
        name: payload.name,
        email: payload.email,
        avatarUrl: payload.picture,
        givenName: payload.given_name,
        familyName: payload.family_name,
      };

      setCurrentUser(user);
      console.log("AuthContext: handleCredentialResponse - currentUser set:", user);

    } else {
      console.error("AuthContext: handleCredentialResponse - No credential in response.");
      setCurrentUser(null);
    }
    setIsLoading(false); // Authentication state determined
    console.log("AuthContext: handleCredentialResponse - isLoading SET to false.");
  }, []);

  useEffect(() => {
    console.log("AuthContext: useEffect - Initializing Google Identity Services (for rendered button).");
    if (!GOOGLE_CLIENT_ID) {
      console.error("AuthContext: useEffect - GOOGLE_CLIENT_ID is not set. Skipping GSI initialization and button rendering.");
      setIsLoading(false);
      return;
    }

    const initializeAndRenderButton = () => {
      if (window.google && window.google.accounts && window.google.accounts.id) {
        console.log("AuthContext: useEffect - google.accounts.id is available. Initializing and rendering button...");
        try {
          window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleCredentialResponse,
          });
          console.log("AuthContext: useEffect - GSI initialization complete.");

          const buttonContainer = document.getElementById('google-signin-button');
          if (buttonContainer) {
            console.log("AuthContext: useEffect - Button container found, rendering button.");
            window.google.accounts.id.renderButton(
              buttonContainer,
              { type: "standard", theme: "outline", size: "large", width: "360" } // Customization options
            );
            console.log("AuthContext: useEffect - Google Sign-In button rendered.");
            setIsLoading(false); // Initialization and rendering complete
          } else {
            console.warn("AuthContext: useEffect - Button container #google-signin-button not found.");
            // Keep isLoading true, maybe the element isn't in the DOM yet.
            // A more robust solution might wait for the element.
             setIsLoading(false); // Set to false to not block the page if container is missing
          }

        } catch (error) {
          console.error("AuthContext: useEffect - Error during GSI initialization or rendering:", error);
          setIsLoading(false); // Initialization/rendering failed
        }
      } else {
        console.warn("AuthContext: useEffect - google.accounts.id not available when effect ran. GSI script might not be loaded yet. Retrying...");
        // If the script isn't ready, wait a bit and try again.
        setTimeout(initializeAndRenderButton, 100);
      }
    };

    initializeAndRenderButton(); // Initial call

    return () => {
      console.log("AuthContext: useEffect - CLEANUP.");
      // No explicit cleanup needed for google.accounts.id.initialize or renderButton
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