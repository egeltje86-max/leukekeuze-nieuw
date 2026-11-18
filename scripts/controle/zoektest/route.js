// Routetest: typ elk zoekwoord in het zoekvak, druk op Enter, en noteer waar je uitkomt. node route.js vragen.txt uit.json
const { chromium } = require('playwright'); const fs = require('fs');
(async () => { const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 390, height: 800 }, isMobile: true })).newPage();
  const f = []; p.on('pageerror', e => f.push(String(e)));
  await p.goto('http://localhost:8765/', { waitUntil: 'networkidle' }); await p.waitForTimeout(1500);
  const rijen = fs.readFileSync(process.argv[2], 'utf8').split('\n').map(s => s.trim()).filter(s => s && !s.startsWith('#'));
  const uit = []; let goed = 0, fout = 0;
  for (const r of rijen) { const [q, verwacht] = r.split(/\s*=>\s*/).map(s => s && s.trim());
    const res = await p.evaluate(async q => { window.LK.ga('/', true); await new Promise(r => setTimeout(r, 30));
      const f = document.querySelector('[data-zoek]'); const i = f.querySelector('input'); i.value = q;
      f.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })); await new Promise(r => setTimeout(r, 60));
      return location.pathname + location.search; }, q);
    const ok = verwacht ? decodeURIComponent(res).replace(/\/$/, '').startsWith(verwacht.replace(/\/$/, '')) : null;
    if (ok === true) goed++; if (ok === false) fout++;
    uit.push({ q, naar: decodeURIComponent(res), verwacht, ok }); }
  fs.writeFileSync(process.argv[3], JSON.stringify(uit, null, 1));
  for (const r of uit) console.log(r.ok === false ? 'FOUT' : r.ok ? ' ok ' : '  - ', r.q.padEnd(34), '->', r.naar.slice(0, 90), r.ok === false ? '   (verwacht ' + r.verwacht + ')' : '');
  console.log('goed', goed, 'fout', fout, 'paginafouten', f.length, f.slice(0, 2)); await b.close(); })();
