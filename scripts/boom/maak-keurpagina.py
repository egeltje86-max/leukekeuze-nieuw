# Maakt "KEUR WAT DE AI WEG WIL.html": alle producten die de AI weg wil (of waar hij over twijfelt), zodat Marius ze zelf keurt.
# Gebruik: python3 scripts/boom/maak-keurpagina.py <map-met-AI-antwoorden> <uitvoer.html>
import json, os, sys, glob, subprocess, html
HIER = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(os.path.dirname(HIER))
AIMAP, UIT = sys.argv[1], sys.argv[2]
AI = {}
for f in sorted(glob.glob(os.path.join(AIMAP, 'antw-*.json'))):
    for x in json.load(open(f, encoding='utf-8'))['uit']: AI[x['i']] = x
VAK = {v['code']: v['pad'] for v in json.load(open(os.path.join(AIMAP, 'vakjes.json'), encoding='utf-8'))}
def laad(js, naam): return json.loads(subprocess.check_output(['node', '-e', 'const w={};new Function("window",require("fs").readFileSync(%r,"utf8"))(w);process.stdout.write(JSON.stringify(w.%s))' % (js, naam)]))
L = {p['id']: p for p in laad(os.path.join(ROOT, 'assets/js/producten.js'), 'LK_PRODUCTEN')}
S = {p['id']: p for p in laad('/mnt/user-data/outputs/spooksite-test/producten.js', 'SPOOK_PRODUCTEN')}
BESCH = set()
try: BESCH |= set(json.load(open(os.path.join(ROOT, 'keurkamer/data/boom/goatcounter-hits.json'))))
except Exception: pass
rij = []
for i, a in AI.items():
    if a['k'] not in ('w', 't'): continue
    p = L.get(i); s = S.get(i)
    if p: foto = 'https://leukekeuze.nl/images/producten/' + i + '-klein.webp'; titel, prijs, winkel, nieuw = p['titel'], p.get('prijs'), p['shop'], False
    elif s: foto = "../FOTOS-NIEUW/FOTO'S NIEUW/" + i + '-klein.webp'; titel, prijs, winkel, nieuw = s['titel'], s.get('prijs'), s['winkel'], True; 
    else: continue
    rij.append({'i': i, 't': titel, 'p': prijs, 'w': winkel, 'f': foto, 'f2': (s or {}).get('foto', ''), 'r': a.get('r', ''), 'k': a['k'], 'v': VAK.get(a['v'], ''), 'n': nieuw, 'c': a.get('c', 0)})
