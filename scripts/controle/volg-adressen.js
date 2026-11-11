/* Gebruik: node scripts/controle/volg-adressen.js . <bestand met adressen, één per regel> [toon]
   Alle doorstuurpagina's nalopen: grep -rl --include=index.html data-verhuisd c | sed 's#^#/#;s#/index.html$#/#' > lijst.txt
   Volgt elk adres dat Google kent tot de echte pagina: bestaat hij, hoeveel stappen, en mag Google hem opnemen? */
const fs = require('fs'); const R = process.argv[2];
const lees = p => { try { return fs.readFileSync(R + p.replace(/[?#].*$/, '').replace(/\/$/, '') + '/index.html', 'utf8'); } catch (e) { return null; } };
const REF = /refresh" content="0; url=([^"]*)"/;
const paden = fs.readFileSync(process.argv[3], 'utf8').split('\n').map(s => s.trim()).filter(Boolean);
let goed = 0; const direct = [], een = [], meer = [], kapot = [], noindex = [];
for (const p0 of paden) {
  let p = p0, stappen = 0, h = lees(p);
  while (h && /data-verhuisd/.test(h.slice(0, 400)) && stappen < 5) { p = (h.match(REF) || [])[1]; stappen++; h = p ? lees(p) : null; }
  if (!h) { kapot.push(p0 + (stappen ? ' -> ' + p : '')); continue; }
  if (/<meta name="robots"[^>]*noindex/.test(h)) noindex.push(p0 + ' -> ' + p);
  (stappen === 0 ? direct : stappen === 1 ? een : meer).push(p0 + (stappen ? '  ->  ' + p : '')); goed++;
}
console.log('adressen: ' + paden.length + ' | komt goed uit: ' + goed + ' (direct ' + direct.length + ', na 1 stap ' + een.length + ', na meer stappen ' + meer.length + ') | kapot: ' + kapot.length + ' | eindpagina op noindex: ' + noindex.length);
if (kapot.length) console.log('KAPOT:\n  ' + kapot.join('\n  '));
if (meer.length) console.log('MEER STAPPEN:\n  ' + meer.join('\n  '));
if (noindex.length) console.log('NOINDEX:\n  ' + noindex.join('\n  '));
if (process.argv[4]) console.log('NA 1 STAP:\n  ' + een.join('\n  '));
