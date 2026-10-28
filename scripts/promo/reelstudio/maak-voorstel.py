# -*- coding: utf-8 -*-
"""Reelstudio: maak een voorstel (kandidaat-producten per thema) voor Marius.
Gebruik: python3 maak-voorstel.py voorstel.json uitmap [gepost-ids.txt]
voorstel.json = {"id": "...", "datum": "2026-10-31", "themas": [{"id","naam","uitleg","seizoen","titel","subtitel","pov","hook","eindvraag","link","kandidaten":[ids]}]}
Maakt in uitmap: reel-voorstel.js en fotos/<id>.webp. Producten die al gepost zijn, worden overgeslagen."""
import json, os, sys, shutil
from PIL import Image
REPO = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
src = open(os.path.join(REPO, 'assets/js/producten.js'), encoding='utf-8').read()
P = {}
for l in src.split('\n'):
    l = l.strip().rstrip(',')
    if l.startswith('{"id"'):
        o = json.loads(l); P[o['id']] = o
v = json.load(open(sys.argv[1], encoding='utf-8')); uit = sys.argv[2]
gepost = set()
if len(sys.argv) > 3 and os.path.exists(sys.argv[3]):
    gepost = {x.strip().lstrip('﻿') for x in open(sys.argv[3], encoding='utf-8') if x.strip()}
os.makedirs(os.path.join(uit, 'fotos'), exist_ok=True)
for t in v['themas']:
    k = []
    for i in t['kandidaten']:
        if i in gepost: print('al gepost, overgeslagen:', i); continue
        p = P.get(i)
        if not p: print('niet op de site:', i); continue
        f = os.path.join(REPO, 'images/producten', i + '.webp')
        if os.path.exists(f):
            im = Image.open(f).convert('RGB'); im.thumbnail((700, 700)); im.save(os.path.join(uit, 'fotos', i + '.jpg'), quality=86)
        k.append(dict(id=i, naam=p['titel'], kort=t.get('kort', {}).get(i, ''), regel=t.get('regels', {}).get(i, ''), prijs=p['prijs'],
                      shop=p['shop'], sfeer=bool(p.get('sfeer')), waarom=p.get('waarom', ''), foto='fotos/' + i + '.jpg',
                      link='https://leukekeuze.nl/p/' + i + '/'))
    t['kandidaten'] = k
    t.pop('kort', None); t.pop('regels', None)
    print(t['id'], len(k), 'kandidaten')
open(os.path.join(uit, 'reel-voorstel.js'), 'w', encoding='utf-8').write(
    '/* Reelstudio – voorstel van Claude. */\nwindow.RS_VOORSTEL = ' + json.dumps(v, ensure_ascii=False, indent=1) + ';\n')
