import { Bookmark, CheckCircle2, Home, Settings } from "lucide-react";
import type { ReactNode } from "react";
import type { Profile, ScreenName } from "../types";
import { ProfileSwitcher } from "./ProfileSwitcher";

interface AppShellProps {
  children: ReactNode;
  screen: ScreenName;
  onNavigate: (screen: ScreenName) => void;
  profiles: Profile[];
  activeProfile: Profile;
  onSelectProfile: (profileId: string) => void;
  onCreateProfile: (name: string) => void;
}

const items = [
  { screen: "home" as const, label: "Home", Icon: Home },
  { screen: "watched" as const, label: "Watched", Icon: CheckCircle2 },
  { screen: "watchlist" as const, label: "Watchlist", Icon: Bookmark },
  { screen: "settings" as const, label: "Settings", Icon: Settings },
];

export function AppShell({ children, screen, onNavigate, profiles, activeProfile, onSelectProfile, onCreateProfile }: AppShellProps) {
  return (
    <div className="app-shell">
      <main className="app-main">
        <ProfileSwitcher profiles={profiles} activeProfile={activeProfile} onSelect={onSelectProfile} onCreate={onCreateProfile} />
        {children}
      </main>
      <nav className="bottom-nav" aria-label="Main navigation">
        {items.map(({ screen: destination, label, Icon }) => (
          <button
            className={screen === destination ? "bottom-nav__item is-active" : "bottom-nav__item"}
            key={destination}
            type="button"
            onClick={() => onNavigate(destination)}
            aria-current={screen === destination ? "page" : undefined}
          >
            <Icon size={23} strokeWidth={1.9} />
            <span>{label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
