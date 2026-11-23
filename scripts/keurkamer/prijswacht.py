# -*- coding: utf-8 -*-
"""Prijswacht (23-11-2026, opdracht Marius: 'een programma dat elk product op de website in de gaten houdt en altijd de prijzen aanpast
als ze veranderen'). Draait op de laptop (Taakplanner 'LeukeKeuze prijswacht', 12:30, 16:30 en 20:30; de ochtendrun om 09:00 doet de feeds).

Wat hij doet:
  1. de gewone pagina van de winkel nakijken (nooit een partnerlink, nooit bol of Amazon; zie winkelcheck.py):
       - elke run alles wat bezoekers het meest zien: de eerste 36 van elke vaste top, alles wat app.js noemt (gidsen, homepage, reels),
         en producten die bezoek of een verkoop hadden (scripts/seo/google-houden.json);
       - plus elke run een derde van de rest (--deel 0, 1 of 2; standaard op het uur), zodat elk product elke dag op zijn eigen pagina
         is nagekeken, ook als de feed achterloopt;
  2. wat anders is meteen op de site zetten, zonder bouw: assets/data/prijzen-nu.json (de site past het toe bij het laden,
     zie het blok PRIJSWACHT in sjabloon.html). Binnen een kwartier live (GitHub Pages);
  3. hetzelfde als rapport voor de piloot (keurkamer/nazorg/prijswacht-laatste.json, vorm van wacht.py): de volgende ochtend gaat het
     vast in correcties.json (dag.py, met de grenzen van nazorg.py), en verdwijnt het weer uit prijzen-nu.json.

Regels (zelfde als winkelcheck.py, CLAUDE.md paragraaf 26):
  - prijs alleen uit de productgegevens van de winkel (JSON-LD of meta-prijs); elke afwijking telt (ook 1 cent), maar een prijs die
    meer dan verdubbelt of meer dan halveert niet overnemen, alleen melden (kan een andere maat of variant zijn);
  - een nieuwe prijs nooit als korting: de site laat de van-prijs dan weg tot de volgende bouw;
  - weg = pagina bestaat niet meer, of de winkel zegt zelf uitverkocht; valt bij een winkel ineens meer dan 30% weg, dan van die
    winkel niets (de winkel heeft dan iets veranderd);
  - niets doen als bijna niets te lezen was (netwerk weg).

Gebruik: python -I prijswacht.py [--deel 0|1|2|alles|druk] [--max N] [--droog] [--geen-push]
Alleen de standaardbibliotheek (en node voor effectief-site.js)."""
import os, sys, json, re, subprocess, datetime, hashlib, collections, time
HIER = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(os.path.dirname(HIER))
sys.path.insert(0, HIER)
import winkelcheck as WC  # noqa: E402  (eigen bestand ernaast: gewoon_adres, haal_alles, oordeel)

NU_PAD = os.path.join(ROOT, 'assets', 'data', 'prijzen-nu.json')
RAP_PAD = os.path.join(ROOT, 'keurkamer', 'nazorg', 'prijswacht-laatste.json')
LOG_PAD = os.path.join(ROOT, 'keurkamer', 'nazorg', 'prijswacht-log.json')
WERK = os.path.join(ROOT, '..', 'zoekindex-feeds', 'nazorg')  # buiten git (zelfde map als de ochtendrun)
BEWAAR_DAGEN = 2       # een regel in prijzen-nu.json die na 2 dagen nog niet in een bouw zit, vervalt (de site valt dan terug op de gebouwde prijs)
MIN_GELEZEN = 0.25     # minder dan 25% van de pagina's te lezen = netwerk of winkels weg: niets veranderen


def arg(naam, std=None):
    return sys.argv[sys.argv.index(naam) + 1] if naam in sys.argv and sys.argv.index(naam) + 1 < len(sys.argv) else std


def git(*a):
    r = subprocess.run(['git'] + list(a), cwd=ROOT, capture_output=True, text=True, encoding='utf-8', errors='replace')
    return r.returncode, (r.stdout or '') + (r.stderr or '')


def druk_ids(P):
    """De producten die bezoekers het meest zien."""
    ids = set()
    try:
        for k, v in json.load(open(os.path.join(ROOT, 'scripts', 'top', 'picks.json'), encoding='utf-8')).items(): ids.update(v[:36])
    except Exception: pass
    try: ids.update(json.load(open(os.path.join(ROOT, 'scripts', 'seo', 'google-houden.json'), encoding='utf-8')).get('ids', []))
    except Exception: pass
    try:
        app = open(os.path.join(ROOT, 'assets', 'js', 'app.js'), encoding='utf-8').read()
        ids.update(x for x in re.findall(r"['\"]([a-z0-9]+-[A-Za-z0-9_.-]+)['\"]", app) if x in P)
    except Exception: pass
    return ids


