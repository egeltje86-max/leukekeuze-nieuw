"""Rijmmachine vergelijken (8-11-2026). Stuurt de vaste testset (testset.json) naar een versie van de rijmmachine
en bewaart per persoon: gedicht, rijmcontrole (punten, 0 = geen fouten gevonden), tijd en cadeau.
Gebruik: python vergelijk.py sint-rijm-test   (of sint-rijm voor de live versie)
Uitkomst: uitslag-<functie>-<datum>.json naast dit script. Kost wat OpenAI-tegoed (10 gedichten).
De functie laat 10 gedichten per 10 minuten per adres toe; dit script wacht daarom 65 seconden tussen de personen."""
import json, sys, time, os, urllib.request, datetime
HIER = os.path.dirname(os.path.abspath(__file__))
functie = sys.argv[1] if len(sys.argv) > 1 else 'sint-rijm-test'
url = 'https://oivhdejsvmsudfrulwsn.supabase.co/functions/v1/' + functie
personen = json.load(open(os.path.join(HIER, 'testset.json'), encoding='utf-8'))['personen']
uit = []
for i, p in enumerate(personen):
    vraag = dict(p, test={})
    t0 = time.time()
    try:
        rq = urllib.request.Request(url, data=json.dumps(vraag).encode(), headers={'Content-Type': 'application/json'})
        j = json.load(urllib.request.urlopen(rq, timeout=180))
    except Exception as e:
        j = {'fout': str(e)[:200]}
    r = {'naam': p['naam'], 'sec': round(time.time() - t0), 'punten': (j.get('oordeel') or {}).get('punten'), 'fouten': (j.get('oordeel') or {}).get('fouten'),
         'titel': j.get('titel'), 'gedicht': j.get('gedicht'), 'cadeau': [c.get('titel') for c in j.get('cadeaus') or []], 'meer': len(j.get('meer') or []), 'fout': j.get('fout')}
    uit.append(r); print(p['naam'], r['punten'], r['sec'], 's', r['fout'] or '')
    if i + 1 < len(personen): time.sleep(65)
naam = os.path.join(HIER, 'uitslag-%s-%s.json' % (functie, datetime.date.today().isoformat()))
json.dump({'functie': functie, 'personen': uit}, open(naam, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
ok = [r['punten'] for r in uit if isinstance(r['punten'], int)]
print('KLAAR', naam, '| gemiddeld', round(sum(ok) / max(1, len(ok)), 1), 'punten, foutloos:', sum(1 for x in ok if x == 0), 'van', len(uit))
