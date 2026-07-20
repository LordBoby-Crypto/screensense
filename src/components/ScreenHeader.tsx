import { ChevronLeft } from "lucide-react";
import { Logo } from "./Logo";

export function ScreenHeader({ title, onBack }: { title: string; onBack?: () => void }) {
  return (
    <header className="screen-header">
      {onBack ? (
        <button className="icon-button" type="button" onClick={onBack} aria-label="Go back">
          <ChevronLeft />
        </button>
      ) : (
        <Logo compact />
      )}
      <h1>{title}</h1>
      <span className="screen-header__spacer" aria-hidden="true" />
    </header>
  );
}
