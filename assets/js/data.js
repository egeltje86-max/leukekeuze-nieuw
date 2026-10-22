/* =========================================================
   LeukeKeuze – categorieën, subcategorieën en instellingen
   Hier pas je de indeling van de site aan.
   ========================================================= */

window.LK_INSTELLINGEN = {
  seizoen: 'kerst',            // 'kerst' of '' (neutraal)
  heroKicker: 'Bijzondere momenten',
  heroTitel: 'De mooiste cadeaus',
  heroTitelGoud: 'voor elk moment',
  heroTekst: 'Van persoonlijke geschenken tot de leukste gadgets. Met de hand uitgekozen, zodat jij snel iets moois vindt.',
  heroDesktop: 'images/banners/banner-home-desktop.webp',
  heroMobiel: 'images/banners/banner-home-mobiel.webp',
  populair: [
    { label: 'Kerst', naar: '/c/cadeaus/kerst' },
    { label: 'Sinterklaas', naar: '/c/cadeaus/sinterklaas' },
    { label: 'Dranken', naar: '/c/dranken' },
    { label: 'Voor haar', naar: '/c/cadeaus/voor-haar' },
    { label: 'Voor hem', naar: '/c/cadeaus/voor-hem' },
    { label: 'Onder €10', naar: '/c/cadeaus/onder-10' },
    { label: 'Adventskalenders', naar: '/c/cadeaus/adventskalenders' }
  ],
  /* 'Voor wie zoek je een cadeau?' op de homepage. */
  voorWie: [
    { label: 'Voor haar', naar: '/c/cadeaus/voor-haar', beeld: 'images/sub/sub-cadeaus-voor-haar.webp' },
    { label: 'Voor hem', naar: '/c/cadeaus/voor-hem', beeld: 'images/sub/sub-cadeaus-voor-hem.webp' },
    { label: 'Voor kinderen', naar: '/c/cadeaus/voor-kinderen', beeld: 'images/sub/sub-cadeaus-voor-kinderen.webp' },
    { label: 'Opa & oma', naar: '/c/cadeaus/opa-oma', beeld: 'images/sub/sub-cadeaus-opa-oma.webp' },
    { label: 'Baby & kraam', naar: '/c/cadeaus/baby-kraam', beeld: 'images/sub/sub-cadeaus-baby-kraam.webp' },
    { label: 'Met naam', naar: '/c/cadeaus/met-naam', beeld: 'images/sub/sub-cadeaus-met-naam.webp' },
    { label: 'Onder €10', naar: '/c/cadeaus/onder-10', beeld: 'images/sub/sub-cadeaus-onder-10.webp' }
  ],
  /* Reclameblokken op de homepage. 'tot' = laatste dag dat het blok getoond wordt (daarna verdwijnt het vanzelf). */
  acties: [
    { kicker: 'Proost op de feestdagen', titel: 'Whisky, champagne & meer', tekst: 'Topflessen om te geven of samen te openen.', knop: 'Naar de dranken', naar: '/c/dranken', beeld: 'images/categorieen/categorie-dranken.webp', tot: '2027-01-01' },
    { kicker: 'Kerst komt eraan', titel: 'Kerstcadeaus', tekst: 'Mooie cadeaus voor onder de boom.', knop: 'Bekijk kerstcadeaus', naar: '/c/cadeaus/kerst', beeld: 'images/sub/sub-cadeaus-kerst.webp', tot: '2026-12-25' },
    { kicker: 'Pakjesavond 5 december', titel: 'Sinterklaas', tekst: 'Leuke surprises en cadeautjes voor in de zak.', knop: 'Bekijk Sinterklaas', naar: '/c/cadeaus/sinterklaas', beeld: 'images/sub/sub-cadeaus-sinterklaas.webp', tot: '2026-12-05' }
  ],
  /* Etalage op de homepage: een rij uitgekozen producten. Leeg laten (ids: []) om te verbergen. */
  etalage: { titel: 'Proost! Topflessen voor de feestdagen', naar: '/c/dranken', knop: 'Alle dranken',
    ids: ['dc-2468345961', 'dc-1665638250', 'dc-2518147005', 'dc-1652149584', 'dc-1141534911', 'dc-1159542840', 'dc-2491446455', 'dc-1090238013', 'dc-391537950', 'dc-1096238052'] }
};

/* Afbeeldingen: laat leeg ('') als Nova ze nog niet heeft gemaakt.
   Dan toont de site een gouden icoon in de stijl van de site. */
