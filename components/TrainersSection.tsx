"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap, reduced, useGsap } from "@/lib/motion";
import { A, whatsapp } from "@/lib/site";

// shortcut: Unsplash stock photos and sample names, replace with the club's real coaches before launch
const COACHES = [
  { first: "Rahul", last: "Verma", role: "Head Strength Coach", img: "trainers/coach-1.jpg", alt: "Coach curling a dumbbell", line: "Heavy basics, clean form, steady progress. Every rep has a reason.", tags: ["Powerlifting", "Hypertrophy", "Form coaching"] },
  { first: "Priya", last: "Sharma", role: "Functional Training Coach", img: "trainers/coach-2.jpg", alt: "Coach holding battle ropes", line: "Train like an athlete: move better, last longer, feel unstoppable.", tags: ["Conditioning", "Battle ropes", "Mobility"] },
  { first: "Arjun", last: "Singh", role: "Body Transformation Coach", img: "trainers/coach-3.jpg", alt: "Coach in the weights area", line: "Fat loss and muscle gain, planned week by week until the mirror agrees.", tags: ["Fat loss", "Muscle gain", "Nutrition"] },
  { first: "Neha", last: "Kapoor", role: "Personal Training Coach", img: "trainers/coach-4.jpg", alt: "Coach guiding a member through an exercise", line: "One-to-one sessions built around you, your goals and your schedule.", tags: ["One-to-one", "Beginners", "Accountability"] },
];
const N = COACHES.length;
const pad = (n: number) => String(n).padStart(2, "0");
const book = (name: string) => whatsapp(`Hi! I'd like to train with ${name} at Good Life Fitness Club.`);

// same brass as the locker room, so the two sections feel like one club
const brass = "bg-[linear-gradient(135deg,#f7e7bd_0%,#c9a45c_32%,#8a6a2f_58%,#e9d199_82%,#a8823f_100%)]";
const brassText = `${brass} bg-clip-text text-transparent`;

