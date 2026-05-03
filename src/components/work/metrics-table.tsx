import type { Project } from "@/data/projects";

export function MetricsTable({ metrics }: { metrics: NonNullable<Project["metrics"]> }) {
  if (!metrics?.length) return null;

  return (
    <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-bg-2)]/60 overflow-hidden">
      <table className="w-full text-left">
        <thead className="border-b border-[var(--color-line)]">
          <tr>
            <th scope="col" className="px-5 py-3 font-[family-name:var(--font-mono)] text-[10.5px] uppercase tracking-[0.18em] text-[var(--color-muted)]">
              Metric
            </th>
            <th scope="col" className="px-5 py-3 font-[family-name:var(--font-mono)] text-[10.5px] uppercase tracking-[0.18em] text-[var(--color-muted)]">
              Value
            </th>
            <th scope="col" className="hidden px-5 py-3 font-[family-name:var(--font-mono)] text-[10.5px] uppercase tracking-[0.18em] text-[var(--color-muted)] sm:table-cell">
              Note
            </th>
          </tr>
        </thead>
        <tbody>
          {metrics.map((m, i) => (
            <tr key={m.label} className={i > 0 ? "border-t border-[var(--color-line)]" : ""}>
              <th scope="row" className="px-5 py-4 align-top text-[14px] font-medium text-[var(--color-ink)]">
                {m.label}
              </th>
              <td className="px-5 py-4 align-top font-[family-name:var(--font-mono)] text-[15px] tabular-nums text-[var(--color-primary-glow)]">
                {m.value}
              </td>
              <td className="hidden px-5 py-4 align-top text-[13px] leading-relaxed text-[var(--color-muted)] sm:table-cell">
                {m.note ?? ""}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