/* ---------- Partnerwinkels (pagina /winkels + tegels in categorieën) ----------
   url leeg = nog geen partnerlink, dan wordt de winkel niet getoond. */
window.LK_WINKELS = [
  { naam: 'I-KOOK', tekst: 'Kookwinkel vol mooie pannen, messen en keukenspullen van goede merken.', cats: ['keuken'], url: '' },
  { naam: 'La Redoute', tekst: 'Frans warenhuis met mooie merken: AM.PM, Ralph Lauren, Tommy Hilfiger en meer.', cats: ['wonen', 'mode-beauty'], url: 'https://fr135.net/c/?si=16029&li=1692553&wi=433339&ws=' },
  { naam: 'Ditverzinjeniet', tekst: 'Bijzondere en originele cadeaus die je niet overal vindt.', cats: ['cadeaus', 'wonen', 'elektronica'], url: 'https://fr135.net/c/?si=11208&li=1503370&wi=433339&ws=' },
  { naam: 'Dille & Kamille', tekst: 'Mooie spullen voor koken, wonen en de tuin, van natuurlijke materialen.', cats: ['keuken', 'wonen', 'tuin-klussen'], url: 'https://fr135.net/c/?si=7059&li=1483700&wi=433339&ws=' },
  { naam: 'FOREO', tekst: 'Luxe Zweedse verzorging: slimme gezichtsborsteltjes en huidverzorging. Een cadeau om je mee te verwennen.', cats: ['mode-beauty'], beeld: 'images/winkels/winkel-foreo.webp', url: 'https://jf79.net/c/?si=16254&li=1829612&wi=433339&ws=' },
  { naam: 'Teufel', tekst: 'Duitse speakers en koptelefoons met prachtig geluid.', cats: ['elektronica'], url: 'https://fr135.net/c/?si=15574&li=1675015&wi=433339&ws=' },
  { naam: '999 Games', shop: '999Games', tekst: 'Bordspellen, kaartspellen en puzzels voor jong en oud.', cats: ['speelgoed'], url: 'https://fr135.net/c/?si=13450&li=1594951&wi=433339&ws=' },
  { naam: 'Bloompost', tekst: 'Bloemen en cadeautjes die door de brievenbus passen.', cats: ['cadeaus'], url: 'https://fr135.net/c/?si=7248&li=1681176&wi=433339&ws=' },
  { naam: 'Kaartje2go', tekst: 'Kaarten die je zelf maakt en die zij voor je versturen.', cats: ['cadeaus'], url: 'https://fr135.net/c/?si=19520&li=1837135&wi=433339&ws=' },
  { naam: 'Decantalo', tekst: 'Wijnhandel uit Spanje met topwijnen, champagne, whisky en andere mooie flessen.', cats: ['dranken'], url: 'https://bdt9.net/c/?si=18645&li=1810322&wi=433339&dl=nl%2F&ws=' },
  { naam: 'Dr. Martens', tekst: 'De bekende stoere laarzen en schoenen, ook de Vintage-lijn die nog in Engeland gemaakt wordt.', cats: ['mode-beauty'], url: 'https://fr135.net/c/?si=15138&li=1800483&wi=433339&dl=link%3Fid%3Dp5Zs8TJlngw%26offerid%3D1184941.415225994613837962723040%26type%3D15%26murl%3Dhttps%253A%252F%252Fwww.drmartens.com%252Fnl%252Fnl%252F&ws=' },
  { naam: 'Dropwinkel', tekst: 'Drop, snoep en chocolade, van ouderwets tot luxe.', cats: ['eten-drinken'], url: 'https://fr135.net/c/?si=18019&li=1781027&wi=433339&ws=' },
  { naam: 'bol', tekst: 'De grootste winkel van Nederland, voor bijna alles.', cats: [], url: 'https://partner.bol.com/click/click?t=url&s=1545784&f=txl&name=LeukeKeuze&url=' + encodeURIComponent('https://www.bol.com/nl/nl/') }
];

