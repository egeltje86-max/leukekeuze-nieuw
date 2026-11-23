"""De ochtendrun (sinds 21-11-2026 om 09:00; daarvoor 21:00, de 'avondrun'). Draait op de laptop van Marius (Taakplanner,
taak 'LeukeKeuze zoekindex'), vanuit een kopie van de repo. Doet elke dag, in deze volgorde:
  1. de bol-feeds verversen (als ze ouder zijn dan 20 uur) met Marius' eigen VERNIEUW-BOL-FEEDS.cmd;
  2. alle feeds ophalen bij Daisycon, TradeTracker en Awin;
  3. de zoekindex opnieuw maken;
  4. prijs en voorraad van alle producten op de site nakijken (wacht.py: bol-feeds, partnerfeeds, Superkeurkamer-feeds);
  5. de gewone winkelpagina nakijken van wat in geen feed staat (winkelcheck.py, elke dag);
  6. het rapport in de repo zetten (keurkamer/nazorg/), zodat de piloot in de cloud het om 10:17 toepast, bouwt, controleert en live zet.
Waarom 's ochtends (Marius 21-11-2026): 'doe dit 9 uur 's ochtends als nog niet veel gekocht wordt'.
Gebruik: python scripts/nachtelijk.py   (vanuit de hoofdmap van de repo)"""
import os, sys, subprocess, urllib.request, datetime, json, shutil, glob, time, re
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
    'x-doenkado': '&standard_id=1&language_code=nl&locale_id=1&program_id=1305',         # Doenkado belevenissen, goedgekeurd 9-11-2026
    'x-invulboekjes': '&standard_id=1&language_code=nl&locale_id=1&program_id=14523',    # invulboekjes.nl, feedlink van Marius 9-11-2026
    'x-parfumania': '&standard_id=5&language_code=nl&locale_id=1&program_id=16384',      # Parfumania, feedlink van Marius 9-11-2026
    'x-zinzi': '&standard_id=7&language_code=nl&locale_id=1&program_id=11108',           # Zinzi sieraden NL, goedgekeurd 9-11-2026
    'x-droptelegram': '&standard_id=1&language_code=nl&locale_id=1&program_id=18913',    # Droptelegram, goedgekeurd 9-11-2026
    'x-naturesgift': '&standard_id=1&language_code=nl&locale_id=1&program_id=17750',     # Nature's Gift, goedgekeurd 9-11-2026
    'x-olijfolie': '&standard_id=4&language_code=nl&locale_id=1&program_id=20259',       # Olijfolie Concurrent, goedgekeurd 10-11-2026
    'x-majakoi': '&standard_id=1&language_code=nl&locale_id=1&program_id=15904',         # MaJa Koi (vijver/aquarium), goedgekeurd 10-11-2026
    'x-fitwinkel': '&standard_id=1&language_code=nl&locale_id=1&program_id=12318',       # Fitwinkel (sport), feedlink van Marius 19-11-2026
}
# Grote feeds: alleen een deel bewaren (regex op titel of categorie, min- en maxprijs). Westwing: geen meubels, wel decoratie en cadeaus.
FILTER = {
    # Fitwinkel: vooral sportkleding in maten (Gorilla Wear) en supplementen; alleen sport- en spelcadeaus bewaren (19-11-2026).
    'x-fitwinkel': (r'^(?!.*(gorilla|shirt|short|legging|hoodie|tank top|broek|\bbh\b|sport bra|jacket|jas\b|sokken|schoen|supplement|vitamine|eiwit|protein))(?=.*(boks|vechtsport|voetbaltafel|tafelvoetbal|airhockey|pingpong|tafeltennis|badminton|basketbal|voetbal|yoga|pilates|waterfles|golf|paddleboard|sup-board|sup board|balans|springtouw|massage|foamroller|biljart|pooltafel|reflexbal|speedball|bosu|centr|sklz|blackroll|garlando|trampoline))', 5, 800),
    'x-westwing': (r'kaars|kandelaar|lantaarn|vaas|vazen|plaid|deken|kussen|geur|diffuser|lamp|lampje|fotolijst|spiegel|dienblad|mok|kop en schotel|glazen|karaf|schaal|kom|kerst|decoratie|beeld|klok|mand|bloempot|pot\b|kunstbloem|kunstplant|bord|servies|bestek|theedoek|handdoek|badjas|koffietafelboek|toys|health|beauty|baby|animals|pet|media|office', 3, 250),
}
# 21-11-2026 (opdracht Marius: 'controleer de prijs en of het product nog beschikbaar is'): de bol-feeds werden alleen met de hand
# ververst (laatst 19-11), dus bol-prijzen en -voorraad liepen achter. Nu elke ochtend, met Marius' eigen script (dat leest zijn
# eigen inloggegevens; wij lezen het niet en loggen alleen of het lukte). Lukt het niet, dan blijven de oude feeds staan.
BOLDIR = os.path.join(os.environ.get('USERPROFILE') or os.path.expanduser('~'), 'Documents', 'LeukeKeuze-Bol')
def bol_stand():
    f = glob.glob(os.path.join(BOLDIR, 'feeds', 'product-feed_*-v2.csv.gz'))
    return len(f), (min(os.path.getmtime(x) for x in f) if f else 0)
