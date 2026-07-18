"""Render a clean Ledger-style calculator UI frame (1280x720) for the ep01 CTA scene."""
import math
from PIL import Image, ImageDraw, ImageFont

W, H = 1280, 720
NAVY = (10, 15, 30)
PANEL = (18, 26, 48)
PANEL_EDGE = (46, 58, 92)
MINT = (125, 211, 168)
MINT_DIM = (60, 105, 88)
GOLD = (212, 168, 83)
WHITE = (240, 242, 248)
GRAY = (150, 160, 180)

img = Image.new("RGB", (W, H), NAVY)
d = ImageDraw.Draw(img)

def font(size, bold=False):
    try:
        return ImageFont.truetype("/System/Library/Fonts/Supplemental/Georgia Bold.ttf" if bold
                                  else "/System/Library/Fonts/Supplemental/Georgia.ttf", size)
    except OSError:
        return ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", size)

title_f = font(34, bold=True)
lab_f = font(22)
small_f = font(18)

d.text((70, 44), "The Ledger", font=title_f, fill=WHITE)
d.text((70, 92), "compound growth calculator", font=small_f, fill=GRAY)

# left control panel
px0, py0, px1, py1 = 60, 140, 430, 560
d.rounded_rectangle([px0, py0, px1, py1], radius=18, fill=PANEL, outline=PANEL_EDGE, width=2)

sliders = [("Monthly amount", 0.35), ("Growth rate", 0.55), ("Years", 0.85)]
for i, (name, frac) in enumerate(sliders):
    y = py0 + 60 + i * 110
    d.text((px0 + 30, y - 34), name, font=lab_f, fill=GRAY)
    tx0, tx1 = px0 + 30, px1 - 30
    d.rounded_rectangle([tx0, y, tx1, y + 8], radius=4, fill=MINT_DIM)
    kx = tx0 + frac * (tx1 - tx0)
    d.rounded_rectangle([tx0, y, kx, y + 8], radius=4, fill=MINT)
    d.ellipse([kx - 12, y - 8, kx + 12, y + 16], fill=WHITE, outline=MINT, width=3)

# toggle chips
chips = ["Monthly", "Yearly"]
cx = px0 + 30
for i, c in enumerate(chips):
    w = 110
    x0c = cx + i * (w + 14)
    y0c = py1 - 70
    sel = i == 0
    d.rounded_rectangle([x0c, y0c, x0c + w, y0c + 42], radius=21,
                        fill=(MINT if sel else PANEL), outline=(MINT if sel else PANEL_EDGE), width=2)
    d.text((x0c + w / 2, y0c + 21), c, font=small_f, fill=(NAVY if sel else GRAY), anchor="mm")

# right chart area
cx0, cy0, cx1, cy1 = 490, 140, 1210, 560
d.rounded_rectangle([cx0, cy0, cx1, cy1], radius=18, fill=PANEL, outline=PANEL_EDGE, width=2)
# grid
for i in range(1, 5):
    gy = cy0 + i * (cy1 - cy0) / 5
    d.line([(cx0 + 20, gy), (cx1 - 20, gy)], fill=(30, 40, 66), width=1)

# compounding curve
pts = []
n = 120
for i in range(n + 1):
    t = i / n
    x = cx0 + 30 + t * (cx1 - cx0 - 60)
    v = (math.exp(3.1 * t) - 1) / (math.exp(3.1) - 1)
    y = (cy1 - 30) - v * (cy1 - cy0 - 60)
    pts.append((x, y))
d.line(pts, fill=MINT, width=5, joint="curve")
# gold tip glow
tipx, tipy = pts[-1]
for rad, alpha in [(46, 30), (30, 55), (16, 90)]:
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    gd.ellipse([tipx - rad, tipy - rad, tipx + rad, tipy + rad], fill=(212, 168, 83, alpha))
    img = Image.alpha_composite(img.convert("RGBA"), glow).convert("RGB")
d = ImageDraw.Draw(img)
d.ellipse([tipx - 9, tipy - 9, tipx + 9, tipy + 9], fill=GOLD)

# bottom margin kept empty (captions land here)
out = "/private/tmp/claude-501/-Users-lawrenceterracciano-Documents-Claude-Code/7b2ec948-bb91-4e1c-b115-0ec0c2068320/scratchpad/calc_ui.png"
img.save(out)
print("saved", out)
