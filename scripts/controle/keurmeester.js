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
/* Zelfde rekensom als app.js: gewone aftrek (g., p.) kan een cadeau weghalen; zachte aftrek (zg., zp.) zet het hooguit lager (nooit onder 50). */
const km = (p) => { const o = {}; String(p.km || '').split(',').forEach((x) => { const m = /^(z?[gpx]\.[a-z_-]+?)(-?\d+)$/.exec(x); if (m) o[m[1]] = +m[2]; }); return o; };
const aftrek = (p, g, pe) => { const o = km(p); return (g ? o['g.' + g] || 0 : 0) + (pe ? o['p.' + pe] || 0 : 0); };
const zacht = (p, g, pe) => { const o = km(p); return (g ? o['zg.' + g] || 0 : 0) + (pe ? o['zp.' + pe] || 0 : 0) + (o['zx.' + (g || '') + '_' + (pe || '')] || 0); };
const score = (p, g, pe) => { const h = aftrek(p, g, pe), z = zacht(p, g, pe); let s = 75 - h - (z > 0 ? Math.min(z, 10) : 0); if (h < 26) s = Math.max(s, 50); return Math.min(75, s); };
const vind = (w) => typeof w === 'string' && /^[a-z]+-[\w-]+$/.test(w) ? PR.filter((p) => p.id === w) : PR.filter((p) => w.test(p.titel || ''));
/* [wat, gelegenheid, ontvanger, verwachting, uitleg]. Verwachting: 'weg' (<50), 'onder' (<75), 'goed' (>=75), 'blijft' (>=50: op de pagina, hoog of laag). */
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
  [/teddy.*hoodie|hoodie.*teddy/i, '', 'haar', 'goed', 'HEMA teddy-hoodie (verkocht) bij Voor haar'],
  /* Fase 2 (20-11-2026): onterecht weggehaald in fase 1 */
  [/^Leatherman Skeletool/, '', 'opa-oma', 'goed', "Leatherman Skeletool bij opa en oma (was 'skelet')"],
  [/Santa Montefiore/, 'moederdag', '', 'goed', "roman van Santa Montefiore bij Moederdag (was 'Santa' = kerst)"],
  [/^Olijfolie in drie smaken/, 'bedankt', 'collega', 'goed', 'olijfolie in drie smaken (een pakketje) bij Bedankje voor collega'],
  [/^Foute kersttrui .*skelet/i, 'kerst', 'collega', 'onder', 'foute kersttrui met skelet bij Kerst voor collega: mag, niet vooraan'],
  /* Fase 2: keuzes van Marius voor één tak blijven daar staan */
  [/^F\*ck it list book voor collega/, 'afscheid', 'collega', 'goed', "F*ck it list (Marius keurde hem voor Afscheid & pensioen)"],
  ['kw-tonys-bedankt-15', 'bedankt', 'collega', 'goed', "Tony's Bedankt 15 repen (Marius keurde hem voor Bedankje)"],
  [/^Atelier Rebul handcr/i, 'juf', 'haar', 'goed', 'Atelier Rebul handcrème bij Juf & meester (merk dat Marius vooraan wil)'],
  ['dvzn-c15dcffb40', '', 'collega', 'goed', 'tegeltje koffie/bier (verkocht) bij Collega’s'],
  /* Fase 2: Nova's twijfels = een paar rijen lager, niet weg */
  ['cg-chocolade-game-controller', 'bedankt', 'hem', 'onder', 'Nova: gamecontroller van chocolade bij Bedankt voor hem: lager'],
  ['cl-dk-scrub', 'juf', '', 'onder', 'Nova: bodyscrub bij Juf & meester: lager'],
  ['cg-47d4498cf1', 'bedankt', '', 'goed', 'bedankt-mok voor mama bij Bedankt: Marius koos hem zelf voor Bedankt (Nova twijfelde)'],
  ['cg-df3ffeabd6', 'bedankt', 'opa-oma', 'goed', 'bedankt-mok voor opa en oma bij Bedankt voor opa en oma: gewoon'],
  ['dw-5011053021671', 'beterschap', 'kinderen', 'onder', 'Nova: 24 lolly-ringen bij Beterschap voor kinderen: lager'],
  ['dvzn-5beb611cdc', 'jubileum', 'opa-oma', 'onder', "Nova: tegeltje '25 jaar getrouwd' bij Jubileum: lager"],
  ['massa-d13af0c18e', 'verjaardag', 'hem', 'goed', "mok 'Abraham' bij Verjaardag: Marius koos hem zelf voor Verjaardag (Nova twijfelde)"],
  ['dvzn-70adc8c50c', '', 'haar', 'onder', "Nova: cadeauset 'I Love You' bij Voor haar: lager"],
  ['dvzn-70adc8c50c', 'valentijn', 'haar', 'goed', "cadeauset 'I Love You' bij Valentijn: gewoon"],
  ['country-9458043fd0', 'housewarming', 'hem', 'goed', "tegeltje 'Mr & Mrs' bij Housewarming: Marius koos hem zelf voor Housewarming (Nova twijfelde)"],
  ['dvzn-70adc8c50c', 'jubileum', 'haar', 'goed', "cadeauset 'I Love You' bij Jubileum: gewoon"],
  ['cg-chocolade-game-controller', 'bedankt', 'tieners', 'goed', 'gamecontroller van chocolade bij Bedankt voor tieners: gewoon (Nova: goed)'],
  ['dw-6931722318439', 'grappig', 'kinderen', 'goed', 'snoep-gokkastjes bij Grappige cadeaus voor kinderen: gewoon (Nova: goed)'],
  ['cl-ttr-europe', 'lootjes', 'hem', 'onder', 'Nova: Ticket to Ride (45 euro) bij de lootjes: lager (Kleine cadeautjes gaat sinds 20-11 tot 25 euro, daar staat hij niet meer)'],
  /* 20-11-2026, keuzes van Marius */
  ['cl-uno', 'uitdelen', '', 'weg', "Marius: geen losse bord- en kaartspellen bij Uitdeelcadeautjes (UNO)"],
  [/^HEMA partyspel Zeg geen Uhm/, 'uitdelen', '', 'weg', 'Marius: los partyspel niet bij Uitdeelcadeautjes'],
  [/^Tiny Tins: Vlotte Geesten/, 'uitdelen', '', 'weg', 'Marius: spel in een blikje niet bij Uitdeelcadeautjes'],
  ['cl-uno', 'sinterklaas', '', 'goed', 'UNO bij Sinterklaas: blijft'],
  [/^Pokémon TCG .*boosterpakje/, 'uitdelen', '', 'blijft', 'Pokémon-boosterpakjes (verzamelkaarten, geen spel) bij Uitdeelcadeautjes: blijven op de pagina'],
  ['bol-9300000338745858', '', 'tieners', 'onder', 'Marius: Verity (17+) bij tieners alleen onderaan, voor oudere tieners'],
  ['bol-9300000338745858', '', 'haar', 'goed', 'Verity bij Voor haar: gewoon'],
  ['cl-hof-versplinterde', '', 'tieners', 'onder', 'Marius: Hof van versplinterde harmonieën (16+) bij tieners alleen onderaan'],
  ['cl-hof-versplinterde', '', 'kinderen', 'weg', 'roman met expliciete scènes nooit bij kinderen']
];
const uit = { tests: [], fout: [], toppen: {} };
for (const [wat, g, pe, ver, uitleg] of TESTS) {
  const l = vind(wat);
  if (!l.length) { uit.tests.push({ uitleg, ok: true, opm: 'product niet (meer) op de site' }); continue; }
  const slecht = l.filter((p) => { const s = score(p, g, pe); return ver === 'weg' ? s >= 50 : ver === 'onder' ? s >= 75 || s < 50 : ver === 'blijft' ? s < 50 : s < 75; });
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
/* Fase 2 (20-11-2026): keuzes van Marius voor één gelegenheid of persoon (marius.js) krijgen daar nooit aftrek; Atelier Rebul en verkochte producten
   nooit aftrek van de zachte regels. */
try {
  const M = require(path.join(R, 'scripts/keurmeester/marius.js')).lees(R); const fout = [];
  for (const [id, m] of Object.entries(M)) { const p = P[id]; if (!p || !p.km || !m.tak.length) continue; const o = {}; String(p.km).split(',').forEach((x) => { const mm = /^(z?[gpx]\.[a-z_-]+?)(-?\d+)$/.exec(x); if (mm) o[mm[1]] = +mm[2]; });
    for (const k of m.tak) if (o[k] > 0 || o['z' + k] > 0) fout.push(id + ' ' + k + ' ' + p.titel.slice(0, 40)); }
  uit.marius = { metTak: Object.values(M).filter((m) => m.tak.length).length, aftrekOpEigenTak: fout };
  if (fout.length) uit.fout.push('keuzes van Marius krijgen aftrek op hun eigen gelegenheid: ' + fout.slice(0, 5).join('; '));
  const kn = JSON.parse(fs.readFileSync(path.join(R, 'keurkamer/data/keuring-nieuw.json'), 'utf8')); uit.nieuw = { producten: kn.producten, metFout: kn.metFout, metWaarschuwing: kn.metWaarschuwing };
  if (kn.metFout) uit.fout.push('nieuwe producten met een fout in de keuring: ' + kn.keuringen.filter((k) => k.fouten.length).map((k) => k.id + ' (' + k.fouten.join(', ') + ')').slice(0, 5).join('; '));
} catch (e) { uit.marius = { fout: e.message }; }
if (n && weg / n > 0.03) uit.fout.push('te veel handgekozen toppers vallen weg: ' + weg + ' van ' + n);
if (RAP) fs.writeFileSync(RAP, JSON.stringify(uit, null, 1));
console.log('keurmeester: ' + uit.tests.filter((t) => t.ok).length + ' van ' + uit.tests.length + ' tests goed | handgekozen toppers (eerste 24): ' + weg + ' weg, ' + onder + ' lager van ' + n + ' | keuzes van Marius met eigen tak: ' + ((uit.marius || {}).metTak || 0) + ', aftrek daar: ' + (((uit.marius || {}).aftrekOpEigenTak || []).length) + ' | nieuwe producten: ' + ((uit.nieuw || {}).producten || 0) + ', met fout: ' + ((uit.nieuw || {}).metFout || 0));
uit.fout.filter((f) => !/^Nova|^grafsteen/.test(f) && !uit.tests.some((t) => t.uitleg === f)).forEach((f) => console.log('FOUT: ' + f));
uit.tests.filter((t) => !t.ok).forEach((t) => console.log('FOUT: ' + t.uitleg + ' -> ' + (t.slecht || []).join(' ; ')));
process.exit(uit.fout.length ? 1 : 0);
