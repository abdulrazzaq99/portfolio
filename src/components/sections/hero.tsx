"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { HeroArtifact } from "@/components/sections/hero-artifact";
import { personal } from "@/data/personal";

const FOCUS_ROTATION = ["AI/ML apps", "RAG pipelines", "Realtime systems", "Design systems"];

/**
 * Hero — brutalist-editorial composition.
 *
 *   1. Top metadata strip (edition mark + status)
 *   2. 2-col grid: NAME (left, ~70%) + artifact card (right, ~30%) on desktop
 *   3. Role line in mono
 *   4. 4-column structured fact grid (passport-stamp style)
 *      — N°02 "Currently" cycles through focus areas via typewriter
 *   5. Two flat CTA links at the bottom
 */
export function Hero() {
  const today = new Date()
    .toLocaleDateString("en-US", { year: "numeric", month: "short", day: "2-digit" })
    .toUpperCase();

  return (
    <section
      id="home"
      className="relative isolate scroll-mt-24 pt-24 pb-32 sm:pt-32 sm:pb-40 lg:pt-36"
    >
      <Container size="wide">
        {/* Top metadata strip */}
        <div className="mb-16 flex items-center justify-between font-[family-name:var(--font-mono)] text-[10.5px] uppercase tracking-[0.22em] text-[var(--color-muted)]">
          <span className="inline-flex items-center gap-3">
            <span className="text-[var(--color-primary-glow)]">●</span>
            Engineer · {today}
          </span>
          <span className="hidden sm:inline">{personal.coords}</span>
        </div>

        {/* 2-col: name + artifact */}
        <div className="grid items-start gap-8 lg:grid-cols-[1fr_auto] lg:gap-12">
          <div>
            {/* The name */}
            <h1 className="text-balance text-[clamp(56px,11vw,160px)] font-bold leading-[0.86] tracking-[-0.04em] text-[var(--color-ink)]">
              ABDUL
              <br />
              RAZZAQ<span className="text-[var(--color-primary-glow)]">.</span>
            </h1>

            {/* Role line + sub-meta */}
            <div className="mt-10 flex flex-col gap-1 sm:mt-12">
              <p className="font-[family-name:var(--font-mono)] text-[12px] uppercase tracking-[0.22em] text-[var(--color-ink-soft)] sm:text-[13px]">
                {personal.role}
              </p>
              <p className="font-[family-name:var(--font-mono)] text-[10.5px] uppercase tracking-[0.22em] text-[var(--color-muted)]">
                ~ 3 years building · backend-leaning full-stack · {personal.location}
              </p>
            </div>
          </div>

          {/* Artifact — only on desktop, hidden on mobile to keep hero clean */}
          <div className="hidden lg:block lg:w-[280px] lg:pt-2">
            <HeroArtifact />
          </div>
        </div>

        {/* Structured fact grid — passport-stamp style */}
        <dl className="mt-14 grid grid-cols-2 gap-px overflow-hidden border border-[var(--color-line)] bg-[var(--color-line)] sm:grid-cols-4">
          <Fact label="Status" value="Open for work" accent />
          <Fact label="Currently" value="Infinitiv AI" />
          <Fact label="Focus" value={<TypewriterValue items={FOCUS_ROTATION} />} accent />
          <Fact label="Timezone" value={personal.timezone} />
        </dl>

        {/* CTAs */}
        <div className="mt-14 flex flex-wrap items-center gap-x-10 gap-y-4">
          <CTA href="#work" label="View work" primary />
          <CTA href="#contact" label="Get in touch" />
          <CTA href={personal.resume} label="Download CV" external />
        </div>
      </Container>
    </section>
  );
}

function Fact({
  label,
  value,
  accent,
}: {
  label: string;
  value: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2 bg-[var(--color-bg)] px-5 py-5 sm:px-6 sm:py-6">
      <dt className="font-[family-name:var(--font-mono)] text-[9.5px] uppercase tracking-[0.22em] text-[var(--color-muted)]">
        {label}
      </dt>
      <dd
        className={`text-[14px] font-medium tracking-tight sm:text-[15px] ${
          accent ? "text-[var(--color-primary-glow)]" : "text-[var(--color-ink)]"
        }`}
      >
        {value}
      </dd>
    </div>
  );
}

/**
 * Type-and-erase rotation through a list of focus areas. ~70ms per char on
 * type, ~35ms on erase, 1.4s pause when fully typed. Honors prefers-reduced-
 * motion by collapsing to the first value.
 */
function TypewriterValue({ items }: { items: string[] }) {
  const [text, setText] = useState(items[0] ?? "");
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    let i = 0;
    let charIndex = items[0]?.length ?? 0;
    let typing: 1 | -1 = -1; // start by erasing
    let pause = 1400;

    const tick = () => {
      const target = items[i] ?? "";
      if (typing === -1) {
        charIndex -= 1;
        setText(target.slice(0, Math.max(charIndex, 0)));
        if (charIndex <= 0) {
          typing = 1;
          i = (i + 1) % items.length;
        }
      } else {
        const next = items[i] ?? "";
        charIndex += 1;
        setText(next.slice(0, charIndex));
        if (charIndex >= next.length) {
          typing = -1;
          window.setTimeout(loop, pause);
          return;
        }
      }
      window.setTimeout(loop, typing === 1 ? 70 : 35);
    };
    const loop = () => tick();
    const t = window.setTimeout(loop, 1400);
    return () => window.clearTimeout(t);
  }, [items, reducedMotion]);

  return (
    <span>
      {text}
      <span aria-hidden className="ml-0.5 inline-block h-[0.9em] w-[1.5px] -mb-[2px] bg-current opacity-80" />
    </span>
  );
}

function CTA({
  href,
  label,
  primary,
  external,
}: {
  href: string;
  label: string;
  primary?: boolean;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={`group inline-flex items-baseline gap-2.5 font-[family-name:var(--font-mono)] text-[11.5px] uppercase tracking-[0.22em] transition-colors duration-200 ${
        primary
          ? "text-[var(--color-primary-glow)]"
          : "text-[var(--color-muted)] hover:text-[var(--color-ink)]"
      }`}
    >
      <span className={primary ? "border-b border-[var(--color-primary-glow)] pb-0.5" : ""}>
        {label}
      </span>
      <ArrowUpRight
        size={13}
        className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
      />
    </a>
  );
}
