"use client";

import { useEffect, useRef } from "react";

export default function GridWarpBackground({
  className = "absolute inset-x-0 top-0 pointer-events-none z-0 h-[950px] w-full",
  heightVal = 950,
  maskStyle = "radial-gradient(circle at 50% 30%, black 20%, transparent 85%)",
}: {
  className?: string;
  heightVal?: number;
  maskStyle?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = canvas.offsetHeight || heightVal);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = canvas.offsetHeight || heightVal;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
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
      
      // Cohesive violet theme stroke style with optimized contrast per mode
      const strokeColor = isDark
        ? "rgba(167, 139, 250, 0.08)"
        : "rgba(109, 40, 217, 0.18)";
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
  }, [heightVal]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        maskImage: maskStyle,
        WebkitMaskImage: maskStyle,
      }}
    />
  );
}
