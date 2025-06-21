import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
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

const CloseIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

// This component will be rendered directly in the App.tsx layout without the footer
const ArtworkPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [moreArtworks, setMoreArtworks] = useState<Artwork[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [headerHeight, setHeaderHeight] = useState(0);
  
  const { currentUser } = useAuth();
  const { followArtist, unfollowArtist, isFollowing } = useFollow();
  const { likeArtwork, unlikeArtwork, isLiked } = useLike();
  const { saveArtwork, unsaveArtwork, isSaved } = useSave();
  const { getComments } = useComment();

  // Effect to scroll to top when component mounts or when the artwork ID changes
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Hide the footer when viewing artwork page
    document.body.classList.add('artwork-detail-page');
    
    // Get header height to adjust layout
    const header = document.querySelector('header');
    if (header) {
      setHeaderHeight(header.offsetHeight);
    }
    
    return () => {
      // Restore normal layout when leaving the page
      document.body.classList.remove('artwork-detail-page');
    };
  }, [id]);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    // Simulate API call to fetch a single artwork.
    setTimeout(() => {
      const foundArtwork = MOCK_ARTWORKS.find(art => art.id === id);
      if (foundArtwork) {
        setArtwork(foundArtwork);
        
        // Find more artworks by the same artist
        const artistWorks = MOCK_ARTWORKS.filter(
          art => art.artist.id === foundArtwork.artist.id && art.id !== id
        ).slice(0, 6); // Limit to 6 artworks for the sidebar
        
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
      <div className="flex flex-col items-center justify-center min-h-screen">
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
    <div className="min-h-screen bg-black w-full" style={{ paddingTop: `${headerHeight}px` }}>
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Left column - Fixed artwork */}
        <div className="lg:w-3/5 lg:fixed lg:top-0 lg:left-0 lg:pt-[64px] lg:h-screen flex items-center justify-center p-4 bg-black">
          <div className="max-w-full max-h-full">
            <img 
              src={artwork.imageUrl.replace('/600/400', '/1200/800')} 
              alt={artwork.title} 
              className="max-h-[80vh] object-contain mx-auto"
            />
          </div>
          
          {/* Caption below image on mobile only */}
          <div className="lg:hidden mt-4 text-center">
            <p className="text-slate-400">{artwork.title}</p>
          </div>
        </div>
        
        {/* Right column - Content that flows with the page */}
        <div className="lg:w-2/5 lg:ml-auto bg-[#1a1a1a] text-white relative min-h-screen">
          {/* Back button - visible on mobile only */}
          <div className="lg:hidden absolute top-4 right-4 z-10">
            <Link to="/" className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 transition-colors">
              <ArrowLeftIcon className="w-5 h-5" />
            </Link>
          </div>
          
          <div className="p-8">
            {/* Artist info header */}
            <div className="flex items-center mb-6">
              <img 
                src={artwork.artist.avatarUrl} 
                alt={artwork.artist.name} 
                className="w-12 h-12 rounded-full border-2 border-pink-500 mr-4"
              />
              <div>
                <h2 className="text-xl font-bold">{artwork.artist.name}</h2>
                <p className="text-slate-400">Aviation AI Artist, Aviation geek</p>
              </div>
              <div className="ml-auto">
                <Button
                  onClick={handleFollowToggle}
                  variant={isCurrentlyFollowing ? "primary" : "outline"}
                  size="sm"
                  className={`${isCurrentlyFollowing ? '' : 'border-white text-white hover:bg-white hover:text-black'}`}
                >
                  {isCurrentlyFollowing ? 'Following' : 'Follow'}
                </Button>
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="flex space-x-2 mb-8">
              <Button
                onClick={handleLikeToggle}
                variant={isCurrentlyLiked ? "secondary" : "outline"}
                size="lg"
                className="flex-1 flex justify-center items-center"
                leftIcon={
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={isCurrentlyLiked ? "currentColor" : "none"} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                }
              >
                Like
              </Button>
              
              <Button
                onClick={handleSaveToggle}
                variant={isCurrentlySaved ? "primary" : "outline"}
                size="lg"
                className="flex-1 flex justify-center items-center"
                leftIcon={
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={isCurrentlySaved ? "currentColor" : "none"} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                  </svg>
                }
              >
                Save
              </Button>
            </div>
            
            {/* Artwork title and description */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold mb-2">{artwork.title}</h1>
              <p className="text-slate-300 mb-2">{artwork.description}</p>
              <p className="text-slate-400 text-sm">Posted {new Date(artwork.createdAt).toLocaleDateString()}</p>
            </div>
            
            {/* Stats */}
            <div className="flex space-x-8 mb-8 text-slate-300">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2 text-slate-400">
                  <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.218l-.022.012-.007.004-.004.001a.752.752 0 01-.704 0l-.004-.001z" />
                </svg>
                <span>{artwork.likes || 1}</span>
              </div>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2 text-slate-400">
                  <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                  <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" clipRule="evenodd" />
                </svg>
                <span>{artwork.views || 5}</span>
              </div>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 text-slate-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-3.86 8.25-8.625 8.25a9.75 9.75 0 01-4.372-.992L3 21l3.352-1.775A9.721 9.721 0 012.25 12c0-4.556 3.86-8.25 8.625-8.25S21 7.444 21 12z" />
                </svg>
                <span>{artworkComments.length || 0}</span>
              </div>
            </div>
            
            {/* Comment section */}
            <div className="mb-8">
              <h3 className="text-lg font-bold mb-4">SIGN IN TO COMMENT!</h3>
              <div className="bg-[#222] rounded-lg p-4 flex">
                <input 
                  type="text" 
                  placeholder="Add a comment" 
                  className="flex-grow bg-transparent border-none outline-none text-white"
                  disabled={!currentUser}
                />
                <button 
                  className="ml-2 bg-blue-500 text-white px-4 py-1 rounded-md"
                  disabled={!currentUser}
                >
                  &gt;
                </button>
              </div>
            </div>
            
            {/* Tags */}
            {artwork.tags && artwork.tags.length > 0 && (
              <div className="mb-8">
                <div className="flex flex-wrap gap-2">
                  {artwork.tags.map(tag => (
                    <span 
                      key={tag} 
                      className="px-3 py-1 text-sm bg-[#333] text-white rounded-full hover:bg-[#444] transition-colors cursor-pointer"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* More by artist */}
            {moreArtworks.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-bold mb-4">More by {artwork.artist.name}</h3>
                <div className="grid grid-cols-3 gap-2">
                  {moreArtworks.slice(0, 6).map(art => (
                    <Link 
                      key={art.id} 
                      to={`/artwork/${art.id}`}
                      className="block aspect-square rounded-md overflow-hidden"
                    >
                      <img 
                        src={art.imageUrl} 
                        alt={art.title} 
                        className="w-full h-full object-cover"
                      />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtworkPage;
