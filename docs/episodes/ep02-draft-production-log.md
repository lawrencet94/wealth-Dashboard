# EP02 "The $108 Million Lesson" (Penny style): Draft Production Log (2026-10-22)

**Draft cut:** assembled locally on the box: `output/ep02_draft.mp4`, 1280×720, **10:53** (652.8s), 62 VO blocks over 31 paired clips. Not committed (binary); not uploaded anywhere.

**Plan:** two VO lines per 10s clip (approved by Lawrence 22 Oct 2026), hard cap 1,200 credits. See the v2 production map in `ep02-kurzgesagt-seedance-shot-list.md`.

## Pipeline

1. Start frames: drawn with seedream v5 pro (Penny + Player refs); P27–P30 start from a locally rendered textless runway-calculator UI (`ep02-scripts/ep02-render-frames.py`).
2. Clips: Seedance 2.0, 720p, 16:9, silent, 10s, two shots per clip (cut near 5s). P18 reuses ep01 Lehman clip `7e83b0cd` (0 cr).
3. VO: seed_audio preset **Alistair** (`d9d5c263-f84e-4752-97b5-3750fcc6fd2f`), one take per block (62).
4. QC: ASR check of every VO take (`asr.json`, `asr_full.json`); B04 first take `ea3bc99a` was truncated at 14.0s and re-recorded.
5. Overlays: all on-screen text/numbers rendered locally as transparent PNGs (`ep02-render-frames.py`), never by the video model.
6. Assembly (local, free, `ep02-scripts/assemble.py`): split each clip at the detected cut, time-stretch each half to its block window (max(10s, VO+0.3s); VO never sped up), composite overlays, burn in captions (`captions.ass`), concat.

## Reference / image jobs

| Item | Job ID |
|---|---|
| player_v1 | `5f479958-8a00-4d44-83d9-f486a89c2533` |
| player_v2 | `48342909-9902-456c-bdf1-56e32d9e07e3` |
| runway_ui | `4f590584-8ebc-4517-9b44-2f57c9a9c5f0` |
| failed: P03_ip_detected | `29392bf7-8509-4969-8be3-a8fa125bbd99` |

### Start frames

| Clip | Job ID |
|---|---|
| P01 | `d650dbfd-5023-4ab6-ac9f-4a68a5793f40` |
| P02 | `2ad32992-b84d-466b-8885-cc7d6d036626` |
| P03 | `12f5f27c-7ce5-4b12-8e85-be05cfc95fa5` |
| P04 | `1b77257c-5665-415f-91a3-f0a3eef60e2e` |
| P05 | `b6146f85-95d8-4132-9f24-069d9cd814e8` |
| P06 | `916c4fd3-baaf-4014-bc55-219ea92daf19` |
| P07 | `36b56129-727e-442e-9f6e-583369ce4777` |
| P08 | `07810bfe-e170-48ff-9578-f8656a0248cd` |
| P09 | `5cfb5bf9-864c-4897-9068-d9f3894602dd` |
| P10 | `9a4672d1-2bee-4fc0-ba3d-0b549dd5af47` |
| P11 | `38d021b8-eaf6-45a1-af3a-65e1d22f0cc9` |
| P12 | `e5783d30-b981-46c6-aede-f0af82fe0333` |
| P13 | `fcdc6841-0ef3-49dc-a521-316fa12c0138` |
| P14 | `e7cca915-5531-4824-9c7c-98ae4c6c9b7c` |
| P15 | `ab7c3a07-4eba-4782-91fc-86b94b206076` |
| P16 | `b0a6f7f7-0ac5-4399-b9d3-b812d23fde55` |
| P17 | `91f631b5-31ed-4e30-83ca-06e30612a50e` |
| P19 | `db228844-63d7-4b1b-bde5-34dfe6be656c` |
| P20 | `21cc5fa0-8e36-4a78-b978-f3f67779b7b7` |
| P21 | `bbbbfc54-9271-4d0f-af4e-92ffc3ecc3c9` |
| P22 | `6e8ef052-c010-42ee-8a4d-acaf28ebed72` |
| P23 | `6a54c45b-c5ff-46f2-9fff-5cec2a068528` |
| P24 | `3151d969-5bc6-47be-bd73-de27f61db1a4` |
| P25 | `91df2185-ccdf-41bc-ad86-eb5e64560882` |
| P26 | `c46db34a-2575-4c7f-b37d-824f021897bb` |
| P31 | `551c58ca-a33e-4fb2-8dca-bc326665c47e` |

