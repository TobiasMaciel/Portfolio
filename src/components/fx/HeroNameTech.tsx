"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import TechText from "./TechText";

type Colors = { ink: string; muted: string; brand: string };
type Line = { text: string; muted: boolean };

const LETTER_SPACING = -0.025;
// First letter of each word, relative to the rest
const CAP_SCALE = 1.15;

/** Width of a line where each word's first letter is CAP_SCALE larger. */
function lineWidth(text: string, ctx: CanvasRenderingContext2D, fontSize: number, family: string) {
  const chars = Array.from(text);
  return chars.reduce((total, ch, i) => {
    const cap = !!ch.trim() && (i === 0 || !chars[i - 1].trim());
    const size = cap ? fontSize * CAP_SCALE : fontSize;
    ctx.font = `700 ${size}px ${family}`;
    ctx.letterSpacing = `${LETTER_SPACING * size}px`;
    return total + ctx.measureText(ch).width;
  }, 0);
}

/** Greedy word wrap, as the browser would do for the plain heading. */
function wrap(text: string, maxWidth: number, measure: (t: string) => number) {
  const lines: string[] = [];
  let current = "";
  for (const word of text.split(" ")) {
    const candidate = current ? `${current} ${word}` : word;
    if (current && measure(candidate) > maxWidth) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);
  return lines;
}

/**
 * The hero name with React Bits' Tech Text: hovering a letter turns it into
 * a dashed outline inside a selection frame with its size, and any letter
 * can be dragged off the baseline and springs back. With no pointer, a lens
 * sweeps across the name on its own. Each visual line is its own canvas,
 * wrapped like normal text so the name keeps the heading's font size.
 */
export default function HeroNameTech({
  name,
  surname,
}: {
  name: string;
  surname: string;
}) {
  const boxRef = useRef<HTMLSpanElement>(null);
  const { resolvedTheme } = useTheme();
  const [colors, setColors] = useState<Colors | null>(null);
  const [layout, setLayout] = useState<{
    fontSize: number;
    lines: Line[];
  } | null>(null);

  // Theme colours come from the CSS tokens so they follow light/dark
  useEffect(() => {
    const root = getComputedStyle(document.documentElement);
    const read = (v: string) => root.getPropertyValue(v).trim();
    // eslint-disable-next-line
    setColors({
      ink: read("--ink"),
      muted: read("--muted"),
      brand: read("--brand"),
    });
  }, [resolvedTheme]);

  // Font size and line breaks follow the heading's size and width
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const ctx = document.createElement("canvas").getContext("2d");
    if (!ctx) return;

    const measure = () => {
      const style = getComputedStyle(el);
      const width = el.clientWidth;
      const headingSize = parseFloat(style.fontSize);
      // A single word can't wrap: if the widest one doesn't fit, scale the
      // whole name down so every line keeps the same size
      const widest = Math.max(
        ...`${name} ${surname}`.split(" ").map((w) => lineWidth(w, ctx, headingSize, style.fontFamily)),
      );
      const fontSize = widest > width ? headingSize * (width / widest) : headingSize;
      const measureLine = (t: string) => lineWidth(t, ctx, fontSize, style.fontFamily);
      setLayout({
        fontSize,
        lines: [
          ...wrap(name, width, measureLine).map((text) => ({ text, muted: false })),
          ...wrap(surname, width, measureLine).map((text) => ({ text, muted: true })),
        ],
      });
    };

    measure();
    document.fonts?.ready.then(measure);
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [name, surname]);

  return (
    <span ref={boxRef} className="block">
      <span className="sr-only">
        {name} {surname}
      </span>
      {colors && layout ? (
        // Flex column: negative margins add up instead of collapsing
        <span className="flex flex-col">
          {layout.lines.map((line, i) => (
            // 1.6em tall so accents, descenders and the frame labels fit;
            // negative margins keep the visual line spacing at 1em
            <span
              key={`${i}-${line.text}`}
              aria-hidden="true"
              className="-my-[0.3em] -ml-3 block h-[1.6em]"
            >
              <TechText
                text={line.text}
                align="left"
                fontSize={layout.fontSize}
                fontWeight={700}
                letterSpacing={LETTER_SPACING}
                capScale={CAP_SCALE}
                color={line.muted ? colors.muted : colors.ink}
                accentColor={colors.brand}
                reveal="letter"
                selection
                labels
                draggable
                sweep={i === 0}
                speed={0.8}
                strokeWidth={1.2}
              />
            </span>
          ))}
        </span>
      ) : (
        // Same look before the canvases are ready
        <span aria-hidden="true" className="block">
          {name}
          <br />
          <span className="text-muted">{surname}</span>
        </span>
      )}
    </span>
  );
}
