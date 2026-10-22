"""Render EP02 exact-text overlays (1280x720 transparent PNGs) — adapted from ep01-render-chart.py /
ep01-render-calc-ui.py. Text and numbers are never left to the video model; these PNGs are composited
over the textless Seedance clips during the named VO block. Also renders the textless runway-UI start frame.
Bottom ~130px is always left clear for burned-in captions."""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
from PIL import Image, ImageDraw, ImageFont, ImageFilter
from plan import OVERLAYS

W, H = 1280, 720
NAVY = (10, 15, 30); PANEL = (14, 22, 44); EDGE = (46, 58, 92)
GOLD = (245, 197, 66); MINT = (95, 211, 165); RED = (232, 88, 79); CREAM = (244, 236, 216); GRAY = (170, 180, 200)
FREDOKA = "/usr/share/fonts/truetype/sand-box/google/Baloo 2/Baloo2-VariableFont_wght.ttf"  # Baloo 2: rounded, has ≈ → glyphs
OUT = "/workspace/ep02/overlays"

def font(size, weight="ExtraBold"):
    f = ImageFont.truetype(FREDOKA, size)
    try: f.set_variation_by_name(weight)
    except Exception: pass
    return f

def canvas():
    return Image.new("RGBA", (W, H), (0, 0, 0, 0))

def shadowed(img, box, radius=26, fill=(14, 22, 44, 225), outline=GOLD, width=4):
    sh = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(sh).rounded_rectangle([box[0]+6, box[1]+8, box[2]+6, box[3]+8], radius=radius, fill=(0, 0, 0, 120))
    sh = sh.filter(ImageFilter.GaussianBlur(8))
    img.alpha_composite(sh)
    ImageDraw.Draw(img).rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)

def text_w(d, s, f):
    b = d.textbbox((0, 0), s, font=f); return b[2] - b[0]

def panel_lines(img, x, y, items, pad=28, align="left", outline=GOLD):
    """items: list of (text, font, color). Draw a panel sized to the text at x,y (x = left or centre)."""
    d = ImageDraw.Draw(img)
    widths = [text_w(d, t, f) for t, f, c in items]
    heights = [f.size * 1.18 for t, f, c in items]
    w = max(widths) + 2 * pad; h = sum(heights) + 2 * pad - 8
    x0 = x - w / 2 if align == "center" else x
    shadowed(img, [x0, y, x0 + w, y + h], outline=outline)
    d = ImageDraw.Draw(img)
    cy = y + pad - 6
    for (t, f, c), tw, th in zip(items, widths, heights):
        tx = x0 + (w - tw) / 2 if align == "center" else x0 + pad
        d.text((tx, cy), t, font=f, fill=c)
        cy += th
    return img

