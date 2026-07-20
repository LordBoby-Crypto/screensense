import { Bookmark, LoaderCircle, RefreshCw, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { MediaPoster } from "../components/MediaPoster";
import { ScreenHeader } from "../components/ScreenHeader";
import { TokenRequired } from "../components/TokenRequired";
import { TypeToggle } from "../components/TypeToggle";
import { fetchGenres } from "../lib/tmdb";
import { getRecommendations } from "../lib/recommendations";
import type { MediaItem, MediaType, ProfileData, Recommendation } from "../types";

interface RecommendScreenProps {
  token: string;
  data: ProfileData;
  onBack: () => void;
  onOpenSettings: () => void;
  onAdd: (item: MediaItem) => void;
  onDismiss: (type: MediaType, id: number) => void;
  onToast: (message: string) => void;
}

export function RecommendScreen({ token, data, onBack, onOpenSettings, onAdd, onDismiss, onToast }: RecommendScreenProps) {
  const [mediaType, setMediaType] = useState<MediaType>("movie");
  const [items, setItems] = useState<Recommendation[]>([]);
  const [index, setIndex] = useState(0);
  const [genreNames, setGenreNames] = useState<Map<number, string>>(new Map());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [reload, setReload] = useState(0);
  const current = items[index];
  const relevantRatings = useMemo(() => data.rated.filter((item) => item.mediaType === mediaType), [data.rated, mediaType]);

  useEffect(() => {
    if (!token) return;
    let active = true;
    fetchGenres(token, mediaType)
      .then((genres) => {
        if (active) setGenreNames(new Map(genres.map((genre) => [genre.id, genre.name])));
      })
      .catch(() => undefined);
    return () => { active = false; };
  }, [token, mediaType]);

  useEffect(() => {
    if (!token) return;
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      setLoading(true);
      setError("");
      setItems([]);
      setIndex(0);
      getRecommendations(token, mediaType, data.rated, data.watchlist, data.dismissed[mediaType])
        .then((recommendations) => {
          if (active) setItems(recommendations);
        })
        .catch((caught: unknown) => {
          if (active) setError(caught instanceof Error ? caught.message : "Recommendations could not be loaded.");
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    });
    return () => { active = false; };
  }, [token, mediaType, reload, data.rated, data.watchlist, data.dismissed]);

  const showAnother = () => {
    if (!current) return;
    onDismiss(mediaType, current.id);
    if (index + 1 < items.length) setIndex(index + 1);
    else setReload((value) => value + 1);
  };

  const addCurrent = () => {
    if (!current) return;
    onAdd(current);
    onToast(`${current.title} added to your watchlist.`);
    if (index + 1 < items.length) setIndex(index + 1);
    else setReload((value) => value + 1);
  };

  return (
    <div className="screen-pad screen-pad--top recommendation-screen">
      <ScreenHeader title="Recommendation" onBack={onBack} />
      <TypeToggle value={mediaType} onChange={setMediaType} />
      {!token ? (
        <TokenRequired onOpenSettings={onOpenSettings} />
      ) : loading ? (
        <div className="loading-state"><LoaderCircle className="spin" /><p>Finding a strong match…</p></div>
      ) : error ? (
        <section className="empty-state">
          <h2>We hit a problem</h2><p>{error}</p>
          <button className="button button--primary" type="button" onClick={() => setReload((value) => value + 1)}>Try again</button>
        </section>
      ) : current ? (
        <>
          <article className="recommendation-card">
            <div className="recommendation-card__art">
              <MediaPoster path={current.posterPath} title={current.title} />
              <span className="match-pill"><Sparkles size={14} /> {current.personalized ? "Taste match" : "Popular pick"}</span>
            </div>
            <div className="recommendation-card__body">
              <h2>{current.title}</h2>
              <p className="recommendation-meta">
                {current.date.slice(0, 4) || "Year unknown"}
                {current.genreIds.slice(0, 3).map((id) => genreNames.get(id)).filter(Boolean).map((name) => ` · ${name}`).join("")}
              </p>
              <p className="recommendation-overview">{current.overview}</p>
              {current.reasonTitles.length > 0 ? (
                <div className="reason-box">
                  <span>Chosen from your ratings</span>
                  <div>{current.reasonTitles.map((title) => <strong key={title}>{title}</strong>)}</div>
                </div>
              ) : (
                <div className="reason-box reason-box--quiet">
                  <span>{relevantRatings.length > 0 ? "No direct title matches were available, so this uses your genre ratings." : "Rate some titles to personalize future picks."}</span>
                </div>
              )}
            </div>
          </article>
          <div className="recommendation-actions">
            <button className="button button--primary" type="button" onClick={addCurrent}><Bookmark size={20} fill="currentColor" /> Yes, add to Watchlist</button>
            <button className="button button--secondary" type="button" onClick={showAnother}><RefreshCw size={19} /> No, show me another</button>
          </div>
        </>
      ) : (
        <section className="empty-state">
          <h2>No new matches left</h2>
          <p>You have rated, saved, or dismissed every result returned for this category. You can reset dismissed suggestions in Settings.</p>
        </section>
      )}
    </div>
  );
}
