import type Lenis from "lenis";

// Single Lenis instance shared by the page, dialogs and in-page links.
let instance: Lenis | null = null;

export const setLenis = (lenis: Lenis | null) => {
  instance = lenis;
};

export const getLenis = () => instance;

/** Smoothly scroll to an element id, through Lenis when it is running. */
export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (instance) instance.scrollTo(el);
  else el.scrollIntoView({ behavior: "smooth", block: "start" });
}
