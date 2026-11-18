import sys, math
from PIL import Image, ImageDraw, ImageFilter, ImageChops
R = '/home/claude/leukekeuze-nieuw/images/producten/'
S = sys.argv[1]
def pak(i):
    im = Image.open(R + i + '.webp').convert('RGB')
    g = im.convert('L').point(lambda v: 255 if v > 238 else 0)
    w, h = g.size
    for xy in [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1), (w // 2, 0), (w // 2, h - 1), (0, h // 2), (w - 1, h // 2)]:
        if g.getpixel(xy) == 255: ImageDraw.floodfill(g, xy, 128)
    a = g.point(lambda v: 0 if v == 128 else 255).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.MaxFilter(3))
    im = im.convert('RGBA'); im.putalpha(a)
    return im.crop(a.getbbox())
def schaduw(im, r=18, o=(10, 16), alpha=110):
    a = im.split()[3]; sh = Image.new('RGBA', (im.width + 4 * r, im.height + 4 * r), (0, 0, 0, 0))
    m = Image.new('L', sh.size, 0); m.paste(a.point(lambda v: alpha if v > 0 else 0), (2 * r + o[0], 2 * r + o[1]))
    m = m.filter(ImageFilter.GaussianBlur(r)); sh.putalpha(m)
    sh.alpha_composite(im, (2 * r, 2 * r)); return sh
def boosters(ids, uit, W=1920, H=1840, rijen=4, per=9):
    doek = Image.new('RGBA', (W, H), (255, 255, 255, 255))
    rows = [ids[k * per:(k + 1) * per] for k in range(rijen)]
    ph = 560; marge = 100
    vstep = (H - 60 - 95 - ph) / (rijen - 1)
    for r in reversed(range(rijen)):
        rij = rows[r]; n = len(rij)
        pw = int(ph * 0.56)
        step = (W - 2 * marge - pw) / (per - 1)
        x0 = marge + (per - n) * step / 2
        for k, i in enumerate(rij):
            p = pak(i); p = p.resize((int(p.width * ph / p.height), ph), Image.LANCZOS)
            hoek = (k - (n - 1) / 2) * -1.6 + (2.5 if (k + r) % 2 else -2.5)
            p = p.rotate(hoek, resample=Image.BICUBIC, expand=True)
            p = schaduw(p)
            cx = x0 + k * step + pw / 2; cy = 60 + r * vstep + ph / 2 + (abs(k - (n - 1) / 2) ** 2) * 2.2
            doek.alpha_composite(p, (int(cx - p.width / 2), int(cy - p.height / 2)))
    doek.convert('RGB').save(uit, quality=93)
def raster(ids, uit, W=1920, H=1920):
    doek = Image.new('RGB', (W, H), 'white'); c = W // 2
    for k, i in enumerate(ids):
        im = Image.open(R + i + '.webp').convert('RGB').resize((c, c), Image.LANCZOS)
        doek.paste(im, ((k % 2) * c, (k // 2) * c))
    d = ImageDraw.Draw(doek); d.line([(c, 40), (c, H - 40)], fill=(229, 215, 190), width=4); d.line([(40, c), (W - 40, c)], fill=(229, 215, 190), width=4)
    doek.save(uit, quality=93)
if __name__ == '__main__':
    import json
    cfg = json.load(open(S + '/collage.json'))
    boosters(cfg['packs'], S + '/c0.jpg')
    for k, ids in enumerate(cfg['grids']): raster(ids, S + '/c%d.jpg' % (k + 1))
    print('ok')
