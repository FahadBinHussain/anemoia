import React, { useState, useRef, useEffect } from 'react';
import { Artwork, User } from '../types';
import { Link } from 'react-router-dom';
import Button from './Button';
import { useAuth } from '../contexts/AuthContext';
import { useFollow } from '../contexts/FollowContext';
import { useLike } from '../contexts/LikeContext';
import { useSave } from '../contexts/SaveContext';
import { useComment } from '../contexts/CommentContext';
import { formatTimeAgo } from '../utils/time';
import ArtistHoverCard from './ArtistHoverCard'; 
import { MOCK_ARTWORKS } from '../constants'; 

interface ArtworkDetailProps {
  artwork: Artwork;
}

// Icons (could be moved to a separate icons file if used elsewhere)
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

const HeartOutlineIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
  </svg>
);

const HeartSolidIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || "w-5 h-5"}>
    <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.218l-.022.012-.007.004-.004.001a.752.752 0 01-.704 0l-.004-.001z" />
  </svg>
);

const BookmarkOutlineIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
  </svg>
);

const BookmarkSolidIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || "w-5 h-5"}>
    <path fillRule="evenodd" d="M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21L12 17.25 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93z" clipRule="evenodd" />
  </svg>
);

const ChatBubbleLeftEllipsisIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-3.86 8.25-8.625 8.25a9.75 9.75 0 01-4.372-.992L3 21l3.352-1.775A9.721 9.721 0 012.25 12c0-4.556 3.86-8.25 8.625-8.25S21 7.444 21 12z" />
  </svg>
);

const PaperAirplaneIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
  </svg>
);


