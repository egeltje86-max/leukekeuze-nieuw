/* Paginaregels (10-11-2026, opdracht Marius): geen verkeerde producten meer op een pagina.
   Regels staan in paginaregels.json. Wordt aangeroepen door splits-producten.js, na plaats() en het samenvoegen.
   - label_vak_niet: het vakje past niet bij de doelgroep -> label weg (bijv. herenparfum bij 'voor haar').
   - los: losse onderdelen/uitbreidingen krijgen p.los = 1 -> niet op cadeaupagina's (Voor wie, gelegenheden, collecties).
   - sub: een product dat via een oud vakje of 'ookIn' op een Voor wie-onderwerp staat maar daar niet hoort, krijgt
     p.nietOp = ['voor/haar/parfum-verzorging']. Het blijft op de site, in zijn eigen vakje en op de hoofdpagina van de doelgroep.
   - smal: cadeau met een tekst voor één soort persoon (pensioen, opa/oma, zwanger, juf ...) krijgt p.smal = soort.
     Het staat dan alleen op Voor wie-pagina's waar het past en zakt op andere pagina's naar onderen (app.js). */
const fs = require('fs'), path = require('path');
const REGELS = JSON.parse(fs.readFileSync(path.join(__dirname, 'paginaregels.json'), 'utf8'));
/* 4.0 (proef 11-11-2026): de regels in paginaregels.json noemen de groepen van vóór de verhuizing. Krijgen we een product dat al
   verhuisd is (uit producten-lean.js, in de controle of bij het kiezen van de vaste top), dan zoeken we zijn oude plek terug. */
