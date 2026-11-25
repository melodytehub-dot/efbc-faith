import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SongDetail } from "@/components/SongDetail";
import { getReadings } from "@/lib/data";

export const dynamicParams = false;

export function generateStaticParams() {
  return getReadings().map((s) => ({ n: String(s.number) }));
}

export async function generateMetadata({ params }: { params: Promise<{ n: string }> }): Promise<Metadata> {
  const { n } = await params;
  const song = getReadings().find((s) => String(s.number) === n);
  return { title: song ? `Reading ${song.number}: ${song.title}` : "Reading" };
}

export default async function ReadingPage({ params }: { params: Promise<{ n: string }> }) {
  const { n } = await params;
  const items = getReadings();
  const i = items.findIndex((s) => String(s.number) === n);
  if (i < 0) notFound();
  return (
    <main style={{ paddingTop: 16 }}>
      <SongDetail
        kind="readings"
        song={items[i]}
        prev={items[i - 1] ?? null}
        next={items[i + 1] ?? null}
        category="All readings"
      />
    </main>
  );
}
