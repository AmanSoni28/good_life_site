"use client";
import Image from "next/image";
import { useRef } from "react";
import { getLenis, gsap, reduced, scrollToHash, useGsap } from "@/lib/motion";
import { A, FACEBOOK_URL, INSTAGRAM_HANDLE, INSTAGRAM_URL, NAV, PHONE_DISPLAY, TEL_URL, WHATSAPP_URL, YOUTUBE_URL } from "@/lib/site";
import { openJoin } from "./JoinForm";

const CONTACT = [
  { label: "Call", value: PHONE_DISPLAY, href: TEL_URL },
  { label: "WhatsApp", value: PHONE_DISPLAY, href: WHATSAPP_URL, ext: true },
  { label: "Instagram", value: INSTAGRAM_HANDLE, href: INSTAGRAM_URL, ext: true },
];

const SOCIAL = [
  {
    label: "Instagram",
    href: INSTAGRAM_URL,
    icon: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" />
      </>
    ),
  },
  {
    label: "Facebook",
    href: FACEBOOK_URL,
    icon: <path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 3.9v2.3H8v3h2.5V21z" fill="currentColor" />,
  },
  {
    label: "YouTube",
    href: YOUTUBE_URL,
    icon: (
      <>
        <rect x="2.5" y="5.5" width="19" height="13" rx="4" stroke="currentColor" strokeWidth="1.6" />
        <path d="m10.2 9.2 5 2.8-5 2.8z" fill="currentColor" />
      </>
    ),
  },
  {
    label: "WhatsApp",
    href: WHATSAPP_URL,
    icon: (
      <>
        <path d="M4 20l1.2-3.6A8 8 0 1 1 8 19z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M9 8.6c.2-.4.6-.4.8 0l.6 1.3c.1.3 0 .5-.2.7l-.4.4c.5 1 1.3 1.8 2.3 2.3l.4-.4c.2-.2.4-.3.7-.2l1.3.6c.4.2.4.6 0 .8-.6.6-1.4.9-2.2.6a7 7 0 0 1-3.9-3.9c-.3-.8 0-1.6.6-2.2z" fill="currentColor" />
      </>
    ),
  },
];

const Arrow = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden className="shrink-0 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
    <path d="M2 12 12 2M5 2h7v7" stroke="currentColor" strokeWidth="1.3" />
  </svg>
);

