"""Elke nacht: alle feeds ophalen bij Daisycon en TradeTracker, de zoekindex opnieuw maken en online zetten.
Draait op de laptop van Marius (Taakplanner), vanuit een kopie van de repo.
Gebruik: python scripts/nachtelijk.py   (vanuit de hoofdmap van de repo)"""
import os, sys, subprocess, urllib.request, datetime, json, shutil
sys.stdout.reconfigure(encoding='utf-8')
HIER = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(HIER)
FEEDS = os.path.join(REPO, '..', 'zoekindex-feeds')
os.makedirs(FEEDS, exist_ok=True)
LOG = open(os.path.join(FEEDS, 'logboek.txt'), 'a', encoding='utf-8')
def log(*a):
    s = datetime.datetime.now().strftime('%Y-%m-%d %H:%M') + ' ' + ' '.join(str(x) for x in a)
    print(s); LOG.write(s + '\n'); LOG.flush()
B = 'https://daisycon.io/datafeed/?media_id=433339&type=xml&html_transform=none&rawdata=false&encoding=utf8&general=false'
FEED = {  # bestandsnaam: feed (NIET Mijn Hummeltje 16616: dropshipping, wens van Marius)
    'x-dille': '&standard_id=1&language_code=nl&locale_id=1&program_id=7059',
    'x-decantalo1': '&standard_id=4&language_code=nl&locale_id=1&program_id=18645',
    'x-drmartens': '&standard_id=7&language_code=nl&locale_id=1&program_id=15138',
    'x-dvzn': '&standard_id=1&language_code=nl&locale_id=1&program_id=11208',
    'x-999-alles': '&standard_id=1&language_code=nl&locale_id=1&program_id=13450',
    'x-dropwinkel': '&standard_id=4&language_code=nl&locale_id=1&program_id=18019',
    'x-teufel': '&standard_id=6&language_code=nl&locale_id=1&program_id=15574',
    'x-zadig': '&standard_id=7&language_code=fr&locale_id=5&program_id=15679',
    'x-bloompost': '&standard_id=1&language_code=nl&locale_id=1&program_id=7248',
    'x-laredoute-wonen': '&standard_id=8&language_code=nl&locale_id=1&program_id=16029',
    'x-lego': '&standard_id=1&language_code=nl&locale_id=1&program_id=18488',
    'x-bartogi': '&standard_id=7&language_code=nl&locale_id=1&program_id=15634',
    'x-myka': '&standard_id=7&language_code=nl&locale_id=1&program_id=18346',
    'x-prydligt': '&standard_id=7&language_code=nl&locale_id=11&program_id=18475',
    'x-invicta': '&standard_id=1&language_code=en&locale_id=6&program_id=18836',
    'x-woodwick': '&standard_id=1&language_code=nl&locale_id=1&program_id=21919',
    'x-wijnkring': '&standard_id=4&language_code=nl&locale_id=1&program_id=18166',
    'x-kerstland': '&standard_id=1&language_code=nl&locale_id=1&program_id=22097',
    'x-fietsparadijs': '&standard_id=1&language_code=nl&locale_id=1&program_id=12168',
    'x-fietstas': '&standard_id=1&language_code=nl&locale_id=1&program_id=12934',
    'x-svinando': '&standard_id=4&language_code=nl&locale_id=2&program_id=22015',
    'x-westwing': '&standard_id=8&language_code=nl&locale_id=1&program_id=17294',
    # 05-11-2026: nieuw (Vipio heeft geen productfeed, alleen een winkeltegel)
    'x-levis': '&standard_id=7&language_code=nl&locale_id=1&program_id=19949',
    'x-isabelmarant': '&standard_id=7&language_code=en&locale_id=6&program_id=18138',
    'x-mokkaland': '&standard_id=4&language_code=nl&locale_id=1&program_id=21568',
    'x-butchery': '&standard_id=4&language_code=nl&locale_id=1&program_id=17660',
    'x-stroopwafels': '&standard_id=4&language_code=nl&locale_id=1&program_id=17202',  # Stroopwafels.com, goedgekeurd 8-11-2026
    'x-kambukka': '&standard_id=1&language_code=en&locale_id=6&program_id=17815',
    # 05-11-2026 middag: Joybuy NL en Acculaders.nl (gevonden door Claude). Geen feed (nog) bij: Eastpak, Cewe, Parfumado, Goedgemerkt, I-KOOK, Vipio.
    'x-joybuy': '&standard_id=1&language_code=nl&locale_id=1&program_id=20823',
    'x-acculaders': '&standard_id=1&language_code=nl&locale_id=1&program_id=12933',
    'x-vipio': '&standard_id=16&language_code=nl&locale_id=1&program_id=15569',  # feedlink van Marius (5-11)
    # 08-11-2026: feedlinks van Marius
    'x-sissyboy': '&standard_id=7&language_code=nl&locale_id=1&program_id=14446',        # Sissy-Boy kleding
    'x-sissyboy-wonen': '&standard_id=8&language_code=nl&locale_id=1&program_id=14446',  # Sissy-Boy wonen
    'x-miscota': '&standard_id=1&language_code=nl&locale_id=1&program_id=22031',         # Miscota (dierenvoeding)
    'x-kaartje2go': '&standard_id=1&language_code=nl&locale_id=1&program_id=19520',      # Kaartje2go
    'x-razer': '&standard_id=6&language_code=fr&locale_id=1&program_id=13299',           # Razer (Engelstalige titels)
}
# Grote feeds: alleen een deel bewaren (regex op titel of categorie, min- en maxprijs). Westwing: geen meubels, wel decoratie en cadeaus.
FILTER = {
    'x-westwing': (r'kaars|kandelaar|lantaarn|vaas|vazen|plaid|deken|kussen|geur|diffuser|lamp|lampje|fotolijst|spiegel|dienblad|mok|kop en schotel|glazen|karaf|schaal|kom|kerst|decoratie|beeld|klok|mand|bloempot|pot\b|kunstbloem|kunstplant|bord|servies|bestek|theedoek|handdoek|badjas|koffietafelboek|toys|health|beauty|baby|animals|pet|media|office', 3, 250),
}
ok = 0
for naam, q in FEED.items():
    xml = os.path.join(FEEDS, naam + '.xml'); js = os.path.join(FEEDS, naam + '.json')
    try:
        tmp = xml + '.nieuw'
        with urllib.request.urlopen(urllib.request.Request(B + q, headers={'User-Agent': 'Mozilla/5.0'}), timeout=600) as r, open(tmp, 'wb') as f:
            shutil.copyfileobj(r, f)
        os.replace(tmp, xml)
        f = FILTER.get(naam)
        extra = [f[0], str(f[1]), str(f[2])] if f else []
        subprocess.run([sys.executable, os.path.join(HIER, 'uittreksel.py'), xml, js + '.nieuw'] + extra, check=True, capture_output=True)
        n = len(json.load(open(js + '.nieuw', encoding='utf-8')))
        if n == 0:
            log('LEEG, oude versie blijft:', naam); os.remove(js + '.nieuw'); continue
        os.replace(js + '.nieuw', js); ok += 1
        log('ok', naam, n, 'producten')
    except Exception as e:
        log('FOUT', naam, e, '(oude versie blijft)')
