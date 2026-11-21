"use client";
import { useRef, useState } from "react";
import { openJoin } from "./JoinForm";
import { gsap, reduced, useGsap } from "@/lib/motion";
import { whatsapp } from "@/lib/site";

// shortcut: sample prices and perks (INR) — replace with the club's real plans before launch
const PLANS = [
  { name: "Essential", tag: "Start strong", monthly: 1499, yearly: 14999, perks: ["All 3 training floors", "Strength & cardio zones", "Functional turf access", "Free first-day orientation"] },
  { name: "Signature", tag: "Most chosen", monthly: 2499, yearly: 23999, featured: true, perks: ["Everything in Essential", "Monthly body assessment", "Custom workout plan", "Diet guidance from coaches"] },
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
    <span className="inline-flex items-end overflow-hidden" aria-hidden>
      {[...inr(value)].map((c, i, all) =>
        /\d/.test(c) ? (
          // key from the right so units stay units when the length changes
          <span key={all.length - i} className="relative inline-block h-[1em] w-[0.5em] overflow-hidden">
            <span
              className="absolute inset-x-0 top-0 flex flex-col transition-transform duration-[900ms] ease-[cubic-bezier(.7,0,.2,1)]"
              style={{ transform: `translateY(-${+c * 10}%)`, transitionDelay: `${(all.length - i) * 45}ms` }}
            >
              {"0123456789".split("").map((d) => (
                <span key={d} className="h-[1em] text-center leading-none">{d}</span>
              ))}
            </span>
          </span>
        ) : (
          <span key={`s${all.length - i}`} className="w-[0.2em] leading-[0.9]">{c}</span>
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
    gsap.from(".p-line > span", { yPercent: 115, stagger: 0.1, duration: 1.2, ease: "power4.out", scrollTrigger: { trigger: ".p-head", start: "top 80%" } });
    gsap.from(".p-fade", { y: 30, opacity: 0, stagger: 0.08, duration: 1, ease: "power3.out", scrollTrigger: { trigger: ".p-head", start: "top 75%" } });
    gsap.from(".p-rule", { scaleX: 0, transformOrigin: "left", duration: 1.6, ease: "expo.inOut", scrollTrigger: { trigger: ".p-head", start: "top 70%" } });

    // each plan band: a gold blade sweeps across, then the band opens behind it and its content rises
    gsap.utils.toArray<HTMLElement>(".p-row").forEach((row) => {
      const q = gsap.utils.selector(row);
      gsap
        .timeline({ scrollTrigger: { trigger: row, start: "top 82%" } })
        .fromTo(q(".p-blade"), { xPercent: -100, opacity: 1 }, { xPercent: 100, duration: 1.1, ease: "expo.inOut", immediateRender: false }, 0)
        .from(q(".p-band"), { clipPath: "inset(0 100% 0 0 round 28px)", duration: 1.1, ease: "expo.inOut" }, 0.08)
        .from(q(".p-idx"), { xPercent: -40, opacity: 0, duration: 1.2, ease: "power3.out" }, 0.5)
        .from(q(".p-name > span"), { yPercent: 110, duration: 1, ease: "power4.out" }, 0.55)
        .from(q(".p-in"), { y: 26, opacity: 0, stagger: 0.06, duration: 0.8, ease: "power3.out" }, 0.65);
    });
  });

  // light that follows the pointer across a band
  const spot = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--x", `${e.clientX - r.left}px`);
    el.style.setProperty("--y", `${e.clientY - r.top}px`);
  };

  return (
    <section ref={ref} id="membership" className="grain relative overflow-hidden bg-ink py-28 md:py-40">
      {/* backdrop: gold aura, faint grid, giant outline word */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -right-[20vw] top-0 h-[90vh] w-[80vw] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(201,164,92,.14),transparent_65%)]" />
        <div className="absolute -left-[20vw] bottom-0 h-[70vh] w-[60vw] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(237,37,30,.08),transparent_65%)]" />
        <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(233,209,153,.6)_1px,transparent_1px),linear-gradient(90deg,rgba(233,209,153,.6)_1px,transparent_1px)] [background-size:96px_96px] [mask-image:linear-gradient(180deg,transparent,#000_20%,#000_80%,transparent)]" />
        <p className="display absolute -right-[2vw] top-10 whitespace-nowrap text-[20vw] leading-none text-transparent opacity-[0.07] [-webkit-text-stroke:1px_#e9d199]">Members</p>
      </div>

      <div className="relative z-10 px-5 md:px-10 xl:px-16">
        {/* header: title left, controls right */}
        <header className="p-head grid items-end gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="p-fade eyebrow mb-7">Membership plans</p>
            <h2 className="display text-[clamp(3.4rem,8.5vw,9.5rem)]">
              <span className="p-line line"><span>Choose your</span></span>
              <span className="p-line line"><span className={brassText}>good life.</span></span>
            </h2>
          </div>
          <div className="lg:col-span-5 lg:pb-3">
            <p className="p-fade max-w-md text-lg leading-relaxed text-white/70">
              Three floors, one membership. Pay monthly, or lock in a full year and keep the savings.
            </p>
            <div className="p-fade mt-8 flex flex-wrap items-center gap-5">
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
                    className={`relative z-10 min-h-11 px-7 font-head text-xs uppercase tracking-[0.3em] transition-colors duration-500 md:px-9 ${billing === b ? "text-ink" : "text-white/70 hover:text-white"}`}
                  >
                    {b}
                  </button>
                ))}
              </div>
              <p className={`font-head text-[0.7rem] uppercase tracking-[0.3em] transition-colors duration-500 ${yearly ? "text-gold-light" : "text-mist"}`}>
                {yearly ? "✦ Yearly savings unlocked" : `Go yearly · save up to ${Math.max(...PLANS.map(save))}%`}
              </p>
            </div>
          </div>
        </header>

        <span className={`p-rule mt-14 block h-px w-full ${brass} opacity-60 md:mt-20`} aria-hidden />

        {/* plans: full-width bands */}
        <ol className="mt-10 space-y-5 md:mt-14 md:space-y-6">
          {PLANS.map((p, i) => {
            const price = yearly ? p.yearly : p.monthly;
            const msg = `Hi Good Life Fitness Club! I'm interested in the ${p.name} plan (${billing}, ₹${inr(price)}). Please share the details.`;
            return (
              <li key={p.name} className="p-row relative">
                <span className={`p-blade pointer-events-none absolute inset-y-0 left-0 z-20 w-full ${brass} opacity-0 [clip-path:polygon(92%_0,100%_0,96%_100%,88%_100%)]`} aria-hidden />
                <div className={`p-band relative overflow-hidden rounded-[28px] p-px ${p.featured ? "shadow-[0_40px_120px_-40px_rgba(201,164,92,.6)]" : "bg-white/10"}`}>
                  {/* featured: brass edge that travels around the band */}
                  {p.featured && (
                    <span className="absolute left-1/2 top-1/2 aspect-square w-[160%] -translate-x-1/2 -translate-y-1/2 [animation:spin-slow_9s_linear_infinite] [background:conic-gradient(from_0deg,transparent_0deg,#e9d199_50deg,#8a6a2f_100deg,transparent_160deg,transparent_200deg,#c9a45c_250deg,transparent_310deg)]" aria-hidden />
                  )}
                  <div
                    onPointerMove={spot}
                    className={`group relative grid gap-8 overflow-hidden rounded-[27px] p-7 md:p-10 lg:grid-cols-12 lg:items-center lg:gap-10 xl:px-14 ${p.featured ? "bg-[linear-gradient(100deg,#1f1b13_0%,#0d0c0a_45%,#17130c_100%)]" : "bg-[linear-gradient(100deg,#141414_0%,#0a0a0a_60%,#111_100%)]"}`}
                  >
                    {/* pointer light + gold underline that draws on hover */}
                    <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 [background:radial-gradient(520px_circle_at_var(--x,50%)_var(--y,50%),rgba(233,209,153,.12),transparent_60%)]" aria-hidden />
                    <span className={`pointer-events-none absolute bottom-0 left-0 h-[2px] w-full origin-left scale-x-0 ${brass} transition-transform duration-[900ms] ease-[cubic-bezier(.7,0,.2,1)] group-hover:scale-x-100`} aria-hidden />

                    {/* name */}
                    <div className="relative flex items-center gap-6 lg:col-span-4 xl:gap-8">
                      <span className={`p-idx display text-[5.5rem] leading-none text-transparent md:text-[7rem] ${p.featured ? "[-webkit-text-stroke:1px_#c9a45c]" : "[-webkit-text-stroke:1px_rgba(255,255,255,.25)]"}`} aria-hidden>
                        0{i + 1}
                      </span>
                      <div>
                        <p className="p-in flex flex-wrap items-center gap-3 font-head text-[0.65rem] uppercase tracking-[0.4em] text-mist">
                          {p.tag}
                          {p.featured && (
                            <span className={`whitespace-nowrap rounded-full ${brass} px-3 py-1 text-[0.58rem] tracking-[0.25em] text-ink`}>Best value</span>
                          )}
                        </p>
                        <h3 className="p-name line mt-3">
                          <span className={`display text-6xl md:text-7xl ${p.featured ? brassText : ""}`}>{p.name}</span>
                        </h3>
                      </div>
                    </div>

                    {/* perks */}
                    <ul className="relative grid gap-x-8 gap-y-3.5 sm:grid-cols-2 lg:col-span-4 lg:border-l lg:border-white/10 lg:pl-10">
                      {p.perks.map((perk) => (
                        <li key={perk} className="p-in flex items-center gap-3 text-[0.95rem] text-white/80">
                          <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full ring-1 ${p.featured ? "bg-gold/15 text-gold-light ring-gold/60" : "bg-white/5 text-gold ring-white/20"}`}>
                            <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden>
                              <path d="M2 6.5 5 9l5-6" stroke="currentColor" strokeWidth="1.8" />
                            </svg>
                          </span>
                          {perk}
                        </li>
                      ))}
                    </ul>

                    {/* price + action */}
                    <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between lg:col-span-4 lg:border-l lg:border-white/10 lg:pl-10">
                      <div className="p-in">
                        <p className="flex items-start gap-1 font-display leading-none">
                          <span className={`mt-1.5 text-3xl ${p.featured ? "text-gold-light" : "text-white/55"}`}>₹</span>
                          <span className="text-[4.2rem] md:text-[4.8rem]"><Odometer value={price} /></span>
                          <span className="sr-only">₹{inr(price)} per {yearly ? "year" : "month"}</span>
                        </p>
                        <p className="mt-2 font-head text-[0.68rem] uppercase tracking-[0.28em] text-mist">
                          per {yearly ? "year" : "month"}
                          <span className={`ml-3 inline-block text-gold-light transition-all duration-500 ${yearly ? "opacity-100" : "translate-y-2 opacity-0"}`} aria-hidden={!yearly}>
                            · save {save(p)}%
                          </span>
                        </p>
                      </div>
                      <div className="p-in flex shrink-0 flex-col items-start gap-3 sm:items-end">
                        <a
                          href={whatsapp(msg)}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Choose the ${p.name} plan on WhatsApp`}
                          className={`btn ${p.featured ? "btn-primary btn-sheen" : "btn-ghost"} !px-6`}
                        >
                          Choose
                          <svg className="h-3 w-5 transition-transform duration-500 group-hover:translate-x-1" viewBox="0 0 16 10" fill="none" aria-hidden>
                            <path d="M0 5h14M10 1l4 4-4 4" stroke="currentColor" strokeWidth="1.5" />
                          </svg>
                        </a>
                        <button type="button" onClick={openJoin} aria-haspopup="dialog" className="font-head text-[0.6rem] uppercase tracking-[0.3em] text-mist transition-colors hover:text-gold-light">
                          Or book a free visit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>

        <p className="p-fade mt-12 font-head text-[0.65rem] uppercase tracking-[0.35em] text-white/40">
          Unisex gym · Plans confirmed by our team on WhatsApp
        </p>
      </div>
    </section>
  );
}
