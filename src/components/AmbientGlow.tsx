"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";

export default function AmbientGlow() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);
  const orb3Ref = useRef<HTMLDivElement>(null);

  const mouse = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !containerRef.current) return;

    let lastTime = performance.now();
    let animationFrameId: number;

    const boundsX = containerRef.current.clientWidth;
    const boundsY = containerRef.current.clientHeight;

    const orbs = [
      {
        ref: orb1Ref,
        phaseX: 0,
        phaseY: Math.PI / 2,
        speedX: 0.0004,
        speedY: 0.0005,
        radius: 150,
        offsetX: 0,
        offsetY: 0,
        vx: 0,
        vy: 0,
      },
      {
        ref: orb2Ref,
        phaseX: Math.PI / 4,
        phaseY: Math.PI,
        speedX: 0.0006,
        speedY: 0.0003,
        radius: 200,
        offsetX: 0,
        offsetY: 0,
        vx: 0,
        vy: 0,
      },
      {
        ref: orb3Ref,
        phaseX: Math.PI,
        phaseY: Math.PI / 3,
        speedX: 0.0003,
        speedY: 0.0007,
        radius: 125,
        offsetX: 0,
        offsetY: 0,
        vx: 0,
        vy: 0,
      },
    ];

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouse.current.x = e.clientX - rect.left;
      mouse.current.y = e.clientY - rect.top;
    };
    window.addEventListener("mousemove", handleMouseMove);

    const render = (time: number) => {
      const dt = (time - lastTime) / 16.66;
      lastTime = time;

      const mx = mouse.current.x;
      const my = mouse.current.y;

      const currentBoundsX = containerRef.current?.clientWidth || boundsX;
      const currentBoundsY = containerRef.current?.clientHeight || boundsY;
      const centerX = currentBoundsX / 2;
      const centerY = currentBoundsY / 2;

      orbs.forEach((orb) => {
        // 1. Movimiento paramétrico base (Lissajous) - NUNCA SE DETIENE
        const targetX =
          centerX +
          Math.sin(time * orb.speedX + orb.phaseX) * (currentBoundsX * 0.35);
        const targetY =
          centerY +
          Math.cos(time * orb.speedY + orb.phaseY) * (currentBoundsY * 0.35);

        // 2. Fuerzas del Mouse (Repulsión)
        const currentX = targetX + orb.offsetX;
        const currentY = targetY + orb.offsetY;

        const dx = currentX - mx;
        const dy = currentY - my;
        const dist = Math.sqrt(dx * dx + dy * dy);

        const repelRadius = 350;
        if (dist < repelRadius && dist > 0) {
          const force = (repelRadius - dist) / repelRadius;
          const nx = dx / dist;
          const ny = dy / dist;
          orb.vx += nx * force * 5 * dt; // Fuerza agresiva
          orb.vy += ny * force * 5 * dt;
        }

        // 3. Físicas de Resorte (Spring) regresando al offset 0,0
        orb.vx -= orb.offsetX * 0.02 * dt; // Tensión del resorte
        orb.vy -= orb.offsetY * 0.02 * dt;

        orb.vx *= 0.9; // Amortiguamiento (Damping)
        orb.vy *= 0.9;

        orb.offsetX += orb.vx * dt;
        orb.offsetY += orb.vy * dt;

        // Limitar las posiciones finales para que no se salgan catastróficamente
        let finalX = targetX + orb.offsetX;
        let finalY = targetY + orb.offsetY;

        if (finalX < 0) finalX = 0;
        if (finalX > currentBoundsX) finalX = currentBoundsX;
        if (finalY < 0) finalY = 0;
        if (finalY > currentBoundsY) finalY = currentBoundsY;

        if (orb.ref.current) {
          orb.ref.current.style.transform = `translate3d(${finalX - orb.radius}px, ${finalY - orb.radius}px, 0)`;
        }
      });

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
      ref={containerRef}
      className="absolute inset-0 overflow-visible pointer-events-none z-0"
      suppressHydrationWarning
    >
      {/* Luz Esmeralda/Cyan */}
      <div
        ref={orb1Ref}
        className="absolute top-0 left-0 rounded-full transition-opacity duration-700"
        style={{
          width: 300,
          height: 300,
          background: isDark
            ? "radial-gradient(circle, rgba(16,185,129,0.3) 0%, rgba(16,185,129,0) 70%)"
            : "radial-gradient(circle, rgba(16,185,129,0.5) 0%, rgba(16,185,129,0) 70%)",
          filter: "blur(40px)",
          willChange: "transform",
        }}
      />
      {/* Luz Fucsia/Purpura */}
      <div
        ref={orb2Ref}
        className="absolute top-0 left-0 rounded-full transition-opacity duration-700"
        style={{
          width: 400,
          height: 400,
          background: isDark
            ? "radial-gradient(circle, rgba(217,70,239,0.3) 0%, rgba(217,70,239,0) 70%)"
            : "radial-gradient(circle, rgba(217,70,239,0.5) 0%, rgba(217,70,239,0) 70%)",
          filter: "blur(40px)",
          willChange: "transform",
        }}
      />
      {/* Luz Azul */}
      <div
        ref={orb3Ref}
        className="absolute top-0 left-0 rounded-full transition-opacity duration-700"
        style={{
          width: 250,
          height: 250,
          background: isDark
            ? "radial-gradient(circle, rgba(59,130,246,0.3) 0%, rgba(59,130,246,0) 70%)"
            : "radial-gradient(circle, rgba(59,130,246,0.5) 0%, rgba(59,130,246,0) 70%)",
          filter: "blur(40px)",
          willChange: "transform",
        }}
      />
    </div>
  );
}
