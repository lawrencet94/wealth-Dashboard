"""Render the exact-figures compounding bar chart (1280x720) for ep01."""
from PIL import Image, ImageDraw, ImageFont

W, H = 1280, 720
NAVY = (10, 15, 30)
MINT = (125, 211, 168)
GOLD = (212, 168, 83)
WHITE = (240, 242, 248)
GRAY = (150, 160, 180)

# FV of $300/mo at 8%/yr, monthly compounding
r = 0.08 / 12
def fv(years):
    n = years * 12
    return 300 * (((1 + r) ** n - 1) / r)

data = [
    (10, fv(10), "$55K"),
    (20, fv(20), "$177K"),
    (30, fv(30), "$447K"),
    (45, fv(45), "$1.6M"),
    (65, fv(65), "$8M"),
]

img = Image.new("RGB", (W, H), NAVY)
d = ImageDraw.Draw(img)

def font(size, bold=False):
    try:
        return ImageFont.truetype("/System/Library/Fonts/Supplemental/Georgia Bold.ttf" if bold
                                  else "/System/Library/Fonts/Supplemental/Georgia.ttf", size)
    except OSError:
        return ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", size)

title_f = font(44, bold=True)
label_f = font(30, bold=True)
year_f = font(26)
sub_f = font(26)

d.text((W // 2, 52), "$300 a month, at 8%", font=title_f, fill=WHITE, anchor="mm")
d.text((W // 2, 100), "the same money — the only difference is time", font=sub_f, fill=GRAY, anchor="mm")

# plot area
x0, x1, y_base, y_top = 120, 1160, 620, 160
max_v = data[-1][1]
n = len(data)
slot = (x1 - x0) / n
bar_w = slot * 0.52

# baseline
d.line([(x0 - 20, y_base), (x1 + 20, y_base)], fill=(60, 70, 95), width=3)

for i, (yrs, v, lab) in enumerate(data):
    cx = x0 + slot * i + slot / 2
    h = max(6, (v / max_v) * (y_base - y_top))
    top = y_base - h
    color = GOLD if i == n - 1 else MINT
    d.rounded_rectangle([cx - bar_w / 2, top, cx + bar_w / 2, y_base], radius=8, fill=color)
    # value label above bar
    d.text((cx, top - 28), lab, font=label_f, fill=(GOLD if i == n - 1 else WHITE), anchor="mm")
    # year label below baseline
    d.text((cx, y_base + 30), f"{yrs} yrs", font=year_f, fill=GRAY, anchor="mm")

# soft glow on the gold bar peak
gx = x0 + slot * (n - 1) + slot / 2
gtop = y_base - (data[-1][1] / max_v) * (y_base - y_top)
for rad, alpha in [(70, 26), (50, 40), (30, 60)]:
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    gd.ellipse([gx - rad, gtop - rad, gx + rad, gtop + rad], fill=(212, 168, 83, alpha))
    img = Image.alpha_composite(img.convert("RGBA"), glow).convert("RGB")
d = ImageDraw.Draw(img)
d.text((gx, gtop - 28), "$8M", font=label_f, fill=GOLD, anchor="mm")

out = "/private/tmp/claude-501/-Users-lawrenceterracciano-Documents-Claude-Code/7b2ec948-bb91-4e1c-b115-0ec0c2068320/scratchpad/ladder_chart.png"
img.save(out)
print("saved", out)
for yrs, v, lab in data:
    print(f"{yrs}y = ${v:,.0f} -> {lab}")
