"use client";
import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, reduced, ScrollTrigger, setLenis } from "@/lib/motion";

export default function SmoothScroll() {
  useEffect(() => {
    if (reduced()) return;
    const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 0.9 });
    setLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const stop = () => lenis.stop();
    const start = () => {
      lenis.start();
      ScrollTrigger.refresh();
    };
    if (document.documentElement.dataset.intro === "playing") stop();
    window.addEventListener("gl:intro-done", start);
    window.addEventListener("gl:replay-intro", stop);

    return () => {
      window.removeEventListener("gl:intro-done", start);
      window.removeEventListener("gl:replay-intro", stop);
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
    };
  }, []);
  return null;
}
