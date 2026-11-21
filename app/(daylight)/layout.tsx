import type { Metadata, Viewport } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import "./daylight.css";

const tight = Inter_Tight({ subsets: ["latin"], variable: "--f-tight", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--f-inter", display: "swap" });

export const metadata: Metadata = {
  title: "Good Life Fitness Club | Concept 02 — Daylight",
  description:
    "Good Life Fitness Club is a three-floor unisex gym for strength, cardio, functional turf training and personal training. Train Hard. Stay Strong. Live Better.",
};

export const viewport: Viewport = { themeColor: "#f3f3f0" };

export default function DaylightLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${tight.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
