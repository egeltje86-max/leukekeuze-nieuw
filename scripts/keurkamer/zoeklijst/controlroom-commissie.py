# Commissie per winkel voor de Superkeurkamer (28-11-2026).
# Leest zelf de sleutels (verdiensten-sleutels.txt, daisycon-token.json); print NOOIT een sleutel of token,
# alleen namen van winkels, percentages en foutcodes. Schrijft:
#   commissie.json (naast dit script) en een kopie in de Superkeurkamer (data\commissie.json).
# Bronnen: TradeTracker (getCampaigns), Awin (awin-kliks.json, gemaakt door awin-kliks.py), Daisycon (programma's, als de koppeling dat mag),
# en wat we echt verdienden (verdiensten.json: commissie gedeeld door de bestelwaarde).
import json, os, re, sys, html, datetime, urllib.request, urllib.error, http.cookiejar
import xml.etree.ElementTree as ET
sys.stdout.reconfigure(encoding='utf-8')
HIER = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HIER)
import verdiensten as V
SKK = r'C:\Users\egelt\Desktop\Superkeurkamer LeukeKeuze\data'
PROEF = '--proef' in sys.argv


def getal(t):
    try:
        return float(str(t).replace(',', '.'))
    except Exception:
        return None


def tradetracker(S):
    cid, pw = S.get('TRADETRACKER_CUSTOMER_ID'), S.get('TRADETRACKER_PASSPHRASE')
    if not cid or not pw:
        return {'stand': 'geen sleutel', 'winkels': []}
    url = 'https://ws.tradetracker.com/soap/affiliate'
    op = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(http.cookiejar.CookieJar()))

    def soap(naam, body):
        env = ('<?xml version="1.0" encoding="UTF-8"?><SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" '
               'xmlns:ns1="https://ws.tradetracker.com/soap/affiliate" xmlns:xsd="http://www.w3.org/2001/XMLSchema" '
               'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" '
               'SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"><SOAP-ENV:Body><ns1:%s>%s</ns1:%s></SOAP-ENV:Body></SOAP-ENV:Envelope>') % (naam, body, naam)
        r = urllib.request.Request(url, data=env.encode('utf-8'), headers={'Content-Type': 'text/xml; charset=utf-8', 'SOAPAction': url + '/' + naam})
        with op.open(r, timeout=120) as x:
            return ET.fromstring(x.read())
    tag = lambda e: e.tag.split('}')[-1]
    try:
        soap('authenticate', '<customerID xsi:type="xsd:nonNegativeInteger">%s</customerID><passphrase xsi:type="xsd:normalizedString">%s</passphrase>'
             '<sandbox xsi:type="xsd:boolean">false</sandbox><locale xsi:type="xsd:string">nl_NL</locale><demo xsi:type="xsd:boolean">false</demo>'
             % (html.escape(cid), html.escape(pw)))
        sites = soap('getAffiliateSites', '<options xsi:nil="true"/>')
        ids = sorted(set(e.text.strip() for it in sites.iter() if tag(it) == 'item' for e in it if tag(e) == 'ID' and e.text))
        uit, velden = {}, set()
        for sid in ids:
            x = soap('getCampaigns', '<affiliateSiteID xsi:type="xsd:nonNegativeInteger">%s</affiliateSiteID>'
                     '<options xsi:type="ns1:CampaignFilter"><assignmentStatus xsi:type="xsd:string">accepted</assignmentStatus></options>' % sid)
            for it in x.iter():
                if tag(it) != 'item':
                    continue
                kids = {tag(c): c for c in it}
                if 'name' not in kids or 'ID' not in kids:
                    continue
                naam = (kids['name'].text or '').strip()
                url_ = (kids['URL'].text or '').strip() if 'URL' in kids else ''
                c = {}
                for e in it.iter():
                    t = tag(e)
                    if 'ommission' in t and e.text and getal(e.text) is not None:
                        c[t] = getal(e.text)
                        velden.add(t)
                pct = c.get('saleCommissionVariable')
                vast = c.get('saleCommissionFixed')
                lead = c.get('leadCommission')
                uit[naam] = {'naam': naam, 'url': url_, 'netwerk': 'TradeTracker', 'pct': [pct, pct] if pct else None,
                             'vast': vast or None, 'lead': lead or None}
        return {'stand': 'ok', 'winkels': list(uit.values()), 'velden': sorted(velden)}
    except Exception as e:
        return {'stand': 'fout', 'fout': V.fout(e), 'winkels': []}


def daisycon(S):
    try:
        import daisycon as D
        tok = D._toegang(S)
        pubs, _ = D._get(tok, '/publishers')
        pids = [p.get('id') for p in (pubs or []) if isinstance(p, dict) and p.get('id')]
        uit, velden = {}, set()
        for pid in pids:
            for pad in ('/publishers/%s/programs', '/publisher/%s/programs'):
                try:
                    page = 1
                    while page < 30:
                        data, _ = D._get(tok, pad % pid, {'page': page, 'per_page': 100})
                        rijen = data if isinstance(data, list) else (data or {}).get('programs') or []
                        if not rijen:
                            break
                        for p in rijen:
                            naam = str(p.get('name') or p.get('program_name') or '').strip()
                            if not naam:
                                continue
                            pc = []
                            def zoek(o, pre=''):
                                if isinstance(o, dict):
                                    for k, v in o.items():
                                        zoek(v, pre + '.' + k)
                                elif isinstance(o, list):
                                    for v in o:
                                        zoek(v, pre)
                                elif 'commission' in pre or 'percentage' in pre:
                                    velden.add(pre)
                                    if 'percent' in pre and getal(o):
                                        pc.append(getal(o))
                            zoek(p)
                            uit[naam] = {'naam': naam, 'url': str(p.get('url') or ''), 'netwerk': 'Daisycon',
                                         'pct': [min(pc), max(pc)] if pc else None, 'vast': None}
                        if len(rijen) < 100:
                            break
                        page += 1
                    break
                except urllib.error.HTTPError as e:
                    if e.code == 404:
                        continue
                    return {'stand': 'fout', 'fout': V.fout(e), 'winkels': list(uit.values())}
        return {'stand': 'ok', 'winkels': list(uit.values()), 'velden': sorted(velden)[:40]}
    except Exception as e:
        return {'stand': 'fout', 'fout': V.fout(e)[:160], 'winkels': []}


