# -*- coding: utf-8 -*-
"""Nova Style 6 – luxe social-media-ontwerp voor LeukeKeuze.

Donker marineblauw met gouden bokeh, witte productkaarten met dunne gouden rand,
gouden serif-koppen, crèmewitte tekst, gouden knoppen en het LeukeKeuze-logo onderaan.
Seizoenen: kerst, sint, valentijn, normaal (automatisch of via plan['seizoen']).

Wordt gebruikt door maak-promo.py. Een eigen achtergrondfoto per seizoen kan in
bestanden/achtergrond-<seizoen>.jpg (bijv. gemaakt met Nova, zonder tekst of producten);
anders wordt de achtergrond hier zelf getekend.
"""
import os, re, math, random, datetime, subprocess
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageChops

HIER = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HIER, '..', '..'))
B = os.path.join(HIER, 'bestanden')

NAVY = (11, 30, 55)            # #0B1E37
NAVY_DIEP = (6, 17, 33)
CREME = (250, 242, 225)
CREME_2 = (226, 216, 196)
GOUD = (217, 168, 72)
GOUD_LICHT = (255, 228, 150)
GOUD_DONKER = (184, 128, 40)
DONKER = (12, 26, 48)
WIT = (255, 255, 255)

# ---------------- lettertypes ----------------
_FONTS = {}


def font(soort, grootte):
    """soort: 'kop' (Playfair Display), 'Bold', 'Medium', 'Regular' (Poppins)."""
    grootte = max(8, int(grootte))
    sleutel = (soort, grootte)
    if sleutel in _FONTS:
        return _FONTS[sleutel]
    if soort == 'kop':
        kandidaten = [os.path.join(B, 'Playfair-600.ttf'),
                      os.path.join(REPO, 'assets', 'fonts', 'playfair-display-600-latin.woff2'),
                      os.path.join(B, 'Poppins-Bold.ttf')]
    else:
        kandidaten = [os.path.join(B, 'Poppins-%s.ttf' % soort)]
    for k in kandidaten:
        try:
            f = ImageFont.truetype(k, grootte)
            _FONTS[sleutel] = f
            return f
        except Exception:
            continue
    raise SystemExit('Lettertype niet gevonden: ' + soort)


def _emoji_font():
    for p in [r'C:\Windows\Fonts\seguiemj.ttf', '/usr/share/fonts/truetype/noto/NotoColorEmoji.ttf']:
        if os.path.exists(p):
            return p
    return None


EMOJI_RE = re.compile('[\U0001F000-\U0001FAFF\u2600-\u27BF\u2B00-\u2BFF\uFE0F\u200D]+')


def _emoji(e, hoogte):
    p = _emoji_font()
    if not p:
        return None
    try:
        g = 109 if 'Noto' in p else hoogte
        f = ImageFont.truetype(p, g)
        im = Image.new('RGBA', (g * 2 * max(1, len(e)), g * 2), (0, 0, 0, 0))
        ImageDraw.Draw(im).text((0, 0), e, font=f, embedded_color=True)
        bb = im.getbbox()
        if not bb:
            return None
        im = im.crop(bb)
        return im.resize((max(1, int(im.width * hoogte / im.height)), hoogte), Image.LANCZOS)
    except Exception:
        return None


def breedte(t, f):
    d = ImageDraw.Draw(Image.new('L', (4, 4)))
    w = 0
    for deel in re.split('(%s)' % EMOJI_RE.pattern, t):
        if not deel:
            continue
        w += (int(f.size * 1.1) + 6) if EMOJI_RE.fullmatch(deel) else d.textlength(deel, font=f)
    return w


def schrijf(img, xy, t, f, kleur):
    d = ImageDraw.Draw(img)
    x, y = xy
    for deel in re.split('(%s)' % EMOJI_RE.pattern, t):
        if not deel:
            continue
        if EMOJI_RE.fullmatch(deel):
            e = _emoji(deel.replace('\uFE0F', ''), int(f.size * 1.05))
            if e is not None:
                img.paste(e, (int(x) + 4, int(y + f.size * 0.18)), e)
                x += e.width + 6
            continue
        d.text((x, y), deel, font=f, fill=kleur)
        x += d.textlength(deel, font=f)


def regels(t, f, maxb):
    uit, nu = [], ''
    for w in t.split():
        test = (nu + ' ' + w).strip()
        if breedte(test, f) <= maxb or not nu:
            nu = test
        else:
            uit.append(nu)
            nu = w
    if nu:
        uit.append(nu)
    return uit


def tekstblok(W, t, f, kleur, maxb, afstand=1.16, schaduw=True):
    """Gecentreerde tekst (meerdere regels) als RGBA-laag."""
    rr = regels(t, f, maxb)
    lh = int(f.size * afstand)
    laag = Image.new('RGBA', (int(W), lh * len(rr) + int(f.size * 0.5)), (0, 0, 0, 0))
    for i, r in enumerate(rr):
        schrijf(laag, ((W - breedte(r, f)) / 2, i * lh), r, f, kleur)
    if schaduw:
        laag = _met_schaduw(laag, int(f.size * 0.08) + 2, 150)
    return laag


