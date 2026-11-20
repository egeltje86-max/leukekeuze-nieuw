/* CADEAUKEURMEESTER bij de bouw (19-11-2026, opdracht Nova via Marius; GO Marius 23:18 'jij fixed alles').
   Geeft elk goedgekeurd product het veld km: per gelegenheid (g.) en ontvanger (p.) hoeveel punten eraf gaan, bijv. 'g.bedankt70,p.collega20'.
   app.js telt bij elke pagina de aftrek van zijn gelegenheid en ontvanger op: 26 of meer = staat er niet, 1 tot 25 = staat onderaan.
   De regels staan in regels.js. Wat Marius zelf voor een gelegenheid of persoon koos, houdt daar zijn plek (geen aftrek):
   - de ERBIJ-lijst gelegenheden van 13-11-2026 (blok in producten.js, per tak gekozen; tagErbij/ookInErbij/voorErbij in correcties.json);
   - paginaregels.json met_de_hand (per persoon met de hand gekozen).
   Uit: LK_KEURMEESTER=0 bij de bouw (dan geen km, alles zoals voorheen). */
'use strict';
const fs = require('fs'), path = require('path');
const KM = require('./regels.js');
const TAG_G = { geslaagd: 'geslaagd', trouwen: 'jubileum', housewarming: 'housewarming', bedankt: 'bedankt', 'juf-meester': 'juf', beterschap: 'beterschap', afscheid: 'afscheid',
  verjaardag: 'verjaardag', moederdag: 'moederdag', vaderdag: 'vaderdag', 'collega-bedankje': 'bedankt', 'collega-afscheid': 'afscheid', 'collega-lootjes': 'lootjes' };
const OOK_G = { 'cadeaus/kerst': 'kerst', 'cadeaus/sinterklaas': 'sinterklaas', 'valentijn/voor-haar': 'valentijn', 'valentijn/voor-hem': 'valentijn', 'cadeaus/grappig': 'grappig' };
const VOOR_P = { haar: 'haar', hem: 'hem', collega: 'collega', 'opa-oma': 'opa-oma', kind: 'kinderen', kinderen: 'kinderen', tiener: 'tieners', tieners: 'tieners', baby: 'baby' };
function marius(root) {
  const vrij = {}; const zet = (id, k) => { (vrij[id] = vrij[id] || {})[k] = 1; };
  try {
    const s = fs.readFileSync(path.join(root, 'assets/js/producten.js'), 'utf8');
    const a = s.indexOf('ERBIJ-lijst gelegenheden (13-11-2026)'), b = s.indexOf('einde ERBIJ-lijst gelegenheden (13-11-2026)');
    const ids = a > 0 && b > a ? (s.slice(a, b).match(/"id": "[^"]+"/g) || []).map((x) => x.slice(7, -1)) : [];
    const C = JSON.parse(fs.readFileSync(path.join(root, 'scripts/boom/correcties.json'), 'utf8'));
    for (const id of ids) {
      for (const t of (C.tagErbij || {})[id] || []) if (TAG_G[t]) zet(id, 'g.' + TAG_G[t]);
      for (const o of (C.ookInErbij || {})[id] || []) if (OOK_G[o]) zet(id, 'g.' + OOK_G[o]);
      for (const v of (C.voorErbij || {})[id] || []) if (VOOR_P[v]) zet(id, 'p.' + VOOR_P[v]);
    }
  } catch (e) { console.log('keurmeester: ERBIJ-lijst gelegenheden niet gelezen: ' + e.message); }
  try {
    const PR = JSON.parse(fs.readFileSync(path.join(root, 'scripts/boom/paginaregels.json'), 'utf8'));
    for (const [pe, ids] of Object.entries(PR.met_de_hand || {})) if (Array.isArray(ids)) for (const id of ids) zet(id, 'p.' + (VOOR_P[pe] || pe));
  } catch (e) {}
  /* 20-11-2026 (fase 2, 'bescherm alle handmatig geselecteerde producten van Marius'): rondes die Marius voor één gelegenheid of persoon
     keurde (Ronde Bedankje, Afscheid & pensioen, Babyknuffels ...) houden daar ook hun plek. Zie marius.js. */
  try { const M = require('./marius.js').lees(root); for (const [id, m] of Object.entries(M)) for (const k of m.tak) zet(id, k); } catch (e) { console.log('keurmeester: keuzes van Marius niet gelezen: ' + e.message); }
  return vrij;
}
function smalPag(root) {
  const o = {};
  try { const PR = JSON.parse(fs.readFileSync(path.join(root, 'scripts/boom/paginaregels.json'), 'utf8')); for (const k of Object.keys(PR.smal || {})) if (k[0] !== '_' && PR.smal[k].paginas) o[k] = new RegExp(PR.smal[k].paginas); } catch (e) {}
  return o;
}
function pas(alle, root) {
  const tel = { producten: 0, regels: {} };
  if (process.env.LK_KEURMEESTER === '0') { for (const p of alle) delete p.km; return tel; }
  const sp = smalPag(root), L = KM.regels(sp), vrij = marius(root);
  for (const p of alle) {
    delete p.km;
    if (p.status !== 'goedgekeurd') continue;
    const a = KM.aftrek(p, sp, L);
    const s = KM.compact(a.kort, vrij[p.id]);
    if (s) { p.km = s; tel.producten++; a.regels.forEach((r) => { tel.regels[r] = (tel.regels[r] || 0) + 1; }); }
  }
  return tel;
}
module.exports = { pas, marius, smalPag };
