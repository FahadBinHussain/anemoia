
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useFollow } from '../contexts/FollowContext';
import { useLike } from '../contexts/LikeContext';
import { useSave } from '../contexts/SaveContext';
import { ARTISTS, MOCK_ARTWORKS } from '../constants';
import { User, Artist, Artwork } from '../types';
import Button from '../components/Button';
import Spinner from '../components/Spinner';
import ArtworkGrid from '../components/ArtworkGrid';

// --- Icons ---
const ArrowLeftIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
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
const UsersIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-3.741-5.582M12 15M12 15a2.25 2.25 0 01-2.25-2.25M12 15a2.25 2.25 0 002.25-2.25M12 15V9.75M12 9.75a2.25 2.25 0 012.25-2.25M12 9.75a2.25 2.25 0 00-2.25-2.25m-3 13.5A2.25 2.25 0 016.75 15m0 0a2.25 2.25 0 012.25-2.25M6.75 15m0 0A2.25 2.25 0 004.5 17.25m13.5 0A2.25 2.25 0 0119.5 15m0 0a2.25 2.25 0 012.25-2.25m0 0A2.25 2.25 0 0019.5 9.75M19.5 9.75A2.25 2.25 0 0117.25 7.5M17.25 7.5A2.25 2.25 0 0015 5.25m-3 0A2.25 2.25 0 019.75 7.5M9.75 7.5A2.25 2.25 0 007.5 5.25m6 6.75A2.25 2.25 0 019.75 9.75M9.75 9.75A2.25 2.25 0 007.5 12m9 0A2.25 2.25 0 0114.25 9.75M14.25 9.75A2.25 2.25 0 0012 12m-3 0A2.25 2.25 0 016.75 9.75M6.75 9.75A2.25 2.25 0 004.5 12m6.083 6.083A2.25 2.25 0 0110.5 15.75m0 0c.149-.02.295-.029.443-.029H12a6.75 6.75 0 014.075 1.368M10.5 15.75c-.148-.02-.295-.029-.443-.029H9a6.75 6.75 0 00-4.075 1.368M7.5 15.75V18" />
  </svg>
);
const UserMinusIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0zM2.478 17.653a11.25 11.25 0 0119.044 0" />
  </svg>
);
const HeartIconSolid: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || "w-6 h-6"}>
    <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.218l-.022.012-.007.004-.004.001a.752.752 0 01-.704 0l-.004-.001z" />
  </svg>
);
const BookmarkIconSolid: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || "w-6 h-6"}>
    <path fillRule="evenodd" d="M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21L12 17.25 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93z" clipRule="evenodd" />
  </svg>
);
const HeartBrokenIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.056 3 12s4.03 8.25 9 8.25zM7.5 7.5L9 9m3-1.5L9.75 10.5m4.5-3L12 10.5m0 3.75L9 16.5m3-2.25L14.25 16.5" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75c-1.5 0-2.843.434-4.007 1.187M12 6.75c1.5 0 2.843.434 4.007 1.187m-8.014 2.373A9.75 9.75 0 0012 15.75c2.093 0 4.036-.64 5.527-1.713m-2.25-3.039A9.753 9.753 0 0012 12.75c-1.282 0-2.488-.235-3.585-.655" />
 </svg>
);
const BookmarkSlashIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V14.25l-2.06-2.061M12 17.25L4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
  </svg>
);
const CollectionIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
);


// --- End Icons ---


