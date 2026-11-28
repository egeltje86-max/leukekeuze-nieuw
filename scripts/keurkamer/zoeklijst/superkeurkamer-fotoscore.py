# -*- coding: utf-8 -*-
"""Superkeurkamer: hoe mooi is de foto van een product? (27-11-2026, Marius: 'zorg ervoor dat de mooiste en beste producten
als eerste te zien zijn met de mooiste foto's, dat verkoopt beter').
Per foto een cijfer van 0 tot 1: groot en scherp, vierkant-achtig, rustige (witte) achtergrond = hoog; klein, wazig,
een lege plaatjes of een foto vol tekst = laag. Bewaard in data/fotoscore.json (sleutel = stukje van de link van de foto).
- in de server: een rij op de achtergrond die de foto's van de eerste producten van een blok nakijkt terwijl je kijkt;
- los draaien: python fotoscore.py [aantal per blok]  -> kijkt de eerste N van elk blok van de marktlijst na (duurt even)."""
import os, sys, json, hashlib, threading, time, io, queue, urllib.request
from concurrent.futures import ThreadPoolExecutor
try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass
HIER = os.path.dirname(os.path.abspath(__file__))
KAMER = os.path.dirname(HIER)
PAD = os.path.join(KAMER, 'data', 'fotoscore.json')
SLOT = threading.RLock()
SCORES = {}
_geladen = [False]
_vies = [0]
_mt = [0.0]
RIJ = queue.Queue()
_bezig = set()
UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130 Safari/537.36'


def sleutel(url):
    return hashlib.sha1((url or '').encode('utf-8')).hexdigest()[:16]


def laad():
    with SLOT:
        if not _geladen[0]:
            try:
                SCORES.update(json.load(open(PAD, encoding='utf-8')))
            except Exception:
                pass
            _geladen[0] = True
    return SCORES


def bewaar(nu=False):
    with SLOT:
        if not _vies[0] or (not nu and _vies[0] < 50):
            return
        _van_schijf()
        tmp = PAD + '.tmp'
        json.dump(SCORES, open(tmp, 'w', encoding='utf-8'), separators=(',', ':'))
        os.replace(tmp, PAD)
        _mt[0] = os.path.getmtime(PAD)
        _vies[0] = 0


def _van_schijf():
    # 28-11-2026: server en losse run schrijven hetzelfde bestand; neem eerst over wat de ander al nakeek
    with SLOT:
        try:
            mt = os.path.getmtime(PAD)
        except OSError:
            return
        if mt == _mt[0]:
            return
        try:
            for k, v in json.load(open(PAD, encoding='utf-8')).items():
                SCORES.setdefault(k, v)
        except Exception:
            return
        _mt[0] = mt


def cijfer(data):
    """0..1 voor een plaatje (bytes)."""
    from PIL import Image, ImageFilter, ImageStat
    im = Image.open(io.BytesIO(data))
    im.draft('RGB', (600, 600))
    w, h = im.size
    im = im.convert('RGB')
    kort = min(w, h)
    s = 1.0 if kort >= 800 else 0.8 if kort >= 600 else 0.6 if kort >= 450 else 0.35 if kort >= 300 else 0.1
    vorm = max(w, h) / max(1, kort)
    if vorm > 1.8:
        s -= 0.3
    elif vorm > 1.35:
        s -= 0.12
    klein = im.resize((160, int(160 * h / w)) if w >= h else (int(160 * w / h), 160))
    st = ImageStat.Stat(klein.convert('L'))
    if st.stddev[0] < 6:
        return 0.0                      # leeg plaatje of één kleur
    rand = ImageStat.Stat(klein.crop((0, 0, klein.width, 6)).convert('L')).mean[0] + \
        ImageStat.Stat(klein.crop((0, klein.height - 6, klein.width, klein.height)).convert('L')).mean[0]
    if rand / 2 > 235:
        s += 0.1                        # rustige witte achtergrond
    rand_kleur = ImageStat.Stat(klein.crop((0, 0, 6, klein.height)).convert('L')).stddev[0]
    if rand_kleur > 60:
        s -= 0.05                       # drukke rand (sfeerfoto met tekst of collage)
    randen = ImageStat.Stat(klein.convert('L').filter(ImageFilter.FIND_EDGES)).mean[0]
    if randen < 4:
        s -= 0.25                       # wazig of heel vlak
    elif randen > 40:
        s -= 0.15                       # heel druk: vaak een plaatje vol tekst of iconen
    return round(max(0.0, min(1.0, s)), 3)


def haal(url):
    req = urllib.request.Request(url, headers={'User-Agent': UA, 'Accept': 'image/avif,image/webp,image/*,*/*'})
    with urllib.request.urlopen(req, timeout=15) as r:
        if 'html' in (r.headers.get('Content-Type') or ''):
            raise ValueError('geen plaatje')
        return r.read(6 * 1024 * 1024)


def bekijk(url):
    k = sleutel(url)
    try:
        sc = cijfer(haal(url))
    except Exception:
        sc = -1.0                       # foto laadt niet
    with SLOT:
        SCORES[k] = sc
        _vies[0] += 1
        _bezig.discard(k)
    bewaar()
    return sc


def score(url):
    """Bekend cijfer, of None als we de foto nog niet hebben bekeken."""
    if not url:
        return -1.0
    return laad().get(sleutel(url))


def vraag(urls):
    """Zet foto's die we nog niet kennen in de rij (de server kijkt ze op de achtergrond na)."""
    laad()
    with SLOT:
        for u in urls:
            k = sleutel(u)
            if u and k not in SCORES and k not in _bezig:
                _bezig.add(k)
                RIJ.put(u)


def _werker():
    while True:
        u = RIJ.get()
        try:
            bekijk(u)
        except Exception:
            pass


def start(n=6):
    laad()
    for _ in range(n):
        threading.Thread(target=_werker, daemon=True).start()

    def opslaan():
        while True:
            time.sleep(20)
            try:
                _van_schijf()
                bewaar(True)
            except Exception:
                pass
    threading.Thread(target=opslaan, daemon=True).start()


if __name__ == '__main__':
    # los: de eerste N producten van elk blok van de marktlijst (zoals de server ze sorteert) nakijken
    per = int(sys.argv[1]) if len(sys.argv) > 1 else 48
    sys.path.insert(0, HIER)
    import server
    laad()
    cats = server.cats_laden()['cats']
    urls = []
    for k in cats:
        if not k.get('zoek'):
            continue
        try:
            d = server.api_zoek({'cat': [k['id']], 'slim': ['1'], 'min': [str(k.get('min') or '')], 'max': [str(k.get('max') or '')]}, fotos_vragen=False)
            urls += [p['f'] for p in d.get('producten', [])[:per] if p.get('f')]
        except Exception as e:
            print('fout bij', k['naam'], e)
    nieuw = [u for u in dict.fromkeys(urls) if sleutel(u) not in SCORES]
    print('foto\'s na te kijken:', len(nieuw), flush=True)
    t0 = time.time()
    with ThreadPoolExecutor(8) as ex:
        for i, _ in enumerate(ex.map(bekijk, nieuw), 1):
            if i % 500 == 0:
                print(i, 'in', round(time.time() - t0), 's', flush=True)
                bewaar(True)
    bewaar(True)
    print('klaar', len(nieuw), 'in', round(time.time() - t0), 's')
