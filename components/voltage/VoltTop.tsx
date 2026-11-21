"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import LazyVideo from "@/components/LazyVideo";
import { Chars, Counter, Magnetic, Marquee, SpinBadge, Words, onReady, useParallax } from "@/components/fx";
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

export const Spark = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={`h-[0.55em] w-[0.55em] shrink-0 ${className}`}>
    <path d="M12 0c.8 6.6 5.4 11.2 12 12-6.6.8-11.2 5.4-12 12-.8-6.6-5.4-11.2-12-12 6.6-.8 11.2-5.400 12-12z" />
  </svg>
);

export function VoltNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  const setMenu = (v: boolean) => {
    setOpen(v);
    if (v) getLenis()?.stop();
    else getLenis()?.start();
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-50 transition-[background-color,padding,border-color] duration-500 ${scrolled && !open ? "border-b border-white/10 bg-night/92 py-3" : "border-b border-transparent py-5"}`}>
        <div className="flex items-center justify-between gap-4 px-5 md:px-10">
          <a href="#top" onClick={(e) => go(e, "#top")} className="flex items-center gap-3">
            <Image src={img("logo.png")} alt="" width={40} height={40} className="h-10 w-10 rounded-full ring-1 ring-white/20" priority />
            <span className="display text-lg !leading-none">
              Good Life<span className="text-volt">.</span>
            </span>
          </a>
          <nav aria-label="Main" className="glass hidden items-center rounded-full p-1 lg:flex">
            {NAV.map((n) => (
              <a key={n.href} href={n.href} onClick={(e) => go(e, n.href)} className="rounded-full px-4 py-2 text-sm font-medium text-snow/70 transition-colors hover:bg-white/10 hover:text-snow">
                {n.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <a href="#join" onClick={(e) => go(e, "#join")} className="vbtn !h-11 !px-5 !text-sm">
              Join now
            </a>
            <button type="button" onClick={() => setMenu(!open)} aria-expanded={open} aria-controls="volt-menu" aria-label={open ? "Close menu" : "Open menu"} className="glass grid h-11 w-11 place-items-center rounded-full lg:hidden">
              <span className="relative block h-2.5 w-4">
                <span className={`absolute inset-x-0 top-0 h-0.5 rounded bg-snow transition-transform duration-300 ${open ? "translate-y-1 rotate-45" : ""}`} />
                <span className={`absolute inset-x-0 bottom-0 h-0.5 rounded bg-snow transition-transform duration-300 ${open ? "-translate-y-1 -rotate-45" : ""}`} />
              </span>
            </button>
          </div>
        </div>
      </header>

      <div id="volt-menu" className={`fixed inset-0 z-40 flex flex-col justify-end bg-night px-5 pb-28 pt-28 transition-[clip-path,visibility] duration-700 ease-[cubic-bezier(.7,0,.2,1)] lg:hidden ${open ? "visible [clip-path:circle(150%_at_100%_0)]" : "invisible [clip-path:circle(0%_at_100%_0)]"}`}>
        <nav aria-label="Mobile" className="flex flex-col">
          {NAV.map((n, i) => (
            <a
              key={n.href}
              href={n.href}
              onClick={(e) => {
                setMenu(false);
                go(e, n.href);
              }}
              style={{ transitionDelay: open ? `${180 + i * 60}ms` : "0ms" }}
              className={`display flex items-baseline gap-4 border-b border-white/10 py-4 text-[12vw] transition-[opacity,transform] duration-500 ${open ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
            >
              <span className="text-sm text-volt">0{i + 1}</span>
              {n.label}
            </a>
          ))}
        </nav>
        <a href={TEL_URL} className="mt-6 text-sm text-smoke">
          Call {PHONE_DISPLAY}
        </a>
      </div>
    </>
  );
}

// the wall behind the headline: five columns of the club's own clips and stills
type Tile = { v: string } | { s: string };
const WALL: Tile[][] = [
  [{ s: "stills/treadmill-run.jpg" }, { s: "stills/deadlift.jpg" }, { s: "stills/step-box.jpg" }],
  [{ v: "women-cardio" }, { s: "stills/battle-ropes.jpg" }, { s: "videos/walkthrough.jpg" }],
  [{ s: "stills/chest-press.jpg" }, { v: "training-montage" }, { s: "stills/entrance.jpg" }],
  [{ v: "cardio-ropes" }, { s: "stills/stair-climber.jpg" }, { s: "videos/strength-machines.jpg" }],
  [{ s: "stills/barbell-setup.jpg" }, { s: "videos/women-cardio.jpg" }, { s: "stills/treadmill-run.jpg" }],
];
const TICKER = ["Strength", "Cardio", "Functional turf", "Personal training", "Unisex gym", "Three floors"];

