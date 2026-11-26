"""Automatische piloot, dagelijkse run (8-11-2026, FABLE-OPDRACHT deel 2).
Doet, in deze volgorde:
  1. nieuwste code ophalen (origin/main erin mergen)
  2. nazorg: prijzen en voorraad uit het nachtrapport van de laptop overnemen (met de veiligheidsgrenzen van nazorg.py)
  3. bouwen (maak-paginas.js) en alle controles draaien (scripts/controle/alles.js)
  4. schoon? dan vastleggen en live zetten (push naar main en verbouwing-boom). Niet schoon? dan NIET pushen.
  5. een regel in PILOOT-LOGBOEK.md en een rapport in keurkamer/data/piloot-<datum>.json

Gebruik: python3 scripts/piloot/dag.py [--wacht <wacht-laatste.json>] [--niet-pushen] [--alleen-controle] [--inhaal]
  --inhaal  (21-11-2026) tweede run van de dag: doet alleen iets als er een nieuw ochtendrapport van de laptop is dat nog niet
            is toegepast (de laptop stond om 09:00 uit en draaide later). Anders stopt hij meteen, zonder bouwen of logboekregel.
De ochtendrun op de laptop draait sinds 21-11-2026 om 09:00 (was 21:00); de piloot daarom om 10:17, met een inhaalrun om 13:17.
Afsluitcode 0 = alles goed; 2 = niet schoon (niet live gezet); 3 = nazorg gestopt (feeds raar).
De uitvoer eindigt altijd met een regel 'PILOOT: ...' die de agent aan Marius kan doorgeven."""
import os, sys, json, subprocess, datetime, shutil
HIER = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(os.path.dirname(HIER))
DATA = os.path.join(ROOT, 'keurkamer', 'data'); os.makedirs(DATA, exist_ok=True)
vandaag = datetime.date.today().isoformat()
rap = {'datum': vandaag, 'stappen': [], 'nazorg': None, 'controle': None, 'live': False, 'melden': []}

def arg(naam, standaard=None):
    if naam in sys.argv:
        i = sys.argv.index(naam); return sys.argv[i + 1] if i + 1 < len(sys.argv) else True
    return standaard
def run(cmd, **kw):
    r = subprocess.run(cmd, cwd=ROOT, capture_output=True, text=True, **kw)
    return r.returncode, (r.stdout or '') + (r.stderr or '')
def stap(naam, ok, tekst=''):
    rap['stappen'].append({'stap': naam, 'ok': ok, 'tekst': tekst[-2000:]}); print(('OK   ' if ok else 'FOUT ') + naam + (': ' + tekst.strip().splitlines()[-1] if tekst.strip() else ''))
