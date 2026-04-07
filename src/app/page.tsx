"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LayoutAnimation from "@/components/LayoutAnimation";
import CursorGlow from "@/components/CursorGlow";
import AmbientGlow from "@/components/AmbientGlow";
import ContactGlow from "@/components/ContactGlow";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageToggle from "@/components/LanguageToggle";
import { useLanguage } from "@/context/LanguageContext";
import portfolioData from "@/data/portfolio.json";

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.1 },
  },
};
const fadeUpBlur = {
  hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] as const },
  },
};
const fadeUpText = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
  },
};
const sectionScrollEnter = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const NavLink = ({ href, label }: { href: string; label: string }) => (
  <a
    href={href}
    className="hover:text-zinc-900 dark:hover:text-white transition-colors flex items-center gap-4 group w-fit cursor-pointer"
  >
    <span className="h-[2px] w-8 bg-zinc-300 dark:bg-zinc-700 group-hover:w-16 group-hover:bg-[#A78BFA] transition-all duration-300" />
    {label}
  </a>
);

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

interface Project {
  id: string;
  period: string;
  title: string;
  subtitle: string;
  role: string;
  summary: string;
  description: string;
  bullets: string[];
  stack: string[];
  github: string;
  images: string[];
}

/* ─── Lightbox ─── */
function Lightbox({
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
  const go = (i: number) => setCurrent((i + n) % n);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") go(current - 1);
      if (e.key === "ArrowRight") go(current + 1);
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [current, onClose]);

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
          className="relative w-full h-full max-w-5xl mx-auto px-12 flex items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.12 }}
          onClick={(e) => e.stopPropagation()}
        >
          <Image
            src={images[current]}
            alt={`img ${current + 1}`}
            fill
            className="object-contain"
            sizes="100vw"
            priority
          />
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

/* ─── Project modal — Refined premium layout matching CVModal ─── */
function ProjectModal({
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
  const go = (i: number) => setCurrent((i + n) % n);

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
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 bg-black/40 backdrop-blur-[2px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="relative w-full max-w-6xl h-[92vh] bg-white/90 dark:bg-zinc-900/40 backdrop-blur-2xl rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl border border-zinc-100/50 dark:border-zinc-800/50"
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
              <div className="min-w-0">
                <h2 className="font-playfair text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white truncate">
                  {project.title}
                </h2>
                <p className="text-[10px] font-bold tracking-widest text-[#A78BFA] uppercase">
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
            <div className="grid grid-cols-1 lg:grid-cols-12 h-full">
              {/* Left Column: Info */}
              <div className="lg:col-span-5 p-8 sm:p-10 border-b lg:border-b-0 lg:border-r border-zinc-100/50 dark:border-zinc-800/50 space-y-8 bg-white/20 dark:bg-white/5">
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
              </div>

              {/* Right Column: Imagery */}
              <div className="lg:col-span-7 bg-zinc-50 dark:bg-black/20 flex flex-col">
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
                          sizes="1000px"
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


/* ─── Mini carousel — pure crossfade ─── */
function MiniCarousel({
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
  const go = (i: number) => setCurrent((i + n) % n);

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
            <Image
              src={images[current]}
              alt={`${title} ${current + 1}`}
              fill
              className="object-contain p-3 transition-opacity duration-300"
              sizes="40vw"
              draggable={false}
            />
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
              <Image
                src={src}
                alt={`thumb ${i + 1}`}
                fill
                className="object-cover"
                sizes="56px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── CV Viewer Modal ─── */
function DocumentViewer({
  url,
  title,
  subtitle,
  onClose,
}: {
  url: string;
  title: string;
  subtitle?: string;
  onClose: () => void;
}) {
  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4 sm:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative w-full max-w-6xl h-[92vh] bg-white/90 dark:bg-zinc-900/40 backdrop-blur-2xl rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl border border-zinc-100/50 dark:border-zinc-800/50"
        initial={{ scale: 0.9, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 40 }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-8 py-6 border-b border-zinc-100 dark:border-zinc-800 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-[#A78BFA]/10 flex items-center justify-center text-[#A78BFA] border border-[#A78BFA]/10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <div>
              <h3 className="font-playfair text-xl font-bold text-zinc-900 dark:text-white">
                {title}
              </h3>
              {subtitle && (
                <p className="text-[10px] font-bold tracking-widest text-[#A78BFA] uppercase">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={url}
              download={url.split('/').pop()}
              className="flex items-center gap-2 px-6 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-bold rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-black/10 dark:shadow-white/10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
              <span className="hidden sm:inline">Descargar</span>
            </a>
            <button
              onClick={onClose}
              className="group p-2.5 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-2xl transition-all duration-300 text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:scale-110"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="group-hover:rotate-90 transition-transform duration-300"
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div className="flex-1 bg-zinc-50 dark:bg-black/40 relative overflow-hidden">
          {url.match(/\.(jpg|jpeg|png|webp)$/i) ? (
            <div className="relative w-full h-full p-4 sm:p-12">
              <Image
                src={url}
                alt={title}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>
          ) : (
            <iframe
              src={`${url}#toolbar=0&navpanes=0`}
              className="w-full h-full border-none shadow-sm"
              title="Document Viewer"
            />
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Home() {
  const { t } = useLanguage();
  const isEsLang = t("experience") === "EXPERIENCIA";
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [lightboxInfo, setLightboxInfo] = useState<{
    images: string[];
    index: number;
  } | null>(null);
  const [showCV, setShowCV] = useState(false);
  const [viewerDoc, setViewerDoc] = useState<{ url: string; title: string; subtitle?: string } | null>(null);
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

  const projects: Project[] = portfolioData.projects.map((p) => ({
    id: p.id,
    period: isEsLang ? p.period.es : p.period.en,
    title: isEsLang ? p.title.es : p.title.en,
    subtitle: isEsLang ? p.subtitle.es : p.subtitle.en,
    role: isEsLang ? p.role.es : p.role.en,
    summary: isEsLang ? p.summary.es : p.summary.en,
    description: isEsLang ? p.description.es : p.description.en,
    bullets: isEsLang ? p.bullets.es : p.bullets.en,
    stack: p.stack,
    github: p.github,
    images: p.images.map((img) => `${basePath}${img}`),
  }));

  const socialIcons: Record<string, React.ReactNode> = {
    email: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
    linkedin: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect width="4" height="12" x="2" y="9" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
    phone: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.42 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.5 16z" />
      </svg>
    ),
    github: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 98 96"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
        />
      </svg>
    ),
    cv: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <line x1="10" y1="9" x2="8" y2="9" />
      </svg>
    ),
  };

  const socialLinks = [
    ...portfolioData.socialLinks.map((l) => ({
      platform: l.platform,
      href: l.href,
      target:
        (l as { target?: string }).target ??
        (l.platform === "email" || l.platform === "phone" ? undefined : "_blank"),
      icon: socialIcons[l.platform] || null,
    })),
    {
      platform: "cv",
      href: "#",
      target: undefined,
      icon: socialIcons["cv"],
      isCV: true,
    },
  ];

  return (
    <main className="bg-slate-50 dark:bg-[#0A0A0B] text-zinc-900 dark:text-zinc-200 relative min-h-screen overflow-x-hidden selection:bg-[#A78BFA]/30 selection:text-[#A78BFA] transition-colors duration-700">
      <ThemeToggle />
      <LanguageToggle />
      <CursorGlow />

      <AnimatePresence>
        {activeProject && (
          <ProjectModal
            project={activeProject}
            onClose={() => setActiveProject(null)}
            isEs={isEsLang}
          />
        )}
      </AnimatePresence>

      {/* HERO */}
      <div className="flex flex-col lg:flex-row justify-between w-full relative z-10 mb-32 lg:mb-40">
        <motion.section
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="hidden lg:flex w-[45%] flex-col pt-[15vh] pl-10 lg:pl-16 xl:pl-20 z-20 relative"
        >
          <AmbientGlow />
          <motion.h1
            variants={fadeUpBlur}
            className="font-playfair text-6xl md:text-7xl xl:text-[5.1rem] tracking-tight leading-none text-zinc-900 dark:text-white font-bold w-full drop-shadow-md dark:drop-shadow-lg relative z-10"
          >
            {portfolioData.hero.name}
            <br />
            <span className="text-zinc-500">{portfolioData.hero.surname}</span>
          </motion.h1>
          <motion.p
            variants={fadeUpBlur}
            className="font-sans text-xl mt-6 text-[#A78BFA] font-medium tracking-wide relative z-10"
          >
            {isEsLang ? portfolioData.hero.role.es : portfolioData.hero.role.en}
          </motion.p>
          <motion.nav
            variants={fadeUpText}
            className="mt-16 flex flex-col gap-6 font-sans text-xs font-bold tracking-[0.2em] text-zinc-400 dark:text-zinc-500 uppercase relative z-30"
          >
            <NavLink href="#proyectos" label={t("projects")} />
            <NavLink href="#educacion" label={t("studies")} />
            <NavLink href="#habilidades" label={t("skills")} />
            <NavLink href="#logros" label={t("achievements")} />
            <NavLink
              href="#contacto"
              label={isEsLang ? "CONTACTO" : "CONTACT"}
            />
          </motion.nav>
          <motion.div
            variants={fadeUpText}
            className="flex gap-4 mt-16 relative z-30"
          >
            {socialLinks.map((l, i) => (
              <a
                key={i}
                href={l.href}
                target={(l as { target?: string }).target}
                onClick={(e) => {
                  if ("isCV" in l && l.isCV) {
                    e.preventDefault();
                    setShowCV(true);
                  }
                }}
                title={"isCV" in l && l.isCV ? (isEsLang ? "Ver / Descargar CV" : "View / Download CV") : undefined}
                className="flex items-center justify-center w-11 h-11 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-black/5 dark:border-white/5 rounded-full transition-all duration-300 text-zinc-700 dark:text-zinc-300 backdrop-blur-md group"
              >
                <div className="group-hover:scale-110 transition-transform duration-300">
                   {l.icon}
                </div>
              </a>
            ))}
          </motion.div>
        </motion.section>

        <motion.section
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="lg:hidden w-full px-10 pt-16 pb-8 z-20 relative"
        >
          <AmbientGlow />
          <motion.h1
            variants={fadeUpBlur}
            className="font-playfair text-6xl tracking-tight leading-none text-zinc-900 dark:text-white font-bold w-full drop-shadow-md relative z-10"
          >
            {portfolioData.hero.name}
            <br />
            <span className="text-zinc-500">{portfolioData.hero.surname}</span>
          </motion.h1>
          <motion.p
            variants={fadeUpBlur}
            className="font-sans text-xl mt-4 text-[#A78BFA] font-medium tracking-wide relative z-10"
          >
            {isEsLang ? portfolioData.hero.role.es : portfolioData.hero.role.en}
          </motion.p>
          <motion.nav
            variants={fadeUpText}
            className="mt-8 flex flex-col gap-4 font-sans text-xs font-bold tracking-[0.2em] text-zinc-500 uppercase relative z-30"
          >
            {(
              ["#proyectos", "#educacion", "#habilidades", "#logros"] as const
            ).map((href, i) => (
              <a
                key={i}
                href={href}
                className="hover:text-zinc-900 dark:hover:text-white transition-colors w-fit"
              >
                {
                  [t("projects"), t("studies"), t("skills"), t("achievements")][
                    i
                  ]
                }
              </a>
            ))}
          </motion.nav>
          <motion.div
            variants={fadeUpText}
            className="flex gap-4 mt-8 relative z-30"
          >
            {socialLinks.map((l, i) => (
              <a
                key={i}
                href={l.href}
                target={(l as { target?: string }).target}
                onClick={(e) => {
                  if ("isCV" in l && l.isCV) {
                    e.preventDefault();
                    setShowCV(true);
                  }
                }}
                title={"isCV" in l && l.isCV ? (isEsLang ? "Ver / Descargar CV" : "View / Download CV") : undefined}
                className="flex items-center justify-center w-11 h-11 bg-zinc-200/80 dark:bg-zinc-900/80 rounded-full hover:bg-zinc-300 dark:hover:bg-zinc-800 transition-colors text-zinc-700 dark:text-zinc-300 backdrop-blur-md"
              >
                {l.icon}
              </a>
            ))}
          </motion.div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 1,
            delay: 0.6,
            ease: [0.16, 1, 0.3, 1] as const,
          }}
          className="w-full lg:w-[50%] lg:pr-10 xl:pr-20 relative z-10"
        >
          <div className="w-full flex-1 relative lg:mt-[15vh]">
            <LayoutAnimation />
          </div>
        </motion.section>
      </div>

      {/* SECCIONES */}
      <div className="flex flex-col w-full relative z-10 px-10 lg:px-16 xl:px-20 space-y-32 pb-40 font-sans">
        {/* PROYECTOS */}
        <motion.section
          id="proyectos"
          className="scroll-mt-24"
          variants={sectionScrollEnter}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
        >
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-10 tracking-tight border-b border-zinc-200 dark:border-zinc-800 pb-5">
            {isEsLang ? "Proyectos" : "Projects"}
          </h2>
          <div className="flex flex-col gap-20">
            {projects.map((p) => (
              <div key={p.id} className="group relative overflow-hidden">
                {/* CV-style Corner Glow */}
                <div className="absolute -top-32 -right-32 w-80 h-80 bg-[#A78BFA]/5 blur-[100px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
                  <div className="relative pl-6 border-l-2 border-zinc-200 dark:border-zinc-800 group-hover:border-[#A78BFA] transition-colors duration-300">
                    <p className="text-[#A78BFA] text-xs font-bold tracking-widest mb-1">
                      {p.period}
                    </p>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
                        {p.title}
                      </h3>
                      <a
                        href={p.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 mt-1 flex items-center gap-1 text-xs font-semibold text-zinc-400 hover:text-[#A78BFA] transition-colors"
                      >
                        <GitHubIcon />
                        GitHub
                      </a>
                    </div>
                    <p className="text-zinc-500 font-medium mb-3 text-sm">
                      {p.subtitle} —{" "}
                      <span className="text-[#A78BFA]">{p.role}</span>
                    </p>
                    <p className="text-zinc-500 leading-relaxed mb-5 text-sm">
                      {p.summary}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {p.stack.slice(0, 4).map((s) => (
                        <span
                          key={s}
                          className="px-3 py-1 bg-[#A78BFA]/10 text-[#A78BFA] text-xs font-semibold rounded-full border border-[#A78BFA]/20"
                        >
                          {s}
                        </span>
                      ))}
                      {p.stack.length > 4 && (
                        <span className="px-3 py-1 text-zinc-400 text-xs font-semibold rounded-full border border-zinc-200 dark:border-zinc-800">
                          +{p.stack.length - 4} más
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => setActiveProject(p)}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-[#A78BFA] group/cta hover:gap-3 transition-all"
                    >
                      <span>{isEsLang ? "Ver detalle" : "View details"}</span>
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
                        className="transition-transform group-hover/cta:translate-x-1"
                      >
                        <path d="M5 12h14" />
                        <path d="m12 5 7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                  <MiniCarousel
                    images={p.images}
                    title={p.title}
                    onClickImage={(idx) =>
                      setLightboxInfo({ images: p.images, index: idx })
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* EDUCACIÓN */}
        <motion.section
          id="educacion"
          className="scroll-mt-24"
          variants={sectionScrollEnter}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-10 tracking-tight border-b border-zinc-200 dark:border-zinc-800 pb-5">
            {isEsLang ? "Educación" : "Education"}
          </h2>
          <div className="flex flex-col gap-10">
            {portfolioData.education.map((item) => (
              <div key={item.id} className="group relative">
                <p className="text-[#A78BFA] text-sm font-semibold tracking-wider mb-2">
                  {isEsLang ? item.period.es : item.period.en}
                </p>
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-[#A78BFA] transition-colors mb-1">
                  {isEsLang ? item.title.es : item.title.en}
                </h3>
                <h4 className="text-zinc-600 dark:text-zinc-400 mb-2 font-medium text-lg">
                  {item.institution}
                </h4>
                {(isEsLang ? item.description.es : item.description.en) && (
                  <p className="text-zinc-500 leading-relaxed max-w-3xl">
                    {isEsLang ? item.description.es : item.description.en}
                  </p>
                )}
              </div>
            ))}
          </div>
        </motion.section>

        {/* HABILIDADES */}
        <motion.section
          id="habilidades"
          className="scroll-mt-24"
          variants={sectionScrollEnter}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-10 tracking-tight border-b border-zinc-200 dark:border-zinc-800 pb-5">
            {isEsLang ? "Habilidades" : "Skills"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {portfolioData.skills.categories.map((cat) => (
              <div
                key={cat.label.en}
                className="group p-6 bg-white/40 dark:bg-zinc-900/20 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800/80 rounded-[2rem] hover:border-[#A78BFA]/30 transition-all duration-300 relative overflow-hidden"
              >
                {/* CV-style Corner Glow */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#A78BFA]/10 blur-[80px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-5">
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{
                        backgroundColor: cat.color,
                        boxShadow: `0 0 8px ${cat.color}80`,
                      }}
                    />
                    <h3 className="text-sm font-bold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase">
                      {isEsLang ? cat.label.es : cat.label.en}
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {cat.tags.map((s) => (
                      <span
                        key={s}
                        className={`px-3 py-1.5 bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 text-xs font-medium rounded-full border border-zinc-200 dark:border-zinc-800 ${cat.borderHover} ${cat.textHover} transition-colors cursor-default`}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {/* Languages Card */}
            <div className="group p-6 bg-white/40 dark:bg-zinc-900/20 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800/80 rounded-[2rem] hover:border-[#A78BFA]/30 transition-all duration-300 md:col-span-2 relative overflow-hidden">
               {/* CV-style Corner Glow */}
               <div className="absolute -top-24 -right-24 w-80 h-80 bg-[#A78BFA]/10 blur-[90px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
               
               <div className="relative z-10">
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0"
                    style={{ boxShadow: "0 0 8px rgba(251,191,36,0.8)" }}
                  />
                  <h3 className="text-sm font-bold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase">
                    {isEsLang ? "Idiomas" : "Languages"}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  {portfolioData.skills.languages.map((lang) => (
                    <div
                      key={lang.name.en}
                      className="flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-900 rounded-full border border-zinc-200 dark:border-zinc-800"
                    >
                      <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                        {lang.flag} {isEsLang ? lang.name.es : lang.name.en}
                      </span>
                      <span className="text-xs text-zinc-400 font-medium">
                        {isEsLang ? lang.level.es : lang.level.en}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* LOGROS */}
        <motion.section
          id="logros"
          className="scroll-mt-24"
          variants={sectionScrollEnter}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-10 tracking-tight border-b border-zinc-200 dark:border-zinc-800 pb-5">
            {isEsLang ? "Logros" : "Achievements"}
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {portfolioData.achievements.map((ach) => (
              <div key={ach.id} className="flex items-start gap-5 group">
                <div className="mt-[8px] h-2 w-2 rounded-full bg-[#A78BFA] shadow-[0_0_12px_rgba(167,139,250,0.8)] flex-shrink-0 group-hover:scale-125 transition-transform" />
                <div>
                  <p className="text-[#A78BFA] text-xs font-bold tracking-widest mb-1">
                    {ach.year}
                  </p>
                  <h3 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">
                    {isEsLang ? ach.title.es : ach.title.en}
                  </h3>
                  <p className="text-zinc-500 mt-2 max-w-xl leading-relaxed">
                    {isEsLang ? ach.description.es : ach.description.en}
                  </p>
                  {ach.file && (
                    <button
                      onClick={() => setViewerDoc({ 
                        url: `${basePath}${ach.file}`, 
                        title: isEsLang ? "Certificación" : "Certification", 
                        subtitle: isEsLang ? ach.title.es : ach.title.en 
                      })}
                      className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-[#A78BFA]/10 text-[#A78BFA] text-xs font-bold rounded-lg border border-[#A78BFA]/20 hover:bg-[#A78BFA] hover:text-white transition-all active:scale-95 group/btn"
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
                        className="group-hover/btn:scale-110 transition-transform"
                      >
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      {isEsLang ? "Ver certificación" : "View certification"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* CONTACTO */}
        <motion.section
          id="contacto"
          className="scroll-mt-24 relative overflow-hidden"
          variants={sectionScrollEnter}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
        >
          {/* Section-specific Ambient Glow - Now with progressive masking to avoid hard edges while keeping page size stable */}
          <div className="absolute inset-x-0 bottom-0 top-0 z-0 pointer-events-none" style={{ 
            maskImage: 'linear-gradient(to bottom, transparent 0%, white 15%, white 85%, transparent 100%), linear-gradient(to right, transparent 0%, white 10%, white 90%, transparent 100%)', 
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, white 15%, white 85%, transparent 100%), linear-gradient(to right, transparent 0%, white 10%, white 90%, transparent 100%)',
            maskComposite: 'intersect',
            WebkitMaskComposite: 'source-in'
          }}>
            <ContactGlow />
          </div>

          <div className="relative z-10">
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-10 tracking-tight border-b border-zinc-200 dark:border-zinc-800 pb-5">
              {isEsLang ? "Contacto" : "Contact"}
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* Contact cards */}
              <div className="flex flex-col gap-5">
                <p className="text-zinc-500 leading-relaxed text-sm max-w-md">
                {isEsLang
                  ? "Estoy abierto a nuevas oportunidades, colaboraciones o simplemente una charla técnica. ¡No dudes en escribirme!"
                  : "I'm open to new opportunities, collaborations or just a technical chat. Feel free to reach out!"}
              </p>
              {(
                [
                  {
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect width="20" height="16" x="2" y="4" rx="2" />
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                      </svg>
                    ),
                    label: "Email",
                    value: portfolioData.contact.email,
                    href: `mailto:${portfolioData.contact.email}`,
                  },
                  {
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.42 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.5 16z" />
                      </svg>
                    ),
                    label: isEsLang ? "Teléfono" : "Phone",
                    value: portfolioData.contact.phone,
                    href: `tel:${portfolioData.contact.phone.replace(/\s/g, "")}`,
                  },
                  {
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    ),
                    label: isEsLang ? "Ubicación" : "Location",
                    value: isEsLang
                      ? portfolioData.contact.location.es
                      : portfolioData.contact.location.en,
                    href: undefined,
                  },
                  {
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                        <rect width="4" height="12" x="2" y="9" />
                        <circle cx="4" cy="4" r="2" />
                      </svg>
                    ),
                    label: "LinkedIn",
                    value: "tobias-alejandro-maciel-meister",
                    href: portfolioData.contact.linkedin,
                  },
                  {
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 98 96"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
                        />
                      </svg>
                    ),
                    label: "GitHub",
                    value: "TobiasMaciel",
                    href: portfolioData.contact.github,
                  },
                ] as {
                  icon: React.ReactNode;
                  label: string;
                  value: string;
                  href: string | undefined;
                }[]
              ).map((item) => (
                <div key={item.label} className="flex items-center gap-4 group">
                  <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#A78BFA]/10 border border-[#A78BFA]/20 text-[#A78BFA] flex-shrink-0 group-hover:bg-[#A78BFA]/20 transition-colors">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
                      {item.label}
                    </p>
                    {item.href ? (
                      <a
                        href={item.href}
                        target={
                          item.href.startsWith("http") ? "_blank" : undefined
                        }
                        rel="noopener noreferrer"
                        className="text-sm text-zinc-700 dark:text-zinc-300 hover:text-[#A78BFA] transition-colors font-medium"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-sm text-zinc-700 dark:text-zinc-300 font-medium">
                        {item.value}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* CV Section — Redesigned for premium editorial look */}
            <div className="lg:col-span-1 flex flex-col gap-10 p-10 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 bg-white/40 dark:bg-zinc-900/20 backdrop-blur-xl relative overflow-hidden group">
              {/* Background Glow */}
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#A78BFA]/10 blur-[80px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <span className="h-[2px] w-8 bg-[#A78BFA]" />
                  <p className="text-[#A78BFA] text-[10px] font-bold tracking-[0.4em] uppercase">
                    {isEsLang ? "Currículum Vitae" : "Resume"}
                  </p>
                </div>

                <h3 className="font-playfair text-4xl sm:text-5xl font-bold text-zinc-900 dark:text-white leading-[1.1] mb-6">
                  {isEsLang
                    ? "Trayectoria &\nExperiencia"
                    : "Journey &\nExperience"}
                </h3>

                <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed max-w-sm mb-10">
                  {isEsLang
                    ? "Consultá mi historial completo, formación académica y certificaciones actualizadas a la fecha."
                    : "Check my full history, academic background and current certifications up to date."}
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => setShowCV(true)}
                    className="flex-1 inline-flex items-center justify-center gap-3 px-8 py-5 bg-[#A78BFA] hover:bg-[#9061f9] text-white font-bold text-sm rounded-2xl transition-all duration-300 shadow-xl shadow-[#A78BFA]/30 active:scale-95 group/btn"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="group-hover/btn:scale-110 transition-transform"
                    >
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    {isEsLang ? "Ver en Pantalla" : "View In-Page"}
                  </button>

                  <a
                    href={`${basePath}${isEsLang ? "/CV/CV_Tobias_Maciel_ES.pdf" : "/CV/CV_Tobias_Maciel_EN.pdf"}`}
                    download={
                      isEsLang
                        ? "CV_Tobias_Maciel_ES.pdf"
                        : "CV_Tobias_Maciel_EN.pdf"
                    }
                    className="flex-1 inline-flex items-center justify-center gap-3 px-8 py-5 border border-zinc-200 dark:border-zinc-800 hover:border-[#A78BFA] dark:hover:border-[#A78BFA] text-zinc-700 dark:text-zinc-300 hover:text-[#A78BFA] dark:hover:text-[#A78BFA] font-bold text-sm rounded-2xl transition-all duration-300 bg-white/50 dark:bg-zinc-900 shadow-sm backdrop-blur-sm group/dl"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="group-hover/dl:translate-y-1 transition-transform"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" x2="12" y1="15" y2="3" />
                    </svg>
                    {isEsLang ? "Descargar PDF" : "Download PDF"}
                  </a>
                </div>

                <div className="flex items-center gap-4 mt-10 opacity-30 group-hover:opacity-60 transition-opacity">
                  <div className="h-px flex-1 bg-zinc-300 dark:bg-zinc-700" />
                  <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-zinc-500">
                    {isEsLang ? "2026 UPDATE" : "2026 UPDATE"}
                  </p>
                  <div className="h-px flex-1 bg-zinc-300 dark:bg-zinc-700" />
                </div>
              </div>
              </div>
            </div>
          </div>
        </motion.section>
      </div>

      <AnimatePresence>
        {showCV && (
          <DocumentViewer
            url={`${basePath}${isEsLang ? "/CV/CV_Tobias_Maciel_ES.pdf" : "/CV/CV_Tobias_Maciel_EN.pdf"}`}
            title={isEsLang ? "Curriculum Vitae" : "Resume"}
            subtitle="Tobías Alejandro Maciel Meister"
            onClose={() => setShowCV(false)}
          />
        )}
        {viewerDoc && (
          <DocumentViewer
            url={viewerDoc.url}
            title={viewerDoc.title}
            subtitle={viewerDoc.subtitle}
            onClose={() => setViewerDoc(null)}
          />
        )}
        {lightboxInfo && (
          <Lightbox
            images={lightboxInfo.images}
            startIndex={lightboxInfo.index}
            onClose={() => setLightboxInfo(null)}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
