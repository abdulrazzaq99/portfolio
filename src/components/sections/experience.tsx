import { SectionWrapper } from "@/components/layout/section-wrapper";
import { Reveal, RevealText } from "@/components/ui/reveal";
import { experiences } from "@/data/experience";
import { MapPin } from "lucide-react";

export function Experience() {
  return (
    <SectionWrapper id="experience" eyebrow={{ num: "03", label: "Experience" }}>
      <div className="mb-14 flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
        <RevealText
          as="h2"
          text="Two years, well spent."
          className="text-balance text-[clamp(40px,6vw,86px)] font-medium leading-[0.98] tracking-[-0.04em]"
        />
        <Reveal delay={150}>
          <p className="max-w-md text-sm leading-relaxed text-[var(--color-muted)]">
            A short timeline, written for impact rather than responsibility.
            What changed because the work shipped, not what the work was.
          </p>
        </Reveal>
      </div>

      <ol className="relative">
        <span
          className="absolute left-4 top-2 bottom-2 w-px bg-gradient-to-b from-[var(--color-primary)]/40 via-[var(--color-line-strong)] to-transparent sm:left-[148px]"
          aria-hidden
        />
        {experiences.map((exp, i) => (
          <Reveal key={`${exp.start}-${exp.org}`} delay={i * 80}>
            <li className="group relative grid gap-4 pb-12 last:pb-0 sm:grid-cols-[160px_1fr]">
              {/* Year */}
              <div className="relative pl-12 sm:pl-0">
                <span className="font-[family-name:var(--font-mono)] text-[12px] uppercase tracking-[0.16em] text-[var(--color-muted)]">
                  {exp.start} → {exp.end}
                </span>

                {/* Dot */}
                <span
                  className="absolute left-4 top-1.5 grid h-3 w-3 -translate-x-1/2 place-items-center sm:left-[148px]"
                  aria-hidden
                >
                  <span className="absolute inline-block h-3 w-3 rounded-full bg-[var(--color-primary)]/15 transition-transform duration-700 group-hover:scale-150" />
                  <span className="relative inline-block h-2 w-2 rounded-full bg-[var(--color-primary)] ring-4 ring-[var(--color-bg)]" />
                </span>
              </div>

              {/* Body */}
              <div className="rounded-2xl border border-transparent p-1 transition-colors duration-500 group-hover:border-[var(--color-line)] group-hover:bg-[var(--color-elevated)]/50 sm:p-5 sm:pl-8">
                <h3 className="text-xl font-semibold tracking-tight sm:text-2xl">{exp.role}</h3>
                <div className="mt-1 flex flex-wrap items-center gap-3 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.14em] text-[var(--color-muted)]">
                  <span className="text-[var(--color-primary)]">{exp.org}</span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin size={11} /> {exp.location}
                  </span>
                </div>
                <ul className="mt-4 space-y-2 text-[14px] leading-relaxed text-[var(--color-ink-soft)]">
                  {exp.impact.map((line) => (
                    <li key={line} className="flex gap-2">
                      <span className="mt-1 inline-block h-1 w-3 shrink-0 rounded-full bg-[var(--color-primary)]/60" aria-hidden />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          </Reveal>
        ))}
      </ol>
    </SectionWrapper>
  );
}
