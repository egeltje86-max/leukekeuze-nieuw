// Paginacontrole (10-11-2026, opdracht Marius): staat er op een Voor wie-onderwerp, gelegenheid of collectie een product dat er niet hoort?
// Zelfde regels als scripts/boom/paginaregels.js (paginaregels.json). Gebruik: node scripts/controle/paginas.js <repo> [rapport.json] -> exit 1 bij fouten.
const fs = require('fs'), path = require('path');
const R = path.resolve(process.argv[2] || '.'); const UIT = process.argv[3];
global.window = { dispatchEvent() {} }; global.Event = function () {};
require(path.join(R, 'assets/js/data.js')); require(path.join(R, 'assets/js/producten-lean.js'));
const PR = require(path.join(R, 'scripts/boom/paginaregels.js'));
const P = window.LK_PRODUCTEN.filter(p => p.status === 'goedgekeurd');
const fouten = [];
const thema = {}; for (const k of Object.keys(PR.REGELS.sub)) thema[k] = new RegExp(PR.REGELS.sub[k].thema || '$^', 'i');
// 1. Voor wie-onderwerpen: alles wat de site daar laat zien moet aan de regel voldoen
for (const pe of window.LK_PERSONEN) for (const s of pe.subs || []) {
  const k = 'voor/' + pe.slug + '/' + s.slug; const regel = PR.REGELS.sub[k];
  const lijst = P.filter(p => p.cat !== 'christelijk' && !p.los && PR.vanPersoon(p, pe) && PR.past(PR.plekkenVan(p), s.vakken) && !(p.nietOp && p.nietOp.indexOf(k) !== -1));
  if (regel) lijst.forEach(p => { if (!PR.magOp(p, regel, thema[k])) fouten.push({ wat: 'hoort niet op ' + k, id: p.id, titel: p.titel, vak: p.afd + '/' + p.vak }); });
}
// 2. Doelgroep en vakje botsen (herenparfum bij 'voor haar', games bij opa en oma ...)
for (const p of P) for (const l of Object.keys(PR.REGELS.label_vak_niet)) {
  const r = PR.REGELS.label_vak_niet[l];
  if ((p.voor || []).indexOf(l) !== -1 && r.vakken.indexOf(PR.oud(p).vak) !== -1 && !(r.behalve && new RegExp(r.behalve, 'i').test(p.titel))) fouten.push({ wat: 'vakje past niet bij ' + l, id: p.id, titel: p.titel, vak: p.afd + '/' + p.vak });
}
for (const p of P) for (const l of Object.keys(PR.REGELS.label_titel_niet || {})) {
  const r = PR.REGELS.label_titel_niet[l];
  if ((p.voor || []).indexOf(l) !== -1 && r.afd.indexOf(PR.oud(p).afd) !== -1 && new RegExp(r.woorden, 'i').test(p.titel) && !new RegExp(r.behalve, 'i').test(p.titel)) fouten.push({ wat: 'titel past niet bij ' + l, id: p.id, titel: p.titel, vak: p.afd + '/' + p.vak });
}
// 2b. Smal (tekst voor één soort persoon): moet gemerkt zijn, en app.js moet elke soort kennen
{ const S = PR.REGELS.smal || {}; const app = fs.readFileSync(path.join(R, 'assets/js/app.js'), 'utf8');
  for (const k of Object.keys(S)) { if (k[0] === '_') continue;
    if (app.indexOf(k + ': [') === -1) fouten.push({ wat: 'smal-soort ' + k + ' ontbreekt in app.js (SMAL_PAG)', id: '-', titel: k, vak: '-' });
    const w = new RegExp(S[k].woorden, 'i'), b = S[k].behalve ? new RegExp(S[k].behalve, 'i') : null;
    for (const p of P) if (p.cat !== 'christelijk' && !p.smal && w.test(p.titel) && !(b && b.test(p.titel)) && !(S[k].nietAfd && S[k].nietAfd.indexOf(PR.oud(p).afd) !== -1)) fouten.push({ wat: 'smal cadeau niet gemerkt (' + k + ')', id: p.id, titel: p.titel, vak: p.afd + '/' + p.vak });
  }
  for (const pe of window.LK_PERSONEN) for (const p of P) if (p.smal && p.cat !== 'christelijk' && !p.los && PR.vanPersoon(p, pe) && !PR.smalMagBij(p, pe.slug) && app.indexOf('!smalBij(p, pe.slug)') === -1) fouten.push({ wat: 'smal cadeau op Voor ' + pe.slug, id: p.id, titel: p.titel, vak: p.afd + '/' + p.vak });
}
// 3. Losse onderdelen moeten gemerkt zijn (dan toont de site ze niet op cadeaupagina's)
const LOS = new RegExp(PR.REGELS.los, 'i');
for (const p of P) if (LOS.test(p.titel) && !/\bmet losse\b|voor losse/i.test(p.titel) && !p.los) fouten.push({ wat: 'los onderdeel niet gemerkt', id: p.id, titel: p.titel, vak: p.afd + '/' + p.vak });
const rap = { datum: new Date().toISOString().slice(0, 10), fouten: fouten.length, vanOnderwerpAf: P.reduce((n, p) => n + (p.nietOp ? p.nietOp.length : 0), 0), los: P.filter(p => p.los).length, lijst: fouten.slice(0, 200) };
if (UIT) fs.writeFileSync(UIT, JSON.stringify(rap, null, 1));
const per = {}; fouten.forEach(f => { per[f.wat] = (per[f.wat] || 0) + 1; });
console.log('paginas: fouten', fouten.length, '| van een onderwerp af gehaald:', rap.vanOnderwerpAf, '| losse onderdelen:', rap.los, JSON.stringify(per).slice(0, 600));
fouten.slice(0, 40).forEach(f => console.log(' ', f.wat, '|', f.id, '|', f.titel.slice(0, 60), '|', f.vak));
process.exit(fouten.length ? 1 : 0);
