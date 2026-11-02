"""Keurkamer, stap 5: de keuring van Marius verwerken.
Leest het bestand dat de Keurkamer-app downloadt (keurkamer-JJJJ-MM-DD.json), bewaart elk oordeel blijvend in
keurkamer/oordelen.json (het geheugen: wat weg is blijft weg) en past producten.js aan.

Gebruik:
  python3 scripts/keurkamer/verwerk.py <keurkamer-export.json>              -> alleen laten zien wat er zou veranderen (rapport)
  python3 scripts/keurkamer/verwerk.py <keurkamer-export.json> --toepassen  -> oordelen bewaren én producten.js aanpassen
Daarna: node scripts/splits-producten.js, bouwen, en na de GO van Marius online zetten."""
import json, os, re, sys, datetime, collections
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
KK = os.path.join(ROOT, 'keurkamer'); OORD = os.path.join(KK, 'oordelen.json'); TAKEN = os.path.join(KK, 'taken.json')
HERNOEM = {}
try:
    import subprocess
    HERNOEM = json.loads(subprocess.run(['node', '-e', "console.log(JSON.stringify(require('./scripts/indeling.js').OOKIN_HERNOEM))"], cwd=ROOT, capture_output=True, text=True).stdout or '{}')
except Exception: pass
def lees(pad, leeg):
    try: return json.load(open(pad, encoding='utf-8'))
    except FileNotFoundError: return leeg
def url_sleutel(u): return re.sub(r'/+$', '', re.sub(r'[?#].*$', '', str(u or '').lower()))

