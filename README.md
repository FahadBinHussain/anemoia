# Anemoia - Digital Art Platform

## Project Status

This project has been sunset and merged into [ImgVault](https://github.com/FahadBinHussain/imgvault).
This repository is no longer actively maintained.

<img src="https://wakapi-qt1b.onrender.com/api/badge/fahad/interval:any/project:anemoia" 
     alt="Wakapi Time Tracking" 
     title="Spent more than that amount of time spent on this project">

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

## Contributors

<a href="https://github.com/FahadBinHussain/anemoia/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=FahadBinHussain/anemoia" alt="Contributors" />
</a>
