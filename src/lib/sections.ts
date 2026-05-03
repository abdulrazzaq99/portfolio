/**
 * All page sections. `inNav` controls whether the link appears in the
 * primary navbar (and mobile menu). Sections without `inNav: true` are still
 * tracked by scroll-spy and reachable via the ⌘K terminal's `goto <id>`,
 * but they don't crowd the top bar.
 */
export const sections = [
  { id: "home",       label: "Home",       inNav: false },
  { id: "about",      label: "About",      inNav: true  },
  { id: "ask",        label: "Ask",        inNav: false },
  { id: "skills",     label: "Skills",     inNav: false },
  { id: "work",       label: "Work",       inNav: true  },
  { id: "experience", label: "Experience", inNav: false },
  { id: "contact",    label: "Contact",    inNav: true  },
] as const;

export type SectionId = (typeof sections)[number]["id"];
