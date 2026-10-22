"""EP02 pair plan: 62 VO blocks -> 31 clips (two consecutive blocks share one 10s clip).
Each clip is written as two 5s shots: SHOT 1 covers block A, SHOT 2 covers block B.
refs: P = Professor Penny ref, W = Player ref (young/older sheet), S = ep01 style frame.
start: 'gen' = seedream start frame from shot-1 still; 'ui' = locally drawn textless UI frame; None.
"""
import json

STYLE = ("Flat 2D vector cartoon animation, premium educational explainer, exactly matching the style of the "
         "reference images: thick dark-brown clean outlines, soft rounded shapes, flat colors with gentle shading, "
         "deep navy (#0a0f1e) night tones with accents of gold (#f5c542), mint green (#5fd3a5), warm red (#e8584f) "
         "and cream (#f4ecd8), subtle floating particles, soft glow on key elements, smooth eased motion from the very "
         "first frame, no photorealism.")
NEG = ("No text, no letters, no numbers, no Chinese characters, no logos, no watermarks, no writing of any kind, "
       "no captions, no real people's likenesses, no team jerseys with numbers, no league logos. Characters never talk, "
       "mouths stay closed; they only emote and gesture.")
PENNY = ("PROFESSOR PENNY: the cute white lop-eared bunny from the reference image, long droopy ears, round gold-rimmed "
         "glasses, pink blush cheeks, cream suit with mint-green tie and cuffs, small and chibi-proportioned.")
PLAYER = ("THE PLAYER: the tall lanky basketball player from the character reference, dark brown skin, short dark hair, "
          "warm expressive face, plain cream-and-navy jersey with no number or logo.")
PLAYER_OLD = ("THE PLAYER (older): the same man from the character reference's right side, about 40, short neat beard, "
              "navy blazer over a cream shirt.")

