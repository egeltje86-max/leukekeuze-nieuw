// Tikt op een pagina elke soort knop en link één keer echt aan en schrijft op wat er gebeurt.
// node tik.js <breedte> <uit.jsonl> <pad> [pad...]
// Veiligheid: alles buiten localhost is geblokkeerd; winkelknoppen (partnerlinks) worden nooit aangetikt, alleen bekeken.
const { chromium } = require('playwright'); const fs = require('fs');
const BASIS = 'http://localhost:' + (process.env.POORT || 8765); const BR = +process.argv[2], UIT = process.argv[3], paden = process.argv.slice(4);
const mobiel = BR < 700; fs.writeFileSync(UIT, '');
const CODE = /tag=leukekeuze-21|[?&_=]516846|s=1545784|[?&]a=3110079|awinaffid=3110079|wi=433339|aff=LEUKEKEUZE|denhertog/i;

const VERZAMEL = () => {
  // elke zichtbare knop/link krijgt een 'soort': zelfde soort = zelfde gedrag, daarvan tikken we er één aan
  const uit = []; const gezien = {};
  const els = [...document.querySelectorAll('a[href], button, select, summary, [role=button], input[type=checkbox], input[type=radio]')];
  els.forEach((e, i) => {
    const rc = e.getBoundingClientRect(); const cs = getComputedStyle(e);
    if (rc.width < 4 || rc.height < 4 || cs.visibility === 'hidden' || cs.display === 'none' || e.closest('[hidden]') || e.closest('[aria-hidden=true]')) return;
    const href = e.getAttribute('href') || ''; const data = [...e.attributes].map(a => a.name).filter(n => /^data-/.test(n)).sort().join(',');
    const waar = e.closest('.onderbalk') ? 'onderbalk' : e.closest('header') ? 'kop' : e.closest('footer') ? 'voet' : e.closest('.lade') ? 'lade' : e.closest('.megamenu') ? 'mega' : e.closest('[data-filterpaneel]') ? 'paneel' : e.closest('#app') ? 'app' : 'rest';
    const sectie = (e.closest('section, .paginakop, .werkbalk, .mobiel-balk, nav') || {}).className || '';
    let soort = waar + '|' + e.tagName + '|' + String(e.className).replace(/\s+/g, '.').slice(0, 40) + '|' + data + '|' + String(sectie).split(' ').slice(0, 2).join('.');
    if (e.tagName === 'A') soort += '|' + (/^https?:/.test(href) ? 'extern' : href.replace(/[?#].*$/, '').split('/').slice(0, 3).join('/'));
    if (waar === 'voet' || waar === 'lade' || waar === 'mega') soort = waar + '|' + e.tagName + '|' + data; // menu's: één per soort is genoeg
    e.setAttribute('data-tik', i);
    if (gezien[soort]) { gezien[soort].n++; return; }
    gezien[soort] = { soort, i, n: 1, tekst: (e.textContent || e.getAttribute('aria-label') || '').replace(/\s+/g, ' ').trim().slice(0, 40), href, extern: /^https?:/.test(href) || e.target === '_blank', tag: e.tagName, h: Math.round(rc.height), b: Math.round(rc.width) };
    uit.push(gezien[soort]);
  });
  return uit;
};

async function nieuwePagina(ctx, pad) {
  const p = await ctx.newPage(); p._fouten = [];
  p.on('console', m => { if (m.type() === 'error' && !/net::ERR_|Failed to load resource/.test(m.text())) p._fouten.push(m.text().slice(0, 160)); });
  p.on('pageerror', e => p._fouten.push('PAGINAFOUT ' + String(e.message).slice(0, 160)));
  p.on('dialog', d => { p._fouten.push('DIALOOG ' + d.type() + ' ' + d.message().slice(0, 80)); d.dismiss().catch(() => {}); });
  await p.goto(BASIS + pad, { waitUntil: 'load', timeout: 45000 });
  if (/^\/p\//.test(pad)) await p.mouse.wheel(0, 100);
  await p.waitForFunction(() => window.LK && window.LK.ga, null, { timeout: 20000 }).catch(() => {});
  await p.waitForTimeout(600);
  return p;
}
const STAAT = () => ({ url: location.pathname + location.search, tekst: (document.querySelector('#app') || document.body).innerText.length, html: document.body.innerHTML.length,
  open: [...document.querySelectorAll('.lade.open, .megamenu.open, [data-filterpaneel].open, body.plak-open, .filter-blad.open, dialog[open], .toast.zichtbaar, .toast.toon, [aria-expanded=true]')].length,
  toast: ((document.querySelector('.toast') || {}).textContent || '').trim().slice(0, 60), y: Math.round(scrollY), kaarten: document.querySelectorAll('article.prodkaart').length,
  focus: document.activeElement ? document.activeElement.tagName + '.' + String(document.activeElement.className).slice(0, 20) : '' });

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext(mobiel ? { viewport: { width: BR, height: 800 }, isMobile: true, hasTouch: true, deviceScaleFactor: 1 } : { viewport: { width: BR, height: 900 } });
  await ctx.route('**/*', r => r.request().url().startsWith(BASIS) ? r.continue() : r.abort());
  for (const pad of paden) {
    let p = await nieuwePagina(ctx, pad); const soorten = await p.evaluate(VERZAMEL); await p.close();
    console.log(pad, soorten.length, 'soorten knoppen/links');
    for (const s of soorten) {
      const r = { pad, br: BR, soort: s.soort, tekst: s.tekst, n: s.n, href: s.href.slice(0, 120), h: s.h };
      if (s.extern) { r.gedaan = 'niet getikt (gaat naar buiten)'; if (/\/p\/[^/]+\/\?naar=winkel/.test(s.href)) r.oordeel = 'ok kaartknop'; else if (/^https?:/.test(s.href)) r.oordeel = CODE.test(s.href) ? 'ok partnercode' : (/leukekeuze\.nl|wa\.me|goatcounter|instagram|tiktok|pinterest|facebook|mailto|rijksoverheid|acm\.nl|consuwijzer/.test(s.href) ? 'ok eigen/sociaal' : 'EXTERN ZONDER CODE'); else r.oordeel = 'nieuw tabblad'; fs.appendFileSync(UIT, JSON.stringify(r) + '\n'); continue; }
      try {
        p = await nieuwePagina(ctx, pad); await p.evaluate(VERZAMEL);
        const voor = await p.evaluate(STAAT);
        const el = p.locator('[data-tik="' + s.i + '"]').first();
        if (!(await el.count())) { r.oordeel = 'niet teruggevonden'; }
        else {
          await el.scrollIntoViewIfNeeded({ timeout: 3000 }).catch(() => {});
          if (s.tag === 'SELECT') { const opt = await el.evaluate(e => { const o = [...e.options].find(x => !x.selected); return o ? o.value : ''; }); if (opt) await el.selectOption(opt).catch(e => { r.klikfout = String(e.message).slice(0, 80); }); }
          else await el.click({ timeout: 4000 }).catch(async e => { r.klikfout = String(e.message).split('\n')[0].slice(0, 110); });
          await p.waitForTimeout(650);
          const na = await p.evaluate(STAAT).catch(() => null);
          if (!na) r.oordeel = 'pagina weg na klik';
          else {
            r.naar = na.url !== voor.url ? na.url : ''; r.kaarten = voor.kaarten + '>' + na.kaarten;
            const veranderd = na.url !== voor.url || Math.abs(na.html - voor.html) > 20 || na.open !== voor.open || na.toast !== voor.toast || Math.abs(na.y - voor.y) > 40 || na.tekst !== voor.tekst || na.focus !== voor.focus;
            r.oordeel = r.klikfout ? 'KLIK LUKTE NIET' : veranderd ? 'ok' : 'ER GEBEURT NIETS';
            if (na.toast && na.toast !== voor.toast) r.toast = na.toast;
            if (r.naar && na.tekst < 200) r.oordeel = 'LEGE PAGINA NA KLIK';
            const nf = await p.evaluate(() => /niet gevonden|bestaat niet|Oeps/i.test((document.querySelector('#app h1') || {}).textContent || '')); if (r.naar && nf) r.oordeel = '404 NA KLIK';
          }
          if (p._fouten.length) { r.fouten = p._fouten.slice(0, 3); r.oordeel = 'FOUT IN CONSOLE'; }
        }
        await p.close();
      } catch (e) { r.oordeel = 'TESTFOUT ' + String(e.message).slice(0, 100); try { await p.close(); } catch (e2) {} }
      fs.appendFileSync(UIT, JSON.stringify(r) + '\n');
    }
  }
  await b.close(); console.log('klaar');
})();
