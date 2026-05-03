"use client";

import { useEffect, useRef, useState } from "react";
import { Maximize2 } from "lucide-react";
import { projects } from "@/data/projects";
import { skillGroups } from "@/data/skills";
import { personal } from "@/data/personal";
import { cn } from "@/lib/utils";

type Step =
  | { kind: "input"; text: string; speed?: number }
  | { kind: "output"; text: string; mute?: boolean; accent?: boolean }
  | { kind: "wait"; ms: number };

/* Build the demo script from real portfolio data so it stays in sync as
   projects, skills, and personal info evolve. */

// Pad labels so the columns line up: "frontend  React · …", "backend   …".
// 10 chars: longest label is 8 ("frontend"), so all rows get >=2 trailing spaces.
const padLabel = (s: string) => s.padEnd(10, " ");

// Top 3 skills per group keeps each line short enough for the right-column terminal.
const skillsLine = (groupId: string, take = 5) => {
  const group = skillGroups.find((g) => g.id === groupId);
  if (!group) return "";
  return padLabel(groupId) + group.items.slice(0, take).map((s) => s.name).join(" · ");
};

// Show the 3 featured projects (the ones with deep case studies). Fall back
// to the most recent 3 by year if nothing is marked featured.
const featuredProjects = (() => {
  const featured = projects.filter((p) => p.featured);
  return (featured.length >= 3 ? featured : [...projects].sort((a, b) => b.year - a.year))
    .slice(0, 3);
})();
const remainingProjects = projects.length - featuredProjects.length;

// Compact tagline per project — pulled from the existing problem statement,
// trimmed to one short clause. Kept in this file because we don't want to add
// a UI-only field to the canonical Project type.
const projectTaglines: Record<string, string> = {
  "finalcircle":     "esports team finder · real-time",
  "capital-valley":  "founders meet investors · on-chain",
  "rag-healthcare":  "grounded medical Q&A · citations",
  "lead-genie":      "lead-gen workspace · Next.js",
  "stock-screener":  "equity filter · composable rules",
  "hate-speech":     "multi-model NLP · evaluation",
  "gesture-pong":    "computer-vision · webcam game",
  "pseudo-cpp":      "pseudocode → C++ · LLM hybrid",
};

const SCRIPT: Step[] = [
  { kind: "input", text: "whoami" },
  { kind: "wait", ms: 350 },
  {
    kind: "output",
    text: `${personal.name} — ${personal.role} (${personal.location.replace(", Pakistan", ", PK")})`,
    accent: true,
  },
  { kind: "wait", ms: 600 },

  { kind: "input", text: "skills --grouped" },
  { kind: "wait", ms: 280 },
  { kind: "output", text: skillsLine("frontend") },
  { kind: "output", text: skillsLine("backend") },
  { kind: "output", text: skillsLine("ai-ml") },
  { kind: "wait", ms: 700 },

  { kind: "input", text: "projects --recent" },
  { kind: "wait", ms: 280 },
  ...featuredProjects.map((p) => ({
    kind: "output" as const,
    text: `✓ ${p.name} — ${projectTaglines[p.slug] ?? `${p.category.toLowerCase()} · ${p.year}`}`,
  })),
  ...(remainingProjects > 0
    ? [
        {
          kind: "output" as const,
          text: `+ ${remainingProjects} more · run \`goto work\` to see all`,
          mute: true,
        },
      ]
    : []),
  { kind: "wait", ms: 800 },

  { kind: "input", text: "availability" },
  { kind: "wait", ms: 280 },
  { kind: "output", text: "○ Open for new work — 2026", accent: true },
  { kind: "wait", ms: 1400 },

  { kind: "input", text: "clear" },
  { kind: "wait", ms: 250 },
];

type RenderedLine =
  | { kind: "input"; text: string; typing?: boolean }
  | { kind: "output"; text: string; mute?: boolean; accent?: boolean };

