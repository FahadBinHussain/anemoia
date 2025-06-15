
import React from 'react';
import { Link } from 'react-router-dom';
import { Artist, Artwork, User } from '../types';
import Button from './Button';
import LowPolyBackground from './LowPolyBackground';

// Icons - Copied from ArtworkDetail or define globally
const UserPlusIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
  </svg>
);

const UserCheckIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2m8-10.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
  </svg>
);


interface ArtistHoverCardProps {
  artist: Artist;
  otherArtworks: Artwork[];
  isFollowing: boolean;
  onFollowToggle: () => void;
  currentUser: User | null;
  className?: string;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const ArtistHoverCard: React.FC<ArtistHoverCardProps> = ({
  artist,
  otherArtworks,
  isFollowing,
  onFollowToggle,
  currentUser,
  className,
  onMouseEnter,
  onMouseLeave,
}) => {
  return (
    <div
      className={`bg-slate-800 rounded-lg shadow-xl border border-slate-700 overflow-hidden ${className || ''}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      aria-live="polite"
      role="tooltip"
    >
      <div 
        className="relative h-20 bg-slate-700"
        style={artist.coverPhotoUrl ? { backgroundImage: `url(${artist.coverPhotoUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
      >
        {!artist.coverPhotoUrl && <LowPolyBackground />}
        {artist.coverPhotoUrl && <div className="absolute inset-0 bg-black/30"></div>} {/* Scrim for text readability */}
      </div>
      
      <div className="relative p-4 text-center">
        <Link to={`/profile/${artist.id}`} className="block -mt-12 mb-2 z-10 relative"> {/* Ensure avatar is above scrim if any overlap */}
          <img
            src={artist.avatarUrl}
            alt={artist.name}
            className="w-20 h-20 rounded-full border-4 border-slate-800 mx-auto shadow-lg hover:opacity-90 transition-opacity"
          />
        </Link>
        <Link to={`/profile/${artist.id}`} className="relative z-10">
            <h3 className="text-xl font-semibold text-slate-100 hover:text-cyan-400 transition-colors">{artist.name}</h3>
        </Link>
        <p className="text-sm text-slate-400 mb-3 relative z-10">Concept Artist / Illustrator</p>

        {/* The follow button here might be interacting with ArtworkDetail's follow logic. 
            If the main profile page handles follow, this could be simplified or removed if it causes conflicts.
            For now, assume it's part of the hover card's independent functionality.
        */}
        {currentUser && currentUser.id !== artist.id ? (
          <Button
            onClick={onFollowToggle}
            variant={isFollowing ? 'primary' : 'outline'}
            size="sm"
            leftIcon={isFollowing ? <UserCheckIcon className="w-4 h-4" /> : <UserPlusIcon className="w-4 h-4" />}
            className={`w-full max-w-[150px] mx-auto relative z-10 ${isFollowing ? '' : 'text-cyan-400 border-cyan-500 hover:bg-cyan-500 hover:text-slate-900'}`}
          >
            {isFollowing ? 'Following' : 'Follow'}
          </Button>
        ) : !currentUser ? (
          <Button
            variant="outline"
            size="sm"
            disabled
            title="Login to follow"
            leftIcon={<UserPlusIcon className="w-4 h-4" />}
            className="w-full max-w-[150px] mx-auto text-slate-500 border-slate-600 cursor-not-allowed relative z-10"
          >
            Follow
          </Button>
        ) : null}
      </div>

      {otherArtworks.length > 0 && (
        <div className="px-4 pb-4 pt-2 border-t border-slate-700/50">
          <p className="text-xs text-slate-500 mb-2 text-center">More from {artist.name}</p>
          <div className="grid grid-cols-3 gap-2">
            {otherArtworks.map(artwork => (
              <Link key={artwork.id} to={`/artwork/${artwork.id}`} className="block aspect-square rounded overflow-hidden group">
                <img
                  src={artwork.imageUrl}
                  alt={artwork.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  loading="lazy"
                />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtistHoverCard;