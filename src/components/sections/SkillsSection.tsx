"use client";

import { Briefcase, Rocket } from "lucide-react";
import type { ExperienceItem, Project } from "@/types";
import Section, { CornerGlow } from "@/components/ui/Section";
import Tooltip from "@/components/ui/Tooltip";
import { card } from "@/components/ui/styles";
import { useLanguage } from "@/context/LanguageContext";
import portfolioData from "@/data";

export default function SkillsSection({
  projects,
  experiences,
  onOpenProject,
}: {
  projects: Project[];
  experiences: ExperienceItem[];
  onOpenProject: (project: Project) => void;
}) {
  const { isEs, language } = useLanguage();
  const { categories, languages } = portfolioData.skills;

  const scrollToExperience = (id: string) =>
    document
      .getElementById(`experience-${id}`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });

  const usage = (skill: string) => {
    const exps = experiences.filter((e) => e.stack.includes(skill));
    const projs = projects.filter((p) => p.stack.includes(skill));
    if (exps.length === 0 && projs.length === 0) {
      return (
        <span className="opacity-70">
          {isEs ? "Uso general / transversal" : "General / cross-functional"}
        </span>
      );
    }
    const link =
      "flex w-full items-center gap-1.5 truncate text-left text-[11px] transition-colors hover:text-brand cursor-pointer";
    return (
      <span className="flex min-w-[170px] flex-col gap-2.5 py-0.5">
        {exps.length > 0 && (
          <span>
            <span className="mb-1.5 flex items-center gap-1.5 text-[10px] font-bold text-brand">
              <Briefcase size={12} aria-hidden="true" />
              {isEs ? "Experiencia" : "Experience"}
            </span>
            {exps.map((e) => (
              <button key={e.id} type="button" onClick={() => scrollToExperience(e.id)} className={link}>
                <span aria-hidden="true" className="h-1 w-1 shrink-0 rounded-full bg-brand" />
                {e.company}
              </button>
            ))}
          </span>
        )}
        {projs.length > 0 && (
          <span>
            <span className="mb-1.5 flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 dark:text-emerald-600">
              <Rocket size={12} aria-hidden="true" />
              {isEs ? "Proyectos" : "Projects"}
            </span>
            {projs.map((p) => (
              <button key={p.id} type="button" onClick={() => onOpenProject(p)} className={link}>
                <span aria-hidden="true" className="h-1 w-1 shrink-0 rounded-full bg-emerald-400" />
                {p.title}
              </button>
            ))}
          </span>
        )}
      </span>
    );
  };

  return (
    <Section
      id="habilidades"
      title={isEs ? "Habilidades" : "Skills"}
      intro={
        isEs
          ? "Pasá el cursor sobre una tecnología para ver dónde la usé."
          : "Hover a technology to see where I used it."
      }
    >
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {categories.map((cat) => (
          <div key={cat.label.en} className={`${card} p-6`}>
            <CornerGlow />
            <div className="relative z-10">
              <h3 className="mb-5 flex items-center gap-3 text-sm font-bold">
                <span
                  aria-hidden="true"
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: cat.color, boxShadow: `0 0 8px ${cat.color}80` }}
                />
                {cat.label[language]}
              </h3>
              <div className="flex flex-wrap gap-2">
                {cat.tags.map((skill) => (
                  <Tooltip key={skill} content={usage(skill)}>
                    <button
                      type="button"
                      className={`cursor-default rounded-full border border-rule bg-paper/60 px-3 py-1.5 text-xs font-medium text-ink/80 transition-colors ${cat.borderHover} ${cat.textHover}`}
                    >
                      {skill}
                    </button>
                  </Tooltip>
                ))}
              </div>
            </div>
          </div>
        ))}

        <div className={`${card} p-6 md:col-span-2`}>
          <CornerGlow />
          <div className="relative z-10">
            <h3 className="mb-5 flex items-center gap-3 text-sm font-bold">
              <span
                aria-hidden="true"
                className="h-2 w-2 shrink-0 rounded-full bg-amber-400"
                style={{ boxShadow: "0 0 8px rgba(251,191,36,0.8)" }}
              />
              {isEs ? "Idiomas" : "Languages"}
            </h3>
            <ul className="flex flex-wrap gap-3">
              {languages.map((lang) => (
                <li
                  key={lang.name.en}
                  className="flex items-center gap-2 rounded-full border border-rule bg-paper/60 px-4 py-2"
                >
                  <span className="text-sm font-semibold">
                    <span aria-hidden="true">{lang.flag}</span> {lang.name[language]}
                  </span>
                  <span className="text-xs font-medium text-muted">{lang.level[language]}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Section>
  );
}
