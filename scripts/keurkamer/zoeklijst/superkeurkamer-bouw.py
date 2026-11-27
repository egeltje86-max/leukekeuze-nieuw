# -*- coding: utf-8 -*-
"""Superkeurkamer: alle feeds lezen en per partner een nette mini-winkel maken (data/p/<partner>.json).
Verandert NIETS aan de website. Gebruik: python bouw.py [partner-id ...]"""
import os, sys, json, glob, re, time, datetime, traceback
from collections import Counter
sys.stdout.reconfigure(encoding='utf-8')
HIER = os.path.dirname(os.path.abspath(__file__))
KAMER = os.path.dirname(HIER)
sys.path.insert(0, HIER)
from lezen import lees, winkel_url
from indeler import deel_in, plat, woorden, KLEUREN, MATEN

ZOEKINDEX = os.environ.get('SKK_FEEDS', r'C:\Users\egelt\Documents\zoekindex-feeds')
EIGEN = os.path.join(KAMER, 'feeds')
DATA = os.path.join(KAMER, 'data')
MAX = 60000
BRON_EXTRA = {}
os.makedirs(os.path.join(DATA, 'p'), exist_ok=True)


def bestanden_van(p):
    uit = []
    for b in p.get('bestanden', []):
        b = b if isinstance(b, dict) else {'b': b}
        for d in (ZOEKINDEX, EIGEN):
            f = os.path.join(d, b['b'])
            if os.path.exists(f) and os.path.getsize(f) > 200:
                BRON_EXTRA[f] = b
                uit.append(f)
                break
    if p.get('bestanden_patroon'):
        uit += sorted(glob.glob(os.path.join(ZOEKINDEX, p['bestanden_patroon'])))
    for t in p.get('tt', []):
        f = os.path.join(EIGEN, 'tt-%s.xml' % t['fid'])
        if os.path.exists(f) and os.path.getsize(f) > 200 and t['fid'] not in p.get('bestseller_tt', []) \
                and not any(isinstance(b, str) and b.startswith('t-') for b in p.get('bestanden', [])):
            uit.append(f)
    if p.get('dc'):
        for f in sorted(glob.glob(os.path.join(EIGEN, 'dc-%s.xml' % p['dc']['program_id'])) +
                        glob.glob(os.path.join(EIGEN, 'dc-%s-*.xml' % p['dc']['program_id']))):
            if os.path.getsize(f) > 200:
                uit.append(f)
    # dubbele bronnen (nachtelijk bestand én eigen download van dezelfde feed): de eerste telt
    gezien, schoon = set(), []
    for f in uit:
        if f not in gezien:
            gezien.add(f); schoon.append(f)
    return schoon


def bestseller_namen(p):
    namen = set()
    for fid in p.get('bestseller_tt', []):
        f = os.path.join(EIGEN, 'tt-%s.xml' % fid)
        if os.path.exists(f):
            try:
                for r in lees(f):
                    namen.add(plat(r['t']))
            except Exception:
                pass
    return namen


VAR_WEG = re.compile(r'\b(maat|size|kleur|color|colour)\b.*$', re.I)
MAAT_SEG = re.compile(r'(?i)(\d{1,3}\s*[x/]\s*\d{1,3}|w\d{2}\s*l?\d{0,2}|\d{1,2}a|\d{1,2}-\d{1,2}\s*(jaar|j|y|m)?|xxs|xs|s|m|l|xl|xxl|xxxl|[2-6]xl|'
                      r'\d{2,3}(\s*cm)?|one ?size|eu ?\d+([.,]5)?|maat .*|size .*|\d+\s*(ml|gr|g)?)')


def variant_sleutel(r):
    delen = re.split(r'\s+[-\u2013|]\s+', r['t'])
    if len(delen) >= 3:
        delen = [d for d in delen if not MAAT_SEG.fullmatch(d.strip()) and '/' not in d and
                 not (woorden(d) and woorden(d)[0] in KLEUREN)]
    t = VAR_WEG.sub('', ' '.join(delen))
    ws = [w for w in woorden(t) if w not in KLEUREN and not MATEN.match(w)]
    return (plat(r['m']), ' '.join(ws))


