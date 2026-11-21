"use client";
import Image from "next/image";
import { useEffect } from "react";
import { CONCEPTS } from "@/lib/content";
import { A } from "@/lib/site";

// how each panel dresses: its concept's own colours, display type and button
const SKIN = [
  {
    panel: "bg-[#080808] text-white ring-1 ring-inset ring-white/10",
    name: "uppercase tracking-[0.03em] leading-[0.9] [font-family:var(--f-bebas)] bg-[linear-gradient(135deg,#f7e7bd,#c9a45c_40%,#8a6a2f_65%,#e9d199)] bg-clip-text text-transparent",
    soft: "text-white/65",
    rule: "border-white/15",
    btn: "bg-[#ed251e] text-white",
    frame: "border-white/15 bg-[#151515]",
    dot: "bg-white/35",
    swatches: ["#080808", "#ed251e", "#c9a45c", "#d9cbad"],
    fonts: "Bebas Neue · Oswald",
  },
  {
    panel: "bg-[#f3f3f0] text-[#0b0b0c]",
    name: "font-semibold leading-[0.95] tracking-[-0.05em] [font-family:var(--f-tight)]",
    soft: "text-[#6a6a70]",
    rule: "border-[#0b0b0c]/15",
    btn: "bg-[#0b0b0c] text-white",
    frame: "border-[#0b0b0c]/10 bg-white shadow-[0_30px_60px_-25px_rgba(11,11,12,.4)]",
    dot: "bg-[#0b0b0c]/20",
    swatches: ["#f3f3f0", "#0b0b0c", "#ed251e", "#ffffff"],
    fonts: "Inter Tight · Inter",
  },
  {
    panel: "bg-[#050505] text-white ring-1 ring-inset ring-white/10",
    name: "font-semibold uppercase leading-[0.95] tracking-[-0.05em] text-[#c8ff3e] [font-family:var(--f-sora)]",
    soft: "text-white/65",
    rule: "border-white/15",
    btn: "bg-[#c8ff3e] text-[#050505]",
    frame: "border-white/15 bg-[#0f0f10] shadow-[0_0_70px_-20px_rgba(200,255,62,.45)]",
    dot: "bg-white/35",
    swatches: ["#050505", "#c8ff3e", "#f4f4f2", "#0f0f10"],
    fonts: "Sora · Inter",
  },
];

export default function ConceptChooser() {
  // press 1, 2 or 3 to open a concept
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const c = CONCEPTS[Number(e.key) - 1];
      if (c) window.location.href = `/${c.slug}`;
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="flex min-h-[100svh] flex-col lg:h-[100svh]">
      <header className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3 px-5 py-4 md:px-8">
        <div className="flex items-center gap-3">
          <Image src={`${A}/logo.png`} alt="" width={40} height={40} className="h-10 w-10 rounded-full" priority />
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/55">Good Life Fitness Club</p>
            <h1 className="text-base font-semibold tracking-[-0.01em] md:text-lg">Choose a website concept</h1>
          </div>
        </div>
        <p className="max-w-md text-sm leading-snug text-white/60">
          Same club, same content, three different looks. Open each one, scroll through it, then pick the one that feels right.
          <span className="hidden lg:inline"> Keys 1, 2 and 3 work too.</span>
        </p>
      </header>

      <main className="flex min-h-0 flex-1 flex-col gap-2 px-2 pb-2 lg:flex-row">
        {CONCEPTS.map((c, i) => {
          const s = SKIN[i];
          return (
            <a
              key={c.slug}
              href={`/${c.slug}`}
              aria-label={`Open concept ${c.n}: ${c.name}. ${c.mood}.`}
              style={{ animationDelay: `${i * 110}ms` }}
              className={`group relative flex min-h-[78svh] flex-col overflow-hidden rounded-2xl transition-[flex-grow] duration-700 ease-[cubic-bezier(.7,0,.2,1)] [animation:rise_.9s_cubic-bezier(.2,.7,.2,1)_both] lg:min-h-0 lg:flex-1 lg:hover:flex-[1.55] lg:focus-visible:flex-[1.55] ${s.panel}`}
            >
              <div className="p-6 md:p-8">
                <div className={`flex items-center justify-between border-b pb-4 text-[11px] font-medium uppercase tracking-[0.2em] ${s.rule}`}>
                  <span>Concept {c.n}</span>
                  <span className={s.soft}>{c.mood}</span>
                </div>
                <h2 className={`mt-6 ${i === 2 ? "text-[clamp(3rem,5vw,5rem)]" : "text-[clamp(3.4rem,6.2vw,6.25rem)]"} ${s.name}`}>{c.name}</h2>
                <p className={`mt-4 max-w-[21rem] text-[15px] leading-snug ${s.soft}`}>{c.line}</p>
                <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
                  <span className={`inline-flex h-11 items-center gap-3 rounded-full px-5 text-[11px] font-semibold uppercase tracking-[0.18em] transition-transform duration-500 group-hover:translate-x-1 ${s.btn}`}>
                    Open concept
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden className="transition-transform duration-500 group-hover:translate-x-1">
                      <path d="M3 12h17M13 5l7 7-7 7" />
                    </svg>
                  </span>
                  <span className="flex items-center gap-3">
                    <span className="flex" aria-hidden>
                      {s.swatches.map((w) => (
                        <span key={w} className="-ml-1.5 h-5 w-5 rounded-full border border-black/25 first:ml-0" style={{ background: w }} />
                      ))}
                    </span>
                    <span className={`text-[11px] font-medium uppercase tracking-[0.14em] ${s.soft}`}>{s.fonts}</span>
                  </span>
                </div>
              </div>

              {/* real screenshot of the concept, in a small browser window */}
              <div className="relative min-h-[34svh] flex-1 px-6 md:px-8 lg:min-h-0">
                <div className={`absolute inset-x-6 bottom-0 top-2 translate-y-5 overflow-hidden rounded-t-xl border border-b-0 transition-transform duration-700 ease-[cubic-bezier(.7,0,.2,1)] group-hover:translate-y-0 group-focus-visible:translate-y-0 md:inset-x-8 ${s.frame}`}>
                  <div className="flex h-7 items-center gap-1.5 px-3" aria-hidden>
                    {[0, 1, 2].map((d) => (
                      <span key={d} className={`h-2 w-2 rounded-full ${s.dot}`} />
                    ))}
                  </div>
                  <div className="relative h-[calc(100%-1.75rem)] overflow-hidden">
                    <Image
                      src={`/concepts/${c.slug}.jpg`}
                      alt={`Screenshot of the ${c.name} concept`}
                      fill
                      priority
                      sizes="(min-width:1024px) 50vw, 92vw"
                      className="object-cover object-left-top transition-transform duration-[1400ms] ease-out group-hover:scale-[1.03]"
                    />
                  </div>
                </div>
              </div>
            </a>
          );
        })}
      </main>
    </div>
  );
}
