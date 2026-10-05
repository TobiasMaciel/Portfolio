import { Download, Eye, Mail, MapPin, Phone } from "lucide-react";
import ContactGlow from "@/components/ContactGlow";
import GridWarpBackground from "@/components/GridWarpBackground";
import Section, { CornerGlow } from "@/components/ui/Section";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/icons";
import { button } from "@/components/ui/styles";
import type { Language } from "@/context/LanguageContext";
import { cvUrl } from "@/data/content";
import portfolioData from "@/data";

const fadeEdges =
  "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%), linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)";

export default function ContactSection({
  language,
  onOpenCV,
}: {
  language: Language;
  onOpenCV: () => void;
}) {
  const isEs = language === "es";
  const { contact } = portfolioData;

  const rows = [
    { icon: <Mail size={16} aria-hidden="true" />, label: "Email", value: contact.email, href: `mailto:${contact.email}` },
    {
      icon: <Phone size={16} aria-hidden="true" />,
      label: isEs ? "Teléfono" : "Phone",
      value: contact.phone,
      href: `tel:${contact.phone.replace(/\s/g, "")}`,
    },
    { icon: <MapPin size={16} aria-hidden="true" />, label: isEs ? "Ubicación" : "Location", value: contact.location[language] },
    { icon: <LinkedInIcon size={16} />, label: "LinkedIn", value: "tobias-alejandro-maciel-meister", href: contact.linkedin },
    { icon: <GitHubIcon size={16} />, label: "GitHub", value: "TobiasMaciel", href: contact.github },
  ];

  const cvFile = cvUrl(language);

  return (
    <Section
      id="contacto"
      title={isEs ? "Contacto" : "Contact"}
      className="overflow-hidden"
      background={
        <>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0"
            style={{
              maskImage: fadeEdges,
              WebkitMaskImage: fadeEdges,
              maskComposite: "intersect",
              WebkitMaskComposite: "source-in",
            }}
          >
            <ContactGlow />
          </div>
          <GridWarpBackground
            className="pointer-events-none absolute inset-0 z-0 h-full w-full"
            heightVal={600}
            maskStyle="radial-gradient(circle at 50% 50%, black 10%, transparent 85%)"
          />
        </>
      }
    >
      <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2">
        <div className="flex flex-col gap-5">
          <p className="max-w-md text-sm leading-relaxed text-muted">
            {isEs
              ? "Estoy abierto a nuevas oportunidades, colaboraciones o una charla técnica. El email es la forma más rápida de contactarme."
              : "I'm open to new opportunities, collaborations or a technical chat. Email is the fastest way to reach me."}
          </p>
          <dl className="flex flex-col gap-5">
            {rows.map((r) => (
              <div key={r.label} className="group flex items-center gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-brand/20 bg-brand/10 text-accent transition-colors group-hover:bg-brand/20">
                  {r.icon}
                </span>
                <div className="min-w-0">
                  <dt className="text-[11px] font-semibold text-muted">{r.label}</dt>
                  <dd className="truncate text-sm font-medium">
                    {r.href ? (
                      <a
                        href={r.href}
                        target={r.href.startsWith("http") ? "_blank" : undefined}
                        rel="noopener noreferrer"
                        className="transition-colors hover:text-accent"
                      >
                        {r.value}
                      </a>
                    ) : (
                      r.value
                    )}
                  </dd>
                </div>
              </div>
            ))}
          </dl>
        </div>

        <div className="group relative overflow-hidden rounded-[2.5rem] border border-rule bg-surface/70 p-8 backdrop-blur-sm transition-colors duration-500 hover:border-brand/40 sm:p-10 dark:bg-surface/40">
          <CornerGlow />
          <div className="relative z-10">
            <div className="mb-6 flex items-center gap-3">
              <span aria-hidden="true" className="h-[2px] w-8 bg-brand" />
              <p className="text-sm font-semibold text-accent">
                {isEs ? "Currículum" : "Résumé"}
              </p>
            </div>
            <h3 className="mb-6 font-serif text-4xl font-bold leading-[1.1] sm:text-5xl">
              {isEs ? "Mi recorrido, en un PDF" : "My path, in one PDF"}
            </h3>
            <p className="mb-10 max-w-sm text-sm leading-relaxed text-muted">
              {isEs
                ? "Experiencia, formación académica y certificaciones, actualizado en 2026."
                : "Experience, education and certifications, updated in 2026."}
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <button type="button" onClick={onOpenCV} className={`${button.primary} group/btn flex-1 whitespace-nowrap py-5`}>
                <Eye size={18} aria-hidden="true" className="transition-transform group-hover/btn:scale-110" />
                {isEs ? "Ver CV" : "View résumé"}
              </button>
              <a
                href={cvFile}
                download={cvFile.split("/").pop()}
                className={`${button.secondary} group/dl flex-1 whitespace-nowrap py-5`}
              >
                <Download size={18} aria-hidden="true" className="transition-transform group-hover/dl:translate-y-0.5" />
                {isEs ? "Descargar PDF" : "Download PDF"}
              </a>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
