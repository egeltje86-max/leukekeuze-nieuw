// De eerste 72 cadeaus van de drukste pagina's, in de volgorde die de bezoeker ziet (voor de WEG-lijst en om de bovenkant na te kijken).
// node toplijst.js <uit.json> <pad> [pad...]
const { chromium } = require('playwright'); const fs = require('fs');
(async () => {
  const BASIS = 'http://localhost:' + (process.env.POORT || 8765); const b = await chromium.launch();
  const c = await b.newContext({ viewport: { width: 390, height: 800 }, isMobile: true, hasTouch: true });
  await c.route('**/*', r => { const u = r.request().url(); return (!u.startsWith(BASIS) || /\.(webp|jpg|jpeg|png|gif|woff2)(\?|$)/.test(u)) ? r.abort() : r.continue(); });
  const p = await c.newPage(); await p.goto(BASIS + '/?proef=wijzer-uit', { waitUntil: 'domcontentloaded' });
  await p.waitForFunction(() => window.LK && window.LK.ga && document.documentElement.classList.contains('lk-gestart'), null, { timeout: 60000 });
  const uit = {};
  for (const pad of process.argv.slice(3)) {
    await p.evaluate(pad => window.LK.ga(pad), pad); await p.waitForTimeout(150);
    for (let i = 0; i < (+process.env.MEER || 1); i++) { const k = p.locator('#app [data-meer]').last(); if (await k.count()) { await k.evaluate(e => e.click()); await p.waitForTimeout(120); } }
    uit[pad] = await p.evaluate(() => [...document.querySelectorAll('#app article.prodkaart')].map(k => { const a = k.querySelector('h3 a'); const id = (a.getAttribute('href') || '').replace(/^\/p\//, '').replace(/\/.*$/, ''); const pr = window.LK.vind(id) || {};
      return { id, t: pr.titel, p: pr.prijs, w: pr.shop, oud: pr.oudePrijs || 0, vak: [pr.afd, pr.groep, pr.vak].join('/'), sinds: pr.sinds || '', gec: pr.gecontroleerd || '', rang: pr.rang, beeld: pr.beeld || '' }; }));
    console.log(pad, uit[pad].length);
  }
  fs.writeFileSync(process.argv[2], JSON.stringify(uit)); await b.close();
})();
