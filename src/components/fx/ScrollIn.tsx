"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

/**
 * Moves its content into place as it scrolls up the screen, from any
 * direction (sideways, diagonal, rotated). The motion is tied to scroll
 * position, so it plays backwards when scrolling up, and it finishes while
 * the element is still in the lower part of the screen: by the time it
 * reaches the reading area it is already still.
 */
export default function ScrollIn({
  children,
  x = 0,
  y = 0,
  rotate = 0,
  scale = 1,
  className = "",
  innerClassName = "",
}: {
  children: React.ReactNode;
  /** Starting offset in px; the content travels from here to 0. */
  x?: number;
  y?: number;
  rotate?: number;
  scale?: number;
  className?: string;
  /** Classes for the moving inner box (layout of the children). */
  innerClassName?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start 0.62"],
  });

  const tx = useTransform(scrollYProgress, [0, 1], [x, 0]);
  const ty = useTransform(scrollYProgress, [0, 1], [y, 0]);
  const tr = useTransform(scrollYProgress, [0, 1], [rotate, 0]);
  const ts = useTransform(scrollYProgress, [0, 1], [scale, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [0, 1]);

  return (
    // The outer box stays put so scroll progress is measured from its real
    // position; only the inner one moves
    <div ref={ref} className={className}>
      <motion.div
        className={`h-full ${innerClassName}`}
        style={reduceMotion ? undefined : { x: tx, y: ty, rotate: tr, scale: ts, opacity }}
      >
        {children}
      </motion.div>
    </div>
  );
}
