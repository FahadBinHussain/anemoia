import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { FollowProvider } from './contexts/FollowContext';
import { LikeProvider } from './contexts/LikeContext';
import { SaveProvider } from './contexts/SaveContext';
import { CommentProvider } from './contexts/CommentContext'; // Added
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
        <FollowProvider>
          <LikeProvider>
            <SaveProvider>
              <CommentProvider> {/* Added */}
                <App />
              </CommentProvider> {/* Added */}
            </SaveProvider>
          </LikeProvider>
        </FollowProvider>
      </AuthProvider>
    </HashRouter>
  </React.StrictMode>
);