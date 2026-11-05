# Zet alles samen voor de nieuwe boom:
#  - de plek van elk product (afdeling/groep/vakje) -> scripts/boom/plaatsing.json (splits-producten.js gebruikt dit bij elke bouw)
#  - nieuwe producten van de spooksite erbij in assets/js/producten.js
#  - het oordeel van de AI-keuring (houden / weg / twijfel), behalve voor beschermde producten (hits, pins, favorieten, sfeerfoto's)
# Gebruik: python3 scripts/boom/verwerk.py [map-met-AI-antwoorden] [--toepassen]
#   zonder --toepassen: alleen een rapport (scripts/boom/rapport.txt), er verandert niets.
import json, re, os, sys, subprocess, unicodedata, collections, glob, datetime
HIER = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(os.path.dirname(HIER))
def slug(t): t = unicodedata.normalize('NFKD', t); t = ''.join(c for c in t if not unicodedata.combining(c)); return re.sub(r'^-|-$', '', re.sub(r'[^a-z0-9]+', '-', t.lower()))
exec(open(os.path.join(HIER, 'oud-naar-nieuw.py')).read())
exec(open(os.path.join(HIER, 'vakwoorden.py')).read())
exec(open(os.path.join(HIER, 'rang.py')).read())
BOOM = json.load(open(os.path.join(HIER, 'boom-samen.json')))
AFDSLUG = {'speelgoed-spellen': 'speelgoed', 'elektronica-gaming': 'elektronica', 'mode-sieraden': 'mode-sieraden', 'beauty-verzorging': 'beauty-verzorging',
           'wonen-koken': 'wonen', 'eten-drinken': 'eten-drinken', 'hobby-creatief': 'hobby', 'sport-buiten': 'sport-outdoor', 'tuin-klussen': 'tuin-klussen',
           'boeken-films-muziek': 'boeken-media', 'dieren': 'dieren', 'christelijk': 'christelijk'}
args = [a for a in sys.argv[1:] if not a.startswith('--')]; TOEPASSEN = '--toepassen' in sys.argv
# keuring van Marius (keuring-boom.json uit de keurpagina): {id: 'houden'|'weg'}. Alleen wat HIJ weg doet, gaat weg.
KEUS = {}
for a in sys.argv[1:]:
    if a.startswith('--keuring='): KEUS = json.load(open(a.split('=', 1)[1], encoding='utf-8'))['keus']
# --alles-houden: Marius keurde de AI-keuring af (5-11-2026): niets gaat weg, ook twijfelgevallen komen erbij
ALLES_HOUDEN = '--alles-houden' in sys.argv
AIMAP = args[0] if args else None
# ---- de boom met codes (zelfde volgorde als de AI-porties) ----
CODE = {}; PLEK = {}; GROEPVAK = {}
for a in BOOM:
    for g in a['groepen']:
        GROEPVAK[(a['id'], g['naam'])] = g['vakjes']
# de codes (v001...) zoals de AI ze kreeg: vaste lijst, los van de volgorde in de boom
_AFDNAAM = {a['naam']: a['id'] for a in BOOM}
for x in json.load(open(os.path.join(HIER, 'ai-vakjes.json'), encoding='utf-8')):
    an, gn, vn = x['pad'].split(' > '); PLEK[x['code']] = (_AFDNAAM[an], gn, vn); CODE[PLEK[x['code']]] = x['code']
def slugs(pl): return [AFDSLUG[pl[0]], slug(pl[1]), slug(pl[2]) if pl[2] else '']
# ---- terug naar een oud vakje (cat/sub) zodat alle oude onderdelen van de site (VONK, voor wie, gelegenheden) blijven werken ----
REV = {}; REVG = {}
for k, m in M.items():
    if isinstance(m, tuple):
        if m[2]: REV.setdefault(m, k)
        REVG.setdefault((m[0], m[1]), k)
REVA = {}
for k, m in M.items():
    if isinstance(m, tuple): REVA.setdefault(m[0], k)
def oudPad(pl): return REV.get(tuple(pl)) or REVG.get((pl[0], pl[1])) or REVA[pl[0]]
# ---- producten ----
def laad(js, naam):
    return json.loads(subprocess.check_output(['node', '-e', 'const w={};new Function("window",require("fs").readFileSync(%r,"utf8"))(w);process.stdout.write(JSON.stringify(w.%s))' % (js, naam)]))
