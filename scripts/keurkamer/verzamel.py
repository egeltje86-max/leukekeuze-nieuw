"""Keurkamer, stap 2: de regelmotor. Kijkt naar ALLE producten die live staan en zet per product de technische
controles klaar (dubbelen, foto, tekst, winkel, prijs, plek, regels van Marius). Alleen lezen; verandert niets aan de site.

Gebruik: python3 scripts/keurkamer/verzamel.py        -> keurkamer/data/catalogus.json
Draait eerst node scripts/keurkamer/effectief.js (producten zoals de site ze toont)."""
import json, os, re, sys, subprocess, collections, datetime
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
KK = os.path.join(ROOT, 'keurkamer'); DATA = os.path.join(KK, 'data')
os.makedirs(DATA, exist_ok=True)
subprocess.run(['node', os.path.join(ROOT, 'scripts/keurkamer/effectief.js')], check=True)
E = json.load(open(os.path.join(DATA, 'producten-effectief.json'), encoding='utf-8'))
P = E['producten']
VAKJES = json.load(open(os.path.join(KK, 'vakjes-lijst.json'), encoding='utf-8'))
VAK = {v['vak']: v for v in VAKJES}

# ---------- hulpjes ----------
STOP = set('de het een en of met voor van in op bij te aan uit om naar als dan ook nog zonder over tot per set stuks stuk cm mm ml l kg gr gram liter x maat kleur zwart wit rood blauw groen geel roze grijs bruin goud zilver beige oranje paars lichtblauw donkerblauw inclusief incl inch'.split())
def tokens(t):
    t = re.sub(r'\(.*?\)', ' ', str(t).lower())
    t = re.sub(r'[^a-z0-9à-ü]+', ' ', t)
    return [w for w in t.split() if w not in STOP and len(w) > 1]
def sleutel(t):
    return ' '.join(sorted(set(tokens(t))))
def netwerk(url):
    if 'partner.bol.com' in url: return 'bol'
    if 'amzn' in url or 'amazon.' in url: return 'amazon'
    if 'tradetracker' in url or re.search(r'[?&]tt=\d+_', url) or re.search(r'[?&]a=516846(&|$)', url) or re.search(r'^https?://partner\.', url): return 'tradetracker'
    if re.match(r'^https?://(lt45|fr135|bdt9|glp8|ds1|jdt8|rkn3|jf79)\.n[le]t?/c/', url) or 'aff.svinando' in url: return 'daisycon'
    if 'awin1.com' in url or 'zenaps' in url: return 'awin'
    if re.search(r'[?&]aff=LEUKEKEUZE', url): return 'dextercards'
    if 'hertog.nl' in url: return 'denhertog-direct'  # bewust direct (afspraak Marius)
    return 'direct'

# ---------- foto's ----------
FOTO_CACHE_PAD = os.path.join(DATA, 'foto-cache.json')
FOTO_CACHE = json.load(open(FOTO_CACHE_PAD, encoding='utf-8')) if os.path.exists(FOTO_CACHE_PAD) else {}
def foto_check(p):
    """Kijkt naar de kleine foto: bestaat hij, is hij groot genoeg, witte achtergrond (bij een gewone productfoto), scherp genoeg.
    De uitkomst wordt bewaard (foto-cache.json), zodat een volgende keer alleen nieuwe foto's bekeken worden."""
    k = p['id'] + '|' + str(p.get('sfeer'))
    if k in FOTO_CACHE: return FOTO_CACHE[k]
    uit = foto_check_echt(p); FOTO_CACHE[k] = uit; return uit
def foto_check_echt(p):
    uit = {}
    if re.match(r'^https?://', p['beeld']): uit['extern'] = True; return uit
    f = os.path.join(ROOT, p['beeld'] + '-klein.webp')
    if not os.path.exists(f):
        f2 = os.path.join(ROOT, p['beeld'] + '.webp')
        if not os.path.exists(f2): uit['ontbreekt'] = True; return uit
        f = f2
    try:
        from PIL import Image
        import numpy as np
        im = Image.open(f).convert('RGB'); w, h = im.size
        uit['maat'] = [w, h]
        if min(w, h) < 300: uit['klein'] = True
        a = np.asarray(im).astype(int)
        rand = np.concatenate([a[0:6].reshape(-1, 3), a[-6:].reshape(-1, 3), a[:, 0:6].reshape(-1, 3), a[:, -6:].reshape(-1, 3)])
        wit = float((rand.min(axis=1) > 225).mean())
        uit['randWit'] = round(wit, 2)
        if not p.get('sfeer') and wit < 0.6: uit['geenWitteRand'] = True  # alleen informatie (boekomslagen zijn ook zo)
        g = a.mean(axis=2)
        lap = np.abs(4 * g[1:-1, 1:-1] - g[:-2, 1:-1] - g[2:, 1:-1] - g[1:-1, :-2] - g[1:-1, 2:])
        scherp = float(lap.var())
        uit['scherpte'] = round(scherp, 1)
        if scherp < 12: uit['wazig'] = True  # alleen bij extreem vage foto's (gladde producten hebben ook weinig scherpte)
        # hoeveel van het beeld is product (niet wit)? heel klein product in groot wit vlak oogt leeg
        vulling = float((a.min(axis=2) < 225).mean()); uit['vulling'] = round(vulling, 2)
        if vulling < 0.015: uit['leeg'] = True  # vrijwel niets te zien
    except Exception as e:
        uit['fout'] = str(e)[:80]
    return uit

