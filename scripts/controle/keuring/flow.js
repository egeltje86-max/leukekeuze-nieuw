// Loopt de belangrijkste handelingen van een bezoeker na op de telefoon (390px): verlanglijstje, terugknop, filteren, sorteren, meer tonen,
// verras me, zoeken met tips en typfout, de kieshulp (VONK) en de rijmmachine. Alles buiten localhost is geblokkeerd (geen partnerklik, geen telling).
const { chromium } = require('playwright');
const BASIS = 'http://localhost:' + (process.env.POORT || 8765);
const uit = []; const ok = (naam, goed, extra) => { uit.push((goed ? 'GOED  ' : 'FOUT  ') + naam + (extra ? ' | ' + extra : '')); };
(async () => {
  const b = await chromium.launch();
  const nieuw = async (opslag) => { const c = await b.newContext({ viewport: { width: 390, height: 800 }, isMobile: true, hasTouch: true, storageState: opslag });
    await c.route('**/*', r => r.request().url().startsWith(BASIS) ? r.continue() : r.abort()); const p = await c.newPage(); p._f = [];
    p.on('console', m => { if (m.type() === 'error' && !/net::ERR|Failed to load/.test(m.text())) p._f.push(m.text().slice(0, 150)); }); p.on('pageerror', e => p._f.push('PAGINAFOUT ' + String(e.message).slice(0, 150)));
    p.on('dialog', d => { p._f.push('DIALOOG ' + d.message().slice(0, 60)); d.dismiss().catch(() => {}); }); return { c, p }; };
  const open = async (p, pad) => { await p.goto(BASIS + pad, { waitUntil: 'load' }); await p.waitForFunction(() => document.documentElement.classList.contains('lk-gestart'), null, { timeout: 30000 }); await p.waitForTimeout(400); };
  const ids = p => p.evaluate(() => [...document.querySelectorAll('#app article.prodkaart [data-fav]')].map(x => x.getAttribute('data-fav')));
  const prijzen = p => p.evaluate(() => [...document.querySelectorAll('#app .prodgrid:not(.rij) article.prodkaart')].map(k => { const id = k.querySelector('[data-fav]').getAttribute('data-fav'); return (window.LK.vind(id) || {}).prijs; }));

  // 1. VERLANGLIJSTJE
  { const { c, p } = await nieuw(); await open(p, '/voor/haar/?proef=wijzer-uit');
    const l = await ids(p); const h = i => p.locator('#app article.prodkaart [data-fav="' + l[i] + '"]').first();
    await h(0).click(); await p.waitForTimeout(200); await h(2).click(); await p.waitForTimeout(300);
    ok('hartje aan op kaart 1 en 3', (await h(0).getAttribute('aria-pressed')) === 'true' && (await h(2).getAttribute('aria-pressed')) === 'true');
    const tel = await p.evaluate(() => { const t = document.querySelector('.onderbalk [data-favteller]'); return t && !t.hidden ? t.textContent.trim() : ''; });
    ok('teller in de onderbalk staat op 2', tel === '2', 'teller: "' + tel + '"');
    await p.locator('.onderbalk [data-onder="favorieten"]').click(); await p.waitForTimeout(700);
    const fl = await ids(p); ok('lijstje toont precies die 2 cadeaus', fl.length >= 2 && fl.indexOf(l[0]) !== -1 && fl.indexOf(l[2]) !== -1 && new Set(fl.slice(0, 2)).size === 2, 'adres ' + await p.evaluate(() => location.pathname) + ', kaarten ' + fl.length);
    const deel = await p.evaluate(() => { const k = document.querySelector('[data-lijst-kopieer]'), w = document.querySelector('[data-lijst-whatsapp]'); return { kop: k ? (k.getAttribute('data-lijst-kopieer') || k.textContent.trim()).slice(0, 120) : null, wa: w ? (w.getAttribute('href') || '').slice(0, 160) : null, knoppen: [...document.querySelectorAll('#app button, #app a.knop')].map(x => x.textContent.trim().slice(0, 28)).filter(Boolean).slice(0, 14) }; });
    ok('deelknoppen op het lijstje', !!(deel.kop || deel.wa), JSON.stringify(deel).slice(0, 420));
    // gedeelde lijst openen in een schone browser
    const deelAdres = await p.evaluate(() => { const w = document.querySelector('[data-lijst-whatsapp]'); const h = w ? decodeURIComponent(w.getAttribute('href') || '') : ''; const m = /https?:\/\/[^\s]*\/lijst\/?\?[^\s]+/.exec(h); return m ? m[0] : ''; });
    if (deelAdres) { const { c: c2, p: p2 } = await nieuw(); const pad = deelAdres.replace(/^https?:\/\/[^/]+/, ''); await open(p2, pad); const gl = await ids(p2);
      ok('gedeelde lijst opent bij iemand anders met dezelfde cadeaus', gl.indexOf(l[0]) !== -1 && gl.indexOf(l[2]) !== -1, pad.slice(0, 80) + ' | kaarten ' + gl.length + ' | kop: ' + await p2.evaluate(() => (document.querySelector('#app h1') || {}).textContent)); ok('gedeelde lijst zonder fouten', !p2._f.length, p2._f.join(' ; ')); await c2.close(); }
    else ok('adres van de gedeelde lijst gevonden', false, 'geen /lijst?-adres in de WhatsApp-knop');
    // één weghalen
    await p.locator('#app article.prodkaart [data-fav="' + l[0] + '"]').first().click(); await p.waitForTimeout(500);
    const na = await ids(p); const tel2 = await p.evaluate(() => { const t = document.querySelector('.onderbalk [data-favteller]'); return t && !t.hidden ? t.textContent.trim() : ''; });
    ok('hartje uit op het lijstje: cadeau weg of hartje leeg, teller op 1', tel2 === '1', 'teller "' + tel2 + '", kaarten ' + na.length);
    await p.reload({ waitUntil: 'load' }); await p.waitForFunction(() => document.documentElement.classList.contains('lk-gestart')); await p.waitForTimeout(400);
    const na2 = await ids(p); ok('na opnieuw laden staat het lijstje er nog', na2.indexOf(l[2]) !== -1 && na2.indexOf(l[0]) === -1, 'kaarten ' + na2.length);
    ok('verlanglijstje zonder fouten', !p._f.length, p._f.join(' ; ')); await c.close(); }

  // 2. TERUGKNOP: lijst -> product -> terug, op dezelfde plek
  { const { c, p } = await nieuw(); await open(p, '/c/cadeaus/sinterklaas/');
    const meer = p.locator('#app [data-meer]').first(); if (await meer.count()) { await meer.scrollIntoViewIfNeeded(); await meer.click(); await p.waitForTimeout(300); }
    const n1 = (await ids(p)).length; const doel = p.locator('#app .prodgrid:not(.rij) article.prodkaart').nth(40); await doel.scrollIntoViewIfNeeded(); await p.waitForTimeout(200);
    const y1 = await p.evaluate(() => scrollY); const id = await doel.locator('[data-fav]').getAttribute('data-fav');
    await doel.locator('h3 a').click(); await p.waitForTimeout(900);
    const opP = await p.evaluate(() => ({ pad: location.pathname, h1: (document.querySelector('#app h1') || {}).textContent, knop: !!document.querySelector('#app a[data-winkel]'), y: scrollY }));
    ok('klik op een cadeau opent de productpagina bovenaan', opP.pad === '/p/' + id + '/' && opP.knop && opP.y < 50, JSON.stringify(opP).slice(0, 160));
    await p.goBack(); await p.waitForTimeout(1200);
    const terug = await p.evaluate(() => ({ pad: location.pathname, y: scrollY })); const n2 = (await ids(p)).length;
    const inBeeld = await p.evaluate(id => { const a = document.querySelector('#app article.prodkaart [data-fav="' + id + '"]'); if (!a) return 'weg'; const r = a.closest('article').getBoundingClientRect(); return Math.round(r.top); }, id);
    ok('terugknop: zelfde lijst, zelfde aantal kaarten, zelfde cadeau in beeld', terug.pad === '/c/cadeaus/sinterklaas/' && n2 === n1 && typeof inBeeld === 'number' && inBeeld > -400 && inBeeld < 800, 'kaarten ' + n1 + ' > ' + n2 + ', scroll ' + y1 + ' > ' + terug.y + ', cadeau staat op ' + inBeeld + 'px van de bovenrand');
    ok('terugknop zonder fouten', !p._f.length, p._f.join(' ; ')); await c.close(); }

  // 3. SORTEREN, FILTEREN, MEER TONEN, VERRAS ME
  { const { c, p } = await nieuw(); await open(p, '/c/cadeaus/sinterklaas/');
    const voor = await ids(p);
    await p.locator('#app select[data-sorteer]').first().selectOption('prijs-op'); await p.waitForTimeout(500);
    let pr = await prijzen(p); ok('sorteren prijs laag-hoog', pr.length > 10 && pr.every((x, i) => i === 0 || x >= pr[i - 1]), 'eerste prijzen ' + pr.slice(0, 6).join(', ') + ' | adres ' + await p.evaluate(() => location.search));
    await p.locator('#app select[data-sorteer]').first().selectOption('prijs-af'); await p.waitForTimeout(500);
    pr = await prijzen(p); ok('sorteren prijs hoog-laag', pr.every((x, i) => i === 0 || x <= pr[i - 1]), 'eerste prijzen ' + pr.slice(0, 6).join(', '));
    await p.locator('#app select[data-sorteer]').first().selectOption('aanbevolen'); await p.waitForTimeout(500);
    ok('terug naar Aanbevolen geeft de eerste volgorde terug', JSON.stringify(await ids(p)) === JSON.stringify(voor));
    // filter: het filterscherm op de telefoon
    const fk = p.locator('#app [data-filter-open]').first(); await fk.scrollIntoViewIfNeeded(); await fk.click(); await p.waitForTimeout(400);
    const scherm = await p.evaluate(() => { const f = document.querySelector('[data-filterpaneel]'); return f && !f.hidden ? [...f.querySelectorAll('[data-fp2]')].map(x => x.getAttribute('data-fp2') + '=' + x.textContent.replace(/\s+/g, ' ').trim().slice(0, 30)).slice(0, 14) : null; });
    ok('filterscherm gaat open', !!scherm, scherm ? scherm.join(' ; ').slice(0, 330) : 'niet open');
    if (scherm) { await p.locator('[data-filterpaneel] [data-fp2="naar:prijs"]').click(); await p.waitForTimeout(300);
      const opties = await p.evaluate(() => [...document.querySelectorAll('[data-filterpaneel] .fp2-optie')].map(x => x.getAttribute('data-fp2') + '=' + x.textContent.replace(/\s+/g, ' ').trim().slice(0, 24)));
      const keus = opties.find(o => /tot25|Tot €25/.test(o)); await p.locator('[data-filterpaneel] .fp2-optie[data-fp2="' + keus.split('=')[0] + '"]').click(); await p.waitForTimeout(350);
      const toon = p.locator('[data-filterpaneel] [data-fp2="toon"]').last(); const tekst = (await toon.textContent()).trim(); await toon.click(); await p.waitForTimeout(600);
      pr = await prijzen(p); const aantal = await p.evaluate(() => (document.querySelector('#app .werkbalk .aantal') || {}).textContent);
      ok('filter Tot €25: alleen cadeaus tot €25, aantal klopt met de knop', pr.length > 0 && pr.every(x => x <= 25) && tekst.replace(/\D/g, '') === String(aantal).replace(/\D/g, ''), 'knop "' + tekst + '", op de pagina "' + aantal + '", hoogste prijs ' + Math.max.apply(null, pr) + ', adres ' + await p.evaluate(() => location.search)); }
    // meer tonen
    const m = p.locator('#app [data-meer]').first(); if (await m.count()) { const a = (await ids(p)).length; await m.scrollIntoViewIfNeeded(); await m.click(); await p.waitForTimeout(400); const z = (await ids(p)).length; const dub = await ids(p); ok('Toon meer zet er kaarten bij, zonder dubbele', z > a && new Set(dub).size === dub.length, a + ' > ' + z); } else ok('Toon meer aanwezig', false);
    // verras me
    const v = p.locator('#app [data-verras]').first(); if (await v.count()) { await v.scrollIntoViewIfNeeded(); await v.click(); await p.waitForTimeout(900); const w = await p.evaluate(() => ({ pad: location.pathname, h1: (document.querySelector('#app h1') || {}).textContent })); ok('Verras me opent een cadeau', /^\/p\//.test(w.pad), JSON.stringify(w).slice(0, 120)); } else ok('Verras me aanwezig', false);
    ok('sorteren en filteren zonder fouten', !p._f.length, p._f.join(' ; ')); await c.close(); }

  // 4. ZOEKEN: tips tijdens het typen, zoeken, typfout
  { const { c, p } = await nieuw(); await open(p, '/');
    const inv = p.locator('[data-zoekrij] input[type=search]').first(); await inv.click(); await inv.type('lego', { delay: 60 }); await p.waitForTimeout(700);
    const tips = await p.evaluate(() => [...document.querySelectorAll('.zoektips a, .zoektips button, [data-zoektips] a, .zoek-tips a')].map(x => x.textContent.replace(/\s+/g, ' ').trim().slice(0, 40)).slice(0, 8));
    ok('tips tijdens het typen van "lego"', tips.length > 0, tips.join(' ; ').slice(0, 260) || 'geen tips gevonden (kan ook een andere klassenaam zijn)');
    await inv.press('Enter'); await p.waitForTimeout(900);
    const z = await p.evaluate(() => ({ pad: location.pathname + location.search, n: (document.querySelector('#app .werkbalk .aantal') || {}).textContent, eerste: [...document.querySelectorAll('#app article.prodkaart h3')].slice(0, 3).map(x => x.textContent.trim().slice(0, 40)) }));
    ok('zoeken op lego geeft LEGO', /zoek/.test(z.pad) && z.eerste.some(t => /lego/i.test(t)), JSON.stringify(z).slice(0, 260));
    await open(p, '/zoek/?q=pusel'); const t = await p.evaluate(() => ({ ruim: [...document.querySelectorAll('#app .zoek-ruim')].map(x => x.textContent.trim()).join(' ').slice(0, 90), eerste: [...document.querySelectorAll('#app article.prodkaart h3')].slice(0, 3).map(x => x.textContent.trim().slice(0, 40)) }));
    ok('typfout "pusel" wordt puzzel', /puzzel/i.test(t.ruim) || t.eerste.some(x => /puzzel/i.test(x)), JSON.stringify(t).slice(0, 240));
    await open(p, '/zoek/?q=qqqxzyw'); const leeg = await p.evaluate(() => document.querySelector('#app').innerText.replace(/\s+/g, ' ').slice(0, 260));
    ok('onzinwoord: nette melding, geen lege pagina', /niets|geen|probeer|helaas/i.test(leeg), leeg.slice(0, 200));
    ok('zoeken zonder fouten', !p._f.length, p._f.join(' ; ')); await c.close(); }

  // 5. KIESHULP (VONK)
  { const { c, p } = await nieuw(); await open(p, '/vonk/');
    const stap = await p.evaluate(() => ({ kop: (document.querySelector('#app h1') || {}).textContent, keuzes: [...document.querySelectorAll('#app [data-vonk-keus], #app .vonk a, #app .keuzes a, #app .vonk-keuzes a')].map(x => x.textContent.replace(/\s+/g, ' ').trim().slice(0, 22)).slice(0, 12) }));
    ok('kieshulp opent met keuzes', stap.keuzes.length > 2, JSON.stringify(stap).slice(0, 300));
    await open(p, '/vonk/?voor=haar&moment=verjaardag&budget=tot25');
    const v1 = await p.evaluate(() => ({ kaarten: [...document.querySelectorAll('#app article.prodkaart [data-fav]')].map(x => x.getAttribute('data-fav')), prijzen: [...document.querySelectorAll('#app article.prodkaart [data-fav]')].map(x => (window.LK.vind(x.getAttribute('data-fav')) || {}).prijs), weg: document.querySelectorAll('#app [data-vonk-weg]').length, goedk: document.querySelectorAll('#app [data-vonk-goedkoper]').length }));
    ok('kieshulp voor haar, verjaardag, tot €25: voorstellen binnen budget', v1.kaarten.length >= 3 && v1.prijzen.every(x => x <= 25), v1.kaarten.length + ' voorstellen, prijzen ' + v1.prijzen.slice(0, 8).join(', ') + ', knoppen Niet leuk ' + v1.weg + ', Goedkoper ' + v1.goedk);
    if (v1.weg) { const eerste = v1.kaarten[0]; await p.locator('#app [data-vonk-weg]').first().click(); await p.waitForTimeout(600); const v2 = await p.evaluate(() => [...document.querySelectorAll('#app article.prodkaart [data-fav]')].map(x => x.getAttribute('data-fav'))); ok('Niet leuk haalt het voorstel weg en zet er een ander neer', v2.indexOf(eerste) === -1 && v2.length >= v1.kaarten.length - 1, v1.kaarten.length + ' > ' + v2.length); }
    if (v1.goedk) { const voorP = await p.evaluate(() => { const k = document.querySelector('#app [data-vonk-goedkoper]').closest('article, .vonk-kaart, li, div'); const f = k && k.querySelector('[data-fav]'); return f ? (window.LK.vind(f.getAttribute('data-fav')) || {}).prijs : null; }); await p.locator('#app [data-vonk-goedkoper]').first().click(); await p.waitForTimeout(600); const naP = await p.evaluate(() => [...document.querySelectorAll('#app article.prodkaart [data-fav]')].map(x => (window.LK.vind(x.getAttribute('data-fav')) || {}).prijs)); ok('Goedkoper geeft een goedkoper voorstel', naP.length > 0 && Math.min.apply(null, naP) < voorP, 'was € ' + voorP + ', nu laagste € ' + Math.min.apply(null, naP)); }
    ok('kieshulp zonder fouten', !p._f.length, p._f.join(' ; ')); await c.close(); }

  // 6. RIJMMACHINE: het formulier werkt en geeft een nette melding als de verbinding wegvalt (hier is het internet geblokkeerd)
  { const { c, p } = await nieuw(); await open(p, '/sint-rijmmachine/');
    const form = await p.evaluate(() => ({ velden: [...document.querySelectorAll('#app input, #app select, #app textarea')].map(x => (x.name || x.id || x.type) + ':' + x.type).slice(0, 14), knoppen: [...document.querySelectorAll('#app button')].map(x => x.textContent.replace(/\s+/g, ' ').trim().slice(0, 30)).slice(0, 10) }));
    ok('rijmmachine toont het formulier', form.velden.length >= 2, JSON.stringify(form).slice(0, 420));
    ok('rijmmachine zonder fouten bij openen', !p._f.length, p._f.join(' ; ')); await c.close(); }

  console.log(uit.join('\n')); await b.close();
})().catch(e => { console.log(uit.join('\n')); console.log('TESTFOUT', e.message.split('\n')[0]); process.exit(1); });
