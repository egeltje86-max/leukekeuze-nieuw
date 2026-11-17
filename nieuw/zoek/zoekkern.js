/* ZOEKKERN voor de testvoorbeelden 'snel zoeken' (/nieuw/zoek/a t/m d), 17-11-2026, opdracht Marius: 'verzin de ultieme snelle zoek en weergave van cadeaus, laat 4 voorbeelden zien'.
   Zoekt in de telefoon zelf in alle cadeaus (geen wachten op een server): elke letter geeft meteen nieuwe uitkomsten.
   Woorden mogen half getypt zijn (lamp = lampje, lampen), meervoud en verkleinwoord tellen mee, één tikfout mag (vanaf 5 letters).
   Handgekozen toppen en wat Marius zelf koos komen eerst. Drank alleen als je erom vraagt. Niet in Google (noindex + robots.txt). */
(function () {
  'use strict';
  var K = window.KERN;
  var NAMEN = {};
  (window.LK_CATEGORIEEN || []).forEach(function (a) { NAMEN[a.slug] = a.naam; (a.subs || []).forEach(function (g) { NAMEN[a.slug + '/' + g.slug] = g.naam; (g.vakjes || []).forEach(function (v) { NAMEN[a.slug + '/' + g.slug + '/' + v.slug] = v.naam; }); }); });
  function norm(s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9€ ]+/g, ' ').replace(/\s+/g, ' ').trim(); }
  function stam(w) { return w.length > 5 ? w.replace(/(tjes|etjes|jes|tje|je|en|s)$/, '') : w; }
  var SYN = { kado: 'cadeau', cadeautje: 'cadeau', licht: 'lamp', lampje: 'lamp', verlichting: 'lamp', pluche: 'knuffel', knuffeldier: 'knuffel', beker: 'mok', sok: 'sokken', sloffen: 'pantoffels', slof: 'pantoffel',
    gamer: 'gaming', game: 'gaming', games: 'gaming', spelletje: 'spel', puzzelen: 'puzzel', kaarsje: 'kaars', geurkaars: 'kaars', drop: 'snoep', chocola: 'chocolade', chocolate: 'chocolade', bbq: 'barbecue',
    voetbal: 'voetbal', hond: 'hond', poes: 'kat', katten: 'kat', dino: 'dinosaurus', eenhoorn: 'unicorn', badjas: 'badjas', plaid: 'deken', fleece: 'deken', horloge: 'horloge', stressbal: 'stressbal', fidget: 'fidget' };
  function heeft(l, x) { return (l || []).indexOf(x) !== -1; }
  var RANG = {}, DRUK = /^\/(voor|collectie|gelegenheid)\/|^\/c\/cadeaus\//;
  Object.keys(K.TOP).forEach(function (k) { var l = K.TOP[k] || []; if (!DRUK.test(k)) return; l.forEach(function (id, i) { var v = i / Math.max(l.length, 12); if (RANG[id] == null || v < RANG[id]) RANG[id] = v; }); });
  var GROF = /middelvinger|f[u*]ck|lekker pik|piemel|bitch|\bkut\b|pleur op|sexy as hell/i;
  var VOORRAAD = K.ALLES.filter(function (p) { return p.prijs > 0 && !p.los; });
  var IDX = VOORRAAD.map(function (p) {
    var g = (p.afd || '') + '/' + (p.groep || ''), v = g + '/' + (p.vak || '');
    /* alleen de naam van het vakje telt als soort (niet die van de hele afdeling: anders is alles bij 'Elektronica & gaming' een gamecadeau) */
    var titel = norm(p.titel), cat = norm([NAMEN[v], (p.sub || '').replace(/-/g, ' ')].join(' ')), groep = norm(NAMEN[g] || ''), extra = norm([p.shop, p.merk, (p.tags || []).join(' ')].join(' '));
    var w = {}; (titel + ' ' + cat + ' ' + extra).split(' ').forEach(function (x) { if (x) { w[x] = 1; w[stam(x)] = 1; } });
    return { p: p, titel: titel, cat: cat, groep: groep, extra: extra, woorden: Object.keys(w) };
  });
  var VOCAB = {}; IDX.forEach(function (r) { r.woorden.forEach(function (w) { if (w.length >= 4) VOCAB[w] = (VOCAB[w] || 0) + 1; }); });
  var VLIJST = Object.keys(VOCAB);
  /* klank: woorden die hetzelfde klinken zijn gelijk (pusel = puzzel, sjokolade = chocolade, kado = cadeau) */
  function klank(w) { return w.replace(/^sj/, 'ch').replace(/ch/g, 'g').replace(/ph/g, 'f').replace(/ck/g, 'k').replace(/c([eiy])/g, 's$1').replace(/c/g, 'k').replace(/z/g, 's').replace(/ij|ei/g, 'y').replace(/au/g, 'ou').replace(/eau/g, 'o').replace(/(.)\1+/g, '$1'); }
  var KLANK = {}; VLIJST.forEach(function (w) { var k = klank(w); if (!KLANK[k] || VOCAB[w] > VOCAB[KLANK[k]]) KLANK[k] = w; });
  var KLIJST = Object.keys(KLANK);
  function afstand(a, b) { if (Math.abs(a.length - b.length) > 1) return 2; var d = [], i, j; for (i = 0; i <= a.length; i++) d[i] = [i]; for (j = 0; j <= b.length; j++) d[0][j] = j;
    for (i = 1; i <= a.length; i++) for (j = 1; j <= b.length; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); return d[a.length][b.length]; }
  /* één zoekwoord: hele woorden, begin van een woord, of een woord met één tikfout */
  function varianten(q) {
    var s = SYN[q] || q, l = [s, stam(s)];
    if (s.length >= 4 && !VLIJST.some(function (w) { return w.indexOf(s) === 0; })) {
      var k = klank(s);
      if (KLANK[k]) l.push(KLANK[k]);
      else if (s.length >= 5) { var best = KLIJST.filter(function (x) { return x[0] === k[0] && afstand(x, k) <= 1; }).map(function (x) { return KLANK[x]; }).sort(function (a, b) { return VOCAB[b] - VOCAB[a]; })[0]; if (best) l.push(best); }
    }
    return l;
  }
  var DRANKWOORD = /wijn|whisky|gin|bier|champagne|prosecco|rum|drank|port\b|likeur|cognac/;
  function zoek(tekst, opties) {
    opties = opties || {};
    var q = norm(tekst).split(' ').filter(function (w) { return w && !/^(een|voor|met|van|de|het|en|cadeau|cadeaus|kado|leuk|leuke|jaar|jarig)$/.test(w) && !/^\d{1,2}$/.test(w); });
    var persoonGevraagd = /oma|opa|juf|meester|pensioen|collega|mama|papa|moeder|vader|zwanger|bruiloft|trouw|geslaagd|baby|sorry|beterschap|afscheid/.test(norm(tekst));
    var wilDrank = DRANKWOORD.test(norm(tekst));
    var lijsten = q.map(varianten);
    var uit = [];
    IDX.forEach(function (r) {
      var p = r.p;
      if (p.drank && !wilDrank) return;
      if (GROF.test(p.titel) && !opties.grof) return;
      if (opties.wie && !K_wieOk(p, opties.wie)) return;
      if (opties.tot && p.prijs > opties.tot) return;
      var s = 0;
      for (var i = 0; i < lijsten.length; i++) {
        var best = 0;
        lijsten[i].forEach(function (v) {
          if (!v) return;
          if ((' ' + r.titel + ' ').indexOf(' ' + v) !== -1) best = Math.max(best, 3);
          else if ((' ' + r.cat + ' ').indexOf(' ' + v) !== -1) best = Math.max(best, 2);
          else if ((' ' + r.extra + ' ').indexOf(' ' + v) !== -1) best = Math.max(best, 1.5);
          else if (v.length >= 5 && (' ' + r.groep + ' ').indexOf(' ' + v) !== -1) best = Math.max(best, 1);
          else if (v.length >= 4 && r.titel.indexOf(v) !== -1) best = Math.max(best, 1);
        });
        if (!best) return;
        s += best;
      }
      /* een cadeau met een tekst voor één soort persoon (oma, juf, pensioen) alleen bovenaan als je om die persoon vraagt */
      if (p.smal && !persoonGevraagd) s -= 3;
      var r0 = RANG[p.id];
      s += r0 != null ? 2 - r0 * 1.5 : 0;
      if (p.zk) s += 0.8;
      if (p.shop === 'bol') s -= 0.4;
      uit.push({ p: p, s: s });
    });
    uit.sort(function (a, b) { return b.s - a.s; });
    return uit.map(function (x) { return x.p; });
  }
  function K_wieOk(p, w) {
    var v = p.voor || [], lt = p.leeftijd;
    if ((p.nietBij || []).indexOf(w) !== -1) return false;
    if (w === 'haar' || w === 'hem') return heeft(v, w) || (heeft(v, 'iedereen') && !heeft(v, 'kind') && !heeft(v, 'baby') && !(lt && lt[1] && lt[1] <= 12));
    if (w === 'kinderen') return heeft(v, 'kind');
    if (w === 'tieners') return heeft(v, 'tiener');
    return heeft(v, w);
  }
  /* telt per vakje hoeveel uitkomsten er zijn, voor de knoppen 'in Lampjes (23)' */
  function perVak(lijst, max) {
    var t = {};
    lijst.forEach(function (p) { var k = (p.afd || '') + '/' + (p.groep || '') + '/' + (p.vak || ''); if (!NAMEN[k]) return; t[k] = (t[k] || 0) + 1; });
    return Object.keys(t).map(function (k) { return { k: k, naam: NAMEN[k], n: t[k] }; }).filter(function (x) { return x.n >= 2; }).sort(function (a, b) { return b.n - a.n; }).slice(0, max || 6);
  }
  function inVak(p, k) { return ((p.afd || '') + '/' + (p.groep || '') + '/' + (p.vak || '')) === k; }
  /* tijd van de laatste zoekopdracht, om te laten zien hoe snel het is */
  function meet(fn) { var t = performance.now(), r = fn(); return { r: r, ms: Math.max(1, Math.round(performance.now() - t)) }; }
  window.ZOEK = { zoek: zoek, perVak: perVak, inVak: inVak, meet: meet, norm: norm, wieOk: K_wieOk, NAMEN: NAMEN, aantal: VOORRAAD.length };
})();
