/* Prijsgeschiedenis en eerlijke deals (17-11-2026, GO Marius: 'go' op 'de laagste prijs van de laatste 30 dagen bijhouden').
   Waarom: de nachtrun neemt een prijsdaling over, maar maakte er geen korting van. Met Black Friday zakken veel prijzen echt.
   De Europese regel (Omnibus, ook de ACM): een korting mag je alleen tonen ten opzichte van de laagste prijs van de 30 dagen vóór de verlaging.

   Hoe het werkt:
   - Bij elke bouw (splits-producten.js) noteren we per product de prijs van vandaag, maar alleen als die prijs vers is
     (gecontroleerd vandaag of gisteren). Dat is een 'waarneming'. Opgeslagen als stukken [van, tot, prijs] in scripts/prijs/historie.json.
   - Een deal ontstaat als de prijs van nu lager is dan de LAAGSTE prijs die wij in de 30 dagen vóór de verlaging zagen,
     en we in die 30 dagen op minstens 15 dagen een verse prijs hadden (in het begin hebben we nog geen 30 dagen) (anders weten we het niet zeker genoeg).
   - Minstens 10% lager, hooguit 50% (meer is bijna altijd een fout in een feed), en hooguit 30 dagen na de verlaging.
   - Heeft het product al een van-prijs van de winkel zelf (feed), dan verandert er niets.
   Uit: LK_LAAG30=0 bij de bouw (er wordt dan ook niets genoteerd). */
const fs = require('fs'), path = require('path');
const BESTAND = path.join(__dirname, 'historie.json');
const DAG = 864e5, BEWAAR = 50, VENSTER = 30, MIN_DAGEN = 15, GAT = 4, MIN_KORTING = 0.10, MAX_KORTING = 0.50;

function vandaagNL() { return new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Amsterdam' }); }
function nr(d) { return Math.floor(Date.parse(d + 'T12:00:00Z') / DAG); }
function datum(n) { return new Date(n * DAG).toISOString().slice(0, 10); }

function lees() { try { return JSON.parse(fs.readFileSync(BESTAND, 'utf8')); } catch (e) { return { p: {} }; } }
function schrijf(h) {
  h._uitleg = 'Prijsgeschiedenis per product: stukken [van, tot, prijs] van dagen waarop wij een verse prijs zagen (gecontroleerd vandaag of gisteren). ' +
    'Gemaakt door scripts/prijs/historie.js bij elke bouw; de eerste weken (29-10 t/m 17-11-2026) zijn teruggehaald uit de git-geschiedenis (scripts/prijs/terug.js). ' +
    'Gebruikt om alleen een korting te tonen als de prijs lager is dan de laagste prijs van de 30 dagen ervoor.';
  const uit = { _uitleg: h._uitleg, bijgewerkt: h.bijgewerkt, p: h.p };
  fs.writeFileSync(BESTAND, JSON.stringify(uit).replace(/\],"/g, '],\n"'));
}

/* Eén waarneming: product id, dag (YYYY-MM-DD), prijs. */
function noteerEen(h, id, dag, prijs) {
  prijs = Math.round(prijs * 100) / 100;
  const r = h.p[id] || (h.p[id] = []);
  const n = nr(dag), last = r[r.length - 1];
  if (!last) { r.push([dag, dag, prijs]); return; }
  const ln = nr(last[1]);
  if (n < nr(last[0])) return; /* ouder dan wat we al hebben: overslaan */
  if (n <= ln) { /* zelfde dag opnieuw gebouwd */
    if (last[2] === prijs) return;
    if (last[0] === last[1]) { last[2] = prijs; return; }
    last[1] = datum(n - 1); r.push([dag, dag, prijs]); return;
  }
  if (last[2] === prijs && n - ln <= GAT) { last[1] = dag; return; }
  r.push([dag, dag, prijs]);
}

/* Bij de bouw: alle verse prijzen van vandaag noteren. alle = producten na plaats() (met prijs, status, gecontroleerd). */
function noteer(alle, dag) {
  dag = dag || vandaagNL();
  const h = lees(), grens = nr(dag) - 1; let n = 0;
  for (const p of alle) {
    if (p.status !== 'goedgekeurd' || !(p.prijs > 0)) continue;
    const g = p.gecontroleerd; if (!g || nr(String(g).slice(0, 10)) < grens) continue;
    noteerEen(h, p.id, dag, p.prijs); n++;
  }
  /* oud spul weg (ouder dan BEWAAR dagen) */
  const weg = nr(dag) - BEWAAR;
  for (const id of Object.keys(h.p)) { h.p[id] = h.p[id].filter((s) => nr(s[1]) >= weg); if (!h.p[id].length) delete h.p[id]; }
  h.bijgewerkt = dag; schrijf(h);
  return n;
}

/* Is de prijs van nu een echte deal? Geeft { van, sinds, dagen } of null. */
function deal(h, id, prijs, dag) {
  const r = h.p[id]; if (!r || !r.length || !(prijs > 0)) return null;
  dag = dag || vandaagNL();
  const nu = nr(dag), P = Math.round(prijs * 100) / 100;
  const last = r[r.length - 1];
  if (last[2] !== P || nu - nr(last[1]) > 2) return null; /* de prijs van nu moet vers gezien zijn */
  let k = r.length - 1;
  while (k > 0 && r[k - 1][2] === P && nr(r[k][0]) - nr(r[k - 1][1]) <= GAT) k--;
  const start = nr(r[k][0]);
  if (nu - start > VENSTER) return null;            /* een deal duurt hooguit 30 dagen */
  if (k === 0 || start - nr(r[k - 1][1]) > GAT) return null; /* we moeten de prijs vlak vóór de verlaging gezien hebben */
  const van = start - VENSTER, tot = start - 1;
  let dagen = 0, laagste = Infinity;
  for (let j = 0; j < k; j++) {
    const a = Math.max(nr(r[j][0]), van), b = Math.min(nr(r[j][1]), tot);
    if (b < a) continue;
    dagen += b - a + 1; if (r[j][2] < laagste) laagste = r[j][2];
  }
  if (dagen < MIN_DAGEN || !isFinite(laagste)) return null;
  const korting = 1 - P / laagste;
  if (korting < MIN_KORTING || korting > MAX_KORTING) return null;
  return { van: laagste, sinds: datum(start), dagen: dagen };
}

const AAN = process.env.LK_LAAG30 !== '0';
module.exports = { AAN, lees, noteer, noteerEen, deal, schrijf, vandaagNL, nr, datum };
