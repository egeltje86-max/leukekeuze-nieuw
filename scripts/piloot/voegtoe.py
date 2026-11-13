"""Piloot: gekozen kandidaten op de site zetten (producten.js + foto's + correcties.json).
Gebruik: python3 scripts/piloot/voegtoe.py <kandidaten.json> <keuze.json> <fotomap> [--blok "naam van dit blok"]
keuze.json = { "<i>": {"titel": "...", "vak": "afd/groep/vak", "ookIn": ["cadeaus/kerst"], "voor": ["haar"], "moment": ["kerst","verjaardag"], "waarom": "..."} , ... }
Strenge poort: partnercode in de link, vak bestaat, prijs > 0, foto aanwezig, id nog niet op de site, titel niet bijna gelijk aan een bestaand product.
Wat niet door de poort komt wordt overgeslagen en gemeld (nooit stilletjes toegevoegd)."""
import json, hashlib, re, sys, os, subprocess, datetime
from PIL import Image
HIER = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(os.path.dirname(HIER))
def arg(naam, standaard=None):
    if naam in sys.argv: i = sys.argv.index(naam); return sys.argv[i + 1]
    return standaard
K = {str(x['i']): x for x in json.load(open(sys.argv[1], encoding='utf-8'))}
KEUZE = json.load(open(sys.argv[2], encoding='utf-8')); FOTOS = sys.argv[3]
vandaag = datetime.date.today().isoformat(); blok = arg('--blok', 'Piloot ' + vandaag)
CODE = re.compile(r'tag=leukekeuze-21|[?&_=]516846|s=1545784|[?&]a=3110079|awinaffid=3110079|wi=433339|aff=LEUKEKEUZE', re.I)
PRE = {'Ditverzinjeniet': 'dvzn', 'Cadeau.nl': 'cadeau', 'Grote Kadoshop': 'grotek', 'De Grote Speelgoedwinkel': 'dgsw', 'Nedgame': 'nedg', 'HEMA': 'hema', 'EMP': 'emp', 'LEGO': 'legoshop', 'Bloompost': 'bloom', 'Bellatio': 'bell', 'Kerstland': 'kerstl', 'Hobbymax': 'hobbym', 'Dille & Kamille': 'dkam', 'Countrylifestyle': 'country', 'Animals Giftshop': 'anim', 'Kado-versturen': 'kado', 'Spaarpotten-winkel': 'spaar', 'Smartphoto': 'smartp', 'Fotofabriek': 'fotof', 'Myka': 'myka', 'MYKA': 'myka', 'CoolGift': 'cg', 'Superzero': 'superz', 'Massamarkt': 'massa', 'Yourdecoration': 'yourd', '999 Games': 'g999', 'Knuffelparadijs': 'knufp', 'Cartoon Megastore': 'cartn', 'Louiz': 'louiz', 'IJzersterke geschenken': 'ijz', 'Dr. Martens': 'drm', 'Looking Good': 'lgt', 'Teufel': 'tf', 'Bourgini': 'bourg', 'Gift Republic': 'grotek', 'WoodWick': 'woodw', 'Boardgameshop': 'bgs', 'Stroopwafels.com': 'stroop', 'Gadgets en trends': 'gadget', 'Dropwinkel': 'dw', 'Wijnkring': 'wk', 'Repeat Cashmere': 'repeat', 'Kambukka': 'kamb', 'Toppers in Concert': 'topc', 'Fiftiesstore': 'fiftie', 'Yesgifts': 'yesg', 'Boekenwereld.com': 'boekw'}
NAAM = {'Myka': 'MYKA', '999 Games': '999Games', 'Yourdecoration': 'YourDecoration', 'Looking Good': 'Looking Good Today'}
# zelfde voorvoegsel en winkelnaam als de producten die er al staan (11-11-2026)
PRE.update({'Decantalo': 'dc', 'Wijny': 'wny', 'Butchery.nl': 'butchery'}); NAAM.update({'Butchery.nl': 'Butchery'})
def DRANK(a):
    if a[0] != 'eten-drinken': return a[0], a[1]
    g, v = a[1], a[2]
    if g in ('sterke-drank', 'bier-sterke-drank'): return 'dranken', (v if v in ('whisky', 'gin', 'rum', 'wodka', 'tequila', 'likeur', 'cognac') else 'bier')
    m = {'bier': 'bier', 'wijn': 'wijn', 'bubbels': 'bubbels', 'wijn-bubbels': ('bubbels' if v in ('champagne', 'prosecco-cava') else 'wijn'), 'drankaccessoires': 'wijnaccessoires', 'alcoholvrij': 'alcoholvrij'}
    return ('dranken', m[g]) if g in m else (a[0], a[1])
