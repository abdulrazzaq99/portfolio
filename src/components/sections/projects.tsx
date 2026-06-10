"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Github } from "lucide-react";
import { SectionWrapper } from "@/components/layout/section-wrapper";
import { SectionHeader } from "@/components/layout/section-header";
import { projects, type Project } from "@/data/projects";
import { ProjectModal } from "./project-modal";
import { cn } from "@/lib/utils";

/**
 * Projects — list view (brutalist-editorial). Each project is one row in a
 * lined table-like list. Hover reveals a detail action; click opens the
 * preview modal. Deep case study still lives at /work/[slug].
 *
 * A pill row above the list filters by `category`. "All" is default.
 */
export function Projects() {
  const [active, setActive] = useState<Project | null>(null);
  const [filter, setFilter] = useState<string>("All");

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of projects) counts.set(p.category, (counts.get(p.category) ?? 0) + 1);
    const entries = Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
    return [{ name: "All", count: projects.length }, ...entries.map(([name, count]) => ({ name, count }))];
  }, []);

  const filtered = useMemo(
    () => (filter === "All" ? projects : projects.filter((p) => p.category === filter)),
    [filter],
  );

  return (
    <SectionWrapper id="work" containerSize="wide">
      <SectionHeader
        num="03"
        section="SECTION"
        keywords={["WORK", "BUILD", "INDEX"]}
        title={{ left: "WORK", right: "LOG" }}
        subSpec={{
          num: "03",
          label: "BUILD",
          meta: `${projects.length} projects · click to preview · case studies at /work`,
        }}
      />

      {/* Filter pills */}
      <div className="mb-6 flex flex-wrap items-center gap-1.5">
        <span className="mr-1 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-muted-2)]">
          ↳ Filter
        </span>
        {categories.map((c, i) => {
          const isActive = filter === c.name;
          return (
            <button
              key={c.name}
              type="button"
              onClick={() => setFilter(c.name)}
              className={cn(
                "inline-flex items-baseline gap-2 border px-2.5 py-1.5 font-[family-name:var(--font-mono)] text-[11px] tracking-tight transition-colors",
                isActive
                  ? "border-[var(--color-primary-glow)] text-[var(--color-primary-glow)]"
                  : "border-[var(--color-line-strong)] text-[var(--color-ink-soft)] hover:border-[var(--color-ink-soft)]",
              )}
            >
              <span className="text-[10px] uppercase tracking-[0.22em] text-[var(--color-muted-2)]">
                {String(i).padStart(2, "0")}
              </span>
              <span>{c.name}</span>
              <span className="text-[10px] text-[var(--color-muted-2)]">({c.count})</span>
            </button>
          );
        })}
      </div>

      {/* Column header */}
      <div className="hidden border-y border-[var(--color-line-strong)] py-3 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-muted)] md:grid md:grid-cols-[60px_1fr_220px_120px_40px] md:gap-6">
        <span>N°</span>
        <span>Project</span>
        <span>Stack</span>
        <span>Year</span>
        <span aria-hidden />
      </div>

      {/* Project rows */}
      <ol className="divide-y divide-[var(--color-line)] border-b border-[var(--color-line)]">
        {filtered.map((p, i) => (
          <li key={p.slug}>
            <Row project={p} index={i} onOpen={() => setActive(p)} />
          </li>
        ))}
        {filtered.length === 0 && (
          <li className="py-10 text-center font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.22em] text-[var(--color-muted)]">
            ↳ No projects under "{filter}" yet.
          </li>
        )}
      </ol>

      {/* Footer line */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <span className="font-[family-name:var(--font-mono)] text-[10.5px] uppercase tracking-[0.22em] text-[var(--color-muted)]">
          End of selected list · {filtered.length}/{projects.length}
        </span>
        <Link
          href="https://github.com/abdulrazzaq99"
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-baseline gap-2 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.22em] text-[var(--color-ink-soft)] transition-colors hover:text-[var(--color-primary-glow)]"
        >
          <span className="border-b border-[var(--color-line-strong)] pb-0.5 group-hover:border-[var(--color-primary-glow)]">
            Full archive on GitHub
          </span>
          <ArrowUpRight size={12} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      </div>

      <ProjectModal project={active} onClose={() => setActive(null)} />
    </SectionWrapper>
  );
}

function Row({
  project,
  index,
  onOpen,
}: {
  project: Project;
  index: number;
  onOpen: () => void;
}) {
  return (
    <Link
      href={`/work/${project.slug}`}
      onClick={(e) => {
        // Plain click opens the preview modal; modifier/middle clicks keep
        // native link behavior. The real href also makes /work/[slug]
        // discoverable by crawlers.
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        onOpen();
      }}
      className="group grid w-full grid-cols-[40px_1fr_40px] gap-4 py-5 text-left transition-colors duration-200 hover:bg-[var(--color-bg-2)] md:grid-cols-[60px_1fr_220px_120px_40px] md:gap-6 md:py-6"
    >
      {/* N° */}
      <span className="font-[family-name:var(--font-mono)] text-[12px] uppercase tracking-[0.18em] text-[var(--color-muted-2)] md:self-baseline md:pt-1">
        N°{String(index + 1).padStart(2, "0")}
      </span>

      {/* Title + summary */}
      <div className="min-w-0">
        <div className="flex items-baseline gap-3">
          <h3 className="text-[18px] font-semibold tracking-tight text-[var(--color-ink)] transition-colors group-hover:text-[var(--color-primary-glow)] md:text-[20px]">
            {project.name}
          </h3>
          <span className="hidden font-[family-name:var(--font-mono)] text-[9.5px] uppercase tracking-[0.22em] text-[var(--color-muted)] md:inline">
            ↳ {project.category}
          </span>
        </div>
        <p className="mt-1 line-clamp-1 text-[13px] leading-relaxed text-[var(--color-muted)]">
          {project.problem}
        </p>
      </div>

      {/* Stack — desktop only */}
      <div className="hidden font-[family-name:var(--font-mono)] text-[10.5px] uppercase tracking-[0.18em] text-[var(--color-muted-2)] md:block md:self-baseline md:pt-1">
        {project.stack.slice(0, 3).join(" · ")}
        {project.stack.length > 3 && (
          <span className="ml-1 text-[var(--color-muted)]">+{project.stack.length - 3}</span>
        )}
      </div>

      {/* Year — desktop only */}
      <div className="hidden font-[family-name:var(--font-mono)] text-[10.5px] uppercase tracking-[0.18em] text-[var(--color-muted-2)] md:block md:self-baseline md:pt-1">
        {project.year}
        <span
          className={cn(
            "ml-2 inline-block h-1 w-1 rounded-full",
            project.visibility === "public" && "bg-[var(--color-primary-glow)]",
            project.visibility === "private" && "bg-[var(--color-muted-2)]",
            project.visibility === "collaborator" && "bg-[var(--color-muted)]",
          )}
          aria-label={project.visibility}
        />
      </div>

      {/* Arrow */}
      <span className="self-baseline pt-1.5 text-[var(--color-muted-2)] transition-all duration-300 group-hover:translate-x-1 group-hover:text-[var(--color-primary-glow)] md:justify-self-end">
        <ArrowUpRight size={14} />
      </span>

      {/* GitHub icon — desktop, only when public */}
      {project.github && (
        <span className="sr-only">
          <Github size={12} /> {project.github}
        </span>
      )}
    </Link>
  );
}
