"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, X } from "lucide-react";
import { sections } from "@/lib/sections";
import { projects } from "@/data/projects";
import { skillGroups } from "@/data/skills";
import { personal } from "@/data/personal";
import { publishedNotes, notes as allNotes } from "@/content/notes";
import { useThinkingMode } from "@/components/ui/thinking-mode";
import { cn } from "@/lib/utils";

type Line =
  | { kind: "input"; text: string }
  | { kind: "output"; text: string; mute?: boolean; accent?: boolean }
  | { kind: "block"; rows: { label: string; value: string }[] };

const HELP_TEXT = [
  ["help",          "List all commands"],
  ["whoami",        "About this portfolio"],
  ["show projects", "Display recent work"],
  ["show skills",   "Capabilities matrix"],
  ["ls notes",      "List published essays"],
  ["goto <route>",  "Jump to a section or page (about, work, contact, notes, system)"],
  ["thinking on/off","Toggle developer thinking mode on project cards"],
  ["socials",       "Open social links"],
  ["email",         "Compose email to me"],
  ["download cv",   "Download resume"],
  ["theme",         "Toggle dark / light"],
  ["clear",         "Reset terminal"],
  ["exit / esc",    "Close terminal"],
];

/** Routes reachable via `goto <id>` that aren't on the home page */
const EXTERNAL_ROUTES: Record<string, string> = {
  notes: "/notes",
  system: "/system",
};

