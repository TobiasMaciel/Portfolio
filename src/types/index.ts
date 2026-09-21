export interface Project {
  id: string;
  period: string;
  title: string;
  subtitle: string;
  role: string;
  summary: string;
  description: string;
  bullets: string[];
  stack: string[];
  github?: string;
  images: string[];
  report?: string;
}

export interface Education {
  id: string;
  period: { es: string; en: string };
  title: { es: string; en: string };
  institution: { es: string; en: string };
  description: { es: string; en: string };
}

export interface ExperienceHighlight {
  label: string;
  value: string;
}

export interface Experience {
  id: string;
  period: { es: string; en: string };
  company: { es: string; en: string };
  role: { es: string; en: string };
  location?: { es: string; en: string };
  summary?: { es: string; en: string };
  description?: { es: string; en: string };
  bullets: { es: string[]; en: string[] };
  details?: { es: string[]; en: string[] };
  stack: string[];
  recommendationLetter?: string;
  relatedProjectIds?: string[];
  highlights?: { es: ExperienceHighlight[]; en: ExperienceHighlight[] };
}

export interface ExperienceItem {
  id: string;
  period: string;
  company: string;
  role: string;
  location?: string;
  summary?: string;
  description?: string;
  bullets: string[];
  details?: string[];
  stack: string[];
  recommendationLetter?: string;
  relatedProjectIds?: string[];
  highlights?: ExperienceHighlight[];
}
