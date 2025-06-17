# Backend API for Anemoia (Neon + Google Auth)

## Setup

1. **Create a Neon Postgres database**
   - Get your connection string from Neon dashboard.
2. **Create Google OAuth Client ID**
   - Use Google Cloud Console, set the client ID in `.env`.
3. **Set a JWT secret**
   - Use a strong random string for `JWT_SECRET` in `.env`.

## .env Example
```
NEON_DATABASE_URL=your_neon_connection_string_here
GOOGLE_CLIENT_ID=your_google_client_id_here
JWT_SECRET=your_jwt_secret_here
PORT=4000
```

## Database Schema
```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar_url TEXT NOT NULL,
  given_name TEXT,
  family_name TEXT
);
```

## Run the server
```sh
pnpm install
pnpm run dev # or: pnpm run start
```

## Endpoints
- `POST /api/auth/google` — Login with Google credential
- `GET /api/auth/session` — Get current user by JWT
- `POST /api/auth/logout` — (Optional) Logout 