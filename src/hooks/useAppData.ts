import { useCallback, useEffect, useState } from "react";
import { loadAppData, saveAppData } from "../lib/storage";
import type { AppData, MediaItem, MediaType, RatedItem, RatingValue } from "../types";

export function useAppData() {
  const [data, setData] = useState<AppData>(() => loadAppData());

  useEffect(() => saveAppData(data), [data]);

  const rateItem = useCallback((item: MediaItem, rating: RatingValue) => {
    const ratedItem: RatedItem = { ...item, rating, ratedAt: new Date().toISOString() };
    setData((current) => ({
      ...current,
      rated: [ratedItem, ...current.rated.filter((saved) => saved.id !== item.id || saved.mediaType !== item.mediaType)],
      watchlist: current.watchlist.filter((saved) => saved.id !== item.id || saved.mediaType !== item.mediaType),
    }));
  }, []);

  const removeRating = useCallback((item: MediaItem) => {
    setData((current) => ({
      ...current,
      rated: current.rated.filter((saved) => saved.id !== item.id || saved.mediaType !== item.mediaType),
    }));
  }, []);

  const addToWatchlist = useCallback((item: MediaItem) => {
    setData((current) => {
      const exists = current.watchlist.some((saved) => saved.id === item.id && saved.mediaType === item.mediaType);
      if (exists) return current;
      return { ...current, watchlist: [{ ...item, addedAt: new Date().toISOString() }, ...current.watchlist] };
    });
  }, []);

  const removeFromWatchlist = useCallback((item: MediaItem) => {
    setData((current) => ({
      ...current,
      watchlist: current.watchlist.filter((saved) => saved.id !== item.id || saved.mediaType !== item.mediaType),
    }));
  }, []);

  const dismissRecommendation = useCallback((mediaType: MediaType, id: number) => {
    setData((current) => ({
      ...current,
      dismissed: {
        ...current.dismissed,
        [mediaType]: [...new Set([...current.dismissed[mediaType], id])],
      },
    }));
  }, []);

  return { data, setData, rateItem, removeRating, addToWatchlist, removeFromWatchlist, dismissRecommendation };
}