def klaar(code, zin):
    rap['uitkomst'] = zin
    json.dump(rap, open(os.path.join(DATA, 'piloot-%s.json' % vandaag), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    if not rap.get('logGeschreven'):
      try:
        with open(os.path.join(ROOT, 'PILOOT-LOGBOEK.md'), 'a', encoding='utf-8') as f: f.write('- %s: %s\n' % (datetime.datetime.now().strftime('%Y-%m-%d %H:%M'), zin))
      except Exception: pass
    print('PILOOT: ' + zin); sys.exit(code)

# 1. nieuwste code
# 26-11-2026: alleen main ophalen. Een kale 'git fetch origin' haalde in de ondiepe kloon de hele
# geschiedenis van alle takken binnen (14 GB, schijf bijna vol, run liep vast).
c, t = run(['git', 'fetch', '-q', 'origin', '+refs/heads/main:refs/remotes/origin/main']); stap('ophalen', c == 0, t)
c, t = run(['git', 'merge-base', '--is-ancestor', 'origin/main', 'HEAD'])
if c != 0:
    c, t = run(['git', 'merge', 'origin/main', '--no-edit', '-q']); stap('main erin mergen', c == 0, t)
    if c != 0: klaar(2, 'Kon origin/main niet mergen (conflict). Niets veranderd, niets live gezet. Marius hoeft niets te doen; de volgende run probeert het opnieuw, maar als dit blijft: melden.')

# 2. nazorg (prijzen en voorraad)
wacht = arg('--wacht') or os.path.join(ROOT, 'keurkamer', 'nazorg', 'wacht-laatste.json')  # standaard: het ochtendrapport dat de laptop in de repo zet
vers = False; stempel = ''
TOEGEPAST = os.path.join(ROOT, 'keurkamer', 'nazorg', 'toegepast.json')  # 21-11-2026: welk rapport al is toegepast (gaat mee in de commit)
try: al = json.load(open(TOEGEPAST, encoding='utf-8')).get('gemaakt', '')
except Exception: al = ''
if wacht and os.path.exists(wacht):
    try:
        stempel = json.load(open(wacht, encoding='utf-8')).get('gemaakt', '')
        vers = (datetime.date.today() - datetime.date.fromisoformat(stempel[:10])).days <= 1
    except Exception: vers = False
    if not vers: stap('nazorg', True, 'ochtendrapport is ouder dan 1 dag, niet toegepast (laptop stond uit?)'); rap['melden'].append('Geen vers ochtendrapport van de laptop (prijzen niet bijgewerkt).')
if arg('--inhaal') and not (vers and stempel and stempel != al and stempel[:10] == vandaag):
    print('PILOOT: inhaalrun: geen nieuw ochtendrapport van vandaag om toe te passen, niets gedaan.'); sys.exit(0)
if vers and stempel and stempel == al:
    stap('nazorg', True, 'ochtendrapport %s is al toegepast' % stempel); vers = False
if wacht and os.path.exists(wacht) and vers:
    c, t = run(['node', 'scripts/keurkamer/effectief-site.js']); stap('site-prijzen verzamelen', c == 0, t)
    c, t = run([sys.executable, 'scripts/keurkamer/nazorg.py', wacht]); stap('nazorg toepassen', c in (0, 3), t)
    try: rap['nazorg'] = json.loads(t[t.index('{'):t.rindex('}') + 1]) if c == 0 else {'gestopt': t.strip().splitlines()[0] if t.strip() else 'onbekend'}
    except Exception: rap['nazorg'] = {'ruw': t[-500:]}
    if c == 3: rap['melden'].append('Nazorg gestopt: ' + str(rap['nazorg'].get('gestopt', '')))
    if rap['nazorg'] and rap['nazorg'].get('gemeld'): rap['melden'].append('%d meldingen van de nazorg (grote prijssprongen of bol niet weggehaald), zie het rapport.' % len(rap['nazorg']['gemeld']))
    if c == 0:
        try:
            try: tg = json.load(open(TOEGEPAST, encoding='utf-8'))
            except Exception: tg = {}
            tg.update({'gemaakt': stempel, 'toegepast': datetime.datetime.now().isoformat(timespec='minutes')})
            json.dump(tg, open(TOEGEPAST, 'w', encoding='utf-8'))
        except Exception: pass
elif not (wacht and os.path.exists(wacht)):
    stap('nazorg', True, 'geen nachtrapport gevonden, overgeslagen')

# 2a. prijswacht (23-11-2026, opdracht Marius: 'prijzen moeten kloppen'): de laptop kijkt drie keer per dag de winkelpagina's na
# (scripts/keurkamer/prijswacht.py) en zet wat anders is meteen op de site via assets/data/prijzen-nu.json. Hier gaat het vast in
# correcties.json, met de grenzen van nazorg.py. Na de feeds, want de winkelpagina is de echte prijs.
PW = os.path.join(ROOT, 'keurkamer', 'nazorg', 'prijswacht-laatste.json')
try:
    tg = json.load(open(TOEGEPAST, encoding='utf-8')) if os.path.exists(TOEGEPAST) else {}
    st_pw = json.load(open(PW, encoding='utf-8')).get('gemaakt', '') if os.path.exists(PW) else ''
    if st_pw and st_pw != tg.get('prijswacht') and (datetime.date.today() - datetime.date.fromisoformat(st_pw[:10])).days <= 2:
        if not (wacht and os.path.exists(wacht) and vers):
            c, t = run(['node', 'scripts/keurkamer/effectief-site.js']); stap('site-prijzen verzamelen', c == 0, t)
        c, t = run([sys.executable, 'scripts/keurkamer/nazorg.py', PW]); stap('prijswacht toepassen', c in (0, 3), t)
        try: rap['prijswacht'] = json.loads(t[t.index('{'):t.rindex('}') + 1])
        except Exception: rap['prijswacht'] = {'ruw': t[-300:]}
        if c == 0:
            tg['prijswacht'] = st_pw; json.dump(tg, open(TOEGEPAST, 'w', encoding='utf-8'))
        elif c == 3: rap['melden'].append('Prijswacht niet toegepast: ' + str(rap['prijswacht'].get('gestopt', '')))
except Exception as e:
    stap('prijswacht', False, str(e))

# 2b. linktest (11-11-2026): de laptop klikt eens per 30 dagen de winkelknoppen na. Kapotte knoppen melden (twee dagen lang), niets zelf veranderen:
# herstellen gaat volgens CLAUDE.md hoofdstuk 10 (winkel in TT_OMWEG en TT_TC, of het product op uitverkocht).
try:
    lt = json.load(open(os.path.join(ROOT, 'keurkamer', 'nazorg', 'linktest-laatste.json'), encoding='utf-8'))
    if lt.get('kapot') and (datetime.date.today() - datetime.date.fromisoformat(lt.get('datum', ''))).days <= 1:
        rap['melden'].append('Linktest: %d winkelknoppen komen op een pagina die niet bestaat (%s). Zie CLAUDE.md hoofdstuk 10.' % (len(lt['kapot']), ', '.join(x.get('id', '?') for x in lt['kapot'][:8])))
except Exception: pass

if arg('--alleen-controle'):
    c, t = run(['node', 'scripts/controle/alles.js', '.', 'keurkamer/data']); stap('controle', c == 0, t)
    klaar(0 if c == 0 else 2, 'Alleen controle: ' + ('schoon.' if c == 0 else 'NIET schoon, zie keurkamer/data/controle-laatste.json.'))

# 3. bouwen en controleren
c, t = run(['node', 'scripts/maak-paginas.js'], timeout=1800); stap('bouwen', c == 0, t)
if c != 0: klaar(2, 'Bouwen mislukt. Niets live gezet. ' + t.strip().splitlines()[-1][:160])
c, t = run(['node', 'scripts/controle/alles.js', '.', 'keurkamer/data'], timeout=1800); stap('controle', c == 0, t)
try: rap['controle'] = json.load(open(os.path.join(DATA, 'controle-laatste.json'), encoding='utf-8'))
except Exception: rap['controle'] = None
if c != 0:
    fout = [k for k, v in (rap['controle'] or {}).get('onderdelen', {}).items() if not v.get('ok')]
    klaar(2, 'Controle NIET schoon (%s). Niets live gezet; de agent kijkt ernaar.' % ', '.join(fout))

# 4. vastleggen en live zetten
c, t = run(['git', 'status', '--porcelain']); veranderd = bool(t.strip())
if not veranderd: klaar(0, 'Niets veranderd vandaag; controle schoon.')
nz = rap['nazorg'] or {}
pw = rap.get('prijswacht') or {}
zin = 'Piloot %s: %s prijzen bijgewerkt, %s uitverkocht van de lijsten, %s bij bol niet meer te koop, %s weer te koop, prijswacht %s prijzen en %s weg; controle schoon' % (vandaag, nz.get('prijs', 0), nz.get('uitverkocht', 0), nz.get('bolWeg', 0), nz.get('terug', 0), pw.get('prijs', 0), pw.get('uitverkocht', 0))
if arg('--niet-pushen'): klaar(0, zin + ' (niet gepusht, op verzoek).')
# logboekregel vóór het vastleggen, zodat hij in dezelfde commit zit (controle Opus 8-11-2026)
try:
    with open(os.path.join(ROOT, 'PILOOT-LOGBOEK.md'), 'a', encoding='utf-8') as f: f.write('- %s: %s\n' % (datetime.datetime.now().strftime('%Y-%m-%d %H:%M'), zin + ', live gezet.'))
    rap['logGeschreven'] = True
except Exception: pass
run(['git', 'add', '-A'])
c, t = run(['git', 'commit', '-q', '-m', zin + '\n\nCo-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>']); stap('vastleggen', c == 0, t)
c, t = run(['git', 'push', '-q', 'origin', 'HEAD:main']); stap('live zetten', c == 0, t)
if c != 0: klaar(2, zin + ', maar pushen mislukte: ' + t.strip().splitlines()[-1][:160])
rap['live'] = True
# 26-11-2026: werktak apart. Mislukt dit (bijv. ondiepe kloon kan niet bewijzen dat het een gewone
# vooruitstap is), dan staat de site toch live; alleen een notitie, geen fout.
c2, t2 = run(['git', 'push', '-q', 'origin', 'HEAD:verbouwing-boom']); stap('werktak bijwerken', c2 == 0, t2)
klaar(0, zin + ', live gezet.' + (' MELDEN: ' + ' '.join(rap['melden']) if rap['melden'] else ''))
