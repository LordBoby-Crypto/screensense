import { useCallback, useEffect, useState } from "react";
import { EMPTY_PROFILE_DATA } from "../lib/constants";
import { loadAppData, saveAppData } from "../lib/storage";
import type { AppData, MediaItem, MediaType, Profile, ProfileData, RatedItem, RatingValue } from "../types";

function newProfileId(): string {
  return globalThis.crypto?.randomUUID?.() ?? `profile-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function useAppData() {
  const [data, setData] = useState<AppData>(() => loadAppData());
  const activeProfile = data.profiles.find((profile) => profile.id === data.activeProfileId) ?? data.profiles[0];

  useEffect(() => saveAppData(data), [data]);

  const updateActiveProfile = useCallback((updater: (profile: Profile) => Profile) => {
    setData((current) => ({
      ...current,
      profiles: current.profiles.map((profile) => profile.id === current.activeProfileId ? updater(profile) : profile),
    }));
  }, []);

  const rateItem = useCallback((item: MediaItem, rating: RatingValue) => {
    const ratedItem: RatedItem = { ...item, rating, ratedAt: new Date().toISOString() };
    updateActiveProfile((profile) => ({
      ...profile,
      rated: [ratedItem, ...profile.rated.filter((saved) => saved.id !== item.id || saved.mediaType !== item.mediaType)],
      watchlist: profile.watchlist.filter((saved) => saved.id !== item.id || saved.mediaType !== item.mediaType),
    }));
  }, [updateActiveProfile]);

  const removeRating = useCallback((item: MediaItem) => {
    updateActiveProfile((profile) => ({ ...profile, rated: profile.rated.filter((saved) => saved.id !== item.id || saved.mediaType !== item.mediaType) }));
  }, [updateActiveProfile]);

  const addToWatchlist = useCallback((item: MediaItem) => {
    updateActiveProfile((profile) => {
      const exists = profile.watchlist.some((saved) => saved.id === item.id && saved.mediaType === item.mediaType);
      if (exists) return profile;
      return { ...profile, watchlist: [{ ...item, addedAt: new Date().toISOString() }, ...profile.watchlist] };
    });
  }, [updateActiveProfile]);

  const removeFromWatchlist = useCallback((item: MediaItem) => {
    updateActiveProfile((profile) => ({ ...profile, watchlist: profile.watchlist.filter((saved) => saved.id !== item.id || saved.mediaType !== item.mediaType) }));
  }, [updateActiveProfile]);

  const dismissRecommendation = useCallback((mediaType: MediaType, id: number) => {
    updateActiveProfile((profile) => ({
      ...profile,
      dismissed: {
        ...profile.dismissed,
        [mediaType]: [...new Set([...profile.dismissed[mediaType], id])],
      },
    }));
  }, [updateActiveProfile]);

  const selectProfile = useCallback((profileId: string) => {
    setData((current) => current.profiles.some((profile) => profile.id === profileId) ? { ...current, activeProfileId: profileId } : current);
  }, []);

  const createProfile = useCallback((name: string) => {
    const cleanName = name.trim();
    if (!cleanName) return false;
    if (data.profiles.some((profile) => profile.name.toLocaleLowerCase() === cleanName.toLocaleLowerCase())) return false;
    const profile: Profile = { id: newProfileId(), name: cleanName.slice(0, 24), createdAt: new Date().toISOString(), ...structuredClone(EMPTY_PROFILE_DATA) };
    setData((current) => {
      return { ...current, activeProfileId: profile.id, profiles: [...current.profiles, profile] };
    });
    return true;
  }, [data.profiles]);

  const renameActiveProfile = useCallback((name: string) => {
    const cleanName = name.trim().slice(0, 24);
    if (!cleanName) return false;
    if (data.profiles.some((profile) => profile.id !== data.activeProfileId && profile.name.toLocaleLowerCase() === cleanName.toLocaleLowerCase())) return false;
    setData((current) => ({ ...current, profiles: current.profiles.map((profile) => profile.id === current.activeProfileId ? { ...profile, name: cleanName } : profile) }));
    return true;
  }, [data.activeProfileId, data.profiles]);

  const deleteActiveProfile = useCallback(() => {
    if (data.profiles.length === 1) return false;
    setData((current) => {
      const profiles = current.profiles.filter((profile) => profile.id !== current.activeProfileId);
      return { ...current, activeProfileId: profiles[0].id, profiles };
    });
    return true;
  }, [data.profiles.length]);

  const replaceActiveProfileData = useCallback((profileData: ProfileData) => {
    updateActiveProfile((profile) => ({ ...profile, ...profileData }));
  }, [updateActiveProfile]);

  return { data, setData, activeProfile, updateActiveProfile, replaceActiveProfileData, selectProfile, createProfile, renameActiveProfile, deleteActiveProfile, rateItem, removeRating, addToWatchlist, removeFromWatchlist, dismissRecommendation };
}
