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
    ('x-woodwick.json', 'WoodWick', ''),
    ('x-wijnkring.json', 'Wijnkring', ''),
    ('x-kerstland.json', 'Kerstland', ''),
    ('x-fietsparadijs.json', 'Fietsparadijs', ''),
    ('x-fietstas.json', 'Fietstas.com', ''),
    ('x-svinando.json', 'Svinando', ''),
    ('x-westwing.json', 'Westwing', ''),
    # oude, kleinere La Redoute-uittreksels (alleen als de volledige feed er niet is)
    ('x-lr-wonen-cadeau.json', 'La Redoute', ''),
]
# Bewust NIET: Mijn Hummeltje (dropshipping, wens van Marius).
FR = [(r'\bsac\b', 'tas'), (r'pochette', 'tasje clutch'), (r'collier', 'ketting'), (r'bracelet', 'armband'), (r"boucles", 'oorbellen'),
      (r'\bbague', 'ring'), (r'echarpe|écharpe|foulard|étole', 'sjaal'), (r'ceinture', 'riem'), (r'\bpull', 'trui'), (r'cardigan', 'vest'),
      (r'\brobe', 'jurk'), (r'manteau|blouson|veste|trench', 'jas'), (r'portefeuille|porte-monnaie|porte-cartes', 'portemonnee'),
      (r'\bgants', 'handschoenen'), (r'chemise', 'blouse overhemd'), (r'pantalon', 'broek'), (r'\bjupe', 'rok'), (r'cachemire', 'kasjmier'),
      (r'\bcuir', 'leer'), (r'sac à dos', 'rugzak'), (r'baskets|sneakers', 'sneakers schoenen'), (r'bottines|boots', 'laarzen')]
OVERSLAAN = re.compile(r'\b(sokken|sportsokken|kersttrui - maat|cadeaubon|verzendkosten|statiegeld)\b', re.I)
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
        # Kerstland zet kleur/maat achter ' | ': één per soort tonen, en de streepjes netjes als komma's.
        k = basis(x['titel'].split(' | ')[0]).lower()
        if k in gezien: continue
        x['titel'] = x['titel'].replace(' | ', ', ')
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

# ---- Kleine bestanden per (sub)categorie, zodat een telefoon niet het hele bestand hoeft te laden ----
# Zelfde regels als vulAlleWinkels in assets/js/app.js: zoekwoorden (een van de woorden), nietwoorden, geslacht, maximumprijs.
def lees_js_obj(naam):
    js = open('assets/js/data.js', encoding='utf-8').read()
    m = re.search(r'window\.' + naam + r'\s*=\s*(\{.*?\n\});', js, re.S)
    body = re.sub(r'/\*.*?\*/', '', m.group(1), flags=re.S)
    return json.loads(re.sub(r',\s*}', '}', body))
ZW = lees_js_obj('LK_ZOEKWOORDEN'); NW = lees_js_obj('LK_NIETWOORDEN')
CATS = re.findall(r"\{ slug: '([a-z0-9-]+)', naam: '[^']*', kort:", open('assets/js/data.js', encoding='utf-8').read())
SUBS = {}
for c in CATS:
    blok = re.search(r"slug: '" + c + r"', naam:.*?subs: \[(.*?)\] \}", open('assets/js/data.js', encoding='utf-8').read(), re.S)
    SUBS[c] = re.findall(r"\{ slug: '([a-z0-9-]+)'", blok.group(1)) if blok else []
def norm(t): return ' ' + re.sub(r'[^a-z0-9à-ÿ€]+', ' ', t.lower())
def heeft(z, w): return (' ' + w) in z if len(w) >= 5 else (' ' + w + ' ') in (z + ' ')
rijen = []
for x in kort:
    w = W[x[2]]
    z = norm(x[0] + ' ' + x[5] + ' ' + x[6] + ' ' + w['naam']); tl = norm(x[0])
    rijen.append((x, z, tl, x[7] or ''))
os.makedirs('assets/zoek/w', exist_ok=True)
for f in os.listdir('assets/zoek/w'): os.remove(os.path.join('assets/zoek/w', f))
aantal = {}
for c in CATS:
    for sleutel in [c] + [c + '/' + s for s in SUBS[c]]:
        gesl = ''; maxp = 0; ofw = []
        if sleutel == 'cadeaus/voor-haar': gesl = 'v'
        elif sleutel == 'cadeaus/voor-hem': gesl = 'm'
        elif sleutel == 'cadeaus/onder-15': maxp = 15
        elif sleutel in ZW: ofw = ZW[sleutel].split()
        else: continue
        niet = NW.get(sleutel, '').split()
        sel = []
        for x, z, tl, g in rijen:
            if maxp and x[1] >= maxp: continue
            if gesl and g != gesl: continue
            if niet and any(heeft(tl, n) for n in niet): continue
            if ofw and not any(heeft(z, o) for o in ofw): continue
            sel.append(x)
        # Niet meer dan MAXR per pagina: om en om uit elke winkel, zodat de mix van winkels blijft.
        MAXR = 2500
        if len(sel) > MAXR:
            perw = {}
            for x in sel: perw.setdefault(x[2], []).append(x)
            sel = []; r = 0
            while len(sel) < MAXR:
                for ws in perw.values():
                    if r < len(ws): sel.append(ws[r])
                r += 1
            sel = sel[:MAXR]
        naam = sleutel.replace('/', '--') + '.json'
        json.dump({'winkels': W, 'producten': sel}, open(os.path.join('assets/zoek/w', naam), 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
        aantal[sleutel] = len(sel)
print('per pagina:', sum(aantal.values()), 'rijen in', len(aantal), 'bestanden; grootste:', sorted(aantal.items(), key=lambda a: -a[1])[:5])
