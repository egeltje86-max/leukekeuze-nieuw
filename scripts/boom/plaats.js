/* 3.0 nieuwe boom (4-11-2026): zet bij elk product de plek in de nieuwe boom (afd > groep > vak).
   Bron: scripts/boom/plaatsing.json (gemaakt door verwerk.py: regels + AI-keuring). Staat een product er (nog) niet in,
   dan kiezen we de plek via zijn oude vakje (oud-naar-nieuw.json). p.cat/p.sub blijven het oude vakje, zodat VONK,
   Voor wie, gelegenheden en zoeken gewoon blijven werken. Wordt aangeroepen door splits-producten.js. */
const fs = require('fs'), path = require('path');
let PL = {}, OUD = {};
try { PL = JSON.parse(fs.readFileSync(path.join(__dirname, 'plaatsing.json'), 'utf8')); } catch (e) {}
try { OUD = JSON.parse(fs.readFileSync(path.join(__dirname, 'oud-naar-nieuw.json'), 'utf8')); } catch (e) {}
/* Reparaties 5-11-2026 (GO Marius, na de sitecontrole): partnerlinks voor producten die een gewone winkellink hadden,
   een vakje voor producten zonder vakje, en dubbele producten samenvoegen (de goedkoopste blijft). Zie correcties.json. */
let COR = { links: {}, vak: {}, samen: {} };
try { COR = JSON.parse(fs.readFileSync(path.join(__dirname, 'correcties.json'), 'utf8')); } catch (e) {}
function plaats(p) {
  const x = PL[p.id];
  if (x) {
    p.afd = x.a; p.groep = x.g; if (x.v) p.vak = x.v;
    if (x.oud) { const d = x.oud.split('/'); p.cat = d[0]; p.sub = d[1]; }
    if (x.ook) p.ookIn = Array.from(new Set((p.ookIn || []).concat(x.ook)));
    if (typeof x.c === 'number') p.wil = x.c;
    if (typeof x.r === 'number') p.rang = x.r; /* hoe hoog in 'Aanbevolen' (scripts/boom/rang.py) */ /* hoe graag klanten dit willen (AI-keuring, 0-100) */
  } else {
    const o = OUD[p.cat + '/' + p.sub];
    if (o) { p.afd = o[0]; p.groep = o[1]; if (o[2]) p.vak = o[2]; }
  }
  const l = (COR.links || {})[p.id]; if (l) { p.url = l.url; if (!p.winkelUrl) p.winkelUrl = l.winkelUrl; }
  const v = (COR.vak || {})[p.id]; if (v) { p.afd = v[0]; p.groep = v[1]; p.vak = v[2]; }
  const z = (COR.samen || {})[p.id]; if (z && p.status === 'goedgekeurd') { p.status = 'samengevoegd'; p.samengevoegd = z; }
  return p;
}
module.exports = { plaats };
