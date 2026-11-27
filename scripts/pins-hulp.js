/* Pins voor de gratis hulpjes (27-11-2026, onderzoek OpenSEO: bij 'dobbelspel sinterklaas', 'dobbelspel kerst' en 'dobbelspel cadeautjes'
   staat Pinterest op pagina 1 van Google; mensen bewaren spelregels als pin).
   Maakt pins/img/hulp-*.jpg (1000x1500, huisstijl) en zet de pins vooraan in pins/wachtrij.json, als ze nog niet in de wachtrij of in geplaatst.json staan.
   Gebruik: node scripts/controle/keuring/server.js . 8765 &   dan   node scripts/pins-hulp.js [--opnieuw] [--bron http://localhost:8765]
   De woordzoeker en de Secret Santa-foto's komen van de echte pagina's (lokale server), zodat de pin laat zien wat je op de site krijgt. */
const fs = require('fs'), path = require('path'); const { chromium } = require('playwright');
const ROOT = path.resolve(__dirname, '..'); const opnieuw = process.argv.includes('--opnieuw');
const bi = process.argv.indexOf('--bron'); const BRON = bi > 0 ? process.argv[bi + 1] : 'http://localhost:8765';
const f = n => 'data:font/woff2;base64,' + fs.readFileSync(path.join(ROOT, 'assets/fonts', n)).toString('base64');
const logo = 'data:image/svg+xml;base64,' + fs.readFileSync(path.join(ROOT, 'assets/logo-icoon.svg')).toString('base64');
const esc = t => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const fotoVan = id => { const p = path.join(ROOT, 'images/producten', id + '.webp'); return fs.existsSync(p) ? 'data:image/webp;base64,' + fs.readFileSync(p).toString('base64') : ''; };

/* Teksten zoals ze op de site staan (DBS_SOORT in app.js, lootjes, rijmmachine) */
const SINT = ['Geef één van je cadeautjes aan de speler links van je.', 'Geef één van je cadeautjes aan de speler rechts van je.', 'Ruil een cadeautje met wie je maar wilt.',
  'Pak een cadeautje van iemand anders.', 'Iedereen geeft al zijn cadeautjes door naar links.', 'Zing een stukje van een Sinterklaasliedje en pak daarna een cadeautje van iemand anders.'];
const KERST = ['Geef één van je cadeautjes aan de speler links van je.', 'Geef één van je cadeautjes aan de speler rechts van je.', 'Ruil een cadeautje met wie je maar wilt.',
  'Pak een cadeautje van iemand anders.', 'Iedereen geeft al zijn cadeautjes door naar rechts.', 'Wens iemand een vrolijk kerstfeest en ruil daarna een cadeautje met diegene.'];
const KIND = ['Geef één van je cadeautjes aan de speler links van je.', 'Geef één van je cadeautjes aan de speler rechts van je.', 'Ruil een cadeautje met wie je maar wilt.',
  'Iedereen geeft één cadeautje door naar links.', 'Doe een gek dansje. Daarna is de volgende aan de beurt.', 'Pak een cadeautje van iemand die er meer heeft dan jij.'];