def render(bid, spec):
    k, L = spec["kind"], spec["lines"]
    img = canvas(); d = ImageDraw.Draw(img)
    foot = spec.get("foot")
    if k == "title":
        panel_lines(img, W / 2, 230, [(L[0], font(96), GOLD), (L[1], font(38, "Medium"), CREAM)], pad=40, align="center")
    elif k == "lower":
        panel_lines(img, 60, 60, [(L[0], font(48), CREAM)], pad=24, outline=MINT)
    elif k == "stat":
        items = [(L[0], font(104), GOLD), (L[1], font(36, "Medium"), CREAM)]
        if foot: items.append((foot, font(24, "Regular"), GRAY))
        panel_lines(img, 60, 50, items, pad=30)
    elif k == "stat2":
        a = [(L[0], font(84), GOLD), (L[1], font(30, "Medium"), CREAM)]
        b = [(L[2], font(84), RED if bid == "B20" else GOLD), (L[3], font(30, "Medium"), CREAM)]
        if foot: b.append((foot, font(22, "Regular"), GRAY))
        panel_lines(img, 330, 50, a, pad=28, align="center")
        panel_lines(img, 950, 50, b, pad=28, align="center")
        d = ImageDraw.Draw(img)
        d.text((640, 140), "→", font=font(90), fill=CREAM, anchor="mm")
    elif k == "scale":
        panel_lines(img, 320, 50, [(L[0], font(64), RED)], pad=26, align="center", outline=RED)
        panel_lines(img, 960, 50, [(L[1], font(64), GOLD)], pad=26, align="center")
        d = ImageDraw.Draw(img)
        d.text((640, 200), L[2], font=font(26, "Regular"), fill=GRAY, anchor="mm")
    elif k == "stamp":
        panel_lines(img, W / 2, 200, [(L[0], font(70), NAVY), (L[1], font(70), NAVY)], pad=44, align="center")
        # recolour panel to gold stamp
        img2 = canvas(); dd = ImageDraw.Draw(img2)
        f = font(70); w = max(text_w(dd, s, f) for s in L) + 100; h = 2 * 70 * 1.18 + 80
        box = [W / 2 - w / 2, 190, W / 2 + w / 2, 190 + h]
        shadowed(img2, box, radius=34, fill=(245, 197, 66, 245), outline=CREAM, width=8)
        dd = ImageDraw.Draw(img2)
        dd.rounded_rectangle([box[0]+16, box[1]+16, box[2]-16, box[3]-16], radius=24, outline=NAVY, width=4)
        cy = box[1] + 40
        for s in L:
            dd.text((W / 2, cy + 40), s, font=f, fill=NAVY, anchor="mm"); cy += 70 * 1.18
        img = img2
    elif k == "year":
        panel_lines(img, W / 2, 50, [(L[0], font(140), CREAM)], pad=30, align="center", outline=RED)
    elif k == "formula":
        panel_lines(img, W / 2, 46, [(L[0], font(52), GOLD)], pad=28, align="center", outline=MINT)
    elif k == "runway":
        rows = [("SAVED", L[0], CREAM), ("SPEND", L[1], CREAM), ("RUNWAY", L[2], GOLD)]
        x0, y0, w, rh = 760, 46, 470, 78
        shadowed(img, [x0, y0, x0 + w, y0 + rh * 3 + 30], outline=MINT)
        d = ImageDraw.Draw(img)
        for i, (lab, val, c) in enumerate(rows):
            y = y0 + 22 + i * rh
            d.text((x0 + 28, y + 10), lab, font=font(28, "Medium"), fill=GRAY)
            d.text((x0 + w - 28, y), val, font=font(50), fill=c, anchor="ra")
    elif k == "badge":
        panel_lines(img, 930, 230, [(L[0], font(60), MINT), (L[1], font(34, "Medium"), CREAM)], pad=34, align="center", outline=MINT)
    elif k == "endcard":
        panel_lines(img, 850, 200, [(L[0], font(40, "Medium"), MINT), (L[1], font(40), CREAM)], pad=34, align="center", outline=MINT)
    img.save(f"{OUT}/{bid}.png")

def runway_ui():
    """Textless runway calculator UI frame (brand navy), used as Seedance start_image for P28-P30 and
    end_image for P27. Layout follows ep01-render-calc-ui.py; numbers come from the overlays."""
    img = Image.new("RGB", (W, H), NAVY); d = ImageDraw.Draw(img)
    PANEL_RGB = (18, 26, 48); MINT_DIM = (60, 105, 88)
    d.rounded_rectangle([60, 70, 430, 560], radius=18, fill=PANEL_RGB, outline=EDGE, width=2)
    for i in range(3):
        y = 150 + i * 130
        d.rounded_rectangle([90, y, 400, y + 56], radius=14, fill=(24, 34, 62), outline=EDGE, width=2)
        d.rounded_rectangle([90, y - 40, 220, y - 24], radius=8, fill=(40, 52, 84))
    d.rounded_rectangle([490, 70, 1220, 560], radius=18, fill=PANEL_RGB, outline=EDGE, width=2)
    for i in range(1, 6):
        gx = 520 + i * 110
        d.line([(gx, 110), (gx, 520)], fill=(30, 40, 66), width=1)
    d.rounded_rectangle([530, 290, 1180, 350], radius=30, fill=(24, 34, 62), outline=EDGE, width=2)
    d.rounded_rectangle([530, 290, 640, 350], radius=30, fill=GOLD)
    mx = 530 + 650 * 0.45
    d.line([(mx, 250), (mx, 390)], fill=MINT, width=5)
    img.save("/workspace/ep02/frames/runway_ui.png")

if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    for bid, spec in OVERLAYS.items():
        render(bid, spec)
    runway_ui()
    print("rendered", len(OVERLAYS), "overlays + runway_ui.png")