export default function GymFooter() {
  const ref = useRef<HTMLElement>(null);

  useGsap(ref, () => {
    if (reduced()) return;
    const st = { trigger: ".fw", start: "top 92%" };
    gsap.from(".fw-rule", { scaleX: 0, duration: 1.6, ease: "power3.inOut", scrollTrigger: st });
    gsap.from(".fw-ch", {
      yPercent: 110,
      rotateX: -70,
      opacity: 0,
      filter: "blur(8px)",
      duration: 1.5,
      ease: "expo.out",
      stagger: { each: 0.07, from: "center" },
      scrollTrigger: st,
    });
    gsap.from(".fw-glow", { opacity: 0, scale: 0.6, duration: 2.2, ease: "power2.out", scrollTrigger: st });
    // slow drift + glow breathing while the footer is on screen
    gsap.fromTo(".fw p", { xPercent: 2 }, { xPercent: -2, ease: "none", scrollTrigger: { trigger: ".fw", start: "top bottom", end: "bottom top", scrub: true } });
    gsap.to(".fw-glow", { opacity: 0.5, duration: 3, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 2.2 });
  });

  const replay = () => {
    try {
      sessionStorage.removeItem("gl-intro");
    } catch {}
    window.scrollTo(0, 0);
    document.documentElement.dataset.intro = "playing";
    window.dispatchEvent(new Event("gl:replay-intro"));
  };
  const top = () => {
    const l = getLenis();
    if (l) l.scrollTo(0, { duration: 1.6 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer ref={ref} className="relative overflow-hidden bg-[#050505]">
      {/* gold hairline + warm glow at the top edge */}
      <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" aria-hidden />
      <span className="pointer-events-none absolute left-1/2 top-0 h-64 w-[70vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/10 blur-[100px]" aria-hidden />

      <div className="relative mx-auto px-5 pt-20 md:px-10 md:pt-28">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          {/* brand */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-5">
              <Image src={`${A}/logo.png`} alt="Good Life Fitness Club logo" width={72} height={72} className="h-[72px] w-[72px] rounded-full ring-1 ring-gold/40 ring-offset-4 ring-offset-[#050505]" />
              <div>
                <p className="display text-3xl">
                  Good <span className="text-brand">Life</span>
                </p>
                <p className="font-head text-[0.65rem] uppercase tracking-[0.45em] text-champagne">Fitness Club</p>
              </div>
            </div>
            <p className="mt-8 max-w-sm text-sm leading-relaxed text-white/55">
              A three-floor unisex gym for strength, cardio, functional turf training and personal coaching.
            </p>
            <p className="mt-6 flex items-center gap-4 font-head text-[0.7rem] uppercase tracking-[0.35em] text-champagne">
              <span className="h-px w-10 bg-gradient-to-r from-gold to-transparent" />
              Train Hard. Stay Strong. Live Better.
            </p>
            <button type="button" onClick={openJoin} aria-haspopup="dialog" className="btn btn-primary btn-sheen mt-10">
              Join the club
            </button>

            <div className="mt-10">
              <p className="font-head text-[0.65rem] uppercase tracking-[0.4em] text-gold">Follow the club</p>
              <ul className="mt-4 flex gap-3">
                {SOCIAL.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Good Life Fitness Club on ${s.label}`}
                      className="grid h-12 w-12 place-items-center rounded-full border border-gold/35 text-champagne transition duration-500 hover:-translate-y-1 hover:border-gold hover:bg-gold hover:text-ink hover:shadow-[0_10px_30px_-8px_rgba(201,164,92,.7)]"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                        {s.icon}
                      </svg>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* explore */}
          <nav className="lg:col-span-3" aria-label="Footer">
            <p className="font-head text-[0.65rem] uppercase tracking-[0.4em] text-gold">Explore</p>
            <ul className="mt-6 grid grid-cols-2 gap-x-6 lg:grid-cols-1">
              {NAV.map((n, i) => (
                <li key={n.href}>
                  <a
                    href={n.href}
                    onClick={(e) => (e.preventDefault(), scrollToHash(n.href))}
                    className="group flex items-center gap-3 py-2 font-head text-sm uppercase tracking-[0.2em] text-white/65 transition-colors hover:text-white"
                  >
                    <span className="text-[0.6rem] text-gold/60">{String(i + 1).padStart(2, "0")}</span>
                    <span className="h-px w-0 bg-gold transition-all duration-500 group-hover:w-5" />
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* contact */}
          <div className="lg:col-span-4">
            <p className="font-head text-[0.65rem] uppercase tracking-[0.4em] text-gold">Get in touch</p>
            <ul className="mt-6 border-t border-white/10">
              {CONTACT.map((c) => (
                <li key={c.label} className="border-b border-white/10">
                  <a
                    href={c.href}
                    {...(c.ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="group flex items-center justify-between gap-4 py-5 transition-colors hover:text-gold-light"
                  >
                    <span>
                      <span className="block font-head text-[0.6rem] uppercase tracking-[0.35em] text-mist">{c.label}</span>
                      <span className="mt-1 block font-display text-2xl tracking-wide md:text-[1.75rem]">{c.value}</span>
                    </span>
                    <Arrow />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* oversized gold-leaf wordmark: letters rise in on scroll, glint travels across them */}
        <div className="fw relative mt-20 md:mt-24" aria-hidden>
          <span className="fw-glow pointer-events-none absolute left-1/2 top-1/2 h-[60%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/15 blur-[120px]" />
          <span className="fw-rule absolute inset-x-0 top-0 h-px origin-center bg-gradient-to-r from-transparent via-gold/70 to-transparent" />
          <p className="pointer-events-none relative select-none overflow-hidden whitespace-nowrap pt-6 text-center font-display text-[19vw] leading-[0.82] [mask-image:linear-gradient(180deg,#000_55%,transparent)] [perspective:900px]">
            {"GOOD LIFE".split("").map((c, i) =>
              c === " " ? (
                <span key={i} className="inline-block w-[0.22em]" />
              ) : (
                <span key={i} className="fw-ch gold-metal inline-block" style={{ animationDelay: `${i * 0.12}s` }}>
                  {c}
                </span>
              ),
            )}
          </p>
        </div>
      </div>

      <div className="relative border-t border-gold/15">
        <div className="mx-auto flex flex-col gap-4 px-5 py-6 font-head text-[0.65rem] uppercase tracking-[0.25em] text-white/40 sm:flex-row sm:items-center sm:justify-between md:px-10">
          <p>© {new Date().getFullYear()} Good Life Fitness Club</p>
          <div className="flex items-center gap-6">
            <button type="button" onClick={replay} className="py-2 transition-colors hover:text-gold-light">
              Replay intro ↺
            </button>
            <button type="button" onClick={top} className="group flex items-center gap-3 py-2 transition-colors hover:text-gold-light">
              Back to top
              <span className="grid h-9 w-9 place-items-center rounded-full border border-gold/40 transition-colors group-hover:border-gold group-hover:bg-gold group-hover:text-ink">↑</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
