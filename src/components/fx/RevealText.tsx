"use client";

import { motion } from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * Text that rises word by word from behind a mask. Each word sits in its
 * own clipped box, so lines reveal cleanly whatever the wrap width.
 * Pass `lines` to reveal several lines in sequence (e.g. name + surname).
 */
export default function RevealText({
  lines,
  className = "",
  lineClassNames = [],
  delay = 0,
  inView = true,
}: {
  lines: string[];
  className?: string;
  lineClassNames?: string[];
  delay?: number;
  /** true: plays when scrolled into view. false: plays on mount. */
  inView?: boolean;
}) {
  let wordIndex = 0;
  const trigger = inView
    ? { whileInView: "visible", viewport: { once: true, amount: 0.6 } }
    : { animate: "visible" };

  return (
    <motion.span
      className={`block ${className}`}
      initial="hidden"
      {...trigger}
      transition={{ staggerChildren: 0.06, delayChildren: delay }}
    >
      <span className="sr-only">{lines.join(" ")}</span>
      {lines.map((line, li) => (
        <span key={li} aria-hidden="true" className={`block ${lineClassNames[li] ?? ""}`}>
          {line.split(" ").map((word) => {
            const i = wordIndex++;
            return (
              <span
                key={`${word}-${i}`}
                className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom"
              >
                <motion.span
                  className="inline-block"
                  variants={{
                    hidden: { y: "110%", rotate: 4 },
                    visible: { y: "0%", rotate: 0, transition: { duration: 1, ease } },
                  }}
                >
                  {word}
                  {"\u00a0"}
                </motion.span>
              </span>
            );
          })}
        </span>
      ))}
    </motion.span>
  );
}