# ---------- tekst ----------
ENGELS = re.compile(r'\b(with|for|and|the|set of|pack of|pieces|piece|black|white|blue|red|green|gift|kids|women|men|stainless|wireless|portable|rechargeable)\b', re.I)
def tekst_check(p):
    uit = []
    t = p['titel']; w = p['waarom']
    if len(t) > 90: uit.append('titel-lang')
    if len(t) < 8: uit.append('titel-kort')
    if re.search(r'[|]|\s{2,}|\.\.\.', t): uit.append('titel-rommel')
    letters = re.sub(r'[^A-Za-z]', '', t)
    if len(letters) > 12 and sum(c.isupper() for c in letters) / len(letters) > 0.6: uit.append('titel-hoofdletters')
    if len(ENGELS.findall(t)) >= 2: uit.append('titel-engels')
    if len(w) < 45: uit.append('tekst-kort')
    if len(w) > 420: uit.append('tekst-lang')
    if len(ENGELS.findall(w)) >= 3: uit.append('tekst-engels')
    if w.strip().lower() == t.strip().lower(): uit.append('tekst-is-titel')
    return uit

# ---------- regels van Marius ----------
CHR = re.compile(r'\bbijbel|psalm|statenvertaling|\bhsv\b|kinderbijbel|jezus|christelijk|gebed|\bkerk\b|evangeli|doopkaart|belijdenis|kruisketting|kruisje|ichthus', re.I)
DRANK = re.compile(r'\b(wijn|whisky|whiskey|gin|bier|likeur|rum|wodka|vodka|cognac|champagne|prosecco|cava|jenever|tequila|port|sake|bubbels)\b', re.I)
DRANK_NIET = re.compile(r'glas|glazen|karaf|opener|decanteer|koeler|\brek\b|houder|standaard|smaak|geur|zeep|kaars|chocola|bonbon|\bmok\b|bord|shirt|sokken|spel|boek|kleur|goud|kussen|helm|kaart|beeld|paraplu|kist|poster|cheque|\bbon\b|dopjes|kalender|pakket|advent|snoep|drop|sticker|servet|handdoek|puzzel|notenkraker|tap\b|tapje|etiket|label|onderzetter', re.I)
KAARS = re.compile(r'\b(geurkaars|kaars(en)?|kaarsje|stompkaars|dinerkaars|theelicht)\b', re.I)
def regels_check(p):
    uit = []
    vak = p['vak']; cat = vak.split('/')[0]; t = p['titel']
    if p['shop'].lower().startswith('mijn hummeltje'): uit.append('mijn-hummeltje')
    if cat != 'christelijk' and CHR.search(t): uit.append('christelijk-buiten-christelijk')
    if cat == 'christelijk' and not CHR.search(t + ' ' + p['waarom']) and not re.search(r'engel|kerststal|kruis|doop|geloof|bijbel|psalm|zegen|god\b|heer\b|heere|kerst|opwekking|jozua|onze vader|zegen|tegel|wandbord|kaart|dagboek|kerk|lied', (t + ' ' + p['waarom']), re.I): uit.append('christelijk-twijfel')
    if cat != 'dranken' and DRANK.search(t) and not DRANK_NIET.search(t): uit.append('drank-buiten-dranken')
    if KAARS.search(t) and vak not in ('wonen/kaarsen', 'hobby/kaarsen-zeep-epoxy', 'christelijk/kerst', 'wonen/kerst') and not re.search(r'kandelaar|houder|standaard|lantaarn|maken|set om|diy|kaarsenmaak|lamp|led', t, re.I): uit.append('kaars-buiten-kaarsen')
    return uit

