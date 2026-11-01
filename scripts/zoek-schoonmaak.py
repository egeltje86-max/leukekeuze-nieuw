"""Schoonmaak van 'Meer in onze winkels' (assets/zoek/w/*.json), 31-10-2026.
Marius: "In de categorie ringen staan veel verkeerde" (hondenkauwringen, zwembanden, visnetten bij Ringen).
1) Domeinregels: een product dat duidelijk bij een ANDERE groep hoort (hondenspul, kinderspeelgoed, decoratie...)
   komt niet in een vakje van een groep waar het niet bij hoort.
2) Uitsluitlijst per vakje (scripts/zoek-uitsluiten.json), met de hand/streng nagelopen titels.
Draait vanzelf mee aan het eind van maak-zoekindex.py; los: python3 scripts/zoek-schoonmaak.py"""
import json, re, os, glob
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
D = {  # sterke woorden per domein (titel + winkelcategorie)
 'dieren': r'\bhond|honden|\bkat\b|katten|kitten|puppy|trixie|\bkong\b|chewing|kauw|knaagdier|konijn|cavia|hamster|aquarium|terrarium|vogelkooi|krabpaal|halsband|hondenriem|kattenbak|huisdier|poepzak|dierenspeelgoed|\bpet\b|beeztees|ferplast|karlie|flamingo pet',
 'kinderspeelgoed': r'zwemband|waterpistool|opblaas|speelgoed|kinderspeelgoed|vanaf \d+ jaar|\b\d+\+ (jaar|years)|\bjunior\b|peuter|kleuter|baby|rammelaar|knuffel|barbie|\blol surprise|playmobil|paw patrol|bluey|kinderen',
 'decoratie': r'visnet|fuik|wereldbol|maritiem|mancave|wanddecoratie|muurdecoratie|kerstbal|kersthanger|kerstversiering|kandelaar|servetring|gordijnring|sleutelring|o-ring|afdichtring|pakking|dichtingsring',
}
DX = {k: re.compile(v, re.I) for k, v in D.items()}
# Welke domeinen mogen in welke groep (de rest wordt geweerd).
MAG = {
 'dieren': {'dieren'}, 'speelgoed': {'kinderspeelgoed', 'decoratie'}, 'hobby': {'kinderspeelgoed', 'decoratie'},
 'wonen': {'decoratie'}, 'tuin-klussen': {'decoratie'}, 'boeken-media': {'kinderspeelgoed'}, 'sport-outdoor': {'kinderspeelgoed'},
 'cadeaus': {'kinderspeelgoed', 'decoratie', 'dieren'}, 'valentijn': {'decoratie'}, 'mode-beauty': set(), 'sieraden': set(),
 'geuren-verzorging': set(), 'elektronica': set(), 'keuken': {'decoratie'}, 'dranken': set(), 'eten-drinken': set(), 'metaaldetectie': set(),
}
# Sieraden: alleen als het echt een sieraad is (een 'ring' kan ook een hondenspeeltje of basketbalring zijn).
SIERAAD = re.compile(r'sierad|jewel|zilver|goud|925|edelstaal|roestvrij staal|titanium|wolfraam|verguld|diamant|zirkon|moissanit|parel|kristal|swarovski|jwls|steen|steentjes|naam|letter|hart|dames|heren|bedel|ketting|collier|armband|oorbel|oorknop|hanger|horloge|watch|enkelband|broche|bague|ring maat|verlovings|trouwring|zegelring|vriendschapsring|statement', re.I)
NIET_SIERAAD = re.compile(r'smart ring|ringenspel|werpspel|basketbal|vlieger|map met|amorces|schots|led ring|magnet|riem ring|benzine|for sex|busy buddy|chuckit|petsnack|activity ringen|sleutelring|servetring', re.I)
# Grof of seks: nooit tonen.
GROF = re.compile(r'fuck|\bkut\b|kutje|\blul\b|piemel|penis|tieten|borsten|\bsex\b|seks|vibrator|dildo|condoom|mankini|erotisch|bdsm|stripper|\bporn', re.I)
# Kinderspullen die wel in volwassen groepen mogen als het vak er duidelijk over gaat (kinderschoenen, kinderhorloge...).
KINDVAK = re.compile(r'kind|baby|tiener|knuffel|speel|lego|puzzel|spel', re.I)
# 1-11-2026: alleen gekeurde producten tonen. De feeds veranderen elke dag; een nieuw product (nog niet bekeken)
# gaat eerst naar de wachtrij assets/zoek/w/_wacht.json (zo neemt de nachtelijke run op de laptop hem vanzelf mee) en komt pas op de site als het is goedgekeurd
# (scripts/zoek-goed.json). Afgekeurd staat in scripts/zoek-uitsluiten.json. Keuren: scripts/zoek-keuring.py.
def lees(naam, leeg):
    try: return json.load(open(os.path.join(ROOT, 'scripts', naam), encoding='utf-8'))
    except FileNotFoundError: return leeg
