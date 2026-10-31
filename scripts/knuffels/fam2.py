import json,collections,re,urllib.parse,sys
sys.path.insert(0,'.')
from dieren import D, GROEPNAAM
A=json.load(open('/mnt/user-data/uploads/LeukeKeuze-Nieuw-Feeds/t-animals.json'))
OP_SITE=set(re.findall(r'animals-giftshop\.nl%2Fproduct%2F(\d+)',open('producten-main.js').read()))
DC=[(re.compile(r,re.I),n,g) for r,n,g in D]
LICENTIE=r'disney|mickey|minnie|donald|goofy|winnie|pooh|iejoor|teigetje|tigger|paw patrol|rubble|skye|chase|marshall|garfield|peppa|my little pony|paddington|dikkie dik|nijntje|miffy|stitch|simba|dumbo|bambi|pokemon|pikachu|sesam|snoopy|hello kitty|beanie boo|\bty\b|barbapapa|bumba|k3|smurf|moomin|gruffalo|pino|bigfoot|squishmallow'
NIET=r'staart|thank|bedankt|cadeauza|zakje|sorry|i love|beterschap|liefde|happy|jarig|verjaardag|shirt|trui|sjaal|strik met|met tekst|naam|opdruk|bloem|roos|handpop|sleutelhanger|kussen|tas\b|tasje|rugzak|deken|slof|pantoffel|muts|kostuum|onesie|dierenpak|verkleed|carnaval|spaarpot|warmte|magnetron|tuttel|doekje|rammelaar|bijtring|knuffeldoek|speen|hoofdband|stokpaard|wenskaart|cadeau setje|decoratie|gnome|pop\b|set van|\bset\b|\d+x\b|familie|moeder (en|met) jong|knuffelberen set|kerstknuffel|kerst|valentijn|love|hartje|geboorte|baby'
def band(cm):
    for lo,hi,lab in [(0,12,'± 10 cm'),(13,17,'± 15 cm'),(18,21,'± 20 cm'),(22,27,'± 25 cm'),(28,34,'± 30 cm'),(35,49,'± 40 cm'),(50,999,'50 cm en groter')]:
        if lo<=cm<=hi: return lab
def winkel(link):
    q=urllib.parse.parse_qs(urllib.parse.urlparse(link).query); return q.get('u',[''])[0]
fam=collections.defaultdict(list); weg=collections.Counter()
for r in A:
    t=r['titel']
    if r['merk']=='Bellatio Decorations': weg['bellatio']+=1; continue
    if not re.search(r'knuffel|pluche|plush',t,re.I): weg['geen knuffel']+=1; continue
    if re.search(LICENTIE,t,re.I): weg['figuur/merk']+=1; continue
    if re.search(NIET,t,re.I): weg['ander type/set/thema']+=1; continue
    m=re.search(r'(\d+)\s?cm',t,re.I)
    if not m: weg['geen maat']+=1; continue
    pid=re.search(r'product%2F(\d+)',r['link']); pid=pid.group(1) if pid else ''
    if pid in OP_SITE: weg['staat al op site']+=1; continue
    hit=None
    for rx,n,g in DC:
        if rx.search(t): hit=(n,g); break
    if not hit: weg['dier onbekend']+=1; continue
    cm=int(m.group(1))
    if cm<5 or cm>150: weg['rare maat']+=1; continue
    fam[(hit[1],band(cm))].append(dict(dier=hit[0],cm=cm,prijs=r['prijs'],merk=r['merk'],titel=t,link=r['link'],winkel=winkel(r['link']),foto=r['fotos'][0],pid=pid))
print('weg',dict(weg))
BANDV=['± 10 cm','± 15 cm','± 20 cm','± 25 cm','± 30 cm','± 40 cm','50 cm en groter']
out=[];tot=0;klein=[]
for (g,b),L in sorted(fam.items(),key=lambda k:(k[0][0],BANDV.index(k[0][1]))):
    per={}
    for x in sorted(L,key=lambda x:x['prijs']):
        per.setdefault(x['dier'],x)
    V=sorted(per.values(),key=lambda x:x['dier'])
    if len(V)<3: klein.append((g,b,len(V))); 
    out.append(dict(groep=g,groepnaam=GROEPNAAM[g],band=b,varianten=V)); tot+=len(V)
json.dump(out,open('families.json','w'),ensure_ascii=False,indent=0)
print('families',len(out),'dieren',tot,'(families met <3 dieren:',len(klein),')')
for f in out: print(f['groep'],'|',f['band'],'|',len(f['varianten']),'|',', '.join(v['dier'] for v in f['varianten']))
onb=collections.Counter()
for r in A:
    t=r['titel']
    if r['merk']!='Bellatio Decorations' and re.search(r'knuffel|pluche',t,re.I) and not re.search(LICENTIE+'|'+NIET,t,re.I) and not any(rx.search(t) for rx,n,g in DC): onb[re.split(r'\s[-–]\s',t)[0][:50]]+=1
print('onbekend voorbeeld:',onb.most_common(30))
