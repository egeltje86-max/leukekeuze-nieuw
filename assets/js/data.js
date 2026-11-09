/* =========================================================
   LeukeKeuze – categorieën, subcategorieën en instellingen
   Hier pas je de indeling van de site aan.
   ========================================================= */

window.LK_INSTELLINGEN = {
  /* Daisycon heeft de site tijdelijk afgekeurd: hun links sturen bezoekers dan naar een vreemde site.
     Zolang dit 'true' is, gaan alle knoppen rechtstreeks naar de winkel (zonder partnerlink). 'Meer in onze winkels' toont wel ALLE winkels (wens Marius 28-10-2026), ook met directe links.
     Weer goedgekeurd? Zet dit op false. */
  daisyconPauze: false,       // 04-11-2026: Daisycon heeft de media goedgekeurd (Marius)
  /* Daisycon-campagnes waar we (nog) niet op zijn ingeschreven: hun link stuurt naar een vreemde site (rakutenadvertising.com).
     Die gaan rechtstreeks naar de winkel, tot de campagne weer goedgekeurd is. Getest 04-11-2026. Haal een nummer weg als hij weer werkt.
     15138 Dr. Martens, 18488 LEGO, 17294 Westwing, 15574 Teufel, 15048 Timberland, 15679 Zadig & Voltaire, 15224 (?), 20868 AllSaints, 13299 Razer */
  daisyconZonder: [],
  seizoen: 'kerst',            // 'kerst' of '' (neutraal)
  /* Stap 1 homepage (6-11-2026, GO Marius): één intro met twee knoppen (Help mij kiezen = VONK, Lekker rondkijken = favorieten). */
  heroKicker: 'Uitgezocht door ons',
  heroTitel: 'Een mooi cadeau vinden,',
  heroTitelGoud: 'zonder eindeloos zoeken',
  heroTekst: 'Bij 82 bekende winkels. Jij kiest, de winkel levert.',
  heroDesktop: 'images/banners/banner-home-desktop.webp',
  /* Banner met het LeukeKeuze-logo erin: dan staat de tekst niet over de foto heen maar eronder. */
  heroLogo: false,
  heroMobiel: 'images/banners/banner-home-mobiel.webp',
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
    { kicker: 'Elke dag nieuwe deals', titel: 'Aanbiedingen van vandaag', tekst: 'De grootste kortingen van al onze winkels.', knop: 'Bekijk de aanbiedingen', naar: '/collectie/aanbiedingen', beeld: 'images/collecties/aanbiedingen.webp', beeldMobiel: 'images/collecties/aanbiedingen-mobiel.webp', vanaf: '2026-12-01', tot: '2027-12-31', klasse: 'actie-breed' },
    { kicker: 'Black Friday · 27 november', titel: 'Black Friday deals', tekst: 'De grootste kortingen van al onze winkels, tot 70%.', knop: 'Bekijk de deals', naar: '/collectie/black-friday', beeld: 'images/collecties/black-friday.webp', beeldMobiel: 'images/collecties/black-friday-mobiel.webp', tot: '2026-11-30', klasse: 'actie-breed' },
    { kicker: 'Hits van dit najaar', titel: 'Toppers van nu', tekst: 'Waar iedereen het nu over heeft.', knop: 'Bekijk de toppers', naar: '/collectie/toppers-van-nu', beeld: 'images/collecties/toppers-van-nu.webp', beeldMobiel: 'images/collecties/toppers-van-nu-mobiel.webp', tot: '2027-01-31', klasse: 'actie-breed' },
    { kicker: 'Pakjesavond 5 december', titel: 'Sinterklaas', tekst: 'Leuke surprises en cadeautjes voor in de zak.', knop: 'Bekijk Sinterklaas', naar: '/c/cadeaus/sinterklaas', beeld: 'images/sub/sub-cadeaus-sinterklaas.webp', tot: '2026-12-05' },
    { kicker: 'Kerst komt eraan', titel: 'Kerstcadeaus', tekst: 'Mooie cadeaus voor onder de boom.', knop: 'Bekijk kerstcadeaus', naar: '/c/cadeaus/kerst', beeld: 'images/sub/sub-cadeaus-kerst-2026b.webp', tot: '2026-12-25' },
    { kicker: 'Proost op de feestdagen', titel: 'Whisky, champagne & meer', tekst: 'Topflessen om te geven of samen te openen.', knop: 'Naar de dranken', naar: '/c/dranken', beeld: 'images/categorieen/categorie-dranken.webp', tot: '2027-01-01' }
  ],
  /* Onze favorieten (stap 1 homepage, 6-11-2026, keuze Marius): zes handgekozen cadeaus vlak onder 'Voor wie'.
     Regels: goede foto, €40-€115, voor haar én hem, verschillende winkels, geen speelgoed. We noemen het 'favorieten', niet 'bestsellers': dat kunnen we nog niet bewijzen. */
  favorieten: { kicker: 'Uitgezocht door ons', titel: 'Onze favorieten van dit moment', tekst: 'Zes cadeaus die we nu zelf zouden geven.', knop: 'Meer cadeaus', naar: '/c/cadeaus',
    /* Zes stuks, zoals het plan (deel 7). Gekozen uit de 12 van Marius (6-11-2026, kieskaart): populair + mooie foto, voor haar en voor hem, €40-140.
       Marshall Emberton II was uitverkocht -> Emberton III; Instax en Ticket to Ride staan op de site als samengevoegd product (cl-...).
       Reserve, zelfde ronde: bol-9300000179581364 (Swarovski), bol-9300000237950295 (Michael Kors), dc-1141534911 (Hibiki), bol-9300000271848241 (schaakbord), cl-ttr-europe, dvzn-647292 (rendier).
       De adventskalender na 1 december wisselen (stap 9: favorieten per seizoen). */
    ids: ['cl-rit-advent', 'bol-9300000285253019', 'bol-9300000163354878', 'cl-instax12', 'bol-9300000131876375', 'cl-emberton3'] },
  /* Stap 2 indeling (6-11-2026, GO Marius): het seizoensblok op de homepage: één grote kaart en twee kleine, op datum (deel 7 van het plan).
     De eerste kaart van een periode is de grote. Datums zijn maand-dag; het jaar maakt niet uit. */
  seizoen: {
    kaarten: {
      sint: { kicker: 'Pakjesavond 5 december', titel: 'Sinterklaas', tekst: 'Surprises, schoencadeautjes en lootjes.', knop: 'Bekijk Sinterklaas', naar: '/c/cadeaus/sinterklaas', beeld: 'images/sub/sub-cadeaus-sinterklaas.webp' },
      bf: { kicker: 'Black Friday · 27 november', titel: 'Black Friday deals', tekst: 'Echte kortingen van al onze winkels.', knop: 'Bekijk de deals', naar: '/collectie/black-friday', beeld: 'images/collecties/black-friday.webp', beeldMobiel: 'images/collecties/black-friday-mobiel.webp' },
      kerst: { kicker: 'Kerst komt eraan', titel: 'Kerstcadeaus', tekst: 'Mooie cadeaus voor onder de boom.', knop: 'Bekijk kerstcadeaus', naar: '/c/cadeaus/kerst', beeld: 'images/sub/sub-cadeaus-kerst-2026b.webp' },
      advent: { kicker: 'Aftellen tot kerst', titel: 'Adventskalenders', tekst: 'Beauty, LEGO, chocolade en meer.', knop: 'Bekijk de kalenders', naar: '/collectie/adventskalenders', beeld: 'images/sub/sub-cadeaus-adventskalenders-2026b.webp' },
      kerstHaar: { kicker: 'Kerst', titel: 'Kerstcadeau voor haar', tekst: 'Van klein verwenmoment tot luxe.', knop: 'Bekijk', naar: '/gids/kerstcadeau-voor-haar', beeld: 'images/sub/sub-cadeaus-voor-haar-2026b.webp' },
      kerstHem: { kicker: 'Kerst', titel: 'Kerstcadeau voor hem', tekst: 'Voor je vriend, vader of broer.', knop: 'Bekijk', naar: '/gids/kerstcadeau-voor-hem', beeld: 'images/sub/sub-cadeaus-voor-hem-2026b.webp' },
      aanbiedingen: { kicker: 'Elke dag nieuwe deals', titel: 'Aanbiedingen', tekst: 'De grootste kortingen van al onze winkels.', knop: 'Bekijk de aanbiedingen', naar: '/collectie/aanbiedingen', beeld: 'images/collecties/aanbiedingen.webp', beeldMobiel: 'images/collecties/aanbiedingen-mobiel.webp' },
      valentijn: { kicker: '14 februari', titel: 'Liefde & Valentijn', tekst: 'Romantische cadeaus voor haar en hem.', knop: 'Bekijk', naar: '/c/valentijn', beeld: 'images/sub/sub-valentijn-voor-haar.webp' }
    },
    periodes: [
      { vanaf: '10-01', tot: '11-19', kaarten: ['sint', 'bf', 'advent'] },
      { vanaf: '11-20', tot: '11-27', kaarten: ['bf', 'sint', 'kerst'] },
      { vanaf: '11-28', tot: '11-30', kaarten: ['sint', 'kerst', 'bf'] },
      { vanaf: '12-01', tot: '12-05', kaarten: ['sint', 'kerst', 'aanbiedingen'] },
      { vanaf: '12-06', tot: '12-25', kaarten: ['kerst', 'kerstHaar', 'kerstHem'] },
      { vanaf: '12-26', tot: '01-14', kaarten: ['aanbiedingen'] },
      { vanaf: '01-15', tot: '02-14', kaarten: ['valentijn', 'aanbiedingen'] },
      { vanaf: '02-15', tot: '09-30', kaarten: ['aanbiedingen'] }
    ]
  },
  /* Stap 2 indeling: het blok 'Persoonlijk maakt bijzonder' (4 producten uit de collectie Persoonlijke cadeaus; ids mogen hier vast gezet worden). */
  persoonlijk: { kicker: 'Persoonlijk maakt bijzonder', titel: 'Een cadeau speciaal voor iemand', tekst: 'Met naam, gravure of eigen foto.', knop: 'Alle persoonlijke cadeaus', naar: '/collectie/persoonlijke-cadeaus',
    /* Gekozen door Marius (6-11-2026, kieskaart). */
    ids: ['bol-9300000426946863', 'bol-9300000156021043', 'bol-9300000136627314', 'myka-11001203989'] },
  /* Stap 2 indeling: de gelegenheden als tekstknopjes onder het persoonlijke blok. */
  gelegenheidKnopjes: [['Verjaardag', '/gelegenheid/verjaardag'], ['Trouwen & jubileum', '/gelegenheid/jubileum'], ['Geboorte', '/voor/baby'], ['Liefde', '/c/valentijn'], ['Housewarming', '/gelegenheid/housewarming'], ['Bedankt', '/gelegenheid/bedankt'], ['Brievenbus', '/collectie/brievenbuscadeaus']],
  /* Eigen producten: een vaste plek bovenaan de homepage (onder de seizoensblokken). */
  eigen: { kicker: 'Van de maker van LeukeKeuze', titel: 'Onze eigen dino-kleurboeken', tekst: 'Zelf bedacht en gemaakt: vrolijke kleurboeken met 40 dino-kleurplaten, voor kinderen van 4 tot 8 jaar.',
    ids: ['amz-b0hmfl96b8', 'amz-b0hky1v4y9', 'amz-b0hmjp8cbl', 'amz-b0hmfl6pg4', 'amz-b0hn1xkg2s', 'amz-b0hl242jc8'] },
  /* Etalage op de homepage: een rij uitgekozen producten. Leeg laten (ids: []) om te verbergen. */
  etalage: { titel: 'Proost! Topflessen voor de feestdagen', naar: '/c/eten-drinken/', knop: 'Alle dranken',
    /* 01-11-2026: Decantalo (Daisycon, nu op pauze) vervangen door flessen van Wijny (TradeTracker, verdient wel). Oude rij: dc-2468345961, dc-1665638250, dc-2518147005, dc-1652149584, dc-1141534911, dc-1159542840, dc-2491446455, dc-1090238013, dc-391537950, dc-1096238052 */
    ids: ['wny-9705', 'wny-3908', 'wny-9732', 'wny-12118', 'wny-9734', 'wny-16919', 'wny-11691', 'wny-10932', 'wny-12013', 'wny-9634'] }
};

/* Afbeeldingen: laat leeg ('') als Nova ze nog niet heeft gemaakt.
   Dan toont de site een gouden icoon in de stijl van de site. */
/* ---------- Partnerwinkels (pagina /winkels + tegels in categorieën) ----------
   url leeg = nog geen partnerlink, dan wordt de winkel niet getoond. */
window.LK_WINKELS = [
  { naam: 'Ditverzinjeniet', tekst: 'Bijzondere en originele cadeaus die je niet overal vindt.', cats: ['cadeaus', 'wonen', 'dieren', 'boeken-media', 'hobby', 'speelgoed', 'sport-outdoor', 'elektronica', 'tuin-klussen', 'keuken', 'eten-drinken'], url: 'https://tc.tradetracker.net/?c=2219&m=1736161&a=516846&r=&u=' + encodeURIComponent('https://www.ditverzinjeniet.nl/') /* 04-11-2026: via TradeTracker, daar verdienen we wel aan */ },
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
  /* 04-11-2026: TradeTracker- en Awin-winkels erbij (Marius). Links lopen via TradeTracker (a=516846) en Awin (3110079). */
  { naam: 'Coolblue', tekst: 'Alles voor een glimlach: elektronica, huishouden, gaming en slimme gadgets, morgen in huis.', cats: ['elektronica', 'keuken', 'wonen', 'sport-outdoor', 'tuin-klussen'], url: 'https://www.awin1.com/cread.php?awinmid=85161&awinaffid=3110079&ued=' + encodeURIComponent('https://www.coolblue.nl/') },
  { naam: 'HEMA', tekst: 'Echt HEMA: van rookworst-cadeaus en fotocadeaus tot huissokken, kaarsen en speelgoed.', cats: ['cadeaus', 'wonen', 'keuken', 'speelgoed', 'mode-beauty', 'eten-drinken'], url: 'https://tc.tradetracker.net/?c=25436&m=1096437&a=516846&r=&u=' + encodeURIComponent('https://www.hema.nl/') },
  { naam: 'Grote Kadoshop', tekst: 'Duizenden cadeaus: book nooks, bouwpakketten, gadgets en grappige cadeaus.', cats: ['cadeaus', 'hobby', 'speelgoed', 'wonen'], url: 'https://tc.tradetracker.net/?c=34778&m=1932305&a=516846&r=&u=' + encodeURIComponent('https://www.grotekadoshop.nl/') },
  { naam: 'Cadeau.nl', tekst: 'Originele cadeaus voor iedereen, ook met naam of foto.', cats: ['cadeaus', 'wonen', 'hobby'], url: 'https://tc.tradetracker.net/?c=28442&m=1744030&a=516846&r=&u=' + encodeURIComponent('https://www.cadeau.nl/') },
  { naam: 'Kado-versturen', tekst: 'Cadeaus en pakketten die je meteen laat bezorgen, met een kaartje erbij.', cats: ['cadeaus', 'eten-drinken', 'wonen'], url: 'https://tc.tradetracker.net/?c=13055&m=466600&a=516846&r=&u=' + encodeURIComponent('https://www.kado-versturen.nl/') },
  { naam: 'Smartphoto', tekst: 'Fotocadeaus: fotoboeken, kalenders, mokken en canvas met je eigen foto\'s.', cats: ['cadeaus', 'wonen'], url: 'https://tc.tradetracker.net/?c=4903&m=1195836&a=516846&r=&u=' + encodeURIComponent('https://www.smartphoto.nl/') },
  { naam: 'Nedgame', tekst: 'Games, consoles en gaming-spullen voor elk systeem.', cats: ['elektronica', 'speelgoed'], url: 'https://tc.tradetracker.net/?c=558&m=1597395&a=516846&r=&u=' + encodeURIComponent('https://www.nedgame.nl/') },
  { naam: 'De Grote Speelgoedwinkel', tekst: 'Een enorm aanbod speelgoed, van LEGO tot buitenspeelgoed.', cats: ['speelgoed'], url: 'https://tc.tradetracker.net/?c=3055&m=2434431&a=516846&r=&u=' + encodeURIComponent('https://www.degrotespeelgoedwinkel.nl/') },
  { naam: 'CoolGift', tekst: 'Grappige en slimme cadeaus voor de lol.', cats: ['cadeaus', 'wonen'], url: 'https://tc.tradetracker.net/?c=2656&m=1728408&a=516846&r=&u=' + encodeURIComponent('https://www.coolgift.com/') },
  { naam: 'Superzero', tekst: 'Fan-spullen van je favoriete films, series en games.', cats: ['cadeaus', 'speelgoed', 'elektronica'], url: 'https://tc.tradetracker.net/?c=35986&m=2084231&a=516846&r=&u=' + encodeURIComponent('https://www.superzero.nl/') },
  { naam: 'Kitchenette', tekst: 'Mooie keukenspullen van bekende merken: pannen, messen en apparaten.', cats: ['keuken'], url: 'https://tc.tradetracker.net/?c=24142&m=1708137&a=516846&r=&u=' + encodeURIComponent('https://www.kitchenetteonline.nl/') },
  { naam: 'Looking Good Today', tekst: 'Sieraden en horloges, van zilver tot verguld.', cats: ['sieraden', 'mode-beauty'], url: 'https://tc.tradetracker.net/?c=14306&m=1801395&a=516846&r=&u=' + encodeURIComponent('https://www.lookinggoodtoday.com/') },
  { naam: 'Fiftiesstore', tekst: 'Retro uit de jaren 50: jukeboxen, neonborden, Amerikaanse decoratie.', cats: ['wonen', 'cadeaus'], url: 'https://tc.tradetracker.net/?c=16663&m=2168887&a=516846&r=&u=' + encodeURIComponent('https://www.fiftiesstore.nl/') },
  { naam: 'Hobbymax', tekst: 'Alles om zelf te maken: klei, mozaïek, kralen en knutselmateriaal.', cats: ['hobby'], url: 'https://tc.tradetracker.net/?c=13421&m=480838&a=516846&r=&u=' + encodeURIComponent('https://www.hobbymax.nl/') },
  { naam: 'Bushpappa', tekst: 'Alles voor buiten: messen van Mora, kampvuur, bushcraft en kamperen.', cats: ['sport-outdoor'], url: 'https://tc.tradetracker.net/?c=36814&m=2153352&a=516846&r=&u=' + encodeURIComponent('https://www.bushpappa.nl/') },
  { naam: 'Barrelkings', tekst: 'Meubels en decoratie van echte whisky- en wijnvaten.', cats: ['wonen', 'dranken'], url: 'https://tc.tradetracker.net/?c=33048&m=2370354&a=516846&r=&u=' + encodeURIComponent('https://barrelkings.com/') },
  { naam: 'Repeat Cashmere', tekst: 'Zachte truien, sjaals en mutsen van kasjmier.', cats: ['mode-beauty'], url: 'https://tc.tradetracker.net/?c=19243&m=2099037&a=516846&r=&u=' + encodeURIComponent('https://www.repeatcashmere.com/') },
  { naam: 'Animals Giftshop', tekst: 'Cadeaus voor dierenliefhebbers: mokken, beeldjes en meer met je lievelingsdier.', cats: ['dieren', 'cadeaus'], url: 'https://tc.tradetracker.net/?c=21278&m=814623&a=516846&r=&u=' + encodeURIComponent('https://www.animals-giftshop.nl/') },
  { naam: 'Countrylifestyle', tekst: 'Landelijke mode en accessoires: jassen, hoeden, tassen en sjaals.', cats: ['mode-beauty', 'sport-outdoor'], url: 'https://tc.tradetracker.net/?c=8462&m=1479822&a=516846&r=&u=' + encodeURIComponent('https://www.countrylifestyle.nl/') },
  { naam: 'Expert', tekst: 'Elektronica met advies van de winkel om de hoek: tv\'s, audio, huishouden en gadgets.', cats: ['elektronica', 'keuken'], url: 'https://tc.tradetracker.net/?c=5515&m=254727&a=516846&r=&u=' + encodeURIComponent('https://www.expert.nl/') },
  { naam: 'Woonkampioen', tekst: 'Meubels en woonaccessoires: banken, kasten, lampen en decoratie.', cats: ['wonen'], url: 'https://tc.tradetracker.net/?c=39999&m=2482090&a=516846&r=&u=' + encodeURIComponent('https://woonkampioen.nl/') },
  { naam: 'Bourgini', tekst: 'Handige keukenapparaten: airfryers, blenders, waterkokers en meer.', cats: ['keuken'], url: 'https://tc.tradetracker.net/?c=36595&m=2132103&a=516846&r=&u=' + encodeURIComponent('https://bourgini.com/') },
  { naam: 'Fotofabriek', tekst: 'Fotocadeaus: canvas, fotoboeken, kalenders en mokken met je eigen foto.', cats: ['cadeaus', 'wonen'], url: 'https://tc.tradetracker.net/?c=30576&m=1809626&a=516846&r=&u=' + encodeURIComponent('https://www.fotofabriek.nl/') },
  { naam: 'Ikwilzitzakken', tekst: 'Zitzakken voor binnen en buiten, ook voor kinderen.', cats: ['wonen', 'tuin-klussen'], url: 'https://tc.tradetracker.net/?c=39609&m=2587470&a=516846&r=&u=' + encodeURIComponent('https://www.ikwilzitzakken.nl/') },
  { naam: 'Besled', tekst: 'Ledverlichting en slimme lampen voor in huis en in de tuin.', cats: ['wonen', 'elektronica', 'tuin-klussen'], url: 'https://tc.tradetracker.net/?c=26807&m=1533462&a=516846&r=&u=' + encodeURIComponent('https://www.besled.nl/') },
  { naam: '1dagactie', tekst: 'Elke dag nieuwe deals: sokken, ondergoed, handdoeken en meer.', cats: ['mode-beauty', 'wonen'], url: 'https://tc.tradetracker.net/?c=4386&m=1164150&a=516846&r=&u=' + encodeURIComponent('https://www.1dagactie.nl/') },
  { naam: 'Louiz', tekst: 'Sieraden met natuursteen: oorbellen, kettingen en armbanden.', cats: ['sieraden'], url: 'https://tc.tradetracker.net/?c=39858&m=2476044&a=516846&r=&u=' + encodeURIComponent('https://louiz.nl/') },
  { naam: 'Tandenborstel.com', tekst: 'Elektrische tandenborstels van Oral-B en Philips Sonicare, met opzetborstels.', cats: ['geuren-verzorging', 'mode-beauty'], url: 'https://tc.tradetracker.net/?c=28805&m=1911673&a=516846&r=&u=' + encodeURIComponent('https://www.tandenborstel.com/') },
  { naam: 'Boekenwereld', tekst: 'Boeken in alle soorten: romans, thrillers, kinderboeken en kookboeken.', cats: ['boeken-media'], url: 'https://tc.tradetracker.net/?c=12322&m=2490267&a=516846&r=&u=' + encodeURIComponent('https://www.boekenwereld.com/') },
  { naam: 'Biercheque', tekst: 'Een biercheque als cadeau: de ontvanger kiest zelf zijn biertjes.', cats: ['dranken', 'cadeaus'], url: 'https://tc.tradetracker.net/?c=39375&m=2472146&a=516846&r=&u=' + encodeURIComponent('https://biercheque.nl/') },
  { naam: 's.Oliver', tekst: 'Duitse mode voor dames en heren: truien, jassen, jeans en accessoires.', cats: ['mode-beauty'], url: 'https://www.awin1.com/cread.php?awinmid=116613&awinaffid=3110079&ued=' + encodeURIComponent('https://www.soliver.nl/') },
  { naam: 'Street One', tekst: 'Vrouwelijke mode: truien, vesten, broeken en sjaals.', cats: ['mode-beauty'], url: 'https://www.awin1.com/cread.php?awinmid=16112&awinaffid=3110079&ued=' + encodeURIComponent('https://www.street-one.nl/') },
  { naam: 'EMP', tekst: 'Merchandise van bands, films, series en games.', cats: ['cadeaus', 'mode-beauty', 'boeken-media'], url: 'https://www.awin1.com/cread.php?awinmid=39930&awinaffid=3110079&ued=' + encodeURIComponent('https://www.emp-online.nl/') },
  { naam: 'InterGard', tekst: 'Tuinspullen: kweekkassen, tuinhuisjes, vogelhuisjes en tuindecoratie.', cats: ['tuin-klussen'], url: 'https://www.awin1.com/cread.php?awinmid=21861&awinaffid=3110079&ued=' + encodeURIComponent('https://www.intergard.nl/') },
  { naam: 'Robotime', tekst: 'Houten bouwpakketten: muziekdozen, book nooks en miniatuurhuisjes.', cats: ['hobby', 'speelgoed'], url: 'https://www.awin1.com/cread.php?awinmid=109560&awinaffid=3110079&ued=' + encodeURIComponent('https://www.robotime.com/') },
  { naam: 'Timeshop24', tekst: 'Horloges van bekende merken (Duitse webshop).', cats: ['mode-beauty'], url: 'https://www.awin1.com/cread.php?awinmid=14609&awinaffid=3110079&ued=' + encodeURIComponent('https://www.timeshop24.de/') },
  /* 05-11-2026: nieuwe winkels (Daisycon + TradeTracker), wens Marius: "allemaal" */
  { naam: "Levi's", tekst: 'Jeans, jassen en truien van het bekende spijkerbroekenmerk.', cats: ['mode-beauty'], url: 'https://glp8.net/c/?si=19949&li=1850890&wi=433339&ws=' },
  { naam: 'Isabel Marant', tekst: 'Franse designermode: kleding, schoenen en tassen.', cats: ['mode-beauty'], url: 'https://bdt9.net/c/?si=18138&li=1785243&wi=433339&ws=' },
  { naam: 'Eastpak', tekst: 'Stevige rugzakken, tassen en koffers, met 30 jaar garantie.', cats: ['mode-beauty', 'sport-outdoor'], url: 'https://glp8.net/c/?si=20076&li=1857675&wi=433339&ws=' },
  { naam: 'Mokkaland', tekst: 'Originele Nespresso Professional-cups en koffiepads, voordelig.', cats: ['eten-drinken'], url: 'https://glp8.net/c/?si=21568&li=1913742&wi=433339&ws=' },
  { naam: 'Butchery.nl', tekst: 'Topvlees van de online slager: wagyu, steaks en BBQ-pakketten.', cats: ['eten-drinken'], url: 'https://jdt8.net/c/?si=17660&li=1762426&wi=433339&ws=' },
  { naam: 'Stroopwafels.com', tekst: 'Echte Daelmans-stroopwafels in Delfts blauwe blikken en cadeaudoosjes.', cats: ['eten-drinken'], url: 'https://jdt8.net/c/?si=17202&li=1747340&wi=433339&ws=' },
  { naam: 'Vipio', tekst: 'Bijzonder overnachten: in een boomhut, kasteel of vuurtoren. Ook leuk als cadeau.', cats: ['cadeaus', 'sport-outdoor'], url: 'https://fr135.net/c/?si=15569&li=1672748&wi=433339&ws=' },
  { naam: 'Kambukka', tekst: 'Lekvrije drinkflessen en thermosbekers met een slim deksel.', cats: ['keuken', 'sport-outdoor'], url: 'https://jdt8.net/c/?si=17815&li=1771806&wi=433339&ws=' },
  { naam: 'Cewe', tekst: 'Fotoboeken, foto op canvas en andere fotocadeaus.', cats: ['cadeaus', 'wonen'], url: 'https://lt45.net/c/?si=11918&li=1526258&wi=433339&ws=' },
  { naam: 'Parfumado', tekst: 'Elke maand een ander luxe parfum proberen, in een handig flesje.', cats: ['geuren-verzorging'], url: 'https://fr135.net/c/?si=15178&li=1658200&wi=433339&ws=' },
  { naam: 'Goedgemerkt', tekst: 'Naamstickers en labels voor de spullen van kinderen.', cats: ['cadeaus'], url: 'https://lt45.net/c/?si=12921&li=1569280&wi=433339&ws=' },
  { naam: 'Brekz', tekst: 'Dierenwinkel met voer, snoepjes en speeltjes voor hond, kat en andere dieren.', cats: ['dieren'], url: 'https://tc.tradetracker.net/?c=9620&m=1161548&a=516846&r=&u=' + encodeURIComponent('https://www.brekz.nl/') },
  { naam: 'Boardgameshop', tekst: 'Bordspellen en kaartspellen, van familiespel tot expertspel.', cats: ['speelgoed'], url: 'https://tc.tradetracker.net/?c=40488&m=2520696&a=516846&r=&u=' + encodeURIComponent('https://boardgameshop.nl/') },
  { naam: 'Yourdecoration', tekst: 'Posters, fotobehang en wanddecoratie.', cats: ['wonen'], url: 'https://tc.tradetracker.net/?c=29448&m=1549969&a=516846&r=&u=' + encodeURIComponent('https://www.yourdecoration.nl/') },
  { naam: 'Barokspiegel', tekst: 'Sierlijke barokspiegels en spiegels in alle maten.', cats: ['wonen'], url: 'https://tc.tradetracker.net/?c=27832&m=1537045&a=516846&r=&u=' + encodeURIComponent('https://www.barokspiegel.nl/') },
  { naam: 'Profotonet', tekst: 'Alles voor de fotograaf: camera\'s, lenzen en accessoires.', cats: ['elektronica'], url: 'https://tc.tradetracker.net/?c=32704&m=1748978&a=516846&r=&u=' + encodeURIComponent('https://www.profotonet.com/') },
  { naam: 'Steegengamode', tekst: 'Kleding en schoenen voor dames en heren, van bekende merken.', cats: ['mode-beauty'], url: 'https://tc.tradetracker.net/?c=33842&m=1847808&a=516846&r=&u=' + encodeURIComponent('https://www.steegengamode.nl/') },
  { naam: 'I-KOOK', tekst: 'Een nieuwe keuken op maat, met persoonlijk advies van een keukencoach.', cats: ['keuken'], url: 'https://lt45.net/c/?si=11558&li=1513186&wi=433339&ws=' }
];

