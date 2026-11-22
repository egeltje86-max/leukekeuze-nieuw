/* DONKERE VERSIE (22-11-2026, voorbeeld voor Marius: 'sommige klanten willen geen lichte variant'; 'het moet een dynamische pagina worden').
   Maakt assets/css/donker.css uit de gewone stijlbestanden (stijl.css, licht.css, straat.css en de paar <style>-blokken in app.js):
   elke regel met een kleur krijgt een donkere tegenhanger onder html.donker. Zo krijgt elk onderdeel van de site vanzelf een donkere versie,
   ook wat er later bij komt (dit script draait aan het begin van elke bouw, maak-paginas.js).
   - Achtergronden: wit en ivoor worden donkere kaarten, crème wordt de donkere pagina, marineblauw wordt iets lichter marineblauw.
     Goud, rood, groen en andere echte kleuren blijven zoals ze zijn (knoppen, labels, aftellers), net als de tekst die erop staat.
   - Tekst: donker wordt licht (warm wit, grijs, licht goud); lichte tekst blijft.
   - Randen: lichte randen worden donkere of goudkleurige randen.
   - Productfoto's blijven op wit (dat zijn foto's). Kleuren die per winkel in de pagina staan (--k) worden met de hand bijgezet: scripts/donker/extra.css.
   Gebruik: node scripts/donker/maak.js   (schrijft assets/css/donker.css; geeft het aantal regels) */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..', '..');
const BRON = ['assets/css/stijl.css', 'assets/css/licht.css', 'assets/css/straat.css'];
const UIT = path.join(ROOT, 'assets/css/donker.css');

