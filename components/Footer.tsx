import Link from 'next/link';
import { church } from '../lib/content';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer__grid">
          <div>
            <img src="/images/logo.png" alt="Emmanuel Farm Baptist Church" style={{ width: 64, height: 64, objectFit: 'contain', marginBottom: 14 }} />
            <h3>{church.name}</h3>
            <p style={{ marginTop: 10, maxWidth: '38ch' }}>{church.tagline}</p>
            <p style={{ marginTop: 14 }}>{church.address}</p>
          </div>
          <div>
            <h3>Explore</h3>
            <p style={{ marginTop: 10, display: 'grid', gap: 8 }}>
              <Link href="/bible/">Bible</Link>
              <Link href="/hymns/">Hymns</Link>
              <Link href="/prayer/">Prayer</Link>
              <Link href="/church/">Church</Link>
            </p>
          </div>
          <div>
            <h3>Connect</h3>
            <p style={{ marginTop: 10, display: 'grid', gap: 8 }}>
              <a href={`mailto:${church.emails[0]}`}>{church.emails[0]}</a>
              <a href={`tel:${church.phones[0].replace(/\D/g, '')}`}>{church.phones[0]}</a>
              <Link href="/live/">Watch live</Link>
            </p>
          </div>
        </div>
        <div className="footer__line">
          <span>© {new Date().getFullYear()} Emmanuel Farm Baptist Church</span>
          <span>Service time · {church.service}</span>
        </div>
      </div>
    </footer>
  );
}