def _met_schaduw(laag, blur, sterkte, dy=None):
    a = laag.split()[3]
    sch = Image.new('RGBA', laag.size, (0, 0, 0, 0))
    m = a.filter(ImageFilter.GaussianBlur(blur)).point(lambda v: min(255, int(v * sterkte / 255)))
    sch.putalpha(m)
    uit = Image.new('RGBA', laag.size, (0, 0, 0, 0))
    uit.alpha_composite(sch, (0, dy if dy is not None else max(1, blur // 2)))
    uit.alpha_composite(laag)
    return uit


def _verloop(w, h, kleuren):
    """verticaal verloop over meerdere kleuren"""
    im = Image.new('RGB', (1, max(2, h)))
    n = len(kleuren) - 1
    for y in range(h):
        t = y / max(1, h - 1) * n
        i = min(n - 1, int(t)); f = t - i
        im.putpixel((0, y), tuple(int(a + (b - a) * f) for a, b in zip(kleuren[i], kleuren[i + 1])))
    return im.resize((max(1, w), h))


def goud_tekst(t, f, maxb, afstand=1.08):
    """Tekst met goudverloop, zachte gloed en schaduw."""
    rr = regels(t, f, maxb)
    lh = int(f.size * afstand)
    W = int(max(breedte(r, f) for r in rr) + f.size * 0.4)
    H = lh * len(rr) + int(f.size * 0.45)
    masker = Image.new('L', (W, H), 0)
    d = ImageDraw.Draw(masker)
    for i, r in enumerate(rr):
        d.text(((W - breedte(r, f)) / 2, i * lh), r, font=f, fill=255)
    goud = _verloop(W, H, [GOUD_LICHT, (240, 200, 110), GOUD, GOUD_DONKER, (230, 185, 95)]).convert('RGBA')
    goud.putalpha(masker)
    gloed = Image.new('RGBA', (W, H), (255, 200, 110, 0))
    gloed.putalpha(masker.filter(ImageFilter.GaussianBlur(f.size * 0.18)).point(lambda v: int(v * 0.45)))
    laag = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    laag.alpha_composite(gloed)
    laag.alpha_composite(goud)
    return _met_schaduw(laag, int(f.size * 0.06) + 2, 170)


def goud_knop(t, f, pad_x, pad_y, pijl=False):
    """Gouden pil-knop met donkerblauwe tekst en glans."""
    tt = t + ('  ›' if pijl else '')
    w = int(breedte(tt, f) + 2 * pad_x)
    h = int(f.size * 1.32 + 2 * pad_y)
    m = int(h * 0.35)
    laag = Image.new('RGBA', (w + 2 * m, h + 2 * m), (0, 0, 0, 0))
    vorm = Image.new('L', (w, h), 0)
    ImageDraw.Draw(vorm).rounded_rectangle((0, 0, w - 1, h - 1), radius=h // 2, fill=255)
    # gloed eromheen
    g = Image.new('RGBA', laag.size, (255, 200, 100, 0))
    gm = Image.new('L', laag.size, 0); gm.paste(vorm, (m, m))
    g.putalpha(gm.filter(ImageFilter.GaussianBlur(m * 0.6)).point(lambda v: int(v * 0.5)))
    laag.alpha_composite(g)
    vlak = _verloop(w, h, [(255, 232, 160), (240, 196, 100), (214, 158, 62)]).convert('RGBA')
    glans = Image.new('L', (w, h), 0)
    ImageDraw.Draw(glans).rounded_rectangle((h * 0.25, 3, w - h * 0.25, h * 0.42), radius=h // 4, fill=70)
    vlak = Image.composite(Image.new('RGBA', (w, h), (255, 255, 255, 255)), vlak, glans.filter(ImageFilter.GaussianBlur(3)))
    vlak.putalpha(vorm)
    rand = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    ImageDraw.Draw(rand).rounded_rectangle((0, 0, w - 1, h - 1), radius=h // 2, outline=(255, 240, 190, 200), width=max(1, h // 28))
    vlak.alpha_composite(rand)
    schrijf(vlak, (pad_x, pad_y + f.size * 0.02), tt, f, DONKER)
    laag.alpha_composite(vlak, (m, m))
    return laag


def donkere_pil(t, f, pad_x, pad_y, rand=GOUD):
    """Donkerblauwe pil met dunne gouden rand en crèmewitte tekst."""
    w = int(breedte(t, f) + 2 * pad_x)
    h = int(f.size * 1.32 + 2 * pad_y)
    laag = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(laag)
    d.rounded_rectangle((0, 0, w - 1, h - 1), radius=h // 2, fill=(9, 22, 42, 225), outline=rand + (255,), width=max(2, h // 26))
    schrijf(laag, (pad_x, pad_y + f.size * 0.02), t, f, CREME)
    return laag


# ---------------- seizoen en achtergrond ----------------

def seizoen(plan):
    s = (plan.get('seizoen') or '').lower()
    if s in ('kerst', 'sint', 'valentijn', 'normaal'):
        return s
    tekst = ' '.join(str(plan.get(k, '')) for k in ('thema', 'titel', 'subtitel', 'pov')).lower()
    if re.search(r'sinterklaas|sint\b|pakjes|schoen|surprise|pepernot', tekst):
        return 'sint'
    if 'kerst' in tekst:
        return 'kerst'
    if 'valentijn' in tekst:
        return 'valentijn'
    try:
        d = datetime.date.fromisoformat(plan.get('datum', ''))
    except Exception:
        d = datetime.date.today()
    if (d.month == 10 and d.day >= 20) or d.month in (11, 12):
        return 'kerst'
    if (d.month == 1 and d.day >= 20) or (d.month == 2 and d.day <= 14):
        return 'valentijn'
    return 'normaal'


_BG = {}


def _tak(laag, x, y, hoek, lengte, s):
    """Dennentak: steel met naaldjes, getekend op een RGBA-laag."""
    d = ImageDraw.Draw(laag)
    rnd = random.Random(int(x * 7 + y * 13 + lengte))
    stappen = int(lengte / (3 * s))
    for i in range(stappen):
        t = i / stappen
        px = x + math.cos(hoek) * lengte * t
        py = y + math.sin(hoek) * lengte * t + math.sin(t * 3) * lengte * 0.04
        nl = lengte * 0.2 * (1 - t * 0.55)
        for kant in (-1, 1):
            a = hoek + kant * (0.95 + rnd.uniform(-0.15, 0.15))
            kleur = rnd.choice([(18, 58, 40), (24, 72, 48), (30, 84, 56), (14, 46, 32)])
            d.line((px, py, px + math.cos(a) * nl, py + math.sin(a) * nl), fill=kleur + (255,), width=max(2, int(3 * s)))
            if rnd.random() < 0.18:   # sneeuw/licht op de naaldjes
                d.line((px + math.cos(a) * nl * 0.5, py + math.sin(a) * nl * 0.5, px + math.cos(a) * nl, py + math.sin(a) * nl),
                       fill=(200, 215, 205, 120), width=max(1, int(1.4 * s)))
    d.line((x, y, x + math.cos(hoek) * lengte, y + math.sin(hoek) * lengte), fill=(40, 30, 20, 255), width=max(2, int(3 * s)))


def _bal(laag, cx, cy, r, kleur, s):
    """Kerstbal met glans en draadje."""
    d = ImageDraw.Draw(laag)
    d.line((cx, cy - r * 3.2, cx, cy - r), fill=(210, 170, 90, 200), width=max(1, int(1.6 * s)))
    bal = Image.new('RGBA', (int(r * 2), int(r * 2)), (0, 0, 0, 0))
    m = Image.new('L', bal.size, 0); ImageDraw.Draw(m).ellipse((0, 0, bal.width - 1, bal.height - 1), fill=255)
    vlak = Image.new('RGBA', bal.size, kleur + (255,))
    licht = Image.new('L', bal.size, 0)
    ImageDraw.Draw(licht).ellipse((r * 0.35, r * 0.25, r * 1.0, r * 0.85), fill=200)
    vlak = Image.composite(Image.new('RGBA', bal.size, (255, 245, 220, 255)), vlak, licht.filter(ImageFilter.GaussianBlur(r * 0.25)))
    donker = Image.new('L', bal.size, 0)
    ImageDraw.Draw(donker).ellipse((r * 0.5, r * 0.7, r * 2.4, r * 2.6), fill=150)
    vlak = Image.composite(Image.new('RGBA', bal.size, (10, 10, 20, 255)), vlak, donker.filter(ImageFilter.GaussianBlur(r * 0.4)))
    vlak.putalpha(m)
    laag.alpha_composite(vlak, (int(cx - r), int(cy - r)))
    d.rectangle((cx - r * 0.25, cy - r * 1.12, cx + r * 0.25, cy - r * 0.9), fill=(200, 160, 80, 255))


def achtergrond(W, H, szn='kerst', zaad=1):
    sleutel = (W, H, szn, zaad % 7)
    if sleutel in _BG:
        return _BG[sleutel].copy()
    s = W / 1080
    eigen = os.path.join(B, 'achtergrond-%s.jpg' % szn)
    if os.path.exists(eigen):
        im = Image.open(eigen).convert('RGB')
        if H / W > 1.6:
            k = max(W / im.width, H / im.height)
            im = im.resize((int(im.width * k) + 1, int(im.height * k) + 1), Image.LANCZOS)
            im = im.crop(((im.width - W) // 2, (im.height - H) // 2, (im.width - W) // 2 + W, (im.height - H) // 2 + H))
        else:
            # lagere formaten: bovenste en onderste stuk (met takken) behouden, het rustige midden inkorten
            k = W / im.width
            im = im.resize((W, int(im.height * k)), Image.LANCZOS)
            boven = im.crop((0, 0, W, H // 2))
            onder = im.crop((0, im.height - (H - H // 2), W, im.height))
            doel = Image.new('RGB', (W, H))
            doel.paste(boven, (0, 0)); doel.paste(onder, (0, H // 2))
            naad = Image.new('L', (W, H), 0)
            ImageDraw.Draw(naad).rectangle((0, H // 2 - int(60 * W / 1080), W, H // 2 + int(60 * W / 1080)), fill=255)
            vaag = doel.filter(ImageFilter.GaussianBlur(int(40 * W / 1080)))
            im = Image.composite(vaag, doel, naad.filter(ImageFilter.GaussianBlur(int(30 * W / 1080))))
        donker = Image.new('L', (W, H), 0)
        dd = ImageDraw.Draw(donker)
        dd.ellipse((W * 0.08, H * 0.12, W * 0.92, H * 0.92), fill=120)
        dd.rectangle((0, H * 0.86, W, H), fill=150)
        im = Image.composite(Image.new('RGB', (W, H), NAVY_DIEP), im, donker.filter(ImageFilter.GaussianBlur(W * 0.08)))
        _BG[sleutel] = im
        return im.copy()
    rnd = random.Random(zaad % 7 + {'kerst': 11, 'sint': 23, 'valentijn': 37, 'normaal': 51}[szn])
    # basis: diep marineblauw met lichtere kern en donkere randen
    img = Image.new('RGB', (W, H), NAVY)
    kern = Image.new('L', (W, H), 0)
    ImageDraw.Draw(kern).ellipse((-W * 0.2, H * 0.12, W * 1.2, H * 0.88), fill=150)
    img = Image.composite(Image.new('RGB', (W, H), (21, 46, 80)), img, kern.filter(ImageFilter.GaussianBlur(W * 0.25)))
    rand = Image.new('L', (W, H), 255)
    ImageDraw.Draw(rand).ellipse((-W * 0.25, -H * 0.05, W * 1.25, H * 1.05), fill=0)
    img = Image.composite(Image.new('RGB', (W, H), NAVY_DIEP), img, rand.filter(ImageFilter.GaussianBlur(W * 0.18)))
    img = img.convert('RGBA')

    kleuren = {'kerst': [(255, 196, 110)] * 12 + [(255, 150, 100)],
               'sint': [(255, 196, 110)] * 8 + [(220, 55, 55), (235, 80, 65)],
               'valentijn': [(250, 220, 170)] * 5 + [(255, 140, 170), (240, 90, 120)],
               'normaal': [(255, 205, 120)]}[szn]
    # bokeh in lagen: groot en zacht, dan kleiner en scherper; vooral aan de randen en bovenin
    for laag_i, (aantal, rmin, rmax, blur, amax) in enumerate([(30, 50, 110, 26, 80), (45, 16, 42, 7, 130), (40, 4, 10, 1.5, 190)]):
        laag = Image.new('RGBA', (W, H), (0, 0, 0, 0))
        d = ImageDraw.Draw(laag)
        for _ in range(int(aantal * (W * H) / (1080 * 1920))):
            x = rnd.random() * W
            y = rnd.random() ** 1.15 * H
            rand_x = min(x, W - x) / (W / 2)            # 0 = rand, 1 = midden
            if rnd.random() < rand_x * 0.92:              # midden rustiger houden
                continue
            r = rnd.uniform(rmin, rmax) * s
            k = rnd.choice(kleuren)
            a = int(rnd.uniform(0.35, 1.0) * amax)
            if szn == 'valentijn' and laag_i == 1 and rnd.random() < 0.3:
                hx, hy = x, y   # hartje
                d.ellipse((hx - r, hy - r * 0.6, hx, hy + r * 0.3), fill=k + (a,))
                d.ellipse((hx, hy - r * 0.6, hx + r, hy + r * 0.3), fill=k + (a,))
                d.polygon([(hx - r * 0.98, hy - r * 0.05), (hx + r * 0.98, hy - r * 0.05), (hx, hy + r * 1.1)], fill=k + (a,))
            else:
                d.ellipse((x - r, y - r, x + r, y + r), fill=k + (a,))
                if laag_i == 1:
                    d.ellipse((x - r * 0.75, y - r * 0.75, x + r * 0.75, y + r * 0.75), outline=(255, 240, 210, int(a * 0.5)), width=max(1, int(r * 0.12)))
        img.alpha_composite(laag.filter(ImageFilter.GaussianBlur(blur * s)))
    # fonkelsterretjes
    d = ImageDraw.Draw(img)
    for _ in range(int(14 * W * H / (1080 * 1920))):
        x, y = rnd.random() * W, rnd.random() * H * 0.9
        if min(x, W - x) > W * 0.3 and rnd.random() < 0.7:
            continue
        L = rnd.uniform(10, 26) * s
        c = (255, 236, 190, 230)
        d.line((x - L, y, x + L, y), fill=c, width=max(1, int(1.6 * s)))
        d.line((x, y - L, x, y + L), fill=c, width=max(1, int(1.6 * s)))
        d.ellipse((x - 2.5 * s, y - 2.5 * s, x + 2.5 * s, y + 2.5 * s), fill=(255, 250, 230, 255))
    if szn == 'kerst':
        tak = Image.new('RGBA', (W, H), (0, 0, 0, 0))
        for (x, y, a, L) in [(-30, 10, 0.45, 380), (-40, 90, 0.25, 320), (-30, 190, 0.08, 230),
                             (W / s + 30, 20, math.pi - 0.45, 360), (W / s + 40, 110, math.pi - 0.22, 300), (W / s + 30, 210, math.pi - 0.05, 210),
                             (-30, H / s - 20, -0.4, 340), (-30, H / s - 110, -0.15, 230),
                             (W / s + 30, H / s - 20, math.pi + 0.4, 330), (W / s + 30, H / s - 110, math.pi + 0.15, 220)]:
            _tak(tak, x * s, y * s, a, L * s, s)
        tak = tak.filter(ImageFilter.GaussianBlur(0.8 * s))
        img.alpha_composite(tak)
        _bal(img, 120 * s, 210 * s, 34 * s, (180, 30, 40), s)
        _bal(img, W - 110 * s, 230 * s, 30 * s, (200, 150, 60), s)
        _bal(img, W - 190 * s, 150 * s, 22 * s, (20, 40, 80), s)
    elif szn == 'sint':
        gloed = Image.new('RGBA', (W, H), (0, 0, 0, 0))
        ImageDraw.Draw(gloed).ellipse((-W * 0.3, H * 0.85, W * 1.3, H * 1.25), fill=(170, 30, 40, 70))
        img.alpha_composite(gloed.filter(ImageFilter.GaussianBlur(W * 0.12)))
    img = img.convert('RGB')
    _BG[sleutel] = img
    return img.copy()


# ---------------- bouwstenen ----------------

def kaart_laag(foto, bw, bh, zoom=1.0, marge=0.07):
    """Witte productkaart met dunne gouden rand en zachte schaduw. Geeft (laag, rand) terug."""
    bw, bh = int(bw), int(bh)
    r = int(min(bw, bh) * 0.06)
    m = int(min(bw, bh) * 0.08)
    laag = Image.new('RGBA', (bw + 2 * m, bh + 2 * m), (0, 0, 0, 0))
    sch = Image.new('L', laag.size, 0)
    ImageDraw.Draw(sch).rounded_rectangle((m, m + m * 0.35, m + bw, m + bh + m * 0.35), radius=r, fill=170)
    zw = Image.new('RGBA', laag.size, (0, 0, 0, 255)); zw.putalpha(sch.filter(ImageFilter.GaussianBlur(m * 0.45)))
    laag.alpha_composite(zw)
    gl = Image.new('L', laag.size, 0)
    ImageDraw.Draw(gl).rounded_rectangle((m, m, m + bw, m + bh), radius=r, fill=170)
    gg = Image.new('RGBA', laag.size, (255, 200, 110, 255)); gg.putalpha(gl.filter(ImageFilter.GaussianBlur(m * 0.3)))
    laag.alpha_composite(gg)
    vlak = Image.new('RGB', (bw, bh), WIT)
    if foto is not None:
        p = int(min(bw, bh) * marge)
        f = foto.copy()
        f.thumbnail((bw - 2 * p, bh - 2 * p), Image.LANCZOS)
        if zoom != 1:
            f = f.resize((int(f.width * zoom), int(f.height * zoom)), Image.BILINEAR)
        vlak.paste(f, ((bw - f.width) // 2, (bh - f.height) // 2))
    vm = Image.new('L', (bw, bh), 0)
    ImageDraw.Draw(vm).rounded_rectangle((0, 0, bw - 1, bh - 1), radius=r, fill=255)
    v = vlak.convert('RGBA'); v.putalpha(vm)
    rb = max(3, int(min(bw, bh) * 0.014))
    rand = _verloop(bw, bh, [(255, 226, 140), (236, 176, 70), (255, 214, 120), (200, 140, 50)]).convert('RGBA')
    rm = Image.new('L', (bw, bh), 0)
    ImageDraw.Draw(rm).rounded_rectangle((0, 0, bw - 1, bh - 1), radius=r, outline=255, width=rb)
    rand.putalpha(rm)
    v.alpha_composite(rand)
    laag.alpha_composite(v, (m, m))
    return laag, m


def plak_kaart(img, foto, x, y, bw, bh, zoom=1.0):
    laag, m = kaart_laag(foto, bw, bh, zoom)
    img.paste(laag, (int(x - m), int(y - m)), laag)


def logo_voet(W, s):
    """Gouden cadeau-icoon + leukekeuze.nl met gouden lijntjes ernaast (zoals Nova-sjabloon)."""
    ico = cadeau_icoon(int(62 * s))
    f = font('Bold', 46 * s)
    tt = 'leukekeuze.nl'
    tw = breedte(tt, f)
    lijn = int(110 * s)
    gw = ico.width + int(14 * s) + tw
    Wl = int(gw + 2 * (lijn + 26 * s))
    laag = Image.new('RGBA', (Wl, ico.height + 4), (0, 0, 0, 0))
    x0 = (Wl - gw) / 2
    laag.alpha_composite(ico, (int(x0), 0))
    schrijf(laag, (x0 + ico.width + 14 * s, ico.height / 2 - f.size * 0.62), tt, f, (255, 250, 240))
    d = ImageDraw.Draw(laag)
    ym = ico.height * 0.6
    d.line((0, ym, lijn, ym), fill=(232, 182, 84, 220), width=max(2, int(3 * s)))
    d.line((Wl - lijn, ym, Wl, ym), fill=(232, 182, 84, 220), width=max(2, int(3 * s)))
    achter = Image.new('RGBA', (laag.width + int(80 * s), laag.height + int(50 * s)), (0, 0, 0, 0))
    am = Image.new('L', achter.size, 0)
    ImageDraw.Draw(am).rounded_rectangle((int(30 * s), int(18 * s), achter.width - int(30 * s), achter.height - int(18 * s)), radius=int(40 * s), fill=170)
    zw = Image.new('RGBA', achter.size, NAVY_DIEP + (255,)); zw.putalpha(am.filter(ImageFilter.GaussianBlur(18 * s)))
    achter.alpha_composite(zw)
    achter.alpha_composite(_met_schaduw(laag, int(5 * s), 160), (int(40 * s), int(25 * s)))
    return achter

def cadeau_icoon(h, kleur=None):
    """Gouden cadeau-icoon (lijntekening) zoals in het Nova-sjabloon."""
    k = kleur or (240, 190, 90, 255)
    w = int(h * 1.05)
    lw = max(2, int(h * 0.07))
    im = Image.new('RGBA', (w + 2 * lw, h + 2 * lw), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    o = lw
    dek_y = o + h * 0.32
    d.rounded_rectangle((o, dek_y, o + w, dek_y + h * 0.2), radius=int(lw), outline=k, width=lw)
    d.rounded_rectangle((o + w * 0.08, dek_y + h * 0.2, o + w * 0.92, o + h), radius=int(lw), outline=k, width=lw)
    d.line((o + w / 2, dek_y, o + w / 2, o + h), fill=k, width=lw)
    # strik
    d.ellipse((o + w * 0.22, o + h * 0.04, o + w * 0.5, o + h * 0.34), outline=k, width=lw)
    d.ellipse((o + w * 0.5, o + h * 0.04, o + w * 0.78, o + h * 0.34), outline=k, width=lw)
    gl = Image.new('RGBA', im.size, (255, 200, 110, 0))
    gl.putalpha(im.split()[3].filter(ImageFilter.GaussianBlur(lw * 1.4)).point(lambda v: int(v * 0.6)))
    uit = Image.new('RGBA', im.size, (0, 0, 0, 0))
    uit.alpha_composite(gl); uit.alpha_composite(im)
    return uit


def icoon_met_lijnen(W, s, h=None):
    ico = cadeau_icoon(int(h or 86 * s))
    lijn = int(150 * s)
    laag = Image.new('RGBA', (ico.width + 2 * (lijn + int(26 * s)), ico.height), (0, 0, 0, 0))
    laag.alpha_composite(ico, ((laag.width - ico.width) // 2, 0))
    d = ImageDraw.Draw(laag)
    ym = ico.height * 0.62
    d.line((0, ym, lijn, ym), fill=(232, 182, 84, 230), width=max(2, int(3 * s)))
    d.line((laag.width - lijn, ym, laag.width, ym), fill=(232, 182, 84, 230), width=max(2, int(3 * s)))
    return laag


def creme_vak(goud_deel, rest, W, s, maxb, g1=None, klein=''):
    """Crèmekleurig titelvak met gouden rand en gloed; eerste deel in donkergoud, rest in marine."""
    bw = int(maxb)
    binnen = bw - int(70 * s)
    g1 = int(g1 or 96 * s)
    while goud_deel and breedte(goud_deel, font('kop', g1)) > binnen and g1 > 24:
        g1 -= 2
    g2 = int(g1 * 0.7)
    r2 = regels(rest, font('kop', g2), binnen) if rest else []
    while rest and len(r2) > 2 and g2 > 18:
        g2 -= 2; r2 = regels(rest, font('kop', g2), binnen)
    fk = font('Medium', max(14, int(min(g2 * 0.55, 40 * s))))
    rk = regels(klein, fk, binnen) if klein else []
    hoogte = int((g1 * 1.08 if goud_deel else 0) + len(r2) * g2 * 1.1 + len(rk) * fk.size * 1.25 + 46 * s)
    m = int(26 * s)
    laag = Image.new('RGBA', (bw + 2 * m, hoogte + 2 * m), (0, 0, 0, 0))
    vorm = Image.new('L', laag.size, 0)
    rr = int(min(hoogte * 0.32, 60 * s))
    ImageDraw.Draw(vorm).rounded_rectangle((m, m, m + bw, m + hoogte), radius=rr, fill=255)
    gl = Image.new('RGBA', laag.size, (255, 196, 100, 255)); gl.putalpha(vorm.filter(ImageFilter.GaussianBlur(m * 0.6)).point(lambda v: int(v * 0.85)))
    laag.alpha_composite(gl)
    vlak = _verloop(bw, hoogte, [(255, 250, 236), (250, 236, 206), (240, 214, 168)]).convert('RGBA')
    vm = Image.new('L', (bw, hoogte), 0); ImageDraw.Draw(vm).rounded_rectangle((0, 0, bw - 1, hoogte - 1), radius=rr, fill=255)
    vlak.putalpha(vm)
    rand = _verloop(bw, hoogte, [(255, 226, 140), (226, 166, 62), (255, 214, 120)]).convert('RGBA')
    rm = Image.new('L', (bw, hoogte), 0); ImageDraw.Draw(rm).rounded_rectangle((0, 0, bw - 1, hoogte - 1), radius=rr, outline=255, width=max(3, int(5 * s)))
    rand.putalpha(rm); vlak.alpha_composite(rand)
    y = 22 * s
    if goud_deel:
        f = font('kop', g1)
        schrijf(vlak, ((bw - breedte(goud_deel, f)) / 2, y - g1 * 0.1), goud_deel, f, (176, 120, 34))
        y += g1 * 1.08
    for r in r2:
        f = font('kop', g2)
        schrijf(vlak, ((bw - breedte(r, f)) / 2, y - g2 * 0.12), r, f, DONKER)
        y += g2 * 1.1
    for r in rk:
        schrijf(vlak, ((bw - breedte(r, fk)) / 2, y), r, fk, (92, 80, 62))
        y += fk.size * 1.25
    laag.alpha_composite(vlak, (m, m))
    return laag


def plak(img, laag, cx, y):
    """Laag horizontaal gecentreerd op cx plakken met bovenkant op y; geeft onderkant terug."""
    img.paste(laag, (int(cx - laag.width / 2), int(y)), laag)
    return y + laag.height


def veilig(W, H):
    """(boven, onder) marge. Bij 9:16 houden we rekening met de knoppen en tekst van TikTok/Reels."""
    s = W / 1080
    if H / W > 1.6:
        return int(150 * s), int(280 * s)
    return int(50 * s), int(30 * s)


def titel_split(plan, sleutel='titel'):
    titel = (plan.get(sleutel) or plan.get('titel', '')).strip()
    g = plan.get(sleutel + '_goud') or plan.get('titel_goud')
    w = plan.get(sleutel + '_wit') or plan.get('titel_wit')
    if not g:
        ww = titel.split()
        g, w = (ww[0], ' '.join(ww[1:])) if len(ww) > 1 else (titel, '')
    return g, w or ''


def titel_lagen(plan, W, s, maxb, max_h):
    g, w = titel_split(plan)
    for g1 in range(int(100 * s), int(40 * s), -int(4 * s) or -1):
        laag = creme_vak(g, w, W, s, maxb, g1)
        if laag.height <= max_h:
            return [laag]
    return [creme_vak(g, w, W, s, maxb, int(40 * s))]

def ondertitel_lint(t, W, s, maxb):
    f = font('kop', 40 * s)
    while breedte(t, f) > maxb - 80 * s and f.size > 20:
        f = font('kop', f.size - 2)
    return goud_knop(t, f, 40 * s, 10 * s)


# ---------------- slides ----------------

def _knoptekst(plan, n):
    return plan.get('knop') or ('Bekijk alle %d ideeën' % n if n else 'Bekijk ze op leukekeuze.nl')


def cover(W, H, plan, fotos, zaad, met_pov=True, knop=True, n_ideeen=None):
    szn = seizoen(plan)
    img = achtergrond(W, H, szn, zaad).convert('RGBA')
    s = W / 1080
    boven, onder = veilig(W, H)
    maxb = W * 0.82
    y = boven + int(6 * s)
    y = plak(img, icoon_met_lijnen(W, s, 70 * s), W / 2, y) - int(4 * s)
    for laag in titel_lagen(plan, W, s, maxb, H * (0.16 if H / W > 1.6 else 0.19)):
        y = plak(img, laag, W / 2, y) - int(16 * s)
    if plan.get('subtitel'):
        y = plak(img, ondertitel_lint(plan['subtitel'], W, s, maxb), W / 2, y + int(4 * s))
    if met_pov and plan.get('pov'):
        f = font('Bold', 40 * s)
        while breedte(plan['pov'], f) > W * 0.84 and f.size > 18:
            f = font('Bold', f.size - 2)
        y = plak(img, donkere_pil(plan['pov'], f, 32 * s, 12 * s), W / 2, y + int(14 * s))
    voet = logo_voet(W, s)
    knoplaag = goud_knop(_knoptekst(plan, n_ideeen), font('Bold', 42 * s), 46 * s, 12 * s, pijl=True) if knop else None
    onderkant = H - onder - voet.height - int(26 * s) - (knoplaag.height if knoplaag else 0)
    gap = int(26 * s)
    rest_boven = y + int(30 * s)
    kant = min((W - 2 * int(70 * s) - gap) / 2, (onderkant - rest_boven - gap) / 2)
    gx = (W - 2 * kant - gap) / 2
    gy = rest_boven + max(0, ((onderkant - rest_boven) - (2 * kant + gap)) / 2)
    for i, f in enumerate(fotos[:4]):
        plak_kaart(img, f, gx + (i % 2) * (kant + gap), gy + (i // 2) * (kant + gap), kant, kant)
    yk = gy + 2 * kant + gap + int(4 * s)
    if knoplaag:
        yk = plak(img, knoplaag, W / 2, yk - int(14 * s)) - int(14 * s)
    plak(img, voet, W / 2, H - onder - voet.height)
    return img.convert('RGB')


def product(W, H, p, nr, totaal, zaad, plan=None, teller=True):
    szn = seizoen(plan or {})
    img = achtergrond(W, H, szn, zaad).convert('RGBA')
    s = W / 1080
    boven, onder = veilig(W, H)
    groot = H / W > 1.6
    voet = logo_voet(W, s)
    naam = creme_vak('', p['naam'], W, s, W * 0.82, (78 if groot else 66) * s / 0.7, p.get('regel', ''))
    regel = None
    prijs = goud_knop('€ ' + ('%.2f' % p['prijs']).replace('.', ','), font('Bold', (52 if groot else 44) * s), 34 * s, 8 * s)
    tekst_h = naam.height - int(20 * s) + (regel.height if regel else 0) + prijs.height
    if teller and totaal > 1:
        nrl = goud_knop('#%d' % nr, font('kop', 52 * s), 30 * s, 2 * s)
        plak(img, nrl, W / 2, boven - int(10 * s))
        top = boven + nrl.height
    else:
        top = boven + int(20 * s)
    bodem = H - onder - voet.height - int(24 * s)
    kant = min(W - 2 * int(90 * s), bodem - top - tekst_h - int(30 * s))
    y0 = top + max(0, (bodem - top - kant - tekst_h - int(30 * s)) // 2)
    plak_kaart(img, p['foto'], (W - kant) / 2, y0, kant, kant)
    y = y0 + kant + int(14 * s)
    y = plak(img, naam, W / 2, y) - int(18 * s)
    if regel:
        y = plak(img, regel, W / 2, y + int(4 * s))
    plak(img, prijs, W / 2, y)
    plak(img, voet, W / 2, H - onder - voet.height)
    return img.convert('RGB')

def einde(W, H, plan, zaad, n=None):
    szn = seizoen(plan)
    img = achtergrond(W, H, szn, zaad).convert('RGBA')
    s = W / 1080
    boven, onder = veilig(W, H)
    ico = icoon_met_lijnen(W, s, 150 * s)
    vak = creme_vak('', plan.get('eindvraag', 'Nog meer cadeau-ideeën?'), W, s, W * 0.82, 74 * s / 0.7)
    knop = goud_knop('Kijk op leukekeuze.nl', font('Bold', 46 * s), 46 * s, 12 * s, pijl=True)
    zin = donkere_pil('Sla dit bericht op voor je cadeaulijstje', font('Medium', 34 * s), 30 * s, 10 * s)
    voet = logo_voet(W, s)
    blok = ico.height + vak.height + knop.height + zin.height + int(60 * s)
    y = boven + max(0, (H - boven - onder - voet.height - blok) / 2)
    y = plak(img, ico, W / 2, y) + int(10 * s)
    y = plak(img, vak, W / 2, y) + int(6 * s)
    y = plak(img, knop, W / 2, y) + int(10 * s)
    plak(img, zin, W / 2, y)
    plak(img, voet, W / 2, H - onder - voet.height)
    return img.convert('RGB')

def pin_overzicht(W, H, plan, fotos, zaad, n_ideeen=None):
    sj = pin_sjabloon('pin-%s' % seizoen(plan), plan, fotos, n_ideeen, W, H)
    if sj is not None:
        return sj
    p = dict(plan)
    p['titel'] = plan.get('pin_titel', plan['titel'])
    p['subtitel'] = plan.get('pin_sub', plan.get('subtitel', ''))
    p.pop('titel_goud', None); p.pop('titel_wit', None)
    if plan.get('pin_titel_goud'):
        p['titel_goud'], p['titel_wit'] = plan['pin_titel_goud'], plan.get('pin_titel_wit', '')
    return cover(W, H, p, fotos, zaad, met_pov=False, knop=True, n_ideeen=n_ideeen)


# ---------------- Nova-sjablonen (vaste vakken) ----------------
# Sjabloon van Nova met lege vakken. Coördinaten in pixels van het sjabloonbestand (1024 x 1536).
SJABLONEN = {
    'pin-kerst': dict(bestand='sjabloon-pin-kerst.png', titel=(124, 149, 901, 292), sub=(260, 320, 757, 394),
                      vakken=[(99, 439, 495, 794), (532, 439, 932, 793), (99, 823, 494, 1180), (526, 824, 926, 1178)],
                      knop=(182, 1244, 760, 1344)),
}


def _zet_midden(img, box, t, soort, grootte, kleur, max_regels=1):
    x0, y0, x1, y1 = box
    w, h = x1 - x0 - 40, y1 - y0 - 16
    g = int(grootte)
    while g > 14:
        f = font(soort, g)
        rr = regels(t, f, w)
        if len(rr) <= max_regels and len(rr) * g * 1.12 <= h:
            break
        g -= 2
    lh = int(g * 1.1)
    y = y0 + (y1 - y0 - lh * len(rr)) / 2 - g * 0.12
    for r in rr:
        schrijf(img, (x0 + (x1 - x0 - breedte(r, f)) / 2, y), r, f, kleur)
        y += lh


def pin_sjabloon(naam, plan, fotos, n_ideeen=None, W=1000, H=1500):
    """Vult een Nova-sjabloon. Geeft None als het sjabloon er niet is."""
    sj = SJABLONEN.get(naam)
    if not sj or len(fotos) < 4:
        return None
    pad = os.path.join(B, sj['bestand'])
    if not os.path.exists(pad):
        return None
    img = Image.open(pad).convert('RGBA')
    titel = plan.get('pin_titel') or plan.get('titel', '')
    goud_deel = plan.get('pin_titel_goud') or plan.get('titel_goud')
    wit_deel = plan.get('pin_titel_wit') or plan.get('titel_wit')
    if not goud_deel:
        w = titel.split()
        goud_deel, wit_deel = (w[0], ' '.join(w[1:])) if len(w) > 1 else (titel, '')
    x0, y0, x1, y1 = sj['titel']
    bw = x1 - x0 - 60
    g1 = 80
    while breedte(goud_deel, font('kop', g1)) > bw and g1 > 30:
        g1 -= 2
    g2 = int(g1 * 0.7)
    while wit_deel and breedte(wit_deel, font('kop', g2)) > bw and g2 > 20:
        g2 -= 2
    tot = g1 * 1.05 + (g2 * 1.1 if wit_deel else 0)
    y = y0 + (y1 - y0 - tot) / 2 - 8
    schrijf(img, (x0 + (x1 - x0 - breedte(goud_deel, font('kop', g1))) / 2, y), goud_deel, font('kop', g1), (176, 120, 34))
    if wit_deel:
        y += g1 * 1.05
        schrijf(img, (x0 + (x1 - x0 - breedte(wit_deel, font('kop', g2))) / 2, y), wit_deel, font('kop', g2), DONKER)
    sub = plan.get('pin_sub') or plan.get('subtitel', '')
    if sub:
        _zet_midden(img, sj['sub'], sub, 'kop', 40, DONKER)
    for f, (a, b, c, d) in zip(fotos, sj['vakken']):
        bw, bh = c - a, d - b
        p = int(min(bw, bh) * 0.08)
        k = f.copy(); k.thumbnail((bw - 2 * p, bh - 2 * p), Image.LANCZOS)
        img.paste(k, (a + (bw - k.width) // 2, b + (bh - k.height) // 2))
    _zet_midden(img, sj['knop'], _knoptekst(plan, n_ideeen), 'Bold', 46, DONKER)
    return img.convert('RGB').resize((W, H), Image.LANCZOS)


# ---------------- reel (spanning: raadsel -> aftellen -> nummer 1) ----------------

def _ease(x):
    x = max(0.0, min(1.0, x))
    return 1 - (1 - x) ** 3


def _pop(x):
    if x <= 0:
        return 0.0
    if x >= 1:
        return 1.0
    if x < 0.6:
        return 1.15 * _ease(x / 0.6)
    return 1.15 - 0.15 * _ease((x - 0.6) / 0.4)


def _plak_schaal(doek, laag, cx, cy, sc, alpha=1.0):
    if sc <= 0.01 or alpha <= 0.01:
        return
    w, h = max(1, int(laag.width * sc)), max(1, int(laag.height * sc))
    l = laag.resize((w, h), Image.BILINEAR) if (w, h) != laag.size else laag
    if alpha < 1:
        l = l.copy(); l.putalpha(l.split()[3].point(lambda v: int(v * alpha)))
    doek.paste(l, (int(cx - w / 2), int(cy - h / 2)), l)


def maak_reel(plan, ps, uit, ff, W=1080, H=1920, fps=30):
    zaad = int(plan['datum'].replace('-', ''))
    szn = seizoen(plan)
    s = W / 1080
    n = len(ps)
    boven, onder = veilig(W, H)
    T_HOOK, T_PROD, T_TROM, T_EEN, T_EIND = 2.0, 2.2, 1.1, 3.0, 2.8
    segs = [('hook', T_HOOK)]
    for i in range(n - 1, -1, -1):
        if i == 0:
            segs.append(('trom', T_TROM))
            segs.append(('prod', T_EEN, 0))
        else:
            segs.append(('prod', T_PROD, i))
    segs.append(('eind', T_EIND))
    totaal = sum(x[1] for x in segs)
    N = int(round(totaal * fps))

    bg = achtergrond(W, H, szn, zaad).convert('RGBA')
    voet = logo_voet(W, s)
    plak(bg, voet, W / 2, H - onder - voet.height)
    bg_rgb = bg.convert('RGB')

    # opening: wazige nummer 1 met vraagteken in een gouden kader
    k = int(W * 0.7)
    top = ps[0]['foto'].copy(); top.thumbnail((k, k), Image.LANCZOS)
    vlak = Image.new('RGB', (k, k), WIT); vlak.paste(top, ((k - top.width) // 2, (k - top.height) // 2))
    vlak = vlak.filter(ImageFilter.GaussianBlur(int(30 * s)))
    from PIL import ImageEnhance
    vlak = ImageEnhance.Brightness(vlak).enhance(0.5)
    raad, rm = kaart_laag(vlak, k, k, marge=0)
    fq = font('kop', 300 * s)
    vq = goud_tekst('?', fq, k)
    raad.alpha_composite(vq, ((raad.width - vq.width) // 2, (raad.height - vq.height) // 2))
    hook = plan.get('hook') or 'Wacht tot je nummer 1 ziet 👀'
    fh = font('Bold', 46 * s)
    while breedte(hook, fh) > W * 0.8 and fh.size > 20:
        fh = font('Bold', fh.size - 2)
    l_hook = goud_knop(hook, fh, 34 * s, 12 * s)
    l_pov = creme_vak('', plan.get('pov', ''), W, s, W * 0.84, 58 * s / 0.7) if plan.get('pov') else None

    # producten
    fn, fr = font('kop', 70 * s), font('Regular', 42 * s)
    lagen = {}
    for i, p in enumerate(ps):
        naam = creme_vak('', p['naam'], W, s, W * 0.82, 78 * s / 0.7, p.get('regel', ''))
        regel = None
        prijs = goud_knop('€ ' + ('%.2f' % p['prijs']).replace('.', ','), font('Bold', 52 * s), 34 * s, 8 * s)
        nr = goud_knop('#%d' % (i + 1), font('kop', 60 * s if i else 72 * s), 34 * s, 2 * s)
        tekst_h = naam.height - int(20 * s) + (regel.height if regel else 0) + prijs.height
        top_y = boven + nr.height
        bodem = H - onder - voet.height - int(30 * s)
        kant = int(min(W - 2 * int(90 * s), bodem - top_y - tekst_h - int(40 * s)))
        y0 = top_y + max(0, (bodem - top_y - kant - tekst_h - int(40 * s)) // 2)
        lagen[i] = dict(kant=kant, y0=y0, naam=naam, regel=regel, prijs=prijs, nr=nr, foto=p['foto'])
    trom = creme_vak('En nummer 1', 'is…', W, s, W * 0.78, 110 * s)
    eind = einde(W, H, plan, zaad + 99, n).convert('RGBA')
    vtxt = 'Welke kies jij? Zet 1 t/m %d in de reacties 👇' % n
    fv = font('Bold', 40 * s)
    while breedte(vtxt, fv) > W * 0.8 and fv.size > 18:
        fv = font('Bold', fv.size - 2)
    vraag = donkere_pil(vtxt, fv, 30 * s, 14 * s)

    args = [ff, '-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', '%dx%d' % (W, H), '-r', str(fps), '-i', '-',
            '-f', 'lavfi', '-t', '%.2f' % totaal, '-i', 'anullsrc=r=44100:cl=stereo',
            '-map', '0:v', '-map', '1:a', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '21', '-pix_fmt', 'yuv420p',
            '-c:a', 'aac', '-b:a', '96k', '-shortest', '-movflags', '+faststart', uit]
    proc = subprocess.Popen(args, stdin=subprocess.PIPE)
    kaart_cache = {}
    try:
        for fi in range(N):
            t = fi / fps
            acc = 0.0
            for seg in segs:
                if t < acc + seg[1] or seg is segs[-1]:
                    break
                acc += seg[1]
            lt = t - acc
            soort = seg[0]
            if soort == 'hook':
                fr_ = bg.copy()
                if l_pov is not None:
                    _plak_schaal(fr_, l_pov, W / 2, boven + l_pov.height / 2 + 10 * s, _pop(lt / 0.3))
                puls = 1 + 0.02 * math.sin(lt * 7)
                _plak_schaal(fr_, raad, W / 2, H * 0.47, (0.85 + 0.15 * _ease(lt / 0.3)) * puls)
                _plak_schaal(fr_, l_hook, W / 2, H * 0.47 + raad.height / 2 + l_hook.height / 2 + 10 * s, _pop((lt - 0.08) / 0.3))
            elif soort == 'trom':
                fr_ = bg.copy()
                _plak_schaal(fr_, trom, W / 2, H * 0.42, _pop(lt / 0.3) * (1 + 0.04 * math.sin(lt * 14)))
            elif soort == 'prod':
                i = seg[2]; L = lagen[i]; dur = seg[1]
                fr_ = bg.copy()
                kant = L['kant']
                z = round(1.0 + 0.08 * (lt / dur), 3)
                kl, km = kaart_laag(L['foto'], kant, kant, z)
                if i == 0:
                    sc = 0.6 + 0.4 * _ease(lt / 0.35)
                    _plak_schaal(fr_, kl, W / 2, L['y0'] + kant / 2, sc)
                else:
                    x_eind = (W - kant) / 2
                    x = x_eind + (W - x_eind) * (1 - _ease(lt / 0.25))
                    fr_.paste(kl, (int(x - km), int(L['y0'] - km)), kl)
                _plak_schaal(fr_, L['nr'], W / 2, boven + L['nr'].height / 2, _pop(lt / 0.3))
                ty = L['y0'] + kant + int(14 * s)
                a = _ease((lt - 0.1) / 0.25)
                if a > 0:
                    _plak_schaal(fr_, L['naam'], W / 2, ty + L['naam'].height / 2 + 20 * s * (1 - a), 1.0, a)
                    if L['regel']:
                        _plak_schaal(fr_, L['regel'], W / 2, ty + L['naam'].height - 14 * s + L['regel'].height / 2, 1.0, a)
                pp = _pop((lt - 0.35) / 0.3)
                if pp > 0:
                    yp = ty + L['naam'].height - 18 * s + (L['regel'].height + 4 * s if L['regel'] else 0)
                    _plak_schaal(fr_, L['prijs'], W / 2, yp + L['prijs'].height / 2, pp)
            else:
                fr_ = Image.blend(bg, eind, _ease(lt / 0.3)) if lt < 0.3 else eind.copy()
                v = _pop((lt - 0.4) / 0.4)
                if v > 0:
                    puls = 1 + 0.03 * math.sin(max(0, lt - 0.8) * 6) if lt > 0.8 else 1
                    _plak_schaal(fr_, vraag, W / 2, H - onder - voet.height - vraag.height - 40 * s, v * puls)
            dd = ImageDraw.Draw(fr_)
            dd.rectangle((0, H - int(10 * s), int(W * (t / totaal)), H), fill=GOUD)
            proc.stdin.write(fr_.convert('RGB').tobytes())
        proc.stdin.close()
        proc.wait()
    except Exception:
        proc.kill()
        raise
    return proc.returncode == 0
