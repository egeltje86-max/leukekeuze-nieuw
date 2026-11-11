/* Splitst assets/js/producten.js (de bron, geschreven door de rondes) in twee bestanden die de site laadt:
   - producten-lean.js: alles wat lijsten, zoeken en VONK nodig hebben (klein, laadt bij elke pagina)
   - producten-details.js: winkellinks, specs, verzendnoten, let-op (laadt pas op een productpagina)
   Zo laadt de site op een telefoon een stuk sneller. Draait automatisch mee in maak-paginas.js.
   Los draaien: node scripts/splits-producten.js */
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const { deel } = require('./indeling.js');
const { plaats } = require('./boom/plaats.js'); // 3.0: nieuwe boom (afd > groep > vak), zie scripts/boom/ // 2.1: nieuwe indeling (vakjes, tags, leeftijd) – producten.js blijft zoals hij is
const DETAILS = ['url', 'winkelUrl', 'specs', 'verzendNoot', 'letOp', 'afgekeurdReden', 'varianten', 'maten', 'gecontroleerd',
  /* Snelheid (5-11-2026): deze velden gebruikt de site in lijsten niet, dus die laden pas op de productpagina. */
  'subVast', 'wil', 'uitverkochtSinds',
  /* Snelheid (8-11-2026, Fable P2): ook deze alleen op de productpagina. */
  'fotos', 'herkomst'];
/* Snelheid (8-11-2026): 'waarom' (1,1 MB) blijft in de lijst alleen voor producten die in een gids staan of favoriet zijn (die teksten staan op lijstpagina's);
   voor de rest gaat hij naar details (productpagina's hebben hun eigen details al in de HTML). */
const GIDS_IDS = (() => { try { const s = fs.readFileSync(path.join(ROOT, 'assets/js/app.js'), 'utf8'); const a = s.indexOf('var GIDSEN = ['); const b = s.indexOf('\n  ];', a); return new Set([...s.slice(a, b).matchAll(/'([a-z0-9]+-[a-z0-9-]+)'/g)].map(m => m[1])); } catch (e) { return new Set(); } })();
/* Keurkamer-slot (2-11-2026): de oordelen van Marius uit keurkamer/oordelen.json gelden bij ELKE bouw.
   Wat hij weg heeft gedaan blijft weg (ook als een ronde het product opnieuw aanlevert), verplaatst blijft verplaatst,
   'niet hier' blijft weg uit dat extra vakje, toppers blijven bovenaan. Zie scripts/keurkamer/verwerk.py. */
