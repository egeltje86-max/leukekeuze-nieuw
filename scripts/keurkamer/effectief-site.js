/* Nazorg (8-11-2026): alle producten precies zoals de site ze NU toont (na correcties.json: prijzen, partnerlinks, uitverkocht),
   uit assets/js/producten-lean.js + producten-details.js. Zelfde vorm als producten-effectief.json, zodat wacht.py ermee werkt.
   Gebruik: node scripts/keurkamer/effectief-site.js [uitvoer.json]   (standaard keurkamer/data/producten-site.json)
   Alleen lezen; verandert niets aan de site. */
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..', '..');
const w = { dispatchEvent() {}, addEventListener() {} };
global.Event = function () {};
const doc = { createEvent: () => ({ initEvent() {} }), addEventListener() {} };
new Function('window', 'document', fs.readFileSync(path.join(ROOT, 'assets/js/producten-lean.js'), 'utf8'))(w, doc);
new Function('window', 'document', fs.readFileSync(path.join(ROOT, 'assets/js/producten-details.js'), 'utf8'))(w, doc);
const uit = {};
for (const p of w.LK_PRODUCTEN) {
  if (p.status !== 'goedgekeurd') continue;
  const d = (w.LK_DETAILS || {})[p.id] || {};
  uit[p.id] = { id: p.id, titel: p.titel, prijs: p.prijs, oudePrijs: p.oudePrijs || null, shop: p.shop || 'bol', url: d.url || '', winkelUrl: d.winkelUrl || '' };
}
const bestand = process.argv[2] || path.join(ROOT, 'keurkamer/data/producten-site.json');
fs.mkdirSync(path.dirname(bestand), { recursive: true });
fs.writeFileSync(bestand, JSON.stringify({ gemaakt: new Date().toISOString(), producten: uit }));
console.log(Object.keys(uit).length, 'producten live ->', bestand);
