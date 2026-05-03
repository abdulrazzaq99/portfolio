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
