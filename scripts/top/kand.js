// Kandidaten voor de vaste top van een pagina. node kand.js <pad> [max]  -> genummerde regels; kand/<pad>.json bewaart nummer -> id
const fs = require('fs'), path = require('path');
const { W, P } = require('./lib.js');
const R = require('path').resolve(__dirname, '../..');
const PR = require(R + '/scripts/boom/paginaregels.js');
require(R + '/assets/js/topkeuze.js'); const TK = W.LK_TOPKEUZE || {};
const SMAL = {}; for (const k of Object.keys(PR.REGELS.smal)) if (k[0] !== '_') SMAL[k] = new RegExp(PR.REGELS.smal[k].paginas);
const apart = p => (p.soort && p.soort.indexOf('origineel') !== -1) || (p.tags && (p.tags.includes('grappig') || p.tags.includes('apart'))) || (p.ookIn && p.ookIn.includes('cadeaus/grappig'));
function lijst(pad) {
  const d = pad.split('/').filter(Boolean);
  if (d[0] === 'voor') {
    const pe = W.LK_PERSONEN.find(x => x.slug === d[1]); const s = d[2] ? pe.subs.find(x => x.slug === d[2]) : null; const k = 'voor/' + d[1] + '/' + d[2];
    return P.filter(p => p.cat !== 'christelijk' && !p.los && PR.vanPersoon(p, pe) && PR.smalMagBij(p, pe.slug) && !(p.nietBij && p.nietBij.includes(pe.slug)) && (!s || (PR.past(PR.plekkenVan(p), s.vakken) && !(p.nietOp && p.nietOp.includes(k)))));
  }
  if (d[0] === 'gelegenheid' || d[0] === 'collectie') {
    const g = (d[0] === 'gelegenheid' ? W.LK_GELEGENHEID : W.LK_COLLECTIE)(d[1]);
    return P.filter(p => {
      if (p.cat === 'christelijk' || p.los) return false; if (p.smal && !SMAL[p.smal].test(g.slug)) return false;
      if (g.labels && !(p.voor || []).some(v => g.labels.includes(v))) return false;
      if (g.maxPrijs && !(p.tags || []).includes('uitdelen') && !(typeof p.prijs === 'number' && p.prijs <= g.maxPrijs)) return false;
      if (g.uit && g.uit.test(p.titel)) return false;
      let pl = PR.plekkenVan(p); if (p.afd) pl = pl.concat([p.afd + '/' + p.groep, p.afd + '/' + p.groep + '/' + p.vak]); { const o = PR.oud(p); if (o !== p) pl = pl.concat([o.afd + '/' + o.groep, o.afd + '/' + o.groep + '/' + o.vak]); } /* 4.0: gelegenheden noemen nog de groepen van vóór de verhuizing */
      return PR.past(pl, g.vakken || []);
    }).filter(p => { if (!d[2]) return true; const pe = W.LK_PERSONEN.find(x => x.slug === d[2]); return PR.vanPersoon(p, pe) && PR.smalMagBij(p, pe.slug) && !(p.nietBij && p.nietBij.includes(pe.slug)); });
  }
  if (d[0] === 'c' && d[1] === 'cadeaus') return P.filter(p => p.cat !== 'christelijk' && !p.los && !(p.smal && !SMAL[p.smal].test(pad)) && PR.plekkenVan(p).includes('cadeaus/' + d[2]));
  if (d[0] === 'c') return P.filter(p => p.afd === d[1] && (!d[2] || p.groep === d[2]) && (!d[3] || p.vak === d[3]));
  throw new Error('onbekend pad ' + pad);
}
const KORT = process.env.KORT; module.exports = { lijst };
if (require.main === module) {
const pad = process.argv[2].replace(/\/$/, ''), MAX = +process.argv[3] || 80;
const l = lijst(pad).filter(p => p.beeld && typeof p.prijs === 'number');
const smalPast = p => !p.smal || SMAL[p.smal].test(pad);
const tk = {}; (TK[pad] || []).forEach((id, i) => tk[id] = i + 1);
const rang = p => typeof p.rang === 'number' ? p.rang : 0.5;
const kies = [], gez = {}, perVak = {};
const neem = (p, maxVak) => { if (gez[p.id] || !smalPast(p)) return; const v = p.vak || p.sub; if ((perVak[v] || 0) >= maxVak) return; perVak[v] = (perVak[v] || 0) + 1; gez[p.id] = 1; kies.push(p); };
l.filter(p => tk[p.id]).sort((a, b) => tk[a.id] - tk[b.id]).forEach(p => neem(p, 99));
const opRang = l.slice().sort((a, b) => rang(b) - rang(a));
const nK = kies.length;
opRang.filter(p => p.favoriet || p.populair).forEach(p => { if (kies.length < MAX) neem(p, 99); });
opRang.filter(apart).forEach(p => { if (kies.length < nK + (MAX - nK) * 0.6) neem(p, 4); });
opRang.forEach(p => { if (kies.length < MAX) neem(p, process.env.KORT ? 7 : 5); });
fs.writeFileSync(path.join(__dirname, 'kand', pad.replace(/\W+/g, '_') + '.json'), JSON.stringify(kies.map(p => p.id)));
console.log('## ' + pad + ' (' + l.length + ' producten, oude top ' + nK + ')');
kies.forEach((p, i) => console.log((i + 1) + '|' + p.titel.slice(0, KORT ? 42 : 52) + '|' + Math.round(p.prijs) + '|' + (KORT ? '' : (p.vak || p.sub || '').slice(0, 16) + '|') + (tk[p.id] ? 'K' : '') + (apart(p) ? 'A' : '') + (p.favoriet ? 'F' : '') + (p.oudePrijs > p.prijs ? Math.round((1 - p.prijs / p.oudePrijs) * 100) + '%' : '')));
}
