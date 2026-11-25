type IconName =
  | "home"
  | "book"
  | "hands"
  | "church"
  | "community"
  | "live"
  | "more"
  | "search"
  | "chevron-left"
  | "chevron-right"
  | "chevron-down"
  | "phone"
  | "mail"
  | "pin"
  | "clock"
  | "play"
  | "music"
  | "mic"
  | "heart"
  | "calendar"
  | "arrow-right"
  | "external"
  | "menu"
  | "close";

const paths: Record<IconName, string> = {
  home: "M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z",
  book: "M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM4 5v16M9 7h6",
  hands: "M7 13.5 4.6 11a1.6 1.6 0 0 1 0-2.2 1.6 1.6 0 0 1 2.2 0L9 10.9M12 10.5 9.8 8.3a1.6 1.6 0 0 1 2.2-2.2L15 8.1M3 15l4.5 4.5a2.5 2.5 0 0 0 3.5 0L15 16.5a2.8 2.8 0 0 0 0-4L12 9.5M21 15l-4.5 4.5",
  church: "M12 2v4M10 4h4M6 22V11l6-4 6 4v11M10 22v-5h4v5M3 22h18",
  community: "M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3 20v-1a5 5 0 0 1 5-5h2a5 5 0 0 1 5 5v1M16 5.5a3 3 0 0 1 0 5.8M18 14.5a5 5 0 0 1 3 4.5v1",
  live: "M4 12a8 8 0 0 1 16 0M7.5 12a4.5 4.5 0 0 1 9 0M12 12h.01M3 9.5V7M21 9.5V7M4.5 17l-1 3M19.5 17l1 3",
  more: "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z",
  search: "M11 18a7 7 0 1 1 0-14 7 7 0 0 1 0 14zM21 21l-4.3-4.3",
  "chevron-left": "M15 18l-6-6 6-6",
  "chevron-right": "M9 18l6-6-6-6",
  "chevron-down": "M6 9l6 6 6-6",
  phone: "M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z",
  mail: "M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM2 6l10 7 10-7",
  pin: "M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21zM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
  clock: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2",
  play: "M6 4l14 8-14 8z",
  music: "M9 18V5l12-2v13M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM21 16a3 3 0 1 1-6 0 3 3 0 0 1 6 0z",
  mic: "M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3zM19 10v2a7 7 0 0 1-14 0v-2M12 19v3",
  heart: "M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z",
  calendar: "M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM3 10h18M8 2v4M16 2v4",
  "arrow-right": "M5 12h14M13 6l6 6-6 6",
  external: "M14 3h7v7M21 3l-9 9M19 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5",
  menu: "M4 7h16M4 12h16M4 17h16",
  close: "M6 6l12 12M18 6 6 18",
};

export function Icon({ name, className = "" }: { name: IconName; className?: string }) {
  return (
    <svg className={`ic ${className}`.trim()} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d={paths[name]} />
    </svg>
  );
}

export type { IconName };
