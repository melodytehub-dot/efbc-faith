/// <reference types="@cloudflare/workers-types" />

// Cloudflare Worker: serves the static site and a small JSON API for live stream,
// events, announcements, featured sermon, cover photos, and the admin dashboard.

export interface Env {
  DB: D1Database;
  MEDIA: R2Bucket;
  ASSETS: Fetcher;
  ADMIN_PASSWORD?: string;
  SESSION_SECRET?: string;
}

const SESSION_COOKIE = "efbc_admin";
const SESSION_MS = 12 * 60 * 60 * 1000;
const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;
const IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

type Json = Record<string, unknown>;

function json(data: unknown, status = 200, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", ...headers },
  });
}

function fail(message: string, status = 400) {
  return json({ error: message }, status);
}

async function readJson(request: Request): Promise<Json | null> {
  try {
    const body = await request.json();
    return body && typeof body === "object" && !Array.isArray(body) ? (body as Json) : null;
  } catch {
    return null;
  }
}

function str(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length <= max ? trimmed : null;
}

// ---------- Time helpers (church is in Central Time) ----------

function todayChicago(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Chicago",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

const DATETIME_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

// ---------- YouTube ----------

export function parseYouTubeId(input: string): string | null {
  const value = input.trim();
  if (/^[A-Za-z0-9_-]{11}$/.test(value)) return value;
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return null;
  }
  const host = url.hostname.replace(/^www\./, "").replace(/^m\./, "");
  let id: string | null = null;
  if (host === "youtu.be") {
    id = url.pathname.slice(1).split("/")[0];
  } else if (host === "youtube.com" || host === "youtube-nocookie.com") {
    if (url.pathname === "/watch") id = url.searchParams.get("v");
    else {
      const m = url.pathname.match(/^\/(live|embed|shorts)\/([^/?#]+)/);
      if (m) id = m[2];
    }
  }
  return id && /^[A-Za-z0-9_-]{11}$/.test(id) ? id : null;
}

// ---------- Settings (key/value JSON) ----------

async function getSetting<T>(db: D1Database, key: string): Promise<T | null> {
  const row = await db.prepare("SELECT value FROM settings WHERE key = ?").bind(key).first<{ value: string }>();
  return row ? (JSON.parse(row.value) as T) : null;
}

async function setSetting(db: D1Database, key: string, value: unknown) {
  await db
    .prepare(
      "INSERT INTO settings (key, value, updated_at) VALUES (?, ?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at",
    )
    .bind(key, JSON.stringify(value), new Date().toISOString())
    .run();
}

type LiveSetting = { isLive: boolean; videoId: string | null };
type AnnouncementSetting = { active: boolean; text: string; link: string | null };
type SermonSetting = { videoId: string; title: string; date: string | null } | null;

// ---------- Admin session ----------

const encoder = new TextEncoder();

async function hmacHex(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(message));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function createSessionCookie(env: Env): Promise<string> {
  const exp = Date.now() + SESSION_MS;
  const sig = await hmacHex(env.SESSION_SECRET!, `admin:${exp}`);
  return `${SESSION_COOKIE}=${exp}.${sig}; Path=/; Max-Age=${SESSION_MS / 1000}; HttpOnly; Secure; SameSite=Strict`;
}

function clearSessionCookie() {
  return `${SESSION_COOKIE}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict`;
}

async function isAdmin(request: Request, env: Env): Promise<boolean> {
  if (!env.SESSION_SECRET) return false;
  const cookie = request.headers.get("cookie") || "";
  const match = cookie.match(new RegExp(`(?:^|;\\s*)${SESSION_COOKIE}=([^;]+)`));
  if (!match) return false;
  const [exp, sig] = match[1].split(".");
  if (!exp || !sig || Number(exp) < Date.now()) return false;
  return safeEqual(sig, await hmacHex(env.SESSION_SECRET, `admin:${exp}`));
}

async function passwordMatches(given: string, expected: string) {
  // Compare fixed-length digests so the check does not leak the password length.
  const [a, b] = await Promise.all([
    crypto.subtle.digest("SHA-256", encoder.encode(given)),
    crypto.subtle.digest("SHA-256", encoder.encode(expected)),
  ]);
  const ha = [...new Uint8Array(a)].map((x) => x.toString(16).padStart(2, "0")).join("");
  const hb = [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join("");
  return safeEqual(ha, hb) && given === expected;
}

// ---------- Events ----------

type EventRow = {
  id: string;
  title: string;
  starts_at: string;
  ends_at: string | null;
  location: string | null;
  description: string | null;
  cover_key: string | null;
  published: number;
};

function toEvent(row: EventRow) {
  return {
    id: row.id,
    title: row.title,
    startsAt: row.starts_at,
    endsAt: row.ends_at,
    location: row.location,
    description: row.description,
    coverKey: row.cover_key,
    coverUrl: row.cover_key ? `/api/media/${row.cover_key}` : null,
    published: row.published === 1,
  };
}

async function parseEventInput(body: Json) {
  const title = str(body.title, 120);
  const startsAt = typeof body.startsAt === "string" ? body.startsAt : "";
  const endsAt = typeof body.endsAt === "string" && body.endsAt ? body.endsAt : null;
  const location = str(body.location ?? "", 160);
  const description = str(body.description ?? "", 3000);
  const coverKey = typeof body.coverKey === "string" && body.coverKey ? body.coverKey : null;
  if (!title) return { error: "Add a title for the event (up to 120 characters)." };
  if (!DATETIME_RE.test(startsAt)) return { error: "Choose a start date and time." };
  if (endsAt && !DATETIME_RE.test(endsAt)) return { error: "The end time is not valid." };
  if (endsAt && endsAt < startsAt) return { error: "The end time must be after the start time." };
  if (location === null || description === null) return { error: "Location or description is too long." };
  if (coverKey && !/^covers\/[0-9a-f-]{36}\.(jpg|png|webp)$/.test(coverKey)) return { error: "The cover photo is not valid." };
  return {
    value: {
      title,
      startsAt,
      endsAt,
      location: location || null,
      description: description || null,
      coverKey,
      published: body.published === false ? 0 : 1,
    },
  };
}

// ---------- Routes ----------

async function handleApi(request: Request, env: Env, url: URL): Promise<Response> {
  const { pathname } = url;
  const method = request.method;
  const db = env.DB;

  // Public
  if (method === "GET" && pathname === "/api/live") {
    const live = (await getSetting<LiveSetting>(db, "live")) ?? { isLive: false, videoId: null };
    return json({ isLive: live.isLive && !!live.videoId, videoId: live.isLive ? live.videoId : null });
  }

  if (method === "GET" && pathname === "/api/announcement") {
    const a = await getSetting<AnnouncementSetting>(db, "announcement");
    return json(a && a.active && a.text ? { active: true, text: a.text, link: a.link } : { active: false });
  }

  if (method === "GET" && pathname === "/api/sermon") {
    return json({ sermon: await getSetting<SermonSetting>(db, "featured_sermon") });
  }

  if (method === "GET" && pathname === "/api/events") {
    const { results } = await db
      .prepare("SELECT * FROM events WHERE published = 1 AND starts_at >= ? ORDER BY starts_at ASC LIMIT 60")
      .bind(todayChicago())
      .all<EventRow>();
    return json({ events: results.map(toEvent) });
  }

  if (method === "GET" && pathname.startsWith("/api/media/")) {
    const key = decodeURIComponent(pathname.slice("/api/media/".length));
    if (!/^covers\/[0-9a-f-]{36}\.(jpg|png|webp)$/.test(key)) return fail("Not found", 404);
    const object = await env.MEDIA.get(key);
    if (!object) return fail("Not found", 404);
    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set("etag", object.httpEtag);
    headers.set("cache-control", "public, max-age=31536000, immutable");
    return new Response(object.body, { headers });
  }

  // Auth
  if (method === "POST" && pathname === "/api/admin/login") {
    if (!env.ADMIN_PASSWORD || !env.SESSION_SECRET) return fail("The admin login is not set up yet.", 503);
    const body = await readJson(request);
    const password = typeof body?.password === "string" ? body.password : "";
    if (!password || !(await passwordMatches(password, env.ADMIN_PASSWORD))) {
      return fail("That password is not correct.", 401);
    }
    return json({ ok: true }, 200, { "set-cookie": await createSessionCookie(env) });
  }

  if (method === "POST" && pathname === "/api/admin/logout") {
    return json({ ok: true }, 200, { "set-cookie": clearSessionCookie() });
  }

  if (!pathname.startsWith("/api/admin/")) return fail("Not found", 404);
  if (!(await isAdmin(request, env))) return fail("Please sign in to continue.", 401);

  if (method === "GET" && pathname === "/api/admin/session") return json({ ok: true });

  // Live stream
  if (pathname === "/api/admin/live") {
    if (method === "GET") {
      const live = (await getSetting<LiveSetting>(db, "live")) ?? { isLive: false, videoId: null };
      return json(live);
    }
    if (method === "PUT") {
      const body = await readJson(request);
      if (!body) return fail("Something went wrong with that request.");
      const current = (await getSetting<LiveSetting>(db, "live")) ?? { isLive: false, videoId: null };
      let videoId = current.videoId;
      if (typeof body.youtube === "string" && body.youtube.trim()) {
        videoId = parseYouTubeId(body.youtube);
        if (!videoId) return fail("That does not look like a YouTube link. Paste the link from the video page.");
      }
      const isLive = body.isLive === true;
      if (isLive && !videoId) return fail("Paste the YouTube live link before going live.");
      const next: LiveSetting = { isLive, videoId };
      await setSetting(db, "live", next);
      return json(next);
    }
  }

  // Events
  if (pathname === "/api/admin/events" && method === "GET") {
    const { results } = await db.prepare("SELECT * FROM events ORDER BY starts_at ASC").all<EventRow>();
    return json({ events: results.map(toEvent) });
  }

  if (pathname === "/api/admin/events" && method === "POST") {
    const body = await readJson(request);
    const parsed = body ? await parseEventInput(body) : { error: "Something went wrong with that request." };
    if (!parsed.value) return fail(parsed.error!);
    const v = parsed.value;
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    await db
      .prepare(
        "INSERT INTO events (id, title, starts_at, ends_at, location, description, cover_key, published, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      )
      .bind(id, v.title, v.startsAt, v.endsAt, v.location, v.description, v.coverKey, v.published, now, now)
      .run();
    const row = await db.prepare("SELECT * FROM events WHERE id = ?").bind(id).first<EventRow>();
    return json({ event: toEvent(row!) }, 201);
  }

  const eventMatch = pathname.match(/^\/api\/admin\/events\/([0-9a-f-]{36})$/);
  if (eventMatch) {
    const id = eventMatch[1];
    const existing = await db.prepare("SELECT * FROM events WHERE id = ?").bind(id).first<EventRow>();
    if (!existing) return fail("That event could not be found.", 404);

    if (method === "PUT") {
      const body = await readJson(request);
      const parsed = body ? await parseEventInput(body) : { error: "Something went wrong with that request." };
      if (!parsed.value) return fail(parsed.error!);
      const v = parsed.value;
      await db
        .prepare(
          "UPDATE events SET title = ?, starts_at = ?, ends_at = ?, location = ?, description = ?, cover_key = ?, published = ?, updated_at = ? WHERE id = ?",
        )
        .bind(v.title, v.startsAt, v.endsAt, v.location, v.description, v.coverKey, v.published, new Date().toISOString(), id)
        .run();
      if (existing.cover_key && existing.cover_key !== v.coverKey) await env.MEDIA.delete(existing.cover_key);
      const row = await db.prepare("SELECT * FROM events WHERE id = ?").bind(id).first<EventRow>();
      return json({ event: toEvent(row!) });
    }

    if (method === "DELETE") {
      await db.prepare("DELETE FROM events WHERE id = ?").bind(id).run();
      if (existing.cover_key) await env.MEDIA.delete(existing.cover_key);
      return json({ ok: true });
    }
  }

  // Cover photo upload
  if (pathname === "/api/admin/media" && method === "POST") {
    const form = await request.formData().catch(() => null);
    const file = form?.get("file");
    if (!(file instanceof File)) return fail("Choose a photo to upload.");
    const ext = IMAGE_TYPES[file.type];
    if (!ext) return fail("Please upload a JPG, PNG, or WebP photo.");
    if (file.size > MAX_UPLOAD_BYTES) return fail("That photo is larger than 8 MB. Please choose a smaller one.");
    const key = `covers/${crypto.randomUUID()}.${ext}`;
    await env.MEDIA.put(key, file.stream(), { httpMetadata: { contentType: file.type } });
    return json({ key, url: `/api/media/${key}` }, 201);
  }

  // Announcement banner
  if (pathname === "/api/admin/announcement") {
    if (method === "GET") {
      return json((await getSetting<AnnouncementSetting>(db, "announcement")) ?? { active: false, text: "", link: null });
    }
    if (method === "PUT") {
      const body = await readJson(request);
      const text = body ? str(body.text, 240) : null;
      if (text === null) return fail("The announcement is too long (240 characters at most).");
      const link = body?.link ? str(body.link, 500) : null;
      if (link && !/^(https?:\/\/|\/)/.test(link)) return fail("The link must start with https:// or /.");
      const active = body?.active === true;
      if (active && !text) return fail("Write the announcement text before showing it.");
      const next: AnnouncementSetting = { active, text: text || "", link: link || null };
      await setSetting(db, "announcement", next);
      return json(next);
    }
  }

  // Featured sermon
  if (pathname === "/api/admin/sermon") {
    if (method === "GET") {
      return json({ sermon: await getSetting<SermonSetting>(db, "featured_sermon") });
    }
    if (method === "PUT") {
      const body = await readJson(request);
      if (!body) return fail("Something went wrong with that request.");
      if (body.clear === true) {
        await db.prepare("DELETE FROM settings WHERE key = ?").bind("featured_sermon").run();
        return json({ sermon: null });
      }
      const videoId = typeof body.youtube === "string" ? parseYouTubeId(body.youtube) : null;
      if (!videoId) return fail("That does not look like a YouTube link. Paste the link from the video page.");
      const title = str(body.title, 160) || "Featured message";
      const date = typeof body.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(body.date) ? body.date : null;
      const sermon = { videoId, title, date };
      await setSetting(db, "featured_sermon", sermon);
      return json({ sermon });
    }
  }

  return fail("Not found", 404);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (!url.pathname.startsWith("/api/")) return env.ASSETS.fetch(request);
    try {
      return await handleApi(request, env, url);
    } catch (err) {
      console.error("API error", err);
      return fail("Something went wrong. Please try again.", 500);
    }
  },
};
