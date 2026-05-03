"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

type Sample = {
  /** Display label, e.g. "Display 96" */
  label: string;
  /** Tailwind v4 class string used in the codebase */
  className: string;
  /** Sample text to render */
  text: string;
  /** "sans" or "mono" — drives font-family inline */
  family: "sans" | "mono";
};

const SAMPLES: Sample[] = [
  { label: "Display 96",  className: "text-[96px] font-medium leading-[0.94] tracking-[-0.04em]", text: "Engineering systems",                 family: "sans" },
  { label: "Display 64",  className: "text-[64px] font-medium leading-[0.98] tracking-[-0.04em]", text: "Recent obsessions.",                   family: "sans" },
  { label: "H1 48",       className: "text-[48px] font-medium leading-[1.05] tracking-[-0.03em]", text: "I treat the browser like a stage.",    family: "sans" },
  { label: "H2 32",       className: "text-[32px] font-medium tracking-tight",                    text: "FinalCircle.",                         family: "sans" },
  { label: "H3 22",       className: "text-[22px] font-semibold tracking-tight",                  text: "Engineering highlights",               family: "sans" },
  { label: "Body 17",     className: "text-[17px] leading-relaxed",                               text: "I build full-stack applications with a backend instinct — Django and Node on the server.", family: "sans" },
  { label: "Body 15",     className: "text-[15px] leading-relaxed",                               text: "A small set of projects from the last 24 months — full-stack apps, dashboards.",          family: "sans" },
  { label: "Small 13",    className: "text-[13px]",                                               text: "Engineering · Thinking",               family: "sans" },
  { label: "Mono 12",     className: "text-[12px] tracking-[0.16em] uppercase",                   text: "$ cat /etc/abdul.profile",             family: "mono" },
  { label: "Mono 10.5",   className: "text-[10.5px] uppercase tracking-[0.18em]",                 text: "// 01 · ABOUT",                        family: "mono" },
];

export function TypeScale() {
  const [copied, setCopied] = useState<string | null>(null);

  const onCopy = async (cls: string) => {
    await navigator.clipboard.writeText(cls);
    setCopied(cls);
    setTimeout(() => setCopied((c) => (c === cls ? null : c)), 1200);
  };

  return (
    <ul className="flex flex-col divide-y divide-[var(--color-line)]">
      {SAMPLES.map((s) => (
        <li key={s.label} className="flex flex-col gap-2 py-6 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
          <div className="min-w-0 flex-1">
            <span
              className={cn(
                s.className,
                s.family === "mono" ? "font-[family-name:var(--font-mono)]" : "",
                "block truncate text-[var(--color-ink)]",
              )}
            >
              {s.text}
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <span className="font-[family-name:var(--font-mono)] text-[10.5px] uppercase tracking-[0.16em] text-[var(--color-muted)]">
              {s.label}
            </span>
            <button
              type="button"
              onClick={() => onCopy(s.className)}
              className="inline-flex items-center gap-1.5 rounded-md border border-[var(--color-line-strong)] bg-[var(--color-bg-3)] px-2 py-1 font-[family-name:var(--font-mono)] text-[10px] text-[var(--color-ink-soft)] transition-colors hover:border-[var(--color-primary-glow)] hover:text-[var(--color-primary-glow)]"
              aria-label={`Copy class string for ${s.label}`}
            >
              {copied === s.className ? <Check size={10} /> : <Copy size={10} />}
              copy class
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
