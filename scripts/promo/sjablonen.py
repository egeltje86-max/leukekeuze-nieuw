# -*- coding: utf-8 -*-
"""Nova-sjablonen per seizoen invullen.

Bestanden: bestanden/sjabloon-<soort>-<seizoen>.png
soorten: pin-overzicht, pin-product, reel-overzicht, reel-product, reel-einde, insta-overzicht, insta-product
De vakken (wit = productfoto, crème = tekst, goud = lint/knop/nummer) worden automatisch herkend.
"""
import os, random, math, subprocess
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance
import numpy as np
from scipy import ndimage
import stijl6 as S

B = S.B
DONKER = S.DONKER
GOUD_TEKST = (176, 120, 34)
_CACHE = {}


def pad(soort, szn):
    p = os.path.join(B, 'sjabloon-%s-%s.png' % (soort, szn))
    return p if os.path.exists(p) else None


def heeft(szn, soorten=('reel-product', 'reel-overzicht', 'reel-einde', 'insta-overzicht', 'insta-product', 'pin-overzicht', 'pin-product')):
    return all(pad(s, szn) for s in soorten)


def laad(soort, szn, W, H):
    """Sjabloon op maat + herkende vakken (in pixels van W x H)."""
    k = (soort, szn, W, H)
    if k in _CACHE:
        return _CACHE[k]
    bron = Image.open(pad(soort, szn)).convert('RGB')
    if abs(bron.width / bron.height - W / H) < 0.04:
        im = bron.resize((W, H), Image.LANCZOS)
    else:
        # andere verhouding: op breedte schalen en boven/onder aanvullen met een wazige versie (niets uitrekken)
        k = W / bron.width
        mid = bron.resize((W, int(bron.height * k)), Image.LANCZOS)
        if mid.height > H:
            mid = mid.crop((0, (mid.height - H) // 2, W, (mid.height - H) // 2 + H))
        im = bron.resize((W, H), Image.LANCZOS).filter(ImageFilter.GaussianBlur(30))
        im = ImageEnhance.Brightness(im).enhance(0.7)
        y = (H - mid.height) // 2
        m = Image.new('L', mid.size, 255)
        rand = int(mid.height * 0.06)
        d = ImageDraw.Draw(m)
        for i in range(rand):
            a = int(255 * i / rand)
            d.line((0, i, W, i), fill=a); d.line((0, mid.height - 1 - i, W, mid.height - 1 - i), fill=a)
        im.paste(mid, (0, y), m)
    a = np.array(im).astype(int)
    r, g, b = a[:, :, 0], a[:, :, 1], a[:, :, 2]
    lum = a.mean(2)
    vakken = {'wit': [], 'creme': [], 'goud': [], 'rond': []}
    licht = (a.min(2) > 150) & (lum > 205)
    lab, n = ndimage.label(licht)
    for i, sl in enumerate(ndimage.find_objects(lab), 1):
        m = lab[sl] == i
        if m.sum() < W * H * 0.012:
            continue
        rr, bb = r[sl][m].mean(), b[sl][m].mean()
        soort_v = 'wit' if rr - bb < 14 else 'creme'
        masker = np.zeros((H, W), bool); masker[sl] = m
        masker = ndimage.binary_fill_holes(masker)
        vakken[soort_v].append(dict(box=(sl[1].start, sl[0].start, sl[1].stop, sl[0].stop), masker=masker))
    goud = (r > 190) & (g > 130) & (g < 225) & (b < 140) & (r - b > 80)
    lab, n = ndimage.label(goud)
    for i, sl in enumerate(ndimage.find_objects(lab), 1):
        m = lab[sl] == i
        x0, y0, x1, y1 = sl[1].start, sl[0].start, sl[1].stop, sl[0].stop
        bw, bh = x1 - x0, y1 - y0
        if m.sum() < W * H * 0.003 or m.sum() / (bw * bh) < 0.45 or x0 <= 2 or x1 >= W - 2:
            continue
        d = dict(box=(x0, y0, x1, y1))
        (vakken['rond'] if bw < bh * 1.5 else vakken['goud']).append(d)
    for v in vakken.values():
        v.sort(key=lambda d: (d['box'][1], d['box'][0]))
    _CACHE[k] = (im, vakken)
    return im, vakken


# ---------------- tekst in vakken ----------------

def _past(t, soort, start, maxw, maxh, max_regels=2, afstand=1.12):
    g = int(start)
    while g > 12:
        f = S.font(soort, g)
        rr = S.regels(t, f, maxw)
        if len(rr) <= max_regels and len(rr) * g * afstand <= maxh:
            return f, rr
        g -= 2
    f = S.font(soort, 12)
    return f, S.regels(t, f, maxw)


def tekst_in(laag, box, t, soort, start, kleur, max_regels=2, rechts_vrij=0.0, afstand=1.12):
    x0, y0, x1, y1 = box
    bw, bh = x1 - x0, y1 - y0
    pad_x = bh * 0.35
    vrij = bw * rechts_vrij
    maxw = bw - 2 * pad_x - vrij
    f, rr = _past(t, soort, bh * 0.5, maxw, bh * 0.78, max_regels, afstand)
    lh = f.size * afstand
    y = y0 + (bh - lh * len(rr)) / 2 - f.size * (0.1 if soort == 'kop' else 0.04)
    for r_ in rr:
        x = x0 + pad_x + (maxw - S.breedte(r_, f)) / 2
        S.schrijf(laag, (x, y), r_, f, kleur)
        y += lh


def titel_in(laag, box, goud_deel, rest, klein=''):
    """Gouden eerste deel + marine rest (+ kleine regel) in een crème vak."""
    x0, y0, x1, y1 = box
    bw, bh = x1 - x0, y1 - y0
    maxw = bw - bh * 0.6
    delen = []
    if goud_deel:
        delen.append(['kop', goud_deel, 1.0, GOUD_TEKST, 1])
    if rest:
        delen.append(['kop', rest, 0.68 if goud_deel else 1.0, DONKER, 2])
    if klein:
        delen.append(['Medium', klein, 0.42 if goud_deel else 0.5, (92, 80, 62), 2])
    g = bh * 0.7 if goud_deel else bh * 0.48
    while g > 10:
        lagen, tot = [], 0
        for soort, t, fac, kleur, mr in delen:
            f = S.font(soort, max(10, g * fac))
            rr = S.regels(t, f, maxw)
            if len(rr) > mr:
                break
            lagen.append((f, rr, kleur)); tot += len(rr) * f.size * 1.1
        else:
            if tot <= bh * 0.86:
                break
        g -= 2
    y = y0 + (bh - tot) / 2
    for f, rr, kleur in lagen:
        for r_ in rr:
            S.schrijf(laag, (x0 + (bw - S.breedte(r_, f)) / 2, y - f.size * 0.1), r_, f, kleur)
            y += f.size * 1.1


def foto_in(laag, vak, foto, zoom=1.0, dx=0, marge=0.07, alpha=1.0, dy=0):
    x0, y0, x1, y1 = vak['box']
    bw, bh = x1 - x0, y1 - y0
    p = int(min(bw, bh) * marge)
    f = foto.copy()
    f.thumbnail((bw - 2 * p, bh - 2 * p), Image.LANCZOS)
    if zoom != 1:
        f = f.resize((max(1, int(f.width * zoom)), max(1, int(f.height * zoom))), Image.BILINEAR)
    stuk = Image.new('RGBA', (bw, bh), (255, 255, 255, 0))
    stuk.paste(f.convert('RGBA'), (int((bw - f.width) / 2 + dx), int((bh - f.height) / 2 + dy)))
    wit = Image.new('RGBA', (bw, bh), (255, 255, 255, 255))
    wit.alpha_composite(stuk)
    m = Image.fromarray((vak['masker'][y0:y1, x0:x1] * 255).astype('uint8'))
    if alpha < 1:
        m = m.point(lambda v: int(v * alpha))
    laag.paste(wit.convert('RGB'), (x0, y0), m)


def _knop_box(vakken, onder_y=None):
    gs = vakken['goud']
    if onder_y is not None:
        gs = [g for g in gs if g['box'][1] > onder_y] or gs
    return gs[-1]['box'] if gs else None


def _prijs(p):
    return '€ ' + ('%.2f' % p).replace('.', ',')


# ---------------- plaatjes ----------------

def overzicht(soort, szn, W, H, plan, fotos, n_ideeen=None, pin=False):
    img, v = laad(soort, szn, W, H)
    img = img.copy()
    titel_plan = dict(plan)
    if pin:
        titel_plan['titel'] = plan.get('pin_titel', plan['titel'])
    g, w = S.titel_split(titel_plan)
    if not plan.get('titel_goud') and len(titel_plan['titel']) <= 22:
        g, w = titel_plan['titel'], ''      # korte titel: in één regel, groot en goud
    if v['creme']:
        titel_in(img, v['creme'][0]['box'], g, w)
    sub = (plan.get('pin_sub') if pin else None) or plan.get('subtitel', '')
    wit_y = v['wit'][0]['box'][1] if v['wit'] else H / 2
    linten = [x for x in v['goud'] if x['box'][3] <= wit_y]
    if sub and linten:
        tekst_in(img, linten[-1]['box'], sub, 'kop', 40, DONKER, 1)
    for f, vak in zip(fotos[:4], v['wit']):
        foto_in(img, vak, f)
    kb = _knop_box(v, v['wit'][-1]['box'][3] if v['wit'] else None)
    if kb:
        tekst_in(img, kb, S._knoptekst(plan, n_ideeen), 'Bold', 46, DONKER, 1, rechts_vrij=0.14)
    return img


def product(soort, szn, W, H, p, nr=None):
    img, v = laad(soort, szn, W, H)
    img = img.copy()
    if v['wit']:
        foto_in(img, v['wit'][0], p['foto'])
    if v['creme']:
        titel_in(img, v['creme'][0]['box'], '', p['naam'], p.get('regel', ''))
    kb = _knop_box(v)
    if kb:
        tekst_in(img, kb, _prijs(p['prijs']), 'Bold', 50, DONKER, 1)
    if nr and v['rond']:
        tekst_in(img, v['rond'][0]['box'], '#%d' % nr, 'kop', 60, DONKER, 1)
    return img


def einde(szn, W, H, plan, n=None):
    img, v = laad('reel-einde', szn, W, H)
    img = img.copy()
    klein = ('Welke kies jij? Zet 1 t/m %d in de reacties 👇' % n) if n else 'Sla dit bericht op voor je cadeaulijstje'
    if v['creme']:
        titel_in(img, v['creme'][0]['box'], '', plan.get('eindvraag', 'Nog meer cadeau-ideeën?'), klein)
    kb = _knop_box(v)
    if kb:
        tekst_in(img, kb, 'Kijk op leukekeuze.nl', 'Bold', 46, DONKER, 1, rechts_vrij=0.14)
    return img


# ---------------- reel ----------------

def maak_reel(plan, ps, uit, ff, szn, W=1080, H=1920, fps=30):
    n = len(ps)
    T_HOOK, T_PROD, T_TROM, T_EEN, T_EIND = 2.5, 2.7, 1.5, 3.5, 3.0   # tempo tussen 'te gehaast' en 'te traag'
    segs = [('hook', T_HOOK)]
    for i in range(n - 1, -1, -1):
        if i == 0:
            segs += [('trom', T_TROM), ('prod', T_EEN, 0)]
        else:
            segs.append(('prod', T_PROD, i))
    segs.append(('eind', T_EIND))
    totaal = sum(x[1] for x in segs)
    N = int(round(totaal * fps))

    leeg, v = laad('reel-product', szn, W, H)
    vak = v['wit'][0] if v['wit'] else None
    creme = v['creme'][0]['box'] if v['creme'] else None
    knop = _knop_box(v)
    rond = v['rond'][0]['box'] if v['rond'] else None

    def tekstlaag(teken):
        l = Image.new('RGBA', (W, H), (0, 0, 0, 0)); teken(l); return l

    # opening: wazige nummer 1 met een gouden vraagteken
    top = ps[0]['foto'].copy().filter(ImageFilter.GaussianBlur(28))
    top = ImageEnhance.Brightness(top).enhance(0.55)
    hook_basis = leeg.copy()
    if vak:
        foto_in(hook_basis, vak, top, zoom=1.25, marge=0)
        x0, y0, x1, y1 = vak['box']
        vq = S.goud_tekst('?', S.font('kop', (y1 - y0) * 0.55), W)
        hb = hook_basis.convert('RGBA'); hb.alpha_composite(vq, (int((x0 + x1 - vq.width) / 2), int((y0 + y1 - vq.height) / 2))); hook_basis = hb.convert('RGB')
    hook_t = tekstlaag(lambda l: (creme and titel_in(l, creme, '', plan.get('pov', '') or plan.get('titel', ''))))
    hook_k = tekstlaag(lambda l: (knop and tekst_in(l, knop, plan.get('hook') or 'Wacht tot je nummer 1 ziet 👀', 'Bold', 44, DONKER, 1)))
    hook_r = tekstlaag(lambda l: (rond and tekst_in(l, rond, '?', 'kop', 60, DONKER, 1)))

    trom_basis, ve = laad('reel-einde', szn, W, H)
    trom_t = tekstlaag(lambda l: (ve['creme'] and titel_in(l, ve['creme'][0]['box'], 'En nummer 1', 'is…')))
    trom_k = tekstlaag(lambda l: (_knop_box(ve) and tekst_in(l, _knop_box(ve), 'Blijf kijken 👀', 'Bold', 44, DONKER, 1, rechts_vrij=0.14)))
    eind = einde(szn, W, H, plan, n).convert('RGB')

    lagen = {}
    for i, p in enumerate(ps):
        lagen[i] = dict(
            naam=tekstlaag(lambda l, p=p: creme and titel_in(l, creme, '', p['naam'], p.get('regel', ''))),
            prijs=tekstlaag(lambda l, p=p: knop and tekst_in(l, knop, _prijs(p['prijs']), 'Bold', 50, DONKER, 1)),
            nr=tekstlaag(lambda l, i=i: rond and tekst_in(l, rond, '#%d' % (i + 1), 'kop', 60, DONKER, 1)))

    # sterretjes/sneeuw die de hele reel zachtjes naar beneden dwarrelen (altijd beweging in beeld)
    rnd = random.Random(int(plan.get('datum', '2026').replace('-', '')[:8] or 1))
    deeltjes = [dict(x=rnd.uniform(0, W), y=rnd.uniform(0, H), v=rnd.uniform(35, 110), r=rnd.uniform(2, 5.5),
                     zw=rnd.uniform(10, 30), f=rnd.uniform(0, 6.28), goud=rnd.random() < 0.55) for _ in range(55)]

    def sterren(doek, t):
        laag = Image.new('RGBA', (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(laag)
        for q in deeltjes:
            y = (q['y'] + q['v'] * t) % (H + 40) - 20
            x = q['x'] + q['zw'] * math.sin(t * 1.1 + q['f'])
            a = 0.45 + 0.55 * (0.5 + 0.5 * math.sin(t * 3.0 + q['f'] * 2))
            k = (255, 214, 120) if q['goud'] else (255, 255, 255)
            r = q['r']
            d.ellipse((x - r * 2.2, y - r * 2.2, x + r * 2.2, y + r * 2.2), fill=k + (int(40 * a),))
            d.ellipse((x - r, y - r, x + r, y + r), fill=k + (int(230 * a),))
        doek.alpha_composite(laag)

    def zoom_beeld(fr, z):
        if z <= 1.001:
            return fr
        w2, h2 = int(W / z), int(H / z)
        x0, y0 = (W - w2) // 2, (H - h2) // 2
        return fr.crop((x0, y0, x0 + w2, y0 + h2)).resize((W, H), Image.BILINEAR)

    # reclame-effecten: lichtflits, glimstreep over de foto en een korte 'klap' van het hele beeld
    def flits(fr, sterkte):
        if sterkte > 0.01:
            fr.alpha_composite(Image.new('RGBA', (W, H), (255, 248, 230, int(255 * min(1, sterkte)))))

    def glim(fr, box, x):
        if not box or not 0 < x < 1:
            return
        x0, y0, x1, y1 = box; bw, bh = x1 - x0, y1 - y0
        band = Image.new('RGBA', (bw, bh), (0, 0, 0, 0)); d = ImageDraw.Draw(band)
        cx = -bw * 0.4 + x * bw * 1.8; b = bw * 0.16
        d.polygon([(cx, 0), (cx + b, 0), (cx + b - bh * 0.35, bh), (cx - bh * 0.35, bh)], fill=(255, 255, 255, 110))
        band = band.filter(ImageFilter.GaussianBlur(10))
        if vak is not None and box == vak['box']:
            m = Image.fromarray((vak['masker'][y0:y1, x0:x1] * 255).astype('uint8'))
            band.putalpha(Image.fromarray(np.minimum(np.array(band.split()[3]), np.array(m))))
        fr.alpha_composite(band, (x0, y0))

    def schud(fr, s):
        if s < 0.5:
            return fr
        n = Image.new('RGBA', (W, H)); n.paste(fr, (int(s * math.sin(s * 7.3)), int(s * math.cos(s * 5.1)))); return n

    def met_alpha(laag, a):
        if a >= 1:
            return laag
        l = laag.copy(); l.putalpha(l.split()[3].point(lambda x: int(x * max(0, a)))); return l

    def pop_laag(doek, laag, box, sc):
        if sc <= 0.01 or not box:
            return
        x0, y0, x1, y1 = box
        cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
        stuk = laag.crop((int(x0 - 10), int(y0 - 10), int(x1 + 10), int(y1 + 10)))
        w2, h2 = max(1, int(stuk.width * sc)), max(1, int(stuk.height * sc))
        stuk = stuk.resize((w2, h2), Image.BILINEAR)
        doek.alpha_composite(stuk, (int(cx - w2 / 2), int(cy - h2 / 2)))

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
                fr = hook_basis.copy().convert('RGBA')
                fr.alpha_composite(met_alpha(hook_t, S._ease(lt / 0.6)))
                pop_laag(fr, hook_k, knop, S._pop((lt - 0.4) / 0.5) * (1 + 0.04 * math.sin(max(0, lt - 0.9) * 6)))
                pop_laag(fr, hook_r, rond, 1 + 0.12 * abs(math.sin(lt * 4)))
                fr = zoom_beeld(fr, 1 + 0.05 * lt / T_HOOK)
            elif soort == 'trom':
                fr = trom_basis.copy().convert('RGBA')
                pop_laag(fr, trom_t, ve['creme'][0]['box'] if ve['creme'] else None, S._pop(lt / 0.5))
                fr.alpha_composite(met_alpha(trom_k, S._ease((lt - 0.4) / 0.4)))
                fr = zoom_beeld(fr, 1 + 0.08 * S._ease(lt / T_TROM))
                flits(fr, 0.25 * (1 - lt / 0.15) if lt < 0.15 else 0)
            elif soort == 'prod':
                i = seg[2]; dur = seg[1]; L = lagen[i]
                fr = leeg.copy()
                if vak:
                    bw = vak['box'][2] - vak['box'][0]; bh = vak['box'][3] - vak['box'][1]
                    zweef = 9 * math.sin(lt * 2.6)
                    if i == 0:
                        foto_in(fr, vak, ps[i]['foto'], zoom=0.55 + 0.45 * S._pop(lt / 0.7) + 0.08 * (lt / dur), dy=zweef)
                    else:
                        kant = i % 3          # 0 van rechts, 1 van links, 2 van onder
                        inn = 1 - S._ease(lt / 0.45)
                        uit_ = S._ease((lt - (dur - 0.3)) / 0.3) if lt > dur - 0.3 else 0
                        dx = (bw * inn if kant == 0 else -bw * inn if kant == 1 else 0) - bw * 1.1 * uit_
                        dy = (bh * inn if kant == 2 else 0) + zweef
                        foto_in(fr, vak, ps[i]['foto'], zoom=1.0 + 0.10 * (lt / dur), dx=dx, dy=dy)
                fr = fr.convert('RGBA')
                pop_laag(fr, L['nr'], rond, S._pop((lt - 0.15) / 0.4) * (1 + 0.06 * math.sin(max(0, lt - 0.6) * 5)))
                fr.alpha_composite(met_alpha(L['naam'], S._ease((lt - 0.35) / 0.4)))
                pop_laag(fr, L['prijs'], knop, S._pop((lt - 0.7) / 0.45) * (1 + 0.035 * math.sin(max(0, lt - 1.2) * 5)))
                if vak:
                    glim(fr, vak['box'], (lt - 0.5) / 0.7)
                if knop:
                    glim(fr, knop, (lt - 1.3) / 0.5)
                # klap + flits bij elk nieuw product; bij nummer 1 extra groot met een schok
                fr = zoom_beeld(fr, 1 + (0.10 if i == 0 else 0.05) * (1 - S._ease(lt / 0.35)))
                flits(fr, (0.55 if i == 0 else 0.22) * (1 - lt / 0.18) if lt < 0.18 else 0)
                if i == 0:
                    fr = schud(fr, 14 * (1 - lt / 0.45) if lt < 0.45 else 0)
            else:
                fr = (Image.blend(leeg, eind, S._ease(lt / 0.5)) if lt < 0.5 else eind).convert('RGBA')
                fr = zoom_beeld(fr, 1 + 0.04 * lt / T_EIND)
            sterren(fr, t)
            d = ImageDraw.Draw(fr)
            d.rectangle((0, H - 10, int(W * t / totaal), H), fill=S.GOUD)
            proc.stdin.write(fr.convert('RGB').tobytes())
        proc.stdin.close()
        proc.wait()
    except Exception:
        proc.kill()
        raise
    return proc.returncode == 0