PJS = os.path.join(ROOT, 'assets/js/producten.js')
# producten.js zonder het 3.0-blok (anders tellen de nieuwe producten dubbel mee)
_pj = re.sub(r'\n/\* ===== 3\.0 NIEUWE PRODUCTEN.*?/\* ===== einde 3\.0 producten ===== \*/\n', '\n', open(PJS, encoding='utf-8').read(), flags=re.S)
LIVE = json.loads(subprocess.check_output(['node', '-e', 'const w={};new Function("window",require("fs").readFileSync(0,"utf8"))(w);process.stdout.write(JSON.stringify(w.LK_PRODUCTEN))'], input=_pj.encode('utf-8')))
# wat de site nu echt toont (na indeling.js): cat/sub per product
LEAN = {p['id']: p for p in json.loads(subprocess.check_output(['node', '-e', 'global.window={dispatchEvent(){}};global.Event=function(){};require(%r);process.stdout.write(JSON.stringify(window.LK_PRODUCTEN.map(p=>({id:p.id,cat:p.cat,sub:p.sub,ookIn:p.ookIn||[]}))))' % os.path.join(ROOT, 'assets/js/producten-lean.js')]))}
SPOOKJS = '/mnt/user-data/outputs/spooksite-test/producten.js'
SPOOK = laad(SPOOKJS, 'SPOOK_PRODUCTEN') if os.path.exists(SPOOKJS) else []
SPOOKPLEK = json.load(open(os.path.join(HIER, 'indeling-spook.json'))) if os.path.exists(os.path.join(HIER, 'indeling-spook.json')) else {}
PAREN = json.load(open(os.path.join(HIER, 'paren.json'))) if os.path.exists(os.path.join(HIER, 'paren.json')) else []
# kandidaat-vakjes uit de AI-porties (voor producten waar de AI geen antwoord op gaf)
HINT = {}
for f in glob.glob('/mnt/user-data/outputs/ai-keuring/porties/in-*.json'):
    for x in json.load(open(f, encoding='utf-8')):
        if x.get('k'): HINT[x['i']] = x['k'][0]
# ---- AI-antwoorden ----
AI = {}
if AIMAP:
    for f in sorted(glob.glob(os.path.join(AIMAP, 'antw-*.json'))):
        for x in json.load(open(f, encoding='utf-8'))['uit']: AI[x['i']] = x
# ---- beschermd: wat al werkt blijft staan ----
BESCHERMD = {}
try:
    for r in json.load(open(os.path.join(ROOT, 'keurkamer/data/boom/gsc-pages.json')))['rows']:
        mm = re.search(r'/p/([^/]+)/', r['keys'][0])
        if mm and (r.get('clicks', 0) > 0 or r.get('impressions', 0) >= 3): BESCHERMD[mm.group(1)] = 'Google'
except FileNotFoundError: pass
for f in glob.glob(os.path.join(ROOT, 'pins', '*.xml')) + [os.path.join(ROOT, 'pins', 'geplaatst.json')]:
    if os.path.exists(f):
        for pid in re.findall(r'/p/([a-z0-9][a-z0-9-]*)', open(f, encoding='utf-8', errors='ignore').read()): BESCHERMD.setdefault(pid, 'Pinterest')
for p in LIVE:
    if p.get('favoriet') or p.get('populair'): BESCHERMD.setdefault(p['id'], 'favoriet')
    if p.get('sfeer'): BESCHERMD.setdefault(p['id'], 'sfeerfoto')
gcf = os.path.join(ROOT, 'keurkamer/data/boom/goatcounter-hits.json')
if os.path.exists(gcf):
    for pid in json.load(open(gcf)): BESCHERMD.setdefault(pid, 'GoatCounter')
# uitslag van het foto's ophalen (haal-fotos.py): alleen producten met een goede foto komen erbij
FOTOS = None
ff = os.path.join(ROOT, 'keurkamer/data/boom/fotos-uitslag.json')
if os.path.exists(ff): FOTOS = json.load(open(ff))
# ---- regels: plek kiezen zonder AI ----
def kiesRegel(titel, oud):
    m = M.get(oud); t = titel.lower()
    if isinstance(m, tuple):
        a, g, v = m; vs = GROEPVAK[(a, g)]
        if v: return [a, g, v]
        if len(vs) == 1: return [a, g, vs[0]]
        hits = [x for x in vs if VW.get(x) and re.search(VW[x], t)]
        return [a, g, hits[0] if len(hits) == 1 else None]
    return None
