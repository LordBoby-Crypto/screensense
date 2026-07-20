import type { AppData, MediaType, RatingValue } from "../types";

export const STORAGE_KEY = "screensense.data.v1";
export const TOKEN_KEY = "screensense.tmdb.token.v1";
export const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

export const EMPTY_DATA: AppData = {
  version: 1,
  rated: [],
  watchlist: [],
  dismissed: { movie: [], tv: [] },
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
