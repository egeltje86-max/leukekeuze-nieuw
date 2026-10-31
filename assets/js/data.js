/* =========================================================
   LeukeKeuze – categorieën, subcategorieën en instellingen
   Hier pas je de indeling van de site aan.
   ========================================================= */

window.LK_INSTELLINGEN = {
  /* Daisycon heeft de site tijdelijk afgekeurd: hun links sturen bezoekers dan naar een vreemde site.
     Zolang dit 'true' is, gaan alle knoppen rechtstreeks naar de winkel (zonder partnerlink). 'Meer in onze winkels' toont wel ALLE winkels (wens Marius 28-10-2026), ook met directe links.
     Weer goedgekeurd? Zet dit op false. */
  daisyconPauze: true,
  seizoen: 'kerst',            // 'kerst' of '' (neutraal)
  heroKicker: 'Bijzondere momenten',
  heroTitel: 'De mooiste cadeaus',
  heroTitelGoud: 'voor elk moment',
  heroTekst: 'Van persoonlijke geschenken tot de leukste gadgets. Met de hand uitgekozen, zodat jij snel iets moois vindt.',
  heroDesktop: 'images/banners/banner-kerst-desktop.webp',
  /* Banner met het LeukeKeuze-logo erin: dan staat de tekst niet over de foto heen maar eronder. */
  heroLogo: true,
  heroMobiel: 'images/banners/banner-kerst-mobiel.webp',
  /* Populair: wat Nederlanders het meest zoeken (OpenSEO, okt 2026) en waar wij genoeg producten voor hebben.
     Sinterklaas en Kerst vooraan zolang het seizoen is. Rituals (368.000) en airfryers (90.500) komen erbij zodra die vakjes gevuld zijn. */
  populair: [
    { label: 'Sinterklaas', naar: '/c/cadeaus/sinterklaas' },
    { label: 'Kerst', naar: '/c/cadeaus/kerst' },
    { label: 'LEGO', naar: '/c/speelgoed/lego' },
    { label: 'Gaming', naar: '/c/elektronica/gaming' },
    { label: 'Darts', naar: '/c/sport-outdoor/darts' },
    { label: 'Chocolade', naar: '/c/eten-drinken/chocolade' },
    { label: 'Sieraden', naar: '/c/sieraden' },
    { label: 'Champagne', naar: '/c/dranken/champagne-bubbels' },
    { label: 'Pokémon', naar: '/c/speelgoed/pokemon-verzamelkaarten' },
    { label: 'Adventskalenders', naar: '/c/eten-drinken/adventskalenders' }
  ],

  /* 'Voor wie zoek je een cadeau?' op de homepage. */
  voorWie: [
    { label: 'Voor haar', naar: '/c/cadeaus/voor-haar', beeld: 'images/sub/sub-cadeaus-voor-haar-2026b.webp' },
    { label: 'Voor hem', naar: '/c/cadeaus/voor-hem', beeld: 'images/sub/sub-cadeaus-voor-hem-2026b.webp' },
    { label: 'Voor kinderen', naar: '/c/cadeaus/voor-kinderen', beeld: 'images/sub/sub-cadeaus-voor-kinderen-2026b.webp' },
    { label: 'Opa & oma', naar: '/c/cadeaus/opa-oma', beeld: 'images/sub/sub-cadeaus-opa-oma-2026b.webp' },
    { label: 'Collega', naar: '/c/cadeaus/collega', beeld: 'images/sub/sub-cadeaus-collega-2026b.webp' },
    { label: 'Baby & kraam', naar: '/c/cadeaus/baby-kraam', beeld: 'images/sub/sub-cadeaus-baby-kraam-2026b.webp' }
  ],
  /* Reclameblokken op de homepage. 'tot' = laatste dag dat het blok getoond wordt (daarna verdwijnt het vanzelf). */
  acties: [
    { kicker: 'Pakjesavond 5 december', titel: 'Sinterklaas', tekst: 'Leuke surprises en cadeautjes voor in de zak.', knop: 'Bekijk Sinterklaas', naar: '/c/cadeaus/sinterklaas', beeld: 'images/sub/sub-cadeaus-sinterklaas.webp', tot: '2026-12-05' },
    { kicker: 'Kerst komt eraan', titel: 'Kerstcadeaus', tekst: 'Mooie cadeaus voor onder de boom.', knop: 'Bekijk kerstcadeaus', naar: '/c/cadeaus/kerst', beeld: 'images/sub/sub-cadeaus-kerst-2026b.webp', tot: '2026-12-25' },
    { kicker: 'Proost op de feestdagen', titel: 'Whisky, champagne & meer', tekst: 'Topflessen om te geven of samen te openen.', knop: 'Naar de dranken', naar: '/c/dranken', beeld: 'images/categorieen/categorie-dranken.webp', tot: '2027-01-01' }
  ],
  /* Eigen producten: een vaste plek bovenaan de homepage (onder de seizoensblokken). */
  eigen: { kicker: 'Van de maker van LeukeKeuze', titel: 'Onze eigen dino-kleurboeken', tekst: 'Zelf bedacht en gemaakt: vrolijke kleurboeken met 40 dino-kleurplaten, voor kinderen van 4 tot 8 jaar.',
    ids: ['amz-b0hp27j6v7', 'amz-b0hmfl96b8', 'amz-b0hky1v4y9', 'amz-b0hmjp8cbl', 'amz-b0hmfl6pg4', 'amz-b0hn1xkg2s', 'amz-b0hl242jc8'] },
  /* Etalage op de homepage: een rij uitgekozen producten. Leeg laten (ids: []) om te verbergen. */
  etalage: { titel: 'Proost! Topflessen voor de feestdagen', naar: '/c/dranken', knop: 'Alle dranken',
    ids: ['dc-2468345961', 'dc-1665638250', 'dc-2518147005', 'dc-1652149584', 'dc-1141534911', 'dc-1159542840', 'dc-2491446455', 'dc-1090238013', 'dc-391537950', 'dc-1096238052'] }
};

/* Afbeeldingen: laat leeg ('') als Nova ze nog niet heeft gemaakt.
   Dan toont de site een gouden icoon in de stijl van de site. */
/* ---------- Partnerwinkels (pagina /winkels + tegels in categorieën) ----------
   url leeg = nog geen partnerlink, dan wordt de winkel niet getoond. */
window.LK_WINKELS = [
  { naam: 'Ditverzinjeniet', tekst: 'Bijzondere en originele cadeaus die je niet overal vindt.', cats: ['cadeaus', 'wonen', 'dieren', 'boeken-media', 'hobby', 'speelgoed', 'sport-outdoor', 'elektronica', 'tuin-klussen', 'keuken', 'eten-drinken'], url: 'https://fr135.net/c/?si=11208&li=1503370&wi=433339&ws=' },
  { naam: 'bol', tekst: 'De grootste winkel van Nederland, voor bijna alles.', cats: ['metaaldetectie', 'boeken-media'], url: 'https://partner.bol.com/click/click?t=url&s=1545784&f=txl&name=LeukeKeuze&url=' + encodeURIComponent('https://www.bol.com/nl/nl/') },
  { naam: 'Dille & Kamille', tekst: 'Mooie spullen voor koken, wonen en de tuin, van natuurlijke materialen.', cats: ['keuken', 'wonen', 'tuin-klussen', 'eten-drinken', 'dieren', 'speelgoed', 'mode-beauty'], url: 'https://fr135.net/c/?si=7059&li=1483700&wi=433339&ws=' },
  { naam: 'LEGO', tekst: 'De officiële LEGO-winkel: alle sets, ook de exclusieve.', cats: ['speelgoed', 'hobby', 'wonen'], url: 'https://bdt9.net/c/?si=18488&li=1798521&wi=433339&ws=' },
  { naam: 'Westwing', tekst: 'Mooie woonspullen en decoratie, met wisselende acties van bekende merken.', cats: ['wonen', 'dieren', 'keuken'], url: 'https://jdt8.net/c/?si=17294&li=1749537&wi=433339&ws=' },
  { naam: 'Decantalo', tekst: 'Wijnhandel uit Spanje met topwijnen, champagne, whisky en andere mooie flessen.', cats: ['dranken'], url: 'https://bdt9.net/c/?si=18645&li=1810322&wi=433339&dl=nl%2F&ws=' },
  { naam: 'MYKA', tekst: 'Sieraden met een naam, datum of gravure. Persoonlijk, van zilver of goud.', cats: ['sieraden', 'christelijk'], url: 'https://bdt9.net/c/?si=18346&li=1803379&wi=433339&dl=nl%2F&ws=' },
  { naam: 'Prydligt', tekst: 'Betaalbare sieraden en horloges, van verguld staal tot zilver.', cats: ['sieraden', 'mode-beauty'], url: 'https://bdt9.net/c/?si=18475&li=1814773&wi=433339&ws=' },
  { naam: '999 Games', shop: '999Games', tekst: 'Bordspellen, kaartspellen en puzzels voor jong en oud.', cats: ['speelgoed'], url: 'https://fr135.net/c/?si=13450&li=1594951&wi=433339&ws=' },
  { naam: 'La Redoute', tekst: 'Frans warenhuis met mooie merken: AM.PM, Ralph Lauren, Tommy Hilfiger en meer.', cats: ['wonen', 'mode-beauty'], url: 'https://fr135.net/c/?si=16029&li=1692553&wi=433339&ws=' },
  { naam: 'Kaartje2go', tekst: 'Kaarten die je zelf maakt en die zij voor je versturen.', cats: ['cadeaus', 'christelijk'], url: 'https://fr135.net/c/?si=19520&li=1837135&wi=433339&ws=' },
  { naam: 'Bartogi', tekst: 'Schoenen en laarzen van merken als Hunter, HEYDUDE en Sockwell.', cats: ['mode-beauty'], url: 'https://fr135.net/c/?si=15634&li=1771255&wi=433339&ws=' },
  { naam: 'Kantinewinkel', tekst: 'Lekkers in grote verpakkingen: snoep, koffie, thee en alcoholvrije bubbels.', cats: ['eten-drinken', 'dranken'], url: 'https://bdt9.net/c/?si=18020&li=1781028&wi=433339&ws=' },
  { naam: 'Wijnkring', tekst: 'Wijn, port en bubbels, van betaalbaar tot bijzonder.', cats: ['dranken'], url: 'https://bdt9.net/c/?si=18166&li=1786491&wi=433339&ws=' },
  { naam: 'Kerstland', tekst: 'Alles voor kerst: bomen, ballen, verlichting en kerstdecoratie.', cats: ['wonen'], url: 'https://glp8.net/c/?si=22097&li=1972295&wi=433339&ws=' },
  { naam: 'Teufel', tekst: 'Duitse speakers en koptelefoons met prachtig geluid.', cats: ['elektronica'], url: 'https://fr135.net/c/?si=15574&li=1675015&wi=433339&ws=' },
  { naam: 'Dropwinkel', tekst: 'Drop, snoep en chocolade, van ouderwets tot luxe.', cats: ['eten-drinken'], url: 'https://fr135.net/c/?si=18019&li=1781027&wi=433339&ws=' },
  { naam: 'Timberland', tekst: 'De bekende gele boots en stevige kleding, in de Duitse webshop.', cats: ['mode-beauty'], url: 'https://rkn3.net/c/?si=15048&li=1654052&wi=433339&ws=' },
  { naam: 'Zadig & Voltaire', tekst: 'Frans modemerk met rock-chic tassen, sjaals en kasjmier.', cats: ['mode-beauty'], url: 'https://fr135.net/c/?si=15679&li=1683317&wi=433339&ws=' },
  { naam: 'Bloompost', tekst: 'Bloemen en cadeautjes die door de brievenbus passen.', cats: ['cadeaus'], url: 'https://fr135.net/c/?si=7248&li=1681176&wi=433339&ws=' },
  { naam: 'Dr. Martens', tekst: 'De bekende stoere laarzen en schoenen, ook de Vintage-lijn die nog in Engeland gemaakt wordt.', cats: ['mode-beauty'], url: 'https://fr135.net/c/?si=15138&li=1800483&wi=433339&dl=link%3Fid%3Dp5Zs8TJlngw%26offerid%3D1184941.415225994613837962723040%26type%3D15%26murl%3Dhttps%253A%252F%252Fwww.drmartens.com%252Fnl%252Fnl%252F&ws=' },
  { naam: 'Invicta', tekst: 'Opvallende horloges met een grote wijzerplaat, voor een scherpe prijs.', cats: ['mode-beauty'], url: 'https://bdt9.net/c/?si=18836&li=1811592&wi=433339&ws=' },
  { naam: 'WoodWick', tekst: 'Geurkaarsen met een houten lont die zachtjes knettert.', cats: ['wonen'], url: 'https://glp8.net/c/?si=21919&li=1925609&wi=433339&ws=' },
  { naam: 'Razer', tekst: 'Gaming-spullen: muizen, toetsenborden, headsets en verlichting.', cats: ['elektronica'], url: 'https://lt45.net/c/?si=13299&li=1828661&wi=433339&ws=' },
  { naam: 'AllSaints', tekst: 'Brits modemerk met leren jassen en stoere sieraden.', cats: ['mode-beauty'], url: 'https://glp8.net/c/?si=20868&li=1886640&wi=433339&ws=' },
  { naam: 'FOREO', tekst: 'Luxe Zweedse verzorging: slimme gezichtsborsteltjes en huidverzorging. Een cadeau om je mee te verwennen.', cats: ['mode-beauty'], beeld: 'images/winkels/winkel-foreo.webp', url: 'https://jf79.net/c/?si=16254&li=1829612&wi=433339&ws=' },
  { naam: 'Fietsparadijs', tekst: 'Alles voor op en om de fiets: tassen, manden, sloten, helmen en lampen.', cats: ['sport-outdoor'], url: 'https://lt45.net/c/?si=12168&li=1537542&wi=433339&ws=' },
  { naam: 'Fietstas.com', tekst: 'Fietstassen, rugzakken en manden van merken als Basil, Ortlieb en New Looxs.', cats: ['sport-outdoor', 'mode-beauty'], url: 'https://lt45.net/c/?si=12934&li=1570618&wi=433339&ws=' },
  { naam: 'Svinando', tekst: 'Italiaanse wijnhandel met duizenden wijnen, van barolo tot prosecco.', cats: ['dranken'], url: 'https://aff.svinando.be/c/?si=22015&li=1930420&wi=433339&ws=' },
  { naam: 'I-KOOK', tekst: 'Kookwinkel vol mooie pannen, messen en keukenspullen van goede merken.', cats: ['keuken'], url: '' }
];

