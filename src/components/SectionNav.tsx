"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { scrollToId } from "@/components/fx/lenisStore";
import { useLanguage } from "@/context/LanguageContext";

const SECTIONS = [
  { id: "experiencia", key: "experience" },
  { id: "proyectos", key: "projects" },
  { id: "educacion", key: "studies" },
  { id: "habilidades", key: "skills" },
  { id: "logros", key: "achievements" },
  { id: "contacto", key: "contact" },
] as const;

/**
 * Floating section menu. Hidden while the hero is on screen; once the hero
 * scrolls away it slides down from the top, highlights the section being
 * read and jumps to any section on click.
 */
export default function SectionNav() {
  const { t, isEs } = useLanguage();
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Show once the hero has left the screen
  useEffect(() => {
    const hero = document.getElementById("inicio");
    if (!hero) return;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { rootMargin: "-80px 0px 0px 0px" },
    );
    io.observe(hero);
    return () => io.disconnect();
  }, []);

  // Active section: the last one whose top has passed 40% of the screen
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.4;
      let current: string | null = null;
      for (const s of SECTIONS) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= line) current = s.id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  // On phones the menu scrolls sideways: keep the active item in view
  useEffect(() => {
    const list = listRef.current;
    if (!active || !list) return;
    const item = list.querySelector<HTMLElement>(`[data-id="${active}"]`);
    if (!item) return;
    // Scroll only the list, never the page
    list.scrollTo({
      left: item.offsetLeft - list.clientWidth / 2 + item.clientWidth / 2,
      behavior: "smooth",
    });
  }, [active, visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          aria-label={isEs ? "Secciones" : "Sections"}
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 30 }}
          // Phones: from the left edge up to the language/theme controls.
          // Desktop: centred.
          className="fixed left-4 right-[9.5rem] top-4 z-50 sm:right-[11rem] sm:top-8 lg:left-1/2 lg:right-auto lg:-translate-x-1/2"
        >
          <div className="flex w-fit max-w-full items-center rounded-full border border-rule bg-surface/75 p-1 shadow-lg shadow-black/10 backdrop-blur-md">
            <ul
              ref={listRef}
              className="flex min-w-0 items-center gap-0.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {SECTIONS.map((s) => {
                const isActive = active === s.id;
                return (
                  <li key={s.id} data-id={s.id} className="shrink-0">
                    <a
                      href={`#${s.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToId(s.id);
                      }}
                      aria-current={isActive ? "location" : undefined}
                      className={`relative flex h-9 items-center rounded-full px-3.5 text-sm font-semibold transition-colors ${
                        isActive ? "text-accent" : "text-muted hover:text-ink"
                      }`}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="section-nav-active"
                          className="absolute inset-0 rounded-full bg-brand/15"
                          transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        />
                      )}
                      <span className="relative">{t(s.key)}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
