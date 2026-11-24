# EFBC — Premium "Faith App" Website
## Design & Build Plan · v1.1 · 23 Nov 2026

> **Update v1.1 — approved decisions**
> - Stack: **headless WordPress + Next.js static export** (approved).
> - Scope: **all 8 screens** plus a dedicated **Hymns** screen (approved).
> - **Baibal Thiang (Hakha, 1920 open dataset) is the only Bible version** in the app — no version switcher.
> - **Full in-app hymn library** from khrihfahlabu.org: 514 hymns + 51 Chawnghlang Relnak readings, searchable by number, title or lyrics, with source links and saved favourites.
> - `website-production-quality` skill installed and used as the production guide (no developer commentary or invented content in the customer UI).
> - Build status: **Next.js static export builds successfully**; all screens render; Bible and hymn data verified loading in a real browser.
> - QA: Lighthouse Accessibility / Best Practices / SEO all **1.00**; no horizontal overflow at 390px.
> - See `README.md` for the build, data assets and the remaining headless-WP integration steps.

---

## 0. The one-line direction

**A calm, cinematic, app-like church experience for Emmanuel Farm Baptist Church — the sample's faith-app interaction system, GetLayers' premium visual discipline, and Taste Skill's anti-slop build rules, all fed by the church's real WordPress content.**

Working codename: **EFBC Faith** — *Walk in faith, together.*

---

## 1. What I researched

### 1.1 The client site — efbcusa.com

| Item | Finding |
|---|---|
| Identity | **Emmanuel Farm Baptist Church (EFBC)** — established 5 Jan 2025, Pine Bluff area, now meeting in **Star City, Arkansas** |
| People | A Burmese **Chin** church community; many members are chicken farmers. Bilingual English/Chin content already exists (e.g. *"Pumh Caan: 2:00 PM–4:00 PM"*, emergency meeting notices) |
| Motto / anchor verse | *"Growing in truth. Living in love. Glorifying God."* — **Ephesians 4:15** |
| Contact | 235 Knight Haven Circle, Star City, AR 71667 · (469) 260-9861 · (317) 853-0356 · efbcusainfo@gmail.com · chinley10@gmail.com · Mon–Sat 9:00–17:00 |
| Real pages | Home, About Us, Our Team, Our Ministries, Ministry, Latest Sermons, Church Events, FAQs, Donation, Contact, Blog, Campaign, Shop, Testimonial, Newsletter, Location, Audio Book, Donor Dashboard, My Account |
| Real content worth keeping | About / Mission / Vision / Core Values copy (strong and specific), the 12-person leadership roster with Chin names and roles, 6 ministries (Building, Women, Children, Youth, Music, Mission), 8 blog posts, a real event (*Bupi General Meeting*), a recent bilingual announcement |
| Content that needs replacing | Large amounts of **lorem ipsum** on Donation, Ministries, FAQs, Sermons and several section headings. Placeholder team names (Arno Wiegand, Wolfgang Thilo, etc.) appear to be template leftovers — must be verified before use |
| Assets | ~100 media items, including **real congregation photographs** (`DSC_*.jpg`, `DCST*.jpg`, `vb*.jpg`, team portraits, banners). A usable logo candidate (`cropped-DCST.png`, `BC.svg`). No app UI assets — those come from the sample direction |
| Current colours found in theme | `#151515` charcoal, `#FFC107` amber/gold, `#122F2A` deep green, `#F8F2E6` cream, `#f89d35` orange |
| Current problem | A conventional, template-driven WordPress/Elementor site — attractive in places but generic, slow-feeling, and **not** the premium app experience the client now wants |

### 1.2 The sample UI she sent (the system to build into)

Three phone screens, one design language:

