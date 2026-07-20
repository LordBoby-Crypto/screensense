import { Clapperboard } from "lucide-react";
import { TMDB_IMAGE_BASE } from "../lib/constants";

export function MediaPoster({ path, title, size = "card" }: { path: string | null; title: string; size?: "row" | "card" }) {
  const className = `media-poster media-poster--${size}`;
  if (!path) {
    return (
      <div className={`${className} media-poster--missing`} role="img" aria-label={`No poster available for ${title}`}>
        <Clapperboard aria-hidden="true" />
      </div>
    );
  }

  return <img className={className} src={`${TMDB_IMAGE_BASE}/${size === "row" ? "w185" : "w500"}${path}`} alt={`${title} poster`} />;
}
