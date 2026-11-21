"use client";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { FOCUS } from "@/lib/floors";
import { getLenis, gsap, onIntroDone, reduced, ScrollTrigger, useGsap } from "@/lib/motion";
import { A, whatsapp } from "@/lib/site";
import { openJoin } from "./JoinForm";

const BuildingScene = dynamic(() => import("./BuildingScene"), { ssr: false });

// Descriptions stay general on purpose: floor-specific equipment isn't confirmed by the supplied assets.
const MARQUEE = ["Train hard", "Stay strong", "Live better", "No excuses", "Push your limits"];
const CARDS = [
  { pos: "left-[37%] top-[30%]", n: "01", t: "Three training floors", s: "Strength · Cardio · Turf", d: "0s" },
  { pos: "right-[8%] top-[40%]", n: "02", t: "Personal training", s: "One-to-one coaching", d: "-2s" },
  { pos: "right-[6%] bottom-[24%]", n: "03", t: "Modern fitness facilities", s: "Commercial-grade equipment", d: "-4s" },
];

const FLOORS = [
  { n: "01", name: "First Floor", text: "Where the journey begins. The first of three dedicated gym floors, marked on the street by our Unisex Gym signage and floor-to-ceiling glass." },
  { n: "02", name: "Second Floor", text: "The middle of the stack — a second full training level behind a wall of glass, glowing over the street after dark." },
  { n: "03", name: "Third Floor", text: "The top of the building and the top of your game. The third training level crowns the Good Life Fitness Club experience." },
];

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export default function ThreeFloorExperience() {
  const ref = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const st = useRef<ScrollTrigger | null>(null);
  const [active, setActive] = useState(-1);
  const [visible, setVisible] = useState(false);
  const [gl, setGl] = useState<boolean | null>(null);
  const [lite, setLite] = useState(false);
  const ready = useRef(false); // building assembles only once the intro has handed over

  useEffect(() => {
    setGl(hasWebGL());
    setLite(window.matchMedia("(max-width: 767px)").matches);
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: "200px" });
    io.observe(ref.current!.querySelector(".fl-pin")!);
    const off = onIntroDone(() => (ready.current = true));
    return () => {
      io.disconnect();
      off();
    };
  }, []);

  useGsap(ref, () => {
    const root = ref.current!;
    const fill = root.querySelector<HTMLElement>(".fl-fill")!;
    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: ".fl-pin",
        start: "top top",
        end: () => `+=${window.innerHeight * 3.6}`,
        pin: true,
        scrub: 0.6,
        invalidateOnRefresh: true,
        onUpdate: (s) => {
          const p = s.progress;
          progress.current = p;
          fill.style.transform = `scaleY(${p})`;
          setActive(p < 0.13 ? -1 : p < 0.4 ? 0 : p < 0.67 ? 1 : p < 0.9 ? 2 : 3);
        },
      },
    });
    st.current = tl.scrollTrigger ?? null;

    // hero copy assembles after the intro (inner .fl-in layer, so it never fights the scrubbed exit)
    let off = () => {};
    if (!reduced()) {
      const enter = gsap.timeline({ paused: true });
      enter
        .from(".fl-in", { yPercent: 115, duration: 1.3, stagger: 0.09, ease: "expo.out" }, 0.2)
        .from(".fl-in-fade", { y: 24, opacity: 0, duration: 1, stagger: 0.1, ease: "power3.out" }, 0.7)
        .from(".fl-draw", { scaleX: 0, transformOrigin: "left", duration: 1.4, ease: "expo.inOut", stagger: 0.15 }, 0.8)
        .from(".fl-chrome", { opacity: 0, duration: 1.2, stagger: 0.1 }, 1)
        .from(".fl-card", { y: 30, opacity: 0, duration: 1.2, stagger: 0.15, ease: "power3.out" }, 1.3);
      const count = root.querySelector<HTMLElement>(".fl-count");
      const n = { v: 0 };
      if (count) enter.to(n, { v: 3, duration: 1.4, ease: "power2.out", onUpdate: () => void (count.textContent = String(Math.round(n.v)).padStart(2, "0")) }, 0.9);
      off = onIntroDone(() => enter.play());
    }

    // hero copy leaves as the building opens up
    tl.to(".fl-intro .line > span", { yPercent: -110, stagger: 0.01, duration: 0.05 }, 0.07)
      .to(".fl-intro .fl-in-fade", { y: -30, opacity: 0, stagger: 0.008, duration: 0.04 }, 0.05)
      .to(".fl-intro", { autoAlpha: 0, duration: 0.02 }, 0.13)
      .to(".fl-hint", { autoAlpha: 0, duration: 0.03 }, 0.02);

    // each floor's copy: masked lines rise in, red fill wipes across the numeral, then everything exits up
    gsap.utils.toArray<HTMLElement>(".fl-panel").forEach((panel, i) => {
      const c = FOCUS[i];
      const lines = panel.querySelectorAll(".line > span");
      tl.set(panel, { autoAlpha: 1 }, c - 0.12)
        .fromTo(lines, { yPercent: 110 }, { yPercent: 0, stagger: 0.012, duration: 0.05 }, c - 0.12)
        .fromTo(panel.querySelector(".fl-num-fill"), { clipPath: "inset(0% 100% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.06 }, c - 0.08)
        .fromTo(panel.querySelector(".fl-rule"), { scaleX: 0 }, { scaleX: 1, duration: 0.06 }, c - 0.09)
        .to(lines, { yPercent: -110, stagger: 0.006, duration: 0.04 }, c + 0.09)
        .set(panel, { autoAlpha: 0 }, c + 0.135);
    });

    tl.set(".fl-outro", { autoAlpha: 1 }, 0.9)
      .fromTo(".fl-outro .line > span", { yPercent: 110 }, { yPercent: 0, stagger: 0.015, duration: 0.06 }, 0.9)
      .set({}, {}, 1);
    return off;
  });

  const jump = (i: number) => {
    const s = st.current;
    if (!s) return;
    const y = s.start + (s.end - s.start) * FOCUS[i];
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(y, { duration: 1.6 });
    else window.scrollTo({ top: y });
  };

  const floorLabel = active >= 0 && active < 3 ? FLOORS[active].n : active === 3 ? "ALL" : "—";

  return (
    <section ref={ref} id="home" className="relative bg-ink">
      <div className="fl-pin relative h-[100svh] overflow-hidden">
        {/* 3D stage */}
        <div className="absolute inset-0">
          {gl && <BuildingScene progress={progress} running={visible} lite={lite} ready={ready} />}
          {gl === false && <Image src={`${A}/building.jpg`} alt="The Good Life Fitness Club building at dusk" fill priority sizes="100vw" className="object-contain object-right opacity-70" />}
        </div>

        {/* gold corner marks frame the hero like a gallery piece */}
        <div className="fl-hint fl-chrome pointer-events-none absolute inset-6 top-24 hidden md:block lg:inset-10 lg:top-28" aria-hidden>
          {["left-0 top-0 border-l border-t", "right-0 top-0 border-r border-t", "bottom-0 left-0 border-b border-l", "bottom-0 right-0 border-b border-r"].map((c) => (
            <span key={c} className={`absolute h-6 w-6 border-gold/40 ${c}`} />
          ))}
        </div>

        {/* fitness marquee anchors the bottom of the hero */}
        <div className="fl-hint fl-chrome absolute inset-x-0 bottom-0 z-10 hidden overflow-hidden border-t border-gold/20 bg-[linear-gradient(180deg,rgba(8,8,8,.6),#080808)] py-3.5 [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)] md:block" aria-hidden>
          <div className="flex w-max [animation:marquee_45s_linear_infinite]">
            {[0, 1].map((k) => (
              <div key={k} className="flex shrink-0 items-center">
                {[...MARQUEE, ...MARQUEE].map((t, i) => (
                  <span key={i} className="flex items-center font-display text-xl uppercase tracking-[0.2em]">
                    <span className={`px-8 ${i % 2 ? "text-transparent [-webkit-text-stroke:1px_rgba(233,209,153,.55)]" : "text-white/75"}`}>{t}</span>
                    <span className="h-1.5 w-1.5 rotate-45 bg-brand shadow-[0_0_10px_rgba(237,37,30,.9)]" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* floating glass info cards around the building (large screens) */}
        {CARDS.map((c) => (
          <div key={c.n} className={`fl-hint fl-chrome pointer-events-none absolute z-10 hidden lg:block ${c.pos}`} aria-hidden>
            <div className="fl-card [animation:float_7s_ease-in-out_infinite]" style={{ animationDelay: c.d }}>
              <div className="relative flex items-center gap-4 overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 shadow-[0_20px_50px_-15px_rgba(0,0,0,.9)] backdrop-blur-sm">
                <span className="absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-gold/70 to-transparent" />
                <span className="relative grid h-9 w-9 shrink-0 place-items-center rounded-full border border-gold/40 font-head text-[0.6rem] tracking-[0.15em] text-gold-light">
                  {c.n}
                  <span className="absolute -right-0.5 -top-0.5 h-2 w-2 animate-pulse rounded-full bg-brand shadow-[0_0_8px_#ed251e]" />
                </span>
                <span>
                  <span className="block font-head text-[0.7rem] uppercase tracking-[0.25em] text-white">{c.t}</span>
                  <span className="mt-0.5 block text-[0.7rem] text-white/50">{c.s}</span>
                </span>
              </div>
            </div>
          </div>
        ))}

        {/* light: drifting gold beams from above + warm glow behind the copy */}
        <div className="fl-chrome pointer-events-none absolute inset-0 overflow-hidden mix-blend-screen" aria-hidden>
          {[
            { left: "48%", w: "16vw", r: "18deg", d: "0s" },
            { left: "62%", w: "9vw", r: "24deg", d: "-4s" },
            { left: "74%", w: "13vw", r: "30deg", d: "-8s" },
          ].map((b) => (
            <span
              key={b.left}
              className="absolute -top-[30%] h-[150%] origin-top bg-[linear-gradient(90deg,transparent,rgba(233,209,153,.09)_50%,transparent)] [mask-image:linear-gradient(180deg,#000,transparent_85%)] will-change-transform [animation:beam_14s_ease-in-out_infinite]"
              style={{ left: b.left, width: b.w, animationDelay: b.d, "--r": b.r } as React.CSSProperties}
            />
          ))}
          <span className="absolute -left-[10%] top-[10%] h-[80%] w-[55%] bg-[radial-gradient(closest-side,rgba(201,164,92,.09),transparent)]" />
          <span className="absolute right-[5%] top-0 h-[45%] w-[50%] bg-[radial-gradient(closest-side,rgba(255,192,122,.08),transparent)]" />
          <span className="absolute left-[38%] top-[8%] h-[85%] w-[58%] bg-[radial-gradient(closest-side,rgba(255,220,180,.06),transparent)]" />
          <span className="absolute bottom-[-15%] left-[35%] h-[45%] w-[65%] bg-[radial-gradient(closest-side,rgba(237,37,30,.16),transparent)]" />
        </div>

        {/* legibility + cinematic framing */}
        <div className="pointer-events-none absolute inset-0 hidden bg-[linear-gradient(90deg,#080808_0%,rgba(8,8,8,.8)_28%,rgba(8,8,8,0)_58%)] md:block" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-ink via-ink/85 to-transparent md:hidden" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-ink to-transparent" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_60%,rgba(0,0,0,.55)_100%)]" />

        {/* copy column */}
        <div className="absolute inset-x-5 bottom-10 md:inset-x-10 md:bottom-auto md:top-1/2 md:-translate-y-1/2 lg:left-10 md:max-w-[min(44vw,560px)]">
          <div className="relative">
            <div className="fl-intro">
              <p className="line mb-5"><span><span className="fl-in block"><span className="eyebrow">Good Life Fitness Club · Unisex gym</span></span></span></p>
              <h1 aria-label="Three floors. One fitness destination." className="display whitespace-nowrap text-[clamp(2.75rem,5.4vw,5.75rem)]">
                <span aria-hidden className="line"><span><span className="fl-in block metal">Three floors.</span></span></span>
                <span aria-hidden className="line"><span><span className="fl-in block">One <span className="text-brand [text-shadow:0_0_40px_rgba(237,37,30,.45)]">fitness</span></span></span></span>
                <span aria-hidden className="line"><span><span className="fl-in block metal">destination.</span></span></span>
              </h1>
              <div className="fl-in-fade mt-6 flex items-center gap-4">
                <span className="fl-draw h-px w-14 shrink-0 bg-gradient-to-r from-gold to-transparent" />
                <p className="font-head text-xs uppercase tracking-[0.3em] text-champagne md:text-[0.8rem]">Train Hard. Stay Strong. Live Better.</p>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <button type="button" onClick={openJoin} aria-haspopup="dialog" className="fl-in-fade btn btn-primary btn-sheen">
                  Join the club
                </button>
                <button type="button" onClick={() => jump(0)} className="fl-in-fade btn btn-ghost">
                  Explore the floors
                  <svg width="10" height="16" viewBox="0 0 10 16" fill="none" aria-hidden>
                    <path d="M5 0v14M1 10l4 4 4-4" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </button>
              </div>
              <dl className="relative mt-10 hidden max-w-md grid-cols-3 gap-6 pt-5 md:grid">
                <span className="fl-draw absolute inset-x-0 top-0 h-px bg-gradient-to-r from-gold/50 via-gold/20 to-transparent" />
                {[
                  ["03", "Training floors"],
                  ["Unisex", "Fitness club"],
                  ["1:1", "Personal training"],
                ].map(([v, k], i) => (
                  <div key={k} className="group cursor-default">
                    <dt className="sr-only">{k}</dt>
                    <dd className="line">
                      <span>
                        <span className={`fl-in block font-display text-3xl tracking-wide text-white transition-colors duration-500 group-hover:text-gold-light ${i === 0 ? "fl-count" : ""}`}>{v}</span>
                      </span>
                    </dd>
                    <dd className="fl-in-fade mt-1 font-head text-[0.6rem] uppercase tracking-[0.3em] text-mist">{k}</dd>
                    <dd className="mt-2 h-px w-4 bg-brand transition-all duration-500 group-hover:w-full group-hover:bg-gold" aria-hidden />
                  </div>
                ))}
              </dl>
              {/* heartbeat trace: cardio-monitor pulse under the stats */}
              <div className="fl-in-fade mt-8 hidden max-w-md items-center gap-4 md:flex" aria-hidden>
                <svg viewBox="0 0 240 40" className="h-9 flex-1 overflow-visible" fill="none" preserveAspectRatio="none">
                  <path d="M0 20h70l8-12 10 26 10-34 9 30 6-10h45l6-6 6 6h60" stroke="rgba(255,255,255,.08)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
                  <path
                    d="M0 20h70l8-12 10 26 10-34 9 30 6-10h45l6-6 6 6h60"
                    pathLength={100}
                    stroke="#ed251e"
                    strokeWidth="2"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                    className="[animation:ecg_2.4s_linear_infinite] [filter:drop-shadow(0_0_6px_rgba(237,37,30,.9))] [stroke-dasharray:22_100]"
                  />
                </svg>
                <span className="flex shrink-0 items-center gap-2 font-head text-[0.6rem] uppercase tracking-[0.3em] text-mist">
                  <svg width="14" height="12" viewBox="0 0 24 21" className="fill-brand [animation:heartbeat_1.2s_ease-in-out_infinite]">
                    <path d="M12 21 1.8 10.8A6 6 0 0 1 12 2.5a6 6 0 0 1 10.2 8.3z" />
                  </svg>
                  Feel the pulse
                </span>
              </div>
            </div>

            {FLOORS.map((f) => (
              <article key={f.n} className="fl-panel invisible absolute inset-x-0 bottom-0 md:bottom-auto md:top-1/2 md:-translate-y-1/2" aria-label={f.name}>
                <div className="line">
                  <span className="relative block font-display text-[clamp(6rem,15vw,12rem)] leading-[0.8]">
                    <span className="outline-text">{f.n}</span>
                    <span className="fl-num-fill absolute inset-0 text-brand [text-shadow:0_0_40px_rgba(237,37,30,.45)]">{f.n}</span>
                  </span>
                </div>
                <h3 className="display mt-3 text-[clamp(2.6rem,5vw,4.5rem)]">
                  <span className="line"><span>{f.name}</span></span>
                </h3>
                <span className="fl-rule mt-4 block h-[2px] w-16 origin-left bg-brand" />
                <p className="line mt-4"><span className="font-head text-xs uppercase tracking-[0.35em] text-mist">Gym level {f.n} · Good Life Fitness Club</span></p>
                <p className="line mt-4"><span className="max-w-md text-base leading-relaxed text-white/80 md:text-lg">{f.text}</span></p>
              </article>
            ))}

            <div className="fl-outro invisible absolute inset-x-0 bottom-0 md:bottom-auto md:top-1/2 md:-translate-y-1/2">
              <h3 className="display text-[clamp(3rem,7vw,6.5rem)]">
                <span className="line"><span>Three floors.</span></span>
                <span className="line"><span className="text-brand">One club.</span></span>
              </h3>
              <p className="line mt-6">
                <span>
                  <a
                    href={whatsapp("Hi! Could you tell me what's on each floor of Good Life Fitness Club?")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-ghost"
                  >
                    Ask what&apos;s on each floor
                  </a>
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* progress rail + floor selector */}
        <div className="fl-chrome absolute right-4 top-24 flex items-stretch gap-3 md:right-10 md:top-1/2 md:-translate-y-1/2">
          <div className="flex flex-col-reverse justify-between gap-2" role="group" aria-label="Jump to a floor">
            {FLOORS.map((f, i) => (
              <button
                key={f.n}
                type="button"
                onClick={() => jump(i)}
                aria-pressed={active === i}
                className={`flex min-h-11 min-w-11 items-center justify-end gap-2 font-head text-xs tracking-[0.25em] transition ${active === i ? "text-white" : "text-white/40 hover:text-white/80"}`}
              >
                <span className={`hidden h-px bg-brand transition-all duration-500 md:block ${active === i ? "w-6" : "w-0"}`} />
                {f.n}
              </button>
            ))}
          </div>
          <div className="relative w-px bg-white/15">
            <span className="fl-fill absolute inset-0 origin-bottom bg-brand shadow-[0_0_10px_rgba(237,37,30,.8)]" style={{ transform: "scaleY(0)" }} />
          </div>
        </div>

        <p className={`absolute right-4 top-[4.6rem] font-head text-[0.62rem] uppercase tracking-[0.35em] text-white/50 transition-opacity duration-500 md:right-10 md:top-28 ${active < 0 ? "opacity-0" : ""}`} aria-live="polite">
          Floor <span className="text-brand">{floorLabel}</span> / 03
        </p>

        <button
          type="button"
          onClick={() => jump(0)}
          className="fl-hint fl-chrome group absolute bottom-20 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-3 font-head text-[0.58rem] uppercase tracking-[0.45em] text-white/50 transition-colors hover:text-gold-light md:flex"
        >
          <span className="relative flex h-10 w-6 justify-center rounded-full border border-white/25 pt-2 transition-colors group-hover:border-gold">
            <span className="h-1.5 w-[2px] rounded-full bg-brand [animation:scrolldot_1.8s_ease-in-out_infinite]" />
          </span>
          Scroll to explore
        </button>
      </div>
    </section>
  );
}