window.LK_CATEGORIEEN = [
  { slug: 'cadeaus', naam: 'Cadeaus', kort: 'Cadeaus', icoon: 'cadeau',
    tekst: 'Voor elke gelegenheid een bijzonder cadeau.',
    tegel: 'images/categorieen/categorie-cadeaus-gw.webp', banner: 'images/banners/banner-cat-cadeaus-gw.webp',
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
    tegel: 'images/categorieen/categorie-speelgoed-gw.webp', banner: 'images/banners/banner-cat-speelgoed.webp',
    subs: [
      { slug: 'baby-peuter', naam: 'Baby & peuter', beeld: 'images/sub/sub-speelgoed-baby-peuter.webp' }, { slug: 'bouwen', naam: 'Bouwen', beeld: 'images/sub/sub-speelgoed-bouwen.webp' },
      /* Speelfiguren, auto's, tractors en treinen (Schleich, Playmobil, Bruder, BRIO). Plaatje volgt nog van Nova; tot die tijd toont de site het gouden icoon. */
      { slug: 'figuren-voertuigen', naam: 'Figuren & voertuigen', beeld: 'images/sub/sub-speelgoed-figuren-voertuigen.webp', tekst: 'Speelfiguren en dieren van Schleich en Playmobil, tractors en vrachtwagens van Bruder en SIKU, en houten treinen van BRIO.' },
      { slug: 'bordspellen', naam: 'Bord- & tafelspellen', beeld: 'images/sub/sub-speelgoed-bordspellen.webp' }, { slug: 'kaartspellen', naam: 'Kaart- & dobbelspellen', beeld: 'images/sub/sub-speelgoed-kaartspellen.webp' }, { slug: 'puzzels', naam: 'Puzzels', beeld: 'images/sub/sub-speelgoed-puzzels.webp' },
      { slug: 'buitenspeelgoed', naam: 'Buitenspeelgoed', beeld: 'images/sub/sub-speelgoed-buitenspeelgoed.webp' }, { slug: 'knutselen', naam: 'Knutselen voor kinderen', beeld: 'images/sub/sub-speelgoed-knutselen.webp' }
    ] },
  { slug: 'eten-drinken', naam: 'Eten & Drinken', kort: 'Eten & Drinken', icoon: 'taart',
    tekst: 'Lekkers om te geven.', tegel: 'images/categorieen/categorie-eten-drinken-gw.webp', banner: 'images/banners/banner-cat-eten-drinken.webp',
    subs: [
      { slug: 'chocolade-snoep', naam: 'Chocolade', beeld: 'images/sub/sub-eten-drinken-chocolade-snoep.webp' }, { slug: 'drop-snoep', naam: 'Drop & snoep', beeld: 'images/sub/sub-eten-drinken-drop-snoep.webp' }, { slug: 'bbq', naam: 'BBQ & kruiden', beeld: 'images/sub/sub-eten-drinken-bbq.webp' }, { slug: 'pakketten', naam: 'Pakketten & borrel', beeld: 'images/sub/sub-eten-drinken-pakketten.webp' },
      { slug: 'koffie-thee', naam: 'Koffie & thee', beeld: 'images/sub/sub-eten-drinken-koffie-thee.webp' }, { slug: 'lekkernijen', naam: 'Lekkernijen', beeld: 'images/sub/sub-eten-drinken-lekkernijen.webp' }
    ] },
  { slug: 'hobby', naam: 'Hobby & Creatief', kort: 'Hobby & Creatief', icoon: 'palet',
    tekst: 'Zelf iets moois maken.', tegel: 'images/categorieen/categorie-hobby-gw.webp', banner: 'images/banners/banner-cat-hobby.webp',
    subs: [
      { slug: 'tekenen-schilderen', naam: 'Tekenen & schilderen', beeld: 'images/sub/sub-hobby-tekenen-schilderen.webp' }, { slug: 'haken-breien', naam: 'Haken & breien', beeld: 'images/sub/sub-hobby-haken-breien.webp' },
      { slug: 'knutselen', naam: 'Zelf maken', beeld: 'images/sub/sub-hobby-knutselen.webp' }, { slug: 'modelbouw', naam: 'Modelbouw', beeld: 'images/sub/sub-hobby-modelbouw.webp' }
    ] },
  { slug: 'mode-beauty', naam: 'Mode & Beauty', kort: 'Mode & Beauty', icoon: 'tas',
    tekst: 'Mooie accessoires en verzorging.', tegel: 'images/categorieen/categorie-mode-beauty-gw.webp', banner: 'images/banners/banner-cat-mode-beauty.webp',
    subs: [
      { slug: 'horloges', naam: 'Horloges', beeld: 'images/sub/sub-mode-beauty-horloges.webp' }, { slug: 'geuren', naam: 'Geuren', beeld: 'images/sub/sub-mode-beauty-geuren.webp' }, { slug: 'verzorging', naam: 'Verzorging', beeld: 'images/sub/sub-mode-beauty-verzorging.webp' },
      { slug: 'tassen', naam: 'Hand- & schoudertassen', beeld: 'images/sub/sub-mode-beauty-tassen.webp' }, { slug: 'rugzakken-reistassen', naam: 'Rugzakken & reistassen', beeld: 'images/sub/sub-mode-beauty-rugzakken-reistassen.webp' }, { slug: 'schoenen', naam: 'Schoenen', beeld: 'images/sub/sub-mode-beauty-schoenen-2026b.webp' }, { slug: 'kleding', naam: 'Kleding & sokken', beeld: 'images/sub/sub-mode-beauty-kleding.webp' }, { slug: 'accessoires', naam: 'Accessoires', beeld: 'images/sub/sub-mode-beauty-accessoires.webp' }
    ] },
  { slug: 'sieraden', naam: 'Sieraden', kort: 'Sieraden', icoon: 'ring',
    tekst: 'Kettingen, oorbellen, ringen en armbanden. Van betaalbaar tot echt goud.', tegel: 'images/categorieen/categorie-sieraden-gw.webp', banner: 'images/banners/banner-cat-sieraden.webp',
    subs: [
      { slug: 'kettingen', naam: 'Kettingen & hangers', beeld: 'images/sub/sub-sieraden-kettingen.webp' }, { slug: 'oorbellen', naam: 'Oorbellen', beeld: 'images/sub/sub-sieraden-oorbellen.webp' }, { slug: 'ringen', naam: 'Ringen', beeld: 'images/sub/sub-sieraden-ringen.webp' }, { slug: 'armbanden', naam: 'Armbanden & enkelbandjes', beeld: 'images/sub/sub-sieraden-armbanden.webp' },
      { slug: 'heren', naam: 'Voor hem', beeld: 'images/sub/sub-sieraden-heren.webp' }, { slug: 'echt-goud', naam: 'Echt goud', beeld: 'images/sub/sub-sieraden-echt-goud.webp' }, { slug: 'zilver', naam: 'Zilver', beeld: 'images/sub/sub-sieraden-zilver.webp' }, { slug: 'verguld-staal', naam: 'Verguld & staal', beeld: 'images/sub/sub-sieraden-verguld-staal.webp' }, { slug: 'viking', naam: 'Viking-sieraden', beeld: 'images/sub/sub-sieraden-viking.webp' }
    ] },
  { slug: 'dranken', naam: 'Dranken', kort: 'Dranken', icoon: 'glas',
    tekst: 'Mooie flessen om te geven.', tegel: 'images/categorieen/categorie-dranken-gw.webp', banner: 'images/banners/banner-cat-dranken.webp',
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
    tekst: 'Slimme gadgets voor elke dag.', tegel: 'images/categorieen/categorie-elektronica-gw.webp', banner: 'images/banners/banner-cat-elektronica.webp',
    subs: [
      { slug: 'audio', naam: 'Audio', beeld: 'images/sub/sub-elektronica-audio.webp' }, { slug: 'slimme-gadgets', naam: 'Slimme gadgets', beeld: 'images/sub/sub-elektronica-slimme-gadgets.webp' },
      { slug: 'telefoon', naam: 'Telefoon', beeld: 'images/sub/sub-elektronica-telefoon.webp' }, { slug: 'gaming', naam: 'Gaming', beeld: 'images/sub/sub-elektronica-gaming.webp' }, { slug: 'foto-video', naam: 'Foto & video', beeld: 'images/sub/sub-elektronica-foto-video.webp' }
    ] },
  { slug: 'sport-outdoor', naam: 'Sport, Outdoor & Reizen', kort: 'Sport, Outdoor & Reizen', icoon: 'bal',
    tekst: 'Erop uit, in beweging.', tegel: 'images/categorieen/categorie-sport-outdoor-gw.webp', banner: 'images/banners/banner-cat-sport-outdoor.webp',
    subs: [
      { slug: 'fitness', naam: 'Fitness', beeld: 'images/sub/sub-sport-outdoor-fitness.webp' }, { slug: 'wandelen', naam: 'Wandelen', beeld: 'images/sub/sub-sport-outdoor-wandelen.webp' }, { slug: 'fietsen', naam: 'Fietsen', beeld: 'images/sub/sub-sport-outdoor-fietsen.webp' },
      { slug: 'kamperen', naam: 'Kamperen', beeld: 'images/sub/sub-sport-outdoor-kamperen.webp' }, { slug: 'reizen', naam: 'Reizen', beeld: 'images/sub/sub-sport-outdoor-reizen.webp' }, { slug: 'darts', naam: 'Darts', beeld: 'images/sub/sub-sport-outdoor-darts.webp' }, { slug: 'golf', naam: 'Golf', beeld: 'images/sub/sub-sport-outdoor-golf-2026b.webp' },
      /* Metaaldetectie is een eigen categorie, maar staat in het menu onder Sport (wens van Marius). */
      { slug: 'metaaldetectie', naam: 'Metaaldetectie', beeld: 'images/categorieen/categorie-metaaldetectie-klein.webp', naar: '/c/metaaldetectie' }
    ] },
  { slug: 'wonen', naam: 'Wonen & Decoratie', kort: 'Wonen & Deco', icoon: 'huis',
    tekst: 'Maak van je huis een warm thuis.', tegel: 'images/categorieen/categorie-wonen-gw.webp', banner: 'images/banners/banner-cat-wonen.webp',
    subs: [
      { slug: 'kaarsen-geur', naam: 'Kaarsen & kandelaars', beeld: 'images/sub/sub-wonen-kaarsen-geur.webp' }, { slug: 'huisgeuren', naam: 'Huisgeuren', beeld: 'images/sub/sub-wonen-huisgeuren.webp' }, { slug: 'woonaccessoires', naam: 'Woonaccessoires', beeld: 'images/sub/sub-wonen-woonaccessoires.webp' },
      { slug: 'verlichting', naam: 'Verlichting', beeld: 'images/sub/sub-wonen-verlichting.webp' }, { slug: 'plaids-kussens', naam: 'Plaids & kussens', beeld: 'images/sub/sub-wonen-plaids-kussens.webp' },
      { slug: 'kerstdecoratie', naam: 'Kerstdecoratie', beeld: 'images/sub/sub-wonen-kerstdecoratie.webp' }
    ] },
  { slug: 'keuken', naam: 'Keuken & Tafelen', kort: 'Keuken', icoon: 'kop',
    tekst: 'Mooi koken, gezellig tafelen.', tegel: 'images/categorieen/categorie-keuken-gw.webp', banner: 'images/banners/banner-cat-keuken.webp',
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
    tekst: 'Bijbels, sieraden met een kruis, wandborden met een Bijbeltekst en cadeaus met betekenis, voor jong en oud.',
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

    ] },
  /* Noodpakket & survival (wens Marius 2-11-2026): een eigen hoek, net als christelijk. Alleen echte, bruikbare spullen. */
  { slug: 'noodpakket-survival', naam: 'Noodpakket & survival', kort: 'Noodpakket & survival', icoon: 'nood',
    tekst: 'Goed voorbereid als de stroom, het water of het internet uitvalt. Noodpakketten, noodradio’s, zaklampen, waterfilters, EHBO en spullen voor buiten. Alles wat de overheid aanraadt voor de eerste 72 uur, en de dingen die mensen vaak vergeten.',
    seoTitel: 'Noodpakket kopen of zelf samenstellen: alles voor 72 uur',
    seoTekst: 'Noodpakket kopen of zelf samenstellen? Noodradio’s, zaklampen, powerbanks, waterfilters, noodrantsoen, EHBO-kits en survivalspullen. Met de checklist voor 72 uur.',
    gids: [
      { kop: 'Waarom een noodpakket?', tekst: 'De overheid raadt iedereen aan om zich voor te bereiden op een noodsituatie, zoals een lange stroomstoring, uitval van internet en telefoon of een overstroming. Het advies: zorg dat je 72 uur, dus 3 dagen, zelf kunt redden. Hulpdiensten hebben dan de handen vol met wie het het hardst nodig heeft.' },
      { kop: 'Wat hoort erin?', tekst: 'De basis is simpel: drinkwater (3 liter per persoon per dag), houdbaar eten, een zaklamp, een radio op batterijen of een opwindradio, een powerbank, een EHBO-set, dekens, contant geld (ongeveer 70 euro per volwassene en 30 euro per kind) en je medicijnen. Lees onze checklist voor de volledige lijst.' },
      { kop: 'Kant-en-klaar of zelf samenstellen?', tekst: 'Een kant-en-klaar noodpakket is makkelijk, maar mist vaak water, hygiënespullen en contant geld. Zelf samenstellen is vaak goedkoper en je kiest zelf de kwaliteit. Een goede middenweg: koop een basispakket en vul het aan met een goede noodradio, een waterfilter en je eigen medicijnen.' },
      { kop: 'Wat mensen vaak vergeten', tekst: 'Contant geld in kleine briefjes, een papieren lijst met telefoonnummers, reservebrillen of lenzen, eten voor huisdieren, luiers en babyvoeding, een opladerkabel die bij de powerbank past, en batterijen die ook echt passen. En: kijk twee keer per jaar of alles nog werkt en niet over de datum is.' }
    ],
    tegel: 'images/categorieen/categorie-noodpakket-survival.webp', banner: 'images/banners/banner-cat-noodpakket-survival.webp',
    subs: [
      { slug: 'noodpakketten', naam: 'Noodpakketten', beeld: 'images/sub/sub-noodpakket-survival-noodpakketten.webp', seoTitel: 'Noodpakket kopen: kant-en-klare noodpakketten voor 72 uur', seoTekst: 'Kant-en-klare noodpakketten voor 1 of meer personen, voor de eerste 72 uur. Met zaklamp, radio, deken, EHBO en meer. Vul ze aan met water en contant geld.' },
      { slug: 'noodradio', naam: 'Noodradio’s', beeld: 'images/sub/sub-noodpakket-survival-noodradio.webp', seoTitel: 'Noodradio kopen: opwindbaar, met zonnepaneel en powerbank', seoTekst: 'Een noodradio werkt ook als de stroom en het internet uitvallen. Opwindbare radio’s met zonnepaneel, zaklamp en powerbank, zodat je de rampenzender kunt horen.' },
      { slug: 'licht-stroom', naam: 'Licht & stroom', beeld: 'images/sub/sub-noodpakket-survival-licht-stroom.webp', seoTitel: 'Zaklampen, hoofdlampen en powerbanks voor een stroomstoring', seoTekst: 'Licht en stroom als het donker wordt: zaklampen, hoofdlampen, lantaarns, powerbanks op zonne-energie en draagbare powerstations.' },
      { slug: 'water-eten', naam: 'Water & eten', beeld: 'images/sub/sub-noodpakket-survival-water-eten.webp', seoTitel: 'Noodrantsoen, houdbaar water en waterfilters', seoTekst: 'Drinkwater en eten voor de eerste 72 uur: lang houdbaar water, noodrantsoen, gevriesdroogde maaltijden, waterfilters en jerrycans.' },
      { slug: 'koken-warmte', naam: 'Koken & warmte', beeld: 'images/sub/sub-noodpakket-survival-koken-warmte.webp', seoTitel: 'Koken zonder stroom en warm blijven', seoTekst: 'Koken zonder stroom of gas met een klein kooktoestel, en warm blijven met nooddekens, slaapzakken en handwarmers.' },
      { slug: 'ehbo-brand', naam: 'EHBO & brandveiligheid', beeld: 'images/sub/sub-noodpakket-survival-ehbo-brand.webp', seoTitel: 'EHBO-kits, branddekens en brandblussers', seoTekst: 'EHBO-kits voor thuis, in de auto en onderweg, plus branddekens, brandblussers en rookmelders. Veilig in huis.' },
      { slug: 'buiten-veld', naam: 'Buiten & in het veld', beeld: 'images/sub/sub-noodpakket-survival-buiten-veld.webp', seoTitel: 'Survival en bushcraft: vuurstarters, kompassen, tarps en zagen', seoTekst: 'Voor buiten, in het bos en op de velden: vuurstarters, kompassen, tarps, vouwzagen, multitools en waterdichte zakken.' },
      { slug: 'tassen-onderweg', naam: 'Tassen & onderweg', beeld: 'images/sub/sub-noodpakket-survival-tassen-onderweg.webp', seoTitel: 'Noodtas en bug-out-bag: rugzakken voor onderweg', seoTekst: 'Een stevige rugzak om je noodpakket in te bewaren, plus handige spullen voor in de stad en onderweg: fluitjes, waterdichte zakken en meer.' }
    ] }
];

/* Stap 1 indeling (6-11-2026, GO Marius): overal dezelfde vier bedragen. Past bij een Sinterklaasbudget van gemiddeld €134 (lootjestrekken.nl, 2025).
   Oude adressen (?prijs=tot10, boven50) blijven werken via LK_PRIJS_OUD. */
