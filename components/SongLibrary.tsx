"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Icon } from "./Icon";

type Song = { number: number | null; title: string; slug: string; lines: string[] };

export function SongLibrary({ kind }: { kind: "hymns" | "readings" }) {
  const [songs, setSongs] = useState<Song[] | null>(null);
  const [error, setError] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetch(`/data/${kind}.json`)
      .then((r) => (r.ok ? (r.json() as Promise<Song[]>) : Promise.reject(r.status)))
      .then((d) => !cancelled && setSongs(d))
      .catch(() => !cancelled && setError(true));
    return () => {
      cancelled = true;
    };
  }, [kind]);

  const filtered = useMemo(() => {
    if (!songs) return [];
    const q = query.trim().toLowerCase();
    if (!q) return songs;
    return songs.filter(
      (s) => String(s.number).startsWith(q) || s.title.toLowerCase().includes(q),
    );
  }, [songs, query]);

  if (error) {
    return (
      <div className="empty">
        <h3>The list could not be loaded</h3>
        <p>Please refresh the page.</p>
      </div>
    );
  }

  const label = kind === "hymns" ? "hymn" : "reading";
  return (
    <div>
      <div className="hymn-tools">
        <div className="bible-search">
          <Icon name="search" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title or number"
            aria-label={`Search ${kind}`}
          />
        </div>
        <p className="muted" style={{ alignSelf: "center", fontSize: 14 }} aria-live="polite">
          {songs
            ? `${filtered.length.toLocaleString()} of ${songs.length.toLocaleString()} ${label}s`
            : "Loading…"}
        </p>
      </div>

      <ul className="hymn-grid" style={{ listStyle: "none", margin: 0, padding: 0 }}>
        {filtered.map((s) => (
          <li key={s.slug}>
            <Link href={`/${kind}/${s.number}`} className="hymn-card">
              <span className="hymn-no">{s.number}</span>
              <span>
                <b>{s.title}</b>
              </span>
            </Link>
          </li>
        ))}
      </ul>
      {songs && filtered.length === 0 && (
        <div className="empty" style={{ marginTop: 16 }}>
          <p>No {label}s match that search.</p>
        </div>
      )}
    </div>
  );
}
