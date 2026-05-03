"use client";

import { useState } from "react";
import { ArrowUpRight, Github, Linkedin, Send } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { SectionWrapper } from "@/components/layout/section-wrapper";
import { Button } from "@/components/ui/button";
import { personal } from "@/data/personal";
import { cn } from "@/lib/utils";

const schema = z.object({
  name: z.string().min(2, "Tell me your name (2+ chars)."),
  email: z.string().email("That doesn't look like a valid email."),
  subject: z.string().min(3, "A short subject helps me prioritise."),
  message: z.string().min(20, "Give me at least 20 characters of context."),
});

type FieldErrors = Partial<Record<keyof z.infer<typeof schema>, string>>;

/**
 * Contact — editorial single column. The previous version had a glass-elevated
 * form card + ambient orb + ping animation + giant rotating arrow circle + 2
 * contact-info glass cards. All decorative chrome has been dropped to match
 * the hero's restraint. The form is just inputs on dividers.
 */
export function Contact() {
  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData) as Record<string, string>;

    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      const next: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const k = issue.path[0] as keyof FieldErrors;
        if (!next[k]) next[k] = issue.message;
      }
      setErrors(next);
      toast.error("Please fix the highlighted fields.");
      return;
    }

    setErrors({});
    setPending(true);
    try {
      // Demo: emulate API. Wire to /api/contact (Resend/EmailJS) when ready.
      await new Promise((r) => setTimeout(r, 900));
      toast.success("Message sent. I'll get back within 24 hours.");
      e.currentTarget.reset();
    } catch {
      toast.error("Couldn't send right now. Try again or email me directly.");
    } finally {
      setPending(false);
    }
  }

  return (
    <SectionWrapper id="contact" eyebrow={{ num: "04", label: "Get in touch" }}>
      <div className="grid gap-20 lg:grid-cols-[1fr_1fr] lg:gap-24">
        {/* Left column — pitch + direct paths */}
        <div className="flex flex-col gap-12">
          <h2 className="text-balance font-[family-name:var(--font-display)] text-[clamp(40px,6vw,86px)] font-normal leading-[1.0] tracking-[-0.02em]">
            Have an idea?{" "}
            <span className="italic">Let's build it.</span>
          </h2>

          <div className="space-y-2">
            <span className="font-[family-name:var(--font-mono)] text-[10.5px] uppercase tracking-[0.18em] text-[var(--color-muted)]">
              Direct
            </span>
            <a
              href={`mailto:${personal.email}`}
              className="group inline-flex items-baseline gap-3 text-2xl font-medium tracking-tight text-[var(--color-ink)] transition-colors hover:text-[var(--color-primary-glow)] sm:text-3xl"
            >
              {personal.email}
              <ArrowUpRight
                size={18}
                className="translate-y-1 transition-transform duration-300 group-hover:-translate-y-0 group-hover:translate-x-0.5"
              />
            </a>
          </div>

          <div className="space-y-2">
            <span className="font-[family-name:var(--font-mono)] text-[10.5px] uppercase tracking-[0.18em] text-[var(--color-muted)]">
              Elsewhere
            </span>
            <ul className="flex flex-col">
              <SocialRow href={personal.socials.linkedin} icon={Linkedin} label="LinkedIn" handle="@abdul-razzaq" />
              <SocialRow href={personal.socials.github} icon={Github} label="GitHub" handle="@abdulrazzaq99" />
            </ul>
          </div>

          <div className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.18em] text-[var(--color-muted)]">
            Response within 24h · Mon–Fri · {personal.timezone}
          </div>
        </div>

        {/* Right column — form (no card chrome, just fields on dividers) */}
        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
          <Field name="name" label="Name" placeholder="Your name" error={errors.name} />
          <Field name="email" label="Email" type="email" placeholder="you@company.com" error={errors.email} />
          <Field name="subject" label="Subject" placeholder="A new project / a quick question" error={errors.subject} />
          <Field
            name="message"
            label="Message"
            placeholder="Tell me about the project, the timeline, and what success looks like."
            error={errors.message}
            multiline
          />

          <div className="flex items-center justify-between gap-3 pt-3">
            <span className="font-[family-name:var(--font-mono)] text-[10.5px] uppercase tracking-[0.18em] text-[var(--color-muted)]">
              Or just email me
            </span>
            <Button type="submit" disabled={pending} size="md">
              {pending ? "Sending…" : "Send message"}
              <Send size={13} className={cn("transition-transform", !pending && "group-hover:translate-x-0.5 group-hover:-translate-y-0.5")} />
            </Button>
          </div>
        </form>
      </div>
    </SectionWrapper>
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
    "w-full bg-transparent border-0 border-b border-[var(--color-line-strong)] px-0 py-2.5 text-[15px] text-[var(--color-ink)] placeholder:text-[var(--color-muted-2)] " +
    "transition-colors outline-none focus:border-[var(--color-primary-glow)]";
  return (
    <label className="block">
      <div className="mb-2 flex items-baseline justify-between gap-2">
        <span className="font-[family-name:var(--font-mono)] text-[10.5px] uppercase tracking-[0.18em] text-[var(--color-muted)]">
          {label}
        </span>
        {error && <span className="font-[family-name:var(--font-mono)] text-[10.5px] uppercase tracking-[0.18em] text-[oklch(0.55_0.18_25)]">↳ {error}</span>}
      </div>
      {multiline ? (
        <textarea
          name={name}
          rows={4}
          placeholder={placeholder}
          className={cn(base, "resize-none", error && "border-[oklch(0.55_0.18_25_/_0.6)]")}
        />
      ) : (
        <input
          name={name}
          type={type}
          placeholder={placeholder}
          className={cn(base, error && "border-[oklch(0.55_0.18_25_/_0.6)]")}
        />
      )}
    </label>
  );
}

function SocialRow({
  href,
  icon: Icon,
  label,
  handle,
}: {
  href: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  label: string;
  handle: string;
}) {
  return (
    <li>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center justify-between gap-4 border-b border-[var(--color-line)] py-3 transition-colors hover:text-[var(--color-primary-glow)]"
      >
        <span className="flex items-center gap-3 font-medium tracking-tight">
          <Icon size={16} strokeWidth={1.75} />
          {label}
        </span>
        <span className="flex items-center gap-2 font-[family-name:var(--font-mono)] text-[11.5px] text-[var(--color-muted)] group-hover:text-[var(--color-primary-glow)]">
          {handle}
          <ArrowUpRight size={11} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </a>
    </li>
  );
}
