import TechIcon from "./TechIcon";

const tones = {
  neutral:
    "border-rule bg-surface/60 text-muted group-hover:border-brand/30 group-hover:text-accent",
  accent: "border-brand/25 bg-brand/10 text-accent",
};

export default function Chip({
  children,
  tone = "neutral",
  icon,
}: {
  children: React.ReactNode;
  tone?: keyof typeof tones;
  /** Technology name whose logo is shown before the text. */
  icon?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${tones[tone]}`}
    >
      {icon && <TechIcon name={icon} size={12} className="opacity-80" />}
      {children}
    </span>
  );
}
