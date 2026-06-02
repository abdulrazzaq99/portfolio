import { SectionWrapper } from "@/components/layout/section-wrapper";
import { SectionHeader } from "@/components/layout/section-header";
import { skillGroups } from "@/data/skills";

/**
 * Skills — brutalist 2x2 card grid. Each category is a numbered card with a
 * list of pill-shaped tech badges. No carousel: a static grid keeps the
 * section compact and removes scroll-snap fragility.
 */
export function Skills() {
  return (
    <SectionWrapper id="skills" containerSize="wide">
      <SectionHeader
        num="02"
        section="SECTION"
        keywords={["STACK", "TOOLKIT", "INDEX"]}
        title={{ left: "SKILLS", right: "STACK" }}
        subSpec={{
          num: "02",
          label: "STACK",
          meta: `${skillGroups.length} categories · ${skillGroups.reduce((n, g) => n + g.items.length, 0)} tools`,
        }}
      />

      <div className="grid gap-px overflow-hidden border border-[var(--color-line)] bg-[var(--color-line)] sm:grid-cols-2">
        {skillGroups.map((group, gi) => (
          <article
            key={group.id}
            className="relative bg-[var(--color-bg)] p-7 sm:p-8"
          >
            {/* Plus-mark register at top-right */}
            <span aria-hidden className="pointer-events-none absolute right-3 top-2 font-[family-name:var(--font-mono)] text-[10px] text-[var(--color-muted-2)]">
              +
            </span>
            <span aria-hidden className="pointer-events-none absolute bottom-2 left-3 font-[family-name:var(--font-mono)] text-[10px] text-[var(--color-muted-2)]">
              +
            </span>

            {/* Pagination + title */}
            <div className="mb-2 font-[family-name:var(--font-mono)] text-[10.5px] uppercase tracking-[0.22em] text-[var(--color-muted-2)]">
              <span className="text-[var(--color-primary-glow)]">
                {String(gi + 1).padStart(2, "0")}
              </span>
              <span className="mx-1.5 text-[var(--color-muted-2)]">/</span>
              <span>{String(skillGroups.length).padStart(2, "0")}</span>
            </div>
            <h3 className="text-[20px] font-semibold tracking-tight text-[var(--color-ink)]">
              {group.title}
            </h3>
            <p className="mt-1 max-w-[44ch] text-[13.5px] leading-relaxed text-[var(--color-muted)]">
              {group.blurb}
            </p>

            {/* Tech pills — numbered */}
            <ul className="mt-6 flex flex-wrap gap-1.5">
              {group.items.map((skill, i) => (
                <li
                  key={skill.name}
                  className="inline-flex items-baseline gap-2 border border-[var(--color-line-strong)] px-2.5 py-1.5 font-[family-name:var(--font-mono)] text-[11px] tracking-tight text-[var(--color-ink-soft)]"
                >
                  <span className="text-[10px] uppercase tracking-[0.18em] text-[var(--color-muted-2)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{skill.name}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </SectionWrapper>
  );
}
