// EERSTE BLIK (20-11-2026, Marius: 'je moet alles in de gaten houden, ik kan geen 10.000 dingen tegelijk, jij wel').
// Leest op de drukste pagina's de eerste 24 cadeaus zoals een bezoeker ze ziet (gebouwde pagina; bij Voor wie de nieuwe opzet)
// en zet ze in een leesbaar lijstje, met vlaggen voor wat opvalt. Blokkeert niets: de piloot leest het lijstje zelf na
// en lost wat niet klopt op met een regel (CLAUDE.md §9 en §57), nooit met de hand op één pagina.
// Gebruik: node scripts/controle/eerste-blik.js <repo> <uitmap>   -> <uitmap>/eerste-blik.txt en eerste-blik.json
const fs = require('fs'), path = require('path'), vm = require('vm');
const R = path.resolve(process.argv[2] || '.'), UIT = path.resolve(process.argv[3] || 'keurkamer/data');
const ctx = { window: { dispatchEvent() {}, addEventListener() {} }, document: { createEvent() { return { initEvent() {} }; }, addEventListener() {} }, Event: function () {} };
ctx.window.window = ctx.window; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(R, 'assets/js/producten-lean.js'), 'utf8'), ctx);
const P = {}; (ctx.window.LK_PRODUCTEN || []).forEach((p) => { P[p.id] = p; });

const PAGINAS = [
  'voor/hem', 'voor/haar', 'voor/kinderen', 'voor/tieners', 'voor/collega', 'voor/opa-oma', 'voor/baby',
  'c/cadeaus/sinterklaas', 'c/cadeaus/kerst', 'c/cadeaus/onder-15', 'collectie/schoencadeautjes', 'collectie/op-tijd-voor-pakjesavond',
  'collectie/black-friday', 'collectie/grappige-cadeaus', 'collectie/toppers-van-nu', 'collectie/kleine-cadeautjes',
  'collectie/originele-cadeaus', 'collectie/persoonlijke-cadeaus', 'gelegenheid/verjaardag', 'gelegenheid/bedankt', 'gelegenheid/afscheid-pensioen'
];
const GROF = /f[u*]ck|\bkut\b|lekker pik|pleur op|sexy as hell|ben je dronken|piemel|borstmok|\bbitch(es)?\b|middelvinger|shit happens|bullshit|\bjoint\b/i;
const GROF_OK = /grappige-cadeaus$/;
const BUDGET = { 'c/cadeaus/onder-15': 15, 'collectie/schoencadeautjes': 10, 'collectie/kleine-cadeautjes': 25 };
const KIND = /voor\/(kinderen|baby)$|schoencadeautjes$/;

