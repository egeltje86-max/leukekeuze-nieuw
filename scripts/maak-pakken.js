/* SNEL (13-11-2026, grote keuring): maakt per lijstpagina een klein productbestand (een 'pak'): assets/pak/<pagina>.js.
   Daarin staan alleen de producten en toppers die op die pagina meedoen. De site start daarmee (zie app.js, zetPak) en haalt de hele lijst
   daarna op de achtergrond op. Op een trage telefoon werken de knoppen zo veel eerder.

   Gebruik (na het bouwen):  node scripts/maak-pakken.js        (maak-paginas.js roept dit zelf aan het eind aan)
   Veiligheid: elke pagina wordt twee keer getekend, één keer met de hele lijst en één keer met alleen het pak (ook de nieuwe opzet van de proef
   WIJZER). Alleen als dat precies dezelfde pagina geeft krijgt de pagina een pak. Anders verandert er voor die pagina niets (hij wacht op de hele lijst, zoals eerst).
   Productpagina's, zoeken, de kieshulp, het verlanglijstje en 'Zoek een product' krijgen geen pak. */
const fs = require('fs'), path = require('path'), http = require('http');
let chromium;
try { ({ chromium } = require('playwright')); } catch (e) { ({ chromium } = require(process.env.PLAYWRIGHT_PAD || 'playwright')); }
const ROOT = path.resolve(__dirname, '..');
/* Grotere lijsten leveren te weinig op. 13-11-2026: standaard tot 2000 producten per pak (homepage 0,9 MB tegen 2,7 MB voor de hele lijst;
   Voor haar heeft 3900 producten nodig en wint bijna niets). Zo zijn het 73 pakken en 33 MB in plaats van 106 en 88 MB. Met LK_PAKKEN=alles: tot 5200. */
const MAX = process.env.LK_PAKKEN === 'alles' ? 5200 : 2000;
const PAKMAP = path.join(ROOT, 'assets', 'pak');
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.xml': 'application/xml', '.txt': 'text/plain' };
const SJ = fs.readFileSync(path.join(ROOT, 'sjabloon.html'), 'utf8');
const VERSIE = (SJ.match(/assets\/js\/app\.js\?v=(\d+)/) || [])[1] || String(Date.now());
const KOP = '<script>(function () { var s = "assets/js/producten-lean.js';
if (SJ.indexOf('LK_LAAD_VOL') === -1) { console.log('pakken: het sjabloon kent nog geen pakken, overgeslagen'); return; }

/* De producten zoals de site ze kent (uit producten-lean.js), zonder wat de bouwpagina eraan toevoegt. */
const win = { dispatchEvent() {} }; global.Event = global.Event || function () {};
new Function('window', 'document', fs.readFileSync(path.join(ROOT, 'assets/js/producten-lean.js'), 'utf8'))(win, { createEvent: () => ({ initEvent() {} }) });
const LEAN = {}; for (const p of win.LK_PRODUCTEN) LEAN[p.id] = p;
const AFBREEK = (win.LK_AFBREEK || '').split('|').filter(Boolean);

