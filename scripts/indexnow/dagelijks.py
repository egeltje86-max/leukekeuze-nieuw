# -*- coding: utf-8 -*-
"""
Elke dag de nieuwe en veranderde pagina's van leukekeuze.nl naar Bing sturen (IndexNow).

Draait op de laptop (Taakplanner 'LeukeKeuze IndexNow', 11:30 en 14:30, na de piloot).
De cloud mag niet bij api.indexnow.org; de laptop wel.

Werkt zo:
- leest de live sitemap van leukekeuze.nl;
- vergelijkt elk adres en zijn lastmod met wat de vorige keer is verstuurd
  (indexnow-staat.json naast dit script);
- stuurt wat nieuw of veranderd is, en adressen die uit de sitemap zijn verdwenen
  (zodat Bing ziet dat ze doorsturen of weg zijn);
- de allereerste keer: alleen wat de laatste 7 dagen veranderde.
Alleen eigen adressen van leukekeuze.nl, nooit partnerlinks. Alleen standaard-Python.
Logboek: indexnow-log.txt. Proef zonder versturen: --droog.
"""
import json, os, sys, datetime, urllib.request, urllib.error, re

HIER = os.path.dirname(os.path.abspath(__file__))
STAAT = os.path.join(HIER, 'indexnow-staat.json')
LOG = os.path.join(HIER, 'indexnow-log.txt')
SITEMAP = 'https://leukekeuze.nl/sitemap.xml'
SLEUTEL = '0f4b63729f8f46019ba50d0b7c48935c'   # openbaar: staat ook als bestand op de site
EIND = 'https://api.indexnow.org/indexnow'
PER_KEER = 10000          # grens van IndexNow per verzoek
MAX_TOTAAL = 30000        # veiligheidsslot per run
UA = 'LeukeKeuze-indexnow/1.0'
DROOG = '--droog' in sys.argv


def log(tekst):
    regel = datetime.datetime.now().strftime('%Y-%m-%d %H:%M') + '  ' + tekst
    print(regel)
    if DROOG:
        return
    with open(LOG, 'a', encoding='utf-8') as f:
        f.write(regel + '\n')


def haal_sitemap():
    req = urllib.request.Request(SITEMAP, headers={'User-Agent': UA})
    with urllib.request.urlopen(req, timeout=60) as r:
        xml = r.read().decode('utf-8', 'replace')
    paren = re.findall(r'<loc>([^<]+)</loc>\s*(?:<lastmod>([^<]*)</lastmod>)?', xml)
    uit = {}
    for loc, mod in paren:
        loc = loc.strip()
        if loc.startswith('https://leukekeuze.nl/'):
            uit[loc] = (mod or '').strip()
    return uit


def stuur(urls):
    body = json.dumps({
        'host': 'leukekeuze.nl',
        'key': SLEUTEL,
        'keyLocation': 'https://leukekeuze.nl/' + SLEUTEL + '.txt',
        'urlList': urls,
    }).encode('utf-8')
    req = urllib.request.Request(EIND, data=body, method='POST',
                                 headers={'Content-Type': 'application/json; charset=utf-8', 'User-Agent': UA})
    try:
        with urllib.request.urlopen(req, timeout=120) as r:
            return r.status, ''
    except urllib.error.HTTPError as e:
        try:
            t = e.read().decode('utf-8', 'replace')[:200]
        except Exception:
            t = ''
        return e.code, t
    except Exception as e:
        return 0, str(e)[:200]


def main():
    try:
        nu = haal_sitemap()
    except Exception as e:
        log('FOUT sitemap niet gelezen: %s' % e)
        return 1
    if len(nu) < 1000:
        log('STOP: sitemap heeft maar %d adressen (kapot?), niets verstuurd' % len(nu))
        return 1

    staat = None
    if os.path.exists(STAAT):
        try:
            with open(STAAT, encoding='utf-8') as f:
                staat = json.load(f)
        except Exception:
            staat = None

    if not staat or not isinstance(staat.get('urls'), dict):
        grens = (datetime.date.today() - datetime.timedelta(days=7)).isoformat()
        nieuw = [u for u, m in nu.items() if m and m >= grens]
        weg = []
        oud = {}
        log('eerste keer: %d adressen veranderd in de laatste 7 dagen (van %d)' % (len(nieuw), len(nu)))
    else:
        oud = staat['urls']
        nieuw = [u for u, m in nu.items() if oud.get(u) != m]
        weg = [u for u in oud if u not in nu]

    te_sturen = nieuw + weg
    if not te_sturen:
        log('niets nieuw of veranderd (%d adressen in de sitemap)' % len(nu))
        if not DROOG:
            with open(STAAT, 'w', encoding='utf-8') as f:
                json.dump({'bijgewerkt': datetime.datetime.now().isoformat(timespec='minutes'), 'urls': nu}, f)
        return 0
    if len(te_sturen) > MAX_TOTAAL:
        log('STOP: %d adressen is meer dan het slot van %d, niets verstuurd' % (len(te_sturen), MAX_TOTAAL))
        return 1

    if DROOG:
        log('DROOG: zou %d sturen (%d nieuw/veranderd, %d weg uit de sitemap)' % (len(te_sturen), len(nieuw), len(weg)))
        for u in te_sturen[:15]:
            print('   ', u)
        return 0

    gelukt = set()
    for i in range(0, len(te_sturen), PER_KEER):
        deel = te_sturen[i:i + PER_KEER]
        code, tekst = stuur(deel)
        if code in (200, 202):
            gelukt.update(deel)
            log('verstuurd: %d adressen, antwoord %d' % (len(deel), code))
        else:
            log('FOUT bij versturen van %d adressen: %s %s' % (len(deel), code, tekst))
            break

    # alleen bewaren wat echt is aangekomen; de rest gaat de volgende keer opnieuw
    nieuwe_staat = dict(oud)
    for u in gelukt:
        if u in nu:
            nieuwe_staat[u] = nu[u]
        else:
            nieuwe_staat.pop(u, None)
    if not staat:
        # eerste keer: alles wat niet verstuurd hoefde, telt als bekend
        for u, m in nu.items():
            if u not in te_sturen:
                nieuwe_staat[u] = m
    with open(STAAT, 'w', encoding='utf-8') as f:
        json.dump({'bijgewerkt': datetime.datetime.now().isoformat(timespec='minutes'), 'urls': nieuwe_staat}, f)
    log('klaar: %d van %d aangekomen (%d nieuw/veranderd, %d weg uit de sitemap)' % (len(gelukt), len(te_sturen), len(nieuw), len(weg)))
    return 0 if len(gelukt) == len(te_sturen) else 1


if __name__ == '__main__':
    sys.exit(main())
