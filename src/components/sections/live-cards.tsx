"use client";

import { useEffect, useState } from "react";
import { Activity, Clock, Github, MapPin, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────────────────
   Live clock + location
   ───────────────────────────────────────────────────────── */
export function LiveClockCard() {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const utc = now.getTime() + now.getTimezoneOffset() * 60000;
      const pkt = new Date(utc + 5 * 3600000);
      const fmt = (n: number) => String(n).padStart(2, "0");
      setTime(`${fmt(pkt.getHours())}:${fmt(pkt.getMinutes())}:${fmt(pkt.getSeconds())}`);
      setDate(
        pkt.toLocaleDateString("en-US", {
          weekday: "short",
          day: "numeric",
          month: "short",
        }),
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <BentoCard accent="primary" className="relative flex flex-col justify-between p-5">
      <div className="flex items-start justify-between">
        <Eyebrow icon={MapPin}>Location</Eyebrow>
        <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-[var(--color-muted)]">
          UTC+5
        </span>
      </div>
      <div className="mt-4">
        <div className="font-[family-name:var(--font-mono)] text-3xl font-medium tracking-tight tabular-nums">
          {time || "—"}
        </div>
        <div className="mt-1 text-[12px] text-[var(--color-muted)]">{date} · Karachi, PK</div>
      </div>
      <div className="mt-3 flex items-center gap-2 font-[family-name:var(--font-mono)] text-[10.5px] uppercase tracking-widest text-[var(--color-muted)]">
        <span className="inline-block h-1 w-6 rounded-full bg-gradient-to-r from-[var(--color-primary)] to-transparent" />
        24.86°N · 67.01°E
      </div>
    </BentoCard>
  );
}

/* ─────────────────────────────────────────────────────────
   Currently building / coding
   ───────────────────────────────────────────────────────── */
const BUILDING = [
  { repo: "atelier-commerce", branch: "feat/checkout-v2", note: "Refining Stripe Element states" },
  { repo: "nimbus-dashboard", branch: "perf/canvas",      note: "60fps with 50k data points" },
  { repo: "portfolio-next",   branch: "main",             note: "Ship v1 to Vercel" },
];

export function CurrentlyBuildingCard() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIdx((v) => (v + 1) % BUILDING.length), 4500);
    return () => clearInterval(id);
  }, []);
  const item = BUILDING[idx];

  return (
    <BentoCard className="flex h-full flex-col justify-between overflow-hidden p-5">
      <div className="flex items-start justify-between">
        <Eyebrow icon={Wrench}>Currently building</Eyebrow>
        <span className="relative flex items-center gap-1.5">
          <span className="absolute inline-block h-2 w-2 animate-ping rounded-full bg-[var(--color-primary-glow)] opacity-60" />
          <span className="relative inline-block h-2 w-2 rounded-full bg-[var(--color-primary-glow)]" />
          <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-[var(--color-primary)]">live</span>
        </span>
      </div>

      <div className="mt-4" key={item.repo}>
        <div className="font-[family-name:var(--font-mono)] text-[12px] text-[var(--color-muted)]">
          ↳ {item.branch}
        </div>
        <div className="mt-1 text-[20px] font-semibold leading-tight tracking-tight">
          {item.repo}
        </div>
        <p className="mt-2 text-[13px] leading-relaxed text-[var(--color-ink-soft)]">
          {item.note}
        </p>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <div className="flex h-1 flex-1 overflow-hidden rounded-full bg-[var(--color-bg-3)]">
          {BUILDING.map((_, i) => (
            <span
              key={i}
              className={cn(
                "h-full flex-1 transition-all duration-700",
                i === idx ? "bg-[var(--color-primary)]" : i < idx ? "bg-[var(--color-primary)]/40" : "bg-transparent",
              )}
            />
          ))}
        </div>
      </div>
    </BentoCard>
  );
}

/* ─────────────────────────────────────────────────────────
   Activity grid — real GitHub contribution data
   ───────────────────────────────────────────────────────── */
import contributions from "@/data/contributions.json";

