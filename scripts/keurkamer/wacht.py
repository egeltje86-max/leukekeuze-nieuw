"""Keurkamer, bewaking: vergelijkt de producten die live staan met de laatste feeds van de winkels.
Vindt: prijs veranderd, uitverkocht / niet leverbaar, niet meer in de feed, en producten die eerder weg zijn gedaan
maar opnieuw in een ronde zouden kunnen opduiken (zwarte lijst). Alleen lezen; verandert niets aan de site.

Draait op de laptop van Marius (daar staan de feeds) of hier met gekopieerde feeds:
  python wacht.py [--bol-feeds <map>] [--tt-feeds <map>] [--uit <map>]
Standaard: %USERPROFILE%/Documents/LeukeKeuze-Bol/feeds en %USERPROFILE%/Documents/zoekindex-feeds.
Uitvoer: <uit>/wacht-JJJJ-MM-DD.json en wacht-laatste.json (de Keurkamer-app en het sitewacht-rapport lezen die)."""
import json, os, re, sys, csv, gzip, glob, datetime, hashlib, collections, urllib.parse
HIER = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(os.path.dirname(HIER))
csv.field_size_limit(10 ** 9)
def arg(naam, standaard):
    if naam in sys.argv: return sys.argv[sys.argv.index(naam) + 1]
    return standaard
HOME = os.environ.get('USERPROFILE') or os.path.expanduser('~')
BOL = arg('--bol-feeds', os.path.join(HOME, 'Documents', 'LeukeKeuze-Bol', 'feeds'))
TTF = arg('--tt-feeds', os.path.join(HOME, 'Documents', 'zoekindex-feeds'))
# 21-11-2026 (opdracht Marius: 'alle lijsten van producten goed nakijken, prijs en of het product nog beschikbaar is'):
# ook de feeds van de Superkeurkamer (elke ochtend om 05:10 ververst, ruim 300 winkels) als extra bron, voor winkels die niet in de ochtendrun zitten.
SKK = arg('--skk-map', os.path.join(HOME, 'Desktop', 'Superkeurkamer LeukeKeuze', 'data', 'p'))
# 21-11-2026: producten die de dagelijkse controle zelf op uitverkocht zette (bol had geen aanbod meer, of de feed zei 'niet op voorraad').
# Staan ze weer leverbaar in een feed, dan meldt wacht.py ze onder 'terug' en zet nazorg.py ze weer op de site.
AUTO = arg('--auto-uit', os.path.join(ROOT, 'scripts', 'keurkamer', 'auto-uitverkocht.json'))
try: AU = json.load(open(AUTO, encoding='utf-8')).get('producten', {})
except Exception: AU = {}
UIT = arg('--uit', os.path.join(ROOT, 'keurkamer', 'wacht')); os.makedirs(UIT, exist_ok=True)
bron = os.path.join(ROOT, 'keurkamer', 'data', 'producten-effectief.json')
bron = arg('--producten', bron)  # 8-11-2026: een opgegeven bestand gaat altijd voor
E = json.load(open(bron, encoding='utf-8')); P = E['producten']
vandaag = datetime.date.today().isoformat()
uit = {'gemaakt': datetime.datetime.now().isoformat(timespec='minutes'), 'prijs': [], 'uitverkocht': [], 'nietInFeed': [], 'gecontroleerd': 0, 'bronnen': [], 'terug': []}

def prijsverschil(pid, oud, nieuw, exact=False):
    try: oud = float(oud); nieuw = float(nieuw)
    except (TypeError, ValueError): return
    # 21-11-2026: bij bol is de feedregel precies het product van de link, dus elke afwijking telt (exact). Anders 10%.
    if oud > 0 and ((exact and abs(nieuw - oud) >= 0.01) or abs(nieuw - oud) / oud >= 0.10):
        r = {'id': pid, 'titel': P[pid]['titel'][:70], 'oud': oud, 'nieuw': round(nieuw, 2)}
        if exact: r['exact'] = True
        uit['prijs'].append(r)
def feed_datum(f):
    try: return datetime.date.fromtimestamp(os.path.getmtime(f)).isoformat()
    except Exception: return vandaag
uit['feedDatum'] = {}

