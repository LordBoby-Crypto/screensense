import { KeyRound } from "lucide-react";

export function TokenRequired({ onOpenSettings }: { onOpenSettings: () => void }) {
  return (
    <section className="empty-state">
      <div className="empty-state__icon"><KeyRound /></div>
      <h2>Connect the movie catalog</h2>
      <p>Add your free TMDB Read Access Token before searching or receiving recommendations.</p>
      <button className="button button--primary" type="button" onClick={onOpenSettings}>Open Settings</button>
    </section>
  );
}
