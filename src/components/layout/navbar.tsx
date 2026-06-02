"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Command, Menu, X } from "lucide-react";
import { sections } from "@/lib/sections";
import { useScrollSpy } from "@/hooks/use-scroll-spy";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LiveClock, SectionCounter } from "@/components/layout/nav-status";
import { cn } from "@/lib/utils";
import { personal } from "@/data/personal";

/**
 * Vertical left-rail navigation. Brutalist-editorial register:
 *   - Fixed left column, ~220px on desktop
 *   - Logo block at top (initials + name + role label)
 *   - Numbered nav list (N° 01 ABOUT, N° 02 WORK, ...)
 *   - Status block at bottom (open / location / theme toggle / ⌘K)
 *   - Mobile: collapses to a top bar with menu trigger; full-screen overlay
 */
export function Navbar({ onOpenTerminal }: { onOpenTerminal: () => void }) {
  const ids = useMemo(() => sections.map((s) => s.id), []);
  const active = useScrollSpy(ids);
  const navSections = useMemo(() => sections.filter((s) => s.inNav), []);
  const activeIndex = useMemo(() => {
    const i = navSections.findIndex((s) => s.id === active);
    return i + 1; // 0 = hero
  }, [active, navSections]);
  const [open, setOpen] = useState(false);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  return (
    <>
      {/* ── DESKTOP RAIL — vertical fixed left column ───────────────── */}
      <aside
        aria-label="Site navigation"
        className="fixed left-0 top-0 z-40 hidden h-dvh w-[220px] flex-col justify-between border-r border-[var(--color-line)] bg-[var(--color-bg)] px-7 py-8 lg:flex xl:w-[240px]"
      >
        {/* Top — identity */}
        <div>
          <Link href="/" className="block group">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center bg-[var(--color-ink)] font-[family-name:var(--font-mono)] text-[12px] font-semibold text-[var(--color-bg)] transition-transform duration-300 group-hover:scale-105">
                {personal.initials}
              </span>
              <div className="flex flex-col leading-none">
                <span className="text-[14px] font-semibold tracking-tight text-[var(--color-ink)]">
                  {personal.name}
                </span>
                <span className="mt-1 font-[family-name:var(--font-mono)] text-[9.5px] uppercase tracking-[0.18em] text-[var(--color-muted)]">
                  Portfolio · MMXXVI
                </span>
              </div>
            </div>
          </Link>

          {/* Section counter — scrolls with active section */}
          <div className="mt-6">
            <SectionCounter index={activeIndex} total={navSections.length} />
          </div>

          {/* Numbered nav */}
          <nav aria-label="Primary" className="mt-10">
            <ul className="space-y-1">
              {navSections.map((s, i) => {
                const isActive = active === s.id;
                return (
                  <li key={s.id}>
                    <Link
                      href={`#${s.id}`}
                      className={cn(
                        "group flex items-baseline gap-3 py-2 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.18em] transition-colors duration-200",
                        isActive
                          ? "text-[var(--color-ink)]"
                          : "text-[var(--color-muted)] hover:text-[var(--color-ink)]",
                      )}
                    >
                      <span className={cn("transition-colors", isActive ? "text-[var(--color-primary-glow)]" : "text-[var(--color-muted-2)] group-hover:text-[var(--color-muted)]")}>
                        N°{String(i + 1).padStart(2, "0")}
                      </span>
                      <span>{s.label}</span>
                      {isActive && (
                        <span
                          aria-hidden
                          className="ml-auto inline-block h-1.5 w-1.5 bg-[var(--color-primary-glow)]"
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Secondary routes */}
            <ul className="mt-10 space-y-1 border-t border-[var(--color-line)] pt-6">
              <SecondaryLink href="/notes" label="Notes" num="07" active={false} />
              <SecondaryLink href="/system" label="System" num="08" active={false} />
            </ul>
          </nav>
        </div>

        {/* Bottom — status + controls */}
        <div className="space-y-4">
          <div className="flex flex-col gap-1.5 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.18em] text-[var(--color-muted)]">
            <span className="inline-flex items-center gap-2">
              <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-primary-glow)]" />
              Open · for work
            </span>
            <span>{personal.location}</span>
            <LiveClock />
          </div>

          <div className="flex items-center gap-2 border-t border-[var(--color-line)] pt-4">
            <button
              type="button"
              onClick={onOpenTerminal}
              aria-label="Open command terminal"
              className="inline-flex h-8 items-center gap-1.5 border border-[var(--color-line-strong)] px-2.5 transition-colors hover:border-[var(--color-primary-glow)] hover:text-[var(--color-primary-glow)]"
            >
              <Command size={11} strokeWidth={2.25} />
              <span className="font-[family-name:var(--font-mono)] text-[10.5px] uppercase tracking-[0.18em] text-[var(--color-muted)]">
                K
              </span>
            </button>
            <ThemeToggle className="h-8 w-8 rounded-none" />
          </div>
        </div>
      </aside>

      {/* ── MOBILE TOP BAR ─────────────────────────────────────────── */}
      <header className="fixed inset-x-0 top-0 z-40 flex items-center justify-between border-b border-[var(--color-line)] bg-[var(--color-bg)]/85 px-5 py-3 backdrop-blur-xl lg:hidden">
        <Link href="/" className="flex items-center gap-2.5" aria-label="Home">
          <span className="grid h-7 w-7 place-items-center bg-[var(--color-ink)] font-[family-name:var(--font-mono)] text-[10px] font-semibold text-[var(--color-bg)]">
            {personal.initials}
          </span>
          <span className="text-[13px] font-semibold tracking-tight">{personal.name}</span>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle className="h-8 w-8 rounded-none" />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="grid h-8 w-8 place-items-center border border-[var(--color-line-strong)]"
          >
            {open ? <X size={14} /> : <Menu size={14} />}
          </button>
        </div>
      </header>

      {/* ── MOBILE MENU OVERLAY ────────────────────────────────────── */}
      <div
        className={cn(
          "fixed inset-0 z-30 transition-all duration-500 lg:hidden",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <div className="absolute inset-0 bg-[var(--color-bg)]/95 backdrop-blur-xl" />
        <nav
          data-open={open}
          className="relative flex h-full flex-col items-start justify-center gap-1 px-8 pt-20"
        >
          {navSections.map((s, i) => (
            <Link
              key={s.id}
              href={`#${s.id}`}
              onClick={() => setOpen(false)}
              className="mobile-nav-item group flex items-baseline gap-5 py-3 text-3xl font-medium tracking-tight text-[var(--color-ink)]"
            >
              <span className="font-[family-name:var(--font-mono)] text-xs text-[var(--color-primary-glow)]">
                N°{String(i + 1).padStart(2, "0")}
              </span>
              <span>{s.label}</span>
            </Link>
          ))}
          <div className="mobile-nav-item mt-6 flex flex-col gap-3">
            <Link
              href="/notes"
              onClick={() => setOpen(false)}
              className="font-[family-name:var(--font-mono)] text-sm uppercase tracking-[0.18em] text-[var(--color-ink-soft)]"
            >
              N°07 — Notes
            </Link>
            <Link
              href="/system"
              onClick={() => setOpen(false)}
              className="font-[family-name:var(--font-mono)] text-sm uppercase tracking-[0.18em] text-[var(--color-ink-soft)]"
            >
              N°08 — System
            </Link>
          </div>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onOpenTerminal();
            }}
            className="mobile-nav-item mt-8 inline-flex items-center gap-2 border border-[var(--color-line-strong)] px-4 py-2 text-sm"
          >
            <Command size={14} /> Open Terminal
          </button>
        </nav>
      </div>

      <style>{`
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
        [data-open="true"] .mobile-nav-item:nth-child(5) { transition-delay: 340ms; }
      `}</style>
    </>
  );
}

function SecondaryLink({ href, label, num, active }: { href: string; label: string; num: string; active: boolean }) {
  return (
    <li>
      <Link
        href={href}
        className={cn(
          "group flex items-baseline gap-3 py-2 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.18em] transition-colors duration-200",
          active ? "text-[var(--color-ink)]" : "text-[var(--color-muted)] hover:text-[var(--color-ink)]",
        )}
      >
        <span className="text-[var(--color-muted-2)] group-hover:text-[var(--color-muted)] transition-colors">N°{num}</span>
        <span>{label}</span>
      </Link>
    </li>
  );
}
