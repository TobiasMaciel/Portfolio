"use client";

import { useLanguage } from "@/context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="fixed top-8 right-24 z-50 w-12 h-12 bg-black/5 dark:bg-white/5 rounded-full backdrop-blur-md" />
    );
  }

  return (
    <button
      onClick={() => setLanguage(language === "es" ? "en" : "es")}
      className="fixed top-8 right-24 p-3 rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 backdrop-blur-md transition-all duration-300 z-50 flex items-center justify-center font-bold text-sm w-12 h-12 text-zinc-900 dark:text-zinc-100"
      aria-label="Toggle language"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={language}
          initial={{ y: -20, opacity: 0, scale: 0.5 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 20, opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {language === "es" ? "ES" : "EN"}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
