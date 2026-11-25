import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/Icon";

export const metadata: Metadata = { title: "More" };

const items = [
  { href: "/hymns", title: "Hymns", sub: "514 hymns in Hakha Chin" },
  { href: "/readings", title: "Readings", sub: "51 readings in Hakha Chin" },
  { href: "/sermons", title: "Sermons", sub: "Featured messages" },
  { href: "/events", title: "Events", sub: "Gatherings and dates" },
  { href: "/ministries", title: "Ministries", sub: "Seven ministries" },
  { href: "/give", title: "Give", sub: "Support the church" },
  { href: "/about", title: "About", sub: "Mission, vision, and leaders" },
  { href: "/contact", title: "Contact", sub: "Address, phone, and hours" },
];

export default function MorePage() {
  return (
    <div className="wrap">
      <header className="page-head">
        <span className="eyebrow">More</span>
        <h1>Everything in one place</h1>
      </header>
      <ul className="row-list" style={{ listStyle: "none", margin: 0, padding: 0 }}>
        {items.map((it) => (
          <li key={it.href}>
            <Link href={it.href}>
              <span className="row-main">
                <span className="row-title" style={{ display: "block" }}>
                  {it.title}
                </span>
                <span className="row-sub">{it.sub}</span>
              </span>
              <Icon name="chevron-right" className="chev" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
