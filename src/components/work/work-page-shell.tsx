import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight, Github } from "lucide-react";
import { Container } from "@/components/layout/container";
import type { Project } from "@/data/projects";

export function WorkPageShell({
  project,
  children,
}: {
  project: Project;
  children: ReactNode;
}) {
  const visibilityLabel =
    project.visibility === "private" ? "● private" :
    project.visibility === "collaborator" ? "● collaborator" :
    "● public";

  return (
    <article className="relative pt-32 pb-24 sm:pt-40">
      {/* Ambient orb — same neon language as hero */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-96 w-[80%] -translate-x-1/2 rounded-full bg-[oklch(0.86_0.27_152_/_0.10)] blur-[140px]"
      />

      <Container>
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-2 font-[family-name:var(--font-mono)] text-[11px] tracking-[0.16em] text-[var(--color-muted)]">
            <li>
              <span className="text-[var(--color-primary-glow)]">//</span>
            </li>
            <li>
              <Link href="/#work" className="uppercase transition-colors hover:text-[var(--color-primary-glow)]">
                /work
              </Link>
            </li>
            <li className="text-[var(--color-muted-2)]">·</li>
            <li className="uppercase text-[var(--color-ink-soft)]">{project.slug}</li>
          </ol>
        </nav>

        {/* H1 */}
        <h1 className="text-balance text-[clamp(40px,7vw,108px)] font-medium leading-[0.94] tracking-[-0.04em]">
          {project.name}
          <span
            className="text-[var(--color-primary-glow)]"
            style={{ textShadow: "0 0 16px oklch(0.86 0.27 152 / 0.5)" }}
          >.</span>
        </h1>

        {/* Meta strip */}
        <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 font-[family-name:var(--font-mono)] text-[12px] text-[var(--color-muted)]">
          <span className="text-[var(--color-primary-glow)]">{project.category}</span>
          <span aria-hidden>·</span>
          <span>{project.year}</span>
          <span aria-hidden>·</span>
          <span>{visibilityLabel}</span>
          {project.github && (
            <>
              <span aria-hidden>·</span>
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 transition-colors hover:text-[var(--color-primary-glow)]"
              >
                <Github size={12} /> source
                <ArrowUpRight size={11} />
              </a>
            </>
          )}
          {project.demo && (
            <>
              <span aria-hidden>·</span>
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 transition-colors hover:text-[var(--color-primary-glow)]"
              >
                live <ArrowUpRight size={11} />
              </a>
            </>
          )}
        </div>

        {/* Body */}
        <div className="mt-16 space-y-20">
          {children}
        </div>
      </Container>
    </article>
  );
}

/** Section eyebrow used inside <WorkPageShell> children. */
export function WorkSectionEyebrow({ num, label }: { num: string; label: string }) {
  return (
    <div className="mb-6 flex items-center gap-3 font-[family-name:var(--font-mono)] text-[11px] tracking-[0.16em] text-[var(--color-muted)]">
      <span
        className="text-[var(--color-primary-glow)]"
        style={{ textShadow: "0 0 10px oklch(0.86 0.27 152 / 0.45)" }}
      >
        //
      </span>
      <span className="text-[var(--color-primary-neon)]">{num}</span>
      <span className="text-[var(--color-muted-2)]">·</span>
      <span className="uppercase">{label}</span>
      <span className="ml-2 inline-block h-px flex-1 max-w-[120px] bg-gradient-to-r from-[var(--color-line-strong)] to-transparent" />
    </div>
  );
}
