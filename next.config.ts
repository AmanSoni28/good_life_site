import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // a stray lockfile in a parent folder otherwise makes Next guess the wrong root
  outputFileTracingRoot: path.join(__dirname),
  images: { formats: ["image/avif", "image/webp"] },
  // STATIC_EXPORT=1 writes a plain static site to ./out for Cloudflare (npm run deploy); no image server there
  ...(process.env.STATIC_EXPORT ? { output: "export" as const, images: { unoptimized: true } } : {}),
};

export default nextConfig;
