"use client";
import Image from "next/image";
import { useRef } from "react";
import { openJoin } from "./JoinForm";
import { WhatsAppIcon } from "./WhatsAppButton";
import { gsap, reduced, ScrollTrigger, useGsap } from "@/lib/motion";
import { A, INSTAGRAM_HANDLE, INSTAGRAM_URL, JOIN_MESSAGE, PHONE_DISPLAY, TEL_URL, WHATSAPP_URL, whatsapp } from "@/lib/site";

const PhoneIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />
  </svg>
);
const InstaIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
    <rect x="2.5" y="2.5" width="19" height="19" rx="5" />
    <circle cx="12" cy="12" r="4.2" />
    <circle cx="17.6" cy="6.4" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const CONTACTS = [
  { label: "Call us", value: PHONE_DISPLAY, href: TEL_URL, external: false, icon: <PhoneIcon /> },
  { label: "WhatsApp", value: PHONE_DISPLAY, href: WHATSAPP_URL, external: true, icon: <WhatsAppIcon size={20} /> },
  { label: "Instagram", value: INSTAGRAM_HANDLE, href: INSTAGRAM_URL, external: true, icon: <InstaIcon /> },
];
const RIBBON = ["Train hard", "Stay strong", "Live better", "Good Life Fitness Club"];
const ORBIT = "JOIN GOOD LIFE • WHATSAPP US • ";
// verified from the club's signage, photos and videos
const ACCESS = ["3 training floors", "Strength", "Cardio", "Functional turf", "Personal training"];
const PASS = [
  { k: "Floors", v: "03" },
  { k: "Gym", v: "Unisex" },
  { k: "Plans", v: "Ask us" },
];

