"use client";
import Image from "next/image";
import { useRef, useState } from "react";
import JoinWizard, { type JoinSkin } from "@/components/JoinWizard";
import { Slot } from "@/components/Slot";
import { Chars, Magnetic, Marquee, Price, Spot, Words } from "@/components/fx";
import { gsap, reduced, useGsap } from "@/lib/motion";
import { ALSO, COACHES, FACILITIES, PLANS, bookCoach, img, planMessage, planSave } from "@/lib/content";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL, JOIN_MESSAGE, TEL_URL, whatsapp } from "@/lib/site";
import { Arrow, NAV, Spark, go } from "./VoltTop";

const pad = (n: number) => String(n).padStart(2, "0");

/** List of what the club offers. Desktop: a photo follows the cursor and leans with its speed. Phones: tap a row to open it. */
export function VoltTraining() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useGsap(ref, () => {
    const root = ref.current!;
    const float = root.querySelector<HTMLElement>(".vt-float")!;
    const list = root.querySelector<HTMLElement>(".vt-list")!;
    if (!reduced()) {
      gsap.from(".vt-title .w", { yPercent: 115, duration: 1.1, stagger: 0.06, ease: "power4.out", scrollTrigger: { trigger: ".vt-title", start: "top 85%" } });
      gsap.from(".vt-row", { y: 60, opacity: 0, duration: 0.9, stagger: 0.07, ease: "power3.out", scrollTrigger: { trigger: list, start: "top 85%" } });
    }
    const mm = gsap.matchMedia();
    mm.add("(hover: hover) and (min-width: 1024px)", () => {
      gsap.set(float, { scale: 0.6, opacity: 0 });
      const x = gsap.quickTo(float, "x", { duration: 0.5, ease: "power3" });
      const y = gsap.quickTo(float, "y", { duration: 0.5, ease: "power3" });
      const tilt = gsap.quickTo(float, "rotate", { duration: 0.6, ease: "power3" });
      let lastX = 0;
      let rest: ReturnType<typeof setTimeout> | undefined;
      const move = (e: MouseEvent) => {
        x(e.clientX);
        y(e.clientY);
        tilt(gsap.utils.clamp(-14, 14, (e.clientX - lastX) * 0.6));
        lastX = e.clientX;
        clearTimeout(rest);
        rest = setTimeout(() => tilt(0), 120);
      };
      const enter = (e: MouseEvent) => {
        lastX = e.clientX;
        gsap.set(float, { x: e.clientX, y: e.clientY });
        gsap.to(float, { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.6)" });
      };
      const leave = () => gsap.to(float, { scale: 0.6, opacity: 0, duration: 0.3 });
      list.addEventListener("mousemove", move);
      list.addEventListener("mouseenter", enter);
      list.addEventListener("mouseleave", leave);
      return () => {
        clearTimeout(rest);
        list.removeEventListener("mousemove", move);
        list.removeEventListener("mouseenter", enter);
        list.removeEventListener("mouseleave", leave);
      };
    });
  });

  return (
    <section ref={ref} id="training" className="pb-24 pt-24 md:pb-36 md:pt-36">
      <div className="px-5 md:px-10">
        <p className="tag">Training</p>
        <h2 className="vt-title display mt-6 text-[clamp(2.6rem,7.6vw,7.5rem)]">
          <Words text="Six ways" className="block" />
          <Words text="to train." className="block text-volt" />
        </h2>
      </div>

      <ul className="vt-list mt-12 border-t border-white/10 md:mt-16">
        {FACILITIES.map((f, i) => {
          const on = active === i;
          return (
            <li key={f.title} className="vt-row border-b border-white/10" onMouseEnter={() => setActive(i)}>
              <button
                type="button"
                onClick={() => setActive(i)}
                onFocus={() => setActive(i)}
                aria-expanded={on}
                className="grid w-full grid-cols-[2.25rem_1fr_auto] items-center gap-x-3 px-5 py-5 text-left md:px-10 lg:grid-cols-[4rem_1fr_20rem_3rem] lg:py-6"
              >
                <span className={`text-sm font-medium tabular-nums transition-colors duration-300 ${on ? "text-volt" : "text-smoke"}`}>{pad(i + 1)}</span>
                <span className={`display text-[8.4vw] transition-[color,transform] duration-500 lg:text-[5.2vw] ${on ? "text-snow lg:translate-x-5" : "text-snow/35"}`}>{f.title}</span>
                <span className={`hidden leading-snug transition-colors duration-300 lg:block ${on ? "text-snow/80" : "text-smoke/50"}`}>{f.text}</span>
                <span className={`grid h-10 w-10 place-items-center justify-self-end rounded-full transition-[background-color,color,transform] duration-500 ${on ? "bg-volt text-night lg:-rotate-45" : "bg-white/5 text-snow/50"}`}>
                  <Arrow size={15} />
                </span>
              </button>
              {/* phones and tablets: the row opens */}
              <div className={`grid transition-[grid-template-rows] duration-500 lg:hidden ${on ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                <div className="overflow-hidden">
                  <div className="grid grid-cols-[40%_1fr] gap-4 px-5 pb-6 md:px-10">
                    <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-coal">
                      {f.slot ? <Slot id={f.slot} fallback={img(f.img)} sizes="40vw" /> : <Image src={img(f.img)} alt={f.alt} fill sizes="40vw" className="object-cover" />}
                    </div>
                    <p className="self-center text-lg leading-snug text-snow/80">{f.text}</p>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {/* desktop: photo that follows the cursor over the list */}
      <div className="vt-float pointer-events-none fixed left-0 top-0 z-30 hidden w-[18vw] min-w-[230px] -translate-y-1/2 translate-x-12 opacity-0 lg:block" aria-hidden>
        <div className="relative aspect-[3/4] overflow-hidden rounded-3xl bg-coal shadow-[0_40px_80px_-20px_rgba(0,0,0,.9)] ring-1 ring-white/15">
          {FACILITIES.map((f, i) => {
            const cls = `transition-[opacity,transform] duration-500 ${active === i ? "scale-100 opacity-100" : "scale-110 opacity-0"}`;
            return f.slot ? <Slot key={f.title} id={f.slot} fallback={img(f.img)} sizes="18vw" className={cls} /> : <Image key={f.title} src={img(f.img)} alt="" fill sizes="18vw" className={`object-cover ${cls}`} />;
          })}
        </div>
      </div>

      <p className="mt-10 flex flex-wrap items-center gap-2.5 px-5 md:px-10">
        {ALSO.map((a) => (
          <span key={a} className="glass rounded-full px-4 py-2 text-sm font-medium">
            {a}
          </span>
        ))}
      </p>
    </section>
  );
}

// collage that zooms as you scroll; the centre photo ends up filling the screen
const TILES = [
  { src: "turf-area.jpg", alt: "Covered turf zone with battle ropes and plyo boxes", box: "h-[25vh] w-[25vw]", scale: 4 },
  { src: "cardio-area.jpg", alt: "Cardio floor with treadmills and blue lighting", box: "-top-[30vh] left-[5vw] h-[30vh] w-[35vw]", scale: 5 },
  { src: "stills/stair-climber.jpg", alt: "Member on the stair climber by the windows", box: "-top-[10vh] -left-[25vw] h-[45vh] w-[20vw]", scale: 6 },
  { src: "floors.jpg", alt: "Good Life Fitness Club facade lit up at night", box: "left-[27.5vw] h-[25vh] w-[25vw]", scale: 5 },
  { src: "stills/battle-ropes.jpg", alt: "Member training with battle ropes", box: "left-[5vw] top-[27.5vh] h-[25vh] w-[20vw]", scale: 6 },
  { src: "member-progress.jpg", alt: "Member checking progress in the mirror", box: "-left-[22.5vw] top-[27.5vh] h-[25vh] w-[30vw]", scale: 8 },
  { src: "stills/entrance.jpg", alt: "The neon-lit entrance to the gym", box: "left-[25vw] top-[22.5vh] h-[15vh] w-[15vw]", scale: 9 },
];

export function VoltGallery() {
  const ref = useRef<HTMLElement>(null);

  useGsap(ref, () => {
    if (reduced()) return;
    const st = { trigger: ref.current, start: "top top", end: "bottom bottom", scrub: true };
    gsap.utils.toArray<HTMLElement>(".vg-tile").forEach((el, i) => {
      gsap.to(el, { scale: TILES[i].scale, ease: "none", scrollTrigger: st });
    });
    gsap.to(".vg-head", { opacity: 0, yPercent: -40, ease: "none", scrollTrigger: { trigger: ref.current, start: "top top", end: "18% top", scrub: true } });
    gsap.fromTo(".vg-end", { opacity: 0, y: 40 }, { opacity: 1, y: 0, ease: "none", scrollTrigger: { trigger: ref.current, start: "72% bottom", end: "bottom bottom", scrub: true } });
  });

  return (
    <section ref={ref} id="gallery" className="relative h-[320vh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {TILES.map((t) => (
          <div key={t.src} className="vg-tile absolute inset-0 flex items-center justify-center will-change-transform">
            <div className={`relative overflow-hidden rounded-xl bg-coal ${t.box}`}>
              <Image src={img(t.src)} alt={t.alt} fill sizes="(min-width:1024px) 60vw, 90vw" className="object-cover" />
            </div>
          </div>
        ))}
        <div className="vg-head pointer-events-none absolute inset-x-0 top-24 z-10 px-5 text-center md:top-28">
          <p className="tag">Inside</p>
          <h2 className="display mt-4 text-[clamp(2.2rem,5.4vw,5rem)] [text-shadow:0_4px_40px_rgba(0,0,0,.9)]">Step inside.</h2>
        </div>
        <div className="vg-end pointer-events-none absolute inset-0 z-10 flex flex-col justify-end bg-gradient-to-t from-night via-night/20 to-transparent p-5 opacity-0 md:p-10">
          <p className="display text-[clamp(2.4rem,7vw,7rem)]">
            Real floors. <span className="text-volt">Real work.</span>
          </p>
        </div>
      </div>
    </section>
  );
}

export function VoltCoaches() {
  const ref = useRef<HTMLElement>(null);

  useGsap(ref, () => {
    if (reduced()) return;
    gsap.from(".vc-title .w", { yPercent: 115, duration: 1.1, stagger: 0.06, ease: "power4.out", scrollTrigger: { trigger: ".vc-title", start: "top 85%" } });
    gsap.from(".vc-card", { y: 120, opacity: 0, rotateX: -18, transformPerspective: 900, duration: 1.2, stagger: 0.1, ease: "power4.out", scrollTrigger: { trigger: ".vc-row", start: "top 84%" } });
  });

  return (
    <section ref={ref} id="coaches" className="pb-24 pt-24 md:pb-36 md:pt-36">
      <div className="px-5 md:px-10">
        <p className="tag">Coaches</p>
        <h2 className="vc-title display mt-6 text-[clamp(2.6rem,7.6vw,7.5rem)]">
          <Words text="People in" className="block" />
          <Words text="your corner." className="block text-volt" />
        </h2>
      </div>

      <ul className="vc-row no-bar mt-12 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 md:mt-16 md:px-10 lg:grid lg:grid-cols-4 lg:gap-4 lg:overflow-visible">
        {COACHES.map((c, i) => (
          <li key={c.first} className="vc-card w-[74vw] max-w-sm shrink-0 snap-center sm:w-[44vw] lg:w-auto lg:max-w-none">
            <Spot tilt={10} className="spot rounded-[1.75rem]">
              <a href={bookCoach(`${c.first} ${c.last}`)} target="_blank" rel="noopener noreferrer" data-cursor="Book" className="group relative block aspect-[3/4] overflow-hidden rounded-[1.75rem] bg-coal">
                <Image src={img(c.img)} alt={c.alt} fill sizes="(min-width:1024px) 23vw, 74vw" className="object-cover transition-[filter,transform] duration-[900ms] ease-out group-hover:scale-105 lg:grayscale lg:group-hover:grayscale-0 lg:group-focus-visible:grayscale-0" />
                <span className="absolute inset-0 bg-gradient-to-t from-night via-night/20 to-transparent" aria-hidden />
                <span className="absolute left-4 top-4 rounded-full bg-night/80 px-3 py-1 text-xs font-medium tabular-nums">{pad(i + 1)}</span>
                <span className="absolute inset-x-5 bottom-5 block">
                  <span className="block text-xs font-medium uppercase tracking-[0.16em] text-volt">{c.role}</span>
                  <span className="display mt-2 block text-3xl">
                    {c.first} {c.last}
                  </span>
                  <span className="grid grid-rows-[1fr] transition-[grid-template-rows] duration-500 lg:grid-rows-[0fr] lg:group-hover:grid-rows-[1fr] lg:group-focus-visible:grid-rows-[1fr]">
                    <span className="overflow-hidden">
                      <span className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-volt">
                        Book a session <Arrow size={14} />
                      </span>
                    </span>
                  </span>
                </span>
                <span className="sr-only">(opens WhatsApp in a new tab)</span>
              </a>
            </Spot>
          </li>
        ))}
      </ul>
    </section>
  );
}

type Billing = "monthly" | "yearly";

const Check = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);

export function VoltPlans() {
  const ref = useRef<HTMLElement>(null);
  const [billing, setBilling] = useState<Billing>("yearly");
  const yearly = billing === "yearly";

  useGsap(ref, () => {
    if (reduced()) return;
    gsap.from(".vp-title .w", { yPercent: 115, duration: 1.1, stagger: 0.06, ease: "power4.out", scrollTrigger: { trigger: ".vp-title", start: "top 85%" } });
    gsap.from(".vp-card", { y: 110, opacity: 0, scale: 0.92, duration: 1.1, stagger: 0.1, ease: "power4.out", scrollTrigger: { trigger: ".vp-grid", start: "top 84%" } });
  });

  return (
    <section ref={ref} id="plans" className="relative px-5 pb-24 md:px-10 md:pb-36">
      <div className="flex flex-col items-center text-center">
        <p className="tag">Membership</p>
        <h2 className="vp-title display mt-6 text-[clamp(2.6rem,7.6vw,7.5rem)]">
          <Words text="Simple plans." className="block" />
          <Words text="Real results." className="block text-volt" />
        </h2>
        <div role="group" aria-label="Billing period" className="glass relative mt-9 grid grid-cols-2 rounded-full p-1.5">
          <span className={`absolute bottom-1.5 left-1.5 top-1.5 w-[calc(50%-0.375rem)] rounded-full bg-volt transition-transform duration-500 ease-[cubic-bezier(.7,0,.2,1)] ${yearly ? "translate-x-full" : ""}`} aria-hidden />
          {(["monthly", "yearly"] as const).map((b) => (
            <button key={b} type="button" onClick={() => setBilling(b)} aria-pressed={billing === b} className={`relative h-11 px-7 text-sm font-semibold capitalize transition-colors duration-500 ${billing === b ? "text-night" : "text-snow/70"}`}>
              {b}
            </button>
          ))}
        </div>
      </div>

      <ul className="vp-grid mx-auto mt-12 grid max-w-6xl gap-3 md:mt-16 lg:grid-cols-3 lg:items-center">
        {PLANS.map((p) => (
          <li key={p.name} className="vp-card">
            <Spot className={`flex h-full flex-col rounded-[2rem] p-7 md:p-9 ${p.featured ? "bg-volt text-night shadow-[0_0_90px_-20px_rgba(200,255,62,.55)] lg:py-14" : "spot glass"}`}>
              <p className="flex items-center justify-between">
                <span className="display text-3xl">{p.name}</span>
                <span className={`rounded-full px-3.5 py-1.5 text-sm font-medium ${p.featured ? "bg-night text-volt" : "bg-white/10"}`}>{p.tag}</span>
              </p>
              <p className="mt-9 flex items-baseline gap-2">
                <span className="display text-[clamp(3rem,5.2vw,4.75rem)]">
                  ₹<Price value={yearly ? p.yearly : p.monthly} />
                </span>
                <span className={p.featured ? "text-night/65" : "text-smoke"}>/ {yearly ? "year" : "month"}</span>
              </p>
              <p className={`mt-2 h-5 text-sm ${p.featured ? "text-night/65" : "text-smoke"}`}>{yearly ? `Save ${planSave(p)}%` : "Billed monthly"}</p>
              <ul className="mt-8 flex flex-1 flex-col gap-3.5">
                {p.perks.map((k) => (
                  <li key={k} className="flex items-center gap-3 leading-snug">
                    <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full ${p.featured ? "bg-night text-volt" : "bg-volt/15 text-volt"}`}>
                      <Check />
                    </span>
                    {k}
                  </li>
                ))}
              </ul>
              <a href={planMessage(p.name, billing)} target="_blank" rel="noopener noreferrer" className={`vbtn mt-10 w-full ${p.featured ? "vbtn-dark" : ""}`}>
                Choose {p.name} <Arrow />
              </a>
            </Spot>
          </li>
        ))}
      </ul>
      <p className="mt-8 text-center text-sm text-smoke">Sample prices for the design.</p>
    </section>
  );
}

