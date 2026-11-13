// Geeft de NIEUWE code precies dezelfde pagina's als de OUDE? (zelfde producten, zelfde volgorde, zelfde tekst)
// node gelijk3.js <padenbestand> <breedte> <a|b> [wacht-ms]
// Oud = de live-kopie op poort 8767, nieuw = de werkmap op poort 8765. Per kant één sessie: elke pagina wordt getekend met LK.ga(pad),
// zo lopen ook de geheugens (caches) van de nieuwe code over honderden pagina's mee. Alles buiten localhost en alle plaatjes zijn geblokkeerd.
const { chromium } = require('playwright'); const fs = require('fs');
const paden = fs.readFileSync(process.argv[2], 'utf8').split('\n').map(x => x.trim()).filter(Boolean);
const BR = +process.argv[3], VAR = process.argv[4] || 'a', WACHT = +process.argv[5] || 0;
const OUD = 'http://localhost:' + (process.env.OUD || 8767), NIEUW = 'http://localhost:' + (process.env.NIEUW || 8765);
(async () => {
  const b = await chromium.launch();
  const kant = async (basis) => {
    const c = await b.newContext(BR < 700 ? { viewport: { width: BR, height: 800 }, isMobile: true, hasTouch: true } : { viewport: { width: BR, height: 900 } });
    await c.route('**/*', r => { const u = r.request().url(); return (!u.startsWith(basis) || /\.(webp|jpg|jpeg|png|gif|woff2)(\?|$)/.test(u)) ? r.abort() : r.continue(); });
    const p = await c.newPage(); const fouten = []; p.on('pageerror', e => fouten.push(String(e.message).slice(0, 160)));
    await p.goto(basis + '/?proef=' + (VAR === 'b' ? 'wijzer' : 'wijzer-uit'), { waitUntil: 'domcontentloaded' });
    await p.waitForFunction(() => window.LK && window.LK.ga && document.documentElement.classList.contains('lk-gestart') && !window.LK_DEEL, null, { timeout: 60000 });
    await p.evaluate((norm) => { window.__norm = h => norm ? h.replace(/\?utm_source=chatgpt\.com&amp;/g, '?').replace(/\?utm_source=chatgpt\.com/g, '').replace(/&amp;utm_source=chatgpt\.com/g, '') : h; window.__fnv = s => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0).toString(36) + '.' + s.length; }; }, process.env.NORM === 'utm');
    const uit = {}; const t0 = Date.now();
    for (let i = 0; i < paden.length; i++) {
      const pad = paden[i];
      try {
        if (WACHT) { await p.evaluate(pad => { window.LK.ga(pad); }, pad); await p.waitForTimeout(WACHT); uit[pad] = await p.evaluate(() => { const a = document.querySelector('#app'); return { h: window.__fnv(window.__norm(a.innerHTML)), n: a.querySelectorAll('article.prodkaart').length, t: document.title }; }); }
        else uit[pad] = await p.evaluate(pad => { window.LK.ga(pad); const a = document.querySelector('#app'); return { h: window.__fnv(window.__norm(a.innerHTML)), n: a.querySelectorAll('article.prodkaart').length, t: document.title }; }, pad);
      } catch (e) { uit[pad] = { h: 'FOUT ' + String(e.message).slice(0, 80) }; }
    }
    return { p, c, uit, fouten, sec: Math.round((Date.now() - t0) / 1000) };
  };
  const [O, N] = await Promise.all([kant(OUD), kant(NIEUW)]);
  const anders = paden.filter(pad => O.uit[pad].h !== N.uit[pad].h);
  const kaarten = paden.reduce((a, pad) => a + (N.uit[pad].n || 0), 0);
  console.log(paden.length + ' pagina\'s op ' + BR + 'px (opzet ' + VAR + '): ' + (paden.length - anders.length) + ' precies gelijk, ' + anders.length + ' anders | ' + kaarten + ' productkaarten vergeleken | oud ' + O.sec + ' s, nieuw ' + N.sec + ' s | fouten oud ' + O.fouten.length + ', nieuw ' + N.fouten.length);
  if (O.fouten.length || N.fouten.length) console.log('  fouten:', O.fouten.slice(0, 3), N.fouten.slice(0, 3));
  for (const pad of anders.slice(0, 12)) {
    const haal = (k) => k.p.evaluate(pad => { window.LK.ga(pad); return window.__norm(document.querySelector('#app').innerHTML); }, pad);
    const [ho, hn] = [await haal(O), await haal(N)]; let k = 0; while (k < ho.length && ho[k] === hn[k]) k++;
    console.log('  ANDERS ' + pad + ' (vanaf teken ' + k + ')\n     oud:   ' + ho.slice(Math.max(0, k - 70), k + 130).replace(/\s+/g, ' ') + '\n     nieuw: ' + hn.slice(Math.max(0, k - 70), k + 130).replace(/\s+/g, ' '));
  }
  await b.close();
})();
