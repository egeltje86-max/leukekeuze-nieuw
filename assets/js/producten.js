/* =========================================================
   LeukeKeuze – productenlijst
   LET OP: dit zijn VOORBEELDPRODUCTEN om de site te testen.
   De foto's zijn sfeerbeelden van Nova, geen echte producten.
   Ze hebben geen link en worden later vervangen door echte
   producten van partnerwinkels (met hun eigen productfoto).

   status: 'nieuw' = nog keuren | 'goedgekeurd' = zichtbaar | 'afgewezen' = niet tonen
   cat/sub: hoofdplek.  ookIn: extra plekken ('categorie/sub').
   voor/moment: gebruikt door VONK.
   ========================================================= */

window.LK_PRODUCTEN = [
  { id: 'vb-01', titel: 'Geurkaarsen in fluweel, set van 2', prijs: 24.95, shop: 'Voorbeeldwinkel', url: '',
    beeld: 'images/producten/voorbeeld-product-1', cat: 'wonen', sub: 'kaarsen-geur',
    ookIn: ['cadeaus/voor-haar', 'cadeaus/kerst', 'cadeaus/opa-oma'], voor: ['haar', 'opa-oma', 'iedereen'], moment: ['kerst', 'verjaardag', 'zomaar'],
    waarom: 'Warm licht en een zachte geur maken elke avond gezellig. Mooi verpakt, dus direct klaar om te geven.',
    status: 'goedgekeurd', voorbeeld: true, populair: true },
  { id: 'vb-02', titel: 'Eau de parfum, warme amber', prijs: 39.95, shop: 'Voorbeeldwinkel', url: '',
    beeld: 'images/producten/voorbeeld-product-2', cat: 'mode-beauty', sub: 'geuren',
    ookIn: ['cadeaus/voor-haar', 'cadeaus/kerst'], voor: ['haar'], moment: ['kerst', 'verjaardag'],
    waarom: 'Een klassieke, warme geur in een elegante fles. Een cadeau dat altijd luxe aanvoelt.',
    status: 'goedgekeurd', voorbeeld: true, populair: true },
  { id: 'vb-03', titel: 'Horloge & leren portemonnee', prijs: 69.00, shop: 'Voorbeeldwinkel', url: '',
    beeld: 'images/producten/voorbeeld-product-3', cat: 'mode-beauty', sub: 'accessoires',
    ookIn: ['cadeaus/voor-hem', 'cadeaus/kerst'], voor: ['hem'], moment: ['kerst', 'verjaardag'],
    waarom: 'Strak horloge en een stevige leren portemonnee: twee dingen die hij elke dag gebruikt.',
    status: 'goedgekeurd', voorbeeld: true, populair: true },
  { id: 'vb-04', titel: 'Knuffelbeer met houten treintje', prijs: 29.95, shop: 'Voorbeeldwinkel', url: '',
    beeld: 'images/producten/voorbeeld-product-4', cat: 'speelgoed', sub: 'baby-peuter',
    ookIn: ['cadeaus/voor-kinderen', 'cadeaus/sinterklaas', 'cadeaus/kerst'], voor: ['kind'], moment: ['sinterklaas', 'kerst', 'verjaardag'],
    waarom: 'Zachte knuffel en een stevig houten treintje. Tijdloos speelgoed dat lang meegaat.',
    status: 'goedgekeurd', voorbeeld: true, populair: true },
  { id: 'vb-05', titel: 'Gouden ketting met zirkonia', prijs: 34.95, shop: 'Voorbeeldwinkel', url: '',
    beeld: 'images/producten/voorbeeld-product-5', cat: 'mode-beauty', sub: 'sieraden',
    ookIn: ['cadeaus/voor-haar', 'cadeaus/kerst'], voor: ['haar'], moment: ['kerst', 'verjaardag', 'zomaar'],
    waarom: 'Fijn en elegant, past bij alles. Wordt geleverd in een fluwelen doosje.',
    status: 'goedgekeurd', voorbeeld: true, populair: true, nieuw: true },
  { id: 'vb-06', titel: 'Luxe bonbons & koekjes', prijs: 9.95, shop: 'Voorbeeldwinkel', url: '',
    beeld: 'images/producten/voorbeeld-product-6', cat: 'eten-drinken', sub: 'chocolade-snoep',
    ookIn: ['cadeaus/onder-10', 'cadeaus/sinterklaas', 'cadeaus/kerst', 'cadeaus/opa-oma'], voor: ['iedereen', 'opa-oma', 'haar', 'hem'], moment: ['sinterklaas', 'kerst', 'zomaar'],
    waarom: 'Altijd goed: een doos vol lekkers voor een klein bedrag. Leuk als extraatje of bedankje.',
    status: 'goedgekeurd', voorbeeld: true, populair: true },
  { id: 'vb-07', titel: 'Vaas zwart-goud met gouden takjes', prijs: 27.50, shop: 'Voorbeeldwinkel', url: '',
    beeld: 'images/producten/voorbeeld-product-7', cat: 'wonen', sub: 'woonaccessoires',
    ookIn: ['cadeaus/opa-oma', 'cadeaus/kerst'], voor: ['haar', 'opa-oma', 'iedereen'], moment: ['kerst', 'verjaardag', 'zomaar'],
    waarom: 'Een eyecatcher op tafel of in de vensterbank. Blijft het hele jaar mooi.',
    status: 'goedgekeurd', voorbeeld: true, nieuw: true },
  { id: 'vb-08', titel: 'Mok met gouden hart + sieradendoosje', prijs: 19.95, shop: 'Voorbeeldwinkel', url: '',
    beeld: 'images/producten/voorbeeld-product-8', cat: 'cadeaus', sub: 'met-naam',
    ookIn: ['cadeaus/voor-haar'], voor: ['haar', 'iedereen'], moment: ['verjaardag', 'zomaar', 'kerst'],
    waarom: 'Persoonlijk cadeau: de mok en het doosje kun je laten bedrukken met een naam.',
    status: 'goedgekeurd', voorbeeld: true, nieuw: true },

  /* Voorbeelden zonder foto (tonen een gouden icoon) */
  { id: 'vb-09', titel: 'Kinderbijbel met platen', prijs: 19.95, shop: 'Voorbeeldwinkel', url: '', beeld: '',
    cat: 'christelijk', sub: 'bijbels', ookIn: ['christelijk/voor-kinderen', 'cadeaus/voor-kinderen'], voor: ['kind'], moment: ['kerst', 'verjaardag'],
    waarom: 'Bekende verhalen, mooi verteld en prachtig geïllustreerd.', status: 'goedgekeurd', voorbeeld: true },
  { id: 'vb-10', titel: 'Kaart met bijbeltekst, goudfolie', prijs: 4.95, shop: 'Voorbeeldwinkel', url: '', beeld: '',
    cat: 'christelijk', sub: 'kaarten-posters', ookIn: ['cadeaus/onder-10'], voor: ['iedereen', 'opa-oma'], moment: ['kerst', 'zomaar'],
    waarom: 'Klein gebaar met een mooie boodschap.', status: 'goedgekeurd', voorbeeld: true },
  { id: 'vb-11', titel: 'Houten bouwblokken, 60 stuks', prijs: 24.99, shop: 'Voorbeeldwinkel', url: '', beeld: '',
    cat: 'speelgoed', sub: 'bouwen', ookIn: ['cadeaus/voor-kinderen', 'cadeaus/sinterklaas'], voor: ['kind'], moment: ['sinterklaas', 'verjaardag'],
    waarom: 'Eindeloos bouwen. Stevig hout, geschikt vanaf 2 jaar.', status: 'goedgekeurd', voorbeeld: true },
  { id: 'vb-12', titel: 'Familiespel: Raad het woord', prijs: 7.99, shop: 'Voorbeeldwinkel', url: '', beeld: '',
    cat: 'speelgoed', sub: 'bordspellen', ookIn: ['cadeaus/onder-10', 'cadeaus/sinterklaas'], voor: ['kind', 'iedereen'], moment: ['sinterklaas', 'kerst'],
    waarom: 'Snel uitgelegd, veel gelach. Leuk voor de feestdagen.', status: 'goedgekeurd', voorbeeld: true },

  /* Nog te keuren in de Keurkamer */
  { id: 'vb-13', titel: 'Porseleinen theeset voor twee', prijs: 44.95, shop: 'Voorbeeldwinkel', url: '', beeld: '',
    cat: 'keuken', sub: 'koffie-thee', ookIn: ['cadeaus/opa-oma'], voor: ['opa-oma', 'haar'], moment: ['kerst', 'verjaardag'],
    waarom: 'Sierlijk servies voor een rustig theemoment.', status: 'nieuw', voorbeeld: true },
  { id: 'vb-14', titel: 'Draadloze koptelefoon', prijs: 59.00, shop: 'Voorbeeldwinkel', url: '', beeld: '',
    cat: 'elektronica', sub: 'audio', ookIn: ['cadeaus/voor-hem'], voor: ['hem', 'iedereen'], moment: ['kerst', 'verjaardag'],
    waarom: 'Goed geluid, lang luisteren.', status: 'nieuw', voorbeeld: true },
  { id: 'vb-15', titel: 'Hondenknuffel extra stevig', prijs: 12.49, shop: 'Voorbeeldwinkel', url: '', beeld: '',
    cat: 'dieren', sub: 'hond', ookIn: [], voor: ['iedereen'], moment: ['zomaar'],
    waarom: 'Kan tegen een stootje.', status: 'nieuw', voorbeeld: true }
];