# Darts: vaste volgorde van herkennen (een kabinet met bord is verlichting/kabinet, een elektronisch bord is elektronisch)
DARTS = [('Elektronische dartborden', r'elektron|softtip|soft tip|scoring|scolia|ton machine'), ('Verlichting & surrounds', r'verlichting|surround|kabinet|dartkast|\bkast\b|plasma|standaard|ring\b|led'),
         ('Dartmatten & oches', r'dartmat|oche|werplijn|\bmat\b'), ('Darts-shirts', r'shirt|polo|jersey'), ('Flights & shafts', r'flight|shaft|case|accessoire|sharpener|slijper|scorebord|dock|wallet|servicekit|onderhoudsset'),
         ('Dartborden', r'dartbord|bristle|sisal|bord\b|board'), ('Dartpijlen', r'dartpijl|darts? ?set|tungsten|brass|gram|\d+\s*gr\b|steeltip|pijlen')]
# vakjes die na de AI-keuring nog veranderd zijn (bijv. Darts werd een eigen groep, 5-11-2026)
def herzie(pl, titel):
    if not pl: return pl
    if (pl[0], pl[1], pl[2]) == ('sport-buiten', 'Balsport & spel', 'Darts') or (pl[0], pl[1]) == ('sport-buiten', 'Darts'):
        t = titel.lower()
        for v, rx in DARTS:
            if re.search(rx, t): return ['sport-buiten', 'Darts', v]
        return ['sport-buiten', 'Darts', None]
    if (pl[0], pl[1]) in GROEPVAK and pl[2] and pl[2] not in GROEPVAK[(pl[0], pl[1])]: return [pl[0], pl[1], None]
    t = titel.lower()
    # games staan soms bij consoles: een spel (titel met '(Switch 2)', '(PS5)' enz.) zonder het woord console is een game
    if (pl[0], pl[1], pl[2]) == ('elektronica-gaming', 'Gaming', 'Consoles') and re.search(r'\((ps[45]|switch|xbox|nintendo)', t) and not re.search(r'console|slim|disc edition|digital edition|oled', t):
        return [pl[0], pl[1], 'Games']
    return pl
VOOR = {'kinderen': 'kind', 'tieners': 'tiener', 'kind': 'kind', 'tiener': 'tiener', 'haar': 'haar', 'hem': 'hem', 'baby': 'baby', 'opa-oma': 'opa-oma', 'collega': 'collega'}
THEMA_OUD = {'sinterklaas': 'cadeaus/sinterklaas', 'kerst': 'cadeaus/kerst', 'met-naam': 'cadeaus/met-naam', 'grappig': 'cadeaus/grappig', 'adventskalender': 'cadeaus/adventskalenders'}
def lft(l):
    rr = []
    for x in l:
        mm = re.match(r'(\d+)\s*[-–]\s*(\d+)', x); m2 = re.match(r'(\d+)\+', x)
        if mm: rr.append((int(mm.group(1)), int(mm.group(2))))
        elif m2: rr.append((int(m2.group(1)), 99))
    return [min(a for a, b in rr), max(b for a, b in rr)] if rr else None
# ---- alles samen ----
plaatsing = {}; rapport = collections.Counter(); weg = []; twijfel = []; nieuw = []
dubbelSpook = {s: p for s, p, k in PAREN}
SPOOKID = {p['id']: p for p in SPOOK}
for p in LIVE:
    if p.get('status') != 'goedgekeurd': continue
    lp = LEAN.get(p['id'], p); oud = lp['cat'] + '/' + lp['sub']
    a = AI.get(p['id'])
    pl = herzie(list(PLEK[a['v']]) if a else kiesRegel(p['titel'], oud), p['titel'])
    if not pl and HINT.get(p['id']): pl = list(PLEK[HINT[p['id']]])  # geen AI-antwoord: eerste kandidaat van de regels
    if not pl: rapport['geen plek in de boom (blijft alleen op themapagina)'] += 1; continue
    s = slugs(pl); extra = []
    mo = M.get(oud)
    if oud.split('/')[0] in ('cadeaus', 'valentijn'): extra.append(oud)  # themapagina blijft het product tonen
    plaatsing[p['id']] = {'a': s[0], 'g': s[1], 'v': s[2]}
    # het oude vakje alleen veranderen als het product echt naar een andere afdeling/groep gaat
    if not (isinstance(mo, tuple) and (mo[0], mo[1]) == (pl[0], pl[1])):
        o = oudPad(pl); plaatsing[p['id']]['oud'] = o
    if extra: plaatsing[p['id']]['ook'] = extra
    plaatsing[p['id']]['r'] = rang(pl[2], (a or {}).get('c'), topper=bool(p.get('favoriet') or p.get('populair') or 'toppers' in (p.get('tags') or [])),
                                   nieuw=False, hits=BESCHERMD.get(p['id']) in ('GoatCounter', 'Google'), sfeer=bool(p.get('sfeer')))
    if a:
        plaatsing[p['id']]['c'] = a.get('c')
        if KEUS.get(p['id']) == 'weg': weg.append((p['id'], p['titel'], 'Marius: weg (AI: %s)' % a.get('r', '')))
        elif a['k'] in ('w', 't'):
            if p['id'] in BESCHERMD: rapport['AI wil weg, maar beschermd (%s)' % BESCHERMD[p['id']]] += 1
            elif KEUS.get(p['id']) == 'houden': rapport['AI wilde weg, Marius houdt hem'] += 1
            else: twijfel.append((p['id'], p['titel'], 'AI: ' + ('weg' if a['k'] == 'w' else 'twijfel') + ' – nog niet gekeurd door Marius, blijft staan', a.get('r', '')))
    rapport['live ingedeeld' + (' (AI)' if a else ' (regels)')] += 1
