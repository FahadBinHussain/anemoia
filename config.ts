// config.ts

// This Google Client ID is safe to be used in the frontend.
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

if (!GOOGLE_CLIENT_ID) {
  console.error("VITE_GOOGLE_CLIENT_ID is not set. Google Sign-In will not work.");
}

/**
 * FOR BACKEND USE ONLY - DO NOT EXPOSE IN FRONTEND:
 * 
 * Neon Connection String:
 * postgresql://neondb_owner:npg_Zu01ihvqzMLm@ep-sweet-butterfly-a1yluox7-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
 * 
 * Google Client Secret:
 * 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
 * 
 * These credentials are highly sensitive and are used by your backend server
 * to securely connect to the database and verify Google Sign-In tokens.
 */
