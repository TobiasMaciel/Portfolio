const tones = {
  neutral:
    "border-rule bg-surface/60 text-muted group-hover:border-brand/30 group-hover:text-accent",
  accent: "border-brand/25 bg-brand/10 text-accent",
};

export default function Chip({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: keyof typeof tones;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${tones[tone]}`}
    >
      {children}
    </span>
  );
}
