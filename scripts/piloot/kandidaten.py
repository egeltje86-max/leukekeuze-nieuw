"""Piloot: kandidaten voor nieuwe producten uit de zoekindex (assets/zoek/alle.json.gz), op thema/trend.
Alleen partners (geen bol, geen Coolblue-tweedekans), met foto, nog niet op de site, geen rommel, geen (bijna-)dubbele titel.
Gebruik:
  python3 scripts/piloot/kandidaten.py --thema "kpop|demon hunters|squishmallow" --min 5 --max 60 --n 30 [--winkels "HEMA,Nedgame"] --uit kand.json
Uitvoer: lijst met {t (titel), p (prijs), w (winkel), l (partnerlink), f (foto-url), c (categorie uit feed)}.
De agent kiest hieruit (maximaal 15 per dag), schrijft titel/waarom/vak en haalt de foto's op met scripts/piloot/haalfotos.py (op de laptop)."""
import gzip, json, re, sys, os, random, collections, urllib.parse, subprocess
HIER = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(os.path.dirname(HIER))
def arg(naam, standaard=None):
    if naam in sys.argv: i = sys.argv.index(naam); return sys.argv[i + 1]
    return standaard
thema = re.compile(arg('--thema', '.'), re.I)
lo, hi, n = float(arg('--min', 3)), float(arg('--max', 80)), int(arg('--n', 30))
winkels = set(x.strip() for x in (arg('--winkels', '') or '').split(',') if x.strip())
uitpad = arg('--uit', os.path.join(ROOT, 'keurkamer', 'data', 'kandidaten.json'))

d = json.load(gzip.open(os.path.join(ROOT, 'assets/zoek/alle.json.gz'))); W = d['winkels']
NIET = {'Tenstickers', 'Brekz', 'Fietsparadijs', 'Fietstas.com', 'Expert', 'Meubello', 'InterGard', 'Timeshop24', 'Bedroomshop', 'Lamponline', 'Lightdepot', 'Getled', 'Applamp', 'Besled', 'Mobistoxx', 'Bivolino', 'Steegengamode', 'Fashionize', 'Tandenborstel.com', 'Ikwilzitzakken', 'Isabel Marant', 'Zadig & Voltaire', 'Italian Design', 'Kitchenette', 'Svinando', 'Decantalo', 'Wijny', 'Butchery.nl', 'Coolblue', 'La Redoute', 'Westwing', "Levi's", 'Invicta', 'Bartogi', 'Prydligt', 'bol', 'Amazon', 'Mijn Hummeltje', 'Joybuy', 'Street One', 's.Oliver', 'Suitableshop', 'Watch Enclave', 'Acculaders'}
ROMMEL = re.compile(r'pakket van|multipack|\d+ ?x ?\d+ ?gram|navul|hondentuig|halsband|voer\b|kauw|carnaval|feestartikel|ballon|servet|tafelkleed|batterij|onderdeel|vervang|reserve|kabel|adapter|oplader|lader\b|hoesje|screen ?protector|sticker|schroef|filter|refill|cartridge|inkt|\d+\s?x\s?st|\d+ ?stuks|maat \d|\bsize\b|\bxxl\b|t-shirt|\bshirt|hoodie|sokken|legging|jurk|broek|blouse|condoom|seks|\bsex|erot|vibrator|naakt|wiet|cannabis|vape|sigaret|wapen|\bmes\b|\blp\b|vinyl|\bcd\b|blu-?ray|\bdvd\b|lijm|inpakpapier|opbergbox|ijskrabber|vlag\b|toiletborstel|tweedehands|refurbished|kerstballen|slinger|guirlande|kunstkerstboom|lichtsnoer|\bcase\b|folio|magneten|demo\b', re.I)

def doel(u):
    u = u or ''
    m = re.search(r'awin1\.com/pclick\.php\?(?:.*&)?p=(\d+)', u)
    if m: return 'awin:' + m.group(1)
    for k in ('r', 'dl', 'u', 'url', 'murl'):
        m = re.search(r'[?&]' + k + r'=([^&]+)', u)
        if m:
            v = urllib.parse.unquote(urllib.parse.unquote(m.group(1)))
            m2 = re.search(r'murl=([^&]+)', v)
            if m2: v = urllib.parse.unquote(m2.group(1))
            return re.sub(r'[?#].*$', '', v.lower()).rstrip('/').split('://')[-1].replace('www.', '')
    return re.sub(r'[?#].*$', '', u.lower()).rstrip('/').split('://')[-1].replace('www.', '')

# wat al op de site staat (alle statussen, ook afgekeurd: wat Marius weg deed komt niet terug)
out = subprocess.run(['node', '-e', """
const fs=require('fs');const w={dispatchEvent(){}};global.Event=function(){};
new Function('window','document',fs.readFileSync('assets/js/producten-lean.js','utf8'))(w,{createEvent:()=>({initEvent(){}})});
new Function('window',fs.readFileSync('assets/js/producten-details.js','utf8'))(w);
console.log(JSON.stringify(w.LK_PRODUCTEN.map(p=>[(w.LK_DETAILS[p.id]||{}).url||'',(w.LK_DETAILS[p.id]||{}).winkelUrl||'',p.titel])))"""], cwd=ROOT, capture_output=True, text=True).stdout
site = json.loads(out); al = set(); titels = set()
for u, wu, t in site: al.add(doel(u)); al.add(doel(wu)); titels.add(re.sub(r'[^a-z0-9]', '', t.lower())[:30])

random.seed()
kand = []; gezien = set()
P = d['producten'][:]; random.shuffle(P)
for x in P:
    w = W[x[2]]['naam']
    if w in NIET or (winkels and w not in winkels): continue
    t = x[0]; p = x[1]
    if not t or not x[4] or not p or p < lo or p > hi: continue
    if ROMMEL.search(t): continue
    tl = (t + ' ' + (x[5] or '')).lower()
    if not thema.search(tl): continue
    link = W[x[2]]['link'] + x[3]
    if doel(link) in al or re.sub(r'[^a-z0-9]', '', t.lower())[:30] in titels: continue
    k = re.sub(r'[^a-z]', '', t.lower())[:16]
    if k in gezien: continue
    gezien.add(k)
    kand.append({'t': t, 'p': p, 'w': w, 'l': link, 'f': W[x[2]]['foto'] + x[4], 'c': x[5] or ''})
# spreiding over winkels
per = collections.Counter(); uit = []
for x in kand:
    if per[x['w']] >= max(3, n // 4): continue
    per[x['w']] += 1; uit.append(x)
    if len(uit) >= n: break
for i, x in enumerate(uit): x['i'] = i
json.dump(uit, open(uitpad, 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
print('kandidaten:', len(uit), 'van', len(kand), 'winkels:', dict(per.most_common(8)))
for x in uit: print(' ', x['i'], x['w'], x['p'], '|', x['t'][:80])
