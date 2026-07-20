import { EMPTY_DATA, STORAGE_KEY, TOKEN_KEY } from "./constants";
import type { AppData, Profile, RatedItem, WatchlistItem } from "../types";

interface LegacyAppData {
  version: 1;
  rated: RatedItem[];
  watchlist: WatchlistItem[];
  dismissed: { movie: number[]; tv: number[] };
}

function isProfile(value: unknown): value is Profile {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Partial<Profile>;
  return typeof candidate.id === "string" && typeof candidate.name === "string" && typeof candidate.createdAt === "string" && Array.isArray(candidate.rated) && Array.isArray(candidate.watchlist) && typeof candidate.dismissed === "object" && candidate.dismissed !== null && Array.isArray(candidate.dismissed.movie) && Array.isArray(candidate.dismissed.tv);
}

function isAppData(value: unknown): value is AppData {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Partial<AppData>;
  return candidate.version === 2 && typeof candidate.activeProfileId === "string" && Array.isArray(candidate.profiles) && candidate.profiles.length > 0 && candidate.profiles.every(isProfile) && candidate.profiles.some((profile) => profile.id === candidate.activeProfileId);
}

function isLegacyAppData(value: unknown): value is LegacyAppData {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Partial<LegacyAppData>;
  return candidate.version === 1 && Array.isArray(candidate.rated) && Array.isArray(candidate.watchlist) && typeof candidate.dismissed === "object" && candidate.dismissed !== null && Array.isArray(candidate.dismissed.movie) && Array.isArray(candidate.dismissed.tv);
}

function migrateLegacyData(data: LegacyAppData): AppData {
  return {
    version: 2,
    activeProfileId: "default",
    profiles: [{
      id: "default",
      name: "My Profile",
      createdAt: new Date().toISOString(),
      rated: data.rated,
      watchlist: data.watchlist,
      dismissed: data.dismissed,
    }],
  };
}

function parseAppData(value: unknown): AppData | null {
  if (isAppData(value)) return value;
  if (isLegacyAppData(value)) return migrateLegacyData(value);
  return null;
}

export function loadAppData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(EMPTY_DATA);
    const parsed: unknown = JSON.parse(raw);
    return parseAppData(parsed) ?? structuredClone(EMPTY_DATA);
  } catch {
    return structuredClone(EMPTY_DATA);
  }
}

export function saveAppData(data: AppData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function loadToken(): string {
  return localStorage.getItem(TOKEN_KEY) ?? "";
}

export function saveToken(token: string): void {
  const cleanToken = token.trim();
  if (cleanToken) localStorage.setItem(TOKEN_KEY, cleanToken);
  else localStorage.removeItem(TOKEN_KEY);
}

export function exportAppData(data: AppData): string {
  return JSON.stringify(data, null, 2);
}

export function importAppData(raw: string): AppData {
  const parsed: unknown = JSON.parse(raw);
  const data = parseAppData(parsed);
  if (!data) throw new Error("That file is not a valid ScreenSense backup.");
  return data;
}
