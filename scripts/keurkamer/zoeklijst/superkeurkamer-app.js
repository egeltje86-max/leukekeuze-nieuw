/* Superkeurkamer LeukeKeuze — alles draait op je eigen laptop. Er gaat niets naar de website. */
(function () {
  'use strict';
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var app = $('#app');
  var STATUS = { plek: 'Krijgt een plek', bekijken: 'Nog bekijken', nee: 'Past niet' };
  var staat = { partners: null, tab: 'alles', zoek: '', netwerk: '', sorteer: 'naam',
                pid: null, partner: null, pad: [], f: {}, pagina: 1, producten: [], cats: null, actief: '' };
  try { staat.actief = localStorage.getItem('skk-actief') || ''; } catch (e) {}

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function euro(n) { return '€ ' + Number(n || 0).toFixed(2).replace('.', ','); }
  function tal(n) { return Number(n || 0).toLocaleString('nl-NL'); }
  function get(url) { return fetch(url, { cache: 'no-store' }).then(function (r) { return r.json(); }); }
  function post(url, data) { return fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(function (r) { return r.json(); }); }
  function melding(t, terug, lang) {
    var m = $('#melding');
    m.innerHTML = '<span>' + esc(t) + '</span>' + (terug ? '<button type="button" class="m-terug">Ongedaan maken</button>' : '');
    m.hidden = false; clearTimeout(melding.t);
    if (terug) m.querySelector('.m-terug').onclick = function () { m.hidden = true; clearTimeout(melding.t); terug(); };
    melding.t = setTimeout(function () { m.hidden = true; }, terug || lang ? 5500 : 1800);
  }
  function herstel(x) { return post('/api/herstel', { product: x }).then(function (r) { if (r.aantal != null) $('#lijstTeller').textContent = tal(r.aantal); return r; }); }
  function extraUitleg(r) {
    var u = [];
    if (r.dubbel && r.dubbel.length) u.push('Let op: staat ook al in je lijst via ' + r.dubbel.join(', '));
    if (r.opsite) u.push('Let op: dit product staat al op LeukeKeuze');
    return u.length ? ' · ' + u.join(' · ') : '';
  }
  function teller() { get('/api/lijst').then(function (l) { $('#lijstTeller').textContent = tal((l.producten || []).length); }); }
  function beeld(src, alt) { return src ? '<img src="' + esc(src) + '" alt="' + esc(alt || '') + '" loading="lazy" referrerpolicy="no-referrer" onerror="this.replaceWith(Object.assign(document.createElement(\'span\'),{className:\'geen\',textContent:\'Geen foto\'}))">' : '<span class="geen">Geen foto</span>'; }

  /* ---------------- routes ---------------- */
  function route() {
    var h = decodeURIComponent(location.hash.slice(1) || '/');
    var d = h.split('/').filter(Boolean);
    var vorig = route.vorig || ''; route.vorig = h;
    if (!(d[0] === 'cat' && vorig.indexOf('/cat') === 0)) window.scrollTo(0, 0);
    if (d[0] === 'p' && d[1]) return toonPartner(d[1], d.slice(2));
    document.querySelectorAll('.kop-link').forEach(function (a) { a.classList.remove('aan'); });
    if (d[0] === 'cat') { $('#navC').classList.add('aan'); return toonCats(d[1] || ''); }
    if (d[0] === 'lijst') return toonLijst();
    $('#navP').classList.add('aan');
    return toonHome();
  }
  window.addEventListener('hashchange', route);

  /* ---------------- home ---------------- */
  function toonHome() {
    staat.pid = null;
    Promise.all([get('/api/partners'), laadCats()]).then(function (res) { staat.partners = res[0]; tekenHome(); });
  }
  function filterPartners() {
    var z = staat.zoek.toLowerCase();
    var l = staat.partners.filter(function (p) {
      if (z && p.naam.toLowerCase().indexOf(z) === -1 && !(p.afdelingen || []).some(function (a) { return a[0].toLowerCase().indexOf(z) !== -1; })) return false;
      if (staat.netwerk && p.netwerk.indexOf(staat.netwerk) === -1) return false;
      if (staat.tab === 'nieuw') return p.n > 0 && !p.opsite;
      if (staat.tab === 'site') return p.opsite > 0;
      if (staat.tab === 'geen') return !p.n || p.fotoslecht;
      if (staat.tab === 'cadeau') return p.cadeau && p.n && !p.fotoslecht;
      if (staat.tab === 'plek') return p.notitie && p.notitie.status === 'plek';
      if (staat.tab === 'bekijken') return !p.notitie || !p.notitie.status;
      return true;
    });
    var s = staat.sorteer;
    l.sort(function (a, b) {
      if (s === 'n') return b.n - a.n;
      if (s === 'korting') return b.korting - a.korting;
      if (s === 'gekozen') return b.gekozen - a.gekozen;
      var an = a.n && !a.fotoslecht, bn = b.n && !b.fotoslecht;
      if (an !== bn) return bn ? 1 : -1;
      return a.naam.localeCompare(b.naam, 'nl');
    });
    return l;
  }
  function tekenHome() {
    var P = staat.partners;
    var met = P.filter(function (p) { return p.n; });
    var tot = met.reduce(function (s, p) { return s + p.n; }, 0);
    var kort = met.reduce(function (s, p) { return s + p.korting; }, 0);
    var gek = P.reduce(function (s, p) { return s + (p.gekozen || 0); }, 0);
    var tel = function (t) { var o = staat.tab; staat.tab = t; var n = filterPartners().length; staat.tab = o; return n; };
    var netw = {}; P.forEach(function (p) { p.netwerk.split(' + ').forEach(function (n) { netw[n] = 1; }); });
    app.innerHTML =
      '<section class="held"><div class="binnen">' +
        '<h1>Kies een <em>partner</em></h1>' +
        '<p>Elke partner als een eigen mini-winkel: alle producten netjes ingedeeld in hun eigen groepen. ' +
        'Kies wat je goed vindt voor je <b>nieuwe productlijst</b>. Die blijft apart en gaat pas naar de site als jij dat zegt.</p>' +
        '<div class="tellers">' +
          '<div class="teller"><b>' + tal(met.length) + '</b><span>partners met producten</span></div>' +
          '<div class="teller"><b>' + tal(tot) + '</b><span>producten</span></div>' +
          '<div class="teller"><b>' + tal(kort) + '</b><span>afgeprijsd</span></div>' +
          '<div class="teller"><b>' + tal(gek) + '</b><span>al gekozen</span></div>' +
        '</div></div></section>' +
      '<div class="binnen home-raam"><div class="home-links">' +
        '<div class="balk">' +
          '<label class="zoekveld"><span aria-hidden="true">🔍</span><input id="pz" placeholder="Zoek een partner of soort (bv. Coolblue, mutsen, wijn)" value="' + esc(staat.zoek) + '"></label>' +
          '<select class="kiezer" id="pn"><option value="">Alle netwerken</option>' + Object.keys(netw).sort().map(function (n) { return '<option' + (staat.netwerk === n ? ' selected' : '') + '>' + esc(n) + '</option>'; }).join('') + '</select>' +
          '<select class="kiezer" id="ps">' +
            [['naam', 'A tot Z'], ['n', 'Meeste producten'], ['korting', 'Meeste korting'], ['gekozen', 'Meeste gekozen']].map(function (o) { return '<option value="' + o[0] + '"' + (staat.sorteer === o[0] ? ' selected' : '') + '>' + o[1] + '</option>'; }).join('') +
          '</select>' +
        '</div>' +
        '<div class="tabs" id="pt">' +
          [['alles', 'Alle partners'], ['cadeau', '🎁 Cadeaus & gadgets'], ['nieuw', 'Nog niet op de site'], ['site', 'Al op de site'], ['bekijken', 'Nog niet bekeken'], ['plek', 'Krijgt een plek'], ['geen', 'Nog geen producten']]
            .map(function (t) { return '<button class="tab' + (staat.tab === t[0] ? ' aan' : '') + '" data-t="' + t[0] + '">' + t[1] + ' <b>' + tal(tel(t[0])) + '</b></button>'; }).join('') +
        '</div>' +
        '<div class="partners" id="pl" style="margin-top:18px"></div>' +
      '</div>' + paneelHtml() + '</div>';
    tekenKaarten(); tekenPaneel();
    $('#pz').addEventListener('input', function (e) { staat.zoek = e.target.value; tekenKaarten(); });
    $('#pn').addEventListener('change', function (e) { staat.netwerk = e.target.value; tekenHome(); });
    $('#ps').addEventListener('change', function (e) { staat.sorteer = e.target.value; tekenKaarten(); });
    $('#pt').addEventListener('click', function (e) { var b = e.target.closest('.tab'); if (b) { staat.tab = b.dataset.t; tekenHome(); } });
  }
  function tekenKaarten() {
    var l = filterPartners();
    $('#pl').innerHTML = l.length ? l.map(function (p) {
      var st = p.notitie && p.notitie.status;
      return '<a class="pk' + (p.n ? '' : ' leeg') + '" href="' + (p.n ? '#/p/' + p.id : 'javascript:void 0') + '"' + (p.n ? '' : ' title="' + esc(p.leeg || '') + '"') + '>' +
        '<div class="pk-beeld"><span class="pk-net">' + esc(p.netwerk) + '</span>' +
          (p.n ? '<span class="pk-site ' + (p.opsite ? 'ja">Op de site: ' + tal(p.opsite) : 'nee">Nog niet op de site') + '</span>' : '') +
          (p.foto ? '<img src="' + esc(p.foto) + '" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.outerHTML=\'<span class=letter>' + esc(p.naam[0]) + '</span>\'">' : '<span class="letter">' + esc(p.naam[0]) + '</span>') +
          (p.fotoslecht ? '<span class="pk-foto">⚠ Foto\'s laden niet</span>' : p.feedoud && p.n ? '<span class="pk-foto">⚠ Feed oud (' + esc(p.feeddatum) + ')</span>' : '') +
        '</div><div class="pk-tekst"><h3>' + esc(p.naam) + '</h3>' +
        (p.n ? '<div class="pk-meta"><span><b>' + tal(p.n) + '</b> producten</span>' + (p.korting ? '<span class="k"><b class="k">' + tal(p.korting) + '</b> afgeprijsd</span>' : '') + (p.populair ? '<span>★ ' + tal(p.populair) + ' populair</span>' : '') + '</div>' +
          '<div class="pk-afd">' + (p.afdelingen || []).filter(function (a) { return !/^(Overig|Zonder|Kleine afdelingen)/.test(a[0]); }).slice(0, 5).map(function (a) { return '<span>' + esc(a[0]) + '</span>'; }).join('') + '</div>'
          : '<div class="pk-meta">' + esc(p.leeg || 'Nog geen producten') + '</div>') +
        '<div class="pk-voet"><span class="status ' + (st || '') + '">' + (STATUS[st] || 'Nog niet bekeken') + '</span>' +
          (p.gekozen ? '<span class="gekozen-tel">✓ ' + tal(p.gekozen) + ' gekozen</span>' : '') + '</div>' +
        '</div></a>';
    }).join('') : '<div class="leeg-melding">Geen partners gevonden.</div>';
  }

  /* ---------------- partner ---------------- */
  function toonPartner(pid, pad) {
    var nieuw = staat.pid !== pid;
    if (!nieuw && staat.pad.join('␟') !== pad.join('␟')) ['merk', 'kenmerk', 'q', 'min', 'max'].forEach(function (k) { delete staat.f[k]; });
    staat.pad = pad; staat.pagina = 1;
    if (nieuw) {
      staat.pid = pid; staat.f = { sort: 'aanbevolen' };
      app.innerHTML = '<div class="laden">' + 'Mini-winkel openen…' + '</div>';
      Promise.all([get('/api/partner?id=' + encodeURIComponent(pid)), laadCats()]).then(function (res) {
        var d = res[0];
        if (d.fout) { app.innerHTML = '<div class="laden">' + esc(d.fout) + '</div>'; return; }
        staat.partner = d; tekenPartner(); laadProducten();
      });
    } else {
      tekenPartnerBoom(); laadProducten();
    }
  }
  function padLink(pad) { return '#/p/' + staat.pid + (pad.length ? '/' + pad.map(encodeURIComponent).join('/') : ''); }
  function tekenPartner() {
    var i = staat.partner.info, st = i.notitie && i.notitie.status;
    app.innerHTML =
      '<section class="pkop"><div class="binnen">' +
        '<div class="pkop-beeld">' + (i.foto ? '<img src="' + esc(i.foto) + '" alt="" referrerpolicy="no-referrer" onerror="this.remove()">' : '') + '</div>' +
        '<div><a class="terug" href="#/">← Alle partners</a><h1>' + esc(i.naam) + '</h1>' +
          '<div class="pkop-meta"><span class="pil">' + esc(i.netwerk) + '</span><span class="pil">' + tal(i.n) + ' producten</span>' +
          (i.korting ? '<span class="pil">' + tal(i.korting) + ' afgeprijsd</span>' : '') +
          (i.populair ? '<span class="pil">★ ' + tal(i.populair) + ' populair</span>' : '') +
          '<span class="pil">' + (i.opsite ? 'Op de site: ' + tal(i.opsite) : 'Nog niet op de site') + '</span>' +
          '<span class="pil">Feed van ' + esc(i.bijgewerkt || '') + '</span>' +
          (i.feedoud ? '<span class="pil rood">⚠ De winkel werkt zijn feed niet meer bij (laatst: ' + esc(i.feeddatum) + ')</span>' : '') +
          (i.vol ? '<span class="pil">Alleen de eerste 60.000</span>' : '') +
          (i.fotoslecht ? '<span class="pil rood">⚠ De foto\'s van deze winkel laden niet (feed verouderd)</span>' : '') + '</div>' +
          (i.uitleg ? '<div style="margin-top:8px;font-size:13px;color:#CFC2A0">' + esc(i.uitleg) + '</div>' : '') +
        '</div>' +
        '<div class="pkop-rechts"><button class="knop goud" id="notBtn">' + (STATUS[st] ? '● ' + STATUS[st] + ' · aanpassen' : 'Plek op de site bepalen') + '</button>' +
          '<span class="pil goud" id="pGek">✓ ' + tal(i.gekozen || 0) + ' gekozen bij deze partner</span></div>' +
      '</div></section>' +
      (i.fotoslecht ? '<div class="binnen"><div class="waarschuwing"><b>De foto\'s van ' + esc(i.naam) + ' werken niet.</b> Dat ligt aan de winkel: hun feed is oud. De foto\'s (en vaak ook de producten) staan niet meer op hun site. ' +
        'Producten zonder foto kun je niet op LeukeKeuze zetten. Kies liever bij een andere winkel, of vraag de winkel via TradeTracker om een nieuwe feed.</div></div>' : '') +
      '<div class="binnen raam drie"><aside class="zij"><h4>Alle groepen</h4><nav class="boom" id="boom"></nav></aside>' +
        '<section id="hoofd"></section>' + paneelHtml() + '</div>';
    $('#notBtn').addEventListener('click', notitieVenster);
    tekenPartnerBoom(); tekenPaneel();
  }
  function tekenPartnerBoom() {
    var boom = staat.partner.boom, pad = staat.pad;
    var open = function (b) { // laat zien: alle afdelingen, en de takken langs het gekozen pad
      if (b.pad.length === 1) return true;
      for (var k = 0; k < b.pad.length - 1; k++) if (pad[k] !== b.pad[k]) return false;
      return true;
    };
    var kinderen = {};
    boom.forEach(function (b) { var k = b.pad.slice(0, -1).join('␟'); kinderen[k] = (kinderen[k] || 0) + 1; });
    var gesorteerd = boom.slice().sort(function (a, b) {
      for (var i = 0; i < Math.min(a.pad.length, b.pad.length); i++) {
        if (a.pad[i] !== b.pad[i]) {
          var ao = /^(Overig|Zonder)/.test(a.pad[i]), bo = /^(Overig|Zonder)/.test(b.pad[i]);
          if (ao !== bo) return ao ? 1 : -1;
          return a.pad[i].localeCompare(b.pad[i], 'nl');
        }
      }
      return a.pad.length - b.pad.length;
    });
    var html = '<a class="d1' + (pad.length ? '' : ' aan') + '" href="' + padLink([]) + '"><span class="pijl">◆</span>Alles van ' + esc(staat.partner.info.naam) + '<span class="n">' + tal(staat.partner.info.n) + '</span></a>';
    gesorteerd.forEach(function (b) {
      if (!open(b)) return;
      var aan = b.pad.join('␟') === pad.join('␟');
      var heeftKind = kinderen[b.pad.join('␟')];
      var isOpen = heeftKind && pad.slice(0, b.pad.length).join('␟') === b.pad.join('␟');
      html += '<a class="d' + Math.min(b.pad.length, 4) + (aan ? ' aan' : '') + (/^(Overig|Zonder)/.test(b.pad[b.pad.length - 1]) ? ' overig' : '') + '" href="' + padLink(b.pad) + '">' +
        '<span class="pijl">' + (heeftKind ? (isOpen ? '▾' : '▸') : '') + '</span>' + esc(b.pad[b.pad.length - 1]) + '<span class="n">' + tal(b.n) + '</span></a>';
    });
    $('#boom').innerHTML = html;
    var aan = $('#boom .aan'), zij = $('.zij');
    if (aan && zij && (aan.offsetTop < zij.scrollTop || aan.offsetTop > zij.scrollTop + zij.clientHeight - 40)) zij.scrollTop = aan.offsetTop - 120;
  }
  function query() {
    var f = staat.f, q = ['id=' + encodeURIComponent(staat.pid), 'pad=' + encodeURIComponent(JSON.stringify(staat.pad)), 'pagina=' + staat.pagina];
    ['q', 'sort', 'korting', 'pop', 'voorraad', 'merk', 'min', 'max'].forEach(function (k) { if (f[k]) q.push(k + '=' + encodeURIComponent(f[k])); });
    if (f.kenmerk && f.kenmerk.length) q.push('kenmerk=' + encodeURIComponent(f.kenmerk.join('|')));
    if (actieveCat()) q.push('cat=' + encodeURIComponent(staat.actief));
    return '/api/producten?' + q.join('&');
  }
  function laadProducten(meer) {
    if (!meer) { staat.pagina = 1; }
    var hoofd = $('#hoofd'); if (!hoofd) return;
    if (!meer) hoofd.style.opacity = .55;
    get(query()).then(function (d) {
      hoofd.style.opacity = 1;
      if (d.fout) { hoofd.innerHTML = '<div class="leeg-melding">' + esc(d.fout) + '</div>'; return; }
      if (meer) { staat.producten = staat.producten.concat(d.producten); $('#raster').insertAdjacentHTML('beforeend', d.producten.map(kaart).join('')); tekenMeer(d); return; }
      staat.producten = d.producten; tekenHoofd(d);
    });
  }
  function tekenHoofd(d) {
    var pad = staat.pad, f = staat.f, i = staat.partner.info;
    var kruimel = '<a href="' + padLink([]) + '">' + esc(i.naam) + '</a>' + pad.map(function (s, k) { return ' › <a href="' + padLink(pad.slice(0, k + 1)) + '">' + esc(s) + '</a>'; }).join('');
    var titel = pad.length ? pad[pad.length - 1] : 'Alles van ' + i.naam;
    var rondjes = d.kinderen.length ? '<div class="rondjes">' + d.kinderen.map(function (k) {
      return '<a class="rond' + (/^(Overig|Zonder)/.test(k.naam) ? ' overig' : '') + '" href="' + padLink(pad.concat([k.naam])) + '"><span class="r">' +
        (k.foto ? '<img src="' + esc(k.foto) + '" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.outerHTML=\'<span class=l>' + esc(k.naam[0]) + '</span>\'">' : '<span class="l">' + esc(k.naam[0]) + '</span>') +
        '</span><b>' + esc(k.naam) + '</b><small>' + tal(k.n) + '</small></a>';
    }).join('') + '</div>' : '';
    var merken = d.merken.length > 1 || f.merk ? '<select id="fm"><option value="">Alle merken</option>' + d.merken.map(function (m) { return '<option' + (f.merk === m[0] ? ' selected' : '') + ' value="' + esc(m[0]) + '">' + esc(m[0]) + ' (' + m[1] + ')</option>'; }).join('') + '</select>' : '';
    var km = (f.kenmerk || []);
    var kenm = d.kenmerken.length || km.length ? '<div class="kenmerken"><span class="lbl">Kenmerken</span>' +
      km.filter(function (k) { return !d.kenmerken.some(function (x) { return x[0] === k; }); }).map(function (k) { return '<button class="chip aan" data-k="' + esc(k) + '">' + esc(k) + '</button>'; }).join('') +
      d.kenmerken.map(function (k) { return '<button class="chip' + (km.indexOf(k[0]) !== -1 ? ' aan' : '') + '" data-k="' + esc(k[0]) + '">' + esc(k[0]) + ' <small>' + tal(k[1]) + '</small></button>'; }).join('') + '</div>' : '';
    $('#hoofd').innerHTML =
      '<div class="kruimel">' + kruimel + '</div>' +
      '<div class="titel-rij"><h2>' + esc(titel) + '</h2><span>' + tal(d.totaal) + (d.totaal !== d.basis ? ' van ' + tal(d.basis) : '') + ' producten</span></div>' +
      rondjes +
      '<div class="gereedschap">' +
        '<label class="zoekveld"><span aria-hidden="true">🔍</span><input id="fq" placeholder="Zoek in ' + esc(titel) + '" value="' + esc(f.q || '') + '"></label>' +
        '<button class="chip korting' + (f.korting ? ' aan' : '') + '" data-t="korting">Afgeprijsd <small>' + tal(d.korting) + '</small></button>' +
        '<button class="chip' + (f.pop ? ' aan' : '') + '" data-t="pop">★ Populair <small>' + tal(d.populair) + '</small></button>' +
        '<button class="chip' + (f.voorraad ? ' aan' : '') + '" data-t="voorraad">Op voorraad</button>' +
        '<input type="number" id="fmin" placeholder="€ van" value="' + esc(f.min || '') + '"><input type="number" id="fmax" placeholder="€ tot" value="' + esc(f.max || '') + '">' +
        merken +
        '<select id="fs">' + [['aanbevolen', 'Populair en korting eerst'], ['korting', 'Hoogste korting'], ['prijs-op', 'Prijs laag-hoog'], ['prijs-af', 'Prijs hoog-laag'], ['naam', 'Naam A-Z']]
          .map(function (o) { return '<option value="' + o[0] + '"' + (f.sort === o[0] ? ' selected' : '') + '>' + o[1] + '</option>'; }).join('') + '</select>' +
        (Object.keys(f).some(function (k) { return k !== 'sort' && f[k] && (!Array.isArray(f[k]) || f[k].length); }) ? '<button class="chip" id="fw">✕ Filters wissen</button>' : '') +
      '</div>' + kenm +
      (d.producten.length ? '<div class="raster" id="raster">' + d.producten.map(kaart).join('') + '</div><div class="meer" id="meer"></div>'
        : '<div class="leeg-melding">Geen producten met deze filters' + (filterUitleg() ? ': <b>' + esc(filterUitleg()) + '</b>' : '') + '.<br><button class="knop navy" id="fw2" style="margin-top:12px">✕ Filters wissen</button></div>');
    tekenMeer(d);
    var t;
    $('#fq').addEventListener('input', function (e) { clearTimeout(t); t = setTimeout(function () { f.q = e.target.value.trim(); laadProducten(); }, 300); });
    $('#fmin').addEventListener('change', function (e) { f.min = e.target.value; laadProducten(); });
    $('#fmax').addEventListener('change', function (e) { f.max = e.target.value; laadProducten(); });
    $('#fs').addEventListener('change', function (e) { f.sort = e.target.value; laadProducten(); });
    if ($('#fm')) $('#fm').addEventListener('change', function (e) { f.merk = e.target.value; laadProducten(); });
    if ($('#fw')) $('#fw').addEventListener('click', function () { staat.f = { sort: f.sort }; laadProducten(); });
    if ($('#fw2')) $('#fw2').addEventListener('click', function () { staat.f = { sort: f.sort }; laadProducten(); });
    $('#hoofd .gereedschap').addEventListener('click', function (e) { var b = e.target.closest('.chip[data-t]'); if (b) { f[b.dataset.t] = f[b.dataset.t] ? '' : '1'; laadProducten(); } });
    var kd = $('#hoofd .kenmerken');
    if (kd) kd.addEventListener('click', function (e) {
      var b = e.target.closest('.chip'); if (!b) return;
      var k = b.dataset.k; f.kenmerk = f.kenmerk || [];
      var x = f.kenmerk.indexOf(k); if (x === -1) f.kenmerk.push(k); else f.kenmerk.splice(x, 1);
      laadProducten();
    });
    rasterKliks();
  }
  function filterUitleg() {
    var f = staat.f, u = [];
    if (f.q) u.push('zoekwoord "' + f.q + '"');
    if (f.merk) u.push('merk ' + f.merk);
    if (f.kenmerk && f.kenmerk.length) u.push(f.kenmerk.join(', '));
    if (f.korting) u.push('alleen afgeprijsd');
    if (f.pop) u.push('alleen populair');
    if (f.voorraad) u.push('alleen op voorraad');
    if (f.min) u.push('vanaf € ' + f.min);
    if (f.max) u.push('tot € ' + f.max);
    return u.join(' · ');
  }
  function tekenMeer(d) {
    var m = $('#meer'); if (!m) return;
    m.innerHTML = d.pagina < d.paginas ? '<button class="knop navy" id="meerBtn">Meer laden (' + tal(d.totaal - d.pagina * 60) + ' te gaan)</button>' : '';
    if (d.pagina < d.paginas) $('#meerBtn').addEventListener('click', function () { staat.pagina = d.pagina + 1; laadProducten(true); });
  }
  function kiesTekst(p) {
    var c = actieveCat();
    if (c) return p.inCat ? '✓ In ' + esc(c.naam) : '+ In ' + esc(c.naam);
    return p.gekozen ? '✓ Gekozen' : '+ Kiezen';
  }
  function kaart(p) {
    var c = actieveCat(), aan = c ? p.inCat : p.gekozen;
    return '<article class="prod' + (aan ? ' gekozen' : '') + '" data-key="' + esc(p.key) + '">' +
      '<div class="labels">' + (p.o ? '<span class="lab k">-' + p.pct + '%</span>' : '') + (p.pop ? '<span class="lab p">★ Populair</span>' : '') +
        (c && p.gekozen && !p.inCat ? '<span class="lab v">Al in je lijst</span>' : '') + (p.opsite ? '<span class="lab s">Al op de site</span>' : '') +
        (p.v > 1 ? '<span class="lab v">' + p.v + ' varianten</span>' : '') + (p.st ? '' : '<span class="lab u">Uitverkocht</span>') + '</div>' +
      '<div class="prod-beeld" data-zoom>' + beeld(p.f, p.t) + '</div>' +
      '<div class="prod-tekst"><span class="prod-merk">' + esc(p.m || ' ') + '</span><span class="prod-titel" title="' + esc(p.t) + '">' + esc(p.t) + '</span>' +
        '<span class="prijs' + (p.o ? ' k' : '') + '"><b>' + euro(p.p) + '</b>' + (p.o ? '<s>' + euro(p.o) + '</s>' : '') + '</span>' +
        '<button class="kies" data-kies>' + kiesTekst(p) + '</button>' +
      '</div></article>';
  }
  function zoekProduct(key) { return staat.producten.find(function (p) { return p.key === key; }); }
  function rasterKliks() {
    var r = $('#raster'); if (!r) return;
    r.addEventListener('click', function (e) {
      var el = e.target.closest('.prod'); if (!el) return;
      var p = zoekProduct(el.dataset.key); if (!p) return;
      if (e.target.closest('[data-kies]')) return kies(p, el);
      if (e.target.closest('[data-zoom]')) return detail(p);
    });
  }
  function mKiesTekst(p) {
    var c = actieveCat();
    if (c) return p.inCat ? '✓ In ' + esc(c.naam) + ' (klik om weg te halen)' : '+ In ' + esc(c.naam);
    return p.gekozen ? '✓ Gekozen (klik om weg te halen)' : '+ Kiezen voor mijn lijst';
  }
  function kies(p, el, cVast) {
    var c = cVast !== undefined ? cVast : actieveCat(), was = !!p.gekozen;
    post('/api/kies', c ? { partner: staat.pid, key: p.key, cat: c.id } : { partner: staat.pid, key: p.key }).then(function (r) {
      if (r.fout) return melding(r.fout);
      p.gekozen = r.gekozen; p.inCat = !!r.inCat;
      document.querySelectorAll('#raster .prod[data-key="' + p.key + '"]').forEach(function (k) { k.outerHTML = kaart(p); });
      $('#lijstTeller').textContent = tal(r.aantal);
      if (staat.partner && was !== !!r.gekozen) { staat.partner.info.gekozen = (staat.partner.info.gekozen || 0) + (r.gekozen ? 1 : -1); var g = $('#pGek'); if (g) g.textContent = '✓ ' + tal(staat.partner.info.gekozen) + ' gekozen bij deze partner'; }
      var terug = function () {
        if (r.weg && !c) herstel(r.weg).then(function () {
          p.gekozen = true; document.querySelectorAll('#raster .prod[data-key="' + p.key + '"]').forEach(function (k) { k.outerHTML = kaart(p); });
          if (staat.partner) { staat.partner.info.gekozen = (staat.partner.info.gekozen || 0) + 1; var g = $('#pGek'); if (g) g.textContent = '✓ ' + tal(staat.partner.info.gekozen) + ' gekozen bij deze partner'; }
          melding('Teruggezet in je lijst');
        });
        else kies(p, null, c && catVan(c.id) ? c : null);
      };
      if (c) melding((r.inCat ? 'In ' + c.naam + ' gezet' : 'Uit ' + c.naam + ' gehaald') + (r.inCat ? extraUitleg(r) : ''), terug);
      else melding((r.gekozen ? 'Toegevoegd aan je nieuwe lijst' : 'Uit je nieuwe lijst gehaald') + (r.gekozen ? extraUitleg(r) : ''), terug);
      var mk = $('#mKies'); if (mk) mk.innerHTML = mKiesTekst(p);
      if (c) laadCats().then(tekenPaneel);
    });
  }
  function detail(p) {
    var m = $('#modal');
    m.innerHTML = '<div class="mvenster"><div class="mb">' + beeld(p.f, p.t) + '</div><div class="mt">' +
      '<button class="sluit" aria-label="Sluiten">✕</button>' +
      '<span class="prod-merk">' + esc(p.m) + '</span><h3>' + esc(p.t) + '</h3>' +
      '<div class="pad">' + esc((p.g || []).join(' › ')) + '</div>' +
      '<span class="prijs' + (p.o ? ' k' : '') + '"><b style="font-size:24px">' + euro(p.p) + '</b>' + (p.o ? '<s>' + euro(p.o) + '</s> <span class="lab k">-' + p.pct + '%</span>' : '') + '</span>' +
      '<div class="tags">' + (p.pop ? '<span>★ Populair bij de winkel</span>' : '') + (p.v > 1 ? '<span>' + p.v + ' varianten (maten/kleuren)</span>' : '') + (p.st ? '<span>Op voorraad</span>' : '<span>Uitverkocht</span>') +
        (p.k || []).map(function (k) { return '<span>' + esc(k) + '</span>'; }).join('') + '</div>' +
      '<div class="mknoppen"><button class="knop goud" id="mKies">' + mKiesTekst(p) + '</button>' +
        (p.u || p.l ? '<a class="knop wit" target="_blank" rel="noopener" href="' + esc(p.u || p.l) + '">Bekijk in de winkel ↗</a>' : '') + '</div>' +
      (p.u ? '<p style="font-size:12.5px;color:#5B6275;margin:6px 0 0">Bekijken gaat via de gewone winkelpagina, niet via je partnerlink (zo tel je geen eigen klikken mee).</p>' : '') +
      '</div></div>';
    m.hidden = false;
    var sluit = function () { m.hidden = true; m.innerHTML = ''; };
    m.onclick = function (e) { if (e.target === m || e.target.closest('.sluit')) sluit(); };
    $('#mKies').addEventListener('click', function () { var el = document.querySelector('.prod[data-key="' + p.key + '"]'); kies(p, el); });
  }
  function notitieVenster() {
    var i = staat.partner.info, n = i.notitie || {};
    var m = $('#modal'), keuze = n.status || '';
    m.innerHTML = '<div class="notitie-venster"><h3>Plek op de site voor ' + esc(i.naam) + '</h3>' +
      '<p>Wat vind je van deze partner, en waar past hij op LeukeKeuze? Dit blijft hier in de keurkamer.</p>' +
      '<div class="keuzes">' + Object.keys(STATUS).map(function (k) { return '<button class="chip ' + k + (keuze === k ? ' aan' : '') + '" data-s="' + k + '">' + STATUS[k] + '</button>'; }).join('') + '</div>' +
      '<textarea id="nt" placeholder="Bijvoorbeeld: past bij Sport & buiten, de RC-auto\'s en monstertrucks zijn top voor jongens 8-12">' + esc(n.tekst || '') + '</textarea>' +
      '<div class="mknoppen"><button class="knop goud" id="nOk">Bewaren</button><button class="knop wit" id="nWeg">Annuleren</button></div></div>';
    m.hidden = false;
    m.querySelector('.keuzes').addEventListener('click', function (e) {
      var b = e.target.closest('.chip'); if (!b) return; keuze = keuze === b.dataset.s ? '' : b.dataset.s;
      m.querySelectorAll('.keuzes .chip').forEach(function (c) { c.classList.toggle('aan', c.dataset.s === keuze); });
    });
    var sluit = function () { m.hidden = true; m.innerHTML = ''; };
    m.onclick = function (e) { if (e.target === m) sluit(); };
    $('#nWeg').addEventListener('click', sluit);
    $('#nOk').addEventListener('click', function () {
      var tekst = $('#nt').value;
      post('/api/partnernotitie', { id: staat.pid, status: keuze, tekst: tekst }).then(function () {
        i.notitie = { status: keuze, tekst: tekst }; sluit(); melding('Bewaard');
        $('#notBtn').textContent = STATUS[keuze] ? '● ' + STATUS[keuze] + ' · aanpassen' : 'Plek op de site bepalen';
      });
    });
  }

  /* ---------------- mijn categorieën ---------------- */
  function catPad(id) { var uit = [], c = catVan(id); while (c) { uit.unshift(c); c = catVan(c.ouder); } return uit; }
  function catVan(id) { return (staat.cats || []).find(function (c) { return c.id === id; }); }
  function catKinderen(id) { return (staat.cats || []).filter(function (c) { return (c.ouder || null) === (id || null); }).sort(function (a, b) { return a.volgorde - b.volgorde; }); }
  function catTotaal(id) { return (catVan(id) ? catVan(id).n : 0) + catKinderen(id).reduce(function (s, k) { return s + catTotaal(k.id); }, 0); }
  function invoerVenster(titel, uitleg, start, knop, klaar) {
    var m = $('#modal');
    m.innerHTML = '<div class="notitie-venster"><h3>' + esc(titel) + '</h3><p>' + esc(uitleg) + '</p>' +
      '<input id="vIn" class="invoer" maxlength="60" value="' + esc(start || '') + '" placeholder="Bijvoorbeeld: Mutsen, Cadeaus voor oma, Monstertrucks">' +
      '<div class="mknoppen"><button class="knop goud" id="vOk">' + esc(knop) + '</button><button class="knop wit" id="vWeg">Annuleren</button></div></div>';
    m.hidden = false;
    var i = $('#vIn'); i.focus(); i.select();
    var sluit = function () { m.hidden = true; m.innerHTML = ''; };
    var ok = function () { var v = i.value.trim(); if (!v) { i.focus(); return; } sluit(); klaar(v); };
    $('#vOk').addEventListener('click', ok);
    i.addEventListener('keydown', function (e) { if (e.key === 'Enter') ok(); });
    $('#vWeg').addEventListener('click', sluit);
    m.onclick = function (e) { if (e.target === m) sluit(); };
  }
  function bevestig(titel, uitleg, knop, klaar) {
    var m = $('#modal');
    m.innerHTML = '<div class="notitie-venster"><h3>' + esc(titel) + '</h3><p>' + esc(uitleg) + '</p>' +
      '<div class="mknoppen"><button class="knop rood" id="bOk">' + esc(knop) + '</button><button class="knop wit" id="bWeg">Nee, laat staan</button></div></div>';
    m.hidden = false;
    var sluit = function () { m.hidden = true; m.innerHTML = ''; };
    $('#bOk').addEventListener('click', function () { sluit(); klaar(); });
    $('#bWeg').addEventListener('click', sluit);
    m.onclick = function (e) { if (e.target === m) sluit(); };
  }
  function catActie(data, daarna) { return post('/api/cats', data).then(function (r) { if (r.fout) { melding(r.fout); return; } daarna && daarna(r); }); }
  function nieuweCat(ouder, blijf) {
    var o = catVan(ouder);
    invoerVenster(o ? 'Nieuwe subcategorie in ' + o.naam : 'Nieuwe categorie',
      o ? 'Hoe heet de subcategorie?' : 'Hoe heet je nieuwe categorie? Subcategorieën kun je er daarna in maken.',
      '', 'Maken', function (naam) { catActie({ actie: 'nieuw', naam: naam, ouder: ouder || null }, function (r) {
        if (!blijf) { location.hash = '#/cat/' + r.id; return; }
        laadCats().then(function () { zetActief(r.id); melding('Categorie ' + naam + ' gemaakt en aangezet'); });
      }); });
  }

  /* ---------------- paneel rechts: mijn categorieën (loopt mee met scrollen) ---------------- */
  function actieveCat() { return staat.actief && staat.cats ? catVan(staat.actief) || null : null; }
  function laadCats() { return get('/api/cats').then(function (c) { staat.cats = c.cats; return c.cats; }); }
  function paneelHtml() { return '<aside class="mijncats" id="mc"><div class="laden" style="padding:20px">Laden…</div></aside>'; }
  function tekenPaneel() {
    var box = $('#mc'); if (!box) return;
    if (!staat.cats) { laadCats().then(function () { if (staat.pid) verversKaarten(); tekenPaneel(); }); return; }
    if (staat.actief && !catVan(staat.actief)) staat.actief = '';
    var c = actieveCat(), html = '';
    var loop = function (ouder, d) {
      catKinderen(ouder).forEach(function (k) {
        html += '<div class="mc-rij d' + Math.min(d, 4) + (k.id === staat.actief ? ' aan' : '') + '">' +
          '<button class="mc-naam" data-zet="' + esc(k.id) + '"><span class="bol"></span><span class="t">' + esc(k.naam) + '</span><span class="n">' + tal(catTotaal(k.id)) + '</span></button>' +
          '<button class="mc-sub" data-sub="' + esc(k.id) + '" title="Subcategorie maken in ' + esc(k.naam) + '">+ sub</button></div>';
        loop(k.id, d + 1);
      });
    };
    loop(null, 1);
    box.innerHTML =
      '<div class="mc-kop"><h4>Mijn categorieën</h4>' +
        '<p>' + (c ? 'Alles wat je nu kiest, gaat in <b>' + esc(c.naam) + '</b>.' : 'Klik een categorie aan. Elk product dat je daarna kiest, gaat erin.') + '</p></div>' +
      '<div class="mc-lijst">' +
        '<div class="mc-rij geen' + (c ? '' : ' aan') + '"><button class="mc-naam" data-zet=""><span class="bol"></span><span class="t">Geen categorie <small>gewoon in mijn lijst</small></span></button></div>' +
        (html || '<div class="mc-leeg">Nog geen categorieën.<br>Maak hieronder je eerste.</div>') +
      '</div>' +
      '<div class="mc-voet"><button class="knop goud" data-nieuw>+ Nieuwe categorie</button>' +
        (c ? '<a class="mc-bekijk" href="#/cat/' + esc(c.id) + '">Bekijk wat er in ' + esc(c.naam) + ' zit →</a>' : '') + '</div>';
    if (!box.dataset.klik) {
      box.dataset.klik = 1;
      box.addEventListener('click', function (e) {
        var b;
        if ((b = e.target.closest('[data-sub]'))) return nieuweCat(b.dataset.sub, true);
        if ((b = e.target.closest('[data-zet]'))) return zetActief(b.dataset.zet);
        if (e.target.closest('[data-nieuw]')) return nieuweCat(null, true);
      });
    }
  }
  function zetActief(id) {
    staat.actief = id || '';
    try { localStorage.setItem('skk-actief', staat.actief); } catch (e) {}
    tekenPaneel();
    if (staat.pid) verversKaarten();
    var c = actieveCat();
    if (c) melding('Nu kies je voor ' + c.naam);
  }
  function verversKaarten() { // knoppen in de feed aanpassen aan de gekozen categorie, zonder de pagina te herladen
    if (!staat.producten || !$('#raster')) return;
    get('/api/lijst').then(function (l) {
      var m = {}; (l.producten || []).forEach(function (x) { m[x.key] = x.categorieen || []; });
      staat.producten.forEach(function (p) { p.gekozen = p.key in m; p.inCat = !!staat.actief && (m[p.key] || []).indexOf(staat.actief) !== -1; });
      $('#raster').innerHTML = staat.producten.map(kaart).join('');
    });
  }
  function toonCats(id) {
    staat.pid = null;
    var oudZoek = $('#cZoek'), y = window.scrollY;
    Promise.all([get('/api/cats'), get('/api/lijst')]).then(function (res) {
      staat.cats = res[0].cats;
      if (!id && staat.actief && catVan(staat.actief)) { location.replace('#/cat/' + staat.actief); return; }
      if (id && catVan(id) && staat.actief !== id) { staat.actief = id; try { localStorage.setItem('skk-actief', id); } catch (e) {} }
      if (staat.catId !== id) {
        var k = catVan(id);
        // je zoekopdracht blijft staan als je van categorie wisselt; alleen de eerste keer zoeken we op de naam
        if (k && k.zoek) staat.z = { q: '', slim: '1', min: k.min != null ? String(k.min) : '', max: k.max != null ? String(k.max) : '', sort: 'beste' };   // zoeklijst 14-11-2026
        else if (!staat.z || (!staat.z.q && !staat.z.merk)) staat.z = { q: k ? k.naam : '', sort: 'beste' };
        staat.catId = id;
      }
      app.innerHTML = '<section class="pkop"><div class="binnen"><div><h1>Mijn categorieën</h1>' +
        '<div style="color:#D8CBA8;max-width:760px;line-height:1.5">Maak je eigen indeling voor de nieuwe site. Klik een categorie aan en zoek er producten bij, in al je partners tegelijk.</div></div>' +
        '<div class="pkop-rechts"><button class="knop goud" id="cNieuw">+ Nieuwe categorie</button></div></div></section>' +
        '<div class="binnen raam"><aside class="zij"><h4>Mijn indeling</h4><nav class="boom" id="cBoom"></nav></aside><section id="cHoofd"></section></div>';
      $('#cNieuw').addEventListener('click', function () { nieuweCat(null); });
      tekenCatBoom(); tekenCat(oudZoek, res[1], y);
    });
  }
  function tekenCatBoom() {
    var html = '';
    var loop = function (ouder, d) {
      catKinderen(ouder).forEach(function (k) {
        var heeft = catKinderen(k.id).length;
        html += '<a class="d' + Math.min(d, 4) + (k.id === staat.catId ? ' aan' : '') + '" href="#/cat/' + k.id + '"><span class="pijl">' + (heeft ? '▾' : '') + '</span>' + esc(k.naam) + '<span class="n' + (k.doel && catTotaal(k.id) >= k.doel ? ' vol' : '') + '">' + tal(catTotaal(k.id)) + (k.doel ? '/' + k.doel : '') + '</span></a>';
        loop(k.id, d + 1);
      });
    };
    loop(null, 1);
    $('#cBoom').innerHTML = html || '<div style="padding:8px 10px;color:#5B6275;font-size:14px">Nog geen categorieën. Klik op <b>+ Nieuwe categorie</b>.</div>';
  }
  function tekenCat(oudZoek, lijstData, bewaarY) {
    var h = $('#cHoofd'), k = catVan(staat.catId);
    oudZoek = oudZoek || $('#cZoek');
    if (!k) {
      h.innerHTML = (staat.cats || []).length
        ? '<div class="leeg-melding">Kies links een categorie om er producten bij te zoeken.</div>'
        : '<div class="start-cat"><h2>Je begint met een lege indeling</h2><p>Maak je eerste categorie, bijvoorbeeld <b>Mutsen</b> of <b>Cadeaus voor opa</b>. Daarna zoek je er producten bij uit al je partners.</p><button class="knop goud" id="cEerste">+ Maak je eerste categorie</button></div>';
      if ($('#cEerste')) $('#cEerste').addEventListener('click', function () { nieuweCat(null); });
      return;
    }
    var pad = catPad(k.id), subs = catKinderen(k.id);
    var y = bewaarY != null ? bewaarY : window.scrollY;
    var teken = function (l) {
      var erin = (l.producten || []).filter(function (x) { return (x.categorieen || []).indexOf(k.id) !== -1; });
      staat.catProducten = erin;
      h.innerHTML =
        '<div class="kruimel"><a href="#/cat">Mijn categorieën</a>' + pad.map(function (c) { return ' › <a href="#/cat/' + c.id + '">' + esc(c.naam) + '</a>'; }).join('') + '</div>' +
        '<div class="titel-rij"><h2>' + esc(k.naam) + '</h2><span>' + tal(erin.length) + (k.doel ? ' van ongeveer ' + k.doel : '') + ' gekozen</span></div>' + soortInfo(k, erin.length) +
        '<div class="cat-acties"><button class="chip" data-a="sub">+ Subcategorie</button><button class="chip" data-a="naam">✎ Naam wijzigen</button>' +
          '<button class="chip" data-a="omhoog" title="Naar boven">↑</button><button class="chip" data-a="omlaag" title="Naar beneden">↓</button>' +
          '<button class="chip weg" data-a="weg">🗑 Verwijderen</button></div>' +
        (subs.length ? '<div class="rondjes">' + subs.map(function (s) {
          return '<a class="rond" href="#/cat/' + s.id + '"><span class="r"><span class="l">' + esc(s.naam[0]) + '</span></span><b>' + esc(s.naam) + '</b><small>' + tal(catTotaal(s.id)) + '</small></a>';
        }).join('') + '</div>' : '') +
        '<h3 class="sectiekop">In deze categorie <small>' + tal(erin.length) + '</small></h3>' +
        (erin.length ? '<div class="raster" id="cErin">' + erin.map(function (x) { return catKaart(x); }).join('') + '</div>'
          : '<div class="leeg-melding klein">Nog niets. Zoek hieronder en klik op <b>+ In ' + esc(k.naam) + '</b>.</div>') +
        '<h3 class="sectiekop">Producten zoeken voor ' + esc(k.naam) + ' <small>in alle partners</small></h3>' +
        '<div id="cZoek"></div>';
      if (oudZoek && oudZoek.querySelector('#zBalk')) $('#cZoek').replaceWith(oudZoek);
      window.scrollTo(0, y);
      var sb = h.querySelector('.soort-info [data-a="slim"]');
      if (sb) sb.addEventListener('click', function () { staat.z.slim = staat.z.slim ? '' : '1'; staat.z.q = staat.z.slim ? '' : k.naam; var zb = $('#zBalk'); if (zb) zb.parentNode.innerHTML = ''; tekenCat(); });
      h.querySelector('.cat-acties').addEventListener('click', function (e) {
        var b = e.target.closest('[data-a]'); if (!b) return;
        var a = b.dataset.a;
        if (a === 'slim') { staat.z.slim = staat.z.slim ? '' : '1'; if (!staat.z.slim && !staat.z.q) staat.z.q = k.naam; if (staat.z.slim) staat.z.q = ''; var zb = $('#zBalk'); if (zb) zb.remove(); tekenCat(); return; }
        if (a === 'sub') return nieuweCat(k.id);
        if (a === 'naam') return invoerVenster('Naam wijzigen', 'Nieuwe naam voor ' + k.naam + ':', k.naam, 'Bewaren', function (n) { catActie({ actie: 'hernoem', id: k.id, naam: n }, function () { toonCats(k.id); }); });
        if (a === 'omhoog' || a === 'omlaag') return catActie({ actie: a, id: k.id }, function () { toonCats(k.id); });
        if (a === 'weg') return bevestig('Categorie ' + k.naam + ' verwijderen?',
          (subs.length ? 'De subcategorieën gaan ook weg. ' : '') + 'De producten blijven gewoon in je nieuwe lijst staan, alleen zonder deze categorie.', 'Ja, verwijderen',
          function () { catActie({ actie: 'weg', id: k.id }, function () { staat.catId = null; location.hash = k.ouder ? '#/cat/' + k.ouder : '#/cat'; }); });
      });
      var ce = $('#cErin');
      if (ce) ce.addEventListener('click', function (e) {
        var el = e.target.closest('.prod'); if (!el) return;
        var x = erin.find(function (y) { return y.key === el.dataset.key; });
        if (e.target.closest('[data-uit]')) return post('/api/kies', { partner: x.partner, key: x.key, cat: k.id }).then(function (r) { $('#lijstTeller').textContent = tal(r.aantal); melding('Uit ' + k.naam + ' gehaald'); tekenCat(); get('/api/cats').then(function (c) { staat.cats = c.cats; tekenCatBoom(); }); });
        if (e.target.closest('[data-zoom]')) detailLijst({ t: x.titel, m: x.merk, p: x.prijs, o: x.oud, f: x.foto, u: x.winkelurl, l: x.link, g: x.groep, winkel: x.winkel });
      });
      tekenZoek();
    };
    if (lijstData) teken(lijstData); else get('/api/lijst').then(teken);
  }
  /* Zoeklijst (14-11-2026): uitleg bij een soort: voor wie, prijs, hoeveel we zoeken, tip, en de slimme zoekwoorden. */
  var VOOR_NAAM = { kind: 'kinderen', tiener: 'tieners', haar: 'haar', hem: 'hem', 'opa-oma': 'opa en oma', collega: 'collega\'s', baby: 'baby', iedereen: 'iedereen' };
  function soortInfo(k, n) {
    if (!k.zoek) return '';
    var pct = k.doel ? Math.min(100, Math.round(100 * n / k.doel)) : 0;
    return '<div class="soort-info"><div class="si-rij">' + (k.prio ? '<span class="si-prio p' + esc(k.prio) + '">' + (k.prio === 'A' ? 'Belangrijk' : k.prio === 'B' ? 'Goed' : 'Klein') + '</span>' : '') +
      (k.voor && k.voor.length ? '<span>Voor ' + k.voor.map(function (v) { return esc(VOOR_NAAM[v] || v); }).join(', ') + '</span>' : '') +
      '<span>' + euro(k.min) + ' tot ' + euro(k.max) + '</span>' + (k.vol ? '<span>' + tal(k.vol) + ' keer per maand gezocht</span>' : '') + '</div>' +
      (k.doel ? '<div class="si-balk"><i style="width:' + pct + '%"></i></div>' : '') +
      (k.tip ? '<p class="si-tip">💡 ' + esc(k.tip) + '</p>' : '') +
      '<p class="si-woorden">Zoekt op: ' + k.zoek.map(function (w) { return '<b>' + esc(w.trim()) + '</b>'; }).join(' · ') + (k.niet && k.niet.length ? '<br><small>Niet: ' + k.niet.map(function (w) { return esc(w.trim()); }).join(', ') + '</small>' : '') + '</p>' +
      '<button class="chip' + (staat.z && staat.z.slim ? ' aan' : '') + '" data-a="slim">' + (staat.z && staat.z.slim ? '✓ Slim zoeken staat aan' : 'Slim zoeken aanzetten') + '</button></div>';
  }
  function catKaart(x) {
    var pct = x.oud ? Math.round(100 * (x.oud - x.prijs) / x.oud) : 0;
    return '<article class="prod gekozen" data-key="' + esc(x.key) + '"><div class="labels">' + (pct ? '<span class="lab k">-' + pct + '%</span>' : '') + (x.populair ? '<span class="lab p">★ Populair</span>' : '') + '</div>' +
      '<div class="prod-beeld" data-zoom>' + beeld(x.foto, x.titel) + '</div>' +
      '<div class="prod-tekst"><span class="prod-merk">' + esc(x.winkel) + (x.merk ? ' · ' + esc(x.merk) : '') + '</span><span class="prod-titel" title="' + esc(x.titel) + '">' + esc(x.titel) + '</span>' +
      '<span class="prijs' + (pct ? ' k' : '') + '"><b>' + euro(x.prijs) + '</b>' + (pct ? '<s>' + euro(x.oud) + '</s>' : '') + '</span>' +
      '<button class="kies" data-uit>✕ Uit deze categorie</button></div></article>';
  }
  function zoekQuery() {
    var z = staat.z, q = ['cat=' + encodeURIComponent(staat.catId), 'pagina=' + (z.pagina || 1)];
    ['q', 'merk', 'partner', 'korting', 'pop', 'min', 'max', 'sort', 'slim'].forEach(function (k) { if (z[k]) q.push(k + '=' + encodeURIComponent(z[k])); });
    return '/api/zoek?' + q.join('&');
  }
  function zoekBalk() {
    var z = staat.z;
    return '<div class="gereedschap" id="zBalk">' +
        '<label class="zoekveld"><span aria-hidden="true">🔍</span><input id="zq" placeholder="' + (z.slim ? 'Verfijn binnen deze soort, bv. stitch of hout' : 'Wat zoek je? bv. horloge, muts, broodrooster') + '" value="' + esc(z.q || '') + '"></label>' +
        '<label class="zoekveld merkveld"><span aria-hidden="true">🏷️</span><input id="zm" list="zmLijst" autocomplete="off" placeholder="Merk, bv. Tommy Hilfiger" value="' + esc(z.merk || '') + '"><datalist id="zmLijst"></datalist></label>' +
        '<select id="zp"><option value="">Alle partners</option></select>' +
        '<button class="chip korting" data-t="korting">Afgeprijsd</button>' +
        '<button class="chip" data-t="pop">★ Populair</button>' +
        '<input type="number" id="zmin" placeholder="€ van" value="' + esc(z.min || '') + '"><input type="number" id="zmax" placeholder="€ tot" value="' + esc(z.max || '') + '">' +
        '<select id="zs">' + [['beste', 'Beste match eerst'], ['korting', 'Hoogste korting'], ['prijs-op', 'Prijs laag-hoog'], ['prijs-af', 'Prijs hoog-laag'], ['naam', 'Naam A-Z']].map(function (o) { return '<option value="' + o[0] + '"' + (z.sort === o[0] ? ' selected' : '') + '>' + o[1] + '</option>'; }).join('') + '</select>' +
      '</div><div id="zRes"></div>';
  }
  function zoekKliks() {
    var z = staat.z, t, tm, tl;
    var q = $('#zq'), m = $('#zm');
    var zoekNu = function () { clearTimeout(t); clearTimeout(tm); staat.z.q = q.value.trim(); staat.z.merk = m.value.trim(); tekenZoek(); };
    q.addEventListener('input', function () { clearTimeout(t); t = setTimeout(function () { staat.z.partner = ''; zoekNu(); }, 450); });
    q.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); staat.z.q = q.value.trim(); staat.z.partner = ''; zoekNu(); } });
    // merk: voorstellen terwijl je typt, zoeken bij Enter, bij het kiezen van een voorstel of als je het vak leegmaakt
    m.addEventListener('input', function (e) {
      var v = m.value.trim();
      if (!e.inputType || e.inputType === 'insertReplacementText' || !v) { staat.z.merk = v; staat.z.partner = ''; return zoekNu(); }
      clearTimeout(tl); tl = setTimeout(function () {
        get('/api/merken?q=' + encodeURIComponent(v)).then(function (r) {
          $('#zmLijst').innerHTML = (r.merken || []).map(function (x) { return '<option value="' + esc(x.naam) + '">' + tal(x.n) + ' producten</option>'; }).join('');
        });
      }, 150);
    });
    m.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); staat.z.merk = m.value.trim(); staat.z.partner = ''; zoekNu(); } });
    $('#zp').addEventListener('change', function (e) { staat.z.partner = e.target.value; zoekNu(); });
    $('#zs').addEventListener('change', function (e) { staat.z.sort = e.target.value; zoekNu(); });
    $('#zmin').addEventListener('change', function (e) { staat.z.min = e.target.value; zoekNu(); });
    $('#zmax').addEventListener('change', function (e) { staat.z.max = e.target.value; zoekNu(); });
    $('#zBalk').addEventListener('click', function (e) { var b = e.target.closest('.chip[data-t]'); if (b) { staat.z[b.dataset.t] = staat.z[b.dataset.t] ? '' : '1'; zoekNu(); } });
    $('#zRes').addEventListener('click', function (e) {
      var el = e.target.closest('.prod');
      if (!el) { if (e.target.closest('#zMeerBtn')) { staat.z.pagina = (staat.z.pagina || 1) + 1; tekenZoek(true); } return; }
      var p = (staat.zoekRes || []).find(function (y) { return y.key === el.dataset.key; }); if (!p) return;
      if (e.target.closest('[data-in]')) return inCat(p);
      if (e.target.closest('[data-zoom]')) return detailZoek(p);
    });
  }
  function tekenZoek(meer) {
    var z = staat.z, k = catVan(staat.catId), box = $('#cZoek'); if (!box || !k) return;
    if (!$('#zBalk')) { box.innerHTML = zoekBalk(); zoekKliks(); }
    if (!meer) z.pagina = 1;
    var res = $('#zRes');
    if (!meer) { res.style.minHeight = res.offsetHeight + 'px'; res.style.opacity = .55; }
    var vraag = zoekQuery(); staat.zoekVraag = vraag;
    get(vraag).then(function (d) {
      if (staat.zoekVraag !== vraag) return;           // er is intussen opnieuw gezocht
      res.style.opacity = 1;
      $('#zBalk').querySelectorAll('.chip[data-t]').forEach(function (b) { b.classList.toggle('aan', !!z[b.dataset.t]); });
      if (d.fout) { res.innerHTML = '<div class="leeg-melding">' + esc(d.fout) + '</div>'; res.style.minHeight = ''; return; }
      if (meer) { staat.zoekRes = staat.zoekRes.concat(d.producten); $('#zRaster').insertAdjacentHTML('beforeend', d.producten.map(zoekKaart).join('')); zoekMeer(d); return; }
      staat.zoekRes = d.producten;
      $('#zp').innerHTML = '<option value="">Alle partners' + (d.partners && d.partners.length ? ' (' + d.partners.length + ')' : '') + '</option>' +
        (d.partners || []).slice().sort(function (a, b) { return String(a.naam).localeCompare(String(b.naam), 'nl', { sensitivity: 'base' }); }).map(function (p) { return '<option value="' + esc(p.id) + '"' + (z.partner === p.id ? ' selected' : '') + '>' + esc(p.naam) + ' (' + tal(p.n) + ')</option>'; }).join('');
      var wat = (z.slim && k.zoek ? '<b>' + esc(k.naam) + '</b>' + (d.woorden && d.woorden.length ? ' + ' : '') : '') + (d.woorden && d.woorden.length ? '<b>' + esc(d.woorden.join(' + ')) + '</b>' : '') + (d.merk ? (d.woorden && d.woorden.length ? ' van merk ' : 'merk ') + '<b>' + esc(z.merk) + '</b>' : '');
      res.innerHTML = d.leeg && !z.slim ? '<div class="leeg-melding">Typ een zoekwoord (minimaal 3 letters) of een merk.</div>'
        : '<div class="zoek-info">' + tal(d.totaal) + ' producten gevonden' + (wat ? ' voor ' + wat : '') + '</div>' +
          (d.producten.length ? '<div class="raster" id="zRaster">' + d.producten.map(zoekKaart).join('') + '</div><div class="meer" id="zMeer"></div>'
            : '<div class="leeg-melding">Niets gevonden.' + (z.merk ? ' Klopt het merk? Kies een voorstel in het merkvak.' : ' Probeer een ander woord, bijvoorbeeld enkelvoud (muts in plaats van mutsen).') + '</div>');
      res.style.minHeight = '';
      zoekMeer(d);
    });
  }
  function zoekMeer(d) {
    var m = $('#zMeer'); if (!m) return;
    m.innerHTML = d.pagina < d.paginas ? '<button class="knop navy" id="zMeerBtn">Meer laden (' + tal(d.totaal - d.pagina * 60) + ' te gaan)</button>' : '';
  }
  function zoekKaart(p) {
    var k = catVan(staat.catId);
    return '<article class="prod' + (p.inCat ? ' gekozen' : '') + '" data-key="' + esc(p.key) + '">' +
      '<div class="labels">' + (p.o ? '<span class="lab k">-' + p.pct + '%</span>' : '') + (p.pop ? '<span class="lab p">★ Populair</span>' : '') +
        (p.v > 1 ? '<span class="lab v">' + p.v + ' varianten</span>' : '') + (p.gekozen && !p.inCat ? '<span class="lab v">Al in je lijst</span>' : '') + (p.opsite ? '<span class="lab s">Al op de site</span>' : '') + '</div>' +
      '<div class="prod-beeld" data-zoom>' + beeld(p.f, p.t) + '</div>' +
      '<div class="prod-tekst"><span class="prod-merk">' + esc(p.winkel) + (p.m ? ' · ' + esc(p.m) : '') + '</span><span class="prod-titel" title="' + esc(p.t) + '">' + esc(p.t) + '</span>' +
        '<span class="prijs' + (p.o ? ' k' : '') + '"><b>' + euro(p.p) + '</b>' + (p.o ? '<s>' + euro(p.o) + '</s>' : '') + '</span>' +
        '<button class="kies" data-in>' + (p.inCat ? '✓ In ' + esc(k.naam) : '+ In ' + esc(k.naam)) + '</button>' +
      '</div></article>';
  }
  function inCat(p) {
    var k = catVan(staat.catId);
    post('/api/kies', { partner: p.partner, key: p.key, cat: k.id }).then(function (r) {
      if (r.fout) return melding(r.fout);
      p.inCat = r.inCat; p.gekozen = r.gekozen;
      document.querySelectorAll('#zRaster .prod[data-key="' + p.key + '"]').forEach(function (el) { el.outerHTML = zoekKaart(p); });
      $('#lijstTeller').textContent = tal(r.aantal);
      melding((r.inCat ? 'In ' + k.naam + ' gezet' + extraUitleg(r) : 'Uit ' + k.naam + ' gehaald'), function () { if (catVan(k.id) && staat.catId === k.id) inCat(p); });
      var mk = $('#mIn'); if (mk) mk.textContent = r.inCat ? '✓ In ' + k.naam + ' (klik om weg te halen)' : '+ In ' + k.naam;
      get('/api/cats').then(function (c) { staat.cats = c.cats; tekenCatBoom(); });
      get('/api/lijst').then(function (l) {
        var erin = (l.producten || []).filter(function (x) { return (x.categorieen || []).indexOf(k.id) !== -1; });
        var kop = document.querySelector('.titel-rij span'); if (kop) kop.textContent = tal(erin.length) + ' gekozen';
        var sk = document.querySelector('.sectiekop small'); if (sk) sk.textContent = tal(erin.length);
        var ce = $('#cErin');
        if (ce) ce.innerHTML = erin.map(catKaart).join('');
        else if (erin.length) { var lm = document.querySelector('#cHoofd .leeg-melding.klein'); if (lm) { lm.outerHTML = '<div class="raster" id="cErin">' + erin.map(catKaart).join('') + '</div>'; tekenCatErinKlik(k, erin); } }
        if ($('#cErin')) tekenCatErinKlik(k, erin);
      });
    });
  }
  function tekenCatErinKlik(k, erin) {
    var ce = $('#cErin'); if (!ce || ce.dataset.klik) return; ce.dataset.klik = 1;
    ce.addEventListener('click', function (e) {
      var el = e.target.closest('.prod'); if (!el) return;
      if (e.target.closest('[data-uit]')) { var x = { key: el.dataset.key }; var z = (staat.zoekRes || []).find(function (y) { return y.key === x.key; });
        get('/api/lijst').then(function (l) { var y = (l.producten || []).find(function (q) { return q.key === x.key; }); if (!y) return;
          post('/api/kies', { partner: y.partner, key: y.key, cat: k.id }).then(function (r) { $('#lijstTeller').textContent = tal(r.aantal); melding('Uit ' + k.naam + ' gehaald'); if (z) { z.inCat = false; } tekenCat(); get('/api/cats').then(function (c) { staat.cats = c.cats; tekenCatBoom(); }); }); }); }
    });
  }
  function detailZoek(p) {
    var k = catVan(staat.catId), m = $('#modal');
    m.innerHTML = '<div class="mvenster"><div class="mb">' + beeld(p.f, p.t) + '</div><div class="mt"><button class="sluit" aria-label="Sluiten">✕</button>' +
      '<span class="prod-merk">' + esc(p.winkel) + (p.m ? ' · ' + esc(p.m) : '') + '</span><h3>' + esc(p.t) + '</h3>' +
      '<div class="pad">' + esc(p.winkel + ' › ' + (p.g || []).join(' › ')) + '</div>' +
      '<span class="prijs' + (p.o ? ' k' : '') + '"><b style="font-size:24px">' + euro(p.p) + '</b>' + (p.o ? '<s>' + euro(p.o) + '</s> <span class="lab k">-' + p.pct + '%</span>' : '') + '</span>' +
      '<div class="tags">' + (p.pop ? '<span>★ Populair bij de winkel</span>' : '') + (p.v > 1 ? '<span>' + p.v + ' varianten</span>' : '') + (p.k || []).map(function (x) { return '<span>' + esc(x) + '</span>'; }).join('') + '</div>' +
      '<div class="mknoppen"><button class="knop goud" id="mIn">' + (p.inCat ? '✓ In ' + esc(k.naam) + ' (klik om weg te halen)' : '+ In ' + esc(k.naam)) + '</button>' +
        (p.u || p.l ? '<a class="knop wit" target="_blank" rel="noopener" href="' + esc(p.u || p.l) + '">Bekijk in de winkel ↗</a>' : '') +
        '<a class="knop wit" href="#/p/' + esc(p.partner) + '">Naar ' + esc(p.winkel) + ' →</a></div></div></div>';
    m.hidden = false;
    m.onclick = function (e) { if (e.target === m || e.target.closest('.sluit')) { m.hidden = true; m.innerHTML = ''; } };
    $('#mIn').addEventListener('click', function () { inCat(p); });
  }

  /* ---------------- mijn nieuwe lijst ---------------- */
  function toonLijst() {
    staat.pid = null;
    Promise.all([get('/api/lijst?prijzen=1'), get('/api/cats')]).then(function (res) {
      var l = res[0]; staat.cats = res[1].cats; staat.lijstRuw = {}; (l.producten || []).forEach(function (x) { staat.lijstRuw[x.key] = x; });
      var P = l.producten || [];
      staat.producten = P.map(function (x) { return { key: x.key, partner: x.partner, t: x.titel, m: x.merk, p: x.prijs, o: x.oud, f: x.foto, l: x.link, u: x.winkelurl, g: x.groep, k: x.kenmerken, pop: x.populair, gekozen: true, notitie: x.notitie, pct: x.oud ? Math.round(100 * (x.oud - x.prijs) / x.oud) : 0, st: 1, v: 1, winkel: x.winkel, cats: x.categorieen || [], nu: x.prijs_nu, inFeed: x.in_feed, opsite: x.opsite }; });
      var winkels = {}; staat.producten.forEach(function (p) { winkels[p.winkel] = 1; });
      var blokken = [];
      var loop = function (ouder, d) {
        catKinderen(ouder).forEach(function (c) {
          var ps = staat.producten.filter(function (p) { return p.cats.indexOf(c.id) !== -1; });
          blokken.push({ titel: catPad(c.id).map(function (x) { return x.naam; }).join(' › '), d: d, ps: ps, link: '#/cat/' + c.id });
          loop(c.id, d + 1);
        });
      };
      loop(null, 1);
      var zonder = staat.producten.filter(function (p) { return !p.cats.some(function (id) { return catVan(id); }); });
      app.innerHTML = '<div class="binnen"><div class="lijst-kop"><div><h1>Mijn nieuwe productlijst</h1>' +
        '<p>' + tal(P.length) + (P.length === 1 ? ' product' : ' producten') + ' van ' + tal(Object.keys(winkels).length) + (Object.keys(winkels).length === 1 ? ' partner' : ' partners') + ' · ' + tal((staat.cats || []).length) + ' categorieën' + (l.bijgewerkt ? ' · bijgewerkt ' + esc(l.bijgewerkt) : '') + '</p></div>' +
        '<div class="veilig">🔒 Deze lijst blijft apart op je laptop. Er gaat niets naar de website tot jij en ik het samen doornemen.</div></div>' +
        (P.length || blokken.length ? blokken.map(function (b) {
          return '<div class="lgroep d' + b.d + '"><h2>' + esc(b.titel) + '</h2><span>' + tal(b.ps.length) + '</span><a class="kop-link" style="margin-left:auto;color:#13224A" href="' + b.link + '">Producten zoeken →</a></div>' +
            (b.ps.length ? '<div class="raster">' + b.ps.map(lijstKaart).join('') + '</div>' : '<div class="leeg-melding klein">Nog leeg.</div>');
        }).join('') +
        (zonder.length ? '<div class="lgroep"><h2>Nog zonder categorie</h2><span>' + tal(zonder.length) + '</span></div>' +
          '<div class="raster">' + zonder.map(lijstKaart).join('') + '</div>' : '')
        : '<div class="leeg-melding" style="margin-top:20px">Nog niets gekozen. Maak een categorie onder <b>Mijn categorieën</b>, of open een partner en klik op <b>+ Kiezen</b>.</div>') +
        '<div style="height:60px"></div></div>';
      app.querySelectorAll('.raster').forEach(function (r) {
        r.addEventListener('click', function (e) {
          var el = e.target.closest('.prod'); if (!el) return;
          var p = zoekProduct(el.dataset.key);
          if (e.target.closest('[data-weg]')) {
            bevestig('Uit je lijst halen?', p.t + ' gaat helemaal uit je nieuwe lijst (ook uit alle categorieën).', 'Ja, weghalen', function () {
              post('/api/kies', { partner: p.partner, key: p.key }).then(function (r) { $('#lijstTeller').textContent = tal(r.aantal); melding('Uit je lijst gehaald', r.weg ? function () { herstel(r.weg).then(toonLijst); } : null); toonLijst(); });
            });
          } else if (e.target.closest('[data-zoom]')) { detailLijst(p); }
        });
        r.addEventListener('change', function (e) {
          if (!e.target.classList.contains('notitie')) return;
          var el = e.target.closest('.prod');
          post('/api/notitie', { key: el.dataset.key, notitie: e.target.value }).then(function () { melding('Notitie bewaard'); });
        });
      });
    });
  }
  function lijstKaart(p) {
    return '<article class="prod gekozen" data-key="' + esc(p.key) + '">' +
      '<div class="labels">' + (p.o ? '<span class="lab k">-' + p.pct + '%</span>' : '') + (p.pop ? '<span class="lab p">★ Populair</span>' : '') +
        (p.opsite ? '<span class="lab s">Al op de site</span>' : '') + (p.inFeed === false ? '<span class="lab u">Niet meer in de feed</span>' : '') + '</div>' +
      '<div class="prod-beeld" data-zoom>' + beeld(p.f, p.t) + '</div>' +
      '<div class="prod-tekst"><span class="prod-merk">' + esc(p.winkel) + (p.m ? ' · ' + esc(p.m) : '') + '</span><span class="prod-titel" title="' + esc(p.t) + '">' + esc(p.t) + '</span>' +
        '<span class="prijs' + (p.o ? ' k' : '') + '"><b>' + euro(p.p) + '</b>' + (p.o ? '<s>' + euro(p.o) + '</s>' : '') + '</span>' +
        (p.nu != null && Math.abs(p.nu - p.p) >= 0.01 ? '<span class="prijs-nu ' + (p.nu < p.p ? 'lager' : 'hoger') + '">Prijs nu ' + euro(p.nu) + (p.nu < p.p ? ' ↓' : ' ↑') + '</span>' : '') +
        '<input class="notitie" placeholder="Notitie (bv. voor Sinterklaas)" value="' + esc(p.notitie || '') + '">' +
        '<button class="kies" data-weg>✕ Uit mijn lijst</button>' +
      '</div></article>';
  }
  function detailLijst(p) {
    var m = $('#modal');
    m.innerHTML = '<div class="mvenster"><div class="mb">' + beeld(p.f, p.t) + '</div><div class="mt"><button class="sluit">✕</button>' +
      '<span class="prod-merk">' + esc(p.winkel) + ' · ' + esc(p.m) + '</span><h3>' + esc(p.t) + '</h3><div class="pad">' + esc((p.g || []).join(' › ')) + '</div>' +
      '<span class="prijs' + (p.o ? ' k' : '') + '"><b style="font-size:24px">' + euro(p.p) + '</b>' + (p.o ? '<s>' + euro(p.o) + '</s>' : '') + '</span>' +
      '<div class="mknoppen">' + (p.u || p.l ? '<a class="knop wit" target="_blank" rel="noopener" href="' + esc(p.u || p.l) + '">Bekijk in de winkel ↗</a>' : '') + '</div></div></div>';
    m.hidden = false;
    m.onclick = function (e) { if (e.target === m || e.target.closest('.sluit')) { m.hidden = true; m.innerHTML = ''; } };
  }

  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { var m = $('#modal'); m.hidden = true; m.innerHTML = ''; } });
  teller();
  route();
})();
