"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";

interface OrbConfig {
  phaseX: number;
  phaseY: number;
  speedX: number;
  speedY: number;
  radius: number;
  color: {
    dark: string;
    light: string;
  };
}

export default function ContactGlow() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);
  const orb3Ref = useRef<HTMLDivElement>(null);

  const mouse = useRef({ x: -2000, y: -2000 });

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
        speedX: 0.0002, // SLOWER than hero
        speedY: 0.00025,
        radius: 200,
        offsetX: 0,
        offsetY: 0,
        vx: 0,
        vy: 0,
      },
      {
        ref: orb2Ref,
        phaseX: Math.PI / 4,
        phaseY: Math.PI,
        speedX: 0.0003,
        speedY: 0.00015,
        radius: 250,
        offsetX: 0,
        offsetY: 0,
        vx: 0,
        vy: 0,
      },
      {
        ref: orb3Ref,
        phaseX: Math.PI,
        phaseY: Math.PI / 3,
        speedX: 0.00015,
        speedY: 0.00035,
        radius: 175,
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
      let delta = time - lastTime;
      if (delta > 200) delta = 16.66; // Reset if tab was inactive to prevent "physics explosion"
      const dt = delta / 16.66;
      lastTime = time;

      const mx = mouse.current.x;
      const my = mouse.current.y;

      const currentBoundsX = containerRef.current?.clientWidth || boundsX;
      const currentBoundsY = containerRef.current?.clientHeight || boundsY;
      const centerX = currentBoundsX / 2;
      const centerY = currentBoundsY / 2;

      orbs.forEach((orb) => {
        const targetX =
          centerX +
          Math.sin(time * orb.speedX + orb.phaseX) * (currentBoundsX * 0.45);
        const targetY =
          centerY +
          Math.cos(time * orb.speedY + orb.phaseY) * (currentBoundsY * 0.25); // LESS vertical movement

        const currentX = targetX + orb.offsetX;
        const currentY = targetY + orb.offsetY;

        const dx = currentX - mx;
        const dy = currentY - my;
        const dist = Math.sqrt(dx * dx + dy * dy);

        const repelRadius = 300;
        if (dist < repelRadius && dist > 0) {
          const force = (repelRadius - dist) / repelRadius;
          const nx = dx / dist;
          const ny = dy / dist;
          orb.vx += nx * force * 1.5 * dt; // Gentler repulsion
          orb.vy += ny * force * 1.5 * dt;
        }

        orb.vx -= orb.offsetX * 0.005 * dt; // Gentler spring
        orb.vy -= orb.offsetY * 0.005 * dt;

        orb.vx *= 0.95; 
        orb.vy *= 0.95;

        orb.offsetX += orb.vx * dt;
        orb.offsetY += orb.vy * dt;

        let finalX = targetX + orb.offsetX;
        let finalY = targetY + orb.offsetY;

        // Prevent page growth by keeping orbs within reasonable bounds
        // We allow some bleed (100px) so they don't look like they hit a hard wall
        const margin = 100;
        if (finalX < -margin) finalX = -margin;
        if (finalX > currentBoundsX + margin) finalX = currentBoundsX + margin;
        if (finalY < -margin) finalY = -margin;
        if (finalY > currentBoundsY + margin) finalY = currentBoundsY + margin;

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
    >
      {/* Orb 1: Orange/Amber */}
      <div
        ref={orb1Ref}
        className="absolute top-0 left-0 rounded-full transition-opacity duration-1000"
        style={{
          width: 450,
          height: 450,
          background: isDark
            ? "radial-gradient(circle, rgba(245,158,11,0.2) 0%, rgba(245,158,11,0) 70%)"
            : "radial-gradient(circle, rgba(245,158,11,0.6) 0%, rgba(245,158,11,0) 70%)",
          filter: "blur(40px)",
          willChange: "transform",
        }}
      />
      {/* Orb 2: Teal/Emerald */}
      <div
        ref={orb2Ref}
        className="absolute top-0 left-0 rounded-full transition-opacity duration-1000"
        style={{
          width: 500,
          height: 500,
          background: isDark
            ? "radial-gradient(circle, rgba(20,184,166,0.18) 0%, rgba(20,184,166,0) 70%)"
            : "radial-gradient(circle, rgba(20,184,166,0.55) 0%, rgba(20,184,166,0) 70%)",
          filter: "blur(40px)",
          willChange: "transform",
        }}
      />
      {/* Orb 3: Purple/Violet */}
      <div
        ref={orb3Ref}
        className="absolute top-0 left-0 rounded-full transition-opacity duration-1000"
        style={{
          width: 400,
          height: 400,
          background: isDark
            ? "radial-gradient(circle, rgba(139,92,246,0.2) 0%, rgba(139,92,246,0) 70%)"
            : "radial-gradient(circle, rgba(139,92,246,0.6) 0%, rgba(139,92,246,0) 70%)",
          filter: "blur(40px)",
          willChange: "transform",
        }}
      />
    </div>
  );
}
