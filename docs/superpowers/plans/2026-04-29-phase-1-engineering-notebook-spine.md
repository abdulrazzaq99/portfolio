# Phase 1 — Engineering Notebook Spine Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the structural spine of the v2 portfolio: deep `/work/[slug]` case-study pages for the 3 already-fleshed-out projects, the `/system` design-system documentation page, and per-page OG image generation. After this phase, every project has a shareable URL and the site has a meta-trust artifact.

**Architecture:** Multi-route Next.js 15 App Router build. Server Components by default for static pages and OG generation; client-only dynamic imports for Sandpack to keep bundle size unchanged. Token parsing happens in Node at module-load time (during static generation), not at runtime. OG images use `next/og` (Satori) at the edge.

**Tech Stack:** Next.js 15.1.6, React 19, TypeScript 5 strict, Tailwind v4 CSS-based config, Geist Sans + Mono via `next/font`, lucide-react, Sandpack (`@codesandbox/sandpack-react`), `next/og` for Satori. No new dev dependencies (no test runner — spec verification is `npm run build` + `npm run typecheck` + Playwright screenshots).

**Source spec:** [`docs/superpowers/specs/2026-04-29-portfolio-engineering-notebook-design.md`](../specs/2026-04-29-portfolio-engineering-notebook-design.md)

**Prerequisites:** The project is not currently a git repository. To use the commit steps in this plan, first run `git init && git add -A && git commit -m "snapshot before phase 1"` from `~/Documents/portfolio/portfolio-next/`. If you skip this, just omit the commit steps — the work is still valid.

**Phasing:** This plan covers Phase 1 only (the spine). Phase 2 (live instrument hero + Skills replacement + writing scaffold) and Phase 3 (polish + remaining 5 case studies + Contact + Experience) each get their own plan once Phase 1 ships.

---

## File structure

### New files (Phase 1)

| File | Purpose |
|---|---|
| `src/data/projects.ts` (extend) | Add `context`, `metrics`, `embed`, `relatedSlugs` fields |
| `src/lib/system/oklch-to-hex.ts` | Pure utility: convert OKLCH string to hex |
| `src/lib/system/parse-tokens.ts` | Read `globals.css` at build time, emit token JSON |
| `src/components/system/token-swatch.tsx` | Single-token swatch tile |
| `src/components/system/type-scale.tsx` | Type scale samples |
| `src/components/system/component-gallery.tsx` | Live-rendered components with source paths |
| `src/components/system/effect-showcase.tsx` | Visual demos of glass/glow/gradient utilities |
| `src/components/system/decisions-log.tsx` | Five short prose entries |
| `src/app/system/page.tsx` | `/system` route composition |
| `src/components/work/work-page-shell.tsx` | `/work/[slug]` layout shell |
| `src/components/work/metrics-table.tsx` | Project metrics table |
| `src/components/work/related-work.tsx` | Sibling project cards |
| `src/components/work/embed.tsx` | Discriminated-union dispatcher |
| `src/components/work/embed-fallback.tsx` | Static code-block embed |
| `src/components/work/embed-colab.tsx` | Colab iframe embed |
| `src/components/work/embed-video.tsx` | `<video>` embed |
| `src/components/work/embed-sandbox.tsx` | Sandpack wrapper, dynamic-imported |
| `src/app/work/[slug]/page.tsx` | `/work/[slug]` route |
| `src/lib/og/load-fonts.ts` | Geist font fetcher for Satori |
| `src/app/og/default/route.tsx` | Default OG image (Edge) |
| `src/app/og/work/[slug]/route.tsx` | Per-project OG image (Edge) |
| `src/app/og/notes/[slug]/route.tsx` | Per-essay OG image (Edge) — used in Phase 2 |

### Modified files

| File | Change |
|---|---|
| `package.json` | Add `@codesandbox/sandpack-react` dependency |
| `src/app/layout.tsx` | Add default `metadata.openGraph` referencing `/og/default` |
| `src/components/sections/project-card.tsx` | Wrap card in `<Link href="/work/{slug}">`, drop inline expand for projects with deep pages |

### Untouched (reused as-is)

`src/components/sections/architecture-diagram.tsx`, `src/components/sections/embedded-terminal.tsx`, `src/components/sections/terminal.tsx`, `src/components/ui/*`, `src/data/personal.ts`.

---

## Task 1: Install Sandpack

**Files:**
- Modify: [package.json](package.json)

- [ ] **Step 1: Install `@codesandbox/sandpack-react`**

```bash
cd ~/Documents/portfolio/portfolio-next
npm install --save @codesandbox/sandpack-react@^2.19.0
```

Expected: `package.json` now lists `"@codesandbox/sandpack-react": "^2.19.0"` under `dependencies`. `package-lock.json` updates.

- [ ] **Step 2: Verify install with typecheck**

```bash
npm run typecheck
```

Expected: zero errors. (Sandpack ships its own types.)

- [ ] **Step 3: Confirm `next/og` is available**

`next/og` ships with Next.js 15 — no install needed. Verify:

```bash
node -e "console.log(require('next/og'))"
```

Expected: prints `{ ImageResponse: [Function: ImageResponse] }`. If it errors, halt and check Next version.

- [ ] **Step 4: Commit (skip if no git repo)**

```bash
git add package.json package-lock.json
git commit -m "feat(deps): add Sandpack for /work case-study embeds"
```

---

## Task 2: Extend `Project` type

**Files:**
- Modify: [src/data/projects.ts](src/data/projects.ts)

- [ ] **Step 1: Add new optional fields to the `Project` type**

In [src/data/projects.ts](src/data/projects.ts), find the `export type Project = {` block and add these fields after the existing ones (before the closing `};`):

```ts
  /** Long-form problem narrative for /work/[slug]. 200-400 words.
   *  When absent, /work/[slug] falls back to `problem`. */
  context?: string;

  /** Concrete numbers shown in the metrics table on /work/[slug]. */
  metrics?: Array<{
    label: string;
    value: string;
    note?: string;
  }>;

  /** Embedded interactive slice on /work/[slug]. Discriminated by `kind`. */
  embed?:
    | { kind: "sandpack"; files: Record<string, string>; entry?: string; template?: "react-ts" | "vanilla-ts" | "node" }
    | { kind: "colab"; url: string; title?: string }
    | { kind: "video"; src: string; poster?: string; caption?: string }
    | { kind: "fallback"; lang: string; code: string; caption?: string }
    | { kind: "none" };

  /** 2-3 sibling slugs shown at the bottom of /work/[slug].
   *  When absent, auto-pick by category (most recent same-category, top up by year). */
  relatedSlugs?: string[];
```

- [ ] **Step 2: Run typecheck — must pass with zero errors**

```bash
npm run typecheck
```

Expected: PASS. Existing project entries still satisfy the type (all new fields are optional).

- [ ] **Step 3: Commit**

```bash
git add src/data/projects.ts
git commit -m "feat(data): extend Project type with context/metrics/embed/relatedSlugs fields"
```

---

## Task 3: Author Phase 1 content for the 3 deep projects

**Files:**
- Modify: [src/data/projects.ts](src/data/projects.ts)

- [ ] **Step 1: Add `context`, `metrics`, `embed` to `capital-valley`**

In [src/data/projects.ts](src/data/projects.ts), find the `capital-valley` entry. After the existing `thinking` block (before the closing `},`), add:

