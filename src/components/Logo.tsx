import { useId } from "react";

/**
 * "mm" monogram (Maciel Meister): a lowercase m with three arches, as if two
 * m's shared their middle arch. The shared part (the intersection) is solid;
 * the parts that belong to only one m are drawn as dashed outlines.
 */

// Only the first m: left stem + first arch, ending on the shared stem
export const LOGO_LEFT = "M10 66V24M10 42c0-12 7-20 16-20s16 8 16 20";
// Only the second m: last arch + right stem, starting on the shared stem
export const LOGO_RIGHT = "M74 42c0-12 7-20 16-20s16 8 16 20v24";
// Shared by both: the two middle stems and the arch between them
export const LOGO_SHARED = "M42 66V42c0-12 7-20 16-20s16 8 16 20v24";

export const LOGO_STROKE = 16;
// Thickness of the outline around the hollow parts
export const LOGO_RING = 3.5;
export const LOGO_VIEWBOX = "0 0 116 76";

const round = { strokeLinecap: "round", strokeLinejoin: "round" } as const;
// Dashed outline: a dashed full-width stroke, hollowed by HollowMask, leaves
// dashes along both edges of each stroke
export const dashed = {
  strokeDasharray: "5 3.5",
  strokeLinecap: "butt",
  strokeLinejoin: "round",
} as const;

/**
 * Mask that keeps only a ring along the given paths: the full stroke minus
 * a thinner stroke down its middle.
 */
export function HollowMask({ id }: { id: string }) {
  return (
    <mask
      id={id}
      maskUnits="userSpaceOnUse"
      x="0"
      y="0"
      width="116"
      height="76"
    >
      {[LOGO_LEFT, LOGO_RIGHT].map((d) => (
        <path
          key={d}
          d={d}
          fill="none"
          stroke="white"
          strokeWidth={LOGO_STROKE}
          {...round}
        />
      ))}
      {[LOGO_LEFT, LOGO_RIGHT].map((d) => (
        <path
          key={`${d}-in`}
          d={d}
          fill="none"
          stroke="black"
          strokeWidth={LOGO_STROKE - LOGO_RING * 2}
          {...round}
        />
      ))}
    </mask>
  );
}

export default function Logo({
  size = 48,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  const maskId = `logo-ring-${useId().replace(/:/g, "")}`;
  return (
    <svg
      viewBox={LOGO_VIEWBOX}
      width={size}
      height={(size * 76) / 116}
      fill="none"
      stroke="currentColor"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <HollowMask id={maskId} />
      </defs>
      <g mask={`url(#${maskId})`}>
        <path d={LOGO_LEFT} strokeWidth={LOGO_STROKE} {...dashed} />
        <path d={LOGO_RIGHT} strokeWidth={LOGO_STROKE} {...dashed} />
      </g>
      <path d={LOGO_SHARED} strokeWidth={LOGO_STROKE} {...round} />
    </svg>
  );
}
