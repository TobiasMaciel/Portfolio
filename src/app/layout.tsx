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
  title: "Tobías Alejandro Maciel Meister | Portfolio",
  description: "Desarrollador Full-Stack & DevOps",
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
