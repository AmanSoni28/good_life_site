"use client";
import { useEffect, useRef, useState } from "react";
import { reduced } from "@/lib/motion";

type Props = {
  src: string;
  poster: string;
  label: string;
  className?: string;
  /** render a play/pause toggle (parent must be positioned) */
  toggle?: boolean;
};

/** Muted, looping, silent video that only loads/plays while on screen. */
export default function LazyVideo({ src, poster, label, className, toggle }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const userPaused = useRef(reduced());
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const v = ref.current!;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          if (!v.getAttribute("src")) v.src = src;
          if (!userPaused.current) v.play().catch(() => {});
        } else v.pause();
      },
      { rootMargin: "150px" },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [src]);

  const flip = () => {
    const v = ref.current!;
    if (!v.getAttribute("src")) v.src = src;
    if (v.paused) {
      userPaused.current = false;
      v.play().catch(() => {});
    } else {
      userPaused.current = true;
      v.pause();
    }
  };

  return (
    <>
      <video
        ref={ref}
        poster={poster}
        muted
        loop
        playsInline
        preload="none"
        aria-label={label}
        className={className}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      {toggle && (
        <button
          type="button"
          onClick={flip}
          aria-label={playing ? `Pause video: ${label}` : `Play video: ${label}`}
          className="absolute bottom-4 right-4 z-10 grid h-11 w-11 place-items-center rounded-full border border-white/30 bg-black/50 backdrop-blur-sm transition hover:border-brand hover:bg-brand"
        >
          {playing ? (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden>
              <rect x="2" y="1" width="3.5" height="12" />
              <rect x="8.5" y="1" width="3.5" height="12" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden>
              <path d="M3 1.5v11l9-5.5z" />
            </svg>
          )}
        </button>
      )}
    </>
  );
}
