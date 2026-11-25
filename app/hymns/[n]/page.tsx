import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SongDetail } from "@/components/SongDetail";
import { getHymns } from "@/lib/data";

export const dynamicParams = false;

export function generateStaticParams() {
  return getHymns().map((s) => ({ n: String(s.number) }));
}

export async function generateMetadata({ params }: { params: Promise<{ n: string }> }): Promise<Metadata> {
  const { n } = await params;
  const song = getHymns().find((s) => String(s.number) === n);
  return { title: song ? `Hymn ${song.number}: ${song.title}` : "Hymn" };
}

export default async function HymnPage({ params }: { params: Promise<{ n: string }> }) {
  const { n } = await params;
  const songs = getHymns();
  const i = songs.findIndex((s) => String(s.number) === n);
  if (i < 0) notFound();
  return (
    <main style={{ paddingTop: 16 }}>
      <SongDetail
        kind="hymns"
        song={songs[i]}
        prev={songs[i - 1] ?? null}
        next={songs[i + 1] ?? null}
        category="All hymns"
      />
    </main>
  );
}