# nieuwe producten van de spooksite
for sp in SPOOK:
    if sp['id'] in dubbelSpook: rapport['spooksite: dubbel met live (goedkoopste telt)'] += 1; continue
    a = AI.get(sp['id'])
    if KEUS.get(sp['id']) == 'weg': rapport['spooksite: Marius zegt weg'] += 1; continue
    if a and a['k'] in ('w', 't') and KEUS.get(sp['id']) != 'houden' and not ALLES_HOUDEN:
        rapport['spooksite: AI wil weg/twijfelt, wacht op Marius (nog niet toegevoegd)'] += 1; twijfel.append((sp['id'], sp['titel'], 'nieuw, wacht op keuring Marius', a.get('r', ''))); continue
    if FOTOS is not None and FOTOS.get(sp['id']) not in ('ok', 'al'): rapport['spooksite: geen goede foto (nog niet toegevoegd)'] += 1; continue
    pl = herzie(list(PLEK[a['v']]) if a else SPOOKPLEK.get(sp['id']), sp['titel'])
    if not pl: continue
    s = slugs(pl); o = oudPad(pl)
    ook = []
    th = (a or {}).get('th') or sp.get('thema') or []
    for t in th:
        if t in THEMA_OUD: ook.append(THEMA_OUD[t])
    if 'valentijn' in th: ook.append('valentijn/voor-haar' if 'haar' in ((a or {}).get('wie') or []) else 'valentijn/voor-hem' if 'hem' in ((a or {}).get('wie') or []) else 'valentijn/samen')
    voor = sorted({VOOR[v] for v in ((a or {}).get('wie') or sp.get('voor') or []) if v in VOOR}) or ['iedereen']
    moment = sorted({g for g in (sp.get('gelegenheid') or []) if g in ('kerst', 'sinterklaas', 'verjaardag', 'valentijn')} | {t for t in th if t in ('kerst', 'sinterklaas', 'valentijn')}) or ['verjaardag']
    rec = {'id': sp['id'], 'titel': sp['titel'], 'prijs': sp['prijs'], 'shop': re.sub(r'\s*\(.*?\)\s*$', '', sp['winkel']), 'url': sp['link'],
           'beeld': 'images/producten/' + sp['id'], 'cat': o.split('/')[0], 'sub': o.split('/')[1], 'subVast': True,
           'ookIn': ook, 'voor': voor, 'moment': moment, 'waarom': sp.get('tekst') or '', 'status': 'goedgekeurd', 'nieuw': True, 'sinds': datetime.date.today().isoformat()}
    if sp.get('merk'): rec['merk'] = sp['merk']
    if sp.get('oudePrijs'): rec['oudePrijs'] = sp['oudePrijs']
    l = lft((a or {}).get('lft', '').split(',') if a and a.get('lft') else (sp.get('leeftijd') or []))
    if l: rec['leeftijd'] = l
    if 'luxe' in th: rec['soort'] = ['luxe']
    nieuw.append(rec); plaatsing[sp['id']] = {'a': s[0], 'g': s[1], 'v': s[2]}
    plaatsing[sp['id']]['r'] = rang(pl[2], (a or {}).get('c'), topper=bool(sp.get('topper')), nieuw=True)
    if a: plaatsing[sp['id']]['c'] = a.get('c')
    rapport['spooksite: nieuw erbij'] += 1
