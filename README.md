# Anemoia - Digital Art Platform

This project is a modern digital art platform with Google Authentication integration.

## Features

- Responsive design with modern UI
- Google Sign-In modal authentication
- Art discovery and exploration
- User profiles and artwork uploads

## Run Locally

**Prerequisites:**  Node.js

1. Install dependencies:
   ```
   pnpm install
   ```

2. Set up environment variables:
   - Create a `.env` file with your Google Client ID:
   ```
   GOOGLE_CLIENT_ID=your_google_client_id
   ```

3. Run the app:
   ```
   pnpm dev
   ```

## Authentication

The app uses Google Authentication implemented as a modal dialog:
- No separate login page - authentication happens directly in a modal
- Auth state persists across sessions
- Protected routes trigger the auth modal automatically

## Tech Stack

- React & TypeScript
- React Router for navigation
- Context API for state management
- Google Identity Services for authentication
