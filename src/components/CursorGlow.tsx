"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";

export default function CursorGlow() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const cursor1Ref = useRef<HTMLDivElement>(null);
  const cursor2Ref = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove);

    let animationFrameId: number;

    const render = (time: number) => {
      const mx = mouse.current.x;
      const my = mouse.current.y;

      if (mx !== -1000) {
        // ─── 1. Organic breathing deformation (always active) ───
        // Slow, independent sin/cos waves on each axis create a living blob feel
        const breathX =
          1 + Math.sin(time * 0.0007) * 0.08 + Math.sin(time * 0.0013) * 0.04;
        const breathY =
          1 + Math.cos(time * 0.0009) * 0.08 + Math.cos(time * 0.0017) * 0.04;

        // ─── 2. Edge squish (only near borders, conservative scale) ───
        let squishX = 1;
        let squishY = 1;

        const w = window.innerWidth;
        const h = window.innerHeight;
        const edgeDist = 160; // start squishing only this close

        if (mx < edgeDist) squishX = 0.55 + (mx / edgeDist) * 0.45;
        if (mx > w - edgeDist) squishX = 0.55 + ((w - mx) / edgeDist) * 0.45;
        if (my < edgeDist) squishY = 0.55 + (my / edgeDist) * 0.45;
        if (my > h - edgeDist) squishY = 0.55 + ((h - my) / edgeDist) * 0.45;

        // Volume preservation but CAPPED at 1.15 so it never bloats too much
        if (squishX < 1 && squishY === 1)
          squishY = Math.min(1.15, 1 + (1 - squishX) * 0.4);
        if (squishY < 1 && squishX === 1)
          squishX = Math.min(1.15, 1 + (1 - squishY) * 0.4);

        // ─── 3. Combine both transforms ───
        const finalScaleX = breathX * squishX;
        const finalScaleY = breathY * squishY;

        const c1r = 225;
        const c2r = 175;

        if (cursor1Ref.current) {
          cursor1Ref.current.style.transform = `translate3d(${mx - c1r}px, ${my - c1r}px, 0) scale3d(${finalScaleX}, ${finalScaleY}, 1)`;
        }
        if (cursor2Ref.current) {
          cursor2Ref.current.style.transform = `translate3d(${mx - c2r}px, ${my - c2r}px, 0) scale3d(${finalScaleX * 0.95}, ${finalScaleY * 0.95}, 1)`;
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [mounted]);

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      suppressHydrationWarning
    >
      {/* Glow secundario (Amarillo/Dorado) */}
      <div
        ref={cursor1Ref}
        className={`absolute top-0 left-0 w-[450px] h-[450px] rounded-full blur-[80px] ${isDark ? "opacity-80" : "opacity-100"}`}
        style={{
          background: isDark
            ? "radial-gradient(circle, rgba(234,179,8,0.45) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(234,179,8,1) 0%, transparent 70%)",
          transformOrigin: "center center",
          willChange: "transform",
        }}
      />
      {/* Glow primario central (Violeta) */}
      <div
        ref={cursor2Ref}
        className={`absolute top-0 left-0 w-[350px] h-[350px] rounded-full blur-[70px] ${isDark ? "opacity-75" : "opacity-100"}`}
        style={{
          background: isDark
            ? "radial-gradient(circle, rgba(139,92,246,0.55) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(139,92,246,1) 0%, transparent 70%)",
          transformOrigin: "center center",
          willChange: "transform",
        }}
      />
    </div>
  );
}
