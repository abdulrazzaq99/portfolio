import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "./container";
import { personal } from "@/data/personal";

export function Footer() {
  return (
    <footer className="relative border-t border-[var(--color-line-strong)] py-14">
      <Container size="wide">
        {/* Top: index + identity */}
        <div className="grid gap-10 md:grid-cols-[2fr_1fr_1fr]">
          <div>
            <h3 className="text-[18px] font-semibold tracking-tight text-[var(--color-ink)]">
              {personal.name}
            </h3>
            <p className="mt-2 max-w-md text-[13px] leading-relaxed text-[var(--color-muted)]">
              {personal.role} · based in {personal.location}. Open for freelance and full-time roles.
            </p>
            <a
              href={`mailto:${personal.email}`}
              className="group mt-4 inline-flex items-baseline gap-2 font-[family-name:var(--font-mono)] text-[12px] uppercase tracking-[0.22em] text-[var(--color-ink-soft)] transition-colors hover:text-[var(--color-primary-glow)]"
            >
              <span className="border-b border-[var(--color-line-strong)] pb-0.5 group-hover:border-[var(--color-primary-glow)]">
                {personal.email}
              </span>
              <ArrowUpRight size={12} />
            </a>
          </div>

          <FooterColumn label="Index">
            <FooterLink href="#about" label="N°01 About" />
            <FooterLink href="#work" label="N°02 Work" />
            <FooterLink href="#experience" label="N°03 Experience" />
            <FooterLink href="#contact" label="N°04 Contact" />
            <FooterLink href="/notes" label="N°05 Notes" external />
            <FooterLink href="/system" label="N°06 System" external />
          </FooterColumn>

          <FooterColumn label="Elsewhere">
            <FooterLink href={personal.socials.github} label="GitHub" external />
            <FooterLink href={personal.socials.linkedin} label="LinkedIn" external />
            <FooterLink href={personal.socials.upwork} label="Upwork" external />
          </FooterColumn>
        </div>

        {/* Bottom: technical metadata strip */}
        <div className="mt-14 flex flex-col gap-2 border-t border-[var(--color-line)] pt-6 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-muted-2)] sm:flex-row sm:items-center sm:justify-between">
          <span>© MMXXVI · {personal.name}</span>
          <span>{personal.coords} · {personal.timezone}</span>
          <span>Edition 2026 · v2.0</span>
        </div>
      </Container>
    </footer>
  );
}

function FooterColumn({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-muted)]">
        {label}
      </span>
      <ul className="mt-3 space-y-1.5 font-[family-name:var(--font-mono)] text-[11.5px] uppercase tracking-[0.18em] text-[var(--color-ink-soft)]">
        {children}
      </ul>
    </div>
  );
}

function FooterLink({ href, label, external }: { href: string; label: string; external?: boolean }) {
  if (external) {
    return (
      <li>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-baseline gap-1 transition-colors hover:text-[var(--color-primary-glow)]"
        >
          {label}
          <ArrowUpRight size={11} />
        </a>
      </li>
    );
  }
  return (
    <li>
      <Link href={href} className="transition-colors hover:text-[var(--color-primary-glow)]">
        {label}
      </Link>
    </li>
  );
}
