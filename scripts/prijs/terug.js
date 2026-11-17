/* Eenmalig (17-11-2026): de prijsgeschiedenis terughalen uit git. Per dag de laatste gebouwde versie van
   producten-lean.js (prijs, status) en producten-details.js (controledatum). Telt alleen als waarneming als de prijs
   die dag vers was (gecontroleerd die dag of de dag ervoor). Schrijft scripts/prijs/historie.json (begint leeg).
   Gebruik: node scripts/prijs/terug.js [vanaf YYYY-MM-DD] [tot YYYY-MM-DD] */
const { execSync } = require('child_process');
const H = require('./historie.js');
const ROOT = require('path').resolve(__dirname, '..', '..');
const vanaf = process.argv[2] || '2026-10-29', tot = process.argv[3] || H.vandaagNL();
const git = (a) => execSync('git ' + a, { cwd: ROOT, maxBuffer: 1 << 30, env: Object.assign({}, process.env, { TZ: 'Europe/Amsterdam' }) }).toString();

function laad(tekst) {
  const w = { dispatchEvent() {} };
  const doc = { createEvent() { return { initEvent() {} }; } };
  try { new Function('window', 'document', 'Event', tekst)(w, doc, function () {}); } catch (e) { return w; }
  return w;
}
/* laatste commit per dag waarin de gebouwde productlijst veranderde */
const regels = git('log --format="%H %cd" --date=format-local:%Y-%m-%d -- assets/js/producten-details.js').trim().split('\n');
const perDag = {};
for (const r of regels) { const [h, d] = r.split(' '); if (d >= vanaf && d <= tot && !perDag[d]) perDag[d] = h; } /* log is nieuwste eerst */
const h = { p: {} };
let totaal = 0;
for (const d of Object.keys(perDag).sort()) {
  const c = perDag[d];
  const wl = laad(git('show ' + c + ':assets/js/producten-lean.js'));
  const wd = laad(git('show ' + c + ':assets/js/producten-details.js'));
  const lijst = Object.values(wl).find((v) => Array.isArray(v) && v.length > 1000 && v[0] && v[0].id) || [];
  const det = Object.values(wd).find((v) => v && typeof v === 'object' && !Array.isArray(v) && Object.keys(v).length > 1000) || {};
  const grens = H.nr(d) - 1; let n = 0;
  for (const p of lijst) {
    if ((p.status || 'goedgekeurd') !== 'goedgekeurd' || p.samengevoegd || !(p.prijs > 0)) continue;
    const g = (det[p.id] || {}).gecontroleerd || p.gecontroleerd; if (!g || H.nr(String(g).slice(0, 10)) < grens) continue;
    H.noteerEen(h, p.id, d, p.prijs); n++;
  }
  totaal += n; console.log(d, c.slice(0, 10), 'producten', lijst.length, 'verse prijzen', n);
}
h.bijgewerkt = tot; H.schrijf(h);
console.log('klaar:', Object.keys(h.p).length, 'producten,', totaal, 'waarnemingen');
