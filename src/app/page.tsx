"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LayoutAnimation from "@/components/LayoutAnimation";
import CursorGlow from "@/components/CursorGlow";
import AmbientGlow from "@/components/AmbientGlow";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageToggle from "@/components/LanguageToggle";
import { useLanguage } from "@/context/LanguageContext";

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
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.5a5.5 5.5 0 0 0-1.5-3.8 5.5 5.5 0 0 0 .2-3.8s-1.2-.4-3.9 1.8a13.2 13.2 0 0 0-7 0C6.2 3.4 5 3.8 5 3.8a5.5 5.5 0 0 0 .2 3.8A5.5 5.5 0 0 0 3 11.5c0 5 3 6.2 6 6.5a4.8 4.8 0 0 0-1 3.2v4" />
    <path d="M9 18c-4.5 1.6-5-2.5-5-2.5" />
  </svg>
);

interface Project {
  id: string;
  period: string;
  title: string;
  subtitle: string;
  role: string;
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
      className="fixed inset-0 z-[300] flex items-center justify-center bg-black/96"
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

/* ─── Project modal — text top, images bottom, minimal radius, no heavy blur ─── */
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
        className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {/* backdrop — light dimming, no heavy blur */}
        <div className="absolute inset-0 bg-black/50" onClick={onClose} />

