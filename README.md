# Abdul Razzaq — Portfolio (Next.js)

A production-grade developer portfolio built with Next.js 15 (App Router), React 19, Tailwind CSS v4 and Motion. Designed for performance, premium feel and recruiter signal.

## Highlights

- **Server Components by default** — only interactive surfaces hydrate (navbar, terminal, contact form, scroll-spy).
- **Lighthouse 95+ target** — RSC payload, lazy-loaded sections, optimised fonts via `next/font`.
- **Custom design system** — emerald `#006241` primary on a layered soft-grey background with glassmorphic surfaces.
- **WOW feature: Interactive terminal** — press `⌘K` (or `Ctrl+K`) anywhere to open a real command palette: `help`, `show projects`, `show skills`, `goto contact`, `download cv`, `socials`, `theme`, `clear`.
- **Engineering Highlights toggle** on every project card.
- **Active section tracking** in the navbar via IntersectionObserver (no scroll listeners).
- **Word-by-word reveals** on every major heading.
- **Form validation** with Zod + Sonner toasts.
- **Accessibility** — focus rings, reduced-motion support, semantic landmarks.

## Stack

| Concern        | Choice                                                                 |
| -------------- | ---------------------------------------------------------------------- |
| Framework      | Next.js 15 (App Router) + React 19                                     |
| Language       | TypeScript 5                                                           |
| Styling        | Tailwind CSS v4 (CSS-based config in `globals.css`)                    |
| Animation      | Motion (formerly Framer Motion) + CSS `cubic-bezier` springs           |
| Icons          | Lucide React                                                           |
| Toasts         | Sonner                                                                 |
| Forms          | Native + Zod                                                           |
| Font           | Geist Sans + Geist Mono via `next/font` (zero CLS)                     |
| Deploy         | Vercel (recommended) — works anywhere                                  |

## Getting started

```bash
# 1. Install dependencies
npm install
# or:  pnpm install   //  yarn   //  bun install

# 2. Run dev (with Turbopack)
npm run dev

# 3. Build for production
npm run build && npm start
```

Open <http://localhost:3000>.

## Project structure

```
src/
├── app/                       # Next.js App Router
│   ├── layout.tsx             # Root layout — fonts, metadata, SiteShell
│   ├── page.tsx               # Home — composed sections
│   └── globals.css            # Design tokens + utilities
├── components/
│   ├── ui/                    # Primitives — Button, Badge, Card, Reveal
│   ├── layout/                # Navbar, Footer, Container, SectionWrapper, SiteShell
│   └── sections/              # Hero, About, Skills, Projects, Experience, Contact, Terminal
├── lib/                       # utils, sections, constants
├── hooks/                     # use-intersection-observer, use-scroll-spy, use-keyboard-shortcut
└── data/                      # personal, projects, skills, experience (typed)
```

### Server vs Client

Default: **Server Components**. Client (`"use client"`) only on:

- `Navbar` (scroll spy + active link)
- `AnimatedHeading` (rotator)
- `ProjectCard` (highlights toggle)
- `Skills` (tab state)
- `Reveal` / `RevealText` (IntersectionObserver)
- `Contact` (form state + Zod)
- `Terminal` (input + history)
- `SiteShell` (terminal state + ⌘K shortcut)

## Customising

**Personal info** → `src/data/personal.ts`
**Projects**     → `src/data/projects.ts` (each entry has Problem / Solution / Impact / Highlights)
**Skills**       → `src/data/skills.ts` (grouped, with `Advanced | Intermediate | Practical`)
**Experience**   → `src/data/experience.ts`
**Sections**     → `src/lib/sections.ts` controls navbar order + scroll-spy
**Tokens**       → `@theme { ... }` block in `src/app/globals.css`

## Wiring the contact form to a real backend

Currently submissions resolve after a simulated delay. To send real email:

```ts
// src/app/api/contact/route.ts  (create this)
import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: Request) {
  const body = await req.json();
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: "portfolio@abdulrazzaq.dev",
    to:   "abdulrazzaq.dev@gmail.com",
    subject: body.subject,
    text:    `${body.name} <${body.email}>\n\n${body.message}`,
  });
  return NextResponse.json({ ok: true });
}
```

Then in `src/components/sections/contact.tsx`, replace the `setTimeout` block with `fetch("/api/contact", { method: "POST", body: JSON.stringify(parsed.data) })`.

## Deploy

```bash
# Vercel — one click after pushing to GitHub
vercel
```

The repo is plain Next.js — no special config required. Set `RESEND_API_KEY` in Vercel project env when wiring the contact backend.

---

Designed and built by Abdul Razzaq · 2026
