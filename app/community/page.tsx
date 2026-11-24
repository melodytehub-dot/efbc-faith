import Icon from '../../components/Icons';
import Footer from '../../components/Footer';
import { community, events } from '../../lib/content';

export default function CommunityPage() {
  return (
    <>
      <section className="block block--flush">
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="eyebrow">Together</span>
              <h1 style={{ fontSize: 'clamp(38px,4.5vw,64px)' }}>Walk together.</h1>
              <p className="lead" style={{ marginTop: 14 }}>Notices, gatherings and the life of the church family — all in one place.</p>
            </div>
          </div>

          <div className="grid grid--2">
            <div>
              <span className="eyebrow">From the church</span>
              <div className="chat" style={{ height: 'auto', maxHeight: 620, marginTop: 16 }}>
                <div className="chat__head">Notices <span>EFBC</span></div>
                <div className="chat__list">
                  {community.map((m) => (
                    <div className="msg" key={m.id}>
                      <div className="msg__avatar" style={{ background: m.color }}>{m.initials}</div>
                      <div>
                        <div className="msg__name">{m.name} <span style={{ color: 'var(--p-muted)', fontWeight: 400 }}>· {m.time}</span></div>
                        <p className="msg__text" style={{ marginTop: 4 }}>{m.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <span className="eyebrow">What's coming</span>
              <div style={{ display: 'grid', gap: 14, marginTop: 16 }}>
                {events.map((e) => (
                  <div className="card" key={e.id}>
                    <div className="mono" style={{ color: 'var(--p-accent)', fontSize: 12 }}>{e.date} {e.year}</div>
                    <h3 style={{ marginTop: 10 }}>{e.title}</h3>
                    <p>{e.note}</p>
                    <p style={{ marginTop: 8, display: 'flex', gap: 8, alignItems: 'center' }}><Icon name="pin" className="icon" />{e.place}</p>
                  </div>
                ))}
              </div>
              <div className="card" style={{ marginTop: 14 }}>
                <span className="eyebrow">Sunday</span>
                <h3 style={{ marginTop: 10 }}>Worship together</h3>
                <p>Service time · 2:00 PM – 4:00 PM</p>
                <a className="btn btn--ghost btn--sm" style={{ marginTop: 16 }} href="https://www.google.com/maps/search/?api=1&query=235+Knight+Haven+Circle+Star+City+AR+71667" target="_blank" rel="noreferrer">Find us <Icon name="arrow" /></a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
