import { useEffect, useState } from "react";
import { AppShell } from "./components/AppShell";
import { useAppData } from "./hooks/useAppData";
import { EMPTY_DATA } from "./lib/constants";
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
  const { data, setData, rateItem, removeRating, addToWatchlist, removeFromWatchlist, dismissRecommendation } = useAppData();

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
    setData((current) => ({ ...current, dismissed: { movie: [], tv: [] } }));
    setToast("Rejected suggestions can appear again.");
  };

  const clearData = () => {
    setData(structuredClone(EMPTY_DATA));
    setToast("Ratings and watchlist deleted.");
  };

  const content = (() => {
    switch (screen) {
      case "catalog":
        return <CatalogScreen mediaType={catalogType} token={token} rated={data.rated} onBack={() => setScreen("home")} onOpenSettings={() => setScreen("settings")} onRate={rateItem} onToast={setToast} />;
      case "recommend":
        return <RecommendScreen token={token} data={data} onBack={() => setScreen("home")} onOpenSettings={() => setScreen("settings")} onAdd={addToWatchlist} onDismiss={dismissRecommendation} onToast={setToast} />;
      case "watched":
        return <WatchedScreen rated={data.rated} onRate={rateItem} onRemove={removeRating} />;
      case "watchlist":
        return <WatchlistScreen items={data.watchlist} onRate={rateItem} onRemove={removeFromWatchlist} />;
      case "settings":
        return <SettingsScreen token={token} data={data} onSaveToken={updateToken} onReplaceData={setData} onResetDismissed={resetDismissed} onClearData={clearData} onToast={setToast} />;
      case "home":
      default:
        return <HomeScreen data={data} onNavigate={setScreen} onCatalog={openCatalog} />;
    }
  })();

  return (
    <AppShell screen={screen} onNavigate={setScreen}>
      {content}
      {toast && <div className="toast" role="status">{toast}</div>}
    </AppShell>
  );
}
