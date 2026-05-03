import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/layout/container";
import type { NoteMeta } from "@/content/notes";

/**
 * Layout shell for a single essay. Editorial: ~70ch reading column,
 * Instrument Serif h1, Geist Sans body. No glass, no ambient orbs —
 * matches the rest of the site's editorial direction.
 */
export function NoteShell({ meta, children }: { meta: NoteMeta; children: ReactNode }) {
  const dateLabel = new Date(meta.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="relative pt-32 pb-32 sm:pt-40 sm:pb-44">
      <Container size="narrow">
        {/* Back link */}
        <nav aria-label="Breadcrumb" className="mb-10">
          <Link
            href="/notes"
            className="inline-flex items-center gap-2 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.18em] text-[var(--color-muted)] transition-colors hover:text-[var(--color-primary-glow)]"
          >
            <ArrowLeft size={12} />
            All notes
          </Link>
        </nav>

        {/* Eyebrow */}
        <div className="mb-6 flex items-center gap-3 font-[family-name:var(--font-mono)] text-[11px] tracking-[0.16em] text-[var(--color-muted)]">
          <span className="text-[var(--color-primary-glow)]">N°</span>
          <span className="text-[var(--color-ink)]">05</span>
          <span className="text-[var(--color-muted-2)]">—</span>
          <span className="uppercase">Notes · Essay</span>
          {meta.status === "draft" && (
            <span className="rounded border border-[var(--color-line-strong)] px-1.5 py-0.5 text-[var(--color-muted-2)]">
              draft
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="text-balance font-[family-name:var(--font-display)] text-[clamp(40px,6vw,84px)] font-normal leading-[1.02] tracking-[-0.02em] text-[var(--color-ink)]">
          {meta.title}
          <span
            className="text-[var(--color-primary-glow)]"
            style={{ textShadow: "0 0 16px oklch(0.86 0.27 152 / 0.5)" }}
          >.</span>
        </h1>

        {/* Dek */}
        <p className="mt-6 max-w-[60ch] text-[17px] leading-[1.6] text-[var(--color-ink-soft)] sm:text-[18px]">
          {meta.dek}
        </p>

        {/* Meta strip */}
        <div className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-2 border-y border-[var(--color-line)] py-4 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.18em] text-[var(--color-muted)]">
          <span>{dateLabel}</span>
          <span aria-hidden className="text-[var(--color-muted-2)]">·</span>
          <span>{meta.readTime} read</span>
          <span aria-hidden className="text-[var(--color-muted-2)]">·</span>
          <span>Abdul Razzaq</span>
        </div>

        {/* Body */}
        <div className="prose-readable mt-12 max-w-[68ch]">{children}</div>
      </Container>
    </article>
  );
}
