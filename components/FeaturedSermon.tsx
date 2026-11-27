"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { church } from "@/lib/church";
import { formatDay } from "@/lib/format";

type Sermon = { videoId: string; title: string; date: string | null };

// Shows the sermon chosen in the admin dashboard, or the default featured video.
export function FeaturedSermon() {
  const [custom, setCustom] = useState<Sermon | null>(null);

  useEffect(() => {
    let active = true;
    api<{ sermon: Sermon | null }>("/api/sermon")
      .then((data) => active && setCustom(data.sermon))
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const videoId = custom?.videoId ?? church.featuredVideoId;
  const title = custom?.title ?? "Featured message from Emmanuel Farm Baptist Church";

  return (
    <>
      <div className="video reveal">
        <iframe
          key={videoId}
          src={`https://www.youtube-nocookie.com/embed/${videoId}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
        />
      </div>
      {custom && (
        <p className="fine" style={{ marginTop: 12 }}>
          {custom.title}
          {custom.date ? ` · ${formatDay(`${custom.date}T00:00`)}` : ""}
        </p>
      )}
    </>
  );
}
