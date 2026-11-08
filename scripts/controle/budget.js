// Budgetcontrole (8-11-2026, FABLE-OPDRACHT P0-1): elke belofte "onder €X" moet kloppen.
// Kijkt naar: de met de hand gekozen gidsen in app.js (slug/titel/kopjes met "onder €X" of "tot €X"),
// de vakken cadeaus/onder-15, cadeaus/sint-onder-15 en christelijk/onder-25 (via ookIn/cat+sub),
// en de prijsknoppen (die filteren live, dus alleen de vaste lijsten tellen).
// Gebruik: node scripts/controle/budget.js <repo> [rapport.json]   -> exit 1 als er iets te duur is.
const fs = require('fs'), path = require('path');
const R = path.resolve(process.argv[2] || '.'); const UIT = process.argv[3];
global.window = { dispatchEvent() {} }; global.Event = function () {};
require(path.join(R, 'assets/js/producten-lean.js'));
const P = {}; window.LK_PRODUCTEN.forEach(p => { P[p.id] = p; });
const src = fs.readFileSync(path.join(R, 'assets/js/app.js'), 'utf8');

const grens = s => { const m = /(?:onder|tot|max(?:imaal)?)\s*(?:de\s*)?(?:€\s*)?(\d+)(?:\s*euro)?/i.exec(s || ''); return m ? +m[1] : null; };
const fouten = [];

// 1. Gidsen: elk object { slug: '...', ... delen: [ { kop, ids } ] ... }
const gidsRe = /\{ slug: '([a-z0-9-]+)',[^\n]*?titel: '((?:[^'\\]|\\.)*)'/g;
let m; const starts = [];
while ((m = gidsRe.exec(src))) starts.push({ slug: m[1], titel: m[2], at: m.index });
for (let i = 0; i < starts.length; i++) {
  const g = starts[i]; const vlg = src.indexOf("{ slug: '", g.at + 10); const blok = src.slice(g.at, vlg === -1 ? g.at + 20000 : vlg);
  const gidsMax = grens(g.slug.replace(/-/g, ' ')) || grens(g.titel);
  const delenRe = /kop: '((?:[^'\\]|\\.)*)'[^{}]*?ids: \[([^\]]*)\]/g; let d;
  while ((d = delenRe.exec(blok))) {
    const kopMax = grens(d[1]); const max = kopMax || gidsMax; if (!max) continue;
    for (const id of d[2].split(',').map(s => s.replace(/['"\s]/g, '')).filter(Boolean)) {
      const p = P[id]; if (!p) continue;
      if (p.prijs > max) fouten.push({ waar: 'gids/' + g.slug, deel: d[1], id, titel: p.titel, prijs: p.prijs, max });
    }
  }
  if (gidsMax) { const topRe = /top: \[((?:\[[^\]]*\],?\s*)+)\]/.exec(blok); if (topRe) for (const id of [...topRe[1].matchAll(/'([a-z0-9-]+)'\]/g)].map(x => x[1])) { const p = P[id]; if (p && p.prijs > gidsMax) fouten.push({ waar: 'gids/' + g.slug, deel: 'top', id, titel: p.titel, prijs: p.prijs, max: gidsMax }); } }
}
// 2. Vaste vakken met een budget in de naam
const VAK = { 'cadeaus/onder-15': 15, 'cadeaus/sint-onder-15': 15, 'christelijk/onder-25': 25, 'cadeaus/onder-10': 10, 'cadeaus/sint-onder-10': 10 };
for (const p of window.LK_PRODUCTEN) {
  if (p.status !== 'goedgekeurd') continue;
  const plekken = [(p.cat || p.afd) + '/' + (p.sub || p.groep)].concat(p.ookIn || []);
  for (const pl of plekken) if (VAK[pl] && p.prijs > VAK[pl] && !(p.tags || []).includes('uitdelen')) fouten.push({ waar: 'vak ' + pl, id: p.id, titel: p.titel, prijs: p.prijs, max: VAK[pl] });
}
const rap = { datum: new Date().toISOString().slice(0, 10), teDuur: fouten.length, fouten };
if (UIT) fs.writeFileSync(UIT, JSON.stringify(rap, null, 1));
console.log('budget: te duur', fouten.length);
fouten.forEach(f => console.log(' ', f.waar, '|', f.deel || '', '|', f.id, '€' + f.prijs, '> €' + f.max, '|', f.titel.slice(0, 60)));
process.exit(fouten.length ? 1 : 0);
