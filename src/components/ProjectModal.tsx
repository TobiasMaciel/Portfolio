"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import { AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  Maximize2,
} from "lucide-react";
import { Project } from "@/types";
import Lightbox from "./Lightbox";
import Modal, { BulletList, ModalBlock } from "./ui/Modal";
import StackList from "./ui/StackList";
import { GitHubIcon } from "./ui/icons";
import { button } from "./ui/styles";
import { useSwipe, isPdf } from "./ui/useSwipe";

export default function ProjectModal({
  project,
  onClose,
  onViewReport,
  isEs,
}: {
  project: Project;
  onClose: () => void;
  onViewReport: (url: string) => void;
  isEs: boolean;
}) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const hasImages = project.images.length > 0;

  return (
    <>
      <Modal
        title={project.title}
        subtitle={project.subtitle}
        onClose={onClose}
        closeLabel={isEs ? "Cerrar" : "Close"}
        size={hasImages ? "xl" : "md"}
      >
        <div
          className={`custom-scrollbar min-h-0 flex-1 overflow-y-auto ${
            hasImages
              ? "md:grid md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:overflow-hidden"
              : ""
          }`}
        >
          {hasImages && (
            <Gallery
              images={project.images}
              title={project.title}
              isEs={isEs}
              onOpen={setLightboxIdx}
              onViewReport={onViewReport}
            />
          )}

          <div className="custom-scrollbar space-y-8 px-5 py-6 sm:px-8 sm:py-8 md:order-1 md:h-full md:overflow-y-auto md:border-r md:border-rule">
            <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1.5 text-sm">
              <dt className="text-muted">{isEs ? "Período" : "Period"}</dt>
              <dd>{project.period}</dd>
              <dt className="text-muted">{isEs ? "Rol" : "Role"}</dt>
              <dd>{project.role}</dd>
            </dl>

            <ModalBlock title={isEs ? "Sobre el proyecto" : "About the project"}>
              <p className="max-w-[68ch] text-sm leading-relaxed text-muted">
                {project.description}
              </p>
            </ModalBlock>

            <ModalBlock title={isEs ? "Qué hice" : "What I built"}>
              <BulletList items={project.bullets} />
            </ModalBlock>

            <ModalBlock title={isEs ? "Tecnologías" : "Technologies"}>
              <StackList items={project.stack} isEs={isEs} />
            </ModalBlock>

            {(project.github || project.report) && (
              <div className="flex flex-wrap gap-3 pt-2">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={button.secondary}
                  >
                    <GitHubIcon size={16} />
                    {isEs ? "Ver repositorio" : "View repository"}
                  </a>
                )}
                {project.report && (
                  <button
                    type="button"
                    onClick={() => onViewReport(project.report!)}
                    className={button.secondary}
                  >
                    <FileText size={16} aria-hidden="true" />
                    {isEs ? "Leer informe técnico" : "Read technical report"}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </Modal>

      <AnimatePresence>
        {lightboxIdx !== null && (
          <Lightbox
            images={project.images}
            startIndex={lightboxIdx}
            onClose={() => setLightboxIdx(null)}
            isEs={isEs}
          />
        )}
      </AnimatePresence>
    </>
  );
}

function Gallery({
  images,
  title,
  isEs,
  onOpen,
  onViewReport,
}: {
  images: string[];
  title: string;
  isEs: boolean;
  onOpen: (idx: number) => void;
  onViewReport: (url: string) => void;
}) {
  const [current, setCurrent] = useState(0);
  const n = images.length;
  const go = useCallback((i: number) => setCurrent((i + n) % n), [n]);
  const src = images[current];
  const swipe = useSwipe({
    onPrev: () => go(current - 1),
    onNext: () => go(current + 1),
    onTap: () => !isPdf(src) && onOpen(current),
  });

  return (
    <div className="flex flex-col gap-3 bg-paper/60 p-4 sm:p-6 md:p-8 md:order-2 md:h-full md:min-h-0">
      <div
        {...swipe}
        className={`relative aspect-[4/3] w-full select-none overflow-hidden rounded-2xl border border-rule bg-surface shadow-inner md:aspect-auto md:min-h-0 md:flex-1 ${
          isPdf(src) ? "" : "cursor-zoom-in"
        }`}
      >
        {isPdf(src) ? (
          <>
            <iframe
              src={`${src}#toolbar=0&navpanes=0&scrollbar=0`}
              className="h-full w-full border-none"
              title={isEs ? "Informe técnico" : "Technical report"}
            />
            <button
              type="button"
              onClick={() => onViewReport(src)}
              className={`${button.secondary} absolute right-3 top-3 px-3 py-2 shadow-sm`}
            >
              <Maximize2 size={14} aria-hidden="true" />
              {isEs ? "Pantalla completa" : "Full screen"}
            </button>
          </>
        ) : (
          <Image
            key={src}
            src={src}
            alt={`${title}, ${isEs ? "imagen" : "image"} ${current + 1}`}
            fill
            className="object-contain p-4"
            sizes="(max-width: 768px) 100vw, 640px"
            draggable={false}
            priority
          />
        )}
      </div>

      <div className="flex items-center justify-between text-chip text-muted">
        <span className="tabular-nums">{n > 1 ? `${current + 1} / ${n}` : ""}</span>
        <span className="flex items-center">
          {n > 1 && (
            <>
              <button
                type="button"
                onClick={() => go(current - 1)}
                aria-label={isEs ? "Imagen anterior" : "Previous image"}
                className={`${button.icon} h-9 w-9`}
              >
                <ChevronLeft size={18} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => go(current + 1)}
                aria-label={isEs ? "Imagen siguiente" : "Next image"}
                className={`${button.icon} h-9 w-9`}
              >
                <ChevronRight size={18} aria-hidden="true" />
              </button>
            </>
          )}
          {!isPdf(src) && (
            <button
              type="button"
              onClick={() => onOpen(current)}
              aria-label={isEs ? "Ampliar imagen" : "Enlarge image"}
              className={`${button.icon} h-9 w-9`}
            >
              <Maximize2 size={15} aria-hidden="true" />
            </button>
          )}
        </span>
      </div>

      {n > 1 && (
        <ul className="flex shrink-0 gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <li key={img} className="shrink-0">
              <button
                type="button"
                onClick={() => setCurrent(i)}
                aria-label={`${isEs ? "Ver imagen" : "Show image"} ${i + 1}`}
                aria-current={i === current}
                className={`relative block h-12 w-[4.5rem] overflow-hidden rounded-lg border-2 bg-surface transition-all cursor-pointer ${
                  i === current
                    ? "border-brand shadow-lg shadow-brand/20"
                    : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                {isPdf(img) ? (
                  <span className="flex h-full w-full items-center justify-center text-accent">
                    <FileText size={18} aria-hidden="true" />
                  </span>
                ) : (
                  <Image src={img} alt="" fill className="object-cover" sizes="72px" />
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
