import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

const base =
  "group relative inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-tight " +
  "transition-[transform,background,color,border-color] duration-300 ease-out " +
  "active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap";

const variants: Record<Variant, string> = {
  primary:
    "bg-[var(--color-primary)] text-[var(--color-bg)] hover:bg-[var(--color-primary-glow)] " +
    "shadow-[0_8px_30px_-8px_oklch(0.86_0.27_152_/_0.5),_0_0_0_1px_oklch(0.86_0.27_152_/_0.25)_inset] " +
    "hover:shadow-[0_12px_40px_-8px_oklch(0.86_0.27_152_/_0.65),_0_0_0_1px_oklch(0.86_0.27_152_/_0.4)_inset]",
  ghost:
    "bg-[var(--color-elevated)] text-[var(--color-ink)] backdrop-blur-xl " +
    "border border-[var(--color-line-strong)] hover:border-[var(--color-primary-glow)] hover:text-[var(--color-primary-glow)]",
  outline:
    "bg-transparent text-[var(--color-ink-soft)] border border-[var(--color-line-strong)] " +
    "hover:bg-[var(--color-primary-glow)]/10 hover:text-[var(--color-primary-glow)] hover:border-[var(--color-primary-glow)]",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-xs",
  md: "px-5 py-3 text-sm",
  lg: "px-7 py-4 text-base",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  className?: string;
};

type ButtonProps = CommonProps & ButtonHTMLAttributes<HTMLButtonElement>;
type LinkProps = CommonProps & {
  href: string;
  external?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", className, children, ...rest },
  ref,
) {
  return (
    <button ref={ref} className={cn(base, variants[variant], sizes[size], className)} {...rest}>
      {children}
    </button>
  );
});

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  children,
  href,
  external,
}: LinkProps) {
  const cls = cn(base, variants[variant], sizes[size], className);
  if (external || href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:")) {
    return (
      <a href={href} className={cls} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}
