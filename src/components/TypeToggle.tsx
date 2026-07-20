import { MEDIA_LABELS } from "../lib/constants";
import type { MediaType } from "../types";

export function TypeToggle({ value, onChange }: { value: MediaType; onChange: (type: MediaType) => void }) {
  return (
    <div className="type-toggle" role="group" aria-label="Media type">
      {(["movie", "tv"] as const).map((type) => (
        <button className={value === type ? "is-active" : ""} key={type} type="button" onClick={() => onChange(type)} aria-pressed={value === type}>
          {MEDIA_LABELS[type]}
        </button>
      ))}
    </div>
  );
}