try:
    n_voor, oud_voor = bol_stand(); CMD = os.path.join(BOLDIR, 'VERNIEUW-BOL-FEEDS.cmd')
    if '--test' not in sys.argv and os.path.exists(CMD) and time.time() - oud_voor > 20 * 3600:
        t0 = time.time()
        try:
            r = subprocess.run(['cmd', '/c', CMD], cwd=BOLDIR, stdin=subprocess.DEVNULL, capture_output=True, text=True, encoding='utf-8', errors='replace', timeout=3600)
            code = r.returncode
            # 23-11-2026: wat het script zegt (alleen zijn eigen meldingen, nooit gegevens) in het logboek, zodat we zien waarom het niet lukt.
            # Het script vroeg op 21 en 22-11 om de gegevens, omdat ze niet in de Windows-kluis stonden (input() zonder toetsenbord = meteen klaar).
            zegt = [x.strip() for x in ((r.stdout or '') + (r.stderr or '')).splitlines()
                    if re.search(r'Eenmalig|weigert|Verbinding mislukt|Niet ingevuld|KLAAR in|Niet gelukt|bewaard|EOFError|Error|Traceback', x)]
            if zegt: log('bol-script zegt:', ' | '.join(zegt[-4:])[:400])
        except subprocess.TimeoutExpired: code = 'tijdslimiet'
        n_na, oud_na = bol_stand()
        log('bol-feeds ververst:' if oud_na > oud_voor else 'bol-feeds NIET ververst (code %s), oude blijven:' % code,
            n_na, 'bestanden, oudste van', datetime.datetime.fromtimestamp(oud_na).strftime('%d-%m %H:%M') if oud_na else '-', '(%d min)' % ((time.time() - t0) / 60))
    else:
        log('bol-feeds zijn vers genoeg:', n_voor, 'bestanden, oudste van', datetime.datetime.fromtimestamp(oud_voor).strftime('%d-%m %H:%M') if oud_voor else '-')
