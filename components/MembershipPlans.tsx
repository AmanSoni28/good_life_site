"use client";
import { useRef, useState } from "react";
import { openJoin } from "./JoinForm";
import { gsap, reduced, useGsap } from "@/lib/motion";
import { whatsapp } from "@/lib/site";

// shortcut: sample prices and perks (INR) — replace with the club's real plans before launch
const PLANS = [
  { name: "Essential", tag: "Start strong", monthly: 1499, yearly: 14999, perks: ["All 3 training floors", "Strength & cardio zones", "Functional turf access", "Free first-day orientation"] },
  { name: "Signature", tag: "Most chosen", monthly: 2499, yearly: 23999, featured: true, perks: ["Everything in Essential", "Monthly body assessment", "Custom workout plan", "Diet guidance from coaches", "Priority slot booking"] },
  { name: "Black", tag: "The full club", monthly: 4999, yearly: 47999, perks: ["Everything in Signature", "Personal training sessions", "1-to-1 progress reviews", "Nutrition plan, updated monthly"] },
];
type Billing = "monthly" | "yearly";

const brass = "bg-[linear-gradient(135deg,#f7e7bd_0%,#c9a45c_32%,#8a6a2f_58%,#e9d199_82%,#a8823f_100%)]";
const brassText = `${brass} bg-clip-text text-transparent`;
const inr = (n: number) => n.toLocaleString("en-IN");
const save = (p: (typeof PLANS)[number]) => Math.round((1 - p.yearly / (p.monthly * 12)) * 100);

/** Price whose digits roll like a mechanical counter when billing changes. */
function Odometer({ value }: { value: number }) {
  return (
    <span className="inline-flex overflow-hidden" aria-hidden>
      {[...inr(value)].map((c, i, all) =>
        /\d/.test(c) ? (
          // key from the right so units stay units when the length changes
          <span key={all.length - i} className="relative inline-block h-[1em] w-[0.5em] overflow-hidden">
            <span
              className="absolute inset-x-0 top-0 flex flex-col transition-transform duration-[900ms] ease-[cubic-bezier(.7,0,.2,1)]"
              style={{ transform: `translateY(-${+c * 10}%)`, transitionDelay: `${(all.length - i) * 40}ms` }}
            >
              {"0123456789".split("").map((d) => (
                <span key={d} className="h-[1em] text-center leading-none">{d}</span>
              ))}
            </span>
          </span>
        ) : (
          <span key={`s${all.length - i}`} className="w-[0.22em] leading-none">{c}</span>
        ),
      )}
    </span>
  );
}

