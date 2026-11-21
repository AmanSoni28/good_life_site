"use client";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "@/lib/motion";
import { A } from "@/lib/site";

/*
 * Cinematic intro. The athletes and chain are pixel-exact cut-outs of the supplied logo
 * (public/assets/good-life/intro/*.png), placed at their exact logo coordinates, so the final
 * composition lines up 1:1 with the real logo before it crossfades in.
 */
const L = 4096; // logo.png is 4096x4096
const box = (x0: number, y0: number, x1: number, y1: number) => ({
  left: `${(x0 / L) * 100}%`,
  top: `${(y0 / L) * 100}%`,
  width: `${((x1 - x0) / L) * 100}%`,
  height: `${((y1 - y0) / L) * 100}%`,
});
const MALE = box(1436, 525, 2064, 1555);
const FEMALE = box(2046, 592, 2518, 1393);
const CHAIN = box(1360, 1385, 2764, 1780);
const RING = (3997 - 98) / L; // white ring diameter as a fraction of the logo square
const GHOSTS = 3;

// energy / heartbeat wave, centred spike, tapering to flat at the edges
const WAVE = (() => {
  let d = "M0 60";
  for (let x = 4; x <= 1200; x += 4) {
    const c = Math.abs(x - 600) / 600;
    const env = Math.max(0, 1 - c) ** 2;
    let y = 60 + Math.sin(x * 0.11) * Math.sin(x * 0.017) * 22 * env;
    if (x > 560 && x < 640) y = 60 + Math.sin(((x - 560) / 80) * Math.PI * 3) * 46 * (1 - Math.abs(x - 600) / 40) ;
    d += ` L${x} ${y.toFixed(1)}`;
  }
  return d;
})();

export default function IntroAnimation() {
  const [run, setRun] = useState(0);
  const [active, setActive] = useState(true);
  useEffect(() => {
    const replay = () => {
      setActive(true);
      setRun((r) => r + 1);
    };
    window.addEventListener("gl:replay-intro", replay);
    return () => window.removeEventListener("gl:replay-intro", replay);
  }, []);
  const done = useCallback(() => setActive(false), []);
  return active ? <IntroPlayer key={run} onDone={done} /> : null;
}

