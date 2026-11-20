"use client";
import Image from "next/image";
import { useRef } from "react";
import { gsap, reduced, ScrollTrigger, useGsap } from "@/lib/motion";
import { A } from "@/lib/site";

// Offerings confirmed by the club's signage and visible in its photos/videos.
const CARDS = [
  { title: "Strength Training", img: "stills/deadlift.jpg", alt: "Member loading a barbell", text: "Barbells, bumper plates and dedicated lifting stations for building real, raw strength." },
  { title: "Cardio Training", img: "cardio-area.jpg", alt: "Row of treadmills on the cardio floor", text: "Commercial treadmills, stair climbers and ellipticals to push your endurance further." },
  { title: "Functional Training", img: "stills/battle-ropes.jpg", alt: "Member training with battle ropes on turf", text: "An open turf zone with battle ropes, plyo boxes and step platforms for athletic, full-body work." },
  { title: "Muscle Building", img: "stills/chest-press.jpg", alt: "Member training on a strength machine", text: "Machine-based training to isolate, load and build every major muscle group." },
  { title: "Personal Training", img: "stills/barbell-setup.jpg", alt: "Member setting up a barbell", text: "One-to-one guidance to plan your training, sharpen your form and keep you accountable." },
  { title: "Body Transformation", img: "member-progress.jpg", alt: "Member checking progress in the gym mirror", text: "Structured programmes for fat loss, muscle gain and change that lasts." },
];
const ALSO = ["Group Classes", "Nutrition Guidance", "Weight Loss Programs"];

export default function FacilitiesSection() {
  const ref = useRef<HTMLElement>(null);

  useGsap(ref, () => {
    if (reduced()) return;
    gsap.from(".f-line > span", { yPercent: 115, duration: 1.2, stagger: 0.12, ease: "power4.out", scrollTrigger: { trigger: ".f-title", start: "top 80%" } });

    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      const track = ref.current!.querySelector<HTMLElement>(".f-track")!;
      const dist = () => track.scrollWidth - window.innerWidth + 80;
      gsap.to(track, {
        x: () => -dist(),
        ease: "none",
        scrollTrigger: { trigger: ".f-pin", start: "top top", end: () => `+=${dist()}`, pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1 },
      });
    });
    mm.add("(max-width: 1023px)", () => {
      gsap.from(".f-card", { y: 60, opacity: 0, duration: 1, stagger: 0.1, ease: "power3.out", scrollTrigger: { trigger: ".f-track", start: "top 85%" } });
    });
    ScrollTrigger.refresh();
    return () => mm.revert();
  });

  // subtle 3D tilt that follows the pointer
  const tilt = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse") return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
  };
  const untilt = (e: React.PointerEvent<HTMLElement>) => (e.currentTarget.style.transform = "");

  return (
    <section ref={ref} id="facilities" className="relative bg-coal">
      <div className="f-pin flex min-h-[100svh] flex-col justify-center overflow-hidden py-24 lg:h-screen lg:py-0">
        <div className="mx-auto mb-12 flex w-full max-w-[1440px] flex-col gap-6 px-5 md:px-10 lg:mb-14 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="eyebrow mb-6">Facilities &amp; training</p>
            <h2 className="f-title display text-[clamp(3rem,7vw,6.5rem)]">
              <span className="f-line line"><span>More than a gym.</span></span>
              <span className="f-line line"><span>A <span className="text-brand">better</span> lifestyle.</span></span>
            </h2>
          </div>
          <p className="max-w-sm text-mist">
            Also at the club:{" "}
            {ALSO.map((a, i) => (
              <span key={a} className="text-white">
                {a}
                {i < ALSO.length - 1 ? " · " : ""}
              </span>
            ))}
          </p>
        </div>

        <ul className="f-track flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 [scrollbar-width:none] md:px-10 lg:snap-none lg:overflow-visible lg:pb-0">
          {CARDS.map((c, i) => (
            <li key={c.title} className="f-card shrink-0 snap-start">
              <article
                onPointerMove={tilt}
                onPointerLeave={untilt}
                className="group relative h-[min(62vh,560px)] w-[78vw] overflow-hidden bg-ink transition-transform duration-300 ease-out will-change-transform sm:w-[46vw] lg:h-[58vh] lg:w-[min(30vw,430px)]"
              >
                <Image src={`${A}/${c.img}`} alt={c.alt} fill sizes="(min-width:1024px) 30vw, 78vw" className="object-cover opacity-80 transition duration-[1.2s] ease-out group-hover:scale-110 group-hover:opacity-100" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <span className="absolute left-0 top-0 h-[3px] w-0 bg-brand transition-all duration-700 group-hover:w-full" />
                <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                  <span className="font-head text-xs tracking-[0.3em] text-brand">0{i + 1}</span>
                  <h3 className="display mt-2 text-4xl md:text-5xl">{c.title}</h3>
                  <p className="mt-3 max-h-0 overflow-hidden text-sm leading-relaxed text-white/80 opacity-0 transition-all duration-700 group-hover:max-h-32 group-hover:opacity-100 max-lg:max-h-32 max-lg:opacity-100">
                    {c.text}
                  </p>
                </div>
              </article>
            </li>
          ))}
          <li className="hidden w-[10vw] shrink-0 lg:block" aria-hidden />
        </ul>
      </div>
    </section>
  );
}
