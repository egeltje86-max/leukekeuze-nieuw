# Maakt kleine JSON-uittreksels uit grote feeds (opent GEEN partnerlinks).
# gebruik: uittreksel.py <feed.xml> <uit.json> [regex-op-titel] [minprijs] [maxprijs]
import sys, re, json, html
import xml.etree.ElementTree as E
sys.stdout.reconfigure(encoding='utf-8')
src, dst = sys.argv[1], sys.argv[2]
rx = re.compile(sys.argv[3], re.I) if len(sys.argv) > 3 and sys.argv[3] else None
lo = float(sys.argv[4]) if len(sys.argv) > 4 else 0
hi = float(sys.argv[5]) if len(sys.argv) > 5 else 1e9
rows = []
for ev, el in E.iterparse(src, events=('end',)):
    if el.tag != 'product_info':
        continue
    g = lambda t: html.unescape((el.findtext(t) or '').strip())
    t = g('title')
    try:
        p = float(g('price') or 0)
    except ValueError:
        p = 0
    if (rx is None or rx.search(t) or rx.search(g('category'))) and lo <= p <= hi:
        imgs = [i.findtext('location') for i in el.iter('image') if i.findtext('location')]
        rows.append({'titel': t, 'merk': g('brand'), 'prijs': p, 'oud': g('price_old'), 'cat': g('category'),
                     'pad': g('category_path'), 'voorraad': g('in_stock'), 'aantal': g('in_stock_amount'),
                     'link': g('link'), 'fotos': imgs[:3], 'kort': g('description_short')[:300],
                     'oms': re.sub(r'<[^>]+>', ' ', g('description'))[:700], 'ean': g('ean'), 'sku': g('sku'),
                     'gender': g('gender_target'), 'kleur': g('color_primary'), 'maat': g('size')})
    el.clear()
json.dump(rows, open(dst, 'w', encoding='utf-8'), ensure_ascii=False)
print(len(rows), 'producten naar', dst)
