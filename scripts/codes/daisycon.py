#!/usr/bin/env python3
"""Kortingscodes & acties (5-11-2026, GO Marius).

Leest de Daisycon-promotie-export (Materiaal > Promoties > export, CSV) en zet de
bruikbare acties als window.LK_CODES in assets/js/data.js (tussen de CODES-markers).

Gebruik:  python3 -I scripts/codes/daisycon.py <export.csv>

Regels:
- Alleen acties die in Nederland gelden (locale nl-NL) en nog niet verlopen zijn.
- Nederlandse tekst uit de feed wordt gebruikt; Engelse acties alleen als hieronder
  een Nederlandse vertaling (NL) staat. Zo komt er nooit Engels of onzin op de site.
- Nooit codes verzinnen: de code komt altijd letterlijk uit de feed.
"""
import csv, json, re, sys, datetime, pathlib

ROOT = pathlib.Path(__file__).resolve().parents[2]
DATA = ROOT / 'assets/js/data.js'

# Winkelnaam zoals op de site (zodat de producten van die winkel eronder komen).
WINKEL = {'AllSaints (EU)': 'AllSaints', 'LEGO (EU)': 'LEGO', 'Mijn Hummeltje (NL)': 'Mijn Hummeltje', 'Cewe.nl': 'CEWE',
          'Joybuy (NL)': 'Joybuy', 'Wijnkring (NL)': 'Wijnkring', 'Woodwick.nl': 'WoodWick', "Levi's (EU)": "Levi's",
          'Timberland (EU)': 'Timberland', 'Eastpak (EU)': 'Eastpak', 'Decantalo (INT)': 'Decantalo', 'Kaartje2go (NL)': 'Kaartje2go',
          'Foreo (EU)': 'FOREO', 'Dr. Martens (EU)': 'Dr. Martens', 'Teufel (NL)': 'Teufel', 'Zadig&Voltaire (INT)': 'Zadig & Voltaire'}

# Nederlandse tekst per promotie-id (titel, uitleg, eventueel andere datums uit de uitleg zelf).
NL = {
  '50479': ('Extra 20% op de sale + gratis verzending', 'Black Friday warm-up: extra 20% korting op wat al in de sale staat, en gratis verzending.'),
  '49835': ('10% korting op je eerste bestelling', 'Schrijf je in voor de nieuwsbrief van AllSaints en krijg 10% korting op je eerste bestelling.'),
  '50304': ('Gratis LEGO-cadeau bij je bestelling', 'Bij €130 of meer aan LEGO krijg je gratis LEGO Ideas Build, Paint and Play (40889). Bij €40 of meer aan Star Wars-sets krijg je de Razor Crest mini-build (30728). Zolang de voorraad strekt.'),
  '41349': ('10% korting als lid', 'Word gratis lid van de Timberland-community en krijg 10% korting op je volgende aankoop.'),
  '44487': ('10% korting via de nieuwsbrief', "Schrijf je in voor de nieuwsbrief van Levi's en krijg 10% korting op je bestelling."),
  '41048': ('15% korting via de nieuwsbrief', 'Schrijf je in voor de nieuwsbrief van Eastpak en krijg 15% korting.'),
  '41047': ('Gratis verzending vanaf €40', 'Bij Eastpak betaal je geen verzendkosten vanaf €40.'),
  '36056': ('15% korting voor nieuwe klanten', 'Bestel je voor het eerst bij FOREO? Dan krijg je 15% korting op het hele assortiment.'),
  '25601': ('10% korting voor nieuwe leden', 'Schrijf je in bij Dr. Martens en krijg 10% korting als nieuw lid.'),
  # Nederlandse acties, maar korter en duidelijker gezegd (inhoud uit de feed):
  '50234': ('Black Friday: extra 20% op de sale', 'Speelgoed en kinderkleding met kortingen tot 80%. Met deze code krijg je daar nog 20% extra korting op. Vul de code in bij het afrekenen.'),
  '50239': ('Cyber Monday: extra 20% op de sale', 'Speelgoed en kinderkleding met kortingen tot 80%. Met deze code krijg je daar nog 20% extra korting op. Vul de code in bij het afrekenen.'),
  '50049': ('Gratis verzending op alle kalenders', 'Met deze code betaal je geen verzendkosten op CEWE-kalenders en adventskalenders. De code is één keer te gebruiken.'),
  '50009': ('Gratis fotokalender bij je fotoboek', 'Bestel uiterlijk 8 november een CEWE-fotoboek vanaf €50 en krijg een code voor een A4-wandkalender t.w.v. €17,95.'),
  '49278': ('Salentein-wijn bijna 25% goedkoper', 'Salentein Barrel Selection voor €11,99 in plaats van €15,95 per fles bij 6 flessen. Minder flessen? Dan krijg je 12% korting.'),
  '49750': ('Tot 60% korting op baby en wonen', 'Joybuy heeft babyspullen en woonartikelen met kortingen tot 60%.'),
  '49740': ('Elke donderdag €5 korting', 'Kortingen tot 60%, en elke donderdag €5 extra korting bij een bestelling vanaf €20.'),
  '45131': ('Geuren van de maand 25% goedkoper', 'Elke maand twee bijzondere WoodWick-geuren met 25% korting. De korting zit al in de prijs.'),
  '38581': ('10% korting op trouwkaarten', 'Schrijf je in voor de actie en krijg 10% korting op save-the-dates, uitnodigingen, menu’s en bedankkaarten. Elke maand maak je ook kans op €250 kaarttegoed.'),
  '31189': ('10% korting via de nieuwsbrief', 'Schrijf je in voor de nieuwsbrief van Mijn Hummeltje en krijg 10% korting.'),
  '38747': ('Gratis verzending vanaf €150', 'Bij Decántalo betaal je geen verzendkosten bij bestellingen boven €150.'),
  '34864': ('Wijn-outlet', 'Een hele wijnafdeling van Decántalo in de aanbieding.'),
}
# Datums die in de uitleg van de winkel staan gaan voor (de feed zegt soms iets anders).
DATUM = {'50234': ('2026-11-16', '2026-11-29'), '50239': ('2026-11-30', '2026-12-06'), '50304': (None, '2026-11-08'), '50009': (None, '2026-11-08')}
# Niet tonen: zakelijk (koffiemachines), nieuws zonder voordeel, of dubbel.
OVERSLAAN = {'49470', '49465', '47929', '39965', '36045', '47059', '45713', '45051', '49745', '49735'}
# Per winkel maximaal zoveel acties (codes gaan altijd voor).
MAX_PER_WINKEL = 3


