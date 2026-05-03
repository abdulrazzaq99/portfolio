import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NoteShell } from "@/components/notes/note-shell";
import { getNote, notes } from "@/content/notes";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return notes.map((n) => ({ slug: n.meta.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const note = getNote(slug);
  if (!note) return {};
  const { title, dek } = note.meta;
  return {
    title: `${title} — Abdul Razzaq`,
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
  if (!note) notFound();

  const { Body, meta } = note;
  return (
    <NoteShell meta={meta}>
      <Body />
    </NoteShell>
  );
}
