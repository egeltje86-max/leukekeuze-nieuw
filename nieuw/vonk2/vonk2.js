/* VONK 2.0, testversie (23-11-2026, opdracht Nova via Marius). Zie de uitleg bovenin index.html. */
(function () {
  'use strict';
  /* ---------- gegevens ---------- */
  var ALLES = (window.LK_PRODUCTEN || []).filter(function (p) { return p.status === 'goedgekeurd' && p.beeld && !p.stil; });
  var PER = {}; ALLES.forEach(function (p) { PER[p.id] = p; });
  var TOP = window.LK_TOPVAST || {};
  var VW = {}; ((window.LK_VOORWIE || {}).personen || []).forEach(function (p) { VW[p.slug] = p; });
  var PERS = {}; (window.LK_PERSONEN || []).forEach(function (p) { PERS[p.slug] = p; });
  var RONDJE = window.V2_RONDJE || {};
  var PRODUCT = '/' + 'p/';   /* productpagina; los geschreven zodat de linkcontrole het niet als kapotte link telt */

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function euro(n) { var s = Number(n).toFixed(2).split('.'); return '€\u00a0' + s[0] + ',' + s[1]; }
  function klein(t) { return String(t).replace(/^([A-Z])([a-zë])/, function (m, a, b) { return a.toLowerCase() + b; }); }
  function euroKort(n) { return Math.round(n) === n ? '€\u00a0' + n : euro(n); }
  function tel(pad) { try { if (window.goatcounter && window.goatcounter.count) window.goatcounter.count({ path: 'vonk2/' + pad, title: 'VONK 2.0', event: true }); } catch (e) {} }

  /* Wie: de ontvangers van Nova, gekoppeld aan de Voor wie-pagina's van de site */
  var WIE = [
    { id: 'vader', naam: 'Vader', p: 'hem', hij: 'hij', zijn: 'je vader', beeld: 'voor-hem', smal: /ouder|papa|vader/ },
    { id: 'moeder', naam: 'Moeder', p: 'haar', hij: 'zij', zijn: 'je moeder', beeld: 'voor-haar', smal: /ouder|mama|moeder/ },
    { id: 'vriend', naam: 'Partner of vriend', p: 'hem', hij: 'hij', zijn: 'hem', beeld: 'voor-hem' },
    { id: 'vriendin', naam: 'Partner of vriendin', p: 'haar', hij: 'zij', zijn: 'haar', beeld: 'voor-haar' },
    { id: 'opa', naam: 'Opa', p: 'opa-oma', hij: 'hij', zijn: 'opa', beeld: 'voor-opa-oma', g: 'hem' },
    { id: 'oma', naam: 'Oma', p: 'opa-oma', hij: 'zij', zijn: 'oma', beeld: 'voor-opa-oma', g: 'haar' },
    { id: 'kind', naam: 'Kind', p: 'kinderen', hij: 'het kind', zijn: 'het kind', beeld: 'voor-kinderen', kind: true },
    { id: 'tiener', naam: 'Tiener', p: 'tieners', hij: 'de tiener', zijn: 'de tiener', beeld: 'voor-tieners' },
    { id: 'baby', naam: 'Baby', p: 'baby', hij: 'de baby', zijn: 'de baby', beeld: 'voor-baby' },
    { id: 'collega', naam: 'Collega', p: 'collega', hij: 'je collega', zijn: 'je collega', beeld: 'voor-collega' },
    { id: 'iemand', naam: 'Iemand anders', p: '', hij: 'diegene', zijn: 'diegene', beeld: 'voor-iedereen' }
  ];
  var LEEFTIJD = [{ id: '0-2', n: '0 tot 2 jaar', van: 0, tot: 2 }, { id: '3-5', n: '3 tot 5 jaar', van: 3, tot: 5 }, { id: '6-8', n: '6 tot 8 jaar', van: 6, tot: 8 }, { id: '9-12', n: '9 tot 12 jaar', van: 9, tot: 12 }];
  var BUDGET_SNEL = [10, 15, 25, 50, 100];
  var VERRAS = [
    { id: 'vertrouwd', ico: '🎁', n: 'Vertrouwd', o: 'Iets waarvan je weet dat het gebruikt wordt.' },
    { id: 'verrassend', ico: '✨', n: 'Verrassend', o: 'Origineel, maar het past wel.' },
    { id: 'onverwacht', ico: '🎉', n: 'Helemaal onverwacht', o: 'Iets bijzonders waar die persoon zelf niet aan denkt.' }
  ];
  var MOMENT = [{ id: 'sinterklaas', n: 'Sinterklaas' }, { id: 'kerst', n: 'Kerst' }, { id: 'verjaardag', n: 'Verjaardag' }, { id: 'zomaar', n: 'Zomaar' }];
  var SEIZOEN_SUB = { sinterklaas: 1 };

  /* Lijsten die bij elke ontvanger kunnen: om te lachen, origineel en met naam (handgekozen toppen en labels van de site) */
  function topIds(k) { return (TOP[k] || []).filter(function (id) { return PER[id]; }); }
  var GRAP = new Set(topIds('/collectie/grappige-cadeaus'));
  ALLES.forEach(function (p) { if ((p.ookIn || []).indexOf('cadeaus/grappig') !== -1) GRAP.add(p.id); });
  var ORIG = new Set(topIds('/collectie/originele-cadeaus').concat(topIds('/collectie/toppers-van-nu')));
  var PERSOONLIJK = new Set(topIds('/collectie/persoonlijke-cadeaus'));
  ALLES.forEach(function (p) { if ((p.ookIn || []).indexOf('cadeaus/met-naam') !== -1 || (p.soort || []).indexOf('persoonlijk') !== -1) PERSOONLIJK.add(p.id); });

  function rondVan(beeld) {
    if (!beeld) return '/images/sub/rond/voor-iedereen-klein.webp';
    var m = /^images\/sub\/sub-(.+)\.webp$/.exec(beeld);
    if (m && RONDJE[m[1]]) return '/images/sub/' + RONDJE[m[1]] + '-klein.webp';
    if (/^images\/sub\/(rond|iconen)\//.test(beeld)) return '/' + beeld.replace(/\.webp$/, '-klein.webp');
    return '/' + beeld;
  }
  /* Interesses: de onderwerpen van de Voor wie-pagina van die persoon, plus 'Om te lachen' en 'Met naam of foto'. */
  var INT_CACHE = {};
  function interesses(w) {
    var sleutel = w ? w.id : '';
    if (INT_CACHE[sleutel]) return INT_CACHE[sleutel];
    var uit = [];
    var vw = w && w.p && VW[w.p], pd = w && w.p && PERS[w.p];
    if (vw) vw.subs.forEach(function (s) {
      if (SEIZOEN_SUB[s.slug] || s.ids.length < 8) return;
      var ps = pd && (pd.subs || []).filter(function (x) { return x.slug === s.slug; })[0];
      uit.push({ id: s.slug, n: s.naam, ids: new Set(s.ids), beeld: rondVan(ps && ps.beeld) });
    });
    /* Brede interesses van Nova (tuinieren, sport, koken ...) die de Voor wie-pagina zelf niet als onderwerp heeft:
       uit de cadeaus van díe persoon in die afdeling, alleen als er genoeg zijn. */
    if (vw && w.p !== 'baby') {
      var pool = vw.ids.map(function (id) { return PER[id]; }).filter(Boolean);
      [['tuin', 'Tuin & natuur', 'tuin-klussen', /tuin/i], ['sport', 'Sport & buiten', 'sport-outdoor', /sport/i], ['koken', 'Koken & tafelen', 'koken-tafelen', /keuken|koken/i],
       ['muziek', 'Muziek & boeken', 'boeken-media', /boek|muziek/i], ['spellen', 'Spellen & puzzels', 'spellen-puzzels', /spel|puzzel/i], ['gadgets', 'Gadgets & techniek', 'elektronica', /gadget|gaming|audio/i],
       ['verwennen', 'Verwennen', 'beauty-verzorging', /parfum|verzorging|geur|skincare/i], ['hobby', 'Hobby & creatief', 'hobby', /creatief|haken|knutsel/i]].forEach(function (a) {
        if (vw.subs.some(function (s) { return a[3].test(s.naam); })) return;
        var ids = pool.filter(function (p) { return p.afd === a[2] && !(a[0] === 'tuin' && p.groep === 'klussen'); }).map(function (p) { return p.id; });
        if (ids.length >= 8) uit.push({ id: a[0], n: a[1], ids: new Set(ids), beeld: '/images/categorieen/rond/cat-' + a[2] + '.webp' });
      });
    }
    if (!vw) {
      [['wonen', 'Wonen & sfeer'], ['eten-drinken', 'Lekker eten'], ['spellen-puzzels', 'Spellen & puzzels'], ['elektronica', 'Gadgets & techniek'],
       ['sport-outdoor', 'Sport & buiten'], ['beauty-verzorging', 'Verzorging'], ['boeken-media', 'Boeken & muziek'], ['hobby', 'Hobby & creatief']]
        .forEach(function (a) { var ids = new Set(ALLES.filter(function (p) { return p.afd === a[0] && !p.drank; }).map(function (p) { return p.id; })); uit.push({ id: a[0], n: a[1], ids: ids, beeld: '/images/categorieen/rond/cat-' + a[0] + '.webp' }); });
    }
    if (w && w.p !== 'baby') uit.push({ id: 'lachen', n: 'Om te lachen', ids: GRAP, beeld: '/images/sub/rond/col-grappige-cadeaus-klein.webp' });
    if (!vw || !vw.subs.some(function (s) { return /naam/.test(s.slug); })) uit.push({ id: 'met-naam', n: 'Met naam of foto', ids: PERSOONLIJK, beeld: '/images/sub/rond/col-persoonlijke-cadeaus-klein.webp' });
    INT_CACHE[sleutel] = uit;
    return uit;
  }

  /* ---------- toestand ---------- */
  var LEEG = { stap: 0, wie: '', lft: '', int: [], max: 50, geen: false, vr: 'verrassend', mom: '', vrij: '', richting: '', extraMax: 0, gezien: [], zoals: [], nietVak: [] };
  var S = JSON.parse(JSON.stringify(LEEG));
  (function leesHash() {
    var h = location.hash.replace(/^#/, ''); if (!h) return;
    h.split('&').forEach(function (kv) { var a = kv.split('='), k = a[0], v = decodeURIComponent(a[1] || '');
      if (k === 'wie') S.wie = v; if (k === 'lft') S.lft = v; if (k === 'int') S.int = v ? v.split(',') : []; if (k === 'max') { if (v === 'geen') S.geen = true; else S.max = +v || 50; }
      if (k === 'vr') S.vr = v; if (k === 'mom') S.mom = v; });
    if (S.wie && WIE.some(function (w) { return w.id === S.wie; })) S.stap = 5; else S.wie = '';
  })();
  function hashVan() {
    var d = ['wie=' + S.wie]; if (S.lft) d.push('lft=' + S.lft); if (S.int.length) d.push('int=' + S.int.join(',')); d.push('max=' + (S.geen ? 'geen' : S.max)); d.push('vr=' + S.vr); if (S.mom) d.push('mom=' + S.mom);
    return '#' + d.join('&');
  }
  function wieVan() { return WIE.filter(function (w) { return w.id === S.wie; })[0]; }

  /* ---------- kiezen ---------- */
  var KERSTW = /kerst|christmas|xmas|rendier|kerstman|sneeuwpop|advent/i, SINTW = /sinterklaas|\bsint\b|\bpiet|pakjesavond|schoencadeau|chocoladeletter|kruidnoot|pepernoot|speculaas/i;
  function kmAftrek(p, pe) {
    if (!p.km || !pe) return 0;
    if (!p._km) { var o = {}; String(p.km).split(',').forEach(function (x) { var m = /^(z?[gpx]\.[a-z_-]+?)(-?\d+)$/.exec(x); if (m) o[m[1]] = +m[2]; }); p._km = o; }
    return p._km['p.' + pe] || 0;
  }
  function kmG(p, g) { if (!p.km) return 0; kmAftrek(p, 'x'); return (p._km || {})['g.' + g] || 0; }
  function leeftijdPast(p, l) { if (!l) return true; var a = p.leeftijd; if (!a) return l.van >= 3; return a[0] <= l.tot && a[1] >= l.van; }
  function soort(p, s) { return (p.soort || []).indexOf(s) !== -1; }
  function woorden2(t) { return String(t).toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter(function (x) { return x.length > 3; }).slice(0, 2).join(' '); }
  function lijktOp(a, b) { return a.vak === b.vak || woorden2(a.titel) === woorden2(b.titel) || (a.merk && a.merk === b.merk && a.groep === b.groep); }
  /* De basis: alles wat op de Voor wie-pagina van die persoon staat (zelfde regels als de site), binnen budget en leeftijd. */
  function basis(maxPrijs) {
    var w = wieVan(), vw = w && w.p && VW[w.p];
    var lijst = vw ? vw.ids.map(function (id) { return PER[id]; }).filter(Boolean) : ALLES.filter(function (p) { return (p.voor || []).indexOf('iedereen') !== -1; });
    var l = LEEFTIJD.filter(function (x) { return x.id === S.lft; })[0];
    var drankMag = S.int.some(function (i) { return /drank|bier|wijn/.test(i); }) || /\b(bier|wijn|whisk|gin|drank|borrel)/i.test(S.vrij);
    return lijst.filter(function (p) {
      if (!(maxPrijs === Infinity || p.prijs <= maxPrijs)) return false;           /* budget is heilig */
      if (p.drank && !drankMag) return false;                                     /* drank alleen als je erom vraagt */
      if (w && w.p && kmAftrek(p, w.p) >= 26) return false;                        /* de keurmeester */
      if (w && w.p === 'collega' && (kmG(p, 'bedankt') >= 26 || kmG(p, 'lootjes') >= 26)) return false;   /* collega = bedankje of lootje */
      if (p.smal && /ouder|papa|mama|opa|oma/.test(p.smal) && !(w && w.smal && w.smal.test(p.smal)) && !(w && w.p === 'opa-oma' && /opa|oma/.test(p.smal))) return false;
      if (w && w.kind && !leeftijdPast(p, l)) return false;
      if (S.nietVak.indexOf(p.vak) !== -1) return false;                            /* 'Niet dit soort' */
      if (S.mom === 'sinterklaas' && KERSTW.test(p.titel)) return false;
      if (S.mom === 'kerst' && SINTW.test(p.titel)) return false;
      return true;
    });
  }
  function punten(p, ctx) {
    var n = 0, w = wieVan();
    var raak = ctx.ints.filter(function (i) { return i.ids.has(p.id); }).length;
    if (raak) n += 6 + 1.5 * (raak - 1);
    var top = ctx.top[p.id];                                                     /* handgekozen top van die persoon */
    if (top !== undefined) n += top < 12 ? 3 : top < 36 ? 2 : 1;
    if (p.favoriet) n += 1; if (p.populair) n += 1; if (p.zk) n += 0.5;
    var vr = ctx.vr;
    if (vr === 'vertrouwd') { if (soort(p, 'praktisch')) n += 2; if (GRAP.has(p.id)) n -= 2; if (soort(p, 'origineel')) n -= 0.5; if (top !== undefined) n += 1.5; }
    if (vr === 'verrassend') { if (soort(p, 'origineel')) n += 2; if (ORIG.has(p.id)) n += 1.5; if (p.zk) n += 1; }
    if (vr === 'onverwacht') { if (soort(p, 'origineel')) n += 3; if (ORIG.has(p.id) || GRAP.has(p.id)) n += 2; if (p.zk) n += 1.5; if (top !== undefined && top < 12) n -= 1.5; }
    if (ctx.richting === 'origineler') { if (soort(p, 'origineel') || ORIG.has(p.id)) n += 3; if (soort(p, 'praktisch')) n -= 1; }
    if (ctx.richting === 'praktischer') { if (soort(p, 'praktisch')) n += 3; if (GRAP.has(p.id)) n -= 2; }
    if (ctx.richting === 'persoonlijker' && PERSOONLIJK.has(p.id)) n += 6;
    if (ctx.zoals.length) ctx.zoals.forEach(function (z) {           /* 'Meer zoals dit': zelfde vakje, groep of merk telt mee */
      if (p.vak === z.vak) n += 5; else if (p.groep === z.groep) n += 2.5;
      if (p.merk && p.merk === z.merk) n += 1.5;
      if (ctx.ints.some(function (i) { return i.ids.has(p.id) && i.ids.has(z.id); })) n += 1; });
    if (S.mom && (p.moment || []).indexOf(S.mom) !== -1) n += 1;
    if (ctx.max !== Infinity) { var r = p.prijs / ctx.max; if (r >= 0.4) n += 1.5; else if (r < 0.15) n -= 1; }
    if (ctx.woorden.length) { var t = (p.titel + ' ' + (p.merk || '') + ' ' + (p.kort || '')).toLowerCase(); ctx.woorden.forEach(function (x) { if (t.indexOf(x) !== -1) n += 4; }); }
    if (w && w.g === 'haar' && /\b(heren|mannen)\b/i.test(p.titel)) n -= 2;
    if (w && w.g === 'hem' && /\b(dames|vrouwen)\b/i.test(p.titel)) n -= 2;
    if (p.shop === 'bol') n -= 0.3;
    return n;
  }
  /* Kies drie cadeaus die verschillen (ander vakje, liefst andere interesse) en die je in deze ronde nog niet zag. */
  function kies() {
    var w = wieVan(), ints = interesses(w).filter(function (i) { return S.int.indexOf(i.id) !== -1; });
    var max = S.geen ? Infinity : S.max;
    if (S.richting === 'goedkoper' && S.extraMax) max = Math.min(max, S.extraMax);
    var richtInt = /^meer:/.test(S.richting) ? S.richting.slice(5) : '';
    var lijst = basis(max), gezien = new Set(S.gezien);
    var vers = lijst.filter(function (p) { return !gezien.has(p.id); });
    var top = {}; (TOP['/voor/' + (w && w.p)] || []).forEach(function (id, i) { if (top[id] === undefined) top[id] = i; });
    var woorden = String(S.vrij || '').toLowerCase().split(/[^a-z0-9à-ü]+/).filter(function (x) { return x.length > 3 && !/^(houdt|graag|heel|veel|leuk|leuke|mooi|iets|niet|voor|zijn|haar|hem|van|een|die|dat|ook|drinkt|speelt|heeft)$/.test(x); })
      .map(function (x) { return x.replace(/(en|s)$/, ''); });
    var zoals = S.zoals.map(function (id) { return PER[id]; }).filter(Boolean);
    var ctx = { ints: ints, top: top, vr: S.vr, richting: S.richting, max: max, woorden: woorden, zoals: zoals };
    var binnen = function (p) { return !ints.length || ints.some(function (i) { return i.ids.has(p.id); }); };
    var ri = richtInt && ints.filter(function (i) { return i.id === richtInt; })[0];
    if (ri) binnen = function (p) { return ri.ids.has(p.id); };
    if (S.richting === 'persoonlijker') { var oud = binnen; binnen = function (p) { return oud(p) && PERSOONLIJK.has(p.id); }; }
    var scoor = function (l) { return l.map(function (p) { return [p, punten(p, ctx)]; }).sort(function (a, b) { return b[1] - a[1]; }); };
    var kern = scoor(vers.filter(binnen)), wild = scoor(vers.filter(function (p) { return !binnen(p); }));
    var keus = [], melding = '';
    var magErbij = function (p) { return keus.every(function (k) { return !lijktOp(k[0], p); }); };
    var welkeInt = function (p) { return ints.filter(function (i) { return i.ids.has(p.id); }).map(function (i) { return i.id; })[0] || ''; };
    /* 1. Bij 'Helemaal onverwacht' twee uit de interesses en één daarbuiten, anders drie uit de interesses */
    var aantalKern = S.vr === 'onverwacht' && !S.richting && ints.length ? 2 : 3;
    if (ints.length > 1 && !ri) ints.forEach(function (i) {
      if (keus.length >= aantalKern) return;
      var x = kern.filter(function (k) { return i.ids.has(k[0].id) && magErbij(k[0]); })[0]; if (x) keus.push(x);
    });
    kern.forEach(function (k) { if (keus.length < aantalKern && keus.indexOf(k) === -1 && magErbij(k[0])) keus.push(k); });
    var vulBuiten = function (eis) { wild.forEach(function (k) { if (keus.length < 3 && keus.indexOf(k) === -1 && magErbij(k[0]) && eis(k[0])) { k.wild = true; keus.push(k); } }); };
    if (keus.length < 3 && !(ri || S.richting === 'persoonlijker')) {
      vulBuiten(function (p) { return S.vr !== 'onverwacht' || soort(p, 'origineel') || ORIG.has(p.id) || GRAP.has(p.id); });
      vulBuiten(function () { return true; });
    }
    var tekort = keus.length < 3;
    if (!keus.length) melding = 'Binnen deze keuzes heeft VONK geen nieuwe cadeaus meer. Kies een andere richting, verhoog je budget of pas je antwoorden aan.';
    else if (tekort) melding = 'VONK vond er nu ' + keus.length + ' die echt passen en die je nog niet zag. Liever niet aanvullen met iets wat niet past: kies hieronder een andere richting of verhoog je budget.';
    else if (S.vr !== 'onverwacht' && keus.some(function (k) { return k.wild; })) melding = 'Er waren niet genoeg nieuwe cadeaus binnen de gekozen interesses, dus VONK koos er ook een daarbuiten.';
    var fav = keus.length >= 2 && keus[0][1] - Math.max.apply(null, keus.slice(1).map(function (k) { return k[1]; })) >= 1.5 ? keus[0][0].id : '';
    return { drie: keus.map(function (k) { return { p: k[0], s: k[1], wild: !!k.wild, int: welkeInt(k[0]) }; }), ints: ints, max: max, melding: melding, fav: fav, aantal: lijst.length };
  }
  /* Waarom past het? Alleen echte feiten uit onze eigen gegevens, niets verzonnen. */
  function waarom(x, U) {
    var p = x.p, w = wieVan(), r = [];
    var i = U.ints.filter(function (q) { return q.id === x.int; })[0];
    if (i) r.push('Past bij ' + klein(i.n) + '.');
    else if (x.wild && S.vr === 'onverwacht') r.push('Buiten de gekozen interesses: iets waar ' + (w ? w.hij : 'diegene') + ' zelf niet snel aan denkt.');
    if (U.max !== Infinity) r.push(euro(p.prijs) + ', binnen je budget van ' + euroKort(U.max) + '.');
    var t = (TOP['/voor/' + (w && w.p)] || []).indexOf(p.id);
    if (t !== -1 && t < 36) r.push('Met de hand gekozen voor onze pagina ' + (PERS[w.p] ? PERS[w.p].naam : '') + '.');
    else if (PERSOONLIJK.has(p.id) && S.richting === 'persoonlijker') r.push('Je maakt het persoonlijk met een naam, tekst of foto.');
    else if (soort(p, 'origineel') || ORIG.has(p.id)) r.push('Origineel: niet iets wat je in elke winkel ziet.');
    else if (soort(p, 'praktisch')) r.push('Praktisch: iets dat echt gebruikt wordt.');
    var k = p.kort || (p.waarom ? (String(p.waarom).match(/^[^.!?]{10,}[.!?]/) || [''])[0] : '');
    if (k && r.length < 4) r.push(k.length > 120 ? k.slice(0, 116).replace(/\s+\S*$/, '') + '…' : k);
    return r.slice(0, 4);
  }

  /* ---------- in één zin (geen AI: woordenlijsten, kost niets) ---------- */
  var ZIN_WIE = [[/\b(opa|grootvader|opi)\b/, 'opa'], [/\b(oma|grootmoeder|omi)\b/, 'oma'], [/\b(collega|baas|leidinggevende|manager|juf|meester)\b/, 'collega'],
    [/\b(baby|pasgeboren|kraam|kraamcadeau|newborn)\b/, 'baby'], [/\b(tiener|puber|tienerzoon|tienerdochter)\b/, 'tiener'],
    [/\b(zoon|zoontje|dochter|dochtertje|kind|kindje|neefje|nichtje|kleinkind|kleinzoon|kleindochter|jongen|jongetje|meisje|petekind)\b/, 'kind'],
    [/\b(vader|papa|pa|schoonvader)\b/, 'vader'], [/\b(moeder|mama|ma|schoonmoeder)\b/, 'moeder'],
    [/\b(man|vriend|echtgenoot|partner|broer|zwager|oom|buurman)\b/, 'vriend'], [/\b(vrouw|vriendin|echtgenote|zus|schoonzus|tante|buurvrouw)\b/, 'vriendin']];
  var ZIN_INT = [[/tuin|tuinier|planten|bloemen|vogel|natuur/, /tuin|bloemen|natuur/], [/voetbal|sport|fiets|wielren|hardlo|fitness|golf|tennis|padel|zwem|yoga/, /sport/],
    [/dart/, /dart/], [/bbq|barbecue|vlees|grill/, /bbq/], [/kook|koken|keuken|bakken|bakt/, /keuken|koken/], [/lees|lezen|boek|roman/, /boek/],
    [/muziek|vinyl|platen|gitaar|radio/, /muziek|radio/], [/game|gamen|gamer|gaming|playstation|ps5|switch|xbox|nintendo/, /gaming|gadgets/],
    [/lego|bouwen/, /lego|bouwen/], [/puzzel|spel|spelletje/, /puzzel|spel/], [/knutsel|creatief|haken|breien|tekenen|schilder/, /creatief|knutsel|haken|hobby/],
    [/parfum|geur|verzorging|verwen|skincare|make-?up|wellness|spa/, /parfum|verzorging|geuren|verwennen/], [/kaars|sfeer|interieur|wonen/, /wonen|sfeer|kamer/],
    [/koffie|thee/, /koffie|keuken/], [/snoep|chocola|lekker|zoetekauw|drop/, /lekker/], [/grap|humor|lachen|grappig|lol/, /lachen/],
    [/bier|wijn|whisk|gin|drank|borrel|cocktail/, /glazen|drank|bar|lekkers/], [/foto|herinnering/, /foto|naam/], [/naam|persoonlijk|gegraveerd/, /naam/],
    [/horloge/, /horloge/], [/sieraa|ketting|oorbel|armband/, /sieraden/], [/pantoffel|slof|warm|knus|plaid/, /pantoffel|warm|kleding/], [/uitje|belevenis|dagje|ervaring/, /belevenis/]];
  function leesZin(zin) {
    var t = ' ' + zin.toLowerCase().replace(/[,.!?;:]/g, ' ') + ' ', m, uit = {};
    ZIN_WIE.some(function (r) { var mm = r[0].exec(t); if (mm) { uit.wie = r[1]; uit.woord = mm[1]; return true; } return false; });
    if ((m = t.match(/\b(\d{1,2})\s*(jaar|jr)\b|\bwordt (\d{1,2})\b|\bvan (\d{1,2})\b(?! ?(euro|eur))/))) {
      var jr = +(m[1] || m[3] || m[4]);
      if (jr <= 12 && (!uit.wie || uit.wie === 'kind' || uit.wie === 'vriend' || uit.wie === 'vriendin')) { uit.wie = jr <= 1 ? 'baby' : 'kind'; uit.lft = jr <= 2 ? '0-2' : jr <= 5 ? '3-5' : jr <= 8 ? '6-8' : '9-12'; }
      else if (jr >= 13 && jr <= 17 && (!uit.wie || uit.wie === 'kind')) uit.wie = 'tiener';
    }
    if ((m = t.match(/\b(max|maximaal|tot|onder|hooguit|budget|niet meer dan|rond|ongeveer)\s*(de\s*|een\s*|van\s*)?(€\s*)?(\d{1,4})/) || t.match(/€\s*(\d{1,4})/) || t.match(/\b(\d{1,4})\s*(euro|eur)\b/))) {
      var b = +(m[4] || m[1]); if (b >= 3 && b <= 2000) uit.max = /rond|ongeveer/.test(m[1] || '') ? Math.ceil(b * 1.15) : b;
    }
    if (/originee?l|bijzonder|verras|uniek|apart|gek\b/.test(t)) uit.vr = 'onverwacht'; else if (/praktisch|handig|nuttig|gebruik/.test(t)) uit.vr = 'vertrouwd';
    MOMENT.forEach(function (mo) { if (new RegExp(mo.id === 'sinterklaas' ? 'sinterklaas|\\bsint\\b|pakjesavond|schoen' : mo.id === 'verjaardag' ? 'verjaardag|jarig|wordt \\d' : mo.id).test(t)) uit.mom = uit.mom || mo.id; });
    var w = WIE.filter(function (x) { return x.id === (uit.wie || 'iemand'); })[0], ints = interesses(w), gekozen = [];
    ZIN_INT.forEach(function (r) { if (!r[0].test(t) || gekozen.length >= 3) return;
      var i = ints.filter(function (x) { return gekozen.indexOf(x.id) === -1 && r[1].test(x.id + ' ' + x.n.toLowerCase()); })[0]; if (i) gekozen.push(i.id); });
    uit.int = gekozen; uit.vrij = zin.slice(0, 120);
    return uit;
  }
  var BUDGET_STD = { vader: 50, moeder: 50, vriend: 50, vriendin: 50, opa: 25, oma: 25, kind: 25, tiener: 25, baby: 25, collega: 15, iemand: 25 };

  /* ---------- lijstje (zelfde bewaarplek als de site) ---------- */
  var K_FAV = 'lk-favorieten-v1';
  function favs() { try { return JSON.parse(localStorage.getItem(K_FAV) || '[]'); } catch (e) { return []; } }
  function wisselFav(id) { var f = favs(), i = f.indexOf(id); if (i === -1) f.push(id); else f.splice(i, 1); try { localStorage.setItem(K_FAV, JSON.stringify(f)); } catch (e) {} return i === -1; }
  var HART = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z"/></svg>';

  /* ---------- tekenen ---------- */
  var app = document.getElementById('app'), vast = document.getElementById('vast'), vastIn = document.getElementById('vastIn'), stapLabel = document.getElementById('stapLabel');
  function balk(n) { return '<div class="balk" aria-hidden="true"><i style="width:' + (n * 25) + '%"></i></div>'; }
  function terug() { return '<button type="button" class="terug" data-terug>‹ Vorige vraag</button>'; }
  function vastKnop(tekst, uit) { vast.hidden = false; vastIn.innerHTML = '<button type="button" class="goud vol" data-verder' + (uit ? ' disabled' : '') + '>' + tekst + '</button>'; }
  function teken(bovenaan) {
    vast.hidden = true; stapLabel.textContent = S.stap >= 1 && S.stap <= 4 ? 'Vraag ' + S.stap + ' van 4' : '';
    var w = wieVan(), h = '';
    if (S.stap === 0) {
      h = '<button type="button" class="held" data-verder aria-label="Start VONK"><img src="/images/vonk/vonk2-hero.webp" alt="VONK, jouw persoonlijke cadeauverrasser" width="1200" height="675"></button>' +
        '<div class="start-t"><h1>Jij kent de persoon. Ik vind het cadeau.</h1><p>Vier korte vragen, dan laat VONK drie cadeaus zien die echt passen. Niet goed? Laat VONK opnieuw zoeken in de richting die jij kiest.</p></div>' +
        '<form class="zin" id="zinForm"><label for="zinIn"><b>Of vertel het VONK in één zin</b></label><div class="zin-rij"><input id="zinIn" type="text" maxlength="120" autocomplete="off" placeholder="Bijv. mijn vader van 74 houdt van tuinieren en bier, max 50 euro"><button type="submit" class="goud">Zoek</button></div><p class="zin-uitleg">VONK haalt eruit voor wie, wat diegene leuk vindt en je budget. Daarna kun je alles nog aanpassen.</p></form>' +
        '<div class="stappen-uitleg"><div><b>1</b>Voor wie?</div><div><b>2</b>Waar wordt diegene blij van?</div><div><b>3</b>Wat mag het kosten?</div><div><b>4</b>Hoe verrassend?</div></div>';
      vastKnop('✦ Start VONK');
    }
    if (S.stap === 1) {
      h = balk(1) + '<div class="vraag"><h2>Voor wie zoeken we een cadeau?</h2><p class="uitleg">Tik er één aan.</p><div class="tegels">' + WIE.map(function (x) {
        return '<button type="button" class="tegel" data-wie="' + x.id + '" aria-pressed="' + (S.wie === x.id) + '"><img src="/images/sub/rond/' + x.beeld + '-klein.webp" alt="" width="58" height="58"><span class="n">' + esc(x.naam) + '</span></button>';
      }).join('') + '</div>' +
        (w && w.kind ? '<div class="leeftijd" id="lftBlok"><b>Hoe oud is het kind?</b><span class="uitleg">Mag je overslaan; dan kiest VONK cadeaus vanaf 3 jaar.</span><div class="chips">' + LEEFTIJD.map(function (l) { return '<button type="button" class="chip" data-lft="' + l.id + '" aria-pressed="' + (S.lft === l.id) + '">' + l.n + '</button>'; }).join('') + '</div></div>' : '') + '</div>';
      vastKnop('Volgende', !S.wie);
    }
    if (S.stap === 2) {
      var ints = interesses(w);
      h = balk(2) + terug() + '<div class="vraag"><h2>Waar wordt ' + esc(w ? w.zijn : 'diegene') + ' blij van?</h2><p class="uitleg">Kies er hooguit drie. Weet je het niet? Ga gewoon door, dan kiest VONK breed.</p><div class="tegels">' + ints.map(function (i) {
        return '<button type="button" class="tegel" data-int="' + i.id + '" aria-pressed="' + (S.int.indexOf(i.id) !== -1) + '"><img src="' + i.beeld + '" alt="" width="58" height="58"><span class="n">' + esc(i.n) + '</span></button>';
      }).join('') + '</div><p class="teller">' + (S.int.length ? S.int.length + ' van 3 gekozen' : '') + '</p></div>';
      vastKnop(S.int.length ? 'Volgende' : 'Weet ik niet, verras me');
    }
    if (S.stap === 3) {
      h = balk(3) + terug() + '<div class="vraag"><h2>Wat mag het kosten?</h2><p class="uitleg">VONK gaat nooit boven dit bedrag.</p><div class="budget"><div class="groot" id="bGetal"></div>' +
        '<div class="klein" id="bAantal"></div><input type="range" id="bSchuif" min="0" max="1000" value="' + (S.geen ? 1000 : naarSchuif(S.max)) + '" aria-label="Hoeveel mag het kosten?">' +
        '<div class="chips">' + BUDGET_SNEL.map(function (b) { return '<button type="button" class="chip" data-max="' + b + '">€ ' + b + '</button>'; }).join('') + '<button type="button" class="chip" data-max="geen">Maakt niet uit</button></div></div></div>';
      vastKnop('Volgende');
    }
    if (S.stap === 4) {
      h = balk(4) + terug() + '<div class="vraag"><h2>Hoe verrassend mag het zijn?</h2><p class="uitleg">Dit verandert echt welke cadeaus VONK kiest.</p><div class="verras">' + VERRAS.map(function (v) {
        return '<button type="button" class="vt" data-vr="' + v.id + '" aria-pressed="' + (S.vr === v.id) + '"><span class="ico" aria-hidden="true">' + v.ico + '</span><span><b>' + v.n + '</b><span>' + v.o + '</span></span></button>';
      }).join('') + '</div><details class="extra"' + (S.mom || S.vrij ? ' open' : '') + '><summary>Nog iets dat VONK mag weten? (mag je overslaan)</summary><b>Voor welk moment?</b><div class="chips">' + MOMENT.map(function (m) {
        return '<button type="button" class="chip" data-mom="' + m.id + '" aria-pressed="' + (S.mom === m.id) + '">' + m.n + '</button>'; }).join('') + '</div>' +
        '<label for="vrij"><b>Nog iets over ' + esc(w ? w.zijn : 'diegene') + '?</b></label><input type="text" id="vrij" maxlength="80" placeholder="Bijv. houdt van katten, drinkt veel koffie" value="' + esc(S.vrij) + '"></details></div>';
      vastKnop('✦ Laat VONK zoeken');
    }
    if (S.stap === 5) h = uitslag();
    app.innerHTML = h;
    if (S.stap === 3) schuifKoppel();
    if (bovenaan !== false) window.scrollTo(0, 0);
  }
  /* budgetschuif: € 5 tot € 200, kleine bedragen krijgen meer ruimte; helemaal rechts = maakt niet uit */
  function vanSchuif(v) { if (v >= 1000) return Infinity; var e = 5 * Math.pow(40, Math.min(v, 960) / 960); return e < 20 ? Math.round(e) : e < 60 ? Math.round(e / 5) * 5 : Math.round(e / 10) * 10; }
  function naarSchuif(x) { return Math.max(0, Math.min(960, Math.round(960 * Math.log(x / 5) / Math.log(40)))); }
  function schuifKoppel() {
    var s = document.getElementById('bSchuif'), g = document.getElementById('bGetal'), n = document.getElementById('bAantal');
    var alle = basis(Infinity), w = wieVan();
    var zet = function (vanKnop) {
      if (!vanKnop) { var m = vanSchuif(+s.value); S.geen = m === Infinity; if (!S.geen) S.max = m; }
      g.textContent = S.geen ? 'Maakt niet uit' : 'Tot ' + euroKort(S.max);
      var tal = alle.filter(function (p) { return S.geen || p.prijs <= S.max; }).length;
      n.textContent = tal + ' cadeaus voor ' + (w ? w.zijn : 'diegene') + ' binnen dit bedrag';
      [].forEach.call(document.querySelectorAll('[data-max]'), function (b) { var v = b.getAttribute('data-max'); b.setAttribute('aria-pressed', v === 'geen' ? S.geen : (!S.geen && +v === S.max)); });
    };
    s.addEventListener('input', function () { zet(false); });
    s._zet = zet; zet(true);
  }
  var UIT = null;
  function uitslag() {
    var w = wieVan();
    if (!UIT) { UIT = kies(); UIT.drie.forEach(function (x) { S.gezien.push(x.p.id); }); }
    var U = UIT, f = favs();
    var naamInts = U.ints.map(function (i) { return klein(i.n); });
    var lft = LEEFTIJD.filter(function (l) { return l.id === S.lft; })[0];
    var sam = 'Voor ' + esc(S.wieNaam || (w ? w.zijn : 'diegene')) + (lft ? ' (' + lft.n + ')' : '') +
      (naamInts.length ? ', die blij wordt van ' + esc(naamInts.join(', ').replace(/, ([^,]*)$/, ' en $1')) : '') + ', ' + (U.max === Infinity ? 'elk bedrag' : 'tot ' + euroKort(U.max)) + ', ' + VERRAS.filter(function (v) { return v.id === S.vr; })[0].n.toLowerCase() + '.';
    var RICHT = { origineler: 'Nog origineler', praktischer: 'Praktischer', persoonlijker: 'Persoonlijker', goedkoper: 'Goedkoper' };
    var zo = S.richting === 'zoals' && PER[S.zoals[0]];
    var rnaam = zo ? 'Meer zoals ' + zo.titel : /^meer:/.test(S.richting) ? 'Meer ' + klein((U.ints.filter(function (i) { return 'meer:' + i.id === S.richting; })[0] || {}).n || '') : RICHT[S.richting];
    var n = U.drie.length;
    var h = '<div class="uk"><img src="/images/vonk/vonk2-duim.webp" alt="" width="120" height="76"><div><h1>' + (n ? 'VONK heeft <em>' + (n === 1 ? '1 verrassing' : n + ' verrassingen') + '</em> voor je gevonden!' : 'VONK zoekt verder') + '</h1><p>' + sam + '</p></div></div>';
    if (S.begrepen) h += '<div class="begrepen"><b>VONK begreep:</b> ' + esc(S.begrepen) + ' <button type="button" class="link" data-wijzig>Klopt niet? Pas aan</button></div>';
    if (rnaam) h += '<p style="margin:12px 0 0"><span class="richting">Nieuwe ronde: ' + esc(rnaam.length > 70 ? rnaam.slice(0, 66) + '…' : rnaam) + '</span></p>';
    if (U.melding) h += '<div class="melding">' + esc(U.melding) + '</div>';
    h += '<div class="drie">' + U.drie.map(function (x) {
      var p = x.p, op = f.indexOf(p.id) !== -1, link = PRODUCT + encodeURIComponent(p.id) + '/';
      return '<article class="kaart">' + (U.fav === p.id ? '<span class="fav">✦ VONK\'s favoriet</span>' : '') +
        '<button type="button" class="hart" data-hart="' + esc(p.id) + '" aria-pressed="' + op + '" aria-label="' + (op ? 'Van je lijstje halen' : 'Op je lijstje zetten') + '">' + HART + '</button>' +
        '<a class="foto" href="' + link + '" data-klik="' + esc(p.id) + '"><img src="/' + esc(p.beeld) + '.webp" alt="' + esc(p.titel) + '" loading="lazy"></a>' +
        '<div class="in"><h3>' + esc(p.titel) + '</h3><div class="pr"><b>' + euro(p.prijs) + '</b><span>bij ' + esc(p.shop) + '</span></div><ul>' + waarom(x, U).map(function (z) { return '<li>' + esc(z) + '</li>'; }).join('') + '</ul>' +
        '<a class="bekijk" href="' + link + '" data-klik="' + esc(p.id) + '">Bekijk cadeau</a>' +
        '<div class="stuur"><button type="button" data-zoals="' + esc(p.id) + '">Meer zoals dit</button><button type="button" data-niet="' + esc(p.id) + '">Niet dit soort</button></div></div></article>';
    }).join('') + '</div>';
    var chips = [['origineler', 'Nog origineler']].concat(U.ints.filter(function (i) { return i.id !== 'met-naam'; }).map(function (i) { return ['meer:' + i.id, 'Meer ' + klein(i.n)]; }), [['persoonlijker', 'Persoonlijker'], ['praktischer', 'Praktischer']]);
    if (n && Math.max.apply(null, U.drie.map(function (x) { return x.p.prijs; })) > 8) chips.push(['goedkoper', 'Goedkoper']);
    h += '<section class="opnieuw"><h2>Verras me opnieuw</h2><p>Kies een richting. Je antwoorden blijven staan en VONK laat geen cadeau twee keer zien.</p><div class="chips">' +
      chips.map(function (c) { return '<button type="button" class="chip" data-richting="' + esc(c[0]) + '">' + esc(c[1]) + '</button>'; }).join('') + '</div></section>' +
      '<div class="onder">' + (n ? '<button type="button" class="lijn" data-deel>Deel via WhatsApp</button>' : '') + '<button type="button" class="lijn" data-wijzig>Antwoorden aanpassen</button><button type="button" class="lijn" data-nieuw>Opnieuw beginnen</button></div>' +
      '<p class="noot">VONK kiest alleen uit cadeaus die op LeukeKeuze staan, met dezelfde regels als onze pagina\'s. De prijs kan bij de winkel net anders zijn; je bestelt bij de winkel zelf.</p>';
    return h;
  }

  /* ---------- klikken ---------- */
  document.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('button,a'); if (!t) return;
    if (t.hasAttribute('data-verder')) {
      if (t.disabled) return;
      if (S.stap === 0) tel('start');
      if (S.stap === 4) { var v = document.getElementById('vrij'); S.vrij = v ? v.value.trim() : ''; S.gezien = []; S.richting = ''; S.extraMax = 0; S.zoals = []; S.nietVak = []; S.begrepen = ''; UIT = null; try { history.replaceState(null, '', hashVan()); } catch (x) {} tel('klaar/' + S.wie + '/' + S.vr); }
      S.stap = Math.min(5, S.stap + 1); if (S.stap === 5) zoekEven(); else teken(); return;
    }
    if (t.hasAttribute('data-terug')) { S.stap = Math.max(0, S.stap - 1); teken(); return; }
    if (t.dataset.wie) {
      if (S.wie !== t.dataset.wie) { S.int = []; S.lft = ''; S.wieNaam = ''; }
      S.wie = t.dataset.wie; if (!S.budgetGekozen) S.max = BUDGET_STD[S.wie] || 25;
      if (wieVan().kind) { teken(false); var lb = document.getElementById('lftBlok'); if (lb) lb.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
      else { S.stap = 2; teken(); }
      return;
    }
    if (t.dataset.lft) { S.lft = S.lft === t.dataset.lft ? '' : t.dataset.lft; [].forEach.call(document.querySelectorAll('[data-lft]'), function (b) { b.setAttribute('aria-pressed', b.dataset.lft === S.lft); }); return; }
    if (t.dataset.int) { var i = S.int.indexOf(t.dataset.int); if (i !== -1) S.int.splice(i, 1); else if (S.int.length < 3) S.int.push(t.dataset.int); teken(false); return; }
    if (t.dataset.max) { S.budgetGekozen = true; if (t.dataset.max === 'geen') S.geen = true; else { S.geen = false; S.max = +t.dataset.max; } var s = document.getElementById('bSchuif'); if (s) { s.value = S.geen ? 1000 : naarSchuif(S.max); s._zet(true); } return; }
    if (t.dataset.vr) { S.vr = t.dataset.vr; [].forEach.call(document.querySelectorAll('[data-vr]'), function (b) { b.setAttribute('aria-pressed', b.dataset.vr === S.vr); }); return; }
    if (t.dataset.mom) { S.mom = S.mom === t.dataset.mom ? '' : t.dataset.mom; [].forEach.call(document.querySelectorAll('[data-mom]'), function (b) { b.setAttribute('aria-pressed', b.dataset.mom === S.mom); }); return; }
    if (t.dataset.zoals) { S.zoals = [t.dataset.zoals]; S.richting = 'zoals'; tel('zoals'); UIT = null; zoekEven(); return; }
    if (t.dataset.niet) {
      var pn = PER[t.dataset.niet]; if (pn && S.nietVak.indexOf(pn.vak) === -1) S.nietVak.push(pn.vak); tel('niet');
      /* alleen dat ene cadeau wisselen; de andere twee blijven staan */
      var rest = UIT.drie.filter(function (x) { return x.p.id !== t.dataset.niet; });
      var nieuw = kies().drie.filter(function (x) { return rest.every(function (r) { return r.p.vak !== x.p.vak && r.p.id !== x.p.id; }); })[0];
      UIT.drie = UIT.drie.map(function (x) { return x.p.id === t.dataset.niet ? nieuw : x; }).filter(Boolean);
      if (nieuw) S.gezien.push(nieuw.p.id); if (UIT.fav === t.dataset.niet) UIT.fav = '';
      if (!nieuw) UIT.melding = 'Geen ander cadeau meer dat past. Kies hieronder een richting of pas je antwoorden aan.';
      teken(false); return;
    }
    if (t.dataset.richting) {
      S.richting = t.dataset.richting;
      if (S.richting === 'goedkoper' && UIT && UIT.drie.length) S.extraMax = Math.floor(Math.max.apply(null, UIT.drie.map(function (x) { return x.p.prijs; })) * 0.7);
      tel('opnieuw/' + S.richting.replace(':', '-')); UIT = null; zoekEven(); return;
    }
    if (t.dataset.hart) { var aan = wisselFav(t.dataset.hart); t.setAttribute('aria-pressed', aan); t.setAttribute('aria-label', aan ? 'Van je lijstje halen' : 'Op je lijstje zetten'); if (aan) tel('lijstje'); return; }
    if (t.dataset.klik) { tel('klik'); return; }
    if (t.hasAttribute('data-deel')) {
      var w = wieVan(), url = location.origin + '/nieuw/vonk2/' + hashVan();
      var tekst = 'VONK vond deze cadeaus voor ' + (w ? w.zijn : 'iemand') + ':\n' + UIT.drie.map(function (x) { return '• ' + x.p.titel + ' (' + euro(x.p.prijs) + ') ' + location.origin + PRODUCT + x.p.id + '/'; }).join('\n') + '\n\nProbeer VONK zelf: ' + url;
      tel('deel'); window.open('https://wa.me/?text=' + encodeURIComponent(tekst), '_blank', 'noopener'); return;
    }
    if (t.hasAttribute('data-wijzig')) { S.begrepen = ''; S.stap = 1; teken(); return; }
    if (t.hasAttribute('data-nieuw')) { S = JSON.parse(JSON.stringify(LEEG)); S.stap = 1; UIT = null; try { history.replaceState(null, '', location.pathname); } catch (x) {} teken(); return; }
  });
  /* even 'VONK zoekt…' (0,6 s): het kiezen zelf duurt een paar milliseconden, maar zo voelt de onthulling als een onthulling */
  function zoekEven() {
    vast.hidden = true; stapLabel.textContent = '';
    app.innerHTML = '<div class="zoekt" role="status"><img src="/images/vonk/vonk-icoon.webp" alt="" width="96" height="96"><p>VONK zoekt de mooiste cadeaus…</p></div>';
    window.scrollTo(0, 0);
    setTimeout(function () { teken(); }, window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches ? 50 : 650);
  }
  document.addEventListener('submit', function (e) {
    if (e.target.id !== 'zinForm') return; e.preventDefault();
    var z = document.getElementById('zinIn').value.trim(); if (!z) return;
    var r = leesZin(z), w = WIE.filter(function (x) { return x.id === (r.wie || 'iemand'); })[0];
    S = JSON.parse(JSON.stringify(LEEG)); S.wie = w.id; S.lft = r.lft || ''; S.int = r.int; S.max = r.max || BUDGET_STD[w.id] || 25; S.vr = r.vr || 'verrassend'; S.mom = r.mom || ''; S.vrij = r.vrij; S.wieNaam = r.woord && !/^(kind|kindje|tiener|baby|partner|collega)$/.test(r.woord) ? 'je ' + r.woord : '';
    var ints = interesses(w).filter(function (i) { return S.int.indexOf(i.id) !== -1; }).map(function (i) { return klein(i.n); });
    S.begrepen = 'voor ' + (S.wieNaam || w.zijn) + (S.lft ? ' (' + LEEFTIJD.filter(function (l) { return l.id === S.lft; })[0].n + ')' : '') + (ints.length ? ', houdt van ' + ints.join(', ') : '') + ', tot ' + euroKort(S.max) + (r.max ? '' : ' (zelf gekozen bedrag: pas aan als je wilt)') + '.';
    if (r.max) S.budgetGekozen = true;
    tel('zin/' + w.id); UIT = null; S.stap = 5; try { history.replaceState(null, '', hashVan()); } catch (x) {} zoekEven();
  });
  window.V2 = { get S() { return S; }, kies: kies, basis: basis, interesses: interesses, WIE: WIE, zet: function (o) { Object.assign(S, o); UIT = null; } };   /* voor de test */
  teken();
})();
