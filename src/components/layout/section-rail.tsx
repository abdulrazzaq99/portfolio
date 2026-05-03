"use client";

import { useMemo } from "react";
import Link from "next/link";
import { sections } from "@/lib/sections";
import { useScrollSpy } from "@/hooks/use-scroll-spy";
import { cn } from "@/lib/utils";

/**
 * Floating right-edge section index — small vertical column of dots that
 * highlights the current section and lets you jump. Hidden on mobile (the
 * masthead handles wayfinding there). Only renders sections that exist as
 * anchors on the home page; deep routes (/work/[slug], /system, /notes/*)
 * don't show this.
 */
export function SectionRail() {
  const ids = useMemo(() => sections.map((s) => s.id), []);
  const active = useScrollSpy(ids);

  return (
    <nav
      aria-label="Section index"
      className="pointer-events-none fixed right-5 top-1/2 z-30 hidden -translate-y-1/2 lg:block xl:right-8"
    >
      <ul className="pointer-events-auto flex flex-col gap-3.5">
        {sections.map((s) => {
          const isActive = active === s.id;
          return (
            <li key={s.id} className="group relative flex items-center justify-end">
              {/* Tooltip — mono uppercase, slides in from right on hover */}
              <span
                className={cn(
                  "pointer-events-none absolute right-6 top-1/2 -translate-y-1/2 whitespace-nowrap",
                  "rounded-md border border-[var(--color-line-strong)] bg-[var(--color-bg-2)] px-2.5 py-1",
                  "font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.18em] text-[var(--color-ink-soft)]",
                  "translate-x-1 opacity-0 transition-all duration-200 ease-out",
                  "group-hover:translate-x-0 group-hover:opacity-100",
                )}
              >
                {s.label}
              </span>

              <Link
                href={`#${s.id}`}
                aria-label={`Jump to ${s.label}`}
                aria-current={isActive ? "true" : undefined}
                className="grid h-3 w-3 place-items-center"
              >
                <span
                  className={cn(
                    "block rounded-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                    isActive
                      ? "h-2 w-2 bg-[var(--color-primary-glow)]"
                      : "h-[5px] w-[5px] bg-[var(--color-muted-2)] group-hover:bg-[var(--color-ink-soft)] group-hover:scale-125",
                  )}
                  style={
                    isActive
                      ? { boxShadow: "0 0 8px oklch(0.86 0.27 152 / 0.6)" }
                      : undefined
                  }
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
