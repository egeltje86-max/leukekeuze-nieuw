/* Welke producten heeft Marius zelf gekozen of goedgekeurd? (20-11-2026, Cadeaukeurmeester fase 2, opdracht Nova via Marius:
   'bescherm alle handmatig geselecteerde producten van Marius'.)
   Bron: de blokken in assets/js/producten.js. Een blok telt als keuze van Marius als de kop dat zegt ('gekeurd door Marius',
   'keuze(s) van Marius', 'aangeklikt door Marius', 'gekozen door Marius', ERBIJ-lijst, Partnerronde, Superkeurkamer, Goedkope toppers)
   of als het product herkomst superkeurkamer, kieslijst of erbij-* heeft. Sommige rondes waren voor één gelegenheid of persoon
   (Ronde Bedankje, Afscheid & pensioen, Babyknuffels ...): daar houdt het product zijn plek (geen aftrek van de keurmeester).
   Gebruikt door pas.js (vrijstelling per tak) en scripts/controle/keurmeester.js (bewaking). */
'use strict';
const fs = require('fs'), path = require('path');
const KOP_MARIUS = /gekeurd door marius|keuzes? van marius|aangeklikt door marius|gekozen door marius|goedgekeurd door marius|erbij-lijst|partnerronde|superkeurkamer|goedkope toppers|marius koos|keuze marius|wens marius.*gekozen/i;
/* Rondes voor één tak: [woorden in de kop, sleutels zonder aftrek] */
const TAK = [
  [/ronde bedankje & lootjes/i, ['g.bedankt', 'g.lootjes', 'p.collega']],
  [/ronde bedankje\b/i, ['g.bedankt', 'p.collega']],
  [/ronde afscheid & pensioen/i, ['g.afscheid', 'p.collega']],
  [/ronde babyshower|ronde babyknuffels|ronde babykleding|ronde kraamcadeaus|ronde 6b baby/i, ['p.baby']],
  [/ronde 6c kinderkamer|ronde voor kinderen|ronde 6 kinderkleding/i, ['p.kinderen']],
  [/ronde sinterklaas & kerst/i, ['g.sinterklaas', 'g.kerst']],
  [/ronde afscheid/i, ['g.afscheid']]
];
function lees(root) {
  const s = fs.readFileSync(path.join(root, 'assets/js/producten.js'), 'utf8');
  const uit = {}; /* id -> { blok, tak: [...] } */
  const re = /\/\* ===== (?!einde)([^\n]*?)(?:=====|\*\/)/g; const koppen = [];
  let m; while ((m = re.exec(s))) koppen.push([m.index, m[1]]);
  koppen.push([s.length, '']);
  for (let i = 0; i < koppen.length - 1; i++) {
    const [a, kop] = koppen[i], b = koppen[i + 1][0]; const stuk = s.slice(a, b);
    const marius = KOP_MARIUS.test(kop); const tak = []; for (const [w, k] of TAK) if (w.test(kop)) { tak.push(...k); break; }
    const ids = stuk.match(/"id": ?"[^"]+"/g) || [];
    for (const x of ids) { const id = x.replace(/"id": ?"/, '').slice(0, -1); const her = (new RegExp('"id": ?"' + id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '"[^}]*?"herkomst": ?"([^"]+)"').exec(stuk) || [])[1] || '';
      if (marius || /^(superkeurkamer|kieslijst|erbij-)/.test(her)) uit[id] = { blok: kop.slice(0, 80), tak: tak.slice(), herkomst: her }; }
  }
  /* Eigen Black Friday-deals (topkeuze.js LK_TOPKEUZE) en paginaregels met_de_hand. */
  try { const w = {}; new Function('window', fs.readFileSync(path.join(root, 'assets/js/topkeuze.js'), 'utf8'))(w);
    for (const id of ((w.LK_TOPKEUZE || {})['/collectie/black-friday'] || [])) uit[id] = Object.assign(uit[id] || { blok: 'Black Friday: eigen deals', tak: [] }, {}); } catch (e) {}
  return uit;
}
module.exports = { lees, KOP_MARIUS };
if (require.main === module) { const u = lees(path.resolve(process.argv[2] || '.')); const n = Object.keys(u).length; const t = Object.values(u).filter((x) => x.tak.length).length; console.log('keuzes van Marius:', n, '| met een eigen tak:', t); }
