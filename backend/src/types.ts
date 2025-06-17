export interface User {
  id: string;
  name: string;
  email: string;
  avatar_url: string;
  given_name?: string;
  family_name?: string;
}

export interface Session {
  id: string;
  user_id: string;
  token: string;
  created_at: string;
  expires_at: string;
} 