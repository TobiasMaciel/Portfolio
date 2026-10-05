"use client";

import { useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import {
  cvUrl,
  getAchievements,
  getEducation,
  getExperiences,
  getProjects,
} from "@/data/content";
import type { ExperienceItem, Project } from "@/types";
import CaseStudy, { type CaseDetail } from "@/components/case/CaseStudy";
import CursorGlow from "@/components/CursorGlow";
import SmoothScroll from "@/components/fx/SmoothScroll";
import GridWarpBackground from "@/components/GridWarpBackground";
import Loader from "@/components/Loader";
import SectionNav from "@/components/SectionNav";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageToggle from "@/components/LanguageToggle";
import DocumentViewer from "@/components/DocumentViewer";
import Hero from "@/components/sections/Hero";
import ExperienceSection from "@/components/sections/ExperienceSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import EducationSection from "@/components/sections/EducationSection";
import SkillsSection from "@/components/sections/SkillsSection";
import AchievementsSection from "@/components/sections/AchievementsSection";
import ContactSection from "@/components/sections/ContactSection";

type ViewerDoc = { url: string; title: string; subtitle?: string };

export default function Home() {
  const { language, isEs } = useLanguage();

  const projects = useMemo(() => getProjects(language), [language]);
  const experiences = useMemo(() => getExperiences(language), [language]);
  const education = useMemo(() => getEducation(language), [language]);
  const achievements = useMemo(() => getAchievements(language), [language]);

  const [detail, setDetail] = useState<CaseDetail | null>(null);
  const [viewerDoc, setViewerDoc] = useState<ViewerDoc | null>(null);

  const openProject = (p: Project) => setDetail({ type: "project", id: p.id });
  const openExperience = (e: ExperienceItem) => setDetail({ type: "experience", id: e.id });

  const openCV = () =>
    setViewerDoc({
      url: cvUrl(language),
      title: isEs ? "Currículum" : "Résumé",
      subtitle: "Tobías Alejandro Maciel Meister",
    });

  return (
    <div className="relative min-h-screen overflow-x-clip transition-colors duration-700">
      <Loader />
      <SmoothScroll />
      <GridWarpBackground />
      <CursorGlow />

      <div className="fixed right-4 top-4 z-50 flex items-center gap-1 rounded-full border border-rule bg-surface/70 px-1.5 py-1 shadow-lg shadow-black/5 backdrop-blur-md sm:right-8 sm:top-8">
        <LanguageToggle />
        <span aria-hidden="true" className="h-5 w-px bg-line/60" />
        <ThemeToggle isEs={isEs} />
      </div>

      <SectionNav />

      <Hero onOpenCV={openCV} />

      <main className="relative z-10 space-y-32 px-6 pb-40 pt-12 sm:px-10 lg:px-16 lg:pt-0 xl:px-20">
        <ExperienceSection
          experiences={experiences}
          projects={projects}
          isEs={isEs}
          onOpenExperience={openExperience}
          onOpenProject={openProject}
        />
        <ProjectsSection
          projects={projects}
          isEs={isEs}
          onOpenProject={openProject}
        />
        <EducationSection education={education} isEs={isEs} />
        <SkillsSection
          projects={projects}
          experiences={experiences}
          onOpenProject={openProject}
        />
        <AchievementsSection
          achievements={achievements}
          isEs={isEs}
          onOpenDocument={setViewerDoc}
        />
        <ContactSection language={language} onOpenCV={openCV} />
      </main>

      <AnimatePresence>
        {detail && (
          <CaseStudy
            key="case"
            detail={detail}
            projects={projects}
            experiences={experiences}
            isEs={isEs}
            onNavigate={setDetail}
            onClose={() => setDetail(null)}
            onOpenDocument={setViewerDoc}
          />
        )}
        {viewerDoc && (
          <DocumentViewer
            key="viewer"
            url={viewerDoc.url}
            title={viewerDoc.title}
            subtitle={viewerDoc.subtitle}
            onClose={() => setViewerDoc(null)}
            isEs={isEs}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
