"use client";
import Image from "next/image";
import { useRef, useState } from "react";
import JoinWizard, { type JoinSkin } from "@/components/JoinWizard";
import { Slot } from "@/components/Slot";
import { Chars, Marquee, Price, Spot, Words } from "@/components/fx";
import { gsap, reduced, ScrollTrigger, useGsap } from "@/lib/motion";
import { ALSO, COACHES, FACILITIES, GALLERY, PLANS, bookCoach, img, planMessage, planSave } from "@/lib/content";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL, JOIN_MESSAGE, TEL_URL, whatsapp } from "@/lib/site";
import { Arrow, NAV, go } from "./DayTop";

const pad = (n: number) => String(n).padStart(2, "0");

/** Six panels in a row; the one you point at opens wide (desktop). Phones get a swipeable row of cards. */
export function DayTraining() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useGsap(ref, () => {
    if (reduced()) return;
    gsap.from(".dt-title .w", { yPercent: 115, duration: 1.1, stagger: 0.06, ease: "power4.out", scrollTrigger: { trigger: ".dt-title", start: "top 85%" } });
    gsap.from(".dt-panel", { y: 110, opacity: 0, duration: 1.1, stagger: 0.07, ease: "power4.out", scrollTrigger: { trigger: ".dt-row", start: "top 85%" } });
    gsap.from(".dt-also", { y: 30, opacity: 0, duration: 0.8, stagger: 0.08, ease: "power3.out", scrollTrigger: { trigger: ".dt-alsos", start: "top 92%" } });
  });

  return (
    <section ref={ref} id="training" className="pb-24 md:pb-36">
      <div className="px-5 md:px-10">
        <p className="eyebrow">Training</p>
        <h2 className="dt-title display mt-6 text-[clamp(2.75rem,8vw,8rem)]">
          <Words text="Six ways" className="block" />
          <Words text="to train." className="block text-soft" />
        </h2>
      </div>

      {/* desktop: expanding panels */}
      <div className="dt-row mt-14 hidden h-[72svh] min-h-[520px] gap-2.5 px-5 lg:flex">
        {FACILITIES.map((f, i) => {
          const on = active === i;
          return (
            <button
              key={f.title}
              type="button"
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => setActive(i)}
              aria-expanded={on}
              data-cursor={on ? undefined : "Open"}
              className={`dt-panel relative min-w-0 basis-0 overflow-hidden rounded-[1.75rem] bg-ink text-left text-white transition-[flex-grow] duration-700 ease-[cubic-bezier(.7,0,.2,1)] ${on ? "grow-[6]" : "grow"}`}
            >
              {f.slot ? <Slot id={f.slot} sizes="55vw" /> : <Image src={img(f.img)} alt={on ? f.alt : ""} fill sizes="55vw" className={`object-cover transition-transform duration-[1400ms] ease-out ${on ? "scale-100" : "scale-[1.15]"}`} />}
              <span className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" aria-hidden />
              <span className="absolute left-5 top-5 grid h-9 w-9 place-items-center rounded-full bg-white text-sm font-medium text-ink">{pad(i + 1)}</span>
              <span className={`display absolute bottom-6 left-1/2 -translate-x-1/2 rotate-180 whitespace-nowrap text-2xl transition-opacity duration-300 [writing-mode:vertical-rl] ${on ? "opacity-0" : "opacity-100 delay-300"}`} aria-hidden={on}>
                {f.title}
              </span>
              <span className={`absolute bottom-7 left-7 block w-[min(32rem,38vw)] transition-[opacity,transform] duration-500 ${on ? "translate-y-0 opacity-100 delay-300" : "translate-y-5 opacity-0"}`} aria-hidden={!on}>
                <span className="display block text-[clamp(2.5rem,4.4vw,4.5rem)]">{f.title}</span>
                <span className="mt-3 block text-lg leading-snug text-white/80">{f.text}</span>
              </span>
            </button>
          );
        })}
      </div>

      {/* phones and tablets: swipe through the cards */}
      <ul className="no-bar mt-10 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 lg:hidden">
        {FACILITIES.map((f, i) => (
          <li key={f.title} className="relative aspect-[3/4] w-[78vw] max-w-sm shrink-0 snap-center overflow-hidden rounded-[1.75rem] bg-ink text-white">
            {f.slot ? <Slot id={f.slot} sizes="78vw" /> : <Image src={img(f.img)} alt={f.alt} fill sizes="78vw" className="object-cover" />}
            <span className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" aria-hidden />
            <span className="absolute left-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-white text-sm font-medium text-ink">{pad(i + 1)}</span>
            <div className="absolute inset-x-5 bottom-5">
              <h3 className="display text-4xl">{f.title}</h3>
              <p className="mt-2 leading-snug text-white/80">{f.text}</p>
            </div>
          </li>
        ))}
      </ul>

      <p className="dt-alsos mt-8 flex flex-wrap items-center gap-2.5 px-5 md:px-10">
        {ALSO.map((a) => (
          <span key={a} className="dt-also chip !h-10 !bg-white !px-5 !text-[0.95rem]">
            {a}
          </span>
        ))}
      </p>
    </section>
  );
}

