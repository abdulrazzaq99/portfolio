# Portfolio v2 — Engineering Notebook + Live Hero (free-tier build)

**Date:** 2026-04-29
**Owner:** Abdul Razzaq
**Project:** `~/Documents/portfolio/portfolio-next/`
**Status:** Approved design, ready for implementation plan
**Related:** `WORK_LOG.md` (project handoff)

---

## Goal

Push the Next.js portfolio from "templated single-page dev portfolio" into a site that simultaneously serves three audiences:

1. **Senior/staff full-stack recruiters** — needs depth signals (case studies, system design, code samples, writing).
2. **Premium freelance clients** — needs trust signals (testimonials-equivalent: real data, dogfooding, polish).
3. **The dev community / shareable** — needs one screenshottable artifact that gets posted to Twitter/HN/LinkedIn.

The current site (after the dark/neon redesign on 2026-04-29) looks great but is structurally generic: one-page scroll, expand-in-place projects, fake "Currently Building" rotation, generic Skills tabbed grid, no deep pages, no writing, no shareable artifact.

This spec specifies the work to fix that, **using only resources Abdul already has** (the GitHub PAT in `.env.local`). Anything that requires a new account (Liveblocks, Cal.com, WakaTime) is left as a drop-in slot the user can flip on later by adding env vars.

---

## Non-goals

- 3D scene / Three.js / Bruno-Simon-style "drive the portfolio". Conflicts with depth + trust goals.
- Real LLM chatbot. Already explicitly rejected by user (cost + hallucination + jailbreak risk). The static Q&A panel covers it.
- Dark/light mode toggle. Site is dark-only by design choice on 2026-04-29.
- New CMS. Content lives in the repo as TS/MDX.
- Backend services beyond Next.js Server Components + Route Handlers.
- Vercel deployment in this work — that decision stays user-gated per the WORK_LOG.

---

## Architecture

### Routing

Site moves from single-route to multi-route:

| Route | Source of truth | Rendering | Notes |
|---|---|---|---|
| `/` | `src/data/*` + GitHub | Static + ISR (15 min) for live tiles | Refactored hero, killed Skills section |
| `/work/[slug]` | `src/data/projects.ts` | `generateStaticParams`, fully static | One page per project (8 total) |
| `/notes` | `src/content/notes/*.mdx` | Static | Index of essays |
| `/notes/[slug]` | `src/content/notes/<slug>.mdx` | `generateStaticParams`, fully static | One page per essay |
| `/system` | `src/app/globals.css` (parsed at build) + `src/components/**` | Static + RSC | Live design-system documentation |
| `/og/work/[slug]` | `src/data/projects.ts` | Edge runtime, on-demand | Satori-rendered 1200×630 |
| `/og/notes/[slug]` | `src/content/notes/<slug>.mdx` frontmatter | Edge runtime, on-demand | Satori-rendered 1200×630 |
| `/og/default` | `src/data/personal.ts` | Edge runtime, cached | Default OG for `/`, `/system`, `/notes` |

Existing one-page sections that stay on `/`: Hero, About, QA panel, Projects (now linking out), Experience, Contact. **Killed: Skills section** (replaced by a real-data widget that lives in the same slot).

### Component reuse

These existing components are reused without changes:

- `ArchitectureDiagram` — embedded inside `/work/[slug]`, larger size, drillable
- `EmbeddedTerminal` — stays on `/` only
- `Terminal` (⌘K modal) — extended with new commands: `goto work`, `goto notes`, `goto system`, `cat <slug>`
- `ThinkingMode` toggle — repurposed: on `/work/[slug]` the four blocks (decisions / tradeoffs / challenges / optimizations) are always visible; the toggle now controls whether the inline preview on `/` cards shows them
- `ProjectCard` — refactored to link to `/work/[slug]` instead of expanding in place; expand-in-place stays as a graceful fallback for projects without a deep page

New components:

