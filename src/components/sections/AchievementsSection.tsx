import { Eye } from "lucide-react";
import type { AchievementItem } from "@/types";
import ScrollIn from "@/components/fx/ScrollIn";
import Section from "@/components/ui/Section";
import { button } from "@/components/ui/styles";

export default function AchievementsSection({
  achievements,
  isEs,
  onOpenDocument,
}: {
  achievements: AchievementItem[];
  isEs: boolean;
  onOpenDocument: (doc: {
    url: string;
    title: string;
    subtitle: string;
  }) => void;
}) {
  return (
    <Section id="logros" title={isEs ? "Logros" : "Achievements"} from="left">
      <ul className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        {achievements.map((a, i) => {
          const kind = a.isAchievement
            ? isEs
              ? "Logro"
              : "Achievement"
            : isEs
              ? "Certificación"
              : "Certification";
          return (
            <li key={a.id}>
              <ScrollIn
                x={i % 2 === 0 ? -80 : 80}
                y={20}
                className="group"
                innerClassName="flex items-start gap-5"
              >
                <span
                  aria-hidden="true"
                  className="mt-2 h-2 w-2 shrink-0 rounded-full bg-brand shadow-[0_0_10px_var(--brand)] transition-transform group-hover:scale-125"
                />
                <div>
                  <p className="mb-1 text-xs font-bold tracking-wide text-accent">
                    {a.year}
                  </p>
                  <h3 className="text-xl font-bold">{a.title}</h3>
                  <p className="mt-2 max-w-xl leading-relaxed text-muted">
                    {a.description}
                  </p>
                  {a.file && (
                    <button
                      type="button"
                      onClick={() =>
                        onOpenDocument({
                          url: a.file!,
                          title: kind,
                          subtitle: a.title,
                        })
                      }
                      className={`${button.soft} group/btn mt-4`}
                    >
                      <Eye
                        size={14}
                        aria-hidden="true"
                        className="transition-transform group-hover/btn:scale-110"
                      />
                      {isEs
                        ? `Ver ${kind.toLowerCase()}`
                        : `View ${kind.toLowerCase()}`}
                    </button>
                  )}
                </div>
              </ScrollIn>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