// reel stills are small files, so they stay in narrow tiles; the big photos get the wide ones
const SHAPE: Record<string, string> = {
  "cardio-area.jpg": "aspect-[3/4]",
  "turf-area.jpg": "aspect-[4/3]",
  "floors.jpg": "aspect-square",
  "member-progress.jpg": "aspect-[3/4]",
};

/** Two rows of photos that drift in opposite directions and speed up with the scroll. */
export function DayGallery() {
  const ref = useRef<HTMLElement>(null);

  useGsap(ref, () => {
    if (reduced()) return;
    gsap.from(".dg-title .w", { yPercent: 115, duration: 1.1, stagger: 0.06, ease: "power4.out", scrollTrigger: { trigger: ".dg-title", start: "top 85%" } });
    // rows lean with the scroll speed, then settle
    const skew = gsap.quickTo(".dg-rows", "skewX", { duration: 0.6, ease: "power3.out" });
    let settle: ReturnType<typeof setTimeout> | undefined;
    ScrollTrigger.create({
      trigger: ref.current,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (s) => {
        skew(gsap.utils.clamp(-7, 7, s.getVelocity() / -350));
        clearTimeout(settle);
        settle = setTimeout(() => skew(0), 120);
      },
    });
    return () => clearTimeout(settle);
  });

  // the full-building shot also shows the other shops in the block, so it is left out here
  const shots = GALLERY.filter((g) => g.src !== "building.jpg");
  const rows = [shots.slice(0, 5), shots.slice(5)];

  return (
    <section ref={ref} id="gallery" className="overflow-hidden pb-24 md:pb-36">
      <div className="px-5 md:px-10">
        <p className="eyebrow">Inside</p>
        <h2 className="dg-title display mt-6 text-[clamp(2.75rem,8vw,8rem)]">
          <Words text="Take a look" className="block" />
          <Words text="around." className="block text-soft" />
        </h2>
      </div>

      <div className="dg-rows mt-12 flex flex-col gap-3 md:mt-16 md:gap-4">
        {rows.map((row, r) => (
          <Marquee key={r} reverse={r === 1} speed={45}>
            {row.map((g) => (
              <figure key={g.src} className={`group relative mr-3 h-[32vh] shrink-0 overflow-hidden rounded-[1.5rem] bg-fog md:mr-4 md:h-[42vh] ${SHAPE[g.src] ?? "aspect-[9/16]"}`}>
                <Image src={img(g.src)} alt={g.alt} fill sizes="(min-width:768px) 36vw, 62vw" className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105" />
                <figcaption className="absolute bottom-3 left-3 rounded-full bg-white/95 px-3.5 py-1.5 text-sm font-medium">{g.caption}</figcaption>
              </figure>
            ))}
          </Marquee>
        ))}
      </div>
    </section>
  );
}

