# -*- coding: utf-8 -*-
"""LeukeKeuze promo-maker.

Maakt van een plan (JSON) alle promo-bestanden voor één dag:
  LEUKEKEUZE.NL\\tiktok\\<datum>     9:16 foto's + reel (mp4) + tekst
  LEUKEKEUZE.NL\\instagram\\<datum>  4:5 carrousel + reel (mp4) + tekst
  LEUKEKEUZE.NL\\facebook\\<datum>   hoofdfoto + album + reel (mp4) + tekst
  LEUKEKEUZE.NL\\printerest\\<datum> pins 2:3 + tekst
en ruimt oudere datum-mappen op.

Gebruik:  python maak-promo.py plan.json [--uit <map LEUKEKEUZE.NL>] [--geen-opruimen]
"""
import json, os, re, sys, shutil, subprocess, random, datetime, tempfile, math

from PIL import Image, ImageDraw, ImageFont

HIER = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HIER, '..', '..'))
B = os.path.join(HIER, 'bestanden')

NAVY_BOVEN = (15, 38, 69)
NAVY_ONDER = (25, 55, 91)
ORANJE = (247, 148, 29)
WIT = (255, 255, 255)
DONKER = (20, 33, 61)
KAART = (249, 248, 244)

KANALEN = ['tiktok', 'instagram', 'facebook', 'printerest']
MAANDEN = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus',
           'september', 'oktober', 'november', 'december']
DAGEN = ['maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag', 'zondag']


def font(gewicht, grootte):
    return ImageFont.truetype(os.path.join(B, 'Poppins-%s.ttf' % gewicht), grootte)


def emoji_font():
    for p in [r'C:\Windows\Fonts\seguiemj.ttf', '/usr/share/fonts/truetype/noto/NotoColorEmoji.ttf']:
        if os.path.exists(p):
            return p
    return None


EMOJI_RE = re.compile('[\U0001F000-\U0001FAFF\u2600-\u27BF\u2B00-\u2BFF\uFE0F\u200D]+')


def emoji_plaatje(e, hoogte):
    p = emoji_font()
    if not p:
        return None
    try:
        grootte = 109 if 'Noto' in p else hoogte
        f = ImageFont.truetype(p, grootte)
        im = Image.new('RGBA', (grootte * 2 * max(1, len(e)), grootte * 2), (0, 0, 0, 0))
        ImageDraw.Draw(im).text((0, 0), e, font=f, embedded_color=True)
        bb = im.getbbox()
        if not bb:
            return None
        im = im.crop(bb)
        return im.resize((max(1, int(im.width * hoogte / im.height)), hoogte), Image.LANCZOS)
    except Exception:
        return None


def tekst_breedte(d, t, f):
    """breedte van tekst inclusief emoji's"""
    w = 0
    for deel in re.split('(%s)' % EMOJI_RE.pattern, t):
        if not deel:
            continue
        if EMOJI_RE.fullmatch(deel):
            w += int(f.size * 1.1) + 6
        else:
            w += d.textlength(deel, font=f)
    return w


def schrijf(img, d, xy, t, f, kleur):
    """tekst met losse emoji's tekenen"""
    x, y = xy
    for deel in re.split('(%s)' % EMOJI_RE.pattern, t):
        if not deel:
            continue
        if EMOJI_RE.fullmatch(deel):
            e = emoji_plaatje(deel.replace('\uFE0F', ''), int(f.size * 1.05))
            if e is not None:
                img.paste(e, (int(x) + 4, int(y + f.size * 0.18)), e)
                x += e.width + 6
            continue
        d.text((x, y), deel, font=f, fill=kleur)
        x += d.textlength(deel, font=f)


def regels(d, t, f, maxb):
    woorden, uit, nu = t.split(), [], ''
    for w in woorden:
        test = (nu + ' ' + w).strip()
        if tekst_breedte(d, test, f) <= maxb or not nu:
            nu = test
        else:
            uit.append(nu)
            nu = w
    if nu:
        uit.append(nu)
    return uit


def midden_tekst(img, d, y, t, f, kleur, maxb, regelafstand=1.18):
    for r in regels(d, t, f, maxb):
        w = tekst_breedte(d, r, f)
        schrijf(img, d, ((img.width - w) / 2, y), r, f, kleur)
        y += int(f.size * regelafstand)
    return y


def achtergrond(W, H, zaad):
    img = Image.new('RGB', (W, H))
    d = ImageDraw.Draw(img)
    for y in range(H):
        t = y / max(1, H - 1)
        d.line([(0, y), (W, y)], fill=tuple(int(a + (b - a) * t) for a, b in zip(NAVY_BOVEN, NAVY_ONDER)))
    rnd = random.Random(zaad)
    for _ in range(int(W * H / 9000)):
        x, y = rnd.randrange(W), rnd.randrange(H)
        r = rnd.choice([1, 1, 1, 2, 2, 3])
        a = rnd.randrange(150, 256)
        d.ellipse((x - r / 2, y - r / 2, x + r / 2, y + r / 2), fill=(a, a, a))
    return img


