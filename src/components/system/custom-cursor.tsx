"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Element-morphing custom cursor.
 *
 * - Free state: small emerald dot follows the pointer with rAF lerp.
 * - Snap state: when over an interactive element (a, button, [role=button],
 *   form fields, or any element with `data-cursor`), the cursor inflates to
 *   wrap the element's bounds with a thin emerald outline + corner +-marks.
 * - Optional label: read from `data-cursor-label` (e.g. "OPEN", "READ").
 *
 * Auto-disables on touch devices and when prefers-reduced-motion is reduce.
 * When disabled, the native cursor is restored and the component renders
 * nothing.
 */
export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const labelRef = useRef<HTMLSpanElement | null>(null);
  const stateRef = useRef({
    // Pointer
    px: 0,
    py: 0,
    // Cursor center (lerped)
    cx: 0,
    cy: 0,
    // Target dimensions
    tw: 8,
    th: 8,
    // Current dimensions (lerped)
    cw: 8,
    ch: 8,
    // Snapped to an element?
    snapped: false,
    // Target rect center (when snapped) — overrides px/py for snap
    targetCx: 0,
    targetCy: 0,
    radius: 999,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const touch = window.matchMedia("(hover: none), (pointer: coarse)").matches;
    if (reduce || touch) {
      setEnabled(false);
      return;
    }
    setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    if (typeof window === "undefined") return;

    document.documentElement.classList.add("custom-cursor-active");

    const s = stateRef.current;
    s.px = window.innerWidth / 2;
    s.py = window.innerHeight / 2;
    s.cx = s.px;
    s.cy = s.py;

    const onMove = (e: PointerEvent) => {
      s.px = e.clientX;
      s.py = e.clientY;
    };

    function findInteractive(el: Element | null): HTMLElement | null {
      while (el && el !== document.body) {
        if (!(el instanceof HTMLElement)) {
          el = el.parentElement;
          continue;
        }
        if (el.dataset.cursor === "ignore") return null;
        if (el.dataset.cursor) return el;
        const tag = el.tagName;
        if (
          tag === "A" ||
          tag === "BUTTON" ||
          tag === "INPUT" ||
          tag === "TEXTAREA" ||
          tag === "SELECT" ||
          el.getAttribute("role") === "button"
        ) {
          return el;
        }
        el = el.parentElement;
      }
      return null;
    }

    const onOver = (e: PointerEvent) => {
      const target = findInteractive(e.target as Element | null);
      if (target) {
        const rect = target.getBoundingClientRect();
        const padX = 8;
        const padY = 6;
        s.tw = rect.width + padX * 2;
        s.th = rect.height + padY * 2;
        s.targetCx = rect.left + rect.width / 2;
        s.targetCy = rect.top + rect.height / 2;
        s.snapped = true;
        // Borrow border-radius from the target for visual harmony.
        const cs = window.getComputedStyle(target);
        const r = parseFloat(cs.borderRadius);
        s.radius = Number.isFinite(r) && r > 0 ? r + 2 : 4;
        const labelText = target.dataset.cursorLabel ?? "";
        if (labelRef.current) {
          labelRef.current.textContent = labelText;
          labelRef.current.style.opacity = labelText ? "1" : "0";
        }
      } else {
        s.tw = 10;
        s.th = 10;
        s.snapped = false;
        s.radius = 999;
        if (labelRef.current) {
          labelRef.current.textContent = "";
          labelRef.current.style.opacity = "0";
        }
      }
    };

    // pointerout fires when leaving the document
    const onOut = (e: PointerEvent) => {
      if (!e.relatedTarget) {
        if (cursorRef.current) cursorRef.current.style.opacity = "0";
      }
    };
    const onIn = () => {
      if (cursorRef.current) cursorRef.current.style.opacity = "1";
    };

    let raf = 0;
    const tick = () => {
      const node = cursorRef.current;
      if (!node) {
        raf = window.requestAnimationFrame(tick);
        return;
      }
      // Free state: track pointer 1:1 — no perceptible lag.
      // Snap state: ease toward the element center for the morph effect.
      if (s.snapped) {
        const posLerp = 0.32;
        s.cx += (s.targetCx - s.cx) * posLerp;
        s.cy += (s.targetCy - s.cy) * posLerp;
      } else {
        s.cx = s.px;
        s.cy = s.py;
      }
      const sizeLerp = 0.28;
      s.cw += (s.tw - s.cw) * sizeLerp;
      s.ch += (s.th - s.ch) * sizeLerp;
      node.style.transform = `translate3d(${s.cx}px, ${s.cy}px, 0) translate(-50%, -50%)`;
      node.style.width = `${s.cw}px`;
      node.style.height = `${s.ch}px`;
      node.style.borderRadius = `${s.snapped ? s.radius : 999}px`;
      // Free-state dot reads as a filled emerald disc; snap-state is outline only.
      node.style.backgroundColor = s.snapped ? "transparent" : "var(--color-primary-glow)";
      raf = window.requestAnimationFrame(tick);
    };
    raf = window.requestAnimationFrame(tick);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, true);
    document.addEventListener("pointerout", onOut);
    document.addEventListener("pointerenter", onIn);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver, true);
      document.removeEventListener("pointerout", onOut);
      document.removeEventListener("pointerenter", onIn);
      window.cancelAnimationFrame(raf);
      document.documentElement.classList.remove("custom-cursor-active");
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={cursorRef}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[9999] border-[1.5px] border-[var(--color-primary-glow)] transition-[border-radius] duration-150 will-change-transform"
      style={{
        width: 10,
        height: 10,
        borderRadius: 999,
      }}
    >
      {/* + register marks (only visible when snapped to a sufficiently large target) */}
      <span aria-hidden className="pointer-events-none absolute -left-1 -top-1 font-[family-name:var(--font-mono)] text-[10px] leading-none text-[var(--color-primary-glow)]">+</span>
      <span aria-hidden className="pointer-events-none absolute -right-1 -top-1 font-[family-name:var(--font-mono)] text-[10px] leading-none text-[var(--color-primary-glow)]">+</span>
      <span aria-hidden className="pointer-events-none absolute -left-1 -bottom-1 font-[family-name:var(--font-mono)] text-[10px] leading-none text-[var(--color-primary-glow)]">+</span>
      <span aria-hidden className="pointer-events-none absolute -right-1 -bottom-1 font-[family-name:var(--font-mono)] text-[10px] leading-none text-[var(--color-primary-glow)]">+</span>
      {/* Label (right of cursor, visible when data-cursor-label is set) */}
      <span
        ref={labelRef}
        aria-hidden
        className="absolute left-full top-1/2 ml-3 -translate-y-1/2 whitespace-nowrap font-[family-name:var(--font-mono)] text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--color-primary-glow)] opacity-0 transition-opacity duration-150"
      />
    </div>
  );
}
