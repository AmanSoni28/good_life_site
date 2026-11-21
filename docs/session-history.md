# Session history

## 2026-11-21 — Concept chooser

- The original site moved to `/concept-1`. `/` is now a chooser page with three concepts.
- Added `/concept-2` (Daylight: light, clean, cards) and `/concept-3` (Voltage: dark, video wall, lime accent).
- Shared pieces: `components/fx.tsx` (motion helpers), `components/JoinWizard.tsx` (three-step enquiry form
  with a live member pass), `components/Slot.tsx` (image placeholders, see `docs/image-slots.md`).
- Speed: no backdrop blur on fixed elements over video or WebGL; only the front floor card plays its clip.
  Measured in Chrome on a production build: concepts 2 and 3 scroll at about 110 to 120 fps, concept 1 at 35 to 60.

### Deploy

- Cloudflare Worker `goodlife-concepts` (static files): https://goodlife-concepts.hidden-band-24e2.workers.dev
- Deploy again with `npm run deploy` (static export to `./out`, then `wrangler deploy`).
- The whole preview sends `X-Robots-Tag: noindex` (`public/_headers`): prices and coach photos are placeholders.
- Tested before deploy: `wrangler dev` on the static build, all four routes, no console errors, desktop 1440 px.
- `main` is unchanged, so the Vercel site (goodlifesite.vercel.app) still shows the original design.

### Open items

- Four image slots are empty placeholders (`docs/image-slots.md`).
- Plan prices and coach names/photos are samples.
- Concept 1 has not had a performance pass.
