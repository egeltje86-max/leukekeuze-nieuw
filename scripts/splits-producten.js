/* Splitst assets/js/producten.js (de bron, geschreven door de rondes) in twee bestanden die de site laadt:
   - producten-lean.js: alles wat lijsten, zoeken en VONK nodig hebben (klein, laadt bij elke pagina)
   - producten-details.js: winkellinks, specs, verzendnoten, let-op (laadt pas op een productpagina)
   Zo laadt de site op een telefoon een stuk sneller. Draait automatisch mee in maak-paginas.js.
   Los draaien: node scripts/splits-producten.js */
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const { deel } = require('./indeling.js'); // 2.1: nieuwe indeling (vakjes, tags, leeftijd) – producten.js blijft zoals hij is
const DETAILS = ['url', 'winkelUrl', 'specs', 'verzendNoot', 'letOp', 'afgekeurdReden', 'varianten', 'maten', 'gecontroleerd'];
function splits() {
  const w = {}; new Function('window', fs.readFileSync(path.join(ROOT, 'assets/js/producten.js'), 'utf8'))(w);
  const lean = [], det = {};
  for (const p0 of w.LK_PRODUCTEN) {
    const p = deel(p0);
    const l = {}, d = {};
    for (const k of Object.keys(p)) (DETAILS.indexOf(k) === -1 ? l : d)[k] = p[k];
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
