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
  /** Drafts are visible in dev only — excluded from the production index and routes */
  status: NoteStatus;
  /** Optional pull-quote shown when this note is featured at the top of the index */
  excerpt?: string;
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

/** Drafts are visible in dev for previewing, hidden everywhere in production. */
export function isNoteVisible(note: Note): boolean {
  return note.meta.status === "published" || process.env.NODE_ENV !== "production";
}

export function publishedNotes(): Note[] {
  return notes.filter(isNoteVisible);
}
