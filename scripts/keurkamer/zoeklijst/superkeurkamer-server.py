# -*- coding: utf-8 -*-
"""Superkeurkamer: kleine server op je eigen laptop (http://localhost:8788).
Leest de mini-winkels uit data/, en bewaart jouw keuzes in 'mijn keuzes'. Stuurt NIETS naar de website."""
import os, sys, json, hashlib, threading, webbrowser, datetime, re, socket, time
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
from collections import Counter, OrderedDict
sys.stdout.reconfigure(encoding='utf-8')
HIER = os.path.dirname(os.path.abspath(__file__))
KAMER = os.path.dirname(HIER)
sys.path.insert(0, HIER)
from indeler import plat
import sqlite3
from zoekindex import DB, zoekwoorden
import fotoscore

DATA = os.path.join(KAMER, 'data')
APP = os.path.join(KAMER, 'app')
KEUS = os.path.join(KAMER, 'mijn keuzes')
os.makedirs(KEUS, exist_ok=True)
LIJST = os.path.join(KEUS, 'nieuwe-productlijst.json')
NOTITIES = os.path.join(KEUS, 'partner-notities.json')
CATS = os.path.join(KEUS, 'mijn-categorieen.json')
POORT = 8788
SLOT = threading.RLock()
CACHE = OrderedDict()


def laad_json(pad, standaard):
    try:
        return json.load(open(pad, encoding='utf-8'))
    except Exception:
        return standaard


