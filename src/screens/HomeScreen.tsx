import { Bookmark, ChevronRight, Clapperboard, Sparkles, Tv } from "lucide-react";
import { Logo } from "../components/Logo";
import type { AppData, MediaType, ScreenName } from "../types";

interface HomeScreenProps {
  data: AppData;
  onNavigate: (screen: ScreenName) => void;
  onCatalog: (type: MediaType) => void;
}

export function HomeScreen({ data, onNavigate, onCatalog }: HomeScreenProps) {
  return (
    <div className="home-screen screen-pad">
      <Logo />
      <div className="home-heading">
        <p className="eyebrow">YOUR NEXT GREAT WATCH</p>
        <h1>What are you<br />in the mood for?</h1>
        <p>{data.rated.length > 0 ? `${data.rated.length} ratings are shaping your picks.` : "Rate a few favorites and ScreenSense will learn your taste."}</p>
      </div>

      <div className="home-actions">
        <button className="home-action home-action--primary" type="button" onClick={() => onNavigate("recommend")}>
          <span className="home-action__icon"><Sparkles /></span>
          <span><strong>Recommend</strong><small>Find your next watch</small></span>
          <ChevronRight />
        </button>
        <button className="home-action" type="button" onClick={() => onCatalog("movie")}>
          <span className="home-action__icon"><Clapperboard /></span>
          <span><strong>Movies</strong><small>Search and rate movies</small></span>
          <ChevronRight />
        </button>
        <button className="home-action" type="button" onClick={() => onCatalog("tv")}>
          <span className="home-action__icon"><Tv /></span>
          <span><strong>TV Shows</strong><small>Search and rate shows</small></span>
          <ChevronRight />
        </button>
      </div>

      {data.watchlist.length > 0 && (
        <button className="watchlist-peek" type="button" onClick={() => onNavigate("watchlist")}>
          <Bookmark size={19} />
          <span><strong>{data.watchlist.length}</strong> saved to your watchlist</span>
          <ChevronRight size={20} />
        </button>
      )}
    </div>
  );
}
