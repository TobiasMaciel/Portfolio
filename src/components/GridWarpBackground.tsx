"use client";

import { useEffect, useRef } from "react";

export default function GridWarpBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    const gridSpacing = 48;
    const influenceRadius = 140;
    const maxDisplacement = 12; // Maximum distortion amount

    const draw = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      // Check dark mode state from documentElement
      const isDark = document.documentElement.classList.contains("dark");
      
      // Cohesive violet theme stroke style with low opacity
      const strokeColor = isDark
        ? "rgba(167, 139, 250, 0.08)"
        : "rgba(167, 139, 250, 0.15)";
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 1;

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // Draw horizontal lines
      for (let y = 0; y < height + gridSpacing; y += gridSpacing) {
        ctx.beginPath();
        for (let x = 0; x < width + 10; x += 10) {
          let targetX = x;
          let targetY = y;

          const dx = x - mx;
          const dy = y - my;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < influenceRadius) {
            const force = (influenceRadius - dist) / influenceRadius;
            const angle = Math.atan2(dy, dx);
            targetX += Math.cos(angle) * force * maxDisplacement;
            targetY += Math.sin(angle) * force * maxDisplacement;
          }

          if (x === 0) {
            ctx.moveTo(targetX, targetY);
          } else {
            ctx.lineTo(targetX, targetY);
          }
        }
        ctx.stroke();
      }

      // Draw vertical lines
      for (let x = 0; x < width + gridSpacing; x += gridSpacing) {
        ctx.beginPath();
        for (let y = 0; y < height + 10; y += 10) {
          let targetX = x;
          let targetY = y;

          const dx = x - mx;
          const dy = y - my;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < influenceRadius) {
            const force = (influenceRadius - dist) / influenceRadius;
            const angle = Math.atan2(dy, dx);
            targetX += Math.cos(angle) * force * maxDisplacement;
            targetY += Math.sin(angle) * force * maxDisplacement;
          }

          if (y === 0) {
            ctx.moveTo(targetX, targetY);
          } else {
            ctx.lineTo(targetX, targetY);
          }
        }
        ctx.stroke();
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        maskImage: "radial-gradient(circle at 50% 30%, black 20%, transparent 85%)",
        WebkitMaskImage: "radial-gradient(circle at 50% 30%, black 20%, transparent 85%)",
      }}
    />
  );
}
