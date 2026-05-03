"use client";

import { useEffect, useState } from "react";

export function useScrollSpy(ids: readonly string[], offsetRatio = 0.4) {
  const [active, setActive] = useState<string>(ids[0] ?? "");

  useEffect(() => {
    const obs: IntersectionObserver[] = [];
    const visible = new Map<string, number>();

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            visible.set(id, entry.intersectionRatio);
          } else {
            visible.delete(id);
          }
          let topId = "";
          let topRatio = 0;
          for (const [k, v] of visible) {
            if (v > topRatio) {
              topRatio = v;
              topId = k;
            }
          }
          if (topId) setActive(topId);
        },
        {
          rootMargin: `-${Math.round(offsetRatio * 100)}% 0px -${Math.round(
            (1 - offsetRatio - 0.1) * 100,
          )}% 0px`,
          threshold: [0, 0.25, 0.5, 0.75, 1],
        },
      );
      io.observe(el);
      obs.push(io);
    });

    return () => obs.forEach((o) => o.disconnect());
  }, [ids, offsetRatio]);

  return active;
}
