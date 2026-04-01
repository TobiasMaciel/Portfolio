"use client";

import { useEffect, useRef, useState } from "react";
import { useMotionValue } from "framer-motion";
import { prepareWithSegments, layoutNextLine } from "@chenglou/pretext";

const CV_TEXT = `studiante avanzado de Ingeniería en Sistemas con formación en programación, análisis de datos y tecnologías modernas. Me caracterizo por la capacidad de aprendizaje rápido, la colaboración y la resolución de problemas de gran escala.

"El rendimiento no es un añadido, es la esencia del diseño. Desarrollar sistemas académicos me enseñó que cada milisegundo ahorrado impacta a miles de estudiantes."

Experiencia Destacada
Secr. de Ciencia y Tecnología (2023 - Pres.)
Sistemas de gestión integral que centraliza info de toda la Facultad, abarcando a investigadores y grupos de I+D usando Node.js, Prisma y MySQL. Módulos frontend full con React y Vite.

TUP Gestión Académica (2024)
Desarrollo integral con Django, React y TypeScript. Infraestructura con Docker y pipelines CI/CD que redujeron tiempos de despliegue de 30 a menos de 5 minutos, garantizando calidad con pruebas exhaustivas.

Habilidades Técnicas
Frontend: React, Next.js, TS, Tailwind CSS. Backend: Python, Node.js, Django, SQL. DevOps: Docker, GitHub Actions, AWS.`;

const HEADERS = [
  "Experiencia Destacada",
  "Secr. de Ciencia y Tecnología (2023 - Pres.)",
  "TUP Gestión Académica (2024)",
  "Habilidades Técnicas",
  "Frontend:",
  "Backend:",
  "DevOps:",
];

const headerRanges = HEADERS.map((h) => {
  let start = CV_TEXT.indexOf(h);
  return { start, end: start + h.length };
});

const quoteRanges = [
  {
    start: CV_TEXT.indexOf('"El rendimiento'),
    end: CV_TEXT.indexOf('estudiantes."') + 'estudiantes."'.length,
  },
];

type LineData = {
  text: string;
  x: number;
  y: number;
  width: number;
  isHeader: boolean;
  isQuote: boolean;
};

