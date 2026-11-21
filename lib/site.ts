// Business facts. Only details verified from the supplied assets live here.
export const BRAND = "GOOD LIFE FITNESS CLUB";
export const PHONE = "7895477196";
export const PHONE_DISPLAY = "+91 78954 77196";
export const TEL_URL = `tel:+91${PHONE}`;
export const WHATSAPP_URL = `https://wa.me/91${PHONE}`;
// Handle taken from the watermark on the club's own videos.
export const INSTAGRAM_HANDLE = "@goodlifefitness.club";
export const INSTAGRAM_URL = "https://www.instagram.com/goodlifefitness.club/";

export const whatsapp = (msg: string) => `${WHATSAPP_URL}?text=${encodeURIComponent(msg)}`;
export const JOIN_MESSAGE = "Hi Good Life Fitness Club! I'd like to join. Please share the membership details.";

export const A = "/assets/good-life";

export const NAV = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Facilities", href: "#facilities" },
  { label: "Three Floors", href: "#floors" },
  { label: "Gallery", href: "#gallery" },
  { label: "Trainers", href: "#trainers" },
  { label: "Contact", href: "#contact" },
] as const;
