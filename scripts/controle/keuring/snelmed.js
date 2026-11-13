// Mediaan van N metingen per pagina, oud (8767) en nieuw (8765) om en om. node snelmed.js <N> <pad...>   (NET=gewoon voor gewone 4G)
const { execFileSync } = require('child_process'); const fs = require('fs');
const N = +process.argv[2], paden = process.argv.slice(3); const R = { oud: {}, nieuw: {} };
for (let i = 0; i < N; i++) for (const [naam, poort] of [['oud', 8767], ['nieuw', 8765]]) {
  execFileSync('node', ['snel.js', String(poort), ...paden], { env: Object.assign({}, process.env, { UIT: 'snelmed-tmp.json' }), stdio: 'ignore' });
  for (const x of JSON.parse(fs.readFileSync('snelmed-tmp.json', 'utf8'))) (R[naam][x.pad] = R[naam][x.pad] || []).push(x);
}
const med = (a, k) => { const v = a.map(x => x[k] || 0).sort((x, y) => x - y); return v[v.length >> 1]; };
const uit = [];
for (const pad of paden) { const o = R.oud[pad], n = R.nieuw[pad]; const rij = { pad };
  for (const k of ['fcp', 'lcp', 'cls', 'klaar', 'lang', 'kb']) { rij[k + 'Oud'] = med(o, k); rij[k + 'Nieuw'] = med(n, k); }
  uit.push(rij);
  console.log(pad.padEnd(34) + ' eerste beeld ' + rij.fcpOud + ' > ' + rij.fcpNieuw + ' | grootste beeld ' + rij.lcpOud + ' > ' + rij.lcpNieuw + ' | verspringen ' + rij.clsOud.toFixed(3) + ' > ' + rij.clsNieuw.toFixed(3) + ' | knoppen ' + rij.klaarOud + ' > ' + rij.klaarNieuw + ' | blokkade ' + Math.round(rij.langOud) + ' > ' + Math.round(rij.langNieuw) + ' | KB ' + rij.kbOud + ' > ' + rij.kbNieuw); }
fs.writeFileSync(process.env.NAAR || 'snelmed.json', JSON.stringify(uit, null, 1));