# ---- bol ----
# 8-11-2026: alleen producten die nog echt naar bol linken (sinds 7-11 linken veel bol-ids naar een partner)
# 21-11-2026 (controle partnerlinks): zoek op het productnummer in de LINK, want dat is wat de klant krijgt. Eerst op het id
# (bol-<productId>): ruim 800 producten met een ander id (999g-, dgsw-, cl-...) linken naar bol en werden nooit nagekeken,
# en bij 6 bol-ids wees de link naar een ander product dan het id (andere maat), terwijl de prijs van het id kwam.
def bol_nr(u):
    u = urllib.parse.unquote(urllib.parse.unquote(str(u or '')))
    m = re.search(r'bol\.com/nl/nl/p/[^/?#]*/(\d{9,16})', u)
    return m.group(1) if m else None
bol_ids = collections.defaultdict(list)
for pid in P:
    u = P[pid].get('url') or ''
    if 'bol.com' not in u: continue
    nr = bol_nr(u) or (pid[4:] if pid.startswith('bol-') else None)
    if nr: bol_ids[nr].append(pid)
au_bol = {}
for pid, a in AU.items():
    if a.get('bron') == 'bol' and a.get('nr') and pid not in P: au_bol.setdefault(str(a['nr']), []).append(pid)
gevonden = set(); terug_gezien = set()
feeds = sorted(glob.glob(os.path.join(BOL, 'product-feed_*-v2.csv.gz')))
uit['bolFeeds'] = {'aantal': len(feeds), 'oudste': min((feed_datum(f) for f in feeds), default=''), 'nieuwste': max((feed_datum(f) for f in feeds), default=''), 'producten': sum(len(v) for v in bol_ids.values())}
if feeds and bol_ids:
    for f in feeds:
        print('bol-feed', os.path.basename(f), flush=True); uit['bronnen'].append(os.path.basename(f)); fdat = feed_datum(f)
        try:
            # snel: productId is de eerste kolom ("9300000026539489"|...). Alleen regels van onze producten echt parsen.
            with gzip.open(f, 'rt', encoding='utf-8', errors='replace', newline='') as h:
                kop = next(csv.reader([h.readline()], delimiter='|'))
                i_prijs = kop.index('OfferNL.sellingPrice') if 'OfferNL.sellingPrice' in kop else -1
                i_lever = kop.index('OfferNL.isDeliverable') if 'OfferNL.isDeliverable' in kop else -1
                for regel in h:
                    if not regel.startswith('"'): continue
                    e = regel.find('"', 1); bid = regel[1:e]
                    pids = [x for x in bol_ids.get(bid, ()) if x not in gevonden]
                    terug = [x for x in au_bol.get(bid, ()) if x not in terug_gezien]
                    if not pids and not terug: continue
                    try: row = next(csv.reader([regel], delimiter='|'))
                    except Exception: continue
                    for pid in terug:
                        terug_gezien.add(pid)
                        lever = i_lever < 0 or i_lever >= len(row) or (row[i_lever] or '').upper() == 'Y'
                        try: pr = round(float((row[i_prijs] or '0').replace(',', '.')), 2) if 0 <= i_prijs < len(row) else 0
                        except ValueError: pr = 0
                        if lever and pr > 0: uit['terug'].append({'id': pid, 'prijs': pr, 'bron': 'bol', 'feedDatum': fdat})
                    for pid in pids:
                        gevonden.add(pid); uit['feedDatum'][pid] = fdat
                        if i_prijs >= 0 and i_prijs < len(row): prijsverschil(pid, P[pid]['prijs'], (row[i_prijs] or '0').replace(',', '.'), exact=True)
                        if i_lever >= 0 and i_lever < len(row) and (row[i_lever] or '').upper() != 'Y': uit['uitverkocht'].append({'id': pid, 'titel': P[pid]['titel'][:70], 'bron': 'bol', 'nr': bid})
        except Exception as e:
            print('fout bij', f, e)
    uit['gecontroleerd'] += len(gevonden)
    uit['bolFeeds']['gevonden'] = len(gevonden)
    for b, pids in bol_ids.items():
        for pid in pids:
            if pid not in gevonden: uit['nietInFeed'].append({'id': pid, 'titel': P[pid]['titel'][:70], 'bron': 'bol', 'nr': b, 'uitLink': bool(bol_nr(P[pid].get('url')))})
else:
    print('geen bol-feeds gevonden in', BOL)

