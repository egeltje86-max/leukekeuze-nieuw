"""Sitewacht: wekelijkse gezondheidscheck van leukekeuze.nl.
Kijkt naar drie dingen en maakt daar één rapport van, met een cijfer en een actielijst (top 10):
  1. Google  - Search Console-cijfers (klikken, vertoningen, positie), kansen en pijnpunten
  2. Winkel  - de catalogus zoals de site hem toont (keurkamer/data/catalogus.json): te dunne vakjes, dubbelen, vlaggen, AI-advies
  3. Techniek- de gebouwde pagina's in de repo: titels, omschrijvingen, kapotte links, foto's, sitemap, zwaarte van de pagina's

Gebruik:  python3 scripts/keurkamer/sitewacht.py [--gsc keurkamer/wacht/gsc-JJJJ-MM-DD.json] [--snel]
  --gsc   Search Console-bestand (standaard: het nieuwste gsc-*.json in keurkamer/wacht/). Twee vormen mogen:
          de ruwe uitvoer van OpenSEO ({"rows":[{"keys":[..],"clicks":..}]}) of de compacte vorm
          {"dagen":[[datum,klikken,vertoningen,positie]], "zoekwoorden":[[woord,klikken,vertoningen,positie]], "paginas":[[url,klikken,vertoningen,positie]]}.
  --snel  techniekcheck op een steekproef van productpagina's (sneller).
Uitvoer: keurkamer/rapporten/sitewacht-JJJJ-MM-DD.md en keurkamer/wacht/sitewacht-laatste.json (voor de vergelijking volgende week).
Verandert niets aan de site."""
import json, os, re, sys, glob, gzip, datetime, collections, html, random
HIER = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(os.path.dirname(HIER))
KK = os.path.join(ROOT, 'keurkamer'); WACHT = os.path.join(KK, 'wacht'); RAP = os.path.join(KK, 'rapporten')
os.makedirs(WACHT, exist_ok=True); os.makedirs(RAP, exist_ok=True)
VANDAAG = datetime.date.today().isoformat()
SITE = 'https://leukekeuze.nl'
def lees(pad, leeg=None):
    try: return json.load(open(pad, encoding='utf-8'))
    except (FileNotFoundError, json.JSONDecodeError): return leeg
def arg(naam, standaard=None):
    return sys.argv[sys.argv.index(naam) + 1] if naam in sys.argv and sys.argv.index(naam) + 1 < len(sys.argv) else standaard
def pct(a, b): return (100.0 * a / b) if b else 0.0
def n(x): return format(int(round(x)), ',d').replace(',', '.')

acties = []   # (gewicht, wie, tekst)
def actie(gewicht, wie, tekst): acties.append((gewicht, wie, tekst))

# ======================================================================
# 1. GOOGLE (Search Console)
# ======================================================================
def laad_gsc(pad):
    d = lees(pad)
    if not d: return None
    g = {'bron': pad, 'dagen': [], 'zoekwoorden': [], 'paginas': [], 'periode': d.get('periode') or {}}
    if 'rows' in d:   # ruwe OpenSEO-uitvoer, één dimensie
        dim = (d.get('dimensions') or ['query'])[0]
        doel = {'date': 'dagen', 'query': 'zoekwoorden', 'page': 'paginas'}.get(dim, 'zoekwoorden')
        g[doel] = [[r['keys'][0], r.get('clicks', 0), r.get('impressions', 0), r.get('position', 0)] for r in d['rows']]
        g['periode'] = {'van': d.get('startDate'), 'tot': d.get('endDate')}
    else:
        for k in ('dagen', 'zoekwoorden', 'paginas'): g[k] = d.get(k) or []
        for k in ('zoekwoorden_totaal', 'paginas_totaal'): g[k] = d.get(k)
    return g