rij.sort(key=lambda x: (x['v'], x['t']))
data = json.dumps(rij, ensure_ascii=False).replace('</', '<\\/')
pagina = '''<!doctype html><html lang="nl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Keur wat de AI weg wil – LeukeKeuze</title><style>
:root{--bg:#F7F3EC;--navy:#0A1020;--goud:#B8862E;--rood:#b3261e;--groen:#1f7a3a}
*{box-sizing:border-box}body{margin:0;background:var(--bg);font:16px/1.4 system-ui,Segoe UI,sans-serif;color:var(--navy)}
header{position:sticky;top:0;background:var(--navy);color:#fff;padding:12px 16px;z-index:5;display:flex;flex-wrap:wrap;gap:10px;align-items:center}
header h1{font-size:18px;margin:0 12px 0 0}header .tel{color:#F2CB74}header button,header select{font:inherit;padding:8px 12px;border-radius:999px;border:0;cursor:pointer}
.bewaar{background:linear-gradient(180deg,#F4D07D,#D9A443);font-weight:700}
main{max-width:1200px;margin:0 auto;padding:16px;display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:14px}
.k{background:#fff;border-radius:14px;overflow:hidden;box-shadow:0 1px 3px #0001;display:flex;flex-direction:column;border:3px solid transparent}
.k.houden{border-color:var(--groen)}.k.weg{border-color:var(--rood);opacity:.55}
.k img{width:100%;aspect-ratio:1;object-fit:contain;background:#fff}.in{padding:10px 12px;flex:1;display:flex;flex-direction:column;gap:4px}
.w{font-size:12px;color:var(--goud);text-transform:uppercase;letter-spacing:.06em;font-weight:700}.t{font-weight:600}.v{font-size:12px;color:#666}
.r{font-size:14px;background:#fff4e5;border-radius:8px;padding:6px 8px}.r b{color:var(--rood)}.prijs{font-weight:800}
.kn{display:flex;gap:8px;padding:0 12px 12px}.kn button{flex:1;padding:12px;border-radius:10px;border:2px solid #ddd;background:#fff;font:inherit;font-weight:700;cursor:pointer}
.k.houden .h{background:var(--groen);color:#fff;border-color:var(--groen)}.k.weg .x{background:var(--rood);color:#fff;border-color:var(--rood)}
.nieuw{font-size:11px;background:#e8f0ff;border-radius:6px;padding:1px 6px;margin-left:6px;color:#234}
p.uitleg{max-width:1200px;margin:12px auto 0;padding:0 16px}
</style></head><body>
<header><h1>Keur wat de AI weg wil</h1><span class="tel" id="tel"></span>
<select id="filter"><option value="open">Nog te keuren</option><option value="alles">Alles</option><option value="houden">Houden</option><option value="weg">Weg</option></select>
<button class="bewaar" id="bewaar">Klaar? Bewaar mijn keuring</button></header>
<p class="uitleg">Per product: <b>Houden</b> of <b>Weg</b>. Je keuze wordt vanzelf onthouden in deze browser. Ben je klaar (of wil je stoppen), klik op <b>Bewaar mijn keuring</b>. Het bestand komt in je map Downloads; zeg het tegen Claude.</p>
<main id="lijst"></main>
<script>
var D = ''' + data + ''';
var K = 'lk-keur-boom-2026-11'; var keus = {}; try { keus = JSON.parse(localStorage.getItem(K) || '{}'); } catch (e) {}
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
function teken(){var f=document.getElementById('filter').value;var h='';D.forEach(function(x){var k=keus[x.i]||'';if(f==='open'&&k)return;if(f!=='open'&&f!=='alles'&&k!==f)return;
h+='<article class="k '+k+'" data-i="'+esc(x.i)+'"><img loading="lazy" src="'+esc(x.f)+'" data-f2="'+esc(x.f2)+'" onerror="if(this.dataset.f2&&this.src!==this.dataset.f2)this.src=this.dataset.f2" alt=""><div class="in"><span class="w">'+esc(x.w)+(x.n?'<span class="nieuw">nieuw</span>':'')+'</span><span class="t">'+esc(x.t)+'</span><span class="prijs">€ '+(x.p!=null?Number(x.p).toFixed(2).replace('.',','):'?')+'</span><span class="v">'+esc(x.v)+'</span><span class="r"><b>'+(x.k==='w'?'AI: weg':'AI twijfelt')+'</b> – '+esc(x.r||'')+'</span></div><div class="kn"><button class="h" data-k="houden">Houden</button><button class="x" data-k="weg">Weg</button></div></article>';});
document.getElementById('lijst').innerHTML=h||'<p>Niets meer in deze lijst.</p>';var n=Object.keys(keus).length;document.getElementById('tel').textContent=n+' van '+D.length+' gekeurd';}
document.getElementById('lijst').addEventListener('click',function(e){var b=e.target.closest('button[data-k]');if(!b)return;var a=b.closest('.k');keus[a.dataset.i]=b.dataset.k;try{localStorage.setItem(K,JSON.stringify(keus));}catch(x){}
a.className='k '+b.dataset.k;var n=Object.keys(keus).length;document.getElementById('tel').textContent=n+' van '+D.length+' gekeurd';if(document.getElementById('filter').value==='open')setTimeout(function(){a.remove();},250);});
document.getElementById('filter').addEventListener('change',teken);
document.getElementById('bewaar').addEventListener('click',function(){var b=new Blob([JSON.stringify({gemaakt:new Date().toISOString(),keus:keus},null,1)],{type:'application/json'});var a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='keuring-boom.json';document.body.appendChild(a);a.click();a.remove();});
teken();
</script></body></html>'''
open(UIT, 'w', encoding='utf-8').write(pagina)
print('keurpagina met', len(rij), 'producten (weg:', sum(1 for x in rij if x['k'] == 'w'), 'twijfel:', sum(1 for x in rij if x['k'] == 't'), ')')
