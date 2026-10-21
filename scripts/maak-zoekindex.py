"""Maakt assets/zoek/winkels.json: alle producten uit de feeds van de winkels, compact, om in te zoeken.
Gebruik: python3 scripts/maak-zoekindex.py <map met x-*.json>"""
import json, re, sys, os, ast
M = sys.argv[1]
WINKELS = [  # (feedbestand, winkelnaam, basis-url voor relatieve links)
    ('x-dille.json', 'Dille & Kamille', 'https://www.dille-kamille.nl/'),
    ('x-decantalo1.json', 'Decantalo', 'https://www.decantalo.com/'),
    ('x-999-alles.json', '999 Games', 'https://www.999games.nl/'),
    ('x-drmartens.json', 'Dr. Martens', ''),
    ('x-dvzn.json', 'Ditverzinjeniet', 'https://www.ditverzinjeniet.nl/'),
]
OVERSLAAN = re.compile(r'\b(sokken|kersttrui - maat|cadeaubon|verzendkosten|statiegeld)\b', re.I)
def basis(t):
    t = re.sub(r',?\s*Grootte:.*$', '', t)                      # Dr. Martens maten
    t = re.sub(r'\s+\d+([,.]\d+)?\s*(cl|l|liter)\.?\s*$', '', t, flags=re.I)  # Decantalo formaten
    t = re.sub(r'\s+(Geschenk|Magnum)\s*$', '', t, flags=re.I)
    t = re.sub(r'\s+(19|20)\d\d\s*$', '', t)                     # jaartallen wijn
    return re.sub(r'\s+', ' ', t).strip()
uit = []; per = {}
for bestand, winkel, b in WINKELS:
    pad = os.path.join(M, bestand)
    if not os.path.exists(pad): print('ontbreekt', bestand); continue
    gezien = {}
    for x in json.load(open(pad, encoding='utf-8')):
        # Ditverzinjeniet zet voorraad altijd op 'false'; daar negeren we dat veld.
        if winkel != 'Ditverzinjeniet' and str(x.get('voorraad', 'true')).lower() in ('false', 'out of stock', 'out_of_stock', '0'): continue
        try: prijs = float(x.get('prijs') or 0)
        except ValueError: continue
        if prijs <= 0 or OVERSLAAN.search(x['titel']): continue
        f = x.get('fotos') or ['']
        if isinstance(f, str): f = ast.literal_eval(f) if f.startswith('[') else [f]
        foto = (f or [''])[0].split('|')[0]
        if not foto: continue
        k = basis(x['titel']).lower()
        if k in gezien: continue
        gezien[k] = 1
        cat = (x.get('cat') or '').strip()
        uit.append([basis(x['titel'])[:120], round(prijs, 2), winkel, x['link'], foto, cat[:40], (x.get('merk') or '')[:40]])
    per[winkel] = len(gezien)
os.makedirs('assets/zoek', exist_ok=True)
json.dump({'velden': ['titel', 'prijs', 'winkel', 'link', 'foto', 'cat', 'merk'], 'producten': uit},
          open('assets/zoek/winkels.json', 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
print(per, len(uit), os.path.getsize('assets/zoek/winkels.json') // 1024, 'kB')
