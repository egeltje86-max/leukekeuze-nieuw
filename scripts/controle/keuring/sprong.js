// Springt de pagina terug naar boven als de app start terwijl de bezoeker al naar beneden heeft gescrold?
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch();
  for (const [naam, B] of [['oud (live)', 'http://localhost:8767'], ['nieuw', 'http://localhost:8765']]) for (const pad of ['/voor/haar/', '/c/cadeaus/sinterklaas/', '/']) {
    const c = await b.newContext({ viewport: { width: 390, height: 800 }, isMobile: true, hasTouch: true });
    await c.route('**/*', r => { const u = r.request().url(); if (!u.startsWith(B)) return r.abort(); if (/producten-lean\.js/.test(u)) return setTimeout(() => r.continue(), 3500); return r.continue(); });
    const p = await c.newPage(); await p.goto(B + pad, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(1500);
    await p.evaluate(() => window.scrollTo(0, 1500)); await p.waitForTimeout(300); const voor = await p.evaluate(() => Math.round(scrollY));
    const kaart = await p.evaluate(() => { const k = [...document.querySelectorAll('#app article.prodkaart, #app a, #app h2')].find(e => { const r = e.getBoundingClientRect(); return r.top > 0 && r.top < 500; }); return k ? (k.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 30) : ''; });
    await p.waitForFunction(() => document.documentElement.classList.contains('lk-gestart'), null, { timeout: 30000 }); await p.waitForTimeout(700);
    const na = await p.evaluate(() => Math.round(scrollY));
    console.log(naam.padEnd(11), pad.padEnd(26), 'gescrold naar', voor, '| na het starten van de app staat de pagina op', na, na < voor - 200 ? '  << TERUGGESPRONGEN NAAR BOVEN' : '  (blijft staan)', '| in beeld was:', kaart); await c.close(); }
  await b.close(); })();
