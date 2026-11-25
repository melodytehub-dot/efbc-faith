"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Icon, type IconName } from "./Icon";
import { church } from "@/lib/church";

export function Mark({ className = "" }: { className?: string }) {
  return <img className={`brand-mark ${className}`.trim()} src="/images/logo-seal.png" alt="" width={40} height={40} />;
}

const navItems: { href: string; label: string }[] = [
  { href: "/", label: "Home" },
  { href: "/bible", label: "Bible" },
  { href: "/hymns", label: "Hymns" },
  { href: "/live", label: "Live" },
  { href: "/sermons", label: "Sermons" },
  { href: "/ministries", label: "Ministries" },
  { href: "/events", label: "Events" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const menuItems: { href: string; label: string }[] = [
  { href: "/", label: "Home" },
  { href: "/bible", label: "Bible" },
  { href: "/hymns", label: "Hymns" },
  { href: "/readings", label: "Readings" },
  { href: "/live", label: "Live" },
  { href: "/sermons", label: "Sermons" },
  { href: "/ministries", label: "Ministries" },
  { href: "/events", label: "Events" },
  { href: "/prayer", label: "Prayer request" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const tabs: { href: string; label: string; icon: IconName }[] = [
  { href: "/", label: "Home", icon: "home" },
  { href: "/bible", label: "Bible", icon: "book" },
  { href: "/live", label: "Live", icon: "live" },
  { href: "/prayer", label: "Prayer", icon: "hands" },
  { href: "/more", label: "More", icon: "more" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname() || "/";
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);
  return (
    <header className="topbar">
      <div className="wrap topbar-inner">
        <Link href="/" className="brand" aria-label={`${church.name} home`}>
          <Mark />
          <span className="brand-text">
            <span className="brand-name">{church.name}</span>
            <span className="brand-sub">Growing in truth · Living in love</span>
          </span>
        </Link>
        <nav className="nav" aria-label="Main">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(pathname, item.href) ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="top-actions">
          <Link href="/give" className="btn btn-primary btn-sm top-give">
            Give
          </Link>
          <button
            type="button"
            className="menu-btn"
            aria-expanded={open}
            aria-controls="site-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <Icon name={open ? "close" : "menu"} />
          </button>
        </div>
      </div>
      {open && (
        <nav id="site-menu" className="site-menu" aria-label="Site menu">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(pathname, item.href) ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
          <Link href="/give" className="btn btn-primary site-menu-give">
            Give
          </Link>
        </nav>
      )}
    </header>
  );
}

export function TabBar() {
  const pathname = usePathname() || "/";
  return (
    <nav className="tabbar" aria-label="App">
      {tabs.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          aria-current={isActive(pathname, tab.href) ? "page" : undefined}
        >
          <span className="tab-ic">
            <Icon name={tab.icon} />
          </span>
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}

export function SiteFooter() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <div className="brand">
              <Mark />
              <span className="brand-text">
                <span className="brand-name">{church.name}</span>
                <span className="brand-sub">{church.motto}</span>
              </span>
            </div>
            <p className="muted" style={{ marginTop: 16, maxWidth: "44ch" }}>
              A Burmese Chin congregation in Star City, Arkansas. Worship in English and Chin.
            </p>
          </div>
          <div>
            <h4>Visit</h4>
            <ul>
              <li>
                <a href={church.mapsUrl} target="_blank" rel="noopener noreferrer">
                  {church.address.line1}, {church.address.cityLine}
                </a>
              </li>
              {church.phones.map((p, i) => (
                <li key={p}>
                  <a href={`tel:${church.phoneLinks[i]}`}>{p}</a>
                </li>
              ))}
              {church.emails.map((e) => (
                <li key={e}>
                  {e === church.emails[0] ? <span>{e}</span> : <a href={`mailto:${e}`}>{e}</a>}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Explore</h4>
            <ul>
              <li>
                <Link href="/bible">Bible</Link>
              </li>
              <li>
                <Link href="/hymns">Hymns and readings</Link>
              </li>
              <li>
                <Link href="/live">Watch live</Link>
              </li>
              <li>
                <Link href="/ministries">Ministries</Link>
              </li>
              <li>
                <Link href="/give">Give</Link>
              </li>
              <li>
                <Link href="/prayer">Prayer request</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} {church.name}</span>
          <span>{church.officeHours}</span>
        </div>
      </div>
    </footer>
  );
}
