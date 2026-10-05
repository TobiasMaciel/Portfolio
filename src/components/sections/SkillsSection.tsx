"use client";

import { Briefcase, Rocket } from "lucide-react";
import type { ExperienceItem, Project } from "@/types";
import Section, { CornerGlow } from "@/components/ui/Section";
import { card } from "@/components/ui/styles";
import Tooltip from "@/components/ui/Tooltip";
import TechIcon from "@/components/ui/TechIcon";
import { getTechIcon, isDarkHex } from "@/components/ui/techIcons";
import { scrollToId } from "@/components/fx/lenisStore";
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

  const usageOf = (skill: string) => ({
    exps: experiences.filter((e) => e.stack.includes(skill)),
    projs: projects.filter((p) => p.stack.includes(skill)),
  });

  const usageTooltip = (skill: string) => {
    const { exps, projs } = usageOf(skill);
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
              <button
                key={e.id}
                type="button"
                onClick={() => scrollToId(`experience-${e.id}`)}
                className={link}
              >
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

  const usageLabel = (skill: string) => {
    const { exps, projs } = usageOf(skill);
    const n = exps.length + projs.length;
    if (n === 0) return isEs ? "Transversal" : "General";
    return isEs ? `${n} ${n === 1 ? "uso" : "usos"}` : `${n} ${n === 1 ? "use" : "uses"}`;
  };

  return (
    <Section
      id="habilidades"
      title={isEs ? "Tecnologías" : "Technologies"}
      intro={
        isEs
          ? "Pasá el cursor sobre una tecnología para ver dónde la usé."
          : "Hover a technology to see where I used it."
      }
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {categories.map((cat, ci) => (
          <div
            key={cat.label.en}
            className={`${card} p-6 ${ci === categories.length - 1 && categories.length % 2 === 1 ? "md:col-span-2" : ""}`}
          >
            <CornerGlow />
            <div className="relative z-10">
              <h3 className="mb-5 flex items-center gap-3 text-sm font-bold">
                <span
                  aria-hidden="true"
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: cat.color, boxShadow: `0 0 8px ${cat.color}80` }}
                />
                {cat.label[language]}
                <span className="text-xs font-medium text-muted">{cat.tags.length}</span>
              </h3>
              <ul className="grid grid-cols-[repeat(auto-fill,minmax(6.25rem,1fr))] gap-2">
                {cat.tags.map((skill) => {
                  const icon = getTechIcon(skill);
                  const hex = icon ? `#${icon.hex}` : cat.color;
                  const darkHex = icon && isDarkHex(icon.hex) ? "var(--ink)" : hex;
                  return (
                    <li key={skill}>
                      <Tooltip content={usageTooltip(skill)} className="flex h-full w-full">
                        <button
                          type="button"
                          title={usageLabel(skill)}
                          style={{ "--tech": hex, "--tech-dark": darkHex } as React.CSSProperties}
                          className="group/tile relative flex h-full w-full cursor-default flex-col items-center gap-2 overflow-hidden rounded-xl border border-rule bg-paper/50 px-2 py-3 text-center transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-[0_10px_30px_-14px_var(--tech)]"
                        >
                          <span
                            aria-hidden="true"
                            className="pointer-events-none absolute -top-8 left-1/2 h-14 w-14 -translate-x-1/2 rounded-full opacity-0 blur-xl transition-opacity duration-500 group-hover/tile:opacity-50"
                            style={{ backgroundColor: hex }}
                          />
                          <TechIcon
                            name={skill}
                            size={22}
                            className="relative text-muted transition-all duration-300 group-hover/tile:scale-110 group-hover/tile:text-[var(--tech)] dark:group-hover/tile:text-[var(--tech-dark)]"
                          />
                          <span className="relative text-[11px] font-semibold leading-tight text-ink/85">
                            {skill}
                          </span>
                        </button>
                      </Tooltip>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 flex flex-wrap items-center gap-3 border-t border-rule pt-8">
        <span className="mr-2 text-sm font-semibold">{isEs ? "Idiomas" : "Languages"}</span>
        {languages.map((lang) => (
          <span
            key={lang.name.en}
            className="flex items-center gap-2 rounded-full border border-rule bg-surface/60 px-4 py-2"
          >
            <span className="text-sm font-semibold">
              <span aria-hidden="true">{lang.flag}</span> {lang.name[language]}
            </span>
            <span className="text-xs font-medium text-muted">{lang.level[language]}</span>
          </span>
        ))}
      </div>
    </Section>
  );
}
