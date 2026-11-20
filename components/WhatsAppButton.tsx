import { JOIN_MESSAGE, whatsapp } from "@/lib/site";

export function WhatsAppIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.47-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.08.15.2 2.1 3.2 5.08 4.49.71.31 1.27.49 1.7.63.72.23 1.37.2 1.88.12.58-.09 1.75-.72 2-1.41.25-.69.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35zM12.04 21.5h-.01a9.45 9.45 0 0 1-4.82-1.32l-.35-.2-3.58.94.96-3.49-.23-.36A9.43 9.43 0 0 1 2.58 12C2.58 6.79 6.82 2.55 12.05 2.55c2.53 0 4.9.99 6.69 2.78a9.4 9.4 0 0 1 2.77 6.69c0 5.21-4.24 9.48-9.47 9.48zm8.05-17.54A11.3 11.3 0 0 0 12.04.64C5.77.64.66 5.74.66 12c0 2 .52 3.96 1.52 5.68L.57 23.36l5.82-1.53a11.4 11.4 0 0 0 5.65 1.44h.01c6.27 0 11.37-5.1 11.38-11.36a11.3 11.3 0 0 0-3.34-8.04z" />
    </svg>
  );
}

export default function WhatsAppButton() {
  return (
    <a
      href={whatsapp(JOIN_MESSAGE)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Good Life Fitness Club on WhatsApp"
      className="group fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#111] text-[#25D366] shadow-[0_10px_30px_rgba(0,0,0,.55)] ring-1 ring-white/10 transition hover:scale-105 hover:bg-[#25D366] hover:text-white md:bottom-8 md:right-8"
    >
      <span className="absolute inset-0 rounded-full ring-2 ring-[#25D366]/60 [animation:pulse-ring_2.4s_ease-out_infinite]" aria-hidden />
      <WhatsAppIcon size={26} />
    </a>
  );
}
