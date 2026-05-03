import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Container({
  children,
  className,
  size = "default",
}: {
  children: ReactNode;
  className?: string;
  size?: "default" | "wide" | "narrow";
}) {
  const widths = {
    narrow:  "max-w-3xl",
    default: "max-w-[1240px]",
    wide:    "max-w-[1440px]",
  };
  return (
    <div className={cn("mx-auto w-full px-5 sm:px-8 lg:px-10", widths[size], className)}>
      {children}
    </div>
  );
}
