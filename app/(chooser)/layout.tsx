import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Inter, Inter_Tight, Sora } from "next/font/google";
import "./chooser.css";

// one display face per concept, so each panel can be set in its own type
const bebas = Bebas_Neue({ weight: "400", subsets: ["latin"], variable: "--f-bebas", display: "swap" });
const tight = Inter_Tight({ subsets: ["latin"], variable: "--f-tight", display: "swap" });
const sora = Sora({ subsets: ["latin"], variable: "--f-sora", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--f-inter", display: "swap" });

export const metadata: Metadata = {
  title: "Good Life Fitness Club | Choose a website concept",
  description: "Three design directions for the Good Life Fitness Club website. Open each one and pick the one that feels right.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#0a0a0a" };

export default function ChooserLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bebas.variable} ${tight.variable} ${sora.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
