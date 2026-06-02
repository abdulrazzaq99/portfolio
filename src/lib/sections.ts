/**
 * All page sections. `inNav` controls whether the link appears in the
 * primary navbar (and mobile menu). Sections without `inNav: true` are still
 * tracked by scroll-spy and reachable via the ⌘K terminal's `goto <id>`,
 * but they don't crowd the rail.
 */
export const sections = [
  { id: "home",       label: "Home",       inNav: false },
  { id: "about",      label: "About",      inNav: true  },
  { id: "skills",     label: "Skills",     inNav: true  },
  { id: "work",       label: "Work",       inNav: true  },
  { id: "experience", label: "Experience", inNav: true  },
  { id: "activity",   label: "Activity",   inNav: true  },
  { id: "contact",    label: "Contact",    inNav: true  },
] as const;

export type SectionId = (typeof sections)[number]["id"];