window.LK_CATEGORIEEN = [
  { slug: 'cadeaus', naam: 'Cadeaus', kort: 'Cadeaus', icoon: 'cadeau',
    tekst: 'Voor elke gelegenheid een bijzonder cadeau.',
    tegel: 'images/categorieen/categorie-cadeaus.webp', banner: 'images/banners/banner-cat-cadeaus.webp',
    subs: [
      { slug: 'voor-haar', naam: 'Voor haar', beeld: 'images/sub/sub-cadeaus-voor-haar.webp' },
      { slug: 'voor-hem', naam: 'Voor hem', beeld: 'images/sub/sub-cadeaus-voor-hem.webp' },
      { slug: 'voor-kinderen', naam: 'Voor kinderen', beeld: 'images/sub/sub-cadeaus-voor-kinderen.webp' },
      { slug: 'kerst', naam: 'Kerstcadeaus', beeld: 'images/sub/sub-cadeaus-kerst.webp' },
      { slug: 'sinterklaas', naam: 'Sinterklaas', beeld: 'images/sub/sub-cadeaus-sinterklaas.webp' },
      { slug: 'adventskalenders', naam: 'Adventskalenders', beeld: 'images/sub/sub-cadeaus-adventskalenders.webp' },
      { slug: 'opa-oma', naam: 'Voor opa & oma', beeld: 'images/sub/sub-cadeaus-opa-oma.webp' },
      { slug: 'baby-kraam', naam: 'Baby & kraam', beeld: 'images/sub/sub-cadeaus-baby-kraam.webp' },
      { slug: 'onder-10', naam: 'Onder €10', beeld: 'images/sub/sub-cadeaus-onder-10.webp' },
      { slug: 'met-naam', naam: 'Met naam', beeld: 'images/sub/sub-cadeaus-met-naam.webp' }
    ] },
  { slug: 'speelgoed', naam: 'Speelgoed & Spellen', kort: 'Speelgoed', icoon: 'beer',
    tekst: 'Spelen, ontdekken en groeien.',
    tegel: 'images/categorieen/categorie-speelgoed.webp', banner: 'images/banners/banner-cat-speelgoed.webp',
    subs: [
      { slug: 'baby-peuter', naam: 'Baby & peuter', beeld: 'images/sub/sub-speelgoed-baby-peuter.webp' }, { slug: 'bouwen', naam: 'Bouwen', beeld: 'images/sub/sub-speelgoed-bouwen.webp' },
      { slug: 'bordspellen', naam: 'Bord- & tafelspellen', beeld: 'images/sub/sub-speelgoed-bordspellen.webp' }, { slug: 'kaartspellen', naam: 'Kaart- & dobbelspellen', beeld: 'images/sub/sub-speelgoed-kaartspellen.webp' }, { slug: 'puzzels', naam: 'Puzzels', beeld: 'images/sub/sub-speelgoed-puzzels.webp' },
      { slug: 'buitenspeelgoed', naam: 'Buitenspeelgoed', beeld: 'images/sub/sub-speelgoed-buitenspeelgoed.webp' }, { slug: 'knutselen', naam: 'Knutselen voor kinderen', beeld: 'images/sub/sub-speelgoed-knutselen.webp' }
    ] },
  { slug: 'wonen', naam: 'Wonen & Decoratie', kort: 'Wonen & Deco', icoon: 'huis',
    tekst: 'Maak van je huis een warm thuis.', tegel: 'images/categorieen/categorie-wonen.webp', banner: 'images/banners/banner-cat-wonen.webp',
    subs: [
      { slug: 'kaarsen-geur', naam: 'Kaarsen & kandelaars', beeld: 'images/sub/sub-wonen-kaarsen-geur.webp' }, { slug: 'huisgeuren', naam: 'Huisgeuren', beeld: 'images/sub/sub-wonen-huisgeuren.webp' }, { slug: 'woonaccessoires', naam: 'Woonaccessoires', beeld: 'images/sub/sub-wonen-woonaccessoires.webp' },
      { slug: 'verlichting', naam: 'Verlichting', beeld: 'images/sub/sub-wonen-verlichting.webp' }, { slug: 'plaids-kussens', naam: 'Plaids & kussens', beeld: 'images/sub/sub-wonen-plaids-kussens.webp' },
      { slug: 'kerstdecoratie', naam: 'Kerstdecoratie', beeld: 'images/sub/sub-wonen-kerstdecoratie.webp' }
    ] },
  { slug: 'hobby', naam: 'Hobby & Creatief', kort: 'Hobby & Creatief', icoon: 'palet',
    tekst: 'Zelf iets moois maken.', tegel: 'images/categorieen/categorie-hobby.webp', banner: 'images/banners/banner-cat-hobby.webp',
    subs: [
      { slug: 'tekenen-schilderen', naam: 'Tekenen & schilderen', beeld: 'images/sub/sub-hobby-tekenen-schilderen.webp' }, { slug: 'haken-breien', naam: 'Haken & breien', beeld: 'images/sub/sub-hobby-haken-breien.webp' },
      { slug: 'knutselen', naam: 'Zelf maken', beeld: 'images/sub/sub-hobby-knutselen.webp' }, { slug: 'modelbouw', naam: 'Modelbouw', beeld: 'images/sub/sub-hobby-modelbouw.webp' }
    ] },
  { slug: 'elektronica', naam: 'Elektronica & Gadgets', kort: 'Elektronica', icoon: 'koptelefoon',
    tekst: 'Slimme gadgets voor elke dag.', tegel: 'images/categorieen/categorie-elektronica.webp', banner: 'images/banners/banner-cat-elektronica.webp',
    subs: [
      { slug: 'audio', naam: 'Audio', beeld: 'images/sub/sub-elektronica-audio.webp' }, { slug: 'slimme-gadgets', naam: 'Slimme gadgets', beeld: 'images/sub/sub-elektronica-slimme-gadgets.webp' },
      { slug: 'telefoon', naam: 'Telefoon', beeld: 'images/sub/sub-elektronica-telefoon.webp' }, { slug: 'gaming', naam: 'Gaming', beeld: 'images/sub/sub-elektronica-gaming.webp' }, { slug: 'foto-video', naam: 'Foto & video', beeld: 'images/sub/sub-elektronica-foto-video.webp' }
    ] },
  { slug: 'mode-beauty', naam: 'Mode & Beauty', kort: 'Mode & Beauty', icoon: 'tas',
    tekst: 'Mooie accessoires en verzorging.', tegel: 'images/categorieen/categorie-mode-beauty.webp', banner: 'images/banners/banner-cat-mode-beauty.webp',
    subs: [
      { slug: 'sieraden', naam: 'Sieraden', beeld: 'images/sub/sub-mode-beauty-sieraden.webp' }, { slug: 'horloges', naam: 'Horloges', beeld: 'images/sub/sub-mode-beauty-horloges.webp' }, { slug: 'geuren', naam: 'Geuren', beeld: 'images/sub/sub-mode-beauty-geuren.webp' }, { slug: 'verzorging', naam: 'Verzorging', beeld: 'images/sub/sub-mode-beauty-verzorging.webp' },
      { slug: 'tassen', naam: 'Hand- & schoudertassen', beeld: 'images/sub/sub-mode-beauty-tassen.webp' }, { slug: 'rugzakken-reistassen', naam: 'Rugzakken & reistassen', beeld: 'images/sub/sub-mode-beauty-rugzakken-reistassen.webp' }, { slug: 'schoenen', naam: 'Schoenen', beeld: 'images/sub/sub-mode-beauty-schoenen.webp' }, { slug: 'accessoires', naam: 'Accessoires', beeld: 'images/sub/sub-mode-beauty-accessoires.webp' }
    ] },
  { slug: 'keuken', naam: 'Keuken & Tafelen', kort: 'Keuken', icoon: 'kop',
    tekst: 'Mooi koken, gezellig tafelen.', tegel: 'images/categorieen/categorie-keuken.webp', banner: 'images/banners/banner-cat-keuken.webp',
    subs: [
      { slug: 'koken', naam: 'Koken', beeld: 'images/sub/sub-keuken-koken.webp' }, { slug: 'keukenapparaten', naam: 'Keukenapparaten', beeld: 'images/sub/sub-keuken-keukenapparaten.webp' }, { slug: 'bakken', naam: 'Bakken', beeld: 'images/sub/sub-keuken-bakken.webp' }, { slug: 'serveren', naam: 'Serveren', beeld: 'images/sub/sub-keuken-serveren.webp' },
      { slug: 'koffie-thee', naam: 'Koffie- & theespullen', beeld: 'images/sub/sub-keuken-koffie-thee.webp' }, { slug: 'opbergen', naam: 'Opbergen', beeld: 'images/sub/sub-keuken-opbergen.webp' }
    ] },
  { slug: 'eten-drinken', naam: 'Eten & Drinken', kort: 'Eten & Drinken', icoon: 'taart',
    tekst: 'Lekkers om te geven.', tegel: 'images/categorieen/categorie-eten-drinken.webp', banner: 'images/banners/banner-cat-eten-drinken.webp',
    subs: [
      { slug: 'chocolade-snoep', naam: 'Chocolade', beeld: 'images/sub/sub-eten-drinken-chocolade-snoep.webp' }, { slug: 'drop-snoep', naam: 'Drop & snoep', beeld: 'images/sub/sub-eten-drinken-drop-snoep.webp' }, { slug: 'pakketten', naam: 'Pakketten & borrel', beeld: 'images/sub/sub-eten-drinken-pakketten.webp' },
      { slug: 'koffie-thee', naam: 'Koffie & thee', beeld: 'images/sub/sub-eten-drinken-koffie-thee.webp' }, { slug: 'lekkernijen', naam: 'Lekkernijen', beeld: 'images/sub/sub-eten-drinken-lekkernijen.webp' }
    ] },
  { slug: 'dranken', naam: 'Dranken', kort: 'Dranken', icoon: 'glas',
    tekst: 'Mooie flessen om te geven.', tegel: 'images/categorieen/categorie-dranken.webp', banner: 'images/banners/banner-cat-dranken.webp',
    subs: [
      { slug: 'whisky', naam: 'Whisky', beeld: 'images/sub/sub-dranken-whisky.webp' },
      { slug: 'cognac-brandy', naam: 'Cognac & brandy', beeld: 'images/sub/sub-dranken-cognac-brandy.webp' },
      { slug: 'rum', naam: 'Rum', beeld: 'images/sub/sub-dranken-rum.webp' },
      { slug: 'gin', naam: 'Gin', beeld: 'images/sub/sub-dranken-gin.webp' },
      { slug: 'wodka', naam: 'Wodka', beeld: 'images/sub/sub-dranken-wodka.webp' },
      { slug: 'tequila', naam: 'Tequila', beeld: 'images/sub/sub-dranken-tequila.webp' },
      { slug: 'likeur', naam: 'Likeur', beeld: 'images/sub/sub-dranken-likeur.webp' },
      { slug: 'wijn', naam: 'Wijn', beeld: 'images/sub/sub-dranken-wijn.webp' },
      { slug: 'bubbels', naam: 'Bubbels', beeld: 'images/sub/sub-dranken-bubbels.webp' },
      { slug: 'wijnaccessoires', naam: 'Wijnaccessoires', beeld: 'images/sub/sub-dranken-wijnaccessoires.webp' }
    ] },
  { slug: 'tuin-klussen', naam: 'Tuin & Klussen', kort: 'Tuin & Klussen', icoon: 'blad',
    tekst: 'Voor de tuin en de handige klusser.', tegel: 'images/categorieen/categorie-tuin-klussen.webp', banner: 'images/banners/banner-cat-tuin-klussen.webp',
    subs: [
      { slug: 'tuingereedschap', naam: 'Tuingereedschap', beeld: 'images/sub/sub-tuin-klussen-tuingereedschap.webp' }, { slug: 'planten-zaden', naam: 'Planten & zaden', beeld: 'images/sub/sub-tuin-klussen-planten-zaden.webp' },
      { slug: 'gereedschap', naam: 'Gereedschap', beeld: 'images/sub/sub-tuin-klussen-gereedschap.webp' }, { slug: 'buitenverlichting', naam: 'Buitenverlichting', beeld: 'images/sub/sub-tuin-klussen-buitenverlichting.webp' }
    ] },
  { slug: 'sport-outdoor', naam: 'Sport, Outdoor & Reizen', kort: 'Sport, Outdoor & Reizen', icoon: 'bal',
    tekst: 'Erop uit, in beweging.', tegel: 'images/categorieen/categorie-sport-outdoor.webp', banner: 'images/banners/banner-cat-sport-outdoor.webp',
    subs: [
      { slug: 'fitness', naam: 'Fitness', beeld: 'images/sub/sub-sport-outdoor-fitness.webp' }, { slug: 'wandelen', naam: 'Wandelen', beeld: 'images/sub/sub-sport-outdoor-wandelen.webp' }, { slug: 'fietsen', naam: 'Fietsen', beeld: 'images/sub/sub-sport-outdoor-fietsen.webp' },
      { slug: 'kamperen', naam: 'Kamperen', beeld: 'images/sub/sub-sport-outdoor-kamperen.webp' }, { slug: 'reizen', naam: 'Reizen', beeld: 'images/sub/sub-sport-outdoor-reizen.webp' }, { slug: 'darts', naam: 'Darts', beeld: 'images/sub/sub-sport-outdoor-darts.webp' }
    ] },
  { slug: 'dieren', naam: 'Dieren', kort: 'Dieren', icoon: 'poot',
    tekst: 'Verwen je trouwe vriend.', tegel: 'images/categorieen/categorie-dieren.webp', banner: 'images/banners/banner-cat-dieren.webp',
    subs: [ { slug: 'hond', naam: 'Hond', beeld: 'images/sub/sub-dieren-hond.webp' }, { slug: 'kat', naam: 'Kat', beeld: 'images/sub/sub-dieren-kat.webp' }, { slug: 'klein-dier', naam: 'Klein dier', beeld: 'images/sub/sub-dieren-klein-dier.webp' }, { slug: 'vogels', naam: 'Vogels', beeld: 'images/sub/sub-dieren-vogels.webp' } ] },
  { slug: 'boeken-media', naam: 'Boeken & Media', kort: 'Boeken & Media', icoon: 'boek',
    tekst: 'Boeken, filmavond en muziek.', tegel: 'images/categorieen/categorie-boeken-media.webp', banner: 'images/banners/banner-cat-boeken-media.webp',
    subs: [
      { slug: 'romans', naam: 'Romans', beeld: 'images/sub/sub-boeken-media-romans.webp' }, { slug: 'kinderboeken', naam: 'Kinderboeken', beeld: 'images/sub/sub-boeken-media-kinderboeken.webp' }, { slug: 'kookboeken', naam: 'Kookboeken', beeld: 'images/sub/sub-boeken-media-kookboeken.webp' },
      { slug: 'films-series', naam: 'Filmavond', beeld: 'images/sub/sub-boeken-media-films-series.webp' }, { slug: 'muziek', naam: 'Muziek', beeld: 'images/sub/sub-boeken-media-muziek.webp' }, { slug: 'agendas', naam: 'Agenda’s & notitieboeken', beeld: 'images/sub/sub-boeken-media-agendas.webp' }
    ] },
  { slug: 'christelijk', naam: 'Christelijke cadeaus', kort: 'Christelijke cadeaus', icoon: 'kruis',
    tekst: 'Geloof, hoop en liefde in mooie geschenken.',
    tegel: 'images/categorieen/categorie-christelijk.webp', banner: 'images/banners/banner-cat-christelijk.webp',
    subs: [
      { slug: 'kerst', naam: 'Kerst', beeld: 'images/sub/sub-christelijk-kerst.webp' },
      { slug: 'bijbels', naam: 'Bijbels', beeld: 'images/sub/sub-christelijk-bijbels.webp' }, { slug: 'kaarten-posters', naam: 'Kaarten & posters', beeld: 'images/sub/sub-christelijk-kaarten-posters.webp' },
      { slug: 'sieraden', naam: 'Sieraden', beeld: 'images/sub/sub-christelijk-sieraden.webp' }, { slug: 'wanddecoratie', naam: 'Wanddecoratie', beeld: 'images/sub/sub-christelijk-wanddecoratie.webp' },
      { slug: 'voor-kinderen', naam: 'Voor kinderen', beeld: 'images/sub/sub-christelijk-voor-kinderen.webp' }, { slug: 'boeken-muziek', naam: 'Boeken & muziek', beeld: 'images/sub/sub-christelijk-boeken-muziek.webp' }
    ] }
];

