/* Maakt de cadeaulijst voor de Sint-rijmmachine uit ALLE goedgekeurde producten van de site (7-11-2026).
   Bron: assets/js/producten-lean.js + producten-details.js (zoals de site ze ook laadt) en de vakjes uit data.js.
   Uitvoer: rijm-catalogus.json  { vakken: [[sleutel, naam, aantal]], producten: [[id, titel, prijs, vakNr, voor, waarom, winkel, link, beeld]] }
   Elke link heeft de partnercode van Marius (zelfde regels als winkelLink() in app.js), met referentie 'rijm-<id>'
   zodat je in de partnerdashboards ziet welke verkopen uit de rijmmachine komen.
   Draaien: node scripts/rijmmachine/maak-rijm-catalogus.js [uitvoerbestand] */
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '../..');
const lees = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8');
const w = { dispatchEvent() {}, addEventListener() {} };
const fakeDoc = { createEvent: () => ({ initEvent() {} }), addEventListener() {}, querySelector: () => null, querySelectorAll: () => [] };
global.Event = function () {};
new Function('window', 'document', lees('assets/js/producten-lean.js'))(w, fakeDoc);
new Function('window', 'document', lees('assets/js/producten-details.js'))(w, fakeDoc);
new Function('window', 'document', lees('assets/js/data.js'))(w, fakeDoc);
const INST = w.LK_INSTELLINGEN || {};

const isDaisycon = (u) => /^https?:\/\/(lt45|fr135|bdt9|glp8|ds1|jdt8|rkn3|jf79)\.n[le]t?\/c\//.test(u || '') || /^https?:\/\/aff\.svinando\.be\/c\//.test(u || '');
function dcDirect(u) {
  if (!isDaisycon(u)) return false;
  if (INST.daisyconPauze) return true;
  const m = (u || '').match(/[?&]si=(\d+)/);
  return !!(m && (INST.daisyconZonder || []).indexOf(m[1]) !== -1);
}
function metRef(u, id) {
  if (!u || !id) return u;
  const r = encodeURIComponent(id);
  if (/[?&]tt=\d+_\d+_\d+_(?=&|$)/.test(u)) return u.replace(/([?&]tt=\d+_\d+_\d+_)(?=&|$)/, '$1' + r);
  if (/[?&]a=516846(&|$)/.test(u) && /[?&]r=(?=&|$)/.test(u)) return u.replace(/([?&]r=)(?=&|$)/, '$1' + r);
  if (/[?&]ws=(?=&|$)/.test(u)) return u.replace(/([?&]ws=)(?=&|$)/, '$1' + r);
  if (isDaisycon(u) && !/[?&]ws=/.test(u)) return u + '&ws=' + r;
  if (/awin1\.com\/(pclick|cread)\.php/.test(u) && !/[?&]clickref=/.test(u)) return u + '&clickref=' + r;
  if (/partner\.bol\.com\/click/.test(u) && !/[?&]subid=/i.test(u)) return u + '&subid=' + r;
  return u;
}
/* Heeft deze link de partnercode van Marius? Zonder code: niet in de rijmmachine. */
const heeftCode = (u) => /tag=leukekeuze-21|[?&_=]516846|s=1545784|[?&]a=3110079|awinaffid=3110079|wi=433339|aff=LEUKEKEUZE/i.test(u || '');

/* Vakjes met hun gewone namen (afdeling > groep > vakje) */
const naamVan = {};
for (const a of w.LK_CATEGORIEEN || []) for (const g of a.subs || []) for (const v of g.vakjes || []) naamVan[a.slug + '/' + g.slug + '/' + v.slug] = a.kort + ' > ' + g.naam + ' > ' + v.naam;

const vakNr = {}, vakken = [], producten = [];
let zonderLink = 0, dcUit = 0;
for (const p of w.LK_PRODUCTEN) {
  if (p.status !== 'goedgekeurd' || !p.afd || !p.vak) continue;
  const d = (w.LK_DETAILS || {})[p.id] || {};
  if (!d.url) { zonderLink++; continue; }
  if (dcDirect(d.url)) { dcUit++; continue; } // daar verdient Marius nu niets aan
  const link = metRef(d.url, 'rijm-' + p.id);
  if (!heeftCode(link)) { zonderLink++; continue; }
  const sleutel = p.afd + '/' + p.groep + '/' + p.vak;
  if (!(sleutel in vakNr)) { vakNr[sleutel] = vakken.length; vakken.push([sleutel, naamVan[sleutel] || sleutel, 0]); }
  vakken[vakNr[sleutel]][2]++;
  const beeld = p.beeld || ('images/producten/' + p.id);
  const kleinBeeld = /^https?:\/\//.test(beeld) || /\.(webp|jpe?g|png)$/i.test(beeld) ? beeld : beeld + '-klein.webp';
  const waarom = String(p.waarom || '').replace(/\s+/g, ' ').split(/(?<=[.!?])\s/)[0].slice(0, 110);
  producten.push([p.id, p.titel, Math.round(p.prijs * 100) / 100, vakNr[sleutel], (p.voor || []).join('+'), waarom, p.shop || 'bol', link, kleinBeeld, Math.round((p.rang || 0.5) * 100)]);
}
const uit = process.argv[2] || path.join(ROOT, 'data/rijm-catalogus.json');
fs.mkdirSync(path.dirname(uit), { recursive: true });
fs.writeFileSync(uit, JSON.stringify({ gemaakt: new Date().toISOString().slice(0, 10), vakken, producten }));
console.log('producten:', producten.length, 'vakjes:', vakken.length, 'zonder partnerlink overgeslagen:', zonderLink, 'daisycon-direct overgeslagen:', dcUit, 'bytes:', fs.statSync(uit).size);
