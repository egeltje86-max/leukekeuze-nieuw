/* Operatie Cadeauziel fase 2 (24-11-2026, opdracht Dark Nova, GO Marius): maakt assets/js/cadeauziel.js uit openingen.json.
   p = pagina (zonder slash aan het eind, of /#tot-25) -> product-ids in de volgorde van Nova; s = straatwinkel -> afdeling -> ids.
   Compact: elke id staat één keer in een tabel; een opening is een rij getallen (base 36, gescheiden door een punt). Het stukje onderaan zet het terug.
   Alleen voor bezoekers (WIJZER b, de winkelweergave en de straat); zoekmachines en de bouw voor Google zien de gewone volgorde.
   Uit: window.LK_CADEAUZIEL_FASE2 = false, of zelf vergelijken met ?proef=cadeauziel-uit (weer aan: ?proef=cadeauziel). */
const fs = require('fs'), path = require('path');
const R = path.join(__dirname, '..', '..');
const d = JSON.parse(fs.readFileSync(path.join(__dirname, 'openingen.json'), 'utf8'));
const T = [], I = {};
const rij = ids => ids.map(id => { if (I[id] === undefined) { I[id] = T.length; T.push(id); } return I[id].toString(36); }).join('.');
const p = {}, s = {};
for (const k of Object.keys(d.p)) p[k] = rij(d.p[k]);
for (const w of Object.keys(d.s)) { s[w] = {}; for (const n of Object.keys(d.s[w])) s[w][n] = rij(d.s[w][n]); }
const uit = '/* Gemaakt door scripts/cadeauziel/maak.js (Operatie Cadeauziel fase 2, Dark Nova). Niet met de hand aanpassen. */\n(function () { var T = ' + JSON.stringify(T) + ', P = ' + JSON.stringify(p) + ', S = ' + JSON.stringify(s) + ';\n' +
  'function z(r) { return r.split(".").map(function (x) { return T[parseInt(x, 36)]; }); }\n' +
  'var p = {}, s = {}, k, n; for (k in P) p[k] = z(P[k]); for (k in S) { s[k] = {}; for (n in S[k]) s[k][n] = z(S[k][n]); }\n' +
  'window.LK_CADEAUZIEL = { p: p, s: s }; })();\n';
fs.writeFileSync(path.join(R, 'assets/js/cadeauziel.js'), uit);
console.log('cadeauziel: ' + Object.keys(d.p).length + ' openingen, ' + Object.keys(d.s).length + ' winkels, ' + T.length + ' producten, ' + uit.length + ' tekens');
