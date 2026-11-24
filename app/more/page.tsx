import Link from 'next/link';
import Icon from '../../components/Icons';
import Footer from '../../components/Footer';
import { sermons } from '../../lib/content';

const links = [
  { href: '/bible/', label: 'Bible', sub: 'Baibal Thiang · Hakha Chin', icon: 'bible' },
  { href: '/hymns/', label: 'Hymn book', sub: '514 hymns · 51 readings', icon: 'music' },
  { href: '/prayer/', label: 'Prayer', sub: 'Send a request', icon: 'prayer' },
  { href: '/church/', label: 'About EFBC', sub: 'Mission, vision and leadership', icon: 'church' },
  { href: '/community/', label: 'Community', sub: 'Notices and events', icon: 'community' },
  { href: '/live/', label: 'Live worship', sub: 'Sunday service', icon: 'video' },
  { href: '/sermons/', label: 'Sermons', sub: 'Messages from the Word', icon: 'book' },
  { href: '/blog/', label: 'Blog', sub: 'Stories & reflections', icon: 'book' },
  { href: '/events/', label: 'Events', sub: 'What’s coming up', icon: 'calendar' },
  { href: '/faq/', label: 'Questions', sub: 'FAQs', icon: 'mail' },
  { href: '/giving/', label: 'Giving', sub: 'Support the church', icon: 'gift' },
  { href: '/contact/', label: 'Contact', sub: 'Reach the church office', icon: 'mail' },
  { href: 'https://efbcusa.com/shop/', label: 'Shop', sub: 'Existing church store', icon: 'grid', external: true },
  { href: 'https://efbcusa.com/audio-book/', label: 'Audio book', sub: 'Listen to the Word', icon: 'music', external: true },
  { href: 'https://efbcusa.com/donor-dashboard/', label: 'Donor dashboard', sub: 'Your giving record', icon: 'user', external: true },
  { href: 'https://efbcusa.com/my-account/', label: 'My account', sub: 'Church store account', icon: 'user', external: true },
];

export default function MorePage() {
  return (
    <>
      <section className="block block--flush">
        <div className="wrap">
          <div className="section-head">
            <div><span className="eyebrow">Everything</span><h1 style={{ fontSize: 'clamp(38px,4.5vw,64px)' }}>More from EFBC.</h1></div>
          </div>
          <div className="grid grid--2">
            <div style={{ display: 'grid', gap: 12 }}>
              {links.map((l) => {
                const inner = <><Icon name={l.icon} /><div><div className="list-row__title">{l.label}</div><div className="list-row__sub">{l.sub}</div></div><Icon name="chevron" className="icon list-row__arrow" /></>;
                return l.external
                  ? <a className="list-row" key={l.href} href={l.href} target="_blank" rel="noreferrer">{inner}</a>
                  : <Link className="list-row" key={l.href} href={l.href}>{inner}</Link>;
              })}
            </div>
            <div>
              <span className="eyebrow">Sermon archive</span>
              <div style={{ display: 'grid', gap: 12, marginTop: 14 }}>
                {sermons.map((s) => (
                  <div className="list-row" key={s.id}>
                    <Icon name="play" />
                    <div><div className="list-row__title">{s.title}</div><div className="list-row__sub">{s.ref} · {s.sub}</div></div>
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
