"use client";
// Motion building blocks shared by concepts 2 and 3. Styling is left to the caller, so each concept keeps its own look.
import { useEffect, useId, useRef, useState, type RefObject } from "react";
import { gsap, reduced, ScrollTrigger } from "@/lib/motion";
import { inr, joinLink } from "@/lib/content";

const finePointer = () => typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

/** Runs cb once the preloader has lifted (or straight away if it already has). */
export function onReady(cb: () => void) {
  if (document.documentElement.dataset.ready) {
    cb();
    return () => {};
  }
  window.addEventListener("gl:ready", cb, { once: true });
  return () => window.removeEventListener("gl:ready", cb);
}

/** Short counting curtain that lifts to reveal the page. */
export function Preloader({ className = "", barClassName = "", children }: { className?: string; barClassName?: string; children?: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const num = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const done = () => {
      document.documentElement.dataset.ready = "1";
      window.dispatchEvent(new Event("gl:ready"));
    };
    if (reduced()) {
      setGone(true);
      done();
      return;
    }
    const o = { v: 0 };
    const tl = gsap
      .timeline()
      .to(o, { v: 100, duration: 0.6, ease: "power2.inOut", onUpdate: () => {
        if (num.current) num.current.textContent = String(Math.round(o.v)).padStart(3, "0");
        if (bar.current) bar.current.style.transform = `scaleX(${o.v / 100})`;
      } })
      .add(done, "+=0.05")
      .to(root.current, { yPercent: -100, duration: 0.6, ease: "expo.inOut" }, "<")
      .add(() => setGone(true));
    return () => {
      tl.kill();
    };
  }, []);

  if (gone) return null;
  return (
    <div ref={root} className={`fixed inset-0 z-[80] flex flex-col justify-between p-6 md:p-10 ${className}`} aria-hidden>
      <div className="text-xs font-medium uppercase tracking-[0.22em] opacity-60">{children}</div>
      <div>
        <span ref={num} className="block text-[22vw] font-semibold leading-none tracking-[-0.05em] tabular-nums md:text-[11vw]">
          000
        </span>
        <span className="mt-4 block h-[3px] w-full overflow-hidden bg-current/15">
          <span ref={bar} className={`block h-full w-full origin-left scale-x-0 ${barClassName}`} />
        </span>
      </div>
    </div>
  );
}

/** Text cut into words that sit behind a mask; animate the `.w` spans to reveal them. */
export function Words({ text, className = "", wordClassName = "" }: { text: string; className?: string; wordClassName?: string }) {
  return (
    <span className={className}>
      {text.split(" ").flatMap((w, i) => [
        i ? " " : "",
        <span key={i} className="-mb-[0.14em] inline-block overflow-hidden pb-[0.14em] align-bottom">
          <span className={`w inline-block ${wordClassName}`}>{w}</span>
        </span>,
      ])}
    </span>
  );
}

/** Text cut into letters (`.c`), for per-letter entrances. Words stay unbroken. */
export function Chars({ text, className = "" }: { text: string; className?: string }) {
  return (
    <span className={className} aria-label={text}>
      {text.split(" ").flatMap((w, i) => [
        i ? " " : "",
        <span key={i} className="inline-block whitespace-nowrap" aria-hidden>
          {[...w].map((c, j) => (
            <span key={j} className="c inline-block">
              {c}
            </span>
          ))}
        </span>,
      ])}
    </span>
  );
}

/** Wrapper that leans toward the cursor, then springs back. */
export function Magnetic({ children, strength = 0.3, className = "" }: { children: React.ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current!;
    if (reduced() || !finePointer()) return;
    const move = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      gsap.to(el, { x: (e.clientX - r.left - r.width / 2) * strength, y: (e.clientY - r.top - r.height / 2) * strength, duration: 0.4, ease: "power3.out" });
    };
    const leave = () => gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.4)" });
    el.addEventListener("mousemove", move);
    el.addEventListener("mouseleave", leave);
    return () => {
      el.removeEventListener("mousemove", move);
      el.removeEventListener("mouseleave", leave);
    };
  }, [strength]);
  return (
    <span ref={ref} className={`inline-block ${className}`}>
      {children}
    </span>
  );
}

