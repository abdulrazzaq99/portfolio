import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Brain, Scale, AlertTriangle, Zap } from "lucide-react";
import { projects } from "@/data/projects";
import { ArchitectureDiagram } from "@/components/sections/architecture-diagram";
import { TechBadge } from "@/components/ui/badge";
import { WorkPageShell, WorkSectionEyebrow } from "@/components/work/work-page-shell";
import { MetricsTable } from "@/components/work/metrics-table";
import { RelatedWork } from "@/components/work/related-work";
import { Embed } from "@/components/work/embed";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  const title = `${project.name} — Abdul Razzaq`;
  const description = project.problem;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [`/og/work/${project.slug}`],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`/og/work/${project.slug}`],
    },
  };
}

export default async function WorkPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  const hasContext = !!project.context;
  const hasArch = !!project.architecture;
  const hasEmbed = project.embed && project.embed.kind !== "none";
  const hasMetrics = !!project.metrics?.length;
  const hasThinking = !!project.thinking;

  return (
    <WorkPageShell project={project}>
      {/* Stack ribbon */}
      <section>
        <div className="flex flex-wrap gap-1.5">
          {project.stack.map((s) => (
            <TechBadge key={s}>{s}</TechBadge>
          ))}
        </div>
      </section>

      {/* Context */}
      <section>
        <WorkSectionEyebrow num="01" label="Context" />
        <div className="prose-readable max-w-[68ch] text-[15.5px] leading-[1.75] text-[var(--color-ink-soft)] sm:text-[16.5px]">
          {(hasContext ? project.context! : project.problem)
            .split(/\n\n+/)
            .map((para, i) => (
              <p key={i} className="mb-5 last:mb-0">
                {para}
              </p>
            ))}
        </div>
      </section>

      {/* Architecture */}
      {hasArch && (
        <section>
          <WorkSectionEyebrow num="02" label="Architecture" />
          <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-bg)]/40 p-4 backdrop-blur-sm sm:p-6">
            <ArchitectureDiagram arch={project.architecture!} />
          </div>
        </section>
      )}

      {/* The Code */}
      {hasEmbed && (
        <section>
          <WorkSectionEyebrow num="03" label="The Code" />
          <Embed embed={project.embed!} />
        </section>
      )}

      {/* Metrics */}
      {hasMetrics && (
        <section>
          <WorkSectionEyebrow num="04" label="Metrics" />
          <MetricsTable metrics={project.metrics!} />
        </section>
      )}

      {/* Lessons (Thinking blocks always visible on case-study pages) */}
      {hasThinking && (
        <section>
          <WorkSectionEyebrow num="05" label="Lessons" />
          <div className="grid gap-3 sm:grid-cols-2">
            <ThinkingBlock icon={Brain}         label="Tech decisions"  items={project.thinking!.decisions} />
            <ThinkingBlock icon={Scale}         label="Tradeoffs"       items={project.thinking!.tradeoffs} />
            <ThinkingBlock icon={AlertTriangle} label="Challenges"      items={project.thinking!.challenges} />
            <ThinkingBlock icon={Zap}           label="Optimizations"   items={project.thinking!.optimizations} />
          </div>
        </section>
      )}

      {/* Related */}
      <section>
        <WorkSectionEyebrow num="06" label="Related work" />
        <RelatedWork project={project} />
      </section>
    </WorkPageShell>
  );
}

function ThinkingBlock({
  icon: Icon,
  label,
  items,
}: {
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  label: string;
  items: string[];
}) {
  if (!items?.length) return null;
  return (
    <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-elevated)]/70 p-5 backdrop-blur-sm">
      <div className="flex items-center gap-1.5 font-[family-name:var(--font-mono)] text-[10.5px] uppercase tracking-[0.18em] text-[var(--color-primary-glow)]">
        <Icon size={11} strokeWidth={2.5} />
        {label}
      </div>
      <ul className="mt-2 space-y-2 text-[13px] leading-relaxed text-[var(--color-ink-soft)]">
        {items.map((it) => (
          <li key={it} className="flex gap-2">
            <span
              aria-hidden
              className="mt-1.5 inline-block h-1 w-1 shrink-0 rounded-full bg-[var(--color-primary-glow)]"
            />
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
