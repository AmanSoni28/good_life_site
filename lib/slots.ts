// Image slots: places where the design wants a large, sharp photo the club does not have yet.
// Until a file exists the slot shows a labelled placeholder. To fill one, save the image as
// public/assets/good-life/gen/<id>.jpg (or .png / .webp), then reload (dev) or rebuild. No code change needed.
export const SLOTS = {
  "train-strength": { label: "Strength training", alt: "Member lifting a loaded barbell on the strength floor", w: 1600, h: 1200, prompt: "Indian man mid deadlift with a loaded barbell in a modern gym, yellow ceiling beams, warm light, shallow depth of field, photorealistic, landscape" },
  "train-functional": { label: "Functional training", alt: "Member training with battle ropes on the turf", w: 1600, h: 1200, prompt: "Indian woman slamming battle ropes on green artificial turf in a covered gym zone, motion in the ropes, dark background, photorealistic, landscape" },
  "train-muscle": { label: "Muscle building", alt: "Member training on a plate-loaded strength machine", w: 1600, h: 1200, prompt: "Indian man pressing on a plate-loaded chest machine in a modern gym, focused face, moody side light, photorealistic, landscape" },
  "train-personal": { label: "Personal training", alt: "Coach guiding a member through a lift", w: 1600, h: 1200, prompt: "Gym coach correcting a member's squat form beside a barbell rack, both Indian, friendly and focused, modern gym, photorealistic, landscape" },
} as const;

export type SlotId = keyof typeof SLOTS;
export const GEN_DIR = "/assets/good-life/gen";