- `LiveInstrumentPanel` — replaces `LiveCards` on `/`. Fetches GitHub data in a Server Component.
- `WorkPageShell` — layout wrapper for `/work/[slug]` (eyebrow breadcrumb, H1, meta strip, sections)
- `MetricsTable` — small static component, used inside `/work/[slug]`
- `RelatedWork` — 2-3 sibling project cards at the bottom of `/work/[slug]`
- `EmbedSandbox` — wrapper over Sandpack with project-aware presets (TS/JS only)
- `EmbedColab` / `EmbedVideo` / `EmbedFallback` — sister components for Python notebooks / native demos / static code-blocks
- `NoteShell` — layout for `/notes/[slug]` (~70ch reading column, Geist Mono code blocks with neon-emerald keywords matching the IDE card)
- `SystemPage` — `/system` route. Composes `TokenSwatch`, `TypeScale`, `ComponentGallery`, `EffectShowcase`, `DecisionsLog` blocks
- `LiveCursorsLayer` — client-only, dynamic-imported, env-gated. Ships disabled. (Phase 4 / drop-in.)

### Data shape extensions

`src/data/projects.ts` `Project` type gains:

```ts
type Project = {
  // existing fields kept...
  context?: string;          // 200-400 word problem narrative for /work/[slug]
  metrics?: Array<{          // shown in MetricsTable
    label: string;
    value: string;
    note?: string;
  }>;
  embed?:                    // discriminated union
    | { kind: "sandpack"; files: Record<string, string>; entry?: string }
    | { kind: "colab"; url: string }
    | { kind: "video"; src: string; poster?: string }
    | { kind: "fallback"; lang: string; code: string }
    | { kind: "none" };       // default if omitted
  relatedSlugs?: string[];   // 2-3 sibling slugs for RelatedWork
};
```

All new fields are optional. Existing data shape stays valid; deep pages render with sensible fallbacks when a field is missing.

`src/content/notes/<slug>.mdx` frontmatter:

```yaml
---
title: "How I built this portfolio's design system"
dek: "OKLCH tokens, Tailwind v4, the dark/neon pivot, and what broke."
date: 2026-04-29
readTime: "12 min"
status: draft  # 'draft' | 'published' — drafts excluded from /notes index in production
---
```

---

## Specifications by section

### S1 — Live Instrument Panel (replaces hero "LiveCards" slot)

**Tiles**, all real, all GitHub-derived:

| Tile | Source | Cache strategy |
|---|---|---|
| Karachi clock | Client `Date()` | none |
| **Last commit** (replaces "Currently Building" rotation) | GitHub GraphQL: `viewer.contributionsCollection.commitContributionsByRepository[0]` | revalidate 600s |
| **This week by language** (replaces 2× StatTile) | GitHub GraphQL: `viewer.repositories(orderBy: PUSHED_AT)` filtered to last 7 days, joined with each repo's `languages(first: 5)` weighted by bytes | revalidate 3600s |
| GitHub heatmap (existing) | `src/data/contributions.json` (refreshed by `npm run github:fetch`) | manual script |
| **Year contributions** (single replacement StatTile) | `contributions.total` from existing JSON | none |

A new server-side fetcher lives at `src/lib/github/live.ts`. Returns shape:

```ts
type LiveData = {
  lastCommit: { repo: string; message: string; sha: string; pushedAt: string } | null;
  weekLanguages: Array<{ name: string; bytes: number; pct: number }>;
};
```

Failure handling: if the GitHub call fails or token expired, the component renders a graceful "stats temporarily unavailable" line instead of crashing the page. SSR skip on error, never break the static build.

**Multiplayer cursors:** scaffolded but disabled. `LiveCursorsLayer` reads `process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY`. If unset (default), it renders nothing. If set, it dynamic-imports the Liveblocks SDK after first paint and joins room `home`. Cursors render as small neon-emerald dots with 2-letter initials. **Implementation deferred to Phase 4** — design space is reserved.

### S2 — Deep `/work/[slug]` template

Layout (top-down):

1. **Eyebrow breadcrumb:** `// /work · {slug}` in mono, neon `//`
2. **H1:** Project name with neon period
3. **Meta strip:** `{category} · {year} · {visibility} · {GitHub link}`
4. **Context section:** prose paragraph(s) from `project.context` (200-400 words). If absent, falls back to `project.problem`.
5. **Architecture section:** `ArchitectureDiagram` rendered full-width. If `project.architecture` absent, section is omitted.
6. **The Code section:** rendered via `<EmbedSandbox>` / `<EmbedColab>` / `<EmbedVideo>` / `<EmbedFallback>` per `project.embed.kind`. If `kind: "none"`, section is omitted.
7. **Metrics section:** `<MetricsTable>` from `project.metrics`. If absent, section is omitted.
8. **Lessons section:** the existing 4-block grid (decisions / tradeoffs / challenges / optimizations) from `project.thinking`. Always visible (not behind ThinkingMode toggle on these pages).
9. **Related section:** `<RelatedWork>` cards from `project.relatedSlugs`. If absent, auto-pick the **two most recent projects in the same `category`** that aren't the current one. If fewer than 2 same-category projects exist, top up from any category by `year` desc.

