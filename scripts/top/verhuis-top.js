// 4.0 (proef 11-11-2026): vaste top voor de groepen en hoofdcategorieën die door de nieuwe indeling een nieuw adres kregen.
// Alleen uit cadeaus die al met de hand waren nagekeken voor de oude groepen (net als afleid.js): om en om uit elke oude groep,
// nooit twee uit hetzelfde vakje naast elkaar. Draai na: node scripts/boom/verhuis.js en node scripts/splits-producten.js.
// Gebruik: node scripts/top/verhuis-top.js  -> vult picks.json aan; daarna node scripts/top/pasToe.js
const fs = require('fs'), path = require('path'); const { lijst } = require('./kand.js');
const T = JSON.parse(fs.readFileSync(path.join(__dirname, '../boom/verhuizing.json'), 'utf8')).afdelingen;
/* Deze groepen hebben een top die met de hand is gekozen (11-11-2026, titels zelf gelezen): die blijft staan. */
const HAND = ['/c/spellen-puzzels/kaart-partyspellen', '/c/spellen-puzzels/kinderspellen', '/c/spellen-puzzels/breinbrekers-escape', '/c/spellen-puzzels/pokemon-verzamelkaarten',
  '/c/spellen-puzzels/bordspellen', '/c/koken-tafelen/mokken-glazen'];
const f = path.join(__dirname, 'picks.json'); const P = JSON.parse(fs.readFileSync(f)); const uit = [];
function maak(pad, bronnen, max) {
  let L; try { L = lijst(pad).filter(p => p.beeld); } catch (e) { return null; }
  const inL = {}; L.forEach(p => inL[p.id] = p);
  const rijen = bronnen.map(b => (P[b] || []).filter(id => inL[id])).filter(r => r.length);
  const top = [], gez = {};
  for (let r = 0; top.length < max && r < 40; r++) for (const rij of rijen) { const id = rij[r]; if (id && !gez[id] && top.length < max) { gez[id] = 1; top.push(id); } }
  for (let i = 1; i < top.length; i++) if ((inL[top[i]].vak || '') === (inL[top[i - 1]].vak || '')) {
    const j = top.findIndex((id, k) => k > i && (inL[id].vak || '') !== (inL[top[i - 1]].vak || '')); if (j !== -1) { const t = top[i]; top[i] = top[j]; top[j] = t; } }
  return top;
}
for (const A of T) {
  const groepTops = [];
  for (const G of A.groepen) {
    const pad = '/c/' + A.slug + '/' + G.slug;
    const bronnen = Array.from(new Set(G.uit.map(u => '/c/' + (typeof u === 'string' ? u : u.van).split('/').slice(0, 2).join('/'))));
    const zelfde = bronnen.length === 1 && bronnen[0] === pad;
    if (!zelfde && HAND.indexOf(pad) === -1) { const top = maak(pad, bronnen, 24); if (top && top.length >= 6) { P[pad] = top; uit.push(pad + ':' + top.length); } else { delete P[pad]; uit.push(pad + ':GEEN (' + (top ? top.length : 0) + ')'); } }
    groepTops.push(pad);
  }
  if (A.nieuw) { const top = maak('/c/' + A.slug, ['/c/' + A.van].concat(groepTops), 36); if (top && top.length >= 6) { P['/c/' + A.slug] = top; uit.push('/c/' + A.slug + ':' + top.length); } }
}
fs.writeFileSync(f, JSON.stringify(P));
console.log(uit.length + " pagina's:\n  " + uit.join('\n  '));