def deel_van(pid):
    return int(hashlib.md5(pid.encode('utf-8')).hexdigest()[:6], 16) % 3


def main():
    droog, geen_push = '--droog' in sys.argv, '--geen-push' in sys.argv
    nu = datetime.datetime.now(); vandaag = nu.date().isoformat()
    deel = arg('--deel') or str(0 if nu.hour < 14 else 1 if nu.hour < 18 else 2)
    if not geen_push and not droog: git('checkout', '-q', 'main'); git('pull', '--rebase', '-q')
    os.makedirs(WERK, exist_ok=True)
    sp = os.path.join(WERK, 'producten-site-prijswacht.json')
    subprocess.run(['node', os.path.join(HIER, 'effectief-site.js'), sp], check=True, capture_output=True, timeout=600)
    P = json.load(open(sp, encoding='utf-8')).get('producten', {})
    basis = WC.winkel_basis(P); druk = druk_ids(P)
    todo = {}
    for pid, p in P.items():
        if (p.get('shop') or 'bol') in WC.NOOIT_WINKEL: continue
        if not (pid in druk or deel == 'alles' or (deel in '012' and deel_van(pid) == int(deel))): continue
        if deel == 'druk' and pid not in druk: continue
        u = WC.gewoon_adres(p, basis)
        if u and not WC.NIET.search(u): todo[pid] = u
    maxn = int(arg('--max', '6000'))
    todo = dict(sorted(todo.items(), key=lambda kv: (kv[0] not in druk, kv[0]))[:maxn])
    print(len(todo), 'winkelpagina\'s na te kijken (deel %s, %d druk)' % (deel, len([k for k in todo if k in druk])), flush=True)
    uit = {}
    stand = os.path.join(WERK, 'prijswacht-stand.json')   # tussenstand: elke 100 pagina's een regel 'n gedaan' in de uitvoer
    t0 = time.time(); WC.haal_alles(list(todo.items()), uit, stand)
    try: os.remove(stand)
    except Exception: pass
    O = {}; per_winkel = collections.defaultdict(collections.Counter)
    for k, v in uit.items():
        o = WC.oordeel(v, float(P[k]['prijs'])); o['shop'] = P[k].get('shop') or ''; O[k] = o; per_winkel[o['shop']][o['uitslag']] += 1
    gelezen = sum(1 for o in O.values() if o['uitslag'] != 'onbekend')
    twijfel = sorted(w for w, c in per_winkel.items() if c['weg'] >= 5 and c['weg'] > 0.30 * sum(c.values()))
    if O and gelezen < MIN_GELEZEN * len(O):
        print('PRIJSWACHT: maar %d van %d pagina\'s te lezen, niets veranderd (netwerk?)' % (gelezen, len(O))); sys.exit(3)
    prijs, weg, klopt, groot = {}, {}, [], []
    for k, o in O.items():
        oud = float(P[k]['prijs'])
        if o['uitslag'] == 'klopt': klopt.append(k)
        elif o['uitslag'] == 'prijs':
            n = round(float(o['nieuw']), 2)
            if 0.5 <= n / oud <= 2.0: prijs[k] = n
            else: groot.append({'id': k, 'titel': P[k].get('titel', '')[:70], 'oud': oud, 'nieuw': n, 'shop': o['shop']})
        elif o['uitslag'] == 'weg' and o['shop'] not in twijfel: weg[k] = o.get('waarom', '')
    # prijzen-nu.json bijwerken: wat vandaag is nagekeken vervangt de oude regel; de rest blijft tot hij in een bouw zit of vervalt
    try: NU = json.load(open(NU_PAD, encoding='utf-8'))
    except Exception: NU = {}
    oude = NU.get('p', {}) if isinstance(NU.get('p'), dict) else {}
    grens = (nu.date() - datetime.timedelta(days=BEWAAR_DAGEN)).isoformat()
    nieuw = {}
    for k, x in oude.items():
        if k in O or k not in P or x.get('d', '') < grens: continue
        if x.get('w') or abs(float(x.get('p', 0)) - float(P[k]['prijs'])) >= 0.01: nieuw[k] = x   # nog niet in de bouw
    for k, n in prijs.items(): nieuw[k] = {'p': n, 'd': vandaag}
    for k in weg: nieuw[k] = {'w': 1, 'd': vandaag}
    NU = {'uitleg': 'Verse prijzen van de prijswacht (scripts/keurkamer/prijswacht.py), zonder bouw op de site gezet. p = prijs, w = 1: niet meer te koop, d = nagekeken op. '
                    'Gaat bij de volgende bouw vast in correcties.json.', 'gemaakt': nu.isoformat(timespec='minutes'), 'p': dict(sorted(nieuw.items()))}
    # rapport voor de piloot (vorm van wacht.py), zodat nazorg.py het met zijn eigen grenzen overneemt
    RAP = {'gemaakt': nu.isoformat(timespec='minutes'), 'bron': 'prijswacht', 'deel': deel,
           'prijs': [{'id': k, 'titel': P[k].get('titel', '')[:70], 'oud': float(P[k]['prijs']), 'nieuw': n, 'exact': True, 'bron': 'winkelpagina'} for k, n in prijs.items()],
           'uitverkocht': [{'id': k, 'titel': P[k].get('titel', '')[:70], 'bron': 'winkelpagina', 'reden': r} for k, r in weg.items()],
           'gezien': sorted(set(klopt) | set(prijs)), 'nietInFeed': [], 'terug': [], 'feedDatum': {},
           'samenvatting': {'live': len(O), 'gecontroleerd': len(O)}, 'twijfelWinkels': twijfel, 'grotePrijssprong': groot[:60],
           'nietLeesbaar': sorted(('%s: %d' % (w, c['onbekend']) for w, c in per_winkel.items() if c['onbekend'] >= 5), key=lambda s: -int(s.rsplit(' ', 1)[1]))[:25]}
    # vorige rapporten van vandaag niet kwijtraken: de piloot past het rapport één keer per dag toe
    try:
        oud_rap = json.load(open(RAP_PAD, encoding='utf-8'))
        if oud_rap.get('gemaakt', '')[:10] == vandaag:
            hier = set(O)
            RAP['prijs'] += [x for x in oud_rap.get('prijs', []) if x['id'] not in hier]
            RAP['uitverkocht'] += [x for x in oud_rap.get('uitverkocht', []) if x['id'] not in hier]
            RAP['gezien'] = sorted(set(RAP['gezien']) | (set(oud_rap.get('gezien', [])) - hier))
            n = len(set(RAP['gezien']) | set(x['id'] for x in RAP['uitverkocht']))
            RAP['samenvatting'] = {'live': n, 'gecontroleerd': n}
    except Exception: pass
    RAP['feedDatum'] = {k: vandaag for k in RAP['gezien']}   # controledatum = de dag van het nakijken (niet de dag dat de piloot het toepast)
    sam = {'tijd': nu.isoformat(timespec='minutes'), 'deel': deel, 'nagekeken': len(O), 'gelezen': gelezen, 'klopt': len(klopt), 'prijs': len(prijs),
           'weg': len(weg), 'groteSprong': len(groot), 'twijfel': twijfel, 'opSite': len(nieuw), 'seconden': round(time.time() - t0)}
    print(json.dumps(sam, ensure_ascii=False))
    if droog: return
    os.makedirs(os.path.dirname(NU_PAD), exist_ok=True); os.makedirs(os.path.dirname(RAP_PAD), exist_ok=True)
    json.dump(NU, open(NU_PAD, 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
    json.dump(RAP, open(RAP_PAD, 'w', encoding='utf-8'), ensure_ascii=False)
    try: LOG = json.load(open(LOG_PAD, encoding='utf-8'))
    except Exception: LOG = []
    LOG = (LOG + [sam])[-60:]
    json.dump(LOG, open(LOG_PAD, 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
    if geen_push: return
    git('add', 'assets/data/prijzen-nu.json', 'keurkamer/nazorg/prijswacht-laatste.json', 'keurkamer/nazorg/prijswacht-log.json')
    c, t = git('diff', '--cached', '--quiet')
    if c == 0: print('PRIJSWACHT: niets veranderd'); return
    git('commit', '-q', '-m', 'Prijswacht %s: %d prijzen anders, %d niet meer te koop (%d nagekeken)' % (sam['tijd'], len(prijs), len(weg), len(O)))
    for poging in range(3):
        c, t = git('push', '-q', 'origin', 'HEAD:main')
        if c == 0: print('PRIJSWACHT: live gezet'); return
        git('pull', '--rebase', '-q'); time.sleep(5)
    print('PRIJSWACHT: pushen mislukt:', t.strip()[-200:])


if __name__ == '__main__':
    main()