const PINS = [
  { id: 'hulp-dobbelspel-sint', bord: 'sinterklaas', soort: 'regels', label: 'Gratis spelregels', kop: 'Sinterklaas dobbelspel: de spelregels',
    r1: 'Gooi je een 6? Pak een cadeautje van de stapel in het midden.', r2: SINT, link: 'https://leukekeuze.nl/dobbelspel/#sint', voet: 'Online dobbelsteen + wekker: leukekeuze.nl/dobbelspel',
    tekst: 'De spelregels van het Sinterklaas dobbelspel met cadeautjes, in twee rondes. Op leukekeuze.nl/dobbelspel staat een gratis online dobbelsteen die de opdracht zegt, een wekker en de regels om te printen.' },
  { id: 'hulp-dobbelspel-kerst', bord: 'kerst', soort: 'regels', label: 'Gratis spelregels', kop: 'Kerst dobbelspel: de spelregels',
    r1: 'Gooi je een 6? Pak een cadeautje van de stapel onder de boom.', r2: KERST, link: 'https://leukekeuze.nl/dobbelspel/#kerst', voet: 'Online dobbelsteen + wekker: leukekeuze.nl/dobbelspel',
    tekst: 'De spelregels van het kerst dobbelspel met cadeautjes, in twee rondes. Op leukekeuze.nl/dobbelspel staat een gratis online dobbelsteen die de opdracht zegt, een wekker en de regels om te printen.' },
  { id: 'hulp-dobbelspel-kind', bord: 'sinterklaas', soort: 'regels', label: 'Gratis spelregels', kop: 'Dobbelspel met kinderen: de spelregels',
    r1: 'Gooi je een 1 of een 6? Pak een cadeautje van de stapel.', r2: KIND, link: 'https://leukekeuze.nl/dobbelspel/#kind', voet: 'Online dobbelsteen + wekker: leukekeuze.nl/dobbelspel',
    tekst: 'Het dobbelspel met cadeautjes in een versie voor kinderen: vaker prijs en een gek dansje. Gratis online dobbelsteen, wekker en spelregels om te printen op leukekeuze.nl/dobbelspel.' },
  { id: 'hulp-lootjes', bord: 'sinterklaas', soort: 'stappen', label: 'Gratis · zonder account · via WhatsApp', kop: 'Lootjes trekken online in 1 minuut',
    stappen: ['Vul de namen in en kies het budget.', 'Deel één linkje in de groepsapp.', 'Iedereen tikt op zijn eigen naam en ziet alleen zijn eigen lootje.', 'Met een verlanglijstje en cadeautips binnen het budget.'],
    link: 'https://leukekeuze.nl/lootjes-trekken/', voet: 'leukekeuze.nl/lootjes-trekken',
    tekst: 'Lootjes trekken voor Sinterklaas, kerst of Secret Santa: gratis, zonder account en via WhatsApp. Niemand trekt zichzelf en iedereen ziet alleen zijn eigen lootje.' },
  { id: 'hulp-rijmmachine', bord: 'sinterklaas', soort: 'stappen', label: 'Gratis Sint-rijmmachine', kop: 'Sinterklaasgedicht maken in een minuut',
    stappen: ['Vul de naam in en kies wie het is: je partner, een collega, opa of oma.', 'Kies wat hem of haar typeert en wat hij of zij graag doet.', 'Iets grappigs erbij? Altijd te laat, altijd de sleutels kwijt.', 'Kopieer, print of deel het gedicht.'],
    link: 'https://leukekeuze.nl/sint-rijmmachine/', voet: 'leukekeuze.nl/sint-rijmmachine',
    tekst: 'Geen inspiratie voor een Sinterklaasgedicht? Vertel wie het is en wat hem of haar typeert, en de Sint-rijmmachine maakt er een gedicht op rijm van. Gratis.' },
  { id: 'hulp-woordzoeker-kerst', bord: 'kerst', soort: 'shot', label: 'Gratis om te printen', kop: 'Woordzoeker kerst om te printen',
    pagina: '/woordzoeker/#kerst', sel: '.wzk-raster', onder: 'De letters die overblijven vormen een zin.', link: 'https://leukekeuze.nl/woordzoeker/#kerst', voet: 'leukekeuze.nl/woordzoeker',
    tekst: 'Een gratis woordzoeker over kerst om te printen of op je telefoon te spelen. De letters die overblijven vormen een zin. Je kunt ook een woordzoeker maken met je eigen woorden.' },
  { id: 'hulp-woordzoeker-sint', bord: 'sinterklaas', soort: 'shot', label: 'Gratis om te printen', kop: 'Woordzoeker Sinterklaas om te printen',
    pagina: '/woordzoeker/#sinterklaas', sel: '.wzk-raster', onder: 'De letters die overblijven vormen een zin.', link: 'https://leukekeuze.nl/woordzoeker/#sinterklaas', voet: 'leukekeuze.nl/woordzoeker',
    tekst: 'Een gratis woordzoeker over Sinterklaas om te printen of op je telefoon te spelen. De letters die overblijven vormen een zin. Leuk voor in een surprise.' },
  { id: 'hulp-secret-santa', bord: 'kerst', soort: 'fotos', label: 'Zo werkt het', kop: 'Secret Santa: cadeaus tot €25',
    fotos: ['cg-7fbf7836d1', 'cl-hitster', 'hema-32d780c657', 'dvzn-1a61ae70d9'], onder: 'Lootjes trekken, verlanglijstje en 24 ideeën tot 10, 15 en 25 euro.',
    link: 'https://leukekeuze.nl/gids/secret-santa', voet: 'leukekeuze.nl/gids/secret-santa',
    tekst: 'Zo werkt Secret Santa, met cadeau-ideeën tot 10, 15 en 25 euro voor het werk, de vrienden of de familie. De lootjes trek je gratis online. Meer cadeautips op leukekeuze.nl (bevat partnerlinks)' }
];

