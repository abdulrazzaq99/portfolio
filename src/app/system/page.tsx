import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { parseTokens } from "@/lib/system/parse-tokens";
import { TokenSwatch } from "@/components/system/token-swatch";
import { TypeScale } from "@/components/system/type-scale";
import { ComponentGallery } from "@/components/system/component-gallery";
import { EffectShowcase } from "@/components/system/effect-showcase";
import { DecisionsLog } from "@/components/system/decisions-log";

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
          <span className="text-[var(--color-primary-glow)]">N°</span>
          <span className="text-[var(--color-ink)]">06</span>
          <span className="text-[var(--color-muted-2)]">—</span>
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