except Exception as e:
    log('bol-feeds verversen overgeslagen:', e)
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
          't-fragrance': '2433689',  # eu.fragrance.com (goedgekeurd + feedlink van Marius, 8-11)
          # 08-11-2026: feedlinks van Marius. Deze winkels geven geen voorraad door: de feed komt binnen zonder voorraadfilter (zie hieronder).
          't-massamarkt': '1013186', 't-ontwerpzelf': '2489184', 't-pillowbuddies': '2455857',
          # 10-11-2026: nieuwe partners (feedlinks van Marius / goedkeuringsmails)
          't-makemefamous': '2590467',  # Make Me Famous (persoonlijke cadeaus)
          't-christmas1967': '2586335',  # Christmas1967
          't-gestrikt': '1737881',  # Gestrikt.nl (Superkeurkamer-keuzes 10-11)
          # 11-11-2026: feedlinks van Marius (goedgekeurd bij TradeTracker). Favoshop en Zonnerij worden wel opgehaald, maar staan nog niet in de zoekindex (eerst kijken wat erin zit).
          't-surprose': '1955243',  # Surprose (rozen)
          't-fotoinglas': '2120869',  # Foto-in-glas
          't-favoshop': '2562877',  # Favoshop
          't-zonnerij': '2180753',  # Zonnerij
          # 22-11-2026: Bax Music (muziekwinkel, keyboards en digitale piano's van de ERBIJ-lijst keyboards). Alleen voor prijs en voorraad;
          # bewust niet in de zoekindex (13.000 instrumenten en onderdelen, geen cadeauwinkel).
          't-bax': '2090520',  # Bax Music
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
# 8-11-2026 (wens Marius): 'Meer in onze winkels' onder Dames- en Herenhorloges alleen uit zijn eigen winkels en merken.
h = subprocess.run([sys.executable, '-I', os.path.join(HIER, 'zoek-horloges.py')], capture_output=True, text=True, encoding='utf-8', errors='replace')
log('horloges:', (h.stdout or h.stderr).strip()[-200:])
# 8-11-2026 (nazorg, wens Marius): elke nacht nakijken of de prijzen en voorraad op de site nog kloppen met de verse feeds.
# Alleen een rapport (zoekindex-feeds/nazorg/wacht-laatste.json); verandert niets aan de site. Mag de zoekindex nooit tegenhouden.
try:
    NZ = os.path.join(FEEDS, 'nazorg'); os.makedirs(NZ, exist_ok=True)
    subprocess.run(['node', os.path.join(HIER, 'keurkamer', 'effectief-site.js'), os.path.join(NZ, 'producten-site.json')], check=True, capture_output=True, timeout=600)
    w = subprocess.run([sys.executable, '-I', os.path.join(HIER, 'keurkamer', 'wacht.py'), '--producten', os.path.join(NZ, 'producten-site.json'), '--uit', NZ],
                       capture_output=True, text=True, encoding='utf-8', errors='replace', timeout=3600)
    log('nazorg-controle:', (w.stdout or w.stderr).strip().splitlines()[-1:] if (w.stdout or w.stderr) else '')
    NZR = os.path.join(REPO, 'keurkamer', 'nazorg'); os.makedirs(NZR, exist_ok=True)
    # 13-11-2026 (grote keuring, GO Marius): de gewone winkelpagina nakijken van wat in geen enkele feed staat
    # (prijs, voorraad, bestaat de pagina nog). Nooit een partnerlink, nooit bol of Amazon. De uitkomst komt in het nachtrapport,
    # zodat de piloot hem met de grenzen van nazorg.py overneemt. Sinds 21-11-2026 elke dag (was eens per 6 dagen; opdracht Marius:
    # 'controleer de prijs en of het product nog beschikbaar is'): wat in geen feed staat wordt zo ook dagelijks nagekeken.
    # Mag het nachtrapport nooit tegenhouden.
    try:
        WC = os.path.join(NZR, 'winkelcheck-laatste.json'); dagen = 999
        if os.path.exists(WC):
            try: dagen = (datetime.date.today() - datetime.date.fromisoformat(json.load(open(WC, encoding='utf-8')).get('datum', ''))).days
            except Exception: dagen = 999
        if dagen >= 1:
            c = subprocess.run([sys.executable, '-I', os.path.join(HIER, 'keurkamer', 'winkelcheck.py'), '--producten', os.path.join(NZ, 'producten-site.json'),
                                '--wacht', os.path.join(NZ, 'wacht-laatste.json'), '--rapport', WC, '--stand', os.path.join(NZ, 'winkelcheck-stand.json')],
                               capture_output=True, text=True, encoding='utf-8', errors='replace', timeout=2700)
            log('winkelcheck:', (c.stdout or c.stderr).strip().splitlines()[-1:])
            if os.path.exists(WC): git('add', 'keurkamer/nazorg/winkelcheck-laatste.json')
    except Exception as e:
        log('winkelcheck overgeslagen:', e)
    # 8-11-2026 (piloot): het rapport gaat mee in de repo (keurkamer/nazorg/), zodat de dagelijkse piloot in de cloud het kan toepassen zonder de laptop.
    shutil.copyfile(os.path.join(NZ, 'wacht-laatste.json'), os.path.join(NZR, 'wacht-laatste.json'))
    git('add', 'keurkamer/nazorg/wacht-laatste.json')
