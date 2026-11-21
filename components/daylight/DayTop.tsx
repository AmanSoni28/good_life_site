"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import LazyVideo from "@/components/LazyVideo";
import { Slot } from "@/components/Slot";
import { Counter, Magnetic, Marquee, SpinBadge, Words, onReady, useParallax } from "@/components/fx";
import { getLenis, gsap, reduced, ScrollTrigger, scrollToHash, useGsap } from "@/lib/motion";
import { ABOUT, ZONES, img, vid } from "@/lib/content";
import { PHONE_DISPLAY, TEL_URL } from "@/lib/site";

export const NAV = [
  { label: "Club", href: "#club" },
  { label: "Floors", href: "#floors" },
  { label: "Training", href: "#training" },
  { label: "Coaches", href: "#coaches" },
  { label: "Plans", href: "#plans" },
];

export const go = (e: React.MouseEvent, href: string) => {
  e.preventDefault();
  scrollToHash(href);
};

export const Arrow = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M4 12h15M13 6l6 6-6 6" />
  </svg>
);

/** Floating pill that tucks away when you scroll down and comes back when you scroll up. */
export function DayNav() {
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    const on = () => {
      const y = window.scrollY;
      setHidden(y > last && y > 300);
      last = y;
    };
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className={`fixed left-1/2 top-3 z-50 w-[calc(100%-1.5rem)] max-w-3xl -translate-x-1/2 transition-transform duration-500 ease-[cubic-bezier(.7,0,.2,1)] md:top-5 ${hidden && !open ? "-translate-y-[160%]" : ""}`}>
      <div className="flex items-center justify-between gap-3 rounded-full border border-black/5 bg-white p-1.5 pl-2 shadow-[0_10px_40px_-18px_rgba(11,11,12,.35)]">
        <a href="#top" onClick={(e) => go(e, "#top")} className="flex items-center gap-2.5 pr-2">
          <Image src={img("logo.png")} alt="" width={36} height={36} className="h-9 w-9 rounded-full" priority />
          <span className="display text-[1.05rem] !leading-none !tracking-[-0.03em]">Good Life</span>
        </a>
        <nav aria-label="Main" className="hidden items-center md:flex">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} onClick={(e) => go(e, n.href)} className="rounded-full px-3.5 py-2 text-sm font-medium text-soft transition-colors hover:bg-ink/5 hover:text-ink">
              {n.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-1.5">
          <a href="#join" onClick={(e) => go(e, "#join")} className="flex h-10 items-center rounded-full bg-ink px-5 text-sm font-medium text-white transition-colors hover:bg-brand">
            Join
          </a>
          <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="day-menu" aria-label={open ? "Close menu" : "Open menu"} className="grid h-10 w-10 place-items-center rounded-full bg-ink/5 md:hidden">
            <span className="relative block h-2.5 w-4">
              <span className={`absolute inset-x-0 top-0 h-0.5 rounded bg-ink transition-transform duration-300 ${open ? "translate-y-1 rotate-45" : ""}`} />
              <span className={`absolute inset-x-0 bottom-0 h-0.5 rounded bg-ink transition-transform duration-300 ${open ? "-translate-y-1 -rotate-45" : ""}`} />
            </span>
          </button>
        </div>
      </div>
      <nav
        id="day-menu"
        aria-label="Mobile"
        className={`mt-2 origin-top rounded-[1.75rem] border border-white/60 bg-white p-3 shadow-[0_20px_50px_-20px_rgba(11,11,12,.4)] transition-[opacity,transform,visibility] duration-300 md:hidden ${open ? "visible scale-100 opacity-100" : "invisible scale-95 opacity-0"}`}
      >
        {NAV.map((n) => (
          <a
            key={n.href}
            href={n.href}
            onClick={(e) => {
              setOpen(false);
              go(e, n.href);
            }}
            className="display flex items-center justify-between rounded-2xl px-4 py-3 text-3xl active:bg-ink/5"
          >
            {n.label}
            <Arrow />
          </a>
        ))}
        <a href={TEL_URL} className="mt-1 block px-4 py-3 text-sm text-soft">
          Call {PHONE_DISPLAY}
        </a>
      </nav>
    </header>
  );
}

