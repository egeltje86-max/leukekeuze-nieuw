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
const OUDP = { kind: 'cadeaus/voor-kinderen', kinderen: 'cadeaus/voor-kinderen', haar: 'cadeaus/voor-haar', hem: 'cadeaus/voor-hem', collega: 'cadeaus/collega', baby: 'cadeaus/baby-kraam', 'opa-oma': 'cadeaus/opa-oma' };
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
  const t = (COR.tekst || {})[p.id]; if (t) p.waarom = t;
  const ti = (COR.titel || {})[p.id]; if (ti) p.titel = ti;
  const vb = (COR.voorErbij || {})[p.id]; if (vb) { p.voor = (p.voor || []).slice(); for (const x of vb) if (p.voor.indexOf(x) === -1) p.voor.push(x); } /* nakijkbeurt 6-11-2026: voor-wie erbij */
  const w = (COR.voorWeg || {})[p.id];
  if (w) { p.voor = (p.voor || []).filter((x) => w.indexOf(x) === -1); p.ookIn = (p.ookIn || []).filter((x) => !w.some((l) => OUDP[l] === x)); }
  const s = (COR.status || {})[p.id]; if (s && p.status === 'goedgekeurd') { p.status = s; p.uitverkochtSinds = p.uitverkochtSinds || '2026-11-05'; }
  const sh = (COR.shop || {})[p.id]; if (sh) { p.shop = sh[0]; if (sh[1]) p.verzendNoot = sh[1]; else delete p.verzendNoot; if (sh[2]) p.winkelUrl = sh[2]; }
  const pr = (COR.prijs || {})[p.id]; if (pr) { p.prijs = pr[0]; if (pr[1] && pr[1] > pr[0]) p.oudePrijs = pr[1]; else delete p.oudePrijs; }
  if (p.oudePrijs && !(p.oudePrijs > p.prijs)) delete p.oudePrijs; /* geen 'van-prijs' die niet hoger is */
  /* Ronde Sinterklaas & Kerst (7-11-2026, gekeurd door Marius): 'Uit Kerstcadeaus' / 'Uit Sinterklaas'.
     Het product blijft op de site in zijn eigen vakje, maar staat niet meer op die cadeaupagina. */
  const ni = (COR.nietIn || {})[p.id];
  if (ni) {
    p.ookIn = (p.ookIn || []).filter((x) => ni.indexOf(x) === -1);
    if (ni.indexOf(p.cat + '/' + p.sub) !== -1 && p.afd) { p.cat = p.afd; p.sub = p.groep; }
  }
  if (v && v[0] === 'christelijk') p.cat = 'christelijk'; /* christelijk alleen bij Christelijk (regel Marius) */
  return p;
}
module.exports = { plaats };
