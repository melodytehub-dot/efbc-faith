import type { Metadata } from "next";
import { Icon } from "@/components/Icon";
import { church } from "@/lib/church";

export const metadata: Metadata = { title: "Sermons" };

export default function SermonsPage() {
  return (
    <div className="wrap">
      <header className="page-head">
        <span className="eyebrow">Sermons</span>
        <h1>Hear the Word</h1>
        <p className="lede">
          Watch featured messages from Emmanuel Farm Baptist Church. The full archive is on our YouTube
          channel.
        </p>
      </header>

      <div className="video">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${church.featuredVideoId}`}
          title="Featured message from Emmanuel Farm Baptist Church"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
        />
      </div>

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
    </div>
  );
}
