import { BookmarkX, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { MediaPoster } from "../components/MediaPoster";
import { RatingControls } from "../components/RatingControls";
import { ScreenHeader } from "../components/ScreenHeader";
import { TypeToggle } from "../components/TypeToggle";
import type { MediaItem, MediaType, RatingValue, WatchlistItem } from "../types";

export function WatchlistScreen({ items, onRate, onRemove }: { items: WatchlistItem[]; onRate: (item: MediaItem, rating: RatingValue) => void; onRemove: (item: MediaItem) => void }) {
  const [mediaType, setMediaType] = useState<MediaType>("movie");
  const [ratingId, setRatingId] = useState<number | null>(null);
  const visible = items.filter((item) => item.mediaType === mediaType);

  return (
    <div className="screen-pad screen-pad--top">
      <ScreenHeader title="Watchlist" />
      <TypeToggle value={mediaType} onChange={setMediaType} />
      {visible.length === 0 ? (
        <section className="empty-state"><div className="empty-state__icon"><BookmarkX /></div><h2>Your watchlist is empty</h2><p>Say “Yes” to a recommendation and it will appear here.</p></section>
      ) : (
        <div className="library-list">
          {visible.map((item) => (
            <article className="library-card watchlist-card" key={`${item.mediaType}-${item.id}`}>
              <div className="library-card__summary">
                <MediaPoster path={item.posterPath} title={item.title} size="row" />
                <div><h2>{item.title}</h2><p>{item.date.slice(0, 4) || "Year unknown"}</p></div>
                <button className="icon-button icon-button--danger" type="button" onClick={() => onRemove(item)} aria-label={`Remove ${item.title} from watchlist`}><BookmarkX size={19} /></button>
              </div>
              {ratingId === item.id ? (
                <div className="watchlist-rating"><p>How was it?</p><RatingControls onRate={(rating) => onRate(item, rating)} /></div>
              ) : (
                <button className="button button--small" type="button" onClick={() => setRatingId(item.id)}><CheckCircle2 size={18} /> I watched this</button>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
