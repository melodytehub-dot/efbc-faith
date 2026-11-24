'use client';

import { useState } from 'react';
import Icon from '../../components/Icons';
import Footer from '../../components/Footer';
import { church, prayers } from '../../lib/content';

export default function PrayerPage() {
  const [name, setName] = useState('');
  const [request, setRequest] = useState('');
  const [sent, setSent] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const body = `Prayer request${name ? ` from ${name}` : ''}\n\n${request}`;
    window.location.href = `mailto:${church.emails[0]}?subject=${encodeURIComponent('Prayer request — EFBC')}&body=${encodeURIComponent(body)}`;
    setSent(true);
  }

  return (
    <>
      <section className="block block--flush">
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="eyebrow">Thlacamnak</span>
              <h1 style={{ fontSize: 'clamp(38px,4.5vw,64px)' }}>Pray with us.</h1>
              <p className="lead" style={{ marginTop: 14 }}>Prayer is not our last resort — it is our first calling. Share what is on your heart and the church family will stand with you.</p>
            </div>
          </div>

          <div className="grid grid--2">
            <div className="card">
              <span className="eyebrow">Send a request</span>
              <h2 style={{ fontSize: 28, marginBottom: 20 }}>How can we pray for you?</h2>
              <form className="prayer-form" onSubmit={submit}>
                <div className="field">
                  <label htmlFor="prayer-name">Your name (optional)</label>
                  <input id="prayer-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
                </div>
                <div className="field">
                  <label htmlFor="prayer-text">Your prayer request</label>
                  <textarea id="prayer-text" required value={request} onChange={(e) => setRequest(e.target.value)} placeholder="Write your request here…" />
                </div>
                <div>
                  <button type="submit" className="btn btn--primary">Continue to email <Icon name="send" /></button>
                  <p style={{ marginTop: 10, fontSize: 13 }}>This opens your email app with the request ready to send to the church office.</p>
                  {sent && <p role="status" style={{ marginTop: 8, fontSize: 13, color: 'var(--p-accent)' }}>Your email app has been opened. Send the message to share your request.</p>}
                </div>
              </form>
            </div>

            <div>
              <div className="verse-card" style={{ marginBottom: 22 }}>
                <div className="verse-card__ref">Salm 23:1</div>
                <p className="verse-card__text">{church.verses['Salm 23:1']}</p>
              </div>
              <span className="eyebrow">Prayer focus</span>
              <div style={{ display: 'grid', gap: 14, marginTop: 14 }}>
                {prayers.map((p) => (
                  <div className="prayer-card card" key={p.id}>
                    <div className="prayer-card__avatar"><Icon name="prayer" /></div>
                    <div>
                      <div className="prayer-card__name">{p.name}</div>
                      <p className="prayer-card__text">{p.text}</p>
                      <span className="mono" style={{ fontSize: 10, color: 'var(--p-accent)' }}>{p.tag}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