except Exception as e:
    log('nazorg-controle overgeslagen:', e)
# 21-11-2026: UIT (Marius: 'als het niks toevoegt kun je het uitzetten'). Elke test is een echte klik op een partnerlink en telt bij
# het netwerk; sinds 20-11 is de regel 'nooit een script dat partnerlinks opent of volgt'. Dode productpagina's vindt de dagelijkse
# winkelcheck al (gewoon winkeladres), en kapotte doorstuurpaden van winkels staan in TT_OMWEG (plaats.js). Weer aan: LINKTEST = True.
LINKTEST = False
# 11-11-2026 (grote controle, JA Marius): eens per 30 dagen de winkelknoppen naklikken, één product per doorstuuradres.
# Vier winkels gaven 'pagina niet gevonden' terwijl het product er gewoon was; dat ziet alleen een echte klik. Elke test telt
# bij het netwerk als klik, daarom niet vaker. Alleen een rapport (keurkamer/nazorg/linktest-laatste.json); de dagelijkse piloot
# meldt wat kapot is. Mag de zoekindex nooit tegenhouden.
try:
    LT = os.path.join(REPO, 'keurkamer', 'nazorg', 'linktest-laatste.json'); dagen = 999
    if os.path.exists(LT):
        try: dagen = (datetime.date.today() - datetime.date.fromisoformat(json.load(open(LT, encoding='utf-8')).get('datum', ''))).days
        except Exception: dagen = 999
    if LINKTEST and dagen >= 30:
        e = subprocess.run(['node', os.path.join(HIER, 'controle', 'eindpunten.js'), REPO], capture_output=True, text=True, encoding='utf-8', timeout=300)
        rij = (e.stdout or '').strip()
        if rij:
            os.makedirs(os.path.dirname(LT), exist_ok=True)
            t = subprocess.run([sys.executable, os.path.join(HIER, 'controle', 'linktest-laptop.py'), rij, '--json', LT],
                               capture_output=True, text=True, encoding='utf-8', errors='replace', timeout=2400)
            log('linktest:', (t.stdout or t.stderr).strip().splitlines()[-1:])
            if os.path.exists(LT): git('add', 'keurkamer/nazorg/linktest-laatste.json')
        else: log('linktest overgeslagen: geen rij producten', (e.stderr or '').strip()[-200:])
except Exception as e:
    log('linktest overgeslagen:', e)
git('add', 'assets/zoek/winkels.json', 'assets/zoek/alle.json.gz', 'assets/zoek/w')
if git('diff', '--cached', '--quiet').returncode == 0:
    log('Niets veranderd.'); sys.exit(0)
git('commit', '-q', '-m', 'Zoekindex bijgewerkt (' + datetime.date.today().isoformat() + ')')
p = git('push', '-q')
# 13-11-2026: tijdens de run kan er in de cloud iets live gezet zijn; dan eerst binnenhalen en opnieuw proberen
for _ in range(3):
    if p.returncode == 0: break
    git('pull', '--rebase', '-q'); p = git('push', '-q')
log('online gezet' if p.returncode == 0 else 'push mislukt')
