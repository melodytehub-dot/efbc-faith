'use client';

import { useState } from 'react';
import Icon from '../../components/Icons';
import Footer from '../../components/Footer';
import { church, sermons } from '../../lib/content';

export default function LivePage() {
  const [notice, setNotice] = useState(false);

  return (
    <>
      <section className="block block--flush">
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="eyebrow">Live faith broadcast</span>
              <h1 style={{ fontSize: 'clamp(38px,4.5vw,64px)' }}>Worship with us.</h1>
              <p className="lead" style={{ marginTop: 14 }}>Join the service each Sunday at {church.service}. When the stream is live, it will appear here.</p>
            </div>
          </div>

          <div className="live-layout">
            <div>
              <div className="player" role="img" aria-label="A pastor preaching at EFBC">
                <div className="player__badge">
                  <span className="live-badge">SUNDAY</span>
                  <span className="viewers">{church.service}</span>
                </div>
                <button type="button" className="player__play" onClick={() => setNotice(true)} aria-label="Play the livestream"><Icon name="play" /></button>
                <div className="player__title"><h2 style={{ fontSize: 28 }}>Sunday worship</h2><p style={{ color: 'rgba(248,242,230,.8)' }}>Emmanuel Farm Baptist Church</p></div>
              </div>
              {notice && <p role="status" style={{ marginTop: 12, color: 'var(--p-accent)', fontSize: 14 }}>The livestream appears here when the service is live. Join us in person at {church.address}.</p>}

              <div style={{ marginTop: 28 }}>
                <span className="eyebrow">Previous messages</span>
                <div className="grid grid--2" style={{ marginTop: 16 }}>
                  {sermons.slice(0, 4).map((s) => (
                    <div className="photo-card" key={s.id} style={{ minHeight: 220 }}>
                      <img src={s.image} alt="" />
                      <div className="photo-card__body"><span className="mono" style={{ fontSize: 10, color: 'var(--p-accent)' }}>{s.ref}</span><h3 style={{ fontSize: 19, marginTop: 6 }}>{s.title}</h3></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="chat">
              <div className="chat__head">Service chat <span>Opens when live</span></div>
              <div className="chat__list">
                <div className="msg"><div className="msg__avatar" style={{ background: 'var(--p-accent)' }}>EF</div><div><div className="msg__name">EFBC</div><p className="msg__text" style={{ marginTop: 4 }}>Welcome. The chat will open when the service begins.</p></div></div>
                <div className="msg"><div className="msg__avatar" style={{ background: 'var(--p-accent)' }}>EF</div><div><div className="msg__name">EFBC</div><p className="msg__text" style={{ marginTop: 4 }}>Prayer requests can be sent to {church.emails[0]}.</p></div></div>
              </div>
              <form className="chat__form" onSubmit={(e) => { e.preventDefault(); }}>
                <label className="sr-only" htmlFor="live-msg">Message</label>
                <input id="live-msg" placeholder="Chat opens when the service is live" disabled />
                <button type="submit" aria-label="Send message" disabled><Icon name="send" /></button>
              </form>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
