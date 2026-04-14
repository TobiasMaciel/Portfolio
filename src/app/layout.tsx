import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { Providers } from "@/components/Providers";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://tobiasmaciel.github.io"),
  title: "Tobías Alejandro Maciel Meister | Portfolio",
  description: "Desarrollador Full-Stack & DevOps",
  openGraph: {
    title: "Tobías Alejandro Maciel Meister | Portfolio",
    description: "Desarrollador Full-Stack & DevOps",
    url: "https://tobiasmaciel.github.io/Portfolio",
    siteName: "Tobías Maciel Portfolio",
    images: [
      {
        url: "/Portfolio/SocialPreview.png",
        width: 1200,
        height: 630,
        alt: "Tobías Alejandro Maciel Meister | Portfolio Preview",
      },
    ],
    locale: "es_AR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tobías Alejandro Maciel Meister | Portfolio",
    description: "Desarrollador Full-Stack & DevOps",
    images: ["/Portfolio/SocialPreview.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // next-themes requiere suppressHydrationWarning en el html
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${playfair.variable} antialiased selection:bg-[#A78BFA]/30 selection:text-[#A78BFA]`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
