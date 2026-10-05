"use client";

import Image from "next/image";
import { useId, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Download } from "lucide-react";
import { useBackToClose } from "./case/useBackToClose";
import { button } from "./ui/styles";
import { useDialogLayer } from "./ui/useDialogLayer";

const ease = [0.76, 0, 0.24, 1] as const;

/**
 * Full-screen viewer for the CV, certificates and reports, in the same
 * style as the case study pages: it slides up, shows the document large,
 * and closes with "Volver", Escape or the browser/phone back button.
 */
export default function DocumentViewer({
  url,
  title,
  subtitle,
  onClose,
  isEs,
}: {
  url: string;
  title: string;
  subtitle?: string;
  onClose: () => void;
  isEs: boolean;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  useDialogLayer(onClose, panelRef);
  useBackToClose(onClose);

  const isImage = /\.(jpe?g|png|webp)$/i.test(url);

  return (
    <motion.div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      tabIndex={-1}
      className="fixed inset-0 z-[200] flex flex-col bg-paper text-ink focus:outline-none"
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ duration: 0.7, ease }}
    >
      <div className="shrink-0 border-b border-rule bg-paper/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-6 sm:px-10 lg:px-16">
          <button
            type="button"
            onClick={onClose}
            className="group inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-ink transition-colors hover:text-accent cursor-pointer"
          >
            <ArrowLeft size={16} aria-hidden="true" className="transition-transform group-hover:-translate-x-1" />
            {isEs ? "Volver" : "Back"}
          </button>
          <div className="min-w-0 text-center">
            <h2 id={titleId} className="truncate font-serif text-lg font-bold leading-tight">
              {title}
            </h2>
            {subtitle && <p className="truncate text-xs font-medium text-muted">{subtitle}</p>}
          </div>
          <a
            href={url}
            download={url.split("/").pop()}
            className={`${button.primary} shrink-0 rounded-full px-4 py-2.5 shadow-none sm:px-5`}
          >
            <Download size={16} aria-hidden="true" />
            <span className="hidden sm:inline">{isEs ? "Descargar" : "Download"}</span>
          </a>
        </div>
      </div>

      <motion.div
        className="relative min-h-0 flex-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.35, duration: 0.4 } }}
      >
        {isImage ? (
          <div className="absolute inset-0 overflow-auto p-4 sm:p-10">
            <div className="relative mx-auto h-full w-full max-w-5xl overflow-hidden rounded-[1.5rem] border border-rule bg-surface/70 dark:bg-surface/40">
              <span
                aria-hidden="true"
                className="absolute inset-0 opacity-60 [background-image:radial-gradient(var(--rule)_1px,transparent_1px)] [background-size:20px_20px]"
              />
              <Image
                src={url}
                alt={subtitle ?? title}
                fill
                sizes="(max-width: 1024px) 100vw, 1024px"
                priority
                className="object-contain p-4 drop-shadow-[0_24px_40px_rgba(0,0,0,0.3)] sm:p-8"
              />
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 mx-auto max-w-5xl sm:px-10 sm:py-6">
            <iframe
              src={`${url}#toolbar=0&navpanes=0`}
              className="h-full w-full border-0 bg-white sm:rounded-[1.5rem] sm:border sm:border-rule"
              title={subtitle ?? title}
            />
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
