import { Check, Download, ExternalLink, KeyRound, RotateCcw, Share, Trash2, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { ScreenHeader } from "../components/ScreenHeader";
import { exportAppData, importAppData } from "../lib/storage";
import { validateToken } from "../lib/tmdb";
import type { AppData } from "../types";

interface SettingsScreenProps {
  token: string;
  data: AppData;
  onSaveToken: (token: string) => void;
  onReplaceData: (data: AppData) => void;
  onResetDismissed: () => void;
  onClearData: () => void;
  onToast: (message: string) => void;
}

export function SettingsScreen({ token, data, onSaveToken, onReplaceData, onResetDismissed, onClearData, onToast }: SettingsScreenProps) {
  const [draftToken, setDraftToken] = useState(token);
  const [saving, setSaving] = useState(false);
  const [tokenError, setTokenError] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);

  const save = async () => {
    const cleanToken = draftToken.trim();
    setSaving(true);
    setTokenError("");
    try {
      if (cleanToken) await validateToken(cleanToken);
      onSaveToken(cleanToken);
      onToast(cleanToken ? "TMDB token connected." : "TMDB token removed.");
    } catch (caught) {
      setTokenError(caught instanceof Error ? caught.message : "The token could not be verified.");
    } finally {
      setSaving(false);
    }
  };

  const downloadBackup = () => {
    const blob = new Blob([exportAppData(data)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `screensense-backup-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    onToast("Backup prepared. Save it in Files.");
  };

  const restoreBackup = async (file?: File) => {
    if (!file) return;
    try {
      const restored = importAppData(await file.text());
      onReplaceData(restored);
      onToast("Your ScreenSense backup was restored.");
    } catch (caught) {
      onToast(caught instanceof Error ? caught.message : "The backup could not be restored.");
    } finally {
      if (fileInput.current) fileInput.current.value = "";
    }
  };

  const confirmClear = () => {
    if (window.confirm("Delete every rating, watchlist item, and dismissed recommendation on this iPhone? This cannot be undone without a backup.")) onClearData();
  };

  return (
    <div className="screen-pad screen-pad--top settings-screen">
      <ScreenHeader title="Settings" />
      <section className="settings-card">
        <div className="settings-card__heading"><KeyRound /><div><h2>TMDB connection</h2><p>Required for searches, posters, and recommendations.</p></div></div>
        <label className="field-label" htmlFor="tmdb-token">Read Access Token</label>
        <input id="tmdb-token" className="text-field" type="password" value={draftToken} onChange={(event) => setDraftToken(event.target.value)} autoCapitalize="none" autoCorrect="off" spellCheck={false} placeholder="Paste your TMDB Read Access Token" />
        {tokenError && <p className="field-error" role="alert">{tokenError}</p>}
        <button className="button button--primary" type="button" onClick={save} disabled={saving}>{saving ? "Checking token…" : <><Check size={19} /> Save and verify</>}</button>
        <a className="text-link" href="https://www.themoviedb.org/settings/api" target="_blank" rel="noreferrer">Get a free TMDB token <ExternalLink size={15} /></a>
        <p className="privacy-note">The token stays in this iPhone’s browser storage and is sent only to TMDB.</p>
      </section>

      <section className="settings-card">
        <div className="settings-card__heading"><Share /><div><h2>Add to iPhone Home Screen</h2><p>Open this site in Safari, tap Share, then tap “Add to Home Screen.”</p></div></div>
      </section>

      <section className="settings-card">
        <div className="settings-card__heading"><Download /><div><h2>Backup your data</h2><p>Your data exists only on this iPhone. Export a backup before clearing Safari data or changing phones.</p></div></div>
        <div className="settings-actions">
          <button className="button button--secondary" type="button" onClick={downloadBackup}><Download size={18} /> Export backup</button>
          <button className="button button--secondary" type="button" onClick={() => fileInput.current?.click()}><Upload size={18} /> Restore backup</button>
          <input ref={fileInput} className="sr-only" type="file" accept="application/json,.json" onChange={(event) => restoreBackup(event.target.files?.[0])} />
        </div>
      </section>

      <section className="settings-card">
        <div className="settings-actions">
          <button className="button button--secondary" type="button" onClick={onResetDismissed}><RotateCcw size={18} /> Reset rejected suggestions</button>
          <button className="button button--danger" type="button" onClick={confirmClear}><Trash2 size={18} /> Delete ratings and watchlist</button>
        </div>
      </section>

      <footer className="attribution">
        <strong>ScreenSense 1.0</strong>
        <p>This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
        <p>No account, analytics, ads, or cloud database.</p>
      </footer>
    </div>
  );
}
