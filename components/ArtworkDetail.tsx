
import React from 'react';
import { Artwork } from '../types';
import { Link } from 'react-router-dom';

interface ArtworkDetailProps {
  artwork: Artwork;
}

const CalendarIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
  </svg>
);

const TagIcon: React.FC<{className?: string}> = ({ className }) => (
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
  <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
</svg>
);


const ArtworkDetail: React.FC<ArtworkDetailProps> = ({ artwork }) => {
  return (
    <div className="bg-slate-900 rounded-xl overflow-hidden shadow-2xl shadow-cyan-500/20 border border-slate-700/50 p-4 sm:p-6 lg:p-8">
      <div className="lg:grid lg:grid-cols-3 lg:gap-8">
        {/* Image Column */}
        <div className="lg:col-span-2 mb-6 lg:mb-0">
          <div className="aspect-[16/10] bg-slate-800 rounded-lg overflow-hidden border border-slate-700 neon-border-cyan">
            <img 
              src={artwork.imageUrl.replace('/600/400', '/1200/800')} // Request larger image
              alt={artwork.title} 
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Details Column */}
        <div className="lg:col-span-1">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">
            <span className="text-cyan-400 neon-text-cyan">{artwork.title.split(' ')[0]}</span>
            <span className="text-slate-100"> {artwork.title.substring(artwork.title.split(' ')[0].length)}</span>
          </h1>
          
          <div className="flex items-center space-x-3 mb-6">
            <img 
              src={artwork.artist.avatarUrl} 
              alt={artwork.artist.name} 
              className="w-12 h-12 rounded-full border-2 border-pink-500"
            />
            <div>
              <p className="text-lg font-medium text-slate-200">{artwork.artist.name}</p>
              <Link to="#" className="text-sm text-pink-400 hover:text-pink-300 hover:underline transition-colors">
                View Profile
              </Link>
            </div>
          </div>

          <div className="space-y-4 text-slate-300">
            <div className="flex items-start space-x-2">
              <CalendarIcon className="w-5 h-5 text-cyan-400 mt-0.5 shrink-0" />
              <p>Published on {new Date(artwork.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            
            {artwork.views && artwork.likes && (
                 <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-1.5">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-cyan-400"><path d="M12 15a3 3 0 100-6 3 3 0 000 6z" /><path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" clipRule="evenodd" /></svg>
                        <span className="font-medium">{artwork.views.toLocaleString()}</span>
                        <span className="text-slate-400">Views</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-pink-500"><path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.218l-.022.012-.007.004-.004.001a.752.752 0 01-.704 0l-.004-.001z" /></svg>
                        <span className="font-medium">{artwork.likes.toLocaleString()}</span>
                        <span className="text-slate-400">Likes</span>
                    </div>
                </div>
            )}

            <div className="prose prose-sm prose-invert text-slate-300 max-w-none">
                <p className="leading-relaxed">{artwork.description}</p>
            </div>
          </div>
          
          <div className="mt-8">
            <div className="flex items-center mb-3 text-slate-200">
                <TagIcon className="w-5 h-5 text-pink-400 mr-2 shrink-0"/>
                <h3 className="text-md font-semibold">Tags</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {artwork.tags.map(tag => (
                <span key={tag} className="px-3 py-1 text-xs bg-slate-700 text-cyan-300 rounded-full border border-slate-600 hover:bg-cyan-500 hover:text-slate-900 hover:border-cyan-500 transition-all cursor-pointer">
                  {tag}
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ArtworkDetail;