def google_sectie(g, vorige):
    r = []; cijfer = None; kern = {}
    if not g:
        r.append('Geen Search Console-bestand gevonden. Haal de cijfers op (OpenSEO: get_search_console_performance) en zet ze in keurkamer/wacht/gsc-' + VANDAAG + '.json.')
        return r, None, kern
    dagen = sorted(g['dagen'])
    kl = sum(x[1] for x in dagen); vt = sum(x[2] for x in dagen)
    if not dagen:
        kl = sum(x[1] for x in g['zoekwoorden']); vt = sum(x[2] for x in g['zoekwoorden'])
    pos_gew = sum(x[3] * x[2] for x in g['zoekwoorden']); pos = pos_gew / sum(x[2] for x in g['zoekwoorden']) if g['zoekwoorden'] else 0
    kern = {'klikken': kl, 'vertoningen': vt, 'positie': round(pos, 1), 'zoekwoorden': g.get('zoekwoorden_totaal') or len(g['zoekwoorden']), 'periode': g.get('periode')}
    per = g.get('periode') or {}
    r.append('Periode: %s t/m %s (Google loopt 2-3 dagen achter).' % (per.get('van', '?'), per.get('tot', '?')))
    r.append('- **%s klikken**, **%s vertoningen**, gemiddelde positie %.0f, gevonden op %s verschillende zoekwoorden.' % (n(kl), n(vt), pos, kern['zoekwoorden']))
    # trend: laatste 7 dagen tegenover de 7 daarvoor
    if len(dagen) >= 8:
        l7 = dagen[-7:]; v7 = dagen[-14:-7]
        kl7 = sum(x[1] for x in l7); vt7 = sum(x[2] for x in l7); klv = sum(x[1] for x in v7); vtv = sum(x[2] for x in v7)
        kern['laatste7'] = {'klikken': kl7, 'vertoningen': vt7}; kern['per_dag'] = round(kl7 / 7.0, 1)
        pijl = lambda a, b: ('↑ +%d%%' % round(pct(a - b, b))) if b and a > b else (('↓ %d%%' % round(pct(a - b, b))) if b and a < b else ('nieuw' if not b and a else '='))
        r.append('- Laatste 7 dagen: %d klikken (%s), %s vertoningen (%s). Gemiddeld **%.1f klikken per dag**.' % (kl7, pijl(kl7, klv), n(vt7), pijl(vt7, vtv), kl7 / 7.0))
        # mini-grafiek per dag
        mx = max(x[2] for x in dagen) or 1
        blok = ' ▁▂▃▄▅▆▇█'
        r.append('- Vertoningen per dag: `' + ''.join(blok[min(8, int(round(8.0 * x[2] / mx)))] for x in dagen) + '` (%s → %s)' % (dagen[0][0][5:], dagen[-1][0][5:]))
    if vorige and vorige.get('google'):
        vg = vorige['google']
        r.append('- Vorig rapport (%s): %s klikken, %s vertoningen, positie %s.' % (vorige.get('datum', '?'), n(vg.get('klikken', 0)), n(vg.get('vertoningen', 0)), vg.get('positie', '?')))
    # mijlpalen: eerlijk over "top 10 van Nederland"
    pd = kern.get('per_dag', kl / max(1, len(dagen) or 28))
    mijlpalen = [(10, 'eerste echte bezoekers uit Google'), (50, 'kleine cadeausite'), (250, 'bekende nichesite'), (1000, 'grote cadeausite'), (5000, 'top-25 van Nederland (schatting)')]
    volgende = next((m for m in mijlpalen if m[0] > pd), None)
    r.append('- Mijlpalen (klikken per dag uit Google): ' + ' → '.join(('**%d (%s)**' if m == volgende else '%d (%s)') % m for m in mijlpalen) + '. Nu: %.1f per dag.' % pd)
    # kansen
    zw = g['zoekwoorden']
    dichtbij = sorted([x for x in zw if 4 <= x[3] <= 20 and x[2] >= 2], key=lambda x: -x[2])[:12]
    if dichtbij:
        r.append(''); r.append('**Kansen: al op pagina 1-2, nog net geen klikken** (positie 4-20). Een betere titel, tekst of een gids kan deze omhoog duwen:')
        r += ['- "%s" — %s vertoningen, positie %.0f' % (x[0], n(x[2]), x[3]) for x in dichtbij]
        actie(70, 'Claude', 'Zoekwoorden die al op pagina 1-2 staan omhoog helpen: ' + ', '.join('"%s"' % x[0] for x in dichtbij[:4]) + ' (titel, tekst en interne links van de bijbehorende pagina verbeteren).')
    veraf = sorted([x for x in zw if x[3] > 25 and x[2] >= 5], key=lambda x: -x[2])[:10]
    if veraf:
        r.append(''); r.append('**Vraag is er, maar we staan ver weg** (positie > 25, 5+ vertoningen). Hier helpt alleen een echt goede pagina (gids met uitleg + de beste producten):')
        r += ['- "%s" — %s vertoningen, positie %.0f' % (x[0], n(x[2]), x[3]) for x in veraf]
        actie(60, 'samen', 'Gidsen bouwen of verbeteren voor zoekwoorden met vraag maar lage positie: ' + ', '.join('"%s"' % x[0] for x in veraf[:3]) + '.')
    pg = g['paginas']
    geen_klik = sorted([x for x in pg if x[2] >= 8 and x[1] == 0 and x[3] <= 15], key=lambda x: -x[2])[:8]
    if geen_klik:
        r.append(''); r.append("**Pagina's die Google wél toont (positie ≤ 15) maar niemand aanklikt** — titel en omschrijving aantrekkelijker maken:")
        r += ['- %s — %s vertoningen, positie %.0f' % (x[0].replace(SITE, ''), n(x[2]), x[3]) for x in geen_klik]
        actie(55, 'Claude', "Titels en omschrijvingen verbeteren van %d pagina's die getoond worden maar geen klikken krijgen (o.a. %s)." % (len(geen_klik), ', '.join(x[0].replace(SITE, '') for x in geen_klik[:2])))
    toppag = sorted([x for x in pg if x[1] > 0], key=lambda x: (-x[1], -x[2]))[:8]
    if toppag:
        r.append(''); r.append("**Pagina's met klikken:**")
        r += ['- %s — %d klik(ken), %s vertoningen, positie %.0f' % (x[0].replace(SITE, '') or '/', x[1], n(x[2]), x[3]) for x in toppag]
    http_pag = [x for x in pg if x[0].startswith('http://')]
    if http_pag: r.append(''); r.append('- Let op: %d pagina(\'s) komen in Google nog als http:// voor; de site moet overal naar https:// doorsturen.' % len(http_pag))
    # cijfer google: groei + positie
    cijfer = 2.0
    if kern.get('laatste7'):
        if kern['laatste7']['klikken'] > 0: cijfer += 2
        if kern.get('per_dag', 0) >= 5: cijfer += 1
        if kern.get('per_dag', 0) >= 25: cijfer += 2
        if kern.get('per_dag', 0) >= 100: cijfer += 2
    if pos and pos < 30: cijfer += 1
    return r, min(10, cijfer), kern