const chipBase = "h-12 rounded-full px-5 font-medium transition-[background-color,color,scale] duration-300 active:scale-95";
const JOIN_SKIN: JoinSkin = {
  panel: "glass rounded-[2rem] p-6 md:p-9",
  bar: "bg-white/10",
  barOn: "bg-volt",
  count: "text-sm font-medium text-smoke",
  question: "display text-[clamp(1.8rem,3.2vw,2.9rem)]",
  chip: (on) => `${chipBase} ${on ? "bg-volt text-night" : "bg-white/5 text-snow/85 ring-1 ring-inset ring-white/10 hover:bg-white/10"}`,
  tile: (on) => `flex h-32 flex-col items-center justify-center gap-3 rounded-3xl font-medium transition-[background-color,color,scale] duration-300 active:scale-95 ${on ? "bg-volt text-night" : "bg-white/5 text-snow ring-1 ring-inset ring-white/10 hover:bg-volt hover:text-night"}`,
  label: "block text-sm font-medium text-smoke",
  field: "mt-2 h-14 w-full rounded-2xl bg-white/5 px-5 text-lg text-snow outline-none ring-1 ring-inset ring-white/10 transition-shadow placeholder:text-snow/25 focus:ring-2 focus:ring-volt",
  error: "text-sm font-medium text-volt",
  back: "h-12 rounded-full px-5 text-sm font-medium text-smoke transition-colors hover:text-snow",
  next: "vbtn",
  pass: "rounded-[2rem] bg-volt p-7 text-night shadow-[0_0_90px_-25px_rgba(200,255,62,.6)] md:p-8",
  passSoft: "text-night/60",
  passRule: "border-night/20",
};

