'use client';

import { useEffect, useMemo, useState } from 'react';
import Icon from '../../components/Icons';
import Footer from '../../components/Footer';

type Post = { id: number; slug: string; link: string; title: { rendered: string }; content: { rendered: string } };
type HymnData = { hymns: Post[]; readings: Post[] };

function clean(html: string) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return (doc.body.innerText || doc.body.textContent || '')
    .replace(/\u00a0/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function number(title: string) {
  const m = title.match(/^(\d+)/);
  return m ? m[1] : '';
}
function plainTitle(title: string) {
  return title.replace(/^\d+[.\s-]+/, '').trim();
}

export default function HymnsPage() {
  const [data, setData] = useState<HymnData | null>(null);
  const [error, setError] = useState(false);
  const [tab, setTab] = useState<'hymns' | 'readings'>('hymns');
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState<Post | null>(null);
  const [favs, setFavs] = useState<number[]>([]);
  const [onlyFavs, setOnlyFavs] = useState(false);

  useEffect(() => {
    fetch('/data/hymns.json')
      .then((r) => r.ok ? r.json() : Promise.reject())
      .then(setData)
      .catch(() => setError(true));
    try { setFavs(JSON.parse(localStorage.getItem('efbc-hymn-favs') || '[]')); } catch { /* no saved favourites */ }
  }, []);

  const list = data ? data[tab] : [];
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return list.filter((p) => {
      if (onlyFavs && !favs.includes(p.id)) return false;
      if (!q) return true;
      return p.title.rendered.toLowerCase().includes(q) || clean(p.content.rendered).toLowerCase().includes(q) || number(p.title.rendered).includes(q);
    });
  }, [list, query, onlyFavs, favs]);

  function toggleFav(id: number) {
    const next = favs.includes(id) ? favs.filter((f) => f !== id) : [...favs, id];
    setFavs(next);
    try { localStorage.setItem('efbc-hymn-favs', JSON.stringify(next)); } catch { /* storage unavailable */ }
  }

  const body = open ? clean(open.content.rendered) : '';
  const paragraphs = body.split(/\n{2,}/).filter(Boolean);
  const files = open ? Array.from(open.content.rendered.matchAll(/href="([^"]+\.(?:pdf|pptx))"/gi)).map((m) => m[1]) : [];

  return (
    <>
      <section className="block block--flush">
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="eyebrow">Khrihfa Hlabu · Chawnghlang Relnak</span>
              <h1 style={{ fontSize: 'clamp(38px,4.5vw,64px)' }}>The hymn book, in your pocket.</h1>
              <p className="lead" style={{ marginTop: 14 }}>Search all 514 Hakha hymns and 51 readings by number, title or a line from the lyrics.</p>
            </div>
            <a className="btn btn--ghost" href="https://khrihfahlabu.org/" target="_blank" rel="noreferrer">Visit Khrihfa Hlabu <Icon name="arrow" /></a>
          </div>

          <div className="card" style={{ padding: 18, marginBottom: 24 }}>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: 6 }}>
                <button type="button" className={`btn btn--sm ${tab === 'hymns' ? 'btn--primary' : 'btn--ghost'}`} onClick={() => { setTab('hymns'); setQuery(''); }}>Hymns · 514</button>
                <button type="button" className={`btn btn--sm ${tab === 'readings' ? 'btn--primary' : 'btn--ghost'}`} onClick={() => { setTab('readings'); setQuery(''); }}>Chawnghlang · 51</button>
              </div>
              <label className="field" style={{ flex: 1, minWidth: 240 }}>
                <span className="sr-only">Search hymns and readings</span>
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Number, title or lyrics…" aria-label="Search hymns and readings" />
              </label>
              <button type="button" className={`btn btn--sm ${onlyFavs ? 'btn--primary' : 'btn--ghost'}`} onClick={() => setOnlyFavs(!onlyFavs)}>Saved ({favs.length})</button>
            </div>
          </div>

          {error && <p role="alert">The hymn library could not be loaded. Please try again.</p>}
          {!data && !error && <p role="status">Loading the hymn book…</p>}

          {data && (
            <>
              <p className="mono" style={{ fontSize: 11, color: 'var(--p-muted)', marginBottom: 14 }}>{results.length} {results.length === 1 ? 'entry' : 'entries'}</p>
              <div className="grid grid--2">
                {results.map((p) => {
                  const n = number(p.title.rendered);
                  const first = clean(p.content.rendered).split('\n')[0] || '';
                  return (
                    <div key={p.id} className="list-row" style={{ alignItems: 'flex-start', gap: 14 }}>
                      <span className="mono" style={{ color: 'var(--p-accent)', fontSize: 15, minWidth: 42 }}>{n || '—'}</span>
                      <button type="button" onClick={() => setOpen(p)} style={{ background: 'none', border: 0, padding: 0, textAlign: 'left', flex: 1, color: 'inherit' }}>
                        <div className="list-row__title">{plainTitle(p.title.rendered)}</div>
                        <div className="list-row__sub" style={{ marginTop: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{first}</div>
                      </button>
                      <button type="button" className="icon-btn" onClick={() => toggleFav(p.id)} aria-label={favs.includes(p.id) ? 'Remove from saved' : 'Save hymn'} aria-pressed={favs.includes(p.id)}>
                        <Icon name="heart" className={favs.includes(p.id) ? 'icon' : 'icon'} />
                      </button>
                    </div>
                  );
                })}
              </div>
              {results.length === 0 && <p style={{ color: 'var(--p-muted)' }}>Nothing found. Try a different number or word.</p>}
            </>
          )}
        </div>
      </section>

      {open && (
        <div className="modal" role="dialog" aria-modal="true" aria-label={plainTitle(open.title.rendered)}>
          <div className="modal__backdrop" onClick={() => setOpen(null)} />
          <div className="modal__panel">
            <div className="modal__head">
              <div>
                <span className="eyebrow">{number(open.title.rendered) ? `Hla ${number(open.title.rendered)}` : 'Chawnghlang Relnak'}</span>
                <h2 style={{ fontSize: 26 }}>{plainTitle(open.title.rendered)}</h2>
              </div>
              <button type="button" className="icon-btn" onClick={() => setOpen(null)} aria-label="Close">✕</button>
            </div>
            <div className="modal__body">
              {paragraphs.map((p, i) => <p key={i} style={{ marginBottom: 16, whiteSpace: 'pre-line' }}>{p}</p>)}
              {paragraphs.length === 0 && <p>Lyrics are not available for this entry.</p>}
            </div>
            <div className="modal__foot">
              {files.map((f) => <a key={f} className="btn btn--ghost btn--sm" href={f} target="_blank" rel="noreferrer">Open file <Icon name="arrow" /></a>)}
              <a className="btn btn--primary btn--sm" href={open.link} target="_blank" rel="noreferrer">View at source <Icon name="arrow" /></a>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
}
