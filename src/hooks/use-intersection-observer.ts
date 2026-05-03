"use client";

import { useEffect, useRef, useState } from "react";

export function useIntersectionObserver<T extends Element>(
  options: IntersectionObserverInit = { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
  once = true,
) {
  const ref = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry.isIntersecting) {
        setIsVisible(true);
        if (once) io.unobserve(node);
      } else if (!once) {
        setIsVisible(false);
      }
    }, options);
    io.observe(node);
    return () => io.disconnect();
  }, [options, once]);

  return { ref, isVisible };
}