window.LK_PRIJZEN = [
  { id: 'alle', label: 'Alles', min: 0, max: Infinity },
  { id: 'tot10', label: 'Tot €10', min: 0, max: 10 },
  { id: 'tot25', label: 'Tot €25', min: 0, max: 25 },
  { id: 'tot50', label: 'Tot €50', min: 0, max: 50 },
  { id: 'boven50', label: '€50+', min: 50.01, max: Infinity }
];

/* VONK: de vragen. De antwoorden matchen met 'voor' en 'moment' bij elk product. */
window.LK_VONK = {
  voor: [
    { id: 'haar', label: 'Haar' }, { id: 'hem', label: 'Hem' }, { id: 'kind', label: 'Een kind' },
    { id: 'opa-oma', label: 'Opa of oma' }, { id: 'iedereen', label: 'Maakt niet uit' }
  ],
  moment: [
    { id: 'kerst', label: 'Kerst' }, { id: 'sinterklaas', label: 'Sinterklaas' }, { id: 'verjaardag', label: 'Verjaardag' },
    { id: 'zomaar', label: 'Zomaar' }, { id: 'iedereen', label: 'Maakt niet uit' }
  ]
};

window.LK_CAT = function (slug) {
  return window.LK_CATEGORIEEN.find(function (c) { return c.slug === slug; });
};
window.LK_SUB = function (cat, slug) {
  return cat && cat.subs.find(function (s) { return s.slug === slug; });
};