function server() {
  return new Promise(res => {
    const s = http.createServer((req, rsp) => {
      let p; try { p = decodeURIComponent(req.url.split('?')[0]); } catch (e) { p = '/'; }
      let f = path.join(ROOT, p);
      try { if (fs.statSync(f).isDirectory()) f = path.join(f, 'index.html'); } catch (e) { f = path.join(ROOT, '404.html'); }
      if (!f.startsWith(ROOT) || !fs.existsSync(f)) f = path.join(ROOT, '404.html');
      rsp.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(rsp);
    });
    s.listen(0, () => res(s));
  });
}
const naamVan = pad => (pad.replace(/^\/|\/$/g, '').replace(/\//g, '--') || 'home');

(async () => {
  const t0 = Date.now();
  /* welke pagina's: alles uit de sitemap behalve productpagina's en pagina's die de hele lijst nodig hebben */
  let paden = (fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8').match(/<loc>[^<]+<\/loc>/g) || []).map(x => x.replace(/<\/?loc>/g, '').replace('https://leukekeuze.nl', ''))
    .filter(p => !/^\/(p|vonk|zoek|favorieten|lijst|winkels|categorieen|sint-rijmmachine|info)\//.test(p));
  /* 13-11-2026 (GO Marius, voorstel 5 van de keuring): alleen de drukste soorten pagina's krijgen een pak: de homepage, de Voor wie-pagina's met hun
     onderwerpen, de cadeaulijsten (Sinterklaas, Kerst, onder een bedrag), de collecties en de gelegenheden. Alle 640 pagina's kost 144 MB en 8 minuten
     per bouw, en de site is al groter dan 1 GB. Toch alles: LK_PAKKEN=alles. */
  const DRUK = /^\/$|^\/voor\/[^/]+\/([^/]+\/)?$|^\/c\/cadeaus\/[^/]+\/$|^\/collectie\/[^/]+\/$|^\/gelegenheid\/[^/]+\/$/;
  if (process.env.LK_PAKKEN !== 'alles') paden = paden.filter(p => DRUK.test(p));
  const srv = await server(); const basis = 'http://localhost:' + srv.address().port;
  const browser = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
  /* Twee schermen: de site tekent op de telefoon iets anders dan op de computer (bijv. 4 of 8 keuzes in beeld). Het pak moet voor allebei kloppen. */
  const SCHERMEN = [{ viewport: { width: 390, height: 800 }, isMobile: true, hasTouch: true }, { viewport: { width: 1280, height: 900 } }];
  const fouten = [];
  const maak = async (scherm) => {
    const ctx = await browser.newContext(scherm);
    await ctx.route('**/*', r => { const u = r.request().url(); return (!u.startsWith(basis) || /\.(webp|jpg|png|woff2|gz)(\?|$)/.test(u) || /producten-details\.js|\/assets\/zoek\/|\/assets\/pak\//.test(u)) ? r.abort() : r.continue(); });
    const p = await ctx.newPage(); p.on('pageerror', e => fouten.push(e.message));
    await p.goto(basis + '/?proef=pak-uit');
    await p.waitForFunction(() => window.LK && window.LK.ga && window.LK._toonPad && document.documentElement.classList.contains('lk-gestart'), null, { timeout: 60000 });
    await p.evaluate(() => { window.LK_BOUW = true; window.__fnv = s => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0).toString(36) + '.' + s.length; }; });
    return p;
  };
  const REF = [], PAK = [];
  for (const sch of SCHERMEN) { REF.push(await maak(sch)); PAK.push(await maak(sch)); }
  /* REF: de tabellen met toppers zo inpakken dat we zien welke sleutels een pagina leest */
  let tabellen = null;
  for (const R of REF) {
    const t = await R.evaluate(() => {
      const T = window.__T = { k: window.LK_TOPKEUZE || {}, v: window.LK_TOPVAST || {}, n: window.LK_NIETOP || {} };
      const pak = (naam, t) => new Proxy(t, { get(o, k) { if (window.LK_OPNAME && typeof k === 'string') window.LK_OPNAME.top[naam + '|' + k] = 1; return o[k]; }, ownKeys(o) { if (window.LK_OPNAME) window.LK_OPNAME.alleTop = 1; return Reflect.ownKeys(o); } });
      window.LK_TOPKEUZE = pak('k', T.k); window.LK_TOPVAST = pak('v', T.v); window.LK_NIETOP = pak('n', T.n);
      const et = {}; Object.keys(T.v).forEach(k => (T.v[k] || []).forEach(id => { et[id] = 1; }));
      return { k: T.k, v: T.v, n: T.n, etalage: Object.keys(et) };
    });
    tabellen = tabellen || t;
  }
  const ETALAGE = new Set(tabellen.etalage);
  fs.rmSync(PAKMAP, { recursive: true, force: true }); fs.mkdirSync(PAKMAP, { recursive: true });
  const uit = { gemaakt: 0, bytes: 0, mis: 0, redenen: {}, grootste: [], zonder: [] };
  const nee = (pad, waarom) => { uit.redenen[waarom] = (uit.redenen[waarom] || 0) + 1; uit.zonder.push(pad + ' (' + waarom + ')'); };
  const tekenRef = ({ pad, wb }) => {
    const O = window.LK_OPNAME = { ids: {}, alles: 0, top: {} };
    window.LK._reset(); const html = window.LK._toonPad(pad); let hb = '';
    if (wb) { window.LK._wijzer('b'); window.LK._reset(); hb = window.__fnv(window.LK._toonPad(pad)); window.LK._wijzer('a'); }
    window.LK_OPNAME = null;
    const merk = {}; Object.keys(O.ids).forEach(id => { const p = window.LK.vind(id); if (p && !(p.merk || '').trim()) { const m = window.LK._merk(p); if (m) merk[id] = m; } });
    return { h: window.__fnv(html), hb, ids: Object.keys(O.ids), alles: O.alles, top: Object.keys(O.top), alleTop: !!O.alleTop, merk, nietGevonden: /Even kwijt|niet beschikbaar/.test(document.querySelector('#app').textContent) && !document.querySelector('#app .prodkaart') };
  };
  const tekenPak = ({ pad, wb, pak }) => {
    window.LK_PRODUCTEN = pak.p; window.LK_TOPKEUZE = pak.top; window.LK_TOPVAST = pak.vast; window.LK_NIETOP = pak.nietop; window.LK_AFBREEK = pak.af; window.LK_DEEL = true; window.LK_DEEL_MIS = false;
    window.LK._reset(); const h = window.__fnv(window.LK._toonPad(pad)); let hb = '';
    if (wb) { window.LK._wijzer('b'); window.LK._reset(); hb = window.__fnv(window.LK._toonPad(pad)); window.LK._wijzer('a'); }
    return { h, hb, mis: !!window.LK_DEEL_MIS };
  };
  let teller = 0;
  for (const pad of paden) {
    const f = path.join(ROOT, pad, 'index.html'); if (!fs.existsSync(f)) continue;
    if (++teller % 100 === 0) console.log('  pakken: ' + teller + '/' + paden.length + ' (' + uit.gemaakt + ' gemaakt, ' + Math.round((Date.now() - t0) / 1000) + ' s)');
    const wb = pad === '/' || /^\/voor\/[^/]+\//.test(pad);   /* de proef WIJZER: ook de nieuwe opzet moet met het pak precies gelijk zijn */
    const rs = await Promise.all(REF.map(R => R.evaluate(tekenRef, { pad, wb })));
    if (rs.some(r => r.nietGevonden)) { nee(pad, 'pagina bestaat niet'); continue; }
    if (rs.some(r => r.alles)) { nee(pad, 'loopt de hele lijst af'); continue; }
    const idSet = {}, topSet = {}, merk = {}; let alleTop = false;
    for (const r of rs) { r.ids.forEach(id => { idSet[id] = 1; }); r.top.forEach(k => { topSet[k] = 1; }); Object.assign(merk, r.merk); alleTop = alleTop || r.alleTop; }
    const ids = Object.keys(idSet).filter(id => LEAN[id]);
    if (ids.length > MAX) { nee(pad, 'meer dan ' + MAX + ' producten'); continue; }
    const prods = ids.map(id => merk[id] ? Object.assign({}, LEAN[id], { _merk: merk[id] }) : LEAN[id]);
    /* de sleutels die de pagina las, plus alles wat met het adres van de pagina begint (bijv. Kerst ?voor=hem) */
    const kort = pad.replace(/\/$/, ''); const sub = { k: {}, v: {}, n: {} };
    for (const s of Object.keys(topSet)) { const i = s.indexOf('|'), t = s.slice(0, i), k = s.slice(i + 1); if (tabellen[t][k] !== undefined) sub[t][k] = tabellen[t][k]; }
    for (const t of ['k', 'v', 'n']) for (const k of Object.keys(tabellen[t])) if (kort && (k === kort || k.indexOf(kort + '?') === 0 || k.indexOf(kort + '/') === 0)) sub[t][k] = tabellen[t][k];
    if (alleTop) sub.v['/_etalage'] = ids.filter(id => ETALAGE.has(id));   /* de proef WIJZER zet eerst wat in een handgekozen top staat */
    const titels = prods.map(p => (p.titel || '').toLowerCase()).join(' | ');
    const af = AFBREEK.filter(s => titels.indexOf(s.replace(/-/g, '')) !== -1).join('|');
    const pak = { v: VERSIE, pad, p: prods, top: sub.k, vast: sub.v, nietop: sub.n, af };
    const ts = await Promise.all(PAK.map(P => P.evaluate(tekenPak, { pad, wb, pak })));
    let reden = '', mis = false;
    ts.forEach((t, i) => { const r = rs[i], waar = i ? 'computer' : 'telefoon';
      if (!reden && t.h !== r.h) reden = 'pagina met pak is niet gelijk (' + waar + ')';
      if (!reden && wb && t.hb !== r.hb) reden = 'nieuwe opzet (WIJZER) met pak is niet gelijk (' + waar + ')';
      if (t.mis) mis = true; });
    if (mis) uit.mis++;   /* de pagina vroeg om een product dat niet (meer) bestaat: geen fout, alleen één keer extra stil natekenen als de hele lijst er is */
    if (reden) { nee(pad, reden); continue; }
    const naam = naamVan(pad), js = 'window.LK_PAK=' + JSON.stringify(pak).replace(/</g, '\\u003c') + ';try{window.dispatchEvent(new Event("lk-pak"))}catch(e){}\n';
    fs.writeFileSync(path.join(PAKMAP, naam + '.js'), js);
    let h = fs.readFileSync(f, 'utf8');
    if (h.indexOf('<script>window.LK_PAKPAD=') === -1 && h.indexOf(KOP) !== -1) { h = h.replace(KOP, '<script>window.LK_PAKPAD="assets/pak/' + naam + '.js?v=' + VERSIE + '";</script>\n  ' + KOP); fs.writeFileSync(f, h); }
    uit.gemaakt++; uit.bytes += js.length; uit.grootste.push([js.length, prods.length, pad]);
  }
  await browser.close(); srv.close();
  uit.grootste.sort((a, b) => b[0] - a[0]);
  console.log('pakken: ' + uit.gemaakt + ' van ' + paden.length + ' pagina\'s, samen ' + Math.round(uit.bytes / 1048576) + ' MB, ' + Math.round((Date.now() - t0) / 1000) + ' s');
  console.log('  geen pak:', JSON.stringify(uit.redenen));
  console.log('  grootste:', uit.grootste.slice(0, 5).map(x => x[2] + ' ' + x[1] + ' producten ' + Math.round(x[0] / 1024) + ' KB').join(' ; '));
  fs.writeFileSync(path.join(ROOT, 'keurkamer', 'data', 'pakken-laatste.json'), JSON.stringify({ datum: new Date().toISOString().slice(0, 10), gemaakt: uit.gemaakt, paginas: paden.length, vraagtOnbekend: uit.mis, mb: Math.round(uit.bytes / 104857.6) / 10, redenen: uit.redenen, zonder: uit.zonder, grootste: uit.grootste.slice(0, 20) }, null, 1));
  if (fouten.length) console.error('pakken: fouten op de pagina (de pakken zelf zijn per pagina nagekeken):', fouten.slice(0, 5));
})().catch(e => { console.error('pakken mislukt (de site werkt gewoon, alleen zonder pakken):', e.message); });