window.LK_PRIJZEN = [
  { id: 'alle', label: 'Alles', min: 0, max: Infinity },
  { id: 'tot25', label: 'Tot €25', min: 0, max: 25 },
  { id: '25-50', label: '€25-50', min: 25.01, max: 50 },
  { id: '50-100', label: '€50-100', min: 50.01, max: 100 },
  { id: 'boven100', label: '€100+', min: 100.01, max: Infinity }
];
window.LK_PRIJS_OUD = { tot10: 'tot25', tot50: '25-50', boven50: '50-100' };

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
/* 3.0: vakje binnen een groep (derde laag). */
window.LK_VAK = function (sub, slug) {
  return sub && (sub.vakjes || []).find(function (v) { return v.slug === slug; });
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
 "sieraden": "horloge horloges herenhorloge dameshorloge watch uhr herrenuhr damenuhr chronograaf chronograph smartwatch gordijn glasgordijn vaas voorwerp drankspel kandelaar lunchbox pop holder stekers bloomring multitool toss fire snoep marmeren discobal paracord survival",
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
      s('darts-sport', 'Darts & sport', 'sport-outdoor-darts', ['sport-outdoor/darts', 'sport-outdoor/fitness', 'sport-outdoor/golf', 'sport-outdoor/padel-tennis', 'sport-outdoor/voetbal-balsporten', 'sport-outdoor/hardlopen'], 'Darts en sportcadeau voor hem', 'Dartborden, pijlen en cadeaus voor de sportieve man: golf, padel, fitness en voetbal.') /* 7-11: alleen darts en sport, geen steps/multitools/speakers (Marius) */,
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
      s('sport-darts', 'Sport & darts', 'sport-outdoor-darts', ['sport-outdoor/darts', 'sport-outdoor/fitness', 'sport-outdoor/golf', 'sport-outdoor/padel-tennis', 'sport-outdoor/voetbal-balsporten', 'sport-outdoor/hardlopen'], 'Sportcadeau voor tieners', 'Darts, voetbal, padel en fitness.'),
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
    tekst: 'Parfum, aftershave en verzorging om cadeau te geven.', tegel: 'images/categorieen/categorie-geuren-verzorging-gw.webp', vakken: ['mode-beauty/geuren', 'mode-beauty/verzorging'],
    subs: [{ slug: 'geuren', naam: 'Geuren', beeld: 'images/sub/sub-mode-beauty-geuren.webp', vak: 'mode-beauty/geuren' }, { slug: 'verzorging', naam: 'Verzorging', beeld: 'images/sub/sub-mode-beauty-verzorging.webp', vak: 'mode-beauty/verzorging' }] });
  /* Mode & Accessoires: wat overblijft van Mode & Beauty. Horloges, geuren en verzorging blijven bereikbaar, maar staan niet meer in het rijtje. */
  hernoem('mode-beauty', 'Mode & Accessoires'); mb.tekst = 'Tassen, schoenen, kleding en accessoires.'; mb.tegel = 'images/categorieen/categorie-mode-beauty-gw.webp';
  mb.subs.forEach(function (s) { if (['horloges', 'geuren', 'verzorging'].indexOf(s.slug) !== -1) s.verborgen = true; });
  hernoem('elektronica', 'Elektronica & Gadgets');
  hernoem('wonen', 'Wonen & Decoratie');
  hernoem('keuken', 'Keuken & Tafelen');
  hernoem('eten-drinken', 'Lekkernijen & Cadeaupakketten', 'Lekkernijen');
  hernoem('sport-outdoor', 'Sport & Outdoor');
  /* Metaaldetectie wordt een eigen groep (stond onder Sport). */
  delete cat('metaaldetectie').onder;
  /* Volgorde van de 15 groepen, Christelijke cadeaus als eigen afdeling erachter. */
  var volgorde = ['sieraden', 'geuren-verzorging', 'mode-beauty', 'elektronica', 'wonen', 'keuken', 'dranken', 'eten-drinken', 'speelgoed', 'hobby', 'sport-outdoor', 'tuin-klussen', 'boeken-media', 'dieren', 'metaaldetectie', 'christelijk', 'noodpakket-survival', 'cadeaus', 'valentijn'];
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
    ['kralen-sieraden-maken', 'Kralen & sieraden maken', 'hobby-kralen-sieraden-maken'], ['modelbouw', 'Modelbouw & miniatuurhuisjes', 'hobby-modelbouw'], ['origami-scrapbooking', 'DIY-pakketten & origami', 'hobby-knutselen'],
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
/* Check-up 01-11-2026: vakje 'Boekenbonnen & abonnementen' heeft nog geen producten -> verbergen tot er iets in staat (anders een lege pagina). */
(function () { var c = window.LK_CAT('boeken-media'); if (c) (c.subs || []).forEach(function (s) { if (s.slug === 'boekenbonnen-abonnementen') s.verborgen = true; }); })();
window.LK_KNOPSETS = {
  wie3: { param: 'wie', titel: 'Voor wie', opties: [['dames', 'Dames', { labels: ['haar'] }], ['heren', 'Heren', { labels: ['hem'] }], ['kinderen', 'Kinderen', { labels: ['kind', 'kinderen', 'baby'] }]] },
  wie2: { param: 'wie', titel: 'Voor wie', opties: [['dames', 'Dames', { labels: ['haar'] }], ['heren', 'Heren', { labels: ['hem'] }]] },
  /* 9-11-2026 (GO Marius): Smartwatches. Zelfde als wie3, maar op de telefoon staat dit rijtje meteen in beeld (niet alleen achter 'Filteren'). */
  wie3snel: { param: 'wie', titel: 'Voor wie', snel: true, opties: [['dames', 'Dames', { labels: ['haar'] }], ['heren', 'Heren', { labels: ['hem'] }], ['kinderen', 'Kinderen', { labels: ['kind', 'kinderen'] }]] },
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
    labels: ['haar'], vakken: ['tag:moederdag', 'mode-sieraden/sieraden', 'beauty-verzorging/parfum', 'beauty-verzorging/wellness', 'wonen/kaarsen-geur', 'eten-drinken/cadeaupakketten', 'wonen/woondecoratie', 'eten-drinken/chocolade-snoep', 'mode-sieraden/accessoires'] /* 1-11-2026 streng: 168 gekeurde cadeaus */ },
  { slug: 'vaderdag', seizoen: ['05-20', '06-21'], uit: LK_GEEN_FEEST, naam: 'Vaderdag', beeld: 'images/sub/sub-cadeaus-voor-hem-2026b.webp', seoTitel: 'Vaderdagcadeau – de leukste cadeaus voor Vaderdag',
    tekst: 'Voor papa: een goede fles, iets voor de BBQ, een gadget of een horloge.',
    labels: ['hem'], vakken: ['tag:vaderdag', 'eten-drinken/sterke-drank', 'eten-drinken/bier', 'elektronica/gadgets', 'sport-outdoor/darts', 'eten-drinken/delicatessen', 'mode-sieraden/horloges', 'wonen/koffie-thee-zetten', 'tuin-klussen/klussen'] /* 1-11-2026 streng: 179 gekeurde cadeaus */ },
  { slug: 'kerst', seizoen: ['11-01', '12-26'], naam: 'Kerst', naar: '/c/cadeaus/kerst', beeld: 'images/sub/sub-cadeaus-kerst-2026b.webp' },
  { slug: 'geboorte', naam: 'Geboorte & kraam', naar: '/voor/baby', beeld: 'images/sub/sub-cadeaus-baby-kraam-2026b.webp' },
  { slug: 'valentijn', seizoen: ['01-15', '02-14'], naam: 'Liefde & Valentijn', naar: '/c/valentijn', beeld: 'images/sub/sub-valentijn-voor-haar.webp' },
  { slug: 'verjaardag', uit: LK_GEEN_FEEST, naam: 'Verjaardag', beeld: 'images/sub/sub-eten-drinken-pakketten.webp', seoTitel: 'Verjaardagscadeau – cadeau voor 18, 30, 40, 50 of 60 jaar', seoKort: 'Verjaardagscadeau',
    tekst: 'Een cadeau voor een verjaardag. Kies hieronder hoe oud hij of zij wordt, of bekijk alles.',
    knoppen: ['jaar'], vakken: LK_ALLE_GROEPEN.concat(['tag:verjaardag']) },
  { slug: 'jubileum', voorWie: ['haar', 'hem', 'opa-oma'], /* 7-11-2026: alleen knopjes die bij deze gelegenheid passen */ uit: /kerst|sinterklaas|advent|\bpiet\b|pakjesavond|halloween|pasen|paas|kraam|baby|voorraad|kat\b|kilo|rakkers/i, naam: 'Trouwen & jubileum', beeld: 'images/sub/sub-valentijn-samen.webp', seoTitel: 'Trouwcadeau, huwelijkscadeau en jubileumcadeau',
    tekst: 'Een bruiloft, een trouwdag of een jubileum: iets persoonlijks, iets om te proosten of iets blijvends.',
    vakken: ['tag:trouwen', 'eten-drinken/bubbels', 'mode-sieraden/sieraden', 'wonen/foto-persoonlijk', 'eten-drinken/cadeaupakketten', 'wonen/kaarsen-geur'] /* 31-10-2026: glazen & servies eruit */ },
  { slug: 'housewarming', voorWie: ['haar', 'hem', 'collega'], /* 7-11-2026: alleen knopjes die bij deze gelegenheid passen */ uit: /kerst|sinterklaas|advent|\bpiet\b|pakjesavond|halloween|pasen|paas|hulst|maretak|pumpkin|minecraft|kinder|baby/i, naam: 'Housewarming', beeld: 'images/sub/sub-wonen-woonaccessoires.webp', seoTitel: 'Housewarming cadeau – cadeau voor een nieuwe woning',
    tekst: 'Iemand gaat verhuizen of heeft een nieuw huis: iets moois voor in huis, een plant of iets om te proosten.',
    vakken: ['tag:housewarming', 'wonen/woondecoratie', 'wonen/kaarsen-geur', 'wonen/verlichting', 'wonen/woontextiel', 'wonen/tafelen', 'eten-drinken/bubbels', 'eten-drinken/cadeaupakketten'], maxPrijs: 75 /* 31-10-2026 strenger */ },
  { slug: 'sinterklaas', seizoen: ['10-15', '12-05'], naam: 'Sinterklaas', naar: '/c/cadeaus/sinterklaas', beeld: 'images/sub/sub-cadeaus-sinterklaas.webp' },
  { slug: 'bedankt', uit: /kerst|sinterklaas|advent|\bpiet\b|pakjesavond|halloween|pasen|paas|kilo|silo|\d{2,3} stuks|mix \(/i, naam: 'Bedankt', beeld: 'images/sub/sub-eten-drinken-pakketten.webp', seoTitel: 'Bedankje – kleine cadeaus om dankjewel te zeggen',
    tekst: 'Een klein gebaar dat groot aankomt: iets lekkers, een kaars, een plantje of een goede fles.', maxPrijs: 25,
    vakken: ['tag:juf-meester', 'eten-drinken/chocolade-snoep', 'wonen/kaarsen-geur', 'eten-drinken/cadeaupakketten', 'beauty-verzorging/bad-douche'] /* 31-10-2026 strenger */ },
  { slug: 'juf-meester', voorWie: ['haar', 'hem'], /* stap 4: alleen juf (haar) of meester (hem) */ seizoen: ['06-10', '07-20'], uit: LK_GEEN_FEEST, naam: 'Juf & meester', beeld: 'images/sub/sub-boeken-media-agendas.webp', seoTitel: 'Cadeau voor de juf of meester – bedankje einde schooljaar',
    tekst: 'Dankjewel zeggen aan de juf of meester: aan het einde van het schooljaar of zomaar.', maxPrijs: 25,
    vakken: ['tag:juf-meester', 'eten-drinken/chocolade-snoep', 'wonen/kaarsen-geur', 'eten-drinken/cadeaupakketten', 'hobby/papier-planners', 'beauty-verzorging/bad-douche'] }, /* 31-10-2026: alleen kleine bedankjes (zie indeling.js) */
  { slug: 'uitdeelcadeautjes', naam: 'Uitdeelcadeautjes', beeld: 'images/sub/sub-eten-drinken-drop-snoep.webp', seoTitel: 'Uitdeelcadeautjes – voor een kinderfeestje of de klas',
    tekst: 'Kleine cadeautjes om uit te delen: voor een kinderfeestje, de klas of in een feestzakje.', maxPrijs: 10,
    labels: ['kind', 'kinderen', 'tiener'], vakken: ['tag:uitdelen', 'speelgoed/hypes-trends', 'speelgoed/knutselen-kleuren', 'speelgoed/pokemon-verzamelkaarten', 'speelgoed/bord-kaartspellen', 'eten-drinken/drop-snoep'] },
  { slug: 'beterschap', voorWie: ['haar', 'hem', 'kinderen', 'opa-oma', 'collega'], /* 7-11-2026: alleen knopjes die bij deze gelegenheid passen */ uit: /kerst|sinterklaas|advent|\bpiet\b|pakjesavond|halloween|pasen|paas|baby|truffel|kilo|silo/i, naam: 'Beterschap & sterkte', beeld: 'images/sub/sub-wonen-plaids-kussens.webp', seoTitel: 'Beterschapscadeau en sterkte cadeau',
    tekst: 'Voor iemand die ziek is of het moeilijk heeft: iets om op te vrolijken of even te troosten.', maxPrijs: 40,
    vakken: ['tag:beterschap', 'eten-drinken/cadeaupakketten', 'eten-drinken/chocolade-snoep', 'beauty-verzorging/bad-douche', 'boeken-media/boeken', 'wonen/woontextiel', 'eten-drinken/koffie-thee-cacao'] /* 31-10-2026 strenger */ },
  { slug: 'geslaagd', voorWie: ['haar', 'hem', 'tieners'], /* 7-11-2026: alleen knopjes die bij deze gelegenheid passen */ seizoen: ['06-01', '07-15'], uit: /kerst|sinterklaas|advent|\bpiet\b|pakjesavond|halloween|pasen|paas|kinder|fortnite|baby|magnum/i, naam: 'Geslaagd & rijbewijs', beeld: 'images/sub/sub-mode-beauty-rugzakken-reistassen.webp', seoTitel: 'Geslaagd cadeau – cadeau voor je diploma of rijbewijs',
    tekst: 'Geslaagd voor het examen of het rijbewijs gehaald: een cadeau om het te vieren.',
    vakken: ['tag:geslaagd', 'mode-sieraden/tassen-portemonnees', 'mode-sieraden/horloges', 'eten-drinken/bubbels', 'elektronica/audio', 'mode-sieraden/sieraden', 'eten-drinken/chocolade-snoep'], maxPrijs: 150 /* 31-10-2026 strenger */ },
  { slug: 'afscheid-pensioen', voorWie: ['collega', 'haar', 'hem', 'opa-oma'], /* 7-11-2026: alleen knopjes die bij deze gelegenheid passen */ uit: LK_GEEN_FEEST, naam: 'Afscheid & pensioen', beeld: 'images/sub/sub-cadeaus-collega-2026b.webp', seoTitel: 'Afscheidscadeau en pensioencadeau',
    tekst: 'Een mooi afscheid van een collega, of een cadeau voor wie met pensioen gaat.', gids: 'afscheidscadeau-collega',
    vakken: ['tag:afscheid', 'wonen/kaarsen-geur', 'eten-drinken/cadeaupakketten', 'eten-drinken/chocolade-snoep', 'eten-drinken/bubbels', 'beauty-verzorging/wellness', 'wonen/foto-persoonlijk', 'eten-drinken/delicatessen'] }, /* 31-10-2026: alleen echte afscheids- en pensioencadeaus (was: alles voor collega/opa-oma) */
  { slug: 'doop-belijdenis', naam: 'Doop & belijdenis', naar: '/c/christelijk/doop-belijdenis', beeld: 'images/sub/sub-christelijk-doop-belijdenis.webp' }
];
/* Gelegenheden in de juiste volgorde voor vandaag: wat nu speelt eerst. */
/* Stap 1 indeling (6-11-2026): eerst wat nu speelt (op datum), dan de gelegenheden van het hele jaar in een vaste volgorde, en de feestdagen buiten hun seizoen helemaal onderaan. */
window.LK_GELEGENHEDEN_NU = function () {
  var d = new Date(), nu = ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
  var speelt = function (g) { if (!g.seizoen) return false; var a = g.seizoen[0], b = g.seizoen[1]; return a <= b ? nu >= a && nu <= b : nu >= a || nu <= b; };
  var l = window.LK_GELEGENHEDEN;
  var VAST = ['verjaardag', 'geboorte', 'jubileum', 'housewarming', 'bedankt', 'afscheid-pensioen', 'beterschap', 'geslaagd', 'juf-meester', 'uitdeelcadeautjes', 'doop-belijdenis'];
  var rang = function (g) { var i = VAST.indexOf(g.slug); return i === -1 ? 99 : i; };
  return l.filter(speelt).sort(function (a, b) { return a.seizoen[1].localeCompare(b.seizoen[1]); })
    .concat(l.filter(function (g) { return !speelt(g) && !g.seizoen; }).sort(function (a, b) { return rang(a) - rang(b); }))
    .concat(l.filter(function (g) { return !speelt(g) && g.seizoen; }));
};
/* Collecties: dwars door alle groepen heen, in de volgorde van zoeken. */
/* Stap 1 indeling (6-11-2026, GO Marius): deze collecties blijven uit menu's en homepage tot ze kloppen (Cadeaubonnen: 1 product; Belevenissen: 9, deels fout; Toppers: 85 van 134 speelgoed). De pagina's zelf blijven bestaan. */
window.LK_COLLECTIE_VERBORGEN = ['cadeaubonnen', 'belevenissen']; /* 6-11-2026: Toppers van nu weer zichtbaar (33 toppers gekozen door Marius) */
window.LK_COLLECTIES = [
  /* Aanbiedingen (5-11-2026, GO Marius): altijd de grootste kortingen van al onze winkels, met bovenaan elke dag 12 'Deals van vandaag'. */
  { slug: 'aanbiedingen', naam: 'Aanbiedingen', kicker: 'Elke dag nieuwe deals', beeld: 'images/collecties/aanbiedingen-rond.webp', seoTitel: 'Aanbiedingen van vandaag – de grootste kortingen van bol, Coolblue en meer',
    tekst: 'De grootste kortingen van al onze winkels op één plek, vanaf 15% korting. Bovenaan staan elke dag 12 andere topdeals.',
    zoek: 'aanbieding aanbiedingen deal deals korting kortingen sale uitverkoop afgeprijsd goedkoop dagdeal', korting: 15, dagdeals: true, vakken: LK_ALLE_GROEPEN },
  /* Kortingscodes & acties (5-11-2026, GO Marius): echte codes van onze winkels (Daisycon-export, zie scripts/codes/daisycon.py). */
  { slug: 'kortingscodes', naam: 'Kortingscodes', kicker: 'Echte codes, geen nep', beeld: 'images/collecties/kortingscodes-rond.webp', seoTitel: 'Kortingscodes en acties – geldige codes van LEGO, CEWE, AllSaints en meer',
    tekst: 'Echte kortingscodes en acties van onze winkels, rechtstreeks van de winkels zelf. Verlopen codes halen we er vanzelf af.',
    zoek: 'kortingscode kortingscodes code codes actiecode couponcode coupon voucher promotiecode gratis verzending', codes: true, vakken: LK_ALLE_GROEPEN },
  /* Black Friday (5-11-2026, GO Marius): alle echte deals van minstens 20% korting, grootste korting eerst. Tot en met Cyber Monday. */
  { slug: 'black-friday', naam: 'Black Friday deals', kicker: 'Deals tot 70% korting', beeld: 'images/collecties/black-friday-rond.webp', seoTitel: 'Black Friday 2026 – de beste deals van bol, Coolblue en meer',
    tekst: 'De beste kortingen van al onze winkels op één plek, allemaal minstens 20% korting. Bovenaan staan de beste deals; kies hieronder je categorie. Black Friday is op vrijdag 27 november.',
    zoek: 'black friday blackfriday cyber monday deals deal aanbieding aanbiedingen korting sale uitverkoop', korting: 20, vakken: LK_ALLE_GROEPEN,
    /* 7-11-2026: veelgestelde vragen (ook als FAQ-gegevens voor Google). */
    faq: [
      ['Wanneer is Black Friday 2026?', 'Black Friday is op vrijdag 27 november 2026. Veel winkels beginnen al eerder met een Black Friday-week, en op maandag 30 november is het Cyber Monday.'],
      ['Zijn de kortingen echt?', 'Wij tonen de van-prijs die de winkel zelf opgeeft. Twijfel je? Kijk dan of het product de weken ervoor ook al zo goedkoop was. Een goede deal is een prijs die je anders niet krijgt, niet alleen een hoog percentage.'],
      ['Hoe kies ik een goede Black Friday-deal?', 'Maak vooraf een lijstje van wat je echt wilt kopen en vergelijk de prijs met andere winkels. Bovenaan deze pagina staan de beste deals: korting op cadeaus waar mensen echt blij mee zijn, niet alleen het hoogste percentage.'],
      ['Kan ik met Black Friday mijn Sinterklaas- en kerstcadeaus kopen?', 'Ja, Black Friday valt precies tussen Sinterklaas en Kerst. Veel mensen kopen dan al hun cadeaus in één keer. Let wel op de levertijd als het cadeau vóór 5 december binnen moet zijn.'],
      ['Waar gaat mijn bestelling heen?', 'Je koopt altijd bij de winkel zelf, zoals bol, Coolblue of HEMA. Daar betaal je, en daar regel je ook bezorging en retour. De prijs bij de winkel is altijd leidend.']
    ] },
  { slug: 'toppers-van-nu', naam: 'Toppers van nu', kicker: 'Hits van dit najaar', beeld: 'images/collecties/toppers-van-nu-rond.webp', seoTitel: 'Populaire cadeaus 2026 – de toppers van nu',
    tekst: 'Per afdeling de drie cadeaus die nu het meest gevraagd zijn, met de hand gekozen.', vakken: ['tag:toppers'] },
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
  /* Adventskalenders (6-11-2026, GO Marius): 33.100 zoekopdrachten per maand. Alle kalenders met tag 'advent', van beauty tot LEGO en chocolade. */
  { slug: 'adventskalenders', naam: 'Adventskalenders', kicker: 'Aftellen tot kerst', beeld: 'images/sub/sub-cadeaus-adventskalenders-2026b.webp', seoTitel: 'Adventskalender 2026 – voor vrouwen, mannen, kinderen en lekkerbekken',
    tekst: 'Elke dag tot kerst een verrassing. Beauty-kalenders, LEGO en speelgoed, chocolade en snoep, thee, en kalenders voor mannen en volwassenen.', zoek: 'adventskalender adventskalenders aftelkalender advent kalender 2026', vakken: ['tag:advent'] },
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

/* Golden Winter Luxury (Nova, 31-10-2026): nieuwe ronde beelden met gouden rand. Staat onderaan, zodat het alles hierboven overschrijft. */
(function () {
  var S = function (n) { return 'images/sub/sub-' + n + '-gw.webp'; };
  function vak(c, s, b) { var C = (window.LK_CATEGORIEEN || []).find(function (x) { return x.slug === c; }); var x = C && (C.subs || []).find(function (y) { return y.slug === s; }); if (x) x.beeld = b; }
  function lijst(l, slug, b) { var x = (l || []).find(function (y) { return y.slug === slug; }); if (x) x.beeld = b; }
  vak('sport-outdoor', 'vissen', S('sport-outdoor-vissen'));
  lijst(window.LK_COLLECTIES, 'cadeaupakketten', S('collectie-cadeaupakketten'));
  vak('tuin-klussen', 'bbq-buitenkoken', S('tuin-klussen-bbq-buitenkoken'));
  vak('sport-outdoor', 'fitness', S('sport-outdoor-fitness'));
  lijst(window.LK_PERSONEN, 'collega', S('voor-collega'));
  vak('cadeaus', 'collega', S('voor-collega'));
  vak('geuren-verzorging', 'huidverzorging', S('geuren-verzorging-huidverzorging'));
  lijst(window.LK_PERSONEN, 'baby', S('voor-baby'));
  vak('cadeaus', 'baby-kraam', S('voor-baby'));
  lijst(window.LK_GELEGENHEDEN, 'afscheid-pensioen', S('gelegenheid-afscheid-pensioen'));
  vak('boeken-media', 'films-series', S('boeken-media-films-series'));
  vak('tuin-klussen', 'elektrisch-gereedschap', S('tuin-klussen-elektrisch-gereedschap'));
  lijst(window.LK_PERSONEN, 'hem', S('voor-hem'));
  vak('cadeaus', 'voor-hem', S('voor-hem'));
  lijst(window.LK_PERSONEN, 'tieners', S('voor-tieners'));
  lijst(window.LK_PERSONEN, 'haar', S('voor-haar'));
  vak('cadeaus', 'voor-haar', S('voor-haar'));
  vak('sport-outdoor', 'wandelen', S('sport-outdoor-wandelen'));
  vak('keuken', 'pannen', S('keuken-pannen'));
  lijst(window.LK_COLLECTIES, 'persoonlijke-cadeaus', S('collectie-persoonlijke-cadeaus'));
  vak('metaaldetectie', 'detectors', S('metaaldetectie-detectors'));
  vak('keuken', 'keukenapparaten', S('keuken-keukenapparaten'));
  lijst(window.LK_GELEGENHEDEN, 'geboorte', S('gelegenheid-geboorte'));
  vak('elektronica', 'gadgets-trackers', S('elektronica-gadgets-trackers'));
  vak('elektronica', 'cameras', S('elektronica-cameras'));
  vak('tuin-klussen', 'handgereedschap-werkplaats', S('tuin-klussen-handgereedschap-werkplaats'));
  lijst(window.LK_PERSONEN, 'opa-oma', S('voor-opa-oma'));
  vak('cadeaus', 'opa-oma', S('voor-opa-oma'));
  lijst(window.LK_GELEGENHEDEN, 'vaderdag', S('gelegenheid-vaderdag'));
  lijst(window.LK_GELEGENHEDEN, 'housewarming', S('gelegenheid-housewarming'));
  vak('sport-outdoor', 'kamperen', S('sport-outdoor-kamperen'));
  vak('metaaldetectie', 'pinpointers-uitrusting', S('metaaldetectie-pinpointers-uitrusting'));
  lijst(window.LK_COLLECTIES, 'originele-cadeaus', S('collectie-originele-cadeaus'));
  vak('elektronica', 'koptelefoons', S('elektronica-koptelefoons'));
  lijst(window.LK_GELEGENHEDEN, 'moederdag', S('gelegenheid-moederdag'));
  vak('speelgoed', 'bord-kaartspellen', S('speelgoed-bord-kaartspellen'));
  var D = (window.LK_CATEGORIEEN || []).find(function (x) { return x.slug === 'dieren'; }); if (D) D.tegel = 'images/categorieen/categorie-dieren-gw.webp';
  lijst(window.LK_PERSONEN, 'kinderen', S('voor-kinderen'));
  vak('cadeaus', 'voor-kinderen', S('voor-kinderen'));
  /* 1-11-2026: Baby & kraam-vakjes van Nova */
  function psub(p, slug, b) { var P = (window.LK_PERSONEN || []).find(function (x) { return x.slug === p; }); var x = P && (P.subs || []).find(function (y) { return y.slug === slug; }); if (x) x.beeld = b; }
  psub('baby', 'kraamcadeaus', S('voor-baby-kraamcadeaus'));
  psub('baby', 'babyshower', S('voor-baby-babyshower'));
  /* 1-11-2026 (2): categoriekaarten, banners en Voor wie-vakjes van Nova */
  function cg(slug, k, v) { var C = (window.LK_CATEGORIEEN || []).find(function (x) { return x.slug === slug; }); if (C) C[k] = v; }
  ['boeken-media', 'christelijk', 'metaaldetectie'].forEach(function (n) { cg(n, 'tegel', 'images/categorieen/categorie-' + n + '-gw.webp'); });
  ['dranken', 'elektronica', 'geuren-verzorging', 'keuken', 'mode-beauty', 'wonen'].forEach(function (n) { cg(n, 'banner', 'images/banners/banner-cat-' + n + '-gw.webp'); });
  psub('tieners', 'sieraden', S('voor-tieners-sieraden'));
  psub('tieners', 'spellen-puzzels', S('voor-tieners-spellen-puzzels'));
  psub('tieners', 'metaaldetectie', S('voor-tieners-metaaldetectie'));
  psub('collega', 'lootjes', S('voor-collega-lootjes'));
  /* 1-11-2026 (3): banners, Tuin-kaart en vakjes Sieraden, Parfum en Mode */
  ['boeken-media', 'christelijk', 'dieren', 'eten-drinken', 'hobby', 'metaaldetectie', 'sieraden', 'speelgoed', 'sport-outdoor', 'tuin-klussen'].forEach(function (n) { cg(n, 'banner', 'images/banners/banner-cat-' + n + '-gw.webp'); });
  cg('tuin-klussen', 'tegel', 'images/categorieen/categorie-tuin-klussen-gw.webp');
  ['ringen', 'horloges', 'echt-goud', 'oorbellen', 'kettingen', 'zilver', 'armbanden', 'met-naam'].forEach(function (n) { vak('sieraden', n, S('sieraden-' + n)); });
  vak('geuren-verzorging', 'parfum', S('geuren-verzorging-parfum'));
  vak('mode-beauty', 'schoenen', S('mode-beauty-schoenen'));
  vak('mode-beauty', 'tassen', S('mode-beauty-tassen'));
  vak('mode-beauty', 'truien-hoodies', S('mode-beauty-truien-hoodies'));
  /* 1-11-2026 (4): 41 vakjes (Wonen, Keuken, Dranken, Lekkernijen, Elektronica, Mode) */
  vak('dranken', 'alcoholvrij', S('dranken-alcoholvrij'));
  vak('dranken', 'bier', S('dranken-bier'));
  vak('dranken', 'champagne-bubbels', S('dranken-champagne-bubbels'));
  vak('dranken', 'cognac', S('dranken-cognac'));
  vak('dranken', 'gin-cocktails', S('dranken-gin-cocktails'));
  vak('dranken', 'jenever', S('dranken-jenever'));
  vak('dranken', 'likeuren', S('dranken-likeuren'));
  vak('dranken', 'rum', S('dranken-rum'));
  vak('dranken', 'sake', S('dranken-sake'));
  vak('dranken', 'tequila', S('dranken-tequila'));
  vak('dranken', 'whisky', S('dranken-whisky'));
  vak('dranken', 'wijn-port', S('dranken-wijn-port'));
  vak('dranken', 'wijnaccessoires', S('dranken-wijnaccessoires'));
  vak('dranken', 'wodka', S('dranken-wodka'));
  vak('elektronica', 'gaming', S('elektronica-gaming'));
  vak('elektronica', 'telefoon-opladen', S('elektronica-telefoon-opladen'));
  vak('eten-drinken', 'chocolade', S('eten-drinken-chocolade'));
  vak('eten-drinken', 'koekjes-stroopwafels', S('eten-drinken-koekjes-stroopwafels'));
  vak('keuken', 'airfryers', S('keuken-airfryers'));
  vak('keuken', 'bakken', S('keuken-bakken'));
  vak('keuken', 'drinkflessen-lunch', S('keuken-drinkflessen-lunch'));
  vak('keuken', 'gezellig-tafelen', S('keuken-gezellig-tafelen'));
  vak('keuken', 'glazen-servies', S('keuken-glazen-servies'));
  vak('keuken', 'kaas-serveerplanken', S('keuken-kaas-serveerplanken'));
  vak('keuken', 'koffie-thee', S('keuken-koffie-thee'));
  vak('keuken', 'messen-snijplanken', S('keuken-messen-snijplanken'));
  vak('keuken', 'tosti-wafel-ijs', S('keuken-tosti-wafel-ijs'));
  vak('keuken', 'voorraadpotten', S('keuken-voorraadpotten'));
  vak('mode-beauty', 'riemen-sleutelhangers', S('mode-beauty-riemen-sleutelhangers'));
  vak('mode-beauty', 'rugzakken', S('mode-beauty-rugzakken'));
  vak('wonen', 'deurmatten', S('wonen-deurmatten'));
  vak('wonen', 'fotolijsten', S('wonen-fotolijsten'));
  vak('wonen', 'huisgeuren', S('wonen-huisgeuren'));
  vak('wonen', 'kaarsen', S('wonen-kaarsen'));
  vak('wonen', 'kerst', S('wonen-kerst'));
  vak('wonen', 'kussens-plaids', S('wonen-kussens-plaids'));
  vak('wonen', 'lampen', S('wonen-lampen'));
  vak('wonen', 'opbergen-dienbladen', S('wonen-opbergen-dienbladen'));
  vak('wonen', 'spiegels', S('wonen-spiegels'));
  vak('wonen', 'vloerkleden', S('wonen-vloerkleden'));
  vak('wonen', 'wanddecoratie', S('wonen-wanddecoratie'));
})();

/* ===== 3.0 NIEUWE BOOM (4-11-2026, GO Marius): 12 afdelingen > groepen > vakjes. GEMAAKT DOOR scripts/boom/maak-data.py – niet met de hand bewerken.
   Oude afdelingen en vakjes staan er verborgen in met "naar": hun oude adres stuurt door naar de nieuwe plek. ===== */
window.LK_CATEGORIEEN = [{"slug": "speelgoed", "naam": "Speelgoed & spellen", "kort": "Speelgoed", "icoon": "beer", "tegel": "images/categorieen/categorie-speelgoed-gw.webp", "banner": "images/banners/banner-cat-speelgoed-gw.webp", "subs": [{"slug": "baby-peuter", "naam": "Baby & peuter", "vakjes": [{"slug": "badspeelgoed", "naam": "Badspeelgoed"}, {"slug": "stapelen-sorteren", "naam": "Stapelen & sorteren"}, {"slug": "rammelaars-bijtringen", "naam": "Rammelaars & bijtringen"}, {"slug": "loopwagens-duwspeelgoed", "naam": "Loopwagens & duwspeelgoed"}, {"slug": "babygyms-activiteitenspeelgoed", "naam": "Babygyms & activiteitenspeelgoed"}]}, {"slug": "bouwen", "naam": "Bouwen", "vakjes": [{"slug": "lego", "naam": "LEGO"}, {"slug": "knikkerbanen", "naam": "Knikkerbanen"}, {"slug": "lego-duplo", "naam": "LEGO Duplo"}, {"slug": "magnetisch-bouwen", "naam": "Magnetisch bouwen"}, {"slug": "andere-bouwstenen", "naam": "Andere bouwstenen"}]}, {"slug": "poppen-knuffels", "naam": "Poppen & knuffels", "vakjes": [{"slug": "knuffels", "naam": "Knuffels"}, {"slug": "squishmallows", "naam": "Squishmallows"}, {"slug": "poppenhuizen-accessoires", "naam": "Poppenhuizen & accessoires"}, {"slug": "babypoppen", "naam": "Babypoppen"}, {"slug": "modepoppen", "naam": "Modepoppen"}]}, {"slug": "speelfiguren-voertuigen", "naam": "Speelfiguren & voertuigen", "vakjes": [{"slug": "speelgoedauto-s-garages", "naam": "Speelgoedauto's & garages"}, {"slug": "playmobil", "naam": "Playmobil", "beeld": "images/sub/sub-speelgoed-playmobil-w.webp", "oud": "speelgoed/playmobil"}, {"slug": "actiefiguren-superhelden", "naam": "Actiefiguren & superhelden"}, {"slug": "racebanen-treinen", "naam": "Racebanen & treinen"}, {"slug": "radiografisch-bestuurbaar", "naam": "Radiografisch bestuurbaar"}, {"slug": "dieren-dinofiguren", "naam": "Dieren- & dinofiguren"}], "beeld": "images/sub/sub-speelgoed-playmobil-w.webp"}, {"slug": "rollenspel-verkleden", "naam": "Rollenspel & verkleden", "vakjes": [{"slug": "verkleedkleding", "naam": "Verkleedkleding"}, {"slug": "speelkeukens-winkeltjes", "naam": "Speelkeukens & winkeltjes"}, {"slug": "gereedschap-dokterssets", "naam": "Gereedschap & dokterssets"}]}, {"slug": "knutselen", "naam": "Knutselen", "vakjes": [{"slug": "tekenen-kleuren", "naam": "Tekenen & kleuren"}, {"slug": "strijkkralen-sieraden-maken", "naam": "Strijkkralen & sieraden maken"}, {"slug": "klei-slijm", "naam": "Klei & slijm"}, {"slug": "knutselsets", "naam": "Knutselsets"}]}, {"slug": "leren-ontdekken", "naam": "Leren & ontdekken", "vakjes": [{"slug": "muziekspeelgoed-karaoke", "naam": "Muziekspeelgoed & karaoke", "beeld": "images/sub/sub-speelgoed-muziek-karaoke.webp", "oud": "speelgoed/muziek-karaoke"}, {"slug": "programmeren-robots", "naam": "Programmeren & robots"}, {"slug": "microscopen-telescopen", "naam": "Microscopen & telescopen"}, {"slug": "experimenteren-wetenschap", "naam": "Experimenteren & wetenschap"}, {"slug": "tiptoi-leersystemen", "naam": "Tiptoi & leersystemen"}, {"slug": "luisterboxen-toniebox", "naam": "Luisterboxen (Toniebox)"}], "beeld": "images/sub/sub-speelgoed-muziek-karaoke.webp"}, {"slug": "buiten-spelen", "naam": "Buiten spelen", "vakjes": [{"slug": "zand-water", "naam": "Zand & water"}, {"slug": "trampolines-speeltoestellen", "naam": "Trampolines & speeltoestellen"}, {"slug": "steps-loopfietsen", "naam": "Steps & loopfietsen"}, {"slug": "buitenspellen-ballen", "naam": "Buitenspellen & ballen"}]}, {"slug": "spellen", "naam": "Spellen", "vakjes": [{"slug": "verzamelkaarten-pokemon", "naam": "Verzamelkaarten (Pokémon)", "beeld": "images/sub/sub-speelgoed-pokemon-verzamelkaarten-w.webp", "oud": "speelgoed/pokemon-verzamelkaarten"}, {"slug": "escape-room-breinbrekers", "naam": "Escape room & breinbrekers"}, {"slug": "kinderspellen", "naam": "Kinderspellen"}, {"slug": "kaart-dobbelspellen", "naam": "Kaart- & dobbelspellen"}, {"slug": "partyspellen", "naam": "Partyspellen"}, {"slug": "strategiespellen", "naam": "Strategiespellen"}, {"slug": "bordspellen-voor-het-gezin", "naam": "Bordspellen voor het gezin"}], "beeld": "images/sub/sub-speelgoed-pokemon-verzamelkaarten-w.webp"}, {"slug": "puzzels", "naam": "Puzzels", "vakjes": [{"slug": "legpuzzels", "naam": "Legpuzzels"}, {"slug": "3d-puzzels", "naam": "3D-puzzels"}, {"slug": "kinderpuzzels", "naam": "Kinderpuzzels"}]}, {"slug": "lego", "naam": "LEGO", "verborgen": true, "naar": "/c/speelgoed/bouwen"}, {"slug": "buitenspeelgoed", "naam": "Buitenspeelgoed", "verborgen": true, "naar": "/c/speelgoed/buiten-spelen"}, {"slug": "bord-kaartspellen", "naam": "Bord- & kaartspellen", "verborgen": true, "naar": "/c/speelgoed/spellen"}, {"slug": "pokemon-verzamelkaarten", "naam": "Pokémon & verzamelkaarten", "verborgen": true, "naar": "/c/speelgoed/spellen/verzamelkaarten-pokemon"}, {"slug": "poppen-barbie", "naam": "Poppen & Barbie", "verborgen": true, "naar": "/c/speelgoed/poppen-knuffels"}, {"slug": "playmobil", "naam": "Playmobil", "verborgen": true, "naar": "/c/speelgoed/speelfiguren-voertuigen/playmobil"}, {"slug": "autos-treinen-rc", "naam": "Auto's, treinen & RC", "verborgen": true, "naar": "/c/speelgoed/speelfiguren-voertuigen"}, {"slug": "knuffels-squishmallows", "naam": "Knuffels & Squishmallows", "verborgen": true, "naar": "/c/speelgoed/poppen-knuffels"}, {"slug": "knikkerbanen-magnetisch", "naam": "Knikkerbanen & magnetisch bouwen", "verborgen": true, "naar": "/c/speelgoed/bouwen"}, {"slug": "knutselen-kleuren", "naam": "Knutselen & kleuren", "verborgen": true, "naar": "/c/speelgoed/knutselen"}, {"slug": "hypes-trends", "naam": "Hypes & trends", "verborgen": true, "naar": "/collectie/toppers-van-nu"}, {"slug": "baby-houten", "naam": "Baby- & houten speelgoed", "verborgen": true, "naar": "/c/speelgoed/baby-peuter"}, {"slug": "speelkeukens-verkleden", "naam": "Speelkeukens & verkleden", "verborgen": true, "naar": "/c/speelgoed/rollenspel-verkleden"}, {"slug": "muziek-karaoke", "naam": "Muziek & karaoke", "verborgen": true, "naar": "/c/speelgoed/leren-ontdekken/muziekspeelgoed-karaoke"}, {"slug": "figuren-voertuigen", "naam": "Figuren & voertuigen", "verborgen": true, "naar": "/c/speelgoed/speelfiguren-voertuigen"}, {"slug": "bordspellen", "naam": "Bord- & tafelspellen", "verborgen": true, "naar": "/c/speelgoed/spellen"}, {"slug": "kaartspellen", "naam": "Kaart- & dobbelspellen", "verborgen": true, "naar": "/c/speelgoed/spellen"}], "tekst": "Spelen, ontdekken en groeien.", "knoppen": ["kind", "leeftijd"]}, {"slug": "elektronica", "naam": "Elektronica & gaming", "kort": "Elektronica", "icoon": "koptelefoon", "tegel": "images/categorieen/categorie-elektronica-gw.webp", "banner": "images/banners/banner-cat-elektronica-gw.webp", "subs": [{"slug": "audio", "naam": "Audio", "vakjes": [{"slug": "platenspelers", "naam": "Platenspelers", "beeld": "images/sub/sub-elektronica-platenspelers-w.webp", "oud": "elektronica/platenspelers"}, {"slug": "radio-s", "naam": "Radio's", "tekst": "Wekkerradio's, DAB+, retro en internetradio's: voor in de slaapkamer, keuken of woonkamer."}, {"slug": "koptelefoons", "naam": "Koptelefoons"}, {"slug": "oordopjes", "naam": "Oordopjes"}, {"slug": "bluetooth-speakers", "naam": "Bluetooth-speakers"}], "beeld": "images/sub/sub-elektronica-platenspelers-w.webp"}, {"slug": "gaming", "naam": "Gaming", "vakjes": [{"slug": "controllers-accessoires", "naam": "Controllers & accessoires"}, {"slug": "gamestoelen", "naam": "Gamestoelen"}, {"slug": "consoles", "naam": "Consoles"}, {"slug": "vr-brillen", "naam": "VR-brillen"}, {"slug": "games", "naam": "Games"}, {"slug": "gaming-headsets", "naam": "Gaming-headsets"}]}, {"slug": "smartwatches", "naam": "Smartwatches", "vakjes": [{"slug": "activity-trackers", "naam": "Activity trackers"}, {"slug": "smartwatches", "naam": "Smartwatches"}]}, {"slug": "foto-video", "naam": "Foto & video", "vakjes": [{"slug": "camera-s-instant-camera-s", "naam": "Camera's & instant camera's"}, {"slug": "drones", "naam": "Drones"}, {"slug": "actioncam-s", "naam": "Actioncam's"}]}, {"slug": "tablets-e-readers", "naam": "Tablets & e-readers", "vakjes": [{"slug": "tablets", "naam": "Tablets"}, {"slug": "e-readers", "naam": "E-readers", "beeld": "images/sub/sub-boeken-media-e-readers-w.webp", "oud": "boeken-media/e-readers"}, {"slug": "powerbanks-opladers", "naam": "Powerbanks & opladers"}, {"slug": "telefoonaccessoires", "naam": "Telefoonaccessoires"}], "beeld": "images/sub/sub-boeken-media-e-readers-w.webp"}, {"slug": "tv-beeld", "naam": "Tv & beeld", "vakjes": [{"slug": "beamers", "naam": "Beamers", "beeld": "images/sub/sub-elektronica-beamers-w.webp", "oud": "elektronica/beamers"}, {"slug": "televisies", "naam": "Televisies"}, {"slug": "soundbars", "naam": "Soundbars"}], "beeld": "images/sub/sub-elektronica-beamers-w.webp"}, {"slug": "slim-wonen", "naam": "Slim wonen", "vakjes": [{"slug": "robotstofzuigers", "naam": "Robotstofzuigers"}, {"slug": "slimme-lampen-sfeerlicht", "naam": "Slimme lampen & sfeerlicht"}, {"slug": "slimme-speakers", "naam": "Slimme speakers"}]}, {"slug": "gadgets", "naam": "Gadgets", "vakjes": [{"slug": "handige-gadgets", "naam": "Handige gadgets"}, {"slug": "fun-retro-gadgets", "naam": "Fun & retro gadgets"}]}, {"slug": "telefoon-opladen", "naam": "Telefoon & opladen", "verborgen": true, "naar": "/c/elektronica/tablets-e-readers"}, {"slug": "cameras", "naam": "Camera's", "verborgen": true, "naar": "/c/elektronica/foto-video"}, {"slug": "koptelefoons", "naam": "Koptelefoons & oordopjes", "verborgen": true, "naar": "/c/elektronica/audio"}, {"slug": "tablets-ereaders", "naam": "Tablets & e-readers", "verborgen": true, "naar": "/c/elektronica/tablets-e-readers"}, {"slug": "drones-vr", "naam": "Drones & VR", "verborgen": true, "naar": "/c/elektronica/foto-video/drones"}, {"slug": "platenspelers", "naam": "Platenspelers", "verborgen": true, "naar": "/c/elektronica/audio/platenspelers"}, {"slug": "gadgets-trackers", "naam": "Gadgets & trackers", "verborgen": true, "naar": "/c/elektronica/gadgets"}, {"slug": "speakers", "naam": "Speakers", "verborgen": true, "naar": "/c/elektronica/audio"}, {"slug": "beamers", "naam": "Beamers", "verborgen": true, "naar": "/c/elektronica/tv-beeld/beamers"}, {"slug": "sfeerlicht-smarthome", "naam": "Sfeerlicht & smart home", "verborgen": true, "naar": "/c/elektronica/slim-wonen"}, {"slug": "slimme-gadgets", "naam": "Slimme gadgets", "verborgen": true, "naar": "/c/elektronica/gadgets"}, {"slug": "telefoon", "naam": "Telefoon", "verborgen": true, "naar": "/c/elektronica/tablets-e-readers"}], "tekst": "Slimme gadgets voor elke dag."}, {"slug": "mode-sieraden", "naam": "Mode & sieraden", "kort": "Mode & sieraden", "icoon": "ring", "tegel": "images/categorieen/categorie-sieraden-gw.webp", "banner": "images/banners/banner-cat-sieraden-gw.webp", "subs": [{"slug": "sieraden", "naam": "Sieraden", "vakjes": [{"slug": "oorbellen", "naam": "Oorbellen", "beeld": "images/sub/sub-sieraden-oorbellen-gw.webp", "oud": "sieraden/oorbellen"}, {"slug": "kettingen", "naam": "Kettingen", "beeld": "images/sub/sub-sieraden-kettingen-gw.webp", "oud": "sieraden/kettingen"}, {"slug": "ringen", "naam": "Ringen", "beeld": "images/sub/sub-sieraden-ringen-gw.webp", "oud": "sieraden/ringen"}, {"slug": "armbanden", "naam": "Armbanden", "beeld": "images/sub/sub-sieraden-armbanden-gw.webp", "oud": "sieraden/armbanden"}, {"slug": "bedels", "naam": "Bedels", "beeld": "images/sub/sub-sieraden-bedels-w.webp", "oud": "sieraden/bedels"}, {"slug": "sieraden-met-naam", "naam": "Sieraden met naam", "beeld": "images/sub/sub-sieraden-met-naam-gw.webp", "oud": "sieraden/met-naam"}, {"slug": "sieradendozen", "naam": "Sieradendozen", "beeld": "images/sub/sub-sieraden-sieradendozen-w.webp", "oud": "sieraden/sieradendozen"}], "beeld": "images/sub/sub-sieraden-oorbellen-gw.webp"}, {"slug": "horloges", "naam": "Horloges", "vakjes": [{"slug": "dameshorloges", "naam": "Dameshorloges"}, {"slug": "herenhorloges", "naam": "Herenhorloges"}]}, {"slug": "tassen-portemonnees", "naam": "Tassen & portemonnees", "vakjes": [{"slug": "koffers-reistassen", "naam": "Koffers & reistassen", "beeld": "images/sub/sub-mode-beauty-koffers-w.webp", "oud": "mode-beauty/koffers"}, {"slug": "portemonnees-pasjeshouders", "naam": "Portemonnees & pasjeshouders", "beeld": "images/sub/sub-mode-beauty-portemonnees-w.webp", "oud": "mode-beauty/portemonnees"}, {"slug": "handtassen", "naam": "Handtassen"}, {"slug": "rugzakken", "naam": "Rugzakken", "beeld": "images/sub/sub-mode-beauty-rugzakken-gw.webp", "oud": "mode-beauty/rugzakken"}, {"slug": "reisaccessoires", "naam": "Reisaccessoires", "beeld": "images/sub/sub-sport-outdoor-reizen.webp", "oud": "sport-outdoor/reizen"}, {"slug": "toilettassen", "naam": "Toilettassen", "beeld": "images/sub/sub-mode-beauty-toilettassen-w.webp", "oud": "mode-beauty/toilettassen"}], "beeld": "images/sub/sub-mode-beauty-koffers-w.webp"}, {"slug": "accessoires", "naam": "Accessoires", "vakjes": [{"slug": "zonnebrillen", "naam": "Zonnebrillen", "beeld": "images/sub/sub-mode-beauty-zonnebrillen-w.webp", "oud": "mode-beauty/zonnebrillen"}, {"slug": "riemen-petten", "naam": "Riemen & petten"}, {"slug": "sleutelhangers", "naam": "Sleutelhangers"}, {"slug": "sjaals-mutsen", "naam": "Sjaals & mutsen"}, {"slug": "handschoenen", "naam": "Handschoenen"}], "beeld": "images/sub/sub-mode-beauty-zonnebrillen-w.webp"}, {"slug": "kleding", "naam": "Kleding", "vakjes": [{"slug": "kersttruien", "naam": "Kersttruien", "seoTitel": "Kersttrui kopen: foute, grappige en nette kersttruien", "seoTekst": "Kersttruien voor dames, heren en kinderen: foute kersttruien met een grap, truien met Harry Potter, Star Wars, Stitch en Pokémon, en nette truien voor het kerstdiner. Met de hand gekozen bij Nederlandse winkels."}, {"slug": "truien-hoodies", "naam": "Truien & hoodies", "beeld": "images/sub/sub-mode-beauty-truien-hoodies-gw.webp", "oud": "mode-beauty/truien-hoodies"}, {"slug": "pyjama-s-badjassen", "naam": "Pyjama's & badjassen", "beeld": "images/sub/sub-mode-beauty-pyjamas-w.webp", "oud": "mode-beauty/pyjamas"}, {"slug": "sokken", "naam": "Sokken"}, {"slug": "t-shirts-met-print", "naam": "T-shirts met print"}], "beeld": "images/sub/sub-mode-beauty-truien-hoodies-gw.webp"}, {"slug": "schoenen-sloffen", "naam": "Schoenen & sloffen", "vakjes": [{"slug": "laarzen-boots", "naam": "Laarzen & boots"}, {"slug": "sneakers", "naam": "Sneakers"}, {"slug": "pantoffels-sloffen", "naam": "Pantoffels & sloffen"}]}], "knoppen": ["wie3"]}, {"slug": "beauty-verzorging", "naam": "Beauty & verzorging", "kort": "Beauty", "icoon": "tas", "tegel": "images/categorieen/categorie-geuren-verzorging-gw.webp", "banner": "images/banners/banner-cat-geuren-verzorging-gw.webp", "subs": [{"slug": "parfum", "naam": "Parfum", "vakjes": [{"slug": "herenparfum", "naam": "Herenparfum"}, {"slug": "damesparfum", "naam": "Damesparfum"}, {"slug": "parfumsets", "naam": "Parfumsets"}]}, {"slug": "giftsets", "naam": "Giftsets", "vakjes": [{"slug": "giftsets-voor-haar", "naam": "Giftsets voor haar"}, {"slug": "giftsets-voor-hem", "naam": "Giftsets voor hem"}]}, {"slug": "bad-douche", "naam": "Bad & douche", "vakjes": [{"slug": "bruisballen", "naam": "Bruisballen"}, {"slug": "bad-doucheproducten", "naam": "Bad- & doucheproducten"}]}, {"slug": "huid-gezicht", "naam": "Huid & gezicht", "vakjes": [{"slug": "gezichtsverzorging", "naam": "Gezichtsverzorging"}, {"slug": "lichaamsverzorging", "naam": "Lichaamsverzorging"}]}, {"slug": "make-up-nagels", "naam": "Make-up & nagels", "vakjes": [{"slug": "make-up", "naam": "Make-up"}, {"slug": "nagels", "naam": "Nagels"}]}, {"slug": "haar", "naam": "Haar", "vakjes": [{"slug": "haarverzorging", "naam": "Haarverzorging"}, {"slug": "fohns-stijltangen", "naam": "Föhns & stijltangen", "beeld": "images/sub/sub-geuren-verzorging-haarstylers-w.webp", "oud": "geuren-verzorging/haarstylers"}], "beeld": "images/sub/sub-geuren-verzorging-haarstylers-w.webp"}, {"slug": "scheren-baard", "naam": "Scheren & baard", "vakjes": [{"slug": "scheerapparaten-trimmers", "naam": "Scheerapparaten & trimmers"}, {"slug": "baardverzorging", "naam": "Baardverzorging"}]}, {"slug": "mond-tanden", "naam": "Mond & tanden", "vakjes": [{"slug": "elektrische-tandenborstels", "naam": "Elektrische tandenborstels"}, {"slug": "monddouches-flossers", "naam": "Monddouches & flossers"}]}, {"slug": "wellness", "naam": "Wellness", "vakjes": [{"slug": "massage", "naam": "Massage"}, {"slug": "spa-ontspanning", "naam": "Spa & ontspanning"}]}], "knoppen": ["wie2"]}, {"slug": "wonen", "naam": "Wonen & koken", "kort": "Wonen & koken", "icoon": "huis", "tegel": "images/categorieen/categorie-wonen-gw.webp", "banner": "images/banners/banner-cat-wonen-gw.webp", "subs": [{"slug": "woondecoratie", "naam": "Woondecoratie", "vakjes": [{"slug": "spiegels", "naam": "Spiegels", "beeld": "images/sub/sub-wonen-spiegels-gw.webp", "oud": "wonen/spiegels"}, {"slug": "wanddecoratie-posters", "naam": "Wanddecoratie & posters", "beeld": "images/sub/sub-wonen-wanddecoratie-gw.webp", "oud": "wonen/wanddecoratie"}, {"slug": "opbergen-dienbladen", "naam": "Opbergen & dienbladen", "beeld": "images/sub/sub-wonen-opbergen-dienbladen-gw.webp", "oud": "wonen/opbergen-dienbladen"}, {"slug": "vazen", "naam": "Vazen", "beeld": "images/sub/sub-wonen-vazen-bloemen-w.webp", "oud": "wonen/vazen-bloemen"}, {"slug": "klokken", "naam": "Klokken", "beeld": "images/sub/sub-wonen-klokken-w.webp", "oud": "wonen/klokken"}, {"slug": "beelden-decoratie", "naam": "Beelden & decoratie"}], "beeld": "images/sub/sub-wonen-spiegels-gw.webp"}, {"slug": "kaarsen-geur", "naam": "Kaarsen & geur", "vakjes": [{"slug": "huisgeuren-geurstokjes", "naam": "Huisgeuren & geurstokjes", "beeld": "images/sub/sub-wonen-huisgeuren-gw.webp", "oud": "wonen/huisgeuren"}, {"slug": "kaarsen", "naam": "Kaarsen"}, {"slug": "geurkaarsen", "naam": "Geurkaarsen"}, {"slug": "kandelaars-lantaarns", "naam": "Kandelaars & lantaarns"}], "beeld": "images/sub/sub-wonen-huisgeuren-gw.webp"}, {"slug": "verlichting", "naam": "Verlichting", "vakjes": [{"slug": "tafellampen", "naam": "Tafellampen"}, {"slug": "lichtsnoeren", "naam": "Lichtsnoeren"}, {"slug": "sfeerlampen", "naam": "Sfeerlampen"}]}, {"slug": "woontextiel", "naam": "Woontextiel", "vakjes": [{"slug": "vloerkleden", "naam": "Vloerkleden", "beeld": "images/sub/sub-wonen-vloerkleden-gw.webp", "oud": "wonen/vloerkleden"}, {"slug": "kussens", "naam": "Kussens"}, {"slug": "kruiken-warmte", "naam": "Kruiken & warmte"}, {"slug": "plaids", "naam": "Plaids"}, {"slug": "deurmatten", "naam": "Deurmatten", "beeld": "images/sub/sub-wonen-deurmatten-gw.webp", "oud": "wonen/deurmatten"}], "beeld": "images/sub/sub-wonen-vloerkleden-gw.webp"}, {"slug": "foto-persoonlijk", "naam": "Foto & persoonlijk", "vakjes": [{"slug": "fotolijsten", "naam": "Fotolijsten", "beeld": "images/sub/sub-wonen-fotolijsten-gw.webp", "oud": "wonen/fotolijsten"}, {"slug": "fotoboeken", "naam": "Fotoboeken"}, {"slug": "foto-op-canvas-glas", "naam": "Foto op canvas & glas"}], "beeld": "images/sub/sub-wonen-fotolijsten-gw.webp"}, {"slug": "kerstdecoratie", "naam": "Kerstdecoratie", "vakjes": [{"slug": "kerstbomen-kransen", "naam": "Kerstbomen & kransen"}, {"slug": "kerstballen-hangers", "naam": "Kerstballen & hangers"}, {"slug": "kerstverlichting", "naam": "Kerstverlichting"}, {"slug": "kerstfiguren", "naam": "Kerstfiguren"}]}, {"slug": "koken-bakken", "naam": "Koken & bakken", "vakjes": [{"slug": "pannen-messen", "naam": "Pannen & messen", "beeld": "images/sub/sub-keuken-pannen-gw.webp", "oud": "keuken/pannen"}, {"slug": "opbergen-voorraadpotten", "naam": "Opbergen & voorraadpotten", "beeld": "images/sub/sub-keuken-voorraadpotten-gw.webp", "oud": "keuken/voorraadpotten"}, {"slug": "airfryers", "naam": "Airfryers", "beeld": "images/sub/sub-keuken-airfryers-gw.webp", "oud": "keuken/airfryers"}, {"slug": "drinkflessen-lunchboxen", "naam": "Drinkflessen & lunchboxen", "beeld": "images/sub/sub-keuken-drinkflessen-lunch-gw.webp", "oud": "keuken/drinkflessen-lunch"}, {"slug": "keukenapparaten", "naam": "Keukenapparaten", "beeld": "images/sub/sub-keuken-keukenapparaten-gw.webp", "oud": "keuken/keukenapparaten"}, {"slug": "bakken", "naam": "Bakken", "beeld": "images/sub/sub-keuken-bakken-gw.webp", "oud": "keuken/bakken"}], "beeld": "images/sub/sub-keuken-pannen-gw.webp"}, {"slug": "koffie-thee-zetten", "naam": "Koffie & thee zetten", "vakjes": [{"slug": "koffiemachines", "naam": "Koffiemachines"}, {"slug": "mokken-theeglazen", "naam": "Mokken & theeglazen"}, {"slug": "theepotten", "naam": "Theepotten"}]}, {"slug": "tafelen", "naam": "Tafelen", "vakjes": [{"slug": "borrelplanken-serveren", "naam": "Borrelplanken & serveren", "beeld": "images/sub/sub-keuken-kaas-serveerplanken-gw.webp", "oud": "keuken/kaas-serveerplanken"}, {"slug": "servies", "naam": "Servies"}, {"slug": "glazen", "naam": "Glazen"}], "beeld": "images/sub/sub-keuken-kaas-serveerplanken-gw.webp"}, {"slug": "lampen", "naam": "Lampen", "verborgen": true, "naar": "/c/wonen/verlichting"}, {"slug": "vloerkleden", "naam": "Vloerkleden", "verborgen": true, "naar": "/c/wonen/woontextiel/vloerkleden"}, {"slug": "wanddecoratie", "naam": "Wanddecoratie & posters", "verborgen": true, "naar": "/c/wonen/woondecoratie/wanddecoratie-posters"}, {"slug": "klokken", "naam": "Klokken", "verborgen": true, "naar": "/c/wonen/woondecoratie/klokken"}, {"slug": "kerst", "naam": "Kerst", "verborgen": true, "naar": "/c/wonen/kerstdecoratie"}, {"slug": "vazen-bloemen", "naam": "Vazen & bloemen", "verborgen": true, "naar": "/c/wonen/woondecoratie/vazen"}, {"slug": "kussens-plaids", "naam": "Kussens & plaids", "verborgen": true, "naar": "/c/wonen/woontextiel"}, {"slug": "kaarsen", "naam": "Kaarsen & kandelaars", "verborgen": true, "naar": "/c/wonen/kaarsen-geur"}, {"slug": "spiegels", "naam": "Spiegels", "verborgen": true, "naar": "/c/wonen/woondecoratie/spiegels"}, {"slug": "opbergen-dienbladen", "naam": "Opbergen & dienbladen", "verborgen": true, "naar": "/c/wonen/woondecoratie/opbergen-dienbladen"}, {"slug": "fotolijsten", "naam": "Fotolijsten", "verborgen": true, "naar": "/c/wonen/foto-persoonlijk/fotolijsten"}, {"slug": "huisgeuren", "naam": "Huisgeuren", "verborgen": true, "naar": "/c/wonen/kaarsen-geur/huisgeuren-geurstokjes"}, {"slug": "deurmatten", "naam": "Deurmatten", "verborgen": true, "naar": "/c/wonen/woontextiel/deurmatten"}, {"slug": "woonaccessoires", "naam": "Woonaccessoires", "verborgen": true, "naar": "/c/wonen/woondecoratie/wanddecoratie-posters"}, {"slug": "plaids-kussens", "naam": "Plaids & kussens", "verborgen": true, "naar": "/c/wonen/woontextiel"}], "tekst": "Maak van je huis een warm thuis."}, {"slug": "eten-drinken", "naam": "Eten & drinken", "kort": "Eten & drinken", "icoon": "taart", "tegel": "images/categorieen/categorie-eten-drinken-gw.webp", "banner": "images/banners/banner-cat-eten-drinken-gw.webp", "subs": [{"slug": "chocolade-snoep", "naam": "Chocolade & snoep", "vakjes": [{"slug": "koekjes-stroopwafels", "naam": "Koekjes & stroopwafels", "beeld": "images/sub/sub-eten-drinken-koekjes-stroopwafels-gw.webp", "oud": "eten-drinken/koekjes-stroopwafels"}, {"slug": "snoep-drop", "naam": "Snoep & drop", "beeld": "images/sub/sub-eten-drinken-drop-snoep.webp", "oud": "eten-drinken/drop-snoep"}, {"slug": "chocolade", "naam": "Chocolade"}, {"slug": "chocoladeletters", "naam": "Chocoladeletters"}], "beeld": "images/sub/sub-eten-drinken-koekjes-stroopwafels-gw.webp"}, {"slug": "cadeaupakketten", "naam": "Cadeaupakketten", "vakjes": [{"slug": "cadeaupakketten-manden", "naam": "Cadeaupakketten & manden", "beeld": "images/sub/sub-eten-drinken-pakketten.webp", "oud": "eten-drinken/kerst-cadeaupakketten"}, {"slug": "brievenbuscadeaus", "naam": "Brievenbuscadeaus", "beeld": "images/sub/sub-eten-drinken-brievenbuscadeaus.webp", "oud": "eten-drinken/brievenbuscadeaus"}], "beeld": "images/sub/sub-eten-drinken-pakketten.webp"}, {"slug": "koffie-thee-cacao", "naam": "Koffie, thee & cacao", "vakjes": [{"slug": "koffie", "naam": "Koffie"}, {"slug": "thee", "naam": "Thee"}, {"slug": "warme-chocolademelk", "naam": "Warme chocolademelk"}]}, {"slug": "delicatessen", "naam": "Delicatessen", "vakjes": [{"slug": "kaas-worst", "naam": "Kaas & worst"}, {"slug": "sauzen-kruiden", "naam": "Sauzen & kruiden", "beeld": "images/sub/sub-eten-drinken-bbq.webp", "oud": "eten-drinken/bbq-sauzen"}, {"slug": "noten-zoutjes", "naam": "Noten & zoutjes"}], "beeld": "images/sub/sub-eten-drinken-bbq.webp"}, {"slug": "wijn", "naam": "Wijn", "vakjes": [{"slug": "port-dessertwijn", "naam": "Port & dessertwijn"}, {"slug": "sake", "naam": "Sake", "beeld": "images/sub/sub-dranken-sake-gw.webp", "oud": "dranken/sake"}, {"slug": "rode-wijn", "naam": "Rode wijn"}, {"slug": "witte-wijn", "naam": "Witte wijn"}, {"slug": "rose", "naam": "Rosé"}], "beeld": "images/sub/sub-dranken-sake-gw.webp"}, {"slug": "bubbels", "naam": "Bubbels", "vakjes": [{"slug": "champagne", "naam": "Champagne"}, {"slug": "prosecco-cava", "naam": "Prosecco & cava"}]}, {"slug": "bier", "naam": "Bier", "vakjes": [{"slug": "speciaalbier", "naam": "Speciaalbier"}, {"slug": "bierpakketten", "naam": "Bierpakketten"}]}, {"slug": "sterke-drank", "naam": "Sterke drank", "vakjes": [{"slug": "tequila", "naam": "Tequila", "beeld": "images/sub/sub-dranken-tequila-gw.webp", "oud": "dranken/tequila"}, {"slug": "whisky", "naam": "Whisky", "beeld": "images/sub/sub-dranken-whisky-gw.webp", "oud": "dranken/whisky"}, {"slug": "cognac", "naam": "Cognac", "beeld": "images/sub/sub-dranken-cognac-gw.webp", "oud": "dranken/cognac"}, {"slug": "gin", "naam": "Gin"}, {"slug": "jenever", "naam": "Jenever", "beeld": "images/sub/sub-dranken-jenever-gw.webp", "oud": "dranken/jenever"}, {"slug": "rum", "naam": "Rum", "beeld": "images/sub/sub-dranken-rum-gw.webp", "oud": "dranken/rum"}, {"slug": "wodka", "naam": "Wodka", "beeld": "images/sub/sub-dranken-wodka-gw.webp", "oud": "dranken/wodka"}, {"slug": "likeur", "naam": "Likeur", "beeld": "images/sub/sub-dranken-likeuren-gw.webp", "oud": "dranken/likeuren"}], "beeld": "images/sub/sub-dranken-tequila-gw.webp"}, {"slug": "alcoholvrij", "naam": "Alcoholvrij", "vakjes": [{"slug": "alcoholvrije-wijn-bier", "naam": "Alcoholvrije wijn & bier"}, {"slug": "siropen-mocktails", "naam": "Siropen & mocktails"}]}, {"slug": "drankaccessoires", "naam": "Drankaccessoires", "vakjes": [{"slug": "glazen-karaffen", "naam": "Glazen & karaffen"}, {"slug": "wijnaccessoires", "naam": "Wijnaccessoires"}, {"slug": "cocktailsets", "naam": "Cocktailsets"}]}, {"slug": "chocolade", "naam": "Chocolade & bonbons", "verborgen": true, "naar": "/c/eten-drinken/chocolade-snoep"}, {"slug": "koekjes-stroopwafels", "naam": "Koekjes & stroopwafels", "verborgen": true, "naar": "/c/eten-drinken/chocolade-snoep/koekjes-stroopwafels"}, {"slug": "drop-snoep", "naam": "Drop & snoep", "verborgen": true, "naar": "/c/eten-drinken/chocolade-snoep/snoep-drop"}, {"slug": "sinterklaas-lekkers", "naam": "Sinterklaas-lekkers", "verborgen": true, "naar": "/c/eten-drinken/chocolade-snoep"}, {"slug": "adventskalenders", "naam": "Adventskalenders", "verborgen": true, "naar": "/collectie/adventskalenders"}, {"slug": "kerst-cadeaupakketten", "naam": "Kerst- & cadeaupakketten", "verborgen": true, "naar": "/c/eten-drinken/cadeaupakketten/cadeaupakketten-manden"}, {"slug": "koffie-thee", "naam": "Koffie & thee", "verborgen": true, "naar": "/c/eten-drinken/koffie-thee-cacao"}, {"slug": "brievenbuscadeaus", "naam": "Brievenbuscadeaus", "verborgen": true, "naar": "/c/eten-drinken/cadeaupakketten/brievenbuscadeaus"}, {"slug": "bbq-sauzen", "naam": "BBQ & sauzen", "verborgen": true, "naar": "/c/eten-drinken/delicatessen/sauzen-kruiden"}, {"slug": "bbq", "naam": "BBQ & kruiden", "verborgen": true, "naar": "/c/eten-drinken/delicatessen/sauzen-kruiden"}, {"slug": "pakketten", "naam": "Pakketten & borrel", "verborgen": true, "naar": "/c/eten-drinken/cadeaupakketten/cadeaupakketten-manden"}, {"slug": "lekkernijen", "naam": "Lekkernijen", "verborgen": true, "naar": "/c/eten-drinken/delicatessen"}], "tekst": "Lekkers om te geven."}, {"slug": "hobby", "naam": "Hobby & creatief", "kort": "Hobby", "icoon": "palet", "tegel": "images/categorieen/categorie-hobby-gw.webp", "banner": "images/banners/banner-cat-hobby-gw.webp", "subs": [{"slug": "handwerken", "naam": "Handwerken", "vakjes": [{"slug": "diamond-painting", "naam": "Diamond painting", "beeld": "images/sub/sub-hobby-diamond-painting.webp", "oud": "hobby/diamond-painting"}, {"slug": "haken-breien", "naam": "Haken & breien", "beeld": "images/sub/sub-hobby-haken-breien.webp", "oud": "hobby/haken-breien"}, {"slug": "borduren-punch-needle", "naam": "Borduren & punch needle"}, {"slug": "naaien", "naam": "Naaien"}], "beeld": "images/sub/sub-hobby-diamond-painting.webp"}, {"slug": "schilderen-tekenen", "naam": "Schilderen & tekenen", "vakjes": [{"slug": "tekenen-schetsen", "naam": "Tekenen & schetsen"}, {"slug": "verf-schildersets", "naam": "Verf & schildersets"}, {"slug": "kalligrafie-handlettering", "naam": "Kalligrafie & handlettering"}]}, {"slug": "zelf-maken", "naam": "Zelf maken", "vakjes": [{"slug": "klei-pottenbakken-epoxy", "naam": "Klei, pottenbakken & epoxy", "beeld": "images/sub/sub-hobby-klei-pottenbakken.webp", "oud": "hobby/klei-pottenbakken"}, {"slug": "kaarsen-zeep-maken", "naam": "Kaarsen & zeep maken"}, {"slug": "sieraden-maken", "naam": "Sieraden maken", "beeld": "images/sub/sub-hobby-kralen-sieraden-maken.webp", "oud": "hobby/kralen-sieraden-maken"}, {"slug": "3d-pennen", "naam": "3D-pennen", "beeld": "images/sub/sub-hobby-3d-pennen.webp", "oud": "hobby/3d-pennen"}], "beeld": "images/sub/sub-hobby-klei-pottenbakken.webp"}, {"slug": "modelbouw", "naam": "Modelbouw", "vakjes": [{"slug": "bouwpakketten", "naam": "Bouwpakketten"}, {"slug": "modeltreinen", "naam": "Modeltreinen"}, {"slug": "miniatuurhuisjes", "naam": "Miniatuurhuisjes"}]}, {"slug": "muziek-maken", "naam": "Muziek maken", "vakjes": [{"slug": "keyboards-piano-s", "naam": "Keyboards & piano's"}, {"slug": "gitaren-ukelele-s", "naam": "Gitaren & ukelele's"}, {"slug": "muziekaccessoires", "naam": "Muziekaccessoires"}]}, {"slug": "papier-planners", "naam": "Papier & planners", "vakjes": [{"slug": "agenda-s-planners", "naam": "Agenda's & planners", "beeld": "images/sub/sub-boeken-media-agendas.webp", "oud": "boeken-media/agendas-planners-kalenders"}, {"slug": "scrapbooking-origami", "naam": "Scrapbooking & origami", "beeld": "images/sub/sub-hobby-knutselen.webp", "oud": "hobby/origami-scrapbooking"}, {"slug": "bullet-journal", "naam": "Bullet journal"}, {"slug": "notitieboeken", "naam": "Notitieboeken"}], "beeld": "images/sub/sub-boeken-media-agendas.webp"}, {"slug": "tekenen", "naam": "Tekenen & stiften", "verborgen": true, "naar": "/c/hobby/schilderen-tekenen"}, {"slug": "schilderen", "naam": "Schilderen", "verborgen": true, "naar": "/c/hobby/schilderen-tekenen"}, {"slug": "diamond-painting", "naam": "Diamond painting", "verborgen": true, "naar": "/c/hobby/handwerken/diamond-painting"}, {"slug": "naaien-borduren", "naam": "Naaien & borduren", "verborgen": true, "naar": "/c/hobby/handwerken"}, {"slug": "kralen-sieraden-maken", "naam": "Kralen & sieraden maken", "verborgen": true, "naar": "/c/hobby/zelf-maken/sieraden-maken"}, {"slug": "origami-scrapbooking", "naam": "DIY-pakketten & origami", "verborgen": true, "naar": "/c/hobby/papier-planners/scrapbooking-origami"}, {"slug": "kaarsen-zeep-epoxy", "naam": "Kaarsen, zeep & epoxy", "verborgen": true, "naar": "/c/hobby/zelf-maken"}, {"slug": "haken-breien", "naam": "Haken & breien", "verborgen": true, "naar": "/c/hobby/handwerken/haken-breien"}, {"slug": "klei-pottenbakken", "naam": "Klei & pottenbakken", "verborgen": true, "naar": "/c/hobby/zelf-maken/klei-pottenbakken-epoxy"}, {"slug": "3d-pennen", "naam": "3D-pennen", "verborgen": true, "naar": "/c/hobby/zelf-maken/3d-pennen"}, {"slug": "bullet-journal", "naam": "Bullet journal & kalligrafie", "verborgen": true, "naar": "/c/hobby/papier-planners"}, {"slug": "tekenen-schilderen", "naam": "Tekenen & schilderen", "verborgen": true, "naar": "/c/hobby/schilderen-tekenen"}, {"slug": "knutselen", "naam": "Zelf maken", "verborgen": true, "naar": "/c/hobby/papier-planners/scrapbooking-origami"}], "tekst": "Zelf iets moois maken."}, {"slug": "sport-outdoor", "naam": "Sport & buiten", "kort": "Sport & buiten", "icoon": "bal", "tegel": "images/categorieen/categorie-sport-outdoor-gw.webp", "banner": "images/banners/banner-cat-sport-outdoor-gw.webp", "subs": [{"slug": "fietsen-steps", "naam": "Fietsen & steps", "vakjes": [{"slug": "skateboards", "naam": "Skateboards"}, {"slug": "fietsaccessoires", "naam": "Fietsaccessoires"}, {"slug": "fietshelmen", "naam": "Fietshelmen"}, {"slug": "elektrische-steps", "naam": "Elektrische steps"}]}, {"slug": "darts", "naam": "Darts", "vakjes": [{"slug": "dartborden", "naam": "Dartborden"}, {"slug": "dartpijlen", "naam": "Dartpijlen"}, {"slug": "dartmatten-oches", "naam": "Dartmatten & oches"}, {"slug": "flights-shafts", "naam": "Flights & shafts"}, {"slug": "elektronische-dartborden", "naam": "Elektronische dartborden"}, {"slug": "darts-shirts", "naam": "Darts-shirts"}, {"slug": "verlichting-surrounds", "naam": "Verlichting & surrounds"}]}, {"slug": "fitness-yoga", "naam": "Fitness & yoga", "vakjes": [{"slug": "yoga-pilates", "naam": "Yoga & pilates", "beeld": "images/sub/sub-sport-outdoor-yoga.webp", "oud": "sport-outdoor/yoga"}, {"slug": "fitness-thuis", "naam": "Fitness thuis", "beeld": "images/sub/sub-sport-outdoor-fitness-gw.webp", "oud": "sport-outdoor/fitness"}], "beeld": "images/sub/sub-sport-outdoor-yoga.webp"}, {"slug": "wandelen-hardlopen", "naam": "Wandelen & hardlopen", "vakjes": [{"slug": "wandelen", "naam": "Wandelen", "beeld": "images/sub/sub-sport-outdoor-wandelen-gw.webp", "oud": "sport-outdoor/wandelen"}, {"slug": "hardlopen", "naam": "Hardlopen", "beeld": "images/sub/sub-sport-outdoor-hardlopen.webp", "oud": "sport-outdoor/hardlopen"}], "beeld": "images/sub/sub-sport-outdoor-wandelen-gw.webp"}, {"slug": "kamperen-outdoor", "naam": "Kamperen & outdoor", "vakjes": [{"slug": "klimmen-boulderen", "naam": "Klimmen & boulderen", "beeld": "images/sub/sub-sport-outdoor-klimmen-boulderen.webp", "oud": "sport-outdoor/klimmen-boulderen"}, {"slug": "zaklampen-hoofdlampen", "naam": "Zaklampen & hoofdlampen"}, {"slug": "verrekijkers", "naam": "Verrekijkers"}, {"slug": "hengelsport", "naam": "Hengelsport", "beeld": "images/sub/sub-sport-outdoor-vissen-gw.webp", "oud": "sport-outdoor/vissen"}, {"slug": "messen-multitools", "naam": "Messen & multitools"}, {"slug": "kampeerspullen", "naam": "Kampeerspullen"}], "beeld": "images/sub/sub-sport-outdoor-klimmen-boulderen.webp"}, {"slug": "balsport-spel", "naam": "Balsport & spel", "vakjes": [{"slug": "voetbal", "naam": "Voetbal"}, {"slug": "padel-tennis", "naam": "Padel & tennis", "beeld": "images/sub/sub-sport-outdoor-padel-tennis.webp", "oud": "sport-outdoor/padel-tennis"}, {"slug": "golf", "naam": "Golf", "beeld": "images/sub/sub-sport-outdoor-golf-2026b.webp", "oud": "sport-outdoor/golf"}, {"slug": "buitenspellen-picknick", "naam": "Buitenspellen & picknick", "beeld": "images/sub/sub-sport-outdoor-buitenspellen-picknick.webp", "oud": "sport-outdoor/buitenspellen-picknick"}, {"slug": "tafelvoetbal-tafeltennis", "naam": "Tafelvoetbal & tafeltennis"}], "beeld": "images/sub/sub-sport-outdoor-padel-tennis.webp"}, {"slug": "water-wintersport", "naam": "Water- & wintersport", "vakjes": [{"slug": "wintersport", "naam": "Wintersport", "beeld": "images/sub/sub-sport-outdoor-wintersport-schaatsen.webp", "oud": "sport-outdoor/wintersport-schaatsen"}, {"slug": "zwemmen", "naam": "Zwemmen", "beeld": "images/sub/sub-sport-outdoor-watersport-zwemmen.webp", "oud": "sport-outdoor/watersport-zwemmen"}], "beeld": "images/sub/sub-sport-outdoor-wintersport-schaatsen.webp"}, {"slug": "metaaldetectie", "naam": "Metaaldetectie", "vakjes": [{"slug": "munten-vondsten", "naam": "Munten & vondsten", "beeld": "images/sub/sub-metaaldetectie-vondsten.webp", "oud": "metaaldetectie/munten-vondsten"}, {"slug": "magneetvissen", "naam": "Magneetvissen", "beeld": "images/sub/sub-metaaldetectie-magneetvissen.webp", "oud": "metaaldetectie/magneetvissen"}, {"slug": "pinpointers-uitrusting", "naam": "Pinpointers & uitrusting", "beeld": "images/sub/sub-metaaldetectie-pinpointers-uitrusting-gw.webp", "oud": "metaaldetectie/pinpointers-uitrusting"}, {"slug": "metaaldetectors", "naam": "Metaaldetectors", "beeld": "images/sub/sub-metaaldetectie-detectors-gw.webp", "knoppen": ["niveau"], "oud": "metaaldetectie/detectors"}], "beeld": "images/sub/sub-metaaldetectie-vondsten.webp"}, {"slug": "noodpakket-survival", "naam": "Noodpakket & survival", "vakjes": [{"slug": "noodpakketten", "naam": "Noodpakketten", "beeld": "images/sub/sub-noodpakket-survival-noodpakketten.webp", "seoTitel": "Noodpakket kopen: kant-en-klare noodpakketten voor 72 uur", "seoTekst": "Kant-en-klare noodpakketten voor 1 of meer personen, voor de eerste 72 uur. Met zaklamp, radio, deken, EHBO en meer. Vul ze aan met water en contant geld.", "oud": "noodpakket-survival/noodpakketten"}, {"slug": "water-eten", "naam": "Water & eten", "beeld": "images/sub/sub-noodpakket-survival-water-eten.webp", "seoTitel": "Noodrantsoen, houdbaar water en waterfilters", "seoTekst": "Drinkwater en eten voor de eerste 72 uur: lang houdbaar water, noodrantsoen, gevriesdroogde maaltijden, waterfilters en jerrycans.", "oud": "noodpakket-survival/water-eten"}, {"slug": "tassen-onderweg", "naam": "Tassen & onderweg", "beeld": "images/sub/sub-noodpakket-survival-buiten-veld.webp", "seoTitel": "Survival en bushcraft: vuurstarters, kompassen, tarps en zagen", "seoTekst": "Voor buiten, in het bos en op de velden: vuurstarters, kompassen, tarps, vouwzagen, multitools en waterdichte zakken.", "oud": "noodpakket-survival/buiten-veld"}, {"slug": "koken-warmte", "naam": "Koken & warmte", "beeld": "images/sub/sub-noodpakket-survival-koken-warmte.webp", "seoTitel": "Koken zonder stroom en warm blijven", "seoTekst": "Koken zonder stroom of gas met een klein kooktoestel, en warm blijven met nooddekens, slaapzakken en handwarmers.", "oud": "noodpakket-survival/koken-warmte"}, {"slug": "licht-stroom", "naam": "Licht & stroom", "beeld": "images/sub/sub-noodpakket-survival-licht-stroom.webp", "seoTitel": "Zaklampen, hoofdlampen en powerbanks voor een stroomstoring", "seoTekst": "Licht en stroom als het donker wordt: zaklampen, hoofdlampen, lantaarns, powerbanks op zonne-energie en draagbare powerstations.", "oud": "noodpakket-survival/licht-stroom"}, {"slug": "ehbo-brand", "naam": "EHBO & brand", "beeld": "images/sub/sub-noodpakket-survival-ehbo-brand.webp", "seoTitel": "EHBO-kits, branddekens en brandblussers", "seoTekst": "EHBO-kits voor thuis, in de auto en onderweg, plus branddekens, brandblussers en rookmelders. Veilig in huis.", "oud": "noodpakket-survival/ehbo-brand"}, {"slug": "noodradio-s", "naam": "Noodradio's", "beeld": "images/sub/sub-noodpakket-survival-noodradio.webp", "seoTitel": "Noodradio kopen: opwindbaar, met zonnepaneel en powerbank", "seoTekst": "Een noodradio werkt ook als de stroom en het internet uitvallen. Opwindbare radio’s met zonnepaneel, zaklamp en powerbank, zodat je de rampenzender kunt horen.", "oud": "noodpakket-survival/noodradio"}], "beeld": "images/sub/sub-noodpakket-survival-noodpakketten.webp"}, {"slug": "voetbal-balsporten", "naam": "Voetbal & balsporten", "verborgen": true, "naar": "/c/sport-outdoor/balsport-spel"}, {"slug": "fietsen", "naam": "Fietsen", "verborgen": true, "naar": "/c/sport-outdoor/fietsen-steps"}, {"slug": "padel-tennis", "naam": "Padel & tennis", "verborgen": true, "naar": "/c/sport-outdoor/balsport-spel/padel-tennis"}, {"slug": "wintersport-schaatsen", "naam": "Wintersport & schaatsen", "verborgen": true, "naar": "/c/sport-outdoor/water-wintersport/wintersport"}, {"slug": "fitness", "naam": "Fitness & thuis sporten", "verborgen": true, "naar": "/c/sport-outdoor/fitness-yoga/fitness-thuis"}, {"slug": "kamperen", "naam": "Kamperen", "verborgen": true, "naar": "/c/sport-outdoor/kamperen-outdoor"}, {"slug": "wandelen", "naam": "Wandelen", "verborgen": true, "naar": "/c/sport-outdoor/wandelen-hardlopen/wandelen"}, {"slug": "hardlopen", "naam": "Hardlopen", "verborgen": true, "naar": "/c/sport-outdoor/wandelen-hardlopen/hardlopen"}, {"slug": "golf", "naam": "Golf", "verborgen": true, "naar": "/c/sport-outdoor/balsport-spel/golf"}, {"slug": "reizen", "naam": "Reizen", "verborgen": true, "naar": "/c/mode-sieraden/tassen-portemonnees/reisaccessoires"}, {"slug": "watersport-zwemmen", "naam": "Watersport & zwemmen", "verborgen": true, "naar": "/c/sport-outdoor/water-wintersport/zwemmen"}, {"slug": "klimmen-boulderen", "naam": "Klimmen & boulderen", "verborgen": true, "naar": "/c/sport-outdoor/kamperen-outdoor/klimmen-boulderen"}, {"slug": "skateboards-steps", "naam": "Skateboards & steps", "verborgen": true, "naar": "/c/sport-outdoor/fietsen-steps"}, {"slug": "yoga", "naam": "Yoga", "verborgen": true, "naar": "/c/sport-outdoor/fitness-yoga/yoga-pilates"}, {"slug": "buitenspellen-picknick", "naam": "Buitenspellen & picknick", "verborgen": true, "naar": "/c/sport-outdoor/balsport-spel/buitenspellen-picknick"}, {"slug": "vissen", "naam": "Vissen", "verborgen": true, "naar": "/c/sport-outdoor/kamperen-outdoor/hengelsport"}], "tekst": "Erop uit, in beweging."}, {"slug": "tuin-klussen", "naam": "Tuin & klussen", "kort": "Tuin & klussen", "icoon": "blad", "tegel": "images/categorieen/categorie-tuin-klussen-gw.webp", "banner": "images/banners/banner-cat-tuin-klussen-gw.webp", "subs": [{"slug": "tuin-planten", "naam": "Tuin & planten", "vakjes": [{"slug": "planten-potten", "naam": "Planten & potten", "beeld": "images/sub/sub-tuin-klussen-planten-zaden.webp", "oud": "tuin-klussen/planten-potten"}, {"slug": "vogelhuisjes-insectenhotels", "naam": "Vogelhuisjes & insectenhotels", "beeld": "images/sub/sub-dieren-vogels.webp", "oud": "tuin-klussen/vogels-insecten"}, {"slug": "moestuin-zaden", "naam": "Moestuin & zaden", "beeld": "images/sub/sub-tuin-klussen-moestuin-kweken-w.webp", "oud": "tuin-klussen/moestuin-kweken"}, {"slug": "regentonnen-compost", "naam": "Regentonnen & compost", "beeld": "images/sub/sub-tuin-klussen-regentonnen-slangen-compost.webp", "oud": "tuin-klussen/regentonnen-slangen-compost"}, {"slug": "tuindecoratie", "naam": "Tuindecoratie", "beeld": "images/sub/sub-tuin-klussen-tuindecoratie-w.webp", "oud": "tuin-klussen/tuindecoratie"}], "beeld": "images/sub/sub-tuin-klussen-planten-zaden.webp"}, {"slug": "buiten-leven", "naam": "Buiten leven", "vakjes": [{"slug": "zwembaden-jacuzzi-s", "naam": "Zwembaden & jacuzzi's", "beeld": "images/sub/sub-tuin-klussen-zwembaden-jacuzzis.webp", "oud": "tuin-klussen/zwembaden-jacuzzis"}, {"slug": "bbq-buitenkoken", "naam": "BBQ & buitenkoken", "beeld": "images/sub/sub-tuin-klussen-bbq-buitenkoken-gw.webp", "oud": "tuin-klussen/bbq-buitenkoken"}, {"slug": "tuinmeubelen", "naam": "Tuinmeubelen", "beeld": "images/sub/sub-tuin-klussen-tuinmeubelen.webp", "oud": "tuin-klussen/tuinmeubelen"}, {"slug": "buitenverlichting", "naam": "Buitenverlichting", "beeld": "images/sub/sub-tuin-klussen-buitenverlichting.webp", "oud": "tuin-klussen/buitenverlichting"}, {"slug": "vuurkorven-terrasverwarmers", "naam": "Vuurkorven & terrasverwarmers", "beeld": "images/sub/sub-tuin-klussen-vuurschalen-terrasverwarmers-w.webp", "oud": "tuin-klussen/vuurschalen-terrasverwarmers"}], "beeld": "images/sub/sub-tuin-klussen-zwembaden-jacuzzis.webp"}, {"slug": "tuingereedschap", "naam": "Tuingereedschap", "vakjes": [{"slug": "tuinmachines", "naam": "Tuinmachines", "beeld": "images/sub/sub-tuin-klussen-tuinmachines.webp", "oud": "tuin-klussen/tuinmachines"}, {"slug": "handgereedschap-tuin", "naam": "Handgereedschap tuin", "beeld": "images/sub/sub-tuin-klussen-tuingereedschap.webp", "oud": "tuin-klussen/tuingereedschap"}], "beeld": "images/sub/sub-tuin-klussen-tuinmachines.webp"}, {"slug": "klussen", "naam": "Klussen", "vakjes": [{"slug": "handgereedschap", "naam": "Handgereedschap"}, {"slug": "elektrisch-gereedschap", "naam": "Elektrisch gereedschap", "beeld": "images/sub/sub-tuin-klussen-elektrisch-gereedschap-gw.webp", "oud": "tuin-klussen/elektrisch-gereedschap"}, {"slug": "gereedschapssets", "naam": "Gereedschapssets"}], "beeld": "images/sub/sub-tuin-klussen-elektrisch-gereedschap-gw.webp"}, {"slug": "zwembaden-jacuzzis", "naam": "Zwembaden & jacuzzi's", "verborgen": true, "naar": "/c/tuin-klussen/buiten-leven/zwembaden-jacuzzi-s"}, {"slug": "tuinmeubelen", "naam": "Tuinmeubelen & parasols", "verborgen": true, "naar": "/c/tuin-klussen/buiten-leven/tuinmeubelen"}, {"slug": "elektrisch-gereedschap", "naam": "Elektrisch gereedschap", "verborgen": true, "naar": "/c/tuin-klussen/klussen/elektrisch-gereedschap"}, {"slug": "bbq-buitenkoken", "naam": "BBQ & buiten koken", "verborgen": true, "naar": "/c/tuin-klussen/buiten-leven/bbq-buitenkoken"}, {"slug": "tuinmachines", "naam": "Tuinmachines", "verborgen": true, "naar": "/c/tuin-klussen/tuingereedschap/tuinmachines"}, {"slug": "handgereedschap-werkplaats", "naam": "Handgereedschap & werkplaats", "verborgen": true, "naar": "/c/tuin-klussen/klussen"}, {"slug": "planten-potten", "naam": "Planten & potten", "verborgen": true, "naar": "/c/tuin-klussen/tuin-planten/planten-potten"}, {"slug": "regentonnen-slangen-compost", "naam": "Regentonnen, slangen & compost", "verborgen": true, "naar": "/c/tuin-klussen/tuin-planten/regentonnen-compost"}, {"slug": "vogels-insecten", "naam": "Vogels & insecten", "verborgen": true, "naar": "/c/tuin-klussen/tuin-planten/vogelhuisjes-insectenhotels"}, {"slug": "moestuin-kweken", "naam": "Moestuin & kweken", "verborgen": true, "naar": "/c/tuin-klussen/tuin-planten/moestuin-zaden"}, {"slug": "buitenverlichting", "naam": "Buitenverlichting", "verborgen": true, "naar": "/c/tuin-klussen/buiten-leven/buitenverlichting"}, {"slug": "vuurschalen-terrasverwarmers", "naam": "Vuurschalen & terrasverwarmers", "verborgen": true, "naar": "/c/tuin-klussen/buiten-leven/vuurkorven-terrasverwarmers"}, {"slug": "tuindecoratie", "naam": "Tuindecoratie", "verborgen": true, "naar": "/c/tuin-klussen/tuin-planten/tuindecoratie"}, {"slug": "planten-zaden", "naam": "Planten & zaden", "verborgen": true, "naar": "/c/tuin-klussen/tuin-planten/planten-potten"}, {"slug": "gereedschap", "naam": "Gereedschap", "verborgen": true, "naar": "/c/tuin-klussen/klussen/elektrisch-gereedschap"}], "tekst": "Voor de tuin en de handige klusser."}, {"slug": "boeken-media", "naam": "Boeken, films & muziek", "kort": "Boeken & media", "icoon": "boek", "tegel": "images/categorieen/categorie-boeken-media-gw.webp", "banner": "images/banners/banner-cat-boeken-media-gw.webp", "subs": [{"slug": "boeken", "naam": "Boeken", "vakjes": [{"slug": "romans-thrillers", "naam": "Romans & thrillers", "beeld": "images/sub/sub-boeken-media-romans.webp", "oud": "boeken-media/thrillers-romans"}, {"slug": "strips-manga", "naam": "Strips & manga", "beeld": "images/sub/sub-boeken-media-strips-manga-w.webp", "oud": "boeken-media/strips-manga"}, {"slug": "luisterboeken", "naam": "Luisterboeken", "beeld": "images/sub/sub-boeken-media-luisterboeken-w.webp", "oud": "boeken-media/luisterboeken"}, {"slug": "kookboeken", "naam": "Kookboeken", "beeld": "images/sub/sub-boeken-media-kookboeken.webp", "oud": "boeken-media/kookboeken"}, {"slug": "invulboeken-dagboeken", "naam": "Invulboeken & dagboeken", "beeld": "images/sub/sub-boeken-media-foto-invulboeken-w.webp", "oud": "boeken-media/foto-invulboeken"}, {"slug": "non-fictie-hobby", "naam": "Non-fictie & hobby"}, {"slug": "puzzelboeken", "naam": "Puzzelboeken", "beeld": "images/sub/sub-boeken-media-puzzelboeken-w.webp", "oud": "boeken-media/puzzelboeken"}], "beeld": "images/sub/sub-boeken-media-romans.webp"}, {"slug": "kinderboeken", "naam": "Kinderboeken", "vakjes": [{"slug": "kleurboeken", "naam": "Kleurboeken", "beeld": "images/sub/sub-boeken-media-kleurboeken-w.webp", "oud": "boeken-media/kleurboeken"}, {"slug": "prentenboeken", "naam": "Prentenboeken"}, {"slug": "leesboeken", "naam": "Leesboeken"}, {"slug": "voorleesboeken", "naam": "Voorleesboeken"}], "beeld": "images/sub/sub-boeken-media-kleurboeken-w.webp"}, {"slug": "films-series", "naam": "Films & series", "vakjes": [{"slug": "dvd-blu-ray", "naam": "Dvd & Blu-ray", "beeld": "images/sub/sub-boeken-media-films-series-gw.webp", "oud": "boeken-media/films-series"}], "beeld": "images/sub/sub-boeken-media-films-series-gw.webp"}, {"slug": "muziek", "naam": "Muziek", "vakjes": [{"slug": "vinyl", "naam": "Vinyl"}, {"slug": "cd-s", "naam": "Cd's"}]}, {"slug": "puzzelboeken", "naam": "Puzzelboeken", "verborgen": true, "naar": "/c/boeken-media/boeken/puzzelboeken"}, {"slug": "agendas-planners-kalenders", "naam": "Agenda's, planners & kalenders", "verborgen": true, "naar": "/c/hobby/papier-planners/agenda-s-planners"}, {"slug": "e-readers", "naam": "E-readers", "verborgen": true, "naar": "/c/elektronica/tablets-e-readers/e-readers"}, {"slug": "thrillers-romans", "naam": "Thrillers & romans", "verborgen": true, "naar": "/c/boeken-media/boeken/romans-thrillers"}, {"slug": "strips-manga", "naam": "Strips & manga", "verborgen": true, "naar": "/c/boeken-media/boeken/strips-manga"}, {"slug": "leesplezier", "naam": "Leesplezier", "verborgen": true, "naar": "/c/boeken-media/boeken"}, {"slug": "luisterboeken", "naam": "Luisterboeken", "verborgen": true, "naar": "/c/boeken-media/boeken/luisterboeken"}, {"slug": "kleurboeken", "naam": "Kleurboeken", "verborgen": true, "naar": "/c/boeken-media/kinderboeken/kleurboeken"}, {"slug": "foto-invulboeken", "naam": "Foto- & invulboeken", "verborgen": true, "naar": "/c/boeken-media/boeken/invulboeken-dagboeken"}, {"slug": "boekenbonnen-abonnementen", "naam": "Boekenbonnen & abonnementen", "verborgen": true, "naar": "/c/boeken-media"}, {"slug": "kookboeken", "naam": "Kookboeken", "verborgen": true, "naar": "/c/boeken-media/boeken/kookboeken"}, {"slug": "romans", "naam": "Romans", "verborgen": true, "naar": "/c/boeken-media/boeken/romans-thrillers"}, {"slug": "agendas", "naam": "Agenda’s & notitieboeken", "verborgen": true, "naar": "/c/hobby/papier-planners/agenda-s-planners"}, {"slug": "lezen", "naam": "Leesplezier", "verborgen": true, "naar": "/c/boeken-media/boeken"}], "tekst": "Boeken, filmavond en muziek."}, {"slug": "dieren", "naam": "Dieren", "kort": "Dieren", "icoon": "poot", "tegel": "images/categorieen/categorie-dieren-gw.webp", "banner": "images/banners/banner-cat-dieren-gw.webp", "subs": [{"slug": "hond", "naam": "Hond", "vakjes": [{"slug": "manden-kussens", "naam": "Manden & kussens"}, {"slug": "hondenspeelgoed", "naam": "Hondenspeelgoed"}, {"slug": "riemen-halsbanden", "naam": "Riemen & halsbanden"}]}, {"slug": "kat", "naam": "Kat", "vakjes": [{"slug": "kattenspeelgoed", "naam": "Kattenspeelgoed"}, {"slug": "krabpalen-manden", "naam": "Krabpalen & manden"}]}, {"slug": "klein-dier", "naam": "Klein dier", "vakjes": [{"slug": "konijn-knaagdier", "naam": "Konijn & knaagdier", "beeld": "images/sub/sub-dieren-konijn-cavia-hamster-w.webp", "oud": "dieren/konijn-cavia-hamster"}, {"slug": "reptielen-terrarium", "naam": "Reptielen & terrarium", "beeld": "images/sub/sub-dieren-reptielen-terrarium-w.webp", "oud": "dieren/reptielen-terrarium"}, {"slug": "kippen", "naam": "Kippen", "beeld": "images/sub/sub-dieren-kippen-w.webp", "oud": "dieren/kippen"}], "beeld": "images/sub/sub-dieren-konijn-cavia-hamster-w.webp"}, {"slug": "vogels-vissen", "naam": "Vogels & vissen", "vakjes": [{"slug": "aquarium", "naam": "Aquarium", "beeld": "images/sub/sub-dieren-vissen-aquarium-w.webp", "oud": "dieren/vissen-aquarium"}, {"slug": "vogels", "naam": "Vogels", "beeld": "images/sub/sub-dieren-vogels-w.webp", "oud": "dieren/vogels"}], "beeld": "images/sub/sub-dieren-vissen-aquarium-w.webp"}, {"slug": "paard", "naam": "Paard", "vakjes": [{"slug": "paardrijden", "naam": "Paardrijden", "beeld": "images/sub/sub-dieren-paard-w.webp", "oud": "dieren/paard"}], "beeld": "images/sub/sub-dieren-paard-w.webp"}, {"slug": "konijn-cavia-hamster", "naam": "Konijn, cavia & hamster", "verborgen": true, "naar": "/c/dieren/klein-dier/konijn-knaagdier"}, {"slug": "vissen-aquarium", "naam": "Vissen & aquarium", "verborgen": true, "naar": "/c/dieren/vogels-vissen/aquarium"}, {"slug": "reptielen-terrarium", "naam": "Reptielen & terrarium", "verborgen": true, "naar": "/c/dieren/klein-dier/reptielen-terrarium"}, {"slug": "kippen", "naam": "Kippen", "verborgen": true, "naar": "/c/dieren/klein-dier/kippen"}, {"slug": "vogels", "naam": "Vogels", "verborgen": true, "naar": "/c/dieren/vogels-vissen/vogels"}], "tekst": "Verwen je trouwe vriend."}, {"slug": "christelijk", "naam": "Christelijke cadeaus", "kort": "Christelijk", "icoon": "kruis", "tegel": "images/categorieen/categorie-christelijk-gw.webp", "banner": "images/banners/banner-cat-christelijk-gw.webp", "subs": [{"slug": "bijbels-psalmboeken", "naam": "Bijbels & psalmboeken", "vakjes": [{"slug": "psalmboeken", "naam": "Psalmboeken", "beeld": "images/sub/sub-christelijk-psalmboeken-w.webp", "oud": "christelijk/psalmboeken"}, {"slug": "bijbels", "naam": "Bijbels", "beeld": "images/sub/sub-christelijk-bijbels-2026b.webp", "seoTitel": "Bijbel als cadeau: Statenvertaling, HSV en kinderbijbels", "seoTekst": "Een Bijbel cadeau geven: Statenvertaling, HSV, Bijbels met psalmen, kanttekeningenbijbels en kinderbijbels. Voor doop, belijdenis of huwelijk.", "oud": "christelijk/bijbels"}], "beeld": "images/sub/sub-christelijk-psalmboeken-w.webp"}, {"slug": "boeken-muziek", "naam": "Boeken & muziek", "vakjes": [{"slug": "christelijke-boeken", "naam": "Christelijke boeken"}, {"slug": "christelijke-muziek", "naam": "Christelijke muziek"}]}, {"slug": "sieraden", "naam": "Sieraden", "vakjes": [{"slug": "kettingen-met-kruis", "naam": "Kettingen met kruis"}, {"slug": "armbanden-overig", "naam": "Armbanden & overig"}]}, {"slug": "wanddecoratie-teksten", "naam": "Wanddecoratie & teksten", "vakjes": [{"slug": "kaarten-posters", "naam": "Kaarten & posters"}, {"slug": "tegeltjes-wandborden", "naam": "Tegeltjes & wandborden"}]}, {"slug": "kerst", "naam": "Kerst", "vakjes": [{"slug": "kerststallen-engelen", "naam": "Kerststallen & engelen", "beeld": "images/sub/sub-christelijk-kerststal-engelen.webp", "seoTitel": "Kerststal kopen: houten kerststallen en engelen", "seoTekst": "Kerststallen en engelen voor de kerst: houten kerststallen, kerststalfiguren en sfeervolle engeltjes voor in huis.", "oud": "christelijk/kerststal-engelen"}, {"slug": "christelijke-kerstcadeaus", "naam": "Christelijke kerstcadeaus", "beeld": "images/sub/sub-christelijk-kerst-2026b.webp", "seoTitel": "Christelijke kerstcadeaus en kerstkaarten", "seoTekst": "Christelijke kerstcadeaus: kerstkaarten met het kerstverhaal, kerststallen en sfeervolle decoratie rond de geboorte van Jezus.", "oud": "christelijk/kerst"}], "beeld": "images/sub/sub-christelijk-kerststal-engelen.webp"}, {"slug": "doop-belijdenis", "naam": "Doop & belijdenis", "vakjes": [{"slug": "belijdenis", "naam": "Belijdenis"}, {"slug": "doop", "naam": "Doop"}]}, {"slug": "voor-kinderen", "naam": "Voor kinderen", "vakjes": [{"slug": "speelgoed-cadeautjes", "naam": "Speelgoed & cadeautjes"}, {"slug": "kinderbijbels-boeken", "naam": "Kinderbijbels & boeken"}]}, {"slug": "bijbels", "naam": "Bijbels", "verborgen": true, "naar": "/c/christelijk/bijbels-psalmboeken/bijbels"}, {"slug": "psalmboeken", "naam": "Psalmboeken", "verborgen": true, "naar": "/c/christelijk/bijbels-psalmboeken/psalmboeken"}, {"slug": "kerststal-engelen", "naam": "Kerststal & engelen", "verborgen": true, "naar": "/c/christelijk/kerst/kerststallen-engelen"}, {"slug": "bijbelteksten-wanddecoratie", "naam": "Bijbelteksten & wanddecoratie", "verborgen": true, "naar": "/c/christelijk/wanddecoratie-teksten"}, {"slug": "kaarten-posters", "naam": "Kaarten & posters", "verborgen": true, "naar": "/c/christelijk/wanddecoratie-teksten"}, {"slug": "wanddecoratie", "naam": "Wanddecoratie", "verborgen": true, "naar": "/c/christelijk/wanddecoratie-teksten"}, {"slug": "bijbeltekst", "naam": "Met Bijbeltekst", "verborgen": true, "naar": "/c/christelijk/wanddecoratie-teksten"}, {"slug": "onder-25", "naam": "Onder €25", "verborgen": true, "naar": "/c/christelijk"}], "tekst": "Op zoek naar een christelijk cadeau met betekenis? Ontdek Bijbels, sieraden met een kruis, tegeltjes en wandborden met een Bijbeltekst en mooie geschenken voor jong en oud. Voor een doop, belijdenis, verjaardag of om iemand een hart onder de riem te steken.", "seoTitel": "Christelijke cadeaus & geschenken met betekenis", "seoTekst": "Christelijke cadeaus en geschenken: Bijbels (Statenvertaling en HSV), tegeltjes met Bijbeltekst, dagboeken en kinderbijbels. Voor doop, belijdenis, verjaardag of troost.", "gids": [{"kop": "Een christelijk cadeau kiezen", "tekst": "Een christelijk cadeau zegt vaak meer dan een gewoon cadeau. Denk na over wat de ontvanger raakt: een Bijbeltekst die bij een moment in het leven past, een sieraad dat elke dag gedragen wordt of een boek om samen in te lezen. Kijk ook naar de vertaling of de stijl die iemand in de kerk gewend is."}, {"kop": "Voor een doop of belijdenis", "tekst": "Bij een doop is een kinderbijbel, een psalmboekje of een mooi aandenken met een Bijbeltekst een blijvend cadeau. Voor een belijdenis kies je vaak een eigen Bijbel (Statenvertaling of HSV), een Bijbel met psalmen, een dagboek of een mooie Bijbelhoes."}, {"kop": "Een geschenk met een Bijbeltekst", "tekst": "Een tegeltje, wandbord of kaart met een Bijbeltekst is een klein gebaar dat lang blijft hangen. Teksten als Psalm 23 of \"Wees sterk en moedig\" geven troost en kracht, bijvoorbeeld bij ziekte, verdriet of een nieuwe stap in het leven."}, {"kop": "Christelijke cadeaus voor kinderen", "tekst": "Voor kinderen zijn er kinderbijbels met mooie platen, psalmen en gebedjes op kindermaat en speelgoed met Bijbelverhalen, zoals de ark van Noach. Zo maken ze op een speelse manier kennis met het geloof."}]}, {"slug": "sieraden", "naam": "Sieraden & Horloges", "kort": "Sieraden & Horloges", "icoon": "ring", "verborgen": true, "naar": "/c/mode-sieraden/sieraden", "subs": [{"slug": "ringen", "naam": "Ringen", "verborgen": true, "naar": "/c/mode-sieraden/sieraden/ringen"}, {"slug": "smartwatches", "naam": "Smartwatches", "verborgen": true, "naar": "/c/elektronica/smartwatches"}, {"slug": "horloges", "naam": "Horloges", "verborgen": true, "naar": "/c/mode-sieraden/horloges"}, {"slug": "echt-goud", "naam": "Echt goud", "verborgen": true, "naar": "/c/mode-sieraden/sieraden"}, {"slug": "oorbellen", "naam": "Oorbellen", "verborgen": true, "naar": "/c/mode-sieraden/sieraden/oorbellen"}, {"slug": "kettingen", "naam": "Kettingen & hangers", "verborgen": true, "naar": "/c/mode-sieraden/sieraden/kettingen"}, {"slug": "zilver", "naam": "Zilver", "verborgen": true, "naar": "/c/mode-sieraden/sieraden"}, {"slug": "armbanden", "naam": "Armbanden & enkelbandjes", "verborgen": true, "naar": "/c/mode-sieraden/sieraden/armbanden"}, {"slug": "sieradendozen", "naam": "Sieradendozen", "verborgen": true, "naar": "/c/mode-sieraden/sieraden/sieradendozen"}, {"slug": "parels", "naam": "Parels", "verborgen": true, "naar": "/c/mode-sieraden/sieraden"}, {"slug": "bedels", "naam": "Bedels & bedelarmbanden", "verborgen": true, "naar": "/c/mode-sieraden/sieraden/bedels"}, {"slug": "met-naam", "naam": "Met naam & letter", "verborgen": true, "naar": "/c/mode-sieraden/sieraden/sieraden-met-naam"}, {"slug": "heren", "naam": "Herensieraden", "verborgen": true, "naar": "/c/mode-sieraden/sieraden/armbanden"}, {"slug": "viking", "naam": "Viking-sieraden", "verborgen": true, "naar": "/c/mode-sieraden/sieraden/kettingen"}, {"slug": "verguld-staal", "naam": "Verguld & staal", "verborgen": true, "naar": "/c/mode-sieraden/sieraden/kettingen"}]}, {"slug": "geuren-verzorging", "naam": "Geuren & Verzorging", "kort": "Geuren & Verzorging", "icoon": "tas", "verborgen": true, "naar": "/c/beauty-verzorging", "subs": [{"slug": "rituals", "naam": "Rituals", "verborgen": true, "naar": "/c/beauty-verzorging/giftsets"}, {"slug": "parfum", "naam": "Parfum", "verborgen": true, "naar": "/c/beauty-verzorging/parfum"}, {"slug": "scheren-baard", "naam": "Scheren & baard", "verborgen": true, "naar": "/c/beauty-verzorging/scheren-baard"}, {"slug": "haarstylers", "naam": "Haarstylers", "verborgen": true, "naar": "/c/beauty-verzorging/haar/fohns-stijltangen"}, {"slug": "make-up-nagels", "naam": "Make-up & nagels", "verborgen": true, "naar": "/c/beauty-verzorging/make-up-nagels"}, {"slug": "huidverzorging", "naam": "Huidverzorging", "verborgen": true, "naar": "/c/beauty-verzorging/huid-gezicht"}, {"slug": "cadeausets", "naam": "Cadeausets", "verborgen": true, "naar": "/c/beauty-verzorging/giftsets"}, {"slug": "bad-douche", "naam": "Bad & douche", "verborgen": true, "naar": "/c/beauty-verzorging/bad-douche"}, {"slug": "massage", "naam": "Massage", "verborgen": true, "naar": "/c/beauty-verzorging/wellness"}, {"slug": "tandenborstels", "naam": "Elektrische tandenborstels", "verborgen": true, "naar": "/c/beauty-verzorging/mond-tanden"}, {"slug": "geuren", "naam": "Geuren", "verborgen": true, "naar": "/c/beauty-verzorging/parfum"}, {"slug": "verzorging", "naam": "Verzorging", "verborgen": true, "naar": "/c/beauty-verzorging/huid-gezicht"}]}, {"slug": "mode-beauty", "naam": "Mode & Accessoires", "kort": "Mode & Accessoires", "icoon": "tas", "verborgen": true, "naar": "/c/mode-sieraden", "subs": [{"slug": "schoenen", "naam": "Schoenen, sneakers & boots", "verborgen": true, "naar": "/c/mode-sieraden/schoenen-sloffen"}, {"slug": "truien-hoodies", "naam": "Truien & hoodies", "verborgen": true, "naar": "/c/mode-sieraden/kleding/truien-hoodies"}, {"slug": "pyjamas", "naam": "Pyjama's, badjassen & onesies", "verborgen": true, "naar": "/c/mode-sieraden/kleding/pyjama-s-badjassen"}, {"slug": "koffers", "naam": "Koffers & reistassen", "verborgen": true, "naar": "/c/mode-sieraden/tassen-portemonnees/koffers-reistassen"}, {"slug": "tassen", "naam": "Tassen", "verborgen": true, "naar": "/c/mode-sieraden/tassen-portemonnees"}, {"slug": "mutsen-sjaals", "naam": "Mutsen, sjaals & handschoenen", "verborgen": true, "naar": "/c/mode-sieraden/accessoires"}, {"slug": "portemonnees", "naam": "Portemonnees & pasjeshouders", "verborgen": true, "naar": "/c/mode-sieraden/tassen-portemonnees/portemonnees-pasjeshouders"}, {"slug": "pantoffels-sokken", "naam": "Pantoffels & sokken", "verborgen": true, "naar": "/c/mode-sieraden/schoenen-sloffen/pantoffels-sloffen"}, {"slug": "zonnebrillen", "naam": "Zonnebrillen", "verborgen": true, "naar": "/c/mode-sieraden/accessoires/zonnebrillen"}, {"slug": "rugzakken", "naam": "Rugzakken", "verborgen": true, "naar": "/c/mode-sieraden/tassen-portemonnees/rugzakken"}, {"slug": "riemen-sleutelhangers", "naam": "Riemen, sleutelhangers & paraplu's", "verborgen": true, "naar": "/c/mode-sieraden/accessoires"}, {"slug": "toilettassen", "naam": "Toilettassen", "verborgen": true, "naar": "/c/mode-sieraden/tassen-portemonnees/toilettassen"}, {"slug": "horloges", "naam": "Horloges", "verborgen": true, "naar": "/c/mode-sieraden/horloges"}, {"slug": "geuren", "naam": "Geuren", "verborgen": true, "naar": "/c/beauty-verzorging/parfum"}, {"slug": "verzorging", "naam": "Verzorging", "verborgen": true, "naar": "/c/beauty-verzorging/huid-gezicht"}, {"slug": "rugzakken-reistassen", "naam": "Rugzakken & reistassen", "verborgen": true, "naar": "/c/mode-sieraden/tassen-portemonnees/rugzakken"}, {"slug": "kleding", "naam": "Kleding & sokken", "verborgen": true, "naar": "/c/mode-sieraden/kleding/truien-hoodies"}, {"slug": "accessoires", "naam": "Accessoires", "verborgen": true, "naar": "/c/mode-sieraden/accessoires"}]}, {"slug": "keuken", "naam": "Keuken & Tafelen", "kort": "Keuken & Tafelen", "icoon": "kop", "verborgen": true, "naar": "/c/wonen/koken-bakken", "subs": [{"slug": "keukenapparaten", "naam": "Keukenapparaten", "verborgen": true, "naar": "/c/wonen/koken-bakken/keukenapparaten"}, {"slug": "airfryers", "naam": "Airfryers", "verborgen": true, "naar": "/c/wonen/koken-bakken/airfryers"}, {"slug": "koffie-thee", "naam": "Koffie & thee", "verborgen": true, "naar": "/c/wonen/koffie-thee-zetten"}, {"slug": "gezellig-tafelen", "naam": "Gezellig tafelen", "verborgen": true, "naar": "/c/wonen/tafelen"}, {"slug": "pannen", "naam": "Pannen", "verborgen": true, "naar": "/c/wonen/koken-bakken/pannen-messen"}, {"slug": "tosti-wafel-ijs", "naam": "Tosti-, wafel- & ijsmachines", "verborgen": true, "naar": "/c/wonen/koken-bakken/keukenapparaten"}, {"slug": "glazen-servies", "naam": "Glazen & servies", "verborgen": true, "naar": "/c/wonen/tafelen"}, {"slug": "drinkflessen-lunch", "naam": "Drinkflessen & lunch", "verborgen": true, "naar": "/c/wonen/koken-bakken/drinkflessen-lunchboxen"}, {"slug": "messen-snijplanken", "naam": "Messen & snijplanken", "verborgen": true, "naar": "/c/wonen/koken-bakken/pannen-messen"}, {"slug": "bakken", "naam": "Bakken", "verborgen": true, "naar": "/c/wonen/koken-bakken/bakken"}, {"slug": "kaas-serveerplanken", "naam": "Kaas- & serveerplanken", "verborgen": true, "naar": "/c/wonen/tafelen/borrelplanken-serveren"}, {"slug": "voorraadpotten", "naam": "Voorraadpotten", "verborgen": true, "naar": "/c/wonen/koken-bakken/opbergen-voorraadpotten"}, {"slug": "koken", "naam": "Koken", "verborgen": true, "naar": "/c/wonen/koken-bakken/pannen-messen"}, {"slug": "serveren", "naam": "Serveren", "verborgen": true, "naar": "/c/wonen/tafelen"}, {"slug": "opbergen", "naam": "Opbergen", "verborgen": true, "naar": "/c/wonen/koken-bakken/opbergen-voorraadpotten"}]}, {"slug": "dranken", "naam": "Dranken", "kort": "Dranken", "icoon": "glas", "verborgen": true, "naar": "/c/eten-drinken", "subs": [{"slug": "champagne-bubbels", "naam": "Champagne & bubbels", "verborgen": true, "naar": "/c/eten-drinken/bubbels"}, {"slug": "gin-cocktails", "naam": "Gin & cocktails", "verborgen": true, "naar": "/c/eten-drinken/sterke-drank/gin"}, {"slug": "wijn-port", "naam": "Wijn & port", "verborgen": true, "naar": "/c/eten-drinken/wijn"}, {"slug": "likeuren", "naam": "Likeuren", "verborgen": true, "naar": "/c/eten-drinken/sterke-drank/likeur"}, {"slug": "bier", "naam": "Bier & speciaalbier", "verborgen": true, "naar": "/c/eten-drinken/bier"}, {"slug": "wijnaccessoires", "naam": "Wijnaccessoires", "verborgen": true, "naar": "/c/eten-drinken/drankaccessoires"}, {"slug": "tequila", "naam": "Tequila & mezcal", "verborgen": true, "naar": "/c/eten-drinken/sterke-drank/tequila"}, {"slug": "alcoholvrij", "naam": "Alcoholvrij", "verborgen": true, "naar": "/c/eten-drinken/alcoholvrij"}, {"slug": "whisky", "naam": "Whisky", "verborgen": true, "naar": "/c/eten-drinken/sterke-drank/whisky"}, {"slug": "cognac", "naam": "Cognac", "verborgen": true, "naar": "/c/eten-drinken/sterke-drank/cognac"}, {"slug": "jenever", "naam": "Jenever", "verborgen": true, "naar": "/c/eten-drinken/sterke-drank/jenever"}, {"slug": "sake", "naam": "Sake", "verborgen": true, "naar": "/c/eten-drinken/wijn/sake"}, {"slug": "rum", "naam": "Rum", "verborgen": true, "naar": "/c/eten-drinken/sterke-drank/rum"}, {"slug": "wodka", "naam": "Wodka", "verborgen": true, "naar": "/c/eten-drinken/sterke-drank/wodka"}, {"slug": "cognac-brandy", "naam": "Cognac & brandy", "verborgen": true, "naar": "/c/eten-drinken/sterke-drank/cognac"}, {"slug": "gin", "naam": "Gin", "verborgen": true, "naar": "/c/eten-drinken/sterke-drank/gin"}, {"slug": "likeur", "naam": "Likeur", "verborgen": true, "naar": "/c/eten-drinken/sterke-drank/likeur"}, {"slug": "wijn", "naam": "Wijn", "verborgen": true, "naar": "/c/eten-drinken/wijn"}, {"slug": "bubbels", "naam": "Bubbels", "verborgen": true, "naar": "/c/eten-drinken/bubbels"}]}, {"slug": "metaaldetectie", "naam": "Metaaldetectie", "kort": "Metaaldetectie", "icoon": "detector", "verborgen": true, "naar": "/c/sport-outdoor/metaaldetectie", "subs": [{"slug": "munten-vondsten", "naam": "Munten & vondsten bewaren", "verborgen": true, "naar": "/c/sport-outdoor/metaaldetectie/munten-vondsten"}, {"slug": "detectors", "naam": "Metaaldetectors", "verborgen": true, "naar": "/c/sport-outdoor/metaaldetectie/metaaldetectors"}, {"slug": "magneetvissen", "naam": "Magneetvissen", "verborgen": true, "naar": "/c/sport-outdoor/metaaldetectie/magneetvissen"}, {"slug": "pinpointers-uitrusting", "naam": "Pinpointers & uitrusting", "verborgen": true, "naar": "/c/sport-outdoor/metaaldetectie/pinpointers-uitrusting"}, {"slug": "kinderen-beginners", "naam": "Voor kinderen & beginners", "verborgen": true, "naar": "/c/sport-outdoor/metaaldetectie/metaaldetectors"}, {"slug": "pinpointers", "naam": "Pinpointers", "verborgen": true, "naar": "/c/sport-outdoor/metaaldetectie/pinpointers-uitrusting"}, {"slug": "graven", "naam": "Scheppen & graven", "verborgen": true, "naar": "/c/sport-outdoor/metaaldetectie/pinpointers-uitrusting"}, {"slug": "accessoires", "naam": "Tassen & koptelefoons", "verborgen": true, "naar": "/c/sport-outdoor/metaaldetectie/pinpointers-uitrusting"}, {"slug": "vondsten", "naam": "Vondsten bewaren & boeken", "verborgen": true, "naar": "/c/sport-outdoor/metaaldetectie/munten-vondsten"}]}, {"slug": "noodpakket-survival", "naam": "Noodpakket & survival", "kort": "Noodpakket & survival", "icoon": "nood", "verborgen": true, "naar": "/c/sport-outdoor/noodpakket-survival", "subs": [{"slug": "noodpakketten", "naam": "Noodpakketten", "verborgen": true, "naar": "/c/sport-outdoor/noodpakket-survival/noodpakketten"}, {"slug": "noodradio", "naam": "Noodradio’s", "verborgen": true, "naar": "/c/sport-outdoor/noodpakket-survival/noodradio-s"}, {"slug": "licht-stroom", "naam": "Licht & stroom", "verborgen": true, "naar": "/c/sport-outdoor/noodpakket-survival/licht-stroom"}, {"slug": "water-eten", "naam": "Water & eten", "verborgen": true, "naar": "/c/sport-outdoor/noodpakket-survival/water-eten"}, {"slug": "koken-warmte", "naam": "Koken & warmte", "verborgen": true, "naar": "/c/sport-outdoor/noodpakket-survival/koken-warmte"}, {"slug": "ehbo-brand", "naam": "EHBO & brandveiligheid", "verborgen": true, "naar": "/c/sport-outdoor/noodpakket-survival/ehbo-brand"}, {"slug": "buiten-veld", "naam": "Buiten & in het veld", "verborgen": true, "naar": "/c/sport-outdoor/noodpakket-survival/tassen-onderweg"}, {"slug": "tassen-onderweg", "naam": "Tassen & onderweg", "verborgen": true, "naar": "/c/sport-outdoor/noodpakket-survival/tassen-onderweg"}]}, {"slug": "cadeaus", "naam": "Cadeaus", "kort": "Cadeaus", "icoon": "cadeau", "tekst": "Voor elke gelegenheid een bijzonder cadeau.", "tegel": "images/categorieen/categorie-cadeaus-gw.webp", "banner": "images/banners/banner-cat-cadeaus-gw.webp", "subs": [{"slug": "voor-haar", "naam": "Voor haar", "beeld": "images/sub/sub-voor-haar-gw.webp"}, {"slug": "voor-hem", "naam": "Voor hem", "beeld": "images/sub/sub-voor-hem-gw.webp"}, {"slug": "voor-kinderen", "naam": "Voor kinderen", "beeld": "images/sub/sub-voor-kinderen-gw.webp"}, {"slug": "kerst", "naam": "Kerstcadeaus", "beeld": "images/sub/sub-cadeaus-kerst-2026b.webp"}, {"slug": "sinterklaas", "naam": "Sinterklaas", "beeld": "images/sub/sub-cadeaus-sinterklaas.webp"}, {"slug": "sint-onder-15", "naam": "Sint onder €15", "tekst": "Snel een schoencadeautje of surprise nodig? Hier staat alles uit Sinterklaas onder de 15 euro.", "beeld": "images/sub/sub-cadeaus-sint-onder-15-2026b.webp"}, {"slug": "adventskalenders", "naam": "Adventskalenders", "beeld": "images/sub/sub-cadeaus-adventskalenders-2026b.webp"}, {"slug": "opa-oma", "naam": "Voor opa & oma", "beeld": "images/sub/sub-voor-opa-oma-gw.webp"}, {"slug": "collega", "naam": "Cadeau voor collega", "seoTitel": "Cadeau voor collega: leuke kleinigheidjes en bedankjes", "seoTekst": "Leuk cadeautje voor een collega? 200+ kleinigheidjes voor collega's: wijn, chocolade, borrelpakketten, mokken en pensioencadeaus. Voor lootjes, verjaardag of afscheid.", "beeld": "images/sub/sub-voor-collega-gw.webp", "tekst": "Een leuk cadeautje voor een collega? Kleinigheidjes voor collega's bij lootjes, een verjaardag of afscheid: wijn, chocolade, borrelpakketten en meer.", "gids": [{"kop": "Een cadeau voor een collega: waar let je op?", "tekst": "Je kent een collega vaak minder goed dan een vriend of familielid. Kies daarom iets wat bijna iedereen fijn vindt: iets lekkers, iets voor op het bureau of iets om thuis van te genieten. Een cadeau dat je samen met het team kunt delen, valt ook altijd goed."}, {"kop": "Lootjes trekken op het werk", "tekst": "Bij Sinterklaas of Kerst trekken veel teams lootjes. Meestal ligt het budget tussen de 5 en 15 euro. Gebruik de prijsknoppen hierboven om alleen cadeaus binnen jullie budget te zien."}, {"kop": "Een collega die afscheid neemt", "tekst": "Gaat een collega weg of met pensioen? Leg dan samen geld in voor iets groters, zoals een borrelpakket of een mooie planner voor de nieuwe baan."}, {"kop": "Een bedankje of een jarige collega", "tekst": "Voor een klein bedankje of een verjaardag is iets lekkers door de brievenbus, een plantje of een geurkaarsje vaak al genoeg. Klein, maar het laat zien dat je aan iemand denkt."}]}, {"slug": "baby-kraam", "naam": "Baby & kraam", "beeld": "images/sub/sub-voor-baby-gw.webp"}, {"slug": "onder-15", "naam": "Onder €15", "beeld": "images/sub/sub-cadeaus-onder-10-2026b.webp"}, {"slug": "met-naam", "naam": "Met naam", "beeld": "images/sub/sub-cadeaus-met-naam-2026b.webp"}, {"slug": "grappig", "naam": "Grappige cadeaus", "beeld": "images/producten/cg-useless-box.webp"}], "verborgen": true}, {"slug": "valentijn", "naam": "Liefde & Valentijn", "kort": "Liefde", "icoon": "hart", "tekst": "Romantische cadeaus voor iemand van wie je houdt, het hele jaar door.", "seoTitel": "Valentijnscadeau & romantische cadeaus voor je geliefde", "seoTekst": "Romantisch cadeau of valentijnscadeau nodig? Hartjessieraden, rozen die nooit verwelken, cadeaus met jullie namen en ideeën voor een romantische avond. Voor haar en voor hem.", "tegel": "images/categorieen/categorie-valentijn.webp", "banner": "images/banners/banner-cat-valentijn.webp", "subs": [{"slug": "voor-haar", "beeld": "images/sub/sub-valentijn-voor-haar.webp", "naam": "Voor haar", "seoTitel": "Valentijnscadeau voor haar: romantisch cadeau voor je vriendin", "tekst": "Een romantisch cadeau voor je vriendin of vrouw: hartjessieraden, rozen die nooit verwelken en kleine verwenmomentjes."}, {"slug": "voor-hem", "beeld": "images/sub/sub-valentijn-voor-hem.webp", "naam": "Voor hem", "seoTitel": "Valentijnscadeau voor hem: romantisch cadeau voor je vriend", "tekst": "Romantisch, maar niet zoetsappig: cadeaus voor je vriend of man die hij echt gebruikt."}, {"slug": "samen", "beeld": "images/sub/sub-valentijn-samen.webp", "naam": "Samen & jubileum", "seoTitel": "Cadeau voor 1 jaar samen, trouwdag of huwelijksjubileum", "tekst": "Voor jullie jaar samen, een trouwdag of 25, 40 of 50 jaar getrouwd: cadeaus die over jullie twee gaan."}, {"slug": "met-naam", "beeld": "images/sub/sub-valentijn-met-naam.webp", "naam": "Met naam & hartje", "seoTitel": "Romantisch cadeau met naam: sieraden met jullie namen", "tekst": "Persoonlijke cadeaus met een naam, jullie namen of een hartje. Echt voor haar of hem gemaakt."}, {"slug": "romantische-avond", "beeld": "images/sub/sub-valentijn-romantische-avond.webp", "naam": "Romantische avond", "seoTitel": "Romantische avond thuis: date-ideeën en cadeaus voor twee", "tekst": "Date-ideeën voor thuis: samen fonduen, hartjeswafels bakken, een spel voor twee of een sterrenhemel op het plafond."}, {"slug": "kleine-gebaren", "beeld": "images/sub/sub-valentijn-kleine-gebaren.webp", "naam": "Kleine liefdesgebaren", "seoTitel": "Klein romantisch cadeautje onder €25", "tekst": "Zomaar, gewoon omdat je van iemand houdt. Kleine cadeautjes onder de 25 euro met een groot gebaar."}], "gids": [{"kop": "Een romantisch cadeau kiezen", "tekst": "Het mooiste romantische cadeau laat zien dat je de ander echt kent. Denk aan een herinnering die jullie delen, iets met jullie namen of iets waar zij of hij al lang naar kijkt."}, {"kop": "Valentijn, maar ook het hele jaar door", "tekst": "Valentijnsdag is op 14 februari, maar liefde laat je het hele jaar zien: op jullie jubileum, een trouwdag of zomaar op een gewone dinsdag."}, {"kop": "Samen iets doen", "tekst": "Een gezamenlijke avond is vaak het mooiste cadeau. Fonduen, samen bakken of een spel voor twee: tijd samen zegt meer dan veel woorden."}], "verborgen": true}];
window.LK_HOME_GROEPEN = ['speelgoed', 'mode-sieraden', 'beauty-verzorging', 'elektronica', 'wonen', 'eten-drinken', 'hobby', 'sport-outdoor'];
/* ===== einde 3.0 ===== */
/* 9-11-2026 (GO Marius): bij Smartwatches knoppen Dames / Heren / Kinderen. Unisex-horloges staan bij Dames én Heren. */
(function () {
  var c = (window.LK_CATEGORIEEN || []).filter(function (x) { return x.slug === 'elektronica' && !x.verborgen; })[0];
  var s = c && (c.subs || []).filter(function (x) { return x.slug === 'smartwatches'; })[0];
  if (!s) return;
  s.knoppen = ['wie3snel'];
  var tekst = 'Een smartwatch wordt elke dag gebruikt. Kies bij Voor wie: Dames, Heren of Kinderen. Let op de telefoon: een Apple Watch werkt alleen met een iPhone, Samsung en OnePlus alleen met Android. ' +
    'Voor kinderen zijn er twee soorten: horloges waarmee je kind kan bellen en jij ziet waar het is (die hebben een simkaart met abonnement nodig), en horloges zonder simkaart, zoals walkietalkie-horloges en de KidiZoom.';
  (s.vakjes || []).forEach(function (v) { if (v.slug === 'smartwatches') { v.knoppen = ['wie3snel']; if (!v.tekst) v.tekst = tekst; } });
})();

/* 5-11-2026: nieuwe subcategorie-icoontjes van Marius (80 stuks, marineblauw met gouden rand). Alleen de plaatjes, verder verandert er niets. */
(function () {
  var I = {
"speelgoed/baby-peuter": "images/sub/iconen/icoon-speelgoed-baby-peuter.webp",
"speelgoed/bouwen": "images/sub/iconen/icoon-speelgoed-bouwen.webp",
"speelgoed/poppen-knuffels": "images/sub/iconen/icoon-speelgoed-poppen-knuffels.webp",
"speelgoed/speelfiguren-voertuigen": "images/sub/iconen/icoon-speelgoed-speelfiguren-voertuigen.webp",
"speelgoed/rollenspel-verkleden": "images/sub/iconen/icoon-speelgoed-rollenspel-verkleden.webp",
"speelgoed/knutselen": "images/sub/iconen/icoon-speelgoed-knutselen.webp",
"speelgoed/leren-ontdekken": "images/sub/iconen/icoon-speelgoed-leren-ontdekken.webp",
"speelgoed/buiten-spelen": "images/sub/iconen/icoon-speelgoed-buiten-spelen.webp",
"speelgoed/spellen": "images/sub/iconen/icoon-speelgoed-spellen.webp",
"speelgoed/puzzels": "images/sub/iconen/icoon-speelgoed-puzzels.webp",
"elektronica/audio": "images/sub/iconen/icoon-elektronica-audio.webp",
"elektronica/gaming": "images/sub/iconen/icoon-elektronica-gaming.webp",
"elektronica/smartwatches": "images/sub/iconen/icoon-elektronica-smartwatches.webp",
"elektronica/foto-video": "images/sub/iconen/icoon-elektronica-foto-video.webp",
"elektronica/tablets-ereaders": "images/sub/iconen/icoon-elektronica-tablets-ereaders.webp",
"elektronica/tv-beeld": "images/sub/iconen/icoon-elektronica-tv-beeld.webp",
"elektronica/slim-wonen": "images/sub/iconen/icoon-elektronica-slim-wonen.webp",
"elektronica/gadgets": "images/sub/iconen/icoon-elektronica-gadgets.webp",
"mode-sieraden/sieraden": "images/sub/iconen/icoon-mode-sieraden-sieraden.webp",
"mode-sieraden/horloges": "images/sub/iconen/icoon-mode-sieraden-horloges.webp",
"mode-sieraden/tassen-portemonnees": "images/sub/iconen/icoon-mode-sieraden-tassen-portemonnees.webp",
"mode-sieraden/accessoires": "images/sub/iconen/icoon-mode-sieraden-accessoires.webp",
"mode-sieraden/kleding": "images/sub/iconen/icoon-mode-sieraden-kleding.webp",
"mode-sieraden/schoenen-sloffen": "images/sub/iconen/icoon-mode-sieraden-schoenen-sloffen.webp",
"beauty-verzorging/parfum": "images/sub/iconen/icoon-beauty-verzorging-parfum.webp",
"beauty-verzorging/giftsets": "images/sub/iconen/icoon-beauty-verzorging-giftsets.webp",
"beauty-verzorging/bad-douche": "images/sub/iconen/icoon-beauty-verzorging-bad-douche.webp",
"beauty-verzorging/huid-gezicht": "images/sub/iconen/icoon-beauty-verzorging-huid-gezicht.webp",
"beauty-verzorging/make-up-nagels": "images/sub/iconen/icoon-beauty-verzorging-make-up-nagels.webp",
"beauty-verzorging/haar": "images/sub/iconen/icoon-beauty-verzorging-haar.webp",
"beauty-verzorging/scheren-baard": "images/sub/iconen/icoon-beauty-verzorging-scheren-baard.webp",
"beauty-verzorging/mond-tanden": "images/sub/iconen/icoon-beauty-verzorging-mond-tanden.webp",
"beauty-verzorging/wellness": "images/sub/iconen/icoon-beauty-verzorging-wellness.webp",
"wonen/woondecoratie": "images/sub/iconen/icoon-wonen-woondecoratie.webp",
"wonen/kaarsen-geur": "images/sub/iconen/icoon-wonen-kaarsen-geur.webp",
"wonen/verlichting": "images/sub/iconen/icoon-wonen-verlichting.webp",
"wonen/woontextiel": "images/sub/iconen/icoon-wonen-woontextiel.webp",
"wonen/foto-persoonlijk": "images/sub/iconen/icoon-wonen-foto-persoonlijk.webp",
"wonen/kerstdecoratie": "images/sub/iconen/icoon-wonen-kerstdecoratie.webp",
"wonen/koken-bakken": "images/sub/iconen/icoon-wonen-koken-bakken.webp",
"wonen/koffie-thee-zetten": "images/sub/iconen/icoon-wonen-koffie-thee-zetten.webp",
"wonen/tafelen": "images/sub/iconen/icoon-wonen-tafelen.webp",
"eten-drinken/chocolade-snoep": "images/sub/iconen/icoon-eten-drinken-chocolade-snoep.webp",
"eten-drinken/cadeaupakketten": "images/sub/iconen/icoon-eten-drinken-cadeaupakketten.webp",
"eten-drinken/koffie-thee-cacao": "images/sub/iconen/icoon-eten-drinken-koffie-thee-cacao.webp",
"eten-drinken/delicatessen": "images/sub/iconen/icoon-eten-drinken-delicatessen.webp",
"eten-drinken/wijn": "images/sub/iconen/icoon-eten-drinken-wijn.webp",
"eten-drinken/bubbels": "images/sub/iconen/icoon-eten-drinken-bubbels.webp",
"eten-drinken/bier": "images/sub/iconen/icoon-eten-drinken-bier.webp",
"eten-drinken/sterke-drank": "images/sub/iconen/icoon-eten-drinken-sterke-drank.webp",
"eten-drinken/alcoholvrij": "images/sub/iconen/icoon-eten-drinken-alcoholvrij.webp",
"eten-drinken/drankaccessoires": "images/sub/iconen/icoon-eten-drinken-drankaccessoires.webp",
"hobby/handwerken": "images/sub/iconen/icoon-hobby-handwerken.webp",
"hobby/schilderen-tekenen": "images/sub/iconen/icoon-hobby-schilderen-tekenen.webp",
"hobby/knutselen": "images/sub/iconen/icoon-hobby-knutselen.webp",
"hobby/modelbouw": "images/sub/iconen/icoon-hobby-modelbouw.webp",
"hobby/muziek-maken": "images/sub/iconen/icoon-hobby-muziek-maken.webp",
"hobby/papier-planners": "images/sub/iconen/icoon-hobby-papier-planners.webp",
"sport-outdoor/fietsen-steps": "images/sub/iconen/icoon-sport-outdoor-fietsen-steps.webp",
"sport-outdoor/darts": "images/sub/iconen/icoon-sport-outdoor-darts.webp",
"sport-outdoor/fitness-yoga": "images/sub/iconen/icoon-sport-outdoor-fitness-yoga.webp",
"sport-outdoor/wandelen-hardlopen": "images/sub/iconen/icoon-sport-outdoor-wandelen-hardlopen.webp",
"sport-outdoor/kamperen-outdoor": "images/sub/iconen/icoon-sport-outdoor-kamperen-outdoor.webp",
"sport-outdoor/balsport-spel": "images/sub/iconen/icoon-sport-outdoor-balsport-spel.webp",
"sport-outdoor/water-wintersport": "images/sub/iconen/icoon-sport-outdoor-water-wintersport.webp",
"sport-outdoor/metaaldetectie": "images/sub/iconen/icoon-sport-outdoor-metaaldetectie.webp",
"sport-outdoor/noodpakket-survival": "images/sub/iconen/icoon-sport-outdoor-noodpakket-survival.webp",
"tuin-klussen/tuin-planten": "images/sub/iconen/icoon-tuin-klussen-tuin-planten.webp",
"tuin-klussen/buiten-leven": "images/sub/iconen/icoon-tuin-klussen-buiten-leven.webp",
"tuin-klussen/tuingereedschap": "images/sub/iconen/icoon-tuin-klussen-tuingereedschap.webp",
"tuin-klussen/klussen": "images/sub/iconen/icoon-tuin-klussen-klussen.webp",
"boeken-media/boeken": "images/sub/iconen/icoon-boeken-media-boeken.webp",
"boeken-media/kinderboeken": "images/sub/iconen/icoon-boeken-media-kinderboeken.webp",
"boeken-media/films-series": "images/sub/iconen/icoon-boeken-media-films-series.webp",
"boeken-media/muziek": "images/sub/iconen/icoon-boeken-media-muziek.webp",
"dieren/hond": "images/sub/iconen/icoon-dieren-hond.webp",
"dieren/kat": "images/sub/iconen/icoon-dieren-kat.webp",
"dieren/klein-dier": "images/sub/iconen/icoon-dieren-klein-dier.webp",
"dieren/vogels-vissen": "images/sub/iconen/icoon-dieren-vogels-vissen.webp",
"dieren/paard": "images/sub/iconen/icoon-dieren-paard.webp"
};
  (window.LK_CATEGORIEEN || []).forEach(function (c) { (c.subs || []).forEach(function (s) { var b = I[c.slug + '/' + s.slug]; if (b) { s.beeld = b; s.icoon2026 = true; } }); });
})();
/* CODES-START: gemaakt door scripts/codes/maak.py op 2026-11-06 uit de exports van de netwerken. Niet met de hand aanpassen. */
window.LK_CODES = [{"id": "a3519202","winkel": "Flextail","titel": "15% op de Ezy Set","tekst": "Met deze code krijg je 15% korting op de Vollyc Ezy Set, die je bagage tot 85% kleiner maakt.","code": "ULElectricGear15","badge": "15%","vanaf": "2025-10-30","tot": "2026-12-31","link": "https://www.awin1.com/cread.php?awinmid=60295&awinaffid=3110079&campaign=DTC+Promotion&ued=https%3A%2F%2Fwww.flextail.com%2Fproducts%2Fvollyc-ezy-set-crush-space-with-85-compression","logo": "","voorwaarden": ""},{"id": "d50049","winkel": "CEWE","titel": "Gratis verzending op alle kalenders","tekst": "Met deze code betaal je geen verzendkosten op CEWE-kalenders en adventskalenders. De code is één keer te gebruiken.","code": "SHIPCAL26","badge": "Gratis verzending","vanaf": "2026-10-26","tot": "2027-01-10","link": "https://lt45.net/c/?si=11918&li=1986874&wi=433339&ws=","logo": "https://images.daisycon.io/program/?width=160&height=160&color=ffffff&program=11918","voorwaarden": "Deze code is eenmalig te gebruiken voor gratis verzending op kalenders en adventskalenders De code is geldig t.e.m. 10-1-2027 en kan niet gecombineerd worden met andere kortingscodes."},{"id": "a3911477","winkel": "Flextail","titel": "10% op de Zero Lantern","tekst": "Met deze code krijg je 10% korting op de nieuwe Zero Lantern: een campinglamp van maar 56 gram.","code": "NEW10","badge": "10%","vanaf": "2026-05-25","tot": "2028-12-31","link": "https://www.awin1.com/cread.php?awinmid=60295&awinaffid=3110079&campaign=flextailpromo10&ued=https%3A%2F%2Fwww.flextail.com%2Fproducts%2Fzero-lantern-56g-uitralight-2-in-1-camping-lantern","logo": "","voorwaarden": ""},{"id": "d50304","winkel": "LEGO","titel": "Gratis LEGO-cadeau bij je bestelling","tekst": "Bij €130 of meer aan LEGO krijg je gratis LEGO Ideas Build, Paint and Play (40889). Bij €40 of meer aan Star Wars-sets krijg je de Razor Crest mini-build (30728). Zolang de voorraad strekt.","code": "","badge": "Cadeau","vanaf": "2026-11-03","tot": "2026-11-08","link": "https://bdt9.net/c/?si=18488&li=1989649&wi=433339&ws=","logo": "https://images.daisycon.io/program/?width=160&height=160&color=ffffff&program=18488","voorwaarden": ""},{"id": "d50009","winkel": "CEWE","titel": "Gratis fotokalender bij je fotoboek","tekst": "Bestel uiterlijk 8 november een CEWE-fotoboek vanaf €50 en krijg een code voor een A4-wandkalender t.w.v. €17,95.","code": "","badge": "Cadeau","vanaf": "2026-10-21","tot": "2026-11-08","link": "https://lt45.net/c/?si=11918&li=1986834&wi=433339&ws=","logo": "https://images.daisycon.io/program/?width=160&height=160&color=ffffff&program=11918","voorwaarden": "De persoonlijke code wordt na aankoop via de bevestigingsmail bezorgd. De code is geldig t.e.m. 30 november 2026 en kan niet gecombineerd worden met andere kortingscodes. Kost je kalender minder dan €17,95, wordt het restbedrag niet uitbetaald. Is je kalender duurder dan €17,95? Dan wordt dit bedrag van het totaalbedrag afgetrokken."},{"id": "d50479","winkel": "AllSaints","titel": "Extra 20% op de sale + gratis verzending","tekst": "Black Friday warm-up: extra 20% korting op wat al in de sale staat, en gratis verzending.","code": "","badge": "20%","vanaf": "2026-11-05","tot": "2026-11-09","link": "https://glp8.net/c/?si=20868&li=1990644&wi=433339&ws=","logo": "https://images.daisycon.io/program/?width=160&height=160&color=ffffff&program=20868","voorwaarden": ""},{"id": "a4161272","winkel": "Street One","titel": "Tot 50% korting op jurken","tekst": "Een selectie damesjurken met tot 50% korting. De korting zit al in de prijs.","code": "","badge": "tot 50%","vanaf": "2026-11-04","tot": "2026-11-10","link": "https://www.awin1.com/cread.php?awinmid=16112&awinaffid=3110079&ued=https%3A%2F%2Fwww.street-one.nl%2Fc%2Fdames%2Fsale%2Fjurken%2F-s-998-10330795%2F%3Fsort%3Ddiscount","logo": "","voorwaarden": "Geldig voor een selectie van artikelen. Artikelen zijn al afgeprijsd in de winkel. Alleen online verkrijgbaar. Zolang de voorraad strekt!","shop": "Street-One NL"},{"id": "a4154224","winkel": "EMP","titel": "Tot 70% korting op de sale","tekst": "Voor korte tijd: tot 70% korting op geselecteerde kleding, merchandise en must-haves. De korting zit al in de prijs.","code": "","badge": "tot 70%","vanaf": "2026-11-04","tot": "2026-11-11","link": "https://www.awin1.com/cread.php?awinmid=39930&awinaffid=3110079&ued=https%3A%2F%2Fwww.large.nl%2Fsale%2F","logo": "","voorwaarden": "*Geldt alleen online en voor een geselecteerd assortiment. De producten zijn al afgeprijsd en de actiekorting is hierin verwerkt. Slechts voor korte tijd en zolang de voorraad strekt."},{"id": "a4145679","winkel": "Street One","titel": "Tot 50% op de herensale","tekst": "Geselecteerde herenartikelen uit de sale met tot 50% korting. De korting zit al in de prijs.","code": "","badge": "tot 50%","vanaf": "2026-10-21","tot": "2026-11-17","link": "https://www.awin1.com/cread.php?awinmid=16112&awinaffid=3110079&ued=https%3A%2F%2Fwww.street-one.nl%2Fc%2Fheren%2Fsale%2F-s-978%2F","logo": "","voorwaarden": "Geldt voor geselecteerde artikelen. De items zijn al afgeprijsd in de winkel. Alleen online verkrijgbaar. Alleen zolang de voorraad strekt!","shop": "Street-One NL"},{"id": "a4130666","winkel": "Yves Rocher","titel": "Tot 50% korting op een selectie","tekst": "Geselecteerde Yves Rocher-producten met tot 50% korting. Gratis levering vanaf €30.","code": "","badge": "tot 50%","vanaf": "2026-10-15","tot": "2026-11-17","link": "https://www.awin1.com/cread.php?awinmid=120131&awinaffid=3110079&ued=https%3A%2F%2Fwww.yves-rocher.nl%2Fc%2Fpromo","logo": "","voorwaarden": ""},{"id": "a4153800","winkel": "Street One","titel": "10% korting als lid","tekst": "Word gratis lid en krijg 10% korting. Niet op artikelen die al zijn afgeprijsd.","code": "","badge": "10%","vanaf": "2026-10-28","tot": "2026-11-24","link": "https://www.awin1.com/cread.php?awinmid=16112&awinaffid=3110079&ued=https%3A%2F%2Fwww.street-one.nl%2F","logo": "","voorwaarden": "Alleen geldig bij aanmelding als lid. Niet geldig op artikelen die al zijn afgeprijsd. Eenmalig te gebruiken per bestelling. Niet te combineren met andere kortingsacties.","shop": "Street-One NL"},{"id": "d49278","winkel": "Wijnkring","titel": "Salentein-wijn bijna 25% goedkoper","tekst": "Salentein Barrel Selection voor €11,99 in plaats van €15,95 per fles bij 6 flessen. Minder flessen? Dan krijg je 12% korting.","code": "","badge": "25%","vanaf": "2026-10-12","tot": "2026-11-29","link": "https://bdt9.net/c/?si=18166&li=1972033&wi=433339&ws=","logo": "https://images.daisycon.io/program/?width=160&height=160&color=ffffff&program=18166","voorwaarden": "Bij aankoop van minimaal 6 flessen Barrel Selection / 6 flessen Sparkling Brut of 3 flessen Magnum (Malbec of Sparkling) op www.wijnkring.nl, kan je op de afrekenpagina aanvinken of je deelneemt aan deze actie. Je hoeft geen actiecode in te vullen, je deelname wordt automatisch verwerkt. Deelname via de webshop is mogelijk t/m 29 november 2026. Je ontvangt een bevestiging van je deelname per mail."},{"id": "a4161418","winkel": "Flextail","titel": "Black Friday: tot 45% korting","tekst": "Slimme, lichte outdoorspullen van Flextail met tot 45% korting.","code": "","badge": "tot 45%","vanaf": "2026-11-04","tot": "2026-12-10","link": "https://www.awin1.com/cread.php?awinmid=60295&awinaffid=3110079&ued=https%3A%2F%2Fwww.flextail.com%2Fcollections%2Fsale","logo": "","voorwaarden": ""},{"id": "a4075833","winkel": "Yves Rocher","titel": "Adventskalender 2026","tekst": "24 deurtjes met 24 beautyverrassingen tot Kerstmis. Leuk om cadeau te doen of zelf te houden.","code": "","badge": "Cadeau","vanaf": "2026-09-17","tot": "2026-12-31","link": "https://www.awin1.com/cread.php?awinmid=120131&awinaffid=3110079&ued=https%3A%2F%2Fwww.yves-rocher.nl%2Fadventskalender","logo": "","voorwaarden": ""},{"id": "a4023867","winkel": "Yves Rocher","titel": "1 kopen = 1 gratis","tekst": "Kies je favoriete product en krijg een tweede gratis. De korting gaat vanzelf in je winkelmandje.","code": "","badge": "Cadeau","vanaf": "2026-07-30","tot": "2026-12-31","link": "https://www.awin1.com/cread.php?awinmid=120131&awinaffid=3110079&ued=https%3A%2F%2Fwww.yves-rocher.nl%2Fc%2F1plus1","logo": "","voorwaarden": ""},{"id": "a3989345","winkel": "EMP","titel": "15% korting via de nieuwsbrief","tekst": "Schrijf je in voor de nieuwsbrief en krijg een code voor 15% korting, 4 weken geldig.","code": "","badge": "15%","vanaf": "2026-07-06","tot": "2026-12-31","link": "https://www.awin1.com/cread.php?awinmid=39930&awinaffid=3110079&ued=https%3A%2F%2Fwww.large.nl%2Fnewsletter%2F","logo": "","voorwaarden": "4 weken geldig. Alleen online inwisselbaar. Niet combineerbaar met andere acties. Na het invoeren van de code wordt de korting automatisch in je winkelmandje verrekend. Boeken, media, tickets, Rammstein, Die Ärzte, Die Toten Hosen, Feine Sahne Fischfilet, Broilers, Böse Onkelz, cadeaubonnen en artikelen die een donatie bevatten, zijn uitgesloten van deze actie."},{"id": "d49750","winkel": "Joybuy","titel": "Tot 60% korting op baby en wonen","tekst": "Joybuy heeft babyspullen en woonartikelen met kortingen tot 60%.","code": "","badge": "tot 60%","vanaf": "2026-10-22","tot": "2026-12-31","link": "https://glp8.net/c/?si=20823&li=1982085&wi=433339&ws=","logo": "https://images.daisycon.io/program/?width=160&height=160&color=ffffff&program=20823","voorwaarden": ""},{"id": "d49740","winkel": "Joybuy","titel": "Elke donderdag €5 korting","tekst": "Kortingen tot 60%, en elke donderdag €5 extra korting bij een bestelling vanaf €20.","code": "","badge": "€5","vanaf": "2026-10-22","tot": "2026-12-31","link": "https://glp8.net/c/?si=20823&li=1982075&wi=433339&ws=","logo": "https://images.daisycon.io/program/?width=160&height=160&color=ffffff&program=20823","voorwaarden": ""},{"id": "d45131","winkel": "WoodWick","titel": "Geuren van de maand 25% goedkoper","tekst": "Elke maand twee bijzondere WoodWick-geuren met 25% korting. De korting zit al in de prijs.","code": "","badge": "25%","vanaf": "2026-06-24","tot": "2026-12-31","link": "https://glp8.net/c/?si=21919&li=1928665&wi=433339&ws=","logo": "https://images.daisycon.io/program/?width=160&height=160&color=ffffff&program=21919","voorwaarden": "De korting is automatisch verwerkt in de actieprijzen. Geldig zolang de actie loopt en zolang de voorraad strekt. Niet geldig in combinatie met andere kortingscodes of acties."},{"id": "d38581","winkel": "Kaartje2go","titel": "10% korting op trouwkaarten","tekst": "Schrijf je in voor de actie en krijg 10% korting op save-the-dates, uitnodigingen, menu’s en bedankkaarten. Elke maand maak je ook kans op €250 kaarttegoed.","code": "","badge": "10%","vanaf": "2024-08-23","tot": "2027-01-31","link": "https://fr135.net/c/?si=19520&li=1840498&wi=433339&ws=","logo": "https://images.daisycon.io/program/?width=160&height=160&color=ffffff&program=19520","voorwaarden": "Wij behouden ons het recht om de voorwaarden van de actie te wijzigen of de actie vroegtijdig stop te zetten. Slecht 1 persoon van het bruidspaar kan zich inschrijven voor deze actie De korting is geldig op save-the-datekaarten, uitnodigingen, menu’s en bedankkaarten"},{"id": "d36056","winkel": "FOREO","titel": "15% korting voor nieuwe klanten","tekst": "Bestel je voor het eerst bij FOREO? Dan krijg je 15% korting op het hele assortiment.","code": "","badge": "15%","vanaf": "2022-03-30","tot": "2028-03-30","link": "https://jf79.net/c/?si=16254&li=1829615&wi=433339&ws=","logo": "https://images.daisycon.io/program/?width=160&height=160&color=ffffff&program=16254","voorwaarden": ""},{"id": "d41349","winkel": "Timberland","titel": "10% korting als lid","tekst": "Word gratis lid van de Timberland-community en krijg 10% korting op je volgende aankoop.","code": "","badge": "10%","vanaf": "2022-06-21","tot": "2028-06-20","link": "https://rkn3.net/c/?si=15048&li=1871693&wi=433339&ws=","logo": "https://images.daisycon.io/program/?width=160&height=160&color=ffffff&program=15048","voorwaarden": ""},{"id": "d41048","winkel": "Eastpak","titel": "15% korting via de nieuwsbrief","tekst": "Schrijf je in voor de nieuwsbrief van Eastpak en krijg 15% korting.","code": "","badge": "15%","vanaf": "2023-06-29","tot": "2029-06-28","link": "https://glp8.net/c/?si=20076&li=1868282&wi=433339&ws=","logo": "https://images.daisycon.io/program/?width=160&height=160&color=ffffff&program=20076","voorwaarden": ""},{"id": "d41047","winkel": "Eastpak","titel": "Gratis verzending vanaf €40","tekst": "Bij Eastpak betaal je geen verzendkosten vanaf €40.","code": "","badge": "Gratis verzending","vanaf": "2023-06-29","tot": "2029-06-28","link": "https://glp8.net/c/?si=20076&li=1868281&wi=433339&ws=","logo": "https://images.daisycon.io/program/?width=160&height=160&color=ffffff&program=20076","voorwaarden": ""},{"id": "d49835","winkel": "AllSaints","titel": "10% korting op je eerste bestelling","tekst": "Schrijf je in voor de nieuwsbrief van AllSaints en krijg 10% korting op je eerste bestelling.","code": "","badge": "10%","vanaf": "2026-10-22","tot": "2030-12-31","link": "https://glp8.net/c/?si=20868&li=1982265&wi=433339&ws=","logo": "https://images.daisycon.io/program/?width=160&height=160&color=ffffff&program=20868","voorwaarden": ""},{"id": "d25601","winkel": "Dr. Martens","titel": "10% korting voor nieuwe leden","tekst": "Schrijf je in bij Dr. Martens en krijg 10% korting als nieuw lid.","code": "","badge": "10%","vanaf": "2024-11-20","tot": "2030-12-31","link": "https://fr135.net/c/?si=15138&li=1726781&wi=433339&ws=","logo": "https://images.daisycon.io/program/?width=160&height=160&color=ffffff&program=15138","voorwaarden": ""},{"id": "d44487","winkel": "Levi's","titel": "10% korting via de nieuwsbrief","tekst": "Schrijf je in voor de nieuwsbrief van Levi's en krijg 10% korting op je bestelling.","code": "","badge": "10%","vanaf": "2025-12-06","tot": "2031-12-06","link": "https://glp8.net/c/?si=19949&li=1918748&wi=433339&ws=","logo": "https://images.daisycon.io/program/?width=160&height=160&color=ffffff&program=19949","voorwaarden": ""},{"id": "d38747","winkel": "Decantalo","titel": "Gratis verzending vanaf €150","tekst": "Bij Decántalo betaal je geen verzendkosten bij bestellingen boven €150.","code": "","badge": "Gratis verzending","vanaf": "2024-09-18","tot": "2032-01-01","link": "https://bdt9.net/c/?si=18645&li=1842632&wi=433339&ws=","logo": "https://images.daisycon.io/program/?width=160&height=160&color=ffffff&program=18645","voorwaarden": ""},{"id": "d34864","winkel": "Decantalo","titel": "Wijn-outlet","tekst": "Een hele wijnafdeling van Decántalo in de aanbieding.","code": "","badge": "Actie","vanaf": "2024-03-05","tot": "2032-01-01","link": "https://bdt9.net/c/?si=18645&li=1820587&wi=433339&ws=","logo": "https://images.daisycon.io/program/?width=160&height=160&color=ffffff&program=18645","voorwaarden": ""}];
/* CODES-END */

/* 5-11-2026: nieuwe ronde plaatjes van Marius voor Gelegenheden en Voor wie, en een nieuwe banner bovenaan. */
(function () {
  var G = ['sinterklaas','kerst','moederdag','vaderdag','geboorte','valentijn','verjaardag','jubileum','housewarming','bedankt','juf-meester','uitdeelcadeautjes','beterschap','geslaagd','afscheid-pensioen','doop-belijdenis'];
  (window.LK_GELEGENHEDEN || []).forEach(function (g) { if (G.indexOf(g.slug) !== -1) g.beeld = 'images/sub/rond/gel-' + g.slug + '.webp'; });
  var V = ['hem','haar','kinderen','tieners','opa-oma','collega','baby'];
  (window.LK_PERSONEN || []).forEach(function (p) { if (V.indexOf(p.slug) !== -1) p.beeld = 'images/sub/rond/voor-' + p.slug + '.webp'; });
  var I = window.LK_INSTELLINGEN; if (I) { I.heroDesktop = 'images/banners/banner-home-2026-desktop.webp'; I.heroMobiel = 'images/banners/banner-home-2026-mobiel.webp'; I.heroNieuw = true; }
})();

/* 6-11-2026: nieuwe ronde icoontjes van Marius voor Liefde & Valentijn, Christelijk (incl. Doop & belijdenis) en de collecties. */
(function () {
  var R = 'images/sub/rond/';
  [['valentijn', 'val', ['voor-haar', 'voor-hem', 'samen', 'met-naam', 'romantische-avond', 'kleine-gebaren']],
   ['christelijk', 'chr', ['bijbels-psalmboeken', 'boeken-muziek', 'sieraden', 'wanddecoratie-teksten', 'kerst', 'doop-belijdenis', 'voor-kinderen']]].forEach(function (d) {
    var c = window.LK_CAT && window.LK_CAT(d[0]); if (!c) return;
    c.allesBeeld = R + d[1] + '-alles.webp';
    (c.subs || []).forEach(function (s) { if (d[2].indexOf(s.slug) !== -1) { s.beeld = R + d[1] + '-' + s.slug + '.webp'; s.icoon2026 = true; } });
  });
  (window.LK_COLLECTIES || []).forEach(function (g) { g.beeld = R + 'col-' + g.slug + '.webp'; });
})();

/* 6-11-2026: nieuwe ronde icoontjes van Marius voor de afdeling Cadeaus. */
(function () {
  var c = window.LK_CAT && window.LK_CAT('cadeaus'); if (!c) return;
  var R = 'images/sub/rond/cad-';
  c.allesBeeld = R + 'alles.webp';
  var S = ['voor-haar', 'voor-hem', 'voor-kinderen', 'kerst', 'sinterklaas', 'sint-onder-15', 'opa-oma', 'collega', 'baby-kraam', 'onder-15', 'met-naam', 'grappig'];
  (c.subs || []).forEach(function (s) { if (S.indexOf(s.slug) !== -1) { s.beeld = R + s.slug + '.webp'; s.icoon2026 = true; } });
})();

window.LK_ZG_NAMEN = {"001_beauty-en-verzorging": "Beauty & verzorging", "002_boeken-films-en-muziek": "Boeken, films & muziek", "003_cadeaus": "Cadeaus", "004_christelijke-cadeaus": "Christelijke cadeaus", "005_dieren": "Dieren", "006_elektronica-en-gaming": "Elektronica & gaming", "007_eten-en-drinken": "Eten & drinken", "008_hobby-en-creatief": "Hobby & creatief", "009_mode-en-sieraden": "Mode & sieraden", "010_speelgoed-en-spellen": "Speelgoed & spellen", "011_sport-en-buiten": "Sport & buiten", "012_tuin-en-klussen": "Tuin & klussen", "013_liefde-en-valentijn": "Liefde & valentijn", "014_wonen-en-koken": "Wonen & koken", "015_geboorte-en-kraam": "Geboorte & kraam", "016_voor-hem": "Voor hem", "017_voor-haar": "Voor haar", "018_kinderen": "Kinderen", "019_tieners": "Tieners", "020_opa-en-oma": "Opa & oma", "021_collega-s": "Collega's", "022_horloges-en-sieraden": "Horloges & sieraden", "023_darts-en-sport": "Darts & sport", "024_zakmessen-en-gereedschap": "Zakmessen & gereedschap", "025_parfum-en-verzorging": "Parfum & verzorging", "026_whisky-bier-en-drank": "Whisky, bier & drank", "027_lego-en-spellen": "LEGO & spellen", "028_portemonnees-en-tassen": "Portemonnees & tassen", "029_pantoffels-en-kleding": "Pantoffels & kleding", "030_metaaldetectie": "Metaaldetectie", "031_gadgets-en-gaming": "Gadgets & gaming", "032_bbq-en-lekkers": "BBQ & lekkers", "033_boeken-en-muziek": "Boeken & muziek", "034_wonen-en-keuken": "Wonen & keuken", "035_gaming-en-gadgets": "Gaming & gadgets", "036_geuren-en-skincare": "Geuren & skincare", "037_sieraden": "Sieraden", "038_lego-en-creatief": "LEGO & creatief", "039_spellen-en-puzzels": "Spellen & puzzels", "040_kamer-en-sfeer": "Kamer & sfeer", "041_sport-en-darts": "Sport & darts", "042_mode-en-accessoires": "Mode & accessoires", "043_boeken-en-journals": "Boeken & journals", "044_lekkers-en-bakken": "Lekkers & bakken", "045_metaaldetectie": "Metaaldetectie", "046_puzzels-en-spellen": "Puzzels & spellen", "047_foto-s-en-herinneringen": "Foto’s & herinneringen", "048_tuin-en-vogels": "Tuin & vogels", "049_warm-en-comfortabel": "Warm & comfortabel", "050_radio-en-muziek": "Radio & muziek", "051_koffie-en-thee": "Koffie & thee", "052_wonen-en-klokken": "Wonen & klokken", "053_keuken": "Keuken", "054_boeken": "Boeken", "055_lekkers-en-drank": "Lekkers & drank", "056_bouwen-en-lego": "Bouwen & LEGO", "057_knutselen-en-creatief": "Knutselen & creatief", "058_buitenspeelgoed": "Buitenspeelgoed", "059_poppen-auto-s-en-knuffels": "Poppen, auto’s & knuffels", "060_spellen-en-puzzels": "Spellen & puzzels", "061_kinderboeken": "Kinderboeken", "062_gaming-en-gadgets": "Gaming & gadgets", "063_kinderkamer": "Kinderkamer", "064_sinterklaas": "Sinterklaas", "065_schoenen-en-kleding": "Schoenen & kleding", "066_lekkers": "Lekkers", "067_tuin-en-natuur": "Tuin & natuur", "068_kraamcadeaus-en-pakketten": "Kraamcadeaus & pakketten", "069_babykleding-en-dekentjes": "Babykleding & dekentjes", "070_speelkleden-en-rammelaars": "Speelkleden & rammelaars", "071_knuffels-met-naam": "Knuffels met naam", "072_babyshower": "Babyshower", "073_sieraden": "Sieraden", "074_wonen-en-sfeer": "Wonen & sfeer", "075_bloemen-en-planten": "Bloemen & planten", "076_puzzels-en-spellen": "Puzzels & spellen", "077_tassen-en-portemonnees": "Tassen & portemonnees", "078_champagne-wijn-en-lekkers": "Champagne, wijn & lekkers", "079_horloges": "Horloges", "080_parfum-en-verzorging": "Parfum & verzorging", "081_pantoffels-sjaals-en-kleding": "Pantoffels, sjaals & kleding", "082_haken-breien-en-creatief": "Haken, breien & creatief", "083_yoga-en-sport": "Yoga & sport", "084_boeken-en-agenda-s": "Boeken & agenda's", "085_keuken-koffie-en-thee": "Keuken, koffie & thee", "086_met-naam": "Met naam", "087_gadgets-en-audio": "Gadgets & audio", "088_afscheid-en-pensioen": "Afscheid & pensioen", "089_bedankje": "Bedankje", "090_lootjes-en-kleinigheidjes": "Lootjes & kleinigheidjes", "091_verjaardag": "Verjaardag", "092_trouwen-en-jubileum": "Trouwen & jubileum", "093_housewarming": "Housewarming", "094_bedankt": "Bedankt", "095_afscheid-en-pensioen": "Afscheid & pensioen", "096_beterschap-en-sterkte": "Beterschap & sterkte", "097_uitdeelcadeautjes": "Uitdeelcadeautjes", "098_moederdag": "Moederdag", "099_vaderdag": "Vaderdag", "100_juf-en-meester": "Juf & meester"};
/* 7-11-2026: nieuwe zwart-gouden icoontjes van Marius (100 stuks) voor de afdelingen, Voor wie (met hun vakjes) en Gelegenheden.
   Koppeling op naam, precies zoals in zijn mapping.csv. De oude sfeerfoto blijft de wazige achtergrond bovenaan de pagina. */
/* 8-11-2026 (wens Marius): de zwart-gouden rondjes staan weer UIT, de foto-rondjes van daarvoor zijn terug. Weer aanzetten: haal de 'return;' hieronder weg. */
(function () {
  return;
  var R = 'images/sub/zg/';
  var AFD = { 'beauty-verzorging': '001_beauty-en-verzorging', 'boeken-media': '002_boeken-films-en-muziek', 'cadeaus': '003_cadeaus', 'christelijk': '004_christelijke-cadeaus',
    'dieren': '005_dieren', 'elektronica': '006_elektronica-en-gaming', 'eten-drinken': '007_eten-en-drinken', 'hobby': '008_hobby-en-creatief', 'mode-sieraden': '009_mode-en-sieraden',
    'speelgoed': '010_speelgoed-en-spellen', 'sport-outdoor': '011_sport-en-buiten', 'tuin-klussen': '012_tuin-en-klussen', 'valentijn': '013_liefde-en-valentijn', 'wonen': '014_wonen-en-koken' };
  (window.LK_CATEGORIEEN || []).forEach(function (c) { if (AFD[c.slug]) c.rond = R + AFD[c.slug] + '.webp'; });
  var VOOR = { baby: '015_geboorte-en-kraam', hem: '016_voor-hem', haar: '017_voor-haar', kinderen: '018_kinderen', tieners: '019_tieners', 'opa-oma': '020_opa-en-oma', collega: '021_collega-s' };
  var SUB = {
    hem: ['022_horloges-en-sieraden', '023_darts-en-sport', '024_zakmessen-en-gereedschap', '025_parfum-en-verzorging', '026_whisky-bier-en-drank', '027_lego-en-spellen', '028_portemonnees-en-tassen', '029_pantoffels-en-kleding', '030_metaaldetectie', '031_gadgets-en-gaming', '032_bbq-en-lekkers', '033_boeken-en-muziek', '034_wonen-en-keuken'],
    tieners: ['035_gaming-en-gadgets', '036_geuren-en-skincare', '037_sieraden', '038_lego-en-creatief', '039_spellen-en-puzzels', '040_kamer-en-sfeer', '041_sport-en-darts', '042_mode-en-accessoires', '043_boeken-en-journals', '044_lekkers-en-bakken', '045_metaaldetectie'],
    'opa-oma': ['046_puzzels-en-spellen', '047_foto-s-en-herinneringen', '048_tuin-en-vogels', '049_warm-en-comfortabel', '050_radio-en-muziek', '051_koffie-en-thee', '052_wonen-en-klokken', '053_keuken', '054_boeken', '055_lekkers-en-drank'],
    kinderen: ['056_bouwen-en-lego', '057_knutselen-en-creatief', '058_buitenspeelgoed', '059_poppen-auto-s-en-knuffels', '060_spellen-en-puzzels', '061_kinderboeken', '062_gaming-en-gadgets', '063_kinderkamer', '064_sinterklaas', '065_schoenen-en-kleding', '066_lekkers', '067_tuin-en-natuur'],
    baby: ['068_kraamcadeaus-en-pakketten', '069_babykleding-en-dekentjes', '070_speelkleden-en-rammelaars', '071_knuffels-met-naam', '072_babyshower'],
    haar: ['073_sieraden', '074_wonen-en-sfeer', '075_bloemen-en-planten', '076_puzzels-en-spellen', '077_tassen-en-portemonnees', '078_champagne-wijn-en-lekkers', '079_horloges', '080_parfum-en-verzorging', '081_pantoffels-sjaals-en-kleding', '082_haken-breien-en-creatief', '083_yoga-en-sport', '084_boeken-en-agenda-s', '085_keuken-koffie-en-thee', '086_met-naam', '087_gadgets-en-audio'],
    collega: ['088_afscheid-en-pensioen', '089_bedankje', '090_lootjes-en-kleinigheidjes'] };
  var NAMEN = window.LK_ZG_NAMEN || {};
  (window.LK_PERSONEN || []).forEach(function (p) {
    if (VOOR[p.slug]) { p.vaag = p.vaag || p.beeld; p.beeld = R + VOOR[p.slug] + '.webp'; }
    var l = SUB[p.slug]; if (!l) return;
    (p.subs || []).forEach(function (s, i) { var f = l.filter(function (x) { return NAMEN[x] === s.naam; })[0]; if (f) { s.beeld = R + f + '.webp'; s.icoon2026 = true; } });
  });
  var GEL = { verjaardag: '091_verjaardag', jubileum: '092_trouwen-en-jubileum', housewarming: '093_housewarming', bedankt: '094_bedankt', 'afscheid-pensioen': '095_afscheid-en-pensioen',
    beterschap: '096_beterschap-en-sterkte', uitdeelcadeautjes: '097_uitdeelcadeautjes', moederdag: '098_moederdag', vaderdag: '099_vaderdag', 'juf-meester': '100_juf-en-meester' };
  (window.LK_GELEGENHEDEN || []).forEach(function (g) { if (GEL[g.slug]) { g.vaag = g.vaag || g.beeld; g.beeld = R + GEL[g.slug] + '.webp'; } });
})();
