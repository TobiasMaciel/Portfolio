"use client";

import Image from "next/image";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Project } from "@/types";
import Lightbox from "./Lightbox";

const GitHubIcon = ({ size = 14 }: { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 98 96"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
    />
  </svg>
);

export default function ProjectModal({
  project,
  onClose,
  isEs,
}: {
  project: Project;
  onClose: () => void;
  isEs: boolean;
}) {
  const [current, setCurrent] = useState(0);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const dragX = useRef(0);
  const didDrag = useRef(false);
  const n = project.images.length;
  const go = useCallback((i: number) => setCurrent((i + n) % n), [n]);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === "Escape" && lightboxIdx === null) onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", fn);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", fn);
    };
  }, [onClose, lightboxIdx]);

  return (
    <>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-6 md:p-8 bg-black/40 backdrop-blur-[2px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="relative w-full max-w-6xl h-full lg:h-[92vh] bg-white/90 dark:bg-zinc-900/40 backdrop-blur-2xl rounded-3xl md:rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl border border-zinc-100/50 dark:border-zinc-800/50"
          initial={{ scale: 0.9, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 40 }}
          transition={{ type: "spring", damping: 28, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-8 py-6 border-b border-zinc-100 dark:border-zinc-800 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md relative z-20">
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-[#A78BFA]/10 flex items-center justify-center text-[#A78BFA] border border-[#A78BFA]/10 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 18a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2"/><path d="M7 18a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2"/><path d="M12 12h.01"/></svg>
              </div>
              <div className="min-w-0 pr-2">
                <h2 className="font-playfair text-lg sm:text-xl md:text-2xl font-bold text-zinc-900 dark:text-white leading-tight">
                  {project.title}
                </h2>
                <p className="text-[10px] font-bold tracking-widest text-[#A78BFA] uppercase mt-0.5">
                  {project.subtitle} · {project.role}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="group p-2.5 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-2xl transition-all duration-300 text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:scale-110"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:rotate-90 transition-transform duration-300"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          </div>

          {/* Scrollable Body — Two Column Desktop Layout */}
          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-12 h-full">
              {/* Left Column: Info */}
              <div className="md:col-span-5 p-6 sm:p-10 border-b md:border-b-0 md:border-r border-zinc-100/50 dark:border-zinc-800/50 space-y-8 bg-white/20 dark:bg-white/5">
                <div>
                  <h4 className="text-[10px] font-bold tracking-[0.2em] text-[#A78BFA] uppercase mb-3">
                    {isEs ? "Sobre el Proyecto" : "About Project"}
                  </h4>
                  <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm">
                    {project.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-8">
                  <div>
                    <h4 className="text-[10px] font-bold tracking-[0.2em] text-[#A78BFA] uppercase mb-4">
                      {isEs ? "Características Clave" : "Key Features"}
                    </h4>
                    <ul className="space-y-3">
                      {project.bullets.map((b, i) => (
                        <li key={i} className="flex gap-3 text-zinc-600 dark:text-zinc-400 text-sm leading-snug">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#A78BFA]/40 mt-1.5 flex-shrink-0" />
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-[10px] font-bold tracking-[0.2em] text-[#A78BFA] uppercase mb-4">
                      {isEs ? "Tecnologías" : "Technologies"}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {project.stack.map((s) => (
                        <span
                          key={s}
                          className="px-3 py-1.5 bg-[#A78BFA]/5 text-[#A78BFA] text-[10px] font-bold rounded-lg border border-[#A78BFA]/10 uppercase tracking-wider"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {project.github && (
                  <div className="pt-4">
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-3 px-6 py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-bold rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-black/20 dark:hover:shadow-white/10 active:scale-95"
                    >
                      <GitHubIcon size={18} />
                      <span>{isEs ? "Ver Repositorio" : "View Repository"}</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                    </a>
                  </div>
                )}
              </div>

              {/* Right Column: Imagery */}
              {project.images && project.images.length > 0 && (
                <div className="md:col-span-7 bg-zinc-50 dark:bg-black/20 flex flex-col">
                  <div className="flex-1 p-8 sm:p-10 flex flex-col gap-6">
                    {/* Main Gallery Frame */}
                    <div 
                      className="relative w-full flex-1 min-h-[300px] rounded-[2rem] overflow-hidden bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-white/5 cursor-zoom-in group/gallery shadow-inner"
                      onClick={() => setLightboxIdx(current)}
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
                        }
                        didDrag.current = false;
                      }}
                    >
                      <AnimatePresence mode="sync">
                        <motion.div
                          key={current}
                          className="absolute inset-0"
                          initial={{ opacity: 0, scale: 1.05 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.4 }}
                        >
                          <Image
                            src={project.images[current]}
                            alt={project.title}
                            fill
                            className="object-contain p-4 transition-all duration-500"
                            sizes="(max-width: 768px) 100vw, 1000px"
                            priority
                          />
                        </motion.div>
                      </AnimatePresence>

                      {/* Navigation Overlays */}
                      {n > 1 && (
                        <>
                          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 opacity-0 group-hover/gallery:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => { e.stopPropagation(); go(current - 1); }}
                              className="w-10 h-10 flex items-center justify-center rounded-xl bg-black/40 backdrop-blur-md text-white border border-white/10 hover:bg-black/60 transition-all"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); go(current + 1); }}
                              className="w-10 h-10 flex items-center justify-center rounded-xl bg-black/40 backdrop-blur-md text-white border border-white/10 hover:bg-black/60 transition-all"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                            </button>
                          </div>
                          <div className="absolute bottom-6 right-6">
                            <span className="px-3 py-1.5 bg-black/40 backdrop-blur-md text-white text-[10px] font-bold rounded-lg border border-white/10 shadow-xl">
                              {current + 1} / {n}
                            </span>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Thumbnail Selector */}
                    {n > 1 && (
                      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                        {project.images.map((src, i) => (
                          <button
                            key={i}
                            onClick={() => setCurrent(i)}
                            className={`relative flex-shrink-0 w-24 h-16 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                              i === current ? "border-[#A78BFA] scale-105 shadow-lg shadow-[#A78BFA]/20" : "border-transparent opacity-50 hover:opacity-100"
                            }`}
                          >
                            <Image
                              src={src}
                              alt={`thumb ${i + 1}`}
                              fill
                              className="object-cover"
                              sizes="96px"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {lightboxIdx !== null && (
          <Lightbox
            images={project.images}
            startIndex={lightboxIdx}
            onClose={() => setLightboxIdx(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
