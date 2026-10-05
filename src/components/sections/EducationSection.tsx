import type { EducationItem } from "@/types";
import ScrollIn from "@/components/fx/ScrollIn";
import Section from "@/components/ui/Section";

export default function EducationSection({
  education,
  isEs,
}: {
  education: EducationItem[];
  isEs: boolean;
}) {
  return (
    <Section
      id="educacion"
      title={isEs ? "Educación" : "Education"}
      from="left"
    >
      <ul className="flex flex-col gap-10">
        {education.map((item) => (
          <li key={item.id} className="group relative">
            <ScrollIn x={80} y={60}>
              <p className="mb-2 text-sm font-semibold tracking-wide text-accent">
                {item.period}
              </p>
              <h3 className="mb-1 text-2xl font-bold transition-colors group-hover:text-accent">
                {item.title}
              </h3>
              <p className="mb-2 text-lg font-medium text-muted">
                {item.institution}
              </p>
              {item.tags.length > 0 && (
                <ul className="my-2.5 flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-lg border border-brand/20 bg-brand/5 px-3 py-1 text-xs font-semibold tracking-wide text-accent"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              )}
              {item.description && (
                <p className="max-w-[70ch] leading-relaxed text-muted">
                  {item.description}
                </p>
              )}
            </ScrollIn>
          </li>
        ))}
      </ul>
    </Section>
  );
}
