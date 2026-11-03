"""Spookpaleis: de test- en blauwdruksite van de nieuwe LeukeKeuze (leukekeuze.nl/spookpaleis/).
Leest spookpaleis/boom.json (de categorieboom) en spookpaleis/producten.json (de producten die Marius toevoegt)
en maakt alle pagina's. Google mag deze site niet tonen (noindex + robots.txt).
Gebruik: python3 scripts/spookpaleis/bouw.py"""
import json, os, re, html, shutil, unicodedata
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SP = os.path.join(ROOT, 'spookpaleis'); BASIS = '/spookpaleis/'

def slug(t):
    t = unicodedata.normalize('NFKD', t).encode('ascii', 'ignore').decode()
    return re.sub(r'[^a-z0-9]+', '-', t.lower()).strip('-')
def e(t): return html.escape(str(t))

B = json.load(open(os.path.join(SP, 'boom.json'), encoding='utf-8'))
P = json.load(open(os.path.join(SP, 'producten.json'), encoding='utf-8')).get('producten', [])
per_vak = {}
for p in P: per_vak.setdefault(p.get('vak', ''), []).append(p)

CSS = """
:root{--bg:#faf7f2;--kaart:#fff;--tekst:#2a2522;--zacht:#7a6f66;--goud:#c9a24a;--lijn:#ece4d8}
*{box-sizing:border-box}body{margin:0;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;background:var(--bg);color:var(--tekst);line-height:1.5}
a{color:inherit;text-decoration:none}.wrap{max-width:1100px;margin:0 auto;padding:0 16px}
.spook{background:#2a2522;color:#f3e6c8;text-align:center;font-size:13px;padding:6px}
header{background:var(--kaart);border-bottom:1px solid var(--lijn)}header .wrap{display:flex;align-items:center;gap:16px;height:64px}
.logo{font-weight:800;font-size:22px}.logo span{color:var(--goud)}
.zoek{flex:1;max-width:420px;margin-left:auto;padding:10px 14px;border:1px solid var(--lijn);border-radius:999px;background:var(--bg)}
nav.kruim{font-size:14px;color:var(--zacht);margin:18px 0 6px}nav.kruim a:hover{text-decoration:underline}
h1{font-size:30px;margin:6px 0 18px}h2{font-size:20px;margin:28px 0 10px}
.raster{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:14px}
.tegel{background:var(--kaart);border:1px solid var(--lijn);border-radius:14px;padding:16px;display:block;transition:.15s}
.tegel:hover{border-color:var(--goud);transform:translateY(-2px)}.tegel b{display:block;font-size:17px}.tegel small{color:var(--zacht)}
.leeg{opacity:.55}.pil{display:inline-block;font-size:12px;padding:2px 8px;border-radius:999px;background:#f3ead9;color:#7a5c1e;margin-top:6px}
ul.vakjes{list-style:none;padding:0;margin:0;display:flex;flex-wrap:wrap;gap:8px}
ul.vakjes a{display:inline-block;background:var(--kaart);border:1px solid var(--lijn);border-radius:999px;padding:6px 14px;font-size:15px}
ul.vakjes a:hover{border-color:var(--goud)}ul.vakjes .n{color:var(--zacht);font-size:13px}
.niets{background:var(--kaart);border:1px dashed var(--lijn);border-radius:14px;padding:40px;text-align:center;color:var(--zacht)}
.prod{background:var(--kaart);border:1px solid var(--lijn);border-radius:14px;overflow:hidden}.prod img{width:100%;aspect-ratio:1;object-fit:contain;background:#fff}
.prod div{padding:12px}.prod .prijs{font-weight:700}
footer{margin:60px 0 30px;color:var(--zacht);font-size:13px;text-align:center}
"""
def pagina(titel, kruim, inhoud):
    k = ' › '.join('<a href="%s">%s</a>' % (e(u), e(t)) if u else e(t) for t, u in kruim)
    return ('<!doctype html><html lang="nl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
            '<meta name="robots" content="noindex,nofollow"><title>%s | Spookpaleis</title><style>%s</style></head><body>'
            '<div class="spook">👻 Spookpaleis – testversie van de nieuwe LeukeKeuze. Niet zichtbaar voor bezoekers of Google.</div>'
            '<header><div class="wrap"><a class="logo" href="%s">Leuke<span>Keuze</span></a><input class="zoek" placeholder="Zoek een cadeau… (komt later)" disabled></div></header>'
            '<main class="wrap"><nav class="kruim">%s</nav>%s</main><footer>Spookpaleis · blauwdruk</footer></body></html>') % (e(titel), CSS, BASIS, k, inhoud)