export function ActivityCard() {
  // Show last 18 weeks (most recent), weekday-ordered. Data is week-rows × 7-days.
  const allWeeks = contributions.weeks as number[][];
  const recent = allWeeks.slice(-18);

  // Highest per-bucket scaling for colour intensity
  const max = Math.max(1, ...recent.flat());
  const bucket = (n: number) => {
    if (n <= 0) return 0;
    const r = n / max;
    if (r > 0.66) return 4;
    if (r > 0.33) return 3;
    if (r > 0.10) return 2;
    return 1;
  };

  const colour = (n: number) => {
    if (n === 0) return "oklch(1 0 0 / 0.045)";
    if (n === 1) return "oklch(0.62 0.165 156 / 0.30)";
    if (n === 2) return "oklch(0.72 0.20 154 / 0.55)";
    if (n === 3) return "oklch(0.80 0.24 152 / 0.80)";
    return "oklch(0.86 0.27 152 / 1.0)";
  };

  const total = contributions.total;

  return (
    <BentoCard className="flex h-full flex-col p-5">
      <div className="flex items-start justify-between">
        <Eyebrow icon={Activity}>Last 18 weeks · live</Eyebrow>
        <span className="inline-flex items-center gap-1.5 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-[var(--color-muted)]">
          <Github size={11} /> {total} / yr
        </span>
      </div>

      <div className="mt-4 grid flex-1 auto-rows-fr grid-cols-[repeat(18,minmax(0,1fr))] gap-[3px]">
        {/* render 7 rows × 18 cols = transposed from week-major */}
        {Array.from({ length: 7 }).flatMap((_, dayIdx) =>
          recent.map((week, weekIdx) => {
            const count = week[dayIdx] ?? 0;
            return (
              <span
                key={`${dayIdx}-${weekIdx}`}
                className="aspect-square rounded-[3px] transition-colors"
                style={{
                  backgroundColor: colour(bucket(count)),
                  gridColumn: weekIdx + 1,
                  gridRow: dayIdx + 1,
                }}
                aria-label={`${count} contributions`}
              />
            );
          }),
        )}
      </div>

      <div className="mt-4 flex items-center justify-between font-[family-name:var(--font-mono)] text-[10.5px] uppercase tracking-widest text-[var(--color-muted)]">
        <span>fewer</span>
        <div className="flex gap-[3px]">
          {[0, 1, 2, 3, 4].map((n) => (
            <span key={n} className="h-2 w-2 rounded-[2px]" style={{ backgroundColor: colour(n) }} />
          ))}
        </div>
        <span>more</span>
      </div>
    </BentoCard>
  );
}

/* ─────────────────────────────────────────────────────────
   Stat tiles
   ───────────────────────────────────────────────────────── */
export function StatTile({
  value,
  label,
  suffix,
  size = "md",
}: {
  value: string;
  label: string;
  suffix?: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizes = {
    sm: "text-2xl",
    md: "text-3xl",
    lg: "text-4xl",
  };
  return (
    <BentoCard className="flex h-full flex-col justify-between p-5">
      <Eyebrow icon={Clock}>{label}</Eyebrow>
      <div className="mt-4 flex items-baseline gap-1">
        <span className={cn("font-medium tracking-tight", sizes[size])}>{value}</span>
        {suffix && (
          <span className="font-[family-name:var(--font-mono)] text-xs uppercase text-[var(--color-muted)]">
            {suffix}
          </span>
        )}
      </div>
    </BentoCard>
  );
}

/* ─────────────────────────────────────────────────────────
   Shared bento card + eyebrow
   ───────────────────────────────────────────────────────── */
function BentoCard({
  children,
  className,
  accent,
}: {
  children: React.ReactNode;
  className?: string;
  accent?: "primary";
}) {
  return (
    <div
      className={cn(
        "gradient-border group relative overflow-hidden rounded-3xl bg-[var(--color-elevated)] backdrop-blur-xl",
        "transition-all duration-500 ease-out hover:-translate-y-0.5",
        "shadow-[0_1px_0_0_oklch(1_0_0_/_0.06)_inset,_0_24px_60px_-30px_oklch(0_0_0_/_0.7)]",
        accent && "hover:shadow-[0_30px_80px_-30px_oklch(0.86_0.27_152_/_0.40)]",
        className,
      )}
    >
      {/* Neon inner glow on hover */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(600px circle at var(--mx, 50%) var(--my, 0%), oklch(0.86 0.27 152 / 0.10), transparent 50%)",
        }}
      />
      {children}
    </div>
  );
}

function Eyebrow({
  icon: Icon,
  children,
}: {
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  children: React.ReactNode;
}) {
  return (
    <div className="inline-flex items-center gap-1.5 font-[family-name:var(--font-mono)] text-[10.5px] uppercase tracking-[0.18em] text-[var(--color-muted)]">
      <Icon size={11} strokeWidth={2.25} />
      {children}
    </div>
  );
}