/* Zoekwoorden om onder elke (sub)categorie 'Meer in onze winkels' te tonen. Voor haar/hem gaat op geslacht in de feed. */
window.LK_ZOEKWOORDEN = {
 "speelgoed/baby-peuter": "knuffel rammelaar babyspeelgoed bijtring",
 "speelgoed/bouwen": "bouwpakket bouwset lego blokken",
 "speelgoed/bordspellen": "bordspel bordspellen",
 "speelgoed/kaartspellen": "kaartspel kaartspellen dobbelspel",
 "speelgoed/puzzels": "puzzel puzzels legpuzzel",
 "speelgoed/buitenspeelgoed": "bellenblaas vlieger stoepkrijt buitenspeelgoed",
 "speelgoed/knutselen": "knutsel knutselset diy klei",
 "wonen/kaarsen-geur": "kaars kaarsen kandelaar waxinelichthouder",
 "wonen/huisgeuren": "geurstokjes wierook geurolie huisparfum",
 "wonen/woonaccessoires": "vaas vazen fotolijst klok spiegel decoratie",
 "wonen/verlichting": "lamp lampje lampen verlichting lichtsnoer",
 "wonen/plaids-kussens": "plaid kussen kussenhoes deken",
 "wonen/kerstdecoratie": "kerstbal kerstballen kerstboom kersthanger kerstdecoratie kerstslinger",
 "hobby/tekenen-schilderen": "verf schilderset aquarel potloden stiften schetsboek",
 "hobby/haken-breien": "haken haakset breien breiset garen",
 "hobby/knutselen": "knutsel knutselset diy",
 "hobby/modelbouw": "bouwpakket modelbouw",
 "elektronica/audio": "speaker koptelefoon oordopjes radio soundbar luidspreker headset",
 "elektronica/slimme-gadgets": "gadget powerbank oplader usb",
 "elektronica/telefoon": "telefoon telefoonhoes smartphone",
 "elektronica/gaming": "gaming game controller",
 "elektronica/foto-video": "camera instax fotocamera",
 "mode-beauty/sieraden": "ketting armband oorbellen ring sieraden",
 "mode-beauty/horloges": "horloge horloges",
 "mode-beauty/geuren": "parfum eau",
 "mode-beauty/verzorging": "bodycrème bodyscrub zeep handcrème massageolie lippenbalsem",
 "mode-beauty/tassen": "tas tassen handtas schoudertas clutch tasje",
 "mode-beauty/rugzakken-reistassen": "rugzak weekendtas reistas",
 "mode-beauty/schoenen": "laarzen laars schoenen boots loafers sneakers pantoffels",
 "mode-beauty/accessoires": "sjaal handschoenen riem portemonnee muts",
 "keuken/koken": "pan pannen koekenpan braadpan snijplank keukenmes",
 "keuken/keukenapparaten": "blender mixer waterkoker",
 "keuken/bakken": "bakvorm taartvorm deegroller bakmix",
 "keuken/serveren": "schaal schaaltje dienblad karaf serveerschaal",
 "keuken/koffie-thee": "theepot koffiemolen mok mokken percolator theeglas",
 "keuken/opbergen": "voorraadpot bewaardoos trommel",
 "eten-drinken/chocolade-snoep": "chocolade bonbons marsepein",
 "eten-drinken/drop-snoep": "drop dropjes snoep zuurtjes",
 "eten-drinken/pakketten": "pakket cadeaupakket cadeaubox",
 "eten-drinken/koffie-thee": "koffie thee koffiebonen",
 "eten-drinken/lekkernijen": "honing jam balsamico olijfolie pesto zout",
 "dranken/whisky": "whisky whiskey bourbon scotch",
 "dranken/cognac-brandy": "cognac brandy armagnac calvados",
 "dranken/rum": "rum ron",
 "dranken/gin": "gin",
 "dranken/wodka": "vodka wodka",
 "dranken/tequila": "tequila mezcal",
 "dranken/likeur": "likeur liqueur likeuren grappa limoncello",
 "dranken/wijn": "wijn",
 "dranken/bubbels": "champagne cava prosecco crémant mousserend",
 "dranken/wijnaccessoires": "kurkentrekker decanteerkaraf wijnglas wijnglazen",
 "tuin-klussen/tuingereedschap": "tuingereedschap gieter snoeischaar schepje",
 "tuin-klussen/planten-zaden": "zaden kweekset bloempot kweekpot",
 "tuin-klussen/gereedschap": "gereedschap schroevendraaier hamer",
 "tuin-klussen/buitenverlichting": "tuinlamp buitenlamp lantaarn",
 "sport-outdoor/fitness": "fitness yoga",
 "sport-outdoor/wandelen": "picknick drinkfles wandelstok",
 "sport-outdoor/fietsen": "fiets fietsbel",
 "sport-outdoor/kamperen": "kamperen tent camping",
 "sport-outdoor/reizen": "koffer toilettas reis",
 "sport-outdoor/darts": "dart darts dartbord",
 "dieren/hond": "hond honden",
 "dieren/kat": "kat katten poes",
 "dieren/klein-dier": "konijn cavia hamster",
 "dieren/vogels": "vogel vogels nestkast vogelhuisje",
 "boeken-media/romans": "roman",
 "boeken-media/kinderboeken": "kinderboek prentenboek",
 "boeken-media/kookboeken": "kookboek",
 "boeken-media/films-series": "film popcorn",
 "boeken-media/muziek": "muziek vinyl",
 "boeken-media/agendas": "agenda notitieboek planner",
 "cadeaus/voor-kinderen": "kinderen kids kind baby",
 "cadeaus/kerst": "kerst",
 "cadeaus/sinterklaas": "sinterklaas sint chocoladeletter pepernoten marsepein",
 "cadeaus/adventskalenders": "adventskalender",
 "cadeaus/opa-oma": "opa oma",
 "cadeaus/baby-kraam": "baby kraamcadeau",
 "cadeaus/met-naam": "naam gepersonaliseerd",
 "speelgoed": "babyspeelgoed bellenblaas bijtring blokken bordspel bordspellen bouwpakket bouwset buitenspeelgoed diy dobbelspel kaartspel kaartspellen klei knuffel knutsel knutselset lego legpuzzel puzzel puzzels rammelaar stoepkrijt vlieger",
 "wonen": "decoratie deken fotolijst geurolie geurstokjes huisparfum kaars kaarsen kandelaar kerstbal kerstballen kerstboom kerstdecoratie kersthanger kerstslinger klok kussen kussenhoes lamp lampen lampje lichtsnoer plaid spiegel vaas vazen verlichting waxinelichthouder wierook",
 "hobby": "aquarel bouwpakket breien breiset diy garen haakset haken knutsel knutselset modelbouw potloden schetsboek schilderset stiften verf",
 "elektronica": "camera controller fotocamera gadget game gaming headset instax koptelefoon luidspreker oordopjes oplader powerbank radio smartphone soundbar speaker telefoon telefoonhoes usb",
 "mode-beauty": "armband bodycrème bodyscrub boots clutch eau handcrème handschoenen handtas horloge horloges ketting laars laarzen lippenbalsem loafers massageolie muts oorbellen pantoffels parfum portemonnee reistas riem ring rugzak schoenen schoudertas sieraden sjaal sneakers tas tasje tassen weekendtas zeep",
 "keuken": "bakmix bakvorm bewaardoos blender braadpan deegroller dienblad karaf keukenmes koekenpan koffiemolen mixer mok mokken pan pannen percolator schaal schaaltje serveerschaal snijplank taartvorm theeglas theepot trommel voorraadpot waterkoker",
 "eten-drinken": "balsamico bonbons cadeaubox cadeaupakket chocolade drop dropjes honing jam koffie koffiebonen marsepein olijfolie pakket pesto snoep thee zout zuurtjes",
 "dranken": "armagnac bourbon brandy calvados cava champagne cognac crémant decanteerkaraf gin grappa kurkentrekker likeur likeuren limoncello liqueur mezcal mousserend prosecco ron rum scotch tequila vodka whiskey whisky wijn wijnglas wijnglazen wodka",
 "tuin-klussen": "bloempot buitenlamp gereedschap gieter hamer kweekpot kweekset lantaarn schepje schroevendraaier snoeischaar tuingereedschap tuinlamp zaden",
 "sport-outdoor": "camping dart dartbord darts drinkfles fiets fietsbel fitness kamperen koffer picknick reis tent toilettas wandelstok yoga",
 "dieren": "cavia hamster hond honden kat katten konijn nestkast poes vogel vogelhuisje vogels",
 "boeken-media": "agenda film kinderboek kookboek muziek notitieboek planner popcorn prentenboek roman vinyl"
};
