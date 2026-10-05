"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import RevealText from "@/components/fx/RevealText";

/**
 * Page section with a scroll-linked entrance: as it comes up from the bottom
 * of the screen the content grows into place, the title slides in sideways
 * and the rule under the header draws itself.
 */
export default function Section({
  id,
  title,
  intro,
  aside,
  background,
  from = "right",
  className = "",
  children,
}: {
  id: string;
  title: string;
  intro?: string;
  aside?: React.ReactNode;
  /** Decorative layer rendered behind the content (glows, grids). */
  background?: React.ReactNode;
  /** Side the title slides in from; alternate it between sections. */
  from?: "left" | "right";
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start 0.3"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0.93, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [90, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [0.1, 1]);
  const dir = from === "right" ? 1 : -1;
  const titleX = useTransform(scrollYProgress, [0, 1], [140 * dir, 0]);
  const introX = useTransform(scrollYProgress, [0, 1], [-60 * dir, 0]);
  const rule = useTransform(scrollYProgress, [0.2, 1], [0, 1]);

  const still = reduceMotion ?? false;

  return (
    <section
      ref={ref}
      id={id}
      aria-labelledby={`${id}-title`}
      className={`relative scroll-mt-32 ${className}`}
    >
      {background}
      <motion.div
        className="relative z-10 origin-top"
        style={still ? undefined : { scale, y, opacity }}
      >
        <header className="relative mb-12 flex flex-col gap-5 pb-5 md:flex-row md:items-end md:justify-between">
          <div>
            <motion.h2
              id={`${id}-title`}
              className="font-serif text-4xl font-bold tracking-tight md:text-5xl"
              style={still ? undefined : { x: titleX }}
            >
              <RevealText lines={[title]} />
            </motion.h2>
            {intro && (
              <motion.p
                className="mt-2 max-w-[60ch] text-sm font-medium text-muted"
                style={still ? undefined : { x: introX }}
              >
                {intro}
              </motion.p>
            )}
          </div>
          {aside}
          <motion.span
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-px origin-left bg-rule"
            style={still ? undefined : { scaleX: rule }}
          />
        </header>
        {children}
      </motion.div>
    </section>
  );
}

/** Soft violet light in a card corner that fades in on hover. */
export function CornerGlow({ always = false }: { always?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
    >
      <span
        className={`absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand/15 blur-[90px] transition-opacity duration-1000 ${
          always ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}
      />
    </span>
  );
}

export function ArrowIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="transition-transform group-hover/cta:translate-x-1"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
