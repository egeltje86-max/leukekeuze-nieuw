// Linkcontrole (8-11-2026, FABLE-OPDRACHT P0-5): gaat de winkelknop naar de winkel die erbij staat?
// Haalt uit de partnerlink het echte doeladres (r=, dl=, url=, u=, murl=) en vergelijkt het domein met wat
// de meeste producten van die winkel hebben. Afwijkers = vermoedelijk verkeerde bestemming.
// Gebruik: node scripts/controle/links.js <repo> [rapport.json]   -> exit 1 bij afwijkers.
const fs = require('fs'), path = require('path');
const dec = s => { try { return decodeURIComponent(s); } catch (e) { return s; } };
const R = path.resolve(process.argv[2] || '.'); const UIT = process.argv[3];
global.window = { dispatchEvent() {} }; global.Event = function () {};
require(path.join(R, 'assets/js/producten-lean.js'));
const DT = fs.readFileSync(path.join(R, 'assets/js/producten-details.js'), 'utf8'); eval(DT.replace(/^\/\*.*?\*\//s, ''));
const P = window.LK_PRODUCTEN.filter(p => p.status === 'goedgekeurd'); const D = window.LK_DETAILS || {};
function doel(u) {
  u = String(u || '');
  let m;
  if ((m = /[?&]li=(\d+)/.exec(u)) && /[?&]si=\d+/.test(u)) return 'daisycon:' + m[1];
  if ((m = /tradetracker\.net\/\?c=(\d+)/.exec(u))) { const r = /[?&]r=([^&]+)/.exec(u); if (r) { const v = dec(dec(r[1])); const h = /^(?:https?:\/\/)?(?:www\.)?([^/?#]+)/.exec(v); if (h) return h[1].toLowerCase(); } return 'tt:' + m[1]; }
  if (/awin1\.com/.test(u)) return 'awin:' + ((/[?&]m=(\d+)/.exec(u) || [])[1] || '?');
  for (const k of ['r', 'url', 'u', 'murl', 'ued']) {
    m = new RegExp('[?&]' + k + '=([^&]+)').exec(u);
    if (m) { let v = dec(dec(m[1])); const m2 = /murl=([^&]+)/.exec(v); if (m2) v = dec(m2[1]); if (!/^https?:/i.test(v)) continue; const h = /^(?:https?:\/\/)?(?:www\.)?([^/?#]+)/.exec(v); if (h) return h[1].toLowerCase(); }
  }
  const h = /^(?:https?:\/\/)?(?:www\.)?([^/?#]+)/.exec(u); return h ? h[1].toLowerCase() : '';
}
const perShop = {};
for (const p of P) { const u = (D[p.id] || {}).url || ''; const d = doel(u); if (!d) continue; (perShop[p.shop] = perShop[p.shop] || {})[d] = (perShop[p.shop][d] || 0) + 1; }
const fouten = [];
for (const p of P) {
  const u = (D[p.id] || {}).url || ''; const d = doel(u); if (!d) { fouten.push({ soort: 'geen-link', id: p.id, shop: p.shop, titel: p.titel }); continue; }
  const tel = perShop[p.shop]; const tot = Object.values(tel).reduce((a, b) => a + b, 0); const n = tel[d];
  if (tot >= 20 && n / tot < 0.02 && n <= 3) fouten.push({ soort: 'ander-domein', id: p.id, shop: p.shop, doel: d, titel: p.titel });
}
const rap = { datum: new Date().toISOString().slice(0, 10), fouten: fouten.length, lijst: fouten, domeinen: Object.fromEntries(Object.entries(perShop).map(([s, t]) => [s, Object.entries(t).sort((a, b) => b[1] - a[1]).slice(0, 3)])) };
if (UIT) fs.writeFileSync(UIT, JSON.stringify(rap, null, 1));
console.log('links: afwijkers', fouten.length);
fouten.slice(0, 40).forEach(f => console.log(' ', f.soort, f.shop, '->', f.doel || '', f.id, (f.titel || '').slice(0, 50)));
process.exit(fouten.length ? 1 : 0);
