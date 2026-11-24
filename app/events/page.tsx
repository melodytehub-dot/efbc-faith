import Icon from '../../components/Icons';
import Footer from '../../components/Footer';
import { events, church } from '../../lib/content';

export default function EventsPage() {
  return (
    <>
      <section className="block block--flush">
        <div className="wrap">
          <div className="section-head">
            <div><span className="eyebrow">Events with purpose</span><h1 style={{ fontSize: 'clamp(38px,4.5vw,64px)' }}>What's coming up.</h1></div>
          </div>
          <div className="grid grid--2">
            {events.map((e) => (
              <div className="card" key={e.id}>
                <span className="mono" style={{ color: 'var(--p-accent)' }}>{e.date} {e.year}</span>
                <h3 style={{ marginTop: 12 }}>{e.title}</h3>
                <p style={{ marginTop: 8 }}>{e.note}</p>
                <p style={{ marginTop: 16, display: 'flex', gap: 8, alignItems: 'center' }}><Icon name="pin" className="icon" />{e.place}</p>
              </div>
            ))}
          </div>
          <div className="card" style={{ marginTop: 24 }}>
            <h3>Every Sunday</h3>
            <p style={{ marginTop: 8 }}>Worship service · {church.service} · {church.address}</p>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
