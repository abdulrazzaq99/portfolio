import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone = "default" | "primary" | "muted" | "live";

const tones: Record<Tone, string> = {
  default: "bg-[var(--color-elevated)] text-[var(--color-ink-soft)] border-[var(--color-line-strong)]",
  primary: "bg-[var(--color-primary-soft)] text-[var(--color-primary)] border-[oklch(0.46_0.108_158_/_0.20)]",
  muted:   "bg-transparent text-[var(--color-muted)] border-[var(--color-line-strong)]",
  live:    "bg-[var(--color-elevated)] text-[var(--color-ink-soft)] border-[var(--color-line-strong)]",
};

export function Badge({
  children,
  tone = "default",
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-medium tracking-wide",
        "backdrop-blur-md font-[family-name:var(--font-mono)]",
        tones[tone],
        className,
      )}
    >
      {tone === "live" && (
        <span className="relative inline-flex">
          <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-emerald-400 opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
        </span>
      )}
      {children}
    </span>
  );
}

export function TechBadge({ children }: { children: ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border border-[var(--color-line-strong)]",
        "bg-[var(--color-bg-3)]/70 px-2 py-1 text-[10.5px] font-medium tracking-wide",
        "text-[var(--color-ink-soft)] font-[family-name:var(--font-mono)]",
        "transition-colors hover:border-[var(--color-primary-glow)]/40 hover:text-[var(--color-primary-glow)]",
      )}
    >
      {children}
    </span>
  );
}