# ---- TradeTracker en Daisycon: id = prefix + md5(link)[:10], of dezelfde winkelpagina ----
def url_sleutel(u): return re.sub(r'/+$', '', re.sub(r'[?#].*$', '', str(u or '').lower()))
def netwerk(u):
    u = str(u or '')
    if 'partner.bol.com' in u or 'bol.com' in u: return 'bol'
    if re.search(r'tradetracker|[?&]tt=\d+_|a=516846|//partner\.', u): return 'tradetracker'
    if re.search(r'^https?://(lt45|fr135|bdt9|glp8|ds1|jdt8|rkn3|jf79)\.n[le]t?/c/|aff\.svinando', u): return 'daisycon'
    if 'awin1.com' in u: return 'awin'
    return 'direct'
tt_live = {pid: p for pid, p in P.items() if (p.get('netwerk') or netwerk(p.get('url'))) in ('tradetracker', 'daisycon', 'awin')}
# 22-11-2026 (controle van de site): alleen een gewoon winkeladres dat bij precies één product hoort. Eerder stond hier ook de
# partnerlink als 'winkeladres' (https://ds1.nl/c, https://lt45.net/c, .../tradetracker ...). Elke Daisycon-feedregel zonder eigen
# winkeladres kwam dan bij dat ene product uit: zo kreeg de 'Zen Again'-set (9,95) de prijs van een belevenis van Doenkado (89),
# en vonden de Lamborghini-race en 16 andere belevenissen hun eigen feedregel nooit terug (geen verse prijs, 'ca.' op de site).
_url_tel = collections.Counter(url_sleutel(p['winkelUrl']) for p in tt_live.values() if p.get('winkelUrl'))
per_url = {url_sleutel(p['winkelUrl']): pid for pid, p in tt_live.items()
           if p.get('winkelUrl') and netwerk(p['winkelUrl']) == 'direct' and _url_tel[url_sleutel(p['winkelUrl'])] == 1}
per_md5 = {pid.split('-', 1)[1]: pid for pid in tt_live if '-' in pid}
# 8-11-2026: Awin (Coolblue, EMP, s.Oliver...) herkennen we aan het productnummer p= in de awin-link
def awin_p(u):
    m = re.search(r'awin1\.com/pclick\.php\?(?:.*&)?p=(\d+)', str(u or ''))
    return m.group(1) if m else None
per_awin = {awin_p(p['url']): pid for pid, p in tt_live.items() if awin_p(p['url'])}
# 13-11-2026 (grote keuring): ook terugvinden op het pad van de winkelpagina. Daisycon-links noemen alleen het pad (dl=...),
# en oudere ids zijn geen md5 van de link. Zonder dit vond de nachtrun ongeveer 3.000 producten nooit terug (Decantalo 280,
# Dille & Kamille 174, Nedgame 69 ...) en kregen die nooit een verse prijs. Proef met de zoekindex: 1.830 van de 2.755 nu wel.
import urllib.parse
def doel_pad(u):
    """Het pad van de winkelpagina waar een (partner)link naartoe gaat, zonder domein en zonder vraagteken-deel."""
    u = str(u or '')
    try: q = urllib.parse.parse_qs(urllib.parse.urlsplit(u).query)
    except Exception: q = {}
    d = None
    for k in ('r', 'u', 'ued', 'url'):
        if k in q and re.match(r'https?://', q[k][0]): d = q[k][0]; break
    if d is None and 'dl' in q:
        m = re.search(r'(?:murl|[?&]u)=([^&]+)', q['dl'][0]); d = urllib.parse.unquote(m.group(1)) if m else q['dl'][0]
    if d is None: d = u if not re.search(r'tradetracker|awin1|//partner\.|[?&]tt=\d', u) else ''
    d = urllib.parse.unquote(d); d = re.sub(r'^https?://[^/]+/', '', d); d = re.sub(r'[?#].*$', '', d).strip('/').lower()
    return d if len(d) >= 8 else ''
_pad = collections.defaultdict(set)
for pid, p in tt_live.items():
    for u in (p.get('winkelUrl'), p.get('url')):
        dp = doel_pad(u)
        if dp: _pad[dp].add(pid)