def kaart(img, box, foto, straal=34, marge=0.08):
    d = ImageDraw.Draw(img)
    x0, y0, x1, y1 = [int(v) for v in box]
    d.rounded_rectangle((x0, y0, x1, y1), radius=straal, fill=WIT)
    if foto is not None:
        bw, bh = x1 - x0, y1 - y0
        m = int(min(bw, bh) * marge)
        f = foto.copy()
        f.thumbnail((bw - 2 * m, bh - 2 * m), Image.LANCZOS)
        img.paste(f, (x0 + (bw - f.width) // 2, y0 + (bh - f.height) // 2))


def voet(img, y, schaal=1.0):
    d = ImageDraw.Draw(img)
    ico = Image.open(os.path.join(B, 'logo-icoon.png')).convert('RGB')
    h = int(70 * schaal)
    ico = ico.resize((int(ico.width * h / ico.height), h), Image.LANCZOS)
    f = font('Bold', int(40 * schaal))
    t = 'leukekeuze.nl'
    w = ico.width + int(14 * schaal) + d.textlength(t, font=f)
    x = (img.width - w) / 2
    pad = int(4 * schaal)
    d.rectangle((x - pad, y - pad, x + ico.width + pad, y + h + pad), fill=KAART)
    img.paste(ico, (int(x), int(y)))
    d.text((x + ico.width + 14 * schaal, y + h / 2 - f.size * 0.62), t, font=f, fill=WIT)


def prijs_pil(img, cx, y, prijs, grootte):
    d = ImageDraw.Draw(img)
    f = font('Bold', grootte)
    t = '€ ' + ('%.2f' % prijs).replace('.', ',')
    w = d.textlength(t, font=f)
    ph, pw = int(grootte * 1.55), w + grootte * 1.2
    d.rounded_rectangle((cx - pw / 2, y, cx + pw / 2, y + ph), radius=ph // 2, fill=ORANJE)
    d.text((cx - w / 2, y + ph / 2 - grootte * 0.66), t, font=f, fill=DONKER)
    return y + ph


def knop_pil(img, cx, y, t, grootte):
    d = ImageDraw.Draw(img)
    f = font('Bold', grootte)
    w = d.textlength(t, font=f)
    ph, pw = int(grootte * 1.55), w + grootte * 1.4
    d.rounded_rectangle((cx - pw / 2, y, cx + pw / 2, y + ph), radius=ph // 2, fill=ORANJE)
    d.text((cx - w / 2, y + ph / 2 - grootte * 0.66), t, font=f, fill=DONKER)
    return y + ph


def pov_pil(img, y, t, grootte):
    d = ImageDraw.Draw(img)
    f = font('Bold', grootte)
    w = tekst_breedte(d, t, f)
    maxb = img.width * 0.86
    if w > maxb:
        f = font('Bold', int(grootte * maxb / w))
        w = tekst_breedte(d, t, f)
    x0 = (img.width - w) / 2
    d.rounded_rectangle((x0 - 36, y - 22, x0 + w + 36, y + f.size * 1.64), radius=26, fill=WIT)
    schrijf(img, d, (x0, y), t, f, DONKER)
    return y + f.size * 1.64 + 22


# ---------------- slides ----------------

def cover(W, H, plan, fotos, zaad, met_pov=True, knop=''):
    img = achtergrond(W, H, zaad)
    d = ImageDraw.Draw(img)
    s = W / 1080
    y = int(H * 0.065)
    y = midden_tekst(img, d, y, plan['titel'], font('Bold', int(78 * s)), WIT, W * 0.9, 1.12)
    y = midden_tekst(img, d, y + int(6 * s), plan['subtitel'], font('Bold', int(46 * s)), ORANJE, W * 0.9)
    if met_pov and plan.get('pov'):
        y = pov_pil(img, y + int(40 * s), plan['pov'], int(50 * s))
    voet_h = int(110 * s)
    knop_h = int(52 * s * 1.55 + 30 * s) if knop else 0
    rest_boven, rest_onder = y + int(30 * s), H - voet_h - int(40 * s) - knop_h
    gap = int(24 * s)
    kant = min((W - 2 * int(60 * s) - gap) / 2, (rest_onder - rest_boven - gap) / 2)
    gx = (W - 2 * kant - gap) / 2
    gy = rest_boven + ((rest_onder - rest_boven) - (2 * kant + gap)) / 2
    for i, f in enumerate(fotos[:4]):
        cx, cy = gx + (i % 2) * (kant + gap), gy + (i // 2) * (kant + gap)
        kaart(img, (cx, cy, cx + kant, cy + kant), f)
    if knop:
        knop_pil(img, W / 2, gy + 2 * kant + gap + int(30 * s), knop, int(46 * s))
    voet(img, H - voet_h, s)
    return img


def product(W, H, p, nr, totaal, zaad, teller=True):
    img = achtergrond(W, H, zaad)
    d = ImageDraw.Draw(img)
    s = W / 1080
    if teller:
        d.text((int(40 * s), int(40 * s)), '%d/%d' % (nr, totaal), font=font('Bold', int(34 * s)), fill=ORANJE)
    voet_h = int(110 * s)
    groot = H / W > 1.6
    fn, fr, fp = (font('Bold', int(66 * s)), font('Regular', int(44 * s)), int(52 * s)) if groot else \
                 (font('Bold', int(56 * s)), font('Regular', int(38 * s)), int(42 * s))
    # hoogte van het tekstblok vooraf meten
    n_naam = len(regels(d, p['naam'], fn, W * 0.9))
    n_regel = len(regels(d, p['regel'], fr, W * 0.88)) if p.get('regel') else 0
    tekst_h = int(n_naam * fn.size * 1.15 + n_regel * fr.size * 1.18 + 18 * s + fp * 1.55 + 40 * s)
    boven = int(110 * s)
    onder = H - voet_h - int(30 * s)
    kant = min(W - 2 * int(60 * s), onder - boven - tekst_h)
    blok = kant + tekst_h
    y0 = boven + max(0, (onder - boven - blok) // 2)
    kx = (W - kant) / 2
    kaart(img, (kx, y0, kx + kant, y0 + kant), p['foto'], marge=0.06)
    y = y0 + kant + int(40 * s)
    y = midden_tekst(img, d, y, p['naam'], fn, WIT, W * 0.9, 1.15)
    if p.get('regel'):
        y = midden_tekst(img, d, y, p['regel'], fr, (225, 230, 240), W * 0.88)
    prijs_pil(img, W / 2, y + int(18 * s), p['prijs'], fp)
    voet(img, H - voet_h, s)
    return img


def einde(W, H, plan, zaad):
    img = achtergrond(W, H, zaad)
    d = ImageDraw.Draw(img)
    s = W / 1080
    logo = Image.open(os.path.join(B, 'logo-kaart.png')).convert('RGB')
    kb, kh = int(722 * s), int(460 * s)
    kx, ky = (W - kb) // 2, int(H * 0.18)
    d.rounded_rectangle((kx, ky, kx + kb, ky + kh), radius=int(44 * s), fill=KAART)
    lg = logo.resize((int(logo.width * s), int(logo.height * s)), Image.LANCZOS)
    img.paste(lg, (kx + (kb - lg.width) // 2, ky + (kh - lg.height) // 2))
    y = ky + kh + int(80 * s)
    y = midden_tekst(img, d, y, plan.get('eindvraag', 'Nog meer cadeau-ideeën?'), font('Bold', int(64 * s)), WIT, W * 0.86, 1.15)
    y = midden_tekst(img, d, y + int(10 * s), 'Kijk op leukekeuze.nl', font('Bold', int(54 * s)), ORANJE, W * 0.9)
    midden_tekst(img, d, y + int(14 * s), 'Sla dit bericht op voor je cadeaulijstje', font('Regular', int(40 * s)), (225, 230, 240), W * 0.9)
    return img


def pin_overzicht(W, H, plan, fotos, zaad, knop=''):
    p = dict(plan)
    p['titel'] = plan.get('pin_titel', plan['titel'])
    p['subtitel'] = plan.get('pin_sub', plan['subtitel'])
    return cover(W, H, p, fotos, zaad, met_pov=False, knop=knop)


# ---------------- data ----------------

def laad_producten():
    t = open(os.path.join(REPO, 'assets', 'js', 'producten.js'), encoding='utf-8').read()
    uit = {}
    for regel in t.splitlines():
        regel = regel.strip().rstrip(',')
        if regel.startswith('{"id"'):
            try:
                p = json.loads(regel)
                uit[p['id']] = p
            except Exception:
                pass
    return uit


def foto_van(p):
    for naam in [p['beeld'] + '.webp', p['beeld'] + '.jpg', p['beeld'] + '-klein.webp']:
        f = os.path.join(REPO, naam.replace('/', os.sep))
        if os.path.exists(f):
            im = Image.open(f).convert('RGBA')
            wit = Image.new('RGB', im.size, WIT)
            wit.paste(im, mask=im.split()[3])
            return wit
    raise SystemExit('Geen foto gevonden voor ' + p['id'])


def bestandsnaam(t):
    t = t.lower()
    for a, b in [('é', 'e'), ('ë', 'e'), ('ï', 'i'), ('ö', 'o'), ('ü', 'u'), ('&', 'en')]:
        t = t.replace(a, b)
    t = re.sub('[^a-z0-9]+', '-', t).strip('-')
    return '-'.join(t.split('-')[:4])


def ffmpeg_pad():
    p = shutil.which('ffmpeg')
    if p:
        return p
    try:
        import imageio_ffmpeg
        return imageio_ffmpeg.get_ffmpeg_exe()
    except Exception:
        subprocess.run([sys.executable, '-m', 'pip', 'install', '--quiet', '--user', 'imageio-ffmpeg'], check=False)
        try:
            import importlib, site
            importlib.invalidate_caches()
            sys.path.append(site.getusersitepackages())
            import imageio_ffmpeg
            return imageio_ffmpeg.get_ffmpeg_exe()
        except Exception:
            return None


def maak_reel(fotos_paden, uit):
    ff = ffmpeg_pad()
    if not ff:
        print('LET OP: geen ffmpeg, reel overgeslagen')
        return False
    n = len(fotos_paden)
    dur = [3.5] + [2.4] * (n - 2) + [3.5]
    T = 0.4
    args = [ff, '-y', '-loglevel', 'error']
    for f, du in zip(fotos_paden, dur):
        args += ['-loop', '1', '-t', str(du), '-framerate', '30', '-i', f]
    args += ['-f', 'lavfi', '-t', '60', '-i', 'anullsrc=r=44100:cl=stereo']
    fl = ['[%d:v]scale=1080:1920,setsar=1,format=yuv420p[v%d]' % (i, i) for i in range(n)]
    vorige, off = 'v0', 0.0
    for i in range(1, n):
        off += dur[i - 1] - T
        fl.append('[%s][v%d]xfade=transition=fade:duration=%s:offset=%.2f[x%d]' % (vorige, i, T, off, i))
        vorige = 'x%d' % i
    totaal = sum(dur) - T * (n - 1)
    args += ['-filter_complex', ';'.join(fl), '-map', '[%s]' % vorige, '-map', '%d:a' % n, '-t', '%.2f' % totaal,
             '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20', '-pix_fmt', 'yuv420p', '-r', '30',
             '-c:a', 'aac', '-b:a', '96k', '-movflags', '+faststart', uit]
    subprocess.run(args, check=True)
    return True


# ---------------- reel met beweging ----------------

def _ease(x):
    x = max(0.0, min(1.0, x))
    return 1 - (1 - x) ** 3


def _pop(x):
    """0 -> 1.15 -> 1.0"""
    if x <= 0:
        return 0.0
    if x >= 1:
        return 1.0
    if x < 0.6:
        return 1.15 * _ease(x / 0.6)
    return 1.15 - 0.15 * _ease((x - 0.6) / 0.4)


def _plak_schaal(doek, laag, cx, cy, s, alpha=1.0):
    if s <= 0.01 or alpha <= 0.01:
        return
    w, h = max(1, int(laag.width * s)), max(1, int(laag.height * s))
    l = laag.resize((w, h), Image.BILINEAR) if (w, h) != laag.size else laag
    if alpha < 1:
        a = l.split()[3].point(lambda v: int(v * alpha))
        l = l.copy(); l.putalpha(a)
    doek.paste(l, (int(cx - w / 2), int(cy - h / 2)), l)


def _tekstlaag(W, regels_def):
    """regels_def: lijst van (tekst, font, kleur, maxb, afstand) -> RGBA-laag met alles onder elkaar"""
    laag = Image.new('RGBA', (W, 900), (0, 0, 0, 0))
    d = ImageDraw.Draw(laag)
    y = 0
    for tekst, f, kleur, maxb, afst in regels_def:
        y = midden_tekst(laag, d, y, tekst, f, kleur, maxb, afst)
    bb = laag.getbbox() or (0, 0, W, 1)
    return laag.crop((0, 0, W, bb[3] + 4))


def _pil_laag(tekst, f, vul, tekstkleur, pad_x, pad_y):
    tmp = ImageDraw.Draw(Image.new('RGBA', (10, 10)))
    w = tekst_breedte(tmp, tekst, f)
    laag = Image.new('RGBA', (int(w + 2 * pad_x), int(f.size * 1.3 + 2 * pad_y)), (0, 0, 0, 0))
    d = ImageDraw.Draw(laag)
    d.rounded_rectangle((0, 0, laag.width - 1, laag.height - 1), radius=laag.height // 2, fill=vul)
    schrijf(laag, d, (pad_x, pad_y - f.size * 0.05), tekst, f, tekstkleur)
    return laag


def _kaart_frame(foto, kant, zoom):
    k = Image.new('RGBA', (kant, kant), (0, 0, 0, 0))
    masker = Image.new('L', (kant, kant), 0)
    ImageDraw.Draw(masker).rounded_rectangle((0, 0, kant - 1, kant - 1), radius=int(kant * 0.045), fill=255)
    vlak = Image.new('RGB', (kant, kant), WIT)
    m = int(kant * 0.06)
    f = foto.copy()
    f.thumbnail((kant - 2 * m, kant - 2 * m), Image.LANCZOS)
    if zoom != 1:
        f = f.resize((int(f.width * zoom), int(f.height * zoom)), Image.BILINEAR)
    vlak.paste(f, ((kant - f.width) // 2, (kant - f.height) // 2))
    k.paste(vlak, (0, 0), masker)
    return k


def maak_reel_beweging(plan, ps, cover_pad, uit, W=1080, H=1920, fps=30):
    ff = ffmpeg_pad()
    if not ff:
        print('LET OP: geen ffmpeg, reel overgeslagen')
        return False
    zaad = int(plan['datum'].replace('-', ''))
    s = W / 1080
    n = len(ps)
    T_HOOK, T_PROD, T_EIND = 2.2, 1.9, 2.8
    totaal = T_HOOK + n * T_PROD + T_EIND
    N = int(round(totaal * fps))

    bg = achtergrond(W, H, zaad + 7)
    voet_h = int(110 * s)
    voet(bg, H - voet_h, s)
    cov = Image.open(cover_pad).convert('RGB')

    # productlagen voorbereiden (zelfde indeling als de losse foto's)
    d0 = ImageDraw.Draw(bg)
    fn, fr, fp = font('Bold', int(66 * s)), font('Regular', int(44 * s)), int(52 * s)
    lagen = []
    for i, p in enumerate(ps):
        n_naam = len(regels(d0, p['naam'], fn, W * 0.9))
        n_regel = len(regels(d0, p['regel'], fr, W * 0.88)) if p.get('regel') else 0
        tekst_h = int(n_naam * fn.size * 1.15 + n_regel * fr.size * 1.18 + 18 * s + fp * 1.55 + 40 * s)
        boven, onder = int(150 * s), H - voet_h - int(40 * s)
        kant = int(min(W - 2 * int(70 * s), onder - boven - tekst_h))
        y0 = boven + max(0, (onder - boven - kant - tekst_h) // 2)
        rdef = [(p['naam'], fn, WIT, W * 0.9, 1.15)]
        if p.get('regel'):
            rdef.append((p['regel'], fr, (225, 230, 240), W * 0.88, 1.18))
        tl = _tekstlaag(W, rdef)
        prijs = _pil_laag('€ ' + ('%.2f' % p['prijs']).replace('.', ','), font('Bold', fp), ORANJE, DONKER, fp * 0.6, fp * 0.14)
        teller = _pil_laag('%d/%d' % (i + 1, n), font('Bold', int(44 * s)), (255, 255, 255, 40), ORANJE, 26 * s, 6 * s)
        lagen.append(dict(kant=kant, y0=y0, tekst=tl, prijs=prijs, teller=teller, foto=p['foto']))

    # eindscherm
    eind = einde(W, H, plan, zaad + 99)
    vraag = _pil_laag('Welke kies jij? Zet 1 t/m %d in de reacties 👇' % n, font('Bold', int(40 * s)), WIT, DONKER, 34 * s, 16 * s)
    if vraag.width > W * 0.94:
        f2 = font('Bold', int(40 * s * W * 0.94 / vraag.width))
        vraag = _pil_laag('Welke kies jij? Zet 1 t/m %d in de reacties 👇' % n, f2, WIT, DONKER, 34 * s, 16 * s)

    args = [ff, '-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', '%dx%d' % (W, H), '-r', str(fps), '-i', '-',
            '-f', 'lavfi', '-t', '%.2f' % totaal, '-i', 'anullsrc=r=44100:cl=stereo',
            '-map', '0:v', '-map', '1:a', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '21', '-pix_fmt', 'yuv420p',
            '-c:a', 'aac', '-b:a', '96k', '-shortest', '-movflags', '+faststart', uit]
    proc = subprocess.Popen(args, stdin=subprocess.PIPE)
    try:
        for fi in range(N):
            t = fi / fps
            if t < T_HOOK:
                # pakkende opening: harde inzoom en dan rustig verder zoomen
                z = 1.12 - 0.12 * _ease(t / 0.35) + 0.04 * (t / T_HOOK)
                w, h = int(W * z), int(H * z)
                fr_ = cov.resize((w, h), Image.BILINEAR).crop(((w - W) // 2, (h - H) // 2, (w - W) // 2 + W, (h - H) // 2 + H))
            elif t < T_HOOK + n * T_PROD:
                i = int((t - T_HOOK) // T_PROD)
                lt = (t - T_HOOK) - i * T_PROD
                L = lagen[i]
                fr_ = bg.copy()
                kant = L['kant']
                kaart_img = _kaart_frame(L['foto'], kant, 1.0 + 0.08 * (lt / T_PROD))
                x_eind = (W - kant) // 2
                x = int(x_eind + (W - x_eind) * (1 - _ease(lt / 0.28)))
                fr_.paste(kaart_img, (x, L['y0']), kaart_img)
                _plak_schaal(fr_, L['teller'], 40 * s + L['teller'].width / 2, 60 * s + L['teller'].height / 2, 1.0, _ease(lt / 0.2))
                ty = L['y0'] + kant + int(36 * s)
                a = _ease((lt - 0.12) / 0.3)
                if a > 0:
                    tl = L['tekst']
                    _plak_schaal(fr_, tl, W / 2, ty + tl.height / 2 + 20 * s * (1 - a), 1.0, a)
                ps_ = _pop((lt - 0.4) / 0.35)
                if ps_ > 0:
                    pr = L['prijs']
                    _plak_schaal(fr_, pr, W / 2, ty + L['tekst'].height + int(20 * s) + pr.height / 2, ps_)
            else:
                lt = t - T_HOOK - n * T_PROD
                fr_ = Image.blend(bg, eind, _ease(lt / 0.3)) if lt < 0.3 else eind.copy()
                v = _pop((lt - 0.5) / 0.4)
                if v > 0:
                    puls = 1 + 0.03 * math.sin(max(0, lt - 0.9) * 6) if lt > 0.9 else 1
                    _plak_schaal(fr_, vraag, W / 2, H * 0.78, v * puls)
            # voortgangsbalk
            dd = ImageDraw.Draw(fr_)
            dd.rectangle((0, H - int(10 * s), int(W * (t / totaal)), H), fill=ORANJE)
            proc.stdin.write(fr_.convert('RGB').tobytes())
        proc.stdin.close()
        proc.wait()
    except Exception:
        proc.kill()
        raise
    return proc.returncode == 0



def maak_reel_spanning(plan, ps, uit, W=1080, H=1920, fps=30):
    """Reel met spanning: raadsel-opening, aftellen #N -> #1, 'En nummer 1 is...' en dan de onthulling."""
    from PIL import ImageFilter, ImageEnhance
    ff = ffmpeg_pad()
    if not ff:
        print('LET OP: geen ffmpeg, reel overgeslagen')
        return False
    zaad = int(plan['datum'].replace('-', ''))
    s = W / 1080
    n = len(ps)
    volgorde = list(range(n - 1, -1, -1))          # toon #n ... #1 (ps[0] is de topper = nummer 1)
    T_HOOK, T_PROD, T_TROM, T_EEN, T_EIND = 2.0, 2.2, 1.1, 3.0, 2.8
    segs = [('hook', T_HOOK)]
    for k, i in enumerate(volgorde):
        if i == 0:
            segs.append(('trom', T_TROM))
            segs.append(('prod', T_EEN, i))
        else:
            segs.append(('prod', T_PROD, i))
    segs.append(('eind', T_EIND))
    totaal = sum(x[1] for x in segs)
    N = int(round(totaal * fps))

    bg = achtergrond(W, H, zaad + 7)
    voet_h = int(110 * s)
    voet(bg, H - voet_h, s)

    # opening: wazige, donkere nummer 1 met vraagteken + pakkende tekst
    top = ps[0]['foto'].copy()
    top.thumbnail((int(W * 0.8), int(W * 0.8)), Image.LANCZOS)
    top = top.filter(ImageFilter.GaussianBlur(int(38 * s)))
    top = ImageEnhance.Brightness(top).enhance(0.55)
    hook_bg = bg.copy()
    k_raad = int(W * 0.78)
    raad = Image.new('RGBA', (k_raad, k_raad), (0, 0, 0, 0))
    m = Image.new('L', (k_raad, k_raad), 0); ImageDraw.Draw(m).rounded_rectangle((0, 0, k_raad - 1, k_raad - 1), radius=int(k_raad * 0.05), fill=255)
    vlak = Image.new('RGB', (k_raad, k_raad), (40, 50, 80)); tt = top.resize((k_raad, k_raad), Image.LANCZOS); vlak.paste(tt, (0, 0))
    raad.paste(vlak, (0, 0), m)
    dr = ImageDraw.Draw(raad); fq = font('Bold', int(300 * s)); wq = dr.textlength('?', font=fq)
    dr.text(((k_raad - wq) / 2, k_raad * 0.08), '?', font=fq, fill=(255, 255, 255, 235))
    hook_tekst = plan.get('hook') or 'Wacht tot je nummer 1 ziet 👀'
    l_pov = _tekstlaag(W, [(plan.get('pov', ''), font('Bold', int(58 * s)), WIT, W * 0.88, 1.15)]) if plan.get('pov') else None
    l_hook = _pil_laag(hook_tekst, font('Bold', int(50 * s)), ORANJE, DONKER, 34 * s, 14 * s)
    if l_hook.width > W * 0.94:
        l_hook = _pil_laag(hook_tekst, font('Bold', int(50 * s * W * 0.92 / l_hook.width)), ORANJE, DONKER, 34 * s, 14 * s)

    # productlagen
    d0 = ImageDraw.Draw(bg)
    fn, fr, fp = font('Bold', int(66 * s)), font('Regular', int(44 * s)), int(52 * s)
    lagen = {}
    for i, p in enumerate(ps):
        n_naam = len(regels(d0, p['naam'], fn, W * 0.9))
        n_regel = len(regels(d0, p['regel'], fr, W * 0.88)) if p.get('regel') else 0
        tekst_h = int(n_naam * fn.size * 1.15 + n_regel * fr.size * 1.18 + 18 * s + fp * 1.55 + 40 * s)
        boven, onder = int(190 * s), H - voet_h - int(40 * s)
        kant = int(min(W - 2 * int(70 * s), onder - boven - tekst_h))
        y0 = boven + max(0, (onder - boven - kant - tekst_h) // 2)
        rdef = [(p['naam'], fn, WIT, W * 0.9, 1.15)]
        if p.get('regel'):
            rdef.append((p['regel'], fr, (225, 230, 240), W * 0.88, 1.18))
        tl = _tekstlaag(W, rdef)
        prijs = _pil_laag('€ ' + ('%.2f' % p['prijs']).replace('.', ','), font('Bold', fp), ORANJE, DONKER, fp * 0.6, fp * 0.14)
        nr = _pil_laag('#%d' % (i + 1), font('Bold', int(84 * s)), ORANJE if i else (255, 214, 102), DONKER, 30 * s, 4 * s)
        lagen[i] = dict(kant=kant, y0=y0, tekst=tl, prijs=prijs, nr=nr, foto=p['foto'])
    trom = _tekstlaag(W, [('En nummer 1 is…', font('Bold', int(84 * s)), WIT, W * 0.9, 1.1)])

    eind = einde(W, H, plan, zaad + 99)
    vtxt = 'Welke kies jij? Zet 1 t/m %d in de reacties 👇' % n
    vraag = _pil_laag(vtxt, font('Bold', int(40 * s)), WIT, DONKER, 34 * s, 16 * s)
    if vraag.width > W * 0.94:
        vraag = _pil_laag(vtxt, font('Bold', int(40 * s * W * 0.92 / vraag.width)), WIT, DONKER, 34 * s, 16 * s)

    args = [ff, '-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', '%dx%d' % (W, H), '-r', str(fps), '-i', '-',
            '-f', 'lavfi', '-t', '%.2f' % totaal, '-i', 'anullsrc=r=44100:cl=stereo',
            '-map', '0:v', '-map', '1:a', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '21', '-pix_fmt', 'yuv420p',
            '-c:a', 'aac', '-b:a', '96k', '-shortest', '-movflags', '+faststart', uit]
    proc = subprocess.Popen(args, stdin=subprocess.PIPE)
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
                fr_ = hook_bg.copy()
                puls = 1 + 0.025 * math.sin(lt * 7)
                _plak_schaal(fr_, raad, W / 2, H * 0.53, (0.85 + 0.15 * _ease(lt / 0.3)) * puls)
                if l_pov is not None:
                    _plak_schaal(fr_, l_pov, W / 2, H * 0.13 + l_pov.height / 2, _pop(lt / 0.3))
                _plak_schaal(fr_, l_hook, W / 2, H * 0.87, _pop((lt - 0.08) / 0.3))
            elif soort == 'trom':
                fr_ = bg.copy()
                _plak_schaal(fr_, trom, W / 2, H * 0.45, _pop(lt / 0.3) * (1 + 0.04 * math.sin(lt * 14)))
            elif soort == 'prod':
                i = seg[2]; L = lagen[i]; dur = seg[1]
                fr_ = bg.copy()
                kant = L['kant']
                kaart_img = _kaart_frame(L['foto'], kant, 1.0 + 0.08 * (lt / dur))
                x_eind = (W - kant) // 2
                if i == 0:   # nummer 1: inzoomen vanuit het midden
                    sc = 0.6 + 0.4 * _ease(lt / 0.35)
                    _plak_schaal(fr_, kaart_img, W / 2, L['y0'] + kant / 2, sc)
                else:
                    x = int(x_eind + (W - x_eind) * (1 - _ease(lt / 0.25)))
                    fr_.paste(kaart_img, (x, L['y0']), kaart_img)
                _plak_schaal(fr_, L['nr'], W / 2, int(110 * s), _pop(lt / 0.3))
                ty = L['y0'] + kant + int(36 * s)
                a = _ease((lt - 0.1) / 0.25)
                if a > 0:
                    tl = L['tekst']
                    _plak_schaal(fr_, tl, W / 2, ty + tl.height / 2 + 20 * s * (1 - a), 1.0, a)
                ps_ = _pop((lt - 0.35) / 0.3)
                if ps_ > 0:
                    pr = L['prijs']
                    _plak_schaal(fr_, pr, W / 2, ty + L['tekst'].height + int(20 * s) + pr.height / 2, ps_)
            else:
                fr_ = Image.blend(bg, eind, _ease(lt / 0.3)) if lt < 0.3 else eind.copy()
                v = _pop((lt - 0.4) / 0.4)
                if v > 0:
                    puls = 1 + 0.03 * math.sin(max(0, lt - 0.8) * 6) if lt > 0.8 else 1
                    _plak_schaal(fr_, vraag, W / 2, H * 0.78, v * puls)
            dd = ImageDraw.Draw(fr_)
            dd.rectangle((0, H - int(10 * s), int(W * (t / totaal)), H), fill=ORANJE)
            proc.stdin.write(fr_.convert('RGB').tobytes())
        proc.stdin.close()
        proc.wait()
    except Exception:
        proc.kill()
        raise
    return proc.returncode == 0

# ---------------- teksten ----------------

def datum_tekst(ds):
    d = datetime.date.fromisoformat(ds)
    return '%s %d %s %d' % (DAGEN[d.weekday()], d.day, MAANDEN[d.month - 1], d.year)


def schrijf_txt(pad, tekst):
    with open(pad, 'w', encoding='utf-8-sig', newline='\r\n') as f:
        f.write(tekst.strip() + '\n')


def teksten(plan, ps, mappen, reel_ok):
    dt = datum_tekst(plan['datum'])
    T = plan['teksten']
    reelzin = 'het filmpje leukekeuze-reel.mp4' if reel_ok else '(reel kon niet gemaakt worden, gebruik de foto\'s)'
    plak = lambda t: '---------- TEKST OM TE PLAKKEN ----------\n' + t.strip() + '\n------------------------------------------'
    links = '\n'.join('%d %s: https://leukekeuze.nl/p/%s/' % (i + 1, p['naam'], p['id']) for i, p in enumerate(ps))

    schrijf_txt(os.path.join(mappen['tiktok'], 'tekst-tiktok.txt'), f"""
TIKTOK – {dt}
=================================
IDEE: {plan['thema']}
De tekst ("{plan.get('pov', '')}") staat al op het eerste plaatje.

WANNEER: tussen 18:00 en 21:00.

HOE (reel / filmpje):
1. TikTok Studio of app > Uploaden > kies {reelzin}.
2. In de app op je telefoon kun je er nog een populair liedje onder zetten (op de computer kan dat niet).
3. Plak de tekst hieronder als beschrijving.
Liever een foto-slideshow? Gebruik dan de losse foto's 01 t/m {len(ps) + 2:02d} in volgorde.

{plak(T['tiktok'])}
""")

    schrijf_txt(os.path.join(mappen['instagram'], 'tekst-instagram.txt'), f"""
INSTAGRAM – {dt}
====================================
IDEE: {plan['thema']}

WANNEER: tussen 19:00 en 21:00.

HOE (reel):
1. instagram.com > Maken (+) > Bericht > kies {reelzin}. Instagram maakt er vanzelf een reel van.
2. Kies bij bijsnijden 'Origineel' of 9:16, zodat er niets afvalt.
3. Plak de tekst hieronder. Laat 'Delen via Facebook (Marius Kestens)' UIT staan.
Liever een carrousel? Gebruik dan de foto's 01 t/m {len(ps) + 2:02d} (4:5) in volgorde.

{plak(T['instagram'])}

LINKS PER PRODUCT (voor in je story of als iemand ernaar vraagt):
{links}
""")

    schrijf_txt(os.path.join(mappen['facebook'], 'tekst-facebook.txt'), f"""
FACEBOOK – {dt}
===================================
IDEE: {plan['thema']}
Post als je LeukeKeuze-pagina (er staat dan "Wat ben je aan het doen, LeukeKeuze?").

WANNEER: tussen 19:30 en 21:00.

HOE (reel):
1. LeukeKeuze-pagina > Reel (of Foto/video) > kies {reelzin}.
2. Plak de tekst hieronder en klik op Plaatsen.
Liever een album? Kies dan 01-hoofdfoto.jpg en daarna 02 t/m {len(ps) + 1:02d}.

{plak(T['facebook'])}
""")

    pins = []
    pins.append('pin-0-overzicht.jpg\n  Titel: %s\n  Beschrijving: %s\n  Link: %s' % (
        plan.get('pin_titel', plan['titel']), plan.get('pin_tekst', plan['thema']), plan.get('link', 'https://leukekeuze.nl/')))
    for i, p in enumerate(ps):
        pins.append('pin-%d-%s.jpg\n  Titel: %s\n  Beschrijving: %s\n  Link: https://leukekeuze.nl/p/%s/' % (
            i + 1, p['bestand'], p.get('pin_titel', p['naam']), p.get('pin_tekst', p.get('regel', '')), p['id']))
    schrijf_txt(os.path.join(mappen['printerest'], 'tekst-pinterest.txt'), f"""
PINTEREST – {dt}
====================================
IDEE: Pinterest is een zoekmachine. Elke pin linkt direct naar het product op leukekeuze.nl.

HOE (per pin):
1. Pinterest > + > Pin maken > upload de foto.
2. Titel, beschrijving en link: zie hieronder. Kies een bord dat past.
TIP: zet er vandaag 3 of 4 op.

""" + '\n\n'.join(pins))

    lijst = '\n'.join('%d. %s – € %s' % (i + 1, p['naam'], ('%.2f' % p['prijs']).replace('.', ',')) for i, p in enumerate(ps))
    lees = f"""
LEUKEKEUZE – WAT JE {dt.upper()} DOET
============================================
Thema: {plan['thema']}
Waarom: {plan.get('waarom', '')}

De {len(ps)} producten (staan allemaal op de site):
{lijst}

Lijstje:
[ ] TikTok: reel plaatsen (map tiktok\\{plan['datum']}) – 18:00-21:00
[ ] Instagram: reel plaatsen (map instagram\\{plan['datum']}) – 19:00-21:00
[ ] Facebook: reel plaatsen als LeukeKeuze-pagina (map facebook\\{plan['datum']}) – 19:30-21:00
[ ] Pinterest: 3 of 4 pins plaatsen (map printerest\\{plan['datum']})
[ ] 's Avonds: reageren op reacties

Let op: prijzen kunnen veranderen bij bol. Daarom staat de prijs alleen op de foto's.
"""
    naam = 'LEES-MIJ-%d-%s.txt' % (datetime.date.fromisoformat(plan['datum']).day, MAANDEN[datetime.date.fromisoformat(plan['datum']).month - 1])
    for k in KANALEN:
        schrijf_txt(os.path.join(mappen[k], naam), lees)


# ---------------- hoofdprogramma ----------------

def opruimen(basis, datum):
    weg = []
    for k in KANALEN:
        d = os.path.join(basis, k)
        if not os.path.isdir(d):
            continue
        for sub in os.listdir(d):
            if re.fullmatch(r'\d{4}-\d{2}-\d{2}', sub) and sub < datum:
                shutil.rmtree(os.path.join(d, sub), ignore_errors=True)
                weg.append(k + '\\' + sub)
    return weg


def kopie_drive(mappen, datum, opruim):
    """Zet een kopie in Google Drive, zodat Marius alles op zijn telefoon heeft."""
    for wortel in [r'G:\Mijn Drive', r'G:\My Drive']:
        if os.path.isdir(wortel):
            break
    else:
        return 'niet gevonden'
    doel_basis = os.path.join(wortel, 'LeukeKeuze Promo')
    try:
        for k, bron in mappen.items():
            doel = os.path.join(doel_basis, k, datum)
            if os.path.isdir(doel):
                # oude bestanden weg; de map zelf mag blijven (Google Drive geeft hem niet altijd meteen vrij)
                for f in os.listdir(doel):
                    pf = os.path.join(doel, f)
                    shutil.rmtree(pf, ignore_errors=True) if os.path.isdir(pf) else os.remove(pf)
            shutil.copytree(bron, doel, dirs_exist_ok=True)
        if opruim:
            opruimen(doel_basis, datum)
        return doel_basis
    except Exception as e:
        return 'MISLUKT (%s)' % e


def main():
    args = sys.argv[1:]
    if not args:
        raise SystemExit(__doc__)
    plan = json.load(open(args[0], encoding='utf-8-sig'))
    basis = os.path.join(os.path.expanduser('~'), 'Desktop', 'LEUKEKEUZE.NL')
    if '--uit' in args:
        basis = args[args.index('--uit') + 1]
    datum = plan['datum']
    alle = laad_producten()
    ps = []
    for item in plan['producten']:
        p = alle.get(item['id'])
        if not p:
            raise SystemExit('Product niet gevonden: ' + item['id'])
        if p.get('status') not in (None, 'goedgekeurd'):
            raise SystemExit('Product staat niet (meer) op de site: ' + item['id'])
        q = dict(item)
        q['prijs'] = float(p['prijs'])
        q['foto'] = foto_van(p)
        q['bestand'] = bestandsnaam(item.get('bestand') or item['naam'])
        ps.append(q)
    fotos = [p['foto'] for p in ps]
    zaad = int(datum.replace('-', ''))
    n = len(ps)

    mappen = {}
    for k in KANALEN:
        mappen[k] = os.path.join(basis, k, datum)
        if os.path.isdir(mappen[k]):
            shutil.rmtree(mappen[k])
        os.makedirs(mappen[k])

    # Ontwerp: Nova Style 6 (stijl6.py). De oude tekenfuncties hierboven blijven alleen als reserve.
    sys.path.insert(0, HIER)
    import stijl6 as S
    szn = S.seizoen(plan)
    print('Seizoen:', szn)
    # Sinds 27-10: alles in de eigen rustige blauwe stijl met gouden kaders (Marius: 'veel beter, het gaat om het product').
    # Met --nova worden de Nova-sjablonen (foto-achtergrond) weer gebruikt.
    S.GETEKEND = '--nova' not in args
    try:
        import sjablonen as SJ
        if '--nova' in args and SJ.heeft(szn):
            return met_sjablonen(SJ, S, szn, plan, ps, fotos, n, mappen, args, basis, datum)
        print('Stijl: eigen blauwe achtergrond met gouden kaders' if S.GETEKEND else 'Geen complete Nova-sjablonen voor ' + szn + ' - getekende stijl')
    except ImportError as e:
        print('Sjablonen niet beschikbaar (%s) - getekende stijl' % e)

    # TikTok 9:16
    tt = []
    pad = os.path.join(mappen['tiktok'], '01-cover.jpg'); S.cover(1080, 1920, plan, fotos, zaad, knop=False).save(pad, quality=92); tt.append(pad)
    for i, p in enumerate(ps):
        pad = os.path.join(mappen['tiktok'], '%02d-%s.jpg' % (i + 2, p['bestand']))
        S.product(1080, 1920, p, i + 1, n, zaad + i + 1, plan).save(pad, quality=92); tt.append(pad)
    pad = os.path.join(mappen['tiktok'], '%02d-einde.jpg' % (n + 2)); S.einde(1080, 1920, plan, zaad + 99).save(pad, quality=92); tt.append(pad)

    # Instagram 4:5 (zonder POV-balk: die staat al in de reel)
    S.cover(1080, 1350, dict(plan, pov=''), fotos, zaad, n_ideeen=n).save(os.path.join(mappen['instagram'], '01-cover.jpg'), quality=92)
    for i, p in enumerate(ps):
        S.product(1080, 1350, p, i + 1, n, zaad + i + 1, plan).save(os.path.join(mappen['instagram'], '%02d-%s.jpg' % (i + 2, p['bestand'])), quality=92)
    S.einde(1080, 1350, plan, zaad + 99).save(os.path.join(mappen['instagram'], '%02d-einde.jpg' % (n + 2)), quality=92)

    # Facebook: hoofdfoto 4:5 + album
    S.cover(1080, 1350, dict(plan, pov=''), fotos, zaad, n_ideeen=n).save(os.path.join(mappen['facebook'], '01-hoofdfoto.jpg'), quality=92)
    for i, p in enumerate(ps):
        S.product(1080, 1350, p, i + 1, n, zaad + i + 1, plan).save(os.path.join(mappen['facebook'], '%02d-%s.jpg' % (i + 2, p['bestand'])), quality=92)

    # Pinterest 2:3
    S.pin_overzicht(1000, 1500, plan, fotos, zaad, n).save(os.path.join(mappen['printerest'], 'pin-0-overzicht.jpg'), quality=92)
    for i, p in enumerate(ps):
        q = dict(p, regel=p.get('regel', ''))
        S.product(1000, 1500, q, i + 1, n, zaad + i + 1, plan, teller=False, met_prijs=False).save(os.path.join(mappen['printerest'], 'pin-%d-%s.jpg' % (i + 1, p['bestand'])), quality=92)

    # Reel voor TikTok, Instagram en Facebook
    reel = os.path.join(mappen['tiktok'], 'leukekeuze-reel.mp4')
    reel_ok = False
    ff = ffmpeg_pad()
    try:
        # Reel in de Nova-stijl (Marius 27-10: 'mensen hebben hem geliked'); plaatjes en pins blijven blauw.
        nova_reel = False
        try:
            import sjablonen as SJ
            nova_reel = SJ.heeft(szn) and '--blauwe-reel' not in args
        except ImportError:
            pass
        if ff and nova_reel:
            S.GETEKEND = False
            try:
                reel_ok = SJ.maak_reel(plan, ps, reel, ff, szn)
            finally:
                S.GETEKEND = '--nova' not in args
            print('Reel: Nova-stijl')
        else:
            reel_ok = S.maak_reel(plan, ps, reel, ff) if ff else False
    except Exception as e:
        print('LET OP: reel in nieuwe stijl mislukt (%s), ik maak de simpele versie' % e)
        try:
            reel_ok = maak_reel(tt, reel)
        except Exception as e2:
            print('LET OP: reel mislukt:', e2)
    if reel_ok:
        for k in ('instagram', 'facebook'):
            shutil.copy(reel, os.path.join(mappen[k], 'leukekeuze-reel.mp4'))

    teksten(plan, ps, mappen, reel_ok)
    weg = [] if '--geen-opruimen' in args else opruimen(basis, datum)
    telefoon = kopie_drive(mappen, datum, '--geen-opruimen' not in args) if '--uit' not in args else '-'
    print('KLAAR', datum, '| producten:', n, '| reel:', 'ja' if reel_ok else 'NEE', '| opgeruimd:', ', '.join(weg) or '-',
          '| Google Drive:', telefoon)


def met_sjablonen(SJ, S, szn, plan, ps, fotos, n, mappen, args, basis, datum):
    """Alles maken met de Nova-sjablonen van dit seizoen."""
    def bewaar(img, k, naam):
        img.convert('RGB').save(os.path.join(mappen[k], naam), quality=92)
    # TikTok 9:16
    bewaar(SJ.overzicht('reel-overzicht', szn, 1080, 1920, dict(plan), fotos, n), 'tiktok', '01-cover.jpg')
    for i, p in enumerate(ps):
        bewaar(SJ.product('reel-product', szn, 1080, 1920, p, i + 1), 'tiktok', '%02d-%s.jpg' % (i + 2, p['bestand']))
    bewaar(SJ.einde(szn, 1080, 1920, plan), 'tiktok', '%02d-einde.jpg' % (n + 2))
    # Instagram en Facebook 4:5
    cov = SJ.overzicht('insta-overzicht', szn, 1080, 1350, dict(plan), fotos, n)
    bewaar(cov, 'instagram', '01-cover.jpg'); bewaar(cov, 'facebook', '01-hoofdfoto.jpg')
    for i, p in enumerate(ps):
        im = SJ.product('insta-product', szn, 1080, 1350, p, i + 1)
        bewaar(im, 'instagram', '%02d-%s.jpg' % (i + 2, p['bestand'])); bewaar(im, 'facebook', '%02d-%s.jpg' % (i + 2, p['bestand']))
    # einde voor Instagram: 9:16-einde past niet, dus het overzicht als slot
    bewaar(cov, 'instagram', '%02d-einde.jpg' % (n + 2))
    # Pinterest 2:3: eigen blauwe achtergrond met de gouden kaders/balkjes (Marius: Nova-foto te druk, 'het gaat om het product')
    zaad = int(datum.replace('-', ''))
    S.GETEKEND = True
    try:
        bewaar(S.pin_overzicht(1000, 1500, plan, fotos, zaad, n), 'printerest', 'pin-0-overzicht.jpg')
        for i, p in enumerate(ps):
            bewaar(S.product(1000, 1500, p, i + 1, n, zaad + i + 1, plan, teller=False, met_prijs=False), 'printerest', 'pin-%d-%s.jpg' % (i + 1, p['bestand']))
    finally:
        S.GETEKEND = False
    # reel
    reel = os.path.join(mappen['tiktok'], 'leukekeuze-reel.mp4')
    reel_ok = False
    ff = ffmpeg_pad()
    try:
        reel_ok = SJ.maak_reel(plan, ps, reel, ff, szn) if ff else False
    except Exception as e:
        print('LET OP: reel met sjabloon mislukt (%s), ik maak de getekende versie' % e)
        try:
            reel_ok = S.maak_reel(plan, ps, reel, ff)
        except Exception as e2:
            print('LET OP: reel mislukt:', e2)
    if reel_ok:
        for k in ('instagram', 'facebook'):
            shutil.copy(reel, os.path.join(mappen[k], 'leukekeuze-reel.mp4'))
    teksten(plan, ps, mappen, reel_ok)
    weg = [] if '--geen-opruimen' in args else opruimen(basis, datum)
    telefoon = kopie_drive(mappen, datum, '--geen-opruimen' not in args) if '--uit' not in args else '-'
    print('KLAAR', datum, '| producten:', n, '| sjablonen:', szn, '| reel:', 'ja' if reel_ok else 'NEE', '| opgeruimd:', ', '.join(weg) or '-',
          '| Google Drive:', telefoon)


if __name__ == '__main__':
    main()