/* ---------- kleuren ---------- */
const NAMEN = { white: '#ffffff', black: '#000000', red: '#ff0000', gold: '#ffd700', silver: '#c0c0c0', gray: '#808080', grey: '#808080', navy: '#000080', orange: '#ffa500', green: '#008000', yellow: '#ffff00', blue: '#0000ff', ivory: '#fffff0', beige: '#f5f5dc', whitesmoke: '#f5f5f5' };
const KLEUR_RE = /#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)|hsla?\([^)]*\)|\b(?:white|black|red|gold|silver|gray|grey|navy|orange|green|yellow|blue|ivory|beige|whitesmoke)\b/g;
function lees(t) {
  t = t.trim().toLowerCase(); if (NAMEN[t]) t = NAMEN[t];
  let m;
  if (t[0] === '#') {
    let h = t.slice(1); if (h.length === 3 || h.length === 4) h = h.split('').map(c => c + c).join('');
    if (!/^[0-9a-f]{6}([0-9a-f]{2})?$/.test(h)) return null;
    return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16), a: h.length === 8 ? parseInt(h.slice(6), 16) / 255 : 1 };
  }
  if ((m = /^rgba?\(([^)]*)\)$/.exec(t))) {
    const d = m[1].replace(/\//g, ' ').split(/[\s,]+/).filter(Boolean); if (d.length < 3) return null;
    const v = (x, i) => /%$/.test(x) ? (i < 3 ? parseFloat(x) * 2.55 : parseFloat(x) / 100) : parseFloat(x);
    const c = { r: v(d[0], 0), g: v(d[1], 1), b: v(d[2], 2), a: d.length > 3 ? v(d[3], 3) : 1 };
    return [c.r, c.g, c.b, c.a].some(isNaN) ? null : c;
  }
  if ((m = /^hsla?\(([^)]*)\)$/.exec(t))) {
    const d = m[1].replace(/\//g, ' ').split(/[\s,]+/).filter(Boolean); if (d.length < 3) return null;
    const c = uitHsl(parseFloat(d[0]), parseFloat(d[1]) / 100, parseFloat(d[2]) / 100); c.a = d.length > 3 ? (/%$/.test(d[3]) ? parseFloat(d[3]) / 100 : parseFloat(d[3])) : 1; return c;
  }
  return null;
}
function hsl(c) {
  const r = c.r / 255, g = c.g / 255, b = c.b / 255, mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2;
  let h = 0, s = 0;
  if (mx !== mn) { const d = mx - mn; s = l > .5 ? d / (2 - mx - mn) : d / (mx + mn);
    h = mx === r ? ((g - b) / d + (g < b ? 6 : 0)) : mx === g ? ((b - r) / d + 2) : ((r - g) / d + 4); h *= 60; }
  return { h, s, l, c: mx - mn };
}
function uitHsl(h, s, l) {
  h = ((h % 360) + 360) % 360 / 360; const f = (p, q, t) => { if (t < 0) t += 1; if (t > 1) t -= 1; return t < 1 / 6 ? p + (q - p) * 6 * t : t < 1 / 2 ? q : t < 2 / 3 ? p + (q - p) * (2 / 3 - t) * 6 : p; };
  if (s === 0) return { r: l * 255, g: l * 255, b: l * 255, a: 1 };
  const q = l < .5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q;
  return { r: f(p, q, h + 1 / 3) * 255, g: f(p, q, h) * 255, b: f(p, q, h - 1 / 3) * 255, a: 1 };
}
const hex2 = (v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0');
function schrijf(c) {
  if (c.a >= .999) return '#' + hex2(c.r) + hex2(c.g) + hex2(c.b);
  return 'rgba(' + Math.round(c.r) + ',' + Math.round(c.g) + ',' + Math.round(c.b) + ',' + (+c.a.toFixed(3)) + ')';
}
const metA = (hex, a) => { const c = lees(hex); c.a = a; return c; };
/* Het donkere palet (gebaseerd op het oude donkere LeukeKeuze: stijl.css --bg #0A1020, --kaart #121B2F, goud #D9A848, tekst #F4ECDD) */
const P = { pagina: '#0D1322', kaart: '#161F33', hoger: '#1D2740', hoogst: '#26314D', marine: '#17244A', tekst: '#EEE7DA', tekst2: '#C3C8D4', tekst3: '#A3AABA', rand: '#2B3550' };

const kleurrijk = (x) => x.s >= .5 && x.c >= .2 && x.l >= .28 && x.l <= .84;          /* goud, rood, groen, licht goud: blijft */
function achtergrond(c) {
  if (c.a === 0) return c;
  const x = hsl(c);
  if (x.l <= .3 && c.a < .6) return { r: 255, g: 255, b: 255, a: Math.min(.14, c.a * .9) };   /* donkere waas (hover) wordt lichte waas */
  if (kleurrijk(x)) return c;
  let n;
  if (x.l >= .965 && x.c < .08) n = lees(P.kaart);                                /* wit en ivoor: kaart */
  else if (x.l >= .8 && x.c >= .11) n = uitHsl(x.h, .3, .17);                    /* pastel: donker getint vlak */
  else if (x.l >= .93) n = lees(P.pagina);                                         /* crème: pagina */
  else if (x.l >= .85) n = lees(P.hoger);
  else if (x.l >= .7) n = lees(P.hoogst);
  else if (x.l <= .26) n = uitHsl(x.h || 222, Math.max(x.s, .45), Math.min(.24, x.l + .1));      /* marine: iets lichter marine */
  else return c;
  n.a = c.a; return n;
}
function tekst(c) {
  if (c.a === 0) return c;
  const x = hsl(c);
  if (x.l >= .7) return c;
  let n;
  if (x.l < .2 || (x.s < .45 && x.l < .25)) n = lees(P.tekst);                  /* marine en bijna zwart: warm wit */
  else if (x.s < .3 && x.l < .5) n = x.l < .38 ? lees(P.tekst2) : lees(P.tekst3);
  else n = uitHsl(x.h, x.s > .4 ? Math.min(x.s, .75) : x.s * .6, Math.max(.62, Math.min(.86, .93 - x.l * .55)));
  n.a = c.a; return n;
}
function rand(c) {
  if (c.a === 0) return c;
  const x = hsl(c);
  if (x.l <= .3 && c.a < 1) return { r: 255, g: 255, b: 255, a: Math.min(.22, c.a * 1.1 + .02) };
  if (kleurrijk(x)) return c;
  if (x.l >= .7) { if (x.s >= .3 && x.h >= 25 && x.h <= 55) return { r: 217, g: 168, b: 72, a: .3 * c.a }; const n = lees(P.rand); n.a = c.a; return n; }
  if (x.l <= .3) { const n = uitHsl(x.h || 222, Math.max(x.s, .35), .3); n.a = c.a; return n; }
  return c;
}
function schaduw(c) {
  const x = hsl(c);
  if (x.l >= .7) { return { r: c.r, g: c.g, b: c.b, a: c.a * .22 }; }
  return { r: 0, g: 0, b: 0, a: Math.min(.6, c.a * 1.8 + .05) };
}

/* ---------- css lezen ---------- */
function zonderCommentaar(t) { return t.replace(/\/\*[\s\S]*?\*\//g, ''); }
function splitsTop(t, teken) {        /* splitst op teken, buiten haakjes en aanhalingstekens */
  const uit = []; let d = 0, q = '', b = 0;
  for (let i = 0; i < t.length; i++) { const c = t[i];
    if (q) { if (c === '\\') { i++; continue; } if (c === q) q = ''; continue; }
    if (c === '"' || c === "'") { q = c; continue; }
    if (c === '(') d++; else if (c === ')') d--; else if (c === teken && d === 0) { uit.push(t.slice(b, i)); b = i + 1; } }
  uit.push(t.slice(b)); return uit;
}
function ontleed(t) {                   /* -> [{sel, decls}] of {at, kids} */
  const uit = []; let i = 0;
  while (i < t.length) {
    const open = zoekOpen(t, i); if (open < 0) break;
    const kop = t.slice(i, open).trim(); const dicht = zoekDicht(t, open); const binnen = t.slice(open + 1, dicht);
    if (kop[0] === '@') {
      if (/^@(media|supports|layer|container)\b/.test(kop)) uit.push({ at: kop, kids: ontleed(binnen) });
    } else if (kop) uit.push({ sel: kop, decls: splitsTop(binnen, ';').map(dl => { const k = dl.indexOf(':'); if (k < 0) return null;
      let p = dl.slice(0, k).trim().toLowerCase(), v = dl.slice(k + 1).trim(), imp = false; if (/!important\s*$/i.test(v)) { imp = true; v = v.replace(/\s*!important\s*$/i, ''); }
      return p && v ? { p, v, imp } : null; }).filter(Boolean) });
    i = dicht + 1;
  }
  return uit;
}
function zoekOpen(t, i) { let q = ''; for (; i < t.length; i++) { const c = t[i]; if (q) { if (c === '\\') { i++; continue; } if (c === q) q = ''; continue; } if (c === '"' || c === "'") q = c; else if (c === '{') return i; else if (c === ';' && t.slice(0, i).lastIndexOf('{') < t.slice(0, i).lastIndexOf('}')) { /* @import e.d. */ } } return -1; }
function zoekDicht(t, open) { let d = 0, q = ''; for (let i = open; i < t.length; i++) { const c = t[i]; if (q) { if (c === '\\') { i++; continue; } if (c === q) q = ''; continue; } if (c === '"' || c === "'") q = c; else if (c === '{') d++; else if (c === '}') { d--; if (d === 0) return i; } } return t.length; }

/* De <style>-blokken in app.js (staan als tekst tussen enkele aanhalingstekens) */
function stijlUitJs(js) {
  const uit = []; let i = 0;
  while ((i = js.indexOf("'<style>'", i)) !== -1) {
    let j = i + 9, css = '';
    while (j < js.length) {
      const k = js.indexOf("'", j); if (k < 0) break; let e = k + 1, s = '';
      while (e < js.length && js[e] !== "'") { if (js[e] === '\\') { s += js[e + 1]; e += 2; continue; } s += js[e++]; }
      j = e + 1; if (s.indexOf('</style>') !== -1) { css += s.split('</style>')[0]; break; } css += s;
      if (j - i > 60000) break;
    }
    uit.push(css); i = j;
  }
  return uit.join('\n');
}

/* ---------- eigenschappen ---------- */
const ROL = (p) => {
  if (/^--/.test(p)) return null;
  if (p === 'color' || p === 'fill' || p === 'stroke' || p === '-webkit-text-fill-color' || p === 'caret-color' || p === 'text-decoration-color' || p === 'accent-color') return 'tekst';
  if (p === 'background' || p === 'background-color' || p === 'background-image') return 'bg';
  if (/^border(-(top|right|bottom|left|block|inline)(-(start|end))?)?(-color)?$/.test(p) || /^outline(-color)?$/.test(p) || p === 'column-rule' || p === 'column-rule-color') return 'rand';
  if (p === 'box-shadow' || p === 'text-shadow' || p === 'filter') return 'schaduw';
  return null;
};

/* var(--x) invullen met de vaste waarde uit :root/html/body/.sh (alleen als die eenduidig is) */
const VARS = {}, VAR_GLOBAAL = {};
function verzamelVars(lijst) {
  for (const n of lijst) {
    if (n.kids) { verzamelVars(n.kids); continue; }
    const glob = n.sel.split(',').some(s => /^\s*(:root|html|body|\.sh)\s*$/.test(s));
    for (const d of n.decls) if (/^--/.test(d.p)) {
      if (glob) VAR_GLOBAAL[d.p] = d.v;
      (VARS[d.p] = VARS[d.p] || new Set()).add(d.v);
    }
  }
}
/* Deze worden per winkel of per muntje in de pagina zelf gezet (style="--k:…"): nooit invullen */
const NIET_INVULLEN = new Set(['--k', '--kd', '--m', '--pos', '--lamp', '--lamp-gloed']);
function vulVars(v, diepte) {
  if ((diepte || 0) > 6) return v;
  return v.replace(/var\(\s*(--[\w-]+)\s*(?:,\s*([^()]*(?:\([^()]*\))?[^()]*))?\)/g, (m, naam, terug) => {
    if (NIET_INVULLEN.has(naam)) return m;
    let w = VAR_GLOBAAL[naam]; if (w == null && VARS[naam] && VARS[naam].size === 1) w = [...VARS[naam]][0];
    if (w == null) return m;
    return vulVars(w, (diepte || 0) + 1);
  });
}
const heeftKleur = (v) => { KLEUR_RE.lastIndex = 0; return KLEUR_RE.test(v); };
function zetOm(v, f) { return v.replace(KLEUR_RE, (m) => { const c = lees(m); return c ? schrijf(f(c)) : m; }); }

/* Soort achtergrond van een regel: kleur = blijft (dan ook de tekst erop), licht/donker = wordt omgezet */
function soortAchtergrond(decls) {
  let soort = 'geen';
  for (const d of decls) {
    if (ROL(d.p) !== 'bg') continue;
    if (/var\(/.test(vulVars(d.v)) && !heeftKleur(vulVars(d.v))) return 'kleur';        /* winkelkleur e.d.: onbekend, laten staan */
    const v = vulVars(d.v); KLEUR_RE.lastIndex = 0; const m = v.match(KLEUR_RE); if (!m) { if (/url\(/.test(v)) soort = soort === 'geen' ? 'beeld' : soort; continue; }
    for (const k of m) { const c = lees(k); if (!c || c.a < .3) continue; const x = hsl(c);
      if (kleurrijk(x) || (x.l > .3 && x.l < .7)) return 'kleur';
      soort = x.l <= .3 ? 'donker' : 'licht'; }
  }
  return soort;
}
function achtergrondWaarde(v) {
  if (/gradient\(/.test(v)) {   /* een verloop alleen omzetten als het helemaal licht is (een licht vlak); gekleurde of donkere verlopen blijven */
    KLEUR_RE.lastIndex = 0; const m = v.match(KLEUR_RE) || [];
    const licht = m.every(k => { const c = lees(k); if (!c) return true; if (c.a < .2) return true; const x = hsl(c); return !kleurrijk(x) && x.l >= .7; });
    if (!licht) return v;
  }
  return zetOm(v, achtergrond);
}
function schaduwWaarde(v, p) {
  if (p === 'filter' && !/drop-shadow/.test(v)) return v;
  return zetOm(v, schaduw);
}

/* Onderdelen die een tekening of een eigen kleur hebben en in het donker precies zo blijven (de gevels van Nova met hun bordjes, de muntjes met bedragen,
   de drie aftellers): hun kleuren worden ongewijzigd overgenomen, zodat de voorrang tussen de regels gelijk blijft. */
const BEHOUD = /\.gv\b(?!-)|\.gv-(bord|deur|raam|label|beeld)\b|\.sh-munt|\.aftel3|\.a3\b|\.a3-/;
function prefix(sel) {
  return splitsTop(sel, ',').map(s => {
    s = s.trim(); if (!s) return s;
    if (/^html\b/.test(s)) return s.replace(/^html/, 'html.donker');
    if (/^:root\b/.test(s)) return s.replace(/^:root/, ':root.donker');
    return 'html.donker ' + s;
  }).join(',');
}

function regels(lijst, inSprong) {
  const uit = [];
  for (const n of lijst) {
    if (n.kids) { const k = regels(n.kids, inSprong + ' '); if (k.length) uit.push(n.at + '{\n' + k.join('\n') + '\n}'); continue; }
    if (/(^|[\s,])(@|from|to|\d+%)\s*$/.test(n.sel)) continue;
    const bg = soortAchtergrond(n.decls), nieuw = [], behoud = BEHOUD.test(n.sel);
    for (const d of n.decls) {
      const rol = ROL(d.p); if (!rol) continue;
      const v0 = vulVars(d.v); if (!heeftKleur(v0) && !/var\(/.test(v0)) continue;
      let v = v0;
      if (heeftKleur(v0) && !behoud) {
        if (rol === 'bg') v = achtergrondWaarde(v0);
        else if (rol === 'tekst') v = bg === 'kleur' ? v0 : zetOm(v0, tekst);
        else if (rol === 'rand') v = zetOm(v0, rand);
        else v = schaduwWaarde(v0, d.p);
      }
      nieuw.push(d.p + ':' + v + (d.imp ? '!important' : ''));   /* ook ongewijzigde kleuren, zodat de volgorde en voorrang tussen regels blijft kloppen */
    }
    if (nieuw.length) uit.push(prefix(n.sel) + '{' + nieuw.join(';') + '}');
  }
  return uit;
}

const bomen = BRON.map(f => ontleed(zonderCommentaar(fs.readFileSync(path.join(ROOT, f), 'utf8'))));
const jsBoom = ontleed(zonderCommentaar(stijlUitJs(fs.readFileSync(path.join(ROOT, 'assets/js/app.js'), 'utf8'))));
bomen.forEach(verzamelVars);
const delen = bomen.map((b, i) => '/* ---- uit ' + BRON[i] + ' ---- */\n' + regels(b, '').join('\n'));
delen.push('/* ---- uit de <style>-blokken in app.js ---- */\n' + regels(jsBoom, '').join('\n'));
const extra = fs.readFileSync(path.join(__dirname, 'extra.css'), 'utf8');
const kop = '/* DONKERE VERSIE van LeukeKeuze, gemaakt door scripts/donker/maak.js (niet met de hand aanpassen; met de hand: scripts/donker/extra.css). */\n' +
  'html.donker{color-scheme:dark;background:' + P.pagina + '}\nhtml.donker body{background:' + P.pagina + ';color:' + P.tekst + '}\n';
fs.writeFileSync(UIT, kop + delen.join('\n') + '\n/* ---- met de hand (scripts/donker/extra.css) ---- */\n' + extra);
if (require.main === module) console.log('donker.css:', fs.statSync(UIT).size, 'bytes');