/** Dot that trails the mouse and grows into a labelled disc over anything with data-cursor="Label". Desktop only. */
export function Cursor({ className = "" }: { className?: string }) {
  const dot = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");
  const [on, setOn] = useState(false);

  useEffect(() => {
    if (reduced() || !finePointer()) return;
    const el = dot.current!;
    setOn(true);
    const x = gsap.quickTo(el, "x", { duration: 0.35, ease: "power3" });
    const y = gsap.quickTo(el, "y", { duration: 0.35, ease: "power3" });
    const move = (e: MouseEvent) => {
      x(e.clientX);
      y(e.clientY);
    };
    const over = (e: MouseEvent) => setLabel((e.target as Element).closest?.<HTMLElement>("[data-cursor]")?.dataset.cursor ?? "");
    window.addEventListener("mousemove", move, { passive: true });
    document.addEventListener("mouseover", over, { passive: true });
    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", over);
    };
  }, []);

  return (
    <div ref={dot} className={`pointer-events-none fixed left-0 top-0 z-[70] ${on ? "" : "hidden"}`} aria-hidden>
      <div
        className={`grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-[10px] font-semibold uppercase tracking-[0.14em] transition-[width,height,opacity] duration-300 ease-out ${label ? "h-20 w-20 opacity-100" : "h-3 w-3 opacity-0"} ${className}`}
      >
        {label}
      </div>
    </div>
  );
}

/** Number that counts up the first time it scrolls into view. */
export function Counter({ to, pad = 2, className = "" }: { to: number; pad?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current!;
    if (reduced()) return;
    const o = { v: 0 };
    el.textContent = "0".padStart(pad, "0");
    const tween = gsap.to(o, { v: to, duration: 1.6, ease: "power2.out", scrollTrigger: { trigger: el, start: "top 90%" }, onUpdate: () => (el.textContent = String(Math.round(o.v)).padStart(pad, "0")) });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [to, pad]);
  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {String(to).padStart(pad, "0")}
    </span>
  );
}

/** Price that rolls to its new value when it changes (monthly / yearly switch). */
export function Price({ value, className = "" }: { value: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const shown = useRef(value);
  useEffect(() => {
    const el = ref.current!;
    if (reduced() || shown.current === value) {
      el.textContent = inr(value);
      shown.current = value;
      return;
    }
    const o = { v: shown.current };
    const tween = gsap.to(o, { v: value, duration: 0.7, ease: "power3.out", onUpdate: () => (el.textContent = inr(Math.round(o.v))) });
    shown.current = value;
    return () => {
      tween.kill();
    };
  }, [value]);
  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {inr(value)}
    </span>
  );
}

/** Endless strip that drifts on its own, speeds up with the scroll and follows its direction. Children are shown twice. */
export function Marquee({ children, speed = 50, reverse = false, className = "" }: { children: React.ReactNode; speed?: number; reverse?: boolean; className?: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = track.current!;
    if (reduced()) return;
    let x = 0;
    let dir = reverse ? 1 : -1;
    let last = window.scrollY;
    let boost = 0;
    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { rootMargin: "100px" });
    io.observe(wrap.current!);
    const tick = (_t: number, dt: number) => {
      const dy = window.scrollY - last;
      last = window.scrollY;
      if (!visible) return;
      const half = el.scrollWidth / 2;
      if (!half) return;
      if (dy) dir = (dy > 0 ? -1 : 1) * (reverse ? -1 : 1);
      boost += (Math.min(Math.abs(dy), 80) * 0.5 - boost) * 0.12;
      x += dir * ((speed * dt) / 1000 + boost);
      x = ((x % half) - half) % half; // stay within (-half, 0]
      el.style.transform = `translate3d(${x}px,0,0)`;
    };
    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      io.disconnect();
    };
  }, [speed, reverse]);

  return (
    <div ref={wrap} className={`overflow-hidden ${className}`}>
      <div ref={track} className="flex w-max will-change-transform">
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}

