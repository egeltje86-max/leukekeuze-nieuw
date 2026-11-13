"""Keurkamer, bewaking: vergelijkt de producten die live staan met de laatste feeds van de winkels.
Vindt: prijs veranderd, uitverkocht / niet leverbaar, niet meer in de feed, en producten die eerder weg zijn gedaan
maar opnieuw in een ronde zouden kunnen opduiken (zwarte lijst). Alleen lezen; verandert niets aan de site.

Draait op de laptop van Marius (daar staan de feeds) of hier met gekopieerde feeds:
  python wacht.py [--bol-feeds <map>] [--tt-feeds <map>] [--uit <map>]
Standaard: %USERPROFILE%/Documents/LeukeKeuze-Bol/feeds en %USERPROFILE%/Documents/zoekindex-feeds.
Uitvoer: <uit>/wacht-JJJJ-MM-DD.json en wacht-laatste.json (de Keurkamer-app en het sitewacht-rapport lezen die)."""
import json, os, re, sys, csv, gzip, glob, datetime, hashlib, collections
HIER = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(os.path.dirname(HIER))
csv.field_size_limit(10 ** 9)
def arg(naam, standaard):
    if naam in sys.argv: return sys.argv[sys.argv.index(naam) + 1]
    return standaard
HOME = os.environ.get('USERPROFILE') or os.path.expanduser('~')
BOL = arg('--bol-feeds', os.path.join(HOME, 'Documents', 'LeukeKeuze-Bol', 'feeds'))
TTF = arg('--tt-feeds', os.path.join(HOME, 'Documents', 'zoekindex-feeds'))
UIT = arg('--uit', os.path.join(ROOT, 'keurkamer', 'wacht')); os.makedirs(UIT, exist_ok=True)
bron = os.path.join(ROOT, 'keurkamer', 'data', 'producten-effectief.json')
bron = arg('--producten', bron)  # 8-11-2026: een opgegeven bestand gaat altijd voor
E = json.load(open(bron, encoding='utf-8')); P = E['producten']
vandaag = datetime.date.today().isoformat()
uit = {'gemaakt': datetime.datetime.now().isoformat(timespec='minutes'), 'prijs': [], 'uitverkocht': [], 'nietInFeed': [], 'gecontroleerd': 0, 'bronnen': []}

def prijsverschil(pid, oud, nieuw):
    try: oud = float(oud); nieuw = float(nieuw)
    except (TypeError, ValueError): return
    if oud > 0 and abs(nieuw - oud) / oud >= 0.10: uit['prijs'].append({'id': pid, 'titel': P[pid]['titel'][:70], 'oud': oud, 'nieuw': round(nieuw, 2)})

# ---- bol: productId staat in het id (bol-<productId>) ----
# 8-11-2026: alleen producten die nog echt naar bol linken (sinds 7-11 linken veel bol-ids naar een partner)
bol_ids = {pid[4:]: pid for pid in P if pid.startswith('bol-') and 'bol.com' in (P[pid].get('url') or '')}
gevonden = set()
feeds = sorted(glob.glob(os.path.join(BOL, 'product-feed_*-v2.csv.gz')))
if feeds and bol_ids:
    for f in feeds:
        print('bol-feed', os.path.basename(f), flush=True); uit['bronnen'].append(os.path.basename(f))
        try:
            # snel: productId is de eerste kolom ("9300000026539489"|...). Alleen regels van onze producten echt parsen.
            with gzip.open(f, 'rt', encoding='utf-8', errors='replace', newline='') as h:
                kop = next(csv.reader([h.readline()], delimiter='|'))
                i_prijs = kop.index('OfferNL.sellingPrice') if 'OfferNL.sellingPrice' in kop else -1
                i_lever = kop.index('OfferNL.isDeliverable') if 'OfferNL.isDeliverable' in kop else -1
                for regel in h:
                    if not regel.startswith('"'): continue
                    e = regel.find('"', 1); bid = regel[1:e]
                    pid = bol_ids.get(bid)
                    if not pid or pid in gevonden: continue
                    try: row = next(csv.reader([regel], delimiter='|'))
                    except Exception: continue
                    gevonden.add(pid)
                    if i_prijs >= 0 and i_prijs < len(row): prijsverschil(pid, P[pid]['prijs'], (row[i_prijs] or '0').replace(',', '.'))
                    if i_lever >= 0 and i_lever < len(row) and (row[i_lever] or '').upper() != 'Y': uit['uitverkocht'].append({'id': pid, 'titel': P[pid]['titel'][:70], 'bron': 'bol'})
        except Exception as e:
            print('fout bij', f, e)
    uit['gecontroleerd'] += len(gevonden)
    for b, pid in bol_ids.items():
        if pid not in gevonden: uit['nietInFeed'].append({'id': pid, 'titel': P[pid]['titel'][:70], 'bron': 'bol'})
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
per_url = {url_sleutel(p['winkelUrl']): pid for pid, p in tt_live.items() if p['winkelUrl'] and 'awin1.com' not in p['winkelUrl']}
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
# 8-11-2026: nieuwste bestanden eerst (een product telt maar één keer, dus de verste prijs moet winnen)
for f in sorted(glob.glob(os.path.join(TTF, '*.json')), key=os.path.getmtime, reverse=True):
    naam = os.path.basename(f)
    if naam.startswith('logboek'): continue
    try: L = json.load(open(f, encoding='utf-8'))
    except Exception: continue
    if isinstance(L, dict): L = L.get('producten') or L.get('items') or []
    uit['bronnen'].append(naam); n = 0
    for r in L:
        link = r.get('link') or r.get('url') or ''
        pid = per_awin.get(awin_p(link)) if awin_p(link) else None
        if not pid: pid = per_md5.get(hashlib.md5(link.encode()).hexdigest()[:10]) if link else None
        if not pid:
            w = url_sleutel(r.get('winkelUrl') or re.sub(r'^.*[?&](?:r|u|url)=', '', link) if link else '')
            try:
                import urllib.parse; w = url_sleutel(urllib.parse.unquote(w))
            except Exception: pass
            pid = per_url.get(w)
        if not pid and link: pid = per_pad.get(doel_pad(link))
        if not pid or pid in gevonden_tt: continue
        gevonden_tt.add(pid); n += 1
        prijsverschil(pid, P[pid]['prijs'], r.get('prijs'))
        if str(r.get('voorraad', 'true')).lower() in ('false', '0', 'nee', 'no'): uit['uitverkocht'].append({'id': pid, 'titel': P[pid]['titel'][:70], 'bron': naam})
    if n: print(naam, n, 'producten teruggevonden', flush=True)
uit['gecontroleerd'] += len(gevonden_tt)
uit['gezien'] = sorted(set(gevonden) | set(gevonden_tt))  # 8-11-2026: welke producten vandaag in een feed teruggevonden zijn (voor de controledatum)
for pid, p in tt_live.items():
    if pid not in gevonden_tt and p['shop'] not in ('Amazon',): uit['nietInFeed'].append({'id': pid, 'titel': p['titel'][:70], 'bron': p['shop']})

uit['samenvatting'] = {'live': len(P), 'gecontroleerd': uit['gecontroleerd'], 'prijsVeranderd': len(uit['prijs']), 'uitverkocht': len(uit['uitverkocht']), 'nietInFeed': len(uit['nietInFeed'])}
json.dump(uit, open(os.path.join(UIT, 'wacht-' + vandaag + '.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
json.dump(uit, open(os.path.join(UIT, 'wacht-laatste.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('klaar:', json.dumps(uit['samenvatting']))
