import React from 'react';
import { Link } from 'react-router-dom';
import { Comment } from '../types';

interface CommentsCardProps {
  artworkId: string;
  comments: Comment[];
}

const ChatBubbleLeftEllipsisIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-3.86 8.25-8.625 8.25a9.75 9.75 0 01-4.372-.992L3 21l3.352-1.775A9.721 9.721 0 012.25 12c0-4.556 3.86-8.25 8.625-8.25S21 7.444 21 12z" />
  </svg>
);

const CommentsCard: React.FC<CommentsCardProps> = ({ artworkId, comments }) => {
  return (
    <div className="bg-slate-900 rounded-lg overflow-hidden border border-slate-800 shadow-lg">
      <div className="p-4">
        <div className="flex items-center mb-3 text-slate-200">
          <ChatBubbleLeftEllipsisIcon className="w-5 h-5 text-cyan-400 mr-2 shrink-0" />
          <h3 className="text-lg font-medium">Comments</h3>
          <span className="ml-2 text-sm text-slate-400">({comments.length})</span>
        </div>
        
        {comments.length > 0 ? (
          <>
            <div className="space-y-3 mb-3">
              {comments.slice(0, 2).map(comment => (
                <div key={comment.id} className="flex items-start space-x-2">
                  <img 
                    src={comment.user.avatarUrl} 
                    alt={comment.user.name} 
                    className="w-8 h-8 rounded-full border border-slate-600 shrink-0 mt-1"
                  />
                  <div>
                    <div className="flex items-center space-x-1">
                      <span className="text-sm font-medium text-pink-400">{comment.user.name}</span>
                      <span className="text-xs text-slate-500">•</span>
                      <span className="text-xs text-slate-500">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-slate-300 line-clamp-1">
                      {comment.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Link 
              to={`/artwork/${artworkId}#comments`} 
              className="inline-block text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              View all comments
            </Link>
          </>
        ) : (
          <div className="text-slate-300">
            <p>No comments yet. Be the first to share your thoughts!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentsCard; 