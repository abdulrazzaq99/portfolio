"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { Brain } from "lucide-react";
import { cn } from "@/lib/utils";

type Ctx = { on: boolean; toggle: () => void; set: (v: boolean) => void };

const ThinkingModeContext = createContext<Ctx | null>(null);

const STORAGE_KEY = "ar-thinking-mode";

export function ThinkingModeProvider({ children }: { children: ReactNode }) {
  const [on, setOn] = useState(false);

  // Hydrate from localStorage after mount (no SSR mismatch)
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === "1") setOn(true);
    } catch {}
  }, []);

  // Persist
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, on ? "1" : "0");
    } catch {}
    document.documentElement.dataset.thinking = on ? "on" : "off";
  }, [on]);

  const toggle = useCallback(() => setOn((v) => !v), []);
  const set = useCallback((v: boolean) => setOn(v), []);

  return (
    <ThinkingModeContext.Provider value={{ on, toggle, set }}>
      {children}
    </ThinkingModeContext.Provider>
  );
}

export function useThinkingMode() {
  const ctx = useContext(ThinkingModeContext);
  if (!ctx) throw new Error("useThinkingMode must be used inside ThinkingModeProvider");
  return ctx;
}

export function ThinkingModeToggle({ className }: { className?: string }) {
  const { on, toggle } = useThinkingMode();
  return (
    <button
      type="button"
      onClick={toggle}
      role="switch"
      aria-checked={on}
      aria-label="Toggle developer thinking mode"
      title="Reveal tech decisions, tradeoffs, challenges and optimizations on every project"
      className={cn(
        "group inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[12px] font-medium tracking-tight",
        "backdrop-blur-md transition-all duration-300",
        on
          ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-[var(--color-bg)]"
          : "border-[var(--color-line-strong)] bg-[var(--color-elevated)] text-[var(--color-ink-soft)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]",
        className,
      )}
    >
      <Brain
        size={13}
        strokeWidth={2.25}
        className={cn("transition-transform duration-500", on && "scale-110 rotate-[8deg]")}
      />
      <span className="hidden md:inline">Thinking Mode</span>
      <span
        aria-hidden
        className={cn(
          "ml-1 inline-block h-3.5 w-7 rounded-full border transition-colors duration-300",
          on ? "border-white/30 bg-white/20" : "border-[var(--color-line-strong)] bg-[var(--color-bg-3)]",
        )}
      >
        <span
          className={cn(
            "block h-3 w-3 translate-y-[0.5px] rounded-full bg-current transition-all duration-300",
            on ? "translate-x-3.5 text-[var(--color-bg)]" : "translate-x-0.5 text-[var(--color-muted)]",
          )}
        />
      </span>
    </button>
  );
}