P = [
 # id, A, B, refs, start, shot1, shot2
 ("P01","B01","B02","W","gen",
  "A packed flat-vector basketball arena at night, confetti drifting down; THE PLAYER raises both arms at centre court as a stack of gold coins beside him grows taller with every cheer. Slow push-in.",
  "The arena lights switch off one bank at a time; the gold coin stack drains away through a hole in the floor until only a few coins remain; THE PLAYER stands alone at centre court, small, looking down at it."),
 ("P02","B03","B04","P","gen",
  "A cute cartoon brain with little stick arms shakes its head in disbelief at a giant gold coin pile that quietly leaks coins from a crack at its base, a thin golden stream trickling away; PROFESSOR PENNY lifts her glasses and peers at the crack.",
  "A glowing golden exponential curve sweeps up across the navy sky, then reverses and dives downward like a falling comet; PROFESSOR PENNY hops in and taps the air with a wooden pointer. The centre of the frame stays clear and empty."),
 ("P03","B05","B06","W","gen",
  "Dusk on a city playground basketball court with a chain-link fence and a skyline silhouette; a lanky teenage THE PLAYER practises jump shots alone under a single streetlight. Lower third of the frame kept clear.",
  "Quick wipe to a warm, golden cartoon arena; young THE PLAYER lifts a shiny plain gold trophy cup over his head as confetti falls and generic teammates in plain cream shirts cheer; then a wipe to him shaking hands with a smiling man in a suit on a simple spotlit stage."),
 ("P04","B07","B08","WP","gen",
  "A contract on a wooden desk; a fountain pen signs it with a flourish, the paper glows gold and coins pour out of the signature line, stacking into a tower; young THE PLAYER watches wide-eyed. Upper area kept clear.",
  "Split screen: left, a young office worker at a small desk nervously reading a modest letter; right, young THE PLAYER standing on top of a tall golden coin tower that keeps growing; PROFESSOR PENNY stands between them pointing back and forth, ears perked."),
 ("P05","B09","B10","P","gen",
  "A golden tower rises tier by tier, twelve glowing stacked tiers lighting up one after another, small star icons popping on three tiers and a ring icon near the top. Upper left area kept clear.",
  "A torrent of gold coins pours through an open doorway into a room; in the corner a small dusty unopened book sits on a stool; PROFESSOR PENNY picks up the book, blows the dust off and holds it up meaningfully."),
 ("P06","B11","B12","W","gen",
  "THE PLAYER in a sharp suit strides down a glowing night boulevard lined with oversized billboards showing generic dark silhouettes of music stars in sunglasses; golden spotlights sweep the sky. Billboards show only silhouettes.",
  "A cheerful museum display of pedestals: a shiny sports car, a tray of sparkling jewelry, a tailored suit on a mannequin, a long dinner table; beneath the floor a drain grate visibly widens with each new item."),
 ("P07","B13","B14","WP","gen",
  "Warm tender moment: THE PLAYER hands a house key to his mother on the porch of a lovely family home; she covers her mouth with joy; soft golden afternoon light, falling leaves.",
  "A single golden paycheck drawn as a small bus driving along a road; many simple friendly passengers climb aboard one by one until it is crammed and the wheels strain; PROFESSOR PENNY counts on her fingers, ears rising in surprise."),
 ("P08","B15","B16","",
  "gen",
  "A wall calendar flips its pages quickly; the basketball court lights dim; a courthouse with columns appears and a single document slides across a wooden bench. Upper area kept clear.",
  "A large balance scale on a navy background: the left pan, heavy and red, sinks low; the right pan, light and gold, rises high; gentle sway, slow push-in. Upper area kept clear."),
 ("P09","B17","B18","P","gen",
  "A small glowing championship ring on a velvet cushion under a spotlight is gently lifted out of frame; PROFESSOR PENNY looks at the empty cushion, then rolls up her sleeves and pulls out a screwdriver.",
  "A large white bathtub on a navy background; water pours in from a golden tap and drains out a hole at the bottom; the water level barely moves; PROFESSOR PENNY stands beside it holding a clipboard."),
 ("P10","B19","B20","P","gen",
  "PROFESSOR PENNY lowers a giant measuring tape into a gold-plated bathtub, peering over the rim; the camera tilts down to reveal the tub is much shallower than it looked.",
  "A single tall glowing golden bar stands in the centre and splits cleanly down the middle; the left half slides away to the left and drops into the coin slot of a simple plain grey cartoon vault box with a flat lid (generic, no columns, no dome, not resembling any real building); the right half stays in place and keeps glowing. Upper area kept clear."),
 ("P11","B21","B22","P","gen",
  "The remaining golden bar stands alone beside the faint ghost outline of the original full-height bar; PROFESSOR PENNY stands on tiptoe holding a ruler against both, eyebrows raised. Upper right area kept clear.",
  "Bathtub cross-section: out of the drain a parade of tiny objects flushes into a pipe: a sports car shrinking as it goes, sparkling jewelry, playing cards and casino chips; the water level visibly drops."),
 ("P12","B23","B24","P","gen",
  "A flurry of blank paper checks flutters out of a pipe and blows across a neon-lit casino floor; the blank checks bounce off the tables like rubber and fly away.",
  "The bathtub again: many small taps attached to its sides each pull a steady stream of water out; a wall calendar flips page after page; PROFESSOR PENNY tries to plug two of them with her paws."),
 ("P13","B25","B26","P","gen",
  "Split screen: left, a gold-plated bathtub that is visibly EMPTY with a dry bottom, a firehose tap blasting water straight through and gushing out of a huge open drain; right, a modest tub with a small tap and a sealed drain, slowly filling; PROFESSOR PENNY points at the empty gold tub.",
  "Clean navy frame; a giant friendly round gold stamp slams down in the centre with a small burst of sparkles; PROFESSOR PENNY gives an approving nod. The stamp face is plain and blank."),
 ("P14","B27","B28","P","gen",
  "PROFESSOR PENNY sits at a desk reviewing a neat report card, ticks a box with a green pen and smiles; behind her a small model city glows warmly on a shelf.",
  "An architect's model of rows of city houses and half-built apartment blocks on a table, lit warm amber; paper deeds float down and stack themselves around it. Upper area kept clear."),
 ("P15","B29","B30","WP","gen",
  "A long scroll of loan papers unrolls across the architect's model city; THE PLAYER in a suit signs each page with a pen that leaves a glowing gold squiggle; thin chains of gold links connect each signature to his wrist.",
  "A translucent glowing orange block drops onto the model city and lands with a bounce, the first of a tower; PROFESSOR PENNY points at it with her wooden pointer."),
 ("P16","B31","B32","P","gen",
  "Two more translucent blocks, red and purple, land on top of the orange block, forming a wobbly tower that sways precariously; PROFESSOR PENNY holds her ears down nervously.",
  "A cold red shadow line sweeps across the architect's model like a cold front; frost spreads over the little houses and cranes; ice crystals form. Upper area kept clear."),
 ("P17","B33","B34","","gen",
  "Friendly bank buildings with columns extend long mechanical arms toward the frozen model city, palms open, waiting; the half-built blocks stay frozen and empty; gentle, not menacing.",
  "An enormous gold anchor drops from the frozen model city into deep navy water, chain rattling, pulling down a sports car, jewelry and a coin stack, all sinking slowly in a trail of bubbles."),
 ("P18","B35","B36",None,None,"REUSE ep01 Lehman petri-dish clip 7e83b0cd (0 cr)",""),
 ("P19","B37","B38","P","gen",
  "PROFESSOR PENNY turns to face the camera and points straight at the viewer with her wooden pointer; behind her an ordinary office worker holds a modest paycheck. Warm, inviting.",
  "A gentle golden hill-shaped line draws itself slowly across a long timeline, rising and easing down; beside it a second line shoots straight up into a tall narrow tower. Clean lines only."),
 ("P20","B39","B40","W","gen",
  "The tall narrow golden tower line holds at the top then ends at a sheer cliff edge; a little cartoon cart rolling along the top reaches the edge and stops, wheels spinning over empty space.",
  "At the cliff edge the gold line ends abruptly but a red line keeps running forward into thin air, carrying a little crowded bus and a row of houses; THE PLAYER in a suit stands at the edge, watching."),
 ("P21","B41","B42","P","gen",
  "A large brass pocket watch floats over the cliff, its hands spinning quickly forward; behind it a red line slopes steadily down toward a dark floor; PROFESSOR PENNY holds a stopwatch, timing it.",
  "A small airplane taxis along a runway that is getting shorter as tiles fall away from its far end; the plane keeps rolling; camera follows from above."),
 ("P22","B43","B44","P","gen",
  "The runway ends and the little airplane stops right at the very edge; a plain rounded panel slides in beside it. Upper area kept clear.",
  "First-person view: your own hands hold a modest paycheck that slowly fades to transparent; on a desk in front of you an empty gauge waits to fill; PROFESSOR PENNY looks at you kindly over her glasses. Slow push-in."),
 ("P23","B45","B46","PW","gen",
  "Dawn breaks over the city skyline; warm orange light spills across the frame; PROFESSOR PENNY slowly smiles and puts her glasses back on.",
  "THE PLAYER (older) walks steadily up a long winding path toward a sunlit hilltop; each step lights up gold beneath his feet; the dark valley behind him fades away."),
 ("P24","B47","B48","W","gen",
  "THE PLAYER (older) picks up a dusty book, opens it, and golden light pours out of its pages forming a glowing rising path into the sky.",
  "A bright classroom; THE PLAYER (older) stands at the front beside a whiteboard with a simple drawing of a bathtub with a tap and drain; a row of young athletes in tracksuits lean forward, listening."),
 ("P25","B49","B50","WP","gen",
  "THE PLAYER (older) hands a glowing open book to a young athlete who passes a page to the next, and the next, a chain of golden light spreading down a long line of people; PROFESSOR PENNY applauds quietly.",
  "A landscape with a little house cycles through seasons in time-lapse: bright summer sun, golden autumn, then the first snow drifting down."),
 ("P26","B51","B52","SP","gen",
  "Snow falls on two houses: a tiny cabin with a warm glowing window and a big stack of firewood, and a grand mansion with dark windows and an empty woodshed; the small elderly man in a grey flat cap from the style reference waves from the cabin door.",
  "Clean navy frame with drifting snowflakes; a big friendly round gold stamp slams down in the centre with a burst of sparkles; PROFESSOR PENNY wraps a mint scarf around her neck and nods. Stamp face plain and blank."),
 ("P27","B53","B54","P","ui_end",
  "The snowy cartoon cabin scene from the start image swooshes and dissolves into mint and gold particles that swirl toward camera; PROFESSOR PENNY stays in frame and hops toward the bottom right corner. No cities, no landmarks, no buildings appear.",
  "The particles reassemble into a clean navy personal-finance calculator interface with two input panels on the left and a long horizontal bar on the right that fills from left to right with gold."),
 ("P28","B55","B56","P","ui",
  "On the navy calculator interface the gold bar fills only a short way and stops well before a glowing marker line; PROFESSOR PENNY, small at the bottom corner, winces.",
  "The gold bar extends further and lands exactly on the marker line, which glows mint; PROFESSOR PENNY gives a thumbs up."),
 ("P29","B57","B58","P","ui",
  "The camera pulls back as the gold bar keeps extending far past the marker line; snowflakes drift outside a window at the edge of the screen.",
  "Two friendly round slider knobs on the interface: as one slides left, a gold savings stack grows taller and a red spending block shrinks at the same time, and the bar shoots longer; PROFESSOR PENNY points at both with her pointer."),
 ("P30","B59","B60","P","ui",
  "The calculator interface with empty input fields gently pulsing; a small first-person hand reaches in and taps the screen; the bar begins to fill.",
  "PROFESSOR PENNY hops across the frame and stands proudly beside a blank rounded rectangle card on the left, gesturing to it, as a small garden of golden plants grows around her feet. Right third of frame clear."),
 ("P31","B61","B62","WP","gen",
  "Calm wide shot of the city skyline at dusk with a glowing gold line along the horizon like a road; THE PLAYER (older) walks along it calmly in the distance.",
  "PROFESSOR PENNY waves goodbye and hops along a trail of glowing paper footprints toward a blank card; the frame settles. Right third of frame clear."),
]

