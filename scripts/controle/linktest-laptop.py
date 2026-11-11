# Linktest, stap 2 (11-11-2026, grote controle). Draait op de LAPTOP (de cloud kan de winkels niet bereiken).
# Volgt voor een rij producten de echte winkelknop van de live site en kijkt of de bezoeker op een bestaande pagina uitkomt.
#   GOED   = komt op een pagina van de winkel
#   KAPOT  = 404 of 'niet gevonden'  -> product weg (status uitverkocht) of het doorstuuradres van de winkel werkt niet meer
#   ROBOT  = de winkel houdt robots tegen (403, 'even geduld'); zegt niets over echte bezoekers
#   BLIJFT = blijft op het doorstuuradres hangen; met de hand nakijken
# Gebruik (PowerShell):
#   python linktest-laptop.py <id,id,id>     de rij komt uit: node scripts/controle/eindpunten.js .
# bol en Amazon zitten er bewust niet in (niet scrapen). Let op: elke test is een echte klik bij het partnernetwerk;
# doe dit dus af en toe (bijvoorbeeld één keer per maand), niet elke dag.
import json, re, sys, urllib.request, urllib.parse
from playwright.sync_api import sync_playwright

if len(sys.argv) < 2:
    print('Geef de rij product-id\'s mee (zie de uitleg bovenaan).'); raise SystemExit(1)
IDS = [x for x in sys.argv[1].split(',') if x]
t = urllib.request.urlopen(urllib.request.Request('https://leukekeuze.nl/assets/js/producten-details.js', headers={'User-Agent': 'Mozilla/5.0'}), timeout=60).read().decode('utf-8')
D = json.loads(t[t.index('window.LK_DETAILS = ') + 20:t.rindex('}') + 1])


def a(s):
    return str(s).encode('ascii', 'replace').decode()


tel = {}
with sync_playwright() as p:
    b = p.chromium.launch(channel='msedge', args=['--disable-blink-features=AutomationControlled'])
    pg = b.new_context(viewport={'width': 1280, 'height': 800}, locale='nl-NL').new_page()
    for n, i in enumerate(IDS):
        d = D.get(i)
        if not d or not d.get('url'):
            print(n + 1, 'ONBEKEND', i, flush=True); continue
        u0 = urllib.parse.urlparse(d['url'])
        try:
            r = pg.goto(d['url'], wait_until='domcontentloaded', timeout=35000); pg.wait_for_timeout(1500)
            pu = urllib.parse.urlparse(pg.url); st = r.status if r else 0; kop = a(pg.title())[:40]
            if st == 404 or re.search(r'niet gevonden|not found|niet vindbaar|404', kop, re.I): oordeel = 'KAPOT'
            elif st in (403, 429, 503) or re.search(r'even geduld|cloudflare|verification|attention', kop, re.I): oordeel = 'ROBOT'
            elif pu.netloc == u0.netloc and pu.path == u0.path: oordeel = 'BLIJFT'
            else: oordeel = 'GOED'
            print(n + 1, oordeel, i, st, u0.netloc + u0.path[:30], '->', pu.netloc + pu.path[:40], '|', kop, flush=True)
        except Exception as e:
            oordeel = 'FOUT'; print(n + 1, 'FOUT', i, u0.netloc + u0.path[:30], a(e)[:70], flush=True)
        tel[oordeel] = tel.get(oordeel, 0) + 1
    b.close()
print('KLAAR', tel, flush=True)
