import type { Metadata } from "next";
import { Icon } from "@/components/Icon";
import { church } from "@/lib/church";

export const metadata: Metadata = { title: "Live stream" };

export default function LivePage() {
  const src = `https://www.youtube-nocookie.com/embed/live_stream?channel=${church.youtubeChannelId}`;
  return (
    <div className="wrap">
      <header className="page-head">
        <span className="pill live-pill">
          <span className="live-dot" /> Live stream
        </span>
        <h1 style={{ marginTop: 16 }}>Join us online</h1>
        <p className="lede">
          Watch our services live from the church channel on YouTube. When we are not streaming, the
          player shows the channel&apos;s latest broadcast.
        </p>
      </header>

      <div className="video">
        <iframe
          src={src}
          title="Emmanuel Farm Baptist Church live stream"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
        />
      </div>

      <section className="section" style={{ paddingTop: 28 }}>
        <div className="btn-row">
          <a className="btn btn-primary" href={church.youtubeChannelUrl} target="_blank" rel="noopener noreferrer">
            <Icon name="play" /> Open channel on YouTube
          </a>
          <a className="btn btn-ghost" href="/sermons">
            Past sermons
          </a>
        </div>
        <p className="fine" style={{ marginTop: 16 }}>
          Live chat is available on YouTube during broadcasts. Sign in there to join the conversation.
        </p>
      </section>
    </div>
  );
}
