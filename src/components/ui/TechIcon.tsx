import { getTechIcon, monogram } from "./techIcons";

/** Brand logo for a technology, or its initials when there is no logo. */
export default function TechIcon({
  name,
  size = 14,
  className = "",
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const icon = getTechIcon(name);
  if (!icon) {
    return (
      <span
        aria-hidden="true"
        className={`inline-flex shrink-0 items-center justify-center rounded-[4px] bg-current/10 font-bold leading-none ${className}`}
        style={{ width: size, height: size, fontSize: size * 0.48 }}
      >
        {monogram(name)}
      </span>
    );
  }
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      className={`shrink-0 ${className}`}
    >
      <path d={icon.path} />
    </svg>
  );
}
