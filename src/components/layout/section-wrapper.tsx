import type { ReactNode } from "react";
import { Container } from "./container";
import { cn } from "@/lib/utils";

/**
 * Page-section frame. Provides padding, scroll-mt for anchor links, and the
 * Container. The bicolor section header lives inside as a child via the
 * SectionHeader component — see `section-header.tsx`.
 */
export function SectionWrapper({
  id,
  children,
  className,
  containerSize = "default",
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  containerSize?: "default" | "wide" | "narrow";
}) {
  return (
    <section id={id} className={cn("relative scroll-mt-24 py-32 sm:py-44", className)}>
      <Container size={containerSize}>{children}</Container>
    </section>
  );
}
