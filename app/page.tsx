import Link from 'next/link';
import Icon from '../components/Icons';
import Footer from '../components/Footer';
import { church, launchTiles, sermons, events } from '../lib/content';

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="hero__photo">
          <img src="/images/hero-vb2.jpg" alt="A depiction of Christ in warm light" />
        </div>
        <div className="hero__inner">
          <div className="hero__greet">
            <Icon name="sun" className="icon hero__sun" />
            <span>Good morning, EFBC family</span>
          </div>
          <h1>Walk in faith today.</h1>
          <p className="hero__lead">Read the Word, sing the hymns, pray together and worship with us — in the language of our home.</p>

          <div className="hero__lower">
            <div className="verse-card">
              <div className="verse-card__ref">Filipi 4:13 · Baibal Thiang</div>
              <p className="verse-card__text">{church.daily.text}</p>
            </div>
            <div className="tiles">
              {launchTiles.map((tile) => (
                <Link key={tile.id} href={tile.href} className="tile">
                  {tile.live && <span className="tile__live">LIVE</span>}
                  <Icon name={tile.icon} className="icon tile__icon" />
                  <div>
                    <div className="tile__label">{tile.label}</div>
                    <div className="tile__sub">{tile.sub}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="block">
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="eyebrow">Gather with us</span>
              <h2>A church you can call family.</h2>
            </div>
            <p>Founded {church.founded} by Burmese Chin believers in the Pine Bluff area, EFBC now meets in Star City. Come as you are.</p>
          </div>
          <div className="grid grid--3">
            <div className="photo-card">
              <img src="/images/hero-vb1.jpg" alt="A member of the congregation speaking at the podium" />
              <div className="photo-card__body"><h3>Worship together</h3><p>Every Sunday · {church.service}</p></div>
            </div>
            <div className="photo-card">
              <img src="/images/congregation1.jpg" alt="The congregation gathered for worship" />
              <div className="photo-card__body"><h3>Find your people</h3><p>Six ministries, one family</p></div>
            </div>
            <div className="photo-card">
              <img src="/images/dcst.jpg" alt="A pastor preaching in traditional Chin attire" />
              <div className="photo-card__body"><h3>Hear the Word</h3><p>Baibal Thiang · Hakha Chin</p></div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 14, marginTop: 32, flexWrap: 'wrap' }}>
            <Link href="/church/" className="btn btn--primary">Plan your visit <Icon name="arrow" /></Link>
            <Link href="/live/" className="btn btn--ghost">Watch the livestream</Link>
          </div>
        </div>
      </section>

      <section className="block">
        <div className="wrap">
          <div className="section-head">
            <div><span className="eyebrow">From the Word</span><h2>Recent sermons.</h2></div>
            <Link href="/more/" className="btn btn--ghost btn--sm">All sermons <Icon name="arrow" /></Link>
          </div>
          <div className="grid grid--3">
            {sermons.slice(0, 3).map((s) => (
              <Link href="/more/" className="card" key={s.id}>
                <div className="card__icon"><Icon name="book" /></div>
                <span className="mono" style={{ fontSize: 11, color: 'var(--p-accent)' }}>{s.ref}</span>
                <h3 style={{ marginTop: 10 }}>{s.title}</h3>
                <p>{s.sub}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="block">
        <div className="wrap">
          <div className="section-head"><div><span className="eyebrow">What's coming</span><h2>Events & announcements.</h2></div></div>
          <div className="grid grid--2">
            {events.map((e) => (
              <div className="list-row" key={e.id}>
                <span className="mono" style={{ color: 'var(--p-accent)', fontSize: 13, minWidth: 58 }}>{e.date}<br />{e.year}</span>
                <div><div className="list-row__title">{e.title}</div><div className="list-row__sub">{e.note}</div></div>
                <Icon name="pin" className="icon list-row__arrow" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
