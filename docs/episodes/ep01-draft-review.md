# EP01 5-Min Draft — Frame-by-Frame Review (2026-07-16)

Reviewed by stepping through the assembled MP4 (job `07ebef91`) scene by scene.
Audio not assessed (reviewer limitation) — pacing/voice notes below are flagged for
human listen-through.

## What works (keep)

- **Cold open street scene** — mood, safety-pin coat detail, coin-slide beat: exactly on brief.
- **Professor Penny is remarkably on-model in every appearance** — bathtub (clipboard,
  drooping ears), the worried close-up, magnifying-glass jar scene, diner (glasses off,
  across the table from Read — more intimate than scripted, keep it). The identity-reference
  pipeline works.
- **The exact-numbers chart is perfect** — $55K/$177K/$447K/$1.6M/$8M with year labels all
  crisp and correct; slow push-in + sparkles read beautifully. The local-render →
  `start_image` technique is now proven and should be the standard for ALL text/number shots.
- **Diner scene** — emotional high point; the golden curve over the skyline through the window.
- **Paper-label captions** suit the brand.
- **Ep02 tease** over the hallway/coins clip closes cleanly.

## Issues, prioritized

| # | Severity | Finding | Fix | Cost |
|---|---|---|---|---|
| 1 | HIGH | **Levers clip (`624dffe9`)**: Chinese characters 起飞点 + garbled "swtm" burned into the on-screen chart; background chart jagged, not a clean takeoff curve | Retake with hard negative ("no text, no letters, no numbers, no Chinese characters, no writing of any kind") + simpler single-curve background | 35 cr |
| 2 | HIGH | **Calculator clip (`633e61e9`)**: garbled repeated "200%" axis labels; background brighter blue than brand navy | Best fix: render the Ledger-style UI frame locally (Pillow, exact text or none) → `start_image`, same as the chart | 35 cr |
| 3 | MED | **Two-tubs clip (`b712a2b9`)**: the gold "leaky" tub is FULL of water while VO says "a big tap with a big drain holds nothing" — visual contradicts the lesson | Retake: "gold tub visibly EMPTY, dry bottom, water passing straight through and gushing out of the huge open drain" | 35 cr |
| 4 | MED | **Caption typo "JCPeeny"** (Whisper mis-transcribed JCPenney) | Cheapest: re-record that VO block saying "at the local department store" (1.2 cr) + free reassembly; or disable burned subs and do proper subs in edit | ~1.2 cr |
| 5 | MED (listen) | Blocks whose audio ran >10s got pitch-safe sped up ~30% (B1 cold open 13.4s, B15 petri 13.6s → 10s windows). May sound rushed | If audible: re-record those takes at ≤22 words | 1.2 cr each |
| 6 | LOW | Style drift: bathtub/tubs scenes on brighter blue vs brand navy; two different "cell" styles (kawaii jar vs realistic glowing blobs); Penny's sticker-outline style varies from flatter scenes | Future episodes: append palette hexes to every prompt + pass an approved on-brand clip as style/video reference | — |
| 7 | LOW | Caption bar overlaps chart x-axis labels ("30 yrs"/"45 yrs") | Bake ~90px extra bottom margin into locally rendered chart frames | free |
| 8 | LOW | No music bed (assembler outputs VO only; Higgsfield's music model is game-pipeline-only) | Add licensed/royalty-free bed in edit (CapCut/DaVinci) before upload | external |

## Assembly learnings (for the pipeline doc)

- `explainer_video` uses **fixed 10s windows** — the final MP4 is exactly 28 × 10s = 4:40.
  15s clips get trimmed to their first 10s; audio over 10s gets sped up. **Rule: write every
  VO block ≤ 22 words and generate every clip at 10s** — 15s clips waste 5s of paid generation.
- Whisper captions mangle brand names — avoid proper nouns in VO where possible, or plan
  proper subtitles in the edit.

## Recommended retake package (fits remaining 85.95 credits)

1. Retake levers clip with text ban (35) — worst defect, sits in the key "two levers" beat
2. Retake calculator via locally rendered start frame (35) — kills the "200%" garble AND
   brand-mismatch in the CTA section
3. Re-record "JCPenney" block as "the local department store" (1.2)
4. Reassemble with subtitles (~1.4)

Total ≈ 72.6 cr, leaving ~13. The two-tubs semantic fix (#3 above) then needs a small top-up,
or rides along with the full-episode batch later.
