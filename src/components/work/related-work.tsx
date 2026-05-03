import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { projects, type Project } from "@/data/projects";

/** Resolve `relatedSlugs` to projects. If absent, auto-pick: same category, most recent first, top up by year. */
function resolveRelated(current: Project): Project[] {
  if (current.relatedSlugs?.length) {
    return current.relatedSlugs
      .map((s) => projects.find((p) => p.slug === s))
      .filter((p): p is Project => Boolean(p));
  }

  const sameCat = projects
    .filter((p) => p.slug !== current.slug && p.category === current.category)
    .sort((a, b) => b.year - a.year);

  const filler = projects
    .filter((p) => p.slug !== current.slug && p.category !== current.category)
    .sort((a, b) => b.year - a.year);

  return [...sameCat, ...filler].slice(0, 3);
}

export function RelatedWork({ project }: { project: Project }) {
  const related = resolveRelated(project);
  if (!related.length) return null;

  return (
    <ul className="grid gap-3 sm:grid-cols-3">
      {related.slice(0, 3).map((p) => (
        <li key={p.slug}>
          <Link
            href={`/work/${p.slug}`}
            className="group flex h-full flex-col justify-between gap-3 rounded-2xl border border-[var(--color-line)] bg-[var(--color-bg-2)]/60 p-5 transition-colors hover:border-[var(--color-primary-glow)]/50"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="rounded-md border border-[var(--color-primary-glow)]/30 bg-[var(--color-primary-glow)]/10 px-2 py-0.5 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider text-[var(--color-primary-glow)]">
                &gt; {p.category}
              </span>
              <ArrowUpRight
                size={14}
                className="text-[var(--color-muted)] transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--color-primary-glow)]"
              />
            </div>
            <div>
              <h3 className="text-[16px] font-semibold tracking-tight text-[var(--color-ink)] transition-colors group-hover:text-[var(--color-primary-glow)]">
                {p.name}
              </h3>
              <p className="mt-1 line-clamp-2 text-[12.5px] leading-relaxed text-[var(--color-muted)]">
                {p.problem}
              </p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
