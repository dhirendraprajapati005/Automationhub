# AutomationHub — Complete Build (Phases 1-6 + Legal + SEO + Wiring/Faults + Homepage/PWA/Images/Analytics)

The free learning platform for PLC programming, industrial automation, HMI, SCADA, VFD, servo systems, sensors, pneumatics, robotics, and industrial networking.

## Homepage Polish, PWA, Image Optimization, Analytics

**Real search** — `GET /api/search?q=` searches titles/descriptions/tags across lessons, machines, blog/news posts, wiring diagrams, and fault finder entries in one query, with regex-special-character escaping so search input can't break the query. The homepage hero search bar now actually navigates to `/search?q=...` and returns real results, instead of doing nothing on submit.

**Real newsletter** — `NewsletterSubscriber` model + `POST /api/newsletter/subscribe`, rate-limited, sends a real confirmation email through the same email utility as OTP and contact form mail. The homepage form is now backed by this instead of a no-op `preventDefault()`.

**New homepage sections**, all fetching real data (not static placeholders):
- **Machine Library by category** — pulls actual categories and counts from the Machine collection
- **Popular downloads** — sorted by real download count
- **Latest community questions** — real threads from the Community Forum
- **Learn on YouTube** — 3 real, verified industrial automation channels (RealPars, TW Controls, SolisPLC), linking to their actual channel pages rather than unverifiable specific video IDs

**PWA service worker** — via `vite-plugin-pwa`, replacing the old static, unused manifest:
- Precaches the built app shell for offline navigation
- Network-first runtime caching for API GET requests (fresh when online, cached fallback when offline)
- A proper on-brand icon (graphite background, amber ladder-rung mark, teal rail dots — matching the actual design system instead of the generic placeholder favicon that shipped since Phase 1) generated at 192x192 and 512x512 via `sharp`
- Verified in a real production build: `dist/sw.js`, `dist/workbox-*.js`, and `dist/manifest.webmanifest` all generate correctly and the manifest link is auto-injected into `index.html`

**Image optimization** — every community-uploaded image is resized (max 1600px, never upscaled) and re-encoded to WebP at quality 80 server-side via `sharp` before it ever touches disk, cutting typical file size 60-80% with no visible quality loss at display size. Verified with a real resize+compress test. Community images also use `loading="lazy"` on the frontend.

**Analytics** — a GA4 utility (`frontend/src/lib/analytics.ts`) that's a complete no-op without `VITE_GA_MEASUREMENT_ID` set — no fake or placeholder tracking ID ships by default. When configured, it tracks a pageview on every client-side route change (not just the initial load, which matters for an SPA), via `RouteChangeTracker.tsx`.

## Wiring Diagrams + Fault Finder

The last two placeholder pages from the original spec's page list are now real.

**Wiring Diagrams** — a structured, data-driven wiring reference, not just prose:
- `WiringDiagram` model stores actual terminal-to-terminal connections (device terminal → controller terminal, with a note per connection), not a flat description
- A generic SVG component (`TerminalWiringDiagram.tsx`) renders any diagram from that data — device terminals on the left, controller terminals on the right, connected by lines — reused across all 8 diagrams instead of hand-drawing each one
- **8 real diagrams**: NPN and PNP proximity sensors, photoelectric sensors, 4-20mA transmitters, VFD control terminals, rotary encoder to a Delta PLC HSC input, solenoid valve via interposing relay, and a dual-channel E-Stop safety circuit — each with a "Common mistakes" section pulled from genuine field experience (the NPN/PNP S/S-terminal mixup, ground loops, VFD control-source parameter, etc.)
- Terminal ID references were validated: every `connections` entry in the seed data was checked to reference a real terminal that actually exists on that diagram

