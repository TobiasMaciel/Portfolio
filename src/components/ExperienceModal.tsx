"use client";

import { ArrowUpRight } from "lucide-react";
import { ExperienceItem, Project } from "@/types";
import Modal, { BulletList, ModalBlock } from "./ui/Modal";
import StackList from "./ui/StackList";
import { button } from "./ui/styles";

export default function ExperienceModal({
  experience,
  projects,
  onClose,
  onViewProject,
  isEs,
}: {
  experience: ExperienceItem;
  projects: Project[];
  onClose: () => void;
  onViewProject: (projectId: string) => void;
  isEs: boolean;
}) {
  const relatedProjects = projects.filter((p) =>
    experience.relatedProjectIds?.includes(p.id),
  );

  return (
    <Modal
      title={experience.company}
      subtitle={experience.role}
      onClose={onClose}
      closeLabel={isEs ? "Cerrar" : "Close"}
      size="md"
    >
      <div className="custom-scrollbar flex-1 space-y-9 overflow-y-auto px-5 py-6 sm:px-8 sm:py-8">
        <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1.5 text-sm">
          <dt className="text-muted">{isEs ? "Período" : "Period"}</dt>
          <dd>{experience.period}</dd>
          {experience.location && (
            <>
              <dt className="text-muted">{isEs ? "Ubicación" : "Location"}</dt>
              <dd>{experience.location}</dd>
            </>
          )}
        </dl>

        {experience.highlights && experience.highlights.length > 0 && (
          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-[repeat(auto-fit,minmax(9rem,1fr))] sm:gap-4">
            {experience.highlights.map((h) => (
              <div
                key={h.label}
                className="group relative flex flex-col-reverse items-center justify-center overflow-hidden rounded-2xl border border-rule bg-paper/60 p-4 text-center transition-colors hover:border-brand/40 sm:p-5"
              >
                <dt className="mt-1 text-[11px] font-semibold leading-snug text-muted">{h.label}</dt>
                <dd className="text-lg font-bold leading-tight tracking-tight transition-colors group-hover:text-accent sm:text-2xl">
                  {h.value}
                </dd>
              </div>
            ))}
          </dl>
        )}

        <ModalBlock title={isEs ? "Sobre el puesto" : "About the role"}>
          <p className="max-w-[68ch] text-sm leading-relaxed text-muted">
            {experience.description || experience.summary}
          </p>
        </ModalBlock>

        <ModalBlock title={isEs ? "Responsabilidades" : "Responsibilities"}>
          <BulletList items={experience.details || experience.bullets} />
        </ModalBlock>

        <ModalBlock title={isEs ? "Tecnologías" : "Technologies"}>
          <StackList items={experience.stack} isEs={isEs} />
        </ModalBlock>

        {relatedProjects.length > 0 && (
          <ModalBlock title={isEs ? "Proyectos de este puesto" : "Projects from this role"}>
            <ul className="flex flex-col gap-4">
              {relatedProjects.map((p) => (
                <li
                  key={p.id}
                  className="flex flex-col gap-4 rounded-2xl border border-rule bg-paper/60 p-5 transition-colors hover:border-brand/40 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:p-6"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-accent">{p.period}</p>
                    <h4 className="mt-1 text-base font-bold sm:text-lg">{p.title}</h4>
                    <p className="mt-1 line-clamp-2 max-w-[60ch] text-sm leading-6 text-muted">
                      {p.summary}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onViewProject(p.id)}
                    className={`${button.primary} shrink-0 rounded-xl px-5 py-3 text-xs`}
                  >
                    {isEs ? "Ver proyecto" : "View project"}
                  </button>
                </li>
              ))}
            </ul>
          </ModalBlock>
        )}

        {experience.recommendationLetter && (
          <ModalBlock title={isEs ? "Carta de recomendación" : "Recommendation letter"}>
            <a
              href={experience.recommendationLetter}
              target="_blank"
              rel="noopener noreferrer"
              className={button.text}
            >
              {isEs ? "Abrir carta" : "Open letter"}
              <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          </ModalBlock>
        )}
      </div>
    </Modal>
  );
}
