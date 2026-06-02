import type { NoteMeta } from "./index";

export const meta: NoteMeta = {
  slug: "portfolio-design-system",
  title: "How I built this portfolio's design system",
  dek: "OKLCH tokens, Tailwind v4, the dark/neon pivot, and what broke along the way.",
  date: "2026-04-30",
  readTime: "12 min",
  status: "draft",
  excerpt:
    "I started with a single brand emerald and a fresh Tailwind v4 install. Three rebuilds later, the system is OKLCH-native, theme-driven, and brutalist by default — these are the decisions I'd make again, and the ones I'd undo.",
};

/**
 * Outline-only scaffold. Replace each <Para> with real prose when ready.
 * The structure mirrors the headings I want to land on; rewrite the body
 * in your own voice.
 */
export default function PortfolioDesignSystem() {
  return (
    <>
      <Para>
        <em>Coming soon.</em> This essay is in draft. The outline below is the
        target shape — fill each section with your own writeup, then flip{" "}
        <code>status: &quot;draft&quot;</code> to <code>&quot;published&quot;</code> in the meta block.
      </Para>

      <H2>The brief</H2>
      <Para>
        What I wanted: dark, neon, software-engineer artifact-density. What I
        had to start: an emerald base color (#006241) and a fresh Tailwind v4
        setup. Why those constraints mattered.
      </Para>

      <H2>The token surgery</H2>
      <Para>
        Why I split the brand into two emeralds — a deep version
        (<code>oklch(0.46 0.108 158)</code>) for ink and a neon version
        (<code>oklch(0.86 0.27 152)</code>) for accents. The OKLCH math, and
        why it's better than HSL for this kind of work.
      </Para>

      <H2>Glass utilities on dark vs light</H2>
      <Para>
        How the same <code>--color-elevated</code> token has to behave very
        differently in dark vs light mode. White-wash vs gray-wash. What
        happens if you don't think about both modes at the same time.
      </Para>

      <H2>The IDE-artifact card</H2>
      <Para>
        Replacing the default mockup with a faux-syntax-highlighted IDE
        window. Why faux-syntax beats stock screenshots. The cost (one big
        SVG) vs the win (it&apos;s the visual signature of the site).
      </Para>

      <H2>What broke</H2>
      <Para>(Your write-up — what surprised you, what you&apos;d redo.)</Para>

      <H2>What I&apos;d do differently</H2>
      <Para>(Your write-up — the honest postmortem.)</Para>
    </>
  );
}

/* ── Tiny prose primitives — keep typography consistent across notes ── */
function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-14 mb-5 text-[clamp(24px,3vw,32px)] font-bold leading-[1.2] tracking-[-0.025em] text-[var(--color-ink)]">
      {children}
    </h2>
  );
}

function Para({ children }: { children: React.ReactNode }) {
  return (
    <p className="my-5 text-[16.5px] leading-[1.75] text-[var(--color-ink-soft)]">
      {children}
    </p>
  );
}
