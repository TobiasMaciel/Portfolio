"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { Moon, Sun } from "lucide-react";
import { button } from "./ui/styles";

export default function ThemeToggle({ isEs }: { isEs: boolean }) {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line
    setMounted(true);
  }, []);

  if (!mounted) return <span className="block h-9 w-9" />;

  const isDark = resolvedTheme === "dark";

  // The new theme is revealed as a circle growing out of the button until it
  // covers the screen. Falls back to an instant switch without support for
  // view transitions or when the visitor prefers reduced motion.
  const toggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    const next = isDark ? "light" : "dark";
    const root = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!document.startViewTransition || reduce) {
      setTheme(next);
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

    // Colour transitions would fight the reveal, so they pause meanwhile
    root.classList.add("theme-switching");
    const transition = document.startViewTransition(() => {
      root.classList.toggle("dark", next === "dark");
      root.style.colorScheme = next;
      flushSync(() => setTheme(next));
    });
    transition.ready.then(() => {
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        {
          duration: 750,
          easing: "cubic-bezier(0.65, 0, 0.35, 1)",
          pseudoElement: "::view-transition-new(root)",
        },
      );
    });
    transition.finished.finally(() => root.classList.remove("theme-switching"));
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className={`${button.ghost} h-9 w-9 rounded-full`}
      aria-label={
        isEs
          ? isDark ? "Usar tema claro" : "Usar tema oscuro"
          : isDark ? "Use light theme" : "Use dark theme"
      }
    >
      {isDark ? (
        <Sun size={18} aria-hidden="true" className="text-emerald-400" />
      ) : (
        <Moon size={18} aria-hidden="true" className="text-accent" />
      )}
    </button>
  );
}
