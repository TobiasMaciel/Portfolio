"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { setLenis } from "./lenisStore";

/** Inertial page scrolling. Off when the visitor asks for reduced motion. */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      autoRaf: true,
      duration: 1.15,
      anchors: true,
      // Modals, lightbox and tooltips keep their own native scrolling
      prevent: (node) => Boolean(node.closest?.("[role=dialog], [data-lenis-prevent]")),
    });
    setLenis(lenis);

    return () => {
      setLenis(null);
      lenis.destroy();
    };
  }, []);

  return null;
}
