"use client";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { FOCUS } from "@/lib/floors";
import { getLenis, gsap, ScrollTrigger, useGsap } from "@/lib/motion";
import { A, whatsapp } from "@/lib/site";

const BuildingScene = dynamic(() => import("./BuildingScene"), { ssr: false });

// Descriptions stay general on purpose: floor-specific equipment isn't confirmed by the supplied assets.
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

  useEffect(() => {
    setGl(hasWebGL());
    setLite(window.matchMedia("(max-width: 767px)").matches);
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: "200px" });
    io.observe(ref.current!.querySelector(".fl-pin")!);
    return () => io.disconnect();
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

    // intro copy leaves as the building opens up
    tl.to(".fl-intro .line > span", { yPercent: -110, stagger: 0.01, duration: 0.05 }, 0.08)
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
    <section ref={ref} id="floors" className="relative bg-ink">
      <div className="fl-pin relative h-[100svh] overflow-hidden">
        {/* 3D stage */}
        <div className="absolute inset-0">
          {gl && <BuildingScene progress={progress} running={visible} lite={lite} />}
          {gl === false && <Image src={`${A}/building.png`} alt="The Good Life Fitness Club building at dusk" fill sizes="100vw" className="object-contain object-right opacity-70" />}
        </div>

        {/* legibility + cinematic framing */}
        <div className="pointer-events-none absolute inset-0 hidden bg-[linear-gradient(90deg,#080808_0%,rgba(8,8,8,.8)_28%,rgba(8,8,8,0)_58%)] md:block" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-ink via-ink/85 to-transparent md:hidden" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-ink to-transparent" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_60%,rgba(0,0,0,.55)_100%)]" />

        {/* copy column */}
        <div className="absolute inset-x-5 bottom-10 md:inset-x-10 md:bottom-auto md:top-1/2 md:-translate-y-1/2 lg:left-[max(2.5rem,calc((100vw-1440px)/2+2.5rem))] md:max-w-[min(44vw,560px)]">
          <div className="relative">
            <div className="fl-intro">
              <p className="line mb-5"><span><span className="eyebrow">The building</span></span></p>
              <h2 className="display text-[clamp(3rem,7.5vw,7rem)]">
                <span className="line"><span>Three floors.</span></span>
                <span className="line"><span>One <span className="text-brand">fitness</span></span></span>
                <span className="line"><span>destination.</span></span>
              </h2>
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
        <div className="absolute right-4 top-24 flex items-stretch gap-3 md:right-10 md:top-1/2 md:-translate-y-1/2">
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

        <p className="absolute right-4 top-[4.6rem] font-head text-[0.62rem] uppercase tracking-[0.35em] text-white/50 md:right-10 md:top-28" aria-live="polite">
          Floor <span className="text-brand">{floorLabel}</span> / 03
        </p>

        <div className="fl-hint absolute bottom-8 left-1/2 hidden -translate-x-1/2 items-center gap-3 font-head text-[0.62rem] uppercase tracking-[0.4em] text-white/50 md:flex">
          Scroll to explore the building
          <span className="h-8 w-px overflow-hidden bg-white/15">
            <span className="block h-full w-full bg-brand [animation:scrollcue_2.2s_cubic-bezier(.7,0,.3,1)_infinite]" />
          </span>
        </div>
      </div>
    </section>
  );
}
