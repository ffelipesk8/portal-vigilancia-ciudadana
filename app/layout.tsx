import type { Metadata } from "next";
import { Newsreader, Public_Sans } from "next/font/google";

import "./globals.css";

const headingFont = Newsreader({
  subsets: ["latin"],
  variable: "--font-heading",
});

const bodyFont = Public_Sans({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Canal Ciudadano | Vigilancia y Denuncia",
  description:
    "Plataforma ciudadana informativa con canal de denuncia anónima y compromisos públicos contra la corrupción.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${headingFont.variable} ${bodyFont.variable}`}>{children}</body>
    </html>
  );
}
