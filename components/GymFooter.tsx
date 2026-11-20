"use client";
import Image from "next/image";
import { scrollToHash } from "@/lib/motion";
import { A, INSTAGRAM_HANDLE, INSTAGRAM_URL, NAV, PHONE_DISPLAY, TEL_URL, WHATSAPP_URL } from "@/lib/site";

export default function GymFooter() {
  const replay = () => {
    try {
      sessionStorage.removeItem("gl-intro");
    } catch {}
    window.scrollTo(0, 0);
    document.documentElement.dataset.intro = "playing";
    window.dispatchEvent(new Event("gl:replay-intro"));
  };

  return (
    <footer className="relative border-t border-gold/20 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(201,164,92,.07),transparent_70%),#050505] pt-20">
      <div className="mx-auto grid gap-12 px-5 md:grid-cols-12 md:px-10">
        <div className="md:col-span-5">
          <Image src={`${A}/logo.png`} alt="Good Life Fitness Club logo" width={96} height={96} className="h-24 w-24 rounded-full" />
          <p className="display mt-6 text-4xl">
            Good <span className="text-brand">Life</span> Fitness <span className="text-brand">Club</span>
          </p>
          <p className="mt-3 font-head text-sm uppercase tracking-[0.25em] text-mist">Train Hard. Stay Strong. Live Better.</p>
        </div>
        <nav className="md:col-span-3" aria-label="Footer">
          <p className="font-head text-xs uppercase tracking-[0.3em] text-gold">Explore</p>
          <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-1 md:grid-cols-1">
            {NAV.map((n) => (
              <li key={n.href}>
                <a href={n.href} onClick={(e) => (e.preventDefault(), scrollToHash(n.href))} className="inline-block py-1.5 text-white/70 transition hover:text-white">
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="md:col-span-4">
          <p className="font-head text-xs uppercase tracking-[0.3em] text-gold">Contact</p>
          <ul className="mt-5 space-y-3 text-white/70">
            <li>
              <a href={TEL_URL} className="transition hover:text-white">Phone · {PHONE_DISPLAY}</a>
            </li>
            <li>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="transition hover:text-white">WhatsApp · {PHONE_DISPLAY}</a>
            </li>
            <li>
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="transition hover:text-white">Instagram · {INSTAGRAM_HANDLE}</a>
            </li>
          </ul>
        </div>
      </div>

      <p className="pointer-events-none mt-16 select-none overflow-hidden whitespace-nowrap text-center font-display text-[17vw] leading-[0.8] text-gold/[0.06]" aria-hidden>
        GOOD LIFE
      </p>

      <div className="mx-auto flex flex-col gap-3 border-t border-gold/10 px-5 py-6 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between md:px-10">
        <p>© {new Date().getFullYear()} Good Life Fitness Club. All rights reserved.</p>
        <button type="button" onClick={replay} className="self-start py-2 font-head uppercase tracking-[0.25em] transition hover:text-brand sm:self-auto">
          Replay intro ↺
        </button>
      </div>
    </footer>
  );
}
