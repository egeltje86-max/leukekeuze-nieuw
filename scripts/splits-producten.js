/* Splitst assets/js/producten.js (de bron, geschreven door de rondes) in twee bestanden die de site laadt:
   - producten-lean.js: alles wat lijsten, zoeken en VONK nodig hebben (klein, laadt bij elke pagina)
   - producten-details.js: winkellinks, specs, verzendnoten, let-op (laadt pas op een productpagina)
   Zo laadt de site op een telefoon een stuk sneller. Draait automatisch mee in maak-paginas.js.
   Los draaien: node scripts/splits-producten.js */
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const { deel } = require('./indeling.js');
const { plaats } = require('./boom/plaats.js'); // 3.0: nieuwe boom (afd > groep > vak), zie scripts/boom/ // 2.1: nieuwe indeling (vakjes, tags, leeftijd) – producten.js blijft zoals hij is
const DETAILS = ['url', 'winkelUrl', 'specs', 'verzendNoot', 'letOp', 'afgekeurdReden', 'varianten', 'maten', 'gecontroleerd'];
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
  for (const p0 of w.LK_PRODUCTEN) {
    const p = plaats(keurkamerSlot(deel(p0)));
    const l = {}, d = {};
    for (const k of Object.keys(p)) (DETAILS.indexOf(k) === -1 ? l : d)[k] = p[k];
    /* Daisycon-product? Klein vlaggetje voor de lijsten (de link zelf staat in details). Zie daisyconLaag() in app.js. */
    if (/^https?:\/\/(lt45|fr135|bdt9|glp8|ds1|jdt8|rkn3|jf79)\.n[le]t?\/c\/|^https?:\/\/aff\.svinando\.be\/c\//.test(p.url || '')) l.dc = 1;
    if (p.varianten && p.varianten.length > 1) l.kleuren = p.varianten.length; // kaartje: 'x kleuren'
    /* Snelheid (31-10-2026): de standaardwaarden laten we weg; het laadscript hieronder vult ze weer in. Zo is het bestand ~15% kleiner en sneller te lezen. */
    if (l.beeld === 'images/producten/' + l.id) delete l.beeld;
    if (l.status === 'goedgekeurd') delete l.status;
    lean.push(l); det[p.id] = d;
  }
  /* Snelheid (31-10-2026): JSON.parse van een tekst is in browsers een stuk sneller dan het lezen van een JavaScript-object van 2,5 MB.
     De tekst staat tussen enkele quotes; alleen \ en ' hoeven dan ontsnapt te worden. */
  const json = '[' + lean.map(p => JSON.stringify(p)).join(',') + ']';
  const letterlijk = "'" + json.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(new RegExp(String.fromCharCode(0x2028), 'g'), '\\u2028').replace(new RegExp(String.fromCharCode(0x2029), 'g'), '\\u2029') + "'";
  fs.writeFileSync(path.join(ROOT, 'assets/js/producten-lean.js'), '/* Gemaakt door scripts/splits-producten.js uit producten.js – niet met de hand bewerken. */\nwindow.LK_PRODUCTEN = JSON.parse(' + letterlijk + ');\n' +
    '(function (L) { for (var i = 0; i < L.length; i++) { var p = L[i]; if (p.beeld === undefined) p.beeld = "images/producten/" + p.id; if (!p.status) p.status = "goedgekeurd"; } })(window.LK_PRODUCTEN);\n' +
    /* Snelheid (31-10-2026): dit bestand laadt nu 'async' (zie sjabloon.html); de site wacht op dit seintje. */
    'try { window.dispatchEvent(new Event("lk-producten")); } catch (e) { var ev = document.createEvent("Event"); ev.initEvent("lk-producten", false, false); window.dispatchEvent(ev); }\n');
  fs.writeFileSync(path.join(ROOT, 'assets/js/producten-details.js'), '/* Gemaakt door scripts/splits-producten.js uit producten.js – niet met de hand bewerken. */\nwindow.LK_DETAILS = ' + JSON.stringify(det) + ';\n');
  return lean.length;
}
if (require.main === module) console.log(splits(), 'producten gesplitst');
try { require('./vak-regels.js')(); } catch (e) { console.log('vak-regels niet geschreven:', e.message); }
module.exports = splits;
