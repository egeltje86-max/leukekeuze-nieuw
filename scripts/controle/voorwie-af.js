/* Controle (17-11-2026, grote controle Voor wie-pagina's). Gebruik: node scripts/controle/voorwie-af.js [map voor af.json]
   Analyse: welke goedgekeurde producten met het label van een persoon vallen van de Voor wie-pagina's, en waarom.
   Bouwt de productlijst zoals splits-producten.js (deel, plaats, keurkamer-slot, samenvoegen) en volgt de logica van paginaregels.js. */
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '../..'), S = process.argv[2] || require('os').tmpdir();
process.chdir(ROOT);
const { deel } = require(ROOT + '/scripts/indeling.js');
const { plaats } = require(ROOT + '/scripts/boom/plaats.js');
const PR = require(ROOT + '/scripts/boom/paginaregels.js');
const REGELS = PR.REGELS;
let OORDELEN = { producten: {}, zwart: {} }; try { OORDELEN = JSON.parse(fs.readFileSync(ROOT + '/keurkamer/oordelen.json', 'utf8')); } catch (e) {}
const urlSleutel = (u) => String(u || '').toLowerCase().replace(/[?#].*$/, '').replace(/\/+$/, '');
function slot(p) { const o = (OORDELEN.producten || {})[p.id];
  if (o) { if (o.oordeel === 'weg' && p.status === 'goedgekeurd') p.status = 'afgekeurd'; if (o.nietIn && o.nietIn.length) p.ookIn = (p.ookIn || []).filter((v) => o.nietIn.indexOf(v) === -1); }
  else if (p.status === 'goedgekeurd' && (OORDELEN.zwart || {})[urlSleutel(p.winkelUrl)]) p.status = 'afgekeurd';
  p.ookIn = (p.ookIn || []).filter((v, i, a) => v !== p.cat + '/' + p.sub && a.indexOf(v) === i); return p; }
const w = {}; new Function('window', fs.readFileSync(ROOT + '/assets/js/producten.js', 'utf8'))(w);
const alle = w.LK_PRODUCTEN.map((p0) => plaats(slot(deel(p0))));
const opId = {}; for (const p of alle) opId[p.id] = p;
const COR = JSON.parse(fs.readFileSync(ROOT + '/scripts/boom/correcties.json', 'utf8'));
for (const p of alle) { if (p.status !== 'samengevoegd' || !p.samengevoegd) continue; const d = opId[p.samengevoegd]; if (!d || d.status !== 'goedgekeurd') continue;
  const weg = (COR.voorWeg || {})[d.id] || [];
  for (const v of ['voor', 'tags', 'ookIn', 'moment']) { if (!Array.isArray(p[v])) continue; const l = Array.isArray(d[v]) ? d[v] : (d[v] = []); for (const x of p[v]) if (l.indexOf(x) === -1 && !(v === 'voor' && weg.indexOf(x) !== -1) && !(v === 'ookIn' && x === d.cat + '/' + d.sub)) l.push(x); } }
PR.pas(alle, ROOT); /* zet p.nietBij, p.drank, p.voor (label_vak_niet) zoals de bouw */
const pw = {}; new Function('window', fs.readFileSync(ROOT + '/assets/js/data.js', 'utf8'))(pw);
const PE = pw.LK_PERSONEN;
const uit = { personen: {} };
for (const pe of PE) {
  if (!pe.subs) continue;
  const rij = [];
  for (const p of alle) {
    if (p.status !== 'goedgekeurd' || p.cat === 'christelijk') continue;
    if (!PR.vanPersoon(p, pe)) continue;
    if (!(p.nietBij || []).includes(pe.slug)) continue;
    const o = PR.oud(p), pl = PR.plekkenVan(p);
    const opOnd = pe.subs.some((s) => PR.past(pl, s.vakken));
    const pn = (REGELS.persoon_niet || {})[pe.slug]; let pnHit = false;
    if (pn) { const g = o.afd + '/' + o.groep, inL = (l) => l.indexOf(g) !== -1 || l.indexOf(o.afd) !== -1; pnHit = pn.groep ? inL(pn.groep) : false; if (pn.alleen) pnHit = !inL(pn.alleen); }
    const reden = p.drank ? 'drank' : (!opOnd ? 'geen onderwerp' : (pnHit ? 'persoon_niet' : 'anders'));
    rij.push({ id: p.id, t: p.titel, prijs: p.prijs, shop: p.shop, plek: o.afd + '/' + o.groep + '/' + o.vak, label: p.cat + '/' + p.sub, voor: p.voor, reden, zk: p.herkomst === 'superkeurkamer' ? 1 : 0, foto: p.beeld });
  }
  uit.personen[pe.slug] = rij;
  const per = {}; for (const r of rij) { const k = r.reden + ' | ' + r.plek.split('/').slice(0, 2).join('/'); per[k] = (per[k] || 0) + 1; }
  console.log('\n=== ' + pe.slug + ': ' + rij.length + ' van de pagina af');
  Object.entries(per).sort((a, b) => b[1] - a[1]).slice(0, 40).forEach(([k, n]) => console.log('  ' + n + '  ' + k));
}
fs.writeFileSync(S + '/af.json', JSON.stringify(uit));
