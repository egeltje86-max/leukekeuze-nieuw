/* Gebruik: node scripts/controle/ooit.js .   (na een bouw)
   Bewaakt dat geen enkel adres dat ooit in de sitemap stond 'niet gevonden' geeft (12-11-2026: Google mailde over 404's;
   165 oude adressen bestonden niet meer). De lijst staat in scripts/controle/ooit-adressen.txt en groeit vanzelf mee:
   elk adres uit de sitemap van nu komt erbij. Een adres dat niet meer bestaat hoort een doorstuurpagina te krijgen:
   zet het in scripts/boom/correcties.json onder 'adressen' ('oud/pad': '/nieuw/pad/') en bouw opnieuw. */
const fs = require('fs'), path = require('path'); const R = process.argv[2] || '.';
const LIJST = path.join(R, 'scripts/controle/ooit-adressen.txt');
const ooit = new Set(fs.readFileSync(LIJST, 'utf8').split('\n').map(s => s.trim()).filter(Boolean));
const nu = (fs.readFileSync(path.join(R, 'sitemap.xml'), 'utf8').match(/<loc>[^<]*<\/loc>/g) || []).map(l => l.replace(/<\/?loc>/g, '').replace(/^https?:\/\/[^/]+/, ''));
let erbij = 0; nu.forEach(a => { if (!ooit.has(a)) { ooit.add(a); erbij++; } });
if (erbij) fs.writeFileSync(LIJST, [...ooit].sort().join('\n') + '\n');
const lees = p => { try { return fs.readFileSync(path.join(R, p.replace(/[?#].*$/, '').replace(/\/$/, ''), 'index.html'), 'utf8').slice(0, 3000); } catch (e) { return null; } };
const REF = /refresh" content="0; url=([^"]*)"/; const kapot = [], noindex = [];
for (const a of ooit) {
  let p = a, n = 0, h = lees(p);
  while (h && /data-verhuisd/.test(h.slice(0, 600)) && n < 6) { p = (h.match(REF) || [])[1]; n++; h = p ? lees(p) : null; }
  if (!h) kapot.push(a); else if (n && /noindex/.test(h.slice(0, 1500))) noindex.push(a + ' -> ' + p);
}
console.log('adressen ooit in de sitemap: ' + ooit.size + (erbij ? ' (' + erbij + ' nieuw)' : '') + ' | niet gevonden: ' + kapot.length + ' | stuurt door naar een pagina die Google niet mag opnemen: ' + noindex.length);
kapot.slice(0, 40).forEach(a => console.log('  NIET GEVONDEN ' + a)); noindex.slice(0, 20).forEach(a => console.log('  NOINDEX ' + a));
process.exit(kapot.length ? 1 : 0);
