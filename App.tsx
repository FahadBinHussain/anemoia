import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ArtworkPage from './pages/ArtworkPage';
import LoginPage from './pages/LoginPage';
import { useAuth } from './contexts/AuthContext';
import UploadPage from './pages/UploadPage'; 
import ProfilePage from './pages/ProfilePage'; // Changed
import ScrollToTop from './components/ScrollToTop';
import ScrollToTopButton from './components/ScrollToTopButton';

const App: React.FC = () => {
  const { currentUser } = useAuth();
  const location = useLocation();
  
  // Check if we're on the artwork detail page
  const isArtworkPage = location.pathname.startsWith('/artwork/');

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
          <Route path="/profile" element={<ProfilePage />} /> 
          <Route path="/profile/:profileId" element={<ProfilePage />} />
          <Route path="/login" element={currentUser ? <Navigate to="/profile" /> : <LoginPage />} />
          <Route path="/upload" element={currentUser ? <UploadPage /> : <Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      
      {/* Only show footer on non-artwork pages */}
      {!isArtworkPage && <Footer />}
      
      {/* Only show scroll-to-top button on non-artwork pages */}
      {!isArtworkPage && <ScrollToTopButton />}
    </div>
  );
};

export default App;