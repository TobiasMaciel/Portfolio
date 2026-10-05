"use client";

import { motion } from "framer-motion";

export default function Section({
  id,
  title,
  intro,
  aside,
  background,
  className = "",
  children,
}: {
  id: string;
  title: string;
  intro?: string;
  aside?: React.ReactNode;
  /** Decorative layer rendered behind the content (glows, grids). */
  background?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      id={id}
      aria-labelledby={`${id}-title`}
      className={`relative scroll-mt-32 ${className}`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.05 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
    >
      {background}
      <div className="relative z-10">
        <header className="mb-12 flex flex-col gap-5 border-b border-rule pb-5 md:flex-row md:items-end md:justify-between">
          <div>
            <h2
              id={`${id}-title`}
              className="font-serif text-4xl font-bold tracking-tight md:text-5xl"
            >
              {title}
            </h2>
            {intro && (
              <p className="mt-2 max-w-[60ch] text-sm font-medium text-muted">
                {intro}
              </p>
            )}
          </div>
          {aside}
        </header>
        {children}
      </div>
    </motion.section>
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
