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

  // Define specific layout patterns based on the reference image
  // This creates a more precise layout matching the image provided
  const getArtworkClass = (index: number): string => {
    // Map specific indexes to specific sizes to match the reference image
    const sizeMap: Record<number, string> = {
      0: "col-span-2 row-span-2", // Green skull character (large)
      1: "col-span-1 row-span-1", // Sketch top-right
      2: "col-span-1 row-span-1", // Sketch middle-right
      3: "col-span-2 row-span-2", // Red jacket character
      4: "col-span-2 row-span-2", // Art installation
      5: "col-span-2 row-span-2", // Rock formation
      6: "col-span-2 row-span-1", // Gun model
      7: "col-span-2 row-span-2", // Vintage car
      8: "col-span-2 row-span-2", // Futuristic vehicle
      9: "col-span-2 row-span-2", // Night scene
      10: "col-span-2 row-span-2", // Red text (Bell Jar)
    };

    return sizeMap[index % 11] || "col-span-1 row-span-1"; // Default size for any other index
  };

  return (
    <div className="grid grid-cols-6 gap-3">
      {artworks.map((artwork, index) => (
        <div key={artwork.id} className={`${getArtworkClass(index)}`}>
          <ArtworkCard artwork={artwork} index={index} />
        </div>
      ))}
    </div>
  );
};

export default ArtworkGrid;
