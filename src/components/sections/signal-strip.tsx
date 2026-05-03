import { Container } from "@/components/layout/container";
import contributions from "@/data/contributions.json";

/**
 * SignalStrip — a quiet single-row strip between Hero and About.
 *
 * Two cells: GitHub contribution heatmap (last 18 weeks) on the left,
 * year contribution count on the right. The Karachi clock that used
 * to live here was redundant — UTC+5 already appears in the navbar
 * subtitle and hero status line.
 */
export function SignalStrip() {
  return (
    <section
      id="signal"
      className="relative scroll-mt-24 border-y border-[var(--color-line)] py-10 sm:py-14"
    >
      <Container>
        <div className="mb-6 flex items-center gap-3 font-[family-name:var(--font-mono)] text-[11px] tracking-[0.16em] text-[var(--color-muted)]">
          <span
            className="text-[var(--color-primary-glow)]"
            style={{ textShadow: "0 0 10px oklch(0.86 0.27 152 / 0.45)" }}
          >
            //
          </span>
          <span className="uppercase">Signal · live data</span>
          <span className="ml-2 inline-block h-px flex-1 max-w-[120px] bg-gradient-to-r from-[var(--color-line-strong)] to-transparent" />
        </div>

        <div className="grid items-center gap-8 md:grid-cols-[1fr_auto] md:gap-12">
          <Heatmap />
          <YearTotal />
        </div>
      </Container>
    </section>
  );
}

function YearTotal() {
  const total = (contributions as { total: number }).total;
  return (
    <div className="flex flex-col gap-1 md:items-end">
      <span className="font-[family-name:var(--font-mono)] text-[10.5px] uppercase tracking-[0.18em] text-[var(--color-muted)]">
        Last 12 months
      </span>
      <span className="font-[family-name:var(--font-mono)] text-[28px] font-medium tabular-nums tracking-tight text-[var(--color-primary-glow)]">
        {total}
      </span>
      <span className="font-[family-name:var(--font-mono)] text-[10.5px] uppercase tracking-[0.18em] text-[var(--color-muted-2)]">
        commits
      </span>
    </div>
  );
}

function Heatmap() {
  const allWeeks = (contributions as { weeks: number[][] }).weeks;
  const recent = allWeeks.slice(-18);
  const max = Math.max(1, ...recent.flat());

  const bucket = (n: number) => {
    if (n <= 0) return 0;
    const r = n / max;
    if (r > 0.66) return 4;
    if (r > 0.33) return 3;
    if (r > 0.10) return 2;
    return 1;
  };

  const colour = (n: number) => {
    if (n === 0) return "oklch(1 0 0 / 0.045)";
    if (n === 1) return "oklch(0.62 0.165 156 / 0.30)";
    if (n === 2) return "oklch(0.72 0.20 154 / 0.55)";
    if (n === 3) return "oklch(0.80 0.24 152 / 0.80)";
    return "oklch(0.86 0.27 152 / 1.0)";
  };

  return (
    <div
      className="grid auto-rows-fr grid-cols-[repeat(18,minmax(0,1fr))] gap-[3px]"
      role="img"
      aria-label="GitHub contribution heatmap, last 18 weeks"
    >
      {Array.from({ length: 7 }).flatMap((_, dayIdx) =>
        recent.map((week, weekIdx) => {
          const count = week[dayIdx] ?? 0;
          return (
            <span
              key={`${dayIdx}-${weekIdx}`}
              className="aspect-square rounded-[3px]"
              style={{
                backgroundColor: colour(bucket(count)),
                gridColumn: weekIdx + 1,
                gridRow: dayIdx + 1,
              }}
              aria-hidden
            />
          );
        }),
      )}
    </div>
  );
}
