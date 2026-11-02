"""Keurkamer, stap 4: de Keurkamer-app voor de laptop van Marius maken.
Zet alles bij elkaar (producten zoals de site ze toont + regelmotor + AI-advies + eerdere oordelen) in één databestand
en kopieert de app ernaast. De map keurkamer/app/ gaat naar de laptop (map "Keurkamer LeukeKeuze" op het bureaublad).

Gebruik: python3 scripts/keurkamer/maak-keurkamer.py [--fotos-lokaal]
  --fotos-lokaal: foto's uit de repo-map gebruiken (voor testen hier); anders van leukekeuze.nl (op de laptop)."""
import json, os, sys, shutil, datetime
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
KK = os.path.join(ROOT, 'keurkamer'); DATA = os.path.join(KK, 'data'); APP = os.path.join(KK, 'app')
os.makedirs(APP, exist_ok=True)
def lees(pad, leeg):
    try: return json.load(open(pad, encoding='utf-8'))
    except FileNotFoundError: return leeg
C = json.load(open(os.path.join(DATA, 'catalogus.json'), encoding='utf-8')); P = C['producten']
AI = lees(os.path.join(KK, 'ai-oordelen.json'), {})
O = lees(os.path.join(KK, 'oordelen.json'), {'producten': {}, 'vakjes': {}})
V = lees(os.path.join(KK, 'vakjes.json'), None) or json.load(open(os.path.join(KK, 'vakjes-lijst.json'), encoding='utf-8'))
basis = '' if '--fotos-lokaal' in sys.argv else 'https://leukekeuze.nl/'
GEEN_VAK_NAAM = {'cadeaus/voor-haar': 'Voor haar (oud)', 'cadeaus/voor-hem': 'Voor hem (oud)', 'cadeaus/voor-kinderen': 'Kinderen (oud)', 'cadeaus/opa-oma': 'Opa & oma (oud)',
                 'cadeaus/collega': "Collega's (oud)", 'cadeaus/baby-kraam': 'Baby & kraam (oud)'}
vakjes = [{'vak': v['vak'], 'afdeling': v['afdeling'], 'naam': v['naam'], 'hoort': v.get('hoort', ''), 'niet': v.get('niet', ''), 'url': 'https://leukekeuze.nl/c/' + v['vak'] + '/'} for v in V]
bekend = {v['vak'] for v in vakjes}
for vak, naam in GEEN_VAK_NAAM.items():
    if vak in C['vakjes'] and vak not in bekend:
        vakjes.append({'vak': vak, 'afdeling': 'Nog indelen', 'naam': naam, 'hoort': 'Dit vakje bestaat niet meer op de site. Geef elk product een echt vakje (Verplaatsen), of haal het weg.', 'niet': '', 'url': 'https://leukekeuze.nl/voor/' + vak.split('/')[1].replace('voor-', '') + '/', 'oud': True})
lijst = []
for pid, p in P.items():
    foto = p['beeld'] if p['beeld'].startswith('http') else basis + p['beeld'] + '-klein.webp'
    groot = p['beeld'] if p['beeld'].startswith('http') else basis + p['beeld'] + '.webp'
    a = AI.get(pid, {})
    x = {'id': pid, 'titel': p['titel'], 'prijs': p['prijs'], 'shop': p['shop'], 'merk': p['merk'], 'foto': foto, 'groot': groot, 'winkelUrl': p['winkelUrl'],
         'vak': p['vak'], 'ookIn': p['ookIn'], 'voor': p['voor'], 'waarom': p['waarom'], 'sfeer': p['sfeer'], 'favoriet': p['favoriet'], 'tags': p['tags'],
         'vlag': [f for f in p['vlag'] if f not in ('verplaatst-door-indeling', 'daisycon-pauze')], 'dubbel': p['dubbel'], 'sinds': p['sinds'], 'netwerk': p['netwerk']}
    if a: x['ai'] = {'leuk': a.get('leuk'), 'vertrouwen': a.get('vertrouwen'), 'vlag': a.get('vlag', []), 'voorFout': a.get('voorFout', ''), 'vak': a.get('vak', {})}
    lijst.append(x)
datum = datetime.date.today().isoformat()
with open(os.path.join(APP, 'keurkamer-data.js'), 'w', encoding='utf-8') as f:
    f.write('/* Keurkamer LeukeKeuze - alle producten die nu op de site staan, met regelmotor en AI-advies. Gemaakt door Claude op %s. Niet met de hand bewerken. */\n' % datum)
    f.write('window.KK_GEMAAKT=%s;\n' % json.dumps(datum))
    f.write('window.KK_VAKJES=%s;\n' % json.dumps(vakjes, ensure_ascii=False))
    f.write('window.KK_EERDER=%s;\n' % json.dumps(O, ensure_ascii=False))
    f.write('window.KK_PRODUCTEN=[\n' + ',\n'.join(json.dumps(x, ensure_ascii=False) for x in lijst) + '\n];\n')
shutil.copy(os.path.join(ROOT, 'scripts/keurkamer/keurkamer.html'), os.path.join(APP, 'Keurkamer openen.html'))
shutil.copy(os.path.join(ROOT, 'scripts/keurkamer/LEES-MIJ-keurkamer.txt'), os.path.join(APP, 'LEES MIJ.txt'))
print(len(lijst), 'producten,', len(vakjes), 'vakjes,', sum(1 for x in lijst if 'ai' in x), 'met AI-advies ->', APP)
