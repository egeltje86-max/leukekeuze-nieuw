import json,re
F=json.load(open('families.json'))
BANDV=['± 10 cm','± 15 cm','± 20 cm','± 25 cm','± 30 cm','± 40 cm','50 cm en groter']
NAAM={'huisdieren':'Knuffel hond, kat of huisdier','boerderij':'Knuffel boerderijdier','bos':'Knuffel bosdier','beren':'Knuffelbeer, panda of koala','pool':'Knuffel pooldier',
 'safari':'Knuffel safari- of junglediertje','zee':'Knuffel zee- of waterdier','vogels':'Knuffelvogel','dino':'Knuffel dino of reptiel','fantasie':'Knuffel eenhoorn of draak','insecten':'Knuffel insect of kriebelbeestje'}
EERST={'huisdieren':['Labrador','Hond','Kat','Puppy'],'boerderij':['Lammetje','Schaap','Koe','Paard'],'bos':['Vos','Egel','Eekhoorn'],'beren':['Teddybeer','Panda','Koala'],
 'pool':['Pinguïn','IJsbeer','Koningspinguïn'],'safari':['Giraf','Leeuw','Tijger','Olifant'],'zee':['Dolfijn','Zeehond','Octopus','Haai'],'vogels':['Uil','Flamingo','Papegaai','Ara'],
 'dino':['T-rex','Triceratops','Dinosaurus'],'fantasie':['Eenhoorn'],'insecten':['Bij','Lieveheersbeestje','Vlinder']}
WAAROM={'huisdieren':'Honden, katten, konijnen en cavia\'s','boerderij':'Lammetjes, koeien, paarden, kippen en meer','bos':'Vossen, egels, eekhoorns, herten en wolven',
 'beren':'Teddyberen, panda\'s en koala\'s','pool':'Pinguïns, ijsberen en sneeuwuilen','safari':'Giraffen, leeuwen, tijgers, olifanten en apen','zee':'Dolfijnen, haaien, zeehonden, octopussen en meer',
 'vogels':'Uilen, flamingo\'s, papegaaien en tuinvogeltjes','dino':'Dino\'s, krokodillen, schildpadden en slangen','fantasie':'Eenhoorns en draken','insecten':'Bijen, vlinders, lieveheersbeestjes en spinnen'}
# kleine families (minder dan 3 dieren) samenvoegen met de band ernaast
groepen={}
for f in F: groepen.setdefault(f['groep'],[]).append(f)
samen=[]
for g,L in groepen.items():
    L=sorted(L,key=lambda f:BANDV.index(f['band']))
    bakken=[[f] for f in L]
    def n(b): return len({v['dier'] for f in b for v in f['varianten']})
    changed=True
    while changed and len(bakken)>1:
        changed=False
        for i,b in enumerate(bakken):
            if n(b)<3:
                j=i+1 if i+1<len(bakken) else i-1
                if i+1<len(bakken) and i>0 and n(bakken[i-1])<n(bakken[i+1]): j=i-1
                lo,hi=min(i,j),max(i,j); bakken[lo]=bakken[lo]+bakken[hi]; del bakken[hi]; changed=True; break
    if len({v['dier'] for f in L for v in f['varianten']})<3:
        # weinig soorten (eenhoorn, draak): één product, kies dier én maat
        per={}
        for f in L:
            for v in f['varianten']: per.setdefault((v['dier'],v['cm']),v)
        samen.append((g,list(per.values()))); continue
    for b in bakken:
        per={}
        for f in b:
            for v in sorted(f['varianten'],key=lambda v:v['prijs']): per.setdefault(v['dier'],v)
        samen.append((g,list(per.values())))
vandaag='2026-10-31'; uit=[]
for g,V in samen:
    lo=min(v['cm'] for v in V); hi=max(v['cm'] for v in V)
    pri={d:i for i,d in enumerate(EERST.get(g,[]))}
    V=sorted(V,key=lambda v:(pri.get(v['dier'],99),v['dier'],v['cm']))
    maat=('%d cm'%lo) if lo==hi else ('%d tot %d cm'%(lo,hi)) if hi<50 else ('%d cm en groter'%lo if lo>=50 else '%d tot %d cm'%(lo,hi))
    titel='%s (%s)'%(NAAM[g],maat)
    var=[{'kleur':'%s · %d cm'%(v['dier'],v['cm']),'beeld':v['foto'],'url':v['link'],'winkelUrl':v['winkel'],'prijs':v['prijs']} for v in V]
    pid='ag-knuf-%s-%d-%d'%(g,lo,hi)
    uit.append({'id':pid,'titel':titel,'prijs':V[0]['prijs'],'shop':'Animals Giftshop','url':V[0]['link'],'winkelUrl':V[0]['winkel'],'beeld':V[0]['foto'],
      'cat':'speelgoed','sub':'knuffels-squishmallows','subVast':True,'ookIn':[],'voor':['kind','iedereen'],'moment':['verjaardag','sinterklaas','kerst','zomaar'],
      'waarom':'%s: kies zelf je lievelingsdier. Met de pijltjes of de fotootjes zie je alle %d knuffels van ongeveer dezelfde grootte. Zacht pluche van merken als Nature Planet, Wild Republic en Ravensden.'%(WAAROM[g],len(V)),
      'verzendNoot':'Animals Giftshop rekent verzendkosten (vanaf € 5,50).','status':'goedgekeurd','nieuw':True,'gecontroleerd':vandaag,'sinds':vandaag,
      'keuzeLabel':'Dier','keuzeMeervoud':'dieren','varianten':var})
json.dump(uit,open('knuffel-producten.json','w'),ensure_ascii=False,indent=0)
print(len(uit),'producten,',sum(len(p['varianten']) for p in uit),'dieren')
for p in uit: print(p['id'],'|',p['titel'],'|',len(p['varianten']),'| vanaf',min(v['prijs'] for v in p['varianten']))
