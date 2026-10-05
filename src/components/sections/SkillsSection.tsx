"use client";

import { Briefcase, Rocket } from "lucide-react";
import type { ExperienceItem, Project } from "@/types";
import ScrollIn from "@/components/fx/ScrollIn";
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
                <span
                  aria-hidden="true"
                  className="h-1 w-1 shrink-0 rounded-full bg-brand"
                />
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
              <button
                key={p.id}
                type="button"
                onClick={() => onOpenProject(p)}
                className={link}
              >
                <span
                  aria-hidden="true"
                  className="h-1 w-1 shrink-0 rounded-full bg-emerald-400"
                />
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
    return isEs
      ? `${n} ${n === 1 ? "uso" : "usos"}`
      : `${n} ${n === 1 ? "use" : "uses"}`;
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
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat, ci) => (
          <ScrollIn
            key={cat.label.en}
            // Left column from the left, middle from below, right from the right
            x={[-90, 0, 90][ci % 3]}
            y={ci % 3 === 1 ? 70 : 30}
            className={spanFor(ci, categories.length)}
          >
            <div className={`${card} h-full p-5`}>
              <CornerGlow />
              <div className="relative z-10">
                <h3 className="mb-4 flex items-center gap-3 text-sm font-bold">
                  <span
                    aria-hidden="true"
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{
                      backgroundColor: cat.color,
                      boxShadow: `0 0 8px ${cat.color}80`,
                    }}
                  />
                  {cat.label[language]}
                  <span className="text-xs font-medium text-muted">
                    {cat.tags.length}
                  </span>
                </h3>
                <ul className="flex flex-wrap gap-1.5">
                  {cat.tags.map((skill) => {
                    const icon = getTechIcon(skill);
                    const hex = icon ? `#${icon.hex}` : cat.color;
                    const darkHex =
                      icon && isDarkHex(icon.hex) ? "var(--ink)" : hex;
                    return (
                      <li key={skill}>
                        <Tooltip content={usageTooltip(skill)}>
                          <button
                            type="button"
                            title={usageLabel(skill)}
                            style={
                              {
                                "--tech": hex,
                                "--tech-dark": darkHex,
                              } as React.CSSProperties
                            }
                            className="group/tile inline-flex cursor-default items-center gap-1.5 rounded-full border border-rule bg-paper/50 py-1.5 pl-2 pr-3 text-xs font-semibold text-ink/85 transition-all duration-300 hover:-translate-y-0.5 hover:border-[color:var(--tech)] hover:shadow-[0_8px_22px_-12px_var(--tech)] dark:hover:border-[color:var(--tech-dark)]"
                          >
                            <TechIcon
                              name={skill}
                              size={14}
                              className="text-muted transition-colors duration-300 group-hover/tile:text-[var(--tech)] dark:group-hover/tile:text-[var(--tech-dark)]"
                            />
                            {skill}
                          </button>
                        </Tooltip>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </ScrollIn>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-rule pt-6">
        <span className="mr-2 text-sm font-semibold">
          {isEs ? "Idiomas" : "Languages"}
        </span>
        {languages.map((lang) => (
          <span
            key={lang.name.en}
            className="flex items-center gap-2 rounded-full border border-rule bg-surface/60 px-4 py-2"
          >
            <span className="text-sm font-semibold">
              <span aria-hidden="true">{lang.flag}</span> {lang.name[language]}
            </span>
            <span className="text-xs font-medium text-muted">
              {lang.level[language]}
            </span>
          </span>
        ))}
      </div>
    </Section>
  );
}

/** The last card stretches to fill an incomplete row (2 columns on md, 3 on lg). */
function spanFor(index: number, total: number) {
  if (index !== total - 1) return "";
  const md = total % 2 === 1 ? "md:col-span-2" : "";
  const lg = total % 3 === 2 ? "lg:col-span-2" : total % 3 === 1 ? "lg:col-span-3" : "lg:col-span-1";
  return `${md} ${lg}`;
}
