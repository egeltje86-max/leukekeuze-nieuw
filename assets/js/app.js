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
    CATS = ALLECATS.filter(function (c) { return !c.onder; }), PRIJZEN = window.LK_PRIJZEN, INST = window.LK_INSTELLINGEN;
  var ic = LK.icoon, esc = LK.esc;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var app = $('#app');
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
    var top = lijst.filter(function (p) { return p.favoriet || p.populair; });
    var rest = lijst.filter(function (p) { return !(p.favoriet || p.populair); });
    var GRENZEN = [15, 30, 60, 120, Infinity], bakken = GRENZEN.map(function () { return []; });
    rest.forEach(function (p) {
      var i = 0; while (typeof p.prijs === 'number' && p.prijs >= GRENZEN[i]) i++;
      if (typeof p.prijs !== 'number') i = 2;
      p._mix = mixGetal(p.id + '|' + week) - (LK.isNieuw(p) ? 0.25 : 0) - (p.beeld ? 0 : -0.5);
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
    top.sort(function (a, b) { return ((b.favoriet ? 2 : 0) + (b.populair ? 1 : 0)) - ((a.favoriet ? 2 : 0) + (a.populair ? 1 : 0)); });
    return top.concat(uit);
  }
  function grid(lijst, leegHtml, klasse) {
    if (!lijst.length) return '<div class="prodgrid ' + (klasse || '') + '">' + leegHtml + '</div>';
    return '<div class="prodgrid ' + (klasse || '') + '">' + lijst.map(LK.productKaart).join('') + '</div>';
  }
  /* Lange lijsten: eerst PER_KEER producten, daarna een 'Toon meer'-knop. */
  var PER_KEER = 24;
  function gridMeer(lijst, leegHtml, n) {
    var PER_KEER = n || 24;
    if (lijst.length <= PER_KEER) return grid(lijst, leegHtml);
    return '<div class="prodgrid">' + lijst.map(function (p, i) {
      var h = LK.productKaart(p);
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
  function zoekForm(waarde) {
    return '<form class="zoek" role="search" data-zoek>' +
      ic('zoek', 'lp') +
      '<label class="verborgen" for="zk-' + (zoekForm.n = (zoekForm.n || 0) + 1) + '">Zoek een cadeau</label>' +
      '<input id="zk-' + zoekForm.n + '" type="search" name="q" value="' + esc(waarde || '') + '" placeholder="Zoek in alle winkels…" autocomplete="off" enterkeyhint="search">' +
      '<button type="submit" aria-label="Zoeken">' + ic('zoek') + '</button></form>';
  }
  function zetTitel(t) { document.title = t ? t + ' | LeukeKeuze' : 'LeukeKeuze – de mooiste cadeaus voor elk moment'; }

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
        /* 1. Alle categorieën als ronde knoppen om naar links en rechts te schuiven (wens van Marius). */
        '<section class="sectie eerste">' +
          '<div class="sectie-kop"><div><h2>Shop per categorie</h2></div></div>' +
          '<div class="catrij-wrap">' +
            '<button class="catrij-pijl links" type="button" data-catrij="-1" aria-label="Naar links">' + ic('links') + '</button>' +
            '<div class="subkaarten catrij">' + CATS.map(function (c) {
              return '<a class="subkaart" href="/c/' + c.slug + '"><span class="rond"><img src="' + esc(c.tegel.replace('.webp', '-klein.webp')) + '" alt="" loading="lazy" decoding="async"></span>' + esc(c.kort) + '</a>';
            }).join('') + '</div>' +
            '<button class="catrij-pijl rechts" type="button" data-catrij="1" aria-label="Naar rechts">' + ic('rechts') + '</button>' +
          '</div>' +
        '</section>' +

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

        /* 3. Acties van dit seizoen */
        actieBlokken() +

        /* 3b. Eigen producten van LeukeKeuze (kleurboeken van Marius) */
        eigenBlok() +

        /* 6. Uitgelicht, ook als rij */
        '<section class="sectie">' +
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
      l = mix;
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
    if (o.banner) achter = '<div class="achter"><img src="' + esc(o.banner) + '" alt=""></div>';
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
    zetTitel(s ? s.naam + ' – ' + c.naam : c.naam);

    var pad = '/c/' + c.slug + (s ? '/' + s.slug : '');
    var lijst = LK.zichtbaar().filter(function (p) { return LK.hoortBij(p, c.slug, s && s.slug) && binnenPrijs(p, q.prijs); });
    lijst = sorteer(lijst, q.sort);

    var subs = '<div class="subkaarten">' +
      '<a class="subkaart' + (s ? '' : ' actief') + '" href="/c/' + c.slug + '"><span class="rond">' + catBeeld(c, true) + '</span>Alles</a>' +
      volleSubs(c).map(function (x) {
        var beeld = x.beeld ? '<img src="' + esc(x.beeld) + '" alt="" loading="lazy" decoding="async">' : ic(c.icoon);
        return '<a class="subkaart' + (s && s.slug === x.slug ? ' actief' : '') + '" href="' + subAdres(c, x) + '"' + (s && s.slug === x.slug ? ' aria-current="page"' : '') + '>' +
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
      titel: s ? s.naam : c.naam,
      tekst: s ? (s.tekst || 'Met de hand gekozen ' + s.naam.toLowerCase() + ' uit ' + c.naam.toLowerCase() + '.') : c.tekst,
      banner: c.banner, vaag: !c.banner ? c.tegel : '',
      kruimel: (ouder ? [{ tekst: ouder.naam, naar: '/c/' + ouder.slug }] : []).concat(s ? [{ tekst: c.naam, naar: '/c/' + c.slug }, { tekst: s.naam }] : [{ tekst: c.naam }])
    }) +
    '<div class="binnen">' +
      '<section class="sectie" aria-label="Subcategorieën">' + subs + '</section>' +
      werkbalk + gridMeer(lijst, leeg) +
      winkelSectie(c.slug, s && s.slug, q.prijs) +
      (s || !winkelsMet(c.slug).length ? '' : '<section class="sectie"><div class="sectie-kop"><div><h2>Ook leuk om rond te kijken</h2></div><a href="/winkels">Alle winkels</a></div><div class="winkelraster">' + winkelsMet(c.slug).map(winkelKaart).join('') + '</div></section>') +
      '<section class="sectie"><div class="sectie-kop"><div><h2>Andere categorieën</h2></div></div>' +
        '<nav class="catknoppen andere-cats">' + anderen.map(function (x) {
          return '<a class="catknop" href="/c/' + x.slug + '">' + ic(x.icoon) + '<span>' + esc(x.kort) + '</span></a>';
        }).join('') + '</nav></section>' +
    '</div>';
  }

  /* ---------- Product ---------- */
  /* Productfoto's: één foto, of een rij om doorheen te bladeren (pijltjes, puntjes, vegen). */
  function productFotos(p) {
    var klasse = 'product-beeld' + (p.voorbeeld || !p.beeld ? '' : ' echt');
    var extra = (p.fotos || []).filter(Boolean);
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
    zetTitel(p.titel);
    var fav = LK.isFavoriet(p.id);
    var knop = (p.url && !p.voorbeeld)
      ? '<a class="knop knop-goud" href="' + esc(p.url) + '" target="_blank" rel="sponsored nofollow noopener">Bekijk bij ' + esc(p.shop) + ' ' + ic('pijl') + '</a>'
      : '<span class="knop knop-goud uit" aria-disabled="true">Voorbeeld – nog geen winkellink</span>';

    var ookIn = (p.ookIn || []).map(function (x) {
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
          '<div class="product-acties">' + knop +
            '<button class="hartknop" type="button" data-fav="' + esc(p.id) + '" aria-pressed="' + fav + '" aria-label="' + (fav ? 'Verwijder uit favorieten' : 'Bewaar als favoriet') + '">' + ic('hart') + '</button>' +
          '</div>' +
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
  var SYN = { haar: 'vrouw vrouwen dames moeder mama vriendin zus', hem: 'man mannen heren vader papa vriend broer', kind: 'kinderen jongen meisje jongens meisjes',
    'opa-oma': 'opa oma grootouders', kerst: 'kerstmis kerstcadeau', sinterklaas: 'sint pakjesavond schoencadeau schoencadeautje surprise', verjaardag: 'jarig', zomaar: 'bedankje' };
  var SUBSYN = { 'mode-beauty/geuren': 'parfum geur' };
  function zoekTekst(p) {
    var c = window.LK_CAT(p.cat), s = window.LK_SUB(c, p.sub);
    var extra = (p.ookIn || []).map(function (x) { var d = x.split('/'); var cc = window.LK_CAT(d[0]); var ss = window.LK_SUB(cc, d[1]); return ss ? ss.naam : ''; });
    var syn = (p.voor || []).concat(p.moment || []).map(function (x) { return SYN[x] || ''; });
    return [p.titel, p.waarom, p.shop, c && c.naam, s && s.naam, extra.join(' '), (p.voor || []).join(' '), (p.moment || []).join(' '), syn.join(' '), SUBSYN[p.cat + '/' + p.sub] || ''].join(' ').toLowerCase();
  }
  /* Verkleinwoorden en meervoud terugbrengen: 'loopfietsje' zoekt ook 'loopfiets', 'fietsjes' ook 'fiets'. */
  function stam(w) { var k = w.replace(/(tjes|tje|jes|je|'s|s)$/, ''); return k.length >= 4 ? k : w; }
  function zoeken(q) {
    var woorden = (q.q || '').toLowerCase().split(/\s+/).filter(Boolean).map(stam);
    var lijst = LK.zichtbaar().filter(function (p) {
      if (!binnenPrijs(p, q.prijs)) return false;
      var t = zoekTekst(p);
      return woorden.every(function (w) { return t.indexOf(w) !== -1; });
    });
    /* Relevantie: een treffer in de titel telt het zwaarst, dan de categorie, en pas daarna de uitlegtekst.
       Zo komt bij 'fiets' eerst de fietstas en pas later de drop met 'fietsjes' in de tekst (wens van Marius). */
    var score = function (p) {
      var ti = ' ' + p.titel.toLowerCase().replace(/[^a-z0-9à-ÿ]+/g, ' ');
      var c = window.LK_CAT(p.cat), su = window.LK_SUB(c, p.sub);
      var ca = ((c ? c.naam : '') + ' ' + (su ? su.naam : '')).toLowerCase();
      return woorden.reduce(function (s, w) {
        if (ti.indexOf(' ' + w) !== -1) return s + 10;
        if (ti.indexOf(w) !== -1) return s + 6;
        if (ca.indexOf(w) !== -1) return s + 4;
        return s + 1;
      }, 0);
    };
    if (woorden.length && (!q.sort || q.sort === 'aanbevolen' || q.sort === 'relevant')) {
      var sc = {}; lijst.forEach(function (p) { sc[p.id] = score(p); });
      var niveaus = {}; lijst.forEach(function (p) { (niveaus[sc[p.id]] = niveaus[sc[p.id]] || []).push(p); });
      lijst = Object.keys(niveaus).map(Number).sort(function (a, b) { return b - a; }).reduce(function (u, n) { return u.concat(sorteer(niveaus[n], q.sort)); }, []);
    } else lijst = sorteer(lijst, q.sort);
    var pf = prijsFilter(q.prijs);
    var titel = q.q ? 'Resultaten voor “' + q.q + '”' : (q.prijs && q.prijs !== 'alle' ? 'Cadeaus ' + pf.label.toLowerCase().replace('€50+', 'vanaf €50') : 'Alle cadeaus');
    zetTitel(q.q ? 'Zoeken: ' + q.q : titel);
    return paginakop({ titel: titel, kruimel: [{ tekst: 'Zoeken' }] }) +
      '<div class="binnen">' +
        '<div style="margin-top:18px">' + zoekForm(q.q) + '</div>' +
        '<div class="werkbalk">' + prijsChips('/zoek', q) + '<span class="aantal">' + lijst.length + (lijst.length === 1 ? ' product' : ' producten') + '</span></div>' +
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
      return j.producten.map(function (x) { var w = W[x[2]]; x[2] = w.naam; x[3] = w.link + x[3]; x[4] = w.foto + x[4]; return { t: x[0], p: x[1], w: x[2], l: x[3], f: x[4], z: ' ' + (x[0] + ' ' + x[5] + ' ' + x[6] + ' ' + x[2]).toLowerCase().replace(/[^a-z0-9à-ÿ€]+/g, ' '), tl: ' ' + x[0].toLowerCase().replace(/[^a-z0-9à-ÿ€]+/g, ' '), g: x[7] || '' }; });
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
            '<a class="beeld echt" href="' + esc(x.l) + '" target="_blank" rel="sponsored nofollow noopener"><img src="' + esc(x.f) + '" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer"></a>' +
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
      var precies = alle.filter(function (p) { return past(p.voor, q.voor) && past(p.moment, q.moment) && binnenPrijs(p, q.budget); });
      precies.sort(function (a, b) { return echt(a) - echt(b); });
      var bijna = alle.filter(function (p) {
        if (precies.indexOf(p) !== -1) return false;
        var score = (past(p.voor, q.voor) ? 1 : 0) + (past(p.moment, q.moment) ? 1 : 0) + (binnenPrijs(p, q.budget) ? 1 : 0);
        return score === 2 && past(p.voor, q.voor);
      });
      /* Eerst wat echt voor deze persoon is gekozen, daarna wat voor iedereen leuk is. Alles tonen, met 'Toon meer'. */
      var gevonden = precies.length ? precies : bijna;
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
      var alles = q.voor === 'iedereen' ? spreid(sorteer(gevonden)) :
        spreid(sorteer(gevonden.filter(function (p) { return echt(p) === 0; }))).concat(spreid(sorteer(gevonden.filter(function (p) { return echt(p) !== 0; }))));
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

  /* ---------- Favorieten ---------- */
  function favorieten() {
    zetTitel('Favorieten');
    var ids = LK.favorieten();
    var lijst = LK.zichtbaar().filter(function (p) { return ids.indexOf(p.id) !== -1; });
    return paginakop({ titel: 'Jouw favorieten', tekst: 'Bewaard met het hartje. Ze staan alleen op dit apparaat, je hebt geen account nodig.', kruimel: [{ tekst: 'Favorieten' }] }) +
      '<div class="binnen"><section class="sectie">' +
      grid(lijst, leegBlok('Nog geen favorieten', 'Tik op het hartje bij een product om het hier te bewaren.', '<a class="knop knop-goud" href="/c/cadeaus">Bekijk cadeaus</a>')) +
      '</section></div>';
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
      '<p>LeukeKeuze helpt je snel een mooi cadeau te vinden, zonder eindeloos zoeken. We kiezen liever een paar goede dingen dan duizend middelmatige.</p>' +
      '<p>Iets moois gevonden of een tip voor ons? We horen het graag via de <a href="/info/contact">contactpagina</a>.</p>' + CONCEPT],
    'contact': ['Contact',
      '<p>Vragen over een bestelling? Neem dan contact op met de winkel waar je het product hebt gekocht. Die regelt bezorging en retour.</p>' +
      '<p>Vragen of tips voor LeukeKeuze zelf? Mail ons op: <a href="mailto:leukekeuze.nl@gmail.com">leukekeuze.nl@gmail.com</a></p>' +
      '<p>Wie de site maakt en het adres vind je in het <a href="/info/colofon">colofon</a>.</p>' + CONCEPT],
    'colofon': ['Colofon',
      '<p>Deze website wordt gemaakt en beheerd door:</p>' +
      '<p><strong>LeukeKeuze</strong><br>Marius Kestens<br>Kromhout 108<br>3311 RH Dordrecht<br>Nederland</p>' +
      '<p>E-mail: <a href="mailto:leukekeuze.nl@gmail.com">leukekeuze.nl@gmail.com</a><br>Website: leukekeuze.nl</p>' +
      '<p>LeukeKeuze is (nog) niet ingeschreven bij de Kamer van Koophandel.</p>' +
      '<h2>Wat is LeukeKeuze?</h2><p>LeukeKeuze is een cadeausite. Wij verkopen zelf niets, maar raden producten aan van andere winkels. Sommige links zijn partnerlinks: koop je via zo’n link, dan krijgen wij soms een kleine vergoeding van de winkel. Jij betaalt daardoor niets extra.</p>' +
      '<p>Zie ook: <a href="/info/privacy">Privacy &amp; cookies</a>, <a href="/info/voorwaarden">Algemene voorwaarden</a> en <a href="/info/disclaimer">Disclaimer</a>.</p>'],
    'privacy': ['Privacyverklaring',
      '<p>Laatst bijgewerkt: 23 oktober 2026.</p>' +
      '<p>LeukeKeuze (Marius Kestens, zie het <a href="/info/colofon">colofon</a>) is verantwoordelijk voor deze website. In deze verklaring lees je welke gegevens er gebruikt worden als je de site bezoekt.</p>' +
      '<h2>Geen account, geen formulieren</h2><p>Je hoeft je nergens aan te melden. Wij vragen niet om je naam, e-mail of andere persoonlijke gegevens.</p>' +
      '<h2>Wat blijft er op je eigen apparaat?</h2><p>Bewaar je een product met het hartje, dan wordt dat alleen op je eigen apparaat opgeslagen (in de lokale opslag van je browser). Wij kunnen dat niet zien. Wis je je browsergegevens, dan is het weg. Deze site plaatst zelf geen tracking- of advertentiecookies.</p>' +
      '<h2>Hosting</h2><p>De website staat bij GitHub Pages (GitHub, Inc.). Bij elk bezoek ziet de server technische gegevens, zoals je IP-adres. GitHub gebruikt die om de site veilig en werkend te houden. Wij krijgen deze gegevens niet.</p>' +
      '<h2>Lettertypes</h2><p>De lettertypes worden geladen via Google Fonts. Daarbij ziet Google je IP-adres. We zijn van plan de lettertypes op onze eigen site te zetten.</p>' +
      '<h2>Partnerlinks en cookies van winkels</h2><p>Klik je op “Bekijk bij …”, dan ga je naar de winkel. Vaak loopt die link via een partnernetwerk, zoals Daisycon, het bol partnerprogramma of het partnerprogramma van Amazon. Zij plaatsen dan een cookie om te zien dat je via LeukeKeuze kwam. Zo kan de winkel ons een kleine vergoeding geven als je iets koopt. Wij zien niet wie je bent of wat je koopt; alleen hoeveel er via onze links is verkocht. Op de site van de winkel gelden hun eigen privacyverklaring en cookies.</p>' +
      '<h2>Je rechten</h2><p>Omdat wij zelf geen persoonsgegevens van je bewaren, is er meestal niets om in te zien of te wissen. Heb je toch een vraag over privacy? Mail naar <a href="mailto:leukekeuze.nl@gmail.com">leukekeuze.nl@gmail.com</a>. Je mag ook een klacht indienen bij de Autoriteit Persoonsgegevens.</p>'],
    'voorwaarden': ['Algemene voorwaarden',
      '<p>Laatst bijgewerkt: 23 oktober 2026.</p>' +
      '<p>Deze voorwaarden gelden voor het gebruik van leukekeuze.nl, een website van LeukeKeuze (Marius Kestens, zie het <a href="/info/colofon">colofon</a>).</p>' +
      '<h2>1. Wat LeukeKeuze doet</h2><p>LeukeKeuze is een cadeausite met tips en links naar producten van andere winkels. Wij verkopen zelf niets. Je sluit dus geen koop af met LeukeKeuze.</p>' +
      '<h2>2. Kopen doe je bij de winkel</h2><p>Bestel je iets via een link, dan koop je bij die winkel. Hun voorwaarden gelden voor bestelling, betaling, bezorging, garantie en retour. Met vragen daarover ga je naar de winkel.</p>' +
      '<h2>3. Prijzen en informatie</h2><p>We doen ons best om prijzen, foto’s en beschrijvingen juist te houden. Maar winkels passen prijzen en voorraad soms aan. De informatie op de site van de winkel is altijd leidend. Aan fouten op LeukeKeuze kun je geen rechten ontlenen.</p>' +
      '<h2>4. Partnerlinks</h2><p>Veel links zijn partnerlinks. Koop je via zo’n link, dan krijgen wij soms een kleine vergoeding van de winkel. Dat kost jou niets extra en verandert niets aan de prijs.</p>' +
      '<h2>5. Aansprakelijkheid</h2><p>LeukeKeuze is niet aansprakelijk voor producten, diensten of websites van andere winkels, en ook niet voor schade door het gebruik van deze site, behalve als de wet dat anders bepaalt.</p>' +
      '<h2>6. Teksten en foto’s</h2><p>De teksten op LeukeKeuze zijn van ons. Productfoto’s komen van de winkels en merken. Neem niets over zonder toestemming.</p>' +
      '<h2>7. Wijzigingen</h2><p>We kunnen deze voorwaarden aanpassen. De nieuwste versie staat altijd op deze pagina.</p>' +
      '<h2>8. Recht</h2><p>Op deze voorwaarden is Nederlands recht van toepassing. Vragen? Mail naar <a href="mailto:leukekeuze.nl@gmail.com">leukekeuze.nl@gmail.com</a>.</p>'],
    'disclaimer': ['Disclaimer',
      '<p>LeukeKeuze verkoopt zelf niets. We verwijzen naar producten van andere winkels.</p>' +
      '<p>We doen ons best om prijzen en informatie juist te houden, maar prijzen en voorraad kunnen veranderen. De informatie bij de winkel is altijd leidend.</p>' +
      '<p>Sommige links zijn partnerlinks: koop je via zo’n link, dan krijgen wij soms een kleine vergoeding. Dat heeft geen invloed op de prijs die jij betaalt.</p>' +
      '<p>Als Amazon-partner verdienen wij aan kwalificerende aankopen.</p>' + CONCEPT]
  };
  function info(slug) {
    var i = INFO[slug];
    if (!i) return nietGevonden();
    zetTitel(i[0]);
    return paginakop({ titel: i[0], kruimel: [{ tekst: i[0] }] }) + '<div class="binnen"><article class="tekstpagina">' + i[1] + '</article></div>';
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
      return s.slug === 'onder-15' || z.some(function (p) { return LK.hoortBij(p, c.slug, s.slug); });
    });
  }

  /* ================== MENU'S ================== */
  function bouwLade() {
    var uit = CATS.filter(function (c) { return c.uitgelicht; })[0];
    var rest = CATS.filter(function (c) { return !c.uitgelicht; });
    $('[data-lade]').innerHTML =
      (uit ? '<a class="lade-uitgelicht" href="/c/' + uit.slug + '"><span class="rond">' + ic(uit.icoon) + '</span><span><strong>' + esc(uit.naam) + '</strong><small>' + esc(uit.tekst) + '</small></span></a>' : '') +
      '<div class="lade-label">Alle categorieën</div><ul>' +
      rest.map(function (c) {
        return '<li><button class="lade-rij" type="button" aria-expanded="false" aria-controls="ls-' + c.slug + '">' + ic(c.icoon, 'ic') + '<span>' + esc(c.naam) + '</span>' + ic('rechts', 'pijl') + '</button>' +
          '<div class="lade-subs" id="ls-' + c.slug + '"><a class="alles" href="/c/' + c.slug + '">Alles in ' + esc(c.naam) + '</a>' +
          volleSubs(c).map(function (s) { return '<a href="' + subAdres(c, s) + '">' + esc(s.naam) + '</a>'; }).join('') + '</div></li>';
      }).join('') + '</ul>' +
      '<div class="lade-extra"><a href="/vonk">VONK cadeauzoeker</a><a href="/winkels">Onze winkels</a><a href="/favorieten">Mijn favorieten</a><a href="/zoek">Zoeken</a><a href="/info/hoe-werkt-het">Hoe werkt het?</a></div>';
  }
  function bouwMega() {
    $('[data-megamenu]').innerHTML = '<div class="binnen">' + CATS.map(function (c) {
      return '<div><h3><a href="/c/' + c.slug + '">' + ic(c.icoon) + esc(c.naam) + '</a></h3><ul>' +
        volleSubs(c).slice(0, 6).map(function (s) { return '<li><a href="' + subAdres(c, s) + '">' + esc(s.naam) + '</a></li>'; }).join('') + '</ul></div>';
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
    return '<a class="winkelkaart" href="' + esc(w.url) + '" target="_blank" rel="sponsored noopener">' + winkelFotos(w) +
      '<strong>' + esc(w.naam) + '</strong><span>' + esc(w.tekst) + '</span><em>Naar ' + esc(w.naam) + ' ' + ic('pijl') + '</em></a>';
  }
  function winkelsMet(slug) {
    return (window.LK_WINKELS || []).filter(function (w) { return w.url && (!slug || w.cats.indexOf(slug) !== -1); });
  }
  function winkels() {
    zetTitel('Onze winkels');
    return paginakop({ titel: 'Onze winkels', tekst: 'Bij deze winkels vind je onze producten. Klik door en kijk rustig rond in hun hele aanbod.', kruimel: [{ tekst: 'Winkels' }] }) +
      '<div class="binnen"><section class="sectie"><div class="winkelraster">' + winkelsMet().map(winkelKaart).join('') + '</div>' +
      '<p class="vonk-noot" style="margin-top:18px">Koop je iets via deze links, dan krijgen wij soms een kleine vergoeding. Jij betaalt niets extra.</p></section></div>';
  }
  var laatstGetoond = null;
  function toon() {
    laatstGetoond = huidigAdres();
    var a = leesAdres(), d = a.delen, html;
    if (!d.length) html = home();
    else if (d[0] === 'categorieen') html = alleCategorieen();
    else if (d[0] === 'c') html = categorie(d[1], d[2], a.q);
    else if (d[0] === 'p') html = product(d[1]);
    else if (d[0] === 'zoek') html = zoeken(a.q);
    else if (d[0] === 'vonk') html = vonk(a.q);
    else if (d[0] === 'favorieten') html = favorieten();
    else if (d[0] === 'info') html = info(d[1]);
    else if (d[0] === 'winkels') html = winkels();
    else html = nietGevonden();

    // Onthoud waar de schuifbalk met subcategorieën stond (mobiel), zodat hij niet terugspringt.
    var oudeRij = $('.subkaarten', app), oudeScroll = oudeRij ? oudeRij.scrollLeft : 0;
    var zelfdeCat = d[0] === 'c' && vorigeCat === d[1];

    app.innerHTML = html;
    vulIconen(app); netteLinks(app);
    var aw = $('[data-alle-winkels]', app); if (aw) vulAlleWinkels(aw);

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

    // Alleen naar boven als je naar een andere pagina gaat (niet bij filteren)
    if (a.pad !== vorigPad) {
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
    if (huidigAdres() !== laatstGetoond) { toon(); return; }
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
        b.setAttribute('aria-label', aan ? 'Verwijder uit favorieten' : 'Bewaar als favoriet');
      });
      werkTellersBij();
      toast(aan ? 'Bewaard in je favorieten' : 'Verwijderd uit favorieten');
      if (leesAdres().delen[0] === 'favorieten') toon();
      return;
    }
    if (t.hasAttribute('data-open-lade')) { openLade(); return; }
    if (t.hasAttribute('data-sluit-lade')) { sluitLade(); return; }
    if (t.hasAttribute('data-mega')) {
      var open = !$('[data-megamenu]').classList.contains('open');
      $('[data-megamenu]').classList.toggle('open', open);
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

  document.addEventListener('submit', function (e) {
    var f = e.target.closest('[data-zoek]');
    if (!f) return;
    e.preventDefault();
    var q = f.querySelector('input').value.trim();
    var huidig = leesAdres();
    var nq = { q: q, prijs: huidig.delen[0] === 'zoek' ? huidig.q.prijs : '' };
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
  vulIconen($('[data-lade]').parentNode); vulIconen($('[data-megamenu]'));
  netteLinks(document);
  werkTellersBij();
  toon();
})();
