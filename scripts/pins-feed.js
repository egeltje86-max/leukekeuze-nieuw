/* Pinterest automatisch (28-10-2026, wens Marius): elke dag een paar pins uit pins/wachtrij.json "vrijgeven"
   en per bord een RSS-feed maken (pins/<bord>.xml). Pinterest leest die feeds en plaatst nieuwe pins vanzelf.
   Gebruik: node scripts/pins-feed.js            -> alleen feeds opnieuw maken
            node scripts/pins-feed.js --vrijgeven -> perDag pins vrijgeven (alleen als "aan": true) en feeds maken */
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..'), D = path.join(ROOT, 'pins'), SITE = 'https://leukekeuze.nl';
const lees = f => JSON.parse(fs.readFileSync(path.join(D, f), 'utf8'));
const schrijf = (f, x) => fs.writeFileSync(path.join(D, f), typeof x === 'string' ? x : JSON.stringify(x, null, 1) + '\n');
const ins = lees('instellingen.json'); let wacht = lees('wachtrij.json'), klaar = lees('geplaatst.json');
if (process.argv.includes('--vrijgeven') && ins.aan) {
  const nu = new Date(), n = Math.min(ins.perDag || 15, wacht.length);
  wacht.splice(0, n).forEach((p, i) => klaar.push(Object.assign({}, p, { datum: new Date(nu.getTime() + i * 60000).toISOString() })));
  schrijf('wachtrij.json', wacht); schrijf('geplaatst.json', klaar);
  console.log('vrijgegeven:', n, '| nog in de wachtrij:', wacht.length);
}
const esc = t => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
for (const [bord, naam] of Object.entries(ins.borden)) {
  const items = klaar.filter(p => p.bord === bord).slice(-100).reverse();
  const xml = '<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/">\n<channel>\n' +
    `<title>LeukeKeuze – ${esc(naam)}</title>\n<link>${SITE}/</link>\n<description>Cadeau-ideeën van LeukeKeuze: ${esc(naam)}</description>\n<language>nl-nl</language>\n` +
    items.map(p => {
      const img = SITE + '/' + p.beeld;
      return `<item>\n <title>${esc(p.titel)}</title>\n <link>${esc(p.link)}</link>\n <guid isPermaLink="false">lk-pin-${esc(p.id)}</guid>\n` +
        ` <pubDate>${new Date(p.datum).toUTCString()}</pubDate>\n <description>${esc(p.tekst)}</description>\n` +
        ` <enclosure url="${esc(img)}" type="image/jpeg" length="0"/>\n <media:content url="${esc(img)}" medium="image" type="image/jpeg"/>\n</item>`;
    }).join('\n') + '\n</channel>\n</rss>\n';
  schrijf(bord + '.xml', xml);
}
console.log('feeds klaar:', Object.keys(ins.borden).join(', '));