const ArtworkDetail: React.FC<ArtworkDetailProps> = ({ artwork }) => {
  const { currentUser } = useAuth();
  const { followArtist, unfollowArtist, isFollowing } = useFollow();
  const { likeArtwork, unlikeArtwork, isLiked } = useLike(); 
  const { saveArtwork, unsaveArtwork, isSaved } = useSave(); 
  const { getComments, addComment } = useComment();

  const [commentText, setCommentText] = useState('');
  const [isHoverCardVisible, setIsHoverCardVisible] = useState(false); 
  const [otherArtworksByArtist, setOtherArtworksByArtist] = useState<Artwork[]>([]); 

  const showTimeoutRef = useRef<number | null>(null); 
  const hideTimeoutRef = useRef<number | null>(null); 


  useEffect(() => {
    // Fetch other artworks by the same artist for the hover card
    const filteredArtworks = MOCK_ARTWORKS.filter(
      art => art.artist.id === artwork.artist.id && art.id !== artwork.id
    ).slice(0, 3);
    setOtherArtworksByArtist(filteredArtworks);
  }, [artwork.artist.id, artwork.id]);


  const isCurrentlyFollowing = isFollowing(artwork.artist.id);
  const isCurrentlyLiked = isLiked(artwork.id); 
  const isCurrentlySaved = isSaved(artwork.id); 

  const artworkComments = getComments(artwork.id);

  const handleFollowToggle = () => {
    if (!currentUser) return;
    if (isCurrentlyFollowing) {
      unfollowArtist(artwork.artist.id);
    } else {
      followArtist(artwork.artist.id);
    }
  };

  const handleLikeToggle = () => { 
    if (!currentUser) return;
    if (isCurrentlyLiked) {
      unlikeArtwork(artwork.id);
    } else {
      likeArtwork(artwork.id);
    }
  };

  const handleSaveToggle = () => { 
    if (!currentUser) return;
    if (isCurrentlySaved) {
      unsaveArtwork(artwork.id);
    } else {
      saveArtwork(artwork.id);
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !commentText.trim()) return;
    addComment(artwork.id, commentText.trim());
    setCommentText('');
  };

  // Hover card logic 
  const clearTimeouts = () => {
    if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current);
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
  };

  const handleArtistAreaEnter = () => {
    clearTimeouts();
    showTimeoutRef.current = window.setTimeout(() => {
      setIsHoverCardVisible(true);
    }, 100); 
  };

  const handleArtistAreaLeave = () => {
    clearTimeouts();
    hideTimeoutRef.current = window.setTimeout(() => {
      setIsHoverCardVisible(false);
    }, 200); 
  };

  const handleCardEnter = () => {
    clearTimeouts(); 
  };
  
  const handleCardLeave = () => { 
    handleArtistAreaLeave();
  };


  return (
    <div className="bg-slate-900 rounded-xl overflow-hidden shadow-2xl shadow-cyan-500/20 border border-slate-700/50">
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Image Column */}
          <div className="lg:col-span-2 mb-6 lg:mb-0">
            <div className="aspect-[16/10] bg-slate-800 rounded-lg overflow-hidden border border-slate-700 neon-border-cyan">
              <img 
                src={artwork.imageUrl.replace('/600/400', '/1200/800')} 
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
            
            {/* Artist Info Block with Hover Card Logic */}
            <div 
              className="relative" 
              onMouseEnter={handleArtistAreaEnter}
              onMouseLeave={handleArtistAreaLeave}
            >
              <div className="flex items-start space-x-3 mb-4">
                <Link to={`/profile/${artwork.artist.id}`} className="shrink-0">
                    <img 
                    src={artwork.artist.avatarUrl} 
                    alt={artwork.artist.name} 
                    className="w-12 h-12 rounded-full border-2 border-pink-500 hover:opacity-80 transition-opacity"
                    />
                </Link>
                <div className="flex-grow">
                  <Link to={`/profile/${artwork.artist.id}`} className="text-lg font-medium text-slate-200 hover:text-cyan-400 transition-colors">
                    {artwork.artist.name}
                  </Link>
                  <p className="text-sm text-slate-400">Digital Artisan</p> 
                </div>
              </div>

              {isHoverCardVisible && (
                <ArtistHoverCard
                  artist={artwork.artist}
                  otherArtworks={otherArtworksByArtist}
                  isFollowing={isCurrentlyFollowing} // This specific button might be redundant if profile page handles it
                  onFollowToggle={handleFollowToggle} // This specific button might be redundant
                  currentUser={currentUser}
                  onMouseEnter={handleCardEnter} 
                  onMouseLeave={handleCardLeave} 
                  className="absolute top-0 right-[calc(100%+1rem)] z-40 w-72 transform " 
                />
              )}
            </div>
            {/* End Artist Info Block */}


            {/* Action Buttons Area */}
            <div className="space-y-3 mb-6">
              {currentUser && currentUser.id !== artwork.artist.id ? ( // Don't show follow button for own art? (Assuming artists are users)
                                                                    // Or simplify: show if not current user's profile page.
                                                                    // For now, it's about following an *artist entity*.
                <Button
                  onClick={handleFollowToggle}
                  variant={isCurrentlyFollowing ? 'primary' : 'outline'}
                  size="md"
                  leftIcon={isCurrentlyFollowing ? <UserCheckIcon className="w-5 h-5"/> : <UserPlusIcon className="w-5 h-5"/>}
                  className={`w-full ${isCurrentlyFollowing ? '' : 'text-cyan-400 border-cyan-500 hover:bg-cyan-500 hover:text-slate-900'}`}
                >
                  {isCurrentlyFollowing ? 'Following Artist' : 'Follow Artist'}
                </Button>
              ) : !currentUser ? ( // Only show disabled if not logged in. If logged in and it's their own art/profile, hide.
                 <Button
                  variant="outline"
                  size="md"
                  disabled
                  title="Login to follow artists"
                  leftIcon={<UserPlusIcon className="w-5 h-5"/>}
                  className="w-full text-slate-500 border-slate-600 cursor-not-allowed"
                >
                  Follow Artist
                </Button>
              ) : null /* Don't show follow button for your own art/profile page (conceptual) */
              }


              <div className="flex space-x-3">
                {currentUser ? (
                  <Button
                    onClick={handleLikeToggle}
                    variant={isCurrentlyLiked ? 'secondary' : 'outline'}
                    size="md"
                    leftIcon={isCurrentlyLiked ? <HeartSolidIcon className="w-5 h-5"/> : <HeartOutlineIcon className="w-5 h-5"/>}
                    className={`w-full ${isCurrentlyLiked ? 'bg-pink-500 text-white' : 'text-pink-400 border-pink-500 hover:bg-pink-500 hover:text-slate-900'}`}
                    aria-pressed={isCurrentlyLiked}
                    aria-label={isCurrentlyLiked ? "Unlike artwork" : "Like artwork"}
                  >
                    {isCurrentlyLiked ? 'Liked' : 'Like'}
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="md"
                    disabled
                    title="Login to like artwork"
                    leftIcon={<HeartOutlineIcon className="w-5 h-5"/>}
                    className="w-full text-slate-500 border-slate-600 cursor-not-allowed"
                    aria-label="Like artwork (disabled)"
                  >
                    Like
                  </Button>
                )}

                {currentUser ? (
                  <Button
                    onClick={handleSaveToggle}
                    variant={isCurrentlySaved ? 'primary' : 'outline'} 
                    size="md"
                    leftIcon={isCurrentlySaved ? <BookmarkSolidIcon className="w-5 h-5"/> : <BookmarkOutlineIcon className="w-5 h-5"/>}
                    className={`w-full ${isCurrentlySaved ? 'bg-teal-500 text-white hover:bg-teal-600 focus:ring-teal-500' : 'text-teal-400 border-teal-500 hover:bg-teal-500 hover:text-slate-900 focus:ring-teal-500'}`}
                    aria-pressed={isCurrentlySaved}
                    aria-label={isCurrentlySaved ? "Unsave artwork" : "Save artwork"}
                  >
                    {isCurrentlySaved ? 'Saved' : 'Save'}
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="md"
                    disabled
                    title="Login to save artwork"
                    leftIcon={<BookmarkOutlineIcon className="w-5 h-5"/>}
                    className="w-full text-slate-500 border-slate-600 cursor-not-allowed"
                    aria-label="Save artwork (disabled)"
                  >
                    Save
                  </Button>
                )}
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

      {/* Comments Section */}
      <div className="p-4 sm:p-6 lg:p-8 mt-0 border-t border-slate-800/50">
        <div className="flex items-center mb-6">
          <ChatBubbleLeftEllipsisIcon className="w-7 h-7 text-cyan-400 neon-text-cyan mr-3 shrink-0" />
          <h2 className="text-2xl font-semibold text-slate-100">
            Comments <span className="text-base text-slate-400">({artworkComments.length})</span>
          </h2>
        </div>

        {currentUser ? (
          <form onSubmit={handleCommentSubmit} className="mb-8 flex items-start space-x-3">
            <img 
              src={currentUser.avatarUrl} 
              alt={currentUser.name} 
              className="w-10 h-10 rounded-full border-2 border-pink-500 shrink-0 mt-1"
            />
            <div className="flex-grow">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Share your thoughts on this artwork..."
                rows={3}
                className="w-full p-3 bg-slate-800 text-slate-200 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors placeholder-slate-500"
                aria-label="Add a comment"
              />
              <div className="mt-2 flex justify-end">
                <Button 
                  type="submit" 
                  variant="primary" 
                  size="md"
                  disabled={!commentText.trim()}
                  leftIcon={<PaperAirplaneIcon />}
                >
                  Post Comment
                </Button>
              </div>
            </div>
          </form>
        ) : (
          <div className="mb-8 p-4 bg-slate-800 rounded-lg border border-slate-700 text-center">
            <p className="text-slate-300">
              Please <Link to="/login" className="text-cyan-400 hover:underline font-semibold">log in</Link> to post a comment.
            </p>
          </div>
        )}

        {artworkComments.length > 0 ? (
          <div className="space-y-6">
            {artworkComments.slice().sort((a,b) => b.createdAt - a.createdAt).map(comment => (
              <div key={comment.id} className="flex items-start space-x-3 p-4 bg-slate-800/70 rounded-lg border border-slate-700/80">
                <img 
                  src={comment.user.avatarUrl} 
                  alt={comment.user.name} 
                  className="w-10 h-10 rounded-full border-2 border-slate-600 shrink-0"
                />
                <div className="flex-grow">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-semibold text-pink-400">{comment.user.name}</span>
                    <span className="text-xs text-slate-500">&bull;</span>
                    <span className="text-xs text-slate-500" title={new Date(comment.createdAt).toLocaleString()}>
                      {formatTimeAgo(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-slate-300 whitespace-pre-wrap">{comment.text}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-slate-400 py-8">
            <ChatBubbleLeftEllipsisIcon className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-lg">Be the first to share your thoughts!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtworkDetail;