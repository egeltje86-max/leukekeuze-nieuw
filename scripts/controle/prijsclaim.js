// Controle (18-11-2026): staat er in een tekst nog een korting of oude prijs die niet uit een echte van-prijs komt?
// Kijkt in de gebouwde productlijst (titel, waarom, kort) en in de gebouwde gidsen en productpagina's die in de sitemap staan.
// Gebruik: node scripts/controle/prijsclaim.js <repo> <rapport.json>   -> exit 1 als er iets gevonden is.
const fs = require('fs'), path = require('path'), vm = require('vm');
const R = path.resolve(process.argv[2] || '.'), RAP = process.argv[3];
const { zinnen, isClaim } = require(path.join(R, 'scripts/boom/prijsclaim.js'));
const ctx = { window: { dispatchEvent() {}, addEventListener() {} }, document: { createEvent() { return { initEvent() {} }; }, addEventListener() {} }, Event: function () {} };
ctx.window.window = ctx.window; vm.createContext(ctx);
for (const f of ['assets/js/producten-lean.js', 'assets/js/producten-details.js']) vm.runInContext(fs.readFileSync(path.join(R, f), 'utf8'), ctx);
const D = ctx.window.LK_DETAILS || {}; const fout = [];
for (const p of ctx.window.LK_PRODUCTEN || []) {
  if (p.status && p.status !== 'goedgekeurd' && p.status !== 'uitverkocht') continue;
  for (const veld of ['waarom', 'kort']) {
    const t = p[veld] || (D[p.id] || {})[veld];
    if (typeof t === 'string') for (const z of zinnen(t)) if (isClaim(z)) fout.push({ id: p.id, veld, zin: z });
  }
}
// Gidsen: kijk in alle tekst van de gebouwde gids (vangnet voor teksten buiten de productlijst). De Black Friday-gids legt juist uit hoe korting werkt: die niet.
// En: belooft de titel of inleiding meer cadeaus dan de gids laat zien ('20 ideeën' terwijl er 19 staan)?
const gids = path.join(R, 'gids'), getal = [];
if (fs.existsSync(gids)) for (const d of fs.readdirSync(gids)) {
  const f = path.join(gids, d, 'index.html'); if (!fs.existsSync(f)) continue;
  const h = fs.readFileSync(f, 'utf8'); const main = (h.split('<main')[1] || '').split('</main>')[0];
  const tekst = main.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<template[\s\S]*?<\/template>/g, ' ').replace(/<[^>]+>/g, '\n').replace(/&[a-z#0-9]+;/g, ' ');
  if (!/black-friday/.test(d)) for (const r of tekst.split(/\n+/)) for (const z of zinnen(r.trim())) if (z && isClaim(z)) fout.push({ gids: d, zin: z.slice(0, 160) });
  const m = /class="gids-meta">[\s\S]*?(\d+) cadeaus/.exec(h); if (!m) continue;
  const n = +m[1], kop = ((/<title>([^<]*)/.exec(h) || [])[1] || '') + ' ' + ((/<h1[^>]*>([^<]*)/.exec(main) || [])[1] || ''); /* alleen de titel belooft een aantal */
  for (const x of kop.matchAll(/\b(\d+)(?=\s+(?:(?:leuke|goede|mooie|originele|toffe|kleine|handige|grappige|warme)\s+)?(?:ideeën|ideeen|cadeaus|cadeau-ideeën|cadeautjes|kerstcadeaus|cadeautips)\b)/g)) if (+x[1] > n) { getal.push({ gids: d, belooft: +x[1], toont: n }); break; }
}
for (const x of getal) fout.push({ gids: x.gids, zin: 'belooft ' + x.belooft + ' cadeaus, toont er ' + x.toont });
if (RAP) fs.writeFileSync(RAP, JSON.stringify({ aantal: fout.length, fout: fout.slice(0, 200) }, null, 1));
console.log('prijsclaims in teksten en te hoge aantallen in gidsen: ' + fout.length); for (const x of fout.slice(0, 10)) console.log('  ' + (x.id || x.gids) + ': ' + x.zin);
process.exit(fout.length ? 1 : 0);
