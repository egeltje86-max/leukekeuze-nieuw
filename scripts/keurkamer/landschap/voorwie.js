// Landschap-keurkamer (15-11-2026): welke cadeaus staan op welke Voor wie-pagina en welk onderwerp.
// Zelfde regels als de site (scripts/top/kand.js). Schrijft assets/data/voorwie.json; alleen de keurkamer leest dit.
const fs = require('fs'), path = require('path');
const R = path.resolve(__dirname, '../../..');
const { lijst } = require(R + '/scripts/top/kand.js');
const W = global.window;
const uit = { gemaakt: new Date().toISOString(), personen: [] };
for (const pe of W.LK_PERSONEN) {
  const alle = lijst('voor/' + pe.slug).filter(p => p.beeld).map(p => p.id);
  const subs = (pe.subs || []).map(s => ({ slug: s.slug, naam: s.naam, ids: lijst('voor/' + pe.slug + '/' + s.slug).filter(p => p.beeld).map(p => p.id) })).filter(s => s.ids.length);
  uit.personen.push({ slug: pe.slug, naam: pe.naam || pe.slug, ids: alle, subs });
}
fs.mkdirSync(path.join(R, 'assets/data'), { recursive: true });
fs.rmSync(path.join(R, 'assets/data/voorwie.json'), { force: true });
fs.writeFileSync(path.join(R, 'assets/data/voorwie.js'), '/* alleen voor de Landschap-keurkamer */ window.LK_VOORWIE = ' + JSON.stringify(uit) + ';\n');
console.log('voorwie.js:', uit.personen.map(p => p.slug + ' ' + p.ids.length).join(', '));
