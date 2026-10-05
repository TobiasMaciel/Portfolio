"use client";

import { useEffect, useRef } from "react";

// How many full-screen views are open, and a back() scheduled by the last
// unmount. React's dev double-mount unmounts and remounts right away, so
// the next mount cancels that back() instead of stacking a second entry.
let depth = 0;
let pendingBack: ReturnType<typeof setTimeout> | null = null;

const currentDepth = (): number => window.history.state?.overlayDepth ?? 0;

/**
 * While mounted, the browser/phone "back" button closes this view instead
 * of leaving the page. Views can stack (a document over a case study): each
 * one adds a history entry with its depth, and "back" closes only the top
 * one. Closing a view in-page (button, Escape) removes its entry.
 */
export function useBackToClose(onClose: () => void) {
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (pendingBack) {
      clearTimeout(pendingBack);
      pendingBack = null;
    }
    depth += 1;
    const myDepth = depth;
    if (currentDepth() !== myDepth) {
      window.history.pushState({ ...window.history.state, overlayDepth: myDepth }, "");
    }

    // Going back below this view's depth means it should close
    const onPop = () => {
      if (currentDepth() < myDepth) onCloseRef.current();
    };
    window.addEventListener("popstate", onPop);

    return () => {
      window.removeEventListener("popstate", onPop);
      depth -= 1;
      pendingBack = setTimeout(() => {
        pendingBack = null;
        // Still on this view's entry: it was closed in-page, so drop the entry
        if (currentDepth() === myDepth) window.history.back();
      }, 0);
    };
  }, []);
}
