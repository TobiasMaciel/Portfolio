"use client";

import { useId, useRef } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useDialogLayer } from "./useDialogLayer";
import { button } from "./styles";

const sizes = {
  md: "max-w-3xl sm:h-auto sm:max-h-[90vh]",
  lg: "max-w-5xl sm:h-[90vh]",
  xl: "max-w-6xl sm:h-[90vh]",
};

export default function Modal({
  title,
  subtitle,
  actions,
  onClose,
  closeLabel,
  size = "lg",
  zIndex = 100,
  children,
}: {
  title: string;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  onClose: () => void;
  closeLabel: string;
  size?: keyof typeof sizes;
  zIndex?: number;
  children: React.ReactNode;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  useDialogLayer(onClose, panelRef);

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm sm:p-6 md:p-8"
      style={{ zIndex }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      onClick={onClose}
    >
      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={`relative flex h-[100dvh] w-full flex-col overflow-hidden bg-surface text-ink shadow-2xl focus:outline-none sm:rounded-3xl sm:border sm:border-rule md:rounded-[2rem] ${sizes[size]}`}
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.98 }}
        transition={{ duration: 0.24, ease: [0.2, 0.8, 0.2, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="relative flex shrink-0 items-start justify-between gap-4 overflow-hidden border-b border-rule px-5 py-4 sm:px-8 sm:py-6">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -left-20 -top-28 h-56 w-80 rounded-full bg-brand/15 blur-[80px]"
          />
          <div className="relative min-w-0">
            <h2
              id={titleId}
              className="font-serif text-xl font-bold leading-tight sm:text-2xl md:text-[1.7rem]"
            >
              {title}
            </h2>
            {subtitle && (
              <p className="mt-1 text-sm font-medium leading-5 text-accent">{subtitle}</p>
            )}
          </div>
          <div className="relative flex shrink-0 items-center gap-2">
            {actions}
            <button
              type="button"
              onClick={onClose}
              aria-label={closeLabel}
              className={`${button.ghost} group`}
            >
              <X size={20} aria-hidden="true" className="transition-transform duration-300 group-hover:rotate-90" />
            </button>
          </div>
        </header>
        <div className="flex min-h-0 flex-1 flex-col">{children}</div>
      </motion.div>
    </motion.div>
  );
}

/** Heading + body block used inside modal content. */
export function ModalBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h3 className="mb-3 flex items-center gap-3 text-sm font-bold text-ink">
        <span aria-hidden="true" className="h-[2px] w-5 bg-brand" />
        {title}
      </h3>
      {children}
    </section>
  );
}

export function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="max-w-[68ch] space-y-2.5">
      {items.map((b, i) => (
        <li key={i} className="flex gap-3 text-sm leading-relaxed text-muted">
          <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand/60" />
          <span>{b}</span>
        </li>
      ))}
    </ul>
  );
}
