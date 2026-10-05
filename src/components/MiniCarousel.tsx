"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, FileText } from "lucide-react";
import { useSwipe, isPdf, fileName } from "./ui/useSwipe";

const arrow =
  "absolute top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/45 text-white backdrop-blur-sm transition-all hover:bg-black/65 focus-visible:opacity-100 sm:opacity-0 sm:group-hover/carousel:opacity-100 cursor-pointer";

export default function MiniCarousel({
  images,
  title,
  isEs,
  onOpen,
}: {
  images: string[];
  title: string;
  isEs: boolean;
  onOpen: (idx: number) => void;
}) {
  const [current, setCurrent] = useState(0);
  const n = images.length;
  const go = useCallback((i: number) => setCurrent((i + n) % n), [n]);
  const swipe = useSwipe({
    onPrev: () => go(current - 1),
    onNext: () => go(current + 1),
    onTap: () => onOpen(current),
  });
  const src = images[current];

  return (
    <div className="ml-auto flex w-full max-w-md flex-col gap-2.5">
      <div
        {...swipe}
        className="group/carousel relative aspect-video w-full cursor-zoom-in select-none overflow-hidden rounded-2xl border border-rule bg-surface/70 shadow-[0_20px_50px_-25px_rgba(0,0,0,0.35)] transition-shadow duration-500 group-hover:shadow-[0_24px_60px_-20px_rgba(167,139,250,0.35)]"
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
            {isPdf(src) ? (
              <div className="flex h-full w-full flex-col items-center justify-center gap-3 p-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-brand/20 bg-brand/10 text-accent">
                  <FileText size={22} aria-hidden="true" />
                </span>
                <p className="max-w-[280px] truncate px-4 text-xs font-bold">{fileName(src)}</p>
              </div>
            ) : (
              <Image
                src={src}
                alt={`${title}, ${isEs ? "imagen" : "image"} ${current + 1}`}
                fill
                className="object-contain p-3"
                sizes="(max-width: 768px) 100vw, 28rem"
                draggable={false}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {n > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(current - 1)}
              aria-label={isEs ? "Imagen anterior" : "Previous image"}
              className={`${arrow} left-2`}
            >
              <ChevronLeft size={14} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => go(current + 1)}
              aria-label={isEs ? "Imagen siguiente" : "Next image"}
              className={`${arrow} right-2`}
            >
              <ChevronRight size={14} aria-hidden="true" />
            </button>
            <span className="absolute bottom-2 right-2 rounded-full bg-black/35 px-2 py-0.5 text-[10px] font-semibold tabular-nums text-white/80 backdrop-blur-sm">
              {current + 1}/{n}
            </span>
          </>
        )}
      </div>

      {n > 1 && (
        <ul className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <li key={img} className="shrink-0">
              <button
                type="button"
                onClick={() => setCurrent(i)}
                aria-label={`${isEs ? "Ver imagen" : "Show image"} ${i + 1}`}
                aria-current={i === current}
                className={`relative block h-9 w-14 overflow-hidden rounded-md border-2 transition-all duration-200 cursor-pointer ${
                  i === current ? "border-brand" : "border-transparent opacity-50 hover:opacity-100"
                }`}
              >
                {isPdf(img) ? (
                  <span className="flex h-full w-full items-center justify-center bg-surface text-accent">
                    <FileText size={16} aria-hidden="true" />
                  </span>
                ) : (
                  <Image src={img} alt="" fill className="object-cover" sizes="56px" />
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
