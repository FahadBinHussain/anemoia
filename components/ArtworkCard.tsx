
import React from 'react';
import { Link } from 'react-router-dom';
import { Artwork } from '../types';

interface ArtworkCardProps {
  artwork: Artwork;
  index: number;
}

const EyeIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-4 h-4"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const HeartIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-4 h-4"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
  </svg>
);


const ArtworkCard: React.FC<ArtworkCardProps> = ({ artwork, index }) => {
  const glowClass = index % 2 === 0 ? 'card-glow-cyan' : 'card-glow-pink';

  return (
    <Link to={`/artwork/${artwork.id}`} className={`group block bg-slate-800 rounded-lg overflow-hidden shadow-lg transition-all duration-300 ease-in-out hover:shadow-2xl transform hover:-translate-y-1 ${glowClass} border border-slate-700 hover:border-transparent`}>
      <div className="relative aspect-[4/3] overflow-hidden">
        <img 
          src={artwork.imageUrl} 
          alt={artwork.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
           <h3 className="text-lg font-semibold text-white drop-shadow-md">{artwork.title}</h3>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center space-x-2 mb-2">
          <img 
            src={artwork.artist.avatarUrl} 
            alt={artwork.artist.name} 
            className="w-8 h-8 rounded-full border-2 border-pink-500/70 group-hover:border-pink-500 transition-colors"
          />
          <span className="text-sm text-slate-300 group-hover:text-cyan-400 transition-colors">{artwork.artist.name}</span>
        </div>
        <div className="flex items-center justify-between text-xs text-slate-400 mt-1">
          {artwork.views && (
            <div className="flex items-center space-x-1">
              <EyeIcon className="w-4 h-4 text-cyan-500/70 group-hover:text-cyan-400 transition-colors" />
              <span>{artwork.views.toLocaleString()}</span>
            </div>
          )}
          {artwork.likes && (
            <div className="flex items-center space-x-1">
              <HeartIcon className="w-4 h-4 text-pink-500/70 group-hover:text-pink-500 transition-colors" />
              <span>{artwork.likes.toLocaleString()}</span>
            </div>
          )}
        </div>

      </div>
    </Link>
  );
};

export default ArtworkCard;