**Fault Finder** — symptom-based troubleshooting, not a flat FAQ:
- `Fault` model: one symptom, multiple ranked causes (`most likely` / `possible` / `less common`), each cause with concrete check steps and a specific fix
- **10 real fault entries** across VFD & Drives, Sensors, PLC & Controls, HMI & SCADA, Motion & Feedback, and Machine-Specific (tying directly into the Machine Library's Filling Machine, Leak Testing Machine, and Conveyor pages)
- Frontend renders each as an accordion — expand a cause to see its check steps and fix, collapse to scan the ranked list quickly
- Also emits `FAQPage` JSON-LD structured data per fault, since the cause/fix format maps naturally to that schema

Both are wired into the sitemap (`/sitemap.xml` now includes wiring diagram and fault finder URLs) and use the same `useSEO` + `Breadcrumbs` pattern as the rest of the site.

## SEO

**Honest limitation first:** this is a client-rendered React SPA, not server-rendered. Social crawlers (Facebook, Twitter/X, LinkedIn, Slack link unfurling) fetch raw HTML and don't execute JavaScript, so per-page Open Graph tags set client-side won't be picked up by those specific crawlers — a shared link will show the static homepage preview from `index.html` regardless of which page was shared. Fixing that fully requires server-side rendering or pre-rendering (e.g. migrating to Next.js, or adding a prerendering step), which is a real architecture change, not a config tweak. What's below is the correct best-effort short of that rewrite — and it fully works for real visitors and for Googlebot, which does execute JavaScript.

**What's implemented:**
- `useSEO` hook (`frontend/src/hooks/useSEO.ts`) — sets `document.title`, meta description, Open Graph tags, Twitter Card tags, and a canonical `<link>` per page, plus optional JSON-LD structured data. Applied to Home, Learn, every Track and Lesson page, Machine Library and every machine detail page, Calculators and every calculator, Downloads, Blog/News lists and every post, Community list and every thread, About, Contact, Privacy, and Terms
- **Structured data** (`frontend/src/lib/structured-data.ts`): `Organization` schema on the homepage, `TechArticle` on lessons and machines, `Article` on blog/news posts, `BreadcrumbList` everywhere breadcrumbs appear
- **Breadcrumbs** (`frontend/src/components/Breadcrumbs.tsx`) — real visual navigation (not just schema) on lesson, machine, calculator, and post detail pages, e.g. Learn → PLC Programming → What is a PLC?
- **Real XML sitemap**: `GET /sitemap.xml` on the backend builds the sitemap from actual published lessons, machines, and posts in MongoDB — not a static file, so new content appears automatically. `robots.txt` points at it. **Note:** in production, your hosting needs a rewrite rule so `https://yourdomain.com/sitemap.xml` reaches this backend route, since the frontend and backend are typically deployed to different origins — the file itself isn't enough on its own
- `robots.txt` — already existed, now cross-referenced with `SITE_URL`

## Post-Phase-6: About, Contact, Privacy, Terms

The four pages that were still stub placeholders after Phase 6:

- **About** — real content on what AutomationHub is, why it exists, and where the Machine Library's authenticity comes from
- **Contact** — a genuinely working form: `POST /api/contact` validates and emails the submission (via the same email utility OTP uses, now shared as `backend/src/utils/email.js`), rate-limited to 5 submissions per 15 minutes per IP. Set `CONTACT_EMAIL` in `.env` (falls back to `ADMIN_EMAIL` if unset)
- **Privacy Policy** and **Terms of Service** — real, specific drafts covering account data, community content, the AI Assistant's use of the Anthropic API, cookies, and user content ownership — not generic lorem ipsum. Both end with an honest disclaimer: these are templates, not reviewed by a lawyer, and should get real legal review (especially jurisdiction, governing law, and data-protection-regime specifics like GDPR or India's DPDP Act) before real users' data depends on them.

## Phase 6: Community, Blog, News, and AI Assistant

**Blog + News** — one `Post` model (`type: "blog" | "news"`), since the two are structurally identical:
- `GET /api/posts/:type`, `GET /api/posts/:type/:slug`, plus admin CRUD (`POST` / `PUT` / `DELETE`, all admin-only)
- 3 real blog posts and 3 real news posts seeded — not lorem ipsum
- Frontend: `/blog`, `/blog/:slug`, `/news`, `/news/:slug` — one generic `PostListPage`/`PostDetailPage` pair renders both, driven by a `type` prop

