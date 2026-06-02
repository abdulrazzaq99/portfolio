"use client";

import { useEffect, useState } from "react";

/**
 * Live PKT clock — updates every 30s. Used in the navbar status block.
 * Returns a string like `01:34 PKT · ON-HOURS` (Mon-Sat 09–22 PKT).
 */
function getPktState() {
  // Build a Date in Asia/Karachi by formatting the wall clock there.
  const fmt = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Karachi",
    hour: "2-digit",
    minute: "2-digit",
    weekday: "short",
    hour12: false,
  });
  const parts = fmt.formatToParts(new Date());
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? "0");
  const minute = parts.find((p) => p.type === "minute")?.value ?? "00";
  const weekday = parts.find((p) => p.type === "weekday")?.value ?? "Mon";
  const isWeekend = weekday === "Sun";
  const onHours = !isWeekend && hour >= 9 && hour < 22;
  return {
    time: `${String(hour).padStart(2, "0")}:${minute}`,
    label: onHours ? "ON-HOURS" : "OFF-HOURS",
    onHours,
  };
}

export function LiveClock() {
  const [state, setState] = useState(() => getPktState());
  useEffect(() => {
    const tick = () => setState(getPktState());
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, []);
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="font-medium text-[var(--color-ink-soft)]">{state.time}</span>
      <span className="text-[var(--color-muted-2)]">PKT</span>
      <span aria-hidden className="text-[var(--color-muted-2)]">·</span>
      <span className={state.onHours ? "text-[var(--color-primary-glow)]" : "text-[var(--color-muted-2)]"}>
        {state.label}
      </span>
    </span>
  );
}

/**
 * Section counter — `▸ SECTION 0X / 0N`. `index` is 1-indexed; 0 means hero.
 */
export function SectionCounter({ index, total }: { index: number; total: number }) {
  const display = index <= 0 ? "00" : String(index).padStart(2, "0");
  const totalDisplay = String(total).padStart(2, "0");
  return (
    <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-muted)]">
      <span aria-hidden className="mr-1.5 text-[var(--color-primary-glow)]">▸</span>
      <span>SECTION </span>
      <span className="text-[var(--color-ink)]">{display}</span>
      <span className="mx-1 text-[var(--color-muted-2)]">/</span>
      <span>{totalDisplay}</span>
    </span>
  );
}
