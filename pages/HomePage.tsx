import React, { useState, useEffect } from 'react';
import ArtworkGrid from '../components/ArtworkGrid';
import { MOCK_ARTWORKS } from '../constants';
import { Artwork } from '../types';
import Button from '../components/Button';

const FilterIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
    </svg>
);


const HomePage: React.FC = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Simulate API call to fetch artworks.
    // In a real application, this would be an API call to your backend,
    // which would then query your Neon PostgreSQL database.
    setIsLoading(true);
    setTimeout(() => {
      // Replace MOCK_ARTWORKS with data from API response
      let filteredArtworks = MOCK_ARTWORKS; 
      if (searchTerm) {
        filteredArtworks = MOCK_ARTWORKS.filter(art => 
          art.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          art.artist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          art.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      }
      setArtworks(filteredArtworks);
      setIsLoading(false);
    }, 500); // Simulate network delay
  }, [searchTerm]);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="space-y-6">
      {/* Minimal header with search */}
      <div className="flex flex-col sm:flex-row gap-3 items-center">
        <div className="relative flex-grow w-full sm:w-auto">
            <input 
                type="text"
                placeholder="Search artworks, artists, tags..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2 bg-slate-800/80 text-slate-200 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors placeholder-slate-500"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
        </div>
        <Button variant="outline" className="text-cyan-400 border-cyan-500 w-full sm:w-auto py-2 px-4" leftIcon={<FilterIcon />}>
            Filters
        </Button>
      </div>
      
      {/* Artwork grid with the exact layout from reference */}
      <ArtworkGrid artworks={artworks} isLoading={isLoading} />
    </div>
  );
};

export default HomePage;