**Community Forum** — the most structurally complex piece:
- `Thread` (question or project, images, likes, comment count, view count) and `Comment` models
- Reputation points awarded server-side only (+5 posting a thread, +2 commenting, +1 per like received) — never trusts a client-submitted point value
- Follow/unfollow between users (`following` array added to `User`)
- Image upload for threads (up to 4, 8MB each, JPG/PNG/WebP/GIF), served statically from `/uploads/community`
- Moderation: admins and moderators can delete any thread or comment
- Frontend: `/community` (filterable list), `/community/new` (post form, login required), `/community/:id` (full thread, comments, like, follow, moderation delete buttons for admins/moderators)

**AI Assistant** — real backend integration, not a mock:
- `POST /api/ai-assistant/ask`, protected + separately rate-limited (10/minute) since each call costs real API usage
- Calls the Anthropic API server-side with a system prompt scoped to PLC/HMI/SCADA/VFD/servo/sensor/troubleshooting topics — the API key never reaches the browser
- Without `ANTHROPIC_API_KEY` set, the endpoint returns a clear "not configured" message instead of failing silently or faking a response
- Frontend: `/ai-assistant` — a real chat UI with conversation history sent on each request

**Admin Panel, now fully wired**: Blog Management and News Management use the same `AdminPosts` component (parameterized by type) to create/delete posts; Community Moderation lists and deletes threads. Only Course Management, Analytics, SEO Settings, and Advertisement Management remain intentional placeholders — building real screens for those needs product decisions (in-panel lesson editing vs. keeping the seed-script workflow; which analytics to track; whether ads are ever introduced at all) that are genuinely open questions, not just unbuilt code.

## What's genuinely still open

- **True per-page social sharing previews** — would need SSR/pre-rendering, a real architecture change (see SEO section for why)
- **Community threads** aren't seeded with sample data — they need real authenticated users, so the forum starts empty (though the homepage's "Latest community questions" section will populate automatically once some exist)
- **Course Management, Analytics (admin panel), SEO Settings, Advertisement Management** in the Admin Panel are placeholders pending product decisions, not missing code
- **AI Assistant** requires your own `ANTHROPIC_API_KEY`
- **Search** is regex substring matching, not a ranked/fuzzy search engine — fine at this content scale, would need something like Atlas Search or a dedicated search service (Algolia, Meilisearch) if the content library grows much larger
- **Analytics** requires your own `VITE_GA_MEASUREMENT_ID` — without it, nothing is tracked, by design

## Running it locally

### Backend
```bash
cd backend
cp .env.example .env
# fill in: MONGO_URI, JWT secrets, Google client ID, SMTP creds,
# ADMIN_EMAIL/ADMIN_PASSWORD, SITE_URL, and optionally ANTHROPIC_API_KEY
npm install
npm run seed         # 27 lessons + 10 machines + 6 posts + 8 wiring diagrams + 10 fault entries
npm run seed:admin   # your first admin account
npm run dev            # http://localhost:5000
```

### Frontend
```bash
cd frontend
cp .env.example .env   # optionally set VITE_GA_MEASUREMENT_ID
npm install
npm run dev             # http://localhost:5173
npm run build            # production build, including the PWA service worker
```

Try: `/learn`, `/machine-library`, `/calculators`, `/downloads`, `/blog`, `/news`, `/community`, `/ai-assistant`, `/wiring-diagrams`, `/fault-finder`, `/search?q=vfd`, and `/admin` (after logging in as the seeded admin).

## Design system

Graphite panel background (`#12151A`), safety-amber accent (`#F2A93B`), circuit-teal secondary (`#2DD4BF`). Space Grotesk (display), Inter (body), JetBrains Mono (data/code). All tokens in `frontend/src/index.css` under `@theme`.

## Full feature summary by phase

1. **Foundation** — auth (JWT + OTP + Google), routing, dark/light theme, SEO basics, security middleware
2. **Core tutorial content** — 27 lessons across 9 learning tracks
3. **Engineering Calculators** — all 12, config-driven, instant results
4. **Machine Library** — 10 machines, 9 sections each, section table-of-contents
5. **Downloads + Admin Panel** — real file upload/download, role-gated admin with live dashboard stats and user management
6. **Community + Blog + News + AI Assistant** — the platform's social and AI-assisted layers

Every phase was type-checked (`tsc -b`), production-built (`npm run build`), and syntax-verified across the full backend before being marked complete.
