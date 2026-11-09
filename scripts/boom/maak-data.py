# Maakt het 3.0-blok in assets/js/data.js: de nieuwe categorieboom (12 afdelingen > groepen > vakjes),
# met teksten en plaatjes van de oude vakjes waar die 1-op-1 overgaan, en doorverwijzingen voor alle oude adressen.
# Gebruik: python3 scripts/boom/maak-data.py   (in de map van de site)
import json, re, os, subprocess, unicodedata
HIER = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(os.path.dirname(HIER))
def slug(t): t = unicodedata.normalize('NFKD', t); t = ''.join(c for c in t if not unicodedata.combining(c)); return re.sub(r'^-|-$', '', re.sub(r'[^a-z0-9]+', '-', t.lower()))
exec(open(os.path.join(HIER, 'oud-naar-nieuw.py')).read())
BOOM = json.load(open(os.path.join(HIER, 'boom-samen.json')))
AFD = {'speelgoed-spellen': ('speelgoed', 'Speelgoed', 'beer', ['kind', 'leeftijd'], 'speelgoed'),
       'elektronica-gaming': ('elektronica', 'Elektronica', 'koptelefoon', None, 'elektronica'),
       'mode-sieraden': ('mode-sieraden', 'Mode & sieraden', 'ring', ['wie3'], 'sieraden'),
       'beauty-verzorging': ('beauty-verzorging', 'Beauty', 'tas', ['wie2'], 'geuren-verzorging'),
       'wonen-koken': ('wonen', 'Wonen & koken', 'huis', None, 'wonen'),
       'eten-drinken': ('eten-drinken', 'Eten & drinken', 'taart', None, 'eten-drinken'),
       'hobby-creatief': ('hobby', 'Hobby', 'palet', None, 'hobby'),
       'sport-buiten': ('sport-outdoor', 'Sport & buiten', 'bal', None, 'sport-outdoor'),
       'tuin-klussen': ('tuin-klussen', 'Tuin & klussen', 'blad', None, 'tuin-klussen'),
       'boeken-films-muziek': ('boeken-media', 'Boeken & media', 'boek', None, 'boeken-media'),
       'dieren': ('dieren', 'Dieren', 'poot', None, 'dieren'),
       'christelijk': ('christelijk', 'Christelijk', 'kruis', None, 'christelijk')}
# de oude boom: data.js zonder 3.0-blok, helemaal uitgevoerd (dus met alle plaatjes en teksten van later)
_d = re.sub(r'/\* ===== 3\.0 NIEUWE BOOM.*?/\* ===== einde 3\.0 ===== \*/\n', '', open(os.path.join(ROOT, 'assets/js/data.js'), encoding='utf-8').read(), flags=re.S)
OUD = json.loads(subprocess.check_output(['node', '-e', 'const w={};new Function("window",require("fs").readFileSync(0,"utf8"))(w);process.stdout.write(JSON.stringify(w.LK_CATEGORIEEN))'], input=_d.encode('utf-8')))
OC = {c['slug']: c for c in OUD}
def oudsub(pad):
    c, s = pad.split('/'); cc = OC.get(c); return next((x for x in (cc or {}).get('subs', []) if x['slug'] == s), None)
def nieuwPad(a, g=None, v=None): return '/c/' + AFD[a][0] + ('/' + slug(g) if g else '') + ('/' + slug(v) if v else '')
# 1-op-1 overgangen: oud vakje -> nieuw vakje (teksten en plaatje gaan mee)
EEN = {}
for k, m in M.items():
    if isinstance(m, tuple) and m[2]: EEN.setdefault(m, []).append(k)
cats = []
for a in BOOM:
    slg, kort, icoon, knoppen, beeldVan = AFD[a['id']]
    oc = OC.get(beeldVan, {})
    c = {'slug': slg, 'naam': a['naam'], 'kort': kort, 'icoon': icoon, 'tegel': oc.get('tegel'), 'banner': oc.get('banner'), 'subs': []}
    if slg == OC.get(slg, {}).get('slug'):
        for x in ('tekst', 'seoTitel', 'seoTekst', 'gids'):
            if OC[slg].get(x): c[x] = OC[slg][x]
    if knoppen: c['knoppen'] = knoppen
    for g in a['groepen']:
        s = {'slug': slug(g['naam']), 'naam': g['naam'], 'vakjes': []}
        for v in g['vakjes']:
            vk = {'slug': slug(v), 'naam': v}
            for oudpad in EEN.get((a['id'], g['naam'], v), [])[:1]:
                os_ = oudsub(oudpad)
                if os_:
                    for x in ('beeld', 'tekst', 'seoTitel', 'seoTekst', 'gids', 'knoppen'):
                        if os_.get(x): vk[x] = os_[x]
                    vk['oud'] = oudpad
            if (a['id'], g['naam'], v) == ('elektronica-gaming', 'Smartwatches', 'Smartwatches'): vk['knoppen'] = ['wie3snel']  # 9-11-2026 GO Marius
            s['vakjes'].append(vk)
        if (a['id'], g['naam']) == ('elektronica-gaming', 'Smartwatches'): s['knoppen'] = ['wie3snel']  # 9-11-2026 GO Marius: Dames / Heren / Kinderen
        # plaatje van de groep: het plaatje van het eerste vakje dat er een heeft (anders kiest de site een productfoto)
        b = next((vk['beeld'] for vk in s['vakjes'] if vk.get('beeld')), None)
        if b: s['beeld'] = b
        c['subs'].append(s)
    cats.append(c)