export function EmbeddedTerminal({ onExpand }: { onExpand?: () => void }) {
  const [lines, setLines] = useState<RenderedLine[]>([]);
  const [stepIdx, setStepIdx] = useState(0);
  const [typedChars, setTypedChars] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Tick scheduler — runs the script
  useEffect(() => {
    const step = SCRIPT[stepIdx];
    if (!step) return;

    if (step.kind === "input") {
      if (typedChars === 0) {
        setLines((l) => [...l, { kind: "input", text: "", typing: true }]);
      }
      if (typedChars < step.text.length) {
        const t = setTimeout(() => {
          setLines((l) => {
            const next = l.slice();
            const last = next[next.length - 1];
            if (last && last.kind === "input") {
              next[next.length - 1] = { ...last, text: step.text.slice(0, typedChars + 1) };
            }
            return next;
          });
          setTypedChars((c) => c + 1);
        }, step.speed ?? 36 + Math.random() * 50);
        return () => clearTimeout(t);
      }
      // Finished typing — finalise the line and advance
      const t = setTimeout(() => {
        setLines((l) => {
          const next = l.slice();
          const last = next[next.length - 1];
          if (last && last.kind === "input") next[next.length - 1] = { ...last, typing: false };
          return next;
        });
        setTypedChars(0);
        setStepIdx((i) => i + 1);
      }, 100);
      return () => clearTimeout(t);
    }

    if (step.kind === "output") {
      const t = setTimeout(() => {
        setLines((l) => [...l, { kind: "output", text: step.text, mute: step.mute, accent: step.accent }]);
        setStepIdx((i) => i + 1);
      }, 60);
      return () => clearTimeout(t);
    }

    if (step.kind === "wait") {
      const t = setTimeout(() => setStepIdx((i) => i + 1), step.ms);
      return () => clearTimeout(t);
    }
  }, [stepIdx, typedChars]);

  // Reset / loop when script ends + handle `clear`
  useEffect(() => {
    if (stepIdx < SCRIPT.length) return;
    const t = setTimeout(() => {
      setLines([]);
      setStepIdx(0);
      setTypedChars(0);
    }, 200);
    return () => clearTimeout(t);
  }, [stepIdx]);

  // Auto-scroll
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  return (
    <div
      className={cn(
        "relative isolate flex h-full min-h-[340px] flex-col overflow-hidden rounded-2xl",
        "border border-[oklch(0.86_0.27_152_/_0.20)] bg-[var(--color-terminal)] text-[oklch(0.97_0.003_145)]",
        "shadow-[0_30px_80px_-30px_oklch(0.86_0.27_152_/_0.30),_0_1px_0_0_oklch(0.86_0.27_152_/_0.10)_inset,_0_0_0_1px_oklch(1_0_0_/_0.04)_inset]",
      )}
    >
      {/* Neon top glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-80"
        style={{
          background:
            "radial-gradient(ellipse 100% 50% at 50% 0%, oklch(0.86 0.27 152 / 0.22), transparent 60%), radial-gradient(ellipse 60% 40% at 100% 100%, oklch(0.62 0.165 156 / 0.25), transparent 65%)",
        }}
      />

      {/* Scanline texture */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, oklch(1 0 0 / 0.4) 0 1px, transparent 1px 3px)",
        }}
      />

      {/* Title bar */}
      <header className="flex items-center justify-between border-b border-[oklch(0.86_0.27_152_/_0.18)] bg-[oklch(0_0_0_/_0.3)] px-4 py-2.5">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[oklch(0.62_0.18_28)]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[oklch(0.78_0.14_78)]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[oklch(0.78_0.16_152)]" />
          <span className="ml-3 font-[family-name:var(--font-mono)] text-[10.5px] tracking-[0.16em] text-white/55">
            ar@portfolio:~
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-white/40 sm:inline">
            Live demo
          </span>
          <span className="relative flex items-center gap-1">
            <span className="absolute inline-block h-1.5 w-1.5 animate-ping rounded-full bg-[var(--color-primary-glow)] opacity-70" />
            <span className="relative inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-primary-glow)]" />
          </span>
          {onExpand && (
            <button
              type="button"
              onClick={onExpand}
              aria-label="Expand terminal"
              className="ml-1 rounded-md border border-white/10 px-1.5 py-1 text-white/60 transition-colors hover:border-[var(--color-primary-glow)]/40 hover:text-[var(--color-primary-glow)]"
            >
              <Maximize2 size={11} />
            </button>
          )}
        </div>
      </header>

      {/* Body */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-3 font-[family-name:var(--font-mono)] text-[12.5px] leading-[1.7]"
      >
        {lines.map((line, i) => {
          if (line.kind === "input") {
            return (
              <div key={i} className="flex gap-2">
                <span
                  className="text-[var(--color-primary-neon)]"
                  style={{ textShadow: "0 0 8px oklch(0.86 0.27 152 / 0.6)" }}
                >
                  ›
                </span>
                <span className="text-white/95">
                  {line.text}
                  {line.typing && (
                    <span
                      className="ml-0.5 inline-block h-3.5 w-1.5 animate-[blink_1s_steps(2)_infinite] bg-[var(--color-primary-neon)] align-middle"
                      style={{ boxShadow: "0 0 10px oklch(0.86 0.27 152 / 0.7)" }}
                    />
                  )}
                </span>
              </div>
            );
          }
          return (
            <div
              key={i}
              className={cn(
                "pl-4",
                line.mute && "text-white/40",
                line.accent && "text-[var(--color-primary-neon)]",
                !line.mute && !line.accent && "text-white/85",
              )}
              style={line.accent ? { textShadow: "0 0 10px oklch(0.86 0.27 152 / 0.4)" } : undefined}
            >
              {line.text}
            </div>
          );
        })}
      </div>

      {/* Footer hint */}
      <footer className="flex items-center justify-between border-t border-white/10 px-4 py-2 font-[family-name:var(--font-mono)] text-[10.5px] text-white/45">
        <span>↳ Press <kbd className="mx-1 rounded border border-white/15 bg-white/5 px-1.5 py-0.5 text-[10px]">⌘K</kbd> for the full shell</span>
        <span className="hidden sm:inline">{lines.length} lines · auto-loop</span>
      </footer>

      <style>{`@keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }`}</style>
    </div>
  );
}