function IntroPlayer({ onDone }: { onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const announced = useRef(false);

  const announce = useCallback(() => {
    if (announced.current) return;
    announced.current = true;
    window.dispatchEvent(new Event("gl:intro-done"));
  }, []);

  const finish = useCallback(() => {
    announce();
    document.documentElement.dataset.intro = "done";
    try {
      sessionStorage.setItem("gl-intro", "1");
    } catch {}
    onDone();
  }, [announce, onDone]);

  const skip = useCallback(() => {
    tl.current?.kill();
    announce();
    gsap.to(root.current, { opacity: 0, duration: 0.45, ease: "power2.out", onComplete: finish });
  }, [announce, finish]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && skip();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [skip]);

  useLayoutEffect(() => {
    if (document.documentElement.dataset.intro !== "playing") {
      onDone();
      return;
    }
    const el = root.current!;
    const lite = window.matchMedia("(max-width: 767px)").matches;
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(el);
      const stage = q(".i-stage")[0] as HTMLElement;
      const S = stage.offsetWidth;
      const vw = window.innerWidth;
      const F = q(".i-f") as HTMLElement[]; // [main, ...ghosts]
      const M = q(".i-m") as HTMLElement[];
      const wave = el.querySelector<SVGPathElement>(".i-wave path")!;
      const len = wave.getTotalLength();
      const ghostOpacity = (i: number) => (i === 0 ? 1 : 0.3 - i * 0.08);

      gsap.set(F, { x: -0.32 * S - vw * 0.7, rotationY: 60, opacity: 0, filter: "blur(14px)", scale: 1.12 });
      gsap.set(M, { x: 0.3 * S + vw * 0.7, y: -0.1 * S, rotationY: -60, rotation: -6, opacity: 0, filter: "blur(14px)", scale: 1.15 });
      gsap.set(".i-chain", { clipPath: "inset(0% 50% 0% 50%)", opacity: 0 });
      gsap.set(".i-logo", { opacity: 0, clipPath: "circle(0% at 50% 27%)" });
      gsap.set(".i-edge", { opacity: 0 });
      // camera starts close on the athletes (figures sit ~27% down the logo), pulls back for the reveal
      const Z = lite ? 1.45 : 1.85;
      gsap.set(".i-cam", { rotationY: -16, rotationX: 9, scale: Z, y: 0.23 * S * Z });
      gsap.set(wave, { strokeDasharray: len, strokeDashoffset: len });

      const t = gsap.timeline({ defaults: { ease: "power3.out" }, onComplete: finish });
      tl.current = t;

      // SCENE 1 — darkness, atmosphere, red light sweep, energy wave
      t.to(".i-glow", { opacity: 1, duration: 1.6, ease: "sine.inOut" }, 0)
        .fromTo(".i-sweep", { scaleX: 0 }, { scaleX: 1, duration: 0.7, ease: "power2.inOut" }, 0.3)
        .to(".i-sweep", { xPercent: 100, opacity: 0, duration: 0.6, ease: "power2.in" }, 1.0)
        .to(".i-wave", { opacity: 0.9, duration: 0.4 }, 0.5)
        .to(wave, { strokeDashoffset: 0, duration: 1.3, ease: "power1.inOut" }, 0.5)

        // SCENE 2 — female athlete enters from the left (glide, motion trail)
        .to(F, { x: -0.32 * S, rotationY: 0, rotation: 0, opacity: ghostOpacity, filter: "blur(0px)", scale: 1, duration: 1.15, ease: "expo.out", stagger: 0.07 }, 1.35)
        .fromTo(".i-streak-w", { xPercent: -110, opacity: 1 }, { xPercent: 260, opacity: 0, duration: 0.9, ease: "power2.out" }, 1.3)
        .to(F.slice(1), { opacity: 0, duration: 0.4 }, 2.35)

        // SCENE 3 — male athlete drops in from the right (heavier, impact landing)
        .to(M, { x: 0.3 * S, y: 0, rotationY: 0, rotation: 0, opacity: ghostOpacity, filter: "blur(0px)", scale: 1, duration: 0.95, ease: "power4.out", stagger: 0.06 }, 2.25)
        .fromTo(".i-streak-r", { xPercent: 260, opacity: 1 }, { xPercent: -110, opacity: 0, duration: 0.9, ease: "power2.out" }, 2.2)
        .to(M[0], { scaleY: 0.94, scaleX: 1.04, transformOrigin: "50% 100%", duration: 0.1, ease: "power2.in" }, 3.0)
        .to(M[0], { scaleY: 1, scaleX: 1, duration: 0.55, ease: "elastic.out(1,0.4)" }, 3.1)
        .to(".i-cam", { x: "+=6", yoyo: true, repeat: 5, duration: 0.04, ease: "none" }, 3.0)
        .to(M.slice(1), { opacity: 0, duration: 0.35 }, 3.05)

        // SCENE 4 — they charge, cross and lock back-to-back
        .set([...F.slice(1), ...M.slice(1)], { opacity: (i) => 0.24 - (i % GHOSTS) * 0.07 }, 3.65)
        .to(F, { x: 0, duration: 0.8, ease: "power3.inOut", stagger: 0.05 }, 3.65)
        .to(M, { x: 0, duration: 0.8, ease: "power3.inOut", stagger: 0.05 }, 3.65)
        .fromTo(".i-streak-w", { xPercent: -110, opacity: 1 }, { xPercent: 260, opacity: 0, duration: 0.7, ease: "power2.inOut" }, 3.7)
        .fromTo(".i-streak-r", { xPercent: 260, opacity: 1 }, { xPercent: -110, opacity: 0, duration: 0.7, ease: "power2.inOut" }, 3.7)
        .fromTo(".i-flash", { opacity: 0 }, { opacity: 0.45, duration: 0.08, yoyo: true, repeat: 1, ease: "none" }, 4.02)
        .to([...F.slice(1), ...M.slice(1)], { opacity: 0, duration: 0.3 }, 4.45)
        .fromTo(".i-ring", { scale: 0.2, opacity: 0.9 }, { scale: 3, opacity: 0, duration: 1.1, ease: "power2.out" }, 4.4)
        .to(".i-chain", { clipPath: "inset(0% 0% 0% 0%)", opacity: 1, duration: 0.7, ease: "power2.out" }, 4.4)
        .to(".i-cam", { y: "+=5", yoyo: true, repeat: 3, duration: 0.04, ease: "none" }, 4.4)

        // SCENE 5 — exact logo reveal: 3D medallion, camera push, red light + metallic sheen
        .to(".i-logo", { opacity: 1, clipPath: "circle(75% at 50% 27%)", duration: 1.1, ease: "power2.inOut" }, 4.9)
        .to(".i-edge", { opacity: 1, duration: 0.6 }, 5.0)
        .to(".i-cam", { rotationY: 0, rotationX: 0, scale: 0.94, y: 0, duration: 1.3, ease: "power3.inOut" }, 4.65)
        .to(".i-cam", { scale: 1.04, duration: 1.0, ease: "power1.out" }, 5.95)
        .fromTo(".i-redsweep", { xPercent: -160, opacity: 0 }, { xPercent: 160, opacity: 1, duration: 1.4, ease: "power2.inOut" }, 5.0)
        .fromTo(".i-sheen", { xPercent: -130 }, { xPercent: 130, duration: 1.1, ease: "power2.inOut" }, 5.5)
        .to(".i-figs", { opacity: 0, duration: 0.3 }, 6.05)
        .to(".i-wave", { opacity: 0, duration: 0.6 }, 5.7)

        // SCENE 6 — logo flies into the navbar while the darkness irises open onto the hero
        .add(announce, 6.5)
        .to(".i-edge", { opacity: 0, duration: 0.4 }, 6.55)
        .to(
          ".i-cam",
          {
            x: () => target().x,
            y: () => target().y,
            scale: () => target().s,
            duration: 1.05,
            ease: "power3.inOut",
          },
          6.55,
        )
        .to(el, { "--hole": `${Math.hypot(window.innerWidth, window.innerHeight)}px`, duration: 1.1, ease: "power2.inOut" }, 6.6)
        .to([".i-glow", ".i-skip"], { opacity: 0, duration: 0.6 }, 6.6);

      function target() {
        const nav = document.getElementById("nav-logo")?.getBoundingClientRect();
        const r = stage.getBoundingClientRect();
        if (!nav) return { x: 0, y: -window.innerHeight, s: 0.2 };
        return {
          x: nav.left + nav.width / 2 - (r.left + r.width / 2),
          y: nav.top + nav.height / 2 - (r.top + r.height / 2),
          s: nav.width / (S * RING),
        };
      }

      t.timeScale(lite ? 1.75 : 1.5); // ~5s desktop, ~4.4s mobile
    }, el);
    return () => ctx.revert();
  }, [announce, finish, onDone]);

  const fig = (src: string, pos: React.CSSProperties, cls: string, i: number) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      key={`${cls}${i}`}
      src={src}
      alt=""
      draggable={false}
      className={`${cls} absolute max-w-none select-none ${i ? "i-ghost max-md:hidden" : ""}`}
      style={{ ...pos, zIndex: i ? 0 : 2 }}
    />
  );

  return (
    <div
      ref={root}
      className="intro fixed inset-0 z-[100] overflow-hidden"
      style={{ "--hole": "0px" } as React.CSSProperties}
      aria-label="Good Life Fitness Club intro"
      role="dialog"
      aria-modal="true"
    >
      {/* the darkness: a radial mask whose hole opens to reveal the hero */}
      <div
        className="absolute inset-0 bg-[#050505]"
        style={{
          WebkitMaskImage: "radial-gradient(circle at 50% 50%, transparent var(--hole), #000 calc(var(--hole) + 2px))",
          maskImage: "radial-gradient(circle at 50% 50%, transparent var(--hole), #000 calc(var(--hole) + 2px))",
        }}
      />
      <div className="i-glow pointer-events-none absolute inset-0 opacity-0 [background:radial-gradient(ellipse_55%_45%_at_50%_55%,rgba(237,37,30,.22),transparent_70%),radial-gradient(ellipse_30%_25%_at_50%_45%,rgba(255,255,255,.05),transparent_70%)]" />
      <div className="i-sweep pointer-events-none absolute left-0 top-1/2 h-px w-full origin-left bg-gradient-to-r from-transparent via-brand to-transparent shadow-[0_0_18px_2px_rgba(237,37,30,.8)]" />
      <svg className="i-wave pointer-events-none absolute left-0 top-[60%] h-[120px] w-full -translate-y-1/2 opacity-0" viewBox="0 0 1200 120" preserveAspectRatio="none" aria-hidden>
        <path d={WAVE} fill="none" stroke="#ED251E" strokeWidth="1.6" vectorEffect="non-scaling-stroke" style={{ filter: "drop-shadow(0 0 6px rgba(237,37,30,.9))" }} />
      </svg>
      <div className="i-streak-w pointer-events-none absolute left-0 top-[46%] h-[2px] w-[45vw] bg-gradient-to-r from-transparent via-white to-transparent opacity-0 shadow-[0_0_20px_rgba(255,255,255,.9)]" />
      <div className="i-streak-r pointer-events-none absolute left-0 top-[54%] h-[2px] w-[45vw] bg-gradient-to-r from-transparent via-brand to-transparent opacity-0 shadow-[0_0_20px_rgba(237,37,30,.9)]" />
      <div className="i-redsweep pointer-events-none absolute left-1/4 top-1/2 h-[70vmin] w-1/2 -translate-y-1/2 rounded-full bg-brand/40 opacity-0 blur-[90px]" />

      <div className="absolute inset-0 grid place-items-center [perspective:1200px]">
        <div className="i-stage relative aspect-square w-[min(84vmin,620px)]">
          <div className="i-cam absolute inset-0 [transform-style:preserve-3d]">
            {/* medallion thickness: stacked metallic discs behind the logo */}
            {Array.from({ length: 10 }, (_, i) => (
              <div
                key={i}
                className={`i-edge absolute rounded-full ${i > 4 ? "max-md:hidden" : ""}`}
                style={{
                  inset: `${((1 - RING) / 2) * 100}%`,
                  transform: `translateZ(${-(i + 1) * 2}px)`,
                  background: "linear-gradient(135deg,#8d9196 0%,#2a2b2d 35%,#c8ccd1 55%,#1a1a1a 80%,#6d7075 100%)",
                }}
              />
            ))}
            <div className="i-figs absolute inset-0 [perspective:900px] [transform:translateZ(.5px)] [filter:drop-shadow(0_0_22px_rgba(237,37,30,.35))]">
              {Array.from({ length: GHOSTS + 1 }, (_, i) => fig(`${A}/intro/female.png`, FEMALE, "i-f", i))}
              {Array.from({ length: GHOSTS + 1 }, (_, i) => fig(`${A}/intro/male.png`, MALE, "i-m", i))}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${A}/intro/chain.png`} alt="" className="i-chain absolute max-w-none select-none" style={CHAIN} draggable={false} />
              <div className="i-ring pointer-events-none absolute left-1/2 top-[27%] h-1/2 w-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-brand opacity-0 shadow-[0_0_40px_rgba(237,37,30,.7)]" />
            </div>
            <div className="i-logo absolute inset-0 overflow-hidden [transform:translateZ(1px)]" style={{ clipPath: "circle(0% at 50% 27%)" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${A}/logo.png`} alt="Good Life Fitness Club" className="h-full w-full select-none" style={{ clipPath: `circle(${RING * 50}% at 50% 50%)` }} draggable={false} />
              <div className="absolute rounded-full overflow-hidden mix-blend-overlay" style={{ inset: `${((1 - RING) / 2) * 100}%` }}>
                <div className="i-sheen absolute inset-y-0 -left-1/4 w-[60%] -skew-x-12 bg-gradient-to-r from-transparent via-white/80 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="i-flash pointer-events-none absolute inset-0 bg-white opacity-0" />

      <button
        type="button"
        onClick={skip}
        className="i-skip absolute bottom-6 right-6 z-10 flex min-h-11 items-center gap-3 px-4 font-head text-xs uppercase tracking-[0.3em] text-white/70 transition hover:text-white md:bottom-10 md:right-10"
      >
        Skip intro
        <span className="h-px w-8 bg-brand" aria-hidden />
      </button>
    </div>
  );
}
