"use client";
// Enquiry form as three quick questions, with a member pass that fills itself in as you answer.
// It ends by opening WhatsApp with the details. Looks come from the `skin`, so each concept styles it its own way.
import Image from "next/image";
import { useState } from "react";
import { Spot } from "@/components/fx";
import { GOALS, TIMES, img, joinLink } from "@/lib/content";

export type JoinSkin = {
  panel: string;
  bar: string;
  barOn: string;
  count: string;
  question: string;
  chip: (on: boolean) => string;
  tile: (on: boolean) => string;
  label: string;
  field: string;
  error: string;
  back: string;
  next: string;
  pass: string;
  passSoft: string;
  passRule: string;
};

const QUESTIONS = ["What do you want to work on?", "When do you train?", "Where do we reach you?"];

const TIME_ICON: Record<string, React.ReactNode> = {
  Morning: <path d="M4 18h16M7 18a5 5 0 0 1 10 0M12 6v3M5.5 9.5l2 2M18.500 9.5l-2 2" />,
  Afternoon: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v2.500M12 18.500V21M3 12h2.500M18.500 12H21M5.600 5.600l1.800 1.800M16.600 16.600l1.800 1.800M5.600 18.400l1.800-1.800M16.600 7.400l1.800-1.800" />
    </>
  ),
  Evening: <path d="M20 14.500A8 8 0 1 1 9.500 4a6.500 6.500 0 0 0 10.500 10.500z" />,
};

/** A value on the pass; re-keyed so it animates in whenever it changes. */
const Val = ({ v, empty }: { v: string; empty: string }) => (
  <span key={v} className={`block [animation:step-in_.45s_cubic-bezier(.2,.7,.2,1)] ${v ? "" : "opacity-45"}`}>
    {v || empty}
  </span>
);

export default function JoinWizard({ skin, arrow }: { skin: JoinSkin; arrow: React.ReactNode }) {
  const [step, setStep] = useState(0);
  const [goals, setGoals] = useState<string[]>([]);
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const last = step === QUESTIONS.length - 1;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!last) return setStep(step + 1);
    const f = new FormData();
    f.set("name", name);
    f.set("phone", phone);
    const r = joinLink(f, goals, time);
    if (r.error) return setError(r.error);
    setError("");
    window.open(r.url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[1.2fr_.8fr] lg:items-stretch">
      <form onSubmit={submit} noValidate className={`flex flex-col ${skin.panel}`}>
        <div className="flex items-center gap-3">
          <div className="flex flex-1 gap-1.5" aria-hidden>
            {QUESTIONS.map((_, i) => (
              <span key={i} className={`h-1 flex-1 overflow-hidden rounded-full ${skin.bar}`}>
                <span className={`block h-full origin-left rounded-full transition-transform duration-700 ease-[cubic-bezier(.7,0,.2,1)] ${skin.barOn} ${i <= step ? "scale-x-100" : "scale-x-0"}`} />
              </span>
            ))}
          </div>
          <span className={`tabular-nums ${skin.count}`}>
            {step + 1} / {QUESTIONS.length}
          </span>
        </div>

        <div key={step} className="mt-8 min-h-[15.5rem] flex-1 [animation:step-in_.5s_cubic-bezier(.2,.7,.2,1)]" aria-live="polite">
          <p className={skin.question}>{QUESTIONS[step]}</p>

          {step === 0 && (
            <div className="mt-6 flex flex-wrap gap-2.5">
              {GOALS.map((g) => {
                const on = goals.includes(g);
                return (
                  <button key={g} type="button" aria-pressed={on} onClick={() => setGoals(on ? goals.filter((x) => x !== g) : [...goals, g])} className={skin.chip(on)}>
                    {g}
                  </button>
                );
              })}
            </div>
          )}

          {step === 1 && (
            <div className="mt-6 grid grid-cols-3 gap-2.5">
              {TIMES.map((t) => (
                <button
                  key={t}
                  type="button"
                  aria-pressed={time === t}
                  onClick={() => {
                    setTime(t);
                    setStep(2);
                  }}
                  className={skin.tile(time === t)}
                >
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    {TIME_ICON[t]}
                  </svg>
                  {t}
                </button>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className={skin.label}>
                Name
                <input value={name} onChange={(e) => setName(e.target.value)} name="name" autoComplete="name" placeholder="Your name" className={skin.field} />
              </label>
              <label className={skin.label}>
                Mobile
                <input value={phone} onChange={(e) => setPhone(e.target.value.replace(/[^\d+ ]/g, ""))} name="phone" type="tel" inputMode="numeric" autoComplete="tel" placeholder="10 digits" className={skin.field} />
              </label>
            </div>
          )}
        </div>

        <p role="alert" className={`min-h-5 ${skin.error}`}>
          {error}
        </p>
        <div className="mt-3 flex items-center justify-between gap-3">
          <button type="button" onClick={() => setStep(step - 1)} className={`${skin.back} ${step ? "" : "invisible"}`}>
            Back
          </button>
          <button type="submit" className={skin.next}>
            {last ? "Send on WhatsApp" : "Next"}
            {arrow}
          </button>
        </div>
      </form>

      {/* the pass fills in live */}
      <Spot tilt={9} className={`relative flex min-h-[19rem] flex-col justify-between overflow-hidden ${skin.pass}`}>
        <span className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full border border-current opacity-15" aria-hidden />
        <span className="pointer-events-none absolute -right-6 -top-6 h-36 w-36 rounded-full border border-current opacity-15" aria-hidden />
        <div className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-2.5 text-sm font-semibold">
            <Image src={img("logo.png")} alt="" width={36} height={36} className="h-9 w-9 rounded-full" />
            Good Life
          </span>
          <span className={`text-[11px] font-semibold uppercase tracking-[0.2em] ${skin.passSoft}`}>Member pass</span>
        </div>
        <div>
          <p className="text-[clamp(1.9rem,3.4vw,3rem)] font-semibold leading-none tracking-[-0.04em]">
            <Val v={name.trim()} empty="Your name" />
          </p>
          <dl className={`mt-6 grid grid-cols-2 gap-x-4 gap-y-4 border-t pt-5 text-sm ${skin.passRule}`}>
            <div>
              <dt className={skin.passSoft}>Goal</dt>
              <dd className="mt-1 font-semibold">
                <Val v={goals.join(", ")} empty="Pick a goal" />
              </dd>
            </div>
            <div>
              <dt className={skin.passSoft}>Time</dt>
              <dd className="mt-1 font-semibold">
                <Val v={time} empty="Pick a time" />
              </dd>
            </div>
            <div>
              <dt className={skin.passSoft}>Floors</dt>
              <dd className="mt-1 font-semibold">All 03</dd>
            </div>
            <div>
              <dt className={skin.passSoft}>Mobile</dt>
              <dd className="mt-1 font-semibold tabular-nums">
                <Val v={phone.trim()} empty="—" />
              </dd>
            </div>
          </dl>
        </div>
      </Spot>
    </div>
  );
}
