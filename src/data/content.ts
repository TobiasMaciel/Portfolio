import type { Language } from "@/context/LanguageContext";
import type {
  AchievementItem,
  EducationItem,
  ExperienceItem,
  Project,
} from "@/types";
import portfolioData from "@/data";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export const withBasePath = (path: string) => `${basePath}${path}`;

/** Sentence case: "desde marzo 2025" → "Desde marzo 2025" */
export const formatPeriod = (period: string) =>
  period.charAt(0).toUpperCase() + period.slice(1);

export function getProjects(lang: Language): Project[] {
  return portfolioData.projects.map((p) => ({
    id: p.id,
    period: formatPeriod(p.period[lang]),
    title: p.title[lang],
    subtitle: p.subtitle[lang],
    role: p.role[lang],
    summary: p.summary[lang],
    description: p.description[lang],
    bullets: p.bullets[lang],
    stack: p.stack ?? [],
    github: p.github,
    googleplay: p.googleplay,
    images: p.images?.map(withBasePath) ?? [],
    report: p.report ? withBasePath(p.report) : undefined,
  }));
}

export function getExperiences(lang: Language): ExperienceItem[] {
  return portfolioData.experience.map((exp) => ({
    id: exp.id,
    period: formatPeriod(exp.period[lang]),
    company: exp.company[lang],
    logo: exp.logo ? { ...exp.logo, src: withBasePath(exp.logo.src) } : undefined,
    role: exp.role[lang],
    location: exp.location?.[lang],
    summary: exp.summary?.[lang],
    description: exp.description?.[lang],
    bullets: exp.bullets[lang],
    details: exp.details?.[lang],
    stack: exp.stack ?? [],
    relatedProjectIds: exp.relatedProjectIds ?? [],
    highlights: exp.highlights?.[lang],
  }));
}

export function getEducation(lang: Language): EducationItem[] {
  return portfolioData.education.map((e) => ({
    id: e.id,
    period: e.period[lang],
    title: e.title[lang],
    institution: e.institution[lang],
    description: e.description?.[lang],
    tags: e.tags?.[lang] ?? [],
  }));
}

export function getAchievements(lang: Language): AchievementItem[] {
  return portfolioData.achievements.map((a) => ({
    id: a.id,
    year: a.year,
    title: a.title[lang],
    description: a.description[lang],
    file: a.file ? withBasePath(a.file) : undefined,
    isAchievement: Boolean(a.isAchievement),
  }));
}

export const cvUrl = (lang: Language) =>
  withBasePath(lang === "es" ? "/CV/CV_Tobias_Maciel_ES.pdf" : "/CV/CV_Tobias_Maciel_EN.pdf");
