// Welke plaatjes haalt een pagina op tot de app gestart is, en hoe groot zijn ze? node beelden.js <poort> <pad>
const { chromium } = require('playwright');
(async () => { const poort = process.argv[2], pad = process.argv[3], B = 'http://127.0.0.1:' + poort; const b = await chromium.launch();
  const c = await b.newContext({ viewport: { width: 390, height: 780 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }); const p = await c.newPage();
  await p.route('**/*', r => r.request().url().startsWith(B) ? r.continue() : r.abort());
  const s = await c.newCDPSession(p); await s.send('Network.enable'); await s.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 1.6 * 1024 * 1024 / 8, uploadThroughput: 750 * 1024 / 8 }); await s.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await p.goto(B + pad, { waitUntil: 'load', timeout: 180000 }); await p.waitForFunction(() => document.documentElement.classList.contains('lk-gestart'), null, { timeout: 120000 });
  const r = await p.evaluate(() => performance.getEntriesByType('resource').filter(x => /\.(webp|jpg|png|svg)(\?|$)/.test(x.name)).map(x => ({ n: x.name.replace(/^.*?\/\/[^/]+\//, ''), kb: Math.round((x.transferSize || 0) / 1024), t: Math.round(x.responseEnd), inDom: !!document.querySelector('img[src*="' + x.name.replace(/^.*\//, '').replace(/\?.*$/, '') + '"], [style*="' + x.name.replace(/^.*\//, '').replace(/\?.*$/, '') + '"]') })));
  const tot = r.reduce((a, x) => a + x.kb, 0), weg = r.filter(x => !x.inDom);
  console.log(pad, 'poort', poort, ':', r.length, 'plaatjes,', tot, 'KB | niet (meer) op de pagina:', weg.length, 'plaatjes,', weg.reduce((a, x) => a + x.kb, 0), 'KB');
  weg.sort((a, b) => b.kb - a.kb).slice(0, 14).forEach(x => console.log('   weg: ' + String(x.kb).padStart(4) + ' KB  ' + x.n.slice(0, 80) + '  (klaar na ' + x.t + ' ms)'));
  await b.close(); })();
