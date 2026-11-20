"use client";
import Image from "next/image";
import { useRef } from "react";
import LazyVideo from "./LazyVideo";
import { gsap, reduced, useGsap } from "@/lib/motion";
import { A } from "@/lib/site";

const V = (name: string) => ({ src: `${A}/videos/${name}.mp4`, poster: `${A}/videos/${name}.jpg` });

export default function VideoExperience() {
  const ref = useRef<HTMLElement>(null);

  useGsap(ref, () => {
    if (reduced()) return;
    const st = { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true };
    gsap.fromTo(".v-main", { scale: 0.8, clipPath: "inset(8% 8% 8% 8% round 24px)" }, { scale: 1, clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "none", scrollTrigger: { trigger: ref.current, start: "top 85%", end: "center center", scrub: true } });
    gsap.fromTo(".v-side-a", { yPercent: 25 }, { yPercent: -25, ease: "none", scrollTrigger: st });
    gsap.fromTo(".v-side-b", { yPercent: -10 }, { yPercent: 35, ease: "none", scrollTrigger: st });
    gsap.fromTo(".v-word-a", { xPercent: -30 }, { xPercent: 10, ease: "none", scrollTrigger: st });
    gsap.fromTo(".v-word-b", { xPercent: 30 }, { xPercent: -10, ease: "none", scrollTrigger: st });
  });

  return (
    <section ref={ref} className="grain relative overflow-hidden bg-black py-28 md:py-40" aria-labelledby="video-title">
      <Image src={`${A}/videos/training-montage.jpg`} alt="" fill sizes="100vw" className="scale-110 object-cover opacity-25 blur-2xl" aria-hidden />
      <div className="absolute inset-0 bg-gradient-to-b from-ink via-black/70 to-ink" />

      <h2 id="video-title" className="display pointer-events-none relative z-20 text-center text-[clamp(4.5rem,17vw,16rem)] mix-blend-difference">
        <span className="v-word-a block">Feel the</span>
        <span className="v-word-b -mt-[0.12em] block text-brand mix-blend-normal">energy.</span>
      </h2>

      <div className="relative z-10 mx-auto -mt-[6vw] flex max-w-[1300px] items-center justify-center gap-6 px-5 md:gap-10">
        <div className="v-side-a relative hidden aspect-[9/16] w-[17vw] max-w-[230px] overflow-hidden opacity-70 lg:block">
          <LazyVideo {...V("women-cardio")} label="Cardio and core training at Good Life" className="h-full w-full object-cover" />
        </div>
        <div className="v-main relative aspect-[9/16] w-[min(82vw,400px)] overflow-hidden shadow-[0_50px_120px_rgba(0,0,0,.8)] will-change-transform">
          <LazyVideo {...V("training-montage")} label="Strength and functional training montage at Good Life" className="h-full w-full object-cover" toggle />
          <span className="absolute inset-x-0 top-0 h-[3px] bg-brand" />
        </div>
        <div className="v-side-b relative hidden aspect-[9/16] w-[17vw] max-w-[230px] overflow-hidden opacity-70 lg:block">
          <LazyVideo {...V("cardio-ropes")} label="Stair climber and battle rope training at Good Life" className="h-full w-full object-cover" />
        </div>
      </div>

      <p className="relative z-10 mx-auto mt-12 max-w-md px-5 text-center font-head text-sm uppercase tracking-[0.25em] text-mist">
        Real training, filmed inside Good Life Fitness Club.
      </p>
    </section>
  );
}
