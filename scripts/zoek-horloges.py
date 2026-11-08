"""'Meer in onze winkels' onder Dameshorloges en Herenhorloges (8-11-2026, wens Marius): alleen horloges uit de winkels en
van de merken die hij zelf koos (scripts/horloges-keuze.json). Dames alleen dameshorloges, heren alleen herenhorloges.
Leest assets/zoek/alle.json.gz en schrijft assets/zoek/w/mode-sieraden--horloges--{dames,heren}horloges.json.
Draait na scripts/maak-zoekindex.py (die maakt de map w/ eerst leeg)."""
import json, gzip, os, re
HIER = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HIER)
K = json.load(open(os.path.join(HIER, 'horloges-keuze.json'), encoding='utf-8'))
j = json.loads(gzip.open(os.path.join(ROOT, 'assets/zoek/alle.json.gz')).read()); W = j['winkels']
WINKELS = set(K['winkels'])
HORLOGE = re.compile(r'horloge|\bwatch\b|watches|\buhr\b|herrenuhr|damenuhr|armbanduhr|chronograph|smartwatch', re.I)
GEEN = re.compile(r'ersatzband|uhrenarmband|horlogeband|\bstrap\b|\bband\b voor|uhrenbox|horlogebox|watch ?box|watch ?winder|uhrenbeweger|horlogeopwinder|sleutelhanger|ketting|armband(?!uhr)|bracelet|oorbel|\bring\b', re.I)
DAMES = re.compile(r'\bdames|damen|women|\bladies|\blady\b|\bvrouw', re.I)
HEREN = re.compile(r'\bheren|herren|\bmen\b|\bmen\'s|\bmens\b|\bman\b', re.I)
NETJES = {'BOSS': 'Hugo Boss', 'Peaky Blinders': 'Shelby Brothers'}
def merk_ok(x, lijst):
    # geeft de merknaam zoals Marius hem koos (voor de merkzoeker), of '' als het merk niet in zijn lijst staat
    m = (x[6] or '').lower(); t = x[0].lower()
    for b in sorted(lijst, key=len, reverse=True):
        if b.lower() == m or t.startswith(b.lower() + ' ') or (' ' + b.lower() + ' ') in (' ' + t + ' '): return NETJES.get(b, b)
    return ''
uit = {}
for soort in ('dames', 'heren'):
    sel = []
    for x in j['producten']:
        if W[x[2]]['naam'] not in WINKELS: continue
        if not HORLOGE.search(x[0] + ' ' + (x[5] or '')) or GEEN.search(x[0]): continue
        merk = merk_ok(x, K[soort])
        if not merk: continue
        t = x[0]; g = x[7] or ''
        if soort == 'dames':
            if not (g == 'v' or DAMES.search(t)) or HEREN.search(t) or g == 'm': continue
        else:
            if not (g == 'm' or HEREN.search(t)) or DAMES.search(t) or g == 'v' or re.search(r'unisex', t, re.I): continue
        x = list(x); x[6] = merk; sel.append(x)
    # om en om per merk, zodat niet één merk de hele lijst vult; hooguit 400
    per = {}
    for x in sel: per.setdefault((x[6] or '').lower(), []).append(x)
    for v in per.values(): v.sort(key=lambda x: x[1])
    r, lijst = 0, []
    while len(lijst) < 400 and any(r < len(v) for v in per.values()):
        for v in per.values():
            if r < len(v): lijst.append(v[r])
        r += 1
    naam = 'mode-sieraden--horloges--' + soort + 'horloges.json'
    os.makedirs(os.path.join(ROOT, 'assets/zoek/w'), exist_ok=True)
    json.dump({'winkels': W, 'producten': lijst[:400]}, open(os.path.join(ROOT, 'assets/zoek/w', naam), 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
    uit[soort] = len(lijst[:400])
print('horloges (alleen gekozen winkels en merken):', uit)