```ts
    context:
      "Pakistan's IT sector has investors and it has founders, but the meeting between them is broken. " +
      "Founders pitch in WhatsApp groups and DMs, where ideas leak before they're protected. Investors " +
      "scroll the same scattered feeds, missing earlier-stage companies they'd otherwise back. The premium " +
      "tools that exist (Crunchbase, AngelList) are priced for funds, not pre-seed founders, and don't " +
      "speak to the local context.\n\n" +
      "Capital Valley sits in that gap. Founders publish their idea behind a Solidity-anchored " +
      "proof-of-existence — a Merkle root committed hourly, so every proposal carries an on-chain " +
      "timestamp without per-pitch gas costs. Investors browse a discovery feed projected from their " +
      "side of the ledger (founders see a different one). When both parties opt-in, the platform unlocks " +
      "in-app messaging with priority queues for premium tier — so investor inboxes stay high-signal " +
      "even at scale.",
    metrics: [
      { label: "Time to verified pitch", value: "< 2 min", note: "from sign-up to on-chain commit" },
      { label: "Premium message routing", value: "100ms p95", note: "tier-aware queue" },
      { label: "Discovery feed cache hit", value: "~85%", note: "edge-cached non-personalised slots" },
      { label: "Stack surfaces", value: "4", note: "Web, Node API, Python svc, Solidity" },
    ],
    embed: {
      kind: "fallback",
      lang: "javascript",
      caption: "Role-aware projection at the API layer — founders and investors get different shapes from the same query.",
      code:
`// src/lib/feed/project-projection.js
export function projectFor(role, project) {
  const base = {
    id: project._id,
    title: project.title,
    summary: project.summary,
    sector: project.sector,
    chainProof: project.merkleProof,   // visible to all
  };

  if (role === "founder") {
    return {
      ...base,
      // founders see their own contact stats
      views: project.viewCount,
      premiumMessages: project.premiumMsgCount,
    };
  }

  if (role === "investor") {
    return {
      ...base,
      // investors see contact affordances, not the founder's analytics
      contact: project.allowsContact ? { route: \`/dm/\${project.ownerId}\` } : null,
      premium: project.premiumOnlyContact,
    };
  }

  // unauthenticated: only the public summary
  return base;
}`,
    },
    relatedSlugs: ["finalcircle", "lead-genie"],
```

- [ ] **Step 2: Add `context`, `metrics`, `embed` to `finalcircle`**

In the `finalcircle` entry, add after the `thinking` block:

```ts
    context:
      "Esports team formation runs on tribal knowledge: who's good, who's available, who plays which role, " +
      "who's free this weekend. The discovery happens in Discord servers and IG DMs, where the signal-to-noise " +
      "is brutal and recruitment loops drag for days. There's no purpose-built place to find a teammate by " +
      "skill bracket, region, role, and current availability — the same way you'd filter for a job.\n\n" +
      "FinalCircle is that place. Players publish a profile (verified rank, role, region, schedule), " +
      "browse compatible teammates with composable filters, and start chatting in-app — no Discord, no DMs. " +
      "The hard parts are the boring parts: WebSocket auth that survives mobile reconnects, lobby state " +
      "that doesn't hammer Postgres under churn, notification fan-out that doesn't degrade when a popular " +
      "player goes online. Django REST + Channels + Celery + Redis carry that weight. Next.js + TypeScript " +
      "carry the surface.",
    metrics: [
      { label: "Time to first match", value: "< 90s", note: "median, after profile setup" },
      { label: "Lobby DB writes saved", value: "~90%", note: "Redis projection, 5s TTL" },
      { label: "WebSocket reconnect window", value: "< 800ms", note: "JWT-revalidated handshake" },
      { label: "Cold start to docker-compose up", value: "1 cmd", note: "fresh contributor" },
    ],
    embed: {
      kind: "fallback",
      lang: "python",
      caption: "Token-in-query handshake for Django Channels — JWT validated in connect(), connection rejected on tamper.",
      code:
`# chat/consumers.py
import jwt
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from django.conf import settings
from .models import LobbyMember

class LobbyConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        # Browser WebSocket API can't set headers — token rides as ?token=...
        token = self.scope["query_string"].decode().removeprefix("token=")
        try:
            payload = jwt.decode(
                token, settings.SECRET_KEY, algorithms=["HS256"]
            )
        except jwt.InvalidTokenError:
            await self.close(code=4001)
            return

        self.user_id = payload["sub"]
        self.lobby_id = self.scope["url_route"]["kwargs"]["lobby_id"]

        # Verify the user actually belongs to this lobby (DB check, not just JWT trust)
        is_member = await LobbyMember.objects.filter(
            user_id=self.user_id, lobby_id=self.lobby_id
        ).aexists()
        if not is_member:
            await self.close(code=4003)
            return

        # Only now do we accept the connection and join the channel group
        await self.channel_layer.group_add(f"lobby_{self.lobby_id}", self.channel_name)
        await self.accept()`,
    },
    relatedSlugs: ["capital-valley", "lead-genie"],
```

- [ ] **Step 3: Add `context`, `metrics`, `embed` to `rag-healthcare`**

In the `rag-healthcare` entry, add after the `thinking` block:

```ts
    context:
      "General-purpose chatbots will happily invent dosages, contraindications, and interactions. In a " +
      "consumer chat that's funny; in a clinic context it's negligence. Closed clinical tools (UpToDate, " +
      "DynaMed) solve the grounding problem but cost thousands per seat per year — out of reach for " +
      "students, small clinics, and most of the world.\n\n" +
      "This RAG assistant sits between the two: medical reference material is chunked and embedded " +
      "offline; at query time the system retrieves the most relevant passages, assembles them into a " +
      "system prompt, streams Gemini's reply, and renders the source passage alongside every answer. " +
      "There's no answer without a citation. The chunking strategy (512 tokens with 64 overlap) was " +
      "tuned empirically against a held-out question set — too small loses coherence, too large drowns " +
      "the retriever. Re-ranking before prompt assembly improved long-document recall by ~18%.",
    metrics: [
      { label: "Citation coverage", value: "100%", note: "no answer ships without a retrieved passage" },
      { label: "First token latency", value: "< 600ms", note: "streaming, even on cold starts" },
      { label: "Chunk size", value: "512 / 64", note: "tokens / overlap, tuned empirically" },
      { label: "Re-rank lift on long docs", value: "+18%", note: "vs. raw similarity ordering" },
    ],
    embed: {
      kind: "fallback",
      lang: "python",
      caption: "Prompt assembly with hard-grounding — the LLM is instructed to refuse if context is empty.",
      code:
`# rag/assemble.py
SYSTEM = """You are a medical reference assistant.
You answer ONLY using the provided CONTEXT below.
If the CONTEXT does not contain the answer, reply exactly:
  'I don't have a grounded source for this question.'
Cite the passage number you used in square brackets, like [2]."""

def build_messages(query: str, retrieved: list[Passage]) -> list[dict]:
    if not retrieved:
        # No context retrieved — surface that fact rather than letting the LLM hallucinate
        return [
            {"role": "system", "content": SYSTEM},
            {"role": "user", "content": query},
            {"role": "system", "content": "CONTEXT: (none retrieved)"},
        ]

    context_block = "\\n\\n".join(
        f"[{i+1}] (source: {p.source}) {p.text}"
        for i, p in enumerate(retrieved)
    )
    return [
        {"role": "system", "content": SYSTEM},
        {"role": "system", "content": f"CONTEXT:\\n{context_block}"},
        {"role": "user", "content": query},
    ]`,
    },
    relatedSlugs: ["hate-speech", "pseudo-cpp"],
```

- [ ] **Step 4: Run typecheck — must pass**

```bash
npm run typecheck
```

Expected: zero errors.

- [ ] **Step 5: Commit**

```bash
git add src/data/projects.ts
git commit -m "feat(data): author context/metrics/embed for the 3 deep projects"
```

---

## Task 4: OKLCH→hex utility + token parser

**Files:**
- Create: `src/lib/system/oklch-to-hex.ts`
- Create: `src/lib/system/parse-tokens.ts`

- [ ] **Step 1: Create the OKLCH→hex utility**

Create [src/lib/system/oklch-to-hex.ts](src/lib/system/oklch-to-hex.ts):

```ts
/**
 * Convert an OKLCH color string into a #RRGGBB hex.
 * Supports the formats:
 *   "oklch(0.62 0.165 156)"
 *   "oklch(0.62 0.165 156 / 0.5)"
 * Alpha is dropped (the swatch shows the alpha separately).
 *
 * Math reference: https://bottosson.github.io/posts/oklab/
 *
 * Returns null for unparseable input — callers render a placeholder.
 */
export function oklchToHex(input: string): string | null {
  const m = input.match(/oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*[\d.]+)?\s*\)/);
  if (!m) return null;

  const L = Number(m[1]);
  const C = Number(m[2]);
  const hDeg = Number(m[3]);
  const h = (hDeg * Math.PI) / 180;

  // OKLCH -> OKLab
  const a = C * Math.cos(h);
  const b = C * Math.sin(h);

  // OKLab -> linear sRGB (Bjorn Ottosson's matrix)
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b;

  const l3 = l_ ** 3;
  const m3 = m_ ** 3;
  const s3 = s_ ** 3;

  let r =  4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3;
  let g = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3;
  let bl = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.7076147010 * s3;

  // Linear -> sRGB gamma
  const toSrgb = (x: number) => {
    const c = x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055;
    return Math.max(0, Math.min(1, c));
  };

  const R = Math.round(toSrgb(r) * 255);
  const G = Math.round(toSrgb(g) * 255);
  const B = Math.round(toSrgb(bl) * 255);

  const hex = (n: number) => n.toString(16).padStart(2, "0");
  return `#${hex(R)}${hex(G)}${hex(B)}`;
}
```

- [ ] **Step 2: Create the token parser**

Create [src/lib/system/parse-tokens.ts](src/lib/system/parse-tokens.ts):

```ts
import "server-only";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { oklchToHex } from "./oklch-to-hex";

export type Token = {
  /** CSS variable name including the leading `--`, e.g. `--color-primary` */
  name: string;
  /** Raw value as written, e.g. `oklch(0.62 0.165 156)` */
  raw: string;
  /** Computed hex if the value is OKLCH and parseable, otherwise null */
  hex: string | null;
  /** Group label inferred from the comment block above the token */
  group: string;
};

/**
 * Parse the @theme block out of src/app/globals.css and return the tokens
 * grouped by section comment. Runs at module load — when imported from a
 * Server Component, this happens during static generation.
 */
export function parseTokens(): Token[] {
  const cssPath = join(process.cwd(), "src", "app", "globals.css");
  const css = readFileSync(cssPath, "utf-8");

  // Slice out the @theme { ... } block (the first one).
  const themeMatch = css.match(/@theme\s*\{([\s\S]*?)\n\}/);
  if (!themeMatch) return [];

  const block = themeMatch[1];
  const lines = block.split("\n");

  const tokens: Token[] = [];
  let currentGroup = "Tokens";

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    // Group header from a comment block like `/* ── Surfaces ─── */`
    const groupMatch = line.match(/\/\*[\s─\-]*([A-Za-z][^*]*?)[\s─\-]*\*\//);
    if (groupMatch) {
      currentGroup = groupMatch[1].trim();
      continue;
    }

    // Skip other comments
    if (line.startsWith("/*") || line.startsWith("//")) continue;

    // Token line: `--name: value;` (value may itself contain colons, e.g. var())
    const tokenMatch = line.match(/^(--[a-z0-9-]+)\s*:\s*([^;]+);?\s*(?:\/\*.*\*\/)?$/i);
    if (!tokenMatch) continue;

    const name = tokenMatch[1];
    const raw = tokenMatch[2].trim();

    // Only color tokens are interesting for the swatch grid; skip type/motion vars.
    if (!name.startsWith("--color-")) continue;

    tokens.push({
      name,
      raw,
      hex: oklchToHex(raw),
      group: currentGroup,
    });
  }

  return tokens;
}
```

- [ ] **Step 3: Run typecheck**

```bash
npm run typecheck
```

Expected: zero errors.

- [ ] **Step 4: Sanity-check the parser by building**

```bash
npm run build
```

Expected: build still passes (parser isn't used yet, but it must at least typecheck under build).

- [ ] **Step 5: Commit**

```bash
git add src/lib/system
git commit -m "feat(system): OKLCH-to-hex utility + globals.css token parser"
```

---

## Task 5: `/system` page — `TokenSwatch` + page shell + Tokens section

**Files:**
- Create: `src/components/system/token-swatch.tsx`
- Create: `src/app/system/page.tsx`

- [ ] **Step 1: Create `<TokenSwatch>`**

Create [src/components/system/token-swatch.tsx](src/components/system/token-swatch.tsx):

```tsx
"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Token } from "@/lib/system/parse-tokens";

export function TokenSwatch({ token }: { token: Token }) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    await navigator.clipboard.writeText(`var(${token.name})`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <button
      type="button"
      onClick={onCopy}
      className={cn(
        "group relative flex flex-col gap-2 overflow-hidden rounded-xl",
        "border border-[var(--color-line)] bg-[var(--color-bg-2)]/60 p-3 text-left",
        "transition-colors hover:border-[var(--color-primary-glow)]/40",
      )}
      aria-label={`Copy CSS variable ${token.name}`}
    >
      <div
        className="h-14 w-full rounded-md border border-[var(--color-line)]"
        style={{ background: token.raw }}
        aria-hidden
      />
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="font-[family-name:var(--font-mono)] text-[11px] text-[var(--color-ink-soft)] truncate">
            {token.name}
          </div>
          <div className="font-[family-name:var(--font-mono)] text-[10px] text-[var(--color-muted)] truncate">
            {token.hex ?? token.raw}
          </div>
        </div>
        <span className="shrink-0 text-[var(--color-muted)] transition-colors group-hover:text-[var(--color-primary-glow)]">
          {copied ? <Check size={12} /> : <Copy size={12} />}
        </span>
      </div>
    </button>
  );
}
```

- [ ] **Step 2: Create the `/system` page with the page shell + Tokens section**

Create [src/app/system/page.tsx](src/app/system/page.tsx):

```tsx
import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { parseTokens } from "@/lib/system/parse-tokens";
import { TokenSwatch } from "@/components/system/token-swatch";

export const metadata: Metadata = {
  title: "Design system — Abdul Razzaq",
  description:
    "The design tokens, components, effects, and decisions used to build this very portfolio. A meta-trust artifact.",
  openGraph: {
    title: "Design system — Abdul Razzaq",
    description: "The tokens, components, and decisions behind this portfolio.",
    images: ["/og/default"],
  },
};

