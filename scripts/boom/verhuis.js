/* 4.0 – zet de nieuwe indeling uit scripts/boom/verhuizing.json in de site (proef 11-11-2026; niet live zonder GO van Marius).
   Gebruik: node scripts/boom/verhuis.js          -> schrijft scripts/boom/verhuisd.json en het blok '4.0 VERHUIZING' onderaan assets/js/data.js
            node scripts/boom/verhuis.js weg      -> haalt het 4.0-blok weer weg (de site is dan weer zoals voor de proef)
   Daarna altijd: bouwen + controleren. */
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..', '..'), DATA = path.join(ROOT, 'assets/js/data.js');
const BLOK = /\n*\/\* ===== 4\.0 VERHUIZING[\s\S]*?\/\* ===== einde 4\.0 ===== \*\/\n?/;
let d = fs.readFileSync(DATA, 'utf8').replace(BLOK, '\n');
if (process.argv[2] === 'weg') { fs.writeFileSync(DATA, d.replace(/\n+$/, '\n')); try { fs.unlinkSync(path.join(__dirname, 'verhuisd.json')); } catch (e) {} console.log('4.0-blok weg; de oude indeling geldt weer.'); process.exit(0); }
const T = JSON.parse(fs.readFileSync(path.join(__dirname, 'verhuizing.json'), 'utf8')).afdelingen;
const { LK_VERHUIS } = require('./verhuis-kern.js');
const w = {}; new Function('window', d)(w);
/* controle van de tabel: elke bron moet bestaan, elk oud vakje precies één keer gebruikt */
const zicht = {}; w.LK_CATEGORIEEN.forEach((c) => { if (!c.verborgen) zicht[c.slug] = c; });
const fout = [], gezien = {};
for (const A of T) for (const G of A.groepen) for (const u of G.uit) {
  const dd = (typeof u === 'string' ? u : u.van).split('/'), c = zicht[dd[0]], s = c && (c.subs || []).find((x) => x.slug === dd[1] && !x.verborgen && x.vakjes);
  if (!s) { fout.push('bron bestaat niet: ' + dd.join('/')); continue; }
  const vv = s.vakjes.filter((v) => !dd[2] || v.slug === dd[2]); if (!vv.length) fout.push('vakje bestaat niet: ' + dd.join('/'));
  for (const v of vv) { const k = dd[0] + '/' + dd[1] + '/' + v.slug; if (gezien[k]) fout.push('twee keer gebruikt: ' + k); gezien[k] = 1; }
}
const slugs = {}; for (const A of T) { if (slugs[A.slug]) fout.push('dubbele afdeling ' + A.slug); slugs[A.slug] = 1; const g = {}; for (const G of A.groepen) { if (g[G.slug]) fout.push('dubbele groep ' + A.slug + '/' + G.slug); g[G.slug] = 1; } }
const r = LK_VERHUIS(w.LK_CATEGORIEEN, T);
for (const k of r.ontbreekt) fout.push('oud vakje zonder nieuwe plek: ' + k);
if (fout.length) { console.error('FOUT in verhuizing.json:\n  ' + fout.join('\n  ')); process.exit(1); }
const veranderd = {}; for (const k of Object.keys(r.vak)) if (r.vak[k].join('/') !== k) veranderd[k] = r.vak[k];
fs.writeFileSync(path.join(__dirname, 'verhuisd.json'), JSON.stringify({ _uitleg: 'Gemaakt door scripts/boom/verhuis.js uit verhuizing.json – niet met de hand bewerken. vak: oud afd/groep/vak -> nieuw; groep: oud afd/groep -> nieuw (product zonder vakje); terug: nieuw -> oud.', vak: veranderd, groep: r.groep, terug: r.terug }, null, 1) + '\n');
const kern = fs.readFileSync(path.join(__dirname, 'verhuis-kern.js'), 'utf8').replace(/^\/\*[\s\S]*?\*\/\n/, '').replace(/\nif \(typeof module[^\n]*\n?$/, '\n');
const blok = '\n/* ===== 4.0 VERHUIZING (proef 11-11-2026): 15 hoofdcategorieën. GEMAAKT DOOR scripts/boom/verhuis.js uit scripts/boom/verhuizing.json – niet met de hand bewerken.\n' +
  '   De boom hierboven (3.0 en alle aanvullingen) wordt hier omgezet naar de nieuwe indeling. Oude adressen sturen door; zie scripts/boom/verhuis-kern.js voor de uitleg. ===== */\n' +
  kern +
  '(function () {\n  var T = ' + JSON.stringify(T) + ';\n  var r = LK_VERHUIS(window.LK_CATEGORIEEN || [], T);\n  window.LK_CATEGORIEEN = r.cats;\n  window.LK_VERHUISD = { pad: r.pad, terug: r.terug };\n})();\n' +
  '/* ===== einde 4.0 ===== */\n';
fs.writeFileSync(DATA, d.replace(/\n+$/, '\n') + blok);
const z = r.cats.filter((c) => !c.verborgen && !/^(cadeaus|valentijn)$/.test(c.slug));
console.log('hoofdcategorieën', z.length, '| groepen', z.reduce((t, c) => t + c.subs.filter((s) => !s.verborgen).length, 0), '| vakjes', z.reduce((t, c) => t + c.subs.filter((s) => !s.verborgen).reduce((u, s) => u + s.vakjes.length, 0), 0),
  '| vakjes op een nieuwe plek', Object.keys(veranderd).length, '| oude adressen die doorsturen', Object.keys(r.pad).length);
