"use client";

import { useLanguage, type Language } from "@/context/LanguageContext";

const options: { value: Language; label: string; name: string }[] = [
  { value: "es", label: "ES", name: "Español" },
  { value: "en", label: "EN", name: "English" },
];

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div role="group" aria-label="Idioma / Language" className="flex">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          lang={o.value}
          onClick={() => setLanguage(o.value)}
          aria-pressed={language === o.value}
          aria-label={o.name}
          className={`h-9 rounded-full px-2.5 text-xs font-semibold transition-colors cursor-pointer ${
            language === o.value ? "bg-brand/15 text-accent" : "text-muted hover:text-ink"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