export default function SystemPage() {
  const tokens = parseTokens();
  const grouped = groupBy(tokens, (t) => t.group);

  return (
    <main className="relative pt-32 pb-24 sm:pt-40">
      {/* ambient orb */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-96 w-[60%] -translate-x-1/2 rounded-full bg-[oklch(0.86_0.27_152_/_0.10)] blur-[140px]"
      />

      <Container>
        {/* Eyebrow */}
        <div className="mb-8 flex items-center gap-3 font-[family-name:var(--font-mono)] text-[11px] tracking-[0.16em] text-[var(--color-muted)]">
          <span
            className="text-[var(--color-primary-glow)]"
            style={{ textShadow: "0 0 10px oklch(0.86 0.27 152 / 0.45)" }}
          >
            //
          </span>
          <span className="text-[var(--color-primary-neon)]">06</span>
          <span className="text-[var(--color-muted-2)]">·</span>
          <span className="uppercase">Design System</span>
          <span className="ml-2 inline-block h-px flex-1 max-w-[120px] bg-gradient-to-r from-[var(--color-line-strong)] to-transparent" />
        </div>

        {/* Title */}
        <h1 className="text-balance text-[clamp(40px,6vw,86px)] font-medium leading-[0.98] tracking-[-0.04em]">
          The system, in the open
          <span
            className="text-[var(--color-primary-glow)]"
            style={{ textShadow: "0 0 16px oklch(0.86 0.27 152 / 0.5)" }}
          >.</span>
        </h1>
        <p className="mt-6 max-w-[60ch] text-[15px] leading-relaxed text-[var(--color-ink-soft)] sm:text-[17px]">
          Every token, component, and decision behind this portfolio. Click any swatch
          to copy its CSS variable. Every component is rendered live from the same
          source the rest of the site uses.
        </p>

        {/* Skip link target */}
        <nav aria-label="Section index" className="mt-10 flex flex-wrap gap-2 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.16em]">
          {["Tokens", "Type", "Components", "Effects", "Decisions"].map((s) => (
            <a
              key={s}
              href={`#${s.toLowerCase()}`}
              className="rounded-full border border-[var(--color-line-strong)] bg-[var(--color-elevated)] px-3 py-1 text-[var(--color-ink-soft)] transition-colors hover:border-[var(--color-primary-glow)] hover:text-[var(--color-primary-glow)]"
            >
              ↓ {s}
            </a>
          ))}
        </nav>

        {/* Tokens section */}
        <section id="tokens" className="mt-20 scroll-mt-24">
          <h2 className="text-[clamp(24px,3vw,36px)] font-medium tracking-tight">
            Tokens
          </h2>
          <p className="mt-2 max-w-[60ch] text-sm text-[var(--color-muted)]">
            Defined in <code className="font-[family-name:var(--font-mono)] text-[var(--color-primary-glow)]">src/app/globals.css</code> as Tailwind v4 <code className="font-[family-name:var(--font-mono)] text-[var(--color-primary-glow)]">@theme</code> variables. OKLCH for perceptual uniformity; hex shown for reference.
          </p>

          <div className="mt-8 space-y-10">
            {Object.entries(grouped).map(([group, items]) => (
              <div key={group}>
                <h3 className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.18em] text-[var(--color-primary-glow)]">
                  {group}
                </h3>
                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {items.map((t) => (
                    <TokenSwatch key={t.name} token={t} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Subsequent sections (Type, Components, Effects, Decisions) added in tasks 6-9 */}
      </Container>
    </main>
  );
}

function groupBy<T>(arr: T[], key: (x: T) => string): Record<string, T[]> {
  return arr.reduce<Record<string, T[]>>((acc, item) => {
    const k = key(item);
    if (!acc[k]) acc[k] = [];
    acc[k].push(item);
    return acc;
  }, {});
}
```

- [ ] **Step 3: Run typecheck and build**

```bash
npm run typecheck && npm run build
```

Expected: both pass. The build output now lists `/system` as a static route.

- [ ] **Step 4: Visual verify with dev server**

```bash
npm run dev
# in browser: http://localhost:3000/system
```

Expected: the page loads, eyebrow + title render, Tokens section shows swatches grouped by section (Surfaces, Ink & text, Lines, Brand: Emerald, etc.). Click a swatch → clipboard contains `var(--color-X)` and the icon flips to a checkmark for ~1s.

- [ ] **Step 5: Commit**

```bash
git add src/app/system src/components/system/token-swatch.tsx
git commit -m "feat(system): /system page shell + Tokens section with click-to-copy swatches"
```

---

## Task 6: `/system` — Type Scale section

**Files:**
- Create: `src/components/system/type-scale.tsx`
- Modify: `src/app/system/page.tsx`

- [ ] **Step 1: Create `<TypeScale>`**

Create [src/components/system/type-scale.tsx](src/components/system/type-scale.tsx):

```tsx
"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

type Sample = {
  /** Display label, e.g. "Display 96" */
  label: string;
  /** Tailwind v4 class string used in the codebase */
  className: string;
  /** Sample text to render */
  text: string;
  /** "sans" or "mono" — drives font-family inline */
  family: "sans" | "mono";
};

const SAMPLES: Sample[] = [
  { label: "Display 96",  className: "text-[96px] font-medium leading-[0.94] tracking-[-0.04em]", text: "Engineering systems",                 family: "sans" },
  { label: "Display 64",  className: "text-[64px] font-medium leading-[0.98] tracking-[-0.04em]", text: "Recent obsessions.",                   family: "sans" },
  { label: "H1 48",       className: "text-[48px] font-medium leading-[1.05] tracking-[-0.03em]", text: "I treat the browser like a stage.",    family: "sans" },
  { label: "H2 32",       className: "text-[32px] font-medium tracking-tight",                    text: "FinalCircle.",                         family: "sans" },
  { label: "H3 22",       className: "text-[22px] font-semibold tracking-tight",                  text: "Engineering highlights",               family: "sans" },
  { label: "Body 17",     className: "text-[17px] leading-relaxed",                               text: "I build full-stack applications with a backend instinct — Django and Node on the server.", family: "sans" },
  { label: "Body 15",     className: "text-[15px] leading-relaxed",                               text: "A small set of projects from the last 24 months — full-stack apps, dashboards.",          family: "sans" },
  { label: "Small 13",    className: "text-[13px]",                                               text: "Engineering · Thinking",               family: "sans" },
  { label: "Mono 12",     className: "text-[12px] tracking-[0.16em] uppercase",                   text: "$ cat /etc/abdul.profile",             family: "mono" },
  { label: "Mono 10.5",   className: "text-[10.5px] uppercase tracking-[0.18em]",                 text: "// 01 · ABOUT",                        family: "mono" },
];

export function TypeScale() {
  const [copied, setCopied] = useState<string | null>(null);

  const onCopy = async (cls: string) => {
    await navigator.clipboard.writeText(cls);
    setCopied(cls);
    setTimeout(() => setCopied((c) => (c === cls ? null : c)), 1200);
  };

  return (
    <ul className="flex flex-col divide-y divide-[var(--color-line)]">
      {SAMPLES.map((s) => (
        <li key={s.label} className="flex flex-col gap-2 py-6 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
          <div className="min-w-0 flex-1">
            <span
              className={cn(
                s.className,
                s.family === "mono" ? "font-[family-name:var(--font-mono)]" : "",
                "block truncate text-[var(--color-ink)]",
              )}
            >
              {s.text}
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <span className="font-[family-name:var(--font-mono)] text-[10.5px] uppercase tracking-[0.16em] text-[var(--color-muted)]">
              {s.label}
            </span>
            <button
              type="button"
              onClick={() => onCopy(s.className)}
              className="inline-flex items-center gap-1.5 rounded-md border border-[var(--color-line-strong)] bg-[var(--color-bg-3)] px-2 py-1 font-[family-name:var(--font-mono)] text-[10px] text-[var(--color-ink-soft)] transition-colors hover:border-[var(--color-primary-glow)] hover:text-[var(--color-primary-glow)]"
              aria-label={`Copy class string for ${s.label}`}
            >
              {copied === s.className ? <Check size={10} /> : <Copy size={10} />}
              copy class
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
```

- [ ] **Step 2: Mount `<TypeScale>` on the system page**

In [src/app/system/page.tsx](src/app/system/page.tsx), add the import at the top:

```ts
import { TypeScale } from "@/components/system/type-scale";
```

Then add this section after the Tokens section (before the "Subsequent sections" comment):

```tsx
        {/* Type Scale section */}
        <section id="type" className="mt-20 scroll-mt-24">
          <h2 className="text-[clamp(24px,3vw,36px)] font-medium tracking-tight">
            Type
          </h2>
          <p className="mt-2 max-w-[60ch] text-sm text-[var(--color-muted)]">
            Geist Sans for body and display, Geist Mono for engineering accents.
            Loaded via <code className="font-[family-name:var(--font-mono)] text-[var(--color-primary-glow)]">next/font</code> with zero CLS.
          </p>
          <div className="mt-6">
            <TypeScale />
          </div>
        </section>
```

- [ ] **Step 3: Verify in browser**

```bash
npm run dev
# http://localhost:3000/system → scroll to Type section
```

Expected: each sample renders at the right size; "copy class" button copies the Tailwind class string.

- [ ] **Step 4: Commit**

```bash
git add src/components/system/type-scale.tsx src/app/system/page.tsx
git commit -m "feat(system): Type Scale section with copy-class buttons"
```

---

## Task 7: `/system` — Component Gallery section

**Files:**
- Create: `src/components/system/component-gallery.tsx`
- Modify: `src/app/system/page.tsx`

- [ ] **Step 1: Create `<ComponentGallery>`**

Create [src/components/system/component-gallery.tsx](src/components/system/component-gallery.tsx):

```tsx
import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";
import { Badge, TechBadge } from "@/components/ui/badge";

type Item = {
  /** Section label */
  label: string;
  /** Source path + line range */
  source: string;
  /** Live-rendered component */
  render: ReactNode;
};

const ITEMS: Item[] = [
  {
    label: "Button — primary / ghost / outline · sm / md / lg",
    source: "src/components/ui/button.tsx",
    render: (
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="primary" size="sm">Primary sm</Button>
        <Button variant="primary" size="md">Primary md <ArrowRight size={13} /></Button>
        <Button variant="primary" size="lg">Primary lg</Button>
        <Button variant="ghost" size="md">Ghost</Button>
        <Button variant="outline" size="md">Outline</Button>
        <ButtonLink href="#" variant="primary" size="md">As a link</ButtonLink>
      </div>
    ),
  },
  {
    label: "Badge — default / primary / muted / live",
    source: "src/components/ui/badge.tsx",
    render: (
      <div className="flex flex-wrap items-center gap-3">
        <Badge tone="default">default</Badge>
        <Badge tone="primary">primary</Badge>
        <Badge tone="muted">muted</Badge>
        <Badge tone="live">live · ping</Badge>
      </div>
    ),
  },
  {
    label: "TechBadge — small chip used in stack rows",
    source: "src/components/ui/badge.tsx",
    render: (
      <div className="flex flex-wrap items-center gap-1.5">
        {["TypeScript", "Next.js", "Django", "PostgreSQL", "Redis", "Solidity"].map((s) => (
          <TechBadge key={s}>{s}</TechBadge>
        ))}
      </div>
    ),
  },
  {
    label: "Eyebrow — section header in code-comment style",
    source: "src/components/layout/section-wrapper.tsx",
    render: (
      <div className="flex items-center gap-3 font-[family-name:var(--font-mono)] text-[11px] tracking-[0.16em] text-[var(--color-muted)]">
        <span className="text-[var(--color-primary-glow)]">//</span>
        <span className="text-[var(--color-primary-neon)]">03</span>
        <span className="text-[var(--color-muted-2)]">·</span>
        <span className="uppercase">Selected Work</span>
        <span className="ml-2 inline-block h-px flex-1 max-w-[120px] bg-gradient-to-r from-[var(--color-line-strong)] to-transparent" />
      </div>
    ),
  },
];

export function ComponentGallery() {
  return (
    <ul className="flex flex-col gap-6">
      {ITEMS.map((item) => (
        <li
          key={item.label}
          className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-bg-2)]/60 p-5"
        >
          <div className="mb-4 flex items-baseline justify-between gap-3">
            <span className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.16em] text-[var(--color-muted)]">
              {item.label}
            </span>
            <code className="font-[family-name:var(--font-mono)] text-[10px] text-[var(--color-muted-2)]">
              {item.source}
            </code>
          </div>
          <div className="rounded-xl border border-[var(--color-line)] bg-[var(--color-bg)]/40 p-5">
            {item.render}
          </div>
        </li>
      ))}
    </ul>
  );
}
```

- [ ] **Step 2: Mount on the system page**

In [src/app/system/page.tsx](src/app/system/page.tsx), add the import:

```ts
import { ComponentGallery } from "@/components/system/component-gallery";
```

And add this section after Type:

```tsx
        {/* Components section */}
        <section id="components" className="mt-20 scroll-mt-24">
          <h2 className="text-[clamp(24px,3vw,36px)] font-medium tracking-tight">
            Components
          </h2>
          <p className="mt-2 max-w-[60ch] text-sm text-[var(--color-muted)]">
            Each tile renders the actual React component, not a screenshot. Source path
            shown below the render — these are the same primitives used everywhere else
            on the site.
          </p>
          <div className="mt-6">
            <ComponentGallery />
          </div>
        </section>
```

- [ ] **Step 3: Verify**

```bash
npm run dev
# /system → Components section
```

Expected: tiles render with actual buttons, badges, eyebrow that you can hover/interact with. Source paths visible.

- [ ] **Step 4: Commit**

```bash
git add src/components/system/component-gallery.tsx src/app/system/page.tsx
git commit -m "feat(system): Component Gallery with live-rendered primitives"
```

---

## Task 8: `/system` — Effects + Decisions Log sections + page wrap-up

**Files:**
- Create: `src/components/system/effect-showcase.tsx`
- Create: `src/components/system/decisions-log.tsx`
- Modify: `src/app/system/page.tsx`

- [ ] **Step 1: Create `<EffectShowcase>`**

Create [src/components/system/effect-showcase.tsx](src/components/system/effect-showcase.tsx):

```tsx
type Effect = {
  name: string;
  className: string;
  description: string;
};

const EFFECTS: Effect[] = [
  { name: "glass",           className: "glass",           description: "Subtle white wash on dark, 18px blur, soft inset highlight." },
  { name: "glass-elevated",  className: "glass-elevated",  description: "Stronger wash, 24px blur — used for cards lifted above ambient." },
  { name: "gradient-border", className: "gradient-border", description: "Animated 1px conic-style border. Brightens on hover." },
  { name: "shimmer",         className: "shimmer",         description: "Diagonal sweep on hover. Hover the tile to see it." },
  { name: "neon-glow",       className: "neon-glow",       description: "Outer + spread shadow in neon emerald. The hero CTA's hover state." },
];

export function EffectShowcase() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {EFFECTS.map((e) => (
        <div key={e.name} className="space-y-3">
          <div
            className={`${e.className} relative h-32 rounded-2xl p-4 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.18em] text-[var(--color-ink-soft)]`}
          >
            .{e.name}
          </div>
          <p className="text-[12.5px] leading-relaxed text-[var(--color-muted)]">
            {e.description}
          </p>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Create `<DecisionsLog>`**

Create [src/components/system/decisions-log.tsx](src/components/system/decisions-log.tsx):

```tsx
type Decision = {
  q: string;
  a: string;
};

const DECISIONS: Decision[] = [
  {
    q: "Why dark?",
    a: "An engineer's environment is dark — terminal, IDE, monitoring tools. The portfolio sits in the same visual register as the work it documents. Cream backgrounds force a context switch the audience doesn't need to make.",
  },
  {
    q: "Why two emeralds — a deep base and a neon glow?",
    a: "The deep #006241 (oklch 0.46 0.108 158) is the brand anchor — kept from the prior version for continuity. The neon (oklch 0.86 0.27 152) is the dark-mode counterpart that does the work the deep version can't on a near-black surface: visible accents, glowing highlights, attention. Two tokens, one brand.",
  },
  {
    q: "Why no Motion library?",
    a: "Bundle size. Motion's React adapter is ~25 kB gzipped. Every animation on this site is CSS or single-line @keyframes — about 200 bytes total. The site loads faster, and CSS animations interrupt cleanly when the user scrolls or interacts.",
  },
  {
    q: "Why CSS-only animations everywhere?",
    a: "GPU-accelerated transform / opacity is interruptible, respects prefers-reduced-motion globally with one media query, and degrades to nothing instead of leaving things mid-tween when JS is slow. Anything more elaborate would be the wrong tool for a portfolio.",
  },
  {
    q: "Why Server Components by default?",
    a: "First-Load JS is the single number recruiters and clients silently judge in DevTools. Every section that doesn't need client interactivity (Hero static parts, About, Experience, Contact form scaffold) renders on the server and ships zero JS. The interactive bits — Terminal, ThinkingMode, ProjectCard — are explicitly opted-in with 'use client'.",
  },
];

export function DecisionsLog() {
  return (
    <ol className="flex flex-col divide-y divide-[var(--color-line)]">
      {DECISIONS.map((d, i) => (
        <li key={d.q} className="grid gap-3 py-6 sm:grid-cols-[40px_1fr_2fr] sm:gap-8">
          <span className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.18em] text-[var(--color-primary-glow)]">
            0{i + 1}
          </span>
          <h3 className="text-[15px] font-semibold tracking-tight text-[var(--color-ink)]">
            {d.q}
          </h3>
          <p className="text-[14px] leading-relaxed text-[var(--color-ink-soft)]">{d.a}</p>
        </li>
      ))}
    </ol>
  );
}
```

- [ ] **Step 3: Mount both sections on the system page**

In [src/app/system/page.tsx](src/app/system/page.tsx), add imports:

```ts
import { EffectShowcase } from "@/components/system/effect-showcase";
import { DecisionsLog } from "@/components/system/decisions-log";
```

Add these two sections after the Components section:

```tsx
        {/* Effects section */}
        <section id="effects" className="mt-20 scroll-mt-24">
          <h2 className="text-[clamp(24px,3vw,36px)] font-medium tracking-tight">
            Effects
          </h2>
          <p className="mt-2 max-w-[60ch] text-sm text-[var(--color-muted)]">
            Utility classes defined in <code className="font-[family-name:var(--font-mono)] text-[var(--color-primary-glow)]">@utility</code> blocks. Apply them anywhere; they read tokens, so they restyle automatically when tokens change.
          </p>
          <div className="mt-6">
            <EffectShowcase />
          </div>
        </section>

        {/* Decisions section */}
        <section id="decisions" className="mt-20 scroll-mt-24">
          <h2 className="text-[clamp(24px,3vw,36px)] font-medium tracking-tight">
            Decisions
          </h2>
          <p className="mt-2 max-w-[60ch] text-sm text-[var(--color-muted)]">
            The why behind the choices. Recruiters and clients infer engineering judgement from the trade-offs you can articulate.
          </p>
          <div className="mt-6">
            <DecisionsLog />
          </div>
        </section>
```

Also delete the trailing `{/* Subsequent sections... */}` comment.

- [ ] **Step 4: Verify and screenshot**

```bash
npm run dev
# http://localhost:3000/system → scroll the whole page
```

Expected: all 5 sections render in order; Effects tiles visibly demonstrate each utility; Decisions list reads cleanly.

- [ ] **Step 5: Commit**

```bash
git add src/components/system src/app/system/page.tsx
git commit -m "feat(system): Effects + Decisions Log sections — page complete"
```

---

## Task 9: `WorkPageShell` + breadcrumb + meta strip

**Files:**
- Create: `src/components/work/work-page-shell.tsx`

- [ ] **Step 1: Create the shell**

Create [src/components/work/work-page-shell.tsx](src/components/work/work-page-shell.tsx):

```tsx
import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight, Github } from "lucide-react";
import { Container } from "@/components/layout/container";
import type { Project } from "@/data/projects";

export function WorkPageShell({
  project,
  children,
}: {
  project: Project;
  children: ReactNode;
}) {
  const visibilityLabel =
    project.visibility === "private" ? "● private" :
    project.visibility === "collaborator" ? "● collaborator" :
    "● public";

  return (
    <article className="relative pt-32 pb-24 sm:pt-40">
      {/* Ambient orb — same neon language as hero */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-96 w-[80%] -translate-x-1/2 rounded-full bg-[oklch(0.86_0.27_152_/_0.10)] blur-[140px]"
      />

      <Container>
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-2 font-[family-name:var(--font-mono)] text-[11px] tracking-[0.16em] text-[var(--color-muted)]">
            <li>
              <span className="text-[var(--color-primary-glow)]">//</span>
            </li>
            <li>
              <Link href="/#work" className="uppercase transition-colors hover:text-[var(--color-primary-glow)]">
                /work
              </Link>
            </li>
            <li className="text-[var(--color-muted-2)]">·</li>
            <li className="uppercase text-[var(--color-ink-soft)]">{project.slug}</li>
          </ol>
        </nav>

        {/* H1 */}
        <h1 className="text-balance text-[clamp(40px,7vw,108px)] font-medium leading-[0.94] tracking-[-0.04em]">
          {project.name}
          <span
            className="text-[var(--color-primary-glow)]"
            style={{ textShadow: "0 0 16px oklch(0.86 0.27 152 / 0.5)" }}
          >.</span>
        </h1>

        {/* Meta strip */}
        <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 font-[family-name:var(--font-mono)] text-[12px] text-[var(--color-muted)]">
          <span className="text-[var(--color-primary-glow)]">{project.category}</span>
          <span aria-hidden>·</span>
          <span>{project.year}</span>
          <span aria-hidden>·</span>
          <span>{visibilityLabel}</span>
          {project.github && (
            <>
              <span aria-hidden>·</span>
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 transition-colors hover:text-[var(--color-primary-glow)]"
              >
                <Github size={12} /> source
                <ArrowUpRight size={11} />
              </a>
            </>
          )}
          {project.demo && (
            <>
              <span aria-hidden>·</span>
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 transition-colors hover:text-[var(--color-primary-glow)]"
              >
                live <ArrowUpRight size={11} />
              </a>
            </>
          )}
        </div>

        {/* Body */}
        <div className="mt-16 space-y-20">
          {children}
        </div>
      </Container>
    </article>
  );
}

/** Section eyebrow used inside <WorkPageShell> children. */
export function WorkSectionEyebrow({ num, label }: { num: string; label: string }) {
  return (
    <div className="mb-6 flex items-center gap-3 font-[family-name:var(--font-mono)] text-[11px] tracking-[0.16em] text-[var(--color-muted)]">
      <span
        className="text-[var(--color-primary-glow)]"
        style={{ textShadow: "0 0 10px oklch(0.86 0.27 152 / 0.45)" }}
      >
        //
      </span>
      <span className="text-[var(--color-primary-neon)]">{num}</span>
      <span className="text-[var(--color-muted-2)]">·</span>
      <span className="uppercase">{label}</span>
      <span className="ml-2 inline-block h-px flex-1 max-w-[120px] bg-gradient-to-r from-[var(--color-line-strong)] to-transparent" />
    </div>
  );
}
```

- [ ] **Step 2: Typecheck**

```bash
npm run typecheck
```

Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/components/work/work-page-shell.tsx
git commit -m "feat(work): WorkPageShell + breadcrumb + meta strip + section eyebrow"
```

---

## Task 10: `MetricsTable` + `RelatedWork`

**Files:**
- Create: `src/components/work/metrics-table.tsx`
- Create: `src/components/work/related-work.tsx`

- [ ] **Step 1: Create `<MetricsTable>`**

Create [src/components/work/metrics-table.tsx](src/components/work/metrics-table.tsx):

```tsx
import type { Project } from "@/data/projects";

export function MetricsTable({ metrics }: { metrics: NonNullable<Project["metrics"]> }) {
  if (!metrics?.length) return null;

  return (
    <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-bg-2)]/60 overflow-hidden">
      <table className="w-full text-left">
        <thead className="border-b border-[var(--color-line)]">
          <tr>
            <th scope="col" className="px-5 py-3 font-[family-name:var(--font-mono)] text-[10.5px] uppercase tracking-[0.18em] text-[var(--color-muted)]">
              Metric
            </th>
            <th scope="col" className="px-5 py-3 font-[family-name:var(--font-mono)] text-[10.5px] uppercase tracking-[0.18em] text-[var(--color-muted)]">
              Value
            </th>
            <th scope="col" className="hidden px-5 py-3 font-[family-name:var(--font-mono)] text-[10.5px] uppercase tracking-[0.18em] text-[var(--color-muted)] sm:table-cell">
              Note
            </th>
          </tr>
        </thead>
        <tbody>
          {metrics.map((m, i) => (
            <tr key={m.label} className={i > 0 ? "border-t border-[var(--color-line)]" : ""}>
              <th scope="row" className="px-5 py-4 align-top text-[14px] font-medium text-[var(--color-ink)]">
                {m.label}
              </th>
              <td className="px-5 py-4 align-top font-[family-name:var(--font-mono)] text-[15px] tabular-nums text-[var(--color-primary-glow)]">
                {m.value}
              </td>
              <td className="hidden px-5 py-4 align-top text-[13px] leading-relaxed text-[var(--color-muted)] sm:table-cell">
                {m.note ?? ""}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

- [ ] **Step 2: Create `<RelatedWork>`**

Create [src/components/work/related-work.tsx](src/components/work/related-work.tsx):

```tsx
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { projects, type Project } from "@/data/projects";

/** Resolve `relatedSlugs` to projects. If absent, auto-pick: same category, most recent first, top up by year. */
function resolveRelated(current: Project): Project[] {
  if (current.relatedSlugs?.length) {
    return current.relatedSlugs
      .map((s) => projects.find((p) => p.slug === s))
      .filter((p): p is Project => Boolean(p));
  }

  const sameCat = projects
    .filter((p) => p.slug !== current.slug && p.category === current.category)
    .sort((a, b) => b.year - a.year);

  const filler = projects
    .filter((p) => p.slug !== current.slug && p.category !== current.category)
    .sort((a, b) => b.year - a.year);

  return [...sameCat, ...filler].slice(0, 3);
}

export function RelatedWork({ project }: { project: Project }) {
  const related = resolveRelated(project);
  if (!related.length) return null;

  return (
    <ul className="grid gap-3 sm:grid-cols-3">
      {related.slice(0, 3).map((p) => (
        <li key={p.slug}>
          <Link
            href={`/work/${p.slug}`}
            className="group flex h-full flex-col justify-between gap-3 rounded-2xl border border-[var(--color-line)] bg-[var(--color-bg-2)]/60 p-5 transition-colors hover:border-[var(--color-primary-glow)]/50"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="rounded-md border border-[var(--color-primary-glow)]/30 bg-[var(--color-primary-glow)]/10 px-2 py-0.5 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider text-[var(--color-primary-glow)]">
                &gt; {p.category}
              </span>
              <ArrowUpRight
                size={14}
                className="text-[var(--color-muted)] transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--color-primary-glow)]"
              />
            </div>
            <div>
              <h3 className="text-[16px] font-semibold tracking-tight text-[var(--color-ink)] transition-colors group-hover:text-[var(--color-primary-glow)]">
                {p.name}
              </h3>
              <p className="mt-1 line-clamp-2 text-[12.5px] leading-relaxed text-[var(--color-muted)]">
                {p.problem}
              </p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
```

- [ ] **Step 3: Typecheck**

```bash
npm run typecheck
```

Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add src/components/work/metrics-table.tsx src/components/work/related-work.tsx
git commit -m "feat(work): MetricsTable + RelatedWork components"
```

---

## Task 11: Embed dispatcher + simple variants (Fallback / Colab / Video)

**Files:**
- Create: `src/components/work/embed-fallback.tsx`
- Create: `src/components/work/embed-colab.tsx`
- Create: `src/components/work/embed-video.tsx`
- Create: `src/components/work/embed.tsx`

- [ ] **Step 1: Create `<EmbedFallback>` (static code block)**

Create [src/components/work/embed-fallback.tsx](src/components/work/embed-fallback.tsx):

```tsx
type Props = {
  lang: string;
  code: string;
  caption?: string;
};

export function EmbedFallback({ lang, code, caption }: Props) {
  return (
    <figure className="overflow-hidden rounded-2xl border border-[var(--color-line)] bg-[var(--color-terminal)]">
      <header className="flex items-center justify-between border-b border-[var(--color-line)] px-4 py-2">
        <span className="font-[family-name:var(--font-mono)] text-[10.5px] uppercase tracking-[0.16em] text-[var(--color-muted)]">
          ↳ {lang}
        </span>
        <span className="font-[family-name:var(--font-mono)] text-[10.5px] uppercase tracking-[0.16em] text-[var(--color-primary-glow)]">
          ● snippet
        </span>
      </header>
      <pre className="overflow-x-auto p-5 font-[family-name:var(--font-mono)] text-[12.5px] leading-relaxed text-[var(--color-ink-soft)]">
        <code>{code}</code>
      </pre>
      {caption && (
        <figcaption className="border-t border-[var(--color-line)] px-4 py-3 text-[12.5px] leading-relaxed text-[var(--color-muted)]">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
```

- [ ] **Step 2: Create `<EmbedColab>` (iframe)**

Create [src/components/work/embed-colab.tsx](src/components/work/embed-colab.tsx):

```tsx
type Props = {
  url: string;
  title?: string;
};

export function EmbedColab({ url, title }: Props) {
  return (
    <figure className="overflow-hidden rounded-2xl border border-[var(--color-line)] bg-[var(--color-terminal)]">
      <header className="flex items-center justify-between border-b border-[var(--color-line)] px-4 py-2">
        <span className="font-[family-name:var(--font-mono)] text-[10.5px] uppercase tracking-[0.16em] text-[var(--color-muted)]">
          ↳ google colab notebook
        </span>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-[family-name:var(--font-mono)] text-[10.5px] uppercase tracking-[0.16em] text-[var(--color-primary-glow)] hover:underline"
        >
          open in colab →
        </a>
      </header>
      <iframe
        src={url}
        title={title ?? "Colab notebook"}
        className="h-[520px] w-full border-0"
        sandbox="allow-scripts allow-same-origin allow-popups"
        loading="lazy"
      />
    </figure>
  );
}
```

- [ ] **Step 3: Create `<EmbedVideo>`**

Create [src/components/work/embed-video.tsx](src/components/work/embed-video.tsx):

```tsx
type Props = {
  src: string;
  poster?: string;
  caption?: string;
};

export function EmbedVideo({ src, poster, caption }: Props) {
  return (
    <figure className="overflow-hidden rounded-2xl border border-[var(--color-line)] bg-[var(--color-terminal)]">
      <video
        src={src}
        poster={poster}
        controls
        playsInline
        preload="metadata"
        className="block h-auto w-full"
      />
      {caption && (
        <figcaption className="border-t border-[var(--color-line)] px-4 py-3 text-[12.5px] leading-relaxed text-[var(--color-muted)]">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
```

- [ ] **Step 4: Create the dispatcher `<Embed>`**

Create [src/components/work/embed.tsx](src/components/work/embed.tsx):

```tsx
import dynamic from "next/dynamic";
import { EmbedFallback } from "./embed-fallback";
import { EmbedColab } from "./embed-colab";
import { EmbedVideo } from "./embed-video";
import type { Project } from "@/data/projects";

// Sandpack is heavy (~80 kB gz) — only loaded on routes that use it.
const EmbedSandbox = dynamic(
  () => import("./embed-sandbox").then((m) => m.EmbedSandbox),
  {
    ssr: false,
    loading: () => (
      <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-terminal)] p-8 text-center font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.16em] text-[var(--color-muted)]">
        loading sandbox…
      </div>
    ),
  },
);

export function Embed({ embed }: { embed: NonNullable<Project["embed"]> }) {
  switch (embed.kind) {
    case "fallback":
      return <EmbedFallback lang={embed.lang} code={embed.code} caption={embed.caption} />;
    case "colab":
      return <EmbedColab url={embed.url} title={embed.title} />;
    case "video":
      return <EmbedVideo src={embed.src} poster={embed.poster} caption={embed.caption} />;
    case "sandpack":
      return <EmbedSandbox files={embed.files} entry={embed.entry} template={embed.template} />;
    case "none":
      return null;
    default: {
      // Exhaustiveness check — TypeScript flags any new variant added without a case.
      const _exhaustive: never = embed;
      return _exhaustive;
    }
  }
}
```

- [ ] **Step 5: Typecheck (will fail temporarily because EmbedSandbox doesn't exist yet — that's fine)**

```bash
npm run typecheck
```

Expected: ONE error pointing to the missing `./embed-sandbox` module. Resolved in Task 12. If you see other errors, halt and fix.

- [ ] **Step 6: Commit (with the dangling import — Task 12 closes it)**

```bash
git add src/components/work/embed-fallback.tsx src/components/work/embed-colab.tsx src/components/work/embed-video.tsx src/components/work/embed.tsx
git commit -m "feat(work): Embed dispatcher + Fallback/Colab/Video variants (Sandbox stub follows)"
```

---

## Task 12: `EmbedSandbox` (Sandpack wrapper)

**Files:**
- Create: `src/components/work/embed-sandbox.tsx`

- [ ] **Step 1: Create the Sandpack wrapper**

Create [src/components/work/embed-sandbox.tsx](src/components/work/embed-sandbox.tsx):

```tsx
"use client";

import { Sandpack } from "@codesandbox/sandpack-react";

type Props = {
  files: Record<string, string>;
  entry?: string;
  /** Sandpack template — defaults to "vanilla-ts" since most embeds are short snippets, not React apps. */
  template?: "react-ts" | "vanilla-ts" | "node";
};

export function EmbedSandbox({ files, entry, template = "vanilla-ts" }: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--color-line)]">
      <Sandpack
        template={template}
        files={files}
        options={{
          showLineNumbers: true,
          showTabs: true,
          editorHeight: 420,
          showRefreshButton: true,
          activeFile: entry,
        }}
        theme={{
          colors: {
            surface1: "oklch(0.115 0.015 158)",
            surface2: "oklch(0.155 0.015 158)",
            surface3: "oklch(0.235 0.020 158)",
            clickable: "oklch(0.640 0.012 158)",
            base: "oklch(0.870 0.012 150)",
            disabled: "oklch(0.480 0.014 158)",
            hover: "oklch(0.86 0.27 152)",
            accent: "oklch(0.86 0.27 152)",
            error: "oklch(0.62 0.18 28)",
            errorSurface: "oklch(0.20 0.05 28)",
          },
          syntax: {
            plain: "oklch(0.870 0.012 150)",
            comment: { color: "oklch(0.50 0.012 158)", fontStyle: "italic" },
            keyword: "oklch(0.86 0.27 152)",
            tag: "oklch(0.86 0.27 152)",
            punctuation: "oklch(0.78 0.012 158)",
            definition: "oklch(0.78 0.165 200)",
            property: "oklch(0.78 0.165 200)",
            static: "oklch(0.82 0.090 78)",
            string: "oklch(0.82 0.090 78)",
          },
          font: {
            body: "var(--font-sans)",
            mono: "var(--font-mono)",
            size: "13px",
            lineHeight: "1.6",
          },
        }}
      />
    </div>
  );
}
```

- [ ] **Step 2: Typecheck — should now pass**

```bash
npm run typecheck
```

Expected: PASS (the dangling import from Task 11 is now resolved).

- [ ] **Step 3: Commit**

```bash
git add src/components/work/embed-sandbox.tsx
git commit -m "feat(work): EmbedSandbox — themed Sandpack matching site palette"
```

---

## Task 13: `/work/[slug]` page route

**Files:**
- Create: `src/app/work/[slug]/page.tsx`

- [ ] **Step 1: Create the route**

Create [src/app/work/[slug]/page.tsx](src/app/work/[slug]/page.tsx):

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Brain, Lightbulb, Scale, AlertTriangle, Zap } from "lucide-react";
import { projects } from "@/data/projects";
import { ArchitectureDiagram } from "@/components/sections/architecture-diagram";
import { TechBadge } from "@/components/ui/badge";
import { WorkPageShell, WorkSectionEyebrow } from "@/components/work/work-page-shell";
import { MetricsTable } from "@/components/work/metrics-table";
import { RelatedWork } from "@/components/work/related-work";
import { Embed } from "@/components/work/embed";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return projects.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  const project = projects.find((p) => p.slug === params.slug);
  if (!project) return {};
  const title = `${project.name} — Abdul Razzaq`;
  const description = project.problem;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [`/og/work/${project.slug}`],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`/og/work/${project.slug}`],
    },
  };
}

export default function WorkPage({ params }: { params: Params }) {
  const project = projects.find((p) => p.slug === params.slug);
  if (!project) notFound();

  const hasContext = !!project.context;
  const hasArch = !!project.architecture;
  const hasEmbed = project.embed && project.embed.kind !== "none";
  const hasMetrics = !!project.metrics?.length;
  const hasThinking = !!project.thinking;

  return (
    <WorkPageShell project={project}>
      {/* Stack ribbon */}
      <section>
        <div className="flex flex-wrap gap-1.5">
          {project.stack.map((s) => (
            <TechBadge key={s}>{s}</TechBadge>
          ))}
        </div>
      </section>

      {/* Context */}
      <section>
        <WorkSectionEyebrow num="01" label="Context" />
        <div className="prose-readable max-w-[68ch] text-[15.5px] leading-[1.75] text-[var(--color-ink-soft)] sm:text-[16.5px]">
          {(hasContext ? project.context! : project.problem)
            .split(/\n\n+/)
            .map((para, i) => (
              <p key={i} className="mb-5 last:mb-0">
                {para}
              </p>
            ))}
        </div>
      </section>

      {/* Architecture */}
      {hasArch && (
        <section>
          <WorkSectionEyebrow num="02" label="Architecture" />
          <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-bg)]/40 p-4 backdrop-blur-sm sm:p-6">
            <ArchitectureDiagram arch={project.architecture!} />
          </div>
        </section>
      )}

      {/* The Code */}
      {hasEmbed && (
        <section>
          <WorkSectionEyebrow num="03" label="The Code" />
          <Embed embed={project.embed!} />
        </section>
      )}

      {/* Metrics */}
      {hasMetrics && (
        <section>
          <WorkSectionEyebrow num="04" label="Metrics" />
          <MetricsTable metrics={project.metrics!} />
        </section>
      )}

      {/* Lessons (Thinking blocks always visible on case-study pages) */}
      {hasThinking && (
        <section>
          <WorkSectionEyebrow num="05" label="Lessons" />
          <div className="grid gap-3 sm:grid-cols-2">
            <ThinkingBlock icon={Brain}         label="Tech decisions"  items={project.thinking!.decisions} />
            <ThinkingBlock icon={Scale}         label="Tradeoffs"       items={project.thinking!.tradeoffs} />
            <ThinkingBlock icon={AlertTriangle} label="Challenges"      items={project.thinking!.challenges} />
            <ThinkingBlock icon={Zap}           label="Optimizations"   items={project.thinking!.optimizations} />
          </div>
        </section>
      )}

      {/* Related */}
      <section>
        <WorkSectionEyebrow num="06" label="Related work" />
        <RelatedWork project={project} />
      </section>
    </WorkPageShell>
  );
}

function ThinkingBlock({
  icon: Icon,
  label,
  items,
}: {
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  label: string;
  items: string[];
}) {
  if (!items?.length) return null;
  return (
    <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-elevated)]/70 p-5 backdrop-blur-sm">
      <div className="flex items-center gap-1.5 font-[family-name:var(--font-mono)] text-[10.5px] uppercase tracking-[0.18em] text-[var(--color-primary-glow)]">
        <Icon size={11} strokeWidth={2.5} />
        {label}
      </div>
      <ul className="mt-2 space-y-2 text-[13px] leading-relaxed text-[var(--color-ink-soft)]">
        {items.map((it) => (
          <li key={it} className="flex gap-2">
            <span
              aria-hidden
              className="mt-1.5 inline-block h-1 w-1 shrink-0 rounded-full bg-[var(--color-primary-glow)]"
            />
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

- [ ] **Step 2: Build — must pass and prerender 8 routes**

```bash
npm run build
```

Expected: build output includes 8 entries under `Route (app)` for `/work/[slug]` (one per project), all marked `●` (static). If any are marked `λ` (dynamic), the `generateStaticParams` setup is wrong — halt.

- [ ] **Step 3: Visual verify**

```bash
npm run dev
# http://localhost:3000/work/finalcircle
# http://localhost:3000/work/capital-valley
# http://localhost:3000/work/rag-healthcare
```

Expected: all 3 pages render. The other 5 (`lead-genie`, `stock-screener`, etc.) also render but with empty Code/Metrics sections — sections are conditionally hidden, layout doesn't break.

- [ ] **Step 4: Commit**

```bash
git add src/app/work
git commit -m "feat(work): /work/[slug] page route — case-study template wired"
```

---

## Task 14: Update `ProjectCard` to link to `/work/[slug]`

**Files:**
- Modify: [src/components/sections/project-card.tsx](src/components/sections/project-card.tsx)

- [ ] **Step 1: Wrap the card visual + body in a `<Link>` to `/work/[slug]`**

In [src/components/sections/project-card.tsx](src/components/sections/project-card.tsx), find the top of the file and add the Next link import:

```ts
import Link from "next/link";
```

Then locate the existing `<article ... >` element and add a `<Link>` wrapper around the **visual preview block only** (the `<div className="relative aspect-[16/10] ...">` and its child). Replace this:

```tsx
      {/* Visual preview — IDE-style artifact */}
      <div className="relative aspect-[16/10] overflow-hidden border-b border-[var(--color-line)] bg-[var(--color-terminal)]">
        <ProjectVisual project={project} />
        <div className="absolute left-4 top-4 flex items-center gap-2">
          <span className="rounded-md border border-[var(--color-primary-glow)]/30 bg-[var(--color-primary-glow)]/10 px-2 py-0.5 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider text-[var(--color-primary-glow)] backdrop-blur">
            &gt; {project.category}
          </span>
        </div>
        <div className="absolute right-4 top-4 font-[family-name:var(--font-mono)] text-[10.5px] tracking-widest text-[var(--color-muted)]">
          {String(index + 1).padStart(2, "0")} · {project.year}
        </div>
      </div>
```

With:

```tsx
      {/* Visual preview — IDE-style artifact (clickable to /work/[slug]) */}
      <Link
        href={`/work/${project.slug}`}
        aria-label={`Open ${project.name} case study`}
        className="group/visual relative block aspect-[16/10] overflow-hidden border-b border-[var(--color-line)] bg-[var(--color-terminal)]"
      >
        <ProjectVisual project={project} />
        <div className="absolute left-4 top-4 flex items-center gap-2">
          <span className="rounded-md border border-[var(--color-primary-glow)]/30 bg-[var(--color-primary-glow)]/10 px-2 py-0.5 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider text-[var(--color-primary-glow)] backdrop-blur">
            &gt; {project.category}
          </span>
        </div>
        <div className="absolute right-4 top-4 font-[family-name:var(--font-mono)] text-[10.5px] tracking-widest text-[var(--color-muted)]">
          {String(index + 1).padStart(2, "0")} · {project.year}
        </div>
        {/* Hover hint */}
        <div className="pointer-events-none absolute bottom-4 right-4 inline-flex items-center gap-1.5 rounded-full border border-[var(--color-primary-glow)]/30 bg-[var(--color-primary-glow)]/10 px-2.5 py-1 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider text-[var(--color-primary-glow)] opacity-0 backdrop-blur transition-opacity duration-300 group-hover/visual:opacity-100">
          read case study →
        </div>
      </Link>
```

- [ ] **Step 2: Make the project name in the body also link**

In the same file, find this block:

```tsx
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-[22px] font-semibold tracking-tight transition-colors group-hover:text-[var(--color-primary)]">
            {project.name}
          </h3>
```

Replace the `<h3>` content with:

```tsx
          <h3 className="text-[22px] font-semibold tracking-tight">
            <Link
              href={`/work/${project.slug}`}
              className="transition-colors hover:text-[var(--color-primary-glow)]"
            >
              {project.name}
            </Link>
          </h3>
```

- [ ] **Step 3: Typecheck**

```bash
npm run typecheck
```

Expected: PASS.

- [ ] **Step 4: Verify in browser**

```bash
npm run dev
# http://localhost:3000 → scroll to Selected Work
# Click the visual of any project → routes to /work/[slug]
# Click the project name → also routes to /work/[slug]
# The Architecture/Engineering toggle buttons inside the card still work as before
```

Expected: navigation works. The existing inline expand/Architecture buttons inside the card body remain functional (they're separate from the link).

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/project-card.tsx
git commit -m "feat(card): link project visual + name to /work/[slug] case study page"
```

---

## Task 15: Geist font loader for Satori + `/og/default` route

**Files:**
- Create: `src/lib/og/load-fonts.ts`
- Create: `src/app/og/default/route.tsx`

- [ ] **Step 1: Create the font loader**

Create [src/lib/og/load-fonts.ts](src/lib/og/load-fonts.ts):

```ts
/**
 * Fetch Geist Sans + Geist Mono font binaries for Satori.
 * Cached per-fetch by Next; results memoised here for the lifetime of the route module.
 *
 * Failure mode: if Google Fonts is unreachable at request time, the OG route
 * falls back to Satori's bundled Inter — image still generates, off-brand but readable.
 */

let cache: { sans: ArrayBuffer; mono: ArrayBuffer } | null = null;

export async function loadGeistFonts(): Promise<{ sans: ArrayBuffer; mono: ArrayBuffer } | null> {
  if (cache) return cache;

  // The CSS endpoint is the only way to get the actual font binary URL.
  // For Geist we hit the canonical Google Fonts CSS, then extract the .ttf URL.
  const cssEndpoints = {
    sans: "https://fonts.googleapis.com/css2?family=Geist:wght@500&display=swap",
    mono: "https://fonts.googleapis.com/css2?family=Geist+Mono:wght@500&display=swap",
  };

  try {
    const fetchFontBinary = async (cssUrl: string): Promise<ArrayBuffer> => {
      const cssRes = await fetch(cssUrl, {
        // Pretend to be a browser so Google returns ttf, not woff2 (Satori needs ttf/otf)
        headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" },
      });
      const css = await cssRes.text();
      const m = css.match(/url\((https:\/\/[^)]+\.(?:ttf|otf))\)/);
      if (!m) throw new Error("font url not found in CSS");
      const fontRes = await fetch(m[1]);
      if (!fontRes.ok) throw new Error("font fetch failed");
      return fontRes.arrayBuffer();
    };

    const [sans, mono] = await Promise.all([
      fetchFontBinary(cssEndpoints.sans),
      fetchFontBinary(cssEndpoints.mono),
    ]);
    cache = { sans, mono };
    return cache;
  } catch (e) {
    console.warn("OG font load failed, using Satori default:", e);
    return null;
  }
}
```

- [ ] **Step 2: Create the default OG route**

Create [src/app/og/default/route.tsx](src/app/og/default/route.tsx):

```tsx
import { ImageResponse } from "next/og";
import { loadGeistFonts } from "@/lib/og/load-fonts";

export const runtime = "edge";
export const revalidate = 86400; // 1 day cache

export async function GET() {
  const fonts = await loadGeistFonts();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px 80px",
          background:
            "linear-gradient(135deg, #1a1f1c 0%, #0f1310 100%)",
          backgroundImage:
            "radial-gradient(ellipse 60% 50% at 80% 20%, rgba(132,255,180,0.18), transparent 60%)," +
            "radial-gradient(ellipse 50% 40% at 20% 80%, rgba(0,170,100,0.16), transparent 70%)," +
            "linear-gradient(135deg, #1a1f1c 0%, #0f1310 100%)",
          fontFamily: "Geist",
          color: "#f3f5f3",
        }}
      >
        {/* Top: prompt-style eyebrow */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            fontFamily: "Geist Mono",
            fontSize: "20px",
            color: "#9aa39d",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
          }}
        >
          <span style={{ color: "#84ffb4" }}>$</span>
          <span>cat /etc/abdul.profile</span>
        </div>

        {/* Headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div
            style={{
              fontSize: "92px",
              fontWeight: 500,
              lineHeight: 0.98,
              letterSpacing: "-0.04em",
              display: "flex",
              flexWrap: "wrap",
              gap: "20px",
            }}
          >
            <span>Engineering</span>
            <span style={{ color: "#84ffb4" }}>systems</span>
            <span>that just</span>
            <span style={{ fontStyle: "italic", fontWeight: 300 }}>keep running.</span>
          </div>
        </div>

        {/* Bottom strip */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontFamily: "Geist Mono",
            fontSize: "20px",
            color: "#9aa39d",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            borderTop: "1px solid rgba(255,255,255,0.10)",
            paddingTop: "20px",
          }}
        >
          <span>Abdul Razzaq</span>
          <span>· Full Stack & AI Application Developer</span>
          <span style={{ color: "#84ffb4" }}>● open</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      ...(fonts && {
        fonts: [
          { name: "Geist", data: fonts.sans, weight: 500, style: "normal" },
          { name: "Geist Mono", data: fonts.mono, weight: 500, style: "normal" },
        ],
      }),
    },
  );
}
```

- [ ] **Step 3: Build to confirm the route compiles for Edge runtime**

```bash
npm run build
```

Expected: build passes. `/og/default` listed in build output as Edge.

- [ ] **Step 4: Visual verify**

```bash
npm run dev
# Open http://localhost:3000/og/default in browser
# Save the resulting PNG and inspect it
```

Expected: 1200×630 PNG with dark background, neon emerald "systems" word, prompt-style eyebrow at top, name + role + ● open at bottom.

- [ ] **Step 5: Commit**

```bash
git add src/lib/og src/app/og/default
git commit -m "feat(og): Geist font loader + /og/default route (Satori, Edge)"
```

---

## Task 16: `/og/work/[slug]` route — IDE-artifact style

**Files:**
- Create: `src/app/og/work/[slug]/route.tsx`

- [ ] **Step 1: Create the per-project OG route**

Create [src/app/og/work/[slug]/route.tsx](src/app/og/work/[slug]/route.tsx):

```tsx
import { ImageResponse } from "next/og";
import { loadGeistFonts } from "@/lib/og/load-fonts";
import { projects } from "@/data/projects";

export const runtime = "edge";
export const revalidate = 86400;

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } },
) {
  const project = projects.find((p) => p.slug === params.slug);
  if (!project) {
    return new Response("Not found", { status: 404 });
  }

  const fonts = await loadGeistFonts();

  // Pick file extension by language — same heuristic the IDE artifact card uses
  const stackLower = project.stack.map((s) => s.toLowerCase());
  const fileExt = stackLower.some((s) => s.includes("python") || s.includes("django") || s.includes("jupyter"))
    ? "py"
    : stackLower.some((s) => s.includes("typescript") || s.includes("next") || s.includes("react"))
    ? "tsx"
    : stackLower.some((s) => s.includes("solidity"))
    ? "sol"
    : "js";
  const filename = `${project.slug.replace(/-/g, "_")}.${fileExt}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "56px 64px",
          background:
            "radial-gradient(ellipse 70% 50% at 90% 10%, rgba(132,255,180,0.18), transparent 60%)," +
            "linear-gradient(135deg, #1a1f1c 0%, #0c0f0d 100%)",
          fontFamily: "Geist",
          color: "#f3f5f3",
          gap: "32px",
        }}
      >
        {/* Top eyebrow */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            fontFamily: "Geist Mono",
            fontSize: "18px",
            color: "#9aa39d",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
          }}
        >
          <span style={{ color: "#84ffb4" }}>//</span>
          <span style={{ color: "#84ffb4" }}>/work</span>
          <span>·</span>
          <span>{project.slug}</span>
        </div>

        {/* IDE window mock */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            background: "#0e1310",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "8px",
            overflow: "hidden",
            flex: 1,
          }}
        >
          {/* Title bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 16px",
              background: "rgba(0,0,0,0.4)",
              borderBottom: "1px solid rgba(132,255,180,0.18)",
              fontFamily: "Geist Mono",
              fontSize: "14px",
              color: "#9aa39d",
            }}
          >
            <span style={{ width: 10, height: 10, borderRadius: 5, background: "#d57464" }} />
            <span style={{ width: 10, height: 10, borderRadius: 5, background: "#d6b76a" }} />
            <span style={{ width: 10, height: 10, borderRadius: 5, background: "#84d6a4" }} />
            <span style={{ marginLeft: "16px" }}>{filename} — {project.name}</span>
          </div>

          {/* Code area */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              padding: "24px 28px",
              fontFamily: "Geist Mono",
              fontSize: "20px",
              gap: "8px",
              flex: 1,
            }}
          >
            <div style={{ color: "#5a665e", fontStyle: "italic" }}>// {project.name}</div>
            <div>
              <span style={{ color: "#84ffb4" }}>export const </span>
              <span style={{ color: "#f3f5f3" }}>stack </span>
              <span style={{ color: "#c5cdc7" }}>= [</span>
            </div>
            {project.stack.slice(0, 4).map((s) => (
              <div key={s} style={{ paddingLeft: "24px" }}>
                <span style={{ color: "#d6b76a" }}>{`"${s}"`}</span>
                <span style={{ color: "#c5cdc7" }}>,</span>
              </div>
            ))}
            <div style={{ color: "#c5cdc7" }}>];</div>
          </div>
        </div>

        {/* Bottom name strip */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontFamily: "Geist Mono",
            fontSize: "16px",
            color: "#9aa39d",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
          }}
        >
          <span>Abdul Razzaq · {project.category} · {project.year}</span>
          <span style={{ color: "#84ffb4" }}>● {project.visibility}</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      ...(fonts && {
        fonts: [
          { name: "Geist", data: fonts.sans, weight: 500, style: "normal" },
          { name: "Geist Mono", data: fonts.mono, weight: 500, style: "normal" },
        ],
      }),
    },
  );
}
```

- [ ] **Step 2: Build**

```bash
npm run build
```

Expected: passes; `/og/work/[slug]` listed as Edge route.

- [ ] **Step 3: Visual verify all three**

```bash
npm run dev
# Open each in a tab:
# http://localhost:3000/og/work/finalcircle
# http://localhost:3000/og/work/capital-valley
# http://localhost:3000/og/work/rag-healthcare
```

Expected: each 1200×630 PNG renders an IDE-style mock with the right filename extension (`.tsx` for finalcircle, `.js` for capital-valley, `.py` for rag-healthcare), correct stack list, correct category + visibility.

- [ ] **Step 4: Commit**

```bash
git add src/app/og/work
git commit -m "feat(og): /og/work/[slug] — IDE-artifact OG image per project"
```

---

## Task 17: `/og/notes/[slug]` route — used in Phase 2

**Files:**
- Create: `src/app/og/notes/[slug]/route.tsx`

The `/notes` route doesn't exist yet (Phase 2). Building this OG endpoint now means Phase 2 just has to add MDX content — the social-share story is already wired.

- [ ] **Step 1: Create the route**

Create [src/app/og/notes/[slug]/route.tsx](src/app/og/notes/[slug]/route.tsx):

```tsx
import { ImageResponse } from "next/og";
import { loadGeistFonts } from "@/lib/og/load-fonts";

export const runtime = "edge";
export const revalidate = 86400;

/**
 * Renders a generic essay OG image. Until Phase 2 adds MDX-backed notes,
 * the title comes from the URL slug (kebab-case → Title Case).
 * Phase 2 will swap this for a fetch of the MDX frontmatter.
 */
function slugToTitle(slug: string): string {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
}

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } },
) {
  const fonts = await loadGeistFonts();
  const title = slugToTitle(params.slug);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 88px",
          background:
            "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(132,255,180,0.16), transparent 60%)," +
            "linear-gradient(135deg, #1a1f1c 0%, #0c0f0d 100%)",
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)," +
            "linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)," +
            "linear-gradient(135deg, #1a1f1c 0%, #0c0f0d 100%)",
          backgroundSize: "44px 44px, 44px 44px, auto",
          fontFamily: "Geist",
          color: "#f3f5f3",
        }}
      >
        {/* Eyebrow */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            fontFamily: "Geist Mono",
            fontSize: "18px",
            color: "#9aa39d",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
          }}
        >
          <span style={{ color: "#84ffb4" }}>//</span>
          <span style={{ color: "#84ffb4" }}>/notes</span>
          <span>·</span>
          <span>essay</span>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: "76px",
            fontWeight: 500,
            lineHeight: 1.05,
            letterSpacing: "-0.035em",
            display: "flex",
          }}
        >
          {title}
          <span style={{ color: "#84ffb4" }}>.</span>
        </div>

        {/* Bottom strip */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontFamily: "Geist Mono",
            fontSize: "18px",
            color: "#9aa39d",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            borderTop: "1px solid rgba(255,255,255,0.10)",
            paddingTop: "24px",
          }}
        >
          <span>Abdul Razzaq · Notes</span>
          <span>abdulrazzaq.dev</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      ...(fonts && {
        fonts: [
          { name: "Geist", data: fonts.sans, weight: 500, style: "normal" },
          { name: "Geist Mono", data: fonts.mono, weight: 500, style: "normal" },
        ],
      }),
    },
  );
}
```

- [ ] **Step 2: Build + visual check**

```bash
npm run build && npm run dev
# http://localhost:3000/og/notes/portfolio-design-system
```

Expected: PNG renders with title "Portfolio Design System.", grid background, eyebrow at top, footer at bottom.

- [ ] **Step 3: Commit**

```bash
git add src/app/og/notes
git commit -m "feat(og): /og/notes/[slug] — placeholder OG for Phase 2 essays"
```

---

## Task 18: Wire `metadata.openGraph` defaults

**Files:**
- Modify: [src/app/layout.tsx](src/app/layout.tsx)

- [ ] **Step 1: Read the current layout to see what's already there**

```bash
cat src/app/layout.tsx
```

Note the existing `metadata` export. The site likely already has a `Metadata` block — we'll add/extend `openGraph` and `twitter` with the new default OG image and `metadataBase` (required for absolute OG URLs).

- [ ] **Step 2: Add `metadataBase` + default `openGraph` + `twitter`**

In [src/app/layout.tsx](src/app/layout.tsx), find the existing `export const metadata: Metadata = { ... };` block and ensure it includes these fields (merge with existing — do not delete existing keys):

```ts
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  // ... keep existing title, description, etc. ...
  openGraph: {
    type: "website",
    title: "Abdul Razzaq — Full Stack & AI Application Developer",
    description:
      "Backend-leaning full-stack engineer. Django, Node, Next.js, AI/ML. Currently at Infinitiv AI, open for new work.",
    url: "/",
    siteName: "Abdul Razzaq",
    images: [
      {
        url: "/og/default",
        width: 1200,
        height: 630,
        alt: "Abdul Razzaq — Engineering systems that just keep running",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Abdul Razzaq — Full Stack & AI Application Developer",
    description:
      "Backend-leaning full-stack engineer. Currently at Infinitiv AI, open for new work.",
    images: ["/og/default"],
  },
};
```

If `NEXT_PUBLIC_SITE_URL` is not set (most local dev) the base falls back to `http://localhost:3000` — fine for development. For production, set this in `.env.local` to your real URL when you deploy.

- [ ] **Step 3: Build + verify**

```bash
npm run build
```

Then in dev:

```bash
npm run dev
# View source on http://localhost:3000 — find the <meta property="og:image" ... /> tag
# It should point to http://localhost:3000/og/default
```

For `/work/[slug]` pages, view source on `/work/finalcircle` and confirm `<meta property="og:image">` points to `/og/work/finalcircle`.

- [ ] **Step 4: Commit**

```bash
git add src/app/layout.tsx
git commit -m "feat(og): wire metadataBase + default OG/Twitter cards on root layout"
```

---

## Task 19: Final verification + Playwright screenshot pass

**Files:** none (verification-only).

- [ ] **Step 1: Full clean build — must pass with budget intact**

```bash
rm -rf .next
npm run build
```

Expected output includes (sizes approximate, must not exceed):

```
Route (app)                              Size     First Load JS
┌ ○ /                                    ≤ 36 kB  ≤ 165 kB
├ ○ /system                              ≤ 25 kB  ≤ 145 kB
├ ● /work/[slug]                         ≤ 30 kB  ≤ 160 kB
│  ├ /work/capital-valley
│  ├ /work/finalcircle
│  ├ /work/rag-healthcare
│  └ /work/[+5 more]
├ ƒ /og/default
├ ƒ /og/work/[slug]
└ ƒ /og/notes/[slug]
```

If `/` exceeds 165 kB, halt and check — likely culprit is an accidental client-component import pulling Sandpack into the home bundle.

- [ ] **Step 2: Typecheck**

```bash
npm run typecheck
```

Expected: zero errors.

- [ ] **Step 3: Playwright screenshot pass**

```bash
PORT=3014 npm run dev &
sleep 4
```

Then in a Playwright session, capture these screenshots and eyeball each:

```
1. http://localhost:3014/                    → home, hero + projects + about all visible
2. http://localhost:3014/work/finalcircle    → full case study renders
3. http://localhost:3014/work/capital-valley → full case study renders
4. http://localhost:3014/work/rag-healthcare → full case study renders
5. http://localhost:3014/work/lead-genie     → page works with empty Code/Metrics sections (graceful fallback)
6. http://localhost:3014/system              → all 5 sections visible: Tokens, Type, Components, Effects, Decisions
7. http://localhost:3014/og/default          → 1200×630 PNG renders
8. http://localhost:3014/og/work/finalcircle → 1200×630 PNG with IDE mock + tsx filename
9. http://localhost:3014/og/notes/some-slug  → 1200×630 PNG with title rendered from slug
```

For each: no console errors (open DevTools), no layout breakage, no missing assets.

- [ ] **Step 4: Stop dev server**

```bash
lsof -ti :3014 | xargs -r kill 2>/dev/null
```

- [ ] **Step 5: Final commit + push (if remote configured)**

```bash
git status   # confirm clean
git log --oneline -10   # confirm phase 1 commits in order
```

If you have a remote configured, push:

```bash
git push origin main
```

If no remote, skip — the work is preserved locally.

---

## Self-review

I checked this plan against each section of the spec.

### Spec coverage

| Spec section | Tasks that implement it | Notes |
|---|---|---|
| S1 Live Instrument Panel | — | Phase 2 |
| S2 Deep `/work/[slug]` | T9 (shell), T10 (tables), T11+T12 (embeds), T13 (route) | Full coverage for all 8 slugs; rich content for 3 |
| S3 `/system` page | T4 (parser), T5-T8 (sections) | Full coverage, all 5 subsections |
| S4 `/notes` route | — | Phase 2 |
| S5 Skills replacement | — | Phase 2 |
| S6 Two-path Contact | — | Phase 3 |
| S7 Experience tightening | — | Phase 3 |
| S8 OG generation | T15 (default + font loader), T16 (work), T17 (notes), T18 (wiring) | Full coverage including the future-Phase-2 notes route |
| S9 Terminal extensions | — | Phase 2 |
| Engineering: caching | T13 metadata + T15-T17 `revalidate = 86400` | Edge runtime + 1-day cache |
| Engineering: bundle budget | T19 verification step | Sandpack dynamic-imported in T11 |
| Engineering: env vars | T18 `NEXT_PUBLIC_SITE_URL` mention | Optional drop-ins (Liveblocks/WakaTime) deferred per user instruction |
| Engineering: a11y | T9 breadcrumb `<nav aria-label>`, T13 `<article>`, T18 alt text on OG | Skip-link + proper headings throughout |
| Engineering: security | Spec section honored — no new attack surface added | OG routes are server-only, no user input |
| New deps | T1 installs Sandpack only (`next/og` is built-in) | Matches spec dependency table |

**Gaps:** Phases 2 and 3 work is intentionally not in this plan. They will be planned separately when Phase 1 ships.

### Placeholder scan

Searched the plan for the failure patterns from the skill. None present. Every code step has runnable code; every command has expected output; every file path is exact.

One intentional dangling import in Task 11 → Task 12 is **explicitly called out** in Task 11 Step 5 ("Typecheck will fail temporarily — that's fine") and resolved in Task 12. Not a hidden placeholder; surfaced and explained.

### Type consistency

- `Project` type extension in Task 2 is referenced exactly the same way (`project.context`, `project.metrics`, `project.embed`, `project.relatedSlugs`) in Tasks 10, 11, 12, 13.
- `Token` type defined in Task 4 is consumed identically in Task 5's `<TokenSwatch>`.
- `Embed` discriminated union has matching cases in Task 11's dispatcher and Task 12's wrapper props.
- `WorkPageShell` props (`project: Project`, `children: ReactNode`) match the call site in Task 13.

No drift detected.

### Scope check

Phase 1 alone produces working, testable software: 8 case-study pages, 1 design-system page, OG image generation. Each is independently shippable. Plan size is appropriate for one implementation pass (~1-2 focused days).

---

## Plan complete

Plan saved to [`docs/superpowers/plans/2026-04-29-phase-1-engineering-notebook-spine.md`](docs/superpowers/plans/2026-04-29-phase-1-engineering-notebook-spine.md).

Two execution options:

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration. Good for trust-but-verify on a 19-task plan.

**2. Inline Execution** — Execute tasks in this session using executing-plans, batch with checkpoints for your review.

Which approach?
