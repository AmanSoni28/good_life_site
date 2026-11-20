"use client";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import LazyVideo from "./LazyVideo";
import { getLenis, gsap, reduced, ScrollTrigger, useGsap } from "@/lib/motion";
import { A, whatsapp } from "@/lib/site";

type Item = { src: string; alt: string; caption: string; shape: "p" | "l" | "v"; video?: string };

// Only authentic club media.
const ITEMS: Item[] = [
  { src: "cardio-area.jpg", alt: "Cardio floor with treadmills and blue lighting", caption: "Cardio floor", shape: "p" },
  { src: "turf-area.jpg", alt: "Covered turf zone with battle ropes and plyo boxes", caption: "Functional turf zone", shape: "l" },
  { src: "stills/stair-climber.jpg", alt: "Member on the stair climber by the windows", caption: "Stair climber", shape: "p" },
  { src: "videos/strength-machines.jpg", video: "videos/strength-machines.mp4", alt: "Strength machines and plate loading", caption: "Strength zone", shape: "v" },
  { src: "floors.png", alt: "Good Life Fitness Club facade lit up at night", caption: "The club after dark", shape: "l" },
  { src: "stills/entrance.jpg", alt: "The neon-lit entrance to the gym", caption: "The entrance", shape: "p" },
  { src: "stills/battle-ropes.jpg", alt: "Member training with battle ropes", caption: "Battle ropes", shape: "p" },
  { src: "stills/chest-press.jpg", alt: "Member training on a strength machine", caption: "Machine training", shape: "p" },
  { src: "member-progress.jpg", alt: "Member checking progress in the mirror", caption: "Progress", shape: "p" },
  { src: "building.png", alt: "The full Good Life Fitness Club building", caption: "Three floors of training", shape: "p" },
];
const N = ITEMS.length;
const OFF = 1.6; // first image starts this many spacings away, so the title opens clean
// scattered flight path: [x in vw, y in vh] — alternating sides so the camera threads between them
const PATH: [number, number][] = [
  [-27, -6], [28, 8], [-29, 10], [27, -10], [-28, 2], [29, -4], [-26, -10], [28, 10], [-27, 8], [26, -8],
];
const ASPECT = { p: "aspect-[3/4]", l: "aspect-[4/3]", v: "aspect-[9/16]" };
const WIDTH = { p: 1, l: 1.35, v: 0.85 };
const PHOTOS = ITEMS.filter((i) => !i.video);

const clamp = (v: number) => Math.min(1, Math.max(0, v));

