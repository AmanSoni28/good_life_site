"use client";
import Image from "next/image";
import { createContext, useContext } from "react";
import { SLOTS, type SlotId } from "@/lib/slots";

const Ready = createContext<Record<string, string>>({});

/** Wrap a page with the list of slots that already have a file (from readySlots() on the server). */
export function SlotsProvider({ ready, children }: { ready: Record<string, string>; children: React.ReactNode }) {
  return <Ready.Provider value={ready}>{children}</Ready.Provider>;
}

/** Fills its (positioned) parent with the slot's image. If the image is not there yet it shows `fallback`
 *  when given (fine for small spots), otherwise a labelled placeholder. */
export function Slot({ id, sizes, className = "", fallback }: { id: SlotId; sizes: string; className?: string; fallback?: string }) {
  const src = useContext(Ready)[id] ?? fallback;
  const s = SLOTS[id];
  if (src) return <Image src={src} alt={s.alt} fill sizes={sizes} className={`object-cover ${className}`} />;
  return (
    <span role="img" aria-label={`Image placeholder: ${s.label}`} className="@container absolute inset-0 block overflow-hidden bg-[#19191b] text-white">
      <span className="absolute inset-0 bg-[repeating-linear-gradient(135deg,rgba(255,255,255,.05)_0_2px,transparent_2px_22px)]" aria-hidden />
      <span className="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(255,255,255,.14),transparent_62%)]" aria-hidden />
      <span className="absolute inset-x-0 top-[30%] hidden flex-col items-center gap-3 px-4 text-center @[15rem]:flex">
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden className="opacity-70">
          <rect x="3" y="4.5" width="18" height="15" rx="3" />
          <circle cx="8.5" cy="10" r="1.6" />
          <path d="m4 17 5-4.5 3.5 3 3-2.5 4.5 4" />
        </svg>
        <span className="text-[11px] font-semibold uppercase tracking-[0.2em] opacity-60">Image placeholder</span>
        <span className="text-base font-medium">{s.label}</span>
        <span className="text-xs tabular-nums opacity-55">
          {s.w} × {s.h} · {id}.jpg
        </span>
      </span>
    </span>
  );
}
