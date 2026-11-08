"""Nazorg (8-11-2026, wens Marius: "elke dag de website weer als nieuw").
Neemt de uitkomst van wacht.py (prijzen en voorraad uit de verse feeds) over in scripts/boom/correcties.json:
  - prijs veranderd (10% of meer)  -> correcties 'prijs'  (nieuwe prijs, geen 'van-prijs')
  - uitverkocht / niet leverbaar   -> correcties 'status' = 'uitverkocht' (verdwijnt van de site)
Veiligheid: doet NIETS als de feeds er raar uitzien (te weinig teruggevonden, of ineens heel veel uitverkocht).
Een prijs die meer dan verdubbelt of meer dan halveert wordt niet overgenomen maar gemeld (kan een ander formaat/variant zijn).
'Niet in de feed' doen we niets mee: de feeds hier zijn uittreksels, dus dat zegt te weinig.

Gebruik: python nazorg.py <wacht.json> [--droog]
Daarna: node scripts/splits-producten.js && node scripts/maak-paginas.js && controle, dan pas live."""
import json, os, sys, datetime
HIER = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(os.path.dirname(HIER))
COR_PAD = os.path.join(ROOT, 'scripts', 'boom', 'correcties.json')
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
    COR.setdefault('prijs', {}); COR.setdefault('status', {})
    for u in W.get('uitverkocht', []):
        if u['id'] in COR['status']: continue
        COR['status'][u['id']] = 'uitverkocht'; rap['uitverkocht'] += 1
    for p in W.get('prijs', []):
        if p['id'] in COR['status']: continue
        oud, nieuw = float(p['oud']), float(p['nieuw'])
        if nieuw <= 0 or nieuw > 2 * oud or nieuw < 0.5 * oud:
            rap['gemeld'].append('%s: %s van %.2f naar %.2f (niet overgenomen)' % (p['id'], p['titel'], oud, nieuw)); continue
        # 8-11-2026: een echte van-prijs (hoger dan de nieuwe prijs) blijft staan, anders verdwijnen deals van de Black Friday-pagina.
        van = float((SITE.get(p['id']) or {}).get('oudePrijs') or 0)
        COR['prijs'][p['id']] = [round(nieuw, 2), van] if van > nieuw else [round(nieuw, 2)]; rap['prijs'] += 1
    # 8-11-2026 (Fable P0-4): alles wat vandaag in een feed is teruggevonden krijgt de controledatum van vandaag (ook als de prijs gelijk bleef).
    COR.setdefault('gezien', {}); vandaag = datetime.date.today().isoformat(); rap['gezien'] = 0
    for pid in W.get('gezien', []):
        if pid in COR['status']: continue
        COR['gezien'][pid] = vandaag; rap['gezien'] += 1
    if not droog:
        json.dump(COR, open(COR_PAD, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(json.dumps(rap, ensure_ascii=False, indent=1))

if __name__ == '__main__':
    main()
