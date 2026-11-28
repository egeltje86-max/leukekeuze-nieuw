# -*- coding: utf-8 -*-
"""Keurhulp voor de Superkeurkamer (28-11-2026, Marius: 'kun jij deze dingen nog verbeteren', 'alle 6').

  1. Cadeau-stoplicht      groen / oranje / rood per product (cadeauscore.py: vaste regels + leren van wat je koos en weggooide)
  2. Commissie             wat een winkel ongeveer betaalt (data/commissie.json, gemaakt door commissie.py bij de Control Room)
  3. Prijs en kwaliteit    prijs per stuk/ml/gram, en of de prijs laag of hoog is voor deze soort
  4. Trend                 'veel gezocht' als het merk of de productlijn veel gezocht wordt in Google (data/trend.json)
  5. Eindcontrole          'Keur deze pagina na': dubbelen, varianten, te veel van één winkel of merk, prijzen, leeftijd, aantal
  6. NOVA                  alle keuzes per pagina als bestand in Google Drive, zodat Nova ze kan nalezen; met een eigen
                           OpenAI-sleutel (in de Windows-kluis, door Marius zelf ingevuld) kan Nova ook in de keurkamer meekijken.

Alleen advies: er gaat nooit iets vanzelf weg uit je keuzes. Commissie telt NIET mee in de volgorde (de klant is koning).
"""
import json, math, os, re, threading, time, datetime, glob
from collections import Counter, defaultdict
import cadeauscore as C

HIER = os.path.dirname(os.path.abspath(__file__))
KAMER = os.path.dirname(HIER)
DATA = os.path.join(KAMER, 'data')
KEUS = os.path.join(KAMER, 'mijn keuzes')
MODEL = os.path.join(DATA, 'cadeaumodel.json')
SLOT = threading.RLock()
STAAT = {'model': None, 'bezig': False, 'commissie': None, 'commissie_t': 0, 'trend': None, 'trend_t': 0}


# ---------- 1. Cadeau-stoplicht ----------
def keuze_bestanden():
    """Wat Marius zelf in de Superkeurkamer koos: apart bewaarde lijsten en de reservekopieën van vóór 28-11-2026.
    Sinds 28-11 kiest ook Nova soms in de lijst ('NOVA handmatige keuring'); die keuzes tellen niet mee als 'wat Marius koos'.
    De huidige lijst telt alleen mee als de keurkamer hem zelf schreef (dan is de uitleg de gewone)."""
    uit = glob.glob(os.path.join(KEUS, 'bewaard-*.json'))
    rk = os.path.join(KEUS, 'reservekopie')
    uit += glob.glob(os.path.join(rk, 'nieuwe-productlijst-VOOR-*.json'))
    dag = [f for f in glob.glob(os.path.join(rk, 'nieuwe-productlijst-2026-*.json')) if os.path.basename(f)[20:30] < '2026-11-28']
    uit += sorted(dag, key=os.path.getsize, reverse=True)[:4]
    nu = os.path.join(KEUS, 'nieuwe-productlijst.json')
    try:
        if 'NOVA' not in (json.load(open(nu, encoding='utf-8')).get('uitleg') or '') and not glob.glob(os.path.join(KEUS, 'NOVA-keuringsrapport-%s*' % datetime.date.today().strftime('%Y%m%d'))):
            uit.append(nu)
    except Exception:
        pass
    return [f for f in uit if os.path.exists(f)]


def train_nu(site_titels):
    """site_titels: (lijst titels die nu op de site staan, lijst titels die Marius van de site haalde)."""
    ja, nee = site_titels
    site = [{'t': t, 's': 'goedgekeurd'} for t in ja] + [{'t': t, 's': 'afgekeurd'} for t in nee]
    m = C.train(site, keuze_bestanden())
    m.bewaar(MODEL)
    return m


