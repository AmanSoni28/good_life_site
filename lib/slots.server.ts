import fs from "node:fs";
import path from "node:path";
import { GEN_DIR } from "./slots";

/** Which slots already have a file in public/assets/good-life/gen: { id: "/assets/good-life/gen/id.jpg" }. Server only. */
export function readySlots(): Record<string, string> {
  try {
    const files = fs.readdirSync(path.join(process.cwd(), "public", GEN_DIR)).filter((f) => /\.(jpe?g|png|webp|avif)$/i.test(f));
    return Object.fromEntries(files.map((f) => [f.replace(/\.[^.]+$/, ""), `${GEN_DIR}/${f}`]));
  } catch {
    return {};
  }
}
