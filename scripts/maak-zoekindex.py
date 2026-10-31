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
    # TradeTracker (t-*.json, gemaakt met tt-uittreksel.py)
    ('t-dvzn.json', 'Ditverzinjeniet', ''),
    ('t-country-acc.json', 'Countrylifestyle', ''),
    ('t-country-licht.json', 'Countrylifestyle', ''),
    ('t-lamponline.json', 'Lamponline', ''),
    ('t-bellatio.json', 'Bellatio', ''),
    ('t-wijny.json', 'Wijny', ''),
    ('t-dgsw.json', 'De Grote Speelgoedwinkel', ''),
    ('t-animals.json', 'Animals Giftshop', ''),
    ('t-ijzersterk.json', 'IJzersterke geschenken', ''),
    ('t-coolgift.json', 'CoolGift', ''),
    ('t-gadgets.json', 'Gadgets en trends', ''),
    ('t-knuffelpar.json', 'Knuffelparadijs', ''),
    ('t-placethemoment.json', 'Place the Moment', ''),
    # Nieuw 30-10-2026
    ('t-hema.json', 'HEMA', ''),
    ('t-smartphoto.json', 'Smartphoto', ''),
    ('t-nedgame.json', 'Nedgame', ''),
    ('t-cadeaunl.json', 'Cadeau.nl', ''),
    ('t-grotekado.json', 'Grote Kadoshop', ''),
    ('t-kadoversturen.json', 'Kado-versturen', ''),
    ('t-yesgifts.json', 'Yesgifts', ''),
    ('t-cartoon.json', 'Cartoon Megastore', ''),
    ('t-fifties.json', 'Fiftiesstore', ''),
    ('t-italian.json', 'Italian Design', ''),
    ('t-kitchenette.json', 'Kitchenette', ''),
    ('t-lookinggood.json', 'Looking Good Today', ''),
    ('t-oogvoororen.json', 'Oog voor oren', ''),
    ('t-spaarpotten.json', 'Spaarpotten-winkel', ''),
    ('t-superzero.json', 'Superzero', ''),
    ('t-repeat.json', 'Repeat Cashmere', ''),
    ('t-barrelkings.json', 'Barrelkings', ''),
    ('t-aerovito.json', 'Aerovito', ''),
    ('t-boombrush.json', 'Boombrush', ''),
    ('t-bushpappa.json', 'Bushpappa', ''),
    ('t-applamp.json', 'Applamp', ''),
    ('t-getled.json', 'Getled', ''),
    ('t-lightdepot.json', 'Lightdepot', ''),
    ('t-badkamerradio.json', 'Badkamerradio', ''),
    ('t-bedroomshop.json', 'Bedroomshop', ''),
    ('t-meubello.json', 'Meubello', ''),
    ('t-prepz.json', 'Prepz', ''),
    ('t-topdealer.json', 'Topdealer', ''),
    ('t-fashionize.json', 'Fashionize', ''),
    ('t-247jeans.json', '247Jeans', ''),
    ('t-bivolino.json', 'Bivolino', ''),
    ('t-tenstickers.json', 'Tenstickers', ''),
    ('t-hobbymax.json', 'Hobbymax', ''),
    ('t-knuffelkado.json', 'Knuffelkado', ''),
    ('t-toppers.json', 'Toppers in Concert', ''),
    ('t-viparfum.json', 'Viparfum', ''),
    ('t-mobistoxx.json', 'Mobistoxx', ''),
]
# Daisycon staat op pauze (LK_INSTELLINGEN.daisyconPauze in assets/js/data.js): dan alleen TradeTracker-winkels in de index.
# Ditverzinjeniet komt altijd via TradeTracker (t-dvzn), niet meer via Daisycon (x-dvzn).
PAUZE = bool(re.search(r'daisyconPauze:\s*true', open('assets/js/data.js', encoding='utf-8').read()))
# Wens Marius (28-10-2026): ook tijdens de pauze ALLE winkels tonen, zodat bezoekers de echte, volle site zien.
# Tijdens de pauze sturen we Daisycon-links rechtstreeks naar de winkel (zonder Daisycon ertussen), dan werkt elke klik.
WINKELS = [w for w in WINKELS if w[0] != 'x-dvzn.json']
print('Daisycon-pauze:', PAUZE, '-', len(WINKELS), 'feeds')
from urllib.parse import urlparse, parse_qs
WINKELROOT = {'999 Games': 'https://www.999games.nl/', 'Bartogi': 'https://bartogi.nl/', 'Bloompost': 'https://www.bloompost.nl/',
              'Decantalo': 'https://www.decantalo.com/', 'Dille & Kamille': 'https://www.dille-kamille.nl/', 'Dropwinkel': 'https://www.dropwinkel.eu/',
              'Fietsparadijs': 'https://www.fietsparadijs.com/', 'Fietstas.com': 'https://www.fietstas.com/', 'Invicta': 'https://www.invictastores.eu/',
              'Kerstland': 'https://www.kerstland.nl/', 'La Redoute': 'https://www.laredoute.nl/', 'Myka': 'https://www.myka.com/',
              'Prydligt': 'https://www.prydligt.eu/', 'Svinando': 'https://www.svinando.nl/', 'Wijnkring': 'https://www.wijnkring.nl/',
              'WoodWick': 'https://woodwick.nl/'}
