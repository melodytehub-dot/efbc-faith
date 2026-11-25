"use client";

import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "./Icon";

type Book = { id: number; name: string; short: string; chapters: string[][] };
type BibleData = { translation: string; books: Book[] };

const MAX_RESULTS = 120;

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function highlight(text: string, query: string) {
  if (!query) return text;
  const parts = text.split(new RegExp(`(${escapeRegex(query)})`, "ig"));
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? <mark key={i}>{part}</mark> : <Fragment key={i}>{part}</Fragment>,
  );
}

function snippet(text: string, query: string) {
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx < 0 || text.length <= 160) return text;
  const start = Math.max(0, idx - 60);
  const end = Math.min(text.length, idx + query.length + 90);
  return `${start > 0 ? "…" : ""}${text.slice(start, end)}${end < text.length ? "…" : ""}`;
}

export function BibleReader() {
  const [data, setData] = useState<BibleData | null>(null);
  const [error, setError] = useState(false);
  const [bookId, setBookId] = useState(1);
  const [chapter, setChapter] = useState(1);
  const [query, setQuery] = useState("");
  const [hitVerse, setHitVerse] = useState<number | null>(null);
  const [pick, setPick] = useState<"chapter" | "verse">("chapter");
  const readerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/data/bible-cnh.json")
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status));
        return r.json() as Promise<BibleData>;
      })
      .then((d) => !cancelled && setData(d))
      .catch(() => !cancelled && setError(true));
    return () => {
      cancelled = true;
    };
  }, []);

  const books = data?.books ?? [];
  const book = books.find((b) => b.id === bookId) ?? books[0];
  const chapterCount = book?.chapters.length ?? 0;
  const verses = book?.chapters[chapter - 1] ?? [];

  const q = query.trim();
  const results = useMemo(() => {
    if (!data || q.length < 2) return null;
    const needle = q.toLowerCase();
    const out: { book: Book; c: number; v: number; text: string }[] = [];
    let total = 0;
    for (const b of data.books) {
      for (let c = 0; c < b.chapters.length; c++) {
        const vs = b.chapters[c];
        for (let v = 0; v < vs.length; v++) {
          if (vs[v].toLowerCase().includes(needle)) {
            total++;
            if (out.length < MAX_RESULTS) out.push({ book: b, c: c + 1, v: v + 1, text: vs[v] });
          }
        }
      }
    }
    return { items: out, total };
  }, [data, q]);

  function openAt(id: number, c: number, v: number | null) {
    setBookId(id);
    setChapter(c);
    setHitVerse(v);
    setPick("verse");
    setQuery("");
    requestAnimationFrame(() => {
      const el = v
        ? readerRef.current?.querySelector(`[data-v="${v}"]`)
        : readerRef.current;
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function gotoBook(id: number) {
    setBookId(id);
    setChapter(1);
    setHitVerse(null);
    setPick("chapter");
  }

  function pickVerse(v: number) {
    setHitVerse(v);
    requestAnimationFrame(() => {
      readerRef.current?.querySelector(`[data-v="${v}"]`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  if (error) {
    return (
      <div className="empty">
        <h3>The Bible text could not be loaded</h3>
        <p>Please refresh the page. If this continues, contact the church office.</p>
      </div>
    );
  }

  if (!data || !book) {
    return (
      <div className="reader" aria-live="polite" aria-busy="true">
        <span className="skel" style={{ display: "block", height: 28, width: "40%" }} />
        <span className="skel" style={{ display: "block", height: 18, marginTop: 28 }} />
        <span className="skel" style={{ display: "block", height: 18, marginTop: 12 }} />
        <span className="skel" style={{ display: "block", height: 18, width: "85%", marginTop: 12 }} />
        <span className="skel" style={{ display: "block", height: 18, width: "60%", marginTop: 12 }} />
        <p className="muted" style={{ marginTop: 24 }}>Loading the Bible…</p>
      </div>
    );
  }

  const ot = books.filter((b) => b.id <= 39);
  const nt = books.filter((b) => b.id > 39);
  const prevDisabled = bookId === 1 && chapter === 1;
  const lastBook = books[books.length - 1];
  const nextDisabled = bookId === lastBook.id && chapter === chapterCount;

  function prev() {
    if (chapter > 1) setChapter(chapter - 1);
    else {
      const idx = books.findIndex((b) => b.id === bookId);
      const pb = books[idx - 1];
      if (pb) {
        setBookId(pb.id);
        setChapter(pb.chapters.length);
      }
    }
    setHitVerse(null);
  }
  function next() {
    if (chapter < chapterCount) setChapter(chapter + 1);
    else {
      const idx = books.findIndex((b) => b.id === bookId);
      const nb = books[idx + 1];
      if (nb) {
        setBookId(nb.id);
        setChapter(1);
      }
    }
    setHitVerse(null);
  }

  return (
    <div className="bible">
      <div className="bible-search">
        <Icon name="search" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search the Hakha Chin Bible"
          aria-label="Search the Hakha Chin Bible"
        />
      </div>

      {results ? (
        <section aria-label="Search results">
          <p className="muted" style={{ marginBottom: 14, fontSize: 14 }}>
            {results.total === 0
              ? "No verses match that search."
              : `${results.total.toLocaleString()} verse${results.total === 1 ? "" : "s"} found${
                  results.total > MAX_RESULTS ? `, showing the first ${MAX_RESULTS}` : ""
                }`}
          </p>
          <ul className="results">
            {results.items.map((r) => (
              <li key={`${r.book.id}-${r.c}-${r.v}`}>
                <button type="button" onClick={() => openAt(r.book.id, r.c, r.v)}>
                  <b>
                    {r.book.name} {r.c}:{r.v}
                  </b>
                  <span>{highlight(snippet(r.text, q), q)}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <div className="bible-layout">
          <aside className="book-panel" aria-label="Choose a book and chapter">
            <select
              value={bookId}
              onChange={(e) => gotoBook(Number(e.target.value))}
              aria-label="Book"
            >
              <optgroup label="Old Testament">
                {ot.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="New Testament">
                {nt.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </optgroup>
            </select>
            {pick === "chapter" ? (
              <div className="chapter-grid" role="group" aria-label="Chapters">
                {Array.from({ length: chapterCount }, (_, i) => i + 1).map((c) => (
                  <button
                    key={c}
                    type="button"
                    className="chapter-btn"
                    aria-current={c === chapter ? "true" : undefined}
                    onClick={() => {
                      setChapter(c);
                      setHitVerse(null);
                      setPick("verse");
                    }}
                  >
                    {c}
                  </button>
                ))}
              </div>
            ) : (
              <div className="verse-panel">
                <div className="verse-panel-head">
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => setPick("chapter")}>
                    <Icon name="chevron-left" /> Chapters
                  </button>
                  <span>Chapter {chapter}</span>
                </div>
                <div className="chapter-grid" role="group" aria-label={`Verses of chapter ${chapter}`}>
                  {verses.map((_, i) => {
                    const v = i + 1;
                    return (
                      <button
                        key={v}
                        type="button"
                        className="chapter-btn"
                        aria-current={v === hitVerse ? "true" : undefined}
                        onClick={() => pickVerse(v)}
                      >
                        {v}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </aside>

          <article className="reader" ref={readerRef} aria-live="polite">
            <div className="reader-head">
              <div>
                <h2>
                  {book.name} {chapter}
                </h2>
              </div>
            </div>
            <div className="verses">
              {verses.map((text, i) => {
                const v = i + 1;
                return (
                  <span
                    key={v}
                    data-v={v}
                    className={`verse-line${hitVerse === v ? " is-hit" : ""}`}
                  >
                    <span className="v-num">{v}</span>
                    {text}
                  </span>
                );
              })}
            </div>
            <div className="reader-nav">
              <button type="button" className="btn btn-ghost btn-sm" onClick={prev} disabled={prevDisabled}>
                <Icon name="chevron-left" /> Previous
              </button>
              <button type="button" className="btn btn-ghost btn-sm" onClick={next} disabled={nextDisabled}>
                Next <Icon name="chevron-right" />
              </button>
            </div>
          </article>
        </div>
      )}
    </div>
  );
}
