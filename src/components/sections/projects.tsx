"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SectionWrapper } from "@/components/layout/section-wrapper";
import { projects, type Project } from "@/data/projects";
import { ProjectCard } from "./project-card";
import { ProjectModal } from "./project-modal";

export function Projects() {
  const [active, setActive] = useState<Project | null>(null);

  return (
    <SectionWrapper id="work" containerSize="wide" eyebrow={{ num: "02", label: "Selected Work" }}>
      <div className="mb-14 flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
        <h2 className="text-balance text-[clamp(40px,6vw,86px)] font-medium leading-[0.98] tracking-[-0.04em]">
          Recent obsessions.
        </h2>
        <p className="max-w-md text-sm leading-relaxed text-[var(--color-muted)]">
          Click any card to preview the project. From the preview you can read the
          full case study or jump straight to the source.
        </p>
      </div>

      {/* Compact 3-col grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p, i) => (
          <ProjectCard
            key={p.slug}
            project={p}
            index={i}
            onOpen={(proj) => setActive(proj)}
          />
        ))}
      </div>

      {/* Footer link to a future archive page (or just a quiet visual punctuation) */}
      <div className="mt-12 flex items-center justify-between border-t border-[var(--color-line)] pt-6">
        <span className="font-[family-name:var(--font-mono)] text-[10.5px] uppercase tracking-[0.18em] text-[var(--color-muted)]">
          {projects.length} projects · click to preview
        </span>
        <Link
          href="https://github.com/abdulrazzaq99"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.18em] text-[var(--color-ink-soft)] transition-colors hover:text-[var(--color-primary-glow)]"
        >
          full archive on GitHub
          <ArrowUpRight size={12} />
        </Link>
      </div>

      {/* Modal — renders only when active project is set */}
      <ProjectModal project={active} onClose={() => setActive(null)} />
    </SectionWrapper>
  );
}
