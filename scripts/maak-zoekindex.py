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
    ('x-dropwinkel.json', 'Dropwinkel', ''),
    ('x-teufel.json', 'Teufel', ''),
    ('x-zadig.json', 'Zadig & Voltaire', ''),
    ('x-bloompost.json', 'Bloompost', ''),
    ('x-laredoute-wonen.json', 'La Redoute', ''),
    ('x-lego.json', 'LEGO', ''),
    ('x-bartogi.json', 'Bartogi', ''),
    ('x-myka.json', 'Myka', ''),
    ('x-prydligt.json', 'Prydligt', ''),
    ('x-invicta.json', 'Invicta', ''),
    # oude, kleinere La Redoute-uittreksels (alleen als de volledige feed er niet is)
    ('x-lr-wonen-cadeau.json', 'La Redoute', ''),
]
# Bewust NIET: Mijn Hummeltje (dropshipping, wens van Marius).
FR = [(r'\bsac\b', 'tas'), (r'pochette', 'tasje clutch'), (r'collier', 'ketting'), (r'bracelet', 'armband'), (r"boucles", 'oorbellen'),
      (r'\bbague', 'ring'), (r'echarpe|écharpe|foulard|étole', 'sjaal'), (r'ceinture', 'riem'), (r'\bpull', 'trui'), (r'cardigan', 'vest'),
      (r'\brobe', 'jurk'), (r'manteau|blouson|veste|trench', 'jas'), (r'portefeuille|porte-monnaie|porte-cartes', 'portemonnee'),
      (r'\bgants', 'handschoenen'), (r'chemise', 'blouse overhemd'), (r'pantalon', 'broek'), (r'\bjupe', 'rok'), (r'cachemire', 'kasjmier'),
      (r'\bcuir', 'leer'), (r'sac à dos', 'rugzak'), (r'baskets|sneakers', 'sneakers schoenen'), (r'bottines|boots', 'laarzen')]
OVERSLAAN = re.compile(r'\b(sokken|kersttrui - maat|cadeaubon|verzendkosten|statiegeld)\b', re.I)
def basis(t):
    t = re.sub(r',?\s*Grootte:.*$', '', t)                      # Dr. Martens maten
    t = re.sub(r'\s+\d+([,.]\d+)?\s*(cl|l|liter)\.?\s*$', '', t, flags=re.I)  # Decantalo formaten
    t = re.sub(r'\s+(Geschenk|Magnum)\s*$', '', t, flags=re.I)
    t = re.sub(r'\s+(19|20)\d\d\s*$', '', t)                     # jaartallen wijn
    return re.sub(r'\s+', ' ', t).strip()
uit = []; per = {}; gezienPer = {}
for bestand, winkel, b in WINKELS:
    pad = os.path.join(M, bestand)
    if not os.path.exists(pad): print('ontbreekt', bestand); continue
    gezien = gezienPer.setdefault(winkel, {})
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
        if winkel == 'Zadig & Voltaire':
            cat = ' '.join(nl for fr, nl in FR if re.search(fr, x['titel'], re.I)) or cat
        g = (x.get('gender') or '').lower(); g = 'v' if g == 'female' else ('m' if g == 'male' else '')
        uit.append([basis(x['titel'])[:120], round(prijs, 2), winkel, x['link'], foto, cat[:40], (x.get('merk') or '')[:40], g])
    per[winkel] = len(gezien)
# Kleiner maken: per winkel het gezamenlijke begin van links en foto's maar één keer opslaan.
def begin(l):
    s = min(l); e = max(l); i = 0
    while i < len(s) and s[i] == e[i]: i += 1
    return s[:i]
namen = sorted(set(x[2] for x in uit)); W = []
for n in namen:
    xs = [x for x in uit if x[2] == n]
    W.append({'naam': n, 'link': begin([x[3] for x in xs]), 'foto': begin([x[4] for x in xs])})
idx = {w['naam']: i for i, w in enumerate(W)}
kort = []
for x in uit:
    w = W[idx[x[2]]]
    kort.append([x[0], x[1], idx[x[2]], x[3][len(w['link']):], x[4][len(w['foto']):], x[5], x[6], x[7]])
os.makedirs('assets/zoek', exist_ok=True)
json.dump({'winkels': W, 'velden': ['titel', 'prijs', 'winkel', 'link', 'foto', 'cat', 'merk', 'geslacht'], 'producten': kort},
          open('assets/zoek/winkels.json', 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
print(per, len(uit), os.path.getsize('assets/zoek/winkels.json') // 1024, 'kB')
