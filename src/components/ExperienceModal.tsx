"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { ExperienceItem, Project } from "@/types";

export default function ExperienceModal({
  experience,
  projects = [],
  onClose,
  onViewProject,
  isEs,
}: {
  experience: ExperienceItem;
  projects?: Project[];
  onClose: () => void;
  onViewProject?: (projectId: string) => void;
  isEs: boolean;
}) {
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", fn);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", fn);
    };
  }, [onClose]);

  const associatedProjects = projects.filter((p) =>
    experience.relatedProjectIds?.includes(p.id)
  );

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 md:p-8 bg-black/60 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
    >
      <motion.div
        className="relative w-full max-w-4xl max-h-[92vh] bg-white dark:bg-zinc-900 rounded-3xl md:rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl border border-zinc-300 dark:border-zinc-800"
        style={{ contain: "content", willChange: "transform, opacity" }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar — Clean and without icons */}
        <div className="flex items-center justify-between px-6 sm:px-10 py-6 border-b border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 relative z-20">
          <div className="min-w-0 pr-4">
            <h2 className="font-playfair text-xl sm:text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white leading-tight">
              {experience.company}
            </h2>
            <p className="text-xs sm:text-sm font-bold tracking-widest text-[#A78BFA] uppercase mt-1">
              {experience.role} · <span className="text-zinc-500 dark:text-zinc-400">{experience.period}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="group p-2.5 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-2xl transition-all duration-300 text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:scale-110 flex-shrink-0"
            aria-label="Cerrar modal"
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

        {/* Scrollable Body: Pure Editorial Focus (0 fotos) */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-8">
          {/* Metric Highlights — Impact Focused */}
          {experience.highlights && experience.highlights.length > 0 && (
            <div
              className={`grid gap-3 sm:gap-4 ${
                experience.highlights.length === 4
                  ? "grid-cols-2 lg:grid-cols-4"
                  : experience.highlights.length === 2
                  ? "grid-cols-1 sm:grid-cols-2"
                  : "grid-cols-1 sm:grid-cols-3"
              }`}
            >
              {experience.highlights.map((h, i) => (
                <div
                  key={i}
                  className="group relative p-4 sm:p-5 rounded-2xl bg-zinc-50/90 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-700/60 flex flex-col items-center justify-center text-center shadow-sm hover:border-[#A78BFA]/50 hover:shadow-md transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#A78BFA]/60 to-transparent opacity-40 group-hover:opacity-100 transition-opacity" />
                  <span className="text-xl sm:text-2xl md:text-[26px] font-extrabold tracking-tight text-zinc-900 dark:text-white group-hover:text-[#A78BFA] transition-colors leading-tight mb-1.5">
                    {h.value}
                  </span>
                  <span className="text-[11px] sm:text-xs font-semibold text-zinc-500 dark:text-zinc-400 leading-snug">
                    {h.label}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* About Role / Description */}
          <div className="p-6 rounded-2xl bg-zinc-50/70 dark:bg-zinc-800/30 border border-zinc-200/70 dark:border-zinc-800/80">
            <h3 className="text-xs font-bold tracking-[0.2em] text-[#A78BFA] uppercase mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#A78BFA]" />
              <span>{isEs ? "Descripción del Puesto & Contexto" : "Role Description & Context"}</span>
            </h3>
            <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed text-sm sm:text-base">
              {experience.description || experience.summary}
            </p>
          </div>

          {/* Key Responsibilities & Detailed Impact */}
          <div>
            <h3 className="text-xs font-bold tracking-[0.2em] text-[#A78BFA] uppercase mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#A78BFA]" />
              <span>{isEs ? "Detalle del Rol & Responsabilidades" : "Role Details & Responsibilities"}</span>
            </h3>
            <ul className="space-y-3">
              {(experience.details || experience.bullets).map((bullet, i) => (
                <li
                  key={i}
                  className="p-3.5 sm:p-4 rounded-xl bg-zinc-50/40 dark:bg-zinc-800/20 border border-zinc-100 dark:border-zinc-800/60 hover:border-[#A78BFA]/30 transition-colors flex items-start gap-3.5 text-zinc-600 dark:text-zinc-300 text-sm leading-relaxed"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#A78BFA] mt-2 flex-shrink-0 shadow-[0_0_8px_rgba(167,139,250,0.8)]" />
                  <span className="flex-1">{bullet}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tech Stack */}
          <div>
            <h3 className="text-xs font-bold tracking-[0.2em] text-[#A78BFA] uppercase mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#A78BFA]" />
              <span>{isEs ? "Tecnologías y Herramientas" : "Technologies & Tools"}</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {experience.stack.map((tech) => (
                <span
                  key={tech}
                  className="px-3.5 py-1.5 bg-[#A78BFA]/10 text-[#A78BFA] text-xs font-semibold rounded-lg border border-[#A78BFA]/20 tracking-wide"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Proyectos Asociados */}
          {associatedProjects.length > 0 && (
            <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800">
              <h3 className="text-xs font-bold tracking-[0.2em] text-[#A78BFA] uppercase mb-4">
                {isEs ? "Proyectos Asociados a este Rol" : "Associated Projects for this Role"}
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {associatedProjects.map((p) => (
                  <div
                    key={p.id}
                    className="p-5 sm:p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 hover:border-[#A78BFA]/40 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#A78BFA]">
                          {p.period}
                        </span>
                        <span className="text-zinc-400 dark:text-zinc-600">·</span>
                        <span className="text-[10px] font-semibold text-zinc-500">
                          {p.role}
                        </span>
                      </div>
                      <h4 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                        {p.title}
                      </h4>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                        {p.summary}
                      </p>
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {p.stack.slice(0, 5).map((s) => (
                          <span
                            key={s}
                            className="px-2.5 py-0.5 bg-zinc-200/60 dark:bg-zinc-700/60 text-zinc-700 dark:text-zinc-300 text-[10px] font-medium rounded-md"
                          >
                            {s}
                          </span>
                        ))}
                        {p.stack.length > 5 && (
                          <span className="text-[10px] text-zinc-400 self-center">
                            +{p.stack.length - 5}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        onClose();
                        if (onViewProject) {
                          onViewProject(p.id);
                        }
                      }}
                      className="inline-flex items-center gap-2 px-5 py-3 bg-[#A78BFA] hover:bg-[#9061f9] text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-[#A78BFA]/25 active:scale-95 flex-shrink-0 cursor-pointer"
                    >
                      <span>{isEs ? "Ver Proyecto Completo" : "View Full Project"}</span>
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
                        <path d="M5 12h14" />
                        <path d="m12 5 7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Carta de Recomendación (Opcional si en el futuro se adjunta) */}
          {experience.recommendationLetter && (
            <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold tracking-[0.2em] text-[#A78BFA] uppercase">
                  {isEs ? "Carta de Recomendación" : "Recommendation Letter"}
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  {isEs ? "Documento avalado por la institución" : "Official institutional letter"}
                </p>
              </div>
              <a
                href={experience.recommendationLetter}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 text-xs font-bold rounded-xl hover:bg-[#A78BFA] hover:text-white transition-colors"
              >
                <span>{isEs ? "Ver Documento" : "View Document"}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7"/><path d="M7 7h10v10"/></svg>
              </a>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
