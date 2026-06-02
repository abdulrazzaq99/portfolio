import { SectionWrapper } from "@/components/layout/section-wrapper";
import { SectionHeader } from "@/components/layout/section-header";
import { experiences } from "@/data/experience";

/**
 * Experience — outcome-indexed list. Each role is a row of mono metadata
 * (dates, org, location) followed by 3-4 outcome-focused bullets. No
 * timeline rail, no glass cards, no decorative dots.
 */
export function Experience() {
  return (
    <SectionWrapper id="experience" containerSize="wide">
      <SectionHeader
        num="04"
        section="SECTION"
        keywords={["EXPERIENCE", "TRACK", "INDEX"]}
        title={{ left: "EXPERIENCE", right: "TRACK" }}
        subSpec={{
          num: "04",
          label: "TRACK",
          meta: `${experiences.length} roles · ~3 years · remote-first`,
        }}
      />

      <ol className="divide-y divide-[var(--color-line)] border-y border-[var(--color-line-strong)]">
        {experiences.map((exp, i) => (
          <li key={`${exp.start}-${exp.org}`} className="grid gap-6 py-8 md:grid-cols-[60px_220px_1fr] md:gap-10 md:py-10">
            {/* N° */}
            <span className="font-[family-name:var(--font-mono)] text-[12px] uppercase tracking-[0.18em] text-[var(--color-muted-2)]">
              N°{String(i + 1).padStart(2, "0")}
            </span>

            {/* Date + org column */}
            <div className="space-y-1">
              <div className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.18em] text-[var(--color-muted)]">
                {exp.start} → {exp.end}
              </div>
              <div className="text-[15px] font-semibold tracking-tight text-[var(--color-ink)]">
                {exp.org}
              </div>
              <div className="font-[family-name:var(--font-mono)] text-[10.5px] uppercase tracking-[0.18em] text-[var(--color-muted-2)]">
                {exp.location}
              </div>
            </div>

            {/* Role + outcomes */}
            <div>
              <h3 className="text-[15px] font-medium tracking-tight text-[var(--color-ink-soft)]">
                {exp.role}
              </h3>
              <ul className="mt-3 space-y-2 text-[14px] leading-relaxed text-[var(--color-ink-soft)]">
                {exp.impact.map((line) => (
                  <li key={line} className="grid grid-cols-[16px_1fr] gap-2">
                    <span aria-hidden className="pt-2">
                      <span className="block h-px w-3 bg-[var(--color-muted-2)]" />
                    </span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </SectionWrapper>
  );
}
