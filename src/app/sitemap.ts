import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { publishedNotes } from "@/content/notes";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: base, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/notes`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/system`, changeFrequency: "yearly", priority: 0.4 },
    ...projects.map((p) => ({
      url: `${base}/work/${p.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...publishedNotes().map((n) => ({
      url: `${base}/notes/${n.meta.slug}`,
      lastModified: new Date(n.meta.date),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
