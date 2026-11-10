/* Paginaregels (10-11-2026, opdracht Marius): geen verkeerde producten meer op een pagina.
   Regels staan in paginaregels.json. Wordt aangeroepen door splits-producten.js, na plaats() en het samenvoegen.
   - label_vak_niet: het vakje past niet bij de doelgroep -> label weg (bijv. herenparfum bij 'voor haar').
   - los: losse onderdelen/uitbreidingen krijgen p.los = 1 -> niet op cadeaupagina's (Voor wie, gelegenheden, collecties).
   - sub: een product dat via een oud vakje of 'ookIn' op een Voor wie-onderwerp staat maar daar niet hoort, krijgt
     p.nietOp = ['voor/haar/parfum-verzorging']. Het blijft op de site, in zijn eigen vakje en op de hoofdpagina van de doelgroep. */
const fs = require('fs'), path = require('path');
const REGELS = JSON.parse(fs.readFileSync(path.join(__dirname, 'paginaregels.json'), 'utf8'));
const LOS = new RegExp(REGELS.los, 'i');
const past = (plekken, vakken) => plekken.some((x) => vakken.some((v) => x === v || x.indexOf(v + '/') === 0));
const plekkenVan = (p) => [p.cat + '/' + p.sub, p.cat].concat(p.ookIn || []).concat((p.tags || []).map((t) => 'tag:' + t));
function personen(root) {
  const w = {}; new Function('window', fs.readFileSync(path.join(root, 'assets/js/data.js'), 'utf8'))(w);
  return w.LK_PERSONEN || [];
}
function vanPersoon(p, pe) {
  return (p.voor || []).some((v) => pe.labels.indexOf(v) !== -1) || (pe.oud && (p.cat + '/' + p.sub === pe.oud || (p.ookIn || []).indexOf(pe.oud) !== -1));
}
/* Mag dit product op dit onderwerp? (zelfde vraag als de controle stelt) */
function magOp(p, regel, thema) {
  return regel.afd.indexOf(p.afd) !== -1 || regel.groep.indexOf(p.afd + '/' + p.groep) !== -1 || thema.test(p.titel || '');
}
function pas(alle, root) {
  const PE = personen(root); const tel = { label: 0, los: 0, nietOp: 0 };
  const thema = {}; for (const k of Object.keys(REGELS.sub)) thema[k] = new RegExp(REGELS.sub[k].thema || '$^', 'i');
  for (const p of alle) {
    if (p.status !== 'goedgekeurd') continue;
    for (const l of Object.keys(REGELS.label_vak_niet)) {
      const r = REGELS.label_vak_niet[l];
      if ((p.voor || []).indexOf(l) !== -1 && r.vakken.indexOf(p.vak) !== -1 && !(r.behalve && new RegExp(r.behalve, 'i').test(p.titel || ''))) {
        p.voor = p.voor.filter((x) => x !== l); if (!p.voor.length) p.voor = ['iedereen']; tel.label++;
      }
    }
    for (const l of Object.keys(REGELS.label_titel_niet || {})) {
      const r = REGELS.label_titel_niet[l];
      if ((p.voor || []).indexOf(l) !== -1 && r.afd.indexOf(p.afd) !== -1 && new RegExp(r.woorden, 'i').test(p.titel || '') && !new RegExp(r.behalve, 'i').test(p.titel || '')) {
        p.voor = p.voor.filter((x) => x !== l); if (!p.voor.length) p.voor = ['iedereen']; tel.label++;
      }
    }
    if (LOS.test(p.titel || '') && !/\bmet losse\b|voor losse/i.test(p.titel)) { p.los = 1; tel.los++; }
    if (p.cat === 'christelijk') continue;
    const pl = plekkenVan(p); let niet = null;
    for (const pe of PE) {
      if (!pe.subs || !vanPersoon(p, pe)) continue;
      for (const s of pe.subs) {
        const k = 'voor/' + pe.slug + '/' + s.slug; const regel = REGELS.sub[k];
        if (!regel || !past(pl, s.vakken)) continue;
        if (!magOp(p, regel, thema[k])) (niet = niet || []).push(k);
      }
    }
    if (niet) { p.nietOp = niet; tel.nietOp += niet.length; } else delete p.nietOp;
  }
  return tel;
}
module.exports = { pas, REGELS, magOp, past, plekkenVan, vanPersoon };