DAISYCON = re.compile(r'^https?://(lt45|fr135|bdt9|glp8|ds1|jdt8|rkn3|jf79)\.n[le]t?/c/|^https?://aff\.svinando\.be/c/')
def direct(link, winkel):
    """Daisycon-link -> gewone winkellink. murl= (volledige url) of dl= (pad achter de winkel). Lukt het niet: None."""
    q = parse_qs(urlparse(link).query)
    dl = (q.get('dl') or [''])[0]
    if not dl: return None
    if 'murl=' in dl:
        m = parse_qs(urlparse('x?' + dl.split('?', 1)[-1]).query).get('murl') or parse_qs(dl).get('murl')
        return m[0] if m and m[0].startswith('http') else None
    if dl.startswith('http'): return dl
    root = WINKELROOT.get(winkel)
    dl = re.sub(r'\.aspx(?=[a-z])', '.aspx?', dl)   # La Redoute: het vraagteken ontbreekt in de feed
    return root + dl.lstrip('/') if root else None
# Linkcheck 31-10-2026: bij deze winkels geeft de eigen TradeTracker-landingspagina (winkel.nl/...?tt=...&r=...) een 404.
# Via tc.tradetracker.net komt de bezoeker wel goed op de productpagina (met dezelfde tracking).
TT_TC = {'Looking Good Today', '247Jeans'}
def tt_tc(link):
    q = parse_qs(urlparse(link).query)
    tt = (q.get('tt') or [''])[0].split('_'); r = (q.get('r') or [''])[0]
    if len(tt) < 3 or not r.startswith('http'): return link
    from urllib.parse import quote
    return 'https://tc.tradetracker.net/?c=%s&m=%s&a=%s&r=&u=%s' % (tt[0], tt[1], tt[2], quote(r, safe=''))
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
        link = x['link']
        if PAUZE and DAISYCON.search(link):
            link = direct(link, winkel)
            if not link: continue
        if winkel in TT_TC: link = tt_tc(link)
        uit.append([basis(x['titel'])[:120], round(prijs, 2), winkel, link, foto, cat[:40], (x.get('merk') or '')[:40], g])
    per[winkel] = len(gezien)
