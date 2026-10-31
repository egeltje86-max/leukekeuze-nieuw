/* Zet de vakjes van de NIEUWE indeling in de gewone Productstudio (map "Productstudio LeukeKeuze (nieuw)", voor nieuwe rondes).
   Gebruikt dezelfde vakjeslijst als maak-studio-site.js (Productstudio 2.0), zodat beide studio's dezelfde vakjes kennen.
   Gebruik: node scripts/maak-studio-cats.js "<pad naar Productstudio openen.html>" */
const fs = require('fs'), path = require('path'), os = require('os');
const html = process.argv[2];
if (!html) { console.log('Gebruik: node scripts/maak-studio-cats.js "<Productstudio openen.html>"'); process.exit(1); }
const tmp = path.join(os.tmpdir(), 'studio-site-' + process.pid + '.js');
require('child_process').execFileSync(process.execPath, [path.join(__dirname, 'maak-studio-site.js'), tmp], { stdio: 'ignore' });
const w = {}; new Function('window', fs.readFileSync(tmp, 'utf8'))(w); fs.unlinkSync(tmp);
const cats = [];
for (const p of w.LKS_PLEKKEN) {
  const [c, s] = p.v.split('/');
  let C = cats.find((x) => x.slug === c);
  if (!C) cats.push(C = { slug: c, naam: p.groep, subs: [] });
  C.subs.push({ slug: s, naam: p.naam });
}
let t = fs.readFileSync(html, 'utf8');
const re = /var CATS = \[.*?\];(?=\r?\n)/s;
if (!re.test(t)) { console.log('var CATS niet gevonden in ' + html); process.exit(1); }
t = t.replace(re, () => "var CATS = " + JSON.stringify(cats) + ";");
fs.writeFileSync(html, t);
console.log(cats.length + ' afdelingen, ' + w.LKS_PLEKKEN.length + ' vakjes gezet in ' + html);
