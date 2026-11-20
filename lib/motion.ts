"use client";
import { useLayoutEffect, type DependencyList, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);
export { gsap, ScrollTrigger };

export const reduced = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** gsap.context scoped to a ref; everything created inside is reverted on unmount. */
export function useGsap(
  scope: RefObject<HTMLElement | null>,
  fn: () => void | (() => void),
  deps: DependencyList = [],
) {
  useLayoutEffect(() => {
    let cleanup: void | (() => void);
    const ctx = gsap.context(() => {
      cleanup = fn();
    }, scope.current ?? undefined);
    return () => {
      cleanup?.();
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

let lenis: Lenis | null = null;
export const setLenis = (l: Lenis | null) => (lenis = l);
export const getLenis = () => lenis;

export function scrollToHash(hash: string) {
  const el = document.querySelector<HTMLElement>(hash);
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { duration: 1.4 });
  else el.scrollIntoView({ behavior: reduced() ? "auto" : "smooth" });
}

/** Runs cb once the intro has handed over to the page (or immediately if it was skipped/seen). */
export function onIntroDone(cb: () => void) {
  if (document.documentElement.dataset.intro !== "playing") {
    cb();
    return () => {};
  }
  window.addEventListener("gl:intro-done", cb, { once: true });
  return () => window.removeEventListener("gl:intro-done", cb);
}
