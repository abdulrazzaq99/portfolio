"use client";

import dynamic from "next/dynamic";
import { EmbedFallback } from "./embed-fallback";
import { EmbedColab } from "./embed-colab";
import { EmbedVideo } from "./embed-video";
import type { Project } from "@/data/projects";

// Sandpack is heavy (~80 kB gz) — only loaded on routes that use it.
const EmbedSandbox = dynamic(
  () => import("./embed-sandbox").then((m) => m.EmbedSandbox),
  {
    ssr: false,
    loading: () => (
      <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-terminal)] p-8 text-center font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.16em] text-[var(--color-muted)]">
        loading sandbox…
      </div>
    ),
  },
);

export function Embed({ embed }: { embed: NonNullable<Project["embed"]> }) {
  switch (embed.kind) {
    case "fallback":
      return <EmbedFallback lang={embed.lang} code={embed.code} caption={embed.caption} />;
    case "colab":
      return <EmbedColab url={embed.url} title={embed.title} />;
    case "video":
      return <EmbedVideo src={embed.src} poster={embed.poster} caption={embed.caption} />;
    case "sandpack":
      return <EmbedSandbox files={embed.files} entry={embed.entry} template={embed.template} />;
    case "none":
      return null;
    default: {
      // Exhaustiveness check — TypeScript flags any new variant added without a case.
      const _exhaustive: never = embed;
      return _exhaustive;
    }
  }
}
