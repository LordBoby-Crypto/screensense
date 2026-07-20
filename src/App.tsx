import { useEffect, useState } from "react";
import { AppShell } from "./components/AppShell";
import { useAppData } from "./hooks/useAppData";
import { EMPTY_PROFILE_DATA } from "./lib/constants";
import { loadToken, saveToken } from "./lib/storage";
import { CatalogScreen } from "./screens/CatalogScreen";
import { HomeScreen } from "./screens/HomeScreen";
import { RecommendScreen } from "./screens/RecommendScreen";
import { SettingsScreen } from "./screens/SettingsScreen";
import { WatchedScreen } from "./screens/WatchedScreen";
import { WatchlistScreen } from "./screens/WatchlistScreen";
import type { MediaType, ScreenName } from "./types";

export default function App() {
  const [screen, setScreen] = useState<ScreenName>("home");
  const [catalogType, setCatalogType] = useState<MediaType>("movie");
  const [token, setToken] = useState(() => loadToken());
  const [toast, setToast] = useState("");
  const { data, setData, activeProfile, updateActiveProfile, selectProfile, createProfile, renameActiveProfile, deleteActiveProfile, rateItem, removeRating, addToWatchlist, removeFromWatchlist, dismissRecommendation } = useAppData();

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 2800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const openCatalog = (type: MediaType) => {
    setCatalogType(type);
    setScreen("catalog");
  };

  const updateToken = (nextToken: string) => {
    saveToken(nextToken);
    setToken(nextToken);
  };

  const resetDismissed = () => {
    updateActiveProfile((profile) => ({ ...profile, dismissed: { movie: [], tv: [] } }));
    setToast(`${activeProfile.name} can see rejected suggestions again.`);
  };

  const clearData = () => {
    updateActiveProfile((profile) => ({ ...profile, ...structuredClone(EMPTY_PROFILE_DATA) }));
    setToast(`${activeProfile.name}’s ratings and watchlist were deleted.`);
  };

  const content = (() => {
    switch (screen) {
      case "catalog":
        return <CatalogScreen mediaType={catalogType} token={token} rated={activeProfile.rated} onBack={() => setScreen("home")} onOpenSettings={() => setScreen("settings")} onRate={rateItem} onToast={setToast} />;
      case "recommend":
        return <RecommendScreen token={token} data={activeProfile} onBack={() => setScreen("home")} onOpenSettings={() => setScreen("settings")} onAdd={addToWatchlist} onDismiss={dismissRecommendation} onToast={setToast} />;
      case "watched":
        return <WatchedScreen rated={activeProfile.rated} onRate={rateItem} onRemove={removeRating} />;
      case "watchlist":
        return <WatchlistScreen items={activeProfile.watchlist} onRate={rateItem} onRemove={removeFromWatchlist} />;
      case "settings":
        return <SettingsScreen key={activeProfile.id} token={token} data={data} activeProfile={activeProfile} onSaveToken={updateToken} onReplaceData={setData} onRenameProfile={renameActiveProfile} onDeleteProfile={deleteActiveProfile} onResetDismissed={resetDismissed} onClearData={clearData} onToast={setToast} />;
      case "home":
      default:
        return <HomeScreen data={activeProfile} onNavigate={setScreen} onCatalog={openCatalog} />;
    }
  })();

  return (
    <AppShell screen={screen} onNavigate={setScreen} profiles={data.profiles} activeProfile={activeProfile} onSelectProfile={selectProfile} onCreateProfile={createProfile}>
      {content}
      {toast && <div className="toast" role="status">{toast}</div>}
    </AppShell>
  );
}