def leer(E, idx, regels, vandaag, toepassen):
    AI = lees(os.path.join(KK, 'ai-oordelen.json'), {})
    if not AI: return
    eens = oneens = 0; vb = []
    for pid, k in (E.get('producten') or {}).items():
        a = AI.get(pid); 
        if not a or pid not in idx: continue
        try: p = json.loads(regels[idx[pid]].rstrip().rstrip(',').strip())
        except Exception: continue
        for vak, besluit in (k.get('vak') or {}).items():
            adv = ((a.get('vak') or {}).get(vak) or {}).get('advies')
            if not adv or besluit == 'twijfel': continue
            zelfde = (adv == besluit) or (adv == 'houden' and besluit == 'houden') or (adv in ('verplaatsen', 'niet-hier') and besluit in ('verplaatsen', 'niet-hier'))
            if zelfde: eens += 1
            else:
                oneens += 1
                vb.append({'id': pid, 'titel': p.get('titel', '')[:70], 'vak': vak, 'ai': adv + ((' -> ' + str(((a.get('vak') or {}).get(vak) or {}).get('naar'))) if adv == 'verplaatsen' else ''), 'aiReden': ((a.get('vak') or {}).get(vak) or {}).get('reden', ''), 'marius': besluit + ((' -> ' + str(k.get('naar'))) if besluit == 'verplaatsen' and k.get('naar') else ''), 'opmerking': k.get('opmerking', '')})
    if not (eens + oneens): return
    print('\nAI-advies vergeleken met de keuring van Marius: %d keer eens, %d keer anders (%.0f%% eens).' % (eens, oneens, 100.0 * eens / (eens + oneens)))
    if not toepassen: return
    L = lees(os.path.join(KK, 'leer.json'), {'rondes': []}); L['rondes'].append({'datum': vandaag, 'eens': eens, 'oneens': oneens, 'voorbeelden': vb[:200]})
    json.dump(L, open(os.path.join(KK, 'leer.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    if vb:
        pad = os.path.join(KK, 'ai', 'LESSEN.md'); oud = open(pad, encoding='utf-8').read() if os.path.exists(pad) else '# Lessen uit de keuring van Marius\n\nHier staat waar Marius het NIET eens was met het AI-advies. Neem zijn smaak over.\n'
        nieuw = ['', '## Keuring van %s (%d keer eens, %d keer anders)' % (vandaag, eens, oneens)]
        for x in vb[:60]: nieuw.append('- %s (%s): AI zei %s (%s); Marius: %s%s' % (x['titel'], x['vak'], x['ai'], x['aiReden'], x['marius'], (' - "%s"' % x['opmerking']) if x['opmerking'] else ''))
        open(pad, 'w', encoding='utf-8').write(oud.rstrip('\n') + '\n' + '\n'.join(nieuw) + '\n')

def main(export, toepassen):
    E = json.load(open(export, encoding='utf-8'))
    if E.get('soort') != 'keurkamer': print('Dit is geen Keurkamer-bestand.'); sys.exit(1)
    O = lees(OORD, {'producten': {}, 'vakjes': {}, 'zwart': {}})
    T = lees(TAKEN, [])
    vandaag = datetime.date.today().isoformat()
    # producten.js inlezen (één product per regel)
    pad = os.path.join(ROOT, 'assets/js/producten.js'); regels = open(pad, encoding='utf-8').read().split('\n')
    idx = {}
    for i, l in enumerate(regels):
        m = re.match(r'\s*\{"id": "([^"]+)"', l)
        if m: idx[m.group(1)] = i
    tel = collections.Counter(); vb = collections.defaultdict(list); twijfel = []; onbekend = []
    for pid, k in (E.get('producten') or {}).items():
        if pid not in idx: onbekend.append(pid); continue
        regel = regels[idx[pid]].rstrip(); komma = regel.endswith(','); p = json.loads(regel.rstrip(',').strip())
        thuis = p['cat'] + '/' + p['sub']
        o = O['producten'].get(pid, {})
        vak = k.get('vak') or {}
        nieuw = dict(o)
        # 1. weg?
        if any(b == 'weg' for b in vak.values()):
            nieuw['oordeel'] = 'weg'; nieuw['nietIn'] = []
            O['zwart'][url_sleutel(p.get('winkelUrl'))] = pid
            if p.get('status') == 'goedgekeurd': p['status'] = 'afgekeurd'; p['afgekeurdReden'] = 'keurkamer ' + vandaag
            tel['weg'] += 1; vb['weg'].append(p['titel'][:60])
        else:
            if nieuw.get('oordeel') == 'weg':
                # eerder weg, nu toch houden: terugzetten
                nieuw['oordeel'] = 'houden'; O['zwart'].pop(url_sleutel(p.get('winkelUrl')), None)
                if p.get('status') == 'afgekeurd': p['status'] = 'goedgekeurd'; p.pop('afgekeurdReden', None); tel['terug'] += 1
            elif any(b in ('houden', 'verplaatsen', 'niet-hier') for b in vak.values()): nieuw['oordeel'] = 'houden'
            elif any(b == 'twijfel' for b in vak.values()) and not nieuw.get('oordeel'): nieuw['oordeel'] = 'twijfel'
            # 2. verplaatsen (eigen vakje)
            for v, b in vak.items():
                if b == 'verplaatsen' and k.get('naar') and re.match(r'^[a-z0-9-]+/[a-z0-9-]+$', k['naar']):
                    nieuw['naar'] = k['naar']; d = k['naar'].split('/'); p['cat'], p['sub'] = d[0], d[1]; p['subVast'] = True
                    p['ookIn'] = [x for x in p.get('ookIn', []) if (HERNOEM.get(x, x)) != k['naar']]
                    tel['verplaatst'] += 1; vb['verplaatst'].append(p['titel'][:50] + ' -> ' + k['naar'])
                elif b == 'niet-hier':
                    ni = set(nieuw.get('nietIn') or []); ni.add(v); nieuw['nietIn'] = sorted(ni)
                    p['ookIn'] = [x for x in p.get('ookIn', []) if (HERNOEM.get(x, x)) != v]
                    tel['niet-hier'] += 1; vb['niet-hier'].append(p['titel'][:50] + ' niet in ' + v)
                elif b == 'twijfel':
                    twijfel.append({'id': pid, 'titel': p['titel'], 'vak': v, 'opmerking': k.get('opmerking', '')}); tel['twijfel'] += 1
        # 3. topper, tekst, verbeterpunten
        if k.get('topper') is True: nieuw['topper'] = True; p['favoriet'] = True; tel['topper'] += 1
        elif k.get('topper') is False and p.get('favoriet'): nieuw['topper'] = False; p.pop('favoriet', None)
        if k.get('waarom') and k['waarom'].strip() and k['waarom'].strip() != p.get('waarom', '').strip():
            nieuw['waarom'] = k['waarom'].strip(); p['waarom'] = nieuw['waarom']; tel['tekst'] += 1
        if k.get('verbeter') or (k.get('opmerking') and not any(b in ('weg', 'twijfel') for b in vak.values())):
            T.append({'id': pid, 'titel': p['titel'], 'verbeter': k.get('verbeter', []), 'opmerking': k.get('opmerking', ''), 'datum': vandaag, 'klaar': False}); tel['taak'] += 1
        nieuw['datum'] = vandaag; nieuw['bron'] = 'marius'
        O['producten'][pid] = nieuw
        regels[idx[pid]] = '  ' + json.dumps(p, ensure_ascii=False) + (',' if komma else '')
    # 4. leren: waar was Marius het niet eens met de AI-keurmeester?
    leer(E, idx, regels, vandaag, toepassen)
    for v, s in (E.get('vakjes') or {}).items():
        O['vakjes'][v] = {'status': s.get('status'), 'check': s.get('check', {}), 'opmerking': s.get('opmerking', ''), 'datum': vandaag, 'open': s.get('open', 0)}
        if s.get('status') == 'klaar': tel['vakje-klaar'] += 1
    # rapport
    r = ['# Keurkamer-verwerking ' + vandaag, '', 'Bestand: ' + os.path.basename(export) + ' (gemaakt ' + str(E.get('gemaakt', ''))[:16] + ')', '']
    r.append('- Weg van de site: %d' % tel['weg'] + ('  (weer terug: %d)' % tel['terug'] if tel['terug'] else ''))
    r.append('- Verplaatst naar een ander vakje: %d' % tel['verplaatst'])
    r.append('- Uit een extra vakje gehaald: %d' % tel['niet-hier'])
    r.append('- Twijfel (Claude kijkt mee): %d' % tel['twijfel'])
    r.append('- Toppers: %d · teksten verbeterd: %d · taken voor Claude: %d' % (tel['topper'], tel['tekst'], tel['taak']))
    r.append('- Vakjes klaar: %d' % tel['vakje-klaar'])
    if onbekend: r.append('- Onbekende id\'s (staan niet meer in producten.js): %d' % len(onbekend))
    for soort in ('weg', 'verplaatst', 'niet-hier'):
        if vb[soort]: r.append(''); r.append('Voorbeelden %s:' % soort); r += ['  - ' + x for x in vb[soort][:8]]
    if twijfel: r.append(''); r.append('Twijfel:'); r += ['  - %s (%s) %s' % (t['titel'][:60], t['vak'], t['opmerking']) for t in twijfel[:15]]
    rapport = '\n'.join(r); print(rapport)
    os.makedirs(os.path.join(KK, 'rapporten'), exist_ok=True)
    open(os.path.join(KK, 'rapporten', 'verwerking-' + vandaag + '.md'), 'w', encoding='utf-8').write(rapport + '\n')
    if toepassen:
        json.dump(O, open(OORD, 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
        json.dump(T, open(TAKEN, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
        if twijfel: json.dump(twijfel, open(os.path.join(KK, 'twijfel-' + vandaag + '.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
        open(pad, 'w', encoding='utf-8').write('\n'.join(regels))
        print('\nToegepast: oordelen.json, taken.json en producten.js zijn bijgewerkt. Nu: node scripts/splits-producten.js en bouwen.')
    else:
        print('\n(Nog niets veranderd. Draai met --toepassen om het door te voeren.)')
if __name__ == '__main__':
    if len(sys.argv) < 2: print(__doc__); sys.exit(1)
    main(sys.argv[1], '--toepassen' in sys.argv)
