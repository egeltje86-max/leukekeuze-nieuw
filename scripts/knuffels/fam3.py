import json,collections,re,urllib.parse,sys
sys.path.insert(0,'.')
from dieren import D, GROEPNAAM
A=json.load(open('/mnt/user-data/uploads/LeukeKeuze-Nieuw-Feeds/t-animals.json'))
OP=set(re.findall(r'animals-giftshop\.nl%2Fproduct%2F(\d+)',open('producten-main.js').read()))
DC=[(re.compile(r,re.I),n,g) for r,n,g in D]
LIC=r'disney|mickey|minnie|donald|winnie|pooh|paw patrol|garfield|peppa|my little pony|paddington|nijntje|stitch|simba|dumbo|snoopy|hello kitty|pokemon|squishmallow'
def dier(t):
    for rx,n,g in DC:
        if rx.search(t): return n,g
    return None,None
def winkel(l): return urllib.parse.parse_qs(urllib.parse.urlparse(l).query).get('u',[''])[0]
def pid(l):
    m=re.search(r'product%2F(\d+)',l); return m.group(1) if m else ''
# (sleutel, test-functie, groeperen per diergroep?, label-bron)
TYPES=[
 ('sh-metaal', lambda t: re.search(r'sleutelhanger',t,re.I) and re.search(r'metaal|metalen',t,re.I), False, 'dier'),
 ('sh-pluche', lambda t: re.search(r'sleutelhanger',t,re.I) and re.search(r'pluche|knuffel',t,re.I), False, 'dier'),
 ('handpop', lambda t: re.search(r'handpop',t,re.I), False, 'dier'),
 ('figuur', lambda t: re.search(r'speelfiguur|speelgoed figuur|kunststof|van plastic|plastic speelgoed|safari ltd|papo',t,re.I) and not re.search(r'fop|feest|horror|hang|decoratie|\d+x\b|set|tuin',t,re.I), False, 'dier'),
 ('beeld-hond', lambda t: re.search(r'beeld',t,re.I) and re.search(r'hond|teckel|herder|bulldog|collie|terri|chihuahua|labrador|retriever|shih|poedel|boxer|beagle|husky|spaniel|mops|dalmati|corgi',t,re.I) and not re.search(r'tuinbeeld|kerst|led|verlicht|vogelbad',t,re.I), False, 'dier'),
 ('beeld', lambda t: re.search(r'beeldje|decoratie beeld|dierenbeeld|beeld van',t,re.I) and not re.search(r'tuinbeeld|kerst|led|verlicht|vogelbad|hond|teckel|herder|bulldog|collie|terri|chihuahua|labrador|poedel|boxer',t,re.I), False, 'dier'),
 ('spaarpot', lambda t: re.search(r'spaarpot',t,re.I) and not re.search(r'just married|voetbal|papa|vader|krijt|tekst|naam',t,re.I), False, 'dier'),
 ('kussen', lambda t: re.search(r'sierkussen|kussen.*print|dierenkussen|kussen van een',t,re.I) and not re.search(r'nek|warmte|kruik|reis',t,re.I), False, 'dier'),
 ('oren', lambda t: re.search(r'diadeem|haarband|oren',t,re.I) and re.search(r'verkleed|oren',t,re.I) and not re.search(r'knuffel|pluche',t,re.I), False, 'dier'),
 ('dierenpak', lambda t: re.search(r'dierenpak|verkleedkleding|kostuum|onesie',t,re.I) and not re.search(r'volwassen',t,re.I), False, 'dier'),
 ('vogelhuis', lambda t: re.search(r'vogelhuis|nestkast|nesthuis',t,re.I), False, 'model'),
]
INFO={
 'sh-metaal':('Metalen dieren-sleutelhanger (5 cm)','mode-beauty','riemen-sleutelhangers',['iedereen'],'Een klein metalen dier aan je sleutels. Leuk kleinigheidje of cadeautje voor een dierenvriend. Kies zelf het dier met de pijltjes of de fotootjes.'),
 'sh-pluche':('Pluche dieren-sleutelhanger','mode-beauty','riemen-sleutelhangers',['kind','tiener','iedereen'],'Een mini-knuffeltje aan je sleutels, rugzak of etui. Kies zelf het dier met de pijltjes of de fotootjes.'),
 'handpop':('Pluche handpop dier','speelgoed','speelkeukens-verkleden',['kind'],'Een zachte handpop om mee te spelen en verhaaltjes te vertellen. Kies zelf het dier met de pijltjes of de fotootjes.'),
 'figuur':('Speelfiguurtje dier','speelgoed','hypes-trends',['kind'],'Echt uitziende speelfiguurtjes van stevig kunststof, van merken als Papo en Safari Ltd. Fijn om te sparen en mee te spelen. Kies zelf het dier met de pijltjes of de fotootjes.'),
 'beeld-hond':('Hondenbeeldje – kies je ras','dieren','hond',['iedereen'],'Een mooi beeldje van een hond voor in de kast of vensterbank. Leuk voor iedereen met een hond. Kies het ras met de pijltjes of de fotootjes.'),
 'beeld':('Dierenbeeldje','wonen','wanddecoratie',['iedereen'],'Een decoratief dierenbeeldje voor in huis. Kies zelf het dier met de pijltjes of de fotootjes.'),
 'spaarpot':('Dieren-spaarpot','speelgoed','hypes-trends',['kind','iedereen'],'Een vrolijke spaarpot in de vorm van een dier. Kies zelf het dier met de pijltjes of de fotootjes.'),
 'kussen':('Sierkussen met dier','wonen','kussens-plaids',['iedereen'],'Een zacht sierkussen met een dier erop, voor op de bank of in de kinderkamer. Kies zelf het dier met de pijltjes of de fotootjes.'),
 'oren':('Verkleed-oren van een dier (diadeem)','speelgoed','speelkeukens-verkleden',['kind','iedereen'],'Snel verkleed als je lievelingsdier: een diadeem met oren. Kies zelf het dier met de pijltjes of de fotootjes.'),
 'dierenpak':('Dierenpak voor kinderen','speelgoed','speelkeukens-verkleden',['kind'],'Een verkleedpak waarmee je kind helemaal een dier wordt. Kies zelf het dier met de pijltjes of de fotootjes.'),
 'vogelhuis':('Vogelhuisje of nestkastje','tuin-klussen','vogels-insecten',['iedereen','opa-oma'],'Een vogelhuisje of nestkastje voor in de tuin. Kies zelf het model met de pijltjes of de fotootjes.'),
}
fam=collections.defaultdict(list); weg=collections.Counter()
for r in A:
    t=r['titel']
    if r['merk']=='Bellatio Decorations': continue
    if re.search(LIC,t,re.I): continue
    p=pid(r['link'])
    if p in OP: weg['al op site']+=1; continue
    for key,test,pergroep,lab in TYPES:
        if test(t):
            if lab=='dier':
                n,g=dier(t)
                if not n: weg['geen dier '+key]+=1; break
                if key=='beeld-hond' and g!='huisdieren': weg['geen hond']+=1; break
                fk=(key,g if pergroep else '')
            else:
                n=re.split(r'\s[-–]\s',t)[0]
                for w in ['Best for Birds','Best for birds','Birds for Birds','Boon','Esschert Design','Pro Garden','Boltze','Decoris','Lifetime Garden','Rayher Hobby','Rayher hobby/knutselen','Rayher']: n=n.replace(w,'')
                n=re.sub(r'\d+([.,]\d+)?\s?(x\s?\d+\s?)*cm','',n); n=re.sub(r'\s+',' ',n).strip(' -/'); n=n[:1].upper()+n[1:]; fk=(key,'')
            m=re.search(r'(\d+)\s?cm',t,re.I)
            fam[fk].append(dict(dier=n,cm=int(m.group(1)) if m else None,prijs=r['prijs'],titel=t,link=r['link'],winkel=winkel(r['link']),foto=r['fotos'][0],pid=p))
            break
print('weg',dict(weg))
out=[]
for (key,g),L in sorted(fam.items()):
    per={}
    for x in sorted(L,key=lambda x:x['prijs']): per.setdefault(x['dier'].lower(),x)
    V=sorted(per.values(),key=lambda x:x['dier'])
    if len(V)<2: print('te klein',key,g,len(V)); continue
    titel,cat,sub,voor,waarom=INFO[key]
    if '%s' in titel: titel=titel%('– '+GROEPNAAM[g].lower())
    lab='Model' if key=='vogelhuis' else ('Ras' if key=='beeld-hond' else 'Dier')
    out.append(dict(key=key,groep=g,titel=titel,cat=cat,sub=sub,voor=voor,waarom=waarom,label=lab,varianten=V))
json.dump(out,open('andere.json','w'),ensure_ascii=False,indent=0)
print(len(out),'producten',sum(len(f['varianten']) for f in out),'varianten')
for f in out: print(f['key'],'|',f['titel'],'|',len(f['varianten']),'|',', '.join(v['dier'] for v in f['varianten'][:14]))
