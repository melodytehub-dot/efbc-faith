"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { api, ApiError } from "@/lib/api";
import { formatWhen, youtubeIdFromInput } from "@/lib/format";

export type LiveState = { isLive: boolean; videoId: string | null };
export type SermonState = { videoId: string; title: string; date: string | null } | null;

type Notice = { type: "ok" | "error"; text: string };
type Props = { onExpired: () => void };

function errorText(err: unknown, onExpired: () => void) {
  if (err instanceof ApiError && err.status === 401) {
    onExpired();
    return "Your session has ended. Please sign in again.";
  }
  return err instanceof Error ? err.message : "Something went wrong. Please try again.";
}

function NoticeBox({ notice }: { notice: Notice | null }) {
  if (!notice) return null;
  return (
    <p className={`notice ${notice.type === "ok" ? "notice-ok" : "notice-error"}`} role={notice.type === "ok" ? "status" : "alert"}>
      {notice.text}
    </p>
  );
}

function EmbedPreview({ videoId }: { videoId: string }) {
  return (
    <div className="video admin-preview">
      <iframe src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0`} title="Video preview" allowFullScreen />
    </div>
  );
}

// ---------- Live stream ----------

export function LivePanel({ onExpired }: Props) {
  const [live, setLive] = useState<LiveState | null>(null);
  const [link, setLink] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);

  useEffect(() => {
    api<LiveState>("/api/admin/live")
      .then((data) => {
        setLive(data);
        setLink(data.videoId ? `https://www.youtube.com/watch?v=${data.videoId}` : "");
      })
      .catch((err) => setNotice({ type: "error", text: errorText(err, onExpired) }));
  }, [onExpired]);

  const previewId = youtubeIdFromInput(link);

  async function save(isLive: boolean) {
    setBusy(true);
    setNotice(null);
    try {
      const data = await api<LiveState>("/api/admin/live", { method: "PUT", body: { isLive, youtube: link } });
      setLive(data);
      setNotice({
        type: "ok",
        text: isLive
          ? "You are live. The video now shows on the Live stream page."
          : "The stream has ended. The Live stream page shows the offline message.",
      });
    } catch (err) {
      setNotice({ type: "error", text: errorText(err, onExpired) });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="admin-stack">
      <div className="admin-head">
        <h1 className="admin-title">Live stream</h1>
        {live && <span className={`pill ${live.isLive ? "live-pill" : ""}`}>{live.isLive ? "● Live now" : "Off air"}</span>}
      </div>

      <div className="card admin-card-body">
        <div className="field">
          <label htmlFor="live-link">YouTube live link</label>
          <input
            id="live-link"
            type="url"
            inputMode="url"
            placeholder="https://www.youtube.com/watch?v=…"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
          <span className="fine">
            Open the live stream on YouTube, then copy the link from the address bar or the Share menu.
          </span>
        </div>

        {link && !previewId && (
          <p className="notice notice-error" role="alert">
            That does not look like a YouTube link.
          </p>
        )}

        {previewId && (
          <>
            <p className="fine">Preview of what visitors will see:</p>
            <EmbedPreview videoId={previewId} />
          </>
        )}

        <NoticeBox notice={notice} />

        <div className="btn-row">
          {live?.isLive ? (
            <>
              <button type="button" className="btn btn-primary" disabled={busy || !previewId} onClick={() => save(true)}>
                Update live link
              </button>
              <button type="button" className="btn btn-ghost" disabled={busy} onClick={() => save(false)}>
                End live stream
              </button>
            </>
          ) : (
            <>
              <button type="button" className="btn btn-primary" disabled={busy || !previewId} onClick={() => save(true)}>
                Go live with this link
              </button>
              <button type="button" className="btn btn-ghost" disabled={busy || !previewId} onClick={() => save(false)}>
                Save link without going live
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------- Events ----------

type EventItem = {
  id: string;
  title: string;
  startsAt: string;
  endsAt: string | null;
  location: string | null;
  description: string | null;
  coverKey: string | null;
  coverUrl: string | null;
  published: boolean;
};

type Draft = {
  id?: string;
  title: string;
  date: string;
  startTime: string;
  endDate: string;
  endTime: string;
  location: string;
  description: string;
  published: boolean;
  coverKey: string | null;
  coverUrl: string | null;
};

function draftFrom(event: EventItem | null): Draft {
  if (!event) {
    return { title: "", date: "", startTime: "", endDate: "", endTime: "", location: "", description: "", published: true, coverKey: null, coverUrl: null };
  }
  return {
    id: event.id,
    title: event.title,
    date: event.startsAt.slice(0, 10),
    startTime: event.startsAt.slice(11, 16),
    endDate: event.endsAt ? event.endsAt.slice(0, 10) : "",
    endTime: event.endsAt ? event.endsAt.slice(11, 16) : "",
    location: event.location ?? "",
    description: event.description ?? "",
    published: event.published,
    coverKey: event.coverKey,
    coverUrl: event.coverUrl,
  };
}

export function EventsPanel({ onExpired }: Props) {
  const [events, setEvents] = useState<EventItem[] | null>(null);
  const [editing, setEditing] = useState<EventItem | "new" | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);

  const load = useCallback(() => {
    api<{ events: EventItem[] }>("/api/admin/events")
      .then((data) => setEvents(data.events))
      .catch((err) => setNotice({ type: "error", text: errorText(err, onExpired) }));
  }, [onExpired]);

  useEffect(() => {
    load();
  }, [load]);

  async function remove(event: EventItem) {
    if (!window.confirm(`Delete "${event.title}"? This cannot be undone.`)) return;
    try {
      await api(`/api/admin/events/${event.id}`, { method: "DELETE" });
      setNotice({ type: "ok", text: "The event was deleted." });
      load();
    } catch (err) {
      setNotice({ type: "error", text: errorText(err, onExpired) });
    }
  }

  function saved(text: string) {
    setEditing(null);
    setNotice({ type: "ok", text });
    load();
  }

  return (
    <div className="admin-stack">
      <div className="admin-head">
        <h1 className="admin-title">Events</h1>
        {editing === null && (
          <button type="button" className="btn btn-primary btn-sm" onClick={() => setEditing("new")}>
            Add event
          </button>
        )}
      </div>

      <NoticeBox notice={notice} />

      {editing !== null && (
        <EventForm
          key={editing === "new" ? "new" : editing.id}
          initial={editing === "new" ? null : editing}
          onExpired={onExpired}
          onCancel={() => setEditing(null)}
          onSaved={saved}
        />
      )}

      {events === null && <p className="fine">Loading events…</p>}
      {events?.length === 0 && editing === null && (
        <div className="empty">
          <h3>No events yet</h3>
          <p>Add an event and it will appear on the Events page right away.</p>
        </div>
      )}

      {events && events.length > 0 && (
        <ul className="admin-list">
          {events.map((event) => (
            <li key={event.id} className="card admin-row">
              <div className="admin-row-main">
                <strong>{event.title}</strong>
                <span className="fine">{formatWhen(event.startsAt, event.endsAt)}</span>
                {event.location && <span className="fine">{event.location}</span>}
              </div>
              <span className={`pill ${event.published ? "" : "pill-muted"}`}>{event.published ? "On website" : "Hidden"}</span>
              <div className="admin-row-actions">
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => setEditing(event)}>
                  Edit
                </button>
                <button type="button" className="btn btn-ghost btn-sm btn-danger" onClick={() => remove(event)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function EventForm({
  initial,
  onExpired,
  onCancel,
  onSaved,
}: {
  initial: EventItem | null;
  onExpired: () => void;
  onCancel: () => void;
  onSaved: (text: string) => void;
}) {
  const [draft, setDraft] = useState<Draft>(() => draftFrom(initial));
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const shownCover = preview ?? draft.coverUrl;
  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => setDraft((d) => ({ ...d, [key]: value }));

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      let coverKey = draft.coverKey;
      if (file) {
        const form = new FormData();
        form.append("file", file);
        const uploaded = await api<{ key: string }>("/api/admin/media", { form });
        coverKey = uploaded.key;
      }
      const body = {
        title: draft.title,
        startsAt: `${draft.date}T${draft.startTime}`,
        endsAt: draft.endTime ? `${draft.endDate || draft.date}T${draft.endTime}` : null,
        location: draft.location,
        description: draft.description,
        coverKey,
        published: draft.published,
      };
      if (draft.id) {
        await api(`/api/admin/events/${draft.id}`, { method: "PUT", body });
      } else {
        await api("/api/admin/events", { body });
      }
      onSaved(draft.published ? "Event saved. It is now on the Events page." : "Event saved as hidden. Visitors cannot see it yet.");
    } catch (err) {
      setError(errorText(err, onExpired));
      setBusy(false);
    }
  }

  return (
    <form className="card admin-card-body admin-form" onSubmit={submit}>
      <h2 className="admin-subtitle">{draft.id ? "Edit event" : "New event"}</h2>

      <div className="field">
        <label htmlFor="ev-title">Title</label>
        <input id="ev-title" required maxLength={120} value={draft.title} onChange={(e) => set("title", e.target.value)} />
      </div>

      <div className="admin-form-grid">
        <div className="field">
          <label htmlFor="ev-date">Date</label>
          <input id="ev-date" type="date" required value={draft.date} onChange={(e) => set("date", e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="ev-start">Start time</label>
          <input id="ev-start" type="time" required value={draft.startTime} onChange={(e) => set("startTime", e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="ev-end-date">End date (optional)</label>
          <input id="ev-end-date" type="date" value={draft.endDate} onChange={(e) => set("endDate", e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="ev-end">End time (optional)</label>
          <input id="ev-end" type="time" value={draft.endTime} onChange={(e) => set("endTime", e.target.value)} />
        </div>
      </div>

      <div className="field">
        <label htmlFor="ev-location">Location (optional)</label>
        <input id="ev-location" maxLength={160} value={draft.location} onChange={(e) => set("location", e.target.value)} />
      </div>

      <div className="field">
        <label htmlFor="ev-desc">Details (optional)</label>
        <textarea id="ev-desc" rows={4} maxLength={3000} value={draft.description} onChange={(e) => set("description", e.target.value)} />
      </div>

      <div className="field">
        <label htmlFor="ev-cover">Cover photo (optional)</label>
        {shownCover && <img className="admin-thumb" src={shownCover} alt="" />}
        <div className="btn-row">
          <input
            id="ev-cover"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => {
              const picked = e.target.files?.[0] ?? null;
              setFile(picked);
            }}
          />
          {(shownCover || file) && (
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => {
                setFile(null);
                setDraft((d) => ({ ...d, coverKey: null, coverUrl: null }));
              }}
            >
              Remove photo
            </button>
          )}
        </div>
        <span className="fine">JPG, PNG, or WebP, up to 8 MB.</span>
      </div>

      <label className="check">
        <input type="checkbox" checked={draft.published} onChange={(e) => set("published", e.target.checked)} />
        Show on the website
      </label>

      {error && (
        <p className="notice notice-error" role="alert">
          {error}
        </p>
      )}

      <div className="btn-row">
        <button type="submit" className="btn btn-primary" disabled={busy}>
          {busy ? "Saving…" : "Save event"}
        </button>
        <button type="button" className="btn btn-ghost" onClick={onCancel} disabled={busy}>
          Cancel
        </button>
      </div>
    </form>
  );
}

// ---------- Featured sermon ----------

export function SermonPanel({ onExpired }: Props) {
  const [sermon, setSermon] = useState<SermonState | undefined>(undefined);
  const [link, setLink] = useState("");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);

  useEffect(() => {
    api<{ sermon: SermonState }>("/api/admin/sermon")
      .then((data) => {
        setSermon(data.sermon);
        if (data.sermon) {
          setLink(`https://www.youtube.com/watch?v=${data.sermon.videoId}`);
          setTitle(data.sermon.title);
          setDate(data.sermon.date ?? "");
        }
      })
      .catch((err) => setNotice({ type: "error", text: errorText(err, onExpired) }));
  }, [onExpired]);

  const previewId = youtubeIdFromInput(link);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setNotice(null);
    try {
      const data = await api<{ sermon: SermonState }>("/api/admin/sermon", {
        method: "PUT",
        body: { youtube: link, title, date: date || null },
      });
      setSermon(data.sermon);
      setNotice({ type: "ok", text: "The featured sermon is updated on the Sermons page." });
    } catch (err) {
      setNotice({ type: "error", text: errorText(err, onExpired) });
    } finally {
      setBusy(false);
    }
  }

  async function useDefault() {
    setBusy(true);
    setNotice(null);
    try {
      await api("/api/admin/sermon", { method: "PUT", body: { clear: true } });
      setSermon(null);
      setLink("");
      setTitle("");
      setDate("");
      setNotice({ type: "ok", text: "The default featured video is showing again." });
    } catch (err) {
      setNotice({ type: "error", text: errorText(err, onExpired) });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="admin-stack">
      <h1 className="admin-title">Featured sermon</h1>
      <p className="fine">
        {sermon === undefined
          ? "Loading…"
          : sermon
            ? `Showing: ${sermon.title}`
            : "The default featured video is showing."}
      </p>

      <form className="card admin-card-body admin-form" onSubmit={save}>
        <div className="field">
          <label htmlFor="sermon-link">YouTube link</label>
          <input id="sermon-link" type="url" required value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://www.youtube.com/watch?v=…" />
        </div>
        <div className="admin-form-grid">
          <div className="field">
            <label htmlFor="sermon-title">Title (optional)</label>
            <input id="sermon-title" maxLength={160} value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="sermon-date">Date preached (optional)</label>
            <input id="sermon-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
        </div>

        {previewId && <EmbedPreview videoId={previewId} />}
        {link && !previewId && (
          <p className="notice notice-error" role="alert">
            That does not look like a YouTube link.
          </p>
        )}

        <NoticeBox notice={notice} />

        <div className="btn-row">
          <button type="submit" className="btn btn-primary" disabled={busy || !previewId}>
            Save featured sermon
          </button>
          {sermon && (
            <button type="button" className="btn btn-ghost" disabled={busy} onClick={useDefault}>
              Use default video
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

// ---------- Announcement banner ----------

export function AnnouncementPanel({ onExpired }: Props) {
  const [active, setActive] = useState(false);
  const [text, setText] = useState("");
  const [link, setLink] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);

  useEffect(() => {
    api<{ active: boolean; text: string; link: string | null }>("/api/admin/announcement")
      .then((data) => {
        setActive(data.active);
        setText(data.text);
        setLink(data.link ?? "");
        setLoaded(true);
      })
      .catch((err) => setNotice({ type: "error", text: errorText(err, onExpired) }));
  }, [onExpired]);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setNotice(null);
    try {
      await api("/api/admin/announcement", { method: "PUT", body: { active, text, link } });
      setNotice({ type: "ok", text: active ? "The announcement is showing on the website." : "The announcement is hidden." });
    } catch (err) {
      setNotice({ type: "error", text: errorText(err, onExpired) });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="admin-stack">
      <h1 className="admin-title">Announcement</h1>
      <p className="fine">A short message shown across the top of every page.</p>

      <form className="card admin-card-body admin-form" onSubmit={save}>
        <label className="check">
          <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} disabled={!loaded} />
          Show the announcement on the website
        </label>
        <div className="field">
          <label htmlFor="ann-text">Message</label>
          <textarea id="ann-text" rows={3} maxLength={240} value={text} onChange={(e) => setText(e.target.value)} disabled={!loaded} />
          <span className="fine">{text.length} of 240 characters</span>
        </div>
        <div className="field">
          <label htmlFor="ann-link">Link (optional)</label>
          <input id="ann-link" value={link} onChange={(e) => setLink(e.target.value)} placeholder="/events or https://…" disabled={!loaded} />
        </div>

        <NoticeBox notice={notice} />

        <div className="btn-row">
          <button type="submit" className="btn btn-primary" disabled={busy || !loaded}>
            Save announcement
          </button>
        </div>
      </form>
    </div>
  );
}