# exact on-screen text, rendered locally as overlays during the named block
OVERLAYS = {
 "B04": {"kind":"title","lines":["MONEY STORIES","EP 002 · THE $108 MILLION LESSON"]},
 "B05": {"kind":"lower","lines":["ANTOINE WALKER"]},
 "B07": {"kind":"stat","lines":["$71M","6-YEAR CONTRACT"]},
 "B09": {"kind":"stat","lines":["$108M","12 SEASONS · 3× ALL-STAR"]},
 "B15": {"kind":"stat2","lines":["2008","LAST NBA GAME","MAY 2010","CHAPTER 7 FILING"]},
 "B16": {"kind":"scale","lines":["$12.7M DEBTS","$4.3M ASSETS","Court filing, 2010"]},
 "B20": {"kind":"stat2","lines":["$108M","EARNED","$55.2M","TAXES"],"foot":"His own figure"},
 "B21": {"kind":"stat","lines":["≈ $53M","LEFT AFTER TAX"]},
 "B26": {"kind":"stamp","lines":["A BIGGER PAYCHECK","IS NOT A BIGGER GAP."]},
 "B28": {"kind":"stat","lines":["≈ $18M","INTO REAL ESTATE"],"foot":"His own figure"},
 "B32": {"kind":"year","lines":["2008"]},
 "B43": {"kind":"stat","lines":["RUNWAY","~24 MONTHS"]},
 "B52": {"kind":"stamp","lines":["INCOME IS A SEASON.","BUILD FOR WINTER."]},
 "B54": {"kind":"formula","lines":["RUNWAY = SAVINGS ÷ MONTHLY SPENDING"]},
 "B55": {"kind":"runway","lines":["$10,000","$5,000/mo","2 MONTHS"]},
 "B56": {"kind":"runway","lines":["$30,000","$5,000/mo","6 MONTHS"]},
 "B57": {"kind":"runway","lines":["$300,000","$5,000/mo","60 MONTHS"]},
 "B59": {"kind":"lower","lines":["FREE RUNWAY CALCULATOR · LINK BELOW"]},
 "B60": {"kind":"badge","lines":["WEALTH GARDEN","on the App Store"]},
 "B62": {"kind":"endcard","lines":["NEXT TIME","Where your paycheck actually goes"]},
}