def schrijf(rel, tekst):
    pad = os.path.join(SP, rel, 'index.html'); os.makedirs(os.path.dirname(pad), exist_ok=True)
    open(pad, 'w', encoding='utf-8').write(tekst)
def kaartjes(lijst):
    if not lijst: return '<div class="niets">Nog geen producten in dit vakje.<br>Marius voegt ze toe via de Keurkamer.</div>'
    return '<div class="raster">' + ''.join('<a class="prod" href="%s" target="_blank" rel="nofollow sponsored"><img src="%s" alt="" loading="lazy"><div>%s<br><span class="prijs">€ %s</span></div></a>'
            % (e(p.get('url', '#')), e(p.get('foto', '')), e(p.get('titel', '')), e(p.get('prijs', ''))) for p in lijst) + '</div>'

# oude pagina's opruimen (alles behalve de bronbestanden)
for n in os.listdir(SP):
    pad = os.path.join(SP, n)
    if os.path.isdir(pad): shutil.rmtree(pad)
tot_vak = 0; home = []
for a in B['afdelingen']:
    a_url = BASIS + a['slug'] + '/'; n_afd = 0; blok = []
    for g in a['groepen']:
        g_url = a_url + g['slug'] + '/'; items = []; n_g = 0
        for v in g['vakjes']:
            vs = slug(v); code = '%s/%s/%s' % (a['slug'], g['slug'], vs); lijst = per_vak.get(code, []); n_g += len(lijst); tot_vak += 1
            schrijf('%s/%s/%s' % (a['slug'], g['slug'], vs), pagina(v, [('Home', BASIS), (a['naam'], a_url), (g['naam'], g_url), (v, None)], '<h1>%s</h1>%s' % (e(v), kaartjes(lijst))))
            items.append('<li><a href="%s%s/">%s <span class="n">(%d)</span></a></li>' % (g_url, vs, e(v), len(lijst)))
        n_afd += n_g
        schrijf('%s/%s' % (a['slug'], g['slug']), pagina(g['naam'], [('Home', BASIS), (a['naam'], a_url), (g['naam'], None)], '<h1>%s</h1><ul class="vakjes">%s</ul>' % (e(g['naam']), ''.join(items))))
        blok.append('<h2><a href="%s">%s</a></h2><ul class="vakjes">%s</ul>' % (g_url, e(g['naam']), ''.join(items)))
    inhoud = '<h1>%s</h1>' % e(a['naam']) + (''.join(blok) if blok else '<div class="niets">Deze afdeling wordt nog ingedeeld.</div>')
    schrijf(a['slug'], pagina(a['naam'], [('Home', BASIS), (a['naam'], None)], inhoud))
    info = ('%d groepen · %d vakjes' % (len(a['groepen']), sum(len(g['vakjes']) for g in a['groepen']))) if a['groepen'] else 'nog in te delen'
    home.append('<a class="tegel%s" href="%s"><b>%s</b><small>%s</small><br><span class="pil">%d producten</span></a>' % ('' if a['groepen'] else ' leeg', a_url, e(a['naam']), info, n_afd))
open(os.path.join(SP, 'index.html'), 'w', encoding='utf-8').write(pagina('Alle afdelingen', [('Home', None)], '<h1>Alle afdelingen</h1><div class="raster">%s</div>' % ''.join(home)))
print('Spookpaleis gebouwd: %d afdelingen, %d vakjes, %d producten' % (len(B['afdelingen']), tot_vak, len(P)))
