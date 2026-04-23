"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LayoutAnimation from "@/components/LayoutAnimation";
import CursorGlow from "@/components/CursorGlow";
import AmbientGlow from "@/components/AmbientGlow";
import ContactGlow from "@/components/ContactGlow";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageToggle from "@/components/LanguageToggle";
import { useLanguage } from "@/context/LanguageContext";
import portfolioData from "@/data/portfolio.json";
import { Project, Education } from "@/types";
import ProjectModal from "@/components/ProjectModal";
import DocumentViewer from "@/components/DocumentViewer";
import MiniCarousel from "@/components/MiniCarousel";
import Lightbox from "@/components/Lightbox";

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.1 },
  },
};
const fadeUpBlur = {
  hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] as const },
  },
};
const fadeUpText = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
  },
};
const sectionScrollEnter = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const NavLink = ({ href, label }: { href: string; label: string }) => (
  <a
    href={href}
    className="hover:text-zinc-900 dark:hover:text-white transition-colors flex items-center gap-4 group w-fit cursor-pointer"
  >
    <span className="h-[2px] w-8 bg-zinc-300 dark:bg-zinc-700 group-hover:w-16 group-hover:bg-[#A78BFA] transition-all duration-300" />
    {label}
  </a>
);

const Tooltip = ({ children, content }: { children: React.ReactNode; content: React.ReactNode }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative flex flex-col items-center group/tt" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute bottom-full mb-3 px-3 py-2 bg-zinc-900 dark:bg-zinc-100 backdrop-blur-md text-white dark:text-zinc-900 text-[10px] font-bold rounded-xl border border-white/10 dark:border-black/10 z-[100] shadow-2xl min-w-[140px] max-w-[280px] text-center leading-relaxed"
          >
            {content}
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px w-2 h-2 border-l border-t border-inherit bg-inherit rotate-[225deg]" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const GitHubIcon = ({ size = 14 }: { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 98 96"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
    />
  </svg>
);