def awin():
    try:
        d = json.load(open(os.path.join(HIER, 'awin-kliks.json'), encoding='utf-8'))
        return {'stand': 'ok', 'winkels': [{'naam': p['naam'], 'netwerk': 'Awin', 'pct': p.get('commissie_pct'), 'vast': p.get('commissie_vast')}
                                           for p in d.get('programmas', [])]}
    except Exception as e:
        return {'stand': 'fout', 'fout': str(e)[:160], 'winkels': []}


def gemeten():
    """Wat we echt verdienden: commissie / bestelwaarde per winkel (alleen niet-afgekeurde verkopen met een bestelwaarde)."""
    try:
        d = json.load(open(os.path.join(HIER, 'verdiensten.json'), encoding='utf-8'))
    except Exception:
        return {}
    som = {}
    for net, r in (d.get('netwerken') or {}).items():
        for t in r.get('transacties', []):
            if t.get('status') == 'af' or not t.get('omzet'):
                continue
            w = t.get('winkel') or net
            a = som.setdefault(w, [0.0, 0.0, 0])
            a[0] += t.get('bedrag') or 0
            a[1] += t.get('omzet') or 0
            a[2] += 1
    return {w: {'pct': round(100 * a[0] / a[1], 1), 'verkopen': a[2]} for w, a in som.items() if a[1] > 0}


def kern(s):
    s = (s or '').lower()
    s = re.sub(r'https?://|www\.|\.(nl|be|com|eu|de|co\.uk)\b|\b(nl|be|de)\b', ' ', s)
    return re.sub(r'[^a-z0-9]', '', s)


if __name__ == '__main__':
    S = V.sleutels()
    tt, dc, aw, gm = tradetracker(S), daisycon(S), awin(), gemeten()
    for naam, r in (('TradeTracker', tt), ('Daisycon', dc), ('Awin', aw)):
        met = sum(1 for w in r['winkels'] if w.get('pct') or w.get('vast'))
        print('%-12s %-6s %4d winkels, %4d met commissie %s' % (naam, r['stand'], len(r['winkels']), met, r.get('fout', '')))
        if PROEF:
            print('   velden:', ', '.join(r.get('velden', [])[:20]))
            for w in r['winkels'][:8]:
                print('   ', w['naam'], w.get('pct'), w.get('vast'))
    # koppelen aan de partners van de Superkeurkamer (op naam of webadres)
    partners = json.load(open(os.path.join(SKK, 'partners.json'), encoding='utf-8'))
    alle = tt['winkels'] + dc['winkels'] + aw['winkels']
    per_kern = {}
    for w in alle:
        for k in {kern(w['naam']), kern(w.get('url', ''))}:
            if len(k) >= 3:
                per_kern.setdefault(k, w)
    uit, gevonden = {}, 0
    ALIAS = {'emp': 'largenl', 'bax': 'baxshop'}   # EMP heet bij Awin 'Large NL'
    for p in partners:
        ks = [kern(p['id']), kern(p['naam'])] + ([ALIAS[p['id']]] if p['id'] in ALIAS else [])
        w = next((per_kern[k] for k in ks if k in per_kern), None)
        if not w:
            w = next((v for k, v in per_kern.items() for kk in ks if len(kk) >= 5 and (kk in k or k in kk)), None)
        g = next((v for n, v in gm.items() if kern(n) in ks or any(len(kk) >= 5 and kk in kern(n) for kk in ks)), None)
        x = {}
        if w and (w.get('pct') or w.get('vast')):
            x.update({'pct': w.get('pct'), 'vast': w.get('vast'), 'netwerk': w['netwerk'], 'bron': 'netwerk'})
            gevonden += 1
        if g:
            x['gemeten'] = g
        if p['id'] == 'bol':
            x.update({'pct': [2.0, 8.0], 'netwerk': 'bol', 'bron': 'schatting', 'uitleg': 'bol betaalt per productgroep; wat we echt verdienden staat bij gemeten'})
        if x:
            uit[p['id']] = x
    gem_bol = next((v for n, v in gm.items() if n == 'bol'), None)
    # bol staat niet in partners.json (eigen feed): bol betaalt per productgroep; we tonen wat we echt verdienden
    uit['bol'] = {'netwerk': 'bol', 'bron': 'gemeten', 'uitleg': 'bol betaalt per productgroep'}
    if gem_bol:
        uit['bol']['gemeten'] = gem_bol
    blob = {'gemaakt': datetime.datetime.now().strftime('%Y-%m-%d %H:%M'), 'stand': {'TradeTracker': tt['stand'], 'Daisycon': dc['stand'], 'Awin': aw['stand']},
            'partners': uit}
    for doel in (os.path.join(HIER, 'commissie.json'), os.path.join(SKK, 'commissie.json')):
        tmp = doel + '.tmp'
        json.dump(blob, open(tmp, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
        os.replace(tmp, doel)
    print('gekoppeld aan Superkeurkamer-partners:', len(uit), '(met commissie van het netwerk:', gevonden, ') van', len(partners))
    print('gemeten (echte verkopen):', ', '.join('%s %.1f%%' % (n, v['pct']) for n, v in sorted(gm.items())))
