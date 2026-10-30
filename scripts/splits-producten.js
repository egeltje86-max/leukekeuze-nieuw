/* Splitst assets/js/producten.js (de bron, geschreven door de rondes) in twee bestanden die de site laadt:
   - producten-lean.js: alles wat lijsten, zoeken en VONK nodig hebben (klein, laadt bij elke pagina)
   - producten-details.js: winkellinks, specs, verzendnoten, let-op (laadt pas op een productpagina)
   Zo laadt de site op een telefoon een stuk sneller. Draait automatisch mee in maak-paginas.js.
   Los draaien: node scripts/splits-producten.js */
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const { deel } = require('./indeling.js'); // 2.1: nieuwe indeling (vakjes, tags, leeftijd) – producten.js blijft zoals hij is
const DETAILS = ['url', 'winkelUrl', 'specs', 'verzendNoot', 'letOp', 'afgekeurdReden', 'varianten'];
function splits() {
  const w = {}; new Function('window', fs.readFileSync(path.join(ROOT, 'assets/js/producten.js'), 'utf8'))(w);
  const lean = [], det = {};
  for (const p0 of w.LK_PRODUCTEN) {
    const p = deel(p0);
    const l = {}, d = {};
    for (const k of Object.keys(p)) (DETAILS.indexOf(k) === -1 ? l : d)[k] = p[k];
    if (p.varianten && p.varianten.length > 1) l.kleuren = p.varianten.length; // kaartje: 'x kleuren'
    lean.push(l); det[p.id] = d;
  }
  fs.writeFileSync(path.join(ROOT, 'assets/js/producten-lean.js'), '/* Gemaakt door scripts/splits-producten.js uit producten.js – niet met de hand bewerken. */\nwindow.LK_PRODUCTEN = [\n' + lean.map(p => JSON.stringify(p)).join(',\n') + '\n];\n');
  fs.writeFileSync(path.join(ROOT, 'assets/js/producten-details.js'), '/* Gemaakt door scripts/splits-producten.js uit producten.js – niet met de hand bewerken. */\nwindow.LK_DETAILS = ' + JSON.stringify(det) + ';\n');
  return lean.length;
}
if (require.main === module) console.log(splits(), 'producten gesplitst');
module.exports = splits;
