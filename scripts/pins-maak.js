/* Pinplaatjes maken (15-11-2026): 1000x1500, wit, titel in Playfair met gouden streepje, productfoto in het midden, logo onderaan.
   Gebruik: node scripts/pins-maak.js <lijst.json>   (lijst = [{id, kop}]; schrijft pins/img/<id>.jpg, slaat bestaande over tenzij --opnieuw) */
const fs = require('fs'), path = require('path'); const { chromium } = require('playwright');
const ROOT = path.resolve(__dirname, '..'); const lijst = JSON.parse(fs.readFileSync(process.argv[2], 'utf8')); const opnieuw = process.argv.includes('--opnieuw');
const f = n => 'data:font/woff2;base64,' + fs.readFileSync(path.join(ROOT, 'assets/fonts', n)).toString('base64');
const logo = 'data:image/svg+xml;base64,' + fs.readFileSync(path.join(ROOT, 'assets/logo-icoon.svg')).toString('base64');
const esc = t => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;');
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1000, height: 1500 }, deviceScaleFactor: 1 }); let n = 0;
  for (const p of lijst) {
    const uit = path.join(ROOT, 'pins/img', p.id + '.jpg'); if (!opnieuw && fs.existsSync(uit)) continue;
    const img = path.join(ROOT, 'images/producten', p.id + '.webp'); if (!fs.existsSync(img)) { console.log('geen foto', p.id); continue; }
    const foto = 'data:image/webp;base64,' + fs.readFileSync(img).toString('base64');
    await pg.setContent(`<style>@font-face{font-family:P;src:url(${f('playfair-display-500-latin.woff2')})}@font-face{font-family:M;src:url(${f('manrope-600-latin.woff2')})}
*{margin:0;box-sizing:border-box}body{width:1000px;height:1500px;background:#fff;display:flex;flex-direction:column;align-items:center;font-family:M}
h1{font-family:P;font-weight:500;font-size:${p.kop.length > 44 ? 48 : p.kop.length > 30 ? 54 : 62}px;color:#141A2A;text-align:center;padding:70px 80px 0;line-height:1.15;text-wrap:balance}
.l{width:90px;height:4px;background:#B8862E;margin:30px 0 0}.f{flex:1;display:flex;align-items:center;justify-content:center;width:100%;padding:40px 70px}
.f img{width:880px;height:880px;object-fit:contain}.v{display:flex;align-items:center;gap:12px;font-size:30px;color:#141A2A;padding-bottom:60px}.v img{width:36px;height:36px}</style>
<h1>${esc(p.kop)}</h1><div class="l"></div><div class="f"><img src="${foto}"></div><div class="v"><img src="${logo}">leukekeuze.nl</div>`);
    await pg.evaluate(() => document.fonts.ready);
    await pg.screenshot({ path: uit, type: 'jpeg', quality: 85 }); n++;
  }
  await b.close(); console.log('pinplaatjes gemaakt:', n);
})();
