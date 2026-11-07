/* =========================================================
   LeukeKeuze – alle pagina's en navigatie
   Pagina's (adres na #):
     /                  home
     /categorieen       alle categorieën
     /c/cadeaus         categorie   (?prijs=tot25&sort=prijs-op)
     /c/cadeaus/kerst   subcategorie
     /p/vb-01           product
     /zoek?q=kaars      zoeken      (?prijs=tot10)
     /vonk              VONK cadeauzoeker
     /favorieten        bewaarde producten
     /info/privacy      tekstpagina's
   ========================================================= */
(function () {
  var LK = window.LK, ALLECATS = window.LK_CATEGORIEEN,
    /* Hoofdcategorieën: zonder de categorieën die onder een andere hangen. */
    CATS = ALLECATS.filter(function (c) { return !c.onder && !c.verborgen; }), PRIJZEN = window.LK_PRIJZEN, INST = window.LK_INSTELLINGEN;
  var ic = LK.icoon, esc = LK.esc;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var app = $('#app');
  /* Marius zelf (link uit zijn Control Room met ?eigen=1): deze browser voortaan niet meetellen in GoatCounter.
     GoatCounter slaat elke telling over zolang 'skipgc' in deze browser staat. Daarna het stukje uit het adres halen. */
  if (/[?&]eigen=1/.test(location.search)) {
    try { localStorage.setItem('skipgc', 't'); } catch (e) {}
    try { history.replaceState(null, '', location.pathname + location.search.replace(/([?&])eigen=1&?/, '$1').replace(/[?&]$/, '') + location.hash); } catch (e) {}
  }
  /* Oude adressen met # (bijv. leukekeuze.nl/#/c/wonen) omzetten naar het echte adres */
  if (/^#\//.test(location.hash)) {
    try { history.replaceState(null, '', netjes(location.hash.slice(1))); } catch (e) {}
  }

  var vorigeVonk = null; var vorigPad = null;

  /* ---------- Hulpjes ---------- */
  function vulIconen(root) {
    $$('[data-ic]', root).forEach(function (el) {
      el.insertAdjacentHTML('afterbegin', ic(el.getAttribute('data-ic')));
      el.removeAttribute('data-ic');
    });
  }
  function leesAdres() {
    var d = [location.pathname.replace(/\/index\.html$/, '/'), location.search.replace(/^\?/, '')];
    var q = {};
    (d[1] || '').split('&').forEach(function (kv) {
      if (!kv) return; var x = kv.split('=');
      q[decodeURIComponent(x[0])] = decodeURIComponent((x[1] || '').replace(/\+/g, ' '));
    });
    return { pad: d[0] || '/', delen: d[0].split('/').filter(Boolean), q: q };
  }
  function maakAdres(pad, q) {
    var s = Object.keys(q || {}).filter(function (k) { return q[k] && q[k] !== 'alle' && q[k] !== 'aanbevolen'; })
      .map(function (k) { return encodeURIComponent(k) + '=' + encodeURIComponent(q[k]); }).join('&');
    return netjes(pad) + (s ? '?' + s : '');
  }
  /* Echte adressen (zonder #): altijd met een / aan het eind, zoals GitHub Pages ze serveert. */
  function netjes(url) {
    var d = String(url).split('?');
    var pad = d[0].replace(/\/+$/, '') + '/';
    return pad + (d[1] ? '?' + d[1] : '');
  }
  function huidigAdres() { return location.pathname + location.search; }
  function ga(url, vervang) {
    url = netjes(url);
    /* 5-11-2026 (wens Marius): een filter of sortering kiezen op dezelfde pagina is geen nieuwe stap in de geschiedenis.
       Zo brengt de terugknop je in één keer naar de vorige pagina, zoals bij bol en Coolblue (eerst moest je elke filterklik terug). */
    var doelPad = url.split('?')[0].split('#')[0];
    if (!vervang && doelPad === netjes(location.pathname) && /^\/(c|voor|gelegenheid|collectie)\//.test(doelPad)) vervang = true;
    if (!window.LK_PRODUCTEN) { location[vervang ? 'replace' : 'assign'](url); return; } /* lijst nog niet binnen: gewoon de pagina laden */
    try { history[vervang ? 'replaceState' : 'pushState']({}, '', url); } catch (e) { location.href = url; return; }
    toon();
  }
  /* 3.0 (4-11-2026): links naar een oude afdeling of een oud vakje meteen naar de nieuwe plek laten wijzen (zonder omweg). */
  function verhuisd(h) {
    var m = /^\/c\/([^\/?#]+)(?:\/([^\/?#]+))?\/?([?#].*)?$/.exec(h); if (!m) return h;
    var c = window.LK_CAT(m[1]); if (!c) return h;
    var s = m[2] ? window.LK_SUB(c, m[2]) : null;
    var naar = (s && s.verborgen && s.naar) || (!m[2] && c.verborgen && c.naar) || '';
    return naar ? naar.replace(/\/$/, '') + (m[3] || '') : h;
  }
  function netteLinks(root) {
    $$('a[href^="/"]', root).forEach(function (a) {
      var h = a.getAttribute('href');
      if (h.indexOf('//') === 0) return;
      var n = netjes(verhuisd(h));
      if (n !== h) a.setAttribute('href', n);
    });
  }
  /* Daisycon-links herkennen (lt45.net, fr135.net, bdt9.net, enz.). Tijdens de 'daisyconPauze' gaan we rechtstreeks naar de winkel. */
  function isDaisycon(u) { return /^https?:\/\/(lt45|fr135|bdt9|glp8|ds1|jdt8|rkn3|jf79)\.n[le]t?\/c\/|^https?:\/\/aff\.svinando\.be\/c\//.test(u || ''); }
  /* Tijdens de Daisycon-pauze verdienen we niets aan Daisycon-producten: ze blijven zichtbaar, maar komen ná de rest
     (wens van Marius, 01-11-2026). Zet je daisyconPauze uit in data.js, dan doen ze vanzelf weer gewoon mee. */
  /* Gaat deze Daisycon-link (nog) niet naar de winkel? Tijdens de pauze alle Daisycon-links, daarna alleen de campagnes in daisyconZonder. */
  function dcDirect(u) {
    if (!isDaisycon(u)) return false;
    if (INST.daisyconPauze) return true;
    var m = (u || '').match(/[?&]si=(\d+)/);
    return !!(m && (INST.daisyconZonder || []).indexOf(m[1]) !== -1);
  }
  function daisyconLaag(lijst) {
    var voor = [], na = [];
    lijst.forEach(function (p) { ((INST.daisyconPauze && p.dc) || dcDirect(p.url) ? na : voor).push(p); });
    return voor.concat(na);
  }
  /* 02-11-2026 (Marius): wie via TikTok/Instagram/Facebook/Pinterest binnenkomt, zit in de ingebouwde browser van die app.
     Daar is niemand ingelogd bij bol of Amazon, dus mensen haken af of bestellen later in de app (dan telt onze klik niet).
     Alleen in die ingebouwde browsers tonen we een tip om de pagina in de eigen browser te openen. Geen cookies. */
  var INAPP = (function () { var u = navigator.userAgent || ''; var m = u.match(/Instagram|FBAN|FBAV|FB_IAB|FBIOS|musical_ly|TikTok|BytedanceWebview|Bytedance|Pinterest|Snapchat|LinkedInApp/i); if (!m) return ''; var n = m[0].toLowerCase(); return /insta/.test(n) ? 'Instagram' : /fb/.test(n) ? 'Facebook' : /pinterest/.test(n) ? 'Pinterest' : /snap/.test(n) ? 'Snapchat' : /linkedin/.test(n) ? 'LinkedIn' : 'TikTok'; })();
  var ANDROID = /Android/i.test(navigator.userAgent || '');
  function inAppTip(p) {
    if (!INAPP || !p.url || p.voorbeeld) return '';
    var hier = location.host + location.pathname + location.search;
    var knop = ANDROID
      ? '<a class="knop knop-rand" href="intent://' + esc(hier) + '#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=' + esc(encodeURIComponent(location.href)) + ';end">Openen in Chrome</a>'
      : '<span class="inapp-stap">Tik rechtsboven op <b>⋯</b> en kies <b>Openen in browser</b> (of <b>Openen in Safari</b>).</span>';
    return '<div class="inapp-tip">' + ic('info') + '<div><p>Je kijkt nu binnen ' + esc(INAPP) + '. Open LeukeKeuze in je eigen browser, dan ben je bij ' + esc(p.shop) + ' meestal al ingelogd en gaat bestellen sneller.</p>' + knop + '</div></div>';
  }
  function winkelLink(p) { return dcDirect(p.url) && p.winkelUrl ? p.winkelUrl : p.url; }
  var WINKELSITE = { 'Ditverzinjeniet': 'https://www.ditverzinjeniet.nl/', 'Dille & Kamille': 'https://www.dille-kamille.nl/', 'LEGO': 'https://www.lego.com/nl-nl',
    'Westwing': 'https://www.westwing.nl/', 'Decantalo': 'https://www.decantalo.nl/', 'MYKA': 'https://www.myka.com/nl/', 'Prydligt': 'https://www.prydligt.nl/',
    '999 Games': 'https://www.999games.nl/', 'La Redoute': 'https://www.laredoute.nl/', 'Kaartje2go': 'https://www.kaartje2go.nl/', 'Bartogi': 'https://www.bartogi.nl/',
    'Wijnkring': 'https://www.wijnkring.nl/', 'Kerstland': 'https://www.kerstland.nl/', 'Teufel': 'https://teufelaudio.nl/', 'Dropwinkel': 'https://www.dropwinkel.eu/',
    'Bloompost': 'https://www.bloompost.nl/', 'Dr. Martens': 'https://www.drmartens.com/nl/nl/', 'Razer': 'https://www.razer.com/', 'Fietsparadijs': 'https://www.fietsparadijs.com/',
    'Fietstas.com': 'https://www.fietstas.com/', 'Zadig & Voltaire': 'https://zadig-et-voltaire.com/eu/nl/' };
  function prijsFilter(id) {
    if (window.LK_PRIJS_OUD && window.LK_PRIJS_OUD[id]) id = window.LK_PRIJS_OUD[id]; /* oude adressen (tot10, tot50, boven50) */
    var f = PRIJZEN.find(function (p) { return p.id === id; }); if (f) return f;
    /* Eigen budget uit VONK-tekst (fase 3): 'tot40' = tot €40, 'vanaf75' = vanaf €75. */
    var m = /^(tot|vanaf)(\d{1,4})$/.exec(id || '');
    if (m) return m[1] === 'tot' ? { id: id, label: 'Tot €' + m[2], min: 0, max: +m[2] } : { id: id, label: 'Vanaf €' + m[2], min: +m[2], max: Infinity };
    return PRIJZEN[0];
  }
  function binnenPrijs(p, id) { var f = prijsFilter(id); return p.prijs >= f.min && p.prijs <= f.max; }
  function kortingPct(p) { return p.oudePrijs > p.prijs ? (1 - p.prijs / p.oudePrijs) * 100 : 0; }
  /* 7-11-2026 (richtlijn 'minder maar beter'): per pagina staan de met de hand gekozen toppers bovenaan.
     De lijst met keuzes staat in assets/js/topkeuze.js (gemaakt uit het paginaplan); de rest volgt gewoon erachter. */
  function metTopkeuze(l, sleutel) {
    var keuze = sleutel && window.LK_TOPKEUZE && window.LK_TOPKEUZE[sleutel];
    if (!keuze || !keuze.length) return null;
    var plek = {}; keuze.forEach(function (id, i) { plek[id] = i + 1; });
    var top = [], rest = [];
    l.forEach(function (p) { (plek[p.id] ? top : rest).push(p); });
    if (!top.length) return null;
    top.sort(function (a, b) { return plek[a.id] - plek[b.id]; });
    return top.concat(mix(rest));
  }
  function sorteer(lijst, hoe, sleutel) {
    var l = lijst.slice();
    if (!hoe || hoe === 'aanbevolen') { var m = metTopkeuze(l, sleutel); if (m) return m; }
    if (hoe === 'prijs-op') l.sort(function (a, b) { return a.prijs - b.prijs; });
    else if (hoe === 'prijs-af') l.sort(function (a, b) { return b.prijs - a.prijs; });
    else if (hoe === 'nieuw') l.sort(function (a, b) { return (b.sinds || '').localeCompare(a.sinds || '') || (LK.isNieuw(b) ? 1 : 0) - (LK.isNieuw(a) ? 1 : 0); });
    /* Black Friday (5-11-2026): grootste korting in procenten eerst. */
    else if (hoe === 'korting') l.sort(function (a, b) { return kortingPct(b) - kortingPct(a); });
    else l = mix(l);
    return l;
  }
  /* 'Aanbevolen': een mooie mix. Favorieten eerst, daarna goedkoop en duur door elkaar,
     verschillende winkels om en om, nieuwe producten iets naar voren.
     De volgorde schuift elke week een beetje, zodat nieuwe producten vanzelf meedoen. */
  function mixGetal(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return ((h >>> 0) % 100000) / 100000; }
  /* 3.0 (5-11-2026, Marius en Nova): 'Aanbevolen' = de beste, meest gezochte cadeaus bovenaan, goed gemixt.
     p.rang komt uit scripts/boom/rang.py (cadeau-niveau van het vakje, wat klanten graag willen, toppers, nieuwe toppers, echte kliks).
     Op kinderpagina's gaat speelgoed voor. Daarna mixen: niet twee keer hetzelfde soort product of dezelfde winkel achter elkaar.
     De volgorde schuift elke week een klein beetje, zodat ook andere goede producten aan de beurt komen. */
  function mix(lijst) {
    var week = Math.floor(Date.now() / (7 * 864e5)), a = leesAdres(), d = a.delen, q = a.q || {};
    var kind = (d[0] === 'voor' && /^(kinderen|baby)$/.test(d[1] || '')) || /^(kinderen|kind|baby)$/.test(q.voor || '') || q.wie === 'kinderen' || !!q.leeftijd || !!q.kind;
    var tiener = (d[0] === 'voor' && d[1] === 'tieners') || q.voor === 'tieners';
    var GRENZEN = [15, 30, 60, 120, Infinity];
    var l = lijst.map(function (p) {
      var s = (typeof p.rang === 'number' ? p.rang : 0.55) + (mixGetal(p.id + '|' + week) - 0.5) * 0.12 + (p.beeld ? 0 : -0.5);
      if (kind) s += p.afd === 'speelgoed' ? 0.18 : (p.afd === 'hobby' || p.afd === 'tuin-klussen' || p.afd === 'wonen' || p.afd === 'beauty-verzorging') ? -0.12 : 0;
      if (tiener && (p.afd === 'elektronica' || p.groep === 'spellen')) s += 0.1;
      var b = 0; while (typeof p.prijs === 'number' && p.prijs >= GRENZEN[b]) b++;
      return { p: p, s: s, v: p.vak || p.groep || (p.cat + '/' + p.sub), w: p.shop, b: b };
    });
    l.sort(function (x, y) { return y.s - x.s; });
    var uit = [];
    while (l.length) {
      var n = uit.length, v1 = n ? uit[n - 1] : null, v2 = n > 1 ? uit[n - 2] : null, beste = 0, besteS = -1e9;
      for (var i = 0; i < l.length && i < 14; i++) {
        var c = l[i], straf = 0;
        if (v1 && c.v === v1.v) straf += 0.25; if (v2 && c.v === v2.v) straf += 0.12;
        if (v1 && c.w === v1.w) straf += 0.12; if (v1 && c.b === v1.b) straf += 0.04;
        if (c.s - straf > besteS) { besteS = c.s - straf; beste = i; }
      }
      uit.push(l.splice(beste, 1)[0]);
    }
    return daisyconLaag(uit.map(function (x) { return x.p; }));
  }
  function grid(lijst, leegHtml, klasse) {
    if (!lijst.length) return '<div class="prodgrid ' + (klasse || '') + '">' + leegHtml + '</div>';
    return '<div class="prodgrid ' + (klasse || '') + '">' + lijst.map(function (p, i) { return eerstSnel(LK.productKaart(p), i); }).join('') + '</div>';
  }
  /* De eerste vier foto's meteen laden (niet 'lazy'): dan staat het eerste rijtje sneller op het scherm, vooral op een telefoon. */
  function eerstSnel(h, i) { return i < 4 ? h.replace('loading="lazy"', 'loading="eager" fetchpriority="high"') : h; }
  /* Lange lijsten: eerst PER_KEER producten, daarna een 'Toon meer'-knop.
     Stap 3 indeling (6-11-2026): de rest staat niet verborgen in de pagina, maar wordt pas gemaakt als je op de knop drukt.
     Wonen had 1.409 kaarten in de pagina staan; op een telefoon kostte dat seconden. Nu staan er 24. */
  /* Getallen op z'n Nederlands: 1.409 */
  function getal(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }
  var PER_KEER = 36, MEER_LIJSTEN = [];
  function gridMeer(lijst, leegHtml, n) {
    var per = n || PER_KEER;
    if (lijst.length <= per) return grid(lijst, leegHtml);
    var k = MEER_LIJSTEN.push({ lijst: lijst, getoond: per, per: per }) - 1;
    return '<div class="prodgrid" data-meer-grid="' + k + '">' + lijst.slice(0, per).map(function (p, i) { return eerstSnel(LK.productKaart(p), i); }).join('') + '</div>' +
      '<div class="meer-knop"><button class="knop knop-rand" type="button" data-meer="' + k + '">Toon meer <small>(' + per + ' van ' + getal(lijst.length) + ')</small></button></div>';
  }
  /* Volgende portie kaarten erbij zetten (knop 'Toon meer', of terugkomen op een lijst waar je al verder was). */
  function toonMeer(k, aantal) {
    var m = MEER_LIJSTEN[k], g = $('[data-meer-grid="' + k + '"]', app);
    if (!m || !g) return;
    var tot = Math.min(m.lijst.length, m.getoond + (aantal || m.per));
    if (tot > m.getoond) {
      var stuk = document.createElement('div');
      stuk.innerHTML = m.lijst.slice(m.getoond, tot).map(LK.productKaart).join('');
      vulIconen(stuk); netteLinks(stuk);
      while (stuk.firstChild) g.appendChild(stuk.firstChild);
      m.getoond = tot;
    }
    var knop = $('[data-meer="' + k + '"]', app);
    if (knop) { if (tot >= m.lijst.length) knop.parentNode.remove(); else knop.innerHTML = 'Toon meer <small>(' + tot + ' van ' + getal(m.lijst.length) + ')</small>'; }
  }
  /* Keuzes bovenaan een lijstpagina (stap 3 indeling): een vast raster van rondjes dat omloopt, 4 per rij op een telefoon.
     Meer dan 8? Dan staan de eerste 8 in beeld en de rest achter één knop 'Meer'. Geen schuifrijen meer: op een telefoon zag je alleen wat vooraan stond. */
  var KEUZES_ZICHT = 8;
  /* o.altijd: ook op de computer eerst 8 (personen hebben tot 15 onderdelen). o.alles: nooit inklappen (overzichten). o.groot: grotere rondjes, 3 per rij. */
  function keuzeRaster(items, label, o) {
    o = o || {};
    if (!items.length) return '';
    var meer = !o.alles && items.length > KEUZES_ZICHT;
    return '<nav class="keuzes-blok' + (o.altijd ? ' altijd' : '') + '" aria-label="' + esc(label) + '"><div class="keuzes' + (meer ? ' ingeklapt' : '') + (o.altijd ? ' altijd' : '') + (o.groot ? ' groot' : '') + '">' + items.map(function (x) {
      return '<a class="keuzerond' + (x.actief ? ' actief' : '') + '" href="' + esc(x.naar) + '"' + (x.actief ? ' aria-current="page"' : '') + '>' +
        '<span class="rond">' + (x.beeld ? '<img src="' + esc(x.beeld) + '" alt="" loading="lazy" decoding="async" width="88" height="88">' : (x.icoon || '')) + '</span>' +
        '<span class="naam">' + esc(x.naam) + '</span></a>';
    }).join('') + '</div>' +
      (meer ? '<button class="keuzes-meer" type="button" data-keuzes-meer aria-expanded="false">Meer <small>(nog ' + (items.length - KEUZES_ZICHT) + ')</small> ' + ic('omlaag') + '</button>' : '') + '</nav>';
  }
  /* Onderaan elke lijstpagina: verder kijken als tekstlinks (geen rij met plaatjes die je voorbij moet schuiven). */
  function tekstLinks(kop, links) {
    if (!links.length) return '';
    return '<section class="sectie verder"><h2>' + esc(kop) + '</h2><nav class="tekstlinks" aria-label="' + esc(kop) + '">' + links.map(function (l) {
      return '<a href="' + esc(l[1]) + '">' + esc(l[0]) + '</a>';
    }).join('') + '</nav></section>';
  }
  /* Horizontale rij om doorheen te vegen (homepage). */
  function rij(lijst) {
    return '<div class="prodgrid rij">' + lijst.map(LK.productKaart).join('') + '</div>';
  }
  function leegBlok(titel, tekst, knoppen) {
    return '<div class="leeg"><strong>' + titel + '</strong>' + tekst + (knoppen ? '<div>' + knoppen + '</div>' : '') + '</div>';
  }
  function catBeeld(c, klein) {
    if (!c.tegel) return ic(c.icoon);
    var src = klein ? c.tegel.replace('.webp', '-klein.webp') : c.tegel;
    return '<img src="' + esc(src) + '" alt="" loading="lazy" decoding="async">';
  }
  function kruimel(stukken) {
    return '<nav class="kruimel" aria-label="Kruimelpad"><a href="/">Home</a>' + stukken.map(function (s) {
      return '<span aria-hidden="true">›</span>' + (s.naar ? '<a href="' + s.naar + '">' + esc(s.tekst) + '</a>' : '<span>' + esc(s.tekst) + '</span>');
    }).join('') + '</nav>';
  }
  /* 5-11-2026 (wens Marius: "filters aanpassen aan de pagina", bv. geen 'Baby' bij Tv & beeld):
     elke pagina zet TEL = een functie die telt hoeveel producten er met een bepaalde keuze overblijven.
     Knoppen zonder producten verdwijnen; een filter met minder dan 2 echte keuzes verdwijnt helemaal.
     Een knop die nu aan staat blijft altijd staan (zo kun je hem uitzetten). In het paneel staat het aantal erachter. */
  var TEL = null;
  function telKeuze(q, sleutel, waarde) {
    if (!TEL) return null;
    var nq = Object.assign({}, q); if (waarde) nq[sleutel] = waarde; else delete nq[sleutel];
    return TEL(nq);
  }
  function chipTal(n) { return n === null ? '' : ' <small>' + n + '</small>'; }
  /* Minder dan 3 producten: knop weg. Geeft elke keuze bijna alles (90% of meer), dan maakt het filter niets kleiner: weg. */
  var MIN_KNOP = 3;
  function filterNut(aantallen, totaal) { return aantallen.length >= 2 && aantallen.some(function (n) { return n < totaal * 0.9; }); }
  function prijsChips(pad, q) {
    var huidig = q.prijs || 'alle', echt = [];
    var html = PRIJZEN.map(function (p) {
      var n = p.id === 'alle' ? null : telKeuze(q, 'prijs', p.id);
      if (n !== null && n < MIN_KNOP && huidig !== p.id) return '';
      if (n !== null) echt.push(n);
      var nq = Object.assign({}, q, { prijs: p.id });
      return '<a class="chip" href="' + maakAdres(pad, nq) + '" aria-pressed="' + (huidig === p.id) + '">' + p.label + chipTal(n) + '</a>';
    }).join('');
    if (TEL && huidig === 'alle' && !filterNut(echt, telKeuze(q, 'prijs', ''))) return '';
    return '<div class="chips" role="group" aria-label="Budget">' + html + '</div>';
  }
  /* 2.0: filter 'Voor wie' op categoriepagina's: zelfde labels als de persoonspagina's. */
  var VOOR_WIE = [['', 'Iedereen'], ['hem', 'Hem'], ['haar', 'Haar'], ['kinderen', 'Kinderen'], ['tieners', 'Tieners'], ['opa-oma', 'Opa & oma'], ['collega', 'Collega'], ['baby', 'Baby']];
  function voorChips(pad, q) {
    var huidig = q.voor || '', echt = [];
    var html = VOOR_WIE.map(function (v) {
      var n = v[0] ? telKeuze(q, 'voor', v[0]) : null;
      if (n !== null && n < MIN_KNOP && huidig !== v[0]) return '';
      if (n !== null) echt.push(n);
      var nq = Object.assign({}, q, { voor: v[0] });
      return '<a class="chip" href="' + maakAdres(pad, nq) + '" aria-pressed="' + (huidig === v[0]) + '">' + v[1] + chipTal(n) + '</a>';
    }).join('');
    if (TEL && !huidig && !filterNut(echt, telKeuze(q, 'voor', ''))) return '';
    return '<div class="chips voor-chips" role="group" aria-label="Voor wie">' + html + '</div>';
  }
  /* 2.1: eigen knoppen per pagina (Dames · Heren · Kinderen, Jongen · Meisje, Leeftijd ...), zie LK_KNOPSETS in data.js. */
  function knopSets(namen, q) {
    return (namen || []).map(function (n) { return (window.LK_KNOPSETS || {})[n]; })
      .filter(function (k) { return k && (!k.als || q[k.als[0]] === k.als[1]); });
  }
  function knopRij(pad, q, k) {
    var huidig = q[k.param] || '', echt = [];
    var html = [['', 'Alles']].concat(k.opties).map(function (o) {
        var nq = Object.assign({}, q); nq[k.param] = o[0];
        /* Kies je bij sieraden weer 'Alles' of 'Dames', dan vervalt Jongen/Meisje. */
        if (k.param === 'wie' && o[0] !== 'kinderen') delete nq.kind;
        var n = o[0] && TEL ? TEL(nq) : null;
        if (n !== null && n < MIN_KNOP && huidig !== o[0]) return '';
        if (n !== null) echt.push(n);
        return '<a class="chip" href="' + maakAdres(pad, nq) + '" aria-pressed="' + (huidig === o[0]) + '">' + esc(o[1]) + chipTal(n) + '</a>';
      }).join('');
    if (TEL && !huidig && !filterNut(echt, telKeuze(q, k.param, ''))) return '';
    return '<div class="chips knop-chips" role="group" aria-label="' + esc(k.titel) + '">' + html + '</div>';
  }
  function knopChips(pad, q, namen) {
    return knopSets(namen, q).map(function (k) { var rij = knopRij(pad, q, k); return rij ? '<div class="knop-groep"><div class="chips-titel">' + esc(k.titel) + '</div>' + rij + '</div>' : ''; }).join('');
  }
  function knopFilter(p, q, namen) {
    return knopSets(namen, q).every(function (k) {
      var keuze = q[k.param]; if (!keuze) return true;
      var o = k.opties.filter(function (x) { return x[0] === keuze; })[0];
      return !o || window.LK_KNOPTEST(p, o[2]);
    });
  }
  function aantalKnoppen(q, namen) { return knopSets(namen, q).filter(function (k) { return q[k.param]; }).length + (q.merk ? 1 : 0) + (q.winkel ? 1 : 0); }
  /* 5-11-2026: extra filters Merk en Winkel (wens Marius: "zoek uit welke filters welke spullen nodig hebben").
     Merk: uit het veld 'merk', anders herkend aan het begin van de titel (merken die minstens 3x voorkomen).
     Getoond alleen als er op de pagina minstens 2 merken/winkels met 3+ producten zijn en het filter echt iets kleiner maakt. */
  var MERKEN = null, NIET_MERK = /^(merkloos|sans marque|merkloos \/ sans marque|onbekend|generic|no brand)$/i;
  function merkVan(p) {
    if (p._merk !== undefined) return p._merk;
    if (!MERKEN) {
      var tel = {}; (window.LK_PRODUCTEN || []).forEach(function (x) { var m = (x.merk || '').trim(); if (m && !NIET_MERK.test(m)) tel[m] = (tel[m] || 0) + 1; });
      MERKEN = Object.keys(tel).filter(function (m) { return tel[m] >= 3 && m.length >= 2; }).sort(function (a, b) { return b.length - a.length; });
    }
    var m = (p.merk || '').trim();
    if (!m || NIET_MERK.test(m)) {
      m = ''; var t = (p.titel || '').toLowerCase();
      for (var i = 0; i < MERKEN.length; i++) { var k = MERKEN[i].toLowerCase(); if (t.indexOf(k) === 0 && !/[a-z0-9]/.test(t.charAt(k.length) || ' ')) { m = MERKEN[i]; break; } }
    }
    return (p._merk = m);
  }
  function extraFilter(p, q) {
    if (q.merk && merkVan(p).toLowerCase() !== String(q.merk).toLowerCase()) return false;
    if (q.winkel && String(p.shop || '').toLowerCase() !== String(q.winkel).toLowerCase()) return false;
    return true;
  }
  var BASIS = null;
  function lijstChips(pad, q, sleutel, titel, waardeVan, maxAantal) {
    if (!TEL || !BASIS) return '';
    var tel = {};
    BASIS.forEach(function (p) { var w = waardeVan(p); if (w) tel[w] = (tel[w] || 0) + 1; });
    var huidig = q[sleutel] || '';
    var kand = Object.keys(tel).filter(function (w) { return tel[w] >= MIN_KNOP; }).sort(function (a, b) { return tel[b] - tel[a]; }).slice(0, maxAantal);
    if (huidig && kand.map(function (x) { return x.toLowerCase(); }).indexOf(huidig.toLowerCase()) === -1) kand.unshift(huidig);
    var echt = [];
    var html = kand.map(function (w) {
      var nq = Object.assign({}, q); nq[sleutel] = w; var n = TEL(nq);
      var aan = huidig.toLowerCase() === w.toLowerCase();
      if (n < MIN_KNOP && !aan) return '';
      echt.push(n);
      return '<a class="chip" href="' + maakAdres(pad, nq) + '" aria-pressed="' + aan + '">' + esc(w) + chipTal(n) + '</a>';
    }).join('');
    var zonder = Object.assign({}, q); delete zonder[sleutel];
    if (!huidig && !filterNut(echt, TEL(zonder))) return '';
    return '<div class="knop-groep"><div class="chips-titel">' + titel + '</div><div class="chips knop-chips" role="group" aria-label="' + titel + '">' +
      '<a class="chip" href="' + maakAdres(pad, zonder) + '" aria-pressed="' + !huidig + '">Alles</a>' + html + '</div></div>';
  }
  function merkWinkelChips(pad, q) {
    return lijstChips(pad, q, 'merk', 'Merk', merkVan, 12) + lijstChips(pad, q, 'winkel', 'Winkel', function (p) { return p.shop; }, 10);
  }
  /* Plekken van een product: vak, groep, ookIn en tags (als 'tag:naam'). */
  function plekkenVan(p) { return [p.cat + '/' + p.sub, p.cat].concat(p.ookIn || []).concat((p.tags || []).map(function (t) { return 'tag:' + t; })); }
  /* Vakje dat maar tot een datum meedoet (bijv. Sinterklaas tot 5 december). */
  function nogGeldig(x) { if (!x.tot) return true; var d = new Date(); var nu = ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); return x.tot >= '09-01' ? nu >= '09-01' && nu <= x.tot : nu <= x.tot; }
  /* Rond plaatje: eigen beeld, anders de foto van een mooi product uit dat vakje. */
  function rondBeeld(beeld, lijst) {
    if (beeld) return kleinBeeld(beeld);
    var p = (lijst || []).filter(function (x) { return x.beeld && (x.sfeer || x.favoriet || x.populair); })[0] || (lijst || []).filter(function (x) { return x.beeld; })[0];
    if (!p) return '';
    /* Productfoto's staan zonder extensie in de lijst (bijv. images/producten/bol-123): de kleine webp-versie gebruiken. */
    return /^https?:\/\//.test(p.beeld) || /\.(webp|jpe?g|png)$/i.test(p.beeld) ? p.beeld : p.beeld + '-klein.webp';
  }
  function voorFilter(p, voor) {
    if (!voor) return true;
    var pe = window.LK_PERSOON(voor); if (!pe) return true;
    return (p.voor || []).some(function (v) { return pe.labels.indexOf(v) !== -1; }) || (pe.oud && (p.cat + '/' + p.sub === pe.oud || (p.ookIn || []).indexOf(pe.oud) !== -1));
  }
  /* Mobiel: knop 'Filter & sorteren' die onderin blijft staan als de werkbalk uit beeld is.
     Tik je erop, dan schuift een paneel omhoog met de budgetknoppen (en sortering). Wens van Marius, 24-10-2026. */
  function filterPaneel(pad, q, sorteerOpties, knoppen, aantal) {
    var aantalFilters = (q.prijs && q.prijs !== 'alle' ? 1 : 0) + (q.sort && q.sort !== 'aanbevolen' ? 1 : 0) + (q.voor ? 1 : 0) + aantalKnoppen(q, knoppen);
    var metVoor = !(knoppen && knoppen.length) && pad.indexOf('/c/') === 0 && pad.indexOf('/c/christelijk') !== 0 && pad.indexOf('/c/noodpakket-survival') !== 0;
    return '<button class="filterknop" type="button" data-filter-open aria-hidden="true" tabindex="-1">' + ic('filter') + 'Filter &amp; sorteren' +
        (aantalFilters ? ' <span class="filter-teller">' + aantalFilters + '</span>' : '') + '</button>' +
      '<div class="filterpaneel" data-filterpaneel hidden><button type="button" class="filter-achter" data-filter-dicht aria-label="Sluiten" tabindex="-1"></button>' +
        '<div class="filter-blad" role="dialog" aria-modal="true" aria-label="Filter en sorteren">' +
          '<div class="filter-kop"><strong>Filter &amp; sorteren</strong><button type="button" class="filter-sluit" data-filter-dicht aria-label="Sluiten">' + ic('sluit') + '</button></div>' +
          (metVoor && voorChips(pad, q) ? '<h3>Voor wie</h3>' + voorChips(pad, q).replace('class="chips voor-chips"', 'class="chips filter-chips"') : '') +
          knopSets(knoppen, q).map(function (k) { var rij = knopRij(pad, q, k); return rij ? '<h3>' + esc(k.titel) + '</h3>' + rij.replace('class="chips knop-chips"', 'class="chips filter-chips"') : ''; }).join('') +
          merkWinkelChips(pad, q).replace(/<div class="knop-groep"><div class="chips-titel">([^<]+)<\/div><div class="chips knop-chips"/g, '<h3>$1</h3><div class="chips filter-chips"').replace(/<\/div><\/div>/g, '</div>') +
          (prijsChips(pad, q) ? '<h3>Budget</h3>' + prijsChips(pad, q).replace('class="chips"', 'class="chips filter-chips"') : '') +
          (sorteerOpties ? '<h3>Sorteren</h3><div class="chips filter-chips">' + sorteerOpties.map(function (o) {
            return '<a class="chip" href="' + maakAdres(pad, Object.assign({}, q, { sort: o[0] === 'aanbevolen' ? '' : o[0] })) + '" aria-pressed="' + ((q.sort || 'aanbevolen') === o[0]) + '">' + o[1] + '</a>';
          }).join('') + '</div>' : '') +
          /* 5-11-2026 (wens Marius): het paneel blijft open bij elke keuze; met deze knop sluit je het en zie je de producten. */
          '<div class="filter-voet"><a class="knop knop-rand" href="' + maakAdres(pad, {}) + '">Wissen</a>' +
          '<button class="knop knop-goud" type="button" data-filter-dicht>' + (typeof aantal === 'number' ? 'Toon ' + getal(aantal) + (aantal === 1 ? ' product' : ' producten') : 'Toon producten') + '</button></div>' +
        '</div></div>';
  }

  /* Mobiel (wens Marius 5-11-2026, naar zijn eigen ontwerp): bovenaan één knop Filteren en één knop Sorteren,
     het belangrijkste filter als één klein rijtje (Leeftijd, anders Prijs), en de gekozen filters als labels met een kruisje.
     Op de computer blijven de filterrijen zoals ze zijn; de labels met kruisje staan daar ook. */
  function filterLabels(pad, q, knoppen) {
    var uit = [];
    knopSets(knoppen, q).forEach(function (k) {
      var keuze = q[k.param]; if (!keuze) return;
      var o = k.opties.filter(function (x) { return x[0] === keuze; })[0]; if (!o) return;
      var nq = Object.assign({}, q); delete nq[k.param]; if (k.param === 'wie') delete nq.kind;
      uit.push([o[1], maakAdres(pad, nq)]);
    });
    if (q.voor) { var v = VOOR_WIE.filter(function (x) { return x[0] === q.voor; })[0]; if (v && v[0]) { var nv = Object.assign({}, q); delete nv.voor; uit.push([v[1], maakAdres(pad, nv)]); } }
    ['merk', 'winkel'].forEach(function (k) { if (q[k]) { var nm = Object.assign({}, q); delete nm[k]; uit.push([q[k], maakAdres(pad, nm)]); } });
    if (q.prijs && q.prijs !== 'alle') { var pr = PRIJZEN.filter(function (x) { return x.id === q.prijs; })[0]; if (pr) { var np = Object.assign({}, q); delete np.prijs; uit.push([pr.label, maakAdres(pad, np)]); } }
    if (!uit.length) return '';
    return '<div class="actief-filters" aria-label="Gekozen filters">' + uit.map(function (x) {
      return '<a class="actief-label" href="' + x[1] + '" aria-label="' + esc(x[0]) + ' weghalen">' + esc(x[0]) + ic('sluit') + '</a>';
    }).join('') + (uit.length > 1 ? '<a class="actief-wis" href="' + maakAdres(pad, q.sort ? { sort: q.sort } : {}) + '">Alles wissen</a>' : '') + '</div>';
  }
  function mobielBalk(pad, q, knoppen, sorteerOpties) {
    var aantal = (q.prijs && q.prijs !== 'alle' ? 1 : 0) + (q.voor ? 1 : 0) + aantalKnoppen(q, knoppen);
    var sets = knopSets(knoppen, q), lft = sets.filter(function (k) { return /leeftijd|hoe oud/i.test(k.titel); })[0]; /* stap 4: op Verjaardag ook 'Hoe oud wordt hij of zij?' als snel rijtje */
    var lftRij = lft ? knopRij(pad, q, lft) : '', prRij = lftRij ? '' : prijsChips(pad, q);
    var snel = lftRij ? '<div class="knop-groep mb-snel"><div class="chips-titel">' + esc(lft.titel) + '</div>' + lftRij + '</div>'
             : prRij ? '<div class="knop-groep mb-snel"><div class="chips-titel">Prijs</div>' + prRij + '</div>' : '';
    var so = sorteerOpties || [], gekozenSort = so.filter(function (o) { return o[0] === (q.sort || 'aanbevolen'); })[0];
    var sorteer = so.length ? '<label class="mb-sorteer"><span class="mb-tekst">' + ic('sorteer') + (gekozenSort && gekozenSort[0] !== 'aanbevolen' ? esc(gekozenSort[1]) : 'Sorteren') + '</span>' + ic('omlaag', 'mb-pijl') +
      '<select data-sorteer="' + esc(maakAdres(pad, Object.assign({}, q, { sort: '' }))) + '" aria-label="Sorteren">' +
      so.map(function (o) { return '<option value="' + o[0] + '"' + ((q.sort || 'aanbevolen') === o[0] ? ' selected' : '') + '>' + o[1] + '</option>'; }).join('') + '</select></label>' : '';
    return '<div class="mobiel-balk"><button class="mb-filter" type="button" data-filter-open>' + ic('filter') + 'Filteren' + (aantal ? ' <span class="mb-teller">' + aantal + '</span>' : '') + '</button>' + sorteer + '</div>' + snel;
  }
  function zoekForm(waarde, tekst) {
    return '<form class="zoek" role="search" data-zoek>' +
      ic('zoek', 'lp') +
      '<label class="verborgen" for="zk-' + (zoekForm.n = (zoekForm.n || 0) + 1) + '">Zoek een cadeau</label>' +
      '<input id="zk-' + zoekForm.n + '" type="search" name="q" value="' + esc(waarde || '') + '" placeholder="' + (tekst || 'Zoek in alle winkels…') + '" autocomplete="off" enterkeyhint="search">' +
      '<button type="submit" aria-label="Zoeken">' + ic('zoek') + '</button></form>';
  }
  function zetTitel(t) { window.LK_SEO = ''; document.title = t ? t + ' | LeukeKeuze' : 'LeukeKeuze – de mooiste cadeaus voor elk moment'; }

  /* ================== PAGINA'S ================== */

  /* ---------- Home ---------- */
  /* Stap 2 indeling (6-11-2026, GO Marius): de homepage volgens deel 7 van het plan. Twaalf blokken, producten in scherm 1.
     Volgorde: intro met twee knoppen, Voor wie, Onze favorieten, seizoen, laatst bekeken, budget, categorieën, persoonlijk + gelegenheden,
     acties van onze winkels, gidsen + eigen kleurboeken, zo werkt het. Elk blok heeft data-tel voor de klikteller. */
  function home() {
    zetTitel('');
    var CATS_VOOR = ['wonen', 'mode-sieraden', 'beauty-verzorging', 'elektronica', 'eten-drinken', 'speelgoed'];
    var CATS_REST = ['hobby', 'sport-outdoor', 'tuin-klussen', 'boeken-media', 'dieren'];
    var cat = function (slug, extra) {
      var c = window.LK_CAT(slug); if (!c || c.verborgen) return '';
      return '<a class="catbalk' + (extra ? ' extra' : '') + '" href="/c/' + c.slug + '"><span class="catbalk-rond"><img src="images/categorieen/rond/cat-' + c.slug + '.webp" alt="" loading="lazy" decoding="async" width="80" height="80"></span><span class="catbalk-naam">' + esc(c.naam) + '</span>' + ic('rechts', 'catbalk-pijl') + '</a>';
    };
    var persoon = function (slug) {
      var x = window.LK_PERSONEN.filter(function (p) { return p.slug === slug; })[0]; if (!x) return '';
      return '<a class="subkaart" href="' + (x.subs ? '/voor/' + x.slug : x.naar) + '"><span class="rond"><img src="' + esc(kleinBeeld(x.beeld)) + '" alt="" loading="lazy" decoding="async"></span>' + esc(x.kort) + '</a>';
    };
    var persoonLink = function (slug) {
      var x = window.LK_PERSONEN.filter(function (p) { return p.slug === slug; })[0]; if (!x) return '';
      return '<a class="chip" href="' + (x.subs ? '/voor/' + x.slug : x.naar) + '">' + esc(x.kort) + '</a>';
    };
    return '' +
      /* 1. Intro met twee knoppen: Help mij kiezen (VONK) en Lekker rondkijken (naar de favorieten). */
      '<section class="hero' + (INST.heroLogo ? ' hero-logo' : '') + (INST.heroNieuw ? ' hero-2026' : '') + '">' +
        '<picture><source media="(min-width: 760px)" srcset="' + esc(INST.heroDesktop) + '">' +
        '<img src="' + esc(INST.heroMobiel) + '" alt="" fetchpriority="high"></picture>' +
        '<div class="hero-inhoud"><div class="binnen">' +
          '<div class="kicker">' + esc(INST.heroKicker) + '</div>' +
          '<h1>' + esc(INST.heroTitel) + '<br><em>' + esc(INST.heroTitelGoud) + '</em></h1>' +
          '<p>' + esc(INST.heroTekst) + '</p>' +
          '<div class="hero-knoppen" data-tel="intro">' +
            '<a class="knop knop-goud" href="/vonk">' + ic('vonk') + ' Help mij kiezen</a>' +
            '<a class="knop knop-rand" href="#favorieten">Lekker rondkijken</a>' +
          '</div>' +
        '</div></div>' +
      '</section>' +

      '<div class="binnen">' +
        /* 2. Voor wie: mobiel 4 rondjes + 3 tekstlinks, desktop alle 7 rondjes. */
        '<section class="sectie eerste" data-tel="voor-wie">' +
          '<div class="sectie-kop"><div><h2>Voor wie zoek je een cadeau?</h2></div><a class="meer" href="/voor">Iedereen ' + ic('pijl') + '</a></div>' +
          '<div class="persoon-subs home zeven">' + ['haar', 'hem', 'kinderen', 'collega', 'baby', 'opa-oma', 'tieners'].map(persoon).join('') + '</div>' +
          '<div class="voorwie-links alleen-mobiel">' + ['baby', 'opa-oma', 'tieners'].map(persoonLink).join('') + '</div>' +
        '</section>' +

        /* 3. Onze favorieten: zes handgekozen cadeaus. */
        favorietenBlok() +

        /* 4. Het seizoen: één grote kaart, twee kleine, op datum. */
        seizoenBlok() +

        /* 5. Laatst bekeken (alleen als er iets is). */
        laatstBekeken() +

        /* 6. Budget. */
        '<section class="sectie" data-tel="budget"><div class="sectie-kop"><div><h2>Welk bedrag wil je uitgeven?</h2></div></div>' +
          '<div class="budget-rij">' + PRIJZEN.filter(function (p) { return p.id !== 'alle'; }).map(function (p) {
            return '<a class="budget-knop" href="/c/cadeaus?prijs=' + p.id + '">' + p.label + '</a>';
          }).join('') + '</div></section>' +

        /* 7. Categorieën: mobiel 6 rondjes + 5 tekstlinks, desktop alle 11. */
        '<section class="sectie" data-tel="categorieen">' +
          '<div class="sectie-kop"><div><h2>Ontdek onze categorieën</h2></div><a class="meer" href="/categorieen">Alle categorieën ' + ic('pijl') + '</a></div>' +
          '<div class="catbalken">' + CATS_VOOR.map(function (s) { return cat(s, false); }).join('') + CATS_REST.map(function (s) { return cat(s, true); }).join('') + '</div>' +
          '<div class="cat-links alleen-mobiel">' + CATS_REST.map(function (s) { var c = window.LK_CAT(s); return c ? '<a class="chip" href="/c/' + c.slug + '">' + esc(c.naam) + '</a>' : ''; }).join('') + '<a class="chip" href="/categorieen">Alle categorieën</a></div>' +
        '</section>' +

        /* 8. Persoonlijk + gelegenheden als tekstknopjes. */
        persoonlijkBlok() +

        /* 9. Acties van onze winkels. */
        actiesBlok() +

        /* 10. Cadeaugidsen compact + eigen kleurboeken als één kaart. */
        gidsenCompact() +
        eigenKaart() +

        /* 11. Zo werkt het. */
        '<section class="sectie" data-tel="zo-werkt-het">' +
          '<div class="stappen klein">' +
            '<div class="stap"><span class="nr">1</span><div><h3>Wij zoeken uit</h3><p>Alleen wat we echt goed vinden, komt op de site.</p></div></div>' +
            '<div class="stap"><span class="nr">2</span><div><h3>Jij kiest</h3><p>Op persoon, categorie of met VONK.</p></div></div>' +
            '<div class="stap"><span class="nr">3</span><div><h3>Je koopt bij de winkel</h3><p>Je bestelt en betaalt zoals je gewend bent. Via onze links krijgen wij soms een kleine vergoeding; jij betaalt niets extra.</p></div></div>' +
          '</div>' +
        '</section>' +
      '</div>';
  }
  /* Seizoensblok: de periode van vandaag bepaalt welke kaarten er staan; de eerste is groot. */
  function seizoenBlok() {
    var s = INST.seizoen; if (!s) return '';
    var d = new Date(), nu = ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
    var per = (s.periodes || []).filter(function (p) { return p.vanaf <= p.tot ? (nu >= p.vanaf && nu <= p.tot) : (nu >= p.vanaf || nu <= p.tot); })[0];
    if (!per) return '';
    var kaarten = per.kaarten.map(function (k) { return s.kaarten[k]; }).filter(Boolean);
    if (!kaarten.length) return '';
    var kaart = function (a, groot) {
      return '<a class="actie seizoen-kaart ' + (groot ? 'groot' : 'klein') + '" href="' + esc(a.naar) + '">' +
        (a.beeldMobiel ? '<picture><source media="(max-width: 759px)" srcset="' + esc(a.beeldMobiel) + '">' : '') +
        '<img src="' + esc(a.beeld) + '" alt="" loading="lazy" decoding="async">' + (a.beeldMobiel ? '</picture>' : '') +
        '<div class="actie-tekst"><span class="kicker">' + esc(a.kicker) + '</span><h3>' + esc(a.titel) + '</h3>' + (groot ? '<p>' + esc(a.tekst) + '</p>' : '') +
        '<span class="knop knop-goud">' + esc(a.knop) + ' ' + ic('pijl') + '</span></div></a>';
    };
    return '<section class="sectie seizoen" data-tel="seizoen"><div class="seizoen-raster' + (kaarten.length === 1 ? ' een' : kaarten.length === 2 ? ' twee' : '') + '">' +
      kaarten.map(function (a, i) { return kaart(a, i === 0); }).join('') + '</div></section>';
  }
  /* Persoonlijk maakt bijzonder: 4 producten uit de collectie Persoonlijke cadeaus (vaste ids, anders de mooiste met sfeerfoto). */
  function persoonlijkBlok() {
    var f = INST.persoonlijk; if (!f) return '';
    var z = LK.zichtbaar(), l = (f.ids || []).map(function (id) { return z.filter(function (p) { return p.id === id; })[0]; }).filter(Boolean);
    if (l.length < 4) {
      var g = window.LK_COLLECTIE && window.LK_COLLECTIE('persoonlijke-cadeaus');
      var kand = g ? sorteer(verzamelLijst(g)).filter(function (p) { return l.indexOf(p) === -1; }) : [];
      kand = kand.filter(function (p) { return p.sfeer || p.favoriet; }).concat(kand.filter(function (p) { return !(p.sfeer || p.favoriet); }));
      l = l.concat(afwisselen(kand, 8).slice(0, 4 - l.length));
    }
    var knopjes = (INST.gelegenheidKnopjes || []).map(function (k) { return '<a class="chip" href="' + esc(k[1]) + '">' + esc(k[0]) + '</a>'; }).join('');
    return '<section class="sectie persoonlijk" data-tel="persoonlijk">' +
      '<div class="sectie-kop"><div><span class="kicker">' + esc(f.kicker) + '</span><h2>' + esc(f.titel) + '</h2><p>' + esc(f.tekst) + '</p></div><a class="meer" href="' + esc(f.naar) + '">' + esc(f.knop) + ' ' + ic('pijl') + '</a></div>' +
      (l.length ? '<div class="prodgrid vier">' + l.slice(0, 4).map(LK.productKaart).join('') + '</div>' : '') +
      '<div class="gelegenheid-knopjes"><span>Of kies een gelegenheid:</span>' + knopjes + '</div>' +
      '</section>';
  }
  /* Acties van onze winkels: de 3 acties die het eerst aflopen, zonder de algemene 'word lid'-kortingen. Verlopen acties staan er nooit (codesNu). */
  function actiesBlok() {
    var alg = /nieuwsbrief|als lid|nieuwe leden|nieuwe klanten|eerste bestelling|elke donderdag|outlet|gratis verzending vanaf/i;
    var l = codesNu().filter(function (c) { return c.tot && !alg.test(c.titel + ' ' + c.tekst); })
      .sort(function (a, b) { return a.tot.localeCompare(b.tot); }).slice(0, 3);
    if (!l.length) return '';
    return '<section class="sectie acties-blok" data-tel="acties">' +
      '<div class="sectie-kop"><div><h2>Acties van onze winkels</h2><p>Echte acties, met een einddatum. Verlopen is weg.</p></div><a class="meer" href="/collectie/kortingscodes">Alle kortingscodes ' + ic('pijl') + '</a></div>' +
      '<div class="acties-rij">' + l.map(function (c) {
        return '<a class="actie-kaart" href="/collectie/kortingscodes">' +
          '<span class="actie-badge">' + esc(c.badge || 'Actie') + '</span>' +
          '<span class="actie-winkel">' + esc(c.winkel) + '</span>' +
          '<strong>' + esc(c.titel) + '</strong>' +
          '<small>Geldig t/m ' + esc(datumNl(c.tot)) + '</small></a>';
      }).join('') + '</div></section>';
  }
  /* Cadeaugidsen: drie compacte kaartjes. */
  function gidsenCompact() {
    if (!GIDSEN.length) return '';
    return '<section class="sectie" data-tel="gidsen">' +
      '<div class="sectie-kop"><div><h2>Cadeaugidsen</h2></div><a class="meer" href="/gids">Alle gidsen ' + ic('pijl') + '</a></div>' +
      '<div class="gidslijst compact">' + GIDSEN.slice(0, 3).map(gidsKaart).join('') + '</div></section>';
  }
  /* Eigen kleurboeken van Marius: één kaart, laag op de pagina. */
  function eigenKaart() {
    var e = INST.eigen; if (!e || !(e.ids || []).length) return '';
    var p = LK.vind(e.ids[0]); if (!p) return '';
    return '<section class="sectie eigen-kaart" data-tel="eigen">' +
      '<a class="eigen-link" href="/zoek?q=dino%20kleurboek">' +
        '<span class="eigen-beeld">' + LK.productBeeld(p) + '</span>' +
        '<span class="eigen-tekst"><span class="kicker">' + esc(e.kicker) + '</span><strong>' + esc(e.titel) + '</strong><small>' + esc(e.tekst) + '</small><span class="meer">Bekijk de ' + e.ids.length + ' kleurboeken ' + ic('pijl') + '</span></span>' +
      '</a></section>';
  }
  /* Reclameblokken (seizoen/acties) uit LK_INSTELLINGEN.acties; verlopen blokken vallen vanzelf weg. */
  function actieBlokken() {
    var vandaag = new Date().toISOString().slice(0, 10);
    var l = (INST.acties || []).filter(function (a) { return (!a.tot || vandaag <= a.tot) && (!a.vanaf || vandaag >= a.vanaf); }); /* 'vanaf' = eerste dag (5-11-2026) */
    if (!l.length) return '';
    return '<section class="acties">' + l.map(function (a) {
      return '<a class="actie' + (a.klasse ? ' ' + esc(a.klasse) : '') + '" href="' + esc(a.naar) + '">' +
        (a.beeldMobiel ? '<picture><source media="(max-width: 899px)" srcset="' + esc(a.beeldMobiel) + '">' : '') +
        '<img src="' + esc(a.beeld) + '" alt="" loading="lazy" decoding="async">' + (a.beeldMobiel ? '</picture>' : '') +
        '<div class="actie-tekst"><span class="kicker">' + esc(a.kicker) + '</span><h3>' + esc(a.titel) + '</h3><p>' + esc(a.tekst) + '</p>' +
        '<span class="knop knop-goud">' + esc(a.knop) + ' ' + ic('pijl') + '</span></div></a>';
    }).join('') + '</section>';
  }
  /* Stap 1 homepage (6-11-2026, GO Marius): zes handgekozen cadeaus, 2 naast elkaar, vlak onder 'Voor wie'.
     Onderzoek: 81% van de kijktijd zit in de eerste 3 schermen; producten stonden op scherm 6. Lijst staat in LK_INSTELLINGEN.favorieten. */
  function favorietenBlok() {
    var f = INST.favorieten; if (!f || !(f.ids || []).length) return '';
    var z = LK.zichtbaar();
    var l = f.ids.map(function (id) { return z.filter(function (p) { return p.id === id; })[0]; }).filter(Boolean);
    if (!l.length) return '';
    return '<section class="sectie favorieten" id="favorieten" data-tel="favorieten">' +
      '<div class="sectie-kop"><div>' + (f.kicker ? '<span class="kicker">' + esc(f.kicker) + '</span>' : '') + '<h2>' + esc(f.titel) + '</h2>' + (f.tekst ? '<p>' + esc(f.tekst) + '</p>' : '') + '</div>' +
      (f.naar ? '<a class="meer" href="' + esc(f.naar) + '">' + esc(f.knop || 'Meer') + ' ' + ic('pijl') + '</a>' : '') + '</div>' +
      '<div class="prodgrid">' + l.map(LK.productKaart).join('') + '</div>' +
      '</section>';
  }
  function eigenBlok() {
    var e = INST.eigen; if (!e || !(e.ids || []).length) return '';
    var z = LK.zichtbaar();
    var l = e.ids.map(function (id) { return z.filter(function (p) { return p.id === id; })[0]; }).filter(Boolean);
    if (!l.length) return '';
    return '<section class="sectie etalage eigen">' +
      '<div class="sectie-kop"><div><span class="kicker">' + esc(e.kicker) + '</span><h2>' + esc(e.titel) + '</h2><p>' + esc(e.tekst) + '</p></div></div>' +
      rij(l) + '</section>';
  }
  function etalage() {
    var e = INST.etalage; if (!e || !(e.ids || []).length) return '';
    var z = LK.zichtbaar();
    var l = e.ids.map(function (id) { return z.filter(function (p) { return p.id === id; })[0]; }).filter(Boolean);
    if (!l.length) return '';
    return '<section class="sectie etalage">' +
      '<div class="sectie-kop"><div><h2>' + esc(e.titel) + '</h2></div><a class="meer" href="' + esc(e.naar) + '">' + esc(e.knop) + ' ' + ic('pijl') + '</a></div>' +
      rij(l) + '</section>';
  }
  function catKaart(c) {
    return '<a class="catkaart" href="/c/' + c.slug + '">' +
      '<div class="beeld">' + catBeeld(c, true) + '</div>' +
      '<div class="tekst"><h3>' + esc(c.naam) + '</h3>' + ((c.tekst || '').length > 80 ? '<p class="lees-kort">' + esc(c.tekst) + '</p><span class="lees-verder" role="button" tabindex="0" data-lees>Lees verder</span>' : '<p>' + esc(c.tekst) + '</p>') + '<span class="rond-pijl">' + ic('rechts') + '</span></div></a>';
  }
  /* Ook praktische noodspullen (noodrantsoen, jerrycans, EHBO...) niet tussen de gewone cadeaus en in VONK; zaklampen, noodradio's en spullen voor buiten wel. */
  var NOOD_CADEAU = ['noodradio', 'licht-stroom', 'buiten-veld'];
  function nietChristelijk(p) { return p.cat !== 'christelijk' && !(p.cat === 'noodpakket-survival' && NOOD_CADEAU.indexOf(p.sub) === -1); }
  /* Sfeerfoto's eerst (wens van Marius, 27-10-2026: presentatie is alles). Volgorde blijft verder gelijk. */
  /* 02-11-2026 (Marius: pagina's moeten kwaliteit en afwisseling tonen): bovenaan niet steeds dezelfde winkel of hetzelfde soort product.
     Herschikt alleen de eerste 'n' producten: niet dezelfde winkel 2 keer kort na elkaar en niet 2 keer hetzelfde vakje achter elkaar (als het kan). */
  function afwisselen(l, n) {
    n = Math.min(n || 60, l.length); var rest = l.slice(), uit = [];
    while (uit.length < n && rest.length) {
      var a = uit[uit.length - 1], b = uit[uit.length - 2], kies = -1;
      for (var i = 0; i < Math.min(rest.length, 40); i++) {
        var p = rest[i], w = (p.shop || '').toLowerCase();
        var zelfdeWinkel = (a && (a.shop || '').toLowerCase() === w) || (b && (b.shop || '').toLowerCase() === w);
        var zelfdeVak = a && a.cat + '/' + a.sub === p.cat + '/' + p.sub;
        if (!zelfdeWinkel && !zelfdeVak) { kies = i; break; }
        if (kies === -1 && !zelfdeWinkel) kies = i;
      }
      if (kies === -1) kies = 0;
      uit.push(rest.splice(kies, 1)[0]);
    }
    return uit.concat(rest);
  }
  function sfeerEerst(l) { return l.filter(function (p) { return p.sfeer; }).concat(l.filter(function (p) { return !p.sfeer; })); }
  function uitgelicht(tab) {
    var l = LK.zichtbaar().filter(nietChristelijk);
    if (tab === 'favoriet') l = l.filter(function (p) { return p.favoriet || p.populair; });
    if (tab === 'onder25') l = l.filter(function (p) { return p.prijs <= 25 && p.cat !== 'dranken'; });
    if (tab === 'nieuw') l = l.filter(LK.isNieuw);
    l = sorteer(l);
    if (tab === 'nieuw' || tab === 'onder25') {
      /* afwisselen: niet tien dingen uit dezelfde categorie achter elkaar */
      var per = {}, mix = [];
      l.forEach(function (p) { (per[p.cat] = per[p.cat] || []).push(p); });
      var lijsten = Object.keys(per).map(function (k) { return per[k]; });
      for (var i = 0; mix.length < 12 && lijsten.some(function (x) { return x.length > i; }); i++) lijsten.forEach(function (x) { if (x[i] && mix.length < 12) mix.push(x[i]); });
      l = daisyconLaag(mix);
    }
    return l.length ? rij(l.slice(0, 12)) : grid([], leegBlok('Nog niets in deze lijst', 'Hier komen binnenkort mooie producten.'));
  }

  /* ---------- Alle categorieën ---------- */
  function alleCategorieen() {
    zetTitel('Alle categorieën');
    /* 5-11-2026 (wens Marius): ronde icoontjes zoals op de homepage, met een korte, duidelijke tekst eronder. */
    var T = {
      'speelgoed': 'LEGO, spellen, knuffels en buitenspeelgoed voor elke leeftijd.',
      'elektronica': 'Koptelefoons, gaming, smartwatches en slimme gadgets.',
      'mode-sieraden': 'Sieraden, horloges, tassen en warme winterkleding.',
      'beauty-verzorging': 'Parfum, giftsets en verwenproducten voor hem en haar.',
      'wonen': 'Kaarsen, sfeerlicht, plaids en mooie spullen voor de keuken.',
      'eten-drinken': 'Chocolade, wijn, bubbels en lekkere cadeaupakketten.',
      'hobby': 'Schilderen, haken, modelbouw en zelf iets moois maken.',
      'sport-outdoor': 'Darts, fitness, kamperen en erop uit in de natuur.',
      'tuin-klussen': 'Voor de groene vingers en de handige klusser.',
      'boeken-media': 'Mooie boeken, kinderboeken, films en muziek.',
      'dieren': 'Snoepjes, speeltjes en mandjes voor hond, kat en meer.',
      'christelijk': 'Bijbels, sieraden met kruis en geschenken met betekenis.'
    };
    return paginakop({ titel: 'Alle categorieën', tekst: 'Kies waar je zin in hebt.', kruimel: [{ tekst: 'Categorieën' }] }) +
      '<div class="binnen"><section class="sectie"><div class="catronden">' + CATS.map(function (c) {
        return '<a class="catrond" href="/c/' + c.slug + '"><span class="catrond-beeld"><img src="images/categorieen/rond/cat-' + c.slug + '.webp" alt="" loading="lazy" decoding="async" width="88" height="88" onerror="this.onerror=null;this.src=\'' + esc(c.tegel) + '\'"></span>' +
          '<span class="catrond-naam">' + esc(c.naam) + '</span><span class="catrond-tekst">' + esc(T[c.slug] || c.tekst || '') + '</span></a>';
      }).join('') + '</div></section>' +
      /* Stap 3 indeling: onder de 12 afdelingen de 7 personen als knopjes (plan deel 8). */
      '<section class="sectie"><div class="sectie-kop"><div><h2>Of kies voor wie</h2></div><a class="meer" href="/voor">Alle personen ' + ic('pijl') + '</a></div>' +
      '<nav class="gelegenheid-knopjes voor-knopjes" aria-label="Voor wie">' + (window.LK_PERSONEN || []).filter(function (p) { return !p.verborgen; }).map(function (p) {
        return '<a class="chip" href="/voor/' + esc(p.slug) + '">' + esc(p.naam) + '</a>';
      }).join('') + '</nav></section></div>';
  }

  /* Kleine versie van een rond plaatje (220px) voor de rondjes: scheelt zo'n 90% aan data per rondje. */
  function kleinBeeld(src) { return src && src.indexOf('images/sub/') === 0 && /\.webp$/.test(src) && src.indexOf('-klein.webp') === -1 ? src.replace(/\.webp$/, '-klein.webp') : src; }
  function paginakop(o) {
    var achter = '';
    /* Op een telefoon een kleinere, al bijgesneden versie van de banner (-mobiel.webp): scheelt zo'n 70% aan data. */
    if (o.banner) achter = '<div class="achter"><picture><source media="(max-width: 759px)" srcset="' + esc(o.banner.replace('.webp', '-mobiel.webp')) + '"><img src="' + esc(o.banner) + '" alt="" fetchpriority="high"></picture></div>';
    else if (o.vaag) achter = '<div class="achter vaag"><img src="' + esc(o.vaag) + '" alt=""></div>';
    return '<section class="paginakop' + (achter ? '' : ' zonder') + (o.donker ? ' donker' : '') + (o.klasse ? ' ' + o.klasse : '') + '">' + achter +
      '<div class="binnen">' + kruimel(o.kruimel || []) + '<h1>' + esc(o.titel) + '</h1>' + (o.tekst ? '<p>' + esc(o.tekst) + '</p>' : '') + '</div></section>';
  }

  /* ---------- Categorie & subcategorie ---------- */
  function categorie(slug, subSlug, vakSlug, q) {
    var c = window.LK_CAT(slug);
    if (!c) return nietGevonden();
    var s = subSlug ? window.LK_SUB(c, subSlug) : null;
    if (subSlug && !s) return nietGevonden();
    /* 3.0: derde laag (vakje binnen een groep). */
    var v = vakSlug ? window.LK_VAK(s, vakSlug) : null;
    if (vakSlug && !v) return nietGevonden();
    /* Teksten uit teksten.js (intro, Google-titel, omschrijving, tips). Staat er in data.js al iets, dan wint dat. */
    var T = (window.LK_TEKSTEN || {})[v ? (v.oud || '') : c.slug + (s ? '/' + s.slug : '')] || {};
    var laag = v || s;
    zetTitel(v ? (v.seoTitel || T.seoTitel || v.naam + ' – ' + s.naam) : s ? (s.seoTitel || T.seoTitel || s.naam + ' – ' + c.naam) : (c.seoTitel || T.seoTitel || c.naam));
    window.LK_SEO = (laag ? laag.seoTekst : c.seoTekst) || T.seoTekst || '';
    var gids = (laag ? laag.gids : c.gids) || T.gids;

    var pad = '/c/' + c.slug + (s ? '/' + s.slug : '') + (v ? '/' + v.slug : '');
    var knoppen = (v && v.knoppen) || (s && s.knoppen) || c.knoppen || [];
    var basis = LK.zichtbaar().filter(function (p) { return LK.hoortBij(p, c.slug, s && s.slug, v && v.slug); });
    BASIS = basis;
    TEL = function (nq) { return basis.filter(function (p) { return binnenPrijs(p, nq.prijs) && voorFilter(p, nq.voor) && knopFilter(p, nq, knoppen) && extraFilter(p, nq); }).length; };
    var lijst = basis.filter(function (p) { return binnenPrijs(p, q.prijs) && voorFilter(p, q.voor) && knopFilter(p, q, knoppen) && extraFilter(p, q); });
    lijst = sorteer(lijst, q.sort, pad);
    /* 3.0: 'Aanbevolen' regelt mix() zelf (beste eerst, gemixt) */

    /* Gekozen budget blijft staan als je naar een andere subcategorie klikt. */
    /* Naar een andere groep: alleen budget en leeftijd/dames-heren gaan mee. 'Voor wie', merk en winkel niet
       (eerst ging bv. 'Baby' mee naar Tablets en zag je 0 producten). */
    var metBudget = function (adres) { var nq = {}; if (q.prijs && q.prijs !== 'alle') nq.prijs = q.prijs; ['wie', 'kind', 'leeftijd'].forEach(function (k) { if (q[k]) nq[k] = q[k]; }); return Object.keys(nq).length ? maakAdres(adres, nq) : adres; };
    /* Stap 3 indeling (6-11-2026, plan deel 8): één laag keuzes per pagina, nooit twee rijen boven elkaar.
       Afdeling: de groepen als rondjes (geen 'Alles': de pagina is al alles). Groep: de vakjes als rondjes.
       Vakje: de buurvakjes als knopjes in één rij die omloopt. De andere groepen staan onderaan als tekstlinks. */
    var subs = '', groepen = volleSubs(c), volleVakjes = [];
    if (s && s.vakjes) {
      var inGroep = LK.zichtbaar().filter(function (p) { return LK.hoortBij(p, c.slug, s.slug); });
      volleVakjes = s.vakjes.filter(function (x) { return inGroep.filter(function (p) { return p.vak === x.slug; }).length >= 3; }); /* vakjes met minder dan 3 producten: alleen onder de groep zelf */
    }
    if (!s) {
      subs = keuzeRaster(groepen.map(function (x) {
        var src = rondBeeld(x.beeld, x.beeld ? null : LK.zichtbaar().filter(function (p) { return LK.hoortBij(p, c.slug, x.slug); }));
        return { naam: x.naam, naar: metBudget(subAdres(c, x)), beeld: src, icoon: src ? '' : ic(c.icoon) };
      }), 'Groepen in ' + c.naam);
    } else if (!v && volleVakjes.length > 1) {
      subs = keuzeRaster(volleVakjes.map(function (x) {
        var src = rondBeeld(x.beeld, x.beeld ? null : sfeerEerst(inGroep.filter(function (p) { return p.vak === x.slug; })));
        return { naam: x.naam, naar: metBudget('/c/' + c.slug + '/' + s.slug + '/' + x.slug), beeld: src, icoon: src ? '' : ic(c.icoon) };
      }), 'Soorten in ' + s.naam);
    } else if (v && volleVakjes.length > 1) {
      subs = '<nav class="chips vakjesrij omlopend" aria-label="Soorten in ' + esc(s.naam) + '">' + volleVakjes.map(function (x) {
        var hier = v.slug === x.slug;
        return '<a class="chip' + (hier ? ' actief' : '') + '" href="' + metBudget('/c/' + c.slug + '/' + s.slug + '/' + x.slug) + '"' + (hier ? ' aria-current="page"' : '') + '>' + esc(x.naam) + '</a>';
      }).join('') + '</nav>';
    }

    var sorteerOpties = [['aanbevolen', 'Aanbevolen'], ['prijs-op', 'Prijs laag – hoog'], ['prijs-af', 'Prijs hoog – laag'], ['nieuw', 'Nieuwste eerst']];
    var werkbalk = '<div class="werkbalk">' + mobielBalk(pad, q, knoppen, sorteerOpties) + filterLabels(pad, q, knoppen) + (knoppen.length ? knopChips(pad, q, knoppen) : (c.slug !== 'christelijk' && c.slug !== 'noodpakket-survival') ? voorChips(pad, q) : '') + merkWinkelChips(pad, q) + prijsChips(pad, q) +
      '<div class="werkbalk-onder"><span class="aantal">' + getal(lijst.length) + (lijst.length === 1 ? ' product' : ' producten') + '</span>' +
      verrasKnop(lijst) + '<label class="sorteer"><span class="verborgen">Sorteren</span><select data-sorteer="' + esc(maakAdres(pad, Object.assign({}, q, { sort: '' }))) + '">' +
        sorteerOpties.map(function (o) { return '<option value="' + o[0] + '"' + ((q.sort || 'aanbevolen') === o[0] ? ' selected' : '') + '>' + o[1] + '</option>'; }).join('') +
      '</select>' + ic('omlaag') + '</label></div></div>';

    var gekozen = (q.prijs && q.prijs !== 'alle') || q.voor || aantalKnoppen(q, knoppen);
    var leeg = leegBlok(gekozen ? 'Niets met deze keuze' : 'Hier komen binnenkort mooie producten',
      gekozen ? 'Met deze filters vinden we hier niets. Haal een filter weg of bekijk alles.' : 'We zijn deze categorie nog aan het vullen. Kijk alvast verder:',
      gekozen ? '<a class="knop knop-goud" href="' + maakAdres(pad, {}) + '">Toon alles hier</a> <a class="knop knop-rand" href="/c/cadeaus">Alle cadeaus</a>'
              : '<a class="knop knop-rand" href="/c/cadeaus">Alle cadeaus</a> <a class="knop knop-goud" href="/vonk">Probeer VONK</a>');

    var anderen = CATS.filter(function (x) { return x.slug !== c.slug; });
    var ouder = c.onder ? window.LK_CAT(c.onder) : null;

    return paginakop({
      titel: v ? (v.kop || v.naam) : s ? (s.kop || s.naam) : (c.kop || c.naam),
      tekst: v ? (v.tekst || T.tekst || 'Met de hand gekozen: ' + v.naam.toLowerCase() + '.') : s ? (s.tekst || T.tekst || (s.vakjes ? 'Met de hand gekozen: ' + (function (n, meer) { return meer ? n.join(', ') + ' en meer' : n.length > 1 ? n.slice(0, -1).join(', ') + ' en ' + n[n.length - 1] : n[0]; })(s.vakjes.slice(0, 4).map(function (x, i) { return i ? x.naam.replace(/^[A-Z](?![A-Z])/, function (l) { return l.toLowerCase(); }) : x.naam; }), s.vakjes.length > 4) + '.' : 'Met de hand gekozen ' + s.naam.toLowerCase() + ' uit ' + c.naam.toLowerCase() + '.')) : (c.tekst || T.tekst),
      banner: c.banner, vaag: !c.banner ? c.tegel : '',
      kruimel: (ouder ? [{ tekst: ouder.naam, naar: '/c/' + ouder.slug }] : []).concat(v ? [{ tekst: c.naam, naar: '/c/' + c.slug }, { tekst: s.naam, naar: '/c/' + c.slug + '/' + s.slug }, { tekst: v.naam }] : s ? [{ tekst: c.naam, naar: '/c/' + c.slug }, { tekst: s.naam }] : [{ tekst: c.naam }])
    }) +
    '<div class="binnen">' +
      (subs ? '<section class="sectie keuzes-sectie" aria-label="Keuzes">' + subs + '</section>' : '') +
      werkbalk + gridMeer(lijst, leeg) + filterPaneel(pad, q, sorteerOpties, knoppen, lijst.length) +
      /* Stap 3 indeling: 'Lees ook' (de gidsen) komt ná de eerste 24 producten; producten eerst. */
      leesOok(v && v.oud ? v.oud : c.slug + (s ? '/' + s.slug : '')) +
      /* Eerst 'Meer in onze winkels' direct onder onze eigen producten, en pas daarna de tips.
         Stonden de tips ertussen, dan leek het alsof de pagina daar ophield (opmerking Marius, 28-10-2026). */
      (v && v.oud ? winkelSectie(v.oud.split('/')[0], v.oud.split('/')[1], q.prijs) : s && s.vakjes ? '' : winkelSectie(c.slug, s && s.slug, q.prijs)) +
      (gids ? '<section class="sectie gids" aria-label="Tips">' + gids.map(function (g) { return '<h2>' + esc(g.kop) + '</h2><p>' + esc(g.tekst) + '</p>'; }).join('') + '</section>' : '') +
      /* Stap 3 indeling: de winkels van deze afdeling als tekstlinks (eerst 24 grote kaarten: ruim 6.000 px op een telefoon). */
      (s || !winkelsMet(c.slug).length ? '' : '<section class="sectie verder"><h2>Winkels voor ' + esc(c.naam.toLowerCase()) + '</h2><nav class="tekstlinks" aria-label="Winkels">' + winkelsMet(c.slug).map(function (w) {
        var wurl = dcDirect(w.url) ? WINKELSITE[w.naam] : w.url;
        return '<a href="' + esc(wurl) + '" target="_blank" rel="sponsored noopener">' + esc(w.naam) + '</a>';
      }).join('') + '<a href="/winkels">Alle winkels</a></nav></section>') +
      /* Verder kijken, onderaan als tekstlinks: in een groep of vakje eerst de andere groepen van de afdeling, dan de andere afdelingen. */
      (s ? tekstLinks('Andere groepen in ' + c.naam, groepen.filter(function (x) { return x.slug !== s.slug; }).map(function (x) { return [x.naam, metBudget(subAdres(c, x))]; })) : '') +
      tekstLinks('Andere categorieën', anderen.map(function (x) { return [x.kort, '/c/' + x.slug]; })) +
    '</div>';
  }

  /* ---------- 2.0 PROEF: persoon (Voor hem, Voor haar …) met eigen subcategorieën ---------- */
  function persoonProducten(pe, vakken) {
    return LK.zichtbaar().filter(function (p) {
      if (p.cat === 'christelijk') return false;
      var vanPersoon = (p.voor || []).some(function (v) { return pe.labels.indexOf(v) !== -1; }) ||
        (pe.oud && (p.cat + '/' + p.sub === pe.oud || (p.ookIn || []).indexOf(pe.oud) !== -1));
      if (!vanPersoon) return false;
      if (!vakken) return true;
      var plekken = plekkenVan(p);
      return plekken.some(function (x) { return vakken.some(function (v) { return x === v || x.indexOf(v + '/') === 0; }); });
    });
  }
  function persoon(slug, subSlug, q) {
    var pe = window.LK_PERSOON(slug);
    if (!pe || !pe.subs) return nietGevonden();
    var s = subSlug ? pe.subs.filter(function (x) { return x.slug === subSlug; })[0] : null;
    if (subSlug && !s) return nietGevonden();
    zetTitel(s ? (s.seoTitel || s.naam + ' voor ' + pe.naam.replace(/^Voor /, '')) : pe.seoTitel || pe.naam);
    /* Teksten en tips van de oude pagina (/c/cadeaus/voor-hem …) gaan mee naar de nieuwe. */
    var oudSub = null;
    if (pe.oud) { var od = pe.oud.split('/'), oc = window.LK_CAT(od[0]); oudSub = oc ? window.LK_SUB(oc, od[1]) : null; }
    var T = (window.LK_TEKSTEN || {})[pe.oud || ''] || {};
    window.LK_SEO = (s ? '' : (oudSub && oudSub.seoTekst) || T.seoTekst) || '';
    var tips = s ? null : ((oudSub && oudSub.gids) || T.gids);
    var pad = '/voor/' + pe.slug + (s ? '/' + s.slug : '');
    var naam = pe.naam.replace(/^Voor /, '');
    var knoppen = pe.knoppen || [];
    var alles = persoonProducten(pe, s ? s.vakken : null);
    BASIS = alles;
    TEL = function (nq) { return alles.filter(function (p) { return binnenPrijs(p, nq.prijs) && knopFilter(p, nq, knoppen) && extraFilter(p, nq); }).length; };
    var lijst = sorteer(alles.filter(function (p) { return binnenPrijs(p, q.prijs) && knopFilter(p, q, knoppen) && extraFilter(p, q); }), q.sort, pad);
    /* 3.0: 'Aanbevolen' regelt mix() zelf (beste eerst, gemixt) */
    var metBudget = function (adres) { var nq = {}; if (q.prijs && q.prijs !== 'alle') nq.prijs = q.prijs; ['kind', 'leeftijd'].forEach(function (k) { if (q[k]) nq[k] = q[k]; }); return Object.keys(nq).length ? maakAdres(adres, nq) : adres; };

    /* Stap 4 indeling (6-11-2026, plan deel 8): op de hoofdpagina de onderdelen als rondjes in een vast raster, de eerste 8 in beeld
       (de volgorde is al: waar het meest naar gezocht wordt), de rest achter 'Meer'. Op een onderdeel: de andere onderdelen als knopjes
       in één rij die omloopt. Geen schuifrijen en geen 'Alles' meer (het kruimelpad brengt je terug). */
    var volleSubsP = pe.subs.filter(function (x) { return nogGeldig(x) && persoonProducten(pe, x.vakken).length; });
    var subsHtml = s
      ? '<nav class="chips vakjesrij omlopend" aria-label="Onderdelen voor ' + esc(naam) + '">' + volleSubsP.map(function (x) {
          var hier = s.slug === x.slug;
          return '<a class="chip' + (hier ? ' actief' : '') + '" href="' + metBudget('/voor/' + pe.slug + '/' + x.slug) + '"' + (hier ? ' aria-current="page"' : '') + '>' + esc(x.naam) + '</a>';
        }).join('') + '</nav>'
      : keuzeRaster(volleSubsP.map(function (x) {
          return { naam: x.naam, naar: metBudget('/voor/' + pe.slug + '/' + x.slug), beeld: rondBeeld(x.beeld, persoonProducten(pe, x.vakken)) };
        }), 'Onderdelen voor ' + naam, { altijd: true });

    var sorteerOpties = [['aanbevolen', 'Aanbevolen'], ['prijs-op', 'Prijs laag – hoog'], ['prijs-af', 'Prijs hoog – laag'], ['nieuw', 'Nieuwste eerst']];
    var werkbalk = '<div class="werkbalk">' + mobielBalk(pad, q, knoppen, sorteerOpties) + filterLabels(pad, q, knoppen) + knopChips(pad, q, knoppen) + merkWinkelChips(pad, q) + prijsChips(pad, q) +
      '<div class="werkbalk-onder"><span class="aantal">' + getal(lijst.length) + (lijst.length === 1 ? ' product' : ' producten') + '</span>' +
      verrasKnop(lijst) + '<label class="sorteer"><span class="verborgen">Sorteren</span><select data-sorteer="' + esc(maakAdres(pad, Object.assign({}, q, { sort: '' }))) + '">' +
        sorteerOpties.map(function (o) { return '<option value="' + o[0] + '"' + ((q.sort || 'aanbevolen') === o[0] ? ' selected' : '') + '>' + o[1] + '</option>'; }).join('') +
      '</select>' + ic('omlaag') + '</label></div></div>';
    var leeg = alles.length
      ? leegBlok('Niets in dit budget', 'Kies een ander budget of bekijk alles.', '<a class="knop knop-rand" href="' + pad + '">Alles bekijken</a>')
      : leegBlok('Deze afdeling vullen we nu', 'We kiezen de cadeaus voor ' + naam + ' met de hand uit. Kijk alvast verder:', '<a class="knop knop-rand" href="/voor">Voor iemand anders</a> <a class="knop knop-goud" href="/vonk">Probeer VONK</a>');

    /* Selectie: favorieten en populaire producten, sfeerfoto's eerst. Stap 4 indeling: een vast raster van 4, geen schuifrij. */
    /* 7-11-2026: staat er een topkeuze voor deze pagina, dan is 'Onze selectie' gewoon de top daarvan (één systeem). */
    var selectie = (window.LK_TOPKEUZE && window.LK_TOPKEUZE[pad]) ? lijst.slice(0, 4) : sorteer(alles.filter(function (p) { return (p.favoriet || p.populair) && p.sfeer; })).slice(0, 4);
    if (selectie.length < 4) selectie = [];
    /* 02-11-2026: wat al in 'Onze selectie' staat, niet meteen nog eens bovenaan de lijst eronder (dat leek dubbel). En afwisselen in winkel en soort. */
    if (!s && (!q.sort || q.sort === 'aanbevolen')) {
      var inSel = {}; if (!q.prijs || q.prijs === 'alle') selectie.forEach(function (p) { inSel[p.id] = 1; });
      var basis = lijst.filter(function (p) { return !inSel[p.id]; });
      /* Bovenaan om de beurt uit elk vakje van deze persoon (volgorde = waar het meest naar gezocht wordt): een sieraad, een parfum, iets voor in huis... */
      var plek = {}; basis.forEach(function (p, i) { plek[p.id] = i; });
      var perVak = pe.subs.filter(nogGeldig).map(function (x) { return persoonProducten(pe, x.vakken).filter(function (p) { return p.id in plek; }).sort(function (u, v) { return plek[u.id] - plek[v.id]; }); }).filter(function (l) { return l.length; });
      var top = [], gehad = {};
      for (var r = 0; top.length < 60 && r < 12; r++) perVak.forEach(function (l) { var t = 0; while (t < l.length && gehad[l[t].id]) t++; var p = l[t]; if (p && top.length < 60) { gehad[p.id] = 1; top.push(p); l.splice(0, t + 1); } });
      lijst = afwisselen(top, 60).concat(basis.filter(function (p) { return !gehad[p.id]; })).concat(lijst.filter(function (p) { return inSel[p.id]; }));
    }
    var anderen = window.LK_PERSONEN.filter(function (x) { return x.slug !== pe.slug; });

    return paginakop({
      titel: s ? s.naam + ' voor ' + naam : pe.naam,
      tekst: s ? (s.tekst || 'Met de hand gekozen ' + s.naam.toLowerCase() + ' voor ' + naam + '.') : pe.tekst,
      vaag: pe.vaag || pe.beeld,
      kruimel: [{ tekst: 'Voor wie?', naar: '/voor' }].concat(s ? [{ tekst: pe.naam, naar: '/voor/' + pe.slug }, { tekst: s.naam }] : [{ tekst: pe.naam }])
    }) +
    '<div class="binnen">' +
      (!alles.length ? '<section class="sectie eerste">' + leeg + '</section>' :
      (s ? '<section class="sectie keuzes-sectie" aria-label="Keuzes">' + subsHtml + '</section>'
         : '<section class="sectie eerste keuzes-sectie"><div class="sectie-kop"><div><h2>Wat zoek je voor ' + esc(naam) + '?</h2></div></div>' + subsHtml + '</section>') +
      (!s && selectie.length ? '<section class="sectie sfeer-modus"><div class="sectie-kop"><div><h2>Onze selectie voor ' + esc(naam) + '</h2></div></div><div class="prodgrid vier">' + selectie.map(LK.productKaart).join('') + '</div></section>' : '') +
      (s ? '' : '<section class="sectie"><div class="sectie-kop"><div><h2>Alle cadeaus voor ' + esc(naam) + '</h2></div></div></section>') +
      werkbalk + gridMeer(lijst, leeg) + filterPaneel(pad, q, sorteerOpties, knoppen, lijst.length)) +
      /* Stap 3/4 indeling: 'Lees ook' onder de eerste 24 producten. */
      leesOok(pe.oud || '') +
      /* Op een subpagina ook 'Meer in onze winkels' uit het eerste vak (bijv. mode-beauty/horloges). */
      (s && alles.length && s.vakken[0].indexOf('tag:') !== 0 ? (function () { var vd = s.vakken[0].split('/'); return winkelSectie(vd[0], vd[1], q.prijs); })() : '') +
      (tips ? '<section class="sectie gids" aria-label="Tips">' + tips.map(function (g) { return '<h2>' + esc(g.kop) + '</h2><p>' + esc(g.tekst) + '</p>'; }).join('') + '</section>' : '') +
      /* Verder kijken, onderaan als tekstlinks. */
      tekstLinks('Voor iemand anders?', anderen.map(function (x) { return [x.kort, x.subs ? '/voor/' + x.slug : x.naar]; })) +
    '</div>';
  }
  /* 2.0 PROEF: samengestelde pagina (gelegenheid of collectie): labels + vakken + evt. maximale prijs. */
  function verzamelLijst(g) {
    return LK.zichtbaar().filter(function (p) {
      if (p.cat === 'christelijk') return false;
      if (g.labels && !(p.voor || []).some(function (v) { return g.labels.indexOf(v) !== -1; })) return false;
      /* Uitdeelverpakkingen (tag 'uitdelen') kosten per stuk weinig, ook al is de hele doos duurder dan de maximale prijs. */
      if (g.maxPrijs && !(p.tags || []).includes('uitdelen') && !(typeof p.prijs === 'number' && p.prijs <= g.maxPrijs)) return false;
      if (g.uit && g.uit.test(p.titel)) return false;
      /* Black Friday (5-11-2026): alleen echte korting van minstens g.korting procent. */
      if (g.korting && kortingPct(p) < g.korting) return false;
      /* Kortingscodes (5-11-2026): alleen producten van winkels die nu een code of actie hebben. */
      if (g.codes && !codesNu().some(function (c) { return (c.shop || c.winkel) === p.shop; })) return false;
      var plekken = plekkenVan(p);
      return plekken.some(function (x) { return g.vakken.some(function (v) { return x === v || x.indexOf(v + '/') === 0; }); });
    });
  }
  /* Kortingscodes & acties (5-11-2026, GO Marius): echte codes en acties uit de Daisycon-export (LK_CODES in data.js).
     Verlopen acties verdwijnen vanzelf; acties die nog moeten beginnen staan onderaan met 'vanaf'. */
  function codesNu() {
    var vandaag = new Date().toISOString().slice(0, 10);
    return (window.LK_CODES || []).filter(function (c) { return !c.tot || c.tot >= vandaag; });
  }
  function datumNl(d) {
    var m = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'];
    var x = d.split('-'); return (+x[2]) + ' ' + m[+x[1] - 1] + (x[0] !== String(new Date().getFullYear()) ? ' ' + x[0] : '');
  }
  function codeKaart(c) {
    var vandaag = new Date().toISOString().slice(0, 10), straks = c.vanaf && c.vanaf > vandaag;
    var tijd = straks ? 'Vanaf ' + datumNl(c.vanaf) + (c.tot ? ' t/m ' + datumNl(c.tot) : '') : (c.tot && c.tot <= ('' + (+vandaag.slice(0, 4) + 1)) + vandaag.slice(4) ? 'Geldig t/m ' + datumNl(c.tot) : 'Doorlopende actie');
    var knop = c.code && !straks
      ? '<a class="code-knop" href="' + esc(c.link) + '" target="_blank" rel="sponsored nofollow noopener" data-code="' + esc(c.code) + '"><span class="code-vak">' + esc(c.code) + '</span><span class="code-actie">Kopieer en ga naar ' + esc(c.winkel) + '</span></a>'
      : c.code ? '<span class="code-knop wacht"><span class="code-vak">' + esc(c.code) + '</span><span class="code-actie">Werkt ' + esc(tijd.toLowerCase()) + '</span></span>'
      : '<a class="knop knop-goud code-ga" href="' + esc(c.link) + '" target="_blank" rel="sponsored nofollow noopener">Naar de actie bij ' + esc(c.winkel) + '</a>';
    return '<article class="code-kaart' + (c.code ? ' met-code' : '') + (straks ? ' straks' : '') + '">' +
      '<div class="code-kop">' + (c.logo ? '<img src="' + esc(c.logo) + '" alt="' + esc(c.winkel) + '" loading="lazy" decoding="async" width="56" height="56" onerror="this.hidden=true;this.nextSibling.hidden=false">' : '') + '<span class="code-logo" aria-hidden="true"' + (c.logo ? ' hidden' : '') + '>' + esc(c.winkel.charAt(0)) + '</span>' + '<div><strong>' + esc(c.winkel) + '</strong><span class="code-tijd">' + esc(tijd) + '</span></div><span class="code-badge">' + esc(c.badge) + '</span></div>' +
      '<h3>' + esc(c.titel) + '</h3><p>' + esc(c.tekst) + '</p>' + knop +
      (c.voorwaarden ? '<details class="code-voorwaarden"><summary>Voorwaarden</summary><p>' + esc(c.voorwaarden) + '</p></details>' : '') +
    '</article>';
  }
  function codesBlok() {
    var vandaag = new Date().toISOString().slice(0, 10), l = codesNu();
    var nu = l.filter(function (c) { return !c.vanaf || c.vanaf <= vandaag; }), straks = l.filter(function (c) { return c.vanaf && c.vanaf > vandaag; });
    return '<section class="sectie eerste"><div class="sectie-kop"><div><h2>Codes en acties van nu</h2><p>' + (function (n) { return n + (n === 1 ? ' kortingscode' : ' kortingscodes'); })(nu.filter(function (c) { return c.code; }).length) + ' en ' + nu.filter(function (c) { return !c.code; }).length + ' acties. Klik op een code: wij kopiëren hem en openen de winkel.</p></div></div>' +
      '<div class="code-raster">' + nu.map(codeKaart).join('') + '</div></section>' +
      (straks.length ? '<section class="sectie"><div class="sectie-kop"><div><h2>Binnenkort</h2><p>Deze codes werken straks. Zet ze alvast in je agenda.</p></div></div><div class="code-raster">' + straks.map(codeKaart).join('') + '</div></section>' : '');
  }
  /* Eén 'Deals'-rij bovenaan de deal-pagina's, zodat ze bij elkaar horen. */
  function dealsNav(slug) {
    var l = [['aanbiedingen', 'Aanbiedingen'], ['kortingscodes', 'Kortingscodes'], ['black-friday', 'Black Friday']];
    if (new Date().toISOString().slice(0, 10) > '2026-11-30') l = l.filter(function (x) { return x[0] !== 'black-friday'; });
    return '<nav class="deals-nav" aria-label="Deals">' + l.map(function (x) { return '<a class="chip" href="/collectie/' + x[0] + '"' + (x[0] === slug ? ' aria-current="page"' : '') + '>' + x[1] + '</a>'; }).join('') + '</nav>';
  }
  /* Stap 4 indeling (6-11-2026, plan deel 8): op een gelegenheid knopjes 'Voor haar · Voor hem · Kinderen · Tieners · Collega · Opa & oma'.
     Elk knopje is een eigen adres (/gelegenheid/verjaardag/haar): 'verjaardagscadeau voor haar' wordt 3.600 keer per maand gezocht.
     Alleen knopjes met minstens 10 producten. */
  var GELEGENHEID_VOOR = ['haar', 'hem', 'kinderen', 'tieners', 'collega', 'opa-oma'];
  function verzameling(g, pad, kruimelKop, q, voorSlug) {
    var knoppen = g.knoppen || [];
    var basisAlles = verzamelLijst(g);
    var pv = voorSlug ? window.LK_PERSOON(voorSlug) : null;
    if (voorSlug && (!pv || g.labels || !g.vakken)) return nietGevonden();
    var voorNaam = pv ? pv.kort.replace(/^Voor /, '').toLowerCase() : '';
    var alles = pv ? basisAlles.filter(function (p) { return voorFilter(p, pv.slug); }) : basisAlles;
    if (pv && alles.length < 10) return nietGevonden();
    var hoofdPad = pad; if (pv) pad = pad + '/' + pv.slug;
    zetTitel(pv ? (g.seoKort || g.naam) + ' voor ' + voorNaam + (g.seoKort ? '' : ': cadeau-ideeën') : (g.seoTitel || g.naam));
    BASIS = alles;
    TEL = function (nq) { return alles.filter(function (p) { return binnenPrijs(p, nq.prijs) && knopFilter(p, nq, knoppen) && extraFilter(p, nq); }).length; };
    var voorKnopjes = '';
    if (!g.labels && g.vakken && !g.korting && !g.codes) {
      var vk = (g.voorWie || GELEGENHEID_VOOR).map(function (slug) {
        var p2 = window.LK_PERSOON(slug); if (!p2) return '';
        var n = basisAlles.filter(function (p) { return voorFilter(p, slug); }).length; if (n < 10) return '';
        var hier = pv && pv.slug === slug;
        return '<a class="chip' + (hier ? ' actief' : '') + '" href="' + hoofdPad + '/' + slug + '"' + (hier ? ' aria-current="page"' : '') + '>' + esc(p2.kort) + '</a>';
      }).join('');
      if (vk) voorKnopjes = '<nav class="chips vakjesrij omlopend" aria-label="Voor wie">' + (pv ? '<a class="chip" href="' + hoofdPad + '">Iedereen</a>' : '') + vk + '</nav>';
    }
    if ((g.korting || g.codes) && !q.sort) q = Object.assign({}, q, { sort: 'korting' }); /* Black Friday: standaard grootste korting eerst */
    var lijst = sorteer(alles.filter(function (p) { return binnenPrijs(p, q.prijs) && knopFilter(p, q, knoppen) && extraFilter(p, q); }), q.sort, pad);
    /* 3.0: 'Aanbevolen' regelt mix() zelf (beste eerst, gemixt) */
    var sorteerOpties = [['aanbevolen', 'Aanbevolen'], ['prijs-op', 'Prijs laag – hoog'], ['prijs-af', 'Prijs hoog – laag'], ['nieuw', 'Nieuwste eerst']];
    if (g.korting || g.codes) sorteerOpties = [['korting', 'Grootste korting']].concat(sorteerOpties.slice(1));
    var werkbalk = '<div class="werkbalk">' + mobielBalk(pad, q, knoppen, sorteerOpties) + filterLabels(pad, q, knoppen) + knopChips(pad, q, knoppen) + merkWinkelChips(pad, q) + prijsChips(pad, q) +
      '<div class="werkbalk-onder"><span class="aantal">' + getal(lijst.length) + (lijst.length === 1 ? ' product' : ' producten') + '</span>' +
      verrasKnop(lijst) + '<label class="sorteer"><span class="verborgen">Sorteren</span><select data-sorteer="' + esc(maakAdres(pad, Object.assign({}, q, { sort: '' }))) + '">' +
        sorteerOpties.map(function (o) { return '<option value="' + o[0] + '"' + ((q.sort || 'aanbevolen') === o[0] ? ' selected' : '') + '>' + o[1] + '</option>'; }).join('') +
      '</select>' + ic('omlaag') + '</label></div></div>';
    var leeg = !alles.length ? leegBlok('Deze afdeling vullen we nu', 'We zoeken hier nog mooie cadeaus voor. Kijk alvast verder:', '<a class="knop knop-rand" href="/">Naar de voorpagina</a> <a class="knop knop-goud" href="/vonk">Probeer VONK</a>') : leegBlok('Niets in dit budget', 'Kies een ander budget of bekijk alles.', '<a class="knop knop-rand" href="' + pad + '">Alles bekijken</a>');
    var selectie = (window.LK_TOPKEUZE && window.LK_TOPKEUZE[pad]) ? lijst.slice(0, 10) : sorteer(alles.filter(function (p) { return (p.favoriet || p.populair) && p.sfeer; })).slice(0, 10);
    if (selectie.length < 4) selectie = [];
    /* Aanbiedingen (5-11-2026, GO Marius): 'Deals van vandaag' = elke dag 12 andere topdeals (vanaf 30% korting),
       steeds uit verschillende vakjes en winkels. De keuze hangt af van de datum, dus morgen staat er een nieuwe rij. */
    if (g.dagdeals) {
      var dag = new Date().toISOString().slice(0, 10), perVak = {}, perShop = {};
      selectie = alles.filter(function (p) { return kortingPct(p) >= 30 && p.beeld; })
        .sort(function (a, b) { return mixGetal(a.id + dag) - mixGetal(b.id + dag); })
        .filter(function (p) { var v = (p.groep || p.cat) + '/' + (p.vak || p.sub); if (perVak[v] || (perShop[p.shop] || 0) >= 3) return false; perVak[v] = 1; perShop[p.shop] = (perShop[p.shop] || 0) + 1; return true; })
        .slice(0, 12).sort(function (a, b) { return kortingPct(b) - kortingPct(a); });
    }
    /* Stap 6 indeling: de selectie staat alleen op gelegenheden en bij 'Deals van vandaag'; op een collectie (Cadeau-ideeën) meteen filter en producten. */
    var isGelegenheid = kruimelKop.naar === '/gelegenheid';
    if (!(isGelegenheid || g.dagdeals) || g.codes) selectie = [];
    /* 02-11-2026: zelfde als bij de personen: geen dubbele bovenaan, en afwisselen in winkel en soort. */
    if (!q.sort || q.sort === 'aanbevolen') {
      var inSel2 = {}; if (!q.prijs || q.prijs === 'alle') selectie.forEach(function (p) { inSel2[p.id] = 1; });
      lijst = afwisselen(lijst.filter(function (p) { return !inSel2[p.id]; }), 60).concat(lijst.filter(function (p) { return inSel2[p.id]; }));
    }
    var andere = window.LK_GELEGENHEDEN_NU().filter(function (x) { return x.slug !== g.slug; });
    return paginakop({
      titel: pv ? (g.kop || g.naam) + ' voor ' + voorNaam : (g.kop || g.naam),
      tekst: pv ? 'Met de hand gekozen cadeaus voor ' + voorNaam + ', voor ' + g.naam.toLowerCase() + '.' : g.tekst, vaag: g.beeld,
      kruimel: [{ tekst: kruimelKop.tekst, naar: kruimelKop.naar }].concat(pv ? [{ tekst: g.naam, naar: hoofdPad }, { tekst: pv.kort }] : [{ tekst: g.naam }])
    }) +
    '<div class="binnen">' +
      (g.korting || g.codes ? dealsNav(g.slug) : '') + (g.codes ? codesBlok() : '') +
      (voorKnopjes ? '<section class="sectie keuzes-sectie" aria-label="Keuzes">' + voorKnopjes + '</section>' : '') +
      /* Stap 4 indeling: 'Onze selectie' als vast raster (geen schuifrij). Deals van vandaag (Acties) blijven 12 stuks. */
      /* Stap 6 indeling: op een collectie (Cadeau-ideeën) geen selectie: meteen filter en producten. Acties houden 'Deals van vandaag'. */
      (selectie.length ? '<section class="sectie' + (voorKnopjes ? '' : ' eerste') + ' sfeer-modus"><div class="sectie-kop"><div><h2>' + (g.dagdeals ? 'Deals van vandaag' : 'Onze selectie') + '</h2>' + (g.dagdeals ? '<p>Elke dag 12 andere topdeals.</p>' : '') + '</div></div><div class="prodgrid vier">' + selectie.map(LK.productKaart).join('') + '</div></section>' : '') +
      '<section class="sectie"><div class="sectie-kop"><div><h2>' + (g.codes ? 'Producten van deze winkels' : g.korting ? 'Alle deals, grootste korting eerst' : (pv ? 'Alle cadeaus voor ' + esc(voorNaam) : 'Alle cadeaus voor ' + esc(g.naam.toLowerCase()))) + '</h2></div></div></section>' +
      werkbalk + gridMeer(lijst, leeg) + filterPaneel(pad, q, sorteerOpties, knoppen, lijst.length) +
      (g.gids && GIDSEN.some(function (x) { return x.slug === g.gids; }) ? '<nav class="lees-ook" aria-label="Cadeaugidsen">' + ic('vonk') + '<span>Lees ook:</span><a href="/gids/' + g.gids + '">' + esc(GIDSEN.filter(function (x) { return x.slug === g.gids; })[0].titel.split(':')[0]) + '</a></nav>' : '') +
      /* Verder kijken, onderaan als tekstlinks (gelegenheden op datum: eerst wat eraan komt). */
      (isGelegenheid ? tekstLinks('Andere gelegenheden', andere.map(function (x) { return [x.naam, x.naar || '/gelegenheid/' + x.slug]; })) : '') +
    '</div>';
  }
  function gelegenheidPagina(slug, voorSlug, q) {
    if (!slug) {
      zetTitel('Gelegenheden');
      /* Stap 4 indeling: 16 rondjes in een vast raster, op datum (eerst wat eraan komt; Moederdag, Vaderdag en Valentijn buiten hun seizoen onderaan). */
      return paginakop({ titel: 'Gelegenheden', tekst: 'Voor elk moment een passend cadeau.', kruimel: [{ tekst: 'Gelegenheden' }] }) +
        '<div class="binnen"><section class="sectie eerste keuzes-sectie">' + keuzeRaster(window.LK_GELEGENHEDEN_NU().map(function (x) {
          return { naam: x.naam, naar: x.naar || '/gelegenheid/' + x.slug, beeld: kleinBeeld(x.beeld) };
        }), 'Gelegenheden', { alles: true, groot: true }) + '</section></div>';
    }
    var g = window.LK_GELEGENHEID(slug);
    if (!g || !g.vakken) return nietGevonden();
    return verzameling(g, '/gelegenheid/' + g.slug, { tekst: 'Gelegenheden', naar: '/gelegenheid' }, q, voorSlug);
  }
  function collectie(slug, q) {
    var g = window.LK_COLLECTIE(slug);
    if (!g) return nietGevonden();
    return verzameling(g, '/collectie/' + g.slug, { tekst: 'Collecties', naar: '/' }, q);
  }
  /* Overzicht van alle personen (/voor). Stap 4 indeling: vast raster van rondjes. */
  function voorWie() {
    zetTitel('Voor wie zoek je een cadeau?');
    return paginakop({ titel: 'Voor wie zoek je een cadeau?', tekst: 'Kies voor wie het is. Daarna zie je alleen wat bij die persoon past.', kruimel: [{ tekst: 'Voor wie?' }] }) +
      '<div class="binnen"><section class="sectie eerste keuzes-sectie">' + keuzeRaster(window.LK_PERSONEN.filter(function (x) { return !x.verborgen; }).map(function (x) {
        return { naam: x.kort, naar: x.subs ? '/voor/' + x.slug : x.naar, beeld: kleinBeeld(x.beeld) };
      }), 'Voor wie', { alles: true, groot: true }) + '</section></div>';
  }

  /* ---------- Product ---------- */
  /* Productfoto's: één foto, of een rij om doorheen te bladeren (pijltjes, puntjes, vegen). */
  function productFotos(p) {
    var vs = (p.varianten || []).filter(function (v) { return v && v.beeld; });
    /* Kleurwissel (30-10-2026, wens van Marius): één product per model; sinds 31-10 ook voor dieren (p.keuzeLabel = 'Dier'). de pijltjes wisselen van kleur,
       en de prijs, de kleurnaam en de winkelknop gaan mee naar de gekozen kleur. */
    if (vs.length > 1) {
      return '<div class="product-beeld echt galerij varianten" data-galerij data-varianten="' + esc(p.id) + '">' +
        '<div class="galerij-rij">' + vs.map(function (v, i) {
          var web = /^https?:/.test(v.beeld);
          return '<figure><img src="' + esc(web ? v.beeld : v.beeld + '.webp') + '" alt="' + esc(p.titel + ', ' + v.kleur) + '"' + (i ? ' loading="lazy"' : ' fetchpriority="high"') + (web ? ' referrerpolicy="no-referrer"' : '') + ' decoding="async"></figure>';
        }).join('') + '</div>' +
        '<button class="galerij-knop vorige" type="button" data-galerij-stap="-1" aria-label="Vorige ' + esc((p.keuzeLabel || 'kleur').toLowerCase()) + '">' + ic('vorige') + '</button>' +
        '<button class="galerij-knop volgende" type="button" data-galerij-stap="1" aria-label="Volgende ' + esc((p.keuzeLabel || 'kleur').toLowerCase()) + '">' + ic('rechts') + '</button>' +
        '<span class="galerij-teller">1 / ' + vs.length + '</span>' +
      '</div>';
    }
    var extra = (p.fotos || []).filter(Boolean);
    var klasse = 'product-beeld' + (p.voorbeeld || !p.beeld ? '' : ' echt' + (p.sfeer ? ' sfeer' : (extra.length ? '' : ' studio')));
    if (!extra.length) return '<div class="' + klasse + '">' + LK.productBeeld(p, true) + (p.voorbeeld ? '<span class="label">Voorbeeld</span>' : '') + '</div>';
    var alle = [p.beeld].concat(extra);
    return '<div class="' + klasse + ' galerij" data-galerij>' +
      '<div class="galerij-rij">' + alle.map(function (b, i) {
        var src = /^https?:/.test(b) ? b : b + '.webp';
        return '<figure><img src="' + esc(src) + '" alt="' + esc(p.titel) + (i ? ' (foto ' + (i + 1) + ')' : '') + '"' + (i ? ' loading="lazy"' : ' fetchpriority="high"') + ' decoding="async"></figure>';
      }).join('') + '</div>' +
      '<button class="galerij-knop vorige" type="button" data-galerij-stap="-1" aria-label="Vorige foto">' + ic('vorige') + '</button>' +
      '<button class="galerij-knop volgende" type="button" data-galerij-stap="1" aria-label="Volgende foto">' + ic('rechts') + '</button>' +
      '<div class="galerij-punten">' + alle.map(function (b, i) { return '<span' + (i ? '' : ' class="aan"') + '></span>'; }).join('') + '</div>' +
      '<span class="galerij-teller">1 / ' + alle.length + '</span>' +
    '</div>';
  }
  /* Kleurkeuze onder de prijs: naam van de kleur + kleine fotootjes om direct een kleur te kiezen. */
  function kleurKeuze(p) {
    var vs = (p.varianten || []).filter(function (v) { return v && v.beeld; });
    if (vs.length < 2) return '';
    return '<div class="kleurkeuze"><p>' + esc(p.keuzeLabel || 'Kleur') + ': <b data-kleur-naam>' + esc(vs[0].kleur) + '</b> <span class="klein" data-kleur-teller>(1 van ' + vs.length + ')</span></p>' +
      '<div class="kleurstalen" role="group" aria-label="Kies een ' + esc((p.keuzeLabel || 'kleur').toLowerCase()) + '">' + vs.map(function (v, i) {
        var web = /^https?:/.test(v.beeld);
        return '<button type="button" data-kleur-stap="' + i + '" aria-label="' + esc(v.kleur) + '" aria-pressed="' + (i ? 'false' : 'true') + '"><img src="' + esc(web ? v.beeld : v.beeld + '-klein.webp') + '" alt="" loading="lazy" decoding="async"' + (web ? ' referrerpolicy="no-referrer"' : '') + '></button>';
      }).join('') + '</div></div>';
  }
  /* Maatkeuze (31-10-2026, wens van Marius): bij schoenen kies je je maat al hier; als de winkel per maat een link heeft,
     brengt de knop je direct naar die maat. Anders tonen we welke maten op voorraad zijn. */
  function maatInhoud(v, p) {
    var m = (v && v.maten) || p.maten || [];
    if (!m.length) return '';
    var klik = m.some(function (x) { return x.url; });
    return '<p>' + (klik ? 'Maat: <b data-maat-naam>kies je maat</b>' : 'Op voorraad in maat:') + '</p>' +
      '<div class="maten" role="group" aria-label="Kies je maat">' + m.map(function (x, i) {
        return klik ? '<button type="button" data-maat="' + i + '" aria-pressed="false">' + esc(x.maat) + '</button>' : '<span>' + esc(x.maat) + '</span>';
      }).join('') + '</div>' +
      '<p class="klein">' + (klik ? 'Kies je maat, dan brengt de knop je direct naar die maat in de winkel.' : 'Je kiest je maat daarna bij de winkel.') + '</p>';
  }
  function maatKeuze(p) {
    var vs = (p.varianten || []).filter(function (v) { return v && v.beeld; });
    var h = maatInhoud(vs[0], p);
    return h ? '<div class="maatkeuze" data-maten data-pid="' + esc(p.id) + '" data-v="0">' + h + '</div>' : '';
  }
  function galerijBijwerken(g) {
    var rij = $('.galerij-rij', g); if (!rij) return;
    var n = rij.children.length, i = Math.round(rij.scrollLeft / Math.max(1, rij.clientWidth));
    $$('.galerij-punten span', g).forEach(function (s, j) { s.classList.toggle('aan', j === i); });
    var t = $('.galerij-teller', g); if (t) t.textContent = (i + 1) + ' / ' + n;
    var pid = g.getAttribute('data-varianten'); if (!pid) return;
    var p = LK.vind(pid), v = p && p.varianten && p.varianten.filter(function (x) { return x && x.beeld; })[i];
    if (!v) return;
    var mb = $('[data-maten]'); if (mb && mb.getAttribute('data-v') !== String(i)) { mb.setAttribute('data-v', i); mb.innerHTML = maatInhoud(v, p); }
    var naam = $('[data-kleur-naam]'); if (naam) naam.textContent = v.kleur;
    var tel = $('[data-kleur-teller]'); if (tel) tel.textContent = '(' + (i + 1) + ' van ' + n + ')';
    $$('[data-kleur-stap]').forEach(function (b, j) { b.setAttribute('aria-pressed', String(j === i)); });
    $$('[data-variant-prijs]').forEach(function (e) { e.innerHTML = LK.euro(v.prijs); });
    var link = winkelLink(v);
    if (link) $$('a[data-winkel]').forEach(function (a) { a.href = link; });
  }

  /* 2.0: winkellinks, specs en noten staan in een apart bestand dat pas op een productpagina laadt (sneller op de telefoon). */
  var detailsBezig = false;
  /* Snelheid (31-10-2026): op een gebouwde productpagina staan de details van dát product al in de HTML (LK_DETAILS_DEEL),
     zodat het grote detailbestand (3 MB) niet hoeft te laden. */
  function heeftDetails(p) {
    if (!p) return false;
    if (window.LK_DETAILS && window.LK_DETAILS[p.id]) return true;
    var D = window.LK_DETAILS_DEEL;
    if (D && D[p.id]) { if (!p.detailsGeladen) { Object.assign(p, D[p.id]); p.detailsGeladen = true; } return true; }
    return false;
  }
  function laadDetails(klaar) {
    if (window.LK_DETAILS) { klaar(); return; }
    if (detailsBezig) return; detailsBezig = true;
    var lean = $('script[src*="producten-lean.js"]'), v = lean ? (lean.getAttribute('src').split('?v=')[1] || '') : '';
    var sc = document.createElement('script'); sc.src = '/assets/js/producten-details.js' + (v ? '?v=' + v : '');
    sc.onload = function () {
      var D = window.LK_DETAILS || {};
      (window.LK_PRODUCTEN || []).forEach(function (p) { if (D[p.id]) Object.assign(p, D[p.id]); });
      klaar();
    };
    sc.onerror = function () { detailsBezig = false; };
    document.head.appendChild(sc);
  }
  function product(id) {
    var p = LK.vind(id);
    if (p && p.status === 'samengevoegd' && p.samengevoegd && LK.vind(p.samengevoegd)) {
      if (window.history && history.replaceState) history.replaceState(null, '', '/p/' + p.samengevoegd);
      return product(p.samengevoegd);
    }
    if (!p || p.status !== 'goedgekeurd') return nietGevonden('Dit product is (nog) niet beschikbaar.');
    if (!heeftDetails(p)) laadDetails(function () { if (location.pathname.indexOf('/p/' + id) === 0) toon(); });
    onthoudBekeken(p.id);
    var c = window.LK_CAT(p.cat), s = window.LK_SUB(c, p.sub);
    /* 2.0: staat dit vak onder een andere groep (bijv. mode-beauty/horloges onder Sieraden & Horloges), dan dat kruimelpad. */
    if (!s || s.verborgen) ALLECATS.forEach(function (cc) { (cc.subs || []).forEach(function (ss) { if (ss.vak === p.cat + '/' + p.sub && !ss.verborgen) { c = cc; s = ss; } }); });
    /* 3.0: kruimelpad volgens de nieuwe boom (afdeling > groep > vakje). */
    var nc = p.afd && window.LK_CAT(p.afd), ns = nc && window.LK_SUB(nc, p.groep), nv = ns && window.LK_VAK(ns, p.vak);
    zetTitel(p.titel);
    var fav = LK.isFavoriet(p.id);
    var knop = (p.url && !p.voorbeeld)
      ? '<a class="knop knop-goud" data-winkel href="' + esc(winkelLink(p)) + '" target="_blank" rel="sponsored nofollow noopener">Bekijk bij ' + esc(p.shop) + ' ' + ic('pijl') + '</a>'
      : (!heeftDetails(p) && !p.voorbeeld ? '<span class="knop knop-goud uit" aria-disabled="true">Bekijk bij ' + esc(p.shop) + '…</span>'
      : '<span class="knop knop-goud uit" aria-disabled="true">Voorbeeld – nog geen winkellink</span>');

    var ookIn = (p.ookIn || []).map(function (x) {
      var pe = window.LK_PERSONEN.filter(function (q) { return q.oud === x; })[0];
      if (pe) return '<a href="/voor/' + pe.slug + '">' + esc(pe.naam) + '</a>';
      var d = x.split('/'), cc = window.LK_CAT(d[0]), ss = window.LK_SUB(cc, d[1]);
      return cc && ss ? '<a href="/c/' + cc.slug + '/' + ss.slug + '">' + esc(ss.naam) + '</a>' : '';
    }).filter(Boolean);

    /* 'Ook leuk': eerst uit dezelfde subcategorie, daarna uit dezelfde categorie (of met dezelfde 'ook in'). */
    var verwant = LK.zichtbaar().filter(function (x) {
      return x.id !== p.id && (p.cat === 'christelijk') === (x.cat === 'christelijk') && (x.cat === p.cat || (x.ookIn || []).some(function (o) { return (p.ookIn || []).indexOf(o) !== -1; }));
    });
    var zelfdeSub = function (x) { return x.cat === p.cat && x.sub === p.sub; };
    verwant = sorteer(verwant.filter(zelfdeSub)).concat(sorteer(verwant.filter(function (x) { return !zelfdeSub(x); }))).slice(0, 4);

    return '<div class="binnen">' +
      '<div style="padding-top:16px">' + kruimel(nc ? [{ tekst: nc.naam, naar: '/c/' + nc.slug }, { tekst: ns ? ns.naam : '', naar: ns ? '/c/' + nc.slug + '/' + ns.slug : '' }, { tekst: nv ? nv.naam : '', naar: nv ? '/c/' + nc.slug + '/' + ns.slug + '/' + nv.slug : '' }].filter(function (x) { return x.tekst; }) : [{ tekst: c.naam, naar: '/c/' + c.slug }, { tekst: s ? s.naam : '', naar: s ? '/c/' + c.slug + '/' + s.slug : '' }].filter(function (x) { return x.tekst; })) + '</div>' +
      '<div class="product">' +
        productFotos(p) +
        '<div class="product-info">' +
          '<span class="shop">' + esc(p.shop) + '</span>' +
          '<h1>' + esc(p.titel) + '</h1>' +
          '<div class="prijs"><span data-variant-prijs>' + LK.euro(p.prijs) + '</span>' + (p.oudePrijs > p.prijs ? ' <s class="oud">' + LK.euro(p.oudePrijs) + '</s>' : '') + '</div>' +
          /* Stap 5 indeling (6-11-2026, plan deel 8): de knop direct onder de prijs, binnen het eerste scherm; kleur en maat eronder. */
          '<div class="product-acties" data-acties>' + knop +
            '<button class="hartknop" type="button" data-fav="' + esc(p.id) + '" aria-pressed="' + fav + '" aria-label="' + (fav ? 'Haal van je verlanglijstje' : 'Zet op je verlanglijstje') + '">' + ic('hart') + '</button>' +
          '</div>' + inAppTip(p) +
          kleurKeuze(p) + maatKeuze(p) +
          '<p class="prijsnoot">Prijs zoals laatst bij ons bekend' + (p.gecontroleerd ? ' (gecontroleerd op ' + p.gecontroleerd.split('-').reverse().join('-') + ')' : '') + '. De actuele prijs zie je bij de winkel.</p>' +
          /* Mobiel: als de knop uit beeld is gescrold, blijft onderin een smalle balk met prijs en knop staan. */
          (p.url && !p.voorbeeld ? '<div class="product-plak" data-plak aria-hidden="true"><div class="binnen"><span class="prijs" data-variant-prijs>' + LK.euro(p.prijs) + '</span>' +
            '<a class="knop knop-goud" data-winkel href="' + esc(winkelLink(p)) + '" target="_blank" rel="sponsored nofollow noopener" tabindex="-1">Bekijk bij ' + esc(p.shop) + ' ' + ic('pijl') + '</a></div></div>' : '') +
          '<div class="waarom"><h2>' + ic('ster') + 'Waarom wij dit kozen</h2><p>' + esc(p.waarom || '') + '</p></div>' +
          (p.specs && p.specs.length ? '<div class="specs"><h2>' + ic('info') + 'Specificaties</h2><dl>' +
            p.specs.map(function (r) { return '<div><dt>' + esc(r[0]) + '</dt><dd>' + esc(r[1]) + '</dd></div>'; }).join('') +
            '</dl><p class="specs-noot">Volgens de gegevens van de winkel. Twijfel je? Kijk dan ook even bij ' + esc(p.shop) + '.</p></div>' : '') +
          /* Stap 5 indeling: één zin korter ('Met de hand gekozen' staat al bij 'Waarom wij dit kozen'). */
          '<ul class="feiten">' +
            '<li>' + ic('winkel') + '<span>Je bestelt en betaalt bij ' + esc(p.shop) + '; bezorging en retour regelt de winkel.</span></li>' +
            (p.letOp ? '<li class="letop">' + ic('info') + '<span><strong>Let op:</strong> ' + esc(p.letOp) + '</span></li>' : '') +
            (p.verzendNoot ? '<li>' + ic('info') + '<span>' + esc(p.verzendNoot) + '</span></li>' : '') +
            (ookIn.length ? '<li>' + ic('cadeau') + '<span>Ook te vinden bij: ' + ookIn.join(', ') + '</span></li>' : '') +
            (p.voorbeeld ? '<li>' + ic('info') + '<span>Dit is een voorbeeldproduct om de site te testen. De foto is een sfeerbeeld.</span></li>' : '') +
          '</ul>' +
        '</div>' +
      '</div>' +
      /* Stap 5 indeling: terug naar het vakje als tekstlink (ontbrak). */
      (function () { var t = nv ? [nv.naam, '/c/' + nc.slug + '/' + ns.slug + '/' + nv.slug] : ns ? [ns.naam, '/c/' + nc.slug + '/' + ns.slug] : (s && !s.verborgen ? [s.naam, '/c/' + c.slug + '/' + s.slug] : c ? [c.naam, '/c/' + c.slug] : null);
        return t ? '<p class="terug-link"><a href="' + esc(t[1]) + '">' + ic('vorige') + ' Terug naar ' + esc(t[0]) + '</a></p>' : ''; })() +
      verderZoeken(p, c, s) +
      (verwant.length ? '<section class="sectie"><div class="sectie-kop"><div><h2>Ook leuk</h2></div></div>' + grid(verwant) + '</section>' : '') +
    '</div>';
  }
  /* 2.0: 'Laatst bekeken' (alleen op dit apparaat, geen account nodig). */
  function onthoudBekeken(id) {
    try { var l = JSON.parse(localStorage.getItem('lk-bekeken') || '[]').filter(function (x) { return x !== id; }); l.unshift(id); localStorage.setItem('lk-bekeken', JSON.stringify(l.slice(0, 12))); } catch (e) {}
  }
  function laatstBekeken() {
    var ids = []; try { ids = JSON.parse(localStorage.getItem('lk-bekeken') || '[]'); } catch (e) {}
    var l = ids.map(function (id) { return LK.vind(id); }).filter(function (p) { return p && p.status === 'goedgekeurd'; });
    if (l.length < 2) return '';
    return '<section class="sectie"><div class="sectie-kop"><div><h2>Laatst bekeken</h2></div></div>' + rij(l.slice(0, 10)) + '</section>';
  }
  /* 2.0: 'Verras me': een willekeurige favoriet uit de afdeling waar je nu bent. */
  var verrasIds = [];
  function verrasKnop(lijst) {
    var kand = lijst.filter(function (p) { return p.favoriet || p.populair; });
    if (kand.length < 4) kand = lijst;
    verrasIds = kand.slice(0, 200).map(function (p) { return p.id; });
    return verrasIds.length >= 4 ? '<button class="chip verras" type="button" data-verras>' + ic('vonk') + ' Verras me</button>' : '';
  }
  /* 2.0: 'Verder zoeken' onder een product: in één tik naar vergelijkbare producten, goedkopere, of meer voor dezelfde persoon. */
  function verderZoeken(p, c, s) {
    if (p.cat === 'christelijk' || !s) return '';
    var subPad = '/c/' + c.slug + '/' + s.slug, knoppen = [];
    var aantal = function (pad, prijs) { return LK.zichtbaar().filter(function (x) { return x.id !== p.id && LK.hoortBij(x, c.slug, s.slug) && (!prijs || binnenPrijs(x, prijs)); }).length; };
    var n = aantal();
    if (n) knoppen.push({ tekst: 'Meer in ' + s.naam, sub: n + ' vergelijkbare producten', naar: subPad, ic: 'zoek' });
    /* Goedkoper: het grootste budget dat onder de prijs van dit product ligt. */
    var goedkoper = PRIJZEN.filter(function (f) { return f.id !== 'alle' && f.max < p.prijs && f.max !== Infinity; }).pop();
    if (goedkoper) { var ng = aantal(subPad, goedkoper.id); if (ng) knoppen.push({ tekst: 'Goedkoper: ' + goedkoper.label.toLowerCase(), sub: ng + ' opties', naar: maakAdres(subPad, { prijs: goedkoper.id }), ic: 'filter' }); }
    /* Meer voor dezelfde persoon, liefst in dezelfde subcategorie van die persoon. */
    (window.LK_PERSONEN || []).forEach(function (pe) {
      if (knoppen.length >= 4) return;
      var vanPersoon = (p.voor || []).some(function (v) { return pe.labels.indexOf(v) !== -1; }) || (pe.oud && (p.ookIn || []).indexOf(pe.oud) !== -1);
      if (!vanPersoon || !pe.subs) return;
      var plekken = [p.cat + '/' + p.sub, p.cat].concat(p.ookIn || []);
      var su = pe.subs.filter(function (x) { return plekken.some(function (pl) { return x.vakken.some(function (v) { return pl === v || pl.indexOf(v + '/') === 0; }); }); })[0];
      knoppen.push({ tekst: (su ? su.naam : 'Meer') + ' voor ' + pe.naam.replace(/^Voor /, '').toLowerCase(), sub: 'Bekijk', naar: '/voor/' + pe.slug + (su ? '/' + su.slug : ''), ic: 'cadeau' });
    });
    if (!knoppen.length) return '';
    return '<section class="sectie verder"><div class="sectie-kop"><div><h2>Verder zoeken</h2></div></div><div class="verder-knoppen">' +
      knoppen.slice(0, 4).map(function (k) { return '<a class="verder-knop" href="' + esc(k.naar) + '">' + ic(k.ic) + '<span><strong>' + esc(k.tekst) + '</strong><small>' + esc(k.sub) + '</small></span>' + ic('rechts', 'pijl') + '</a>'; }).join('') +
      '</div></section>';
  }

  /* ---------- Zoeken ---------- */
  /* Woorden die mensen typen, naast wat er bij een product staat (zoals 'cadeau vrouw' of 'schoencadeau'). */
  var SYN = { collega: 'collega collegas werk kantoor lootjes bedankje kleinigheid kleinigheidje afscheid juf meester leerkracht docent', haar: 'vrouw vrouwen dames moeder mama vriendin zus', hem: 'man mannen heren vader papa vriend broer', kind: 'kinderen jongen meisje jongens meisjes',
    'opa-oma': 'opa oma grootouders', kerst: 'kerstmis kerstcadeau', sinterklaas: 'sint pakjesavond schoencadeau schoencadeautje surprise', verjaardag: 'jarig', zomaar: 'bedankje' };
  /* Extra zoekwoorden per (sub)categorie; gelden ook voor producten die er via 'ookIn' in staan. */
  var SUBSYN = { 'mode-beauty/geuren': 'parfum geur', 'eten-drinken/pakketten': 'kerstpakket cadeaupakket borrelpakket', 'wonen/kerstdecoratie': 'kerstversiering kerstspullen',
    'cadeaus/met-naam': 'gepersonaliseerd persoonlijk gegraveerd gravure', 'cadeaus/baby-kraam': 'kraamcadeau geboorte babyshower', 'cadeaus/adventskalenders': 'advent aftellen',
    'boeken-media/lezen': 'e-reader ereader', 'metaaldetectie/detectors': 'metaaldetector detector', 'elektronica/audio': 'speaker luidspreker', 'dranken/whisky': 'whiskey',
    'christelijk/bijbels': 'bijbel', 'sport-outdoor/kamperen': 'camping', 'hobby/knutselen': 'diy zelf maken creatief', 'speelgoed/figuren-voertuigen': 'speelfiguur speelfiguren',
    'cadeaus/collega': 'juf meester leerkracht', 'cadeaus/voor-kinderen': 'tiener' };
  /* 3.0 (5-11-2026): ook de nieuwe boom (afdeling > groep > vakje) telt mee bij zoeken, plus extra woorden per vakje.
     Zo vindt 'bordspel' alle bordspellen en 'kerstboom' het vakje Kerstbomen & kransen. */
  var VAKSYN = { 'kerstbomen-kransen': 'kerstboom kunstkerstboom kerstkrans krans adventskrans', 'cadeaupakketten-manden': 'kerstpakket cadeaupakket borrelpakket pakket',
    'dameshorloges': 'dameshorloge horloge dames', 'herenhorloges': 'herenhorloge horloge heren', 'koptelefoons': 'koptelefoon headphone', 'oordopjes': 'oortjes earbuds oordopjes koptelefoon',
    'gaming-headsets': 'headset koptelefoon', 'bordspellen-voor-het-gezin': 'bordspel gezelschapsspel', 'strategiespellen': 'bordspel strategiespel', 'partyspellen': 'bordspel partyspel',
    'kinderspellen': 'bordspel kinderspel', 'kaart-dobbelspellen': 'kaartspel dobbelspel', 'squishmallows': 'squishmallow knuffel', 'dartborden': 'dartbord darts', 'dartpijlen': 'darts dartpijl pijltjes',
    'elektronische-dartborden': 'dartbord darts', 'dartmatten-oches': 'darts dartmat oche', 'flights-shafts': 'darts', 'verlichting-surrounds': 'darts surround dartbordverlichting',
    'damesparfum': 'parfum geur eau de parfum', 'herenparfum': 'parfum geur aftershave eau de toilette', 'parfumsets': 'parfum geurset', 'giftsets-voor-haar': 'cadeauset giftset',
    'giftsets-voor-hem': 'cadeauset giftset', 'metaaldetectors': 'metaaldetector detector', 'chocoladeletters': 'chocoladeletter letter', 'geurkaarsen': 'geurkaars kaars',
    'kerstballen-hangers': 'kerstbal kersthanger kerstversiering', 'kerstverlichting': 'kerstlampjes kerstverlichting lichtjes', 'knuffels': 'knuffel', 'legpuzzels': 'puzzel legpuzzel',
    'kinderpuzzels': 'puzzel', '3d-puzzels': 'puzzel', 'bluetooth-speakers': 'speaker luidspreker box', 'consoles': 'console spelcomputer', 'games': 'game spel' };
  function zoekBoom(p) {
    var a = window.LK_CAT(p.afd), g = window.LK_SUB(a, p.groep), v = window.LK_VAK ? window.LK_VAK(g, p.vak) : null;
    return { groep: g ? g.naam : '', vak: (v ? v.naam : '') + ' ' + (VAKSYN[p.vak] || ''), afd: a ? a.naam : '' };
  }
  function zoekTekst(p) {
    var c = window.LK_CAT(p.cat), s = window.LK_SUB(c, p.sub), b = zoekBoom(p);
    var extra = (p.ookIn || []).map(function (x) { var d = x.split('/'); var cc = window.LK_CAT(d[0]); var ss = window.LK_SUB(cc, d[1]); return ss ? ss.naam : ''; });
    var syn = (p.voor || []).concat(p.moment || []).map(function (x) { return SYN[x] || ''; });
    var subsyn = [p.cat + '/' + p.sub].concat(p.ookIn || []).map(function (x) { return SUBSYN[x] || ''; });
    var t = [p.titel, p.waarom, p.shop, c && c.naam, s && s.naam, extra.join(' '), (p.voor || []).join(' '), (p.moment || []).join(' '), syn.join(' '), subsyn.join(' '), p.zoek || '', b.afd, b.groep, b.vak, p.merk || ''].join(' ').toLowerCase();
    /* Afkortingen die mensen intypen: 'ps5' vindt ook 'PlayStation 5', 'ps4' ook 'PlayStation 4'. */
    return t + (/playstation\s*5/.test(t) ? ' ps5' : '') + (/playstation\s*4/.test(t) ? ' ps4' : '');
  }
  /* Hoofdletters en accenten maken niet uit: 'cafe' vindt ook 'café'. */
  function vouw(s) { s = String(s || '').toLowerCase(); return s.normalize ? s.normalize('NFD').replace(/[\u0300-\u036f]/g, '') : s; }
  /* Verkleinwoorden en meervoud terugbrengen: 'loopfietsje' zoekt ook 'loopfiets', 'fietsjes' ook 'fiets'. */
  function stam(w) { var k = w.replace(/(tjes|tje|jes|je|'s|s)$/, ''); return k.length >= 4 ? k : w; }
  var ZT = {};
  function zoekTekstV(p) { return ZT[p.id] || (ZT[p.id] = vouw(zoekTekst(p))); }
  /* Eén tikfout mag ('fiest' vindt 'fiets', 'lgeo' vindt 'lego'): kleine afstand tussen twee woorden. */
  function bijna(a, b) {
    if (Math.abs(a.length - b.length) > 1) return false;
    var i = 0, j = 0, fout = 0;
    while (i < a.length && j < b.length) {
      if (a[i] === b[j]) { i++; j++; continue; }
      if (++fout > 1) return false;
      if (a[i + 1] === b[j] && a[i] === b[j + 1]) { i += 2; j += 2; continue; }
      if (a.length > b.length) i++; else if (b.length > a.length) j++; else { i++; j++; }
    }
    return fout + (a.length - i) + (b.length - j) <= 1;
  }
  /* Korte woorden (4 letters) alleen bij twee omgedraaide letters ('lgeo' → lego), langere bij elke kleine tikfout. */
  function lijkt(w, x) {
    if (!x) return false;
    if (w.length >= 5) return bijna(w, x) || (x.length > w.length && bijna(w, x.slice(0, w.length)));
    if (w.length !== 4 || x.length !== 4) return false;
    for (var i = 0; i < 3; i++) if (w.slice(0, i) + w[i + 1] + w[i] + w.slice(i + 2) === x) return true;
    return false;
  }
  /* Woorden die bijna elke zoekvraag heeft ('cadeau voor man'): die tellen niet mee, zolang er nog een ander woord over is. */
  var STOP = { voor: 1, een: 1, de: 1, het: 1, van: 1, met: 1, en: 1, cadeau: 1, cadeaus: 1, cadeautje: 1, kado: 1, kados: 1, idee: 1, ideeen: 1, leuk: 1, leuke: 1 };
  /* Zoekbalk slimmer (5-11-2026, GO Marius): Engelse woorden en woorden die erop lijken ('teapot' vindt theepotten,
     'kokmes' vindt koksmessen). Een woord met '|' betekent: een van deze woorden is goed. */
  var ZINALT = { 'oorbellen maken': 'sieraden-maken', 'sieraden maken': 'sieraden-maken', 'kettingen maken': 'sieraden-maken', 'armbandjes maken': 'sieraden-maken' };
  var ALT = { teapot: 'theepot|teapot', tea: 'thee', mug: 'mok|beker', cup: 'mok|beker|kop', kokme: 'koksmes|keukenmes|messenset|koksme', kokmes: 'koksmes|keukenmes|messenset', koksme: 'koksmes|keukenmes|messenset', keukenme: 'keukenmes|koksmes|messenset',
    knife: 'mes|messen', zakme: 'zakmes|multitool', zakmes: 'zakmes|multitool', scarf: 'sjaal', candle: 'kaars', watch: 'horloge', earring: 'oorbel', necklace: 'ketting', bracelet: 'armband', ring: 'ring',
    bag: 'tas', backpack: 'rugzak', wallet: 'portemonnee', headphone: 'koptelefoon', earbud: 'oordop|oordopjes', perfume: 'parfum', puzzle: 'puzzel', toy: 'speelgoed', book: 'boek', sock: 'sokken|sok',
    blanket: 'plaid|deken', deken: 'deken|plaid', plaid: 'plaid|deken', slipper: 'slof|pantoffel', sloffen: 'slof|pantoffel', slof: 'slof|pantoffel', pantoffel: 'pantoffel|slof', sweater: 'trui', jumper: 'trui',
    wine: 'wijn', beer: 'bier', chocolate: 'chocola|chocolade', coffee: 'koffie', cookbook: 'kookboek', apron: 'schort', phone: 'telefoon', charger: 'oplader', kitchen: 'keuken', garden: 'tuin', dog: 'hond', cat: 'kat|poes',
    beker: 'beker|mok', mok: 'mok|beker', kado: 'cadeau', gift: 'cadeau', sieradenmaken: 'sieraden-maken', kralen: 'kralen|sieraden-maken', lego: 'lego', jbl: 'jbl', airpod: 'airpods|oordopjes' };
  function zoekWoorden(tekst) {
    var v = vouw(tekst);
    Object.keys(ZINALT).forEach(function (z) { if (v.indexOf(z) !== -1) v = v.split(z).join(' ' + ZINALT[z] + ' '); });
    var w = v.split(/[^a-z0-9-]+/).filter(Boolean).map(function (x) { return x.replace(/^-+|-+$/g, ''); }).filter(Boolean);
    var r = w.filter(function (x) { return !STOP[x]; });
    return (r.length ? r : w).map(function (x) { if (x.indexOf('-') !== -1) return x.split('-').join(' '); var st = stam(x); return ALT[x] || ALT[st] || st; });
  }
  /* Eén van de woorden in een '|'-lijst is genoeg. Een woord met een spatie ('sieraden maken') moet als geheel voorkomen. */
  function bevatEen(t, w) { return w.split('|').some(function (d) { return d.indexOf(' ') !== -1 ? t.indexOf(d) !== -1 : bevat(t, d); }); }
  /* Woorden voor een persoon ('man', 'vrouw', 'oma'): die zoeken op voor wie het product is, niet op de titel ('Dog Man' is geen cadeau voor een man). */
  var PERSW = {}; Object.keys(SYN).forEach(function (k) { if (/^(haar|hem|kind|opa-oma|collega)$/.test(k)) (SYN[k] + ' ' + k).split(' ').forEach(function (w) { PERSW[stam(w)] = k; }); });
  /* Korte woorden (3 letters of minder) alleen aan het begin van een woord: 'oma' vindt niet 'aroma' of 'roman', 'lp' niet 'alpaca'. */
  /* Woorden die toevallig ín een ander woord zitten maar iets heel anders zijn (nijntje ≠ konijntje). */
  var NIET_IN = { nijntje: 'konijntje', nijn: 'konijn', ijntje: 'konijntje' };
  function bevat(t, w) {
    if (w.length <= 3) return (' ' + t).search(new RegExp('[^a-z0-9]' + w)) !== -1;
    if (t.indexOf(w) === -1) return false;
    return NIET_IN[w] ? t.split(NIET_IN[w]).join(' ').indexOf(w) !== -1 : true;
  }
  /* 2.0: 'Bedoel je…': welke pagina's passen bij het zoekwoord? Eerst de persoonspagina's (Horloges voor hem),
     dan gelegenheden en collecties, dan de productgroepen. Zo kom je in één tik op de goede afdeling. */
  /* Nakijkbeurt 6-11-2026: eerst alleen echte treffers. Pas als dat niets geeft, ook woorden met één tikfout
     (anders werd 'kaarten' ook 'kaarsen' en kreeg je bij 'pokemon kaarten' Kaarsen & geur als tip). */
  /* Stap 6 indeling (6-11-2026, plan deel 8): woordenlijst. 'vrouw', 'vriendin', 'moeder' = voor haar; 'man', 'vriend', 'vader' = voor hem;
     'kind', 'zoon', 'dochter' = kinderen; kerst, sinterklaas, verjaardag = die pagina. Samen wordt dat 'Kerstcadeaus voor haar'. */
  var WL_PERSOON = { haar: 'haar vrouw vrouwen vriendin moeder mama mam zus dames dame echtgenote partner schoonmoeder tante nicht', hem: 'hem man mannen vriend vader papa pap broer heren heer echtgenoot schoonvader oom neef',
    kinderen: 'kind kinderen zoon dochter jongen meisje kids kleinkind kleinzoon kleindochter neefje nichtje peuter kleuter', tieners: 'tiener tieners puber pubers', 'opa-oma': 'opa oma grootouders opas omas grootvader grootmoeder',
    collega: 'collega collegas werknemer medewerker baas', baby: 'baby kraamcadeau kraam geboorte babyshower pasgeboren newborn' };
  var WL_MOMENT = { kerst: ['kerst kerstcadeau kerstcadeaus kerstmis kerstcadeautje kerstpakket', 'Kerstcadeaus', '/c/cadeaus/kerst'], sinterklaas: ['sinterklaas sint pakjesavond schoencadeau schoencadeautje surprise sinterklaascadeau', 'Sinterklaascadeaus', '/c/cadeaus/sinterklaas'],
    verjaardag: ['verjaardag jarig verjaardagscadeau verjaardagscadeaus', 'Verjaardagscadeaus', '/gelegenheid/verjaardag'], moederdag: ['moederdag moederdagcadeau', 'Moederdagcadeaus', '/gelegenheid/moederdag'],
    vaderdag: ['vaderdag vaderdagcadeau', 'Vaderdagcadeaus', '/gelegenheid/vaderdag'], valentijn: ['valentijn valentijnscadeau valentijnsdag', 'Valentijnscadeaus', '/c/valentijn'] };
  function woordenTips(woorden) {
    var stammen = woorden.map(stam), uit = [];
    var heeft = function (lijst) { return lijst.split(' ').some(function (x) { return stammen.indexOf(stam(x)) !== -1; }); };
    var pers = Object.keys(WL_PERSOON).filter(function (k) { return heeft(WL_PERSOON[k]); });
    var mom = Object.keys(WL_MOMENT).filter(function (k) { return heeft(WL_MOMENT[k][0]); });
    var jaar = null; woorden.forEach(function (w, i) { if (/^\d{1,2}$/.test(w) && /^jaar|^jr$/.test(woorden[i + 1] || '')) jaar = +w; });
    if (jaar !== null && jaar <= 12 && pers.indexOf('kinderen') === -1) pers.unshift('kinderen');
    if (jaar !== null && jaar >= 13 && jaar <= 17 && pers.indexOf('tieners') === -1) pers.unshift('tieners');
    var naamVan = function (slug) { var pe = window.LK_PERSOON(slug); return pe ? pe.naam.replace(/^Voor /, '').toLowerCase() : slug; };
    /* 1. moment + persoon: 'Kerstcadeaus voor haar' */
    mom.forEach(function (m) { pers.forEach(function (ps) {
      var M = WL_MOMENT[m], naar;
      if (m === 'moederdag' || m === 'vaderdag') return;
      if (m === 'verjaardag') { var g = window.LK_GELEGENHEID('verjaardag'); naar = g && GELEGENHEID_VOOR.indexOf(ps) !== -1 && verzamelLijst(g).filter(function (p) { return voorFilter(p, ps); }).length >= 10 ? M[2] + '/' + ps : ''; }
      else naar = M[2] + '?voor=' + ps;
      if (naar) uit.push({ naam: M[1] + ' voor ' + naamVan(ps), naar: naar, soort: 'pagina' });
    }); });
    /* 2. het moment zelf, 3. de persoon zelf (met leeftijd als die genoemd is) */
    mom.forEach(function (m) { uit.push({ naam: WL_MOMENT[m][1], naar: WL_MOMENT[m][2], soort: 'pagina' }); });
    pers.forEach(function (ps) {
      var pe = window.LK_PERSOON(ps); if (!pe) return;
      if (ps === 'kinderen' && jaar !== null && jaar <= 12) {
        var b = (window.LK_KNOPSETS.leeftijd || { opties: [] }).opties.filter(function (o) { return jaar >= o[2].leeftijd[0] && jaar <= o[2].leeftijd[1]; })[0];
        if (b) { uit.push({ naam: 'Voor kinderen van ' + b[1], naar: '/voor/kinderen?leeftijd=' + b[0], soort: 'pagina' }); return; }
      }
      uit.push({ naam: pe.naam, naar: pe.subs ? '/voor/' + pe.slug : pe.naar, soort: 'pagina' });
    });
    return uit;
  }
  function paginaTips(woorden) {
    var eerst = woordenTips(woorden);
    /* 'haar' en 'hem' zijn hier personen, geen haarproducten: die woorden doen niet mee aan het zoeken naar groepen. */
    var zonder = woorden.filter(function (w) { return !/^(haar|hem|hun|zijn|voor)$/.test(w); });
    var t = paginaTips2(zonder, false);
    if (!t.length && !eerst.length) t = paginaTips2(zonder, true);
    var gezien = {};
    /* Wijst de woordenlijst al een pagina aan, dan hoogstens 3 andere tips erbij. */
    return eerst.concat(eerst.length ? t.slice(0, 3) : t).filter(function (x) { if (gezien[x.naar]) return false; gezien[x.naar] = 1; return true; }).slice(0, 8);
  }
  function paginaTips2(woorden, tikfout) {
    if (!woorden.length) return [];
    var ZW = window.LK_ZOEKWOORDEN || {}, TIPS = window.LK_ZOEKTIPS || {}, uit = [], gezien = {};
    var past = function (naam, extra) {
      var n = ' ' + vouw(naam).replace(/[^a-z0-9]+/g, ' ') + ' ' + (extra || '');
      return woorden.some(function (w) { return w.length >= 3 && (n.indexOf(' ' + w) !== -1 || (tikfout && n.split(' ').some(function (x) { return x.length >= 5 && lijkt(w, x); }))); });
    };
    var voeg = function (naam, naar, soort) { if (!gezien[naar]) { gezien[naar] = 1; uit.push({ naam: naam, naar: naar, soort: soort }); } };
    var PERS = window.LK_PERSONEN || [];
    /* a. subcategorie van een persoon: 'horloge' → Horloges voor hem / voor haar / voor tieners */
    PERS.forEach(function (pe) { (pe.subs || []).forEach(function (su) {
      var vakwoorden = su.vakken.map(function (v) { return (ZW[v] || '') + ' ' + (TIPS[v] || ''); }).join(' ');
      if (past(su.naam, vakwoorden)) voeg(su.naam + ' <small>' + esc(pe.naam.toLowerCase()) + '</small>', '/voor/' + pe.slug + '/' + su.slug, 'persoon');
    }); });
    /* b. de persoon zelf: 'oma' → Opa & oma, 'collega' → Collega's */
    PERS.forEach(function (pe) { if (past(pe.naam, pe.labels.join(' ') + ' ' + (ZW[pe.oud] || ''))) voeg(pe.naam, '/voor/' + pe.slug, 'persoon'); });
    /* c. gelegenheden en collecties */
    (window.LK_GELEGENHEDEN || []).forEach(function (g) { if (past(g.naam)) voeg(g.naam, g.naar || '/gelegenheid/' + g.slug, 'gelegenheid'); });
    (window.LK_COLLECTIES || []).forEach(function (g) { if (past(g.naam, g.zoek || 'naam gepersonaliseerd persoonlijk gegraveerd gravure')) voeg(g.naam, '/collectie/' + g.slug, 'collectie'); });
    /* d. productgroepen en hun subs (christelijk alleen bij echt christelijke woorden) */
    ALLECATS.forEach(function (c) {
      if (c.verborgen) return;
      var chr = c.slug === 'christelijk';
      /* Woorden van de groep: alleen uit de subs die er echt (nog) onder vallen, niet uit verborgen subs (horloges staan niet meer onder Mode). */
      var groepWoorden = (c.subs || []).filter(function (su) { return !su.verborgen && !su.naar; }).map(function (su) { var sl = su.vak || (c.slug + '/' + su.slug); return (ZW[sl] || '') + ' ' + (TIPS[sl] || ''); }).join(' ') + ' ' + (TIPS[c.slug] || '');
      if (chr ? past('', TIPS[c.slug]) : past(c.naam, groepWoorden)) voeg(c.naam, '/c/' + c.slug, 'groep');
      (c.subs || []).forEach(function (su) {
        if (su.naar || su.verborgen) return;
        var sl = su.vak || (c.slug + '/' + su.slug);
        if (chr ? past('', TIPS[sl]) : past(su.naam, (ZW[sl] || '') + ' ' + (TIPS[sl] || ''))) voeg(c.kort.indexOf(su.naam) === -1 ? su.naam + ' <small>' + esc(c.kort) + '</small>' : 'Alle ' + su.naam.toLowerCase(), '/c/' + c.slug + '/' + su.slug, 'groep');
      });
    });
    /* Past zowel de groep als een sub ervan (Sieraden & Horloges én Horloges), dan alleen de sub: die is preciezer. */
    uit = uit.filter(function (t) { return !(t.soort === 'groep' && t.naar.split('/').length === 3 && uit.some(function (x) { return x.naar.indexOf(t.naar + '/') === 0; })); });
    /* Persoonspagina's hebben alleen zin als er ook producten staan. */
    return uit.filter(function (t) {
      if (t.soort !== 'persoon') return true;
      var d = t.naar.split('/'), pe = window.LK_PERSOON(d[2]); if (!pe) return false;
      var su = d[3] ? (pe.subs || []).filter(function (x) { return x.slug === d[3]; })[0] : null;
      return persoonProducten(pe, su ? su.vakken : null).length > 0;
    }).slice(0, 8);
  }
  /* Zoekt in onze eigen producten. Eerst precies; vindt dat niets, dan met één tikfout per woord. */
  function zoekLijst(woorden, prijs) {
    var basis = LK.zichtbaar().filter(function (p) { return binnenPrijs(p, prijs); });
    var lijst = basis.filter(function (p) { var t = zoekTekstV(p); return woorden.every(function (w) { return bevatEen(t, w); }); });
    if (lijst.length < 3 && woorden.some(function (w) { return w.length >= 4; })) {
      var al = {}; lijst.forEach(function (p) { al[p.id] = 1; });
      lijst = lijst.concat(basis.filter(function (p) {
        if (al[p.id]) return false;
        var t = zoekTekstV(p), tw = null;
        return woorden.every(function (w) {
          if (bevatEen(t, w)) return true;
          if (w.length < 4 || w.indexOf('|') !== -1 || w.indexOf(' ') !== -1) return false;
          tw = tw || t.split(/[^a-z0-9]+/);
          return tw.some(function (x) { return lijkt(w, x); });
        });
      }));
    }
    /* Vangnet (5-11-2026): nog steeds niets? Dan liever iets wat erop lijkt dan een lege pagina.
       a. Meerdere woorden: producten die minstens één woord hebben (de beste bovenaan).
       b. Eén samengesteld woord ('kokmes', 'theeglas'): het laatste stuk ervan ('mes', 'glas'). */
    if (!lijst.length && woorden.length > 1) {
      lijst = basis.filter(function (p) { var t = zoekTekstV(p); return woorden.some(function (w) { return w.length >= 3 && bevatEen(t, w); }); });
      if (lijst.length) lijst.ruim = woorden.join(' ');
    }
    if (!lijst.length && woorden.length === 1 && woorden[0].indexOf('|') === -1 && woorden[0].length >= 6) {
      var w0 = woorden[0];
      for (var i = 2; i <= w0.length - 3 && !lijst.length; i++) {
        var staart = w0.slice(i);
        lijst = basis.filter(function (p) { return bevat(zoekTekstV(p), staart); });
        if (lijst.length) { lijst.ruim = staart; lijst.staart = staart; }
      }
    }
    return lijst;
  }
  /* Relevantie: een treffer in de titel telt het zwaarst, dan de categorie, en pas daarna de uitlegtekst.
     Zo komt bij 'fiets' eerst de fietstas en pas later de drop met 'fietsjes' in de tekst (wens van Marius).
     Een heel woord telt zwaarder dan een stukje: bij 'bal' eerst de ballen en pas later de balpen. */
  function zoekScore(p, woorden) {
    if (woorden.some(function (w) { return w.indexOf('|') !== -1 || w.indexOf(' ') !== -1; })) {
      return woorden.reduce(function (s, w) {
        return s + Math.max.apply(null, w.split('|').map(function (d, i) { var x = d.indexOf(' ') !== -1 ? (vouw(p.titel).indexOf(d) !== -1 ? 15 : 4) : zoekScore(p, [d]); return i ? x * 0.5 : x; })); /* het eerste woord gaat voor */
      }, 0);
    }
    var ti = ' ' + vouw(p.titel).replace(/[^a-z0-9]+/g, ' ') + ' ';
    var c = window.LK_CAT(p.cat), su = window.LK_SUB(c, p.sub);
    var ca = vouw((c ? c.naam : '') + ' ' + (su ? su.naam : ''));
    var b = zoekBoom(p), vk = ' ' + vouw(b.vak).replace(/[^a-z0-9]+/g, ' '), gr = ' ' + vouw(b.groep).replace(/[^a-z0-9]+/g, ' ');
    return woorden.reduce(function (s, w) {
      if (PERSW[w]) return s + ((p.voor || []).indexOf(PERSW[w]) !== -1 ? 12 : 0);
      /* Het vakje telt zwaar mee: bij 'darts' eerst de dartborden en pijlen, bij 'koptelefoon' eerst echte koptelefoons. */
      var bonus = vk.indexOf(' ' + w) !== -1 ? 12 : (gr.indexOf(' ' + w) !== -1 ? 6 : 0);
      s += bonus;
      if (new RegExp(' ' + w + '(en|s|len|letje|letjes|je|jes)? ').test(ti)) return s + 15;
      if (ti.indexOf(' ' + w) !== -1) return s + 10;
      if (ti.indexOf(w) !== -1) return s + 6;
      if (ca.indexOf(w) !== -1) return s + 4;
      /* Met een tikfout in de titel ('fiest' → fiets) telt het nog redelijk zwaar. */
      if (w.length >= 4 && ti.split(' ').some(function (x) { return lijkt(w, x); })) return s + 8;
      return s + 1;
    }, 0);
  }
  function zoeken(q) {
    var woorden = zoekWoorden(q.q || '');
    var lijst = zoekLijst(woorden, q.prijs), ruim = lijst.ruim;
    if (lijst.staart) woorden = [lijst.staart];
    var score = function (p) { return zoekScore(p, woorden); };
    if (woorden.length && (!q.sort || q.sort === 'aanbevolen' || q.sort === 'relevant')) {
      var sc = {}; lijst.forEach(function (p) { sc[p.id] = score(p); });
      var niveaus = {}; lijst.forEach(function (p) { (niveaus[sc[p.id]] = niveaus[sc[p.id]] || []).push(p); });
      lijst = Object.keys(niveaus).map(Number).sort(function (a, b) { return b - a; }).reduce(function (u, n) { return u.concat(sorteer(niveaus[n], q.sort)); }, []);
    } else lijst = sorteer(lijst, q.sort);
    var pf = prijsFilter(q.prijs);
    var titel = q.q ? 'Resultaten voor “' + q.q + '”' : (q.prijs && q.prijs !== 'alle' ? 'Cadeaus ' + pf.label.toLowerCase().replace('€50+', 'vanaf €50') : 'Alle cadeaus');
    zetTitel(q.q ? 'Zoeken: ' + q.q : titel);
    var catTips = paginaTips(woorden);
    return paginakop({ titel: titel, kruimel: [{ tekst: 'Zoeken' }] }) +
      '<div class="binnen">' +
        '<div style="margin-top:18px">' + zoekForm(q.q) + '</div>' +
        (catTips.length ? '<div class="bedoel-je"><h2>Bedoel je…</h2><div class="bedoel-knoppen">' + catTips.map(function (t) { return '<a class="bedoel' + (t.soort === 'persoon' ? ' persoon' : '') + '" href="' + t.naar + '">' + ic('rechts') + '<span>' + t.naam + '</span></a>'; }).join('') + '</div></div>' : '') +
        (ruim ? '<p class="zoek-ruim">We vonden niets precies voor “' + esc(q.q) + '”. Dit lijkt erop' + (lijst.staart ? ' (' + esc(lijst.staart) + ')' : '') + ':</p>' : '') +
        '<div class="werkbalk">' + prijsChips('/zoek', q) + '<span class="aantal">' + getal(lijst.length) + (lijst.length === 1 ? ' product' : ' producten') + '</span></div>' +
        filterPaneel('/zoek', q) +
        (q.q ? '<div class="sectie-kop" style="margin-top:6px"><div><h2>★ Door ons gekozen</h2></div></div>' : '') +
        gridMeer(lijst, leegBlok(q.q ? 'Nog niets uitgekozen voor dit woord' : 'Niets gevonden', q.q ? 'Kijk hieronder in het aanbod van onze winkels, of laat VONK zoeken.' : 'Probeer een ander woord, een ander budget, of laat VONK zoeken.',
          '<a class="knop knop-goud" href="/vonk">Probeer VONK</a>'), q.q ? 8 : 24) +
        (q.q ? '<section class="sectie alle-winkels" data-alle-winkels data-q="' + esc(q.q) + '" data-prijs="' + esc(q.prijs || 'alle') + '">' +
          '<div class="sectie-kop"><div><h2>Meer in onze winkels</h2><p class="uitleg">Alles wat onze partnerwinkels verkopen. Deze producten hebben wij niet zelf gekeurd.</p></div></div>' +
          '<div class="aw-inhoud"><p class="aw-laden">Even zoeken in alle winkels…</p></div>' +
          '<div class="aw-bol"><a class="knop knop-rand" href="' + esc(bolZoek(q.q)) + '" target="_blank" rel="sponsored nofollow noopener">Zoek ook op bol naar “' + esc(q.q) + '” ' + ic('pijl') + '</a></div>' +
        '</section>' : '') +
      '</div>';
  }

  /* 'Meer in onze winkels' onder een (sub)categorie. */
  function winkelSectie(cat, sub, prijs) {
    if (cat === 'christelijk') return '';
    var ZW = window.LK_ZOEKWOORDEN || {}, sleutel = sub ? cat + '/' + sub : cat;
    var attr = '';
    if (sleutel === 'cadeaus/voor-haar') attr = ' data-geslacht="v"';
    else if (sleutel === 'cadeaus/voor-hem') attr = ' data-geslacht="m"';
    else if (sleutel === 'cadeaus/onder-15') attr = ' data-max="15"';
    /* 2.1 (30-10-2026): elk vakje heeft een eigen, al gefilterd bestand (scripts/maak-zoekindex.py, zelfde regels als onze eigen
       producten). Geen zoekwoorden meer nodig; bestaat het bestand niet, dan verdwijnt het blok vanzelf. */
    var NW = window.LK_NIETWOORDEN || {};
    if (NW[sleutel]) attr += ' data-niet="' + esc(NW[sleutel]) + '"';
    return '<section class="sectie alle-winkels" data-alle-winkels data-sleutel="' + esc(sleutel) + '" data-prijs="' + esc(prijs || 'alle') + '"' + attr + '>' +
      '<p class="aw-brug">' + ic('omlaag') + 'Nog niet gevonden? Kijk hieronder verder</p>' +
      '<div class="sectie-kop"><div><h2>Meer in onze winkels</h2><p class="uitleg">Uit het hele aanbod van onze partnerwinkels. Deze producten hebben wij niet zelf gekeurd.</p></div></div>' +
      '<div class="aw-inhoud"><p class="aw-laden">Even kijken in alle winkels…</p></div></section>';
  }
  /* Zoekresultaten op bol.com via de bol-partnerlink van LeukeKeuze. */
  function bolZoek(q) {
    return 'https://partner.bol.com/click/click?t=url&s=1545784&f=txl&name=LeukeKeuze&url=' + encodeURIComponent('https://www.bol.com/nl/nl/s/?searchtext=' + encodeURIComponent(q));
  }
  /* ---------- Zoeken in het hele aanbod van alle winkels (feeds) ---------- */
  /* Per (sub)categorie staat er een klein bestand klaar (assets/zoek/w/<cat>--<sub>.json, gemaakt door scripts/maak-zoekindex.py),
     zodat een telefoon niet het hele bestand van alle winkels hoeft te laden. Alleen de zoekpagina gebruikt het hele bestand. */
  var AW = { laden: {} };
  /* Het hele bestand staat ingepakt (gzip, 06-11-2026: scheelt ~50 MB op de site). Begint het met de gzip-kenmerken 1f 8b,
     dan pakt de browser het zelf uit; heeft de server het al uitgepakt, dan lezen we het gewoon als tekst. */
  function pakUit(r) {
    return r.arrayBuffer().then(function (buf) {
      var b = new Uint8Array(buf);
      if (b.length > 1 && b[0] === 0x1f && b[1] === 0x8b) {
        if (typeof DecompressionStream === 'undefined') throw new Error('geen uitpakker');
        return new Response(new Blob([buf]).stream().pipeThrough(new DecompressionStream('gzip'))).json();
      }
      return JSON.parse(new TextDecoder('utf-8').decode(b));
    });
  }
  function laadWinkels(sleutel) {
    var pad = sleutel ? 'assets/zoek/w/' + sleutel.replace('/', '--') + '.json' : 'assets/zoek/alle.json.gz';
    if (!AW.laden[pad]) AW.laden[pad] = fetch(pad).then(function (r) { if (!r.ok) throw new Error(r.status); return sleutel ? r.json() : pakUit(r); }).then(function (j) {
      var W = j.winkels;
      /* Tijdens de Daisycon-pauze nooit Daisycon-links tonen (de index bevat dan alleen TradeTracker-winkels). */
      return j.producten.filter(function (x) { return !dcDirect(W[x[2]].link + x[3]); }).map(function (x) { var w = W[x[2]]; x[2] = w.naam; x[3] = w.link + x[3]; x[4] = w.foto + x[4]; return { t: x[0], p: x[1], w: x[2], l: x[3], f: x[4], z: ' ' + (x[0] + ' ' + x[5] + ' ' + x[6] + ' ' + x[2]).toLowerCase().replace(/[^a-z0-9à-ÿ€]+/g, ' '), tl: ' ' + x[0].toLowerCase().replace(/[^a-z0-9à-ÿ€]+/g, ' '), g: x[7] || '' }; });
    }).catch(function (e) { if (!sleutel && e && e.message === 'geen uitpakker') return 'oud'; return sleutel ? null : []; });
    return AW.laden[pad];
  }
  function vulAlleWinkels(sec) {
    var q = sec.getAttribute('data-q') || '', pf = prijsFilter(sec.getAttribute('data-prijs'));
    var woorden = q.toLowerCase().split(/\s+/).filter(Boolean).map(stam);
    var doel = $('.aw-inhoud', sec);
    laadWinkels(sec.getAttribute('data-sleutel') || '').then(function (alles) {
      if (!alles) { sec.remove(); return; }
      /* Oudere browser (bijv. iPhone van voor 2023) kan het ingepakte bestand niet uitpakken: dat zeggen we gewoon. */
      if (alles === 'oud') { doel.innerHTML = '<p class="uitleg">Zoeken in alle winkels werkt niet in deze oudere browser. Probeer het op een ander apparaat of in een nieuwere browser.</p>'; return; }
      var nietW = (sec.getAttribute('data-niet') || '').split(' ').filter(Boolean);
      var ofW = (sec.getAttribute('data-woorden') || '').split(' ').filter(Boolean), gesl = sec.getAttribute('data-geslacht') || '', maxP = +sec.getAttribute('data-max') || 0;
      function heeftWoord(x, w) { return w.length >= 5 ? x.z.indexOf(' ' + w) !== -1 : (x.z + ' ').indexOf(' ' + w + ' ') !== -1; }
      var hits = alles.filter(function (x) {
        if (x.p < pf.min || x.p > pf.max) return false;
        if (maxP && x.p >= maxP) return false;
        if (gesl && x.g !== gesl) return false;
        if (nietW.length && nietW.some(function (w) { return heeftWoord({ z: x.tl }, w); })) return false;
        if (ofW.length) return ofW.some(function (w) { return heeftWoord(x, w); });
        if (gesl || maxP) return true;
        return woorden.every(function (w) { return x.z.indexOf(' ' + w) !== -1; });
      });
      if (ofW.length) woorden = ofW;
      hits.forEach(function (x) {
        /* score: los woord in de titel telt het zwaarst, begin van een woord in de titel minder, elders het minst */
        x.s = woorden.reduce(function (s, w) {
          if ((x.tl + ' ').indexOf(' ' + w + ' ') !== -1) return s + 4;
          if (x.tl.indexOf(' ' + w) !== -1) return s + 2;
          return s + ((x.z + ' ').indexOf(' ' + w + ' ') !== -1 ? 1 : 0);
        }, 0);
      });
      if (!hits.length && !q) { sec.remove(); return; }
      var st = { winkel: 'alle', sort: 'relevant', toon: PER_KEER, prijs: 'alle' };
      /* 'Best passend': eerst de beste woord-treffers. Zijn die er niet (bv. bij Voor haar), dan een afwisselende mix
         van winkels en prijzen, zodat je niet alleen dure of alleen goedkope dingen ziet (wens van Marius). */
      function hashT(t) { var h = 0; for (var i = 0; i < t.length; i++) h = (h * 31 + t.charCodeAt(i)) | 0; return h; }
      function band(p) { return p < 15 ? 0 : p < 30 ? 1 : p < 60 ? 2 : p < 120 ? 3 : 4; }
      function bestPassend(lijst) {
        var groep = {}, sleutels = [];
        lijst.slice().sort(function (a, b) { return b.s - a.s || hashT(a.t) - hashT(b.t); }).forEach(function (x) {
          var k = x.s + '|' + x.w + '|' + band(x.p);
          if (!groep[k]) { groep[k] = []; sleutels.push(k); }
          groep[k].push(x);
        });
        /* per score-niveau om en om uit elke winkel/prijsgroep pakken */
        var niveaus = {}; sleutels.forEach(function (k) { var sc = +k.split('|')[0]; (niveaus[sc] = niveaus[sc] || []).push(k); });
        var uit = [];
        Object.keys(niveaus).map(Number).sort(function (a, b) { return b - a; }).forEach(function (sc) {
          var ks = niveaus[sc], rond = 0, bezig = true;
          while (bezig) { bezig = false; ks.forEach(function (k) { if (groep[k][rond]) { uit.push(groep[k][rond]); bezig = true; } }); rond++; }
        });
        return uit;
      }
      function teken() {
        var lp = prijsFilter(st.prijs);
        var l = hits.filter(function (x) { return (st.winkel === 'alle' || x.w === st.winkel) && x.p >= lp.min && x.p <= lp.max; }).slice();
        if (st.sort === 'prijs-op') l.sort(function (a, b) { return a.p - b.p; });
        else if (st.sort === 'prijs-af') l.sort(function (a, b) { return b.p - a.p; });
        else l = bestPassend(l);
        var per = {}; hits.forEach(function (x) { per[x.w] = (per[x.w] || 0) + 1; });
        var chips = '<div class="chips aw-winkels" role="group" aria-label="Winkel">' +
          [['alle', 'Alle winkels (' + hits.length + ')']].concat(Object.keys(per).sort(function (a, b) { return per[b] - per[a]; }).map(function (w) { return [w, w + ' (' + per[w] + ')']; }))
            .map(function (c) { return '<button class="chip" type="button" data-aw-winkel="' + esc(c[0]) + '" aria-pressed="' + (st.winkel === c[0]) + '">' + esc(c[1]) + '</button>'; }).join('') + '</div>';
        /* Prijsknoppen ook hier, zodat je snel in een prijsklasse kijkt (wens van Marius). */
        var prijsChips = pf.id && pf.id !== 'alle' ? '' : '<div class="chips aw-prijzen" role="group" aria-label="Budget">' + PRIJZEN.map(function (pr) {
          return '<button class="chip" type="button" data-aw-prijs="' + esc(pr.id) + '" aria-pressed="' + (st.prijs === pr.id) + '">' + esc(pr.label) + '</button>';
        }).join('') + '</div>';
        var sorteer = '<label class="sorteer"><span class="verborgen">Sorteren</span><select data-aw-sort>' +
          [['relevant', 'Best passend'], ['prijs-op', 'Prijs laag – hoog'], ['prijs-af', 'Prijs hoog – laag']].map(function (o) { return '<option value="' + o[0] + '"' + (st.sort === o[0] ? ' selected' : '') + '>' + o[1] + '</option>'; }).join('') +
          '</select>' + ic('omlaag') + '</label>';
        /* Geen maximum meer: steeds een stukje erbij met 'Toon meer', zodat je alles kunt zien. */
        var toon = l.slice(0, st.toon);
        var kaarten = toon.map(function (x) {
          return '<article class="prodkaart awkaart">' +
            '<a class="beeld echt" href="' + esc(x.l) + '" target="_blank" rel="sponsored nofollow noopener"><img src="' + esc(x.f) + '" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer" onerror="var k=this.closest(\'.awkaart\');if(k)k.style.display=\'none\'"></a>' +
            '<div class="info"><span class="shop">' + esc(x.w) + '</span><h3><a href="' + esc(x.l) + '" target="_blank" rel="sponsored nofollow noopener">' + esc(x.t) + '</a></h3>' +
            '<div class="prijs">' + LK.euro(x.p) + '</div></div></article>';
        }).join('');
        doel.innerHTML = !hits.length ? '<div class="leeg"><strong>Ook in onze winkels niets gevonden</strong>Probeer een ander of korter woord.</div>' :
          '<div class="werkbalk">' + chips + prijsChips + '<div class="werkbalk-onder"><span class="aantal">' + l.length + (l.length === 1 ? ' product' : ' producten') + '</span>' + sorteer + '</div></div>' +
          '<div class="prodgrid">' + kaarten + '</div>' +
          (l.length > toon.length ? '<div class="meer-knop"><button class="knop knop-rand" type="button" data-aw-meer>Toon meer <small>(' + toon.length + ' van ' + l.length + ')</small></button></div>' : '');
      }
      teken();
      sec.addEventListener('click', function (e) {
        if (e.target.closest('[data-aw-meer]')) { st.toon += 48; teken(); return; }
        var pb = e.target.closest('[data-aw-prijs]'); if (pb) { st.prijs = pb.getAttribute('data-aw-prijs'); st.toon = PER_KEER; teken(); return; }
        var b = e.target.closest('[data-aw-winkel]'); if (!b) return;
        st.winkel = b.getAttribute('data-aw-winkel'); st.toon = PER_KEER; teken();
      });
      sec.addEventListener('change', function (e) {
        if (e.target.matches('[data-aw-sort]')) { st.sort = e.target.value; st.toon = PER_KEER; teken(); }
      });
    }).catch(function () { doel.innerHTML = '<div class="leeg"><strong>Dit lukte even niet</strong>Probeer het later nog eens.</div>'; });
  }

  /* ---------- VONK ---------- */
  /* VONK 2.1 (01-11-2026, GO van Marius): 3 vragen, dan 6 VONK-keuzes met 'waarom', interesses als extra filter ná de uitslag,
     budget wordt NOOIT overschreden, 'Nog een keer toveren', geen herhalingen binnen een bezoek, korte fonkeling. */
  /* VONK-interesses (01-11-2026, Marius/Nova: moet echt bij de producten passen). Alleen het eigen vakje telt, niet 'ook in'.
     Zo geeft 'Koken' kookspullen en kookboeken, geen mokken of bakvormpjes. */
  var VONK_HOBBY = [
    { id: 'koken', label: 'Koken & bakken', vak: ['keuken/keukenapparaten', 'keuken/airfryers', 'keuken/pannen', 'keuken/messen-snijplanken', 'keuken/tosti-wafel-ijs', 'keuken/bakken', 'keuken/kaas-serveerplanken', 'keuken/gezellig-tafelen', 'boeken-media/kookboeken', 'tuin-klussen/bbq-buitenkoken', 'eten-drinken/bbq-sauzen'] },
    { id: 'koffie', label: 'Koffie & thee', vak: ['keuken/koffie-thee', 'eten-drinken/koffie-thee'] },
    { id: 'lekkers', label: 'Lekkers & snoep', vak: ['eten-drinken/chocolade', 'eten-drinken/drop-snoep', 'eten-drinken/koekjes-stroopwafels', 'eten-drinken/delicatessen', 'eten-drinken/kerst-cadeaupakketten', 'eten-drinken/sinterklaas-lekkers', 'eten-drinken/brievenbuscadeaus'] },
    { id: 'drankje', label: 'Een lekker drankje', vak: ['dranken'] },
    { id: 'verzorging', label: 'Verzorging & geuren', vak: ['geuren-verzorging'] },
    { id: 'sieraden', label: 'Sieraden & horloges', vak: ['sieraden'] },
    { id: 'mode', label: 'Mode & tassen', vak: ['mode-beauty'] },
    { id: 'techniek', label: 'Techniek & gadgets', vak: ['elektronica/telefoon-opladen', 'elektronica/cameras', 'elektronica/koptelefoons', 'elektronica/tablets-ereaders', 'elektronica/drones-vr', 'elektronica/gadgets-trackers', 'elektronica/speakers', 'elektronica/beamers', 'elektronica/sfeerlicht-smarthome', 'sieraden/smartwatches'] },
    { id: 'gamen', label: 'Gamen', vak: ['elektronica/gaming'] },
    { id: 'sport', label: 'Sport & buiten', vak: ['sport-outdoor', 'metaaldetectie'] },
    { id: 'lezen', label: 'Lezen', vak: ['boeken-media/thrillers-romans', 'boeken-media/leesplezier', 'boeken-media/strips-manga', 'boeken-media/luisterboeken', 'boeken-media/e-readers', 'boeken-media/puzzelboeken', 'boeken-media/kinderboeken', 'elektronica/tablets-ereaders'] },
    { id: 'muziek', label: 'Muziek & films', vak: ['boeken-media/muziek', 'boeken-media/films-series', 'elektronica/platenspelers', 'speelgoed/muziek-karaoke'] },
    { id: 'creatief', label: 'Knutselen & hobby', vak: ['hobby', 'speelgoed/knutselen-kleuren', 'boeken-media/kleurboeken'] },
    { id: 'wonen', label: 'Wonen & sfeer', vak: ['wonen/lampen', 'wonen/vloerkleden', 'wonen/wanddecoratie', 'wonen/klokken', 'wonen/vazen-bloemen', 'wonen/kussens-plaids', 'wonen/kaarsen', 'wonen/spiegels', 'wonen/opbergen-dienbladen', 'wonen/fotolijsten', 'wonen/huisgeuren', 'wonen/deurmatten'] },
    { id: 'tuin', label: 'Tuin & klussen', vak: ['tuin-klussen/buitenverlichting', 'tuin-klussen/elektrisch-gereedschap', 'tuin-klussen/handgereedschap-werkplaats', 'tuin-klussen/moestuin-kweken', 'tuin-klussen/planten-potten', 'tuin-klussen/regentonnen-slangen-compost', 'tuin-klussen/tuindecoratie', 'tuin-klussen/tuingereedschap', 'tuin-klussen/tuinmachines', 'tuin-klussen/tuinmeubelen', 'tuin-klussen/vogels-insecten', 'tuin-klussen/vuurschalen-terrasverwarmers'] },
    { id: 'spelen', label: 'Spellen & speelgoed', vak: ['speelgoed'] },
    { id: 'dieren', label: 'Dieren', vak: ['dieren'] },
    { id: 'christelijk', label: 'Christelijk', vak: ['christelijk'] }
  ];
  function vonkHobby(p, id) {
    var h = VONK_HOBBY.filter(function (x) { return x.id === id; })[0];
    if (!h) return true;
    var eigen = p.cat + '/' + p.sub;
    return h.vak.some(function (v) { return v === p.cat || v === eigen; });
  }
  /* Leeftijd van een kindercadeau: uit de gegevens, anders uit de titel ('vanaf 6 jaar', '3+', 'baby'), anders onbekend (null). */
  var VONK_LEEFTIJD = [{ id: '0-2', label: '0 tot 2 jaar', van: 0, tot: 2 }, { id: '3-5', label: '3 tot 5 jaar', van: 3, tot: 5 }, { id: '6-8', label: '6 tot 8 jaar', van: 6, tot: 8 }, { id: '9-12', label: '9 tot 12 jaar', van: 9, tot: 12 }];
  function kindLeeftijd(p) {
    if (p.leeftijd) return p.leeftijd;
    var t = (p.titel || '') + ' ' + (p.zoek || ''), m;
    if ((m = t.match(/(?:^|[^\d])(\d{1,2})\s*(?:-|tot|t\/m)\s*(\d{1,2})\s*jaar/i))) return [+m[1], +m[2]];
    if ((m = t.match(/(?:vanaf|v\.a\.)\s*(\d{1,2})\s*jaar|\b(\d{1,2})\s*\+(?!\s*\d)|\b(\d{1,2})\s*jaar\s*\+/i))) return [+(m[1] || m[2] || m[3]), 99];
    if (/\bpeuter|kraamcadeau|newborn|rammelaar|bijtring|knuffeldoek|speen|babyspeelgoed|\b0\s*\+/i.test(t) || p.sub === 'baby-kraam' || p.sub === 'baby-houten') return [0, 3];
    return null;
  }
  /* VONK fase 3 (01-11-2026): gewone taal -> keuzes. Geen AI, wel slimme woordlijsten. Werkt in de browser, kost niets.
     'iets voor mijn vader die van vissen houdt, max 40 euro' -> voor=hem, hobby=sport, wat=vissen, budget=tot40. */
  var VL_VOOR = [
    [/\b(opa|oma|grootvader|grootmoeder|opa en oma|grootouders|schoonouders)\b/, 'opa-oma'],
    [/\b(collega|collega's|baas|leidinggevende|manager|juf|meester|personeel|team)\b/, 'collega'],
    [/\b(tiener|puber|tieners|pubers)\b/, 'tiener'],
    [/\b(kind|kindje|kinderen|kids|zoon|zoontje|dochter|dochtertje|baby'?s?|babietje|dreumes|neefje|nichtje|kleinkind|kleinzoon|kleindochter|baby|peuter|kleuter|jongen|meisje|jongetje|meisje|petekind)\b/, 'kind'],
    [/\b(vader|papa|pa|man|vriend|broer|zwager|schoonvader|schoonzoon|oom|heer|mannen|echtgenoot|buurman|neef|voor hem)\b/, 'hem'],
    [/\b(moeder|mama|ma|vrouw|vriendin|zus|zusje|schoonzus|schoonmoeder|schoondochter|tante|dame|vrouwen|echtgenote|buurvrouw|nicht|oppas|voor haar)\b/, 'haar']
  ];
  var VL_MOMENT = [
    [/sinterklaas|\bsint\b|pakjesavond|schoencadeau|schoen zetten|surprise/, 'sinterklaas'],
    [/\bkerst/, 'kerst'],
    [/verjaardag|\bjarig|\bwordt \d{1,3}\b/, 'verjaardag'],
    [/\b(zomaar|bedankje|bedankt|dankjewel|opkikker|beterschap)\b/, 'zomaar']
  ];
  /* [woord, VONK-interesse, (optioneel) zoekwoord voor precieze treffers] */
  var VL_HOBBY = [
    [/\b(vis|vissen|visser|hengel|hengelen|karper)/, 'sport', 'vissen'], [/\bgolf/, 'sport', 'golf'], [/\bdart/, 'sport', 'darts'],
    [/\b(hardlo|rennen|runnen)/, 'sport', 'hardlopen'], [/\b(fiets|wielren|mountainbike)/, 'sport', 'fiets'], [/\b(wandel|hiken|hike)/, 'sport', 'wandel'],
    [/\b(kampeer|kamperen|camping)/, 'sport', 'kampe'], [/\bvoetbal/, 'sport', 'voetbal'], [/\byoga/, 'sport', 'yoga'], [/\b(fitness|sporten|sport|gym)/, 'sport'],
    [/\b(klim|boulder)/, 'sport', 'klim'], [/\b(schaats|ski|snowboard)/, 'sport'],
    [/\b(kook|koken|kookt|chef|bakken|bakt|keuken)/, 'koken'], [/\b(bbq|barbecue)/, 'koken', 'bbq'], [/\bkoffie/, 'koffie', 'koffie'], [/\bthee\b/, 'koffie', 'thee'],
    [/\b(snoep|chocola|drop|lekkers|zoetekauw)/, 'lekkers'],
    [/\bwhisk/, 'drankje', 'whisk'], [/\bwijn/, 'drankje', 'wijn'], [/\bbier/, 'drankje', 'bier'], [/\bgin\b/, 'drankje', 'gin'], [/\b(champagne|bubbels)/, 'drankje', 'champagne'], [/\b(drank|borrel|cocktail)/, 'drankje'],
    [/\b(parfum|geur|make-?up|verzorging|beauty|wellness|verwennen|skincare)/, 'verzorging'],
    [/\b(sieraad|sieraden|ketting|armband|ring|oorbel|horloge)/, 'sieraden'], [/\b(mode|kleding|tas|tassen|schoenen|sjaal)/, 'mode'],
    [/\b(gamen|gamer|gaming|gamet|game|playstation|xbox|nintendo|switch|ps5|games)/, 'gamen'],
    [/\b(tech|techniek|gadget|computer|elektronica|telefoon|muziek luisteren|koptelefoon)/, 'techniek'], [/\b(fotografie|camera)/, 'techniek', 'camera'],
    [/\b(lezen|leest|boek|boeken|lezer|lezeres)/, 'lezen'], [/\b(film|films|series)/, 'muziek', 'film'], [/\b(muziek|vinyl|lp|platenspeler)/, 'muziek'],
    [/\b(knutsel|tekenen|tekent|schilder|haken|breien|naaien|creatief|hobby)/, 'creatief'],
    [/\b(wonen|interieur|decoratie|kaarsen|planten)/, 'wonen'],
    [/\b(tuin|tuinier|moestuin|klussen|klusser|gereedschap)/, 'tuin'],
    [/\blego/, 'spelen', 'lego'], [/\bpuzzel/, 'spelen', 'puzzel'], [/\b(bordspel|gezelschapsspel)/, 'spelen', 'spel'], [/\b(speelgoed|spelen|spelletjes)/, 'spelen'],
    [/\b(hond)/, 'dieren', 'hond'], [/\b(kat|poes|katten)\b/, 'dieren', 'kat'], [/\b(paard|pony)/, 'dieren', 'paard'], [/\b(dier|dieren)/, 'dieren'],
    [/\b(christelijk|geloof|gelovig|bijbel|kerk)/, 'christelijk'],
    [/\b(metaaldetect|detector)/, 'sport', 'metaaldetect']
  ];
  function vonkLees(zin) {
    var t = ' ' + vouw(zin || '').replace(/[,.!?;:]/g, ' ') + ' ', q = {}, m;
    VL_VOOR.some(function (r) { if (r[0].test(t)) { q.voor = r[1]; return true; } return false; });
    VL_MOMENT.some(function (r) { if (r[0].test(t)) { q.moment = r[1]; return true; } return false; });
    /* Leeftijd: 'van 7', '7 jaar', 'wordt 10' */
    if ((m = t.match(/\b(\d{1,2})\s*(jaar|jarige|jr)\b|\bwordt (\d{1,2})\b|\bvan (\d{1,2})\b(?! ?(euro|eur))/))) {
      var jr = +(m[1] || m[3] || m[4]);
      if (jr <= 12 && (!q.voor || q.voor === 'kind')) { q.voor = 'kind'; q.leeftijd = jr <= 2 ? '0-2' : jr <= 5 ? '3-5' : jr <= 8 ? '6-8' : '9-12'; }
      else if (jr >= 13 && jr <= 17 && (!q.voor || q.voor === 'kind')) q.voor = 'tiener';
    }
    /* Budget: 'max 40 euro', 'tot €25', 'onder de 30', 'rond de 50', 'vanaf 100', '40 euro' */
    if ((m = t.match(/\b(vanaf|boven|meer dan)\s*(de\s*)?(€\s*|eur\s*)?(\d{1,4})/))) q.budget = 'vanaf' + m[4];
    else if ((m = t.match(/\b(max|maximaal|maximum|tot|onder|hooguit|niet meer dan|rond|ongeveer|zo'?n|budget|van)\s*(de\s*|een\s*|is\s*|van\s*)?(€\s*|eur\s*|euro\s*)?(\d{1,4})\s*(euro|eur|€|,-)?/)) && (/max|tot|onder|hooguit|niet meer|budget/.test(m[1]) || m[5] || m[3]))
      q.budget = 'tot' + (/rond|ongeveer|zo/.test(m[1]) ? Math.ceil(+m[4] * 1.15 / 5) * 5 : +m[4]);
    else if ((m = t.match(/(€\s*(\d{1,4})|(\d{1,4})\s*(euro|eur)\b)/))) q.budget = 'tot' + (m[2] || m[3]);
    var wat = [];
    VL_HOBBY.forEach(function (r) { if (r[0].test(t)) { if (!q.hobby) q.hobby = r[1]; if (r[2] && r[1] === q.hobby && wat.indexOf(r[2]) === -1) wat.push(r[2]); } });
    if (q.hobby === 'christelijk' && !q.voor) q.voor = 'iedereen';
    /* Jongen of meisje, opa of oma (01-11-2026): geen filter, wel een voorkeur in de volgorde (q.g). */
    if (/\b(jongen|jongetje|jongens|zoon|zoontje|neefje|kleinzoon|opa|grootvader|broer|broertje)\b/.test(t)) q.g = 'hem';
    else if (/\b(meisje|meisjes|dochter|dochtertje|nichtje|kleindochter|oma|grootmoeder|zus|zusje)\b/.test(t)) q.g = 'haar';
    if (q.voor === 'hem' || q.voor === 'haar') delete q.g;
    /* 'Iemand die alles heeft' / 'hoeft niks': dan iets origineels. */
    if (/alles heeft|heeft alles|hoeft niks|hoeft niets|wil niks|wil niets|niks nodig|niets nodig/.test(t)) q.soort = 'origineel';
    /* Baby/peuter/kleuter zegt al genoeg over de leeftijd. */
    if (q.voor === 'kind' && !q.leeftijd) { if (/\b(baby|babietje|dreumes|peuter|pasgeboren|kraam)/.test(t)) q.leeftijd = '0-2'; else if (/\bkleuter/.test(t)) q.leeftijd = '3-5'; }
    /* 'iets origineels', 'praktisch', 'luxe' of 'persoonlijk': die soort gaat voor. */
    if (/originee?l|uniek|apart|grappig|bijzonders?\b/.test(t)) q.soort = 'origineel';
    else if (/praktisch|handig|nuttig/.test(t)) q.soort = 'praktisch';
    else if (/luxe|chique|exclusief|duur/.test(t)) q.soort = 'luxe';
    else if (/persoonlijk|met naam|gegraveerd|eigen foto/.test(t)) q.soort = 'persoonlijk';
    /* Overige woorden die geen persoon, moment, budget of vulwoord zijn (bijv. 'stijltang', 'puzzel'): die zoeken we letterlijk. */
    var VUL = /^(iets|wat|een|de|het|voor|mijn|me|die|dat|van|houdt|houden|graag|leuk|leuke|leuks|mooi|mooie|mooie|cadeau|cadeaus|cadeautje|kado|zoek|zoeken|ik|wil|met|en|of|max|maximaal|maximum|tot|onder|euro|eur|rond|ongeveer|budget|jaar|jarige|is|gek|op|wordt|ze|hij|zij|hem|haar|er|nog|ook|heel|erg|lief|lieve|aan|te|om|in|bij|naar|kan|moet|geven|geef|kopen|best|beste|origineel|origineels|originele|praktisch|praktische|handig|handigs|handige|luxe|luxes|persoonlijk|persoonlijks|bijzonder|bijzonders|uniek|uniels|apart|grappig|grappigs|chique|exclusief|duur|dure|goedkoop|goedkope|vindt|vind|leuk|ideeen|idee|tip|tips|nodig|hebben|heeft|zo|n|zon|niet|meer|dan|vanaf|boven|hooguit|ze|zijn|haar|die|vind|geschikt|willen|iemand|alles|niks|niets|hoeft|wil)$/;
    var rest = t.split(/[^a-z0-9]+/).filter(function (w) {
      if (w.length < 4 || /^\d+$/.test(w) || VUL.test(w)) return false;
      var los = ' ' + w + ' ';
      return !VL_VOOR.some(function (r) { return r[0].test(los); }) && !VL_MOMENT.some(function (r) { return r[0].test(los); }) && !VL_HOBBY.some(function (r) { return r[0].test(los); });
    });
    rest.forEach(function (w) { if (wat.indexOf(w) === -1) wat.push(w); });
    if (wat.length) q.wat = wat.join(' ');
    q.voor = q.voor || 'iedereen'; q.moment = q.moment || 'iedereen'; q.budget = q.budget || 'geen';
    return q;
  }
  /* Wat VONK in dit bezoek al als 'keuze' liet zien (sessionStorage, mag stuk gaan). */
  function vonkGeheugen(lees) {
    try { if (lees === undefined) return JSON.parse(sessionStorage.getItem('lk-vonk') || '{}'); sessionStorage.setItem('lk-vonk', JSON.stringify(lees)); } catch (e) { return {}; }
  }
  /* Basislijst van VONK: alles wat binnen budget, leeftijd, interesse en getypt woord valt. Ook gebruikt om alternatieven te tellen. */
  function vonkBasis(q, lft, hobby) {
    var past = function (lijst, waarde) { return waarde === 'iedereen' || (lijst || []).indexOf(waarde) !== -1 || (lijst || []).indexOf('iedereen') !== -1; };
    var watW = q.wat ? zoekWoorden(q.wat) : [];
    /* Christelijk blijft een eigen afdeling: alleen als je die interesse zelf kiest, en dan alleen christelijke producten. */
    var alle = LK.zichtbaar().filter(function (p) { return hobby === 'christelijk' ? p.cat === 'christelijk' : nietChristelijk(p); }).filter(function (p) {
      return q.voor === 'iedereen' || hobby === 'dieren' || (watW.length && !hobby) || p.cat !== 'dieren'; /* 6-11: 'vader die vist' (hobby sport) geeft geen aquarium- of vogelspullen */
    }).filter(function (p) { return binnenPrijs(p, q.budget); });   /* budget is heilig */
    /* Getypt woord (bijv. 'lego' of 'vissen'): streng, alleen echte treffers (wens van Marius, 01-11-2026). */
    /* Nakijkbeurt 6-11-2026: eerst producten met álle woorden ('knuffel met naam' = knuffels met een naam), pas als dat niets geeft één woord. */
    if (watW.length) {
      var alleW = alle.filter(function (p) { var zt = zoekTekstV(p); return watW.every(function (w) { return bevatEen(zt, w); }); });
      alle = alleW.length ? alleW : alle.filter(function (p) { var zt = zoekTekstV(p); return watW.some(function (w) { return bevat(zt, w); }); });
    }
    if (lft) alle = alle.filter(function (p) { var a = kindLeeftijd(p); return a ? (a[0] <= lft.tot && a[1] >= lft.van) : lft.van >= 3; });
    var echt = function (p) { return (p.voor || []).indexOf(q.voor) !== -1 ? 0 : 1; };
    var pastVoor = function (p) { return q.voor === 'collega' ? echt(p) === 0 : past(p.voor, q.voor); };
    /* Met een getypt woord is dat woord leidend; de interesse filtert dan niet nog eens. */
    /* Bij een interesse horen geen afscheids-, pensioen- of juf/meester-cadeaus (die zijn voor een ander moment). */
    var hob = function (p) { return !hobby || watW.length > 0 || (vonkHobby(p, hobby) && !/afscheid|pensioen|\bjuf\b|meester|collega/i.test(p.titel || '')); };
    var lftZeker = function (p) { if (!lft) return true; var a = kindLeeftijd(p); return !!a && a[0] >= lft.van - 3; };
    return { past: past, alle: alle, watW: watW, echt: echt, pastVoor: pastVoor, hob: hob, lftZeker: lftZeker,
      aantal: function () { return alle.filter(function (p) { return hob(p) && (pastVoor(p) || (p.voor || []).indexOf('iedereen') !== -1); }).length; } };
  }
  function vonk(q) {
    zetTitel('VONK cadeauzoeker');
    var V = window.LK_VONK;
    var kind = q.voor === 'kind', lft = kind ? VONK_LEEFTIJD.filter(function (x) { return x.id === q.leeftijd; })[0] : null;
    var stap = !q.voor ? 1 : (kind && !lft) ? 1.5 : !q.moment ? 2 : !q.budget ? 3 : 4;
    var stappen = kind ? [1, 1.5, 2, 3] : [1, 2, 3];
    var balk = '<div class="vonk-stapjes" aria-hidden="true">' + stappen.map(function (n) { return '<span class="' + (n <= stap ? 'aan' : '') + '"></span>'; }).join('') + '</div>';
    var kop = paginakop({ titel: 'VONK', tekst: 'Beantwoord 3 vragen. VONK kiest direct passende cadeaus voor je.', kruimel: [{ tekst: 'VONK' }], klasse: 'vonk-kop' });
    var BUDGET = PRIJZEN.map(function (p) { return { id: p.id === 'alle' ? 'geen' : p.id, label: p.id === 'alle' ? 'Maakt niet uit' : p.label }; });
    var label = function (lijst, id) { var x = lijst.find(function (o) { return o.id === id; }); return x ? x.label : id; };

    function vraag(titel, opties, sleutel) {
      return '<div class="vonk-vraag"><h2>' + titel + '</h2><div class="keuzes">' + opties.map(function (o) {
        var nq = Object.assign({}, q); nq[sleutel] = o.id; delete nq.mix;
        return '<a class="keuze" href="' + maakAdres('/vonk', nq) + '" aria-pressed="' + (q[sleutel] === o.id) + '">' + esc(o.label) + '</a>';
      }).join('') + '</div></div>';
    }
    var terug = '';
    if (stap > 1 && stap < 4) {
      var tq = Object.assign({}, q); delete tq[stap === 1.5 ? 'voor' : stap === 2 ? (kind ? 'leeftijd' : 'voor') : 'moment'];
      terug = '<a class="vonk-terug" href="' + maakAdres('/vonk', tq) + '">' + ic('links') + 'Vorige vraag</a>';
    }

    var inhoud = '';
    if (stap === 1) inhoud = vraag('Voor wie zoek je iets?', V.voor, 'voor') +
      '<p class="vonk-tip">' + ic('zoek') + '<span>Liever typen? Gebruik de zoekbalk bovenaan, bijv. <em>vader die vist, max €40</em>.</span></p>';
    if (stap === 1.5) inhoud = vraag('Hoe oud is het kind?', VONK_LEEFTIJD, 'leeftijd');
    if (stap === 2) inhoud = vraag('Voor welk moment?', V.moment, 'moment');
    if (stap === 3) inhoud = vraag('Wat is je budget?', BUDGET, 'budget');

    if (stap === 4) {
      var hobby = VONK_HOBBY.some(function (x) { return x.id === q.hobby; }) ? q.hobby : '';
      var B = vonkBasis(q, lft, hobby), past = B.past, alle = B.alle, watW = B.watW, echt = B.echt, pastVoor = B.pastVoor, hob = B.hob, lftZeker = B.lftZeker;
      var watWeinig = watW.length ? (alle.length < 6 ? alle.length : -1) : undefined;
      /* 01-11-2026 (Nova/Marius): bij Sinterklaas geen kerstspullen en bij Kerst geen Sinterklaas-spullen. */
      var KERSTW = /kerst|christmas|xmas|rendier|kerstman|sneeuwpop|advent/i, SINTW = /sinterklaas|\bsint\b|\bpiet|pakjesavond|schoencadeau|chocoladeletter|kruidnoot|pepernoot|speculaas/i;
      var pastMom = function (p) {
        if (!past(p.moment, q.moment)) return false;
        if (q.moment === 'sinterklaas' && KERSTW.test(p.titel || '')) return false;
        if (q.moment === 'kerst' && SINTW.test(p.titel || '')) return false;
        return true;
      };
      var precies = alle.filter(function (p) { return hob(p) && pastVoor(p) && pastMom(p) && lftZeker(p); });
      /* Weinig treffers? Eerst 'voor iedereen' (zelfde moment), dan dezelfde persoon met een ander moment. Altijd binnen budget en interesse. */
      var ruimer = [], anders = [];
      if (precies.length < 12) {
        ruimer = alle.filter(function (p) { return precies.indexOf(p) === -1 && hob(p) && (p.voor || []).indexOf('iedereen') !== -1 && pastMom(p); });
        anders = alle.filter(function (p) { return precies.indexOf(p) === -1 && ruimer.indexOf(p) === -1 && hob(p) && pastVoor(p); });
      }
      var VOORKEUR = ['geuren-verzorging', 'sieraden', 'dranken', 'elektronica', 'mode-beauty', 'cadeaus', 'wonen', 'eten-drinken', 'keuken', 'speelgoed', 'boeken-media', 'sport-outdoor', 'hobby'];
      var spreid = function (lijst) {
        var groep = {}, volgorde = [];
        lijst.forEach(function (p) { var k = hobby ? p.cat + '/' + p.sub : p.cat; if (!groep[k]) { groep[k] = []; volgorde.push(k); } groep[k].push(p); });
        volgorde.sort(function (a, b) { var ia = VOORKEUR.indexOf(a), ib = VOORKEUR.indexOf(b); return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib); });
        if (q.mix) volgorde.sort(function (a, b) { return mixGetal(a + q.mix) - mixGetal(b + q.mix); });
        var uit = [], rond = 0, bezig = true;
        while (bezig) { bezig = false; volgorde.forEach(function (c) { if (groep[c][rond]) { uit.push(groep[c][rond]); bezig = true; } }); rond++; }
        return uit;
      };
      /* Punten (01-11-2026): hoe beter een cadeau past, hoe hoger het komt. Zoals grote cadeauzoekers het doen: budget is hard,
         de rest telt op. Echt voor deze persoon gekozen +3, past bij het moment +2, gevraagde soort +2, onze favoriet +2, populair +1,
         mooie sfeerfoto +1, past bij de hoogte van het budget +1 (geen cadeau van €3 bij 'tot €50'), nieuw +0,5. */
      var budMax = prijsFilter(q.budget).max, soortKeus = q.soort && q.soort !== 'geen' ? q.soort : '';
      var punten = function (p) {
        var n = 0;
        if (q.voor !== 'iedereen' && echt(p) === 0) n += 3;
        if (q.moment !== 'iedereen' && (p.moment || []).indexOf(q.moment) !== -1) n += 2;
        if (soortKeus && (p.soort || []).indexOf(soortKeus) !== -1) n += 2;
        if (p.favoriet) n += 2; if (p.populair) n += 1; if (p.sfeer) n += 1;
        if (isFinite(budMax) && budMax > 0 && p.prijs >= budMax * 0.35) n += 1;
        if (p.nieuw) n += 0.5;
        return n;
      };
      var schud = function (lijst) {
        var basis = q.mix ? lijst.slice().sort(function (a, b) { return mixGetal(a.id + q.mix) - mixGetal(b.id + q.mix); }) : sorteer(lijst);
        /* stabiel: eerst op punten, bij gelijke punten de volgorde van hierboven */
        return basis.map(function (p, i) { return [p, i, punten(p)]; }).sort(function (a, b) { return b[2] - a[2] || a[1] - b[1]; }).map(function (x) { return x[0]; });
      };
      var soortEerst = function (l) { if (!q.soort) return l; return l.filter(function (p) { return (p.soort || []).indexOf(q.soort) !== -1; }).concat(l.filter(function (p) { return (p.soort || []).indexOf(q.soort) === -1; })); };
      var groep = function (lijst) { return soortEerst(daisyconLaag(spreid(schud(lijst)))); };
      var alles = q.voor === 'iedereen' ? groep(precies).concat(groep(ruimer), groep(anders)) :
        groep(precies.filter(function (p) { return echt(p) === 0; })).concat(groep(precies.filter(function (p) { return echt(p) !== 0; })), groep(ruimer), groep(anders));

      /* Voorkeur in de volgorde (01-11-2026): bij 'meisje'/'oma' eerst wat niet duidelijk voor jongens/mannen is (en andersom),
         en bij kinderen zonder budget eerst cadeaus tot €80. Niets valt weg, het schuift alleen naar achteren. */
      var JONGENS = /\b(heren|mannen|jongens)\b|nerf|fortnite|monster jam|beyblade|hot wheels|ninjago|scheer|baard/i;
      var MEISJES = /\b(dames|vrouwen|meisjes)\b|barbie|gabby|\bk3\b|poppenhuis|eenhoorn|unicorn|hello kitty|make-?up|nagellak|rainbow high|\bl\.?o\.?l\b|bratz|polly pocket|oorbel/i;
      var straf = function (p) {
        var s = 0, v = p.voor || [], tt = p.titel || '';
        if (q.g === 'haar' && ((v.indexOf('hem') !== -1 && v.indexOf('haar') === -1) || JONGENS.test(tt))) s += 2;
        if (q.g === 'hem' && ((v.indexOf('haar') !== -1 && v.indexOf('hem') === -1) || MEISJES.test(tt))) s += 2;
        if ((kind || q.voor === 'tiener') && q.budget === 'geen' && p.prijs > 80) s += 1;
        /* Sinterklaas of Kerst gekozen: wat in dat feestvak staat (of het feest in de naam heeft) eerst. */
        if (feest && !LK.hoortBij(p, 'cadeaus', q.moment) && !(q.moment === 'kerst' ? KERSTW : SINTW).test(tt)) s += 1;
        return s;
      };
      var feest = q.moment === 'sinterklaas' || q.moment === 'kerst';
      if (q.g || kind || q.voor === 'tiener' || feest) alles = alles.map(function (p, i) { return [p, i, straf(p)]; }).sort(function (a, b) { return a[2] - b[2] || a[1] - b[1]; }).map(function (x) { return x[0]; });
      /* Getypt woord met weinig treffers (bijv. golf vanaf €100): die paar treffers altijd vooraan. */
      if (watW.length && typeof watWeinig === 'number' && watWeinig > 0) {
        var isRaak = function (p) { var zt = zoekTekstV(p); return watW.some(function (w) { return bevat(zt, w); }); };
        alles = alles.filter(isRaak).concat(alles.filter(function (p) { return !isRaak(p); }));
      }
      /* De 6 VONK-keuzes: liefst nog niet eerder getoond in dit bezoek. Zelfde vraag = zelfde 6 (ook na 'terug'). */
      var sleutel = [q.voor, q.leeftijd || '', q.moment, q.budget, hobby, q.wat || '', q.soort || '', q.mix || '', q.g || ''].join('|');
      var geh = vonkGeheugen(); geh.gezien = geh.gezien || []; geh.per = geh.per || {};
      var zes = (q.zes ? q.zes.split(',') : (geh.per[sleutel] || [])).map(function (id) { return alles.filter(function (p) { return p.id === id; })[0]; }).filter(Boolean);
      if (!q.zes && zes.length < Math.min(6, alles.length)) {
        /* Cadeaumixer (fase 2): 2 best passend, 2 origineel, 1 praktisch, 1 bijzonder (luxe of persoonlijk).
           We kiezen uit de best passende (eerste 80) en liefst iets dat in dit bezoek nog niet getoond is. Lukt een soort niet: gewoon de volgende beste. */
        var nieuw = alles.filter(function (p) { return geh.gezien.indexOf(p.id) === -1; });
        var bron = (nieuw.length >= 6 ? nieuw : alles).slice(0, 80);
        var heeft = function (p, s) { return (p.soort || []).indexOf(s) !== -1; };
        var VAKJES = [['best'], ['origineel'], ['praktisch'], ['best'], ['origineel'], ['luxe', 'persoonlijk']];
        zes = []; var gekozenSoort = {};
        /* Specifiek getypt woord met maar een paar treffers: die eerst, de mixer vult de rest. */
        if (watW.length && typeof watWeinig === 'number' && watWeinig > 0) zes = alles.slice(0, Math.min(watWeinig, 6));
        VAKJES.slice(zes.length).forEach(function (soorten) {
          var p = bron.filter(function (x) { return zes.indexOf(x) === -1 && (soorten[0] === 'best' || soorten.some(function (s) { return heeft(x, s); })); })[0];
          if (!p) p = bron.filter(function (x) { return zes.indexOf(x) === -1; })[0];
          if (p) { zes.push(p); if (soorten[0] !== 'best') gekozenSoort[p.id] = soorten.filter(function (s) { return heeft(p, s); })[0] || ''; }
        });
        if (zes.length < 6) zes = zes.concat(alles.filter(function (p) { return zes.indexOf(p) === -1; }).slice(0, 6 - zes.length));
        geh.soort = geh.soort || {}; zes.forEach(function (p) { if (gekozenSoort[p.id]) geh.soort[p.id] = gekozenSoort[p.id]; });
        geh.per[sleutel] = zes.map(function (p) { return p.id; });
        geh.gezien = geh.gezien.concat(geh.per[sleutel]).slice(-300);
        vonkGeheugen(geh);
      }
      var rest = alles.filter(function (p) { return zes.indexOf(p) === -1; });

      /* 'Waarom VONK dit kiest': alleen echte feiten uit onze eigen gegevens. */
      var bud = prijsFilter(q.budget);
      var vakNaam = function (p) {
        var c = window.LK_CAT(p.cat), sub = c && (c.subs || []).filter(function (x) { return (x.slug || x) === p.sub; })[0];
        return sub && sub.naam ? sub.naam : (c ? c.kort || c.naam : '');
      };
      var waarom = function (p) {
        var r = [], SOORTNAAM = { origineel: 'Origineel', praktisch: 'Praktisch', luxe: 'Iets bijzonders', persoonlijk: 'Persoonlijk' };
        var gs = (geh.soort || {})[p.id] || ['origineel', 'persoonlijk', 'luxe', 'praktisch'].filter(function (x) { return (p.soort || []).indexOf(x) !== -1; })[0] || '';
        if (gs && SOORTNAAM[gs]) r.push(SOORTNAAM[gs]);
        if (p.favoriet || p.populair) r.push('Onze favoriet');
        var ka = lft && kindLeeftijd(p); if (ka) r.push(ka[1] >= 99 ? 'Vanaf ' + ka[0] + ' jaar' : ka[0] + '–' + ka[1] + ' jaar');
        var vn = vakNaam(p); if (vn) r.push(vn);
        if (q.voor !== 'iedereen' && !ka && echt(p) === 0) r.push('Gekozen voor ' + label(V.voor, q.voor).toLowerCase());
        if (q.moment !== 'iedereen' && (p.moment || []).indexOf(q.moment) !== -1 && (vn || '').toLowerCase().indexOf(label(V.moment, q.moment).toLowerCase()) === -1) r.push('Leuk voor ' + label(V.moment, q.moment).toLowerCase());
        if (bud && bud.max && isFinite(bud.max)) r.push('Onder €' + bud.max);
        return r.slice(0, 3).join(' · ');
      };

      /* ---- Weergave (01-11-2026, compact voor telefoon): smalle balk met keuzes + 'Aanpassen'-paneel, cadeaus direct eronder. ---- */
      var adres = function (wijzigen) { var nq = Object.assign({}, q); delete nq.mix; delete nq.zes; Object.keys(wijzigen).forEach(function (k) { if (wijzigen[k] === null) delete nq[k]; else nq[k] = wijzigen[k]; }); return maakAdres('/vonk', nq); };
      var hijZij = q.voor === 'haar' ? 'zij' : q.voor === 'hem' ? 'hij' : 'hij of zij';
      /* Label in de balk: tik = paneel open; kruisje = deze keuze weg. */
      var label2 = function (tekst, weg) {
        return '<span class="vlabel"><button type="button" data-filter-open>' + esc(tekst) + '</button>' +
          (weg ? '<a class="vlabel-weg" href="' + weg + '" aria-label="' + esc(tekst) + ' weghalen">' + ic('sluit') + '</a>' : '') + '</span>';
      };
      var balkLabels =
        label2(q.voor === 'iedereen' ? 'Voor iedereen' : 'Voor ' + label(V.voor, q.voor).toLowerCase().replace(/^een /, '')) +
        (lft ? label2(lft.label, null) : '') +
        (q.wat ? label2('“' + q.wat + '”', adres({ wat: null, zin: null })) : '') +
        (hobby && !q.wat ? label2(label(VONK_HOBBY, hobby), adres({ hobby: null })) : '') +
        (q.moment !== 'iedereen' ? label2(label(V.moment, q.moment), adres({ moment: 'iedereen' })) : '') +
        (q.budget !== 'geen' ? label2(prijsFilter(q.budget).label, adres({ budget: 'geen' })) : '');
      var chipRij = function (opties, sl, huidig, extra) {
        return '<div class="chips filter-chips">' + opties.map(function (o) {
          var w = {}; w[sl] = huidig === o.id && sl === 'hobby' ? null : o.id; Object.assign(w, extra || {});
          return '<a class="chip" href="' + adres(w) + '" aria-pressed="' + (huidig === o.id) + '">' + esc(o.label) + '</a>';
        }).join('') + '</div>';
      };
      var eigenB = q.budget && !BUDGET.some(function (o) { return o.id === q.budget; }) ? [{ id: q.budget, label: prijsFilter(q.budget).label }] : [];
      var paneel = '<div class="filterpaneel vonk-paneel" data-filterpaneel hidden><button type="button" class="filter-achter" data-filter-dicht aria-label="Sluiten" tabindex="-1"></button>' +
        '<div class="filter-blad" role="dialog" aria-modal="true" aria-label="Keuzes aanpassen">' +
          '<div class="filter-kop"><strong>Aanpassen</strong><button type="button" class="filter-sluit" data-filter-dicht aria-label="Sluiten">' + ic('sluit') + '</button></div>' +
          '<h3>Voor wie</h3>' + chipRij(V.voor, 'voor', q.voor, { leeftijd: null }) +
          (q.voor === 'kind' ? '<h3>Leeftijd</h3>' + chipRij(VONK_LEEFTIJD, 'leeftijd', q.leeftijd) : '') +
          '<h3>Moment</h3>' + chipRij(V.moment, 'moment', q.moment) +
          '<h3>Budget</h3>' + chipRij(eigenB.concat(BUDGET), 'budget', q.budget) +
          '<h3>Waar houdt ' + hijZij + ' van?</h3>' + chipRij(VONK_HOBBY, 'hobby', q.wat ? '' : hobby, { wat: null, zin: null }) +
          '<div class="vonk-paneel-voet"><a class="knop knop-rand" href="/vonk">Opnieuw beginnen</a><button class="knop knop-goud" type="button" data-filter-dicht>Toon ' + alles.length + ' cadeaus</button></div>' +
        '</div></div>';
      /* Niets gevonden: eerlijk zeggen, en laten zien waar het wél zit (alleen opties die echt iets opleveren). */
      var tips = '', opties = [];
      if (!zes.length || (q.wat && alles.length < 6)) {
        var probeer = function (wijz, tekst) {
          var nq = Object.assign({}, q, wijz); Object.keys(wijz).forEach(function (k) { if (wijz[k] === null) delete nq[k]; });
          var nl = nq.voor === 'kind' ? VONK_LEEFTIJD.filter(function (x) { return x.id === nq.leeftijd; })[0] : null;
          var n = vonkBasis(nq, nl, VONK_HOBBY.some(function (x) { return x.id === nq.hobby; }) ? nq.hobby : '').aantal();
          if (n) opties.push('<a class="chip" href="' + adres(wijz) + '">' + esc(tekst) + ' <small>(' + n + ')</small></a>');
        };
        BUDGET.filter(function (o) { return o.id !== q.budget; }).forEach(function (o) { probeer({ budget: o.id }, o.id === 'geen' ? 'Elk budget' : o.label); });
        if (q.moment !== 'iedereen') probeer({ moment: 'iedereen' }, 'Elk moment');
        if (q.voor !== 'iedereen') probeer({ voor: 'iedereen', leeftijd: null }, 'Voor iedereen');
        if (hobby && !q.wat) probeer({ hobby: null }, 'Zonder ' + label(VONK_HOBBY, hobby).toLowerCase());
      }
      if (!zes.length) {
        tips = '<div class="vonk-leeg"><h2>Nog niets gevonden</h2><p>' + (q.wat ? 'Voor <strong>“' + esc(q.wat) + '”</strong> hebben we niets binnen deze keuzes.' : 'Binnen deze keuzes hebben we nog niets.') + '</p>' +
          (opties.length ? '<p>Hier vind je wel iets:</p><div class="chips">' + opties.join('') + '</div>' : '<a class="knop knop-goud" href="/vonk">Opnieuw beginnen</a>') + '</div>';
      }
      var mq = Object.assign({}, q); mq.mix = String((parseInt(q.mix, 10) || 0) + 1); delete mq.zes;
      /* Idee van Nova (01-11-2026): na de zes de vraag 'waar houdt hij/zij van?'. Alleen interesses die echt cadeaus opleveren. */
      var persoonlijker = '';
      /* 01-11-2026 22:55: op wens van Marius/Nova voorlopig UIT (te groot, resultaten pasten niet). Nieuwe compacte versie eerst op de testversie. */
      /* 'Nog persoonlijker' (01-11-2026, idee Nova; compact op wens van Marius): één regel met een keuzelijstje.
         Alleen interesses waar binnen deze keuzes minstens 6 cadeaus achter zitten. Kiezen = nieuwe zes, en naar boven. */
      if (zes.length && !q.wat) {
        var telH = function (id) { var B2 = vonkBasis(q, lft, id); return B2.alle.filter(function (p) { return B2.hob(p) && (B2.pastVoor(p) || (p.voor || []).indexOf('iedereen') !== -1); }).length; };
        var hobbies = VONK_HOBBY.filter(function (h) { return !(h.id === 'drankje' && (kind || q.voor === 'tiener')) && telH(h.id) >= 6; });
        if (hobbies.length) persoonlijker = '<div class="vonk-pers">' + ic('vonk') + '<label><span>Nog persoonlijker? Waar houdt ' + hijZij + ' van?</span>' +
          '<select data-vonk-hobby="' + esc(adres({ hobby: '__H__', wat: null, zin: null })) + '">' +
          '<option value="">' + (hobby ? 'Alle interesses' : 'Kies een interesse') + '</option>' +
          hobbies.map(function (h) { return '<option value="' + h.id + '"' + (h.id === hobby ? ' selected' : '') + '>' + esc(h.label) + '</option>'; }).join('') +
          '</select></label></div>';
      }
      /* Weinig cadeaus bij deze interesse? Eerlijk zeggen, niet aanvullen met iets anders. */
      var weinigH = hobby && !q.wat && alles.length < 6 ? '<p class="vonk-begreep">Bij <strong>' + esc(label(VONK_HOBBY, hobby)) + '</strong> vonden we binnen je keuzes ' + (alles.length === 1 ? '1 cadeau' : alles.length + ' cadeaus') + '. <a href="' + adres({ hobby: null }) + '">Interesse weghalen</a></p>' : '';
      inhoud = '<div class="vonk-uitslag">' +
        '<div class="vonk-balk"><div class="vonk-balk-labels">' + balkLabels + '</div>' +
          '<button class="vonk-aanpassen" type="button" data-filter-open>' + ic('filter') + ' Aanpassen</button></div>' +
        paneel +
        (zes.length ?
          '<h2 class="vonk-titel">VONK kiest deze ' + zes.length + ' voor jou</h2>' + weinigH +
          (q.wat && alles.length < 6 ? '<p class="vonk-begreep">Er zijn er maar ' + alles.length + ' met “' + esc(q.wat) + '” binnen je keuzes.' + (opties.length ? ' Meer vinden:' : '') + '</p>' + (opties.length ? '<div class="chips vonk-meer-tips">' + opties.join('') + '</div>' : '') : '') +
          '<div class="vonk-zes">' +
            '<div class="vonk-fonkel" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>' +
            zes.map(function (p) { var w = waarom(p); return '<div class="vonk-keus">' + LK.productKaart(p) + (w ? '<p class="vonk-waarom">' + ic('vonk') + '<span>' + esc(w) + '</span></p>' : '') + '</div>'; }).join('') +
          '</div>' +
          (alles.length > 6 ? '<div class="vonk-toover"><a class="knop knop-goud" href="' + maakAdres('/vonk', mq) + '">' + ic('vonk') + ' Nog een keer toveren</a>' : '<div class="vonk-toover">') +
            '<button class="knop knop-rand" type="button" data-vonk-deel="' + esc(maakAdres('/vonk', Object.assign({}, q, { mix: undefined, zes: zes.map(function (p) { return p.id; }).join(',') }))) + '">' + ic('deel') + ' Deel deze ' + zes.length + '</button></div>'
          : tips) +
        persoonlijker +
        (rest.length ? '<section class="sectie vonk-meer"><div class="sectie-kop"><div><h2>Meer passende cadeaus</h2></div><span class="vonk-noot"><strong>' + alles.length + '</strong> in totaal</span></div>' + gridMeer(rest, '', 12) + '</section>' : '') +
        '<p class="vonk-noot" style="margin-top:14px">VONK kijkt naar de kenmerken die wij bij elk product invullen. Je budget wordt nooit overschreden.</p>' +
        '</div>';
    }

    var icoon = '<div class="vonk-icoon" aria-hidden="true"><img src="/images/vonk/vonk-icoon.webp" alt="" width="96" height="96" decoding="async"></div>';
    return (stap === 4 ? '' : kop) + '<div class="binnen"><div class="vonk-pagina' + (stap === 4 ? ' vonk-pagina-uitslag" style="max-width:none' : '') + '">' + (stap < 4 ? icoon + balk : '') + inhoud + terug + '</div></div>';
  }



  /* ---------- Verlanglijstje (was: Favorieten) ----------
     Het hartje bewaart cadeaus op dit apparaat. Delen gaat via een link: /lijst/?n=<naam>&v=<gelegenheid>&p=<id>,<id>
     Geen account en geen opslag nodig; wie de link opent, klikt via onze partnerlinks door naar de winkel (wens Marius 28-10-2026). */
  var GELEGENHEDEN = [['verjaardag', 'mijn verjaardag', '🎂'], ['sinterklaas', 'Sinterklaas', '🎁'], ['kerst', 'kerst', '🎄'],
    ['valentijn', 'Valentijn', '❤️'], ['jubileum', 'ons jubileum', '💍'], ['zomaar', 'zomaar', '✨']];
  function gelegenheid(v) { return GELEGENHEDEN.find(function (g) { return g[0] === v; }) || null; }
  function lijstLink(naam, v, ids) {
    return 'https://leukekeuze.nl/lijst/?' + (naam ? 'n=' + encodeURIComponent(naam) + '&' : '') + (v ? 'v=' + v + '&' : '') + 'p=' + ids.join('.');
  }
  function favorieten() {
    zetTitel('Mijn lijstje');
    var ids = LK.favorieten();
    var lijst = LK.zichtbaar().filter(function (p) { return ids.indexOf(p.id) !== -1; });
    var naam = ''; try { naam = localStorage.getItem('lk-lijst-naam') || ''; } catch (e) {}
    var deel = !lijst.length ? '' :
      '<div class="lijst-deel"><div class="lijst-deel-tekst"><strong>Deel je verlanglijstje</strong>' +
      'Familie of vrienden zien jouw cadeaus en bestellen ze meteen.</div>' +
      '<div class="lijst-deel-velden"><label>Je naam<input type="text" data-lijst-naam maxlength="30" placeholder="Bijv. Sanne" value="' + esc(naam) + '"></label>' +
      '<label>Waarvoor?<select data-lijst-voor>' + GELEGENHEDEN.map(function (g) { return '<option value="' + g[0] + '">' + g[2] + ' ' + (g[0] === 'verjaardag' ? 'Mijn verjaardag' : g[0] === 'jubileum' ? 'Ons jubileum' : g[1].charAt(0).toUpperCase() + g[1].slice(1)) + '</option>'; }).join('') + '</select></label></div>' +
      '<div class="lijst-deel-knoppen"><button class="knop knop-whatsapp" type="button" data-lijst-whatsapp>' + ic('whatsapp') + ' Deel via WhatsApp</button>' +
      '<button class="knop knop-rand" type="button" data-lijst-kopieer>Kopieer de link</button></div></div>';
    return paginakop({ titel: 'Mijn lijstje', tekst: 'Bewaar cadeaus met het hartje en deel je lijstje met wie je wilt. Geen account nodig.', kruimel: [{ tekst: 'Lijstje' }], donker: true }) +
      '<div class="binnen"><section class="sectie">' +
      (lijst.length ? '<div class="sectie-kop"><div><h2>' + (lijst.length === 1 ? '1 cadeau' : lijst.length + ' cadeaus') + ' op je lijstje</h2></div></div>' : '') +
      grid(lijst, leegBlok('Je verlanglijstje is nog leeg', 'Tik op het hartje bij een cadeau om het op je verlanglijstje te zetten. Daarna kun je het lijstje delen via WhatsApp.', '<a class="knop knop-goud" href="/voor">Bekijk cadeaus</a>')) +
      '</section>' + (deel ? '<section class="sectie">' + deel + '</section>' : '') + '</div>';
  }
  /* Gedeeld verlanglijstje: dit ziet degene die de WhatsApp-link opent. Geen 'mijn lijstje', maar een warme cadeaupagina:
     kies het cadeau dat jij wilt geven (wens van Marius en Nova, 29-10-2026). */
  var LIJST_ZIN = { verjaardag: ['🎂', '{n} is binnenkort jarig!', 'Er is binnenkort iemand jarig!'], sinterklaas: ['🎁', 'Sinterklaas komt eraan!'], kerst: ['🎄', 'Kerst komt eraan!'],
    valentijn: ['❤️', 'Bijna Valentijn!'], jubileum: ['💍', 'Er is een jubileum te vieren!'], zomaar: ['✨', 'Zomaar, omdat het kan!'] };
  function cadeauKaart(p) {
    var link = p.url ? winkelLink(p) : '';
    return '<article class="cadeaukaart">' +
      '<a class="beeld' + (p.beeld ? ' echt' : '') + (p.sfeer ? ' sfeer' : '') + '" href="/p/' + esc(p.id) + '">' + LK.productBeeld(p) + '</a>' +
      '<div class="info"><span class="shop">' + esc(p.shop) + '</span>' +
        '<h3><a href="/p/' + esc(p.id) + '">' + esc(p.titel) + '</a></h3>' +
        '<div class="prijs">' + LK.euro(p.prijs) + '</div>' +
        (link ? '<a class="knop knop-goud geef" href="' + esc(link) + '" target="_blank" rel="sponsored nofollow noopener">🎁 Dit cadeau geven</a>'
              : '<span class="knop knop-goud geef uit" aria-disabled="true">🎁 Dit cadeau geven…</span>') +
      '</div></article>';
  }
  function gedeeldeLijst(q) {
    var ids = (q.p || '').split(/[.,]/).filter(Boolean).slice(0, 40);
    var lijst = ids.map(function (id) { return LK.vind(id); }).filter(function (p) { return p && p.status === 'goedgekeurd'; });
    var weg = ids.length - lijst.length;
    var naam = (q.n || '').slice(0, 30).trim(), g = gelegenheid(q.v), z = LIJST_ZIN[g ? g[0] : 'zomaar'] || LIJST_ZIN.zomaar;
    if (!window.LK_DETAILS) laadDetails(function () { if (location.pathname.indexOf('/lijst') === 0) toon(); });
    var titel = naam ? 'Het verlanglijstje van ' + naam : 'Een verlanglijstje voor jou';
    zetTitel(titel);
    var gelegenheidZin = z[0] + ' ' + (naam ? z[1].replace('{n}', naam) : (z[2] || z[1]).replace('{n} is', 'Er is iemand'));
    return '<section class="lijst-kop"><div class="binnen">' +
        '<span class="kicker">🎁 Een persoonlijk verlanglijstje</span>' +
        '<h1>' + esc(titel) + '</h1>' +
        '<p class="lijst-gelegenheid">' + esc(gelegenheidZin) + '</p>' +
        '<p>' + (naam ? 'Wil jij ' + esc(naam) + ' verrassen? ' + esc(naam) + ' heeft een paar cadeaus uitgezocht die heel welkom zijn.' : 'Wil jij iemand blij maken? Hier staan cadeaus die heel welkom zijn.') + '</p>' +
        '<p class="lijst-vraag">Welk cadeau geef jij? ' + (g && g[0] === 'valentijn' ? '❤️' : '💛') + '</p>' +
      '</div></section>' +
      '<div class="binnen"><section class="sectie">' +
        (lijst.length ? '<div class="sectie-kop"><div><h2>Kies een cadeau' + (naam ? ' voor ' + esc(naam) : '') + '</h2><p>Tik op <strong>Dit cadeau geven</strong> en bestel het direct bij de winkel.</p></div></div>' : '') +
        (weg > 0 ? '<p class="lijst-weg">' + (weg === 1 ? '1 cadeau van dit lijstje is' : weg + ' cadeaus van dit lijstje zijn') + ' niet meer te koop.</p>' : '') +
        (lijst.length ? '<div class="cadeaukaarten">' + lijst.map(cadeauKaart).join('') + '</div>'
          : leegBlok('Dit lijstje is leeg', 'De cadeaus van dit lijstje zijn niet meer te koop. Kijk gerust rond voor iets anders.', '<a class="knop knop-goud" href="/voor">Bekijk cadeaus</a>')) +
        '<div class="lijst-zelf"><strong>Zelf ook een verlanglijstje maken?</strong><p>Tik op het hartje bij de cadeaus die jij wilt en deel je lijstje via WhatsApp. Gratis, zonder account.</p><a class="knop knop-rand" href="/voor">Begin met kiezen</a></div>' +
      '</section></div>';
  }
  function lijstVanDeel() {
    var n = $('[data-lijst-naam]'), v = $('[data-lijst-voor]');
    var naam = n ? n.value.trim() : '', voor = v ? v.value : '';
    try { localStorage.setItem('lk-lijst-naam', naam); } catch (e) {}
    var ids = LK.favorieten().filter(function (id) { var p = LK.vind(id); return p && p.status === 'goedgekeurd'; });
    var g = gelegenheid(voor);
    var link = lijstLink(naam, voor, ids);
    var bericht = 'Mijn verlanglijstje' + (g ? ' voor ' + g[1] + ' ' + g[2] : '') + '\n👉 ' + link;
    return { link: link, bericht: bericht };
  }

  /* ---------- Tekstpagina's ---------- */
  var CONCEPT = '';
  var INFO = {
    'hoe-werkt-het': ['Hoe werkt LeukeKeuze?',
      '<p>LeukeKeuze is geen webwinkel. Wij zoeken mooie cadeaus en producten uit bij bekende winkels en zetten ze overzichtelijk bij elkaar.</p>' +
      '<h2>1. Wij kiezen met de hand</h2><p>Elk product wordt eerst door ons bekeken. Pas als we het goed vinden, komt het op de site.</p>' +
      '<h2>2. Jij zoekt op jouw manier</h2><p>Per categorie, per budget, met de zoekbalk of met VONK. Met het hartje bewaar je wat je leuk vindt.</p>' +
      '<h2>3. Je koopt bij de winkel</h2><p>Met de knop “Bekijk bij …” ga je naar de winkel. Daar bestel en betaal je. Bezorging, garantie en retour regel je met die winkel.</p>' +
      '<h2>Wat verdienen wij eraan?</h2><p>Koop je iets via onze link, dan krijgen wij soms een kleine vergoeding van de winkel. Jij betaalt daardoor niets extra.</p>'],
    'over-ons': ['Over LeukeKeuze',
      '<p>Hoi, ik ben Marius uit Dordrecht. Ik maak LeukeKeuze naast mijn werk in de keuken. Het idee is simpel: een cadeau zoeken kost vaak veel tijd. Je klikt door honderden webwinkels en weet aan het eind nog steeds niet wat je moet kiezen. LeukeKeuze moet dat makkelijker maken.</p>' +
      '<h2>Wat je hier vindt</h2><p>Op LeukeKeuze staan cadeaus en producten die ik met de hand heb uitgekozen. Ze zijn geordend op <a href="/c/cadeaus">voor wie</a>, op <a href="/c/cadeaus/onder-15">budget</a> en op onderwerp, van <a href="/c/christelijk">christelijke cadeaus</a> tot <a href="/c/metaaldetectie">metaaldetectie</a> (mijn eigen hobby). In de <a href="/gids">cadeaugidsen</a> zet ik per gelegenheid de beste ideeën op een rij, en met <a href="/vonk">VONK</a> vind je in een paar klikken iets passends.</p>' +
      '<h2>Hoe ik producten kies</h2><ul>' +
      '<li>Elk product bekijk ik eerst zelf: foto, prijs, omschrijving en de winkel.</li>' +
      '<li>Liever een goed product dan tien bijna dezelfde. Andere kleuren van hetzelfde product zet ik er niet allemaal op.</li>' +
      '<li>Ik let op een mix van goedkoop en duurder, zodat er voor elk budget iets is.</li>' +
      '<li>Bij elk product schrijf ik in gewone woorden waarom het een goed cadeau is.</li>' +
      '<li>Producten die niet meer leverbaar zijn of niet meer kloppen, haal ik weg.</li></ul>' +
      '<h2>Eerlijk over geld</h2><p>LeukeKeuze is geen webwinkel. Je koopt altijd bij de winkel zelf, zoals bol of een andere bekende webwinkel. Koop je iets via een link op deze site, dan krijg ik soms een kleine vergoeding van die winkel (via partnerprogramma’s zoals Daisycon en bol). Jij betaalt daardoor niets extra. Die vergoeding bepaalt niet welke producten erop komen: ik kies wat ik zelf een goed cadeau vind. Meer daarover lees je bij <a href="/info/hoe-werkt-het">Hoe werkt het?</a></p>' +
      '<h2>Contact</h2><p>Een tip, een fout gezien of een vraag? Mail naar <a href="mailto:leukekeuze.nl@gmail.com">leukekeuze.nl@gmail.com</a>. Mijn gegevens staan ook in het <a href="/info/colofon">colofon</a>.</p>' +
      '<h2 lang="en">About (English)</h2><p lang="en">LeukeKeuze is a Dutch gift-finder website run by Marius from Dordrecht, the Netherlands. Every product is hand-picked and described in plain Dutch. We do not sell anything ourselves; visitors buy directly from the shop. Some links are affiliate links (e.g. Daisycon, bol.com), which may earn us a small commission at no extra cost to the visitor.</p>' + CONCEPT],
    'contact': ['Contact',
      '<p>Vragen over een bestelling? Neem dan contact op met de winkel waar je het product hebt gekocht. Die regelt bezorging en retour.</p>' +
      '<p>Vragen of tips voor LeukeKeuze zelf? Mail ons op: <a href="mailto:leukekeuze.nl@gmail.com">leukekeuze.nl@gmail.com</a></p>' +
      '<p>Wie de site maakt en het adres vind je in het <a href="/info/colofon">colofon</a>.</p>' + CONCEPT],
    'colofon': ['Colofon (Imprint)',
      '<p>Deze website wordt gemaakt en beheerd door:</p>' +
      '<p><strong>LeukeKeuze</strong><br>Marius<br>Kromhout 108<br>3311 RH Dordrecht<br>Nederland</p>' +
      '<p>E-mail: <a href="mailto:leukekeuze.nl@gmail.com">leukekeuze.nl@gmail.com</a><br>Website: leukekeuze.nl</p>' +
            '<h2>Wat is LeukeKeuze?</h2><p>LeukeKeuze is een cadeausite. Wij verkopen zelf niets, maar raden producten aan van andere winkels. Sommige links zijn partnerlinks: koop je via zo’n link, dan krijgen wij soms een kleine vergoeding van de winkel. Jij betaalt daardoor niets extra.</p>' +
      '<p>Zie ook: <a href="/info/privacy">Privacy &amp; cookies</a>, <a href="/info/voorwaarden">Algemene voorwaarden</a> en <a href="/info/disclaimer">Disclaimer</a>.</p>' +
      /* Engelse samenvatting: partnernetwerken (zoals Daisycon) laten hun controle vaak door Engelstaligen doen. */
      '<h2 lang="en">Imprint (legal notice)</h2><div lang="en"><p>Website owner and person responsible for the content of leukekeuze.nl:</p>' +
      '<p><strong>Marius</strong> (trading as LeukeKeuze)<br>Kromhout 108<br>3311 RH Dordrecht<br>The Netherlands</p>' +
      '<p>E-mail: <a href="mailto:leukekeuze.nl@gmail.com">leukekeuze.nl@gmail.com</a></p>' +
      '<p>' +
      'Privacy Policy: <a href="/info/privacy">leukekeuze.nl/info/privacy</a>. General Terms and Conditions: <a href="/info/voorwaarden">leukekeuze.nl/info/voorwaarden</a>.</p></div>'],
    'privacy': ['Privacyverklaring (Privacy Policy)',
      '<p>Laatst bijgewerkt: 25 oktober 2026.</p>' +
      '<p>LeukeKeuze (Marius, zie het <a href="/info/colofon">colofon</a>) is verantwoordelijk voor deze website. In deze verklaring lees je welke gegevens er gebruikt worden als je de site bezoekt.</p>' +
      '<h2>Geen account, geen formulieren</h2><p>Je hoeft je nergens aan te melden. Wij vragen niet om je naam, e-mail of andere persoonlijke gegevens.</p>' +
      '<h2>Wat blijft er op je eigen apparaat?</h2><p>Bewaar je een product met het hartje, dan wordt dat alleen op je eigen apparaat opgeslagen (in de lokale opslag van je browser). Wij kunnen dat niet zien. Wis je je browsergegevens, dan is het weg. Deze site plaatst zelf geen tracking- of advertentiecookies.</p>' +
      '<h2>Hosting</h2><p>De website staat bij GitHub Pages (GitHub, Inc.). Bij elk bezoek ziet de server technische gegevens, zoals je IP-adres. GitHub gebruikt die om de site veilig en werkend te houden. Wij krijgen deze gegevens niet.</p>' +
      '<h2>Bezoekersstatistieken</h2><p>Om te zien hoeveel mensen de site bezoeken en welke pagina’s ze bekijken, gebruiken we GoatCounter. Dat werkt zonder cookies en zonder persoonlijke gegevens te bewaren: er wordt geen IP-adres opgeslagen en we zien niet wie je bent. We zien alleen aantallen, zoals welke pagina’s populair zijn, uit welk land bezoekers komen en via welke site ze binnenkwamen.</p>' +
      '<h2>Lettertypes</h2><p>De lettertypes staan op onze eigen site. Er wordt dus niets bij Google Fonts opgehaald.</p>' +
      '<h2>Partnerlinks en cookies van winkels</h2><p>Klik je op “Bekijk bij …”, dan ga je naar de winkel. Vaak loopt die link via een partnernetwerk, zoals Daisycon, TradeTracker, Awin, het bol partnerprogramma of het partnerprogramma van Amazon. Zij plaatsen dan een cookie om te zien dat je via LeukeKeuze kwam. Zo kan de winkel ons een kleine vergoeding geven als je iets koopt. Wij zien niet wie je bent of wat je koopt; alleen hoeveel er via onze links is verkocht. Op de site van de winkel gelden hun eigen privacyverklaring en cookies.</p>' +
      '<h2 lang="en">Privacy Policy (English summary)</h2><p lang="en">Controller: Marius (LeukeKeuze), Kromhout 108, 3311 RH Dordrecht, The Netherlands, leukekeuze.nl@gmail.com. ' +
      'We do not collect personal data: no accounts, no forms, no own tracking or advertising cookies. Favourites are stored only in your own browser. ' +
      'The site is hosted on GitHub Pages; fonts are served from our own site. Visitor statistics are collected with GoatCounter, without cookies and without storing personal data. Links to shops may run through affiliate networks (Daisycon, TradeTracker, Awin, bol.com, Amazon), which set their own cookies to register sales. ' +
      'Questions or requests about your data: e-mail us. You can also file a complaint with the Dutch Data Protection Authority (Autoriteit Persoonsgegevens).</p>' +
      '<h2>Je rechten</h2><p>Omdat wij zelf geen persoonsgegevens van je bewaren, is er meestal niets om in te zien of te wissen. Heb je toch een vraag over privacy? Mail naar <a href="mailto:leukekeuze.nl@gmail.com">leukekeuze.nl@gmail.com</a>. Je mag ook een klacht indienen bij de Autoriteit Persoonsgegevens.</p>'],
    'voorwaarden': ['Algemene voorwaarden (Terms and Conditions)',
      '<p>Laatst bijgewerkt: 23 oktober 2026.</p>' +
      '<p>Deze voorwaarden gelden voor het gebruik van leukekeuze.nl, een website van LeukeKeuze (Marius, zie het <a href="/info/colofon">colofon</a>).</p>' +
      '<h2>1. Wat LeukeKeuze doet</h2><p>LeukeKeuze is een cadeausite met tips en links naar producten van andere winkels. Wij verkopen zelf niets. Je sluit dus geen koop af met LeukeKeuze.</p>' +
      '<h2>2. Kopen doe je bij de winkel</h2><p>Bestel je iets via een link, dan koop je bij die winkel. Hun voorwaarden gelden voor bestelling, betaling, bezorging, garantie en retour. Met vragen daarover ga je naar de winkel.</p>' +
      '<h2>3. Prijzen en informatie</h2><p>We doen ons best om prijzen, foto’s en beschrijvingen juist te houden. Maar winkels passen prijzen en voorraad soms aan. De informatie op de site van de winkel is altijd leidend. Aan fouten op LeukeKeuze kun je geen rechten ontlenen.</p>' +
      '<h2>4. Partnerlinks</h2><p>Veel links zijn partnerlinks. Koop je via zo’n link, dan krijgen wij soms een kleine vergoeding van de winkel. Dat kost jou niets extra en verandert niets aan de prijs.</p>' +
      '<h2>5. Aansprakelijkheid</h2><p>LeukeKeuze is niet aansprakelijk voor producten, diensten of websites van andere winkels, en ook niet voor schade door het gebruik van deze site, behalve als de wet dat anders bepaalt.</p>' +
      '<h2>6. Teksten en foto’s</h2><p>De teksten op LeukeKeuze zijn van ons. Productfoto’s komen van de winkels en merken. Neem niets over zonder toestemming.</p>' +
      '<h2>7. Wijzigingen</h2><p>We kunnen deze voorwaarden aanpassen. De nieuwste versie staat altijd op deze pagina.</p>' +
      '<h2>8. Recht</h2><p>Op deze voorwaarden is Nederlands recht van toepassing. Vragen? Mail naar <a href="mailto:leukekeuze.nl@gmail.com">leukekeuze.nl@gmail.com</a>.</p>' +
      '<h2 lang="en">General Terms and Conditions (English summary)</h2><p lang="en">leukekeuze.nl is a gift-tip website run by Marius (LeukeKeuze), Kromhout 108, 3311 RH Dordrecht, The Netherlands. ' +
      'We do not sell products ourselves; purchases are made with the linked shops under their own terms. Prices and information may change; the shop’s information prevails. ' +
      'Many links are affiliate links: we may receive a commission, at no extra cost to you. We are not liable for products or websites of third parties, except where the law requires otherwise. Dutch law applies.</p>'],
    'disclaimer': ['Disclaimer',
      '<p>LeukeKeuze verkoopt zelf niets. We verwijzen naar producten van andere winkels.</p>' +
      '<p>We doen ons best om prijzen en informatie juist te houden, maar prijzen en voorraad kunnen veranderen. De informatie bij de winkel is altijd leidend.</p>' +
      '<p>Sommige links zijn partnerlinks: koop je via zo’n link, dan krijgen wij soms een kleine vergoeding. Dat heeft geen invloed op de prijs die jij betaalt.</p>' +
      '<p>Als Amazon-partner verdienen wij aan kwalificerende aankopen.</p>' + CONCEPT]
  };
  function info(slug) {
    slug = { imprint: 'colofon', impressum: 'colofon', 'privacy-policy': 'privacy', terms: 'voorwaarden', 'algemene-voorwaarden': 'voorwaarden', privacyverklaring: 'privacy' }[slug] || slug;
    var i = INFO[slug];
    if (!i) return nietGevonden();
    zetTitel(i[0]);
    return paginakop({ titel: i[0], kruimel: [{ tekst: i[0] }] }) + '<div class="binnen"><article class="tekstpagina">' + i[1] + '</article></div>';
  }

  /* ---------- Cadeaugidsen: eigen tekst met een paar gekozen producten per stukje ---------- */
  var GIDSEN = [
    { slug: 'schoencadeautjes', beeld: 'bol-9300000265640005', vakken: ['cadeaus/sinterklaas', 'cadeaus/sint-onder-15', 'cadeaus/voor-kinderen', 'speelgoed', 'speelgoed/knutselen-kleuren'],
      titel: 'Schoencadeautjes voor Sinterklaas: 15 leuke ideeën tot €10', kort: 'Kleine cadeautjes die in de schoen passen. Voor peuters, kleuters en grotere kinderen.',
      intro: 'Schoen zetten is voor kinderen misschien wel het leukste van de hele sinterklaastijd. Maar elke keer iets in die schoen leggen loopt snel op. Daarom zocht ik schoencadeautjes uit die klein en betaalbaar zijn, en waar kinderen toch echt mee spelen. Alles kost rond de 10 euro of minder en past in een gewone kinderschoen.',
      delen: [
        { kop: 'Tips voor schoencadeautjes', tekst: 'Een paar dingen die het makkelijker maken:',
          lijst: [
            'Spreek met jezelf een bedrag per schoen af, bijvoorbeeld 2 tot 5 euro. Dan houd je het betaalbaar.',
            'Niet elke keer een cadeautje: een mandarijn, een chocolademuntje of een tekening van Piet is ook leuk.',
            'Bewaar iets groters voor de laatste schoen, vlak voor pakjesavond.',
            'Kies dingen waar ze meteen mee aan de slag kunnen: bouwen, kleuren of een spelletje.',
            'Let bij kleine kinderen op losse onderdelen. Bij elk product staat vanaf welke leeftijd het is.'
          ] },
        { kop: 'Bouwen en spelen (tot €5)', tekst: 'Kleine bouwsetjes en figuurtjes. Snel klaar, en ze spelen er daarna nog lang mee.',
          ids: ['bol-9300000265640005', 'bol-9300000232471843', 'bol-9300000192994578'] },
        { kop: 'Knutselen en kleuren (€5 tot €7)', tekst: 'Voor kinderen die graag iets maken: armbandjes, kraskaarten en stickers.',
          ids: ['bol-9300000183264805', 'bol-9300000221675733', 'bol-9300000182484745', 'bol-9300000171163755'] },
        { kop: 'Voor de allerkleinsten', tekst: 'Zacht, veilig en makkelijk vast te pakken. Voor baby’s en peuters.',
          ids: ['bol-9300000109164502', 'bol-9300000191580808', 'bol-9300000320683306', 'bol-9300000187578608'] },
        { kop: 'Spelletjes en puzzels (tot €10)', tekst: 'Iets om samen te spelen, ook als de Sint weer weg is.',
          ids: ['bol-9200000132162995', 'bol-9300000035078697', 'bol-1004004013389248', 'bol-9300000181433977'] }
      ],
      slot: 'Meer kleine cadeautjes vind je bij <a href="/gids/sinterklaas-onder-10">Sinterklaascadeaus onder de €10</a> en <a href="/c/cadeaus/sint-onder-15">Sinterklaas onder €15</a>. Alles voor pakjesavond staat bij <a href="/c/cadeaus/sinterklaas">Sinterklaas</a>.' },
    { slug: 'sinterklaascadeau-man', beeld: 'bol-9300000238510035', vakken: ['cadeaus/sinterklaas', 'cadeaus/voor-hem', 'cadeaus/sint-onder-15', 'cadeaus/grappig'],
      titel: 'Sinterklaascadeau voor een man: 16 ideeën die hij écht gebruikt', kort: 'Voor je vriend, man, vader of broer. Van lootjes tot iets wat hij echt gebruikt.',
      intro: 'Een sinterklaascadeau voor een man is vaak lastig, want mannen zeggen meestal dat ze niets nodig hebben. Toch zijn ze blij met iets grappigs voor pakjesavond, iets lekkers voor zichzelf of een handig ding dat ze elke dag gebruiken. Ik zette 16 ideeën op een rij, van klein tot iets groter. Alles kost minder dan 30 euro, dus het past ook bij lootjes.',
      delen: [
        { kop: 'Voor in de schoen of de lootjes (tot €12)', tekst: 'Klein, maar wel iets waar hij wat aan heeft.',
          ids: ['bierch-0325fb0395', 'bol-9300000322634443', 'hema-a7c1cc7068', 'dvzn-912075'] },
        { kop: 'Grappig voor pakjesavond', tekst: 'Cadeaus waar iedereen om moet lachen. Leuk in een surprise.',
          ids: ['superz-f16bbf44cc', 'cg-useless-box', 'bol-9300000187227306', 'cg-chocolade-game-controller'] },
        { kop: 'Handig voor elke dag (€20 tot €27)', tekst: 'Voor de man die van praktisch houdt: koken, klussen of buiten zijn.',
          ids: ['bol-9200000002756942', 'bol-9300000238510035', 'hema-d2ace702bc', 'bol-9300000405787225'] },
        { kop: 'Spellen voor na het uitpakken', tekst: 'Zijn de pakjes open? Dan is een spel een mooie manier om de avond af te sluiten.',
          ids: ['bol-9300000179094379', 'bol-9300000173882144', 'bol-9200000099303512', 'kadov-23d3797d23'] }
      ],
      slot: 'Meer ideeën vind je bij <a href="/voor/hem">Cadeaus voor hem</a> en <a href="/gids/sinterklaas-voor-volwassenen">Sinterklaascadeaus voor volwassenen</a>. Maak je ook een surprise? Kijk dan bij <a href="/gids/surprise-maken">Surprise maken</a>.' },
    { slug: 'sinterklaascadeau-vrouw', beeld: 'bol-9300000044984873', vakken: ['cadeaus/sinterklaas', 'cadeaus/voor-haar', 'cadeaus/sint-onder-15', 'geuren-verzorging/cadeausets'],
      titel: 'Sinterklaascadeau voor een vrouw: 16 ideeën om haar te verwennen', kort: 'Voor je vriendin, vrouw, moeder of zus. Om te verwennen, voor in huis of om zelf iets te maken.',
      intro: 'Zoek je een sinterklaascadeau voor een vrouw? Dan kun je bijna altijd scoren met iets om even lekker tot rust te komen. Denk aan warme sokken, een fijne geur of een creatief project voor de winteravonden. Ik koos 16 cadeaus, allemaal onder de 30 euro. De meeste zijn ook geschikt voor de lootjes.',
      delen: [
        { kop: 'Voor in de schoen of de lootjes (tot €15)', tekst: 'Kleine cadeautjes die laten zien dat je aan haar dacht.',
          ids: ['hema-84afebb566', 'dk-00043546', 'bol-9300000239540734', 'lego-40524'] },
        { kop: 'Om jezelf te verwennen', tekst: 'Zacht, warm en lekker ruikend: helemaal goed voor de koude decemberavonden.',
          ids: ['bol-9300000188983674', 'bol-9300000044984873', 'lr-350322363000', 'bol-9300000291533838'] },
        { kop: 'Mooi voor in huis', tekst: 'Een geurkaars of een lief lampje maakt het meteen gezellig.',
          ids: ['dvzn-6934eb427b', 'bol-9300000224403531', 'bol-9300000124563618', 'dvzn-347250'] },
        { kop: 'Creatief en ontspannen', tekst: 'Voor de vrouw die graag iets met haar handen doet, of even helemaal uit wil schakelen.',
          ids: ['bol-9300000087608265', 'bol-9300000238015446', 'bol-9300000071174759', 'bol-9300000189482940'] }
      ],
      slot: 'Meer ideeën vind je bij <a href="/voor/haar">Cadeaus voor haar</a> en <a href="/gids/sinterklaas-voor-volwassenen">Sinterklaascadeaus voor volwassenen</a>. Maak je ook een surprise? Kijk dan bij <a href="/gids/surprise-maken">Surprise maken</a>.' },
    { slug: 'surprise-maken', beeld: 'bol-9300000226734832', vakken: ['cadeaus/sinterklaas', 'cadeaus/sint-onder-15', 'speelgoed/knutselen-kleuren', 'hobby/origami-scrapbooking'],
      titel: 'Surprise maken voor Sinterklaas: 25 ideeën, tips en wat je erin stopt', kort: 'Geen inspiratie voor je surprise? Hier vind je ideeën per persoon, een stappenplan en tips voor het gedicht.',
      intro: 'Lootjes getrokken en nu moet er een surprise komen? Een surprise is het leukste deel van pakjesavond: een zelfgemaakte verpakking die past bij de persoon, met een cadeautje erin en een gedicht erbij. Je hoeft er echt geen knutselkampioen voor te zijn. Met een doos, wat karton, een lijmpistool en verf kom je al heel ver. Hieronder vind je een simpel stappenplan, 25 ideeën per type persoon, tips voor het gedicht en de spullen die je nodig hebt.',
      delen: [
        { kop: 'Zo maak je een surprise in 6 stappen', tekst: 'Begin op tijd: reken op twee of drie avonden, want verf en papier-maché moeten drogen.',
          stappen: [
            'Bedenk een idee dat past bij de persoon: een hobby, een grappige gewoonte of iets wat er dit jaar gebeurde.',
            'Zoek een basis: een schoenendoos, een wc-rol, een plastic fles of een oude doos. Dozen van de supermarkt zijn gratis.',
            'Maak de vorm met karton, kranten en plakband. Voor ronde vormen werkt papier-maché of een ballon heel goed.',
            'Plak alles stevig vast met een lijmpistool. Dat gaat veel sneller dan gewone lijm.',
            'Verf of beplak je surprise. Met crêpepapier of verf en een paar details (ogen, letters, glitters) maak je hem af.',
            'Stop het cadeautje erin, verstop het eventueel goed, en plak het gedicht erop. Klaar!'
          ] },
        { kop: '25 surprise-ideeën per persoon', tekst: 'Pak een idee en maak het groot, gek of extra grappig. Hoe herkenbaarder voor de persoon, hoe leuker.',
          lijst: [
            'Voetballer: een voetbalschoen of een voetbalstadion met een doel',
            'Gamer: een grote controller of een Nintendo Switch van karton',
            'Kok of foodie: een pan met eieren, een pizza of een grote hamburger',
            'Koffieleut: een enorm koffiekopje of een koffiezetapparaat',
            'Tuinier: een gieter, een moestuinbak of een grote bloempot',
            'Reiziger: een koffer met stickers of een vliegtuig',
            'Dierenvriend: een hondenhok, een kattenmand of een aquarium',
            'Paardenmeisje: een paardenhoofd of een stal',
            'Muziekliefhebber: een gitaar, een koptelefoon of een radio',
            'Lezer: een groot boek met een bladwijzer',
            'Sporter: een halter, een dumbbell of een sporttas',
            'Telefoonverslaafde: een gigantische telefoon met een "laag batterij"-scherm',
            'Altijd te laat: een wekker of een kapotte klok',
            'Slaapkop: een bed met een kussen en een dekentje',
            'Snoeper: een snoepautomaat of een grote donut',
            'Schatzoeker: een schatkist of een metaaldetector',
            'Fietser: een fiets of een fietshelm',
            'Kampeerder: een tent of een kampvuur',
            'Fotograaf: een camera met een grote lens',
            'Opa of oma: een leunstoel, een breiwerk of een theepot',
            'Baby op komst: een kinderwagen of een rammelaar',
            'Verhuisd: een verhuisdoos of een huisje met hun nieuwe huisnummer',
            'Nieuwe baan: een bureau, een laptop of een stropdas',
            'Rijbewijs gehaald: een auto of een groot verkeersbord',
            'Weet je niets? Een grote chocoladeletter, een pepernotenzak of een mijter doet het altijd'
          ] },
        { kop: 'Spullen om je surprise te maken', tekst: 'Met deze spullen kun je bijna elke surprise maken. Een lijmpistool is echt een aanrader: alles zit in een paar seconden vast.',
          ids: ['bol-9300000226734832', 'bol-9300000146207567', 'bol-9200000052919661'] },
        { kop: 'Kleine cadeautjes voor in je surprise', tekst: 'Bij lootjes trekken spreek je vaak een bedrag af. Deze cadeautjes passen in bijna elke surprise en blijven onder de €15.',
          ids: ['bol-9300000171163755', 'bol-9300000138803498', 'cl-buki-graaf', 'bol-9300000345522498', 'bol-9300000017407527', 'bol-9300000240237143'] },
        { kop: 'Iets lekkers erbij', tekst: 'Een chocoladeletter of kruidnoten horen er gewoon bij. Leuk om in of naast je surprise te leggen.',
          ids: ['bol-9300000010371405', 'bol-9300000044730933', 'dk-00015052'] },
        { kop: 'Tips voor het gedicht', tekst: 'Het gedicht is minstens zo belangrijk als de surprise. Het mag plagen, maar houd het lief: iedereen moet erom kunnen lachen.',
          lijst: [
            'Begin klassiek: "Sinterklaas zat te denken wat hij [naam] dit jaar zou schenken…"',
            'Plaag met iets herkenbaars: een gewoonte, een grappig moment van dit jaar of een hobby.',
            'Houd het kort: 8 tot 16 regels is genoeg. Te lang wordt saai om voor te lezen.',
            'Laat het rijmen op het eind van elke twee regels (aa-bb). Zoek rijmwoorden op internet als je vastloopt.',
            'Laat het gedicht naar het cadeautje verwijzen, of geef een opdracht: "Zoek in de schoorsteen…".',
            'Onderteken met "Sint en Piet" en schrijf het gedicht met de computer of netjes met de hand.'
          ], ids: ['bol-9300000039602281'] }
      ],
      slot: 'Nog op zoek naar het cadeautje zelf? Kijk bij <a href="/c/cadeaus/sint-onder-15">Sinterklaascadeaus onder €15</a>, <a href="/c/cadeaus/sinterklaas">alles voor Sinterklaas</a> en in de gids <a href="/gids/sinterklaas-onder-15">Sinterklaascadeaus onder de €15</a>. Tip: begin een week van tevoren, dan heb je geen stress op 5 december.' },
    { slug: 'adventskalender-kiezen', beeld: 'bol-9300000408782128', vakken: ['cadeaus/kerst', 'eten-drinken/adventskalenders', 'eten-drinken/chocolade-snoep', 'wonen/kerstdecoratie'],
      titel: 'Adventskalender kopen: de leukste kalenders van 2026', kort: 'Chocolade, thee, popcorn of een kaars: 24 dagen aftellen naar Kerst. Van €7 tot €65.',
      intro: 'Vanaf 1 december elke dag een vakje openmaken: een adventskalender maakt van het wachten op Kerst een klein feestje. Vroeger zat er alleen een plaatje of een chocolaatje in, nu is er voor iedereen wat: thee voor je moeder, popcorn voor filmavonden, een puzzelverhaal dat je in 24 dagen oplost. Het is ook een heel dankbaar cadeau, want je geeft eigenlijk 24 cadeautjes tegelijk. Ik zette de leukste op een rij, van klein tot flink uitpakken. Eén tip vooraf: bestel vóór eind november, want op 1 december wil je beginnen en de populairste kalenders zijn dan op.',
      delen: [
        { kop: 'Waar let je op bij een adventskalender?', tekst: 'Een paar dingen om even te bekijken voordat je kiest:',
          lijst: [
            'Tel de vakjes: de meeste kalenders hebben 24 (tot kerstavond), sommige 25 vakjes (tot en met eerste kerstdag).',
            'Kijk wat erin zit: bij chocolade weet je het zeker, bij "verrassingskalenders" is de inhoud wel eens teleurstellend.',
            'Reken even uit wat je per vakje betaalt. Een kalender van €20 met 24 vakjes is nog geen euro per dag.',
            'Voor kinderen: kies iets zonder kleine onderdelen voor de allerkleinsten, en koop voor elk kind dezelfde soort, dat voorkomt ruzie.',
            'Bestel op tijd: een adventskalender die op 3 december binnenkomt, mist precies waar hij voor bedoeld is.'
          ] },
        { kop: 'De chocolade-klassiekers', tekst: 'Je kunt niet misgaan met chocolade. Dit zijn de bekende merken, van Tony’s tot Lindt.',
          ids: ['bol-9300000186028245', 'bol-9300000187297428', 'bol-9300000237632552', 'dw-7622210598837'] },
        { kop: 'Net even anders', tekst: 'Voor wie elk jaar al een chocoladekalender krijgt: jam, thee, popcorn, geurkaarsjes of een puzzelverhaal dat je in 24 dagen oplost.',
          ids: ['bol-9300000408782128', 'dw-680275066859', 'dw-4260611771720', 'wwk-2280887', '999g-999exi30'] },
        { kop: 'Voor kinderen', tekst: 'Elke ochtend een vakje voor het naar school gaan. Deze zijn gemaakt voor kleine handen.',
          ids: ['dw-8000500392065', 't2-handpoppen-bf7af21cea', 'amz-b0hmfl96b8'] }
      ],
      slot: 'Meer lekkers voor december vind je bij <a href="/c/eten-drinken">Eten &amp; drinken</a> en alle kerstspullen bij <a href="/c/cadeaus/kerst">Kerst</a>. Zoek je een kerstcadeau? Lees dan <a href="/gids/kerstcadeau-voor-haar">Kerstcadeau voor haar</a> of <a href="/gids/kerstcadeau-voor-hem">Kerstcadeau voor hem</a>.' },
    { slug: 'kerstcadeau-kind', beeld: 'hema-f9c9a4dbde', vakken: ['cadeaus/kerst', 'cadeaus/voor-kinderen', 'speelgoed', 'speelgoed/lego'],
      titel: 'Kerstcadeau voor een kind: de leukste ideeën per leeftijd', kort: 'Voor onder de boom: van DUPLO voor de kleintjes tot Pokémon en games. Van €16 tot €50.',
      intro: 'Een kerstcadeau voor een kind uitzoeken is leuk, maar ook lastig: je wilt iets geven waar het kind écht blij van wordt, en niet iets dat op tweede kerstdag alweer in de kast ligt. Het geheim zit in twee dingen: kies iets dat past bij de leeftijd, en kies iets waar het kind in de kerstvakantie meteen mee aan de slag kan. Twee weken vrij is namelijk de beste tijd van het jaar om te bouwen, te spelen en spelletjes te doen. Ik heb alles hieronder streng uitgezocht: geen troep, alleen cadeaus die het lang volhouden. En van elke prijs wat, van stapelbekers van 16 euro tot een game voor de Switch.',
      delen: [
        { kop: 'Zo kies je het goede cadeau', tekst: 'Vier dingen die helpen:',
          lijst: [
            'Vraag de ouders (of kijk stiekem op het verlanglijstje) waar het kind nú gek op is. Hypes wisselen snel.',
            'Kies iets om te dóén: bouwen, maken, spelen. Daar heeft een kind de hele kerstvakantie wat aan.',
            'Let op de leeftijd op de doos. Te moeilijk is frustrerend, te makkelijk is saai.',
            'Geef je een spel? Kies er een die het kind met opa, oma of het hele gezin kan spelen tijdens de kerstdagen.'
          ] },
        { kop: 'Voor de kleintjes (tot 4 jaar)', tekst: 'Stevig hout en DUPLO: hier kan een peuter niets aan kapot maken, en ze spelen er jaren mee.',
          ids: ['lego-10441', 'lego-10473', 'dk-00040677', 'cl-ld-stapelbekers'] },
        { kop: 'Bouwen en maken (5 tot 9 jaar)', tekst: 'Op deze leeftijd willen kinderen iets máken. Magnetische tegels, LEGO of een echte robot op zonne-energie.',
          ids: ['dgsw-ff4a82687a', 'hema-f9c9a4dbde', 't2-cadeau-nl-8189fb6f8b', 'dk-00025946'] },
        { kop: 'Spellen voor de kerstvakantie', tekst: 'Voor aan tafel tussen Kerst en Oud en Nieuw: snelle kaartspellen waar het hele gezin om moet lachen.',
          ids: ['999g-999kls01', '999g-999jak04', 'amz-b09vt565j8', 'cb-luigis-mansion3'] },
        { kop: 'Voor de fans', tekst: 'Pokémon, Mario en Toy Story: als je weet waar een kind fan van is, zit je altijd goed.',
          ids: ['nedgam-8468857b69', 'cl-pokemon-klok', 'superz-9a3d0a0bd5', 'supz-601c903233'] }
      ],
      slot: 'Veel meer staat bij <a href="/voor/kinderen">Cadeaus voor kinderen</a>. Wil je weten wat er nu hip is op het schoolplein? Lees <a href="/gids/hypes-2026">De hypes van 2026</a>. En bekroond speelgoed vind je in <a href="/gids/speelgoed-van-het-jaar-2026">Speelgoed van het Jaar 2026</a>.' },
    { slug: 'kerstcadeau-tiener', beeld: 'tt-dvzn-d0fc92f962', vakken: ['cadeaus/kerst', 'speelgoed/hypes-trends', 'elektronica/gaming', 'sieraden/kettingen'],
      titel: 'Kerstcadeau voor een tiener: ideeën die niet kinderachtig zijn', kort: 'Voor je zoon, dochter, neef of kleinkind van 12 tot 18. Van €15 tot €79.',
      intro: 'Tieners zijn misschien wel de lastigste groep om een kerstcadeau voor te vinden. Speelgoed is kinderachtig, maar voor een duur cadeau zoals een telefoon geef je ze liever geld. De truc: geef iets dat bij hún wereld past, dus muziek, gamen, hun eigen kamer of hun stijl. En let op merken, want die tellen op die leeftijd zwaar. Alles hieronder is door tieners zelf goedgekeurd: het zijn de dingen die ze nu echt gebruiken en op verlanglijstjes zetten. Twijfel je? Vraag stiekem even aan een vriend of vriendin wat er leeft.',
      delen: [
        { kop: 'Zo scoor je bij een tiener', tekst: 'Vier regels die het verschil maken:',
          lijst: [
            'Niet te kinderachtig: liever iets "volwassens" in een goedkopere uitvoering dan duur speelgoed.',
            'Het merk telt. Een onbekend merk oordopjes ligt in de la, een bekend merk wordt gebruikt.',
            'Iets voor hun eigen kamer werkt bijna altijd: een lamp, een poster, iets voor hun bureau.',
            'Echt geen idee? Vraag het hun vrienden, die weten het beter dan de ouders.'
          ] },
        { kop: 'Voor de gamer', tekst: 'Een goede controller, een nieuwe game of een lamp die de kamer meteen cooler maakt.',
          ids: ['joybuy-6a6fbf11cb', 'cb-sonic-racing', 't2-nedgame-4639e1bcd1', 'tt-dvzn-d0fc92f962'] },
        { kop: 'Muziek en filmpjes maken', tekst: 'Oordopjes van een echt audiomerk, karaoke voor op een feestje of een gimbal voor strakke video’s.',
          ids: ['tf-107003281', 'hema-1976c559e6', 'cb-osmo-mobile7', 'fiftie-c634bd1714'] },
        { kop: 'Voor haar: stijl en zelf maken', tekst: 'Een gouden kettinkje met haar beginletter, armbandjes maken met vriendinnen of een verwenpakket.',
          ids: ['pry-zh2x', 'boeken-b4ca80eae9', 'hema-33d8a73d1b', 'bol-9300000162839311'] },
        { kop: 'Handig (en stiekem cool)', tekst: 'Een dikke powerbank, een activity tracker of een LEGO-auto voor op de kamer: praktisch, maar wel leuk om te krijgen.',
          ids: ['jb-samsung-pb20k', 'cb-galaxy-fit3', 'lego-77241', 'dgsw-e7e3188ef3'] }
      ],
      slot: 'Meer ideeën staan bij <a href="/voor/tieners">Cadeaus voor tieners</a>. Wat er nu viraal gaat, lees je in <a href="/gids/hypes-2026">De hypes van 2026</a> en <a href="/gids/virale-cadeaus-2026">Virale cadeaus 2026</a>.' },
    { slug: 'noodpakket-checklist', beeld: 'bol-9300000184877600', vakken: ['noodpakket-survival', 'noodpakket-survival/noodpakketten', 'noodpakket-survival/noodradio', 'noodpakket-survival/water-eten', 'noodpakket-survival/licht-stroom', 'noodpakket-survival/ehbo-brand'],
      titel: 'Noodpakket samenstellen: de checklist voor 72 uur (en wat iedereen vergeet)', kort: 'Wat moet er in een noodpakket? De complete lijst, de dingen die mensen vaak vergeten en de spullen die het waard zijn.',
      intro: 'De overheid vraagt iedereen om zich voor te bereiden op een noodsituatie: een lange stroomstoring, geen internet of telefoon, of een overstroming. Het advies is om 72 uur, dus 3 dagen, zelf te kunnen redden. Dat klinkt groot, maar het is goed te doen. Ik zette alles op een rij: wat erin moet, wat mensen vaak vergeten en welke spullen echt het geld waard zijn. Je hoeft niet alles in één keer te kopen. Begin met de basis en vul het stap voor stap aan.',
      delen: [
        { kop: 'De checklist: dit hoort in je noodpakket', tekst: 'Dit is de basis voor de eerste 72 uur, gebaseerd op het advies van de overheid (Denk vooruit) en het Rode Kruis:',
          lijst: [
            'Drinkwater: 3 liter per persoon per dag, dus 9 liter per persoon voor 3 dagen.',
            'Eten dat lang goed blijft en dat je zonder koken kunt eten: blikken, noten, crackers, gedroogd fruit of noodrantsoen.',
            'Een radio op batterijen of een opwindradio, zodat je de rampenzender kunt horen als internet en telefoon het niet doen.',
            'Een zaklamp of hoofdlamp, met reservebatterijen.',
            'Een volle powerbank met de juiste kabel voor je telefoon.',
            'Een EHBO-set en de medicijnen die je elke dag nodig hebt.',
            'Dekens of nooddekens, en warme kleding.',
            'Contant geld: ongeveer 70 euro per volwassene en 30 euro per kind, in kleine briefjes en munten.',
            'Hygiënespullen: wc-papier, vochtige doekjes, handgel, tandenborstel en maandverband.',
            'Een fluitje, een multitool en reservesleutels van huis en auto.',
            'Kopieën van je belangrijke papieren (paspoort, verzekering) en een papieren lijst met telefoonnummers.',
            'Een stevige, waterdichte tas of rugzak om alles in te bewaren.'
          ] },
        { kop: '12 dingen die mensen vaak vergeten', tekst: 'Bijna iedereen denkt aan water en een zaklamp. Deze dingen worden het vaakst vergeten:',
          lijst: [
            'Contant geld. Als de stroom uitvalt, werkt pinnen niet.',
            'Telefoonnummers op papier. Wie kent zijn familie nog uit zijn hoofd?',
            'Een reservebril of lenzen.',
            'Eten en water voor je huisdier.',
            'Luiers, flesjes en babyvoeding.',
            'Een kabel die echt in je powerbank én je telefoon past.',
            'Batterijen in de goede maat (en niet in het apparaat bewaard, dan lopen ze leeg).',
            'Een blikopener, als je blikken eten hebt.',
            'Een plan voor de wc: vuilniszakken, plaszakken of een emmer met deksel.',
            'Iets om de tijd te doden: een kaartspel of een boek, zeker met kinderen.',
            'Een afspraak met je gezin: waar zien we elkaar als niemand bereikbaar is?',
            'Controle: twee keer per jaar kijken of alles nog werkt en niet over de datum is.'
          ] },
        { kop: 'Noodradio: de belangrijkste aankoop', tekst: 'Valt de stroom uit, dan doen internet en het mobiele netwerk het vaak ook niet lang meer. Via de radio hoor je dan wat je moet doen. Kies een noodradio die je kunt opwinden of opladen met een zonnepaneel. Veel modellen hebben ook een zaklamp en kunnen je telefoon een beetje opladen.',
          ids: ['bol-9300000184877600', 'prepz-46fa0db271', 'hema-ec5f8ec205', 'prepz-f826f694ec'] },
        { kop: 'Water en eten voor 3 dagen', tekst: 'Water is het allerbelangrijkst. Bewaar flessen water of lang houdbaar drinkwater, en zorg voor een filter voor als het water uit de kraan niet meer te vertrouwen is. Noodrantsoen is klein, licht en jarenlang houdbaar.',
          ids: ['prepz-5bc2e01a12', 'prepz-2b66e4c3ab', 'prepz-1b16ae0ca5', 'bushpa-2efabaca8b'] },
        { kop: 'Licht als het donker wordt', tekst: 'Een hoofdlamp is handiger dan een zaklamp: je hebt je handen vrij. Een lamp die je met zonlicht of een slinger kunt opladen, heeft geen batterijen nodig.',
          ids: ['prepz-5d203ca727', 'bushpa-abaaeb3d75', 'bol-9300000238510035', 'prepz-8fc77a0710'] },
        { kop: 'EHBO en warmte', tekst: 'Een goede EHBO-set hoort in elk huis, ook zonder noodsituatie. Een nooddeken weegt bijna niets en houdt je warm als de verwarming uitvalt.',
          ids: ['prepz-10e9686822', 'bushpa-3c0afae42b', 'bushpa-7298dda0ce', 'prepz-968ef4f95a'] },
        { kop: 'Kant-en-klaar noodpakket kopen of zelf samenstellen?', tekst: 'Een kant-en-klaar pakket is makkelijk: je hebt meteen een tas met de basis. Maar let op. Volgens de Consumentenbond en Kassa missen veel pakketten juist water, hygiënespullen en contant geld, en zitten er soms gadgets in die je nooit gebruikt. Sommige pakketten kosten honderden euro’s. Mijn advies: koop een eenvoudig basispakket of stel het zelf samen, en geef je geld vooral uit aan een goede noodradio, een waterfilter en een fijne hoofdlamp.',
          ids: ['prepz-f40f800553', 'dvzn-5d1532be4a', 'dvzn-456925', 'prepz-f9f677b298'] },
        { kop: 'Zo houd je je noodpakket op orde', tekst: 'Een noodpakket dat al jaren in de kast staat, werkt niet altijd meer. Doe dit twee keer per jaar, bijvoorbeeld als de klok verzet wordt:',
          stappen: [
            'Kijk naar de datum op het eten, het water en de medicijnen. Vervang wat bijna over de datum is.',
            'Laad de powerbank op en test de radio en de zaklamp.',
            'Kijk of de batterijen nog goed zijn.',
            'Pas het pakket aan als je gezin verandert: een baby, een huisdier, andere medicijnen.',
            'Spreek met je gezin nog eens af waar je elkaar ziet als je elkaar niet kunt bereiken.'
          ] },
        { kop: 'Pas op voor nep-acties', tekst: 'De overheid deelt geen gratis noodpakketten uit. Krijg je een mail, sms of WhatsApp-bericht over een gratis noodpakket waarvoor je moet klikken of betalen? Dan is het bijna zeker oplichting. Klik niet op de link.' }
      ],
      slot: 'Alle spullen staan bij <a href="/c/noodpakket-survival">Noodpakket &amp; survival</a>. Zoek je iets specifieks? Kijk bij <a href="/c/noodpakket-survival/noodradio">Noodradio’s</a>, <a href="/c/noodpakket-survival/water-eten">Water &amp; eten</a> of <a href="/c/noodpakket-survival/licht-stroom">Licht &amp; stroom</a>. Meer informatie vind je op denkvooruit.nl van de Rijksoverheid.' },
    { slug: 'sinterklaas-onder-10', beeld: 'bol-9300000157956217', vakken: ['cadeaus/sinterklaas', 'cadeaus/sint-onder-15', 'cadeaus/voor-kinderen', 'cadeaus/onder-15', 'speelgoed'], titel: 'Sinterklaascadeaus onder de €10: voor in de schoen en als klein pakje', kort: 'Kleine cadeautjes voor de schoen en pakjesavond, allemaal onder een tientje.',
      intro: 'Elke avond een schoen zetten, en dan ook nog pakjesavond: dat loopt snel op. Daarom koos ik cadeautjes onder de 10 euro waar kinderen echt blij van worden. Kleine setjes, boekjes en spelletjes, van merken die je kent.',
      delen: [
        { kop: 'Voor in de schoen', tekst: 'Klein genoeg om in een schoen te passen, en toch iets om mee te spelen.',
          ids: ['bol-9300000232471843', 'bol-9200000088621923', 'bol-9300000039278002'] },
        { kop: 'Zelf maken en ontdekken (€5 tot €10)', tekst: 'Knutselen en proefjes doen: daar zijn ze na pakjesavond nog dagen mee bezig.',
          ids: ['bol-9300000169748884', 'bol-9300000025044624', 'bol-9200000104835927', 'bol-9300000168680075'] },
        { kop: 'Boekjes en spelletjes (tot €10)', tekst: 'Een sinterklaasboekje om voor te lezen, of een spel om meteen samen te spelen.',
          ids: ['bol-9300000181968006', 'bol-9200000006380085', 'bol-9300000065878158', 'bol-9300000157956217'] }
      ],
      slot: 'Meer kleine cadeautjes staan bij <a href="/c/cadeaus/sint-onder-15">Sinterklaas onder €15</a>. Alles voor pakjesavond vind je bij <a href="/c/cadeaus/sinterklaas">Sinterklaas</a>.' },
    { slug: 'speelgoed-van-het-jaar-2026', beeld: 'bol-9300000246863962', vakken: ['speelgoed', 'speelgoed/bord-kaartspellen', 'speelgoed/lego', 'speelgoed/autos-treinen-rc', 'speelgoed/baby-houten', 'cadeaus/voor-kinderen', 'cadeaus/sinterklaas'],
      titel: 'Speelgoed van het Jaar 2026: de winnaars op een rij', kort: 'Bekroond speelgoed en spellen, gekozen door een vakjury en door heel Nederland.',
      intro: 'Elk jaar kiest een vakjury het beste speelgoed van Nederland, en daarna stemt heel Nederland mee voor de publieksprijs. Zo’n winnaar is een veilige keuze: getest, leuk om mee te spelen en vaak een echte hit. Hier staan de winnaars van 2026 die je bij ons vindt, op een rij per soort.',
      delen: [
        { kop: 'Spellen voor het hele gezin', tekst: 'Snelle kaartspellen en spannende bordspellen voor aan tafel. Swapybara en Vogelvrij wonnen ook de publieksprijs.',
          ids: ['bol-9300000262897603', 'bol-9300000256918140', 'bol-9300000246863962', 'bol-9300000277694649'] },
        { kop: 'Leren met plezier', tekst: 'Rekenen, tekenen, stroom en je eigen lichaam: zo leren kinderen zonder dat het voelt als school.',
          ids: ['bol-9300000257685097', 'bol-9300000229236515', 'bol-9300000240660521', 'bol-9300000272107345'] },
        { kop: 'Bouwen en puzzelen', tekst: 'Van DUPLO voor peuters tot de LEGO Tintin-raket, die ook een prachtig cadeau is voor volwassen fans.',
          ids: ['bol-9300000266727635', 'bol-9300000237345459', 'lego-21367', 'bol-9300000258403542'] },
        { kop: 'Spelen en knuffelen', tekst: 'Een knuffel die terugpraat, een pop die uit een zaadje groeit, een babypop die echt drinkt en een zeemeermin die bellen blaast.',
          ids: ['bol-9300000261530245', 'bol-9300000269708157', 'bol-9300000267785127', 'bol-9300000244057642'] }
      ],
      slot: 'Meer speelgoed vind je bij <a href="/c/speelgoed">Speelgoed & Spellen</a> en <a href="/voor/kinderen">Cadeaus voor kinderen</a>. Tip: populaire winnaars zijn rond Sinterklaas vaak snel uitverkocht, dus wacht niet te lang.' },
    { slug: 'sinterklaas-voor-volwassenen', beeld: 'cl-jvh-sint', vakken: ['cadeaus/sinterklaas', 'cadeaus/sint-onder-15', 'cadeaus/onder-15', 'eten-drinken/chocolade'], titel: 'Sinterklaascadeaus voor volwassenen: lootjes, surprises en lekkers', kort: 'Ideeën voor als je lootjes trekt met familie, vrienden of collega’s.',
      intro: 'Sinterklaas is niet alleen voor kinderen. Veel families en vriendengroepen trekken lootjes, vaak met een vast bedrag van 10 of 15 euro. Dit zijn cadeaus die het goed doen bij volwassenen: iets om te spelen, iets lekkers, of iets dat je echt gebruikt.',
      delen: [
        { kop: 'Voor de lootjes (rond €15)', tekst: 'Een spel voor na het uitpakken, een grote mok, of een puzzel van de intocht.',
          ids: ['bol-9300000192994012', 'bol-9300000345522494', 'cl-jvh-sint', 'bol-1004004005951228'] },
        { kop: 'Lekkers van de Sint', tekst: 'Kruidnoten en chocolade, maar dan net even anders dan uit de supermarkt.',
          ids: ['bol-9300000161275021', 'dw-8710482926362', 'bol-9300000243180019', 'dw-4000161470748'] },
        { kop: 'Iets groters (€20 tot €40)', tekst: 'Als je iets meer mag uitgeven: cadeaus die lang meegaan.',
          ids: ['bol-9200000091821418', 'bol-9200000016853146', 'bol-9300000343902998', 'bol-9300000005044757'] }
      ],
      slot: 'Alle sinterklaascadeaus vind je bij <a href="/c/cadeaus/sinterklaas">Sinterklaas</a>. Zoek je iets voor een kind? Kijk dan bij <a href="/gids/sinterklaas-onder-10">Sinterklaascadeaus onder de €10</a>.' },
    { slug: 'kerstcadeau-onder-25', beeld: 'bol-9300000238623285', vakken: ['cadeaus/kerst', 'cadeaus/onder-15', 'eten-drinken', 'wonen/kerst'], titel: 'Kerstcadeaus onder de €25', kort: 'Mooie cadeaus voor onder de boom die niet veel kosten. Van €10 tot €24.',
      intro: 'Met Kerst geef je vaak aan meer mensen tegelijk. Dan is het fijn als een cadeau niet te duur is, maar wel echt leuk om te krijgen. Deze cadeaus kosten allemaal minder dan 25 euro.',
      delen: [
        { kop: 'Lekkers voor onder de boom', tekst: 'Koffie, thee en chocolade in een mooie verpakking. Altijd goed, voor iedereen.',
          ids: ['bol-9300000240085621', 'bol-9300000008252018', 'bol-9300000383269797', 'bol-9300000241393562'] },
        { kop: 'Gezellig in huis', tekst: 'Lichtjes, een kandelaar of kerstbekers: cadeaus waar je de hele decembermaand wat aan hebt.',
          ids: ['bol-9300000229498501', 'kl-57357716193604', 'bol-9300000182787559', 'bol-9300000238623285'] },
        { kop: 'Samen aan tafel', tekst: 'Een puzzel of spel voor de dagen tussen Kerst en Oud en Nieuw.',
          ids: ['bol-9300000172981367', 'bol-9300000133136276', 'bol-9300000174665071', 'bol-9300000375928006'] }
      ],
      slot: 'Meer goedkope cadeaus vind je bij <a href="/c/cadeaus/onder-15">Cadeaus onder €15</a>. Alle kerstcadeaus staan bij <a href="/c/cadeaus/kerst">Kerst</a>.' },
    { slug: 'kerstcadeau-voor-haar', beeld: 'cl-instax12', vakken: ['cadeaus/kerst', 'cadeaus/voor-haar', 'mode-beauty', 'geuren-verzorging/parfum', 'geuren-verzorging/huidverzorging'], titel: 'Kerstcadeau voor haar: van klein verwenmoment tot luxe', kort: 'Voor je vrouw, vriendin, moeder of zus. Van €17 tot €98.',
      intro: 'Een kerstcadeau voor haar hoeft niet ingewikkeld te zijn. Iets om jezelf mee te verwennen, iets lekkers bij de thee, of iets moois voor in huis. Ik zette cadeaus in drie prijsklassen op een rij, zodat je snel iets vindt dat bij je budget past.',
      delen: [
        { kop: 'Tot €25', tekst: 'Klein, maar met aandacht gekozen.',
          ids: ['bol-9300000159912462', 'bol-9300000225710092', 'bol-9300000319966796', 'bol-9300000168710886'] },
        { kop: '€25 tot €60', tekst: 'Cadeausets en mooie dingen voor in huis.',
          ids: ['bol-9300000237452859', 'bol-9300000253909209', 'bol-9300000162839311', 'bol-9300000247719933'] },
        { kop: 'Luxe (vanaf €60)', tekst: 'Voor als je echt wilt uitpakken.',
          ids: ['bol-9300000331215829', 'cl-instax12', 'bol-9200000132246044', 'bol-9300000236208265'] }
      ],
      slot: 'Meer ideeën staan bij <a href="/voor/haar">Cadeaus voor haar</a> en <a href="/c/geuren-verzorging/geuren">Geuren</a>.' },
    { slug: 'kerstcadeau-voor-hem', beeld: 'cl-emberton3', vakken: ['cadeaus/kerst', 'cadeaus/voor-hem', 'geuren-verzorging/parfum', 'sport-outdoor/darts', 'elektronica'], titel: 'Kerstcadeau voor hem: van grappig tot gadget', kort: 'Voor je man, vriend, vader of broer. Van €20 tot €111.',
      intro: 'Mannen zeggen vaak dat ze niets nodig hebben. Toch zijn er genoeg cadeaus waar ze stiekem blij mee zijn: iets voor de auto, iets om mee te koken of te drinken, of een gadget. Hier staan ze in drie prijsklassen.',
      delen: [
        { kop: 'Tot €35', tekst: 'Leuk en betaalbaar.',
          ids: ['bol-9300000269870256', 'bol-9300000191796264', 'bol-9300000124265945', 'a-flextail-420ec05a0e'] },
        { kop: '€35 tot €80', tekst: 'Dingen die hij elke week gebruikt.',
          ids: ['bol-9300000083266771', 'bol-9200000101456379', 'bol-9200000127709459'] },
        { kop: 'Luxe (vanaf €80)', tekst: 'Voor een groot cadeau, of om met z’n allen te geven.',
          ids: ['cl-emberton3', 'bol-9200000118422706', 'bol-9300000015405237', 'cl-netatmo-weer', 'bol-1004004012237893'] }
      ],
      slot: 'Meer ideeën staan bij <a href="/voor/hem">Cadeaus voor hem</a>, <a href="/c/sport-outdoor/darts">Darts</a> en <a href="/c/dranken">Dranken</a>.' },
    { slug: 'kerstcadeau-collega', beeld: 'bol-9300000237452859', vakken: ['cadeaus/kerst', 'cadeaus/collega'], titel: 'Kerstcadeau voor een collega of het hele team', kort: 'Echte cadeaus die ze blijven gebruiken: van een mooie pen tot een verwenset.',
      intro: 'Een kerstcadeau voor een collega moet niet te persoonlijk zijn en ook niet te duur. Maar het mag wel een echt cadeau zijn: iets wat ze elke werkdag gebruiken, of iets om thuis van te genieten. Dus geen zak chips of een reep chocola die je zo in de supermarkt koopt, maar iets waar ze nog lang aan terugdenken. Geef je met het hele team? Dan kun je wat groter denken.',
      delen: [
        { kop: 'Klein bedankje (tot €15)', tekst: 'Voor de collega die je iets wilt geven, zonder dat het gek wordt. Klein, maar ze gebruiken het echt.',
          ids: ['hema-8eff9a5ada', 'bol-9300000338660274', 'bol-9300000130428935', 'bol-9300000256554614'] },
        { kop: 'Iets moois voor op het bureau of thuis (€15 tot €25)', tekst: 'Een goede pen, een plantje dat bijna niet dood kan of een fijne geur: daar heeft iemand de hele winter plezier van.',
          ids: ['bol-9300000023740845', 'dvzn-172862', 'bol-9200000078061085', 'dvzn-562225'] },
        { kop: 'Met het hele team (€25 en meer)', tekst: 'Als je met z’n allen iets geeft, bijvoorbeeld aan de baas of aan iemand die weggaat: een verwenset of iets van een topmerk.',
          ids: ['bol-9300000242918333', 'bol-9300000244887994', 'bol-9300000225803811', 'bol-9300000021869451'] }
      ],
      slot: 'Meer ideeën staan bij <a href="/voor/collega">Cadeau voor collega</a> en in de gids <a href="/gids/cadeau-voor-collega">Cadeau voor een collega: 12 ideeën</a>.' },
    { slug: 'kerststal-kopen', beeld: 'bol-9300000161906004', vakken: ['christelijk/kerststal-engelen', 'christelijk/kerst', 'christelijk/voor-kinderen', 'cadeaus/kerst'],
      titel: 'Kerststal kopen: van houten speelstal tot mooie kerststal voor in de kamer', kort: 'Houten kerststallen voor kinderen, sfeervolle stallen voor in huis en kleine kerststalletjes. Van 18 tot 505 euro.',
      intro: 'Een kerststal hoort bij Kerst. Hij laat zien waar het met Kerst echt om gaat: de geboorte van Jezus in de stal in Bethlehem. Maar welke kies je? Een houten stal waar kinderen mee mogen spelen, een mooie stal voor op de kast, of een klein stalletje voor in de vensterbank? Ik zette ze per soort op een rij, met tips waar je op let als je een kerststal koopt.',
      delen: [
        { kop: 'Waar let je op als je een kerststal koopt?', tekst: 'Een paar dingen om even over na te denken voordat je bestelt.',
          lijst: [
            'Spelen of kijken: met kleine kinderen in huis kies je een stevige houten stal. Porselein en steen zijn mooi, maar breken als ze vallen.',
            'Met of zonder figuren: sommige stallen zijn alleen het huisje. Kijk goed of Maria, Jozef, het kindje Jezus, de herders en de wijzen erbij zitten.',
            'Maat: meet de plek waar hij komt te staan. Losse figuren moeten ook in de stal passen.',
            'Licht: een stal met een lampje of een lichtgevende ster geeft ’s avonds veel sfeer. Kijk of er batterijen nodig zijn.',
            'Elk jaar iets erbij: bij een merk als Ostheimer kun je elk jaar een figuur bijkopen. Zo groeit de kerststal mee met het gezin.'
          ] },
        { kop: 'Houten kerststallen voor kinderen', tekst: 'Om mee te spelen en het kerstverhaal na te vertellen. Stevig hout, dus het mag een keer vallen.',
          ids: ['bol-9300000229367620', 'bol-9200000101182379', 'bol-9300000229915007', 'bol-9200000019512265', 'bol-9200000091616642', 'bol-9300000161906004'] },
        { kop: 'Sfeervolle kerststallen voor in de kamer', tekst: 'Voor op de kast, de schoorsteenmantel of onder de kerstboom.',
          ids: ['bol-9300000361763981', 'bol-9300000354379582', 'bol-9300000354373407', 'bol-9300000168431338', 'bl-10203173', 'bol-9300000237391244'] },
        { kop: 'Klein en bijzonder', tekst: 'Voor in de vensterbank, als cadeautje, of voor wie weinig ruimte heeft.',
          ids: ['bol-9300000409796863', 'bol-9300000251343822', 'bol-9200000045618541', 'bol-9300000197109186'] },
        { kop: 'Voor een leven lang: Ostheimer', tekst: 'Met de hand gemaakt in Duitsland, van massief hout. Duurder, maar zo’n stal geef je later door aan je kinderen.',
          ids: ['bol-9200000045615078', 'bol-9200000045616978', 'bol-9200000045616830'] }
      ],
      slot: 'Meer kerststallen en engelen staan bij <a href="/c/christelijk/kerststal-engelen">Kerststallen &amp; engelen</a>. Zoek je iets voor kinderen? Kijk dan bij <a href="/c/christelijk/voor-kinderen">Christelijke cadeaus voor kinderen</a>.' },
    { slug: 'hypes-2026', beeld: 'bol-9300000236575345', vakken: ['cadeaus/voor-kinderen', 'speelgoed', 'speelgoed/autos-treinen-rc', 'elektronica/gaming', 'cadeaus/sint-onder-15'],
      titel: 'De hypes van 2026: waar kinderen en tieners nu gek op zijn', kort: 'Tamagotchi, verrassingsdoosjes, KPop Demon Hunters en meer: dit staat op elk verlanglijstje.',
      intro: 'Elk jaar zijn er een paar dingen waar ineens iedereen het over heeft, op het schoolplein en op TikTok. In 2026 zijn dat de Tamagotchi (ja, die van vroeger), verrassingsdoosjes en tashangers, alles van KPop Demon Hunters, Pokémon en Stitch. Hier vind je ze op een rij, zodat je precies weet waar je kind of kleinkind blij van wordt.',
      delen: [
        { kop: 'De hits van het schoolplein', tekst: 'De Tamagotchi is helemaal terug, en KPop Demon Hunters is de film waar elk kind het over heeft.',
          ids: ['nedgam-25aaf9dace', 'bol-9300000236575345', 'bol-9300000273887351', 'bol-9300000354107444'] },
        { kop: 'Verrassingsdoosjes en tashangers', tekst: 'Uitpakken is de helft van de pret: je weet nooit welke je krijgt. Tashangers zijn dé trend voor aan je rugzak.',
          ids: ['bol-9300000264493695', 'bol-9300000268338286', 'bol-9300000261371860', 'bol-9300000227351372'] },
        { kop: 'Pokémon en Stitch', tekst: 'Al jaren populair, en in 2026 groter dan ooit: Pokémon viert zijn 30e verjaardag.',
          ids: ['bol-9300000377799800', 'bol-9300000331860190', 'bol-9300000159234222', 'bol-9300000026009635'] },
        { kop: 'Voor de kleine vlogger en gamer', tekst: 'Zelf filmpjes maken, een eigen horloge of de nieuwste Pokémon-game: voor kinderen die graag met techniek bezig zijn.',
          ids: ['bol-9300000273861930', 'bol-9300000152351739', 'bol-9300000240660527', 'bol-9300000183040640'] }
      ],
      slot: 'Meer ideeën vind je bij <a href="/voor/kinderen">Cadeaus voor kinderen</a> en in de gids <a href="/gids/speelgoed-van-het-jaar-2026">Speelgoed van het Jaar 2026</a>. Tip: hypes zijn rond Sinterklaas en Kerst vaak als eerste uitverkocht.' },
    { slug: 'virale-cadeaus-2026', beeld: 'bol-9300000243481710', vakken: ['cadeaus/voor-haar', 'cadeaus/voor-hem', 'elektronica/speakers', 'keuken/keukenapparaten', 'speelgoed/lego', 'geuren-verzorging/huidverzorging'],
      titel: 'Virale cadeaus 2026: de hits van TikTok en Instagram', kort: 'Van de Ninja CREAMi tot LEGO-bloemen en de Bum Bum Cream: dit zie je nu overal voorbijkomen.',
      intro: 'Je kent het vast: je scrolt door TikTok of Instagram en ziet steeds weer hetzelfde product. Sommige daarvan zijn echt een hype geworden, en dat zijn vaak precies de cadeaus waar iemand stiekem op hoopt. Ik zette de bekendste op een rij, van een lippenbalsem van een paar tientjes tot een ijsmachine. Alles van bekende merken en via bol te bestellen.',
      delen: [
        { kop: 'De apparaten die iedereen wil', tekst: 'Zelf ijs maken, vlees en friet tegelijk klaar, koffie die urenlang warm blijft en zachte golven in je haar.',
          ids: ['bol-9300000267208012', 'bol-9300000228952527', 'bol-9300000272998289', 'bol-9300000239958237'] },
        { kop: 'Muziek mee, overal', tekst: 'Kleine speakers met groot geluid en oordopjes die het lawaai om je heen wegfilteren.',
          ids: ['bol-9300000252617200', 'bol-9300000193746659', 'bol-9300000279417145', 'bol-9300000191626158'] },
        { kop: 'Bloemen die nooit verwelken', tekst: 'LEGO-bloemen zijn een hit bij volwassenen: rustig bouwen en daarna een mooi stuk decoratie.',
          ids: ['bol-9300000237345401', 'bol-9300000243481710', 'bol-9300000266727644', 'bol-9300000227400233'] },
        { kop: 'Beauty-hits van je tijdlijn', tekst: 'De lippenbalsem, lipolie en crèmes die je op TikTok steeds weer ziet. Een fijn verwencadeau.',
          ids: ['bol-9300000178746326', 'bol-9300000060629305', 'bol-9300000259398888', 'bol-9300000165133570'] }
      ],
      slot: 'Zoek je iets voor kinderen en tieners? Kijk dan in de gids <a href="/gids/hypes-2026">De hypes van 2026</a>. Voor parfum is er <a href="/gids/geuren-trends-2026">Geuren die nu hot zijn</a>. Tip: virale producten zijn rond de feestdagen snel uitverkocht, dus wacht niet te lang.' },
    { slug: 'geuren-trends-2026', beeld: 'bol-9300000170836066', vakken: ['geuren-verzorging/parfum', 'mode-beauty', 'cadeaus/voor-haar'],
      titel: 'Geuren die nu hot zijn: ontdekkingssets, layeren en de klassiekers', kort: 'Van een proefset om te ontdekken tot de parfum die iedereen herkent.',
      intro: 'Parfum is een van de populairste cadeaus, en er gebeurt veel. Ontdekkingssets met kleine flesjes zijn in, net als "layeren": twee geuren over elkaar dragen voor je eigen mix. Daarnaast blijven de grote klassiekers het altijd goed doen. Hier staan de mooiste, voor haar en voor hem, van klein tot luxe.',
      delen: [
        { kop: 'Ontdekkingssets: eerst proeven', tekst: 'Kleine flesjes van verschillende geuren. Ideaal als je niet weet welke geur iemand mooi vindt.',
          ids: ['bol-9300000176004073', 'bol-9300000183855220', 'bol-9300000183494175', 'bol-9300000291533838'] },
        { kop: 'Layeren en parfumbalsems', tekst: 'Een parfumolie of balsem draag je los of over je eigen parfum. Vaak ook nog voordelig.',
          ids: ['bol-9300000003438540', 'bol-9300000240443530', 'bol-9300000318870515'] },
        { kop: 'Klassiekers voor haar', tekst: 'Deze flesjes herkent iedereen. Een cadeau waar je nooit mee misgaat.',
          ids: ['bol-9300000266921937', 'bol-9300000170836066', 'bol-9300000363592116', 'bol-9300000238825117'] },
        { kop: 'Klassiekers voor hem', tekst: 'Stoere geuren die mannen echt dragen, vaak als set met douchegel of deo.',
          ids: ['bol-9300000228928212', 'cl-set-acqua', 'bol-9300000247496139', 'bol-9300000265211555'] }
      ],
      slot: 'Alle geuren vind je bij <a href="/c/geuren-verzorging/geuren">Geuren</a>. Tip: twijfel je? Kies een ontdekkingsset, dan kan de ander zelf de favoriet uitzoeken.' },
    { slug: 'sinterklaas-onder-15', beeld: 'bol-9300000181433977', vakken: ['cadeaus/sinterklaas', 'cadeaus/sint-onder-15', 'speelgoed/knutselen-kleuren'], titel: 'Sinterklaascadeaus onder de €15', kort: 'Leuke surprises en kleine cadeautjes voor pakjesavond, zonder dat het veel kost.',
      intro: 'Op pakjesavond gaat het niet om dure cadeaus, maar om iets leuks om uit te pakken. Daarom zette ik de beste cadeautjes onder de 15 euro op een rij. Handig als je meerdere kinderen hebt, of als je lootjes trekt met een vast bedrag.',
      delen: [
        { kop: 'Voor kinderen die graag iets maken', tekst: 'Knutselsetjes zijn ideaal voor de schoen of als klein pakje: goedkoop, en ze zijn er na pakjesavond nog dagen zoet mee.',
          ids: ['bol-9300000071114106', 'bol-9300000169748883', 'bol-1004004007096491', 'bol-9200000109023395'] },
        { kop: 'Puzzels en spelletjes', tekst: 'Een puzzel of spelletje kun je meteen samen doen, als de pakjes open zijn.',
          ids: ['bol-9300000181433977', 'bol-9300000178728048', 'bol-9300000020405193', 'bol-9300000221675724'] },
        { kop: 'Voor de lootjes onder volwassenen en tieners', tekst: 'Een mok van hun favoriete serie of film, of iets lekkers: altijd raak.',
          ids: ['nedg-e1cd4db186', 'bol-9300000155871150', 'bol-9300000192710306', 'bol-9300000255947352'] }
      ],
      slot: 'Meer ideeën vind je bij <a href="/c/cadeaus/sint-onder-15">alle Sinterklaascadeaus onder €15</a> en <a href="/c/cadeaus/sinterklaas">Sinterklaas</a>. Tip: koop op tijd, rond 5 december zijn populaire cadeautjes vaak snel uitverkocht.' },
    { slug: 'cadeau-voor-collega', beeld: 'bol-9300000143116033', vakken: ['cadeaus/collega', 'boeken-media/agendas-planners-kalenders'], titel: 'Cadeau voor een collega: 12 ideeën die altijd goed vallen', kort: 'Voor een verjaardag, afscheid, kerst of gewoon als bedankje.',
      intro: 'Een cadeau voor een collega is lastig: je wilt iets persoonlijks, maar het mag niet te duur of te gek zijn. Deze cadeaus vallen bijna altijd goed, voor een verjaardag, een afscheid of als bedankje.',
      delen: [
        { kop: 'Kleine bedankjes (tot €20)', tekst: 'Iets lekkers of een klein plantje voor op het bureau. Niet te veel, wel attent.',
          ids: ['bol-9300000017147055', 'bol-9300000239566022', 'bp-l114', 'cl-beste-mok'] },
        { kop: 'Voor op de werkplek', tekst: 'Praktisch en toch een cadeau: dingen waar iemand elke werkdag plezier van heeft.',
          ids: ['joybuy-600d2858b0', 'gt-lexon-usb-lamp', 'bol-9300000130428935', 'bol-9300000143116033'] },
        { kop: 'Afscheid met een knipoog', tekst: 'Gaat een collega weg? Een grappig cadeau maakt het afscheid luchtiger. Leuk om met het hele team te geven.',
          ids: ['dvzn-990557', 'amz-b0dcw33ywj', 'bol-9300000225912982', 'bol-9300000171221372'] }
      ],
      slot: 'Bekijk alle ideeën bij <a href="/voor/collega">Cadeau voor collega</a>. Geef je met het hele team? Kijk dan ook eens naar de wat duurdere cadeaus, zoals een mooie laptoptas of lunchpot.' },
    { slug: 'kerstcadeau-opa-oma', vakken: ['cadeaus/kerst', 'cadeaus/opa-oma', 'wonen/kussens-plaids', 'speelgoed/puzzels'], titel: 'Kerstcadeau voor opa en oma', kort: 'Cadeaus voor opa en oma die ze echt gaan gebruiken, van spelletjes tot herinneringen.',
      intro: 'Opa en oma zeggen vaak dat ze niets nodig hebben. Toch zijn er cadeaus waar ze echt blij van worden: iets om samen met de kleinkinderen te doen, iets warms voor de winter, of een herinnering.',
      delen: [
        { kop: 'Samen met de kleinkinderen', tekst: 'Spelletjes die opa en oma nog kennen van vroeger, en die kleinkinderen ook leuk vinden.',
          ids: ['bol-1004004000008403', 'bol-1004004011781804', 'bol-9200000108574427', 'bol-9300000132852206'] },
        { kop: 'Warm en gezellig de winter door', tekst: 'Voor lange winteravonden op de bank of in de stoel.',
          ids: ['bol-9300000196514024', 'bol-9300000236851351', 'bol-9200000075452260', 'bol-9300000098766103'] },
        { kop: 'Herinneringen en muziek', tekst: 'Foto’s van de kleinkinderen of muziek van vroeger: daar raken ze niet op uitgekeken.',
          ids: ['bol-9300000167329318', 'bol-9300000032182043', 'bol-9300000237380954', 'bol-9200000099487936'] }
      ],
      slot: 'Nog meer ideeën staan bij <a href="/voor/opa-oma">Cadeaus voor opa en oma</a> en <a href="/c/cadeaus/kerst">Kerstcadeaus</a>.' },
    { slug: 'sfeerlicht-donkere-avonden', vakken: ['wonen', 'wonen/lampen', 'elektronica/gadgets-trackers'], titel: 'Sfeerlicht voor donkere avonden: lavalampen, sterrenprojectors en meer', kort: 'De klok is terug en het is vroeg donker. Zo maak je het thuis gezellig.',
      intro: 'Als de klok een uur terug gaat, is het ineens om half zes al donker. Een fel plafondlicht maakt het dan niet gezellig. Deze lampen geven sfeer, en het zijn ook leuke cadeaus voor tieners en volwassenen.',
      delen: [
        { kop: 'Lavalampen', tekst: 'De klassieker uit de jaren zeventig is weer helemaal terug. Rustgevend om naar te kijken.',
          ids: ['dvzn-436068', 'bol-9300000021560153', 'bol-9300000372578161', 'bol-9300000178564836'] },
        { kop: 'Sterren en noorderlicht op je plafond', tekst: 'Projectors die een sterrenhemel of noorderlicht op je plafond toveren. Heerlijk om bij in slaap te vallen.',
          ids: ['bol-9300000193639901', 'dvzn-6795', 'bol-9300000164083567'] },
        { kop: 'Erbij voor een filmavond', tekst: 'Lichten uit, lamp aan, film starten.',
          ids: ['bol-9300000340258889', 'bol-9300000363626899', 'bol-9300000252154423', 'bol-9300000166331103'] }
      ],
      slot: 'Meer lampen vind je bij <a href="/c/wonen/verlichting">Verlichting</a>.' },
    { slug: 'afscheidscadeau-collega', beeld: 'bol-9300000242745735', vakken: ['cadeaus/collega'],
      titel: 'Afscheidscadeau voor een collega: grappig, persoonlijk of met het hele team', kort: 'Gaat er een collega weg? Ideeën van een grappige mok tot een cadeau waar het hele team aan meebetaalt.',
      intro: 'Een collega die weggaat wil je niet zomaar laten gaan. Met een afscheidscadeau laat je zien dat je de samenwerking fijn vond. Het hoeft niet duur te zijn: een mok met een knipoog of een boek waarin iedereen iets schrijft, maakt vaak meer indruk dan een dure fles. Geef je met het hele team? Dan kun je samen voor iets groters gaan. Hieronder vind je ideeën in elke prijsklasse, en tips om het samen te regelen.',
      delen: [
        { kop: 'Met een knipoog (tot €20)', tekst: 'Een beetje plagen mag bij een afscheid. Zo laat je zien dat je haar of hem gaat missen.',
          ids: ['bol-9300000242745735', 'bol-9300000238049219', 'amz-b0cnkf8w3q', 'amz-b0g3hmpmjf'] },
        { kop: 'Om samen in te schrijven', tekst: 'Een boek waarin iedere collega een berichtje of herinnering schrijft. Dat bewaart iemand jaren.',
          ids: ['amz-9465708399', 'bol-9200000064944767'] },
        { kop: 'Voor op de nieuwe werkplek (€10 tot €30)', tekst: 'Iets handigs voor de nieuwe baan, zodat ze bij elke kop koffie even aan jullie denken.',
          ids: ['bol-9300000256133316', 'bol-9300000023740845', 'gt-lexon-usb-lamp', 'cg-newton-kinetic-balls'] },
        { kop: 'Met het hele team (€20 en meer)', tekst: 'Als iedereen een paar euro geeft, kun je samen voor iets moois gaan.',
          ids: ['cl-rit-sakura', 'cadeau-78a0e6aecb', 'bol-9300000174098365', 'bol-9300000141326647'] },
        { kop: 'Zo regel je het samen in 4 stappen', tekst: 'Met een paar afspraken is het zo geregeld.',
          stappen: [
            'Spreek af wie het regelt en hoeveel iedereen ongeveer geeft. Een vast bedrag van 5 of 10 euro per persoon voorkomt gedoe.',
            'Haal het geld op met een betaalverzoek. Dan hoeft niemand contant geld mee te nemen.',
            'Laat een kaart of afscheidsboek stil rondgaan, zodat iedereen erin kan schrijven zonder dat de collega het ziet.',
            'Geef het cadeau op de laatste werkdag, met een kort praatje. Een paar zinnen over wat je gaat missen is genoeg.'
          ] }
      ],
      slot: 'Meer ideeën staan bij <a href="/voor/collega">Cadeau voor collega</a> en in de gids <a href="/gids/cadeau-voor-collega">Cadeau voor een collega</a>. Gaat iemand met pensioen? Lees dan <a href="/gids/cadeau-voor-pensioen">Cadeau voor pensioen</a>.' },
    { slug: 'cadeau-voor-pensioen', beeld: 'bol-9300000171232502', vakken: ['cadeaus/collega', 'cadeaus/opa-oma'],
      titel: 'Cadeau voor pensioen: voor een collega, je vader of je moeder', kort: 'Grappige cadeaus, iets om te bewaren en spullen voor de nieuwe hobby. Van 9 tot 259 euro.',
      intro: 'Na jaren werken eindelijk met pensioen. Daar hoort een cadeau bij! Maar wat geef je iemand die ineens alle tijd heeft? Iets grappigs voor de afscheidsreceptie, iets om de herinneringen aan het werk te bewaren, of juist iets voor de hobby waar nu eindelijk tijd voor is: vogels kijken, fietsen, tuinieren of schatzoeken met een metaaldetector. Ik zette de beste ideeën op een rij.',
      delen: [
        { kop: 'Met een knipoog', tekst: 'Voor op de afscheidsreceptie. Daar wordt om gelachen.',
          ids: ['dvzn-734300', 'amz-b0hgq4q3pd', 'bol-9300000234965416', 'bol-9300000385427142'] },
        { kop: 'Om te bewaren', tekst: 'Laat collega’s, familie en vrienden iets schrijven. Dat leest iemand later nog vaak terug.',
          ids: ['amz-b0b3tdry1m', 'dvzn-542206', 'dvzn-452003', 'amz-b0d95l6674'] },
        { kop: 'Voor de nieuwe hobby', tekst: 'Eindelijk tijd voor wat je altijd al wilde doen. Met deze cadeaus kan iemand meteen beginnen.',
          ids: ['bol-9300000171232502', 'bol-9200000018494649', 'bol-9200000010409823', 'bol-9200000075382464', 'bol-9300000057830180', 'bol-9300000007378766'] },
        { kop: 'Tip: geef er een afspraak bij', tekst: 'Het mooiste cadeau voor iemand met pensioen is soms gewoon tijd samen. Schrijf op een kaartje bij je cadeau een afspraak: samen fietsen, samen naar de vogels kijken of een dagje uit. Dan heeft het cadeau meteen een plan erbij.' }
      ],
      slot: 'Meer ideeën staan bij <a href="/voor/collega">Cadeau voor collega</a>, <a href="/c/dieren/vogels">Vogels</a> en <a href="/c/metaaldetectie">Metaaldetectie</a>. Gaat er een collega weg naar een nieuwe baan? Lees dan <a href="/gids/afscheidscadeau-collega">Afscheidscadeau voor een collega</a>.' },
    { slug: 'kraamcadeau', beeld: 'knufk-bambam-pakket', vakken: ['cadeaus/baby-kraam', 'speelgoed/baby-peuter', 'cadeaus/voor-kinderen'],
      titel: 'Kraamcadeau: ideeën waar ouders écht iets aan hebben', kort: 'Voor op kraamvisite: lief voor de baby, handig voor de ouders. Van €6 tot €65.',
      intro: 'Op kraamvisite ga je niet met lege handen. Maar wat neem je mee? De meeste ouders krijgen stapels rompertjes in maat 50 en meer knuffels dan er in de wieg passen. Het beste kraamcadeau is daarom iets waar ze over een paar maanden nog wat aan hebben, of iets voor de ouders zelf, want die worden op kraamvisite bijna altijd overgeslagen. Ik zette de beste ideeën op een rij, van een klein cadeautje tot iets om met een groepje te geven. En onthoud: het allerbeste wat je kunt meenemen is iets te eten en de vraag "zal ik de afwas even doen?".',
      delen: [
        { kop: 'Tips voor het kraamcadeau', tekst: 'Vijf dingen die kraamouders zelf zeggen:',
          lijst: [
            'Koop kleding liever in maat 68 of 74 dan in maat 50. Daar passen baby’s maar een paar weken in.',
            'Vergeet de ouders niet: iets lekkers of iets om te ontspannen valt vaak nog beter dan het zoveelste babycadeau.',
            'Is er al een groot kind in huis? Een klein cadeautje voor de grote broer of zus voorkomt jaloezie.',
            'Geef iets voor later: een boek, een spaarpot of iets voor de babykamer gaat jaren mee.',
            'Vraag van tevoren of je iets kunt meenemen, zoals eten voor de vriezer. Daar help je ze pas echt mee.'
          ] },
        { kop: 'Lief voor de baby', tekst: 'Zacht, veilig en net even mooier dan standaard: hier kijken ouders blij van op.',
          ids: ['hema-d2cd56c14b', 'tbl-0a6h8gez0010m1', 'knufk-bambam-pakket', 'cl-eendjes-familie'] },
        { kop: 'Voor op de babykamer', tekst: 'Een nachtlampje of een wandkleed: elke avond in gebruik, en het staat er nog als de baby een kleuter is.',
          ids: ['dvzn-347250', 'tt-lamponline-51b017f92e', 'westwing-4a8bb904b1', 'bol-9300000183026688'] },
        { kop: 'Voor de ouders zelf', tekst: 'Een ketting voor de kersverse mama, een invulboek vol vragen of gewoon even gips om die bijzondere buik te bewaren (voor de volgende!).',
          ids: ['myka-1100182088', 'cl-1000-dagen-vragen', 'hm-gipsbuik-set', 'bw-relax-mama-kalender'] }
      ],
      slot: 'Alles voor de kleinste vind je bij <a href="/voor/baby">Babycadeaus</a>. Zoek je iets voor een doop? Kijk bij <a href="/c/christelijk/doop-belijdenis">Doop &amp; belijdenis</a>.' },
    { slug: 'housewarming-cadeau', beeld: 'dvzn-530181', vakken: ['wonen', 'wonen/woondecoratie', 'wonen/kaarsen-geur', 'wonen/tafelen'],
      titel: 'Housewarming cadeau: ideeën voor een nieuw huis', kort: 'Voor vrienden of familie die net verhuisd zijn. Van €13 tot €75.',
      intro: 'Iemand die net verhuisd is, heeft dozen vol spullen en toch nog een leeg huis. Het beste housewarming cadeau maakt dat nieuwe huis meteen een beetje méér thuis: licht, iets voor op tafel of iets om te proosten. Waar je mee op moet passen: smaak. Jij vindt dat beeldje prachtig, maar het moet wel in hún huis passen. Kies daarom iets neutraals, iets grappigs of iets wat op gaat. Ik zette de beste ideeën op een rij, van klein tot een cadeau om met een groep vrienden te geven.',
      delen: [
        { kop: 'Tips voor een housewarming cadeau', tekst: 'Zo kies je iets waar ze echt blij mee zijn:',
          lijst: [
            'Twijfel je over hun smaak? Kies iets dat op gaat: een mooie fles, een geurkaars, iets lekkers.',
            'Licht is bijna altijd raak: een nieuwe woning heeft nooit genoeg sfeerverlichting.',
            'Geef iets voor het eerste avondje thuis: glazen, een plank vol lekkers, een fles bubbels.',
            'Met een groep? Leg samen in voor één mooi cadeau in plaats van vijf kleine.',
            'Een kaartje met "veel geluk in jullie nieuwe huis" maakt elk cadeau persoonlijker.'
          ] },
        { kop: 'Licht en sfeer', tekst: 'Van een weckpot die overdag oplaadt in de vensterbank tot een lichtsnoer voor de tuin.',
          ids: ['dvzn-530181', 'lr-351482827000', 'bol-9300000159425017', 'joybuy-234e86090b'] },
        { kop: 'Voor aan tafel', tekst: 'Mooi servies en een flinke serveerplank: daar heeft elk nieuw huishouden wat aan.',
          ids: ['t2-hema-5623840130', 'tt-country-acc-40291bdfe5', 'dille-58dac9bd47', 'westwing-0a01a1d0b5'] },
        { kop: 'Vrolijke details', tekst: 'Een wiebelend geluksmannetje, een knipogende kattenklok of een vaas met kleur: kleine dingen die een huis eigen maken.',
          ids: ['westwing-0f62b95423', 't2-fiftiesstore-52c8a41b59', 't2-hema-52e407e77f'] },
        { kop: 'Om te proosten op het nieuwe huis', tekst: 'Champagne, mooie glazen of een karaf: het eerste feestje in het nieuwe huis kan beginnen.',
          ids: ['dc-1665638250', 'decantalo-4c6ef11dc4', 'dc-2163335415'] }
      ],
      slot: 'Meer ideeën staan bij <a href="/gelegenheid/housewarming">Housewarming</a> en <a href="/c/wonen">Wonen</a>.' },
    { slug: 'cadeau-wijnliefhebber', beeld: 'decantalo-4c6ef11dc4', vakken: ['eten-drinken/wijn', 'eten-drinken/bubbels', 'eten-drinken/drankaccessoires'],
      titel: 'Cadeau voor een wijnliefhebber: van mooie fles tot Riedel-glazen', kort: 'Wijn geven zonder zelf kenner te zijn: veilige flessen, mooie glazen en luxe om uit te pakken.',
      intro: 'Een fles wijn geven aan iemand die er verstand van heeft: veel mensen vinden dat spannend. Niet nodig. Er zijn flessen waar vrijwel elke wijnliefhebber blij van wordt, en je hoeft er zelf geen kenner voor te zijn. De veiligste keuze is een Rioja Reserva uit Spanje: een klassieker die bij bijna iedereen goed valt. En wil je iets geven dat níét op gaat, kies dan mooie glazen of een karaf. Daar denkt iemand bij elk glas weer even aan je. Alle wijnen hieronder komen van een echte wijnwinkel, niet uit het supermarktschap.',
      delen: [
        { kop: 'Zo kies je een fles als cadeau', tekst: 'Vier simpele regels, geen kennersgedoe:',
          lijst: [
            'Veilige keuze: een Rioja Reserva uit Spanje. Soepel, klassiek en bijna iedereen vindt het lekker.',
            'Tussen de 15 en 25 euro zit je goed: duidelijk beter dan de supermarkt, zonder dat het gek wordt.',
            'Kijk (of vraag stiekem) wat iemand zelf drinkt: wie altijd wit drinkt, maak je niet blij met zware rode wijn.',
            'Twijfel je? Bubbels. Champagne is voor bijna elke wijnliefhebber feest.'
          ] },
        { kop: 'Veilige flessen (€12 tot €25)', tekst: 'Spaanse klassiekers die het altijd goed doen. De Cune Reserva is misschien wel de beste koop van deze hele lijst.',
          ids: ['dc-2073674337', 'dc-1680371208', 'dc-2041274417', 'dc-2042172830', 'dc-2059774751'] },
        { kop: 'Net iets specialer (€25 tot €35)', tekst: 'Voor een verjaardag of als bedankje dat net wat meer mag zijn.',
          ids: ['dc-2096174492', 'dc-1774276360', 'dc-2874880424'] },
        { kop: 'Cadeaus die niet op gaan', tekst: 'Goede glazen en een karaf maken elke fles beter. Riedel is hét merk waar wijnliefhebbers zelf naar kijken.',
          ids: ['decantalo-4c6ef11dc4', 'dc-2163335415', 'dvzn-243456', 'bol-9300000405968428'] },
        { kop: 'Om echt uit te pakken', tekst: 'Champagne van een groot huis of een grote Italiaan: voor een jubileum, een pensioen of gewoon omdat het kan.',
          ids: ['dc-1665638250', 'dc-1652149584', 'dc-3004176108', 'dc-2620875218'] }
      ],
      slot: 'Alle wijnen staan bij <a href="/c/eten-drinken/wijn">Wijn</a> en de bubbels bij <a href="/c/eten-drinken/bubbels">Bubbels</a>. Geen 18, geen alcohol.' },
    { slug: 'cadeau-hondenliefhebber', beeld: 'dvzn-358202', vakken: ['dieren/hond', 'dieren'],
      titel: 'Cadeau voor een hondenliefhebber (en voor de hond zelf)', kort: 'Voor het baasje én de hond: van grappig tot flink verwend. Van €10 tot €90.',
      intro: 'Voor veel mensen is de hond gewoon een gezinslid. Een cadeau voor de hond is dus eigenlijk een cadeau voor het baasje, en andersom. Het leuke: hondencadeaus zijn er in elke prijsklasse, van een bruisbal voor het hondenbad tot een prachtige mand van zeegras. Eén ding om op te letten: geef geen snacks of voer zonder te overleggen, want veel honden hebben een allergie of een streng dieet. Speelgoed, een mand of iets voor in huis is altijd veilig. Ik zette de leukste ideeën op een rij.',
      delen: [
        { kop: 'Waar let je op?', tekst: 'Drie dingen voordat je kiest:',
          lijst: [
            'De maat van de hond: een mand voor een beagle is voor een labrador een kussentje.',
            'Geen voer of snacks zonder overleg: allergieën en diëten komen bij honden vaak voor.',
            'Sloopt de hond alles? Kies dan stevig speelgoed van rubber in plaats van pluche.'
          ] },
        { kop: 'Om mee te spelen', tekst: 'Van de onverwoestbare KONG tot een likmat die de hond een kwartier rustig houdt.',
          ids: ['bol-9200000046271441', 'ww-oyo16356203242', 'dvzn-474812'] },
        { kop: 'Voor het hondenbad', tekst: 'Wassen wordt bijna leuk: een spa-setje, een badborstel en zelfs een bruisbal speciaal voor honden.',
          ids: ['dvzn-443774', 'dvzn-421666', 'dvzn-833231'] },
        { kop: 'Lekker liggen', tekst: 'Een mooie mand of een zachte deken: daar heeft de hond élke dag wat aan, en het staat nog mooi in huis ook.',
          ids: ['dk-00041518', 'ww-wah41840217818', 'ww-lab19475198538', 'ww-oyo49119390280'] },
        { kop: 'Voor het baasje', tekst: 'Een voerbak die mooi staat in de keuken, een riem vol worstjes of een handgeweven halsband: hier zie je de hondenliefde vanaf.',
          ids: ['ww-dgg43412153851', 'dvzn-376007', 'dvzn-358202', 'ww-bud14470791825'] }
      ],
      slot: 'Meer voor huisdieren vind je bij <a href="/c/dieren">Dieren</a>. Ook een kat in huis? Kijk bij <a href="/c/dieren/kat">Katten</a>.' },
    { slug: 'valentijnscadeau-voor-haar', beeld: 'bp-l087', vakken: ['valentijn/voor-haar', 'valentijn', 'cadeaus/voor-haar', 'sieraden'],
      titel: 'Valentijnscadeau voor haar: romantische cadeaus voor je vriendin of vrouw', kort: 'Hartjessieraden, rozen die nooit verwelken en iets om haar te verwennen. Van €10 tot €180.',
      intro: 'Een valentijnscadeau voor haar moet vooral laten zien dat je aan haar denkt. Dat hoeft niet duur te zijn: een sieraad met een hartje, rozen die nooit verwelken of een avondje verwennen zeggen vaak meer dan een groot cadeau. En het mooie is: deze cadeaus zijn het hele jaar goed, voor jullie jubileum of gewoon zomaar. Ik zette de mooiste op een rij.',
      delen: [
        { kop: 'Een sieraad met een hartje', tekst: 'Een sieraad draagt ze elke dag. Zo denkt ze steeds even aan jou.',
          ids: ['pry-k729', 'myka-11001465188', 'myka-11003437404', 'pry-k1614', 'myka-11001211409', 'pry-zf113'] },
        { kop: 'Rozen die nooit verwelken', tekst: 'Echte rozen door de brievenbus, of rozen van LEGO die je samen bouwt en die altijd blijven staan.',
          ids: ['lego-40460', 'lego-10374', 'bp-l087', 'bp-l001'] },
        { kop: 'Even helemaal verwend', tekst: 'Een warm bad, een zachte crème of een massage: kleine verwenmomenten om samen van te genieten.',
          ids: ['dk-00031412', 'bol-9200000028156878', 'dk-00045263'] },
        { kop: 'Tip: schrijf er een kaartje bij', tekst: 'Het cadeau is mooi, maar de woorden blijven het langst. Schrijf er een paar zinnen bij over wat je zo leuk aan haar vindt. Dat kaartje bewaart ze vaak nog jaren.' }
      ],
      slot: 'Meer romantische ideeën staan bij <a href="/c/valentijn">Liefde & Valentijn</a>. Zoek je iets voor hem? Lees dan <a href="/gids/valentijnscadeau-voor-hem">Valentijnscadeau voor hem</a>.' },
    { slug: 'valentijnscadeau-voor-hem', beeld: 'bol-9200000076851367', vakken: ['valentijn/voor-hem', 'valentijn', 'cadeaus/voor-hem'],
      titel: 'Valentijnscadeau voor hem: romantisch, maar niet zoetsappig', kort: 'Een horloge, een leren armband, iets met zijn naam of een avond samen. Van €27 tot €110.',
      intro: 'Een valentijnscadeau voor hem vinden is lastig. Veel mannen houden niet van roze hartjes, maar vinden een romantisch gebaar stiekem wel heel fijn. Kies daarom iets wat hij echt gebruikt en wat toch iets van jou zegt: een mooi horloge, een armband die hij elke dag draagt of een avond samen. Hier zijn de beste ideeën.',
      delen: [
        { kop: 'Iets om elke dag te dragen', tekst: 'Een horloge of een stoere armband. Elke keer dat hij erop kijkt, denkt hij aan jou.',
          ids: ['bol-9200000076851367', 'bol-9300000267824769', 'bol-9300000047747066', 'myka-11003216232', 'tbl-tb0a2dhs999os1'] },
        { kop: 'Met zijn naam erop', tekst: 'Persoonlijk en toch stoer: manchetknopen, een ketting of een armband met een naam of letter.',
          ids: ['myka-11017179911', 'myka-11015253511', 'myka-11001421304', 'myka-11003249788'] },
        { kop: 'Voor de man die van mooie spullen houdt', tekst: 'Een cocktailset voor een avond samen, een goede scheerset of een leren portemonnee.',
          ids: ['bol-9300000170256799', 'dvzn-208667', 'bol-9300000272321914', 'as-5063320998032'] },
        { kop: 'Tip: plan er iets bij', tekst: 'Mannen vinden een gezamenlijke activiteit vaak het leukste cadeau. Geef bij je cadeau een plan: samen uit eten, een avond cocktails maken of een dagje weg.' }
      ],
      slot: 'Meer ideeën staan bij <a href="/c/valentijn/voor-hem">Liefde & Valentijn voor hem</a>. Zoek je iets voor haar? Lees dan <a href="/gids/valentijnscadeau-voor-haar">Valentijnscadeau voor haar</a>.' },
    { slug: 'cadeau-1-jaar-samen', beeld: 'ww-kaj73364965349', vakken: ['valentijn/samen', 'valentijn/romantische-avond', 'valentijn'],
      titel: 'Cadeau voor 1 jaar samen: ideeën voor jullie eerste jubileum', kort: 'Iets van jullie twee, iets om samen te doen en kleine liefdevolle gebaren. Van 15 tot 109 euro.',
      intro: 'Een jaar samen! Dat is iets om te vieren. Het mooiste cadeau voor jullie eerste jubileum gaat over jullie twee: een sieraad dat jullie allebei dragen, een spel waarmee je elkaar nog beter leert kennen, of een avond met chocoladefondue. Geen dure cadeaus nodig, wel iets met aandacht. Ik zette de leukste ideeën op een rij.',
      delen: [
        { kop: 'Iets van jullie twee', tekst: 'Twee helften van een hart, twee vogeltjes tegen elkaar aan of een kistje voor jullie herinneringen.',
          ids: ['myka-1100157588', 'ww-kaj73364965349', 'myka-11001132188', 'bol-9300000181912357'] },
        { kop: 'Samen iets doen', tekst: 'Vragen die jullie nog nooit aan elkaar stelden, een puzzel voor een rustige avond of warme chocolade om fruit in te dippen.',
          ids: ['bol-9300000226609761', 'bol-9300000161370142', 'bol-9300000075413777', 'bol-9300000169524759', 'bol-9300000227831932'] },
        { kop: 'Een klein gebaar', tekst: 'Een rood neonhart of een fonduepannetje voor twee. Klein, maar het zegt genoeg.',
          ids: ['bol-9300000084984419', 'bol-9300000164551900'] },
        { kop: 'Tip: maak er een dag van', tekst: 'Ga terug naar de plek waar jullie elkaar voor het eerst zagen, of doe nog eens wat jullie op jullie eerste date deden. Het cadeau maakt de dag compleet.' }
      ],
      slot: 'Meer ideeën staan bij <a href="/c/valentijn/samen">Samen & jubileum</a> en <a href="/c/valentijn/romantische-avond">Romantische avond</a>. Zijn jullie al langer getrouwd? Lees dan <a href="/gids/cadeau-trouwdag-jubileum">Cadeau voor je trouwdag of huwelijksjubileum</a>.' },
    { slug: 'cadeau-trouwdag-jubileum', beeld: 'lego-31214', vakken: ['valentijn/samen', 'valentijn/met-naam', 'valentijn'],
      titel: 'Cadeau voor je trouwdag of huwelijksjubileum: 12,5, 25, 40 of 50 jaar getrouwd', kort: 'Sieraden met jullie namen, iets moois voor in huis en een avond om samen te vieren. Van €25 tot €900.',
      intro: 'Een trouwdag is elk jaar weer een moment om stil te staan bij elkaar. Bij een groot jubileum, zoals 12,5, 25, 40 of 50 jaar getrouwd, hoort een cadeau dat blijft: een sieraad met jullie namen, iets moois voor in huis of een avond om het samen te vieren. Ook als je een cadeau zoekt voor je ouders of opa en oma die al zo lang samen zijn, vind je hier ideeën.',
      delen: [
        { kop: 'Iets dat blijft', tekst: 'Een sieraad van echt goud met jullie namen of twee harten in elkaar. Voor een groot jubileum.',
          ids: ['myka-11001365601', 'myka-11001131631', 'myka-11003211420', 'bol-9300000194463478'] },
        { kop: 'Iets moois voor jullie huis', tekst: 'Een kunstwerk om samen te bouwen, de stad van de liefde of een plank met jullie namen.',
          ids: ['lego-31214', 'lego-21064', 'bol-9300000074464628', 'bol-9300000070824603'] },
        { kop: 'Samen vieren', tekst: 'Een avond fonduen of een sterrenhemel op het plafond: vier jullie dag thuis.',
          ids: ['bol-9200000121253565', 'dvzn-801397', 'dvzn-515371'] },
        { kop: 'Welk jubileum is het?', tekst: 'Elk huwelijksjubileum heeft een eigen naam. 12,5 jaar getrouwd is het koperen huwelijk, 25 jaar het zilveren, 40 jaar het robijnen en 50 jaar het gouden huwelijk. Een cadeau in die kleur of dat materiaal is een mooie knipoog.' }
      ],
      slot: 'Meer ideeën staan bij <a href="/c/valentijn/samen">Samen & jubileum</a> en <a href="/c/valentijn/met-naam">Met naam & hartje</a>. Zijn jullie net een jaar samen? Lees dan <a href="/gids/cadeau-1-jaar-samen">Cadeau voor 1 jaar samen</a>.' },
    { slug: 'kinderbijbel-kiezen', beeld: 'bol-9300000235874233', vakken: ['christelijk/bijbels', 'christelijk/voor-kinderen', 'christelijk/doop-belijdenis'],
      titel: 'Kinderbijbel kiezen: welke past bij welke leeftijd?', kort: 'Van babybijbel tot kinderbijbel voor elke dag. Per leeftijd de mooiste op een rij.',
      intro: 'Een kinderbijbel is een mooi cadeau voor een doop, een verjaardag of gewoon zomaar. Maar er zijn er heel veel. Welke past bij jouw kind of kleinkind? Dat hangt vooral af van de leeftijd. Een baby heeft iets aan stevige bladzijden en grote plaatjes. Een kind van acht wil zelf lezen en vindt een verhaal voor elke dag fijn. Hieronder vind je per leeftijd de kinderbijbels die ik het mooist vind, en waar je op let.',
      delen: [
        { kop: 'Waar let je op?', tekst: 'Drie vragen helpen je kiezen.',
          lijst: [
            'Hoe oud is het kind? Voor de kleinsten: korte verhalen en grote plaatjes. Voor oudere kinderen: meer tekst en meer verhalen.',
            'Voorlezen of zelf lezen? Een voorleesbijbel heeft langere verhalen. Wil het kind zelf lezen, kies dan grote letters en korte zinnen.',
            'Hoe dicht bij de Bijbel? Sommige kinderbijbels vertellen de verhalen vrij na. Andere blijven dicht bij de woorden van de Bijbel, zoals de HSV Kinderbijbel.'
          ] },
        { kop: 'Baby’s en dreumesen (0 tot 2 jaar)', tekst: 'Weinig tekst en vrolijke plaatjes. Fijn om samen te bekijken.',
          ids: ['bol-9200000090540712', 'bol-9300000184006004', 'bol-9300000127699829', 'bol-9300000197756065'] },
        { kop: 'Peuters en kleuters (2 tot 5 jaar)', tekst: 'Korte verhalen om voor te lezen, met plaatjes waar ze veel in kunnen ontdekken.',
          ids: ['bol-9200000114277642', 'bol-9300000005322306', 'bol-9200000130050250', 'bol-9300000249426301'] },
        { kop: 'Jonge kinderen (4 tot 8 jaar)', tekst: 'Meer verhalen, uit het Oude en het Nieuwe Testament. Om voor te lezen aan tafel of voor het slapengaan.',
          ids: ['bol-9300000139904477', 'bol-9300000263045759', 'bol-1001004001847857', 'bol-9200000101887063'] },
        { kop: 'Voor elke dag (6 tot 12 jaar)', tekst: 'Een verhaal voor elke dag van het jaar, of een kinderbijbel die dicht bij de Bijbel blijft. Ook om zelf in te lezen.',
          ids: ['bol-9300000235874233', 'bol-9300000130260497', 'bol-9200000052023945', 'bol-9300000337284179'] }
      ],
      slot: 'Meer bijbels en boeken staan bij <a href="/c/christelijk/bijbels">Bijbels</a> en <a href="/c/christelijk/voor-kinderen">Christelijke cadeaus voor kinderen</a>. Zoek je een cadeau voor een doop? Kijk bij <a href="/c/christelijk/doop-belijdenis">Doop &amp; belijdenis</a>.' }
  ];
  /* Gidsen 2.0 (7-11-2026): per gids 'Snel kiezen' (3 favorieten: [label, product-id]) en veelgestelde vragen ([vraag, antwoord]). */
  var GIDS_EXTRA = {
    'schoencadeautjes': { top: [['Onze topkeuze', 'bol-9300000232471843'], ['Voor de kleintjes', 'bol-9300000320683306'], ['Om samen te spelen', 'bol-9200000132162995']], faq: [
      ['Hoeveel geef je uit aan een schoencadeautje?', 'De meeste ouders houden 2 tot 5 euro per schoen aan en bewaren het grotere cadeau voor pakjesavond. Niet elke schoen hoeft een cadeautje te hebben: een mandarijn, een chocolademuntje of een tekening van Piet is ook feest.'],
      ['Hoe vaak mag je je schoen zetten?', 'Dat verschilt per gezin. Veel kinderen zetten hun schoen een paar keer in de weken tussen de intocht en 5 december, bijvoorbeeld op vaste dagen. Spreek het van tevoren af, dan weet iedereen waar hij aan toe is.'],
      ['Wat is een goed schoencadeautje voor een peuter?', 'Iets zachts en stevigs zonder kleine onderdelen: een rammelaar, een stevig boekje of een groot dierfiguur. Kijk altijd naar de leeftijd op de verpakking.']] },
    'sinterklaascadeau-man': { top: [['Onze topkeuze', 'bol-9300000179094379'], ['Voor de lootjes', 'bierch-0325fb0395'], ['Grappigste', 'cg-useless-box']], faq: [
      ['Wat geef je een man die zegt dat hij niets nodig heeft?', 'Iets wat hij zelf niet zou kopen maar wel gebruikt: een goede hoofdlamp, een vleesthermometer of een spel voor na het uitpakken. Of maak het grappig, daar is pakjesavond voor.'],
      ['Wat is een leuk lootjescadeau voor een man onder de €15?', 'Een bierbon, een verzorgingsset of een handig stuk gereedschap zoals een precisieschroevendraaier. In deze gids staan vier ideeën tot €12.'],
      ['Hoe maak ik er een surprise van?', 'Verpak het cadeau in iets wat bij hem past, zoals een grote dartpijl of een bierflesje van karton. In onze gids Surprise maken staat een stappenplan.']] },
    'sinterklaascadeau-vrouw': { top: [['Onze topkeuze', 'bol-9300000044984873'], ['Beste koop', 'dk-00043546'], ['Om te verwennen', 'lr-350322363000']], faq: [
      ['Wat geef je een vrouw voor Sinterklaas?', 'Iets om even tot rust te komen valt bijna altijd goed: warme sokken, een fijne geur of een plaid. Houdt ze van maken? Dan is een haakpakket of schilderen op nummer een schot in de roos.'],
      ['Wat is een goed lootjescadeau voor een vrouw onder de €15?', 'Fleece huissokken, een geurbalsem of de LEGO-zonnebloemen. Klein, maar ze gebruikt het echt.'],
      ['Is een geurkaars niet te standaard?', 'Niet als je een bijzondere geur kiest, zoals salted caramel. Met een grappig gedicht erbij wordt het meteen persoonlijk.']] },
    'surprise-maken': { top: [['Onmisbaar', 'bol-9300000226734832'], ['Voor in je surprise', 'bol-9300000345522498'], ['Iets lekkers erbij', 'bol-9300000010371405']], faq: [
      ['Hoeveel tijd kost een surprise maken?', 'Reken op twee tot drie avonden. Verf en papier-maché moeten drogen, dus begin uiterlijk een week voor pakjesavond.'],
      ['Wat heb je nodig om een surprise te maken?', 'Een doos of fles als basis, karton, plakband, een lijmpistool, verf of crêpepapier en een paar details zoals ogen of glitters. Met een lijmpistool gaat alles veel sneller.'],
      ['Hoe lang moet een sinterklaasgedicht zijn?', 'Acht tot zestien regels is genoeg. Laat het rijmen op elke twee regels, plaag een beetje maar houd het lief, en onderteken met Sint en Piet.']] },
    'adventskalender-kiezen': { top: [['Onze topkeuze', 'bol-9300000186028245'], ['Net even anders', 'bol-9300000408782128'], ['Voor kinderen', 'dw-8000500392065']], faq: [
      ['Wanneer begint een adventskalender?', 'Op 1 december. De meeste kalenders hebben 24 vakjes en lopen tot kerstavond. Sommige hebben er 25, tot en met eerste kerstdag.'],
      ['Wanneer moet ik een adventskalender bestellen?', 'Liefst vóór eind november. Dan heb je hem zeker op tijd, en de populairste kalenders zijn in december vaak uitverkocht.'],
      ['Is advent hetzelfde als de adventskalender?', 'Niet helemaal. Advent zijn de vier zondagen voor Kerst; daar hoort de adventskrans met vier kaarsen bij. De adventskalender telt de dagen af vanaf 1 december.']] },
    'kerstcadeau-kind': { top: [['Onze topkeuze', 'hema-f9c9a4dbde'], ['Voor de kleintjes', 'lego-10441'], ['Voor het hele gezin', '999g-999kls01']], faq: [
      ['Hoeveel geef je uit aan een kerstcadeau voor een kind?', 'Dat is heel persoonlijk. Veel mensen geven 20 tot 50 euro uit aan een eigen kind en wat minder aan neefjes, nichtjes of kleinkinderen. Spreek het in de familie af, dan voelt niemand zich bezwaard.'],
      ['Wat geef je een kind dat alles al heeft?', 'Iets om te dóén in plaats van te hebben: een bouwset, een spel voor de kerstvakantie of iets om zelf te maken. Daar hebben ze langer plezier van dan van nog een knuffel.'],
      ['Welk speelgoed past bij een kind van 2 of 3 jaar?', 'Stevig hout en DUPLO: groot, zonder kleine onderdelen en bijna niet kapot te krijgen. Kijk altijd naar de leeftijd op de verpakking.']] },
    'kerstcadeau-tiener': { top: [['Onze topkeuze', 'tf-107003281'], ['Voor de gamer', 'joybuy-6a6fbf11cb'], ['Voor haar', 'pry-zh2x']], faq: [
      ['Wat geef je een tiener die alles al heeft?', 'Iets voor hun eigen kamer of hun hobby: een lamp, oordopjes van een bekend merk of iets voor het gamen. Of iets van een film of serie waar ze nu fan van zijn.'],
      ['Is geld geven aan een tiener een goed idee?', 'Veel tieners vinden geld prima, maar het voelt minder persoonlijk. Een tussenweg: een klein cadeau dat bij ze past, met wat geld erbij voor iets groters.'],
      ['Wat kost een goed kerstcadeau voor een tiener?', 'In deze gids lopen de cadeaus van 15 tot 79 euro. Rond de 25 tot 50 euro vind je al echte merkspullen, zoals oordopjes of een controller.']] },
    'noodpakket-checklist': { top: [['Begin hiermee', 'bol-9300000184877600'], ['Schoon water', 'prepz-1b16ae0ca5'], ['Licht', 'bushpa-abaaeb3d75']], faq: [
      ['Wat moet er minimaal in een noodpakket?', 'Water (3 liter per persoon per dag), eten dat je zonder koken kunt eten, een radio op batterijen of een opwindradio, een zaklamp, een EHBO-set, contant geld en een volle powerbank. Dat is de basis voor 72 uur.'],
      ['Hoeveel water heb je nodig voor 3 dagen?', 'Reken op 3 liter per persoon per dag. Voor een gezin van vier is dat 36 liter voor drie dagen. Vergeet je huisdieren niet.'],
      ['Krijg je een gratis noodpakket van de overheid?', 'Nee. Berichten over een gratis noodpakket waarvoor je moet klikken of betalen zijn bijna altijd oplichting. Klik niet op de link.']] },
    'sinterklaas-onder-10': { top: [['Onze topkeuze', 'bol-9300000157956217'], ['Voor in de schoen', 'bol-9300000232471843'], ['Om voor te lezen', 'bol-9200000006380085']], faq: [
      ['Wat koop je voor een kind voor onder de 10 euro?', 'Kleine LEGO- en Playmobil-setjes, knutselsetjes, dierfiguren en sinterklaasboekjes. Alles in deze gids kost minder dan een tientje.'],
      ['Is 10 euro genoeg voor een sinterklaascadeau?', 'Voor in de schoen of als extra pakje zeker. Kinderen kijken meer naar het uitpakken dan naar de prijs.'],
      ['Waar let ik op bij goedkoop speelgoed?', 'Op veiligheid: kijk naar de leeftijd die op de verpakking staat en kies bekende merken. Alles in deze gids is van merken als LEGO, Playmobil, Schleich en SES.']] },
    'speelgoed-van-het-jaar-2026': { top: [['Onze topkeuze', 'bol-9300000262897603'], ['Leren met plezier', 'bol-9300000257685097'], ['Voor de kleintjes', 'bol-9300000266727635']], faq: [
      ['Wat is Speelgoed van het Jaar?', 'Een jaarlijkse verkiezing van het beste speelgoed in Nederland, per leeftijdsgroep. Naast de vakjury kan ook het publiek meestemmen.'],
      ['Welke winnaar past bij welke leeftijd?', 'Op de productpagina zie je vanaf welke leeftijd iets geschikt is. Voor peuters kies je DUPLO, voor het hele gezin een van de spellen.'],
      ['Zijn de winnaars snel uitverkocht?', 'Populaire winnaars zijn rond Sinterklaas en Kerst vaak snel weg. Bestel dus liever op tijd.']] },
    'sinterklaas-voor-volwassenen': { top: [['Onze topkeuze', 'bol-9300000192994012'], ['Lekkerste', 'bol-9300000243180019'], ['Iets groters', 'bol-9200000016853146']], faq: [
      ['Wat is een goed lootjesbedrag voor volwassenen?', 'De meeste families en vriendengroepen houden 10 tot 25 euro aan. Spreek het bedrag van tevoren af, dan is het voor iedereen eerlijk.'],
      ['Wat geef je een volwassene voor Sinterklaas?', 'Een spel voor na het uitpakken, iets lekkers van de Sint of iets handigs dat lang meegaat. Met een goed gedicht erbij wordt elk cadeau leuk.'],
      ['Hoort er bij volwassenen ook een surprise bij?', 'Bij lootjes trekken vaak wel, maar het hoeft niet. Spreek het samen af. Tips vind je in onze gids Surprise maken.']] },
    'kerstcadeau-onder-25': { top: [['Onze topkeuze', 'bol-9300000241393562'], ['Gezelligst', 'bol-9300000238623285'], ['Om samen te doen', 'bol-9300000375928006']], faq: [
      ['Wat koop je voor onder de 25 euro voor Kerst?', 'Iets lekkers in een mooie verpakking, iets gezelligs voor in huis, of een puzzel of spel voor de kerstdagen. Alles in deze gids blijft onder de 25 euro.'],
      ['Wat geef je iemand die je niet goed kent?', 'Iets dat op gaat: koffie, thee of chocolade. Dat valt bijna altijd goed en past in elk huis.'],
      ['Wanneer moet ik kerstcadeaus bestellen?', 'Liefst begin december. Vlak voor Kerst is het druk bij de bezorgers en zijn populaire cadeaus soms uitverkocht.']] },
    'kerstcadeau-voor-haar': { top: [['Onze topkeuze', 'bol-9300000237452859'], ['Beste koop', 'bol-9300000225710092'], ['Om uit te pakken', 'cl-instax12']], faq: [
      ['Wat geef je je vriendin met Kerst?', 'Iets om zichzelf te verwennen, zoals een cadeauset van Rituals, of iets met herinneringen, zoals een instant camera. Kijk naar wat ze zelf graag doet.'],
      ['Is een cadeauset niet te makkelijk?', 'Een set van een merk dat ze mooi vindt is juist een veilige keuze. Maak het persoonlijk met een kaartje of iets kleins erbij.'],
      ['Wat geef je je moeder met Kerst?', 'Thee, een goed boek, iets voor in huis of een verwenset. In deze gids staat in elke prijsklasse iets dat bij moeders goed valt.']] },
    'kerstcadeau-voor-hem': { top: [['Onze topkeuze', 'bol-9300000083266771'], ['Grappigste', 'bol-9300000269870256'], ['Om uit te pakken', 'cl-emberton3']], faq: [
      ['Wat geef je een man met Kerst die alles heeft?', 'Iets wat hij zelf niet snel koopt maar wel elke week gebruikt: goede steakmessen, een mooi horloge of een speaker. Of iets voor zijn hobby, zoals darts.'],
      ['Wat geef je je vader met Kerst?', 'Iets voor zijn hobby of iets lekkers: een koffiepakket, mooie whiskyglazen of een weerstation voor in de tuin.'],
      ['Wat is een goed kerstcadeau voor hem onder de €35?', 'Kerstsokken van Happy Socks, een geurset of ledstrips voor in de auto. Ze staan bovenaan deze gids.']] },
    'kerstcadeau-collega': { top: [['Onze topkeuze', 'bol-9300000130428935'], ['Klein bedankje', 'hema-8eff9a5ada'], ['Met het hele team', 'bol-9300000244887994']], faq: [
      ['Hoeveel geef je uit aan een kerstcadeau voor een collega?', 'Voor een losse collega is 5 tot 15 euro gebruikelijk. Geef je met het team, dan legt iedereen een paar euro in en kun je samen iets groters kiezen.'],
      ['Wat geef je een collega die je niet goed kent?', 'Iets dat op gaat of dat iedereen gebruikt: lekkers, een thermosmok of een plantje voor op het bureau. Niet te persoonlijk, wel attent.'],
      ['Mag een kerstcadeau voor een collega grappig zijn?', 'Als je elkaar een beetje kent wel. Houd het vriendelijk, zodat iedereen erom kan lachen.']] },
    'kerststal-kopen': { top: [['Voor kinderen', 'bol-9200000101182379'], ['Voor in de kamer', 'bol-9300000168431338'], ['Klein en bijzonder', 'bol-9300000409796863']], faq: [
      ['Welke figuren horen in een kerststal?', 'Maria, Jozef en het kindje Jezus in de kribbe, met een os en een ezel. Vaak komen er herders met schapen, een engel en de drie wijzen bij.'],
      ['Wanneer zet je de kerststal neer?', 'Veel mensen zetten hem neer aan het begin van de adventstijd of in de week voor Kerst. Een mooie traditie: leg het kindje Jezus pas op kerstavond in de kribbe en laat de wijzen op 6 januari aankomen.'],
      ['Welke kerststal is geschikt voor kinderen?', 'Een stevige houten stal waarmee ze mogen spelen. Porselein en steen zijn mooi, maar breken als ze vallen.']] },
    'hypes-2026': { top: [['Hit van het schoolplein', 'bol-9300000236575345'], ['Kleine hype', 'bol-9300000273887351'], ['Voor de fan', 'bol-9300000377799800']], faq: [
      ['Waar zijn kinderen in 2026 gek op?', 'Op de Tamagotchi, die weer helemaal terug is, op alles van KPop Demon Hunters, op verrassingsdoosjes en tashangers, en op Pokémon en Stitch.'],
      ['Wat is een blind box?', 'Een doosje waarvan je niet weet welk figuurtje erin zit. Het uitpakken is de helft van de lol, en kinderen ruilen dubbele figuurtjes vaak met vriendjes.'],
      ['Zijn hypes snel uitverkocht?', 'Ja, rond Sinterklaas en Kerst zijn de populairste dingen vaak als eerste weg. Wacht dus niet te lang.']] },
    'virale-cadeaus-2026': { top: [['Onze topkeuze', 'bol-9300000243481710'], ['Beste koop', 'bol-9300000178746326'], ['Om uit te pakken', 'bol-9300000239958237']], faq: [
      ['Wat zijn de populairste TikTok-cadeaus van 2026?', 'Onder andere de Ninja CREAMi, de Stanley-beker, LEGO-bloemen, de lipolie van Clarins en de Bum Bum Cream van Sol de Janeiro. Ze staan allemaal in deze gids.'],
      ['Is een viraal product ook echt goed?', 'Niet altijd, maar deze komen van bekende merken. Twijfel je? Lees dan de reviews bij de winkel.'],
      ['Waarom zijn LEGO-bloemen zo populair?', 'Ze zijn rustgevend om te bouwen en daarna een mooi stuk decoratie dat nooit verwelkt. Daarom zijn ze ook een hit bij volwassenen.']] },
    'geuren-trends-2026': { top: [['Onze topkeuze', 'bol-9300000183494175'], ['Beste koop', 'bol-9300000318870515'], ['Klassieker', 'bol-9300000170836066']], faq: [
      ['Wat is layeren?', 'Twee geuren over elkaar dragen, zodat je je eigen mix maakt. Bijvoorbeeld een parfumolie of balsem onder je gewone parfum.'],
      ['Welke parfum geef je als je niet weet wat ze mooi vindt?', 'Een ontdekkingsset met kleine flesjes. Dan kan ze zelf uitproberen welke geur ze het mooist vindt.'],
      ['Wat is het verschil tussen eau de parfum en eau de toilette?', 'Eau de parfum bevat meer geurstof en blijft daardoor langer ruiken. Eau de toilette is lichter en meestal wat goedkoper.']] },
    'sinterklaas-onder-15': { top: [['Onze topkeuze', 'bol-9300000178728048'], ['Om te maken', 'bol-9300000071114106'], ['Voor de lootjes', 'bol-9300000155871150']], faq: [
      ['Wat koop je voor 15 euro voor Sinterklaas?', 'Een knutselsetje, een spelletje of een puzzel, of voor volwassenen een mok of iets lekkers. Alles in deze gids blijft onder de 15 euro.'],
      ['Wat geef je een kind van 6 voor Sinterklaas?', 'Iets om te maken of te spelen: armbandjes maken, stenen beschilderen of een dansspel. Zulke cadeaus houden ze dagen zoet.'],
      ['Wanneer moet ik sinterklaascadeaus kopen?', 'Liefst een week of twee van tevoren. Rond 5 december zijn populaire cadeautjes vaak snel uitverkocht.']] },
    'cadeau-voor-collega': { top: [['Onze topkeuze', 'bol-9300000143116033'], ['Klein bedankje', 'bp-l114'], ['Met een knipoog', 'dvzn-990557']], faq: [
      ['Wat geef je een collega voor zijn of haar verjaardag?', 'Iets kleins en attents: lekkers, thee of een plantje voor op het bureau. Voor 10 tot 20 euro heb je al iets leuks.'],
      ['Wat is een goed bedankje voor een collega?', 'Een plantje door de brievenbus of een doos thee. Klein, maar het laat zien dat je de hulp waardeert.'],
      ['Wat geef je als een collega weggaat?', 'Een grappige mok of tegel, een boek waarin iedereen iets schrijft, of samen met het team iets groters. Meer ideeën staan in onze gids Afscheidscadeau voor een collega.']] },
    'kerstcadeau-opa-oma': { top: [['Onze topkeuze', 'bol-1004004000008403'], ['Om te bewaren', 'bol-9300000132852206'], ['Om uit te pakken', 'bol-9300000167329318']], faq: [
      ['Wat geef je opa en oma met Kerst?', 'Iets om samen met de kleinkinderen te doen, zoals Rummikub of sjoelen, iets warms voor de winter, of iets met foto’s van de kleinkinderen.'],
      ['Is een digitale fotolijst makkelijk voor opa en oma?', 'Een fotolijst met wifi is fijn, omdat de familie er zelf foto’s naartoe kan sturen. Zet hem wel samen met hen klaar, dan werkt hij meteen.'],
      ['Wat geef je een oma die zegt dat ze niets nodig heeft?', 'Tijd samen. Een spel, een invulboek met de kleinkinderen of een afspraak voor een dagje uit zegt vaak meer dan een duur cadeau.']] },
    'sfeerlicht-donkere-avonden': { top: [['Onze topkeuze', 'bol-9300000193639901'], ['Beste koop', 'dvzn-6795'], ['Klassieker', 'bol-9300000021560153']], faq: [
      ['Hoe lang moet een lavalamp opwarmen?', 'Meestal een tot twee uur voordat de lava mooi gaat bewegen. Kijk in de handleiding hoe lang hij achter elkaar aan mag staan.'],
      ['Is een sterrenprojector geschikt voor kinderen?', 'Ja, veel kinderen vallen er rustig bij in slaap. Handig is er een met een timer, dan gaat hij vanzelf uit.'],
      ['Welke lamp geeft het meeste sfeer?', 'Warm, gedimd licht laag in de kamer. Een lavalamp of maanlamp naast de bank geeft meer sfeer dan een fel plafondlicht.']] },
    'afscheidscadeau-collega': { top: [['Onze topkeuze', 'amz-9465708399'], ['Met een knipoog', 'bol-9300000242745735'], ['Met het hele team', 'bol-9300000174098365']], faq: [
      ['Hoeveel geef je per persoon voor een afscheidscadeau?', 'Meestal 5 tot 10 euro per persoon. Met een team van tien heb je dan al 50 tot 100 euro voor één mooi cadeau.'],
      ['Wat schrijf je in een afscheidskaart voor een collega?', 'Iets persoonlijks: een herinnering, iets waar jullie om moesten lachen of wat je gaat missen. Sluit af met een wens voor de nieuwe baan.'],
      ['Wanneer geef je het afscheidscadeau?', 'Op de laatste werkdag, met een kort praatje. Een paar zinnen is genoeg.']] },
    'cadeau-voor-pensioen': { top: [['Onze topkeuze', 'bol-9300000171232502'], ['Met een knipoog', 'dvzn-734300'], ['Om te bewaren', 'amz-b0b3tdry1m']], faq: [
      ['Wat geef je iemand die met pensioen gaat?', 'Iets voor de hobby waar nu eindelijk tijd voor is, iets om herinneringen aan het werk te bewaren, of iets grappigs voor op de afscheidsreceptie.'],
      ['Wat is een leuk pensioencadeau van collega’s?', 'Een gastenboek waarin iedereen iets schrijft, samen met een groter cadeau voor de nieuwe hobby, zoals een verrekijker of een fietstas.'],
      ['Wat schrijf je op een pensioenkaart?', 'Bedank voor de fijne samenwerking, noem een mooie herinnering en wens iemand veel plezier met alle vrije tijd.']] },
    'kraamcadeau': { top: [['Onze topkeuze', 'knufk-bambam-pakket'], ['Klein en lief', 'hema-d2cd56c14b'], ['Voor de ouders', 'cl-1000-dagen-vragen']], faq: [
      ['Wat neem je mee op kraamvisite?', 'Een klein cadeautje voor de baby, en liefst ook iets voor de ouders, zoals iets lekkers. Blijf niet te lang: een half uur is meestal genoeg.'],
      ['Hoeveel geef je uit aan een kraamcadeau?', 'Veel mensen geven 15 tot 30 euro. Voor familie of goede vrienden mag het wat meer zijn.'],
      ['Welke maat kleding geef je als kraamcadeau?', 'Liever maat 68 of 74 dan maat 50 of 56. Daar groeien baby’s binnen een paar weken uit, en die kleine maten krijgen ouders al heel veel.']] },
    'housewarming-cadeau': { top: [['Onze topkeuze', 'dvzn-530181'], ['Voor aan tafel', 'tt-country-acc-40291bdfe5'], ['Om te proosten', 'dc-1665638250']], faq: [
      ['Wat neem je mee naar een housewarming?', 'Iets wat het nieuwe huis gezellig maakt: licht, iets voor aan tafel of een fles om op het nieuwe huis te proosten.'],
      ['Hoeveel geef je uit aan een housewarming cadeau?', 'Meestal 15 tot 40 euro per persoon. Met een groep vrienden kun je samen voor één groter cadeau gaan.'],
      ['Wat als ik hun smaak niet ken?', 'Kies iets dat op gaat of dat in elk interieur past, zoals een geurkaars, champagne of een houten serveerplank.']] },
    'cadeau-wijnliefhebber': { top: [['Onze topkeuze', 'dc-2096174492'], ['Beste koop', 'dc-2073674337'], ['Gaat nooit op', 'dc-2163335415']], faq: [
      ['Welke wijn geef je cadeau als je er geen verstand van hebt?', 'Een Rioja Reserva uit Spanje is een veilige keuze: soepel, klassiek en bijna iedereen vindt het lekker.'],
      ['Hoeveel geef je uit aan een fles wijn als cadeau?', 'Tussen de 15 en 25 euro zit je goed. Dan geef je duidelijk iets beters dan de gewone supermarktwijn.'],
      ['Moet een cadeaufles meteen gedronken worden?', 'Nee. Een Reserva of Gran Reserva kan nog een paar jaar liggen. Bewaar de fles liggend, koel en donker.']] },
    'cadeau-hondenliefhebber': { top: [['Onze topkeuze', 'dk-00041518'], ['Beste koop', 'dvzn-474812'], ['Grappigste', 'dvzn-358202']], faq: [
      ['Wat geef je een hondenliefhebber?', 'Iets voor de hond zelf, zoals speelgoed of een mooie mand, of iets voor het baasje, zoals een voerbak die mooi staat in huis.'],
      ['Mag ik hondensnoepjes cadeau geven?', 'Liever niet zonder het te vragen. Veel honden hebben een allergie of volgen een dieet. Speelgoed of een mand is altijd veilig.'],
      ['Welk speelgoed is goed voor een hond die alles kapot maakt?', 'Stevig rubber speelgoed, zoals van KONG. Pluche en stof zijn dan snel stuk.']] },
    'valentijnscadeau-voor-haar': { top: [['Onze topkeuze', 'pry-k729'], ['Rozen die blijven', 'lego-40460'], ['Om te verwennen', 'dk-00031412']], faq: [
      ['Wat geef je je vriendin voor Valentijn?', 'Een sieraad met een hartje, rozen die niet verwelken of een verwenmoment. Met een handgeschreven kaartje erbij zegt het meer dan een duur cadeau.'],
      ['Wanneer is het Valentijnsdag?', 'Elk jaar op 14 februari.'],
      ['Hoeveel geef je uit aan een valentijnscadeau?', 'Dat bepaal je zelf. In deze gids lopen de ideeën van ongeveer 10 tot 180 euro, dus er is voor elk budget iets.']] },
    'valentijnscadeau-voor-hem': { top: [['Onze topkeuze', 'bol-9300000267824769'], ['Om samen te gebruiken', 'bol-9300000170256799'], ['Om uit te pakken', 'bol-9200000076851367']], faq: [
      ['Wat geef je je vriend voor Valentijn?', 'Iets wat hij elke dag gebruikt en dat toch iets van jou zegt: een horloge, een armband of iets met zijn naam erop.'],
      ['Is een romantisch cadeau voor een man niet te zoetsappig?', 'Niet als je iets kiest wat bij hem past. Laat de roze hartjes weg en kies voor leer, hout of iets om samen te doen.'],
      ['Wanneer moet ik een cadeau met naam bestellen?', 'Op tijd: sieraden met een gravure worden vaak speciaal gemaakt en hebben een paar dagen nodig. Kijk bij de winkel naar de levertijd.']] },
    'cadeau-1-jaar-samen': { top: [['Onze topkeuze', 'ww-kaj73364965349'], ['Om samen te doen', 'bol-9300000226609761'], ['Klein gebaar', 'bol-9300000084984419']], faq: [
      ['Wat geef je voor 1 jaar samen?', 'Iets over jullie twee: een sieraad dat jullie allebei dragen, een spel om elkaar nog beter te leren kennen of een avond samen.'],
      ['Moet een jubileumcadeau duur zijn?', 'Nee. Een persoonlijk cadeau met aandacht zegt meer dan een duur cadeau.'],
      ['Hoe vier je een jaar samen?', 'Ga terug naar de plek waar jullie elkaar ontmoetten, of doe nog eens wat jullie op jullie eerste date deden. Het cadeau maakt de dag compleet.']] },
    'cadeau-trouwdag-jubileum': { top: [['Onze topkeuze', 'lego-31214'], ['Persoonlijk', 'bol-9300000074464628'], ['Voor een groot jubileum', 'myka-11001131631']], faq: [
      ['Hoe heet 25 jaar getrouwd?', 'Het zilveren huwelijk. 12,5 jaar getrouwd is het koperen huwelijk, 40 jaar het robijnen en 50 jaar het gouden huwelijk.'],
      ['Wat geef je je ouders voor hun huwelijksjubileum?', 'Iets voor in huis met hun namen, een avond samen vieren of, bij een groot jubileum, een sieraad. Met de hele familie kun je samen iets groters geven.'],
      ['Wat geef je je partner op jullie trouwdag?', 'Iets dat blijft, zoals een sieraad met jullie namen, of iets om samen te doen, zoals een fondue-avond thuis.']] },
    'kinderbijbel-kiezen': { top: [['Onze topkeuze', 'bol-9200000130050250'], ['Voor elke dag', 'bol-9300000130260497'], ['Voor de kleinsten', 'bol-9200000090540712']], faq: [
      ['Welke kinderbijbel past bij welke leeftijd?', 'Voor baby’s en dreumesen een babybijbel met stevige bladzijden. Voor peuters en kleuters korte verhalen met grote plaatjes. Vanaf een jaar of zes een kinderbijbel om voor te lezen of zelf te lezen.'],
      ['Wat is het verschil tussen een voorleesbijbel en een bijbel om zelf te lezen?', 'Een voorleesbijbel heeft langere verhalen om aan kinderen voor te lezen. Een bijbel om zelf te lezen heeft grotere letters en kortere zinnen.'],
      ['Is een kinderbijbel een goed doopcadeau?', 'Ja, een babybijbel is een mooi doopcadeau dat jaren meegaat. Schrijf er een persoonlijke wens voorin.']] }
  };
  GIDSEN.forEach(function (g) { var x = GIDS_EXTRA[g.slug]; if (x) { g.top = x.top; g.faq = x.faq; } });
  /* Rij met cadeaugidsen op de homepage: de eerste 4 uit GIDSEN (zet seizoensgidsen dus bovenaan de lijst). */
  function gidsenRij() {
    if (!GIDSEN.length) return '';
    return '<section class="sectie">' +
      '<div class="sectie-kop"><div><h2>Cadeaugidsen</h2><p>Per gelegenheid de beste ideeën op een rij, met uitleg.</p></div><a class="meer" href="/gids">Alle gidsen ' + ic('pijl') + '</a></div>' +
      '<div class="gidslijst">' + GIDSEN.slice(0, 4).map(gidsKaart).join('') + '</div></section>';
  }
  /* 'Lees ook': gidsen die bij dit vak horen (veld 'vakken' in GIDSEN). Maximaal 3, in de volgorde van GIDSEN. */
  function leesOok(sleutel) {
    var l = GIDSEN.filter(function (g) { return (g.vakken || []).indexOf(sleutel) > -1; }).slice(0, 3);
    if (!l.length) return '';
    return '<nav class="lees-ook" aria-label="Cadeaugidsen">' + ic('vonk') + '<span>Lees ook:</span>' +
      l.map(function (g) { return '<a href="/gids/' + g.slug + '">' + esc(g.titel.split(':')[0]) + '</a>'; }).join('') + '</nav>';
  }
  /* Prijsbereik van een gids, uitgerekend met de prijzen van nu (vaste bedragen in teksten raakten verouderd). */
  function gidsZichtbaar(g) {
    var uit = [];
    g.delen.forEach(function (d) { (d.ids || []).forEach(function (id) { var p = LK.vind(id); if (p && !p.verborgen && p.status === 'goedgekeurd' && uit.indexOf(p) < 0) uit.push(p); }); });
    return uit;
  }
  function gidsBereik(g) {
    var ps = gidsZichtbaar(g).map(function (p) { return p.prijs; }).filter(function (x) { return typeof x === 'number'; });
    if (ps.length < 2) return '';
    return 'Van €' + Math.floor(Math.min.apply(null, ps)) + ' tot €' + Math.ceil(Math.max.apply(null, ps)) + '.';
  }
  function gidsKort(g) {
    var k = g.kort.replace(/\s*Van (€ ?)?[\d.,]+( euro)? tot (€ ?)?[\d.,]+( euro)?\.?/, '').trim(), b = gidsBereik(g);
    return b ? k + ' ' + b : k;
  }
  function gidsKaart(g) {
    /* Kaartbeeld: het product in 'beeld' (met de hand gekozen), anders het eerste product uit de gids. */
    var eerste = (g.beeld && LK.vind(g.beeld)) || g.delen[0].ids.map(function (id) { return LK.vind(id); }).filter(Boolean)[0];
    return '<a class="gidskaart" href="/gids/' + g.slug + '">' + '<span class="gidsbeeld">' + (eerste ? LK.productBeeld(eerste) : '') + '</span>' +
      '<span><strong>' + esc(g.titel) + '</strong><small>' + esc(gidsKort(g)) + '</small></span></a>';
  }
  /* Gidsen 2.0: één cadeau als rij met foto, winkel, naam, de uitleg 'waarom' (uit de productgegevens), prijs en een knop. */
  function gidsItem(p, i) {
    var fav = LK.isFavoriet(p.id), naar = '/p/' + esc(p.id);
    return '<article class="gidsitem">' +
      '<a class="gi-beeld" href="' + naar + '" tabindex="-1" aria-hidden="true">' + LK.productBeeld(p) + '</a>' +
      '<button class="hartje" type="button" data-fav="' + esc(p.id) + '" aria-pressed="' + fav + '" aria-label="' + (fav ? 'Haal van je verlanglijstje' : 'Zet op je verlanglijstje') + '">' + ic('hart') + '</button>' +
      '<div class="gi-info"><span class="shop">' + esc(p.shop) + '</span>' +
        '<h3><a href="' + naar + '">' + esc(p.titel) + '</a></h3>' +
        (p.waarom ? '<p class="gi-waarom">' + esc(p.waarom) + '</p>' : '') +
        '<div class="gi-onder"><span class="prijs">' + LK.euro(p.prijs) + (p.oudePrijs > p.prijs ? ' <s class="oud">' + LK.euro(p.oudePrijs) + '</s>' : '') + '</span>' +
        '<a class="gi-knop" href="' + naar + '">Bekijk' + ic('rechts') + '</a></div>' +
      '</div></article>';
  }
  /* Vak 'Snel kiezen': de 3 favorieten uit de gids (veld 'top' in GIDS_EXTRA: [label, product-id]). Uitverkocht = weggelaten. */
  function gidsTop(g) {
    var t = (g.top || []).map(function (x) { var p = LK.vind(x[1]); return p && !p.verborgen && p.status === 'goedgekeurd' ? [x[0], p] : null; }).filter(Boolean);
    if (!t.length) return '';
    return '<aside class="gids-top" aria-label="Snel kiezen"><div class="gt-kop">' + ic('ster') + '<div><h2>Snel kiezen</h2><p>Weinig tijd? Dit zijn onze ' + (t.length === 3 ? 'drie' : t.length) + ' favorieten uit deze gids.</p></div></div>' +
      '<div class="gt-lijst">' + t.map(function (x) {
        var p = x[1];
        return '<a class="gt-item" href="/p/' + esc(p.id) + '"><span class="gt-beeld">' + LK.productBeeld(p) + '</span>' +
          '<span class="gt-tekst"><em>' + esc(x[0]) + '</em><strong>' + esc(p.titel) + '</strong><span class="prijs">' + LK.euro(p.prijs) + '</span></span>' + ic('rechts') + '</a>';
      }).join('') + '</div></aside>';
  }
  /* Veelgestelde vragen (veld 'faq': [vraag, antwoord]). Klapvakjes, plus FAQ-gegevens zodat Google ze kan tonen. */
  function gidsFaq(g) {
    if (!g.faq || !g.faq.length) return '';
    var ld = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: g.faq.map(function (f) { return { '@type': 'Question', name: f[0], acceptedAnswer: { '@type': 'Answer', text: f[1] } }; }) };
    return '<section class="tekstpagina gids gids-faq" id="vragen"><h2>Veelgestelde vragen</h2>' +
      g.faq.map(function (f) { return '<details><summary>' + esc(f[0]) + ic('omlaag') + '</summary><p>' + esc(f[1]) + '</p></details>'; }).join('') +
      '<script type="application/ld+json">' + JSON.stringify(ld).replace(/</g, '\\u003c') + '</script></section>';
  }
  function gids(slug) {
    if (!slug) {
      zetTitel('Cadeaugidsen');
      window.LK_SEO = 'Cadeaugidsen van LeukeKeuze: per gelegenheid de beste cadeau-ideeën op een rij, met de hand gekozen en in gewone woorden uitgelegd.';
      return paginakop({ titel: 'Cadeaugidsen', tekst: 'Per gelegenheid de beste ideeën op een rij, met uitleg.', kruimel: [{ tekst: 'Cadeaugidsen' }] }) +
        '<div class="binnen"><div class="gidslijst">' + GIDSEN.map(gidsKaart).join('') + '</div></div>';
    }
    var g = GIDSEN.filter(function (x) { return x.slug === slug; })[0];
    if (!g) return nietGevonden();
    zetTitel(g.titel);
    window.LK_SEO = gidsKort(g) + ' ' + g.intro.split('. ')[0] + '.';
    /* Stap 6 indeling (6-11-2026, plan deel 8): intro van 3 zinnen (de rest achter 'Lees verder'), springlinks naar de delen,
       per deel producten 2 naast elkaar, onderaan 'Lees ook' en de link naar het vakje. */
    var zinnen = g.intro.match(/[^.!?]+[.!?]+(\s|$)/g) || [g.intro];
    var introKort = zinnen.slice(0, 3).join('').trim(), introRest = zinnen.slice(3).join('').trim();
    var delenMet = g.delen.map(function (d, i) { return Object.assign({ nr: i + 1 }, d); }).filter(function (d) {
      if (!d.ids) return true;
      d.lijst2 = sfeerEerst(d.ids.map(function (id) { return LK.vind(id); }).filter(function (p) { return p && !p.verborgen && p.status === 'goedgekeurd'; })); /* uitverkochte producten niet tonen */
      return d.lijst2.length > 0;
    });
    var spring = delenMet.length > 1 ? '<nav class="chips vakjesrij omlopend springlinks" aria-label="In deze gids">' + delenMet.map(function (d) { return '<a class="chip" href="#deel-' + d.nr + '">' + esc(d.kop) + '</a>'; }).join('') + (g.faq && g.faq.length ? '<a class="chip" href="#vragen">Vragen</a>' : '') + '</nav>' : '';
    /* Gidsen 2.0 (7-11-2026, opdracht Marius: fraaier, leuker lezen, meer detail): bovenaan leestijd en aantal cadeaus,
       een vak 'Snel kiezen' met onze 3 favorieten, per cadeau de uitleg waarom het een goed cadeau is, tips in een kader
       en onderaan veelgestelde vragen (ook als FAQ-gegevens voor Google). */
    var aantal = delenMet.reduce(function (n, d) { return n + (d.lijst2 ? d.lijst2.length : 0); }, 0);
    var woorden = (g.intro + ' ' + g.delen.map(function (d) { return d.tekst + ' ' + (d.lijst || []).concat(d.stappen || []).join(' '); }).join(' ')).split(/\s+/).length + aantal * 22;
    var meta = '<p class="gids-meta"><span>' + ic('klok') + Math.max(2, Math.round(woorden / 200)) + ' min lezen</span>' +
      (aantal ? '<span>' + ic('cadeau') + aantal + ' cadeaus' + (gidsBereik(g) ? ', ' + gidsBereik(g).replace('Van', 'van').replace('.', '') : '') + '</span>' : '') +
      '<span>' + ic('vink') + 'Bijgewerkt ' + (g.bijgewerkt || 'november 2026') + '</span></p>';
    var h = paginakop({ titel: g.titel, kruimel: [{ tekst: 'Cadeaugidsen', naar: '/gids' }, { tekst: g.titel }] }) +
      '<div class="binnen"><article class="tekstpagina gids">' + meta + '<p class="gids-intro">' + esc(introKort) + '</p>' +
      (introRest ? '<details class="lees-verder"><summary>Lees verder</summary><p>' + esc(introRest) + '</p></details>' : '') + '</article>' +
      gidsTop(g) + '<div class="tekstpagina gids">' + spring + '</div>';
    delenMet.forEach(function (d) {
      /* Een deel kan ook alleen tekst zijn (zonder producten), met een lijstje (veld 'lijst') of genummerde stappen (veld 'stappen'). */
      var extra = (d.lijst ? '<ul class="vinklijst">' + d.lijst.map(function (r) { return '<li>' + ic('vink') + '<span>' + esc(r) + '</span></li>'; }).join('') + '</ul>' : '') +
        (d.stappen ? '<ol class="stappenlijst">' + d.stappen.map(function (r) { return '<li>' + esc(r) + '</li>'; }).join('') + '</ol>' : '');
      if (!d.ids) {
        var tip = /^tip\b/i.test(d.kop) || /^pas op/i.test(d.kop);
        h += '<article class="tekstpagina gids' + (tip ? ' gids-tip' : '') + '" id="deel-' + d.nr + '"><h2>' + (tip ? ic(/^pas op/i.test(d.kop) ? 'info' : 'vonk') : '') + esc(d.kop) + '</h2><p>' + esc(d.tekst) + '</p>' + extra + '</article>';
        return;
      }
      h += '<section class="sectie gids-deel" id="deel-' + d.nr + '"><div class="tekstpagina gids"><h2>' + esc(d.kop) + '</h2><p>' + esc(d.tekst) + '</p>' + extra + '</div>' +
        '<div class="gidsitems">' + d.lijst2.map(gidsItem).join('') + '</div></section>';
    });
    h += gidsFaq(g);
    /* Onderaan: slot, 'Lees ook' (gidsen over hetzelfde vak), de link naar het vakje, en alle gidsen als tekstlink. */
    var verwant = GIDSEN.filter(function (x) { return x !== g && (x.vakken || []).some(function (v) { return (g.vakken || []).indexOf(v) !== -1; }); }).slice(0, 3);
    var vakLink = (g.vakken || []).map(function (v) {
      var d = v.split('/'), cc = window.LK_CAT(d[0]), ss = cc && d[1] ? window.LK_SUB(cc, d[1]) : null;
      if (!cc || cc.verborgen && !cc.naar) return null;
      if (d[1] && !ss) return null;
      var naar = ss ? (ss.naar || (ss.vak ? '/c/' + ss.vak : '/c/' + cc.slug + '/' + ss.slug)) : (cc.naar || '/c/' + cc.slug);
      return [ss ? ss.naam : cc.naam, naar];
    }).filter(Boolean)[0];
    h += '<article class="tekstpagina gids"><p>' + g.slot + '</p><p class="klein">Prijzen kunnen veranderen. De prijs bij de winkel is altijd leidend.</p></article>' +
      (verwant.length ? '<nav class="lees-ook" aria-label="Cadeaugidsen">' + ic('vonk') + '<span>Lees ook:</span>' + verwant.map(function (x) { return '<a href="/gids/' + x.slug + '">' + esc(x.titel.split(':')[0]) + '</a>'; }).join('') + '</nav>' : '') +
      tekstLinks('Verder kijken', (vakLink ? [['Alle ' + vakLink[0].toLowerCase(), vakLink[1]]] : []).concat([['Alle cadeaugidsen', '/gids']])) +
      '</div>';
    return h;
  }

  /* Stap 1 indeling (6-11-2026): een verdwaalde bezoeker krijgt de zoekbalk en de vier ingangen. */
  function nietGevonden(tekst) {
    zetTitel('Niet gevonden');
    return paginakop({ titel: 'Niet gevonden', tekst: tekst || 'Deze pagina bestaat niet (meer). Zoek hieronder, of kies een ingang.' }) +
      '<div class="binnen"><section class="sectie eerste">' + zoekForm('', 'Zoek: lego, parfum, of cadeau voor mama') +
      '<div class="ingangen-404">' +
        '<a class="knop knop-rand" href="/voor">Voor wie?</a><a class="knop knop-rand" href="/categorieen">Categorieën</a>' +
        '<a class="knop knop-rand" href="/gelegenheid">Gelegenheden</a><a class="knop knop-goud" href="/vonk">' + ic('vonk') + ' Help mij kiezen</a>' +
      '</div>' +
      '<p class="klein"><a href="/">Of ga terug naar de homepage</a></p></section></div>';
  }

  /* Subcategorieën die echt iets bevatten. Lege subs (bv. 'Met naam') blijven verborgen tot er producten in staan. */
  function subAdres(c, s) { return s.naar || '/c/' + c.slug + '/' + s.slug; }
  function volleSubs(c) {
    var z = LK.zichtbaar();
    return c.subs.filter(function (s) {
      if (s.verborgen || !nogGeldig(s)) return false;
      return s.slug === 'onder-15' || z.some(function (p) { return LK.hoortBij(p, c.slug, s.slug); });
    });
  }

  /* ================== MENU'S ================== */
  /* Stap 1 indeling (6-11-2026, GO Marius): zes vaste kopjes in deze volgorde. Collecties staan niet meer onder Gelegenheden.
     Cadeaubonnen, Belevenissen en Toppers blijven uit de menu's tot ze kloppen (zie LK_COLLECTIE_VERBORGEN). */
  function bouwLade() {
    var cats = CATS.slice(); /* alle 12 afdelingen, Christelijk als laatste */
    var ladeRij = function (c) {
      return '<li><button class="lade-rij" type="button" aria-expanded="false" aria-controls="ls-' + c.slug + '">' + ic(c.icoon, 'ic') + '<span>' + esc(c.naam) + '</span>' + ic('rechts', 'pijl') + '</button>' +
        '<div class="lade-subs" id="ls-' + c.slug + '"><a class="alles" href="/c/' + c.slug + '">Alles in ' + esc(c.naam) + '</a>' +
        volleSubs(c).map(function (s) { return '<a href="' + subAdres(c, s) + '">' + esc(s.naam) + '</a>'; }).join('') + '</div></li>';
    };
    var link = function (naar, naam) { return '<a href="' + naar + '">' + esc(naam) + '</a>'; };
    $('[data-lade]').innerHTML =
      '<div class="lade-label">Voor wie?</div><div class="lade-personen">' + window.LK_PERSONEN.map(function (x) {
        return '<a href="' + (x.subs ? '/voor/' + x.slug : x.naar) + '"><img src="' + esc(kleinBeeld(x.beeld)) + '" alt="" loading="lazy"><span>' + esc(x.kort) + '</span></a>';
      }).join('') + '</div>' +
      '<div class="lade-label">Categorieën</div><ul>' + cats.map(ladeRij).join('') + '</ul>' +
      '<div class="lade-label">Gelegenheden</div><div class="lade-links">' + window.LK_GELEGENHEDEN_NU().map(function (g) { return link(g.naar || '/gelegenheid/' + g.slug, g.naam); }).join('') + '</div>' +
      '<div class="lade-label">Acties</div><div class="lade-links">' + collectiesVan('acties').map(function (c) { return link('/collectie/' + c.slug, c.naam); }).join('') + '</div>' +
      '<div class="lade-label">Cadeau-ideeën</div><div class="lade-links">' + collectiesVan('ideeen').map(function (c) { return link('/collectie/' + c.slug, c.naam); }).join('') + '</div>' +
      '<div class="lade-label">Meer</div><div class="lade-extra">' + link('/vonk', 'VONK cadeauzoeker') + link('/gids', 'Cadeaugidsen') + link('/winkels', 'Onze winkels') + link('/favorieten', 'Mijn lijstje') + link('/info/hoe-werkt-het', 'Hoe werkt het?') + '</div>';
  }
  /* Collecties in twee groepen: acties (kortingen) en cadeau-ideeën. Verborgen collecties blijven bereikbaar via hun adres. */
  var COLLECTIE_ACTIES = ['black-friday', 'aanbiedingen', 'kortingscodes'];
  function collectiesVan(soort) {
    var verborgen = window.LK_COLLECTIE_VERBORGEN || [];
    return (window.LK_COLLECTIES || []).filter(function (c) {
      if (verborgen.indexOf(c.slug) !== -1) return false;
      var actie = COLLECTIE_ACTIES.indexOf(c.slug) !== -1;
      return soort === 'acties' ? actie : !actie;
    }).sort(function (a, b) { return soort === 'acties' ? COLLECTIE_ACTIES.indexOf(a.slug) - COLLECTIE_ACTIES.indexOf(b.slug) : 0; });
  }
  function bouwMega() {
    $('[data-megamenu]').innerHTML = '<div class="binnen">' + CATS.map(function (c) { /* stap 1 indeling: alle 12 afdelingen, Christelijk als laatste */
      return '<div><h3><a href="/c/' + c.slug + '">' + ic(c.icoon) + esc(c.naam) + '</a></h3><ul>' +
        volleSubs(c).map(function (s) { return '<li><a href="' + subAdres(c, s) + '">' + esc(s.naam) + '</a></li>'; }).join('') + '</ul></div>';
    }).join('') + '</div>';
  }
  var laatsteFocus = null;
  function openLade() {
    laatsteFocus = document.activeElement;
    document.body.classList.add('lade-open');
    $('#lade').setAttribute('aria-hidden', 'false');
    $$('.menuknop').forEach(function (b) { b.setAttribute('aria-expanded', 'true'); });
    setTimeout(function () { var b = $('.lade [data-sluit-lade]'); if (b) b.focus(); }, 60);
    /* extra stap in de geschiedenis: de terugknop van de telefoon sluit dan eerst het menu */
    try { if (!(history.state && history.state.lade)) history.pushState({ lade: 1 }, ''); } catch (e) {}
  }
  function sluitLade() {
    if (!document.body.classList.contains('lade-open')) return;
    document.body.classList.remove('lade-open');
    $('#lade').setAttribute('aria-hidden', 'true');
    $$('.menuknop').forEach(function (b) { b.setAttribute('aria-expanded', 'false'); });
    if (laatsteFocus && document.contains(laatsteFocus)) laatsteFocus.focus();
    /* menu met de hand gesloten: de extra geschiedenis-stap weer weghalen */
    if (!sluitDoorTerug && history.state && history.state.lade) { negeerPop = true; history.back(); }
    sluitDoorTerug = false;
  }
  var sluitDoorTerug = false, negeerPop = false;
  function sluitMega() {
    $('[data-megamenu]').classList.remove('open');
    var b = $('[data-mega]'); if (b) b.setAttribute('aria-expanded', 'false');
  }

  function werkTellersBij() {
    var n = LK.favorieten().filter(function (id) { var p = LK.vind(id); return p && p.status === 'goedgekeurd'; }).length;
    $$('[data-favteller]').forEach(function (t) { t.textContent = n; t.hidden = n === 0; });
  }
  function toast(t) {
    var el = $('[data-toast]'); el.textContent = t; el.classList.add('zichtbaar');
    clearTimeout(toast.t); toast.t = setTimeout(function () { el.classList.remove('zichtbaar'); }, 1800);
  }

  /* ================== ROUTER ================== */
  var vorigeCat = null;
  /* ---------- Partnerwinkels ---------- */
  function winkelFotos(w) {
    if (w.beeld) return '<span class="winkelfotos een"><img src="' + esc(w.beeld) + '" alt="" loading="lazy" decoding="async"></span>';
    var shop = (w.shop || w.naam).toLowerCase();
    var ps = LK.zichtbaar().filter(function (p) { return (p.shop || '').toLowerCase() === shop; });
    ps = ps.slice(-3).reverse(); /* de nieuwste (mooiste) producten van die winkel */
    if (!ps.length) return '';
    return '<span class="winkelfotos">' + ps.map(function (p) { return '<img src="' + esc(p.beeld) + '-klein.webp" alt="" loading="lazy" decoding="async">'; }).join('') + '</span>';
  }
  function winkelKaart(w) {
    var wurl = dcDirect(w.url) ? WINKELSITE[w.naam] : w.url;
    return '<a class="winkelkaart" href="' + esc(wurl) + '" target="_blank" rel="sponsored noopener">' + winkelFotos(w) +
      '<strong>' + esc(w.naam) + '</strong><span>' + esc(w.tekst) + '</span><em>Naar ' + esc(w.naam) + ' ' + ic('pijl') + '</em></a>';
  }
  function winkelsMet(slug) {
    var past = slug ? (WINKEL_SOORT[slug] || [slug]) : null;
    var l = (window.LK_WINKELS || []).filter(function (w) { return w.url && (!past || (w.cats || []).some(function (c) { return past.indexOf(c) !== -1; })) && (!dcDirect(w.url) || WINKELSITE[w.naam]); });
    /* 04-11-2026: tijdens de Daisycon-pauze eerst de winkels waar we wel aan verdienen (bol, TradeTracker, Awin). Volgorde verder zoals in data.js. */
    l = l.filter(function (w) { return !dcDirect(w.url); }).concat(l.filter(function (w) { return dcDirect(w.url); }));
    return l;
  }
  /* Stap 6 indeling (6-11-2026, plan deel 8): Onze winkels compact. Was 82 grote kaarten (21.400 px); wordt korte uitleg,
     knopjes per soort, en rijen van 2 (logo of beginletter, naam, één zin, knop), op alfabet. */
  var WINKEL_SOORT = { 'speelgoed': ['speelgoed'], 'elektronica': ['elektronica'], 'mode-sieraden': ['mode-beauty', 'sieraden'], 'beauty-verzorging': ['geuren-verzorging', 'mode-beauty'],
    'wonen': ['wonen', 'keuken'], 'eten-drinken': ['eten-drinken', 'dranken'], 'hobby': ['hobby', 'metaaldetectie'], 'sport-outdoor': ['sport-outdoor'], 'tuin-klussen': ['tuin-klussen'],
    'boeken-media': ['boeken-media'], 'dieren': ['dieren'], 'christelijk': ['christelijk'] };
  function winkelLogo(w) {
    var code = (window.LK_CODES || []).filter(function (c) { return c.logo && (c.winkel || '').toLowerCase() === w.naam.toLowerCase(); })[0];
    if (w.logo || code) return '<img class="winkel-logo" src="' + esc(w.logo || code.logo) + '" alt="" loading="lazy" decoding="async" width="48" height="48" onerror="this.hidden=true;this.nextSibling.hidden=false"><span class="winkel-letter" aria-hidden="true" hidden>' + esc(w.naam.charAt(0).toUpperCase()) + '</span>';
    return '<span class="winkel-letter" aria-hidden="true">' + esc(w.naam.charAt(0).toUpperCase()) + '</span>';
  }
  function winkels(q) {
    q = q || {};
    zetTitel('Onze winkels');
    var alle = winkelsMet().slice().sort(function (a, b) { return a.naam.toLowerCase().localeCompare(b.naam.toLowerCase(), 'nl'); });
    var soort = q.soort && WINKEL_SOORT[q.soort] ? q.soort : '';
    var lijst = soort ? alle.filter(function (w) { return (w.cats || []).some(function (c) { return WINKEL_SOORT[soort].indexOf(c) !== -1; }); }) : alle;
    var knopjes = '<nav class="chips vakjesrij omlopend" aria-label="Soort winkel"><a class="chip' + (soort ? '' : ' actief') + '" href="/winkels">Alle (' + alle.length + ')</a>' +
      CATS.map(function (c) {
        var n = alle.filter(function (w) { return (w.cats || []).some(function (x) { return WINKEL_SOORT[c.slug].indexOf(x) !== -1; }); }).length;
        return n ? '<a class="chip' + (soort === c.slug ? ' actief' : '') + '" href="/winkels?soort=' + c.slug + '">' + esc(c.kort) + ' (' + n + ')</a>' : '';
      }).join('') + '</nav>';
    return paginakop({ titel: 'Onze winkels', tekst: 'Je koopt bij ' + alle.length + ' bekende winkels. Wij kiezen de cadeaus, de winkel levert.', kruimel: [{ tekst: 'Winkels' }] }) +
      '<div class="binnen"><section class="sectie keuzes-sectie">' + knopjes + '</section>' +
      '<section class="sectie"><div class="winkels-compact">' + lijst.map(function (w) {
        var wurl = dcDirect(w.url) ? WINKELSITE[w.naam] : w.url;
        return '<a class="winkel-rij" href="' + esc(wurl) + '" target="_blank" rel="sponsored noopener">' + winkelLogo(w) +
          '<span class="winkel-tekst"><strong>' + esc(w.naam) + '</strong><small>' + esc(w.tekst) + '</small></span><span class="knop knop-rand winkel-knop">Naar ' + esc(w.naam) + '</span></a>';
      }).join('') + '</div>' +
      '<p class="vonk-noot" style="margin-top:18px">Koop je iets via deze links, dan krijgen wij soms een kleine vergoeding. Jij betaalt niets extra.</p></section></div>';
  }
  var laatstGetoond = null;
  /* Onthoud per pagina hoe ver je gescrold had en hoeveel producten je al open had geklapt ('Toon meer').
     Ga je vanaf een product met de terugknop terug naar de lijst, dan kom je weer op dezelfde plek uit (fijn op mobiel). */
  var plekken = {}, terugViaKnop = false, naarWerkbalk = false, paneelOpen = false, paneelScroll = 0;
  try { if ('scrollRestoration' in history) history.scrollRestoration = 'manual'; } catch (e) {}
  function onthoudPlek() {
    if (laatstGetoond === null) return;
    var g = $('.prodgrid:not(.rij)', app), y = window.scrollY || 0, anker = null, delta = 0;
    /* Onthoud ook welk product bovenaan in beeld stond: foto's laden later na, waardoor pixels verschuiven maar het product niet. */
    if (g) {
      var kaarten = g.querySelectorAll('.prodkaart:not(.later)');
      for (var i = 0; i < kaarten.length; i++) {
        var top = kaarten[i].getBoundingClientRect().top + y;
        if (top + kaarten[i].offsetHeight > y + 60) { var a = kaarten[i].querySelector('[data-fav]'); anker = a ? a.getAttribute('data-fav') : null; delta = y - top; break; }
      }
    }
    plekken[laatstGetoond] = { y: y, n: g ? g.querySelectorAll('.prodkaart:not(.later)').length : 0, anker: anker, delta: delta };
  }
  function herstelPlek() {
    var plek = plekken[huidigAdres()];
    if (!plek) return false;
    var g = $('.prodgrid:not(.rij)', app);
    /* Was je al verder in de lijst ('Toon meer'), dan komen die kaarten er weer bij. */
    if (g && plek.n && g.hasAttribute('data-meer-grid')) {
      var al = g.querySelectorAll('.prodkaart').length;
      if (plek.n > al) toonMeer(g.getAttribute('data-meer-grid'), plek.n - al);
    }
    /* Terug naar hetzelfde product in beeld (niet naar dezelfde pixel: foto's laden na en schuiven alles op). */
    var doel = function () {
      if (plek.anker) { var a = app.querySelector('.prodkaart [data-fav="' + plek.anker.replace(/"/g, '') + '"]'); if (a) { var k = a.closest('.prodkaart'); if (k && !k.classList.contains('later')) return Math.max(0, k.getBoundingClientRect().top + window.scrollY + plek.delta); } }
      return plek.y;
    };
    window.scrollTo(0, doel());
    var start = Date.now(), vorige = window.scrollY;
    (function nogEens() {
      if (Date.now() - start > 1500) return;
      var d = doel();
      if (Math.abs(window.scrollY - vorige) > 40 && Math.abs(window.scrollY - d) > 40) return; /* zelf gescrold: niet tegenwerken */
      if (Math.abs(window.scrollY - d) > 2) window.scrollTo(0, d);
      vorige = window.scrollY;
      setTimeout(nogEens, 120);
    })();
    return true;
  }
  function toon() {
    if (!window.LK_PRODUCTEN) return; /* de productlijst is er nog niet: de HTML van de pagina staat er al */
    onthoudPlek();
    laatstGetoond = huidigAdres();
    var a = leesAdres(), d = a.delen, html;
    /* 2.0: oude persoonspagina's (/c/cadeaus/voor-hem …) gaan door naar /voor/… */
    if (d[0] === 'c' && d[1] === 'cadeaus' && d[2]) {
      var oudNaarNieuw = window.LK_PERSONEN.filter(function (x) { return x.oud === 'cadeaus/' + d[2]; })[0];
      if (oudNaarNieuw) { ga('/voor/' + oudNaarNieuw.slug + (a.q.prijs ? '?prijs=' + a.q.prijs : ''), true); return; }
    }
    /* 2.0: horloges, geuren en verzorging zijn verhuisd uit Mode & Beauty. */
    if (d[0] === 'c' && d[1] === 'mode-beauty' && d[2]) {
      var verhuisdSub = { horloges: '/c/sieraden/horloges', geuren: '/c/geuren-verzorging/geuren', verzorging: '/c/geuren-verzorging/verzorging' }[d[2]];
      if (verhuisdSub) { ga(verhuisdSub + (a.q.prijs ? '?prijs=' + a.q.prijs : ''), true); return; }
    }
    TEL = null; BASIS = null; MEER_LIJSTEN = [];
    if (!d.length) html = home();
    else if (d[0] === 'categorieen') html = alleCategorieen();
    else if (d[0] === 'c') {
      /* 3.0: oude afdelingen en vakjes sturen door naar hun nieuwe plek (adressen die Google en oude links kennen). */
      var oc = window.LK_CAT(d[1]), os = oc && d[2] ? window.LK_SUB(oc, d[2]) : null;
      var naar = (os && os.verborgen && os.naar) || (oc && oc.verborgen && oc.naar && !d[2] ? oc.naar : '');
      if (naar) { ga(naar + (a.q.prijs ? '?prijs=' + a.q.prijs : ''), true); return; }
      html = categorie(d[1], d[2], d[3], a.q);
    }
    else if (d[0] === 'voor') html = d[1] ? persoon(d[1], d[2], a.q) : voorWie();
    else if (d[0] === 'gelegenheid') html = gelegenheidPagina(d[1], d[2], a.q);
    else if (d[0] === 'collectie') html = collectie(d[1], a.q);
    else if (d[0] === 'p') html = product(d[1]);
    else if (d[0] === 'zoek') html = zoeken(a.q);
    else if (d[0] === 'vonk') html = vonk(a.q);
    else if (d[0] === 'favorieten') html = favorieten();
    else if (d[0] === 'lijst') html = gedeeldeLijst(a.q);
    else if (d[0] === 'info') html = info(d[1]);
    else if (d[0] === 'gids') html = gids(d[1]);
    else if (d[0] === 'winkels') html = winkels(a.q);
    else html = nietGevonden();

    // Onthoud waar de schuifbalk met subcategorieën stond (mobiel), zodat hij niet terugspringt.
    var oudeRij = $('.subkaarten', app), oudeScroll = oudeRij ? oudeRij.scrollLeft : 0;
    var zelfdeCat = d[0] === 'c' && vorigeCat === d[1];

    app.innerHTML = html;
    document.body.classList.remove('plak-open');
    /* Witte zoekbalk onder de kop: overal zichtbaar, behalve op de zoekpagina (die heeft er zelf al een). */
    var zr = $('[data-zoekrij]');
    if (zr) zr.hidden = d[0] === 'zoek';
    vulIconen(app); netteLinks(app);
    var aw = $('[data-alle-winkels]', app);
    if (aw) {
      /* Op een telefoon is het bestand met álle winkelproducten groot (zoekpagina). Daar laden we het pas als je erom vraagt;
         categoriepagina's hebben een klein eigen bestand en laden meteen. */
      var groot = !aw.getAttribute('data-sleutel') && window.matchMedia && window.matchMedia('(max-width: 759px)').matches && !AW.laden['assets/zoek/alle.json.gz'];
      if (groot) {
        $('.aw-inhoud', aw).innerHTML = '<div class="aw-laadknop"><button class="knop knop-rand" type="button" data-aw-laad>Zoek ook in onze winkels ' + ic('pijl') + '</button>' +
          '<p class="uitleg">Doorzoekt ruim 250.000 producten van onze partnerwinkels. Dat is een groot bestand, dus het laden duurt even.</p></div>';
        aw.addEventListener('click', function (e) { if (e.target.closest('[data-aw-laad]')) { $('.aw-inhoud', aw).innerHTML = '<p class="aw-laden">Even zoeken in alle winkels…</p>'; vulAlleWinkels(aw); } });
      } else if (aw.getAttribute('data-sleutel') && 'IntersectionObserver' in window) {
        /* Pas laden als je bijna onderaan bent: bovenaan blijft de pagina net zo snel. */
        var awKijker = new IntersectionObserver(function (es) {
          if (es.some(function (e) { return e.isIntersecting; })) { awKijker.disconnect(); vulAlleWinkels(aw); }
        }, { rootMargin: '900px 0px' });
        awKijker.observe(aw);
      } else vulAlleWinkels(aw);
    }

    /* Plakbalk op de productpagina: alleen tonen als de echte knop uit beeld is (en alleen op kleine schermen, zie css). */
    var plak = $('[data-plak]', app), acties = $('[data-acties]', app);
    if (plak && acties && 'IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        var uitBeeld = es[0].boundingClientRect.bottom < 0 && !es[0].isIntersecting;
        plak.classList.toggle('zichtbaar', uitBeeld); plak.setAttribute('aria-hidden', String(!uitBeeld));
        document.body.classList.toggle('plak-open', uitBeeld);
        $$('a', plak).forEach(function (x) { x.tabIndex = uitBeeld ? 0 : -1; });
      }, { threshold: 0 }).observe(acties);
    }

    var fk = $('.filterknop[data-filter-open]', app), wb = $('.werkbalk', app);
    /* Na kiezen in het filterpaneel: terug naar het begin van de lijst, zodat je de nieuwe resultaten ziet. */
    /* Keuze gemaakt in het paneel: het nieuwe paneel meteen weer open, op dezelfde plek (zonder schuifbeweging). */
    if (paneelOpen) { paneelOpen = false; var np = $('[data-filterpaneel]', app);
      if (np) { var nb = $('.filter-blad', np); np.hidden = false; if (nb) nb.style.transition = 'none'; np.classList.add('open');
        if (nb) { nb.scrollTop = paneelScroll; requestAnimationFrame(function () { requestAnimationFrame(function () { nb.style.transition = ''; }); }); } } }
    if (naarWerkbalk && wb) { naarWerkbalk = false; var kopH = ($('.header') || { getBoundingClientRect: function () { return { height: 60 }; } }).getBoundingClientRect().height;
      window.scrollTo(0, Math.max(0, wb.getBoundingClientRect().top + window.scrollY - kopH - 8)); }
    if (fk && wb && 'IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        var uit = !es[0].isIntersecting && es[0].boundingClientRect.bottom < 0;
        fk.classList.toggle('zichtbaar', uit); fk.setAttribute('aria-hidden', String(!uit)); fk.tabIndex = uit ? 0 : -1;
      }, { threshold: 0 }).observe(wb);
    }

    var rij = $('.subkaarten', app);
    if (rij) {
      if (zelfdeCat) rij.scrollLeft = oudeScroll;
      var actief = $('.subkaart.actief', rij);
      if (actief && rij.scrollWidth > rij.clientWidth) {
        var r1 = rij.getBoundingClientRect(), r2 = actief.getBoundingClientRect();
        var doel = rij.scrollLeft + (r2.left - r1.left) - (r1.width - r2.width) / 2;
        try { rij.scrollTo({ left: Math.max(0, doel), behavior: zelfdeCat ? 'smooth' : 'auto' }); } catch (e) { rij.scrollLeft = Math.max(0, doel); }
      }
    }
    vorigeCat = d[0] === 'c' ? d[1] : null;
    sluitLade(); sluitMega();

    // Actieve menu-items
    var huidigeCat = d[0] === 'c' ? d[1] : (d[0] === 'vonk' ? 'vonk' : '');
    $$('[data-nav]').forEach(function (n) { if (n.dataset.nav === huidigeCat) n.setAttribute('aria-current', 'page'); else n.removeAttribute('aria-current'); });
    var onder = !d.length ? 'home' : d[0] === 'vonk' ? 'vonk' : d[0] === 'favorieten' ? 'favorieten' : (d[0] === 'c' || d[0] === 'categorieen') ? 'categorieen' : '';
    $$('[data-onder]').forEach(function (n) { if (n.dataset.onder === onder) n.setAttribute('aria-current', 'page'); else n.removeAttribute('aria-current'); });

    // Terug (of vooruit) met de knop van de browser: naar de plek waar je was.
    var hersteld = terugViaKnop && herstelPlek();
    terugViaKnop = false;
    // Alleen naar boven als je naar een andere pagina gaat (niet bij filteren)
    if (a.pad !== vorigPad && !hersteld) {
      var grid = zelfdeCat && d[2] ? $('.prodgrid', app) : null;
      if (grid) {
        /* Subcategorie gekozen binnen dezelfde categorie: net onder de rondjes uitkomen, bij de soorten en filters,
           zodat je je zoektocht meteen kunt verfijnen (wens Marius 5-11-2026; eerst sprong hij voorbij de filters naar de producten). */
        var kop = $('.header') || $('header');
        var hoogte = kop ? kop.getBoundingClientRect().height : 70;
        var doelEl = $('.vakjesrij', app) || $('.keuzes-blok', app) || $('.werkbalk', app) || grid;
        var doelY = doelEl.getBoundingClientRect().top + window.scrollY - hoogte - 10;
        var rustig = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        window.scrollTo({ top: Math.max(0, doelY), behavior: rustig ? 'auto' : 'smooth' });
      } else window.scrollTo(0, 0);
      if (vorigPad !== null) app.focus({ preventScroll: true });
    }
    /* VONK: na een keuze (of 'Vorige vraag') niet naar de bovenkant springen, maar de volgende vraag
       netjes onder de vaste kopbalk zetten. De hoogte van die balk meten we, dus elk scherm klopt. (wens Marius 2-11-2026) */
    if (d[0] === 'vonk' && a.pad === vorigPad && location.search !== vorigeVonk && !hersteld) {
      var rustigV = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      var vp = $('.vonk-pagina', app), kopV = $('.header');
      var kopH = kopV ? kopV.getBoundingClientRect().height : 60;
      var doelV = vp ? vp.getBoundingClientRect().top + window.scrollY - kopH - 10 : 0;
      if (Math.abs(window.scrollY - doelV) > 4) window.scrollTo({ top: Math.max(0, doelV), behavior: rustigV ? 'auto' : 'smooth' });
    }
    vorigeVonk = d[0] === 'vonk' ? location.search : null;
    vorigPad = a.pad;
    if (typeof bewaakHome === 'function') bewaakHome();
    try { window.dispatchEvent(new Event('lk-route')); } catch (e) {}
  }

  /* ================== TRADETRACKER-REFERENTIE ================== */
  /* TradeTracker-links hebben een leeg referentie-vakje (r= of achteraan tt=). Vlak voor de klik vullen we dat met het product
     (op een productpagina) of met de soort link en de pagina. In TradeTracker > Transacties staat dat dan in de kolom
     'Referentie', zodat Marius bij een verkoop ziet via welk product of welke pagina die kwam. Geen persoonsgegevens. */
  (function () {
    function vulRef(e) {
      var a = e.target && e.target.closest && e.target.closest('a[href]'); if (!a) return;
      /* Twee vormen: …&a=516846&r=&u=… en bij winkels met een eigen doorstuurlink …?tt=campagne_materiaal_516846_ (referentie achteraan). */
      var href = a.href, gewoon = /[?&]a=516846&r=(&|$)/.test(href), tt = /[?&]tt=\d+_\d+_516846_(?=&|#|$)/.test(href);
      if (!gewoon && !tt) return;
      var id = (location.pathname.match(/\/p\/([^\/]+)/) || [])[1];
      var pad = location.pathname.replace(/^\/+|\/+$/g, '').replace(/\//g, '-') || 'home';
      var soort = a.closest('.awkaart') ? 'feed' : a.classList.contains('winkelkaart') ? 'winkel' : a.classList.contains('geef') ? 'lijst' : '';
      var ref = id && !soort ? id : (soort || 'link') + '-' + pad;
      ref = ref.replace(/[^A-Za-z0-9-]/g, '').slice(0, 80); if (!ref) return;
      a.href = gewoon ? href.replace(/([?&]a=516846&r=)(?=&|$)/, '$1' + ref) : href.replace(/([?&]tt=\d+_\d+_516846_)(?=&|#|$)/, '$1' + ref);
    }
    ['mousedown', 'click', 'auxclick', 'contextmenu', 'keydown'].forEach(function (t) { document.addEventListener(t, vulRef, true); });
  })();

  /* ================== BEZOEKERSTELLER ================== */
  /* GoatCounter telt de eerste pagina zelf bij het laden. Klik je daarna binnen de site door (zonder herladen),
     dan geven we elke nieuwe pagina hier door. Zonder cookies; alleen het adres en de titel van de pagina. */
  (function () {
    var eerste = true;
    /* 02-11-2026 (Marius): onthouden via welk deel van de site iemand bij een winkel uitkomt (VONK, gids, Sinterklaas, zoeken...).
       Alleen in het geheugen van dit tabblad; geen cookies, geen persoonsgegevens. */
    var herkomst = (function () {
      var r = ''; try { r = document.referrer ? new URL(document.referrer).hostname : ''; } catch (e) {}
      if (r && r.indexOf('leukekeuze') === -1) return 'van buiten: ' + r.replace(/^www\./, '').replace(/^(l|m|lm)\./, '').split('.').slice(-2, -1)[0];
      return 'rechtstreeks';
    })();
    function deelVan(pad) {
      pad = (pad || '/').replace(/\/+$/, '');
      if (!pad) return 'homepage';
      if (/^\/p\//.test(pad)) return '';
      return pad.slice(1);
    }
    var nu = deelVan(location.pathname); if (nu) herkomst = nu;
    window.addEventListener('lk-route', function () {
      var d = deelVan(location.pathname); if (d) herkomst = d;
      if (eerste) { eerste = false; return; }
      try { if (window.goatcounter && window.goatcounter.count) window.goatcounter.count({ path: location.pathname + location.search, title: document.title }); } catch (e) {}
    });
    function netwerk(h) {
      h = h || '';
      if (/partner\.bol\.com|\/\/(www\.)?bol\.com/.test(h)) return 'bol';
      if (/amazon\./.test(h)) return 'Amazon';
      if (/[?&]tt=|tradetracker|[?&]a=516846\b|_516846_/.test(h)) return 'TradeTracker';
      if (/awin1\.com|awin\./.test(h)) return 'Awin';
      if (typeof isDaisycon === 'function' && isDaisycon(h)) return 'Daisycon';
      return 'zonder partnerlink';
    }
    function schoon(t) { return String(t || '').replace(/[\/?#]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 60); }
    /* Klik naar een winkel ('Bekijk bij bol', winkeltegel, product uit 'Zoek in alle winkels', 'Dit cadeau geven'): als 'gebeurtenis' tellen.
       klik/<winkel>/<product>  = welk product bij welke winkel (zoals eerst)
       bron/<deel van de site>/<netwerk>/<winkel> = via welk deel van de site, naar welk netwerk en welke winkel (nieuw 02-11-2026) */
    document.addEventListener('click', function (e) {
      var a = e.target.closest('a[rel~="sponsored"]'); if (!a || !window.goatcounter || !window.goatcounter.count) return;
      var pad = '', titel = '', winkel = '', prod = null;
      var kaart = a.closest('.product-info, .product-plak');
      var ck = a.closest('.cadeaukaart');
      if (kaart) { var id = (location.pathname.match(/\/p\/([^\/]+)/) || [])[1] || ''; var p = id && LK.vind(id); if (p) { prod = p; winkel = p.shop; pad = 'klik/' + p.shop + '/' + p.id; titel = p.shop + ': ' + p.titel; } }
      else if (a.classList.contains('winkelkaart')) { winkel = schoon((a.querySelector('strong') || {}).textContent); pad = 'klik/winkel/' + winkel; titel = 'Winkeltegel: ' + winkel; }
      else if (a.closest('.awkaart')) { var k = a.closest('.awkaart'); winkel = schoon((k.querySelector('.shop') || {}).textContent); pad = 'klik/feed/' + winkel; titel = 'Uit alle winkels: ' + (k.querySelector('h3') || {}).textContent; }
      else if (a.closest('.aw-bol')) { winkel = 'bol'; pad = 'klik/feed/bol-zoeken'; titel = 'Zoek ook op bol'; }
      else if (ck) { var pid = ((ck.querySelector('a.beeld') || {}).getAttribute ? ck.querySelector('a.beeld').getAttribute('href') : '').replace(/^\/p\/|\/$/g, ''); var q = pid && LK.vind(pid); prod = q || null; winkel = q ? q.shop : schoon((ck.querySelector('.shop') || {}).textContent); pad = 'klik/' + winkel + '/' + (q ? q.id : 'lijst'); titel = 'Verlanglijstje: ' + (q ? q.titel : winkel); }
      else { try { winkel = new URL(a.href).hostname.replace(/^www\./, ''); } catch (x) { winkel = 'onbekend'; } pad = 'klik/overig/' + winkel; titel = 'Andere winkellink: ' + winkel; }
      if (!pad) return;
      try { window.goatcounter.count({ path: pad, title: titel.slice(0, 120), event: true }); } catch (x) {}
      var net = netwerk(a.href);
      /* Daisycon staat op pauze: dan gaat de knop rechtstreeks naar de winkel en verdienen we (nog) niets. Apart tonen. */
      if (net === 'zonder partnerlink' && prod && netwerk(prod.url) === 'Daisycon') net = 'Daisycon-pauze';
      var bron = 'bron/' + herkomst + '/' + net + '/' + (winkel || 'onbekend');
      try { window.goatcounter.count({ path: bron.slice(0, 180), title: 'Via ' + herkomst + ' naar ' + (winkel || 'winkel') + ' (' + net + ')', event: true }); } catch (x) {}
    }, true);
    /* Stap 1 homepage (6-11-2026): klikken per blok op de homepage tellen, zodat we over een paar weken zien welke blokken werken.
       home/<blok>/<doel> (blok = intro, voor-wie, favorieten, ...; doel = product-id of het adres waar de klik heen gaat). */
    document.addEventListener('click', function (e) {
      if (location.pathname !== '/' && location.pathname !== '/index.html') return;
      var a = e.target.closest('a, button'); if (!a || !window.goatcounter || !window.goatcounter.count) return;
      var blok = a.closest('[data-tel]'); if (!blok) return;
      var naam = blok.getAttribute('data-tel'), kaart = a.closest('.prodkaart'), doel = '';
      if (kaart) { var fav = kaart.querySelector('[data-fav]'); doel = fav ? fav.getAttribute('data-fav') : 'product'; if (a.hasAttribute('data-fav')) doel = 'hartje/' + doel; }
      else doel = schoon((a.getAttribute('href') || a.textContent || '').replace(/^\/|\/$/g, '')) || 'knop';
      try { window.goatcounter.count({ path: ('home/' + naam + '/' + doel).slice(0, 180), title: ('Homepage ' + naam + ': ' + (a.textContent || doel).replace(/\s+/g, ' ').trim()).slice(0, 120), event: true }); } catch (x) {}
    }, true);
  })();

  /* ================== TERUG NAAR BOVEN ================== */
  (function () {
    var knop = document.querySelector('[data-naarboven]');
    if (!knop) return;
    var vulling = knop.querySelector('.vulling'), bezig = false;
    function bijwerken() {
      bezig = false;
      var y = window.scrollY || document.documentElement.scrollTop;
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var aan = y > 700;
      knop.classList.toggle('zichtbaar', aan);
      knop.tabIndex = aan ? 0 : -1;
      if (vulling) vulling.style.strokeDashoffset = String(100 - Math.min(100, max > 0 ? (y / max) * 100 : 0));
    }
    window.addEventListener('scroll', function () { if (!bezig) { bezig = true; requestAnimationFrame(bijwerken); } }, { passive: true });
    window.addEventListener('lk-route', function () { setTimeout(bijwerken, 50); });
    knop.addEventListener('click', function () {
      var rustig = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, behavior: rustig ? 'auto' : 'smooth' });
    });
    bijwerken();
  })();

  /* ================== TERUGKNOP ================== */
  /* 1. Staat het menu open? Dan sluit de terugknop het menu (je blijft op de site).
     2. Op de homepage (als je daar binnenkwam): twee keer snel op terug om de site te verlaten. */
  var startOpHome = !leesAdres().delen.length, laatsteTerug = 0;
  function bewaakHome() {
    if (!startOpHome || leesAdres().delen.length) return;
    try {
      if (!(history.state && (history.state.wacht || history.state.lade))) {
        history.replaceState({ basis: 1 }, '');
        history.pushState({ wacht: 1 }, '');
      }
    } catch (e) {}
  }
  window.addEventListener('popstate', function (e) {
    if (negeerPop) { negeerPop = false; return; }
    if (huidigAdres() !== laatstGetoond) { terugViaKnop = true; toon(); return; }
    if (document.body.classList.contains('lade-open')) { sluitDoorTerug = true; sluitLade(); return; }
    var st = e.state || {};
    if (st.basis && startOpHome && !leesAdres().delen.length) {
      var nu = Date.now();
      if (nu - laatsteTerug < 2000) { history.back(); return; }
      laatsteTerug = nu;
      toast('Tik nog een keer op terug om LeukeKeuze te verlaten');
      try { history.pushState({ wacht: 1 }, ''); } catch (err) {}
    }
  });

  /* ================== KLIKKEN ================== */
  document.addEventListener('click', function (e) {
    var t = e.target.closest('a, button');
    if (!t) { if (!e.target.closest('.megamenu')) sluitMega(); return; }

    if (t.hasAttribute('data-fav')) {
      e.preventDefault();
      var id = t.getAttribute('data-fav'), aan = LK.wisselFavoriet(id);
      $$('[data-fav="' + id + '"]').forEach(function (b) {
        b.setAttribute('aria-pressed', String(aan));
        b.setAttribute('aria-label', aan ? 'Haal van je verlanglijstje' : 'Zet op je verlanglijstje');
      });
      werkTellersBij();
      toast(aan ? 'Op je verlanglijstje gezet' : 'Van je verlanglijstje gehaald');
      if (leesAdres().delen[0] === 'favorieten') toon();
      return;
    }
    if (t.hasAttribute('data-maat')) {
      e.preventDefault();
      var box = t.closest('[data-maten]'), mp = box && LK.vind(box.getAttribute('data-pid'));
      if (mp) {
        var mvs = (mp.varianten || []).filter(function (x) { return x && x.beeld; }), mv = mvs[+box.getAttribute('data-v')] || mp;
        var mm = ((mv && mv.maten) || mp.maten || [])[+t.getAttribute('data-maat')];
        if (mm) {
          $$('[data-maat]', box).forEach(function (b) { b.setAttribute('aria-pressed', String(b === t)); });
          var mn = $('[data-maat-naam]', box); if (mn) mn.textContent = mm.maat;
          if (mm.prijs) $$('[data-variant-prijs]').forEach(function (el) { el.innerHTML = LK.euro(mm.prijs); });
          var ml = winkelLink(mm); if (ml) $$('a[data-winkel]').forEach(function (a) { a.href = ml; });
        }
      }
      return;
    }
    if (t.hasAttribute('data-code')) { var cd = t.getAttribute('data-code');
      try { if (navigator.clipboard) navigator.clipboard.writeText(cd); } catch (er) {}
      toast('Code ' + cd + ' gekopieerd. Plak hem bij het afrekenen.'); return; }
    if (t.hasAttribute('data-lijst-whatsapp')) { var w = lijstVanDeel(); window.open('https://wa.me/?text=' + encodeURIComponent(w.bericht), '_blank', 'noopener'); return; }
    if (t.hasAttribute('data-lijst-kopieer')) { var w2 = lijstVanDeel();
      var klaar = function () { toast('Link gekopieerd. Plak hem in een bericht.'); };
      if (navigator.clipboard) navigator.clipboard.writeText(w2.bericht).then(klaar, function () { prompt('Kopieer deze link:', w2.link); }); else prompt('Kopieer deze link:', w2.link);
      return; }
    if (t.closest('[data-filterpaneel]') && t.tagName === 'A') { naarWerkbalk = true; paneelOpen = !t.closest('.vonk-paneel'); var bl = t.closest('.filter-blad'); paneelScroll = bl ? bl.scrollTop : 0; }
    if (t.hasAttribute('data-filter-open')) { var fp = $('[data-filterpaneel]'); if (fp) { fp.hidden = false; requestAnimationFrame(function () { fp.classList.add('open'); }); } return; }
    if (t.hasAttribute('data-filter-dicht')) { var fp2 = $('[data-filterpaneel]'); if (fp2) { fp2.classList.remove('open'); setTimeout(function () { fp2.hidden = true; }, 250); } return; }
    if (t.hasAttribute('data-open-lade')) { openLade(); return; }
    if (t.hasAttribute('data-sluit-lade')) { sluitLade(); return; }
    if (t.hasAttribute('data-mega')) {
      var open = !$('[data-megamenu]').classList.contains('open');
      var mm = $('[data-megamenu]');
      mm.classList.toggle('open', open);
      /* Menu nooit langer dan het scherm: wat niet past, kun je in het menu zelf scrollen. */
      if (open) mm.style.maxHeight = Math.max(240, window.innerHeight - mm.getBoundingClientRect().top - 8) + 'px';
      t.setAttribute('aria-expanded', String(open));
      return;
    }
    if (t.classList.contains('lade-rij')) {
      var uit = t.getAttribute('aria-expanded') === 'true';
      t.setAttribute('aria-expanded', String(!uit));
      document.getElementById(t.getAttribute('aria-controls')).classList.toggle('open', !uit);
      return;
    }
    if (t.hasAttribute('data-kleur-stap')) {
      var gv = $('[data-varianten]'), rv = gv && $('.galerij-rij', gv);
      if (rv) rv.scrollTo({ left: parseInt(t.getAttribute('data-kleur-stap'), 10) * rv.clientWidth, behavior: 'smooth' });
      return;
    }
    if (t.hasAttribute('data-galerij-stap')) {
      var g = t.closest('[data-galerij]'), rij = $('.galerij-rij', g);
      var n = rij.children.length, nu = Math.round(rij.scrollLeft / Math.max(1, rij.clientWidth));
      var doel = (nu + parseInt(t.getAttribute('data-galerij-stap'), 10) + n) % n;
      rij.scrollTo({ left: doel * rij.clientWidth, behavior: 'smooth' });
      return;
    }
    if (t.hasAttribute('data-catrij')) {
      var rij = t.parentNode.querySelector('.catrij');
      if (rij) rij.scrollBy({ left: (+t.getAttribute('data-catrij')) * rij.clientWidth * 0.8, behavior: 'smooth' });
      return;
    }
    if (t.hasAttribute('data-vonk-deel')) {
      var url = location.origin + t.getAttribute('data-vonk-deel'), tekst = 'Kijk, deze cadeaus koos VONK op LeukeKeuze:';
      if (navigator.share) { navigator.share({ title: 'Cadeau-ideeën van VONK', text: tekst, url: url }).catch(function () {}); }
      else { window.open('https://wa.me/?text=' + encodeURIComponent(tekst + ' ' + url), '_blank', 'noopener'); }
      return;
    }
    if (t.hasAttribute('data-meer')) { toonMeer(t.getAttribute('data-meer')); return; }
    if (t.hasAttribute('data-keuzes-meer')) {
      var kz = t.parentNode.querySelector('.keuzes'); if (kz) kz.classList.remove('ingeklapt');
      t.remove();
      return;
    }
    if (t.dataset.tab) {
      $$('[data-tab]').forEach(function (b) { b.setAttribute('aria-pressed', String(b === t)); });
      $('[data-uitgelicht]').innerHTML = uitgelicht(t.dataset.tab);
      return;
    }
    if (!t.closest('.megamenu')) sluitMega();
    // Zelfde adres opnieuw aanklikken: lade/menu wel sluiten
    // Interne link: zonder herladen naar de nieuwe pagina
    if (t.tagName === 'A') {
      var href = t.getAttribute('href') || '';
      if (href.charAt(0) === '/' && href.charAt(1) !== '/' && !t.target && !t.hasAttribute('download') &&
          !e.defaultPrevented && e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) {
        e.preventDefault();
        if (netjes(href) === huidigAdres()) { sluitLade(); sluitMega(); }
        else ga(href);
      }
    }
  });
  document.querySelector('.lade-bg').addEventListener('click', sluitLade);

  /* Tips onder de zoekbalk terwijl je typt: de beste 6 producten met fotootje en prijs, en een regel 'Toon alles'. */
  var tipTimer = null;
  function sluitTips(f) { var t = f && f.querySelector('.zoek-tips'); if (t) t.remove(); }
  function toonTips(f) {
    var inp = f.querySelector('input'), q = inp.value.trim();
    if (q.length < 2) { sluitTips(f); return; }
    var woorden = zoekWoorden(q), lijst = zoekLijst(woorden, '');
    var sc = {}; lijst.forEach(function (p) { sc[p.id] = zoekScore(p, woorden); });
    lijst.sort(function (a, b) { return sc[b.id] - sc[a.id]; });
    var html = paginaTips(woorden).slice(0, 4).map(function (t) {
      return '<a class="zt-item zt-pagina" href="' + t.naar + '"><span class="zt-ic">' + ic('rechts') + '</span><span class="zt-titel">' + t.naam + '</span></a>';
    }).join('');
    html += lijst.slice(0, 5).map(function (p) {
      return '<a class="zt-item" href="/p/' + esc(p.id) + '"><img src="' + esc(p.beeld) + '-klein.webp" alt="" loading="lazy">' +
        '<span class="zt-titel">' + esc(p.titel) + '</span><span class="zt-prijs">' + LK.euro(p.prijs) + '</span></a>';
    }).join('');
    html += '<a class="zt-alles" href="' + esc(maakAdres('/zoek', { q: q })) + '">' + (lijst.length ? 'Toon alle ' + lijst.length + ' resultaten voor “' + esc(q) + '”' : 'Zoek “' + esc(q) + '” ook in al onze winkels') + ' ' + ic('pijl') + '</a>';
    var t = f.querySelector('.zoek-tips');
    if (!t) { t = document.createElement('div'); t.className = 'zoek-tips'; t.setAttribute('role', 'listbox'); f.appendChild(t); }
    t.innerHTML = html;
  }
  document.addEventListener('input', function (e) {
    var f = e.target.closest && e.target.closest('[data-zoek]');
    if (!f) return;
    clearTimeout(tipTimer); tipTimer = setTimeout(function () { toonTips(f); }, 120);
  });
  document.addEventListener('keydown', function (e) {
    var f = e.target.closest && e.target.closest('[data-zoek]');
    if (!f) return;
    var t = f.querySelector('.zoek-tips');
    if (e.key === 'Escape') { sluitTips(f); return; }
    if (!t || (e.key !== 'ArrowDown' && e.key !== 'ArrowUp')) return;
    var items = Array.prototype.slice.call(t.querySelectorAll('a')), i = items.indexOf(document.activeElement);
    e.preventDefault();
    i = e.key === 'ArrowDown' ? Math.min(items.length - 1, i + 1) : i - 1;
    if (i < 0) f.querySelector('input').focus(); else items[i].focus();
  });
  document.addEventListener('focusout', function (e) {
    var f = e.target.closest && e.target.closest('[data-zoek]');
    if (f) setTimeout(function () { if (!f.contains(document.activeElement)) sluitTips(f); }, 150);
  });
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('.zoek-tips a');
    if (a) { var f = a.closest('[data-zoek]'); setTimeout(function () { sluitTips(f); if (f) f.querySelector('input').blur(); }, 0); }
  });

  document.addEventListener('submit', function (e) {
    var v = e.target.closest('[data-vonk-typ]');
    if (v) { e.preventDefault(); var zin = v.querySelector('input').value.trim(); if (zin) ga(maakAdres('/vonk', Object.assign(vonkLees(zin), { zin: zin }))); return; }
    var f = e.target.closest('[data-zoek]');
    if (!f) return;
    e.preventDefault();
    var q = f.querySelector('input').value.trim();
    /* Eén slimme zoekbalk (01-11-2026): noemt de zin een persoon, budget, leeftijd of moment ('collega', 'oma max €25'),
       dan kiest VONK. Een los woord ('lego', 'kaars') gaat naar de gewone zoekresultaten. */
    var vl = q ? vonkLees(q) : null;
    if (vl && (vl.voor !== 'iedereen' || vl.budget !== 'geen' || vl.moment !== 'iedereen' || vl.leeftijd || vl.soort)) {
      sluitTips(f); f.querySelector('input').blur();
      ga(maakAdres('/vonk', Object.assign(vl, { zin: q }))); return;
    }
    var huidig = leesAdres();
    var nq = { q: q, prijs: huidig.delen[0] === 'zoek' ? huidig.q.prijs : '' };
    sluitTips(f);
    ga(maakAdres('/zoek', nq));
    f.querySelector('input').blur();
  });
  /* 'Lees verder' op een categoriekaart: tekst open/dicht, zonder de kaart te volgen. */
  function leesVerder(e) {
    var b = e.target.closest && e.target.closest('[data-lees]'); if (!b) return;
    if (e.type === 'keydown' && e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault(); e.stopPropagation();
    var t = b.parentNode, open = t.classList.toggle('lees-open');
    b.textContent = open ? 'Minder lezen' : 'Lees verder';
  }
  document.addEventListener('click', leesVerder, true);
  document.addEventListener('keydown', leesVerder, true);
  document.addEventListener('click', function (e) {
    var k = e.target.closest && e.target.closest('[data-verras]');
    if (!k || !verrasIds.length) return;
    var huidig = (location.pathname.match(/^\/p\/([^\/]+)/) || [])[1];
    var keus = verrasIds.filter(function (id) { return id !== huidig; });
    ga('/p/' + keus[Math.floor(Math.random() * keus.length)]);
  });
  document.addEventListener('change', function (e) {
    if (e.target.matches('[data-vonk-hobby]')) {
      var hb = e.target.getAttribute('data-vonk-hobby'), hv = e.target.value;
      ga(hv ? hb.replace('__H__', encodeURIComponent(hv)) : hb.replace(/[?&]hobby=__H__/, function (m) { return m.charAt(0) === '?' ? '?' : ''; }).replace(/\?&/, '?').replace(/\?$/, ''));
      return;
    }
    if (e.target.matches('[data-sorteer]')) {
      var basis = e.target.getAttribute('data-sorteer'), v = e.target.value;
      ga(v === 'aanbevolen' ? basis : basis + (basis.indexOf('?') === -1 ? '?' : '&') + 'sort=' + v, true);
    }
  });
  document.addEventListener('scroll', function (e) {
    var el = e.target; if (el && el.classList && el.classList.contains('galerij-rij')) galerijBijwerken(el.parentNode);
  }, true);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { sluitLade(); sluitMega(); } });
  window.addEventListener('storage', function () { werkTellersBij(); toon(); });

  /* ================== START ================== */
  /* Snelheid (31-10-2026): de productlijst (producten-lean.js) laadt 'async'. De pagina staat al in de HTML, dus de bezoeker
     ziet meteen tekst en foto's; de site wordt 'levend' zodra de lijst binnen is. Menu's en zoekvak kunnen alvast. */
  vulIconen(document);
  var zoekRij = $('[data-zoekrij] .binnen');
  /* Staat de zoekbalk al in de HTML (maak-paginas.js zet hem erin tegen verspringen)? Dan laten we hem staan, zodat wat je al typte blijft. */
  var ZOEK_TEKST = 'Zoek: lego, of ‘oma, max €25’';
  if (zoekRij && !zoekRij.firstElementChild) zoekRij.innerHTML = zoekForm('', ZOEK_TEKST);
  else if (zoekRij) { zoekForm.n = Math.max(zoekForm.n || 0, 1); var zi = zoekRij.querySelector('input'); if (zi) zi.placeholder = ZOEK_TEKST; }
  netteLinks(document);
  function start() {
    if (start.gedaan) return; start.gedaan = true;
    window.LK.ga = ga;
    bouwLade(); bouwMega(); netteLinks(document); /* menu-links netjes met een slash erachter (ook voor de sitemap) */
    vulIconen($('[data-lade]').parentNode); vulIconen($('[data-megamenu]'));
    werkTellersBij();
    toon();
  }
  if (window.LK_PRODUCTEN) start();
  else {
    window.addEventListener('lk-producten', start);
    /* Mocht het seintje om wat voor reden niet komen (oude browser): even later zelf kijken. */
    var wacht = setInterval(function () { if (window.LK_PRODUCTEN) { clearInterval(wacht); start(); } }, 200);
  }
})();
