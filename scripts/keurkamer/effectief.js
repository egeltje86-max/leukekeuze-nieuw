/* Keurkamer, stap 1: alle producten zoals de site ze NU laat zien (na indeling.js), als één JSON-bestand.
   Gebruik: node scripts/keurkamer/effectief.js  -> keurkamer/data/producten-effectief.json
   Alleen lezen; verandert niets aan de site. */
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..', '..');
const { deel } = require(path.join(ROOT, 'scripts', 'indeling.js'));
const w = { document: {} };
new Function('window', 'document', fs.readFileSync(path.join(ROOT, 'assets/js/data.js'), 'utf8'))(w, w.document);
new Function('window', fs.readFileSync(path.join(ROOT, 'assets/js/producten.js'), 'utf8'))(w);
const isDaisycon = (u) => /^https?:\/\/(lt45|fr135|bdt9|glp8|ds1|jdt8|rkn3|jf79)\.n[le]t?\/c\/|^https?:\/\/aff\.svinando\.be\/c\//.test(u || '');
const winkels = new Set((w.LK_WINKELS || []).map((x) => x.naam));
/* 16-11-2026: de status in producten.js is niet wat de site toont. Wat Marius via WEG-lijsten en het landschap weghaalde,
   wat uitverkocht is en wat is samengevoegd staat in correcties.json en komt pas in producten-lean.js goed. Neem daarom de
   status, prijs en winkel uit producten-lean.js (de site zelf) en de omgezette links uit correcties.json. Anders telde de
   Sitewacht duizenden producten mee die niet meer op de site staan (bijv. 3.546 'dubbelen'). */
const lean = {};
try {
  const lw = { dispatchEvent() {} };
  new Function('window', 'document', 'Event', fs.readFileSync(path.join(ROOT, 'assets/js/producten-lean.js'), 'utf8'))(lw, { createEvent() { return { initEvent() {} }; } }, function () {});
  for (const q of lw.LK_PRODUCTEN || []) lean[q.id] = q;
} catch (e) { console.error('producten-lean.js niet te lezen, status uit producten.js: ' + e.message); }
let LINKS = {};
try { LINKS = JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts/boom/correcties.json'), 'utf8')).links || {}; } catch (e) {}
const heeftLean = Object.keys(lean).length > 0;
const uit = {}, afgekeurd = [];
for (const p0 of w.LK_PRODUCTEN) {
  const l = lean[p0.id];
  const status = heeftLean ? (l ? (l.samengevoegd ? 'samengevoegd' : l.status) : 'onbekend') : p0.status;
  if (status !== 'goedgekeurd') { afgekeurd.push({ id: p0.id, titel: p0.titel, reden: p0.afgekeurdReden || status || '' }); continue; }
  const p = deel(p0);
  if (l) { if (l.prijs != null) p.prijs = l.prijs; if (l.shop) p.shop = l.shop; }
  const ln = LINKS[p0.id]; if (ln && typeof ln === 'object') { if (ln.url) p.url = ln.url; if (ln.winkelUrl) p.winkelUrl = ln.winkelUrl; }
  uit[p.id] = {
    id: p.id, titel: p.titel, prijs: p.prijs, oudePrijs: p.oudePrijs || null, shop: p.shop, merk: p.merk || '',
    url: p.url || '', winkelUrl: p.winkelUrl || '', beeld: p.beeld || ('images/producten/' + p.id),
    vak: p.cat + '/' + p.sub, vakOpgeslagen: p0.cat + '/' + p0.sub, subVast: !!p0.subVast,
    ookIn: p.ookIn || [], voor: p.voor || [], moment: p.moment || [], tags: p.tags || [], soort: p.soort || [], leeftijd: p.leeftijd || '',
    waarom: p.waarom || '', letOp: p.letOp || '', sfeer: !!p.sfeer, favoriet: !!p.favoriet, populair: !!p.populair, nieuw: !!p.nieuw,
    sinds: p.sinds || '', gecontroleerd: p.gecontroleerd || '', varianten: (p.varianten || []).length, fotos: (p.fotos || []).length,
    daisycon: isDaisycon(p.url), winkelBekend: winkels.has(p.shop) || p.shop === 'bol' || p.shop === 'Amazon', eigen: !!p.eigen
  };
}
fs.mkdirSync(path.join(ROOT, 'keurkamer', 'data'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'keurkamer/data/producten-effectief.json'), JSON.stringify({ gemaakt: new Date().toISOString(), aantal: Object.keys(uit).length, producten: uit, afgekeurd }, null, 0));
console.log(Object.keys(uit).length + ' producten live, ' + afgekeurd.length + ' afgekeurd -> keurkamer/data/producten-effectief.json');