def bouw_partner(p):
    if p.get('verouderd'):
        oud = os.path.join(DATA, 'p', p['id'] + '.json')
        if os.path.exists(oud):
            os.remove(oud)
        return None
    bronnen = bestanden_van(p)
    if not bronnen:
        return None
    prods, gezien = [], {}
    for f in bronnen:
        extra = BRON_EXTRA.get(f, {})
        standaard = extra.get('cat', '')
        try:
            for r in lees(f, standaard):
                if extra.get('pop'):
                    r['pop'] = 1
                if not r['t'] or r['p'] <= 0:
                    continue
                if extra.get('cat'):
                    r['_bron_cat'] = 1
                    if r['pad'] and not r['pad'].lower().startswith(extra['cat'].split(' > ')[0].lower()):
                        r['pad'] = extra['cat'] + ' > ' + r['pad']
                k = variant_sleutel(r)
                if k in gezien:
                    q = gezien[k]
                    q['v'] += 1
                    if r['p'] < q['p']:
                        for veld in ('p', 'o', 'l', 'f'):
                            q[veld] = r[veld]
                    q['pop'] = max(q['pop'], r['pop'])
                    if (not q['pad'] or (r.get('_bron_cat') and not q.get('_bron_cat'))) and r['pad']:
                        q['pad'] = r['pad']
                        q['_bron_cat'] = r.get('_bron_cat', 0)
                    if not q['o'] and r['o'] > q['p']:
                        q['o'] = r['o']
                    continue
                if len(prods) >= MAX:
                    continue
                r['v'] = 1
                gezien[k] = r
                prods.append(r)
        except Exception as e:
            print('  FOUT bij lezen', os.path.basename(f), e)
    if not prods:
        return None
    # winkelcategorieën zonder 'ouder' (bv. Coolblue '55-64 inch televisies' uit de grote feed) onder de juiste afdeling hangen
    ouders = {}
    for r in prods:
        if r.get('_bron_cat') and r['pad']:
            ouders.setdefault(plat(r['pad'].split(' > ', 1)[-1]), r['pad'])
    if ouders:
        for r in prods:
            if not r.get('_bron_cat') and r['pad'] and plat(r['pad']) in ouders:
                r['pad'] = ouders[plat(r['pad'])]
            elif not r.get('_bron_cat') and r['pad'] and any(plat(r['pad']) == plat(v.split(' > ')[0]) for v in ouders.values()):
                pass
            elif not r.get('_bron_cat') and r['pad'] and re.fullmatch(r'\d+', r['pad'].strip()):
                r['pad'] = ''
    best = bestseller_namen(p)
    for r in prods:
        if best and plat(r['t']) in best:
            r['pop'] = 1
        if not (r['o'] and r['o'] > r['p'] * 1.03 and r['o'] - r['p'] >= 1):
            r['o'] = 0
    knopen = deel_in(prods, p['naam'])
    uit = []
    for i, r in enumerate(prods):
        uit.append({'i': i, 't': r['t'][:160], 'm': r['m'][:40], 'p': r['p'], 'o': r['o'], 'f': r['f'], 'l': r['l'],
                    'u': winkel_url(r['l']), 'g': r['g'], 'k': r['k'], 'pop': r['pop'], 'v': r['v'], 'st': r['st'],
                    'e': str(r.get('ean') or '')[:20]})
    boom = [{'pad': list(k), 'n': n} for k, n in knopen.items() if k]
    boom.sort(key=lambda x: x['pad'])
    afd = Counter(r['g'][0] for r in uit if r['g'])
    voorbeeld = next((r['f'] for r in uit if r['pop'] and r['f']), '') or next((r['f'] for r in uit if r['f']), '')
    info = {'id': p['id'], 'naam': p['naam'], 'netwerk': p['netwerk'], 'n': len(uit),
            'korting': sum(1 for r in uit if r['o']), 'populair': sum(1 for r in uit if r['pop']),
            'afdelingen': [[a, n] for a, n in afd.most_common(8)], 'foto': voorbeeld,
            'opsite': p.get('opsite', 0), 'zoekfunctie': p.get('zoekfunctie', False),
            'bijgewerkt': datetime.datetime.fromtimestamp(max(os.path.getmtime(f) for f in bronnen)).strftime('%d-%m-%Y'),
            'vol': len(prods) >= MAX, 'uitleg': p.get('uitleg', ''), 'bronnen': [os.path.basename(f) for f in bronnen]}
    json.dump({'info': info, 'boom': boom, 'producten': uit}, open(os.path.join(DATA, 'p', p['id'] + '.json'), 'w', encoding='utf-8'),
              ensure_ascii=False, separators=(',', ':'))
    return info