const steen = v => { const aan = { 1: [5], 2: [1, 9], 3: [1, 5, 9], 4: [1, 3, 7, 9], 5: [1, 3, 5, 7, 9], 6: [1, 3, 4, 6, 7, 9] }[v];
  let h = ''; for (let i = 1; i <= 9; i++) h += '<i' + (aan.includes(i) ? ' class="a"' : '') + '></i>'; return '<span class="st">' + h + '</span>'; };

function inhoud(p, shot) {
  if (p.soort === 'regels') return '<div class="kaart"><h2>Ronde 1</h2><p class="r1">' + esc(p.r1) + ' Ga door tot de stapel op is.</p>' +
    '<h2>Ronde 2 <small>wekker op 10 minuten</small></h2><ol>' + p.r2.map((t, i) => '<li>' + steen(i + 1) + '<span>' + esc(t) + '</span></li>').join('') + '</ol>' +
    '<p class="eind">Gaat de wekker? Wat je dan hebt, mag je houden.</p></div>';
  if (p.soort === 'stappen') return '<div class="kaart"><ol class="stap">' + p.stappen.map((t, i) => '<li><b>' + (i + 1) + '</b><span>' + esc(t) + '</span></li>').join('') + '</ol></div>';
  if (p.soort === 'shot') return '<div class="kaart shot"><img src="' + shot + '"><p class="onder">' + esc(p.onder) + '</p></div>';
  if (p.soort === 'fotos') return '<div class="kaart fotos"><div class="r">' + p.fotos.map(id => '<img src="' + fotoVan(id) + '">').join('') + '</div><p class="onder">' + esc(p.onder) + '</p></div>';
  return '';
}

