import type { ReactNode } from "react";
import { Container } from "./container";
import { cn } from "@/lib/utils";

export function SectionWrapper({
  id,
  children,
  className,
  containerSize = "default",
  eyebrow,
  closingMark = true,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  containerSize?: "default" | "wide" | "narrow";
  eyebrow?: { num: string; label: string };
  /** Render a closing delimiter at the bottom of the section. Defaults true
   *  for sections with an eyebrow — pairs opening with closing for rhythm. */
  closingMark?: boolean;
}) {
  return (
    <section id={id} className={cn("relative scroll-mt-24 py-32 sm:py-44", className)}>
      <Container size={containerSize}>
        {eyebrow && (
          <div className="mb-10 flex items-center gap-3 font-[family-name:var(--font-mono)] text-[11px] tracking-[0.16em] text-[var(--color-muted)]">
            <span className="text-[var(--color-primary-glow)]">N°</span>
            <span className="text-[var(--color-ink)]">{eyebrow.num}</span>
            <span className="text-[var(--color-muted-2)]">—</span>
            <span className="uppercase">{eyebrow.label}</span>
            <span className="ml-2 inline-block h-px flex-1 max-w-[120px] bg-gradient-to-r from-[var(--color-line-strong)] to-transparent" />
          </div>
        )}

        {children}

        {eyebrow && closingMark && (
          <div
            aria-hidden
            className="mt-24 flex items-center gap-4 sm:mt-32"
          >
            <span className="h-px flex-1 bg-[var(--color-line)]" />
            <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.5em] text-[var(--color-muted-2)]">
              · · ·
            </span>
            <span className="h-px flex-1 bg-[var(--color-line)]" />
          </div>
        )}
      </Container>
    </section>
  );
}