## Clips (Seedance 2.0, 720p, 16:9, silent)

| Clip | Blocks | In cut | Job ID |
|---|---|---|---|
| P01 | B01+B02 | 0:00–0:21 | `abc83bfc-911d-41e6-bf38-ecfd01434da4` |
| P02 | B03+B04 | 0:21–0:44 | `9bfafc14-a600-4fa9-8c41-90465269bfe0` |
| P03 | B05+B06 | 0:44–1:04 | `376c5cf8-5c32-4921-8304-99875f1c8ad8` |
| P04 | B07+B08 | 1:04–1:26 | `3d0ba823-d19a-4bbc-bb56-04fd6bdc7b44` |
| P05 | B09+B10 | 1:26–1:46 | `54965e24-ace7-4c92-bdfc-412b7a46b0d9` |
| P06 | B11+B12 | 1:46–2:12 | `9d974cd0-3462-4dd7-958c-1c7eac8f362e` |
| P07 | B13+B14 | 2:12–2:33 | `0f18bf8f-008d-4a10-acb8-bb5117598f42` |
| P08 | B15+B16 | 2:33–2:55 | `3cbdd5dc-9e7c-4ea7-add0-77ffdc48563a` |
| P09 | B17+B18 | 2:55–3:15 | `53c20884-e381-4c0f-8624-b58ba1c9ea16` |
| P10 | B19+B20 | 3:15–3:35 | `3cc2c5bc-58f5-4212-aaa7-9a5e60a4e90e` |
| P11 | B21+B22 | 3:35–3:56 | `5db227f6-170c-44e1-a543-35370e4050ce` |
| P12 | B23+B24 | 3:56–4:17 | `ae5f7eca-1c7f-4558-b40c-371135569789` |
| P13 | B25+B26 | 4:17–4:37 | `8512367e-b059-419d-82f0-d0d121ac5ae7` |
| P14 | B27+B28 | 4:37–4:58 | `075f367d-ff13-4246-97d7-13f571e3f066` |
| P15 | B29+B30 | 4:58–5:24 | `f5dc2ef6-28e5-441a-a0af-b406968034d2` |
| P16 | B31+B32 | 5:24–5:44 | `5a040648-d5d6-4747-92dc-0e1f8031d42d` |
| P17 | B33+B34 | 5:44–6:04 | `55848b2d-9c36-466e-b2b7-56e8261881c0` |
| P18 | B35+B36 | 6:04–6:25 | `ep01 reuse 7e83b0cd` |
| P19 | B37+B38 | 6:25–6:45 | `3410aba6-2c3b-430c-8376-4d403a5a4155` |
| P20 | B39+B40 | 6:45–7:06 | `3adbcc6f-03d6-416e-a248-e5de3695f5dd` |
| P21 | B41+B42 | 7:06–7:26 | `a4af404e-88a9-4eb2-ac0e-702216036987` |
| P22 | B43+B44 | 7:26–7:46 | `d16c0922-77d7-4af6-99de-80761fa62cd6` |
| P23 | B45+B46 | 7:46–8:08 | `6c89d511-1cc9-42fa-976f-c68e699db9b2` |
| P24 | B47+B48 | 8:08–8:28 | `e374aa47-b096-4358-a271-95e291dc6bf0` |
| P25 | B49+B50 | 8:28–8:48 | `fade9e17-3062-46a4-b45c-4c9b518fab39` |
| P26 | B51+B52 | 8:48–9:10 | `944a4f30-7e9b-4f9e-be0e-2c5c320d375b` |
| P27 | B53+B54 | 9:10–9:32 | `8bd9434a-9b60-4321-9980-f7a54b5f8ea4` |
| P28 | B55+B56 | 9:32–9:52 | `f2d863ef-f709-4fbc-bd4b-2b5f20dc7326` |
| P29 | B57+B58 | 9:52–10:12 | `0a1cedf1-b178-4314-84b9-cb44f78266da` |
| P30 | B59+B60 | 10:12–10:32 | `60798b74-de80-4747-a147-b78a39016fed` |
| P31 | B61+B62 | 10:32–10:52 | `96cbbe9b-8d94-43f4-8636-7d7aea8d7db0` |

Superseded takes: P10_v1 `9198304e-35a2-48e3-83a3-221d8a1c2697`, P27_v1 `6bc38181-82bc-42a2-a18d-8601f396bf2a`

## VO takes (seed_audio, Alistair)

