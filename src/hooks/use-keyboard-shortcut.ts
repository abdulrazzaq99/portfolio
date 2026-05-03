"use client";

import { useEffect } from "react";

type Combo = { key: string; meta?: boolean; ctrl?: boolean; shift?: boolean };

export function useKeyboardShortcut(combo: Combo, handler: (e: KeyboardEvent) => void) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== combo.key.toLowerCase()) return;
      if (combo.meta && !(e.metaKey || e.ctrlKey)) return;
      if (combo.ctrl && !e.ctrlKey) return;
      if (combo.shift && !e.shiftKey) return;
      handler(e);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [combo, handler]);
}
