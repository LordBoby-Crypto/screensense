import type { MediaItem, MediaType, TmdbGenre } from "../types";

const API_BASE = "https://api.themoviedb.org/3";

interface TmdbResult {
  id: number;
  title?: string;
  name?: string;
  original_title?: string;
  original_name?: string;
  overview?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  release_date?: string;
  first_air_date?: string;
  genre_ids?: number[];
  vote_average?: number;
  popularity?: number;
  adult?: boolean;
}

interface PagedResponse {
  results: TmdbResult[];
}

interface GenreResponse {
  genres: TmdbGenre[];
}

function headers(token: string): HeadersInit {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
  };
}

async function request<T>(token: string, path: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, { headers: headers(token), signal });
  if (response.status === 401) throw new Error("Your TMDB token was not accepted. Open Settings and replace it.");
  if (!response.ok) throw new Error(`TMDB request failed (${response.status}). Try again.`);
  return response.json() as Promise<T>;
}

function normalize(item: TmdbResult, mediaType: MediaType): MediaItem {
  return {
    id: item.id,
    mediaType,
    title: item.title ?? item.name ?? "Untitled",
    originalTitle: item.original_title ?? item.original_name ?? item.title ?? item.name ?? "Untitled",
    overview: item.overview ?? "No description is available.",
    posterPath: item.poster_path ?? null,
    backdropPath: item.backdrop_path ?? null,
    date: item.release_date ?? item.first_air_date ?? "",
    genreIds: item.genre_ids ?? [],
    voteAverage: item.vote_average ?? 0,
    popularity: item.popularity ?? 0,
  };
}

export async function validateToken(token: string): Promise<void> {
  await request(token.trim(), "/configuration");
}

export async function searchMedia(token: string, mediaType: MediaType, query: string, signal?: AbortSignal): Promise<MediaItem[]> {
  const params = new URLSearchParams({ query, include_adult: "false", language: "en-US", page: "1" });
  const data = await request<PagedResponse>(token, `/search/${mediaType}?${params.toString()}`, signal);
  return data.results.filter((item) => item.adult !== true).map((item) => normalize(item, mediaType));
}

export async function fetchRecommendations(token: string, mediaType: MediaType, id: number): Promise<MediaItem[]> {
  const data = await request<PagedResponse>(token, `/${mediaType}/${id}/recommendations?language=en-US&page=1`);
  return data.results.filter((item) => item.adult !== true).map((item) => normalize(item, mediaType));
}

export async function fetchPopular(token: string, mediaType: MediaType): Promise<MediaItem[]> {
  const data = await request<PagedResponse>(token, `/${mediaType}/popular?language=en-US&page=1`);
  return data.results.filter((item) => item.adult !== true).map((item) => normalize(item, mediaType));
}

export async function fetchGenres(token: string, mediaType: MediaType): Promise<TmdbGenre[]> {
  const data = await request<GenreResponse>(token, `/genre/${mediaType}/list?language=en-US`);
  return data.genres;
}
