import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Card({
  children,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
}) {
  return (
    <Tag
      className={cn(
        "glass relative rounded-3xl",
        "transition-shadow duration-500 ease-out",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
