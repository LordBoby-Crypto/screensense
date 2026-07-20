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
    expect(() => importAppData('{"version":2}')).toThrow("not a valid ScreenSense backup");
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
