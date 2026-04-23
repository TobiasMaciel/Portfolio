"use client";

import Image from "next/image";
import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function MiniCarousel({
  images,
  title,
  onClickImage,
}: {
  images: string[];
  title: string;
  onClickImage?: (idx: number) => void;
}) {
  const [current, setCurrent] = useState(0);
  const dragX = useRef(0);
  const didDrag = useRef(false);
  const n = images.length;
  const go = useCallback((i: number) => setCurrent((i + n) % n), [n]);

  return (
    <div className="flex flex-col gap-2.5 w-full max-w-md ml-auto">
      <div
        className="relative w-full rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 select-none cursor-pointer"
        style={{ aspectRatio: "16/9" }}
        onPointerDown={(e) => {
          if ((e.target as HTMLElement).closest("button")) return;
          dragX.current = e.clientX;
          didDrag.current = false;
        }}
        onPointerMove={(e) => {
          if (Math.abs(e.clientX - dragX.current) > 8) didDrag.current = true;
        }}
        onPointerUp={(e) => {
          if ((e.target as HTMLElement).closest("button")) return;
          if (didDrag.current) {
            const d = e.clientX - dragX.current;
            if (Math.abs(d) > 30) go(current + (d < 0 ? 1 : -1));
          } else {
            if (onClickImage) onClickImage(current);
          }
          didDrag.current = false;
        }}
      >
        <AnimatePresence mode="sync">
          <motion.div
            key={current}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
          >
            {images[current].toLowerCase().endsWith(".pdf") ? (
              <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-800 transition-colors gap-3 p-4">
                <div className="w-12 h-12 rounded-xl bg-[#A78BFA]/10 flex items-center justify-center text-[#A78BFA] border border-[#A78BFA]/10 shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>
                </div>
                <div className="text-center">
                  <p className="text-zinc-900 dark:text-white font-bold text-xs">
                    Informe Técnico
                  </p>
                </div>
              </div>
            ) : (
              <Image
                src={images[current]}
                alt={`${title} ${current + 1}`}
                fill
                className="object-contain p-3 transition-opacity duration-300"
                sizes="40vw"
                draggable={false}
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
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-sm text-white border border-white/10 hover:bg-black/60 transition-all z-10"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="11"
                height="11"
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
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-sm text-white border border-white/10 hover:bg-black/60 transition-all z-10"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="11"
                height="11"
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
            <span className="absolute bottom-2 right-2 text-[10px] font-semibold text-white/65 bg-black/25 backdrop-blur-sm px-2 py-0.5 rounded-full">
              {current + 1}/{n}
            </span>
          </>
        )}
      </div>
      {n > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-0.5">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className="relative flex-shrink-0 w-14 h-9 rounded overflow-hidden border-2 transition-all duration-200"
              style={{
                borderColor: i === current ? "#A78BFA" : "transparent",
                opacity: i === current ? 1 : 0.45,
              }}
            >
              {src.toLowerCase().endsWith(".pdf") ? (
                <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-100 dark:bg-zinc-800 text-[#A78BFA]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                </div>
              ) : (
                <Image
                  src={src}
                  alt={`thumb ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
