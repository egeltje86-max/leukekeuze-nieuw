"""Keurkamer, stap 3: de AI-keurmeester. Beoordeelt elk product per vakje: past het hier, is het een leuke keuze,
is het te vertrouwen, en wat is het advies (houden / verplaatsen / niet-hier / weg / twijfel) met een korte reden.

De AI verandert NIETS aan de site: de uitkomst is advies voor de Keurkamer, waar Marius beslist.

Gebruik:
  python3 scripts/keurkamer/ai-keur.py maak [--alleen-nieuw]   -> keurkamer/ai/in-001.json ... (porties van ~90 producten)
  python3 scripts/keurkamer/ai-keur.py openai [model]          -> laat OpenAI de porties keuren (OPENAI_API_KEY in de omgeving)
  python3 scripts/keurkamer/ai-keur.py controleer <nummer>     -> controleert één uit-bestand (gebruiken agents / Claude)
  python3 scripts/keurkamer/ai-keur.py verwerk                 -> alle uit-bestanden samenvoegen in keurkamer/ai-oordelen.json
  python3 scripts/keurkamer/ai-keur.py status                  -> hoeveel porties zijn klaar

Motor 'claude': de porties worden door Claude-agents gekeurd volgens keurkamer/ai/OPDRACHT.md (gratis, in de Claude-sessie).
Motor 'openai': hetzelfde werk via de OpenAI-API (kost geld; ~€1-3 voor alle producten met een klein model)."""
import json, os, re, sys, glob, datetime, collections, urllib.request
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
KK = os.path.join(ROOT, 'keurkamer'); AI = os.path.join(KK, 'ai'); DATA = os.path.join(KK, 'data')
os.makedirs(AI, exist_ok=True)
ADVIES = ('houden', 'verplaatsen', 'niet-hier', 'weg', 'twijfel')
PER_PORTIE = 90

def lees(pad, leeg=None):
    try: return json.load(open(pad, encoding='utf-8'))
    except FileNotFoundError: return leeg
def vakjes():
    v = lees(os.path.join(KK, 'vakjes.json')) or lees(os.path.join(KK, 'vakjes-lijst.json'))
    return {x['vak']: x for x in v}

