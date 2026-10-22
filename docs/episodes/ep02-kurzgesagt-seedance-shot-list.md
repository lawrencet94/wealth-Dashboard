# EP #002 (Kurzgesagt-Style) — Seedance 2.0 Generation Pack

Companion to `ep02-the-108-million-dollar-lesson-kurzgesagt-style.md`. Modelled on
`ep01-kurzgesagt-seedance-shot-list.md`, with the pipeline rules from `ep01-draft-review.md`
and `ep01-draft-production-log.md` built in from the start.

**Status: planning only.** Nothing in this file has been generated and no credits have been spent.

## Pipeline rules (learned on the Ep01 draft)

- **One VO block = one 10s clip.** The `explainer_video` assembler uses fixed 10s windows, so
  every clip is generated at **10s** (15s clips waste 5s of paid generation) and every VO block is
  **≤ 22 words** so audio never gets sped up. This episode: **62 blocks / 62 clips**, longest
  block 22 words, 1255 words total.
- **Text and numbers are never left to Seedance.** Every frame that must show words or figures
  (🖍 below, 18 frames) is rendered locally with Pillow (exact text, brand navy, ~90px
  extra bottom margin so captions don't cover axis labels) and passed as `start_image` — the
  technique proven on the Ep01 exact-numbers chart and calculator retake. Suggested script:
  `ep02-render-frames.py`, modelled on `ep01-render-chart.py` / `ep01-render-calc-ui.py`.
- **Every other clip carries a hard text ban** (negative block below) — the Ep01 levers clip came
  back with Chinese characters and garbled labels without one.
- **Palette hexes on every prompt** to stop the Ep01 drift toward brighter blue.
- **Penny reference** (image job `cb489660-225e-46b5-84fd-28ff297082af`) as image input on every
  shot that names PROFESSOR PENNY.
- **Captions:** proper nouns are kept out of the VO where Whisper would garble them; the few that
  remain (Antoine Walker, Chicago, NBA, Chapter 7, Wealth Garden, App Store) need a subtitle check,
  or switch off burned-in subs and subtitle in the edit.
- Seedance 2.0, **16:9**, 720p fast for the draft, `generate_audio: false` on every job.
  VO: Higgsfield seed_audio preset **Alistair** (`d9d5c263-f84e-4752-97b5-3750fcc6fd2f`).

## Global style block (prepend to EVERY prompt)

> Flat 2D vector animation in the style of a premium educational explainer, bold saturated
> colors on a deep navy background (#0a0f1e), accent palette gold (#f5c542), mint green
> (#5fd3a5), warm red (#e8584f) and cream (#f4ecd8), simple geometric characters with thick clean
> outlines, soft rounded shapes, smooth eased motion, subtle floating particles, cinematic glow on
> key elements, no photorealism.

## Negative block (append to EVERY clip not marked 🖍)

> no text, no letters, no numbers, no Chinese characters, no logos, no watermarks, no writing of
> any kind, no real people's likenesses, no team jerseys or league logos

(On 🖍 clips, the start image carries the exact text; append instead: "keep all text from the
start image exactly as it is, do not add or alter any text".)

## Character reference blocks

**PROFESSOR PENNY (use app reference image as image input on every Penny shot):**
> A cute white lop-eared bunny professor named Penny: long droopy ears, big round brown eyes
> behind round gold-rimmed glasses, pink blush cheeks, cream-colored suit with mint-green shirt,
> mint tie and mint cuffs, small and chibi-proportioned, gentle smile. She never speaks; she
> gestures, reacts, points.

**THE PLAYER (Antoine Walker character — generic, not a likeness):**
> A tall, lanky basketball player in simple flat vector style: plain cream-and-navy jersey with
> no number or logo, short dark hair, warm expressive face, confident posture. Shown with dignity
> and warmth in every scene, never mocked. In later scenes he is older, wearing a simple navy
> blazer.

**THE JANITOR (callback from Ep01, B51 only):**
> A small elderly man in flat vector style: gray flat cap, gray threadbare coat held with safety
> pins, kind wrinkled face. Warm, dignified.

## Block map and clip prompts

Prompt column = what follows the style + character blocks. Time = position in the assembled cut.

| # | Time | Chapter | VO (exact) | Words | Clip prompt | Flag |
|---|---|---|---|---|---|---|
| B01 | 0:00 | Cold open | Imagine earning one hundred and eight million dollars. Not winning it. Earning it, season after season, doing the thing you love most. | 22 | A packed flat-vector basketball arena at night, confetti drifting down; on the court a tall THE PLAYER in a plain jersey raises both arms; beside him a stack of gold coins grows taller with every beat of the crowd. Slow push-in. |  |
| B02 | 0:10 | Cold open | Now imagine that, about two years after your final paycheck, you file for bankruptcy. This really happened, to a real person. | 21 | The arena lights switch off one bank at a time; the gold coin stack beside the empty court drains away through a hole in the floor until only a few coins remain. THE PLAYER stands alone at centre court, small, looking at it. |  |
| B03 | 0:20 | Cold open | Your brain says that's impossible. A hundred million dollars can't just leak away. But it can, and the reason is simple math. | 22 | A cute cartoon brain with stick arms shakes its head in disbelief at a giant gold coin pile; the pile quietly leaks coins from a crack at its base, a thin golden stream trickling off-screen. PROFESSOR PENNY lifts her glasses and peers at the crack. |  |
| B04 | 0:30 | Cold open | Last time, a janitor quietly turned small paychecks into eight million. Today, the exact same machine runs in reverse. Let's watch. | 21 | The golden exponential curve from episode one sweeps across the navy screen, then reverses direction and dives downward like a comet falling; PROFESSOR PENNY hops in, straightens her glasses, and taps the air with a wooden pointer. Leave centre frame clear for the title overlay MONEY STORIES EP 002. | 🖍 DRAWN START IMAGE |
| B05 | 0:40 | The Life | This is Antoine Walker. He grows up on Chicago's South Side, and from early on, basketball looks like his way forward. | 21 | Dusk on a flat-vector city playground court, chain-link fence, skyline silhouette behind; a lanky teenage THE PLAYER practises jump shots alone under a single streetlight. Leave lower third clear for a name card. | 🖍 DRAWN START IMAGE |
| B06 | 0:50 | The Life | And he takes it at full speed. At nineteen, he wins a college national championship, then turns professional that same year. | 21 | A bright college arena in royal blue and white; THE PLAYER as a young college player cuts down a net while teammates celebrate; then a quick wipe to a draft-night stage with a handshake under spotlights. No logos, no lettering. |  |
| B07 | 1:00 | The Life | He's picked sixth overall in the draft. Soon after, he signs a six-year contract worth seventy-one million dollars. | 18 | A flat-vector contract on a desk; a fountain pen signs it with a flourish and the paper glows gold; coins pour out of the signature line and stack up into a tower. THE PLAYER watches, wide-eyed. Leave space for a $71M overlay. | 🖍 DRAWN START IMAGE |
| B08 | 1:10 | The Life | Pause on that. At an age when most people are negotiating their very first salary, he's already a multimillionaire, many times over. | 22 | Split screen: on the left a young office worker at a small desk nervously reading a modest offer letter; on the right a young THE PLAYER standing on top of a tall golden coin tower that keeps growing. PROFESSOR PENNY stands between them, pointing back and forth, ears perked. |  |
| B09 | 1:20 | The Life | A three-time All-Star, and later an NBA champion. Over twelve seasons, he has said, he earned about one hundred and eight million. | 22 | A glowing counter-style golden number tower rises season by season, twelve stacked tiers lighting up one after another, small star icons popping on three of them and a ring icon on one near the top. Leave space for a $108M overlay. | 🖍 DRAWN START IMAGE |
| B10 | 1:30 | The Life | Years later, he put it in one sentence: the money came so fast without the education. Hold on to that line. | 21 | A torrent of gold coins pours through an open doorway into a room; in the corner sits a small, dusty, unopened book on a stool that nobody notices. PROFESSOR PENNY picks up the book, blows the dust off, and holds it up meaningfully. |  |
| B11 | 1:40 | The Life | So he lives like the money will never stop. He has said he modeled his lifestyle on the music moguls he admired. | 22 | THE PLAYER in a sharp suit strides down a glowing city boulevard lined with oversized billboards of generic silhouetted music stars in sunglasses; golden spotlights sweep the sky. Generic silhouettes only, no recognisable faces, no text. |  |
| B12 | 1:50 | The Life | Cars. Jewelry. Tailored suits. Big nights out. Your eyes see a celebration. The math sees a drain opening wider and wider. | 21 | A cheerful museum-style display of pedestals: a shiny sports car, a tray of sparkling jewelry, a tailored suit on a mannequin, a long dinner table set for twenty; beneath the floor a drain grate visibly widens with each new item. Pedestal labels left blank. |  |
| B13 | 2:00 | The Life | Here's the part people skip. Much of that money went to others. One of his first buys, he's said: his mother's house. | 22 | Warm, tender moment: THE PLAYER hands a house key to his mother on the porch of a lovely family home; she covers her mouth with joy; soft golden afternoon light, falling leaves. Respectful, emotional. |  |
| B14 | 2:10 | The Life | By his own estimate, at the peak, he was supporting around thirty people. One paycheck. Thirty passengers. Every single month. | 20 | A single golden paycheck drawn as a small bus driving along a road; thirty simple friendly flat-vector passengers climb aboard one by one until the bus is crammed and its wheels strain. PROFESSOR PENNY counts them on her fingers, ears rising in surprise. |  |
| B15 | 2:20 | The Life | His last NBA game comes in 2008. Then, in May 2010, he files for Chapter 7 bankruptcy. That's about two years later. | 22 | A calendar on a wall flips its pages quickly from one year to the next; the court lights dim; a flat-vector courthouse with columns appears and a single document slides across a wooden bench. Leave page area clear for the dates 2008 and 2010. | 🖍 DRAWN START IMAGE |
| B16 | 2:30 | The Life | The court papers list twelve point seven million dollars in debts, against just four point three million in assets. | 19 | A balance scale on a navy background: the left pan, heavy and red, sinks low; the right pan, light and gold, rises high. Slow push-in, gentle sway. Pan labels left clean for $12.7M DEBTS and $4.3M ASSETS overlays. | 🖍 DRAWN START IMAGE |
| B17 | 2:40 | The Life | Even his championship ring is sold to help repay his creditors. So how does this happen? Let's take it apart. | 20 | A small glowing championship ring sits alone on a velvet cushion under a spotlight, then is gently lifted out of frame; PROFESSOR PENNY looks at the empty cushion, then rolls up her sleeves and pulls out a screwdriver, ready to take a machine apart. |  |
| B18 | 2:50 | The Burn | Remember the bathtub from last time? Income pours in through the tap. Spending drains out the bottom. | 17 | A large white bathtub on a navy background; water pours in from a golden tap and drains out a hole at the bottom; the water level barely moves; PROFESSOR PENNY stands beside it holding a clipboard. Tap and drain visually distinct for INCOME/SPENDING overlays. |  |
| B19 | 3:00 | The Burn | Wealth is only what stays in the tub. So let's measure his tub, starting with the number almost nobody mentions. | 20 | PROFESSOR PENNY lowers a giant measuring tape into a gold-plated bathtub, peering over the rim through her glasses; the camera tilts down to reveal that the tub is much shallower than it looked from outside. |  |
| B20 | 3:10 | The Burn | Taxes. Of the one hundred and eight million, he has said fifty-five million went straight to the taxman. | 18 | A tall golden bar splits cleanly in two; the left half slides away into a large grey government building with columns; the remaining half stays glowing. Bars left clean for $108M EARNED and $55.2M TAXES overlays. | 🖍 DRAWN START IMAGE |
| B21 | 3:20 | The Burn | That leaves something closer to fifty-three million. Still enormous. But the real number is only about half the headline. | 19 | The remaining golden bar sits alone beside the faint ghost outline of the original full-height bar; PROFESSOR PENNY stands on tiptoe holding a ruler against both, eyebrows raised. Leave space for a ~$53M overlay. | 🖍 DRAWN START IMAGE |
| B22 | 3:30 | The Burn | Now the drain. Cars that lose value the day you drive them home. Jewelry. Gambling. All of it flowing out. | 20 | Bathtub cross-section: from the drain at the bottom, a parade of tiny objects flushes out into a pipe: a sports car shrinking as it goes, sparkling jewelry, playing cards and casino chips. Water level visibly dropping. |  |
| B23 | 3:40 | The Burn | And, according to court records, more than a million dollars in bad checks written to casinos. That's the drain at full speed. | 22 | A flurry of blank paper checks flutters out of a pipe and blows across a neon-lit casino floor drawn in flat vector; the checks bounce off the tables like rubber and fly away. Checks blank, no writing, no numbers. |  |
| B24 | 3:50 | The Burn | Plus thirty people drawing on one income. Those costs don't happen once. They repeat. Every month. Every year. | 18 | The bathtub again: thirty small taps are attached to the side of the tub, each one pulling a steady stream of water out; a calendar on the wall flips page after page while the streams keep flowing. PROFESSOR PENNY tries to plug two with her paws. |  |
| B25 | 4:00 | The Burn | Here's what your eyes get wrong. His tap was a firehose. But his drain was nearly as wide as the tap. | 21 | Split screen: on the left a gold-plated bathtub that is visibly EMPTY with a dry bottom, a firehose tap blasting water straight through and gushing out of a huge open drain; on the right a modest tub with a small tap and a sealed drain, slowly filling. PROFESSOR PENNY points at the empty gold tub. |  |
| B26 | 4:10 | The Burn | Sometimes wider. Which means a bigger paycheck doesn't automatically make you richer. Only a bigger gap between in and out does. | 21 | Clean navy frame with a giant friendly gold stamp slamming down in the centre, a small burst of sparkles on impact; PROFESSOR PENNY gives an approving nod. Start image carries the text A BIGGER PAYCHECK IS NOT A BIGGER GAP. | 🖍 DRAWN START IMAGE |
| B27 | 4:20 | The Empire | Leak number two is the one that should unsettle you most, because on paper, he did the responsible thing. He invested. | 21 | PROFESSOR PENNY sits at a desk reviewing a neat report card; she ticks a box with a green pen and smiles; behind her, a small model city glows warmly on a shelf. |  |
| B28 | 4:30 | The Empire | He has said he put around eighteen million dollars into real estate, much of it back home in his city, Chicago. | 21 | An architect's model of rows of city houses and half-built apartment blocks on a table, lit warm amber; paper deeds float down and stack themselves around it. Leave space for an $18M overlay. | 🖍 DRAWN START IMAGE |
| B29 | 4:40 | The Empire | Properties. Development projects. Loans. And, as he has explained, he signed as the personal guarantor. His own name on the debt. | 21 | A long scroll of loan papers unrolls across the architect's model; THE PLAYER signs the bottom of each page with a pen that leaves a glowing gold signature; chains of gold links quietly connect each signature to his wrist. |  |
| B30 | 4:50 | The Empire | Let's name the three risks stacked on top of each other here. First: concentrated. One kind of asset, in one city. | 21 | Three translucent coloured blocks drop one by one onto the model city and stack into a wobbly tower; the first block lands, glowing orange. PROFESSOR PENNY points at it with her wooden pointer. Blocks left clean for labels. |  |
| B31 | 5:00 | The Empire | Second: leveraged, meaning built with borrowed money. Third: illiquid. You can't sell a half-finished building in an afternoon. | 18 | The second and third blocks land on the wobbling tower, glowing red and purple; the tower sways precariously; PROFESSOR PENNY holds her ears down nervously. Blocks left clean for labels. |  |
| B32 | 5:10 | The Empire | Then 2008 arrives. The housing market doesn't just fall. It freezes. Buyers vanish, and nothing can be sold. | 18 | A red shadow line sweeps across the architect's model like a cold front; frost spreads over the little houses and cranes; tiny for-sale signs freeze solid, ice crystals forming. Year area left clean for a 2008 overlay. | 🖍 DRAWN START IMAGE |
| B33 | 5:20 | The Empire | But the loans still have to be repaid. In his words, the banks wanted their money back. They didn't want empty lots. | 22 | Flat-vector bank buildings with columns extend long mechanical arms toward the frozen model city, palms open, waiting; the half-built blocks stay frozen and empty; gentle, not menacing. |  |
| B34 | 5:30 | The Empire | The eighteen-million-dollar bet stops being an asset and becomes an anchor, dragging everything else down with it. | 17 | An enormous gold anchor drops from the frozen model city into deep navy water, chain rattling; it pulls down with it a sports car, jewelry and the coin stack, all sinking slowly in a trail of bubbles. |  |
| B35 | 5:40 | The Empire | Remember the janitor? He owned small pieces of ninety-five companies. When one of them went to zero, the rest kept going. | 21 | A petri dish of ninety-five softly glowing cells; one cell flickers grey and pops; the other cells keep pulsing and dividing warmly; camera pulls back to show the dish barely changed. | ♻ REUSE Ep01 `7e83b0cd` (0 cr) |
| B36 | 5:50 | The Empire | This was one big piece of one thing. Diversification isn't decoration. It's how you make every mistake survivable. | 18 | Split screen: on the left a single huge glass sphere cracks and shatters; on the right a mosaic of ninety-five small tiles where one tile falls out and the picture stays whole. PROFESSOR PENNY stands beside the mosaic, nodding. |  |
| B37 | 6:00 | The Cliff | Leak number three is the one that applies to you, even if your paycheck has never had six zeros on it. | 21 | PROFESSOR PENNY turns to face the camera and points straight at the viewer with her wooden pointer; behind her, an ordinary flat-vector office worker holds a modest paycheck. Warm, inviting. |  |
| B38 | 6:10 | The Cliff | Most careers taper. You earn more, then maybe a little less, then you retire. A pro athlete's career doesn't taper. | 20 | A gentle golden hill-shaped income line draws itself slowly across a long timeline, rising and gently easing down; beside it, a second line shoots up into a tall narrow tower. Clean lines, no text, no numbers. |  |
| B39 | 6:20 | The Cliff | It's a whole working life squeezed into roughly a decade. And then the income doesn't slow down. It simply stops. | 20 | The tall narrow income tower rises steeply, holds at the top, then ends at a sheer cliff edge; a little cartoon cart rolling along the top of the line reaches the edge and stops, wheels spinning over empty space. |  |
| B40 | 6:30 | The Cliff | His stops in 2008, when he's thirty-one. But the mortgages, the lifestyle, the thirty passengers? Those keep going. | 18 | At the cliff edge the gold income line ends abruptly, but a red spending line keeps running forward past the edge into thin air, carrying the little bus of thirty passengers and a row of houses with it. THE PLAYER stands at the edge, watching. |  |
| B41 | 6:40 | The Cliff | From his final game to his bankruptcy filing takes roughly two years. And that gap in time is the real measurement. | 21 | A large brass pocket watch floats over the cliff; its hands spin quickly forward; behind it, the red spending line slopes steadily down toward a dark floor. PROFESSOR PENNY holds a stopwatch, timing it. |  |
| B42 | 6:50 | The Cliff | Not what he earned. How long the life he'd built could keep running with no new income coming in. | 19 | A small flat-vector airplane taxis along a runway that is visibly getting shorter as tiles fall away from its far end; the plane keeps rolling; the camera follows from above. No text. |  |
| B43 | 7:00 | The Cliff | Two years. On a career that paid him over a hundred million dollars. That's how fast the drain wins without the tap. | 22 | The runway ends; the little airplane stops right at the edge. A drawn panel with a big number slides in beside it. Start image carries the text RUNWAY: ~24 MONTHS. | 🖍 DRAWN START IMAGE |
| B44 | 7:10 | The Cliff | Which leaves you with one uncomfortable, simple question. If your paycheck stopped tomorrow, how many months could you last? | 19 | First-person view: your own hands hold a modest paycheck that slowly fades to transparent; on a desk in front of you a blank runway gauge waits to fill. PROFESSOR PENNY looks at you kindly over her glasses. Slow push-in. |  |
| B45 | 7:20 | The Comeback | That could be the end of the story. But it isn't. And honestly, the next part is the one that matters most. | 22 | Mood lifts: dawn breaks over the flat-vector city skyline; warm orange light spills across the frame; PROFESSOR PENNY slowly smiles and puts her glasses back on. |  |
| B46 | 7:30 | The Comeback | He doesn't disappear. He works his way through the bankruptcy, one step at a time, and he comes out the other side. | 22 | THE PLAYER, older now, walks steadily up a long winding path toward a sunlit hilltop; each step lights up gold beneath his feet; the dark valley behind him fades away. |  |
| B47 | 7:40 | The Comeback | Then he does something rarer than earning a hundred million dollars. He turns the loss itself into a lesson. | 19 | THE PLAYER picks up the dusty book from earlier, opens it, and golden light pours out of its pages, forming a glowing rising path into the sky. |  |
| B48 | 7:50 | The Comeback | Today he works in financial education, telling this exact story to young athletes, so that their numbers end differently. | 19 | A bright flat-vector classroom; an older THE PLAYER stands at the front beside a simple whiteboard drawing of a bathtub with a tap and drain; a row of young athletes in tracksuits lean forward, listening. Whiteboard has no readable writing. |  |
| B49 | 8:00 | The Comeback | He paid a fortune for this lesson. Now he shares it openly, with anyone willing to listen, so others don't pay it. | 22 | THE PLAYER hands the glowing open book to a young athlete, who passes a page to the next, and the next, a chain of golden light spreading down a long line of people. PROFESSOR PENNY applauds quietly. |  |
| B50 | 8:10 | The Comeback | So what's the takeaway? Income is not wealth. Income is weather. It can stay sunny for years, then turn. | 19 | A flat-vector landscape cycles through seasons in time-lapse: bright summer sun, golden autumn, then the first snow drifting down; a little house sits in the middle of it all. |  |
| B51 | 8:20 | The Comeback | Wealth is whatever you've built by the time the weather changes. The janitor proved a small income can build a fortune. | 21 | Snow falls on two houses: one a tiny cabin with a warm glowing window and a big stack of firewood, one a grand mansion with dark windows and an empty woodshed. The janitor in his grey cap waves from the cabin door. |  |
| B52 | 8:30 | The Comeback | This story proves a fortune can't survive without the same habits. Same math. Opposite direction. Build for winter. | 18 | Clean navy frame; a big friendly gold stamp slams down in the centre with a burst of sparkles; snowflakes drift; PROFESSOR PENNY wraps a mint scarf around her neck and nods. Start image carries the text INCOME IS A SEASON. BUILD FOR WINTER. | 🖍 DRAWN START IMAGE |
| B53 | 8:40 | Your Runway | So let's stop talking about his numbers, and run yours. There's a name for what we've been measuring. It's called runway. | 21 | The animated world swooshes and dissolves into clean mint and gold UI particles that fly toward camera and reassemble into a stylized navy personal-finance calculator interface; PROFESSOR PENNY hops in at the bottom corner. |  |
| B54 | 8:50 | Your Runway | Runway is simple. What you have saved, divided by what you spend each month. The same equation works at every income. | 21 | Stylized navy fintech calculator interface: two clean input panels on the left and a large horizontal bar on the right that fills from left to right with gold; subtle grid, mint accents. Start image carries the formula RUNWAY = SAVINGS ÷ MONTHLY SPENDING. | 🖍 DRAWN START IMAGE |
| B55 | 9:00 | Your Runway | Say you spend five thousand a month and have ten thousand saved. Divide one by the other. That's a two-month runway. | 21 | Same calculator interface; the runway bar fills only a short way and stops well before a marker line; PROFESSOR PENNY winces. Start image carries exact figures: SAVED $10,000 · SPEND $5,000/MO · RUNWAY 2 MONTHS, with ~90px bottom margin for captions. | 🖍 DRAWN START IMAGE |
| B56 | 9:10 | Your Runway | With thirty thousand saved, it's six months. That's around the minimum many financial planners like to see. | 17 | Same calculator interface; the gold runway bar extends and lands exactly on the six-month marker line, which glows mint; PROFESSOR PENNY gives a thumbs up. Start image carries exact figures: SAVED $30,000 · SPEND $5,000/MO · RUNWAY 6 MONTHS. | 🖍 DRAWN START IMAGE |
| B57 | 9:20 | Your Runway | With three hundred thousand invested, it's five years. And suddenly, the weather starts losing its power over you. | 18 | Same calculator interface; the camera has to zoom out as the gold runway bar keeps extending far past the six-month marker; snowflakes outside the window stop mattering. Start image carries exact figures: SAVED $300,000 · SPEND $5,000/MO · RUNWAY 60 MONTHS. | 🖍 DRAWN START IMAGE |
| B58 | 9:30 | Your Runway | Notice the trick. Every dollar you stop spending works twice. It grows your savings, and it shrinks the number they're divided by. | 22 | Two friendly sliders on the navy calculator interface: as one slider moves left, a savings stack grows taller AND a spending block shrinks at the same time, and the runway bar shoots longer; PROFESSOR PENNY points at both with her pointer. Slider labels blank. |  |
| B59 | 9:40 | Your Runway | The free runway calculator is linked below. Put in your own real numbers, and find out how many months you'd last. | 21 | Same stylized navy calculator interface with blank input fields gently pulsing, inviting input; a small first-person hand reaches in and taps the screen; the runway bar begins to fill. Start image is the locally rendered Ledger runway UI frame. | 🖍 DRAWN START IMAGE |
| B60 | 9:50 | Your Runway | And to watch your runway grow, tracked across every account, our Wealth Garden app is on the App Store, also linked below. | 22 | PROFESSOR PENNY hops across the frame and stands proudly beside a blank rounded app-badge rectangle, gesturing to it; a small garden of golden plants grows around her feet. Leave right third clear for the app badge overlay. |  |
| B61 | 10:00 | Your Runway | None of this is financial advice. It's arithmetic, and one man's very public story, told in his own words. | 19 | Calm wide shot: the flat-vector city skyline at dusk with the runway bar glowing softly along the horizon like a road; THE PLAYER, older, walks along it calmly in the distance. |  |
| B62 | 10:10 | Your Runway | Next time: no athletes, no millionaires. Just your paycheck, and where it actually goes. Every fortune leaves a paper trail. | 20 | PROFESSOR PENNY waves goodbye and hops along a trail of glowing paper footprints that leads to a blank card; the frame settles. Leave right third clear for subscribe, EP 3 thumbnail, Ledger link and Wealth Garden badge overlays. |  |

## v2 production map: two lines per clip (31 clips)

Approved by Lawrence on 22 Oct 2026 ("Go with two lines per clip within the 1,200 credits"). This supersedes the
one-clip-per-block plan above for production. Each 10s Seedance clip carries two VO blocks: shot 1 (0–5s) for the first block and
shot 2 (5–10s) for the second, with a cut near 5s. The assembler splits each clip at the detected cut and time-stretches each half to
its block window (max(10s, VO + 0.3s)). Overlays and captions are added locally.

| Clip | Blocks | Start | Shot 1 (first block) | Shot 2 (second block) | Job ID |
|---|---|---|---|---|---|
| P01 | B01+B02 | drawn start frame (seedream v5 pro) | A packed flat-vector basketball arena at night, confetti drifting down; THE PLAYER raises both arms at centre court as a stack of gold coins beside him grows taller with every cheer. Slow push-in. | The arena lights switch off one bank at a time; the gold coin stack drains away through a hole in the floor until only a few coins remain; THE PLAYER stands alone at centre court, small, looking down at it. | `abc83bfc-911d-41e6-bf38-ecfd01434da4` |
| P02 | B03+B04 | drawn start frame (seedream v5 pro) | A cute cartoon brain with little stick arms shakes its head in disbelief at a giant gold coin pile that quietly leaks coins from a crack at its base, a thin golden stream trickling away; PROFESSOR PENNY lifts her glasses and peers at the crack. | A glowing golden exponential curve sweeps up across the navy sky, then reverses and dives downward like a falling comet; PROFESSOR PENNY hops in and taps the air with a wooden pointer. The centre of the frame stays clear and empty. | `9bfafc14-a600-4fa9-8c41-90465269bfe0` |
| P03 | B05+B06 | drawn start frame (seedream v5 pro) | Dusk on a city playground basketball court with a chain-link fence and a skyline silhouette; a lanky teenage THE PLAYER practises jump shots alone under a single streetlight. Lower third of the frame kept clear. | Quick wipe to a warm, golden cartoon arena; young THE PLAYER lifts a shiny plain gold trophy cup over his head as confetti falls and generic teammates in plain cream shirts cheer; then a wipe to him shaking hands with a smiling man in a suit on a simple spotlit stage. | `376c5cf8-5c32-4921-8304-99875f1c8ad8` |
| P04 | B07+B08 | drawn start frame (seedream v5 pro) | A contract on a wooden desk; a fountain pen signs it with a flourish, the paper glows gold and coins pour out of the signature line, stacking into a tower; young THE PLAYER watches wide-eyed. Upper area kept clear. | Split screen: left, a young office worker at a small desk nervously reading a modest letter; right, young THE PLAYER standing on top of a tall golden coin tower that keeps growing; PROFESSOR PENNY stands between them pointing back and forth, ears perked. | `3d0ba823-d19a-4bbc-bb56-04fd6bdc7b44` |
| P05 | B09+B10 | drawn start frame (seedream v5 pro) | A golden tower rises tier by tier, twelve glowing stacked tiers lighting up one after another, small star icons popping on three tiers and a ring icon near the top. Upper left area kept clear. | A torrent of gold coins pours through an open doorway into a room; in the corner a small dusty unopened book sits on a stool; PROFESSOR PENNY picks up the book, blows the dust off and holds it up meaningfully. | `54965e24-ace7-4c92-bdfc-412b7a46b0d9` |
| P06 | B11+B12 | drawn start frame (seedream v5 pro) | THE PLAYER in a sharp suit strides down a glowing night boulevard lined with oversized billboards showing generic dark silhouettes of music stars in sunglasses; golden spotlights sweep the sky. Billboards show only silhouettes. | A cheerful museum display of pedestals: a shiny sports car, a tray of sparkling jewelry, a tailored suit on a mannequin, a long dinner table; beneath the floor a drain grate visibly widens with each new item. | `9d974cd0-3462-4dd7-958c-1c7eac8f362e` |
| P07 | B13+B14 | drawn start frame (seedream v5 pro) | Warm tender moment: THE PLAYER hands a house key to his mother on the porch of a lovely family home; she covers her mouth with joy; soft golden afternoon light, falling leaves. | A single golden paycheck drawn as a small bus driving along a road; many simple friendly passengers climb aboard one by one until it is crammed and the wheels strain; PROFESSOR PENNY counts on her fingers, ears rising in surprise. | `0f18bf8f-008d-4a10-acb8-bb5117598f42` |
| P08 | B15+B16 | drawn start frame (seedream v5 pro) | A wall calendar flips its pages quickly; the basketball court lights dim; a courthouse with columns appears and a single document slides across a wooden bench. Upper area kept clear. | A large balance scale on a navy background: the left pan, heavy and red, sinks low; the right pan, light and gold, rises high; gentle sway, slow push-in. Upper area kept clear. | `3cbdd5dc-9e7c-4ea7-add0-77ffdc48563a` |
| P09 | B17+B18 | drawn start frame (seedream v5 pro) | A small glowing championship ring on a velvet cushion under a spotlight is gently lifted out of frame; PROFESSOR PENNY looks at the empty cushion, then rolls up her sleeves and pulls out a screwdriver. | A large white bathtub on a navy background; water pours in from a golden tap and drains out a hole at the bottom; the water level barely moves; PROFESSOR PENNY stands beside it holding a clipboard. | `53c20884-e381-4c0f-8624-b58ba1c9ea16` |
| P10 | B19+B20 | drawn start frame (seedream v5 pro) | PROFESSOR PENNY lowers a giant measuring tape into a gold-plated bathtub, peering over the rim; the camera tilts down to reveal the tub is much shallower than it looked. | A single tall glowing golden bar stands in the centre and splits cleanly down the middle; the left half slides away to the left and drops into the coin slot of a simple plain grey cartoon vault box with a flat lid (generic, no columns, no dome, not resembling any real building); the right half stays in place and keeps glowing. Upper area kept clear. | `3cc2c5bc-58f5-4212-aaa7-9a5e60a4e90e` |
| P11 | B21+B22 | drawn start frame (seedream v5 pro) | The remaining golden bar stands alone beside the faint ghost outline of the original full-height bar; PROFESSOR PENNY stands on tiptoe holding a ruler against both, eyebrows raised. Upper right area kept clear. | Bathtub cross-section: out of the drain a parade of tiny objects flushes into a pipe: a sports car shrinking as it goes, sparkling jewelry, playing cards and casino chips; the water level visibly drops. | `5db227f6-170c-44e1-a543-35370e4050ce` |
| P12 | B23+B24 | drawn start frame (seedream v5 pro) | A flurry of blank paper checks flutters out of a pipe and blows across a neon-lit casino floor; the blank checks bounce off the tables like rubber and fly away. | The bathtub again: many small taps attached to its sides each pull a steady stream of water out; a wall calendar flips page after page; PROFESSOR PENNY tries to plug two of them with her paws. | `ae5f7eca-1c7f-4558-b40c-371135569789` |
| P13 | B25+B26 | drawn start frame (seedream v5 pro) | Split screen: left, a gold-plated bathtub that is visibly EMPTY with a dry bottom, a firehose tap blasting water straight through and gushing out of a huge open drain; right, a modest tub with a small tap and a sealed drain, slowly filling; PROFESSOR PENNY points at the empty gold tub. | Clean navy frame; a giant friendly round gold stamp slams down in the centre with a small burst of sparkles; PROFESSOR PENNY gives an approving nod. The stamp face is plain and blank. | `8512367e-b059-419d-82f0-d0d121ac5ae7` |
| P14 | B27+B28 | drawn start frame (seedream v5 pro) | PROFESSOR PENNY sits at a desk reviewing a neat report card, ticks a box with a green pen and smiles; behind her a small model city glows warmly on a shelf. | An architect's model of rows of city houses and half-built apartment blocks on a table, lit warm amber; paper deeds float down and stack themselves around it. Upper area kept clear. | `075f367d-ff13-4246-97d7-13f571e3f066` |
| P15 | B29+B30 | drawn start frame (seedream v5 pro) | A long scroll of loan papers unrolls across the architect's model city; THE PLAYER in a suit signs each page with a pen that leaves a glowing gold squiggle; thin chains of gold links connect each signature to his wrist. | A translucent glowing orange block drops onto the model city and lands with a bounce, the first of a tower; PROFESSOR PENNY points at it with her wooden pointer. | `f5dc2ef6-28e5-441a-a0af-b406968034d2` |
| P16 | B31+B32 | drawn start frame (seedream v5 pro) | Two more translucent blocks, red and purple, land on top of the orange block, forming a wobbly tower that sways precariously; PROFESSOR PENNY holds her ears down nervously. | A cold red shadow line sweeps across the architect's model like a cold front; frost spreads over the little houses and cranes; ice crystals form. Upper area kept clear. | `5a040648-d5d6-4747-92dc-0e1f8031d42d` |
| P17 | B33+B34 | drawn start frame (seedream v5 pro) | Friendly bank buildings with columns extend long mechanical arms toward the frozen model city, palms open, waiting; the half-built blocks stay frozen and empty; gentle, not menacing. | An enormous gold anchor drops from the frozen model city into deep navy water, chain rattling, pulling down a sports car, jewelry and a coin stack, all sinking slowly in a trail of bubbles. | `55848b2d-9c36-466e-b2b7-56e8261881c0` |
| P18 | B35+B36 | reuse ep01 Lehman clip | REUSE ep01 Lehman petri-dish clip 7e83b0cd (0 cr) |  | `ep01 reuse` |
| P19 | B37+B38 | drawn start frame (seedream v5 pro) | PROFESSOR PENNY turns to face the camera and points straight at the viewer with her wooden pointer; behind her an ordinary office worker holds a modest paycheck. Warm, inviting. | A gentle golden hill-shaped line draws itself slowly across a long timeline, rising and easing down; beside it a second line shoots straight up into a tall narrow tower. Clean lines only. | `3410aba6-2c3b-430c-8376-4d403a5a4155` |
| P20 | B39+B40 | drawn start frame (seedream v5 pro) | The tall narrow golden tower line holds at the top then ends at a sheer cliff edge; a little cartoon cart rolling along the top reaches the edge and stops, wheels spinning over empty space. | At the cliff edge the gold line ends abruptly but a red line keeps running forward into thin air, carrying a little crowded bus and a row of houses; THE PLAYER in a suit stands at the edge, watching. | `3adbcc6f-03d6-416e-a248-e5de3695f5dd` |
| P21 | B41+B42 | drawn start frame (seedream v5 pro) | A large brass pocket watch floats over the cliff, its hands spinning quickly forward; behind it a red line slopes steadily down toward a dark floor; PROFESSOR PENNY holds a stopwatch, timing it. | A small airplane taxis along a runway that is getting shorter as tiles fall away from its far end; the plane keeps rolling; camera follows from above. | `a4af404e-88a9-4eb2-ac0e-702216036987` |
| P22 | B43+B44 | drawn start frame (seedream v5 pro) | The runway ends and the little airplane stops right at the very edge; a plain rounded panel slides in beside it. Upper area kept clear. | First-person view: your own hands hold a modest paycheck that slowly fades to transparent; on a desk in front of you an empty gauge waits to fill; PROFESSOR PENNY looks at you kindly over her glasses. Slow push-in. | `d16c0922-77d7-4af6-99de-80761fa62cd6` |
| P23 | B45+B46 | drawn start frame (seedream v5 pro) | Dawn breaks over the city skyline; warm orange light spills across the frame; PROFESSOR PENNY slowly smiles and puts her glasses back on. | THE PLAYER (older) walks steadily up a long winding path toward a sunlit hilltop; each step lights up gold beneath his feet; the dark valley behind him fades away. | `6c89d511-1cc9-42fa-976f-c68e699db9b2` |
| P24 | B47+B48 | drawn start frame (seedream v5 pro) | THE PLAYER (older) picks up a dusty book, opens it, and golden light pours out of its pages forming a glowing rising path into the sky. | A bright classroom; THE PLAYER (older) stands at the front beside a whiteboard with a simple drawing of a bathtub with a tap and drain; a row of young athletes in tracksuits lean forward, listening. | `e374aa47-b096-4358-a271-95e291dc6bf0` |
| P25 | B49+B50 | drawn start frame (seedream v5 pro) | THE PLAYER (older) hands a glowing open book to a young athlete who passes a page to the next, and the next, a chain of golden light spreading down a long line of people; PROFESSOR PENNY applauds quietly. | A landscape with a little house cycles through seasons in time-lapse: bright summer sun, golden autumn, then the first snow drifting down. | `fade9e17-3062-46a4-b45c-4c9b518fab39` |
| P26 | B51+B52 | drawn start frame (seedream v5 pro) | Snow falls on two houses: a tiny cabin with a warm glowing window and a big stack of firewood, and a grand mansion with dark windows and an empty woodshed; the small elderly man in a grey flat cap from the style reference waves from the cabin door. | Clean navy frame with drifting snowflakes; a big friendly round gold stamp slams down in the centre with a burst of sparkles; PROFESSOR PENNY wraps a mint scarf around her neck and nods. Stamp face plain and blank. | `944a4f30-7e9b-4f9e-be0e-2c5c320d375b` |
| P27 | B53+B54 | start = P26 frame, end = runway UI | The snowy cartoon cabin scene from the start image swooshes and dissolves into mint and gold particles that swirl toward camera; PROFESSOR PENNY stays in frame and hops toward the bottom right corner. No cities, no landmarks, no buildings appear. | The particles reassemble into a clean navy personal-finance calculator interface with two input panels on the left and a long horizontal bar on the right that fills from left to right with gold. | `8bd9434a-9b60-4321-9980-f7a54b5f8ea4` |
| P28 | B55+B56 | start = runway UI (local) | On the navy calculator interface the gold bar fills only a short way and stops well before a glowing marker line; PROFESSOR PENNY, small at the bottom corner, winces. | The gold bar extends further and lands exactly on the marker line, which glows mint; PROFESSOR PENNY gives a thumbs up. | `f2d863ef-f709-4fbc-bd4b-2b5f20dc7326` |
| P29 | B57+B58 | start = runway UI (local) | The camera pulls back as the gold bar keeps extending far past the marker line; snowflakes drift outside a window at the edge of the screen. | Two friendly round slider knobs on the interface: as one slides left, a gold savings stack grows taller and a red spending block shrinks at the same time, and the bar shoots longer; PROFESSOR PENNY points at both with her pointer. | `0a1cedf1-b178-4314-84b9-cb44f78266da` |
| P30 | B59+B60 | start = runway UI (local) | The calculator interface with empty input fields gently pulsing; a small first-person hand reaches in and taps the screen; the bar begins to fill. | PROFESSOR PENNY hops across the frame and stands proudly beside a blank rounded rectangle card on the left, gesturing to it, as a small garden of golden plants grows around her feet. Right third of frame clear. | `60798b74-de80-4747-a147-b78a39016fed` |
| P31 | B61+B62 | drawn start frame (seedream v5 pro) | Calm wide shot of the city skyline at dusk with a glowing gold line along the horizon like a road; THE PLAYER (older) walks along it calmly in the distance. | PROFESSOR PENNY waves goodbye and hops along a trail of glowing paper footprints toward a blank card; the frame settles. Right third of frame clear. | `96cbbe9b-8d94-43f4-8636-7d7aea8d7db0` |

## 🖍 Locally drawn start images (18)

Render each at 1280×720, brand navy `#0a0f1e`, exact text, ~90px clear bottom margin.

| Block | Frame content |
|---|---|
| B04 | Title card: `MONEY STORIES` / `EP 002` lockup, centre; reversed gold curve behind. |
| B05 | Name card lower third: `ANTOINE WALKER` (spelling must be exact). |
| B07 | Contract with gold overlay: `$71M` / `6 YEARS`. |
| B09 | Twelve-tier number tower: `$108M` · `12 SEASONS` · `3× ALL-STAR`. |
| B15 | Calendar pair: `2008` (last game) → `MAY 2010` (Chapter 7 filing). |
| B16 | Balance scale: `$12.7M DEBTS` (red, low) vs `$4.3M ASSETS` (gold, high); small footnote `Court filing, 2010`. |
| B20 | Split bar: `$108M EARNED` → `$55.2M TAXES` (footnote `His own figure`). |
| B21 | Remaining bar `≈ $53M` beside ghost outline of `$108M`. |
| B26 | Stamp: `A BIGGER PAYCHECK IS NOT A BIGGER GAP.` |
| B28 | Model city with deed stack: `≈ $18M` (footnote `His own figure`). |
| B32 | Year sweep: `2008`. |
| B43 | Runway panel: `RUNWAY: ~24 MONTHS`. |
| B52 | Stamp: `INCOME IS A SEASON. BUILD FOR WINTER.` |
| B54 | Ledger Runway UI, formula row: `RUNWAY = SAVINGS ÷ MONTHLY SPENDING`. |
| B55 | Ledger Runway UI: `$10,000` · `$5,000/mo` · `2 MONTHS` (bar short of 6-mo marker). |
| B56 | Ledger Runway UI: `$30,000` · `$5,000/mo` · `6 MONTHS` (bar on marker). |
| B57 | Ledger Runway UI: `$300,000` · `$5,000/mo` · `60 MONTHS` (bar far past marker). |
| B59 | Ledger Runway UI, blank fields (matches `calculator.html#runway` layout, brand navy). |

## Estimated cost (Higgsfield credits)

Rates from `ep01-draft-production-log.md` / `ep01-draft-review.md`: ~35 cr per 10s Seedance clip
(720p fast), ~1.2 cr per VO take, 0.05 cr per block for subtitles, assembly free.

| Item | Qty | Credits |
|---|---|---|
| New Seedance clips (10s) | 61 | 2,135 |
| Reused Ep01 clip (B35, Lehman petri dish) | 1 | 0 |
| VO takes (one per block) | 62 | 74.4 |
| Subtitles | 62 | 3.1 |
| **Base estimate** | | **≈ 2,212** |
| Retake buffer (~15% of clips; Ep01 needed 3 of 14) | 9 | 315 |
| **Budget to top up** | | **≈ 2,528** |

Notes:
- Balance at last check (July 2026 log): **12.85 credits**. A top-up is needed before any clip
  is generated; nothing here should be run without Lawrence's go-ahead.
- The Ep01 log's "~1,200+ credits" figure for a full 10:30 episode does not match 1-clip-per-block
  at 35 cr; at one clip per 10s window a 10–11 min episode is ~60+ clips. Ways to bring it down:
  reuse more Ep01 library clips (the bathtub `caabeb58` for B18 is the obvious candidate, though it
  had the brighter-blue drift), or let two consecutive blocks share one clip where the visual
  allows (the Ep01 draft did this: 28 blocks over 14 clips) — roughly halving clip spend to
  ~1,100 cr, at the cost of the strict 1:1 mapping.
- A cheap way to de-risk: generate the 🖍 frames locally (free), then a 5-clip pilot
  (B01, B16, B26, B43, B55 ≈ 175 cr + VO) before committing to the full batch.

## Assembly notes

- Assemble with `explainer_video` using the block map above in order (B01–B62);
  expected output 10:20 at 1280×720.
- Emotional bookends worth extra takes: B01–B02 (cold open), B13 (the house for his mother),
  B45–B49 (the comeback).
- Workhorses worth 2 variants: B18 (bathtub), B25 (empty gold tub vs sealed tub — the gold tub
  MUST be empty; this was the Ep01 two-tubs defect), B30–B31 (risk tower), B54–B57 (runway UI).
- Music bed is not produced by the assembler — add a licensed/royalty-free bed in the edit.
- Shorts: re-generate B01–B04, B19–B21 and B44 + B55–B57 at 9:16 rather than cropping.
- Compliance: altered-content disclosure ON at upload; these are AI-generated visuals.
