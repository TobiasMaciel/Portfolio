"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { ChevronLeft, ChevronRight, FileText, Images } from "lucide-react";
import type { Project } from "@/types";
import RevealText from "@/components/fx/RevealText";
import StackList from "@/components/ui/StackList";
import { GitHubIcon } from "@/components/ui/icons";
import { button } from "@/components/ui/styles";
import { isPdf, useSwipe } from "@/components/ui/useSwipe";
import { ArrowIcon } from "@/components/ui/Section";

const FEATURED_IDS = [
  "datebox",
  "elepad",
  "ai-sales-agent",
  "sgi",
  "tup",
  "cubesat",
];

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    // eslint-disable-next-line
    setMatches(mq.matches);
    const onChange = () => setMatches(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [query]);
  return matches;
}

export default function ProjectsSection({
  projects,
  isEs,
  onOpenProject,
}: {
  projects: Project[];
  isEs: boolean;
  onOpenProject: (project: Project) => void;
}) {
  const [filter, setFilter] = useState<"featured" | "all">("featured");
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const reduceMotion = useReducedMotion();

  const visible =
    filter === "all"
      ? projects
      : FEATURED_IDS.map((id) => projects.find((p) => p.id === id)).filter(
          (p): p is Project => Boolean(p),
        );

  const renderHeader = (counter?: React.ReactNode) => (
    <ProjectsHeader
      isEs={isEs}
      filter={filter}
      onFilter={setFilter}
      counts={{ featured: FEATURED_IDS.length, all: projects.length }}
      counter={counter}
    />
  );

  if (isDesktop && !reduceMotion) {
    return (
      <HorizontalProjects
        key={filter}
        projects={visible}
        isEs={isEs}
        renderHeader={renderHeader}
        onOpenProject={onOpenProject}
      />
    );
  }

  // Phones, tablets and reduced motion: a native swipeable row
  return (
    <section
      id="proyectos"
      aria-labelledby="proyectos-title"
      className="relative scroll-mt-24"
    >
      {renderHeader()}
      <ul className="-mx-6 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-6 sm:-mx-10 sm:px-10">
        {visible.map((p, i) => (
          <li
            key={p.id}
            className="w-[85vw] max-w-[34rem] shrink-0 snap-center"
          >
            <ProjectPanel
              project={p}
              index={i}
              total={visible.length}
              isEs={isEs}
              onOpen={() => onOpenProject(p)}
              stacked
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

function ProjectsHeader({
  isEs,
  filter,
  onFilter,
  counts,
  counter,
}: {
  isEs: boolean;
  filter: "featured" | "all";
  onFilter: (f: "featured" | "all") => void;
  counts: { featured: number; all: number };
  counter?: React.ReactNode;
}) {
  const filters = [
    {
      value: "featured" as const,
      label: isEs ? "Destacados" : "Featured",
      count: counts.featured,
    },
    { value: "all" as const, label: isEs ? "Todos" : "All", count: counts.all },
  ];
  return (
    <header className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
      <div>
        <h2
          id="proyectos-title"
          className="font-serif text-4xl font-bold tracking-tight md:text-5xl"
        >
          <RevealText lines={[isEs ? "Proyectos" : "Projects"]} />
        </h2>
        <p className="mt-2 max-w-[60ch] text-sm font-medium text-muted">
          {isEs
            ? "Productos en producción, investigación y trabajos de la facultad."
            : "Products in production, research and university work."}
        </p>
      </div>
      <div className="flex items-center gap-6">
        {counter}
        <div
          role="group"
          aria-label={isEs ? "Filtrar proyectos" : "Filter projects"}
          className="relative flex w-fit rounded-full border border-rule bg-surface/60 p-1 backdrop-blur-sm"
        >
          {filters.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => onFilter(f.value)}
              aria-pressed={filter === f.value}
              className={`relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition-colors cursor-pointer ${
                filter === f.value
                  ? "text-on-accent"
                  : "text-muted hover:text-ink"
              }`}
            >
              {filter === f.value && (
                <motion.span
                  layoutId="project-filter"
                  className="absolute inset-0 rounded-full bg-accent shadow-lg shadow-brand/30"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                />
              )}
              <span className="relative">{f.label}</span>
              <span className="relative text-xs font-semibold opacity-70">
                {f.count}
              </span>
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}

/**
 * The section pins to the screen and vertical scrolling moves the row of
 * projects sideways. The section is exactly as tall as the sideways
 * distance, so one pixel of scroll moves the row one pixel.
 */
function HorizontalProjects({
  projects,
  isEs,
  renderHeader,
  onOpenProject,
}: {
  projects: Project[];
  isEs: boolean;
  renderHeader: (counter: React.ReactNode) => React.ReactNode;
  onOpenProject: (project: Project) => void;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const [step, setStep] = useState(1);
  const [current, setCurrent] = useState(1);

  useLayoutEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      if (!track) return;
      setDistance(Math.max(0, track.scrollWidth - window.innerWidth));
      const first = track.children[0] as HTMLElement | undefined;
      const second = track.children[1] as HTMLElement | undefined;
      if (first && second) setStep(second.offsetLeft - first.offsetLeft);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [projects.length]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const x = useTransform(scrollYProgress, (v) => -v * distance);
  const hintOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);

  // Where each panel sits in the progress range when it is in focus
  const span = distance > 0 ? step / distance : 1;

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const i = Math.min(projects.length, Math.max(1, Math.round(v / span) + 1));
    setCurrent(i);
  });

  const counter = (
    <p
      className="font-serif text-2xl font-bold tabular-nums"
      aria-live="polite"
    >
      {String(current).padStart(2, "0")}
      <span className="text-muted">
        {" "}
        / {String(projects.length).padStart(2, "0")}
      </span>
    </p>
  );

  return (
    <section
      ref={sectionRef}
      id="proyectos"
      aria-labelledby="proyectos-title"
      className="relative -mx-6 sm:-mx-10 lg:-mx-16 xl:-mx-20"
      style={{ height: `calc(100vh + ${distance}px)` }}
    >
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden pb-10 pt-24">
        <div className="px-16">{renderHeader(counter)}</div>

        <div className="relative flex min-h-0 flex-1 items-center py-6">
          <motion.div
            ref={trackRef}
            className="flex w-max gap-10 pl-16"
            // Right padding lets the last panel travel all the way to the focus spot
            style={{
              x,
              paddingRight: "calc(100vw - min(72vw, 1080px) - 4rem)",
            }}
          >
            {projects.map((p, i) => (
              <FocusPanel
                key={p.id}
                progress={scrollYProgress}
                center={i * span}
                span={span}
              >
                <ProjectPanel
                  project={p}
                  index={i}
                  total={projects.length}
                  isEs={isEs}
                  onOpen={() => onOpenProject(p)}
                  progress={scrollYProgress}
                  center={i * span}
                  span={span}
                />
              </FocusPanel>
            ))}
          </motion.div>
        </div>

        <div className="flex items-center gap-6 px-16">
          <div className="relative h-[2px] flex-1 overflow-hidden rounded-full bg-line/50">
            <motion.span
              className="absolute inset-0 origin-left bg-brand"
              style={{ scaleX: scrollYProgress }}
            />
          </div>
          <motion.p
            className="flex items-center gap-2 text-xs font-semibold text-muted"
            style={{ opacity: hintOpacity }}
          >
            {isEs ? "Scrolleá para recorrer" : "Scroll to explore"}
            <ArrowIcon />
          </motion.p>
        </div>
      </div>
    </section>
  );
}

/** 0 when the panel is in focus, 1 when it is a full panel away or more. */
const focusDistance = (v: number, center: number, span: number) =>
  Math.min(1, Math.abs(v - center) / span);

/** Panels grow to full size and opacity as they reach the focus position. */
function FocusPanel({
  progress,
  center,
  span,
  children,
}: {
  progress: MotionValue<number>;
  center: number;
  span: number;
  children: React.ReactNode;
}) {
  // Function transforms (not keyframe ranges): the ranges of the first and
  // last panel fall outside 0–1, which the browser's scroll timelines reject
  const scale = useTransform(
    progress,
    (v) => 1 - 0.1 * focusDistance(v, center, span),
  );
  const opacity = useTransform(
    progress,
    (v) => 1 - 0.55 * focusDistance(v, center, span),
  );
  return (
    <motion.div
      className="min-h-[min(58vh,520px)] w-[min(72vw,1080px)] shrink-0"
      style={{ scale, opacity }}
    >
      {children}
    </motion.div>
  );
}

function ProjectPanel({
  project: p,
  index,
  total,
  isEs,
  onOpen,
  stacked = false,
  progress,
  center = 0,
  span = 1,
}: {
  project: Project;
  index: number;
  total: number;
  isEs: boolean;
  onOpen: () => void;
  stacked?: boolean;
  progress?: MotionValue<number>;
  center?: number;
  span?: number;
}) {
  const pictures = p.images.filter((img) => !isPdf(img));
  const docs = p.images.filter(isPdf).length;

  return (
    <article
      className={`group relative grid h-full overflow-hidden rounded-[2rem] border border-rule bg-surface/70 backdrop-blur-sm transition-colors duration-500 hover:border-brand/40 dark:bg-surface/40 ${
        stacked ? "grid-rows-[auto_1fr]" : "grid-cols-[1.15fr_1fr]"
      }`}
    >
      <ProjectImage
        pictures={pictures}
        title={p.title}
        stacked={stacked}
        isEs={isEs}
        progress={progress}
        center={center}
        span={span}
      >
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute bottom-3 right-5 z-10 font-serif font-bold leading-none text-transparent [-webkit-text-stroke:1px_var(--muted)] opacity-50 ${
            stacked ? "text-5xl" : "text-7xl"
          }`}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="absolute left-5 top-5 z-10 flex gap-2">
          {p.images.length - docs > 1 && (
            <span className="flex items-center gap-1.5 rounded-full bg-black/45 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-md">
              <Images size={12} aria-hidden="true" />
              {p.images.length - docs}
            </span>
          )}
          {docs > 0 && (
            <span className="flex items-center gap-1.5 rounded-full bg-black/45 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-md">
              <FileText size={12} aria-hidden="true" />
              {isEs ? "Informe" : "Report"}
            </span>
          )}
        </span>
      </ProjectImage>

      <div
        className={`relative flex min-h-0 flex-col ${stacked ? "p-6" : "p-10 xl:p-12"}`}
      >
        <span className="sr-only">
          {index + 1} / {total}
        </span>

        <p className="relative text-xs font-bold tracking-wide text-accent">
          {p.period}
        </p>
        <h3
          className={`relative mt-2 font-serif font-bold leading-[1.1] tracking-tight ${
            stacked
              ? "text-2xl"
              : p.title.length > 38
                ? "text-2xl xl:text-3xl"
                : "text-3xl xl:text-4xl"
          }`}
        >
          {p.title}
        </h3>
        <p className="relative mt-2 text-sm font-semibold text-muted">
          {p.role}
        </p>
        <p className="relative mt-4 max-w-[52ch] text-sm leading-relaxed text-muted">
          {p.summary}
        </p>

        <div className="relative mt-5">
          <StackList items={p.stack} limit={stacked ? 3 : 5} isEs={isEs} />
        </div>

        <div className="relative mt-auto flex flex-wrap items-center gap-3 pt-6">
          <button
            type="button"
            onClick={onOpen}
            className={`${button.primary} group/cta`}
          >
            {isEs ? "Ver proyecto" : "View project"}
            <ArrowIcon />
          </button>
          {p.github && (
            <a
              href={p.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${p.title} ${isEs ? "en" : "on"} GitHub`}
              className="flex h-12 w-12 items-center justify-center rounded-2xl border border-rule text-muted transition-colors hover:border-brand hover:text-accent"
            >
              <GitHubIcon size={18} />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

/** Cover image; in the horizontal row it drifts against the scroll for depth. */
function ProjectImage({
  pictures,
  title,
  stacked,
  isEs,
  progress,
  center,
  span,
  children,
}: {
  pictures: string[];
  title: string;
  stacked: boolean;
  isEs: boolean;
  progress?: MotionValue<number>;
  center: number;
  span: number;
  children: React.ReactNode;
}) {
  const [index, setIndex] = useState(0);
  const n = pictures.length;
  const go = (step: number) => setIndex((i) => (i + step + n) % n);
  const swipe = useSwipe({ onPrev: () => go(-1), onNext: () => go(1) });
  const src = pictures[index];

  const arrow =
    "absolute top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/45 text-white backdrop-blur-md transition-all hover:bg-black/70 focus-visible:opacity-100 sm:opacity-0 sm:group-hover:opacity-100 cursor-pointer";

  return (
    <div
      {...(n > 1 ? swipe : {})}
      className={`relative select-none overflow-hidden bg-paper/70 ${
        stacked ? "aspect-[16/10] border-b border-rule" : "border-r border-rule"
      }`}
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 opacity-60 [background-image:radial-gradient(var(--rule)_1px,transparent_1px)] [background-size:18px_18px]"
      />
      <span
        aria-hidden="true"
        className="absolute -bottom-20 left-1/2 h-48 w-3/4 -translate-x-1/2 rounded-full bg-brand/25 blur-3xl"
      />
      {src ? (
        <Parallax progress={progress} center={center} span={span}>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={src}
              className="absolute inset-0"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <Image
                src={src}
                alt={`${title}, ${isEs ? "imagen" : "image"} ${index + 1}`}
                fill
                sizes={stacked ? "85vw" : "40vw"}
                draggable={false}
                className={`object-contain drop-shadow-[0_24px_40px_rgba(0,0,0,0.35)] ${
                  stacked ? "p-6" : "p-10"
                }`}
              />
            </motion.div>
          </AnimatePresence>
        </Parallax>
      ) : (
        <span className="absolute inset-0 flex items-center justify-center text-accent">
          <FileText size={48} aria-hidden="true" />
        </span>
      )}

      {n > 1 && (
        <>
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label={isEs ? "Imagen anterior" : "Previous image"}
            className={`${arrow} left-4`}
          >
            <ChevronLeft size={18} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label={isEs ? "Imagen siguiente" : "Next image"}
            className={`${arrow} right-4`}
          >
            <ChevronRight size={18} aria-hidden="true" />
          </button>
          <span className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-1.5 rounded-full bg-black/35 px-2.5 py-1.5 backdrop-blur-md">
            {pictures.map((img, i) => (
              <button
                key={img}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`${isEs ? "Ver imagen" : "Show image"} ${i + 1}`}
                aria-current={i === index}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  i === index
                    ? "w-5 bg-white"
                    : "w-1.5 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </span>
        </>
      )}
      {children}
    </div>
  );
}

/** In the horizontal row, the images drift against the scroll for depth. */
function Parallax({
  progress,
  center,
  span,
  children,
}: {
  progress?: MotionValue<number>;
  center: number;
  span: number;
  children: React.ReactNode;
}) {
  const fallback = useMotionValue(center);
  const source = progress ?? fallback;
  const x = useTransform(
    source,
    (v) => -70 * Math.max(-1, Math.min(1, (v - center) / span)),
  );
  const scale = useTransform(
    source,
    (v) => 1 + 0.08 * focusDistance(v, center, span),
  );
  return (
    <motion.div
      className="absolute inset-0"
      style={progress ? { x, scale } : undefined}
    >
      {children}
    </motion.div>
  );
}
