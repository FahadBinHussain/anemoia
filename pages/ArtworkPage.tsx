
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ArtworkDetail from '../components/ArtworkDetail';
import Spinner from '../components/Spinner';
import { MOCK_ARTWORKS } from '../constants';
import { Artwork } from '../types';
import Button from '../components/Button';

const ArrowLeftIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
    </svg>
);


const ArtworkPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    // Simulate API call to fetch a single artwork.
    // In a real application, this would be an API call to your backend,
    // e.g., /api/artworks/{id}, which would then query your Neon PostgreSQL database.
    setTimeout(() => {
      const foundArtwork = MOCK_ARTWORKS.find(art => art.id === id); // Replace with API response
      if (foundArtwork) {
        setArtwork(foundArtwork);
      } else {
        setError('Artwork not found. It might have slipped into another dimension.');
      }
      setIsLoading(false);
    }, 500); // Simulate network delay
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <Spinner size="xl" />
        <p className="mt-4 text-xl text-slate-300">Loading digital essence...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-2xl text-pink-500 mb-4">{error}</p>
        <Button variant="primary" size="lg" onClick={() => window.history.back()}>
          Return to Reality
        </Button>
      </div>
    );
  }

  if (!artwork) {
    // Should be caught by error state, but as a fallback
    return <p className="text-center text-xl text-slate-400">Artwork data seems to be corrupted.</p>;
  }

  return (
    <div className="space-y-8">
        <Link to="/" className="inline-flex items-center text-cyan-400 hover:text-cyan-300 transition-colors group">
            <ArrowLeftIcon className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" />
            Back to Explore
        </Link>
        <ArtworkDetail artwork={artwork} />
    </div>
  );
};

export default ArtworkPage;
