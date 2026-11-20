"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap, reduced, ScrollTrigger, useGsap } from "@/lib/motion";
import { A } from "@/lib/site";

// Offerings confirmed by the club's signage and visible in its photos/videos.
const CARDS = [
  { title: "Strength Training", img: "stills/deadlift.jpg", video: "training-montage", alt: "Member loading a barbell", text: "Barbells, bumper plates and dedicated lifting stations for building real, raw strength.", tags: ["Barbells", "Plates", "Lifting stations"] },
  { title: "Cardio Training", img: "cardio-area.jpg", video: "women-cardio", alt: "Row of treadmills on the cardio floor", text: "Commercial treadmills, stair climbers and ellipticals to push your endurance further.", tags: ["Treadmills", "Stair climbers", "Ellipticals"] },
  { title: "Functional Training", img: "stills/battle-ropes.jpg", video: "cardio-ropes", alt: "Member training with battle ropes", text: "An open turf zone with battle ropes, plyo boxes and step platforms for athletic, full-body work.", tags: ["Turf zone", "Battle ropes", "Plyo boxes"] },
  { title: "Muscle Building", img: "stills/chest-press.jpg", video: "strength-machines", alt: "Member training on a strength machine", text: "Machine-based training to isolate, load and build every major muscle group.", tags: ["Machines", "Plate-loaded", "Isolation"] },
  { title: "Personal Training", img: "stills/barbell-setup.jpg", alt: "Member setting up a barbell", text: "One-to-one guidance to plan your training, sharpen your form and keep you accountable.", tags: ["One-to-one", "Form coaching", "Accountability"] },
  { title: "Body Transformation", img: "member-progress.jpg", alt: "Member checking progress in the gym mirror", text: "Structured programmes for fat loss, muscle gain and change that lasts.", tags: ["Fat loss", "Muscle gain", "Programmes"] },
];
const ALSO = ["Group Classes", "Nutrition Guidance", "Weight Loss Programs"];
const pad = (n: number) => String(n).padStart(2, "0");

