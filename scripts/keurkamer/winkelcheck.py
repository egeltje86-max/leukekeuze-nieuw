# -*- coding: utf-8 -*-
"""Winkelpagina-check (13-11-2026, grote keuring, GO Marius): kijkt voor producten die in geen enkele feed terug te vinden zijn
de gewone pagina van de winkel na: bestaat hij nog, wat is de prijs, is het op voorraad. De uitkomst gaat in het nachtrapport
(wacht-laatste.json), zodat de dagelijkse piloot hem met de gewone veiligheidsgrenzen van nazorg.py overneemt.

Regels (CLAUDE.md paragraaf 26):
  - nooit een partnerlink ophalen, nooit bol of Amazon: alleen het gewone adres van de winkel (het script weigert de rest);
  - een prijs alleen overnemen als de winkel er een noemt, of precies een binnen 15% van de onze;
  - weg = pagina bestaat niet meer (404/410), de winkel zegt uitverkocht, of we komen op een overzicht uit;
  - valt bij een winkel ineens meer dan 30% weg, dan nemen we van die winkel niets over (de winkel heeft dan iets veranderd).

Gebruik: python -I winkelcheck.py --producten <producten-site.json> --wacht <wacht-laatste.json> [--rapport <bestand.json>]
                                  [--stand <tussenstand.json>] [--max 5000] [--droog] [--zonder-net]
  --stand       tussenstand van het ophalen (hervat vanzelf; wordt bij een geslaagde run leeggemaakt)
  --zonder-net  niets ophalen, alleen oordelen over wat al in --stand staat (om te testen)
Alleen de standaardbibliotheek. Mag de nachtrun nooit tegenhouden: bij een fout blijft het nachtrapport zoals het was."""
import json, urllib.request, urllib.error, urllib.parse, os, re, html, sys, threading, time, datetime, collections
from concurrent.futures import ThreadPoolExecutor

NIET = re.compile(r'516846|433339|3110079|1545784|leukekeuze-21|tradetracker|awin1|ds1\.nl|jdt8\.net|lt45\.net|bdt9\.net|rkn3\.net|glp8\.net|fr135\.net|jf79\.net|//partner\.|bol\.com|amazon\.|[?&](tt|aff|a|wi)=|/link\?id=|offerid=|linksynergy|awinmid', re.I)
NOOIT_WINKEL = {'bol', 'Amazon'}
KOP = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36',
       'Accept-Language': 'nl-NL,nl;q=0.9', 'Accept': 'text/html,application/xhtml+xml'}
WEG_ST = {'OutOfStock', 'SoldOut', 'Discontinued'}
OK_ST = {'InStock', 'PreOrder', 'BackOrder', 'LimitedAvailability', 'OnlineOnly', 'InStoreOnly', 'PreSale'}
# Winkels waar 'niet op voorraad' in de tekst bij het product zelf hoort (bij TopRC is het een vaste uitleg: niets doen).
WOORD_IS_ECHT = ('degrotespeelgoedwinkel.nl',)


def arg(naam, std=None):
    return sys.argv[sys.argv.index(naam) + 1] if naam in sys.argv and sys.argv.index(naam) + 1 < len(sys.argv) else std


def schoon(u):
    """Haalt wat alleen om te tellen achter een adres hangt eraf (utm_..., channable), zodat het gewone adres overblijft."""
    d = urllib.parse.urlsplit(u)
    q = [x for x in d.query.split('&') if x and not re.match(r'(utm_[a-z]+|channable|gad_source|gclid|fbclid)(=|$)', x, re.I)]
    return urllib.parse.urlunsplit((d.scheme, d.netloc, d.path, '&'.join(q), ''))


def gewoon_adres(p, basis=None):
    """Het gewone adres van de winkel: uit winkelUrl als dat geen partnerlink is, anders uit r=, u=, ued=, murl= of dl= van de link.
    Een dl= zonder winkel ervoor (Daisycon) krijgt het adres van de winkel uit 'basis' (winkel -> https://winkel.nl)."""
    kand = []
    w = (p.get('winkelUrl') or '').strip()
    if w: kand.append(w)
    for bron in (w, (p.get('url') or '').strip()):
        if not bron: continue
        try: q = urllib.parse.parse_qs(urllib.parse.urlsplit(bron).query)
        except Exception: continue
        for k in ('r', 'u', 'ued', 'murl', 'dl'):
            for v in q.get(k, []):
                if not v: continue
                v = urllib.parse.unquote(v) if ('%3A' in v or '%2F' in v) else v
                if k == 'dl' and not re.match(r'^https?://', v, re.I):
                    b = (basis or {}).get(p.get('shop') or '')
                    if not b: continue
                    v = b.rstrip('/') + '/' + v.lstrip('/')
                kand.append(v)
    for k in kand:
        try: k = schoon(k)
        except Exception: continue
        if re.match(r'^https?://[^/?#]+\.[a-z]{2,}(/|$)', k, re.I) and not NIET.search(k): return k
    return ''


