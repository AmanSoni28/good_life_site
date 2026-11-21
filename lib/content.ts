// Shared copy for concepts 2 and 3. Same facts as concept 1, so the three designs can be compared like for like.
import { A, whatsapp } from "./site";
import type { SlotId } from "./slots";

export const img = (p: string) => `${A}/${p}`;
export const vid = (name: string) => ({ src: `${A}/videos/${name}.mp4`, poster: `${A}/videos/${name}.jpg` });

export const ABOUT =
  "A unisex gym across three dedicated training floors, built for anyone ready to train hard, stay strong and live better.";

export const MOTTO = ["Train hard", "Stay strong", "Live better"];

export const FACTS = [
  { value: "03", label: "Training floors" },
  { value: "Unisex", label: "Open to everyone" },
  { value: "Turf", label: "Functional zone" },
];

// Zones match the club's own cardio / strength / turf footage.
export const ZONES = [
  { n: "01", name: "Cardio", slot: undefined, title: "Cardio zone", text: "Treadmills, stair climbers and ellipticals.", img: "cardio-area.jpg", alt: "Row of treadmills on the cardio floor", video: "women-cardio" },
  { n: "02", name: "Strength", slot: "train-strength" as SlotId, title: "Strength floor", text: "Barbells, machines and lifting stations.", img: "videos/strength-machines.jpg", alt: "Plate-loaded strength machines on the gym floor", video: "strength-machines" },
  { n: "03", name: "Turf", slot: undefined, title: "Functional turf", text: "Open turf, battle ropes and plyo boxes.", img: "turf-area.jpg", alt: "Covered turf zone with battle ropes and plyo boxes", video: "cardio-ropes" },
];

// Offerings confirmed by the club's signage and visible in its photos/videos.
export const FACILITIES = [
  { title: "Strength Training", slot: "train-strength" as SlotId, img: "stills/deadlift.jpg", alt: "Member loading a barbell", text: "Barbells, plates and lifting stations.", tags: ["Barbells", "Plates", "Lifting stations"] },
  { title: "Cardio Training", slot: undefined, img: "cardio-area.jpg", alt: "Row of treadmills on the cardio floor", text: "Treadmills, stair climbers and ellipticals.", tags: ["Treadmills", "Stair climbers", "Ellipticals"] },
  { title: "Functional Training", slot: "train-functional" as SlotId, img: "stills/battle-ropes.jpg", alt: "Member training with battle ropes", text: "Open turf, battle ropes and plyo boxes.", tags: ["Turf zone", "Battle ropes", "Plyo boxes"] },
  { title: "Muscle Building", slot: "train-muscle" as SlotId, img: "stills/chest-press.jpg", alt: "Member training on a strength machine", text: "Machines for every major muscle group.", tags: ["Machines", "Plate-loaded", "Isolation"] },
  { title: "Personal Training", slot: "train-personal" as SlotId, img: "stills/barbell-setup.jpg", alt: "Member setting up a barbell", text: "One-to-one coaching, built around you.", tags: ["One-to-one", "Form coaching", "Accountability"] },
  { title: "Body Transformation", slot: undefined, img: "member-progress.jpg", alt: "Member checking progress in the gym mirror", text: "Fat loss and muscle gain programmes.", tags: ["Fat loss", "Muscle gain", "Programmes"] },
];
export const ALSO = ["Group Classes", "Nutrition Guidance", "Weight Loss Programs"];

// Only authentic club media.
export const GALLERY = [
  { src: "cardio-area.jpg", alt: "Cardio floor with treadmills and blue lighting", caption: "Cardio floor" },
  { src: "turf-area.jpg", alt: "Covered turf zone with battle ropes and plyo boxes", caption: "Turf zone" },
  { src: "stills/stair-climber.jpg", alt: "Member on the stair climber by the windows", caption: "Stair climber" },
  { src: "videos/strength-machines.jpg", alt: "Strength machines and plate loading", caption: "Strength zone" },
  { src: "floors.jpg", alt: "Good Life Fitness Club facade lit up at night", caption: "After dark" },
  { src: "stills/entrance.jpg", alt: "The neon-lit entrance to the gym", caption: "The entrance" },
  { src: "stills/battle-ropes.jpg", alt: "Member training with battle ropes", caption: "Battle ropes" },
  { src: "stills/chest-press.jpg", alt: "Member training on a strength machine", caption: "Machines" },
  { src: "member-progress.jpg", alt: "Member checking progress in the mirror", caption: "Progress" },
  { src: "building.jpg", alt: "The full Good Life Fitness Club building", caption: "Three floors" },
];

