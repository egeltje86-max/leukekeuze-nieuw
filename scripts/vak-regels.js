/* Schrijft scripts/vak-regels.json: de regels uit indeling.js (welk product in welk vakje) als tekst,
   zodat maak-zoekindex.py (Python, laptop) de producten van partnerwinkels met DEZELFDE regels over de vakjes verdeelt.
   Draait mee met splits-producten.js. Los: node scripts/vak-regels.js */
const fs = require('fs'), path = require('path');
const { GROEPEN, OOKIN_HERNOEM } = require('./indeling.js');
function schrijf() {
  const uit = { groepen: {}, hernoem: OOKIN_HERNOEM };
  for (const [g, v] of Object.entries(GROEPEN)) {
    uit.groepen[g] = {
      regels: (v.regels || []).map(([s, re]) => [s, re.source]),
      extra: (v.extra || []).map(([s, re, niet]) => [s, re.source, niet ? niet.source : ''])
    };
  }
  fs.writeFileSync(path.join(__dirname, 'vak-regels.json'), JSON.stringify(uit, null, 1));
  return Object.keys(uit.groepen).length;
}
if (require.main === module) console.log(schrijf(), 'groepen naar vak-regels.json');
module.exports = schrijf;