**Embed strategy per project** (initial set in Phase 3):

| Slug | Embed approach |
|---|---|
| `capital-valley` | `sandpack` — short JS snippet showing role-aware projection in the API layer |
| `finalcircle` | `sandpack` — Channels JWT handshake handler |
| `rag-healthcare` | `colab` — link to a public notebook of the RAG pipeline (Abdul to provide URL when ready) |
| `lead-genie` | `sandpack` — RSC + filter chain |
| `stock-screener` | `sandpack` — composable filter API |
| `hate-speech` | `colab` — public notebook URL |
| `gesture-pong` | `video` — short screen recording (Abdul to record when ready) |
| `pseudo-cpp` | `fallback` — side-by-side input/output static code blocks |

For projects where the embed source isn't yet ready (recordings, Colab URLs), the component renders a "Demo coming — see source on GitHub" placeholder rather than blocking page publication.

### S3 — `/system` design-system page

Single page, top-down:

1. **Tokens** — `<TokenSwatch>` grid auto-parsed from `src/app/globals.css` `@theme` block at build time. Each swatch shows: visual chip, CSS variable name (click-to-copy), OKLCH value, hex equivalent (computed). Sections: Surfaces, Ink & Text, Lines, Brand (deep + neon emerald), Motion easings.
2. **Type scale** — `<TypeScale>`. Geist Sans + Geist Mono samples at every size used in the codebase. Each sample shows class string (click-to-copy).
3. **Components** — `<ComponentGallery>`. Each tile renders the **actual React component** (not a screenshot) inside an isolation wrapper. Includes: Button (3 variants × 3 sizes), Badge (4 tones), TechBadge, the IDE-style ProjectVisual card, the EmbeddedTerminal (looped), BentoCard wrapper, the Eyebrow component. Each tile shows source path + line range below the live render.
4. **Effects** — `<EffectShowcase>`. Live demos of `glass`, `glass-elevated`, `gradient-border`, `shimmer`, `neon-glow`, `neon-text` with on/off comparison.
5. **Decisions log** — `<DecisionsLog>`. Five short prose entries: "why dark", "why a deep emerald + a neon emerald (two tokens, one brand)", "why no Motion library", "why CSS-only animations", "why Server Components by default". This is the meta-trust artifact recruiters share.

Token parsing happens at build time via a small `src/lib/system/parse-tokens.ts` script that reads `globals.css` and emits a JSON block consumed by the page. No runtime cost.

### S4 — `/notes` writing route

**Index page (`/notes`):** dead simple list. Each row: title (link), date, dek, read-time. Drafts excluded in production.

**Note page (`/notes/[slug]`):** ~70ch reading column. Geist Sans body, Geist Mono code blocks with neon-emerald keywords. MDX so essays can embed live components (used sparingly).

**Anchor essay at launch:** `src/content/notes/portfolio-design-system.mdx` is created with **outline + section headers only**. Body is for Abdul to write. Suggested outline (visible in the file as comments):

```
# How I built this portfolio's design system

## The brief
- What I wanted: dark, neon, software-engineer artifact-density
- What I had: an emerald base color (#006241) and Tailwind v4

## The token surgery
- Why two emeralds, not one
- The OKLCH math
- Glass utilities on dark vs light

## The IDE-artifact card
- Replacing the cream mockup
- Faux-syntax token coloring
- File-tree as compositional element

## What broke
- (your write-up)

## What I'd do differently
- (your write-up)
```

The file ships with `status: draft`, so `/notes` index hides it until Abdul flips it to `published`.

### S5 — Skills section replacement on `/`

**Current Skills section is fully removed** from `src/app/page.tsx` and the dynamic import dropped. Files (`src/components/sections/skills.tsx`, `src/data/skills.ts`) **deleted** — clean removal, no dead code.

**Replacement:** a single `<CodingTelemetry>` widget in the same slot. Two columns:

```
// THIS WEEK                 // THIS YEAR
TypeScript    8h 12m         262 commits
Python        2h 41m         47 PRs merged
SQL           41m            12 repos touched
[bar chart]                  [language donut]
```

