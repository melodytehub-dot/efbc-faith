import Link from "next/link";
import { Icon } from "./Icon";
import type { Song } from "@/lib/data";

export function SongDetail({
  kind,
  song,
  prev,
  next,
  category,
}: {
  kind: "hymns" | "readings";
  song: Song;
  prev: Song | null;
  next: Song | null;
  category: string;
}) {
  const body = song.lines.map((line, i) => {
    if (kind === "hymns" && i === 0 && !/^\d+\./.test(line) && !/^CHO:/.test(line)) {
      return (
        <p key={i} className="muted" style={{ fontSize: 14, marginBottom: 22 }}>
          Key: {line.replace(/\.$/, "")}
        </p>
      );
    }
    const chorus = line.match(/^CHO:\s*(.*)$/);
    if (chorus) {
      return (
        <p key={i} className="chorus">
          <b style={{ fontStyle: "normal", color: "var(--gold)", fontSize: "0.8em", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Chorus
          </b>
          <br />
          {chorus[1]}
        </p>
      );
    }
    const verse = line.match(/^(\d+)\.\s*(.*)$/);
    if (verse) {
      return (
        <p key={i}>
          <b style={{ color: "var(--gold)", fontFamily: "var(--font-sans)", fontSize: "0.72em", marginRight: 10 }}>
            {verse[1]}
          </b>
          {verse[2]}
        </p>
      );
    }
    return <p key={i}>{line}</p>;
  });

  return (
    <div className="wrap">
      <header className="page-head" style={{ paddingBottom: 18 }}>
        <Link href={`/${kind}`} className="pill" style={{ textDecoration: "none" }}>
          <Icon name="chevron-left" /> {category}
        </Link>
        <h1 style={{ marginTop: 22, fontSize: "clamp(1.9rem, 4vw, 2.9rem)" }}>
          <span style={{ color: "var(--gold)", fontFamily: "var(--font-sans)", fontSize: "0.5em", fontWeight: 600, verticalAlign: "middle", marginRight: 14 }}>
            {song.number}
          </span>
          {song.title}
        </h1>
      </header>

      <article className="card lyrics" style={{ maxWidth: 820 }}>
        {body}
      </article>

      <nav className="btn-row" aria-label="Browse" style={{ justifyContent: "space-between", margin: "28px 0 0" }}>
        {prev ? (
          <Link href={`/${kind}/${prev.number}`} className="btn btn-ghost btn-sm">
            <Icon name="chevron-left" /> {prev.number}. {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`/${kind}/${next.number}`} className="btn btn-ghost btn-sm">
            {next.number}. {next.title} <Icon name="chevron-right" />
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </div>
  );
}
