"use client";

import { useRef } from "react";

/** Pointer handlers for horizontal swipe, with an optional tap callback. */
export function useSwipe({
  onPrev,
  onNext,
  onTap,
}: {
  onPrev: () => void;
  onNext: () => void;
  onTap?: () => void;
}) {
  const startX = useRef<number | null>(null);
  const moved = useRef(false);

  return {
    onPointerDown: (e: React.PointerEvent) => {
      if ((e.target as HTMLElement).closest("button")) return;
      startX.current = e.clientX;
      moved.current = false;
    },
    onPointerMove: (e: React.PointerEvent) => {
      if (startX.current !== null && Math.abs(e.clientX - startX.current) > 8)
        moved.current = true;
    },
    onPointerUp: (e: React.PointerEvent) => {
      if (startX.current === null) return;
      const delta = e.clientX - startX.current;
      startX.current = null;
      if (!moved.current) onTap?.();
      else if (Math.abs(delta) > 30) (delta < 0 ? onNext : onPrev)();
    },
  };
}

export const isPdf = (src: string) => src.toLowerCase().endsWith(".pdf");

export const fileName = (src: string) =>
  decodeURIComponent(src.substring(src.lastIndexOf("/") + 1));
