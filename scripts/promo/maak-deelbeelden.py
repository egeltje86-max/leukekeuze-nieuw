# -*- coding: utf-8 -*-
"""Maakt per gids en categorie een mooi deelplaatje (1200 x 630) voor Facebook, WhatsApp en Pinterest.

Leest de gebouwde pagina's (gids/*/index.html en c/**/index.html), pakt de titel en de eerste productfoto's,
en zet ze in de LeukeKeuze-stijl (Nova-achtergrond, crème titelvak, witte kaarten met gouden rand).
Uitvoer: images/deel/<pad-met-streepjes>.jpg  (maak-paginas.js gebruikt die automatisch als og:image).

Gebruik:  python scripts/promo/maak-deelbeelden.py [seizoen]   (standaard: kerst)
"""
import os, re, sys, glob, html
from PIL import Image

HIER = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HIER, '..', '..'))
sys.path.insert(0, HIER)
import stijl6 as S

W, H = 1200, 630
UIT = os.path.join(REPO, 'images', 'deel')


def naam_voor(pad):
    return pad.strip('/').replace('/', '-') or 'home'


def foto(pad):
    for kandidaat in (pad, pad.replace('-klein.webp', '.webp')):
        f = os.path.join(REPO, kandidaat.lstrip('/'))
        if os.path.exists(f):
            im = Image.open(f).convert('RGBA')
            wit = Image.new('RGB', im.size, (255, 255, 255))
            wit.paste(im, mask=im.split()[3])
            return wit
    return None


def maak(titel, fotos, szn, uit):
    s = W / 1080
    img = S.achtergrond(W, H, szn, 3).convert('RGBA')
    # rechts: drie kaarten (of minder)
    n = min(3, len(fotos))
    kant = 215
    gap = 18
    x0 = W - 40 - n * kant - (n - 1) * gap
    y0 = (H - kant) // 2
    for i, f in enumerate(fotos[:n]):
        S.plak_kaart(img, f, x0 + i * (kant + gap), y0, kant, kant)
    # links: titelvak + knop
    links_w = x0 - 40 - 34
    g, w = (titel, '') if len(titel) <= 18 else S.titel_split({'titel': titel})
    if len(titel) > 18 and len(g) < 6:
        g, w = '', titel
    vak = S.creme_vak(g, w, W, s, links_w, 86 * s)
    knop = S.goud_knop('Bekijk de ideeën', S.font('Bold', 28), 28, 10, pijl=True)
    tot = vak.height + knop.height - 10
    y = (H - tot) / 2
    cx = 40 + links_w / 2
    img.alpha_composite(vak, (int(cx - vak.width / 2), int(y)))
    img.alpha_composite(knop, (int(cx - knop.width / 2), int(y + vak.height - 10)))
    img.convert('RGB').save(uit, quality=80, optimize=True)


def main():
    szn = sys.argv[1] if len(sys.argv) > 1 else 'kerst'
    os.makedirs(UIT, exist_ok=True)
    paginas = glob.glob(os.path.join(REPO, 'gids', '*', 'index.html')) + glob.glob(os.path.join(REPO, 'c', '**', 'index.html'), recursive=True)
    n = 0
    for f in sorted(paginas):
        h = open(f, encoding='utf-8').read()
        pad = '/' + os.path.relpath(os.path.dirname(f), REPO).replace(os.sep, '/') + '/'
        m = re.search(r'<h1[^>]*>(.*?)</h1>', h, re.S)
        if not m:
            continue
        titel = html.unescape(re.sub(r'<[^>]+>', '', m.group(1))).strip()
        titel = re.sub(r'\s+', ' ', titel)
        if len(titel) > 60:
            titel = titel.split(':')[0].strip()
        srcs = []
        for s_ in re.findall(r'src="(/?images/producten/[^"]+)"', h):
            if s_ not in srcs:
                srcs.append(s_)
        fotos = [x for x in (foto(s_) for s_ in srcs[:6]) if x is not None][:3]
        if not fotos:
            continue
        maak(titel, fotos, szn, os.path.join(UIT, naam_voor(pad) + '.jpg'))
        n += 1
    print('deelplaatjes gemaakt:', n)


if __name__ == '__main__':
    main()
