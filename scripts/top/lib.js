// gedeelde hulpfuncties: zelfde logica als app.js (persoonProducten, verzamelLijst)
const path = require('path'); const R = path.resolve(__dirname, '../..');
global.window = { dispatchEvent() {} }; global.Event = function () {};
require(path.join(R, 'assets/js/data.js')); require(path.join(R, 'assets/js/producten-lean.js'));
const PR = require(path.join(R, 'scripts/boom/paginaregels.js'));
const W = window; const P = W.LK_PRODUCTEN.filter(p => p.status === 'goedgekeurd');
const plekkenVan = p => [p.cat + '/' + p.sub, p.cat].concat(p.ookIn || []).concat((p.tags || []).map(t => 'tag:' + t));
const past = (plekken, vakken) => plekken.some(x => vakken.some(v => x === v || x.indexOf(v + '/') === 0));
function persoon(pe, vakken) {
  return P.filter(p => {
    if (p.cat === 'christelijk') return false;
    const van = (p.voor || []).some(v => pe.labels.indexOf(v) !== -1) || (pe.oud && (p.cat + '/' + p.sub === pe.oud || (p.ookIn || []).indexOf(pe.oud) !== -1));
    if (!van) return false; if (!vakken) return true; return past(plekkenVan(p), vakken);
  });
}
function verzamel(g) {
  return P.filter(p => {
    if (p.cat === 'christelijk') return false;
    if (g.labels && !(p.voor || []).some(v => g.labels.indexOf(v) !== -1)) return false;
    if (g.maxPrijs && !(p.tags || []).includes('uitdelen') && !(typeof p.prijs === 'number' && p.prijs <= g.maxPrijs)) return false;
    if (g.uit && g.uit.test(p.titel)) return false;
    let pl = plekkenVan(p); if (p.afd) pl = pl.concat([p.afd + '/' + p.groep, p.afd + '/' + p.groep + '/' + p.vak]);
    { const o = PR.oud(p); if (o !== p) pl = pl.concat([o.afd + '/' + o.groep, o.afd + '/' + o.groep + '/' + o.vak]); } /* 4.0: gelegenheden noemen nog de groepen van vóór de verhuizing */
    return past(pl, g.vakken || []);
  });
}
module.exports = { W, P, persoon, verzamel, plekkenVan };
