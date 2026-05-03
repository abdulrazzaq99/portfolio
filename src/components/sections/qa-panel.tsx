"use client";

import { useMemo, useState } from "react";
import { ArrowRight, MessageCircle, Sparkles } from "lucide-react";
import Link from "next/link";
import { SectionWrapper } from "@/components/layout/section-wrapper";
import { Reveal, RevealText } from "@/components/ui/reveal";
import { qa, type QA } from "@/data/qa";
import { personal } from "@/data/personal";
import { cn } from "@/lib/utils";

const CATEGORIES = ["All", "Work", "Stack", "Process", "Hiring"] as const;
type Cat = (typeof CATEGORIES)[number];

export function QAPanel() {
  const [active, setActive] = useState<QA | null>(qa[0] ?? null);
  const [filter, setFilter] = useState<Cat>("All");

  const list = useMemo(
    () => (filter === "All" ? qa : qa.filter((x) => x.category === filter)),
    [filter],
  );

  return (
    <SectionWrapper id="ask" eyebrow={{ num: "02b", label: "Ask me anything" }}>
      <div className="mb-12 flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
        <RevealText
          as="h2"
          text="Questions before we talk?"
          className="text-balance max-w-[16ch] text-[clamp(36px,5.6vw,76px)] font-medium leading-[0.98] tracking-[-0.035em]"
        />
        <Reveal delay={150} className="max-w-md">
          <p className="text-sm leading-relaxed text-[var(--color-muted)]">
            Pre-canned answers to the questions I get most. Pick a category, click a question, get a
            direct answer — no LLM in the loop, no hallucinations, just me on the record.
          </p>
        </Reveal>
      </div>

      {/* Category pills */}
      <div className="mb-8 flex flex-wrap gap-2">
        {CATEGORIES.map((c) => {
          const on = filter === c;
          const count = c === "All" ? qa.length : qa.filter((x) => x.category === c).length;
          return (
            <button
              key={c}
              type="button"
              onClick={() => setFilter(c)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[12.5px] font-medium tracking-tight transition-all",
                on
                  ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-bg)]"
                  : "border-[var(--color-line-strong)] bg-[var(--color-elevated)] text-[var(--color-ink-soft)] hover:border-[var(--color-ink)]",
              )}
            >
              {c}
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 font-[family-name:var(--font-mono)] text-[10px]",
                  on ? "bg-[var(--color-primary)] text-[var(--color-bg)]" : "bg-[var(--color-bg-3)] text-[var(--color-muted)]",
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-[0.95fr_1fr]">
        {/* Question list */}
        <div className="flex flex-col gap-2">
          {list.map((item) => {
            const on = active?.q === item.q;
            return (
              <button
                key={item.q}
                type="button"
                onClick={() => setActive(item)}
                className={cn(
                  "gradient-border group relative flex items-center gap-3 rounded-2xl px-4 py-3.5 text-left transition-all duration-300",
                  on
                    ? "bg-[var(--color-ink)] text-[var(--color-bg)] shadow-[0_20px_50px_-25px_oklch(0.46_0.108_158_/_0.50)]"
                    : "bg-[var(--color-elevated)] text-[var(--color-ink-soft)] hover:bg-[var(--color-elevated)]/80",
                )}
              >
                <span
                  className={cn(
                    "grid h-8 w-8 shrink-0 place-items-center rounded-full transition-colors",
                    on
                      ? "bg-[var(--color-primary)] text-[var(--color-bg)]"
                      : "bg-[var(--color-bg-3)] text-[var(--color-muted)] group-hover:text-[var(--color-primary)]",
                  )}
                >
                  <MessageCircle size={13} />
                </span>
                <span className="flex-1 text-[14px] font-medium leading-snug">{item.q}</span>
                <ArrowRight
                  size={14}
                  className={cn(
                    "shrink-0 transition-transform",
                    on ? "translate-x-0" : "-translate-x-1 opacity-50 group-hover:translate-x-0 group-hover:opacity-100",
                  )}
                />
              </button>
            );
          })}
        </div>

        {/* Answer card */}
        <article
          className="gradient-border relative flex flex-col overflow-hidden rounded-3xl bg-[var(--color-elevated)] p-6 backdrop-blur-md sm:p-8"
          aria-live="polite"
        >
          {/* Conversational header */}
          <header className="flex items-center gap-3 border-b border-[var(--color-line)] pb-4">
            <span className="relative grid h-10 w-10 place-items-center overflow-hidden rounded-full bg-[var(--color-ink)] font-[family-name:var(--font-mono)] text-[12px] font-semibold text-[var(--color-bg)]">
              <span
                aria-hidden
                className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)] via-transparent to-[var(--color-primary-glow)] opacity-50"
              />
              <span className="relative">{personal.initials}</span>
            </span>
            <div className="flex-1">
              <div className="text-[14px] font-semibold tracking-tight">{personal.name}</div>
              <div className="font-[family-name:var(--font-mono)] text-[10.5px] uppercase tracking-[0.16em] text-[var(--color-muted)]">
                <Sparkles size={9} className="mr-1 inline" />
                Direct from the source · curated answers
              </div>
            </div>
          </header>

          <div className="mt-5 flex-1" key={active?.q}>
            {active ? (
              <>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[var(--color-bg-3)] px-3 py-1 font-[family-name:var(--font-mono)] text-[10.5px] uppercase tracking-[0.18em] text-[var(--color-muted)]">
                  <span className="text-[var(--color-primary)]">▸</span> {active.category}
                </div>
                <h3 className="text-[20px] font-semibold leading-tight tracking-tight sm:text-[22px]">
                  {active.q}
                </h3>
                <p className="mt-4 text-[14.5px] leading-relaxed text-[var(--color-ink-soft)] sm:text-[15px]">
                  {active.a}
                </p>

                {active.cta && (
                  <Link
                    href={active.cta.href}
                    className="mt-6 inline-flex items-center gap-2 rounded-full border border-[var(--color-line-strong)] bg-[var(--color-bg)] px-4 py-2 text-[12.5px] font-medium tracking-tight transition-all hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                  >
                    {active.cta.label}
                    <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
                  </Link>
                )}
              </>
            ) : (
              <p className="font-[family-name:var(--font-mono)] text-[12px] text-[var(--color-muted)]">
                ↳ Pick a question to start
              </p>
            )}
          </div>

          <footer className="mt-6 flex items-center justify-between border-t border-[var(--color-line)] pt-4 font-[family-name:var(--font-mono)] text-[10.5px] uppercase tracking-[0.16em] text-[var(--color-muted)]">
            <span>Static · 0kb runtime · no LLM</span>
            <span>{qa.length} answers</span>
          </footer>
        </article>
      </div>
    </SectionWrapper>
  );
}
