import { beforeEach, describe, expect, it } from "vitest";
import { EMPTY_DATA, STORAGE_KEY, TOKEN_KEY } from "./constants";
import { exportAppData, importAppData, loadAppData, loadToken, saveAppData, saveToken } from "./storage";

describe("local storage", () => {
  beforeEach(() => localStorage.clear());

  it("returns clean data when nothing has been saved", () => {
    expect(loadAppData()).toEqual(EMPTY_DATA);
  });

  it("round trips a valid backup", () => {
    const backup = exportAppData(EMPTY_DATA);
    expect(importAppData(backup)).toEqual(EMPTY_DATA);
  });

  it("rejects malformed or unsupported backups", () => {
    expect(() => importAppData('{"version":3}')).toThrow("not a valid ScreenSense backup");
  });

  it("moves version 1 data into a default profile", () => {
    const legacy = {
      version: 1,
      rated: [{ id: 42, mediaType: "movie", title: "A Film", originalTitle: "A Film", overview: "", posterPath: null, backdropPath: null, date: "2020-01-01", genreIds: [18], voteAverage: 8, popularity: 10, rating: "like", ratedAt: "2026-01-01T00:00:00.000Z" }],
      watchlist: [],
      dismissed: { movie: [7], tv: [] },
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(legacy));
    const migrated = loadAppData();
    expect(migrated.version).toBe(2);
    expect(migrated.profiles).toHaveLength(1);
    expect(migrated.profiles[0].name).toBe("My Profile");
    expect(migrated.profiles[0].rated[0].title).toBe("A Film");
    expect(migrated.profiles[0].dismissed.movie).toEqual([7]);
  });

  it("saves app data and keeps the API token separate", () => {
    saveAppData(EMPTY_DATA);
    saveToken("secret-token");
    expect(localStorage.getItem(STORAGE_KEY)).toBeTruthy();
    expect(localStorage.getItem(STORAGE_KEY)).not.toContain("secret-token");
    expect(localStorage.getItem(TOKEN_KEY)).toBe("secret-token");
    expect(loadToken()).toBe("secret-token");
  });
});