// shortcut: Unsplash stock photos and sample names, replace with the club's real coaches before launch
export const COACHES = [
  { first: "Rahul", last: "Verma", role: "Head Strength Coach", img: "trainers/coach-1.jpg", alt: "Coach curling a dumbbell", line: "Heavy basics, clean form, steady progress. Every rep has a reason.", tags: ["Powerlifting", "Hypertrophy", "Form coaching"] },
  { first: "Priya", last: "Sharma", role: "Functional Training Coach", img: "trainers/coach-2.jpg", alt: "Coach holding battle ropes", line: "Train like an athlete: move better, last longer, feel unstoppable.", tags: ["Conditioning", "Battle ropes", "Mobility"] },
  { first: "Arjun", last: "Singh", role: "Body Transformation Coach", img: "trainers/coach-3.jpg", alt: "Coach in the weights area", line: "Fat loss and muscle gain, planned week by week until the mirror agrees.", tags: ["Fat loss", "Muscle gain", "Nutrition"] },
  { first: "Neha", last: "Kapoor", role: "Personal Training Coach", img: "trainers/coach-4.jpg", alt: "Coach guiding a member through an exercise", line: "One-to-one sessions built around you, your goals and your schedule.", tags: ["One-to-one", "Beginners", "Accountability"] },
];
export const bookCoach = (name: string) => whatsapp(`Hi! I'd like to train with ${name} at Good Life Fitness Club.`);

// shortcut: sample prices and perks (INR) — replace with the club's real plans before launch
export const PLANS = [
  { name: "Essential", tag: "Start strong", monthly: 1499, yearly: 14999, featured: false, perks: ["All 3 training floors", "Strength & cardio zones", "Functional turf access", "Free first-day orientation"] },
  { name: "Signature", tag: "Most chosen", monthly: 2499, yearly: 23999, featured: true, perks: ["Everything in Essential", "Monthly body assessment", "Custom workout plan", "Diet guidance from coaches", "Priority slot booking"] },
  { name: "Black", tag: "The full club", monthly: 4999, yearly: 47999, featured: false, perks: ["Everything in Signature", "Personal training sessions", "1-to-1 progress reviews", "Nutrition plan, updated monthly"] },
];
export const inr = (n: number) => n.toLocaleString("en-IN");
export const planSave = (p: (typeof PLANS)[number]) => Math.round((1 - p.yearly / (p.monthly * 12)) * 100);
export const planMessage = (name: string, billing: string) => whatsapp(`Hi! I'm interested in the ${name} plan (${billing}) at Good Life Fitness Club.`);

export const GOALS = ["Strength", "Weight loss", "Cardio & stamina", "Functional", "Personal training"];
export const TIMES = ["Morning", "Afternoon", "Evening"];

/** Validates the join form and returns the WhatsApp link, or an error to show. */
export function joinLink(f: FormData, goals: string[], time: string): { url?: string; error?: string } {
  const name = String(f.get("name") ?? "").trim();
  const phone = String(f.get("phone") ?? "").replace(/\D/g, "");
  if (name.length < 2) return { error: "Please tell us your name." };
  if (!/^(91)?[6-9]\d{9}$/.test(phone)) return { error: "Please enter a valid 10-digit mobile number." };
  const msg = [
    "Hi Good Life Fitness Club! I'd like to join.",
    `Name: ${name}`,
    `Phone: ${phone.slice(-10)}`,
    goals.length && `Goal: ${goals.join(", ")}`,
    time && `Preferred time: ${time}`,
  ]
    .filter(Boolean)
    .join("\n");
  return { url: whatsapp(msg) };
}

export const CONCEPTS = [
  { n: "01", slug: "concept-1", name: "Cinematic", mood: "Dark, red and gold", line: "A night-time film of the club, with a 3D building." },
  { n: "02", slug: "concept-2", name: "Daylight", mood: "Light, clean, rounded", line: "Bright and airy. Clips in the headline, soft cards." },
  { n: "03", slug: "concept-3", name: "Voltage", mood: "Dark, video-first, neon", line: "Video wall, one neon accent, zooming gallery." },
] as const;