NIEUW = {c['slug']: c for c in cats}
# doorverwijzingen voor oude adressen
EXTRA = {'mode-beauty/pantoffels-sokken': '/c/mode-sieraden/schoenen-sloffen/pantoffels-sloffen', 'elektronica/drones-vr': '/c/elektronica/foto-video/drones',
         'dranken/gin-cocktails': '/c/eten-drinken/sterke-drank/gin', 'eten-drinken/adventskalenders': '/c/cadeaus/adventskalenders',
         'speelgoed/hypes-trends': '/collectie/toppers-van-nu', 'boeken-media/leesplezier': '/c/boeken-media/boeken'}
def doel(pad, diepte=0):
    if pad in EXTRA: return EXTRA[pad]
    m = M.get(pad)
    if isinstance(m, tuple): return nieuwPad(*m)
    s = oudsub(pad)
    if s and s.get('vak') and diepte < 3: return doel(s['vak'], diepte + 1)
    if s and s.get('naar'): return s['naar']
    return None
OUDCATDOEL = {'sieraden': '/c/mode-sieraden/sieraden', 'geuren-verzorging': '/c/beauty-verzorging', 'mode-beauty': '/c/mode-sieraden',
              'keuken': '/c/wonen/koken-bakken', 'dranken': '/c/eten-drinken', 'metaaldetectie': '/c/sport-outdoor/metaaldetectie',
              'noodpakket-survival': '/c/sport-outdoor/noodpakket-survival'}
mis = []
for oc in OUD:
    if oc['slug'] in ('cadeaus', 'valentijn'): cats.append(oc); continue  # themapagina's: blijven zoals ze zijn (verborgen)
    if oc['slug'] in NIEUW:
        tgt = NIEUW[oc['slug']]; bezet = {s['slug'] for s in tgt['subs']}
    else:
        tgt = {'slug': oc['slug'], 'naam': oc['naam'], 'kort': oc.get('kort'), 'icoon': oc.get('icoon'), 'verborgen': True, 'naar': OUDCATDOEL[oc['slug']], 'subs': []}
        cats.append(tgt); bezet = set()
    for s in oc['subs']:
        if s['slug'] in bezet: continue
        d = doel(oc['slug'] + '/' + s['slug'])
        if not d: mis.append(oc['slug'] + '/' + s['slug']); d = tgt.get('naar') or '/c/' + tgt['slug']
        tgt['subs'].append({'slug': s['slug'], 'naam': s['naam'], 'verborgen': True, 'naar': d})
blok = ('/* ===== 3.0 NIEUWE BOOM (4-11-2026, GO Marius): 12 afdelingen > groepen > vakjes. GEMAAKT DOOR scripts/boom/maak-data.py – niet met de hand bewerken.\n'
        '   Oude afdelingen en vakjes staan er verborgen in met "naar": hun oude adres stuurt door naar de nieuwe plek. ===== */\n'
        'window.LK_CATEGORIEEN = ' + json.dumps(cats, ensure_ascii=False) + ';\n'
        "window.LK_HOME_GROEPEN = ['speelgoed', 'mode-sieraden', 'beauty-verzorging', 'elektronica', 'wonen', 'eten-drinken', 'hobby', 'sport-outdoor'];\n"
        '/* ===== einde 3.0 ===== */\n')
f = os.path.join(ROOT, 'assets/js/data.js'); d = open(f, encoding='utf-8').read()
d = re.sub(r'/\* ===== 3\.0 NIEUWE BOOM.*?/\* ===== einde 3\.0 ===== \*/\n', '', d, flags=re.S)
d = d.rstrip('\n') + '\n\n' + blok  # helemaal onderaan: na alle plaatjes en teksten van eerdere rondes
open(f, 'w', encoding='utf-8').write(d)
print('afdelingen', len(NIEUW), 'groepen', sum(len(c['subs']) for c in NIEUW.values()), 'oude adressen zonder vast doel:', mis)