export default function MembershipCTA() {
  const ref = useRef<HTMLElement>(null);

  useGsap(ref, () => {
    const root = ref.current!;
    const q = gsap.utils.selector(root);
    const mm = gsap.matchMedia();

    // DESKTOP: a graded "window" into the gym opens behind the title, then the content assembles
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: ".m-stage", start: "top top", end: "+=200%", pin: true, scrub: 0.8 },
      });
      tl.fromTo(".m-bg-img", { scale: 1.45 }, { scale: 1, duration: 1 }, 0)
        .fromTo(".m-window", { clipPath: "inset(30% 32% 30% 32% round 18px)" }, { clipPath: "inset(0% 0% 0% 0% round 0px)", duration: 0.45, ease: "power2.inOut" }, 0)
        .fromTo(".m-frame", { opacity: 1 }, { opacity: 0, scale: 1.25, duration: 0.3, ease: "power2.in" }, 0.05)
        .fromTo(".m-intro", { opacity: 1, scale: 1, letterSpacing: "0.02em" }, { opacity: 0, scale: 0.9, letterSpacing: "0.12em", duration: 0.25, ease: "power2.in" }, 0.12)
        .fromTo(".m-shade", { opacity: 0.55 }, { opacity: 1, duration: 0.3 }, 0.25)
        .fromTo(".m-bg-img", { filter: "brightness(.75) saturate(.8)" }, { filter: "brightness(.55) saturate(1)", duration: 0.25 }, 0.3)
        .from(".m-line > span", { yPercent: 115, stagger: 0.04, duration: 0.14, ease: "power3.out" }, 0.48)
        .from(".m-fade", { y: 40, opacity: 0, stagger: 0.035, duration: 0.14, ease: "power3.out" }, 0.56)
        .from(".m-pass", { y: 140, rotationX: 55, opacity: 0, duration: 0.2, ease: "power3.out" }, 0.52)
        .from(".m-orb", { scale: 0, rotation: -140, duration: 0.18, ease: "back.out(1.6)" }, 0.64)
        .from(".m-card", { y: 70, opacity: 0, rotationX: -35, stagger: 0.05, duration: 0.14, ease: "power3.out" }, 0.68)
        .set({}, {}, 1);
    });

    // MOBILE / reduced motion: no pin, simple entrance
    mm.add("(max-width: 767px), (prefers-reduced-motion: reduce)", () => {
      gsap.set(".m-bg-img", { filter: "brightness(.55)" });
      if (reduced()) return;
      gsap.from(".m-line > span", { yPercent: 115, stagger: 0.1, duration: 1.1, ease: "power4.out", scrollTrigger: { trigger: ".m-content", start: "top 80%" } });
      gsap.from([".m-fade", ".m-pass", ".m-card"], { y: 40, opacity: 0, stagger: 0.08, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: ".m-content", start: "top 70%" } });
    });

    if (!reduced()) gsap.to(".m-pass-float", { y: -14, rotation: 1.2, duration: 3.2, ease: "sine.inOut", yoyo: true, repeat: -1 });

    // ribbons: endless marquee whose speed + direction follow scroll velocity
    const loops = q(".m-ribbon-track").map((t, i) =>
      // head start so reversing (scrolling up) never hits time 0
      gsap.fromTo(t, { xPercent: i ? -50 : 0 }, { xPercent: i ? 0 : -50, duration: 28, ease: "none", repeat: -1 }).totalTime(28 * 200),
    );
    if (reduced()) loops.forEach((l) => l.pause());
    else
      ScrollTrigger.create({
        trigger: ".m-ribbons",
        start: "top bottom",
        end: "bottom top",
        onUpdate: (s) => {
          const v = s.getVelocity() / 250;
          const dir = s.direction;
          loops.forEach((l) => {
            gsap.to(l, { timeScale: dir * Math.max(1, Math.abs(v)), duration: 0.2, overwrite: true });
            gsap.to(l, { timeScale: dir, duration: 1.2, delay: 0.25, overwrite: false });
          });
        },
      });

    return () => mm.revert();
  });

  // magnetic orb button
  const magnet = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse") return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    gsap.to(el, { x: (e.clientX - r.left - r.width / 2) * 0.35, y: (e.clientY - r.top - r.height / 2) * 0.35, duration: 0.5, ease: "power3.out" });
  };
  const release = (e: React.PointerEvent<HTMLElement>) => gsap.to(e.currentTarget, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1,0.35)" });

  // member pass: 3D tilt + holographic sheen follow the pointer
  const passMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    gsap.to(el, { rotationY: (x - 0.5) * 18, rotationX: -(y - 0.5) * 14, duration: 0.6, ease: "power3.out" });
    el.style.setProperty("--hx", `${x * 100}%`);
    el.style.setProperty("--hy", `${y * 100}%`);
  };
  const passLeave = (e: React.PointerEvent<HTMLDivElement>) => gsap.to(e.currentTarget, { rotationX: 0, rotationY: 0, duration: 1, ease: "elastic.out(1,0.5)" });

  // cursor spotlight on cards
  const spot = (e: React.PointerEvent<HTMLAnchorElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--x", `${e.clientX - r.left}px`);
    el.style.setProperty("--y", `${e.clientY - r.top}px`);
  };

  return (
    <section ref={ref} id="contact" className="relative bg-ink">
      <div className="m-stage relative flex min-h-[100svh] items-center overflow-hidden">
        {/* real club photography, inside a window that opens on scroll (desktop) */}
        <div className="m-window absolute inset-0 overflow-hidden">
          <Image src={`${A}/floors.jpg`} alt="" fill sizes="100vw" className="m-bg-img object-cover object-[50%_50%]" aria-hidden />
          <div className="m-shade absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,8,8,.96)_0%,rgba(8,8,8,.82)_45%,rgba(8,8,8,.6)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,#080808_0%,rgba(8,8,8,0)_28%,rgba(8,8,8,0)_68%,#080808_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_45%_55%_at_78%_55%,rgba(237,37,30,.28),transparent_70%)]" />
          </div>
        </div>

        {/* content */}
        <div className="m-content relative z-10 mx-auto w-full px-5 py-28 md:px-10 md:py-14">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <p className="m-fade eyebrow mb-7">Membership</p>
              <h2 className="display text-[clamp(3rem,6.4vw,7.2rem)]">
                <span className="m-line line"><span>Your next chapter</span></span>
                <span className="m-line line">
                  <span>
                    starts <span className="text-brand [text-shadow:0_0_50px_rgba(237,37,30,.45)]">here.</span>
                  </span>
                </span>
              </h2>
              <p className="m-fade mt-6 max-w-xl text-lg leading-relaxed text-white/75">
                Membership plans are shared directly by our team. Message us on WhatsApp or give us a call for current plans and to book your first visit.
              </p>
              <ul className="m-fade mt-7 flex flex-wrap gap-x-6 gap-y-3">
                {ACCESS.map((a) => (
                  <li key={a} className="flex items-center gap-2.5 font-head text-xs uppercase tracking-[0.2em] text-white/85">
                    <span className="grid h-5 w-5 place-items-center rounded-full bg-brand/15 text-brand ring-1 ring-brand/50">
                      <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden>
                        <path d="M2 6.5 5 9l5-6" stroke="currentColor" strokeWidth="1.8" />
                      </svg>
                    </span>
                    {a}
                  </li>
                ))}
              </ul>
              <div className="m-fade mt-9 flex flex-col gap-3 sm:flex-row sm:gap-4">
                <a href={whatsapp(JOIN_MESSAGE)} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                  <WhatsAppIcon size={18} />
                  Join Good Life
                </a>
                <a href={TEL_URL} className="btn btn-ghost">
                  Contact us
                </a>
              </div>
            </div>

            {/* member pass with docked magnetic JOIN */}
            <div className="relative flex justify-center pb-16 lg:col-span-4 lg:pb-0">
              <div className="m-pass relative w-full max-w-[400px] [perspective:1200px]">
                <div className="m-pass-float relative">
                  {/* back card for depth */}
                  <div className="absolute inset-0 translate-x-5 translate-y-4 rotate-[7deg] rounded-2xl bg-gradient-to-br from-brand to-brand-deep opacity-90 shadow-[0_30px_80px_rgba(237,37,30,.35)]" aria-hidden />
                  <div
                    onPointerMove={passMove}
                    onPointerLeave={passLeave}
                    className="relative aspect-[1.6] overflow-hidden rounded-2xl border border-white/15 bg-[linear-gradient(135deg,#1c1c1c_0%,#0c0c0c_55%,#161616_100%)] p-6 shadow-[0_40px_90px_rgba(0,0,0,.7)]"
                  >
                    {/* holographic sheen */}
                    <div className="pointer-events-none absolute inset-0 opacity-60 mix-blend-overlay [background:radial-gradient(circle_at_var(--hx,30%)_var(--hy,20%),rgba(255,255,255,.55),transparent_45%),linear-gradient(115deg,transparent_30%,rgba(237,37,30,.35)_45%,rgba(255,255,255,.25)_52%,transparent_65%)]" aria-hidden />
                    <div className="pointer-events-none absolute -right-10 top-0 h-full w-24 skew-x-[-18deg] bg-brand/80" aria-hidden />
                    <div className="pointer-events-none absolute right-1 top-0 h-full w-3 skew-x-[-18deg] bg-white/80" aria-hidden />

                    <div className="relative flex items-center gap-3">
                      <Image src={`${A}/logo.png`} alt="" width={44} height={44} className="h-11 w-11 rounded-full" />
                      <p className="font-head text-[0.65rem] uppercase leading-tight tracking-[0.28em]">
                        Good <span className="text-brand">Life</span>
                        <br />
                        <span className="text-mist">Fitness Club</span>
                      </p>
                    </div>
                    <p className="relative mt-5 font-head text-[0.6rem] uppercase tracking-[0.4em] text-mist">Member pass</p>
                    <p className="display relative text-5xl leading-none">
                      All <span className="text-brand">access</span>
                    </p>
                    <dl className="absolute inset-x-6 bottom-5 grid grid-cols-3 gap-3 border-t border-white/10 pt-3 pr-10">
                      {PASS.map((f) => (
                        <div key={f.k}>
                          <dt className="font-head text-[0.55rem] uppercase tracking-[0.3em] text-mist">{f.k}</dt>
                          <dd className="font-display text-xl leading-tight">{f.v}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>

                  {/* docked magnetic orb */}
                  <div className="m-orb absolute -bottom-20 -left-6 grid h-40 w-40 place-items-center md:-left-16">
                    <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full [animation:spin-slow_14s_linear_infinite]" aria-hidden>
                      <defs>
                        <path id="orb-circle" d="M100,100 m-84,0 a84,84 0 1,1 168,0 a84,84 0 1,1 -168,0" />
                      </defs>
                      <text fill="rgba(255,255,255,.8)" fontSize="15" letterSpacing="4" fontFamily="var(--font-oswald)">
                        <textPath href="#orb-circle">{ORBIT}</textPath>
                      </text>
                    </svg>
                    <button
                      type="button"
                      onClick={openJoin}
                      onPointerMove={magnet}
                      onPointerLeave={release}
                      aria-haspopup="dialog"
                      aria-label="Join Good Life — open the membership form"
                      className="group relative grid h-24 w-24 place-items-center rounded-full bg-brand shadow-[0_0_50px_rgba(237,37,30,.6)] transition-[box-shadow] duration-500 hover:shadow-[0_0_90px_rgba(237,37,30,.9)]"
                    >
                      <span className="absolute inset-0 rounded-full border border-brand [animation:pulse-ring_2.6s_ease-out_infinite]" aria-hidden />
                      <span className="display text-3xl leading-none transition-transform duration-500 group-hover:scale-110">Join</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <ul className="mt-16 grid gap-3 [perspective:1000px] sm:grid-cols-3 md:mt-12">
            {CONTACTS.map((c, i) => (
              <li key={c.label} className="m-card">
                <a
                  href={c.href}
                  {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  onPointerMove={spot}
                  className="group relative flex min-h-24 items-center gap-5 overflow-hidden border border-white/10 bg-black/55 p-5 backdrop-blur-sm transition-colors duration-500 hover:border-brand/60 md:p-6"
                  style={{ backgroundImage: "radial-gradient(260px circle at var(--x,-300px) var(--y,-300px), rgba(237,37,30,.28), transparent 70%)" }}
                >
                  <span className="absolute inset-0 origin-left scale-x-0 bg-gradient-to-r from-brand/25 to-transparent transition-transform duration-700 ease-[cubic-bezier(.7,0,.2,1)] group-hover:scale-x-100" aria-hidden />
                  <span className="absolute right-5 top-4 font-display text-sm tracking-widest text-white/25">0{i + 1}</span>
                  <span className="relative grid h-14 w-14 shrink-0 place-items-center rounded-full border border-white/15 text-white transition duration-500 group-hover:border-brand group-hover:bg-brand">
                    {c.icon}
                  </span>
                  <span className="relative flex min-w-0 flex-col gap-1">
                    <span className="font-head text-[0.65rem] uppercase tracking-[0.3em] text-mist">{c.label}</span>
                    <span className="truncate font-head text-lg tracking-wider">{c.value}</span>
                  </span>
                  <svg className="ml-auto h-3 w-5 shrink-0 -translate-x-2 opacity-0 transition duration-500 group-hover:translate-x-0 group-hover:opacity-100" viewBox="0 0 16 10" fill="none" aria-hidden>
                    <path d="M0 5h14M10 1l4 4-4 4" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                  <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-brand transition-all duration-700 group-hover:w-full" aria-hidden />
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* intro (desktop): red hairline frame around the closed window + title, both dissolve as it opens */}
        <div className="pointer-events-none absolute inset-0 z-20 hidden items-center justify-center md:flex motion-reduce:!hidden" aria-hidden>
          <span className="m-frame absolute inset-[30%_32%] rounded-[18px] border border-brand/70 shadow-[0_0_60px_rgba(237,37,30,.35)]" />
          <div className="m-intro relative text-center">
            <p className="eyebrow mb-4 justify-center">Membership</p>
            <p className="display text-[clamp(3rem,7vw,8rem)] leading-none [text-shadow:0_10px_40px_rgba(0,0,0,.8)]">
              Step into the good <span className="text-brand [text-shadow:0_0_50px_rgba(237,37,30,.5)]">life</span>
            </p>
          </div>
        </div>
      </div>

      {/* luxury strip: steel + outline type on charcoal, hairline-framed, edges fading out */}
      <div className="m-ribbons relative overflow-hidden border-y border-white/[0.06] bg-[linear-gradient(180deg,#0b0b0b_0%,#161616_50%,#0b0b0b_100%)] py-10 md:py-14" aria-hidden>
        <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand to-transparent" />
        <span className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
        <span className="absolute left-1/2 top-1/2 h-40 w-[60vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/10 blur-3xl" />
        <div className="relative [mask-image:linear-gradient(90deg,transparent,#000_14%,#000_86%,transparent)]">
          <div className="m-ribbon-track flex w-max">
            {[0, 1].map((k) => (
              <span key={k} className="flex shrink-0 items-center">
                {Array.from({ length: 3 }, () => RIBBON)
                  .flat()
                  .map((w, j) => (
                    <span key={j} className="flex items-center whitespace-nowrap">
                      <span className={`display text-5xl leading-none tracking-[0.04em] md:text-8xl ${j % 2 ? "outline-text" : "metal"}`}>{w}</span>
                      <span className="mx-8 h-2 w-2 rotate-45 bg-brand shadow-[0_0_14px_rgba(237,37,30,.9)] md:mx-14 md:h-2.5 md:w-2.5" />
                    </span>
                  ))}
              </span>
            ))}
          </div>
          <div className="m-ribbon-track mt-6 flex w-max md:mt-8">
            {[0, 1].map((k) => (
              <span key={k} className="flex shrink-0 items-center">
                {Array.from({ length: 4 }, () => ACCESS)
                  .flat()
                  .map((w, j) => (
                    <span key={j} className="flex items-center whitespace-nowrap font-head text-[0.65rem] uppercase tracking-[0.55em] text-mist md:text-xs">
                      {w}
                      <span className="mx-6 h-px w-8 bg-gradient-to-r from-brand to-transparent md:mx-10 md:w-12" />
                    </span>
                  ))}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
