/* Gedeelde hulpjes voor de site en de Productstudio */
(function () {
  var K_KEUR = 'lk-keuringen-v2';
  var K_FAV = 'lk-favorieten-v1';

  function lees(k, leeg) { try { var v = JSON.parse(localStorage.getItem(k)); return v == null ? leeg : v; } catch (e) { return leeg; } }
  function bewaar(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } }

  /* ---------- Keuringen (Productstudio) ---------- */
  function leesKeuringen() { return lees(K_KEUR, {}); }
  function bewaarKeuringen(k) { cache = null; return bewaar(K_KEUR, k); }

  /* Producten + keuringen die op dít apparaat zijn gedaan. Afwijzen haalt niets weg.
     Snelheid (31-10-2026): de lijst wordt één keer gemaakt en daarna hergebruikt. Eerst werd bij élke aanroep de hele lijst
     (ruim 5.500 producten) opnieuw gekopieerd, tientallen keren per pagina: dat kostte op een telefoon seconden rekentijd. */
  var cache = null, cacheBron = null;
  function producten() {
    if (cache && cacheBron === window.LK_PRODUCTEN) return cache;
    var k = leesKeuringen(), lokaal = Object.keys(k).length > 0;
    cacheBron = window.LK_PRODUCTEN;
    cache = (window.LK_PRODUCTEN || []).map(function (p) {
      var e = lokaal && k[p.id];
      if (!e) return p;
      return Object.assign({}, p, {
        status: e.status || p.status, cat: e.cat || p.cat, sub: e.sub || p.sub,
        tekstHerschrijven: !!e.tekstHerschrijven, lokaal: true
      });
    });
    return cache;
  }
  function vergeetCache() { cache = null; }
  var zichtbaarCache = null, zichtbaarBron = null;
  /* SNEL (13-11-2026): alleen tijdens het bouwen (scripts/maak-pakken.js zet window.LK_OPNAME) schrijven we op welke producten een pagina
     echt gebruikt. Daar komt het kleine productbestand van die pagina uit (het pak). Op de site zelf doet dit niets. */
  function opname(z) {
    var O = window.LK_OPNAME, o = z.slice();
    o.filter = function (fn, t) { var r = Array.prototype.filter.call(z, fn, t); for (var i = 0; i < r.length; i++) O.ids[r[i].id] = 1; return r; };
    o.some = function (fn, t) { return Array.prototype.some.call(z, function (p, i, a) { var ok = fn.call(t, p, i, a); if (ok) O.ids[p.id] = 1; return ok; }); };
    o.find = function (fn, t) { var p = Array.prototype.find.call(z, fn, t); if (p) O.ids[p.id] = 1; return p; };
    o.forEach = function (fn, t) { O.alles = (O.alles || 0) + 1; return Array.prototype.forEach.call(z, fn, t); };
    o.map = function (fn, t) { O.alles = (O.alles || 0) + 1; return Array.prototype.map.call(z, fn, t); };
    return o;
  }
  /* STIL (22-11-2026, Marius over 46 extra Tamagotchi's: 'ze moeten allemaal te koop zijn maar niet allemaal te zien, anders wordt de site zo vol'):
     een product met p.stil = 1 is gewoon te koop (eigen productpagina, winkelknop) en te vinden met de zoekbalk, het lijstje en het verlanglijstje,
     maar staat niet in de lijsten (afdelingen, Voor wie, gelegenheden, collecties, straat, kieshulp). zichtbaar(true) = met de stille erbij.
     Alles weer overal: window.LK_STIL_OOK = true. */
  var metStilCache = null;
  function zichtbaar(metStil) {
    var l = producten();
    if (!zichtbaarCache || zichtbaarBron !== l) {
      zichtbaarBron = l; metStilCache = l.filter(function (p) { return p.status === 'goedgekeurd'; });
      zichtbaarCache = window.LK_STIL_OOK === true ? metStilCache : metStilCache.filter(function (p) { return !p.stil; });
    }
    var z = metStil ? metStilCache : zichtbaarCache;
    return window.LK_OPNAME ? opname(z) : z;
  }
  var vindKaart = null, vindBron = null;
  function vind(id) {
    var l = producten();
    if (!vindKaart || vindBron !== l) { vindBron = l; vindKaart = {}; for (var i = 0; i < l.length; i++) vindKaart[l[i].id] = l[i]; }
    if (window.LK_OPNAME && vindKaart[id]) window.LK_OPNAME.ids[id] = 1;
    if (window.LK_DEEL && !vindKaart[id]) window.LK_DEEL_MIS = true; /* SNEL: dit product zit niet in het pak van de pagina; als de hele lijst er is kijken we opnieuw */
    return vindKaart[id];
  }
  try { window.addEventListener('storage', function (e) { if (!e || !e.key || e.key === K_KEUR) cache = null; }); } catch (e) {}
  /* 'Nieuw' = de eerste 2 weken op de site ('sinds'). Zonder datum telt het vinkje 'nieuw'. */
  /* 8-11-2026 (GO Marius): de hele winkel is in oktober/november gevuld, dus 'Nieuw' stond op alles en zei niets.
     Nu: alleen wat er vanaf 9 november bij komt (de piloot), en dan 7 dagen lang. */
  var NIEUW_DAGEN = 7, NIEUW_VANAF = '2026-11-09';
  function isNieuw(p) {
    if (!p.sinds || p.sinds < NIEUW_VANAF) return false;
    var t = Date.parse(p.sinds); return !isNaN(t) && (Date.now() - t) < NIEUW_DAGEN * 864e5;
  }

  var HB_BRON = null, HB_N = -1, HB = {};
  function hbZoek(cat, sub) {
    var C = window.LK_CATEGORIEEN || [];
    if (HB_BRON !== C || HB_N !== C.length) { HB_BRON = C; HB_N = C.length; HB = {}; }
    var k = cat + '|' + (sub || ''), r = HB[k];
    if (!r) {
      var nc = C.find(function (c) { return c.slug === cat && !c.verborgen; });
      var cd = C.find(function (c) { return c.slug === cat; });
      /* categorieën die 'onder' deze hangen: de eerste per naam, net als het zoeken hiervoor deed */
      var onder = null; C.forEach(function (c) { if (c.onder === cat) { onder = onder || Object.create(null); if (!(c.slug in onder)) onder[c.slug] = c; } });
      r = HB[k] = { nc: nc, ns: nc && sub ? (nc.subs || []).find(function (s) { return s.slug === sub; }) : null, cd: cd,
        sd: cd && sub ? (cd.subs || []).find(function (s) { return s.slug === sub; }) : undefined, onder: onder };
    }
    return r;
  }
  /* Hoort product bij categorie (en evt. sub)? Kijkt ook naar 'ookIn'. */
  function hoortBij(p, cat, sub, vak) {
    /* 3.0 (4-11-2026): nieuwe boom. Afdeling > groep > vakje staan in p.afd, p.groep en p.vak.
       Oude adressen en de themapagina's (Cadeaus, Valentijn) werken nog via p.cat/p.sub/ookIn hieronder. */
    /* SNEL (13-11-2026): de afdeling en de groep werden bij elk product opnieuw opgezocht (drie keer zoeken per vraag, honderdduizenden vragen
       per pagina). De indeling verandert niet terwijl de pagina open staat: we zoeken hem één keer op per afdeling en groep. */
    /* POKÉMON-HOEK (17-11-2026): een Pokémon-product uit een ander vakje (Knuffels, Mokken, LEGO ...) staat óók in de hoek; p2 = het vakje daar (scripts/boom/pokemon.js). */
    if (p.p2 && sub === 'pokemon-verzamelkaarten' && cat === 'spellen-puzzels') return !vak || p.p2 === vak;
    /* HELLO KITTY-HOEK (17-11-2026): zelfde voor de groep Hello Kitty & vriendjes; p3 = het vakje daar (scripts/boom/hellokitty.js). */
    if (p.p3 && sub === 'hello-kitty' && cat === 'speelgoed') return !vak || p.p3 === vak;
    /* KPOP DEMON HUNTERS-HOEK (17-11-2026): p4 = het vakje daar (scripts/boom/kpop.js). */
    if (p.p4 && sub === 'kpop-demon-hunters' && cat === 'speelgoed') return !vak || p.p4 === vak;
    /* ONE PIECE & ANIME-HOEK (17-11-2026): p5 = het vakje van de serie (scripts/boom/anime.js). */
    if (p.p5 && sub === 'one-piece-anime' && cat === 'speelgoed') return !vak || p.p5 === vak;
    var HZ = hbZoek(cat, sub), nc = HZ.nc, ns = HZ.ns;
    if (nc && p.afd && (!sub || (ns && ns.vakjes))) {
      if (cat === 'christelijk' && sub === 'onder-25') { /* valt hieronder */ }
      else return p.afd === cat && (!sub || p.groep === sub) && (!vak || p.vak === vak);
    }
    /* 2.0: een groep of subcategorie kan doorverwijzen naar een ander vak (bijv. Sieraden & Horloges -> mode-beauty/horloges). */
    var cd = HZ.cd;
    if (cd) {
      if (sub) { var sd = HZ.sd;
        /* 4.0: een groep van vóór de verhuizing weet nog precies welke vakjes erbij hoorden (gidsen en gelegenheden noemen die groepen nog). */
        if (sd && sd.verborgen && sd.vakken) return sd.vakken.some(function (v) { var d = v.split('/'); return (!vak || d[2] === vak) && hoortBij(p, d[0], d[1], d[2]); });
        if (sd && sd.vak) { var vd = sd.vak.split('/'); return hoortBij(p, vd[0], vd[1]); } }
      else if (cd.vakken && cd.vakken.some(function (v) { var d = v.split('/'); return hoortBij(p, d[0], d[1]); })) return true;
    }
    /* Christelijke producten staan alleen in de categorie Christelijke cadeaus (wens van Marius). */
    if (p.cat === 'christelijk' && cat !== 'christelijk') return false;
    /* 'Onder €15' gaat automatisch op prijs: alles onder de 15 euro, nooit iets duurders. */
    if (cat === 'cadeaus' && sub === 'onder-15') return typeof p.prijs === 'number' && p.prijs < 15;
    /* 'Sint onder €15' gaat ook automatisch: alles uit Sinterklaas onder de 15 euro (wens van Marius). */
    if (cat === 'cadeaus' && sub === 'sint-onder-15') return typeof p.prijs === 'number' && p.prijs < 15 && hoortBij(p, 'cadeaus', 'sinterklaas');
    /* 'Christelijk cadeau onder €25' gaat automatisch op prijs. Kaartjes (onder €5) tellen niet mee: dat zijn geen cadeaus. */
    if (cat === 'christelijk' && sub === 'onder-25') return p.cat === 'christelijk' && typeof p.prijs === 'number' && p.prijs >= 5 && p.prijs < 25;
    /* Een categorie die 'onder' een andere hangt (Metaaldetectie onder Sport) telt daar mee als sub. */
    var kind = HZ.onder ? HZ.onder[p.cat] : undefined;
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
    nood: '<path d="M12 2.8 4.8 5.6v5.6c0 4.6 3 8.4 7.2 10 4.2-1.6 7.2-5.4 7.2-10V5.6Z"/><path d="M12 8.2v7.2M8.4 11.8h7.2"/>',
    kruis: '<path d="M10.5 2.5h3v5h5v3h-5v11h-3v-11h-5v-3h5Z"/>',
    dobbel: '<rect x="4" y="4" width="16" height="16" rx="3.5"/><circle cx="8.5" cy="8.5" r=".9" fill="currentColor"/><circle cx="15.5" cy="8.5" r=".9" fill="currentColor"/><circle cx="12" cy="12" r=".9" fill="currentColor"/><circle cx="8.5" cy="15.5" r=".9" fill="currentColor"/><circle cx="15.5" cy="15.5" r=".9" fill="currentColor"/>', /* 4.0: Spellen & puzzels */
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
    whatsapp: '<path d="M4.5 19.5 5.6 15.8A8 8 0 1 1 8.4 18.6Z"/><path d="M9.2 8.8c.2 2.6 2.9 5.4 5.6 5.8l1.1-1.3-1.6-.9-.8.7c-1-.4-2.1-1.4-2.5-2.5l.7-.8-.9-1.6Z"/>',
    zoek: '<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    sluit: '<path d="M6 6l12 12M18 6 6 18"/>',
    filter: '<path d="M4 6h16M7 12h10M10 18h4"/>',
    sorteer: '<path d="M8 4v16M4.5 7.5 8 4l3.5 3.5M16 20V4M12.5 16.5 16 20l3.5-3.5"/>',
    pijl: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    links: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    rechts: '<path d="m9 6 6 6-6 6"/>',
    vorige: '<path d="m15 6-6 6 6 6"/>',
    ruil: '<path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3"/><path d="M4.5 4.5v3.5H8"/>',
    ring: '<path d="M9 4h6l2 3-5 4-5-4z"/><path d="M7 7h10"/><circle cx="12" cy="15.5" r="5.5"/>',
    detector: '<path d="M6 20.5h6.5"/><ellipse cx="7" cy="18.2" rx="4.2" ry="1.9"/><path d="M8.5 16.5 17 5"/><rect x="14.6" y="3.2" width="5.2" height="4" rx="1" transform="rotate(37 17.2 5.2)"/><path d="M13.6 9.6l2 1.5"/>',
    omlaag: '<path d="m6 9 6 6 6-6"/>',
    home: '<path d="M4 11 12 4l8 7v9h-5.5v-6h-5v6H4Z"/>',
    raster: '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',
    vink: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    winkel: '<path d="M4 9.5 5.5 4h13L20 9.5"/><path d="M4 9.5h16a2.7 2.7 0 0 1-5.3 0 2.7 2.7 0 0 1-5.4 0 2.7 2.7 0 0 1-5.3 0Z"/><path d="M5.5 12.5V20h13v-7.5"/>',
    info: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5M12 8h.01"/>',
    ster: '<path d="m12 3.5 2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.8l-5.2 2.8 1-5.8-4.3-4.1 5.9-.8Z"/>',
    printer: '<path d="M7 8.5V4h10v4.5"/><rect x="3.5" y="8.5" width="17" height="8" rx="2"/><path d="M7 14h10v6H7z"/>',
    klok: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    deel: '<circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="m8.2 10.8 7.6-4.4M8.2 13.2l7.6 4.4"/>',
    vonk: '<path d="M4 20 14.5 9.5"/><path d="m13 8 3 3"/><path d="M17 3.5v3M15.5 5h3M20 8.5v2M19 9.5h2M10 3v2M9 4h2"/><path d="M18.5 13.5l.6 1.4 1.4.6-1.4.6-.6 1.4-.6-1.4-1.4-.6 1.4-.6Z"/>'
  };
  function icoon(naam, klasse) {
    return '<svg class="' + (klasse || '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (P[naam] || P.cadeau) + '</svg>';
  }

  /* Productfoto met kleine versie voor mobiel */
  /* Productfoto die niet laadt (21-11-2026, Marius zag bij een e-bike een kapot plaatje terwijl de foto er gewoon staat):
     één keer opnieuw proberen, zonder srcset en met een kenmerkje erachter zodat de telefoon hem echt opnieuw ophaalt. */
  var BEELD_OPNIEUW = ' onerror="if(!this.dataset.r){this.dataset.r=1;this.removeAttribute(\'srcset\');this.src=this.src.split(\'?\')[0]+\'?r=1\'}"';
  function productBeeld(p, groot) {
    if (!p.beeld) {
      var c = window.LK_CAT(p.cat);
      return icoon(c ? c.icoon : 'cadeau');
    }
    if (/^https?:\/\//.test(p.beeld)) {
      return '<img src="' + esc(p.beeld) + '" alt="' + esc(p.titel) + '" loading="lazy" decoding="async" referrerpolicy="no-referrer">';
    }
    return '<img src="' + esc(p.beeld) + (groot ? '' : '-klein') + '.webp" ' +
      (groot ? '' : 'srcset="' + esc(p.beeld) + '-klein.webp 400w, ' + esc(p.beeld) + '.webp 640w" sizes="(min-width: 1100px) 250px, 50vw" ') +
      'alt="' + esc(p.titel) + '"' + BEELD_OPNIEUW + (groot ? ' fetchpriority="high" decoding="async">' : ' loading="lazy" decoding="async">');
  }

  /* Lange woorden in een producttitel netjes afbreken (11-11-2026, fout gezien op /voor/kinderen/ op 390px: 'Bellenblaasmachi|ne').
     LK_AFBREEK (uit producten-lean.js) zegt per lang woord waar het mag breken: bellenblaas-machine. Daar komt een onzichtbaar
     afbreekstreepje; de browser gebruikt het alleen als het woord niet op de regel past. Onbekend woord: de browser beslist zelf. */
  var afbreekTabel = null, afbreekBron = null;
  function zachtAf(titel) {
    /* 'Leren/waxkoord': na een schuine streep tussen twee woorden mag de regel ook breken (onzichtbare spatie) */
    titel = String(titel == null ? '' : titel).replace(/([A-Za-zÀ-ÿ-])\/(?=[A-Za-zÀ-ÿ])/g, '$1/\u200B');
    if (!window.LK_AFBREEK) return titel;
    if (!afbreekTabel || afbreekBron !== window.LK_AFBREEK) { afbreekBron = window.LK_AFBREEK; afbreekTabel = {}; window.LK_AFBREEK.split('|').forEach(function (s) { afbreekTabel[s.replace(/-/g, '')] = s; }); } /* SNEL: de tabel uit het pak wordt vervangen als de hele lijst er is */
    return titel.replace(/[A-Za-zÀ-ÿ]{13,}/g, function (w) {
      var s = afbreekTabel[w.toLowerCase()]; if (!s) return w;
      var uit = '', k = 0;
      for (var i = 0; i < s.length; i++) { if (s.charAt(i) === '-') uit += '\u00AD'; else uit += w.charAt(k++); }
      return uit;
    });
  }
  /* MAKKELIJK TE RUILEN (18-11-2026, voorbeeld voor Marius; onderzoek Ipsos: de grootste zorg bij een cadeau is 'verkeerd kiezen').
     Een korte regel op de kaart bij winkels die ruim retour geven, met hun eigen woorden (nagekeken op hun site op 18-11-2026, zie BEZORG_INFO in app.js).
     Niet bij cadeaus met naam, foto of eigen tekst en niet bij eten en drinken (die kun je meestal niet terugsturen). bol en Amazon niet: daar hangt het af van de verkoper.
     Live voor iedereen sinds 18-11-2026 13:35 (GO Marius). Zelf zonder bekijken: ?proef=ruil-uit (weer aan: ?proef=ruil); helemaal uit: window.LK_RUIL = false. */
  var RUIL = { 'Ditverzinjeniet': '365 dagen retour', 'Cadeau.nl': '365 dagen retour', 'Dille & Kamille': '100 dagen retour', 'CoolGift': '90 dagen ruilen of retour',
    'HEMA': '30 dagen gratis retour', 'Coolblue': 'Gratis ruilen', 'LEGO': 'Gratis retour', 'Parfumania': '30 dagen retour',
    'Bax Music': '30 dagen niet goed, geld terug' }; /* Bax: nagekeken 22-11-2026 */
  var RUIL_AAN = (function () { if (window.LK_RUIL === false) return false; try { if (/[?&]proef=ruil-uit(&|$)/.test(location.search)) localStorage.setItem('lkruil', '0'); else if (/[?&]proef=ruil(&|$)/.test(location.search)) localStorage.removeItem('lkruil'); return localStorage.getItem('lkruil') !== '0'; } catch (e) { return true; } })();
  var EIGEN_NAAM = /met (je |eigen )?(naam|foto|tekst)|gegraveerd|graveren|gepersonaliseerd|personaliseer|eigen foto|initiaal|naamketting|naambord/i;
  function ruilRegel(p) {
    var t = RUIL_AAN && !p.voorbeeld && RUIL[p.shop];
    if (!t || EIGEN_NAAM.test(p.titel || '') || p.afd === 'eten-drinken' || p.drank) return ''; /* eten en drinken kun je meestal niet terugsturen */
    return '<span class="ruil" title="Zo staat het op de site van ' + esc(p.shop) + ' (nagekeken op 18 november 2026)">' + icoon('ruil') + esc(t) + '</span>';
  }
  function productKaart(p) {
    /* 9-11-2026 (wens Marius): op heren-pagina's de niet-roze kleur laten zien (beeldHem, gemaakt door splits-producten.js). */
    if (window.LK_KAART_HEM && p.beeldHem) p = Object.assign({}, p, { beeld: p.beeldHem });
    var fav = isFavoriet(p.id);
    /* Black Friday (5-11-2026): bij minstens 20% korting toont de kaart het kortingspercentage in plaats van 'Nieuw'. */
    /* 18-11-2026 (GO Marius, onderzoek koopgedrag: 68% wantrouwt Black Friday-kortingen): een deal uit onze eigen prijsgeschiedenis (laag30 = lager dan de
       laagste prijs die wij zelf in de 30 dagen ervoor zagen) krijgt het label 'Echt lager'. Uit: window.LK_ECHT_LAGER = false. */
    var echtLager = window.LK_ECHT_LAGER !== false && p.laag30 && p.oudePrijs > p.prijs && !p.voorbeeld;
    var label = echtLager ? '<span class="label vol echt-lager">Echt lager -' + Math.round((1 - p.prijs / p.oudePrijs) * 100) + '%</span>' : p.voorbeeld ? '<span class="label">Voorbeeld</span>' : p.eigen ? '<span class="label vol favo">★ Zelf gemaakt</span>' : (p.favoriet ? '<span class="label vol favo">★ Onze favoriet</span>' : ((p.oudePrijs > p.prijs && p.prijs / p.oudePrijs <= 0.8) ? '<span class="label vol">-' + Math.round((1 - p.prijs / p.oudePrijs) * 100) + '%</span>' : (isNieuw(p) ? '<span class="label vol nieuw">Nieuw</span>' : '')));
    return '<article class="prodkaart">' +
      '<div class="beeld' + (p.voorbeeld || !p.beeld ? '' : ' echt') + (p.sfeer ? ' sfeer' : '') + '">' + productBeeld(p) + label + '</div>' +
      '<button class="hartje" type="button" data-fav="' + esc(p.id) + '" aria-pressed="' + fav + '" aria-label="' + (fav ? 'Haal van je verlanglijstje' : 'Zet op je verlanglijstje') + '">' + icoon('hart') + '</button>' +
      '<div class="info">' +
        /* 26-11-2026 (Operatie AI-vindbaarheid): spatie na de winkelnaam en 'was' (alleen voor uitleesprogramma's) voor de oude prijs,
           zodat een programma winkel, naam en prijzen niet aan elkaar plakt of de oude prijs als losse prijs leest. Zichtbaar verandert er niets. */
        '<span class="shop">' + esc(p.shop) + (p.mnd ? ' · vanaf ' + p.mnd + ' mnd' : '') + '</span> ' +
        '<h3><a href="/p/' + esc(p.id) + '">' + esc(zachtAf(p.titel)) + '</a></h3>' +
        '<div class="prijs">' + euro(p.prijs) + (p.oudePrijs > p.prijs ? ' <s class="oud"><span class="sr-only">was </span>' + euro(p.oudePrijs) + '</s>' : '') + '</div>' +
        ruilRegel(p) +
        (p.kleuren > 1 ? '<span class="kleuren"><i></i><i></i><i></i>' + p.kleuren + ' ' + (p.keuzeMeervoud || 'kleuren') + '</span>' : '') +
        /* 2.0: alleen bij onze favorieten één korte, echte reden (de eerste zin van 'waarom wij dit kozen'). */
        (kaartReden(p) ? '<p class="reden">' + esc(kaartReden(p)) + '</p>' : '') +
        koopKnop(p) +
      '</div></article>';
  }
  /* KOOPKNOP (12-11-2026, GO Marius): direct naar de winkel vanaf de kaart, met dezelfde woorden als op de productpagina ('Bekijk bij …').
     De knop gaat naar /p/<id>/?naar=winkel: die pagina stuurt meteen door naar de winkel (script in sjabloon.html, vóór de rest laadt),
     met precies dezelfde partnerlink als de knop op de productpagina. Zo hoeft de lijst geen 11.000 winkellinks mee te sjouwen.
     Niet bij drank (18+), elektrische steps en fietsen (regels RDW, 25 km/u) en RC op brandstof: daar eerst de uitleg op de productpagina. */
  function koopKnop(p) {
    if (window.LK_KOOPKNOP === false || p.voorbeeld || !p.shop || (p.status && p.status !== 'goedgekeurd')) return '';
    /* 14-11-2026 (Marius: 'zet gewoon die knop erop bij drank'): drank krijgt de knop ook; de winkel controleert zelf de leeftijd. */
    if (/elektrische-steps|elektrische-fietsen|op-brandstof/.test((p.vak || '') + ' ' + (p.sub || ''))) return '';
    return '<div class="kaart-voet"><a class="kaart-koop" data-id="' + esc(p.id) + '" href="/p/' + esc(p.id) + '/?naar=winkel" target="_blank" rel="sponsored nofollow noopener">Bekijk bij ' + esc(p.shop) + ' ' + icoon('pijl') + '</a></div>';
  }
  /* Alleen als de eerste zin kort genoeg is om heel te tonen; anders liever niets dan een afgekapte zin. */
  /* Favorieten tonen altijd een korte reden. In de nieuwe opzet van de Voor wie-pagina's (WIJZER) elke kaart die er een heeft: p.kort (etalage) of de eerste zin van 'waarom'. */
  function kaartReden(p) {
    if (window.LK && window.LK.redenAltijd) { if (p.kort) return p.kort; if (!p.waarom) return ''; var m = String(p.waarom).match(/^[^.!?]{10,}[.!?]/), z = (m ? m[0] : String(p.waarom)).trim(); return z.length > 100 ? z.slice(0, 98).replace(/\s+\S*$/, '') + '…' : z; }
    return p.favoriet && p.waarom ? korteReden(p.waarom) : '';
  }
  function korteReden(t) {
    var zin = (t.match(/^[^.!?]{10,}[.!?]/) || [''])[0].trim();
    return zin.length && zin.length <= 64 ? zin : '';
  }

  /* DARK NOVA · CADEAU-INDELING (proef, 24-11-2026; rapport Dark Nova, opdracht Marius: 'bereid de algemene regels alvast lokaal voor,
     wacht met publiceren op mijn uitdrukkelijke GO'). Standaard UIT: zonder de vlag verandert er niets.
     Aan: window.LK_NOVA_CADEAU_INDELING = true, of ?proef=nova (blijft in dat tabblad; uit: ?proef=nova-uit).
     Wat het doet (alleen als hij aan staat):
     1. Toelating vóór promotie (toelaat): op brede pagina's (Voor wie, gelegenheden, collecties, /c/cadeaus, de straat)
        geen spullen voor het dier zelf, geen grove of 18+-cadeaus bij kinderen/tieners/Sinterklaas, geen speelgoed vanaf 3 jaar bij baby;
        keukenapparaten en gereedschap naar achteren (onderaan). In hun eigen afdeling blijft alles zoals het was.
     2. Spreiding in de eerste 12 (spreid): hooguit 1 per familie (zelfde merk/figuur in hetzelfde vakje), 2 per figuur of merk,
        2 per vakje, 3 per winkel en 3 per afdeling. Wat niet past schuift naar plek 13 en verder: er verdwijnt niets.
        Verkochte toppers (Gouden Snaai, Lamborghini, hoodie, Pikachu-pen ...) houden hun plek. Black Friday (eigen deals van Marius) niet.
     3. 'Meest gezocht' zet niets meer vooraan wat de keurmeester of regel 1 naar achteren zette (in app.js, gezochtEerst). */
  var NOVA = (function () {
    /* LIVE voor iedereen sinds 24-11-2026 (Marius: 'go doe alles wat nova zegt'). Zelf de oude volgorde zien: ?proef=nova-uit (in dat tabblad; weer aan: ?proef=nova). Helemaal uit: window.LK_NOVA_CADEAU_INDELING = false. */
    var AAN = (function () { try { var q = location.search; if (/[?&]proef=nova-uit(&|$)/.test(q)) sessionStorage.setItem('lknova', '0'); else if (/[?&]proef=nova(&|$)/.test(q)) sessionStorage.removeItem('lknova');
      return window.LK_NOVA_CADEAU_INDELING !== false && sessionStorage.getItem('lknova') !== '0'; } catch (e) { return window.LK_NOVA_CADEAU_INDELING !== false; } })();
    var BESCHERMD = { 'dvzn-995816': 1, 'cl-hema-heren-pyjama': 1, 'hema-efaa95f521': 1, 'bol-9300000302102741': 1, 'dk-9393c6d57b': 1, 'bol-9300000250399375': 1, 'nedg-10eb80382d': 1 };
    var APPARAAT = /\b(airfryer|broodrooster|tosti-? ?ijzer|waterkoker|blender|keukenmachine|staafmixer|koffiezetapparaat|koffiezetter|espresso-?(machine|apparaat)|koffiemachine|stofzuiger|strijkijzer|wafelijzer|contactgrill|frituurpan|slowcooker|melkopschuimer|sapcentrifuge|magnetron|heteluchtoven|ijsmachine|fondueset|fondue-set|gourmetstel|gourmetset|raclette|grillplaat|pannenkoekmaker|sous ?vide)\b/i;
    var GEREEDSCHAP = /\b(snoeischaar|heggenschaar|boormachine|accuboor|schroefmachine|schroevendraaier|decoupeerzaag|cirkelzaag|bitset|steeksleutel|waterpomptang|gereedschapsset|gereedschapskist|gereedschapskoffer)\b/i;
    var MENS_DIER = /\b(mok|beker|sokken|tegeltje|puzzel|fotoalbum|handwarmer|poster|kalender|boek|sleutelhanger|lamp|kaars|t-shirt|trui|deurmat|kussen voor (jou|mensen))\b|vogelhuis|voederhuis|insectenhotel|egelhuis/i;
    var GROF = /f[u*]ck|\bkut\b|lekker pik|pleur op|sexy as hell|ben je dronken|piemel|borstmok|\bbitch(es)?\b|middelvinger|shit happens|bullshit|\bjoint\b|18\+|cards against humanity|drinkspel|drankspel/i;
    var FR = [['pokemon', /pok[eé]mon|pikachu|eevee|evoli/i], ['minecraft', /minecraft|creeper/i], ['harrypotter', /harry potter|zweinstein|hogwarts|gouden snaai|patronus|hedwig/i],
      ['hellokitty', /hello kitty|kuromi|cinnamoroll|my melody|sanrio/i], ['stitch', /stitch/i], ['mario', /super mario|mario kart|\bmario\b|luigi|donkey kong/i],
      ['starwars', /star wars|\byoda\b|grogu|mandalorian/i], ['kpop', /kpop|k-pop|demon hunters|huntrix|\bderpy\b/i], ['anime', /one piece|naruto|dragon ball|demon slayer|jujutsu|totoro|ghibli|\bluffy\b/i],
      ['squishmallow', /squishmallow/i], ['jellycat', /jellycat/i], ['lego', /\blego\b|\bduplo\b/i], ['f1', /\bf1\b|formule ?1|verstappen|red bull racing/i], ['tamagotchi', /tamagotchi/i],
      ['bluey', /bluey/i], ['pawpatrol', /paw patrol/i], ['barbie', /barbie/i], ['marvel', /marvel|spider-?man|avengers/i], ['disney', /disney|frozen/i], ['nijntje', /nijntje|miffy/i]];
    var ONTV = [[/\b(mama|mam|mamma|mom|moeder|moedertje|schoonmoeder)\b/i, /moederdag|\bhaar\b/], [/\b(papa|pap|paps|vader|schoonvader)\b/i, /vaderdag|\bhem\b/],
      [/\b(opa|oma|grootouders?|grootmoeder|grootvader)\b/i, /opa-oma|grootouder/], [/\b(baas|boss|manager)\b/i, /collega|afscheid/], [/\b(juf|meester|leerkracht)\b/i, /juf-meester/]];
    function frVan(p) { if (p._nfr !== undefined) return p._nfr; var t = (p.titel || '') + ' ' + (p.merk || ''); for (var i = 0; i < FR.length; i++) if (FR[i][1].test(t)) return (p._nfr = FR[i][0]); return (p._nfr = ''); }
    function merkVan(p) { return String(p.merk || '').toLowerCase().trim(); }
    function famVan(p) { var b = frVan(p) || merkVan(p) || String(p.titel || '').toLowerCase().split(/\s+/).slice(0, 2).join(' '); return b + '|' + (p.vak || p.groep || ''); }
    /* Context van een pagina. soort: 'breed' (Voor wie, gelegenheden, collecties, /c/cadeaus, de straat), 'onderwerp' (Voor wie > onderwerp), 'eigen' (/c/<afdeling>...) */
    function ctx(pad) {
      var t = String(pad == null ? '' : pad), i = t.indexOf('?'), pd = (i === -1 ? t : t.slice(0, i)).replace(/\/$/, ''), q = i === -1 ? '' : t.slice(i + 1);
      var d = pd.split('/').filter(Boolean), c = { pad: pd, soort: '', pe: '', g: '', afd: '', bf: false, sint: false };
      var vm = /(?:^|&)voor=([^&]+)/.exec(q); if (vm) c.pe = vm[1] === 'kind' ? 'kinderen' : vm[1];
      if (!d.length) c.soort = 'breed';
      else if (d[0] === 'voor') { c.pe = d[1] || ''; c.soort = !d[2] || /^(bedankje|afscheid-pensioen|lootjes)$/.test(d[2]) ? 'breed' : 'onderwerp'; c.sub = d[2] || ''; }
      else if (d[0] === 'gelegenheid') { c.soort = 'breed'; c.g = d[1] || ''; if (d[2]) c.pe = d[2]; }
      else if (d[0] === 'collectie') { c.soort = 'breed'; c.g = d[1] || ''; if (d[2]) c.pe = d[2]; c.bf = d[1] === 'black-friday'; }
      else if (d[0] === 'c' && (d[1] === 'cadeaus' || d[1] === 'valentijn')) { c.soort = 'breed'; c.g = d[2] || d[1]; }
      else if (d[0] === 'c') { c.soort = 'eigen'; c.afd = d[1] || ''; c.groep = d[2] || ''; c.vak = d[3] || ''; }
      if (c.pe === 'kind') c.pe = 'kinderen'; if (c.pe === 'tiener') c.pe = 'tieners';
      c.sint = /sinterklaas|schoencadeautjes|sint-onder-15|pakjesavond/.test(pd);
      c.jong = /^(kinderen|tieners|baby)$/.test(c.pe) || /schoencadeautjes|\/kinderen$|\/tieners$/.test(pd);
      return c.soort ? c : null;
    }
    function isDier(p) { return p.afd === 'dieren' && !MENS_DIER.test(p.titel || ''); }
    /* Toelating: 'ok', 'laag' (naar onderaan) of 'uit' (niet op deze pagina), met de reden. */
    function toelaat(p, c) {
      if (!c || BESCHERMD[p.id]) return { u: 'ok' };
      var t = p.titel || '';
      /* Eigen afdeling (Dark Nova 24-11): een apparaat of gereedschap hoort niet in de etalage van de hele afdeling (fondueset op plek 2 bij Koken & tafelen,
         snoeischaar bij Tuin & klussen); in zijn eigen groep en vakje blijft hij gewoon staan. */
      if (c.soort === 'eigen') return !c.groep && (APPARAAT.test(t) || GEREEDSCHAP.test(t)) ? { u: 'laag', r: 'apparaat of gereedschap op de hele afdeling' } : { u: 'ok' };
      if (isDier(p) && !/dier/.test(c.sub || '')) return { u: 'uit', r: 'voor het dier zelf' };
      if ((c.jong || c.sint) && GROF.test(t)) return { u: 'uit', r: 'grof of 18+ bij kinderen, tieners of Sinterklaas' };
      if (c.pe === 'baby' && ((p.leeftijd && p.leeftijd[0] >= 3) || /\b[3-9] ?\+|vanaf [3-9] jaar/i.test(t))) return { u: 'uit', r: 'speelgoed vanaf 3 jaar bij baby' };
      if ((c.pe === 'baby' || /kraam|babyshower/.test(c.g)) && p.mnd >= 12) return { u: 'laag', r: 'peuterspeelgoed (vanaf ' + p.mnd + ' maanden)' };
      if (c.soort !== 'breed') return { u: 'ok' };
      /* Black Friday (Dark Nova 24-11): meer dan 50% korting zonder eigen prijsbewijs (laag30) krijgt geen actieplek (Barbie Droomhuis); hij blijft wel op de pagina. */
      if (c.bf && !p.laag30 && p.oudePrijs > p.prijs && p.prijs / p.oudePrijs <= 0.5) return { u: 'laag', r: 'korting boven 50% zonder prijsbewijs' };
      /* Tekst voor één ontvanger (mama, papa, opa, oma, baas, juf) alleen vooraan in zijn eigen context (Dark Nova 24-11; bedankt-mok voor mama op Bedankt). */
      for (var o = 0; o < ONTV.length; o++) if (ONTV[o][0].test(t) && !ONTV[o][1].test(c.g + ' ' + c.pe)) return { u: 'laag', r: 'tekst voor één ontvanger' };
      if (APPARAAT.test(t)) return { u: 'laag', r: 'keukenapparaat' };
      if (GEREEDSCHAP.test(t) || (p.afd === 'tuin-klussen' && /gereedschap|klussen|machines/.test(p.groep || ''))) return { u: 'laag', r: 'gereedschap' };
      if (!c.sint && /chocoladeletter|kruidnoten|pepernoten|sinterklaaskaart/i.test(t)) return { u: 'laag', r: 'Sinterklaasproduct buiten Sinterklaas' };
      return { u: 'ok' };
    }
    /* Lijst door de toelating: 'uit' eraf, 'laag' achteraan (in dezelfde volgorde). log = optioneel array voor de controle. */
    function filter(l, c, log) {
      if (!AAN || !c) return l;
      var ok = [], laag = [];
      l.forEach(function (p) { var x = toelaat(p, c); if (x.u === 'ok') ok.push(p); else { if (log) log.push([c.pad, p.id, x.u, x.r]); if (x.u === 'laag') laag.push(p); } });
      return laag.length || ok.length !== l.length ? ok.concat(laag) : l;
    }
    /* Op /c/dieren zelf: eerst de cadeaus voor de mens die van dieren houdt (rapport Dark Nova). */
    function mensEerst(l, c) {
      if (!AAN || !c || c.pad !== '/c/dieren') return l;
      var m = [], d = [], vk = {}; l.forEach(function (p) { if (!isDier(p) && m.length < 2 && !vk[p.vak]) { vk[p.vak] = 1; m.push(p); } else d.push(p); }); return m.concat(d); /* hooguit 2, elk uit een ander vakje */
    }
    /* Spreiding in de eerste 12. */
    function spreid(l, c, log) {
      if (!AAN || !c || c.bf || (c.soort !== 'breed' && c.soort !== 'onderwerp') || l.length < 14) return l;
      var N = 12, breed = c.soort === 'breed', orig = {}; l.forEach(function (p, i) { if (orig[p.id] === undefined) orig[p.id] = i; });
      /* Een afdeling of winkel telt alleen mee als hij niet de aard van de pagina is: minder dan 40% van de eerste 40 kandidaten
         (bij Bedankt zijn lekkernijen het bedankje zelf, bij Voor kinderen is speelgoed de pagina). */
      var afds = {}, shops = {}, k40 = l.slice(0, 40); k40.forEach(function (p) { afds[p.afd] = (afds[p.afd] || 0) + 1; shops[p.shop] = (shops[p.shop] || 0) + 1; });
      var afdTel = breed && Object.keys(afds).length >= 4, klein = function (n) { return n < k40.length * 0.4; };
      var T = { fam: {}, fr: {}, merk: {}, vak: {}, shop: {}, afd: {} }, uit = [], rest = l.slice();
      function past(p) {
        if (T.fam[famVan(p)]) return 'familie';
        var fr = frVan(p), mk = merkVan(p);
        if (fr && (T.fr[fr] || 0) >= (breed ? 2 : 3)) return 'figuur/merk ' + fr;
        if (!breed) return '';
        if (!fr && mk && (T.merk[mk] || 0) >= 2) return 'merk ' + mk;
        if (p.vak && (T.vak[p.vak] || 0) >= 2) return 'vakje ' + p.vak;
        if (p.shop && (T.shop[p.shop] || 0) >= 3 && klein(shops[p.shop] || 0)) return 'winkel ' + p.shop;
        if (afdTel && (T.afd[p.afd] || 0) >= 3 && klein(afds[p.afd] || 0)) return 'afdeling ' + p.afd;
        return '';
      }
      function tel(p) { var fr = frVan(p), mk = merkVan(p); T.fam[famVan(p)] = 1; if (fr) T.fr[fr] = (T.fr[fr] || 0) + 1; if (mk) T.merk[mk] = (T.merk[mk] || 0) + 1; if (p.vak) T.vak[p.vak] = (T.vak[p.vak] || 0) + 1; if (p.shop) T.shop[p.shop] = (T.shop[p.shop] || 0) + 1; T.afd[p.afd] = (T.afd[p.afd] || 0) + 1; }
      while (uit.length < N && rest.length) {
        var pos = uit.length, kies = -1, i, n = Math.min(rest.length, 80);
        for (i = 0; i < n; i++) if (BESCHERMD[rest[i].id] && orig[rest[i].id] <= pos) { kies = i; break; }
        if (kies < 0) for (i = 0; i < n; i++) { var w = past(rest[i]); if (!w) { kies = i; break; } else if (log && i === 0) log.push([c.pad, rest[i].id, 'later', w]); }
        if (kies < 0) { kies = 0; if (log) log.push([c.pad, rest[0].id, 'versoepeld', 'te weinig andere kandidaten']); }
        var p = rest.splice(kies, 1)[0]; uit.push(p); tel(p);
      }
      return uit.concat(rest);
    }
    /* In een soortrij (vier per soort) op een brede pagina: eerst vier verschillende families (niet vier Pokémon-boosterpakjes naast elkaar). */
    function varieer(l, n) {
      n = n || 4; if (!AAN || l.length <= n) return l;
      var voor = [], na = [], gezien = {}, i;
      for (i = 0; i < l.length; i++) { var f = famVan(l[i]); if (voor.length < n && !gezien[f] && i < 30) { gezien[f] = 1; voor.push(l[i]); } else na.push(l[i]); }
      return voor.concat(na);
    }
    /* Mag 'meest gezocht' dit cadeau naar voren halen? Niet als de toelating het lager of eruit zet. */
    function magVoor(p, c) { return !AAN || !c || toelaat(p, c).u === 'ok'; }
    return { aan: function () { return AAN; }, ctx: ctx, toelaat: toelaat, filter: filter, spreid: spreid, mensEerst: mensEerst, magVoor: magVoor, varieer: varieer, familie: famVan, beschermd: BESCHERMD };
  })();

  /* FANLAMPJES HOGER (proef 26-11-2026, Marius: 'zet alle producten van deze soort hoger maar zorg dat het niet overheerst'; 'doe maar voor test').
     Aanleiding: het Minecraft-lampje Allay is twee keer verkocht (24 en 26-11), en eerder de Harry Potter Gouden Snaai-lamp.
     Een lampje van een game, film of serie (Minecraft, Harry Potter, Stitch, Mario, Pokémon …, tot € 40) dat al op de pagina staat, komt op plek 4, 11 en 19
     van de lijst: hooguit drie in de eerste 24, waarvan hooguit twee van Minecraft. Er komt nooit iets bij dat niet al op de pagina stond.
     Alleen bij 'Aanbevolen', in de etalage van de straat en in de afdelingen van een straatwinkel. Uit om te vergelijken: ?proef=lampjes-uit (weer aan: ?proef=lampjes);
     helemaal uit: window.LK_FANLAMP = false. Meten: kliks klik/<winkel>/<id> op deze lampjes vóór en na 26-11. */
  var FANLAMP_AAN = (function () { try { var q = location.search; if (/[?&]proef=lampjes-uit(&|$)/.test(q)) localStorage.setItem('lkfanlamp', '0'); else if (/[?&]proef=lampjes(&|$)/.test(q)) localStorage.removeItem('lkfanlamp');
    return window.LK_FANLAMP !== false && localStorage.getItem('lkfanlamp') !== '0'; } catch (e) { return window.LK_FANLAMP !== false; } })();
  var FL_LAMP = /\b(lamp|lampje|nachtlampje|nachtlamp|leeslampje|leeslamp|boeklampje|bureaulamp|neonlamp|lichtje)\b|lampje\b|lamp\b/i;
  var FL_FAN = /minecraft|harry potter|zweinstein|snaai|patronus|hedwig|stitch|super mario|\bmario\b|pok[eé]mon|pikachu|sonic|zelda|playstation|game ?boy|nintendo|bluey|star wars|marvel|among us|fortnite|hello kitty|kuromi/i;
  function fanLamp(p) { return !!(p && p.titel && p.prijs <= 40 && FL_LAMP.test(p.titel) && FL_FAN.test(p.titel) && !/tuinlamp|zonne-?energie/i.test(p.titel) && !p.stil); }
  function lampErin(l) {
    if (!FANLAMP_AAN || !l || l.length < 12) return l;
    var r = l.slice(), PLEK = [3, 10, 18], max = Math.min(24, r.length), al = 0, mc = 0, i;
    for (i = 0; i < max; i++) if (fanLamp(r[i])) { al++; if (/minecraft/i.test(r[i].titel)) mc++; }
    if (al >= 3) return r;
    PLEK.forEach(function (plek) {
      if (al >= 3 || plek >= r.length) return;
      if (fanLamp(r[plek])) return;
      for (var j = plek + 1; j < r.length; j++) {
        var p = r[j]; if (!fanLamp(p)) continue;
        if (/minecraft/i.test(p.titel)) { if (mc >= 2) continue; mc++; }
        r.splice(j, 1); r.splice(plek, 0, p); al++; return;
      }
    });
    return r;
  }

  /* OPERATIE CADEAUZIEL FASE 2 (24-11-2026, opdracht Dark Nova; Marius: 'plaats ze zoals er staat'). De opening (eerste 24) per pagina en per afdeling
     van een straatwinkel, zoals Nova ze koos (assets/js/cadeauziel.js, gemaakt door scripts/cadeauziel/maak.js). Alleen voor bezoekers: de app roept dit
     alleen aan in de winkelweergave en de straat (WIJZER b, kaal adres), dus zoekmachines en de Google-versie van de bouw houden de gewone volgorde.
     Alleen volgorde: een cadeau dat niet (meer) in de lijst staat (uitverkocht, regel, ander bedrag) wordt overgeslagen, er komt nooit iets bij van een andere pagina.
     Zelf vergelijken: ?proef=cadeauziel-uit (in dat tabblad; weer aan: ?proef=cadeauziel). Helemaal uit: window.LK_CADEAUZIEL_FASE2 = false. */
  var CZ = (function () {
    var AAN = (function () { try { var q = location.search; if (/[?&]proef=cadeauziel-uit(&|$)/.test(q)) sessionStorage.setItem('lkcz', '0'); else if (/[?&]proef=cadeauziel(&|$)/.test(q)) sessionStorage.removeItem('lkcz');
      return window.LK_CADEAUZIEL_FASE2 !== false && sessionStorage.getItem('lkcz') !== '0'; } catch (e) { return window.LK_CADEAUZIEL_FASE2 !== false; } })();
    function sleutel(pad) {
      var p = String(pad || location.pathname), q = '';
      var h = p.indexOf('?'); if (h !== -1) { q = p.slice(h); p = p.slice(0, h); }
      p = p.replace(/\/index\.html$/, '').replace(/\/+$/, '') || '/';
      var v = /[?&]voor=([a-z-]+)/.exec(q); return v ? p + '?voor=' + v[1] : p;
    }
    function ids(pad) { var D = window.LK_CADEAUZIEL; return AAN && D && D.p ? D.p[sleutel(pad)] || null : null; }
    function orde(l, lijstIds) {
      if (!lijstIds || !lijstIds.length || !l || !l.length) return l;
      var plek = {}; l.forEach(function (p, i) { if (plek[p.id] === undefined) plek[p.id] = i; });
      var voor = [], g = {};
      lijstIds.forEach(function (id) { var i = plek[id]; if (i !== undefined && !g[id]) { g[id] = 1; voor.push(l[i]); } });
      if (!voor.length) return l;
      return voor.concat(l.filter(function (p) { return !g[p.id]; }));
    }
    function pagina(l, pad) { return lampErin(orde(l, ids(pad))); }
    function schap(l, winkel, naam) { var D = window.LK_CADEAUZIEL; return lampErin(AAN && D && D.s && D.s[winkel] ? orde(l, D.s[winkel][naam]) : l); }
    return { aan: function () { return AAN && !!window.LK_CADEAUZIEL; }, ids: ids, orde: orde, pagina: pagina, schap: schap, sleutel: sleutel };
  })();

  window.LK = {
    leesKeuringen: leesKeuringen, bewaarKeuringen: bewaarKeuringen, vergeetCache: vergeetCache,
    producten: producten, zichtbaar: zichtbaar, vind: vind, hoortBij: hoortBij, isNieuw: isNieuw,
    favorieten: favorieten, isFavoriet: isFavoriet, wisselFavoriet: wisselFavoriet,
    esc: esc, euro: euro, icoon: icoon, productBeeld: productBeeld, productKaart: productKaart, zachtAf: zachtAf, nova: NOVA, cz: CZ, lampErin: lampErin, fanLamp: fanLamp
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
  /* COMBI (22-11-2026, voorbeeld; Marius: 'ik mis ook nog zoveel dagen tot Black Friday, Sinterklaas en kerst'): drie aftellers naast elkaar,
     elk in zijn eigen donkere kleur en elk een link. Een feest dat voorbij is valt weg. */
  if (/(^| )combi( |$)/.test(document.documentElement.className)) {
    var feesten = [[Date.UTC(jaar, 10, 27), 'bf', 'Black Friday', '/collectie/black-friday', Date.UTC(jaar, 10, 20)],
      [sint, 'sint', 'Pakjesavond', '/c/cadeaus/sinterklaas', start], [kerst, 'kerst', 'Kerst', '/c/cadeaus/kerst', start]].filter(function (f) { return nu >= f[4] && nu <= f[0]; });
    if (!feesten.length) return;
    var a3 = document.createElement('div'); a3.className = 'aftel aftel3'; a3.setAttribute('data-aftel', ''); a3.setAttribute('role', 'navigation'); a3.setAttribute('aria-label', 'Aftellen');
    a3.innerHTML = feesten.map(function (f) {
      var d = Math.round((f[0] - nu) / dag);
      return '<a class="a3 a3-' + f[1] + '" href="' + f[3] + '"><span class="a3-r">' + (d === 0 ? '<small>Vandaag is het</small>' : '<span class="a3-getal">' + d + '</span><small>' + (d === 1 ? 'dag tot' : 'dagen tot') + '</small>') +
        '</span><b>' + f[2] + '</b></a>';
    }).join('');
    el.parentNode.replaceChild(a3, el);
    document.documentElement.classList.add('met-aftel');
    return;
  }
  /* Sinds COMBI voor iedereen staan de drie aftellers al in de gebouwde pagina (een div). Wie COMBI uit heeft gezet krijgt hier weer de ene balk (een link). */
  if (el.tagName !== 'A') { var a1 = document.createElement('a'); a1.setAttribute('data-aftel', ''); a1.hidden = true; el.parentNode.replaceChild(a1, el); el = a1; }
  /* Stap 1 indeling (6-11-2026, GO Marius): van 20 t/m 27 november is Black Friday de boodschap (27-11-2026). Daarna weer Sinterklaas, vanaf 6 december Kerst. */
  var bf = Date.UTC(jaar, 10, 27), bfStart = Date.UTC(jaar, 10, 20);
  if (nu >= bfStart && nu <= bf) {
    thema = 'bf'; n = Math.round((bf - nu) / dag); link = '/collectie/black-friday';
    tekst = n === 0 ? '<span class="aftel-zin">Vandaag is het <b>Black Friday!</b></span>'
      : n === 1 ? '<span class="aftel-zin">Morgen is het <b>Black Friday!</b></span>'
      : '<span class="aftel-zin">Nog <span class="aftel-getal">' + n + '</span> dagen tot Black Friday</span>';
  } else if (nu <= sint) {
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
    '<span class="aftel-midden">' + tekst + '<span class="aftel-knop">' + (thema === 'sint' ? 'Sinterklaascadeaus' : thema === 'bf' ? 'Bekijk de deals' : 'Kerstcadeaus') + ' →</span></span>' +
    '<span class="aftel-beeld rechts" aria-hidden="true"></span>';
  el.setAttribute('aria-label', el.querySelector('.aftel-zin').textContent + '. Bekijk de ' + (thema === 'sint' ? 'Sinterklaascadeaus' : thema === 'bf' ? 'Black Friday deals' : 'kerstcadeaus'));
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
