# -*- coding: utf-8 -*-
"""Superkeurkamer: wat bol ZELF verkoopt (sellerType B, nieuw, leverbaar) uit de officiële bol-feeds als 'partner' bol
(data/p/bol.json), alleen de soorten die een cadeau kunnen zijn. Gemaakt 27-11-2026 voor de marktlijst
(Marius: 'vul hem met alle producten die we moeten hebben om alles te kunnen bieden wat er op de markt is').
Leest alleen de feeds in Documents\\LeukeKeuze-Bol\\feeds (die ververst de ochtendrun). Geen scrapen.
Gebruik: python bolfeed.py   (bouw.py roept hem zelf aan vóór de zoekindex)"""
import gzip, csv, json, os, sys, time, datetime
from urllib.parse import quote
try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass
csv.field_size_limit(10 ** 8)
HIER = os.path.dirname(os.path.abspath(__file__))
KAMER = os.path.dirname(HIER)
BRON = os.environ.get('BOL_FEEDS', r'C:\Users\egelt\Documents\LeukeKeuze-Bol\feeds')
UIT = os.path.join(KAMER, 'data', 'p', 'bol.json')
FEEDS = ['toys', 'entertainment', 'sound-vision', 'computer', 'perfumery', 'dutch-books', 'baby', 'sports', 'kitchen-household',
         'fashion-accessories', 'fashion-footwear', 'daily-care', 'garden-lighting', 'outdoor-mobility', 'pet', 'supermarket', 'home-interior']
# soorten (Category.subgroup) die geen cadeau zijn: weg
NIET_SUB = {
    'CD', 'DVD', 'Blu-Ray', 'DVD Muziek', 'Bluray Muziek', 'Onbekend Music', 'Games Software Digital',
    'Beeld en Geluid Accessoires', 'Television',
    'Storage Devices', 'Printing Supplies', 'Network Equipment', 'Monitors', 'Printers', 'Software', 'Laptop Computers', 'Carrying Cases',
    'Other Computer Accessories', 'Beamers',
    'Luxe Zonbescherming', 'Zonbescherming',
    'Eten en Drinken Baby', 'Verschonen Baby', 'Babyverzorging', 'Onderweg Baby',
    'Voedsel Bewaren', 'Opbergen', 'Prullenbakken', 'Afwassen en Schoonmaken', 'Wassen Drogen en Strijken', 'Wegen en Meten KTH', 'Pannen',
    'Kookgerei', 'Bakgerei', 'Bestek',
    'Reis en Bagage', 'Zonnebrillen',
    'Tuingereedschap', 'Buitenverlichting', 'Lichtbronnen', 'Bewatering', 'Vijvers', 'Tuinmeubelen',
    'Fietsonderdelen', 'Auto Onderhoud', 'Auto Accessoires', 'Auto Onderdelen', 'Onderhoud en Reparaties', 'Motor Onderhoud', 'CO - Reis en Bagage',
    'Diervoeding',
    'Kantoorartikelen', 'Schoolspullen', 'Schoonmaakmiddelen', 'Wasmiddelen', 'Cadeau en Wenskaarten',
    'Hoeslakens en Lakens', 'Dekbedovertrekken', 'Kasten', 'Tafels', 'Stoelen', 'Badtextiel',
}
NIET_BOEK = ('Religie- Spiritualiteit', 'Mens en Maatschappij', 'Bedrijf en Management', 'Onderwijs en Didactiek', 'Psychologie',
             'Geneeskunde', 'Persoonlijke Ontwikkeling', 'Taal |', 'Technologie', 'Economie', 'Computers en Informatica', 'Rechten', 'Gezondheid')
# hele productgroepen weg
NIET_GROEP = {'Sportswear', 'Mens and Womens Fashion', 'Baby and Kids Fashion', 'Desktop Monitor and Beamer', 'Car and Motorcycle', 'Furniture'}
# in fashion-footwear alleen pantoffels en nachtmode; daily-care alleen sets
ALLEEN_SUB = {'fashion-footwear': {'Pantoffels', 'Nachtmode'}}
SET_WOORD = ('set', 'cadeau', 'gift', 'geschenk', 'box', 'koffer')


