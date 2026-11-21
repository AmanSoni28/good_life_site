# Image slots

Concepts 2 and 3 show a labelled placeholder where the design needs a large, sharp photo.

## How to fill a slot

1. Generate or shoot the image (landscape, about 1600 × 1200).
2. Save it as `public/assets/good-life/gen/<slot id>.jpg` (`.png` and `.webp` also work).
3. Reload the page (dev server), or rebuild and redeploy (live site). No code change is needed.

## Slots

| Slot id | Shows | Used in |
| --- | --- | --- |
| `train-strength` | Member lifting a barbell | Training (both concepts), Strength floor card (concept 2) |
| `train-functional` | Battle ropes on the turf | Training (both concepts) |
| `train-muscle` | Plate-loaded machine | Training (both concepts) |
| `train-personal` | Coach guiding a member | Training (both concepts) |

Suggested prompts for each slot are in `lib/slots.ts`.

## Why these four

The club's reel stills are 476 × 848 px. They look fine in small tiles, so they stay there.
These four spots are shown large, where the small files look soft.

## Other low-quality media

- All videos are 476 × 848 px. The designs only show them in phone-sized frames.
- Coach photos are stock placeholders. Replace `public/assets/good-life/trainers/coach-*.jpg` with real ones.
