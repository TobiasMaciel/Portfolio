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
}

export interface Education {
  id: string;
  period: { es: string; en: string };
  title: { es: string; en: string };
  institution: { es: string; en: string };
  description: { es: string; en: string };
}
