"""Piloot: foto's van kandidaten ophalen. Draait op de LAPTOP van Marius (de cloud kan niet bij de winkels).
Gebruik (op de laptop):  python haalfotos.py <kandidaten.json> <uitmap>
Maakt <uitmap>/NNN.bron per kandidaat (NNN = veld 'i') en <uitmap>.zip. Daarna de zip naar de cloud halen en voegtoe.py draaien."""
import json, os, sys, urllib.request, concurrent.futures, shutil
kand = json.load(open(sys.argv[1], encoding='utf-8')); uit = sys.argv[2]; os.makedirs(uit, exist_ok=True)
def haal(x):
    try:
        rq = urllib.request.Request(x['f'].replace(' ', '%20'), headers={'User-Agent': 'Mozilla/5.0'})
        open(os.path.join(uit, '%03d.bron' % x['i']), 'wb').write(urllib.request.urlopen(rq, timeout=25).read()); return 1
    except Exception: return 0
with concurrent.futures.ThreadPoolExecutor(12) as ex: n = sum(ex.map(haal, kand))
shutil.make_archive(uit, 'zip', uit)
print('KLAAR', n, 'van', len(kand), '->', uit + '.zip')