let TERUG = {}; try { TERUG = JSON.parse(fs.readFileSync(path.join(__dirname, 'verhuisd.json'), 'utf8')).terug || {}; } catch (e) {}
function oud(p) { const t = p.afd && TERUG[p.afd + '/' + p.groep + '/' + p.vak]; if (!t) return p; const d = t.split('/'); return { afd: d[0], groep: d[1], vak: d[2] }; }
const LOS = new RegExp(REGELS.los, 'i');
const SMAL_K = Object.keys(REGELS.smal || {}).filter((k) => k[0] !== '_');
const SMAL_RE = {}; for (const k of SMAL_K) SMAL_RE[k] = { w: new RegExp(REGELS.smal[k].woorden, 'i'), b: REGELS.smal[k].behalve ? new RegExp(REGELS.smal[k].behalve, 'i') : null };
/* Mag een smal cadeau op de pagina's van deze persoon staan? 'zacht' = ja (het zakt alleen naar onderen). */
function smalMagBij(p, slug) { const r = p.smal && REGELS.smal[p.smal]; return !r || !!r.zacht || new RegExp(r.personen).test(slug); }
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
  const o = oud(p);
  return regel.afd.indexOf(o.afd) !== -1 || regel.groep.indexOf(o.afd + '/' + o.groep) !== -1 || thema.test(p.titel || '');
}
function pas(alle, root) {
  const PE = personen(root); const tel = { label: 0, los: 0, nietOp: 0, smal: 0, nietBij: 0 };
  const thema = {}; for (const k of Object.keys(REGELS.sub)) thema[k] = new RegExp(REGELS.sub[k].thema || '$^', 'i');
  for (const p of alle) {
    if (p.status !== 'goedgekeurd') continue;
    const o = oud(p); /* de plek van vóór de verhuizing */
    for (const l of Object.keys(REGELS.label_vak_niet)) {
      const r = REGELS.label_vak_niet[l];
      if ((p.voor || []).indexOf(l) !== -1 && r.vakken.indexOf(o.vak) !== -1 && !(r.behalve && new RegExp(r.behalve, 'i').test(p.titel || ''))) {
        p.voor = p.voor.filter((x) => x !== l); if (!p.voor.length) p.voor = ['iedereen']; tel.label++;
      }
    }
    for (const l of Object.keys(REGELS.label_titel_niet || {})) {
      const r = REGELS.label_titel_niet[l];
      if ((p.voor || []).indexOf(l) !== -1 && r.afd.indexOf(o.afd) !== -1 && new RegExp(r.woorden, 'i').test(p.titel || '') && !new RegExp(r.behalve, 'i').test(p.titel || '')) {
        p.voor = p.voor.filter((x) => x !== l); if (!p.voor.length) p.voor = ['iedereen']; tel.label++;
      }
    }
    if (LOS.test(p.titel || '') && !/\bmet losse\b|voor losse/i.test(p.titel)) { p.los = 1; tel.los++; }
    /* smal (10-11-2026): cadeau met een tekst voor één soort persoon of moment (pensioen, opa/oma, zwanger, juf, collega ...) */
    delete p.smal;
    if (p.cat !== 'christelijk') for (const k of SMAL_K) {
      const r = REGELS.smal[k];
      if (SMAL_RE[k].w.test(p.titel || '') && !(SMAL_RE[k].b && SMAL_RE[k].b.test(p.titel || '')) && !(r.nietAfd && r.nietAfd.indexOf(o.afd) !== -1)) { p.smal = k; tel.smal++; break; }
    }
    if (p.cat === 'christelijk') continue;
    const pl = plekkenVan(p); let niet = null, nietBij = null;
    for (const pe of PE) {
      if (!pe.subs || !vanPersoon(p, pe)) continue;
      let opOnderwerp = false;
      for (const s of pe.subs) {
        const k = 'voor/' + pe.slug + '/' + s.slug; const regel = REGELS.sub[k];
        if (!past(pl, s.vakken)) continue;
        if (regel && !magOp(p, regel, thema[k])) (niet = niet || []).push(k); else opOnderwerp = true;
      }
      /* alleen zekere cadeaus: staat het op geen enkel nagekeken onderwerp van deze persoon, dan ook niet op diens pagina's */
      const v = (REGELS.hoofd_veilig || {})[pe.slug];
      /* 11-11-2026: grappige cadeaus met het label 'kind' (met de hand gezet) mogen ook uit de gadgets en de bruisballen */
      const grapKind = !!(v && v.grappig && v.grappig.indexOf(o.afd + '/' + o.groep) !== -1 && (p.voor || []).indexOf('kind') !== -1 && (p.ookIn || []).indexOf('cadeaus/grappig') !== -1);
      const veilig = v && (v.afd.indexOf(o.afd) !== -1 || v.groep.indexOf(o.afd + '/' + o.groep) !== -1 || grapKind);
      let weg = !opOnderwerp && !veilig;
      /* alleen veilige cadeaus: groepen die bij deze persoon niet op de pagina's horen */
      const pn = (REGELS.persoon_niet || {})[pe.slug];
      if (pn && !weg) {
        const g = o.afd + '/' + o.groep; const inL = (l) => l.indexOf(g) !== -1 || l.indexOf(o.afd) !== -1;
        let w = pn.groep ? inL(pn.groep) : false;
        if (pn.alleen) w = !inL(pn.alleen);
        if (pn.unisexMode && o.afd === 'mode-sieraden' && pn.unisexMode.indexOf(o.groep) !== -1 && (p.voor || []).indexOf('haar') !== -1) w = true;
        if (w && !grapKind && !(pn.behalve && new RegExp(pn.behalve, 'i').test(p.titel || ''))) weg = true;
      }
      if (weg) (nietBij = nietBij || []).push(pe.slug);
    }
    if (niet) { p.nietOp = niet; tel.nietOp += niet.length; } else delete p.nietOp;
    if (nietBij) { p.nietBij = nietBij; tel.nietBij += nietBij.length; } else delete p.nietBij;
  }
  return tel;
}
module.exports = { pas, REGELS, magOp, past, plekkenVan, vanPersoon, smalMagBij, oud };
