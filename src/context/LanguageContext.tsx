"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "es" | "en";

export const translations = {
  es: {
    role: "Analista Desarrollador · Estudiante de Ingeniería en Sistemas",
    studies: "ESTUDIOS",
    experience: "EXPERIENCIA",
    projects: "PROYECTOS",
    achievements: "LOGROS",
    certifications: "CERTIFICACIONES",
    skills: "HABILIDADES",
    cv_text: `studiante avanzado de Ingeniería en Sistemas en la UTN con formación en programación, análisis de datos y tecnologías modernas. Me caracterizo por el aprendizaje rápido, el trabajo colaborativo y la resolución de problemas a gran escala.

"El rendimiento no es un añadido, es la esencia del diseño. Desarrollar sistemas académicos me enseñó que cada milisegundo ahorrado impacta a miles de estudiantes."

Experiencia Destacada
Secr. de Ciencia y Tecnología (Mar 2023 - Pres.)
Desarrollo y mantenimiento del sistema de gestión integral que centraliza la información de la Facultad Regional, abarcando el 100% de investigadores, proyectos e I+D. Stack: Node.js, Express, Prisma, MySQL, React, TypeScript y Vite.

Sistema TUP (Mar 2024 - Dic 2024)
Desarrollo full-stack del sistema académico con Django, React y TypeScript. CI/CD con Docker y GitHub Actions: de 30 min a menos de 5 de despliegue.

Habilidades Técnicas
Frontend: React, Next.js, TS, Vite, HTML, CSS. Backend: Python, Django, Node.js, Express, SQL. DevOps: Docker, Kubernetes, GitHub Actions, AWS.`,
    headers: [
      "Experiencia Destacada",
      "Secr. de Ciencia y Tecnología (Mar 2023 - Pres.)",
      "Sistema TUP (Mar 2024 - Dic 2024)",
      "Habilidades Técnicas",
      "Frontend:",
      "Backend:",
      "DevOps:",
    ],
    highlights: ["Frontend:", "Backend:", "DevOps:"],
    quotes: ['"El rendimiento', 'estudiantes."'],
  },
  en: {
    role: "Systems Developer · Engineering Student",
    studies: "EDUCATION",
    experience: "EXPERIENCE",
    projects: "PROJECTS",
    achievements: "ACHIEVEMENTS",
    certifications: "CERTIFICATIONS",
    skills: "SKILLS",
    cv_text: `dvanced Systems Engineering student at UTN with background in programming, data analysis, and modern tech. Known for rapid learning, collaboration, and large-scale problem solving.

"Performance is not an afterthought — it is the essence of design. Building academic systems taught me that every millisecond saved impacts thousands of students."

Highlighted Experience
Sec. of Science and Technology (Mar 2023 - Present)
Developed and maintained the integral management system centralizing 100% of the Faculty's researchers, R&D projects and grants. Stack: Node.js, Express, Prisma, MySQL, React, TypeScript, Vite.

TUP Academic System (Mar 2024 - Dec 2024)
Full-stack development with Django, React and TypeScript. CI/CD with Docker & GitHub Actions: deployment time cut from 30 min to under 5.

Technical Skills
Frontend: React, Next.js, TS, Vite, HTML, CSS. Backend: Python, Django, Node.js, Express, SQL. DevOps: Docker, Kubernetes, GitHub Actions, AWS.`,
    headers: [
      "Highlighted Experience",
      "Sec. of Science and Technology (Mar 2023 - Present)",
      "TUP Academic System (Mar 2024 - Dec 2024)",
      "Technical Skills",
      "Frontend:",
      "Backend:",
      "DevOps:",
    ],
    highlights: ["Frontend:", "Backend:", "DevOps:"],
    quotes: ['"Performance is', 'students."'],
  },
};

type Translations = typeof translations.es;

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: <K extends keyof Translations>(key: K) => Translations[K];
}

const LanguageContext = createContext<LanguageContextProps | undefined>(
  undefined,
);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("es");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("portfolio-lang") as Language | null;
    if (stored === "en" || stored === "es") {
      setLanguageState(stored);
    } else {
      // Priorizar el idioma del sistema. Si es español, usar 'es'. Para CUALQUIER otro caso (incluido inglés), usar 'en'.
      const isSpanish = navigator.language.toLowerCase().startsWith("es");
      setLanguageState(isSpanish ? "es" : "en");
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("portfolio-lang", lang);
  };

  const t = <K extends keyof Translations>(key: K): Translations[K] => {
    if (!mounted) return translations.es[key];
    return translations[language][key];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context)
    throw new Error("useLanguage must be used within LanguageProvider");
  return context;
}
