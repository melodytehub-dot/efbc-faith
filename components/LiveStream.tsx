"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { church } from "@/lib/church";
import { Icon } from "@/components/Icon";

type LiveState = { isLive: boolean; videoId: string | null };

const CHECK_EVERY_MS = 60_000;

export function LiveStream() {
  const [state, setState] = useState<LiveState | null>(null);

  useEffect(() => {
    let active = true;
    const load = () =>
      api<LiveState>("/api/live")
        .then((data) => active && setState(data))
        .catch(() => active && setState({ isLive: false, videoId: null }));
    load();
    const timer = window.setInterval(load, CHECK_EVERY_MS);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, []);

  if (!state) {
    return <div className="video video-offline" aria-busy="true" />;
  }

  if (state.isLive && state.videoId) {
    return (
      <>
        <div className="video">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${state.videoId}?rel=0`}
            title="Emmanuel Farm Baptist Church live service"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
        <section className="section" style={{ paddingTop: 28 }}>
          <div className="btn-row">
            <a className="btn btn-ghost" href="/sermons">
              Past sermons
            </a>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <div className="video video-offline">
        <div>
          <h3>We are not live right now</h3>
          <p>When a service starts, the live video appears on this page. Watch past messages in the meantime.</p>
        </div>
      </div>
      <section className="section" style={{ paddingTop: 28 }}>
        <div className="btn-row">
          <a className="btn btn-primary" href="/sermons">
            Past sermons
          </a>
          <a className="btn btn-ghost" href={church.youtubeChannelUrl} target="_blank" rel="noopener noreferrer">
            <Icon name="play" /> Our YouTube channel
          </a>
        </div>
      </section>
    </>
  );
}
