// Linktest, stap 1 (11-11-2026, grote controle): kiest één goedgekeurd product per 'doorstuuradres' van een winkel.
// Veel TradeTracker-winkels sturen de bezoeker door via een eigen map (winkel.nl/map/?tt=...&r=...). Verdwijnt die map,
// dan geven álle producten van die winkel 'pagina niet gevonden', terwijl de producten zelf gewoon bestaan.
// Dat zie je niet in de gewone controle: de cloud kan de winkels niet bereiken. Daarom testen we het op de laptop.
// Gebruik:  node scripts/controle/eindpunten.js .            -> een rij product-id's, gescheiden door komma's
//           python scripts/controle/linktest-laptop.py <die rij>      (op de laptop; duurt een paar minuten)
// Kapot? Zet de winkel in TT_OMWEG (scripts/boom/plaats.js) én in TT_TC (scripts/maak-zoekindex.py).
const fs = require('fs'), path = require('path');
const R = path.resolve(process.argv[2] || '.');
global.window = { dispatchEvent() {}, addEventListener() {} }; global.Event = function () {}; global.document = { createEvent() { return { initEvent() {} }; } };
require(path.join(R, 'assets/js/producten-lean.js'));
eval(fs.readFileSync(path.join(R, 'assets/js/producten-details.js'), 'utf8').replace(/^\/\*.*?\*\//s, ''));
const D = window.LK_DETAILS || {}, eerste = {};
for (const p of window.LK_PRODUCTEN) {
  if (p.status !== 'goedgekeurd') continue;
  let x; try { x = new URL((D[p.id] || {}).url || ''); } catch (e) { continue; }
  if (/bol\.com|amazon\.|hertog\.nl|dextercards/.test(x.host)) continue; // bol en Amazon testen we niet met een robot
  const netwerk = /tradetracker\.net/.test(x.host) ? 'tt:' + x.searchParams.get('c') : /awin1\.com/.test(x.host) ? 'awin:' + (x.searchParams.get('awinmid') || x.searchParams.get('m') || '') : x.searchParams.get('si') ? 'dc:' + x.searchParams.get('si') : x.host + x.pathname;
  if (!eerste[netwerk]) eerste[netwerk] = p.id;
}
console.log(Object.values(eerste).join(','));
console.error(Object.keys(eerste).length + ' doorstuuradressen');
