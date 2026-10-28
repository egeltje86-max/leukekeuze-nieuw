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

  var vorigPad = null;

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
    try { history[vervang ? 'replaceState' : 'pushState']({}, '', url); } catch (e) { location.href = url; return; }
    toon();
  }
  function netteLinks(root) {
    $$('a[href^="/"]', root).forEach(function (a) {
      var h = a.getAttribute('href');
      if (h.indexOf('//') === 0) return;
      var n = netjes(h);
      if (n !== h) a.setAttribute('href', n);
    });
  }
  /* Daisycon-links herkennen (lt45.net, fr135.net, bdt9.net, enz.). Tijdens de 'daisyconPauze' gaan we rechtstreeks naar de winkel. */
  function isDaisycon(u) { return /^https?:\/\/(lt45|fr135|bdt9|glp8|ds1|jdt8|rkn3|jf79)\.n[le]t?\/c\/|^https?:\/\/aff\.svinando\.be\/c\//.test(u || ''); }
  function winkelLink(p) { return INST.daisyconPauze && isDaisycon(p.url) && p.winkelUrl ? p.winkelUrl : p.url; }
  var WINKELSITE = { 'Ditverzinjeniet': 'https://www.ditverzinjeniet.nl/', 'Dille & Kamille': 'https://www.dille-kamille.nl/', 'LEGO': 'https://www.lego.com/nl-nl',
    'Westwing': 'https://www.westwing.nl/', 'Decantalo': 'https://www.decantalo.nl/', 'MYKA': 'https://www.myka.com/nl/', 'Prydligt': 'https://www.prydligt.nl/',
    '999 Games': 'https://www.999games.nl/', 'La Redoute': 'https://www.laredoute.nl/', 'Kaartje2go': 'https://www.kaartje2go.nl/', 'Bartogi': 'https://www.bartogi.nl/',
    'Wijnkring': 'https://www.wijnkring.nl/', 'Kerstland': 'https://www.kerstland.nl/', 'Teufel': 'https://teufelaudio.nl/', 'Dropwinkel': 'https://www.dropwinkel.eu/',
    'Bloompost': 'https://www.bloompost.nl/', 'Dr. Martens': 'https://www.drmartens.com/nl/nl/', 'Razer': 'https://www.razer.com/', 'Fietsparadijs': 'https://www.fietsparadijs.com/',
    'Fietstas.com': 'https://www.fietstas.com/', 'Zadig & Voltaire': 'https://zadig-et-voltaire.com/eu/nl/' };
  function prijsFilter(id) { return PRIJZEN.find(function (p) { return p.id === id; }) || PRIJZEN[0]; }
  function binnenPrijs(p, id) { var f = prijsFilter(id); return p.prijs >= f.min && p.prijs <= f.max; }
  function sorteer(lijst, hoe) {
    var l = lijst.slice();
    if (hoe === 'prijs-op') l.sort(function (a, b) { return a.prijs - b.prijs; });
    else if (hoe === 'prijs-af') l.sort(function (a, b) { return b.prijs - a.prijs; });
    else if (hoe === 'nieuw') l.sort(function (a, b) { return (b.sinds || '').localeCompare(a.sinds || '') || (LK.isNieuw(b) ? 1 : 0) - (LK.isNieuw(a) ? 1 : 0); });
    else l = mix(l);
    return l;
  }
  /* 'Aanbevolen': een mooie mix. Favorieten eerst, daarna goedkoop en duur door elkaar,
     verschillende winkels om en om, nieuwe producten iets naar voren.
     De volgorde schuift elke week een beetje, zodat nieuwe producten vanzelf meedoen. */
  function mixGetal(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return ((h >>> 0) % 100000) / 100000; }
  function mix(lijst) {
    var week = Math.floor(Date.now() / (7 * 864e5));
    /* Favorieten bovenaan, maar hooguit twee per winkel: anders staan bijv. alle zeven dino-kleurboeken op een rij.
       De rest van de favorieten draait gewoon mee in de mix. */
    var top = [], rest = [], perShop = {};
    lijst.forEach(function (p) {
      var k = p.shop + (p.eigen ? '|eigen' : '');
      if ((p.favoriet || p.populair) && (perShop[k] = (perShop[k] || 0) + 1) <= 2) top.push(p); else rest.push(p);
    });
    var GRENZEN = [15, 30, 60, 120, Infinity], bakken = GRENZEN.map(function () { return []; });
    rest.forEach(function (p) {
      var i = 0; while (typeof p.prijs === 'number' && p.prijs >= GRENZEN[i]) i++;
      if (typeof p.prijs !== 'number') i = 2;
      p._mix = mixGetal(p.id + '|' + week) - (LK.isNieuw(p) ? 0.25 : 0) - (p.beeld ? 0 : -0.5) - (p.sfeer ? 0.6 : 0);  /* sfeerfoto's naar voren (wens Marius 27-10-2026) */
      bakken[i].push(p);
    });
    bakken.forEach(function (b) { b.sort(function (a, c) { return a._mix - c._mix; }); });
    var uit = [], volgorde = [1, 2, 0, 3, 1, 2, 4, 0, 1, 3, 2, 0], k = 0, over = rest.length;
    while (over > 0) {
      var b = bakken[volgorde[k % volgorde.length]]; k++;
      if (!b.length) { if (k > 100000) break; continue; }
      var vorige = uit.length ? uit[uit.length - 1].shop : null, j = 0;
      while (j < b.length - 1 && j < 4 && b[j].shop === vorige) j++;
      uit.push(b.splice(j, 1)[0]); over--;
    }
    top.sort(function (a, b) { return ((b.favoriet ? 2 : 0) + (b.populair ? 1 : 0)) - ((a.favoriet ? 2 : 0) + (a.populair ? 1 : 0)) || (b.sfeer ? 1 : 0) - (a.sfeer ? 1 : 0); });
    return top.concat(uit);
  }
  function grid(lijst, leegHtml, klasse) {
    if (!lijst.length) return '<div class="prodgrid ' + (klasse || '') + '">' + leegHtml + '</div>';
    return '<div class="prodgrid ' + (klasse || '') + '">' + lijst.map(function (p, i) { return eerstSnel(LK.productKaart(p), i); }).join('') + '</div>';
  }
  /* De eerste vier foto's meteen laden (niet 'lazy'): dan staat het eerste rijtje sneller op het scherm, vooral op een telefoon. */
  function eerstSnel(h, i) { return i < 4 ? h.replace('loading="lazy"', 'loading="eager" fetchpriority="high"') : h; }
  /* Lange lijsten: eerst PER_KEER producten, daarna een 'Toon meer'-knop. */
  var PER_KEER = 24;
  function gridMeer(lijst, leegHtml, n) {
    var PER_KEER = n || 24;
    if (lijst.length <= PER_KEER) return grid(lijst, leegHtml);
    return '<div class="prodgrid">' + lijst.map(function (p, i) {
      var h = eerstSnel(LK.productKaart(p), i);
      return i < PER_KEER ? h : h.replace('<article class="prodkaart"', '<article class="prodkaart later"');
    }).join('') + '</div>' +
      '<div class="meer-knop"><button class="knop knop-rand" type="button" data-meer>Toon meer <small>(' + PER_KEER + ' van ' + lijst.length + ')</small></button></div>';
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
  function prijsChips(pad, q) {
    return '<div class="chips" role="group" aria-label="Budget">' + PRIJZEN.map(function (p) {
      var nq = Object.assign({}, q, { prijs: p.id });
      return '<a class="chip" href="' + maakAdres(pad, nq) + '" aria-pressed="' + ((q.prijs || 'alle') === p.id) + '">' + p.label + '</a>';
    }).join('') + '</div>';
  }
  /* Mobiel: knop 'Filter & sorteren' die onderin blijft staan als de werkbalk uit beeld is.
     Tik je erop, dan schuift een paneel omhoog met de budgetknoppen (en sortering). Wens van Marius, 24-10-2026. */
  function filterPaneel(pad, q, sorteerOpties) {
    var aantalFilters = (q.prijs && q.prijs !== 'alle' ? 1 : 0) + (q.sort && q.sort !== 'aanbevolen' ? 1 : 0);
    return '<button class="filterknop" type="button" data-filter-open aria-hidden="true" tabindex="-1">' + ic('filter') + 'Filter &amp; sorteren' +
        (aantalFilters ? ' <span class="filter-teller">' + aantalFilters + '</span>' : '') + '</button>' +
      '<div class="filterpaneel" data-filterpaneel hidden><button type="button" class="filter-achter" data-filter-dicht aria-label="Sluiten" tabindex="-1"></button>' +
        '<div class="filter-blad" role="dialog" aria-modal="true" aria-label="Filter en sorteren">' +
          '<div class="filter-kop"><strong>Filter &amp; sorteren</strong><button type="button" class="filter-sluit" data-filter-dicht aria-label="Sluiten">' + ic('sluit') + '</button></div>' +
          '<h3>Budget</h3>' + prijsChips(pad, q).replace('class="chips"', 'class="chips filter-chips"') +
          (sorteerOpties ? '<h3>Sorteren</h3><div class="chips filter-chips">' + sorteerOpties.map(function (o) {
            return '<a class="chip" href="' + maakAdres(pad, Object.assign({}, q, { sort: o[0] === 'aanbevolen' ? '' : o[0] })) + '" aria-pressed="' + ((q.sort || 'aanbevolen') === o[0]) + '">' + o[1] + '</a>';
          }).join('') + '</div>' : '') +
        '</div></div>';
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
  function home() {
    zetTitel('');
    var hoofd = ['cadeaus', 'dranken', 'speelgoed', 'wonen', 'elektronica'].map(window.LK_CAT);
    return '' +
      '<section class="hero">' +
        '<picture><source media="(min-width: 760px)" srcset="' + esc(INST.heroDesktop) + '">' +
        '<img src="' + esc(INST.heroMobiel) + '" alt="" fetchpriority="high"></picture>' +
        '<div class="hero-inhoud"><div class="binnen">' +
          '<div class="kicker">' + esc(INST.heroKicker) + '</div>' +
          '<h1>' + esc(INST.heroTitel) + '<br><em>' + esc(INST.heroTitelGoud) + '</em></h1>' +
          '<p>' + esc(INST.heroTekst) + '</p>' +
          '<div class="populair"><span>Populair:</span><div class="chips">' +
            INST.populair.map(function (x) { return '<a class="chip" href="' + x.naar + '">' + esc(x.label) + '</a>'; }).join('') +
          '</div></div>' +
        '</div></div>' +
      '</section>' +

      '<div class="binnen">' +
        /* 1. 2.0 PROEF: eerst de personen (7 rondjes), dan de 8 populairste productgroepen + 'Alle categorieën'. */
        '<section class="sectie eerste">' +
          '<div class="sectie-kop"><div><h2>Voor wie zoek je een cadeau?</h2></div></div>' +
          '<div class="persoon-subs home">' + window.LK_PERSONEN.map(function (x) {
            return '<a class="subkaart" href="' + (x.subs ? '/voor/' + x.slug : x.naar) + '"><span class="rond"><img src="' + esc(x.beeld) + '" alt="" loading="lazy" decoding="async"></span>' + esc(x.kort) + '</a>';
          }).join('') + '</div>' +
        '</section>' +

        '<section class="sectie">' +
          '<div class="sectie-kop"><div><h2>Shop per categorie</h2></div><a class="meer" href="/categorieen">Alle categorieën ' + ic('pijl') + '</a></div>' +
          '<div class="groepen">' + window.LK_HOME_GROEPEN.map(window.LK_CAT).filter(Boolean).map(function (c) {
            return '<a class="groep" href="/c/' + c.slug + '"><img src="' + esc(c.tegel.replace('.webp', '-klein.webp')) + '" alt="" loading="lazy" decoding="async"><span>' + esc(c.kort) + '</span></a>';
          }).join('') + '</div>' +
          '<a class="knop knop-rand alle-cats" href="/categorieen">Alle categorieën ' + ic('pijl') + '</a>' +
        '</section>' +

        /* 0. Seizoen eerst: Sinterklaas en Kerst bovenaan (wens van Marius, 26-10-2026). Blokken verlopen vanzelf via 'tot'. */
        actieBlokken() +

        /* 0a. 2.0 PROEF: gelegenheden als rondjes + collectie Persoonlijke cadeaus */
        '<section class="sectie"><div class="sectie-kop"><div><h2>Voor welke gelegenheid?</h2></div><a class="meer" href="/gelegenheid">Alle gelegenheden ' + ic('pijl') + '</a></div>' +
          '<div class="persoon-subs home gelegenheden">' + window.LK_GELEGENHEDEN.map(function (x) {
            return '<a class="subkaart" href="' + (x.naar || '/gelegenheid/' + x.slug) + '"><span class="rond"><img src="' + esc(x.beeld) + '" alt="" loading="lazy" decoding="async"></span>' + esc(x.naam) + '</a>';
          }).join('') + '</div></section>' +
        (window.LK_COLLECTIES || []).map(function (c) {
          return '<a class="collectie-banner" href="/collectie/' + c.slug + '"><img src="' + esc(c.beeld) + '" alt="" loading="lazy" decoding="async"><div class="collectie-tekst"><span class="kicker">' + esc(c.kicker) + '</span><h2>' + esc(c.naam) + '</h2><p>' + esc(c.tekst) + '</p><span class="knop knop-goud">Bekijk de collectie ' + ic('pijl') + '</span></div></a>';
        }).join('') +

        /* 0b. Cadeaugidsen van dit seizoen */
        gidsenRij() +

        /* 2. VONK als smalle balk */
        '<a class="vonk-kaart vonk-klein" href="/vonk">' +
          ic('vonk', 'staf') +
          '<div><h2>VONK</h2><p>Geen idee wat je moet geven? Vind het in 3 klikken.</p></div>' +
          '<span class="rond-pijl">' + ic('rechts') + '</span>' +
        '</a>' +

        /* 2b. Zoeken in alle winkels (smalle balk, geen grote zoekbalk) */
        '<a class="vonk-kaart vonk-klein zoek-alle" href="/zoek">' +
          ic('zoek', 'staf') +
          '<div><h2>Zoek in alle winkels</h2><p>Duizenden producten van al onze winkels op één plek.</p></div>' +
          '<span class="rond-pijl">' + ic('rechts') + '</span>' +
        '</a>' +

        /* 3b. Eigen producten van LeukeKeuze (kleurboeken van Marius) */
        eigenBlok() +

        /* 6. Uitgelicht, ook als rij */
        '<section class="sectie sfeer-modus">' +
          '<div class="sectie-kop"><div><h2>Uitgelicht</h2></div><a class="meer" href="/c/cadeaus">Alle cadeaus ' + ic('pijl') + '</a></div>' +
          '<div class="chips tabs" role="tablist" data-tabs>' +
            [['favoriet', 'Onze favorieten'], ['nieuw', 'Nieuw binnen'], ['onder25', 'Onder €25']].map(function (t, i) {
              return '<button class="chip" type="button" role="tab" data-tab="' + t[0] + '" aria-pressed="' + (i === 0) + '">' + t[1] + '</button>';
            }).join('') +
          '</div>' +
          '<div data-uitgelicht>' + uitgelicht('favoriet') + '</div>' +
        '</section>' +

        /* 7. Etalage met dranken: bewust onderaan */
        etalage() +

        /* 8. Zo werkt het (kort) */
        '<section class="sectie">' +
          '<div class="stappen klein">' +
            '<div class="stap"><span class="nr">1</span><div><h3>Wij zoeken uit</h3><p>Alleen wat we echt goed vinden, komt op de site.</p></div></div>' +
            '<div class="stap"><span class="nr">2</span><div><h3>Jij kiest</h3><p>Op persoon, categorie of met VONK.</p></div></div>' +
            '<div class="stap"><span class="nr">3</span><div><h3>Je koopt bij de winkel</h3><p>Je bestelt en betaalt zoals je gewend bent.</p></div></div>' +
          '</div>' +
        '</section>' +
      '</div>';
  }
  /* Reclameblokken (seizoen/acties) uit LK_INSTELLINGEN.acties; verlopen blokken vallen vanzelf weg. */
  function actieBlokken() {
    var vandaag = new Date().toISOString().slice(0, 10);
    var l = (INST.acties || []).filter(function (a) { return !a.tot || vandaag <= a.tot; });
    if (!l.length) return '';
    return '<section class="acties">' + l.map(function (a) {
      return '<a class="actie" href="' + esc(a.naar) + '">' +
        '<img src="' + esc(a.beeld) + '" alt="" loading="lazy" decoding="async">' +
        '<div class="actie-tekst"><span class="kicker">' + esc(a.kicker) + '</span><h3>' + esc(a.titel) + '</h3><p>' + esc(a.tekst) + '</p>' +
        '<span class="knop knop-goud">' + esc(a.knop) + ' ' + ic('pijl') + '</span></div></a>';
    }).join('') + '</section>';
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
      '<div class="tekst"><h3>' + esc(c.naam) + '</h3><p>' + esc(c.tekst) + '</p><span class="rond-pijl">' + ic('rechts') + '</span></div></a>';
  }
  function nietChristelijk(p) { return p.cat !== 'christelijk'; }
  /* Sfeerfoto's eerst (wens van Marius, 27-10-2026: presentatie is alles). Volgorde blijft verder gelijk. */
  function sfeerEerst(l) { return l.filter(function (p) { return p.sfeer; }).concat(l.filter(function (p) { return !p.sfeer; })); }
  function uitgelicht(tab) {
    var l = LK.zichtbaar().filter(nietChristelijk);
    if (tab === 'favoriet') l = l.filter(function (p) { return p.favoriet || p.populair; });
    if (tab === 'onder25') l = l.filter(function (p) { return p.prijs <= 25 && p.cat !== 'dranken'; });
    if (tab === 'nieuw') l = l.filter(LK.isNieuw);
    l = sfeerEerst(sorteer(l));
    if (tab === 'nieuw' || tab === 'onder25') {
      /* afwisselen: niet tien dingen uit dezelfde categorie achter elkaar */
      var per = {}, mix = [];
      l.forEach(function (p) { (per[p.cat] = per[p.cat] || []).push(p); });
      var lijsten = Object.keys(per).map(function (k) { return per[k]; });
      for (var i = 0; mix.length < 12 && lijsten.some(function (x) { return x.length > i; }); i++) lijsten.forEach(function (x) { if (x[i] && mix.length < 12) mix.push(x[i]); });
      l = sfeerEerst(mix);
    }
    return l.length ? rij(l.slice(0, 12)) : grid([], leegBlok('Nog niets in deze lijst', 'Hier komen binnenkort mooie producten.'));
  }

  /* ---------- Alle categorieën ---------- */
  function alleCategorieen() {
    zetTitel('Alle categorieën');
    return paginakop({ titel: 'Alle categorieën', tekst: 'Kies waar je zin in hebt.', kruimel: [{ tekst: 'Categorieën' }] }) +
      '<div class="binnen"><section class="sectie"><div class="catkaarten">' + CATS.map(catKaart).join('') + '</div></section></div>';
  }

  function paginakop(o) {
    var achter = '';
    /* Op een telefoon een kleinere, al bijgesneden versie van de banner (-mobiel.webp): scheelt zo'n 70% aan data. */
    if (o.banner) achter = '<div class="achter"><picture><source media="(max-width: 759px)" srcset="' + esc(o.banner.replace('.webp', '-mobiel.webp')) + '"><img src="' + esc(o.banner) + '" alt="" fetchpriority="high"></picture></div>';
    else if (o.vaag) achter = '<div class="achter vaag"><img src="' + esc(o.vaag) + '" alt=""></div>';
    return '<section class="paginakop' + (achter ? '' : ' zonder') + '">' + achter +
      '<div class="binnen">' + kruimel(o.kruimel || []) + '<h1>' + esc(o.titel) + '</h1>' + (o.tekst ? '<p>' + esc(o.tekst) + '</p>' : '') + '</div></section>';
  }

  /* ---------- Categorie & subcategorie ---------- */
  function categorie(slug, subSlug, q) {
    var c = window.LK_CAT(slug);
    if (!c) return nietGevonden();
    var s = subSlug ? window.LK_SUB(c, subSlug) : null;
    if (subSlug && !s) return nietGevonden();
    /* Teksten uit teksten.js (intro, Google-titel, omschrijving, tips). Staat er in data.js al iets, dan wint dat. */
    var T = (window.LK_TEKSTEN || {})[c.slug + (s ? '/' + s.slug : '')] || {};
    zetTitel(s ? (s.seoTitel || T.seoTitel || s.naam + ' – ' + c.naam) : (c.seoTitel || T.seoTitel || c.naam));
    window.LK_SEO = (s ? s.seoTekst : c.seoTekst) || T.seoTekst || '';
    var gids = (s ? s.gids : c.gids) || T.gids;

    var pad = '/c/' + c.slug + (s ? '/' + s.slug : '');
    var lijst = LK.zichtbaar().filter(function (p) { return LK.hoortBij(p, c.slug, s && s.slug) && binnenPrijs(p, q.prijs); });
    lijst = sorteer(lijst, q.sort);

    /* Gekozen budget blijft staan als je naar een andere subcategorie klikt. */
    var metBudget = function (adres) { return q.prijs && q.prijs !== 'alle' ? maakAdres(adres, { prijs: q.prijs }) : adres; };
    var subs = '<div class="subkaarten">' +
      '<a class="subkaart' + (s ? '' : ' actief') + '" href="' + metBudget('/c/' + c.slug) + '"><span class="rond">' + catBeeld(c, true) + '</span>Alles</a>' +
      volleSubs(c).map(function (x) {
        var beeld = x.beeld ? '<img src="' + esc(x.beeld) + '" alt="" loading="lazy" decoding="async">' : ic(c.icoon);
        return '<a class="subkaart' + (s && s.slug === x.slug ? ' actief' : '') + '" href="' + metBudget(subAdres(c, x)) + '"' + (s && s.slug === x.slug ? ' aria-current="page"' : '') + '>' +
          '<span class="rond">' + beeld + '</span>' + esc(x.naam) + '</a>';
      }).join('') + '</div>';

    var sorteerOpties = [['aanbevolen', 'Aanbevolen'], ['prijs-op', 'Prijs laag – hoog'], ['prijs-af', 'Prijs hoog – laag'], ['nieuw', 'Nieuwste eerst']];
    var werkbalk = '<div class="werkbalk">' + prijsChips(pad, q) +
      '<div class="werkbalk-onder"><span class="aantal">' + lijst.length + (lijst.length === 1 ? ' product' : ' producten') + '</span>' +
      '<label class="sorteer"><span class="verborgen">Sorteren</span><select data-sorteer="' + esc(maakAdres(pad, Object.assign({}, q, { sort: '' }))) + '">' +
        sorteerOpties.map(function (o) { return '<option value="' + o[0] + '"' + ((q.sort || 'aanbevolen') === o[0] ? ' selected' : '') + '>' + o[1] + '</option>'; }).join('') +
      '</select>' + ic('omlaag') + '</label></div></div>';

    var leeg = leegBlok(q.prijs && q.prijs !== 'alle' ? 'Niets in dit budget' : 'Hier komen binnenkort mooie producten',
      q.prijs && q.prijs !== 'alle' ? 'Kies een ander budget of bekijk alles.' : 'We zijn deze categorie nog aan het vullen. Kijk alvast verder:',
      '<a class="knop knop-rand" href="/c/cadeaus">Alle cadeaus</a> <a class="knop knop-goud" href="/vonk">Probeer VONK</a>');

    var anderen = CATS.filter(function (x) { return x.slug !== c.slug; });
    var ouder = c.onder ? window.LK_CAT(c.onder) : null;

    return paginakop({
      titel: s ? (s.kop || s.naam) : (c.kop || c.naam),
      tekst: s ? (s.tekst || T.tekst || 'Met de hand gekozen ' + s.naam.toLowerCase() + ' uit ' + c.naam.toLowerCase() + '.') : (c.tekst || T.tekst),
      banner: c.banner, vaag: !c.banner ? c.tegel : '',
      kruimel: (ouder ? [{ tekst: ouder.naam, naar: '/c/' + ouder.slug }] : []).concat(s ? [{ tekst: c.naam, naar: '/c/' + c.slug }, { tekst: s.naam }] : [{ tekst: c.naam }])
    }) +
    '<div class="binnen">' +
      '<section class="sectie" aria-label="Subcategorieën">' + subs + '</section>' +
      leesOok(c.slug + (s ? '/' + s.slug : '')) +
      werkbalk + gridMeer(lijst, leeg) + filterPaneel(pad, q, sorteerOpties) +
      /* Eerst 'Meer in onze winkels' direct onder onze eigen producten, en pas daarna de tips.
         Stonden de tips ertussen, dan leek het alsof de pagina daar ophield (opmerking Marius, 28-10-2026). */
      winkelSectie(c.slug, s && s.slug, q.prijs) +
      (gids ? '<section class="sectie gids" aria-label="Tips">' + gids.map(function (g) { return '<h2>' + esc(g.kop) + '</h2><p>' + esc(g.tekst) + '</p>'; }).join('') + '</section>' : '') +
      (s || !winkelsMet(c.slug).length ? '' : '<section class="sectie"><div class="sectie-kop"><div><h2>Ook leuk om rond te kijken</h2></div><a href="/winkels">Alle winkels</a></div><div class="winkelraster">' + winkelsMet(c.slug).map(winkelKaart).join('') + '</div></section>') +
      '<section class="sectie"><div class="sectie-kop"><div><h2>Andere categorieën</h2></div></div>' +
        '<nav class="catknoppen andere-cats">' + anderen.map(function (x) {
          return '<a class="catknop" href="/c/' + x.slug + '">' + ic(x.icoon) + '<span>' + esc(x.kort) + '</span></a>';
        }).join('') + '</nav></section>' +
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
      var plekken = [p.cat + '/' + p.sub, p.cat].concat(p.ookIn || []);
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
    var alles = persoonProducten(pe, s ? s.vakken : null);
    var lijst = sorteer(alles.filter(function (p) { return binnenPrijs(p, q.prijs); }), q.sort);
    if (!q.sort || q.sort === 'aanbevolen') lijst = sfeerEerst(lijst);
    var metBudget = function (adres) { return q.prijs && q.prijs !== 'alle' ? maakAdres(adres, { prijs: q.prijs }) : adres; };

    /* Rondjes met de subcategorieën van deze persoon. Op de hoofdpagina groot (raster), op een subpagina als schuifrij. */
    var subs = pe.subs.map(function (x) {
      var n = persoonProducten(pe, x.vakken).length;
      if (!n) return '';
      return '<a class="subkaart' + (s && s.slug === x.slug ? ' actief' : '') + '" href="' + metBudget('/voor/' + pe.slug + '/' + x.slug) + '"' + (s && s.slug === x.slug ? ' aria-current="page"' : '') + '>' +
        '<span class="rond"><img src="' + esc(x.beeld) + '" alt="" loading="lazy" decoding="async"></span>' + esc(x.naam) + '</a>';
    }).join('');
    var subsHtml = s
      ? '<div class="subkaarten"><a class="subkaart" href="' + metBudget('/voor/' + pe.slug) + '"><span class="rond"><img src="' + esc(pe.beeld) + '" alt=""></span>Alles</a>' + subs + '</div>'
      : '<div class="persoon-subs">' + subs + '</div>';

    var sorteerOpties = [['aanbevolen', 'Aanbevolen'], ['prijs-op', 'Prijs laag – hoog'], ['prijs-af', 'Prijs hoog – laag'], ['nieuw', 'Nieuwste eerst']];
    var werkbalk = '<div class="werkbalk">' + prijsChips(pad, q) +
      '<div class="werkbalk-onder"><span class="aantal">' + lijst.length + (lijst.length === 1 ? ' product' : ' producten') + '</span>' +
      '<label class="sorteer"><span class="verborgen">Sorteren</span><select data-sorteer="' + esc(maakAdres(pad, Object.assign({}, q, { sort: '' }))) + '">' +
        sorteerOpties.map(function (o) { return '<option value="' + o[0] + '"' + ((q.sort || 'aanbevolen') === o[0] ? ' selected' : '') + '>' + o[1] + '</option>'; }).join('') +
      '</select>' + ic('omlaag') + '</label></div></div>';
    var leeg = alles.length
      ? leegBlok('Niets in dit budget', 'Kies een ander budget of bekijk alles.', '<a class="knop knop-rand" href="' + pad + '">Alles bekijken</a>')
      : leegBlok('Deze afdeling vullen we nu', 'We kiezen de cadeaus voor ' + naam + ' met de hand uit. Kijk alvast verder:', '<a class="knop knop-rand" href="/voor">Voor iemand anders</a> <a class="knop knop-goud" href="/vonk">Probeer VONK</a>');

    /* Selectie: favorieten en populaire producten, sfeerfoto's eerst. */
    var selectie = sorteer(alles.filter(function (p) { return (p.favoriet || p.populair) && p.sfeer; })).slice(0, 10);
    if (selectie.length < 4) selectie = [];
    var anderen = window.LK_PERSONEN.filter(function (x) { return x.slug !== pe.slug; });

    return paginakop({
      titel: s ? s.naam + ' voor ' + naam : pe.naam,
      tekst: s ? (s.tekst || 'Met de hand gekozen ' + s.naam.toLowerCase() + ' voor ' + naam + '.') : pe.tekst,
      vaag: pe.vaag || pe.beeld,
      kruimel: [{ tekst: 'Voor wie?', naar: '/voor' }].concat(s ? [{ tekst: pe.naam, naar: '/voor/' + pe.slug }, { tekst: s.naam }] : [{ tekst: pe.naam }])
    }) +
    '<div class="binnen">' +
      (!alles.length ? '<section class="sectie eerste">' + leeg + '</section>' :
      (s ? '<section class="sectie" aria-label="Subcategorieën">' + subsHtml + '</section>'
         : '<section class="sectie eerste"><div class="sectie-kop"><div><h2>Wat zoek je voor ' + esc(naam) + '?</h2></div></div>' + subsHtml + '</section>') +
      (!s && selectie.length ? '<section class="sectie sfeer-modus"><div class="sectie-kop"><div><h2>Onze selectie voor ' + esc(naam) + '</h2></div></div>' + rij(selectie) + '</section>' : '') +
      (s ? '' : '<section class="sectie"><div class="sectie-kop"><div><h2>Alle cadeaus voor ' + esc(naam) + '</h2></div></div></section>') +
      werkbalk + gridMeer(lijst, leeg) + filterPaneel(pad, q, sorteerOpties)) +
      /* Op een subpagina ook 'Meer in onze winkels' uit het eerste vak (bijv. mode-beauty/horloges). */
      (s && alles.length ? (function () { var vd = s.vakken[0].split('/'); return winkelSectie(vd[0], vd[1], q.prijs); })() : '') +
      leesOok(pe.oud || '') +
      (tips ? '<section class="sectie gids" aria-label="Tips">' + tips.map(function (g) { return '<h2>' + esc(g.kop) + '</h2><p>' + esc(g.tekst) + '</p>'; }).join('') + '</section>' : '') +
      '<section class="sectie"><div class="sectie-kop"><div><h2>Voor iemand anders?</h2></div></div>' +
        '<div class="subkaarten voorwie-rij">' + anderen.map(function (x) {
          return '<a class="subkaart" href="' + (x.subs ? '/voor/' + x.slug : x.naar) + '"><span class="rond"><img src="' + esc(x.beeld) + '" alt="" loading="lazy" decoding="async"></span>' + esc(x.kort) + '</a>';
        }).join('') + '</div></section>' +
    '</div>';
  }
  /* 2.0 PROEF: samengestelde pagina (gelegenheid of collectie): labels + vakken + evt. maximale prijs. */
  function verzamelLijst(g) {
    return LK.zichtbaar().filter(function (p) {
      if (p.cat === 'christelijk') return false;
      if (g.labels && !(p.voor || []).some(function (v) { return g.labels.indexOf(v) !== -1; })) return false;
      if (g.maxPrijs && !(typeof p.prijs === 'number' && p.prijs <= g.maxPrijs)) return false;
      if (g.uit && g.uit.test(p.titel)) return false;
      var plekken = [p.cat + '/' + p.sub, p.cat].concat(p.ookIn || []);
      return plekken.some(function (x) { return g.vakken.some(function (v) { return x === v || x.indexOf(v + '/') === 0; }); });
    });
  }
  function verzameling(g, pad, kruimelKop, q) {
    zetTitel(g.seoTitel || g.naam);
    var alles = verzamelLijst(g);
    var lijst = sorteer(alles.filter(function (p) { return binnenPrijs(p, q.prijs); }), q.sort);
    if (!q.sort || q.sort === 'aanbevolen') lijst = sfeerEerst(lijst);
    var sorteerOpties = [['aanbevolen', 'Aanbevolen'], ['prijs-op', 'Prijs laag – hoog'], ['prijs-af', 'Prijs hoog – laag'], ['nieuw', 'Nieuwste eerst']];
    var werkbalk = '<div class="werkbalk">' + prijsChips(pad, q) +
      '<div class="werkbalk-onder"><span class="aantal">' + lijst.length + (lijst.length === 1 ? ' product' : ' producten') + '</span>' +
      '<label class="sorteer"><span class="verborgen">Sorteren</span><select data-sorteer="' + esc(maakAdres(pad, Object.assign({}, q, { sort: '' }))) + '">' +
        sorteerOpties.map(function (o) { return '<option value="' + o[0] + '"' + ((q.sort || 'aanbevolen') === o[0] ? ' selected' : '') + '>' + o[1] + '</option>'; }).join('') +
      '</select>' + ic('omlaag') + '</label></div></div>';
    var leeg = leegBlok('Niets in dit budget', 'Kies een ander budget of bekijk alles.', '<a class="knop knop-rand" href="' + pad + '">Alles bekijken</a>');
    var selectie = sorteer(alles.filter(function (p) { return (p.favoriet || p.populair) && p.sfeer; })).slice(0, 10);
    if (selectie.length < 4) selectie = [];
    var andere = (window.LK_GELEGENHEDEN || []).filter(function (x) { return x.slug !== g.slug; });
    return paginakop({ titel: g.kop || g.naam, tekst: g.tekst, vaag: g.beeld, kruimel: [{ tekst: kruimelKop.tekst, naar: kruimelKop.naar }, { tekst: g.naam }] }) +
    '<div class="binnen">' +
      (selectie.length ? '<section class="sectie eerste sfeer-modus"><div class="sectie-kop"><div><h2>Onze selectie</h2></div></div>' + rij(selectie) + '</section>' : '') +
      '<section class="sectie"><div class="sectie-kop"><div><h2>Alle cadeaus voor ' + esc(g.naam.toLowerCase()) + '</h2></div></div></section>' +
      werkbalk + gridMeer(lijst, leeg) + filterPaneel(pad, q, sorteerOpties) +
      (g.gids && GIDSEN.some(function (x) { return x.slug === g.gids; }) ? '<nav class="lees-ook" aria-label="Cadeaugidsen">' + ic('vonk') + '<span>Lees ook:</span><a href="/gids/' + g.gids + '">' + esc(GIDSEN.filter(function (x) { return x.slug === g.gids; })[0].titel.split(':')[0]) + '</a></nav>' : '') +
      '<section class="sectie"><div class="sectie-kop"><div><h2>Andere gelegenheden</h2></div></div>' +
        '<div class="subkaarten voorwie-rij">' + andere.map(function (x) {
          return '<a class="subkaart" href="' + (x.naar || '/gelegenheid/' + x.slug) + '"><span class="rond"><img src="' + esc(x.beeld) + '" alt="" loading="lazy" decoding="async"></span>' + esc(x.naam) + '</a>';
        }).join('') + '</div></section>' +
    '</div>';
  }
  function gelegenheidPagina(slug, q) {
    if (!slug) {
      zetTitel('Gelegenheden');
      return paginakop({ titel: 'Gelegenheden', tekst: 'Voor elk moment een passend cadeau.', kruimel: [{ tekst: 'Gelegenheden' }] }) +
        '<div class="binnen"><section class="sectie eerste"><div class="persoon-subs">' + window.LK_GELEGENHEDEN.map(function (x) {
          return '<a class="subkaart" href="' + (x.naar || '/gelegenheid/' + x.slug) + '"><span class="rond"><img src="' + esc(x.beeld) + '" alt="" loading="lazy" decoding="async"></span>' + esc(x.naam) + '</a>';
        }).join('') + '</div></section></div>';
    }
    var g = window.LK_GELEGENHEID(slug);
    if (!g || !g.vakken) return nietGevonden();
    return verzameling(g, '/gelegenheid/' + g.slug, { tekst: 'Gelegenheden', naar: '/gelegenheid' }, q);
  }
  function collectie(slug, q) {
    var g = window.LK_COLLECTIE(slug);
    if (!g) return nietGevonden();
    return verzameling(g, '/collectie/' + g.slug, { tekst: 'Collecties', naar: '/' }, q);
  }
  /* Overzicht van alle personen (/voor). */
  function voorWie() {
    zetTitel('Voor wie zoek je een cadeau?');
    return paginakop({ titel: 'Voor wie zoek je een cadeau?', tekst: 'Kies voor wie het is. Daarna zie je alleen wat bij die persoon past.', kruimel: [{ tekst: 'Voor wie?' }] }) +
      '<div class="binnen"><section class="sectie eerste"><div class="persoon-subs">' + window.LK_PERSONEN.map(function (x) {
        return '<a class="subkaart" href="' + (x.subs ? '/voor/' + x.slug : x.naar) + '"><span class="rond"><img src="' + esc(x.beeld) + '" alt="" loading="lazy" decoding="async"></span>' + esc(x.kort) + '</a>';
      }).join('') + '</div></section></div>';
  }

  /* ---------- Product ---------- */
  /* Productfoto's: één foto, of een rij om doorheen te bladeren (pijltjes, puntjes, vegen). */
  function productFotos(p) {
    var extra = (p.fotos || []).filter(Boolean);
    var klasse = 'product-beeld' + (p.voorbeeld || !p.beeld ? '' : ' echt' + (p.sfeer ? ' sfeer' : (extra.length ? '' : ' studio')));
    if (!extra.length) return '<div class="' + klasse + '">' + LK.productBeeld(p, true) + (p.voorbeeld ? '<span class="label">Voorbeeld</span>' : '') + '</div>';
    var alle = [p.beeld].concat(extra);
    return '<div class="' + klasse + ' galerij" data-galerij>' +
      '<div class="galerij-rij">' + alle.map(function (b, i) {
        var src = /^https?:/.test(b) ? b : b + '.webp';
        return '<figure><img src="' + esc(src) + '" alt="' + esc(p.titel) + (i ? ' (foto ' + (i + 1) + ')' : '') + '"' + (i ? ' loading="lazy"' : '') + ' decoding="async"></figure>';
      }).join('') + '</div>' +
      '<button class="galerij-knop vorige" type="button" data-galerij-stap="-1" aria-label="Vorige foto">' + ic('vorige') + '</button>' +
      '<button class="galerij-knop volgende" type="button" data-galerij-stap="1" aria-label="Volgende foto">' + ic('rechts') + '</button>' +
      '<div class="galerij-punten">' + alle.map(function (b, i) { return '<span' + (i ? '' : ' class="aan"') + '></span>'; }).join('') + '</div>' +
      '<span class="galerij-teller">1 / ' + alle.length + '</span>' +
    '</div>';
  }
  function galerijBijwerken(g) {
    var rij = $('.galerij-rij', g); if (!rij) return;
    var n = rij.children.length, i = Math.round(rij.scrollLeft / Math.max(1, rij.clientWidth));
    $$('.galerij-punten span', g).forEach(function (s, j) { s.classList.toggle('aan', j === i); });
    var t = $('.galerij-teller', g); if (t) t.textContent = (i + 1) + ' / ' + n;
  }

  function product(id) {
    var p = LK.vind(id);
    if (!p || p.status !== 'goedgekeurd') return nietGevonden('Dit product is (nog) niet beschikbaar.');
    var c = window.LK_CAT(p.cat), s = window.LK_SUB(c, p.sub);
    /* 2.0: staat dit vak onder een andere groep (bijv. mode-beauty/horloges onder Sieraden & Horloges), dan dat kruimelpad. */
    ALLECATS.forEach(function (cc) { (cc.subs || []).forEach(function (ss) { if (ss.vak === p.cat + '/' + p.sub) { c = cc; s = ss; } }); });
    zetTitel(p.titel);
    var fav = LK.isFavoriet(p.id);
    var knop = (p.url && !p.voorbeeld)
      ? '<a class="knop knop-goud" href="' + esc(winkelLink(p)) + '" target="_blank" rel="sponsored nofollow noopener">Bekijk bij ' + esc(p.shop) + ' ' + ic('pijl') + '</a>'
      : '<span class="knop knop-goud uit" aria-disabled="true">Voorbeeld – nog geen winkellink</span>';

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
      '<div style="padding-top:16px">' + kruimel([{ tekst: c.naam, naar: '/c/' + c.slug }, { tekst: s ? s.naam : '', naar: s ? '/c/' + c.slug + '/' + s.slug : '' }].filter(function (x) { return x.tekst; })) + '</div>' +
      '<div class="product">' +
        productFotos(p) +
        '<div class="product-info">' +
          '<span class="shop">' + esc(p.shop) + '</span>' +
          '<h1>' + esc(p.titel) + '</h1>' +
          '<div class="prijs">' + LK.euro(p.prijs) + (p.oudePrijs > p.prijs ? ' <s class="oud">' + LK.euro(p.oudePrijs) + '</s>' : '') + '</div>' +
          '<p class="prijsnoot">Prijs zoals laatst bij ons bekend' + (p.gecontroleerd ? ' (gecontroleerd op ' + p.gecontroleerd.split('-').reverse().join('-') + ')' : '') + '. De actuele prijs zie je bij de winkel.</p>' +
          '<div class="product-acties" data-acties>' + knop +
            '<button class="hartknop" type="button" data-fav="' + esc(p.id) + '" aria-pressed="' + fav + '" aria-label="' + (fav ? 'Haal van je verlanglijstje' : 'Zet op je verlanglijstje') + '">' + ic('hart') + '</button>' +
          '</div>' +
          /* Mobiel: als de knop uit beeld is gescrold, blijft onderin een smalle balk met prijs en knop staan. */
          (p.url && !p.voorbeeld ? '<div class="product-plak" data-plak aria-hidden="true"><div class="binnen"><span class="prijs">' + LK.euro(p.prijs) + '</span>' +
            '<a class="knop knop-goud" href="' + esc(winkelLink(p)) + '" target="_blank" rel="sponsored nofollow noopener" tabindex="-1">Bekijk bij ' + esc(p.shop) + ' ' + ic('pijl') + '</a></div></div>' : '') +
          '<div class="waarom"><h2>' + ic('ster') + 'Waarom wij dit kozen</h2><p>' + esc(p.waarom || '') + '</p></div>' +
          (p.specs && p.specs.length ? '<div class="specs"><h2>' + ic('info') + 'Specificaties</h2><dl>' +
            p.specs.map(function (r) { return '<div><dt>' + esc(r[0]) + '</dt><dd>' + esc(r[1]) + '</dd></div>'; }).join('') +
            '</dl><p class="specs-noot">Volgens de gegevens van de winkel. Twijfel je? Kijk dan ook even bij ' + esc(p.shop) + '.</p></div>' : '') +
          '<ul class="feiten">' +
            '<li>' + ic('winkel') + '<span>Je bestelt en betaalt bij ' + esc(p.shop) + '. Bezorging en retour regelt de winkel.</span></li>' +
            (p.letOp ? '<li class="letop">' + ic('info') + '<span><strong>Let op:</strong> ' + esc(p.letOp) + '</span></li>' : '') +
            (p.verzendNoot ? '<li>' + ic('info') + '<span>' + esc(p.verzendNoot) + '</span></li>' : '') +
            '<li>' + ic('vink') + '<span>Met de hand gekozen door LeukeKeuze.</span></li>' +
            (ookIn.length ? '<li>' + ic('cadeau') + '<span>Ook te vinden bij: ' + ookIn.join(', ') + '</span></li>' : '') +
            (p.voorbeeld ? '<li>' + ic('info') + '<span>Dit is een voorbeeldproduct om de site te testen. De foto is een sfeerbeeld.</span></li>' : '') +
          '</ul>' +
        '</div>' +
      '</div>' +
      (verwant.length ? '<section class="sectie"><div class="sectie-kop"><div><h2>Ook leuk</h2></div></div>' + grid(verwant) + '</section>' : '') +
    '</div>';
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
  function zoekTekst(p) {
    var c = window.LK_CAT(p.cat), s = window.LK_SUB(c, p.sub);
    var extra = (p.ookIn || []).map(function (x) { var d = x.split('/'); var cc = window.LK_CAT(d[0]); var ss = window.LK_SUB(cc, d[1]); return ss ? ss.naam : ''; });
    var syn = (p.voor || []).concat(p.moment || []).map(function (x) { return SYN[x] || ''; });
    var subsyn = [p.cat + '/' + p.sub].concat(p.ookIn || []).map(function (x) { return SUBSYN[x] || ''; });
    return [p.titel, p.waarom, p.shop, c && c.naam, s && s.naam, extra.join(' '), (p.voor || []).join(' '), (p.moment || []).join(' '), syn.join(' '), subsyn.join(' '), p.zoek || ''].join(' ').toLowerCase();
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
  function zoekWoorden(tekst) { return vouw(tekst).split(/[^a-z0-9]+/).filter(Boolean).map(stam); }
  /* Korte woorden (3 letters of minder) alleen aan het begin van een woord: 'oma' vindt niet 'aroma' of 'roman', 'lp' niet 'alpaca'. */
  /* Woorden die toevallig ín een ander woord zitten maar iets heel anders zijn (nijntje ≠ konijntje). */
  var NIET_IN = { nijntje: 'konijntje', nijn: 'konijn', ijntje: 'konijntje' };
  function bevat(t, w) {
    if (w.length <= 3) return (' ' + t).search(new RegExp('[^a-z0-9]' + w)) !== -1;
    if (t.indexOf(w) === -1) return false;
    return NIET_IN[w] ? t.split(NIET_IN[w]).join(' ').indexOf(w) !== -1 : true;
  }
  /* Zoekt in onze eigen producten. Eerst precies; vindt dat niets, dan met één tikfout per woord. */
  function zoekLijst(woorden, prijs) {
    var basis = LK.zichtbaar().filter(function (p) { return binnenPrijs(p, prijs); });
    var lijst = basis.filter(function (p) { var t = zoekTekstV(p); return woorden.every(function (w) { return bevat(t, w); }); });
    if (lijst.length < 3 && woorden.some(function (w) { return w.length >= 4; })) {
      var al = {}; lijst.forEach(function (p) { al[p.id] = 1; });
      lijst = lijst.concat(basis.filter(function (p) {
        if (al[p.id]) return false;
        var t = zoekTekstV(p), tw = null;
        return woorden.every(function (w) {
          if (bevat(t, w)) return true;
          if (w.length < 4) return false;
          tw = tw || t.split(/[^a-z0-9]+/);
          return tw.some(function (x) { return lijkt(w, x); });
        });
      }));
    }
    return lijst;
  }
  /* Relevantie: een treffer in de titel telt het zwaarst, dan de categorie, en pas daarna de uitlegtekst.
     Zo komt bij 'fiets' eerst de fietstas en pas later de drop met 'fietsjes' in de tekst (wens van Marius).
     Een heel woord telt zwaarder dan een stukje: bij 'bal' eerst de ballen en pas later de balpen. */
  function zoekScore(p, woorden) {
    var ti = ' ' + vouw(p.titel).replace(/[^a-z0-9]+/g, ' ') + ' ';
    var c = window.LK_CAT(p.cat), su = window.LK_SUB(c, p.sub);
    var ca = vouw((c ? c.naam : '') + ' ' + (su ? su.naam : ''));
    return woorden.reduce(function (s, w) {
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
    var lijst = zoekLijst(woorden, q.prijs);
    var score = function (p) { return zoekScore(p, woorden); };
    if (woorden.length && (!q.sort || q.sort === 'aanbevolen' || q.sort === 'relevant')) {
      var sc = {}; lijst.forEach(function (p) { sc[p.id] = score(p); });
      var niveaus = {}; lijst.forEach(function (p) { (niveaus[sc[p.id]] = niveaus[sc[p.id]] || []).push(p); });
      lijst = Object.keys(niveaus).map(Number).sort(function (a, b) { return b - a; }).reduce(function (u, n) { return u.concat(sorteer(niveaus[n], q.sort)); }, []);
    } else lijst = sorteer(lijst, q.sort);
    var pf = prijsFilter(q.prijs);
    var titel = q.q ? 'Resultaten voor “' + q.q + '”' : (q.prijs && q.prijs !== 'alle' ? 'Cadeaus ' + pf.label.toLowerCase().replace('€50+', 'vanaf €50') : 'Alle cadeaus');
    zetTitel(q.q ? 'Zoeken: ' + q.q : titel);
    /* Past het zoekwoord bij een categorie? Dan die er meteen bij zetten ('fiets' → Fietsen), zo kom je sneller op de goede pagina. */
    var catTips = [];
    if (woorden.length) {
      var ZW = window.LK_ZOEKWOORDEN || {}, TIPS = window.LK_ZOEKTIPS || {};
      /* Christelijke cadeaus alleen als tip bij echt christelijke woorden (bijbel, doop, …), niet bij 'kerst' of 'kaart'. */
      var pastBij = function (naam, sleutel, alleenTips) {
        var n = ' ' + vouw(naam).replace(/[^a-z0-9]+/g, ' '), z = ' ' + (ZW[sleutel] || '') + ' ' + (TIPS[sleutel] || '');
        if (alleenTips) { n = ''; z = ' ' + (TIPS[sleutel] || ''); }
        return woorden.some(function (w) { return w.length >= 3 && (n.indexOf(' ' + w) !== -1 || z.indexOf(' ' + w) !== -1); });
      };
      ALLECATS.forEach(function (c) {
        var chr = c.slug === 'christelijk';
        if (pastBij(c.naam, c.slug, chr)) catTips.push({ naam: c.naam, naar: '/c/' + c.slug });
        c.subs.forEach(function (su) { if (!su.naar && pastBij(su.naam, c.slug + '/' + su.slug, chr)) catTips.push({ naam: su.naam + ' <small>' + esc(c.kort) + '</small>', naar: '/c/' + c.slug + '/' + su.slug }); });
      });
      catTips = catTips.slice(0, 5);
    }
    return paginakop({ titel: titel, kruimel: [{ tekst: 'Zoeken' }] }) +
      '<div class="binnen">' +
        '<div style="margin-top:18px">' + zoekForm(q.q) + '</div>' +
        (catTips.length ? '<div class="zoek-cats"><span>Bekijk ook:</span><div class="chips">' + catTips.map(function (t) { return '<a class="chip" href="' + t.naar + '">' + t.naam + '</a>'; }).join('') + '</div></div>' : '') +
        '<div class="werkbalk">' + prijsChips('/zoek', q) + '<span class="aantal">' + lijst.length + (lijst.length === 1 ? ' product' : ' producten') + '</span></div>' +
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
    else if (ZW[sleutel]) attr = ' data-woorden="' + esc(ZW[sleutel]) + '"';
    else return '';
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
  function laadWinkels(sleutel) {
    var pad = sleutel ? 'assets/zoek/w/' + sleutel.replace('/', '--') + '.json' : 'assets/zoek/winkels.json';
    if (!AW.laden[pad]) AW.laden[pad] = fetch(pad).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); }).then(function (j) {
      var W = j.winkels;
      /* Tijdens de Daisycon-pauze nooit Daisycon-links tonen (de index bevat dan alleen TradeTracker-winkels). */
      return j.producten.filter(function (x) { return !(INST.daisyconPauze && isDaisycon(W[x[2]].link + x[3])); }).map(function (x) { var w = W[x[2]]; x[2] = w.naam; x[3] = w.link + x[3]; x[4] = w.foto + x[4]; return { t: x[0], p: x[1], w: x[2], l: x[3], f: x[4], z: ' ' + (x[0] + ' ' + x[5] + ' ' + x[6] + ' ' + x[2]).toLowerCase().replace(/[^a-z0-9à-ÿ€]+/g, ' '), tl: ' ' + x[0].toLowerCase().replace(/[^a-z0-9à-ÿ€]+/g, ' '), g: x[7] || '' }; });
    }).catch(function () { return sleutel ? laadWinkels() : []; });
    return AW.laden[pad];
  }
  function vulAlleWinkels(sec) {
    var q = sec.getAttribute('data-q') || '', pf = prijsFilter(sec.getAttribute('data-prijs'));
    var woorden = q.toLowerCase().split(/\s+/).filter(Boolean).map(stam);
    var doel = $('.aw-inhoud', sec);
    laadWinkels(sec.getAttribute('data-sleutel') || '').then(function (alles) {
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
  function vonk(q) {
    zetTitel('VONK cadeauzoeker');
    var V = window.LK_VONK;
    var stap = !q.voor ? 1 : !q.moment ? 2 : !q.budget ? 3 : 4;
    var balk = '<div class="vonk-stapjes" aria-hidden="true">' + [1, 2, 3].map(function (n) { return '<span class="' + (n <= stap ? 'aan' : '') + '"></span>'; }).join('') + '</div>';
    var kop = paginakop({ titel: 'VONK', tekst: 'Beantwoord 3 vragen. VONK laat direct passende cadeaus zien.', kruimel: [{ tekst: 'VONK' }] });

    function vraag(titel, opties, sleutel) {
      return '<div class="vonk-vraag"><h2>' + titel + '</h2><div class="keuzes">' + opties.map(function (o) {
        var nq = Object.assign({}, q); nq[sleutel] = o.id;
        return '<a class="keuze" href="' + maakAdres('/vonk', nq) + '" aria-pressed="' + (q[sleutel] === o.id) + '">' + esc(o.label) + '</a>';
      }).join('') + '</div></div>';
    }
    var terug = '';
    if (stap > 1 && stap < 4) {
      var tq = Object.assign({}, q); delete tq[stap === 2 ? 'voor' : 'moment'];
      terug = '<a class="vonk-terug" href="' + maakAdres('/vonk', tq) + '">' + ic('links') + 'Vorige vraag</a>';
    }

    var inhoud = '';
    if (stap === 1) inhoud = vraag('Voor wie zoek je iets?', V.voor, 'voor');
    if (stap === 2) inhoud = vraag('Voor welk moment?', V.moment, 'moment');
    if (stap === 3) inhoud = vraag('Wat is je budget?', PRIJZEN.map(function (p) { return { id: p.id === 'alle' ? 'geen' : p.id, label: p.id === 'alle' ? 'Maakt niet uit' : p.label }; }), 'budget');

    if (stap === 4) {
      var past = function (lijst, waarde) { return waarde === 'iedereen' || (lijst || []).indexOf(waarde) !== -1 || (lijst || []).indexOf('iedereen') !== -1; };
      var alle = LK.zichtbaar().filter(nietChristelijk).filter(function (p) {
        /* dierenspullen alleen tonen als je niet voor een bepaald persoon zoekt */
        return q.voor === 'iedereen' || p.cat !== 'dieren';
      });
      var echt = function (p) { return (p.voor || []).indexOf(q.voor) !== -1 ? 0 : 1; };
      var pastVoor = function (p) { return q.voor === 'collega' ? echt(p) === 0 : past(p.voor, q.voor); };
      var precies = alle.filter(function (p) { return pastVoor(p) && past(p.moment, q.moment) && binnenPrijs(p, q.budget); });
      precies.sort(function (a, b) { return echt(a) - echt(b); });
      /* Te weinig exacte treffers (bijv. collega + €50+)? Dan eerst wat 'voor iedereen' is in dit budget en moment,
         en daarna pas spullen voor deze persoon buiten het budget of moment. Zo blijft het budget zoveel mogelijk leidend. */
      var ruimer = [], anders = [];
      if (precies.length < 12) {
        ruimer = alle.filter(function (p) {
          return precies.indexOf(p) === -1 && (p.voor || []).indexOf('iedereen') !== -1 && past(p.moment, q.moment) && binnenPrijs(p, q.budget);
        });
        anders = alle.filter(function (p) {
          if (precies.indexOf(p) !== -1 || ruimer.indexOf(p) !== -1) return false;
          return pastVoor(p) && (past(p.moment, q.moment) || binnenPrijs(p, q.budget));
        });
      }
      /* Eerst wat echt voor deze persoon is gekozen, daarna wat voor iedereen leuk is. Alles tonen, met 'Toon meer'. */
      /* Afwisselen per categorie, zodat je bovenaan een mooie mix ziet: geuren, sieraden, drank, tech, enz. (wens van Marius). */
      var VOORKEUR = ['mode-beauty/geuren', 'sieraden', 'dranken', 'elektronica', 'mode-beauty/verzorging', 'cadeaus', 'wonen', 'eten-drinken', 'keuken', 'speelgoed', 'boeken-media', 'sport-outdoor', 'hobby'];
      var spreid = function (lijst) {
        var groep = {}, volgorde = [];
        lijst.forEach(function (p) { var k = p.cat === 'mode-beauty' ? p.cat + '/' + p.sub : p.cat; if (!groep[k]) { groep[k] = []; volgorde.push(k); } groep[k].push(p); });
        volgorde.sort(function (a, b) {
          var ia = VOORKEUR.indexOf(a), ib = VOORKEUR.indexOf(b);
          return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
        });
        var uit = [], rond = 0, bezig = true;
        while (bezig) {
          bezig = false;
          volgorde.forEach(function (c) { if (groep[c][rond]) { uit.push(groep[c][rond]); bezig = true; } });
          rond++;
        }
        return uit;
      };
      var groep = function (lijst) { return spreid(sorteer(lijst)); };
      var alles = q.voor === 'iedereen' ? groep(precies).concat(groep(ruimer), groep(anders)) :
        groep(precies.filter(function (p) { return echt(p) === 0; })).concat(groep(precies.filter(function (p) { return echt(p) !== 0; })), groep(ruimer), groep(anders));
      var label = function (lijst, id) { var x = lijst.find(function (o) { return o.id === id; }); return x ? x.label : id; };
      inhoud = '<div class="vonk-vraag"><h2>' + (precies.length ? 'Dit past bij jouw keuze' : 'Geen exacte match, wel deze') + '</h2>' +
        '<div class="vonk-samenvatting">' +
          '<span class="chip actief">Voor: ' + esc(label(V.voor, q.voor)) + '</span>' +
          '<span class="chip actief">' + esc(label(V.moment, q.moment)) + '</span>' +
          '<span class="chip actief">' + esc(q.budget === 'alle' ? 'Elk budget' : prijsFilter(q.budget).label) + '</span>' +
          '<a class="chip" href="/vonk">Opnieuw</a>' +
        '</div></div>' +
        '<p class="vonk-noot" style="margin-top:14px">VONK kijkt naar de kenmerken die wij bij elk product invullen. Geen praatjes, gewoon passende producten.</p>' +
        (alles.length ? '<p class="vonk-noot"><strong>' + alles.length + ' cadeaus</strong> gevonden.</p>' : '') +
        gridMeer(alles,
          leegBlok('Nog niets gevonden', 'We vullen de site steeds verder aan. Probeer een ander budget of moment.', '<a class="knop knop-goud" href="/vonk">Opnieuw</a>'));
    }

    return kop + '<div class="binnen"><div class="vonk-pagina' + (stap === 4 ? '" style="max-width:none' : '') + '">' + (stap < 4 ? balk : '') + inhoud + terug + '</div></div>';
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
    zetTitel('Mijn verlanglijstje');
    var ids = LK.favorieten();
    var lijst = LK.zichtbaar().filter(function (p) { return ids.indexOf(p.id) !== -1; });
    var naam = ''; try { naam = localStorage.getItem('lk-lijst-naam') || ''; } catch (e) {}
    var deel = !lijst.length ? '' :
      '<div class="lijst-deel"><div class="lijst-deel-tekst"><strong>Deel je verlanglijstje</strong>' +
      'Stuur je lijstje naar familie, vrienden of je partner. Zij zien jouw cadeaus en kunnen ze meteen bestellen.</div>' +
      '<div class="lijst-deel-velden"><label>Je naam<input type="text" data-lijst-naam maxlength="30" placeholder="Bijv. Sanne" value="' + esc(naam) + '"></label>' +
      '<label>Waarvoor?<select data-lijst-voor>' + GELEGENHEDEN.map(function (g) { return '<option value="' + g[0] + '">' + g[2] + ' ' + (g[0] === 'verjaardag' ? 'Mijn verjaardag' : g[0] === 'jubileum' ? 'Ons jubileum' : g[1].charAt(0).toUpperCase() + g[1].slice(1)) + '</option>'; }).join('') + '</select></label></div>' +
      '<div class="lijst-deel-knoppen"><button class="knop knop-whatsapp" type="button" data-lijst-whatsapp>' + ic('whatsapp') + ' Deel via WhatsApp</button>' +
      '<button class="knop knop-rand" type="button" data-lijst-kopieer>Kopieer de link</button></div></div>';
    return paginakop({ titel: 'Mijn verlanglijstje', tekst: 'Bewaar cadeaus met het hartje en deel je lijstje met wie je wilt. Je hebt geen account nodig.', kruimel: [{ tekst: 'Verlanglijstje' }] }) +
      '<div class="binnen"><section class="sectie">' + deel +
      grid(lijst, leegBlok('Je verlanglijstje is nog leeg', 'Tik op het hartje bij een cadeau om het op je verlanglijstje te zetten. Daarna kun je het lijstje delen via WhatsApp.', '<a class="knop knop-goud" href="/c/cadeaus">Bekijk cadeaus</a>')) +
      '</section></div>';
  }
  function gedeeldeLijst(q) {
    var ids = (q.p || '').split(/[.,]/).filter(Boolean).slice(0, 40);
    var lijst = ids.map(function (id) { return LK.vind(id); }).filter(function (p) { return p && p.status === 'goedgekeurd'; });
    var weg = ids.length - lijst.length;
    var naam = (q.n || '').slice(0, 30), g = gelegenheid(q.v);
    var titel = naam ? 'Het verlanglijstje van ' + naam : 'Een verlanglijstje voor jou';
    zetTitel(titel);
    var voor = g ? (g[0] === 'verjaardag' ? 'Voor ' + (naam ? 'de verjaardag van ' + naam : 'een verjaardag') : g[0] === 'jubileum' ? 'Voor een jubileum' : g[0] === 'zomaar' ? 'Zomaar, omdat het kan' : 'Voor ' + g[1]) + ' ' + g[2] : '';
    return paginakop({ titel: titel, tekst: (voor ? voor + '. ' : '') + (naam ? naam + ' heeft deze cadeaus uitgekozen.' : 'Deze cadeaus zijn uitgekozen.') + ' Klik op een cadeau en bestel het direct bij de winkel.', kruimel: [{ tekst: 'Verlanglijstje' }] }) +
      '<div class="binnen"><section class="sectie">' +
      (weg > 0 ? '<p class="lijst-weg">' + (weg === 1 ? '1 cadeau van dit lijstje is' : weg + ' cadeaus van dit lijstje zijn') + ' niet meer te koop.</p>' : '') +
      grid(lijst, leegBlok('Dit lijstje is leeg', 'De cadeaus van dit lijstje zijn niet meer te koop. Kijk gerust rond voor iets anders.', '<a class="knop knop-goud" href="/c/cadeaus">Bekijk cadeaus</a>')) +
      '<div class="lijst-zelf"><strong>Zelf ook een verlanglijstje maken?</strong> Tik op het hartje bij de cadeaus die jij wilt en deel je lijstje via WhatsApp. <a class="knop knop-goud" href="/c/cadeaus">Begin met kiezen</a></div>' +
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
      '<h2>Partnerlinks en cookies van winkels</h2><p>Klik je op “Bekijk bij …”, dan ga je naar de winkel. Vaak loopt die link via een partnernetwerk, zoals Daisycon, het bol partnerprogramma of het partnerprogramma van Amazon. Zij plaatsen dan een cookie om te zien dat je via LeukeKeuze kwam. Zo kan de winkel ons een kleine vergoeding geven als je iets koopt. Wij zien niet wie je bent of wat je koopt; alleen hoeveel er via onze links is verkocht. Op de site van de winkel gelden hun eigen privacyverklaring en cookies.</p>' +
      '<h2 lang="en">Privacy Policy (English summary)</h2><p lang="en">Controller: Marius (LeukeKeuze), Kromhout 108, 3311 RH Dordrecht, The Netherlands, leukekeuze.nl@gmail.com. ' +
      'We do not collect personal data: no accounts, no forms, no own tracking or advertising cookies. Favourites are stored only in your own browser. ' +
      'The site is hosted on GitHub Pages; fonts are served from our own site. Visitor statistics are collected with GoatCounter, without cookies and without storing personal data. Links to shops may run through affiliate networks (Daisycon, bol.com, Amazon), which set their own cookies to register sales. ' +
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
    { slug: 'surprise-maken', beeld: 'bol-9300000226734832', vakken: ['cadeaus/sinterklaas', 'cadeaus/sint-onder-15', 'speelgoed/knutselen', 'hobby/knutselen'],
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
          ids: ['bol-9300000226734832', 'bol-9200000074078488', 'bol-9200000104255819', 'bol-9300000146207567', 'bol-9200000052919661', 'bol-9200000059166526', 'bol-9300000245957314'] },
        { kop: 'Kleine cadeautjes voor in je surprise', tekst: 'Bij lootjes trekken spreek je vaak een bedrag af. Deze cadeautjes passen in bijna elke surprise en blijven onder de €15.',
          ids: ['bol-9300000171163755', 'bol-9300000138803498', 'bol-9300000031046460', 'bol-9300000345522494', 'bol-9300000017407527', 'bol-9300000240237143'] },
        { kop: 'Iets lekkers erbij', tekst: 'Een chocoladeletter of kruidnoten horen er gewoon bij. Leuk om in of naast je surprise te leggen.',
          ids: ['bol-9300000010371405', 'bol-9300000161275021', 'bol-9300000244698921'] },
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
    { slug: 'sinterklaas-onder-10', beeld: 'bol-9300000157956217', vakken: ['cadeaus/sinterklaas', 'cadeaus/sint-onder-15', 'cadeaus/voor-kinderen', 'cadeaus/onder-15', 'speelgoed'], titel: 'Sinterklaascadeaus onder de €10: voor in de schoen en als klein pakje', kort: 'Kleine cadeautjes voor de schoen en pakjesavond, allemaal onder een tientje.',
      intro: 'Elke avond een schoen zetten, en dan ook nog pakjesavond: dat loopt snel op. Daarom koos ik cadeautjes onder de 10 euro waar kinderen echt blij van worden. Kleine setjes, boekjes en spelletjes, van merken die je kent.',
      delen: [
        { kop: 'Voor in de schoen (tot €5)', tekst: 'Klein genoeg om in een schoen te passen, en toch iets om mee te spelen.',
          ids: ['bol-9300000232471843', 'bol-9300000094852181', 'bol-9200000088621923', 'bol-9300000039278002'] },
        { kop: 'Zelf maken en ontdekken (€5 tot €8)', tekst: 'Knutselen en proefjes doen: daar zijn ze na pakjesavond nog dagen mee bezig.',
          ids: ['bol-9300000138803474', 'bol-9300000025044624', 'bol-9200000104835927', 'bol-9300000168680075'] },
        { kop: 'Boekjes en spelletjes (tot €10)', tekst: 'Een sinterklaasboekje om voor te lezen, of een spel om meteen samen te spelen.',
          ids: ['bol-9300000112625200', 'bol-9200000006380085', 'bol-9300000065878158', 'bol-9300000157956217'] }
      ],
      slot: 'Meer kleine cadeautjes staan bij <a href="/c/cadeaus/sint-onder-15">Sinterklaas onder €15</a>. Alles voor pakjesavond vind je bij <a href="/c/cadeaus/sinterklaas">Sinterklaas</a>.' },
    { slug: 'speelgoed-van-het-jaar-2026', beeld: 'bol-9300000246863962', vakken: ['speelgoed', 'speelgoed/bordspellen', 'speelgoed/kaartspellen', 'speelgoed/bouwen', 'speelgoed/figuren-voertuigen', 'speelgoed/baby-peuter', 'cadeaus/voor-kinderen', 'cadeaus/sinterklaas'],
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
      slot: 'Meer speelgoed vind je bij <a href="/c/speelgoed">Speelgoed & Spellen</a> en <a href="/c/cadeaus/voor-kinderen">Cadeaus voor kinderen</a>. Tip: populaire winnaars zijn rond Sinterklaas vaak snel uitverkocht, dus wacht niet te lang.' },
    { slug: 'sinterklaas-voor-volwassenen', beeld: 'bol-9300000232180883', vakken: ['cadeaus/sinterklaas', 'cadeaus/sint-onder-15', 'cadeaus/onder-15', 'eten-drinken/chocolade-snoep'], titel: 'Sinterklaascadeaus voor volwassenen: lootjes, surprises en lekkers', kort: 'Ideeën voor als je lootjes trekt met familie, vrienden of collega’s.',
      intro: 'Sinterklaas is niet alleen voor kinderen. Veel families en vriendengroepen trekken lootjes, vaak met een vast bedrag van 10 of 15 euro. Dit zijn cadeaus die het goed doen bij volwassenen: iets om te spelen, iets lekkers, of iets dat je echt gebruikt.',
      delen: [
        { kop: 'Voor de lootjes (tot €15)', tekst: 'Een spel voor na het uitpakken, een grote mok, of een puzzel van de intocht.',
          ids: ['bol-9300000192994012', 'bol-9300000345522494', 'bol-9300000232180883', 'bol-1004004005951228'] },
        { kop: 'Lekkers van de Sint', tekst: 'Kruidnoten en chocolade, maar dan net even anders dan uit de supermarkt.',
          ids: ['bol-9300000161275021', 'bol-9300000244698921', 'bol-9300000151088723', 'bol-9300000044737130'] },
        { kop: 'Iets groters (€20 tot €40)', tekst: 'Als je iets meer mag uitgeven: cadeaus die lang meegaan.',
          ids: ['bol-9200000091821418', 'bol-9200000016853146', 'bol-9300000343902998', 'bol-9300000005044757'] }
      ],
      slot: 'Alle sinterklaascadeaus vind je bij <a href="/c/cadeaus/sinterklaas">Sinterklaas</a>. Zoek je iets voor een kind? Kijk dan bij <a href="/gids/sinterklaas-onder-10">Sinterklaascadeaus onder de €10</a>.' },
    { slug: 'kerstcadeau-onder-25', beeld: 'bol-9300000238623285', vakken: ['cadeaus/kerst', 'cadeaus/onder-15', 'eten-drinken', 'wonen/kerstdecoratie'], titel: 'Kerstcadeaus onder de €25', kort: 'Mooie cadeaus voor onder de boom die niet veel kosten.',
      intro: 'Met Kerst geef je vaak aan meer mensen tegelijk. Dan is het fijn als een cadeau niet te duur is, maar wel echt leuk om te krijgen. Deze cadeaus kosten allemaal minder dan 25 euro.',
      delen: [
        { kop: 'Lekkers voor onder de boom', tekst: 'Koffie, thee en chocolade in een mooie verpakking. Altijd goed, voor iedereen.',
          ids: ['bol-9300000240085617', 'bol-9300000008252018', 'bol-9300000383269797', 'bol-9300000241393562'] },
        { kop: 'Gezellig in huis', tekst: 'Lichtjes, een kandelaar of kerstbekers: cadeaus waar je de hele decembermaand wat aan hebt.',
          ids: ['bol-9300000229498501', 'bol-9300000345522500', 'bol-9300000182787559', 'bol-9300000238623285'] },
        { kop: 'Samen aan tafel', tekst: 'Een puzzel of spel voor de dagen tussen Kerst en Oud en Nieuw.',
          ids: ['bol-9300000172981367', 'bol-9300000133136276', 'bol-9300000174665071', 'bol-9300000375928006'] }
      ],
      slot: 'Meer goedkope cadeaus vind je bij <a href="/c/cadeaus/onder-15">Cadeaus onder €15</a>. Alle kerstcadeaus staan bij <a href="/c/cadeaus/kerst">Kerst</a>.' },
    { slug: 'kerstcadeau-voor-haar', beeld: 'bol-9300000142746730', vakken: ['cadeaus/kerst', 'cadeaus/voor-haar', 'mode-beauty', 'mode-beauty/geuren', 'mode-beauty/verzorging'], titel: 'Kerstcadeau voor haar: van klein verwenmoment tot luxe', kort: 'Voor je vrouw, vriendin, moeder of zus. Van 19 tot 130 euro.',
      intro: 'Een kerstcadeau voor haar hoeft niet ingewikkeld te zijn. Iets om jezelf mee te verwennen, iets lekkers bij de thee, of iets moois voor in huis. Ik zette cadeaus in drie prijsklassen op een rij, zodat je snel iets vindt dat bij je budget past.',
      delen: [
        { kop: 'Tot €25', tekst: 'Klein, maar met aandacht gekozen.',
          ids: ['bol-9300000159912462', 'bol-9300000225710092', 'bol-9300000319966796', 'bol-9300000168710886'] },
        { kop: '€25 tot €60', tekst: 'Cadeausets en mooie dingen voor in huis.',
          ids: ['bol-9300000237452859', 'bol-9300000253909209', 'bol-9300000162839311', 'bol-9300000247719933'] },
        { kop: 'Luxe (vanaf €60)', tekst: 'Voor als je echt wilt uitpakken.',
          ids: ['bol-9300000331215829', 'bol-9300000142746730', 'bol-9200000132246044', 'bol-9300000236208265'] }
      ],
      slot: 'Meer ideeën staan bij <a href="/c/cadeaus/voor-haar">Cadeaus voor haar</a> en <a href="/c/mode-beauty/geuren">Geuren</a>.' },
    { slug: 'kerstcadeau-voor-hem', beeld: 'bol-9300000105460117', vakken: ['cadeaus/kerst', 'cadeaus/voor-hem', 'mode-beauty/geuren', 'sport-outdoor/darts', 'elektronica'], titel: 'Kerstcadeau voor hem: van grappig tot gadget', kort: 'Voor je man, vriend, vader of broer. Van 20 tot 180 euro.',
      intro: 'Mannen zeggen vaak dat ze niets nodig hebben. Toch zijn er genoeg cadeaus waar ze stiekem blij mee zijn: iets voor de auto, iets om mee te koken of te drinken, of een gadget. Hier staan ze in drie prijsklassen.',
      delen: [
        { kop: 'Tot €35', tekst: 'Leuk en betaalbaar.',
          ids: ['bol-9300000269870256', 'bol-9300000191796264', 'bol-9300000124265945', 'bol-9300000226847162'] },
        { kop: '€35 tot €80', tekst: 'Dingen die hij elke week gebruikt.',
          ids: ['bol-9300000083266771', 'bol-9200000101456379', 'bol-1004004012237893', 'bol-9200000127709459'] },
        { kop: 'Luxe (vanaf €80)', tekst: 'Voor een groot cadeau, of om met z’n allen te geven.',
          ids: ['bol-9300000105460117', 'bol-9200000118422706', 'bol-9300000015405237', 'bol-9200000132005044'] }
      ],
      slot: 'Meer ideeën staan bij <a href="/c/cadeaus/voor-hem">Cadeaus voor hem</a>, <a href="/c/sport-outdoor/darts">Darts</a> en <a href="/c/dranken">Dranken</a>.' },
    { slug: 'kerstcadeau-collega', beeld: 'bol-9300000237452859', vakken: ['cadeaus/kerst', 'cadeaus/collega'], titel: 'Kerstcadeau voor een collega of het hele team', kort: 'Echte cadeaus die ze blijven gebruiken: van een mooie pen tot een verwenset.',
      intro: 'Een kerstcadeau voor een collega moet niet te persoonlijk zijn en ook niet te duur. Maar het mag wel een echt cadeau zijn: iets wat ze elke werkdag gebruiken, of iets om thuis van te genieten. Dus geen zak chips of een reep chocola die je zo in de supermarkt koopt, maar iets waar ze nog lang aan terugdenken. Geef je met het hele team? Dan kun je wat groter denken.',
      delen: [
        { kop: 'Klein bedankje (tot €15)', tekst: 'Voor de collega die je iets wilt geven, zonder dat het gek wordt. Klein, maar ze gebruiken het echt.',
          ids: ['bol-9300000132296580', 'bol-9300000338660274', 'bol-9300000130428935', 'bol-9300000256554614'] },
        { kop: 'Iets moois voor op het bureau of thuis (€15 tot €25)', tekst: 'Een goede pen, een plantje dat bijna niet dood kan of een fijne geur: daar heeft iemand de hele winter plezier van.',
          ids: ['bol-9300000023740845', 'bol-9300000143116033', 'bol-9200000078061085', 'bol-9300000237729002'] },
        { kop: 'Met het hele team (€25 en meer)', tekst: 'Als je met z’n allen iets geeft, bijvoorbeeld aan de baas of aan iemand die weggaat: een verwenset of iets van een topmerk.',
          ids: ['bol-9300000237452859', 'bol-9300000002319410', 'bol-9300000225803811', 'bol-9300000021869451'] }
      ],
      slot: 'Meer ideeën staan bij <a href="/c/cadeaus/collega">Cadeau voor collega</a> en in de gids <a href="/gids/cadeau-voor-collega">Cadeau voor een collega: 12 ideeën</a>.' },
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
          ids: ['bol-9200000045616958', 'bol-9200000045615078', 'bol-9200000045616978', 'bol-9200000045616830'] }
      ],
      slot: 'Meer kerststallen en engelen staan bij <a href="/c/christelijk/kerststal-engelen">Kerststallen &amp; engelen</a>. Zoek je iets voor kinderen? Kijk dan bij <a href="/c/christelijk/voor-kinderen">Christelijke cadeaus voor kinderen</a>.' },
    { slug: 'hypes-2026', beeld: 'bol-9300000236575345', vakken: ['cadeaus/voor-kinderen', 'speelgoed', 'speelgoed/figuren-voertuigen', 'elektronica/gaming', 'cadeaus/sint-onder-15'],
      titel: 'De hypes van 2026: waar kinderen en tieners nu gek op zijn', kort: 'Tamagotchi, verrassingsdoosjes, KPop Demon Hunters en meer: dit staat op elk verlanglijstje.',
      intro: 'Elk jaar zijn er een paar dingen waar ineens iedereen het over heeft, op het schoolplein en op TikTok. In 2026 zijn dat de Tamagotchi (ja, die van vroeger), verrassingsdoosjes en tashangers, alles van KPop Demon Hunters, Pokémon en Stitch. Hier vind je ze op een rij, zodat je precies weet waar je kind of kleinkind blij van wordt.',
      delen: [
        { kop: 'De hits van het schoolplein', tekst: 'De Tamagotchi is helemaal terug, en KPop Demon Hunters is de film waar elk kind het over heeft.',
          ids: ['bol-9300000241515822', 'bol-9300000236575345', 'bol-9300000273887351', 'bol-9300000354107444'] },
        { kop: 'Verrassingsdoosjes en tashangers', tekst: 'Uitpakken is de helft van de pret: je weet nooit welke je krijgt. Tashangers zijn dé trend voor aan je rugzak.',
          ids: ['bol-9300000264493695', 'bol-9300000268338286', 'bol-9300000261371860', 'bol-9300000227351372'] },
        { kop: 'Pokémon en Stitch', tekst: 'Al jaren populair, en in 2026 groter dan ooit: Pokémon viert zijn 30e verjaardag.',
          ids: ['bol-9300000377799800', 'bol-9300000331860190', 'bol-9300000159234222', 'bol-9300000026009635'] },
        { kop: 'Voor de kleine vlogger en gamer', tekst: 'Zelf filmpjes maken, een eigen horloge of de nieuwste Pokémon-game: voor kinderen die graag met techniek bezig zijn.',
          ids: ['bol-9300000273861930', 'bol-9300000152351739', 'bol-9300000240660527', 'bol-9300000183040640'] }
      ],
      slot: 'Meer ideeën vind je bij <a href="/c/cadeaus/voor-kinderen">Cadeaus voor kinderen</a> en in de gids <a href="/gids/speelgoed-van-het-jaar-2026">Speelgoed van het Jaar 2026</a>. Tip: hypes zijn rond Sinterklaas en Kerst vaak als eerste uitverkocht.' },
    { slug: 'virale-cadeaus-2026', beeld: 'bol-9300000243481710', vakken: ['cadeaus/voor-haar', 'cadeaus/voor-hem', 'elektronica/audio', 'keuken/keukenapparaten', 'speelgoed/bouwen', 'mode-beauty/verzorging'],
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
          ids: ['bol-9300000197592346', 'bol-9300000060629305', 'bol-9300000259398888', 'bol-9300000163759795'] }
      ],
      slot: 'Zoek je iets voor kinderen en tieners? Kijk dan in de gids <a href="/gids/hypes-2026">De hypes van 2026</a>. Voor parfum is er <a href="/gids/geuren-trends-2026">Geuren die nu hot zijn</a>. Tip: virale producten zijn rond de feestdagen snel uitverkocht, dus wacht niet te lang.' },
    { slug: 'geuren-trends-2026', beeld: 'bol-9300000170836066', vakken: ['mode-beauty/geuren', 'mode-beauty', 'cadeaus/voor-haar'],
      titel: 'Geuren die nu hot zijn: ontdekkingssets, layeren en de klassiekers', kort: 'Van een proefset om te ontdekken tot de parfum die iedereen herkent.',
      intro: 'Parfum is een van de populairste cadeaus, en er gebeurt veel. Ontdekkingssets met kleine flesjes zijn in, net als "layeren": twee geuren over elkaar dragen voor je eigen mix. Daarnaast blijven de grote klassiekers het altijd goed doen. Hier staan de mooiste, voor haar en voor hem, van klein tot luxe.',
      delen: [
        { kop: 'Ontdekkingssets: eerst proeven', tekst: 'Kleine flesjes van verschillende geuren. Ideaal als je niet weet welke geur iemand mooi vindt.',
          ids: ['bol-9300000176004073', 'bol-9300000183855220', 'bol-9300000183494175', 'bol-9300000291533838'] },
        { kop: 'Layeren en parfumbalsems', tekst: 'Een parfumolie of balsem draag je los of over je eigen parfum. Vaak ook nog voordelig.',
          ids: ['bol-9300000003438540', 'bol-9300000240443530', 'bol-9300000406573818', 'bol-9300000318870515'] },
        { kop: 'Klassiekers voor haar', tekst: 'Deze flesjes herkent iedereen. Een cadeau waar je nooit mee misgaat.',
          ids: ['bol-9300000266921937', 'bol-9300000170836066', 'bol-9300000363592116', 'bol-9300000238825117'] },
        { kop: 'Klassiekers voor hem', tekst: 'Stoere geuren die mannen echt dragen, vaak als set met douchegel of deo.',
          ids: ['bol-9300000228928212', 'bol-9300000245612578', 'bol-9300000247496139', 'bol-9300000363538158'] }
      ],
      slot: 'Alle geuren vind je bij <a href="/c/mode-beauty/geuren">Geuren</a>. Tip: twijfel je? Kies een ontdekkingsset, dan kan de ander zelf de favoriet uitzoeken.' },
    { slug: 'sinterklaas-onder-15', beeld: 'bol-9300000181433977', vakken: ['cadeaus/sinterklaas', 'cadeaus/sint-onder-15', 'speelgoed/knutselen'], titel: 'Sinterklaascadeaus onder de €15', kort: 'Leuke surprises en kleine cadeautjes voor pakjesavond, zonder dat het veel kost.',
      intro: 'Op pakjesavond gaat het niet om dure cadeaus, maar om iets leuks om uit te pakken. Daarom zette ik de beste cadeautjes onder de 15 euro op een rij. Handig als je meerdere kinderen hebt, of als je lootjes trekt met een vast bedrag.',
      delen: [
        { kop: 'Voor kinderen die graag iets maken', tekst: 'Knutselsetjes zijn ideaal voor de schoen of als klein pakje: goedkoop, en ze zijn er na pakjesavond nog dagen zoet mee.',
          ids: ['bol-9300000071114106', 'bol-9300000169748883', 'bol-1004004007096491', 'bol-9200000109023395'] },
        { kop: 'Puzzels en spelletjes', tekst: 'Een puzzel of spelletje kun je meteen samen doen, als de pakjes open zijn.',
          ids: ['bol-9300000181433977', 'bol-9300000178728048', 'bol-9300000020405193', 'bol-9300000221675724'] },
        { kop: 'Voor de lootjes onder volwassenen en tieners', tekst: 'Een mok van hun favoriete serie of film, of iets lekkers: altijd raak.',
          ids: ['bol-9300000237478282', 'bol-9300000155871150', 'bol-9300000192710306', 'bol-9300000255947352'] }
      ],
      slot: 'Meer ideeën vind je bij <a href="/c/cadeaus/sint-onder-15">alle Sinterklaascadeaus onder €15</a> en <a href="/c/cadeaus/sinterklaas">Sinterklaas</a>. Tip: koop op tijd, rond 5 december zijn populaire cadeautjes vaak snel uitverkocht.' },
    { slug: 'cadeau-voor-collega', beeld: 'bol-9300000143116033', vakken: ['cadeaus/collega', 'boeken-media/agendas'], titel: 'Cadeau voor een collega: 12 ideeën die altijd goed vallen', kort: 'Voor een verjaardag, afscheid, kerst of gewoon als bedankje.',
      intro: 'Een cadeau voor een collega is lastig: je wilt iets persoonlijks, maar het mag niet te duur of te gek zijn. Deze cadeaus vallen bijna altijd goed, voor een verjaardag, een afscheid of als bedankje.',
      delen: [
        { kop: 'Kleine bedankjes (tot €20)', tekst: 'Iets lekkers of een klein plantje voor op het bureau. Niet te veel, wel attent.',
          ids: ['bol-9300000017147055', 'bol-9300000239566022', 'bp-l114', 'dvzn-711692'] },
        { kop: 'Voor op de werkplek', tekst: 'Praktisch en toch een cadeau: dingen waar iemand elke werkdag plezier van heeft.',
          ids: ['bol-9300000237729002', 'bol-1003004011415851', 'bol-9300000002319410', 'bol-9300000143116033'] },
        { kop: 'Afscheid met een knipoog', tekst: 'Gaat een collega weg? Een grappig cadeau maakt het afscheid luchtiger. Leuk om met het hele team te geven.',
          ids: ['bol-9300000242745735', 'bol-9300000238049219', 'bol-9300000225912982', 'bol-9300000174098365'] }
      ],
      slot: 'Bekijk alle ideeën bij <a href="/c/cadeaus/collega">Cadeau voor collega</a>. Geef je met het hele team? Kijk dan ook eens naar de wat duurdere cadeaus, zoals een mooie laptoptas of lunchpot.' },
    { slug: 'kerstcadeau-opa-oma', vakken: ['cadeaus/kerst', 'cadeaus/opa-oma', 'wonen/plaids-kussens', 'speelgoed/puzzels'], titel: 'Kerstcadeau voor opa en oma', kort: 'Cadeaus voor opa en oma die ze echt gaan gebruiken, van spelletjes tot herinneringen.',
      intro: 'Opa en oma zeggen vaak dat ze niets nodig hebben. Toch zijn er cadeaus waar ze echt blij van worden: iets om samen met de kleinkinderen te doen, iets warms voor de winter, of een herinnering.',
      delen: [
        { kop: 'Samen met de kleinkinderen', tekst: 'Spelletjes die opa en oma nog kennen van vroeger, en die kleinkinderen ook leuk vinden.',
          ids: ['bol-1004004000008403', 'bol-1004004011781804', 'bol-9200000108574427', 'bol-9300000132852206'] },
        { kop: 'Warm en gezellig de winter door', tekst: 'Voor lange winteravonden op de bank of in de stoel.',
          ids: ['bol-9300000196514024', 'bol-9300000236851351', 'bol-9200000075452260', 'bol-9300000098766103'] },
        { kop: 'Herinneringen en muziek', tekst: 'Foto’s van de kleinkinderen of muziek van vroeger: daar raken ze niet op uitgekeken.',
          ids: ['bol-9300000167329318', 'bol-9300000032182043', 'bol-9300000237380954', 'bol-9300000171232502'] }
      ],
      slot: 'Nog meer ideeën staan bij <a href="/c/cadeaus/opa-oma">Cadeaus voor opa en oma</a> en <a href="/c/cadeaus/kerst">Kerstcadeaus</a>.' },
    { slug: 'sfeerlicht-donkere-avonden', vakken: ['wonen', 'wonen/verlichting', 'elektronica/slimme-gadgets'], titel: 'Sfeerlicht voor donkere avonden: lavalampen, sterrenprojectors en meer', kort: 'De klok is terug en het is vroeg donker. Zo maak je het thuis gezellig.',
      intro: 'Als de klok een uur terug gaat, is het ineens om half zes al donker. Een fel plafondlicht maakt het dan niet gezellig. Deze lampen geven sfeer, en het zijn ook leuke cadeaus voor tieners en volwassenen.',
      delen: [
        { kop: 'Lavalampen', tekst: 'De klassieker uit de jaren zeventig is weer helemaal terug. Rustgevend om naar te kijken.',
          ids: ['bol-9300000178837609', 'bol-9300000021560153', 'bol-9300000270438411', 'bol-9300000181178047'] },
        { kop: 'Sterren en noorderlicht op je plafond', tekst: 'Projectors die een sterrenhemel of noorderlicht op je plafond toveren. Heerlijk om bij in slaap te vallen.',
          ids: ['bol-9300000191136002', 'bol-9300000193639901', 'bol-9300000019790368', 'bol-9300000164083567'] },
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
          ids: ['bol-9300000256133316', 'bol-9300000039415364', 'dvzn-847923', 'dvzn-7029'] },
        { kop: 'Met het hele team (€25 en meer)', tekst: 'Als iedereen een paar euro geeft, kun je samen voor iets moois gaan.',
          ids: ['bol-9300000237452859', 'bol-9300000021869451', 'bol-9300000174098365', 'bol-9300000015405237'] },
        { kop: 'Zo regel je het samen in 4 stappen', tekst: 'Met een paar afspraken is het zo geregeld.',
          stappen: [
            'Spreek af wie het regelt en hoeveel iedereen ongeveer geeft. Een vast bedrag van 5 of 10 euro per persoon voorkomt gedoe.',
            'Haal het geld op met een betaalverzoek. Dan hoeft niemand contant geld mee te nemen.',
            'Laat een kaart of afscheidsboek stil rondgaan, zodat iedereen erin kan schrijven zonder dat de collega het ziet.',
            'Geef het cadeau op de laatste werkdag, met een kort praatje. Een paar zinnen over wat je gaat missen is genoeg.'
          ] }
      ],
      slot: 'Meer ideeën staan bij <a href="/c/cadeaus/collega">Cadeau voor collega</a> en in de gids <a href="/gids/cadeau-voor-collega">Cadeau voor een collega</a>. Gaat iemand met pensioen? Lees dan <a href="/gids/cadeau-voor-pensioen">Cadeau voor pensioen</a>.' },
    { slug: 'cadeau-voor-pensioen', beeld: 'bol-9300000171232502', vakken: ['cadeaus/collega', 'cadeaus/opa-oma'],
      titel: 'Cadeau voor pensioen: voor een collega, je vader of je moeder', kort: 'Grappige cadeaus, iets om te bewaren en spullen voor de nieuwe hobby. Van 9 tot 259 euro.',
      intro: 'Na jaren werken eindelijk met pensioen. Daar hoort een cadeau bij! Maar wat geef je iemand die ineens alle tijd heeft? Iets grappigs voor de afscheidsreceptie, iets om de herinneringen aan het werk te bewaren, of juist iets voor de hobby waar nu eindelijk tijd voor is: vogels kijken, fietsen, tuinieren of schatzoeken met een metaaldetector. Ik zette de beste ideeën op een rij.',
      delen: [
        { kop: 'Met een knipoog', tekst: 'Voor op de afscheidsreceptie. Daar wordt om gelachen.',
          ids: ['dvzn-734300', 'amz-b0hgq4q3pd', 'bol-9300000234965416', 'bol-9300000385427142'] },
        { kop: 'Om te bewaren', tekst: 'Laat collega’s, familie en vrienden iets schrijven. Dat leest iemand later nog vaak terug.',
          ids: ['amz-b0b3tdry1m', 'bol-9200000064944767', 'dvzn-452003', 'amz-b0d95l6674'] },
        { kop: 'Voor de nieuwe hobby', tekst: 'Eindelijk tijd voor wat je altijd al wilde doen. Met deze cadeaus kan iemand meteen beginnen.',
          ids: ['bol-9300000171232502', 'bol-9200000018494649', 'bol-9200000010409823', 'bol-9200000075382464', 'bol-9300000057830180', 'bol-9300000007378766'] },
        { kop: 'Tip: geef er een afspraak bij', tekst: 'Het mooiste cadeau voor iemand met pensioen is soms gewoon tijd samen. Schrijf op een kaartje bij je cadeau een afspraak: samen fietsen, samen naar de vogels kijken of een dagje uit. Dan heeft het cadeau meteen een plan erbij.' }
      ],
      slot: 'Meer ideeën staan bij <a href="/c/cadeaus/collega">Cadeau voor collega</a>, <a href="/c/dieren/vogels">Vogels</a> en <a href="/c/metaaldetectie">Metaaldetectie</a>. Gaat er een collega weg naar een nieuwe baan? Lees dan <a href="/gids/afscheidscadeau-collega">Afscheidscadeau voor een collega</a>.' },
    { slug: 'valentijnscadeau-voor-haar', beeld: 'bp-l087', vakken: ['valentijn/voor-haar', 'valentijn', 'cadeaus/voor-haar', 'sieraden'],
      titel: 'Valentijnscadeau voor haar: romantische cadeaus voor je vriendin of vrouw', kort: 'Hartjessieraden, rozen die nooit verwelken en iets om haar te verwennen. Van 13 tot 1.200 euro.',
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
      titel: 'Valentijnscadeau voor hem: romantisch, maar niet zoetsappig', kort: 'Een horloge, een leren armband, iets met zijn naam of een avond samen. Van 27 tot 120 euro.',
      intro: 'Een valentijnscadeau voor hem vinden is lastig. Veel mannen houden niet van roze hartjes, maar vinden een romantisch gebaar stiekem wel heel fijn. Kies daarom iets wat hij echt gebruikt en wat toch iets van jou zegt: een mooi horloge, een armband die hij elke dag draagt of een avond samen. Hier zijn de beste ideeën.',
      delen: [
        { kop: 'Iets om elke dag te dragen', tekst: 'Een horloge of een stoere armband. Elke keer dat hij erop kijkt, denkt hij aan jou.',
          ids: ['bol-9200000076851367', 'bol-9300000267824769', 'bol-9300000047747066', 'myka-11001234004', 'tbl-tb0a2dhs999os1'] },
        { kop: 'Met zijn naam erop', tekst: 'Persoonlijk en toch stoer: manchetknopen, een ketting of een armband met een naam of letter.',
          ids: ['myka-11017179911', 'myka-1101781611', 'myka-11001421304', 'myka-11003249788'] },
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
        { kop: 'Een klein gebaar', tekst: 'Een rood neonhart, ontbijt op bed of een fonduepannetje voor twee. Klein, maar het zegt genoeg.',
          ids: ['bol-9300000084984419', 'bol-9300000126380123', 'bol-9300000164551900'] },
        { kop: 'Tip: maak er een dag van', tekst: 'Ga terug naar de plek waar jullie elkaar voor het eerst zagen, of doe nog eens wat jullie op jullie eerste date deden. Het cadeau maakt de dag compleet.' }
      ],
      slot: 'Meer ideeën staan bij <a href="/c/valentijn/samen">Samen & jubileum</a> en <a href="/c/valentijn/romantische-avond">Romantische avond</a>. Zijn jullie al langer getrouwd? Lees dan <a href="/gids/cadeau-trouwdag-jubileum">Cadeau voor je trouwdag of huwelijksjubileum</a>.' },
    { slug: 'cadeau-trouwdag-jubileum', beeld: 'lego-31214', vakken: ['valentijn/samen', 'valentijn/met-naam', 'valentijn'],
      titel: 'Cadeau voor je trouwdag of huwelijksjubileum: 12,5, 25, 40 of 50 jaar getrouwd', kort: 'Sieraden met jullie namen, iets moois voor in huis en een avond om samen te vieren. Van 25 tot 1.200 euro.',
      intro: 'Een trouwdag is elk jaar weer een moment om stil te staan bij elkaar. Bij een groot jubileum, zoals 12,5, 25, 40 of 50 jaar getrouwd, hoort een cadeau dat blijft: een sieraad met jullie namen, iets moois voor in huis of een avond om het samen te vieren. Ook als je een cadeau zoekt voor je ouders of opa en oma die al zo lang samen zijn, vind je hier ideeën.',
      delen: [
        { kop: 'Iets dat blijft', tekst: 'Een sieraad van echt goud met jullie namen of twee harten in elkaar. Voor een groot jubileum.',
          ids: ['myka-11001365601', 'myka-11001131631', 'myka-11003211420', 'myka-11003136601'] },
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
          ids: ['bol-9300000139904477', 'bol-9200000012820590', 'bol-9300000263045759', 'bol-1001004001847857', 'bol-9200000101887063'] },
        { kop: 'Voor elke dag (6 tot 12 jaar)', tekst: 'Een verhaal voor elke dag van het jaar, of een kinderbijbel die dicht bij de Bijbel blijft. Ook om zelf in te lezen.',
          ids: ['bol-9300000235874233', 'bol-9300000130260497', 'bol-9200000052023945', 'bol-9300000337284179'] }
      ],
      slot: 'Meer bijbels en boeken staan bij <a href="/c/christelijk/bijbels">Bijbels</a> en <a href="/c/christelijk/voor-kinderen">Christelijke cadeaus voor kinderen</a>. Zoek je een cadeau voor een doop? Kijk bij <a href="/c/christelijk/doop-belijdenis">Doop &amp; belijdenis</a>.' }
  ];
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
  function gidsKaart(g) {
    /* Kaartbeeld: het product in 'beeld' (met de hand gekozen), anders het eerste product uit de gids. */
    var eerste = (g.beeld && LK.vind(g.beeld)) || g.delen[0].ids.map(function (id) { return LK.vind(id); }).filter(Boolean)[0];
    return '<a class="gidskaart" href="/gids/' + g.slug + '">' + '<span class="gidsbeeld">' + (eerste ? LK.productBeeld(eerste) : '') + '</span>' +
      '<span><strong>' + esc(g.titel) + '</strong><small>' + esc(g.kort) + '</small></span></a>';
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
    window.LK_SEO = g.kort + ' ' + g.intro.split('. ')[0] + '.';
    var h = paginakop({ titel: g.titel, kruimel: [{ tekst: 'Cadeaugidsen', naar: '/gids' }, { tekst: g.titel }] }) +
      '<div class="binnen"><article class="tekstpagina gids"><p>' + esc(g.intro) + '</p></article>';
    g.delen.forEach(function (d) {
      /* Een deel kan ook alleen tekst zijn (zonder producten), met een lijstje (veld 'lijst') of genummerde stappen (veld 'stappen'). */
      var extra = (d.lijst ? '<ul>' + d.lijst.map(function (r) { return '<li>' + esc(r) + '</li>'; }).join('') + '</ul>' : '') +
        (d.stappen ? '<ol>' + d.stappen.map(function (r) { return '<li>' + esc(r) + '</li>'; }).join('') + '</ol>' : '');
      if (!d.ids) { h += '<article class="tekstpagina gids"><h2>' + esc(d.kop) + '</h2><p>' + esc(d.tekst) + '</p>' + extra + '</article>'; return; }
      var lijst = sfeerEerst(d.ids.map(function (id) { return LK.vind(id); }).filter(function (p) { return p && !p.verborgen; }));
      if (!lijst.length) return;
      h += '<section class="sectie sfeer-modus"><div class="tekstpagina gids"><h2>' + esc(d.kop) + '</h2><p>' + esc(d.tekst) + '</p>' + extra + '</div>' + grid(lijst, '') + '</section>';
    });
    h += '<article class="tekstpagina gids"><p>' + g.slot + '</p><p class="klein">Prijzen kunnen veranderen. De prijs bij de winkel is altijd leidend.</p>' +
      '<h2>Meer cadeaugidsen</h2><div class="gidslijst">' + GIDSEN.filter(function (x) { return x !== g; }).map(gidsKaart).join('') + '</div></article></div>';
    return h;
  }

  function nietGevonden(tekst) {
    zetTitel('Niet gevonden');
    return paginakop({ titel: 'Niet gevonden', tekst: tekst || 'Deze pagina bestaat niet (meer).' }) +
      '<div class="binnen"><section class="sectie">' + leegBlok('Even kwijt?', 'Ga terug naar de homepage of kies een categorie.', '<a class="knop knop-goud" href="/">Naar home</a>') + '</section></div>';
  }

  /* Subcategorieën die echt iets bevatten. Lege subs (bv. 'Met naam') blijven verborgen tot er producten in staan. */
  function subAdres(c, s) { return s.naar || '/c/' + c.slug + '/' + s.slug; }
  function volleSubs(c) {
    var z = LK.zichtbaar();
    return c.subs.filter(function (s) {
      if (s.verborgen) return false;
      return s.slug === 'onder-15' || z.some(function (p) { return LK.hoortBij(p, c.slug, s.slug); });
    });
  }

  /* ================== MENU'S ================== */
  function bouwLade() {
    var uit = CATS.filter(function (c) { return c.uitgelicht; })[0];
    var rest = CATS.filter(function (c) { return !c.uitgelicht && c.slug !== 'christelijk'; }), chr = window.LK_CAT('christelijk');
    var ladeRij = function (c) {
      return '<li><button class="lade-rij" type="button" aria-expanded="false" aria-controls="ls-' + c.slug + '">' + ic(c.icoon, 'ic') + '<span>' + esc(c.naam) + '</span>' + ic('rechts', 'pijl') + '</button>' +
        '<div class="lade-subs" id="ls-' + c.slug + '"><a class="alles" href="/c/' + c.slug + '">Alles in ' + esc(c.naam) + '</a>' +
        volleSubs(c).map(function (s) { return '<a href="' + subAdres(c, s) + '">' + esc(s.naam) + '</a>'; }).join('') + '</div></li>';
    };
    $('[data-lade]').innerHTML =
      (uit ? '<a class="lade-uitgelicht" href="/c/' + uit.slug + '"><span class="rond">' + ic(uit.icoon) + '</span><span><strong>' + esc(uit.naam) + '</strong><small>' + esc(uit.tekst) + '</small></span></a>' : '') +
      '<div class="lade-label">Voor wie?</div><div class="lade-personen">' + window.LK_PERSONEN.map(function (x) {
        return '<a href="' + (x.subs ? '/voor/' + x.slug : x.naar) + '"><img src="' + esc(x.beeld) + '" alt="" loading="lazy"><span>' + esc(x.kort) + '</span></a>';
      }).join('') + '</div>' +
      '<div class="lade-label">Producten</div><ul>' + rest.map(ladeRij).join('') + '</ul>' +
      '<div class="lade-label">Gelegenheden</div><div class="lade-links">' + (window.LK_GELEGENHEDEN || []).map(function (g) { return '<a href="' + (g.naar || '/gelegenheid/' + g.slug) + '">' + esc(g.naam) + '</a>'; }).concat((window.LK_COLLECTIES || []).map(function (c) { return '<a href="/collectie/' + c.slug + '"><strong>' + esc(c.naam) + '</strong></a>'; })).join('') + '</div>' +
      (chr ? '<div class="lade-label">Christelijke cadeaus</div><ul>' + ladeRij(chr) + '</ul>' : '') +
      '<div class="lade-extra"><a href="/vonk">VONK cadeauzoeker</a><a href="/winkels">Onze winkels</a><a href="/favorieten">Mijn verlanglijstje</a><a href="/zoek">Zoeken</a><a href="/gids">Cadeaugidsen</a><a href="/info/hoe-werkt-het">Hoe werkt het?</a></div>';
  }
  function bouwMega() {
    $('[data-megamenu]').innerHTML = '<div class="binnen">' + CATS.filter(function (c) { return c.slug !== 'christelijk'; }).map(function (c) {
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
    var wurl = INST.daisyconPauze && isDaisycon(w.url) ? WINKELSITE[w.naam] : w.url;
    return '<a class="winkelkaart" href="' + esc(wurl) + '" target="_blank" rel="sponsored noopener">' + winkelFotos(w) +
      '<strong>' + esc(w.naam) + '</strong><span>' + esc(w.tekst) + '</span><em>Naar ' + esc(w.naam) + ' ' + ic('pijl') + '</em></a>';
  }
  function winkelsMet(slug) {
    return (window.LK_WINKELS || []).filter(function (w) { return w.url && (!slug || w.cats.indexOf(slug) !== -1) && (!INST.daisyconPauze || !isDaisycon(w.url) || WINKELSITE[w.naam]); });
  }
  function winkels() {
    zetTitel('Onze winkels');
    return paginakop({ titel: 'Onze winkels', tekst: 'Bij deze winkels vind je onze producten. Klik door en kijk rustig rond in hun hele aanbod.', kruimel: [{ tekst: 'Winkels' }] }) +
      '<div class="binnen"><section class="sectie"><div class="winkelraster">' + winkelsMet().map(winkelKaart).join('') + '</div>' +
      '<p class="vonk-noot" style="margin-top:18px">Koop je iets via deze links, dan krijgen wij soms een kleine vergoeding. Jij betaalt niets extra.</p></section></div>';
  }
  var laatstGetoond = null;
  /* Onthoud per pagina hoe ver je gescrold had en hoeveel producten je al open had geklapt ('Toon meer').
     Ga je vanaf een product met de terugknop terug naar de lijst, dan kom je weer op dezelfde plek uit (fijn op mobiel). */
  var plekken = {}, terugViaKnop = false, naarWerkbalk = false;
  try { if ('scrollRestoration' in history) history.scrollRestoration = 'manual'; } catch (e) {}
  function onthoudPlek() {
    if (laatstGetoond === null) return;
    var g = $('.prodgrid:not(.rij)', app);
    plekken[laatstGetoond] = { y: window.scrollY || 0, n: g ? g.querySelectorAll('.prodkaart:not(.later)').length : 0 };
  }
  function herstelPlek() {
    var plek = plekken[huidigAdres()];
    if (!plek) return false;
    var g = $('.prodgrid:not(.rij)', app);
    if (g && plek.n) {
      var later = g.querySelectorAll('.prodkaart.later'), alle = g.querySelectorAll('.prodkaart').length;
      for (var i = 0; i < later.length && (alle - later.length + i) < plek.n; i++) later[i].classList.remove('later');
      var knop = $('[data-meer]', app), over = g.querySelectorAll('.prodkaart.later').length;
      if (knop) { if (!over) knop.parentNode.remove(); else knop.innerHTML = 'Toon meer <small>(' + (alle - over) + ' van ' + alle + ')</small>'; }
    }
    window.scrollTo(0, plek.y);
    return true;
  }
  function toon() {
    onthoudPlek();
    laatstGetoond = huidigAdres();
    var a = leesAdres(), d = a.delen, html;
    /* 2.0: oude persoonspagina's (/c/cadeaus/voor-hem …) gaan door naar /voor/… */
    if (d[0] === 'c' && d[1] === 'cadeaus' && d[2]) {
      var oudNaarNieuw = window.LK_PERSONEN.filter(function (x) { return x.oud === 'cadeaus/' + d[2]; })[0];
      if (oudNaarNieuw) { ga('/voor/' + oudNaarNieuw.slug + (a.q.prijs ? '?prijs=' + a.q.prijs : ''), true); return; }
    }
    if (!d.length) html = home();
    else if (d[0] === 'categorieen') html = alleCategorieen();
    else if (d[0] === 'c') html = categorie(d[1], d[2], a.q);
    else if (d[0] === 'voor') html = d[1] ? persoon(d[1], d[2], a.q) : voorWie();
    else if (d[0] === 'gelegenheid') html = gelegenheidPagina(d[1], a.q);
    else if (d[0] === 'collectie') html = collectie(d[1], a.q);
    else if (d[0] === 'p') html = product(d[1]);
    else if (d[0] === 'zoek') html = zoeken(a.q);
    else if (d[0] === 'vonk') html = vonk(a.q);
    else if (d[0] === 'favorieten') html = favorieten();
    else if (d[0] === 'lijst') html = gedeeldeLijst(a.q);
    else if (d[0] === 'info') html = info(d[1]);
    else if (d[0] === 'gids') html = gids(d[1]);
    else if (d[0] === 'winkels') html = winkels();
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
      var groot = !aw.getAttribute('data-sleutel') && window.matchMedia && window.matchMedia('(max-width: 759px)').matches && !AW.laden['assets/zoek/winkels.json'];
      if (groot) {
        $('.aw-inhoud', aw).innerHTML = '<div class="aw-laadknop"><button class="knop knop-rand" type="button" data-aw-laad>Zoek ook in onze winkels ' + ic('pijl') + '</button>' +
          '<p class="uitleg">Doorzoekt ruim 40.000 producten van onze partnerwinkels. Dat is een groot bestand, dus het laden duurt even.</p></div>';
        aw.addEventListener('click', function (e) { if (e.target.closest('[data-aw-laad]')) { $('.aw-inhoud', aw).innerHTML = '<p class="aw-laden">Even zoeken in alle winkels…</p>'; vulAlleWinkels(aw); } });
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

    var fk = $('[data-filter-open]', app), wb = $('.werkbalk', app);
    /* Na kiezen in het filterpaneel: terug naar het begin van de lijst, zodat je de nieuwe resultaten ziet. */
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
        /* subcategorie gekozen binnen dezelfde categorie: meteen naar het eerste product */
        var kop = $('.header') || $('header');
        var hoogte = kop ? kop.getBoundingClientRect().height : 70;
        var doelY = grid.getBoundingClientRect().top + window.scrollY - hoogte - 12;
        var rustig = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        window.scrollTo({ top: Math.max(0, doelY), behavior: rustig ? 'auto' : 'smooth' });
      } else window.scrollTo(0, 0);
      if (vorigPad !== null) app.focus({ preventScroll: true });
    }
    vorigPad = a.pad;
    if (typeof bewaakHome === 'function') bewaakHome();
    try { window.dispatchEvent(new Event('lk-route')); } catch (e) {}
  }

  /* ================== BEZOEKERSTELLER ================== */
  /* GoatCounter telt de eerste pagina zelf bij het laden. Klik je daarna binnen de site door (zonder herladen),
     dan geven we elke nieuwe pagina hier door. Zonder cookies; alleen het adres en de titel van de pagina. */
  (function () {
    var eerste = true;
    window.addEventListener('lk-route', function () {
      if (eerste) { eerste = false; return; }
      try { if (window.goatcounter && window.goatcounter.count) window.goatcounter.count({ path: location.pathname + location.search, title: document.title }); } catch (e) {}
    });
    /* Klik naar een winkel ('Bekijk bij bol', winkeltegel, product uit 'Meer in onze winkels'): als 'gebeurtenis' tellen,
       zodat het Control Room laat zien welke producten mensen bij welke winkel bekijken. Geen cookies, geen persoonsgegevens. */
    document.addEventListener('click', function (e) {
      var a = e.target.closest('a[rel~="sponsored"]'); if (!a || !window.goatcounter || !window.goatcounter.count) return;
      var pad = '', titel = '';
      var kaart = a.closest('.product-info, .product-plak');
      if (kaart) { var id = (location.pathname.match(/\/p\/([^\/]+)/) || [])[1] || ''; var p = id && LK.vind(id); if (p) { pad = 'klik/' + p.shop + '/' + p.id; titel = p.shop + ': ' + p.titel; } }
      else if (a.classList.contains('winkelkaart')) { pad = 'klik/winkel/' + (a.querySelector('strong') || {}).textContent; titel = 'Winkeltegel: ' + (a.querySelector('strong') || {}).textContent; }
      else if (a.closest('.awkaart')) { var k = a.closest('.awkaart'); pad = 'klik/feed/' + (k.querySelector('.shop') || {}).textContent; titel = 'Uit alle winkels: ' + (k.querySelector('h3') || {}).textContent; }
      else if (a.closest('.aw-bol')) { pad = 'klik/feed/bol-zoeken'; titel = 'Zoek ook op bol'; }
      if (pad) try { window.goatcounter.count({ path: pad, title: titel.slice(0, 120), event: true }); } catch (x) {}
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
    if (t.hasAttribute('data-lijst-whatsapp')) { var w = lijstVanDeel(); window.open('https://wa.me/?text=' + encodeURIComponent(w.bericht), '_blank', 'noopener'); return; }
    if (t.hasAttribute('data-lijst-kopieer')) { var w2 = lijstVanDeel();
      var klaar = function () { toast('Link gekopieerd. Plak hem in een bericht.'); };
      if (navigator.clipboard) navigator.clipboard.writeText(w2.bericht).then(klaar, function () { prompt('Kopieer deze link:', w2.link); }); else prompt('Kopieer deze link:', w2.link);
      return; }
    if (t.closest('[data-filterpaneel]') && t.tagName === 'A') naarWerkbalk = true;
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
    if (t.hasAttribute('data-meer')) {
      var g = t.parentNode.previousElementSibling;
      var rest = g.querySelectorAll('.prodkaart.later');
      for (var i = 0; i < Math.min(PER_KEER, rest.length); i++) rest[i].classList.remove('later');
      var over = g.querySelectorAll('.prodkaart.later').length;
      if (!over) t.parentNode.remove();
      else t.innerHTML = 'Toon meer <small>(' + (g.querySelectorAll('.prodkaart').length - over) + ' van ' + g.querySelectorAll('.prodkaart').length + ')</small>';
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
    var html = lijst.slice(0, 6).map(function (p) {
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
    var f = e.target.closest('[data-zoek]');
    if (!f) return;
    e.preventDefault();
    var q = f.querySelector('input').value.trim();
    var huidig = leesAdres();
    var nq = { q: q, prijs: huidig.delen[0] === 'zoek' ? huidig.q.prijs : '' };
    sluitTips(f);
    ga(maakAdres('/zoek', nq));
    f.querySelector('input').blur();
  });
  document.addEventListener('change', function (e) {
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
  window.LK.ga = ga;
  vulIconen(document);
  bouwLade(); bouwMega();
  var zoekRij = $('[data-zoekrij] .binnen');
  if (zoekRij) zoekRij.innerHTML = zoekForm('', 'Zoek een cadeau, bijv. bal, fiets of trein');
  vulIconen($('[data-lade]').parentNode); vulIconen($('[data-megamenu]'));
  netteLinks(document);
  werkTellersBij();
  toon();
})();
