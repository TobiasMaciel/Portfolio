"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { FileText, Mail, Phone } from "lucide-react";
import AmbientGlow from "@/components/AmbientGlow";
import Magnetic from "@/components/fx/Magnetic";
import RevealText from "@/components/fx/RevealText";
import LayoutAnimation from "@/components/LayoutAnimation";
import Tooltip from "@/components/ui/Tooltip";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/icons";
import { button } from "@/components/ui/styles";
import { useLanguage } from "@/context/LanguageContext";
import portfolioData from "@/data";

const ease = [0.16, 1, 0.3, 1] as const;

// Opacity lives on the children, so the parent's opacity is free for the
// scroll-linked exit below
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2, delayChildren: 0.1 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, ease } },
};

const icons: Record<string, React.ReactNode> = {
  email: <Mail size={19} aria-hidden="true" />,
  phone: <Phone size={19} aria-hidden="true" />,
  linkedin: <LinkedInIcon size={19} />,
  github: <GitHubIcon size={19} />,
};

export default function Hero({ onOpenCV }: { onOpenCV: () => void }) {
  const { t, isEs, language } = useLanguage();
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  // Exit as the page scrolls past: the name block rises and fades, the
  // text column drifts off diagonally
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const leftY = useTransform(scrollYProgress, [0, 1], [0, -160]);
  const leftOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const rightX = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const rightY = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const rightOpacity = useTransform(scrollYProgress, [0.15, 0.85], [1, 0]);
  const { hero, socialLinks } = portfolioData;

  const nav = [
    { href: "#experiencia", label: t("experience") },
    { href: "#proyectos", label: t("projects") },
    { href: "#educacion", label: t("studies") },
    { href: "#habilidades", label: t("skills") },
    { href: "#logros", label: t("achievements") },
    { href: "#contacto", label: t("contact") },
  ];

  const labels: Record<string, string> = {
    email: "Email",
    phone: isEs ? "Teléfono" : "Phone",
    linkedin: "LinkedIn",
    github: "GitHub",
  };

  return (
    <header
      id="inicio"
      ref={ref}
      className="relative z-10 flex w-full flex-col gap-10 lg:min-h-screen lg:flex-row lg:items-center lg:justify-between lg:gap-0"
    >
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        style={reduceMotion ? undefined : { y: leftY, opacity: leftOpacity }}
        className="relative z-20 px-6 pt-24 sm:px-10 lg:w-[40%] lg:pl-16 lg:pr-0 lg:pt-0 xl:w-[42%] xl:pl-20 2xl:w-[45%]"
      >
        <AmbientGlow />

        <h1 className="relative z-10 font-serif text-6xl font-bold leading-none tracking-tight drop-shadow-md sm:text-7xl lg:text-[2.8vw] xl:text-[3.2vw] 2xl:text-[4.2rem] dark:drop-shadow-lg">
          <RevealText
            lines={[hero.name, hero.surname]}
            lineClassNames={["", "text-muted"]}
            delay={0.15}
            inView={false}
          />
        </h1>

        <motion.p
          variants={fadeUp}
          className="relative z-10 mt-4 text-lg font-medium tracking-wide text-accent sm:text-xl xl:mt-5"
        >
          {hero.role[language]}
        </motion.p>

        <motion.nav
          variants={fadeUp}
          aria-label={isEs ? "Secciones" : "Sections"}
          className="relative z-30 mt-8 xl:mt-12"
        >
          <ul className="flex flex-wrap gap-x-6 gap-y-3 text-xs font-bold uppercase tracking-[0.2em] text-muted lg:flex-col lg:gap-4 xl:gap-5">
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="group flex w-fit items-center gap-4 transition-colors hover:text-ink"
                >
                  <span
                    aria-hidden="true"
                    className="hidden h-[2px] w-8 bg-line transition-all duration-300 group-hover:w-16 group-hover:bg-brand lg:block"
                  />
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </motion.nav>

        <motion.ul
          variants={fadeUp}
          className="relative z-30 mt-8 flex gap-3 xl:mt-12 lg:gap-4"
        >
          {socialLinks.map((l) => (
            <li key={l.platform}>
              <Magnetic>
                <Tooltip content={labels[l.platform]}>
                  <a
                    href={l.href}
                    target={
                      l.target ??
                      (l.href.startsWith("http") ? "_blank" : undefined)
                    }
                    rel="noopener noreferrer"
                    aria-label={labels[l.platform]}
                    className={`${button.icon} group`}
                  >
                    <span className="transition-transform duration-300 group-hover:scale-110">
                      {icons[l.platform]}
                    </span>
                  </a>
                </Tooltip>
              </Magnetic>
            </li>
          ))}
          <li>
            <Magnetic>
              <Tooltip
                content={isEs ? "Ver / descargar CV" : "View / download résumé"}
              >
                <button
                  type="button"
                  onClick={onOpenCV}
                  aria-label={isEs ? "Ver CV" : "View résumé"}
                  className={`${button.icon} group`}
                >
                  <span className="transition-transform duration-300 group-hover:scale-110">
                    <FileText size={19} aria-hidden="true" />
                  </span>
                </button>
              </Tooltip>
            </Magnetic>
          </li>
        </motion.ul>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.6, ease }}
        className="relative z-10 w-full px-2 lg:w-[50%] lg:px-0 lg:pr-10 xl:pr-20"
      >
        <motion.div
          style={
            reduceMotion
              ? undefined
              : { x: rightX, y: rightY, opacity: rightOpacity }
          }
        >
          <LayoutAnimation />
        </motion.div>
      </motion.div>
    </header>
  );
}
