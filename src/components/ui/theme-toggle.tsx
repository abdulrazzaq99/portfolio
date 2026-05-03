"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

type Theme = "light" | "dark";

/**
 * Theme toggle. Reads the actual current theme from
 * `document.documentElement.dataset.theme` on mount (set by the inline script
 * in `layout.tsx` before paint to prevent FOUC). Click flips the theme,
 * persists to localStorage, and updates the dataset attribute. The icon
 * shown represents what you'd switch TO — sun in dark mode, moon in light.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const current = document.documentElement.dataset.theme as Theme | undefined;
    if (current === "light" || current === "dark") setTheme(current);
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try {
      window.localStorage.setItem("theme", next);
    } catch {
      /* ignore */
    }
  };

  // Show a stable invisible button until mounted to keep layout but avoid hydration mismatch
  return (
    <button
      type="button"
      onClick={toggle}
      role="switch"
      aria-checked={theme === "light"}
      aria-label={
        mounted
          ? theme === "dark"
            ? "Switch to light mode"
            : "Switch to dark mode"
          : "Toggle theme"
      }
      title={mounted ? (theme === "dark" ? "Switch to light mode" : "Switch to dark mode") : "Toggle theme"}
      className={cn(
        "relative grid h-9 w-9 cursor-pointer place-items-center overflow-hidden rounded-full border",
        "border-[var(--color-line-strong)] bg-[var(--color-elevated)] text-[var(--color-ink-soft)]",
        "backdrop-blur transition-colors duration-300",
        "hover:border-[var(--color-primary-glow)] hover:text-[var(--color-primary-glow)]",
        className,
      )}
    >
      {/* Sun — visible in dark mode (click to go to light) */}
      <Sun
        size={14}
        strokeWidth={2}
        className={cn(
          "absolute transition-all duration-300 ease-out",
          mounted && theme === "dark"
            ? "rotate-0 scale-100 opacity-100"
            : "-rotate-90 scale-50 opacity-0",
        )}
      />
      {/* Moon — visible in light mode (click to go to dark) */}
      <Moon
        size={14}
        strokeWidth={2}
        className={cn(
          "absolute transition-all duration-300 ease-out",
          mounted && theme === "light"
            ? "rotate-0 scale-100 opacity-100"
            : "rotate-90 scale-50 opacity-0",
        )}
      />
    </button>
  );
}

/**
 * Inline script source. Stringified and injected into <body> as the first
 * child via `dangerouslySetInnerHTML` so it runs synchronously before any
 * other element paints. No FOUC.
 *
 * Reads localStorage first, falls back to system preference, defaults to dark.
 */
export const themeInitScript = `(function(){try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';}document.documentElement.dataset.theme=t;}catch(e){document.documentElement.dataset.theme='dark';}})();`;
