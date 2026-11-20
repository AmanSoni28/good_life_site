"use client";
import Image from "next/image";
import { useRef } from "react";
import LazyVideo from "./LazyVideo";
import { gsap, onIntroDone, reduced, scrollToHash, useGsap } from "@/lib/motion";
import { A } from "@/lib/site";

const BADGE = "GOOD LIFE • FITNESS CLUB • UNISEX GYM • ";
const TICKER = ["Train Hard", "Stay Strong", "Live Better", "Strength", "Cardio", "Functional Turf", "Personal Training"];

// Per-letter spans for the 3D reveal; the h1 carries the readable text via aria-label.
const letters = (s: string, cls = "") =>
  [...s].map((c, i) => (
    <span key={i} className={`h-ch inline-block ${cls}`} style={cls ? { animationDelay: `${i * 0.07}s` } : undefined}>
      {c === " " ? " " : c}
    </span>
  ));

export default function HeroSection() {
  const ref = useRef<HTMLElement>(null);

  useGsap(ref, () => {
    if (reduced()) return;
    const tl = gsap.timeline({ paused: true });
    tl.fromTo(".h-frame", { clipPath: "inset(49% 0% 49% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.6, ease: "expo.inOut" }, 0)
      .from(".h-img", { scale: 1.45, duration: 2.6, ease: "expo.out" }, 0.2)
      .from(".h-ch", { yPercent: 120, rotateX: -95, opacity: 0, transformOrigin: "50% 100%", duration: 1.3, stagger: 0.035, ease: "power4.out" }, 0.9)
      .from(".h-rule", { scaleX: 0, transformOrigin: "left", duration: 1.2, ease: "expo.inOut" }, 1.2)
      .from(".h-fade", { y: 30, opacity: 0, filter: "blur(8px)", duration: 1, stagger: 0.1, ease: "power3.out" }, 1.4)
      .from(".h-hud", { opacity: 0, duration: 1.2, stagger: 0.1 }, 1.6)
      .from(".h-ticker", { yPercent: 100, duration: 1.1, ease: "expo.out" }, 1.5)
      .from(".h-card", { opacity: 0, y: 120, rotationY: -40, duration: 1.6, ease: "expo.out" }, 1.3)
      .from(".h-badge", { opacity: 0, scale: 0.5, rotation: -120, duration: 1.6, ease: "expo.out" }, 1.6);
    const off = onIntroDone(() => tl.play());

    // scroll: the photo shrinks into a framed window while the copy drifts away
    const st = { trigger: ref.current, start: "top top", end: "bottom top", scrub: true };
    gsap.fromTo(".h-img", { clipPath: "inset(0% 0% 0% 0% round 0px)" }, { clipPath: "inset(6% 4% 10% 4% round 28px)", ease: "none", scrollTrigger: st });
    gsap.to(".h-img-inner", { yPercent: 14, ease: "none", scrollTrigger: st });
    gsap.to(".h-content", { yPercent: -25, opacity: 0, ease: "none", scrollTrigger: st });
    gsap.to(".h-card", { yPercent: -40, ease: "none", scrollTrigger: st });

    // pointer: red spotlight follows the cursor, layers drift in parallax (fine pointers only)
    if (!matchMedia("(pointer: fine)").matches) return off;
    const el = ref.current!;
    const imgX = gsap.quickTo(".h-img-inner", "x", { duration: 1.2, ease: "power3" });
    const imgY = gsap.quickTo(".h-img-inner", "y", { duration: 1.2, ease: "power3" });
    const txtX = gsap.quickTo(".h-title", "x", { duration: 1.4, ease: "power3" });
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - r.left) / r.width - 0.5;
      const dy = (e.clientY - r.top) / r.height - 0.5;
      imgX(dx * -30);
      imgY(dy * -20);
      txtX(dx * 18);
      gsap.to(el, { "--mx": `${e.clientX - r.left}px`, "--my": `${e.clientY - r.top}px`, duration: 0.8, ease: "power3" });
    };
    el.addEventListener("pointermove", move);
    return () => {
      off();
      el.removeEventListener("pointermove", move);
    };
  });

  return (
    <section
      ref={ref}
      id="home"
      className="grain relative flex h-[100svh] min-h-[700px] items-end overflow-hidden bg-ink [--mx:70%] [--my:35%]"
    >
      {/* background photograph (real cardio floor), opened like a camera aperture */}
      <div className="h-frame absolute inset-0">
        <div className="h-img absolute inset-0 overflow-hidden">
          <div className="h-img-inner absolute -inset-[6%]">
            <Image
              src={`${A}/cardio-area.jpg`}
              alt="The Good Life Fitness Club cardio floor with treadmills under blue lighting"
              fill
              priority
              sizes="100vw"
              className="object-cover object-[50%_62%] [animation:kenburns_22s_ease-in-out_infinite_alternate]"
            />
          </div>
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,8,8,.94)_0%,rgba(8,8,8,.62)_45%,rgba(8,8,8,.2)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(0deg,#080808_0%,rgba(8,8,8,0)_50%,rgba(8,8,8,.6)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(520px_circle_at_var(--mx)_var(--my),rgba(237,37,30,.22),transparent_65%)] mix-blend-screen" />
        </div>
      </div>

      {/* light streaks + frame lines */}
      <div className="pointer-events-none absolute inset-0 z-[2] overflow-hidden" aria-hidden>
        <span className="absolute left-0 top-[28%] h-px w-[35vw] bg-gradient-to-r from-transparent via-brand to-transparent [animation:streak_7s_linear_infinite]" />
        <span className="absolute left-0 top-[63%] h-px w-[25vw] bg-gradient-to-r from-transparent via-white/60 to-transparent [animation:streak_9s_linear_2.5s_infinite]" />
        <span className="absolute left-0 top-[81%] h-px w-[40vw] bg-gradient-to-r from-transparent via-brand/70 to-transparent [animation:streak_11s_linear_5s_infinite]" />
        <span className="h-hud absolute inset-x-5 top-24 hidden h-px bg-white/10 md:block md:inset-x-10" />
      </div>

      {/* side HUD — desktop only */}
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 hidden w-16 flex-col items-center justify-center gap-6 xl:flex" aria-hidden>
        <span className="h-hud font-head text-[0.6rem] uppercase tracking-[0.5em] text-white/50 [writing-mode:vertical-rl]">
          Strength · Cardio · Turf
        </span>
        <span className="h-hud h-20 w-px bg-gradient-to-b from-brand to-transparent" />
      </div>
      <div className="pointer-events-none absolute left-10 top-1/2 z-10 hidden -translate-y-1/2 flex-col gap-4 font-head text-[0.65rem] tracking-[0.3em] text-white/40 xl:flex" aria-hidden>
        {["01", "02", "03"].map((n, i) => (
          <span key={n} className="h-hud flex items-center gap-3">
            <span className={`h-px ${i === 0 ? "w-8 bg-brand" : "w-4 bg-white/30"}`} />
            <span className={i === 0 ? "text-white" : ""}>{n}</span>
          </span>
        ))}
      </div>

      <div className="h-content relative z-10 mx-auto w-full px-5 pb-32 md:px-10 md:pb-36 xl:pl-24">
        <p className="h-fade eyebrow mb-6">Unisex gym · Three floors</p>
        <h1 aria-label="Build your stronger self." className="h-title display text-[clamp(3.6rem,14vw,13rem)] [perspective:900px]">
          <span aria-hidden className="block overflow-hidden pb-[0.05em]">
            <span className="block">{letters("Build your", "metal")}</span>
          </span>
          <span aria-hidden className="block overflow-hidden pb-[0.05em]">
            <span className="block">
              <span className="outline-text">{letters("Stronger")}</span>
              {letters(" ")}
              <span className="text-brand [text-shadow:0_0_40px_rgba(237,37,30,.55)]">{letters("self.")}</span>
            </span>
          </span>
        </h1>
        <div className="mt-7 flex items-center gap-5">
          <span className="h-rule block h-[2px] w-24 bg-gradient-to-r from-brand to-brand/0" />
          <p className="h-fade font-head text-base uppercase tracking-[0.3em] text-white/85 md:text-lg">
            Train Hard. Stay Strong. Live Better.
          </p>
        </div>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
          <a href="#floors" onClick={(e) => (e.preventDefault(), scrollToHash("#floors"))} className="h-fade btn btn-primary btn-sheen shadow-[0_0_40px_rgba(237,37,30,.35)]">
            Explore the gym
            <svg width="16" height="10" viewBox="0 0 16 10" fill="none" aria-hidden>
              <path d="M0 5h14M10 1l4 4-4 4" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </a>
          <a href="#contact" onClick={(e) => (e.preventDefault(), scrollToHash("#contact"))} className="h-fade btn btn-ghost backdrop-blur-sm">
            Join the club
          </a>
        </div>
      </div>

      {/* floating "step inside" walkthrough card — desktop only */}
      <div className="pointer-events-none absolute bottom-[20vh] right-[7vw] z-10 hidden [perspective:1000px] lg:block">
        <figure className="h-card pointer-events-auto relative aspect-[9/16] w-[min(18vw,280px,27vh)] overflow-hidden rounded-sm border border-white/15 shadow-[0_40px_100px_rgba(0,0,0,.8),0_0_60px_rgba(237,37,30,.15)] transition-transform duration-700 [transform:rotateY(-14deg)] hover:[transform:rotateY(0deg)_scale(1.03)]">
          <LazyVideo
            src={`${A}/videos/walkthrough.mp4`}
            poster={`${A}/videos/walkthrough.jpg`}
            label="Walking into Good Life Fitness Club"
            className="h-full w-full object-cover"
          />
          <span className="absolute inset-x-0 top-0 h-[3px] bg-brand" />
          <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-4 pt-12 font-head text-[0.7rem] uppercase tracking-[0.3em]">
            <span className="mr-2 inline-block h-2 w-2 animate-pulse rounded-full bg-brand align-middle" />
            Step inside
          </figcaption>
        </figure>
        {/* rotating brand badge */}
        <div className="h-badge absolute -left-20 -top-16 h-36 w-36">
          <svg viewBox="0 0 200 200" className="h-full w-full [animation:spin-slow_18s_linear_infinite]" aria-hidden>
            <defs>
              <path id="badge-circle" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
            </defs>
            <text fill="#fff" fontSize="15.5" letterSpacing="3.2" fontFamily="var(--font-oswald)">
              <textPath href="#badge-circle">{BADGE}</textPath>
            </text>
          </svg>
          <span className="absolute inset-0 m-auto h-3 w-3 rounded-full bg-brand shadow-[0_0_20px_#ed251e]" />
        </div>
      </div>

      {/* infinite ticker */}
      <div className="h-ticker absolute inset-x-0 bottom-0 z-10 overflow-hidden border-t border-white/10 bg-black/50 py-3 backdrop-blur-md" aria-hidden>
        <div className="flex w-max [animation:marquee_32s_linear_infinite]">
          {[0, 1].map((k) => (
            <div key={k} className="flex shrink-0 items-center">
              {TICKER.map((t) => (
                <span key={t} className="flex items-center font-display text-xl tracking-[0.15em] text-white/80 md:text-2xl">
                  <span className="px-6 md:px-8">{t}</span>
                  <span className="text-brand">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
