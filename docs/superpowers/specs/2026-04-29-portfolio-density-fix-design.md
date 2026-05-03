# Portfolio v2.1 — Density & Fussiness Fix

**Date:** 2026-04-29
**Owner:** Abdul Razzaq
**Project:** `~/Documents/portfolio/portfolio-next/`
**Status:** Approved (Plan B — restructured), ready for implementation
**Related specs:**
- `2026-04-29-portfolio-engineering-notebook-design.md` (Phase 1 spine — completed Tasks 1-18)

---

## Goal

The redesign + Phase 1 work shipped a portfolio that the owner now describes as "too compact" and "fussy", especially the hero section and navbar. The cause is YAGNI failure: every "engineering artifact" touch was added on top of the existing bento layout without removing anything to compensate.

This spec specifies the surgical fix: cut ~50% of the visual elements above the fold, simplify the navbar, calm the animation noise, and add breathing room. Keep the dark/neon design system, the IDE-artifact project cards, the embedded terminal — those are the showcase. Kill the dashboard noise around them.

## Non-goals

- New design system (the dark + neon emerald tokens stay)
- New routes (everything from Phase 1 stays — `/system`, `/work/[slug]`, OG generation all untouched)
- New data model
- Changes to `/work/[slug]`, `/system`, QA panel, Projects grid, Experience timeline, Contact form
- Phase 2 work (CodingTelemetry widget, multiplayer cursors, etc.) — this spec is purely subtractive on top of current state
- Re-introducing the old cream/light theme

---

## Diagnosis (counted)

Above the fold on `/` currently has ~30 distinct visual elements:

- **Navbar (11):** AR avatar, name text, 6 nav links, ⌘K button, Thinking Mode toggle, Available badge with ping
- **Hero (~20):** Crosshair marker, 3 status badges, prompt eyebrow + cursor, big headline, animated rotating role line, tagline paragraph, 3 CTAs, embedded terminal (1 dense panel), 7-tile bento row (LiveClock + CurrentlyBuilding + ActivityCard + 4 StatTiles), scroll cue

Plus 4+ pulsing/ping animations active simultaneously.

A clean hero usually has 5-8 elements. We have 30.

---

## What changes

### S1 — Navbar (11 → 4 items)

Modify [src/components/layout/navbar.tsx](src/components/layout/navbar.tsx):

| | Before | After |
|---|---|---|
| Logo | AR avatar + "Abdul Razzaq" text | **Same** |
| Nav links | Home / About / Ask / Skills / Work / Experience / Contact (7) | **Work · About · Contact (3)** |
| ⌘K | Present | **Same** |
| Thinking Mode toggle | Brain icon + animated switch | **Removed from navbar.** Lives in ⌘K (Section 6). |
| Available badge | "● Available '26" with ping | **Removed.** Single status indicator moves to hero. |

Modify [src/lib/sections.ts](src/lib/sections.ts) so `<Navbar>` and the scroll-spy only consider 3 anchors (`work`, `about`, `contact`). The other section IDs (`home`, `ask`, `skills`, `experience`) stay in the DOM (other parts use them as anchor targets) but drop out of the nav menu.

The mobile menu shrinks to the same 3 items + a button to open ⌘K.

### S2 — Hero (~20 → ~6 elements)

Modify [src/components/sections/hero.tsx](src/components/sections/hero.tsx). Above the fold becomes:

```
[ navbar ]

  $ cat /etc/abdul.profile  ▮              ← prompt eyebrow (kept)

  Engineering systems                       ← H1 (kept, neon "systems")
  that just keep running.

  Full Stack & AI Application Developer     ← single static role line
  ● open for new work · Karachi · UTC+5     ← single status indicator (consolidates 4 places)

  [ View work → ]   [ Get in touch ]        ← 2 CTAs (was 3)

                                            [ embedded terminal panel ]
                                            (right column on desktop, full width below on mobile)
```

