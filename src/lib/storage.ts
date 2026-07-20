import { EMPTY_DATA, STORAGE_KEY, TOKEN_KEY } from "./constants";
import type { AppData } from "../types";

function isAppData(value: unknown): value is AppData {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Partial<AppData>;
  return candidate.version === 1 && Array.isArray(candidate.rated) && Array.isArray(candidate.watchlist) && typeof candidate.dismissed === "object";
}

export function loadAppData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(EMPTY_DATA);
    const parsed: unknown = JSON.parse(raw);
    return isAppData(parsed) ? parsed : structuredClone(EMPTY_DATA);
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
  if (!isAppData(parsed)) throw new Error("That file is not a valid ScreenSense backup.");
  return parsed;
}
