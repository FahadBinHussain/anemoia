
export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
}

export interface Artist {
  id: string;
  name: string;
  avatarUrl: string;
  profileUrl?: string; // Optional link to a mock profile
}

export interface Artwork {
  id: string;
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
