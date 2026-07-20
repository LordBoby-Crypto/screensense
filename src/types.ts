export type MediaType = "movie" | "tv";
export type RatingValue = "dislike" | "neutral" | "like";
export type ScreenName = "home" | "catalog" | "recommend" | "watched" | "watchlist" | "settings";

export interface MediaItem {
  id: number;
  mediaType: MediaType;
  title: string;
  originalTitle: string;
  overview: string;
  posterPath: string | null;
  backdropPath: string | null;
  date: string;
  genreIds: number[];
  voteAverage: number;
  popularity: number;
}

export interface RatedItem extends MediaItem {
  rating: RatingValue;
  ratedAt: string;
}

export interface WatchlistItem extends MediaItem {
  addedAt: string;
}

export interface Recommendation extends MediaItem {
  reasonTitles: string[];
  personalized: boolean;
  score: number;
}

export interface AppData {
  version: 1;
  rated: RatedItem[];
  watchlist: WatchlistItem[];
  dismissed: Record<MediaType, number[]>;
}

export interface TmdbGenre {
  id: number;
  name: string;
}