def maak(alleen_nieuw=False):
    C = lees(os.path.join(DATA, 'catalogus.json')); P = C['producten']; V = vakjes()
    oud = lees(os.path.join(KK, 'ai-oordelen.json'), {}) if alleen_nieuw else {}
    for f in glob.glob(os.path.join(AI, 'in-*.json')): os.remove(f)
    # per vakje: eerst de thuis-producten, dan de ookIn-producten
    per_vak = collections.OrderedDict()
    for vak in sorted(C['vakjes'], key=lambda k: (k.split('/')[0], k)):
        rij = []
        for pid in C['vakjes'][vak]['thuis']: rij.append((pid, 'thuis'))
        # extra vakjes alleen als het een echt vakje is (oude persoonsvakjes als 'ookIn' tellen niet meer)
        if vak in V:
            for pid in C['vakjes'][vak]['ookIn']: rij.append((pid, 'ookIn'))
        if alleen_nieuw: rij = [(pid, via) for pid, via in rij if not (oud.get(pid, {}).get('vak', {}).get(vak))]
        if rij: per_vak[vak] = rij
    porties, cur, n = [], [], 0
    OUD = {'cadeaus/voor-haar': 'Voor haar (oud)', 'cadeaus/voor-hem': 'Voor hem (oud)', 'cadeaus/voor-kinderen': 'Kinderen (oud)', 'cadeaus/opa-oma': 'Opa & oma (oud)', 'cadeaus/collega': "Collega's (oud)", 'cadeaus/baby-kraam': 'Baby & kraam (oud)'}
    def blok(vak, rij):
        v = V.get(vak) or {'afdeling': 'Nog indelen', 'naam': OUD.get(vak, vak + ' (oud)'), 'hoort': 'Dit vakje bestaat niet meer op de site. Elk product hier moet verplaatsen naar een echt vakje (zie VAKJES.md); is het geen leuke keuze, dan weg.', 'niet': ''}
        return {'vak': vak, 'afdeling': v.get('afdeling', vak.split('/')[0]), 'naam': v.get('naam', vak), 'hoort': v.get('hoort', ''), 'niet': v.get('niet', ''),
                'producten': [{'id': pid, 'via': via, 'titel': P[pid]['titel'], 'prijs': P[pid]['prijs'], 'shop': P[pid]['shop'], 'merk': P[pid]['merk'],
                               'waarom': P[pid]['waarom'][:220], 'voor': P[pid]['voor'], 'tags': P[pid]['tags'][:6], 'vlag': [x for x in P[pid]['vlag'] if x in ('dubbel', 'lijkt-dubbel', 'geen-echt-vakje', 'titel-engels', 'tekst-engels', 'christelijk-buiten-christelijk', 'drank-buiten-dranken', 'kaars-buiten-kaarsen', 'mijn-hummeltje')],
                               'dubbelMet': [P[d]['titel'][:60] for d in P[pid]['dubbel'][:2]]} for pid, via in rij]}
    for vak, rij in per_vak.items():
        for i in range(0, len(rij), PER_PORTIE):
            stuk = rij[i:i + PER_PORTIE]
            if n + len(stuk) > PER_PORTIE and cur: porties.append(cur); cur, n = [], 0
            cur.append(blok(vak, stuk)); n += len(stuk)
    if cur: porties.append(cur)
    for i, p in enumerate(porties, 1):
        json.dump({'portie': i, 'gemaakt': datetime.date.today().isoformat(), 'vakjes': p}, open(os.path.join(AI, 'in-%03d.json' % i), 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
    tot = sum(len(b['producten']) for p in porties for b in p)
    with open(os.path.join(AI, 'VAKJES.md'), 'w', encoding='utf-8') as f:
        f.write('# Alle vakjes van LeukeKeuze (code: afdeling > naam)\n\n')
        for vak, v in V.items(): f.write('- `%s`: %s > %s\n' % (vak, v.get('afdeling', ''), v.get('naam', vak)))
    print(len(porties), 'porties,', tot, 'beoordelingen (product x vakje)')

def controleer(nr, stil=False):
    """Geeft (ok, melding). Een uit-bestand is een lijst van objecten {id, past, advies, reden, naar?, leuk?, vertrouwen?, vlag?}."""
    fin = os.path.join(AI, 'in-%03d.json' % int(nr)); fuit = os.path.join(AI, 'uit-%03d.json' % int(nr))
    if not os.path.exists(fuit): return False, 'uit-%03d.json bestaat niet' % int(nr)
    try: uit = json.load(open(fuit, encoding='utf-8'))
    except Exception as e: return False, 'geen geldige JSON: %s' % e
    inp = json.load(open(fin, encoding='utf-8')); V = vakjes()
    verwacht = {}
    for b in inp['vakjes']:
        for p in b['producten']: verwacht[(p['id'], b['vak'])] = p['via']
    if isinstance(uit, dict): uit = uit.get('beoordelingen') or uit.get('uit') or list(uit.values())
    fouten, gezien = [], set()
    for r in uit:
        if not isinstance(r, dict) or 'id' not in r: fouten.append('rij zonder id'); continue
        vak = r.get('vak')
        if vak is None:
            kand = [k for k in verwacht if k[0] == r['id']]
            if len(kand) == 1: vak = r['vak'] = kand[0][1]
        if (r['id'], vak) not in verwacht: fouten.append('onbekend: %s @ %s' % (r['id'], vak)); continue
        gezien.add((r['id'], vak))
        if r.get('advies') not in ADVIES: fouten.append('%s: advies "%s" bestaat niet' % (r['id'], r.get('advies')))
        for k in ('past', 'leuk', 'vertrouwen'):
            if k in r and r[k] is not None and not (isinstance(r[k], (int, float)) and 0 <= r[k] <= 100): fouten.append('%s: %s moet 0-100 zijn' % (r['id'], k))
        if 'past' not in r: fouten.append('%s: past ontbreekt' % r['id'])
        if r.get('advies') == 'verplaatsen' and r.get('naar') not in V: fouten.append('%s: naar "%s" is geen vakje' % (r['id'], r.get('naar')))
        if not str(r.get('reden', '')).strip(): fouten.append('%s: reden ontbreekt' % r['id'])
    mis = [k for k in verwacht if k not in gezien]
    if mis: fouten.append('%d beoordelingen ontbreken, bijv. %s' % (len(mis), mis[:3]))
    if fouten: return False, '\n'.join(fouten[:15])
    return True, '%d beoordelingen, in orde' % len(gezien)

def verwerk():
    O = lees(os.path.join(KK, 'ai-oordelen.json'), {})
    n_ok = n_fout = 0; tel = collections.Counter()
    for fin in sorted(glob.glob(os.path.join(AI, 'in-*.json'))):
        nr = int(re.search(r'in-(\d+)\.json', fin).group(1))
        ok, m = controleer(nr)
        if not ok: n_fout += 1; print('portie %03d: %s' % (nr, m.split('\n')[0])); continue
        inp = json.load(open(fin, encoding='utf-8')); uit = json.load(open(os.path.join(AI, 'uit-%03d.json' % nr), encoding='utf-8'))
        if isinstance(uit, dict): uit = uit.get('beoordelingen') or uit.get('uit') or list(uit.values())
        motor = inp.get('motor', 'claude')
        for r in uit:
            o = O.setdefault(r['id'], {'vak': {}})
            vak = r['vak']
            o['vak'][vak] = {'past': r.get('past'), 'advies': r['advies'], 'reden': str(r.get('reden', ''))[:140], 'naar': r.get('naar') if r['advies'] == 'verplaatsen' else None}
            if r.get('leuk') is not None: o['leuk'] = r['leuk']
            if r.get('vertrouwen') is not None: o['vertrouwen'] = r['vertrouwen']
            if r.get('vlag'): o['vlag'] = sorted(set((o.get('vlag') or []) + [str(x) for x in r['vlag']][:6]))
            if r.get('voorFout'): o['voorFout'] = r['voorFout']
            o['motor'] = motor; o['datum'] = inp.get('gemaakt', datetime.date.today().isoformat())
            tel[r['advies']] += 1
        n_ok += 1
    json.dump(O, open(os.path.join(KK, 'ai-oordelen.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
    print('porties verwerkt:', n_ok, '| met fouten of nog niet klaar:', n_fout, '| producten met AI-oordeel:', len(O), '| adviezen:', dict(tel))

def status():
    ins = sorted(glob.glob(os.path.join(AI, 'in-*.json'))); klaar = 0; fout = []
    for f in ins:
        nr = int(re.search(r'in-(\d+)\.json', f).group(1)); ok, m = controleer(nr)
        if ok: klaar += 1
        elif os.path.exists(os.path.join(AI, 'uit-%03d.json' % nr)): fout.append((nr, m.split('\n')[0]))
    print('porties:', len(ins), '| klaar:', klaar, '| nog te doen:', len(ins) - klaar, '| met fouten:', fout[:10])

def openai(model='gpt-4o-mini'):
    sleutel = os.environ.get('OPENAI_API_KEY')
    if not sleutel: print('Zet eerst OPENAI_API_KEY in de omgeving (de sleutel komt van Marius, nooit uit een bestand in de repo).'); sys.exit(1)
    opdracht = open(os.path.join(AI, 'OPDRACHT.md'), encoding='utf-8').read()
    for fin in sorted(glob.glob(os.path.join(AI, 'in-*.json'))):
        nr = int(re.search(r'in-(\d+)\.json', fin).group(1))
        if controleer(nr)[0]: continue
        inp = json.load(open(fin, encoding='utf-8'))
        body = {'model': model, 'temperature': 0.2, 'response_format': {'type': 'json_object'},
                'messages': [{'role': 'system', 'content': opdracht + '\n\nAntwoord met één JSON-object: {"beoordelingen": [...]}.'},
                             {'role': 'user', 'content': json.dumps(inp['vakjes'], ensure_ascii=False)}]}
        req = urllib.request.Request('https://api.openai.com/v1/chat/completions', data=json.dumps(body).encode('utf-8'),
                                     headers={'Authorization': 'Bearer ' + sleutel, 'Content-Type': 'application/json'})
        try:
            with urllib.request.urlopen(req, timeout=300) as r: antwoord = json.load(r)
            tekst = antwoord['choices'][0]['message']['content']
            uit = json.loads(tekst)
            json.dump(uit, open(os.path.join(AI, 'uit-%03d.json' % nr), 'w', encoding='utf-8'), ensure_ascii=False)
            inp['motor'] = 'openai:' + model; json.dump(inp, open(fin, 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
            ok, m = controleer(nr); print('portie %03d:' % nr, 'ok' if ok else 'FOUT ' + m.split('\n')[0], '| tokens:', antwoord.get('usage', {}).get('total_tokens'))
        except Exception as e:
            print('portie %03d: mislukt: %s' % (nr, str(e)[:160]))

if __name__ == '__main__':
    a = sys.argv[1:] or ['status']
    if a[0] == 'maak': maak('--alleen-nieuw' in a)
    elif a[0] == 'controleer': ok, m = controleer(a[1]); print(('OK: ' if ok else 'FOUT:\n') + m); sys.exit(0 if ok else 1)
    elif a[0] == 'verwerk': verwerk()
    elif a[0] == 'status': status()
    elif a[0] == 'openai': openai(*a[1:2])
    else: print(__doc__)