export default function FacilitiesSection() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [desktop, setDesktop] = useState(false);

  useGsap(ref, () => {
    const root = ref.current!;
    const track = root.querySelector<HTMLElement>(".f-track")!;
    const cards = Array.from(root.querySelectorAll<HTMLElement>(".f-card"));
    const bar = root.querySelector<HTMLElement>(".f-bar")!;
    let current = -1;

    // spotlight: card nearest the focus line becomes active; photos drift for depth
    const focus = () => {
      const rr = root.getBoundingClientRect();
      if (rr.bottom < 0 || rr.top > window.innerHeight) return; // off-screen: skip work
      const fx = window.innerWidth * (window.innerWidth >= 1024 ? 0.45 : 0.5);
      let best = 0;
      let bestD = Infinity;
      cards.forEach((c, i) => {
        const r = c.getBoundingClientRect();
        const d = r.left + r.width / 2 - fx;
        if (Math.abs(d) < bestD) {
          bestD = Math.abs(d);
          best = i;
        }
        c.style.setProperty("--px", `${(-d / window.innerWidth) * 60}px`);
      });
      if (best !== current) setActive((current = best));
    };

    if (!reduced())
      gsap.from(".f-line > span", { yPercent: 115, duration: 1.2, stagger: 0.12, ease: "power4.out", scrollTrigger: { trigger: ".f-title", start: "top 80%" } });

    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      setDesktop(true);
      const dist = () => track.scrollWidth - window.innerWidth * 0.55;
      const skew = gsap.quickTo(track, "skewX", { duration: 0.6, ease: "power3.out" });
      let settle: ReturnType<typeof setTimeout> | undefined;
      gsap.to(track, {
        x: () => -dist(),
        ease: "none",
        scrollTrigger: {
          trigger: ".f-pin",
          start: "top top",
          end: () => `+=${dist()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (s) => {
            bar.style.transform = `scaleX(${s.progress})`;
            if (reduced()) return;
            skew(gsap.utils.clamp(-6, 6, s.getVelocity() / -400));
            clearTimeout(settle);
            settle = setTimeout(() => skew(0), 120); // straighten once scrolling stops
          },
        },
      });
      gsap.to(".f-bgword", { xPercent: -30, ease: "none", scrollTrigger: { trigger: ".f-pin", start: "top bottom", end: () => `+=${dist() + window.innerHeight * 2}`, scrub: true } });
      gsap.ticker.add(focus);
      return () => {
        gsap.ticker.remove(focus);
        setDesktop(false);
      };
    });
    mm.add("(max-width: 1023px)", () => {
      const onScroll = () => {
        focus();
        bar.style.transform = `scaleX(${track.scrollLeft / Math.max(1, track.scrollWidth - track.clientWidth)})`;
      };
      track.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
      if (!reduced()) gsap.from(".f-card", { y: 60, opacity: 0, duration: 1, stagger: 0.1, ease: "power3.out", scrollTrigger: { trigger: ".f-track", start: "top 85%" } });
      return () => track.removeEventListener("scroll", onScroll);
    });
    ScrollTrigger.refresh();
    return () => mm.revert();
  });

  // play only the spotlighted card's video (desktop only, lazy-loaded)
  useEffect(() => {
    const vids = ref.current!.querySelectorAll<HTMLVideoElement>(".f-video");
    vids.forEach((v) => {
      const mine = Number(v.dataset.i) === active && desktop && !reduced();
      if (mine) {
        if (!v.getAttribute("src")) v.src = v.dataset.src!;
        v.play().catch(() => {});
      } else v.pause();
    });
  }, [active, desktop]);

  // pointer tilt on the active card
  const tilt = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse") return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--rx", `${(-((e.clientY - r.top) / r.height - 0.5) * 8).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${(((e.clientX - r.left) / r.width - 0.5) * 8).toFixed(2)}deg`);
  };
  const untilt = (e: React.PointerEvent<HTMLElement>) => {
    e.currentTarget.style.setProperty("--rx", "0deg");
    e.currentTarget.style.setProperty("--ry", "0deg");
  };

  return (
    <section ref={ref} id="facilities" className="relative bg-coal">
      <div className="f-pin relative flex min-h-[100svh] flex-col justify-center overflow-hidden py-24 lg:h-screen lg:py-0">
        {/* atmosphere */}
        <span className="f-bgword pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 select-none whitespace-nowrap font-display text-[26vw] leading-none text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,.05)]" aria-hidden>
          TRAIN HARD · STAY STRONG
        </span>
        <div className="pointer-events-none absolute -bottom-40 left-[30%] h-[60vh] w-[50vw] rounded-full bg-brand/10 blur-[120px]" aria-hidden />

        <div className="relative mx-auto mb-10 flex w-full flex-col gap-8 px-5 md:px-10 lg:mb-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="eyebrow mb-6">Facilities &amp; training</p>
            <h2 className="f-title display text-[clamp(3rem,5.4vw,5.6rem)]">
              <span className="f-line line"><span>More than a gym.</span></span>
              <span className="f-line line"><span>A <span className="text-brand">better</span> lifestyle.</span></span>
            </h2>
          </div>
          <div className="lg:max-w-sm lg:text-right">
            <p className="font-display text-5xl leading-none md:text-6xl" aria-live="polite">
              <span className="text-brand">{pad(active + 1)}</span>
              <span className="text-white/25"> / {pad(CARDS.length)}</span>
            </p>
            <p key={active} className="mt-2 font-head text-sm uppercase tracking-[0.3em] text-white/80 [animation:g-caption_.6s_cubic-bezier(.2,.8,.2,1)]">
              {CARDS[active].title}
            </p>
            <div className="mt-4 h-px w-full bg-white/10 lg:ml-auto lg:w-56">
              <span className="f-bar block h-full origin-left scale-x-0 bg-brand shadow-[0_0_10px_rgba(237,37,30,.8)]" />
            </div>
          </div>
        </div>

        <ul className="f-track relative flex snap-x snap-mandatory items-center gap-6 overflow-x-auto px-5 pb-6 [scrollbar-width:none] md:px-10 lg:snap-none lg:overflow-visible lg:pb-0 lg:pl-10">
          {CARDS.map((c, i) => {
            const on = i === active;
            return (
              <li key={c.title} className="f-card shrink-0 snap-center [perspective:1100px]">
                <article
                  onPointerMove={tilt}
                  onPointerLeave={untilt}
                  className={`group relative h-[min(60vh,560px)] w-[80vw] overflow-hidden bg-ink transition-[transform,box-shadow,opacity] duration-700 ease-[cubic-bezier(.2,.8,.2,1)] [transform:rotateX(var(--rx,0deg))_rotateY(var(--ry,0deg))_scale(var(--s))] sm:w-[48vw] lg:h-[54vh] lg:w-[min(27vw,400px)] ${
                    on ? "opacity-100 shadow-[0_40px_100px_-20px_rgba(237,37,30,.45)] [--s:1]" : "opacity-60 [--s:.9]"
                  }`}
                >
                  {/* media with inner parallax */}
                  <div className="absolute inset-y-0 -inset-x-[12%] [transform:translateX(var(--px,0px))]">
                    <Image
                      src={`${A}/${c.img}`}
                      alt={c.alt}
                      fill
                      sizes="(min-width:1024px) 36vw, 90vw"
                      className={`object-cover transition-[filter,transform] duration-1000 ${on ? "scale-105 grayscale-0" : "scale-100 grayscale"}`}
                    />
                    {c.video && (
                      <video
                        className={`f-video absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${on && desktop ? "opacity-100" : "opacity-0"}`}
                        data-i={i}
                        data-src={`${A}/videos/${c.video}.mp4`}
                        muted
                        loop
                        playsInline
                        preload="none"
                        aria-hidden
                      />
                    )}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/10" />
                  <div className={`absolute inset-0 bg-[radial-gradient(ellipse_at_50%_120%,rgba(237,37,30,.35),transparent_60%)] transition-opacity duration-700 ${on ? "opacity-100" : "opacity-0"}`} />

                  {/* viewfinder corners */}
                  {["left-4 top-4 border-l-2 border-t-2", "right-4 top-4 border-r-2 border-t-2", "bottom-4 left-4 border-b-2 border-l-2", "bottom-4 right-4 border-b-2 border-r-2"].map((p) => (
                    <span key={p} className={`absolute h-5 w-5 transition-colors duration-700 ${p} ${on ? "border-brand" : "border-white/25"}`} aria-hidden />
                  ))}

                  {/* top row */}
                  <div className="absolute inset-x-8 top-8 flex items-center justify-between">
                    <span className="font-head text-xs tracking-[0.35em] text-white/70">
                      <span className="text-brand">{pad(i + 1)}</span> — Discipline
                    </span>
                    {c.video && (
                      <span className={`flex items-center gap-2 font-head text-[0.6rem] uppercase tracking-[0.3em] transition-opacity duration-700 ${on && desktop ? "opacity-100" : "opacity-0"}`}>
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand" /> Live from the floor
                      </span>
                    )}
                  </div>

                  {/* giant outlined index */}
                  <span
                    className={`pointer-events-none absolute -right-2 bottom-24 font-display text-[9rem] leading-none text-transparent transition-all duration-1000 md:text-[11rem] ${
                      on ? "translate-y-0 [-webkit-text-stroke:1.5px_rgba(237,37,30,.75)]" : "translate-y-6 [-webkit-text-stroke:1px_rgba(255,255,255,.18)]"
                    }`}
                    aria-hidden
                  >
                    {pad(i + 1)}
                  </span>

                  {/* copy */}
                  <div className="absolute inset-x-0 bottom-0 p-7 md:p-8">
                    <h3 className="display text-4xl md:text-5xl">{c.title}</h3>
                    <span className={`mt-4 block h-[2px] origin-left bg-brand transition-transform duration-700 ${on ? "w-16 scale-x-100" : "w-16 scale-x-0"}`} />
                    <div className={`grid transition-[grid-template-rows,opacity] duration-700 ${on ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                      <div className="overflow-hidden">
                        <p className="mt-4 text-sm leading-relaxed text-white/80">{c.text}</p>
                        <ul className="mt-4 flex flex-wrap gap-2">
                          {c.tags.map((t) => (
                            <li key={t} className="border border-white/20 bg-black/40 px-3 py-1 font-head text-[0.62rem] uppercase tracking-[0.2em] text-white/85 backdrop-blur-sm">
                              {t}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </article>
              </li>
            );
          })}
          <li className="hidden w-[20vw] shrink-0 lg:block" aria-hidden />
        </ul>

        <div className="relative mx-auto mt-8 flex w-full flex-wrap items-center gap-3 px-5 md:px-10 lg:mt-8">
          <span className="font-head text-[0.65rem] uppercase tracking-[0.3em] text-mist">Also at the club</span>
          {ALSO.map((a) => (
            <span key={a} className="rounded-full border border-white/15 px-4 py-1.5 font-head text-xs uppercase tracking-[0.18em] text-white/85">
              {a}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