# ======================================================================
# 2. WINKEL (catalogus / keurkamer)
# ======================================================================
def winkel_sectie():
    r = []; C = lees(os.path.join(KK, 'data', 'catalogus.json'))
    if not C:
        r.append('Geen catalogus.json gevonden. Draai eerst: node scripts/keurkamer/effectief.js && python3 scripts/keurkamer/verzamel.py')
        return r, None, {}
    P = C['producten']; V = C['vakjes']; O = lees(os.path.join(KK, 'oordelen.json'), {}) or {}; AI = lees(os.path.join(KK, 'ai-oordelen.json'), {}) or {}
    namen = {v['vak']: v['naam'] for v in (lees(os.path.join(KK, 'vakjes.json')) or lees(os.path.join(KK, 'vakjes-lijst.json')) or [])}
    OUD = {'cadeaus/voor-haar', 'cadeaus/voor-hem', 'cadeaus/voor-kinderen', 'cadeaus/opa-oma', 'cadeaus/collega', 'cadeaus/baby-kraam'}
    echte = {v: x for v, x in V.items() if v not in OUD}
    kern = {'producten': len(P), 'vakjes': len(echte), 'gemaakt': C.get('gemaakt')}
    r.append('Stand van de catalogus (%s): **%s producten** live in **%d vakjes**; %s producten staan ook in een extra vakje.' % (str(C.get('gemaakt', ''))[:10], n(len(P)), len(echte), n(sum(len(x.get('ookIn', [])) for x in echte.values()))))
    # dunne en volle vakjes
    def aantal(x): return len(set(x.get('thuis', [])) | set(x.get('ookIn', [])))
    dun = sorted([(aantal(x), v) for v, x in echte.items() if aantal(x) < 6]); vol = sorted([(aantal(x), v) for v, x in echte.items() if aantal(x) > 120], reverse=True)
    kern['dun'] = len(dun); kern['vol'] = len(vol)
    if dun:
        r.append('- **%d vakjes zijn te dun** (minder dan 6 producten; een lege pagina maakt geen goede indruk): ' % len(dun) + ', '.join('%s (%d)' % (namen.get(v, v), a) for a, v in dun[:12]) + (' …' if len(dun) > 12 else ''))
        actie(65, 'samen', '%d te dunne vakjes aanvullen met goede producten of samenvoegen met een buurvakje: %s.' % (len(dun), ', '.join(namen.get(v, v) for a, v in dun[:5])))
    if vol:
        r.append('- %d vakjes zijn erg vol (meer dan 120 producten; keuzestress): ' % len(vol) + ', '.join('%s (%d)' % (namen.get(v, v), a) for a, v in vol[:8]))
        actie(35, 'Marius', 'Volle vakjes in de Keurkamer strenger keuren (alleen leuke keuzes laten staan): %s.' % ', '.join(namen.get(v, v) for a, v in vol[:4]))
    # prijsmix en winkelmix per vakje
    eenzijdig = []; eenwinkel = []
    for v, x in echte.items():
        ids = list(set(x.get('thuis', [])) | set(x.get('ookIn', [])))
        if len(ids) < 10: continue
        prijzen = [float(P[i].get('prijs') or 0) for i in ids if i in P]
        goedkoop = sum(1 for p in prijzen if 0 < p < 15); duur = sum(1 for p in prijzen if p > 50)
        if goedkoop == 0: eenzijdig.append((v, 'niets onder €15'))
        elif duur == 0 and max(prijzen or [0]) < 40: eenzijdig.append((v, 'niets boven €40'))
        shops = collections.Counter(P[i]['shop'] for i in ids if i in P)
        top, nt = shops.most_common(1)[0]
        if nt / float(len(ids)) > 0.7 and top not in ('bol',): eenwinkel.append((v, top, round(100.0 * nt / len(ids))))
    kern['eenzijdig'] = len(eenzijdig)
    if eenzijdig:
        r.append('- %d vakjes missen de mix van goedkoop en duur: ' % len(eenzijdig) + ', '.join('%s (%s)' % (namen.get(v, v), w) for v, w in eenzijdig[:10]) + (' …' if len(eenzijdig) > 10 else ''))
    if eenwinkel:
        r.append('- %d vakjes komen bijna helemaal uit één winkel: ' % len(eenwinkel) + ', '.join('%s (%s %d%%)' % (namen.get(v, v), s, p) for v, s, p in eenwinkel[:8]))
    # vlaggen
    vl = C.get('vlaggen') or {}
    info = {'verplaatst-door-indeling', 'daisycon-pauze', 'geen-voor'}
    probleem = {k: c for k, c in vl.items() if k not in info and c}
    kern['vlaggen'] = probleem
    uitleg = {'dubbel': 'dubbele producten', 'lijkt-dubbel': 'lijken dubbel', 'geen-echt-vakje': 'zonder echt vakje (oude persoon-vakjes)', 'tekst-kort': 'te korte tekst', 'titel-engels': 'Engelse titel', 'foto-klein': 'te kleine foto',
             'foto-wazig': 'wazige foto', 'foto-leeg': 'bijna lege foto', 'link-geen-partner': 'link zonder partnercode (geen commissie)', 'christelijk-twijfel': 'christelijk-twijfel', 'drank-buiten-dranken': 'drank buiten Dranken', 'kaars-buiten-kaarsen': 'kaars buiten Kaarsen',
             'titel-kort': 'te korte titel', 'titel-lang': 'te lange titel', 'prijs-nul': 'prijs 0', 'oude-prijs-fout': 'oude prijs fout', 'foto-ontbreekt': 'foto ontbreekt', 'mijn-hummeltje': 'Mijn Hummeltje', 'christelijk-buiten-christelijk': 'christelijk buiten Christelijk', 'tekst-engels': 'Engelse tekst', 'titel-rommel': 'rommel in titel', 'tekst-is-titel': 'tekst is gelijk aan titel'}
    if probleem:
        r.append('- Regelmotor, open punten: ' + ', '.join('%s %s' % (c, uitleg.get(k, k)) for k, c in sorted(probleem.items(), key=lambda x: -x[1])))
    dubbel = vl.get('dubbel', 0); geenvak = vl.get('geen-echt-vakje', 0)
    if dubbel: actie(60, 'Marius', '%d dubbele producten samenvoegen tot één product met keuzes (in de Keurkamer: filter "dubbel", knop "Die weg").' % dubbel)
    if geenvak: actie(58, 'Marius', '%d producten zonder echt vakje een plek geven (Keurkamer, afdeling "Nog indelen": Verplaatsen of Weg).' % geenvak)
    for k, gew, wie, tekst in (('link-geen-partner', 50, 'Claude', 'links zonder partnercode repareren (anders geen commissie)'), ('titel-engels', 30, 'Claude', 'Engelse titels vertalen'), ('foto-klein', 25, 'Claude', 'te kleine foto\'s vervangen door een grotere uit de feed'), ('tekst-kort', 28, 'Claude', 'te korte teksten herschrijven')):
        if probleem.get(k): actie(gew, wie, '%d %s.' % (probleem[k], tekst))
    # keurkamer-voortgang
    klaar = sum(1 for v, s in (O.get('vakjes') or {}).items() if s.get('status') == 'klaar'); beoordeeld = len(O.get('producten') or {})
    kern['keurkamer'] = {'vakjes_klaar': klaar, 'producten_beoordeeld': beoordeeld, 'weg': sum(1 for x in (O.get('producten') or {}).values() if x.get('oordeel') == 'weg')}
    r.append('- Keurkamer: **%d van %d vakjes klaar**, %s producten door Marius beoordeeld, %d weggehaald.' % (klaar, len(echte), n(beoordeeld), kern['keurkamer']['weg']))
    if klaar < len(echte): actie(80 if klaar == 0 else 45, 'Marius', 'Keurkamer: %d vakjes wachten nog op keuring (begin met de vakjes die bovenaan staan bij "aandacht").' % (len(echte) - klaar))
    # AI-advies
    if AI:
        weg = verpl = twijfel = 0; per_vak = collections.Counter(); leuk = []
        for pid, a in AI.items():
            if a.get('leuk') is not None: leuk.append(a['leuk'])
            for vak, o in (a.get('vak') or {}).items():
                adv = o.get('advies')
                if adv == 'weg': weg += 1; per_vak[vak] += 1
                elif adv == 'verplaatsen': verpl += 1
                elif adv == 'twijfel': twijfel += 1
        kern['ai'] = {'beoordeeld': len(AI), 'weg': weg, 'verplaatsen': verpl, 'twijfel': twijfel, 'leuk_gem': round(sum(leuk) / len(leuk), 1) if leuk else None}
        r.append('- AI-keurmeester: %s producten vooraf beoordeeld; advies **weg: %d**, verplaatsen: %d, twijfel: %d; gemiddeld leuk-cijfer %s/100.' % (n(len(AI)), weg, verpl, twijfel, kern['ai']['leuk_gem']))
        if per_vak: r.append('  Meeste weg-adviezen in: ' + ', '.join('%s (%d)' % (namen.get(v, v), c) for v, c in per_vak.most_common(6)))
    # nieuw de laatste 30 dagen
    grens = (datetime.date.today() - datetime.timedelta(days=7)).isoformat()
    nieuw = sum(1 for p in P.values() if str(p.get('sinds') or '') >= grens)
    kern['nieuw7'] = nieuw
    r.append('- Nieuw op de site in de laatste 7 dagen: %s producten.' % n(nieuw))
    # cijfer winkel
    cijfer = 10.0
    cijfer -= min(2, len(dun) / 10.0); cijfer -= min(2, (dubbel + vl.get('lijkt-dubbel', 0)) / 100.0); cijfer -= min(1.5, geenvak / 150.0)
    cijfer -= min(1.5, sum(c for k, c in probleem.items() if k not in ('dubbel', 'lijkt-dubbel', 'geen-echt-vakje')) / 300.0)
    cijfer -= 2.0 * (1 - min(1.0, klaar / float(max(1, len(echte)))))   # keuring: 0 klaar = -2, alles klaar = 0
    return r, max(0, round(cijfer, 1)), kern

