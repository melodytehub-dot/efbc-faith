import type { Metadata } from "next";
import Link from "next/link";
import { SongLibrary } from "@/components/SongLibrary";

export const metadata: Metadata = { title: "Hymns" };

export default function HymnsPage() {
  return (
    <div className="wrap">
      <header className="page-head">
        <span className="eyebrow">Khrihfa Hlabu</span>
        <h1>Hymns in Hakha Chin</h1>
      </header>
      <nav className="tabs" aria-label="Hymns and readings" style={{ marginBottom: 22 }}>
        <Link href="/hymns" aria-current="page">Hymns</Link>
        <Link href="/readings">Readings</Link>
      </nav>
      <SongLibrary kind="hymns" />
    </div>
  );
}
