/* Gidsen nakijken (sinds de grote keuring van 13-11-2026).
   Gebruik: node scripts/controle/gidsen.js . [bestand met ids die als weg tellen (json-lijst)] [streng]
   Een gids wordt met de hand gevuld. Haal je daarna producten weg (WEG-lijst, nazorg, uitverkocht), dan valt zo'n
   product stil uit de gids. Dit hulpje laat zien waar dat een gat geeft:
   FOUT   = het plaatje van de gids of een favoriet ('Snel kiezen') bestaat niet meer, of een rij heeft minder dan 2 cadeaus over.
   LET OP = een rij mist een cadeau of een cadeau staat twee keer in dezelfde gids. ('Van €.. tot €..' rekent de site zelf uit: gidsBereik in app.js.)
   Draai na een bouw (leest producten-lean.js, dus de stand ná de correcties). Met 'streng' is de uitkomst 1 bij een FOUT. */
const fs = require('fs'); const path = require('path'); const R = path.resolve(process.argv[2] || '.') + '/';
const extra = process.argv[3] && process.argv[3] !== 'streng' ? new Set(JSON.parse(fs.readFileSync(process.argv[3], 'utf8'))) : new Set();
const STRENG = process.argv.indexOf('streng') !== -1;
global.window = { dispatchEvent() {} }; global.Event = function () {}; global.document = { createEvent: () => ({ initEvent() {} }) };
require(R + 'assets/js/producten-lean.js'); const M = {}; window.LK_PRODUCTEN.forEach(p => M[p.id] = p);
const eind = i => { const p = M[i]; return p && p.samengevoegd ? p.samengevoegd : i; };
const goed = i => { const e = eind(i), p = M[e]; return !!p && p.status === 'goedgekeurd' && !extra.has(i) && !extra.has(e); };
const A = fs.readFileSync(R + 'assets/js/app.js', 'utf8').split('\n');
const van = A.findIndex(l => /var GIDSEN\s*=\s*\[/.test(l)), tot = A.findIndex(l => /var GIDS_EXTRA\s*=/.test(l));
if (van < 0 || tot < 0) { console.error('GIDSEN of GIDS_EXTRA niet gevonden in app.js'); process.exit(2); }
const Q = '[\'"]'; const STR = '(?:\'((?:[^\'\\\\]|\\\\.)*)\'|"((?:[^"\\\\]|\\\\.)*)")'; const str = (l, naam) => { const m = l.match(new RegExp('\\b' + naam + ':\\s*' + STR)); return m ? (m[1] !== undefined ? m[1] : m[2]) : null; };
const lijst = t => (t.match(/['"]([^'"]+)['"]/g) || []).map(x => x.slice(1, -1));
const G = []; let g = null, kop = '';
for (let i = van; i < tot; i++) {
  const l = A[i]; let m = l.match(new RegExp('\\{\\s*slug:\\s*' + Q + '([a-z0-9-]+)' + Q));
  if (m) { g = { slug: m[1], regel: i + 1, beeld: str(l, 'beeld'), rijen: [], kort: '', max: null }; G.push(g); }
  if (!g) continue;
  const k = str(l, 'kort'); if (k !== null && !g.kort) g.kort = k;
  m = l.match(/\bmax:\s*([0-9.]+)/); if (m && g.max == null) g.max = +m[1];
  const kp = str(l, 'kop'); if (kp !== null) kop = kp;
  m = l.match(/\bids:\s*\[([^\]]*)\]/); if (m) g.rijen.push({ regel: i + 1, kop, ids: lijst(m[1]) });
}
const TOP = {}; for (let i = tot; i < A.length; i++) { const m = A[i].match(new RegExp('^\\s*' + Q + '([a-z0-9-]+)' + Q + ':\\s*\\{\\s*top:\\s*\\[(.*?)\\]\\]')); if (m) TOP[m[1]] = (m[2] + ']').split('],').map(x => lijst(x)[1]).filter(Boolean); if (/GIDSEN\.forEach/.test(A[i])) break; }
let fout = 0, letop = 0, nIds = 0; const uit = [];
for (const x of G) {
  const r = []; const alle = [].concat(...x.rijen.map(q => q.ids)); nIds += alle.length;
  if (x.beeld && !goed(x.beeld)) { fout++; r.push('FOUT   plaatje van de gids bestaat niet meer: ' + x.beeld); }
  (TOP[x.slug] || []).forEach(t => { if (!goed(t)) { fout++; r.push('FOUT   favoriet (Snel kiezen) bestaat niet meer: ' + t); } else if (alle.indexOf(t) === -1) { letop++; r.push('LET OP favoriet staat niet in een rij van de gids: ' + t); } });
  for (const q of x.rijen) { const ok = q.ids.filter(goed), weg = q.ids.filter(i => !goed(i)).filter(i => !(x.max && M[eind(i)] && M[eind(i)].status === 'goedgekeurd'));
    if (!ok.length || (ok.length < 2 && q.ids.length >= 2)) { fout++; r.push('FOUT   regel ' + q.regel + ' "' + q.kop + '": nog ' + ok.length + ' van de ' + q.ids.length + ' over (' + weg.join(', ') + ')'); }
    else if (weg.length) { letop++; r.push('LET OP regel ' + q.regel + ' "' + q.kop + '": ' + weg.length + ' weg (' + weg.join(', ') + ')'); } }
  const tel = {}; alle.forEach(i => tel[i] = (tel[i] || 0) + 1); const dub = Object.keys(tel).filter(i => tel[i] > 1); if (dub.length) { letop++; r.push('LET OP staat twee keer in deze gids: ' + dub.join(', ')); }
  if (r.length) uit.push(x.slug + ' (regel ' + x.regel + ')\n   ' + r.join('\n   '));
}
console.log('gidsen: ' + G.length + ' | cadeaus in gidsen: ' + nIds + ' | FOUT: ' + fout + ' | LET OP: ' + letop);
if (uit.length) console.log(uit.join('\n'));
process.exit(STRENG && fout ? 1 : 0);
