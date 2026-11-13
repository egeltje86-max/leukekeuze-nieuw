// zet picks.json als window.LK_TOPVAST in assets/js/topkeuze.js (vervangt een eerder blok)
const fs = require('fs'); const f = require('path').resolve(__dirname, '../../assets/js/topkeuze.js');
const P = JSON.parse(fs.readFileSync(__dirname + '/picks.json'));
/* 12-11-2026 (GO Marius: 'laat bol verschuiven'): in elke vaste top schuift een cadeau van bol drie plekken naar achteren.
   De volgorde die met de hand is gekozen blijft verder gelijk, en er gaat niets weg. picks.json zelf verandert niet;
   zet BOL_LATER op 0 om terug te gaan naar de oude volgorde. */
const BOL_LATER = 3;
if (BOL_LATER) {
  const w = { dispatchEvent() {} }; global.Event = function () {};
  new Function('window', 'document', fs.readFileSync(require('path').resolve(__dirname, '../../assets/js/producten-lean.js'), 'utf8'))(w, { createEvent: () => ({ initEvent() {} }) });
  const winkel = {}; for (const p of w.LK_PRODUCTEN) winkel[p.id] = p.shop || 'bol';
  let n = 0;
  for (const k of Object.keys(P)) {
    if (!Array.isArray(P[k]) || k.indexOf('/winkel/') === 0) continue;
    const oud = P[k].join();
    /* 13-11-2026 (grote keuring): La Redoute staat niet meer in een vaste top. De cloud kan die winkel niet nakijken (403), dus de prijs
       wordt nooit ververst en staat als 'ca.' op de productpagina. De cadeaus blijven op de pagina staan (verderop, in de gemixte rest);
       er gaat niets weg en in picks.json blijft de volgorde staan. */
    P[k] = P[k].filter((id) => winkel[id] !== 'La Redoute').map((id, i) => [id, i + (winkel[id] === 'bol' ? BOL_LATER + 0.5 : 0)]).sort((x, y) => x[1] - y[1]).map((x) => x[0]);
    if (P[k].join() !== oud) n++;
  }
  console.log('bol drie plekken later in', n, "vaste toppen");
}
let s = fs.readFileSync(f, 'utf8'); const i = s.indexOf('\n/* VASTE TOP');
if (i !== -1) s = s.slice(0, i);
s = s.replace(/\s+$/, '') + '\n/* VASTE TOP (10-11-2026, opdracht Marius: de eerste indruk moet kloppen). Per pagina stuk voor stuk nagekeken en in volgorde gezet:\n   verrassing, bekend merk, goedkope ja, duurder pronkstuk, persoonlijk of grappig, topper - en dat steeds opnieuw. app.js (bovenaan) laat deze top precies zo staan. */\nwindow.LK_TOPVAST = ' + JSON.stringify(P) + ';\n';
fs.writeFileSync(f, s); console.log('vaste top voor', Object.keys(P).length, "pagina's");
