# EP01 Kurzgesagt-Style — 5-Minute Draft: Production Log (2026-07-16, v2 2026-07-18)

**FINAL CUT (v2, post-review retakes):** job `af79a9d9-4bde-43d2-b6de-e672e44da1c7`
[Download v2 MP4](https://d8j0ntlcm91z4.cloudfront.net/user_3DJPPcROLSgYWhAZXHUp59j2wui/hf_20260718_131235_af79a9d9-4bde-43d2-b6de-e672e44da1c7.mp4)
v2 changes: levers clip retake `fc8a9165` (text-free, single curve); calculator clip retake
`e2213506` (locally rendered Ledger UI frame `calc_ui.png`, media `bcf931fd`, as start_image);
B3 VO re-recorded without "JCPenney" (`bd1ce99f`, 9.2s) to fix the caption typo.

**v1 draft:** Higgsfield job `07ebef91-f48f-4e6f-b238-4de89ba1436d` (explainer_video, 28 blocks, 1280×720, patrick subtitles)
[Download v1 MP4](https://d8j0ntlcm91z4.cloudfront.net/user_3DJPPcROLSgYWhAZXHUp59j2wui/hf_20260716_215728_07ebef91-f48f-4e6f-b238-4de89ba1436d.mp4)

**Voice:** seed_audio preset **Alistair** (`d9d5c263-f84e-4752-97b5-3750fcc6fd2f`) — swap to ElevenLabs later if preferred.
**Penny reference (reuse on all Penny shots):** image job `cb489660-225e-46b5-84fd-28ff297082af`
**Exact-figures chart:** locally rendered PNG (media `58d86563-96e5-4411-ba4a-e511438a20cd`, script `render_chart.py`) used as Seedance `start_image` — values verified: $300/mo @ 8% → $55K/10y, $177K/20y, $447K/30y, $1.6M/45y, $8M/65y.

## Clips (Seedance 2.0 fast, 720p, 16:9, silent)

| Clip | Job ID | Len |
|---|---|---|
| Street cold open (pilot) | 37de6a64-3d80-4c7a-af76-4c4651733d02 | 15s |
| Gas station / JCPenney montage | fdecf774-aa6e-45d4-9222-75225b1d36ee | 10s |
| Frugality museum | 6767d976-1dc5-41f6-b744-2fa93e3543b3 | 10s |
| Will + coin cluster | fce0d2dd-d413-4c82-a07d-6783621fcd89 | 10s |
| Bathtub + Penny | caabeb58-2ebe-434f-a90c-b35b2ed7e3c5 | 10s |
| Two tubs + Penny tick | b712a2b9-07ae-49a7-92b9-6210710fc8b0 | 10s |
| Vault certificates | b38ef94f-177a-4e8a-bbf1-97dc51daebe7 | 10s |
| Petri dish + Penny (pilot) | 5e07bc1e-5931-42e6-81e2-a2e33b986864 | 15s |
| Lehman cell dies | 7e83b0cd-6f8c-4b6b-95d2-f965d1c0338f | 10s |
| Exact-numbers chart (start_image) | 82d1d035-98af-40ac-b8c8-b5f610fa23d0 | 10s |
| Bar-chart zoom-out (pilot) | 40e8358b-2c78-4af2-be35-62692429f7a0 | 15s |
| Diner + Penny | 557b08ab-93d5-4642-8b61-b24a46700110 | 10s |
| Levers + Penny | 624dffe9-1f98-409b-80e0-71e81d1ffdf7 | 10s |
| Calculator UI | 633e61e9-33e6-4942-b152-f7c6ee3011a6 | 10s |

## Block map (28 blocks, in play order)

| # | Clip | Audio job | VO line (first words) |
|---|---|---|---|
| 1 | street | 7a011aa8 | "Right now, somewhere near you…" |
| 2 | street | 4b5c402e | "In 2014, a Vermont town discovered…" |
| 3 | gas | 6f01ad5f | "Read pumped gas for twenty-five years…" |
| 4 | gas | 952d808d | "He was born poor on a Vermont farm…" |
| 5 | museum | f99e8d44 | "Everything you could see said poor…" |
| 6 | museum | efed6305 | "And everyone believed what they could see…" |
| 7 | will | 70093e39 | "Then his will was read…" |
| 8 | will | 2300f036 | "So how does a janitor build…" |
| 9 | bathtub | d1888b73 | "Part one: the gap…" |
| 10 | bathtub | 0805891e | "All that accumulates is the difference…" |
| 11 | two tubs | 84e76123 | "A big tap with a big drain…" |
| 12 | two tubs | b1e3ba51 | "The safety pins… were policy." |
| 13 | vault | b4be22bc | "Part two: the machine…" |
| 14 | vault | a5e06402 | "The most boring names in America…" |
| 15 | petri | 924f915e | "Every dividend went straight back in…" |
| 16 | petri | 2b5de5db | "Read fed the machine for sixty-five years…" |
| 17 | lehman | 86304567 | "He wasn't immune to mistakes…" |
| 18 | lehman | a50ac36d | "It didn't matter. One cell died…" |
| 19 | chart | 78c7352f | "Now watch the clock do the work…" |
| 20 | chart | 217c4347 | "Thirty years, four hundred forty-seven…" |
| 21 | zoom-out | 36967a61 | "Look at the shape of that…" |
| 22 | diner | d882cec6 | "Now, the honest catch…" |
| 23 | diner | 178205bb | "Money is stored life…" |
| 24 | levers | f507bcce | "You can't control markets…" |
| 25 | levers | bee87657 | "The width of your gap…" |
| 26 | calculator | 16f14994 | "Run your own numbers…" |
| 27 | calculator | 7fe1c023 | "…Wealth Garden app is on the App Store…" |
| 28 | will (reuse) | 75f753b6 | "Next in the series…" |

## Costs

- Pilot (3 clips, VO, penny refs, assembly): ~170 credits
- Draft v1 (11 clips, 30 VO takes, subtitles, assembly): ~379 credits
- Review retakes + v2 reassembly (2 clips, 2 VO takes, subs): ~73 credits
- Remaining balance: **12.85 credits** (enough for VO retakes only — top up before more video)
- Full 10:30 version still needs a top-up (~1,200+ credits at std quality)
- Still outstanding from review: two-tubs semantic retake (gold tub should be empty);
  music bed (external); optional shorter re-reads of B1/B15 if they sound rushed

## Retake recipe

Re-generate any single clip/VO with the same prompt (tweak as needed), then re-run
`explainer_video` with the same block map, substituting the new job ID. Assembly itself
is free (subtitles 0.05/block). Music bed is NOT included — add in edit or upgrade later.