export function VoltHero() {
  const ref = useRef<HTMLElement>(null);
  useParallax(ref);

  useGsap(ref, () => {
    if (reduced()) return;
    gsap.set(".vh-col", { yPercent: (i) => (i % 2 ? 110 : -110) });
    gsap.set(".vh-line .c", { yPercent: 120, rotateX: -80, opacity: 0 });
    gsap.set(".vh-fade", { y: 26, opacity: 0 });
    const tl = gsap
      .timeline({ paused: true, defaults: { ease: "power4.out" } })
      .to(".vh-col", { yPercent: 0, duration: 1.6, ease: "expo.out", stagger: { each: 0.07, from: "center" } })
      .to(".vh-line .c", { yPercent: 0, rotateX: 0, opacity: 1, duration: 1, stagger: 0.022 }, 0.35)
      .to(".vh-fade", { y: 0, opacity: 1, duration: 0.9, stagger: 0.08 }, 0.9);
    const off = onReady(() => tl.play());

    const st = { trigger: ref.current, start: "top top", end: "bottom top", scrub: true };
    gsap.utils.toArray<HTMLElement>(".vh-shift").forEach((el, i) => {
      gsap.to(el, { yPercent: i % 2 ? -14 : 14, ease: "none", scrollTrigger: st });
    });
    gsap.to(".vh-type", { scale: 0.86, yPercent: -12, opacity: 0, ease: "none", scrollTrigger: { ...st, end: "70% top" } });
    gsap.to(".vh-shade", { opacity: 0.9, ease: "none", scrollTrigger: st });
    return off;
  });

  return (
    <section ref={ref} id="top" className="relative flex h-[100svh] min-h-[640px] flex-col overflow-hidden bg-night">
      {/* phones and tablets: one portrait clip fills the screen */}
      <div className="absolute inset-0 lg:hidden">
        <LazyVideo {...vid("training-montage")} label="Training at Good Life Fitness Club" className="h-full w-full object-cover" />
      </div>
      {/* desktop: the video wall */}
      <div className="absolute inset-0 hidden gap-3 px-3 lg:flex" aria-hidden>
        {WALL.map((col, i) => (
          <div key={i} data-depth={(i - 2) * -20 || -10} className="vh-col relative min-w-0 flex-1">
            <div className="vh-shift absolute inset-x-0 -top-[14%]">
              <div className="flex flex-col gap-3" style={{ animation: `${i % 2 ? "drift-b" : "drift-a"} ${11 + i * 1.5}s ease-in-out infinite alternate` }}>
                {col.map((t, k) => (
                  <div key={k} className="relative aspect-[9/16] overflow-hidden rounded-2xl bg-coal">
                    {"v" in t ? <LazyVideo {...vid(t.v)} label="" className="h-full w-full object-cover" /> : <Image src={img(t.s)} alt="" fill sizes="20vw" className="object-cover" priority={k === 0} />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      <span className="vh-shade absolute inset-0 bg-night/60" aria-hidden />
      <span className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(5,5,5,.75)_100%)]" aria-hidden />
      <span className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-night to-transparent" aria-hidden />

      <div data-depth="28" className="vh-type relative z-10 flex flex-1 flex-col items-center justify-center px-5 pt-20 text-center [perspective:900px]">
        <p className="vh-fade glass inline-flex items-center gap-2.5 rounded-full px-4 py-2 text-sm font-medium">
          <span className="h-2 w-2 rounded-full bg-volt shadow-[0_0_12px_2px_rgba(200,255,62,.8)]" />
          Unisex gym · Three training floors
        </p>
        <h1 className="display mt-7 text-[clamp(2.7rem,10.2vw,10.5rem)] uppercase !leading-[0.9]">
          <span className="vh-line block"><Chars text="Train hard." /></span>
          <span className="vh-line block text-volt"><Chars text="Stay strong." /></span>
          <span className="vh-line block"><Chars text="Live better." /></span>
        </h1>
        <p className="vh-fade mt-7 max-w-md text-lg leading-snug text-snow/75">Strength, cardio and turf across three floors.</p>
        <div className="vh-fade mt-8 flex flex-wrap items-center justify-center gap-3">
          <Magnetic>
            <a href="#join" onClick={(e) => go(e, "#join")} className="vbtn">
              Join the club <Arrow />
            </a>
          </Magnetic>
          <a href="#floors" onClick={(e) => go(e, "#floors")} className="vbtn vbtn-ghost">
            See the floors
          </a>
        </div>
      </div>

      <SpinBadge text="Scroll • Explore • Scroll • Explore • " className="vh-fade absolute bottom-24 right-10 z-10 hidden h-32 w-32 text-snow lg:block">
        <span className="grid h-14 w-14 rotate-90 place-items-center rounded-full bg-volt text-night">
          <Arrow size={20} />
        </span>
      </SpinBadge>

      <div className="vh-fade relative z-10 border-t border-white/10 bg-night/75 py-3.5">
        <Marquee speed={40}>
          {TICKER.map((t) => (
            <span key={t} className="flex items-center gap-6 pr-6 text-sm font-medium uppercase tracking-[0.18em] text-snow/80">
              {t}
              <Spark className="text-volt" />
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}

const STATS = [
  { n: 3, label: "Training floors" },
  { n: 6, label: "Ways to train" },
  { text: "1:1", label: "Personal training" },
  { text: "Unisex", label: "Open to everyone" },
];

export function VoltManifesto() {
  const ref = useRef<HTMLElement>(null);

  useGsap(ref, () => {
    if (reduced()) return;
    const st = { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: 0.6 };
    gsap.fromTo(".vm-a", { xPercent: 4 }, { xPercent: -22, ease: "none", scrollTrigger: st });
    gsap.fromTo(".vm-b", { xPercent: -26 }, { xPercent: 0, ease: "none", scrollTrigger: st });
    gsap.fromTo(".vm-word", { opacity: 0.14 }, { opacity: 1, stagger: 0.05, ease: "none", scrollTrigger: { trigger: ".vm-copy", start: "top 80%", end: "bottom 55%", scrub: true } });
    gsap.from(".vm-stat", { y: 60, opacity: 0, duration: 1, stagger: 0.1, ease: "power3.out", scrollTrigger: { trigger: ".vm-stats", start: "top 88%" } });
    gsap.from(".vm-rule", { scaleX: 0, duration: 1.4, stagger: 0.1, ease: "expo.out", scrollTrigger: { trigger: ".vm-stats", start: "top 88%" } });
  });

  return (
    <section ref={ref} id="club" className="overflow-hidden pb-24 pt-20 md:pb-36 md:pt-28">
      <div className="display select-none whitespace-nowrap text-[15vw] uppercase !leading-[0.92]" aria-hidden>
        <p className="vm-a">
          Three floors <span className="text-volt">/</span> <span className="ghost">One club</span> <span className="text-volt">/</span> Three floors
        </p>
        <p className="vm-b">
          <span className="ghost">Train hard</span> <span className="text-volt">/</span> Stay strong <span className="text-volt">/</span> <span className="ghost">Live better</span>
        </p>
      </div>

      <div className="mt-20 grid gap-8 px-5 md:mt-28 md:px-10 lg:grid-cols-12">
        <p className="tag self-start lg:col-span-3 lg:mt-4">The club</p>
        <p className="vm-copy display text-[clamp(1.9rem,4.6vw,4.5rem)] !leading-[1.08] lg:col-span-9">
          {ABOUT.split(" ").map((w, i) => (
            <span key={i} className="vm-word">
              {w}{" "}
            </span>
          ))}
        </p>
      </div>

      <dl className="vm-stats mt-16 grid grid-cols-2 gap-x-6 gap-y-10 px-5 md:mt-24 md:px-10 lg:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label} className="vm-stat">
            <span className="vm-rule block h-px origin-left bg-white/20" aria-hidden />
            <dd className="display mt-6 text-[clamp(3rem,6.4vw,6rem)] text-volt">{s.n !== undefined ? <Counter to={s.n} /> : s.text}</dd>
            <dt className="mt-2 text-smoke">{s.label}</dt>
          </div>
        ))}
      </dl>
    </section>
  );
}

/** Pinned stage (desktop): the number rolls, the clip wipes and the copy swaps as you scroll through the three zones. */
export function VoltFloors() {
  const ref = useRef<HTMLElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(0);

  useGsap(ref, () => {
    gsap.from(".vf-title .w", { yPercent: reduced() ? 0 : 115, duration: 1.1, stagger: 0.06, ease: "power4.out", scrollTrigger: { trigger: ".vf-title", start: "top 85%" } });
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      ScrollTrigger.create({
        trigger: ".vf-stage",
        start: "top top",
        end: () => `+=${window.innerHeight * 2.2}`,
        pin: true,
        invalidateOnRefresh: true,
        onUpdate: (s) => {
          setActive(Math.min(ZONES.length - 1, Math.floor(s.progress * ZONES.length)));
          if (bar.current) bar.current.style.transform = `scaleY(${s.progress})`;
        },
      });
    });
    if (reduced()) return;
    gsap.from(".vf-mcard", { y: 80, opacity: 0, duration: 1, stagger: 0.12, ease: "power3.out", scrollTrigger: { trigger: ".vf-mlist", start: "top 85%" } });
  });

  return (
    <section ref={ref} id="floors" className="relative">
      <div className="px-5 md:px-10">
        <p className="tag">The floors</p>
        <h2 className="vf-title display mt-6 text-[clamp(2.6rem,7.6vw,7.5rem)]">
          <Words text="Three floors." className="block" />
          <Words text="One club." className="block text-volt" />
        </h2>
      </div>

      {/* desktop: pinned stage */}
      <div className="vf-stage relative hidden h-[100svh] min-h-[620px] grid-cols-12 items-center gap-8 overflow-hidden px-10 lg:grid">
        <span className="pointer-events-none absolute left-1/2 top-1/2 h-[120vh] w-[120vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(200,255,62,.16),transparent)]" aria-hidden />

        <div className="relative col-span-4 flex items-center gap-8">
          <div className="relative h-56 w-px bg-white/15" aria-hidden>
            <span ref={bar} className="absolute inset-0 origin-top scale-y-0 bg-volt" />
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-smoke">Zone</p>
            <div className="display mt-2 h-[1em] overflow-hidden text-[13vw] !leading-none text-volt" aria-hidden>
              <div className="transition-transform duration-700 ease-[cubic-bezier(.7,0,.2,1)]" style={{ transform: `translateY(-${(active * 100) / ZONES.length}%)` }}>
                {ZONES.map((z) => (
                  <span key={z.n} className="block h-[1em]">
                    {z.n}
                  </span>
                ))}
              </div>
            </div>
            <ul className="mt-6 flex flex-col gap-2">
              {ZONES.map((z, i) => (
                <li key={z.n} className={`flex items-center gap-3 text-sm font-medium transition-colors duration-500 ${active === i ? "text-snow" : "text-smoke/60"}`}>
                  <span className={`h-1.5 rounded-full transition-all duration-500 ${active === i ? "w-8 bg-volt" : "w-3 bg-white/25"}`} />
                  {z.title}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="relative col-span-4 flex justify-center">
          <div className="glass relative aspect-[9/16] h-[74svh] min-h-[460px] rounded-[2.4rem] p-2.5">
            <div className="relative h-full w-full overflow-hidden rounded-[1.9rem] bg-coal">
              {ZONES.map((z, i) => (
                <div key={z.n} className="absolute inset-0 transition-[clip-path] duration-[900ms] ease-[cubic-bezier(.7,0,.2,1)]" style={{ clipPath: i <= active ? "inset(0% 0% 0% 0%)" : "inset(100% 0% 0% 0%)", zIndex: i }}>
                  <LazyVideo {...vid(z.video)} label={`${z.title} at Good Life Fitness Club`} className="h-full w-full object-cover" hold={i !== active} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative col-span-4 h-72" aria-live="polite">
          {ZONES.map((z, i) => (
            <div key={z.n} className={`absolute inset-0 flex flex-col justify-center transition-[opacity,transform] duration-700 ease-out ${active === i ? "translate-y-0 opacity-100" : active > i ? "-translate-y-8 opacity-0" : "translate-y-8 opacity-0"}`} aria-hidden={active !== i}>
              <h3 className="display text-[clamp(3rem,5.6vw,5.75rem)]">{z.name}</h3>
              <p className="mt-5 max-w-sm text-lg leading-snug text-snow/70">{z.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* phones and tablets: three cards */}
      <ul className="vf-mlist mt-10 flex flex-col gap-3 px-5 md:px-10 lg:hidden">
        {ZONES.map((z) => (
          <li key={z.n} className="vf-mcard glass grid grid-cols-[42%_1fr] items-center gap-5 rounded-[1.75rem] p-3">
            <div className="relative aspect-[9/16] overflow-hidden rounded-[1.3rem] bg-coal">
              <LazyVideo {...vid(z.video)} label={`${z.title} at Good Life Fitness Club`} className="h-full w-full object-cover" />
            </div>
            <div className="pr-2">
              <p className="display text-5xl text-volt">{z.n}</p>
              <h3 className="display mt-3 text-3xl">{z.name}</h3>
              <p className="mt-3 text-[0.95rem] leading-snug text-snow/70">{z.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
