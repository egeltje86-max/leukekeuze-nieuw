/* KERN voor de testvoorbeelden B, C en D van /nieuw/ (15-11-2026, opdracht Marius: 'ik wil nog meer voorbeelden zien').
   Laadt niets zelf: data.js, topkeuze.js en producten-lean.js staan vóór dit bestand in de pagina.
   Geeft window.KERN: producten, handgekozen toppen, personen, hulpjes, het lijstje (hartjes, gedeeld met voorbeeld A),
   een blad met details en de wisselbalk A · B · C · D. Niet in Google (noindex + robots.txt). */
(function () {
  'use strict';
  var ALLES = (window.LK_PRODUCTEN || []).filter(function (p) { return p.status === 'goedgekeurd' && p.beeld && !p.verborgen; });
  var PER = {}; ALLES.forEach(function (p) { PER[p.id] = p; });
  var TOP = Object.assign({}, window.LK_TOPKEUZE || {}, window.LK_TOPVAST || {});
  var PERSONEN = (window.LK_PERSONEN || []).filter(function (x) { return x.subs; });

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function euro(n) { var s = Number(n).toFixed(2).split('.'); return '€ ' + s[0] + ',' + s[1]; }
  function klein(p) { return '/' + p.beeld + '-klein.webp'; }
  function groot(p) { return '/' + p.beeld + '.webp'; }
  function sieraad(p) { return /sieraden|kettingen|armbanden|oorbellen|ringen/.test((p.groep || '') + ' ' + (p.vak || '') + ' ' + (p.sub || '')); }
  function drank(p) { return p.cat === 'dranken' || /wijn|whisk|gin|bier|champagne|prosecco|rum|port/.test((p.vak || '') + ' ' + (p.groep || '')); }
  function uitTop(k) { return (TOP[k] || []).map(function (id) { return PER[id]; }).filter(Boolean); }
  function uniek(l) { var g = {}; return l.filter(function (p) { if (!p || g[p.id]) return false; g[p.id] = 1; return true; }); }
  function reden(p) {
    if (p.kort) return p.kort;
    if (!p.waarom) return '';
    var m = String(p.waarom).match(/^[^.!?]{10,}[.!?]/); var z = (m ? m[0] : String(p.waarom)).trim();
    return z.length > 110 ? z.slice(0, 106).replace(/\s+\S*$/, '') + '…' : z;
  }
  /* zelfde regel als de echte site: geen directe winkelknop bij e-steps, e-bikes en RC op brandstof */
  function winkelLink(p) { var basis = '/p/' + p.id + '/'; return /elektrische-steps|elektrische-fietsen|op-brandstof/.test((p.vak || '') + ' ' + (p.sub || '')) ? basis : basis + '?naar=winkel'; }
  function productLink(p) { return '/p/' + p.id + '/'; }
  function schud(l, zaad) { var d = new Date(), s = d.getFullYear() * 400 + d.getMonth() * 31 + d.getDate() + (zaad || 0); return l.map(function (x) { s = (s * 9301 + 49297) % 233280; return [s / 233280, x]; }).sort(function (a, b) { return a[0] - b[0]; }).map(function (a) { return a[1]; }); }
  function ic(n) {
    var P = { pijl: '<path d="M5 12h14M13 6l6 6-6 6"/>', terug: '<path d="M19 12H5M11 6l-6 6 6 6"/>', hart: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z"/>', uit: '<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>', kruis: '<path d="M6 6l12 12M18 6 6 18"/>', zoek: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>', schud: '<path d="M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5"/>', opnieuw: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>' };
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (P[n] || '') + '</svg>';
  }

  /* lijstje: dezelfde bewaarplek als voorbeeld A */
  var LIJST = []; try { LIJST = JSON.parse(localStorage.getItem('lknieuw-lijst') || '[]'); } catch (e) {}
  function opLijst(id) { return LIJST.indexOf(id) !== -1; }
  function wissel(id) { var i = LIJST.indexOf(id); if (i === -1) LIJST.unshift(id); else LIJST.splice(i, 1); try { localStorage.setItem('lknieuw-lijst', JSON.stringify(LIJST)); } catch (e) {} tel(); return i === -1; }
  function tel() { var n = LIJST.filter(function (id) { return PER[id]; }).length; document.querySelectorAll('[data-teller]').forEach(function (t) { t.textContent = n; t.hidden = !n; }); }
  function hartKnop(p, klasse) { var a = opLijst(p.id); return '<button class="' + (klasse || 'k-hart') + '" type="button" data-hart="' + esc(p.id) + '" aria-pressed="' + a + '" aria-label="' + (a ? 'Van je lijstje halen' : 'Op je lijstje zetten') + '">' + ic('hart') + '</button>'; }
  document.addEventListener('click', function (e) {
    var h = e.target.closest && e.target.closest('[data-hart]'); if (!h) return;
    e.preventDefault(); e.stopPropagation();
    var id = h.getAttribute('data-hart'), aan = wissel(id);
    document.querySelectorAll('[data-hart="' + id + '"]').forEach(function (b) { b.setAttribute('aria-pressed', aan); });
  }, true);

  /* blad met details (gedeeld) */
  var stijl = document.createElement('style');
  stijl.textContent =
    '.k-wissel{position:relative;z-index:60;display:flex;align-items:center;justify-content:center;gap:6px;flex-wrap:wrap;padding:8px 12px;background:#141210;color:#E9E2D6;font:600 13px/1.2 Manrope,system-ui,sans-serif}' +
    '.k-wissel a{color:#E9E2D6;text-decoration:none;min-width:36px;min-height:32px;display:inline-grid;place-items:center;border-radius:999px;border:1px solid #4A443C;font-weight:800}' +
    '.k-wissel a[aria-current]{background:#FFC9B8;color:#141210;border-color:#FFC9B8}' +
    '.k-wissel .k-uit{border:0;text-decoration:underline;min-width:0;padding:0 4px;font-weight:600}' +
    '.k-blad{position:fixed;inset:0;z-index:80;background:rgba(20,18,16,.55);display:flex;align-items:flex-end;justify-content:center}' +
    '.k-blad[hidden]{display:none}' +
    '.k-doos{position:relative;background:#FFFDF9;color:#1C1A17;width:100%;max-width:640px;max-height:92dvh;overflow-y:auto;border-radius:26px 26px 0 0;padding:10px max(18px,env(safe-area-inset-left)) calc(20px + env(safe-area-inset-bottom));font:500 16px/1.5 Manrope,system-ui,sans-serif}' +
    '.k-greep{width:44px;height:5px;border-radius:3px;background:#D8CFC2;margin:6px auto 12px}' +
    '.k-sluit{position:absolute;right:12px;top:10px;width:44px;height:44px;border-radius:50%;border:0;background:#F1EBE2;display:grid;place-items:center;cursor:pointer}' +
    '.k-sluit svg{width:20px;height:20px}' +
    '.k-foto{background:#fff;border-radius:20px;aspect-ratio:1;overflow:hidden;border:1px solid #EFE6D8}' +
    '.k-foto img{width:100%;height:100%;object-fit:contain;padding:12px}' +
    '.k-doos h3{font:800 22px/1.2 Manrope,system-ui,sans-serif;letter-spacing:-.4px;margin:14px 0 6px}' +
    '.k-doos p{margin:0 0 14px;color:#4A443C}' +
    '.k-onder{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}' +
    '.k-prijs{font:800 24px/1 Manrope,system-ui,sans-serif;letter-spacing:-.5px}' +
    '.k-knop{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:50px;padding:0 20px;border-radius:999px;background:#1C1A17;color:#fff;text-decoration:none;font:800 15.5px/1 Manrope,system-ui,sans-serif}' +
    '.k-knop svg{width:18px;height:18px}' +
    '.k-klein{font-size:13.5px;color:#7A7166;margin:12px 0 0}';
  document.head.appendChild(stijl);
  var blad = document.createElement('div'); blad.className = 'k-blad'; blad.hidden = true; document.body.appendChild(blad);
  function openBlad(id) {
    var p = PER[id]; if (!p) return;
    blad.innerHTML = '<div class="k-doos" role="dialog" aria-modal="true" aria-label="' + esc(p.titel) + '"><div class="k-greep"></div><button class="k-sluit" type="button" data-sluit aria-label="Sluiten">' + ic('kruis') + '</button>' +
      '<div class="k-foto"><img src="' + groot(p) + '" alt="' + esc(p.titel) + '"></div><h3>' + esc(p.titel) + '</h3>' + (p.waarom ? '<p>' + esc(p.waarom) + '</p>' : '') +
      '<div class="k-onder"><span class="k-prijs">' + euro(p.prijs) + '</span>' + hartKnop(p, 'k-sluit') + '<a class="k-knop" href="' + winkelLink(p) + '" target="_blank" rel="sponsored nofollow noopener">Bekijk bij ' + esc(p.shop) + ' ' + ic('uit') + '</a></div>' +
      '<p class="k-klein">De prijs kan bij de winkel net anders zijn. <a href="' + productLink(p) + '" target="_blank">Alles over dit cadeau</a></p></div>';
    blad.querySelector('.k-onder .k-sluit').style.position = 'static';
    blad.hidden = false; document.body.style.overflow = 'hidden';
  }
  function sluitBlad() { blad.hidden = true; blad.innerHTML = ''; document.body.style.overflow = ''; }
  blad.addEventListener('click', function (e) { if (e.target === blad || e.target.closest('[data-sluit]')) sluitBlad(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !blad.hidden) sluitBlad(); });
  document.addEventListener('click', function (e) { var b = e.target.closest && e.target.closest('[data-blad]'); if (b) { e.preventDefault(); openBlad(b.getAttribute('data-blad')); } });

  /* wisselbalk A · B · C · D bovenaan */
  function wisselBalk(hier) {
    var d = document.createElement('div'); d.className = 'k-wissel';
    d.innerHTML = '<span>Testvoorbeeld</span>' + [['A', '/nieuw/'], ['B', '/nieuw/b/'], ['C', '/nieuw/c/'], ['D', '/nieuw/d/'], ['E', '/nieuw/e/'], ['F', '/nieuw/f/'], ['G', '/nieuw/g/'], ['H', '/nieuw/h/'], ['I', '/nieuw/i/'], ['J', '/nieuw/j/'], ['K', '/nieuw/k/'], ['L', '/nieuw/l/'], ['M', '/nieuw/m/'], ['N', '/nieuw/n/'], ['O', '/nieuw/o/']].map(function (x) { return '<a href="' + x[1] + '"' + (x[0] === hier ? ' aria-current="page"' : '') + '>' + x[0] + '</a>'; }).join('') + '<a class="k-uit" href="/">naar de gewone site</a>';
    document.body.insertBefore(d, document.body.firstChild);
  }

  window.KERN = { ALLES: ALLES, PER: PER, TOP: TOP, PERSONEN: PERSONEN, esc: esc, euro: euro, klein: klein, groot: groot, sieraad: sieraad, drank: drank, uitTop: uitTop, uniek: uniek, reden: reden, winkelLink: winkelLink, productLink: productLink, schud: schud, ic: ic, hartKnop: hartKnop, opLijst: opLijst, tel: tel, openBlad: openBlad, sluitBlad: sluitBlad, wisselBalk: wisselBalk, LIJST: function () { return LIJST.slice(); } };
})();
