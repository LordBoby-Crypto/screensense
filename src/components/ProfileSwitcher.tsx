import { Check, ChevronDown, Plus, UserRound, X } from "lucide-react";
import { useState } from "react";
import type { Profile } from "../types";

interface ProfileSwitcherProps {
  profiles: Profile[];
  activeProfile: Profile;
  onSelect: (profileId: string) => void;
  onCreate: (name: string) => void;
}

export function ProfileSwitcher({ profiles, activeProfile, onSelect, onCreate }: ProfileSwitcherProps) {
  const [open, setOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const select = (profileId: string) => {
    onSelect(profileId);
    setOpen(false);
  };

  const create = () => {
    const cleanName = name.trim();
    if (!cleanName) {
      setError("Enter a profile name.");
      return;
    }
    if (profiles.some((profile) => profile.name.toLocaleLowerCase() === cleanName.toLocaleLowerCase())) {
      setError("That profile name already exists.");
      return;
    }
    onCreate(cleanName);
    setName("");
    setError("");
    setAdding(false);
    setOpen(false);
  };

  return (
    <div className="profile-strip">
      <button className="profile-trigger" type="button" onClick={() => setOpen(true)} aria-haspopup="dialog" aria-label={`Current profile: ${activeProfile.name}. Switch profile`}>
        <span className="profile-avatar" aria-hidden="true">{activeProfile.name.charAt(0).toLocaleUpperCase()}</span>
        <span>{activeProfile.name}</span>
        <ChevronDown size={17} />
      </button>

      {open && (
        <div className="profile-overlay" role="presentation" onMouseDown={(event) => { if (event.currentTarget === event.target) setOpen(false); }}>
          <section className="profile-sheet" role="dialog" aria-modal="true" aria-labelledby="profile-title">
            <header className="profile-sheet__header">
              <div><h2 id="profile-title">Who’s watching?</h2><p>Each profile has its own taste and watchlist.</p></div>
              <button className="icon-button" type="button" onClick={() => setOpen(false)} aria-label="Close profile switcher"><X /></button>
            </header>

            <div className="profile-list">
              {profiles.map((profile) => (
                <button className={profile.id === activeProfile.id ? "profile-option is-active" : "profile-option"} type="button" key={profile.id} onClick={() => select(profile.id)}>
                  <span className="profile-avatar" aria-hidden="true">{profile.name.charAt(0).toLocaleUpperCase()}</span>
                  <span>{profile.name}</span>
                  {profile.id === activeProfile.id && <Check size={20} />}
                </button>
              ))}
            </div>

            {adding ? (
              <div className="profile-create">
                <label className="field-label" htmlFor="new-profile-name">Profile name</label>
                <input id="new-profile-name" className="text-field" value={name} onChange={(event) => { setName(event.target.value); setError(""); }} maxLength={24} autoFocus placeholder="Zach, Shanon, Family…" onKeyDown={(event) => { if (event.key === "Enter") create(); }} />
                {error && <p className="field-error" role="alert">{error}</p>}
                <div className="profile-create__actions">
                  <button className="button button--secondary" type="button" onClick={() => { setAdding(false); setName(""); setError(""); }}>Cancel</button>
                  <button className="button button--primary" type="button" onClick={create}>Create profile</button>
                </div>
              </div>
            ) : (
              <button className="button button--secondary" type="button" onClick={() => setAdding(true)}><Plus size={19} /> Add profile</button>
            )}

            <div className="profile-privacy"><UserRound size={16} /><span>Profiles and viewing history stay on this iPhone.</span></div>
          </section>
        </div>
      )}
    </div>
  );
}
