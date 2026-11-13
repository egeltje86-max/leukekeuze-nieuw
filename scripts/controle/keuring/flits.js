// Verspringt of verkleurt de pagina tussen 'eerste beeld' (alleen de gebouwde HTML), 'app.js is er' en 'app is gestart'?
// node flits.js <pad> [fix]   (fix = de vroege klassen uit het nieuwe sjabloon in de pagina zetten, zonder te bouwen)
// app.js komt 2,5 s later, de productlijst 5 s later; we meten alle zichtbare onderdelen op drie momenten.
const { chromium } = require('playwright'); const fs = require('fs');
const POORT = process.env.POORT || 8765, BASIS = 'http://localhost:' + POORT, pad = process.argv[2], FIX = process.argv[3] === 'fix', BR = +(process.env.BR || 390);
const sj = fs.readFileSync('/home/claude/leukekeuze-nieuw/sjabloon.html', 'utf8');
const vroegBody = (sj.match(/<body>\n([\s\S]*?)\n  <!-- Toegankelijkheid/) || [0, ''])[1];
const vroegKop = (sj.match(/  <!-- VROEG-NOVA[\s\S]*?<\/script>\n/) || [''])[0];
(async () => {
  const b = await chromium.launch(); const c = await b.newContext({ viewport: { width: BR, height: 800 }, isMobile: BR < 700, hasTouch: BR < 700, deviceScaleFactor: 1 });
  await c.route('**/*', async r => { const u = r.request().url(); if (!u.startsWith(BASIS)) return r.abort();
    if (/assets\/js\/app\.js/.test(u)) return setTimeout(() => r.continue(), 2500);
    if (/producten-lean\.js|assets\/pak\//.test(u)) return setTimeout(() => r.continue(), 5000);
    if (FIX && r.request().resourceType() === 'document') { const rs = await r.fetch(); let h = await rs.text();
      if (h.indexOf('nova4-target') === -1) h = h.replace('<body>\n', '<body>\n' + vroegBody + '\n');
      if (vroegKop && h.indexOf('VROEG-NOVA') === -1) h = h.replace('</head>', vroegKop + '</head>');
      return r.fulfill({ response: rs, body: h }); }
    return r.continue(); });
  const p = await c.newPage();
  await p.addInitScript(() => { window.__ls = []; try { new PerformanceObserver(l => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__ls.push({ t: Math.round(e.startTime), v: +e.value.toFixed(4), wat: (e.sources || []).slice(0, 3).map(s => s.node ? (s.node.nodeName + '.' + String(s.node.className || '').slice(0, 24)) : '?').join(', ') }); }).observe({ type: 'layout-shift', buffered: true }); } catch (e) {} });
  const meet = () => p.evaluate(() => { const uit = {}; const els = [...document.querySelectorAll('header, header *, .topbalk, .topbalk *, .zoekrij, .zoekrij *, .onderbalk *, #app > *, #app > * > *, #app > * > * > *, #app .prodkaart, .onderbalk, footer')].slice(0, 600);
    uit.maten = els.map(e => { const rc = e.getBoundingClientRect(); const cs = getComputedStyle(e); return { n: e.tagName + '.' + String(e.className).slice(0, 26), t: Math.round(rc.top + scrollY), h: Math.round(rc.height), w: Math.round(rc.width), kl: cs.color, bg: cs.backgroundColor, f: cs.fontFamily.slice(0, 14) + ' ' + cs.fontSize + ' ' + cs.fontWeight }; });
    uit.html = document.documentElement.className; uit.body = document.body.className; uit.hoog = document.documentElement.scrollHeight; return uit; });
  await p.goto(BASIS + pad, { waitUntil: 'commit' }); await p.waitForTimeout(1900);
  const A = await meet(); await p.screenshot({ path: 'flits-A.png' });
  await p.waitForFunction(() => window.LK && window.LK.zachtAf && document.querySelector('.onderbalk svg, header svg'), null, { timeout: 20000 }); await p.waitForTimeout(500);
  const B = await meet(); await p.screenshot({ path: 'flits-B.png' });
  await p.waitForFunction(() => document.documentElement.classList.contains('lk-gestart'), null, { timeout: 30000 }); await p.waitForTimeout(900);
  const C = await meet(); await p.screenshot({ path: 'flits-C.png' });
  const diff = (X, Y, naam) => { let n = 0; const regels = []; const m = Math.min(X.maten.length, Y.maten.length);
    for (let i = 0; i < m; i++) { const x = X.maten[i], y = Y.maten[i]; if (x.n !== y.n) { regels.push('  (andere opbouw vanaf onderdeel ' + i + ': ' + x.n + ' / ' + y.n + ')'); break; }
      const d = []; if (Math.abs(x.t - y.t) > 1) d.push('plek ' + x.t + '>' + y.t); if (Math.abs(x.h - y.h) > 1) d.push('hoogte ' + x.h + '>' + y.h); if (Math.abs(x.w - y.w) > 1) d.push('breedte ' + x.w + '>' + y.w); if (x.kl !== y.kl) d.push('kleur ' + x.kl + '>' + y.kl); if (x.bg !== y.bg) d.push('vlak ' + x.bg + '>' + y.bg); if (x.f !== y.f) d.push('letter ' + x.f + '>' + y.f);
      if (d.length) { n++; if (regels.length < 14) regels.push('  ' + x.n + ': ' + d.join(' | ')); } }
    console.log(naam + ': ' + n + ' van ' + m + ' onderdelen anders; html "' + X.html + '" > "' + Y.html + '"; body "' + X.body + '" > "' + Y.body + '"; hoogte pagina ' + X.hoog + ' > ' + Y.hoog); regels.forEach(r => console.log(r)); };
  diff(A, B, 'A (alleen HTML) -> B (app.js er)'); diff(B, C, 'B (app.js er) -> C (gestart)');
  console.log('verschuivingen:', JSON.stringify(await p.evaluate(() => window.__ls)));
  await b.close();
})();
