import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ArtworkPage from './pages/ArtworkPage';
import LoginPage from './pages/LoginPage';
import { useAuth } from './contexts/AuthContext';
import UploadPage from './pages/UploadPage'; 
import ProfilePage from './pages/ProfilePage'; // Changed
import ScrollToTop from './components/ScrollToTop';

const App: React.FC = () => {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      <ScrollToTop />
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
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
      <Footer />
    </div>
  );
};

export default App;