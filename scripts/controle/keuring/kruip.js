// Loopt een lijst pagina's langs in een echte browser en schrijft per pagina wat er mis is.
// node kruip.js <padenbestand> <breedte> <uitbestand.jsonl> [parallel=3]
// Veiligheid: alles buiten localhost wordt tegengehouden (dus nooit een klik bij een partner, geen telling in GoatCounter).
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
const ROOT = '/home/claude/leukekeuze-nieuw', BASIS = 'http://localhost:8765';
const paden = fs.readFileSync(process.argv[2], 'utf8').split('\n').map(x => x.trim()).filter(Boolean);
const BR = +process.argv[3], UIT = process.argv[4], PAR = +process.argv[5] || 3;
const mobiel = BR < 700;
fs.writeFileSync(UIT, '');
const bestaat = {}; const opSchijf = (p) => { if (p in bestaat) return bestaat[p]; let f = path.join(ROOT, decodeURIComponent(p.split('?')[0].split('#')[0])); let ok = false; try { const s = fs.statSync(f); ok = s.isFile() || (s.isDirectory() && fs.existsSync(path.join(f, 'index.html'))); } catch (e) {} return (bestaat[p] = ok); };

async function eenPagina(ctx, pad) {
  const p = await ctx.newPage(); const r = { pad, br: BR, console: [], mislukt: [] };
  p.on('console', m => { if (m.type() === 'error') { const t = m.text(); if (!/net::ERR_(FAILED|ABORTED|BLOCKED)|Failed to load resource/.test(t)) r.console.push(t.slice(0, 220)); } });
  p.on('pageerror', e => r.console.push('PAGINAFOUT ' + String(e.message || e).slice(0, 220)));
  p.on('response', rs => { const u = rs.url(); if (u.startsWith(BASIS) && rs.status() >= 400) r.mislukt.push(rs.status() + ' ' + u.slice(BASIS.length, BASIS.length + 140)); });
  try {
    const t0 = Date.now();
    await p.goto(BASIS + pad, { waitUntil: 'load', timeout: 45000 });
    if (/^\/p\//.test(pad)) await p.mouse.wheel(0, 150); // productpagina: de lijst laadt pas als je iets doet
    await p.waitForFunction(() => window.LK && window.LK.ga, null, { timeout: 20000 }).catch(() => { r.console.push('APP START NIET (LK.ga ontbreekt na 20 s)'); });
    await p.waitForTimeout(700);
    r.ms = Date.now() - t0;
    // helemaal naar beneden en terug: luie plaatjes laden
    await p.evaluate(async () => { const h = document.documentElement.scrollHeight; for (let y = 0; y < Math.min(h, 9000); y += 700) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 40)); } window.scrollTo(0, 0); });
    await p.waitForTimeout(350);
    Object.assign(r, await p.evaluate(() => {
      const uit = {}; const de = document.documentElement; const vw = de.clientWidth;
      uit.titel = document.title; uit.h1 = [...document.querySelectorAll('h1')].map(h => h.textContent.replace(/\s+/g, ' ').trim()).filter(Boolean).slice(0, 3);
      uit.zijwaarts = de.scrollWidth - vw;
      const app = document.querySelector('#app') || document.body;
      const tekst = app.innerText || '';
      uit.tekens = tekst.length;
      uit.raar = [...new Set((tekst.match(/\bundefined\b|\bNaN\b|\[object Object\]|\bnull\b|€\s*-|€ ?0,00/g) || []))].slice(0, 5);
      uit.leeg = (tekst.match(/[^.\n]*(geen (cadeaus|producten|resultaten)|niets gevonden|nog niets|\b0 (cadeaus|producten|resultaten))[^.\n]*/i) || [''])[0].trim().slice(0, 120);
      // productkaarten
      const kaarten = [...app.querySelectorAll('article.prodkaart')];
      const ids = kaarten.map(k => { const a = k.querySelector('h3 a'); return a ? (a.getAttribute('href') || '').replace(/^\/p\//, '').replace(/\/.*$/, '') : '?'; });
      uit.kaarten = kaarten.length;
      const tel = {}; ids.forEach(i => tel[i] = (tel[i] || 0) + 1); uit.dubbelId = Object.keys(tel).filter(i => tel[i] > 1).slice(0, 8);
      const tt = {}; kaarten.forEach(k => { const t = (k.querySelector('h3') || {}).textContent || ''; const s = (k.querySelector('.shop') || {}).textContent || ''; const key = t.trim().toLowerCase() + '|' + s; tt[key] = (tt[key] || 0) + 1; });
      uit.dubbelTitel = Object.keys(tt).filter(i => tt[i] > 1).slice(0, 8);
      uit.top = kaarten.slice(0, 12).map((k, i) => ids[i] + '|' + ((k.querySelector('h3') || {}).textContent || '').trim().slice(0, 44) + '|' + ((k.querySelector('.prijs') || {}).textContent || '').trim().slice(0, 16) + '|' + ((k.querySelector('.shop') || {}).textContent || '').trim().slice(0, 14));
      uit.zonderPrijs = kaarten.filter(k => !/\d/.test((k.querySelector('.prijs') || {}).textContent || '')).length;
      // plaatjes
      const imgs = [...document.images];
      uit.plaatjes = imgs.length;
      uit.kapot = imgs.filter(i => i.complete && i.naturalWidth === 0 && (i.currentSrc || i.src)).map(i => (i.currentSrc || i.src).replace(location.origin, '').slice(0, 110)).slice(0, 10);
      uit.zonderAlt = imgs.filter(i => !i.hasAttribute('alt')).length;
      uit.srcs = [...new Set(imgs.flatMap(i => [i.getAttribute('src')].concat((i.getAttribute('srcset') || '').split(',').map(s => s.trim().split(' ')[0]))).filter(Boolean).filter(s => !/^data:|^https?:/.test(s)))];
      uit.extern = [...new Set(imgs.map(i => i.getAttribute('src') || '').filter(s => /^https?:/.test(s) && s.indexOf(location.origin) !== 0).map(s => s.slice(0, 90)))].slice(0, 5);
      // links
      const as = [...document.querySelectorAll('a[href]')];
      uit.links = [...new Set(as.map(a => a.getAttribute('href')).filter(h => h && h[0] === '/' && h[1] !== '/'))];
      uit.rareLinks = [...new Set(as.map(a => a.getAttribute('href')).filter(h => !h || h === '#' || /undefined|null|NaN|\[object/.test(h)))].slice(0, 6);
      uit.legeKnoppen = [...app.querySelectorAll('a, button')].filter(e => { const rc = e.getBoundingClientRect(); return rc.width > 8 && rc.height > 8 && !(e.textContent || '').trim() && !e.getAttribute('aria-label') && !e.querySelector('img[alt]:not([alt=""]), svg[aria-label]') && !e.title; }).map(e => (e.className || e.tagName).toString().slice(0, 40)).slice(0, 6);
      // winkelknop op de productpagina: zit de partnercode erin? (alleen kijken, nooit klikken)
      const wk = [...document.querySelectorAll('a[data-winkel]')];
      uit.winkel = wk.slice(0, 3).map(a => a.getAttribute('href') || '');
      // buiten scherm of kader (zelfde regels als scripts/controle/buiten.js)
      const buiten = [];
      const kader = (e) => { for (let x = e.parentElement; x && x !== document.body; x = x.parentElement) { const cs = getComputedStyle(x);
          if (/(auto|scroll|hidden)/.test(cs.overflowX)) return null; if (cs.position === 'fixed' || cs.position === 'sticky') return null;
          const rond = parseFloat(cs.borderTopLeftRadius) >= 10, rand = parseFloat(cs.borderTopWidth) > 0 && cs.borderTopStyle !== 'none';
          const vlak = cs.backgroundColor !== 'rgba(0, 0, 0, 0)' || cs.backgroundImage !== 'none';
          if (rond && (rand || vlak)) return x; } return null; };
      for (const e of document.querySelectorAll('#app a, #app button, #app .chip, #app h1, #app h2, #app h3, #app .label, #app p')) {
        const rc = e.getBoundingClientRect(); if (rc.width < 6 || rc.height < 6) continue; const cs = getComputedStyle(e); if (cs.visibility === 'hidden' || cs.position === 'absolute' || cs.position === 'fixed') continue;
        if (e.closest('[hidden]')) continue;
        const t = (e.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 26); if (!t) continue;
        if (rc.right > vw + 2 || rc.left < -2) { let schuif = false; for (let x = e.parentElement; x; x = x.parentElement) if (/(auto|scroll|hidden)/.test(getComputedStyle(x).overflowX)) { schuif = true; break; } if (!schuif) buiten.push('BUITEN SCHERM | ' + (e.className || e.tagName).toString().slice(0, 30) + ' | "' + t + '"'); continue; }
        if (e.tagName === 'P') continue;
        const k = kader(e); if (!k) continue; const kr = k.getBoundingClientRect();
        if (rc.right > kr.right + 2 || rc.left < kr.left - 2) buiten.push('buiten kader ' + (k.className || k.tagName).toString().slice(0, 30) + ' | ' + (e.className || e.tagName).toString().slice(0, 30) + ' | "' + t + '" | ' + Math.round(rc.right - kr.right) + 'px');
      }
      uit.buiten = [...new Set(buiten)].slice(0, 8);
      // tikvlakken op de telefoon: zichtbare knoppen/links in #app kleiner dan 32px hoog (alleen tellen)
      uit.kleinTik = [...app.querySelectorAll('button, a.knop, .chip')].filter(e => { const rc = e.getBoundingClientRect(); return rc.width > 0 && rc.height > 0 && rc.height < 30 && getComputedStyle(e).visibility !== 'hidden'; }).map(e => ((e.textContent || '').trim().slice(0, 18) + ' ' + Math.round(e.getBoundingClientRect().height))).slice(0, 5);
      // gegevens voor Google
      uit.canon = (document.querySelector('link[rel=canonical]') || {}).href || '';
      uit.robots = (document.querySelector('meta[name=robots]') || {}).content || '';
      uit.desc = ((document.querySelector('meta[name=description]') || {}).content || '').length;
      return uit;
    }));
    r.fotoMist = (r.srcs || []).filter(s => !opSchijf(s[0] === '/' ? s : '/' + s)).slice(0, 10);
    r.linkMist = (r.links || []).filter(h => !/^\/(zoek|vonk|favorieten|lijst)\b/.test(h) && !/\?naar=winkel/.test(h) && !opSchijf(h)).slice(0, 12);
    r.nLinks = (r.links || []).length; delete r.srcs; delete r.links;
  } catch (e) { r.fout = String(e.message || e).slice(0, 200); }
  await p.close();
  fs.appendFileSync(UIT, JSON.stringify(r) + '\n');
}

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext(mobiel ? { viewport: { width: BR, height: 800 }, isMobile: true, hasTouch: true, deviceScaleFactor: 1, userAgent: 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36' } : { viewport: { width: BR, height: 900 } });
  await ctx.route('**/*', route => route.request().url().startsWith(BASIS) ? route.continue() : route.abort());
  let i = 0; const t0 = Date.now();
  const werker = async () => { while (i < paden.length) { const pad = paden[i++]; await eenPagina(ctx, pad); if (i % 50 === 0) console.log(i + '/' + paden.length, Math.round((Date.now() - t0) / 1000) + 's'); } };
  await Promise.all(Array.from({ length: PAR }, werker));
  await b.close(); console.log('klaar', paden.length, 'pagina\'s', Math.round((Date.now() - t0) / 1000) + 's');
})();
