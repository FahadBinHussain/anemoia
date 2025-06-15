
export interface User {
  id: string;          // Google User ID
  name: string;        // Full name from Google
  email: string;       // Email from Google
  avatarUrl: string;   // Profile picture URL from Google
  givenName?: string;  // Optional: Given name from Google
  familyName?: string; // Optional: Family name from Google
  coverPhotoUrl?: string; // Optional: Cover photo URL
}

export interface Artist {
  id: string;
  name: string;
  avatarUrl: string;
  profileUrl?: string; // Optional link to a mock profile
  coverPhotoUrl?: string; // Optional: Cover photo URL
}

export interface Artwork {
  id:string;
  title: string;
  artist: Artist;
  imageUrl: string;
  description: string;
  tags: string[];
  createdAt: string; // ISO date string
  views?: number; // Optional
  likes?: number; // Optional
}

export interface NavLinkItem {
  label: string;
  href: string;
  authRequired?: boolean; // Only show if logged in
  hideWhenAuth?: boolean; // Only show if not logged in
  isButton?: boolean; // Style as a button
  action?: () => void; // For logout or other actions
}

export interface Comment { // Added
  id: string;
  artworkId: string;
  user: User;
  text: string;
  createdAt: number; // Timestamp (Date.now())
}