def link(url):
    return 'https://partner.bol.com/click/click?t=url&s=1545784&f=txl&name=LeukeKeuze&url=' + quote(url, safe='')


def main():
    t0 = time.time()
    prods, gezien, per = [], set(), {}
    nieuwste = 0
    for feed in FEEDS:
        f = os.path.join(BRON, 'product-feed_%s-v2.csv.gz' % feed)
        if not os.path.exists(f):
            print('bol: feed mist', feed)
            continue
        nieuwste = max(nieuwste, os.path.getmtime(f))
        n0 = len(prods)
        with gzip.open(f, 'rt', encoding='utf-8', errors='replace', newline='') as fh:
            kop = next(csv.reader([fh.readline()], delimiter='|'))
            ix = {h: i for i, h in enumerate(kop)}
            S, D, C, P = ix['OfferNL.sellerType'], ix['OfferNL.isDeliverable'], ix['OfferNL.condition'], ix['OfferNL.sellingPrice']
            G, SUB, SS = ix['Category.productgroup'], ix['Category.subgroup'], ix['Category.subssubgroup']
            for line in fh:
                if '"B"' not in line:
                    continue
                try:
                    r = next(csv.reader([line], delimiter='|'))
                except Exception:
                    continue
                if len(r) <= SS or r[S] != 'B' or r[D] not in ('Y', 'true') or r[C].lower() != 'new':
                    continue
                try:
                    p = float(r[P] or 0)
                except ValueError:
                    continue
                grp, sub, ss = r[G], r[SUB], r[SS]
                if p <= 1 or grp in NIET_GROEP or sub in NIET_SUB:
                    continue
                if feed in ALLEEN_SUB and sub not in ALLEEN_SUB[feed]:
                    continue
                if feed == 'dutch-books' and sub.startswith(NIET_BOEK):
                    continue
                t = r[ix['title']].strip()
                if feed == 'daily-care' and not any(w in t.lower() for w in SET_WOORD):
                    continue
                pid = r[ix['productId']]
                url = r[ix['productPageUrlNL']]
                if not t or not url or pid in gezien:
                    continue
                gezien.add(pid)
                sub_n = sub.replace(' | Nederlandstalig', '')
                g = [sub_n, ss] if ss and ss != sub else [sub_n]
                prods.append({'i': len(prods), 't': t[:160], 'm': (r[ix['brand']] or '')[:40], 'p': p, 'o': 0, 'f': r[ix['imageUrl']],
                              'l': link(url), 'u': url, 'g': g, 'k': [], 'pop': 0, 'v': 1, 'st': 1, 'e': (r[ix['ean']] or '')[:20],
                              'bol': pid})
        per[feed] = len(prods) - n0
        print('bol: %-20s %7d' % (feed, per[feed]), flush=True)
    if len(prods) < 20000:
        print('bol: maar %d producten, bol.json niet vervangen' % len(prods))
        return None
    afd = {}
    for x in prods:
        afd[x['g'][0]] = afd.get(x['g'][0], 0) + 1
    info = {'id': 'bol', 'naam': 'bol (zelf)', 'netwerk': 'bol', 'n': len(prods), 'korting': 0, 'populair': 0,
            'afdelingen': sorted(([a, n] for a, n in afd.items()), key=lambda y: -y[1])[:8], 'foto': prods[0]['f'], 'opsite': 0,
            'zoekfunctie': False, 'bijgewerkt': datetime.datetime.fromtimestamp(nieuwste).strftime('%d-%m-%Y'), 'vol': False,
            'uitleg': 'Alleen wat bol zelf verkoopt (geen andere verkopers), nieuw en leverbaar, uit de officiële bol-feeds.',
            'bronnen': ['bol-feeds %s' % ', '.join(per)]}
    tmp = UIT + '.nieuw'
    json.dump({'info': info, 'boom': [], 'producten': prods}, open(tmp, 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
    os.replace(tmp, UIT)
    print('bol: klaar, %d producten in %.0fs' % (len(prods), time.time() - t0))
    return info


if __name__ == '__main__':
    main()
