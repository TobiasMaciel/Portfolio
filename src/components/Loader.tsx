"use client";

import { useEffect, useRef, useState } from "react";

// Shortest time on screen, so the exit never looks like a flicker
const MIN_MS = 450;
// Give up waiting for slow assets after this long
const MAX_MS = 4000;
const TILE = 72;
const EXIT_MS = 750;
const TILE_MS = 320;

/**
 * Loading screen: a plain cover until fonts and the page are ready, then it
 * breaks into square tiles that pop away from the centre out (inspired by
 * React Bits' Pixel Swap).
 */
export default function Loader() {
  const [phase, setPhase] = useState<"loading" | "exiting" | "done">("loading");
  const tilesRef = useRef<HTMLDivElement>(null);
  const [grid, setGrid] = useState<{ cols: number; rows: number } | null>(null);

  // Wait for fonts + window load (whichever is slower), within MIN/MAX
  useEffect(() => {
    const start = performance.now();
    document.documentElement.style.overflow = "hidden";

    const loaded = new Promise<void>((resolve) => {
      if (document.readyState === "complete") resolve();
      else window.addEventListener("load", () => resolve(), { once: true });
    });
    const fonts = document.fonts?.ready ?? Promise.resolve();
    const timeout = new Promise<void>((resolve) => setTimeout(resolve, MAX_MS));

    let cancelled = false;
    Promise.race([Promise.all([loaded, fonts]), timeout]).then(() => {
      const wait = Math.max(0, MIN_MS - (performance.now() - start));
      setTimeout(() => {
        if (cancelled) return;
        const reduce = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;
        if (reduce) {
          setPhase("done");
          return;
        }
        setGrid({
          cols: Math.ceil(window.innerWidth / TILE),
          rows: Math.ceil(window.innerHeight / TILE),
        });
        setPhase("exiting");
      }, wait);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Release scroll as soon as the page starts showing
  useEffect(() => {
    if (phase !== "loading") document.documentElement.style.overflow = "";
  }, [phase]);

  // Exit: every tile shrinks away, the ones near the centre first
  useEffect(() => {
    if (phase !== "exiting" || !grid || !tilesRef.current) return;
    const tiles = Array.from(tilesRef.current.children) as HTMLElement[];
    const spread = EXIT_MS - TILE_MS;
    const animations = tiles.map((tile, i) => {
      const x = (i % grid.cols) / Math.max(1, grid.cols - 1);
      const y = Math.floor(i / grid.cols) / Math.max(1, grid.rows - 1);
      const distance = Math.hypot(x - 0.5, y - 0.5) / Math.SQRT1_2;
      // A little noise so the edge breaks up instead of forming a ring
      const jitter = (Math.sin(i * 127.1) * 43758.5453) % 1;
      const delay = (distance * 0.8 + Math.abs(jitter) * 0.2) * spread;
      return tile.animate(
        [
          { transform: "scale(1.02)", opacity: 1 },
          { transform: "scale(0)", opacity: 0 },
        ],
        {
          duration: TILE_MS,
          delay,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          fill: "forwards",
        },
      );
    });
    Promise.all(animations.map((a) => a.finished)).then(
      () => setPhase("done"),
      () => setPhase("done"),
    );
  }, [phase, grid]);

  if (phase === "done") return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Cargando"
      className="fixed inset-0 z-[500]"
    >
      {/* Plain cover while loading; replaced by the tiles on exit */}
      {phase === "loading" && <div className="absolute inset-0 bg-paper" />}

      {phase === "exiting" && grid && (
        <div
          ref={tilesRef}
          className="absolute inset-0 grid"
          style={{ gridTemplateColumns: `repeat(${grid.cols}, ${TILE}px)` }}
        >
          {Array.from({ length: grid.cols * grid.rows }, (_, i) => (
            <div
              key={i}
              className="bg-paper"
              style={{ width: TILE, height: TILE }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
