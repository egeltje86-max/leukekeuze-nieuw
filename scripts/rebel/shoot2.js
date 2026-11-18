// echte telefoonschermen (390 x 844), op een paar plekken op de pagina
const { chromium } = require('playwright');
const fs = require('fs');
const pre = process.argv[2], css = process.argv[3], dpr = +(process.argv[4] || 2);
const PAG = [['/', 'home', [0, '.wzh-cat', '.seizoen', '.favorieten .prodgrid']], ['/voor/haar/', 'haar', [0, '.prodgrid']], ['/p/hema-efaa95f521/', 'product', [0, '.wh-bezorg']], ['/c/speelgoed/', 'speelgoed', [0]]];
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: dpr, userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1' });
  await ctx.addInitScript(() => { Object.defineProperty(navigator, 'webdriver', { get: () => false }); });
  if (css) {
    const txt = fs.readFileSync(css, 'utf8');
    await ctx.addInitScript((t) => {
      const zet = () => { const h = document.documentElement; if (!h) return; if (!h.classList.contains('rebel')) h.classList.add('rebel');
        if (document.head && !document.getElementById('rebel-css')) { const s = document.createElement('style'); s.id = 'rebel-css'; s.textContent = t; document.head.appendChild(s); } };
      const kijk = () => { const h = document.documentElement; if (!h) return setTimeout(kijk, 0); zet(); new MutationObserver(zet).observe(h, { attributes: true, attributeFilter: ['class'] }); };
      kijk();
      document.addEventListener('DOMContentLoaded', () => { zet(); const s = document.getElementById('rebel-css'); if (s) document.head.appendChild(s); });
    }, txt);
    await ctx.route(/\/images\/sub\/rond\/(voor-[a-z-]+?)(-klein)?\.webp/, (route) => {
      const m = route.request().url().match(/\/images\/sub\/rond\/(voor-[a-z-]+?)(-klein)?\.webp/);
      const f = __dirname + '/rond/' + m[1] + (m[2] || '') + '.webp';
      if (fs.existsSync(f)) return route.fulfill({ path: f, contentType: 'image/webp' });
      return route.continue();
    });
  }
  const p = await ctx.newPage(); const fout = []; p.on('pageerror', e => fout.push(String(e)));
  for (const [u, n, ys] of PAG) {
    await p.goto('http://localhost:8765' + u, { waitUntil: 'networkidle' }); await p.waitForTimeout(1800);
    await p.evaluate(() => window.scrollTo(0, 2000)); await p.waitForTimeout(700);
    for (const [i, y] of ys.entries()) {
      await p.evaluate((y) => { if (typeof y === 'number') return window.scrollTo(0, y); const e = document.querySelector(y); if (e) window.scrollTo(0, e.getBoundingClientRect().top + scrollY - 170); }, y); await p.waitForTimeout(700);
      await p.screenshot({ path: pre + '-' + n + '-' + (i + 1) + '.png' });
    }
  }
  console.log('fouten', fout);
  await b.close();
})();
