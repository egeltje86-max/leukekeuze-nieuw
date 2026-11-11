/* 4.0 – kern van de verhuizing (proef 11-11-2026). Deze functie draait op twee plekken met precies dezelfde code:
   - in de browser, onderaan data.js (het blok '4.0 VERHUIZING', gemaakt door scripts/boom/verhuis.js);
   - bij het bouwen, om te weten waar elk product heen moet (scripts/boom/verhuisd.json).
   L = de boom zoals hij was (LK_CATEGORIEEN, met alle eerdere aanvullingen), T = de tabel uit verhuizing.json.
   Geeft terug: { cats: de nieuwe boom, pad: oud adres -> nieuw adres, vak: 'afd/groep/vak' oud -> [afd, groep, vak] nieuw,
   groep: 'afd/groep' oud -> [afd, groep] nieuw (voor een product zonder vakje), terug: nieuw 'afd/groep/vak' -> oud 'afd/groep/vak' }.
   Oude groepen blijven als verborgen regel in hun oude afdeling staan: hun adres stuurt door (naar, naarVak) en
   hoortBij() weet via 'vakken' nog precies welke vakjes erbij hoorden. Zo blijven gidsen, gelegenheden en oude links werken. */
function LK_VERHUIS(L, T) {
  var zicht = {}, i;
  for (i = 0; i < L.length; i++) if (!L[i].verborgen) zicht[L[i].slug] = L[i];
  function oudSub(a, g) { var c = zicht[a], s = c ? c.subs || [] : []; for (var k = 0; k < s.length; k++) if (s[k].slug === g && !s[k].verborgen && s[k].vakjes) return s[k]; return null; }
  function kopie(o, niet) { var n = {}; for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k) && niet.indexOf(k) === -1) n[k] = o[k]; return n; }
  var uit = { cats: [], pad: {}, vak: {}, groep: {}, terug: {} }, nieuweAfd = {}, bezet = {}, doelVanGroep = {}, erfVan = {};
  /* 1. de nieuwe afdelingen en groepen opbouwen uit de oude vakjes */
  T.forEach(function (A) {
    var oud = zicht[A.slug], bron = oud || zicht[A.van] || {};
    var c = oud ? kopie(oud, ['subs']) : { slug: A.slug };
    if (!oud) { ['tegel', 'banner'].forEach(function (k) { if (bron[k]) c[k] = bron[k]; }); c.icoon = A.icoon || bron.icoon; }
    c.naam = A.naam; c.kort = A.kort || A.naam;
    ['rond', 'tekst', 'seoTitel', 'icoon'].forEach(function (k) { if (A[k]) c[k] = A[k]; });
    if (A.tekst && oud) { delete c.seoTekst; }
    c.subs = A.groepen.map(function (G) {
      var heel = G.uit.length === 1 && typeof G.uit[0] === 'string' && G.uit[0].split('/').length === 2;
      var eersteBron = (typeof G.uit[0] === 'string' ? G.uit[0] : G.uit[0].van).split('/');
      var erf = G.erf ? oudSub(G.erf.split('/')[0], G.erf.split('/')[1]) : oudSub(eersteBron[0], eersteBron[1]);
      var s = heel && erf ? kopie(erf, ['vakjes']) : {};
      s.slug = G.slug; s.naam = G.naam; s.vakjes = [];
      if (!heel && erf && (G.erf || !eersteBron[2])) { ['beeld', 'icoon2026'].forEach(function (k) { if (erf[k]) s[k] = erf[k]; }); }
      if (G.beeld) s.beeld = G.beeld;
      if (G.erf) erfVan[G.erf] = [A.slug, G.slug];
      if (G.tekst) { s.tekst = G.tekst; delete s.seoTekst; delete s.gids; }
      if (G.seoTitel) s.seoTitel = G.seoTitel;
      G.uit.forEach(function (u) {
        var d = (typeof u === 'string' ? u : u.van).split('/'), os = oudSub(d[0], d[1]); if (!os) return;
        var vv = os.vakjes.filter(function (v) { return !d[2] || v.slug === d[2]; });
        if (u.alsVak) s.vakjes.push({ slug: u.alsVak.slug, naam: u.alsVak.naam, beeld: os.beeld });
        vv.forEach(function (v) {
          var nv = u.alsVak ? u.alsVak.slug : v.slug, ok = d[0] + '/' + d[1] + '/' + v.slug;
          if (!u.alsVak) s.vakjes.push(v);
          uit.vak[ok] = [A.slug, G.slug, nv];
          (doelVanGroep[d[0] + '/' + d[1]] = doelVanGroep[d[0] + '/' + d[1]] || []).push([A.slug, G.slug, nv]);
          bezet[ok] = 1;
        });
      });
      if (!s.beeld) for (var k = 0; k < s.vakjes.length; k++) if (s.vakjes[k].beeld) { s.beeld = s.vakjes[k].beeld; break; }
      return s;
    });
    nieuweAfd[A.slug] = c; uit.cats.push(c);
  });
  /* 2. oude groepen die niet onder dezelfde naam in dezelfde afdeling terugkomen: verborgen regel met doorverwijzing */
  Object.keys(doelVanGroep).forEach(function (ok) {
    var d = ok.split('/'), doelen = doelVanGroep[ok], os = oudSub(d[0], d[1]);
    var zelfde = doelen.every(function (x) { return x[0] === d[0] && x[1] === d[1]; });
    var eenGroep = doelen.every(function (x) { return x[0] === doelen[0][0] && x[1] === doelen[0][1]; });
    var hoofd = erfVan[ok] || (eenGroep ? [doelen[0][0], doelen[0][1]] : null);
    if (!zelfde) uit.groep[ok] = hoofd || [doelen[0][0], doelen[0][1]];
    os.vakjes.forEach(function (v) {
      var x = uit.vak[ok + '/' + v.slug]; if (!x) return;
      if (x[0] !== d[0] || x[1] !== d[1] || x[2] !== v.slug) { uit.pad['/c/' + ok + '/' + v.slug] = '/c/' + x.join('/'); uit.terug[x.join('/')] = ok + '/' + v.slug; }
    });
    if (zelfde) return;
    var naar = hoofd ? '/c/' + hoofd.join('/') : '/c/' + doelen[0][0];
    uit.pad['/c/' + ok] = naar;
    var naarVak = {}, vakken = [];
    os.vakjes.forEach(function (v) { var x = uit.vak[ok + '/' + v.slug]; if (x) { naarVak[v.slug] = '/c/' + x.join('/'); if (vakken.indexOf(x.join('/')) === -1) vakken.push(x.join('/')); } });
    var thuis = nieuweAfd[d[0]];
    if (thuis && !thuis.subs.some(function (s) { return s.slug === d[1]; })) thuis.subs.push({ slug: d[1], naam: os.naam, verborgen: true, naar: naar, naarVak: naarVak, vakken: vakken });
  });
  /* 3. wat al verborgen was (nog oudere adressen) blijft, en wijst meteen naar de nieuwste plek */
  function nieuwste(p) { var k = String(p || '').replace(/\/$/, ''); return uit.pad[k] || p; }
  T.forEach(function (A) {
    var oud = zicht[A.slug]; if (!oud) return;
    (oud.subs || []).forEach(function (s) {
      if (!s.verborgen) return;
      if (nieuweAfd[A.slug].subs.some(function (x) { return x.slug === s.slug; })) return; /* de naam is nu van een nieuwe groep */
      var n = kopie(s, []); if (n.naar) n.naar = nieuwste(n.naar); nieuweAfd[A.slug].subs.push(n);
    });
  });
  L.forEach(function (c) {
    if (nieuweAfd[c.slug]) return;
    if (!c.verborgen && zicht[c.slug] && !/^(cadeaus|valentijn)$/.test(c.slug)) return; /* zichtbare afdeling die niet in de tabel staat: hoort niet voor te komen */
    if (c.naar) c.naar = nieuwste(c.naar);
    (c.subs || []).forEach(function (s) { if (s.naar) s.naar = nieuwste(s.naar); });
    uit.cats.push(c);
  });
  uit.ontbreekt = [];
  Object.keys(zicht).forEach(function (a) { if (/^(cadeaus|valentijn)$/.test(a)) return; (zicht[a].subs || []).forEach(function (s) { if (s.verborgen || !s.vakjes) return; s.vakjes.forEach(function (v) { if (!bezet[a + '/' + s.slug + '/' + v.slug]) uit.ontbreekt.push(a + '/' + s.slug + '/' + v.slug); }); }); });
  return uit;
}
if (typeof module !== 'undefined') module.exports = { LK_VERHUIS: LK_VERHUIS };
