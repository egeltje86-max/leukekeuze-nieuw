// Controle CADEAUKEURMEESTER (19-11-2026, opdracht Nova via Marius): de vaste fouten uit de steekproef van Nova mogen nooit terugkomen,
// en goede cadeaus mogen niet onterecht verdwijnen. Rekent met het veld km uit de gebouwde productlijst, net als app.js (75 min aftrek).
// Gebruik: node scripts/controle/keurmeester.js <repo> <rapport.json>   -> exit 1 als een test faalt.
const fs = require('fs'), path = require('path'), vm = require('vm');
const R = path.resolve(process.argv[2] || '.'), RAP = process.argv[3];
const ctx = { window: { dispatchEvent() {}, addEventListener() {} }, document: { createEvent() { return { initEvent() {} }; }, addEventListener() {} }, Event: function () {} };
ctx.window.window = ctx.window; vm.createContext(ctx);
for (const f of ['assets/js/producten-lean.js', 'assets/js/topkeuze.js']) vm.runInContext(fs.readFileSync(path.join(R, f), 'utf8'), ctx);
const KM = require(path.join(R, 'scripts/keurmeester/regels.js'));
const W = ctx.window, PR = (W.LK_PRODUCTEN || []).filter((p) => !p.status || p.status === 'goedgekeurd');
const aftrek = (p, g, pe) => { const o = {}; String(p.km || '').split(',').forEach((x) => { const m = /^([gp]\.[a-z-]+?)(\d+)$/.exec(x); if (m) o[m[1]] = +m[2]; }); return (g ? o['g.' + g] || 0 : 0) + (pe ? o['p.' + pe] || 0 : 0); };
const score = (p, g, pe) => 75 - aftrek(p, g, pe);
const vind = (w) => typeof w === 'string' && /^[a-z]+-[\w-]+$/.test(w) ? PR.filter((p) => p.id === w) : PR.filter((p) => w.test(p.titel || ''));
/* [wat, gelegenheid, ontvanger, verwachting, uitleg]. Verwachting: 'weg' (<50), 'onder' (<75), 'goed' (>=75). */
const TESTS = [
  ['dvzn-770d60cf83', 'bedankt', 'collega', 'weg', 'Nova: grafsteenkaars bij Bedankje voor collega'],
  ['dvzn-770d60cf83', 'afscheid', '', 'weg', 'grafsteenkaars bij Afscheid'],
  ['dvzn-770d60cf83', 'beterschap', '', 'weg', 'grafsteenkaars bij Beterschap'],
  ['dvzn-770d60cf83', 'sinterklaas', '', 'weg', 'grafsteenkaars bij Sinterklaas'],
  ['dvzn-770d60cf83', 'verjaardag', '', 'onder', 'grafsteenkaars bij Verjaardag: mag, maar onderaan'],
  ['dvzn-770d60cf83', 'grappig', '', 'goed', 'grafsteenkaars bij Grappige cadeaus: blijft'],
  [/^Truffelcrème uit Italië/, 'bedankt', 'collega', 'weg', 'Nova: truffelcrème bij Bedankje voor collega'],
  [/^Bruisballen in de vorm van koffiebonen/, '', 'collega', 'onder', 'Nova: koffiebruisballen bij collega: onderaan'],
  [/^Bruisballen in de vorm van koffiebonen/, '', 'haar', 'goed', 'koffiebruisballen bij Voor haar: blijft'],
  [/^Massageroller voor je nek/, 'bedankt', 'collega', 'weg', 'Nova: nekmassageroller bij Bedankje voor collega'],
  [/^Massageroller voor je nek/, '', 'haar', 'goed', 'nekmassageroller bij Voor haar: blijft'],
  [/^Willy Wash/, 'bedankt', 'collega', 'weg', 'piemelzeep bij Bedankje voor collega'],
  [/chocoladeletter/i, 'afscheid', '', 'weg', 'chocoladeletter bij Afscheid & pensioen'],
  [/chocoladeletter/i, 'sinterklaas', '', 'goed', 'chocoladeletter bij Sinterklaas: blijft'],
  [/^Taartkaarsjes Harry Potter/, 'bedankt', 'kinderen', 'weg', 'verjaardagskaarsjes bij Bedankt'],
  [/^Taartkaarsjes Harry Potter/, 'verjaardag', 'kinderen', 'goed', 'verjaardagskaarsjes bij Verjaardag: blijft'],
  [/^Kaars in de vorm van een middelvinger/, 'jubileum', 'hem', 'weg', 'middelvingerkaars bij Jubileum'],
  [/^Kaars in de vorm van een middelvinger/, 'grappig', '', 'goed', 'middelvingerkaars bij Grappige cadeaus: blijft'],
  [/^LEGO Star Wars Darth Vader buste/, '', 'kinderen', 'weg', 'LEGO-buste 18+ bij kinderen'],
  [/^KONG Classic/, '', 'kinderen', 'weg', 'hondenspeelgoed bij kinderen'],
  [/(ketting|armband|sieraad).*\b(mama|moeder)\b|\b(mama|moeder)\b.*(ketting|armband)/i, 'afscheid', '', 'weg', 'Nova: mama-sieraden bij Afscheid & pensioen'],
  [/(ketting|armband|sieraad).*\b(mama|moeder)\b|\b(mama|moeder)\b.*(ketting|armband)/i, 'moederdag', '', 'goed', 'mama-sieraden bij Moederdag: blijft'],
  [/\b(opa|oma)\b.*vertel|vertel.*\b(opa|oma)\b/i, 'afscheid', '', 'weg', 'Nova: opa/oma-boek bij Afscheid & pensioen'],
  /* Goede cadeaus die moeten blijven */
  [/pensioen/i, 'afscheid', '', 'goed', 'pensioencadeaus bij Afscheid & pensioen'],
  ['kw-tonys-bedankt-15', 'bedankt', 'collega', 'goed', "Tony's 'Je wordt bedankt' bij Bedankje voor collega"],
  ['cl-merci-bedankt', 'bedankt', 'collega', 'goed', 'Merci bij Bedankje voor collega'],
  ['bp-zaden-bedankt', 'bedankt', 'collega', 'goed', 'bedankt-zaadjes bij Bedankje voor collega'],
  ['cl-lindt-pralines', 'bedankt', 'collega', 'goed', 'Lindt pralines bij Bedankje voor collega'],
  [/^Atelier Rebul.*handcr/i, 'bedankt', 'collega', 'goed', 'Atelier Rebul handcrème bij Bedankje voor collega'],
  [/HEMA herenpyjama/i, '', 'hem', 'goed', 'HEMA-pyjama (verkocht) bij Voor hem'],
  [/teddy.*hoodie|hoodie.*teddy/i, '', 'haar', 'goed', 'HEMA teddy-hoodie (verkocht) bij Voor haar']
];
const uit = { tests: [], fout: [], toppen: {} };
for (const [wat, g, pe, ver, uitleg] of TESTS) {
  const l = vind(wat);
  if (!l.length) { uit.tests.push({ uitleg, ok: true, opm: 'product niet (meer) op de site' }); continue; }
  const slecht = l.filter((p) => { const s = score(p, g, pe); return ver === 'weg' ? s >= 50 : ver === 'onder' ? s >= 75 || s < 50 : s < 75; });
  /* 'goed' over een hele groep (pensioen, chocoladeletters): de meeste moeten blijven; een enkele met een andere reden mag eraf. */
  const ok = ver === 'goed' && l.length > 3 ? slecht.length <= Math.floor(l.length * 0.1) : slecht.length === 0;
  uit.tests.push({ uitleg, ok, n: l.length, slecht: slecht.slice(0, 5).map((p) => p.id + ' ' + p.titel.slice(0, 60) + ' (' + score(p, g, pe) + ')') });
  if (!ok) uit.fout.push(uitleg);
}
/* Hoeveel van de met de hand gekozen toppen (eerste 24) valt op zijn eigen pagina weg? Moet klein blijven. */
let n = 0, weg = 0, onder = 0; const wegL = [];
const P = {}; for (const p of PR) P[p.id] = p;
for (const [k, ids] of Object.entries(W.LK_TOPVAST || {})) {
  const c = KM.context(k); if (!c.g && !c.pe) continue;
  ids.slice(0, 24).forEach((id) => { const p = P[id]; if (!p) return; n++; const s = score(p, c.g, c.pe); if (s < 50) { weg++; wegL.push(k + ' ' + id + ' ' + p.titel.slice(0, 50)); } else if (s < 75) onder++; });
}
uit.toppen = { geteld: n, weg, onder, wegLijst: wegL };
if (n && weg / n > 0.03) uit.fout.push('te veel handgekozen toppers vallen weg: ' + weg + ' van ' + n);
if (RAP) fs.writeFileSync(RAP, JSON.stringify(uit, null, 1));
console.log('keurmeester: ' + uit.tests.filter((t) => t.ok).length + ' van ' + uit.tests.length + ' tests goed | handgekozen toppers (eerste 24): ' + weg + ' weg, ' + onder + ' onderaan van ' + n);
uit.tests.filter((t) => !t.ok).forEach((t) => console.log('FOUT: ' + t.uitleg + ' -> ' + (t.slecht || []).join(' ; ')));
process.exit(uit.fout.length ? 1 : 0);
