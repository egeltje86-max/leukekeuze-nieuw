/* Zoekt knoppen, links en tekst die buiten hun eigen kader (kaart met rand of ronde hoeken) steken, of buiten het scherm.
   Gebruik: lokale server op poort 8765 en dan: node scripts/controle/buiten.js scripts/controle/leesbaar-paden.txt */
const { chromium } = require('playwright'); const fs = require('fs');
const paden = fs.readFileSync(process.argv[2], 'utf8').split('\n').map(x => x.trim()).filter(Boolean);
(async () => {
  const b = await chromium.launch(); const gevonden = {};
  for (const br of (process.argv[3] || '412,360,320').split(',').map(Number)) {
    const c = await b.newContext({ viewport: { width: br, height: 800 } }); const p = await c.newPage();
    for (const pad of paden) {
      await p.goto('http://localhost:8765' + pad, { waitUntil: 'domcontentloaded' }).catch(() => {}); await p.waitForTimeout(900);
      const r = await p.evaluate(() => {
        const uit = []; const vw = document.documentElement.clientWidth;
        const kader = (e) => { for (let x = e.parentElement; x && x !== document.body; x = x.parentElement) { const cs = getComputedStyle(x);
            if (/(auto|scroll|hidden)/.test(cs.overflowX)) return null; /* schuifrij of afgeknipt: hoort zo */
            if (cs.position === 'fixed' || cs.position === 'sticky') return null;
            const rond = parseFloat(cs.borderTopLeftRadius) >= 10, rand = parseFloat(cs.borderTopWidth) > 0 && cs.borderTopStyle !== 'none';
            const vlak = cs.backgroundColor !== 'rgba(0, 0, 0, 0)' || cs.backgroundImage !== 'none';
            if (rond && (rand || vlak)) return x; } return null; };
        for (const e of document.querySelectorAll('#app a, #app button, #app .chip, #app h2, #app h3, #app .label')) {
          const rc = e.getBoundingClientRect(); if (rc.width < 6 || rc.height < 6) continue; const cs = getComputedStyle(e); if (cs.visibility === 'hidden' || cs.position === 'absolute' || cs.position === 'fixed') continue;
          if (e.closest('[hidden]')) continue;
          const t = (e.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 26); if (!t) continue;
          if (rc.right > vw + 2 || rc.left < -2) { let schuif = false; for (let x = e.parentElement; x; x = x.parentElement) if (/(auto|scroll|hidden)/.test(getComputedStyle(x).overflowX)) { schuif = true; break; } if (!schuif) uit.push('BUITEN SCHERM | ' + (e.className || e.tagName).toString().slice(0, 30) + ' | "' + t + '"'); continue; }
          const k = kader(e); if (!k) continue; const kr = k.getBoundingClientRect();
          if (rc.right > kr.right + 2 || rc.left < kr.left - 2) uit.push('buiten kader ' + (k.className || k.tagName).toString().slice(0, 30) + ' | ' + (e.className || e.tagName).toString().slice(0, 30) + ' | "' + t + '" | ' + Math.round(rc.right - kr.right) + 'px');
        }
        return [...new Set(uit)].slice(0, 12);
      }).catch(e => ['FOUT ' + e.message.slice(0, 80)]);
      for (const x of r) (gevonden[x] = gevonden[x] || []).push(br + ' ' + pad);
    }
    await c.close();
  }
  const k = Object.keys(gevonden); console.log(paden.length + ' pagina\'s; buiten kader of scherm:', k.length);
  for (const x of k) console.log(' ', x, '  <-', gevonden[x].slice(0, 3).join(' ; ') + (gevonden[x].length > 3 ? ' (+' + (gevonden[x].length - 3) + ')' : ''));
  await b.close();
})();
