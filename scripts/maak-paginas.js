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
require('./splits-producten.js')(); // producten.js -> producten-lean.js + producten-details.js
/* Sint-rijmmachine (7-11-2026): cadeaulijst met alle producten voor de serverfunctie 'sint-rijm' (data/rijm-catalogus.json). */
try { require('child_process').execFileSync(process.execPath, [path.join(__dirname, 'rijmmachine/maak-rijm-catalogus.js'), path.join(__dirname, '../data/rijm-catalogus.json')], { stdio: 'inherit' }); } catch (e) { console.error('rijm-catalogus niet gelukt:', e.message); }
/* Sneller voor wie vaker komt (14-11-2026, Marius: 'de website laad traag'): het nummer achter elk bestand komt nu uit de inhoud van dat
   bestand zelf. Een telefoon haalt dus alleen opnieuw op wat echt veranderd is; eerst kreeg alles bij elke update een nieuw nummer
   en moest een vaste bezoeker na elke update weer ongeveer 1 MB binnenhalen (app.js, de productlijst, de toppers ...). */
const BESTANDS_VERSIE = {};
function versieVan(rel) {
  if (!BESTANDS_VERSIE[rel]) {
    try { BESTANDS_VERSIE[rel] = String(parseInt(require('crypto').createHash('md5').update(fs.readFileSync(path.join(ROOT, rel))).digest('hex').slice(0, 12), 16)); }
    catch (e) { BESTANDS_VERSIE[rel] = VERSIE; }
  }
  return BESTANDS_VERSIE[rel];
}
fs.writeFileSync(path.join(ROOT, 'sjabloon.html'), fs.readFileSync(path.join(ROOT, 'sjabloon.html'), 'utf8')
  .replace(/(assets\/(?:css\/(?:stijl|licht)\.css|js\/(?:data|producten-lean|gedeeld|app|topkeuze|teksten)\.js))(\?v=\d+)?"/g, function (m, rel) { return rel + '?v=' + versieVan(rel) + '"'; }));
const SJABLOON = fs.readFileSync(path.join(ROOT, 'sjabloon.html'), 'utf8');
let SJ_UIT = ''; /* het sjabloon met de icoontjes van kop, menu en onderbalk er al in (zie verderop) */
/* Veiligheidsslot (1-11-2026): staat er nog een half samengevoegd stuk (<<<<<<< / >>>>>>>) in het sjabloon of in de bronbestanden,
   dan stopt het bouwen meteen. Anders komt die rommel op alle 6700 pagina's. */
for (const f of ['sjabloon.html', 'assets/js/app.js', 'assets/js/data.js', 'assets/js/producten.js', 'assets/css/stijl.css']) {
  const p = path.join(ROOT, f);
  if (fs.existsSync(p) && /^(<{7}|>{7}) /m.test(fs.readFileSync(p, 'utf8'))) { console.error('STOP: samenvoegfout in ' + f + ' - eerst oplossen, er is niets gebouwd.'); process.exit(1); }
}
const MAPPEN = ['c', 'p', 'info', 'gids', 'vonk', 'zoek', 'winkels', 'favorieten', 'categorieen', 'lijst', 'voor', 'gelegenheid', 'collectie', 'sint-rijmmachine', 'lootjes-trekken', 'tiktok'];
/* 9-11-2026 (GO Marius, Sitewacht): een vakje (/c/afdeling/groep/vakje/) met minder dan 6 producten oogt leeg.
   Google slaat het dan over (noindex, niet in de sitemap); de pagina en de producten blijven gewoon bereikbaar. Vanaf 6 producten telt hij vanzelf weer mee. */
const DUN = (pad, aantal) => /^\/c\/[^/]+\/[^/]+\/[^/]+\/$/.test(pad) && typeof aantal === 'number' && aantal < 6;
const GEEN_INDEX = /^\/(favorieten|zoek|lijst)(\/|$)/; /* ook zonder slash erachter (31-10-2026: /zoek stond per ongeluk in de sitemap) */
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
/* Merknamen per product (scripts/merken.json, uit de Productstudio-rondes), voor 'brand' in de Product-gegevens (Search Console, 28-10-2026). */
const MERKEN = (() => { try { return JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts', 'merken.json'), 'utf8')); } catch (e) { return {}; } })();
function maakLd(info, url) {
  const uit = [];
  if (info.pad === '/') uit.push({ '@context': 'https://schema.org', '@type': 'WebSite', name: 'LeukeKeuze', url: SITE + '/',
    potentialAction: { '@type': 'SearchAction', target: SITE + '/zoek/?q={search_term_string}', 'query-input': 'required name=search_term_string' } });
  /* Handboek P1 (12-11-2026): wie de site maakt, alleen echte gegevens (naam, adres, logo). Geen winkel, geen reviews. */
  if (info.pad === '/') uit.push({ '@context': 'https://schema.org', '@type': 'Organization', name: 'LeukeKeuze', url: SITE + '/', logo: SITE + '/favicon-512.png',
    description: 'Nederlandse cadeausite: met de hand gekozen cadeaus van bekende winkels. LeukeKeuze verkoopt zelf niets; je koopt bij de winkel.' });
  const k = (info.kruimel || []).filter(x => x.naam);
  if (info.prod && k.length && k[k.length - 1].naar) k.push({ naam: info.prod.naam, naar: '' });
  if (k.length > 1) uit.push({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: k.map((x, i) => ({ '@type': 'ListItem', position: i + 1, name: x.naam,
    item: !x.naar ? url : SITE + (x.naar === '/' ? '/' : x.naar.replace(/\/?$/, '/')) })) });
  const p = info.prod;
  if (p && p.prijs > 0) {
    const beeld = info.beeld ? (/^https?:/.test(info.beeld) ? info.beeld : SITE + '/' + info.beeld.replace(/^\//, '')) : undefined;
    /* EAN (gtin13) als het product-id er een bevat, met controle van het laatste cijfer (31-10-2026). */
    const ean = (p.id.match(/^(?:dw|kw|inv|dgsw|dvzn|tf|bt|drm|hema)-(\d{13})$/) || [])[1];
    const eanOk = ean && (10 - ean.split('').slice(0, 12).reduce((s, c, i) => s + (+c) * (i % 2 ? 3 : 1), 0) % 10) % 10 === +ean[12];
    uit.push({ '@context': 'https://schema.org', '@type': 'Product', name: p.naam, gtin13: eanOk ? ean : undefined, brand: p.merk ? { '@type': 'Brand', name: p.merk } : undefined, description: p.tekst || undefined, image: beeld, url,
      offers: { '@type': 'Offer', price: Number(p.prijs).toFixed(2), priceCurrency: 'EUR', availability: p.status === 'uitverkocht' ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock', itemCondition: 'https://schema.org/NewCondition', url: p.url, seller: { '@type': 'Organization', name: p.winkel } } });
  }
  return uit;
}

/* Deelplaatje (1200x630) voor gidsen en categorieën, gemaakt met scripts/promo/maak-deelbeelden.py */
function deelBeeld(pad) {
  if (pad.indexOf('/gids/') !== 0 && pad.indexOf('/c/') !== 0) return '';
  const naam = pad.replace(/^\/|\/$/g, '').replace(/\//g, '-');
  return fs.existsSync(path.join(ROOT, 'images', 'deel', naam + '.jpg')) ? 'images/deel/' + naam + '.jpg' : '';
}

/* 8-11-2026 (GO Marius): twee pagina's met dezelfde producten en bijna dezelfde titel zitten elkaar in Google in de weg.
   De collectie verwijst naar de hoofdpagina (canonical) en staat niet meer in de sitemap. De pagina's per persoon blijven gewoon zelfstandig. */
const HOOFDPAGINA = { '/collectie/grappige-cadeaus/': '/c/cadeaus/grappig/' };
/* 9-11-2026 (GO Marius, Sitewacht): eigen Google-titel en -omschrijving voor een paar pagina's (scripts/seo-paginas.json). */
let SEO = {}; try { SEO = JSON.parse(fs.readFileSync(path.join(__dirname, 'seo-paginas.json'), 'utf8')); } catch (e) {}
const MAANDEN = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'];
function seoDatum(d) { const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(d || ''); return m ? (+m[3]) + ' ' + MAANDEN[+m[2] - 1] : ''; }
function maakPagina(info, lade, mega, aftel, zoekrij) {
  let h = SJ_UIT || SJABLOON;
  const eigen = SEO[info.pad];
  if (eigen) {
    info = Object.assign({}, info);
    if (eigen.titel) info.titel = eigen.titel;
    if (eigen.omschrijving) { const d = seoDatum(info.datum); info.omschrijving = d ? eigen.omschrijving.replace('{datum}', d) : eigen.omschrijving.replace(/, prijs gecontroleerd op \{datum\}/, ''); }
    /* 12-11-2026: de met de hand geschreven titels noemden een vaste prijs (Peekimo: €29,99 terwijl hij €24,99 is).
       Een productprijs ('– €29,99', '€29,99 bij bol') volgt nu altijd de echte prijs van het product. */
    if (info.prod && Number(info.prod.prijs) > 0) {
      const pr = Number(info.prod.prijs), nu = '€' + (pr % 1 ? pr.toFixed(2).replace('.', ',') : String(pr));
      const zet = s => s && s.replace(/€\s?\d+(?:,\d{2})?(?=( bij |$|\.$))/g, nu);
      info.titel = zet(info.titel); info.omschrijving = zet(info.omschrijving);
    }
  }
  const url = SITE + info.pad;
  /* Lange producttitels: zonder ' | LeukeKeuze' erachter, anders knipt Google de titel af (31-10-2026). */
  let titel = info.titel.length > 62 ? info.titel.replace(/ \| LeukeKeuze$/, '') : info.titel;
  /* 8-11-2026 (GO Marius): nog steeds te lang voor Google (meer dan 65 tekens)? Dan netjes inkorten op een heel woord. Op de pagina zelf verandert niets. */
  if (titel.length > 65) titel = titel.slice(0, 62).replace(/[\s,–-]+\S*$/, '') + '…';
  h = zet(h, /<title>[^<]*<\/title>/, '<title>' + escA(titel) + '</title>');
  if (eigen && eigen.titel) h = h.replace('</head>', '<meta name="lk-titel" data-pad="' + info.pad + '" content="' + escA(titel) + '">\n</head>'); /* de app houdt deze titel aan */
  h = zet(h, /<meta name="description" content="[^"]*">/, '<meta name="description" content="' + escA(info.omschrijving) + '">');
  h = zet(h, /<link rel="canonical" href="[^"]*">/, '<link rel="canonical" href="' + (HOOFDPAGINA[info.pad] ? SITE + HOOFDPAGINA[info.pad] : url) + '">');
  h = zet(h, /<meta property="og:title" content="[^"]*">/, '<meta property="og:title" content="' + escA(info.titel) + '">');
  h = zet(h, /<meta property="og:description" content="[^"]*">/, '<meta property="og:description" content="' + escA(info.omschrijving) + '">');
  h = zet(h, /<meta property="og:url" content="[^"]*">/, '<meta property="og:url" content="' + url + '">');
  if (info.beeld) {
    const b = /^https?:/.test(info.beeld) ? info.beeld : SITE + '/' + info.beeld.replace(/^\//, '');
    h = h.replace(/<meta property="og:image" content="[^"]*">/, '<meta property="og:image" content="' + escA(b) + '">')
         .replace(/<meta name="twitter:image" content="[^"]*">/, '<meta name="twitter:image" content="' + escA(b) + '">')
         .replace(/\s*<meta property="og:image:(width|height)" content="[^"]*">/g, '');
    if (info.beeldMaat) h = h.replace(/(<meta property="og:image" content="[^"]*">)/, '$1\n  <meta property="og:image:width" content="1200">\n  <meta property="og:image:height" content="630">');
  }
  if (aftel) h = zet(h, /<a class="aftel" href="[^"]*" data-aftel hidden><\/a>/, aftel).replace('<html lang="nl">', '<html lang="nl" class="met-aftel">');
  if (zoekrij) h = zet(h, /<div class="zoekrij" data-zoekrij><div class="binnen"><\/div><\/div>/, '<div class="zoekrij" data-zoekrij' + (/^\/zoek(\/|$)/.test(info.pad) ? ' hidden' : '') + '><div class="binnen">' + zoekrij + '</div></div>');
  if (info.deel && info.prod) h = zet(h, /<script src="assets\/js\/data\.js/, '<script>window.LK_DETAILS_DEEL=' + JSON.stringify({ [info.prod.id]: info.deel }).replace(/</g, '\\u003c') + ';</script>\n  <script src="assets/js/data.js');
  /* Hoofdfoto van een product alvast ophalen (LCP): die staat pas onderaan in de HTML. */
  if (info.pad.indexOf('/p/') === 0 && info.beeld && !/^https?:/.test(info.beeld)) h = zet(h, /<\/head>/, '  <link rel="preload" as="image" href="' + escA(info.beeld) + '" fetchpriority="high">\n</head>');
  const ld = maakLd(info, url);
  if (ld.length) h = zet(h, /<\/head>/, ld.map(x => '  <script type="application/ld+json">' + JSON.stringify(x).replace(/</g, '\\u003c') + '</script>').join('\n') + '\n</head>');
  if (info.geenIndex) h = h.replace('<meta charset="utf-8">', '<meta charset="utf-8">\n  <meta name="robots" content="noindex, follow">');
  /* De banner van de homepage alleen vooraf laden op de homepage zelf (scheelt ~90 kB op elke andere pagina, vooral op mobiel). */
  if (info.pad !== '/') h = h.replace(/\s*<link rel="preload" as="image" href="images\/banners\/banner-[^"]*"[^>]*>/g, '');
  /* 13-11-2026 (grote keuring): de homepage en de Voor wie-pagina's krijgen ook de nieuwe opzet van de proef WIJZER mee, in een <template>
     (onzichtbaar; zoekmachines en wie de oude opzet heeft merken er niets van). Wie de nieuwe opzet krijgt, ziet die daardoor meteen staan
     (het stukje script direct na <main> in sjabloon.html wisselt hem in). Eerder stond er seconden een half lege pagina en versprong alles daarna. */
  h = zet(h, /<main id="app" tabindex="-1"><\/main>/, () => '<main id="app" tabindex="-1">' + info.inhoud + '</main>' + (info.inhoudB ? '\n  <template id="app-b">' + info.inhoudB + '</template>' : ''));
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
  /* Details (winkellinks, varianten, specs) alvast laden, zodat elke productpagina compleet gebouwd wordt
     en de details van dát product in de HTML kunnen (snelheid, 31-10-2026). */
  await page.addScriptTag({ url: basis + '/assets/js/producten-details.js' });
  await page.evaluate(() => { const D = window.LK_DETAILS || {}; (window.LK_PRODUCTEN || []).forEach(p => { if (D[p.id]) Object.assign(p, D[p.id]); }); });
  /* Aftelbalk (Sinterklaas/kerst) alvast in de HTML zetten: anders schuift de hele pagina omlaag zodra de site hem toont (CLS). */
  const aftel = await page.evaluate(() => { const a = document.querySelector('[data-aftel]'); return a && !a.hidden ? a.outerHTML : ''; });
  /* Zoekbalk onder de kop ook alvast in de HTML (31-10-2026): anders schoof de pagina 50px omlaag zodra app.js hem maakte (CLS 0,06-0,09). */
  /* 13-11-2026 (grote keuring): de bouw draait op een breed scherm en zette dus de lange zoektekst van de computer in elke pagina. Op de telefoon
     (bijna alle bezoekers) stond die tekst dan afgekapt in beeld tot app.js hem verving. Nu staat de korte tekst van de telefoon in de pagina;
     op de computer zet app.js er meteen de lange voor in de plaats. */
  const zoekrij = await page.evaluate(() => { const z = document.querySelector('[data-zoekrij] .binnen'); return z ? z.innerHTML : ''; })
    .then(z => z.replace(/placeholder="[^"]*"/, 'placeholder="Typ wat je zoekt, bijv. lego"'));
  /* 13-11-2026 (grote keuring): de icoontjes in de kop, het menu en de onderbalk staan nu al in de HTML. Eerder zette app.js ze er pas in:
     op een trage telefoon stond de pagina dan ongeveer een seconde zonder menuknop, hartje en icoontjes in de onderbalk. */
  {
    const namen = [...new Set((SJABLOON.match(/data-ic="[a-z-]+"/g) || []).map(x => x.slice(9, -1)))];
    const iconen = await page.evaluate(n => { const o = {}; n.forEach(x => { o[x] = window.LK.icoon(x); }); return o; }, namen);
    SJ_UIT = SJABLOON.replace(/(<(?:span|button|a)\b[^>]*?)\s+data-ic="([a-z-]+)"([^>]*>)/g, (m, a, naam, b) => a + b + iconen[naam]);
    if (/data-ic=/.test(SJ_UIT)) throw new Error('niet alle icoontjes van het sjabloon zijn ingevuld');
  }

  const { lade, mega } = await page.evaluate(() => ({
    lade: document.querySelector('[data-lade]').innerHTML,
    mega: document.querySelector('[data-megamenu]').innerHTML
  }));
  /* Vakjes die bij de nieuwe indeling (2.1) een andere naam kregen: het oude adres stuurt door naar het nieuwe vakje.
     Zo blijven adressen die Google al kent werken (gevonden bij de grote controle van 31-10-2026). */
  const vakVerhuis = await page.evaluate(() => {
    const o = {};
    const gevuld = {}; (window.LK_PRODUCTEN || []).forEach(p => { if (p.status === 'goedgekeurd' && p.afd) { const k = p.afd + '/' + p.groep + '/' + p.vak; gevuld[k] = (gevuld[k] || 0) + 1; } });
    (window.LK_CATEGORIEEN || []).forEach(c => {
      /* 3.0 (4-11-2026): een hele oude afdeling (bijv. Dranken) stuurt door naar zijn nieuwe plek. */
      if (c.verborgen && c.naar) o['c/' + c.slug] = c.naar.replace(/\/?$/, '/');
      (c.subs || []).forEach(s => {
        if (s.verborgen && (s.vak || s.naar)) o['c/' + c.slug + '/' + s.slug] = s.naar ? s.naar.replace(/\/?$/, '/') : '/c/' + s.vak + '/';
        /* 4.0: oude vakjes sturen door naar hun nieuwe plek; is dat vakje leeg (geen pagina), dan naar de groep erboven */
        if (s.verborgen && s.naarVak) for (const v of Object.keys(s.naarVak)) { const doel = s.naarVak[v].replace(/\/$/, ''); o['c/' + c.slug + '/' + s.slug + '/' + v] = doel + '/'; }
      });
    });
    /* 11-11-2026: een oud adres stuurt nooit door naar een leeg of dun vakje (minder dan 6 producten: dat staat op noindex,
       dan raakt Google de draad kwijt). Het gaat dan naar de groep erboven, die wel in Google staat. */
    Object.keys(o).forEach(k => { const m = /^\/c\/([^/]+\/[^/]+\/[^/]+)\/$/.exec(o[k]); if (m && !(gevuld[m[1]] >= 6)) o[k] = '/c/' + m[1].split('/').slice(0, 2).join('/') + '/'; });
    return o;
  });
  const samen = await page.evaluate(() => (window.LK_PRODUCTEN || []).filter(p => p.status === 'samengevoegd' && p.samengevoegd).map(p => [p.id, p.samengevoegd]));
  /* Stap 8 (1-11-2026): uitverkochte en weggehaalde producten krijgen geen 404, maar sturen door naar hun vakje (oude links, pins, Google). */
  const weg = await page.evaluate(() => (window.LK_PRODUCTEN || []).filter(p => p.status === 'afgekeurd' && p.cat && p.sub).map(p => [p.id, p.cat, p.sub]));

  /* Start bij de homepage en de categorieënpagina (die is nergens gelinkt, maar bestaat wel). */
  /* Sint-rijmmachine (7-11-2026): de pagina wordt ook los meegenomen (het blok op de homepage verdwijnt na 5 december). */
  /* Lootjes trekken (14-11-2026): de pagina wordt ook los meegenomen. */
  const gezien = new Set(['/', '/categorieen/', '/lijst/', '/sint-rijmmachine/', '/lootjes-trekken/', '/tiktok/']), rij = ['/', '/categorieen/', '/lijst/', '/sint-rijmmachine/', '/lootjes-trekken/', '/tiktok/'], paginas = [];
  /* Stap 3 indeling (6-11-2026): lijstpagina's tonen nog maar 24 kaarten, dus de kruipbeurt vindt niet meer elk product via een lijst.
     Daarom krijgt elk goedgekeurd product zijn pagina rechtstreeks (eerst 10.426 pagina's, zonder dit 7.057). */
  /* UITVERKOCHT (14-11-2026, GO Marius): uitverkochte producten houden hun pagina (met 'uitverkocht' en wat erop lijkt), niet in de sitemap. */
  for (const id of await page.evaluate(() => (window.LK_PRODUCTEN || []).filter(p => p.status === 'goedgekeurd' || p.status === 'uitverkocht').map(p => p.id))) {
    const l = '/p/' + id + '/'; if (!gezien.has(l)) { gezien.add(l); rij.push(l); }
  }
  while (rij.length) {
    const pad = rij.shift();
    const r = await page.evaluate(pad => {
      window.LK.ga(pad, true);
      const app = document.querySelector('#app').cloneNode(true);
      const links = Array.from(document.querySelectorAll('a[href^="/"]')).map(a => a.getAttribute('href'))
        .filter(h => h.indexOf('//') !== 0 && h.indexOf('?') === -1);
      /* Stap 3 indeling: alleen de eerste 24 kaarten staan in de pagina; het echte aantal staat in het filterblok ('1409 producten'). */
      const aantalEl = app.querySelector('.werkbalk .aantal');
      const aantal = aantalEl ? (parseInt(aantalEl.textContent.replace(/\D/g, ''), 10) || 0) : app.querySelectorAll('.prodkaart').length;
      app.querySelectorAll('[data-meer]').forEach(x => x.parentNode.remove());
      app.querySelectorAll('[data-alle-winkels]').forEach(x => { x.innerHTML = ''; });
      const ps = Array.from(app.querySelectorAll('p')).map(p => p.textContent.replace(/\s+/g, ' ').trim()).filter(t => t.length > 40);
      const img = app.querySelector('.product img, .prodfoto img, main img');
      let prodTekst = '';
      if (pad.indexOf('/p/') === 0) {
        const pr = window.LK.vind(pad.split('/')[2]);
        if (pr) prodTekst = (pr.waarom ? pr.waarom.replace(/\s+/g, ' ').trim() + ' ' : '') + (pr.status === 'uitverkocht' ? 'Uitverkocht bij ' + pr.shop + '; hieronder cadeaus die erop lijken. Laatst gezien' : 'Te koop bij ' + pr.shop) +
          (pr.prijs ? ' voor €' + Number(pr.prijs).toFixed(2).replace('.', ',') : '') + '.';
      }
      /* Gegevens voor Google (structured data): kruimelpad en, op productpagina's, het product. */
      const kruimel = Array.from(app.querySelectorAll('nav.kruimel a, nav.kruimel > span:not([aria-hidden])')).map(x => ({ naam: x.textContent.trim(), naar: x.getAttribute('href') || '' }));
      let prod = null, deel = null;
      if (pad.indexOf('/p/') === 0) {
        const pr = window.LK.vind(pad.split('/')[2]);
        if (pr) prod = { id: pr.id, naam: pr.titel, tekst: (pr.waarom || '').replace(/\s+/g, ' ').trim(), prijs: pr.prijs, winkel: pr.shop, url: pr.winkelUrl || pr.url, status: pr.status };
        if (pr && window.LK_DETAILS && window.LK_DETAILS[pr.id]) deel = window.LK_DETAILS[pr.id];
      }
      /* Datum voor de sitemap: productpagina's de laatste controle, categoriepagina's het nieuwste product erin. */
      let datum = '';
      if (pad.indexOf('/p/') === 0) { const pr = window.LK.vind(pad.split('/')[2]); if (pr) datum = pr.gecontroleerd || pr.sinds || ''; }
      else if (pad.indexOf('/c/') === 0) {
        const d = pad.split('/').filter(Boolean);
        window.LK.zichtbaar().forEach(p => { if (window.LK.hoortBij(p, d[1], d[2])) { const s = p.sinds || p.gecontroleerd || ''; if (s > datum) datum = s; } });
      }
      const h1 = (app.querySelector('h1') || {}).textContent || '';
      const namen = Array.from(document.querySelectorAll('#app .prodkaart h3')).slice(0, 3).map(x => x.textContent.replace(/[\u00AD\u200B]/g, '').trim()); /* zonder de onzichtbare afbreekstreepjes */
      const uit = {
        titel: document.title, inhoud: app.innerHTML.replace(/[\u00AD\u200B]/g, ''), links, aantal, /* vaste HTML voor zoekmachines en ChatGPT: zonder de onzichtbare afbreekstreepjes */
        leeg: !!app.querySelector('.leeg') && aantal === 0,
        nietGevonden: /Even kwijt|niet beschikbaar/.test(app.textContent) && aantal === 0,
        tekst: prodTekst || ps[0] || '', seo: window.LK_SEO || '', kruimel, prod, deel, h1: h1.trim(), namen, beeld: img ? img.getAttribute('src') : '', datum
      };
      /* 13-11-2026: dezelfde pagina in de nieuwe opzet van de proef WIJZER (alleen de homepage en de Voor wie-pagina's hebben die). */
      if ((pad === '/' || /^\/voor\/[^/]+\//.test(pad)) && window.LK._wijzer) {
        window.LK._wijzer('b'); window.LK.ga(pad, true);
        const appB = document.querySelector('#app').cloneNode(true);
        appB.querySelectorAll('[data-meer]').forEach(x => x.parentNode.remove());
        appB.querySelectorAll('[data-alle-winkels]').forEach(x => { x.innerHTML = ''; });
        const b = appB.innerHTML.replace(/[\u00AD\u200B]/g, '');
        if (b !== uit.inhoud && b.indexOf('</template') === -1) uit.inhoudB = b;
        window.LK._wijzer('a');
      }
      return uit;
    }, pad);
    for (const l0 of r.links) { const l = /\/$/.test(l0) ? l0 : l0 + '/'; if (!gezien.has(l)) { gezien.add(l); rij.push(l); } } /* altijd met slash: één adres per pagina */
    if (r.nietGevonden) { console.log('overgeslagen (niet gevonden):', pad); continue; }
    let oms = r.seo || '';
    if (!oms && pad.indexOf('/c/') === 0 && r.aantal) {
      oms = r.h1 + ': ' + r.aantal + ' met de hand gekozen ' + (r.aantal === 1 ? 'product' : 'producten') + ', zoals ' +
        r.namen.slice(0, -1).join(', ') + (r.namen.length > 1 ? ' en ' : '') + r.namen[r.namen.length - 1] + '. Je koopt bij bekende winkels.';
    }
    oms = oms || r.tekst || 'Met de hand uitgekozen cadeaus en producten. Kies op moment, persoon of budget en koop bij bekende winkels.';
    /* Nakijkbeurt 6-11-2026: korte producttekst? Vul de omschrijving voor Google aan met prijs en winkel. */
    if (r.prod && r.prod.prijs && oms.length < 90 && oms.indexOf('€') === -1) oms = oms.replace(/\s+$/, '') + ' Nu €' + Number(r.prod.prijs).toFixed(2).replace('.', ',') + ' bij ' + r.prod.winkel + '. Met de hand gekozen door LeukeKeuze.';
    /* Nakijkbeurt 8-11-2026: te korte of afgebroken omschrijvingen (bijv. 'beheerd door:') netjes aanvullen. */
    if (/:$/.test(oms)) oms = r.h1 + ' van LeukeKeuze: met de hand gekozen cadeaus, je koopt bij bekende winkels.';
    else if (oms.length < 70) oms = oms.replace(/\s+$/, '') + (r.prod ? ' Met de hand gekozen door LeukeKeuze.' : ' Met de hand gekozen cadeaus, je koopt bij bekende winkels.');
    if (oms.length > 160) oms = oms.slice(0, 157).replace(/\s+\S*$/, '') + '…';
    paginas.push({ pad, titel: r.titel, inhoud: r.inhoud, inhoudB: r.inhoudB || '', omschrijving: oms, kruimel: r.kruimel, prod: r.prod ? Object.assign({}, r.prod, { merk: MERKEN[r.prod.id] }) : r.prod, deel: r.deel, datum: r.datum,
      beeld: pad.indexOf('/p/') === 0 ? r.beeld : deelBeeld(pad), beeldMaat: pad.indexOf('/p/') !== 0 && !!deelBeeld(pad), geenIndex: GEEN_INDEX.test(pad) || r.leeg || DUN(pad, r.aantal) });
  }
  await browser.close(); srv.close();
  if (fouten.length) { console.error('Fouten op de pagina:', fouten.slice(0, 5)); process.exit(1); }

  for (const m of MAPPEN) fs.rmSync(path.join(ROOT, m), { recursive: true, force: true });
  for (const p of paginas) {
    const doel = path.join(ROOT, p.pad, 'index.html');
    fs.mkdirSync(path.dirname(doel), { recursive: true });
    fs.writeFileSync(doel, maakPagina(p, lade, mega, aftel, zoekrij));
  }
  /* Oude adressen van de vorige site die Google nog kent: een echte pagina met canonical + direct doorsturen.
     Google ziet dat als een permanente verhuizing, zodat de waarde van het oude adres naar de nieuwe pagina gaat.
     (Via 404.html alleen zag Google 'niet gevonden' en liet het oude adres gewoon vallen.) Lijst uit Search Console, 28-10-2026. */
  const VERHUISD = {
    'cadeaugids': '/gids/', 'cadeaugidsen': '/gids/',
    /* 04-11-2026: oude adressen die Google als 404 meldde (Search Console). Producten die helemaal van de site zijn: naar hun vakje. */
    'c/cadeaus/onder-10': '/c/cadeaus/onder-15/',
    'p/dk-00015530': '/c/hobby/tekenen/', 'p/dvzn-635418': '/voor/opa-oma/', 'p/dk-00044984': '/c/wonen/kerst/',
    'p/dk-00044532': '/c/wonen/huisgeuren/', 'p/dk-35072707': '/c/wonen/huisgeuren/',
    'cadeaugids/cadeau-voor-collega': '/gids/cadeau-voor-collega/',
    'cadeaugids/sinterklaas': '/c/cadeaus/sinterklaas/',
    'cadeaugids/cadeau-voor-vriendin': '/voor/haar/',
    'cadeaugids/origineel-cadeau-voor-vader': '/voor/hem/',
    'cadeaugids/cadeau-voor-dierenliefhebber': '/c/dieren/',
    'christelijke-cadeaus': '/c/christelijk/', 'cadeaus-voor-kinderen': '/voor/kinderen/',
    'cadeauzoeker': '/vonk/', 'babycadeaus': '/voor/baby/',
    'hoe-het-werkt': '/info/hoe-werkt-het/', 'privacy': '/info/privacy/',
    /* 2.0: de persoonspagina's zijn verhuisd van /c/cadeaus/... naar /voor/... (deze worden altijd overschreven). */
    'c/cadeaus/voor-hem': '/voor/hem/', 'c/cadeaus/voor-haar': '/voor/haar/', 'c/cadeaus/voor-kinderen': '/voor/kinderen/',
    'c/cadeaus/opa-oma': '/voor/opa-oma/', 'c/cadeaus/collega': '/voor/collega/', 'c/cadeaus/baby-kraam': '/voor/baby/',
    /* 2.0: horloges, geuren en verzorging zijn verhuisd van Mode & Beauty naar hun eigen groep. */
    'c/mode-beauty/horloges': '/c/sieraden/horloges/', 'c/mode-beauty/geuren': '/c/geuren-verzorging/geuren/', 'c/mode-beauty/verzorging': '/c/geuren-verzorging/huidverzorging/',
    /* 2.1: vakjes die verhuisd of opgegaan zijn in een ander vakje */
    'c/cadeaus/adventskalenders': '/collectie/adventskalenders/', 'c/eten-drinken/adventskalenders': '/collectie/adventskalenders/', 'c/christelijk/onder-25': '/c/christelijk/'
  };
  /* 05-11-2026: oude adressen die Google nog kent en die 'Niet gevonden' gaven (sitecontrole). Zie scripts/boom/correcties.json. */
  try { Object.assign(VERHUISD, JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts/boom/correcties.json'), 'utf8')).adressen || {}); } catch (e) {}
  for (const [oudPad, nieuwPad] of Object.entries(vakVerhuis)) if (!VERHUISD[oudPad]) VERHUISD[oudPad] = nieuwPad;
  /* Samengevoegde producten (dubbel op de site): de oude productpagina stuurt door naar het product dat we hielden. */
  for (const [id, naar] of samen) if (!VERHUISD['p/' + id]) VERHUISD['p/' + id] = '/p/' + naar + '/';
  for (const [id, c, sub] of weg) {
    if (VERHUISD['p/' + id]) continue;
    const vak = 'c/' + c + '/' + sub;
    VERHUISD['p/' + id] = VERHUISD[vak] || (fs.existsSync(path.join(ROOT, vak, 'index.html')) ? '/' + vak + '/' : '/c/' + c + '/');
  }
  /* 3.0: ketens oplossen (oud -> ouder -> nieuw), zodat elke oude pagina in één stap op de goede plek uitkomt. */
  for (const k of Object.keys(VERHUISD)) {
    let d = VERHUISD[k], n = 0;
    while (n++ < 5) { const sl = d.replace(/^\/|\/$/g, ''); if (VERHUISD[sl] && VERHUISD[sl] !== d) d = VERHUISD[sl]; else break; }
    VERHUISD[k] = d;
  }
  /* 3.0: een oude /c/-pagina die bij deze bouw niet meer bestaat, mag overschreven worden door een doorverwijzing. */
  const nuEcht = new Set(paginas.map(p => p.pad.replace(/^\/|\/$/g, '')));
  for (const [oudPad, nieuwPad] of Object.entries(VERHUISD)) {
    const doel = path.join(ROOT, oudPad, 'index.html');
    const altijd = /^c\/(cadeaus|mode-beauty)\//.test(oudPad) || (/^c\//.test(oudPad) && !nuEcht.has(oudPad));
    if (!altijd && fs.existsSync(doel) && !/data-verhuisd/.test(fs.readFileSync(doel, 'utf8'))) continue; // nooit een echte pagina overschrijven
    fs.mkdirSync(path.dirname(doel), { recursive: true });
    fs.writeFileSync(doel, '<!doctype html>\n<html lang="nl" data-verhuisd><head><meta charset="utf-8">\n<title>Deze pagina is verhuisd | LeukeKeuze</title>\n' +
      '<link rel="canonical" href="' + SITE + nieuwPad + '">\n<meta http-equiv="refresh" content="0; url=' + nieuwPad + '">\n' +
      '<script>location.replace(' + JSON.stringify(nieuwPad) + ' + location.search);</script></head>\n' +
      '<body><p>Deze pagina is verhuisd. <a href="' + nieuwPad + '">Ga verder naar de nieuwe pagina</a>.</p></body></html>\n');
  }
  // 404: lege app (laat 'Even kwijt?' zien) + oude adressen van de vorige site doorsturen
  const oud = `<script>
  (function () {
    var p = location.pathname.replace(/\\/+$/, '').toLowerCase();
    var kaart = { '/christelijke-cadeaus': '/c/christelijk/', '/cadeaus-voor-kinderen': '/voor/kinderen/', '/cadeauzoeker': '/vonk/', '/c/cadeaus/onder-10': '/c/cadeaus/onder-15/', '/c/mode-beauty/sieraden': '/c/sieraden/', '/c/christelijk/doop-communie': '/c/christelijk/doop-belijdenis/', '/c/christelijk/beelden-kruisen': '/c/christelijk/wanddecoratie/', '/cadeaugidsen': '/gids/', '/babycadeaus': '/voor/baby/' };
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
  const verhuisdPaden = Object.keys(VERHUISD).map(k => '/' + k + '/');
  const urls = paginas.filter(p => !p.geenIndex && !(p.prod && p.prod.status === 'uitverkocht') && !HOOFDPAGINA[p.pad] && verhuisdPaden.indexOf(p.pad) === -1).map(p => '  <url><loc>' + SITE + p.pad + '</loc><lastmod>' + (/^\d{4}-\d\d-\d\d$/.test(p.datum || '') && p.datum <= vandaag ? p.datum : vandaag) + '</lastmod></url>');
  fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + urls.join('\n') + '\n</urlset>\n');
  console.log('Klaar:', paginas.length, 'pagina\'s,', urls.length, 'in de sitemap');
  /* SNEL (13-11-2026): per lijstpagina een klein productbestand (pak), elk nagekeken tegen de hele lijst. Zie scripts/maak-pakken.js.
     Staat AAN sinds 13-11-2026 (GO Marius), voor de drukste soorten pagina's (zie DRUK in maak-pakken.js). Uit: LK_PAKKEN=0. Alle pagina's: LK_PAKKEN=alles.
     Zonder pakken ruimen we de map op, zodat er nooit oude pakken bij een nieuwe bouw blijven liggen. */
  if (process.env.LK_PAKKEN !== '0') { try { require('./maak-pakken.js'); } catch (e) { console.error('pakken niet gemaakt (de site werkt gewoon, alleen zonder pakken):', e.message); } }
  else fs.rmSync(path.join(ROOT, 'assets', 'pak'), { recursive: true, force: true });
})().catch(e => { console.error(e); process.exit(1); });