# ======================================================================
# 3. TECHNIEK (gebouwde pagina's)
# ======================================================================
BEWUST_CANON = {'/collectie/grappige-cadeaus/'}  # 8-11-2026 GO Marius: wijst bewust naar /c/cadeaus/grappig/ (zie HOOFDPAGINA in maak-paginas.js)
RE_TITLE = re.compile(r'<title>(.*?)</title>', re.S); RE_DESC = re.compile(r'<meta name="description" content="([^"]*)"'); RE_CANON = re.compile(r'<link rel="canonical" href="([^"]*)"')
RE_H1 = re.compile(r'<h1[^>]*>(.*?)</h1>', re.S); RE_HREF = re.compile(r'href="([^"#]*)"'); RE_SRC = re.compile(r'(?:src|data-src)="([^"]*)"'); RE_ROBOTS = re.compile(r'<meta name="robots" content="([^"]*)"'); RE_LD = re.compile(r'application/ld\+json')
OVERSLAAN = {'assets', 'images', 'scripts', 'keurkamer', 'node_modules', '.git', 'pins', 'tools', '.github'}
def bestand_voor(pad):
    """Zet een sitepad (/c/hobby/) om in een bestand in de repo; None als het niet bestaat."""
    p = pad.split('?')[0]
    if p.startswith(SITE): p = p[len(SITE):]
    if p.startswith('http'): return 'extern'
    if not p.startswith('/'): p = '/' + p
    p = p.strip('/')
    kandidaten = [os.path.join(ROOT, p, 'index.html') if p else os.path.join(ROOT, 'index.html'), os.path.join(ROOT, p), os.path.join(ROOT, p + '.html')]
    for k in kandidaten:
        if os.path.isfile(k): return k
    return None