1. **Home / dashboard (centre)** — a full-bleed sunset photograph with a cross; a warm greeting (*"Good Morning / Walk in faith today"*); a **solid verse card** (*"Philippians 4:13 — I can do all things through Christ who strengthens me"*); a **3×2 tile grid** with real-style icons and labels — **Bible, Prayer, Church, Community, Live Stream, More**; a fixed **bottom tab bar** — Home, Bible, Community, Profile.
2. **Bible reader (left)** — a quiet dark reading view, *"Holy Bible"* header with back, **John 3:16** set large, and an **audio scrubber + transport controls** over an open-Bible photograph.
3. **Live stream (right)** — a **LIVE** badge, **2.4K watching**, a service title, a scrolling **community chat** with real avatars and names, and a message composer.

Extracted rules we must preserve: **dark navy ground, gold/amber accent, warm photographic hero, solid cards (no busy overlays), icon tiles, fixed bottom navigation, greeting + scripture as the emotional centre, live presence and community as first-class features.**

### 1.3 GetLayers.ai — the "blueprint" we are borrowing

GetLayers is not just a gallery; it is a **build methodology**. Its blueprint, translated to our project:

| GetLayers principle | How we apply it |
|---|---|
| A layer hands your AI the **hard parts up front** — motion, depth, atmosphere | We ship a single design system + section specs, not loose pages |
| A prompt is **one self-contained HTML file**, portable to any stack | Our prototype is one system; production rebuilds in the chosen stack |
| **One design language across the whole project** | One palette, one type pairing, one radius scale, one card family |
| Motion + depth are **baked in**, not sprinkled | Hero entrance, dealt moments, hover/press layer from day one |
| Performance and SEO are **measured, not promised** | Our build is checked at 1440/1024/820/768/390 with the skill's checker and gate |
| Real source (Next.js) for the exact result; prompts for reshaping | We keep WP as the content source, rebuild the front end properly |
| Commercial licence, no attribution required | Safe for client work |

### 1.4 Taste Skill (installed and used)

`design-taste-frontend` **v2.5.1** is now installed in `.agents/skills/design-taste-frontend/`. I ran its dealers for this brief:

- **Hero deal** — `photo`: *"Full-bleed photograph, the words on its calm side."* This matches the sample's cross-at-sunset hero. Words sit on a calm area / solid box — never a scrim or gradient veil.
- **Palette** — dealt defaults clashed with the sample, so I used the client's **own brand colours** through `start.mjs brand`:
  ```
  --p-bg #0b1626   --p-surface #152740   --p-ink #f8f2e6   --p-muted #8fa3b8
  --p-accent #ffc107   --p-action #ffc107   (ink on gold: #0b1626)
  ```
- **Type** — Outfit + DM Mono (geometric, friendly, precise — suits an app and consumer brand). Headlines 400, tracking −3/−4%.
- **Radius** — soft; **buttons** — solid gold primary, quiet outline secondary.
- **Non-negotiables from the skill** that shape this design: one section per screen, equal left/right edges, no captions under images, real photographs, no violet, no scroll-in fades, real icons, every control named, 44px tap targets, and a browser-checked finish gate.

> Note: the skill's moment library did not fully copy during install (empty moment folders). I'll repair it from the cloned source before the build phase; it does not affect the design decisions above.

---

## 2. Classification & design system

**Kind:** a **place** (people come to worship and belong) delivered as a **software-like product experience** (the sample is an app). We therefore build with the discipline of a software/app page — one system, real UI, measured motion — while keeping the church's photographic, human content.

### 2.1 Tokens

| Token | Value | Use |
|---|---|---|
| `--p-bg` | `#0b1626` | App ground, deep navy |
| `--p-surface` | `#152740` | Cards, tiles, nav, reader panels |
| `--p-ink` | `#f8f2e6` | Primary text (warm cream) |
| `--p-muted` | `#8fa3b8` | Secondary text, metadata |
| `--p-accent` | `#ffc107` | Gold — actions, LIVE, active tab, verse highlight |
| `--p-action-ink` | `#0b1626` | Text on gold |
| Inverse band | cream bg / navy ink | Alternating light section for testimonies, giving |
| Fonts | Outfit (display + text), DM Mono (numbers, labels, scripture reference) | Google Fonts, preconnected |
| Radius | soft (`--r-lg` on cards, smaller on tiles) | Consistent family |
| Grid | 12 columns desktop, equal `.wrap` edges; 6-tile grid becomes 2 columns on phone | Equal edges always |
| Elevation | 1px hairline borders + subtle shadow; **no heavy glass blur** | Cards read as solid, not foggy |

