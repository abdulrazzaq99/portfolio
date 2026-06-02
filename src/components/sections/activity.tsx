import { SectionWrapper } from "@/components/layout/section-wrapper";
import { SectionHeader } from "@/components/layout/section-header";
import contributions from "@/data/contributions.json";

type Weeks = number[][];

const data = contributions as { total: number; weeks: Weeks; lastDate: string };

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function bucket(v: number) {
  if (v <= 0) return 0;
  if (v <= 2) return 1;
  if (v <= 5) return 2;
  if (v <= 9) return 3;
  return 4;
}

function computeStats(weeks: Weeks) {
  const flat: number[] = [];
  for (const w of weeks) for (const d of w) flat.push(d);

  const total = flat.reduce((n, v) => n + v, 0);
  const daysActive = flat.filter((v) => v > 0).length;

  let longest = 0;
  let cur = 0;
  for (const v of flat) {
    if (v > 0) {
      cur += 1;
      if (cur > longest) longest = cur;
    } else {
      cur = 0;
    }
  }

  const best = flat.reduce((m, v) => (v > m ? v : m), 0);
  return { total, daysActive, longest, best };
}

function monthOffsets(weeks: Weeks, lastDateIso: string) {
  // Each week column represents the week containing its Sunday.
  // Compute the date of the first day of each column, then mark the first
  // column where the month transitions.
  const lastDate = new Date(lastDateIso + "T00:00:00Z");
  // The data is week-aligned starting Sunday; last column may be partial.
  // Walk back from lastDate to align.
  const lastDay = lastDate.getUTCDay(); // 0 = Sun
  // Find the Sunday of the last column.
  const lastSunday = new Date(lastDate);
  lastSunday.setUTCDate(lastDate.getUTCDate() - lastDay);

  const labels: { col: number; month: string }[] = [];
  let prevMonth = -1;
  let lastLabelCol = -10;
  for (let i = 0; i < weeks.length; i += 1) {
    const colSunday = new Date(lastSunday);
    colSunday.setUTCDate(lastSunday.getUTCDate() - (weeks.length - 1 - i) * 7);
    const m = colSunday.getUTCMonth();
    if (m !== prevMonth) {
      // Skip labels that would collide with the previous label (< 3 cols apart).
      if (i - lastLabelCol >= 3) {
        labels.push({ col: i, month: MONTH_LABELS[m] });
        lastLabelCol = i;
      }
      prevMonth = m;
    }
  }
  return labels;
}

const cellClass: Record<number, string> = {
  0: "bg-[var(--color-bg-2)]",
  1: "bg-[var(--color-primary-glow)]/20",
  2: "bg-[var(--color-primary-glow)]/40",
  3: "bg-[var(--color-primary-glow)]/65",
  4: "bg-[var(--color-primary-glow)]",
};

export function Activity() {
  const stats = computeStats(data.weeks);
  const months = monthOffsets(data.weeks, data.lastDate);

  return (
    <SectionWrapper id="activity" containerSize="wide">
      <SectionHeader
        num="05"
        section="SECTION"
        keywords={["ACTIVITY", "GITHUB", "INDEX"]}
        title={{ left: "DAYS I", right: "CODE" }}
        rightStatus="LIVE"
        subSpec={{
          num: "05",
          label: "ACTIVITY",
          meta: `${stats.total.toLocaleString()} contributions · last 12 months · @abdulrazzaq99`,
        }}
      />

      {/* Stat row */}
      <div className="mb-8 flex flex-wrap gap-1.5">
        <Stat label="Total" value={stats.total.toLocaleString()} />
        <Stat label="Days Active" value={stats.daysActive.toString()} />
        <Stat label="Longest Streak" value={`${stats.longest}d`} />
        <Stat label="Best Day" value={stats.best.toString()} />
      </div>

      {/* Heatmap card */}
      <div className="relative border border-[var(--color-line)] bg-[var(--color-bg)] p-5 sm:p-7">
        {/* Plus marks */}
        <span aria-hidden className="pointer-events-none absolute right-3 top-2 font-[family-name:var(--font-mono)] text-[10px] text-[var(--color-muted-2)]">+</span>
        <span aria-hidden className="pointer-events-none absolute bottom-2 left-3 font-[family-name:var(--font-mono)] text-[10px] text-[var(--color-muted-2)]">+</span>

        {/* Top strip */}
        <div className="mb-4 flex items-center justify-between font-[family-name:var(--font-mono)] text-[10.5px] uppercase tracking-[0.22em] text-[var(--color-muted)]">
          <span>
            <span className="text-[var(--color-primary-glow)]">●</span>
            <span className="ml-2">PLATE · HEAT</span>
          </span>
          <span>{data.lastDate}</span>
        </div>

        {/* Scroll container so narrow viewports don't cramp the cells */}
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full">
            {/* Month labels */}
            <div
              className="ml-8 grid font-[family-name:var(--font-mono)] text-[9.5px] uppercase tracking-[0.18em] text-[var(--color-muted-2)]"
              style={{ gridTemplateColumns: `repeat(${data.weeks.length}, 1fr)` }}
            >
              {Array.from({ length: data.weeks.length }).map((_, i) => {
                const m = months.find((x) => x.col === i);
                return (
                  <span
                    key={i}
                    className="h-3"
                    style={{ gridColumn: `${i + 1} / span 1` }}
                  >
                    {m?.month ?? ""}
                  </span>
                );
              })}
            </div>

            {/* Grid + day labels */}
            <div className="mt-1 grid grid-cols-[28px_1fr] gap-1">
              <div className="flex flex-col justify-between py-0.5 font-[family-name:var(--font-mono)] text-[9.5px] uppercase tracking-[0.18em] text-[var(--color-muted-2)]">
                <span>Mon</span>
                <span>Wed</span>
                <span>Fri</span>
              </div>
              <div
                className="grid gap-[3px]"
                style={{ gridTemplateColumns: `repeat(${data.weeks.length}, 1fr)` }}
              >
                {data.weeks.map((week, wi) => (
                  <div
                    key={wi}
                    className="grid gap-[3px]"
                    style={{ gridTemplateRows: "repeat(7, 10px)" }}
                  >
                    {Array.from({ length: 7 }).map((_, di) => {
                      const v = week[di] ?? 0;
                      return (
                        <span
                          key={di}
                          aria-label={`${v} contributions`}
                          title={`${v} contributions`}
                          className={`block w-full rounded-[2px] ${cellClass[bucket(v)]}`}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-5 flex items-center justify-between font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-muted-2)]">
          <a
            href="https://github.com/abdulrazzaq99"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-muted)] transition-colors hover:text-[var(--color-primary-glow)]"
          >
            View on GitHub ↗
          </a>
          <span className="inline-flex items-center gap-1.5">
            <span>Less</span>
            {[0, 1, 2, 3, 4].map((b) => (
              <span key={b} className={`block h-[10px] w-[10px] rounded-[2px] ${cellClass[b]}`} />
            ))}
            <span>More</span>
          </span>
        </div>
      </div>
    </SectionWrapper>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex items-baseline gap-2 border border-[var(--color-line-strong)] px-3 py-1.5 font-[family-name:var(--font-mono)] text-[11px] tracking-tight text-[var(--color-ink-soft)]">
      <span className="text-[10px] uppercase tracking-[0.22em] text-[var(--color-muted)]">
        {label}
      </span>
      <span className="font-semibold text-[var(--color-ink)]">{value}</span>
    </span>
  );
}
