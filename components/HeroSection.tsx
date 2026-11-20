"use client";
import Image from "next/image";
import { useRef } from "react";
import LazyVideo from "./LazyVideo";
import { gsap, onIntroDone, reduced, scrollToHash, useGsap } from "@/lib/motion";
import { A } from "@/lib/site";

const BADGE = "GOOD LIFE • FITNESS CLUB • UNISEX GYM • ";

export default function HeroSection() {
  const ref = useRef<HTMLElement>(null);

  useGsap(ref, () => {
    if (reduced()) return;
    const tl = gsap.timeline({ paused: true });
    tl.from(".h-img", { scale: 1.3, opacity: 0, duration: 2.2, ease: "power3.out" }, 0)
      .from(".h-vline", { scaleY: 0, transformOrigin: "top", duration: 1.4, stagger: 0.15, ease: "power3.inOut" }, 0.2)
      .from(".h-rule", { scaleX: 0, transformOrigin: "left", duration: 1, ease: "power3.inOut" }, 0.2)
      .from(".h-line > span", { yPercent: 115, duration: 1.25, ease: "power4.out", stagger: 0.12 }, 0.3)
      .from(".h-fade", { y: 26, opacity: 0, duration: 0.9, stagger: 0.09, ease: "power3.out" }, 0.8)
      .from(".h-card", { opacity: 0, y: 80, rotationY: -35, duration: 1.5, ease: "power3.out" }, 0.7)
      .from(".h-badge", { opacity: 0, scale: 0.6, rotation: -90, duration: 1.4, ease: "power3.out" }, 1);
    const off = onIntroDone(() => tl.play());

    const st = { trigger: ref.current, start: "top top", end: "bottom top", scrub: true };
    gsap.to(".h-img-inner", { yPercent: 14, ease: "none", scrollTrigger: st });
    gsap.to(".h-content", { yPercent: -22, opacity: 0.15, ease: "none", scrollTrigger: st });
    gsap.to(".h-card", { yPercent: -35, ease: "none", scrollTrigger: st });
    return off;
  });

  return (
    <section ref={ref} id="home" className="grain relative flex h-[100svh] min-h-[640px] items-end overflow-hidden bg-ink">
      {/* background photograph (real cardio floor) */}
      <div className="h-img absolute inset-0">
        <div className="h-img-inner absolute -inset-y-[8%] inset-x-0">
          <Image
            src={`${A}/cardio-area.jpg`}
            alt="The Good Life Fitness Club cardio floor with treadmills under blue lighting"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[50%_62%] [animation:kenburns_22s_ease-in-out_infinite_alternate]"
          />
        </div>
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,8,8,.92)_0%,rgba(8,8,8,.6)_45%,rgba(8,8,8,.25)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(0deg,#080808_0%,rgba(8,8,8,0)_45%,rgba(8,8,8,.55)_100%)]" />

      {/* red accent verticals */}
      <div className="pointer-events-none absolute inset-0 mx-auto hidden max-w-[1440px] px-10 md:block" aria-hidden>
        <span className="h-vline absolute left-10 top-0 h-[38%] w-px bg-gradient-to-b from-transparent to-brand" />
        <span className="h-vline absolute bottom-0 right-[34%] h-[30%] w-px bg-gradient-to-t from-transparent to-white/20" />
      </div>

      <div className="h-content relative z-10 mx-auto w-full max-w-[1440px] px-5 pb-24 md:px-10 md:pb-28">
        <p className="h-fade eyebrow mb-6">Unisex gym · Three floors</p>
        <h1 className="display text-[clamp(4rem,15vw,12.5rem)]">
          <span className="h-line line">
            <span>Build your</span>
          </span>
          <span className="h-line line">
            <span>
              Stronger <span className="text-brand">self.</span>
            </span>
          </span>
        </h1>
        <span className="h-rule mt-6 block h-[2px] w-24 bg-brand" />
        <p className="h-fade mt-6 max-w-md font-head text-lg uppercase tracking-[0.2em] text-white/85 md:text-xl">
          Train Hard. Stay Strong. Live Better.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
          <a href="#floors" onClick={(e) => (e.preventDefault(), scrollToHash("#floors"))} className="h-fade btn btn-primary">
            Explore the gym
            <svg width="16" height="10" viewBox="0 0 16 10" fill="none" aria-hidden>
              <path d="M0 5h14M10 1l4 4-4 4" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </a>
          <a href="#contact" onClick={(e) => (e.preventDefault(), scrollToHash("#contact"))} className="h-fade btn btn-ghost">
            Join the club
          </a>
        </div>
      </div>

      {/* floating "step inside" walkthrough card — desktop only */}
      <div className="pointer-events-none absolute bottom-[14vh] right-[6vw] z-10 hidden [perspective:1000px] lg:block">
        <figure className="h-card pointer-events-auto relative aspect-[9/16] w-[min(19vw,290px)] overflow-hidden border border-white/10 shadow-[0_40px_80px_rgba(0,0,0,.7)] [transform:rotateY(-14deg)]">
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
          <span className="absolute inset-0 m-auto h-3 w-3 rounded-full bg-brand" />
        </div>
      </div>

      {/* scroll cue */}
      <div className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex">
        <span className="font-head text-[0.6rem] uppercase tracking-[0.4em] text-white/60">Scroll</span>
        <span className="h-12 w-px overflow-hidden bg-white/15">
          <span className="block h-full w-full bg-brand [animation:scrollcue_2.2s_cubic-bezier(.7,0,.3,1)_infinite]" />
        </span>
      </div>
    </section>
  );
}
