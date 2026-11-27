"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { api } from "@/lib/api";

type Notice = { active: boolean; text?: string; link?: string | null };

export function Announcement() {
  const pathname = usePathname() || "/";
  const [notice, setNotice] = useState<Notice | null>(null);

  useEffect(() => {
    if (pathname.startsWith("/admin")) return;
    let active = true;
    api<Notice>("/api/announcement")
      .then((data) => active && setNotice(data))
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [pathname]);

  if (pathname.startsWith("/admin") || !notice?.active || !notice.text) return null;

  return (
    <div className="announcement" role="region" aria-label="Church announcement">
      <p>{notice.text}</p>
      {notice.link && (
        <a href={notice.link} target={notice.link.startsWith("/") ? undefined : "_blank"} rel={notice.link.startsWith("/") ? undefined : "noopener noreferrer"}>
          Learn more
        </a>
      )}
    </div>
  );
}
