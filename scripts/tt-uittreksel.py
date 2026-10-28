# Maakt een klein JSON-uittreksel uit een TradeTracker-feed (xml-v2), in hetzelfde formaat als uittreksel.py (Daisycon).
# gebruik: tt-uittreksel.py <feed.xml> <uit.json> [minprijs] [regex-weg-op-titel]
import sys, re, json, html
import xml.etree.ElementTree as E
sys.stdout.reconfigure(encoding='utf-8')
src, dst = sys.argv[1], sys.argv[2]
lo = float(sys.argv[3]) if len(sys.argv) > 3 and sys.argv[3] else 0
weg = re.compile(sys.argv[4], re.I) if len(sys.argv) > 4 and sys.argv[4] else None
rows = []
for ev, el in E.iterparse(src, events=('end',)):
    if el.tag != 'product':
        continue
    t = html.unescape((el.findtext('name') or '').strip())
    try:
        p = float(el.findtext('price') or 0)
    except ValueError:
        p = 0
    props = {}
    for pr in el.iter('property'):
        props[pr.get('name')] = html.unescape((pr.findtext('value') or '').strip())
    imgs = [(i.text or '').strip() for i in el.iter('image') if (i.text or '').strip()]
    # Bellatio en Animals Giftshop: 'large' is soms meer dan 1 MB; 'medium' (~80 kB) is genoeg voor een kaartje.
    imgs = [re.sub(r'(bellatio-kerstversiering|animals-giftshop)\.nl/img/large/', r'\1.nl/img/medium/', i) for i in imgs]
    voorraad = props.get('stock', '')
    if t and p >= lo and imgs and not (weg and weg.search(t)) and voorraad not in ('0',):
        rows.append({'titel': t, 'merk': props.get('brand', ''), 'prijs': p, 'oud': props.get('fromPrice', ''),
                     'cat': re.split(r'[>/]', props.get('categoryPath', '').strip('/ '))[-1].replace('-', ' ').strip(), 'pad': props.get('categoryPath', ''),
                     'voorraad': 'true', 'link': (el.findtext('URL') or '').strip(), 'fotos': imgs[:3],
                     'ean': props.get('EAN', ''), 'sku': el.get('ID', ''), 'gender': ''})
    el.clear()
json.dump(rows, open(dst, 'w', encoding='utf-8'), ensure_ascii=False)
print(len(rows), 'producten naar', dst)