/** Card that tracks the mouse: sets --mx / --my for a spotlight and, if asked, tilts in 3D. */
export function Spot({ children, className = "", tilt = 0, ...rest }: { children: React.ReactNode; className?: string; tilt?: number } & React.HTMLAttributes<HTMLDivElement>) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current!;
    if (reduced() || !finePointer()) return;
    const move = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const px = e.clientX - r.left;
      const py = e.clientY - r.top;
      el.style.setProperty("--mx", `${px}px`);
      el.style.setProperty("--my", `${py}px`);
      if (tilt) gsap.to(el, { rotateY: (px / r.width - 0.5) * tilt, rotateX: (0.5 - py / r.height) * tilt, transformPerspective: 900, duration: 0.5, ease: "power3.out" });
    };
    const leave = () => tilt && gsap.to(el, { rotateY: 0, rotateX: 0, duration: 0.8, ease: "power3.out" });
    el.addEventListener("mousemove", move);
    el.addEventListener("mouseleave", leave);
    return () => {
      el.removeEventListener("mousemove", move);
      el.removeEventListener("mouseleave", leave);
    };
  }, [tilt]);
  return (
    <div ref={ref} className={className} {...rest}>
      {children}
    </div>
  );
}

/** Thin bar across the top that fills as the page is read. */
export function ScrollBar({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const st = ScrollTrigger.create({ start: 0, end: "max", onUpdate: (s) => ref.current && (ref.current.style.transform = `scaleX(${s.progress})`) });
    return () => st.kill();
  }, []);
  return <span ref={ref} className={`pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px] origin-left scale-x-0 ${className}`} aria-hidden />;
}

/** State and submit handler for the join form (it opens WhatsApp with the details filled in). */
export function useJoin() {
  const [goals, setGoals] = useState<string[]>([]);
  const [time, setTime] = useState("");
  const [error, setError] = useState("");
  const toggleGoal = (g: string) => setGoals((cur) => (cur.includes(g) ? cur.filter((x) => x !== g) : [...cur, g]));
  const toggleTime = (t: string) => setTime((cur) => (cur === t ? "" : t));
  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const r = joinLink(new FormData(e.currentTarget), goals, time);
    if (r.error) return setError(r.error);
    setError("");
    window.open(r.url, "_blank", "noopener,noreferrer");
  };
  return { goals, time, error, toggleGoal, toggleTime, submit };
}

/** Layers inside `root` marked data-depth="30" drift with the mouse (the number is the travel in px). Desktop only. */
export function useParallax(root: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = root.current;
    if (!el || reduced() || !finePointer()) return;
    const items = Array.from(el.querySelectorAll<HTMLElement>("[data-depth]")).map((n) => ({
      x: gsap.quickTo(n, "x", { duration: 0.9, ease: "power3" }),
      y: gsap.quickTo(n, "y", { duration: 0.9, ease: "power3" }),
      d: Number(n.dataset.depth),
    }));
    const move = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      items.forEach((i) => {
        i.x(px * i.d);
        i.y(py * i.d);
      });
    };
    el.addEventListener("mousemove", move);
    return () => el.removeEventListener("mousemove", move);
  }, [root]);
}

/** Round badge with text running around the rim. It turns slowly and spins up while the page scrolls. */
export function SpinBadge({ text, className = "", children }: { text: string; className?: string; children?: React.ReactNode }) {
  const ring = useRef<SVGSVGElement>(null);
  const id = useId();
  useEffect(() => {
    if (reduced()) return;
    let r = 0;
    let last = window.scrollY;
    let boost = 0;
    const tick = (_t: number, dt: number) => {
      const dy = Math.abs(window.scrollY - last);
      last = window.scrollY;
      boost += (Math.min(dy, 60) * 0.25 - boost) * 0.1;
      r += dt * 0.02 + boost;
      if (ring.current) ring.current.style.transform = `rotate(${r}deg)`;
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, []);
  return (
    <span className={className} aria-hidden>
      <span className="relative grid h-full w-full place-items-center">
        <svg ref={ring} viewBox="0 0 200 200" className="absolute inset-0 h-full w-full">
          <defs>
            <path id={id} d="M100,100 m-80,0 a80,80 0 1,1 160,0 a80,80 0 1,1 -160,0" />
          </defs>
          <text fill="currentColor" fontSize="17" fontWeight="600" letterSpacing="4.4" style={{ textTransform: "uppercase" }}>
            <textPath href={`#${id}`}>{text}</textPath>
          </text>
        </svg>
        {children}
      </span>
    </span>
  );
}