export function DayCoaches() {
  const ref = useRef<HTMLElement>(null);

  useGsap(ref, () => {
    if (reduced()) return;
    gsap.from(".dc-title .w", { yPercent: 115, duration: 1.1, stagger: 0.06, ease: "power4.out", scrollTrigger: { trigger: ".dc-title", start: "top 85%" } });
    gsap.from(".dc-card", { y: 120, opacity: 0, rotate: (i) => (i % 2 ? 5 : -5), duration: 1.2, stagger: 0.1, ease: "power4.out", scrollTrigger: { trigger: ".dc-row", start: "top 84%" } });
  });

  return (
    <section ref={ref} id="coaches" className="pb-24 md:pb-36">
      <div className="px-5 md:px-10">
        <p className="eyebrow">Coaches</p>
        <h2 className="dc-title display mt-6 text-[clamp(2.75rem,8vw,8rem)]">
          <Words text="People in" className="block" />
          <Words text="your corner." className="block text-soft" />
        </h2>
      </div>

      <ul className="dc-row no-bar mt-12 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 md:mt-16 md:px-10 lg:grid lg:grid-cols-4 lg:gap-4 lg:overflow-visible">
        {COACHES.map((c, i) => (
          <li key={c.first} className={`dc-card w-[74vw] max-w-sm shrink-0 snap-center sm:w-[44vw] lg:w-auto lg:max-w-none ${i % 2 ? "lg:mt-12" : ""}`}>
            <Spot tilt={9}>
              <a href={bookCoach(`${c.first} ${c.last}`)} target="_blank" rel="noopener noreferrer" data-cursor="Book" className="group relative block aspect-[3/4] overflow-hidden rounded-[1.75rem] bg-fog">
                <Image src={img(c.img)} alt={c.alt} fill sizes="(min-width:1024px) 23vw, 74vw" className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105" />
                <span className="absolute inset-x-2.5 bottom-2.5 flex items-center justify-between gap-3 rounded-[1.3rem] bg-white/95 p-4">
                  <span>
                    <span className="display block text-2xl !leading-none">
                      {c.first} {c.last}
                    </span>
                    <span className="mt-1.5 block text-sm text-soft">{c.role}</span>
                  </span>
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ink text-white transition-[background-color,transform] duration-500 group-hover:-rotate-45 group-hover:bg-brand">
                    <Arrow size={14} />
                  </span>
                </span>
                <span className="sr-only">Book on WhatsApp (opens in a new tab)</span>
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

export function DayPlans() {
  const ref = useRef<HTMLElement>(null);
  const [billing, setBilling] = useState<Billing>("yearly");
  const yearly = billing === "yearly";

  useGsap(ref, () => {
    if (reduced()) return;
    gsap.from(".dp-title .w", { yPercent: 115, duration: 1.1, stagger: 0.06, ease: "power4.out", scrollTrigger: { trigger: ".dp-title", start: "top 85%" } });
    gsap.from(".dp-card", { y: 120, opacity: 0, rotate: (i) => [-5, 0, 5][i], duration: 1.2, stagger: 0.1, ease: "power4.out", scrollTrigger: { trigger: ".dp-grid", start: "top 82%" } });
  });

  return (
    <section ref={ref} id="plans" className="px-3 pb-24 md:px-5 md:pb-36">
      <div className="flex flex-col items-center px-2 text-center">
        <p className="eyebrow">Membership</p>
        <h2 className="dp-title display mt-6 text-[clamp(2.75rem,8vw,8rem)]">
          <Words text="Simple plans." className="block" />
          <Words text="Real results." className="block text-soft" />
        </h2>
        <div role="group" aria-label="Billing period" className="relative mt-9 grid grid-cols-2 rounded-full bg-white p-1.5">
          <span className={`absolute bottom-1.5 left-1.5 top-1.5 w-[calc(50%-0.375rem)] rounded-full bg-ink transition-transform duration-500 ease-[cubic-bezier(.7,0,.2,1)] ${yearly ? "translate-x-full" : ""}`} aria-hidden />
          {(["monthly", "yearly"] as const).map((b) => (
            <button key={b} type="button" onClick={() => setBilling(b)} aria-pressed={billing === b} className={`relative h-11 px-7 text-sm font-medium capitalize transition-colors duration-500 ${billing === b ? "text-white" : "text-soft"}`}>
              {b}
            </button>
          ))}
        </div>
      </div>

      <ul className="dp-grid mx-auto mt-12 grid max-w-6xl gap-3 md:mt-16 lg:grid-cols-3 lg:items-center">
        {PLANS.map((p) => (
          <li key={p.name} className="dp-card">
            <div className={`flex h-full flex-col rounded-[2rem] p-7 transition-[translate,box-shadow] duration-500 hover:-translate-y-2 hover:shadow-[0_40px_70px_-35px_rgba(11,11,12,.45)] md:p-9 ${p.featured ? "bg-ink text-white lg:py-14" : "bg-white"}`}>
              <p className="flex items-center justify-between">
                <span className="display text-3xl">{p.name}</span>
                <span className={`rounded-full px-3.5 py-1.5 text-sm font-medium ${p.featured ? "bg-brand text-white" : "bg-ink/5"}`}>{p.tag}</span>
              </p>
              <p className="mt-9 flex items-baseline gap-2">
                <span className="display text-[clamp(3.25rem,5.6vw,5rem)]">
                  ₹<Price value={yearly ? p.yearly : p.monthly} />
                </span>
                <span className={p.featured ? "text-white/60" : "text-soft"}>/ {yearly ? "year" : "month"}</span>
              </p>
              <p className={`mt-2 h-5 text-sm ${p.featured ? "text-white/60" : "text-soft"}`}>{yearly ? `Save ${planSave(p)}%` : "Billed monthly"}</p>
              <ul className="mt-8 flex flex-1 flex-col gap-3.5">
                {p.perks.map((k) => (
                  <li key={k} className="flex items-center gap-3 leading-snug">
                    <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full ${p.featured ? "bg-white/15" : "bg-ink/5"}`}>
                      <Check />
                    </span>
                    {k}
                  </li>
                ))}
              </ul>
              <a href={planMessage(p.name, billing)} target="_blank" rel="noopener noreferrer" className={`dbtn mt-10 w-full justify-between ${p.featured ? "dbtn-light" : ""}`}>
                Choose {p.name}
                <i>
                  <Arrow />
                </i>
              </a>
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-8 text-center text-sm text-soft">Sample prices for the design.</p>
    </section>
  );
}

const chipBase = "h-12 rounded-full px-5 font-medium transition-[background-color,color,scale] duration-300 active:scale-95";
const JOIN_SKIN: JoinSkin = {
  panel: "rounded-[2rem] bg-white p-6 text-ink md:p-9",
  bar: "bg-ink/10",
  barOn: "bg-brand",
  count: "text-sm font-medium text-soft",
  question: "display text-[clamp(1.9rem,3.4vw,3.1rem)]",
  chip: (on) => `${chipBase} ${on ? "bg-ink text-white" : "bg-ink/5 hover:bg-ink/10"}`,
  tile: (on) => `flex h-32 flex-col items-center justify-center gap-3 rounded-3xl font-medium transition-[background-color,color,scale] duration-300 active:scale-95 ${on ? "bg-ink text-white" : "bg-ink/5 hover:bg-ink hover:text-white"}`,
  label: "block text-sm font-medium text-soft",
  field: "mt-2 h-14 w-full rounded-2xl bg-ink/5 px-5 text-lg text-ink outline-none transition-shadow placeholder:text-ink/30 focus:shadow-[inset_0_0_0_2px_#0b0b0c]",
  error: "text-sm font-medium text-brand",
  back: "h-12 rounded-full px-5 text-sm font-medium text-soft transition-colors hover:text-ink",
  next: "dbtn",
  pass: "rounded-[2rem] bg-brand p-7 text-white md:p-8",
  passSoft: "text-white/70",
  passRule: "border-white/25",
};

export function DayJoin() {
  const ref = useRef<HTMLElement>(null);

  useGsap(ref, () => {
    if (reduced()) return;
    const root = ref.current!;
    gsap.from(".dj-title .w", { yPercent: 115, duration: 1.1, stagger: 0.06, ease: "power4.out", scrollTrigger: { trigger: ".dj-title", start: "top 85%" } });
    gsap.from(".dj-form", { y: 90, opacity: 0, duration: 1.2, ease: "power4.out", scrollTrigger: { trigger: ".dj-form", start: "top 88%" } });
    gsap.fromTo(".dj-panel", { scale: 0.9 }, { scale: 1, ease: "none", scrollTrigger: { trigger: root, start: "top bottom", end: "top 20%", scrub: true } });
    // soft red light that follows the mouse inside the panel
    const x = gsap.quickTo(".dj-glow", "x", { duration: 1.2, ease: "power3" });
    const y = gsap.quickTo(".dj-glow", "y", { duration: 1.2, ease: "power3" });
    const move = (e: MouseEvent) => {
      const r = root.getBoundingClientRect();
      x(e.clientX - r.left);
      y(e.clientY - r.top);
    };
    root.addEventListener("mousemove", move);
    return () => root.removeEventListener("mousemove", move);
  });

  const CONTACTS = [
    { k: "Call", href: TEL_URL, ext: false },
    { k: "WhatsApp", href: whatsapp(JOIN_MESSAGE), ext: true },
    { k: "Instagram", href: INSTAGRAM_URL, ext: true },
  ];

  return (
    <section ref={ref} id="join" className="relative px-3 md:px-5">
      <div className="dj-panel relative overflow-hidden rounded-[2.5rem] bg-ink text-white will-change-transform">
        <span className="dj-glow pointer-events-none absolute left-0 top-0 h-[70vw] w-[70vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(237,37,30,.42),transparent)]" aria-hidden />
        <div className="relative p-5 md:p-10 lg:p-14">
          <div className="flex flex-wrap items-end justify-between gap-8">
            <div>
              <p className="eyebrow !text-white/60">Join</p>
              <h2 className="dj-title display mt-6 text-[clamp(3rem,9vw,9rem)]">
                <Words text="Ready when" className="block" />
                <Words text="you are." className="block text-white/45" />
              </h2>
            </div>
            <ul className="flex flex-wrap gap-2">
              {CONTACTS.map((c) => (
                <li key={c.k}>
                  <a href={c.href} {...(c.ext ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="group flex h-12 items-center gap-3 rounded-full bg-white/10 pl-5 pr-2 font-medium transition-colors duration-300 hover:bg-white hover:text-ink">
                    {c.k}
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-white/15 transition-[background-color,color,transform] duration-500 group-hover:-rotate-45 group-hover:bg-brand group-hover:text-white">
                      <Arrow size={13} />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="dj-form mt-10 md:mt-14">
            <JoinWizard
              skin={JOIN_SKIN}
              arrow={
                <i>
                  <Arrow />
                </i>
              }
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export function DayFooter() {
  const ref = useRef<HTMLElement>(null);

  useGsap(ref, () => {
    if (reduced()) return;
    gsap.from(".dfo-mark .c", { yPercent: 110, duration: 1.2, stagger: 0.05, ease: "power4.out", scrollTrigger: { trigger: ".dfo-mark", start: "top 96%" } });
  });

  return (
    <footer ref={ref} className="overflow-hidden px-5 pt-16 md:px-10 md:pt-24">
      <nav aria-label="Footer" className="flex flex-wrap gap-2">
        {[...NAV, { label: "Gallery", href: "#gallery" }, { label: "Join", href: "#join" }].map((n) => (
          <a key={n.href} href={n.href} onClick={(e) => go(e, n.href)} className="chip !h-11 !bg-white !px-5 !text-[0.95rem] transition-colors hover:!bg-ink hover:text-white">
            {n.label}
          </a>
        ))}
      </nav>
      <p className="dfo-mark display mt-12 select-none overflow-hidden whitespace-nowrap pb-[0.06em] text-center text-[23.5vw] !leading-[0.82] !tracking-[-0.065em]" aria-hidden>
        <Chars text="Good Life" />
      </p>
      <p className="flex flex-wrap justify-between gap-2 border-t border-line py-5 pb-24 text-sm text-soft md:pb-5">
        <span>© {new Date().getFullYear()} Good Life Fitness Club</span>
        <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="hover:text-ink">
          {INSTAGRAM_HANDLE}
        </a>
      </p>
    </footer>
  );
}