export default function Home() {
  const { t } = useLanguage();
  const isEsLang = t("experience") === "EXPERIENCIA";
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [lightboxInfo, setLightboxInfo] = useState<{
    images: string[];
    index: number;
  } | null>(null);
  const [showCV, setShowCV] = useState(false);
  const [viewerDoc, setViewerDoc] = useState<{ url: string; title: string; subtitle?: string } | null>(null);
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const projects: Project[] = (portfolioData.projects as unknown as any[]).map((p: any) => ({
    id: p.id,
    period: isEsLang ? p.period?.es : p.period?.en,
    title: isEsLang ? p.title?.es : p.title?.en,
    subtitle: isEsLang ? p.subtitle?.es : p.subtitle?.en,
    role: isEsLang ? p.role?.es : p.role?.en,
    summary: isEsLang ? p.summary?.es : p.summary?.en,
    description: isEsLang ? p.description?.es : p.description?.en,
    bullets: isEsLang ? p.bullets?.es : p.bullets?.en,
    stack: p.stack || [],
    github: p.github,
    images: p.images?.map((img: string) => `${basePath}${img}`) || [],
    report: p.report ? `${basePath}${p.report}` : undefined,
  }));

  const education = (portfolioData.education as unknown as Education[]).map((e) => ({
    id: e.id,
    period: isEsLang ? e.period?.es : e.period?.en,
    title: isEsLang ? e.title?.es : e.title?.en,
    institution: isEsLang ? e.institution?.es : e.institution?.en,
    description: isEsLang ? e.description?.es : e.description?.en,
  }));

  const [expandedStacks, setExpandedStacks] = useState<Record<string, boolean>>({});
  const toggleStack = (id: string) => setExpandedStacks(prev => ({ ...prev, [id]: !prev[id] }));

  const socialIcons: Record<string, React.ReactNode> = {
    email: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
    linkedin: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect width="4" height="12" x="2" y="9" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
    phone: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.42 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.5 16z" />
      </svg>
    ),
    github: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 98 96"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
        />
      </svg>
    ),
    cv: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <line x1="10" y1="9" x2="8" y2="9" />
      </svg>
    ),
  };

  const socialLinks = [
    ...portfolioData.socialLinks.map((l) => ({
      platform: l.platform,
      label: l.platform.charAt(0).toUpperCase() + l.platform.slice(1),
      href: l.href,
      target:
        (l as { target?: string }).target ??
        (l.platform === "email" || l.platform === "phone" ? undefined : "_blank"),
      icon: socialIcons[l.platform] || null,
    })),
    {
      platform: "cv",
      label: isEsLang ? "Ver / Descargar CV" : "View / Download CV",
      href: "#",
      target: undefined,
      icon: socialIcons["cv"],
      isCV: true,
    },
  ];

  return (
    <main className="bg-slate-50 dark:bg-[#0A0A0B] text-zinc-900 dark:text-zinc-200 relative min-h-screen overflow-x-hidden selection:bg-[#A78BFA]/30 selection:text-[#A78BFA] transition-colors duration-700">
      <ThemeToggle />
      <LanguageToggle />
      <CursorGlow />

      <AnimatePresence>
        {activeProject && (
          <ProjectModal
            project={activeProject}
            onClose={() => setActiveProject(null)}
            onViewReport={(url) => setViewerDoc({ url, title: isEsLang ? "Informe Técnico" : "Technical Report", subtitle: activeProject.title })}
            isEs={isEsLang}
          />
        )}
      </AnimatePresence>

      {/* HERO */}
      <div className="flex flex-col lg:flex-row justify-between w-full relative z-10 mb-32 lg:mb-40">
        <motion.section
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="hidden lg:flex w-[45%] flex-col pt-[15vh] pl-10 lg:pl-16 xl:pl-20 z-20 relative"
        >
          <AmbientGlow />
          <motion.h1
            variants={fadeUpBlur}
            className="font-playfair text-4xl sm:text-5xl md:text-7xl xl:text-[5.1rem] tracking-tight leading-none text-zinc-900 dark:text-white font-bold w-full drop-shadow-md dark:drop-shadow-lg relative z-10"
          >
            {portfolioData.hero.name}
            <br />
            <span className="text-zinc-500">{portfolioData.hero.surname}</span>
          </motion.h1>
          <motion.p
            variants={fadeUpBlur}
            className="font-sans text-xl mt-6 text-[#A78BFA] font-medium tracking-wide relative z-10"
          >
            {isEsLang ? portfolioData.hero.role.es : portfolioData.hero.role.en}
          </motion.p>
          <motion.nav
            variants={fadeUpText}
            className="mt-16 flex flex-col gap-6 font-sans text-xs font-bold tracking-[0.2em] text-zinc-400 dark:text-zinc-500 uppercase relative z-30"
          >
            <NavLink href="#proyectos" label={t("projects")} />
            <NavLink href="#educacion" label={t("studies")} />
            <NavLink href="#habilidades" label={t("skills")} />
            <NavLink href="#logros" label={t("achievements")} />
            <NavLink
              href="#contacto"
              label={isEsLang ? "CONTACTO" : "CONTACT"}
            />
          </motion.nav>
          <motion.div
            variants={fadeUpText}
            className="flex gap-4 mt-16 relative z-30"
          >
            {socialLinks.map((l, i) => (
              <Tooltip key={i} content={l.label}>
                <a
                  href={l.href}
                  target={(l as { target?: string }).target}
                  onClick={(e) => {
                    if ("isCV" in l && l.isCV) {
                      e.preventDefault();
                      setShowCV(true);
                    }
                  }}
                  className="flex items-center justify-center w-11 h-11 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-black/5 dark:border-white/5 rounded-full transition-all duration-300 text-zinc-700 dark:text-zinc-300 backdrop-blur-md group"
                >
                  <div className="group-hover:scale-110 transition-transform duration-300">
                    {l.icon}
                  </div>
                </a>
              </Tooltip>
            ))}
          </motion.div>
        </motion.section>

        <motion.section
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="lg:hidden w-full px-6 sm:px-10 pt-12 pb-8 z-20 relative"
        >
          <AmbientGlow />
          <motion.h1
            variants={fadeUpBlur}
            className="font-playfair text-6xl tracking-tight leading-none text-zinc-900 dark:text-white font-bold w-full drop-shadow-md relative z-10"
          >
            {portfolioData.hero.name}
            <br />
            <span className="text-zinc-500">{portfolioData.hero.surname}</span>
          </motion.h1>
          <motion.p
            variants={fadeUpBlur}
            className="font-sans text-xl mt-4 text-[#A78BFA] font-medium tracking-wide relative z-10"
          >
            {isEsLang ? portfolioData.hero.role.es : portfolioData.hero.role.en}
          </motion.p>
          <motion.nav
            variants={fadeUpText}
            className="mt-8 flex flex-col gap-4 font-sans text-xs font-bold tracking-[0.2em] text-zinc-500 uppercase relative z-30"
          >
            {(
              ["#proyectos", "#educacion", "#habilidades", "#logros"] as const
            ).map((href, i) => (
              <a
                key={i}
                href={href}
                className="hover:text-zinc-900 dark:hover:text-white transition-colors w-fit"
              >
                {
                  [t("projects"), t("studies"), t("skills"), t("achievements")][
                    i
                  ]
                }
              </a>
            ))}
          </motion.nav>
          <motion.div
            variants={fadeUpText}
            className="flex gap-4 mt-8 relative z-30"
          >
            {socialLinks.map((l, i) => (
              <Tooltip key={i} content={l.label}>
                <a
                  href={l.href}
                  target={(l as { target?: string }).target}
                  onClick={(e) => {
                    if ("isCV" in l && l.isCV) {
                      e.preventDefault();
                      setShowCV(true);
                    }
                  }}
                  className="flex items-center justify-center w-11 h-11 bg-zinc-200/80 dark:bg-zinc-900/80 rounded-full hover:bg-zinc-300 dark:hover:bg-zinc-800 transition-colors text-zinc-700 dark:text-zinc-300 backdrop-blur-md"
                >
                  {l.icon}
                </a>
              </Tooltip>
            ))}
          </motion.div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 1,
            delay: 0.6,
            ease: [0.16, 1, 0.3, 1] as const,
          }}
          className="w-full lg:w-[50%] lg:pr-10 xl:pr-20 relative z-10"
        >
          <div className="w-full flex-1 relative lg:mt-[15vh]">
            <LayoutAnimation />
          </div>
        </motion.section>
      </div>

      {/* SECCIONES */}
      <div className="flex flex-col w-full relative z-10 px-6 sm:px-10 lg:px-16 xl:px-20 space-y-32 pb-40 font-sans">
        {/* PROYECTOS */}
        <motion.section
          id="proyectos"
          className="scroll-mt-24"
          variants={sectionScrollEnter}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
        >
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-10 tracking-tight border-b border-zinc-200 dark:border-zinc-800 pb-5">
            {isEsLang ? "Proyectos" : "Projects"}
          </h2>
          <div className="flex flex-col gap-20">
            {projects.map((p) => (
              <div key={p.id} id={`project-${p.id}`} className="group relative overflow-hidden scroll-mt-24">
                {/* CV-style Corner Glow (Only if has images to balance the layout) */}
                {p.images && p.images.length > 0 && (
                  <div className="absolute -top-32 -right-32 w-80 h-80 bg-[#A78BFA]/5 blur-[100px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                )}
                
                <div className={`relative z-10 grid grid-cols-1 ${p.images && p.images.length > 0 ? "md:grid-cols-2 gap-8 lg:gap-12" : "max-w-4xl"} items-start`}>
                  <div className="relative pl-6 border-l-2 border-zinc-200 dark:border-zinc-800 group-hover:border-[#A78BFA] transition-colors duration-300">
                    <p className="text-[#A78BFA] text-xs font-bold tracking-widest mb-1">
                      {p.period}
                    </p>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
                        {p.title}
                      </h3>
                      {p.github && (
                        <a
                          href={p.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="shrink-0 mt-1 flex items-center gap-1 text-xs font-semibold text-zinc-400 hover:text-[#A78BFA] transition-colors"
                        >
                          <GitHubIcon />
                          GitHub
                        </a>
                      )}
                    </div>
                    <p className="text-zinc-500 font-medium mb-3 text-sm">
                      {p.subtitle} —{" "}
                      <span className="text-[#A78BFA]">{p.role}</span>
                    </p>
                    <p className="text-zinc-500 leading-relaxed mb-5 text-sm">
                      {p.summary}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mb-5 overflow-hidden">
                      {(expandedStacks[p.id] ? p.stack : p.stack.slice(0, 4)).map((s) => (
                        <motion.span
                          key={s}
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.2 }}
                          className="px-3 py-1 bg-[#A78BFA]/10 text-[#A78BFA] text-xs font-semibold rounded-full border border-[#A78BFA]/20"
                        >
                          {s}
                        </motion.span>
                      ))}
                      
                      {p.stack.length > 4 && !expandedStacks[p.id] && (
                        <button
                          onClick={() => toggleStack(p.id)}
                          className="px-3 py-1 text-zinc-400 hover:text-[#A78BFA] hover:border-[#A78BFA]/30 text-xs font-semibold rounded-full border border-zinc-200 dark:border-zinc-800 transition-colors"
                        >
                          +{p.stack.length - 4} {isEsLang ? "más" : "more"}
                        </button>
                      )}

                      {expandedStacks[p.id] && (
                        <button
                          onClick={() => toggleStack(p.id)}
                          className="px-3 py-1 text-[#A78BFA] text-xs font-bold rounded-full border border-[#A78BFA]/20 hover:bg-[#A78BFA]/5 transition-colors"
                        >
                          {isEsLang ? "Ver menos" : "Show less"}
                        </button>
                      )}
                    </div>
                    <button
                      onClick={() => setActiveProject(p)}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-[#A78BFA] group/cta hover:gap-3 transition-all"
                    >
                      <span>{isEsLang ? "Ver detalle" : "View details"}</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="transition-transform group-hover/cta:translate-x-1"
                      >
                        <path d="M5 12h14" />
                        <path d="m12 5 7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                  {p.images && p.images.length > 0 && (
                    <MiniCarousel
                      images={p.images}
                      title={p.title}
                      onClickImage={(idx) =>
                        setLightboxInfo({ images: p.images, index: idx })
                      }
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* EDUCACIÓN */}
        <motion.section
          id="educacion"
          className="scroll-mt-24"
          variants={sectionScrollEnter}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-10 tracking-tight border-b border-zinc-200 dark:border-zinc-800 pb-5">
            {isEsLang ? "Educación" : "Education"}
          </h2>
          <div className="flex flex-col gap-10">
            {education.map((item) => (
              <div key={item.id} className="group relative">
                <p className="text-[#A78BFA] text-sm font-semibold tracking-wider mb-2">
                  {item.period}
                </p>
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-[#A78BFA] transition-colors mb-1">
                  {item.title}
                </h3>
                <h4 className="text-zinc-600 dark:text-zinc-400 mb-2 font-medium text-lg">
                  {item.institution}
                </h4>
                {item.description && (
                  <p className="text-zinc-500 leading-relaxed max-w-3xl">
                    {item.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </motion.section>

        {/* HABILIDADES */}
        <motion.section
          id="habilidades"
          className="scroll-mt-24"
          variants={sectionScrollEnter}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-10 tracking-tight border-b border-zinc-200 dark:border-zinc-800 pb-5">
            {isEsLang ? "Habilidades" : "Skills"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {portfolioData.skills.categories.map((cat) => (
              <div
                key={cat.label.en}
                className="group p-6 bg-white/40 dark:bg-zinc-900/20 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800/80 rounded-[2rem] hover:border-[#A78BFA]/30 transition-all duration-300 relative"
              >
                {/* Contained Corner Glow */}
                <div className="absolute inset-0 overflow-hidden rounded-[2rem] pointer-events-none">
                  <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#A78BFA]/10 blur-[80px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                </div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-5">
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{
                        backgroundColor: cat.color,
                        boxShadow: `0 0 8px ${cat.color}80`,
                      }}
                    />
                    <h3 className="text-sm font-bold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase">
                      {isEsLang ? cat.label.es : cat.label.en}
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {cat.tags.map((s) => {
                      const relatedProjects = projects.filter(p => p.stack.includes(s));
                      
                      const tooltipContent = relatedProjects.length > 0 ? (
                        <div className="flex flex-col gap-1.5 py-0.5">
                          {relatedProjects.map((p, idx) => (
                            <button
                              key={p.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                const el = document.getElementById(`project-${p.id}`);
                                if (el) {
                                  el.scrollIntoView({ behavior: 'smooth' });
                                  // Optional: open detail directly
                                  // setActiveProject(p);
                                }
                              }}
                              className="text-white dark:text-zinc-900 hover:text-[#A78BFA] dark:hover:text-[#A78BFA] transition-colors text-left flex items-center gap-2 group/link"
                            >
                              <span className="w-1 h-1 rounded-full bg-[#A78BFA]" />
                              <span className="border-b border-transparent group-hover/link:border-[#A78BFA]">{p.title}</span>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <span className="opacity-60">{isEsLang ? "Uso general / Transversal" : "General / Cross-functional"}</span>
                      );
                      
                      return (
                        <Tooltip key={s} content={tooltipContent}>
                          <span
                            className={`px-3 py-1.5 bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 text-xs font-medium rounded-full border border-zinc-200 dark:border-zinc-800 ${cat.borderHover} ${cat.textHover} transition-colors cursor-default`}
                          >
                            {s}
                          </span>
                        </Tooltip>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}

             {/* Languages Card */}
             <div className="group p-6 bg-white/40 dark:bg-zinc-900/20 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800/80 rounded-[2rem] hover:border-[#A78BFA]/30 transition-all duration-300 md:col-span-2 relative">
                {/* Contained Corner Glow */}
                <div className="absolute inset-0 overflow-hidden rounded-[2rem] pointer-events-none">
                  <div className="absolute -top-24 -right-24 w-80 h-80 bg-[#A78BFA]/10 blur-[90px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                </div>
                
                <div className="relative z-10">
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0"
                    style={{ boxShadow: "0 0 8px rgba(251,191,36,0.8)" }}
                  />
                  <h3 className="text-sm font-bold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase">
                    {isEsLang ? "Idiomas" : "Languages"}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  {portfolioData.skills.languages.map((lang) => (
                    <div
                      key={lang.name.en}
                      className="flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-900 rounded-full border border-zinc-200 dark:border-zinc-800"
                    >
                      <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                        {lang.flag} {isEsLang ? lang.name.es : lang.name.en}
                      </span>
                      <span className="text-xs text-zinc-400 font-medium">
                        {isEsLang ? lang.level.es : lang.level.en}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* LOGROS */}
        <motion.section
          id="logros"
          className="scroll-mt-24"
          variants={sectionScrollEnter}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-10 tracking-tight border-b border-zinc-200 dark:border-zinc-800 pb-5">
            {isEsLang ? "Logros" : "Achievements"}
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {portfolioData.achievements.map((ach) => (
              <div key={ach.id} className="flex items-start gap-5 group">
                <div className="mt-[8px] h-2 w-2 rounded-full bg-[#A78BFA] shadow-[0_0_12px_rgba(167,139,250,0.8)] flex-shrink-0 group-hover:scale-125 transition-transform" />
                <div>
                  <p className="text-[#A78BFA] text-xs font-bold tracking-widest mb-1">
                    {ach.year}
                  </p>
                  <h3 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">
                    {isEsLang ? ach.title.es : ach.title.en}
                  </h3>
                  <p className="text-zinc-500 mt-2 max-w-xl leading-relaxed">
                    {isEsLang ? ach.description.es : ach.description.en}
                  </p>
                  {ach.file && (
                    <button
                      onClick={() => setViewerDoc({ 
                        url: `${basePath}${ach.file}`, 
                        title: isEsLang ? "Certificación" : "Certification", 
                        subtitle: isEsLang ? ach.title.es : ach.title.en 
                      })}
                      className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-[#A78BFA]/10 text-[#A78BFA] text-xs font-bold rounded-lg border border-[#A78BFA]/20 hover:bg-[#A78BFA] hover:text-white transition-all active:scale-95 group/btn"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="group-hover/btn:scale-110 transition-transform"
                      >
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      {isEsLang ? "Ver certificación" : "View certification"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* CONTACTO */}
        <motion.section
          id="contacto"
          className="scroll-mt-24 relative overflow-hidden"
          variants={sectionScrollEnter}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
        >
          {/* Section-specific Ambient Glow - Now with progressive masking to avoid hard edges while keeping page size stable */}
          <div className="absolute inset-x-0 bottom-0 top-0 z-0 pointer-events-none" style={{ 
            maskImage: 'linear-gradient(to bottom, transparent 0%, white 15%, white 85%, transparent 100%), linear-gradient(to right, transparent 0%, white 10%, white 90%, transparent 100%)', 
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, white 15%, white 85%, transparent 100%), linear-gradient(to right, transparent 0%, white 10%, white 90%, transparent 100%)',
            maskComposite: 'intersect',
            WebkitMaskComposite: 'source-in'
          }}>
            <ContactGlow />
          </div>

          <div className="relative z-10">
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-10 tracking-tight border-b border-zinc-200 dark:border-zinc-800 pb-5">
              {isEsLang ? "Contacto" : "Contact"}
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* Contact cards */}
              <div className="flex flex-col gap-5">
                <p className="text-zinc-500 leading-relaxed text-sm max-w-md">
                {isEsLang
                  ? "Estoy abierto a nuevas oportunidades, colaboraciones o simplemente una charla técnica. ¡No dudes en escribirme!"
                  : "I'm open to new opportunities, collaborations or just a technical chat. Feel free to reach out!"}
              </p>
              {(
                [
                  {
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect width="20" height="16" x="2" y="4" rx="2" />
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                      </svg>
                    ),
                    label: "Email",
                    value: portfolioData.contact.email,
                    href: `mailto:${portfolioData.contact.email}`,
                  },
                  {
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.42 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.5 16z" />
                      </svg>
                    ),
                    label: isEsLang ? "Teléfono" : "Phone",
                    value: portfolioData.contact.phone,
                    href: `tel:${portfolioData.contact.phone.replace(/\s/g, "")}`,
                  },
                  {
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    ),
                    label: isEsLang ? "Ubicación" : "Location",
                    value: isEsLang
                      ? portfolioData.contact.location.es
                      : portfolioData.contact.location.en,
                    href: undefined,
                  },
                  {
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                        <rect width="4" height="12" x="2" y="9" />
                        <circle cx="4" cy="4" r="2" />
                      </svg>
                    ),
                    label: "LinkedIn",
                    value: "tobias-alejandro-maciel-meister",
                    href: portfolioData.contact.linkedin,
                  },
                  {
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 98 96"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
                        />
                      </svg>
                    ),
                    label: "GitHub",
                    value: "TobiasMaciel",
                    href: portfolioData.contact.github,
                  },
                ] as {
                  icon: React.ReactNode;
                  label: string;
                  value: string;
                  href: string | undefined;
                }[]
              ).map((item) => (
                <div key={item.label} className="flex items-center gap-4 group">
                  <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#A78BFA]/10 border border-[#A78BFA]/20 text-[#A78BFA] flex-shrink-0 group-hover:bg-[#A78BFA]/20 transition-colors">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
                      {item.label}
                    </p>
                    {item.href ? (
                      <a
                        href={item.href}
                        target={
                          item.href.startsWith("http") ? "_blank" : undefined
                        }
                        rel="noopener noreferrer"
                        className="text-sm text-zinc-700 dark:text-zinc-300 hover:text-[#A78BFA] transition-colors font-medium"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-sm text-zinc-700 dark:text-zinc-300 font-medium">
                        {item.value}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* CV Section — Redesigned for premium editorial look */}
            <div className="lg:col-span-1 flex flex-col gap-10 p-10 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 bg-white/40 dark:bg-zinc-900/20 backdrop-blur-xl relative overflow-hidden group">
              {/* Background Glow */}
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#A78BFA]/10 blur-[80px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <span className="h-[2px] w-8 bg-[#A78BFA]" />
                  <p className="text-[#A78BFA] text-[10px] font-bold tracking-[0.4em] uppercase">
                    {isEsLang ? "Currículum Vitae" : "Resume"}
                  </p>
                </div>

                <h3 className="font-playfair text-4xl sm:text-5xl font-bold text-zinc-900 dark:text-white leading-[1.1] mb-6">
                  {isEsLang
                    ? "Trayectoria &\nExperiencia"
                    : "Journey &\nExperience"}
                </h3>

                <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed max-w-sm mb-10">
                  {isEsLang
                    ? "Consultá mi historial completo, formación académica y certificaciones actualizadas a la fecha."
                    : "Check my full history, academic background and current certifications up to date."}
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => setShowCV(true)}
                    className="flex-1 inline-flex items-center justify-center gap-3 px-8 py-5 bg-[#A78BFA] hover:bg-[#9061f9] text-white font-bold text-sm rounded-2xl transition-all duration-300 shadow-xl shadow-[#A78BFA]/30 active:scale-95 group/btn"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="group-hover/btn:scale-110 transition-transform"
                    >
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    {isEsLang ? "Ver en Pantalla" : "View In-Page"}
                  </button>

                  <a
                    href={`${basePath}${isEsLang ? "/CV/CV_Tobias_Maciel_ES.pdf" : "/CV/CV_Tobias_Maciel_EN.pdf"}`}
                    download={
                      isEsLang
                        ? "CV_Tobias_Maciel_ES.pdf"
                        : "CV_Tobias_Maciel_EN.pdf"
                    }
                    className="flex-1 inline-flex items-center justify-center gap-3 px-8 py-5 border border-zinc-200 dark:border-zinc-800 hover:border-[#A78BFA] dark:hover:border-[#A78BFA] text-zinc-700 dark:text-zinc-300 hover:text-[#A78BFA] dark:hover:text-[#A78BFA] font-bold text-sm rounded-2xl transition-all duration-300 bg-white/50 dark:bg-zinc-900 shadow-sm backdrop-blur-sm group/dl"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="group-hover/dl:translate-y-1 transition-transform"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" x2="12" y1="15" y2="3" />
                    </svg>
                    {isEsLang ? "Descargar PDF" : "Download PDF"}
                  </a>
                </div>

                <div className="flex items-center gap-4 mt-10 opacity-30 group-hover:opacity-60 transition-opacity">
                  <div className="h-px flex-1 bg-zinc-300 dark:bg-zinc-700" />
                  <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-zinc-500">
                    {isEsLang ? "2026 UPDATE" : "2026 UPDATE"}
                  </p>
                  <div className="h-px flex-1 bg-zinc-300 dark:bg-zinc-700" />
                </div>
              </div>
              </div>
            </div>
          </div>
        </motion.section>
      </div>

      <AnimatePresence>
        {showCV && (
          <DocumentViewer
            url={`${basePath}${isEsLang ? "/CV/CV_Tobias_Maciel_ES.pdf" : "/CV/CV_Tobias_Maciel_EN.pdf"}`}
            title={isEsLang ? "Curriculum Vitae" : "Resume"}
            subtitle="Tobías Alejandro Maciel Meister"
            onClose={() => setShowCV(false)}
          />
        )}
        {viewerDoc && (
          <DocumentViewer
            url={viewerDoc.url}
            title={viewerDoc.title}
            subtitle={viewerDoc.subtitle}
            onClose={() => setViewerDoc(null)}
          />
        )}
        {lightboxInfo && (
          <Lightbox
            images={lightboxInfo.images}
            startIndex={lightboxInfo.index}
            onClose={() => setLightboxInfo(null)}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
