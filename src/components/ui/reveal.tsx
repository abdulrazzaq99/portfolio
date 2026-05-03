"use client";

import { type ElementType, type ReactNode } from "react";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { cn } from "@/lib/utils";

export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: ElementType;
}) {
  const { ref, isVisible } = useIntersectionObserver<HTMLElement>();
  return (
    <Tag
      ref={ref as never}
      className={cn("reveal", isVisible && "is-visible", className)}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}

export function RevealText({
  text,
  className,
  as: Tag = "h2",
}: {
  text: string;
  className?: string;
  as?: ElementType;
}) {
  const { ref, isVisible } = useIntersectionObserver<HTMLElement>();
  const words = text.split(/(\s+)/);
  return (
    <Tag
      ref={ref as never}
      className={cn("reveal-text", isVisible && "is-visible", className)}
    >
      {words.map((word, i) => {
        if (!word.trim()) return <span key={i}>{word}</span>;
        return (
          <span key={i} className="reveal-line">
            <span>{word}</span>
          </span>
        );
      })}
    </Tag>
  );
}