The "this week" data comes from the same `LiveData.weekLanguages` fetch as S1. The "this year" numbers come from `contributions.json` plus a small extension to `scripts/fetch-github.mjs` that also pulls PR count and unique-repo-touched count.

**The "This Week" metric explained:** for each repo Abdul pushed to in the last 7 days, GitHub returns that repo's overall language-byte distribution. We weight each push event by the repo's languages and aggregate. Result: a per-language byte total that approximates "what languages I worked in this week". It's not wall-clock hours — labeled honestly in the UI as **"code committed this week, weighted by repo languages"** with a tooltip explaining the approximation.

If WakaTime ever gets wired (env var present), "This Week" switches to wall-clock hours and the label changes to "hours coded".

### S6 — Two-path Contact section

Right column unchanged (existing `<form>` + Zod + Sonner). Left column gains a primary tile above the existing contact-info blocks:

```
┌─────────────────────────────────────┐
│ //  QUICK PATH                       │
│                                      │
│  Want a 15-min call?                 │
│  Email me 3 times that work →        │
│                                      │
│  [neon-emerald button]               │
└─────────────────────────────────────┘
```

The button is a `mailto:` with pre-filled subject "15-min chat?" and a body listing the user's coords/timezone with three suggested time slots in PKT. No new account, no integration, low friction.

When Abdul sets up Cal.com, swap the `mailto:` for the booking URL — single line change.

### S7 — Experience section tightening

Each role gains a "ships" mini-list above the existing impact bullets:

```
Infinitiv AI · Full Stack Developer · Oct 2025 → Now
ships ▸ FinalCircle · Capital Valley · 4 internal tools

[existing impact bullets stay below]
```

Data shape extension in `src/data/experience.ts`:

```ts
type Experience = {
  // existing fields...
  ships?: string[];  // optional list of named projects/products shipped
};
```

Authoring left to Abdul; values default to `[]` if absent. No structural rework.

### S8 — Per-page OG image generation

Routes added:

- `app/og/work/[slug]/route.tsx` — renders the IDE-artifact card visual (same SVG as the home grid) plus project name + meta. 1200×630 PNG via `@vercel/og` Satori.
- `app/og/notes/[slug]/route.tsx` — renders title + read-time + a code-comment eyebrow on the dark grid background.
- `app/og/default/route.tsx` — renders the homepage hero condensed (Engineering systems that just keep running.) for `/`, `/system`, `/notes` index.

Pages reference these via Next.js `metadata.openGraph.images` per-route. Edge runtime, no API key needed.

### S9 — ⌘K Terminal extensions

Adds commands to support the new routes:

- `goto work` → navigates to `/` `#work`
- `goto notes` → navigates to `/notes`
- `goto system` → navigates to `/system`
- `cat <slug>` → navigates to `/work/<slug>` (autocompletes from project slugs)
- `ls notes` → lists published notes inline
- `share` → copies the current page URL with a UTM-tagged version

Existing commands kept.

---

## Engineering details

### Caching

- All GitHub-derived live tiles use Next.js `next: { revalidate: <seconds> }` on the underlying fetch. Cache is per-route at edge, not global.
- `/system` token data is parsed at build time, not at runtime.
- OG images are cached at the CDN by URL (Satori output is deterministic per slug).
- `contributions.json` continues to be refreshed manually via `npm run github:fetch`.

### Bundle size budget

Current baseline (verified 2026-04-29 after dark/neon redesign):

```
/                32.4 kB         151 kB First-Load JS
shared           105 kB
```

Targets after this work:

| Route | Page size | First-Load JS | Notes |
|---|---|---|---|
| `/` | ≤ 36 kB | ≤ 165 kB | Live widget adds ~10 kB; cursors layer dynamic-imported |
| `/work/[slug]` | ≤ 30 kB | ≤ 160 kB | Sandpack only loaded on routes that use it (lazy) |
| `/notes/[slug]` | ≤ 18 kB | ≤ 130 kB | MDX overhead |
| `/system` | ≤ 25 kB | ≤ 145 kB | Component gallery is RSC where possible |

Sandpack (~80 kB gz) is `dynamic(import, { ssr: false })` and only included on `/work/[slug]` pages where `embed.kind === 'sandpack'`. Liveblocks SDK only loaded if `NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY` is set at runtime (not build).

### New dependencies

