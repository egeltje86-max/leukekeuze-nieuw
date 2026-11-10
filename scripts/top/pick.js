// node pick.js <pad> n,n,n...  -> bewaart de vaste top (ids) in picks.json
const fs = require('fs'), path = require('path');
const f = path.join(__dirname, 'picks.json'); const P = fs.existsSync(f) ? JSON.parse(fs.readFileSync(f)) : {};
for (let i = 2; i < process.argv.length; i += 2) {
  const pad = process.argv[i].replace(/\/$/, ''); const ids = JSON.parse(fs.readFileSync(path.join(__dirname, 'kand', pad.replace(/\W+/g, '_') + '.json')));
  const n = process.argv[i + 1].split(',').map(Number); const uit = []; n.forEach(x => { if (!ids[x - 1]) throw new Error(pad + ' nr ' + x); if (!uit.includes(ids[x - 1])) uit.push(ids[x - 1]); });
  P[pad] = uit; console.log(pad, uit.length);
}
fs.writeFileSync(f, JSON.stringify(P));
