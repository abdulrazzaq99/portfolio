import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { ButtonLink } from "@/components/ui/button";
import { EmbeddedTerminal } from "./embedded-terminal";
import { personal } from "@/data/personal";

/**
 * Hero — editorial composition.
 *
 * The engineer's NAME is the visual anchor (Instrument Serif, very large).
 * No marketing tagline, no decorative underline, no terminal-prompt eyebrow —
 * those were the dev-portfolio clichés making the prior version feel dated.
 *
 * Above the fold has 5 elements:
 *   - thin metadata strip (left mono label / right open-status)
 *   - big name in display serif (the centerpiece)
 *   - one supporting paragraph in sans
 *   - one quiet role + location line in mono
 *   - 2 CTAs
 *
 * The embedded terminal sits as a quieter secondary visual on the right
 * column on desktop, stacks below the name on mobile.
 */
export function Hero() {
  return (
    <section
      id="home"
      className="relative isolate overflow-hidden pt-36 pb-32 sm:pt-44 sm:pb-40"
    >
      {/* Subtle ambient orbs — calmer than before */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-40 top-20 h-[28rem] w-[28rem] rounded-full bg-[oklch(0.62_0.165_156_/_0.18)] blur-[180px]" />
        <div className="absolute right-0 bottom-0 h-72 w-72 rounded-full bg-[oklch(0.86_0.27_152_/_0.10)] blur-[140px]" />
      </div>

      <Container size="wide">
        <div className="grid grid-cols-12 gap-y-16 lg:gap-x-12">
          {/* Left column — name + supporting copy + CTAs */}
          <div className="col-span-12 lg:col-span-7">
            {/* The name — display serif, very large, single-line on desktop */}
            <h1
              className="font-[family-name:var(--font-display)] text-[clamp(72px,11vw,168px)] font-normal leading-[0.92] tracking-[-0.02em] text-[var(--color-ink)]"
              style={{ fontFeatureSettings: "'liga' 1, 'kern' 1" }}
            >
              Abdul{" "}
              <span className="italic font-normal text-[var(--color-ink)]">Razzaq</span>
              <span
                className="text-[var(--color-primary-glow)]"
                style={{ textShadow: "0 0 22px oklch(0.86 0.27 152 / 0.55)" }}
              >
                .
              </span>
            </h1>

            {/* Supporting paragraph — proper reading width */}
            <p className="mt-12 max-w-[60ch] text-[17px] leading-[1.6] text-[var(--color-ink-soft)] sm:text-[19px]">
              Full-stack engineer with a backend instinct.{" "}
              <span className="text-[var(--color-ink)]">
                Django and Node on the server, Next.js on the client,
              </span>{" "}
              with a soft spot for AI/ML, real-time systems and the small
              details that compound.
            </p>

            {/* Role + location — quiet mono line */}
            <div className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-1 font-[family-name:var(--font-mono)] text-[11.5px] uppercase tracking-[0.18em] text-[var(--color-muted)]">
              <span>Currently @ Infinitiv AI</span>
              <span aria-hidden className="text-[var(--color-muted-2)]">·</span>
              <span>{personal.location}</span>
            </div>

            {/* CTAs */}
            <div className="mt-12 flex flex-wrap items-center gap-3">
              <ButtonLink href="#work" size="lg">
                View work
                <ArrowRight
                  size={15}
                  className="transition-transform duration-300 group-hover:translate-x-0.5"
                />
              </ButtonLink>
              <ButtonLink href="#contact" variant="ghost" size="lg">
                Get in touch
              </ButtonLink>
            </div>
          </div>

          {/* Right column — terminal as secondary signal */}
          <div className="col-span-12 lg:col-span-5 lg:pt-12">
            <EmbeddedTerminal />
          </div>
        </div>
      </Container>
    </section>
  );
}