# conservative fact wording (Lawrence's call on PR #8 flags)
VO_EDITS = {
 "B23": "And, according to reports, nearly a million dollars in bad checks written to casinos. That's the drain at full speed.",
}

def blocks():
    b = {x["id"]: x for x in json.load(open("/workspace/ep02/work/blocks.json"))}
    for k, v in VO_EDITS.items():
        b[k]["vo"] = v
        b[k]["words"] = len(v.split())
    return b

def clip_prompt(p):
    pid, a, bb, refs, start, s1, s2 = p
    chars = []
    if "P" in refs: chars.append(PENNY)
    if "W" in refs: chars.append(PLAYER_OLD if "(older)" in s1 + s2 else PLAYER)
    if "W" in refs and "(older)" in s1 + s2 and "THE PLAYER " in (s1 + s2).replace("THE PLAYER (older)", ""):
        chars.append(PLAYER)
    body = f"{STYLE} {' '.join(chars)} Two shots with one clean cut at 5 seconds. SHOT 1 (0-5s): {s1} SHOT 2 (5-10s): {s2} {NEG}"
    if start and start.startswith("ui"):
        body += " Keep the calculator interface layout from the start image; panels stay clean and blank."
    return body

if __name__ == "__main__":
    b = blocks()
    print(len(P), "pairs;", sum(1 for p in P if p[4] is not None or p[3] is not None), "new clips")
    print(clip_prompt(P[0]))
    print(len(clip_prompt(P[0])))

