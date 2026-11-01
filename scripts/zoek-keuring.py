"""Keuring van 'Meer in onze winkels' (1-11-2026). Nieuwe producten uit de feeds wachten in assets/zoek/w/_wacht.json
tot ze bekeken zijn; pas dan komen ze op de site.
  python3 scripts/zoek-keuring.py lijst <map>            -> maakt <map>/in-1.json, in-2.json ... (per vakje de titels om te keuren)
  python3 scripts/zoek-keuring.py toepassen <map>        -> leest <map>/in-N.json + <map>/uit-N.json ({vak: [titels die weg moeten]}):
        bekeken en niet in uit = goedgekeurd (zoek-goed.json, en het product komt op de site), uit = afgekeurd (zoek-uitsluiten.json)."""
import json, os, sys, glob, importlib.util
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SC = os.path.join(ROOT, 'scripts'); WMAP = os.path.join(ROOT, 'assets', 'zoek', 'w')
def lees(n, leeg):
    try: return json.load(open(os.path.join(SC, n), encoding='utf-8'))
    except FileNotFoundError: return leeg
def schrijf(n, d, ind=None): json.dump(d, open(os.path.join(SC, n), 'w', encoding='utf-8'), ensure_ascii=False, indent=ind, separators=None if ind is not None else (',', ':'))
def lijst(map_, per=1500):
    W = json.load(open(os.path.join(WMAP, '_wacht.json'), encoding='utf-8')); namen = lees('zoek-namen.json', {})
    os.makedirs(map_, exist_ok=True)
    for f in glob.glob(os.path.join(map_, 'in-*.json')): os.remove(f)
    delen, cur, n = [], [], 0
    for k in sorted(W):
        t = [r[0] for r in W[k]]
        for i in range(0, len(t), per):
            stuk = t[i:i + per]
            if n + len(stuk) > per and cur: delen.append(cur); cur, n = [], 0
            cur.append({'vak': k, 'naam': namen.get(k, k), 'titels': stuk}); n += len(stuk)
    if cur: delen.append(cur)
    for i, d in enumerate(delen, 1): json.dump(d, open(os.path.join(map_, 'in-%d.json' % i), 'w', encoding='utf-8'), ensure_ascii=False)
    print(len(delen), 'delen,', sum(len(v) for v in W.values()), 'titels om te keuren')
def toepassen(map_):
    W = json.load(open(os.path.join(WMAP, '_wacht.json'), encoding='utf-8')); G = lees('zoek-goed.json', {}); U = lees('zoek-uitsluiten.json', {})
    goed_n = af_n = 0; nieuw = {}
    for fin in sorted(glob.glob(os.path.join(map_, 'in-*.json'))):
        fuit = fin.replace('in-', 'uit-')
        if not os.path.exists(fuit): print('nog niet gekeurd:', os.path.basename(fin)); continue
        uit = json.load(open(fuit, encoding='utf-8'))
        for blok in json.load(open(fin, encoding='utf-8')):
            k = blok['vak']; weg = set(t.lower() for t in uit.get(k, []))
            for t in blok['titels']:
                if t.lower() in weg:
                    if t not in U.setdefault(k, []): U[k].append(t); af_n += 1
                else:
                    if t not in G.setdefault(k, []): G[k].append(t); goed_n += 1
                    nieuw.setdefault(k, set()).add(t.lower())
    # goedgekeurde rijen uit de wachtrij terug op de site zetten
    voorbeeld = next(f for f in glob.glob(os.path.join(WMAP, '*.json')) if not os.path.basename(f).startswith('_'))
    winkels = json.load(open(voorbeeld, encoding='utf-8'))['winkels']; idx = {w['naam']: i for i, w in enumerate(winkels)}
    for k, ts in nieuw.items():
        f = os.path.join(WMAP, k.replace('/', '--') + '.json')
        j = json.load(open(f, encoding='utf-8')) if os.path.exists(f) else {'winkels': winkels, 'producten': []}
        al = set(p[0].lower() for p in j['producten'])
        for r in W.get(k, []):
            if r[0].lower() in ts and r[0].lower() not in al and r[2] in idx:
                p = list(r); p[2] = idx[r[2]]; j['producten'].append(p); al.add(r[0].lower())
        json.dump(j, open(f, 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
    schrijf('zoek-goed.json', {k: sorted(v) for k, v in sorted(G.items())}, 0)
    schrijf('zoek-uitsluiten.json', {k: sorted(v) for k, v in sorted(U.items())}, 0)
    print('goedgekeurd:', goed_n, 'afgekeurd:', af_n)
    s = importlib.util.spec_from_file_location('zs', os.path.join(SC, 'zoek-schoonmaak.py')); m = importlib.util.module_from_spec(s); s.loader.exec_module(m); m.schoon()
if __name__ == '__main__':
    {'lijst': lijst, 'toepassen': toepassen}[sys.argv[1]](sys.argv[2])
