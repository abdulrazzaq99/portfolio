"use client";

import { useCallback, useState } from "react";
import { Toaster } from "sonner";
import { Navbar } from "./navbar";
import { Terminal } from "@/components/sections/terminal";
import { useKeyboardShortcut } from "@/hooks/use-keyboard-shortcut";
import { ThinkingModeProvider } from "@/components/ui/thinking-mode";
import { SmoothScroll } from "@/components/system/smooth-scroll";
import { CustomCursor } from "@/components/system/custom-cursor";

/**
 * SiteShell — wraps every page. The left rail nav reserves a fixed gutter on
 * desktop; main content sits in the remaining space. Mobile collapses the
 * rail into a top bar handled inside <Navbar>.
 */
export function SiteShell({ children }: { children: React.ReactNode }) {
  const [termOpen, setTermOpen] = useState(false);
  const open = useCallback(() => setTermOpen(true), []);
  const close = useCallback(() => setTermOpen(false), []);

  useKeyboardShortcut({ key: "k", meta: true }, (e) => {
    e.preventDefault();
    setTermOpen((v) => !v);
  });

  return (
    <ThinkingModeProvider>
      <SmoothScroll />
      <CustomCursor />
      <Navbar onOpenTerminal={open} />

      {/* Main content — reserves left gutter for the rail on desktop */}
      <div className="lg:pl-[220px] xl:pl-[240px]">{children}</div>

      <Terminal open={termOpen} onClose={close} />

      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: "oklch(0.10 0.012 160 / 0.96)",
            color: "oklch(0.97 0.003 145)",
            border: "1px solid oklch(1 0 0 / 0.08)",
            borderRadius: 0,
            backdropFilter: "blur(14px)",
          },
        }}
      />
    </ThinkingModeProvider>
  );
}
