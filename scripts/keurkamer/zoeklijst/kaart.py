import json,re,unicodedata,collections,sys,os
H=os.path.dirname(os.path.abspath(__file__))
def plat(s):
    s=unicodedata.normalize('NFD',str(s or '').lower()); s=''.join(c for c in s if unicodedata.category(c)!='Mn')
    return re.sub(r'[^a-z0-9 ]+',' ',s)
S=json.load(open(os.path.join(H,'site.json')))
C=json.load(open(sys.argv[1] if len(sys.argv)>1 else 'skk/nieuw/mijn-categorieen.json'))['cats']
ALT=['vervangende','reserveonderdeel','navulling','refill','bevestigingsmateriaal','bewegingssensor','stopcontact','babyfoon','muggen','penis','piemel','milf','sexy','erotisch','erotiek','tieten','vibrator','kutkerst','seksspel']
def term(t):
    w=re.sub(r'\s+',' ',plat(t)).strip()
    return (' ' if t.startswith(' ') else '')+w+(' ' if t.endswith(' ') else '')
soorten=[c for c in C if c.get('zoek')]
groep={c['id']:c['naam'] for c in C if not c['ouder']}
uit=collections.defaultdict(list); geen=[]
for p in S:
    txt=' '+re.sub(r'\s+',' ',plat(p['t']+' '+p['m']+' '+p['v'].replace('/',' ').replace('-',' ')))+' '
    hit=[c['id'] for c in soorten if (c['min']*0.8<=p['p']<=c['max']*1.25) and any(term(z) in txt for z in c['zoek'] if len(term(z).strip())>=3) and not any(term(n) in txt for n in list(c.get('niet',[]))+ALT if len(term(n).strip())>=3)]
    vk=[(len(v),c['id']) for c in soorten for v in c.get('vak',[]) if p['v'].startswith(v)]
    thuis=max(vk)[1] if vk else None
    if thuis and thuis not in hit: hit.append(thuis)
    if hit:
        for h in hit: uit[h].append(p['id'])
    else: geen.append(p)
json.dump({'per_soort':uit,'geen':[p['id'] for p in geen]},open(os.path.join(H,'kaart.json'),'w'))
print('site',len(S),'in een soort',len(S)-len(geen),'nergens',len(geen))
vk=collections.Counter('/'.join(p['v'].split('/')[:2]) for p in geen)
print('nergens per groep:'); [print(' ',k,n) for k,n in vk.most_common(25)]
