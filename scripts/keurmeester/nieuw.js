/* CADEAUKEURMEESTER voor nieuwe producten (20-11-2026, fase 2, opdracht Nova via Marius: 'laat nieuwe producten voortaan direct beoordelen
   op productsoort, ontvanger, gelegenheid, leeftijd en geschiktheid').

   Elk nieuw product gaat door dezelfde stappen als bij de bouw (indeling, plaats, paginaregels, keurmeester) en krijgt een keuring:
   - soort: het vakje waar het komt te staan;
   - ontvanger: voor wie (label), en bij welke Voor wie-pagina's het niet komt;
   - gelegenheid: waar het bij hoort (tags, extra vakjes) en waar de keurmeester het weghaalt of lager zet;
   - leeftijd: wat de bouw eruit haalt (speelgoed zonder leeftijd = waarschuwing);
   - geschiktheid: harde fouten (een grove grap of drank met het label kind, 'voor dames' met het label hem ...) en waarschuwingen.
   Een FOUT houdt het product tegen in voegtoe.py (tenzij --toch). Waarschuwingen worden gemeld.

   Gebruik:  node scripts/keurmeester/nieuw.js <producten.json>         (nieuwe producten, zoals voegtoe.py ze maakt)
             node scripts/keurmeester/nieuw.js --gebouwd [dagen=14]      (de producten die de laatste dagen op de site kwamen)
   De bouw (splits-producten.js) schrijft hetzelfde rapport naar keurkamer/data/keuring-nieuw.json. */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..', '..');
const KM = require('./regels.js');
const NAAM_G = { bedankt: 'Bedankt', afscheid: 'Afscheid & pensioen', verjaardag: 'Verjaardag', jubileum: 'Trouwen & jubileum', housewarming: 'Housewarming', beterschap: 'Beterschap',
  geslaagd: 'Geslaagd', juf: 'Juf & meester', moederdag: 'Moederdag', vaderdag: 'Vaderdag', uitdelen: 'Uitdeelcadeautjes', kerst: 'Kerst', sinterklaas: 'Sinterklaas', valentijn: 'Valentijn',
  lootjes: 'Kleine cadeautjes & lootjes', schoen: 'Schoencadeautjes', grappig: 'Grappige cadeaus' };
const NAAM_P = { hem: 'Voor hem', haar: 'Voor haar', kinderen: 'Voor kinderen', tieners: 'Voor tieners', 'opa-oma': 'Opa & oma', collega: "Collega's", baby: 'Baby & kraam' };
const LABEL_P = { hem: 'hem', haar: 'haar', kind: 'kinderen', kinderen: 'kinderen', tiener: 'tieners', 'opa-oma': 'opa-oma', collega: 'collega', baby: 'baby' };
const TAG_G = { geslaagd: 'geslaagd', trouwen: 'jubileum', housewarming: 'housewarming', bedankt: 'bedankt', 'juf-meester': 'juf', beterschap: 'beterschap', afscheid: 'afscheid',
  verjaardag: 'verjaardag', moederdag: 'moederdag', vaderdag: 'vaderdag', uitdelen: 'uitdelen', 'collega-bedankje': 'bedankt', 'collega-afscheid': 'afscheid', 'collega-lootjes': 'lootjes' };
const OOK_G = { 'cadeaus/kerst': 'kerst', 'cadeaus/sinterklaas': 'sinterklaas', 'cadeaus/sint-onder-10': 'sinterklaas', 'cadeaus/sint-onder-15': 'sinterklaas', 'cadeaus/grappig': 'grappig',
  'cadeaus/onder-10': 'lootjes', 'cadeaus/onder-15': 'lootjes', 'cadeaus/schoencadeautjes': 'schoen', 'valentijn/voor-haar': 'valentijn', 'valentijn/voor-hem': 'valentijn' };
