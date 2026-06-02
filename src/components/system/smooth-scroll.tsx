"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Lenis smooth-scroll wrapper.
 *
 * Mounted once in the site shell. Honors `prefers-reduced-motion: reduce`
 * by not initialising at all (native scroll passes through). Cleans up the
 * RAF + Lenis instance on unmount, and stops itself if the user toggles
 * reduce-motion mid-session.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      // Standard wheel multiplier; gentle, not exaggerated
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
    });

    let raf = 0;
    const tick = (time: number) => {
      lenis.raf(time);
      raf = window.requestAnimationFrame(tick);
    };
    raf = window.requestAnimationFrame(tick);

    // Make in-page anchor clicks (e.g. nav links) use Lenis instead of the
    // browser's instant jump, so they animate smoothly to target.
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const link = target.closest('a[href^="#"]') as HTMLAnchorElement | null;
      if (!link) return;
      const id = link.getAttribute("href")?.slice(1);
      if (!id) return;
      const el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el, { offset: -16 });
      // Update URL without re-scroll
      window.history.replaceState(null, "", `#${id}`);
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      window.cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}
