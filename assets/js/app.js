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
  var LK = window.LK, CATS = window.LK_CATEGORIEEN, PRIJZEN = window.LK_PRIJZEN, INST = window.LK_INSTELLINGEN;
  var ic = LK.icoon, esc = LK.esc;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var app = $('#app');
  var vorigPad = null;

  /* ---------- Hulpjes ---------- */
  function vulIconen(root) {
    $$('[data-ic]', root).forEach(function (el) {
      el.insertAdjacentHTML('afterbegin', ic(el.getAttribute('data-ic')));
      el.removeAttribute('data-ic');
    });
  }
  function leesAdres() {
    var h = location.hash.replace(/^#/, '') || '/';
    var d = h.split('?');
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
    return '#' + pad + (s ? '?' + s : '');
  }
  function prijsFilter(id) { return PRIJZEN.find(function (p) { return p.id === id; }) || PRIJZEN[0]; }
  function binnenPrijs(p, id) { var f = prijsFilter(id); return p.prijs >= f.min && p.prijs <= f.max; }
  function sorteer(lijst, hoe) {
    var l = lijst.slice();
    if (hoe === 'prijs-op') l.sort(function (a, b) { return a.prijs - b.prijs; });
    else if (hoe === 'prijs-af') l.sort(function (a, b) { return b.prijs - a.prijs; });
    else if (hoe === 'nieuw') l.sort(function (a, b) { return (b.nieuw ? 1 : 0) - (a.nieuw ? 1 : 0); });
    else l.sort(function (a, b) { return ((b.populair ? 2 : 0) + (b.beeld ? 1 : 0)) - ((a.populair ? 2 : 0) + (a.beeld ? 1 : 0)); });
    return l;
  }
  function grid(lijst, leegHtml, klasse) {
    if (!lijst.length) return '<div class="prodgrid ' + (klasse || '') + '">' + leegHtml + '</div>';
    return '<div class="prodgrid ' + (klasse || '') + '">' + lijst.map(LK.productKaart).join('') + '</div>';
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
    return '<nav class="kruimel" aria-label="Kruimelpad"><a href="#/">Home</a>' + stukken.map(function (s) {
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
      '<input id="zk-' + zoekForm.n + '" type="search" name="q" value="' + esc(waarde || '') + '" placeholder="Zoek iets leuks…" autocomplete="off" enterkeyhint="search">' +
      '<button type="submit" aria-label="Zoeken">' + ic('zoek') + '</button></form>';
  }
  function zetTitel(t) { document.title = t ? t + ' | LeukeKeuze' : 'LeukeKeuze – de mooiste cadeaus voor elk moment'; }

  /* ================== PAGINA'S ================== */

  /* ---------- Home ---------- */
  function home() {
    zetTitel('');
    var hoofd = ['cadeaus', 'christelijk', 'speelgoed', 'wonen', 'elektronica'].map(window.LK_CAT);
    return '' +
      '<section class="hero">' +
        '<picture><source media="(min-width: 760px)" srcset="' + esc(INST.heroDesktop) + '">' +
        '<img src="' + esc(INST.heroMobiel) + '" alt="" fetchpriority="high"></picture>' +
        '<div class="hero-inhoud"><div class="binnen">' +
          '<div class="kicker">' + esc(INST.heroKicker) + '</div>' +
          '<h1>' + esc(INST.heroTitel) + '<br><em>' + esc(INST.heroTitelGoud) + '</em></h1>' +
          '<p>' + esc(INST.heroTekst) + '</p>' +
          zoekForm('') +
          '<div class="populair"><span>Populair:</span><div class="chips">' +
            INST.populair.map(function (x) { return '<a class="chip" href="' + x.naar + '">' + esc(x.label) + '</a>'; }).join('') +
          '</div></div>' +
        '</div></div>' +
      '</section>' +

      '<div class="binnen">' +
        '<div class="budget"><span>Budget:</span>' + prijsChips('/zoek', {}) .replace(/aria-pressed="true"/, 'aria-pressed="false"') + '</div>' +

        '<a class="vonk-kaart" href="#/vonk">' +
          ic('vonk', 'staf') +
          '<div><h2>VONK</h2><p>Weet je niet wat je moet geven? Beantwoord 3 vragen en VONK laat passende cadeaus zien.</p></div>' +
          '<span class="rond-pijl">' + ic('rechts') + '</span>' +
          '<div class="vonk-rechts"><span class="knop knop-goud">Start VONK ' + ic('pijl') + '</span>' +
            '<div class="vonk-punten"><span>' + ic('cadeau') + 'Persoonlijk</span><span>' + ic('klok') + 'In 3 klikken</span><span>' + ic('ster') + 'Met de hand gekozen</span></div></div>' +
        '</a>' +

        '<nav class="catknoppen" aria-label="Categorieën">' +
          CATS.map(function (c, i) {
            return '<a class="catknop' + (i >= 5 ? ' desk' : '') + (i === 0 ? ' actief' : '') + '" href="#/c/' + c.slug + '">' + ic(c.icoon) + '<span>' + esc(c.kort) + '</span></a>';
          }).join('') +
          '<button class="catknop meer" type="button" data-open-lade>' + ic('raster') + '<span>Meer</span></button>' +
        '</nav>' +

        '<section class="sectie">' +
          '<div class="sectie-kop"><div><h2>Populaire categorieën</h2></div><a class="meer" href="#/categorieen">Bekijk alle ' + ic('pijl') + '</a></div>' +
          '<div class="catkaarten home-cats">' + hoofd.map(catKaart).join('') + '</div>' +
        '</section>' +

        '<section class="sectie">' +
          '<div class="sectie-kop"><div><h2>Uitgelichte cadeaus</h2></div><a class="meer" href="#/c/cadeaus">Bekijk alle cadeaus ' + ic('pijl') + '</a></div>' +
          '<div class="chips tabs" role="tablist" data-tabs>' +
            [['populair', 'Populair'], ['onder25', 'Cadeaus onder €25'], ['nieuw', 'Nieuw binnen'], ['haar', 'Voor haar'], ['hem', 'Voor hem']].map(function (t, i) {
              return '<button class="chip" type="button" role="tab" data-tab="' + t[0] + '" aria-pressed="' + (i === 0) + '">' + t[1] + '</button>';
            }).join('') +
          '</div>' +
          '<div data-uitgelicht>' + uitgelicht('populair') + '</div>' +
        '</section>' +

        '<section class="sectie">' +
          '<div class="sectie-kop"><div><h2>Zo werkt LeukeKeuze</h2></div></div>' +
          '<div class="stappen">' +
            '<div class="stap"><span class="nr">1</span><div><h3>Wij zoeken uit</h3><p>Elk product wordt eerst door ons bekeken. Alleen wat we echt goed vinden, komt op de site.</p></div></div>' +
            '<div class="stap"><span class="nr">2</span><div><h3>Jij kiest</h3><p>Zoek op categorie, budget of laat VONK helpen. Bewaar je favorieten met het hartje.</p></div></div>' +
            '<div class="stap"><span class="nr">3</span><div><h3>Je koopt bij de winkel</h3><p>Via de knop ga je naar de winkel. Daar bestel en betaal je zoals je gewend bent.</p></div></div>' +
          '</div>' +
        '</section>' +
      '</div>';
  }
  function catKaart(c) {
    return '<a class="catkaart" href="#/c/' + c.slug + '">' +
      '<div class="beeld">' + catBeeld(c, true) + '</div>' +
      '<div class="tekst"><h3>' + esc(c.naam) + '</h3><p>' + esc(c.tekst) + '</p><span class="rond-pijl">' + ic('rechts') + '</span></div></a>';
  }
  function nietChristelijk(p) { return p.cat !== 'christelijk'; }
  function uitgelicht(tab) {
    var l = LK.zichtbaar().filter(nietChristelijk);
    if (tab === 'populair') l = l.filter(function (p) { return p.populair; });
    if (tab === 'onder25') l = l.filter(function (p) { return p.prijs <= 25; });
    if (tab === 'nieuw') l = l.filter(function (p) { return p.nieuw; });
    if (tab === 'haar') l = l.filter(function (p) { return (p.voor || []).indexOf('haar') !== -1; });
    if (tab === 'hem') l = l.filter(function (p) { return (p.voor || []).indexOf('hem') !== -1; });
    return grid(sorteer(l).slice(0, 10), leegBlok('Nog niets in deze lijst', 'Hier komen binnenkort mooie producten.'), 'vijf');
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
      '<a class="subkaart' + (s ? '' : ' actief') + '" href="#/c/' + c.slug + '"><span class="rond">' + catBeeld(c, true) + '</span>Alles</a>' +
      volleSubs(c).map(function (x) {
        var beeld = x.beeld ? '<img src="' + esc(x.beeld) + '" alt="" loading="lazy" decoding="async">' : ic(c.icoon);
        return '<a class="subkaart' + (s && s.slug === x.slug ? ' actief' : '') + '" href="#/c/' + c.slug + '/' + x.slug + '"' + (s && s.slug === x.slug ? ' aria-current="page"' : '') + '>' +
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
      '<a class="knop knop-rand" href="#/c/cadeaus">Alle cadeaus</a> <a class="knop knop-goud" href="#/vonk">Probeer VONK</a>');

    var anderen = CATS.filter(function (x) { return x.slug !== c.slug; });

    return paginakop({
      titel: s ? s.naam : c.naam,
      tekst: s ? 'Met de hand gekozen ' + s.naam.toLowerCase() + ' uit ' + c.naam.toLowerCase() + '.' : c.tekst,
      banner: c.banner, vaag: !c.banner ? c.tegel : '',
      kruimel: s ? [{ tekst: c.naam, naar: '#/c/' + c.slug }, { tekst: s.naam }] : [{ tekst: c.naam }]
    }) +
    '<div class="binnen">' +
      '<section class="sectie" aria-label="Subcategorieën">' + subs + '</section>' +
      werkbalk + grid(lijst, leeg) +
      (s || !winkelsMet(c.slug).length ? '' : '<section class="sectie"><div class="sectie-kop"><div><h2>Ook leuk om rond te kijken</h2></div><a href="#/winkels">Alle winkels</a></div><div class="winkelraster">' + winkelsMet(c.slug).map(winkelKaart).join('') + '</div></section>') +
      '<section class="sectie"><div class="sectie-kop"><div><h2>Andere categorieën</h2></div></div>' +
        '<nav class="catknoppen" style="display:flex;overflow-x:auto;scrollbar-width:none">' + anderen.map(function (x) {
          return '<a class="catknop" style="flex:0 0 96px" href="#/c/' + x.slug + '">' + ic(x.icoon) + '<span>' + esc(x.kort) + '</span></a>';
        }).join('') + '</nav></section>' +
    '</div>';
  }

  /* ---------- Product ---------- */
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
      return cc && ss ? '<a href="#/c/' + cc.slug + '/' + ss.slug + '">' + esc(ss.naam) + '</a>' : '';
    }).filter(Boolean);

    var verwant = LK.zichtbaar().filter(function (x) {
      return x.id !== p.id && (p.cat === 'christelijk') === (x.cat === 'christelijk') && (x.cat === p.cat || (x.ookIn || []).some(function (o) { return (p.ookIn || []).indexOf(o) !== -1; }));
    });
    verwant = sorteer(verwant).slice(0, 4);

    return '<div class="binnen">' +
      '<div style="padding-top:16px">' + kruimel([{ tekst: c.naam, naar: '#/c/' + c.slug }, { tekst: s ? s.naam : '', naar: s ? '#/c/' + c.slug + '/' + s.slug : '' }].filter(function (x) { return x.tekst; })) + '</div>' +
      '<div class="product">' +
        '<div class="product-beeld' + (p.voorbeeld || !p.beeld ? '' : ' echt') + '">' + LK.productBeeld(p, true) + (p.voorbeeld ? '<span class="label">Voorbeeld</span>' : '') + '</div>' +
        '<div class="product-info">' +
          '<span class="shop">' + esc(p.shop) + '</span>' +
          '<h1>' + esc(p.titel) + '</h1>' +
          '<div class="prijs">' + LK.euro(p.prijs) + (p.oudePrijs > p.prijs ? ' <s class="oud">' + LK.euro(p.oudePrijs) + '</s>' : '') + '</div>' +
          '<p class="prijsnoot">Prijs zoals laatst bij ons bekend' + (p.gecontroleerd ? ' (gecontroleerd op ' + p.gecontroleerd.split('-').reverse().join('-') + ')' : '') + '. De actuele prijs zie je bij de winkel.</p>' +
          '<div class="product-acties">' + knop +
            '<button class="hartknop" type="button" data-fav="' + esc(p.id) + '" aria-pressed="' + fav + '" aria-label="' + (fav ? 'Verwijder uit favorieten' : 'Bewaar als favoriet') + '">' + ic('hart') + '</button>' +
          '</div>' +
          '<div class="waarom"><h2>' + ic('ster') + 'Waarom wij dit kozen</h2><p>' + esc(p.waarom || '') + '</p></div>' +
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
  function zoekTekst(p) {
    var c = window.LK_CAT(p.cat), s = window.LK_SUB(c, p.sub);
    var extra = (p.ookIn || []).map(function (x) { var d = x.split('/'); var cc = window.LK_CAT(d[0]); var ss = window.LK_SUB(cc, d[1]); return ss ? ss.naam : ''; });
    return [p.titel, p.waarom, p.shop, c && c.naam, s && s.naam, extra.join(' '), (p.voor || []).join(' '), (p.moment || []).join(' ')].join(' ').toLowerCase();
  }
  function zoeken(q) {
    var woorden = (q.q || '').toLowerCase().split(/\s+/).filter(Boolean);
    var lijst = LK.zichtbaar().filter(function (p) {
      if (!binnenPrijs(p, q.prijs)) return false;
      var t = zoekTekst(p);
      return woorden.every(function (w) { return t.indexOf(w) !== -1; });
    });
    lijst = sorteer(lijst, q.sort);
    var pf = prijsFilter(q.prijs);
    var titel = q.q ? 'Resultaten voor “' + q.q + '”' : (q.prijs && q.prijs !== 'alle' ? 'Cadeaus ' + pf.label.toLowerCase().replace('€50+', 'vanaf €50') : 'Alle cadeaus');
    zetTitel(q.q ? 'Zoeken: ' + q.q : titel);
    return paginakop({ titel: titel, kruimel: [{ tekst: 'Zoeken' }] }) +
      '<div class="binnen">' +
        '<div style="margin-top:18px">' + zoekForm(q.q) + '</div>' +
        '<div class="werkbalk">' + prijsChips('/zoek', q) + '<span class="aantal">' + lijst.length + (lijst.length === 1 ? ' product' : ' producten') + '</span></div>' +
        grid(lijst, leegBlok('Niets gevonden', 'Probeer een ander woord, een ander budget, of laat VONK zoeken.',
          '<a class="knop knop-goud" href="#/vonk">Probeer VONK</a>')) +
      '</div>';
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
    if (stap === 3) inhoud = vraag('Wat is je budget?', PRIJZEN.map(function (p) { return { id: p.id, label: p.id === 'alle' ? 'Maakt niet uit' : p.label }; }), 'budget');

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
      var label = function (lijst, id) { var x = lijst.find(function (o) { return o.id === id; }); return x ? x.label : id; };
      inhoud = '<div class="vonk-vraag"><h2>' + (precies.length ? 'Dit past bij jouw keuze' : 'Geen exacte match, wel deze') + '</h2>' +
        '<div class="vonk-samenvatting">' +
          '<span class="chip actief">Voor: ' + esc(label(V.voor, q.voor)) + '</span>' +
          '<span class="chip actief">' + esc(label(V.moment, q.moment)) + '</span>' +
          '<span class="chip actief">' + esc(q.budget === 'alle' ? 'Elk budget' : prijsFilter(q.budget).label) + '</span>' +
          '<a class="chip" href="#/vonk">Opnieuw</a>' +
        '</div></div>' +
        '<p class="vonk-noot" style="margin-top:14px">VONK kijkt naar de kenmerken die wij bij elk product invullen. Geen praatjes, gewoon passende producten.</p>' +
        grid(sorteer(precies.length ? precies : bijna).slice(0, 12),
          leegBlok('Nog niets gevonden', 'We vullen de site steeds verder aan. Probeer een ander budget of moment.', '<a class="knop knop-goud" href="#/vonk">Opnieuw</a>'));
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
      grid(lijst, leegBlok('Nog geen favorieten', 'Tik op het hartje bij een product om het hier te bewaren.', '<a class="knop knop-goud" href="#/c/cadeaus">Bekijk cadeaus</a>')) +
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
      '<p>Iets moois gevonden of een tip voor ons? We horen het graag via de <a href="#/info/contact">contactpagina</a>.</p>' + CONCEPT],
    'contact': ['Contact',
      '<p>Vragen over een bestelling? Neem dan contact op met de winkel waar je het product hebt gekocht. Die regelt bezorging en retour.</p>' +
      '<p>Vragen of tips voor LeukeKeuze zelf? Mail ons op: <a href="mailto:leukekeuze.nl@gmail.com">leukekeuze.nl@gmail.com</a></p>' + CONCEPT],
    'privacy': ['Privacy & cookies',
      '<p>LeukeKeuze heeft geen accounts en vraagt geen persoonlijke gegevens.</p>' +
      '<h2>Wat bewaren we op je apparaat?</h2><p>Je favorieten worden alleen op je eigen apparaat bewaard (in je browser). Wij kunnen die niet zien. Wis je je browsergegevens, dan zijn ze weg.</p>' +
      '<h2>Lettertypes</h2><p>De lettertypes van deze site worden nu nog geladen via Google Fonts. Daarbij ziet Google je IP-adres. We zijn van plan dit aan te passen.</p>' +
      '<h2>Doorklikken naar winkels</h2><p>Klik je door naar een winkel, dan gelden de regels en cookies van die winkel. Lees daarvoor hun privacyverklaring.</p>' + CONCEPT],
    'disclaimer': ['Disclaimer',
      '<p>LeukeKeuze verkoopt zelf niets. We verwijzen naar producten van andere winkels.</p>' +
      '<p>We doen ons best om prijzen en informatie juist te houden, maar prijzen en voorraad kunnen veranderen. De informatie bij de winkel is altijd leidend.</p>' +
      '<p>Sommige links zijn partnerlinks: koop je via zo’n link, dan krijgen wij soms een kleine vergoeding. Dat heeft geen invloed op de prijs die jij betaalt.</p>' + CONCEPT]
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
      '<div class="binnen"><section class="sectie">' + leegBlok('Even kwijt?', 'Ga terug naar de homepage of kies een categorie.', '<a class="knop knop-goud" href="#/">Naar home</a>') + '</section></div>';
  }

  /* Subcategorieën die echt iets bevatten. Lege subs (bv. 'Met naam') blijven verborgen tot er producten in staan. */
  function volleSubs(c) {
    var z = LK.zichtbaar();
    return c.subs.filter(function (s) {
      return s.slug === 'onder-10' || z.some(function (p) { return LK.hoortBij(p, c.slug, s.slug); });
    });
  }

  /* ================== MENU'S ================== */
  function bouwLade() {
    var uit = CATS.filter(function (c) { return c.uitgelicht; })[0];
    var rest = CATS.filter(function (c) { return !c.uitgelicht; });
    $('[data-lade]').innerHTML =
      (uit ? '<a class="lade-uitgelicht" href="#/c/' + uit.slug + '"><span class="rond">' + ic(uit.icoon) + '</span><span><strong>' + esc(uit.naam) + '</strong><small>' + esc(uit.tekst) + '</small></span></a>' : '') +
      '<div class="lade-label">Alle categorieën</div><ul>' +
      rest.map(function (c) {
        return '<li><button class="lade-rij" type="button" aria-expanded="false" aria-controls="ls-' + c.slug + '">' + ic(c.icoon, 'ic') + '<span>' + esc(c.naam) + '</span>' + ic('rechts', 'pijl') + '</button>' +
          '<div class="lade-subs" id="ls-' + c.slug + '"><a class="alles" href="#/c/' + c.slug + '">Alles in ' + esc(c.naam) + '</a>' +
          volleSubs(c).map(function (s) { return '<a href="#/c/' + c.slug + '/' + s.slug + '">' + esc(s.naam) + '</a>'; }).join('') + '</div></li>';
      }).join('') + '</ul>' +
      '<div class="lade-extra"><a href="#/vonk">VONK cadeauzoeker</a><a href="#/winkels">Onze winkels</a><a href="#/favorieten">Mijn favorieten</a><a href="#/zoek">Zoeken</a><a href="#/info/hoe-werkt-het">Hoe werkt het?</a></div>';
  }
  function bouwMega() {
    $('[data-megamenu]').innerHTML = '<div class="binnen">' + CATS.map(function (c) {
      return '<div><h3><a href="#/c/' + c.slug + '">' + ic(c.icoon) + esc(c.naam) + '</a></h3><ul>' +
        volleSubs(c).slice(0, 6).map(function (s) { return '<li><a href="#/c/' + c.slug + '/' + s.slug + '">' + esc(s.naam) + '</a></li>'; }).join('') + '</ul></div>';
    }).join('') + '</div>';
  }
  var laatsteFocus = null;
  function openLade() {
    laatsteFocus = document.activeElement;
    document.body.classList.add('lade-open');
    $('#lade').setAttribute('aria-hidden', 'false');
    $$('.menuknop').forEach(function (b) { b.setAttribute('aria-expanded', 'true'); });
    setTimeout(function () { var b = $('.lade [data-sluit-lade]'); if (b) b.focus(); }, 60);
  }
  function sluitLade() {
    if (!document.body.classList.contains('lade-open')) return;
    document.body.classList.remove('lade-open');
    $('#lade').setAttribute('aria-hidden', 'true');
    $$('.menuknop').forEach(function (b) { b.setAttribute('aria-expanded', 'false'); });
    if (laatsteFocus && document.contains(laatsteFocus)) laatsteFocus.focus();
  }
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
  function toon() {
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
    vulIconen(app);

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
    if (a.pad !== vorigPad) { window.scrollTo(0, 0); if (vorigPad !== null) app.focus({ preventScroll: true }); }
    vorigPad = a.pad;
  }

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
    if (t.dataset.tab) {
      $$('[data-tab]').forEach(function (b) { b.setAttribute('aria-pressed', String(b === t)); });
      $('[data-uitgelicht]').innerHTML = uitgelicht(t.dataset.tab);
      return;
    }
    if (!t.closest('.megamenu')) sluitMega();
    // Zelfde adres opnieuw aanklikken: lade/menu wel sluiten
    if (t.tagName === 'A' && t.getAttribute('href') === location.hash) { sluitLade(); sluitMega(); }
  });
  document.querySelector('.lade-bg').addEventListener('click', sluitLade);

  document.addEventListener('submit', function (e) {
    var f = e.target.closest('[data-zoek]');
    if (!f) return;
    e.preventDefault();
    var q = f.querySelector('input').value.trim();
    var huidig = leesAdres();
    var nq = { q: q, prijs: huidig.delen[0] === 'zoek' ? huidig.q.prijs : '' };
    location.hash = maakAdres('/zoek', nq);
    f.querySelector('input').blur();
  });
  document.addEventListener('change', function (e) {
    if (e.target.matches('[data-sorteer]')) {
      var basis = e.target.getAttribute('data-sorteer'), v = e.target.value;
      location.hash = v === 'aanbevolen' ? basis : basis + (basis.indexOf('?') === -1 ? '?' : '&') + 'sort=' + v;
    }
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { sluitLade(); sluitMega(); } });
  window.addEventListener('hashchange', toon);
  window.addEventListener('storage', function () { werkTellersBij(); toon(); });

  /* ================== START ================== */
  vulIconen(document);
  bouwLade(); bouwMega();
  vulIconen($('[data-lade]').parentNode); vulIconen($('[data-megamenu]'));
  werkTellersBij();
  toon();
})();