def bewaar(pad, data):
    tmp = pad + '.tmp'
    json.dump(data, open(tmp, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    os.replace(tmp, pad)
    # elke dag een reservekopie
    rk = os.path.join(KEUS, 'reservekopie')
    os.makedirs(rk, exist_ok=True)
    naam = os.path.basename(pad).replace('.json', '-' + datetime.date.today().isoformat() + '.json')
    json.dump(data, open(os.path.join(rk, naam), 'w', encoding='utf-8'), ensure_ascii=False)


SITE_JS = os.environ.get('SKK_SITE', r'C:\Users\egelt\Documents\LeukeKeuze-Zoekindex\assets\js\producten.js')
# 16-11-2026 (Marius: 'als ik ga kijken moeten er alleen spullen staan die we nog niet hebben'):
# wat al op leukekeuze.nl staat (of stond en is weggehaald) laat de Superkeurkamer niet meer zien.
# Bron: de live productlijst van de site (elk half uur vers, kopie in data/site-cache) plus de nachtelijke kopie hierboven.
SITE_LIVE = os.environ.get('SKK_LIVE', 'https://leukekeuze.nl')
SITE_CACHE = os.path.join(DATA, 'site-cache')
SITE = {'sleutel': None, 'gecheckt': 0, 'versie': 0, 'titels': set(), 'urls': set(), 'hash': set(), 'lego': set(),
        'wtitels': set(), 'wurls': set(), 'whash': set(), 'wlego': set()}
PARAM_DIEP = ('r', 'u', 'ued', 'murl', 'dl', 'url', 'desturl', 'redirect')
LEGO_NR = re.compile(r'\b(\d{5})\b')
VELD = re.compile(r"""["']?(id|titel|url|winkelUrl)["']?\s*:\s*("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')""")


def titel_kern(t):
    return re.sub(r'[^a-z0-9]+', ' ', plat(t or '')).strip()


def url_kern(u):
    """https://www.winkel.nl/pad/product.html?x=1 -> winkel.nl/pad/product.html"""
    u = (u or '').lower().split('#')[0].split('?')[0]
    u = re.sub(r'^https?://(www\.)?', '', u).rstrip('/')
    return u if '/' in u else ''


def diep(u):
    """Partnerlink -> de gewone winkelpagina die erin zit (r=, u=, ued=, murl=, dl=)."""
    try:
        q = parse_qs(urlparse(u or '').query)
    except Exception:
        return ''
    for k in PARAM_DIEP:
        for v in q.get(k, []):
            if v.startswith('http'):
                return v
    return ''


def url_kernen(*us):
    """Winkelpagina's (zonder partnerlink eromheen). Een partnerlink zelf telt niet: die is voor veel producten gelijk."""
    uit = set()
    for u in us:
        k = url_kern(diep(u) or u)
        if k and len(k.split('/', 1)[1]) >= 6 and not re.search(r'(tradetracker|awin1|daisycon|partner\.|/c$|cread\.php|/tt/?$|/click)', k):
            uit.add(k)
    return uit


def link_hash(u):
    """Een product-id op de site is winkel + de eerste 10 tekens van md5(link)."""
    return hashlib.md5(u.encode('utf-8')).hexdigest()[:10] if u else ''


def lego_nrs(t):
    t = plat(t or '')
    return set(LEGO_NR.findall(t)) if 'lego' in t else set()


def haal_live(naam):
    """Een bestand van leukekeuze.nl, hooguit een half uur oud. Geen internet: de laatste kopie."""
    os.makedirs(SITE_CACHE, exist_ok=True)
    pad = os.path.join(SITE_CACHE, naam)
    try:
        if not os.path.exists(pad) or time.time() - os.path.getmtime(pad) > 1800:
            import urllib.request
            req = urllib.request.Request(SITE_LIVE + '/assets/js/' + naam + '?t=' + str(int(time.time() // 1800)),
                                         headers={'User-Agent': 'Superkeurkamer'})
            b = urllib.request.urlopen(req, timeout=40).read()
            if len(b) > 100000:
                tmp = pad + '.tmp'
                with open(tmp, 'wb') as f:
                    f.write(b)
                os.replace(tmp, pad)
    except Exception:
        pass
    try:
        return open(pad, encoding='utf-8').read(), os.path.getmtime(pad)
    except OSError:
        return '', 0


def lees_waarde(v):
    if v[0] == "'":
        v = '"' + v[1:-1].replace("\\'", "'").replace('"', '\\"') + '"'
    try:
        return json.loads(v)
    except Exception:
        return v[1:-1]


OBJ = re.compile(r'\{"id":"((?:[^"\\]|\\.)*)","titel":"((?:[^"\\]|\\.)*)"')


def _objecten(tekst):
    """id -> titel uit producten-lean.js / producten-site.js (JSON.parse('...'): elke backslash staat er dubbel)."""
    uit = {}
    for m in OBJ.finditer(tekst.replace('\\\\', '\\')):
        try:
            uit[m.group(1)] = json.loads('"' + m.group(2) + '"')
        except Exception:
            uit[m.group(1)] = m.group(2)
    return uit


def _sets(ids, titels, det):
    ti, ur, ha, le = set(), set(), set(), set()
    for i in ids:
        t = titels.get(i, '')
        k = titel_kern(t)
        if k:
            ti.add(k)
        le |= lego_nrs(t)
        h = i.rsplit('-', 1)[-1]
        if re.fullmatch(r'[0-9a-f]{10}', h):
            ha.add(h)
        d = det.get(i) or {}
        ur |= url_kernen((d.get('url') or '').replace('\\/', '/'), (d.get('winkelUrl') or '').replace('\\/', '/'))
    return ti, ur, ha, le


def site_index():
    """27-11-2026 (marktlijst voor de nieuwe site): wat NU op leukekeuze.nl staat krijgt het label 'Al op de site' (Marius kiest
    voor de nieuwe site opnieuw, ook uit wat er al staat); wat hij heeft WEGGEGOOID (afgekeurd) laat de Superkeurkamer niet meer zien.
    Nu = producten-site.js (de lijst zonder afgekeurde producten); weggegooid = producten-lean.js min producten-site.js."""
    with SLOT:
        if SITE['sleutel'] and time.time() - SITE['gecheckt'] < 60:
            return SITE
        SITE['gecheckt'] = time.time()
        lean, t1 = haal_live('producten-lean.js')
        nu_js, t3 = haal_live('producten-site.js')
        det_js, t2 = haal_live('producten-details.js')
        sleutel = (t1, t2, t3)
        if SITE['sleutel'] == sleutel:
            return SITE
        alle, nu = _objecten(lean), _objecten(nu_js)
        try:
            det = json.loads(det_js[det_js.index('{'):det_js.rstrip().rstrip(';').rindex('}') + 1])
        except Exception:
            det = {}
        if not nu:                      # producten-site.js niet te krijgen: niets verbergen, alles krijgt het label
            nu, alle = alle, alle
        nt, nu_u, nh, nl = _sets(list(nu), nu, det)
        wt, wu, wh, wl = _sets([i for i in alle if i not in nu], alle, det)
        SITE.update(sleutel=sleutel, versie=SITE['versie'] + 1, titels=nt, urls=nu_u, hash=nh, lego=nl,
                    wtitels=wt - nt, wurls=wu - nu_u, whash=wh - nh, wlego=wl - nl)
    return SITE


def op_site(t, u, l=None):
    """'nu' = staat op de site (label), 'weg' = Marius gooide het weg (niet tonen), '' = nieuw.
    Op naam, winkelpagina, link-code of LEGO-nummer."""
    s = site_index()
    tk, uk, hs, nrs = titel_kern(t), url_kernen(u, l), {link_hash(l), link_hash(u)} - {''}, lego_nrs(t)
    if tk in s['titels'] or uk & s['urls'] or hs & s['hash'] or (nrs and nrs & s['lego']):
        return 'nu'
    if tk in s.get('wtitels', ()) or uk & s.get('wurls', set()) or hs & s.get('whash', set()) or (nrs and nrs & s.get('wlego', set())):
        return 'weg'
    return ''


def op_site_p(p):
    """Zelfde, maar onthouden per product van een partner (tot de lijst van de site verandert)."""
    o = p.get('_os')
    if not o or o[0] != SITE['versie']:
        o = (SITE['versie'], op_site(p.get('t'), p.get('u'), p.get('l')))
        p['_os'] = o
    return o[1]


def sleutel(pid, p):
    from zoekindex import sleutel as s
    return s(pid, p['t'], p['m'])


def partner(pid):
    with SLOT:
        if pid in CACHE:
            CACHE.move_to_end(pid)
            return CACHE[pid]
    pad = os.path.join(DATA, 'p', re.sub(r'[^a-z0-9]', '', pid) + '.json')
    if not os.path.exists(pad):
        return None
    d = json.load(open(pad, encoding='utf-8'))
    from zoekindex import sleutels
    for p, k in zip(d['producten'], sleutels(pid, d['producten'])):
        p['key'] = k
        p['_z'] = plat(p['t'] + ' ' + p['m'])
        p['pct'] = round(100 * (p['o'] - p['p']) / p['o']) if p['o'] else 0
    with SLOT:
        CACHE[pid] = d
        while len(CACHE) > 8:
            CACHE.popitem(last=False)
    return d


def filter_producten(d, q):
    pad = json.loads(q.get('pad', ['[]'])[0] or '[]')
    zoek = zoekwoorden(q.get('q', [''])[0]) or plat(q.get('q', [''])[0]).split()   # 28-11-2026: 'bijtringen' vindt ook 'bijtring'
    korting = q.get('korting', [''])[0] == '1'
    pop = q.get('pop', [''])[0] == '1'
    voorraad = q.get('voorraad', [''])[0] == '1'
    merk = q.get('merk', [''])[0]
    kenm = [k for k in q.get('kenmerk', [''])[0].split('|') if k]
    lo = float(q.get('min', ['0'])[0] or 0)
    hi = float(q.get('max', ['0'])[0] or 0)
    site_index()
    basis = [p for p in d['producten'] if p['g'][:len(pad)] == pad and op_site_p(p) != 'weg']   # 27-11-2026: alleen wat hij weggooide niet
    uit = []
    for p in basis:
        if zoek and not all(w in p['_z'] for w in zoek):
            continue
        if korting and not p['o']:
            continue
        if pop and not p['pop']:
            continue
        if voorraad and not p['st']:
            continue
        if merk and p['m'] != merk:
            continue
        if kenm and not all(k in p['k'] for k in kenm):
            continue
        if lo and p['p'] < lo:
            continue
        if hi and p['p'] > hi:
            continue
        uit.append(p)
    return pad, basis, uit


def api_producten(q):
    pid = q.get('id', [''])[0]
    d = partner(pid)
    if not d:
        return {'fout': 'Partner niet gevonden'}
    pad, basis, uit = filter_producten(d, q)
    verbreed = ''
    if pad and q.get('q', [''])[0].strip() and not uit:
        # 28-11-2026: niets in deze groep? dan in de hele winkel zoeken (en dat zeggen)
        q2 = dict(q); q2['pad'] = ['[]']
        _, _, uit2 = filter_producten(d, q2)
        if uit2:
            verbreed, uit, pad = pad[-1], uit2, []
    sort = q.get('sort', ['aanbevolen'])[0]
    if sort == 'korting':
        uit.sort(key=lambda p: (-p['pct'], p['p']))
    elif sort == 'prijs-op':
        uit.sort(key=lambda p: p['p'])
    elif sort == 'prijs-af':
        uit.sort(key=lambda p: -p['p'])
    elif sort == 'naam':
        uit.sort(key=lambda p: p['t'].lower())
    else:
        uit.sort(key=lambda p: (-p['pop'], -(p['pct'] >= 10), -bool(p['f']), -p['st'], p['i']))
    # kinderen van dit pad (met de filters toegepast)
    kind = Counter()
    foto = {}
    for p in uit:
        if len(p['g']) > len(pad):
            k = p['g'][len(pad)]
            kind[k] += 1
            if k not in foto and p['f']:
                foto[k] = p['f']
    volgorde = sorted(kind, key=lambda k: (k.startswith('Overig') or k.startswith('Zonder'), -kind[k]))
    kinderen = [{'naam': k, 'n': kind[k], 'foto': foto.get(k, '')} for k in volgorde]
    km = Counter(k for p in uit for k in p['k'])
    mk = Counter(p['m'] for p in uit if p['m'])
    cats_van = {x['key']: x.get('categorieen', []) for x in laad_json(LIJST, {'producten': []})['producten']}
    gekozen = set(cats_van)
    actief = q.get('cat', [''])[0]
    pagina = int(q.get('pagina', ['1'])[0] or 1)
    per = 60
    stuk = uit[(pagina - 1) * per: pagina * per]
    return {'verbreed': verbreed, 'totaal': len(uit), 'basis': len(basis), 'verborgen': sum(1 for p in d['producten'] if p['g'][:len(pad)] == pad and p.get('_os', (0, ''))[1] == 'weg'), 'pagina': pagina, 'paginas': max(1, -(-len(uit) // per)),
            'kinderen': kinderen,
            'kenmerken': [[k, n] for k, n in km.most_common(16) if n < len(uit) or len(uit) < 4],
            'merken': [[k, n] for k, n in mk.most_common(40)],
            'korting': sum(1 for p in uit if p['o']), 'populair': sum(1 for p in uit if p['pop']),
            'producten': [{k: v for k, v in p.items() if k not in ('_z', '_os')} | {'gekozen': p['key'] in gekozen,
                         'inCat': bool(actief) and actief in cats_van.get(p['key'], []),
                         'opsite': p.get('_os', (0, ''))[1] == 'nu'} for p in stuk]}


CATA = {'tijd': None, 'feed': {}}


def feed_datum(pid):
    """Wanneer heeft TradeTracker de feed van deze winkel voor het laatst bijgewerkt? (uit de lijst van Marius, 9-11-2026)"""
    f = os.path.join(HIER, 'partners-catalogus.json')
    try:
        t = os.path.getmtime(f)
    except OSError:
        return None, False
    if CATA['tijd'] != t:
        CATA['feed'] = {p['id']: p.get('tt_bijgewerkt') for p in laad_json(f, [])}
        CATA['tijd'] = t
    d = CATA['feed'].get(pid)
    if not d:
        return None, False
    oud = (datetime.date.today() - datetime.date.fromisoformat(d)).days > 180
    return datetime.date.fromisoformat(d).strftime('%d-%m-%Y'), oud


def api_partners():
    lijst = laad_json(os.path.join(DATA, 'partners.json'), [])
    cadeau = {x['id'] for x in laad_json(os.path.join(DATA, 'cadeaupartners.json'), [])}
    gek = Counter(x['partner'] for x in laad_json(LIJST, {'producten': []})['producten'])
    no = laad_json(NOTITIES, {})
    slecht = {x[0] for x in laad_json(os.path.join(DATA, 'fotocheck.json'), {'slecht': []})['slecht']}
    for p in lijst:
        p['gekozen'] = gek.get(p['id'], 0)
        p['notitie'] = no.get(p['id'], {})
        p['fotoslecht'] = p['id'] in slecht and p.get('n', 0) > 0
        p['feeddatum'], p['feedoud'] = feed_datum(p['id'])
        p['cadeau'] = p['id'] in cadeau
    return lijst


def api_partner(pid):
    d = partner(pid)
    if not d:
        return {'fout': 'Partner niet gevonden'}
    info = dict(d['info'])
    info['notitie'] = laad_json(NOTITIES, {}).get(pid, {})
    info['feeddatum'], info['feedoud'] = feed_datum(pid)
    info['fotoslecht'] = pid in {x[0] for x in laad_json(os.path.join(DATA, 'fotocheck.json'), {'slecht': []})['slecht']}
    info['gekozen'] = sum(1 for x in laad_json(LIJST, {'producten': []})['producten'] if x['partner'] == pid)
    # foto per boomknoop (voor de rondjes)
    foto = {}
    for p in d['producten']:
        if not p['f']:
            continue
        for i in range(1, len(p['g']) + 1):
            k = '␟'.join(p['g'][:i])
            if k not in foto or (p['pop'] and not foto[k][1]):
                foto[k] = (p['f'], p['pop'])
    boom = [dict(b, foto=foto.get('␟'.join(b['pad']), ('', 0))[0]) for b in d['boom']]
    return {'info': info, 'boom': boom}


def product_uit_partner(pid, key):
    d = partner(pid)
    p = next((x for x in d['producten'] if x['key'] == key), None) if d else None
    if not p:
        return None
    return {'key': key, 'partner': pid, 'winkel': d['info']['naam'], 'netwerk': d['info']['netwerk'],
            'titel': p['t'], 'merk': p['m'], 'prijs': p['p'], 'oud': p['o'], 'foto': p['f'],
            'link': p['l'], 'winkelurl': p['u'], 'groep': p['g'], 'kenmerken': p['k'],
            'populair': p['pop'], 'gekozen_op': datetime.datetime.now().strftime('%Y-%m-%d %H:%M'), 'notitie': '', 'categorieen': [],
            'ean': p.get('e', '')}


def api_kies(body):
    """Zonder 'cat': product in/uit de lijst (vanuit een partner). Met 'cat': product in/uit die categorie."""
    with SLOT:
        lijst = laad_json(LIJST, {'producten': []})
        pid, key, cat = body['partner'], body['key'], body.get('cat')
        x = next((x for x in lijst['producten'] if x['key'] == key), None)
        in_cat, weg = False, None
        if cat:
            if not x:
                x = product_uit_partner(pid, key)
                if not x:
                    return {'fout': 'Product niet gevonden'}
                x['bron'] = 'categorie'
                x['categorieen'] = [cat]
                lijst['producten'].append(x)
                in_cat = True
            else:
                cs = x.setdefault('categorieen', [])
                if cat in cs:
                    cs.remove(cat)
                    if not cs and x.get('bron') == 'categorie':
                        lijst['producten'].remove(x)
                        weg = x
                    x = None
                else:
                    cs.append(cat)
                    in_cat = True
            gekozen = x is not None
        else:
            if x:
                lijst['producten'].remove(x)
                weg = x
                gekozen = False
            else:
                x = product_uit_partner(pid, key)
                if not x:
                    return {'fout': 'Product niet gevonden'}
                x['bron'] = 'partner'
                lijst['producten'].append(x)
                gekozen = True
        lijst['bijgewerkt'] = datetime.datetime.now().strftime('%Y-%m-%d %H:%M')
        lijst['uitleg'] = 'Nieuwe productlijst voor LeukeKeuze, apart gehouden. Gaat pas naar de site na overleg met Marius.'
        bewaar(LIJST, lijst)
        uit = {'gekozen': gekozen, 'inCat': in_cat, 'aantal': len(lijst['producten'])}
        if weg:
            uit['weg'] = weg
        if gekozen and x:
            # hetzelfde product al gekozen bij een andere winkel? (zelfde naam)
            k = titel_kern(x['titel'])
            uit['dubbel'] = sorted({y['winkel'] for y in lijst['producten'] if y is not x and y['key'] != x['key'] and titel_kern(y['titel']) == k})
            uit['opsite'] = op_site(x['titel'], x.get('winkelurl')) == 'nu'
        return uit


def api_herstel(body):
    """Ongedaan maken: een product dat net uit de lijst is gehaald precies zo terugzetten (met categorieën en notitie)."""
    x = body.get('product')
    if not isinstance(x, dict) or not x.get('key'):
        return {'fout': 'Niets om terug te zetten'}
    with SLOT:
        lijst = laad_json(LIJST, {'producten': []})
        lijst['producten'] = [y for y in lijst['producten'] if y['key'] != x['key']] + [x]
        lijst['bijgewerkt'] = datetime.datetime.now().strftime('%Y-%m-%d %H:%M')
        bewaar(LIJST, lijst)
        return {'ok': True, 'aantal': len(lijst['producten'])}


def api_lijst():
    """De lijst, met de prijs van nu uit de feeds erbij (en of het product nog in de feed staat)."""
    lijst = laad_json(LIJST, {'producten': []})
    keys = [x['key'] for x in lijst['producten']]
    nu = {}
    if keys and os.path.exists(DB):
        c = sqlite3.connect('file:' + DB + '?mode=ro', uri=True)
        try:
            for i in range(0, len(keys), 500):
                stuk = keys[i:i + 500]
                for k, p, o in c.execute('SELECT key, p, o FROM p WHERE key IN (%s)' % ','.join('?' * len(stuk)), stuk):
                    nu[k] = (p, o)
        finally:
            c.close()
    for x in lijst['producten']:
        if nu:
            if x['key'] in nu:
                x['prijs_nu'], x['oud_nu'] = nu[x['key']]
                x['in_feed'] = True
            else:
                x['in_feed'] = False
        x['opsite'] = op_site(x.get('titel'), x.get('winkelurl')) == 'nu'
    return lijst


# ---------- Mijn categorieën ----------
def cats_laden():
    return laad_json(CATS, {'cats': [], 'volgende': 1})


def api_cats():
    c = cats_laden()
    tel = Counter(cid for x in laad_json(LIJST, {'producten': []})['producten'] for cid in x.get('categorieen', []))
    for k in c['cats']:
        k['n'] = tel.get(k['id'], 0)
    return c


def api_cats_post(body):
    with SLOT:
        c = cats_laden()
        actie = body.get('actie')
        cats = c['cats']
        if actie == 'nieuw':
            naam = (body.get('naam') or '').strip()[:60]
            if not naam:
                return {'fout': 'Geef de categorie een naam'}
            cid = 'c%d' % c['volgende']
            c['volgende'] += 1
            ouder = body.get('ouder') or None
            cats.append({'id': cid, 'naam': naam, 'ouder': ouder,
                         'volgorde': 1 + max([k['volgorde'] for k in cats if k['ouder'] == ouder] or [0])})
            bewaar(CATS, c)
            return {'ok': True, 'id': cid}
        k = next((k for k in cats if k['id'] == body.get('id')), None)
        if not k:
            return {'fout': 'Categorie niet gevonden'}
        if actie == 'hernoem':
            naam = (body.get('naam') or '').strip()[:60]
            if naam:
                k['naam'] = naam
        elif actie in ('omhoog', 'omlaag'):
            broers = sorted([b for b in cats if b['ouder'] == k['ouder']], key=lambda b: b['volgorde'])
            i = broers.index(k)
            j = i - 1 if actie == 'omhoog' else i + 1
            if 0 <= j < len(broers):
                broers[i]['volgorde'], broers[j]['volgorde'] = broers[j]['volgorde'], broers[i]['volgorde']
        elif actie == 'weg':
            weg = {k['id']}
            groei = True
            while groei:
                groei = False
                for b in cats:
                    if b['ouder'] in weg and b['id'] not in weg:
                        weg.add(b['id']); groei = True
            c['cats'] = [b for b in cats if b['id'] not in weg]
            lijst = laad_json(LIJST, {'producten': []})
            for x in lijst['producten']:
                x['categorieen'] = [i for i in x.get('categorieen', []) if i not in weg]
            bewaar(LIJST, lijst)
        bewaar(CATS, c)
        return {'ok': True}


def fts_term(t):
    """Een zoekwoord uit de zoeklijst als FTS-zin. Een spatie aan het begin of eind blijft staan ('gin ' vindt geen 'ging', ' rum ' geen 'rumrozijn')."""
    eind = t.endswith(' ')
    begin = t.startswith(' ')
    w = re.sub(r'\s+', ' ', plat(t)).strip()
    if eind:
        w += ' '
    if begin:
        w = ' ' + w
    return '"%s"' % w.replace('"', '') if len(w.strip()) >= 3 else ''


# 14-11-2026: bij slim zoeken eerst de cadeauwinkels die bij ons goed lopen, achteraan de grote algemene winkels met veel rommel.
FIJN = ('ditverzinjeniet', 'cadeau', 'coolgift', 'hema', 'dillekamille', 'degrotespeelgoedwinkel', 'nedgame', 'kadoversturen', 'grotekadoshop',
        'animalsgiftshop', 'superzero', 'droptelegram', 'bloompost', '999games', 'boardgameshop', 'countrylifestyle', 'cartoonmegastore', 'parfumania',
        'toprc', 'emp', 'lego', 'gestrikt', 'surprose', 'bellatio', 'megagadgets', 'yoursurprise', 'doenkado', 'makemefamous', 'tegeltje', 'invulboekjes',
        'knuffelparadijs', 'pillowbuddies', 'teufel', 'coolblue', 'kerstland', 'dropwinkel', 'decantalo', 'wijny', 'spaarpottenwinkel', 'gadgetsentrends',
        'good4fun', 'naturesgift', 'keymoments', 'yesgifts', 'robotime', 'wizardingworld', 'fiftiesstore', 'ijzersterkegeschenken', 'stroopwafels', 'woodwick', 'woewoe')
LAAG = ('aliexpress', 'joybuy', 'dealdonkey', 'favoshop', 'wiwantit', 'domoticahouse', 'myzenful', 'bandanawinkel', 'bigsizeshirts', 'speelgoedpostorder',
        'handpoppenwinkel', 'pazzox', '1dagactie', 'vevor', 'homixa', 'woonkampioen', 'coppenswarenhuis', 'timarco', 'maxistock', 'warentuin')
SLIM_CACHE = OrderedDict()
# 27-11-2026: winkels die dicht zijn (verhuisd naar Daily at Home, links dood), geen losse cadeaus verkopen of 403 geven: nooit tonen
WEG_WINKELS = ('aliexpress', 'yesgifts', 'laredoute', 'kadoversturen', 'animalsgiftshop', 'cartoonmegastore', 'surpriseswinkel', 'handpoppenwinkel',
               'speelgoedpostorder', 'bandanawinkel', 'bigsizeshirts', 'spaarpottenwinkel', 'fashionstore', 'piercings', 'koppverlag')
ALTIJD_NIET = ('vervangende', 'reserveonderdeel', 'navulling', 'refill', 'bevestigingsmateriaal', 'bewegingssensor', 'stopcontact', 'babyfoon', 'muggen',
               'penis', 'piemel', 'milf', 'sexy', 'erotisch', 'erotiek', 'tieten', 'vibrator', 'kutkerst', 'seksspel',   # grof: niet op een cadeausite
               'satisfyer', 'tepelpiercing', 'navelpiercing', 'armbrust', 'kruisboog', 'crossbow', 'vlindermes', 'stiletto', 'boksbeugel', 'werpster', 'springmes')   # 27-11-2026: wapens en piercings


def soort_van(cat):
    """14-11-2026: een categorie uit de zoeklijst met slimme zoekwoorden (zoek/niet), of None."""
    if not cat:
        return None
    return next((k for k in cats_laden()['cats'] if k['id'] == cat and k.get('zoek')), None)


FIJN_S, LAAG_S = set(FIJN), set(LAAG)
MERKLOOS = {'merkloos', 'onbekend', 'no brand', 'geen merk', 'generic', 'huismerk', 'nvt', 'n.v.t.', ''}


def kwaliteit(r, zoek, ook):
    """27-11-2026 (Marius: 'de mooiste en beste producten als eerste, met de mooiste foto's'): een cijfer per product.
    r = (id, pid, winkel, t, u, l, f, st, pop, m, p). Goede cadeauwinkel, op voorraad, mooie foto, de soort staat in de naam
    (niet alleen in de afdeling), een merk, een nette naam (niet lang, niet in hoofdletters, geen rij streepjes)."""
    pid, t, f, st, pop, m = r[1], r[3] or '', r[6], r[7], r[8], r[9]
    s = 3.0 if pid in FIJN_S else (-4.0 if pid in LAAG_S else 0.0)
    if pid == 'bol':
        s += 1
    if not st:
        s -= 8
    if not f:
        s -= 10
    tl = ' ' + plat(t) + ' '
    if any(z in tl for z in zoek) and (not ook or any(o in tl for o in ook)):
        s += 2
    else:
        s -= 3                          # de soort staat alleen in de afdeling of het merk, niet in de naam
    if pop:
        s += 1
    if plat(m or '').strip() not in MERKLOOS:
        s += 0.5
    n = len(t)
    s -= 2 if n > 140 else 1 if n > 110 else 0
    if n < 12:
        s -= 1
    letters = [ch for ch in t if ch.isalpha()]
    if letters and sum(ch.isupper() for ch in letters) / len(letters) > 0.6:
        s -= 1
    if t.count(' - ') + t.count(' | ') + t.count(', ') >= 4:
        s -= 1
    try:
        fs = fotoscore.score(f)
    except Exception:
        fs = None
    if fs is not None:
        s += -6 if fs < 0 else 4 * fs - 1
    return s


def spreid(rijen, cijfers, n=300):
    """De beste eerst, maar niet twintig keer achter elkaar dezelfde winkel: elke volgende van dezelfde winkel telt iets minder."""
    orde = sorted(range(len(rijen)), key=lambda i: -cijfers[i])
    top, staart = orde[:n], orde[n:]
    uit, tel = [], Counter()
    while top:
        j = max(range(len(top)), key=lambda x: cijfers[top[x]] - 0.4 * tel[rijen[top[x]][1]])
        i = top.pop(j)
        tel[rijen[i][1]] += 1
        uit.append(i)
    return [rijen[i] for i in uit + staart]


def api_zoek(q, fotos_vragen=True):
    uit = _api_zoek(q, fotos_vragen)
    # 28-11-2026: typ je iets binnen een soort en vindt hij daar niets, dan zoeken we in alle partners (en zeggen we dat)
    if q.get('slim', [''])[0] == '1' and zoekwoorden(q.get('q', [''])[0]) and not uit.get('totaal') and not uit.get('fout'):
        q2 = {k: v for k, v in q.items() if k not in ('slim', 'min', 'max')}
        uit2 = _api_zoek(q2, fotos_vragen)
        if uit2.get('totaal'):
            uit2['buiten_soort'] = True
            return uit2
    return uit


def api_waar(q):
    """28-11-2026: bij welke winkels staat dit woord (voor de partnerpagina): per winkel het aantal en een foto."""
    woorden = zoekwoorden(q.get('q', [''])[0])
    if not woorden or not os.path.exists(DB):
        return {'woorden': woorden, 'winkels': []}
    c = sqlite3.connect('file:' + DB + '?mode=ro', uri=True)
    try:
        rijen = c.execute('SELECT p.pid, p.winkel, count(*), max(CASE WHEN p.pop = 1 THEN p.f ELSE \'\' END), max(p.f) FROM p '
                          'WHERE p.id IN (SELECT rowid FROM z WHERE z MATCH ?) AND p.pid NOT IN (%s) GROUP BY p.pid ORDER BY count(*) DESC LIMIT 60'
                          % ','.join("'%s'" % x for x in WEG_WINKELS),
                          (' AND '.join('"%s"' % w.replace('"', '') for w in woorden),)).fetchall()
    finally:
        c.close()
    return {'woorden': woorden, 'winkels': [{'id': a, 'naam': b, 'n': n, 'foto': f1 or f2} for a, b, n, f1, f2 in rijen]}


def _api_zoek(q, fotos_vragen=True):
    woorden = zoekwoorden(q.get('q', [''])[0])
    cat = q.get('cat', [''])[0]
    waar, args = [], []
    # Slim zoeken (14-11-2026): de soort zoekt op al zijn eigen woorden (een van deze), zonder de niet-woorden.
    # Wat je zelf typt komt er nog bij (verfijnen binnen de soort).
    soort = soort_van(cat) if q.get('slim', [''])[0] == '1' else None
    if soort:
        ja = [x for x in (fts_term(t) for t in soort['zoek']) if x]
        nee = [x for x in (fts_term(t) for t in list(soort.get('niet', [])) + list(ALTIJD_NIET)) if x]
        expr = '(' + ' OR '.join(ja) + ')'
        ook = [x for x in (fts_term(t) for t in soort.get('ook', [])) if x]
        if ook:
            expr = '(' + expr + ' AND (' + ' OR '.join(ook) + '))'
        if woorden:
            expr = '(' + expr + ' AND ' + ' AND '.join('"%s"' % w.replace('"', '') for w in woorden) + ')'
        if nee:
            expr += ' NOT (' + ' OR '.join(nee) + ')'
        waar.append('p.id IN (SELECT id FROM temp.slim)')
        slim_expr = expr
    elif woorden:
        waar.append('p.id IN (SELECT rowid FROM z WHERE z MATCH ?)')
        args.append(' AND '.join('"%s"' % w.replace('"', '') for w in woorden))
    pid = q.get('partner', [''])[0]
    waar.append('p.pid NOT IN (%s)' % ','.join("'%s'" % x for x in WEG_WINKELS))
    if soort and soort.get('winkels'):
        waar.append('p.pid IN (%s)' % ','.join('?' * len(soort['winkels'])))
        args += list(soort['winkels'])
    if q.get('korting', [''])[0] == '1':
        waar.append('p.o > 0')
    if q.get('pop', [''])[0] == '1':
        waar.append('p.pop = 1')
    for k, op in (('min', '>='), ('max', '<=')):
        v = q.get(k, [''])[0]
        if v:
            waar.append('p.p %s ?' % op); args.append(float(v))
    merk = q.get('merk', [''])[0].strip().lower()
    if merk:
        # merk staat meestal in het merkveld, soms alleen in de titel
        waar.append('(lower(p.m) LIKE ? OR lower(p.t) LIKE ?)'); args += ['%' + merk + '%'] * 2
    if soort:
        pass
    elif not woorden and len(merk) >= 2:
        woorden = []
    elif not woorden:
        return {'totaal': 0, 'producten': [], 'partners': [], 'pagina': 1, 'paginas': 1, 'leeg': True}
    if not os.path.exists(DB):
        return {'fout': 'De zoekindex is er nog niet. Dubbelklik op "Superkeurkamer verversen".'}
    c = sqlite3.connect('file:' + DB + '?mode=ro', uri=True)
    try:
        if soort:
            # de zoekvraag van een soort is zwaar (veel woorden): één keer uitrekenen, 10 minuten onthouden (14-11-2026)
            ids = SLIM_CACHE.get(slim_expr)
            if not ids or time.time() - ids[0] > 600:
                ids = (time.time(), [r[0] for r in c.execute('SELECT rowid FROM z WHERE z MATCH ?', (slim_expr,))])
                SLIM_CACHE[slim_expr] = ids
                if len(SLIM_CACHE) > 60:
                    SLIM_CACHE.pop(next(iter(SLIM_CACHE)))
            c.execute('CREATE TEMP TABLE slim(id INTEGER PRIMARY KEY)')
            c.executemany('INSERT INTO temp.slim VALUES (?)', ((i,) for i in ids[1]))
        basis = ' AND '.join(waar) or '1'
        sort = q.get('sort', ['beste'])[0]
        orde = {'korting': 'p.pct DESC, p.p', 'prijs-op': 'p.p', 'prijs-af': 'p.p DESC', 'naam': 'p.t'}.get(sort, '')
        oargs = []
        if not orde:
            orde = '(instr(lower(p.t), ?) > 0) DESC, p.pop DESC, (p.pct >= 10) DESC, (p.f != \'\') DESC, p.st DESC, length(p.t)'
            if soort:
                orde = ("(CASE WHEN p.pid IN (%s) THEN 0 WHEN p.pid IN (%s) THEN 2 ELSE 1 END), " % (','.join("'%s'" % x for x in FIJN), ','.join("'%s'" % x for x in LAAG))) + orde
            oargs = [woorden[0] if woorden else (re.sub(r'\s+', ' ', plat(soort['zoek'][0])).strip() if soort else merk)]
        # 16-11-2026 (Marius: 'als ik ga kijken moeten er alleen spullen staan die we nog niet hebben'):
        # eerst alles wat past, op volgorde; dan weg wat al op de site staat of stond; dan pas de bladzijde.
        site_index()
        kand = c.execute('SELECT p.id, p.pid, p.winkel, p.t, p.u, p.l, p.f, p.st, p.pop, p.m, p.p FROM p WHERE %s ORDER BY %s' % (basis, orde), args + oargs).fetchall()
        # 27-11-2026: wat Marius weggooide niet tonen; wat nu op de site staat wel, met het label 'Al op de site'
        status = {r[0]: op_site(r[3], r[4], r[5]) for r in kand}
        vrij = [r for r in kand if status[r[0]] != 'weg']
        verborgen = len(kand) - len(vrij)
        if soort and sort == 'beste':
            zk = [' ' + plat(x).strip() if x.startswith(' ') else plat(x).strip() for x in soort['zoek']]
            zk = [x + ' ' if t.endswith(' ') else x for x, t in zip(zk, soort['zoek'])]
            ok_ = [plat(x).strip() for x in soort.get('ook', [])]
            vrij = spreid(vrij, [kwaliteit(r, zk, ok_) for r in vrij])
            if fotos_vragen:
                try:
                    fotoscore.vraag([r[6] for r in vrij[:60] if r[6]])
                except Exception:
                    pass
        tel = Counter((r[1], r[2]) for r in vrij)
        partners = [(a, b, n) for (a, b), n in tel.most_common(80)]
        sel = [r[0] for r in vrij if not pid or r[1] == pid]
        totaal = len(sel)
        pagina = int(q.get('pagina', ['1'])[0] or 1)
        heeft_e = any(r[1] == 'e' for r in c.execute('PRAGMA table_info(p)'))
        ids = sel[(pagina - 1) * 60: pagina * 60]
        rijen = []
        if ids:
            rij = {r[0]: r[1:] for r in c.execute('SELECT p.id, pid, winkel, key, t, m, p, o, pct, f, u, l, g, k, pop, st, v%s FROM p WHERE p.id IN (%s)'
                                                    % (", e" if heeft_e else ", ''", ','.join('?' * len(ids))), ids)}
            rijen = [rij[i] for i in ids if i in rij]
        # zelfde product (zelfde barcode) bij andere winkels: prijs vergelijken
        ook = {}
        eans = sorted({r[16] for r in rijen if r[16] and len(r[16]) >= 8})
        if heeft_e and eans:
            for e, opid, owinkel, op in c.execute('SELECT e, pid, winkel, p FROM p WHERE e IN (%s)' % ','.join('?' * len(eans)), eans):
                ook.setdefault(e, []).append((opid, owinkel, op))
    finally:
        c.close()
    try:
        import prijzen
        pinfo = prijzen.info([r[2] for r in rijen])
    except Exception:
        pinfo = {}
    lijst = {x['key']: x for x in laad_json(LIJST, {'producten': []})['producten']}
    uit = []
    gezien_t = set()
    for r in rijen:
        if soort:
            tk = titel_kern(r[3])
            if tk in gezien_t:
                continue
            gezien_t.add(tk)
        x = lijst.get(r[2])
        uit.append({'partner': r[0], 'winkel': r[1], 'key': r[2], 't': r[3], 'm': r[4], 'p': r[5], 'o': r[6], 'pct': r[7], 'f': r[8],
                    'u': r[9], 'l': r[10], 'g': json.loads(r[11]), 'k': [k for k in r[12].split('|') if k], 'pop': r[13], 'st': r[14],
                    'v': r[15], 'gekozen': bool(x), 'inCat': bool(x and cat in x.get('categorieen', [])),
                    'opsite': status.get(r[0]) == 'nu', 'ean': r[16],
                    'ook': sorted([{'winkel': w, 'p': op} for opid, w, op in ook.get(r[16], []) if opid != r[0]], key=lambda y: y['p'])[:4],
                    'min30': (pinfo.get(r[2]) or {}).get('min30'), 'sinds': (pinfo.get(r[2]) or {}).get('sinds')})
    return {'totaal': totaal, 'verborgen': verborgen, 'pagina': pagina, 'paginas': max(1, -(-totaal // 60)), 'woorden': woorden, 'merk': merk,
            'partners': [{'id': a, 'naam': b, 'n': n} for a, b, n in partners], 'producten': uit}


MERKEN = {'tijd': 0, 'lijst': []}


def api_merken(q):
    """Merken voorstellen terwijl je typt. Werkt ook bij een tikfout (tommy hilfinger -> Tommy Hilfiger)."""
    import difflib
    if not os.path.exists(DB):
        return {'merken': []}
    with SLOT:
        if MERKEN['tijd'] != os.path.getmtime(DB):
            c = sqlite3.connect('file:' + DB + '?mode=ro', uri=True)
            try:
                tel = Counter()
                for m, n in c.execute("SELECT m, count(*) FROM p WHERE m != '' GROUP BY m"):
                    tel[m.strip()] += n
            finally:
                c.close()
            samen = {}   # 'TOMMY HILFIGER' en 'Tommy Hilfiger' zijn hetzelfde merk: de meest gebruikte schrijfwijze wint
            for m, n in tel.items():
                k = re.sub(r'\s+', ' ', plat(m)).strip()
                x = samen.setdefault(k, {'naam': m, 'beste': 0, 'n': 0})
                x['n'] += n
                if n > x['beste']:
                    x['naam'], x['beste'] = m, n
            MERKEN['lijst'] = sorted(((k, x['naam'], x['n']) for k, x in samen.items()), key=lambda x: -x[2])
            MERKEN['tijd'] = os.path.getmtime(DB)
    t = plat(q.get('q', [''])[0])
    if len(t) < 2:
        return {'merken': []}
    uit = [x for x in MERKEN['lijst'] if x[0].startswith(t) or (' ' + t) in x[0]][:12]
    if len(uit) < 5 and len(t) >= 4:
        sleutels = [x[0] for x in MERKEN['lijst'][:40000]]
        dicht = set(difflib.get_close_matches(t, sleutels, n=6, cutoff=0.75))
        uit += [x for x in MERKEN['lijst'] if x[0] in dicht and x not in uit]
    return {'merken': [{'naam': m, 'n': n} for _, m, n in uit[:12]]}


def api_notitie_product(body):
    with SLOT:
        lijst = laad_json(LIJST, {'producten': []})
        for x in lijst['producten']:
            if x['key'] == body['key']:
                x['notitie'] = body.get('notitie', '')[:500]
        bewaar(LIJST, lijst)
    return {'ok': True}


def api_notitie_partner(body):
    with SLOT:
        no = laad_json(NOTITIES, {})
        no[body['id']] = {'status': body.get('status', ''), 'tekst': body.get('tekst', '')[:1000],
                          'datum': datetime.datetime.now().strftime('%Y-%m-%d %H:%M')}
        bewaar(NOTITIES, no)
    return {'ok': True}


FOTOS = os.path.join(DATA, 'fotos')
PRIVE = re.compile(r'^(localhost|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|0\.|\[?::1)', re.I)


def foto_ophalen(url):
    """Foto van een winkel één keer ophalen en op de laptop bewaren; daarna komt hij direct van de schijf."""
    from urllib.parse import urlparse as up
    import urllib.request
    host = up(url).hostname or ''
    if not url.startswith(('http://', 'https://')) or PRIVE.match(host):
        return None, None
    h = hashlib.sha1(url.encode('utf-8')).hexdigest()
    pad = os.path.join(FOTOS, h[:2], h)
    if os.path.exists(pad):
        return open(pad, 'rb').read(), (open(pad + '.t').read() if os.path.exists(pad + '.t') else 'image/jpeg')
    try:
        r = urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 Superkeurkamer'}), timeout=12)
        soort = (r.headers.get('Content-Type') or 'image/jpeg').split(';')[0]
        if not soort.startswith('image/'):
            return None, None
        b = r.read(6 * 1024 * 1024)
    except Exception:
        return None, None
    os.makedirs(os.path.dirname(pad), exist_ok=True)
    open(pad, 'wb').write(b)
    open(pad + '.t', 'w').write(soort)
    return b, soort


def api_export():
    """Alles wat in een categorie staat klaarzetten voor Claude: mijn keuzes\\naar-de-site.json"""
    c = cats_laden()['cats']
    per = {k['id']: k for k in c}

    def pad(cid):
        uit, k = [], per.get(cid)
        while k:
            uit.insert(0, k['naam'])
            k = per.get(k.get('ouder'))
        return ' > '.join(uit)
    lijst = laad_json(LIJST, {'producten': []})['producten']
    uit = []
    for x in lijst:
        cs = [pad(cid) for cid in x.get('categorieen', []) if cid in per]
        if cs:
            y = dict(x)
            y['categorie_paden'] = cs
            uit.append(y)
    doel = os.path.join(KEUS, 'naar-de-site.json')
    bewaar(doel, {'gemaakt': datetime.datetime.now().strftime('%Y-%m-%d %H:%M'), 'aantal': len(uit), 'producten': uit})
    return {'ok': True, 'n': len(uit), 'bestand': doel}


class Hand(SimpleHTTPRequestHandler):
    def __init__(self, *a, **k):
        super().__init__(*a, directory=APP, **k)

    def log_message(self, *a):
        pass

    def stuur(self, data, code=200):
        b = json.dumps(data, ensure_ascii=False).encode('utf-8')
        self.send_response(code)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Cache-Control', 'no-store')
        self.send_header('Content-Length', str(len(b)))
        self.end_headers()
        self.wfile.write(b)

    def do_GET(self):
        u = urlparse(self.path)
        q = parse_qs(u.query)
        try:
            if u.path == '/api/partners':
                return self.stuur(api_partners())
            if u.path == '/api/partner':
                return self.stuur(api_partner(q.get('id', [''])[0]))
            if u.path == '/api/producten':
                return self.stuur(api_producten(q))
            if u.path == '/api/lijst':
                return self.stuur(api_lijst() if q.get('prijzen') else laad_json(LIJST, {'producten': []}))
            if u.path == '/api/cats':
                return self.stuur(api_cats())
            if u.path == '/api/zoek':
                return self.stuur(api_zoek(q))
            if u.path == '/api/waar':
                return self.stuur(api_waar(q))
            if u.path == '/api/merken':
                return self.stuur(api_merken(q))
            if u.path == '/foto':
                b, soort = foto_ophalen(q.get('u', [''])[0])
                if not b:
                    self.send_response(404); self.send_header('Content-Length', '0'); self.end_headers(); return
                self.send_response(200)
                self.send_header('Content-Type', soort)
                self.send_header('Cache-Control', 'max-age=2592000')
                self.send_header('Content-Length', str(len(b)))
                self.end_headers()
                self.wfile.write(b)
                return
        except Exception as e:
            return self.stuur({'fout': str(e)}, 500)
        return super().do_GET()

    def do_POST(self):
        u = urlparse(self.path)
        n = int(self.headers.get('Content-Length', 0) or 0)
        body = json.loads(self.rfile.read(n).decode('utf-8') or '{}')
        try:
            if u.path == '/api/kies':
                return self.stuur(api_kies(body))
            if u.path == '/api/notitie':
                return self.stuur(api_notitie_product(body))
            if u.path == '/api/partnernotitie':
                return self.stuur(api_notitie_partner(body))
            if u.path == '/api/cats':
                return self.stuur(api_cats_post(body))
            if u.path == '/api/herstel':
                return self.stuur(api_herstel(body))
            if u.path == '/api/export':
                return self.stuur(api_export())
        except Exception as e:
            return self.stuur({'fout': str(e)}, 500)
        self.stuur({'fout': 'onbekend'}, 404)


def draait_al():
    s = socket.socket()
    s.settimeout(0.5)
    try:
        return s.connect_ex(('127.0.0.1', POORT)) == 0
    finally:
        s.close()


if __name__ == '__main__':
    url = 'http://localhost:%d/' % POORT
    if draait_al():
        webbrowser.open(url)
        sys.exit(0)
    srv = ThreadingHTTPServer(('127.0.0.1', POORT), Hand)
    print('Superkeurkamer draait op', url, '(dit venster open laten; sluiten = keurkamer uit)')
    if '--geen-browser' not in sys.argv:
        threading.Timer(1.0, lambda: webbrowser.open(url)).start()
    threading.Thread(target=lambda: (api_merken({'q': ['xx']}), site_index()), daemon=True).start()   # merkenlijst alvast klaarzetten
    fotoscore.start()   # 27-11-2026: foto's van de eerste producten van een blok op de achtergrond nakijken (mooiste eerst)
    srv.serve_forever()