def model(site_titels_fn=None):
    """Het geleerde model; maakt het (op de achtergrond) opnieuw als het ouder is dan 6 uur."""
    with SLOT:
        if STAAT['model'] is None and os.path.exists(MODEL):
            try:
                STAAT['model'] = C.Model.laad(MODEL)
            except Exception:
                STAAT['model'] = None
        m = STAAT['model']
        oud = not m or time.time() - m.gemaakt > 6 * 3600
        if oud and site_titels_fn and not STAAT['bezig']:
            STAAT['bezig'] = True

            def werk():
                try:
                    STAAT['model'] = train_nu(site_titels_fn())
                except Exception as e:
                    STAAT['fout'] = str(e)[:200]
                finally:
                    STAAT['bezig'] = False
            if m is None:
                werk()                 # eerste keer: even wachten (een paar seconden)
            else:
                threading.Thread(target=werk, daemon=True).start()
        return STAAT['model']


def stoplicht(titel, m=None):
    m = m or STAAT['model']
    reden = C.regel(titel)
    if not m:
        return {'k': 'rood' if reden else '', 'c': None, 'r': reden}
    c, b = m.cijfer(titel)
    voor, tegen = C.leesbaar(b)
    return {'k': C.kleur(c, reden), 'c': c, 'r': reden, 'voor': voor, 'tegen': tegen}


# ---------- 2. Commissie ----------
def commissie_data():
    pad = os.path.join(DATA, 'commissie.json')
    try:
        t = os.path.getmtime(pad)
    except OSError:
        return {}
    if t != STAAT['commissie_t']:
        try:
            STAAT['commissie'] = json.load(open(pad, encoding='utf-8')).get('partners', {})
            STAAT['commissie_t'] = t
        except Exception:
            STAAT['commissie'] = {}
    return STAAT['commissie'] or {}


def commissie(pid, prijs=None):
    """Wat een verkoop ongeveer oplevert. Netwerken rekenen meestal over de prijs zonder btw."""
    c = commissie_data().get(pid)
    if not c:
        return None
    pct = c.get('pct')
    gm = c.get('gemeten')
    uit = {'bron': c.get('bron', ''), 'netwerk': c.get('netwerk', '')}
    if pct and (pct[0] or pct[1]):
        uit['pct'] = [pct[0], pct[1]]
    if c.get('vast'):
        uit['vast'] = c['vast']
    if gm:
        uit['gemeten'] = gm
    try:
        p = float(prijs or 0) / 1.21
    except Exception:
        p = 0
    if p and uit.get('pct'):
        a, b = uit['pct']
        uit['eur'] = [round(p * (a or b) / 100, 2), round(p * b / 100, 2)]
    elif p and gm:
        e = round(p * gm['pct'] / 100, 2)
        uit['eur'] = [e, e]
    if c.get('uitleg'):
        uit['uitleg'] = c['uitleg']
    return uit


# ---------- 3. Prijs per eenheid ----------
# (regex, eenheid, hoeveel eenheden per gevonden getal, kleinste getal dat telt)
EENH = [
    (re.compile(r'(\d+)\s*(?:stuks|st\.?|stk|pcs|pieces|pack)\b', re.I), 'stuk', 1.0, 2),
    (re.compile(r'(\d+(?:[.,]\d+)?)\s*ml\b', re.I), '100 ml', 0.01, 5),
    (re.compile(r'(\d+(?:[.,]\d+)?)\s*cl\b', re.I), '100 ml', 0.1, 1),
    (re.compile(r'(\d+(?:[.,]\d+)?)\s*(?:liter|ltr)\b', re.I), 'liter', 1.0, 0.1),
    (re.compile(r'(\d+(?:[.,]\d+)?)\s*(?:gram|gr)\b|(\d{2,4})\s*g\b', re.I), '100 gram', 0.01, 10),
    (re.compile(r'(\d+(?:[.,]\d+)?)\s*kg\b', re.I), 'kilo', 1.0, 0.1),
]


NIET_STUK = re.compile(r'(spel|game|puzzel|puzzle|lego|bouwset|bouwpakket|bouwstenen|blokken|kralen|delig|onderdelen|stukjes|knutsel)', re.I)


