"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Command, Menu, X } from "lucide-react";
import { sections } from "@/lib/sections";
import { useScrollSpy } from "@/hooks/use-scroll-spy";
import { Container } from "@/components/layout/container";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";
import { personal } from "@/data/personal";

/**
 * Editorial masthead — three columns aligned to the page Container grid.
 *
 * Sync notes:
 *   - Wraps content in <Container size="default"> so the navbar's left/right
 *     edges match every other section on the page (max-w-[1240px], same px scale).
 *   - "Scrolled" state is detected via an IntersectionObserver sentinel placed
 *     at y=0, not a scroll listener — no per-frame work, no jank.
 *   - Avatar uses transform: scale (not h/w) to avoid horizontal layout shift
 *     when the bar tightens.
 *   - Active nav marker is a 1px underline that scales-in horizontally —
 *     more typographic than a popping square.
 *   - ⌘K and ThemeToggle locked to the same 32×32 footprint.
 */
export function Navbar({ onOpenTerminal }: { onOpenTerminal: () => void }) {
  const ids = useMemo(() => sections.map((s) => s.id), []);
  const active = useScrollSpy(ids);
  const navSections = useMemo(() => sections.filter((s) => s.inNav), []);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Detect scroll-past-top via a sentinel — no scroll listener, no per-frame work.
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { rootMargin: "0px 0px -1px 0px", threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Lock body scroll while mobile menu is open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      {/* Sentinel — when this scrolls past the top, the navbar enters "scrolled" state */}
      <div ref={sentinelRef} aria-hidden className="absolute left-0 top-0 h-px w-px" />

      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
          scrolled
            ? "border-b border-[var(--color-line)] bg-[var(--color-bg)]/72 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <Container>
          <div
            className={cn(
              "grid w-full items-center gap-6 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
              "grid-cols-[auto_1fr_auto]",
              scrolled ? "py-3" : "py-5 sm:py-6",
            )}
          >
            {/* ── LEFT — Logo (avatar scales via transform, never resizes) */}
            <Link
              href="#home"
              className="group flex items-center gap-3"
              aria-label="Home"
            >
              <span
                className={cn(
                  "grid h-8 w-8 shrink-0 origin-center place-items-center rounded-full font-[family-name:var(--font-mono)] text-[11px] font-semibold transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                  "bg-[var(--color-ink)] text-[var(--color-bg)]",
                  "group-hover:scale-[1.05]",
                  scrolled && "scale-90 group-hover:scale-95",
                )}
              >
                {personal.initials}
              </span>
              <span className="hidden flex-col leading-none sm:flex">
                <span className="text-[13px] font-medium tracking-tight text-[var(--color-ink)]">
                  {personal.name}
                </span>
                <span
                  className={cn(
                    "mt-1 font-[family-name:var(--font-mono)] text-[9.5px] uppercase tracking-[0.18em] text-[var(--color-muted)]",
                    "transition-opacity duration-300",
                    scrolled ? "opacity-0" : "opacity-100",
                  )}
                >
                  Portfolio · Edition 2026
                </span>
              </span>
            </Link>

            {/* ── CENTER — Nav links with underline-draws-in active marker */}
            <nav
              className="hidden justify-center md:flex"
              aria-label="Primary"
            >
              <ul className="flex items-center gap-9 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.18em]">
                {navSections.map((s) => {
                  const isActive = active === s.id;
                  return (
                    <li key={s.id}>
                      <Link
                        href={`#${s.id}`}
                        className={cn(
                          "group relative inline-block py-1.5 transition-colors duration-200",
                          isActive
                            ? "text-[var(--color-ink)]"
                            : "text-[var(--color-muted)] hover:text-[var(--color-ink)]",
                        )}
                      >
                        {s.label}
                        {/* Underline marker — draws in horizontally on active/hover */}
                        <span
                          aria-hidden
                          className={cn(
                            "absolute -bottom-px left-0 right-0 h-px origin-left transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                            isActive
                              ? "scale-x-100 bg-[var(--color-primary-glow)]"
                              : "scale-x-0 bg-[var(--color-ink)] group-hover:scale-x-100",
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

            {/* ── RIGHT — Controls (all 32×32, sharp corners, consistent rhythm) */}
            <div className="flex items-center gap-2 justify-self-end">
              <button
                type="button"
                onClick={onOpenTerminal}
                aria-label="Open command terminal"
                className={cn(
                  "hidden h-8 items-center gap-1.5 px-2.5 sm:inline-flex",
                  "border border-[var(--color-line-strong)]",
                  "bg-transparent transition-colors duration-200",
                  "hover:border-[var(--color-primary-glow)] hover:text-[var(--color-primary-glow)]",
                )}
              >
                <Command size={11} strokeWidth={2.25} />
                <span className="font-[family-name:var(--font-mono)] text-[10.5px] uppercase tracking-[0.18em] text-[var(--color-muted)]">
                  K
                </span>
              </button>

              <ThemeToggle className="hidden h-8 w-8 rounded-none sm:grid" />

              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="grid h-8 w-8 place-items-center border border-[var(--color-line-strong)] bg-transparent transition-colors duration-200 hover:border-[var(--color-primary-glow)] hover:text-[var(--color-primary-glow)] md:hidden"
                aria-label={open ? "Close menu" : "Open menu"}
                aria-expanded={open}
              >
                {open ? <X size={14} /> : <Menu size={14} />}
              </button>
            </div>
          </div>
        </Container>
      </header>

      {/* ── Mobile menu (CSS-only stagger via nth-child) */}
      <div
        className={cn(
          "fixed inset-0 z-40 transition-all duration-500 md:hidden",
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        )}
      >
        <div className="absolute inset-0 bg-[var(--color-bg)]/92 backdrop-blur-xl" />
        <nav
          data-open={open}
          className="relative flex h-full flex-col items-start justify-center gap-1 px-8 pt-20"
        >
          {navSections.map((s, i) => (
            <Link
              key={s.id}
              href={`#${s.id}`}
              onClick={() => setOpen(false)}
              className={cn(
                "mobile-nav-item group flex items-baseline gap-4 py-3 text-4xl font-medium tracking-tight transition-colors",
                "text-[var(--color-ink)] hover:text-[var(--color-primary-glow)]",
              )}
            >
              <span className="font-[family-name:var(--font-mono)] text-xs text-[var(--color-primary-glow)]">
                0{i + 1}
              </span>
              {s.label}
            </Link>
          ))}
          <div className="mobile-nav-item mt-8 flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                onOpenTerminal();
              }}
              className="inline-flex items-center gap-2 border border-[var(--color-line-strong)] px-4 py-2 text-sm"
            >
              <Command size={14} /> Open Terminal
            </button>
            <ThemeToggle className="h-9 w-9 rounded-none" />
          </div>
        </nav>
      </div>

      <style>{`
        /* CSS-only stagger for mobile menu — no per-item React work */
        .mobile-nav-item {
          opacity: 0;
          transform: translateY(12px);
          transition: opacity 0.6s var(--ease-out), transform 0.6s var(--ease-out);
        }
        [data-open="true"] .mobile-nav-item { opacity: 1; transform: translateY(0); }
        [data-open="true"] .mobile-nav-item:nth-child(1) { transition-delay: 100ms; }
        [data-open="true"] .mobile-nav-item:nth-child(2) { transition-delay: 160ms; }
        [data-open="true"] .mobile-nav-item:nth-child(3) { transition-delay: 220ms; }
        [data-open="true"] .mobile-nav-item:nth-child(4) { transition-delay: 280ms; }
      `}</style>
    </>
  );
}