def uitsluiten():
    try: return json.load(open(os.path.join(ROOT, 'scripts', 'zoek-uitsluiten.json'), encoding='utf-8'))
    except FileNotFoundError: return {}
def schoon(map_=None):
    map_ = map_ or os.path.join(ROOT, 'assets', 'zoek', 'w')
    U = uitsluiten(); weg = 0; totaal = 0; leeg = []
    GOED = lees('zoek-goed.json', None)  # None = nog geen keuring: alles tonen wat door de regels komt
    goed = {k: set(t.lower() for t in v) for k, v in (GOED or {}).items()}
    WF = os.path.join(map_, '_wacht.json')
    try: WACHT = json.load(open(WF, encoding='utf-8'))
    except FileNotFoundError: WACHT = {}
    nwacht = 0
    for f in sorted(glob.glob(os.path.join(map_, '*.json'))):
        if os.path.basename(f).startswith('_'): continue
        k = os.path.basename(f)[:-5].replace('--', '/'); g = k.split('/')[0]
        j = json.load(open(f, encoding='utf-8')); W = j['winkels']
        blok = set(t.lower() for t in U.get(k, [])) | set(t.lower() for t in U.get('*', []))
        mag = MAG.get(g, set())
        hou = []; gezien = set(); reeks = {}
        for p in j['producten']:
            # Zelfde product in een andere maat (Mendes '...-20mm', '...-17'): maar één keer tonen.
            sleutel = re.sub(r'[-\s]+\d+([.,]\d+)?\s*(mm|cm)?$', '', p[0].lower()).strip()
            if sleutel in gezien: weg += 1; continue
            # Geen echte foto (bijv. '.../imagestore/product//'): niet tonen, anders een kapot plaatje (check-up 1-11-2026).
            if not p[4] or str(p[4]).rstrip().endswith('/'): weg += 1; continue
            gezien.add(sleutel)
            tekst = p[0] + ' ' + (p[5] or '')
            slecht = [d for d, rx in DX.items() if rx.search(tekst) and d not in mag]
            if slecht == ['kinderspeelgoed'] and KINDVAK.search(k): slecht = []
            if g == 'sieraden' and (NIET_SIERAAD.search(p[0]) or not SIERAAD.search(tekst)): slecht = ['geen-sieraad']
            if GROF.search(p[0]): slecht = ['grof']
            if slecht or p[0].lower() in blok: weg += 1; continue
            # Dieren: dezelfde mok/shirt in tientallen rassen en kleuren -> hooguit 3 per reeks (1-11-2026)
            if g == 'dieren':
                rk = ' '.join(p[0].lower().split()[:3]); reeks[rk] = reeks.get(rk, 0) + 1
                if reeks[rk] > 3: weg += 1; continue
            if GOED is not None and p[0].lower() not in goed.get(k, ()):
                rij = list(p); rij[2] = W[p[2]]['naam']  # winkelnaam i.p.v. nummer, zodat de rij later terug kan
                lijst = WACHT.setdefault(k, [])
                if all(r[0].lower() != p[0].lower() for r in lijst): lijst.append(rij); nwacht += 1
                continue
            hou.append(p)
        totaal += len(hou)
        if not hou: os.remove(f); leeg.append(k); continue
        j['producten'] = hou
        json.dump(j, open(f, 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
    if GOED is not None:
        # wat inmiddels goed- of afgekeurd is hoort niet meer in de wachtrij
        for k in list(WACHT):
            bl = set(t.lower() for t in U.get(k, [])); gd = goed.get(k, set())
            WACHT[k] = [r for r in WACHT[k] if r[0].lower() not in bl and r[0].lower() not in gd]
            if not WACHT[k]: del WACHT[k]
        json.dump(WACHT, open(WF, 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
    print('zoek-schoonmaak: %d weggehaald, %d over, %d nieuw in de wachtrij (%d totaal), lege vakjes weg: %s' % (weg, totaal, nwacht, sum(len(v) for v in WACHT.values()), leeg))
if __name__ == '__main__': schoon()
