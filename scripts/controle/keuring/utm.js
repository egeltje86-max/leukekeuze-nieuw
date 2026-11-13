// Verandert er iets aan een pagina als ChatGPT er ?utm_source=chatgpt.com achter zet?
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const BASIS = 'http://localhost:' + (process.env.POORT || 8767);
  const ctx = await b.newContext({ viewport: { width: 390, height: 800 }, isMobile: true, hasTouch: true });
  await ctx.route('**/*', r => r.request().url().startsWith(BASIS) ? r.continue() : r.abort());
  const haal = async (pad) => { const p = await ctx.newPage(); await p.goto(BASIS + pad, { waitUntil: 'load' }); await p.waitForFunction(() => window.LK && window.LK.ga); await p.waitForTimeout(500);
    const r = await p.evaluate(() => ({ html: document.querySelector('#app').innerHTML.replace(/[?&]utm_source=chatgpt\.com/g, ''), ids: [...document.querySelectorAll('#app article.prodkaart h3 a')].map(a => a.getAttribute('href')).join(','), n: document.querySelectorAll('#app article.prodkaart').length, links: [...document.querySelectorAll('#app a[href*="utm_"]')].length })); await p.close(); return r; };
  for (const pad of process.argv.slice(2)) { const a = await haal(pad + '?proef=wijzer-uit'), u = await haal(pad + '?proef=wijzer-uit&utm_source=chatgpt.com');
    let k = 0; while (k < a.html.length && a.html[k] === u.html[k]) k++;
    console.log(pad, '| kaarten', a.n, u.n, '| zelfde producten:', a.ids === u.ids, '| html gelijk:', a.html === u.html, '| links met utm erin:', u.links, a.html === u.html ? '' : '\n   verschil: ' + a.html.slice(Math.max(0, k - 60), k + 100).replace(/\s+/g, ' ') + '\n        utm: ' + u.html.slice(Math.max(0, k - 60), k + 100).replace(/\s+/g, ' ')); }
  await b.close();
})();
