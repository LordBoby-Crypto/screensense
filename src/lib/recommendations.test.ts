import { describe, expect, it } from "vitest";
import { buildGenreWeights, rankCandidates } from "./recommendations";
import type { MediaItem, RatedItem, WatchlistItem } from "../types";

const media = (id: number, title: string, genreIds: number[]): MediaItem => ({
  id,
  mediaType: "movie",
  title,
  originalTitle: title,
  overview: `${title} overview`,
  posterPath: null,
  backdropPath: null,
  date: "2024-01-01",
  genreIds,
  voteAverage: 7,
  popularity: 50,
});

const rated = (item: MediaItem, rating: RatedItem["rating"]): RatedItem => ({ ...item, rating, ratedAt: "2026-01-01T00:00:00.000Z" });
const saved = (item: MediaItem): WatchlistItem => ({ ...item, addedAt: "2026-01-01T00:00:00.000Z" });

describe("recommendation ranking", () => {
  it("weights loved genres positively and disliked genres negatively", () => {
    const weights = buildGenreWeights([
      rated(media(1, "Loved", [12, 18]), "like"),
      rated(media(2, "Nope", [27]), "dislike"),
    ], "movie");

    expect(weights.get(12)).toBe(3);
    expect(weights.get(18)).toBe(3);
    expect(weights.get(27)).toBe(-4);
  });

  it("excludes rated, watchlisted, and dismissed items", () => {
    const source = rated(media(1, "Source", [12]), "like");
    const candidates = [2, 3, 4, 5].map((id, position) => ({ item: media(id, `Movie ${id}`, [12]), source, position }));
    const ranked = rankCandidates(candidates, [source, rated(media(2, "Movie 2", [12]), "neutral")], [saved(media(3, "Movie 3", [12]))], [4], "movie");

    expect(ranked.map((item) => item.id)).toEqual([5]);
  });

  it("prefers candidates matching positive taste over disliked genres", () => {
    const loved = rated(media(1, "Loved Adventure", [12]), "like");
    const disliked = rated(media(2, "Disliked Horror", [27]), "dislike");
    const ranked = rankCandidates([
      { item: media(10, "Adventure Match", [12]), source: loved, position: 2 },
      { item: media(11, "Horror Match", [27]), source: loved, position: 2 },
    ], [loved, disliked], [], [], "movie");

    expect(ranked[0].title).toBe("Adventure Match");
    expect(ranked[0].reasonTitles).toEqual(["Loved Adventure"]);
    expect(ranked[0].personalized).toBe(true);
  });
});
