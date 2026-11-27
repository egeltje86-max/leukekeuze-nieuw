"""Nazorg (8-11-2026, wens Marius: "elke dag de website weer als nieuw"; bijgewerkt 21-11-2026).
Neemt de uitkomst van wacht.py (prijzen en voorraad uit de verse feeds) over in scripts/boom/correcties.json:
  - prijs veranderd (10% of meer)  -> correcties 'prijs'  (nieuwe prijs, geen 'van-prijs')
  - uitverkocht / niet leverbaar   -> correcties 'status' = 'uitverkocht' (verdwijnt van de site)
Veiligheid: doet NIETS als de feeds er raar uitzien (te weinig teruggevonden, of ineens heel veel uitverkocht).
Een prijs die meer dan verdubbelt of meer dan halveert wordt niet overgenomen maar gemeld (kan een ander formaat/variant zijn).
'Niet in de feed' doen we bij de partners niets mee: die feeds zijn uittreksels, dus dat zegt te weinig.
21-11-2026 (opdracht Marius: 'wat bol niet meer verkoopt weghalen', 'controleer of het product nog beschikbaar is'):
  - bol: een product dat niet meer in de (complete, verse) bol-feeds staat, heeft bij bol geen aanbod meer -> uitverkocht;
  - alles wat deze nazorg zelf op uitverkocht zet, komt in scripts/keurkamer/auto-uitverkocht.json;
  - staat zo'n product weer leverbaar in een feed ('terug' in het rapport), dan komt het vanzelf terug op de site.
  Wat Marius of Claude met de hand op uitverkocht of afgekeurd zette, wordt nooit teruggezet.

Gebruik: python nazorg.py <wacht.json> [--droog]
Daarna: node scripts/splits-producten.js && node scripts/maak-paginas.js && controle, dan pas live."""
import json, os, sys, datetime
HIER = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(os.path.dirname(HIER))
COR_PAD = os.path.join(ROOT, 'scripts', 'boom', 'correcties.json')
AU_PAD = os.path.join(ROOT, 'scripts', 'keurkamer', 'auto-uitverkocht.json')
BOL_MIN_FEEDS = 20        # zoveel verse bol-feedbestanden moeten er zijn (26 in totaal, 21 worden elke dag ververst)
BOL_MAX_OUD = 3           # dagen: oudere bol-feeds zeggen niets over 'nu'
BOL_MIN_GEVONDEN = 0.85   # minder bol-producten teruggevonden = feeds onvolledig, dan niets weghalen
BOL_MAX_WEG = 0.04        # meer dan 4% van de bol-producten ineens weg = verdacht, dan niets weghalen (alleen melden)
MAX_UITVERKOCHT = 0.05   # meer dan 5% van de gecontroleerde producten ineens uitverkocht = feedstoring, niets doen
MIN_GECONTROLEERD = 0.40  # minder dan 40% van de live producten teruggevonden = feeds missen, niets doen

