# ScreenSense

ScreenSense is an installable, iPhone-first web app for rating movies and TV shows, receiving taste-based recommendations, and maintaining profile-specific watchlists.

## What works

- Separate movie and TV searches through TMDB
- Three ratings: **Not for me**, **It was okay**, and **Loved it**
- Recommendation scoring based on liked, neutral, and disliked genres plus TMDB title-to-title recommendations
- Exclusion of titles already rated, watchlisted, or rejected
- Watchlist and watched-library management
- Multiple local profiles with separate ratings, recommendations, rejected suggestions, and watchlists
- Local-only storage with JSON backup and restore
- Installable iPhone PWA shell
- Automated unit tests, production build, and GitHub Pages deployment workflow

## Important limits

- An internet connection is required to search TMDB, load posters, and request new recommendations.
- Profiles, ratings, and watchlists are stored only in Safari on the iPhone. Clearing Safari website data removes them unless a backup was exported first.
- The TMDB Read Access Token is stored locally in the browser. It is never committed to this repository.
- TMDB is extensive, but no catalog can guarantee literally every movie or TV show ever created.

## Run locally

Requirements: Node.js 22 or newer.

```bash
npm install
npm run dev
```

Open the local address Vite prints. In ScreenSense, go to **Settings** and paste a TMDB **API Read Access Token** from <https://www.themoviedb.org/settings/api>.

## Verify

```bash
npm test
npm run lint
npm run build
```

## Deploy with GitHub Pages

1. Push this repository to GitHub using the `main` branch.
2. In the GitHub repository, open **Settings → Pages**.
3. Under **Build and deployment**, choose **GitHub Actions** as the source.
4. Open the **Actions** tab and confirm that “Deploy ScreenSense to GitHub Pages” succeeds.
5. Open the Pages URL shown by the deployment.

The workflow runs tests and a production build before every deployment.

## Install on iPhone

1. Open the deployed ScreenSense URL in Safari.
2. Tap the Safari **Share** button.
3. Tap **Add to Home Screen**.
4. Tap **Add**.
5. Open ScreenSense from the new Home Screen icon.
6. Open **Settings**, add your TMDB token, and start rating titles.

Use the profile button at the top of the app to create profiles such as **Zach**, **Shanon**, or **Family** and switch between them. Existing version 1 data is automatically kept in **My Profile**.

## Privacy

ScreenSense has no account, analytics, ads, tracking, or cloud database. The app sends the locally stored token and catalog requests to TMDB only. Poster images load from TMDB's image service.

This product uses the TMDB API but is not endorsed or certified by TMDB.