# goedkoopste wint bij dubbel: de live-versie houdt zijn adres, maar krijgt de goedkoopste winkel
goedkoper = []
LID = {p['id']: p for p in LIVE}
for s_id, p_id, k in PAREN:
    sp, lp = SPOOKID.get(s_id), LID.get(p_id)
    if sp and lp and sp.get('prijs') and lp.get('prijs') and sp['prijs'] < lp['prijs'] - 0.01 and not (sp['winkel'] == 'Boardgameshop'):
        goedkoper.append((p_id, lp['titel'], lp['shop'], lp['prijs'], sp['winkel'], sp['prijs'], sp['link']))
os.makedirs(HIER, exist_ok=True)
json.dump(plaatsing, open(os.path.join(HIER, 'plaatsing.json'), 'w'), ensure_ascii=False, separators=(',', ':'))
with open(os.path.join(ROOT, 'keurkamer/data/boom/rapport.txt'), 'w', encoding='utf-8') as f:
    f.write('RAPPORT NIEUWE BOOM – %s\n\n' % datetime.datetime.now().strftime('%d-%m-%Y %H:%M'))
    for k, n in rapport.most_common(): f.write('%6d  %s\n' % (n, k))
    f.write('\nBeschermd (blijft altijd staan): %d producten\n' % len(BESCHERMD))
    f.write('\nWEG (%d):\n' % len(weg)); [f.write('  %s | %s | %s\n' % x) for x in weg]
    f.write('\nTWIJFEL (%d):\n' % len(twijfel)); [f.write('  %s | %s | %s | %s\n' % x) for x in twijfel]
    f.write('\nGOEDKOPER BIJ EEN ANDERE WINKEL (%d):\n' % len(goedkoper)); [f.write('  %s | %s | %s €%s -> %s €%s\n' % x[:6]) for x in goedkoper]
json.dump([x[0] for x in twijfel], open(os.path.join(ROOT, 'keurkamer/data/boom/te-keuren.json'), 'w'))
tel = collections.Counter((v['a'], v['g'], v['v']) for v in plaatsing.values())
print(dict(rapport)); print('weg', len(weg), 'twijfel', len(twijfel), 'goedkoper', len(goedkoper), 'beschermd', len(BESCHERMD))
print('vakjes gevuld', len([k for k in tel if k[2]]), 'met minder dan 10:', len([k for k, n in tel.items() if k[2] and n < 10]))
if TOEPASSEN:
    d = open(PJS, encoding='utf-8').read()
    d = re.sub(r'\n/\* ===== 3\.0 NIEUWE PRODUCTEN.*?/\* ===== einde 3\.0 producten ===== \*/\n', '\n', d, flags=re.S)
    # aanpassingen aan bestaande producten: goedkoopste winkel, en wat Marius weg heeft gedaan
    AANP = {}
    for p_id, t, w1, p1, w2, p2, link in goedkoper:
        sp = next((x for x in SPOOK if x['link'] == link), None)
        AANP[p_id] = {'prijs': p2, 'shop': re.sub(r'\s*\(.*?\)\s*$', '', w2), 'url': link, 'winkelUrl': link}
    for i, t, r in weg:
        if i in LID: AANP.setdefault(i, {}).update({'status': 'afgekeurd', 'afgekeurdReden': 'keuring nieuwe boom (Marius, 2026-11)'})
    blok = ('\n/* ===== 3.0 NIEUWE PRODUCTEN (spooksite, AI-gekeurd) – gemaakt door scripts/boom/verwerk.py ===== */\n'
            'window.LK_PRODUCTEN.push.apply(window.LK_PRODUCTEN, ' + json.dumps(nieuw, ensure_ascii=False) + ');\n'
            '(function (A) { window.LK_PRODUCTEN.forEach(function (p) { if (A[p.id]) Object.assign(p, A[p.id]); }); })(' + json.dumps(AANP, ensure_ascii=False) + ');\n'
            '/* ===== einde 3.0 producten ===== */\n')
    open(PJS, 'w', encoding='utf-8').write(d.rstrip('\n') + '\n' + blok)
    json.dump({'weg': [x[0] for x in weg], 'goedkoper': goedkoper}, open(os.path.join(ROOT, 'keurkamer/data/boom/oordeel-ai.json'), 'w'), ensure_ascii=False)
    print('toegepast: producten.js +', len(nieuw))