per_pad = {k: list(v)[0] for k, v in _pad.items() if len(v) == 1}
gevonden_tt = set()
# 21-11-2026: automatisch uitverkochte partnerproducten (bron 'feed') herkennen, zodat ze terugkomen als de feed ze weer op voorraad heeft.
au_url, au_pad = {}, {}
for pid, a in AU.items():
    if a.get('bron') != 'feed' or pid in P: continue
    if a.get('winkelUrl') and netwerk(a['winkelUrl']) == 'direct': au_url[url_sleutel(a['winkelUrl'])] = pid
    for u in (a.get('winkelUrl'), a.get('url')):
        dp = doel_pad(u)
        if dp: au_pad[dp] = pid
au_terug = set()
# 22-11-2026 (controle van de site): op het pad alleen koppelen als feedregel en product bij dezelfde winkel horen. Het pad laat het
# domein weg, dus 'ruimte-mok' van Ditverzinjeniet kwam ook bij de Ruimtemok van Cadeau.nl uit. Een Daisycon-regel noemt alleen het pad
# (dl=...): dan moet het programma (si=) gelijk zijn, en alleen voor winkels waarvan de feed op 22-11 met de winkelpagina is vergeleken.
# Niet vertrouwd: Decantalo (feed ruim 10% duurder dan de winkel: Jameson 28,10 tegen 24,95), Droptelegram (verzendkosten in de prijs),
# de Daisycon-feed van Ditverzinjeniet (voorraad klopt niet; die winkel loopt via TradeTracker), en varianten per maat of formaat
# (MYKA, Kaartje2go, Westwing, Joybuy, Wijnkring, Dropwinkel). Die blijven bij de controle van de winkelpagina.
DC_PAD_OK = {'Doenkado', 'Bloompost', 'Butchery', 'Butchery.nl', 'Razer'}
def _dom(u):
    try: d = urllib.parse.urlsplit(u).netloc.lower()
    except Exception: return ''
    return d[4:] if d.startswith('www.') else d
def winkel_sleutels(*links):
    """Wat een link over de winkel zegt: het Daisycon-programma (si=) en het domein van de winkelpagina waar hij heen gaat."""
    uit = set()
    for u in links:
        u = str(u or '')
        if not u: continue
        try: q = urllib.parse.parse_qs(urllib.parse.urlsplit(u).query)
        except Exception: q = {}
        if netwerk(u) == 'daisycon' and q.get('si'): uit.add(('si', q['si'][0]))
        for k in ('r', 'u', 'ued', 'url', 'murl'):
            if k in q and re.match(r'https?://', q[k][0]): uit.add(('dom', _dom(q[k][0])))
        if netwerk(u) == 'direct' and re.match(r'https?://', u): uit.add(('dom', _dom(u)))
    return uit
def zelfde_winkel(link, wurl, p):
    rij = winkel_sleutels(link, wurl); prod = winkel_sleutels(p.get('url'), p.get('winkelUrl'))
    if not rij & prod: return False
    if not any(t == 'dom' for t, _ in rij):   # alleen een Daisycon-pad, geen echt winkeladres
        return (p.get('shop') or '') in DC_PAD_OK
    return True
def zoek_pid(r):
    link = r.get('link') or r.get('url') or ''
    pid = per_awin.get(awin_p(link)) if awin_p(link) else None
    if not pid: pid = per_md5.get(hashlib.md5(link.encode()).hexdigest()[:10]) if link else None
    w = ''
    if not pid:
        w = url_sleutel(r.get('winkelUrl') or re.sub(r'^.*[?&](?:r|u|url)=', '', link) if link else '')
        try: w = url_sleutel(urllib.parse.unquote(w))
        except Exception: pass
        pid = per_url.get(w)
    if not pid and link:
        k = per_pad.get(doel_pad(link))
        if k and zelfde_winkel(link, r.get('winkelUrl'), P[k]): pid = k
    return pid, link, w
def verwerk(naam, L, datum):
    uit['bronnen'].append(naam); n = 0
    for r in L:
        pid, link, w = zoek_pid(r)
        op_voorraad = str(r.get('voorraad', 'true')).lower() not in ('false', '0', 'nee', 'no')
        if not pid:
            a = au_url.get(w) if w else None
            if not a and link: a = au_pad.get(doel_pad(link))
            if not a and r.get('winkelUrl'): a = au_pad.get(doel_pad(r['winkelUrl']))
            if a and a not in au_terug and op_voorraad:
                try: pr = round(float(r.get('prijs') or 0), 2)
                except (TypeError, ValueError): pr = 0
                if pr > 0: au_terug.add(a); uit['terug'].append({'id': a, 'prijs': pr, 'bron': naam, 'feedDatum': datum})
            continue
        if pid in gevonden_tt: continue
        gevonden_tt.add(pid); n += 1; uit['feedDatum'][pid] = datum
        prijsverschil(pid, P[pid]['prijs'], r.get('prijs'))
        if not op_voorraad: uit['uitverkocht'].append({'id': pid, 'titel': P[pid]['titel'][:70], 'bron': naam})
    if n: print(naam, n, 'producten teruggevonden', flush=True)
