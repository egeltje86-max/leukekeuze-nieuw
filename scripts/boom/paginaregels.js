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
/* 20-11-2026 (Cadeaukeurmeester fase 2, Nova): 'niet' = woorden in de titel die nooit bij dit onderwerp horen, ook niet als de afdeling klopt
   (een lp bij Boeken & journals, een starterdeck of een tol bij Poppen, auto's & knuffels, een whiskyglas bij Lekkers & kaas). */
const NIET_RE = {};
function magOp(p, regel, thema) {
  const o = oud(p);
  if (regel.niet) { const re = NIET_RE[regel.niet] || (NIET_RE[regel.niet] = new RegExp(regel.niet, 'i')); if (re.test(p.titel || '')) return false; }
  /* 20-11-2026 (Marius): nietSub = oude labels (cat/sub of alleen cat) die nooit op dit onderwerp horen (films bij Boeken & journals, glazen en bekers bij Kinderkamer) */
  if (regel.nietSub && regel.nietSub.some((x) => x === p.cat || x === p.cat + '/' + p.sub)) return false;
  return regel.afd.indexOf(o.afd) !== -1 || regel.groep.indexOf(o.afd + '/' + o.groep) !== -1 || thema.test(p.titel || '');
}
function pas(alle, root) {
  const PE = personen(root); const tel = { label: 0, los: 0, nietOp: 0, smal: 0, nietBij: 0, drank: 0 };
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
    /* 15-11-2026 (Marius: 'overal moet drank weg, alleen op de drank plek moet dat staan'): flessen wijn, bubbels, bier, sterke drank
       en alcoholvrije drank krijgen p.drank = 1. app.js toont ze dan alleen op hun eigen plek (Wijn & bubbels, Bier & sterke drank,
       Alcoholvrij, hun eigen vakje) en als de bezoeker er zelf om vraagt (zoekwoord, interesse in de kieshulp). Drankaccessoires niet. */
    const dnb0 = REGELS.drank_niet_bij_personen;
    if (dnb0 && (dnb0.groep.indexOf(o.afd + '/' + o.groep) !== -1 || (dnb0.pakket && o.afd + '/' + o.groep === dnb0.pakket.groep && ((dnb0.pakket.winkels || []).indexOf(p.shop) !== -1 || new RegExp(dnb0.pakket.woorden, 'i').test(p.titel || '')) && !new RegExp(dnb0.pakket.behalve, 'i').test(p.titel || '')))) { p.drank = 1; tel.drank++; } else delete p.drank;
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
      /* 17-11-2026 (Marius): 'alleen zekere cadeaus' geldt alleen nog voor de personen in alleen_zeker (baby); voor de rest beslist het label, met persoon_niet als vangnet */
      const zeker = ((REGELS.alleen_zeker || {}).personen || []).indexOf(pe.slug) !== -1;
      let weg = zeker && !opOnderwerp && !veilig;
      /* 17-11-2026: wat bij niemand op een Voor wie-pagina hoort (dieren, tandenborstels, tuingereedschap, fietsonderdelen ...) */
      const pa = (REGELS.persoon_niet || {})._alle;
      if (!weg && pa && ((pa.groep || []).some((x) => x === o.afd || x === o.afd + '/' + o.groep) || (pa.woorden && new RegExp(pa.woorden, 'i').test(p.titel || '')))) weg = true;
      /* alleen veilige cadeaus: groepen die bij deze persoon niet op de pagina's horen */
      const pn = (REGELS.persoon_niet || {})[pe.slug];
      if (pn && !weg) {
        const g = o.afd + '/' + o.groep; const inL = (l) => l.indexOf(g) !== -1 || l.indexOf(o.afd) !== -1;
        let w = pn.groep ? inL(pn.groep) : false;
        if (pn.alleen) w = !inL(pn.alleen);
        if (!w && pn.woorden && new RegExp(pn.woorden, 'i').test(p.titel || '')) w = true; /* 17-11-2026: woorden in de titel die niet bij deze persoon passen */
        if (pn.unisexMode && o.afd === 'mode-sieraden' && pn.unisexMode.indexOf(o.groep) !== -1 && (p.voor || []).indexOf('haar') !== -1) w = true;
        if (w && !grapKind && !(pn.behalve && new RegExp(pn.behalve, 'i').test(p.titel || ''))) weg = true;
      }
      /* 13-11-2026: met de hand door Marius voor deze persoon gekozen (ERBIJ-lijst per tak), dan mag het toch */
      const mh = (REGELS.met_de_hand || {})[pe.slug];
      if (weg && Array.isArray(mh) && mh.indexOf(p.id) !== -1) weg = false;
      /* 17-11-2026 (Marius): cadeaus uit de fanhoeken (anime, Hello Kitty, KPop, Pokémon) met het label van deze persoon mogen bij tieners (fanhoek in paginaregels.json) */
      const fh = (REGELS.fanhoek || {})[pe.slug];
      if (weg && Array.isArray(fh) && fh.indexOf(o.afd + '/' + o.groep) !== -1) weg = false;
      /* 15-11-2026 (Marius): nooit drank op een Voor wie-pagina, ook niet met de hand gekozen */
      if (p.drank) weg = true;
      if (weg) (nietBij = nietBij || []).push(pe.slug);
    }
    if (niet) { p.nietOp = niet; tel.nietOp += niet.length; } else delete p.nietOp;
    if (nietBij) { p.nietBij = nietBij; tel.nietBij += nietBij.length; } else delete p.nietBij;
  }
  return tel;
}
module.exports = { pas, REGELS, magOp, past, plekkenVan, vanPersoon, smalMagBij, oud };