| Block | Job ID |
|---|---|
| B01 | `eb8970ed-d307-47ec-8ee4-82cad38060d6` |
| B02 | `8a82d43c-5553-4e48-86b2-49f86e6631fd` |
| B03 | `ac6dabfe-eabc-45f1-a378-ff2a5b8df4c9` |
| B04 | `64af0373-0dc9-46df-9b88-c128e5cc5b87` |
| B05 | `83f91922-739e-4094-9d8f-f152105feadb` |
| B06 | `7ab56b74-ae54-44d4-889b-6c00f6edf790` |
| B07 | `c2ffbf0f-db1e-4c86-9297-4d1b2f5ef579` |
| B08 | `82ee5d93-7f6f-4487-a8cc-31b669f3fc2d` |
| B09 | `0025afe5-dd50-46e2-b687-87525292b640` |
| B10 | `f96714ec-104b-4071-bd23-57dbeed1ac0b` |
| B11 | `b8344e75-b274-42f9-8c6e-99093d71eb0f` |
| B12 | `445eef7e-499f-43a6-bca4-e63004ce52ad` |
| B13 | `631b3b9b-f109-4e42-861a-1afd26944b23` |
| B14 | `d7a67b64-5572-4bb0-9a94-027a8e0864af` |
| B15 | `231cfc89-bbda-4cd0-9058-1ea661ed4d7e` |
| B16 | `81403876-9334-45eb-846e-647543c15363` |
| B17 | `83c2c81a-c8f4-4793-b806-5f90aa8e618b` |
| B18 | `c008d54f-e0cd-49c2-88ba-27f521e53263` |
| B19 | `3a890e6e-fa6e-4afb-a0ea-0798371fab9d` |
| B20 | `95b4acd4-4ca8-43a3-8bb4-ee9c61fedb87` |
| B21 | `bcc5c6df-8a34-4e36-bb31-19ae36215b57` |
| B22 | `b22f1759-1236-4816-b49f-ee3dfc795fa0` |
| B23 | `00cd1549-3712-496a-8673-1d69ad2c03ce` |
| B24 | `72ed1b8d-09e9-4968-a8f0-76fd6374740b` |
| B25 | `2a0cbfcf-8bf6-467a-9c00-e86ec56521c6` |
| B26 | `2a45459d-b253-4e64-a61a-6efbcd29c249` |
| B27 | `48ae9cf8-0568-4ca1-8a34-a8bf7db92625` |
| B28 | `0cb3b4f9-7c85-4b8e-81c1-1bd93780f2b9` |
| B29 | `68ffbda4-885e-4ddc-a3ac-c8aff4b34884` |
| B30 | `089d1a97-f49d-4bf8-8580-7c76327bb3c3` |
| B31 | `3f8b5943-922e-475d-b43b-d394b51720e5` |
| B32 | `b4ccc66b-cc9e-4120-bdeb-1994fcb73030` |
| B33 | `ca8c8c19-f529-462d-a818-526668e29edd` |
| B34 | `d1cd1de1-fb96-4e3b-91b6-8820aa8cb0c6` |
| B35 | `e134e5f9-a348-42f2-a8ae-ed492de4ba12` |
| B36 | `af49291f-4b94-4b09-a27f-094640759e82` |
| B37 | `14ebb903-cd54-4c3c-9da3-17a0ca9eff97` |
| B38 | `8fe9bc65-4e76-4b45-82a0-40c78994129e` |
| B39 | `4dcca6d2-35ba-4285-9ee0-0ffa0645e8f0` |
| B40 | `35a85e64-ff4b-495f-9476-981c2cf5c58e` |
| B41 | `ee5b3712-6820-4658-b893-0f48f48429a5` |
| B42 | `4f118ffb-8059-42b4-8c42-67d462583f25` |
| B43 | `0ad83c56-92cc-42eb-b4e7-270cdd2bc903` |
| B44 | `ad05ca9b-b7a8-4191-a96c-8186815753c6` |
| B45 | `819fe92d-183d-4de0-b0eb-1b8cb8532bf2` |
| B46 | `8a3df3fe-171a-43e2-a915-a44ca49ef445` |
| B47 | `7f7fd720-5e82-4545-8577-49c55905e84e` |
| B48 | `752acaaa-eaed-4759-8b21-a193def206e5` |
| B49 | `d89e93fd-0ac9-4a93-8079-28d0fee99ef6` |
| B50 | `3a75a5d6-84f0-47f3-9503-c334ae416671` |
| B51 | `d439509f-ec85-44e6-a7da-447662ce8682` |
| B52 | `3fb61565-cf62-4208-8a73-58ed6ed0c47b` |
| B53 | `5f4988ae-a44f-4148-9477-a8ffa099b983` |
| B54 | `20650bd8-1965-4b92-bbb2-b7e70c7dd42b` |
| B55 | `2677522a-0e13-4f3a-b3c5-43405b405cf1` |
| B56 | `8f23f2cb-a589-4997-811a-2e1ee7281f82` |
| B57 | `62c933c1-c809-49fd-91f1-b9460c7a4e9e` |
| B58 | `d324c639-6f8d-4cce-ace9-1b99263073ec` |
| B59 | `d33b06b5-1080-4651-99fb-0ccd463f3131` |
| B60 | `6fc8e2cc-8b9e-4ffc-a85b-4a78d2700775` |
| B61 | `66938003-a54c-414b-b2ce-d9e623bab3fd` |
| B62 | `65ac0698-c505-49b2-b6f8-918c3aa984cf` |

