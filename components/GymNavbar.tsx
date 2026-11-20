"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getLenis, scrollToHash } from "@/lib/motion";
import { A, NAV, PHONE_DISPLAY, TEL_URL } from "@/lib/site";

export default function GymNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  const setMenu = (v: boolean) => {
    setOpen(v);
    if (v) getLenis()?.stop();
    else getLenis()?.start();
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const go = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    setMenu(false);
    scrollToHash(href);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color,padding] duration-500 ${
        scrolled && !open ? "border-b border-gold/15 bg-ink/75 py-2.5 shadow-[0_10px_40px_-20px_rgba(0,0,0,.9)] backdrop-blur-xl" : "border-b border-transparent py-4 md:py-6"
      }`}
    >
      <nav className="mx-auto flex items-center justify-between px-5 md:px-10" aria-label="Main">
        <a href="#home" onClick={(e) => go(e, "#home")} className="relative z-10 flex items-center gap-3" aria-label="Good Life Fitness Club — home">
          <Image id="nav-logo" src={`${A}/logo.png`} alt="" width={52} height={52} priority className="h-11 w-11 rounded-full md:h-[52px] md:w-[52px]" />
          <span className="hidden font-head text-[0.7rem] font-medium uppercase leading-tight tracking-[0.28em] sm:block">
            Good <span className="text-brand">Life</span>
            <br />
            <span className="text-champagne/70">Fitness Club</span>
          </span>
        </a>

        <ul className="hidden items-center gap-8 lg:flex">
          {NAV.map((n) => (
            <li key={n.href}>
              <a
                href={n.href}
                onClick={(e) => go(e, n.href)}
                className="group relative py-2 font-head text-[0.78rem] uppercase tracking-[0.22em] text-white/80 transition hover:text-white"
              >
                {n.label}
                <span className="absolute -bottom-0.5 left-0 h-px w-full origin-right scale-x-0 bg-gradient-to-r from-gold-light to-gold transition-transform duration-500 group-hover:origin-left group-hover:scale-x-100" />
              </a>
            </li>
          ))}
        </ul>

        <div className="relative z-10 flex items-center gap-3">
          <a href="#contact" onClick={(e) => go(e, "#contact")} className="btn btn-primary hidden !min-h-11 !px-6 sm:inline-flex">
            Join now
          </a>
          <button
            type="button"
            onClick={() => setMenu(!open)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="grid h-11 w-11 place-items-center lg:hidden"
          >
            <span className="relative block h-3 w-7">
              <span className={`absolute left-0 top-0 h-[2px] w-full bg-white transition duration-500 ${open ? "translate-y-[5px] rotate-45" : ""}`} />
              <span className={`absolute bottom-0 left-0 h-[2px] bg-white transition-all duration-500 ${open ? "w-full -translate-y-[5px] -rotate-45" : "w-2/3"}`} />
            </span>
          </button>
        </div>
      </nav>

      {/* mobile menu */}
      <div
        id="mobile-menu"
        className={`fixed inset-0 bg-ink transition-[clip-path] duration-700 ease-[cubic-bezier(.7,0,.2,1)] lg:hidden ${
          open ? "[clip-path:inset(0_0_0_0)]" : "pointer-events-none [clip-path:inset(0_0_100%_0)]"
        }`}
        aria-hidden={!open}
      >
        <div className="absolute -right-20 top-1/3 h-80 w-80 rounded-full bg-brand/20 blur-[100px]" />
        <ul className="flex h-full flex-col justify-center gap-1 px-6 pt-16">
          {NAV.map((n, i) => (
            <li key={n.href} className="overflow-hidden">
              <a
                href={n.href}
                tabIndex={open ? 0 : -1}
                onClick={(e) => go(e, n.href)}
                className={`display flex items-baseline gap-4 py-1 text-[13vw] transition-transform duration-700 ease-[cubic-bezier(.2,.8,.2,1)] sm:text-7xl ${
                  open ? "translate-y-0" : "translate-y-full"
                }`}
                style={{ transitionDelay: open ? `${150 + i * 60}ms` : "0ms" }}
              >
                <span className="font-head text-xs tracking-widest text-gold">0{i + 1}</span>
                {n.label}
              </a>
            </li>
          ))}
          <li className={`mt-8 transition-opacity duration-700 ${open ? "opacity-100 delay-500" : "opacity-0"}`}>
            <a href={TEL_URL} tabIndex={open ? 0 : -1} className="font-head text-sm tracking-[0.25em] text-mist">
              CALL {PHONE_DISPLAY}
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
