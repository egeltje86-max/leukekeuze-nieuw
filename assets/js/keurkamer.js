/* LeukeKeuze – Keurkamer v1
   Producten één voor één keuren. Keuringen staan op dit apparaat
   en kunnen worden geëxporteerd/geïmporteerd als keuringslijst.json. */
(function () {
  var LK = window.LK, esc = LK.esc;
  var $ = function (s, r) { return (r || document).querySelector(s); };

  var TABS = [
    { id: 'tekeuren', label: 'Te keuren', past: function (p) { return p.status === 'nieuw' || p.status === 'overgeslagen'; } },
    { id: 'goedgekeurd', label: 'Goedgekeurd', past: function (p) { return p.status === 'goedgekeurd'; } },
    { id: 'afgewezen', label: 'Afgewezen', past: function (p) { return p.status === 'afgewezen'; } },
    { id: 'tekst', label: 'Tekst mooier', past: function (p) { return p.tekstHerschrijven; } },
    { id: 'alle', label: 'Alles', past: function () { return true; } }
  ];
  var NAAM = { nieuw: 'Nieuw', goedgekeurd: 'Goedgekeurd', afgewezen: 'Afgewezen', overgeslagen: 'Overgeslagen' };
  var tab = 'tekeuren', huidig = null;

  function lijst() { return LK.producten(); }
  function volgende(behalve) {
    var l = lijst();
    return l.find(function (p) { return p.status === 'nieuw' && p.id !== behalve; }) ||
           l.find(function (p) { return p.status === 'overgeslagen' && p.id !== behalve; }) || null;
  }
  function plek(p) {
    var c = window.LK_CAT(p.cat), s = window.LK_SUB(c, p.sub);
    return (c ? c.naam : p.cat) + ' › ' + (s ? s.naam : p.sub);
  }
  function zet(id, w) {
    var k = LK.leesKeuringen(), p = LK.vind(id);
    k[id] = Object.assign({ status: p.status, cat: p.cat, sub: p.sub, tekstHerschrijven: !!p.tekstHerschrijven }, k[id] || {}, w, { datum: new Date().toISOString() });
    if (!LK.bewaarKeuringen(k)) toast('Opslaan lukte niet op dit apparaat');
  }
  function toast(t) {
    var el = $('[data-toast]'); el.textContent = t; el.classList.add('zichtbaar');
    clearTimeout(toast.t); toast.t = setTimeout(function () { el.classList.remove('zichtbaar'); }, 1800);
  }

  function toonTabs() {
    var l = lijst();
    $('[data-tabs]').innerHTML = TABS.map(function (t) {
      return '<button class="chip" type="button" data-tab="' + t.id + '" aria-pressed="' + (tab === t.id) + '">' + t.label + '<span class="n">' + l.filter(t.past).length + '</span></button>';
    }).join('');
    var klaar = l.filter(function (p) { return p.status === 'goedgekeurd' || p.status === 'afgewezen'; }).length;
    $('[data-voortgang]').innerHTML = '<span style="width:' + Math.round(klaar / (l.length || 1) * 100) + '%"></span>';
  }

  function opties(p) {
    return window.LK_CATEGORIEEN.map(function (c) {
      return '<optgroup label="' + esc(c.naam) + '">' + c.subs.map(function (s) {
        var sel = c.slug === p.cat && s.slug === p.sub ? ' selected' : '';
        return '<option value="' + c.slug + '|' + s.slug + '"' + sel + '>' + esc(c.naam + ' › ' + s.naam) + '</option>';
      }).join('') + '</optgroup>';
    }).join('');
  }

  function toonKeuring() {
    var l = lijst(), p = huidig ? LK.vind(huidig) : null;
    if (!p) { p = volgende(); huidig = p ? p.id : null; }
    var el = $('[data-keuring]');
    if (!p) {
      el.innerHTML = '<div class="kk-klaar"><strong>Alles is gekeurd</strong>Er staan geen producten meer klaar. Klik in het overzicht op een product om het opnieuw te keuren.</div>';
      return;
    }
    var open = l.filter(function (x) { return x.status === 'nieuw' || x.status === 'overgeslagen'; }).length;
    var bron = p.url ? '<a href="' + esc(p.url) + '" target="_blank" rel="noopener">Openen bij winkel</a>' : (p.voorbeeld ? 'Voorbeeld (geen link)' : '—');
    el.innerHTML =
      '<div><div class="kk-vb">Zo ziet het eruit op de site</div>' + LK.productKaart(p) + '</div>' +
      '<div class="kk-details">' +
        '<h2>' + esc(p.titel) + '</h2>' +
        '<div class="kk-teller"><span class="pil pil-' + p.status + '">' + NAAM[p.status] + '</span> &nbsp;nog ' + open + ' te keuren</div>' +
        '<dl class="kk-gegevens">' +
          '<dt>Prijs</dt><dd>' + LK.euro(p.prijs) + '</dd>' +
          '<dt>Shop</dt><dd>' + esc(p.shop) + '</dd>' +
          '<dt>Bron</dt><dd>' + bron + '</dd>' +
          '<dt>Nu in</dt><dd>' + esc(plek(p)) + '</dd>' +
          '<dt>Tekst</dt><dd style="font-weight:400">' + esc(p.waarom || '—') + '</dd>' +
        '</dl>' +
        '<label class="kk-veld"><span>Andere (sub)categorie kiezen</span><select data-sub>' + opties(p) + '</select></label>' +
        '<label class="kk-vink"><input type="checkbox" data-tekst' + (p.tekstHerschrijven ? ' checked' : '') + '> Tekst moet mooier / strakker</label>' +
        '<div class="kk-knoppen">' +
          '<button class="knop knop-goud goed" type="button" data-oordeel="goedgekeurd">Goedkeuren</button>' +
          '<button class="knop af" type="button" data-oordeel="afgewezen">Afwijzen</button>' +
          '<button class="knop knop-rand" type="button" data-oordeel="overgeslagen">Overslaan</button>' +
        '</div>' +
        '<div class="kk-sneltoets">Sneltoetsen op de computer: G = goedkeuren, A = afwijzen, S = overslaan.</div>' +
      '</div>';
  }

  function toonLijst() {
    var t = TABS.find(function (x) { return x.id === tab; });
    var l = lijst().filter(t.past);
    $('[data-lijst]').innerHTML = l.length ? l.map(function (p) {
      return '<button class="kk-rij" type="button" data-open="' + p.id + '"><span class="naam">' + esc(p.titel) + '</span>' +
        '<span class="status"><span class="pil pil-' + p.status + '">' + NAAM[p.status] + '</span>' + (p.tekstHerschrijven ? '<span class="pil pil-tekst">Tekst</span>' : '') + '</span>' +
        '<span class="info">' + esc(plek(p)) + ' · ' + esc(p.shop) + ' · € ' + Number(p.prijs).toFixed(2).replace('.', ',') + '</span></button>';
    }).join('') : '<div class="kk-rij"><span class="info">Niets in deze lijst.</span></div>';
  }
  function alles() { toonTabs(); toonKeuring(); toonLijst(); }

  function oordeel(status) {
    if (!huidig) return;
    var d = ($('[data-sub]') ? $('[data-sub]').value : '|').split('|');
    zet(huidig, { status: status, cat: d[0], sub: d[1], tekstHerschrijven: !!($('[data-tekst]') && $('[data-tekst]').checked) });
    toast(status === 'goedgekeurd' ? 'Goedgekeurd' : status === 'afgewezen' ? 'Afgewezen (blijft bewaard)' : 'Overgeslagen');
    var v = volgende(huidig); huidig = v ? v.id : null;
    alles();
  }

  document.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    if (b.dataset.tab) { tab = b.dataset.tab; toonTabs(); toonLijst(); }
    else if (b.dataset.oordeel) oordeel(b.dataset.oordeel);
    else if (b.dataset.open) { huidig = b.dataset.open; toonKeuring(); $('[data-keuring]').scrollIntoView({ behavior: 'smooth' }); }
    else if (b.hasAttribute('data-export')) exporteer();
  });
  document.addEventListener('change', function (e) {
    if (!huidig) return;
    if (e.target.matches('[data-sub]')) { var d = e.target.value.split('|'); zet(huidig, { cat: d[0], sub: d[1] }); toast('Categorie aangepast'); toonTabs(); toonLijst(); }
    if (e.target.matches('[data-tekst]')) { zet(huidig, { tekstHerschrijven: e.target.checked }); toonTabs(); toonLijst(); }
  });
  document.addEventListener('keydown', function (e) {
    if (e.target.matches('input, select, textarea') || e.ctrlKey || e.metaKey || e.altKey) return;
    var k = e.key.toLowerCase();
    if (k === 'g') oordeel('goedgekeurd'); if (k === 'a') oordeel('afgewezen'); if (k === 's') oordeel('overgeslagen');
  });

  function exporteer() {
    var data = { soort: 'leukekeuze-keuringslijst', versie: 2, datum: new Date().toISOString(), keuringen: LK.leesKeuringen() };
    var a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
    a.download = 'keuringslijst.json'; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
    toast('Keuringslijst opgeslagen');
  }
  $('[data-import]').addEventListener('change', function (e) {
    var f = e.target.files[0]; if (!f) return;
    var r = new FileReader();
    r.onload = function () {
      try {
        var d = JSON.parse(r.result);
        if (!d || d.soort !== 'leukekeuze-keuringslijst' || typeof d.keuringen !== 'object') throw 0;
        var k = LK.leesKeuringen();
        Object.keys(d.keuringen).forEach(function (id) { k[id] = d.keuringen[id]; });
        LK.bewaarKeuringen(k); huidig = null; alles(); toast('Keuringslijst ingeladen');
      } catch (x) { toast('Dit is geen geldige keuringslijst'); }
      e.target.value = '';
    };
    r.readAsText(f);
  });

  alles();
})();
