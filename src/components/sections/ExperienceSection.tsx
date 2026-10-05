"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import ScrollIn from "@/components/fx/ScrollIn";
import CompanyLogo from "@/components/ui/CompanyLogo";
import type { ExperienceItem, Project } from "@/types";
import Section, { ArrowIcon } from "@/components/ui/Section";
import StackList from "@/components/ui/StackList";
import { button } from "@/components/ui/styles";

export default function ExperienceSection({
  experiences,
  projects,
  isEs,
  onOpenExperience,
  onOpenProject,
}: {
  experiences: ExperienceItem[];
  projects: Project[];
  isEs: boolean;
  onOpenExperience: (exp: ExperienceItem) => void;
  onOpenProject: (project: Project) => void;
}) {
  const listRef = useRef<HTMLOListElement>(null);
  const reduceMotion = useReducedMotion();
  // The timeline line draws itself downward as the list scrolls through
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start 0.75", "end 0.6"],
  });

  return (
    <Section
      id="experiencia"
      title={isEs ? "Experiencia" : "Experience"}
      intro={
        isEs
          ? "Trayectoria profesional en desarrollo de software, agentes de IA y sistemas escalables."
          : "Professional track record in software engineering, AI agents and scalable systems."
      }
    >
      <ol
        ref={listRef}
        className="relative ml-2 flex flex-col gap-16 sm:ml-4 sm:gap-20"
      >
        <span
          aria-hidden="true"
          className="absolute inset-y-0 -left-px w-0.5 bg-line"
        />
        <motion.span
          aria-hidden="true"
          className="absolute inset-y-0 -left-px w-0.5 origin-top bg-brand"
          style={{ scaleY: reduceMotion ? 1 : scrollYProgress }}
        />
        {experiences.map((exp, index) => {
          const isCurrent = index === 0;
          const related = (exp.relatedProjectIds ?? [])
            .map((id) => projects.find((p) => p.id === id))
            .filter((p): p is Project => Boolean(p));

          return (
            <li
              key={exp.id}
              id={`experience-${exp.id}`}
              className="group relative scroll-mt-24 pl-6 sm:pl-8"
            >
              <span
                aria-hidden="true"
                className={`absolute top-1.5 rounded-full border-2 border-paper transition-colors duration-300 ${
                  isCurrent
                    ? "-left-[9px] h-4 w-4 bg-brand shadow-[0_0_10px_var(--brand)] ring-4 ring-brand/20"
                    : "-left-[8px] h-3.5 w-3.5 bg-line group-hover:bg-brand"
                }`}
              />
              {isCurrent && (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-brand/10 blur-[100px]"
                />
              )}

              <ScrollIn y={-40} className="relative">
                <p className="flex flex-wrap items-center gap-3 text-sm font-semibold text-muted">
                  <span className={isCurrent ? "text-accent" : ""}>
                    {exp.period}
                  </span>
                  {isCurrent && (
                    <span className="rounded-full border border-brand/25 bg-brand/10 px-2.5 py-0.5 text-[11px] font-bold text-accent">
                      {isEs ? "Puesto actual" : "Current role"}
                    </span>
                  )}
                </p>
                <div className="mt-2 flex items-center gap-4">
                  {exp.logo && (
                    <CompanyLogo
                      logo={exp.logo}
                      name={exp.company}
                      size={isCurrent ? 56 : 48}
                    />
                  )}
                  <div className="min-w-0">
                    <h3
                      className={`font-bold leading-tight transition-colors group-hover:text-accent ${
                        isCurrent ? "text-2xl sm:text-3xl" : "text-2xl"
                      }`}
                    >
                      {exp.company}
                    </h3>
                    <p
                      className={`mt-1 text-accent ${
                        isCurrent
                          ? "text-base font-semibold sm:text-lg"
                          : "font-medium"
                      }`}
                    >
                      {exp.role}
                    </p>
                  </div>
                </div>

                <ul className="mt-4 max-w-[75ch] space-y-2.5">
                  {exp.bullets.map((b, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-sm leading-relaxed text-muted"
                    >
                      <span
                        aria-hidden="true"
                        className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full transition-colors ${
                          isCurrent
                            ? "bg-brand"
                            : "bg-line group-hover:bg-brand"
                        }`}
                      />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-5">
                  <StackList
                    items={exp.stack}
                    limit={5}
                    isEs={isEs}
                    tone={isCurrent ? "accent" : "neutral"}
                  />
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-4">
                  <button
                    type="button"
                    onClick={() => onOpenExperience(exp)}
                    className={button.text}
                  >
                    {isEs ? "Ver detalle del puesto" : "View role details"}
                    <ArrowIcon />
                  </button>
                  {related.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => onOpenProject(p)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-rule bg-surface/60 px-3 py-1 text-xs font-semibold text-muted transition-all hover:border-brand/40 hover:text-accent cursor-pointer"
                    >
                      {isEs ? "Proyecto" : "Project"}: {p.title}
                      <ArrowUpRight size={12} aria-hidden="true" />
                    </button>
                  ))}
                </div>
              </ScrollIn>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}
