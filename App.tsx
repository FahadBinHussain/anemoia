import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ArtworkPage from './pages/ArtworkPage';
import { useAuth } from './contexts/AuthContext';
import { useAuthModal } from './contexts/AuthModalContext';
import UploadPage from './pages/UploadPage'; 
import ProfilePage from './pages/ProfilePage';
import ScrollToTop from './components/ScrollToTop';
import ScrollToTopButton from './components/ScrollToTopButton';
import AuthModal from './components/AuthModal';

const App: React.FC = () => {
  const { currentUser } = useAuth();
  const { isAuthModalOpen, closeAuthModal, openAuthModal } = useAuthModal();
  const location = useLocation();
  
  // Check if we're on the artwork detail page
  const isArtworkPage = location.pathname.startsWith('/artwork/');

  // Handle protected routes that require authentication
  const ProtectedRoute: React.FC<{element: React.ReactNode}> = ({ element }) => {
    if (currentUser) {
      return <>{element}</>;
    }
    
    // If not authenticated, show auth modal and render nothing until authenticated
    openAuthModal();
    return null;
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      <ScrollToTop />
      
      {/* Show header on all pages */}
      <Header />
      
      <main className={`flex-grow ${isArtworkPage ? '' : 'container mx-auto px-2 py-4'}`}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/artwork/:id" element={<ArtworkPage />} />
          {/* Unified profile route */}
          <Route path="/profile" element={
            <ProtectedRoute element={<ProfilePage />} />
          } /> 
          <Route path="/profile/:profileId" element={<ProfilePage />} />
          <Route path="/upload" element={
            <ProtectedRoute element={<UploadPage />} />
          } />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      
      {/* Only show footer on non-artwork pages */}
      {!isArtworkPage && <Footer />}
      
      {/* Only show scroll-to-top button on non-artwork pages */}
      {!isArtworkPage && <ScrollToTopButton />}

      {/* Auth modal for protected routes */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={closeAuthModal} 
      />
    </div>
  );
};

export default App;