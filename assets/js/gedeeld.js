/* Gedeelde hulpjes voor de site en de Productstudio */
(function () {
  var K_KEUR = 'lk-keuringen-v2';
  var K_FAV = 'lk-favorieten-v1';

  function lees(k, leeg) { try { var v = JSON.parse(localStorage.getItem(k)); return v == null ? leeg : v; } catch (e) { return leeg; } }
  function bewaar(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } }

  /* ---------- Keuringen (Productstudio) ---------- */
  function leesKeuringen() { return lees(K_KEUR, {}); }
  function bewaarKeuringen(k) { return bewaar(K_KEUR, k); }

  /* Producten + keuringen die op dít apparaat zijn gedaan. Afwijzen haalt niets weg. */
  function producten() {
    var k = leesKeuringen();
    return (window.LK_PRODUCTEN || []).map(function (p) {
      var e = k[p.id];
      if (!e) return Object.assign({}, p);
      return Object.assign({}, p, {
        status: e.status || p.status, cat: e.cat || p.cat, sub: e.sub || p.sub,
        tekstHerschrijven: !!e.tekstHerschrijven, lokaal: true
      });
    });
  }
  function zichtbaar() { return producten().filter(function (p) { return p.status === 'goedgekeurd'; }); }
  function vind(id) { return producten().find(function (p) { return p.id === id; }); }
  /* 'Nieuw' = de eerste 2 weken op de site ('sinds'). Zonder datum telt het vinkje 'nieuw'. */
  var NIEUW_DAGEN = 14;
  function isNieuw(p) {
    if (p.sinds) { var t = Date.parse(p.sinds); return !isNaN(t) && (Date.now() - t) < NIEUW_DAGEN * 864e5; }
    return !!p.nieuw;
  }

  /* Hoort product bij categorie (en evt. sub)? Kijkt ook naar 'ookIn'. */
  function hoortBij(p, cat, sub) {
    /* Christelijke producten staan alleen in de categorie Christelijke cadeaus (wens van Marius). */
    if (p.cat === 'christelijk' && cat !== 'christelijk') return false;
    /* 'Onder €15' gaat automatisch op prijs: alles onder de 15 euro, nooit iets duurders. */
    if (cat === 'cadeaus' && sub === 'onder-15') return typeof p.prijs === 'number' && p.prijs < 15;
    /* 'Sint onder €15' gaat ook automatisch: alles uit Sinterklaas onder de 15 euro (wens van Marius). */
    if (cat === 'cadeaus' && sub === 'sint-onder-15') return typeof p.prijs === 'number' && p.prijs < 15 && hoortBij(p, 'cadeaus', 'sinterklaas');
    /* 'Christelijk cadeau onder €25' gaat automatisch op prijs. Kaartjes (onder €5) tellen niet mee: dat zijn geen cadeaus. */
    if (cat === 'christelijk' && sub === 'onder-25') return p.cat === 'christelijk' && typeof p.prijs === 'number' && p.prijs >= 5 && p.prijs < 25;
    /* Een categorie die 'onder' een andere hangt (Metaaldetectie onder Sport) telt daar mee als sub. */
    var kind = (window.LK_CATEGORIEEN || []).find(function (c) { return c.onder === cat && c.slug === p.cat; });
    if (kind && (!sub || sub === kind.slug)) return true;
    if (p.cat === cat && (!sub || p.sub === sub)) return true;
    return (p.ookIn || []).some(function (x) {
      var d = x.split('/');
      return d[0] === cat && (!sub || d[1] === sub);
    });
  }

  /* ---------- Favorieten ---------- */
  function favorieten() { return lees(K_FAV, []); }
  function isFavoriet(id) { return favorieten().indexOf(id) !== -1; }
  function wisselFavoriet(id) {
    var f = favorieten(), i = f.indexOf(id);
    if (i === -1) f.push(id); else f.splice(i, 1);
    bewaar(K_FAV, f);
    return i === -1;
  }

  /* ---------- Opmaak ---------- */
  function esc(t) {
    return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function euro(n) {
    var s = Number(n).toFixed(2).split('.');
    return '€ ' + s[0] + '<span class="c">,' + s[1] + '</span>';
  }

  /* Iconen: dunne gouden lijnen, getekend in code */
  var P = {
    cadeau: '<rect x="3.5" y="9" width="17" height="11.5" rx="1.5"/><path d="M2.5 9h19V6.5h-19Z"/><path d="M12 6.5v14M12 6.5C10.5 3 6.5 2.6 7 5c.4 1.6 5 1.5 5 1.5Zm0 0c1.5-3.5 5.5-3.9 5-1.5-.4 1.6-5 1.5-5 1.5Z"/>',
    kruis: '<path d="M10.5 2.5h3v5h5v3h-5v11h-3v-11h-5v-3h5Z"/>',
    beer: '<circle cx="6.5" cy="6" r="2.5"/><circle cx="17.5" cy="6" r="2.5"/><circle cx="12" cy="12" r="7"/><circle cx="9.5" cy="11" r=".6" fill="currentColor"/><circle cx="14.5" cy="11" r=".6" fill="currentColor"/><path d="M10.5 14.5c.8.8 2.2.8 3 0"/>',
    huis: '<path d="M3.5 11 12 4l8.5 7"/><path d="M5.5 9.5V20h13V9.5"/><path d="M10 20v-6h4v6"/>',
    koptelefoon: '<path d="M4 15v-3a8 8 0 0 1 16 0v3"/><rect x="3" y="14" width="4.5" height="7" rx="1.5"/><rect x="16.5" y="14" width="4.5" height="7" rx="1.5"/>',
    kop: '<path d="M4 9h13v5a6 6 0 0 1-6 6h-1a6 6 0 0 1-6-6Z"/><path d="M17 11h1.5a2.5 2.5 0 0 1 0 5H16.5"/><path d="M8 3c-.8 1 .8 2 0 3M12 3c-.8 1 .8 2 0 3"/>',
    tas: '<path d="M5 8h14l-1 12.5H6Z"/><path d="M9 10V6.5a3 3 0 0 1 6 0V10"/>',
    bal: '<circle cx="12" cy="12" r="8.5"/><path d="m12 7.5 3.4 2.5-1.3 4h-4.2l-1.3-4Z"/><path d="M12 3.5v4M15.4 10l4.3-1.4M14.1 14l2.6 3.7M9.9 14l-2.6 3.7M8.6 10 4.3 8.6"/>',
    blad: '<path d="M5 19c0-8 5-14 15-15-1 10-7 15-15 15Z"/><path d="M5 19 14 10"/>',
    poot: '<ellipse cx="12" cy="16" rx="4.5" ry="3.8"/><circle cx="6" cy="10.5" r="1.8"/><circle cx="9.5" cy="6.5" r="1.8"/><circle cx="14.5" cy="6.5" r="1.8"/><circle cx="18" cy="10.5" r="1.8"/>',
    palet: '<path d="M12 3.5a8.5 8.5 0 1 0 0 17c1.4 0 1.8-1.1 1.2-2.1-.7-1.2 0-2.6 1.4-2.6H17a3.5 3.5 0 0 0 3.5-3.6C20.4 7.4 16.6 3.5 12 3.5Z"/><circle cx="7.5" cy="11" r="1"/><circle cx="10" cy="7.3" r="1"/><circle cx="14.5" cy="7.3" r="1"/>',
    boek: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5Z"/><path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H20v3H6.5"/>',
    taart: '<path d="M4 20h16v-7H4Z"/><path d="M4 15.5c2 1.3 4 1.3 5.3 0 1.4 1.3 4 1.3 5.4 0 1.3 1.3 3.3 1.3 5.3 0"/><path d="M8 13v-3M12 13v-3M16 13v-3"/><path d="M8 7.5c-.7-.8.7-1.5 0-2.5M12 7.5c-.7-.8.7-1.5 0-2.5M16 7.5c-.7-.8.7-1.5 0-2.5"/>',
    glas: '<path d="M7.5 3h9l-.6 6.2a3.9 3.9 0 0 1-7.8 0Z"/><path d="M12 13.2V20M8.5 20h7"/>',
    hart: '<path d="M12 20s-8-4.6-8-10.4A4.6 4.6 0 0 1 12 7a4.6 4.6 0 0 1 8 2.6C20 15.4 12 20 12 20Z"/>',
    zoek: '<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    sluit: '<path d="M6 6l12 12M18 6 6 18"/>',
    filter: '<path d="M4 6h16M7 12h10M10 18h4"/>',
    pijl: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    links: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    rechts: '<path d="m9 6 6 6-6 6"/>',
    vorige: '<path d="m15 6-6 6 6 6"/>',
    ring: '<path d="M9 4h6l2 3-5 4-5-4z"/><path d="M7 7h10"/><circle cx="12" cy="15.5" r="5.5"/>',
    detector: '<path d="M6 20.5h6.5"/><ellipse cx="7" cy="18.2" rx="4.2" ry="1.9"/><path d="M8.5 16.5 17 5"/><rect x="14.6" y="3.2" width="5.2" height="4" rx="1" transform="rotate(37 17.2 5.2)"/><path d="M13.6 9.6l2 1.5"/>',
    omlaag: '<path d="m6 9 6 6 6-6"/>',
    home: '<path d="M4 11 12 4l8 7v9h-5.5v-6h-5v6H4Z"/>',
    raster: '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',
    vink: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    winkel: '<path d="M4 9.5 5.5 4h13L20 9.5"/><path d="M4 9.5h16a2.7 2.7 0 0 1-5.3 0 2.7 2.7 0 0 1-5.4 0 2.7 2.7 0 0 1-5.3 0Z"/><path d="M5.5 12.5V20h13v-7.5"/>',
    info: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5M12 8h.01"/>',
    ster: '<path d="m12 3.5 2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.8l-5.2 2.8 1-5.8-4.3-4.1 5.9-.8Z"/>',
    klok: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    vonk: '<path d="M4 20 14.5 9.5"/><path d="m13 8 3 3"/><path d="M17 3.5v3M15.5 5h3M20 8.5v2M19 9.5h2M10 3v2M9 4h2"/><path d="M18.5 13.5l.6 1.4 1.4.6-1.4.6-.6 1.4-.6-1.4-1.4-.6 1.4-.6Z"/>'
  };
  function icoon(naam, klasse) {
    return '<svg class="' + (klasse || '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (P[naam] || P.cadeau) + '</svg>';
  }

  /* Productfoto met kleine versie voor mobiel */
  function productBeeld(p, groot) {
    if (!p.beeld) {
      var c = window.LK_CAT(p.cat);
      return icoon(c ? c.icoon : 'cadeau');
    }
    if (/^https?:\/\//.test(p.beeld)) {
      return '<img src="' + esc(p.beeld) + '" alt="' + esc(p.titel) + '" loading="lazy" decoding="async" referrerpolicy="no-referrer">';
    }
    return '<img src="' + esc(p.beeld) + (groot ? '' : '-klein') + '.webp" ' +
      (groot ? '' : 'srcset="' + esc(p.beeld) + '-klein.webp 500w, ' + esc(p.beeld) + '.webp 1000w" sizes="(min-width: 1100px) 250px, 50vw" ') +
      'alt="' + esc(p.titel) + '"' + (groot ? ' fetchpriority="high" decoding="async">' : ' loading="lazy" decoding="async">');
  }

  function productKaart(p) {
    var fav = isFavoriet(p.id);
    var label = p.voorbeeld ? '<span class="label">Voorbeeld</span>' : p.eigen ? '<span class="label vol favo">★ Van LeukeKeuze</span>' : (p.favoriet ? '<span class="label vol favo">★ Onze favoriet</span>' : (isNieuw(p) ? '<span class="label vol">Nieuw</span>' : ''));
    return '<article class="prodkaart">' +
      '<div class="beeld' + (p.voorbeeld || !p.beeld ? '' : ' echt') + (p.sfeer ? ' sfeer' : '') + '">' + productBeeld(p) + label + '</div>' +
      '<button class="hartje" type="button" data-fav="' + esc(p.id) + '" aria-pressed="' + fav + '" aria-label="' + (fav ? 'Verwijder uit favorieten' : 'Bewaar als favoriet') + '">' + icoon('hart') + '</button>' +
      '<div class="info">' +
        '<span class="shop">' + esc(p.shop) + '</span>' +
        '<h3><a href="/p/' + esc(p.id) + '">' + esc(p.titel) + '</a></h3>' +
        '<div class="prijs">' + euro(p.prijs) + (p.oudePrijs > p.prijs ? ' <s class="oud">' + euro(p.oudePrijs) + '</s>' : '') + '</div>' +
      '</div></article>';
  }

  window.LK = {
    leesKeuringen: leesKeuringen, bewaarKeuringen: bewaarKeuringen,
    producten: producten, zichtbaar: zichtbaar, vind: vind, hoortBij: hoortBij, isNieuw: isNieuw,
    favorieten: favorieten, isFavoriet: isFavoriet, wisselFavoriet: wisselFavoriet,
    esc: esc, euro: euro, icoon: icoon, productBeeld: productBeeld, productKaart: productKaart
  };
})();

/* ---------- Aftelbalk bovenaan: eerst Sinterklaas (tot 5 december), daarna kerst (tot 26 december) ---------- */
(function () {
  var el = document.querySelector('[data-aftel]'); if (!el) return;
  function vandaagNL() {
    try {
      var d = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Amsterdam', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
      var x = d.split('-'); return Date.UTC(+x[0], +x[1] - 1, +x[2]);
    } catch (e) { var n = new Date(); return Date.UTC(n.getFullYear(), n.getMonth(), n.getDate()); }
  }
  var nu = vandaagNL(), jaar = new Date(nu).getUTCFullYear();
  var sint = Date.UTC(jaar, 11, 5), kerst = Date.UTC(jaar, 11, 25), dag = 864e5;
  var start = Date.UTC(jaar, 9, 1);          /* vanaf 1 oktober tonen */
  if (nu < start || nu > Date.UTC(jaar, 11, 26)) return;
  var thema, n, tekst, link;
  if (nu <= sint) {
    thema = 'sint'; n = Math.round((sint - nu) / dag); link = '/c/cadeaus/sinterklaas';
    tekst = n === 0 ? '<span class="aftel-zin">Vandaag is het <b>pakjesavond!</b></span>'
      : n === 1 ? '<span class="aftel-zin">Morgen is het <b>pakjesavond!</b></span>'
      : '<span class="aftel-zin">Nog <span class="aftel-getal">' + n + '</span> dagen tot pakjesavond</span>';
  } else {
    thema = 'kerst'; n = Math.round((kerst - nu) / dag); link = '/c/cadeaus/kerst';
    tekst = n <= 0 ? '<span class="aftel-zin"><b>Fijne kerstdagen!</b></span>'
      : n === 1 ? '<span class="aftel-zin">Morgen is het <b>kerst!</b></span>'
      : '<span class="aftel-zin">Nog <span class="aftel-getal">' + n + '</span> dagen tot kerst</span>';
  }
  el.className = 'aftel aftel-' + thema;
  el.href = link;
  el.innerHTML = '<span class="aftel-beeld links" aria-hidden="true"></span>' +
    '<span class="aftel-midden">' + tekst + '<span class="aftel-knop">' + (thema === 'sint' ? 'Sinterklaascadeaus' : 'Kerstcadeaus') + ' →</span></span>' +
    '<span class="aftel-beeld rechts" aria-hidden="true"></span>';
  el.setAttribute('aria-label', el.textContent.replace(' →', '') + ', bekijk de cadeaus');
  el.hidden = false;
  document.documentElement.classList.add('met-aftel');
})();


/* Feestdagen-versiering: lichtjessnoer + twinkelende sterren (25 okt t/m 6 jan; Sint t/m 5 dec, daarna kerst) */
(function () {
  var nu = new Date(), m = nu.getMonth() + 1, d = nu.getDate();
  var aan = (m >= 11) || (m === 10 && d >= 25) || (m === 1 && d <= 6);
  if (!aan) return;
  var sint = (m === 10) || (m === 11) || (m === 12 && d <= 5);
  document.documentElement.classList.add('feest', sint ? 'feest-sint' : 'feest-kerst');
  var kop = document.querySelector('.header'); if (!kop || kop.querySelector('.lichtsnoer')) return;
  var kleuren = sint ? [['#FF4D4D', 'rgba(255,60,60,.55)'], ['#FFD36B', 'rgba(255,200,80,.6)'], ['#FFF4DC', 'rgba(255,240,210,.55)']]
                     : [['#FF4D4D', 'rgba(255,60,60,.55)'], ['#46D27A', 'rgba(60,210,110,.55)'], ['#FFD36B', 'rgba(255,200,80,.6)'], ['#7EC8FF', 'rgba(120,200,255,.5)']];
  var s = document.createElement('div'); s.className = 'lichtsnoer'; s.setAttribute('aria-hidden', 'true');
  var stap = 46, n = Math.ceil(Math.max(window.innerWidth, 1400) / stap) + 1, pad = '', html = '';
  for (var i = 0; i < n; i++) {
    var x = i * stap, y = (i % 2) ? 4 : 1;
    pad += (i ? ' Q' + (x - stap / 2) + ',' + 9 + ' ' : 'M') + x + ',' + y;
    var k = kleuren[i % kleuren.length];
    html += '<i style="left:' + (x - 3) + 'px;top:' + (y + 2) + 'px;--lamp:' + k[0] + ';--lamp-gloed:' + k[1] + ';animation-delay:' + ((i * 0.37) % 1.8).toFixed(2) + 's"></i>';
  }
  s.innerHTML = '<svg class="draad" preserveAspectRatio="none"><path d="' + pad + '" fill="none" stroke="#2B3242" stroke-width="1.4"/></svg>' + html;
  kop.appendChild(s);
})();
