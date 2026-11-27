import type { Metadata } from "next";
import Link from "next/link";
import { SongLibrary } from "@/components/SongLibrary";

export const metadata: Metadata = { title: "Readings" };

export default function ReadingsPage() {
  return (
    <div className="wrap">
      <header className="page-head">
        <span className="eyebrow">Chawnghlang Relnak</span>
        <h1>Readings in Hakha Chin</h1>
      </header>
      <nav className="tabs" aria-label="Hymns and readings" style={{ marginBottom: 22 }}>
        <Link href="/hymns">Hymns</Link>
        <Link href="/readings" aria-current="page">Readings</Link>
      </nav>
      <SongLibrary kind="readings" />
    </div>
  );
}
