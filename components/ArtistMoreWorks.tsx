import React from 'react';
import { Link } from 'react-router-dom';
import { Artist, Artwork } from '../types';

interface ArtistMoreWorksProps {
  artist: Artist;
  artworks: Artwork[];
}

const ArtistMoreWorks: React.FC<ArtistMoreWorksProps> = ({ artist, artworks }) => {
  if (!artworks || artworks.length === 0) {
    return null;
  }

  return (
    <div className="bg-slate-900 rounded-lg overflow-hidden border border-slate-800 shadow-lg">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-medium text-slate-200">More by {artist.name}</h3>
          <Link 
            to={`/profile/${artist.id}`} 
            className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            View all
          </Link>
        </div>
        
        <div className="grid grid-cols-3 gap-2">
          {artworks.map((artwork) => (
            <Link 
              key={artwork.id} 
              to={`/artwork/${artwork.id}`}
              className="block aspect-square rounded-md overflow-hidden hover:opacity-80 transition-opacity"
            >
              <img 
                src={artwork.imageUrl} 
                alt={artwork.title} 
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArtistMoreWorks; 