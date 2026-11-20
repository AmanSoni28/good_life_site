"use client";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import LazyVideo from "./LazyVideo";
import { getLenis, gsap, reduced, useGsap } from "@/lib/motion";
import { A, whatsapp } from "@/lib/site";

type Item = { src: string; alt: string; caption: string; video?: string };

// Only authentic club media.
const ITEMS: Item[] = [
  { src: "cardio-area.jpg", alt: "Cardio floor with treadmills and blue lighting", caption: "Cardio floor" },
  { src: "turf-area.jpg", alt: "Covered turf zone with battle ropes and plyo boxes", caption: "Turf zone" },
  { src: "stills/stair-climber.jpg", alt: "Member on the stair climber by the windows", caption: "Stair climber" },
  { src: "videos/strength-machines.jpg", video: "videos/strength-machines.mp4", alt: "Strength machines and plate loading", caption: "Strength zone" },
  { src: "floors.png", alt: "Good Life Fitness Club facade lit up at night", caption: "After dark" },
  { src: "stills/entrance.jpg", alt: "The neon-lit entrance to the gym", caption: "The entrance" },
  { src: "stills/battle-ropes.jpg", alt: "Member training with battle ropes", caption: "Battle ropes" },
  { src: "stills/chest-press.jpg", alt: "Member training on a strength machine", caption: "Machines" },
  { src: "member-progress.jpg", alt: "Member checking progress in the mirror", caption: "Progress" },
  { src: "building.png", alt: "The full Good Life Fitness Club building", caption: "Three floors" },
];
const N = ITEMS.length;
const PHOTOS = ITEMS.filter((i) => !i.video);
const pad = (n: number) => String(n).padStart(2, "0");

const brass = "bg-[linear-gradient(135deg,#f7e7bd_0%,#c9a45c_32%,#8a6a2f_58%,#e9d199_82%,#a8823f_100%)]";
// perforated, speaker-grille style vent
const grille = (
  <span className="relative h-[15%] w-[62%] rounded-[4px] border border-[#c9a45c]/25 bg-[#070707] bg-[radial-gradient(circle,rgba(201,164,92,.22)_1px,transparent_1.4px)] [background-size:6px_6px] shadow-[inset_0_2px_8px_rgba(0,0,0,1)]" />
);

