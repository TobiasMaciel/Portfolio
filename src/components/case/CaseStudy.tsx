"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  FileText,
  Maximize2,
} from "lucide-react";
import type { ExperienceItem, Project } from "@/types";
import Lightbox from "@/components/Lightbox";
import CompanyLogo from "@/components/ui/CompanyLogo";
import StackList from "@/components/ui/StackList";
import TechIcon from "@/components/ui/TechIcon";
import { GitHubIcon } from "@/components/ui/icons";
import { button } from "@/components/ui/styles";
import { useDialogLayer } from "@/components/ui/useDialogLayer";
import { fileName, isPdf } from "@/components/ui/useSwipe";
import { useBackToClose } from "./useBackToClose";

export type CaseDetail = { type: "project" | "experience"; id: string };

type Doc = { url: string; title: string; subtitle?: string };

const ease = [0.76, 0, 0.24, 1] as const;
const wrap = "mx-auto w-full max-w-6xl px-6 sm:px-10 lg:px-16";

/**
 * Full-screen case study for a project or a role. It slides up over the
 * page with its own scroll, and closes with "Volver", Escape or the
 * browser/phone back button. Projects and roles share one view so moving
 * between them keeps a single history entry.
 */
export default function CaseStudy({
  detail,
  projects,
  experiences,
  isEs,
  onNavigate,
  onClose,
  onOpenDocument,
}: {
  detail: CaseDetail;
  projects: Project[];
  experiences: ExperienceItem[];
  isEs: boolean;
  onNavigate: (detail: CaseDetail) => void;
  onClose: () => void;
  onOpenDocument: (doc: Doc) => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const [lightbox, setLightbox] = useState<{
    images: string[];
    index: number;
  } | null>(null);
  useDialogLayer(onClose, panelRef);
  useBackToClose(onClose);

  const list = detail.type === "project" ? projects : experiences;
  const index = Math.max(
    0,
    list.findIndex((item) => item.id === detail.id),
  );
  const go = (offset: number) =>
    onNavigate({
      type: detail.type,
      id: list[(index + offset + list.length) % list.length].id,
    });

  // New content starts at the top
  useEffect(() => {
    panelRef.current?.scrollTo({ top: 0 });
  }, [detail.type, detail.id]);

  const kind =
    detail.type === "project"
      ? isEs
        ? "Proyecto"
        : "Project"
      : isEs
        ? "Puesto"
        : "Role";
  const position = `${String(index + 1).padStart(2, "0")} / ${String(list.length).padStart(2, "0")}`;

  return (
    <>
      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="custom-scrollbar fixed inset-0 z-[100] overflow-y-auto bg-paper text-ink focus:outline-none"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ duration: 0.75, ease }}
      >
        <div className="sticky top-0 z-20 border-b border-rule bg-paper/80 backdrop-blur-md">
          <div
            className={`${wrap} flex h-16 items-center justify-between gap-4`}
          >
            <button
              type="button"
              onClick={onClose}
              className="group inline-flex items-center gap-2 text-sm font-semibold text-ink transition-colors hover:text-accent cursor-pointer"
            >
              <ArrowLeft
                size={16}
                aria-hidden="true"
                className="transition-transform group-hover:-translate-x-1"
              />
              {isEs ? "Volver" : "Back"}
            </button>
            <p className="text-sm text-muted">
              {kind}{" "}
              <span className="font-semibold tabular-nums text-ink">
                {position}
              </span>
            </p>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label={
                  isEs ? `${kind} anterior` : `Previous ${kind.toLowerCase()}`
                }
                className={`${button.ghost} rounded-full`}
              >
                <ChevronLeft size={18} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label={
                  isEs ? `${kind} siguiente` : `Next ${kind.toLowerCase()}`
                }
                className={`${button.ghost} rounded-full`}
              >
                <ChevronRight size={18} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.article
            key={`${detail.type}-${detail.id}`}
            initial={{ opacity: 0, y: 24 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: {
                duration: 0.5,
                delay: 0.15,
                ease: [0.16, 1, 0.3, 1],
              },
            }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            className="pb-8"
          >
            {detail.type === "project" ? (
              <ProjectCase
                project={projects[index]}
                next={projects[(index + 1) % projects.length]}
                titleId={titleId}
                isEs={isEs}
                onNext={() => go(1)}
                onOpenImages={(images, i) => setLightbox({ images, index: i })}
                onOpenDocument={onOpenDocument}
              />
            ) : (
              <ExperienceCase
                experience={experiences[index]}
                next={experiences[(index + 1) % experiences.length]}
                projects={projects}
                titleId={titleId}
                isEs={isEs}
                onNext={() => go(1)}
                onOpenProject={(id) => onNavigate({ type: "project", id })}
              />
            )}
          </motion.article>
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {lightbox && (
          <Lightbox
            images={lightbox.images}
            startIndex={lightbox.index}
            onClose={() => setLightbox(null)}
            isEs={isEs}
          />
        )}
      </AnimatePresence>
    </>
  );
}

