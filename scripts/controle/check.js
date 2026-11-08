// Controles 1, 3, 4, 5, 6 op de live repo (alleen lezen). Uitvoer: rapport.json
const fs = require('fs'), path = require('path');
const R = process.argv[2]; const UIT = process.argv[3];
global.window = { dispatchEvent() {} }; global.Event = function () {};
require(path.join(R, 'assets/js/producten-lean.js'));
const DT = fs.readFileSync(path.join(R, 'assets/js/producten-details.js'), 'utf8');
eval(DT.replace(/^\/\*.*?\*\//s, ''));
const ALLE = window.LK_PRODUCTEN, DET = window.LK_DETAILS;
const P = ALLE.filter(p => p.status === 'goedgekeurd');
const rap = {};
const bestaat = u => { u = u.split('#')[0].split('?')[0]; if (!u.startsWith('/')) return true; const f = path.join(R, decodeURIComponent(u)); return fs.existsSync(f) && (fs.statSync(f).isFile() || fs.existsSync(path.join(f, 'index.html'))); };

// 1. sitemap + interne links + redirects + oude GSC-adressen
const sm = [...fs.readFileSync(path.join(R, 'sitemap.xml'), 'utf8').matchAll(/<loc>https:\/\/leukekeuze\.nl([^<]*)<\/loc>/g)].map(m => m[1]);
rap.sitemapMist = sm.filter(u => !bestaat(u));
const html = []; (function loop(d) { for (const e of fs.readdirSync(d, { withFileTypes: true })) { if (e.name.startsWith('.') || e.name === 'node_modules' || e.name === 'images' || e.name === 'assets' || e.name === 'scripts' || e.name === 'keurkamer') continue; const f = path.join(d, e.name); if (e.isDirectory()) loop(f); else if (e.name === 'index.html') html.push(f); } })(R);
const kapot = {}, redirKapot = []; let doorstuur = 0;
for (const f of html) {
  const t = fs.readFileSync(f, 'utf8'); const pag = '/' + path.relative(R, path.dirname(f)).replace(/\\/g, '/') + '/';
  const rd = t.match(/http-equiv="refresh" content="0;\s*url=([^"]+)"/i) || t.match(/location\.replace\(['"]([^'"]+)['"]\)/);
  if (rd) { doorstuur++; const doel = rd[1].replace('https://leukekeuze.nl', ''); if (!bestaat(doel)) redirKapot.push([pag, doel]); continue; }
  for (const m of t.matchAll(/href="(\/[^"]*)"/g)) { const u = m[1]; if (/^\/(assets|images|favicon|sitemap|manifest)/.test(u)) continue; if (!bestaat(u)) (kapot[u] = kapot[u] || []).push(pag); }
}
rap.paginas = html.length; rap.doorstuurpaginas = doorstuur; rap.redirectKapot = redirKapot;
rap.kapotteLinks = Object.entries(kapot).map(([u, v]) => [u, v.length, v.slice(0, 3)]).sort((a, b) => b[1] - a[1]);
try { const g = JSON.parse(fs.readFileSync(path.join(R, 'keurkamer/data/boom/gsc-pages.json'), 'utf8')); const lijst = (Array.isArray(g) ? g : g.rows || g.pages || []).map(x => typeof x === 'string' ? x : (x.page || x.url || (x.keys || [])[0])).filter(Boolean).map(u => u.replace(/^https?:\/\/(www\.)?leukekeuze\.nl/, '') || '/');
  rap.gscTotaal = lijst.length; rap.gscMist = lijst.filter(u => u !== '/' && !bestaat(u)); } catch (e) { rap.gscFout = e.message; }

// 3. dubbele producten (zelfde genormaliseerde titel, of zelfde winkel-url)
const norm = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\(.*?\)/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
const opT = {}, opU = {};
for (const p of P) { (opT[norm(p.titel)] = opT[norm(p.titel)] || []).push(p); const u = (DET[p.id] || {}).winkelUrl; if (u) { const k = u.split('?')[0].replace(/\/$/, ''); (opU[k] = opU[k] || []).push(p); } }
const kort = p => `${p.id} | ${p.titel} | €${p.prijs} | ${p.shop} | ${p.afd}/${p.vak}`;
rap.dubbelTitel = Object.values(opT).filter(l => l.length > 1).map(l => l.map(kort));
rap.dubbelUrl = Object.values(opU).filter(l => l.length > 1 && new Set(l.map(p => norm(p.titel))).size > 1).map(l => l.map(kort));

// 4. foto's
let PIL = null; const fotoMist = [], fotoKlein = [];
const maat = f => { const b = fs.readFileSync(f); if (b.toString('ascii', 0, 4) !== 'RIFF') return null; const s = b.toString('ascii', 12, 16);
  if (s === 'VP8 ') return [b.readUInt16LE(26) & 0x3fff, b.readUInt16LE(28) & 0x3fff];
  if (s === 'VP8L') { const n = b.readUInt32LE(21); return [(n & 0x3fff) + 1, ((n >> 14) & 0x3fff) + 1]; }
  if (s === 'VP8X') return [1 + b.readUIntLE(24, 3), 1 + b.readUIntLE(27, 3)]; return null; };
for (const p of P) { const f = p.beeld ? path.join(R, p.beeld.replace(/^\//,'') + (/\.\w+$/.test(p.beeld) ? '' : '.webp')) : path.join(R, 'images/producten', p.id + '.webp');
  if (!fs.existsSync(f)) { fotoMist.push(kort(p)); continue; } const m = maat(f); if (m && Math.max(...m) < 400) fotoKlein.push(kort(p) + ` | ${m[0]}x${m[1]}`); }
rap.fotoMist = fotoMist; rap.fotoKlein = fotoKlein;

// 5. winkellinks: partnercode
const soort = u => {
  if (!u) return 'GEEN LINK';
  if (/partner\.bol\.com/.test(u)) return /[?&]s=1545784/.test(u) ? 'bol-partner' : 'bol-partner ZONDER 1545784';
  if (/(^|\.)bol\.com/.test(u)) return 'bol DIRECT (geen partner)';
  if (/^https?:\/\/(lt45|fr135|bdt9|glp8|ds1|jdt8|rkn3|jf79)\.n[le]t?\/c\/|aff\.svinando\.be|daisycon/.test(u)) return 'daisycon';
  if (/[?&]a=516846\b/.test(u) || /tradetracker|[?&]tt=\d+_/.test(u) || /tc\.tradetracker/.test(u)) return 'tradetracker';
  if (/awin1\.com|awin\.com/.test(u)) return /awinaffid=|[?&]a=3110079/.test(u) ? 'awin' : 'awin ZONDER affid';
  if (/amazon\./.test(u)) return /tag=leukekeuze-21/.test(u) ? 'amazon' : 'amazon ZONDER tag';
  if (/dextercards/.test(u)) return /aff=LEUKEKEUZE/.test(u) ? 'dextercards' : 'dextercards ZONDER aff';
  return 'DIRECT: ' + u.replace(/^https?:\/\/(www\.)?/, '').split(/[/?]/)[0];
};
const sl = {}; for (const p of P) { const d = DET[p.id] || {}; const k = soort(d.url); (sl[k] = sl[k] || []).push(p); }
rap.links = Object.fromEntries(Object.entries(sl).map(([k, l]) => [k, { aantal: l.length, winkels: [...new Set(l.map(p => p.shop))].slice(0, 12), voorbeeld: l.slice(0, 3).map(p => p.id + ' ' + (DET[p.id] || {}).url) }]).sort((a, b) => b[1].aantal - a[1].aantal));

// 6. vakjes: aantal zichtbare producten (hoofdvak + ookIn)
global.document={};eval(fs.readFileSync(path.join(R,'assets/js/data.js'),'utf8'));
const tel = {}; for (const p of P) { const k = p.afd + '/' + p.groep + '/' + p.vak; tel[k] = (tel[k] || 0) + 1; }
const vakken = [];
for (const a of window.LK_CATEGORIEEN) { if (a.naar || a.verborgen) continue; for (const g of (a.subs || [])) { if (g.naar || g.verborgen) continue; for (const v of (g.vakjes || [])) { if (v.naar || v.verborgen) continue; const k = a.slug + '/' + g.slug + '/' + v.slug; vakken.push([k, tel[k] || 0, a.naam + ' > ' + g.naam + ' > ' + v.naam]); } } }
rap.vakkenTotaal = vakken.length; rap.vakLeeg = vakken.filter(v => v[1] === 0).map(v => v[2]); rap.vakDun = vakken.filter(v => v[1] > 0 && v[1] < 3).map(v => v[2] + ' (' + v[1] + ')'); rap.vak3tot9 = vakken.filter(v => v[1] >= 3 && v[1] < 10).map(v => v[2] + ' (' + v[1] + ')');
rap.zonderVak = P.filter(p => !p.vak).map(kort);
rap.linkZonderCode = Object.entries(sl).filter(([k]) => /ZONDER|DIRECT \(geen|GEEN LINK/.test(k)).flatMap(([k, l]) => l.map(p => k + ': ' + kort(p)));
fs.writeFileSync(UIT, JSON.stringify(rap, null, 1));
for (const [k, v] of Object.entries(rap)) console.log(k, Array.isArray(v) ? v.length : (typeof v === 'object' ? '' : v));
console.log(JSON.stringify(rap.links, null, 0).slice(0, 3000));
