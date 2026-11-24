import Link from 'next/link';
import Icon from '../../components/Icons';
import Footer from '../../components/Footer';
import { wpSermons } from '../../lib/wp-data';
import { sermons } from '../../lib/content';

export default function SermonsPage() {
  return (
    <>
      <section className="block block--flush">
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="eyebrow">Latest sermons</span>
              <h1 style={{ fontSize: 'clamp(38px,4.5vw,64px)' }}>Messages from the Word.</h1>
              <p className="lead" style={{ marginTop: 14 }}>Preached at EFBC in faith, with the Baibal Thiang as our foundation.</p>
            </div>
          </div>
          <div className="grid grid--2">
            {wpSermons.map((s, i) => (
              <div className="card" key={s.id}>
                <div className="mono" style={{ fontSize: 11, color: 'var(--p-accent)' }}>Message {i + 1}</div>
                <h3 style={{ marginTop: 10 }}>{s.title}</h3>
                <p style={{ marginTop: 10 }}>{s.text.slice(0, 220)}{s.text.length > 220 ? '…' : ''}</p>
                <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
                  <a className="btn btn--ghost btn--sm" href={s.link} target="_blank" rel="noreferrer">Read at source <Icon name="arrow" /></a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="block">
        <div className="wrap">
          <span className="eyebrow">Featured series</span>
          <div className="grid grid--3" style={{ marginTop: 20 }}>
            {sermons.slice(0, 3).map((s) => (
              <div className="photo-card" key={s.id}>
                <img src={s.image} alt="" />
                <div className="photo-card__body"><span className="mono" style={{ fontSize: 10, color: 'var(--p-accent)' }}>{s.ref}</span><h3 style={{ fontSize: 19, marginTop: 6 }}>{s.title}</h3></div>
              </div>
            ))}
          </div>
          <p style={{ marginTop: 24 }}><Link href="/live/" className="btn btn--primary">Watch previous services <Icon name="arrow" /></Link></p>
        </div>
      </section>
      <Footer />
    </>
  );
}
