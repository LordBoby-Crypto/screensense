import { fetchPopular, fetchRecommendations } from "./tmdb";
import type { MediaItem, MediaType, RatedItem, Recommendation, WatchlistItem } from "../types";

interface CandidateRecord {
  item: MediaItem;
  score: number;
  reasons: string[];
}

const ratingWeight = { dislike: -4, neutral: 0.75, like: 3 } as const;

export function buildGenreWeights(rated: RatedItem[], mediaType: MediaType): Map<number, number> {
  const weights = new Map<number, number>();
  rated
    .filter((item) => item.mediaType === mediaType)
    .forEach((item) => item.genreIds.forEach((genreId) => weights.set(genreId, (weights.get(genreId) ?? 0) + ratingWeight[item.rating])));
  return weights;
}

export function rankCandidates(
  candidates: Array<{ item: MediaItem; source?: RatedItem; position: number }>,
  rated: RatedItem[],
  watchlist: WatchlistItem[],
  dismissedIds: number[],
  mediaType: MediaType,
): Recommendation[] {
  const excluded = new Set([
    ...rated.filter((item) => item.mediaType === mediaType).map((item) => item.id),
    ...watchlist.filter((item) => item.mediaType === mediaType).map((item) => item.id),
    ...dismissedIds,
  ]);
  const genreWeights = buildGenreWeights(rated, mediaType);
  const records = new Map<number, CandidateRecord>();

  candidates.forEach(({ item, source, position }) => {
    if (item.mediaType !== mediaType || excluded.has(item.id)) return;
    const genreScore = item.genreIds.reduce((total, id) => total + (genreWeights.get(id) ?? 0), 0);
    const sourceBoost = source?.rating === "like" ? 24 : source?.rating === "neutral" ? 7 : 0;
    const rankScore = Math.max(0, 20 - position * 0.7);
    const qualityScore = item.voteAverage * 0.8 + Math.log10(Math.max(1, item.popularity));
    const existing = records.get(item.id) ?? { item, score: 0, reasons: [] };
    existing.score += genreScore + sourceBoost + rankScore + qualityScore;
    if (source && !existing.reasons.includes(source.title)) existing.reasons.push(source.title);
    records.set(item.id, existing);
  });

  return [...records.values()]
    .sort((a, b) => b.score - a.score)
    .map(({ item, score, reasons }) => ({
      ...item,
      score,
      reasonTitles: reasons.slice(0, 2),
      personalized: reasons.length > 0,
    }));
}

export async function getRecommendations(
  token: string,
  mediaType: MediaType,
  rated: RatedItem[],
  watchlist: WatchlistItem[],
  dismissedIds: number[],
): Promise<Recommendation[]> {
  const relevant = rated.filter((item) => item.mediaType === mediaType);
  const sources = [
    ...relevant.filter((item) => item.rating === "like"),
    ...relevant.filter((item) => item.rating === "neutral"),
  ].slice(0, 6);

  const sourceResults = await Promise.all(
    sources.map(async (source) => ({ source, items: await fetchRecommendations(token, mediaType, source.id) })),
  );
  const personalizedCandidates = sourceResults.flatMap(({ source, items }) =>
    items.map((item, position) => ({ item, source, position })),
  );

  if (personalizedCandidates.length > 0) {
    return rankCandidates(personalizedCandidates, rated, watchlist, dismissedIds, mediaType);
  }

  const popular = await fetchPopular(token, mediaType);
  return rankCandidates(
    popular.map((item, position) => ({ item, position })),
    rated,
    watchlist,
    dismissedIds,
    mediaType,
  );
}