# TradeTracker (site 516846). fid = het tweede getal in de tt=-link van de winkel.
TT = 'https://pf.tradetracker.net/?aid=516846&encoding=utf-8&type=xml-v2&filter_stock=1&categoryType=2&additionalType=2&fid='
TTFEED = {'t-dvzn': '1736161', 't-country-acc': '1479822', 't-country-licht': '1479776', 't-lamponline': '1430340',
          't-bellatio': '1639683', 't-wijny': '701966', 't-dgsw': '2434431', 't-animals': '814623', 't-ijzersterk': '2131205',
          't-coolgift': '1728408', 't-gadgets': '255212', 't-knuffelpar': '254011', 't-placethemoment': '2353225',
          # Nieuw 30-10-2026 (GO van Marius). Bewust niet: de enorme catalogi Handpoppen-winkel, Speelgoedpostorder en Surprises-winkel.
          't-hema': '1096437',  # HEMA
          't-smartphoto': '1195836',  # Smartphoto
          't-nedgame': '1597395',  # Nedgame
          't-cadeaunl': '1744030',  # Cadeau.nl
          't-grotekado': '1932305',  # Grote Kadoshop
          't-kadoversturen': '466600',  # Kado-versturen
          't-yesgifts': '252942',  # Yesgifts
          't-cartoon': '814606',  # Cartoon Megastore
          't-fifties': '2168887',  # Fiftiesstore
          't-italian': '964381',  # Italian Design
          't-kitchenette': '1708137',  # Kitchenette
          't-lookinggood': '1801395',  # Looking Good Today
          't-oogvoororen': '2041228',  # Oog voor oren
          't-spaarpotten': '789006',  # Spaarpotten-winkel
          't-superzero': '2084231',  # Superzero
          't-repeat': '2099037',  # Repeat Cashmere
          't-barrelkings': '2370354',  # Barrelkings
          't-aerovito': '2319797',  # Aerovito
          't-boombrush': '2392419',  # Boombrush
          't-bushpappa': '2153352',  # Bushpappa
          't-applamp': '683365',  # Applamp
          't-getled': '310690',  # Getled
          't-lightdepot': '2051533',  # Lightdepot
          't-badkamerradio': '255150',  # Badkamerradio
          't-bedroomshop': '2431923',  # Bedroomshop
          't-meubello': '2210118',  # Meubello
          't-prepz': '1562495',  # Prepz
          't-topdealer': '1020010',  # Topdealer
          't-fashionize': '2416400',  # Fashionize
          't-247jeans': '2335153',  # 247Jeans
          't-bivolino': '1788304',  # Bivolino
          't-tenstickers': '1690328',  # Tenstickers
          't-hobbymax': '480838',  # Hobbymax
          't-knuffelkado': '2563948',  # Knuffelkado
          't-toppers': '1516769',  # Toppers in Concert
          't-viparfum': '2584631',  # Viparfum
          't-mobistoxx': '1976189',  # Mobistoxx
          't-biercheque': '2472146',  # Biercheque (goedgekeurd 1-11-2026)
          # Nieuw 04-11-2026 (Marius). Bewust niet in de zoekfunctie: Woonkampioen (206.000, oud), Fietsweb (556.000), 1dagactie (ondergoed/textiel).
          't-expert': '254727',  # Expert
          't-bourgini': '2132103',  # Bourgini
          't-fotofabriek': '1809626',  # Fotofabriek
          't-ikwilzitzakken': '2587470',  # Ikwilzitzakken
          't-louiz': '2476044',  # Louiz
          't-tandenborstel': '1911673',  # Tandenborstel.com
          't-besled': '1533462',  # Besled (bestsellers)
          't-boekenwereld': '2490267',  # Boekenwereld (bestsellers)
          # 05-11-2026: nieuw goedgekeurd
          't-brekz': '1161548', 't-boardgameshop': '2520696', 't-yourdecoration': '1549969',
          't-barokspiegel': '1537045', 't-profotonet': '1748978', 't-steegenga': '1847808',
          't-steegen2': '2376168',  # tweede Steegen-feed (feedlink van Marius, 5-11)
}
for naam, fid in TTFEED.items():
    xml = os.path.join(FEEDS, naam + '.xml'); js = os.path.join(FEEDS, naam + '.json')
    try:
        tmp = xml + '.nieuw'
        with urllib.request.urlopen(urllib.request.Request(TT + fid, headers={'User-Agent': 'Mozilla/5.0'}), timeout=600) as r, open(tmp, 'wb') as f:
            shutil.copyfileobj(r, f)
        if os.path.getsize(tmp) < 400:  # 04-11-2026: sommige winkels (Biercheque) vullen 'voorraad' niet in: dan zonder voorraadfilter
            with urllib.request.urlopen(urllib.request.Request((TT + fid).replace('&filter_stock=1', ''), headers={'User-Agent': 'Mozilla/5.0'}), timeout=600) as r, open(tmp, 'wb') as f:
                shutil.copyfileobj(r, f)
        if os.path.getsize(tmp) < 400:  # 08-11-2026: ook zonder voorraadfilter leeg (bijv. Toppers in Concert): geen foutmelding, oude versie blijft
            os.remove(tmp); log('LEEG (winkel levert nu geen producten), oude versie blijft:', naam); continue
        os.replace(tmp, xml)
        subprocess.run([sys.executable, os.path.join(HIER, 'tt-uittreksel.py'), xml, js + '.nieuw', '5'], check=True, capture_output=True)
        n = len(json.load(open(js + '.nieuw', encoding='utf-8')))
        if n == 0:
            log('LEEG, oude versie blijft:', naam); os.remove(js + '.nieuw'); continue
        os.replace(js + '.nieuw', js); ok += 1
        log('ok', naam, n, 'producten')
    except Exception as e:
        log('FOUT', naam, e, '(oude versie blijft)')
