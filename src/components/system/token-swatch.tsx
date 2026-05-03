"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Token } from "@/lib/system/parse-tokens";

export function TokenSwatch({ token }: { token: Token }) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    await navigator.clipboard.writeText(`var(${token.name})`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <button
      type="button"
      onClick={onCopy}
      className={cn(
        "group relative flex flex-col gap-2 overflow-hidden rounded-xl",
        "border border-[var(--color-line)] bg-[var(--color-bg-2)]/60 p-3 text-left",
        "transition-colors hover:border-[var(--color-primary-glow)]/40",
      )}
      aria-label={`Copy CSS variable ${token.name}`}
    >
      <div
        className="h-14 w-full rounded-md border border-[var(--color-line)]"
        style={{ background: token.raw }}
        aria-hidden
      />
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="font-[family-name:var(--font-mono)] text-[11px] text-[var(--color-ink-soft)] truncate">
            {token.name}
          </div>
          <div className="font-[family-name:var(--font-mono)] text-[10px] text-[var(--color-muted)] truncate">
            {token.hex ?? token.raw}
          </div>
        </div>
        <span className="shrink-0 text-[var(--color-muted)] transition-colors group-hover:text-[var(--color-primary-glow)]">
          {copied ? <Check size={12} /> : <Copy size={12} />}
        </span>
      </div>
    </button>
  );
}