def per_eenheid(titel, prijs):
    """'€ 0,45 per stuk' of '€ 3,20 per 100 ml', alleen als het in de naam staat."""
    try:
        p = float(prijs or 0)
    except Exception:
        return ''
    if p <= 0:
        return ''
    for r, naam, f, minst in EENH:
        m = r.search(titel or '')
        if not m:
            continue
        g = next((x for x in m.groups() if x), None)
        try:
            n = float(g.replace(',', '.'))
        except Exception:
            continue
        if n < minst or (naam == 'stuk' and (n > 2000 or NIET_STUK.search(titel or ''))):
            continue
        return '€ %s per %s' % (('%.2f' % (p / (n * f))).replace('.', ','), naam)
    return ''


def prijs_oordeel(p, mediaan):
    """'laag' of 'hoog' voor deze soort (vergeleken met het midden van wat er is), anders ''."""
    if not p or not mediaan:
        return ''
    if p <= 0.55 * mediaan:
        return 'laag'
    if p >= 2.5 * mediaan:
        return 'hoog'
    return ''


# ---------- 4. Trend ----------
def trend_data():
    pad = os.path.join(DATA, 'trend.json')
    try:
        t = os.path.getmtime(pad)
    except OSError:
        return None
    if t != STAAT['trend_t']:
        d = json.load(open(pad, encoding='utf-8'))
        per_eerste = defaultdict(list)
        for kw, (vol, w) in d.get('titel', {}).items():
            ws = kw.split()
            per_eerste[ws[0]].append((ws, vol, w, kw))
        STAAT['trend'] = {'eerste': per_eerste, 'merk': d.get('merk', {})}
        STAAT['trend_t'] = t
    return STAAT['trend']


def trend_woorden(titel, merk=''):
    """Alle zoekwoorden die in de naam (of het merk) staan: [(zoekwoord, volume, gewogen)]."""
    d = trend_data()
    if not d:
        return []
    w = C.plat(titel).split()
    uit = {}
    for i, x in enumerate(w):
        for ws, vol, gw, kw in d['eerste'].get(x, ()):
            if w[i:i + len(ws)] == ws:
                uit[kw] = (kw, vol, vol * gw)
    mk = C.plat(merk)
    if mk and mk in d['merk']:
        uit.setdefault(mk, (mk, d['merk'][mk], d['merk'][mk] * 0.3))
    return list(uit.values())


def trend_blok(rijen, titel_i=3, merk_i=9):
    """Per product het sterkste zoekwoord, maar een zoekwoord dat 40% of meer van de soort deelt telt niet (dat zegt niets binnen die soort)."""
    alle = [trend_woorden(r[titel_i], r[merk_i]) for r in rijen]
    tel = Counter(kw for x in alle for kw, _, _ in x)
    grens = max(6, 0.4 * len(rijen))
    uit = []
    for x in alle:
        x = [y for y in x if tel[y[0]] < grens]
        uit.append(max(x, key=lambda y: y[2]) if x else None)
    return uit


def trend_label(t):
    if not t:
        return None
    kw, vol, eff = t
    if eff < 200:
        return None
    return {'kw': kw, 'vol': vol, 'sterk': eff >= 2000}


def trend_punten(t):
    if not t or t[2] < 200:
        return 0.0
    return min(2.0, math.log10(t[2]) - 2.3)


# ---------- 5. Eindcontrole ----------
KLEUR_MAAT = re.compile(r'\b(zwart|wit|rood|roze|blauw|groen|geel|paars|grijs|bruin|oranje|goud|zilver|beige|lila|mint|navy|turquoise|'
                        r'black|white|red|pink|blue|green|yellow|purple|grey|gray|brown|orange|gold|silver|xs|s|m|l|xl|xxl|\d+\s*cm|\d+\s*mm|'
                        r'small|medium|large|klein|groot|mini|maxi|maat \S+|size \S+)\b')
LEEFTIJD_VOLW = re.compile(r'\b(18\+|volwassen\w*|adult\w*|adults|16\+|14\+|12\+|vanaf 12|vanaf 14)\b')
KLEINE_DELEN = re.compile(r'\b(3\+|3 jaar|vanaf 3|4\+|5\+|6\+|8\+|kleine onderdelen|magneet|magneten|knoopcel)\b')


