"use client";
import Image from "next/image";
import { useRef } from "react";
import { gsap, reduced, useGsap } from "@/lib/motion";
import { A } from "@/lib/site";

const COPY =
  "Good Life Fitness Club is a unisex gym spread across three dedicated training floors — built for anyone ready to train hard, stay strong and live better. Whether it is your first session or your next personal best, this is where the work turns into a way of life.";

// Only facts visible in the supplied photos, videos and signage.
const FACTS = [
  { value: "03", label: "Dedicated training floors" },
  { value: "Unisex", label: "Open to everyone" },
  { value: "Turf", label: "Functional training zone" },
];

export default function AboutSection() {
  const ref = useRef<HTMLElement>(null);

  useGsap(ref, () => {
    if (reduced()) return;
    gsap.from(".a-line > span", {
      yPercent: 115,
      duration: 1.2,
      ease: "power4.out",
      stagger: 0.12,
      scrollTrigger: { trigger: ".a-title", start: "top 80%" },
    });
    gsap.fromTo(
      ".a-word",
      { opacity: 0.12 },
      { opacity: 1, stagger: 0.04, ease: "none", scrollTrigger: { trigger: ".a-copy", start: "top 80%", end: "bottom 45%", scrub: true } },
    );
    gsap.from(".a-fact", { y: 40, opacity: 0, duration: 1, stagger: 0.12, ease: "power3.out", scrollTrigger: { trigger: ".a-facts", start: "top 85%" } });
    gsap.from(".a-count", {
      textContent: 0,
      duration: 1.6,
      ease: "power2.out",
      snap: { textContent: 1 },
      scrollTrigger: { trigger: ".a-facts", start: "top 85%" },
      onUpdate() {
        (this.targets()[0] as HTMLElement).textContent = String(Math.round(Number((this.targets()[0] as HTMLElement).textContent))).padStart(2, "0");
      },
    });
    // images: reveal + depth parallax at different speeds
    gsap.utils.toArray<HTMLElement>(".a-img").forEach((el, i) => {
      gsap.fromTo(el, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "power3.inOut", scrollTrigger: { trigger: el, start: "top 85%" } });
      gsap.fromTo(el, { yPercent: i ? 18 : 8 }, { yPercent: i ? -18 : -8, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
    });
  });

  return (
    <section ref={ref} id="about" className="relative overflow-hidden bg-ink py-28 md:py-44">
      <span className="pointer-events-none absolute -left-4 top-10 select-none font-display text-[28vw] leading-none text-white/[0.025]" aria-hidden>
        GOOD LIFE
      </span>
      <div className="relative mx-auto grid gap-16 px-5 md:px-10 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <p className="eyebrow mb-8">Why Good Life</p>
          <h2 className="a-title display text-[clamp(3.2rem,9vw,8.5rem)]">
            <span className="a-line line"><span>Your journey.</span></span>
            <span className="a-line line"><span className="outline-text">Your strength.</span></span>
            <span className="a-line line"><span>Your <span className="text-brand">good life.</span></span></span>
          </h2>
          <p className="a-copy mt-12 max-w-2xl text-xl leading-relaxed text-white md:text-2xl">
            {COPY.split(" ").map((w, i) => (
              <span key={i} className="a-word">
                {w}{" "}
              </span>
            ))}
          </p>
          <dl className="a-facts mt-16 grid grid-cols-3 gap-4 border-t border-white/10 pt-10 md:max-w-2xl">
            {FACTS.map((f, i) => (
              <div key={f.label} className="a-fact">
                <dt className="sr-only">{f.label}</dt>
                <dd className={`display text-5xl md:text-7xl ${i === 0 ? "text-brand" : ""}`}>
                  {i === 0 ? <span className="a-count">{f.value}</span> : f.value}
                </dd>
                <dd className="mt-2 font-head text-[0.65rem] uppercase tracking-[0.25em] text-mist md:text-xs">{f.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative h-[520px] sm:h-[640px] lg:col-span-5 lg:h-auto">
          <div className="a-img absolute right-0 top-0 h-[68%] w-[78%] overflow-hidden">
            <Image src={`${A}/turf-area.jpg`} alt="The covered functional turf zone with battle ropes and plyo boxes" fill sizes="(min-width:1024px) 34vw, 78vw" className="object-cover" />
          </div>
          <div className="a-img absolute bottom-0 left-0 h-[58%] w-[52%] overflow-hidden border-4 border-ink shadow-[0_30px_60px_rgba(0,0,0,.6)]">
            <Image src={`${A}/stills/deadlift.jpg`} alt="A member loading plates for a barbell lift" fill sizes="(min-width:1024px) 22vw, 52vw" className="object-cover" />
            <span className="absolute left-0 top-0 h-full w-[3px] bg-brand" />
          </div>
        </div>
      </div>
    </section>
  );
}
