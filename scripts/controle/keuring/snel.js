// Meet een pagina zoals een gewone telefoon op trage 4G hem laadt (1,6 Mbit/s omlaag, 150 ms vertraging, processor 4x trager).
// node snel.js <poort> <pad> [pad...]   ->  per pagina: eerste beeld, grootste beeld, lijst binnen, knoppen werken, hoeveel KB
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const poort = process.argv[2]; const uit = [];
  for (const pad of process.argv.slice(3)) {
    const c = await b.newContext({ viewport: { width: 390, height: 780 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2, userAgent: 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36' });
    const p = await c.newPage();
    await p.route('**/*', r => r.request().url().startsWith('http://127.0.0.1:' + poort) ? r.continue() : r.abort());
    await p.addInitScript(() => {
      const M = window.__m = { lcp: 0, lang: 0, cls: 0 }; try { new PerformanceObserver(l => { for (const e of l.getEntries()) if (!e.hadRecentInput) M.cls += e.value; }).observe({ type: 'layout-shift', buffered: true }); } catch (e) {}
      try { new PerformanceObserver(l => { for (const e of l.getEntries()) M.lcp = Math.round(e.startTime); }).observe({ type: 'largest-contentful-paint', buffered: true }); } catch (e) {}
      try { new PerformanceObserver(l => { for (const e of l.getEntries()) if (e.name === 'first-contentful-paint') M.fcp = Math.round(e.startTime); }).observe({ type: 'paint', buffered: true }); } catch (e) {}
      try { new PerformanceObserver(l => { for (const e of l.getEntries()) { M.lang += Math.max(0, e.duration - 50); M.laatsteLang = Math.round(e.startTime + e.duration); } }).observe({ type: 'longtask', buffered: true }); } catch (e) {}
      const t = setInterval(() => {
        const n = Math.round(performance.now());
        if (!M.app && window.LK && window.LK.icoon && document.querySelector('.onderbalk')) M.app = n; // gedeeld.js is er (app.js volgt direct)
        if (!M.lijst && window.LK_PRODUCTEN) M.lijst = n;
        if (!M.pak && window.LK_PAK) M.pak = n;
        if (!M.start && document.documentElement.classList.contains('lk-gestart')) { M.start = n; setTimeout(() => { M.klaar = Math.round(performance.now()); }, 0); }
        if (M.klaar && window.LK_PRODUCTEN && M.volledig === undefined && !window.LK_DEEL) { M.volledig = n; }
      }, 25);
    });
    const s = await c.newCDPSession(p); await s.send('Network.enable');
    await s.send('Network.emulateNetworkConditions', process.env.NET === 'gewoon' ? { offline: false, latency: 70, downloadThroughput: 12 * 1024 * 1024 / 8, uploadThroughput: 3 * 1024 * 1024 / 8 } : { offline: false, latency: 150, downloadThroughput: 1.6 * 1024 * 1024 / 8, uploadThroughput: 750 * 1024 / 8 });
    await s.send('Emulation.setCPUThrottlingRate', { rate: 4 });
    await p.goto('http://127.0.0.1:' + poort + pad, { waitUntil: 'load', timeout: 180000 });
    if (/^\/p\//.test(pad)) { /* productpagina: de lijst laadt pas na 3 s of als je iets doet; we wachten zonder iets te doen */ }
    await p.waitForFunction(() => window.__m.klaar, null, { timeout: 120000 }).catch(() => {});
    await p.waitForTimeout(1500);
    const m = await p.evaluate(() => { const r = performance.getEntriesByType('resource'); const js = r.filter(x => /\.js(\?|$)/.test(x.name));
      return Object.assign({}, window.__m, { load: Math.round(performance.getEntriesByType('navigation')[0].loadEventEnd), kb: Math.round(r.reduce((a, x) => a + (x.transferSize || 0), 0) / 1024), jskb: Math.round(js.reduce((a, x) => a + (x.transferSize || 0), 0) / 1024),
        js: js.map(x => x.name.replace(/^.*\/assets\/js\//, '').replace(/\?.*$/, '') + ':' + Math.round(x.responseEnd)).join(' ') }); });
    console.log(pad + '\n   eerste beeld ' + m.fcp + ' | grootste beeld ' + m.lcp + ' | verspringen ' + m.cls.toFixed(3) + ' | lijst binnen ' + (m.lijst || '-') + (m.pak ? ' | pak binnen ' + m.pak : '') + ' | KNOPPEN WERKEN ' + (m.klaar || '-') + ' | blokkade ' + Math.round(m.lang) + ' ms | ' + m.kb + ' KB (js ' + m.jskb + ')\n   ' + m.js);
    uit.push(Object.assign({ pad }, m)); await c.close();
  }
  await b.close(); require('fs').writeFileSync(process.env.UIT || 'snel-uit.json', JSON.stringify(uit, null, 1));
})();
