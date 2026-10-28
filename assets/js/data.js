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
  heroDesktop: 'images/banners/banner-home-desktop.webp',
  heroMobiel: 'images/banners/banner-home-mobiel.webp',
  populair: [
    { label: 'Kerst', naar: '/c/cadeaus/kerst' },
    { label: 'Sinterklaas', naar: '/c/cadeaus/sinterklaas' },
    { label: 'Dranken', naar: '/c/dranken' },
    { label: 'Voor haar', naar: '/c/cadeaus/voor-haar' },
    { label: 'Voor hem', naar: '/c/cadeaus/voor-hem' },
    { label: 'Collega', naar: '/c/cadeaus/collega' },
    { label: 'Christelijk', naar: '/c/christelijk' },
    { label: 'Onder €15', naar: '/c/cadeaus/onder-15' },
    { label: 'Adventskalenders', naar: '/c/cadeaus/adventskalenders' }
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
      { slug: 'met-naam', naam: 'Met naam', beeld: 'images/sub/sub-cadeaus-met-naam-2026b.webp' }
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
    { id: 'haar', label: 'Haar' }, { id: 'hem', label: 'Hem' }, { id: 'kind', label: 'Een kind' },
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
window.LK_PERSONEN = [
  { slug: 'hem', naam: 'Voor hem', kort: 'Voor hem', labels: ['hem'], oud: 'cadeaus/voor-hem',
    beeld: 'images/sub/sub-cadeaus-voor-hem-2026b.webp', vaag: 'images/sub/sub-cadeaus-voor-hem-2026b.webp',
    seoTitel: 'Cadeau voor hem – de mooiste cadeaus voor mannen', tekst: 'Van een goed horloge tot een fles whisky: met de hand gekozen cadeaus voor hem.',
    subs: [
      { slug: 'horloges', naam: 'Horloges', beeld: 'images/sub/sub-mode-beauty-horloges.webp', vakken: ['mode-beauty/horloges'] },
      { slug: 'geuren', naam: 'Geuren', beeld: 'images/sub/sub-mode-beauty-geuren.webp', vakken: ['mode-beauty/geuren'] },
      { slug: 'verzorging', naam: 'Verzorging', beeld: 'images/sub/sub-mode-beauty-verzorging.webp', vakken: ['mode-beauty/verzorging'] },
      { slug: 'sieraden', naam: 'Sieraden', beeld: 'images/sub/sub-sieraden-heren.webp', vakken: ['sieraden'] },
      { slug: 'drank', naam: 'Drank', beeld: 'images/sub/sub-dranken-whisky-2026b.webp', vakken: ['dranken'] },
      { slug: 'gadgets-gaming', naam: 'Gadgets & gaming', beeld: 'images/sub/sub-elektronica-gaming.webp', vakken: ['elektronica'] },
      { slug: 'sport-outdoor', naam: 'Sport & Outdoor', beeld: 'images/categorieen/categorie-sport-outdoor.webp', vakken: ['sport-outdoor'] },
      { slug: 'klussen-bbq', naam: 'Klussen & BBQ', beeld: 'images/sub/sub-tuin-klussen-gereedschap.webp', vakken: ['tuin-klussen', 'eten-drinken/bbq'] },
      { slug: 'lego-hobby', naam: 'LEGO & hobby', beeld: 'images/sub/sub-speelgoed-bouwen.webp', vakken: ['speelgoed/bouwen', 'hobby'] },
      { slug: 'metaaldetectie', naam: 'Metaaldetectie', beeld: 'images/categorieen/categorie-metaaldetectie.webp', vakken: ['metaaldetectie'] },
      { slug: 'mode-accessoires', naam: 'Mode & Accessoires', beeld: 'images/sub/sub-mode-beauty-tassen.webp', vakken: ['mode-beauty/tassen', 'mode-beauty/rugzakken-reistassen', 'mode-beauty/schoenen', 'mode-beauty/kleding', 'mode-beauty/accessoires'] }
    ] },
  { slug: 'haar', naam: 'Voor haar', kort: 'Voor haar', labels: ['haar'], oud: 'cadeaus/voor-haar', beeld: 'images/sub/sub-cadeaus-voor-haar-2026b.webp', vaag: 'images/sub/sub-cadeaus-voor-haar-2026b.webp',
    seoTitel: 'Cadeau voor haar – de mooiste cadeaus voor vrouwen', tekst: 'Sieraden, geuren, iets moois voor in huis: met de hand gekozen cadeaus voor haar.',
    subs: [
      { slug: 'sieraden', naam: 'Sieraden', beeld: 'images/sub/sub-sieraden-kettingen.webp', vakken: ['sieraden'] },
      { slug: 'horloges', naam: 'Horloges', beeld: 'images/sub/sub-mode-beauty-horloges.webp', vakken: ['mode-beauty/horloges'] },
      { slug: 'geuren', naam: 'Geuren', beeld: 'images/sub/sub-mode-beauty-geuren.webp', vakken: ['mode-beauty/geuren'] },
      { slug: 'verzorging', naam: 'Verzorging', beeld: 'images/sub/sub-mode-beauty-verzorging.webp', vakken: ['mode-beauty/verzorging'] },
      { slug: 'tassen-mode', naam: 'Tassen & mode', beeld: 'images/sub/sub-mode-beauty-tassen.webp', vakken: ['mode-beauty/tassen', 'mode-beauty/rugzakken-reistassen', 'mode-beauty/schoenen', 'mode-beauty/kleding', 'mode-beauty/accessoires'] },
      { slug: 'wonen-sfeer', naam: 'Wonen & sfeer', beeld: 'images/sub/sub-wonen-kaarsen-geur.webp', vakken: ['wonen'] },
      { slug: 'keuken-koffie', naam: 'Keuken & koffie', beeld: 'images/sub/sub-keuken-koffie-thee.webp', vakken: ['keuken'] },
      { slug: 'wijn-bubbels', naam: 'Wijn & bubbels', beeld: 'images/sub/sub-dranken-bubbels.webp', vakken: ['dranken'] },
      { slug: 'lekkers', naam: 'Lekkers', beeld: 'images/sub/sub-eten-drinken-chocolade-snoep.webp', vakken: ['eten-drinken'] },
      { slug: 'creatief', naam: 'Hobby & creatief', beeld: 'images/sub/sub-hobby-haken-breien.webp', vakken: ['hobby', 'speelgoed/bouwen'] },
      { slug: 'boeken', naam: 'Boeken', beeld: 'images/sub/sub-boeken-media-romans.webp', vakken: ['boeken-media'] },
      { slug: 'met-naam', naam: 'Met naam', beeld: 'images/sub/sub-cadeaus-met-naam-2026b.webp', vakken: ['cadeaus/met-naam'] },
      { slug: 'sport-outdoor', naam: 'Sport & Outdoor', beeld: 'images/sub/sub-sport-outdoor-fitness.webp', vakken: ['sport-outdoor'] }
    ] },
  { slug: 'kinderen', naam: 'Voor kinderen', kort: 'Kinderen', labels: ['kind', 'kinderen'], oud: 'cadeaus/voor-kinderen', beeld: 'images/sub/sub-cadeaus-voor-kinderen-2026b.webp', vaag: 'images/sub/sub-cadeaus-voor-kinderen-2026b.webp',
    seoTitel: 'Cadeau voor kinderen – speelgoed en leuke cadeaus', tekst: 'Speelgoed, boeken en knutselspullen: cadeaus waar kinderen blij van worden.',
    subs: [
      { slug: 'baby-peuter', naam: 'Baby & peuter', beeld: 'images/sub/sub-speelgoed-baby-peuter.webp', vakken: ['speelgoed/baby-peuter'] },
      { slug: 'bouwen', naam: 'Bouwen & LEGO', beeld: 'images/sub/sub-speelgoed-bouwen.webp', vakken: ['speelgoed/bouwen'] },
      { slug: 'knutselen', naam: 'Knutselen & creatief', beeld: 'images/sub/sub-speelgoed-knutselen.webp', vakken: ['speelgoed/knutselen', 'hobby'] },
      { slug: 'buiten', naam: 'Buitenspeelgoed', beeld: 'images/sub/sub-speelgoed-buitenspeelgoed.webp', vakken: ['speelgoed/buitenspeelgoed'] },
      { slug: 'figuren', naam: 'Figuren & voertuigen', beeld: 'images/sub/sub-speelgoed-figuren-voertuigen.webp', vakken: ['speelgoed/figuren-voertuigen'] },
      { slug: 'spellen', naam: 'Spellen & puzzels', beeld: 'images/sub/sub-speelgoed-bordspellen.webp', vakken: ['speelgoed/bordspellen', 'speelgoed/kaartspellen', 'speelgoed/puzzels'] },
      { slug: 'boeken', naam: 'Kinderboeken', beeld: 'images/sub/sub-boeken-media-kinderboeken.webp', vakken: ['boeken-media'] },
      { slug: 'gaming', naam: 'Gaming & gadgets', beeld: 'images/sub/sub-elektronica-gaming.webp', vakken: ['elektronica'] },
      { slug: 'kinderkamer', naam: 'Kinderkamer', beeld: 'images/sub/sub-wonen-verlichting.webp', vakken: ['wonen'] },
      { slug: 'metaaldetectie', naam: 'Metaaldetectie', beeld: 'images/sub/sub-metaaldetectie-kinderen-beginners.webp', vakken: ['metaaldetectie'] },
      { slug: 'sinterklaas', naam: 'Sinterklaas', beeld: 'images/sub/sub-cadeaus-sinterklaas.webp', vakken: ['cadeaus/sinterklaas'] }
    ] },
  { slug: 'tieners', naam: 'Voor tieners', kort: 'Tieners', labels: ['tiener'], beeld: 'images/sub/sub-elektronica-gaming.webp', vaag: 'images/sub/sub-elektronica-gaming.webp',
    seoTitel: 'Cadeau voor tieners – cadeaus voor 12 tot 18 jaar', tekst: 'Gaming, sieraden, geuren en meer: cadeaus die tieners echt leuk vinden.',
    subs: [
      { slug: 'gaming', naam: 'Gaming & gadgets', beeld: 'images/sub/sub-elektronica-gaming.webp', vakken: ['elektronica'] },
      { slug: 'sieraden', naam: 'Sieraden', beeld: 'images/sub/sub-sieraden-verguld-staal.webp', vakken: ['sieraden'] },
      { slug: 'geuren-verzorging', naam: 'Geuren & verzorging', beeld: 'images/sub/sub-mode-beauty-geuren.webp', vakken: ['mode-beauty/geuren', 'mode-beauty/verzorging'] },
      { slug: 'mode', naam: 'Mode & accessoires', beeld: 'images/sub/sub-mode-beauty-rugzakken-reistassen.webp', vakken: ['mode-beauty'] },
      { slug: 'sport', naam: 'Sport & Outdoor', beeld: 'images/sub/sub-sport-outdoor-fitness.webp', vakken: ['sport-outdoor'] },
      { slug: 'creatief', naam: 'Creatief & bouwen', beeld: 'images/sub/sub-speelgoed-bouwen.webp', vakken: ['speelgoed/bouwen', 'hobby'] },
      { slug: 'boeken', naam: 'Boeken', beeld: 'images/sub/sub-boeken-media-lezen.webp', vakken: ['boeken-media'] },
      { slug: 'metaaldetectie', naam: 'Metaaldetectie', beeld: 'images/sub/sub-metaaldetectie-detectors.webp', vakken: ['metaaldetectie'] }
    ] },
  { slug: 'opa-oma', naam: 'Opa & oma', kort: 'Opa & oma', labels: ['opa-oma'], oud: 'cadeaus/opa-oma', beeld: 'images/sub/sub-cadeaus-opa-oma-2026b.webp', vaag: 'images/sub/sub-cadeaus-opa-oma-2026b.webp',
    seoTitel: 'Cadeau voor opa en oma – lieve en praktische cadeaus', tekst: 'Iets voor in de tuin, bij de koffie of gewoon gezellig: cadeaus voor opa en oma.',
    subs: [
      { slug: 'tuin-vogels', naam: 'Tuin & vogels', beeld: 'images/sub/sub-dieren-vogels.webp', vakken: ['dieren/vogels', 'tuin-klussen'] },
      { slug: 'koffie-thee', naam: 'Koffie & thee', beeld: 'images/sub/sub-keuken-koffie-thee.webp', vakken: ['keuken/koffie-thee', 'eten-drinken/koffie-thee'] },
      { slug: 'wonen-sfeer', naam: 'Wonen & sfeer', beeld: 'images/sub/sub-wonen-plaids-kussens.webp', vakken: ['wonen'] },
      { slug: 'puzzels-spellen', naam: 'Puzzels & spellen', beeld: 'images/sub/sub-speelgoed-puzzels.webp', vakken: ['speelgoed/puzzels', 'speelgoed/bordspellen', 'speelgoed/kaartspellen'] },
      { slug: 'lekkers-drank', naam: 'Lekkers & drank', beeld: 'images/sub/sub-eten-drinken-lekkernijen.webp', vakken: ['eten-drinken', 'dranken'] },
      { slug: 'audio-gadgets', naam: 'Audio & gadgets', beeld: 'images/sub/sub-elektronica-audio.webp', vakken: ['elektronica'] },
      { slug: 'boeken', naam: 'Boeken', beeld: 'images/sub/sub-boeken-media-lezen.webp', vakken: ['boeken-media'] },
      { slug: 'keuken', naam: 'Keuken', beeld: 'images/sub/sub-keuken-serveren.webp', vakken: ['keuken'] },
      { slug: 'sieraden', naam: 'Sieraden', beeld: 'images/sub/sub-sieraden-kettingen.webp', vakken: ['sieraden'] },
      { slug: 'met-naam', naam: 'Met naam', beeld: 'images/sub/sub-cadeaus-met-naam-2026b.webp', vakken: ['cadeaus/met-naam'] }
    ] },
  { slug: 'collega', naam: "Collega's", kort: "Collega's", labels: ['collega'], oud: 'cadeaus/collega', beeld: 'images/sub/sub-cadeaus-collega-2026b.webp', vaag: 'images/sub/sub-cadeaus-collega-2026b.webp',
    seoTitel: 'Cadeau voor collega – leuke en betaalbare cadeaus', tekst: 'Voor een afscheid, een bedankje of gewoon zomaar: cadeaus voor collega’s.',
    subs: [
      { slug: 'koffie-thee', naam: 'Koffie & thee', beeld: 'images/sub/sub-keuken-koffie-thee.webp', vakken: ['keuken/koffie-thee', 'eten-drinken/koffie-thee'] },
      { slug: 'lekkers', naam: 'Lekkers & pakketten', beeld: 'images/sub/sub-eten-drinken-pakketten.webp', vakken: ['eten-drinken'] },
      { slug: 'bureau', naam: 'Bureau & agenda', beeld: 'images/sub/sub-boeken-media-agendas.webp', vakken: ['boeken-media'] },
      { slug: 'planten', naam: 'Planten', beeld: 'images/sub/sub-tuin-klussen-planten-zaden.webp', vakken: ['tuin-klussen'] },
      { slug: 'wonen-sfeer', naam: 'Wonen & sfeer', beeld: 'images/sub/sub-wonen-woonaccessoires.webp', vakken: ['wonen'] },
      { slug: 'gadgets', naam: 'Gadgets', beeld: 'images/sub/sub-elektronica-slimme-gadgets.webp', vakken: ['elektronica'] },
      { slug: 'spelletjes', naam: 'Spelletjes', beeld: 'images/sub/sub-speelgoed-kaartspellen.webp', vakken: ['speelgoed'] },
      { slug: 'drank', naam: 'Drank', beeld: 'images/sub/sub-dranken-wijn.webp', vakken: ['dranken'] },
      { slug: 'verzorging', naam: 'Verzorging', beeld: 'images/sub/sub-mode-beauty-verzorging.webp', vakken: ['mode-beauty/verzorging'] }
    ] },
  { slug: 'baby', naam: 'Baby & kraam', kort: 'Baby & kraam', labels: ['baby'], oud: 'cadeaus/baby-kraam', beeld: 'images/sub/sub-cadeaus-baby-kraam-2026b.webp', vaag: 'images/sub/sub-cadeaus-baby-kraam-2026b.webp',
    seoTitel: 'Kraamcadeau – cadeaus voor baby en ouders', tekst: 'Zacht speelgoed, iets met naam en lieve spulletjes voor de babykamer.',
    subs: [
      { slug: 'speelgoed', naam: 'Babyspeelgoed', beeld: 'images/sub/sub-speelgoed-baby-peuter.webp', vakken: ['speelgoed'] },
      { slug: 'met-naam', naam: 'Met naam', beeld: 'images/sub/sub-cadeaus-met-naam-2026b.webp', vakken: ['cadeaus/met-naam'] },
      { slug: 'babykamer', naam: 'Babykamer', beeld: 'images/sub/sub-wonen-verlichting.webp', vakken: ['wonen'] },
      { slug: 'sieraden', naam: 'Sieraden', beeld: 'images/sub/sub-sieraden-zilver.webp', vakken: ['sieraden'] },
      { slug: 'kleding', naam: 'Kleding & schoentjes', beeld: 'images/sub/sub-mode-beauty-schoenen-2026b.webp', vakken: ['mode-beauty'] }
    ] },
];
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
  si.subs.unshift({ slug: 'horloges', naam: 'Horloges', beeld: 'images/sub/sub-mode-beauty-horloges.webp', vak: 'mode-beauty/horloges' });
  /* Geuren & Verzorging: eigen groep. */
  var mb = cat('mode-beauty');
  C.splice(C.indexOf(mb), 0, { slug: 'geuren-verzorging', naam: 'Geuren & Verzorging', kort: 'Geuren & Verzorging', icoon: 'tas',
    tekst: 'Parfum, aftershave en verzorging om cadeau te geven.', tegel: 'images/categorieen/categorie-geuren-verzorging.webp', vakken: ['mode-beauty/geuren', 'mode-beauty/verzorging'],
    subs: [{ slug: 'geuren', naam: 'Geuren', beeld: 'images/sub/sub-mode-beauty-geuren.webp', vak: 'mode-beauty/geuren' }, { slug: 'verzorging', naam: 'Verzorging', beeld: 'images/sub/sub-mode-beauty-verzorging.webp', vak: 'mode-beauty/verzorging' }] });
  /* Mode & Accessoires: wat overblijft van Mode & Beauty. Horloges, geuren en verzorging blijven bereikbaar, maar staan niet meer in het rijtje. */
  hernoem('mode-beauty', 'Mode & Accessoires'); mb.tekst = 'Tassen, schoenen, kleding en accessoires.';
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
/* Gelegenheden in het menu (alleen wat al bestaat; Moederdag, Vaderdag, enz. volgen). */
window.LK_GELEGENHEDEN = [
  { naam: 'Sinterklaas', naar: '/c/cadeaus/sinterklaas' }, { naam: 'Kerst', naar: '/c/cadeaus/kerst' }, { naam: 'Adventskalenders', naar: '/c/cadeaus/adventskalenders' },
  { naam: 'Liefde & Valentijn', naar: '/c/valentijn' }, { naam: 'Geboorte & kraam', naar: '/c/cadeaus/baby-kraam' }, { naam: 'Afscheid & pensioen', naar: '/gids/cadeau-voor-pensioen' },
  { naam: 'Bedankt', naar: '/gids/cadeau-voor-collega' }, { naam: 'Doop & belijdenis', naar: '/c/christelijk/doop-belijdenis' }
];
