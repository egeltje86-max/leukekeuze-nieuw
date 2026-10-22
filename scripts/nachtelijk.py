"""Elke nacht: alle feeds ophalen bij Daisycon, de zoekindex opnieuw maken en online zetten.
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
}
ok = 0
for naam, q in FEED.items():
    xml = os.path.join(FEEDS, naam + '.xml'); js = os.path.join(FEEDS, naam + '.json')
    try:
        tmp = xml + '.nieuw'
        with urllib.request.urlopen(urllib.request.Request(B + q, headers={'User-Agent': 'Mozilla/5.0'}), timeout=600) as r, open(tmp, 'wb') as f:
            shutil.copyfileobj(r, f)
        os.replace(tmp, xml)
        subprocess.run([sys.executable, os.path.join(HIER, 'uittreksel.py'), xml, js + '.nieuw'], check=True, capture_output=True)
        n = len(json.load(open(js + '.nieuw', encoding='utf-8')))
        if n == 0:
            log('LEEG, oude versie blijft:', naam); os.remove(js + '.nieuw'); continue
        os.replace(js + '.nieuw', js); ok += 1
        log('ok', naam, n, 'producten')
    except Exception as e:
        log('FOUT', naam, e, '(oude versie blijft)')
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
git('add', 'assets/zoek/winkels.json')
if git('diff', '--cached', '--quiet').returncode == 0:
    log('Niets veranderd.'); sys.exit(0)
git('commit', '-q', '-m', 'Zoekindex bijgewerkt (' + datetime.date.today().isoformat() + ')')
p = git('push', '-q')
log('online gezet' if p.returncode == 0 else 'push mislukt')
