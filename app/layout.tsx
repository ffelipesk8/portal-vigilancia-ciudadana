import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";

import "./globals.css";

const headingFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const bodyFont = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Portal Vigilancia Ciudadana · comBATE la Corrupción",
  description:
    "Plataforma cívica de veeduría: perfil público del concejal Andrés Gury Rodríguez y canal de denuncia anónima con revisión editorial independiente.",
  keywords: [
    "vigilancia ciudadana",
    "denuncia anónima",
    "veeduría",
    "corrupción",
    "concejal",
    "control social",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className={`${headingFont.variable} ${bodyFont.variable}`}>
        {children}
      </body>
    </html>
  );
}