(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1000, height: 1500 }, deviceScaleFactor: 1 });
  const ctx = await b.newContext({ viewport: { width: 560, height: 2200 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { Object.defineProperty(navigator, 'webdriver', { get: () => false }); });
  let n = 0;
  for (const p of PINS) {
    const uit = path.join(ROOT, 'pins/img', p.id + '.jpg'); if (!opnieuw && fs.existsSync(uit)) continue;
    let shot = '';
    if (p.soort === 'shot') {
      const sp = await ctx.newPage(); /* elke keer een nieuwe pagina: alleen een ander #-deel laadt de pagina niet opnieuw */
      await sp.goto(BRON + p.pagina, { waitUntil: 'networkidle' }); await sp.waitForTimeout(1200);
      await sp.evaluate(() => { for (const e of document.querySelectorAll('body *')) { const st = getComputedStyle(e); if (st.position === 'fixed' || st.position === 'sticky') e.style.display = 'none'; } });
      const el = await sp.$(p.sel); if (!el) { console.log('niet gevonden op de pagina:', p.id); await sp.close(); continue; }
      shot = 'data:image/png;base64,' + (await el.screenshot()).toString('base64'); await sp.close();
    }
    if (p.soort === 'fotos' && p.fotos.some(id => !fotoVan(id))) { console.log('foto ontbreekt:', p.id); continue; }
    const kl = p.kop.length;
    await pg.setContent(`<style>@font-face{font-family:P;src:url(${f('playfair-display-500-latin.woff2')})}@font-face{font-family:M;src:url(${f('manrope-600-latin.woff2')})}
*{margin:0;box-sizing:border-box}body{width:1000px;height:1500px;background:#F7F3EC;display:flex;flex-direction:column;align-items:center;font-family:M;color:#141A2A}
.lab{margin-top:64px;padding:12px 26px;border-radius:999px;background:#1F2B48;color:#F2CB74;font-size:26px;letter-spacing:.04em}
h1{font-family:P;font-weight:500;font-size:${kl > 36 ? 60 : 68}px;text-align:center;padding:30px 70px 0;line-height:1.12;text-wrap:balance}
.l{width:90px;height:4px;background:#B8862E;margin:28px 0 34px}
.kaart{width:880px;flex:1;margin-bottom:34px;background:#fff;border:2px solid #E5D7BE;border-radius:30px;padding:40px 46px;box-shadow:0 10px 30px rgba(20,26,42,.07);display:flex;flex-direction:column}
h2{font-family:P;font-weight:500;font-size:46px;margin:0 0 12px}h2 small{font-family:M;font-size:24px;color:#7A5518;margin-left:10px}
.r1{font-size:33px;line-height:1.35;margin-bottom:36px}ol{list-style:none;padding:0;display:grid;gap:22px}
ol li{display:flex;gap:22px;align-items:center;font-size:31px;line-height:1.3}
.st{flex:none;width:70px;height:70px;display:grid;grid-template:repeat(3,1fr)/repeat(3,1fr);padding:9px;background:#FFFCF7;border:2px solid #B8862E;border-radius:14px}
.st i{width:12px;height:12px;margin:auto;border-radius:50%}.st i.a{background:#1F2B48}
.eind{margin-top:auto;padding-top:24px;font-size:30px;color:#7A5518}
.stap{gap:48px;margin:auto 0}.stap li{font-size:40px;line-height:1.3;gap:28px}.stap b{flex:none;width:84px;height:84px;border-radius:50%;background:#1F2B48;color:#F2CB74;display:flex;align-items:center;justify-content:center;font-size:42px}
.shot{align-items:center;justify-content:center;padding:34px}.shot img{width:780px;height:auto;max-height:860px;object-fit:contain}
.onder{font-size:28px;text-align:center;color:#4A5063;margin-top:22px}
.fotos{justify-content:center}.fotos .r{display:grid;grid-template-columns:1fr 1fr;gap:22px}.fotos img{width:100%;aspect-ratio:1;object-fit:contain;background:#fff;border:1px solid #F1E9DA;border-radius:18px}
.v{display:flex;align-items:center;gap:14px;font-size:30px;padding-bottom:56px}.v img{width:40px;height:40px}</style>
<div class="lab">${esc(p.label)}</div><h1>${esc(p.kop)}</h1><div class="l"></div>${inhoud(p, shot)}<div class="v"><img src="${logo}">${esc(p.voet)}</div>`);
    await pg.evaluate(() => document.fonts.ready); await pg.waitForTimeout(150);
    const te = await pg.evaluate(() => document.body.scrollHeight > 1500); if (te) console.log('LET OP: past niet op 1500 px:', p.id);
    await pg.screenshot({ path: uit, type: 'jpeg', quality: 88 }); n++;
  }
  await b.close(); console.log('pinplaatjes gemaakt:', n);

  /* vooraan in de wachtrij */
  const lees = n => JSON.parse(fs.readFileSync(path.join(ROOT, 'pins', n), 'utf8'));
  const wacht = lees('wachtrij.json'), klaar = lees('geplaatst.json');
  const al = new Set([...wacht, ...(Array.isArray(klaar) ? klaar : [])].map(x => x.id));
  const nieuw = PINS.filter(p => !al.has(p.id) && fs.existsSync(path.join(ROOT, 'pins/img', p.id + '.jpg')))
    .map(p => ({ id: p.id, bord: p.bord, kop: p.kop, titel: p.kop, tekst: p.tekst, link: p.link, beeld: 'pins/img/' + p.id + '.jpg' }));
  if (nieuw.length) { fs.writeFileSync(path.join(ROOT, 'pins/wachtrij.json'), JSON.stringify([...nieuw, ...wacht], null, 1) + '\n'); }
  console.log('vooraan in de wachtrij gezet:', nieuw.length, '| wachtrij nu:', wacht.length + nieuw.length);
})();
