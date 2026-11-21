import type { Metadata, Viewport } from "next";
import { Inter, Sora } from "next/font/google";
import "./voltage.css";

const sora = Sora({ subsets: ["latin"], variable: "--f-sora", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--f-inter", display: "swap" });

export const metadata: Metadata = {
  title: "Good Life Fitness Club | Concept 03 — Voltage",
  description:
    "Good Life Fitness Club is a three-floor unisex gym for strength, cardio, functional turf training and personal training. Train Hard. Stay Strong. Live Better.",
};

export const viewport: Viewport = { themeColor: "#050505" };

export default function VoltageLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sora.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
