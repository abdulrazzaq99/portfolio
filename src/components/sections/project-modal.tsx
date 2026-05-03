"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowUpRight, Github, X } from "lucide-react";
import { TechBadge } from "@/components/ui/badge";
import { ProjectVisual } from "./project-visual";
import type { Project } from "@/data/projects";
import { cn } from "@/lib/utils";

/**
 * Project preview modal. Shows the full visual, problem/solution/impact,
 * stack, and CTAs to the deep case-study page (/work/[slug]) and GitHub.
 *
 * Open/close state is owned by the parent <Projects> component — the modal
 * renders only when `project` is non-null.
 */
export function ProjectModal({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Lock body scroll while modal is open + Escape to close + autofocus close button
  useEffect(() => {
    if (!project) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);

    // Move focus into the modal for keyboard users
    requestAnimationFrame(() => closeButtonRef.current?.focus());

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center px-4 py-[6vh]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
    >
      {/* Backdrop */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close project preview"
        className="absolute inset-0 cursor-default bg-[oklch(0_0_0_/_0.7)] backdrop-blur-md animate-[fadeIn_0.18s_ease-out_forwards]"
      />

      {/* Window */}
      <div
        ref={dialogRef}
        className={cn(
          "relative z-10 flex w-full max-w-4xl max-h-[88vh] flex-col overflow-hidden rounded-2xl",
          "border border-[var(--color-line-strong)] bg-[var(--color-bg-2)]",
          "shadow-[0_50px_120px_-30px_oklch(0.86_0.27_152_/_0.30),_0_30px_80px_-30px_oklch(0_0_0_/_0.7)]",
          "animate-[modalIn_0.24s_var(--ease-out)_forwards]",
        )}
      >
        {/* Header — close button overlaying the visual. 16:10 matches the
            ProjectVisual SVG's natural ratio (800×500) so nothing crops. */}
        <header className="relative aspect-[16/10] w-full shrink-0 overflow-hidden border-b border-[var(--color-line)] bg-[var(--color-terminal)]">
          <ProjectVisual project={project} />

          {/* Category + year top-left/right */}
          <div className="absolute left-4 top-4 flex items-center gap-2">
            <span className="rounded-md border border-[var(--color-primary-glow)]/30 bg-[var(--color-primary-glow)]/10 px-2 py-0.5 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider text-[var(--color-primary-glow)] backdrop-blur">
              &gt; {project.category}
            </span>
            <span className="rounded-md border border-[var(--color-line-strong)] bg-[oklch(0_0_0_/_0.5)] px-2 py-0.5 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider text-[var(--color-muted)] backdrop-blur">
              {project.year}
            </span>
          </div>

          {/* Close button */}
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full border border-[var(--color-line-strong)] bg-[oklch(0_0_0_/_0.6)] text-[var(--color-ink-soft)] backdrop-blur transition-colors hover:border-[var(--color-primary-glow)] hover:text-[var(--color-primary-glow)]"
          >
            <X size={14} />
          </button>
        </header>

        {/* Body — scrolls if content overflows */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          {/* Title */}
          <h2
            id="project-modal-title"
            className="text-[26px] font-semibold tracking-tight text-[var(--color-ink)] sm:text-[32px]"
          >
            {project.name}
          </h2>

          {/* Stack ribbon */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.stack.map((s) => (
              <TechBadge key={s}>{s}</TechBadge>
            ))}
          </div>

          {/* Problem / Solution / Impact */}
          <dl className="mt-6 space-y-4 text-[14px] leading-relaxed sm:text-[15px]">
            <Row label="Problem" body={project.problem} />
            <Row label="Solution" body={project.solution} />
            <Row label="Impact" body={project.impact} accent />
          </dl>

          {/* Optional engineering highlights */}
          {project.highlights?.length ? (
            <div className="mt-6">
              <span className="font-[family-name:var(--font-mono)] text-[10.5px] uppercase tracking-[0.18em] text-[var(--color-primary-glow)]">
                Highlights
              </span>
              <ul className="mt-2 space-y-1.5 border-l border-[var(--color-primary-glow)]/20 pl-4 font-[family-name:var(--font-mono)] text-[12.5px] leading-relaxed text-[var(--color-ink-soft)]">
                {project.highlights.slice(0, 4).map((h) => (
                  <li key={h}>
                    <span className="mr-2 text-[var(--color-primary-glow)]">↳</span>
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        {/* Footer — CTAs */}
        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--color-line)] bg-[var(--color-bg-2)] px-6 py-4 sm:px-8">
          <span className="font-[family-name:var(--font-mono)] text-[10.5px] uppercase tracking-[0.18em] text-[var(--color-muted)]">
            preview · esc to close
          </span>
          <div className="flex items-center gap-2">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-line-strong)] bg-[var(--color-bg-3)] px-3.5 py-1.5 text-[12.5px] font-medium text-[var(--color-ink-soft)] transition-all hover:border-[var(--color-primary-glow)] hover:text-[var(--color-primary-glow)]"
              >
                <Github size={12} />
                Source
                <ArrowUpRight size={11} />
              </a>
            )}
            <Link
              href={`/work/${project.slug}`}
              onClick={onClose}
              className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-primary)] px-3.5 py-1.5 text-[12.5px] font-medium text-[var(--color-bg)] transition-all hover:bg-[var(--color-primary-glow)]"
              style={{ boxShadow: "0 0 0 1px oklch(0.86 0.27 152 / 0.25) inset" }}
            >
              Read full case study
              <ArrowUpRight size={11} />
            </Link>
          </div>
        </footer>
      </div>

      <style>{`
        @keyframes fadeIn  { from { opacity: 0; } to { opacity: 1; } }
        @keyframes modalIn {
          from { opacity: 0; transform: translateY(12px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0)    scale(1); }
        }
      `}</style>
    </div>
  );
}

function Row({
  label,
  body,
  accent,
}: {
  label: string;
  body: string;
  accent?: boolean;
}) {
  return (
    <div className="grid grid-cols-[80px_1fr] gap-3 sm:grid-cols-[96px_1fr]">
      <dt className="font-[family-name:var(--font-mono)] text-[10.5px] uppercase tracking-[0.18em] text-[var(--color-muted)]">
        {label}
      </dt>
      <dd className={accent ? "text-[var(--color-ink)]" : "text-[var(--color-ink-soft)]"}>
        {body}
      </dd>
    </div>
  );
}
