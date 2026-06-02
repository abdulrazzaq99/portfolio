/**
 * Brutalist-editorial section header.
 *
 *   01 — SECTION                                  KEYWORD · KEYWORD · INDEX
 *   ────────────────────────────────────────────────────────────────────────
 *
 *   ABOUT
 *                                                                      ME.
 *
 *   ──────────────────────────                                ● AVAILABLE
 *   N°01 PROFILE  ─── three principles · backend, slices, editor
 *
 * Used by every page section to give the site a single, repeatable structural
 * grammar. Hero is the only block that doesn't use it.
 */
export type SectionHeaderProps = {
  num: string;
  section: string;
  keywords?: string[];
  title: { left: string; right: string };
  subSpec?: { num?: string; label: string; meta: string };
  rightStatus?: string;
};

export function SectionHeader({
  num,
  section,
  keywords,
  title,
  subSpec,
  rightStatus,
}: SectionHeaderProps) {
  return (
    <header className="mb-16 sm:mb-20">
      {/* Top strip */}
      <div className="flex items-baseline justify-between font-[family-name:var(--font-mono)] text-[10.5px] uppercase tracking-[0.22em] text-[var(--color-muted)]">
        <span>
          <span className="text-[var(--color-primary-glow)]">{num}</span>
          <span className="mx-2 text-[var(--color-muted-2)]">—</span>
          <span>{section}</span>
        </span>
        {keywords && keywords.length > 0 && (
          <span className="hidden sm:inline">
            {keywords.map((k, i) => (
              <span key={k}>
                {i > 0 && <span className="mx-2 text-[var(--color-muted-2)]">·</span>}
                {k}
              </span>
            ))}
          </span>
        )}
      </div>

      {/* Top hairline */}
      <div aria-hidden className="mt-3 h-px w-full bg-[var(--color-primary-glow)]/60" />

      {/* Bicolor title */}
      <h2 className="mt-10 text-balance font-bold leading-[0.9] tracking-[-0.04em]">
        <span className="block text-[clamp(56px,10vw,144px)] text-[var(--color-ink)]">
          {title.left}
        </span>
        <span className="-mt-2 block text-right text-[clamp(56px,10vw,144px)] text-[var(--color-muted-2)] sm:-mt-4">
          {title.right}
          <span className="text-[var(--color-primary-glow)]">.</span>
        </span>
      </h2>

      {/* Bottom hairline + optional status */}
      <div className="mt-12 flex items-center justify-between gap-6">
        <span aria-hidden className="h-px w-full max-w-[40%] bg-[var(--color-primary-glow)]/60 sm:max-w-[50%]" />
        {rightStatus && (
          <span className="font-[family-name:var(--font-mono)] text-[10.5px] uppercase tracking-[0.22em] text-[var(--color-primary-glow)]">
            <span className="mr-2">●</span>
            {rightStatus}
          </span>
        )}
      </div>

      {/* Sub-spec strip */}
      {subSpec && (
        <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1 font-[family-name:var(--font-mono)] text-[10.5px] uppercase tracking-[0.22em] text-[var(--color-muted)]">
          {subSpec.num && (
            <>
              <span>
                <span className="text-[var(--color-muted-2)]">N°</span>
                {subSpec.num}
              </span>
              <span className="text-[var(--color-primary-glow)]">{subSpec.label}</span>
            </>
          )}
          {!subSpec.num && (
            <span className="text-[var(--color-primary-glow)]">{subSpec.label}</span>
          )}
          <span aria-hidden className="hidden h-px w-12 bg-[var(--color-line-strong)] sm:inline-block" />
          <span>{subSpec.meta}</span>
        </div>
      )}
    </header>
  );
}
