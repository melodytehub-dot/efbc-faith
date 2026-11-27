import type { Metadata } from "next";
import { FeaturedSermon } from "@/components/FeaturedSermon";
import { Icon } from "@/components/Icon";
import { church } from "@/lib/church";
import sermons from "../../public/data/sermons.json";

export const metadata: Metadata = { title: "Sermons" };

const dateFmt = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });

export default function SermonsPage() {
  return (
    <div className="wrap">
      <header className="page-head">
        <span className="eyebrow">Sermons</span>
        <h1>Hear the Word</h1>
        <p className="lede">
          Watch recent messages from Emmanuel Farm Baptist Church. The full archive is on our YouTube
          channel.
        </p>
      </header>

      <FeaturedSermon />

      <section className="section" style={{ paddingTop: 28 }}>
        <div className="btn-row">
          <a className="btn btn-primary" href={church.youtubeChannelUrl} target="_blank" rel="noopener noreferrer">
            <Icon name="play" /> All sermons on YouTube
          </a>
          <a className="btn btn-ghost" href="/live">
            Watch live
          </a>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <div>
            <span className="eyebrow">Recent messages</span>
            <h2 style={{ marginTop: 14 }}>Latest from YouTube</h2>
          </div>
        </div>
        <ul className="sermon-grid" style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {sermons.map((s) => (
            <li key={s.id} className="reveal">
              <a
                className="sermon-card"
                href={`https://www.youtube.com/watch?v=${s.id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="sermon-thumb">
                  <img
                    src={`https://i.ytimg.com/vi/${s.id}/hqdefault.jpg`}
                    alt=""
                    width={480}
                    height={360}
                    loading="lazy"
                  />
                </span>
                <span className="sermon-body">
                  <b>{s.title}</b>
                  <span>{dateFmt.format(new Date(s.published))}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
