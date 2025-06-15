// config.ts

// This Google Client ID is safe to be used in the frontend.
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

if (!GOOGLE_CLIENT_ID) {
  console.error("VITE_GOOGLE_CLIENT_ID is not set. Google Sign-In will not work.");
}

// Backend-only credentials belong in server-side environment variables.
