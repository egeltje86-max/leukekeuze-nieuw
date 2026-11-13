// Kijkt na dat de nieuwe manier (alleen aanpassen wat anders is) precies dezelfde pagina geeft als de oude (alles opnieuw tekenen).
// node morphtest.js <padenbestand> <breedte> [parallel]
const { chromium } = require('playwright'); const fs = require('fs');
const BASIS = 'http://localhost:' + (process.env.POORT || 8765);
const paden = fs.readFileSync(process.argv[2], 'utf8').split('\n').map(x => x.trim()).filter(Boolean); const BR = +process.argv[3], PAR = +process.argv[4] || 2;
(async () => { const b = await chromium.launch(); let i = 0, fout = 0, gelijk = 0; const t0 = Date.now();
  const ctx = async (init) => { const c = await b.newContext(BR < 700 ? { viewport: { width: BR, height: 800 }, isMobile: true, hasTouch: true } : { viewport: { width: BR, height: 900 } });
    await c.route('**/*', r => { const u = r.request().url(); return u.startsWith(BASIS) && !/\.(webp|jpg|png)(\?|$)/.test(u) ? r.continue() : r.abort(); }); if (init) await c.addInitScript(init); return c; };
  const WZ = process.env.WZ === 'b';
  const nieuw = await ctx(WZ ? () => { window.LK_MORPH_TEST = true; try { localStorage.setItem('lkwijzer', 'b!'); } catch (e) {} } : () => { window.LK_MORPH_TEST = true; }), oud = await ctx(WZ ? () => { window.LK_MORPH = false; try { localStorage.setItem('lkwijzer', 'b!'); } catch (e) {} } : () => { window.LK_MORPH = false; });
  const laad = async (c, pad) => { const p = await c.newPage(); const f = []; p.on('console', m => { if (m.type() === 'error' && /MORPH/.test(m.text())) f.push(m.text().slice(0, 400)); }); p.on('pageerror', e => f.push('PAGINAFOUT ' + e.message.slice(0, 200)));
    await p.goto(BASIS + pad, { waitUntil: 'load', timeout: 60000 }); if (/^\/p\//.test(pad)) await p.mouse.wheel(0, 100);
    await p.waitForFunction(() => document.documentElement.classList.contains('lk-gestart'), null, { timeout: 30000 }).catch(() => f.push('NIET GESTART')); await p.waitForTimeout(500);
    const h = await p.evaluate(() => { const a = document.querySelector('#app').cloneNode(true); a.querySelectorAll('[data-alle-winkels], [data-merkzoeker]').forEach(x => { x.innerHTML = ''; });
      a.querySelectorAll('*').forEach(e => { const at = [...e.attributes].map(x => [x.name, x.value]).sort((x, y) => x[0] < y[0] ? -1 : 1); at.forEach(x => e.removeAttribute(x[0])); at.forEach(x => e.setAttribute(x[0], x[1])); });
      return a.innerHTML; }); await p.close(); return { h, f }; };
  const werker = async () => { while (i < paden.length) { const pad = paden[i++];
      try { const [n, o] = [await laad(nieuw, pad), await laad(oud, pad)];
        const echt = n.f.concat(o.f).filter(x => !/MORPH-VERSCHIL/.test(x) || n.h !== o.h); if (echt.length) { fout++; console.log('FOUT', pad, echt.join(' | ').slice(0, 500)); }
        else if (n.h !== o.h) { fout++; let k = 0; while (k < n.h.length && n.h[k] === o.h[k]) k++; console.log('ANDERS', pad, 'vanaf', k, '\n   nieuw: ' + n.h.slice(Math.max(0, k - 50), k + 100).replace(/\s+/g, ' ') + '\n   oud:   ' + o.h.slice(Math.max(0, k - 50), k + 100).replace(/\s+/g, ' ')); }
        else gelijk++;
      } catch (e) { fout++; console.log('TESTFOUT', pad, String(e.message).slice(0, 120)); } } };
  await Promise.all(Array.from({ length: PAR }, werker));
  console.log(paden.length + ' pagina\'s op ' + BR + 'px: ' + gelijk + ' precies gelijk, ' + fout + ' niet. ' + Math.round((Date.now() - t0) / 1000) + ' s'); await b.close(); })();