def basis_naam(t):
    w = [x for x in C.plat(KLEUR_MAAT.sub(' ', C.plat(t))).split() if len(x) >= 3 and not x.isdigit()]
    return ' '.join(w[:4])


def gelijk(a, b):
    sa, sb = set(C.plat(a).split()), set(C.plat(b).split())
    if not sa or not sb:
        return 0
    return len(sa & sb) / len(sa | sb)


def nakijken(blokken, lijst, zelfde_sleutels, fotoscore=None, prijzen_nu=None):
    """blokken: [{id, naam, doel, min, max, voor, zoek, pad}]; lijst: alle gekozen producten.
    Geeft per blok de meldingen (ernst: 'fout' = echt doen, 'let' = even kijken, 'info')."""
    per_blok = defaultdict(list)
    for x in lijst:
        for c in x.get('categorieen', []):
            per_blok[c].append(x)
    in_soorten = Counter(x['key'] for x in lijst for c in x.get('categorieen', []) if c in {b['id'] for b in blokken})
    uit, totaal = [], Counter()
    for b in blokken:
        ps = per_blok.get(b['id'], [])
        mld = []

        def zeg(ernst, tekst, keys=()):
            mld.append({'ernst': ernst, 'tekst': tekst, 'keys': list(keys)})
            totaal[ernst] += 1
        n = len(ps)
        doel = b.get('doel') or 0
        if not n:
            if doel:
                zeg('info', 'Nog niets gekozen (doel ongeveer %d).' % doel)
            uit.append({'id': b['id'], 'naam': b['naam'], 'pad': b.get('pad', ''), 'n': 0, 'doel': doel, 'meldingen': mld})
            continue
        # dubbel: zelfde barcode of zelfde naam, of bijna dezelfde naam
        gezien = {}
        dubbel = set()
        for x in ps:
            for s in zelfde_sleutels(x.get('titel'), x.get('ean')):
                if s in gezien and gezien[s] != x['key']:
                    dubbel.add((gezien[s], x['key']))
                gezien.setdefault(s, x['key'])
        for i, a in enumerate(ps):
            for c in ps[i + 1:]:
                if gelijk(a.get('titel'), c.get('titel')) >= 0.75:
                    dubbel.add((a['key'], c['key']))
        for a, c in dubbel:
            ta = next(y['titel'] for y in ps if y['key'] == a)
            zeg('fout', 'Twee keer (bijna) hetzelfde: "%s". Hou er één.' % ta[:70], (a, c))
        # varianten: zelfde basisnaam, andere kleur of maat
        basis = defaultdict(list)
        for x in ps:
            bn = basis_naam(x.get('titel'))
            if len(bn.split()) >= 2:
                basis[bn].append(x['key'])
        al = {k for d in dubbel for k in d}
        for bn, ks in basis.items():
            ks2 = [k for k in ks if k not in al]
            if len(ks2) >= 3 or (len(ks2) == 2 and n <= 8):
                zeg('let', '%d varianten van hetzelfde product (%s). Kies de mooiste, of laat er hooguit twee staan.' % (len(ks2), bn), ks2)
        # winkel en merk
        if n >= 6:
            w, wn = Counter(x.get('winkel') or x.get('partner') for x in ps).most_common(1)[0]
            if wn / n > 0.5 and not str(w).lower().startswith('bol'):     # bol is een warenhuis met veel verkopers: dat is geen probleem
                zeg('let', '%d van de %d komen van %s. Meer winkels door elkaar is beter (ook als die winkel even geen voorraad heeft).' % (wn, n, w),
                    [x['key'] for x in ps if (x.get('winkel') or x.get('partner')) == w])
            mk = Counter(C.plat(x.get('merk')) for x in ps if C.plat(x.get('merk')) not in ('', 'merkloos', 'onbekend'))
            if mk:
                m, mn = mk.most_common(1)[0]
                zoek = ' '.join(C.plat(z) for z in (b.get('zoek') or []) + (b.get('ook') or []))
                if mn / n > 0.5 and m not in zoek:
                    zeg('let', '%d van de %d zijn van één merk (%s). Een paar andere merken ernaast geeft meer keus.' % (mn, n, m),
                        [x['key'] for x in ps if C.plat(x.get('merk')) == m])
        # prijzen: goedkoop en duur door elkaar
        pr = sorted(float(x.get('prijs_nu') or x.get('prijs') or 0) for x in ps if (x.get('prijs_nu') or x.get('prijs')))
        if n >= 5 and pr:
            bmax = b.get('max') or 999
            if pr[0] >= 15 and bmax > 25 and (b.get('min') or 0) <= 10:
                zeg('let', 'Niets onder € 15. Een goedkope "ja" erbij helpt (lootjes, kleine cadeaus).')
            if pr[-1] < 30 and bmax >= 60:
                zeg('info', 'Niets boven € 30. Eén duurder pronkstuk mag (soort gaat tot € %d).' % bmax)
        # leeftijd
        voor = set(b.get('voor') or [])
        if voor & {'kind', 'baby'}:
            for x in ps:
                t = ' ' + C.plat(x.get('titel')) + ' '
                if LEEFTIJD_VOLW.search(t):
                    zeg('fout', 'Lijkt voor oudere kinderen of volwassenen: "%s".' % x['titel'][:70], [x['key']])
                elif 'baby' in voor and voor <= {'baby', 'kind'} and KLEINE_DELEN.search(t) and 'baby' in (b.get('pad') or '').lower():
                    zeg('let', 'Let op de leeftijd (kleine onderdelen of 3+?): "%s".' % x['titel'][:70], [x['key']])
        # stoplicht
        for x in ps:
            s = stoplicht(x.get('titel'))
            if s.get('k') == 'rood':
                zeg('let', 'Rood stoplicht%s: "%s".' % ((' (' + s['r'] + ')') if s.get('r') else '', x['titel'][:70]), [x['key']])
        # winkel: niet meer in de feed, prijs veranderd, foto
        for x in ps:
            if x.get('in_feed') is False:
                zeg('fout', 'Niet meer bij de winkel te vinden: "%s".' % x['titel'][:70], [x['key']])
            elif x.get('prijs_nu') and x.get('prijs') and abs(x['prijs_nu'] - x['prijs']) / x['prijs'] >= 0.15:
                zeg('info', 'Prijs veranderd van € %.2f naar € %.2f: "%s".' % (x['prijs'], x['prijs_nu'], x['titel'][:60]), [x['key']])
            if fotoscore and x.get('foto'):
                try:
                    fs = fotoscore(x['foto'])
                except Exception:
                    fs = None
                if fs is not None and fs < 0.25:
                    zeg('let', 'Foto is klein, wazig of druk: "%s". Bij een andere winkel is er misschien een mooiere.' % x['titel'][:60], [x['key']])
            if in_soorten[x['key']] > 1:
                zeg('info', 'Staat in %d soorten tegelijk: "%s".' % (in_soorten[x['key']], x['titel'][:60]), [x['key']])
        # aantal
        if doel and n > 1.5 * doel and n - doel >= 4:
            zeg('let', '%d gekozen, het doel is ongeveer %d. Hou de beste %d en zet de rest eruit.' % (n, doel, doel))
        elif doel and n < doel:
            zeg('info', '%d van de ongeveer %d gekozen.' % (n, doel))
        uit.append({'id': b['id'], 'naam': b['naam'], 'pad': b.get('pad', ''), 'n': n, 'doel': doel, 'meldingen': mld})
    return {'blokken': uit, 'telling': dict(totaal)}