# ---------- dubbelen ----------
def dubbelen():
    """Zelfde product twee keer: zelfde winkelpagina, zelfde titel-sleutel, of (binnen dezelfde afdeling) bijna dezelfde woorden."""
    per_url, per_sleutel = collections.defaultdict(list), collections.defaultdict(list)
    for p in P.values():
        u = re.sub(r'[?#].*$', '', p['winkelUrl'].lower().rstrip('/'))
        if u: per_url[u].append(p['id'])
        per_sleutel[sleutel(p['titel'])].append(p['id'])
    D = collections.defaultdict(set); L = collections.defaultdict(set)
    for groep in list(per_url.values()) + list(per_sleutel.values()):
        if len(groep) > 1:
            for a in groep:
                for b in groep:
                    if a != b: D[a].add(b)
    # bijna-dubbelen: veel dezelfde woorden, binnen dezelfde afdeling (sneller én zinniger)
    per_cat = collections.defaultdict(list)
    for p in P.values(): per_cat[p['vak'].split('/')[0]].append((p['id'], set(tokens(p['titel']))))
    getal = lambda tk: set(w for w in tk if re.search(r'\d', w))
    for cat, lijst in per_cat.items():
        idx = collections.defaultdict(list)
        for i, (pid, tk) in enumerate(lijst):
            for w in tk: idx[w].append(i)
        for i, (pid, tk) in enumerate(lijst):
            if len(tk) < 3: continue
            kand = collections.Counter()
            for w in tk:
                if len(idx[w]) < 400:
                    for j in idx[w]:
                        if j > i: kand[j] += 1
            for j, n in kand.items():
                tk2 = lijst[j][1]
                if getal(tk) != getal(tk2): continue  # Macallan 12 en 18 jaar zijn twee producten
                j_ = n / max(1, len(tk | tk2))
                if j_ >= 0.9: D[pid].add(lijst[j][0]); D[lijst[j][0]].add(pid)
                elif j_ >= 0.75: L[pid].add(lijst[j][0]); L[lijst[j][0]].add(pid)
    return {k: sorted(v) for k, v in D.items()}, {k: sorted(v - D.get(k, set())) for k, v in L.items() if v - D.get(k, set())}

# ---------- alles bij elkaar ----------
def main():
    print('dubbelen zoeken...', flush=True)
    DUB, LIJKT = dubbelen()
    print('foto\'s bekijken (dit duurt even)...', flush=True)
    uit = {}
    for n, (pid, p) in enumerate(P.items()):
        vlag = []
        foto = foto_check(p)
        for k in ('ontbreekt', 'klein', 'wazig', 'leeg'):
            if foto.get(k): vlag.append('foto-' + k.lower())
        vlag += tekst_check(p)
        vlag += regels_check(p)
        if p['vak'] not in VAK: vlag.append('geen-echt-vakje')
        if p['vak'] != p['vakOpgeslagen'] and not p['subVast']: vlag.append('verplaatst-door-indeling')
        if p['prijs'] <= 0: vlag.append('prijs-nul')
        if p['oudePrijs'] and p['oudePrijs'] <= p['prijs']: vlag.append('oude-prijs-fout')
        nw = netwerk(p['url'])
        if nw == 'direct': vlag.append('link-geen-partner')
        if p['daisycon']: vlag.append('daisycon-pauze')
        if pid in DUB: vlag.append('dubbel')
        elif pid in LIJKT: vlag.append('lijkt-dubbel')
        if not p['voor']: vlag.append('geen-voor')
        uit[pid] = dict(p, vlag=vlag, foto=foto, dubbel=DUB.get(pid, []) or LIJKT.get(pid, []), netwerk=nw)
        if n % 1000 == 999: print(' ', n + 1, flush=True)
    vakjes = collections.defaultdict(lambda: {'thuis': [], 'ookIn': []})
    for pid, p in uit.items():
        vakjes[p['vak']]['thuis'].append(pid)
        for v in p['ookIn']: vakjes[v]['ookIn'].append(pid)
    tel = collections.Counter(v for p in uit.values() for v in p['vlag'])
    cat = {'gemaakt': datetime.datetime.now().isoformat(timespec='minutes'), 'aantal': len(uit), 'producten': uit,
           'vakjes': {k: dict(v, aantal=len(v['thuis']) + len(v['ookIn'])) for k, v in vakjes.items()}, 'vlaggen': dict(tel.most_common())}
    json.dump(cat, open(os.path.join(DATA, 'catalogus.json'), 'w', encoding='utf-8'), ensure_ascii=False)
    json.dump(FOTO_CACHE, open(FOTO_CACHE_PAD, 'w', encoding='utf-8'))
    print('klaar:', len(uit), 'producten,', len(vakjes), 'vakjes. Vlaggen:', json.dumps(dict(tel.most_common()), ensure_ascii=False))
if __name__ == '__main__':
    main()