| Package | Phase | Purpose | Bundle impact |
|---|---|---|---|
| `@codesandbox/sandpack-react` | 1 (used in 2-3) | Embedded code sandboxes on `/work/[slug]` | ~80 kB gz, dynamic-imported, only on routes that use it |
| `@vercel/og` | 1 | Satori-rendered OG images | Edge runtime only, zero impact on page bundles |
| `@next/mdx` + `@mdx-js/loader` + `@mdx-js/react` | 2 | MDX support for `/notes/[slug]` | Build-time only |
| `@liveblocks/client` + `@liveblocks/react` | 4 (deferred) | Multiplayer cursors | ~12 kB gz, dynamic-imported, env-gated |

No other runtime dependencies added. The `gray-matter` parser for MDX frontmatter is already part of `@next/mdx`.

### Env vars

Added to `.env.example` (committed) and `.env.local` (gitignored):

```bash
# Already present
GITHUB_TOKEN=...

# Optional drop-ins (graceful when unset)
NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY=
LIVEBLOCKS_SECRET_KEY=
WAKATIME_API_KEY=
NEXT_PUBLIC_CAL_COM_LINK=
```

Every optional env var degrades silently: no key → feature disabled → no console error → no broken UI.

### Accessibility

- Cursors: decorative, `aria-hidden`. Presence count announced via `aria-live="polite"` only when count changes, not every cursor move.
- Sandpack: keyboard nav respected; visible focus ring; content is also available as static code below the embed for screen readers.
- `/system` page: skip-link to "Components" section; semantic headings; click-to-copy buttons have proper ARIA labels.
- `/work/[slug]`: `<article>` wrapper, semantic section headings, breadcrumb in `<nav aria-label="Breadcrumb">`.
- All new animations respect `prefers-reduced-motion` (already wired globally in `globals.css`).
- Color contrast: every new neon-on-dark pair verified ≥ 4.5:1 in `/system` page itself (the page documents its own contrast).

### Security

- WakaTime + Liveblocks env vars never exposed beyond what Next.js conventions allow (`NEXT_PUBLIC_` prefix gates client exposure).
- GitHub PAT scope unchanged (read-only, expires 2026-05-28; renewal noted in WORK_LOG already).
- OG image routes use Edge runtime — no filesystem access, no env-var leaks via stack traces.
- MDX content is statically rendered at build; no runtime MDX evaluation, no XSS surface.
- `mailto:` body strings sanitize user inputs (none currently — pre-filled values only).
- No third-party analytics added in this work.

### Testing

This site has no test suite today. This spec does not introduce one — TDD-via-pixel-perfect on a solo portfolio is overkill. Verification strategy:

- `npm run build` must pass with zero new warnings
- `npx tsc --noEmit` must pass with zero new errors
- Playwright screenshot of `/` , `/work/finalcircle`, `/system`, `/notes` after each phase to confirm no regression
- Lighthouse run on `/` after Phase 2 (target 95+)

If any of those fail, the phase isn't done.

---

## Phasing

Three independently-shippable phases. Each phase ends with a clean `npx next build` and a commit. Don't start Phase N+1 until Phase N is merged.

### Phase 1 — The spine: routes + `/system` + first 3 case studies

1. Add `/work/[slug]` route with full template (S2)
2. Author `context` + `metrics` + `embed` for the 3 already-deep projects: `capital-valley`, `finalcircle`, `rag-healthcare`. The other 5 ship deep pages with fallbacks (no context, no embed) — they get filled in Phase 3.
3. Update home `<ProjectCard>` to link to `/work/[slug]`
4. Build `/system` page (S3) with auto-parsed tokens, type scale, component gallery, effects, decisions log
5. Build OG image routes for `/work/[slug]`, `/notes/[slug]`, `/og/default` (S8)
6. Verify build, screenshot, commit, push.

**Definition of done:** All 8 project URLs render. `/system` lists every token + component. Sharing a `/work/finalcircle` URL on Twitter shows a designed thumbnail.

### Phase 2 — Live instrument hero + Skills replacement + writing scaffold

1. Build `<LiveInstrumentPanel>` with GitHub-only data (S1, no WakaTime, no Liveblocks yet)
2. Delete `Skills` section + its data file; add `<CodingTelemetry>` widget in its slot (S5)
3. Extend `scripts/fetch-github.mjs` to also pull PR count + unique-repo count for the year stats
4. Add `/notes` index + `/notes/[slug]` route + `<NoteShell>` (S4)
5. Author the anchor essay scaffold (`portfolio-design-system.mdx`) with outline-only body — Abdul fills in prose later
6. Extend ⌘K terminal with new commands (S9)
7. Verify build, Lighthouse 95+ on `/`, screenshot, commit.

