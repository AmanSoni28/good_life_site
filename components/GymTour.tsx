"use client";
import { useEffect, useRef, useState } from "react";
import { gsap, reduced, useGsap } from "@/lib/motion";
import { A } from "@/lib/site";

const SRC = `${A}/videos/gym-tour.mp4`;
// Zones match the supplied cardio / strength / turf footage; kept general on purpose.
const STOPS = [
  { n: "01", t: "Cardio zone", s: "Treadmills, bikes & climbers", side: "left-[6%] top-[22%]" },
  { n: "02", t: "Strength floor", s: "Machines & free weights", side: "right-[6%] top-[42%]" },
  { n: "03", t: "Functional turf", s: "Sleds, ropes & conditioning", side: "left-[8%] bottom-[18%]" },
];

const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

export default function GymTour() {
  const ref = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const time = useRef<HTMLSpanElement>(null);
  const userPaused = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);

  // load + play only while the section is on screen
  useEffect(() => {
    const v = video.current!;
    userPaused.current = reduced();
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          if (!v.getAttribute("src")) v.src = SRC;
          if (!userPaused.current) v.play().catch(() => {});
        } else v.pause();
      },
      { rootMargin: "200px" },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  useGsap(ref, () => {
    if (reduced()) return;
    const card = ref.current!.querySelector<HTMLElement>(".gt-card")!;
    const half = () => card.offsetWidth / 2;
    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: { trigger: ".gt-pin", start: "top top", end: () => `+=${window.innerHeight * 2.4}`, pin: true, scrub: 0.8, invalidateOnRefresh: true },
    });

    // card rises out of the floor in 3D and settles; giant title splits around it
    tl.fromTo(".gt-card", { scale: 0.66, rotateX: 22, yPercent: 14 }, { scale: 1, rotateX: 0, yPercent: 0, duration: 0.35, ease: "power2.out" }, 0)
      .fromTo(".gt-frame", { opacity: 0, scale: 1.08 }, { opacity: 1, scale: 1, duration: 0.2 }, 0.15)
      // words start as one centred line and part to rest just outside the card's edges (final spots are set in CSS)
      .fromTo(".gt-word-a", { x: () => half() }, { x: 0, duration: 0.45 }, 0)
      .fromTo(".gt-word-b", { x: () => -half() }, { x: 0, duration: 0.45 }, 0)
      .fromTo(".gt-words", { opacity: 1 }, { opacity: 0.3, duration: 0.3 }, 0.15)
      .from(".gt-hud", { opacity: 0, scale: 1.15, duration: 0.1, stagger: 0.02 }, 0.28)
      .fromTo(".gt-halo", { scale: 0.75 }, { scale: 1.15, duration: 0.5 }, 0);

    // tour stops land one by one: card slides in, connector line draws toward the video
    gsap.utils.toArray<HTMLElement>(".gt-stop").forEach((el, i) => {
      const at = 0.4 + i * 0.18;
      tl.from(el, { opacity: 0, x: el.dataset.dir === "r" ? 60 : -60, duration: 0.1, ease: "power3.out" }, at).from(el.querySelector(".gt-wire"), { scaleX: 0, duration: 0.08 }, at + 0.05);
    });

    tl.fromTo(".gt-bar", { scaleX: 0 }, { scaleX: 1, duration: 1 }, 0);
  });

  const togglePlay = () => {
    const v = video.current!;
    if (!v.getAttribute("src")) v.src = SRC;
    userPaused.current = !v.paused;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  };

  const toggleSound = () => {
    const v = video.current!;
    v.muted = !v.muted;
    setMuted(v.muted);
    if (!v.muted && v.paused) togglePlay();
  };

  return (
    <section ref={ref} id="tour" className="relative bg-ink" aria-labelledby="tour-title">
      <div className="gt-pin grain relative flex h-[100svh] items-center justify-center overflow-hidden [perspective:1400px]">
        {/* warm lounge lighting: gold room glow, golden halo, light shafts from above */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_45%,#1d160b_0%,#0d0b08_55%,#080808_100%)]" aria-hidden />
        <div className="gt-halo pointer-events-none absolute left-1/2 top-1/2 h-[75vh] w-[75vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(233,209,153,.22),rgba(201,164,92,.08)_55%,transparent)]" aria-hidden />
        <div className="pointer-events-none absolute inset-0 overflow-hidden mix-blend-screen" aria-hidden>
          {[
            { left: "30%", w: "14vw", r: "-14deg", d: "0s" },
            { left: "46%", w: "8vw", r: "4deg", d: "-5s" },
            { left: "60%", w: "12vw", r: "16deg", d: "-9s" },
          ].map((b) => (
            <span
              key={b.left}
              className="absolute -top-[25%] h-[140%] origin-top bg-[linear-gradient(90deg,transparent,rgba(233,209,153,.08)_50%,transparent)] [mask-image:linear-gradient(180deg,#000,transparent_80%)] [animation:beam_16s_ease-in-out_infinite]"
              style={{ left: b.left, width: b.w, animationDelay: b.d, "--r": b.r } as React.CSSProperties}
            />
          ))}
        </div>
        {/* drifting gold dust */}
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          {[[12, 30, 0], [22, 68, -2], [31, 18, -4], [40, 82, -1], [58, 24, -3], [66, 74, -5], [74, 40, -2], [83, 62, -6], [90, 22, -1], [8, 80, -3], [50, 12, -4], [36, 50, -6]].map(([x, y, d], i) => (
            <span
              key={i}
              className="absolute rounded-full bg-gold-light shadow-[0_0_8px_rgba(233,209,153,.9)] [animation:float_6s_ease-in-out_infinite]"
              style={{ left: `${x}%`, top: `${y}%`, width: i % 3 ? 2 : 3, height: i % 3 ? 2 : 3, opacity: i % 2 ? 0.35 : 0.6, animationDelay: `${d}s` }}
            />
          ))}
        </div>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(0,0,0,.8)_100%)]" aria-hidden />

        {/* giant gold-leaf title behind the video */}
        {/* --cw mirrors the card width below so each word can rest just outside its frame */}
        <h2
          id="tour-title"
          aria-label="Gym tour"
          className="gt-words display pointer-events-none absolute inset-0 whitespace-nowrap text-[clamp(4.5rem,13vw,14rem)] tracking-[0.06em]"
          style={{ "--cw": "calc(min(66svh, 150vw) * 476 / 850)" } as React.CSSProperties}
        >
          <span aria-hidden className="gt-word-a gold-metal absolute top-1/2 -mt-[0.44em]" style={{ right: "calc(50% + var(--cw) / 2 + 2.5vw)" }}>
            Gym
          </span>
          <span aria-hidden className="gt-word-b absolute top-1/2 -mt-[0.44em] text-transparent [-webkit-text-stroke:1px_rgba(233,209,153,.6)]" style={{ left: "calc(50% + var(--cw) / 2 + 2.5vw)" }}>
            Tour
          </span>
        </h2>

        <div className="absolute inset-x-0 top-24 flex flex-col items-center gap-3 md:top-28">
          <p className="eyebrow whitespace-nowrap">Step inside the club</p>
          <p className="font-head text-[0.6rem] uppercase tracking-[0.5em] text-white/40">A private walkthrough</p>
        </div>

        {/* the video card */}
        <div className="gt-card relative z-10 h-[min(66svh,150vw)] [aspect-ratio:476/850] will-change-transform">
          {/* double gold hairline frame, like a framed piece in a gallery */}
          <div className="gt-frame pointer-events-none absolute -inset-3 rounded-[30px] border border-gold/35 md:-inset-4" aria-hidden>
            <span className="absolute -inset-2 rounded-[36px] border border-gold/15" />
            {["-left-1 -top-1", "-right-1 -top-1", "-bottom-1 -left-1", "-bottom-1 -right-1"].map((c) => (
              <span key={c} className={`absolute h-2 w-2 rotate-45 bg-gold-light shadow-[0_0_10px_rgba(233,209,153,.9)] ${c}`} />
            ))}
          </div>
          {/* soft gold reflection on the floor */}
          <div className="pointer-events-none absolute -bottom-14 left-1/2 h-16 w-[140%] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,rgba(233,209,153,.28),transparent)] blur-md" aria-hidden />
          <div className="absolute inset-0 overflow-hidden rounded-[22px] border border-gold/40 bg-coal shadow-[0_50px_120px_-20px_rgba(0,0,0,.95),0_0_90px_-10px_rgba(201,164,92,.45)]">
            <video
              ref={video}
              muted
              loop
              playsInline
              preload="none"
              aria-label="Walkthrough tour of Good Life Fitness Club"
              className="h-full w-full object-cover"
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              onTimeUpdate={(e) => time.current && (time.current.textContent = fmt(e.currentTarget.currentTime))}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40" />

            {/* camera viewfinder HUD */}
            {["left-3 top-3 border-l-2 border-t-2", "right-3 top-3 border-r-2 border-t-2", "bottom-3 left-3 border-b-2 border-l-2", "bottom-3 right-3 border-b-2 border-r-2"].map((c) => (
              <span key={c} className={`gt-hud pointer-events-none absolute h-5 w-5 border-gold/80 ${c}`} aria-hidden />
            ))}
            <div className="gt-hud pointer-events-none absolute inset-x-6 top-5 flex items-center justify-between font-head text-[0.6rem] uppercase tracking-[0.3em] text-white/85" aria-hidden>
              <span className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full bg-brand shadow-[0_0_8px_#ed251e] ${playing ? "animate-pulse" : "opacity-40"}`} />
                {playing ? "Rec" : "Paused"}
              </span>
              <span>
                <span ref={time}>00:00</span> / 00:34
              </span>
            </div>
          </div>

          {/* controls */}
          <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 gap-2">
            <button
              type="button"
              onClick={togglePlay}
              aria-label={playing ? "Pause gym tour" : "Play gym tour"}
              className="grid h-11 w-11 place-items-center rounded-full border border-white/30 bg-black/50 backdrop-blur-sm transition hover:border-brand hover:bg-brand"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden>
                {playing ? (
                  <>
                    <rect x="2" y="1" width="3.5" height="12" />
                    <rect x="8.5" y="1" width="3.5" height="12" />
                  </>
                ) : (
                  <path d="M3 1.5v11l9-5.5z" />
                )}
              </svg>
            </button>
            <button
              type="button"
              onClick={toggleSound}
              aria-pressed={!muted}
              className="flex h-11 items-center gap-2 rounded-full border border-white/30 bg-black/50 px-4 font-head text-[0.6rem] uppercase tracking-[0.25em] backdrop-blur-sm transition hover:border-brand hover:bg-brand"
            >
              <svg width="16" height="14" viewBox="0 0 16 14" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                <path d="M1 5h3l4-3.5v11L4 9H1z" fill="currentColor" />
                {muted ? <path d="M11 4.5l4 5M15 4.5l-4 5" /> : <path d="M11 4a4 4 0 0 1 0 6M13 2a7 7 0 0 1 0 10" />}
              </svg>
              {muted ? "Sound on" : "Sound off"}
            </button>
          </div>
        </div>

        {/* tour stops around the card (large screens) */}
        {STOPS.map((s, i) => (
          <div key={s.n} data-dir={i % 2 ? "r" : "l"} className={`gt-stop absolute z-10 hidden items-center gap-4 lg:flex ${s.side} ${i % 2 ? "flex-row-reverse text-right" : ""}`}>
            <div className="relative rounded-xl border border-gold/20 bg-[linear-gradient(135deg,rgba(233,209,153,.07),rgba(255,255,255,.02))] px-5 py-4 shadow-[0_20px_50px_-15px_rgba(0,0,0,.9)] backdrop-blur-sm">
              <span className="absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-gold/70 to-transparent" aria-hidden />
              <p className="gold-metal font-display text-4xl leading-none">{s.n}</p>
              <p className="mt-2 font-head text-xs uppercase tracking-[0.3em] text-white">{s.t}</p>
              <p className="mt-1 text-xs text-white/50">{s.s}</p>
            </div>
            <span className={`gt-wire h-px w-[6vw] from-gold/70 to-transparent ${i % 2 ? "origin-right bg-gradient-to-l" : "origin-left bg-gradient-to-r"}`} aria-hidden />
          </div>
        ))}

        {/* scroll progress */}
        <div className="absolute inset-x-[10%] bottom-8 flex items-center gap-4 font-head text-[0.55rem] uppercase tracking-[0.4em] text-gold/70" aria-hidden>
          <span className="hidden md:inline">Good Life Fitness Club</span>
          <span className="relative h-px flex-1 bg-white/10">
            <span className="gt-bar absolute inset-0 origin-left bg-gradient-to-r from-gold/40 via-gold-light to-gold shadow-[0_0_10px_rgba(233,209,153,.7)]" />
          </span>
          <span className="hidden md:inline">Three floors</span>
        </div>
      </div>
    </section>
  );
}