# ---------- 6. NOVA ----------
def nova_map():
    for d in (r'G:\Mijn Drive\LeukeKeuze voor Nova', os.path.expanduser(r'~\Google Drive\LeukeKeuze voor Nova')):
        if os.path.isdir(d):
            p = os.path.join(d, 'Superkeurkamer')
            os.makedirs(p, exist_ok=True)
            return p, True
    p = os.path.join(KEUS, 'voor-nova')
    os.makedirs(p, exist_ok=True)
    return p, False


NOVA_UITLEG = """# Superkeurkamer: de keuzes per pagina

Nova, dit bestand maakt de Superkeurkamer van LeukeKeuze vanzelf (elke keer als Marius iets kiest, en elke avond).
Het zijn de cadeaus die nu in de keuzelijst staan voor de nieuwe site, per categorie, pagina en soort.

Wat Marius graag van je wil (een tweede inhoudelijke beoordeling):
1. Past elk cadeau bij de soort en de pagina? Zet wat er niet bij hoort onder 'Niet hier'.
2. Zijn het echte cadeaus (iets wat je graag krijgt) en geen gewone winkelspullen? Zet twijfelgevallen onder 'Twijfel'.
3. Ontbreekt er iets wat mensen in deze soort zoeken (een bekend merk, een topper van nu)? Zet dat onder 'Mist'.
4. Te veel van hetzelfde (varianten, één winkel, één merk)? Zeg welke weg kunnen.
Schrijf per pagina kort, in gewone woorden. Noem het product met de naam zoals hieronder.

Bij elk product: prijs, winkel, het cadeau-stoplicht van de keurkamer (groen/oranje/rood) en eventuele meldingen.
De link is de gewone winkelpagina (geen partnerlink), zodat je kunt kijken zonder dat het als klik telt.
"""


