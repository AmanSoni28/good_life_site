"use client";
import Image from "next/image";
import { useRef } from "react";
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
const ORBIT = "JOIN GOOD LIFE • WHATSAPP US • JOIN GOOD LIFE • WHATSAPP US • ";

export default function MembershipCTA() {
  const ref = useRef<HTMLElement>(null);

  useGsap(ref, () => {
    const root = ref.current!;
    const q = gsap.utils.selector(root);
    const mm = gsap.matchMedia();

    // DESKTOP: fly through the "I" of LIFE into the gym, then assemble the content
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const mask = q(".m-mask")[0] as HTMLElement;
      const letter = q(".m-i")[0] as HTMLElement;
      const setOrigin = () => {
        gsap.set(mask, { scale: 1 });
        const r = letter.getBoundingClientRect();
        const m = mask.getBoundingClientRect();
        gsap.set(mask, { transformOrigin: `${r.left - m.left + r.width / 2}px ${r.top - m.top + r.height * 0.55}px` });
      };
      setOrigin();
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: ".m-stage", start: "top top", end: "+=220%", pin: true, scrub: 0.8, invalidateOnRefresh: true, onRefreshInit: setOrigin },
      });
      tl.fromTo(".m-bg-img", { scale: 1.35 }, { scale: 1, duration: 1 }, 0)
        .to(".m-mask-sub", { opacity: 0, y: -40, duration: 0.12 }, 0.04)
        .fromTo(mask, { scale: 1 }, { scale: 60, duration: 0.48, ease: "power3.in" }, 0.08)
        .to(mask, { autoAlpha: 0, duration: 0.05 }, 0.5)
        .fromTo(".m-shade", { opacity: 0 }, { opacity: 1, duration: 0.14 }, 0.48)
        .from(".m-line > span", { yPercent: 115, stagger: 0.04, duration: 0.14, ease: "power3.out" }, 0.58)
        .from(".m-fade", { y: 40, opacity: 0, stagger: 0.035, duration: 0.14, ease: "power3.out" }, 0.66)
        .from(".m-orb", { scale: 0, rotation: -140, duration: 0.18, ease: "back.out(1.6)" }, 0.68)
        .from(".m-card", { y: 70, opacity: 0, rotationX: -35, stagger: 0.05, duration: 0.14, ease: "power3.out" }, 0.76)
        .set({}, {}, 1);
    });

    // MOBILE / reduced motion: no pin, simple entrance
    mm.add("(max-width: 767px), (prefers-reduced-motion: reduce)", () => {
      if (reduced()) return;
      gsap.from(".m-line > span", { yPercent: 115, stagger: 0.1, duration: 1.1, ease: "power4.out", scrollTrigger: { trigger: ".m-content", start: "top 80%" } });
      gsap.from([".m-fade", ".m-orb", ".m-card"], { y: 40, opacity: 0, stagger: 0.08, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: ".m-content", start: "top 70%" } });
    });

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
  const magnet = (e: React.PointerEvent<HTMLAnchorElement>) => {
    if (e.pointerType !== "mouse") return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    gsap.to(el, { x: (e.clientX - r.left - r.width / 2) * 0.35, y: (e.clientY - r.top - r.height / 2) * 0.35, duration: 0.5, ease: "power3.out" });
  };
  const release = (e: React.PointerEvent<HTMLAnchorElement>) => gsap.to(e.currentTarget, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1,0.35)" });

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
        {/* real club photography */}
        <div className="absolute inset-0 overflow-hidden">
          <Image src={`${A}/turf-area.jpg`} alt="" fill sizes="100vw" className="m-bg-img object-cover object-[50%_55%]" aria-hidden />
        </div>
        <div className="m-shade absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_80%_100%,rgba(237,37,30,.35),transparent_70%),linear-gradient(90deg,rgba(8,8,8,.95)_0%,rgba(8,8,8,.78)_50%,rgba(8,8,8,.55)_100%)]" />

        {/* content */}
        <div className="m-content relative z-10 mx-auto w-full max-w-[1440px] px-5 py-28 md:px-10 md:py-14">
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
              <div className="m-fade mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
                <a href={whatsapp(JOIN_MESSAGE)} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                  <WhatsAppIcon size={18} />
                  Join Good Life
                </a>
                <a href={TEL_URL} className="btn btn-ghost">
                  Contact us
                </a>
              </div>
            </div>

            {/* magnetic orb CTA */}
            <div className="hidden justify-center lg:col-span-4 lg:flex">
              <div className="m-orb relative grid h-60 w-60 place-items-center">
                <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full [animation:spin-slow_16s_linear_infinite]" aria-hidden>
                  <defs>
                    <path id="orb-circle" d="M100,100 m-86,0 a86,86 0 1,1 172,0 a86,86 0 1,1 -172,0" />
                  </defs>
                  <text fill="rgba(255,255,255,.75)" fontSize="11.5" letterSpacing="3.4" fontFamily="var(--font-oswald)">
                    <textPath href="#orb-circle">{ORBIT}</textPath>
                  </text>
                </svg>
                <a
                  href={whatsapp(JOIN_MESSAGE)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onPointerMove={magnet}
                  onPointerLeave={release}
                  aria-label="Join Good Life on WhatsApp"
                  className="group relative grid h-36 w-36 place-items-center rounded-full bg-brand shadow-[0_0_60px_rgba(237,37,30,.55)] transition-[box-shadow] duration-500 hover:shadow-[0_0_90px_rgba(237,37,30,.85)]"
                >
                  <span className="absolute inset-0 rounded-full border border-brand [animation:pulse-ring_2.6s_ease-out_infinite]" aria-hidden />
                  <span className="display text-4xl leading-none transition-transform duration-500 group-hover:scale-110">Join</span>
                  <svg className="absolute bottom-7 h-3 w-5 transition-transform duration-500 group-hover:translate-x-1" viewBox="0 0 16 10" fill="none" aria-hidden>
                    <path d="M0 5h14M10 1l4 4-4 4" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <ul className="mt-12 grid gap-3 [perspective:1000px] sm:grid-cols-3 md:mt-10">
            {CONTACTS.map((c) => (
              <li key={c.label} className="m-card">
                <a
                  href={c.href}
                  {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  onPointerMove={spot}
                  className="group relative flex min-h-24 items-center gap-5 overflow-hidden border border-white/10 bg-black/55 p-5 backdrop-blur-sm transition-colors duration-500 hover:border-brand/60 md:p-6"
                  style={{ backgroundImage: "radial-gradient(260px circle at var(--x,-300px) var(--y,-300px), rgba(237,37,30,.28), transparent 70%)" }}
                >
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-white/15 text-white transition duration-500 group-hover:border-brand group-hover:bg-brand">
                    {c.icon}
                  </span>
                  <span className="flex min-w-0 flex-col gap-1">
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

        {/* the knockout: a dark layer with letter-shaped holes, so the gym shows through "LIFE" */}
        <svg className="m-mask pointer-events-none absolute inset-0 z-20 hidden h-full w-full will-change-transform md:block motion-reduce:!hidden" aria-hidden>
          <defs>
            <mask id="m-knockout" maskUnits="userSpaceOnUse" x="0" y="0" width="100%" height="100%">
              <rect width="100%" height="100%" fill="#fff" />
              <text className="m-mask-sub" x="50%" y="22%" textAnchor="middle" dominantBaseline="middle" fill="#000" style={{ fontFamily: "var(--font-oswald)", fontSize: "1.6vw", letterSpacing: "0.6em", textTransform: "uppercase" }}>
                Step into the good
              </text>
              <text x="50%" y="56%" textAnchor="middle" dominantBaseline="middle" fill="#000" style={{ fontFamily: "var(--font-bebas)", fontSize: "34vw" }}>
                L<tspan className="m-i">I</tspan>FE
              </text>
            </mask>
          </defs>
          <rect width="100%" height="100%" fill="#080808" mask="url(#m-knockout)" />
        </svg>
      </div>

      {/* crossing ribbons */}
      <div className="m-ribbons relative h-[34vw] max-h-72 min-h-44 overflow-hidden" aria-hidden>
        {[0, 1].map((i) => (
          <div
            key={i}
            className={`absolute left-[-5%] top-1/2 w-[110%] -translate-y-1/2 py-3 md:py-4 ${i ? "rotate-[3deg] bg-white text-ink" : "-rotate-[4deg] bg-brand text-white"}`}
          >
            <div className="m-ribbon-track flex w-max">
              {[0, 1].map((k) => (
                <span key={k} className="flex shrink-0 items-center">
                  {Array.from({ length: 3 }, () => RIBBON)
                    .flat()
                    .map((w, j) => (
                      <span key={j} className="display flex items-center whitespace-nowrap px-6 text-3xl md:text-5xl">
                        {w}
                        <span className={`ml-12 text-xl ${i ? "text-brand" : "text-ink"}`}>✦</span>
                      </span>
                    ))}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
