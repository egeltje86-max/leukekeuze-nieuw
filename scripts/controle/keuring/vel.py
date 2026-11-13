# Contactvel: de cadeaus van een pagina als plaatjes met nummer, prijs, winkel en titel. python3 vel.py <toplijst.json> <pad> <uit.png> [van] [tot]
import json, sys, os
from PIL import Image, ImageDraw, ImageFont
R = '/home/claude/leukekeuze-nieuw/'
d = json.load(open(sys.argv[1])); L = d[sys.argv[2]]; van = int(sys.argv[4]) if len(sys.argv) > 4 else 0; tot = int(sys.argv[5]) if len(sys.argv) > 5 else len(L)
L = L[van:tot]; K = 6; B = 212; H = 270
try: f = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 13); fb = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 15)
except Exception: f = fb = ImageFont.load_default()
rijen = (len(L) + K - 1) // K; im = Image.new('RGB', (K * B, rijen * H), 'white'); dr = ImageDraw.Draw(im)
for i, x in enumerate(L):
    cx, cy = (i % K) * B, (i // K) * H
    bb = (x.get('beeld') or 'images/producten/' + x['id'])
    bb = bb.rsplit('.', 1)[0] if bb.rsplit('.', 1)[-1] in ('webp', 'jpg', 'png') else bb
    pad = next((q for q in (R + bb + '-klein.webp', R + bb + '.webp', R + 'images/producten/' + x['id'] + '-klein.webp') if os.path.isfile(q)), None)
    if pad:
        try: t = Image.open(pad).convert('RGB'); t.thumbnail((B - 12, 176)); im.paste(t, (cx + (B - t.width) // 2, cy + 22))
        except Exception: pass
    else: dr.text((cx + 40, cy + 90), 'GEEN FOTO', fill='red', font=fb)
    dr.rectangle([cx, cy, cx + B - 1, cy + H - 1], outline='#cccccc')
    dr.text((cx + 5, cy + 3), '%d  € %s  %s' % (van + i + 1, ('%.2f' % x['p']).replace('.', ',') if isinstance(x.get('p'), (int, float)) else '?', (x.get('w') or '')[:14]), fill='#b00020' if x.get('w') == 'bol' else 'black', font=fb)
    t = (x.get('t') or '')
    for r in range(3): dr.text((cx + 5, cy + 202 + r * 16), t[r * 29:(r + 1) * 29], fill='black', font=f)
    dr.text((cx + 5, cy + 252), (x.get('vak') or '').split('/', 1)[-1][:30], fill='#666666', font=f)
im.save(sys.argv[3]); print(sys.argv[3], im.size)