def main():
    if len(sys.argv) < 2: print(__doc__); sys.exit(2)
    W = json.load(open(sys.argv[1], encoding='utf-8')); droog = '--droog' in sys.argv
    COR = json.load(open(COR_PAD, encoding='utf-8'))
    global SITE
    sp = os.path.join(ROOT, 'keurkamer', 'data', 'producten-site.json')  # gemaakt door effectief-site.js
    SITE = json.load(open(sp, encoding='utf-8')).get('producten', {}) if os.path.exists(sp) else {}
    s = W.get('samenvatting', {}); live = s.get('live') or 1; gec = s.get('gecontroleerd') or 0
    rap = {'datum': datetime.date.today().isoformat(), 'live': live, 'gecontroleerd': gec, 'prijs': 0, 'uitverkocht': 0, 'gemeld': [], 'gestopt': ''}
    if gec < MIN_GECONTROLEERD * live:
        rap['gestopt'] = 'te weinig producten teruggevonden in de feeds (%d van %d)' % (gec, live)
    elif len(W.get('uitverkocht', [])) > MAX_UITVERKOCHT * gec:
        rap['gestopt'] = 'ineens %d producten uitverkocht: lijkt een feedstoring' % len(W['uitverkocht'])
    if rap['gestopt']:
        print('GESTOPT:', rap['gestopt']); print(json.dumps(rap, ensure_ascii=False)); sys.exit(3)
    COR.setdefault('prijs', {}); COR.setdefault('status', {}); COR.setdefault('gezien', {})
    try: AU = json.load(open(AU_PAD, encoding='utf-8'))
    except Exception: AU = {'uitleg': 'Producten die de dagelijkse controle zelf op uitverkocht zette. Komen ze weer leverbaar in een feed, dan zet de controle ze terug.', 'producten': {}}
    vandaag = datetime.date.today().isoformat()
    def auto_uit(pid, bron, reden, nr=None):
        sp = SITE.get(pid) or {}
        AU['producten'][pid] = {k: v for k, v in {'datum': vandaag, 'bron': bron, 'reden': reden, 'nr': nr, 'shop': sp.get('shop'),
                                                  'url': sp.get('url'), 'winkelUrl': sp.get('winkelUrl'), 'titel': (sp.get('titel') or '')[:80]}.items() if v}
    for u in W.get('uitverkocht', []):
        if u['id'] in COR['status']: continue
        COR['status'][u['id']] = 'uitverkocht'; rap['uitverkocht'] += 1
        # bron 'winkelpagina' (winkelcheck: pagina weg of 'uitverkocht' op de pagina) komt niet vanzelf terug via een feed
        b = 'bol' if u.get('bron') == 'bol' else ('winkelpagina' if u.get('bron') == 'winkelpagina' else 'feed')
        auto_uit(u['id'], b, 'niet op voorraad volgens ' + str(u.get('bron')) + (': ' + u['reden'] if u.get('reden') else ''), u.get('nr'))
    # 21-11-2026: bol zonder aanbod. Alleen als de bol-feeds compleet en vers zijn, en hooguit 4% van de bol-producten tegelijk.
    bf = W.get('bolFeeds') or {}; rap['bolWeg'] = 0
    try: oud = (datetime.date.today() - datetime.date.fromisoformat(bf.get('oudste') or '2000-01-01')).days
    except ValueError: oud = 999
    bolweg = [u for u in W.get('nietInFeed', []) if u.get('bron') == 'bol' and u.get('uitLink') and str(u.get('nr', '')).isdigit() and u['id'] not in COR['status']]
    if bolweg:
        n_bol = bf.get('producten') or 1
        reden = ''
        if (bf.get('vers', bf.get('aantal')) or 0) < BOL_MIN_FEEDS: reden = 'maar %s verse bol-feeds gevonden' % bf.get('vers', bf.get('aantal'))
        elif oud > BOL_MAX_OUD: reden = 'bol-feeds zijn %d dagen oud' % oud
        elif (bf.get('gevonden') or 0) < BOL_MIN_GEVONDEN * n_bol: reden = 'maar %s van %s bol-producten in de feeds' % (bf.get('gevonden'), n_bol)
        elif len(bolweg) > max(20, BOL_MAX_WEG * n_bol): reden = 'ineens %d bol-producten zonder aanbod: lijkt een feedfout' % len(bolweg)
        if reden:
            rap['gemeld'].append('bol zonder aanbod niet weggehaald (%d stuks): %s' % (len(bolweg), reden))
        else:
            for u in bolweg:
                COR['status'][u['id']] = 'uitverkocht'; rap['bolWeg'] += 1
                auto_uit(u['id'], 'bol', 'niet meer in de bol-feed', u.get('nr'))
    # 21-11-2026: weer leverbaar -> terug op de site (alleen wat deze controle zelf op uitverkocht zette)
    rap['terug'] = 0
    for t in W.get('terug', []):
        pid = t['id']
        if pid not in AU['producten'] or COR['status'].get(pid) != 'uitverkocht': continue
        if t.get('bron') == 'bol' and oud > BOL_MAX_OUD: continue  # oude bol-feeds zeggen niets over 'nu'
        del COR['status'][pid]; AU['producten'].pop(pid, None); rap['terug'] += 1
        COR['prijs'][pid] = [round(float(t['prijs']), 2)]
        d = min(t.get('feedDatum') or vandaag, vandaag)
        if COR['gezien'].get(pid, '') <= d: COR['gezien'][pid] = d
    geweigerd = set()
    for p in W.get('prijs', []):
        if p['id'] in COR['status']: continue
        oud, nieuw = float(p['oud']), float(p['nieuw'])
        if nieuw <= 0: continue
        # 21-11-2026: bij bol is de feedregel precies het product van de link ('exact'): die prijs is wat de klant betaalt,
        # dus altijd overnemen; een grote sprong wel melden (vaak is het goedkope aanbod weg en verkoopt nu een andere verkoper).
        if p.get('exact'):
            if nieuw > 1.5 * oud or nieuw < 0.5 * oud:
                rap['gemeld'].append('%s: %s van %.2f naar %.2f (%s, overgenomen)' % (p['id'], p['titel'], oud, nieuw, p.get('bron') or 'bol'))
        elif nieuw > 2 * oud or nieuw < 0.5 * oud:
            # niet overgenomen, en dan ook geen verse controledatum: anders staat een oude prijs als 'vandaag gecontroleerd' op de site
            geweigerd.add(p['id'])
            rap['gemeld'].append('%s: %s van %.2f naar %.2f (niet overgenomen)' % (p['id'], p['titel'], oud, nieuw)); continue
        # 8-11-2026: een echte van-prijs (hoger dan de nieuwe prijs) blijft staan, anders verdwijnen deals van de Black Friday-pagina.
        van = float((SITE.get(p['id']) or {}).get('oudePrijs') or 0)
        COR['prijs'][p['id']] = [round(nieuw, 2), van] if van > nieuw else [round(nieuw, 2)]; rap['prijs'] += 1
    # 8-11-2026 (Fable P0-4): alles wat vandaag in een feed is teruggevonden krijgt de controledatum van vandaag (ook als de prijs gelijk bleef).
    rap['gezien'] = 0
    # 21-11-2026: de controledatum is de datum van de feed (bol-feeds ververst Marius met de hand), niet de dag van de nazorg.
    fd = W.get('feedDatum') or {}
    for pid in W.get('gezien', []):
        if pid in COR['status'] or pid in geweigerd: continue
        d = fd.get(pid) or vandaag
        if d > vandaag: d = vandaag
        if COR['gezien'].get(pid, '') > d: continue  # nooit een nieuwere datum terugzetten naar een oudere
        COR['gezien'][pid] = d; rap['gezien'] += 1
    if not droog:
        json.dump(COR, open(COR_PAD, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
        AU['bijgewerkt'] = vandaag
        json.dump(AU, open(AU_PAD, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(json.dumps(rap, ensure_ascii=False, indent=1))

if __name__ == '__main__':
    main()