        {/* modal panel */}
        <motion.div
          className="relative w-full sm:max-w-xl max-h-[92dvh] sm:max-h-[85vh] bg-white dark:bg-[#0E0E0F] rounded-t-xl sm:rounded-xl overflow-hidden flex flex-col border border-zinc-200 dark:border-zinc-800 shadow-xl"
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 60, opacity: 0 }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
        >
          {/* ── header bar ── */}
          <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-zinc-100 dark:border-zinc-900 flex-shrink-0">
            <div>
              <p className="text-[#A78BFA] text-[10px] font-bold tracking-widest mb-1">
                {project.period}
              </p>
              <h2 className="font-playfair text-xl font-bold text-zinc-900 dark:text-white leading-tight">
                {project.title}
              </h2>
              <p className="text-zinc-500 text-xs mt-0.5">
                {project.subtitle} ·{" "}
                <span className="text-[#A78BFA]">{project.role}</span>
              </p>
            </div>
            <button
              onClick={onClose}
              className="mt-0.5 flex-shrink-0 ml-4 w-8 h-8 flex items-center justify-center rounded text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
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
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* ── scrollable body ── */}
          <div className="overflow-y-auto flex-1 px-6 py-5 space-y-4 font-sans">
            {/* description */}
            <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed text-sm">
              {project.description}
            </p>

            {/* bullets */}
            <ul className="space-y-2">
              {project.bullets.map((b, i) => (
                <li key={i} className="flex gap-2 text-zinc-500 text-sm">
                  <span className="text-[#A78BFA] flex-shrink-0">›</span>
                  {b}
                </li>
              ))}
            </ul>

            {/* stack */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {project.stack.map((s) => (
                <span
                  key={s}
                  className="px-2.5 py-1 bg-[#A78BFA]/10 text-[#A78BFA] text-xs font-semibold rounded-md border border-[#A78BFA]/20"
                >
                  {s}
                </span>
              ))}
            </div>

            {/* github */}
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-500 dark:text-zinc-400 hover:text-[#A78BFA] transition-colors group/gh pt-1"
            >
              <GitHubIcon size={14} />
              <span>
                {isEs
                  ? "Ver repositorio en GitHub"
                  : "View repository on GitHub"}
              </span>
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
                className="transition-transform group-hover/gh:translate-x-0.5"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </a>

            {/* ── images — at the bottom ── */}
            <div className="border-t border-zinc-100 dark:border-zinc-900 pt-5 space-y-3">
              {/* main image */}
              <div
                className="relative w-full rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 cursor-pointer select-none"
                style={{ aspectRatio: "16/9" }}
                onPointerDown={(e) => {
                  dragX.current = e.clientX;
                  didDrag.current = false;
                  (e.currentTarget as HTMLElement).setPointerCapture(
                    e.pointerId,
                  );
                }}
                onPointerMove={(e) => {
                  if (Math.abs(e.clientX - dragX.current) > 8)
                    didDrag.current = true;
                }}
                onPointerUp={(e) => {
                  if (didDrag.current) {
                    const d = e.clientX - dragX.current;
                    if (Math.abs(d) > 30) go(current + (d < 0 ? 1 : -1));
                  } else {
                    setLightboxIdx(current);
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
                    transition={{ duration: 0.25 }}
                  >
                    <Image
                      src={project.images[current]}
                      alt={project.title}
                      fill
                      className="object-cover"
                      sizes="600px"
                      priority
                    />
                  </motion.div>
                </AnimatePresence>

                {/* hover hint */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/10">
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-white bg-black/40 px-3 py-1.5 rounded-md border border-white/15">
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
                      <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                    </svg>
                    {isEs ? "Ampliar" : "Expand"}
                  </span>
                </div>

                {n > 1 && (
                  <>
                    <button
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={() => go(current - 1)}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded bg-black/40 text-white border border-white/10 hover:bg-black/60 transition-all z-10"
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
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={() => go(current + 1)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded bg-black/40 text-white border border-white/10 hover:bg-black/60 transition-all z-10"
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
                    <span className="absolute bottom-2 right-2 text-[10px] text-white/60 bg-black/25 px-1.5 py-0.5 rounded">
                      {current + 1}/{n}
                    </span>
                  </>
                )}
              </div>

              {/* thumbnail strip */}
              {n > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-0.5">
                  {project.images.map((src, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrent(i)}
                      className="relative flex-shrink-0 w-16 h-10 rounded overflow-hidden border-2 transition-all duration-200"
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
                        sizes="64px"
                      />
                    </button>
                  ))}
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

/* ─── Mini carousel — pure crossfade ─── */
function MiniCarousel({ images, title }: { images: string[]; title: string }) {
  const [current, setCurrent] = useState(0);
  const dragX = useRef(0);
  const didDrag = useRef(false);
  const n = images.length;
  const go = (i: number) => setCurrent((i + n) % n);

  return (
    <div className="flex flex-col gap-2.5 w-full max-w-md ml-auto">
      <div
        className="relative w-full rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 select-none"
        style={{ aspectRatio: "16/9" }}
        onPointerDown={(e) => {
          dragX.current = e.clientX;
          didDrag.current = false;
          (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          if (Math.abs(e.clientX - dragX.current) > 8) didDrag.current = true;
        }}
        onPointerUp={(e) => {
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
          >
            <Image
              src={images[current]}
              alt={`${title} ${current + 1}`}
              fill
              className="object-cover"
              sizes="40vw"
              draggable={false}
            />
          </motion.div>
        </AnimatePresence>
        {n > 1 && (
          <>
            <button
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => go(current - 1)}
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
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => go(current + 1)}
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

export default function Home() {
  const { t } = useLanguage();
  const isEsLang = t("experience") === "EXPERIENCIA";
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  const projects: Project[] = [
    {
      id: "sgi",
      period: isEsLang ? "MAR 2023 — PRESENTE" : "MAR 2023 — PRESENT",
      title: isEsLang
        ? "Sistema de Gestión Integral (SGI)"
        : "Integral Management System (SGI)",
      subtitle: isEsLang
        ? "Secretaría de Ciencia y Tecnología — UTN"
        : "Sec. of Science & Technology — UTN",
      role: isEsLang ? "Desarrollador Full-Stack" : "Full-Stack Developer",
      description: isEsLang
        ? "Plataforma centralizada que gestiona el 100% de los investigadores, proyectos de I+D y grupos de investigación de la Facultad Regional. Incluye módulos de gestión de becas, diseño del modelo de datos (DER), pantallas UI y control total de versiones vía Git/GitHub."
        : "Centralized platform managing 100% of the Faculty's researchers, R&D projects and grants. Includes scholarship management, data model design (ERD), UI screens, and full version control via Git/GitHub.",
      bullets: isEsLang
        ? [
            "Node.js, Express, Prisma y MySQL para el backend robusto.",
            "Módulos frontend completos con React, TypeScript y Vite.",
            "DER, UI y control de versiones con Git/GitHub.",
          ]
        : [
            "Node.js, Express, Prisma and MySQL for robust backend.",
            "Full frontend modules with React, TypeScript and Vite.",
            "ERD, UI and version control with Git/GitHub.",
          ],
      stack: [
        "Node.js",
        "Express",
        "Prisma",
        "MySQL",
        "React",
        "TypeScript",
        "Vite",
        "Git",
      ],
      github: "https://github.com/tobiasmaciel",
      images: ["/sgi-preview.png", "/sgi-preview-2.png", "/sgi-preview-3.png"],
    },
    {
      id: "tup",
      period: "MAR 2024 — DIC 2024",
      title: isEsLang ? "Sistema Académico TUP" : "TUP Academic System",
      subtitle: isEsLang
        ? "Tecnicatura Universitaria en Programación — UTN"
        : "University Programming Technician — UTN",
      role: isEsLang
        ? "Desarrollador Full-Stack & DevOps"
        : "Full-Stack Developer & DevOps",
      description: isEsLang
        ? "Sistema académico integral conectando bedelías, profesores y alumnos. CI/CD con GitHub Actions: despliegue reducido de 30 min a menos de 5. QA completo, revisión de código y seguimiento en Jira."
        : "Integral academic system connecting admin staff, professors and students. CI/CD with GitHub Actions reducing deployment from 30 to under 5 min. Full QA, code review, Jira tracking.",
      bullets: isEsLang
        ? [
            "Django, React, TypeScript y Vite para el stack completo.",
            "Docker + Docker Compose para infraestructura homogénea.",
            "CI/CD con GitHub Actions: 30 min → menos de 5 min.",
          ]
        : [
            "Django, React, TypeScript and Vite for the full stack.",
            "Docker + Docker Compose for homogeneous infrastructure.",
            "CI/CD with GitHub Actions: 30 min → under 5 min.",
          ],
      stack: [
        "Django",
        "React",
        "TypeScript",
        "Docker",
        "Docker Compose",
        "GitHub Actions",
        "Jira",
      ],
      github: "https://github.com/tobiasmaciel",
      images: ["/tup-preview.png", "/tup-preview-2.png", "/tup-preview-3.png"],
    },
  ];

  const socialLinks = [
    {
      href: "mailto:tobiasmaciel03@gmail.com",
      icon: (
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
    },
    {
      href: "https://linkedin.com/in/tobiasmaciel",
      target: "_blank",
      icon: (
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
    },
    {
      href: "https://github.com/tobiasmaciel",
      target: "_blank",
      icon: (
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
          <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.5a5.5 5.5 0 0 0-1.5-3.8 5.5 5.5 0 0 0 .2-3.8s-1.2-.4-3.9 1.8a13.2 13.2 0 0 0-7 0C6.2 3.4 5 3.8 5 3.8a5.5 5.5 0 0 0 .2 3.8A5.5 5.5 0 0 0 3 11.5c0 5 3 6.2 6 6.5a4.8 4.8 0 0 0-1 3.2v4" />
          <path d="M9 18c-4.5 1.6-5-2.5-5-2.5" />
        </svg>
      ),
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
            TOBÍAS ALEJANDRO
            <br />
            <span className="text-zinc-500">MACIEL MEISTER</span>
          </motion.h1>
          <motion.p
            variants={fadeUpBlur}
            className="font-sans text-xl mt-6 text-zinc-600 dark:text-zinc-400 font-light tracking-wide relative z-10"
          >
            {t("role")}
          </motion.p>
          <motion.nav
            variants={fadeUpText}
            className="mt-16 flex flex-col gap-6 font-sans text-xs font-bold tracking-[0.2em] text-zinc-400 dark:text-zinc-500 uppercase relative z-30"
          >
            <NavLink href="#proyectos" label={t("projects")} />
            <NavLink href="#educacion" label={t("studies")} />
            <NavLink href="#habilidades" label={t("skills")} />
            <NavLink href="#logros" label={t("achievements")} />
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
                className="flex items-center justify-center w-11 h-11 bg-zinc-200/80 dark:bg-zinc-900/80 rounded-full hover:bg-zinc-300 dark:hover:bg-zinc-800 transition-colors text-zinc-700 dark:text-zinc-300 backdrop-blur-md"
              >
                {l.icon}
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
            TOBÍAS ALEJANDRO
            <br />
            <span className="text-zinc-500">MACIEL MEISTER</span>
          </motion.h1>
          <motion.p
            variants={fadeUpBlur}
            className="font-sans text-xl mt-4 text-zinc-600 dark:text-zinc-400 font-light tracking-wide relative z-10"
          >
            {t("role")}
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
              <div key={p.id} className="group">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
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
                    <p className="text-zinc-500 leading-relaxed mb-4 text-sm">
                      {p.description}
                    </p>
                    <ul className="text-zinc-500 space-y-1.5 list-none mb-5 text-sm">
                      {p.bullets.map((b, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="text-[#A78BFA] flex-shrink-0">
                            ›
                          </span>
                          {b}
                        </li>
                      ))}
                    </ul>
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {p.stack.map((s) => (
                        <span
                          key={s}
                          className="px-3 py-1 bg-[#A78BFA]/10 text-[#A78BFA] text-xs font-semibold rounded-full border border-[#A78BFA]/20"
                        >
                          {s}
                        </span>
                      ))}
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
                  <MiniCarousel images={p.images} title={p.title} />
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
            <div className="group relative">
              <p className="text-[#A78BFA] text-sm font-semibold tracking-wider mb-2">
                2021 — {isEsLang ? "PRESENTE" : "PRESENT"}
              </p>
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-[#A78BFA] transition-colors mb-1">
                {isEsLang
                  ? "Ingeniería en Sistemas de Información"
                  : "Systems Information Engineering"}
              </h3>
              <h4 className="text-zinc-600 dark:text-zinc-400 mb-2 font-medium text-lg">
                Universidad Tecnológica Nacional (UTN)
              </h4>
              <p className="text-zinc-500 leading-relaxed max-w-3xl">
                {isEsLang
                  ? "5to Año. Formación avanzada en arquitectura de software, análisis de sistemas y gobierno de datos. Participación activa en I+D."
                  : "5th Year. Advanced training in software architecture, systems analysis and data governance. Active R&D participation."}
              </p>
            </div>
            <div className="group relative">
              <p className="text-[#A78BFA] text-sm font-semibold tracking-wider mb-2">
                2021 — 2025
              </p>
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-[#A78BFA] transition-colors mb-1">
                {isEsLang
                  ? "Analista Desarrollador Universitario en Sistemas"
                  : "University Systems Developer Analyst"}
              </h3>
              <h4 className="text-zinc-600 dark:text-zinc-400 font-medium text-lg">
                Universidad Tecnológica Nacional (UTN)
              </h4>
            </div>
            <div className="group relative">
              <p className="text-[#A78BFA] text-sm font-semibold tracking-wider mb-2">
                2014 — 2020
              </p>
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-[#A78BFA] transition-colors mb-1">
                {isEsLang ? "Inglés Intermedio B2" : "Intermediate English B2"}
              </h3>
              <h4 className="text-zinc-600 dark:text-zinc-400 font-medium text-lg">
                Instituto Josefina Contte
              </h4>
            </div>
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
            {[
              {
                label: "Frontend",
                color: "#A78BFA",
                hb: "hover:border-[#A78BFA]/50",
                ht: "hover:text-[#A78BFA]",
                tags: [
                  "React",
                  "React Native",
                  "Next.js",
                  "TypeScript",
                  "JavaScript",
                  "Vite",
                  "HTML",
                  "CSS",
                ],
              },
              {
                label: isEsLang ? "Backend & Datos" : "Backend & Data",
                color: "#34D399",
                hb: "hover:border-emerald-400/50",
                ht: "hover:text-emerald-500",
                tags: [
                  "Python",
                  "Django",
                  "Node.js",
                  "Express",
                  "SQL",
                  "MySQL",
                  "PostgreSQL",
                  "Prisma ORM",
                ],
              },
              {
                label: "DevOps & Cloud",
                color: "#38BDF8",
                hb: "hover:border-sky-400/50",
                ht: "hover:text-sky-400",
                tags: [
                  "Docker",
                  "Docker Compose",
                  "Kubernetes",
                  "GitHub Actions",
                  "AWS",
                  "Azure",
                  "Render",
                  "Supabase",
                  "Grafana",
                  "Prometheus",
                ],
              },
              {
                label: isEsLang
                  ? "Metodologías & Herramientas"
                  : "Methodologies & Tools",
                color: "#E879F9",
                hb: "hover:border-fuchsia-400/50",
                ht: "hover:text-fuchsia-400",
                tags: [
                  "Git",
                  "GitHub",
                  "Postman",
                  "Jira",
                  "VS Code",
                  "Slack",
                  "Teams",
                  "D2",
                  "Mermaid",
                  "Excel",
                  "Word",
                  "PowerPoint",
                ],
              },
            ].map((cat) => (
              <div
                key={cat.label}
                className="group p-6 bg-white dark:bg-[#0C0C0D] border border-zinc-200 dark:border-zinc-800/80 rounded-2xl hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{
                      backgroundColor: cat.color,
                      boxShadow: `0 0 8px ${cat.color}80`,
                    }}
                  />
                  <h3 className="text-sm font-bold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase">
                    {cat.label}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {cat.tags.map((s) => (
                    <span
                      key={s}
                      className={`px-3 py-1.5 bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 text-xs font-medium rounded-full border border-zinc-200 dark:border-zinc-800 ${cat.hb} ${cat.ht} transition-colors cursor-default`}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
            <div className="group p-6 bg-white dark:bg-[#0C0C0D] border border-zinc-200 dark:border-zinc-800/80 rounded-2xl hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300 md:col-span-2">
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
                <div className="flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-900 rounded-full border border-zinc-200 dark:border-zinc-800">
                  <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                    🇦🇷 {isEsLang ? "Español" : "Spanish"}
                  </span>
                  <span className="text-xs text-zinc-400 font-medium">
                    {isEsLang ? "Nativo" : "Native"}
                  </span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-900 rounded-full border border-zinc-200 dark:border-zinc-800">
                  <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                    🇺🇸 {isEsLang ? "Inglés" : "English"}
                  </span>
                  <span className="text-xs text-zinc-400 font-medium">
                    {isEsLang ? "Intermedio B2" : "Intermediate B2"}
                  </span>
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
            <div className="flex items-start gap-5">
              <div className="mt-[8px] h-2 w-2 rounded-full bg-[#A78BFA] shadow-[0_0_12px_rgba(167,139,250,0.8)] flex-shrink-0" />
              <div>
                <p className="text-[#A78BFA] text-xs font-bold tracking-widest mb-1">
                  2025
                </p>
                <h3 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">
                  {isEsLang
                    ? "Finalista Nacional — Certamen CUBESAT"
                    : "National Finalist — CUBESAT Contest"}
                </h3>
                <p className="text-zinc-500 mt-2 max-w-xl leading-relaxed">
                  {isEsLang
                    ? "Diseño y desarrollo de un satélite a escala (CubeSat) para la toma y análisis de datos."
                    : "Design and development of a scale satellite (CubeSat) for data collection and analysis."}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-5">
              <div className="mt-[8px] h-2 w-2 rounded-full bg-[#A78BFA] shadow-[0_0_12px_rgba(167,139,250,0.8)] flex-shrink-0" />
              <div>
                <p className="text-[#A78BFA] text-xs font-bold tracking-widest mb-1">
                  2024
                </p>
                <h3 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">
                  {isEsLang
                    ? "3° Puesto — Rally Latinoamericano de Innovación"
                    : "3rd Place — Latin American Innovation Rally"}
                </h3>
                <p className="text-zinc-500 mt-2 max-w-xl leading-relaxed">
                  {isEsLang
                    ? "Categoría Impacto Social. Solución tecnológica completa desarrollada en 24 horas."
                    : "Social Impact category. Complete technological solution developed in 24 hours."}
                </p>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </main>
  );
}
