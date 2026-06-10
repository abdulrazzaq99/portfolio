"use client";

import { useState } from "react";
import { ArrowUpRight, Send } from "lucide-react";
import { toast } from "sonner";
import { SectionWrapper } from "@/components/layout/section-wrapper";
import { SectionHeader } from "@/components/layout/section-header";
import { personal } from "@/data/personal";
import { contactSchema } from "@/lib/contact-schema";
import { cn } from "@/lib/utils";

type FieldErrors = Partial<Record<"name" | "email" | "message", string>>;

/**
 * Contact — minimal mono block. Two columns of plain text directories +
 * a flat form (no card chrome, just border-bottom inputs).
 */
export function Contact() {
  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData) as Record<string, string>;
    const parsed = contactSchema.safeParse(data);
    if (!parsed.success) {
      const next: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const k = issue.path[0] as keyof FieldErrors;
        if (!next[k]) next[k] = issue.message;
      }
      setErrors(next);
      toast.error("Fix the highlighted fields.");
      return;
    }
    setErrors({});
    setPending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (!res.ok) throw new Error(`contact api ${res.status}`);
      toast.success("Message sent. Reply within 24h.");
      form.reset();
    } catch {
      // No email service configured (or it failed) — hand off to the
      // visitor's mail client so the message isn't silently lost.
      const { name, email, message } = parsed.data;
      const subject = encodeURIComponent(`Portfolio contact — ${name}`);
      const body = encodeURIComponent(`From: ${name} <${email}>\n\n${message}`);
      window.location.href = `mailto:${personal.email}?subject=${subject}&body=${body}`;
      toast.error("Email service unavailable — opening your mail app instead.");
    } finally {
      setPending(false);
    }
  }

  return (
    <SectionWrapper id="contact" containerSize="wide">
      <SectionHeader
        num="06"
        section="SECTION"
        keywords={["CONTACT", "SIGNAL", "INDEX"]}
        title={{ left: "GET IN", right: "TOUCH" }}
        rightStatus="AVAILABLE"
        subSpec={{ num: "06", label: "SIGNAL", meta: "direct line · email · form" }}
      />

      <div className="grid gap-16 lg:grid-cols-[1fr_1fr] lg:gap-24">
        {/* Left — direct paths */}
        <div className="space-y-12">
          <DirectoryRow label="Email" value={personal.email} href={`mailto:${personal.email}`} />
          <DirectoryRow label="GitHub" value="@abdulrazzaq99" href={personal.socials.github} external />
          <DirectoryRow label="LinkedIn" value="@abdul-razzaq" href={personal.socials.linkedin} external />
          <DirectoryRow label="Upwork" value="View profile" href={personal.socials.upwork} external />

          <div className="border-t border-[var(--color-line)] pt-6 font-[family-name:var(--font-mono)] text-[10.5px] uppercase tracking-[0.22em] text-[var(--color-muted)]">
            <p>Response within 24h · Mon–Fri · {personal.timezone}</p>
            <p className="mt-1 text-[var(--color-muted-2)]">{personal.coords}</p>
          </div>
        </div>

        {/* Right — minimal form */}
        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
          <Field name="name" label="Name" placeholder="Your name" error={errors.name} />
          <Field name="email" label="Email" type="email" placeholder="you@company.com" error={errors.email} />
          <Field name="message" label="Message" placeholder="Project, timeline, what success looks like." error={errors.message} multiline />
          <button
            type="submit"
            disabled={pending}
            className="group mt-2 inline-flex items-center justify-between border border-[var(--color-line-strong)] bg-transparent px-5 py-3.5 font-[family-name:var(--font-mono)] text-[11.5px] uppercase tracking-[0.22em] text-[var(--color-ink)] transition-colors hover:border-[var(--color-primary-glow)] hover:text-[var(--color-primary-glow)] disabled:opacity-50"
          >
            <span>{pending ? "Sending..." : "Send message"}</span>
            <Send size={13} className={cn("transition-transform", !pending && "group-hover:translate-x-0.5 group-hover:-translate-y-0.5")} />
          </button>
        </form>
      </div>
    </SectionWrapper>
  );
}

function DirectoryRow({ label, value, href, external }: { label: string; value: string; href: string; external?: boolean }) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="group grid grid-cols-[100px_1fr_20px] items-baseline gap-4 border-b border-[var(--color-line)] pb-4 transition-colors"
    >
      <span className="font-[family-name:var(--font-mono)] text-[10.5px] uppercase tracking-[0.22em] text-[var(--color-muted)] group-hover:text-[var(--color-ink-soft)]">
        {label}
      </span>
      <span className="text-[18px] font-medium tracking-tight text-[var(--color-ink)] transition-colors group-hover:text-[var(--color-primary-glow)] sm:text-[20px]">
        {value}
      </span>
      <ArrowUpRight size={14} className="text-[var(--color-muted-2)] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--color-primary-glow)]" />
    </a>
  );
}

function Field({
  name,
  label,
  placeholder,
  type = "text",
  error,
  multiline,
}: {
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  error?: string;
  multiline?: boolean;
}) {
  const base =
    "w-full bg-transparent border-0 border-b border-[var(--color-line-strong)] px-0 py-3 text-[15px] text-[var(--color-ink)] placeholder:text-[var(--color-muted-2)] " +
    "transition-colors outline-none focus:border-[var(--color-primary-glow)]";
  return (
    <label className="block">
      <div className="mb-2 flex items-baseline justify-between gap-2">
        <span className="font-[family-name:var(--font-mono)] text-[10.5px] uppercase tracking-[0.22em] text-[var(--color-muted)]">
          {label}
        </span>
        {error && (
          <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.18em] text-[oklch(0.6_0.18_25)]">
            ↳ {error}
          </span>
        )}
      </div>
      {multiline ? (
        <textarea name={name} rows={4} placeholder={placeholder} className={cn(base, "resize-none", error && "border-[oklch(0.55_0.18_25_/_0.6)]")} />
      ) : (
        <input name={name} type={type} placeholder={placeholder} className={cn(base, error && "border-[oklch(0.55_0.18_25_/_0.6)]")} />
      )}
    </label>
  );
}
