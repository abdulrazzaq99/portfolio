"use client";

import { useEffect, useRef } from "react";

type Combo = { key: string; meta?: boolean; ctrl?: boolean; shift?: boolean };

export function useKeyboardShortcut(combo: Combo, handler: (e: KeyboardEvent) => void) {
  // Keep the latest handler in a ref so callers can pass inline functions
  // without re-registering the listener every render.
  const handlerRef = useRef(handler);
  useEffect(() => {
    handlerRef.current = handler;
  });

  const { key, meta, ctrl, shift } = combo;
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== key.toLowerCase()) return;
      if (meta && !(e.metaKey || e.ctrlKey)) return;
      if (ctrl && !e.ctrlKey) return;
      if (shift && !e.shiftKey) return;
      handlerRef.current(e);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [key, meta, ctrl, shift]);
}