window.LK_CATEGORIEEN = [
  { slug: 'cadeaus', naam: 'Cadeaus', kort: 'Cadeaus', icoon: 'cadeau',
    tekst: 'Voor elke gelegenheid een bijzonder cadeau.',
    tegel: 'images/categorieen/categorie-cadeaus.webp', banner: 'images/banners/banner-cat-cadeaus.webp',
    subs: [
      { slug: 'voor-haar', naam: 'Voor haar', beeld: 'images/sub/sub-cadeaus-voor-haar-2026b.webp' },
      { slug: 'voor-hem', naam: 'Voor hem', beeld: 'images/sub/sub-cadeaus-voor-hem-2026b.webp' },
      { slug: 'voor-kinderen', naam: 'Voor kinderen', beeld: 'images/sub/sub-cadeaus-voor-kinderen-2026b.webp' },
      { slug: 'kerst', naam: 'Kerstcadeaus', beeld: 'images/sub/sub-cadeaus-kerst-2026b.webp' },
      { slug: 'sinterklaas', naam: 'Sinterklaas', beeld: 'images/sub/sub-cadeaus-sinterklaas.webp' },
      { slug: 'sint-onder-15', naam: 'Sint onder €15', tekst: 'Snel een schoencadeautje of surprise nodig? Hier staat alles uit Sinterklaas onder de 15 euro.', beeld: 'images/sub/sub-cadeaus-sint-onder-15-2026b.webp' },
      { slug: 'adventskalenders', naam: 'Adventskalenders', beeld: 'images/sub/sub-cadeaus-adventskalenders-2026b.webp' },
      { slug: 'opa-oma', naam: 'Voor opa & oma', beeld: 'images/sub/sub-cadeaus-opa-oma-2026b.webp' },
      { slug: 'collega', naam: 'Cadeau voor collega',
        seoTitel: 'Cadeau voor collega: leuke kleinigheidjes en bedankjes',
        seoTekst: 'Leuk cadeautje voor een collega? 200+ kleinigheidjes voor collega\'s: wijn, chocolade, borrelpakketten, mokken en pensioencadeaus. Voor lootjes, verjaardag of afscheid.', beeld: 'images/sub/sub-cadeaus-collega-2026b.webp',
        tekst: 'Een leuk cadeautje voor een collega? Kleinigheidjes voor collega\'s bij lootjes, een verjaardag of afscheid: wijn, chocolade, borrelpakketten en meer.',
        gids: [
          { kop: 'Een cadeau voor een collega: waar let je op?', tekst: 'Je kent een collega vaak minder goed dan een vriend of familielid. Kies daarom iets wat bijna iedereen fijn vindt: iets lekkers, iets voor op het bureau of iets om thuis van te genieten. Een cadeau dat je samen met het team kunt delen, valt ook altijd goed.' },
          { kop: 'Lootjes trekken op het werk', tekst: 'Bij Sinterklaas of Kerst trekken veel teams lootjes. Meestal ligt het budget tussen de 5 en 15 euro. Gebruik de prijsknoppen hierboven om alleen cadeaus binnen jullie budget te zien.' },
          { kop: 'Een collega die afscheid neemt', tekst: 'Gaat een collega weg of met pensioen? Leg dan samen geld in voor iets groters, zoals een borrelpakket of een mooie planner voor de nieuwe baan.' },
          { kop: 'Een bedankje of een jarige collega', tekst: 'Voor een klein bedankje of een verjaardag is iets lekkers door de brievenbus, een plantje of een geurkaarsje vaak al genoeg. Klein, maar het laat zien dat je aan iemand denkt.' }
        ] },
      { slug: 'baby-kraam', naam: 'Baby & kraam', beeld: 'images/sub/sub-cadeaus-baby-kraam-2026b.webp' },
      { slug: 'onder-15', naam: 'Onder €15', beeld: 'images/sub/sub-cadeaus-onder-10-2026b.webp' },
      { slug: 'met-naam', naam: 'Met naam', beeld: 'images/sub/sub-cadeaus-met-naam-2026b.webp' },
      { slug: 'grappig', naam: 'Grappige cadeaus', beeld: 'images/producten/cg-useless-box.webp' }
    ] },
  { slug: 'valentijn', naam: 'Liefde & Valentijn', kort: 'Liefde', icoon: 'hart',
    tekst: 'Romantische cadeaus voor iemand van wie je houdt, het hele jaar door.',
    seoTitel: 'Valentijnscadeau & romantische cadeaus voor je geliefde',
    seoTekst: 'Romantisch cadeau of valentijnscadeau nodig? Hartjessieraden, rozen die nooit verwelken, cadeaus met jullie namen en ideeën voor een romantische avond. Voor haar en voor hem.',
    tegel: 'images/categorieen/categorie-valentijn.webp', banner: 'images/banners/banner-cat-valentijn.webp',
    subs: [
      { slug: 'voor-haar', beeld: 'images/sub/sub-valentijn-voor-haar.webp', naam: 'Voor haar', seoTitel: 'Valentijnscadeau voor haar: romantisch cadeau voor je vriendin',
        tekst: 'Een romantisch cadeau voor je vriendin of vrouw: hartjessieraden, rozen die nooit verwelken en kleine verwenmomentjes.' },
      { slug: 'voor-hem', beeld: 'images/sub/sub-valentijn-voor-hem.webp', naam: 'Voor hem', seoTitel: 'Valentijnscadeau voor hem: romantisch cadeau voor je vriend',
        tekst: 'Romantisch, maar niet zoetsappig: cadeaus voor je vriend of man die hij echt gebruikt.' },
      { slug: 'samen', beeld: 'images/sub/sub-valentijn-samen.webp', naam: 'Samen & jubileum', seoTitel: 'Cadeau voor 1 jaar samen, trouwdag of huwelijksjubileum',
        tekst: 'Voor jullie jaar samen, een trouwdag of 25, 40 of 50 jaar getrouwd: cadeaus die over jullie twee gaan.' },
      { slug: 'met-naam', beeld: 'images/sub/sub-valentijn-met-naam.webp', naam: 'Met naam & hartje', seoTitel: 'Romantisch cadeau met naam: sieraden met jullie namen',
        tekst: 'Persoonlijke cadeaus met een naam, jullie namen of een hartje. Echt voor haar of hem gemaakt.' },
      { slug: 'romantische-avond', beeld: 'images/sub/sub-valentijn-romantische-avond.webp', naam: 'Romantische avond', seoTitel: 'Romantische avond thuis: date-ideeën en cadeaus voor twee',
        tekst: 'Date-ideeën voor thuis: samen fonduen, hartjeswafels bakken, een spel voor twee of een sterrenhemel op het plafond.' },
      { slug: 'kleine-gebaren', beeld: 'images/sub/sub-valentijn-kleine-gebaren.webp', naam: 'Kleine liefdesgebaren', seoTitel: 'Klein romantisch cadeautje onder €25',
        tekst: 'Zomaar, gewoon omdat je van iemand houdt. Kleine cadeautjes onder de 25 euro met een groot gebaar.' }
    ],
    gids: [
      { kop: 'Een romantisch cadeau kiezen', tekst: 'Het mooiste romantische cadeau laat zien dat je de ander echt kent. Denk aan een herinnering die jullie delen, iets met jullie namen of iets waar zij of hij al lang naar kijkt.' },
      { kop: 'Valentijn, maar ook het hele jaar door', tekst: 'Valentijnsdag is op 14 februari, maar liefde laat je het hele jaar zien: op jullie jubileum, een trouwdag of zomaar op een gewone dinsdag.' },
      { kop: 'Samen iets doen', tekst: 'Een gezamenlijke avond is vaak het mooiste cadeau. Fonduen, samen bakken of een spel voor twee: tijd samen zegt meer dan veel woorden.' }
    ] },
  { slug: 'speelgoed', naam: 'Speelgoed & Spellen', kort: 'Speelgoed', icoon: 'beer',
    tekst: 'Spelen, ontdekken en groeien.',
    tegel: 'images/categorieen/categorie-speelgoed.webp', banner: 'images/banners/banner-cat-speelgoed.webp',
    subs: [
      { slug: 'baby-peuter', naam: 'Baby & peuter', beeld: 'images/sub/sub-speelgoed-baby-peuter.webp' }, { slug: 'bouwen', naam: 'Bouwen', beeld: 'images/sub/sub-speelgoed-bouwen.webp' },
      /* Speelfiguren, auto's, tractors en treinen (Schleich, Playmobil, Bruder, BRIO). Plaatje volgt nog van Nova; tot die tijd toont de site het gouden icoon. */
      { slug: 'figuren-voertuigen', naam: 'Figuren & voertuigen', beeld: 'images/sub/sub-speelgoed-figuren-voertuigen.webp', tekst: 'Speelfiguren en dieren van Schleich en Playmobil, tractors en vrachtwagens van Bruder en SIKU, en houten treinen van BRIO.' },
      { slug: 'bordspellen', naam: 'Bord- & tafelspellen', beeld: 'images/sub/sub-speelgoed-bordspellen.webp' }, { slug: 'kaartspellen', naam: 'Kaart- & dobbelspellen', beeld: 'images/sub/sub-speelgoed-kaartspellen.webp' }, { slug: 'puzzels', naam: 'Puzzels', beeld: 'images/sub/sub-speelgoed-puzzels.webp' },
      { slug: 'buitenspeelgoed', naam: 'Buitenspeelgoed', beeld: 'images/sub/sub-speelgoed-buitenspeelgoed.webp' }, { slug: 'knutselen', naam: 'Knutselen voor kinderen', beeld: 'images/sub/sub-speelgoed-knutselen.webp' }
    ] },
  { slug: 'eten-drinken', naam: 'Eten & Drinken', kort: 'Eten & Drinken', icoon: 'taart',
    tekst: 'Lekkers om te geven.', tegel: 'images/categorieen/categorie-eten-drinken.webp', banner: 'images/banners/banner-cat-eten-drinken.webp',
    subs: [
      { slug: 'chocolade-snoep', naam: 'Chocolade', beeld: 'images/sub/sub-eten-drinken-chocolade-snoep.webp' }, { slug: 'drop-snoep', naam: 'Drop & snoep', beeld: 'images/sub/sub-eten-drinken-drop-snoep.webp' }, { slug: 'bbq', naam: 'BBQ & kruiden', beeld: 'images/sub/sub-eten-drinken-bbq.webp' }, { slug: 'pakketten', naam: 'Pakketten & borrel', beeld: 'images/sub/sub-eten-drinken-pakketten.webp' },
      { slug: 'koffie-thee', naam: 'Koffie & thee', beeld: 'images/sub/sub-eten-drinken-koffie-thee.webp' }, { slug: 'lekkernijen', naam: 'Lekkernijen', beeld: 'images/sub/sub-eten-drinken-lekkernijen.webp' }
    ] },
  { slug: 'hobby', naam: 'Hobby & Creatief', kort: 'Hobby & Creatief', icoon: 'palet',
    tekst: 'Zelf iets moois maken.', tegel: 'images/categorieen/categorie-hobby.webp', banner: 'images/banners/banner-cat-hobby.webp',
    subs: [
      { slug: 'tekenen-schilderen', naam: 'Tekenen & schilderen', beeld: 'images/sub/sub-hobby-tekenen-schilderen.webp' }, { slug: 'haken-breien', naam: 'Haken & breien', beeld: 'images/sub/sub-hobby-haken-breien.webp' },
      { slug: 'knutselen', naam: 'Zelf maken', beeld: 'images/sub/sub-hobby-knutselen.webp' }, { slug: 'modelbouw', naam: 'Modelbouw', beeld: 'images/sub/sub-hobby-modelbouw.webp' }
    ] },
  { slug: 'mode-beauty', naam: 'Mode & Beauty', kort: 'Mode & Beauty', icoon: 'tas',
    tekst: 'Mooie accessoires en verzorging.', tegel: 'images/categorieen/categorie-mode-beauty.webp', banner: 'images/banners/banner-cat-mode-beauty.webp',
    subs: [
      { slug: 'horloges', naam: 'Horloges', beeld: 'images/sub/sub-mode-beauty-horloges.webp' }, { slug: 'geuren', naam: 'Geuren', beeld: 'images/sub/sub-mode-beauty-geuren.webp' }, { slug: 'verzorging', naam: 'Verzorging', beeld: 'images/sub/sub-mode-beauty-verzorging.webp' },
      { slug: 'tassen', naam: 'Hand- & schoudertassen', beeld: 'images/sub/sub-mode-beauty-tassen.webp' }, { slug: 'rugzakken-reistassen', naam: 'Rugzakken & reistassen', beeld: 'images/sub/sub-mode-beauty-rugzakken-reistassen.webp' }, { slug: 'schoenen', naam: 'Schoenen', beeld: 'images/sub/sub-mode-beauty-schoenen-2026b.webp' }, { slug: 'kleding', naam: 'Kleding & sokken', beeld: 'images/sub/sub-mode-beauty-kleding.webp' }, { slug: 'accessoires', naam: 'Accessoires', beeld: 'images/sub/sub-mode-beauty-accessoires.webp' }
    ] },
  { slug: 'sieraden', naam: 'Sieraden', kort: 'Sieraden', icoon: 'ring',
    tekst: 'Kettingen, oorbellen, ringen en armbanden. Van betaalbaar tot echt goud.', tegel: 'images/categorieen/categorie-sieraden.webp', banner: 'images/banners/banner-cat-sieraden.webp',
    subs: [
      { slug: 'kettingen', naam: 'Kettingen & hangers', beeld: 'images/sub/sub-sieraden-kettingen.webp' }, { slug: 'oorbellen', naam: 'Oorbellen', beeld: 'images/sub/sub-sieraden-oorbellen.webp' }, { slug: 'ringen', naam: 'Ringen', beeld: 'images/sub/sub-sieraden-ringen.webp' }, { slug: 'armbanden', naam: 'Armbanden & enkelbandjes', beeld: 'images/sub/sub-sieraden-armbanden.webp' },
      { slug: 'heren', naam: 'Voor hem', beeld: 'images/sub/sub-sieraden-heren.webp' }, { slug: 'echt-goud', naam: 'Echt goud', beeld: 'images/sub/sub-sieraden-echt-goud.webp' }, { slug: 'zilver', naam: 'Zilver', beeld: 'images/sub/sub-sieraden-zilver.webp' }, { slug: 'verguld-staal', naam: 'Verguld & staal', beeld: 'images/sub/sub-sieraden-verguld-staal.webp' }, { slug: 'viking', naam: 'Viking-sieraden', beeld: 'images/sub/sub-sieraden-viking.webp' }
    ] },
  { slug: 'dranken', naam: 'Dranken', kort: 'Dranken', icoon: 'glas',
    tekst: 'Mooie flessen om te geven.', tegel: 'images/categorieen/categorie-dranken.webp', banner: 'images/banners/banner-cat-dranken.webp',
    subs: [
      { slug: 'whisky', naam: 'Whisky', beeld: 'images/sub/sub-dranken-whisky-2026b.webp' },
      { slug: 'cognac-brandy', naam: 'Cognac & brandy', beeld: 'images/sub/sub-dranken-cognac-brandy.webp' },
      { slug: 'rum', naam: 'Rum', beeld: 'images/sub/sub-dranken-rum.webp' },
      { slug: 'gin', naam: 'Gin', beeld: 'images/sub/sub-dranken-gin.webp' },
      { slug: 'wodka', naam: 'Wodka', beeld: 'images/sub/sub-dranken-wodka.webp' },
      { slug: 'tequila', naam: 'Tequila', beeld: 'images/sub/sub-dranken-tequila.webp' },
      { slug: 'likeur', naam: 'Likeur', beeld: 'images/sub/sub-dranken-likeur.webp' },
      { slug: 'wijn', naam: 'Wijn', beeld: 'images/sub/sub-dranken-wijn.webp' },
      { slug: 'bubbels', naam: 'Bubbels', beeld: 'images/sub/sub-dranken-bubbels.webp' },
      { slug: 'alcoholvrij', naam: 'Alcoholvrij', beeld: 'images/sub/sub-dranken-alcoholvrij.webp' },
      { slug: 'wijnaccessoires', naam: 'Wijnaccessoires', beeld: 'images/sub/sub-dranken-wijnaccessoires.webp' }
    ] },
  { slug: 'elektronica', naam: 'Elektronica & Gadgets', kort: 'Elektronica', icoon: 'koptelefoon',
    tekst: 'Slimme gadgets voor elke dag.', tegel: 'images/categorieen/categorie-elektronica.webp', banner: 'images/banners/banner-cat-elektronica.webp',
    subs: [
      { slug: 'audio', naam: 'Audio', beeld: 'images/sub/sub-elektronica-audio.webp' }, { slug: 'slimme-gadgets', naam: 'Slimme gadgets', beeld: 'images/sub/sub-elektronica-slimme-gadgets.webp' },
      { slug: 'telefoon', naam: 'Telefoon', beeld: 'images/sub/sub-elektronica-telefoon.webp' }, { slug: 'gaming', naam: 'Gaming', beeld: 'images/sub/sub-elektronica-gaming.webp' }, { slug: 'foto-video', naam: 'Foto & video', beeld: 'images/sub/sub-elektronica-foto-video.webp' }
    ] },
  { slug: 'sport-outdoor', naam: 'Sport, Outdoor & Reizen', kort: 'Sport, Outdoor & Reizen', icoon: 'bal',
    tekst: 'Erop uit, in beweging.', tegel: 'images/categorieen/categorie-sport-outdoor.webp', banner: 'images/banners/banner-cat-sport-outdoor.webp',
    subs: [
      { slug: 'fitness', naam: 'Fitness', beeld: 'images/sub/sub-sport-outdoor-fitness.webp' }, { slug: 'wandelen', naam: 'Wandelen', beeld: 'images/sub/sub-sport-outdoor-wandelen.webp' }, { slug: 'fietsen', naam: 'Fietsen', beeld: 'images/sub/sub-sport-outdoor-fietsen.webp' },
      { slug: 'kamperen', naam: 'Kamperen', beeld: 'images/sub/sub-sport-outdoor-kamperen.webp' }, { slug: 'reizen', naam: 'Reizen', beeld: 'images/sub/sub-sport-outdoor-reizen.webp' }, { slug: 'darts', naam: 'Darts', beeld: 'images/sub/sub-sport-outdoor-darts.webp' }, { slug: 'golf', naam: 'Golf', beeld: 'images/sub/sub-sport-outdoor-golf-2026b.webp' },
      /* Metaaldetectie is een eigen categorie, maar staat in het menu onder Sport (wens van Marius). */
      { slug: 'metaaldetectie', naam: 'Metaaldetectie', beeld: 'images/categorieen/categorie-metaaldetectie-klein.webp', naar: '/c/metaaldetectie' }
    ] },
  { slug: 'wonen', naam: 'Wonen & Decoratie', kort: 'Wonen & Deco', icoon: 'huis',
    tekst: 'Maak van je huis een warm thuis.', tegel: 'images/categorieen/categorie-wonen.webp', banner: 'images/banners/banner-cat-wonen.webp',
    subs: [
      { slug: 'kaarsen-geur', naam: 'Kaarsen & kandelaars', beeld: 'images/sub/sub-wonen-kaarsen-geur.webp' }, { slug: 'huisgeuren', naam: 'Huisgeuren', beeld: 'images/sub/sub-wonen-huisgeuren.webp' }, { slug: 'woonaccessoires', naam: 'Woonaccessoires', beeld: 'images/sub/sub-wonen-woonaccessoires.webp' },
      { slug: 'verlichting', naam: 'Verlichting', beeld: 'images/sub/sub-wonen-verlichting.webp' }, { slug: 'plaids-kussens', naam: 'Plaids & kussens', beeld: 'images/sub/sub-wonen-plaids-kussens.webp' },
      { slug: 'kerstdecoratie', naam: 'Kerstdecoratie', beeld: 'images/sub/sub-wonen-kerstdecoratie.webp' }
    ] },
  { slug: 'keuken', naam: 'Keuken & Tafelen', kort: 'Keuken', icoon: 'kop',
    tekst: 'Mooi koken, gezellig tafelen.', tegel: 'images/categorieen/categorie-keuken.webp', banner: 'images/banners/banner-cat-keuken.webp',
    subs: [
      { slug: 'koken', naam: 'Koken', beeld: 'images/sub/sub-keuken-koken.webp' }, { slug: 'keukenapparaten', naam: 'Keukenapparaten', beeld: 'images/sub/sub-keuken-keukenapparaten.webp' }, { slug: 'bakken', naam: 'Bakken', beeld: 'images/sub/sub-keuken-bakken.webp' }, { slug: 'serveren', naam: 'Serveren', beeld: 'images/sub/sub-keuken-serveren.webp' },
      { slug: 'koffie-thee', naam: 'Koffie- & theespullen', beeld: 'images/sub/sub-keuken-koffie-thee.webp' }, { slug: 'opbergen', naam: 'Opbergen', beeld: 'images/sub/sub-keuken-opbergen.webp' }
    ] },
  { slug: 'tuin-klussen', naam: 'Tuin & Klussen', kort: 'Tuin & Klussen', icoon: 'blad',
    tekst: 'Voor de tuin en de handige klusser.', tegel: 'images/categorieen/categorie-tuin-klussen.webp', banner: 'images/banners/banner-cat-tuin-klussen.webp',
    subs: [
      { slug: 'tuingereedschap', naam: 'Tuingereedschap', beeld: 'images/sub/sub-tuin-klussen-tuingereedschap.webp' }, { slug: 'planten-zaden', naam: 'Planten & zaden', beeld: 'images/sub/sub-tuin-klussen-planten-zaden.webp' },
      { slug: 'gereedschap', naam: 'Gereedschap', beeld: 'images/sub/sub-tuin-klussen-gereedschap.webp' }, { slug: 'buitenverlichting', naam: 'Buitenverlichting', beeld: 'images/sub/sub-tuin-klussen-buitenverlichting.webp' }
    ] },
  { slug: 'metaaldetectie', naam: 'Metaaldetectie', kort: 'Metaaldetectie', icoon: 'detector', onder: 'sport-outdoor',
    tekst: 'Zelf op schattenjacht: detectors, pinpointers, scheppen en meer.', tegel: 'images/categorieen/categorie-metaaldetectie.webp', banner: 'images/banners/banner-cat-metaaldetectie.webp',
    subs: [
      { slug: 'detectors', naam: 'Metaaldetectors', beeld: 'images/sub/sub-metaaldetectie-detectors.webp' },
      { slug: 'kinderen-beginners', naam: 'Voor kinderen & beginners', beeld: 'images/sub/sub-metaaldetectie-kinderen-beginners.webp' },
      { slug: 'pinpointers', naam: 'Pinpointers', beeld: 'images/sub/sub-metaaldetectie-pinpointers.webp' },
      { slug: 'graven', naam: 'Scheppen & graven', beeld: 'images/sub/sub-metaaldetectie-graven.webp' },
      { slug: 'magneetvissen', naam: 'Magneetvissen', beeld: 'images/sub/sub-metaaldetectie-magneetvissen.webp' },
      { slug: 'accessoires', naam: 'Tassen & koptelefoons', beeld: 'images/sub/sub-metaaldetectie-accessoires.webp' },
      { slug: 'vondsten', naam: 'Vondsten bewaren & boeken', beeld: 'images/sub/sub-metaaldetectie-vondsten.webp' }
    ] },
  { slug: 'dieren', naam: 'Dieren', kort: 'Dieren', icoon: 'poot',
    tekst: 'Verwen je trouwe vriend.', tegel: 'images/categorieen/categorie-dieren.webp', banner: 'images/banners/banner-cat-dieren.webp',
    subs: [ { slug: 'hond', naam: 'Hond', beeld: 'images/sub/sub-dieren-hond.webp' }, { slug: 'kat', naam: 'Kat', beeld: 'images/sub/sub-dieren-kat.webp' }, { slug: 'klein-dier', naam: 'Klein dier', beeld: 'images/sub/sub-dieren-klein-dier.webp' }, { slug: 'vogels', naam: 'Vogels', beeld: 'images/sub/sub-dieren-vogels.webp' } ] },
  { slug: 'boeken-media', naam: 'Boeken & Media', kort: 'Boeken & Media', icoon: 'boek',
    tekst: 'Boeken, filmavond en muziek.', tegel: 'images/categorieen/categorie-boeken-media.webp', banner: 'images/banners/banner-cat-boeken-media.webp',
    subs: [
      { slug: 'romans', naam: 'Romans', beeld: 'images/sub/sub-boeken-media-romans.webp' }, { slug: 'kinderboeken', naam: 'Kinderboeken', beeld: 'images/sub/sub-boeken-media-kinderboeken.webp' }, { slug: 'kookboeken', naam: 'Kookboeken', beeld: 'images/sub/sub-boeken-media-kookboeken.webp' },
      { slug: 'muziek', naam: 'Muziek', beeld: 'images/sub/sub-boeken-media-muziek.webp' }, { slug: 'agendas', naam: 'Agenda’s & notitieboeken', beeld: 'images/sub/sub-boeken-media-agendas.webp' }, { slug: 'lezen', naam: 'Leesplezier', beeld: 'images/sub/sub-boeken-media-lezen.webp' }
    ] },
  { slug: 'christelijk', naam: 'Christelijke cadeaus', kort: 'Christelijke cadeaus', icoon: 'kruis',
    tekst: 'Op zoek naar een christelijk cadeau met betekenis? Ontdek Bijbels, sieraden met een kruis, tegeltjes en wandborden met een Bijbeltekst en mooie geschenken voor jong en oud. Voor een doop, belijdenis, verjaardag of om iemand een hart onder de riem te steken.',
    seoTitel: 'Christelijke cadeaus & geschenken met betekenis',
    seoTekst: 'Christelijke cadeaus en geschenken: Bijbels (Statenvertaling en HSV), tegeltjes met Bijbeltekst, dagboeken en kinderbijbels. Voor doop, belijdenis, verjaardag of troost.',
    gids: [
      { kop: 'Een christelijk cadeau kiezen', tekst: 'Een christelijk cadeau zegt vaak meer dan een gewoon cadeau. Denk na over wat de ontvanger raakt: een Bijbeltekst die bij een moment in het leven past, een sieraad dat elke dag gedragen wordt of een boek om samen in te lezen. Kijk ook naar de vertaling of de stijl die iemand in de kerk gewend is.' },
      { kop: 'Voor een doop of belijdenis', tekst: 'Bij een doop is een kinderbijbel, een psalmboekje of een mooi aandenken met een Bijbeltekst een blijvend cadeau. Voor een belijdenis kies je vaak een eigen Bijbel (Statenvertaling of HSV), een Bijbel met psalmen, een dagboek of een mooie Bijbelhoes.' },
      { kop: 'Een geschenk met een Bijbeltekst', tekst: 'Een tegeltje, wandbord of kaart met een Bijbeltekst is een klein gebaar dat lang blijft hangen. Teksten als Psalm 23 of "Wees sterk en moedig" geven troost en kracht, bijvoorbeeld bij ziekte, verdriet of een nieuwe stap in het leven.' },
      { kop: 'Christelijke cadeaus voor kinderen', tekst: 'Voor kinderen zijn er kinderbijbels met mooie platen, psalmen en gebedjes op kindermaat en speelgoed met Bijbelverhalen, zoals de ark van Noach. Zo maken ze op een speelse manier kennis met het geloof.' }
    ],
    tegel: 'images/categorieen/categorie-christelijk.webp', banner: 'images/banners/banner-cat-christelijk.webp',
    subs: [
      { slug: 'bijbeltekst', naam: 'Met Bijbeltekst', kop: 'Cadeau met Bijbeltekst', beeld: 'images/sub/sub-christelijk-bijbeltekst.webp',
        seoTitel: 'Cadeau met Bijbeltekst: tegeltjes, wandborden en meer',
        seoTekst: 'Een geschenk met een Bijbeltekst: tegeltjes, wandborden, sieraden en dagboeken met Psalm 23, Jozua 1:9 en andere teksten. Om te troosten of te bemoedigen.',
        tekst: 'Een Bijbeltekst om elke dag te zien. Tegeltjes, wandborden, sieraden en dagboeken met teksten die troosten, bemoedigen of gewoon blij maken.' },
      { slug: 'onder-25', naam: 'Onder €25', kop: 'Christelijk cadeau onder €25', beeld: 'images/sub/sub-christelijk-onder-25.webp',
        seoTitel: 'Christelijk cadeau onder €25',
        seoTekst: 'Christelijke cadeaus onder de 25 euro: kleine Bijbels, tegeltjes met Bijbeltekst, kruiskettingen, kinderboekjes en meer. Een mooi gebaar voor elk budget.',
        tekst: 'Een betekenisvol cadeau hoeft niet duur te zijn. Hier staan alle christelijke cadeaus onder de 25 euro (zonder losse kaartjes).' },
      { slug: 'kerst', naam: 'Kerst', beeld: 'images/sub/sub-christelijk-kerst-2026b.webp', seoTitel: 'Christelijke kerstcadeaus en kerstkaarten', seoTekst: 'Christelijke kerstcadeaus: kerstkaarten met het kerstverhaal, kerststallen en sfeervolle decoratie rond de geboorte van Jezus.' },
      { slug: 'bijbels', naam: 'Bijbels', beeld: 'images/sub/sub-christelijk-bijbels-2026b.webp', seoTitel: 'Bijbel als cadeau: Statenvertaling, HSV en kinderbijbels', seoTekst: 'Een Bijbel cadeau geven: Statenvertaling, HSV, Bijbels met psalmen, kanttekeningenbijbels en kinderbijbels. Voor doop, belijdenis of huwelijk.' }, { slug: 'kaarten-posters', naam: 'Kaarten & posters', beeld: 'images/sub/sub-christelijk-kaarten-posters.webp', seoTitel: 'Christelijke kaarten met Bijbeltekst', seoTekst: 'Christelijke kaarten en posters met een Bijbeltekst: voor een verjaardag, doop, huwelijk, beterschap of om te bemoedigen.' },
      { slug: 'sieraden', naam: 'Sieraden', beeld: 'images/sub/sub-christelijk-sieraden.webp', seoTitel: 'Christelijke sieraden: kruiskettingen en armbanden met kruis', seoTekst: 'Christelijke sieraden als cadeau: kruiskettingen, armbanden met een kruis, ichthus-hangers en sleutelhangers met een Bijbeltekst. Voor haar en voor hem.' }, { slug: 'wanddecoratie', naam: 'Wanddecoratie', beeld: 'images/sub/sub-christelijk-wanddecoratie.webp', seoTitel: 'Christelijke wanddecoratie: tegeltjes en tekstborden', seoTekst: 'Tegeltjes, tekstborden en mokken met een Bijbeltekst, zoals Psalm 23 en Psalm 121. Christelijke decoratie voor in huis of als cadeau.' },
      { slug: 'voor-kinderen', naam: 'Voor kinderen', beeld: 'images/sub/sub-christelijk-voor-kinderen.webp', seoTitel: 'Christelijke cadeaus voor kinderen: kinderbijbels en meer', seoTekst: 'Christelijke cadeaus voor kinderen: kinderbijbels, psalmboekjes, peuterdagboeken, de catechismus voor kinderen en speelgoed met Bijbelverhalen.' }, { slug: 'boeken-muziek', naam: 'Boeken & muziek', beeld: 'images/sub/sub-christelijk-boeken-muziek.webp', seoTitel: 'Christelijke boeken en dagboeken als cadeau', seoTekst: 'Christelijke boeken, dagboeken en muziek: HSV-dagboeken, boeken over bidden en de psalmen, dagboekkalenders en meer. Een mooi cadeau voor elke dag.' },
      { slug: 'kerststal-engelen', naam: 'Kerststallen & engelen', beeld: 'images/sub/sub-christelijk-kerststal-engelen.webp', seoTitel: 'Kerststal kopen: houten kerststallen en engelen', seoTekst: 'Kerststallen en engelen voor de kerst: houten kerststallen, kerststalfiguren en sfeervolle engeltjes voor in huis.' }, { slug: 'doop-belijdenis', naam: 'Doop & belijdenis', beeld: 'images/sub/sub-christelijk-doop-belijdenis.webp' , tekst: 'Cadeaus voor een doop of belijdenis: kinderbijbels, eerste Bijbels, dagboeken en mooie aandenkens voor deze bijzondere dag.', seoTitel: 'Doopcadeau en belijdeniscadeau: christelijke cadeaus', seoTekst: 'Een doopcadeau of belijdeniscadeau met betekenis: kinderbijbels, Statenvertaling en HSV Bijbels, Bijbelhoezen, dagboeken en aandenkens met een Bijbeltekst.' },

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
    { id: 'haar', label: 'Haar' }, { id: 'hem', label: 'Hem' }, { id: 'kind', label: 'Een kind' }, { id: 'tiener', label: 'Een tiener' },
    { id: 'opa-oma', label: 'Opa of oma' }, { id: 'collega', label: 'Een collega' }, { id: 'iedereen', label: 'Maakt niet uit' }
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
 "speelgoed/figuren-voertuigen": "schleich playmobil speelfiguur speelfiguren bruder siku brio speelgoedauto speelgoedtractor treinset houten trein",
 "speelgoed/bordspellen": "bordspel bordspellen",
 "speelgoed/kaartspellen": "kaartspel kaartspellen dobbelspel",
 "speelgoed/puzzels": "puzzel puzzels legpuzzel",
 "speelgoed/buitenspeelgoed": "bellenblaas vlieger stoepkrijt buitenspeelgoed loopfiets step driewieler skelter trampoline zandbak",
 "speelgoed/knutselen": "knutsel knutselset diy klei",
 "wonen/kaarsen-geur": "kaars kaarsen geurkaars kandelaar waxinelichthouder",
 "wonen/huisgeuren": "geurstokjes wierook geurolie huisparfum waxmelt geurwax roomspray",
 "wonen/woonaccessoires": "vaas vazen fotolijst klok spiegel decoratie",
 "wonen/verlichting": "lamp lampje lampen verlichting lichtsnoer",
 "wonen/plaids-kussens": "plaid kussen kussenhoes deken",
 "wonen/kerstdecoratie": "kerstbal kerstballen kerstboom kersthanger kerstdecoratie kerstslinger",
 "hobby/tekenen-schilderen": "verf schilderset aquarel potloden stiften schetsboek",
 "hobby/haken-breien": "haakset breiset garen breinaalden haakpakket",
 "hobby/knutselen": "knutsel knutselset diy",
 "hobby/modelbouw": "bouwpakket modelbouw",
 "elektronica/audio": "speaker koptelefoon oordopjes radio soundbar luidspreker headset",
 "elektronica/slimme-gadgets": "gadget powerbank oplader usb",
 "elektronica/telefoon": "telefoon telefoonhoes smartphone",
 "elektronica/gaming": "gaming game controller",
 "elektronica/foto-video": "camera instax fotocamera",
 "sieraden/kettingen": "ketting kettingen collier choker",
 "sieraden/oorbellen": "oorbellen oorbel oorknopjes oorringen",
 "sieraden/ringen": "ring ringen zegelring bague",
 "sieraden/armbanden": "armband armbanden bracelet bangle enkelbandje",
 "sieraden/heren": "herensieraden manchetknopen herenarmband herenring herenketting zegelring",
 "sieraden/echt-goud": "karaat 14k 18k 10k 9k",
 "sieraden/zilver": "sterling 925",
 "sieraden/verguld-staal": "verguld vergulde",
 "sieraden/viking": "viking vikings mjolnir mjölnir vegvisir valknut yggdrasil",
 "mode-beauty/horloges": "horloge horloges",
 "mode-beauty/geuren": "parfum eau",
 "mode-beauty/verzorging": "bodycrème bodyscrub zeep handcrème massageolie lippenbalsem",
 "mode-beauty/tassen": "tas tassen handtas schoudertas clutch tasje",
 "mode-beauty/rugzakken-reistassen": "rugzak weekendtas reistas",
 "mode-beauty/schoenen": "laarzen laars schoenen boots loafers sneakers pantoffels",
 "mode-beauty/kleding": "trui truien vest hoodie sweater pullover jas jassen sokken",
 "mode-beauty/accessoires": "sjaal handschoenen riem portemonnee muts",
 "keuken/koken": "pan pannen koekenpan braadpan snijplank keukenmes",
 "keuken/keukenapparaten": "blender mixer waterkoker",
 "keuken/bakken": "bakvorm taartvorm deegroller bakmix",
 "keuken/serveren": "schaal schaaltje dienblad karaf serveerschaal",
 "keuken/koffie-thee": "theepot koffiemolen mok mokken percolator theeglas",
 "keuken/opbergen": "voorraadpot bewaardoos trommel",
 "eten-drinken/chocolade-snoep": "chocolade bonbons marsepein",
 "eten-drinken/drop-snoep": "drop dropjes snoep zuurtjes",
 "eten-drinken/bbq": "barbecue bbq kruidenmix grill marinade",
 "eten-drinken/pakketten": "pakket cadeaupakket cadeaubox",
 "eten-drinken/koffie-thee": "koffie thee koffiebonen",
 "eten-drinken/lekkernijen": "honing jam balsamico olijfolie pesto zout",
 "dranken/whisky": "whisky whiskey bourbon scotch",
 "dranken/alcoholvrij": "alcoholvrij alcoholvrije kinderchampagne kidibul mocktail mocktails",
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
 "sport-outdoor/fitness": "fitness yoga dumbbell kettlebell halter weerstandsband springtouw",
 "sport-outdoor/wandelen": "picknick drinkfles wandelstok wandelschoen wandelschoenen wandelsok hiking",
 "sport-outdoor/fietsen": "fiets fietsbel fietstas fietsmand fietshelm fietsslot fietslamp fietspomp",
 "sport-outdoor/golf": "golf golfbal golfballen",
 "christelijk/kerststal-engelen": "kerststal kribbe engel engeltje beschermengel",
 "christelijk/doop-belijdenis": "doop doopcadeau belijdenis belijdeniscadeau",
  "sport-outdoor/kamperen": "kamperen tent camping slaapzak luchtbed koelbox campingstoel kampeerstoel kooktoestel gasbrander",
 "sport-outdoor/reizen": "toilettas reiskoffer trolley reiskussen reisset",
 "sport-outdoor/darts": "dart darts dartbord",
 "dieren/hond": "hond honden",
 "dieren/kat": "kat katten poes",
 "dieren/klein-dier": "konijn cavia hamster",
 "dieren/vogels": "vogel vogels nestkast vogelhuisje",
 "boeken-media/romans": "romans",
 "boeken-media/lezen": "boekensteun boekensteunen boekenlegger leeslampje boeklampje",
 "boeken-media/kinderboeken": "kinderboek prentenboek",
 "boeken-media/kookboeken": "kookboek",
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
 "sieraden": "sieraden sieraad ketting kettingen collier oorbellen oorbel boucles armband armbanden bracelet ring ringen",
 "mode-beauty": "armband bodycrème bodyscrub boots clutch eau handcrème handschoenen handtas horloge horloges ketting laars laarzen lippenbalsem loafers massageolie muts oorbellen pantoffels parfum portemonnee reistas riem ring rugzak schoenen schoudertas sieraden sjaal sneakers tas tasje tassen weekendtas zeep",
 "keuken": "bakmix bakvorm bewaardoos blender braadpan deegroller dienblad karaf keukenmes koekenpan koffiemolen mixer mok mokken pan pannen percolator schaal schaaltje serveerschaal snijplank taartvorm theeglas theepot trommel voorraadpot waterkoker",
 "eten-drinken": "balsamico bonbons cadeaubox cadeaupakket chocolade drop dropjes honing jam koffie koffiebonen marsepein olijfolie pakket pesto snoep thee zout zuurtjes",
 "dranken": "armagnac bourbon brandy calvados cava champagne cognac crémant decanteerkaraf gin grappa kurkentrekker likeur likeuren limoncello liqueur mezcal mousserend prosecco ron rum scotch tequila vodka whiskey whisky wijn wijnglas wijnglazen wodka",
 "tuin-klussen": "bloempot buitenlamp gereedschap gieter hamer kweekpot kweekset lantaarn schepje schroevendraaier snoeischaar tuingereedschap tuinlamp zaden",
 "sport-outdoor": "camping dart dartbord darts drinkfles fiets fietsbel fitness golf golfbal golfballen kamperen picknick tent toilettas wandelstok yoga",
 "dieren": "cavia hamster hond honden kat katten konijn nestkast poes vogel vogelhuisje vogels",
 "boeken-media": "agenda boekenlegger boekensteun boekensteunen film kinderboek kookboek leeslampje muziek notitieboek planner popcorn prentenboek roman vinyl"
};
/* Extra woorden waarmee de zoekpagina een (sub)categorie als tip laat zien ('Bekijk ook: …'), naast de naam van de categorie.
   Voor Christelijke cadeaus tellen alleen deze woorden, zodat die categorie niet bij elk 'kerst' opduikt. */
window.LK_ZOEKTIPS = {
 "christelijk": "christelijk christelijke bijbel bijbels bijbeltekst gereformeerd kerk geloof psalm psalmen",
 "christelijk/bijbels": "bijbel bijbels statenvertaling hsv kinderbijbel",
 "christelijk/doop-belijdenis": "doop doopcadeau belijdenis belijdeniscadeau",
 "christelijk/bijbeltekst": "bijbeltekst psalm tegeltje",
 "christelijk/kerststal-engelen": "kerststal",
 "cadeaus/onder-15": "goedkoop goedkope budget klein kleinigheidje",
 "cadeaus/sint-onder-15": "schoencadeau schoencadeautje lootjes surprise",
 "cadeaus/sinterklaas": "sint pakjesavond schoencadeau surprise",
 "cadeaus/kerst": "kerstcadeau kerstcadeaus kerstpakket",
 "cadeaus/collega": "collega werk kantoor pensioen afscheid bedankje lootjes juf meester leerkracht",
 "cadeaus/met-naam": "gepersonaliseerd persoonlijk gegraveerd gravure naam",
 "cadeaus/baby-kraam": "kraamcadeau geboorte babyshower zwanger",
 "cadeaus/voor-haar": "vrouw vrouwen moeder mama vriendin zus oma",
 "cadeaus/voor-hem": "man mannen vader papa vriend broer opa",
 "cadeaus/opa-oma": "opa oma grootouders",
 "cadeaus/voor-kinderen": "kind kinderen jongen meisje tiener",
 "cadeaus/adventskalenders": "adventskalender advent aftellen",
 "eten-drinken/pakketten": "kerstpakket cadeaupakket borrelpakket borrel",
 "wonen": "housewarming verhuizing verhuisd woning",
 "wonen/kerstdecoratie": "kerstversiering kerstspullen",
 "hobby/knutselen": "diy zelfmaken zelf maken zeep kaarsen",
 "metaaldetectie": "metaaldetector metaaldetectie schatzoeken",
 "metaaldetectie/pinpointers": "pinpointer",
 "metaaldetectie/magneetvissen": "magneetvissen vismagneet",
 "boeken-media/lezen": "e-reader ereader kindle",
 "elektronica/audio": "speaker alexa echo",
 "dranken/whisky": "whiskey whisky",
 "dranken/wijnaccessoires": "whiskyglazen whiskystenen karaf"
};
/* Woorden die NIET in de titel mogen staan bij 'Meer in onze winkels' (zoals 'gordijn met ringen' bij Ringen). */
window.LK_NIETWOORDEN = {
 "sieraden/kettingen": "discobal marmeren",
 "sieraden/ringen": "baguette watch horloge dr martens 1460 gordijn glasgordijn vaas voorwerp drankspel kandelaar lunchbox pop holder ketting stekers bloomring multitool toss fire",
 "sieraden/armbanden": "paracord survival",
 "sieraden/heren": "herència herencia wijn watch horloge schoen schoenen laars laarzen boots sneakers trui jas broek overhemd shirt sokken tas pantoffels sloffen jumper jacket jeans riem",
 "sieraden/zilver": "gram lavalamp lava drop watch horloge vaas lamp kandelaar dienblad bestek glas glazen schaal fotolijst spiegel kerstbal boom dial",
 "sieraden/echt-goud": "roos verguld vergulde plated",
 "sieraden/viking": "kettingslot slot fietsslot hoeslaken dekbedovertrek kussensloop mok beker glas drinkhoorn bord kostuum pop playmobil lego baard balsem shirt boek puzzel spel hoed helm zwaard schild",
 "sieraden/verguld-staal": "kast tafel stoel fauteuil spiegel lamp watch horloge vaas kandelaar dienblad bestek fotolijst",
 "sieraden": "gordijn glasgordijn vaas voorwerp drankspel kandelaar lunchbox pop holder stekers bloomring multitool toss fire snoep marmeren discobal paracord survival",
 "mode-beauty/horloges": "snoep",
 "mode-beauty/kleding": "kast meubel kerstboom hanger mok wijnfles bed dekbed sac kersthanger plaid truienkam kaart",
 "mode-beauty/accessoires": "sandalen hoeslaken kersthanger badjas kaart wijnflessen dieet",
 "mode-beauty/schoenen": "veger",
 "mode-beauty/verzorging": "allesreiniger",
 "mode-beauty": "gordijn vaas kersthanger badjas hoeslaken snoep sandalen kaart",
 "wonen/woonaccessoires": "kledingkast ladekast garderobe salontafel kast",
 "wonen": "kledingkast ladekast garderobe salontafel kast",
 "hobby/haken-breien": "garenne garennes",
 "hobby/tekenen-schilderen": "dobbelspel",
 "hobby": "wandkapstok kapstok kapstop wandhaak rek garenne garennes",
 "elektronica/foto-video": "sleutelhanger deurmat puntenslijper tegeltje mok beker sieradendoosje multi",
 "elektronica/gaming": "deurmat mok drinking bordspel pizza stapelspel schaakset boekensteun",
 "eten-drinken/bbq": "kaarten croky chips pringles lays grillons grillo",
 "eten-drinken/pakketten": "matras dekbed inclusive",
 "eten-drinken/lekkernijen": "keelpastilles ricola anta",
 "dranken/wijn": "mok tegeltje lolly bordspel azijn zout decanteerder decanteerschenker boek wijnfles aroma",
 "dranken/bubbels": "brunello bolgheri aroma",
 "dranken": "mok tegeltje lolly bordspel azijn zout boek",
 "speelgoed/bouwen": "bedset",
 "tuin-klussen/gereedschap": "drop spaarvarken bbq",
 "boeken-media/muziek": "kast meubel onderkast vinylkast vinylmeubel servetten",
 "boeken-media/kinderboeken": "kinderboekenkast kinderboekenrek",
 "boeken-media": "kast meubel onderkast vinylkast vinylmeubel servetten kussenhoes gordijn badmat",
 "cadeaus/voor-kinderen": "ladekast bureau boekenkast vloerkleed opbergrek wandrek dekbedovertrek fauteuil hoeklaken nachtkastje kapstok boekenrek",
 "cadeaus/baby-kraam": "matras schuimmatras dekbed sac"
};

/* ===== LeukeKeuze 2.0 – PROEF (nog niet live): personen als hoofdingang. =====
   Elke persoon heeft eigen subcategorieën. Een product hoort erbij als het label (voor) klopt
   én de categorie/sub (of 'ookIn') in een van de 'vakken' van die subcategorie valt. Niets hoeft opnieuw gelabeld. */
window.LK_PERSONEN = (function () {
  var B = function (n) { return 'images/sub/sub-' + n + '.webp'; };
  var SIERADEN = ['sieraden/ringen', 'sieraden/echt-goud', 'sieraden/oorbellen', 'sieraden/kettingen', 'sieraden/zilver', 'sieraden/armbanden', 'sieraden/sieradendozen', 'sieraden/parels', 'sieraden/bedels', 'sieraden/met-naam'];
  var TASSEN = ['mode-beauty/tassen', 'mode-beauty/portemonnees', 'mode-beauty/rugzakken', 'mode-beauty/koffers', 'mode-beauty/toilettassen'];
  var KLEDING = ['mode-beauty/pantoffels-sokken', 'mode-beauty/truien-hoodies', 'mode-beauty/pyjamas', 'mode-beauty/schoenen', 'mode-beauty/mutsen-sjaals', 'mode-beauty/riemen-sleutelhangers', 'mode-beauty/zonnebrillen'];
  var SPELLEN = ['speelgoed/puzzels', 'speelgoed/bord-kaartspellen', 'boeken-media/puzzelboeken'];
  var s = function (slug, naam, beeld, vakken, seoTitel, tekst, extra) { return Object.assign({ slug: slug, naam: naam, beeld: beeld ? B(beeld) : '', vakken: vakken, seoTitel: seoTitel, tekst: tekst }, extra || {}); };
  return [
  { slug: 'hem', naam: 'Voor hem', kort: 'Voor hem', labels: ['hem'], oud: 'cadeaus/voor-hem',
    beeld: B('cadeaus-voor-hem-2026b'), vaag: B('cadeaus-voor-hem-2026b'),
    seoTitel: 'Cadeau voor hem of je vriend – de mooiste cadeaus voor mannen', tekst: 'Voor je vriend, je vader of je broer: van een goed horloge tot een fles whisky, met de hand gekozen cadeaus voor hem.',
    subs: [
      s('horloges-sieraden', 'Horloges & sieraden', 'mode-beauty-horloges', ['sieraden'], 'Horloge of sieraad voor hem – herenhorloges en armbanden', 'Een horloge, armband of ketting die hij elke dag draagt. Van strak en klassiek tot stoer.'),
      s('darts-sport', 'Darts & sport', 'sport-outdoor-darts', ['sport-outdoor'], 'Darts en sportcadeau voor hem', 'Dartborden, pijlen en alles voor de sportieve man: fietsen, golf, fitness en meer.'),
      s('zakmessen-gereedschap', 'Zakmessen & gereedschap', 'tuin-klussen-gereedschap', ['tag:zakmes', 'tuin-klussen/handgereedschap-werkplaats', 'tuin-klussen/elektrisch-gereedschap'], 'Zakmes en gereedschap cadeau voor hem', 'Een goed zakmes, multitool of gereedschap voor de handige man.'),
      s('parfum-verzorging', 'Parfum & verzorging', 'mode-beauty-geuren', ['geuren-verzorging'], 'Parfum en verzorging voor hem – herengeuren als cadeau', 'Herenparfum, scheerspullen en baardverzorging. Ook mooie cadeausets.'),
      s('whisky-bier-drank', 'Whisky, bier & drank', 'dranken-whisky-2026b', ['dranken'], 'Drank cadeau voor hem – whisky, bier en meer', 'Een mooie fles whisky, speciaalbier of gin. Vaak in een cadeauverpakking.'),
      s('lego-spellen', 'LEGO & spellen', 'speelgoed-bouwen', ['speelgoed/lego', 'speelgoed/bord-kaartspellen', 'speelgoed/puzzels', 'hobby/modelbouw'], 'LEGO en spellen cadeau voor mannen', 'Bouwsets, bordspellen en puzzels. Uren plezier aan tafel.'),
      s('portemonnees-tassen', 'Portemonnees & tassen', 'mode-beauty-tassen', TASSEN, 'Portemonnee of tas cadeau voor hem', 'Een leren portemonnee, pasjeshouder, rugzak of weekendtas.'),
      s('pantoffels-kleding', 'Pantoffels & kleding', 'mode-beauty-kleding', KLEDING, 'Pantoffels en kleding cadeau voor hem', 'Warme pantoffels, sokken, truien en een goede pyjama.'),
      s('metaaldetectie', 'Metaaldetectie', 'metaaldetectie-detectors', ['metaaldetectie'], 'Metaaldetector cadeau voor hem', 'Een detector, pinpointer of schep voor de schatzoeker. Ook voor wie net begint.'),
      s('gadgets-gaming', 'Gadgets & gaming', 'elektronica-gaming', ['elektronica'], 'Gadgets en gaming cadeau voor hem', 'Koptelefoons, speakers, slimme gadgets en alles voor de gamer.'),
      s('bbq-lekkers', 'BBQ & lekkers', 'eten-drinken-bbq', ['tuin-klussen/bbq-buitenkoken', 'eten-drinken'], 'BBQ en lekkers cadeau voor hem', 'Alles voor de grillmeester, plus sauzen, borrelpakketten en lekkers.'),
      s('boeken-muziek', 'Boeken & muziek', 'boeken-media-muziek', ['boeken-media'], 'Boeken en muziek cadeau voor hem', 'Thrillers, strips, vinyl en meer.'),
      s('wonen-keuken', 'Wonen & keuken', 'wonen-woonaccessoires', ['wonen', 'keuken'], 'Woon- en keukencadeau voor hem', 'Stoere woonaccessoires, mooie glazen en keukenspullen.')
    ] },
  { slug: 'haar', naam: 'Voor haar', kort: 'Voor haar', labels: ['haar'], oud: 'cadeaus/voor-haar', beeld: B('cadeaus-voor-haar-2026b'), vaag: B('cadeaus-voor-haar-2026b'),
    seoTitel: 'Cadeau voor haar of je vriendin – de mooiste cadeaus voor vrouwen', tekst: 'Voor je vriendin, je moeder of je zus: sieraden, geuren en iets moois voor in huis, met de hand gekozen.',
    subs: [
      s('sieraden', 'Sieraden', 'sieraden-kettingen', SIERADEN, 'Sieraden cadeau voor haar – kettingen, oorbellen en armbanden', 'Een sieraad geef je met gevoel. Kettingen, oorbellen, ringen en armbanden, van betaalbaar tot echt goud.'),
      s('wonen-sfeer', 'Wonen & sfeer', 'wonen-kaarsen-geur', ['wonen'], 'Sfeervol woon- en decoratiecadeau voor haar', 'Kaarsen, geurstokjes, plaids en mooie dingen voor in huis.'),
      s('bloemen-planten', 'Bloemen & planten', 'tuin-klussen-planten-zaden', ['wonen/vazen-bloemen', 'tuin-klussen/planten-potten', 'tuin-klussen/moestuin-kweken'], 'Bloemen en planten cadeau voor haar', 'Een mooi boeket, een plant of een vaas. Ook door de brievenbus.'),
      s('puzzels-spellen', 'Puzzels & spellen', 'speelgoed-puzzels', SPELLEN, 'Puzzels en spellen cadeau voor haar', 'Legpuzzels, puzzelboeken en spellen voor een gezellige avond.'),
      s('tassen-portemonnees', 'Tassen & portemonnees', 'mode-beauty-tassen', TASSEN, 'Tas of portemonnee cadeau voor haar', 'Handtassen, shoppers, portemonnees en toilettassen.'),
      s('champagne-wijn-lekkers', 'Champagne, wijn & lekkers', 'dranken-bubbels', ['dranken', 'eten-drinken'], 'Champagne, wijn en lekkers voor haar', 'Bubbels, een goede fles wijn, bonbons en lekkere pakketten.'),
      s('horloges', 'Horloges', 'mode-beauty-horloges', ['sieraden/horloges', 'sieraden/smartwatches'], 'Dameshorloge cadeau', 'Elegante dameshorloges en smartwatches.'),
      s('parfum-verzorging', 'Parfum & verzorging', 'mode-beauty-geuren', ['geuren-verzorging'], 'Parfum en verzorging cadeau voor haar', 'Damesparfum, Rituals, verzorging en mooie cadeausets.'),
      s('pantoffels-sjaals-kleding', 'Pantoffels, sjaals & kleding', 'mode-beauty-kleding', KLEDING, 'Pantoffels, sjaals en kleding cadeau voor haar', 'Warme sloffen, een zachte sjaal, pyjama of trui.'),
      s('haken-breien-creatief', 'Haken, breien & creatief', 'hobby-haken-breien', ['hobby'], 'Creatief cadeau voor haar – haken, breien, schilderen', 'Voor wie graag met haar handen bezig is.'),
      s('yoga-sport', 'Yoga & sport', 'sport-outdoor-fitness', ['sport-outdoor'], 'Yoga en sport cadeau voor haar', 'Yoga, fitness, wandelen en fietsen: cadeaus voor een actieve vrouw.'),
      s('boeken-agendas', "Boeken & agenda's", 'boeken-media-romans', ['boeken-media'], "Boeken en agenda's cadeau voor haar", "Thrillers, romans, puzzelboeken en mooie agenda's."),
      s('keuken-koffie-thee', 'Keuken, koffie & thee', 'keuken-koffie-thee', ['keuken'], 'Keuken-, koffie- en theecadeau voor haar', 'Mooie mokken, theespullen en keukenspullen.'),
      s('met-naam', 'Met naam', 'cadeaus-met-naam-2026b', ['cadeaus/met-naam', 'valentijn/met-naam', 'sieraden/met-naam'], 'Persoonlijk cadeau voor haar met naam', 'Een cadeau met haar naam of een eigen tekst. Altijd uniek.'),
      s('gadgets-audio', 'Gadgets & audio', 'elektronica-audio', ['elektronica'], 'Gadgets cadeau voor haar', 'Koptelefoons, speakers, camera’s en slimme gadgets.')
    ] },
  { slug: 'kinderen', naam: 'Voor kinderen', kort: 'Kinderen', labels: ['kind', 'kinderen'], oud: 'cadeaus/voor-kinderen', beeld: B('cadeaus-voor-kinderen-2026b'), vaag: B('cadeaus-voor-kinderen-2026b'),
    knoppen: ['kind', 'leeftijd'],
    seoTitel: 'Cadeau voor kinderen – speelgoed en leuke cadeaus', tekst: 'Speelgoed, boeken en knutselspullen: cadeaus waar kinderen blij van worden. Kies jongen of meisje en de leeftijd.',
    subs: [
      s('bouwen', 'Bouwen & LEGO', 'speelgoed-bouwen', ['speelgoed/lego', 'speelgoed/playmobil', 'speelgoed/knikkerbanen-magnetisch'], 'LEGO en bouwspeelgoed cadeau', 'LEGO, Duplo, Playmobil en knikkerbanen. Voor kleine en grote bouwers.'),
      s('knutselen', 'Knutselen & creatief', 'speelgoed-knutselen', ['speelgoed/knutselen-kleuren', 'hobby', 'boeken-media/kleurboeken'], 'Knutselcadeau voor kinderen', 'Tekenen, verven, kleien en knutselpakketten voor creatieve kinderen.'),
      s('buiten', 'Buitenspeelgoed', 'speelgoed-buitenspeelgoed', ['speelgoed/buitenspeelgoed', 'sport-outdoor/skateboards-steps', 'metaaldetectie'], 'Buitenspeelgoed cadeau', 'Ballen, steps, skelters, een eerste metaaldetector en alles om buiten mee te spelen.'),
      s('figuren', 'Poppen, auto’s & knuffels', 'speelgoed-figuren-voertuigen', ['speelgoed/poppen-barbie', 'speelgoed/autos-treinen-rc', 'speelgoed/knuffels-squishmallows', 'speelgoed/speelkeukens-verkleden', 'speelgoed/hypes-trends', 'speelgoed/pokemon-verzamelkaarten'], 'Poppen, auto’s en knuffels cadeau', 'Poppen, auto’s, treinen, knuffels en de hypes van nu.'),
      s('spellen', 'Spellen & puzzels', 'speelgoed-bordspellen', ['speelgoed/bord-kaartspellen', 'speelgoed/puzzels'], 'Spellen en puzzels voor kinderen', 'Bordspellen, kaartspellen en puzzels voor samen aan tafel.'),
      s('boeken', 'Kinderboeken', 'boeken-media-kinderboeken', ['boeken-media'], 'Kinderboeken cadeau', 'Prentenboeken, voorleesboeken, strips en boeken voor beginnende lezers.'),
      s('gaming', 'Gaming & gadgets', 'elektronica-gaming', ['elektronica'], 'Gaming en gadgets voor kinderen', 'Games, koptelefoons en kindvriendelijke gadgets.'),
      s('kinderkamer', 'Kinderkamer', 'wonen-verlichting', ['wonen'], 'Cadeau voor de kinderkamer', 'Nachtlampjes, kussens en vrolijke decoratie voor de kinderkamer.'),
      s('sinterklaas', 'Sinterklaas', 'cadeaus-sinterklaas', ['cadeaus/sinterklaas', 'eten-drinken/sinterklaas-lekkers'], 'Sinterklaascadeau voor kinderen', 'Cadeautjes voor in de schoen en voor pakjesavond.', { tot: '12-05' }),
      s('schoenen-kleding', 'Schoenen & kleding', 'mode-beauty-schoenen-2026b', ['mode-beauty'], 'Kinderschoenen en kleding cadeau', 'Laarsjes, sloffen, rugzakken en vrolijke kleding.'),
      s('lekkers', 'Lekkers', 'eten-drinken-drop-snoep', ['eten-drinken'], 'Lekkers cadeau voor kinderen', 'Snoep, chocolade en kleine traktaties.'),
      s('buiten-tuin', 'Tuin & natuur', 'tuin-klussen-planten-zaden', ['tuin-klussen', 'dieren'], 'Natuurcadeau voor kinderen', 'Zaadjes, vogelhuisjes en ontdekken in de tuin.')
    ] },
  { slug: 'tieners', naam: 'Voor tieners', kort: 'Tieners', labels: ['tiener'], beeld: B('elektronica-gaming'), vaag: B('elektronica-gaming'),
    knoppen: ['kind'],
    seoTitel: 'Cadeau voor tieners – cadeaus voor 12 tot 18 jaar', tekst: 'Gaming, parfum, sieraden, LEGO en spullen voor de kamer: cadeaus die tieners echt leuk vinden.',
    subs: [
      s('gaming-gadgets', 'Gaming & gadgets', 'tieners-gaming-w', ['elektronica'], 'Gaming en gadgets cadeau voor tieners', 'Headsets, koptelefoons, speakers, powerbanks en alles voor de gamer.'),
      s('geuren-verzorging', 'Geuren & skincare', 'mode-beauty-geuren', ['geuren-verzorging'], 'Parfum en skincare cadeau voor tieners', 'Parfum, bodymist en skincare: de cadeaus waar tieners nu om vragen.'),
      s('sieraden', 'Sieraden', 'sieraden-verguld-staal', ['sieraden'], 'Sieraden cadeau voor tieners', 'Armbandjes, kettingen, ringen en oorbellen in de stijl van nu.'),
      s('lego-creatief', 'LEGO & creatief', 'speelgoed-bouwen', ['speelgoed/lego', 'speelgoed/knikkerbanen-magnetisch', 'hobby'], 'LEGO en creatief cadeau voor tieners', 'LEGO Technic, Speed Champions, Botanicals en creatieve sets voor oudere kinderen.'),
      s('spellen-puzzels', 'Spellen & puzzels', 'speelgoed-kaartspellen', ['speelgoed/bord-kaartspellen', 'speelgoed/puzzels', 'speelgoed/pokemon-verzamelkaarten'], 'Spellen en puzzels voor tieners', 'Partyspellen, kaartspellen, Pokémon en 3D-puzzels.'),
      s('kamer', 'Kamer & sfeer', 'wonen-verlichting', ['wonen', 'elektronica/sfeerlicht-smarthome'], 'Cadeau voor de tienerkamer', 'Lampen, ledstrips, plaids en kussens om de kamer te pimpen.'),
      s('sport-darts', 'Sport & darts', 'sport-outdoor-darts', ['sport-outdoor'], 'Sportcadeau voor tieners', 'Darts, voetbal, fitness en sportspullen.'),
      s('mode', 'Mode & accessoires', 'mode-beauty-rugzakken-reistassen', ['mode-beauty'], 'Mode cadeau voor tieners', 'Rugzakken, sneakers, hoodies en accessoires.'),
      s('boeken-journals', 'Boeken & journals', 'boeken-media-agendas', ['boeken-media'], 'Boeken en journals voor tieners', 'Spannende boeken, manga, bullet journals en notitieboeken.'),
      s('lekkers', 'Lekkers & bakken', 'eten-drinken-chocolade-snoep', ['eten-drinken', 'keuken/bakken'], 'Lekkers en bakspullen cadeau voor tieners', 'Chocolade, snoep, snacks en bakspullen.'),
      s('metaaldetectie', 'Metaaldetectie', 'metaaldetectie-kinderen-beginners', ['metaaldetectie'], 'Metaaldetector cadeau voor tieners', 'Een eerste detector om buiten op zoek te gaan naar schatten.')
    ] },
  { slug: 'opa-oma', naam: 'Opa & oma', kort: 'Opa & oma', labels: ['opa-oma'], oud: 'cadeaus/opa-oma', beeld: B('cadeaus-opa-oma-2026b'), vaag: B('cadeaus-opa-oma-2026b'),
    seoTitel: 'Cadeau voor opa en oma – lieve en praktische cadeaus', tekst: 'Puzzels, foto’s, iets voor in de tuin of iets warms: cadeaus voor opa en oma.',
    subs: [
      s('puzzels-spellen', 'Puzzels & spellen', 'speelgoed-puzzels', SPELLEN, 'Puzzels en spellen voor opa en oma', 'Legpuzzels, puzzelboeken en spellen voor gezellige middagen, ook met de kleinkinderen.'),
      s('fotos-herinneringen', 'Foto’s & herinneringen', 'cadeaus-met-naam-2026b', ['wonen/fotolijsten', 'boeken-media/foto-invulboeken', 'cadeaus/met-naam'], 'Foto- en herinneringscadeau voor opa en oma', 'Fotolijsten, invulboeken als "Opa, vertel eens" en cadeaus met de namen van de kleinkinderen.'),
      s('tuin-vogels', 'Tuin & vogels', 'dieren-vogels', ['tuin-klussen'], 'Tuin- en vogelcadeau voor opa en oma', 'Vogelhuisjes, voederplekken en tuinspullen voor wie graag buiten is.'),
      s('warm-comfortabel', 'Warm & comfortabel', 'wonen-plaids-kussens', ['tag:warm', 'wonen/kussens-plaids', 'mode-beauty/pantoffels-sokken'], 'Warm en comfortabel cadeau voor opa en oma', 'Plaids, warmtekussens en pantoffels voor koude dagen.'),
      s('radio-muziek', 'Radio & muziek', 'elektronica-audio', ['elektronica/speakers', 'elektronica/platenspelers', 'boeken-media/muziek'], 'Radio en muziek voor opa en oma', 'Radio’s, speakers, platenspelers en muziek die makkelijk werkt.'),
      s('koffie-thee', 'Koffie & thee', 'keuken-koffie-thee', ['keuken/koffie-thee', 'eten-drinken/koffie-thee'], 'Koffie- en theecadeau voor opa en oma', 'Mooie kopjes, goede koffie en thee voor het dagelijkse moment.'),
      s('wonen-klokken', 'Wonen & klokken', 'wonen-woonaccessoires', ['wonen'], 'Woon- en klokcadeau voor opa en oma', 'Klokken, kaarsen en decoratie voor een warm huis.'),
      s('keuken', 'Keuken', 'keuken-serveren', ['keuken'], 'Keukencadeau voor opa en oma', 'Mooie keukenspullen en servies.'),
      s('boeken', 'Boeken', 'boeken-media-lezen', ['boeken-media'], 'Boeken cadeau voor opa en oma', 'Romans, puzzelboeken en boeken om bij weg te dromen.'),
      s('lekkers-drank', 'Lekkers & drank', 'eten-drinken-lekkernijen', ['eten-drinken', 'dranken'], 'Lekkers en drank voor opa en oma', 'Chocolade, koekjes, een goede fles wijn of likeur.')
    ] },
  { slug: 'collega', naam: "Collega's", kort: "Collega's", labels: ['collega'], oud: 'cadeaus/collega', beeld: B('cadeaus-collega-2026b'), vaag: B('cadeaus-collega-2026b'),
    seoTitel: 'Cadeau voor collega – leuke en betaalbare cadeaus', tekst: 'Voor een afscheid, een bedankje of de lootjes: cadeaus voor collega’s.',
    subs: [
      s('afscheid-pensioen', 'Afscheid & pensioen', 'cadeaus-collega-2026b', ['tag:collega-afscheid'], 'Afscheidscadeau en pensioencadeau voor een collega', 'Een cadeau om te onthouden: voor een collega die vertrekt of met pensioen gaat.'),
      s('bedankje', 'Bedankje', 'eten-drinken-pakketten', ['tag:collega-bedankje'], 'Bedankje voor een collega', 'Een klein gebaar dat groot aankomt: iets lekkers, een plantje of een kaars.'),
      s('lootjes', 'Lootjes & kleinigheidjes', 'cadeaus-onder-10-2026b', ['tag:collega-lootjes'], 'Lootjescadeau voor een collega – tot €25', 'Voor de lootjes of zomaar: leuke cadeautjes tot €10, €15 of €25. Kies hieronder je budget.')
    ] },
  { slug: 'baby', naam: 'Baby & kraam', kort: 'Baby & kraam', labels: ['baby'], oud: 'cadeaus/baby-kraam', beeld: B('cadeaus-baby-kraam-2026b'), vaag: B('cadeaus-baby-kraam-2026b'),
    seoTitel: 'Kraamcadeau – cadeaus voor baby en ouders', tekst: 'Kraamcadeaus, zachte kleertjes, knuffels met naam en iets voor de babyshower.',
    subs: [
      s('kraamcadeaus', 'Kraamcadeaus & pakketten', 'cadeaus-baby-kraam-2026b', ['tag:baby-kraampakketten'], 'Kraamcadeau en kraampakket', 'Mooie kraampakketten en cadeaus om op kraamvisite mee te nemen.'),
      s('kleding-dekentjes', 'Babykleding & dekentjes', 'mode-beauty-kleding', ['tag:baby-kleding'], 'Babykleding en dekentjes cadeau', 'Zachte rompertjes, slabbetjes, mutsjes en dekentjes.'),
      s('speelkleden-rammelaars', 'Speelkleden & rammelaars', 'speelgoed-baby-peuter', ['tag:baby-speelgoed'], 'Speelkleed en rammelaar cadeau', 'Speelkleden, rammelaars, bijtringen en eerste speelgoed.'),
      s('knuffels-met-naam', 'Knuffels met naam', 'cadeaus-met-naam-2026b', ['tag:baby-knuffels-naam'], 'Knuffel met naam als kraamcadeau', 'Een knuffel of knuffeldoekje met de naam van de baby erop.'),
      s('babyshower', 'Babyshower', 'cadeaus-baby-kraam-2026b', ['tag:baby-babyshower'], 'Babyshower cadeau', 'Cadeaus voor de aanstaande moeder en de babyshower.')
    ] }
  ];
})();
/* De 8 populairste productgroepen op de homepage (telefoon); de rest zit achter 'Alle categorieën'. */
window.LK_HOME_GROEPEN = ['sieraden', 'geuren-verzorging', 'mode-beauty', 'elektronica', 'wonen', 'dranken', 'eten-drinken', 'speelgoed'];
window.LK_PERSOON = function (slug) { return (window.LK_PERSONEN || []).find(function (p) { return p.slug === slug; }); };

/* ===== 2.0 PROEF: de 15 productgroepen met de nieuwe namen (afgesproken met Marius en Nova). =====
   Oude adressen blijven werken: we hernoemen alleen en verwijzen subcategorieën door ('vak'). */
(function () {
  var C = window.LK_CATEGORIEEN, cat = function (slug) { return C.find(function (c) { return c.slug === slug; }); };
  var hernoem = function (slug, naam, kort) { var c = cat(slug); if (c) { c.naam = naam; c.kort = kort || naam; } };
  /* Cadeaus en Liefde & Valentijn zijn geen productgroepen meer: personen en gelegenheden. De pagina's blijven bestaan. */
  cat('cadeaus').verborgen = true; cat('valentijn').verborgen = true;
  /* Sieraden & Horloges: horloges erbij (staan in mode-beauty/horloges, dat blijft het adres). */
  hernoem('sieraden', 'Sieraden & Horloges');
  var si = cat('sieraden'); si.vakken = ['mode-beauty/horloges']; si.tekst = 'Kettingen, oorbellen, ringen, armbanden en horloges. Van betaalbaar tot echt goud.';
  si.subs.forEach(function (x) { if (x.slug === 'heren') x.naam = 'Herensieraden'; });
  si.subs.unshift({ slug: 'horloges', naam: 'Horloges', beeld: 'images/sub/sub-mode-beauty-horloges.webp', vak: 'mode-beauty/horloges' });
  /* Geuren & Verzorging: eigen groep. */
  var mb = cat('mode-beauty');
  C.splice(C.indexOf(mb), 0, { slug: 'geuren-verzorging', naam: 'Geuren & Verzorging', kort: 'Geuren & Verzorging', icoon: 'tas',
    tekst: 'Parfum, aftershave en verzorging om cadeau te geven.', tegel: 'images/categorieen/categorie-geuren-verzorging.webp', vakken: ['mode-beauty/geuren', 'mode-beauty/verzorging'],
    subs: [{ slug: 'geuren', naam: 'Geuren', beeld: 'images/sub/sub-mode-beauty-geuren.webp', vak: 'mode-beauty/geuren' }, { slug: 'verzorging', naam: 'Verzorging', beeld: 'images/sub/sub-mode-beauty-verzorging.webp', vak: 'mode-beauty/verzorging' }] });
  /* Mode & Accessoires: wat overblijft van Mode & Beauty. Horloges, geuren en verzorging blijven bereikbaar, maar staan niet meer in het rijtje. */
  hernoem('mode-beauty', 'Mode & Accessoires'); mb.tekst = 'Tassen, schoenen, kleding en accessoires.'; mb.tegel = 'images/categorieen/categorie-mode-accessoires.webp';
  mb.subs.forEach(function (s) { if (['horloges', 'geuren', 'verzorging'].indexOf(s.slug) !== -1) s.verborgen = true; });
  hernoem('elektronica', 'Elektronica & Gadgets');
  hernoem('wonen', 'Wonen & Decoratie');
  hernoem('keuken', 'Keuken & Tafelen');
  hernoem('eten-drinken', 'Lekkernijen & Cadeaupakketten', 'Lekkernijen');
  hernoem('sport-outdoor', 'Sport & Outdoor');
  /* Metaaldetectie wordt een eigen groep (stond onder Sport). */
  delete cat('metaaldetectie').onder;
  /* Volgorde van de 15 groepen, Christelijke cadeaus als eigen afdeling erachter. */
  var volgorde = ['sieraden', 'geuren-verzorging', 'mode-beauty', 'elektronica', 'wonen', 'keuken', 'dranken', 'eten-drinken', 'speelgoed', 'hobby', 'sport-outdoor', 'tuin-klussen', 'boeken-media', 'dieren', 'metaaldetectie', 'christelijk', 'cadeaus', 'valentijn'];
  C.sort(function (a, b) { return volgorde.indexOf(a.slug) - volgorde.indexOf(b.slug); });
})();
/* ===== 2.1 NIEUWE INDELING (vakje voor vakje goedgekeurd door Marius, 30-10-2026) =====
   Vakjes staan in de volgorde waarin mensen ernaar zoeken (zoekvolume), niet op hoeveel producten we hebben.
   Welk product in welk vakje komt, regelt scripts/indeling.js (bij het bouwen). Lege vakjes worden pas zichtbaar als er iets in staat.
   Oude adressen blijven werken: een oud vakje verwijst door naar het nieuwe ('vak'). */
(function () {
  var C = window.LK_CATEGORIEEN, cat = function (slug) { return C.find(function (c) { return c.slug === slug; }); };
  var B = function (n) { return 'images/sub/sub-' + n + '.webp'; };
  /* vakjes(groep, [[slug, naam, beeld?], ...], {oudSlug: nieuwSlug}) */
  function vakjes(slug, lijst, oud, extra) {
    var c = cat(slug); if (!c) return;
    var bestaand = {}; (c.subs || []).forEach(function (s) { bestaand[s.slug] = s; });
    var nieuw = lijst.map(function (v) {
      var s = Object.assign({}, bestaand[v[0]] || {}, { slug: v[0], naam: v[1] });
      delete s.verborgen; delete s.vak; delete s.naar;
      if (v[2]) s.beeld = B(v[2]); else if (!bestaand[v[0]]) delete s.beeld;
      return s;
    });
    Object.keys(oud || {}).forEach(function (o) {
      if (!nieuw.some(function (s) { return s.slug === o; })) nieuw.push({ slug: o, naam: (bestaand[o] || {}).naam || o, verborgen: true, vak: slug + '/' + oud[o] });
    });
    (extra || []).forEach(function (s) { nieuw.push(s); });
    c.subs = nieuw;
    delete c.vakken;
  }

  vakjes('sieraden', [
    ['ringen', 'Ringen', 'sieraden-ringen'], ['smartwatches', 'Smartwatches', 'sieraden-smartwatches-w'], ['horloges', 'Horloges', 'mode-beauty-horloges'],
    ['echt-goud', 'Echt goud', 'sieraden-echt-goud'], ['oorbellen', 'Oorbellen', 'sieraden-oorbellen'], ['kettingen', 'Kettingen & hangers', 'sieraden-kettingen'],
    ['zilver', 'Zilver', 'sieraden-zilver'], ['armbanden', 'Armbanden & enkelbandjes', 'sieraden-armbanden'], ['sieradendozen', 'Sieradendozen', 'sieraden-sieradendozen-w'],
    ['parels', 'Parels', 'sieraden-parels-w'], ['bedels', 'Bedels & bedelarmbanden', 'sieraden-bedels-w'], ['met-naam', 'Met naam & letter', 'cadeaus-met-naam-2026b']
  ], { heren: 'armbanden', viking: 'kettingen', 'verguld-staal': 'kettingen' });
  cat('sieraden').knoppen = ['wie3', 'kind-als'];

  vakjes('geuren-verzorging', [
    ['rituals', 'Rituals', 'geuren-verzorging-rituals-w'], ['parfum', 'Parfum', 'mode-beauty-geuren'], ['scheren-baard', 'Scheren & baard', 'geuren-verzorging-scheren-baard-w'], ['haarstylers', 'Haarstylers', 'geuren-verzorging-haarstylers-w'],
    ['make-up-nagels', 'Make-up & nagels', 'geuren-verzorging-make-up-nagels-w'], ['huidverzorging', 'Huidverzorging', 'mode-beauty-verzorging'], ['cadeausets', 'Cadeausets', 'geuren-verzorging-cadeausets-w'],
    ['bad-douche', 'Bad & douche', 'geuren-verzorging-bad-douche-w'], ['massage', 'Massage', 'geuren-verzorging-massage-w'], ['tandenborstels', 'Elektrische tandenborstels', 'geuren-verzorging-tandenborstels-w']
  ], { geuren: 'parfum', verzorging: 'huidverzorging' });
  cat('geuren-verzorging').knoppen = ['wie2'];

  vakjes('mode-beauty', [
    ['schoenen', 'Schoenen, sneakers & boots', 'mode-beauty-schoenen-2026b'], ['truien-hoodies', 'Truien & hoodies', 'mode-beauty-kleding'],
    ['pyjamas', "Pyjama's, badjassen & onesies", 'mode-beauty-pyjamas-w'], ['koffers', 'Koffers & reistassen', 'mode-beauty-koffers-w'], ['tassen', 'Tassen', 'mode-beauty-tassen'],
    ['mutsen-sjaals', 'Mutsen, sjaals & handschoenen', 'mode-beauty-mutsen-sjaals-w'], ['portemonnees', 'Portemonnees & pasjeshouders', 'mode-beauty-portemonnees-w'], ['pantoffels-sokken', 'Pantoffels & sokken', 'mode-beauty-pantoffels-sokken-w'],
    ['zonnebrillen', 'Zonnebrillen', 'mode-beauty-zonnebrillen-w'], ['rugzakken', 'Rugzakken', 'mode-beauty-rugzakken-reistassen'], ['riemen-sleutelhangers', "Riemen, sleutelhangers & paraplu's", 'mode-beauty-accessoires'],
    ['toilettassen', 'Toilettassen', 'mode-beauty-toilettassen-w']
  ], { horloges: 'horloges', geuren: 'tassen', verzorging: 'tassen', 'rugzakken-reistassen': 'rugzakken', kleding: 'truien-hoodies', accessoires: 'riemen-sleutelhangers' });
  /* Horloges, geuren en verzorging staan nu in hun eigen groep: oude adressen sturen daarheen. */
  cat('mode-beauty').subs.forEach(function (s) {
    if (s.slug === 'horloges') { s.vak = 'sieraden/horloges'; s.naar = '/c/sieraden/horloges'; }
    if (s.slug === 'geuren') { s.vak = 'geuren-verzorging/parfum'; s.naar = '/c/geuren-verzorging/parfum'; }
    if (s.slug === 'verzorging') { s.vak = 'geuren-verzorging/huidverzorging'; s.naar = '/c/geuren-verzorging/huidverzorging'; }
  });
  cat('mode-beauty').knoppen = ['wie3'];

  vakjes('elektronica', [
    ['gaming', 'Gaming', 'elektronica-gaming'], ['telefoon-opladen', 'Telefoon & opladen', 'elektronica-telefoon'], ['cameras', "Camera's", 'elektronica-foto-video'],
    ['koptelefoons', 'Koptelefoons & oordopjes', 'elektronica-audio'], ['tablets-ereaders', 'Tablets & e-readers', 'elektronica-tablets-ereaders-w'], ['drones-vr', 'Drones & VR', 'elektronica-drones-vr-w'],
    ['platenspelers', 'Platenspelers', 'elektronica-platenspelers-w'], ['gadgets-trackers', 'Gadgets & trackers', 'elektronica-slimme-gadgets'], ['speakers', 'Speakers', 'elektronica-speakers-w'],
    ['beamers', 'Beamers', 'elektronica-beamers-w'], ['sfeerlicht-smarthome', 'Sfeerlicht & smart home', 'elektronica-sfeerlicht-w']
  ], { audio: 'speakers', 'slimme-gadgets': 'gadgets-trackers', telefoon: 'telefoon-opladen', 'foto-video': 'cameras' });

  vakjes('wonen', [
    ['lampen', 'Lampen', 'wonen-verlichting'], ['vloerkleden', 'Vloerkleden', 'wonen-vloerkleden'], ['wanddecoratie', 'Wanddecoratie & posters', 'wonen-woonaccessoires'], ['klokken', 'Klokken', 'wonen-klokken-w'],
    ['kerst', 'Kerst', 'wonen-kerstdecoratie'], ['vazen-bloemen', 'Vazen & bloemen', 'wonen-vazen-bloemen-w'], ['kussens-plaids', 'Kussens & plaids', 'wonen-plaids-kussens'],
    ['kaarsen', 'Kaarsen & kandelaars', 'wonen-kaarsen-geur'], ['spiegels', 'Spiegels', 'wonen-spiegels'], ['opbergen-dienbladen', 'Opbergen & dienbladen', 'wonen-opbergen-dienbladen'],
    ['fotolijsten', 'Fotolijsten', 'wonen-fotolijsten'], ['huisgeuren', 'Huisgeuren', 'wonen-huisgeuren'], ['deurmatten', 'Deurmatten', 'wonen-deurmatten']
  ], { 'kaarsen-geur': 'kaarsen', woonaccessoires: 'wanddecoratie', verlichting: 'lampen', 'plaids-kussens': 'kussens-plaids', kerstdecoratie: 'kerst' });

  vakjes('keuken', [
    ['keukenapparaten', 'Keukenapparaten', 'keuken-keukenapparaten'], ['airfryers', 'Airfryers', 'keuken-airfryers'], ['koffie-thee', 'Koffie & thee', 'keuken-koffie-thee'],
    ['gezellig-tafelen', 'Gezellig tafelen', 'keuken-gezellig-tafelen'], ['pannen', 'Pannen', 'keuken-koken'], ['tosti-wafel-ijs', 'Tosti-, wafel- & ijsmachines', 'keuken-tosti-wafel-ijs'],
    ['glazen-servies', 'Glazen & servies', 'keuken-serveren'], ['drinkflessen-lunch', 'Drinkflessen & lunch', 'keuken-drinkflessen-lunch'], ['messen-snijplanken', 'Messen & snijplanken', 'keuken-messen-snijplanken'],
    ['bakken', 'Bakken', 'keuken-bakken'], ['kaas-serveerplanken', 'Kaas- & serveerplanken', 'keuken-kaas-serveerplanken'], ['voorraadpotten', 'Voorraadpotten', 'keuken-opbergen']
  ], { koken: 'pannen', serveren: 'glazen-servies', opbergen: 'voorraadpotten' });

  vakjes('dranken', [
    ['champagne-bubbels', 'Champagne & bubbels', 'dranken-bubbels'], ['gin-cocktails', 'Gin & cocktails', 'dranken-gin'], ['wijn-port', 'Wijn & port', 'dranken-wijn'],
    ['likeuren', 'Likeuren', 'dranken-likeur'], ['bier', 'Bier & speciaalbier', 'dranken-bier'], ['wijnaccessoires', 'Wijnaccessoires', 'dranken-wijnaccessoires'],
    ['tequila', 'Tequila & mezcal', 'dranken-tequila'], ['alcoholvrij', 'Alcoholvrij', 'dranken-alcoholvrij'], ['whisky', 'Whisky', 'dranken-whisky-2026b'],
    ['cognac', 'Cognac', 'dranken-cognac-brandy'], ['jenever', 'Jenever', 'dranken-jenever'], ['sake', 'Sake', 'dranken-sake'], ['rum', 'Rum', 'dranken-rum'], ['wodka', 'Wodka', 'dranken-wodka']
  ], { 'cognac-brandy': 'cognac', gin: 'gin-cocktails', likeur: 'likeuren', wijn: 'wijn-port', bubbels: 'champagne-bubbels' });

  vakjes('eten-drinken', [
    ['chocolade', 'Chocolade & bonbons', 'eten-drinken-chocolade-snoep'], ['koekjes-stroopwafels', 'Koekjes & stroopwafels', 'eten-drinken-koekjes-stroopwafels'], ['delicatessen', 'Delicatessen', 'eten-drinken-lekkernijen'],
    ['drop-snoep', 'Drop & snoep', 'eten-drinken-drop-snoep'], ['sinterklaas-lekkers', 'Sinterklaas-lekkers', 'cadeaus-sinterklaas'], ['adventskalenders', 'Adventskalenders', 'cadeaus-adventskalenders-2026b'],
    ['kerst-cadeaupakketten', 'Kerst- & cadeaupakketten', 'eten-drinken-pakketten'], ['koffie-thee', 'Koffie & thee', 'eten-drinken-koffie-thee'],
    ['brievenbuscadeaus', 'Brievenbuscadeaus', 'eten-drinken-brievenbuscadeaus'], ['bbq-sauzen', 'BBQ & sauzen', 'eten-drinken-bbq']
  ], { 'chocolade-snoep': 'chocolade', bbq: 'bbq-sauzen', pakketten: 'kerst-cadeaupakketten', lekkernijen: 'delicatessen' });
  /* Sinterklaas-lekkers alleen tot en met 5 december. */
  cat('eten-drinken').subs.forEach(function (s) { if (s.slug === 'sinterklaas-lekkers') s.tot = '12-05'; });

  vakjes('speelgoed', [
    ['lego', 'LEGO', 'speelgoed-bouwen'], ['buitenspeelgoed', 'Buitenspeelgoed', 'speelgoed-buitenspeelgoed'], ['bord-kaartspellen', 'Bord- & kaartspellen', 'speelgoed-bordspellen'],
    ['pokemon-verzamelkaarten', 'Pokémon & verzamelkaarten', 'speelgoed-pokemon-verzamelkaarten-w'], ['puzzels', 'Puzzels', 'speelgoed-puzzels'], ['poppen-barbie', 'Poppen & Barbie', 'speelgoed-poppen-barbie'],
    ['playmobil', 'Playmobil', 'speelgoed-playmobil-w'], ['autos-treinen-rc', "Auto's, treinen & RC", 'speelgoed-figuren-voertuigen'], ['knuffels-squishmallows', 'Knuffels & Squishmallows', 'speelgoed-knuffels-squishmallows'],
    ['knikkerbanen-magnetisch', 'Knikkerbanen & magnetisch bouwen', 'speelgoed-knikkerbanen-magnetisch'], ['knutselen-kleuren', 'Knutselen & kleuren', 'speelgoed-knutselen'], ['hypes-trends', 'Hypes & trends', 'speelgoed-hypes-trends'],
    ['baby-houten', 'Baby- & houten speelgoed', 'speelgoed-baby-peuter'], ['speelkeukens-verkleden', 'Speelkeukens & verkleden', 'speelgoed-speelkeukens-verkleden'], ['muziek-karaoke', 'Muziek & karaoke', 'speelgoed-muziek-karaoke']
  ], { 'baby-peuter': 'baby-houten', bouwen: 'lego', 'figuren-voertuigen': 'autos-treinen-rc', bordspellen: 'bord-kaartspellen', kaartspellen: 'bord-kaartspellen', knutselen: 'knutselen-kleuren' });
  cat('speelgoed').knoppen = ['kind', 'leeftijd'];

  vakjes('hobby', [
    ['tekenen', 'Tekenen & stiften', 'hobby-tekenen-schilderen'], ['schilderen', 'Schilderen', 'hobby-schilderen'], ['diamond-painting', 'Diamond painting', 'hobby-diamond-painting'], ['naaien-borduren', 'Naaien & borduren', 'hobby-naaien-borduren'],
    ['kralen-sieraden-maken', 'Kralen & sieraden maken', 'hobby-kralen-sieraden-maken'], ['modelbouw', 'Modelbouw & miniatuurhuisjes', 'hobby-modelbouw'], ['origami-scrapbooking', 'Origami & scrapbooking', 'hobby-knutselen'],
    ['kaarsen-zeep-epoxy', 'Kaarsen, zeep & epoxy', 'hobby-kaarsen-zeep-epoxy'], ['haken-breien', 'Haken & breien', 'hobby-haken-breien'], ['klei-pottenbakken', 'Klei & pottenbakken', 'hobby-klei-pottenbakken'],
    ['3d-pennen', '3D-pennen', 'hobby-3d-pennen'], ['bullet-journal', 'Bullet journal & kalligrafie', 'hobby-bullet-journal']
  ], { 'tekenen-schilderen': 'tekenen', knutselen: 'origami-scrapbooking' });

  vakjes('sport-outdoor', [
    ['voetbal-balsporten', 'Voetbal & balsporten', 'sport-outdoor-voetbal-balsporten'], ['darts', 'Darts', 'sport-outdoor-darts'], ['fietsen', 'Fietsen', 'sport-outdoor-fietsen'], ['padel-tennis', 'Padel & tennis', 'sport-outdoor-padel-tennis'],
    ['wintersport-schaatsen', 'Wintersport & schaatsen', 'sport-outdoor-wintersport-schaatsen'], ['fitness', 'Fitness & thuis sporten', 'sport-outdoor-fitness'], ['kamperen', 'Kamperen', 'sport-outdoor-kamperen'],
    ['wandelen', 'Wandelen', 'sport-outdoor-wandelen'], ['hardlopen', 'Hardlopen', 'sport-outdoor-hardlopen'], ['golf', 'Golf', 'sport-outdoor-golf-2026b'], ['reizen', 'Reizen', 'sport-outdoor-reizen'],
    ['watersport-zwemmen', 'Watersport & zwemmen', 'sport-outdoor-watersport-zwemmen'], ['klimmen-boulderen', 'Klimmen & boulderen', 'sport-outdoor-klimmen-boulderen'], ['skateboards-steps', 'Skateboards & steps', 'sport-outdoor-skateboards-steps'],
    ['yoga', 'Yoga', 'sport-outdoor-yoga'], ['buitenspellen-picknick', 'Buitenspellen & picknick', 'sport-outdoor-buitenspellen-picknick'], ['vissen', 'Vissen', 'sport-outdoor-vissen']
  ], {}, [{ slug: 'metaaldetectie', naam: 'Metaaldetectie', verborgen: true, naar: '/c/metaaldetectie' }]);

  vakjes('tuin-klussen', [
    ['zwembaden-jacuzzis', "Zwembaden & jacuzzi's", 'tuin-klussen-zwembaden-jacuzzis'], ['tuinmeubelen', 'Tuinmeubelen & parasols', 'tuin-klussen-tuinmeubelen'], ['elektrisch-gereedschap', 'Elektrisch gereedschap', 'tuin-klussen-gereedschap'],
    ['bbq-buitenkoken', 'BBQ & buiten koken', 'tuin-klussen-bbq-buitenkoken-w'], ['tuinmachines', 'Tuinmachines', 'tuin-klussen-tuinmachines'], ['handgereedschap-werkplaats', 'Handgereedschap & werkplaats', 'tuin-klussen-handgereedschap-werkplaats'],
    ['planten-potten', 'Planten & potten', 'tuin-klussen-planten-zaden'], ['regentonnen-slangen-compost', 'Regentonnen, slangen & compost', 'tuin-klussen-regentonnen-slangen-compost'], ['vogels-insecten', 'Vogels & insecten', 'dieren-vogels'],
    ['moestuin-kweken', 'Moestuin & kweken', 'tuin-klussen-moestuin-kweken-w'], ['buitenverlichting', 'Buitenverlichting', 'tuin-klussen-buitenverlichting'], ['tuingereedschap', 'Tuingereedschap', 'tuin-klussen-tuingereedschap'],
    ['vuurschalen-terrasverwarmers', 'Vuurschalen & terrasverwarmers', 'tuin-klussen-vuurschalen-terrasverwarmers-w'], ['tuindecoratie', 'Tuindecoratie', 'tuin-klussen-tuindecoratie-w']
  ], { 'planten-zaden': 'planten-potten', gereedschap: 'elektrisch-gereedschap' });

  vakjes('boeken-media', [
    ['puzzelboeken', 'Puzzelboeken', 'boeken-media-puzzelboeken-w'], ['agendas-planners-kalenders', "Agenda's, planners & kalenders", 'boeken-media-agendas'], ['e-readers', 'E-readers', 'boeken-media-e-readers-w'],
    ['muziek', "Muziek: lp's & cd's", 'boeken-media-muziek'], ['films-series', 'Films & series', 'boeken-media-films-series'], ['kinderboeken', 'Kinderboeken', 'boeken-media-kinderboeken'],
    ['thrillers-romans', 'Thrillers & romans', 'boeken-media-romans'], ['strips-manga', 'Strips & manga', 'boeken-media-strips-manga-w'], ['leesplezier', 'Leesplezier', 'boeken-media-lezen'],
    ['luisterboeken', 'Luisterboeken', 'boeken-media-luisterboeken-w'], ['kleurboeken', 'Kleurboeken', 'boeken-media-kleurboeken-w'], ['foto-invulboeken', 'Foto- & invulboeken', 'boeken-media-foto-invulboeken-w'], ['boekenbonnen-abonnementen', 'Boekenbonnen & abonnementen', 'boeken-media-boekenbonnen-abonnementen-w'],
    ['kookboeken', 'Kookboeken', 'boeken-media-kookboeken']
  ], { romans: 'thrillers-romans', agendas: 'agendas-planners-kalenders', lezen: 'leesplezier' });

  vakjes('dieren', [
    ['paard', 'Paard', 'dieren-paard-w'], ['hond', 'Hond', 'dieren-hond'], ['konijn-cavia-hamster', 'Konijn, cavia & hamster', 'dieren-konijn-cavia-hamster-w'], ['kat', 'Kat', 'dieren-kat'],
    ['vissen-aquarium', 'Vissen & aquarium', 'dieren-vissen-aquarium-w'], ['reptielen-terrarium', 'Reptielen & terrarium', 'dieren-reptielen-terrarium-w'], ['kippen', 'Kippen', 'dieren-kippen-w'], ['vogels', 'Vogels', 'dieren-vogels-w']
  ], { 'klein-dier': 'konijn-cavia-hamster' });

  vakjes('metaaldetectie', [
    ['munten-vondsten', 'Munten & vondsten bewaren', 'metaaldetectie-vondsten'], ['detectors', 'Metaaldetectors', 'metaaldetectie-detectors'],
    ['magneetvissen', 'Magneetvissen', 'metaaldetectie-magneetvissen'], ['pinpointers-uitrusting', 'Pinpointers & uitrusting', 'metaaldetectie-pinpointers']
  ], { 'kinderen-beginners': 'detectors', pinpointers: 'pinpointers-uitrusting', graven: 'pinpointers-uitrusting', accessoires: 'pinpointers-uitrusting', vondsten: 'munten-vondsten' });
  cat('metaaldetectie').subs.forEach(function (s) { if (s.slug === 'detectors') s.knoppen = ['niveau']; });

  vakjes('christelijk', [
    ['bijbels', 'Bijbels', 'christelijk-bijbels-2026b'], ['psalmboeken', 'Psalmboeken', 'christelijk-psalmboeken-w'], ['kerststal-engelen', 'Kerststal & engelen', 'christelijk-kerststal-engelen'],
    ['sieraden', 'Kruisjes & sieraden', 'christelijk-sieraden'], ['kerst', 'Christelijke kerst', 'christelijk-kerst-2026b'],
    ['bijbelteksten-wanddecoratie', 'Bijbelteksten & wanddecoratie', 'christelijk-wanddecoratie'], ['boeken-muziek', 'Boeken & muziek', 'christelijk-boeken-muziek'],
    ['doop-belijdenis', 'Doop & belijdenis', 'christelijk-doop-belijdenis'], ['voor-kinderen', 'Voor kinderen', 'christelijk-voor-kinderen']
  ], { 'kaarten-posters': 'bijbelteksten-wanddecoratie', wanddecoratie: 'bijbelteksten-wanddecoratie' },
  [{ slug: 'bijbeltekst', naam: 'Met Bijbeltekst', verborgen: true, vak: 'christelijk/bijbelteksten-wanddecoratie' }, { slug: 'onder-25', naam: 'Onder €25', verborgen: true }]);
})();

/* Knoppen (filters bovenaan een pagina). Elke optie zegt welk product erbij hoort. */
window.LK_KNOPSETS = {
  wie3: { param: 'wie', titel: 'Voor wie', opties: [['dames', 'Dames', { labels: ['haar'] }], ['heren', 'Heren', { labels: ['hem'] }], ['kinderen', 'Kinderen', { labels: ['kind', 'kinderen', 'baby'] }]] },
  wie2: { param: 'wie', titel: 'Voor wie', opties: [['dames', 'Dames', { labels: ['haar'] }], ['heren', 'Heren', { labels: ['hem'] }]] },
  kind: { param: 'kind', titel: 'Jongen of meisje', opties: [['jongen', 'Jongen', { nietTag: 'meisje' }], ['meisje', 'Meisje', { nietTag: 'jongen' }], ['allebei', 'Allebei', { geenTags: ['jongen', 'meisje'] }]] },
  /* Bij sieraden alleen als 'Kinderen' gekozen is. */
  'kind-als': { als: ['wie', 'kinderen'], param: 'kind', titel: 'Jongen of meisje', opties: [['jongen', 'Jongen', { nietTag: 'meisje' }], ['meisje', 'Meisje', { nietTag: 'jongen' }]] },
  leeftijd: { param: 'leeftijd', titel: 'Leeftijd', opties: [['0-2', '0-2 jaar', { leeftijd: [0, 2] }], ['3-5', '3-5 jaar', { leeftijd: [3, 5] }], ['6-8', '6-8 jaar', { leeftijd: [6, 8] }], ['9-12', '9-12 jaar', { leeftijd: [9, 12] }]] },
  niveau: { param: 'niveau', titel: 'Niveau', opties: [['beginner', 'Beginner', { tag: 'niveau-beginner' }], ['gevorderd', 'Gevorderd', { tag: 'niveau-gevorderd' }], ['kinderen', 'Kinderen', { tag: 'niveau-kinderen' }]] },
  jaar: { param: 'jaar', titel: 'Hoe oud wordt hij of zij?', opties: [['18', '18 jaar', { tag: 'jaar-18' }], ['30', '30 jaar', { tag: 'jaar-30' }], ['40', '40 jaar', { tag: 'jaar-40' }], ['50', '50 (Abraham/Sarah)', { tag: 'jaar-50' }], ['60', '60 jaar', { tag: 'jaar-60' }], ['65', '65 jaar', { tag: 'jaar-65' }]] }
};
window.LK_KNOPTEST = function (p, regel) {
  var tags = p.tags || [];
  if (regel.labels) return (p.voor || []).some(function (v) { return regel.labels.indexOf(v) !== -1; });
  if (regel.tag) return tags.indexOf(regel.tag) !== -1;
  if (regel.nietTag) return tags.indexOf(regel.nietTag) === -1;
  if (regel.geenTags) return !regel.geenTags.some(function (t) { return tags.indexOf(t) !== -1; });
  if (regel.leeftijd) return !!p.leeftijd && p.leeftijd[0] <= regel.leeftijd[1] && p.leeftijd[1] >= regel.leeftijd[0];
  return true;
};
/* ===== 2.0 PROEF: Gelegenheden. Samengestelde pagina's: wie (labels) + welke vakken + evt. maximale prijs.
   Bestaat er al een pagina (Sinterklaas, Kerst, …), dan verwijst 'naar' daarheen. */
var LK_GEEN_FEEST = /kerst|sinterklaas|advent|\bpiet\b|pakjesavond|halloween|pasen|paas/i; /* seizoensproducten horen niet op Moederdag, Vaderdag, enz. */
var LK_ALLE_GROEPEN = ['sieraden', 'geuren-verzorging', 'mode-beauty', 'elektronica', 'wonen', 'keuken', 'dranken', 'eten-drinken', 'speelgoed', 'hobby', 'sport-outdoor', 'tuin-klussen', 'boeken-media', 'dieren', 'metaaldetectie', 'cadeaus', 'valentijn'];
/* Volgorde (afgesproken 30-10-2026): het feest dat eraan komt staat bovenaan (seizoen: van–tot, MM-DD), de rest in de volgorde van zoeken. */
window.LK_GELEGENHEDEN = [
  { slug: 'moederdag', seizoen: ['04-10', '05-12'], uit: LK_GEEN_FEEST, naam: 'Moederdag', beeld: 'images/sub/sub-cadeaus-voor-haar-2026b.webp', seoTitel: 'Moederdagcadeau – de mooiste cadeaus voor Moederdag',
    tekst: 'Iets moois voor mama: sieraden, geuren, iets lekkers of iets met haar naam erop.',
    labels: ['haar'], vakken: ['sieraden', 'geuren-verzorging', 'wonen/kaarsen', 'wonen/huisgeuren', 'wonen/wanddecoratie', 'wonen/kussens-plaids', 'wonen/vazen-bloemen', 'keuken/koffie-thee', 'keuken/glazen-servies', 'dranken/champagne-bubbels', 'dranken/wijn-port', 'eten-drinken/chocolade', 'eten-drinken/delicatessen', 'eten-drinken/koffie-thee', 'cadeaus/met-naam', 'boeken-media/thrillers-romans', 'hobby'] },
  { slug: 'vaderdag', seizoen: ['05-20', '06-21'], uit: LK_GEEN_FEEST, naam: 'Vaderdag', beeld: 'images/sub/sub-cadeaus-voor-hem-2026b.webp', seoTitel: 'Vaderdagcadeau – de leukste cadeaus voor Vaderdag',
    tekst: 'Voor papa: een goede fles, iets voor de BBQ, een gadget of een horloge.',
    labels: ['hem'], vakken: ['dranken', 'eten-drinken/bbq-sauzen', 'tuin-klussen', 'elektronica', 'sieraden/horloges', 'geuren-verzorging', 'metaaldetectie', 'sport-outdoor', 'cadeaus/met-naam', 'tag:zakmes'] },
  { slug: 'kerst', seizoen: ['11-01', '12-26'], naam: 'Kerst', naar: '/c/cadeaus/kerst', beeld: 'images/sub/sub-cadeaus-kerst-2026b.webp' },
  { slug: 'geboorte', naam: 'Geboorte & kraam', naar: '/voor/baby', beeld: 'images/sub/sub-cadeaus-baby-kraam-2026b.webp' },
  { slug: 'valentijn', seizoen: ['01-15', '02-14'], naam: 'Liefde & Valentijn', naar: '/c/valentijn', beeld: 'images/sub/sub-valentijn-voor-haar.webp' },
  { slug: 'verjaardag', uit: LK_GEEN_FEEST, naam: 'Verjaardag', beeld: 'images/sub/sub-eten-drinken-pakketten.webp', seoTitel: 'Verjaardagscadeau – cadeau voor 18, 30, 40, 50 of 60 jaar',
    tekst: 'Een cadeau voor een verjaardag. Kies hieronder hoe oud hij of zij wordt, of bekijk alles.',
    knoppen: ['jaar'], vakken: LK_ALLE_GROEPEN.concat(['tag:verjaardag']) },
  { slug: 'jubileum', uit: /kerst|sinterklaas|advent|\bpiet\b|pakjesavond|halloween|pasen|paas|kraam|baby|voorraad|kat\b|kilo|rakkers/i, naam: 'Trouwen & jubileum', beeld: 'images/sub/sub-valentijn-samen.webp', seoTitel: 'Trouwcadeau, huwelijkscadeau en jubileumcadeau',
    tekst: 'Een bruiloft, een trouwdag of een jubileum: iets persoonlijks, iets om te proosten of iets blijvends.',
    vakken: ['tag:trouwen', 'valentijn/samen', 'valentijn/met-naam', 'dranken/champagne-bubbels', 'sieraden/echt-goud', 'wonen/fotolijsten'] /* 31-10-2026: glazen & servies eruit */ },
  { slug: 'housewarming', uit: /kerst|sinterklaas|advent|\bpiet\b|pakjesavond|halloween|pasen|paas|hulst|maretak|pumpkin|minecraft|kinder|baby/i, naam: 'Housewarming', beeld: 'images/sub/sub-wonen-woonaccessoires.webp', seoTitel: 'Housewarming cadeau – cadeau voor een nieuwe woning',
    tekst: 'Iemand gaat verhuizen of heeft een nieuw huis: iets moois voor in huis, een plant of iets om te proosten.',
    vakken: ['tag:housewarming', 'wonen/vazen-bloemen', 'wonen/kaarsen', 'wonen/huisgeuren', 'wonen/deurmatten', 'wonen/fotolijsten', 'keuken/kaas-serveerplanken', 'dranken/champagne-bubbels'], maxPrijs: 75 /* 31-10-2026 strenger */ },
  { slug: 'sinterklaas', seizoen: ['10-15', '12-05'], naam: 'Sinterklaas', naar: '/c/cadeaus/sinterklaas', beeld: 'images/sub/sub-cadeaus-sinterklaas.webp' },
  { slug: 'bedankt', uit: /kerst|sinterklaas|advent|\bpiet\b|pakjesavond|halloween|pasen|paas|kilo|silo|\d{2,3} stuks|mix \(/i, naam: 'Bedankt', beeld: 'images/sub/sub-eten-drinken-pakketten.webp', seoTitel: 'Bedankje – kleine cadeaus om dankjewel te zeggen',
    tekst: 'Een klein gebaar dat groot aankomt: iets lekkers, een kaars, een plantje of een goede fles.', maxPrijs: 25,
    vakken: ['tag:juf-meester', 'eten-drinken/brievenbuscadeaus', 'eten-drinken/chocolade'] /* 31-10-2026 strenger */ },
  { slug: 'juf-meester', seizoen: ['06-10', '07-20'], uit: LK_GEEN_FEEST, naam: 'Juf & meester', beeld: 'images/sub/sub-boeken-media-agendas.webp', seoTitel: 'Cadeau voor de juf of meester – bedankje einde schooljaar',
    tekst: 'Dankjewel zeggen aan de juf of meester: aan het einde van het schooljaar of zomaar.', maxPrijs: 25,
    vakken: ['tag:juf-meester'] }, /* 31-10-2026: alleen kleine bedankjes (zie indeling.js) */
  { slug: 'uitdeelcadeautjes', naam: 'Uitdeelcadeautjes', beeld: 'images/sub/sub-eten-drinken-drop-snoep.webp', seoTitel: 'Uitdeelcadeautjes – voor een kinderfeestje of de klas',
    tekst: 'Kleine cadeautjes om uit te delen: voor een kinderfeestje, de klas of in een feestzakje.', maxPrijs: 10,
    labels: ['kind', 'kinderen', 'tiener'], vakken: ['tag:uitdelen', 'speelgoed/hypes-trends', 'speelgoed/knutselen-kleuren', 'speelgoed/pokemon-verzamelkaarten', 'speelgoed/bord-kaartspellen', 'eten-drinken/drop-snoep'] },
  { slug: 'beterschap', uit: /kerst|sinterklaas|advent|\bpiet\b|pakjesavond|halloween|pasen|paas|baby|truffel|kilo|silo/i, naam: 'Beterschap & sterkte', beeld: 'images/sub/sub-wonen-plaids-kussens.webp', seoTitel: 'Beterschapscadeau en sterkte cadeau',
    tekst: 'Voor iemand die ziek is of het moeilijk heeft: iets om op te vrolijken of even te troosten.', maxPrijs: 40,
    vakken: ['tag:beterschap', 'eten-drinken/brievenbuscadeaus', 'eten-drinken/chocolade', 'geuren-verzorging/bad-douche', 'boeken-media/puzzelboeken', 'mode-beauty/pantoffels-sokken', 'wonen/kussens-plaids'] /* 31-10-2026 strenger */ },
  { slug: 'geslaagd', seizoen: ['06-01', '07-15'], uit: /kerst|sinterklaas|advent|\bpiet\b|pakjesavond|halloween|pasen|paas|kinder|fortnite|baby|magnum/i, naam: 'Geslaagd & rijbewijs', beeld: 'images/sub/sub-mode-beauty-rugzakken-reistassen.webp', seoTitel: 'Geslaagd cadeau – cadeau voor je diploma of rijbewijs',
    tekst: 'Geslaagd voor het examen of het rijbewijs gehaald: een cadeau om het te vieren.',
    vakken: ['tag:geslaagd', 'mode-beauty/rugzakken', 'mode-beauty/koffers', 'mode-beauty/portemonnees', 'sieraden/horloges', 'dranken/champagne-bubbels', 'elektronica/koptelefoons', 'elektronica/speakers', 'elektronica/telefoon-opladen'], maxPrijs: 150 /* 31-10-2026 strenger */ },
  { slug: 'afscheid-pensioen', uit: LK_GEEN_FEEST, naam: 'Afscheid & pensioen', beeld: 'images/sub/sub-cadeaus-collega-2026b.webp', seoTitel: 'Afscheidscadeau en pensioencadeau',
    tekst: 'Een mooi afscheid van een collega, of een cadeau voor wie met pensioen gaat.', gids: 'afscheidscadeau-collega',
    vakken: ['tag:afscheid', 'tag:collega-afscheid'] }, /* 31-10-2026: alleen echte afscheids- en pensioencadeaus (was: alles voor collega/opa-oma) */
  { slug: 'doop-belijdenis', naam: 'Doop & belijdenis', naar: '/c/christelijk/doop-belijdenis', beeld: 'images/sub/sub-christelijk-doop-belijdenis.webp' }
];
/* Gelegenheden in de juiste volgorde voor vandaag: wat nu speelt eerst. */
window.LK_GELEGENHEDEN_NU = function () {
  var d = new Date(), nu = ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
  var speelt = function (g) { if (!g.seizoen) return false; var a = g.seizoen[0], b = g.seizoen[1]; return a <= b ? nu >= a && nu <= b : nu >= a || nu <= b; };
  var l = window.LK_GELEGENHEDEN;
  return l.filter(speelt).sort(function (a, b) { return a.seizoen[1].localeCompare(b.seizoen[1]); }).concat(l.filter(function (g) { return !speelt(g); }));
};
/* Collecties: dwars door alle groepen heen, in de volgorde van zoeken. */
window.LK_COLLECTIES = [
  { slug: 'cadeaubonnen', naam: 'Cadeaubonnen', kicker: 'Altijd goed', beeld: 'images/sub/sub-cadeaus-onder-10-2026b.webp', seoTitel: 'Cadeaubon en cadeaukaart – laat ze zelf kiezen',
    tekst: 'Twijfel je? Met een cadeaubon of cadeaukaart kiezen ze zelf.', vakken: ['tag:cadeaubon', 'boeken-media/boekenbonnen-abonnementen'] },
  { slug: 'persoonlijke-cadeaus', naam: 'Persoonlijke cadeaus', kicker: 'Met naam of eigen tekst', beeld: 'images/sub/sub-cadeaus-met-naam-2026b.webp', seoTitel: 'Persoonlijke cadeaus met naam – gepersonaliseerde cadeaus',
    tekst: 'Een cadeau met een naam, datum, foto of eigen tekst erop. Altijd uniek.',
    vakken: ['cadeaus/met-naam', 'valentijn/met-naam', 'sieraden/met-naam'] },
  { slug: 'brievenbuscadeaus', naam: 'Brievenbuscadeaus', kicker: 'Past door de bus', beeld: 'images/sub/sub-eten-drinken-chocolade-snoep.webp', seoTitel: 'Brievenbuscadeau – cadeaus die door de brievenbus passen',
    tekst: 'Een verrassing die gewoon door de brievenbus past. Handig om op te sturen.', vakken: ['tag:brievenbus', 'eten-drinken/brievenbuscadeaus'] },
  { slug: 'kleine-cadeautjes', naam: 'Kleine cadeautjes', kicker: 'Klein maar fijn', beeld: 'images/sub/sub-cadeaus-sint-onder-15-2026b.webp', seoTitel: 'Kleine cadeautjes – leuke cadeaus tot €10, €25 of €50',
    tekst: 'Leuke kleine cadeautjes voor weinig geld. Kies hieronder je budget.', maxPrijs: 50, uit: LK_GEEN_FEEST, vakken: LK_ALLE_GROEPEN },
  { slug: 'originele-cadeaus', naam: 'Originele cadeaus', kicker: 'Net even anders', beeld: 'images/sub/sub-elektronica-slimme-gadgets.webp', seoTitel: 'Originele cadeaus – unieke en bijzondere cadeau-ideeën',
    tekst: 'Bijzondere, verrassende cadeaus die niet iedereen al heeft.', uit: LK_GEEN_FEEST, vakken: ['tag:origineel', 'cadeaus/grappig'] },
  { slug: 'cadeaupakketten', naam: 'Cadeaupakketten & verwenpakketten', kicker: 'Mooi verpakt', beeld: 'images/sub/sub-eten-drinken-pakketten.webp', seoTitel: 'Cadeaupakket en verwenpakket – mooi verpakte cadeaus',
    tekst: 'Lekkere pakketten, wellness- en verwensets: mooi verpakt en klaar om te geven.', vakken: ['tag:pakket', 'eten-drinken/kerst-cadeaupakketten', 'geuren-verzorging/cadeausets'] },
  { slug: 'grappige-cadeaus', naam: 'Grappige cadeaus', kicker: 'Om om te lachen', beeld: 'images/producten/cg-toilet-basketball.webp', seoTitel: 'Grappige cadeaus – leuke en gekke cadeaus om te lachen',
    tekst: 'Gekke, handige en flauwe cadeaus waar iedereen om moet lachen. Voor feestjes, collega’s en vrienden.',
    zoek: 'grappig grappige gek gekke humor lol lachen fun flauw',
    vakken: ['cadeaus/grappig'] },
  { slug: 'belevenissen', naam: 'Belevenissen', kicker: 'Samen iets doen', beeld: 'images/sub/sub-valentijn-romantische-avond.webp', seoTitel: 'Belevenis cadeau – een uitje of ervaring cadeau geven',
    tekst: 'Geef een herinnering: een uitje, workshop of overnachting.', vakken: ['tag:belevenis'] }
];
window.LK_GELEGENHEID = function (slug) { return (window.LK_GELEGENHEDEN || []).find(function (g) { return g.slug === slug; }); };
window.LK_COLLECTIE = function (slug) { return (window.LK_COLLECTIES || []).find(function (g) { return g.slug === slug; }); };
