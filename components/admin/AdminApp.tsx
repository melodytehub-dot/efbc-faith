"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { api, ApiError } from "@/lib/api";
import { Icon } from "@/components/Icon";
import { church } from "@/lib/church";
import { formatWhen } from "@/lib/format";
import { AnnouncementPanel, EventsPanel, LivePanel, SermonPanel, type LiveState, type SermonState } from "./AdminPanels";

type Tab = "overview" | "live" | "events" | "sermon" | "announcement";

const TABS: { id: Tab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "live", label: "Live stream" },
  { id: "events", label: "Events" },
  { id: "sermon", label: "Featured sermon" },
  { id: "announcement", label: "Announcement" },
];

export function AdminApp() {
  const [status, setStatus] = useState<"checking" | "signed-out" | "signed-in">("checking");
  const [tab, setTab] = useState<Tab>("overview");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.classList.add("is-admin");
    return () => document.body.classList.remove("is-admin");
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  function openSection(next: Tab) {
    setTab(next);
    setMenuOpen(false);
  }

  useEffect(() => {
    api("/api/admin/session")
      .then(() => setStatus("signed-in"))
      .catch(() => setStatus("signed-out"));
  }, []);

  const expire = useCallback(() => setStatus("signed-out"), []);

  async function signOut() {
    await api("/api/admin/logout", { method: "POST" }).catch(() => {});
    setStatus("signed-out");
    setTab("overview");
  }

  if (status === "checking") {
    return (
      <div className="admin-login">
        <p className="fine">Loading…</p>
      </div>
    );
  }

  if (status === "signed-out") {
    return <Login onSignedIn={() => setStatus("signed-in")} />;
  }

  return (
    <div className="admin">
      <header className="admin-top">
        <a href="/admin/" className="admin-logo" aria-label="EFBC admin home">
          <img className="brand-logo brand-logo-sm" src="/images/logo-full.png" alt={church.name} width={750} height={150} />
        </a>
        <button
          type="button"
          className="menu-btn"
          aria-expanded={menuOpen}
          aria-controls="admin-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <Icon name={menuOpen ? "close" : "menu"} />
        </button>
      </header>

      <div className="admin-shell">
        <div className="admin-scrim" data-open={menuOpen} aria-hidden="true" onClick={() => setMenuOpen(false)} />
        <aside className="admin-side" id="admin-menu" data-open={menuOpen} aria-label="Admin menu">
          <div className="admin-side-head">
            <a href="/admin/" className="admin-logo" aria-label="EFBC admin home">
              <img className="brand-logo brand-logo-sm" src="/images/logo-full.png" alt={church.name} width={750} height={150} />
            </a>
            <button type="button" className="menu-btn admin-side-close" aria-label="Close menu" onClick={() => setMenuOpen(false)}>
              <Icon name="close" />
            </button>
          </div>
          <nav className="admin-nav" aria-label="Admin sections">
            {TABS.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-current={tab === item.id ? "page" : undefined}
                onClick={() => openSection(item.id)}
              >
                {item.label}
              </button>
            ))}
          </nav>
          <div className="admin-side-foot">
            <a className="admin-nav-link" href="/">
              View website
            </a>
            <button type="button" className="admin-nav-link" onClick={signOut}>
              Sign out
            </button>
          </div>
        </aside>

        <main className="admin-main">
          {tab === "overview" && <Overview onOpen={openSection} onExpired={expire} />}
          {tab === "live" && <LivePanel onExpired={expire} />}
          {tab === "events" && <EventsPanel onExpired={expire} />}
          {tab === "sermon" && <SermonPanel onExpired={expire} />}
          {tab === "announcement" && <AnnouncementPanel onExpired={expire} />}
        </main>
      </div>
    </div>
  );
}

function Login({ onSignedIn }: { onSignedIn: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await api("/api/admin/login", { body: { password } });
      onSignedIn();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setBusy(false);
    }
  }

  return (
    <div className="admin-login">
      <form className="admin-card admin-login-card" onSubmit={submit}>
        <img className="brand-logo brand-logo-lg admin-login-logo" src="/images/logo-full.png" alt={church.name} width={750} height={150} />
        <h1>Sign in</h1>
        <p className="fine">Enter the admin password to manage the website.</p>
        <div className="field">
          <label htmlFor="admin-password">Password</label>
          <input
            id="admin-password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && (
          <p className="notice notice-error" role="alert">
            {error}
          </p>
        )}
        <button type="submit" className="btn btn-primary" disabled={busy || !password}>
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}

type Summary = {
  live: LiveState | null;
  sermon: SermonState | null;
  announcement: { active: boolean; text: string } | null;
  events: { startsAt: string; published: boolean; title: string; location: string | null; endsAt: string | null }[] | null;
};

function Overview({ onOpen, onExpired }: { onOpen: (tab: Tab) => void; onExpired: () => void }) {
  const [summary, setSummary] = useState<Summary>({ live: null, sermon: null, announcement: null, events: null });

  useEffect(() => {
    let active = true;
    const handle = (err: unknown) => {
      if (err instanceof ApiError && err.status === 401) onExpired();
    };
    api<LiveState>("/api/admin/live")
      .then((live) => active && setSummary((s) => ({ ...s, live })))
      .catch(handle);
    api<{ sermon: SermonState }>("/api/admin/sermon")
      .then((d) => active && setSummary((s) => ({ ...s, sermon: d.sermon })))
      .catch(handle);
    api<{ active: boolean; text: string }>("/api/admin/announcement")
      .then((announcement) => active && setSummary((s) => ({ ...s, announcement })))
      .catch(handle);
    api<{ events: Summary["events"] }>("/api/admin/events")
      .then((d) => active && setSummary((s) => ({ ...s, events: d.events })))
      .catch(handle);
    return () => {
      active = false;
    };
  }, [onExpired]);

  const today = new Date().toLocaleDateString("en-CA", { timeZone: "America/Chicago" });
  const upcoming = summary.events?.filter((e) => e.published && e.startsAt.slice(0, 10) >= today) ?? [];
  const nextEvent = upcoming[0];

  return (
    <div className="admin-stack">
      <h1 className="admin-title">Overview</h1>
      <div className="admin-grid">
        <div className="card admin-stat">
          <span className="admin-stat-label">Live stream</span>
          <strong>{summary.live ? (summary.live.isLive ? "Live now" : "Off air") : "…"}</strong>
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => onOpen("live")}>
            Manage live stream
          </button>
        </div>
        <div className="card admin-stat">
          <span className="admin-stat-label">Upcoming events</span>
          <strong>{summary.events ? upcoming.length : "…"}</strong>
          {nextEvent && <span className="fine">Next: {formatWhen(nextEvent.startsAt, nextEvent.endsAt)}</span>}
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => onOpen("events")}>
            Manage events
          </button>
        </div>
        <div className="card admin-stat">
          <span className="admin-stat-label">Announcement</span>
          <strong>{summary.announcement ? (summary.announcement.active ? "Showing on website" : "Hidden") : "…"}</strong>
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => onOpen("announcement")}>
            Edit announcement
          </button>
        </div>
        <div className="card admin-stat">
          <span className="admin-stat-label">Featured sermon</span>
          <strong>{summary.sermon ? summary.sermon.title : "Default video"}</strong>
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => onOpen("sermon")}>
            Change featured sermon
          </button>
        </div>
      </div>
    </div>
  );
}
