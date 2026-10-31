/* Maakt site-producten.js voor de Productstudio 2.0 (map "Productstudio 2.0 LeukeKeuze" op het bureaublad van Marius).
   Met de NIEUWE indeling (2.1): de vakjes uit data.js en per product de cat/sub/ookIn zoals de site ze nu toont (indeling.js).
   Gebruik: node scripts/maak-studio-site.js [uitvoerbestand]   (standaard: tools/productstudio-2/site-producten.js) */
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const { deel } = require('./indeling.js');

const w = { document: {} };
new Function('window', 'document', fs.readFileSync(path.join(ROOT, 'assets/js/data.js'), 'utf8'))(w, w.document);
new Function('window', fs.readFileSync(path.join(ROOT, 'assets/js/producten.js'), 'utf8'))(w);

/* Vakjes: alle zichtbare vakjes per afdeling, in de volgorde van het menu. */
const VOLG = ['sieraden', 'geuren-verzorging', 'mode-beauty', 'elektronica', 'wonen', 'keuken', 'dranken', 'eten-drinken', 'speelgoed', 'hobby',
  'sport-outdoor', 'tuin-klussen', 'boeken-media', 'dieren', 'metaaldetectie', 'christelijk', 'cadeaus', 'valentijn'];
const cats = w.LK_CATEGORIEEN.slice().sort((a, b) => (VOLG.indexOf(a.slug) + 1 || 99) - (VOLG.indexOf(b.slug) + 1 || 99));
/* Geen echte vakjes: de oude persoonsvakjes onder Cadeaus (nu /voor/...), prijsvakjes en adventskalenders (nu bij Lekkernijen). */
const GEEN_VAK = new Set(['cadeaus/voor-haar', 'cadeaus/voor-hem', 'cadeaus/voor-kinderen', 'cadeaus/opa-oma', 'cadeaus/collega', 'cadeaus/baby-kraam',
  'cadeaus/adventskalenders', 'cadeaus/onder-15', 'cadeaus/sint-onder-15', 'christelijk/onder-25']);
const plekken = [];
for (const c of cats) for (const s of c.subs || []) {
  if (s.verborgen || s.naar || GEEN_VAK.has(c.slug + '/' + s.slug)) continue;
  plekken.push({ v: c.slug + '/' + s.slug, groep: c.naam, naam: s.naam });
}
/* Producten die nog in een oud vakje staan: zichtbaar als groep 'Nog indelen', zodat Marius ze een nieuw vakje kan geven. */
const OUD_NAAM = { 'cadeaus/voor-haar': 'Voor haar (oud)', 'cadeaus/voor-hem': 'Voor hem (oud)', 'cadeaus/voor-kinderen': 'Kinderen (oud)', 'cadeaus/opa-oma': 'Opa & oma (oud)',
  'cadeaus/collega': "Collega's (oud)", 'cadeaus/baby-kraam': 'Baby & kraam (oud)', 'cadeaus/adventskalenders': 'Adventskalenders (oud)', 'cadeaus/onder-15': 'Onder €15 (oud)', 'cadeaus/sint-onder-15': 'Sint onder €15 (oud)' };
const nodig = new Set(); for (const p0 of w.LK_PRODUCTEN) if (p0.status === 'goedgekeurd') { const p = deel(p0); nodig.add(p.cat + '/' + p.sub); }
for (const v of Object.keys(OUD_NAAM)) if (nodig.has(v) && !plekken.some(x => x.v === v)) plekken.push({ v, groep: 'Nog indelen', naam: OUD_NAAM[v] });
const geldig = new Set(plekken.map(x => x.v));

const personen = (w.LK_PERSONEN || []).map(p => ({ slug: p.slug, naam: p.naam, labels: p.labels || [], oud: p.oud || '' }));

const lijst = [];
let zonderPlek = 0;
for (const p0 of w.LK_PRODUCTEN) {
  if (p0.status !== 'goedgekeurd') continue;
  const p = deel(p0);
  if (!geldig.has(p.cat + '/' + p.sub)) zonderPlek++;
  const foto = !p.beeld ? '' : /^https?:/.test(p.beeld) ? p.beeld : 'https://leukekeuze.nl/' + p.beeld + '-klein.webp';
  const x = { id: p.id, titel: p.titel, prijs: p.prijs, shop: p.shop, foto, winkelUrl: p.winkelUrl || '', cat: p.cat, sub: p.sub,
    ookIn: (p.ookIn || []).filter(v => geldig.has(v)), voor: p.voor || [], waarom: p.waarom || '', favoriet: !!p.favoriet, sfeer: !!p.sfeer, sinds: p.sinds || '' };
  if (p.tags && p.tags.length) x.tags = p.tags;
  if (p.leeftijd) x.leeftijd = p.leeftijd;
  lijst.push(x);
}

const datum = new Date().toISOString().slice(0, 10);
const uit = process.argv[2] || path.join(ROOT, 'tools/productstudio-2/site-producten.js');
fs.writeFileSync(uit, '/* Productstudio 2.0 - alle producten die nu op LeukeKeuze.nl staan (' + datum + '), met de nieuwe indeling. Gemaakt door Claude. */\n' +
  'window.LKS_DATUM=' + JSON.stringify(datum) + ';\n' +
  'window.LKS_PLEKKEN=' + JSON.stringify(plekken) + ';\n' +
  'window.LKS_PERSONEN=' + JSON.stringify(personen) + ';\n' +
  'window.LKS_PRODUCTEN=[\n' + lijst.map(x => JSON.stringify(x)).join(',\n') + '\n];\n');
console.log(lijst.length + ' producten, ' + plekken.length + ' vakjes, ' + zonderPlek + ' producten in een vakje dat niet in de lijst staat -> ' + uit);
