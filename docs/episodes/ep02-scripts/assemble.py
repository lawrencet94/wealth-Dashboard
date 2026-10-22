"""EP02 box assembler (replaces the retired Higgsfield explainer_video step).
Per pair clip (two 5s shots): split at the detected cut near 5s, time-stretch each half to its VO block window
(window = max(10s, VO length + 0.3s); VO is never sped up), composite the exact-text overlay for that block,
lay the Alistair VO, then concat all 62 blocks and burn ASS captions built from the exact script text."""
import json, os, re, subprocess, sys
sys.path.insert(0, os.path.dirname(__file__))
import plan

E = "/workspace/ep02"
FPS = 24
STRETCH = os.environ.get("STRETCH", "blend")   # 'dup' | 'blend'
# P18 reuses the ep01 Lehman clip (one continuous shot, zoom-out at ~8.7s): the detector picks 6.8s, which would
# stretch B36 x3, so split evenly instead.
CUT_OVERRIDE = {"P18": 5.0}

def sh(cmd):
    r = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    if r.returncode: raise RuntimeError(cmd + "\n" + r.stderr[-2000:])
    return r.stdout + r.stderr

def dur(p):
    return float(sh(f'ffprobe -v error -show_entries format=duration -of csv=p=0 "{p}"').strip().split()[0])

def find_cut(clip):
    """Seedance often joins the two shots with a short dissolve, not a hard cut, so scene-change filters miss it.
    Compare every frame in 3.5-7.0s with the shot-1 anchor (3.5s) and shot-2 anchor (7.0s); the cut is where the
    frame becomes closer to shot 2. Returns (time, confidence); falls back to 5.0s when the halves look alike."""
    import numpy as np
    raw = subprocess.run(f'ffmpeg -v error -ss 3.5 -t 3.55 -i "{clip}" -vf scale=48:27,format=gray -f rawvideo -',
                         shell=True, capture_output=True).stdout
    fr = np.frombuffer(raw, np.uint8).reshape(-1, 27, 48).astype(float)
    if len(fr) < 10: return 5.0, 0.0
    a, b = fr[0], fr[-1]
    sep = np.abs(a - b).mean()
    if sep < 6: return 5.0, sep
    da = np.abs(fr - a).mean(axis=(1, 2)); db = np.abs(fr - b).mean(axis=(1, 2))
    idx = int(np.argmax(da > db))
    return round(3.5 + idx / FPS, 3), float(round(sep, 1))

def speech_segments(wav):
    out = sh(f'ffmpeg -hide_banner -i "{wav}" -af silencedetect=n=-38dB:d=0.18 -f null - 2>&1')
    d = dur(wav); sil = []; st = None
    for line in out.splitlines():
        m = re.search(r"silence_start: ([\d.]+)", line)
        if m: st = float(m.group(1))
        m = re.search(r"silence_end: ([\d.]+)", line)
        if m and st is not None: sil.append((st, float(m.group(1)))); st = None
    if st is not None: sil.append((st, d))
    segs = []; cur = 0.0
    for a, b in sil:
        if a > cur + 0.05: segs.append((cur, a))
        cur = b
    if d > cur + 0.05: segs.append((cur, d))
    return segs or [(0, d)]

def chunk(text, maxc=44):
    words = text.split(); lines = []; cur = ""
    for w in words:
        if cur and len(cur) + 1 + len(w) > maxc:
            lines.append(cur); cur = w
        else:
            cur = (cur + " " + w).strip()
        if re.search(r"[.?!]$", w) and len(cur) > 18:
            lines.append(cur); cur = ""
    if cur: lines.append(cur)
    return lines

def map_time(segs, frac):
    tot = sum(b - a for a, b in segs); target = frac * tot
    for a, b in segs:
        if target <= b - a: return a + target
        target -= b - a
    return segs[-1][1]

