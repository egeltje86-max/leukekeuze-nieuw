// Leeftijdscontrole (8-11-2026, FABLE-OPDRACHT P0-2): geen speelgoed voor 3+ in een babyselectie,
// en geen product met leeftijd 0-2 dat eruitziet als iets met kleine onderdelen.
// Gebruik: node scripts/controle/leeftijd.js <repo> [rapport.json]   -> exit 1 bij fouten.
const fs = require('fs'), path = require('path');
const R = path.resolve(process.argv[2] || '.'); const UIT = process.argv[3];
global.window = { dispatchEvent() {} }; global.Event = function () {};
require(path.join(R, 'assets/js/producten-lean.js'));
const P = window.LK_PRODUCTEN.filter(p => p.status === 'goedgekeurd');
const fouten = [];
const inBaby = p => (p.voor || []).includes('baby') || (p.ookIn || []).includes('cadeaus/baby-kraam') || (p.cat === 'cadeaus' && p.sub === 'baby-kraam');
const VERDACHT = /\blego\b(?!.*duplo)|playmobil(?!.*(junior|1\.2\.3|123))|(?<!\d)(?:[3-9]|1[0-9])\s*\+|kleine onderdelen|small parts|verstikking/i;
for (const p of P) {
  if (p.leeftijd && p.leeftijd[0] >= 3 && p.leeftijd[0] < 16 && inBaby(p)) fouten.push({ soort: 'baby-maar-3plus', id: p.id, titel: p.titel, leeftijd: p.leeftijd });
  if (p.leeftijd && p.leeftijd[0] <= 2 && VERDACHT.test(p.titel)) fouten.push({ soort: '0-2-maar-verdacht', id: p.id, titel: p.titel, leeftijd: p.leeftijd });
  if (!p.leeftijd && p.cat === 'speelgoed' && p.sub === 'baby-peuter' && VERDACHT.test(p.titel)) fouten.push({ soort: 'baby-peuter-onbekend-verdacht', id: p.id, titel: p.titel });
}
const rap = { datum: new Date().toISOString().slice(0, 10), fouten: fouten.length, lijst: fouten };
if (UIT) fs.writeFileSync(UIT, JSON.stringify(rap, null, 1));
console.log('leeftijd: fouten', fouten.length);
fouten.forEach(f => console.log(' ', f.soort, f.id, JSON.stringify(f.leeftijd || null), f.titel.slice(0, 70)));
process.exit(fouten.length ? 1 : 0);
