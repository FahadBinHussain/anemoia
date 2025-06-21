import React from 'react';

interface TagsCardProps {
  tags: string[];
}

const TagIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
  </svg>
);

const TagsCard: React.FC<TagsCardProps> = ({ tags }) => {
  if (!tags || tags.length === 0) {
    return null;
  }

  return (
    <div className="bg-slate-900 rounded-lg overflow-hidden border border-slate-800 shadow-lg">
      <div className="p-4">
        <div className="flex items-center mb-3 text-slate-200">
          <TagIcon className="w-5 h-5 text-pink-400 mr-2 shrink-0"/>
          <h3 className="text-lg font-medium">Tags</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <span 
              key={tag} 
              className="px-3 py-1 text-xs bg-slate-700 text-cyan-300 rounded-full border border-slate-600 hover:bg-cyan-500 hover:text-slate-900 hover:border-cyan-500 transition-all cursor-pointer"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TagsCard; 