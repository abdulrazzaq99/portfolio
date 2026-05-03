import type { ComponentType, ReactNode } from "react";

export type NoteStatus = "draft" | "published";

export type NoteMeta = {
  /** URL slug — also the file basename in src/content/notes/ */
  slug: string;
  /** Title shown in <h1> and OG */
  title: string;
  /** One-sentence dek shown on the index */
  dek: string;
  /** ISO date — used for ordering and display */
  date: string;
  /** Estimated read time, e.g. "12 min" */
  readTime: string;
  /** Drafts are excluded from the production index but routes still resolve */
  status: NoteStatus;
};

export type Note = {
  meta: NoteMeta;
  /** The essay body. Default-export from each note file. */
  Body: ComponentType<{ children?: ReactNode }>;
};

import { meta as portfolioDesignSystemMeta, default as PortfolioDesignSystemBody } from "./portfolio-design-system";

/**
 * Single source of truth for all notes. Add a new note by:
 *   1. Creating src/content/notes/<slug>.tsx with `meta` and `default`
 *   2. Adding it to this array
 */
export const notes: Note[] = [
  { meta: portfolioDesignSystemMeta, Body: PortfolioDesignSystemBody },
];

export function getNote(slug: string): Note | undefined {
  return notes.find((n) => n.meta.slug === slug);
}

export function publishedNotes(): Note[] {
  // In production, drafts are hidden from the index; in dev, all notes show.
  if (process.env.NODE_ENV === "production") {
    return notes.filter((n) => n.meta.status === "published");
  }
  return notes;
}