const ProfilePage: React.FC = () => {
  const { profileId } = useParams<{ profileId?: string }>();
  const navigate = useNavigate();
  const { currentUser, isLoading: authLoading } = useAuth();
  const { followedArtistIds, followArtist, unfollowArtist, isFollowing } = useFollow();
  const { likedArtworkIds, unlikeArtwork } = useLike();
  const { savedArtworkIds, unsaveArtwork } = useSave();

  const [profileData, setProfileData] = useState<User | Artist | null>(null);
  const [profileArtworks, setProfileArtworks] = useState<Artwork[]>([]);
  const [isOwnProfile, setIsOwnProfile] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    setIsLoading(true);
    setError(null);
    setProfileArtworks([]); // Reset artworks on profile change

    const loadProfile = async () => {
      await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API delay

      if (!profileId) { // Viewing own profile via /profile
        if (currentUser) {
          setProfileData(currentUser);
          setIsOwnProfile(true);
          const potentialArtist = ARTISTS.find(a => a.id === currentUser.id);
          if (potentialArtist) {
            const userArtworks = MOCK_ARTWORKS.filter(art => art.artist.id === currentUser.id);
            setProfileArtworks(userArtworks);
          }
        } else if (!authLoading) {
          navigate('/login');
          return;
        } else {
          return; // Auth is still loading
        }
      } else { // Viewing a specific profile via /profile/:profileId
        if (currentUser && profileId === currentUser.id) {
          setProfileData(currentUser);
          setIsOwnProfile(true);
          const potentialArtist = ARTISTS.find(a => a.id === currentUser.id);
          if (potentialArtist) {
            const userArtworks = MOCK_ARTWORKS.filter(art => art.artist.id === currentUser.id);
            setProfileArtworks(userArtworks);
          }
        } else {
          const artist = ARTISTS.find(a => a.id === profileId);
          if (artist) {
            setProfileData(artist);
            setIsOwnProfile(false);
            const artistArtworksData = MOCK_ARTWORKS.filter(art => art.artist.id === artist.id);
            setProfileArtworks(artistArtworksData);
          } else {
            setError(`Profile not found. Perhaps they're exploring the digital void.`);
          }
        }
      }
      setIsLoading(false);
    };

    if (!authLoading) {
        loadProfile();
    }
  }, [profileId, currentUser, authLoading, navigate]);


  if (isLoading || authLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <Spinner size="xl" />
        <p className="mt-4 text-xl text-slate-300">Loading Profile Data...</p>
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="text-center py-20">
        <p className="text-2xl text-pink-500 mb-4">{error || "Profile data seems to be elusive."}</p>
        <Link to="/">
          <Button variant="primary" size="lg">Back to Explore</Button>
        </Link>
      </div>
    );
  }

  const isViewingArtistProfile = 'profileUrl' in profileData; // True if profileData is an Artist type
  const isCurrentlyFollowingArtist = !isOwnProfile && isViewingArtistProfile && isFollowing(profileData.id);


  const handleFollowToggle = () => {
    if (isOwnProfile || !currentUser || !isViewingArtistProfile) return;
    if (isCurrentlyFollowingArtist) {
      unfollowArtist(profileData.id);
    } else {
      followArtist(profileData.id);
    }
  };

  const displayName = profileData.name;
  const displaySubtitle = 'email' in profileData ? profileData.email : "Digital Artisan | Explorer of Neon Dreams";
  const nameParts = displayName.split(' ');
  const firstWordName = nameParts[0];
  const restOfName = nameParts.slice(1).join(' ');


  // --- Render helper for activity artwork lists (Liked/Saved) ---
  const renderArtworkListItem = (artwork: Artwork, actionType: 'unlike' | 'unsave') => (
    <div key={artwork.id} className="bg-slate-800 p-3 rounded-lg shadow-lg border border-slate-700 flex items-center space-x-3 card-glow-cyan hover:border-cyan-500 transition-all">
        <Link to={`/artwork/${artwork.id}`}>
            <img 
                src={artwork.imageUrl} 
                alt={artwork.title} 
                className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md border-2 border-slate-600 hover:opacity-80 transition-opacity"
            />
        </Link>
        <div className="flex-grow min-w-0">
            <Link to={`/artwork/${artwork.id}`} className="block text-md sm:text-lg font-semibold text-slate-100 hover:text-cyan-400 truncate transition-colors" title={artwork.title}>
                {artwork.title}
            </Link>
            <Link to={`/profile/${artwork.artist.id}`} className="text-xs sm:text-sm text-slate-400 hover:text-pink-400 transition-colors" title={artwork.artist.name}>
                by {artwork.artist.name}
            </Link>
        </div>
        {actionType === 'unlike' && (
            <Button 
                onClick={() => unlikeArtwork(artwork.id)}
                variant="outline"
                size="sm"
                title="Unlike Artwork"
                leftIcon={<HeartBrokenIcon />}
                className="border-pink-600 text-pink-500 hover:bg-pink-600 hover:text-slate-100 shrink-0"
            >
                <span className="hidden sm:inline">Unlike</span>
            </Button>
        )}
        {actionType === 'unsave' && (
             <Button 
                onClick={() => unsaveArtwork(artwork.id)}
                variant="outline"
                size="sm"
                title="Unsave Artwork"
                leftIcon={<BookmarkSlashIcon />}
                className="border-teal-500 text-teal-400 hover:bg-teal-500 hover:text-slate-100 shrink-0"
            >
                <span className="hidden sm:inline">Unsave</span>
            </Button>
        )}
    </div>
  );

  return (
    <div className="space-y-10">
      <Link to="/" className="inline-flex items-center text-cyan-400 hover:text-cyan-300 transition-colors group mb-0">
          <ArrowLeftIcon className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" />
          Back to Explore
      </Link>

      {/* Profile Header Section */}
      <div className="bg-slate-900 rounded-xl shadow-2xl shadow-pink-500/10 border border-slate-700/50 overflow-hidden">
        <div 
            className="h-48 sm:h-60 bg-slate-800 relative group"
            style={profileData.coverPhotoUrl ? { backgroundImage: `url(${profileData.coverPhotoUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
        >
            {!profileData.coverPhotoUrl && <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950"></div>}
        </div>
        <div className="p-6 sm:p-8 relative">
            <div className="flex flex-col sm:flex-row items-center sm:items-start -mt-20 sm:-mt-24">
                <img 
                    src={profileData.avatarUrl} 
                    alt={profileData.name}                     
                    className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 sm:border-6 border-slate-900 shadow-xl object-cover bg-slate-700 mb-4 sm:mb-0 sm:mr-6 shrink-0"
                />
                <div className="flex-grow text-center sm:text-left pt-4 sm:pt-0">
                    <h1 className="text-3xl sm:text-4xl font-bold">
                        <span className="text-pink-400 neon-text-pink">{firstWordName}</span>
                        {restOfName && <span className="text-slate-100"> {restOfName}</span>}
                    </h1>
                    <p className="text-slate-400 mt-1 text-md">{displaySubtitle}</p>
                    {isOwnProfile && <p className="text-sm text-slate-500 mt-1">Joined Anemoia (Conceptual Date)</p>}
                </div>
                {!isOwnProfile && isViewingArtistProfile && currentUser && (
                    <div className="w-full sm:w-auto mt-4 sm:mt-6 sm:ml-6 shrink-0">
                        <Button
                            onClick={handleFollowToggle}
                            variant={isCurrentlyFollowingArtist ? 'primary' : 'outline'}
                            size="md"
                            leftIcon={isCurrentlyFollowingArtist ? <UserCheckIcon /> : <UserPlusIcon />}
                            className={`w-full sm:w-auto ${isCurrentlyFollowingArtist ? '' : 'text-cyan-400 border-cyan-500 hover:bg-cyan-500 hover:text-slate-900'}`}
                        >
                            {isCurrentlyFollowingArtist ? 'Following' : 'Follow'}
                        </Button>
                    </div>
                )}
                 {!isOwnProfile && isViewingArtistProfile && !currentUser && (
                     <div className="w-full sm:w-auto mt-4 sm:mt-6 sm:ml-6 shrink-0">
                        <Button
                            variant="outline" size="md" disabled title="Login to follow artists" leftIcon={<UserPlusIcon/>}
                            className="w-full sm:w-auto text-slate-500 border-slate-600 cursor-not-allowed"
                        >Follow</Button>
                    </div>
                 )}
            </div>
        </div>
      </div>

      {/* Conditional Sections based on profile type */}
      {isOwnProfile && currentUser && (
        <>
          {/* Following Artists Section */}
          <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
            <div className="flex items-center mb-6">
                <UsersIcon className="w-8 h-8 text-cyan-400 mr-3 shrink-0 neon-text-cyan" />
                <h2 className="text-2xl sm:text-3xl font-semibold text-slate-100">Following Artists</h2>
            </div>
            {ARTISTS.filter(artist => followedArtistIds.has(artist.id)).length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {ARTISTS.filter(artist => followedArtistIds.has(artist.id)).map(artist => (
                  <div key={artist.id} className="bg-slate-800 p-4 rounded-lg shadow-lg border border-slate-700 flex flex-col items-center text-center card-glow-cyan hover:border-cyan-500 transition-all">
                    <Link to={`/profile/${artist.id}`} className="block mb-3">
                      <img src={artist.avatarUrl} alt={artist.name} className="w-20 h-20 rounded-full border-2 border-pink-500/70 group-hover:border-pink-500 transition-colors"/>
                    </Link>
                    <Link to={`/profile/${artist.id}`} className="text-lg font-medium text-slate-200 hover:text-cyan-400 transition-colors mb-1">{artist.name}</Link>
                    <Button onClick={() => unfollowArtist(artist.id)} variant="outline" size="sm" leftIcon={<UserMinusIcon />} className="mt-3 border-pink-500 text-pink-400 hover:bg-pink-500 hover:text-slate-900 w-full">Unfollow</Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-slate-400 py-10">
                <UsersIcon className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                <p className="text-xl">You're not following any artists yet.</p>
                <Link to="/"><Button variant="primary" size="md" className="mt-6">Explore Artworks</Button></Link>
              </div>
            )}
          </div>

          {/* Liked Artworks Section */}
          <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
            <div className="flex items-center mb-6">
                <HeartIconSolid className="w-8 h-8 text-pink-500 mr-3 shrink-0 neon-text-pink" />
                <h2 className="text-2xl sm:text-3xl font-semibold text-slate-100">Liked Artworks</h2>
            </div>
            {MOCK_ARTWORKS.filter(art => likedArtworkIds.has(art.id)).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {MOCK_ARTWORKS.filter(art => likedArtworkIds.has(art.id)).map(artwork => renderArtworkListItem(artwork, 'unlike'))}
              </div>
            ) : (
                <div className="text-center text-slate-400 py-10">
                    <HeartIconSolid className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                    <p className="text-xl">You haven't liked any artworks yet.</p>
                    <Link to="/"><Button variant="secondary" size="md" className="mt-6">Discover Art</Button></Link>
                </div>
            )}
          </div>

          {/* Saved Artworks Section */}
          <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
            <div className="flex items-center mb-6">
                <BookmarkIconSolid className="w-8 h-8 text-teal-400 mr-3 shrink-0 neon-text-cyan" />
                <h2 className="text-2xl sm:text-3xl font-semibold text-slate-100">Saved Artworks</h2>
            </div>
            {MOCK_ARTWORKS.filter(art => savedArtworkIds.has(art.id)).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {MOCK_ARTWORKS.filter(art => savedArtworkIds.has(art.id)).map(artwork => renderArtworkListItem(artwork, 'unsave'))}
              </div>
            ) : (
                <div className="text-center text-slate-400 py-10">
                    <BookmarkIconSolid className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                    <p className="text-xl">You haven't saved any artworks yet.</p>
                    <Link to="/"><Button variant="primary" className="bg-teal-500 hover:bg-teal-600 focus:ring-teal-500 mt-6" size="md">Find Art to Save</Button></Link>
                </div>
            )}
          </div>
        </>
      )}

      {/* Artworks Section - Display if profileArtworks has items */}
      {profileArtworks.length > 0 && (
        <div className="mt-10">
          <div className="flex items-center mb-6">
            <CollectionIcon className="w-8 h-8 text-cyan-400 mr-3 shrink-0 neon-text-cyan" />
            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-100">
              {isOwnProfile ? (
                <>My <span className="text-cyan-400 neon-text-cyan">Artworks</span></>
              ) : (
                <>Artworks by <span className="text-cyan-400 neon-text-cyan">{profileData.name}</span></>
              )}
            </h2>
          </div>
          <ArtworkGrid artworks={profileArtworks} isLoading={false} />
        </div>
      )}

      {/* Placeholder if user is an artist but has no artworks (on own profile) */}
      {isOwnProfile && currentUser && ARTISTS.some(a => a.id === currentUser.id) && profileArtworks.length === 0 && (
          <div className="text-center text-slate-400 text-lg py-10 bg-slate-800/50 rounded-lg border border-slate-700 mt-10">
              <CollectionIcon className="w-12 h-12 text-slate-500 mx-auto mb-4" />
              <p>You haven't uploaded any artworks yet.</p>
              <Link to="/upload">
                  <Button variant="primary" size="md" className="mt-6">Upload Your First Piece</Button>
              </Link>
          </div>
      )}

      {/* Placeholder if viewing another artist's profile and they have no artworks */}
      {!isOwnProfile && isViewingArtistProfile && profileArtworks.length === 0 && (
          <div className="text-center text-slate-400 text-lg py-10 bg-slate-800/50 rounded-lg border border-slate-700 mt-10">
              <CollectionIcon className="w-12 h-12 text-slate-500 mx-auto mb-4" />
              <p>{profileData.name} hasn't uploaded any artworks yet,</p>
              <p>or they are currently traversing the digital void.</p>
          </div>
      )}
    </div>
  );
};

export default ProfilePage;