### 2.2 Visual language

- **Photography leads.** Real EFBC congregation photos, warm and unposed. Hero uses a golden-hour cross/sky image; sections use different frames, never the same photo twice.
- **Solid cards** on the photo, never a dark scrim over the whole image.
- **Gold is the signal**: active tab, primary button, LIVE badge, scripture reference, progress bar.
- **Type does the emotional work**: large, calm, sentence case. No shouted all-caps headings.
- **Motion is quiet and purposeful**: hero enters once; cards lift 2px; photos zoom 1.02 inside their frame; buttons step and press; the verse card and LIVE chat are the two dealt moments.
- **No captions under images.** Credits, if needed, in one footer line.

---

## 3. Information architecture — the app shell

Desktop is the same app, expanded: a **fixed left rail** (logo + Home, Bible, Prayer, Church, Community, Live, More), a top bar with greeting + search + profile, and a content canvas. Mobile is the sample verbatim: bottom tab bar, full-width tiles.

```
EFBC FAITH
├── Home            — greeting, daily verse, 6 feature tiles, next service, live now
├── Bible           — Baibal Thiang (Hakha only), 66 books, chapter nav, full-text search, audio-Bible link
├── Hymns           — Khrihfa Hlabu: 514 hymns + 51 readings, search, lyrics, saved favourites
├── Prayer          — request wall, submit request, "pray with you" action
├── Church          — about, mission/vision/values, 6 ministries, leadership, location/hours
├── Community       — feed, testimonies, event RSVP, grouped chat
├── Live            — LIVE player, viewer count, service chat, sermon notes
├── Profile         — account, giving history, saved verses, notification settings
└── More            — sermons, events, blog, audio book, campaigns, shop, donation, FAQ
```