if len(uit) < 1000:  # veiligheid: liever de oude index houden dan een (bijna) lege online zetten
    print('TE WEINIG producten (%d), index niet bijgewerkt' % len(uit)); sys.exit(1)
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
# Gespecialiseerde winkels alleen tonen bij de (sub)categorieën waar ze bij horen
# (anders komen bv. 'champagne'-kleurige kerstballen bij Bubbels of servetringen bij Ringen).
ALLEEN = {
    'Bellatio': ['cadeaus/adventskalenders', 'wonen', 'tuin-klussen/buitenverlichting'],
    'Lamponline': ['wonen/verlichting', 'tuin-klussen/buitenverlichting'],
    'Countrylifestyle': ['wonen', 'keuken', 'tuin-klussen', 'dieren/vogels'],
    'Wijny': ['dranken'],
    'Animals Giftshop': ['dieren', 'speelgoed', 'cadeaus/voor-kinderen'],
    'Knuffelparadijs': ['speelgoed', 'cadeaus/voor-kinderen', 'cadeaus/baby-kraam'],
    'Nedgame': ['elektronica', 'speelgoed'],
    'Kitchenette': ['keuken'], 'Italian Design': ['wonen', 'keuken'], 'Meubello': ['wonen'], 'Bedroomshop': ['wonen'], 'Tenstickers': ['wonen'],
    'Applamp': ['wonen/verlichting', 'tuin-klussen/buitenverlichting'], 'Getled': ['wonen/verlichting', 'tuin-klussen/buitenverlichting'],
    'Lightdepot': ['wonen/verlichting', 'tuin-klussen/buitenverlichting'], 'Mobistoxx': ['elektronica'], 'Badkamerradio': ['elektronica', 'wonen'],
    'Hobbymax': ['hobby', 'speelgoed'], 'Barrelkings': ['dranken'], 'Prepz': ['sport-outdoor'],
    'Superzero': ['mode-beauty'], 'Boombrush': ['mode-beauty'], 'Viparfum': ['mode-beauty'],
    'Looking Good Today': ['mode-beauty', 'sieraden'], 'Fashionize': ['mode-beauty', 'sieraden'],
    'De Grote Speelgoedwinkel': ['speelgoed', 'hobby', 'cadeaus/voor-kinderen', 'cadeaus/sinterklaas', 'cadeaus/sint-onder-15', 'cadeaus/adventskalenders', 'cadeaus/baby-kraam', 'boeken-media/kinderboeken', 'sport-outdoor'],
}
def norm(t): return ' ' + re.sub(r'[^a-z0-9à-ÿ€]+', ' ', t.lower())
def heeft(z, w): return (' ' + w) in z if len(w) >= 5 else (' ' + w + ' ') in (z + ' ')
rijen = []
for x in kort:
    w = W[x[2]]
    z = norm(x[0] + ' ' + x[5] + ' ' + x[6] + ' ' + w['naam']); tl = norm(x[0])
    rijen.append((x, z, tl, x[7] or ''))
