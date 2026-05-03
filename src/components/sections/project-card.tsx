"use client";

import { TechBadge } from "@/components/ui/badge";
import { ProjectVisual } from "./project-visual";
import type { Project } from "@/data/projects";
import { cn } from "@/lib/utils";

/**
 * Compact ProjectCard. Renders only the IDE-artifact visual + name + meta + stack.
 * Clicking anywhere on the card opens the ProjectModal (managed by the parent
 * <Projects> component).
 */
export function ProjectCard({
  project,
  index,
  onOpen,
}: {
  project: Project;
  index: number;
  onOpen: (project: Project) => void;
}) {
  return (
    <article
      className={cn(
        "gradient-border group relative flex flex-col overflow-hidden rounded-2xl",
        "bg-[var(--color-bg-2)]",
        "transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
        "hover:-translate-y-1 hover:shadow-[0_24px_60px_-30px_oklch(0.86_0.27_152_/_0.40)]",
      )}
      style={{ animation: `fadeUp 0.6s var(--ease-out) ${index * 60}ms both` }}
    >
      {/* Visual preview — clickable to open modal */}
      <button
        type="button"
        onClick={() => onOpen(project)}
        aria-label={`Open ${project.name} preview`}
        className="group/visual relative block aspect-[16/10] w-full cursor-pointer overflow-hidden border-b border-[var(--color-line)] bg-[var(--color-terminal)]"
      >
        <ProjectVisual project={project} />

        {/* Category tag */}
        <div className="absolute left-3 top-3 flex items-center gap-2">
          <span className="rounded-md border border-[var(--color-primary-glow)]/30 bg-[var(--color-primary-glow)]/10 px-1.5 py-0.5 font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-wider text-[var(--color-primary-glow)] backdrop-blur">
            &gt; {project.category}
          </span>
        </div>

        {/* Index + year */}
        <div className="absolute right-3 top-3 font-[family-name:var(--font-mono)] text-[9.5px] tracking-widest text-[var(--color-muted)]">
          {String(index + 1).padStart(2, "0")} · {project.year}
        </div>

        {/* Hover hint pill */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center pb-3">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-primary-glow)]/30 bg-[var(--color-primary-glow)]/10 px-2.5 py-1 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider text-[var(--color-primary-glow)] opacity-0 backdrop-blur transition-opacity duration-300 group-hover/visual:opacity-100">
            click to preview
          </div>
        </div>
      </button>

      {/* Compact body — name + 1-line problem + stack */}
      <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
        <button
          type="button"
          onClick={() => onOpen(project)}
          className="text-left"
        >
          <h3 className="text-[16px] font-semibold tracking-tight text-[var(--color-ink)] transition-colors hover:text-[var(--color-primary-glow)]">
            {project.name}
          </h3>
        </button>

        <p className="line-clamp-2 text-[12.5px] leading-relaxed text-[var(--color-muted)]">
          {project.problem}
        </p>

        <div className="mt-auto flex flex-wrap gap-1">
          {project.stack.slice(0, 4).map((s) => (
            <TechBadge key={s}>{s}</TechBadge>
          ))}
          {project.stack.length > 4 && (
            <span className="inline-flex items-center font-[family-name:var(--font-mono)] text-[10px] text-[var(--color-muted-2)]">
              +{project.stack.length - 4}
            </span>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </article>
  );
}