export default function LayoutAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [lines, setLines] = useState<LineData[]>([]);
  const [containerHeight, setContainerHeight] = useState(800);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    document.fonts.ready.then(() => handleResize());
    setTimeout(() => handleResize(), 500);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  useEffect(() => {
    if (dimensions.width === 0) return;

    let fontFamily = '"Playfair Display", serif';
    const computed = window
      .getComputedStyle(document.documentElement)
      .getPropertyValue("--font-playfair");
    if (computed) fontFamily = computed;

    const fontString = `20px ${fontFamily}`;
    const prepared = prepareWithSegments(CV_TEXT, fontString, {
      whiteSpace: "pre-wrap",
    });
    const lineHeight = 36;

    const radius = 35;

    let animationFrameId: number;

    const render = () => {
      const mx = mouseX.get();
      const my = mouseY.get();

      let cursor = { segmentIndex: 0, graphemeIndex: 0 };
      const newLines: LineData[] = [];

      const startLeft = dimensions.width < 1024 ? 20 : 0;
      const paddingRight = 40;
      const totalWidth = dimensions.width - startLeft - paddingRight;

      const numColumns = dimensions.width < 768 ? 1 : 2;
      const gap = 80;
      const colWidth = (totalWidth - (numColumns - 1) * gap) / numColumns;

      const maxHeight = 650;

      let currentTargetY = 0;
      let colIndex = 0;
      let lineIndexInCol = 0;
      let searchCursor = 0;
      let maxComputedY = 0;

      while (true) {
        if (
          currentTargetY + lineHeight > maxHeight &&
          colIndex < numColumns - 1
        ) {
          currentTargetY = 0;
          colIndex++;
          lineIndexInCol = 0;
        }

        const lineCenterY = currentTargetY + lineHeight / 2;
        const dy = Math.abs(lineCenterY - my);

        let startX = startLeft + colIndex * (colWidth + gap);
        let availableWidth = colWidth;

        let nextCharIndex = searchCursor;
        while (
          nextCharIndex < CV_TEXT.length &&
          /[\s\n]/.test(CV_TEXT[nextCharIndex])
        ) {
          nextCharIndex++;
        }

        let isNextQuote = quoteRanges.some(
          (r) => nextCharIndex >= r.start && nextCharIndex < r.end,
        );
        let isDropCapLine = colIndex === 0 && lineIndexInCol < 3;

        if (isDropCapLine) {
          startX += 95;
          availableWidth -= 95;
        } else if (isNextQuote) {
          availableWidth -= 20;
        }

        if (dy < radius) {
          const sliceWidth = Math.sqrt(radius * radius - dy * dy);
          const circleLeft = mx - sliceWidth;
          const circleRight = mx + sliceWidth;

          const overlapLeft = Math.max(startX, circleLeft);
          const overlapRight = Math.min(startX + availableWidth, circleRight);

          if (overlapLeft < overlapRight) {
            const leftSpace = circleLeft - startX;
            const rightSpace = startX + availableWidth - circleRight;

            if (leftSpace >= rightSpace) {
              availableWidth = leftSpace - 10;
            } else {
              startX = circleRight + 10;
              availableWidth = rightSpace - 10;
            }
          }
        }

        if (availableWidth < 120 && !isDropCapLine) {
          currentTargetY += lineHeight;
          lineIndexInCol++;
          continue;
        }

        if (availableWidth < 60) availableWidth = 60;

        const line = layoutNextLine(prepared, cursor, availableWidth);
        if (line === null) break;

        const text = line.text;

        let isH = false;
        let foundIndex = CV_TEXT.indexOf(text.trim(), searchCursor);
        if (foundIndex !== -1 && text.trim().length > 0) {
          searchCursor = foundIndex + text.trim().length;
          isH =
            headerRanges.some(
              (r) => foundIndex >= r.start && foundIndex < r.end,
            ) ||
            headerRanges.some(
              (r) =>
                foundIndex + text.trim().length > r.start &&
                foundIndex + text.trim().length <= r.end,
            );
        }

        newLines.push({
          text,
          x: startX,
          y: currentTargetY,
          width: line.width,
          isHeader: isH,
          isQuote: isNextQuote,
        });

        cursor = line.end;
        currentTargetY += lineHeight;
        lineIndexInCol++;

        if (currentTargetY > maxComputedY) {
          maxComputedY = currentTargetY;
        }
      }

      setLines(newLines);
      setContainerHeight(maxComputedY + 60);

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [dimensions, mouseX, mouseY]);

  const startLeft = dimensions.width < 1024 ? 20 : 0;

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden"
      style={{ height: containerHeight }}
    >
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none font-playfair text-[20px] leading-9 text-zinc-300 z-10">
        <div
          className="absolute font-playfair font-bold text-[#A78BFA] leading-none pointer-events-auto"
          style={{
            left: startLeft,
            top: 5,
            fontSize: "110px",
            lineHeight: "100px",
          }}
        >
          E
        </div>

        {lines.map((line, i) => {
          if (line.text.trim() === "") return null;

          let color = line.isHeader
            ? "white"
            : line.isQuote
              ? "#A78BFA"
              : "inherit";

          const isHighlight =
            line.text.includes("Frontend:") ||
            line.text.includes("Backend:") ||
            line.text.includes("DevOps:");
          let htmlText: any = line.text;

          if (isHighlight) {
            const splitted = line.text.split(/(Frontend:|Backend:|DevOps:)/);
            htmlText = splitted.map((segment, idx) => {
              if (["Frontend:", "Backend:", "DevOps:"].includes(segment)) {
                return (
                  <span key={idx} className="font-bold text-white">
                    {segment}
                  </span>
                );
              }
              return <span key={idx}>{segment}</span>;
            });
          }

          return (
            <div
              key={i}
              className="absolute pointer-events-auto transition-all duration-75 text-left"
              style={{
                left: line.x,
                top: line.y,
                width: line.width + 10,
                whiteSpace: "nowrap",
                fontWeight: line.isHeader ? 700 : line.isQuote ? 500 : 400,
                fontStyle: line.isQuote ? "italic" : "normal",
                color: color,
                borderLeft: line.isQuote ? "2px solid #A78BFA" : "none",
                paddingLeft: line.isQuote ? "12px" : "0",
              }}
            >
              {htmlText}
            </div>
          );
        })}
      </div>
    </div>
  );
}
