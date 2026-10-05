"use client";

import { useCallback, useEffect, useRef, type RefObject } from "react";
import { getLenis } from "@/components/fx/lenisStore";

// Open dialogs, bottom to top. Only the top one reacts to keys, so Escape
// inside a lightbox opened from a project modal closes just the lightbox.
const layers: symbol[] = [];

const FOCUSABLE =
  'a[href], button:not([disabled]), iframe, input, select, textarea, [tabindex]:not([tabindex="-1"])';

export function useDialogLayer(
  onClose: () => void,
  containerRef: RefObject<HTMLElement | null>,
) {
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  const idRef = useRef<symbol | null>(null);
  const isTop = useCallback(
    () => idRef.current !== null && layers[layers.length - 1] === idRef.current,
    [],
  );

  useEffect(() => {
    const id = Symbol("dialog");
    idRef.current = id;
    layers.push(id);

    const previouslyFocused = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    getLenis()?.stop();
    containerRef.current?.focus({ preventScroll: true });

    const onKeyDown = (e: KeyboardEvent) => {
      if (layers[layers.length - 1] !== id) return;
      if (e.key === "Escape") {
        e.preventDefault();
        onCloseRef.current();
        return;
      }
      const container = containerRef.current;
      if (e.key !== "Tab" || !container) return;
      const focusables = Array.from(
        container.querySelectorAll<HTMLElement>(FOCUSABLE),
      ).filter((el) => el.offsetParent !== null);
      if (focusables.length === 0) {
        e.preventDefault();
        return;
      }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || active === container)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      layers.splice(layers.indexOf(id), 1);
      if (layers.length === 0) {
        document.body.style.overflow = "";
        getLenis()?.start();
      }
      previouslyFocused?.focus?.({ preventScroll: true });
    };
  }, [containerRef]);

  return isTop;
}
