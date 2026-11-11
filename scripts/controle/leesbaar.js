/* Zoekt knoppen en labels waarvan de tekst bijna dezelfde kleur heeft als hun eigen achtergrond (11-11-2026, na de onleesbare knop 'Lekker rondkijken').
   Gebruik: start een lokale server (python3 -m http.server 8765) en draai: node scripts/controle/leesbaar.js scripts/controle/leesbaar-paden.txt */
const { chromium } = require('playwright'); const fs = require('fs');
const paden = fs.readFileSync(process.argv[2], 'utf8').split('\n').map(x => x.trim()).filter(Boolean);
(async () => {
  const b = await chromium.launch(); const gevonden = {};
  for (const br of [390, 1280]) {
    const c = await b.newContext({ viewport: { width: br, height: 900 } }); const p = await c.newPage();
    for (const pad of paden) {
      await p.goto('http://localhost:8765' + pad, { waitUntil: 'domcontentloaded' }).catch(() => {}); await p.waitForTimeout(900);
      const r = await p.evaluate(() => {
        const rgb = (s) => { const m = /rgba?\(([^)]+)\)/.exec(s); if (!m) return null; const d = m[1].split(',').map(Number); return { r: d[0], g: d[1], b: d[2], a: d.length > 3 ? d[3] : 1 }; };
        const lum = (c) => { const f = (v) => { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); }; return .2126 * f(c.r) + .7152 * f(c.g) + .0722 * f(c.b); };
        const con = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); };
        const meng = (v, o) => ({ r: v.r * v.a + o.r * (1 - v.a), g: v.g * v.a + o.g * (1 - v.a), b: v.b * v.a + o.b * (1 - v.a), a: 1 });
        const achter = (e) => { let lagen = []; for (let x = e; x; x = x.parentElement) { const cs = getComputedStyle(x); const c = rgb(cs.backgroundColor); if (cs.backgroundImage !== 'none' && !/gradient/.test(cs.backgroundImage)) return null; /* foto: onbekend */
            if (/gradient/.test(cs.backgroundImage)) { const m = cs.backgroundImage.match(/rgba?\([^)]+\)/g); if (m) { const k = rgb(m[0]); if (k.a > 0) { lagen.push(k); if (k.a >= 1) break; } } }
            else if (c && c.a > 0) { lagen.push(c); if (c.a >= 1) break; } }
          let basis = { r: 255, g: 255, b: 255, a: 1 }; for (let i = lagen.length - 1; i >= 0; i--) basis = meng(lagen[i], basis); return basis; };
        const uit = [];
        for (const e of document.querySelectorAll('a, button, .chip, .label, .st, [class*="knop"]')) {
          const t = (e.textContent || '').replace(/\s+/g, ' ').trim(); if (!t || t.length > 40) continue;
          const rc = e.getBoundingClientRect(); if (rc.width < 8 || rc.height < 8) continue; const cs = getComputedStyle(e); if (cs.visibility === 'hidden' || cs.display === 'none' || +cs.opacity < .3) continue;
          if (e.closest('[hidden]')) continue;
          const eigen = rgb(cs.backgroundColor); const heeftEigen = (eigen && eigen.a >= .5) || /gradient/.test(cs.backgroundImage);
          if (!heeftEigen) continue; /* alleen elementen met een eigen vlak: daar weten we de achtergrond zeker */
          const bg = achter(e); if (!bg) continue; const kl = rgb(cs.color); if (!kl) continue;
          const k = con(kl, bg); if (k < 2.6) uit.push((e.className || e.tagName).toString().slice(0, 40) + ' | "' + t.slice(0, 28) + '" | tekst ' + cs.color + ' op ' + Math.round(bg.r) + ',' + Math.round(bg.g) + ',' + Math.round(bg.b) + ' | ' + k.toFixed(1));
        }
        return uit;
      }).catch(e => ['FOUT ' + e.message.slice(0, 80)]);
      for (const x of r) { (gevonden[x] = gevonden[x] || []).push(br + ' ' + pad); }
    }
    await c.close();
  }
  const k = Object.keys(gevonden); console.log(paden.length + ' pagina\'s x 2 breedtes; slecht leesbaar:', k.length);
  for (const x of k) console.log(' ', x, '  <-', gevonden[x].slice(0, 3).join(' ; ') + (gevonden[x].length > 3 ? ' (+' + (gevonden[x].length - 3) + ')' : ''));
  await b.close();
})();