def winkel_basis(P):
    """Per winkel het adres van de winkel zelf (https://winkel.nl), afgeleid uit producten waarvan het gewone adres bekend is."""
    tel = collections.defaultdict(collections.Counter)
    for p in P.values():
        g = gewoon_adres(p)
        if g: d = urllib.parse.urlsplit(g); tel[p.get('shop') or ''][d.scheme + '://' + d.netloc] += 1
    return {w: c.most_common(1)[0][0] for w, c in tel.items() if w}


def tekst(s): return re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', s))).strip()


def getal(x):
    try: return round(float(str(x).replace(',', '.')), 2)
    except Exception: return None


def loop(n, uit_):
    if isinstance(n, list):
        for x in n: loop(x, uit_)
    elif isinstance(n, dict):
        t = n.get('@type'); t = t if isinstance(t, list) else [t]
        if any(str(x) in ('Product', 'ProductGroup', 'IndividualProduct') for x in t): uit_.append(n)
        for v in n.values():
            if isinstance(v, (list, dict)): loop(v, uit_)


def aanbod(n, pr, av):
    o = n.get('offers')
    for x in (o if isinstance(o, list) else [o] if isinstance(o, dict) else []):
        if not isinstance(x, dict): continue
        for sleutel in ('price', 'lowPrice'):
            g = getal(x.get(sleutel))
            if g is None and isinstance(x.get('priceSpecification'), dict): g = getal(x['priceSpecification'].get('price'))
            if g is None and isinstance(x.get('priceSpecification'), list) and x['priceSpecification'] and isinstance(x['priceSpecification'][0], dict): g = getal(x['priceSpecification'][0].get('price'))
            if g: pr.append(g); break
        if x.get('highPrice') and getal(x.get('highPrice')): pr.append(getal(x['highPrice']))
        if x.get('availability'): av.append(str(x['availability']).split('/')[-1])
        if isinstance(x.get('offers'), (list, dict)): aanbod(x, pr, av)
    for v in (n.get('hasVariant') or []) if isinstance(n.get('hasVariant'), list) else []:
        if isinstance(v, dict): aanbod(v, pr, av)


def haal_alles(todo, uit, stand):
    sloten = {}; slot = threading.Lock(); schrijf = threading.Lock(); teller = [0]; geblokt = {}

    def host_slot(h):
        with slot:
            if h not in sloten: sloten[h] = threading.Semaphore(2)
            return sloten[h]

    def haal(kv):
        k, u = kv; d = {'adres': u}
        h = urllib.parse.urlsplit(u).netloc
        with host_slot(h):
            if geblokt.get(h, 0) >= 3:
                d['netfout'] = 'winkel houdt scripts tegen (403)'
                with schrijf: uit[k] = d; teller[0] += 1
                return k
            for poging in (1, 2):
                try:
                    r = urllib.request.urlopen(urllib.request.Request(u, headers=KOP), timeout=30)
                    b = r.read(1500000).decode('utf-8', 'replace')
                    d.pop('netfout', None); d['status'] = r.status; d['eind'] = r.geturl(); geblokt[h] = 0
                    mt = re.search(r'<title[^>]*>(.*?)</title>', b, re.S | re.I); d['titel'] = tekst(mt.group(1))[:140] if mt else ''
                    mh = re.search(r'<h1[^>]*>(.*?)</h1>', b, re.S | re.I); d['h1'] = tekst(mh.group(1))[:140] if mh else ''
                    prod = []
                    for blok in re.findall(r'<script[^>]+type=["\']application/ld\+json["\'][^>]*>(.*?)</script>', b, re.S | re.I):
                        try: loop(json.loads(blok.strip().replace('<!--', '').replace('-->', ''), strict=False), prod)
                        except Exception: pass
                    pr = []; av = []
                    for n in prod: aanbod(n, pr, av)
                    d['ld'] = len(prod); d['prijzen'] = sorted(set(pr))[:12]; d['voorraad'] = sorted(set(av))[:5]
                    mp = re.findall(r'(?:product:price:amount|og:price:amount)["\'][^>]*content=["\']([0-9.,]+)', b)[:2] + re.findall(r'itemprop=["\']price["\'][^>]*content=["\']([0-9.,]+)', b)[:2]
                    d['meta'] = sorted(set(x for x in (getal(y) for y in mp) if x))[:4]
                    kort = tekst(b[b.find('<h1'):b.find('<h1') + 6000]) if '<h1' in b else ''
                    d['uitv'] = sorted(set(x.lower() for x in re.findall(r'uitverkocht|niet (?:meer )?leverbaar|niet op voorraad|tijdelijk niet|out of stock|sold out|niet meer verkrijgbaar', kort, re.I)))[:4]
                    d['euro'] = [x for x in (getal(y) for y in re.findall(r'(?:€|&euro;|EUR)\s*([0-9]+(?:[.,][0-9]{2})?)', kort)[:4]) if x]
                    break
                except urllib.error.HTTPError as e:
                    d['status'] = e.code
                    try: d['eind'] = e.geturl()
                    except Exception: pass
                    if e.code in (404, 410): d.pop('netfout', None); break
                    d['netfout'] = 'HTTP ' + str(e.code)
                    if e.code == 403: geblokt[h] = geblokt.get(h, 0) + 1; break
                    time.sleep(4 if e.code in (429, 503) else 2)
                except Exception as e:
                    d['netfout'] = str(e)[:100]; time.sleep(2)
            time.sleep(0.5)
        with schrijf:
            uit[k] = d; teller[0] += 1
            if stand and teller[0] % 100 == 0:
                json.dump(uit, open(stand, 'w', encoding='utf-8'), ensure_ascii=False)
                print(teller[0], 'gedaan', flush=True)
        return k

    with ThreadPoolExecutor(16) as ex:
        for _ in ex.map(haal, todo): pass
    if stand: json.dump(uit, open(stand, 'w', encoding='utf-8'), ensure_ascii=False)


