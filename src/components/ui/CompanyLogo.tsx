import type { CompanyLogo as Logo } from "@/types";

/**
 * Company mark on a transparent background. Colour marks are shown as is;
 * one-colour marks are used as a mask in the text colour, so they read on
 * both the light and the dark theme.
 */
export default function CompanyLogo({
  logo,
  name,
  size = 48,
}: {
  logo: Logo;
  name: string;
  size?: number;
}) {
  if (logo.mono) {
    return (
      <span
        role="img"
        aria-label={name}
        className="block shrink-0 bg-ink"
        style={{
          width: size,
          height: size,
          maskImage: `url(${logo.src})`,
          WebkitMaskImage: `url(${logo.src})`,
          maskSize: "contain",
          WebkitMaskSize: "contain",
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
          maskPosition: "center",
          WebkitMaskPosition: "center",
        }}
      />
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={logo.src}
      alt={name}
      width={size}
      height={size}
      className="block shrink-0 object-contain"
    />
  );
}