export function VoltJoin() {
  const ref = useRef<HTMLElement>(null);

  useGsap(ref, () => {
    if (reduced()) return;
    gsap.from(".vj-title .w", { yPercent: 115, duration: 1.1, stagger: 0.06, ease: "power4.out", scrollTrigger: { trigger: ".vj-title", start: "top 85%" } });
    gsap.from(".vj-form", { y: 90, opacity: 0, duration: 1.2, ease: "power4.out", scrollTrigger: { trigger: ".vj-form", start: "top 88%" } });
    gsap.from(".vj-orb", { scale: 0, rotate: -120, duration: 1.1, ease: "back.out(1.6)", scrollTrigger: { trigger: ".vj-orb", start: "top 92%" } });
  });

  const CONTACTS = [
    { k: "Call", href: TEL_URL, ext: false },
    { k: "WhatsApp", href: whatsapp(JOIN_MESSAGE), ext: true },
    { k: "Instagram", href: INSTAGRAM_URL, ext: true },
  ];

  return (
    <section ref={ref} id="join" className="relative overflow-hidden border-t border-white/10 pb-24 pt-10 md:pb-32">
      <span className="pointer-events-none absolute left-1/2 top-0 h-[110vh] w-[130vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(200,255,62,.2),transparent)]" aria-hidden />
      <div className="relative">
        <Marquee speed={70} className="display py-6 text-[17vw] uppercase !leading-none md:text-[12vw]">
          <span className="flex items-center gap-[0.25em] pr-[0.25em]">
            Your move <Spark className="text-volt" /> <span className="ghost">Your move</span> <Spark className="text-volt" />
          </span>
        </Marquee>
        <div className="vj-orb absolute right-[8vw] top-1/2 z-10 -translate-y-1/2">
          <Magnetic strength={0.4}>
            <a href={whatsapp(JOIN_MESSAGE)} target="_blank" rel="noopener noreferrer" className="group relative grid h-28 w-28 place-items-center rounded-full bg-volt text-center text-sm font-semibold leading-tight text-night shadow-[0_0_60px_-8px_rgba(200,255,62,.7)] md:h-40 md:w-40 md:text-base">
              <span className="absolute inset-0 rounded-full border border-volt [animation:pulse-ring_2.4s_ease-out_infinite]" aria-hidden />
              <span>
                Chat on
                <br />
                WhatsApp
              </span>
            </a>
          </Magnetic>
        </div>
      </div>

      <div className="relative mt-14 px-5 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <p className="tag">Join</p>
            <h2 className="vj-title display mt-6 text-[clamp(2.8rem,8vw,8rem)]">
              <Words text="Ready when" className="block" />
              <Words text="you are." className="block text-volt" />
            </h2>
          </div>
          <ul className="flex flex-wrap gap-2">
            {CONTACTS.map((c) => (
              <li key={c.k}>
                <a href={c.href} {...(c.ext ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="glass group flex h-12 items-center gap-3 rounded-full pl-5 pr-2 font-medium transition-colors duration-300 hover:bg-volt hover:text-night">
                  {c.k}
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-white/10 transition-[background-color,transform] duration-500 group-hover:-rotate-45 group-hover:bg-night group-hover:text-volt">
                    <Arrow size={13} />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="vj-form mt-10 md:mt-14">
          <JoinWizard skin={JOIN_SKIN} arrow={<Arrow />} />
        </div>
      </div>
    </section>
  );
}

export function VoltFooter() {
  const ref = useRef<HTMLElement>(null);

  useGsap(ref, () => {
    if (reduced()) return;
    gsap.from(".vfo-mark .c", { yPercent: 110, duration: 1.2, stagger: 0.05, ease: "power4.out", scrollTrigger: { trigger: ".vfo-mark", start: "top 96%" } });
  });

  return (
    <footer ref={ref} className="overflow-hidden border-t border-white/10 px-5 pt-14 md:px-10 md:pt-20">
      <div className="flex flex-wrap items-start justify-between gap-10">
        <nav aria-label="Footer" className="flex flex-wrap gap-2">
          {[...NAV, { label: "Gallery", href: "#gallery" }, { label: "Join", href: "#join" }].map((n) => (
            <a key={n.href} href={n.href} onClick={(e) => go(e, n.href)} className="glass rounded-full px-5 py-2.5 text-[0.95rem] font-medium transition-colors hover:bg-volt hover:text-night">
              {n.label}
            </a>
          ))}
        </nav>
      </div>
      <p className="vfo-mark display mt-12 select-none overflow-hidden whitespace-nowrap pb-[0.06em] text-center text-[17.5vw] uppercase !leading-[0.82] !tracking-[-0.06em]" aria-hidden>
        <Chars text="Good Life" />
      </p>
      <p className="flex flex-wrap justify-between gap-2 border-t border-white/10 py-5 pb-24 text-sm text-smoke md:pb-5">
        <span>© {new Date().getFullYear()} Good Life Fitness Club</span>
        <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="hover:text-volt">
          {INSTAGRAM_HANDLE}
        </a>
      </p>
    </footer>
  );
}