let OORDELEN = { producten: {}, zwart: {} };
try { OORDELEN = JSON.parse(fs.readFileSync(path.join(ROOT, 'keurkamer/oordelen.json'), 'utf8')); } catch (e) {}
const urlSleutel = (u) => String(u || '').toLowerCase().replace(/[?#].*$/, '').replace(/\/+$/, '');
function keurkamerSlot(p) {
  const o = (OORDELEN.producten || {})[p.id];
  if (o) {
    /* Verplaatsingen, toppers en teksten schrijft verwerk.py in producten.js zelf (daar kan Marius ze later weer veranderen).
       Hier alleen het vangnet: weg blijft weg, en 'niet in dit extra vakje' blijft gelden (ook als indeling.js het er weer bij zet). */
    if (o.oordeel === 'weg' && p.status === 'goedgekeurd') { p.status = 'afgekeurd'; p.afgekeurdReden = p.afgekeurdReden || 'keurkamer'; }
    if (o.nietIn && o.nietIn.length) p.ookIn = (p.ookIn || []).filter((v) => o.nietIn.indexOf(v) === -1);
  } else if (p.status === 'goedgekeurd' && (OORDELEN.zwart || {})[urlSleutel(p.winkelUrl)]) {
    /* zelfde winkelpagina als een product dat Marius weg heeft gedaan (bijv. opnieuw aangeleverd onder een nieuw id) */
    p.status = 'afgekeurd'; p.afgekeurdReden = 'keurkamer (zelfde winkelpagina als een afgekeurd product)';
  }
  p.ookIn = (p.ookIn || []).filter((v, i, a) => v !== p.cat + '/' + p.sub && a.indexOf(v) === i);
  return p;
}
function splits() {
  const w = {}; new Function('window', fs.readFileSync(path.join(ROOT, 'assets/js/producten.js'), 'utf8'))(w);
  const lean = [], det = {};
  const alle = w.LK_PRODUCTEN.map((p0) => plaats(keurkamerSlot(deel(p0))));
  /* Nakijkbeurt (6-11-2026): bij dubbele producten blijft er één over (correcties.json 'samen').
     Het product dat blijft krijgt de labels van het weggevallen product erbij (voor wie, tags, extra vakjes, momenten),
     zodat het nergens van een pagina verdwijnt. 'voorWeg' blijft gelden. */
  const opId = {}; for (const p of alle) opId[p.id] = p;
  const COR = (() => { try { return JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts/boom/correcties.json'), 'utf8')); } catch (e) { return {}; } })();
  for (const p of alle) {
    if (p.status !== 'samengevoegd' || !p.samengevoegd) continue;
    const doel = opId[p.samengevoegd]; if (!doel || doel.status !== 'goedgekeurd') continue;
    const weg = (COR.voorWeg || {})[doel.id] || [];
    for (const veld of ['voor', 'tags', 'ookIn', 'moment']) {
      if (!Array.isArray(p[veld])) continue;
      const lijst = Array.isArray(doel[veld]) ? doel[veld] : (doel[veld] = []);
      for (const x of p[veld]) if (lijst.indexOf(x) === -1 && !(veld === 'voor' && weg.indexOf(x) !== -1) && !(veld === 'ookIn' && x === doel.cat + '/' + doel.sub)) lijst.push(x);
    }
  }
  /* 10-11-2026: paginaregels (geen verkeerde producten op een pagina), zie scripts/boom/paginaregels.js */
  const prTel = require('./boom/paginaregels.js').pas(alle, ROOT);
  console.log('paginaregels: label weg', prTel.label, '| los onderdeel', prTel.los, '| van een onderwerp af', prTel.nietOp, '| smal (tekst voor één soort persoon)', prTel.smal, '| van een Voor wie-pagina af (niet zeker)', prTel.nietBij);
  /* 4.0 (proef 11-11-2026): de nieuwe indeling. De paginaregels hierboven werken nog met de plek van vóór de verhuizing;
     daarna krijgt elk product zijn nieuwe afdeling, groep en vakje (scripts/boom/verhuisd.json, gemaakt door scripts/boom/verhuis.js).
     Bestaat dat bestand niet, dan verandert er niets. */
  let VERH = null; try { VERH = JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts/boom/verhuisd.json'), 'utf8')); } catch (e) {}
  if (VERH) { let n = 0;
    for (const p of alle) { if (!p.afd) continue;
      const x = VERH.vak[p.afd + '/' + p.groep + '/' + p.vak] || VERH.groep[p.afd + '/' + p.groep];
      if (x) { p.afd = x[0]; p.groep = x[1]; if (x[2]) p.vak = x[2]; n++; } }
    console.log('4.0 nieuwe indeling: ' + n + ' producten op een nieuwe plek'); }
  const ETALAGE_IDS = new Set();
  try { const pk = JSON.parse(require('fs').readFileSync(require('path').join(__dirname, 'top/picks.json'), 'utf8')); Object.keys(pk).forEach(k => { if (Array.isArray(pk[k])) pk[k].forEach(i => ETALAGE_IDS.add(i)); }); } catch (e) {}
  const eersteZin = t => { const m = String(t).match(/^[^.!?]{10,}[.!?]/); let z = (m ? m[0] : String(t)).trim(); if (z.length > 100) z = z.slice(0, 98).replace(/\s+\S*$/, '') + '…'; return z; };
  for (const p of alle) {
    const l = {}, d = {};
    for (const k of Object.keys(p)) (DETAILS.indexOf(k) === -1 ? l : d)[k] = p[k];
    /* WIJZER (11-11-2026): wat in een handgekozen top staat (de etalage) houdt in de lijst één korte zin 'waarom' (veld kort), voor op de kaart in de nieuwe opzet. */
    if (l.waarom && !p.favoriet && !p.eigen && !GIDS_IDS.has(p.id)) { d.waarom = l.waarom; if (ETALAGE_IDS.has(p.id)) l.kort = eersteZin(l.waarom); delete l.waarom; }
    /* Daisycon-product? Klein vlaggetje voor de lijsten (de link zelf staat in details). Zie daisyconLaag() in app.js. */
    if (/^https?:\/\/(lt45|fr135|bdt9|glp8|ds1|jdt8|rkn3|jf79)\.n[le]t?\/c\/|^https?:\/\/aff\.svinando\.be\/c\//.test(p.url || '')) l.dc = 1;
    if (p.varianten && p.varianten.length > 1) l.kleuren = p.varianten.length; // kaartje: 'x kleuren'
    /* 9-11-2026 (wens Marius): op heren-pagina's geen roze foto. Is de hoofdfoto roze en is er een andere kleur, dan krijgt het kaartje daar die foto. */
    if (p.varianten && p.varianten.length > 1 && (p.voor || []).indexOf('hem') !== -1) {
      const ROZE = /roze|pink|ros[eé]\b|rozé|lila|lavendel|paars|purple|blush/i;
      const hoofd = p.varianten.filter((v) => v && v.beeld === p.beeld)[0];
      const hoofdRoze = hoofd ? ROZE.test(hoofd.kleur || '') : ROZE.test((p.titel || '') + ' ' + (p.winkelUrl || ''));
      const ander = p.varianten.filter((v) => v && v.beeld && v.beeld !== p.beeld && !ROZE.test(v.kleur || '') && !ROZE.test(v.winkelUrl || ''))[0];
      if (hoofdRoze && ander) l.beeldHem = ander.beeld;
    }
    /* Snelheid (31-10-2026): de standaardwaarden laten we weg; het laadscript hieronder vult ze weer in. Zo is het bestand ~15% kleiner en sneller te lezen. */
    if (l.beeld === 'images/producten/' + l.id) delete l.beeld;
    if (l.status === 'goedgekeurd') delete l.status;
    if (typeof l.rang === 'number') l.rang = Math.round(l.rang * 100) / 100; /* 2 decimalen is genoeg voor de volgorde */
    /* Snelheid (5-11-2026): de meest voorkomende waarden laten we weg; het laadscript vult ze weer in (zie hieronder). */
    if (l.nieuw === true) delete l.nieuw; else if (l.nieuw === undefined) l.nieuw = false;
    if (Array.isArray(l.ookIn) && !l.ookIn.length) delete l.ookIn;
    if (l.shop === 'bol') delete l.shop;
    if (JSON.stringify(l.moment) === '["kerst","sinterklaas","verjaardag"]') delete l.moment;
    lean.push(l); det[p.id] = d;
  }
  /* Snelheid (31-10-2026): JSON.parse van een tekst is in browsers een stuk sneller dan het lezen van een JavaScript-object van 2,5 MB.
     De tekst staat tussen enkele quotes; alleen \ en ' hoeven dan ontsnapt te worden. */
  /* Lange woorden netjes afbreken op de telefoon (11-11-2026): alleen de woorden die nu in een titel staan gaan mee.
     De tabel staat in scripts/boom/afbreek.json (gemaakt met scripts/afbreek/maak.js, met de hand nagelezen). */
  let afbreek = '';
  try {
    const tab = JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts/boom/afbreek.json'), 'utf8'));
    const gezien = {};
    for (const p of lean) for (const w of (p.titel || '').match(/[A-Za-zÀ-ÿ]{13,}/g) || []) { const k = w.toLowerCase(); if (typeof tab[k] === 'string' && /^[a-zà-ÿ-]+$/.test(tab[k]) && tab[k].replace(/-/g, '') === k) gezien[k] = tab[k]; }
    afbreek = Object.keys(gezien).sort().map(k => gezien[k]).join('|');
  } catch (e) { console.log('afbreek.json niet gelezen (titels breken dan gewoon af): ' + e.message); }
  const json = '[' + lean.map(p => JSON.stringify(p)).join(',') + ']';
  const letterlijk = "'" + json.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(new RegExp(String.fromCharCode(0x2028), 'g'), '\\u2028').replace(new RegExp(String.fromCharCode(0x2029), 'g'), '\\u2029') + "'";
  fs.writeFileSync(path.join(ROOT, 'assets/js/producten-lean.js'), '/* Gemaakt door scripts/splits-producten.js uit producten.js – niet met de hand bewerken. */\nwindow.LK_PRODUCTEN = JSON.parse(' + letterlijk + ');\n' +
    '(function (L) { for (var i = 0; i < L.length; i++) { var p = L[i]; if (p.beeld === undefined) p.beeld = "images/producten/" + p.id; if (!p.status) p.status = "goedgekeurd"; if (p.nieuw === undefined) p.nieuw = true; else if (p.nieuw === false) delete p.nieuw; if (!p.ookIn) p.ookIn = []; if (!p.shop) p.shop = "bol"; if (!p.moment) p.moment = ["kerst", "sinterklaas", "verjaardag"]; } })(window.LK_PRODUCTEN);\n' +
    'window.LK_AFBREEK = "' + afbreek + '";\n' +
    /* Snelheid (31-10-2026): dit bestand laadt nu 'async' (zie sjabloon.html); de site wacht op dit seintje. */
    'try { window.dispatchEvent(new Event("lk-producten")); } catch (e) { var ev = document.createEvent("Event"); ev.initEvent("lk-producten", false, false); window.dispatchEvent(ev); }\n');
  fs.writeFileSync(path.join(ROOT, 'assets/js/producten-details.js'), '/* Gemaakt door scripts/splits-producten.js uit producten.js – niet met de hand bewerken. */\nwindow.LK_DETAILS = ' + JSON.stringify(det) + ';\n');
  return lean.length;
}
if (require.main === module) console.log(splits(), 'producten gesplitst');
try { require('./vak-regels.js')(); } catch (e) { console.log('vak-regels niet geschreven:', e.message); }
module.exports = splits;
