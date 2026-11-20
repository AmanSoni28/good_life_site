"use client";
import Image from "next/image";
import { useRef } from "react";
import LazyVideo from "./LazyVideo";
import { gsap, reduced, useGsap } from "@/lib/motion";
import { A } from "@/lib/site";

const V = (name: string) => ({ src: `${A}/videos/${name}.mp4`, poster: `${A}/videos/${name}.jpg` });

// thin framed "passepartout" card with a caption underneath
function Frame({ n, caption, className = "", children }: { n: string; caption: string; className?: string; children: React.ReactNode }) {
  return (
    <figure className={className}>
      <div className="rounded-[22px] border border-white/10 bg-white/[0.03] p-2 shadow-[0_40px_100px_-20px_rgba(0,0,0,.9)] backdrop-blur-sm">
        <div className="relative aspect-[9/16] overflow-hidden rounded-[16px]">{children}</div>
      </div>
      <figcaption className="mt-4 flex items-center gap-3 font-head text-[11px] uppercase tracking-[0.3em] text-mist">
        <span className="text-brand">{n}</span>
        <span className="h-px flex-1 bg-white/15" />
        {caption}
      </figcaption>
    </figure>
  );
}

export default function VideoExperience() {
  const ref = useRef<HTMLElement>(null);

  useGsap(ref, () => {
    if (reduced()) return;
    const st = { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true };
    gsap.fromTo(".v-main", { scale: 0.9, opacity: 0.4 }, { scale: 1, opacity: 1, ease: "none", scrollTrigger: { trigger: ref.current, start: "top 85%", end: "center center", scrub: true } });
    gsap.fromTo(".v-side-a", { yPercent: 18 }, { yPercent: -12, ease: "none", scrollTrigger: st });
    gsap.fromTo(".v-side-b", { yPercent: -6 }, { yPercent: 20, ease: "none", scrollTrigger: st });
    gsap.fromTo(".v-word-a", { xPercent: -8 }, { xPercent: 4, ease: "none", scrollTrigger: st });
    gsap.fromTo(".v-word-b", { xPercent: 8 }, { xPercent: -4, ease: "none", scrollTrigger: st });
  });

  return (
    <section ref={ref} className="grain relative overflow-hidden bg-ink py-28 md:py-40" aria-labelledby="video-title">
      <Image src={`${A}/videos/training-montage.jpg`} alt="" fill sizes="100vw" className="scale-110 object-cover opacity-15 blur-3xl" aria-hidden />
      <div className="absolute inset-0 bg-gradient-to-b from-ink via-black/80 to-ink" />
      {/* soft red halo behind the hero clip */}
      <div className="pointer-events-none absolute left-1/2 top-[58%] h-[60vh] w-[60vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/20 blur-[120px]" aria-hidden />

      <div className="relative z-10 mx-auto px-5 text-center md:px-10">
        <p className="flex items-center justify-center gap-4 font-head text-xs uppercase tracking-[0.45em] text-mist">
          <span className="h-px w-10 bg-brand" />
          The Experience
          <span className="h-px w-10 bg-brand" />
        </p>
        <h2 id="video-title" className="display mt-6 text-[clamp(3.5rem,10vw,9rem)] leading-[0.9] tracking-[0.04em]">
          <span className="v-word-a block text-white">Feel the</span>
          <span className="v-word-b block bg-gradient-to-r from-brand via-[#ff5a4f] to-brand-deep bg-clip-text text-transparent">energy.</span>
        </h2>
      </div>

      <div className="relative z-10 mx-auto mt-16 flex items-center justify-center gap-6 px-5 md:px-10 md:mt-24 md:gap-12">
        <Frame n="01" caption="Cardio" className="v-side-a hidden w-[17vw] max-w-[230px] opacity-80 lg:block">
          <LazyVideo {...V("women-cardio")} label="Cardio and core training at Good Life" className="h-full w-full object-cover" />
        </Frame>
        <Frame n="02" caption="Strength" className="v-main w-[min(82vw,400px)] will-change-transform">
          <LazyVideo {...V("training-montage")} label="Strength and functional training montage at Good Life" className="h-full w-full object-cover" toggle />
        </Frame>
        <Frame n="03" caption="Conditioning" className="v-side-b hidden w-[17vw] max-w-[230px] opacity-80 lg:block">
          <LazyVideo {...V("cardio-ropes")} label="Stair climber and battle rope training at Good Life" className="h-full w-full object-cover" />
        </Frame>
      </div>

      <p className="relative z-10 mx-auto mt-16 max-w-md px-5 text-center font-head text-xs uppercase tracking-[0.35em] text-mist/80">
        Real training, filmed inside Good Life Fitness Club.
      </p>
    </section>
  );
}
