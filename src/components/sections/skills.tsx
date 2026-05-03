"use client";

import { useState } from "react";
import { Atom, Code2, Cpu, Server, Wrench } from "lucide-react";
import { SectionWrapper } from "@/components/layout/section-wrapper";
import { Reveal, RevealText } from "@/components/ui/reveal";
import { skillGroups, type Proficiency } from "@/data/skills";
import { cn } from "@/lib/utils";

const icons = {
  frontend: Code2,
  backend: Server,
  "ai-ml": Atom,
  tools: Wrench,
} as const;

const levelStyles: Record<Proficiency, string> = {
  Advanced: "bg-[var(--color-primary)] text-[var(--color-bg)]",
  Intermediate: "bg-[var(--color-primary-soft)] text-[var(--color-primary)]",
  Practical: "bg-[var(--color-bg-3)] text-[var(--color-muted)]",
};

export function Skills() {
  const [activeTab, setActiveTab] = useState(skillGroups[0].id);
  const active = skillGroups.find((g) => g.id === activeTab) ?? skillGroups[0];

  return (
    <SectionWrapper id="skills" eyebrow={{ num: "02", label: "Capabilities" }}>
      <div className="mb-14 flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
        <RevealText
          as="h2"
          text="The toolkit, plainly stated."
          className="text-balance max-w-[14ch] text-[clamp(36px,5.6vw,76px)] font-medium leading-[0.98] tracking-[-0.035em]"
        />
        <Reveal delay={150} className="max-w-md">
          <p className="text-sm leading-relaxed text-[var(--color-muted)]">
            Grouped by surface area, with honest proficiency labels. Advanced
            means I'd happily own architecture; Practical means I can ship
            confidently with documentation in reach.
          </p>
        </Reveal>
      </div>

      {/* Tabs */}
      <div className="mb-8 flex flex-wrap gap-2">
        {skillGroups.map((g) => {
          const Icon = icons[g.id as keyof typeof icons] ?? Cpu;
          const on = activeTab === g.id;
          return (
            <button
              key={g.id}
              type="button"
              onClick={() => setActiveTab(g.id)}
              className={cn(
                "group inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium tracking-tight transition-all duration-300",
                on
                  ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-bg)]"
                  : "border-[var(--color-line-strong)] bg-[var(--color-elevated)] text-[var(--color-ink-soft)] hover:border-[var(--color-ink)] hover:text-[var(--color-ink)]",
              )}
            >
              <Icon size={14} strokeWidth={2.25} />
              {g.title}
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 font-[family-name:var(--font-mono)] text-[10px]",
                  on ? "bg-[var(--color-primary)] text-[var(--color-bg)]" : "bg-[var(--color-bg-3)] text-[var(--color-muted)]",
                )}
              >
                {g.items.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active group */}
      <div key={active.id} className="grid gap-8 lg:grid-cols-[1fr_2fr]">
        <div className="opacity-0 [animation:fadeUp_0.6s_var(--ease-out)_forwards]">
          <p className="text-base leading-relaxed text-[var(--color-ink-soft)]">{active.blurb}</p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {active.items.map((skill, i) => (
            <article
              key={skill.name}
              className="group relative overflow-hidden rounded-2xl border border-[var(--color-line)] bg-[var(--color-elevated)]/60 p-5 backdrop-blur-md transition-all duration-500 hover:-translate-y-0.5 hover:border-[var(--color-primary)]/30 hover:shadow-lg"
              style={{ animation: `fadeUp 0.5s var(--ease-out) ${i * 50}ms both` }}
            >
              <div className="flex items-start justify-between">
                <h3 className="text-[15px] font-semibold tracking-tight">{skill.name}</h3>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 font-[family-name:var(--font-mono)] text-[9.5px] uppercase tracking-wider",
                    levelStyles[skill.level],
                  )}
                >
                  {skill.level}
                </span>
              </div>
              {skill.note && (
                <p className="mt-2 font-[family-name:var(--font-mono)] text-[11px] text-[var(--color-muted)]">
                  ↳ {skill.note}
                </p>
              )}
              <div
                className="mt-4 h-px w-full origin-left scale-x-0 bg-gradient-to-r from-[var(--color-primary)] to-transparent transition-transform duration-700 group-hover:scale-x-100"
                aria-hidden
              />
            </article>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </SectionWrapper>
  );
}