## Credits

- Start: **1,200** · Now: **313.1** · Spent on ep02 draft: **≈886.9** (frames, 30 clips + 2 retakes, 62 VO takes + 1 truncated re-take, refs). Assembly was local and free.
- Remaining 313.1 covers a handful of single-clip retakes (see below), not a full re-render.

## Conservative wording for the 4 flagged facts (as voiced)

1. **Debt-free date** — no date voiced. B46: “He works his way through the bankruptcy, one step at a time, and he comes out the other side.” (Sources only show discharge in March 2012.)
2. **$71M contract timing** — B07: “He's picked sixth overall in the draft. Soon after, he signs a six-year contract worth seventy-one million dollars.” (“Soon after” is true for 1997 or 1999.)
3. **Casino checks** — B23: “And, according to court records, more than a million dollars in bad checks written to casinos.” ⚠ ESPN (2010) reports a settlement of over $900,000; confirm against the court record or re-record as “around a million dollars” (one VO take, ~free to re-assemble).
4. **“Around thirty people”** — B14: “By his own estimate, at the peak, he was supporting around thirty people.” Attributed to him (his mother has been quoted at ~70).

## Retake candidates (lowest assemble scores)

Score = cut-detection/shot-match confidence from `assemble_final.log` (higher is better; P18 is an override reuse). Watch these first.

| Clip | Score | In cut | Narration |
|---|---|---|---|
| P13 | 3.2 | 4:17–4:37 | “Here's what your eyes get wrong. His tap was a firehose. But his drain was nearly as wide as the tap.” / “Sometimes wider. Which means a bigger paycheck doesn't automatically make you richer. Only a bigger gap between in and out does.” |
| P28 | 20.4 | 9:32–9:52 | “Say you spend five thousand a month and have ten thousand saved. Divide one by the other. That's a two-month runway.” / “With thirty thousand saved, it's six months. That's around the minimum many financial planners like to see.” |
| P26 | 37.3 | 8:48–9:10 | “Wealth is whatever you've built by the time the weather changes. The janitor proved a small income can build a fortune.” / “This story proves a fortune can't survive without the same habits. Same math. Opposite direction. Build for winter.” |
| P16 | 39.0 | 5:24–5:44 | “Second: leveraged, meaning built with borrowed money. Third: illiquid. You can't sell a half-finished building in an afternoon.” / “Then 2008 arrives. The housing market doesn't just fall. It freezes. Buyers vanish, and nothing can be sold.” |
| P20 | 47.1 | 6:45–7:06 | “It's a whole working life squeezed into roughly a decade. And then the income doesn't slow down. It simply stops.” / “His stops in 2008, when he's thirty-one. But the mortgages, the lifestyle, the thirty passengers? Those keep going.” |
| P04 | 47.4 | 1:04–1:26 | “He's picked sixth overall in the draft. Soon after, he signs a six-year contract worth seventy-one million dollars.” / “Pause on that. At an age when most people are negotiating their very first salary, he's already a multimillionaire, many times over.” |
| P29 | 48.7 | 9:52–10:12 | “With three hundred thousand invested, it's five years. And suddenly, the weather starts losing its power over you.” / “Notice the trick. Every dollar you stop spending works twice. It grows your savings, and it shrinks the number they're divided by.” |

## Retake recipe

Re-generate a single clip with the same prompt and start frame from the v2 map (tweak as needed), drop the MP4 into `clips/`, and re-run `assemble.py`; assembly is local and free. Music bed not included.