def techniek_sectie(snel):
    r = []; paginas = []
    for map_, dirs, files in os.walk(ROOT):
        rel = os.path.relpath(map_, ROOT)
        dirs[:] = [d for d in dirs if not (rel == '.' and d in OVERSLAAN) and d != '.git']
        for f in files:
            if f.endswith('.html') and f not in ('sjabloon.html', '404.html') and not (rel == 'keurkamer' or rel.startswith('keurkamer')): paginas.append(os.path.join(map_, f))
    soort = collections.Counter(); prod = [p for p in paginas if os.path.relpath(p, ROOT).startswith('p' + os.sep)]; overig = [p for p in paginas if p not in set(prod)]
    if snel and len(prod) > 400: random.seed(VANDAAG); prod = random.sample(prod, 400)
    te_checken = overig + prod
    fouten = collections.defaultdict(list); titels = collections.defaultdict(list); descs = collections.defaultdict(list); links = {}; link_bron = {}; fotos_missen = []; groot = []
    noindex = 0; zonder_ld = 0; canon_fout = 0; totaal_bytes = 0; doorstuur = 0; verhuisd_paden = set()
    for pad in te_checken:
        rel = '/' + os.path.relpath(pad, ROOT).replace(os.sep, '/'); rel = rel[:-len('index.html')] if rel.endswith('/index.html') else rel
        soort[rel.split('/')[1] or 'home'] += 1
        try: h = open(pad, encoding='utf-8', errors='replace').read()
        except Exception as e: fouten['onleesbaar'].append(rel); continue
        totaal_bytes += len(h)
        if 'data-verhuisd' in h[:200] or 'http-equiv="refresh"' in h[:1500]:
            doorstuur += 1; verhuisd_paden.add(pad); continue   # doorstuurpagina (oude url -> nieuwe), hoort geen titel/h1 te hebben
        if len(h) > 120000: groot.append((len(h), rel))
        t = RE_TITLE.search(h); d = RE_DESC.search(h); c = RE_CANON.search(h); h1 = RE_H1.search(h)
        if not t or not html.unescape(t.group(1)).strip(): fouten['geen titel'].append(rel)
        else:
            tt = html.unescape(t.group(1)).strip(); titels[tt].append(rel)
            if len(tt) > 70: fouten['titel te lang (>70)'].append(rel)
        if not d or not d.group(1).strip(): fouten['geen omschrijving'].append(rel)
        else:
            dd = html.unescape(d.group(1)).strip(); descs[dd].append(rel)
            if len(dd) < 50: fouten['omschrijving te kort (<50)'].append(rel)
            elif len(dd) > 170: fouten['omschrijving te lang (>170)'].append(rel)
        if not c: fouten['geen canonical'].append(rel)
        elif c.group(1).rstrip('/') != (SITE + rel).rstrip('/') and rel.rstrip('/') + '/' not in BEWUST_CANON: canon_fout += 1; fouten['canonical wijst ergens anders heen'].append(rel + ' -> ' + c.group(1))
        if not h1 or not re.sub('<[^>]+>', '', h1.group(1)).strip(): fouten['geen h1'].append(rel)
        rb = RE_ROBOTS.search(h)
        if rb and 'noindex' in rb.group(1): noindex += 1
        if rel.startswith('/p/') and not RE_LD.search(h): zonder_ld += 1
        for u in set(RE_HREF.findall(h)):
            if u.startswith(('mailto:', 'tel:', 'javascript:')) or u.startswith('//'): continue
            if u.startswith('http') and not u.startswith(SITE): continue
            if u not in links: links[u] = bestand_voor(u); link_bron[u] = rel
        if rel.startswith('/p/'):
            for s in set(RE_SRC.findall(h)):
                if s.startswith('images/producten/') and not os.path.isfile(os.path.join(ROOT, s)): fotos_missen.append((rel, s))
    kapot = sorted(u for u, b in links.items() if b is None)
    dubbel_titel = {t: ps for t, ps in titels.items() if len(ps) > 1}; dubbel_desc = {t: ps for t, ps in descs.items() if len(ps) > 1}
    kern = {'paginas': len(paginas), 'doorstuur': doorstuur, 'gecheckt': len(te_checken), 'kapotte_links': len(kapot), 'fotos_missen': len(fotos_missen), 'dubbele_titels': len(dubbel_titel), 'dubbele_omschrijvingen': len(dubbel_desc), 'fouten': {k: len(v) for k, v in fouten.items()}, 'noindex': noindex, 'zonder_ld': zonder_ld}
    r.append("**%s pagina's** in de repo (%s), %s gecontroleerd%s; %s daarvan zijn doorstuurpagina's (oude adressen en weggehaalde producten)." % (n(len(paginas)), ', '.join('%s %s' % (n(c), k) for k, c in soort.most_common(6)), n(len(te_checken)), ' (steekproef van de productpagina\'s)' if snel else '', n(doorstuur)))
    if not fouten and not kapot and not fotos_missen: r.append("- Titels, omschrijvingen, canonicals en h1's: in orde op alle gecontroleerde pagina's.")
    for k, v in sorted(fouten.items(), key=lambda x: -len(x[1])):
        r.append('- %s: %s pagina\'s, bijv. %s' % (k, n(len(v)), ', '.join(v[:3])))
        if k in ('geen titel', 'geen omschrijving', 'geen canonical', 'geen h1', 'canonical wijst ergens anders heen'): actie(75, 'Claude', '%s pagina\'s met "%s" repareren in de paginabouwer.' % (n(len(v)), k))
        elif len(v) > 20: actie(30, 'Claude', '%s pagina\'s: %s (sjabloon aanpassen).' % (n(len(v)), k))
    if dubbel_titel:
        r.append("- Dubbele titels: %d titels komen op meer pagina's voor, bijv. \"%s\" (%d pagina's)." % (len(dubbel_titel), list(dubbel_titel.items())[0][0][:60], len(list(dubbel_titel.values())[0])))
        if len(dubbel_titel) > 5: actie(40, 'Claude', '%d dubbele paginatitels uniek maken.' % len(dubbel_titel))
    if dubbel_desc: r.append("- Dubbele omschrijvingen: %d." % len(dubbel_desc))
    if kapot:
        r.append('- **Kapotte interne links: %d** (doel bestaat niet), bijv. ' % len(kapot) + ', '.join('%s (op %s)' % (u, link_bron[u]) for u in kapot[:6]))
        actie(85, 'Claude', '%d kapotte interne links repareren (bijv. %s).' % (len(kapot), ', '.join(kapot[:3])))
    if fotos_missen:
        r.append('- Productfoto\'s die ontbreken in images/producten: %d, bijv. %s' % (len(fotos_missen), ', '.join(s for _, s in fotos_missen[:4])))
        actie(70, 'Claude', '%d ontbrekende productfoto\'s opnieuw ophalen.' % len(fotos_missen))
    if noindex: r.append("- Pagina's met noindex: %d." % noindex)
    if zonder_ld: r.append("- Productpagina's zonder gestructureerde data (JSON-LD): %d." % zonder_ld)
    if groot: r.append("- Grote pagina's (>120 kB html): %d, grootste %s (%s kB)." % (len(groot), max(groot)[1], n(max(groot)[0] / 1024)))
    # sitemap en robots
    sm = os.path.join(ROOT, 'sitemap.xml'); sm_fout = []; sm_n = 0
    if os.path.isfile(sm):
        locs = re.findall(r'<loc>(.*?)</loc>', open(sm, encoding='utf-8').read()); sm_n = len(locs)
        sm_fout = [u for u in locs if bestand_voor(u) in (None,)]
        in_sm = {u.replace(SITE, '').rstrip('/') for u in locs}
        def is_verhuisd(pad):
            if pad in verhuisd_paden: return True
            try: return 'data-verhuisd' in open(pad, encoding='utf-8', errors='replace').read(300)
            except Exception: return False
        niet_in = [(('/' + os.path.relpath(p, ROOT).replace(os.sep, '/')).replace('/index.html', '').rstrip('/'), p) for p in paginas]
        niet_in = [u for u, p in niet_in if u not in in_sm and not u.startswith(('/info', '/zoek', '/lijst', '/favorieten', '/privacy', '/cadeauzoeker')) and not is_verhuisd(p)]
        r.append('- Sitemap: %s adressen%s%s.' % (n(sm_n), (', **%d wijzen naar een pagina die niet bestaat**' % len(sm_fout)) if sm_fout else '', (', %d pagina\'s staan er niet in' % len(niet_in)) if niet_in else ''))
        if sm_fout: actie(65, 'Claude', '%d sitemap-adressen zonder pagina opruimen (bijv. %s).' % (len(sm_fout), sm_fout[0]))
        if len(niet_in) > 50: actie(35, 'Claude', "%d pagina's ontbreken in de sitemap (bijv. %s)." % (len(niet_in), niet_in[0]))
        kern['sitemap'] = sm_n; kern['sitemap_fout'] = len(sm_fout); kern['niet_in_sitemap'] = len(niet_in)
    else: r.append('- **Geen sitemap.xml!**'); actie(90, 'Claude', 'sitemap.xml ontbreekt.')
    rb = os.path.join(ROOT, 'robots.txt')
    if not os.path.isfile(rb) or 'Sitemap:' not in open(rb, encoding='utf-8').read(): r.append('- robots.txt mist of verwijst niet naar de sitemap.'); actie(50, 'Claude', 'robots.txt met Sitemap-regel maken.')
    for f in ('404.html', 'CNAME'):
        if not os.path.isfile(os.path.join(ROOT, f)): r.append('- %s ontbreekt.' % f)
    # zwaarte: scripts die elke pagina laadt
    home = open(os.path.join(ROOT, 'index.html'), encoding='utf-8', errors='replace').read() if os.path.isfile(os.path.join(ROOT, 'index.html')) else ''
    scripts = [s.split('?')[0] for s in re.findall(r'<script[^>]*src="([^"]+)"', home) if not s.startswith(('http', '//'))]
    css = [s.split('?')[0] for s in re.findall(r'<link rel="stylesheet"[^>]*href="([^"]+)"', home) if not s.startswith(('http', '//'))]
    def gz(pad):
        try: b = open(os.path.join(ROOT, pad), 'rb').read(); return len(b), len(gzip.compress(b, 6))
        except Exception: return 0, 0
    zwaar = [(s,) + gz(s) for s in scripts + css]; tot_raw = sum(x[1] for x in zwaar); tot_gz = sum(x[2] for x in zwaar)
    kern['js_css_kb'] = round(tot_raw / 1024); kern['js_css_gz_kb'] = round(tot_gz / 1024)
    zwaarste = sorted(zwaar, key=lambda x: -x[2])[:3]
    r.append('- Elke pagina laadt %s kB aan scripts en stijlen (%s kB gezipt): ' % (n(tot_raw / 1024), n(tot_gz / 1024)) + ', '.join('%s %s kB' % (os.path.basename(s), n(g / 1024)) for s, w, g in zwaarste) + '.')
    if tot_gz > 400 * 1024:
        r.append('  Dat is zwaar voor telefoons (Google kijkt naar laadsnelheid). Richtlijn: onder de 300 kB gezipt.')
        actie(50, 'Claude', "Pagina's lichter maken: de productlijst (%s kB gezipt, laadt al async) opsplitsen per vakje zodat een telefoon alleen laadt wat hij nodig heeft (grotere klus, plannen)." % n(max(zwaar, key=lambda x: x[2])[2] / 1024))
    # cijfer techniek
    cijfer = 10.0
    cijfer -= min(3, (fouten.get('geen titel', []).__len__() + len(fouten.get('geen omschrijving', [])) + len(fouten.get('geen canonical', [])) + len(fouten.get('geen h1', []))) / 20.0)
    cijfer -= min(2, len(kapot) / 10.0); cijfer -= min(1.5, len(fotos_missen) / 20.0); cijfer -= min(1, len(sm_fout) / 20.0)
    cijfer -= 2 if tot_gz > 800 * 1024 else (1 if tot_gz > 400 * 1024 else 0); cijfer -= min(1, len(dubbel_titel) / 50.0)
    return r, max(0, round(cijfer, 1)), kern

