// Vaste top voor 'gelegenheid/collectie x persoon' (bijv. Verjaardag voor hem): alleen uit cadeaus die al met de hand zijn nagekeken
// voor de gelegenheid én voor die persoon. Geen nieuwe producten, dus geen leeswerk nodig. node afleid.js -> vult picks.json aan.
const fs = require('fs'), path = require('path'); const { lijst } = require('./kand.js');
const f = path.join(__dirname, 'picks.json'); const P = JSON.parse(fs.readFileSync(f)); const uit = [];
for (const pad of fs.readFileSync(path.join(__dirname, 'gsubs.txt'), 'utf8').split('\n').filter(Boolean)) {
  const d = pad.split('/').filter(Boolean); const basis = '/' + d[0] + '/' + d[1], pers = d[2];
  let L; try { L = lijst(pad).filter(p => p.beeld); } catch (e) { continue; }
  if (L.length < 10) continue; const inL = {}; L.forEach(p => inL[p.id] = p);
  const A = (P[basis] || []).filter(id => inL[id]);
  const subs = Object.keys(P).filter(k => k.indexOf('/voor/' + pers + '/') === 0).map(k => P[k].filter(id => inL[id]));
  const B = (P['/voor/' + pers] || []).filter(id => inL[id]); const gez = {}; A.forEach(id => gez[id] = 1); B.forEach(id => gez[id] = 1);
  for (let r = 0; r < 6; r++) subs.forEach(l => { const id = l[r]; if (id && !gez[id]) { gez[id] = 1; B.push(id); } });
  const Bx = B.filter(id => A.indexOf(id) === -1); const top = []; let a = 0, b = 0;
  while (top.length < 24 && (a < A.length || b < Bx.length)) { if (a < A.length) top.push(A[a++]); if (b < Bx.length && top.length < 24) top.push(Bx[b++]); }
  /* niet twee dezelfde vakjes naast elkaar */
  for (let i = 1; i < top.length; i++) if ((inL[top[i]].vak || '') === (inL[top[i - 1]].vak || '')) { const j = top.findIndex((id, k) => k > i && (inL[id].vak || '') !== (inL[top[i - 1]].vak || '')); if (j > i) { const t = top[i]; top[i] = top[j]; top[j] = t; } }
  if (top.length >= 6) { P[pad] = top; uit.push(pad + ':' + top.length); }
}
fs.writeFileSync(f, JSON.stringify(P)); fs.writeFileSync(path.join(__dirname, 'afgeleid.txt'), uit.join('\n'));
console.log(uit.length + ' pagina\'s afgeleid: ' + uit.join(' '));
