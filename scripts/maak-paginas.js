/* Maakt voor elke pagina van LeukeKeuze een echt HTML-bestand (voor Google), plus sitemap.xml en 404.html.
   Gebruik:  node scripts/maak-paginas.js      (in de map van de site; playwright moet geinstalleerd zijn)
   Bron van de opmaak is sjabloon.html. Alles wat dit script maakt wordt bij elke run opnieuw gemaakt. */
const fs = require('fs'), path = require('path'), http = require('http');
let chromium;
try { ({ chromium } = require('playwright')); }
catch (e) { ({ chromium } = require(process.env.PLAYWRIGHT_PAD || 'playwright')); }

const ROOT = path.resolve(__dirname, '..');
const SITE = 'https://leukekeuze.nl';
/* Versienummer achter css/js, zodat telefoons na elke update meteen de nieuwe versie laden (geen oude cache). */
const VERSIE = new Date().toISOString().replace(/\D/g, '').slice(0, 12);
fs.writeFileSync(path.join(ROOT, 'sjabloon.html'), fs.readFileSync(path.join(ROOT, 'sjabloon.html'), 'utf8')
  .replace(/(assets\/(?:css\/stijl\.css|js\/(?:data|producten|gedeeld|app)\.js))(\?v=\d+)?"/g, '$1?v=' + VERSIE + '"'));
const SJABLOON = fs.readFileSync(path.join(ROOT, 'sjabloon.html'), 'utf8');
const MAPPEN = ['c', 'p', 'info', 'gids', 'vonk', 'zoek', 'winkels', 'favorieten', 'categorieen'];
const GEEN_INDEX = /^\/(favorieten|zoek)\//;
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
  '.svg': 'image/svg+xml', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.png': 'image/png', '.xml': 'application/xml', '.txt': 'text/plain' };

function server() {
  return new Promise(res => {
    const s = http.createServer((req, rsp) => {
      const p = decodeURIComponent(req.url.split('?')[0]);
      const f = path.join(ROOT, p);
      if (p !== '/' && f.startsWith(ROOT) && fs.existsSync(f) && fs.statSync(f).isFile()) {
        rsp.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' });
        return fs.createReadStream(f).pipe(rsp);
      }
      rsp.writeHead(200, { 'content-type': TYPES['.html'] }); rsp.end(SJABLOON);
    });
    s.listen(0, () => res(s));
  });
}
const escA = t => String(t).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
function zet(html, re, nieuw) { if (!re.test(html)) throw new Error('niet gevonden: ' + re); return html.replace(re, nieuw); }

/* Structured data voor Google: de site met zoekvak (home), kruimelpad (alle pagina's) en product (productpagina's). */
function maakLd(info, url) {
  const uit = [];
  if (info.pad === '/') uit.push({ '@context': 'https://schema.org', '@type': 'WebSite', name: 'LeukeKeuze', url: SITE + '/',
    potentialAction: { '@type': 'SearchAction', target: SITE + '/zoek/?q={search_term_string}', 'query-input': 'required name=search_term_string' } });
  const k = (info.kruimel || []).filter(x => x.naam);
  if (info.prod && k.length && k[k.length - 1].naar) k.push({ naam: info.prod.naam, naar: '' });
  if (k.length > 1) uit.push({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: k.map((x, i) => ({ '@type': 'ListItem', position: i + 1, name: x.naam,
    item: !x.naar ? url : SITE + (x.naar === '/' ? '/' : x.naar.replace(/\/?$/, '/')) })) });
  const p = info.prod;
  if (p && p.prijs > 0) {
    const beeld = info.beeld ? (/^https?:/.test(info.beeld) ? info.beeld : SITE + '/' + info.beeld.replace(/^\//, '')) : undefined;
    uit.push({ '@context': 'https://schema.org', '@type': 'Product', name: p.naam, description: p.tekst || undefined, image: beeld, url,
      offers: { '@type': 'Offer', price: Number(p.prijs).toFixed(2), priceCurrency: 'EUR', url: p.url, seller: { '@type': 'Organization', name: p.winkel } } });
  }
  return uit;
}

function maakPagina(info, lade, mega) {
  let h = SJABLOON;
  const url = SITE + info.pad;
  h = zet(h, /<title>[^<]*<\/title>/, '<title>' + escA(info.titel) + '</title>');
  h = zet(h, /<meta name="description" content="[^"]*">/, '<meta name="description" content="' + escA(info.omschrijving) + '">');
  h = zet(h, /<link rel="canonical" href="[^"]*">/, '<link rel="canonical" href="' + url + '">');
  h = zet(h, /<meta property="og:title" content="[^"]*">/, '<meta property="og:title" content="' + escA(info.titel) + '">');
  h = zet(h, /<meta property="og:description" content="[^"]*">/, '<meta property="og:description" content="' + escA(info.omschrijving) + '">');
  h = zet(h, /<meta property="og:url" content="[^"]*">/, '<meta property="og:url" content="' + url + '">');
  if (info.beeld) {
    const b = /^https?:/.test(info.beeld) ? info.beeld : SITE + '/' + info.beeld.replace(/^\//, '');
    h = h.replace(/<meta property="og:image" content="[^"]*">/, '<meta property="og:image" content="' + escA(b) + '">')
         .replace(/<meta name="twitter:image" content="[^"]*">/, '<meta name="twitter:image" content="' + escA(b) + '">')
         .replace(/\s*<meta property="og:image:(width|height)" content="[^"]*">/g, '');
  }
  const ld = maakLd(info, url);
  if (ld.length) h = zet(h, /<\/head>/, ld.map(x => '  <script type="application/ld+json">' + JSON.stringify(x).replace(/</g, '\\u003c') + '</script>').join('\n') + '\n</head>');
  if (info.geenIndex) h = h.replace('<meta charset="utf-8">', '<meta charset="utf-8">\n  <meta name="robots" content="noindex, follow">');
  /* De banner van de homepage alleen vooraf laden op de homepage zelf (scheelt ~90 kB op elke andere pagina, vooral op mobiel). */
  if (info.pad !== '/') h = h.replace(/\s*<link rel="preload" as="image" href="images\/banners\/banner-home-[^"]*"[^>]*>/g, '');
  h = zet(h, /<main id="app" tabindex="-1"><\/main>/, '<main id="app" tabindex="-1">' + info.inhoud + '</main>');
  if (info.pad.indexOf('/p/') !== 0) {  // productpagina's klein houden: menu's vult de site zelf
    h = zet(h, /<div class="lade-inhoud" data-lade><\/div>/, '<div class="lade-inhoud" data-lade>' + lade + '</div>');
    h = zet(h, /<div class="megamenu" id="megamenu" data-megamenu><\/div>/, '<div class="megamenu" id="megamenu" data-megamenu>' + mega + '</div>');
  }
  return h;
}

(async () => {
  const srv = await server();
  const basis = 'http://localhost:' + srv.address().port;
  const browser = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const fouten = [];
  page.on('pageerror', e => fouten.push(e.message));
  await page.route('**/*.{webp,jpg,png,woff2}', r => r.abort());
  await page.route('https://**', r => r.abort());
  await page.goto(basis + '/');
  await page.waitForFunction(() => window.LK && window.LK.ga && document.querySelector('#app').children.length);

  const { lade, mega } = await page.evaluate(() => ({
    lade: document.querySelector('[data-lade]').innerHTML,
    mega: document.querySelector('[data-megamenu]').innerHTML
  }));

  /* Start bij de homepage en de categorieënpagina (die is nergens gelinkt, maar bestaat wel). */
  const gezien = new Set(['/', '/categorieen']), rij = ['/', '/categorieen'], paginas = [];
  while (rij.length) {
    const pad = rij.shift();
    const r = await page.evaluate(pad => {
      window.LK.ga(pad, true);
      const app = document.querySelector('#app').cloneNode(true);
      const links = Array.from(document.querySelectorAll('a[href^="/"]')).map(a => a.getAttribute('href'))
        .filter(h => h.indexOf('//') !== 0 && h.indexOf('?') === -1);
      const aantal = app.querySelectorAll('.prodkaart').length;
      app.querySelectorAll('.prodkaart.later').forEach(x => x.remove());
      app.querySelectorAll('[data-meer]').forEach(x => x.parentNode.remove());
      app.querySelectorAll('[data-alle-winkels]').forEach(x => { x.innerHTML = ''; });
      const ps = Array.from(app.querySelectorAll('p')).map(p => p.textContent.replace(/\s+/g, ' ').trim()).filter(t => t.length > 40);
      const img = app.querySelector('.product img, .prodfoto img, main img');
      let prodTekst = '';
      if (pad.indexOf('/p/') === 0) {
        const pr = window.LK.vind(pad.split('/')[2]);
        if (pr) prodTekst = (pr.waarom ? pr.waarom.replace(/\s+/g, ' ').trim() + ' ' : '') + 'Te koop bij ' + pr.shop +
          (pr.prijs ? ' voor €' + Number(pr.prijs).toFixed(2).replace('.', ',') : '') + '.';
      }
      /* Gegevens voor Google (structured data): kruimelpad en, op productpagina's, het product. */
      const kruimel = Array.from(app.querySelectorAll('nav.kruimel a, nav.kruimel > span:not([aria-hidden])')).map(x => ({ naam: x.textContent.trim(), naar: x.getAttribute('href') || '' }));
      let prod = null;
      if (pad.indexOf('/p/') === 0) {
        const pr = window.LK.vind(pad.split('/')[2]);
        if (pr) prod = { naam: pr.titel, tekst: (pr.waarom || '').replace(/\s+/g, ' ').trim(), prijs: pr.prijs, winkel: pr.shop, url: pr.winkelUrl || pr.url };
      }
      /* Datum voor de sitemap: productpagina's de laatste controle, categoriepagina's het nieuwste product erin. */
      let datum = '';
      if (pad.indexOf('/p/') === 0) { const pr = window.LK.vind(pad.split('/')[2]); if (pr) datum = pr.gecontroleerd || pr.sinds || ''; }
      else if (pad.indexOf('/c/') === 0) {
        const d = pad.split('/').filter(Boolean);
        window.LK.zichtbaar().forEach(p => { if (window.LK.hoortBij(p, d[1], d[2])) { const s = p.sinds || p.gecontroleerd || ''; if (s > datum) datum = s; } });
      }
      const h1 = (app.querySelector('h1') || {}).textContent || '';
      const namen = Array.from(document.querySelectorAll('#app .prodkaart h3')).slice(0, 3).map(x => x.textContent.trim());
      return {
        titel: document.title, inhoud: app.innerHTML, links, aantal,
        leeg: !!app.querySelector('.leeg') && aantal === 0,
        nietGevonden: /Even kwijt|niet beschikbaar/.test(app.textContent) && aantal === 0,
        tekst: prodTekst || ps[0] || '', seo: window.LK_SEO || '', kruimel, prod, h1: h1.trim(), namen, beeld: img ? img.getAttribute('src') : '', datum
      };
    }, pad);
    for (const l of r.links) if (!gezien.has(l)) { gezien.add(l); rij.push(l); }
    if (r.nietGevonden) { console.log('overgeslagen (niet gevonden):', pad); continue; }
    let oms = r.seo || '';
    if (!oms && pad.indexOf('/c/') === 0 && r.aantal) {
      oms = r.h1 + ': ' + r.aantal + ' met de hand gekozen ' + (r.aantal === 1 ? 'product' : 'producten') + ', zoals ' +
        r.namen.slice(0, -1).join(', ') + (r.namen.length > 1 ? ' en ' : '') + r.namen[r.namen.length - 1] + '. Je koopt bij bekende winkels.';
    }
    oms = oms || r.tekst || 'Met de hand uitgekozen cadeaus en producten. Kies op moment, persoon of budget en koop bij bekende winkels.';
    if (oms.length > 160) oms = oms.slice(0, 157).replace(/\s+\S*$/, '') + '…';
    paginas.push({ pad, titel: r.titel, inhoud: r.inhoud, omschrijving: oms, kruimel: r.kruimel, prod: r.prod, datum: r.datum,
      beeld: pad.indexOf('/p/') === 0 ? r.beeld : '', geenIndex: GEEN_INDEX.test(pad) || r.leeg });
  }
  await browser.close(); srv.close();
  if (fouten.length) { console.error('Fouten op de pagina:', fouten.slice(0, 5)); process.exit(1); }

  for (const m of MAPPEN) fs.rmSync(path.join(ROOT, m), { recursive: true, force: true });
  for (const p of paginas) {
    const doel = path.join(ROOT, p.pad, 'index.html');
    fs.mkdirSync(path.dirname(doel), { recursive: true });
    fs.writeFileSync(doel, maakPagina(p, lade, mega));
  }
  // 404: lege app (laat 'Even kwijt?' zien) + oude adressen van de vorige site doorsturen
  const oud = `<script>
  (function () {
    var p = location.pathname.replace(/\\/+$/, '').toLowerCase();
    var kaart = { '/christelijke-cadeaus': '/c/christelijk/', '/cadeaus-voor-kinderen': '/c/cadeaus/voor-kinderen/', '/cadeauzoeker': '/vonk/', '/c/cadeaus/onder-10': '/c/cadeaus/onder-15/', '/c/mode-beauty/sieraden': '/c/sieraden/', '/c/christelijk/doop-communie': '/c/christelijk/doop-belijdenis/', '/c/christelijk/beelden-kruisen': '/c/christelijk/wanddecoratie/', '/cadeaugidsen': '/gids/', '/babycadeaus': '/c/cadeaus/baby-kraam/' };
    var doel = kaart[p] || (/^\\/cadeaugids\\//.test(p + '/') ? '/gids/' : (/^\\/keurkamer\\//.test(p + '/') ? '/' : ''));
    if (doel) location.replace(doel);
  })();
  </script>`;
  let vier = SJABLOON.replace('<meta charset="utf-8">', '<meta charset="utf-8">\n  <meta name="robots" content="noindex">\n  ' + oud);
  vier = vier.replace(/<title>[^<]*<\/title>/, '<title>Pagina niet gevonden | LeukeKeuze</title>')
             .replace(/<div class="lade-inhoud" data-lade><\/div>/, '<div class="lade-inhoud" data-lade>' + lade + '</div>')
             .replace(/<div class="megamenu" id="megamenu" data-megamenu><\/div>/, '<div class="megamenu" id="megamenu" data-megamenu>' + mega + '</div>');
  fs.writeFileSync(path.join(ROOT, '404.html'), vier);

  const vandaag = new Date().toISOString().slice(0, 10);
  /* lastmod: een echte datum per pagina (niet elke keer 'vandaag'), anders negeert Google hem. */
  const urls = paginas.filter(p => !p.geenIndex).map(p => '  <url><loc>' + SITE + p.pad + '</loc><lastmod>' + (/^\d{4}-\d\d-\d\d$/.test(p.datum || '') && p.datum <= vandaag ? p.datum : vandaag) + '</lastmod></url>');
  fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + urls.join('\n') + '\n</urlset>\n');
  console.log('Klaar:', paginas.length, 'pagina\'s,', urls.length, 'in de sitemap');
})().catch(e => { console.error(e); process.exit(1); });
