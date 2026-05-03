import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "./container";
import { personal } from "@/data/personal";
import { sections } from "@/lib/sections";

export function Footer() {
  return (
    <footer className="relative border-t border-[var(--color-line)] py-16">
      <Container>
        <div className="grid gap-12 sm:grid-cols-2 md:grid-cols-4">
          <div className="md:col-span-2">
            <h3 className="text-xl font-medium tracking-tight text-[var(--color-ink)]">
              {personal.name}
            </h3>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-[var(--color-muted)]">
              {personal.role} based in {personal.location}. Currently open to freelance and full-time roles.
            </p>
            <a
              href={`mailto:${personal.email}`}
              className="mt-4 inline-flex items-center gap-1.5 text-sm text-[var(--color-ink)] underline decoration-[var(--color-line-strong)] underline-offset-4 transition-colors hover:text-[var(--color-primary)] hover:decoration-[var(--color-primary)]"
            >
              {personal.email}
              <ArrowUpRight size={14} />
            </a>
          </div>

          <div>
            <span className="font-[family-name:var(--font-mono)] text-[10.5px] uppercase tracking-[0.18em] text-[var(--color-muted)]">
              Index
            </span>
            <ul className="mt-3 space-y-1.5 text-sm text-[var(--color-ink-soft)]">
              {sections
                .filter((s) => s.inNav)
                .map((s) => (
                  <li key={s.id}>
                    <Link href={`#${s.id}`} className="transition-colors hover:text-[var(--color-primary-glow)]">
                      {s.label}
                    </Link>
                  </li>
                ))}
              <li>
                <Link
                  href="/notes"
                  className="inline-flex items-center gap-1 transition-colors hover:text-[var(--color-primary-glow)]"
                >
                  Notes
                  <ArrowUpRight size={12} />
                </Link>
              </li>
              <li>
                <Link
                  href="/system"
                  className="inline-flex items-center gap-1 transition-colors hover:text-[var(--color-primary-glow)]"
                >
                  Design system
                  <ArrowUpRight size={12} />
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <span className="font-[family-name:var(--font-mono)] text-[10.5px] uppercase tracking-[0.18em] text-[var(--color-muted)]">
              Elsewhere
            </span>
            <ul className="mt-3 space-y-1.5 text-sm text-[var(--color-ink-soft)]">
              <li>
                <a href={personal.socials.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 transition-colors hover:text-[var(--color-primary)]">
                  GitHub <ArrowUpRight size={12} />
                </a>
              </li>
              <li>
                <a href={personal.socials.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 transition-colors hover:text-[var(--color-primary)]">
                  LinkedIn <ArrowUpRight size={12} />
                </a>
              </li>
              <li>
                <a href={personal.socials.upwork} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 transition-colors hover:text-[var(--color-primary)]">
                  Upwork <ArrowUpRight size={12} />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t border-[var(--color-line)] pt-6 font-[family-name:var(--font-mono)] text-[10.5px] uppercase tracking-[0.18em] text-[var(--color-muted)] sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 — {personal.name}</span>
          <span>{personal.coords} · {personal.timezone}</span>
        </div>
      </Container>
    </footer>
  );
}
