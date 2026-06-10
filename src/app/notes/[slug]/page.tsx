import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NoteShell } from "@/components/notes/note-shell";
import { getNote, isNoteVisible, publishedNotes } from "@/content/notes";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return publishedNotes().map((n) => ({ slug: n.meta.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const note = getNote(slug);
  if (!note || !isNoteVisible(note)) return {};
  const { title, dek } = note.meta;
  return {
    title,
    description: dek,
    openGraph: {
      title,
      description: dek,
      images: [`/og/notes/${slug}`],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: dek,
      images: [`/og/notes/${slug}`],
    },
  };
}

export default async function NotePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const note = getNote(slug);
  if (!note || !isNoteVisible(note)) notFound();

  const { Body, meta } = note;
  return (
    <NoteShell meta={meta}>
      <Body />
    </NoteShell>
  );
}