IDS = {"S": "8ff6bffc-9de4-4bf2-b45a-6e92b9b625e6", "P": "cb489660-225e-46b5-84fd-28ff297082af",
       "W": "48342909-9902-456c-bdf1-56e32d9e07e3"}

def frame_prompt(p):
    pid, a, bb, refs, start, s1, s2 = p
    chars = []
    if "P" in refs: chars.append(PENNY)
    if "W" in refs: chars.append(PLAYER_OLD if "(older)" in s1 else PLAYER)
    return (f"Single still frame, 16:9 widescreen, a full staged scene. Style: flat 2D vector cartoon exactly like the "
            f"first reference image (the diner scene): thick dark-brown clean outlines, soft rounded shapes, flat colors with "
            f"gentle shading, deep navy (#0a0f1e) night tones with gold (#f5c542), mint (#5fd3a5), warm red (#e8584f) and "
            f"cream (#f4ecd8) accents, soft glow. {' '.join(chars)} Scene: {s1} "
            f"Do not copy the diner, the old man or the labels from the references; use them only for style and character design. "
            f"No text, no letters, no numbers, no labels, no logos, no watermarks, no color swatches.")

def frame_medias(p):
    refs = p[3] or ""
    m = [{"value": IDS["S"], "role": "image_references"}]
    for k in "PW":
        if k in refs: m.append({"value": IDS[k], "role": "image_references"})
    return m

def dump_requests(pids, kind):
    out = []
    for p in P:
        if p[0] not in pids: continue
        idx = int(p[0][1:])
        if kind == "frame":
            out.append({"index": idx, "params": {"model": "seedream_v5_pro", "resolution": "1k", "aspect_ratio": "16:9",
                        "prompt": frame_prompt(p), "medias": frame_medias(p)}})
    return out

def clip_request(p, start_id, end_id=None):
    refs = p[3] or ""
    m = []
    if start_id: m.append({"value": start_id, "role": "start_image"})
    if end_id: m.append({"value": end_id, "role": "end_image"})
    for k in "PW":
        if k in refs: m.append({"value": IDS[k], "role": "image_references"})
    if "S" in refs: m.append({"value": IDS["S"], "role": "image_references"})
    return {"index": int(p[0][1:]), "params": {"model": "seedance_2_0", "mode": "fast", "resolution": "720p",
            "duration": 10, "aspect_ratio": "16:9", "generate_audio": False, "prompt": clip_prompt(p), "medias": m}}
