/* CADEAUSTRAAT als homepage (21-11-2026, GO Marius: 'zet de cadeau website live, zet hem netjes over zodat Google niks merkt').
   De homepage is een winkelstraat: elke winkel is een groep afdelingen van de site, met in de etalage echte cadeaus en binnen meteen vier
   cadeaus per afdeling (dezelfde productkaart als overal). Alle adressen blijven gelijk: de straat gebruikt alleen #-adressen
   (#winkel-speelgoedwinkel-voor-tiener-tot-25), die Google niet als losse pagina's ziet. Beelden van Nova: images/straat/.
   Gemaakt uit het voorbeeld nieuw/straat/ (klassen met 'sh-' waar de site dezelfde naam al gebruikt; data-sh-… voor de knoppen).
   Uit: window.LK_STRAAT_AAN = false (dan weer de oude homepage). Testen zonder: ?proef=straat-uit, weer aan: ?proef=straat. */
(function () {
  'use strict';
  var K = null, esc, euro;
  function kernMaken() {
    var ALLES = (window.LK_PRODUCTEN || []).filter(function (p) { return p.status === 'goedgekeurd' && p.beeld && !p.verborgen && (!p.stil || window.LK_STIL_OOK === true); }); /* STIL (22-11-2026): stille producten staan niet in de straat */
    var PER = {}; ALLES.forEach(function (p) { PER[p.id] = p; });
    var TOP = Object.assign({}, window.LK_TOPKEUZE || {}, window.LK_TOPVAST || {});
    return {
      ALLES: ALLES, PER: PER, TOP: TOP,
      esc: function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); },
      euro: function (n) { var s = Number(n).toFixed(2).split('.'); return '€ ' + s[0] + ',' + s[1]; },
      klein: function (p) { return '/' + p.beeld + '-klein.webp'; },
      drank: function (p) { return p.cat === 'dranken' || /wijn|whisk|gin|bier|champagne|prosecco|rum|port/.test((p.vak || '') + ' ' + (p.groep || '')); },
      uitTop: function (k) { return (TOP[k] || []).map(function (id) { return PER[id]; }).filter(Boolean); },
      uniek: function (l) { var g = {}; return l.filter(function (p) { if (!p || g[p.id]) return false; g[p.id] = 1; return true; }); }
    };
  }
  function maak() {
  K = kernMaken(); esc = K.esc; euro = K.euro;
  var GEZ = window.LK_GEZOCHT || {};
  var GROF = /\b(fuck|f\*ck|kut|lul|piemel|pik|seks|sex|tieten|borsten|middelvinger|shit|bitch|klootzak)\b/i;

  /* Seizoen: 'mm-dd' tot en met 'mm-dd' */
  function inSeizoen(s) {
    if (!s) return true;
    var d = new Date(), md = ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
    return s[0] <= s[1] ? (md >= s[0] && md <= s[1]) : (md >= s[0] || md <= s[1]);
  }

  /* Een gang: g = 'afd/groep', v = 'afd/groep/vak', hoek = p2..p5 (fanhoeken), top = sleutel van een handgekozen top,
     filter = eigen regel. naar = de echte pagina. */
  var WINKELS = [
    { id: 'pakjeshuis', naam: 'Het Pakjeshuis', zin: 'Alles voor Sinterklaas: de schoen, de lootjes en pakjesavond.', k: '#B3261E', seizoen: ['10-15', '12-05'], label: 'Tot 5 december',
      extra: [['Lootjes trekken', '/lootjes-trekken/', 'h-lootjes-trekken'], ['Sint-gedicht laten maken', '/sint-rijmmachine/', 'h-sint-gedicht']],
      gangen: [
        { naam: 'In de schoen', top: '/collectie/schoencadeautjes', naar: '/collectie/schoencadeautjes', ic: 'nova:cad-schoencadeautjes' },
        { naam: 'Lootjes tot € 15', ook: 'cadeaus/sinterklaas', max: 15, wie: 'volw', top: '/c/cadeaus/sint-onder-15', naar: '/c/cadeaus/sint-onder-15', ic: 'nova:cad-sint-onder-15' },
        { naam: 'Voor de kinderen', ook: 'cadeaus/sinterklaas', wie: 'kind', top: '/voor/kinderen/sinterklaas', naar: '/voor/kinderen/sinterklaas', ic: 'nova:cad-voor-kinderen' },
        { naam: 'Voor tieners', ook: 'cadeaus/sinterklaas', wie: 'tiener', top: '/c/cadeaus/sinterklaas', naar: '/c/cadeaus/sinterklaas', ic: 'images/sub/rond/voor-tieners.webp' },
        { naam: 'Voor hem', ook: 'cadeaus/sinterklaas', wie: 'hem', top: '/c/cadeaus/sinterklaas?voor=hem', naar: '/c/cadeaus/sinterklaas?voor=hem', ic: 'nova:cad-voor-hem' },
        { naam: 'Voor haar', ook: 'cadeaus/sinterklaas', wie: 'haar', top: '/c/cadeaus/sinterklaas?voor=haar', naar: '/c/cadeaus/sinterklaas?voor=haar', ic: 'nova:cad-voor-haar' },
        { naam: 'Chocoladeletters & snoep', v: ['eten-drinken/chocolade-snoep/chocoladeletters', 'eten-drinken/chocolade-snoep/snoep-drop'], naar: '/c/eten-drinken/chocolade-snoep', ic: 'nova:cad-sinterklaas' }
      ] },
    { id: 'kerstmarkt', naam: 'De Kerstmarkt', zin: 'Kerstcadeaus voor iedereen, en alles om je huis gezellig te maken.', k: '#1F5B3A', seizoen: ['11-01', '12-26'], label: 'Tot Kerst',
      gangen: [
        { naam: 'Kerstcadeaus voor haar', ook: 'cadeaus/kerst', wie: 'haar', top: '/c/cadeaus/kerst?voor=haar', naar: '/c/cadeaus/kerst?voor=haar', ic: 'nova:cad-voor-haar' },
        { naam: 'Kerstcadeaus voor hem', ook: 'cadeaus/kerst', wie: 'hem', top: '/c/cadeaus/kerst?voor=hem', naar: '/c/cadeaus/kerst?voor=hem', ic: 'nova:cad-voor-hem' },
        { naam: 'Voor tieners', ook: 'cadeaus/kerst', wie: 'tiener', top: '/c/cadeaus/kerst?voor=tieners', naar: '/c/cadeaus/kerst?voor=tieners', ic: 'images/sub/rond/voor-tieners.webp' },
        { naam: 'Voor de kinderen', ook: 'cadeaus/kerst', wie: 'kind', top: '/c/cadeaus/kerst', naar: '/c/cadeaus/kerst', ic: 'nova:cad-voor-kinderen' },
        { naam: 'Voor opa en oma', ook: 'cadeaus/kerst', wie: 'opa-oma', top: '/c/cadeaus/kerst?voor=opa-oma', naar: '/c/cadeaus/kerst?voor=opa-oma', ic: 'nova:cad-opa-oma' },
        { naam: 'Voor een collega', ook: 'cadeaus/kerst', wie: 'collega', top: '/c/cadeaus/kerst?voor=collega', naar: '/c/cadeaus/kerst?voor=collega', ic: 'nova:cad-collega' },
        { naam: 'Kerst in huis', g: 'wonen/kerstdecoratie', naar: '/c/wonen/kerstdecoratie', ic: 'nova:cad-kerst' }
      ] },
    { id: 'speelgoedwinkel', naam: 'De Speelgoedwinkel', zin: 'Van rammelaar tot racebaan, voor elke leeftijd.', k: '#C8402E', ic: 'speelgoed',
      gangen: [
        { naam: 'LEGO & bouwen', g: 'speelgoed/bouwen' }, { naam: 'Poppen & knuffels', g: 'speelgoed/poppen-knuffels' },
        { naam: 'Auto’s, figuren & treinen', g: 'speelgoed/speelfiguren-voertuigen' }, { naam: 'Baby & peuter', g: 'speelgoed/baby-peuter' },
        { naam: 'Ontdekken & leren', g: 'speelgoed/leren-ontdekken' }, { naam: 'Knutselen', g: 'speelgoed/knutselen' },
        { naam: 'Buiten spelen', g: 'speelgoed/buiten-spelen' }, { naam: 'Verkleden & doen alsof', g: 'speelgoed/rollenspel-verkleden' },
        { naam: 'Spellen voor kinderen', g: 'spellen-puzzels/kinderspellen' }
      ] },
    { id: 'gamewinkel', naam: 'De Game- & fanwinkel', zin: 'Games, Pokémon, anime en alles voor echte fans.', k: '#5B3FA8', ic: 'images/sub/iconen/icoon-elektronica-gaming.webp',
      gangen: [
        { naam: 'Gaming', g: 'elektronica/gaming' },
        { naam: 'Pokémon', g: 'spellen-puzzels/pokemon-verzamelkaarten', hoek: 'p2' },
        { naam: 'One Piece & anime', g: 'speelgoed/one-piece-anime', hoek: 'p5' },
        { naam: 'Hello Kitty & vriendjes', g: 'speelgoed/hello-kitty', hoek: 'p3' },
        { naam: 'KPop Demon Hunters', g: 'speelgoed/kpop-demon-hunters', hoek: 'p4' }
      ] },
    { id: 'grappenmaker', naam: 'De Grappenmaker', zin: 'Cadeaus waar ze meteen om moeten lachen.', k: '#E07A1F', ic: 'images/sub/rond/col-grappige-cadeaus.webp',
      gangen: [
        { naam: 'Voor een collega', ook: 'cadeaus/grappig', wie: 'collega', top: '/collectie/grappige-cadeaus/collega', naar: '/collectie/grappige-cadeaus/collega', ic: 'images/sub/rond/voor-collega.webp' },
        { naam: 'Voor hem', ook: 'cadeaus/grappig', wie: 'hem', top: '/collectie/grappige-cadeaus/hem', naar: '/collectie/grappige-cadeaus/hem', ic: 'images/sub/rond/voor-hem.webp' },
        { naam: 'Voor haar', ook: 'cadeaus/grappig', wie: 'haar', top: '/collectie/grappige-cadeaus/haar', naar: '/collectie/grappige-cadeaus/haar', ic: 'images/sub/rond/voor-haar.webp' },
        { naam: 'Voor tieners', ook: 'cadeaus/grappig', wie: 'tiener', top: '/collectie/grappige-cadeaus/tieners', naar: '/collectie/grappige-cadeaus/tieners', ic: 'images/sub/rond/voor-tieners.webp' },
        { naam: 'Voor kinderen', ook: 'cadeaus/grappig', wie: 'kind', top: '/collectie/grappige-cadeaus/kinderen', naar: '/collectie/grappige-cadeaus/kinderen', ic: 'images/sub/rond/voor-kinderen.webp' }
      ] },
    { id: 'cadeausuper', naam: 'De Cadeausuper', zin: 'Alles kost hier hooguit € 15. Ideaal voor lootjes en de schoen.', k: '#2E8B57', super: 15, naar: '/c/cadeaus/onder-15', ic: 'images/sub/rond/col-kleine-cadeautjes.webp',
      gangen: [
        { naam: 'Speelgoed & spellen', afd: ['speelgoed', 'spellen-puzzels'], ic: 'speelgoed' }, { naam: 'Lampjes & wonen', afd: ['wonen'], ic: 'wonen' },
        { naam: 'Lekkers', afd: ['eten-drinken'], ic: 'eten-drinken' }, { naam: 'Mokken & keuken', afd: ['koken-tafelen'], ic: 'koken-tafelen' },
        { naam: 'Verwennen', afd: ['beauty-verzorging'], ic: 'beauty-verzorging' }, { naam: 'Snufjes & gaming', afd: ['elektronica'], ic: 'elektronica' },
        { naam: 'Sloffen, sokken & tassen', afd: ['mode-sieraden'], ic: 'mode-sieraden' }, { naam: 'Hobby & boeken', afd: ['hobby', 'boeken-media'], ic: 'hobby' }
      ] },
    { id: 'koffiehuis', naam: 'Het Koffiehuis', zin: 'Koffie, thee, koek, stroopwafels en chocolade. En een mooie mok erbij.', k: '#7A4A2A', ic: 'images/sub/iconen/icoon-eten-drinken-chocolade-snoep.webp',
      gangen: [
        { naam: 'Chocolade', v: ['eten-drinken/chocolade-snoep/chocolade'] },
        { naam: 'Koek & stroopwafels', v: ['eten-drinken/chocolade-snoep/koekjes-stroopwafels'] },
        { naam: 'Mokken & bekers', v: ['koken-tafelen/mokken-glazen/mokken-theeglazen'] },
        { naam: 'Snoep & drop', v: ['eten-drinken/chocolade-snoep/snoep-drop', 'eten-drinken/chocolade-snoep/snoep-met-een-boodschap'], naar: '/c/eten-drinken/chocolade-snoep' },
        { naam: 'Koffie & thee', v: ['eten-drinken/lekkernijen/koffie', 'eten-drinken/lekkernijen/thee', 'eten-drinken/lekkernijen/warme-chocolademelk'], naar: '/c/eten-drinken/lekkernijen' },
        { naam: 'Koffiezetten & theepotten', g: 'koken-tafelen/koffie-thee-zetten' },
        { naam: 'Pakketten & door de brievenbus', v: ['eten-drinken/cadeaupakketten/cadeaupakketten-manden', 'eten-drinken/cadeaupakketten/brievenbuscadeaus'], naar: '/c/eten-drinken/cadeaupakketten', ic: 'nova:col-cadeaupakketten' }
      ] },
    { id: 'woonwinkel', naam: 'De Woonwinkel', zin: 'Lampjes, kaarsen, plaids en dingen die een huis gezellig maken.', k: '#6E8B6A', ic: 'wonen',
      gangen: [
        { naam: 'Lampjes & licht', g: 'wonen/verlichting' }, { naam: 'Kaarsen & geur', g: 'wonen/kaarsen-geur' },
        { naam: 'Plaids & kussens', g: 'wonen/woontextiel' }, { naam: 'Decoratie', g: 'wonen/woondecoratie' },
        { naam: 'Met je eigen foto', g: 'wonen/foto-persoonlijk' }
      ] },
    { id: 'parfumerie', naam: 'De Parfumerie', zin: 'Geurtjes, verwensets en alles voor een rustig moment.', k: '#B0577A', ic: 'beauty-verzorging',
      gangen: [
        { naam: 'Parfum', g: 'beauty-verzorging/parfum' }, { naam: 'Cadeausets', g: 'beauty-verzorging/giftsets' },
        { naam: 'Bad, huid & spa', g: 'beauty-verzorging/bad-huid-spa' }, { naam: 'Haar & make-up', g: 'beauty-verzorging/make-up-haar' },
        { naam: 'Scheren & baard', g: 'beauty-verzorging/scheren-baard' }
      ] },
    { id: 'elektronicazaak', naam: 'De Elektronicazaak', zin: 'Speakers, koptelefoons, smartwatches en slimme snufjes.', k: '#3B4A5E', ic: 'elektronica',
      gangen: [
        { naam: 'Snufjes & gadgets', g: 'elektronica/gadgets' }, { naam: 'Koptelefoons & speakers', g: 'elektronica/audio' },
        { naam: 'Smartwatches', g: 'elektronica/smartwatches' }, { naam: 'Foto & video', g: 'elektronica/foto-video' },
        { naam: 'Tablets & slim wonen', g: 'elektronica/tablets-tv-slim-wonen' }
      ] },
    { id: 'spellenwinkel', naam: 'De Spellenwinkel', zin: 'Spellen voor op tafel, voor een feestje en puzzels voor lange avonden.', k: '#2A8C8C', ic: 'spellen-puzzels',
      gangen: [
        { naam: 'Kaart- & partyspellen', g: 'spellen-puzzels/kaart-partyspellen' }, { naam: 'Bordspellen', g: 'spellen-puzzels/bordspellen' },
        { naam: 'Puzzels', g: 'spellen-puzzels/puzzels' }, { naam: 'Breinbrekers & escape', g: 'spellen-puzzels/breinbrekers-escape' }
      ] },
    { id: 'boetiek', naam: 'De Boetiek', zin: 'Sieraden, horloges, tassen en sloffen.', k: '#0A1020', ic: 'mode-sieraden',
      gangen: [
        { naam: 'Sieraden', g: 'mode-sieraden/sieraden' }, { naam: 'Horloges', g: 'mode-sieraden/horloges' },
        { naam: 'Pantoffels & sloffen', g: 'mode-sieraden/schoenen-sloffen' }, { naam: 'Tassen & portemonnees', g: 'mode-sieraden/tassen-portemonnees' },
        { naam: 'Accessoires & paraplu’s', g: 'mode-sieraden/accessoires' }, { naam: 'Kleding', g: 'mode-sieraden/kleding' }
      ] },
    { id: 'sportwinkel', naam: 'De Sportwinkel', zin: 'Darts, balsport, buiten op avontuur en elektrische steps.', k: '#1D5FA8', ic: 'sport-outdoor',
      gangen: [
        { naam: 'Darts', g: 'sport-outdoor/darts' }, { naam: 'Balsport & spel', g: 'sport-outdoor/balsport-spel' },
        { naam: 'Buiten op avontuur', g: 'sport-outdoor/outdoor-avontuur' }, { naam: 'Fietsen & steps', g: 'sport-outdoor/fietsen-steps' },
        { naam: 'Fitness & yoga', g: 'sport-outdoor/fitness-yoga' }, { naam: 'Water & winter', g: 'sport-outdoor/water-wintersport' }
      ] },
    { id: 'boekhandel', naam: 'De Boekhandel', zin: 'Boeken voor jong en oud, en muziek en films.', k: '#2F5D50', ic: 'boeken-media',
      gangen: [
        { naam: 'Boeken', g: 'boeken-media/boeken' }, { naam: 'Kinderboeken', g: 'boeken-media/kinderboeken' }, { naam: 'Muziek & films', g: 'boeken-media/muziek-films' }
      ] },
    { id: 'hobbywinkel', naam: 'De Hobbywinkel', zin: 'Bestuurbare auto’s, modelbouw, schilderen en zelf maken.', k: '#B08417', ic: 'hobby',
      gangen: [
        { naam: 'Bestuurbare auto’s', g: 'hobby/rc-auto-s' }, { naam: 'Modelbouw & book nooks', g: 'hobby/modelbouw' },
        { naam: 'Schilderen & tekenen', g: 'hobby/schilderen-tekenen' }, { naam: 'Zelf maken', g: 'hobby/zelf-maken' },
        { naam: 'Breien, haken & naaien', g: 'hobby/handwerken' }, { naam: 'Papier & planners', g: 'hobby/papier-planners' },
        { naam: 'Muziek maken', g: 'hobby/muziek-maken' }
      ] },
    { id: 'kookwinkel', naam: 'De Kookwinkel', zin: 'Voor wie graag kookt, bakt en een mooie tafel dekt.', k: '#B5562F', ic: 'koken-tafelen',
      gangen: [
        { naam: 'Koken & bakken', g: 'koken-tafelen/koken-bakken' }, { naam: 'Tafelen & borrel', g: 'koken-tafelen/tafelen-borrel' },
        { naam: 'Glazen', v: ['koken-tafelen/mokken-glazen/glazen'] },
        { naam: 'Delicatessen', v: ['eten-drinken/lekkernijen/kaas-worst', 'eten-drinken/lekkernijen/sauzen-kruiden', 'eten-drinken/lekkernijen/noten-zoutjes'], naar: '/c/eten-drinken/lekkernijen' }
      ] },
    { id: 'slijterij', naam: 'De Slijterij', zin: 'Wijn, bubbels, whisky en gin. En glazen en karaffen erbij.', k: '#7A1F35', drank: true, ic: 'eten-drinken',
      let: 'Alleen voor wie 18 jaar of ouder is. De winkel kijkt zelf de leeftijd na.',
      gangen: [
        { naam: 'Wijn & bubbels', g: 'eten-drinken/wijn-bubbels' }, { naam: 'Whisky, gin & meer', g: 'eten-drinken/bier-sterke-drank' },
        { naam: 'Alcoholvrij', g: 'eten-drinken/alcoholvrij' }, { naam: 'Glazen, karaffen & cocktails', g: 'eten-drinken/drankaccessoires' }
      ] },
    { id: 'tuincentrum', naam: 'Het Tuincentrum', zin: 'Planten, vogelhuisjes, buiten zitten, klussen en iets voor je huisdier.', k: '#4F8A2E', ic: 'tuin-klussen',
      gangen: [
        { naam: 'Tuin & planten', g: 'tuin-klussen/tuin-planten' }, { naam: 'Buiten leven', g: 'tuin-klussen/buiten-leven' },
        { naam: 'Bloemen', v: ['eten-drinken/cadeaupakketten/bloemen-rozen'] },
        { naam: 'Klussen & gereedschap', g: ['tuin-klussen/klussen', 'tuin-klussen/tuingereedschap'], naar: '/c/tuin-klussen/klussen' },
        { naam: 'Voor de hond', g: 'dieren/hond' }, { naam: 'Voor de kat', g: 'dieren/kat' }, { naam: 'Andere dieren', g: 'dieren/andere-dieren' }
      ] },
    { id: 'uitjesbureau', naam: 'Het Uitjesbureau', zin: 'Een dag om nooit te vergeten: racen, vliegen, workshops en uitjes.', k: '#2A8FC1', ic: 'belevenissen',
      gangen: [
        { naam: 'Snelheid & avontuur', g: 'belevenissen/avontuur-snelheid' }, { naam: 'Op het water', g: 'belevenissen/water-strand' },
        { naam: 'Workshops & proeverijen', g: 'belevenissen/workshops-escape-proeven' }, { naam: 'Uitjes & natuur', g: 'belevenissen/uitjes-natuur' }
      ] },
    { id: 'christelijk', naam: 'De Christelijke boekwinkel', zin: 'Bijbels, doopcadeaus, kerststallen en teksten voor aan de muur.', k: '#23395B', ic: 'christelijk',
      gangen: [
        { naam: 'Doop, belijdenis & kinderen', g: 'christelijk/doop-belijdenis-kinderen', ic: 'images/sub/rond/chr-doop-belijdenis.webp' }, { naam: 'Bijbels & boeken', g: 'christelijk/bijbels-boeken', ic: 'images/sub/rond/chr-bijbels-psalmboeken.webp' },
        { naam: 'Kerst', g: 'christelijk/kerst', ic: 'images/sub/rond/chr-kerst.webp' }, { naam: 'Teksten aan de muur', g: 'christelijk/wanddecoratie-teksten', ic: 'images/sub/rond/chr-wanddecoratie-teksten.webp' },
        { naam: 'Sieraden', g: 'christelijk/sieraden', ic: 'images/sub/rond/chr-sieraden.webp' }
      ] }
  ].filter(function (w) { return inSeizoen(w.seizoen); });

  /* Wat in een handgekozen top staat, telt als 'etalage' (met de hand nagekeken). */
  var ETALAGE = {};
  Object.keys(K.TOP).forEach(function (k) { (K.TOP[k] || []).forEach(function (id, i) { if (ETALAGE[id] === undefined || i < ETALAGE[id]) ETALAGE[id] = i; }); });

  function magIn(w, p) {
    if (!w.drank && (p.drank || K.drank(p))) return false;
    if (w.drank && !(p.drank || K.drank(p) || p.afd === 'eten-drinken')) return false;
    if (GROF.test(p.titel)) return false;
    if (p.prijs < 3) return false;
    if (w.super && p.prijs > w.super) return false;
    return true;
  }
  var GRAP = {}; ['/collectie/grappige-cadeaus', '/collectie/grappige-cadeaus/hem', '/collectie/grappige-cadeaus/haar', '/collectie/grappige-cadeaus/kinderen', '/collectie/grappige-cadeaus/tieners', '/collectie/grappige-cadeaus/collega'].forEach(function (k) { (K.TOP[k] || []).forEach(function (id) { GRAP[id] = 1; }); });
  function ookVan(p, ook) { return (p.ookIn || []).indexOf(ook) !== -1 || (ook === 'cadeaus/grappig' && GRAP[p.id]); }
  function wieVan(p, wie) {
    if (!wie) return true;
    var v = p.voor || [];
    if (wie === 'volw') return v.some(function (x) { return /^(haar|hem|collega|opa-oma|iedereen)$/.test(x); });
    if (wie === 'kind') return v.indexOf('kind') !== -1 || v.indexOf('kinderen') !== -1;
    if (wie === 'tiener') return v.indexOf('tiener') !== -1;
    return v.indexOf(wie) !== -1 || (/^(hem|haar|collega)$/.test(wie) && v.indexOf('iedereen') !== -1);
  }
  function inGang(g, p) {
    var pad = p.afd + '/' + p.groep, vpad = pad + '/' + p.vak;
    if (g.hoek && p[g.hoek]) return true;
    if (g.g) { var gs = [].concat(g.g); if (gs.indexOf(pad) !== -1) return true; }
    if (g.v && g.v.indexOf(vpad) !== -1) return true;
    if (g.afd && g.afd.indexOf(p.afd) !== -1) return true;
    return false;
  }
  function naarVan(g) {
    if (g.naar) return g.naar;
    if (g.g) return '/c/' + [].concat(g.g)[0];
    if (g.v) return '/c/' + g.v[0];
    return '/';
  }
  function ordenen(lijst, sleutels) {
    var eerst = [];
    sleutels.forEach(function (s) { (GEZ[s] || []).slice(0, 3).forEach(function (id) { eerst.push(id); }); });
    sleutels.forEach(function (s) { (K.TOP[s] || []).forEach(function (id) { eerst.push(id); }); });
    var in_ = {}; lijst.forEach(function (p) { in_[p.id] = p; });
    var uit = [], gezien = {};
    eerst.forEach(function (id) { var p = in_[id]; if (p && !gezien[id]) { gezien[id] = 1; uit.push(p); } });
    var rest = lijst.filter(function (p) { return !gezien[p.id]; });
    rest.sort(function (a, b) {
      var ea = ETALAGE[a.id] === undefined ? 999 : ETALAGE[a.id], eb = ETALAGE[b.id] === undefined ? 999 : ETALAGE[b.id];
      if ((ea < 999) !== (eb < 999)) return ea < 999 ? -1 : 1;
      if (!!a.zk !== !!b.zk) return a.zk ? -1 : 1;
      return ea - eb;
    });
    return uit.concat(rest);
  }
  /* Niet twee bijna dezelfde naast elkaar: eerste twee woorden van de titel */
  function sleutelVan(p) { return String(p.titel).toLowerCase().replace(/[^a-z0-9à-ü ]/g, ' ').split(/\s+/).filter(Boolean).slice(0, 2).join(' '); }
  function spreid(lijst) {
    var uit = [], wacht = [], laatste = {};
    lijst.forEach(function (p) {
      var s = sleutelVan(p), v = p.vak;
      var bots = uit.slice(-3).some(function (q) { return sleutelVan(q) === s || (q.vak === v && uit.length < 4 && uit.filter(function (r) { return r.vak === v; }).length >= 2); });
      if (bots) wacht.push(p); else uit.push(p);
    });
    return uit.concat(wacht);
  }

  /* ===== Basis: per winkel en gang de geordende cadeaus, voor iedereen en elk bedrag (één keer) ===== */
  WINKELS.forEach(function (w) {
    w.gangen.forEach(function (g) {
      var lijst;
      if (g.ook) lijst = ordenen(K.ALLES.filter(function (p) { return magIn(w, p) && ookVan(p, g.ook) && wieVan(p, g.wie) && (!g.max || p.prijs <= g.max); }), [g.top, g.ook === 'cadeaus/grappig' ? '/collectie/grappige-cadeaus' : '/c/' + g.ook]);
      else if (g.top) lijst = K.uitTop(g.top).filter(function (p) { return magIn(w, p); });
      else {
        lijst = K.ALLES.filter(function (p) { return magIn(w, p) && inGang(g, p) && (!w.super || ETALAGE[p.id] !== undefined); });
        var sl = [];
        if (g.g) [].concat(g.g).forEach(function (x) { sl.push('/c/' + x); });
        if (g.v) g.v.forEach(function (x) { sl.push('/c/' + x); });
        if (g.afd) g.afd.forEach(function (x) { sl.push('/c/' + x); });
        if (w.super) sl.push('/c/cadeaus/onder-15', '/collectie/schoencadeautjes', '/collectie/kleine-cadeautjes');
        lijst = ordenen(lijst, sl);
      }
      g.basis = spreid(lijst);
    });
  });

  /* ===== Voor wie en hoeveel (21-11-2026, Marius: 'ja bouw dit': de straat bouwt zich om voor de persoon) =====
     Welke cadeaus bij een persoon horen komt uit assets/data/voorwie.js: precies wat op die Voor wie-pagina staat,
     met dezelfde regels (geen drank bij personen, cadeaus voor één soort persoon alleen daar, enz.). */
  var PERS = [
    { wie: '', knop: 'Iedereen', ic: 'voor-iedereen' },
    { wie: 'haar', knop: 'Haar', slug: 'haar', tekst: 'voor haar', ic: 'voor-haar' },
    { wie: 'hem', knop: 'Hem', slug: 'hem', tekst: 'voor hem', ic: 'voor-hem' },
    { wie: 'kind', knop: 'Kind', slug: 'kinderen', tekst: 'voor kinderen', ic: 'voor-kinderen' },
    { wie: 'tiener', knop: 'Tiener', slug: 'tieners', tekst: 'voor tieners', ic: 'voor-tieners' },
    { wie: 'opa-oma', knop: 'Opa & oma', slug: 'opa-oma', tekst: 'voor opa en oma', ic: 'voor-opa-oma' },
    { wie: 'collega', knop: 'Collega', slug: 'collega', tekst: 'voor collega’s', ic: 'voor-collega' },
    { wie: 'baby', knop: 'Baby', slug: 'baby', tekst: 'voor baby’s', ic: 'voor-baby' }
  ];
  var BEDRAG = [[0, 'Elk bedrag', '#FFFCF7'], [10, '€ 10', '#CDEFE0'], [15, '€ 15', '#FFE7A8'], [25, '€ 25', '#CFE3FA'], [50, '€ 50', '#E2D6F5']];
  var SET = {}, WIE_LABEL = {};
  function setVan(pr) {
    if (SET[pr.slug]) return SET[pr.slug];
    var x = ((window.LK_VOORWIE && window.LK_VOORWIE.personen) || []).filter(function (y) { return y.slug === pr.slug; })[0];
    if (x) { var o = {}; x.ids.forEach(function (id) { o[id] = 1; }); return (SET[pr.slug] = o); }
    /* voorwie.js is er nog niet (wordt geladen): even de labels van de cadeaus, daarna opnieuw tekenen */
    if (!WIE_LABEL[pr.wie]) { var l = {}; K.ALLES.forEach(function (p) { if (wieVan(p, pr.wie)) l[p.id] = 1; }); WIE_LABEL[pr.wie] = l; }
    return WIE_LABEL[pr.wie];
  }
  function persVan(wie) { return PERS.filter(function (x) { return x.wie === wie; })[0] || PERS[0]; }
  function gangWieOk(gw, wie) {
    if (!gw || !wie) return true;
    if (gw === 'volw') return /^(haar|hem|collega|opa-oma)$/.test(wie);
    return gw === wie;
  }
  function tekstBedrag(max) { return max ? 'tot € ' + max : ''; }

  var CACHE = {};
  function staat(wie, max) {
    var sleutel = wie + '|' + max + '|' + (window.LK_VOORWIE ? 1 : 0); if (CACHE[sleutel]) return CACHE[sleutel];
    var pr = persVan(wie), set = pr.slug ? setVan(pr) : null, ptop = pr.slug ? (K.TOP['/voor/' + pr.slug] || []) : [];
    var pIdx = {}; ptop.forEach(function (id, i) { if (pIdx[id] === undefined) pIdx[id] = i; });
    var alleUit = {};
    var winkels = WINKELS.map(function (w) {
      var alle = {}, gangen = [];
      w.gangen.forEach(function (g) {
        if (!gangWieOk(g.wie, wie)) return;
        var l = g.basis.filter(function (p) { return (!max || p.prijs <= max) && (!set || set[p.id]); });
        if (set) { /* wat met de hand voor deze persoon gekozen is eerst */
          var voor = l.filter(function (p) { return pIdx[p.id] !== undefined; }).sort(function (x, y) { return pIdx[x.id] - pIdx[y.id]; });
          l = spreid(voor.concat(l.filter(function (p) { return pIdx[p.id] === undefined; })));
        }
        if (l.length < 2) return;
        gangen.push({ g: g, lijst: l });
        l.forEach(function (p) { alle[p.id] = p; });
      });
      var ps = Object.keys(alle).map(function (id) { return alle[id]; });
      var raam = [], g2 = {};
      for (var r = 0; r < 12 && raam.length < 4; r++) gangen.forEach(function (x) { var p = x.lijst[r]; if (p && !g2[p.id] && raam.length < 4) { g2[p.id] = 1; raam.push(p); } });
      var open = ps.length >= 4 && raam.length >= 4;
      if (open) ps.forEach(function (p) { alleUit[p.id] = 1; });
      return { w: w, gangen: gangen, aantal: ps.length, van: ps.reduce(function (m, p) { return Math.min(m, p.prijs); }, 1e9), raam: raam, open: open };
    });
    var open = winkels.filter(function (x) { return x.open; }), dicht = winkels.filter(function (x) { return !x.open; });
    if (wie || max) open.sort(function (a, b) {
      var sa = a.w.seizoen ? 1 : 0, sb = b.w.seizoen ? 1 : 0;
      if (sa !== sb) return sb - sa;
      if (sa && sb) return WINKELS.indexOf(a.w) - WINKELS.indexOf(b.w);
      return b.aantal - a.aantal;
    });
    /* De etalage bovenaan: de beste cadeaus uit de handgekozen top van deze persoon */
    var bron = pr.slug ? ptop : K.uniek([].concat(inSeizoen(['10-15', '12-05']) ? (K.TOP['/c/cadeaus/sinterklaas'] || []).slice(0, 24) : [], K.TOP['/collectie/toppers-van-nu'] || [], K.TOP['/collectie/grappige-cadeaus'] || []).map(function (id) { return K.PER[id]; })).map(function (p) { return p.id; });
    var etalage = [], ge = {};
    bron.forEach(function (id) {
      var p = K.PER[id]; if (!p || ge[id]) return;
      if (max && p.prijs > max) return;
      if (set && !set[id]) return;
      if (p.drank || K.drank(p) || GROF.test(p.titel) || p.prijs < 3) return;
      ge[id] = 1; etalage.push(p);
    });
    var uit = { pr: pr, max: max, open: open, dicht: dicht, totaal: Object.keys(alleUit).length, etalage: spreid(etalage) };
    CACHE[sleutel] = uit; return uit;
  }

  /* Voor tests: de winkels en de berekening per persoon zijn van buiten te lezen. */
  window.LK_STRAAT = { winkels: WINKELS, staat: function (wie, max) { return staat(wie || '', max || 0); }, pers: PERS, gangIcoon: gangIcoon, rond: rond };

  /* ===== Adressen: #voor-tiener-tot-25, #winkel-gamewinkel-voor-tiener-tot-25, #tot-10 ===== */
  function adres(winkelId, wie, max) {
    var d = [];
    if (winkelId) d.push('winkel-' + winkelId);
    if (wie) d.push('voor-' + wie);
    if (max) d.push('tot-' + max);
    return '#' + (d.join('-') || 'straat');
  }
  function leesAdres() {
    var h = (location.hash || '').slice(1).replace(/\/$/, ''); /* netteLinks zet soms een / achter /#winkel-… */
    if (WINKELS.some(function (w) { return w.id === h; })) return { winkel: h, wie: '', max: 0 };
    var m = h.match(/^(?:winkel-([a-z]+))?-?(?:voor-(opa-oma|haar|hem|kind|tiener|collega|baby))?-?(?:tot-(\d+))?$/) || [];
    var max = +(m[3] || 0); if ([0, 10, 15, 25, 50].indexOf(max) === -1) max = 0;
    return { winkel: m[1] || '', wie: m[2] || '', max: max };
  }

  /* Beelden van Nova (NOVA-BOUTIQUE), map /images/straat/ */
  var NB = '/images/straat/';
  var NOVA_GEVEL = { kiosk: 1, pakjeshuis: 1, kerstmarkt: 1, speelgoedwinkel: 1, gamewinkel: 1, grappenmaker: 1, cadeausuper: 1, koffiehuis: 1, woonwinkel: 1, parfumerie: 1, elektronicazaak: 1,
    spellenwinkel: 1, boetiek: 1, sportwinkel: 1, boekhandel: 1, hobbywinkel: 1, kookwinkel: 1, slijterij: 1, tuincentrum: 1, uitjesbureau: 1, christelijk: 1, cadeauloket: 1 };
  var NOVA_CAT = { speelgoed: 1, 'spellen-puzzels': 1, elektronica: 1, 'mode-sieraden': 1, 'beauty-verzorging': 1, wonen: 1, 'koken-tafelen': 1, 'eten-drinken': 1, hobby: 1,
    'sport-outdoor': 1, 'tuin-klussen': 1, 'boeken-media': 1, dieren: 1, belevenissen: 1, christelijk: 1 };
  var NOVA_ROND = {};
  ('voor-iedereen voor-haar voor-hem voor-kinderen voor-tieners voor-opa-oma voor-collega voor-baby chr-bijbels-psalmboeken chr-boeken-muziek chr-doop-belijdenis chr-kerst chr-sieraden chr-voor-kinderen chr-wanddecoratie-teksten ' +
    'col-aanbiedingen col-adventskalenders col-black-friday col-brievenbuscadeaus col-cadeaupakketten col-grappige-cadeaus col-kortingscodes col-op-tijd-voor-pakjesavond col-originele-cadeaus col-persoonlijke-cadeaus col-schoencadeautjes col-toppers-van-nu ' +
    'cad-baby-kraam cad-collega cad-grappig cad-kerst cad-met-naam cad-onder-15 cad-opa-oma cad-schoencadeautjes cad-sint-onder-15 cad-sinterklaas cad-voor-haar cad-voor-hem cad-voor-kinderen').split(' ').forEach(function (n) { NOVA_ROND[n] = 1; });
  function novaRond(naam) { return NB + 'rond/' + naam + '-klein.webp'; }
  function rond(ic) {
    if (!ic) return '';
    if (/^nova:/.test(ic)) return novaRond(ic.slice(5));
    var m = /images\/sub\/rond\/((?:voor|chr|col|cad)-[a-z0-9-]+)\.webp$/.exec(ic);
    if (m && NOVA_ROND[m[1]]) return novaRond(m[1]);
    if (!/\.webp$/.test(ic)) return NOVA_CAT[ic] ? novaRond('cat-' + ic) : '/images/categorieen/rond/cat-' + ic + '.webp';
    return '/' + ic;
  }
  /* Boutique-rondje per afdeling. Waar Nova nog geen eigen rondje maakte, het best passende uit haar set (tijdelijk).
     Komt er een eigen rondje 'afd-<winkel>-<naam>', zet het dan hier. */
  var GANG_NB = {
    'koffiehuis|Koek & stroopwafels': 'icoon-eten-drinken-lekkernijen', 'koffiehuis|Koffie & thee': 'gel-beterschap', 'koffiehuis|Snoep & drop': 'gel-uitdeelcadeautjes',
    'tuincentrum|Bloemen': 'gel-moederdag', 'grappenmaker|Voor een collega': 'cad-collega', 'grappenmaker|Voor hem': 'cad-voor-hem', 'grappenmaker|Voor haar': 'cad-voor-haar', 'grappenmaker|Voor kinderen': 'cad-voor-kinderen'
  };
  /* Eigen rondjes van Nova per afdeling (NOVA-BOUTIQUE-007 en 008, 21-11-2026; 009/010 op 22-11: tassen, balsport, water & winter, tuingereedschap): rond/icoon-<afdeling>-<groep> */
  var NOVA_AFD = {};
  ('beauty-verzorging/bad-huid-spa beauty-verzorging/giftsets beauty-verzorging/make-up-haar beauty-verzorging/parfum beauty-verzorging/scheren-baard ' +
   'belevenissen/avontuur-snelheid belevenissen/uitjes-natuur belevenissen/water-strand belevenissen/workshops-escape-proeven ' +
   'boeken-media/boeken boeken-media/kinderboeken boeken-media/muziek-films dieren/andere-dieren dieren/hond dieren/kat ' +
   'elektronica/audio elektronica/foto-video elektronica/gadgets elektronica/gaming elektronica/smartwatches elektronica/tablets-tv-slim-wonen ' +
   'eten-drinken/alcoholvrij eten-drinken/bier-sterke-drank eten-drinken/cadeaupakketten eten-drinken/chocolade-snoep eten-drinken/drankaccessoires eten-drinken/lekkernijen eten-drinken/wijn-bubbels ' +
   'hobby/handwerken hobby/modelbouw hobby/muziek-maken hobby/papier-planners hobby/rc-auto-s hobby/schilderen-tekenen hobby/zelf-maken ' +
   'koken-tafelen/koffie-thee-zetten koken-tafelen/koken-bakken koken-tafelen/mokken-glazen koken-tafelen/tafelen-borrel ' +
   'mode-sieraden/accessoires mode-sieraden/horloges mode-sieraden/kleding mode-sieraden/schoenen-sloffen mode-sieraden/sieraden ' +
   'speelgoed/baby-peuter speelgoed/bouwen speelgoed/buiten-spelen speelgoed/knutselen speelgoed/leren-ontdekken speelgoed/poppen-knuffels speelgoed/rollenspel-verkleden speelgoed/speelfiguren-voertuigen ' +
   'spellen-puzzels/bordspellen spellen-puzzels/breinbrekers-escape spellen-puzzels/kaart-partyspellen spellen-puzzels/kinderspellen spellen-puzzels/puzzels ' +
   'sport-outdoor/balsport-spel sport-outdoor/darts sport-outdoor/fietsen-steps sport-outdoor/fitness-yoga sport-outdoor/outdoor-avontuur sport-outdoor/water-wintersport tuin-klussen/buiten-leven tuin-klussen/klussen tuin-klussen/tuin-planten tuin-klussen/tuingereedschap mode-sieraden/tassen-portemonnees ' +
   'wonen/foto-persoonlijk wonen/kaarsen-geur wonen/kerstdecoratie wonen/verlichting wonen/woondecoratie wonen/woontextiel').split(' ').forEach(function (n) { NOVA_AFD[n] = 1; });
  function gangIcoon(w, x) {
    var g = x.g;
    if (GANG_NB[w.id + '|' + g.naam]) return novaRond(GANG_NB[w.id + '|' + g.naam]);
    if (g.hoek && x.lijst[0]) return K.klein(x.lijst[0]);
    var y = g.g ? [].concat(g.g)[0] : (g.v ? g.v[0].split('/').slice(0, 2).join('/') : '');
    if (NOVA_AFD[y]) return novaRond('icoon-' + y.replace('/', '-'));
    if (g.ic) return rond(g.ic);
    return y ? '/images/sub/iconen/icoon-' + y.replace('/', '-') + '.webp' : novaRond('winkel-' + w.id);
  }
  /* NACHT (voorbeeld 23-11-2026, Marius: 'ik wil heel de site anders, dit is te oudbollig'; koos een cadeauboulevard bij nacht in goud en ijsblauw).
     Alleen met de klasse nacht op <html> (testlink ?proef=nacht). */
  function nacht() { return /(^| )nacht( |$)/.test(document.documentElement.className); }
  /* Winkels waarvan de nieuwe nachtgevel en -binnenkant al binnen zijn (images/straat/nacht/) */
  var NACHT_KLAAR = { boekhandel: 1, boetiek: 1, cadeauloket: 1, cadeausuper: 1, christelijk: 1, elektronicazaak: 1, gamewinkel: 1, grappenmaker: 1, hobbywinkel: 1, kerstmarkt: 1, kiosk: 1, koffiehuis: 1, kookwinkel: 1, pakjeshuis: 1, parfumerie: 1, slijterij: 1, speelgoedwinkel: 1, spellenwinkel: 1, sportwinkel: 1, tuincentrum: 1, uitjesbureau: 1, woonwinkel: 1 };
  function nb(id) { return nacht() && NACHT_KLAAR[id] ? NB + 'nacht/' : NB; }
  function getal(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }

  /* Gevel van Nova: beeld met doorzichtig etalagevak; de code zet naam, aantal, cadeaus en deur erop */
  var GV_SIZES = '(min-width:1000px) 270px, (min-width:700px) 31vw, 46vw';
  function gvBeeld(id) {
    return '<img class="gv-beeld" src="' + nb(id) + 'gevel-' + id + '-klein.webp" srcset="' + nb(id) + 'gevel-' + id + '-klein.webp 300w, ' + nb(id) + 'gevel-' + id + '.webp 600w" sizes="' + GV_SIZES + '" alt="" loading="lazy" decoding="async">';
  }
  function gvBord(naam) { return '<span class="gv-bord' + (naam.length > 19 ? ' sh-lang' : '') + '">' + esc(naam) + '</span>'; }
  /* Wat voor winkel het is, in gewone woorden (21-11-2026, Marius: 'alles te klein, het is moeilijk te zien wat voor winkel het is').
     Op de telefoon staat dit groot naast de gevel, op de computer eronder. */
  var WAT = { pakjeshuis: 'Sinterklaas', kerstmarkt: 'Kerst', speelgoedwinkel: 'Speelgoed', gamewinkel: 'Games & fans', grappenmaker: 'Grappige cadeaus',
    cadeausuper: 'Alles tot € 15', koffiehuis: 'Lekkers, koffie & thee', woonwinkel: 'Wonen & lampjes', parfumerie: 'Geur & verwennen',
    elektronicazaak: 'Elektronica & gadgets', spellenwinkel: 'Spellen & puzzels', boetiek: 'Sieraden, horloges & tassen', sportwinkel: 'Sport & buiten',
    boekhandel: 'Boeken, muziek & films', hobbywinkel: 'Hobby & zelf maken', kookwinkel: 'Koken & tafelen', slijterij: 'Wijn & drank',
    tuincentrum: 'Tuin, planten & dieren', uitjesbureau: 'Belevenissen & uitjes', christelijk: 'Christelijke cadeaus', kiosk: 'Cadeaugidsen' };
  /* Onder de gevel: groot in gewone woorden wat voor winkel het is, daaronder de vanaf-prijs. Zin en knop staan al op de gevel zelf. */
  function gvTekst(wat, zin, van, knop, dicht) {
    return '<span class="gv-onder' + (dicht ? ' gv-dicht' : '') + '"><b class="gv-wat">' + esc(wat) + '</b>' + (van ? '<span class="gv-tel">' + esc(van) + '</span>' : '') + '</span>';
  }
  /* Afdelingen in een winkel: dunne balkjes op één rij om opzij te vegen (21-11-2026, Marius: 'zet ze in een zijwaarts scrollende balk,
     dan kom je sneller bij de producten'; grote tegels gaven het gevoel dat je eerst moest kiezen). Rechts een zachte rand met pijltje als er meer is. */
  function wegwijzer(kop, links) {
    return '<nav class="plattegrond" aria-label="' + esc(kop) + '"><h2>' + esc(kop) + '</h2><div class="wegwijzer-rij"><div class="wegwijzer" data-sh-veeg>' + links.join('') + '</div>' +
      '<button class="veeg-pijl" type="button" data-sh-veegpijl aria-label="Meer ' + esc(kop.toLowerCase()) + '" hidden>›</button></div></nav>';
  }
  function gevelNova(x, st) {
    var w = x.w;
    if (!x.open) {
      var zin = st.pr.wie ? 'Niets ' + st.pr.tekst + (st.max ? ' ' + tekstBedrag(st.max) : '') : 'Niets ' + tekstBedrag(st.max);
      return '<a class="gevel nova dicht" href="' + adres(w.id, '', 0) + '" style="--k:' + w.k + '" aria-label="' + esc(w.naam + ': ' + zin + '. Toch kijken') + '">' +
        '<span class="gv"><span class="gv-raam toe"><b>' + esc(zin) + '</b></span>' + gvBeeld(w.id) + gvBord(w.naam) +
        '<span class="gv-deur">Toch kijken</span></span><span class="stoep"></span>' + gvTekst(WAT[w.id] || w.naam, zin, 'Rolluik dicht', 'Toch kijken', true) + '</a>';
    }
    return '<a class="gevel nova" href="' + adres(w.id, st.pr.wie, st.max) + '" style="--k:' + w.k + '" aria-label="' + esc(w.naam + ': ' + w.zin) + '">' +
      '<span class="gv"><span class="gv-raam">' + x.raam.map(function (p) { return '<span><img loading="lazy" decoding="async" src="' + K.klein(p) + '" alt=""></span>'; }).join('') + '</span>' +
      gvBeeld(w.id) + gvBord(w.naam) + '<span class="gv-deur">Naar binnen</span>' +
      (w.label ? '<span class="gv-label">' + esc(w.label) + '</span>' : '') + '</span><span class="stoep"></span>' +
      gvTekst(WAT[w.id] || w.naam, w.zin, 'vanaf ' + euro(x.van), 'Naar binnen') + '</a>';
  }
  /* Het Cadeauloket: de kieshulp (VONK) als eerste gevel van de straat */
  function loket(st) {
    var q = st.pr.wie && st.pr.wie !== 'baby' ? '?voor=' + st.pr.wie : '';
    return '<a class="gevel nova loket-gevel" href="' + ['', 'vonk', ''].join('/') + q + '" style="--k:#C9962E" aria-label="Het Cadeauloket: weet je het niet? Beantwoord drie vragen en krijg meteen ideeën">' +
      '<span class="gv"><span class="gv-raam loket"><img src="' + NB + 'rond/winkel-cadeauloket-klein.webp" alt="" loading="lazy"><b>Drie vragen, meteen ideeën</b></span>' +
      gvBeeld('cadeauloket') + gvBord('Het Cadeauloket') + '<span class="gv-deur">Vraag het loket</span></span><span class="stoep"></span>' +
      gvTekst('Weet je het niet?', 'Beantwoord drie vragen en krijg meteen cadeau-ideeën.', 'Onze kieshulp', 'Vraag het loket') + '</a>';
  }

  function gevel(x, st) {
    var w = x.w;
    if (NOVA_GEVEL[w.id]) return gevelNova(x, st);
    if (!x.open) {
      var zin = st.pr.wie ? 'Niets ' + st.pr.tekst + (st.max ? ' ' + tekstBedrag(st.max) : '') : 'Niets ' + tekstBedrag(st.max);
      return '<a class="gevel dicht" href="' + adres(w.id, '', 0) + '" style="--k:' + w.k + '" aria-label="' + esc(w.naam + ': ' + zin + '. Toch kijken') + '">' +
        '<span class="luifel"></span><span class="pui"><span class="bord">' + esc(w.naam) + '</span>' +
        '<span class="rolluik"><span>' + esc(zin) + '</span></span>' +
        '<span class="sh-aantal">Rolluik dicht</span><span class="deur"><b class="deurtje">Toch kijken</b></span></span><span class="stoep"></span></a>';
    }
    return '<a class="gevel" href="' + adres(w.id, st.pr.wie, st.max) + '" style="--k:' + w.k + '" aria-label="' + esc(w.naam + ': ' + w.zin) + '">' +
      '<span class="luifel"></span><span class="pui">' +
      (w.label ? '<span class="sh-seizoen">' + esc(w.label) + '</span>' : '') +
      '<span class="bord">' + esc(w.naam) + '</span><span class="sh-aantal">' + getal(x.aantal) + ' cadeaus</span>' +
      '<span class="raam">' + x.raam.map(function (p) { return '<span><img loading="lazy" src="' + K.klein(p) + '" alt=""></span>'; }).join('') + '</span>' +
      '<span class="deur"><b class="deurtje">Naar binnen</b></span>' +
      '</span><span class="stoep"></span></a>';
  }

  /* Kaartjes zoals in de testversie (21-11-2026, Marius: 'ik wil dat het is zoals op de testversie'): foto, naam, prijs in de kleur van de winkel, 'bij …'.
     Tik = het warme venster met foto, uitleg en de knop naar de winkel (die telt als klik, zie blad hieronder). */
  function kaart(p) {
    /* Korting alleen zoals de rest van de site hem toont: oudePrijs staat alleen in de lijst als hij klopt (vers, echte van-prijs of eigen prijsgeschiedenis) */
    var kort = p.oudePrijs > p.prijs ? Math.round((1 - p.prijs / p.oudePrijs) * 100) : 0;
    var echt = kort && p.laag30 && window.LK_ECHT_LAGER !== false;
    return '<a class="pk" href="/p/' + esc(p.id) + '/" data-sh-blad="' + esc(p.id) + '">' + /* een link: werkt ook al voordat de site helemaal geladen is */
      '<span class="pk-foto"><img loading="lazy" src="' + K.klein(p) + '" alt="">' + (kort >= 5 ? '<span class="pk-korting' + (echt ? ' echt' : '') + '">' + (echt ? 'Echt lager ' : '') + '-' + kort + '%</span>' : '') + '</span>' +
      '<span class="pk-t">' + esc(p.titel) + '</span>' +
      '<span class="pk-p">' + euro(p.prijs) + '</span>' + (kort ? '<s class="pk-oud">' + euro(p.oudePrijs) + '</s>' : '') +
      '<span class="pk-w">bij ' + esc(p.shop || '') + '</span></a>';
  }

  var PER_KEER = 4, MAX_IN_GANG = 12;
  function prijsPar(max) { return max === 50 ? 'r0-50' : 'tot' + max; } /* ?prijs=tot50 betekent in de oude lijst €25-50 (LK_PRIJS_OUD); r0-50 = tot €50 */
  /* Doorgaan naar de volledige collectie: persoon en bedrag gaan mee, zoals de gewone site ze kent (?voor=, ?prijs=tot..) */
  function metKeuze(naar, st) {
    var d = [];
    if (st.pr.slug && /^\/(c|collectie)\//.test(naar) && naar.indexOf('voor=') === -1) d.push('voor=' + st.pr.slug);
    if (st.max && /^\/(c|collectie|voor)\//.test(naar) && naar.indexOf('prijs=') === -1) d.push('prijs=' + prijsPar(st.max));
    return d.length ? naar + (naar.indexOf('?') === -1 ? '?' : '&') + d.join('&') : naar;
  }

  function kiezer(st) {
    var h = '<section class="kies" aria-label="Voor wie en hoeveel"><h2>Voor wie zoek je?</h2><div class="kies-wie">' +
      PERS.map(function (x) {
        var aan = x.wie === st.pr.wie;
        return '<a href="' + adres('', x.wie, st.max) + '" data-sh-kies class="' + (aan ? 'sh-aan' : '') + '"' + (aan ? ' aria-current="true"' : '') + '>' +
          '<span class="kr"><img src="' + novaRond(x.ic) + '" alt="" loading="lazy"></span><span class="kn">' + esc(x.knop) + '</span></a>';
      }).join('') + '</div><h2>Hoeveel mag het kosten?</h2><div class="kies-geld">' +
      BEDRAG.map(function (b) {
        var aan = b[0] === st.max;
        return '<a href="' + adres('', st.pr.wie, b[0]) + '" data-sh-kies class="' + (aan ? 'sh-aan' : '') + '"' + (aan ? ' aria-current="true"' : '') + ' style="--m:' + b[2] + '">' +
          '<span class="sh-munt">' + (b[0] ? '<small>tot</small>' + esc(b[1]) : 'Elk<br>bedrag') + '</span></a>';
      }).join('') + '</div></section>';
    return h;
  }

  /* Meteen naar een afdeling of gelegenheid (bestaande pagina's, met de rondjes van Nova) */
  var AFD = ['speelgoed', 'spellen-puzzels', 'elektronica', 'mode-sieraden', 'beauty-verzorging', 'wonen', 'koken-tafelen', 'eten-drinken',
    'hobby', 'sport-outdoor', 'tuin-klussen', 'boeken-media', 'dieren', 'belevenissen', 'christelijk'];
  var GEL_PAD = { kerst: 'c/cadeaus/kerst', sinterklaas: 'c/cadeaus/sinterklaas', geboorte: 'c/cadeaus/baby-kraam', valentijn: 'c/valentijn', 'doop-belijdenis': 'c/christelijk/doop-belijdenis-kinderen' };
  var GEL_VOLG = ['sinterklaas', 'kerst', 'verjaardag', 'bedankt', 'housewarming', 'geslaagd', 'beterschap', 'jubileum', 'juf-meester', 'afscheid-pensioen', 'geboorte', 'doop-belijdenis', 'uitdeelcadeautjes', 'moederdag', 'vaderdag', 'valentijn'];
  function pad(p) { return '/' + p + '/'; }
  /* Collecties: [slug, korte naam, rondje van Nova]; een collectie met een seizoen staat er alleen in dat seizoen */
  var COL = [['toppers-van-nu', 'Toppers van nu', 'col-toppers-van-nu'], ['grappige-cadeaus', 'Grappige cadeaus', 'col-grappige-cadeaus'],
    ['originele-cadeaus', 'Originele cadeaus', 'col-originele-cadeaus'], ['persoonlijke-cadeaus', 'Met naam of foto', 'col-persoonlijke-cadeaus'],
    ['kleine-cadeautjes', 'Kleine cadeautjes', 'cad-onder-15'], ['schoencadeautjes', 'Schoencadeautjes', 'col-schoencadeautjes'],
    ['op-tijd-voor-pakjesavond', 'Nog op tijd', 'col-op-tijd-voor-pakjesavond'], ['black-friday', 'Black Friday', 'col-black-friday'],
    ['adventskalenders', 'Adventskalenders', 'col-adventskalenders'], ['cadeaupakketten', 'Cadeaupakketten', 'col-cadeaupakketten'],
    ['brievenbuscadeaus', 'Brievenbuscadeaus', 'col-brievenbuscadeaus'], ['aanbiedingen', 'Aanbiedingen', 'col-aanbiedingen'],
    ['kortingscodes', 'Kortingscodes', 'col-kortingscodes']];
  /* Handig: [adres, naam, rondje van Nova, seizoen, extern] */
  var HANDIG = [[pad('lootjes-trekken'), 'Lootjes trekken', 'h-lootjes-trekken'], [pad('sint-rijmmachine'), 'Sint-gedicht', 'h-sint-gedicht', ['10-15', '12-05']],
    [pad('gids/surprise-maken'), 'Surprise maken', 'h-surprise-maken', ['10-15', '12-05']], [pad('vonk'), 'Kieshulp', 'h-kieshulp'],
    [pad('favorieten'), 'Mijn lijstje', 'h-verlanglijstje'], [pad('zoek'), 'Zelf zoeken', 'h-zelf-zoeken'],
    [pad('tiktok'), 'Gezien op TikTok', 'h-tiktok'], ['https://www.amazon.nl/shop/leukekeuze?tag=leukekeuze-21', 'Onze lijsten op Amazon', 'h-amazon-lijsten', null, true]];
  /* Lange namen breken netjes af op een vaste plek (zachte streepjes) */
  /* Lange namen breken netjes af op een vaste plek (zachte streepjes) */
  var AFBR = { Uitdeelcadeautjes: 'Uitdeel\u00ADcadeau\u00ADtjes', Housewarming: 'House\u00ADwarming', Belevenissen: 'Beleve\u00ADnissen', Elektronica: 'Elektro\u00ADnica', Schoencadeautjes: 'Schoen\u00ADcadeau\u00ADtjes', Aanbiedingen: 'Aan\u00ADbiedingen', Kortingscodes: 'Kortings\u00ADcodes', Sinterklaas: 'Sinter\u00ADklaas', Beterschap: 'Beter\u00ADschap', cadeautjes: 'cadeau\u00ADtjes', Brievenbuscadeaus: 'Brieven\u00ADbus\u00ADcadeaus', Adventskalenders: 'Advents\u00ADkalenders', Cadeaupakketten: 'Cadeau\u00ADpakketten', Verjaardag: 'Verjaar\u00ADdag', Christelijk: 'Christe\u00ADlijk',
    Koffiezetten: 'Koffie\u00ADzetten', theepotten: 'thee\u00ADpotten', partyspellen: 'party\u00ADspellen', Breinbrekers: 'Brein\u00ADbrekers',
    Smartwatches: 'Smart\u00ADwatches', Delicatessen: 'Delica\u00ADtessen', 'Accessoires': 'Acces\u00ADsoires', portemonnees: 'porte\u00ADmonnees',
    'Bestuurbare': 'Bestuur\u00ADbare', gereedschap: 'gereed\u00ADschap', Kinderboeken: 'Kinder\u00ADboeken', proeverijen: 'proeve\u00ADrijen',
    Chocoladeletters: 'Chocolade\u00ADletters', Kerstcadeaus: 'Kerst\u00ADcadeaus', stroopwafels: 'stroop\u00ADwafels', belijdenis: 'belijde\u00ADnis',
    Cadeausets: 'Cadeau\u00ADsets', Bordspellen: 'Bord\u00ADspellen', Modelbouw: 'Model\u00ADbouw', Koptelefoons: 'Kop\u00ADtelefoons', 'paraplu’s': 'para\u00ADplu’s',
    Sinterklaascadeau: 'Sinterklaas\u00ADcadeau', Sinterklaascadeaus: 'Sinterklaas\u00ADcadeaus', Sinterklaasgedicht: 'Sinterklaas\u00ADgedicht', hondenliefhebber: 'honden\u00ADliefhebber',
    Afscheidscadeau: 'Afscheids\u00ADcadeau', Adventskalender: 'Advents\u00ADkalender', schoonmoeder: 'schoon\u00ADmoeder', schoonvader: 'schoon\u00ADvader',
    huwelijksjubileum: 'huwelijks\u00ADjubileum', Valentijnscadeau: 'Valentijns\u00ADcadeau', schoonouders: 'schoon\u00ADouders', Kerstcadeau: 'Kerst\u00ADcadeau',
    Chocolade: 'Choco\u00ADlade', brievenbus: 'brieven\u00ADbus', volwassenen: 'volwas\u00ADsenen', Tieners: 'Tie\u00ADners', Pakketten: 'Pak\u00ADketten' };
  function afbr(t) { return esc(t).split(' ').map(function (w) { return AFBR[w] || w; }).join(' '); }
  function rondje(href, beeld, naam, buiten) { return '<a href="' + href + '"' + (buiten ? ' target="_blank" rel="sponsored noopener"' : '') + '><span class="kr"><img src="' + beeld + '" alt="" loading="lazy"></span><span class="kn">' + esc(naam).split(' ').map(function (w) { return AFBR[w] || w; }).join(' ') + '</span></a>'; }
  function snel() {
    var cats = window.LK_CATEGORIEEN || [], gels = window.LK_GELEGENHEDEN || [], cols = window.LK_COLLECTIES || [], verb = window.LK_COLLECTIE_VERBORGEN || [];
    var naamCat = function (s) { var c = cats.filter(function (x) { return x.slug === s; })[0]; return c ? (c.kort || c.naam) : s; };
    var g = GEL_VOLG.map(function (s) { return gels.filter(function (x) { return x.slug === s; })[0]; }).filter(function (x) { return x && inSeizoen(x.seizoen); });
    return '<section class="snel" aria-label="Meteen naar een afdeling, gelegenheid of collectie"><h2>Liever meteen naar een afdeling?</h2><div class="kies-wie">' +
      AFD.map(function (s) { return rondje(pad('c/' + s), novaRond('cat-' + s), naamCat(s)); }).join('') +
      rondje(pad('categorieen'), novaRond('h-alle-categorieen'), 'Alle producten') +
      '</div><h2>Of zoek op gelegenheid</h2><div class="kies-wie">' +
      g.map(function (x) { return rondje(pad(GEL_PAD[x.slug] || 'gelegenheid/' + x.slug), novaRond('gel-' + x.slug), x.naam); }).join('') +
      '</div><h2>Onze collecties</h2><div class="kies-wie">' +
      COL.filter(function (c) { var x = cols.filter(function (y) { return y.slug === c[0]; })[0]; return x && verb.indexOf(c[0]) === -1 && inSeizoen(x.seizoen); })
        .map(function (c) { return rondje(pad('collectie/' + c[0]), novaRond(c[2]), c[1]); }).join('') +
      '</div><h2>Handig</h2><div class="kies-wie">' +
      HANDIG.filter(function (x) { return inSeizoen(x[3]); }).map(function (x) { return rondje(x[0], novaRond(x[2]), x[1], x[4]); }).join('') + '</div></section>';
  }

  /* ===== KRAAMPJES (testversie 22-11-2026, alleen met ?proef=kraampjes; uit: ?proef=kraampjes-uit) =====
     Marius: 'ik dacht dat als je naar beneden scrolt je automatisch per 4 van de winkels ziet, een blokje van 4 van dit en een blokje van 4
     van dat, om minder te tikken en al een verscheidenheid van producten te zien zonder op een kraampje te drukken; 4 of 5 open kraampjes
     direct als producten van 4 en daaronder misschien nog meer: kijk in deze winkels'.
     Onder de etalage staan de eerste vijf open winkels als open kraampje: luifel in de kleur van de winkel, wat voor winkel het is en vier
     cadeaus (elk uit een andere afdeling van die winkel), 'Laat er nog 4 zien' (tot 12) en 'Naar binnen'. Geen cadeau twee keer:
     niet uit de etalage en niet uit een kraampje erboven. Daaronder 'Kijk ook in deze winkels' met de gevels van de rest.
     16:19 (Marius: 'we zouden het zo doen dat ze niet meer hoeven te klikken en we iedere categorie zouden zien als je naar beneden scrolt'):
     alle open winkels staan open (niet alleen de eerste vijf); onderaan alleen nog het Cadeauloket, de Kiosk en winkels met te weinig cadeaus. */
  var KRAAM_AANTAL = Infinity, KRAAM = [];
  /* 16:29 (Marius bij een schermafbeelding van een open kraampje: 'zo wil ik het hebben als je op voor hem klikt of voor haar en dat je dan
     kan scrollen en alle winkels zo ziet'): live voor iedereen zodra er een persoon gekozen is (/voor/hem, /voor/haar, /#voor-…).
     De homepage zonder keuze houdt de gevels. Zelf vergelijken: ?proef=kraampjes-uit (gevels) of ?proef=kraampjes (ook zonder keuze open). */
  function kraamAan(st) {
    if (window.LK_KRAAM === true) return true;
    if (window.LK_KRAAM === false) return false;
    var v = null;
    try {
      if (/[?&]proef=kraampjes-uit\b/.test(location.search)) localStorage.setItem('lkkraam', '0');
      else if (/[?&]proef=kraampjes\b/.test(location.search)) localStorage.setItem('lkkraam', '1');
      v = localStorage.getItem('lkkraam');
    } catch (e) {}
    if (v === '0') return false;
    if (v === '1') return true;
    return !!(st && st.pr && st.pr.wie);
  }
  function kraamLijst(x, al) {
    var uit = [], rij = {};
    for (var r = 0; r < 40 && uit.length < MAX_IN_GANG; r++) x.gangen.forEach(function (y) {
      var p = y.lijst[r];
      if (!p || al[p.id] || rij[p.id] || uit.length >= MAX_IN_GANG) return;
      if (p.drank || K.drank(p) || GROF.test(p.titel)) return;
      rij[p.id] = 1; uit.push(p);
    });
    return uit;
  }
  function kraampjes(st) {
    var al = {}, kr = [], rest = [];
    st.etalage.slice(0, MAX_IN_GANG).forEach(function (p) { al[p.id] = 1; });
    st.open.forEach(function (x) {
      if (kr.length >= KRAAM_AANTAL) { rest.push(x); return; }
      var l = kraamLijst(x, al);
      if (l.length < 4) { rest.push(x); return; }
      l.forEach(function (p) { al[p.id] = 1; });
      kr.push({ x: x, lijst: l });
    });
    KRAAM = kr.map(function (k) { return k.lijst; });
    var h = '<h2 class="straat-titel">' + (st.pr.wie || st.max ? 'Rondkijken in de winkels ' + esc(st.pr.wie ? st.pr.tekst : '') + (st.max ? ' ' + esc(tekstBedrag(st.max)) : '') : 'Rondkijken in de straat') + '</h2>' +
      '<p class="kraam-uitleg">Van elke winkel vier cadeaus. Scroll verder, of loop een winkel binnen voor de rest.</p>';
    h += kr.map(function (k, n) {
      var w = k.x.w, ic = NOVA_GEVEL[w.id] ? NB + 'rond/winkel-' + w.id + '-klein.webp' : '';
      return '<section class="gang top-etalage kraam" style="--k:' + w.k + '"><span class="luifel" aria-hidden="true"></span>' +
        '<div class="gang-kop">' + (ic ? '<img src="' + ic + '" alt="" loading="lazy">' : '') +
        '<div><small>' + esc(w.naam) + (w.label ? ' · ' + esc(w.label) : '') + '</small><h2>' + esc(WAT[w.id] || w.naam) + '</h2>' +
        '<span class="kraam-van">' + getal(k.x.aantal) + ' cadeaus, vanaf ' + euro(k.x.van) + '</span></div></div>' +
        '<div class="sh-schap" data-sh-schap="r' + n + '">' + k.lijst.slice(0, PER_KEER).map(kaart).join('') + '</div>' +
        '<div class="gang-voet">' + (k.lijst.length > PER_KEER ? '<button class="sh-meer" type="button" data-sh-meer="r' + n + '">Laat er nog ' + Math.min(PER_KEER, k.lijst.length - PER_KEER) + ' zien</button>' : '') +
        '<a class="naar" href="' + adres(w.id, st.pr.wie, st.max) + '">Naar binnen bij ' + esc(w.naam) + ' ›</a></div></section>';
    }).join('');
    h += '<div class="lampjes" aria-hidden="true"></div><h2 class="straat-titel">Kijk ook in deze winkels</h2>';
    h += '<section class="straat" aria-label="Meer winkels">' + loket(st) + rest.map(function (x) { return gevel(x, st); }).join('') + kioskGevel(st) + '</section>';
    return h;
  }
  function straat(st, opt) {
    opt = opt || {};
    var naam = st.pr.wie ? 'De straat ' + st.pr.tekst : 'De Cadeaustraat';
    if (TITEL0) document.title = st.pr.wie ? 'Cadeaus ' + st.pr.tekst + ' – LeukeKeuze' : TITEL0;
    var keuze = [st.pr.wie ? st.pr.knop : '', tekstBedrag(st.max)].filter(Boolean).join(' · ');
    /* COMBI (22-11-2026, voorbeeld): app.js kan boven de straat en onder de keuze voor wie iets zetten (de keuze cadeau of product, lootjes en rijmmachine) */
    var haak = function (n) { return typeof window[n] === 'function' ? window[n]() : ''; };
    var boven = haak('LK_STRAAT_BOVEN'), naKies = haak('LK_STRAAT_NA_KIES');
    /* 22-11-2026 (Marius: 'als je op voor haar klikt blijf je op de home page en zie je niet de winkel voor haar'):
       de straat voor een persoon (/voor/haar) begint meteen met 'De straat voor haar' en zijn winkels, niet met het welkomstbord
       van de homepage. Wie iemand anders wil kiezen, vindt de keuze onder de winkels ('andere keuze' springt erheen). */
    var kh = opt.voor ? 'h1' : 'h2';
    var kop = '<section class="straat-kop" id="straat-kop"><' + kh + '>' + esc(st.pr.wie ? naam : 'Alle winkels') + (st.max ? ' <span>' + esc(tekstBedrag(st.max)) + '</span>' : '') + '</' + kh + '>' +
      '<p class="stand"><b>' + st.open.length + ' winkels open</b> · ' + getal(st.totaal) + ' cadeaus' +
      (keuze ? ' · <button type="button" class="link" data-sh-naar-kies>andere keuze</button> · <a href="#straat" data-sh-kies>alles weer tonen</a>' : '') + '</p></section>';
    var h = opt.voor ? '<a class="terug" href="/">‹ Naar de hele Cadeaustraat</a>' + kop :
      boven + '<section class="welkom nova"><div class="sh-hero"><picture><source media="(min-width:700px)" srcset="' + NB + (nacht() ? 'straat-nacht-computer' : 'straat-hero-computer') + '.webp?v=2411">' +
      '<img src="' + NB + (nacht() ? 'straat-nacht-telefoon' : 'straat-hero-telefoon') + '.webp?v=2411" alt="" fetchpriority="high"></picture>' +
      '<h1 class="straatbord"><small>Welkom in de</small>Cadeaustraat</h1></div><div class="lampjes" aria-hidden="true"></div>' +
      '<p>Kies voor wie je zoekt. De straat zet dan alleen de winkels en cadeaus voor die persoon klaar.</p></section>' + kiezer(st) + naKies + kop;
    if (st.etalage.length) {
      h += '<section class="gang top-etalage"><div class="gang-kop"><img src="' + novaRond(st.pr.ic) + '" alt="" loading="lazy">' +
        '<div><small>De etalage</small><h2>' + esc(st.pr.wie ? 'Onze beste cadeaus ' + st.pr.tekst : 'Onze beste cadeaus van dit moment') + (st.max ? ' ' + esc(tekstBedrag(st.max)) : '') + '</h2></div></div>' +
        '<div class="sh-schap" data-sh-schap="top">' + st.etalage.slice(0, PER_KEER).map(kaart).join('') + '</div>' +
        '<div class="gang-voet">' + (st.etalage.length > PER_KEER ? '<button class="sh-meer" type="button" data-sh-meer="top">Laat er nog ' + Math.min(PER_KEER, st.etalage.length - PER_KEER) + ' zien</button>' : '') +
        '</div></section>'; /* 22-11-2026 (Marius: 'ik heb niet gevraagd om een knop naar alle cadeaus'): geen link 'Alle cadeaus voor …' meer; je bent al in de straat voor die persoon */
    }
    h += haak('LK_STRAAT_NA_ETALAGE');
    if (kraamAan(st)) h += kraampjes(st);
    else {
    h += '<div class="lampjes" aria-hidden="true"></div><h2 class="straat-titel">' + (st.pr.wie || st.max ? 'Deze winkels hebben iets ' + esc(st.pr.wie ? st.pr.tekst : '') + (st.max ? ' ' + esc(tekstBedrag(st.max)) : '') : 'Loop een winkel binnen') + '</h2>';
    h += '<section class="straat" aria-label="Open winkels">' + loket(st) + st.open.map(function (x) { return gevel(x, st); }).join('') + kioskGevel(st) + '</section>';
    }
    if (st.dicht.length) h += '<details class="dicht-blok"><summary>Rolluik dicht bij ' + st.dicht.length + (st.dicht.length === 1 ? ' winkel' : ' winkels') + ' <b><span class="toon">Toon ›</span><span class="verberg">Verberg</span></b></summary>' +
      '<section class="straat" aria-label="Gesloten winkels">' + st.dicht.map(function (x) { return gevel(x, st); }).join('') + '</section></details>';
    if (opt.voor) h += kiezer(st);
    h += haak('LK_STRAAT_ONDER');
    h += snel();
    return h;
  }

  function winkel(x, st) {
    var w = x.w;
    document.title = w.naam + ' – LeukeKeuze';
    var keuze = [st.pr.wie ? st.pr.tekst : '', tekstBedrag(st.max)].filter(Boolean).join(' ');
    var lijst = st.open, i = lijst.indexOf(x), buren = [];
    for (var n = 1; n < lijst.length && buren.length < 2; n++) { var b = lijst[(Math.max(i, 0) + n) % lijst.length]; if (b !== x) buren.push(b); }
    var h = '<a class="terug" href="' + adres('', st.pr.wie, st.max) + '">‹ Terug naar de straat' + (st.pr.wie ? ' ' + esc(st.pr.tekst) : '') + '</a><div class="lampjes" aria-hidden="true"></div>' +
      '<section class="binnen-kop gevel' + (NOVA_GEVEL[w.id] ? ' nova' : '') + '" style="--k:' + w.k + '"><span class="luifel"></span>' +
      (NOVA_GEVEL[w.id] ? '<span class="ik"><picture><source media="(min-width:700px)" srcset="' + nb(w.id) + 'interieur-' + w.id + '.webp">' +
        '<img src="' + nb(w.id) + 'interieur-' + w.id + '-telefoon.webp" alt=""></picture><img class="embleem" src="' + novaRond('winkel-' + w.id) + '" alt=""></span>' : '') +
      '<div class="pui">' +
      '<h1>' + esc(w.naam) + '</h1><p>' + esc(w.zin) + '</p>' +
      (keuze ? '<p class="filter">Je ziet alleen cadeaus <b>' + esc(keuze) + '</b> · <a href="' + adres(w.id, '', 0) + '">alles in deze winkel</a></p>' : '') +
      (x.aantal ? '<p class="tel">Cadeaus vanaf ' + euro(x.van) + '</p>' : '') +
      (w.let ? '<p class="let">' + esc(w.let) + '</p>' : '') +
      (w.extra ? '<div class="sh-extra">' + w.extra.map(function (e) { return '<a href="' + e[1] + '">' + (e[2] ? '<img src="' + novaRond(e[2]) + '" alt="">' : '') + esc(e[0]) + '</a>'; }).join('') + '</div>' : '') +
      '</div></section>';
    if (!x.gangen.length) {
      return h + '<p class="sh-leeg">Hier liggen geen cadeaus ' + esc(keuze) + '. <a href="' + adres(w.id, '', 0) + '">Bekijk alles in deze winkel</a>.</p>';
    }
    h += wegwijzer('Afdelingen', x.gangen.map(function (y, n) { return '<a href="' + adres(w.id, st.pr.wie, st.max) + '" data-sh-gang="' + n + '">' + esc(y.g.naam) + ' <small>' + y.lijst.length + '</small></a>'; }));
    x.gangen.forEach(function (y, n) {
      var naar = w.super ? w.naar : naarVan(y.g);
      naar = metKeuze(naar, st);
      h += '<section class="gang" id="gang-' + n + '"><div class="gang-kop"><img src="' + gangIcoon(w, y) + '" alt="" loading="lazy" onerror="this.style.visibility=\'hidden\'">' +
        '<div><small>Afdeling ' + (n + 1) + '</small><h2>' + afbr(y.g.naam) + '</h2></div></div>' +
        '<div class="sh-schap" data-sh-schap="' + n + '">' + y.lijst.slice(0, PER_KEER).map(kaart).join('') + '</div>' +
        '<div class="gang-voet">' + (y.lijst.length > PER_KEER ? '<button class="sh-meer" type="button" data-sh-meer="' + n + '">Laat er nog ' + Math.min(PER_KEER, y.lijst.length - PER_KEER) + ' zien</button>' : '') +
        '<a class="naar" href="' + naar + '">Alles uit deze afdeling ›</a></div></section>';
    });
    if (buren.length) h += '<section class="sh-verder"><h2>Verder in de straat</h2><div class="straat">' + buren.map(function (y) { return gevel(y, st); }).join('') + '</div>';
    h += '<a class="terug" href="' + adres('', st.pr.wie, st.max) + '">‹ Terug naar het begin van de straat</a>' + (buren.length ? '</section>' : '');
    return h;
  }

  var GIDS = {'schoencadeautjes':['Schoencadeautjes voor Sinterklaas','bol-9300000265640005'],
    'sinterklaascadeau-man':['Sinterklaascadeau voor een man of vader','dvzn-c15dcffb40'],
    'sinterklaascadeau-vrouw':['Sinterklaascadeau voor een vrouw of moeder','dvzn-29043e5ee8'],
    'surprise-maken':['Surprise ideeën','cl-amsterdam-meng'],
    'sinterklaasgedicht-maken':['Sinterklaasgedicht maken','bol-9300000039602281'],
    'adventskalender-kiezen':['Adventskalender kopen','bol-9300000186028245'],
    'kerstcadeau-kind':['Kerstcadeau voor een kind','woewoe-6e48434b3c'],
    'kerstcadeau-moeder':['Kerstcadeau voor je moeder','parfum-6aae891b32'],
    'kerstcadeau-vader':['Kerstcadeau voor je vader','dvzn-648493'],
    'kerstcadeau-vriendin':['Kerstcadeau voor je vriendin','dvzn-779391'],
    'kerstcadeau-vriend':['Kerstcadeau voor je vriend','bol-9300000252617200'],
    'klein-cadeau-man':['Klein cadeau voor een man','dvzn-c15dcffb40'],
    'klein-cadeautje-vrouw':['Klein cadeautje voor een vrouw','hema-efaa95f521'],
    'cadeau-10-euro':['Cadeau van 10 euro','lego-60312'],
    'cadeau-15-euro':['Cadeau van 15 euro','cg-chocolade-game-controller'],
    'cadeau-voor-opa':['Cadeau voor opa','dg-311a752fd8'],
    'cadeau-voor-vriend':['Cadeau voor je vriend','dvzn-648493'],
    'cadeau-voor-man':['Cadeau voor een man','dvzn-63fc8fc0bd'],
    'cadeau-voor-vrouw':['Cadeau voor een vrouw','parfum-45dbbae7b4'],
    'afscheidscadeau-collega':['Afscheidscadeau voor een collega','amz-9465708399'],
    'kerstcadeau-ideeen':['Kerstcadeau ideeën','dvzn-995816'],
    'cadeau-16-jaar':['Cadeau 16 jaar','dvzn-87965e50f5'],
    'cadeau-voor-schoonouders':['Cadeau voor je schoonvader of schoonmoeder','cl-12413'],
    'cadeau-25-euro':['Cadeau van 25 euro','dvzn-82c9fc5824'],
    'cadeau-50-euro':['Cadeau van 50 euro','dvzn-195987'],
    'cadeau-voor-broer':['Cadeau voor je broer','lego-77243'],
    'cadeau-50-jaar':['Cadeau 50 jaar','massa-8de12f27af'],
    'black-friday-2026':['Black Friday 2026','cl-airpods5'],
    'cadeau-18-jaar':['Cadeau 18 jaar','bol-9300000303263562'],
    'cadeau-zwangere-vrouw':['Cadeau voor een zwangere vrouw','sp-zwangerschapsdagboek'],
    'cadeau-13-jaar':['Cadeau 13 jaar','cl-minecraft'],
    'cadeau-14-jaar':['Cadeau 14 jaar','bol-9300000303263562'],
    'cadeau-30-jaar':['Cadeau 30 jaar','massa-9195e5bedc'],
    'cadeau-40-jaar':['Cadeau 40 jaar','dk-85478160d2'],
    'cadeau-60-jaar':['Cadeau 60 jaar','fs-crosley-tribute'],
    'cadeau-voetballer':['Cadeau voor een voetballer','cl-adidas-bal'],
    'kerstcadeau-ouders':['Kerstcadeau voor je ouders of schoonouders','mmf-63b16f5c97'],
    'kerstpakket-ideeen':['Kerstpakket ideeën','dk-00044934'],
    'cadeau-kind-1-jaar':['Cadeau voor een kind van 1 jaar','cl-vtech-speeltafel'],
    'cadeau-kind-2-jaar':['Cadeau voor een kind van 2 jaar','cl-duplo-10421'],
    'cadeau-kind-3-jaar':['Cadeau voor een kind van 3 jaar','cl-k-miele'],
    'cadeau-kind-4-jaar':['Cadeau voor een kind van 4 jaar','dg-73874cdb55'],
    'cadeau-kind-5-jaar':['Cadeau voor een kind van 5 jaar','lego-60312'],
    'cadeau-kind-6-jaar':['Cadeau voor een kind van 6 jaar','bol-9300000237345467'],
    'cadeau-kind-7-jaar':['Cadeau voor een kind van 7 jaar','lego-72045'],
    'cadeau-kind-8-jaar':['Cadeau voor een kind van 8 jaar','cl-bol-gravitrax-start'],
    'cadeau-kind-9-jaar':['Cadeau voor een kind van 9 jaar','cl-ko-kristal'],
    'cadeau-kind-10-jaar':['Cadeau voor een kind van 10 jaar','lego-77243'],
    'cadeau-kind-11-jaar':['Cadeau voor een kind van 11 jaar','cl-minecraft'],
    'cadeau-kind-12-jaar':['Cadeau voor een kind van 12 jaar','cl-hitster'],
    'kerstcadeau-tiener':['Kerstcadeau voor een tiener','tt-dvzn-d0fc92f962'],
    'noodpakket-checklist':['Noodpakket samenstellen','bol-9300000184877600'],
    'sinterklaascadeau-ideeen':['Sinterklaascadeau ideeën','dvzn-995816'],
    'sinterklaas-onder-10':['Sinterklaascadeaus onder de €10','bol-9300000157956217'],
    'speelgoed-van-het-jaar-2026':['Speelgoed van het Jaar 2026','bol-9300000246863962'],
    'sinterklaas-voor-volwassenen':['Sinterklaascadeaus voor volwassenen','cl-jvh-sint'],
    'kerstcadeau-onder-25':['Kerstcadeaus onder de €25','bol-9300000238623285'],
    'verlanglijstje-maken':['Verlanglijstje maken','cl-instax12'],
    'kerstcadeau-voor-haar':['Kerstcadeau voor een vrouw','parfum-45dbbae7b4'],
    'kerstcadeau-voor-hem':['Kerstcadeau voor een man','dvzn-332357'],
    'kerstcadeau-collega':['Kerstcadeau voor een collega of het hele team','bol-9300000237452859'],
    'kerststal-kopen':['Kerststal kopen','bol-9300000161906004'],
    'hypes-2026':['De hypes van 2026','bol-9300000236575345'],
    'virale-cadeaus-2026':['Virale cadeaus 2026','bol-9300000243481710'],
    'geuren-trends-2026':['Geuren die nu hot zijn','bol-9300000170836066'],
    'sinterklaas-onder-15':['Sinterklaascadeaus onder de €15','cl-kpop'],
    'cadeau-voor-collega':['Cadeau voor een collega','dvzn-c15dcffb40'],
    'cadeau-voor-pensioen':['Cadeau voor pensioen','bol-9300000171232502'],
    'cadeau-voor-vriendin':['Cadeau voor je vriendin','bol-9300000131876375'],
    'cadeau-voor-moeder':['Cadeau voor je moeder','cl-myka-mama'],
    'cadeau-voor-vader':['Cadeau voor je vader','bol-9300000083266771'],
    'cadeau-voor-oma':['Cadeau voor oma','cl-17724'],
    'cadeau-voor-zus':['Cadeau voor je zus','bol-9300000147583964'],
    'kraamcadeau':['Kraamcadeau','knufk-bambam-pakket'],
    'babyshower-cadeau':['Babyshower cadeau','bol-9300000136627314'],
    'housewarming-cadeau':['Housewarming cadeau','dvzn-530181'],
    'cadeau-hondenliefhebber':['Cadeau voor een hondenliefhebber','dvzn-358202'],
    'valentijnscadeau-voor-haar':['Valentijnscadeau voor haar','bp-l087'],
    'valentijnscadeau-voor-hem':['Valentijnscadeau voor hem','shelby-237b7f7f23'],
    'cadeau-1-jaar-samen':['Cadeau voor 1 jaar samen','ww-kaj73364965349'],
    'cadeau-trouwdag-jubileum':['Cadeau voor je trouwdag of huwelijksjubileum','lego-31214'],
    'kinderbijbel-kiezen':['Kinderbijbel kiezen','bol-9300000235874233'],
    'belevenis-cadeau':['Belevenis cadeau geven','dk-35d0e56982'],
    'kerstcadeau-opa-oma':['Kerstcadeau voor opa en oma',''],
    'sfeerlicht-donkere-avonden':['Sfeerlicht voor donkere avonden','']};
  /* De Kiosk (21-11-2026, punt van Nova): alle cadeaugidsen als rekken met tijdschriften. Gevel van Nova (NOVA-BOUTIQUE-007). */
  var KIOSK = { id: 'kiosk', naam: 'De Kiosk', zin: 'Onze cadeaugidsen: per persoon, per leeftijd, per bedrag en voor elk moment.', k: '#6F8F9C',
    gevel: 'kiosk', rekken: [
      { naam: 'Sinterklaas', ic: 'gel-sinterklaas', seizoen: ['10-15', '12-05'], gidsen: ['sinterklaascadeau-ideeen', 'schoencadeautjes', 'sinterklaas-onder-10', 'sinterklaas-onder-15', 'sinterklaascadeau-man', 'sinterklaascadeau-vrouw', 'sinterklaas-voor-volwassenen', 'surprise-maken', 'sinterklaasgedicht-maken'] },
      { naam: 'Kerst', ic: 'gel-kerst', seizoen: ['11-01', '12-26'], gidsen: ['kerstcadeau-ideeen', 'kerstcadeau-voor-haar', 'kerstcadeau-voor-hem', 'kerstcadeau-moeder', 'kerstcadeau-vader', 'kerstcadeau-vriendin', 'kerstcadeau-vriend', 'kerstcadeau-ouders', 'kerstcadeau-kind', 'kerstcadeau-tiener', 'kerstcadeau-opa-oma', 'kerstcadeau-collega', 'kerstcadeau-onder-25', 'kerstpakket-ideeen', 'adventskalender-kiezen', 'kerststal-kopen'] },
      { naam: 'Deals en trends', ic: 'col-toppers-van-nu', gidsen: ['black-friday-2026', 'hypes-2026', 'virale-cadeaus-2026', 'speelgoed-van-het-jaar-2026', 'geuren-trends-2026', 'sfeerlicht-donkere-avonden'] },
      { naam: 'Per persoon', ic: 'voor-iedereen', gidsen: ['cadeau-voor-vrouw', 'cadeau-voor-man', 'cadeau-voor-moeder', 'cadeau-voor-vader', 'cadeau-voor-vriendin', 'cadeau-voor-vriend', 'cadeau-voor-zus', 'cadeau-voor-broer', 'cadeau-voor-oma', 'cadeau-voor-opa', 'cadeau-voor-collega', 'cadeau-voor-schoonouders', 'cadeau-zwangere-vrouw', 'cadeau-voetballer', 'cadeau-hondenliefhebber', 'klein-cadeautje-vrouw', 'klein-cadeau-man'] },
      { naam: 'Kinderen per leeftijd', ic: 'voor-kinderen', gidsen: ['cadeau-kind-1-jaar', 'cadeau-kind-2-jaar', 'cadeau-kind-3-jaar', 'cadeau-kind-4-jaar', 'cadeau-kind-5-jaar', 'cadeau-kind-6-jaar', 'cadeau-kind-7-jaar', 'cadeau-kind-8-jaar', 'cadeau-kind-9-jaar', 'cadeau-kind-10-jaar', 'cadeau-kind-11-jaar', 'cadeau-kind-12-jaar'] },
      { naam: 'Tieners & volwassenen', ic: 'voor-tieners', gidsen: ['cadeau-13-jaar', 'cadeau-14-jaar', 'cadeau-16-jaar', 'cadeau-18-jaar', 'cadeau-30-jaar', 'cadeau-40-jaar', 'cadeau-50-jaar', 'cadeau-60-jaar'] },
      { naam: 'Per bedrag', ic: 'cad-onder-15', gidsen: ['cadeau-10-euro', 'cadeau-15-euro', 'cadeau-25-euro', 'cadeau-50-euro'] },
      { naam: 'Voor elk moment', ic: 'gel-verjaardag', gidsen: ['kraamcadeau', 'babyshower-cadeau', 'housewarming-cadeau', 'afscheidscadeau-collega', 'cadeau-voor-pensioen', 'cadeau-trouwdag-jubileum', 'cadeau-1-jaar-samen', 'belevenis-cadeau', 'valentijnscadeau-voor-haar', 'valentijnscadeau-voor-hem', 'kinderbijbel-kiezen', 'verlanglijstje-maken', 'noodpakket-checklist'] }
    ] };
  var GIDS_SEIZOEN = { 'black-friday-2026': ['11-01', '12-01'], 'valentijnscadeau-voor-haar': ['01-15', '02-14'], 'valentijnscadeau-voor-hem': ['01-15', '02-14'], 'adventskalender-kiezen': ['10-15', '12-24'] };
  /* Welke gidsen bij een persoon horen (op het adres van de gids) */
  var GIDS_WIE = { haar: /vrouw|moeder|vriendin|zus|oma|zwangere|voor-haar|ouders|^cadeau-(30|40|50|60)-jaar/, hem: /(^|-)man$|vader|vriend$|broer|opa|voetballer|voor-hem|ouders|^cadeau-(30|40|50|60)-jaar/,
    kind: /kind-|schoencadeautjes|sinterklaas-onder-10|speelgoed-van-het-jaar|kinderbijbel|adventskalender|kerstcadeau-kind/, tiener: /1[3468]-jaar|tiener|hypes|virale|sfeerlicht/,
    'opa-oma': /opa|oma|pensioen|schoonouders|ouders|trouwdag/, collega: /collega|10-euro|15-euro|sinterklaas-onder-15|klein-cadeau/, baby: /kraam|babyshower|kind-1-jaar|kind-2-jaar|zwangere/ };
  function gidsOk(slug, st) {
    if (!GIDS[slug] || !inSeizoen(GIDS_SEIZOEN[slug])) return false;
    if (st && st.pr.wie && GIDS_WIE[st.pr.wie] && !GIDS_WIE[st.pr.wie].test(slug)) return false;
    return true;
  }
  function kioskRekken(st) {
    return KIOSK.rekken.filter(function (r) { return inSeizoen(r.seizoen); }).map(function (r) {
      return { r: r, gidsen: r.gidsen.filter(function (sl) { return gidsOk(sl, st); }) };
    }).filter(function (x) { return x.gidsen.length; });
  }
  function gidsBeeld(sl) { var p = GIDS[sl] && K.PER[GIDS[sl][1]]; return p ? K.klein(p) : ''; }
  function gidsKaart(sl) {
    var b = gidsBeeld(sl);
    return '<a class="gids-k" href="' + pad('gids/' + sl) + '"><span class="gk-foto">' + (b ? '<img loading="lazy" src="' + b + '" alt="">' : '<img class="gk-leeg" loading="lazy" src="' + novaRond('winkel-kiosk') + '" alt="">') + '</span>' +
      '<span class="gk-t">' + afbr(GIDS[sl][0]) + '</span><span class="gk-l">Lees de gids ›</span></a>';
  }
  function kioskGevel(st) {
    var rek = kioskRekken(st), raam = [];
    rek.forEach(function (x) { x.gidsen.forEach(function (sl) { if (raam.length < 4 && gidsBeeld(sl) && raam.indexOf(sl) === -1) raam.push(sl); }); });
    if (raam.length < 4) return '';
    var w = KIOSK;
    return '<a class="gevel nova" href="' + adres('kiosk', st.pr.wie, st.max) + '" style="--k:' + w.k + '" aria-label="De Kiosk: onze cadeaugidsen">' +
      '<span class="gv"><span class="gv-raam kiosk">' + raam.map(function (sl) { return '<span><img loading="lazy" decoding="async" src="' + gidsBeeld(sl) + '" alt=""></span>'; }).join('') + '</span>' +
      gvBeeld(w.gevel) + gvBord(w.naam) + '<span class="gv-deur">Naar binnen</span></span><span class="stoep"></span>' + gvTekst(WAT.kiosk, w.zin, 'Alle cadeaugidsen', 'Naar binnen') + '</a>';
  }
  function kiosk(st) {
    var w = KIOSK, rek = kioskRekken(st);
    document.title = w.naam + ' – LeukeKeuze';
    var h = '<a class="terug" href="' + adres('', st.pr.wie, st.max) + '">‹ Terug naar de straat' + (st.pr.wie ? ' ' + esc(st.pr.tekst) : '') + '</a><div class="lampjes" aria-hidden="true"></div>' +
      '<section class="binnen-kop gevel nova kiosk-kop" style="--k:' + w.k + '"><span class="luifel"></span><span class="ik ik-leeg"><img class="embleem" src="' + novaRond('winkel-kiosk') + '" alt=""></span>' +
      '<div class="pui"><h1>' + esc(w.naam) + '</h1><p>' + esc(w.zin) + '</p>' +
      (st.pr.wie ? '<p class="filter">Je ziet alleen gidsen <b>' + esc(st.pr.tekst) + '</b> · <a href="' + adres('kiosk', '', 0) + '">alle gidsen</a></p>' : '') + '</div></section>';
    h += wegwijzer('Rekken', rek.map(function (x, n) { return '<a href="' + adres('kiosk', st.pr.wie, st.max) + '" data-sh-gang="' + n + '">' + esc(x.r.naam) + ' <small>' + x.gidsen.length + '</small></a>'; }));
    rek.forEach(function (x, n) {
      h += '<section class="gang" id="gang-' + n + '"><div class="gang-kop"><img src="' + novaRond(x.r.ic) + '" alt="" loading="lazy"><div><small>Rek ' + (n + 1) + '</small><h2>' + afbr(x.r.naam) + '</h2></div></div>' +
        '<div class="sh-schap" data-sh-schap="k' + n + '">' + x.gidsen.slice(0, PER_KEER).map(gidsKaart).join('') + '</div>' +
        (x.gidsen.length > PER_KEER ? '<div class="gang-voet"><button class="sh-meer" type="button" data-sh-kmeer="' + n + '">Laat er nog ' + Math.min(PER_KEER, x.gidsen.length - PER_KEER) + ' zien</button></div>' : '') + '</section>';
    });
    h += '<a class="terug" href="' + adres('', st.pr.wie, st.max) + '">‹ Terug naar het begin van de straat</a>';
    return h;
  }

  var huidig = null;
  function render() {
    var a = leesAdres(), st = staat(a.wie, a.max);
    var x = a.winkel ? st.open.concat(st.dicht).filter(function (y) { return y.w.id === a.winkel; })[0] : null;
    huidig = x ? { x: x, st: st } : { st: st };
    if (a.winkel === 'kiosk') { huidig = { kiosk: kioskRekken(st), st: st }; return { html: '<div class="sh"><div class="sh-binnen" style="--k:' + KIOSK.k + '">' + kiosk(st) + '</div></div>', binnen: true }; }
    return { html: '<div class="sh">' + (x ? '<div class="sh-binnen" style="--k:' + x.w.k + '">' + winkel(x, st) + '</div>' : straat(st)) + '</div>', binnen: !!x };
  }
  /* ===== WINKELSTIJL (21-11-2026, Marius: 'elke categorie moet een winkel worden, zodat je elke soort cadeau kunt zien als je scrolt,
     in plaats van bovenaan die suffe knoppen'). Elke pagina met cadeaus (afdeling, groep, soort, onderwerp van Voor wie, gelegenheid, collectie)
     ziet eruit als een winkel in de straat: bovenaan de winkel (interieur van Nova, of een luifel met het rondje), dan de soorten op één rij
     om opzij te vegen, dan de etalage (de handgekozen top van die pagina) en per soort vier cadeaus. Onderaan de hele lijst met sorteren en
     filteren (?alles=1). De lijst en de volgorde komen van app.js (vaste top, keurmeester, drank, smal): er verandert niets aan wélke cadeaus
     ergens staan, alleen hoe je ze ziet. Zelfde adressen; zoekmachines krijgen de pagina's zoals ze waren. ===== */
  var AFD_WINKEL = { speelgoed: 'speelgoedwinkel', 'spellen-puzzels': 'spellenwinkel', elektronica: 'elektronicazaak', 'mode-sieraden': 'boetiek',
    'beauty-verzorging': 'parfumerie', wonen: 'woonwinkel', 'koken-tafelen': 'kookwinkel', 'eten-drinken': 'koffiehuis', hobby: 'hobbywinkel',
    'sport-outdoor': 'sportwinkel', 'tuin-klussen': 'tuincentrum', 'boeken-media': 'boekhandel', dieren: 'tuincentrum', belevenissen: 'uitjesbureau', christelijk: 'christelijk',
    'cadeaus/sinterklaas': 'pakjeshuis', 'cadeaus/sint-onder-15': 'cadeausuper', 'cadeaus/kerst': 'kerstmarkt', 'cadeaus/onder-15': 'cadeausuper', 'cadeaus/onder-10': 'cadeausuper',
    'cadeaus/grappig': 'grappenmaker', 'eten-drinken/wijn-bubbels': 'slijterij', 'eten-drinken/bier-sterke-drank': 'slijterij', 'eten-drinken/alcoholvrij': 'slijterij',
    'eten-drinken/drankaccessoires': 'slijterij', 'elektronica/gaming': 'gamewinkel',
    'spellen-puzzels/pokemon-verzamelkaarten': 'gamewinkel', 'speelgoed/hello-kitty': 'gamewinkel', 'speelgoed/kpop-demon-hunters': 'gamewinkel', 'speelgoed/one-piece-anime': 'gamewinkel',
    'gelegenheid/sinterklaas': 'pakjeshuis', 'gelegenheid/kerst': 'kerstmarkt', 'collectie/schoencadeautjes': 'pakjeshuis', 'collectie/op-tijd-voor-pakjesavond': 'pakjeshuis',
    'collectie/grappige-cadeaus': 'grappenmaker', 'collectie/kleine-cadeautjes': 'cadeausuper' };
  function winkelVan(sleutels) { for (var i = 0; i < sleutels.length; i++) { var id = AFD_WINKEL[sleutels[i]]; if (id) { var w = WINKELS.filter(function (x) { return x.id === id; })[0]; if (w) return w; } } return null; }
  function catVan(afd) { return (window.LK_CATEGORIEEN || []).filter(function (c) { return c.slug === afd; })[0] || null; }
  function subVan(afd, groep) { var c = catVan(afd); return c && c.subs ? c.subs.filter(function (x) { return x.slug === groep; })[0] || null : null; }
  function groepIcoon(afd, groep) {
    if (NOVA_AFD[afd + '/' + groep]) return novaRond('icoon-' + afd + '-' + groep);
    var sb = subVan(afd, groep); return sb && sb.beeld ? '/' + sb.beeld : '';
  }
  /* Een lijst met cadeaus uit allerlei hoeken in soorten delen: per groep van de site, in de volgorde waarin ze in de lijst opduiken
     (dus de soort met de beste handgekozen cadeaus eerst), alleen soorten met minstens 4 cadeaus, hooguit 18. */
  function deelPerGroep(lijst) {
    var idx = {}, uit = [];
    lijst.forEach(function (p) {
      if (!p.afd || !p.groep) return;
      var k = p.afd + '/' + p.groep;
      if (!idx[k]) { var sb = subVan(p.afd, p.groep); if (!sb) return; idx[k] = { naam: sb.naam, naar: '/c/' + k + '/', ic: groepIcoon(p.afd, p.groep), lijst: [], los: true }; uit.push(idx[k]); }
      idx[k].lijst.push(p);
    });
    return uit.filter(function (x) { return x.lijst.length >= 4; }).slice(0, 18);
  }
  var WS_KLEUR = '#8F6620';
  function winkelKop(o, w) {
    var k = w ? w.k : (o.kleur || WS_KLEUR);
    var ik = w ? '<span class="ik"><picture><source media="(min-width:700px)" srcset="' + nb(w.id) + 'interieur-' + w.id + '.webp"><img src="' + nb(w.id) + 'interieur-' + w.id + '-telefoon.webp" alt=""></picture>' +
        '<img class="embleem" src="' + novaRond('winkel-' + w.id) + '" alt=""></span>'
      : '<span class="ik ik-leeg">' + (o.rond ? '<img class="embleem" src="' + o.rond + '" alt="" onerror="this.style.display=\'none\'">' : '') + '</span>';
    var label = (w && (!o.label || /^(Gelegenheid|Collectie)$/.test(o.label))) ? w.naam : (o.label || '');
    return '<section class="binnen-kop gevel nova ws-kop' + (w ? '' : ' ws-licht') + '" style="--k:' + k + '"><span class="luifel"></span>' + ik +
      '<div class="pui">' + (label ? '<p class="in-winkel">' + esc(label) + '</p>' : '') + '<h1>' + esc(o.h1) + '</h1>' +
      (o.tekst ? '<p>' + esc(String(o.tekst).replace(/\s*(Kies|Klik|Tik) (hieronder|een|op)[^.!?]*[.!?]/g, '').trim()) + '</p>' : '') +
      '<p class="tel">' + getal(o.totaal) + ' cadeaus' + (o.van < 1e9 ? ' · vanaf ' + euro(o.van) : '') + '</p>' +
      (w && w.let ? '<p class="let">' + esc(w.let) + '</p>' : '') +
      (w && w.extra && o.extra !== false ? '<div class="sh-extra">' + w.extra.map(function (e) { return '<a href="' + e[1] + '">' + (e[2] ? '<img src="' + novaRond(e[2]) + '" alt="">' : '') + esc(e[0]) + '</a>'; }).join('') + '</div>' : '') +
      '</div></section>';
  }
  /* o: { sleutels (voor het interieur), label, h1, tekst, rond, kleur, terug: [adres, tekst], lijst (gesorteerd), delen: [{naam, naar, ic, lijst}],
         etalage (true/false), kopDelen ('Soorten'/'Afdelingen'), voor: [{naam, naar, aan}], alles: adres van de lijst met filters, eenLijst (soort-pagina) } */
  function winkelWeergave(o) {
    var w = winkelVan(o.sleutels || []);
    var lijst = o.lijst || [];
    if (!lijst.length) return '';
    var van = lijst.reduce(function (m, p) { return Math.min(m, p.prijs || 1e9); }, 1e9);
    var gangen = [];
    if (o.eenLijst) gangen.push({ naam: o.h1, lijst: lijst, ic: o.ic || '', een: true });
    else {
      if (o.etalage !== false && lijst.length >= 12) gangen.push({ naam: 'Onze beste keuzes', lijst: lijst.slice(0, 12), ic: o.rond || '', top: true });
      (o.delen || []).forEach(function (d) { if (d.lijst && d.lijst.length >= (d.min || 3)) gangen.push(d); });
      /* 22-11-2026: wat al in de etalage staat, staat in zijn soort achteraan, zodat je in elke soort eerst cadeaus ziet die je nog niet zag.
         Er gaat niets weg: het aantal per soort blijft gelijk. */
      if (gangen.length && gangen[0].top) {
        var inEt = {}; gangen[0].lijst.forEach(function (p) { inEt[p.id] = 1; });
        gangen = gangen.map(function (x) {
          if (x.top) return x;
          var nieuw = x.lijst.filter(function (p) { return !inEt[p.id]; });
          return nieuw.length >= 4 ? Object.assign({}, x, { lijst: nieuw.concat(x.lijst.filter(function (p) { return inEt[p.id]; })) }) : x;
        });
      }
    }
    if (!gangen.length || (gangen.length === 1 && gangen[0].top)) return '';
    huidig = { afd: gangen };
    var h = (o.terug ? '<a class="terug" href="' + o.terug[0] + '">‹ ' + esc(o.terug[1]) + '</a>' : '') + '<div class="lampjes" aria-hidden="true"></div>' +
      winkelKop({ label: o.label, h1: o.h1, tekst: o.tekst, rond: o.rond, kleur: o.kleur, totaal: o.totaal || lijst.length, van: van, extra: o.extra }, w);
    if (o.boven) h += '<div class="ws-boven">' + o.boven + '</div>';
    if (o.voor && o.voor.length) h += wegwijzer('Voor wie', o.voor.map(function (x) { return '<a href="' + x.naar + '"' + (x.aan ? ' aria-current="page" class="ws-aan"' : '') + '>' + esc(x.naam) + '</a>'; }));
    if (o.buren && o.buren.length) h += wegwijzer(o.kopDelen || 'Soorten', o.buren.map(function (x) { return '<a href="' + x.naar + '"' + (x.aan ? ' aria-current="page" class="ws-aan"' : '') + '>' + esc(x.naam) + (x.n ? ' <small>' + x.n + '</small>' : '') + '</a>'; }));
    else {
      var gs = gangen.map(function (x, n) { return x.top ? '' : '<a href="' + (x.naar || '#') + '" data-sh-gang="' + n + '">' + esc(x.naam) + ' <small>' + x.lijst.length + '</small></a>'; }).filter(Boolean);
      if (gs.length > 1) h += wegwijzer(o.kopDelen || 'Soorten', gs);
    }
    var max = o.eenLijst ? 1e9 : MAX_IN_GANG, perKeer = o.eenLijst ? 12 : PER_KEER, nr = 0;
    gangen.forEach(function (x, n) {
      if (!x.top && !x.een) nr++;
      var klein = x.top ? 'De etalage' : x.een ? '' : (o.kopDelen === 'Afdelingen' ? 'Afdeling ' : 'Soort ') + nr;
      h += '<section class="gang' + (x.top ? ' ws-etalage' : '') + '" id="gang-' + n + '"><div class="gang-kop">' + (x.ic ? '<img src="' + x.ic + '" alt="" loading="lazy" onerror="this.style.visibility=\'hidden\'">' : '') +
        '<div>' + (klein ? '<small>' + esc(klein) + '</small>' : '') + '<h2>' + afbr(x.naam) + '</h2></div></div>' +
        '<div class="sh-schap" data-sh-schap="a' + n + '">' + x.lijst.slice(0, perKeer).map(kaart).join('') + '</div>' +
        '<div class="gang-voet">' + (x.lijst.length > perKeer && perKeer < max ? '<button class="sh-meer" type="button" data-sh-meer="a' + n + '" data-sh-max="' + (x.een ? 'alles' : '') + '">Laat er nog ' + Math.min(perKeer, Math.min(x.lijst.length, max) - perKeer) + ' zien</button>' : '') +
        (x.naar && !x.top ? '<a class="naar" href="' + x.naar + '">' + (x.los ? 'Alles uit ' + esc(x.naam) : 'Alle ' + getal(x.lijst.length) + ' uit ' + esc(x.naam)) + ' ›</a>' : '') + '</div></section>';
      if (x.top && o.naEtalage) h += '<div class="ws-extra">' + o.naEtalage + '</div>';
    });
    if (o.onder) h += '<div class="ws-extra ws-onder">' + o.onder + '</div>';
    if (o.alles) h += '<p class="alles-lijst"><a href="' + o.alles + '">Alle ' + getal(o.totaal || lijst.length) + ' cadeaus in één lijst, met sorteren en filteren ›</a></p>';
    h += '<a class="terug" href="/">‹ Terug naar de Cadeaustraat</a>';
    return '<div class="sh ws"><div class="sh-binnen" style="--k:' + (w ? w.k : (o.kleur || WS_KLEUR)) + '">' + h + '</div></div>';
  }
  /* Afdeling, groep of soort van de site (/c/…) */
  function afdPagina(c, s, v, lijst, pad) {
    pad = String(pad).replace(/\/?$/, '/');
    var hz = window.LK && window.LK.hoortBij;
    var o = { lijst: lijst, h1: (v || s || c).naam, alles: pad + '?alles=1' };
    var sleutels = [c.slug + (s ? '/' + s.slug : ''), c.slug];
    if (v) {
      var vakken = (s.vakjes || []).filter(function (x) { return x.slug === v.slug || (hz && window.LK.zichtbaar().some(function (p) { return hz(p, c.slug, s.slug, x.slug); })); });
      o.eenLijst = true; o.label = s.naam; o.terug = ['/c/' + c.slug + '/' + s.slug + '/', 'Terug naar ' + s.naam]; o.etalage = false;
      o.tekst = v.tekst || ''; o.ic = v.beeld ? '/' + v.beeld : groepIcoon(c.slug, s.slug);
      if (v.faq && window.LK_GIDSFAQ) o.onder = window.LK_GIDSFAQ(v); /* 24-11-2026: vragen onderaan het vakje (Google-herstel) */
      o.buren = vakken.map(function (x) { return { naam: x.naam, naar: '/c/' + c.slug + '/' + s.slug + '/' + x.slug + '/', aan: x.slug === v.slug }; });
    } else if (s) {
      o.terug = ['/c/' + c.slug + '/', 'Terug naar ' + c.naam]; o.label = c.naam; o.tekst = s.tekst || '';
      if (s.vakjes && s.vakjes.length && hz) o.delen = s.vakjes.map(function (x) { return { naam: x.naam, naar: pad + x.slug + '/', ic: x.beeld ? '/' + x.beeld : '', lijst: lijst.filter(function (p) { return hz(p, c.slug, s.slug, x.slug); }) }; });
      else o.delen = deelPerGroep(lijst);
      if (!o.delen.filter(function (d) { return d.lijst.length >= 3; }).length) o.delen = deelPerGroep(lijst);
    } else {
      o.terug = ['/', 'Naar de Cadeaustraat']; o.tekst = c.tekst || ''; o.kopDelen = 'Afdelingen';
      o.delen = (c.subs || []).filter(function (x) { return !x.verborgen; }).map(function (x) { return { naam: x.naam, naar: pad + x.slug + '/', ic: groepIcoon(c.slug, x.slug) || (x.beeld ? '/' + x.beeld : ''), lijst: hz ? lijst.filter(function (p) { return hz(p, c.slug, x.slug); }) : [] }; });
    }
    o.sleutels = sleutels; o.rond = (c.rond ? '/' + c.rond : '');
    var w = winkelVan(sleutels); if (w && !o.label) o.label = w.naam; else if (w && !v && s) o.label = w.naam + ' · ' + c.naam;
    return winkelWeergave(o);
  }
  /* Onderwerp van Voor wie (/voor/haar/wonen-sfeer), gelegenheid, collectie (ook per persoon) */
  function lijstPagina(o) {
    if (o.rondNaam && !o.rond) o.rond = novaRond(o.rondNaam);
    o.delen = deelPerGroep(o.lijst);
    return winkelWeergave(o);
  }
  function meer(m) {
    var n = m.getAttribute('data-sh-meer');
    if (/^a\d+$/.test(n) && huidig && huidig.afd) {
      var alles = m.getAttribute('data-sh-max') === 'alles', amax = alles ? 1e9 : MAX_IN_GANG, astap = alles ? 12 : PER_KEER;
      var al = huidig.afd[+n.slice(1)].lijst, as = document.querySelector('[data-sh-schap="' + n + '"]'), anu = as.children.length;
      as.insertAdjacentHTML('beforeend', al.slice(anu, Math.min(anu + astap, amax)).map(kaart).join(''));
      var aover = Math.min(al.length, amax) - as.children.length;
      if (aover > 0) m.textContent = 'Laat er nog ' + Math.min(astap, aover) + ' zien'; else m.remove();
      return;
    }
    var lijst = n === 'top' ? huidig.st.etalage : /^r\d+$/.test(n) ? KRAAM[+n.slice(1)] : huidig.x.gangen[+n].lijst, schap = document.querySelector('[data-sh-schap="' + n + '"]');
    var nu = schap.children.length, erbij = lijst.slice(nu, Math.min(nu + PER_KEER, MAX_IN_GANG));
    schap.insertAdjacentHTML('beforeend', erbij.map(kaart).join(''));
    var over = Math.min(lijst.length, MAX_IN_GANG) - schap.children.length;
    if (over > 0) m.textContent = 'Laat er nog ' + Math.min(PER_KEER, over) + ' zien'; else m.remove();
  }
  function kmeer(km) {
    var kn = +km.getAttribute('data-sh-kmeer'), kl2 = huidig.kiosk[kn].gidsen, ks = document.querySelector('[data-sh-schap="k' + kn + '"]'), nu0 = ks.children.length;
    ks.insertAdjacentHTML('beforeend', kl2.slice(nu0, nu0 + PER_KEER).map(gidsKaart).join(''));
    var over0 = kl2.length - ks.children.length;
    if (over0 > 0) km.textContent = 'Laat er nog ' + Math.min(PER_KEER, over0) + ' zien'; else km.parentNode.remove();
  }
  /* WINKELSTIJL voor de Voor wie-pagina's (voorbeeld): /voor/haar is de straat voor haar. De links naar de winkels gaan naar de straat op de homepage. */
  function voorPagina(wie) {
    var st = staat(wie, 0); huidig = { st: st };
    return '<div class="sh">' + straat(st, { voor: true }).replace(/href="#/g, 'href="/#') + '</div>';
  }
  return { render: render, meer: meer, kmeer: kmeer, adres: leesAdres, afd: afdPagina, voor: voorPagina, lijst: lijstPagina };
  }

  var S = null, TITEL0 = '';
  var VW = null; /* voorwie.js: welke cadeaus op welke Voor wie-pagina staan (420 kB, alleen als iemand een persoon kiest) */
  function laadVoorwie(klaar) {
    if (window.LK_VOORWIE) return;
    if (!VW) { VW = document.createElement('script'); VW.src = '/assets/data/voorwie.js'; VW.async = true; document.head.appendChild(VW); }
    VW.addEventListener('load', klaar, { once: true });
  }
  function aan() {
    if (window.LK_STRAAT_AAN === false) return false;
    try { if (/[?&]proef=straat-uit\b/.test(location.search)) sessionStorage.setItem('lkstraat-uit', '1'); if (/[?&]proef=straat\b(?!-)/.test(location.search)) sessionStorage.removeItem('lkstraat-uit'); if (sessionStorage.getItem('lkstraat-uit')) return false; } catch (e) {}
    return true;
  }
  function tel(pad, titel) { try { if (window.goatcounter && window.goatcounter.count) window.goatcounter.count({ path: pad, title: titel, event: true }); } catch (e) {} }
  /* 22-11-2026 (Marius: 'als je op voor haar klikt blijf je op de home page en zie je niet de winkel voor haar'):
     kom je op de homepage binnen met een keuze in het adres (/#voor-haar: een link van een andere pagina, of de pagina opnieuw geladen),
     dan meteen naar 'De straat voor haar'. Met de terugknop niet: dan kom je terug waar je was. */
  var kopNaStart = (function () {
    try { var n = performance.getEntriesByType('navigation')[0]; if (n && n.type === 'back_forward') return false; } catch (e) {}
    return /^#(?:voor-|tot-)/.test(location.hash);
  })();
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="/#voor-"],a[href^="/#tot-"]');
    if (a && location.pathname !== '/' && !(e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)) kopNaStart = true;
  }, true);
  function kopNaRender() {
    if (!kopNaStart) return;
    kopNaStart = false;
    var gezet = -1;
    var naarKop = function () {
      var a = S && S.adres(), k = document.getElementById('straat-kop');
      if (!k || !opHome() || !a || a.winkel) return;
      k.scrollIntoView({ block: 'start' }); gezet = window.scrollY;
    };
    setTimeout(naarKop, 60);
    /* nog één keer als er boven de straat iets later is ingeladen (plaatjes), maar alleen als je zelf nog niet hebt gescrold */
    setTimeout(function () { if (gezet >= 0 && Math.abs(window.scrollY - gezet) < 4) naarKop(); }, 900);
  }
  /* app.js vraagt hier de homepage op (home()). Leeg = de oude homepage. */
  window.LK_STRAAT_HOME = {
    aan: aan,
    html: function () {
      if (!aan() || !window.LK_PRODUCTEN || !(window.LK && window.LK.productKaart)) return '';
      if (window.LK_DEEL) { /* SNEL: nog maar een deel van de lijst (pak van een andere pagina); de straat heeft alles nodig */
        if (window.LK_LAAD_VOL) window.LK_LAAD_VOL();
        window.addEventListener('lk-volledig', function () { S = null; if (location.pathname === '/' && window.LK && window.LK.ga) window.LK.ga('/' + location.search + location.hash, true); }, { once: true });
        return '';
      }
      TITEL0 = document.title; /* app.js heeft net de titel van de homepage gezet */
      if (!S || S._deel) { S = maak(); S._deel = false; } /* de straat altijd met de hele lijst */
      var a = S.adres();
      if (a.wie && !window.LK_VOORWIE) laadVoorwie(herteken);
      var r = S.render();
      if (!r.binnen) kopNaRender();
      return r.html;
    }
  };
  /* WINKELSTIJL voor afdelingen en groepen: voorbeeld, alleen met ?proef=winkelstijl (uit: ?proef=winkelstijl-uit). Nog niet voor iedereen. */
  /* WINKELSTIJL staat aan voor alle bezoekers. Zelf de oude pagina's zien: ?proef=winkelstijl-uit (in dat tabblad; weer aan: ?proef=winkelstijl).
     Helemaal uit: window.LK_WINKELSTIJL = false. */
  function winkelstijl() {
    if (!aan() || window.LK_WINKELSTIJL === false) return false;
    try { if (/[?&]proef=winkelstijl-uit\b/.test(location.search)) sessionStorage.setItem('lkws-uit', '1'); else if (/[?&]proef=winkelstijl\b/.test(location.search)) sessionStorage.removeItem('lkws-uit');
      return !sessionStorage.getItem('lkws-uit'); } catch (e) { return true; }
  }
  /* Een winkel-pagina kan al getekend worden met het kleine productbestand van die pagina (pak, LK_DEEL): de winkel gebruikt alleen de cadeaus
     van die pagina. De straat zelf (homepage) wacht op de hele lijst; daarom maken we de straat opnieuw zodra die er is. */
  function zorgS() { var deel = !!window.LK_DEEL; if (!S || S._deel !== deel) { S = maak(); S._deel = deel; } return S; }
  var VOOR_WIE = { haar: 'haar', hem: 'hem', kinderen: 'kind', tieners: 'tiener', 'opa-oma': 'opa-oma', collega: 'collega', baby: 'baby' };
  window.LK_STRAAT_VOOR = {
    html: function (slug) {
      if (!winkelstijl() || !VOOR_WIE[slug] || !window.LK_PRODUCTEN) return '';
      if (!window.LK_VOORWIE && !navigator.webdriver) { laadVoorwie(function () { if (window.LK && window.LK.ga) window.LK.ga(location.pathname + location.search, true); }); }
      zorgS();
      return S.voor(VOOR_WIE[slug]);
    }
  };
  window.LK_STRAAT_AFD = {
    html: function (c, s, v, lijst, pad) {
      if (!winkelstijl() || !window.LK_PRODUCTEN) return '';
      zorgS();
      return S.afd(c, s, v, lijst, pad);
    }
  };
  window.LK_STRAAT_LIJST = {
    html: function (o) {
      if (!winkelstijl() || !window.LK_PRODUCTEN) return '';
      zorgS();
      return S.lijst(o);
    }
  };
  function opHome() { return (location.pathname === '/' || location.pathname === '') && document.querySelector('#app > .sh'); }
  function herteken() { if (!S || !opHome()) return; var y = window.scrollY; document.getElementById('app').innerHTML = S.render().html; window.scrollTo(0, y); }
  /* Bovenaan de straat alleen het logo en het zoekvak, zoals in de testversie (21-11-2026, Marius: 'IK WIL NIKS MEER VAN DE OUDE SITE').
     html.sh-thuis staat er al vóór de app start (stukje in de kop van sjabloon.html) en volgt daarna of de straat in #app staat. */
  function kopZetten() {
    var thuis = !!document.querySelector('#app > .sh');
    /* COMBI (22-11-2026, voorbeeld): de kop zoals hij was, dus geen lichte straatkop (zie sjabloon.html) */
    var combi = /(^| )combi( |$)/.test(document.documentElement.className);
    document.documentElement.classList.toggle('sh-thuis', thuis && !combi);
    /* Alleen voor bezoekers met de nieuwe opzet (wz-v, gezet in de kop van sjabloon.html); zoekmachines houden de kop zoals hij was */
    var mens = /(^| )wz-v( |$)/.test(document.documentElement.className);
    document.documentElement.classList.toggle('sh-kop', mens && winkelstijl() && !combi);
    if (thuis) veegPijlen();
  }
  /* Afdelingen opzij vegen: pijltje rechts zolang er nog meer staat */
  function veegPijlen() {
    var rijen = document.querySelectorAll('#app .sh [data-sh-veeg]');
    for (var i = 0; i < rijen.length; i++) {
      var r = rijen[i], b = r.parentNode.querySelector('[data-sh-veegpijl]'), meer = r.scrollWidth - r.clientWidth - r.scrollLeft > 8;
      if (b) b.hidden = !meer;
      r.parentNode.classList.toggle('sh-veeg-meer', meer);
    }
  }
  document.addEventListener('scroll', function (e) { var t = e.target; if (t && t.nodeType === 1 && t.hasAttribute('data-sh-veeg')) veegPijlen(); }, true);
  window.addEventListener('resize', veegPijlen);
  function kijkApp() {
    var appEl = document.getElementById('app');
    if (!appEl) return;
    kopZetten();
    if (window.MutationObserver) {
      new MutationObserver(kopZetten).observe(appEl, { childList: true });
    }
  }
  if (document.getElementById('app')) kijkApp(); else document.addEventListener('DOMContentLoaded', kijkApp);
  /* Het warme venster (zoals in de testversie). De knop is een gewone kaart-knop van de site (a.kaart-koop met data-id),
     dus app.js telt hem als klik/<winkel>/<id> en hij loopt via /p/<id>/?naar=winkel met dezelfde partnerlink als de productpagina. */
  var blad = null, bladStap = false;
  function icn(n) { return window.LK && window.LK.icoon ? window.LK.icoon(n) : ''; }
  function openBlad(id, kleur) {
    var p = window.LK && window.LK.vind ? window.LK.vind(id) : null; if (!p) return;
    if (!blad) { blad = document.createElement('div'); blad.className = 'k-blad'; blad.hidden = true; document.body.appendChild(blad);
      blad.addEventListener('click', function (e) { if (e.target === blad || e.target.closest('[data-sluit-blad]')) sluitBlad(); }); }
    var e2 = window.LK.esc, fav = window.LK.isFavoriet(p.id), pp = '/p/' + e2(p.id) + '/';
    var geenKnop = /elektrische-steps|elektrische-fietsen|op-brandstof/.test((p.vak || '') + ' ' + (p.sub || ''));
    var knop = geenKnop ? '<a class="k-knop" href="' + pp + '">Bekijk dit cadeau ' + icn('pijl') + '</a>'
      : '<a class="k-knop kaart-koop" data-id="' + e2(p.id) + '" href="' + pp + '?naar=winkel" target="_blank" rel="sponsored nofollow noopener">Bekijk bij ' + e2(p.shop || 'de winkel') + ' ' + icn('pijl') + '</a>';
    blad.style.setProperty('--k', kleur || '#8F6620'); blad.style.setProperty('--kd', 'color-mix(in srgb,' + (kleur || '#8F6620') + ' 72%,#000)');
    blad.innerHTML = '<div class="k-doos" role="dialog" aria-modal="true" aria-label="' + e2(p.titel) + '"><div class="k-greep"></div>' +
      '<button class="k-sluit" type="button" data-sluit-blad aria-label="Sluiten">' + icn('sluit') + '</button>' +
      '<div class="k-foto"><img src="/' + e2(p.beeld) + '.webp" alt="' + e2(p.titel) + '"></div><h3>' + e2(p.titel) + '</h3>' + (p.waarom ? '<p>' + e2(p.waarom) + '</p>' : '') +
      '<div class="k-onder"><span class="k-prijs">' + window.LK.euro(p.prijs) + '</span>' +
      '<button class="hartje k-hart" type="button" data-fav="' + e2(p.id) + '" aria-pressed="' + fav + '" aria-label="' + (fav ? 'Haal van je verlanglijstje' : 'Zet op je verlanglijstje') + '">' + icn('hart') + '</button>' + knop + '</div>' +
      '<p class="k-klein">De prijs kan bij de winkel net anders zijn. <a href="' + pp + '">Alles over dit cadeau</a></p></div>';
    blad.hidden = false; document.body.style.overflow = 'hidden';
    /* eigen stap in de geschiedenis: de terugknop van de telefoon sluit eerst het venster */
    if (!bladStap) { try { history.pushState({ kblad: 1 }, '', location.href); bladStap = true; } catch (e) {} }
    tel('straat/venster/' + (p.shop || 'winkel') + '/' + p.id, 'Cadeaustraat: venster');
  }
  function verbergBlad() { if (!blad) return; blad.hidden = true; blad.innerHTML = ''; document.body.style.overflow = ''; }
  function sluitBlad() { verbergBlad(); if (bladStap) { bladStap = false; history.back(); } }
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && blad && !blad.hidden) sluitBlad(); });
  /* Terugknop: dit luistert vóór app.js (straat.js laadt eerst). Sluit het venster, of laat een stap binnen de straat (#winkel-…) aan de straat,
     zodat app.js niet denkt dat je de site verlaat ('Tik nog een keer op terug …'). */
  window.addEventListener('popstate', function (e) {
    if (blad && !blad.hidden) { bladStap = false; verbergBlad(); e.stopImmediatePropagation(); return; }
    if (bladStap) { bladStap = false; e.stopImmediatePropagation(); return; }
    if (S && location.pathname === '/' && location.hash !== vorige && document.querySelector('#app > .sh')) e.stopImmediatePropagation();
  });
  var naarStraat = false;
  /* Logo of 'Home' terwijl je in een winkel staat (/#winkel-…): terug naar het begin van de straat. app.js ziet hetzelfde adres en sluit alleen het menu. */
  document.addEventListener('click', function (e) {
    var h = e.target.closest && e.target.closest('a[href="/"]');
    if (!h || !S || !location.hash || location.pathname !== '/' || !document.querySelector('#app > .sh') || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    POS[location.hash] = window.scrollY;
    try { history.pushState({}, '', '/' + location.search); } catch (x) { return; }
    vorige = '';
    document.getElementById('app').innerHTML = S.render().html;
    window.scrollTo(0, 0);
  });
  document.addEventListener('click', function (e) {
    if (!S || !e.target.closest || !e.target.closest('#app .sh')) return;
    var pb = e.target.closest('[data-sh-blad]');
    if (pb && !(e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)) { e.preventDefault(); openBlad(pb.getAttribute('data-sh-blad'), getComputedStyle(pb).getPropertyValue('--k').trim()); return; }
    if (e.target.closest('[data-sh-kies]')) naarStraat = true;
    var km = e.target.closest('[data-sh-kmeer]'); if (km) { S.kmeer(km); return; }
    var m = e.target.closest('[data-sh-meer]'); if (m) { S.meer(m); return; }
    var vp = e.target.closest('[data-sh-veegpijl]');
    if (vp) { var rij = vp.parentNode.querySelector('[data-sh-veeg]'); if (rij) rij.scrollBy({ left: Math.round(rij.clientWidth * 0.7), behavior: 'smooth' }); return; }
    var gw = e.target.closest('[data-sh-gang]');
    if (gw) { e.preventDefault(); var d = document.getElementById('gang-' + gw.getAttribute('data-sh-gang')); if (d) d.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
    var nk = e.target.closest('[data-sh-naar-kies]');
    if (nk) { var k = document.querySelector('#app .sh .kies'); if (k) k.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
    /* 22-11-2026: een #-adres in de straat (persoon, bedrag, winkel) is een stap binnen de pagina. Stond er iets achter het adres
       (?utm_source=chatgpt.com, ?fbclid=… van TikTok en Instagram), dan liet <base href="/"> de browser de hele pagina opnieuw laden
       en stond je weer bovenaan de homepage. Nu blijft het adres staan en verandert alleen het stukje na #. */
    var ha = e.target.closest('a[href^="#"]');
    if (ha && opHome() && !(e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)) {
      var nh = ha.getAttribute('href');
      if (nh.length > 1) {
        e.preventDefault();
        if (nh !== location.hash) location.hash = nh;
        else if (naarStraat) { naarStraat = false; var k0 = document.getElementById('straat-kop'); if (k0) k0.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
      }
    }
  });
  /* Terug naar waar je was: met de terugknop kom je weer op dezelfde plek in de straat of winkel */
  var POS = {}, vorige = location.hash, vooruit = false;
  document.addEventListener('click', function (e) { var a = e.target.closest && e.target.closest('#app .sh a[href^="#"]'); if (a) vooruit = true; }, true);
  window.addEventListener('hashchange', function () {
    POS[vorige] = window.scrollY;
    var terug = !vooruit; vooruit = false; vorige = location.hash;
    if (!S || !opHome()) return;
    var a = S.adres();
    if (a.wie && !window.LK_VOORWIE) laadVoorwie(herteken);
    var r = S.render(), app = document.getElementById('app');
    app.innerHTML = r.html;
    if (terug) {} else if (a.winkel) tel('straat/winkel/' + a.winkel + (a.wie ? '/voor-' + a.wie : '') + (a.max ? '/tot-' + a.max : ''), 'Cadeaustraat: winkel');
    else if (a.wie || a.max) tel('straat/keuze/' + (a.wie || 'iedereen') + '/' + (a.max ? 'tot-' + a.max : 'elk'), 'Cadeaustraat: keuze');
    if (terug && POS[location.hash] !== undefined) { window.scrollTo(0, POS[location.hash]); naarStraat = false; return; }
    var doel = naarStraat && !r.binnen ? document.getElementById('straat-kop') : null;
    naarStraat = false;
    if (doel) doel.scrollIntoView({ block: 'start' }); else window.scrollTo(0, 0);
  });
})();
