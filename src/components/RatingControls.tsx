import { Frown, Meh, Smile } from "lucide-react";
import { RATING_LABELS } from "../lib/constants";
import type { RatingValue } from "../types";

const options = [
  { value: "dislike" as const, Icon: Frown },
  { value: "neutral" as const, Icon: Meh },
  { value: "like" as const, Icon: Smile },
];

export function RatingControls({ selected, onRate }: { selected?: RatingValue; onRate: (rating: RatingValue) => void }) {
  return (
    <div className="rating-controls" aria-label="Choose a rating">
      {options.map(({ value, Icon }) => (
        <button
          className={selected === value ? `rating-button rating-button--${value} is-selected` : `rating-button rating-button--${value}`}
          key={value}
          type="button"
          onClick={() => onRate(value)}
          aria-pressed={selected === value}
        >
          <Icon size={26} />
          <span>{RATING_LABELS[value]}</span>
        </button>
      ))}
    </div>
  );
}