const PERS = (() => { try { return new RegExp(JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts/boom/paginaregels.json'), 'utf8')).sub['voor/haar/met-naam'].thema, 'i'); } catch (e) { return null; } })();
const T = (p) => p.titel || '';

/* Keuring van één product dat al door de bouwstappen ging (heeft cat/sub, afd/groep/vak, voor, tags, leeftijd, km). */
function keur(p, smalPag, L) {
  const a = KM.aftrek(p, smalPag, L).kort;
  const pe = [...new Set((p.voor || []).map((v) => LABEL_P[v]).filter(Boolean))];
  const gel = new Set();
  for (const t of p.tags || []) if (TAG_G[t]) gel.add(TAG_G[t]);
  for (const o of p.ookIn || []) if (OOK_G[o]) gel.add(OOK_G[o]);
  const uit = { id: p.id, titel: T(p), prijs: p.prijs, soort: [p.afd, p.groep, p.vak].filter(Boolean).join(' > ') || (p.cat + '/' + p.sub), ontvangers: pe.map((x) => NAAM_P[x]),
    gelegenheden: [...gel].map((g) => NAAM_G[g]), leeftijd: p.leeftijd ? p.leeftijd.join('-') + ' jaar' : '', weg: [], lager: [], fouten: [], waarschuwingen: [] };
  /* Alleen de pagina's waar het product anders zou staan: zijn eigen ontvangers, zijn eigen gelegenheden, en Verjaardag (daar staat bijna alles). */
  for (const [k, [n, regs]] of Object.entries(a)) {
    const [s0, w] = k.split('.'); const z = s0[0] === 'z', s = s0.replace(/^z/, ''); let naam;
    if (s === 'x') { const [gg, pp] = w.split('_'); if (!(gel.has(gg) || gg === 'verjaardag' || !gg) || (pp && !pe.includes(pp))) continue; naam = [NAAM_G[gg], NAAM_P[pp]].filter(Boolean).join(' voor '); }
    else { naam = s === 'g' ? NAAM_G[w] : NAAM_P[w]; if (s === 'g' ? !(gel.has(w) || w === 'verjaardag') : !pe.includes(w)) continue; }
    if (!naam || n <= 0) continue;
    (n >= 26 && !z ? uit.weg : uit.lager).push(naam + ' (' + regs.join(', ') + ')');
  }
  /* Harde fouten: past nooit bij het label dat het product heeft. */
  const kindLabel = pe.some((x) => x === 'kinderen' || x === 'baby'), tienerLabel = pe.includes('tieners');
  if ((kindLabel || tienerLabel) && KM.R.grof.test(T(p)) && !KM.R.grofZacht.test(T(p))) uit.fouten.push('grove grap of seks met het label kind of tiener');
  if (kindLabel && (KM.R.volwassen.test(T(p)) || (Array.isArray(p.leeftijd) && p.leeftijd[0] >= 16))) uit.fouten.push('voor volwassenen (16+ of 18+) met het label kind');
  if ((kindLabel || tienerLabel) && (p.drank || p.cat === 'dranken' && !/glas|karaf|opener|accessoire/i.test(p.sub || '')) && !/alcoholvrij|0[.,]0\s?%|siroop|siropen|limonade|\bsap\b|frisdrank|slush|chocolademelk|warme chocolade/i.test(T(p))) uit.fouten.push('drank met alcohol met het label kind of tiener');
  if ((kindLabel || tienerLabel) && KM.R.drinkspel.test(T(p))) uit.fouten.push('drankspel met het label kind of tiener');
  if (kindLabel && KM.R.dier.test(T(p))) uit.fouten.push('iets voor een huisdier met het label kind');
  if (pe.includes('hem') && /voor dames|\bdames(horloge|armband|ketting|parfum|tas)?\b/i.test(T(p)) && !/heren|uniseks|unisex/i.test(T(p))) uit.fouten.push("'voor dames' met het label hem");
  if (pe.includes('haar') && /voor heren|\bheren(horloge|armband|parfum)?\b/i.test(T(p)) && !/dames|uniseks|unisex/i.test(T(p))) uit.fouten.push("'voor heren' met het label haar");
  /* Ter informatie (geen fout): staat op geen Voor wie-pagina, of de bouw kent de leeftijd niet. */
  uit.info = [];
  if (!pe.length) uit.info.push('geen ontvanger: staat alleen in zijn vakje, niet op een Voor wie-pagina');
  if (kindLabel && p.cat === 'speelgoed' && !p.leeftijd) uit.info.push('speelgoed zonder bekende leeftijd');
  /* Waarschuwingen: klopt waarschijnlijk niet helemaal, even nakijken. */
  /* 20-11-2026 (Marius): geen waarschuwing meer voor roze producten bij hem: 'Kleur bepaalt niet voor wie een cadeau geschikt is.' */
  if ((p.ookIn || []).some((x) => /met-naam$/.test(x)) && PERS && !PERS.test(T(p))) uit.waarschuwingen.push("staat bij 'Met naam', maar de titel noemt geen naam, foto of eigen tekst");
  for (const g of gel) { const n = (a['g.' + g] || [0])[0]; if (n >= 26) uit.waarschuwingen.push('gekozen voor ' + NAAM_G[g] + ', maar de keurmeester haalt het daar weg (' + a['g.' + g][1].join(', ') + ')'); }
  for (const x of pe) { const n = (a['p.' + x] || [0])[0]; if (n >= 26) uit.waarschuwingen.push('label ' + NAAM_P[x] + ', maar de keurmeester haalt het daar weg (' + a['p.' + x][1].join(', ') + ')'); }
  if (p.smal) uit.info.push("tekst voor één soort persoon of moment ('" + p.smal + "'): staat alleen waar die tekst past");
  return uit;
}
/* Een lijst ruwe producten (zoals in producten.js) door dezelfde bouwstappen halen en keuren. */
function keurRuw(lijst) {
  const { deel } = require('../indeling.js'); const { plaats } = require('../boom/plaats.js');
  const alle = lijst.map((p0) => plaats(deel(Object.assign({ status: 'goedgekeurd' }, p0))));
  require('../boom/paginaregels.js').pas(alle, ROOT);
  const sp = require('./pas.js').smalPag(ROOT), L = KM.regels(sp);
  return alle.map((p) => keur(p, sp, L));
}
function rapport(alle, dagen) {
  const grens = new Date(Date.now() - (dagen || 14) * 864e5).toISOString().slice(0, 10);
  const sp = require('./pas.js').smalPag(ROOT), L = KM.regels(sp);
  const nieuw = alle.filter((p) => p.status === 'goedgekeurd' && p.sinds && p.sinds >= grens);
  const k = nieuw.map((p) => keur(p, sp, L));
  return { gemaakt: new Date().toISOString(), vanaf: grens, producten: k.length, metFout: k.filter((x) => x.fouten.length).length, metWaarschuwing: k.filter((x) => x.waarschuwingen.length).length, keuringen: k };
}
function toon(k) {
  const r = [(k.fouten.length ? 'FOUT ' : k.waarschuwingen.length ? 'LET OP ' : 'goed ') + k.id + '  ' + k.titel.slice(0, 70)];
  r.push('   soort: ' + k.soort + (k.leeftijd ? ' | leeftijd ' + k.leeftijd : '') + ' | voor: ' + (k.ontvangers.join(', ') || '-') + (k.gelegenheden.length ? ' | gelegenheid: ' + k.gelegenheden.join(', ') : ''));
  if (k.weg.length) r.push('   niet op: ' + k.weg.join('; '));
  if (k.lager.length) r.push('   lager op: ' + k.lager.join('; '));
  k.fouten.forEach((f) => r.push('   FOUT: ' + f)); k.waarschuwingen.forEach((w) => r.push('   let op: ' + w)); (k.info || []).forEach((w) => r.push('   info: ' + w));
  return r.join('\n');
}
module.exports = { keur, keurRuw, rapport, toon };
if (require.main === module) {
  const a = process.argv[2];
  if (a === '--gebouwd') {
    const w = { dispatchEvent() {}, addEventListener() {} }; w.window = w;
    new Function('window', 'document', 'Event', fs.readFileSync(path.join(ROOT, 'assets/js/producten-lean.js'), 'utf8'))(w, { createEvent() { return { initEvent() {} }; }, addEventListener() {} }, function () {});
    const r = rapport(w.LK_PRODUCTEN, +(process.argv[3] || 14));
    console.log('nieuwe producten sinds ' + r.vanaf + ': ' + r.producten + ' | met een fout: ' + r.metFout + ' | met een waarschuwing: ' + r.metWaarschuwing);
    r.keuringen.filter((k) => k.fouten.length || k.waarschuwingen.length).forEach((k) => console.log(toon(k)));
    process.exit(r.metFout ? 1 : 0);
  }
  const lijst = JSON.parse(fs.readFileSync(a, 'utf8'));
  const k = keurRuw(Array.isArray(lijst) ? lijst : Object.values(lijst));
  k.forEach((x) => console.log(toon(x)));
  if (process.argv.includes('--json')) fs.writeFileSync(process.argv[process.argv.indexOf('--json') + 1], JSON.stringify(k));
  process.exit(k.some((x) => x.fouten.length) ? 1 : 0);
}
