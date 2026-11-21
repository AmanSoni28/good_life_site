// Takes the preview screenshots shown on the concept chooser (public/concepts/concept-N.jpg).
// Run with the dev server up:  node scripts/capture-previews.mjs [baseUrl]
// Needs Google Chrome and Node 22+. Uses a throwaway headless Chrome profile, nothing else is touched.
import { spawn } from "node:child_process";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

const BASE = process.argv[2] ?? "http://localhost:3000";
const CHROME = process.env.CHROME_PATH ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const OUT = path.join(import.meta.dirname, "..", "public", "concepts");
const PORT = 9333;
const SHOTS = [
  { slug: "concept-1", wait: 9000 }, // 3D building needs time to assemble
  { slug: "concept-2", wait: 6000 }, // preloader, then the hero entrance
  { slug: "concept-3", wait: 6500 },
];
// review-only chrome that should not appear in a preview of the design
const HIDE = `document.querySelectorAll('nav[aria-label="Design concepts"], nextjs-portal').forEach((e) => (e.style.display = "none"))`;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const profile = mkdtempSync(path.join(tmpdir(), "gl-previews-"));
const chrome = spawn(CHROME, ["--headless=new", `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`, "--hide-scrollbars", "--no-first-run", "--window-size=1440,900", "about:blank"], { stdio: "ignore" });

try {
  let target;
  for (let i = 0; i < 40 && !target; i++) {
    await sleep(250);
    target = await fetch(`http://127.0.0.1:${PORT}/json`).then((r) => r.json()).then((l) => l.find((t) => t.type === "page")).catch(() => null);
  }
  if (!target) throw new Error("Chrome did not start");

  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((ok, fail) => ((ws.onopen = ok), (ws.onerror = fail)));
  let id = 0;
  const pending = new Map();
  ws.onmessage = (m) => {
    const d = JSON.parse(m.data);
    if (d.id && pending.has(d.id)) {
      pending.get(d.id)(d);
      pending.delete(d.id);
    }
  };
  const send = (method, params = {}) =>
    new Promise((ok, fail) => {
      pending.set(++id, (d) => (d.error ? fail(new Error(`${method}: ${d.error.message}`)) : ok(d.result)));
      ws.send(JSON.stringify({ id, method, params }));
    });

  await send("Page.enable");
  await send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 900, deviceScaleFactor: 1.5, mobile: false });
  // concept 1 plays a one-off intro; mark it as seen so the shot shows the page itself
  await send("Page.addScriptToEvaluateOnNewDocument", { source: "try{sessionStorage.setItem('gl-intro','1')}catch(e){}" });

  mkdirSync(OUT, { recursive: true });
  for (const s of SHOTS) {
    await send("Page.navigate", { url: `${BASE}/${s.slug}` });
    await sleep(s.wait);
    await send("Runtime.evaluate", { expression: HIDE });
    await sleep(200);
    const { data } = await send("Page.captureScreenshot", { format: "jpeg", quality: 82 });
    const file = path.join(OUT, `${s.slug}.jpg`);
    writeFileSync(file, Buffer.from(data, "base64"));
    console.log("saved", path.relative(process.cwd(), file));
  }
  ws.close();
} finally {
  chrome.kill();
  await sleep(300);
  rmSync(profile, { recursive: true, force: true });
}
