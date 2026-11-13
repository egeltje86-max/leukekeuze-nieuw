const { chromium } = require('playwright'); const BASIS = 'http://localhost:' + (process.env.POORT || 8765);
(async () => { const b = await chromium.launch();
  const nieuw = async () => { const c = await b.newContext({ viewport: { width: 390, height: 800 }, isMobile: true, hasTouch: true }); await c.route('**/*', r => r.request().url().startsWith(BASIS) ? r.continue() : r.abort()); const p = await c.newPage(); p._f = []; p.on('pageerror', e => p._f.push(String(e.message).slice(0, 120))); return { c, p }; };
  const open = async (p, pad) => { await p.goto(BASIS + pad, { waitUntil: 'load' }); await p.waitForFunction(() => document.documentElement.classList.contains('lk-gestart'), null, { timeout: 30000 }); await p.waitForTimeout(600); };
  { const { c, p } = await nieuw(); await open(p, '/lijst/?n=Marius&p=dvzn-995816.dvzn-c15dcffb40.bestaat-niet-123');
    const r = await p.evaluate(() => ({ h1: (document.querySelector('#app h1') || {}).textContent, kaarten: [...document.querySelectorAll('#app article.prodkaart [data-fav]')].map(x => x.getAttribute('data-fav')), tekst: document.querySelector('#app').innerText.replace(/\s+/g, ' ').slice(0, 260), knoppen: [...document.querySelectorAll('#app .knop, #app button')].map(x => x.textContent.trim().slice(0, 30)).filter(Boolean).slice(0, 8) }));
    console.log((r.kaarten.length === 2 ? 'GOED' : 'FOUT') + '  gedeeld lijstje (2 echte cadeaus + 1 dat niet bestaat): ' + JSON.stringify(r).slice(0, 560) + ' | fouten ' + p._f.length); await c.close(); }
  { const { c, p } = await nieuw(); await open(p, '/vonk/?voor=haar&moment=verjaardag&budget=tot25');
    const k = p.locator('#app [data-vonk-goedkoper]').first(); const id = await k.getAttribute('data-vonk-goedkoper'); const was = await p.evaluate(id => window.LK.vind(id).prijs, id);
    const plek = await p.evaluate(() => [...document.querySelectorAll('#app [data-vonk-keus]')].map(x => (x.querySelector('[data-vonk-goedkoper]') || {}).getAttribute ? x.querySelector('[data-vonk-goedkoper]').getAttribute('data-vonk-goedkoper') : ''));
    await k.click(); await p.waitForTimeout(500);
    const na = await p.evaluate(() => [...document.querySelectorAll('#app [data-vonk-keus]')].map(x => { const g = x.querySelector('[data-vonk-goedkoper]'); return g ? g.getAttribute('data-vonk-goedkoper') : (x.textContent.replace(/\s+/g, ' ').trim().slice(-50)); }));
    const nieuwId = na[plek.indexOf(id)], nu = await p.evaluate(id => (window.LK.vind(id) || {}).prijs, nieuwId);
    console.log((typeof nu === 'number' && nu < was * 0.8 ? 'GOED' : (nu === undefined ? 'LET OP' : 'FOUT')) + '  Goedkoper: was € ' + was + ' (' + id + '), nu € ' + nu + ' (' + String(nieuwId).slice(0, 60) + ') | fouten ' + p._f.length); await c.close(); }
  // rijmmachine: invullen en versturen terwijl het internet dicht is
  { const { c, p } = await nieuw(); await open(p, '/sint-rijmmachine/');
    await p.fill('#app input[name="naam"]', 'Oma Riet').catch(e => console.log('naam', e.message.split('\n')[0]));
    const kn = await p.evaluate(() => [...document.querySelectorAll('#app button, #app [type=submit]')].map(x => (x.getAttribute('type') || '') + ':' + x.textContent.replace(/\s+/g, ' ').trim().slice(0, 28) + ':' + [...x.attributes].map(a => a.name).filter(n => /^data-/.test(n)).join(',')).slice(-8));
    console.log('     rijmmachine knoppen onderaan: ' + kn.join(' | ').slice(0, 400));
    const maak = p.locator('#app button[type=submit], #app [data-rijm-maak], #app form button.knop-goud').last(); if (await maak.count()) { await maak.scrollIntoViewIfNeeded(); await maak.click(); await p.waitForTimeout(6000);
      const r = await p.evaluate(() => ({ fout: [...document.querySelectorAll('#app [data-rijm-fout], #app .rijm-fout, #app [role=alert]')].map(x => x.textContent.replace(/\s+/g, ' ').trim()).filter(Boolean).join(' / ').slice(0, 200), wacht: [...document.querySelectorAll('#app [data-rijm-wacht]')].map(x => (x.hidden ? '(verborgen) ' : '') + x.textContent.replace(/\s+/g, ' ').trim().slice(0, 80)).join(' / '), tekst: document.querySelector('#app').innerText.replace(/\s+/g, ' ').slice(0, 200) }));
      console.log('     rijmmachine zonder internet na 6 s: ' + JSON.stringify(r).slice(0, 600) + ' | fouten ' + p._f.length + ' ' + p._f.join(';')); }
    await c.close(); }
  await b.close(); })();
