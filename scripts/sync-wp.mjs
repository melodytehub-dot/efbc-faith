// Pulls real content from the efbcusa.com WordPress REST API into data/wp-content.json.
// Runs automatically before `next build`. If WordPress is unreachable, the last
// generated snapshot is kept so the build still succeeds.

import { writeFile, readFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outFile = path.join(root, 'data', 'wp-content.json');
const API = process.env.WP_API || 'https://efbcusa.com/wp-json/wp/v2';

const entities = {
  '&#8217;': '\u2019', '&#8216;': '\u2018', '&#8220;': '\u201c', '&#8221;': '\u201d',
  '&#8211;': '\u2013', '&#8212;': '\u2014', '&#8230;': '\u2026', '&#039;': "'",
  '&rsquo;': '\u2019', '&lsquo;': '\u2018', '&rdquo;': '\u201d', '&ldquo;': '\u201c',
  '&ndash;': '\u2013', '&mdash;': '\u2014', '&hellip;': '\u2026', '&nbsp;': ' ',
  '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"',
};

function clean(html = '') {
  return String(html)
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&[a-z0-9#]+;/gi, (m) => entities[m] ?? ' ')
    .replace(/\[[^\]]+\]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

async function get(resource, params = '') {
  const url = `${API}/${resource}?per_page=100${params}&_fields=id,slug,link,date,title,content,excerpt,featured_media,acf`;
  const res = await fetch(url, { headers: { 'User-Agent': 'EFBC-Faith/1.0' }, signal: AbortSignal.timeout(45000) });
  if (!res.ok) throw new Error(`${resource}: HTTP ${res.status}`);
  return res.json();
}

const map = (x) => ({
  id: x.id,
  slug: x.slug,
  link: x.link,
  date: x.date,
  title: clean(x.title?.rendered),
  text: clean(x.content?.rendered || x.excerpt?.rendered),
  image: x.featured_media || null,
});

async function main() {
  const [pages, sermons, ministries, events, posts, media] = await Promise.all([
    get('pages'), get('wdt_sermons'), get('wdt_ministry'), get('tribe_events'), get('posts'),
    fetch(`${API}/media?per_page=100&_fields=id,source_url,title,media_type`, { signal: AbortSignal.timeout(45000) }).then(r => r.json()),
  ]);

  const mediaById = new Map(media.map(m => [m.id, m.source_url]));
  const withImages = (arr) => arr.map(x => ({ ...x, imageUrl: mediaById.get(x.image) || null }));

  const payload = {
    generatedAt: new Date().toISOString(),
    source: 'https://efbcusa.com',
    pages: pages.map(map),
    sermons: withImages(sermons.map(map)),
    ministries: withImages(ministries.map(map)),
    events: withImages(events.map(map)),
    posts: withImages(posts.map(map)),
  };

  await mkdir(path.dirname(outFile), { recursive: true });
  await writeFile(outFile, JSON.stringify(payload, null, 2), 'utf8');
  console.log(`synced ${payload.pages.length} pages, ${payload.sermons.length} sermons, ${payload.ministries.length} ministries, ${payload.events.length} events, ${payload.posts.length} posts`);
}

main().catch(async (err) => {
  console.warn(`WP sync failed: ${err.message}. Keeping existing snapshot.`);
  try {
    const existing = await readFile(outFile, 'utf8');
    const j = JSON.parse(existing);
    console.log(`using snapshot from ${j.generatedAt}`);
  } catch {
    console.error('No existing snapshot available.');
    process.exitCode = 1;
  }
});
