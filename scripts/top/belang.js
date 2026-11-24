/* BELANGRIJKSTE EERST (22-11-2026, opdracht Marius: 'er moeten niet de producten staan die ik heb uitgekozen, er moeten echt belangrijke
   producten staan; verander dat overal').

   Zet in elke vaste top (picks.json) de eerste 36 opnieuw op volgorde: wat klanten echt zoeken en kopen eerst.
   Belang van een cadeau:
   - verkocht via onze site: telt NIET mee (Marius 24-11: 'je moet niet gelijk producten die 1 keer verkocht zijn bovenaan zetten'; één verkoop zegt niets)
   - kreeg al bezoek via Google of kliks (scripts/seo/google-houden.json): +1,5 (niet voor producten die er alleen door een verkoop in staan)
   - zoekvolume in Google (keurkamer/data/vraag.json, gemaakt door scripts/seo/gezocht.js; zelfde weging): log10(volume) - 1,7, hooguit 3,5
     (1.000 per maand = 1,3; 10.000 = 2,3; 100.000 = 3,3)
   - in Toppers van nu (hype van dit jaar): +1
   - de plek in de bestaande top telt nog licht mee (+1 voor plek 1, aflopend), zodat cadeaus zonder signaal hun volgorde houden.
   Afwisseling: nooit twee uit hetzelfde vakje of van hetzelfde merk na elkaar, en in de eerste 12 hooguit 3 uit dezelfde afdeling.
   Alleen de volgorde binnen de eerste 36 verandert; welke cadeaus erin staan blijft gelijk (dus ook welke productpagina's in Google staan).
   Gebruik: node scripts/top/belang.js [--droog], daarna node scripts/top/pasToe.js. */
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.resolve(__dirname, '../..');
const DROOG = process.argv.includes('--droog');
const ctx = { window: { dispatchEvent() {}, addEventListener() {} }, document: { createEvent() { return { initEvent() {} }; }, addEventListener() {} }, Event: function () {} };
ctx.window.window = ctx.window; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(ROOT, 'assets/js/producten-lean.js'), 'utf8'), ctx);
const P = {}; (ctx.window.LK_PRODUCTEN || []).forEach(p => { P[p.id] = p; });
const { VERKOCHT } = require('../keurmeester/regels.js');
const HOUD = new Set(JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts/seo/google-houden.json'), 'utf8')).ids);
let VR = {}; try { VR = JSON.parse(fs.readFileSync(path.join(ROOT, 'keurkamer/data/vraag.json'), 'utf8')); } catch (e) { console.log('geen vraag.json: draai eerst node scripts/seo/gezocht.js'); process.exit(1); }
const PF = path.join(ROOT, 'scripts/top/picks.json');
const picks = JSON.parse(fs.readFileSync(PF, 'utf8'));
const TOPPERS = new Set(picks['/collectie/toppers-van-nu'] || []);
const N = 36;
function belang(id) { let s = 0; if (HOUD.has(id) && !VERKOCHT.has(id)) s += 1.5; if (TOPPERS.has(id)) s += 1;
  const v = VR[id]; if (v) s += Math.max(0, Math.min(3.5, Math.log10(v) - 1.7)); return s; }
const merk = p => String((p && (p.merk || p.titel.split(' ')[0])) || '').toLowerCase();
let nTop = 0, nAnders = 0; const voorbeeld = [];
for (const k of Object.keys(picks)) {
  const L = picks[k]; if (!Array.isArray(L) || L.length < 4) continue;
  const kop = L.slice(0, N), rest = L.slice(N);
  const sc = {}; kop.forEach((id, i) => { sc[id] = belang(id) + 1 * (1 - i / kop.length); });
  const over = kop.slice().sort((a, b) => sc[b] - sc[a]); const uit = []; const afdTel = {};
  while (over.length) {
    const vorig = P[uit[uit.length - 1]];
    let j = over.findIndex(id => { const p = P[id]; if (!p || !vorig) return true;
      if (p.vak && p.vak === vorig.vak) return false; if (merk(p) && merk(p) === merk(vorig)) return false;
      if (uit.length < 12 && p.afd && (afdTel[p.afd] || 0) >= 3) return false; return true; });
    if (j === -1 || j > 6) j = 0;
    const id = over.splice(j, 1)[0]; uit.push(id); const p = P[id]; if (p && p.afd && uit.length <= 12) afdTel[p.afd] = (afdTel[p.afd] || 0) + 1;
  }
  nTop++; if (uit.join() !== kop.join()) { nAnders++; if (voorbeeld.length < 6 && /^\/voor\/[a-z-]+$|toppers|sinterklaas$/.test(k)) voorbeeld.push([k, uit.slice(0, 6).map(id => (P[id] ? P[id].titel.slice(0, 32) : id) + ' [' + belang(id).toFixed(1) + ']')]); }
  picks[k] = uit.concat(rest);
}
voorbeeld.forEach(([k, l]) => console.log(k + '\n   ' + l.join('\n   ')));
console.log('belangrijkste eerst: ' + nAnders + ' van ' + nTop + ' toppen kregen een andere volgorde (alleen binnen de eerste ' + N + ')');
if (!DROOG) { fs.writeFileSync(PF, JSON.stringify(picks)); console.log('picks.json bijgewerkt'); }