**Removed from hero:**
- Crosshair coordinate marker SVG
- 3 status badges row (Available + Karachi + Edition '26)
- Animated rotating role line (`<AnimatedHeading />` import call)
- The whole bento grid (LiveClock, CurrentlyBuilding, ActivityCard, 4 StatTiles)
- Scroll cue
- Download CV CTA (third button)

**Kept:**
- Prompt eyebrow with blinking cursor
- H1 headline + neon glow
- Tagline paragraph
- Embedded terminal (the artifact)
- View work CTA + Get in touch CTA

**Added:**
- 1 static role line below the H1 (no animation)
- 1 single status line: `● open for new work · Karachi · UTC+5` (consolidates the 3 hero badges + the navbar Available badge)

The `<AnimatedHeading />` component is left in the codebase (not deleted) but no longer imported by the hero. Phase 2 may reuse it elsewhere.

### S3 — New "// SIGNAL" strip

Create [src/components/sections/signal-strip.tsx](src/components/sections/signal-strip.tsx). Mounted between Hero and About.

Single horizontal strip (3 cells on desktop, stacks on mobile). No card chrome, no shadows, no glow. Just typography + the ActivityCard heatmap.

```
// SIGNAL · live data

[ Karachi 04:14 PKT · UTC+5 ]   [ ActivityCard heatmap (existing) ]   [ 262 contribs · /yr ]
```

Composition:
- **Left tile** — minimal: just a line of mono text showing live Karachi time + UTC offset. Reuses the time-fetching logic from existing `LiveClockCard` but without the BentoCard wrapper, no border, no card chrome. ~8 lines of JSX.
- **Center tile** — reuses the existing `ActivityCard` component **with one prop change to remove its BentoCard chrome** (or wrap it in a "naked" mode). The heatmap is the visual; the card around it is the noise.
- **Right tile** — `262 contribs · /yr` from `contributions.json`. Single line of mono text.

**Killed permanently** (move out of `/` entirely, do not relocate):
- `CurrentlyBuildingCard` (rotates fake repo names — dishonest signal)
- The 4 `StatTile` instances (`2+ years`, `32+ projects shipped`, `98 LH`, `P95 < 800ms TTFB` — aspirational/unverifiable claims)

The components themselves stay in `src/components/sections/live-cards.tsx` — just unused. Delete in Phase 3 cleanup.

[src/data/personal.ts](src/data/personal.ts) gets one extension if needed: a `roles` field with the static role string (`"Full Stack & AI Application Developer"`). The existing `role` field already has this — no change needed actually.

### S4 — About tightening

Modify [src/components/sections/about.tsx](src/components/sections/about.tsx):

1. **Drop the 4-field grid** (Years / Stack / Status / Pace). Replace with: nothing. The space goes to the existing paragraph below it, which gets ~24px more top margin to fill the gap gracefully.
2. **Drop one of the 3 strength panels.** Keep "Design-led engineering" + "Owner mindset". Remove "Performance as a feature" (internal claim, hard to verify visually; the other two reference observable behavior).

The big right-side reveal headline + 2 paragraphs stay untouched.

### S5 — Spacing & animation diet

Modify [src/app/globals.css](src/app/globals.css) and per-component padding:

| Knob | Before | After |
|---|---|---|
| Section padding (`SectionWrapper`) | `py-24 sm:py-32` | `py-32 sm:py-44` |
| Hero top padding | `pt-32 sm:pt-36` | `pt-40 sm:pt-52` |
| Active pulse/ping animations on `/` | 4+ (Available badge, Currently Building "live", Activity "live", terminal cursor) | **2 max** (hero status dot + terminal cursor only) |

The `SectionWrapper` change automatically affects every section using it. Verify the spacing change doesn't break the QA panel or Projects layouts (it shouldn't — they have internal padding too).

For animations: the `Currently Building` and `Activity` "live" indicators die with the bento removal. Only the terminal cursor and the hero's single new status dot pulse.

### S6 — ⌘K terminal extension

Modify [src/components/sections/terminal.tsx](src/components/sections/terminal.tsx) (the modal command palette) to accept the dropped destinations as commands:

- `goto ask` → scrolls to `#ask` on the home page
- `goto skills` → scrolls to `#skills`
- `goto experience` → scrolls to `#experience`
- `thinking on` / `thinking off` → toggles ThinkingMode (replaces the navbar toggle)

If the existing terminal already has these commands, no change. Otherwise, extend the command list. Existing commands (`help`, `whoami`, `show projects`, `show skills`, `socials`, `email`, `download cv`, `theme`, `clear`, `exit`) stay.

---

## File touch list

**Modified:**
- `src/components/layout/navbar.tsx` — remove ThinkingMode toggle, Available badge, reduce nav links
- `src/lib/sections.ts` — reduce nav-visible sections to Work/About/Contact (other IDs stay as scroll targets)
- `src/components/sections/hero.tsx` — major prune (kill bento, crosshair, badges row, role rotator, scroll cue, 1 CTA)
- `src/components/sections/about.tsx` — drop 4-field grid + 1 strength panel
- `src/components/layout/section-wrapper.tsx` — bump default padding
- `src/components/sections/terminal.tsx` — add `thinking on/off` + extra `goto` targets (if not present)
- `src/app/page.tsx` — insert `<SignalStrip />` between `<Hero />` and `<About />`

**Created:**
- `src/components/sections/signal-strip.tsx` — new minimal strip

**Untouched (explicitly):**
- `/work/[slug]` route + components
- `/system` route + components
- OG generation
- `<ProjectCard>`, `<ProjectVisual>`, `<ArchitectureDiagram>`
- `<EmbeddedTerminal>` itself (it stays in the hero, untouched)
- The QA panel
- The Projects grid layout
- Experience timeline structure
- Contact form
- Footer
- All design tokens

**Will become unused (left in place, deleted in Phase 3):**
- `CurrentlyBuildingCard`, `StatTile`, the desktop `LiveClockCard` from `src/components/sections/live-cards.tsx` — `ActivityCard` survives, repurposed
- `<AnimatedHeading />` — kept in case Phase 2 reuses
- The crosshair SVG inline in hero (just deleted, not extracted)

---

## Verification

`npm run typecheck` + `npm run build` must both pass. Build output:

- `/` route stays under **30 kB / 150 kB First-Load JS** (currently 32.7 / 152). The deletions should reduce both.
- All 13 routes from Phase 1 still listed
- Playwright smoke screenshot of `/` to confirm:
  - Above the fold has ≤ 8 distinct UI elements
  - Navbar has 4 items (logo + 3 links + ⌘K)
  - One ping animation visible (terminal cursor; the hero status dot is just a static neon circle)
  - The SignalStrip strip is visible between hero and about, single row

---

## Risks

| Risk | Mitigation |
|---|---|
| Removing the bento removes "wow" | The embedded terminal IS the wow. Bento was redundant. |
| Hero feels empty without 4 stat tiles | The static role + status line + the terminal panel fill the right-of-headline space. The "empty" feeling is the breathing room we're trying to create. |
| Users miss the GitHub heatmap | It survives in the SignalStrip — same data, less chrome. |
| Phase 2 CodingTelemetry has nowhere to land | SignalStrip is the natural home — it can expand from 3 cells to 4-5 cells in Phase 2 without re-architecture. |

---

## Effort

~2-3 hours. Mostly deletions + spacing tweaks + 1 new component. No new data model, no new routes, no new dependencies.
