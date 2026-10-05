"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "es" | "en";

export const translations = {
  es: {
    experience: "Experiencia",
    projects: "Proyectos",
    studies: "Educación",
    skills: "Habilidades",
    achievements: "Logros",
    contact: "Contacto",
  },
  en: {
    experience: "Experience",
    projects: "Projects",
    studies: "Education",
    skills: "Skills",
    achievements: "Achievements",
    contact: "Contact",
  },
};

type Translations = typeof translations.es;

interface LanguageContextProps {
  language: Language;
  isEs: boolean;
  setLanguage: (lang: Language) => void;
  t: <K extends keyof Translations>(key: K) => Translations[K];
}

const LanguageContext = createContext<LanguageContextProps | undefined>(
  undefined,
);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("es");

  useEffect(() => {
    const stored = localStorage.getItem("portfolio-lang") as Language | null;
    if (stored === "en" || stored === "es") {
      // eslint-disable-next-line
      setLanguageState(stored);
    } else {
      const isSpanish = navigator.language.toLowerCase().startsWith("es");
      setLanguageState(isSpanish ? "es" : "en");
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("portfolio-lang", lang);
  };

  const t = <K extends keyof Translations>(key: K): Translations[K] =>
    translations[language][key];

  return (
    <LanguageContext.Provider
      value={{ language, isEs: language === "es", setLanguage, t }}
    >
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
