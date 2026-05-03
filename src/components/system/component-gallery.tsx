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
