import type { AppData, MediaType, ProfileData, RatingValue } from "../types";

export const STORAGE_KEY = "screensense.data.v1";
export const TOKEN_KEY = "screensense.tmdb.token.v1";
export const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

export const EMPTY_PROFILE_DATA: ProfileData = {
  rated: [],
  watchlist: [],
  dismissed: { movie: [], tv: [] },
};

export const EMPTY_DATA: AppData = {
  version: 2,
  activeProfileId: "default",
  profiles: [{
    id: "default",
    name: "My Profile",
    createdAt: "2026-01-01T00:00:00.000Z",
    ...EMPTY_PROFILE_DATA,
  }],
};

export const MEDIA_LABELS: Record<MediaType, string> = {
  movie: "Movies",
  tv: "TV Shows",
};

export const RATING_LABELS: Record<RatingValue, string> = {
  dislike: "Not for me",
  neutral: "It was okay",
  like: "Loved it",
};
