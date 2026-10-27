import type { CSSProperties } from "react";
import type { Metadata, Viewport } from "next";
import { Barlow, Space_Mono } from "next/font/google";
import { BRAND } from "@/scene/config/palette";
import "./globals.css";
import "./experience.css";

/*
 * Tipografia da marca, hospedada no próprio build (sem requisição ao Google no navegador).
 * Barlow = conteúdo (e títulos da empena, enquanto a Agrandir não está disponível).
 * Space Mono = sistema (INDEX, rótulos, painel).
 */
const barlow = Barlow({ subsets: ["latin"], weight: ["400", "600", "700"], variable: "--font-barlow" });
const spaceMono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-space-mono" });

/** Tokens de cor como variáveis CSS (fonte única: palette.ts). */
const BRAND_VARS = {
  "--graphite": BRAND.graphite,
  "--off-white": BRAND.offWhite,
  "--blue": BRAND.blue,
  "--lime": BRAND.lime,
  "--orange": BRAND.orange,
} as CSSProperties;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://crm-como-sistema.vercel.app";
const DESCRIPTION =
  "Uma experiência educacional 3D: desça por um prédio empresarial e veja como 8 áreas decidem, operam e registram a relação com o cliente. Tecnologia não corrige operação.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "CRM como Sistema — Gui Block",
  description: DESCRIPTION,
  openGraph: {
    title: "CRM como Sistema",
    description: DESCRIPTION,
    locale: "pt_BR",
    type: "website",
    siteName: "Gui Block",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Prédio em corte com três andares: Brain, Heart e Backbone" }],
  },
  twitter: { card: "summary_large_image", title: "CRM como Sistema", description: DESCRIPTION, images: ["/og.png"] },
  // lançamento: indexável. Para esconder de novo: robots: { index: false, follow: false }
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: BRAND.graphite,
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" style={BRAND_VARS} className={`${barlow.variable} ${spaceMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
