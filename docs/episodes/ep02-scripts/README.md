# EP02 render scripts (box-adapted)

Copied from the ep02 draft run. Paths assume the working dir `/workspace/ep02` (clips/, vo/, overlays/, work/). `plan.py` is the 62-block -> 31-clip pair plan imported by both scripts.

- `ep02-render-frames.py`: exact-text overlay PNGs + textless runway-UI start frame (PIL).
- `assemble.py`: cut-split, time-stretch, overlays, captions, concat (ffmpeg). Free, local.
