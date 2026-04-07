"use client";

import { useEffect, useRef, useState } from "react";
import { useMotionValue } from "framer-motion";
import { prepareWithSegments, layoutNextLine } from "@chenglou/pretext";

import { useLanguage } from "@/context/LanguageContext";
import portfolioData from "@/data/portfolio.json";

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
  const { t } = useLanguage();
  const isEsLang = t("experience") === "EXPERIENCIA";

  const aboutData = portfolioData.about;
  const CV_TEXT = isEsLang ? aboutData.cv_text.es : aboutData.cv_text.en;
  const HEADERS: string[] = isEsLang
    ? aboutData.headers.es
    : aboutData.headers.en;
  const QUOTES: string[] = isEsLang ? aboutData.quotes.es : aboutData.quotes.en;
  const HIGHLIGHTS: string[] = isEsLang
    ? aboutData.highlights.es
    : aboutData.highlights.en;

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [lines, setLines] = useState<LineData[]>([]);

  // Smooth mouse: follows real mouse with lag for slow text reflow
  const smoothMouse = useRef({ x: 0, y: 0 });

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

    const isMobile = dimensions.width < 640;
    const fontSize = isMobile ? 17 : 20;
    const lineHeight = isMobile ? 30 : 36;
    const fontString = `${fontSize}px ${fontFamily}`;
    const prepared = prepareWithSegments(CV_TEXT, fontString, {
      whiteSpace: "pre-wrap",
    });

    const radius = 35;

    let animationFrameId: number;

    const render = () => {
      // Lerp the smooth mouse toward the real mouse (0.04 = very slow/laggy)
      const LERP_FACTOR = 0.04;
      smoothMouse.current.x +=
        (mouseX.get() - smoothMouse.current.x) * LERP_FACTOR;
      smoothMouse.current.y +=
        (mouseY.get() - smoothMouse.current.y) * LERP_FACTOR;

      const mx = smoothMouse.current.x;
      const my = smoothMouse.current.y;

      const headerRanges = HEADERS.map((h) => {
        const start = CV_TEXT.indexOf(h);
        return { start, end: start + h.length };
      });

      const quoteRanges: { start: number; end: number }[] = [];
      if (QUOTES.length >= 2) {
        quoteRanges.push({
          start: CV_TEXT.indexOf(QUOTES[0]),
          end: CV_TEXT.indexOf(QUOTES[1]) + QUOTES[1].length,
        });
      }

      let cursor = { segmentIndex: 0, graphemeIndex: 0 };
      const newLines: LineData[] = [];

      const calcStartLeft = dimensions.width < 1024 ? 20 : 0;
      const paddingRight = 40;
      const totalWidth = dimensions.width - calcStartLeft - paddingRight;

      const numColumns = dimensions.width < 768 ? 1 : 2;
      const gap = 80;
      const colWidth = (totalWidth - (numColumns - 1) * gap) / numColumns;

      const maxHeight = 650;

      let currentTargetY = 0;
      let colIndex = 0;
      let lineIndexInCol = 0;
      let searchCursor = 0;

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

        let startX = calcStartLeft + colIndex * (colWidth + gap);
        let availableWidth = colWidth;

        let nextCharIndex = searchCursor;
        while (
          nextCharIndex < CV_TEXT.length &&
          /[\s\n]/.test(CV_TEXT[nextCharIndex])
        ) {
          nextCharIndex++;
        }

        const isNextQuote = quoteRanges.some(
          (r) => nextCharIndex >= r.start && nextCharIndex < r.end,
        );
        const isDropCapLine = colIndex === 0 && lineIndexInCol < 3;

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
        const foundIndex = CV_TEXT.indexOf(text.trim(), searchCursor);
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
      }

      setLines(newLines);

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [dimensions, mouseX, mouseY, CV_TEXT, HEADERS, QUOTES]);

  const startLeft = dimensions.width < 1024 ? 20 : 0;

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden"
      style={{ height: dimensions.width < 640 ? 1000 : 800 }}
      suppressHydrationWarning
    >
      <div 
        className="absolute top-0 left-0 w-full h-full pointer-events-none font-playfair z-10 text-zinc-700 dark:text-zinc-300"
        style={{ 
          fontSize: dimensions.width < 640 ? "17px" : "20px",
          lineHeight: dimensions.width < 640 ? "30px" : "36px"
        }}
      >
        <div
          className="absolute font-playfair font-bold text-[#A78BFA] leading-none pointer-events-auto"
          style={{
            left: startLeft,
            top: 5,
            fontSize: dimensions.width < 640 ? "80px" : "110px",
            lineHeight: dimensions.width < 640 ? "75px" : "100px",
          }}
        >
          A
        </div>

        {lines.map((line, i) => {
          if (line.text.trim() === "") return null;

          let colorClass = "text-inherit";
          if (line.isHeader) {
            colorClass = "text-black dark:text-white";
          } else if (line.isQuote) {
            colorClass = "text-[#A78BFA]";
          }

          const isHighlight = HIGHLIGHTS.some((h) => line.text.includes(h));
          let htmlText: any = line.text;

          if (isHighlight) {
            const regex = new RegExp(`(${HIGHLIGHTS.join("|")})`);
            const splitted = line.text.split(regex);
            htmlText = splitted.map((segment, idx) => {
              if (HIGHLIGHTS.includes(segment)) {
                return (
                  <span
                    key={idx}
                    className="font-bold text-zinc-900 dark:text-white"
                  >
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
              className={`absolute pointer-events-auto text-left ${colorClass}`}
              style={{
                left: line.x,
                top: line.y,
                width: line.width + 10,
                whiteSpace: "nowrap",
                fontWeight: line.isHeader ? 700 : line.isQuote ? 500 : 400,
                fontStyle: line.isQuote ? "italic" : "normal",
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
