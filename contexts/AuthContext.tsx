
import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect, useRef } from 'react';
import { User } from '../types';
import { GOOGLE_CLIENT_ID } from '../config';

// Extend window interface to include gapi and our custom callback/flag
declare global {
  interface Window {
    gapi: any;
    onGapiLoadCallback: (() => void) | null;
    gapiIsReady: boolean;
  }
}

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean; // True while gapi is loading or auth state is being determined
  isGapiLoaded: boolean; // True once gapi.auth2 is initialized
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
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isGapiLoaded, setIsGapiLoaded] = useState<boolean>(false);
  const gapiAuth2LoadInitiated = useRef(false);

  const updateSigninStatus = useCallback((isSignedIn: boolean) => {
    console.log("AuthContext: updateSigninStatus called. isSignedIn:", isSignedIn);
    if (isSignedIn) {
      const googleUser = window.gapi.auth2.getAuthInstance().currentUser.get();
      const profile = googleUser.getBasicProfile();
      setCurrentUser({
        id: profile.getId(),
        name: profile.getName(),
        email: profile.getEmail(),
        avatarUrl: profile.getImageUrl(),
        givenName: profile.getGivenName(),
        familyName: profile.getFamilyName(),
        // Note: Google Sign-In basic profile doesn't provide a cover photo.
        // This would need to come from a different source or be a default.
        // For now, it will be undefined for real Google users unless explicitly set elsewhere.
      });
      console.log("AuthContext: User is signed IN. currentUser updated.");
    } else {
      setCurrentUser(null);
      console.log("AuthContext: User is signed OUT. currentUser nulled.");
    }
    setIsLoading(false);
    console.log("AuthContext: updateSigninStatus finished. isLoading SET to false.");
  }, []);

  const initClient = useCallback(() => {
    console.log("AuthContext: initClient - START");
    if (!window.gapi || !window.gapi.auth2) {
        console.error("AuthContext: initClient - ERROR: gapi.auth2 not available.");
        setIsGapiLoaded(false);
        setIsLoading(false);
        console.log("AuthContext: initClient - gapi.auth2 not available. isLoading SET to false.");
        return;
    }

    try {
      console.log("AuthContext: initClient - Preparing to call gapi.auth2.init(). Client ID:", GOOGLE_CLIENT_ID);
      const initPromise = window.gapi.auth2.init({
        client_id: GOOGLE_CLIENT_ID,
        scope: 'profile email',
      });
      console.log("AuthContext: initClient - gapi.auth2.init() called, awaiting promise.");

      initPromise.then(() => {
        console.log("AuthContext: initClient - gapi.auth2.init() SUCCEEDED.");
        setIsGapiLoaded(true);
        const authInstance = window.gapi.auth2.getAuthInstance();
        if (!authInstance) {
          console.error("AuthContext: initClient - FATAL: authInstance is null after successful init.");
          setIsGapiLoaded(false);
          setIsLoading(false);
          return;
        }
        console.log("AuthContext: initClient - Registering isSignedIn listener.");
        authInstance.isSignedIn.listen(updateSigninStatus);
        console.log("AuthContext: initClient - Checking initial isSignedIn status.");
        updateSigninStatus(authInstance.isSignedIn.get());
      }).catch((error: any) => {
        console.error("AuthContext: initClient - gapi.auth2.init() PROMISE REJECTED:", error);
        setIsGapiLoaded(false);
        setIsLoading(false);
        console.log("AuthContext: initClient - gapi.auth2.init() promise rejected. isLoading SET to false.");
      });
    } catch (syncError: any) { // 여기가 수정된 부분입니다.
      console.error("AuthContext: initClient - SYNCHRONOUS error during gapi.auth2.init() call attempt:", syncError);
      setIsGapiLoaded(false);
      setIsLoading(false);
      console.log("AuthContext: initClient - gapi.auth2.init() synchronous error. isLoading SET to false.");
    }
  }, [updateSigninStatus]);

  const attemptGapiAuth2LoadAndInit = useCallback(() => {
    console.log("AuthContext: attemptGapiAuth2LoadAndInit - START. gapiAuth2LoadInitiated.current:", gapiAuth2LoadInitiated.current);

    if (gapiAuth2LoadInitiated.current) {
      console.log("AuthContext: attemptGapiAuth2LoadAndInit - Already initiated, skipping.");
      return;
    }

    if (window.gapi && typeof window.gapi.load === 'function') {
      console.log("AuthContext: attemptGapiAuth2LoadAndInit - gapi.load is available. Setting isLoading to true (if not already).");
      setIsLoading(true);
      gapiAuth2LoadInitiated.current = true;
      console.log("AuthContext: attemptGapiAuth2LoadAndInit - Calling gapi.load('auth2')...");

      window.gapi.load('auth2', {
        callback: () => {
          console.log("AuthContext: attemptGapiAuth2LoadAndInit - gapi.load('auth2') CALLBACK received.");
          initClient();
        },
        onerror: (error: any) => {
          console.error("AuthContext: attemptGapiAuth2LoadAndInit - gapi.load('auth2') ONERROR:", error);
          setIsGapiLoaded(false);
          setIsLoading(false);
          console.log("AuthContext: attemptGapiAuth2LoadAndInit - gapi.load('auth2') error. isLoading SET to false.");
        }
      });
    } else {
      console.error("AuthContext: attemptGapiAuth2LoadAndInit - ERROR: window.gapi or window.gapi.load not available.");
      setIsLoading(false);
      setIsGapiLoaded(false);
      console.log("AuthContext: attemptGapiAuth2LoadAndInit - gapi or gapi.load not available. isLoading SET to false.");
    }
  }, [initClient]);

  useEffect(() => {
    console.log("AuthContext: useEffect - START. window.gapiIsReady:", window.gapiIsReady);
    if (window.gapiIsReady) {
      console.log("AuthContext: useEffect - gapi.js is already ready, calling attemptGapiAuth2LoadAndInit.");
      attemptGapiAuth2LoadAndInit();
    } else {
      console.log("AuthContext: useEffect - gapi.js not ready, setting window.onGapiLoadCallback.");
      window.onGapiLoadCallback = attemptGapiAuth2LoadAndInit;
    }

    return () => {
      console.log("AuthContext: useEffect - CLEANUP. Clearing onGapiLoadCallback if it was ours.");
      if (window.onGapiLoadCallback === attemptGapiAuth2LoadAndInit) {
        window.onGapiLoadCallback = null;
      }
    };
  }, [attemptGapiAuth2LoadAndInit]);

  const login = useCallback(async () => {
    console.log("AuthContext: login - START. isGapiLoaded:", isGapiLoaded);
    if (!isGapiLoaded || !window.gapi || !window.gapi.auth2 || !window.gapi.auth2.getAuthInstance()) {
      console.warn("AuthContext: login - Google API (auth2) not loaded/initialized or authInstance not available. Cannot sign in.");
      return;
    }
    console.log("AuthContext: login - Setting isLoading to true and calling signIn().");
    setIsLoading(true);
    try {
      await window.gapi.auth2.getAuthInstance().signIn();
      console.log("AuthContext: login - signIn() promise resolved. Listener should update state.");
    } catch (error: any) {
      console.error("AuthContext: login - Error during Google Sign-In:", error);
      const authInstance = window.gapi.auth2.getAuthInstance();
      if (authInstance) {
         updateSigninStatus(authInstance.isSignedIn.get());
      } else {
        setIsLoading(false);
      }
      console.log("AuthContext: login - signIn() error. isLoading might have been reset by updateSigninStatus or directly.");
    }
  }, [isGapiLoaded, updateSigninStatus]);

  const logout = useCallback(() => {
    console.log("AuthContext: logout - START. isGapiLoaded:", isGapiLoaded);
    // If it was a demo user, just clear them without gapi involvement
    if (currentUser && currentUser.id === DEMO_USER.id) {
        setCurrentUser(null);
        setIsLoading(false); // Ensure loading is false
        console.log("AuthContext: logout - Demo user signed out.");
        return;
    }

    if (!isGapiLoaded || !window.gapi || !window.gapi.auth2 || !window.gapi.auth2.getAuthInstance()) {
      console.warn("AuthContext: logout - Google API (auth2) not loaded/initialized or authInstance not available. Cannot sign out.");
      if (currentUser !== null || isLoading) updateSigninStatus(false);
      return;
    }
    const authInstance = window.gapi.auth2.getAuthInstance();
    if (authInstance) {
        console.log("AuthContext: logout - Calling signOut().");
        authInstance.signOut().then(() => {
            console.log("AuthContext: logout - signOut() successful. Listener should update state.");
            // updateSigninStatus will be called by the listener
        }).catch((error: any) => {
            console.error("AuthContext: logout - Error during Google Sign-Out:", error);
            if (currentUser !== null || isLoading) updateSigninStatus(false);
        });
    } else {
        console.warn("AuthContext: logout - authInstance not found. Forcing state update.");
        if (currentUser !== null || isLoading) updateSigninStatus(false);
    }
  }, [isGapiLoaded, updateSigninStatus, currentUser, isLoading]);

  const demoLogin = useCallback(() => {
    console.log("AuthContext: demoLogin - START");
    setCurrentUser(DEMO_USER);
    setIsGapiLoaded(true); // Simulate GAPI being ready for demo user
    setIsLoading(false);
    console.log("AuthContext: demoLogin - Demo user set. currentUser:", DEMO_USER);
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, isLoading, isGapiLoaded, login, logout, demoLogin }}>
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