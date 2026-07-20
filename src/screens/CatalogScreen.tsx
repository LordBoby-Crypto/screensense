import { Check, ChevronDown, ChevronUp, LoaderCircle, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { MediaPoster } from "../components/MediaPoster";
import { RatingControls } from "../components/RatingControls";
import { ScreenHeader } from "../components/ScreenHeader";
import { TokenRequired } from "../components/TokenRequired";
import { MEDIA_LABELS, RATING_LABELS } from "../lib/constants";
import { searchMedia } from "../lib/tmdb";
import type { MediaItem, MediaType, RatedItem, RatingValue } from "../types";

interface CatalogScreenProps {
  mediaType: MediaType;
  token: string;
  rated: RatedItem[];
  onBack: () => void;
  onOpenSettings: () => void;
  onRate: (item: MediaItem, rating: RatingValue) => void;
  onToast: (message: string) => void;
}

export function CatalogScreen({ mediaType, token, rated, onBack, onOpenSettings, onRate, onToast }: CatalogScreenProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<MediaItem[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const ratings = useMemo(() => new Map(rated.filter((item) => item.mediaType === mediaType).map((item) => [item.id, item.rating])), [rated, mediaType]);

  useEffect(() => {
    const cleanQuery = query.trim();
    if (!token || cleanQuery.length < 2) return;

    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      setLoading(true);
      setError("");
      searchMedia(token, mediaType, cleanQuery, controller.signal)
        .then(setResults)
        .catch((caught: unknown) => {
          if (caught instanceof DOMException && caught.name === "AbortError") return;
          setError(caught instanceof Error ? caught.message : "Search failed. Try again.");
        })
        .finally(() => setLoading(false));
    }, 350);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [query, token, mediaType]);

  const handleRate = (item: MediaItem, rating: RatingValue) => {
    onRate(item, rating);
    onToast(`${item.title}: ${RATING_LABELS[rating]}`);
    setExpandedId(null);
  };

  const handleQueryChange = (value: string) => {
    setQuery(value);
    if (value.trim().length < 2) {
      setResults([]);
      setLoading(false);
      setError("");
    }
  };

  return (
    <div className="screen-pad screen-pad--top">
      <ScreenHeader title={MEDIA_LABELS[mediaType]} onBack={onBack} />
      {!token ? (
        <TokenRequired onOpenSettings={onOpenSettings} />
      ) : (
        <>
          <label className="search-field">
            <Search size={20} />
            <input value={query} onChange={(event) => handleQueryChange(event.target.value)} placeholder={`Search every ${mediaType === "movie" ? "movie" : "TV show"}`} autoComplete="off" autoFocus />
            {loading && <LoaderCircle className="spin" size={20} />}
          </label>
          <p className="helper-text">Search by title, then tell ScreenSense what you thought.</p>
          {error && <div className="inline-error" role="alert">{error}</div>}
          {query.trim().length > 1 && !loading && !error && results.length === 0 && <div className="quiet-state">No matching titles found.</div>}
          <div className="result-list">
            {results.map((item) => {
              const isExpanded = expandedId === item.id;
              const existingRating = ratings.get(item.id);
              return (
                <article className={isExpanded ? "result-card is-expanded" : "result-card"} key={item.id}>
                  <button className="result-card__summary" type="button" onClick={() => setExpandedId(isExpanded ? null : item.id)} aria-expanded={isExpanded}>
                    <MediaPoster path={item.posterPath} title={item.title} size="row" />
                    <span className="result-card__copy">
                      <strong>{item.title}</strong>
                      <small>{item.date.slice(0, 4) || "Year unknown"}{item.originalTitle !== item.title ? ` · ${item.originalTitle}` : ""}</small>
                      {existingRating && <em><Check size={13} /> {RATING_LABELS[existingRating]}</em>}
                    </span>
                    {isExpanded ? <ChevronUp /> : <ChevronDown />}
                  </button>
                  {isExpanded && (
                    <div className="result-card__rating">
                      <p>How did you feel about this?</p>
                      <RatingControls selected={existingRating} onRate={(rating) => handleRate(item, rating)} />
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