export function Terminal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [lines, setLines] = useState<Line[]>([
    { kind: "output", text: `Welcome to ${personal.name.split(" ")[0]}.dev — interactive shell`, accent: true },
    { kind: "output", text: "Type `help` to list commands. Press ↑/↓ to navigate history.", mute: true },
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [hIdx, setHIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const thinking = useThinkingMode();

  // ⌘K / Ctrl+K to toggle handled by parent layout

  // Auto-focus when opened
  useEffect(() => {
    if (open) requestAnimationFrame(() => inputRef.current?.focus());
  }, [open]);

  // Auto-scroll on new lines
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  // Esc closes
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const suggestions = useMemo(() => {
    if (!input.trim()) return [];
    const all = [
      "help", "whoami", "show projects", "show skills", "ls notes",
      "socials", "email", "download cv", "theme",
      "thinking on", "thinking off", "clear", "exit",
      ...sections.map((s) => `goto ${s.id}`),
      ...Object.keys(EXTERNAL_ROUTES).map((k) => `goto ${k}`),
    ];
    const q = input.toLowerCase();
    return all.filter((c) => c.startsWith(q)).slice(0, 4);
  }, [input]);

  function pushOutput(text: string, opts: { mute?: boolean; accent?: boolean } = {}) {
    setLines((prev) => [...prev, { kind: "output", text, ...opts } as Line]);
  }

  function pushBlock(rows: { label: string; value: string }[]) {
    setLines((prev) => [...prev, { kind: "block", rows }]);
  }

  function handleCommand(raw: string) {
    const cmd = raw.trim();
    if (!cmd) return;

    setLines((prev) => [...prev, { kind: "input", text: cmd }]);
    setHistory((h) => [cmd, ...h].slice(0, 30));
    setHIdx(-1);

    const lower = cmd.toLowerCase();

    if (lower === "help") {
      pushBlock(HELP_TEXT.map(([k, v]) => ({ label: k, value: v })));
      return;
    }

    if (lower === "whoami") {
      pushOutput(`${personal.name} — ${personal.role}`);
      pushOutput(personal.tagline, { mute: true });
      pushOutput(`Location: ${personal.location} · ${personal.timezone}`, { mute: true });
      return;
    }

    if (lower === "show projects" || lower === "projects") {
      pushBlock(
        projects.map((p) => ({
          label: `${p.year} · ${p.category}`,
          value: `${p.name} — ${p.impact.split(".")[0]}.`,
        })),
      );
      pushOutput("Tip: type `goto work` to scroll to the gallery.", { mute: true });
      return;
    }

    if (lower === "show skills" || lower === "skills") {
      const lines: { label: string; value: string }[] = [];
      for (const g of skillGroups) {
        lines.push({ label: g.title.toUpperCase(), value: g.items.map((s) => s.name).join(" · ") });
      }
      pushBlock(lines);
      return;
    }

    if (lower.startsWith("goto ")) {
      const id = lower.slice(5).trim();

      // External route (other Next.js page)?
      const externalHref = EXTERNAL_ROUTES[id];
      if (externalHref) {
        pushOutput(`Navigating to ${externalHref}...`, { accent: true });
        setTimeout(() => {
          window.location.href = externalHref;
          onClose();
        }, 250);
        return;
      }

      // In-page section?
      const target = sections.find((s) => s.id === id);
      if (!target) {
        const known = [...sections.map((s) => s.id), ...Object.keys(EXTERNAL_ROUTES)].join(", ");
        pushOutput(`Unknown destination: ${id}. Try: ${known}`, { mute: true });
        return;
      }
      pushOutput(`Scrolling to #${target.id}...`, { accent: true });
      const el = document.getElementById(target.id);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          onClose();
        }, 350);
      }
      return;
    }

    if (lower === "ls notes" || lower === "notes") {
      const list = publishedNotes();
      if (list.length === 0) {
        pushOutput("No published notes yet — drafts in flight.", { mute: true });
        if (allNotes.length > 0) {
          pushOutput(`(${allNotes.length} draft${allNotes.length === 1 ? "" : "s"} hidden in production.)`, { mute: true });
        }
        return;
      }
      pushBlock(
        list.map((n) => ({
          label: n.meta.date.slice(0, 10),
          value: `${n.meta.title} — ${n.meta.readTime}`,
        })),
      );
      pushOutput("Tip: type `goto notes` to open the index.", { mute: true });
      return;
    }

    if (lower === "socials" || lower === "links") {
      pushBlock([
        { label: "GitHub",   value: personal.socials.github },
        { label: "LinkedIn", value: personal.socials.linkedin },
        { label: "Upwork",   value: personal.socials.upwork },
      ]);
      return;
    }

    if (lower === "email" || lower === "contact") {
      pushOutput(`Opening mail client to ${personal.email}...`, { accent: true });
      window.location.href = `mailto:${personal.email}`;
      return;
    }

    if (lower === "download cv" || lower === "cv" || lower === "resume") {
      pushOutput("Downloading resume.pdf...", { accent: true });
      const a = document.createElement("a");
      a.href = personal.resume;
      a.download = "Abdul-Razzaq-CV.pdf";
      a.click();
      return;
    }

    if (lower === "thinking on" || lower === "thinking off" || lower === "thinking") {
      const target = lower === "thinking on" ? true : lower === "thinking off" ? false : !thinking.on;
      thinking.set(target);
      pushOutput(`Thinking mode → ${target ? "ON" : "off"}`, { accent: true });
      pushOutput(
        target
          ? "Project cards now reveal Tech decisions, Tradeoffs, Challenges, and Optimizations."
          : "Project cards collapsed back to their default view.",
        { mute: true },
      );
      return;
    }

    if (lower === "theme" || lower === "theme dark" || lower === "theme light") {
      const root = document.documentElement;
      root.classList.toggle("dark");
      pushOutput(`Theme toggled → ${root.classList.contains("dark") ? "dark" : "light"}`, { accent: true });
      return;
    }

    if (lower === "clear") {
      setLines([]);
      return;
    }

    if (lower === "exit" || lower === "close") {
      onClose();
      return;
    }

    if (lower === "sudo make me a sandwich") {
      pushOutput("Nice try.", { accent: true });
      return;
    }

    pushOutput(`Command not found: ${cmd}. Type \`help\` for the full list.`, { mute: true });
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      handleCommand(input);
      setInput("");
    } else if (e.key === "Tab" && suggestions[0]) {
      e.preventDefault();
      setInput(suggestions[0]);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.min(hIdx + 1, history.length - 1);
      setHIdx(next);
      setInput(history[next] ?? "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = Math.max(hIdx - 1, -1);
      setHIdx(next);
      setInput(next === -1 ? "" : history[next] ?? "");
    }
  }

  return (
    <div
      className={cn(
        "fixed inset-0 z-[60] flex items-start justify-center px-4 py-[10vh] transition-all duration-300",
        open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
      )}
      role="dialog"
      aria-modal="true"
      aria-label="Command terminal"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[oklch(0.18_0.012_160_/_0.45)] backdrop-blur-md"
        onClick={onClose}
      />

      {/* Window */}
      <div
        className={cn(
          "relative w-full max-w-2xl overflow-hidden rounded-2xl border border-[var(--color-line-strong)]",
          "bg-[oklch(0.10_0.012_160_/_0.96)] text-[var(--color-bg)] shadow-[0_50px_100px_-30px_oklch(0_0_0_/_0.4)]",
          "transition-all duration-300",
          open ? "translate-y-0 scale-100" : "translate-y-3 scale-[0.98]",
        )}
      >
        {/* Title bar */}
        <header className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[oklch(0.78_0.150_25)]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[oklch(0.85_0.140_85)]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[oklch(0.72_0.170_153)]" />
            <span className="ml-3 font-[family-name:var(--font-mono)] text-[11px] tracking-[0.16em] text-white/50">
              {personal.name.toLowerCase().replace(" ", "-")}@portfolio:~$
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close terminal"
            className="rounded-full p-1 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X size={14} />
          </button>
        </header>

        {/* Output */}
        <div
          ref={scrollRef}
          className="max-h-[55vh] min-h-[280px] overflow-y-auto px-4 py-4 font-[family-name:var(--font-mono)] text-[13px] leading-[1.7]"
        >
          {lines.map((line, i) => {
            if (line.kind === "input") {
              return (
                <div key={i} className="flex gap-2">
                  <span className="text-[var(--color-primary-glow)]">$</span>
                  <span className="text-white/90">{line.text}</span>
                </div>
              );
            }
            if (line.kind === "output") {
              return (
                <div
                  key={i}
                  className={cn(
                    "pl-4",
                    line.mute && "text-white/45",
                    line.accent && "text-[var(--color-primary-glow)]",
                    !line.mute && !line.accent && "text-white/85",
                  )}
                >
                  {line.text}
                </div>
              );
            }
            return (
              <div key={i} className="my-2 grid gap-1 pl-4">
                {line.rows.map((r, j) => (
                  <div key={j} className="grid grid-cols-[140px_1fr] gap-2 text-[12.5px]">
                    <span className="text-[var(--color-primary-glow)]">{r.label}</span>
                    <span className="text-white/80">{r.value}</span>
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        {/* Input */}
        <div className="border-t border-white/10 px-4 py-3">
          <div className="flex items-center gap-2">
            <ArrowRight size={13} className="text-[var(--color-primary-glow)]" />
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              spellCheck={false}
              autoCapitalize="off"
              autoCorrect="off"
              placeholder="Type a command — `help` to begin"
              className="w-full bg-transparent font-[family-name:var(--font-mono)] text-[13px] text-white placeholder:text-white/30 focus:outline-none"
            />
            <kbd className="hidden rounded border border-white/15 bg-white/5 px-1.5 py-0.5 font-[family-name:var(--font-mono)] text-[10px] text-white/50 sm:inline">
              ⏎
            </kbd>
          </div>
          {suggestions.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setInput(s)}
                  className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 font-[family-name:var(--font-mono)] text-[11px] text-white/70 hover:border-[var(--color-primary-glow)]/40 hover:text-[var(--color-primary-glow)]"
                >
                  {s}
                </button>
              ))}
              <span className="self-center font-[family-name:var(--font-mono)] text-[10px] text-white/40">
                Tab to autocomplete
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

