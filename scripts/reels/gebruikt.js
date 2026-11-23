// Zegt per product-id of het al in een fotoreel stond (scripts/reels/gebruikt.json). Gebruik: node scripts/reels/gebruikt.js id1 id2 ...
const R = require('./gebruikt.json').reels; const waar = {};
for (const r of R) for (const id of r.ids) (waar[id] = waar[id] || []).push(r.datum + ': ' + r.kop);
const ids = process.argv.slice(2); if (!ids.length) { console.log(Object.keys(waar).length + ' producten in ' + R.length + ' reels'); process.exit(0); }
let fout = 0; for (const id of ids) { if (waar[id]) { fout++; console.log('AL GEBRUIKT  ' + id + '  (' + waar[id].join('; ') + ')'); } else console.log('nieuw       ' + id); }
process.exit(fout ? 1 : 0);