# ======================================================================
# 4. FEEDS (wacht.py), als die gedraaid is
# ======================================================================
def feeds_sectie():
    w = lees(os.path.join(WACHT, 'wacht-laatste.json'))
    if not w: return ['Nog geen feedcontrole (scripts/keurkamer/wacht.py draait op de laptop, waar de feeds staan).'], None
    s = w.get('samenvatting', {}); r = ['Laatste feedcontrole: %s. %s producten teruggevonden in de feeds.' % (str(w.get('gemaakt', ''))[:16], n(s.get('gecontroleerd', 0)))]
    if s.get('uitverkocht'): r.append('- **%d producten zijn uitverkocht / niet leverbaar**: ' % s['uitverkocht'] + ', '.join(x['titel'][:40] for x in w['uitverkocht'][:5])); actie(78, 'Claude', '%d uitverkochte producten verbergen (status wachten) en bij terugkeer weer tonen.' % s['uitverkocht'])
    if s.get('prijsVeranderd'): r.append('- %d producten met een prijsverschil van 10%% of meer: ' % s['prijsVeranderd'] + ', '.join('%s (€%s → €%s)' % (x['titel'][:30], x['oud'], x['nieuw']) for x in w['prijs'][:5])); actie(55, 'Claude', '%d prijzen bijwerken uit de feeds.' % s['prijsVeranderd'])
    if s.get('nietInFeed'): r.append('- %d producten staan niet meer in de feed van de winkel (mogelijk uit het assortiment): ' % s['nietInFeed'] + ', '.join(x['titel'][:35] for x in w['nietInFeed'][:5])); actie(45, 'Claude', '%d producten die uit de feeds verdwenen zijn nakijken.' % s['nietInFeed'])
    return r, s

