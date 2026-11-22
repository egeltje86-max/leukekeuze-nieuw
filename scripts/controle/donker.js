/* DONKERE VERSIE nakijken (22-11-2026): zoekt in de donkere versie tekst die bijna dezelfde kleur heeft als wat erachter ligt.
   Kijkt naar alle zichtbare tekst (niet alleen knoppen, zoals leesbaar.js), telefoon en computer.
   Gebruik: lokale server op poort 8765 (node scripts/controle/keuring/server.js . 8765), dan:
   node scripts/controle/donker.js scripts/controle/leesbaar-paden.txt [licht]   ('licht' = dezelfde controle op de lichte versie met de kop van COMBI) */
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
const paden = fs.readFileSync(process.argv[2], 'utf8').split('\n').map(x => x.trim()).filter(Boolean);
const licht = process.argv[3] === 'licht';
const sj = fs.readFileSync(path.join(__dirname, '..', '..', 'sjabloon.html'), 'utf8'); const a = sj.indexOf('<meta name="lk-donker"'), b = sj.indexOf('</script>', a) + 9; const blok = sj.slice(a, b);
(async () => {
  const br = await chromium.launch(); const gevonden = {};
  for (const w of [390, 1280]) {
    const ctx = await br.newContext({ viewport: { width: w, height: 900 }, colorScheme: licht ? 'light' : 'dark',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1' });
    await ctx.addInitScript(() => { Object.defineProperty(navigator, 'webdriver', { get: () => false }); try { localStorage.setItem('lkcombi', '1'); localStorage.removeItem('lkthema'); } catch (e) {} });
    /* een pagina van een oudere bouw heeft het stukje van COMBI nog niet: dan zetten we het erin */
    await ctx.route('**/*', async (route) => { const r = route.request(); if (r.resourceType() !== 'document') return route.continue(); const resp = await route.fetch(); let body = await resp.text();
      if (body.indexOf('name="lk-donker"') === -1) body = body.replace('</head>', blok + '\n</head>'); route.fulfill({ response: resp, body, headers: Object.assign({}, resp.headers(), { 'content-type': 'text/html; charset=utf-8' }) }); });
    const p = await ctx.newPage();
    for (const pad of paden) {
      await p.goto('http://localhost:8765' + pad, { waitUntil: 'domcontentloaded' }).catch(() => {}); await p.waitForTimeout(1200);
      await p.evaluate(async () => { for (let y = 0; y < Math.min(document.body.scrollHeight, 9000); y += 700) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); } window.scrollTo(0, 0); }).catch(() => {});
      const r = await p.evaluate(() => {
        const rgb = (s) => { const m = /rgba?\(([^)]+)\)/.exec(s); if (!m) return null; const d = m[1].split(/[\s,\/]+/).filter(Boolean).map(Number); return { r: d[0], g: d[1], b: d[2], a: d.length > 3 ? d[3] : 1 }; };
        const lum = (c) => { const f = (v) => { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); }; return .2126 * f(c.r) + .7152 * f(c.g) + .0722 * f(c.b); };
        const con = (x, y) => { const p = lum(x), q = lum(y); return (Math.max(p, q) + .05) / (Math.min(p, q) + .05); };
        const meng = (v, o) => ({ r: v.r * v.a + o.r * (1 - v.a), g: v.g * v.a + o.g * (1 - v.a), b: v.b * v.a + o.b * (1 - v.a), a: 1 });
        const achter = (e) => { const lagen = [];
          for (let x = e; x; x = x.parentElement) { const cs = getComputedStyle(x);
            if (cs.backgroundImage !== 'none') { if (/url\(/.test(cs.backgroundImage) && !/gradient/.test(cs.backgroundImage)) return null; const m = cs.backgroundImage.match(/rgba?\([^)]+\)/g); if (m) { const k = rgb(m[Math.floor(m.length / 2)]); if (k && k.a > 0) { lagen.push(k); if (k.a >= 1) break; } } }
            const c = rgb(cs.backgroundColor); if (c && c.a > 0) { lagen.push(c); if (c.a >= 1) break; }
            if (x.tagName === 'PICTURE' || (x.querySelector && x !== e && x.firstElementChild && x.firstElementChild.tagName === 'IMG' && getComputedStyle(x.firstElementChild).position === 'absolute')) return null; }
          let basis = rgb(getComputedStyle(document.documentElement).backgroundColor) || { r: 255, g: 255, b: 255, a: 1 }; if (basis.a < 1) basis = { r: 255, g: 255, b: 255, a: 1 };
          for (let i = lagen.length - 1; i >= 0; i--) basis = meng(lagen[i], basis); return basis; };
        const uit = new Set(), zien = new WeakSet();
        const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        for (let n = tw.nextNode(); n; n = tw.nextNode()) {
          const t = n.textContent.replace(/\s+/g, ' ').trim(); if (t.length < 2) continue;
          const e = n.parentElement; if (!e || zien.has(e)) continue; zien.add(e);
          if (e.closest('[hidden],script,style,template,noscript,[aria-hidden="true"] svg')) continue;
          const cs = getComputedStyle(e); if (cs.visibility === 'hidden' || +cs.opacity < .3) continue;
          const rc = e.getBoundingClientRect(); if (rc.width < 4 || rc.height < 4) continue;
          if (getComputedStyle(e).webkitTextFillColor && /rgba?\(0, 0, 0, 0\)/.test(getComputedStyle(e).webkitTextFillColor)) continue; /* verloop-tekst */
          const bg = achter(e); if (!bg) continue; const kl = rgb(cs.webkitTextFillColor && cs.webkitTextFillColor !== cs.color ? cs.webkitTextFillColor : cs.color); if (!kl || kl.a < .3) continue;
          const k = con(meng(kl, bg), bg); const groot = parseFloat(cs.fontSize) >= 18.5 || (parseFloat(cs.fontSize) >= 14 && +cs.fontWeight >= 700);
          if (k < (groot ? 2.6 : 3.2)) { let id = e.tagName.toLowerCase() + (e.className && typeof e.className === 'string' ? '.' + e.className.trim().split(/\s+/).slice(0, 2).join('.') : ''); const ouder = e.parentElement; if (ouder && ouder.className && typeof ouder.className === 'string') id = '.' + ouder.className.trim().split(/\s+/)[0] + ' > ' + id;
            uit.add(id.slice(0, 60) + ' | "' + t.slice(0, 24) + '" | ' + cs.color + ' op ' + [bg.r, bg.g, bg.b].map(Math.round).join(',') + ' | ' + k.toFixed(1)); }
        }
        return [...uit];
      }).catch(e => ['FOUT ' + e.message.slice(0, 80)]);
      for (const x of r) { const sleutel = x.replace(/ \| "[^"]*"/, ''); (gevonden[sleutel] = gevonden[sleutel] || { voorbeeld: x, waar: [] }).waar.push(w + ' ' + pad); }
    }
    await ctx.close();
  }
  const k = Object.keys(gevonden); console.log(paden.length + ' pagina\'s x 2 breedtes (' + (licht ? 'licht' : 'donker') + '); slecht leesbaar:', k.length);
  for (const x of k) console.log(' ', gevonden[x].voorbeeld, '  <-', gevonden[x].waar.slice(0, 2).join(' ; ') + (gevonden[x].waar.length > 2 ? ' (+' + (gevonden[x].waar.length - 2) + ')' : ''));
  await br.close();
})();
