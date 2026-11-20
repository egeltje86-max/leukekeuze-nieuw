// Alle controles in één keer (8-11-2026, Fable): de gewone controle + budget + leeftijd + links.
// Gebruik: node scripts/controle/alles.js <repo> <uitmap>   -> schrijft <uitmap>/controle-<datum>.json, exit 1 als iets niet schoon is.
const { execFileSync } = require('child_process'), fs = require('fs'), path = require('path');
const R = path.resolve(process.argv[2] || '.'); const UITMAP = path.resolve(process.argv[3] || path.join(R, 'keurkamer', 'data'));
fs.mkdirSync(UITMAP, { recursive: true });
const datum = new Date().toISOString().slice(0, 10);
const uit = { datum, schoon: true, onderdelen: {} };
function run(naam, script, extra) {
  const rap = path.join(UITMAP, naam + '.json'); let ok = true, tekst = '';
  try { tekst = execFileSync('node', [path.join(R, 'scripts/controle', script), R, rap].concat(extra || []), { encoding: 'utf8', maxBuffer: 64 << 20 }); }
  catch (e) { ok = false; tekst = (e.stdout || '') + (e.stderr || ''); }
  let data = null; try { data = JSON.parse(fs.readFileSync(rap, 'utf8')); } catch (e) {}
  uit.onderdelen[naam] = { ok, samenvatting: tekst.split('\n').filter(Boolean).slice(0, 12).join('\n'), data: data && naam === 'check' ? Object.fromEntries(Object.entries(data).filter(([k, v]) => !Array.isArray(v) || v.length <= 20)) : data };
  if (!ok) uit.schoon = false;
  return ok;
}
// 1. De gewone controle: schoon = deze tellers allemaal 0.
run('check', 'check.js');
try {
  const c = JSON.parse(fs.readFileSync(path.join(UITMAP, 'check.json'), 'utf8'));
  const tellers = ['sitemapMist', 'redirectKapot', 'kapotteLinks', 'fotoMist', 'linkZonderCode', 'zonderVak'];
  const fout = tellers.filter(k => (Array.isArray(c[k]) ? c[k].length : (c[k] || 0)) > 0);
  uit.onderdelen.check.ok = fout.length === 0; uit.onderdelen.check.fout = fout; if (fout.length) uit.schoon = false;
} catch (e) { uit.onderdelen.check.ok = false; uit.schoon = false; }
run('budget', 'budget.js');
run('leeftijd', 'leeftijd.js');
run('links', 'links.js');
run('doelgroep', 'doelgroep.js');
run('paginas', 'paginas.js'); // 10-11-2026: geen verkeerde producten op een Voor wie-onderwerp (paginaregels)
run('prijsclaim', 'prijsclaim.js'); // 18-11-2026: geen 'Nu 30% korting' of 'Van €80 naar €68' in vaste teksten
run('keurmeester', 'keurmeester.js'); // 19-11-2026 CADEAUKEURMEESTER: de fouten uit de steekproef van Nova (grafsteenkaars bij Bedankje voor collega ...) komen niet terug, goede cadeaus blijven
run('seowacht', 'seo-wacht.js'); // 19-11-2026 GOOGLE-HERSTEL: nooit ongemerkt veel adressen of productpagina's tegelijk erbij of eraf (GO Marius nodig: LK_SEO_GO=1)
// 20-11-2026 (Marius: 'werk de dagelijkse controles bij, zodat ze de nieuwste dingen checken'): deze twee draaiden tot nu alleen met de hand.
// De piloot (dag.py) gebruikt alles.js, dus nu ook elke ochtend.
function runLos(naam, script, args) {
  let ok = true, tekst = '';
  try { tekst = execFileSync('node', [path.join(R, 'scripts/controle', script)].concat(args), { encoding: 'utf8', maxBuffer: 64 << 20, cwd: R }); }
  catch (e) { ok = false; tekst = (e.stdout || '') + (e.stderr || ''); }
  uit.onderdelen[naam] = { ok, samenvatting: tekst.split('\n').filter(Boolean).slice(0, 12).join('\n') };
  if (!ok) uit.schoon = false;
  return ok;
}
runLos('oudeAdressen', 'ooit.js', [R]); // 12-11-2026: elk adres dat ooit in de sitemap stond bestaat nog of stuurt door (Google: geen 404's)
runLos('gidsen', 'gidsen.js', [R, 'streng']); // 13-11-2026: geen gids met een verdwenen favoriet, plaatje of een rij met minder dan twee cadeaus
fs.writeFileSync(path.join(UITMAP, 'controle-' + datum + '.json'), JSON.stringify(uit, null, 1));
fs.writeFileSync(path.join(UITMAP, 'controle-laatste.json'), JSON.stringify(uit, null, 1));
console.log('CONTROLE', datum, uit.schoon ? 'SCHOON' : 'NIET SCHOON', Object.entries(uit.onderdelen).map(([k, v]) => k + ':' + (v.ok ? 'ok' : 'FOUT')).join(' '));
process.exit(uit.schoon ? 0 : 1);
