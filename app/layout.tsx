import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Inter, Oswald } from "next/font/google";
import "./globals.css";

const bebas = Bebas_Neue({ weight: "400", subsets: ["latin"], variable: "--font-bebas", display: "swap" });
const oswald = Oswald({ subsets: ["latin"], variable: "--font-oswald", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  title: "Good Life Fitness Club | Unisex Gym · Three Floors",
  description:
    "Good Life Fitness Club is a three-floor unisex gym for strength, cardio, functional turf training and personal training. Train Hard. Stay Strong. Live Better.",
};

export const viewport: Viewport = { themeColor: "#080808" };

// Decides before first paint whether the intro plays (once per session, never with reduced motion).
const introScript = `try{var d=document.documentElement,s=sessionStorage.getItem('gl-intro'),r=matchMedia('(prefers-reduced-motion: reduce)').matches;d.dataset.intro=(s||r)?'seen':'playing'}catch(e){document.documentElement.dataset.intro='seen'}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${bebas.variable} ${oswald.variable} ${inter.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
