import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/layout/container";

export default function NotFound() {
  return (
    <main className="relative pt-32 pb-32 sm:pt-40 sm:pb-44">
      <Container>
        <p className="font-[family-name:var(--font-mono)] text-[10.5px] uppercase tracking-[0.22em] text-[var(--color-muted)]">
          ▸ Error · Signal lost
        </p>

        <h1 className="mt-6 text-[clamp(64px,14vw,160px)] font-bold leading-[0.9] tracking-tighter text-[var(--color-ink)]">
          404
          <span className="text-[var(--color-primary-glow)]">.</span>
        </h1>

        <p className="mt-8 max-w-[48ch] text-[17px] leading-[1.6] text-[var(--color-ink-soft)] sm:text-[18px]">
          This page doesn&apos;t exist — moved, renamed, or never built. The
          index below is a better route.
        </p>

        <div className="mt-12 flex flex-wrap items-center gap-8">
          <Link
            href="/"
            className="group inline-flex items-baseline gap-2 font-[family-name:var(--font-mono)] text-[11.5px] uppercase tracking-[0.22em] text-[var(--color-ink)] transition-colors hover:text-[var(--color-primary-glow)]"
          >
            <span className="border-b border-[var(--color-line-strong)] pb-0.5 group-hover:border-[var(--color-primary-glow)]">
              Back home
            </span>
            <ArrowUpRight size={12} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/#work"
            className="group inline-flex items-baseline gap-2 font-[family-name:var(--font-mono)] text-[11.5px] uppercase tracking-[0.22em] text-[var(--color-ink-soft)] transition-colors hover:text-[var(--color-primary-glow)]"
          >
            <span className="border-b border-[var(--color-line-strong)] pb-0.5 group-hover:border-[var(--color-primary-glow)]">
              View work
            </span>
            <ArrowUpRight size={12} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </Container>
    </main>
  );
}
