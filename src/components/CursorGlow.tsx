"use client";

import { useEffect } from "react";
import { motion, useMotionValue } from "framer-motion";

export default function CursorGlow() {
  // Inicializamos fuera de la pantalla
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // clientX y clientY son relativos al viewport (la pantalla visible)
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    // position: fixed asegura que cubra toda la pantalla independientemente del scroll
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <motion.div
        className="absolute w-[450px] h-[450px] rounded-full opacity-60 blur-[120px] mix-blend-screen"
        style={{
          background:
            "radial-gradient(circle, rgba(234, 179, 8, 0.3) 0%, rgba(0,0,0,0) 70%)",
          x: mouseX,
          y: mouseY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />
      <motion.div
        className="absolute w-[350px] h-[350px] rounded-full opacity-50 blur-[100px] mix-blend-screen"
        style={{
          background:
            "radial-gradient(circle, rgba(139,92,246,0.4) 0%, rgba(0,0,0,0) 70%)",
          x: mouseX,
          y: mouseY,
          translateX: "-30%",
          translateY: "-70%",
        }}
      />
    </div>
  );
}