**Definition of done:** Hero shows real "Last commit" + real "This week by language". Skills section is gone. `/notes` route works (with one draft hidden by default).

### Phase 3 — Polish + remaining 5 case studies + Contact + Experience

1. Two-path Contact section (S6) — `mailto:` quick-path tile
2. Embeds for the other 5 projects (S2 table) — Sandpack snippets, Colab links, video / fallback
3. `context` field authored for the 5 remaining projects (Abdul writes)
4. "ships" mini-list per Experience role (S7)
5. Verify build, screenshot, commit.

**Definition of done:** Every project has a context paragraph + an embed (or graceful fallback). Contact has the two-path layout. Experience shows ships per role.

### Phase 4 — Drop-ins (deferred until Abdul opts in)

Not part of the immediate plan; specified now so future Abdul knows what to do:

1. **Multiplayer cursors:** sign up for Liveblocks (free, 100 MAU), add 2 env vars, the layer activates automatically.
2. **WakaTime hours:** install WakaTime in editor, get API key, add env var, the "This Week" widget switches from byte-count to wall-clock hours and the label changes.
3. **Cal.com booking:** create Cal.com account, set `NEXT_PUBLIC_CAL_COM_LINK`, the Contact tile swaps `mailto:` for the booking URL.
4. **Real testimonials:** when 1-2 clients are willing to be quoted, add a `<Testimonials>` section between Experience and Contact (data shape: `{ quote, author, role, org, avatar?, link? }`).

Phase 4 work is each ≤ 1 hour once Abdul is ready.

---

## Risks & open questions

### Risks

| Risk | Likelihood | Mitigation |
|---|---|---|
| GitHub PAT expires 2026-05-28 mid-build | Medium | Build script logs token TTL; graceful degradation if expired |
| Sandpack bundle bloats `/work/[slug]` | Low | Dynamic-imported, ssr: false, only on routes that use it |
| Authoring fatigue (writing 8 case studies + 1 essay) | High | Phasing splits authoring across phases; ship pages with fallbacks for missing fields |
| OG image generation failures at the edge | Low | Fall back to `/og/default` if route errors; never block page render |
| Token parsing regex misses an OKLCH value in `globals.css` | Low | `/system` page renders parse warnings inline in dev mode only |

### Open questions (non-blocking — defaults assumed)

These don't block plan-writing. Decisions can be made during implementation.

1. **Anchor essay topic:** defaulting to "How I built this portfolio's design system" per design discussion. If Abdul wants a different topic, the scaffold is one rename + one frontmatter swap.
2. **`/work/[slug]` related section:** auto-pick by category if `relatedSlugs` not provided. Abdul can override per project later.
3. **`mailto:` body wording:** placeholder copy provided; Abdul can edit later in `personal.ts`.
4. **OG image typography**: matches site (Geist Sans / Mono). Satori needs font binaries fetched at build time. **Decision:** fetch Geist via `fonts.googleapis.com` at build, embed as base64 in the OG route. If the fetch fails at build (network / 5xx), the route uses Inter (Satori's bundled fallback) — still readable, off-brand. Build does not fail.

---

## Out of scope (explicit non-work)

To keep this spec honest, the following are **not** in this work and won't be silently added:

- A `/now` page (some portfolios have one — Abdul's QA panel covers similar ground).
- A blog with multiple posts. One anchor essay scaffold is the commitment.
- A real-time chat UI (Q&A panel covers this).
- A 3D scene or canvas-heavy hero animation.
- A new color palette or design system overhaul (we just did one).
- Authentication, comments, view counts, or any backend persistence.
- Vercel deployment automation.

If any of these become desirable later, they get their own spec.

---

## Success criteria

Six months after Phase 3 ships, the portfolio is "successful" if any one of these is true:

- A recruiter or client cites a specific `/work/[slug]` page in their first message ("I read your FinalCircle writeup")
- The `/system` page or anchor essay gets shared on Twitter/HN/LinkedIn unprompted
- An interview includes "I looked at your architecture diagrams" or equivalent depth-signal language
- WakaTime/Liveblocks/Cal.com get flipped on (signal Abdul kept building)

If none of those happen in six months, the structural choices in this spec are wrong and need revisiting.
