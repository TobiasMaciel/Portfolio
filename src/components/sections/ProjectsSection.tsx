"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Project } from "@/types";
import MiniCarousel from "@/components/MiniCarousel";
import Section, { ArrowIcon } from "@/components/ui/Section";
import StackList from "@/components/ui/StackList";
import { GitHubIcon } from "@/components/ui/icons";
import { button } from "@/components/ui/styles";

const FEATURED_IDS = ["elepad", "sgi", "ai-sales-agent", "cubesat", "tup", "ciencia-de-datos"];

export default function ProjectsSection({
  projects,
  isEs,
  onOpenProject,
  onOpenImages,
}: {
  projects: Project[];
  isEs: boolean;
  onOpenProject: (project: Project) => void;
  onOpenImages: (images: string[], index: number) => void;
}) {
  const [filter, setFilter] = useState<"all" | "featured">("all");

  const visible =
    filter === "all"
      ? projects
      : FEATURED_IDS.map((id) => projects.find((p) => p.id === id)).filter(
          (p): p is Project => Boolean(p),
        );

  const filters = [
    { value: "all" as const, label: isEs ? "Todos" : "All" },
    { value: "featured" as const, label: isEs ? "Destacados" : "Featured" },
  ];

  return (
    <Section
      id="proyectos"
      title={isEs ? "Proyectos" : "Projects"}
      aside={
        <div
          role="group"
          aria-label={isEs ? "Filtrar proyectos" : "Filter projects"}
          className="relative flex w-fit rounded-xl border border-rule bg-surface/60 p-1 backdrop-blur-sm"
        >
          {filters.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFilter(f.value)}
              aria-pressed={filter === f.value}
              className={`relative rounded-lg px-4 py-2 text-sm font-bold transition-colors cursor-pointer ${
                filter === f.value ? "text-accent" : "text-muted hover:text-ink"
              }`}
            >
              {filter === f.value && (
                <motion.span
                  layoutId="project-filter"
                  className="absolute inset-0 rounded-lg bg-surface shadow-sm"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                />
              )}
              <span className="relative">{f.label}</span>
            </button>
          ))}
        </div>
      }
    >
      <AnimatePresence mode="wait">
        <motion.ul
          key={filter}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col gap-20"
        >
          {visible.map((p) => {
            const hasImages = p.images.length > 0;
            return (
              <li
                key={p.id}
                id={`project-${p.id}`}
                className="group relative scroll-mt-24"
              >
                {hasImages && (
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-brand/10 opacity-0 blur-[100px] transition-opacity duration-1000 group-hover:opacity-100"
                  />
                )}
                <div
                  className={`relative grid grid-cols-1 items-start ${
                    hasImages ? "gap-8 md:grid-cols-2 lg:gap-12" : "max-w-4xl"
                  }`}
                >
                  <article className="border-l-2 border-rule pl-6 transition-colors duration-300 group-hover:border-brand">
                    <p className="text-xs font-bold tracking-wide text-accent">{p.period}</p>
                    <div className="mt-1 flex items-start justify-between gap-3">
                      <h3 className="text-2xl font-bold leading-tight">{p.title}</h3>
                      {p.github && (
                        <a
                          href={p.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 flex shrink-0 items-center gap-1.5 text-xs font-semibold text-muted transition-colors hover:text-accent"
                        >
                          <GitHubIcon size={14} />
                          GitHub
                        </a>
                      )}
                    </div>
                    <p className="mt-1 text-sm font-medium text-muted">
                      {p.subtitle} <span className="text-rule">/</span>{" "}
                      <span className="text-accent">{p.role}</span>
                    </p>
                    <p className="mt-3 max-w-[70ch] text-sm leading-relaxed text-muted">
                      {p.summary}
                    </p>
                    <div className="mt-5">
                      <StackList items={p.stack} limit={4} isEs={isEs} />
                    </div>
                    <button
                      type="button"
                      onClick={() => onOpenProject(p)}
                      className={`${button.text} mt-5`}
                    >
                      {isEs ? "Ver detalle" : "View details"}
                      <ArrowIcon />
                    </button>
                  </article>

                  {hasImages && (
                    <div className="w-full self-start md:sticky md:top-28">
                      <MiniCarousel
                        images={p.images}
                        title={p.title}
                        isEs={isEs}
                        onOpen={(idx) => onOpenImages(p.images, idx)}
                      />
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </motion.ul>
      </AnimatePresence>
    </Section>
  );
}