def main():
    cat = json.load(open(os.path.join(HIER, 'partners-catalogus.json'), encoding='utf-8'))
    # nachtelijke feeds die (nog) niet in de catalogus staan, er automatisch bij zetten (bv. nieuwe partners van het andere gesprek)
    bekend = set()
    for p in cat:
        for b in p.get('bestanden', []):
            bekend.add((b['b'] if isinstance(b, dict) else b).rsplit('.', 1)[0])
    namen = {}
    for mz in glob.glob(os.path.join(os.path.dirname(ZOEKINDEX), '*', 'scripts', 'maak-zoekindex.py')):
        for f, n in re.findall(r"\('([a-z0-9-]+)\.json', '([^']+)'", open(mz, encoding='utf-8').read()):
            namen[f] = n
    ids = {p['id'] for p in cat}
    for f in sorted(glob.glob(os.path.join(ZOEKINDEX, 'x-*.xml')) + glob.glob(os.path.join(ZOEKINDEX, 't-*.xml'))):
        stam = os.path.basename(f)[:-4]
        if stam in bekend or os.path.getsize(f) < 500:
            continue
        naam = namen.get(stam) or stam[2:].replace('-', ' ').title()
        pid = re.sub(r'[^a-z0-9]', '', naam.lower())
        if pid in ids:
            continue
        ids.add(pid)
        cat.append({'id': pid, 'naam': naam, 'netwerk': 'Daisycon' if stam.startswith('x-') else 'TradeTracker',
                    'bestanden': [stam + '.xml'], 'tt': [], 'dc': None, 'bestseller_tt': [], 'zoekfunctie': stam in namen, 'opsite': 0})
    alleen = set(sys.argv[1:])
    idx_pad = os.path.join(DATA, 'partners.json')
    oud = {x['id']: x for x in json.load(open(idx_pad, encoding='utf-8'))} if os.path.exists(idx_pad) else {}
    lijst = []
    for p in cat:
        if alleen and p['id'] not in alleen:
            if p['id'] in oud:
                lijst.append(oud[p['id']])
            continue
        t0 = time.time()
        try:
            info = bouw_partner(p)
        except Exception:
            traceback.print_exc()
            info = None
        if info:
            print('%-32s %6d producten  %3.0fs' % (p['naam'][:32], info['n'], time.time() - t0))
            lijst.append(info)
        else:
            reden = p['verouderd'] if p.get('verouderd') else 'Feed nog niet opgehaald' if (p.get('tt') or p.get('dc')) else 'Geen feed'
            lijst.append({'id': p['id'], 'naam': p['naam'], 'netwerk': p['netwerk'], 'n': 0, 'korting': 0, 'populair': 0,
                          'afdelingen': [], 'foto': '', 'opsite': p.get('opsite', 0), 'zoekfunctie': p.get('zoekfunctie', False),
                          'leeg': reden, 'feeds': [t['naam'] + ' (' + str(t['n']) + ')' for t in p.get('tt', [])]})
        json.dump(lijst, open(idx_pad, 'w', encoding='utf-8'), ensure_ascii=False)
    json.dump(sorted(lijst, key=lambda x: x['naam'].lower()), open(idx_pad, 'w', encoding='utf-8'), ensure_ascii=False)
    print('Klaar:', sum(1 for x in lijst if x['n']), 'partners met producten,', sum(x['n'] for x in lijst), 'producten')
    try:   # 27-11-2026: wat bol zelf verkoopt (officiële bol-feeds) als partner 'bol' in de zoekindex (marktlijst)
        import bolfeed
        info = bolfeed.main()
        if info:
            lijst = [x for x in lijst if x['id'] != 'bol'] + [info]
            json.dump(sorted(lijst, key=lambda x: x['naam'].lower()), open(idx_pad, 'w', encoding='utf-8'), ensure_ascii=False)
    except Exception as e:
        print('bol-feeds mislukt:', e)
    from zoekindex import maak
    maak()
    try:   # prijsgeschiedenis bijwerken (echte korting = lager dan de laagste prijs van de afgelopen 30 dagen)
        import prijzen
        prijzen.main()
    except Exception as e:
        print('Prijsgeschiedenis mislukt:', e)
    try:   # meteen nakijken welke winkels dode foto's hebben (rood labeltje in de keurkamer)
        import fotocheck
        fotocheck.main()
    except Exception as e:
        print('Fotocheck mislukt:', e)
    try:   # welke winkels horen bij 'Cadeaus & gadgets'
        import cadeaus
        cadeaus.main()
    except Exception as e:
        print('Cadeaulijst mislukt:', e)


if __name__ == '__main__':
    main()
