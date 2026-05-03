"use client";

import { useEffect, useState } from "react";

export function AnimatedHeading() {
  const lines = ["Software Engineer", "Full Stack Developer", "AI Application Developer"];
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((v) => (v + 1) % lines.length), 2600);
    return () => clearInterval(t);
  }, [lines.length]);

  return (
    <div
      className="relative inline-flex h-[1.2em] items-baseline overflow-hidden align-baseline"
      aria-live="polite"
    >
      {lines.map((line, i) => (
        <span
          key={line}
          className="inline-block transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]"
          style={{
            position: i === 0 ? "relative" : "absolute",
            inset: i === 0 ? undefined : 0,
            opacity: i === idx ? 1 : 0,
            transform:
              i === idx
                ? "translateY(0)"
                : i === (idx - 1 + lines.length) % lines.length
                  ? "translateY(-100%)"
                  : "translateY(100%)",
          }}
        >
          {line}
        </span>
      ))}
    </div>
  );
}
