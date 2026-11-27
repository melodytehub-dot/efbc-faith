"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type CSSProperties } from "react";
import { Icon, type IconName } from "./Icon";
import { church } from "@/lib/church";

const navItems: { href: string; label: string }[] = [
  { href: "/", label: "Home" },
  { href: "/bible", label: "Bible" },
  { href: "/hymns", label: "Hymns" },
  { href: "/sermons", label: "Sermons" },
  { href: "/live", label: "Live" },
  { href: "/ministries", label: "Ministries" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const menuItems: { href: string; label: string }[] = [
  { href: "/", label: "Home" },
  { href: "/bible", label: "Bible" },
  { href: "/hymns", label: "Hymns" },
  { href: "/readings", label: "Readings" },
  { href: "/sermons", label: "Sermons" },
  { href: "/live", label: "Live" },
  { href: "/ministries", label: "Ministries" },
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

function Logo({ size = "sm" }: { size?: "sm" | "lg" }) {
  return (
    <img
      className={`brand-logo brand-logo-${size}`}
      src="/images/logo-full.png"
      alt={church.name}
      width={750}
      height={150}
    />
  );
}

export function SiteHeader() {
  const pathname = usePathname() || "/";
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  if (pathname.startsWith("/admin")) return null;

  return (
    <>
    <header className="topbar">
      <div className="wrap topbar-inner">
        <Link href="/" className="brand" aria-label={`${church.name} home`}>
          <Logo />
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
            aria-controls="site-drawer"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <Icon name={open ? "close" : "menu"} />
          </button>
        </div>
      </div>
    </header>

    <div className="drawer" id="site-drawer" data-open={open}>
        <button type="button" className="drawer-scrim" tabIndex={open ? 0 : -1} aria-label="Close menu" onClick={() => setOpen(false)} />
        <nav className="drawer-panel" aria-label="Site menu" inert={!open}>
          <div className="drawer-head">
            <Logo />
          </div>
          {menuItems.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(pathname, item.href) ? "page" : undefined}
              style={{ "--i": i } as CSSProperties}
            >
              {item.label}
              <Icon name="chevron-right" />
            </Link>
          ))}
          <Link href="/give" className="drawer-give" style={{ "--i": menuItems.length } as CSSProperties}>
            Give
          </Link>
        </nav>
    </div>
    </>
  );
}

export function TabBar() {
  const pathname = usePathname() || "/";
  if (pathname.startsWith("/admin")) return null;
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
  const pathname = usePathname() || "/";
  if (pathname.startsWith("/admin")) return null;
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <Logo size="lg" />
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
              {church.emails.slice(1).map((e) => (
                <li key={e}>
                  <a href={`mailto:${e}`}>{e}</a>
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
                <Link href="/sermons">Sermons</Link>
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