def pad(x): return re.sub(r'[?#].*$', '', x or '').rstrip('/').replace('http://', 'https://').lower()


def oordeel(v, ons):
    """klopt | prijs (met 'nieuw') | weg | onbekend. Voorzichtig: bij twijfel 'onbekend' (dan verandert er niets)."""
    if v.get('netfout'): return {'uitslag': 'onbekend', 'waarom': v['netfout']}
    if v.get('status') in (404, 410): return {'uitslag': 'weg', 'waarom': 'pagina bestaat niet meer (%s)' % v['status']}
    st = set(v.get('voorraad') or []); pr = [p for p in (v.get('prijzen') or []) if p]; mt = [p for p in (v.get('meta') or []) if p]
    if pr and mt and all(p >= 100 * min(mt) * 0.99 for p in pr): pr = [round(p / 100, 2) for p in pr]   # prijzen in centen (Shopify)
    alle = sorted(set(pr + mt))
    doorgestuurd = pad(v.get('eind')) != pad(v.get('adres'))
    host = urllib.parse.urlsplit(v.get('adres') or '').netloc.lower()
    if st and st <= WEG_ST: return {'uitslag': 'weg', 'waarom': 'winkel zegt: ' + ', '.join(sorted(st))}
    if any(host.endswith(h) for h in WOORD_IS_ECHT) and 'niet op voorraad' in (v.get('uitv') or []) and not (st & OK_ST):
        return {'uitslag': 'weg', 'waarom': 'winkel zegt: niet op voorraad'}
    if not alle:
        eu = v.get('euro') or []
        if doorgestuurd and not v.get('ld'): return {'uitslag': 'weg', 'waarom': 'komt uit op ' + (v.get('eind') or '')[:90], 'doorgestuurd': True}
        if eu and any(abs(e - ons) < 0.011 for e in eu[:3]): return {'uitslag': 'klopt'}
        return {'uitslag': 'onbekend', 'waarom': 'prijs niet te lezen'}
    if any(abs(p - ons) < 0.011 for p in alle): return {'uitslag': 'klopt'}
    dichtbij = [p for p in alle if abs(p / ons - 1) <= 0.15]
    nieuw = alle[0] if len(alle) == 1 else dichtbij[0] if len(dichtbij) == 1 else mt[0] if (mt and len(set(mt)) == 1 and len(set(pr)) <= 1) else None
    if nieuw is None: return {'uitslag': 'onbekend', 'waarom': 'meer prijzen: ' + ', '.join(str(p) for p in alle[:6])}
    return {'uitslag': 'prijs', 'nieuw': nieuw}