export default function MembershipPlans() {
  const ref = useRef<HTMLElement>(null);
  const [billing, setBilling] = useState<Billing>("yearly");
  const yearly = billing === "yearly";

  useGsap(ref, () => {
    if (reduced()) return;
    const mm = gsap.matchMedia();
    gsap.from(".p-line > span", { yPercent: 115, stagger: 0.1, duration: 1.2, ease: "power4.out", scrollTrigger: { trigger: ".p-title", start: "top 80%" } });
    gsap.from(".p-fade", { y: 30, opacity: 0, stagger: 0.08, duration: 1, ease: "power3.out", scrollTrigger: { trigger: ".p-title", start: "top 75%" } });

    // desktop: the three cards start as one stacked deck in the centre, then get dealt out
    mm.add("(min-width: 1024px)", () => {
      gsap.from(".p-card", {
        xPercent: (i) => (1 - i) * 100,
        y: (i) => (i === 1 ? 0 : 60),
        rotation: (i) => (1 - i) * 9,
        scale: 0.86,
        opacity: 0,
        duration: 1.5,
        stagger: { each: 0.08, from: "center" },
        ease: "expo.out",
        scrollTrigger: { trigger: ".p-deck", start: "top 75%" },
      });
    });
    mm.add("(max-width: 1023px)", () => {
      gsap.utils.toArray<HTMLElement>(".p-card").forEach((c) =>
        gsap.from(c, { y: 60, opacity: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: c, start: "top 85%" } }),
      );
    });
    return () => mm.revert();
  });

  // card tilt + light that follows the pointer
  const tilt = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || reduced()) return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    gsap.to(el, { rotationY: (x - 0.5) * 10, rotationX: -(y - 0.5) * 8, duration: 0.6, ease: "power3.out" });
    el.style.setProperty("--x", `${x * 100}%`);
    el.style.setProperty("--y", `${y * 100}%`);
  };
  const untilt = (e: React.PointerEvent<HTMLDivElement>) => gsap.to(e.currentTarget, { rotationX: 0, rotationY: 0, duration: 1, ease: "elastic.out(1,0.5)" });

  return (
    <section ref={ref} id="membership" className="grain relative overflow-hidden bg-ink py-28 md:py-40">
      {/* backdrop: gold aura, faint grid, giant outline word */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute left-1/2 top-[55%] h-[70vh] w-[90vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(201,164,92,.16),transparent_65%)]" />
        <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(rgba(233,209,153,.6)_1px,transparent_1px),linear-gradient(90deg,rgba(233,209,153,.6)_1px,transparent_1px)] [background-size:80px_80px] [mask-image:radial-gradient(ellipse_at_center,#000_20%,transparent_70%)]" />
        <p className="display absolute left-1/2 top-16 -translate-x-1/2 whitespace-nowrap text-[22vw] leading-none text-transparent opacity-[0.06] [-webkit-text-stroke:1px_#e9d199]">Members</p>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-5 md:px-10">
        <header className="p-title mx-auto max-w-3xl text-center">
          <p className="p-fade eyebrow mb-7 justify-center">Membership plans</p>
          <h2 className="display text-[clamp(3rem,7vw,7rem)]">
            <span className="p-line line"><span>Choose your</span></span>
            <span className="p-line line"><span className={brassText}>good life.</span></span>
          </h2>
          <p className="p-fade mx-auto mt-6 max-w-xl text-lg leading-relaxed text-white/70">
            Three floors, one membership. Pick a plan, pay monthly or lock in a year and save.
          </p>

          {/* billing switch */}
          <div className="p-fade mt-10 inline-flex flex-col items-center gap-4">
            <div role="group" aria-label="Billing period" className="relative grid grid-cols-2 rounded-full border border-gold/40 bg-black/60 p-1.5 shadow-[inset_0_2px_10px_rgba(0,0,0,.8)] backdrop-blur">
              <span
                className={`absolute inset-y-1.5 left-1.5 w-[calc(50%-0.375rem)] rounded-full ${brass} shadow-[0_6px_24px_-6px_rgba(201,164,92,.7)] transition-transform duration-700 ease-[cubic-bezier(.7,0,.2,1)] ${yearly ? "translate-x-full" : ""}`}
                aria-hidden
              />
              {(["monthly", "yearly"] as const).map((b) => (
                <button
                  key={b}
                  type="button"
                  aria-pressed={billing === b}
                  onClick={() => setBilling(b)}
                  className={`relative z-10 min-h-11 px-7 font-head text-xs uppercase tracking-[0.3em] transition-colors duration-500 md:px-10 ${billing === b ? "text-ink" : "text-white/70 hover:text-white"}`}
                >
                  {b}
                </button>
              ))}
            </div>
            <p className={`font-head text-[0.7rem] uppercase tracking-[0.35em] transition-opacity duration-500 ${yearly ? "text-gold-light" : "text-mist"}`}>
              {yearly ? "Yearly savings unlocked" : `Go yearly · save up to ${Math.max(...PLANS.map(save))}%`}
            </p>
          </div>
        </header>

        <ul className="p-deck mt-16 grid items-stretch gap-6 [perspective:1400px] md:mt-20 lg:grid-cols-3 lg:gap-7">
          {PLANS.map((p) => {
            const price = yearly ? p.yearly : p.monthly;
            const msg = `Hi Good Life Fitness Club! I'm interested in the ${p.name} plan (${billing}, ₹${inr(price)}). Please share the details.`;
            return (
              <li key={p.name} className={`p-card relative ${p.featured ? "lg:-my-6 lg:z-10" : ""}`}>
                {/* featured card: rotating brass edge */}
                <div className={`relative h-full overflow-hidden rounded-[26px] p-px ${p.featured ? "shadow-[0_40px_120px_-30px_rgba(201,164,92,.55)]" : "bg-white/10"}`}>
                  {p.featured && (
                    <span className="absolute left-1/2 top-1/2 aspect-square w-[200%] -translate-x-1/2 -translate-y-1/2 [animation:spin-slow_7s_linear_infinite] [background:conic-gradient(from_0deg,transparent_0deg,#e9d199_60deg,#8a6a2f_120deg,transparent_180deg,#c9a45c_250deg,transparent_320deg)]" aria-hidden />
                  )}
                  <div
                    onPointerMove={tilt}
                    onPointerLeave={untilt}
                    className={`group relative flex h-full flex-col overflow-hidden rounded-[25px] p-8 md:p-10 ${p.featured ? "bg-[linear-gradient(160deg,#1d1a14_0%,#0c0b09_55%,#14110c_100%)]" : "bg-[linear-gradient(160deg,#161616_0%,#0b0b0b_60%,#121212_100%)]"}`}
                  >
                    {/* pointer light + diagonal sheen */}
                    <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 [background:radial-gradient(420px_circle_at_var(--x,50%)_var(--y,0%),rgba(233,209,153,.14),transparent_60%)]" aria-hidden />
                    <div className="pointer-events-none absolute left-0 top-0 h-full w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/[0.07] to-transparent [animation:streak_7s_ease-in-out_infinite]" aria-hidden />

                    <div className="relative flex items-start justify-between gap-4">
                      <div>
                        <p className="font-head text-[0.65rem] uppercase tracking-[0.4em] text-mist">{p.tag}</p>
                        <h3 className={`display mt-3 text-5xl md:text-6xl ${p.featured ? brassText : ""}`}>{p.name}</h3>
                      </div>
                      {p.featured && (
                        <span className={`rounded-full ${brass} px-3 py-1.5 font-head text-[0.6rem] uppercase tracking-[0.25em] text-ink`}>Best value</span>
                      )}
                    </div>

                    <div className="relative mt-8 border-y border-white/10 py-7">
                      <p className="flex items-start gap-1 font-display leading-none">
                        <span className={`mt-2 text-3xl ${p.featured ? "text-gold-light" : "text-white/60"}`}>₹</span>
                        <span className="text-[4.5rem] md:text-[5.2rem]"><Odometer value={price} /></span>
                        <span className="sr-only">₹{inr(price)}</span>
                      </p>
                      <p className="mt-3 flex flex-wrap items-center gap-3 font-head text-xs uppercase tracking-[0.25em] text-mist">
                        per {yearly ? "year" : "month"}
                        <span
                          className={`rounded-full border border-gold/50 px-2.5 py-1 text-[0.6rem] text-gold-light transition-all duration-500 ${yearly ? "opacity-100" : "translate-y-2 opacity-0"}`}
                          aria-hidden={!yearly}
                        >
                          Save {save(p)}% · ₹{inr(Math.round(p.yearly / 12))}/mo
                        </span>
                      </p>
                    </div>

                    <ul className="relative mt-7 flex-1 space-y-3.5">
                      {p.perks.map((perk) => (
                        <li key={perk} className="flex items-center gap-3 text-[0.95rem] text-white/80">
                          <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full ring-1 ${p.featured ? "bg-gold/15 text-gold-light ring-gold/60" : "bg-white/5 text-gold ring-white/20"}`}>
                            <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden>
                              <path d="M2 6.5 5 9l5-6" stroke="currentColor" strokeWidth="1.8" />
                            </svg>
                          </span>
                          {perk}
                        </li>
                      ))}
                    </ul>

                    <div className="relative mt-9 flex flex-col gap-3">
                      <a href={whatsapp(msg)} target="_blank" rel="noopener noreferrer" className={`btn ${p.featured ? "btn-primary btn-sheen" : "btn-ghost"} w-full`}>
                        Choose {p.name}
                      </a>
                      <button type="button" onClick={openJoin} aria-haspopup="dialog" className="font-head text-[0.65rem] uppercase tracking-[0.3em] text-mist transition-colors hover:text-gold-light">
                        Or book a free visit
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <p className="p-fade mt-12 text-center font-head text-[0.65rem] uppercase tracking-[0.35em] text-white/40">
          Unisex gym · Plans confirmed by our team on WhatsApp
        </p>
      </div>
    </section>
  );
}
