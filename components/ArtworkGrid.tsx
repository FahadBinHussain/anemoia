import React from 'react';
import { Artwork } from '../types';
import ArtworkCard from './ArtworkCard';
import Spinner from './Spinner';

interface ArtworkGridProps {
  artworks: Artwork[];
  isLoading?: boolean;
}

const ArtworkGrid: React.FC<ArtworkGridProps> = ({ artworks, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!artworks || artworks.length === 0) {
    return <p className="text-center text-slate-400 text-xl py-10">No artworks found. The void is empty... for now.</p>;
  }

  // Determine which artworks should be featured (larger size)
  // For this example, we'll make every 3rd and 7th artwork larger
  const getArtworkClass = (index: number): string => {
    // Artwork size classes
    if (index % 10 === 0) return "col-span-2 row-span-2"; // Extra large
    if (index % 5 === 0) return "col-span-2"; // Wide
    if (index % 7 === 0) return "row-span-2"; // Tall
    return ""; // Regular size
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 auto-rows-min">
      {artworks.map((artwork, index) => (
        <div key={artwork.id} className={`${getArtworkClass(index)}`}>
          <ArtworkCard artwork={artwork} index={index} />
        </div>
      ))}
    </div>
  );
};

export default ArtworkGrid;