# ======================================================================
def main():
    snel = '--snel' in sys.argv
    gsc_pad = arg('--gsc') or (sorted(glob.glob(os.path.join(WACHT, 'gsc-*.json')))[-1:] or [None])[0]
    vorige = lees(os.path.join(WACHT, 'sitewacht-laatste.json'))
    if vorige and vorige.get('datum') == VANDAAG: vorige = lees(os.path.join(WACHT, 'sitewacht-vorige.json'))
    g_r, g_c, g_k = google_sectie(laad_gsc(gsc_pad) if gsc_pad else None, vorige)
    w_r, w_c, w_k = winkel_sectie()
    t_r, t_c, t_k = techniek_sectie(snel)
    f_r, f_k = feeds_sectie()
    cijfers = [c for c in (g_c, w_c, t_c) if c is not None]
    totaal = round(sum(cijfers) / len(cijfers), 1) if cijfers else None
    acties.sort(key=lambda x: -x[0]); top = acties[:10]
    uit = ['# Sitewacht LeukeKeuze — ' + VANDAAG, '']
    uit.append('## In één oogopslag')
    if totaal is not None:
        uit.append('**Sitecijfer: %s / 10**  (Google %s · Winkel %s · Techniek %s)%s' % (totaal, g_c if g_c is not None else '-', w_c if w_c is not None else '-', t_c if t_c is not None else '-', ('  — vorige keer %s' % vorige.get('cijfer')) if vorige and vorige.get('cijfer') is not None else ''))
    if g_k.get('klikken') is not None: uit.append('- Google: %s klikken en %s vertoningen in de periode, %s klikken per dag de laatste week.' % (n(g_k['klikken']), n(g_k['vertoningen']), g_k.get('per_dag', '?')))
    if w_k.get('producten'): uit.append('- Winkel: %s producten in %d vakjes; %d te dun; Keurkamer %d vakjes klaar.' % (n(w_k['producten']), w_k['vakjes'], w_k.get('dun', 0), (w_k.get('keurkamer') or {}).get('vakjes_klaar', 0)))
    if t_k.get('paginas'): uit.append("- Techniek: %s pagina's; %d kapotte links; %d ontbrekende foto's; %s kB scripts per pagina (gezipt)." % (n(t_k['paginas']), t_k['kapotte_links'], t_k['fotos_missen'], n(t_k.get('js_css_gz_kb', 0))))
    uit.append(''); uit.append('## Top 10 acties deze week')
    for i, (gew, wie, tekst) in enumerate(top, 1): uit.append('%d. **[%s]** %s' % (i, wie, tekst))
    if not top: uit.append('Geen open acties gevonden.')
    uit += ['', '## 1. Google'] + g_r + ['', '## 2. Winkel (catalogus en Keurkamer)'] + w_r + ['', '## 3. Techniek'] + t_r + ['', '## 4. Feeds van de winkels'] + f_r
    uit += ['', '## Eerlijk over de top 10 van Nederland',
            'Een plek bij de grootste cadeausites van Nederland is niet iets wat je in een paar weken haalt: die sites bestaan jaren en krijgen duizenden bezoekers per dag uit Google. ',
            'Wat wél werkt, stap voor stap: (1) alleen leuke keuzes op de site (Keurkamer), (2) elke week een paar gidsen die een echte vraag beantwoorden, (3) snelle, foutloze pagina\'s, (4) elke week dit rapport lezen en de top-acties doen. ',
            'De mijlpalen hierboven (klikken per dag) laten zien waar we staan. Dit rapport meet het elke week opnieuw, zodat we zien of het werkt.', '',
            '_Gemaakt door scripts/keurkamer/sitewacht.py. Google-bron: %s._' % (os.path.basename(gsc_pad) if gsc_pad else 'geen')]
    tekst = '\n'.join(uit)
    open(os.path.join(RAP, 'sitewacht-' + VANDAAG + '.md'), 'w', encoding='utf-8').write(tekst + '\n')
    if vorige and vorige.get('datum') != VANDAAG: json.dump(vorige, open(os.path.join(WACHT, 'sitewacht-vorige.json'), 'w', encoding='utf-8'), ensure_ascii=False)
    json.dump({'datum': VANDAAG, 'cijfer': totaal, 'cijfers': {'google': g_c, 'winkel': w_c, 'techniek': t_c}, 'google': g_k, 'winkel': w_k, 'techniek': t_k, 'feeds': f_k, 'acties': [{'wie': w, 'tekst': t} for _, w, t in top]},
              open(os.path.join(WACHT, 'sitewacht-laatste.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(tekst); print('\n-> keurkamer/rapporten/sitewacht-%s.md' % VANDAAG)
if __name__ == '__main__': main()
