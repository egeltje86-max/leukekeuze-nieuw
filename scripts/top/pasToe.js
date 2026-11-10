// zet picks.json als window.LK_TOPVAST in assets/js/topkeuze.js (vervangt een eerder blok)
const fs = require('fs'); const f = require('path').resolve(__dirname, '../../assets/js/topkeuze.js');
const P = JSON.parse(fs.readFileSync(__dirname + '/picks.json'));
let s = fs.readFileSync(f, 'utf8'); const i = s.indexOf('\n/* VASTE TOP');
if (i !== -1) s = s.slice(0, i);
s = s.replace(/\s+$/, '') + '\n/* VASTE TOP (10-11-2026, opdracht Marius: de eerste indruk moet kloppen). Per pagina stuk voor stuk nagekeken en in volgorde gezet:\n   verrassing, bekend merk, goedkope ja, duurder pronkstuk, persoonlijk of grappig, topper - en dat steeds opnieuw. app.js (bovenaan) laat deze top precies zo staan. */\nwindow.LK_TOPVAST = ' + JSON.stringify(P) + ';\n';
fs.writeFileSync(f, s); console.log('vaste top voor', Object.keys(P).length, "pagina's");
