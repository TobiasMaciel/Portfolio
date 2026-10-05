"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useDialogLayer } from "./ui/useDialogLayer";
import { isPdf } from "./ui/useSwipe";

const control =
  "flex h-11 w-11 items-center justify-center rounded-md bg-white/10 text-white transition-colors hover:bg-white/20 cursor-pointer";

export default function Lightbox({
  images,
  startIndex,
  onClose,
  isEs,
}: {
  images: string[];
  startIndex: number;
  onClose: () => void;
  isEs: boolean;
}) {
  const [current, setCurrent] = useState(startIndex);
  const containerRef = useRef<HTMLDivElement>(null);
  const isTop = useDialogLayer(onClose, containerRef);
  const n = images.length;
  const go = useCallback((i: number) => setCurrent((i + n) % n), [n]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!isTop()) return;
      if (e.key === "ArrowLeft") go(current - 1);
      if (e.key === "ArrowRight") go(current + 1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [current, go, isTop]);

  const src = images[current];

  return (
    <motion.div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-label={isEs ? "Visor de imágenes" : "Image viewer"}
      tabIndex={-1}
      className="fixed inset-0 z-[300] flex items-center justify-center bg-black/90 focus:outline-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      onClick={onClose}
    >
      <div
        className="relative mx-auto flex h-full w-full max-w-6xl items-center px-4 py-20 sm:px-20"
        onClick={(e) => e.stopPropagation()}
      >
        {isPdf(src) ? (
          <iframe
            src={`${src}#toolbar=1`}
            className="h-full w-full rounded-lg bg-white"
            title={isEs ? "Documento" : "Document"}
          />
        ) : (
          <div className="relative h-full w-full">
            <Image
              key={src}
              src={src}
              alt={`${isEs ? "Imagen" : "Image"} ${current + 1}`}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={onClose}
        aria-label={isEs ? "Cerrar" : "Close"}
        className={`${control} absolute right-4 top-4`}
      >
        <X size={18} aria-hidden="true" />
      </button>

      {n > 1 && (
        <>
          <p className="absolute left-1/2 top-7 -translate-x-1/2 text-sm tabular-nums text-white/70">
            {current + 1} / {n}
          </p>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              go(current - 1);
            }}
            aria-label={isEs ? "Anterior" : "Previous"}
            className={`${control} absolute left-4 top-1/2 -translate-y-1/2`}
          >
            <ChevronLeft size={18} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              go(current + 1);
            }}
            aria-label={isEs ? "Siguiente" : "Next"}
            className={`${control} absolute right-4 top-1/2 -translate-y-1/2`}
          >
            <ChevronRight size={18} aria-hidden="true" />
          </button>
        </>
      )}
    </motion.div>
  );
}