# 8-11-2026: nieuwste bestanden eerst (een product telt maar één keer, dus de verste prijs moet winnen)
for f in sorted(glob.glob(os.path.join(TTF, '*.json')), key=os.path.getmtime, reverse=True):
    naam = os.path.basename(f)
    if naam.startswith('logboek'): continue
    try: L = json.load(open(f, encoding='utf-8'))
    except Exception: continue
    if isinstance(L, dict): L = L.get('producten') or L.get('items') or []
    verwerk(naam, L, feed_datum(f))
# 21-11-2026: daarna de Superkeurkamer-feeds (ververst om 05:10), alleen van winkels waar nog producten van niet teruggevonden zijn,
# en alleen als het bestand hooguit 2 dagen oud is. Nooit de winkels die naar dailyathome.nl verhuisden (links dood).
DOOD = {'kadoversturen', 'animalsgiftshop', 'cartoonmegastore', 'surpriseswinkel', 'handpoppenwinkel', 'speelgoedpostorder', 'bandanawinkel',
        'bigsizeshirts', 'spaarpottenwinkel', 'fashionstore', 'aliexpress', 'laredoute', 'yesgifts'}
def winkelnaam(x):
    x = re.sub(r'[^a-z0-9]', '', str(x or '').lower())
    return re.sub(r'(nl|com|eu)$', '', x) if len(x) > 6 else x
nodig = collections.Counter(winkelnaam(p['shop']) for pid, p in tt_live.items() if pid not in gevonden_tt)
for a in AU.values():
    if a.get('bron') == 'feed': nodig[winkelnaam(a.get('shop'))] += 1
uit['skk'] = {}
if os.path.isdir(SKK):
    for f in sorted(glob.glob(os.path.join(SKK, '*.json'))):
        w = os.path.basename(f)[:-5]
        if w in DOOD: continue
        sleutel = winkelnaam(w)
        if not nodig.get(sleutel) and not nodig.get(w): continue
        if (datetime.date.today() - datetime.date.fromisoformat(feed_datum(f))).days > 2: continue
        try: d = json.load(open(f, encoding='utf-8'))
        except Exception: continue
        # 'st' van de Superkeurkamer is GEEN betrouwbare voorraad (proef 21-11: 13 producten met st=0 waren volgens de winkelpagina gewoon
        # op voorraad). Deze bron telt dus alleen voor prijs en 'staat nog in de feed', nooit voor uitverkocht.
        L = [{'link': p.get('l') or '', 'winkelUrl': p.get('u') or '', 'prijs': p.get('p'), 'voorraad': 'true'} for p in d.get('producten', [])]
        voor = len(gevonden_tt); verwerk('superkeurkamer/' + w, L, feed_datum(f)); uit['skk'][w] = len(gevonden_tt) - voor
uit['gecontroleerd'] += len(gevonden_tt)
uit['gezien'] = sorted(set(gevonden) | set(gevonden_tt))  # 8-11-2026: welke producten vandaag in een feed teruggevonden zijn (voor de controledatum)
for pid, p in tt_live.items():
    if pid not in gevonden_tt and p['shop'] not in ('Amazon',): uit['nietInFeed'].append({'id': pid, 'titel': p['titel'][:70], 'bron': p['shop']})

uit['samenvatting'] = {'live': len(P), 'gecontroleerd': uit['gecontroleerd'], 'prijsVeranderd': len(uit['prijs']), 'uitverkocht': len(uit['uitverkocht']), 'nietInFeed': len(uit['nietInFeed'])}
json.dump(uit, open(os.path.join(UIT, 'wacht-' + vandaag + '.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
json.dump(uit, open(os.path.join(UIT, 'wacht-laatste.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('klaar:', json.dumps(uit['samenvatting']))
