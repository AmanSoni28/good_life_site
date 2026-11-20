import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // a stray lockfile in a parent folder otherwise makes Next guess the wrong root
  outputFileTracingRoot: path.join(__dirname),
  images: { formats: ["image/avif", "image/webp"] },
};

export default nextConfig;
