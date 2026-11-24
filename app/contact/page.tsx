'use client';

import { useState } from 'react';
import Icon from '../../components/Icons';
import Footer from '../../components/Footer';
import { church } from '../../lib/content';

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = f.get('name') || '';
    const subject = f.get('subject') || '';
    const message = f.get('message') || '';
    window.location.href = `mailto:${church.emails[0]}?subject=${encodeURIComponent(`Website: ${subject}`)}&body=${encodeURIComponent(`${message}\n\nFrom: ${name}`)}`;
    setSent(true);
  }

  return (
    <>
      <section className="block block--flush">
        <div className="wrap">
          <div className="section-head">
            <div><span className="eyebrow">Talk to us</span><h1 style={{ fontSize: 'clamp(38px,4.5vw,64px)' }}>We'd love to hear from you.</h1><p className="lead" style={{ marginTop: 14 }}>Prayer requests, service times or general questions — reach us any way you like.</p></div>
          </div>
          <div className="grid grid--2">
            <form className="card" onSubmit={submit}>
              <div className="field"><label htmlFor="c-name">Your name</label><input id="c-name" name="name" required placeholder="Name" /></div>
              <div className="field" style={{ marginTop: 14 }}><label htmlFor="c-subject">Subject</label><input id="c-subject" name="subject" required placeholder="How can we help?" /></div>
              <div className="field" style={{ marginTop: 14 }}><label htmlFor="c-message">Message</label><textarea id="c-message" name="message" required placeholder="Write your message…" /></div>
              <button className="btn btn--primary" type="submit" style={{ marginTop: 18 }}>Continue to email <Icon name="send" /></button>
              <p style={{ marginTop: 10, fontSize: 13 }}>This opens your email app with the message ready to send.</p>
              {sent && <p role="status" style={{ marginTop: 8, fontSize: 13, color: 'var(--p-accent)' }}>Your email app has been opened.</p>}
            </form>
            <div>
              <div className="card">
                <span className="eyebrow">Visit</span>
                <p style={{ marginTop: 12 }}>{church.address}</p>
                <p style={{ marginTop: 10 }}>Sunday service · {church.service}</p>
                <p style={{ marginTop: 10 }}>Office · {church.hours}</p>
                <a className="btn btn--ghost btn--sm" style={{ marginTop: 18 }} href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(church.address)}`} target="_blank" rel="noreferrer">Get directions <Icon name="arrow" /></a>
              </div>
              <div className="card" style={{ marginTop: 18 }}>
                <span className="eyebrow">Reach us</span>
                {church.phones.map((p) => <p key={p} style={{ marginTop: 10 }}><a href={`tel:${p.replace(/\D/g, '')}`}>{p}</a></p>)}
                {church.emails.map((e) => <p key={e} style={{ marginTop: 10 }}><a href={`mailto:${e}`}>{e}</a></p>)}
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