def ass_time(t):
    h = int(t // 3600); m = int(t % 3600 // 60); s = t % 60
    return f"{h}:{m:02d}:{s:05.2f}"

def build_block(bid, clip, t0, t1, vo, overlay, out):
    L = max(10.0, dur(vo) + 0.3)
    part = t1 - t0
    f = L / part
    vf = f"trim=start={t0}:end={t1},setpts=(PTS-STARTPTS)*{f:.5f}"
    if STRETCH == "blend":
        vf += f",framerate=fps={FPS}:interp_start=0:interp_end=255:scene=100"
    else:
        vf += f",fps={FPS}"
    vf += f",scale=1280:720:flags=lanczos,setsar=1,format=yuv420p,trim=duration={L:.3f}"
    if overlay:
        fo = max(L - 0.5, 1.0)
        fc = (f"[0:v]{vf}[bg];[2:v]format=rgba,fade=t=in:st=0.35:d=0.35:alpha=1,fade=t=out:st={fo:.2f}:d=0.35:alpha=1[ov];"
              f"[bg][ov]overlay=0:0:shortest=1,format=yuv420p[v]")
        inputs = f'-i "{clip}" -i "{vo}" -loop 1 -t {L:.3f} -framerate {FPS} -i "{overlay}"'
    else:
        fc = f"[0:v]{vf}[v]"
        inputs = f'-i "{clip}" -i "{vo}"'
    fc += f";[1:a]aresample=48000,aformat=channel_layouts=stereo,apad,atrim=duration={L:.3f}[a]"
    sh(f'ffmpeg -y -hide_banner -loglevel error {inputs} -filter_complex "{fc}" -map "[v]" -map "[a]" '
       f'-c:v libx264 -preset medium -crf 17 -r {FPS} -c:a aac -b:a 192k -t {L:.3f} "{out}"')
    return L

def main(pids=None, outname="ep02_draft.mp4"):
    rows = {b["id"]: b for b in json.load(open(f"{E}/work/blocks.json"))}
    pairs = [p for p in plan.P if pids is None or p[0] in pids]
    from concurrent.futures import ThreadPoolExecutor
    jobs = []; log = {}
    for p in pairs:
        pid, A, B = p[0], p[1], p[2]
        clip = f"{E}/refs/ep01_lehman.mp4" if pid == "P18" else f"{E}/clips/{pid}.mp4"
        cd = dur(clip); cut, score = find_cut(clip)
        if pid in CUT_OVERRIDE: cut, score = CUT_OVERRIDE[pid], "override"
        log[pid] = {"cut": cut, "score": score}
        for bid, (t0, t1) in ((A, (0, cut)), (B, (cut, min(cd, 10.0)))):
            ov = f"{E}/overlays/{bid}.png"
            jobs.append((bid, clip, t0, t1, f"{E}/vo/{bid}.wav", ov if os.path.exists(ov) else None, f"{E}/work/seg/{bid}.mp4"))
    with ThreadPoolExecutor(int(os.environ.get("JOBS", "4"))) as ex:
        Ls = list(ex.map(lambda j: build_block(*j), jobs))
    seq = [(j[0], j[6], L) for j, L in zip(jobs, Ls)]
    # concat
    with open(f"{E}/work/concat.txt", "w") as fh:
        for bid, out, L in seq: fh.write(f"file '{out}'\n")
    sh(f'ffmpeg -y -hide_banner -loglevel error -f concat -safe 0 -i {E}/work/concat.txt -c copy {E}/work/nocaps.mp4')
    # captions from exact script text
    ass = ["[Script Info]", "ScriptType: v4.00+", "PlayResX: 1280", "PlayResY: 720", "WrapStyle: 0", "",
           "[V4+ Styles]",
           "Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding",
           "Style: Cap,Baloo 2,44,&H00FFFFFF,&H00FFFFFF,&H001E0F0A,&H96000000,-1,0,0,0,100,100,0,0,1,3.2,1.5,2,80,80,34,1",
           "", "[Events]", "Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text"]
    t = 0.0
    for bid, out, L in seq:
        text = plan.VO_EDITS.get(bid, rows[bid]["vo"])
        segs = speech_segments(f"{E}/vo/{bid}.wav")
        lines = chunk(text); tot = sum(len(l) for l in lines); acc = 0
        for ln in lines:
            a = map_time(segs, acc / tot); acc += len(ln); b = map_time(segs, acc / tot)
            ass.append(f"Dialogue: 0,{ass_time(t + a)},{ass_time(t + b + 0.12)},Cap,,0,0,0,,{ln}")
        t += L
    open(f"{E}/work/captions.ass", "w").write("\n".join(ass) + "\n")
    sh(f'ffmpeg -y -hide_banner -loglevel error -i {E}/work/nocaps.mp4 -vf "ass={E}/work/captions.ass" '
       f'-c:v libx264 -preset slow -crf 18 -c:a copy -movflags +faststart {E}/output/{outname}')
    json.dump({"cuts": log, "blocks": [(b, round(L, 2)) for b, _, L in seq], "runtime": round(t, 2)},
              open(f"{E}/work/assembly_{outname}.json", "w"), indent=1)
    print("runtime", round(t, 2), log)

if __name__ == "__main__":
    pids = sys.argv[1].split(",") if len(sys.argv) > 1 and sys.argv[1] != "all" else None
    main(pids, sys.argv[2] if len(sys.argv) > 2 else "ep02_draft.mp4")
