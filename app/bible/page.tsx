'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Icon from '../../components/Icons';
import Footer from '../../components/Footer';
import { church } from '../../lib/content';

type Verse = { text: string; title?: string };
type Chapter = { verse: Record<string, Verse> };
type Book = { info: { name: string; shortname: string }; chapter: Record<string, Chapter> };
type BibleData = { info: { name: string; description: string; year: string }; book: Record<string, Book> };

export default function BiblePage() {
  const [data, setData] = useState<BibleData | null>(null);
  const [error, setError] = useState(false);
  const [book, setBook] = useState('43');
  const [chapter, setChapter] = useState('3');
  const [query, setQuery] = useState('');

  useEffect(() => {
    fetch('/data/bible-hakha.json')
      .then((r) => r.ok ? r.json() : Promise.reject())
      .then(setData)
      .catch(() => setError(true));
  }, []);

  const books = useMemo(() => data ? Object.entries(data.book).map(([id, b]) => ({ id, ...b.info })) : [], [data]);
  const currentBook = data?.book[book];
  const chapters = useMemo(() => currentBook ? Object.keys(currentBook.chapter) : [], [currentBook]);
  const verses = useMemo(() => {
    if (!currentBook?.chapter[chapter]) return [];
    const v = currentBook.chapter[chapter].verse;
    return Object.entries(v)
      .map(([n, val]) => ({ n, ...val }))
      .filter((x) => x.text && x.text.trim())
      .filter((x) => !query || x.text.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => Number(a.n) - Number(b.n));
  }, [currentBook, chapter, query]);

  const searchResults = useMemo(() => {
    if (!query || !data) return [];
    const out: Array<{ label: string; n: string; text: string }> = [];
    const needle = query.toLowerCase();
    for (const [bid, b] of Object.entries(data.book)) {
      for (const [cid, c] of Object.entries(b.chapter)) {
        for (const [vn, v] of Object.entries(c.verse)) {
          if (v.text && v.text.toLowerCase().includes(needle)) {
            out.push({ label: `${b.info.shortname} ${cid}:${vn}`, n: vn, text: v.text });
            if (out.length >= 30) return out;
          }
        }
      }
    }
    return out;
  }, [query, data]);

  return (
    <>
      <section className="block block--flush">
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="eyebrow">Baibal Thiang · Hakha Chin</span>
              <h1 style={{ fontSize: 'clamp(38px,4.5vw,64px)' }}>The Word, in our language.</h1>
              <p className="lead" style={{ marginTop: 14 }}>One Bible version for this church — the Hakha Baibal Thiang. Read, search and share without switching translations.</p>
            </div>
            <Link href="/hymns/" className="btn btn--primary">Open the hymn book <Icon name="music" /></Link>
          </div>

          <div className="verse-card" style={{ marginBottom: 28 }}>
            <div className="verse-card__ref">Filipi 4:13</div>
            <p className="verse-card__text">{church.verses['Filipi 4:13']}</p>
          </div>

          <div className="reader">
            <div className="reader__page">
              {error && <p role="alert">The Bible text could not be loaded. Please try again.</p>}
              {!data && !error && <p role="status">Loading Baibal Thiang…</p>}
              {data && (
                <>
                  <div className="reader__chapter">{currentBook?.info.name} · chapter {chapter}</div>
                  <div style={{ display: 'flex', gap: 10, marginTop: 18, flexWrap: 'wrap' }}>
                    <label className="field" style={{ minWidth: 200 }}>
                      <span className="mono" style={{ fontSize: 11, color: 'var(--p-muted)' }}>BOOK</span>
                      <select value={book} onChange={(e) => { setBook(e.target.value); setChapter('1'); setQuery(''); }} style={{ background: 'var(--p-bg)', border: '1px solid var(--p-line)', borderRadius: 10, padding: '10px 12px' }}>
                        {books.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                      </select>
                    </label>
                    <label className="field" style={{ minWidth: 110 }}>
                      <span className="mono" style={{ fontSize: 11, color: 'var(--p-muted)' }}>CHAPTER</span>
                      <select value={chapter} onChange={(e) => { setChapter(e.target.value); setQuery(''); }} style={{ background: 'var(--p-bg)', border: '1px solid var(--p-line)', borderRadius: 10, padding: '10px 12px' }}>
                        {chapters.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </label>
                    <label className="field" style={{ flex: 1, minWidth: 220 }}>
                      <span className="mono" style={{ fontSize: 11, color: 'var(--p-muted)' }}>SEARCH THIS BIBLE</span>
                      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Type a word in Hakha…" aria-label="Search the Hakha Bible" />
                    </label>
                  </div>

                  {query && searchResults.length > 0 && (
                    <div style={{ marginTop: 28, position: 'relative' }}>
                      <span className="eyebrow">Results across the Bible</span>
                      {searchResults.map((r, i) => (
                        <button key={i} type="button" className="chapter-row" style={{ width: '100%', textAlign: 'left', background: 'transparent', color: 'inherit', marginTop: 8 }}
                          onClick={() => { const [b, c] = r.label.split(' ')[0].split(':'); const bn = books.find((x) => x.shortname === b); if (bn) { setBook(bn.id); setChapter(c); setQuery(''); } }}>
                          <span>{r.label}</span><span style={{ maxWidth: '70%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.text}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {query && searchResults.length === 0 && verses.length === 0 && (
                    <p style={{ marginTop: 28, color: 'var(--p-muted)' }}>No verses found for “{query}”.</p>
                  )}

                  {!query && (
                    <div className="verses" style={{ marginTop: 30, position: 'relative' }}>
                      {verses.map((v) => (
                        <p key={v.n} style={{ marginBottom: 18, fontSize: 19, lineHeight: 1.7 }}>
                          <span className="mono" style={{ color: 'var(--p-accent)', fontSize: 12, marginRight: 12 }}>{v.n}</span>
                          {v.text}
                        </p>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>

            <aside>
              <div className="card">
                <span className="eyebrow">Listen</span>
                <h3>Hakha audio Bible</h3>
                <p>Listen to Baibal Thiang on Faith Comes By Hearing.</p>
                <a className="btn btn--ghost btn--sm" style={{ marginTop: 18 }} href="https://www.bible.com/languages/cnh" target="_blank" rel="noreferrer">Open audio Bible <Icon name="arrow" /></a>
              </div>
              <div className="card" style={{ marginTop: 20 }}>
                <span className="eyebrow">Next</span>
                <h3>Khrihfa Hlabu</h3>
                <p>514 Hakha hymns and 51 readings, all in one place.</p>
                <Link href="/hymns/" className="btn btn--ghost btn--sm" style={{ marginTop: 18 }}>Browse hymns <Icon name="arrow" /></Link>
              </div>
              <div className="card" style={{ marginTop: 20 }}>
                <span className="eyebrow">Verse of the day</span>
                <h3>Johan 3:16</h3>
                <p style={{ fontSize: 15 }}>{church.verses['Johan 3:16']}</p>
              </div>
            </aside>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
