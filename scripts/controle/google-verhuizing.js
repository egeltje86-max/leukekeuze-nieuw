/* Controle voor Google na de nieuwe indeling: sturen alle oude adressen goed door, en kloppen de nieuwe pagina's (canonical, sitemap, geen noindex)? */
const fs = require('fs'), path = require('path'); const R = path.resolve(process.argv[2] || path.join(__dirname, '../..')); process.chdir(R);
/* Gebruik (na een bouw): node scripts/controle/google-verhuizing.js   -> alles moet 0 zijn; 'afwijkingen' zijn alleen lege of dunne vakjes (noindex, niet in de sitemap). */
global.window = { dispatchEvent() {} }; require(R + '/assets/js/data.js');
const pad = window.LK_VERHUISD.pad; const sm = fs.readFileSync('sitemap.xml', 'utf8');
const inSm = u => sm.includes('<loc>https://leukekeuze.nl' + u.replace(/\/$/, '') + '/</loc>');
const lees = p => { try { return fs.readFileSync('.' + p.replace(/\/$/, '') + '/index.html', 'utf8'); } catch (e) { return null; } };
const CAN = /rel="canonical" href="https:\/\/leukekeuze\.nl([^"]*)"/, REF = /refresh" content="0; url=([^"]*)"/;
let n = 0; const geenPagina = [], geenDoel = [], keten = [], canFout = [], oudInSm = [], doelNietInSm = [];
for (const [o, d] of Object.entries(pad)) {
  n++; const h = lees(o); if (!h) { geenPagina.push(o + ' -> ' + d); continue; }
  if (!/data-verhuisd/.test(h)) { canFout.push(o + ' (is geen doorstuurpagina)'); continue; }
  const can = (h.match(CAN) || [])[1], ref = (h.match(REF) || [])[1];
  const t = lees(ref || '/x'); if (!t) { geenDoel.push(o + ' -> ' + ref); continue; }
  if (/data-verhuisd/.test(t)) keten.push(o + ' -> ' + ref);
  if (can !== ref) canFout.push(o + ' canonical=' + can + ' doel=' + ref);
  if (inSm(o)) oudInSm.push(o); if (!inSm(ref)) doelNietInSm.push(ref);
}
console.log('oude adressen: ' + n);
console.log('  zonder doorstuurpagina: ' + geenPagina.length, geenPagina.slice(0, 40));
console.log('  doel bestaat niet: ' + geenDoel.length, geenDoel.slice(0, 8));
console.log('  doorsturen in twee stappen: ' + keten.length, keten.slice(0, 8));
console.log('  canonical wijst ergens anders heen: ' + canFout.length, canFout.slice(0, 8));
console.log('  oud adres staat nog in de sitemap: ' + oudInSm.length, oudInSm.slice(0, 8));
console.log('  nieuw adres staat niet in de sitemap: ' + doelNietInSm.length, [...new Set(doelNietInSm)].slice(0, 12));
let m = 0; const f = [];
for (const c of window.LK_CATEGORIEEN) {
  if (c.verborgen || /^(cadeaus|valentijn)$/.test(c.slug)) continue; const ps = ['/c/' + c.slug];
  for (const s of c.subs || []) { if (s.verborgen) continue; ps.push('/c/' + c.slug + '/' + s.slug); for (const v of s.vakjes || []) ps.push('/c/' + c.slug + '/' + s.slug + '/' + v.slug); }
  for (const p of ps) {
    const h = lees(p); if (!h) { f.push(p + ' GEEN PAGINA'); continue; } m++;
    const can = (h.match(CAN) || [])[1]; if (can !== p + '/') f.push(p + ' canonical=' + can);
    if (/<meta name="robots"[^>]*noindex/.test(h)) f.push(p + ' noindex'); if (!inSm(p)) f.push(p + ' niet in sitemap'); if (/data-verhuisd/.test(h)) f.push(p + ' is doorstuurpagina');
  }
}
console.log("pagina's in de nieuwe boom: " + m + ' | afwijkingen: ' + f.length, f.slice(0, 20));
