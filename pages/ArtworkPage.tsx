import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ArtworkDetail from '../components/ArtworkDetail';
import ArtistMoreWorks from '../components/ArtistMoreWorks';
import TagsCard from '../components/TagsCard';
import CommentsCard from '../components/CommentsCard';
import ActionCard from '../components/ActionCard';
import Spinner from '../components/Spinner';
import { MOCK_ARTWORKS } from '../constants';
import { Artwork } from '../types';
import Button from '../components/Button';
import { useAuth } from '../contexts/AuthContext';
import { useFollow } from '../contexts/FollowContext';
import { useLike } from '../contexts/LikeContext';
import { useSave } from '../contexts/SaveContext';
import { useComment } from '../contexts/CommentContext';

const ArrowLeftIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
    </svg>
);


const ArtworkPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [moreArtworks, setMoreArtworks] = useState<Artwork[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { currentUser } = useAuth();
  const { followArtist, unfollowArtist, isFollowing } = useFollow();
  const { likeArtwork, unlikeArtwork, isLiked } = useLike();
  const { saveArtwork, unsaveArtwork, isSaved } = useSave();
  const { getComments } = useComment();

  // Effect to scroll to top when component mounts or when the artwork ID changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

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
        
        // Find more artworks by the same artist
        const artistWorks = MOCK_ARTWORKS.filter(
          art => art.artist.id === foundArtwork.artist.id && art.id !== id
        ).slice(0, 9); // Limit to 9 artworks
        
        setMoreArtworks(artistWorks);
      } else {
        setError('Artwork not found. It might have slipped into another dimension.');
      }
      setIsLoading(false);
    }, 500); // Simulate network delay
  }, [id]);

  const handleFollowToggle = () => {
    if (!currentUser || !artwork) return;
    if (isFollowing(artwork.artist.id)) {
      unfollowArtist(artwork.artist.id);
    } else {
      followArtist(artwork.artist.id);
    }
  };

  const handleLikeToggle = () => {
    if (!currentUser || !id) return;
    if (isLiked(id)) {
      unlikeArtwork(id);
    } else {
      likeArtwork(id);
    }
  };

  const handleSaveToggle = () => {
    if (!currentUser || !id) return;
    if (isSaved(id)) {
      unsaveArtwork(id);
    } else {
      saveArtwork(id);
    }
  };

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

  const artworkComments = getComments(artwork.id);
  const isCurrentlyFollowing = isFollowing(artwork.artist.id);
  const isCurrentlyLiked = isLiked(artwork.id);
  const isCurrentlySaved = isSaved(artwork.id);

  return (
    <div className="space-y-6">
      <Link to="/" className="inline-flex items-center text-cyan-400 hover:text-cyan-300 transition-colors group">
          <ArrowLeftIcon className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" />
          Back to Explore
      </Link>
      
      {/* Main content column */}
      <div>
        <ArtworkDetail artwork={artwork} />
      </div>
      
      {/* Cards section - all cards in a row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tags card */}
        <div>
          <TagsCard tags={artwork.tags} />
        </div>
        
        {/* Comments card */}
        <div>
          <CommentsCard artworkId={artwork.id} comments={artworkComments} />
        </div>
        
        {/* Action buttons card */}
        <div>
          <ActionCard 
            artworkId={artwork.id}
            artist={artwork.artist}
            isFollowing={isCurrentlyFollowing}
            isLiked={isCurrentlyLiked}
            isSaved={isCurrentlySaved}
            onFollowToggle={handleFollowToggle}
            onLikeToggle={handleLikeToggle}
            onSaveToggle={handleSaveToggle}
            isLoggedIn={!!currentUser}
          />
        </div>
      </div>
      
      {/* More by artist */}
      {moreArtworks.length > 0 && (
        <div>
          <ArtistMoreWorks artist={artwork.artist} artworks={moreArtworks} />
        </div>
      )}
    </div>
  );
};

export default ArtworkPage;
