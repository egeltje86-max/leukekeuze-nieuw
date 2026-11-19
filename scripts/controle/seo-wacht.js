/* SEO-WACHT (19-11-2026, GOOGLE-HERSTEL; idee Nova, opdracht Marius: 'nooit meer duizenden pagina's tegelijk live zonder menselijke controle').
   Vergelijkt de net gebouwde site met wat nu live staat (de laatste commit, HEAD) en houdt de publicatie tegen als er ineens veel verandert
   in wat Google ziet:
   - adressen die erbij komen in de sitemap of eruit verdwijnen (meer dan GRENS);
   - nieuwe productpagina's (mappen p/<id>/ die er nog niet waren) of productpagina's die verdwijnen (meer dan GRENS).
   Bij te veel: exitcode 1, dus 'CONTROLE NIET SCHOON' en er wordt niet gepusht (ook de piloot niet).
   Doorgaan mag alleen na GO van Marius: LK_SEO_GO=1 node scripts/controle/alles.js . keurkamer/data
   Gebruik: node scripts/controle/seo-wacht.js <repo> [rapport.json] */
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const R = path.resolve(process.argv[2] || '.');
const RAP = process.argv[3];
const GRENS = Number(process.env.LK_SEO_GRENS || 100);
const git = (args) => { try { return execFileSync('git', args, { cwd: R, encoding: 'utf8', maxBuffer: 256 << 20 }); } catch (e) { return null; } };
const locs = (xml) => new Set([...String(xml || '').matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]));
const live = git(['show', 'HEAD:sitemap.xml']);
const nu = fs.readFileSync(path.join(R, 'sitemap.xml'), 'utf8');
const uit = { grens: GRENS, go: process.env.LK_SEO_GO === '1' };
if (live === null) { uit.opmerking = 'geen vorige sitemap in git gevonden; niets te vergelijken'; }
else {
  const a = locs(live), b = locs(nu);
  uit.sitemapErbij = [...b].filter(x => !a.has(x)).length;
  uit.sitemapEruit = [...a].filter(x => !b.has(x)).length;
  uit.sitemapVoorbeeldErbij = [...b].filter(x => !a.has(x)).slice(0, 10);
  uit.sitemapVoorbeeldEruit = [...a].filter(x => !b.has(x)).slice(0, 10);
}
/* nieuwe en verdwenen productpagina's ten opzichte van de laatste commit */
const status = git(['status', '--porcelain', '--untracked-files=all', '--', 'p']);
if (status !== null) {
  const regels = status.split('\n').filter(Boolean);
  uit.productpaginasNieuw = regels.filter(r => r.startsWith('??') && /p\/[^/]+\/index\.html$/.test(r)).length;
  uit.productpaginasWeg = regels.filter(r => /^ ?D/.test(r) && /p\/[^/]+\/index\.html$/.test(r)).length;
}
const teVeel = ['sitemapErbij', 'sitemapEruit', 'productpaginasNieuw', 'productpaginasWeg'].filter(k => (uit[k] || 0) > GRENS);
uit.teVeel = teVeel;
uit.ok = !teVeel.length || uit.go;
if (RAP) fs.writeFileSync(RAP, JSON.stringify(uit, null, 1));
console.log('seo-wacht: sitemap +' + (uit.sitemapErbij || 0) + ' / -' + (uit.sitemapEruit || 0) + ', productpagina\'s nieuw ' + (uit.productpaginasNieuw || 0) + ' / weg ' + (uit.productpaginasWeg || 0) + ' (grens ' + GRENS + ')');
if (teVeel.length && !uit.go) { console.log('seo-wacht: TE VEEL IN EEN KEER (' + teVeel.join(', ') + '). Niet publiceren zonder GO van Marius (daarna: LK_SEO_GO=1).'); process.exit(1); }
if (teVeel.length && uit.go) console.log('seo-wacht: boven de grens, maar met GO van Marius (LK_SEO_GO=1).');