function eerste(html, n) {
  // Voor wie: de nieuwe opzet (template app-b) is wat bezoekers zien; anders de eerste lijst op de pagina.
  const t = html.indexOf('<template id="app-b">');
  let stuk = html;
  if (t >= 0) { const e = html.indexOf('</template>', t); const b = html.slice(t, e > t ? e : undefined); if (b.includes('class="prodkaart')) stuk = b; }
  const ids = [];
  const re = /<article class="prodkaart[^"]*">[\s\S]*?<a href="\/p\/([^/"]+)\/"/g;
  let m; while ((m = re.exec(stuk)) && ids.length < n) if (!ids.includes(m[1])) ids.push(m[1]);
  return ids;
}
const sleutel = (t) => String(t || '').toLowerCase().replace(/[^a-z0-9à-ÿ ]/g, ' ').split(/\s+/).filter((w) => w.length > 2).slice(0, 3).join(' ');

const uit = { gemaakt: new Date().toISOString(), paginas: {}, vlaggen: 0 };
const regels = ['EERSTE BLIK: de eerste 24 cadeaus op de drukste pagina\'s (' + uit.gemaakt.slice(0, 16) + ' UTC).', 'Lees de titels zelf na: hoort dit hier, is het leuk genoeg, staat er niets vreemds tussen?', ''];
for (const pad of PAGINAS) {
  const f = path.join(R, pad, 'index.html');
  if (!fs.existsSync(f)) { regels.push('## /' + pad + '/  (pagina niet gevonden)', ''); uit.paginas[pad] = { mist: true }; uit.vlaggen++; continue; }
  const ids = eerste(fs.readFileSync(f, 'utf8'), 24);
  const vl = [], perWinkel = {}, perVak = {}, perSleutel = {};
  regels.push('## /' + pad + '/');
  ids.forEach((id, i) => {
    const p = P[id];
    if (!p) { vl.push((i + 1) + ': ' + id + ' staat niet in de productlijst'); regels.push(String(i + 1).padStart(2) + '. ?? ' + id); return; }
    const st = p.status && p.status !== 'goedgekeurd' ? ' [' + p.status.toUpperCase() + ']' : '';
    regels.push(String(i + 1).padStart(2) + '. ' + p.titel + ' — € ' + (p.prijs != null ? Number(p.prijs).toFixed(2).replace('.', ',') : '?') + ' — ' + (p.shop || '?') + ' [' + [p.afd, p.groep, p.vak].filter(Boolean).join('/') + ']' + st);
    if (st) vl.push((i + 1) + ': ' + p.titel + ' heeft status ' + p.status);
    if (!(p.prijs > 0)) vl.push((i + 1) + ': ' + p.titel + ' heeft geen prijs');
    if (p.drank && !/drank|wijn|bier/.test(pad)) vl.push((i + 1) + ': drank (' + p.titel + ') op een pagina zonder drank');
    if (GROF.test(p.titel || '') && !GROF_OK.test(pad)) vl.push((i + 1) + ': grove grap (' + p.titel + ')');
    if (BUDGET[pad] && p.prijs > BUDGET[pad]) vl.push((i + 1) + ': ' + p.titel + ' kost € ' + p.prijs + ', boven het bedrag van de pagina');
    if (KIND.test(pad) && /volwassen|18\+/i.test(p.titel || '')) vl.push((i + 1) + ': ' + p.titel + ' lijkt voor volwassenen');
    perWinkel[p.shop] = (perWinkel[p.shop] || 0) + 1;
    const v = [p.afd, p.groep, p.vak].join('/'); perVak[v] = (perVak[v] || 0) + 1;
    const s = sleutel(p.titel); if (s) (perSleutel[s] = perSleutel[s] || []).push(i + 1);
  });
  if (ids.length < 12) vl.push('maar ' + ids.length + ' cadeaus gevonden in de eerste lijst');
  Object.entries(perWinkel).forEach(([w, n]) => { if (n > 8) vl.push(n + ' van de 24 komen van ' + w); });
  Object.entries(perVak).forEach(([w, n]) => { if (n > 6) vl.push(n + ' van de 24 uit hetzelfde vakje (' + w + ')'); });
  Object.entries(perSleutel).forEach(([w, n]) => { if (n.length > 1) vl.push('bijna dezelfde naam op plek ' + n.join(' en ') + ' ("' + w + '…")'); });
  vl.forEach((x) => regels.push('   ! ' + x));
  regels.push('');
  uit.paginas[pad] = { ids, vlaggen: vl };
  uit.vlaggen += vl.length;
}
regels.splice(2, 0, 'Vlaggen in totaal: ' + uit.vlaggen + ' (een vlag is een vraag, geen fout: kijk zelf).');
fs.mkdirSync(UIT, { recursive: true });
fs.writeFileSync(path.join(UIT, 'eerste-blik.txt'), regels.join('\n') + '\n');
fs.writeFileSync(path.join(UIT, 'eerste-blik.json'), JSON.stringify(uit, null, 1));
console.log('eerste blik: ' + PAGINAS.length + ' pagina\'s, ' + uit.vlaggen + ' vlaggen -> ' + path.join(UIT, 'eerste-blik.txt'));
