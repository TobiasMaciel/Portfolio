"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
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

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
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