/** Small looping clip set inside the headline, like a word. */
const Pill = ({ v }: { v: string }) => (
  <span className="dh-pill relative mx-[0.06em] inline-block h-[0.74em] w-[1.55em] overflow-hidden rounded-full bg-fog align-[-0.05em]" aria-hidden>
    <LazyVideo {...vid(v)} label="" className="absolute inset-0 h-full w-full object-cover" />
  </span>
);

// the fan of clips under the headline: tilt (deg) and drop (px) of each card
const FAN = [
  { r: -12, y: 70, src: "stills/treadmill-run.jpg", tag: "Run" },
  { r: -6, y: 22, src: "videos/women-cardio.jpg", tag: "Cardio" },
  { r: 0, y: 0, v: "training-montage", tag: "Strength" },
  { r: 6, y: 22, src: "videos/cardio-ropes.jpg", tag: "Conditioning" },
  { r: 12, y: 70, src: "stills/step-box.jpg", tag: "Turf" },
] as const;

export function DayHero() {
  const ref = useRef<HTMLElement>(null);
  useParallax(ref);

  useGsap(ref, () => {
    if (reduced()) return;
    gsap.set(".dh-line .w", { yPercent: 115 });
    gsap.set(".dh-pill", { width: 0, opacity: 0 });
    gsap.set(".dh-fade", { y: 26, opacity: 0 });
    gsap.set(".dh-card", { yPercent: 70, opacity: 0 });
    const tl = gsap
      .timeline({ paused: true, defaults: { ease: "power4.out" } })
      .to(".dh-line .w", { yPercent: 0, duration: 1.15, stagger: 0.07 })
      .to(".dh-pill", { width: "1.55em", opacity: 1, duration: 1.1, ease: "expo.inOut", stagger: 0.15 }, 0.3)
      .to(".dh-fade", { y: 0, opacity: 1, duration: 0.9, stagger: 0.08 }, 0.55)
      .to(".dh-card", { yPercent: 0, opacity: 1, duration: 1.2, ease: "back.out(1.15)", stagger: { each: 0.08, from: "center" } }, 0.45);
    const off = onReady(() => tl.play());

    // as you scroll, the fan opens flat and the cards spread apart
    const mid = (FAN.length - 1) / 2;
    gsap.utils.toArray<HTMLElement>(".dh-card-in").forEach((el, i) => {
      gsap.fromTo(el, { rotate: FAN[i].r, y: FAN[i].y, x: 0 }, { rotate: 0, y: 0, x: (i - mid) * 40, ease: "none", scrollTrigger: { trigger: ".dh-fan", start: "top 80%", end: "top 12%", scrub: 0.8 } });
    });
    gsap.to(".dh-type", { yPercent: -18, opacity: 0.25, ease: "none", scrollTrigger: { trigger: ref.current, start: "top top", end: "65% top", scrub: true } });
    return off;
  });

  return (
    <section ref={ref} id="top" className="relative overflow-hidden pt-24 md:pt-28">
      <div className="dh-type mx-auto px-5 text-center md:px-10">
        <p className="dh-fade inline-flex items-center gap-2.5 rounded-full bg-white px-4 py-2 text-sm font-medium shadow-[0_1px_0_rgba(11,11,12,.06)]">
          <span className="relative grid h-2 w-2 place-items-center">
            <span className="absolute h-2 w-2 rounded-full bg-brand [animation:ping-soft_1.8s_ease-out_infinite]" />
            <span className="h-2 w-2 rounded-full bg-brand" />
          </span>
          Unisex gym · Three training floors
        </p>

        <h1 className="display mt-6 text-[clamp(2.55rem,9.3vw,9.75rem)]">
          <span className="dh-line block">
            <Words text="Train" /> <Pill v="strength-machines" /> <Words text="hard." />
          </span>
          <span className="dh-line block">
            <Words text="Stay" /> <Words text="strong." wordClassName="text-brand" />
          </span>
          <span className="dh-line block">
            <Words text="Live" /> <Pill v="walkthrough" /> <Words text="better." />
          </span>
        </h1>

        <p className="dh-fade mx-auto mt-6 max-w-md text-lg leading-snug text-soft">Strength, cardio and turf across three floors.</p>
        <div className="dh-fade mt-6 flex flex-wrap items-center justify-center gap-3">
          <Magnetic>
            <a href="#join" onClick={(e) => go(e, "#join")} className="dbtn">
              Join the club
              <i>
                <Arrow />
              </i>
            </a>
          </Magnetic>
          <a href="#floors" onClick={(e) => go(e, "#floors")} className="dbtn dbtn-ghost">
            See the floors
          </a>
        </div>
      </div>

      <div className="dh-fan relative mt-12 flex items-start justify-center px-4 pb-24 md:pb-32">
        <SpinBadge text="Train hard • Stay strong • Live better • " className="dh-fade absolute right-[7vw] top-2 hidden h-36 w-36 text-ink lg:block">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-brand text-white">
            <Arrow size={22} />
          </span>
        </SpinBadge>
        {FAN.map((f, i) => (
          <div key={f.tag} data-depth={(i - 2) * 22 || 12} className={`dh-card w-[31vw] max-w-[250px] shrink-0 sm:w-[19vw] ${i === 0 || i === 4 ? "hidden sm:block" : ""} ${i === 2 ? "z-30" : i % 2 ? "z-20" : "z-10"} -mx-[1.2vw]`}>
            <div className="dh-card-in relative aspect-[9/16] overflow-hidden rounded-[1.4rem] bg-fog shadow-[0_30px_60px_-25px_rgba(11,11,12,.5)] ring-1 ring-black/5 md:rounded-[1.75rem]">
              {"v" in f ? (
                <LazyVideo {...vid(f.v)} label={`${f.tag} training at Good Life Fitness Club`} className="h-full w-full object-cover" />
              ) : (
                <Image src={img(f.src)} alt={`${f.tag} training at Good Life Fitness Club`} fill sizes="(min-width:640px) 19vw, 31vw" className="object-cover" priority />
              )}
              <span className="absolute bottom-2.5 left-2.5 rounded-full bg-white/95 px-3 py-1 text-xs font-medium">{f.tag}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

const STATS = [
  { n: 3, label: "Dedicated training floors" },
  { n: 6, label: "Ways to train" },
  { text: "1:1", label: "Personal training" },
  { text: "Unisex", label: "Open to everyone" },
];

export function DayStatement() {
  const ref = useRef<HTMLElement>(null);

  useGsap(ref, () => {
    if (reduced()) return;
    gsap.fromTo(".ds-word", { opacity: 0.13 }, { opacity: 1, stagger: 0.05, ease: "none", scrollTrigger: { trigger: ".ds-copy", start: "top 82%", end: "bottom 55%", scrub: true } });
    gsap.from(".ds-stat", { y: 70, opacity: 0, scale: 0.92, duration: 1, stagger: 0.09, ease: "power3.out", scrollTrigger: { trigger: ".ds-stats", start: "top 85%" } });
  });

  return (
    <section ref={ref} id="club" className="overflow-hidden px-5 pb-24 md:px-10 md:pb-32">
      <p className="eyebrow">The club</p>
      <p className="ds-copy display mt-7 max-w-[76rem] text-[clamp(2.1rem,5.6vw,5.6rem)] !leading-[1.03]">
        {ABOUT.split(" ").map((w, i) => (
          <span key={i} className="ds-word">
            {w}{" "}
          </span>
        ))}
      </p>

      <dl className="ds-stats mt-14 grid grid-cols-2 gap-3 md:mt-20 lg:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label} className="ds-stat card group flex h-44 flex-col justify-between p-5 transition-colors duration-500 hover:bg-ink hover:text-white md:h-56 md:p-7">
            <dt className="flex items-center justify-between text-sm font-medium text-soft transition-colors duration-500 group-hover:text-white/60">
              {s.label}
              <span className="h-2 w-2 rounded-full bg-brand" aria-hidden />
            </dt>
            <dd className="display text-[clamp(2.75rem,6vw,5.5rem)]">{"n" in s && s.n !== undefined ? <Counter to={s.n} /> : s.text}</dd>
          </div>
        ))}
      </dl>

      <Marquee speed={70} className="display -mx-5 mt-20 text-[13vw] !leading-none md:-mx-10 md:mt-28 md:text-[9.5vw]">
        {["Train hard", "Stay strong", "Live better"].map((t, i) => (
          <span key={t} className={`flex items-center gap-[0.3em] pr-[0.3em] ${i === 1 ? "text-brand" : ""}`}>
            {t}
            <span className="h-[0.22em] w-[0.22em] rounded-full bg-ink" aria-hidden />
          </span>
        ))}
      </Marquee>
    </section>
  );
}

const SKIN = ["bg-white", "bg-fog", "bg-ink text-white"];

/** Three big cards that stack on top of each other as you scroll (desktop). */
export function DayFloors() {
  const ref = useRef<HTMLElement>(null);
  const [front, setFront] = useState(0);

  useGsap(ref, () => {
    // only the card in front plays its clip: three clips decoding inside the stack halves the frame rate
    const stack = gsap.utils.toArray<HTMLElement>(".df-card");
    let cur = 0;
    ScrollTrigger.create({
      trigger: ref.current,
      start: "top bottom",
      end: "bottom top",
      onUpdate: () => {
        let idx = 0;
        stack.forEach((c, i) => {
          if (c.getBoundingClientRect().top < window.innerHeight * 0.6) idx = i;
        });
        if (idx !== cur) setFront((cur = idx));
      },
    });
    if (reduced()) return;
    gsap.from(".df-title .w", { yPercent: 115, duration: 1.1, stagger: 0.06, ease: "power4.out", scrollTrigger: { trigger: ".df-title", start: "top 85%" } });
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      const cards = gsap.utils.toArray<HTMLElement>(".df-card");
      cards.forEach((card, i) => {
        const next = cards[i + 1];
        if (!next) return;
        gsap.fromTo(card.querySelector(".df-in"), { scale: 1 }, { scale: 0.93, ease: "none", scrollTrigger: { trigger: next, start: "top bottom", end: "top 12%", scrub: true } });
      });
    });
    gsap.utils.toArray<HTMLElement>(".df-pic").forEach((el) => {
      gsap.fromTo(el, { yPercent: -8 }, { yPercent: 8, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
    });
    gsap.utils.toArray<HTMLElement>(".df-clip").forEach((el) => {
      gsap.from(el, { y: 90, rotate: 8, opacity: 0, duration: 1.1, ease: "back.out(1.3)", scrollTrigger: { trigger: el, start: "top 95%" } });
    });
  });

  return (
    <section ref={ref} id="floors" className="px-3 pb-24 md:px-5 md:pb-36">
      <div className="px-2 md:px-5">
        <p className="eyebrow">The floors</p>
        <h2 className="df-title display mt-6 text-[clamp(2.75rem,8vw,8rem)]">
          <Words text="Three floors." className="block" />
          <Words text="One club." className="block text-soft" />
        </h2>
      </div>

      <div className="mt-12 flex flex-col gap-4 md:mt-16">
        {ZONES.map((z, i) => (
          <article key={z.n} className="df-card lg:sticky" style={{ top: `calc(5.75rem + ${i * 1.1}rem)` }}>
            <div className={`df-in grid origin-top overflow-hidden rounded-[2rem] will-change-transform lg:h-[calc(100svh-10rem)] lg:min-h-[520px] lg:grid-cols-2 ${SKIN[i]}`}>
              <div className="flex flex-col justify-between gap-10 p-6 md:p-10 lg:p-12">
                <p className="flex items-center gap-3 text-sm font-medium">
                  <span className={`grid h-9 w-9 place-items-center rounded-full ${i === 2 ? "bg-white text-ink" : "bg-ink text-white"}`}>{z.n}</span>
                  <span className={i === 2 ? "text-white/60" : "text-soft"}>Zone {z.n} of 03</span>
                </p>
                <div>
                  <h3 className="display text-[clamp(3rem,7.4vw,7.5rem)]">{z.name}</h3>
                  <p className={`mt-5 max-w-md text-lg leading-snug ${i === 2 ? "text-white/70" : "text-soft"}`}>{z.text}</p>
                </div>
              </div>
              <div className="relative m-2.5 min-h-[82vw] overflow-hidden rounded-[1.5rem] lg:min-h-0">
                {z.slot ? <Slot id={z.slot} sizes="(min-width:1024px) 48vw, 94vw" className="df-pic scale-[1.18]" /> : <Image src={img(z.img)} alt={z.alt} fill sizes="(min-width:1024px) 48vw, 94vw" className="df-pic scale-[1.18] object-cover" />}
                <div className="df-clip absolute bottom-4 right-4 w-[36%] max-w-[210px] overflow-hidden rounded-[1.2rem] shadow-[0_25px_50px_-15px_rgba(0,0,0,.6)] ring-2 ring-white/80">
                  <div className="relative aspect-[9/16]">
                    <LazyVideo {...vid(z.video)} label={`${z.title} at Good Life Fitness Club`} className="h-full w-full object-cover" hold={front !== i} />
                  </div>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
