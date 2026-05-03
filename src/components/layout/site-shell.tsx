"use client";

import { useCallback, useState } from "react";
import { Toaster } from "sonner";
import { Navbar } from "./navbar";
import { Terminal } from "@/components/sections/terminal";
import { useKeyboardShortcut } from "@/hooks/use-keyboard-shortcut";
import { ThinkingModeProvider } from "@/components/ui/thinking-mode";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const [termOpen, setTermOpen] = useState(false);
  const open = useCallback(() => setTermOpen(true), []);
  const close = useCallback(() => setTermOpen(false), []);

  useKeyboardShortcut({ key: "k", meta: true }, (e) => {
    e.preventDefault();
    setTermOpen((v) => !v);
  });

  return (
    <ThinkingModeProvider>
      <Navbar onOpenTerminal={open} />
      {children}
      <Terminal open={termOpen} onClose={close} />
      <FloatingTerminalButton onOpen={open} />
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: "oklch(0.10 0.012 160 / 0.96)",
            color: "oklch(0.97 0.003 145)",
            border: "1px solid oklch(1 0 0 / 0.08)",
            backdropFilter: "blur(14px)",
          },
        }}
      />
    </ThinkingModeProvider>
  );
}

function FloatingTerminalButton({ onOpen }: { onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label="Open terminal"
      className="group fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 rounded-full border border-[var(--color-line-strong)] bg-[var(--color-elevated)] px-4 py-3 text-[12.5px] font-medium tracking-tight shadow-lg backdrop-blur-xl transition-all duration-500 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
    >
      <span className="relative grid h-6 w-6 place-items-center rounded-full bg-[var(--color-ink)] text-[var(--color-bg)]">
        <span className="font-[family-name:var(--font-mono)] text-[11px] font-semibold">⌘</span>
      </span>
      <span className="hidden sm:inline">Terminal</span>
      <kbd className="rounded border border-[var(--color-line-strong)] bg-[var(--color-bg-3)] px-1.5 py-0.5 font-[family-name:var(--font-mono)] text-[10px] text-[var(--color-muted)]">
        K
      </kbd>
    </button>
  );
}