def main():
    pp, wp = arg('--producten'), arg('--wacht')
    if not pp or not wp: print(__doc__); sys.exit(2)
    rapport, stand = arg('--rapport'), arg('--stand')
    droog, zonder_net = '--droog' in sys.argv, '--zonder-net' in sys.argv
    maxn = int(arg('--max', '5000'))
    P = json.load(open(pp, encoding='utf-8')).get('producten', {})
    W = json.load(open(wp, encoding='utf-8'))
    vandaag = datetime.date.today().isoformat()
    todo = {}; geen_adres = 0; basis = winkel_basis(P)
    for x in W.get('nietInFeed', []):
        p = P.get(x.get('id'))
        if not p or (p.get('shop') or 'bol') in NOOIT_WINKEL: continue
        u = gewoon_adres(p, basis)
        if not u: geen_adres += 1; continue
        todo[p['id']] = u
        if len(todo) >= maxn: break
    for k, u in todo.items():
        if NIET.search(u): print('NIET TOEGESTAAN ADRES, gestopt:', k, u[:80]); sys.exit(1)
    uit = {}
    if stand and os.path.exists(stand):
        try: uit = json.load(open(stand, encoding='utf-8'))
        except Exception: uit = {}
    uit = {k: v for k, v in uit.items() if k in todo and v.get('adres') == todo[k]}
    nog = [(k, u) for k, u in todo.items() if k not in uit or 'netfout' in uit[k]]
    print(len(todo), 'adressen,', len(nog), 'nog op te halen,', geen_adres, 'zonder gewoon adres', flush=True)
    if not zonder_net and nog: haal_alles(nog, uit, stand)
    # oordeel per product
    O = {}; per_winkel = collections.defaultdict(collections.Counter)
    for k, v in uit.items():
        p = P[k]; o = oordeel(v, float(p['prijs'])); o['shop'] = p.get('shop') or ''; O[k] = o; per_winkel[o['shop']][o['uitslag']] += 1
    # valt bij een winkel ineens veel weg, dan heeft de winkel waarschijnlijk iets veranderd: niets overnemen van die winkel
    twijfel = sorted(w for w, c in per_winkel.items() if c['weg'] >= 5 and c['weg'] > 0.30 * sum(c.values()))
    klopt, prijs, weg, groot = [], [], [], []
    for k, o in O.items():
        p = P[k]
        if o['uitslag'] == 'klopt': klopt.append(k)
        elif o['uitslag'] == 'prijs':
            if 0.5 <= o['nieuw'] / float(p['prijs']) <= 2.0: prijs.append({'id': k, 'titel': p.get('titel', ''), 'oud': p['prijs'], 'nieuw': o['nieuw'], 'bron': 'winkelpagina'})
            else: groot.append('%s: %s van %.2f naar %.2f' % (k, p.get('titel', ''), float(p['prijs']), o['nieuw']))
        elif o['uitslag'] == 'weg' and o['shop'] not in twijfel:
            weg.append({'id': k, 'titel': p.get('titel', ''), 'bron': 'winkelpagina', 'reden': o.get('waarom', '')})
    tel = collections.Counter(o['uitslag'] for o in O.values())
    rap = {'datum': vandaag, 'nagekeken': len(O), 'klopt': len(klopt), 'prijs': len(prijs), 'weg': len(weg), 'onbekend': tel['onbekend'],
           'zonderAdres': geen_adres, 'twijfelWinkels': twijfel, 'grotePrijssprong': groot[:40],
           'nietLeesbaar': sorted(('%s: %d' % (w, c['onbekend']) for w, c in per_winkel.items() if c['onbekend'] >= 10), key=lambda s: -int(s.rsplit(' ', 1)[1]))[:20]}
    print(json.dumps(rap, ensure_ascii=False))
    if droog: return
    # in het nachtrapport zetten (zelfde vorm als wacht.py), zodat nazorg.py het met zijn eigen grenzen overneemt
    gedaan = set(klopt) | set(x['id'] for x in prijs) | set(x['id'] for x in weg)
    al_prijs = set(x['id'] for x in W.get('prijs', [])); al_weg = set(x['id'] for x in W.get('uitverkocht', []))
    W.setdefault('prijs', []).extend(x for x in prijs if x['id'] not in al_prijs)
    W.setdefault('uitverkocht', []).extend(x for x in weg if x['id'] not in al_weg)
    gezien = set(W.get('gezien', [])); W['gezien'] = list(W.get('gezien', [])) + [k for k in klopt + [x['id'] for x in prijs] if k not in gezien]
    W['nietInFeed'] = [x for x in W.get('nietInFeed', []) if x.get('id') not in gedaan]
    W['gecontroleerd'] = int(W.get('gecontroleerd') or 0) + len(gedaan)
    if isinstance(W.get('samenvatting'), dict) and 'gecontroleerd' in W['samenvatting']: W['samenvatting']['gecontroleerd'] = int(W['samenvatting']['gecontroleerd'] or 0) + len(gedaan)
    W['winkelcheck'] = rap
    json.dump(W, open(wp, 'w', encoding='utf-8'), ensure_ascii=False)
    if rapport:
        os.makedirs(os.path.dirname(os.path.abspath(rapport)), exist_ok=True)
        json.dump(rap, open(rapport, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    if stand and os.path.exists(stand) and not zonder_net:
        try: os.remove(stand)
        except Exception: pass
    print('winkelcheck: %d nagekeken, %d kloppen, %d prijs anders, %d weg, %d onbekend' % (len(O), len(klopt), len(prijs), len(weg), tel['onbekend']))


if __name__ == '__main__':
    main()
