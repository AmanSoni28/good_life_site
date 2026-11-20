"use client";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { WhatsAppIcon } from "./WhatsAppButton";
import { getLenis, gsap, reduced } from "@/lib/motion";
import { A, whatsapp } from "@/lib/site";

const GOALS = ["Strength", "Weight loss", "Cardio & stamina", "Functional", "Personal training"];
const TIMES = ["Morning", "Afternoon", "Evening"];

/** Opens the join form from anywhere: openJoin(event) — the overlay grows out of the clicked element. */
export const openJoin = (e?: { currentTarget: Element }) => {
  const r = e?.currentTarget.getBoundingClientRect();
  window.dispatchEvent(new CustomEvent("gl:join", { detail: r ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : null }));
};

export default function JoinForm() {
  const root = useRef<HTMLDivElement>(null);
  const opener = useRef<Element | null>(null);
  const [open, setOpen] = useState(false);
  const [origin, setOrigin] = useState({ x: 50, y: 50 }); // in %
  const [goal, setGoal] = useState<string[]>([]);
  const [time, setTime] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const onJoin = (e: Event) => {
      const d = (e as CustomEvent<{ x: number; y: number } | null>).detail;
      opener.current = document.activeElement;
      setOrigin(d ? { x: (d.x / innerWidth) * 100, y: (d.y / innerHeight) * 100 } : { x: 50, y: 50 });
      setError("");
      setOpen(true);
      getLenis()?.stop();
    };
    window.addEventListener("gl:join", onJoin);
    return () => window.removeEventListener("gl:join", onJoin);
  }, []);

  // entrance
  useEffect(() => {
    if (!open || !root.current) return;
    const q = gsap.utils.selector(root);
    const ctx = gsap.context(() => {
      if (reduced()) return void gsap.set(q(".j-veil"), { clipPath: "circle(150% at 50% 50%)" });
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .fromTo(q(".j-veil"), { clipPath: `circle(0% at ${origin.x}% ${origin.y}%)` }, { clipPath: `circle(150% at ${origin.x}% ${origin.y}%)`, duration: 0.9, ease: "power3.inOut" })
        .fromTo(q(".j-card"), { y: 60, rotateX: 12, autoAlpha: 0 }, { y: 0, rotateX: 0, autoAlpha: 1, duration: 0.8 }, 0.45)
        .fromTo(q(".j-art"), { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 1, ease: "power4.inOut" }, 0.55)
        .fromTo(q(".j-art img"), { scale: 1.3 }, { scale: 1, duration: 1.6 }, 0.55)
        .fromTo(q(".j-line"), { scaleX: 0 }, { scaleX: 1, duration: 0.9, stagger: 0.1 }, 0.8)
        .fromTo(q(".j-in"), { y: 26, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.06 }, 0.85);
    }, root);
    q<HTMLInputElement>("input")[0]?.focus({ preventScroll: true });
    return () => ctx.revert();
  }, [open, origin]);

  const close = useCallback(() => {
    const done = () => {
      setOpen(false);
      getLenis()?.start();
      (opener.current as HTMLElement | null)?.focus?.();
    };
    if (reduced() || !root.current) return done();
    const q = gsap.utils.selector(root);
    gsap
      .timeline({ onComplete: done })
      .to(q(".j-card"), { y: 40, autoAlpha: 0, duration: 0.35, ease: "power2.in" })
      .to(q(".j-veil"), { clipPath: `circle(0% at ${origin.x}% ${origin.y}%)`, duration: 0.6, ease: "power3.inOut" }, 0.15);
  }, [origin]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = String(f.get("name") ?? "").trim();
    const phone = String(f.get("phone") ?? "").replace(/\D/g, "");
    const note = String(f.get("note") ?? "").trim();
    if (name.length < 2) return setError("Please tell us your name.");
    if (!/^(91)?[6-9]\d{9}$/.test(phone)) return setError("Please enter a valid 10-digit mobile number.");
    const msg = [
      "Hi Good Life Fitness Club! I'd like to join.",
      `Name: ${name}`,
      `Phone: ${phone.slice(-10)}`,
      goal.length && `Goal: ${goal.join(", ")}`,
      time && `Preferred time: ${time}`,
      note && `Note: ${note}`,
    ]
      .filter(Boolean)
      .join("\n");
    window.open(whatsapp(msg), "_blank", "noopener,noreferrer");
    close();
  };

  if (!open) return null;

  const chip = (on: boolean) =>
    `rounded-full border px-4 py-2 font-head text-[0.68rem] uppercase tracking-[0.2em] transition duration-300 ${
      on ? "border-gold bg-gold/15 text-gold-light shadow-[0_0_20px_-6px_rgba(201,164,92,.8)]" : "border-white/15 text-white/60 hover:border-gold/50 hover:text-white"
    }`;
  const field =
    "peer w-full border-0 border-b border-white/15 bg-transparent pb-2 pt-5 text-base text-white outline-none transition-colors placeholder:text-transparent focus:border-gold";
  const label =
    "pointer-events-none absolute left-0 top-5 font-head text-xs uppercase tracking-[0.3em] text-white/45 transition-all duration-300 peer-focus:top-0 peer-focus:text-[0.6rem] peer-focus:text-gold peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-[0.6rem]";

  return (
    <div ref={root} className="fixed inset-0 z-[95]" role="dialog" aria-modal="true" aria-labelledby="join-title">
      {/* veil grows out of the clicked button */}
      <div className="j-veil absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_40%,rgba(237,37,30,.18),transparent_70%),radial-gradient(ellipse_50%_50%_at_80%_100%,rgba(201,164,92,.12),transparent_70%),#060606]" onClick={close} />

      <div data-lenis-prevent onClick={(e) => e.target === e.currentTarget && close()} className="absolute inset-0 grid place-items-center overflow-y-auto p-4 [perspective:1400px] md:p-8">
        <div className="j-card relative grid w-full max-w-[1000px] overflow-hidden rounded-[22px] border border-gold/25 bg-[linear-gradient(160deg,#141414,#0a0a0a_60%,#111)] shadow-[0_60px_140px_-30px_rgba(0,0,0,1),inset_0_1px_0_rgba(247,231,189,.12)] md:grid-cols-[0.9fr_1.1fr]">
          <span className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-gold-light to-transparent" />

          {/* visual panel */}
          <div className="j-art relative hidden min-h-[560px] md:block">
            <Image src={`${A}/stills/entrance.jpg`} alt="" fill sizes="40vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20" />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_60%,#0d0d0d)]" />
            <div className="absolute inset-x-8 bottom-8">
              <Image src={`${A}/logo.png`} alt="" width={56} height={56} className="h-14 w-14 rounded-full ring-1 ring-gold/40" />
              <p className="mt-6 font-head text-[0.6rem] uppercase tracking-[0.5em] text-champagne">Private membership</p>
              <p className="display mt-3 text-6xl leading-[0.9]">
                Begin your
                <br />
                good <span className="gold-text">life.</span>
              </p>
              <span className="j-line mt-6 block h-px w-24 origin-left bg-gradient-to-r from-gold to-transparent" />
              <p className="mt-4 max-w-[16rem] text-sm leading-relaxed text-white/60">Three floors. One standard. Tell us about you and we&apos;ll take it from there.</p>
            </div>
          </div>

          {/* form */}
          <form onSubmit={submit} noValidate className="relative p-7 md:p-12">
            <button type="button" onClick={close} aria-label="Close join form" className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full border border-white/10 text-xl leading-none text-white/70 transition hover:rotate-90 hover:border-gold hover:text-gold-light">
              ×
            </button>

            <p className="j-in eyebrow">Join Good Life</p>
            <h2 id="join-title" className="j-in display mt-4 text-[clamp(2.5rem,5vw,3.75rem)]">
              Reserve your <span className="text-brand">spot.</span>
            </h2>

            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <label className="j-in relative block">
                <input name="name" autoComplete="name" placeholder="Full name" required className={field} />
                <span className={label}>Full name</span>
                <span className="j-line absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-gradient-to-r from-gold via-gold-light to-transparent opacity-60" />
              </label>
              <label className="j-in relative block">
                <input name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="Mobile number" required className={field} />
                <span className={label}>Mobile number</span>
                <span className="j-line absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-gradient-to-r from-gold via-gold-light to-transparent opacity-60" />
              </label>
            </div>

            <fieldset className="j-in mt-8">
              <legend className="font-head text-[0.6rem] uppercase tracking-[0.4em] text-champagne">Your goal</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {GOALS.map((g) => (
                  <button key={g} type="button" aria-pressed={goal.includes(g)} onClick={() => setGoal((s) => (s.includes(g) ? s.filter((x) => x !== g) : [...s, g]))} className={chip(goal.includes(g))}>
                    {g}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className="j-in mt-6">
              <legend className="font-head text-[0.6rem] uppercase tracking-[0.4em] text-champagne">Preferred time</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {TIMES.map((t) => (
                  <button key={t} type="button" aria-pressed={time === t} onClick={() => setTime(time === t ? "" : t)} className={chip(time === t)}>
                    {t}
                  </button>
                ))}
              </div>
            </fieldset>

            <label className="j-in relative mt-6 block">
              <input name="note" placeholder="Anything we should know?" className={field} />
              <span className={label}>Anything we should know? (optional)</span>
            </label>

            <p className="min-h-6 pt-3 text-sm text-brand" role="alert">
              {error}
            </p>

            <div className="j-in mt-2 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
              <button type="submit" className="btn btn-primary btn-sheen">
                <WhatsAppIcon size={18} />
                Send request
              </button>
              <p className="max-w-[15rem] text-xs leading-relaxed text-white/45">Opens WhatsApp with your details filled in — we reply personally.</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