def nova_export(cats, lijst, meldingen=None):
    """Schrijft keuzes-per-pagina.md en .json in de Drive-map voor Nova (of mijn keuzes\\voor-nova als Drive er niet is)."""
    map_, drive = nova_map()
    per = {c['id']: c for c in cats}
    kind = defaultdict(list)
    for c in cats:
        kind[c.get('ouder')].append(c)
    for v in kind.values():
        v.sort(key=lambda c: c.get('volgorde', 0))
    per_blok = defaultdict(list)
    for x in lijst:
        for cid in x.get('categorieen', []):
            per_blok[cid].append(x)
    mld = {}
    for b in (meldingen or {}).get('blokken', []):
        for m in b['meldingen']:
            for k in m['keys']:
                mld.setdefault((b['id'], k), []).append(m['tekst'])
    regels = [NOVA_UITLEG, '_Gemaakt op %s. %d gekozen cadeaus._\n' % (datetime.datetime.now().strftime('%d-%m-%Y %H:%M'), len(lijst))]
    js = []

    def totaal(cid):
        return len(per_blok.get(cid, [])) + sum(totaal(k['id']) for k in kind.get(cid, []))

    def loop(ouder, d):
        for c in kind.get(ouder, []):
            if not totaal(c['id']):
                continue
            regels.append('\n' + '#' * min(4, d + 2) + ' ' + c['naam'] + (' (%d)' % totaal(c['id'])))
            ps = per_blok.get(c['id'], [])
            if ps:
                if c.get('doel'):
                    regels.append('Doel ongeveer %d; prijs %s tot %s.' % (c['doel'], c.get('min', '?'), c.get('max', '?')))
                for x in ps:
                    s = stoplicht(x.get('titel'))
                    w = x.get('winkelurl') or ''
                    regel = '- %s | € %.2f | %s | stoplicht %s%s' % (x.get('titel', ''), float(x.get('prijs') or 0), x.get('winkel') or x.get('partner'),
                                                                    s.get('k') or '?', (' (' + s['r'] + ')') if s.get('r') else '')
                    if w and not re.search(r'(tradetracker|awin1|daisycon|partner|cread\.php|/c\?|tc\.)', w):
                        regel += ' | ' + w
                    for t in mld.get((c['id'], x['key']), []):
                        regel += '\n  - keurkamer: ' + t
                    regels.append(regel)
                    js.append({'pagina': ' > '.join(pad(c['id'])), 'titel': x.get('titel'), 'prijs': x.get('prijs'), 'winkel': x.get('winkel'),
                               'winkelpagina': w, 'stoplicht': s.get('k'), 'reden': s.get('r'), 'foto': x.get('foto')})
            loop(c['id'], d + 1)

    def pad(cid):
        uit, k = [], per.get(cid)
        while k:
            uit.insert(0, k['naam'])
            k = per.get(k.get('ouder'))
        return uit
    loop(None, 0)
    md = os.path.join(map_, 'keuzes-per-pagina.md')
    with open(md + '.tmp', 'w', encoding='utf-8') as f:
        f.write('\n'.join(regels) + '\n')
    os.replace(md + '.tmp', md)
    jp = os.path.join(map_, 'keuzes-per-pagina.json')
    json.dump({'gemaakt': datetime.datetime.now().strftime('%Y-%m-%d %H:%M'), 'producten': js}, open(jp + '.tmp', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    os.replace(jp + '.tmp', jp)
    return {'map': map_, 'drive': drive, 'n': len(js)}


def nova_oordeel_lezen():
    """Als Nova (of Marius) een bestand nova-oordeel*.md in dezelfde map zet, laat de keurkamer het zien."""
    map_, _ = nova_map()
    fs = sorted(glob.glob(os.path.join(map_, 'nova-oordeel*.md')) + glob.glob(os.path.join(map_, 'Nova-oordeel*.md')), key=os.path.getmtime, reverse=True)
    if not fs:
        return None
    try:
        return {'bestand': os.path.basename(fs[0]), 'datum': datetime.datetime.fromtimestamp(os.path.getmtime(fs[0])).strftime('%d-%m-%Y %H:%M'),
                'tekst': open(fs[0], encoding='utf-8', errors='replace').read()[:30000]}
    except Exception:
        return None


NOVA_KLUIS = ('LeukeKeuze NOVA', 'openai')


def nova_sleutel_er():
    try:
        import keyring
        return bool(keyring.get_password(*NOVA_KLUIS))
    except Exception:
        return False


def nova_vraag(pagina_naam, producten, meldingen):
    """Een tweede beoordeling van één pagina door Nova via de OpenAI-sleutel van Marius (Windows-kluis). Print of bewaart de sleutel nooit."""
    try:
        import keyring
        sleutel = keyring.get_password(*NOVA_KLUIS)
    except Exception:
        sleutel = None
    if not sleutel:
        return {'fout': 'geen sleutel'}
    inst = {}
    try:
        inst = json.load(open(os.path.join(DATA, 'nova-instellingen.json'), encoding='utf-8'))
    except Exception:
        pass
    lijst = '\n'.join('- %s | € %.2f | %s | stoplicht %s' % (x.get('titel'), float(x.get('prijs') or 0), x.get('winkel'), stoplicht(x.get('titel')).get('k'))
                      for x in producten[:120])
    vraag = (NOVA_UITLEG + '\n\nPagina: ' + pagina_naam + '\n\nGekozen cadeaus:\n' + lijst +
             ('\n\nMeldingen van de keurkamer:\n' + '\n'.join('- ' + m for m in meldingen[:60]) if meldingen else '') +
             '\n\nAntwoord in het Nederlands, kort, met de kopjes: Niet hier, Twijfel, Mist, Te veel van hetzelfde, Verder goed.')
    import urllib.request, urllib.error
    body = {'model': inst.get('model', 'gpt-4o-mini'), 'messages': [
        {'role': 'system', 'content': 'Je bent Nova, creatief directeur van LeukeKeuze.nl (cadeausite). Je beoordeelt eerlijk en kort of cadeaus bij een pagina passen.'},
        {'role': 'user', 'content': vraag}], 'temperature': 0.3}
    req = urllib.request.Request('https://api.openai.com/v1/chat/completions', data=json.dumps(body).encode('utf-8'),
                                 headers={'Authorization': 'Bearer ' + sleutel, 'Content-Type': 'application/json'})
    try:
        with urllib.request.urlopen(req, timeout=120) as r:
            d = json.loads(r.read().decode('utf-8'))
        return {'tekst': d['choices'][0]['message']['content'], 'model': body['model']}
    except urllib.error.HTTPError as e:
        return {'fout': 'OpenAI gaf fout %s' % e.code}
    except Exception as e:
        return {'fout': 'OpenAI niet bereikbaar (%s)' % type(e).__name__}
    finally:
        sleutel = None
