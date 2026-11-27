// Dates are stored as local church time strings: "YYYY-MM-DDTHH:mm".
// Formatting works on the string parts so the displayed time never shifts with the visitor's timezone.

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function parts(value: string) {
  const [date, time = "00:00"] = value.split("T");
  const [y, m, d] = date.split("-").map(Number);
  const [hh, mm] = time.split(":").map(Number);
  const weekday = DAYS[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
  return { y, m, d, hh, mm, weekday };
}

export function formatTime(value: string) {
  const { hh, mm } = parts(value);
  const period = hh >= 12 ? "PM" : "AM";
  const h12 = hh % 12 === 0 ? 12 : hh % 12;
  return `${h12}:${String(mm).padStart(2, "0")} ${period}`;
}

export function formatDay(value: string) {
  const { y, m, d, weekday } = parts(value);
  return `${weekday}, ${MONTHS[m - 1]} ${d}, ${y}`;
}

export function formatShortDate(value: string) {
  const { m, d } = parts(value);
  return { month: MONTHS[m - 1].slice(0, 3).toUpperCase(), day: String(d) };
}

export function formatWhen(startsAt: string, endsAt?: string | null) {
  const time = endsAt ? `${formatTime(startsAt)} to ${formatTime(endsAt)}` : formatTime(startsAt);
  return `${formatDay(startsAt)}, ${time}`;
}

// Extracts an 11-character YouTube id from a pasted link (client-side preview only; the server validates).
export function youtubeIdFromInput(input: string): string | null {
  const value = input.trim();
  if (/^[A-Za-z0-9_-]{11}$/.test(value)) return value;
  try {
    const url = new URL(value);
    const host = url.hostname.replace(/^(www|m)\./, "");
    let id: string | null = null;
    if (host === "youtu.be") id = url.pathname.slice(1).split("/")[0];
    else if (host === "youtube.com" || host === "youtube-nocookie.com") {
      if (url.pathname === "/watch") id = url.searchParams.get("v");
      else {
        const match = url.pathname.match(/^\/(live|embed|shorts)\/([^/?#]+)/);
        if (match) id = match[2];
      }
    }
    return id && /^[A-Za-z0-9_-]{11}$/.test(id) ? id : null;
  } catch {
    return null;
  }
}