# vakken uit data.js
vak_ok = set(subprocess.run(['node', '-e', """const fs=require('fs');const w={};new Function('window','document',fs.readFileSync('assets/js/data.js','utf8'))(w,{});
for(const a of w.LK_CATEGORIEEN)for(const g of a.subs||[])for(const v of g.vakjes||[])console.log(a.slug+'/'+g.slug+'/'+v.slug)"""], cwd=ROOT, capture_output=True, text=True).stdout.split())
# 4.0: ook de namen van voor de nieuwe indeling blijven geldig (de bouw zet ze zelf op de nieuwe plek)
try: vak_ok |= set(json.load(open(os.path.join(ROOT, 'scripts/boom/verhuisd.json'), encoding='utf-8')).get('vak', {}).keys())
except Exception: pass
bestaand = open(os.path.join(ROOT, 'assets/js/producten.js'), encoding='utf-8').read()
titels = set(re.sub(r'[^a-z0-9]', '', t.lower())[:30] for t in re.findall(r'"titel":\s*"((?:[^"\\]|\\.)*)"', bestaand))
uit = []; vak = {}; over = []
for i, keus in KEUZE.items():
    x = K.get(str(i))
    if not x: over.append((i, 'kandidaat bestaat niet')); continue
    if not CODE.search(x['l']): over.append((i, 'geen partnercode')); continue
    if keus['vak'] not in vak_ok: over.append((i, 'vak bestaat niet: ' + keus['vak'])); continue
    if not (float(x['p']) > 0): over.append((i, 'geen prijs')); continue
    fp = os.path.join(FOTOS, '%03d.bron' % int(i))
    if not os.path.exists(fp): over.append((i, 'geen foto')); continue
    pid = PRE.get(x['w'], re.sub(r'[^a-z]', '', x['w'].lower())[:6]) + '-' + hashlib.md5(x['l'].encode()).hexdigest()[:10]
    # Amazon: zelfde vorm als de 137 die er al staan (amz-<ASIN>), 13-11-2026
    am = re.search(r'amazon\.nl/dp/([A-Z0-9]{10})', x['l'])
    if x['w'] == 'Amazon' and am: pid = 'amz-' + am.group(1).lower()
    if '"' + pid + '"' in bestaand: over.append((i, 'staat al op de site: ' + pid)); continue
    # --titels-nagelezen (11-11-2026): voor een reeks van één merk (Atelier Rebul: zelfde naam, andere geur of maat) waarvan de titels met de hand zijn nagelezen
    if '--titels-nagelezen' not in sys.argv and re.sub(r'[^a-z0-9]', '', keus['titel'].lower())[:30] in titels: over.append((i, 'bijna dezelfde titel bestaat al')); continue
    try:
        im = Image.open(fp); im.load(); im = im.convert('RGBA'); bg = Image.new('RGB', im.size, (255, 255, 255)); bg.paste(im, mask=im.split()[3]); im = bg
    except Exception as e: over.append((i, 'foto kapot: ' + str(e)[:60])); continue
    w, h = im.size; z = max(w, h); sq = Image.new('RGB', (z, z), (255, 255, 255)); sq.paste(im, ((z - w) // 2, (z - h) // 2))
    sq.resize((640, 640), Image.LANCZOS).save(os.path.join(ROOT, 'images/producten/%s.webp' % pid), 'WEBP', quality=82)
    sq.resize((400, 400), Image.LANCZOS).save(os.path.join(ROOT, 'images/producten/%s-klein.webp' % pid), 'WEBP', quality=80)
    a = keus['vak'].split('/')
    cs = DRANK(a)  # drank hoort bij het label 'dranken' (anders ontbreekt het op 'Whisky, bier & drank' bij Voor hem), 11-11-2026
    uit.append({"id": pid, "titel": keus['titel'], "prijs": float(x['p']), "shop": NAAM.get(x['w'], x['w']), "url": x['l'], "winkelUrl": x['l'], "beeld": "images/producten/" + pid, "cat": cs[0], "sub": cs[1], "subVast": True, "ookIn": keus.get('ookIn', []), "voor": keus.get('voor', ['iedereen']), "moment": keus.get('moment', ['verjaardag', 'kerst', 'zomaar']), "waarom": keus['waarom'], "status": "goedgekeurd", "nieuw": True, "gecontroleerd": vandaag, "sinds": vandaag, "herkomst": "piloot"})
    vak[pid] = a; titels.add(re.sub(r'[^a-z0-9]', '', keus['titel'].lower())[:30])
if uit:
    tekst = '\n/* ===== ' + blok + ': ' + str(len(uit)) + ' producten (automatische piloot, poort: partnercode, vak, foto, geen dubbel) ===== */\nwindow.LK_PRODUCTEN.push.apply(window.LK_PRODUCTEN, ' + json.dumps(uit, ensure_ascii=False) + ');\n/* ===== einde ' + blok + ' ===== */\n'
    open(os.path.join(ROOT, 'assets/js/producten.js'), 'a', encoding='utf-8').write(tekst)
    p = os.path.join(ROOT, 'scripts/boom/correcties.json'); c = json.load(open(p, encoding='utf-8'))
    c['vak'].update(vak); c['_uitleg'] += ' ' + blok + ': ' + str(len(uit)) + ' producten erbij (piloot).'
    json.dump(c, open(p, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('toegevoegd:', len(uit), 'overgeslagen:', len(over))
for i, r in over: print('  overgeslagen', i, r)
for u in uit: print('  +', u['id'], u['shop'], u['prijs'], u['titel'][:60])
