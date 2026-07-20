import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import App from "./App";

describe("ScreenSense app shell", () => {
  beforeEach(() => localStorage.clear());

  it("shows the three primary choices on first launch", () => {
    render(<App />);
    expect(screen.getByRole("button", { name: /Recommend/ })).toBeVisible();
    expect(screen.getByRole("button", { name: /Movies/ })).toBeVisible();
    expect(screen.getByRole("button", { name: /TV Shows/ })).toBeVisible();
  });

  it("routes movie search to the honest token setup state", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: /Movies/ }));
    expect(screen.getByRole("heading", { name: "Movies" })).toBeVisible();
    expect(screen.getByText("Connect the movie catalog")).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Open Settings" }));
    expect(screen.getByRole("heading", { name: "Settings" })).toBeVisible();
  });

  it("shows a real empty watched-library state", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "Watched" }));
    expect(screen.getByText("No ratings here yet")).toBeVisible();
  });

  it("creates and switches to a separate profile", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: /Current profile: My Profile/ }));
    fireEvent.click(screen.getByRole("button", { name: "Add profile" }));
    fireEvent.change(screen.getByLabelText("Profile name"), { target: { value: "Family" } });
    fireEvent.click(screen.getByRole("button", { name: "Create profile" }));

    expect(screen.getByRole("button", { name: /Current profile: Family/ })).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: /Current profile: Family/ }));
    expect(screen.getByRole("button", { name: "My Profile" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Family" })).toBeVisible();
  });
});
