import { Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { MediaPoster } from "../components/MediaPoster";
import { RatingControls } from "../components/RatingControls";
import { ScreenHeader } from "../components/ScreenHeader";
import { TypeToggle } from "../components/TypeToggle";
import { RATING_LABELS } from "../lib/constants";
import type { MediaItem, MediaType, RatedItem, RatingValue } from "../types";

export function WatchedScreen({ rated, onRate, onRemove }: { rated: RatedItem[]; onRate: (item: MediaItem, rating: RatingValue) => void; onRemove: (item: MediaItem) => void }) {
  const [mediaType, setMediaType] = useState<MediaType>("movie");
  const [query, setQuery] = useState("");
  const visible = useMemo(() => rated.filter((item) => item.mediaType === mediaType && item.title.toLowerCase().includes(query.toLowerCase())), [rated, mediaType, query]);

  return (
    <div className="screen-pad screen-pad--top">
      <ScreenHeader title="Watched" />
      <TypeToggle value={mediaType} onChange={setMediaType} />
      <label className="search-field search-field--compact"><Search size={19} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Filter your ratings" /></label>
      {visible.length === 0 ? (
        <section className="empty-state empty-state--compact"><h2>No ratings here yet</h2><p>Use Movies or TV Shows on the Home screen to add them.</p></section>
      ) : (
        <div className="library-list">
          {visible.map((item) => (
            <article className="library-card" key={`${item.mediaType}-${item.id}`}>
              <div className="library-card__summary">
                <MediaPoster path={item.posterPath} title={item.title} size="row" />
                <div><h2>{item.title}</h2><p>{item.date.slice(0, 4) || "Year unknown"}</p><strong className={`rating-text rating-text--${item.rating}`}>{RATING_LABELS[item.rating]}</strong></div>
                <button className="icon-button icon-button--danger" type="button" onClick={() => onRemove(item)} aria-label={`Remove ${item.title} rating`}><Trash2 size={19} /></button>
              </div>
              <RatingControls selected={item.rating} onRate={(rating) => onRate(item, rating)} />
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
