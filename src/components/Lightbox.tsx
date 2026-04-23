"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Lightbox({
  images,
  startIndex,
  onClose,
}: {
  images: string[];
  startIndex: number;
  onClose: () => void;
}) {
  const [current, setCurrent] = useState(startIndex);
  const n = images.length;
  const go = useCallback((i: number) => setCurrent((i + n) % n), [n]);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") go(current - 1);
      if (e.key === "ArrowRight") go(current + 1);
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [current, onClose, go]);

  return (
    <motion.div
      className="fixed inset-0 z-[300] flex items-center justify-center bg-black/80 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-5 right-5 w-9 h-9 flex items-center justify-center rounded bg-white/10 border border-white/15 text-white hover:bg-white/20 transition-colors z-10"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>
      {n > 1 && (
        <span className="absolute top-6 left-1/2 -translate-x-1/2 text-xs text-white/40 tracking-widest">
          {current + 1} / {n}
        </span>
      )}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          className="relative w-full h-full max-w-5xl mx-auto px-4 sm:px-12 flex items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.12 }}
          onClick={(e) => e.stopPropagation()}
        >
          {images[current].toLowerCase().endsWith(".pdf") ? (
            <div className="w-full h-[85vh] flex flex-col items-center justify-center">
              <iframe
                src={`${images[current]}#toolbar=1`}
                className="w-full h-full rounded-2xl border border-white/10 shadow-2xl bg-white"
                title="Technical Report"
              />
            </div>
          ) : (
            <Image
              src={images[current]}
              alt={`img ${current + 1}`}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          )}
        </motion.div>
      </AnimatePresence>
      {n > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              go(current - 1);
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded bg-white/10 border border-white/15 text-white hover:bg-white/20 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              go(current + 1);
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded bg-white/10 border border-white/15 text-white hover:bg-white/20 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </>
      )}
    </motion.div>
  );
}