export default function GymGallery() {
  const ref = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<number | null>(null);
  const [flat, setFlat] = useState(false);
  const [active, setActive] = useState(0);

  useEffect(() => setFlat(reduced()), []);

  useGsap(
    ref,
    () => {
      if (flat) return;
      const q = gsap.utils.selector(ref);
      const track = q(".s-track")[0];
      const bar = q(".s-bar")[0];
      const dist = () => track.scrollWidth - window.innerWidth;
      let idx = 0;

      // the whole line of lockers glides left while pinned; 0.55px of scroll per px moved keeps it short
      const move = gsap.to(track, {
        x: () => -dist(),
        ease: "none",
        scrollTrigger: {
          trigger: q(".s-stage")[0],
          start: "top top",
          end: () => `+=${dist() * 0.55}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (s) => {
            bar.style.transform = `scaleX(${s.progress})`;
            const next = Math.round(s.progress * (N - 1));
            if (next !== idx) setActive((idx = next));
          },
        },
      });

      // each locker swings into the line as it reaches the right edge, then unlocks and opens before centre
      q(".s-slide").forEach((slide) => {
        const s = gsap.utils.selector(slide);
        const at = (start: string, end: string) => ({ trigger: slide, containerAnimation: move, start, end, scrub: true });
        gsap.fromTo(s(".s-text"), { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, scrollTrigger: at("left 66%", "left 54%") });
        if (!slide.querySelector(".s-locker")) return; // the closing CTA card
        gsap.fromTo(s(".s-locker"), { yPercent: 25, z: -500, rotateY: -70, autoAlpha: 0 }, { yPercent: 0, z: 0, rotateY: 0, autoAlpha: 1, ease: "power3.out", scrollTrigger: at("left 108%", "left 84%") });
        gsap.to(s(".s-dial"), { rotate: 270, ease: "power2.inOut", scrollTrigger: at("left 88%", "left 80%") });
        gsap.to(s(".s-led"), { backgroundColor: "#ffffff", boxShadow: "0 0 12px 4px rgba(255,255,255,.8)", scrollTrigger: at("left 81%", "left 79%") });
        gsap.to(s(".s-door"), { rotateY: -118, ease: "power2.inOut", scrollTrigger: at("left 80%", "left 58%") });
        gsap.fromTo(s(".s-inside"), { scale: 1.2, filter: "brightness(.15)" }, { scale: 1, filter: "brightness(1)", scrollTrigger: at("left 78%", "left 56%") });
        gsap.to(s(".s-light"), { keyframes: [{ opacity: 0.8 }, { opacity: 0.1 }, { opacity: 1 }, { opacity: 0.4 }, { opacity: 1 }], scrollTrigger: at("left 70%", "left 58%") });
      });
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

  const media = (it: Item, sizes: string) =>
    it.video ? (
      <LazyVideo src={`${A}/${it.video}`} poster={`${A}/${it.src}`} label={it.alt} className="h-full w-full object-cover" />
    ) : (
      <button type="button" onClick={() => show(PHOTOS.indexOf(it))} className="absolute inset-0 cursor-zoom-in" aria-label={`Open image: ${it.caption}`}>
        <Image src={`${A}/${it.src}`} alt={it.alt} fill sizes={sizes} className="object-cover" />
      </button>
    );

  const locker = (it: Item, i: number) => (
    <div className="s-locker relative aspect-[5/7] h-[min(46svh,420px)] rounded-[18px] border border-[#c9a45c]/25 bg-[linear-gradient(160deg,#1f1f1f,#080808_55%,#121212)] p-[10px] shadow-[0_60px_120px_-30px_rgba(0,0,0,1),0_0_90px_-25px_rgba(237,37,30,.35),inset_0_1px_0_rgba(247,231,189,.18)] [perspective:1400px] [transform-style:preserve-3d] will-change-transform md:h-[min(56svh,480px)]">
      {/* brass crown strip */}
      <span className={`absolute inset-x-8 -top-px h-[2px] rounded-full ${brass}`} />
      {/* interior */}
      <div className="relative h-full w-full overflow-hidden rounded-[10px] bg-black shadow-[inset_0_0_60px_rgba(0,0,0,1)]">
        <div className="s-inside absolute inset-0 will-change-transform">{media(it, "(min-width:768px) 40vw, 80vw")}</div>
        <span className="s-light pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgba(255,255,255,.35),transparent_70%)] opacity-0 mix-blend-soft-light" />
        <span className="s-light pointer-events-none absolute inset-x-[10%] top-[6px] h-[3px] rounded-full bg-white opacity-0 shadow-[0_0_20px_6px_rgba(255,255,255,.5)]" />
        <span className="pointer-events-none absolute inset-0 shadow-[inset_0_0_80px_rgba(0,0,0,.85)]" />
      </div>

      {/* door */}
      <div className="s-door pointer-events-none absolute inset-[10px] origin-left [transform-style:preserve-3d] will-change-transform" aria-hidden>
        <div className="absolute inset-0 flex flex-col items-center justify-between overflow-hidden rounded-[10px] border border-white/[0.06] bg-[linear-gradient(115deg,#1d1d1d_0%,#0d0d0d_40%,#171717_55%,#0a0a0a_100%)] py-[8%] shadow-[inset_0_1px_0_rgba(255,255,255,.1),inset_0_-30px_50px_rgba(0,0,0,.6)] [backface-visibility:hidden]">
          {/* brushed texture + diagonal sheen */}
          <span className="absolute inset-0 bg-[repeating-linear-gradient(90deg,rgba(255,255,255,.018)_0_1px,transparent_1px_3px)]" />
          <span className="absolute -inset-1/2 rotate-12 bg-[linear-gradient(90deg,transparent_40%,rgba(255,255,255,.05)_50%,transparent_60%)]" />
          {/* brass pinstripe frame */}
          <span className="absolute inset-[6%] rounded-[6px] border border-[#c9a45c]/30 shadow-[inset_0_0_30px_rgba(0,0,0,.7)]" />
          <span className="absolute inset-[7.5%] rounded-[4px] border border-[#c9a45c]/10" />
          {/* hinges */}
          <span className={`absolute left-0 top-[14%] h-[9%] w-[4px] rounded-r ${brass}`} />
          <span className={`absolute bottom-[14%] left-0 h-[9%] w-[4px] rounded-r ${brass}`} />

          <span className="relative flex flex-col items-center gap-1">
            <span className={`${brass} bg-clip-text font-display text-xl leading-none tracking-[0.3em] text-transparent`}>GL</span>
            <span className={`h-px w-8 ${brass}`} />
          </span>
          {grille}
          {/* engraved brass nameplate */}
          <span className={`relative rounded-[3px] ${brass} px-5 py-1.5 text-center text-[#2a1c06] shadow-[0_8px_16px_rgba(0,0,0,.8),inset_0_1px_0_rgba(255,250,230,.8),inset_0_-1px_0_rgba(0,0,0,.35)]`}>
            <span className="block font-head text-[0.5rem] uppercase tracking-[0.45em] opacity-80">Locker</span>
            <span className="block font-display text-4xl leading-none tracking-wider [text-shadow:0_1px_0_rgba(255,240,200,.6)]">{pad(i + 1)}</span>
          </span>
          {/* brass dial + bar pull */}
          <span className="absolute right-[11%] top-1/2 flex -translate-y-1/2 flex-col items-center gap-3">
            <span className="s-led h-1.5 w-1.5 rounded-full bg-brand shadow-[0_0_10px_3px_rgba(237,37,30,.8)]" />
            <span className={`grid h-11 w-11 place-items-center rounded-full ${brass} shadow-[0_8px_16px_rgba(0,0,0,.85),inset_0_1px_0_rgba(255,250,230,.8)]`}>
              <span className="s-dial relative grid h-8 w-8 place-items-center rounded-full bg-[conic-gradient(from_0deg,#0c0c0c,#262626,#0c0c0c,#262626,#0c0c0c)] ring-1 ring-black">
                <span className="absolute top-[3px] h-2 w-[2px] rounded bg-[#e9d199]" />
                <span className={`h-2 w-2 rounded-full ${brass}`} />
              </span>
            </span>
            <span className="flex flex-col items-center">
              <span className={`h-2 w-3 rounded-sm ${brass}`} />
              <span className={`h-16 w-[7px] rounded-full ${brass} shadow-[0_6px_14px_rgba(0,0,0,.85)]`} />
              <span className={`h-2 w-3 rounded-sm ${brass}`} />
            </span>
          </span>
          <span className="relative font-head text-[0.5rem] uppercase tracking-[0.5em] text-[#c9a45c]/60">Members only</span>
          {grille}
        </div>
        {/* door thickness, visible mid-swing */}
        <div className="absolute inset-y-0 right-0 w-[12px] origin-right bg-[linear-gradient(90deg,#0a0a0a,#2b2b2b)] [transform:rotateY(-90deg)]" />
        {/* inside face */}
        <div className="absolute inset-0 rounded-[10px] bg-[linear-gradient(90deg,#0c0c0c,#1d1d1d)] [backface-visibility:hidden] [transform:rotateY(180deg)]" />
      </div>
    </div>
  );

  return (
    <section ref={ref} id="gallery" className="relative overflow-hidden bg-ink">
      {flat ? (
        // reduced motion: calm grid, no doors
        <div className="mx-auto max-w-[1300px] px-5 py-28">
          <h2 className="display mb-12 text-center text-[clamp(2.75rem,6vw,5.5rem)]">
            Real floors. <span className="text-brand">Real</span> sweat.
          </h2>
          <ul className="grid grid-cols-2 gap-3 md:grid-cols-5">
            {ITEMS.map((it) => (
              <li key={it.src} className="relative aspect-[4/5] overflow-hidden rounded-lg border border-white/10">
                {media(it, "(min-width:768px) 20vw, 50vw")}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="s-stage relative h-[100svh]">
          {/* atmosphere: spotlight cone + floor reflection */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_35%_60%_at_50%_0%,rgba(255,255,255,.07),transparent_70%),radial-gradient(ellipse_50%_35%_at_50%_85%,rgba(237,37,30,.14),transparent_70%)]" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[22%] bg-gradient-to-t from-black to-transparent" />

          <div className="absolute inset-x-0 top-[5svh] z-20 px-5 text-center">
            <p className="flex items-center justify-center gap-4 font-head text-[0.65rem] uppercase tracking-[0.45em] text-mist">
              <span className="h-px w-10 bg-brand" />
              The Locker Room
              <span className="h-px w-10 bg-brand" />
            </p>
            <h2 className="display mt-2 text-[clamp(1.75rem,3.5vw,3rem)] tracking-[0.04em]">
              Real floors. <span className="text-brand">Real</span> sweat.
            </h2>
          </div>

          {/* one line of lockers; pl = 100vw so the first one swings in from the right edge */}
          <ul className="s-track relative z-10 flex h-full w-max items-center gap-10 pl-[100vw] pr-[12vw] pt-[9svh] will-change-transform md:gap-16">
            {ITEMS.map((it, i) => (
              <li key={it.src} className="s-slide flex flex-col items-center [perspective:1400px]">
                <div className="relative">
                  {locker(it, i)}
                  <span className="pointer-events-none absolute -bottom-5 inset-x-4 h-6 rounded-[50%] bg-black/90 blur-xl" aria-hidden />
                </div>
                <div className="s-text mt-5 flex items-center gap-3 font-head text-[0.65rem] uppercase tracking-[0.35em] opacity-0 md:text-xs">
                  <span className="text-brand">{pad(i + 1)}</span>
                  <span className="h-px w-5 bg-white/30" />
                  <span className="text-white/85">{it.caption}</span>
                </div>
              </li>
            ))}
            <li className="s-slide flex w-[min(78vw,460px)] flex-col items-start gap-6">
              <div className="s-text opacity-0">
                <p className="font-head text-[0.65rem] uppercase tracking-[0.45em] text-mist">10 lockers · 3 floors</p>
                <p className="display mt-3 text-[clamp(2.75rem,5vw,4.5rem)]">
                  See it <span className="text-brand">in person.</span>
                </p>
                <a href={whatsapp("Hi! I'd like to book a visit to Good Life Fitness Club.")} target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-6">
                  Book a visit
                </a>
              </div>
            </li>
          </ul>

          {/* locker rail */}
          <div className="pointer-events-none absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 gap-2" aria-hidden>
            {ITEMS.map((it, i) => (
              <span key={it.src} className={`h-[3px] rounded-full transition-all duration-500 ${i === active ? "w-8 bg-brand shadow-[0_0_10px_rgba(237,37,30,.8)]" : i < active ? "w-3 bg-white/50" : "w-3 bg-white/15"}`} />
            ))}
          </div>
          <div className="absolute inset-x-0 bottom-0 h-px bg-white/5">
            <span className="s-bar block h-full origin-left scale-x-0 bg-brand/60" />
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