def schoon(t):
    t = re.sub(r'\s+', ' ', (t or '')).strip()
    return t


def main(pad):
    vandaag = datetime.date.today().isoformat()
    rijen = list(csv.DictReader(open(pad, encoding='utf-8-sig', newline='')))
    uit, gezien = [], set()
    for r in rijen:
        pid = r['Promotion id'].strip()
        if not pid or pid in OVERSLAAN: continue
        if 'nl-NL' not in (r.get('Locales') or ''): continue
        prog = r['Program name'].strip()
        if prog not in WINKEL: continue
        taal = (r.get('Language code') or '').lower()
        if pid in NL: titel, tekst = NL[pid]
        elif taal == 'nl': titel, tekst = schoon(r['Promotion name']), schoon(r['Consumer Description'])
        else: continue
        vanaf, tot = (r['Start date'] or '')[:10], (r['End date'] or '')[:10]
        if pid in DATUM: vanaf, tot = DATUM[pid][0] or vanaf, DATUM[pid][1] or tot
        if tot and tot < vandaag: continue
        code = schoon(r['Promotion code'])
        if code and not re.fullmatch(r'[A-Za-z0-9_-]{3,30}', code): code = ''  # 'Via e-mail' e.d. is geen code
        sleutel = (prog, titel.lower())
        if sleutel in gezien: continue
        gezien.add(sleutel)
        soort, k = r['Type'].strip(), (r['Discount'] or '').strip()
        if soort == 'percentage' and k: badge = ('tot ' if re.search(r'\btot\b', titel.lower()) else '') + k + '%'
        elif soort == 'amount' and k: badge = '€' + k
        elif soort == 'free_shipping': badge = 'Gratis verzending'
        elif soort == 'free_item': badge = 'Cadeau'
        elif re.search(r'(\d+)%', titel): badge = re.search(r'(\d+)%', titel).group(1) + '%'
        elif 'gratis verzending' in titel.lower(): badge = 'Gratis verzending'
        else: badge = 'Actie'
        voorwaarden = schoon(r.get('Terms'))
        uit.append({'id': pid, 'winkel': WINKEL[prog], 'titel': titel, 'tekst': tekst, 'code': code, 'badge': badge,
                    'vanaf': vanaf, 'tot': tot, 'link': r['Click url'].strip(), 'logo': r['Logo'].strip(),
                    'voorwaarden': voorwaarden[:400]})
    # Codes eerst, dan wat het eerst afloopt.
    uit.sort(key=lambda x: (0 if x['code'] else 1, x['tot'] or '9999'))
    per, klaar = {}, []
    for x in uit:
        if per.get(x['winkel'], 0) >= MAX_PER_WINKEL: continue
        per[x['winkel']] = per.get(x['winkel'], 0) + 1
        klaar.append(x)
    blok = ('/* CODES-START: gemaakt door scripts/codes/daisycon.py op ' + vandaag + ' uit de Daisycon-export. Niet met de hand aanpassen. */\n'
            'window.LK_CODES = ' + json.dumps(klaar, ensure_ascii=False, indent=0).replace('\n', '') + ';\n/* CODES-END */')
    js = DATA.read_text(encoding='utf-8')
    if '/* CODES-START' in js:
        js = re.sub(r'/\* CODES-START.*?/\* CODES-END \*/', lambda m: blok, js, flags=re.S)
    else:
        js = js.rstrip() + '\n' + blok + '\n'
    DATA.write_text(js, encoding='utf-8')
    print(len(klaar), 'acties,', sum(1 for x in klaar if x['code']), 'met code')
    for x in klaar: print(' ', x['winkel'], '|', x['badge'], '|', x['code'] or '-', '|', x['vanaf'], '→', x['tot'], '|', x['titel'])


if __name__ == '__main__':
    main(sys.argv[1])