export default function TrainersSection() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [flat, setFlat] = useState(false);

  useEffect(() => setFlat(reduced()), []);

  useGsap(
    ref,
    () => {
      if (flat) return;
      const q = gsap.utils.selector(ref);
      const stage = q(".t-stage")[0];
      const spin = q(".t-spin")[0];
      const imgs = q(".t-img");
      const infos = q(".t-info");

      gsap.from(q(".t-line > span"), { yPercent: 115, duration: 1.2, stagger: 0.12, ease: "power4.out", scrollTrigger: { trigger: q(".t-title")[0], start: "top 80%" } });

      // the plate rolls in from the right as the stage arrives
      const arrive = { trigger: stage, start: "top 95%", end: "top top", scrub: true };
      gsap.fromTo(q(".t-roll"), { xPercent: 70, autoAlpha: 0 }, { xPercent: 0, autoAlpha: 1, ease: "power2.out", scrollTrigger: arrive });
      gsap.fromTo(spin, { rotation: 300 }, { rotation: 0, ease: "power2.out", scrollTrigger: arrive });

      // pinned: each change spins the plate half a turn while the next coach opens out of the centre
      const tl = gsap.timeline({
        defaults: { ease: "power3.inOut", duration: 1 },
        scrollTrigger: {
          trigger: stage,
          start: "top top",
          end: () => `+=${(N - 1) * window.innerHeight * 0.5}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (s) => setActive(Math.round(s.progress * (N - 1))),
        },
      });
      for (let i = 1; i < N; i++) {
        const at = (i - 1) * 1.6 + 0.3;
        tl.to(spin, { rotation: `-=${180}`, duration: 1.2 }, at)
          .fromTo(imgs[i], { clipPath: "circle(0% at 50% 50%)" }, { clipPath: "circle(72% at 50% 50%)", duration: 1.1 }, at + 0.1)
          .fromTo(imgs[i].querySelector("img"), { scale: 1.5, rotation: 12 }, { scale: 1, rotation: 0, duration: 1.1 }, at + 0.1)
          .to(imgs[i - 1], { scale: 1.2, filter: "brightness(.2) saturate(0)" }, at)
          .to(infos[i - 1].querySelectorAll(".t-rise"), { yPercent: -110, autoAlpha: 0, stagger: 0.04, duration: 0.6 }, at)
          .fromTo(infos[i].querySelectorAll(".t-rise"), { yPercent: 110, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, stagger: 0.05, duration: 0.7 }, at + 0.45);
      }
      tl.to({}, { duration: 0.3 }); // hold the last coach before unpinning
      tl.to(q(".t-bg"), { xPercent: -30, ease: "none", duration: tl.duration() }, 0);

      // mouse tilt on the plate (fine pointers only)
      if (!window.matchMedia("(pointer: fine)").matches) return;
      const tilt = q(".t-tilt")[0] as HTMLElement;
      const rx = gsap.quickTo(tilt, "rotateX", { duration: 0.6, ease: "power3" });
      const ry = gsap.quickTo(tilt, "rotateY", { duration: 0.6, ease: "power3" });
      const move = (e: PointerEvent) => {
        const r = tilt.getBoundingClientRect();
        ry(((e.clientX - r.left) / r.width - 0.5) * 14);
        rx(-((e.clientY - r.top) / r.height - 0.5) * 14);
      };
      const leave = () => (rx(0), ry(0));
      tilt.addEventListener("pointermove", move);
      tilt.addEventListener("pointerleave", leave);
      return () => {
        tilt.removeEventListener("pointermove", move);
        tilt.removeEventListener("pointerleave", leave);
      };
    },
    [flat],
  );

  const header = (
    <div className="mx-auto px-5 pt-28 md:px-10 lg:px-20 md:pt-36">
      <p className="flex items-center gap-4 font-head text-[0.65rem] uppercase tracking-[0.45em] text-[#c9a45c] md:text-xs">
        <span className={`h-px w-10 ${brass}`} />
        The Coaches
      </p>
      <h2 className="t-title display mt-5 text-[clamp(3rem,9vw,9rem)] leading-[0.88]">
        <span className="t-line block overflow-hidden">
          <span className="block">Built by</span>
        </span>
        <span className="t-line block overflow-hidden">
          <span className={`block ${brassText}`}>real coaches.</span>
        </span>
      </h2>
    </div>
  );

  if (flat)
    return (
      <section ref={ref} id="trainers" className="relative bg-ink pb-28">
        {header}
        <ul className="mx-auto mt-14 grid gap-6 px-5 sm:grid-cols-2 md:px-10 lg:grid-cols-4">
          {COACHES.map((c) => (
            <li key={c.img}>
              <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-[#c9a45c]/25">
                <Image src={`${A}/${c.img}`} alt={c.alt} fill sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw" className="object-cover" />
              </div>
              <p className="mt-4 font-head text-xs uppercase tracking-[0.35em] text-[#c9a45c]">{c.role}</p>
              <p className="display mt-1 text-4xl">
                {c.first} {c.last}
              </p>
            </li>
          ))}
        </ul>
      </section>
    );

  return (
    <section ref={ref} id="trainers" className="relative overflow-hidden bg-ink">
      {header}

      <div className="t-stage relative h-[100svh] overflow-hidden">
        {/* drifting outlined word + warm brass glow */}
        <p className="t-bg pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 whitespace-nowrap font-display text-[30vw] leading-none text-transparent [-webkit-text-stroke:1px_rgba(201,164,92,.09)]" aria-hidden>
          Coaches · Coaches · Coaches
        </p>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_38%_55%_at_70%_50%,rgba(201,164,92,.16),transparent_70%)]" />

        <div className="relative mx-auto grid h-full grid-rows-[auto_1fr] content-center items-center gap-6 px-5 py-14 md:grid-cols-2 md:grid-rows-1 md:gap-14 md:px-10 lg:px-20">
          {/* the plate */}
          <div className="t-roll flex flex-col items-center gap-6 justify-self-center md:order-2 md:gap-8">
            <div className="t-tilt relative [perspective:1200px] [transform-style:preserve-3d]">
              <div className="relative aspect-square h-[min(44svh,86vw)] rounded-full shadow-[0_60px_120px_-30px_rgba(0,0,0,1),0_0_140px_-30px_rgba(201,164,92,.45)] md:h-[min(68svh,600px)]">
                {/* spinning parts: brass rim, grooved face, engraved lettering */}
                <div className="t-spin absolute inset-0 will-change-transform">
                  <span className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,#f7e7bd,#c9a45c,#8a6a2f,#e9d199,#a8823f,#f7e7bd,#8a6a2f,#c9a45c,#f7e7bd)]" />
                  <span className="absolute inset-[3%] rounded-full bg-[repeating-radial-gradient(circle,#0b0b0b_0_3px,#151515_3px_4px)] shadow-[inset_0_0_40px_rgba(0,0,0,1),inset_0_2px_0_rgba(247,231,189,.25)]" />
                  <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden>
                    <defs>
                      <path id="t-ring" d="M50,50 m-40,0 a40,40 0 1,1 80,0 a40,40 0 1,1 -80,0" />
                    </defs>
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#c9a45c" strokeOpacity=".55" strokeWidth=".5" strokeDasharray=".35 1.6" />
                    <text fill="#c9a45c" fontSize="3.4" className="font-head uppercase">
                      <textPath href="#t-ring" textLength="250" lengthAdjust="spacing">
                        Good Life Fitness Club ◆ Coaches ◆ 20 KG ◆ Good Life Fitness Club ◆ Coaches ◆ 20 KG ◆
                      </textPath>
                    </text>
                  </svg>
                  <span className={`absolute inset-[16%] rounded-full ${brass} shadow-[0_0_30px_rgba(0,0,0,.9)]`} />
                </div>

                {/* portrait window stays upright while the plate turns */}
                <div className="absolute inset-[17.5%] overflow-hidden rounded-full bg-black">
                  {COACHES.map((c, i) => (
                    <div key={c.img} className={`t-img absolute inset-0 will-change-transform ${i > 0 ? "[clip-path:circle(0%_at_50%_50%)]" : ""}`}>
                      <Image src={`${A}/${c.img}`} alt={c.alt} fill priority={i === 0} sizes="(min-width:768px) 30vw, 60vw" className="object-cover" />
                    </div>
                  ))}
                  <span className="pointer-events-none absolute inset-0 rounded-full shadow-[inset_0_0_50px_rgba(0,0,0,.85)]" />
                </div>

                {/* fixed specular highlight sells the metal */}
                <span className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_18%,rgba(255,255,255,.22),transparent_38%)] mix-blend-screen" />
              </div>
            </div>

            {/* barbell: a plate is loaded for every coach you've met */}
            <div className="flex items-center" aria-label={`Coach ${active + 1} of ${N}`}>
              <span className={`h-[5px] w-16 rounded-l-full md:w-24 ${brass}`} />
              <span className={`h-5 w-2 rounded-sm ${brass}`} />
              {COACHES.map((c, i) => (
                <span
                  key={c.img}
                  className={`mx-[2px] h-9 w-[10px] rounded-[3px] border border-[#c9a45c]/40 bg-[#111] transition-all duration-500 ease-out ${i <= active ? "translate-x-0 opacity-100 shadow-[0_0_12px_rgba(201,164,92,.5)]" : "translate-x-6 opacity-0"}`}
                >
                  <span className={`block h-full w-full rounded-[2px] ${i <= active ? brass : ""}`} />
                </span>
              ))}
              <span className={`h-[5px] w-10 rounded-r-full ${brass}`} />
              <span className="ml-4 font-head text-[0.6rem] uppercase tracking-[0.4em] text-[#c9a45c] md:text-xs">
                {pad(active + 1)} / {pad(N)}
              </span>
            </div>
          </div>

          {/* stacked coach details; only the active one is visible */}
          <div className="grid md:order-1 md:justify-self-center">
            {COACHES.map((c, i) => {
              const hide = i > 0 ? "invisible" : "";
              return (
                <div key={c.img} className="t-info relative [grid-area:1/1]" aria-hidden={i !== active}>
                  <p className={`t-rise flex items-center gap-3 font-head text-[0.65rem] uppercase tracking-[0.45em] text-[#c9a45c] md:text-xs ${hide}`}>
                    <span>{pad(i + 1)}</span>
                    <span className={`h-px w-8 ${brass}`} />
                    <span>{c.role}</span>
                  </p>
                  <h3 className="display mt-3 text-[clamp(3rem,8vw,8.5rem)] leading-[0.85] md:mt-5">
                    <span className="block overflow-hidden">
                      <span className={`t-rise block ${hide}`}>{c.first}</span>
                    </span>
                    <span className="block overflow-hidden">
                      <span className={`t-rise block ${brassText} ${hide}`}>{c.last}</span>
                    </span>
                  </h3>
                  <p className={`t-rise mt-4 max-w-md text-sm leading-relaxed text-mist md:mt-6 md:text-base ${hide}`}>{c.line}</p>
                  <ul className={`t-rise mt-4 hidden flex-wrap gap-2 sm:flex md:mt-6 ${hide}`}>
                    {c.tags.map((t) => (
                      <li key={t} className="rounded-full border border-[#c9a45c]/35 px-4 py-1.5 font-head text-[0.65rem] uppercase tracking-[0.3em] text-[#e9d199]">
                        {t}
                      </li>
                    ))}
                  </ul>
                  <div className={`t-rise mt-6 md:mt-8 ${hide}`}>
                    <a href={book(c.first)} target="_blank" rel="noopener noreferrer" tabIndex={i === active ? 0 : -1} className="btn btn-primary">
                      Train with {c.first}
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