/* ------------------------------------------------------------------ */

// Left edge per position: 2 columns on phones, 4 in a row from md
const factEdge = [
  "",
  "border-l border-line/40 pl-4 md:pl-5",
  "md:border-l md:border-line/40 md:pl-5",
  "border-l border-line/40 pl-4 md:pl-5",
];

const statCols: Record<number, string> = {
  1: "",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
};

function Facts({
  items,
}: {
  items: { label: string; value: React.ReactNode }[];
}) {
  return (
    <dl className="mt-12 grid grid-cols-2 border-t border-line/40 md:grid-cols-4">
      {items.map((f, i) => (
        <div key={f.label} className={`py-5 pr-4 ${factEdge[i] ?? ""}`}>
          <dt className="text-xs font-semibold text-muted">{f.label}</dt>
          <dd className="mt-1.5 text-sm font-semibold leading-snug">
            {f.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-serif text-3xl font-bold tracking-tight md:text-4xl">
      {children}
    </h2>
  );
}

function Points({ items }: { items: string[] }) {
  return (
    <ul className="mt-6 space-y-4">
      {items.map((b, i) => (
        <li
          key={i}
          className="grid grid-cols-[1.25rem_minmax(0,1fr)] gap-3 text-base leading-7 text-ink/85"
        >
          <span
            aria-hidden="true"
            className="mt-[0.8rem] h-[2px] w-3 bg-brand"
          />
          <span>{b}</span>
        </li>
      ))}
    </ul>
  );
}

function NextLink({
  label,
  title,
  onClick,
}: {
  label: string;
  title: string;
  onClick: () => void;
}) {
  return (
    <div className={`${wrap} mt-24`}>
      <button
        type="button"
        onClick={onClick}
        className="group block w-full border-t border-line/40 pt-10 text-left cursor-pointer"
      >
        <span className="text-sm font-semibold text-muted">{label}</span>
        <span className="mt-3 flex items-end justify-between gap-6">
          <span className="font-serif text-4xl font-bold leading-[1.05] tracking-tight transition-colors group-hover:text-accent md:text-6xl">
            {title}
          </span>
          <span className="mb-2 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-line/50 transition-all duration-300 group-hover:border-brand group-hover:bg-brand group-hover:text-on-accent">
            <ArrowRight
              size={22}
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-0.5"
            />
          </span>
        </span>
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function ProjectCase({
  project: p,
  next,
  titleId,
  isEs,
  onNext,
  onOpenImages,
  onOpenDocument,
}: {
  project: Project;
  next: Project;
  titleId: string;
  isEs: boolean;
  onNext: () => void;
  onOpenImages: (images: string[], index: number) => void;
  onOpenDocument: (doc: Doc) => void;
}) {
  const pictures = p.images.filter((img) => !isPdf(img));
  const docs = p.images.filter(isPdf);
  const cover = pictures[0];

  return (
    <>
      <header className={`${wrap} pt-14 md:pt-20`}>
        <p className="text-sm font-semibold text-accent">{p.period}</p>
        <h1
          id={titleId}
          className="mt-4 max-w-[20ch] font-serif text-5xl font-bold leading-[1.02] tracking-tight md:text-7xl"
        >
          {p.title}
        </h1>
        <p className="mt-6 max-w-[60ch] text-lg leading-8 text-muted">
          {p.summary}
        </p>
        <Facts
          items={[
            { label: isEs ? "Rol" : "Role", value: p.role },
            { label: isEs ? "Contexto" : "Context", value: p.subtitle },
            { label: isEs ? "Período" : "Period", value: p.period },
            {
              label: isEs ? "Código" : "Code",
              value: p.github ? (
                <a
                  href={p.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 underline decoration-line/60 underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
                >
                  <GitHubIcon size={14} />
                  GitHub
                </a>
              ) : (
                <span className="text-muted">
                  {isEs ? "Privado" : "Private"}
                </span>
              ),
            },
          ]}
        />
      </header>

      {cover && (
        <div className={`${wrap} mt-4`}>
          <button
            type="button"
            onClick={() => onOpenImages(pictures, 0)}
            aria-label={
              isEs ? "Ampliar imagen principal" : "Enlarge main image"
            }
            className="group relative block aspect-[16/9] w-full overflow-hidden rounded-[2rem] border border-rule bg-surface/70 cursor-zoom-in dark:bg-surface/40"
          >
            <span
              aria-hidden="true"
              className="absolute inset-0 opacity-60 [background-image:radial-gradient(var(--rule)_1px,transparent_1px)] [background-size:20px_20px]"
            />
            <span
              aria-hidden="true"
              className="absolute -bottom-24 left-1/2 h-56 w-2/3 -translate-x-1/2 rounded-full bg-brand/20 blur-3xl"
            />
            <Image
              src={cover}
              alt={p.title}
              fill
              priority
              sizes="(max-width: 1152px) 100vw, 1100px"
              className="object-contain p-6 drop-shadow-[0_24px_40px_rgba(0,0,0,0.3)] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.02] md:p-12"
            />
            <span className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
              <Maximize2 size={12} aria-hidden="true" />
              {isEs ? "Ampliar" : "Enlarge"}
            </span>
          </button>
        </div>
      )}

      <div
        className={`${wrap} mt-20 grid gap-16 lg:grid-cols-[minmax(0,1fr)_18rem]`}
      >
        <div className="space-y-16">
          <section>
            <Heading>
              {isEs ? "Sobre el proyecto" : "About the project"}
            </Heading>
            <p className="mt-6 max-w-[65ch] text-lg leading-8 text-ink/85">
              {p.description}
            </p>
          </section>
          <section>
            <Heading>{isEs ? "Qué hice" : "What I did"}</Heading>
            <Points items={p.bullets} />
          </section>
        </div>

        <aside className="space-y-10 lg:sticky lg:top-24 lg:self-start">
          <section>
            <h2 className="text-sm font-bold">
              {isEs ? "Tecnologías" : "Technologies"}
            </h2>
            <div className="mt-4">
              <StackList items={p.stack} isEs={isEs} tone="neutral" />
            </div>
          </section>
          {(p.github || p.report || p.googleplay) && (
            <section className="flex flex-col gap-3">
              {p.googleplay && (
                <a
                  href={p.googleplay}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={button.primary}
                >
                  <TechIcon name="Google Play" size={16} />
                  {isEs ? "Descargar en Google Play" : "Get it on Google Play"}
                </a>
              )}
              {p.github && (
                <a
                  href={p.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={button.secondary}
                >
                  <GitHubIcon size={16} />
                  {isEs ? "Ver repositorio" : "View repository"}
                </a>
              )}
              {p.report && (
                <button
                  type="button"
                  onClick={() =>
                    onOpenDocument({
                      url: p.report!,
                      title: isEs ? "Informe técnico" : "Technical report",
                      subtitle: p.title,
                    })
                  }
                  className={button.primary}
                >
                  <FileText size={16} aria-hidden="true" />
                  {isEs ? "Leer informe técnico" : "Read technical report"}
                </button>
              )}
            </section>
          )}
        </aside>
      </div>

      {(pictures.length > 1 || docs.length > 0) && (
        <section className={`${wrap} mt-24`}>
          <Heading>{isEs ? "Galería" : "Gallery"}</Heading>
          <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pictures.slice(1).map((img, i) => (
              <li key={img}>
                <button
                  type="button"
                  onClick={() => onOpenImages(pictures, i + 1)}
                  aria-label={`${isEs ? "Ampliar imagen" : "Enlarge image"} ${i + 2}`}
                  className="group relative block aspect-[4/3] w-full overflow-hidden rounded-2xl border border-rule bg-surface/70 transition-colors hover:border-brand/50 cursor-zoom-in dark:bg-surface/40"
                >
                  <Image
                    src={img}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px"
                    className="object-contain p-4 transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                </button>
              </li>
            ))}
            {docs.map((doc) => (
              <li key={doc}>
                <button
                  type="button"
                  onClick={() =>
                    onOpenDocument({
                      url: doc,
                      title: isEs ? "Documento" : "Document",
                      subtitle: p.title,
                    })
                  }
                  className="group flex aspect-[4/3] w-full flex-col items-center justify-center gap-3 rounded-2xl border border-rule bg-surface/70 p-6 text-center transition-colors hover:border-brand/50 cursor-pointer dark:bg-surface/40"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 text-accent">
                    <FileText size={22} aria-hidden="true" />
                  </span>
                  <span className="line-clamp-2 text-sm font-semibold">
                    {fileName(doc)}
                  </span>
                  <span className="text-xs font-semibold text-accent">
                    {isEs ? "Abrir PDF" : "Open PDF"}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <NextLink
        label={isEs ? "Siguiente proyecto" : "Next project"}
        title={next.title}
        onClick={onNext}
      />
    </>
  );
}

/* ------------------------------------------------------------------ */

function ExperienceCase({
  experience: e,
  next,
  projects,
  titleId,
  isEs,
  onNext,
  onOpenProject,
}: {
  experience: ExperienceItem;
  next: ExperienceItem;
  projects: Project[];
  titleId: string;
  isEs: boolean;
  onNext: () => void;
  onOpenProject: (id: string) => void;
}) {
  const related = projects.filter((p) => e.relatedProjectIds?.includes(p.id));

  return (
    <>
      <header className={`${wrap} pt-14 md:pt-20`}>
        {e.logo && (
          <div className="mb-6">
            <CompanyLogo logo={e.logo} name={e.company} size={72} />
          </div>
        )}
        <p className="text-sm font-semibold text-accent">{e.period}</p>
        <h1
          id={titleId}
          className="mt-4 max-w-[20ch] font-serif text-5xl font-bold leading-[1.02] tracking-tight md:text-7xl"
        >
          {e.company}
        </h1>
        <p className="mt-5 text-xl font-semibold text-ink/80">{e.role}</p>
        <Facts
          items={[
            { label: isEs ? "Período" : "Period", value: e.period },
            {
              label: isEs ? "Ubicación" : "Location",
              value: e.location ?? "—",
            },
            {
              label: isEs ? "Tecnologías" : "Technologies",
              value: e.stack.length,
            },
            {
              label: isEs ? "Proyectos" : "Projects",
              value: related.length || "—",
            },
          ]}
        />
      </header>

      {e.highlights && e.highlights.length > 0 && (
        <section className={`${wrap} mt-8`}>
          <dl
            className={`grid grid-cols-1 gap-px overflow-hidden rounded-[2rem] border border-rule bg-rule ${
              statCols[e.highlights.length] ?? "sm:grid-cols-2 lg:grid-cols-4"
            }`}
          >
            {e.highlights.map((h) => (
              <div
                key={h.label}
                className="flex flex-col-reverse justify-end bg-surface/90 p-7 dark:bg-surface"
              >
                <dt className="mt-3 text-sm leading-snug text-muted">
                  {h.label}
                </dt>
                <dd className="font-serif text-3xl font-bold leading-tight tracking-tight text-accent md:text-4xl">
                  {h.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      <div
        className={`${wrap} mt-20 grid gap-16 lg:grid-cols-[minmax(0,1fr)_18rem]`}
      >
        <div className="space-y-16">
          <section>
            <Heading>{isEs ? "Sobre el puesto" : "About the role"}</Heading>
            <p className="mt-6 max-w-[65ch] text-lg leading-8 text-ink/85">
              {e.description || e.summary}
            </p>
          </section>
          <section>
            <Heading>{isEs ? "Responsabilidades" : "Responsibilities"}</Heading>
            <Points items={e.details || e.bullets} />
          </section>
        </div>
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <h2 className="text-sm font-bold">
            {isEs ? "Tecnologías" : "Technologies"}
          </h2>
          <div className="mt-4">
            <StackList items={e.stack} isEs={isEs} tone="neutral" />
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section className={`${wrap} mt-24`}>
          <Heading>
            {isEs ? "Proyectos de este puesto" : "Projects from this role"}
          </Heading>
          <ul className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
            {related.map((p) => {
              const cover = p.images.find((img) => !isPdf(img));
              return (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => onOpenProject(p.id)}
                    className="group flex h-full w-full flex-col overflow-hidden rounded-[1.5rem] border border-rule bg-surface/70 text-left transition-colors hover:border-brand/50 cursor-pointer dark:bg-surface/40"
                  >
                    {cover && (
                      <span className="relative block aspect-[16/9] w-full border-b border-rule bg-paper/60">
                        <Image
                          src={cover}
                          alt=""
                          fill
                          sizes="(max-width: 768px) 100vw, 540px"
                          className="object-contain p-5 transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                      </span>
                    )}
                    <span className="flex flex-1 flex-col p-6">
                      <span className="text-xs font-semibold text-accent">
                        {p.period}
                      </span>
                      <span className="mt-2 font-serif text-2xl font-bold leading-tight transition-colors group-hover:text-accent">
                        {p.title}
                      </span>
                      <span className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">
                        {p.summary}
                      </span>
                      <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-accent">
                        {isEs ? "Ver proyecto" : "View project"}
                        <ArrowRight
                          size={14}
                          aria-hidden="true"
                          className="transition-transform group-hover:translate-x-1"
                        />
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {e.recommendationLetter && (
        <section className={`${wrap} mt-16`}>
          <a
            href={e.recommendationLetter}
            target="_blank"
            rel="noopener noreferrer"
            className={button.secondary}
          >
            <FileText size={16} aria-hidden="true" />
            {isEs ? "Carta de recomendación" : "Recommendation letter"}
          </a>
        </section>
      )}

      <NextLink
        label={isEs ? "Siguiente puesto" : "Next role"}
        title={next.company}
        onClick={onNext}
      />
    </>
  );
}
