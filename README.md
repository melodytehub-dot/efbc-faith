# EFBC Faith

A premium, app-like web experience for Emmanuel Farm Baptist Church (efbcusa.com), built as a Next.js static export with content sourced from the church's WordPress site.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static export written to out/
```

## Screens

| Route | What it does |
|---|---|
| `/` | Home — photographic hero, Hakha daily verse, six feature tiles |
| `/bible/` | Baibal Thiang (Hakha, 1920 open dataset) — 66 books, chapters, full-text search, audio-Bible link |
| `/hymns/` | Khrihfa Hlabu — 514 hymns + 51 readings from khrihfahlabu.org, searchable, with saved favourites and source links |
| `/prayer/` | Prayer focus and a request form that opens the church's email app |
| `/church/` | About, mission, vision, 7 values, 6 ministries, 12 leaders, visit and contact |
| `/community/` | Church notices, events and welcome information |
| `/live/` | Sunday service frame, sermon archive, service chat that opens when live |
| `/profile/` | Shortcuts and contact links |
| `/more/` | Full site index and sermon archive |

## Data assets

- `public/data/bible-hakha.json` — Baibal Thiang, Hakha Chin (1920), from the open `laisiangtho/bible` dataset. The only Bible version in the app, as requested.
- `public/data/hymns.json` — 514 hymns and 51 readings pulled from the public WordPress REST API at khrihfahlabu.org, with source links preserved.
- `lib/content.ts` — the curated church content snapshot (about, ministries, leaders, sermons, events, contact) taken from efbcusa.com's REST API.
- `public/images/` — real congregation and ministry photography from the church's media library.

## Content provenance and rights

- Bible text: Baibal Thiang (Hakha), open dataset `laisiangtho/bible` (MIT).
- Hymns and readings: Khrihfa Hlabu (khrihfahlabu.org). The app links to each original entry and to downloadable files; lyrics are displayed for reading within the app as requested. Confirm the rights for redistribute-on-site with the hymn publisher before launch if required.
- Photography: from efbcusa.com's own media library, for this client project.

## Build and QA status

- `npm run build` — passes, 13 static pages exported.
- Browser check — all screens render; Hakha Bible (66 books, 21 chapters in Johan, 36 verses) and all 514 hymn rows load correctly; hymn detail dialog displays real lyrics.
- Lighthouse (home): Accessibility **1.00**, Best Practices **1.00**, SEO **1.00** (re-run after final changes).
- 15 routes checked in a real browser with zero console errors; robots.txt and sitemap.xml both return 200.
- Layout check at 1440x900 and 390x844 — no horizontal overflow or tap-target collisions.

## Headless WordPress

`npm run sync:wp` (also runs automatically as `prebuild`) fetches pages, sermons (`wdt_sermons`), ministries (`wdt_ministry`), events (`tribe_events`), posts and media from `https://efbcusa.com/wp-json/wp/v2` into `data/wp-content.json`. `lib/wp-data.ts` exposes that snapshot to the app. If WordPress is unreachable, the last good snapshot is kept so the build still succeeds.

## Content cleanup completed on the live site

All lorem-ipsum blocks were removed from the WordPress site via the REST API (authenticated WP Admin session) across pages, posts, sermons and ministries. The FAQ questions now have real answers; ministry and sermon descriptions carry real church copy. The original Elementor structure was preserved — only placeholder text was replaced. Client review of the new wording is recommended.

## Functionality parity with the old site

Implemented in the app: Home, About/Church, Team & leadership, Ministries, Sermons, Events, FAQs, Donation/Giving, Contact, Blog (list + 8 detail pages), Testimonials/Community, Live, Prayer, Bible (Hakha), Hymns, Newsletter-style email forms, location/directions, sitemap and robots.txt.

Kept on the existing WordPress/WooCommerce install (payments and account sessions should not be rebuilt in a static export): Shop, Cart, Checkout, My Account, Donor Dashboard, Audio Book and ticket checkout. These are linked from the More screen.

## Remaining items

1. **Livestream URL** — pending your instructions. `/live/` currently shows an honest "appears here when live" state.
2. **Audio Bible** — see the recommendation in the developer chat; no local audio files were supplied, so `/bible/` links out for now.
3. **Hero image** — both image-generation providers failed on credentials in this environment, and Wikimedia rate-limited the download. The app uses the church's own real photography and official circular EFBC logo instead. A golden-hour cross photograph can be dropped into `/public/images/` when available.
4. **Bilingual UI** — Bible and hymns are Hakha; the surrounding interface is English. Add a full English/Chin UI toggle if requested.

## Skills used

- `design-taste-frontend` — design system, palette/type dealing, anti-slop rules.
- `website-production-quality` — customer-facing copy and QA gate; no developer commentary or invented content rendered in the UI.
