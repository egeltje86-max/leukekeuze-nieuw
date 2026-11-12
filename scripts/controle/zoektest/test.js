/* Zoektest (12-11-2026): 461 echte zoekwoorden en typfouten. Gebruik (lokale server op poort 8765, NODE_PATH=$(npm root -g)):
   node scripts/controle/zoektest/test.js scripts/controle/zoektest/vragen.txt uit.json
   Per zoekwoord: aantal treffers, de melding ('We zochten op ...') en de eerste treffers. Vergelijk uit.json met een eerdere run. */
const { chromium } = require('playwright'); const fs = require('fs');
(async () => { const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 390, height: 800 }, isMobile: true })).newPage();
  const f = []; p.on('pageerror', e => f.push(String(e)));
  await p.goto('http://localhost:8765/zoek/?q=lego', { waitUntil: 'networkidle' }); await p.waitForTimeout(800);
  const vragen = fs.readFileSync(process.argv[2], 'utf8').split('\n').map(s => s.trim()).filter(Boolean); const uit = [];
  for (const q of vragen) {
    const r = await p.evaluate(q => { window.LK.ga('/zoek?q=' + encodeURIComponent(q), true); const a = document.querySelector('#app');
      const n = a.querySelector('.werkbalk .aantal'); const ruim = a.querySelector('.zoek-ruim');
      return { n: n ? parseInt(n.textContent.replace(/\D/g, ''), 10) || 0 : -1, ruim: [...a.querySelectorAll(".zoek-ruim")].map(x => x.textContent).join(" ").slice(0, 110), tips: [...a.querySelectorAll('.bedoel span')].slice(0, 4).map(x => x.textContent),
        top: [...a.querySelectorAll('.prodkaart')].slice(0, 5).map(k => (k.querySelector('h3, .titel, .pk-titel') || k).textContent.replace(/\s+/g, ' ').trim().slice(0, 48)), wizard: location.pathname }; }, q);
    uit.push(Object.assign({ q }, r)); }
  fs.writeFileSync(process.argv[3], JSON.stringify(uit, null, 1));
  for (const r of uit) console.log((r.n + '').padStart(5), '|', r.q.padEnd(22), '|', r.wizard !== '/zoek' && r.wizard !== '/zoek/' ? '[' + r.wizard + '] ' : '', r.ruim ? 'RUIM ' : '', (r.tips[0] || '').slice(0, 22).padEnd(22), '|', r.top.slice(0, 2).join(' ; '));
  console.log('fouten', f.length, f.slice(0, 2)); await b.close(); })();
