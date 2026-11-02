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
if not os.path.exists(bron): bron = arg('--producten', bron)
E = json.load(open(bron, encoding='utf-8')); P = E['producten']
vandaag = datetime.date.today().isoformat()
uit = {'gemaakt': datetime.datetime.now().isoformat(timespec='minutes'), 'prijs': [], 'uitverkocht': [], 'nietInFeed': [], 'gecontroleerd': 0, 'bronnen': []}

def prijsverschil(pid, oud, nieuw):
    try: oud = float(oud); nieuw = float(nieuw)
    except (TypeError, ValueError): return
    if oud > 0 and abs(nieuw - oud) / oud >= 0.10: uit['prijs'].append({'id': pid, 'titel': P[pid]['titel'][:70], 'oud': oud, 'nieuw': round(nieuw, 2)})

# ---- bol: productId staat in het id (bol-<productId>) ----
bol_ids = {pid[4:]: pid for pid in P if pid.startswith('bol-')}
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
    return 'direct'
tt_live = {pid: p for pid, p in P.items() if (p.get('netwerk') or netwerk(p.get('url'))) in ('tradetracker', 'daisycon')}
per_url = {url_sleutel(p['winkelUrl']): pid for pid, p in tt_live.items() if p['winkelUrl']}
per_md5 = {pid.split('-', 1)[1]: pid for pid in tt_live if '-' in pid}
gevonden_tt = set()
for f in sorted(glob.glob(os.path.join(TTF, '*.json'))):
    naam = os.path.basename(f)
    if naam.startswith('logboek'): continue
    try: L = json.load(open(f, encoding='utf-8'))
    except Exception: continue
    if isinstance(L, dict): L = L.get('producten') or L.get('items') or []
    uit['bronnen'].append(naam); n = 0
    for r in L:
        link = r.get('link') or r.get('url') or ''
        pid = per_md5.get(hashlib.md5(link.encode()).hexdigest()[:10]) if link else None
        if not pid:
            w = url_sleutel(r.get('winkelUrl') or re.sub(r'^.*[?&](?:r|u|url)=', '', link) if link else '')
            try:
                import urllib.parse; w = url_sleutel(urllib.parse.unquote(w))
            except Exception: pass
            pid = per_url.get(w)
        if not pid or pid in gevonden_tt: continue
        gevonden_tt.add(pid); n += 1
        prijsverschil(pid, P[pid]['prijs'], r.get('prijs'))
        if str(r.get('voorraad', 'true')).lower() in ('false', '0', 'nee', 'no'): uit['uitverkocht'].append({'id': pid, 'titel': P[pid]['titel'][:70], 'bron': naam})
    if n: print(naam, n, 'producten teruggevonden', flush=True)
uit['gecontroleerd'] += len(gevonden_tt)
for pid, p in tt_live.items():
    if pid not in gevonden_tt and p['shop'] not in ('Amazon',): uit['nietInFeed'].append({'id': pid, 'titel': p['titel'][:70], 'bron': p['shop']})

uit['samenvatting'] = {'live': len(P), 'gecontroleerd': uit['gecontroleerd'], 'prijsVeranderd': len(uit['prijs']), 'uitverkocht': len(uit['uitverkocht']), 'nietInFeed': len(uit['nietInFeed'])}
json.dump(uit, open(os.path.join(UIT, 'wacht-' + vandaag + '.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
json.dump(uit, open(os.path.join(UIT, 'wacht-laatste.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('klaar:', json.dumps(uit['samenvatting']))
