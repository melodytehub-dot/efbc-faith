import Icon from '../../components/Icons';
import Footer from '../../components/Footer';
import { church, leaders, ministries } from '../../lib/content';

const values = [
  { title: 'Truth in Love', text: 'We speak and live the truth of God’s Word with grace, humility and compassion.' },
  { title: 'Christ-Centered Worship', text: 'Our gatherings exist to glorify God’s holiness and exalt Jesus as Lord.' },
  { title: 'Spiritual Growth', text: 'We grow together in faith, maturity and unity — becoming more like Christ.' },
  { title: 'Cultural Honor', text: 'We celebrate our Chin heritage as a gift from God that strengthens our witness.' },
  { title: 'Servant Leadership', text: 'We lead by serving, following the example of Christ in humility and love.' },
  { title: 'Community & Fellowship', text: 'We build authentic relationships that reflect the love of Christ.' },
  { title: 'Mission & Outreach', text: 'We share the gospel in our neighbourhoods, workplaces and across cultures.' },
];

export default function ChurchPage() {
  return (
    <>
      <section className="block block--flush">
        <div className="wrap">
          <span className="eyebrow">About EFBC</span>
          <h1 style={{ fontSize: 'clamp(40px,5vw,72px)', maxWidth: '16ch' }}>A place where faith is cultivated.</h1>
          <p className="lead" style={{ marginTop: 20 }}>{church.tagline} — inspired by Ephesians 4:15, the verse that shapes our worship, fellowship and mission.</p>
          <div className="grid grid--3" style={{ marginTop: 44 }}>
            <div className="photo-card"><img src="/images/hero-vb1.jpg" alt="Worship at EFBC" /><div className="photo-card__body"><h3>Welcome</h3><p>Founded {church.founded}</p></div></div>
            <div className="photo-card"><img src="/images/congregation2.jpg" alt="The church family gathered" /><div className="photo-card__body"><h3>Family</h3><p>Burmese Chin believers in Star City</p></div></div>
            <div className="photo-card"><img src="/images/dcst.jpg" alt="Preaching at EFBC" /><div className="photo-card__body"><h3>Word</h3><p>Grounded in Baibal Thiang</p></div></div>
          </div>
        </div>
      </section>

      <section className="block">
        <div className="wrap">
          <div className="section-head"><div><span className="eyebrow">Our conviction</span><h2>Mission, vision & values.</h2></div></div>
          <div className="grid grid--3">
            <div className="card"><span className="eyebrow">Mission</span><p style={{ marginTop: 12, color: 'var(--p-ink)' }}>To cultivate a Christ-centered community rooted in truth, love and holiness — speaking the truth in love and building up the body of Christ.</p></div>
            <div className="card"><span className="eyebrow">Vision</span><p style={{ marginTop: 12, color: 'var(--p-ink)' }}>A Spirit-led church where truth is spoken in love, faith is cultivated and God’s holiness is glorified — a beacon of hope for the Chin community and beyond.</p></div>
            <div className="card"><span className="eyebrow">Anchor verse</span><p style={{ marginTop: 12, color: 'var(--p-ink)' }}>{church.verses['Efesa 4:15']}</p><span className="mono" style={{ fontSize: 11, color: 'var(--p-accent)' }}>Efesa 4:15</span></div>
          </div>
          <div className="grid grid--3" style={{ marginTop: 20 }}>
            {values.map((v) => <div className="card" key={v.title}><div className="card__icon"><Icon name="heart" /></div><h3>{v.title}</h3><p>{v.text}</p></div>)}
          </div>
        </div>
      </section>

      <section className="block">
        <div className="wrap">
          <div className="section-head"><div><span className="eyebrow">Get involved</span><h2>Six ministries.</h2></div></div>
          <div className="grid grid--3">
            {ministries.map((m) => <div className="card" key={m.id}><div className="card__icon"><Icon name="community" /></div><h3>{m.name}</h3><p>{m.note}</p></div>)}
          </div>
        </div>
      </section>

      <section className="block">
        <div className="wrap">
          <div className="section-head"><div><span className="eyebrow">Leadership</span><h2>Those who serve.</h2></div></div>
          <div className="grid grid--3">
            {leaders.map((l) => <div className="list-row" key={l.name}><div className="prayer-card__avatar">EF</div><div><div className="list-row__title">{l.name}</div><div className="list-row__sub">{l.role}</div></div></div>)}
          </div>
        </div>
      </section>

      <section className="block">
        <div className="wrap">
          <div className="grid grid--2">
            <div className="card">
              <span className="eyebrow">Visit us</span>
              <h2 style={{ fontSize: 32, margin: '10px 0 20px' }}>You are welcome here.</h2>
              <p><Icon name="pin" className="icon" style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }} />{church.address}</p>
              <p style={{ marginTop: 12 }}><Icon name="clock" className="icon" style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }} />Sunday service · {church.service}</p>
              <p style={{ marginTop: 12 }}>Office hours · {church.hours}</p>
              <a className="btn btn--primary" style={{ marginTop: 24 }} href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(church.address)}`} target="_blank" rel="noreferrer">Get directions <Icon name="arrow" /></a>
            </div>
            <div className="card">
              <span className="eyebrow">Contact</span>
              <h2 style={{ fontSize: 32, margin: '10px 0 20px' }}>Talk to us.</h2>
              {church.phones.map((p) => <p key={p} style={{ marginTop: 10 }}><a href={`tel:${p.replace(/\D/g, '')}`}>{p}</a></p>)}
              {church.emails.map((e) => <p key={e} style={{ marginTop: 10 }}><a href={`mailto:${e}`}>{e}</a></p>)}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
