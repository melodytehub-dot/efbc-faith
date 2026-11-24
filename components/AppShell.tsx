'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Icon from './Icons';

const nav = [
  { href: '/', label: 'Home', icon: 'home' },
  { href: '/bible/', label: 'Bible', icon: 'bible' },
  { href: '/hymns/', label: 'Hymns', icon: 'music' },
  { href: '/prayer/', label: 'Prayer', icon: 'prayer' },
  { href: '/church/', label: 'Church', icon: 'church' },
  { href: '/community/', label: 'Community', icon: 'community' },
  { href: '/live/', label: 'Live', icon: 'video' },
  { href: '/sermons/', label: 'Sermons', icon: 'book' },
  { href: '/blog/', label: 'Blog', icon: 'book' },
  { href: '/events/', label: 'Events', icon: 'calendar' },
  { href: '/faq/', label: 'Questions', icon: 'mail' },
  { href: '/giving/', label: 'Giving', icon: 'gift' },
  { href: '/contact/', label: 'Contact', icon: 'mail' },
  { href: '/profile/', label: 'Profile', icon: 'user' },
];

const tabs = [
  { href: '/', label: 'Home', icon: 'home' },
  { href: '/bible/', label: 'Bible', icon: 'bible' },
  { href: '/community/', label: 'Community', icon: 'community' },
  { href: '/profile/', label: 'Profile', icon: 'user' },
];

function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/' || pathname === '';
  return pathname.startsWith(href);
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '/';
  const current = nav.find((n) => isActive(pathname, n.href));

  return (
    <div className="shell">
      <aside className="rail" aria-label="Main navigation">
        <Link href="/" className="rail__brand" aria-label="Emmanuel Farm Baptist Church home">
          <img src="/images/logo.png" alt="Emmanuel Farm Baptist Church" className="rail__logo" />
          <span>
            <span className="rail__brand-title">EFBC Faith</span>
            <span className="rail__brand-sub">Star City, AR</span>
          </span>
        </Link>
        <nav className="rail__nav">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="rail__link" aria-label={item.label} data-active={isActive(pathname, item.href)} aria-current={isActive(pathname, item.href) ? 'page' : undefined}>
              <Icon name={item.icon} />
              <span>{item.label}</span>
            </Link>
          ))}
          <Link href="/more/" className="rail__link" aria-label="More" data-active={isActive(pathname, '/more/')} aria-current={isActive(pathname, '/more/') ? 'page' : undefined}>
            <Icon name="grid" />
            <span>More</span>
          </Link>
        </nav>
        <div className="rail__foot">
          <strong>Emmanuel Farm Baptist Church</strong>
          Growing in truth. Living in love.
        </div>
      </aside>

      <div className="main">
        <header className="topbar">
          <span className="topbar__title">{current?.label || 'More'}</span>
          <span className="topbar__spacer" />
          <Link href="/bible/" className="icon-btn" aria-label="Search Bible and hymns"><Icon name="search" /></Link>
          <Link href="/profile/" className="icon-btn" aria-label="Notifications"><Icon name="bell" /></Link>
          <Link href="/profile/" className="avatar" aria-label="EF profile">EF</Link>
        </header>

        <main id="content">{children}</main>
      </div>

      <nav className="tabbar" aria-label="Mobile navigation">
        {tabs.map((tab) => (
          <Link key={tab.href} href={tab.href} data-active={isActive(pathname, tab.href)} aria-current={isActive(pathname, tab.href) ? 'page' : undefined}>
            <Icon name={tab.icon} />
            <span>{tab.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