export default function GymGallery() {
  const ref = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<number | null>(null);
  const [active, setActive] = useState(0);
  const [flat, setFlat] = useState(false);

  useEffect(() => setFlat(reduced()), []);

  useGsap(
    ref,
    () => {
      if (flat) return;
      const root = ref.current!;
      const stage = root.querySelector<HTMLElement>(".g-stage")!;
      const scene = root.querySelector<HTMLElement>(".g-scene")!;
      const items = Array.from(root.querySelectorAll<HTMLElement>(".g-item"));
      const head = root.querySelector<HTMLElement>(".g-head")!;
      const outro = root.querySelector<HTMLElement>(".g-outro")!;
      const bar = root.querySelector<HTMLElement>(".g-bar")!;
      const bgWord = root.querySelector<HTMLElement>(".g-bgword")!;

      let S = 900; // depth spacing between images (px)
      let pos: [number, number][] = [];
      const layout = () => {
        const mobile = window.innerWidth < 768;
        S = mobile ? 650 : 900;
        const base = mobile ? 54 : 21; // card width in vw
        pos = PATH.map(([x, y]) => [((mobile ? x * 0.5 : x) * window.innerWidth) / 100, ((mobile ? y * 1.6 : y) * window.innerHeight) / 100]);
        items.forEach((el, i) => (el.style.width = `${base * WIDTH[ITEMS[i].shape]}vw`));
      };
      layout();

      let target = 0;
      let cur = 0;
      let last = -1;
      let idx = -1;
      const render = (camZ: number) => {
        const total = (N + OFF) * S;
        items.forEach((el, i) => {
          const z = -(i + OFF) * S + camZ;
          const op = clamp((z + 2.8 * S) / (1.2 * S)) * (1 - clamp((z - 650) / 250)); // stay solid while rushing past
          el.style.opacity = String(op);
          el.style.visibility = op < 0.01 ? "hidden" : "visible";
          el.style.pointerEvents = op > 0.6 ? "auto" : "none";
          el.style.transform = `translate(-50%,-50%) translate3d(${pos[i][0]}px,${pos[i][1]}px,${z}px)`;
        });
        const hz = camZ;
        head.style.opacity = String(1 - clamp((hz - 120) / 420));
        head.style.transform = `translate(-50%,-50%) translateZ(${hz}px)`;
        const oz = -total + camZ;
        outro.style.opacity = String(clamp((oz + 2.5 * S) / (2 * S)));
        outro.style.transform = `translate(-50%,-50%) translateZ(${Math.min(oz, 0)}px)`;
        outro.style.pointerEvents = oz > -S ? "auto" : "none";
        const p = camZ / total;
        bar.style.transform = `scaleX(${p})`;
        bgWord.style.transform = `translate(-50%,-50%) scale(${1 + p * 0.6})`;
        const next = Math.max(0, Math.min(N - 1, Math.round(camZ / S - OFF)));
        if (next !== idx) setActive((idx = next));
      };

      const st = ScrollTrigger.create({
        trigger: stage,
        start: "top top",
        end: () => `+=${window.innerHeight * 5.5}`,
        pin: true,
        invalidateOnRefresh: true,
        onRefresh: layout,
        onUpdate: (s) => (target = s.progress * (N + OFF) * S),
      });
      target = st.progress * (N + OFF) * S;
      cur = target;
      render(cur);

      // eased camera: glides toward the scroll target every frame
      const tick = () => {
        cur += (target - cur) * 0.085;
        if (Math.abs(cur - last) < 0.05) return;
        last = cur;
        render(cur);
      };
      gsap.ticker.add(tick);

      // subtle pointer tilt of the whole world
      const rx = gsap.quickTo(scene, "rotationX", { duration: 1.2, ease: "power3.out" });
      const ry = gsap.quickTo(scene, "rotationY", { duration: 1.2, ease: "power3.out" });
      const move = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        ry((e.clientX / window.innerWidth - 0.5) * 8);
        rx(-(e.clientY / window.innerHeight - 0.5) * 6);
      };
      stage.addEventListener("pointermove", move);

      return () => {
        gsap.ticker.remove(tick);
        stage.removeEventListener("pointermove", move);
      };
    },
    [flat],
  );

  const close = useCallback(() => {
    setOpen(null);
    getLenis()?.start();
  }, []);
  const show = (i: number) => {
    setOpen(i);
    getLenis()?.stop();
  };
  const step = useCallback((d: number) => setOpen((o) => (o === null ? o : (o + d + PHOTOS.length) % PHOTOS.length)), []);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close, step]);

  const card = (it: Item) => (
    <div className={`group relative overflow-hidden border border-white/10 bg-coal shadow-[0_40px_90px_rgba(0,0,0,.75)] ${ASPECT[it.shape]}`}>
      {it.video ? (
        <LazyVideo src={`${A}/${it.video}`} poster={`${A}/${it.src}`} label={it.alt} className="h-full w-full object-cover" />
      ) : (
        <button type="button" onClick={() => show(PHOTOS.indexOf(it))} className="absolute inset-0 cursor-zoom-in" aria-label={`Open image: ${it.caption}`}>
          <Image src={`${A}/${it.src}`} alt={it.alt} fill sizes="(min-width:768px) 34vw, 70vw" className="object-cover transition duration-[1.2s] ease-out group-hover:scale-110" />
        </button>
      )}
      <span className="pointer-events-none absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 bg-brand transition-transform duration-700 group-hover:scale-x-100" />
      <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
      <span className="pointer-events-none absolute bottom-3 left-3 flex items-center gap-2 font-head text-[0.62rem] uppercase tracking-[0.25em] md:bottom-4 md:left-4 md:text-xs">
        <span className="h-px w-4 bg-brand" />
        {it.caption}
      </span>
    </div>
  );

  return (
    <section ref={ref} id="gallery" className="relative bg-ink">
      {flat ? (
        // reduced motion: calm editorial grid
        <div className="mx-auto max-w-[1440px] px-5 py-28 md:px-10">
          <p className="eyebrow mb-6">Gallery</p>
          <h2 className="display mb-12 text-[clamp(3rem,8vw,7.5rem)]">
            Real floors. <span className="text-brand">Real</span> sweat.
          </h2>
          <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {ITEMS.map((it) => (
              <li key={it.src}>{card(it)}</li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="g-stage relative h-[100svh] overflow-hidden">
          {/* atmosphere */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_45%_40%_at_50%_50%,rgba(237,37,30,.16),transparent_70%)]" />
          <span className="g-bgword pointer-events-none absolute left-1/2 top-1/2 select-none whitespace-nowrap font-display text-[30vw] leading-none text-white/[0.025]" style={{ transform: "translate(-50%,-50%)" }} aria-hidden>
            GOOD LIFE
          </span>

          <div className="absolute inset-0 [perspective:1000px]">
            <div className="g-scene absolute inset-0 [transform-style:preserve-3d]">
              <div className="g-head absolute left-1/2 top-1/2 w-max text-center" style={{ transform: "translate(-50%,-50%)" }}>
                <p className="eyebrow mb-6 justify-center">Gallery</p>
                <h2 className="display text-[clamp(3.5rem,10vw,10rem)]">
                  Real floors.
                  <br />
                  <span className="text-brand">Real</span> sweat.
                </h2>
                <p className="mx-auto mt-6 max-w-sm px-6 text-mist">Every image was captured inside Good Life Fitness Club — no stock photography.</p>
              </div>

              <ul className="absolute inset-0 [transform-style:preserve-3d]">
                {ITEMS.map((it) => (
                  <li key={it.src} className="g-item absolute left-1/2 top-1/2 opacity-0 will-change-transform">
                    {card(it)}
                  </li>
                ))}
              </ul>

              <div className="g-outro absolute left-1/2 top-1/2 w-max text-center opacity-0" style={{ transform: "translate(-50%,-50%)" }}>
                <h3 className="display text-[clamp(3rem,8vw,8rem)]">
                  See it <span className="text-brand">in person.</span>
                </h3>
                <a
                  href={whatsapp("Hi! I'd like to book a visit to Good Life Fitness Club.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary mt-8"
                >
                  Book a visit
                </a>
              </div>
            </div>
          </div>

          {/* HUD */}
          <div className="pointer-events-none absolute bottom-6 left-5 right-24 flex items-end justify-between md:bottom-10 md:left-10 md:right-32">
            <div className="font-head uppercase">
              <p className="text-[0.6rem] tracking-[0.4em] text-mist">Inside the club</p>
              <p key={active} className="mt-2 text-lg tracking-[0.15em] [animation:g-caption_.6s_cubic-bezier(.2,.8,.2,1)] md:text-2xl">
                {ITEMS[active].caption}
              </p>
            </div>
            <p className="font-display text-4xl leading-none md:text-6xl">
              <span className="text-brand">{String(active + 1).padStart(2, "0")}</span>
              <span className="text-white/30"> / {String(N).padStart(2, "0")}</span>
            </p>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-[2px] bg-white/10">
            <span className="g-bar block h-full origin-left scale-x-0 bg-brand shadow-[0_0_12px_rgba(237,37,30,.8)]" />
          </div>
        </div>
      )}

      {open !== null && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/95 p-4 backdrop-blur" role="dialog" aria-modal="true" aria-label={PHOTOS[open].caption} onClick={close}>
          <div className="relative h-[82vh] w-full max-w-6xl" onClick={(e) => e.stopPropagation()}>
            <Image src={`${A}/${PHOTOS[open].src}`} alt={PHOTOS[open].alt} fill sizes="100vw" className="object-contain" />
          </div>
          <p className="absolute bottom-6 left-1/2 -translate-x-1/2 font-head text-xs uppercase tracking-[0.3em] text-white/70">
            {PHOTOS[open].caption} · {open + 1}/{PHOTOS.length}
          </p>
          {(
            [
              ["Previous image", -1, "left-2 md:left-8", "M10 2 4 8l6 6"],
              ["Next image", 1, "right-2 md:right-8", "M6 2l6 6-6 6"],
            ] as const
          ).map(([label, d, pos, path]) => (
            <button
              key={label}
              type="button"
              aria-label={label}
              onClick={(e) => (e.stopPropagation(), step(d))}
              className={`absolute top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/20 transition hover:border-brand hover:bg-brand ${pos}`}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d={path} stroke="currentColor" strokeWidth="1.6" />
              </svg>
            </button>
          ))}
          <button type="button" onClick={close} aria-label="Close gallery" autoFocus className="absolute right-4 top-4 grid h-12 w-12 place-items-center text-3xl leading-none text-white/80 hover:text-brand md:right-8 md:top-8">
            ×
          </button>
        </div>
      )}
    </section>
  );
}
