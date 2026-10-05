"use client";

import { useId, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Small popover anchored above its trigger. Opens on hover and on keyboard
 * focus, so content with links inside stays reachable without a mouse.
 */
export default function Tooltip({
  children,
  content,
  className = "inline-flex",
}: {
  children: React.ReactNode;
  content: React.ReactNode;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const id = useId();

  return (
    <span
      ref={wrapperRef}
      className={`relative ${className}`}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={(e) => {
        if (!wrapperRef.current?.contains(e.relatedTarget as Node)) setOpen(false);
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape" && open) {
          e.stopPropagation();
          setOpen(false);
        }
      }}
      aria-describedby={open ? id : undefined}
    >
      {children}
      <AnimatePresence>
        {open && (
          <motion.span
            id={id}
            role="tooltip"
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            // pb-2 bridges the gap so the pointer can travel into the popover
            className="absolute bottom-full left-1/2 z-40 -translate-x-1/2 pb-3"
          >
            <span className="block w-max max-w-[17rem] rounded-xl border border-white/10 bg-ink/95 px-3 py-2 text-left text-[11px] font-semibold leading-relaxed text-paper shadow-[0_20px_50px_rgba(0,0,0,0.3)] backdrop-blur-md dark:border-black/10">
              {content}
            </span>
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
