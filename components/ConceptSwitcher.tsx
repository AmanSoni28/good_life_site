import { CONCEPTS } from "@/lib/content";

/** Small fixed pill shown on every concept, so a reviewer can hop between the three or go back to the chooser.
 *  No backdrop blur: a blurred fixed layer over video or WebGL has to be re-blurred every frame and costs real fps.
 *  Plain links on purpose: each concept has its own root layout and stylesheet, so a full page load is wanted. */
export default function ConceptSwitcher({ current }: { current: string }) {
  return (
    <nav
      aria-label="Design concepts"
      className="fixed bottom-5 left-1/2 z-[90] -translate-x-1/2 flex items-center gap-1 rounded-full border border-white/20 bg-[#0b0b0b] p-1 font-sans text-[11px] font-medium tracking-[0.08em] text-white shadow-[0_10px_30px_rgba(0,0,0,.35)] md:bottom-8"
    >
      <a href="/" className="flex h-9 items-center gap-2 rounded-full px-3 uppercase text-white/75 transition hover:bg-white/10 hover:text-white">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden>
          <rect width="5" height="5" rx="1" />
          <rect x="7" width="5" height="5" rx="1" />
          <rect y="7" width="5" height="5" rx="1" />
          <rect x="7" y="7" width="5" height="5" rx="1" />
        </svg>
        <span className="hidden sm:inline">Concepts</span>
      </a>
      <span className="h-4 w-px bg-white/20" aria-hidden />
      {CONCEPTS.map((c) => {
        const on = c.slug === current;
        return (
          <a
            key={c.slug}
            href={`/${c.slug}`}
            aria-current={on ? "page" : undefined}
            aria-label={`Concept ${c.n}: ${c.name}`}
            title={c.name}
            className={`grid h-9 min-w-9 place-items-center rounded-full px-2 tabular-nums transition ${on ? "bg-white text-black" : "text-white/75 hover:bg-white/10 hover:text-white"}`}
          >
            {c.n}
          </a>
        );
      })}
    </nav>
  );
}
