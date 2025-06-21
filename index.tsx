import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { FollowProvider } from './contexts/FollowContext';
import { LikeProvider } from './contexts/LikeContext';
import { SaveProvider } from './contexts/SaveContext';
import { CommentProvider } from './contexts/CommentContext'; // Added
import { AuthModalProvider } from './contexts/AuthModalContext';
import { HashRouter } from 'react-router-dom';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <HashRouter>
      <AuthProvider>
        <AuthModalProvider>
          <FollowProvider>
            <LikeProvider>
              <SaveProvider>
                <CommentProvider>
                  <App />
                </CommentProvider>
              </SaveProvider>
            </LikeProvider>
          </FollowProvider>
        </AuthModalProvider>
      </AuthProvider>
    </HashRouter>
  </React.StrictMode>
);