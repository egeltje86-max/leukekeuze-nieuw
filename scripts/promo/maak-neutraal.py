"""Neutrale ('normaal') Nova-sjablonen maken uit de kerst-sjablonen: kaders en vakken blijven, de kerstachtergrond
wordt een rustige donkerblauwe achtergrond met gouden lichtjes. (2-11-2026, Marius: geen kerst/Sint bij noodpakket)"""
import os, random
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont
import sjablonen as SJ
B = os.path.join(os.path.dirname(__file__), 'bestanden')
def achter(w, h, zaad=3):
    y, x = np.mgrid[0:h, 0:w]
    t = (y / h)[..., None]
    base = np.array([12, 24, 56]) * (1 - t) + np.array([5, 11, 28]) * t
    d = np.sqrt(((x - 0.5 * w) / (w * 0.7)) ** 2 + ((y - 0.42 * h) / (h * 0.55)) ** 2)
    base = base + (np.clip(1 - d, 0, 1)[..., None] ** 2) * np.array([40, 34, 18])
    im = Image.fromarray(np.clip(base, 0, 255).astype(np.uint8)).convert('RGBA')
    r = random.Random(zaad); laag = Image.new('RGBA', (w, h), (0, 0, 0, 0)); d2 = ImageDraw.Draw(laag)
    for _ in range(int(w * h / 9000)):
        cx, cy = r.uniform(0, w), r.uniform(0, h); s = r.choice([2, 3, 4, 6, 10, 16, 26]); a = r.randint(25, 110) if s > 6 else r.randint(60, 200)
        d2.ellipse((cx - s, cy - s, cx + s, cy + s), fill=(242, 200, 116, a))
    laag = laag.filter(ImageFilter.GaussianBlur(2.2))
    im.alpha_composite(laag); return im
def logo(img):
    w, h = img.size; d = ImageDraw.Draw(img)
    ic = Image.open(os.path.join(B, 'logo-icoon.png')).convert('RGBA'); s = int(w * 0.035); ic.thumbnail((s, s))
    f = ImageFont.truetype(os.path.join(B, 'Poppins-Medium.ttf'), int(w * 0.026)); t = 'leukekeuze.nl'
    tw = d.textlength(t, font=f); tot = ic.width + 12 + tw; x = (w - tot) / 2; y = h - int(h * 0.05)
    img.alpha_composite(ic, (int(x), int(y - ic.height / 2))); d.text((x + ic.width + 12, y - f.size * 0.62), t, font=f, fill=(236, 214, 168))
    d.line((x - w * 0.12, y, x - 18, y), fill=(214, 168, 84), width=2); d.line((x + tot + 18, y, x + tot + w * 0.12, y), fill=(214, 168, 84), width=2)
for soort in ['reel-product', 'reel-overzicht', 'reel-einde', 'insta-overzicht', 'insta-product', 'pin-overzicht', 'pin-product']:
    src = SJ.pad(soort, 'kerst'); bron = Image.open(src).convert('RGB'); w, h = bron.size
    im, v = SJ.laad(soort, 'kerst', w, h)
    nieuw = achter(w, h)
    m = Image.new('L', (w, h), 0); dm = ImageDraw.Draw(m)
    e = int(w * (0.011 if soort == 'reel-einde' else 0.022))
    for k, l in v.items():
        for x in l:
            x0, y0, x1, y1 = x['box']
            if k == 'rond': dm.ellipse((x0 - e, y0 - e, x1 + e, y1 + e), fill=255)
            else: dm.rounded_rectangle((x0 - e, y0 - e, x1 + e, y1 + e), radius=int((y1 - y0) * 0.22) + e if k == 'goud' else int(w * 0.05), fill=255)
    m = m.filter(ImageFilter.GaussianBlur(3))
    nieuw.paste(im.convert('RGBA'), (0, 0), m)
    logo(nieuw)
    nieuw.convert('RGB').save(os.path.join(B, 'sjabloon-%s-normaal.png' % soort))
    print(soort, 'ok')