# Per pagina hooguit MAXR producten, om en om uit elke winkel (anders staat bv. bovenaan alleen Myka).
# Klein houden: de pagina laadt dit pas als je naar beneden scrolt, maar het moet ook op een telefoon vlot gaan.
MAXR = 400
def mengen(sel):
    perw = {}
    for x in sel: perw.setdefault(x[2], []).append(x)
    uit = []; r = 0
    while len(uit) < MAXR and any(r < len(ws) for ws in perw.values()):
        for ws in perw.values():
            if r < len(ws): uit.append(ws[r])
        r += 1
    return uit[:MAXR]
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
            mag = ALLEEN.get(W[x[2]]['naam'])
            if mag and not any(sleutel == m or sleutel.startswith(m + '/') for m in mag): continue
            if maxp and x[1] >= maxp: continue
            if gesl and g != gesl: continue
            if niet and any(heeft(tl, n) for n in niet): continue
            if ofw and not any(heeft(z, o) for o in ofw): continue
            sel.append(x)
        sel = mengen(sel)
        naam = sleutel.replace('/', '--') + '.json'
        json.dump({'winkels': W, 'producten': sel}, open(os.path.join('assets/zoek/w', naam), 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
        aantal[sleutel] = len(sel)
print('per pagina:', sum(aantal.values()), 'rijen in', len(aantal), 'bestanden; grootste:', sorted(aantal.items(), key=lambda a: -a[1])[:5])


# ---- 2.1 (30-10-2026): partnerproducten verdelen over de NIEUWE vakjes, met dezelfde regels als onze eigen producten ----
# De regels komen uit scripts/indeling.js (via scripts/vak-regels.json). Christelijk doet bewust niet mee (zelf gekozen).
REGELS = json.load(open('scripts/vak-regels.json', encoding='utf-8'))
HERNOEM = REGELS['hernoem']
# Vakjes die bij onze eigen producten op het oude vakje leunen: voor partnerproducten een eigen regel.
VOORAF = {'dranken': [
    ('champagne-bubbels', r'champagne|\bcava\b|prosecco|cr[eé]mant|mousserend|bubbels|mo[eë]t|brut\b'),
    ('whisky', r'whisk(e)?y|bourbon|scotch|single malt'), ('cognac', r'cognac|brandy|armagnac|calvados'),
    ('gin-cocktails', r'\bgin\b|cocktail|tonic'), ('likeuren', r'likeur|liqueur|baileys|amaretto|limoncello|advocaat'),
    ('tequila', r'tequila|mezcal'), ('rum', r'\brum\b|\brhum\b'), ('wodka', r'wodka|vodka')]}
NA = {'eten-drinken': [('delicatessen', r'olijfolie|honing|truffel|tapenade|pesto|balsamico|confituur|delicatesse|tapas')],
      'dieren': [('hond', r'\bhond|honden|puppy|hondenmand|halsband|hondenriem'), ('kat', r'\bkat\b|katten|kitten|krabpaal|kattenbak'),
                 ('vogels', r'vogelkooi|parkiet|kanarie|papegaai')]}
VOLGORDE = ['metaaldetectie', 'sieraden', 'geuren-verzorging', 'elektronica', 'speelgoed', 'dranken', 'eten-drinken', 'boeken-media',
            'dieren', 'hobby', 'tuin-klussen', 'sport-outdoor', 'keuken', 'wonen', 'mode-beauty']
G = {}
for g in VOLGORDE:
    v = REGELS['groepen'].get(g, {'regels': [], 'extra': []})
    lijst = [(a, re.compile(b, re.I)) for a, b in VOORAF.get(g, [])] + [(a, re.compile(b, re.I)) for a, b in v['regels']] + \
            [(a, re.compile(b, re.I)) for a, b in NA.get(g, [])]
    extra = [(a, re.compile(b, re.I), re.compile(c, re.I) if c else None) for a, b, c in v['extra']]
    G[g] = (lijst, extra)
# Winkels die maar één soort spullen verkopen: alleen in hun eigen groep (anders komt wijn met 'ski' in de naam bij Wintersport).
EIGEN = {
    'Decantalo': ['dranken'], 'Svinando': ['dranken'], 'Wijnkring': ['dranken'], 'Wijny': ['dranken'], 'Barrelkings': ['dranken'],
    'Dr. Martens': ['mode-beauty/schoenen', 'mode-beauty/tassen', 'mode-beauty/rugzakken', 'mode-beauty/portemonnees'],
    'Zadig & Voltaire': ['mode-beauty', 'sieraden'], 'Bartogi': ['mode-beauty'], 'Fashionize': ['mode-beauty', 'sieraden'],
    '247Jeans': ['mode-beauty'], 'Bivolino': ['mode-beauty'], 'Repeat Cashmere': ['mode-beauty'],
    'Invicta': ['sieraden/horloges'], 'Prydligt': ['sieraden'], 'Myka': ['sieraden'],
    'Teufel': ['elektronica'], 'Mobistoxx': ['elektronica'], 'Nedgame': ['elektronica', 'speelgoed'],
    'Fietsparadijs': ['sport-outdoor'], 'Fietstas.com': ['sport-outdoor'],
    'Dropwinkel': ['eten-drinken'], 'LEGO': ['speelgoed'], '999 Games': ['speelgoed'],
    'Kerstland': ['wonen'], 'WoodWick': ['wonen'], 'Bellatio': ['wonen'], 'Lamponline': ['wonen/lampen', 'tuin-klussen/buitenverlichting'],
    'La Redoute': ['wonen', 'keuken'], 'Westwing': ['wonen', 'keuken'], 'Meubello': ['wonen'], 'Bedroomshop': ['wonen'], 'Tenstickers': ['wonen'],
    'Italian Design': ['wonen', 'keuken'], 'Kitchenette': ['keuken'],
    'Applamp': ['wonen/lampen', 'tuin-klussen/buitenverlichting'], 'Getled': ['wonen/lampen', 'tuin-klussen/buitenverlichting'],
    'Lightdepot': ['wonen/lampen', 'tuin-klussen/buitenverlichting'],
    'Superzero': ['geuren-verzorging'], 'Boombrush': ['geuren-verzorging'], 'Viparfum': ['geuren-verzorging'],
    'Looking Good Today': ['sieraden', 'geuren-verzorging', 'mode-beauty'], 'Hobbymax': ['hobby', 'speelgoed'], 'Prepz': ['sport-outdoor'],
    'Animals Giftshop': ['dieren', 'speelgoed'], 'Knuffelparadijs': ['speelgoed'], 'Knuffelkado': ['speelgoed'],
    'De Grote Speelgoedwinkel': ['speelgoed', 'hobby', 'sport-outdoor'], 'Countrylifestyle': ['wonen', 'keuken', 'tuin-klussen'],
    'Smartphoto': ['wonen', 'keuken', 'boeken-media'], 'Spaarpotten-winkel': ['wonen', 'speelgoed'],
}
# Sommige groepen alleen als de titel er echt over gaat.
POORT = {
    'metaaldetectie': re.compile(r'metaaldetect|detector|pinpointer|magneetvis|vismagneet|munten|muntalbum|goudpan', re.I),
    'dranken': re.compile(r'\d ?(cl|ml|l|liter)\b|%|wijn|bier|champagne|prosecco|cava|whisk|gin\b|rum\b|vodka|wodka|likeur|liqueur|tequila|cognac|port\b|sake|jenever|glas|glazen|karaf|kurk|wijnrek|koeler|cocktail|shaker|alcoholvrij|0[,.]0', re.I),
    'dieren': re.compile(r'hond|katten|\bkat\b|kitten|konijn|cavia|hamster|paard|pony|vogel|parkiet|aquarium|terrarium|\bkip|huisdier|knaagdier|vissen|reptiel', re.I),
}
# Nooit tonen: geen cadeau of geen product (lakens, matrassen, batterijen, schoonmaak, groothandel enz.).
NOOIT = re.compile(r'hoeslaken|matras|bedbodem|lattenbodem|boxspring|batterij|schoonmaak|kabel|adapter|wc-bril|toiletbril|\bpartij van\b|vervangings|navulling|reserveonderdeel|verloopstuk|\bkit kat\b|kitkat|nougat|outletpakket', re.I)
# Muziek en films (lp, cd, dvd) horen alleen bij Boeken & media (anders komt 'Live at the Whisky A Go Go' bij Whisky).
MEDIA = re.compile(r'\(lp\)|\blp\b|vinyl|\bcd\b|\bdvd\b|blu-?ray|soundtrack', re.I)
def toegestaan(winkel, k):
    for lijst in (ALLEEN.get(winkel), EIGEN.get(winkel)):
        if not lijst: continue
        ok = False
        for m in lijst:
            m = HERNOEM.get(m, m)
            if k == m or k.startswith(m + '/') or m.startswith(k + '/'): ok = True
        if not ok: return False
    return True
def raak(rx, tekst):
    """Telt alleen als het een heel woord is of het begin van een lang woord (zoals op de site): 'ski' niet in 'skiphos', 'gin' niet in 'ginger'."""
    for m in rx.finditer(tekst):
        a, b = m.start(), m.end()
        if a > 0 and tekst[a - 1].isalnum(): continue
        if b - a >= 5 or b >= len(tekst) or not tekst[b].isalnum(): return True
    return False
def indelen(titel, cat, winkel):
    for tekst in (titel, titel + ' ' + cat):
        for g in VOLGORDE:
            if g in POORT and not POORT[g].search(titel): continue
            if not toegestaan(winkel, g): continue
            if g != 'boeken-media' and MEDIA.search(titel): continue
            lijst, extra = G[g]
            vak = next((a for a, rx in lijst if raak(rx, tekst)), None)
            if not vak: continue
            ks = [g + '/' + vak] + [g + '/' + a for a, rx, niet in extra if raak(rx, tekst) and not (niet and niet.search(tekst))]
            return g, ks
    return None, []
vakken = {}
for x, z, tl, g_ in rijen:
    if x[1] < 5 or NOOIT.search(x[0]): continue
    winkel = W[x[2]]['naam']
    if not any(toegestaan(winkel, g) for g in VOLGORDE): continue
    groep, ks = indelen(x[0], x[5] or '', winkel)
    if not groep: continue
    for k in [groep] + ks:
        if not toegestaan(winkel, k): continue
        niet = NW.get(k, '').split()
        if niet and any(heeft(tl, n) for n in niet): continue
        vakken.setdefault(k, []).append(x)
n2 = 0
for k, sel in vakken.items():
    sel = mengen(sel)
    json.dump({'winkels': W, 'producten': sel}, open(os.path.join('assets/zoek/w', k.replace('/', '--') + '.json'), 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
    aantal[k] = len(sel); n2 += 1
print('nieuwe vakjes:', n2, 'bestanden; kleinste:', sorted(((k, len(v)) for k, v in vakken.items()), key=lambda a: a[1])[:8])
# 31-10-2026: verkeerde producten eruit (hondenkauwring bij Ringen enz.) en dubbele maten samen. Zie scripts/zoek-schoonmaak.py.
import importlib.util as _iu
_s = _iu.spec_from_file_location('zoek_schoonmaak', os.path.join(os.path.dirname(os.path.abspath(__file__)), 'zoek-schoonmaak.py'))
_m = _iu.module_from_spec(_s); _s.loader.exec_module(_m); _m.schoon()
