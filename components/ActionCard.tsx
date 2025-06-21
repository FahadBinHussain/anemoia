import React from 'react';
import Button from './Button';
import { Artist } from '../types';

interface ActionCardProps {
  artworkId: string;
  artist: Artist;
  isFollowing?: boolean;
  isLiked?: boolean;
  isSaved?: boolean;
  onFollowToggle?: () => void;
  onLikeToggle?: () => void;
  onSaveToggle?: () => void;
  isLoggedIn: boolean;
}

const UserPlusIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
  </svg>
);

const HeartIcon: React.FC<{className?: string, filled?: boolean}> = ({ className, filled }) => {
  if (filled) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || "w-5 h-5"}>
        <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.218l-.022.012-.007.004-.004.001a.752.752 0 01-.704 0l-.004-.001z" />
      </svg>
    );
  }
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
  );
};

const BookmarkIcon: React.FC<{className?: string, filled?: boolean}> = ({ className, filled }) => {
  if (filled) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || "w-5 h-5"}>
        <path fillRule="evenodd" d="M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21L12 17.25 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93z" clipRule="evenodd" />
      </svg>
    );
  }
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
    </svg>
  );
};

const HandIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z" />
  </svg>
);

const ActionCard: React.FC<ActionCardProps> = ({ 
  artist, 
  isFollowing = false, 
  isLiked = false, 
  isSaved = false, 
  onFollowToggle, 
  onLikeToggle, 
  onSaveToggle,
  isLoggedIn
}) => {
  return (
    <div className="bg-slate-900 rounded-lg overflow-hidden border border-slate-800 shadow-lg">
      <div className="p-4">
        <div className="flex items-center mb-3 text-slate-200">
          <HandIcon className="w-5 h-5 text-pink-400 mr-2 shrink-0"/>
          <h3 className="text-lg font-medium">Interact</h3>
        </div>
        <div className="flex flex-col space-y-2">
          <Button
            onClick={onFollowToggle}
            variant={isFollowing ? "primary" : "outline"}
            disabled={!isLoggedIn}
            leftIcon={<UserPlusIcon />}
            className={`w-full ${isFollowing ? '' : 'text-cyan-400 border-cyan-500 hover:bg-cyan-500 hover:text-slate-900'} ${!isLoggedIn ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            {isFollowing ? 'Following' : 'Follow'} {artist.name}
          </Button>
          
          <Button
            onClick={onLikeToggle}
            variant={isLiked ? "secondary" : "outline"}
            disabled={!isLoggedIn}
            leftIcon={<HeartIcon filled={isLiked} />}
            className={`w-full ${isLiked ? 'bg-pink-500 text-white' : 'text-pink-400 border-pink-500 hover:bg-pink-500 hover:text-slate-900'} ${!isLoggedIn ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            {isLiked ? 'Liked' : 'Like'} Artwork
          </Button>
          
          <Button
            onClick={onSaveToggle}
            variant={isSaved ? "primary" : "outline"}
            disabled={!isLoggedIn}
            leftIcon={<BookmarkIcon filled={isSaved} />}
            className={`w-full ${isSaved ? 'bg-teal-500 text-white' : 'text-teal-400 border-teal-500 hover:bg-teal-500 hover:text-slate-900'} ${!isLoggedIn ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            {isSaved ? 'Saved' : 'Save'} Artwork
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ActionCard; 