# Awin (04-11-2026, wens Marius): de feeds van alle goedgekeurde Awin-partners, met het script van de Feedzoeker.
AWIN = r'C:\Users\egelt\Desktop\Feedzoeker LeukeKeuze\programma\awin-ophalen.py'
if os.path.exists(AWIN):
    try:
        r = subprocess.run([sys.executable, AWIN], capture_output=True, text=True, encoding='utf-8', errors='replace', timeout=2400)
        log('awin', 'ok' if r.returncode == 0 else 'FOUT', (r.stdout or r.stderr).strip().splitlines()[-1:] if (r.stdout or r.stderr) else '')
    except Exception as e:
        log('FOUT awin', e, '(oude versies blijven)')
if ok == 0:
    log('Geen enkele feed gelukt, niets online gezet.'); sys.exit(1)
TEST = '--test' in sys.argv  # alleen feeds ophalen en index maken, niets online zetten
os.chdir(REPO)
def git(*a):
    r = subprocess.run(['git'] + list(a), capture_output=True, text=True, encoding='utf-8')
    if r.returncode and a[0] != 'diff': log('git', ' '.join(a), 'FOUT:', (r.stderr or r.stdout).strip()[:300])
    return r
if not TEST: git('checkout', 'main'); git('pull', '--rebase', '-q')
r = subprocess.run([sys.executable, os.path.join(HIER, 'maak-zoekindex.py'), FEEDS], capture_output=True, text=True, encoding='utf-8')
log('index:', (r.stdout or r.stderr).strip()[-300:])
if r.returncode or TEST: sys.exit(r.returncode)
# 8-11-2026 (nazorg, wens Marius): elke nacht nakijken of de prijzen en voorraad op de site nog kloppen met de verse feeds.
# Alleen een rapport (zoekindex-feeds/nazorg/wacht-laatste.json); verandert niets aan de site. Mag de zoekindex nooit tegenhouden.
try:
    NZ = os.path.join(FEEDS, 'nazorg'); os.makedirs(NZ, exist_ok=True)
    subprocess.run(['node', os.path.join(HIER, 'keurkamer', 'effectief-site.js'), os.path.join(NZ, 'producten-site.json')], check=True, capture_output=True, timeout=600)
    w = subprocess.run([sys.executable, '-I', os.path.join(HIER, 'keurkamer', 'wacht.py'), '--producten', os.path.join(NZ, 'producten-site.json'), '--uit', NZ],
                       capture_output=True, text=True, encoding='utf-8', errors='replace', timeout=3600)
    log('nazorg-controle:', (w.stdout or w.stderr).strip().splitlines()[-1:] if (w.stdout or w.stderr) else '')
    # 8-11-2026 (piloot): het rapport gaat mee in de repo (keurkamer/nazorg/), zodat de dagelijkse piloot in de cloud het kan toepassen zonder de laptop.
    NZR = os.path.join(REPO, 'keurkamer', 'nazorg'); os.makedirs(NZR, exist_ok=True)
    shutil.copyfile(os.path.join(NZ, 'wacht-laatste.json'), os.path.join(NZR, 'wacht-laatste.json'))
    git('add', 'keurkamer/nazorg/wacht-laatste.json')
except Exception as e:
    log('nazorg-controle overgeslagen:', e)
git('add', 'assets/zoek/winkels.json', 'assets/zoek/alle.json.gz', 'assets/zoek/w')
if git('diff', '--cached', '--quiet').returncode == 0:
    log('Niets veranderd.'); sys.exit(0)
git('commit', '-q', '-m', 'Zoekindex bijgewerkt (' + datetime.date.today().isoformat() + ')')
p = git('push', '-q')
log('online gezet' if p.returncode == 0 else 'push mislukt')