**Primary action:** *Join us / Watch live* (the sample's emotional centre is the live service).
**Secondary actions:** *Read today's verse*, *Send a prayer request*, *Give*.

---

## 4. Screen-by-screen specification

### 4.1 Home — the first screen
- **Full-bleed hero photograph** (golden-hour cross / EFBC sky), words on the calm side.
- **Sun mark** + `Good Morning, EFBC` (time-aware greeting) + `Walk in faith today.` in Outfit 72/44.
- **Solid verse card** anchored to the photo: `Philippians 4:13` in mono, then *"I can do all things through Christ who strengthens me."* Gold hairline, 1px border.
- **Six tiles (3×2)** in solid surface cards, each with a real icon, label and a one-line promise: Bible (Read the Word), Prayer (Pray with us), Church (Find your family), Community (Walk together), Live Stream (Watch the service), More (Everything else).
- **Bottom tab bar** — Home, Bible, Community, Profile — with the gold active state.
- **Moment:** the verse card arrives once on load; tiles settle in quietly (no scroll fades).

### 4.2 Bible
- Quiet reading view. Header: back, `Holy Bible`, search.
- **John 3:16** set large on a calm dark ground, with a faint open-Bible photograph on the lower third.
- **Audio bar**: progress scrubber with gold fill, prev / play / next, time codes in DM Mono.
- Chapter rail (Old/New Testament, book list), font-size control, bookmark, share verse.
- Content source: the church's *Audio Book* page plus scripture text; stand-in scripture until the client supplies audio.

### 4.3 Prayer
- **Prayer wall** of real submitted requests (initially seeded with the church's own language and marked as examples if needed — never invented testimonies).
- Composer: *"Share a prayer request"* → name (optional), request, privacy toggle, submit.
- Each card: avatar, name, request, `Pray with you` button, count of prayers. Confirmation only after a real send.
- A quiet verse band: *"The Lord is near to all who call on him."* — Psalm 145:18.

### 4.4 Church
- **About** — the real story: founded 5 Jan 2025, Burmese Chin believers, Star City. Motto and Ephesians 4:15.
- **Mission / Vision / Core Values** — the strong existing copy, rewritten into plain voice (7 value cards with real icons).
- **Ministries** — 6 cards: Building, Women, Children, Youth, Music, Mission. Each gets a real congregation photograph.
- **Leadership** — the verified 12-person roster with roles and portraits (placeholder names removed).
- **Visit** — address, service time (2:00–4:00 PM, *"Pumh Caan"* with Chin translation), hours, contact, directions link (street-level only).

### 4.5 Community
- Feed of real posts: announcements (including the bilingual emergency meeting notice), event RSVPs, testimonies with permission.
- Group chat preview and a `Message the church` composer — mirrors the sample's live chat pattern.
- Event card: *Bupi General Meeting* with date and details from the WP event page.

### 4.6 Live
- **LIVE badge** + viewer count + service title, full-bleed video frame with a real poster from the media library.
- **Chat panel** with avatars, names, messages, and a composer — exactly the sample's third screen, expanded for desktop.
- Below: sermon notes, series list, previous services (from *Latest Sermons* / blog posts).
- Client slot: the real stream URL / embed and service schedule to be supplied.

### 4.7 Profile & More
- Profile: saved verses, prayer requests, giving, settings, language toggle (English / Chin) — a real differentiator for this church.
- More: the full WP page set as app-style list rows with icons — Sermons, Events, Blog, Audio Book, Campaign, Shop, Donation, FAQ, Testimonial, Newsletter, Location.

---

## 5. Content migration from WordPress

| WP source | Destination in the app |
|---|---|
| `home`, `about-us` | Home hero copy, Church → About / Mission / Vision / Values |
| `our-team` | Leadership grid (after placeholder audit) |
| `ministry`, `our-ministries` | 6 ministry cards |
| `latest-sermons`, 8 blog posts | Live → Sermons, More → Blog, Bible accents |
| `church-events`, event post | Community event card |
| `frequents-questions` | More → FAQ (rewrite lorem answers with real ones) |
| `contact-us` | Church → Visit + Contact |
| `donation`, `our-campaigns` | More → Giving, campaigns |
| `shop`, `audio-book`, `donor-dashboard` | More list rows (keep commerce/auth flows or link out) |
| Media library | Hero, ministry, team, sermon and community photography |
| Bilingual notices | Community feed + a Chin/EN language toggle |

**Critical cleanup:** replace every lorem-ipsum block with real copy. The Taste Skill's copy linter will fail placeholder text, and the client will notice it first. Anything not supplied is marked `[to confirm]` in the build, never invented as fact.

---

## 6. Responsive behaviour

| Width | Behaviour |
|---|---|
| 1440 | App shell: left rail + top bar + canvas; one section per screen; hero alone on screen one |
| 1024 | Rail collapses to icons; grids become 2 columns |
| 820 / 768 | Single canvas; tiles 2 columns; live chat moves below player |
| 390 | The sample exactly: bottom tab bar, stacked tiles, verse card, full-width buttons, 44px targets |
| 320 | No overflow, no collisions (gate walks this width) |

---

## 7. Motion & interaction

- **Hero entrance once** on load: greeting, then verse card, then tile grid — under 1s total, no repeat.
- **Two dealt moments:** (1) verse card arrival on Home; (2) live chat typing/arrival on Live. Both have still variants for reduced motion and phones.
- **Hover/press layer:** linked cards lift 2px, photos zoom 1.02 inside frames, gold buttons step on hover and press on click, underlines draw.
- **No** scroll-in fades, parallax text, carousels, tilt, or timed tabs.
- **Reduced motion:** everything rests; nothing stays hidden.

---

## 8. Accessibility, performance, SEO

- Named controls, visible labels, alt text on all photographs, heading order h1→h2→h3, skip link first in tab order, focus ring visible and never under the header.
- Every interactive target ≥44px on phone; no two targets closer than 8px.
- Images: WebP, sized to their slot, lazy-loaded below the fold, no upscaling past source resolution.
- SEO: semantic headings, title/description, Open Graph + Twitter, JSON-LD for `Church` / `Event` / `BreadcrumbList`, sitemap, canonical, robots — the GetLayers standard of 100/100 SEO is the target.
- Bilingual content: proper `lang` attributes on Chin text; language toggle preserves state.

---

## 9. Technical approach — recommendation

| Option | Pros | Cons |
|---|---|---|
| **A. Headless WordPress + Next.js static export (recommended)** | Keeps WP admin for the client's team; premium app UI; best performance/SEO; exactly what GetLayers and Taste Skill are built for | Needs a deploy target (Vercel/Cloudflare/existing host) and a one-time content sync |
| B. Custom WordPress theme in the existing install | No new hosting; client edits in WP as today | Harder to hit the app-like motion and page-speed bar; Elementor legacy cleanup |
| C. Standalone static app + WP only as archive | Simplest design build | Disconnects the client's editorial workflow — not recommended |

**Recommended:** Option A. WordPress stays the CMS (REST API at `/wp-json/wp/v2`), the new front end is a Next.js static export built with the Taste Skill kit, checked with its browser gate, then deployed. If the client insists everything stays inside WordPress, we fall back to B with the same design system.

---

## 10. Phased plan

1. **Sign-off** — approve this direction, the palette, and the stack (1–2 days).
2. **Design system + Home screen** — tokens, components, the dealt photo hero, and the full first screen; browser-checked at all widths.
3. **Core app screens** — Bible, Prayer, Church, Community, Live, Profile, More; content migrated from WP and placeholders cleared.
4. **Motion, moments, accessibility** — hero entrance, two dealt moments, hover/press layer, reduced-motion variants, a11y pass.
5. **QA gate** — Taste Skill `consistency.mjs`, `check.mjs`, `shoot.mjs`, `perf.mjs`, `gate.mjs`; fix every FAIL; Lighthouse SEO/a11y.
6. **Content & handoff** — client supplies audio, stream URL, verified team names/photos, real FAQs; final content pass; CMS training; launch.

---

## 11. Decisions I need from you / the client

1. **Stack** — happy with headless WP + Next.js static export, or must it stay a traditional WordPress theme?
2. **Scope** — full app (all 8 screens) for v1, or a focused v1 (Home, Bible, Live, Church, Community) with the rest in More?
3. **Real stream** — is there a live-stream URL/provider we should wire into the Live screen?
4. **Language** — should English/Chin be a full toggle across the app, or Chin on key announcements and verses only?
5. **Team data** — please confirm the real leadership names/roles; the current site has obvious template placeholders.
6. **Brand** — can you send the logo (SVG/PNG) and any brand guide? I found candidate files but want the authoritative one.
7. **Sample** — do you have a Figma/file or larger exports of the sample screens? It would let us match icon shapes and spacing exactly.

---

## 12. Definition of done

- [ ] First screen says what this is, for whom, with one hard fact — and the hero fills it alone
- [ ] All 8 app screens built with one design system, equal edges, real content
- [ ] Every visual renders at 1440 / 1024 / 820 / 768 / 390 / 320
- [ ] Two dealt moments, hero entrance, hover/press layer, reduced-motion variants
- [ ] No lorem ipsum, no invented people/testimonies, no captions under photos
- [ ] `GATE: PASS` from the Taste Skill checker; Lighthouse SEO ≥ 100
- [ ] WordPress content flow preserved and documented for the client's team
