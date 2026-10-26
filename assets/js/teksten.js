/* =========================================================
   LeukeKeuze – teksten per categorie en subcategorie
   Korte intro onder de titel (tekst), paginatitel voor Google (seoTitel),
   omschrijving voor Google (seoTekst) en tips onder de producten (gids).
   Sleutel: 'categorie' of 'categorie/subcategorie'.
   Staat er in data.js al een tekst bij de categorie zelf, dan wint die.
   Geschreven door Claude, nagelezen door Marius, 26-10-2026.
   ========================================================= */

window.LK_TEKSTEN = {

  /* ---------------- CADEAUS ---------------- */
  'cadeaus': {
    seoTitel: 'Cadeaus voor elke gelegenheid – met de hand gekozen | LeukeKeuze',
    seoTekst: 'Op zoek naar een leuk cadeau? Cadeaus voor haar, hem, kinderen, opa en oma en collega\'s. Voor Sinterklaas, Kerst, verjaardagen en kraamvisite. Met de hand gekozen.',
    gids: [
      { kop: 'Zo vind je snel een cadeau', tekst: 'Kies hierboven voor wie je iets zoekt, of voor welke gelegenheid. Met de prijsknoppen zie je alleen cadeaus binnen je budget. Weet je het echt niet? Probeer VONK: drie vragen en je krijgt passende ideeën.' },
      { kop: 'Waar komen deze cadeaus vandaan?', tekst: 'Alles op deze pagina is met de hand gekozen uit het aanbod van bekende winkels zoals bol. Je bestelt en betaalt bij de winkel zelf, met hun bezorging en garantie. Wij krijgen soms een kleine vergoeding; jij betaalt niets extra.' }
    ] },
  'cadeaus/voor-haar': {
    tekst: 'Cadeaus voor je vrouw, vriendin, moeder, zus of vriendin: van een klein verwenmoment tot iets groots.',
    seoTitel: 'Cadeau voor haar: leuke cadeaus voor vrouw, vriendin, moeder of zus',
    seoTekst: 'Cadeau voor haar nodig? Sieraden, geuren, verzorging, iets lekkers bij de thee en mooie spullen voor in huis. Voor een verjaardag, Kerst, Moederdag of zomaar.',
    gids: [
      { kop: 'Wat geef je een vrouw cadeau?', tekst: 'Een goed cadeau voor haar sluit aan bij wat ze graag doet. Houdt ze van lekker eten? Kijk bij thee, chocolade of een mooie mok. Is ze graag bezig in huis? Dan is een geurkaars, een plaid of een mooie vaas een veilige keuze. Een sieraad of cadeauset met parfum is altijd feestelijk.' },
      { kop: 'Voor elke gelegenheid', tekst: 'Voor een verjaardag of Moederdag mag het persoonlijk zijn. Voor Kerst en Sinterklaas zijn kleine verwencadeaus populair, zoals een badset of geurstokjes. Gebruik de prijsknoppen om snel binnen je budget te blijven.' }
    ] },
  'cadeaus/voor-hem': {
    tekst: 'Cadeaus voor je man, vriend, vader of broer: gadgets, lekkers, sport en spullen die hij echt gebruikt.',
    seoTitel: 'Cadeau voor hem: leuke cadeaus voor man, vriend, vader of broer',
    seoTekst: 'Cadeau voor hem nodig? Gadgets, horloges, geuren, darts, BBQ, koffie en meer. Voor een verjaardag, Vaderdag, Kerst of Sinterklaas. Met de hand gekozen.',
    gids: [
      { kop: 'Wat geef je een man cadeau?', tekst: 'Mannen zeggen vaak dat ze niets nodig hebben. Kijk dan naar zijn hobby: sport, koken, klussen, gamen of muziek. Een cadeau dat bij zijn hobby past, wordt bijna altijd gebruikt. Twijfel je? Iets lekkers, een goede geur of een handige gadget doet het altijd.' },
      { kop: 'Klein of groot', tekst: 'Voor lootjes of een klein bedankje is een mok, sokken of een cadeauset genoeg. Voor een verjaardag of Vaderdag kun je groter denken: een horloge, een speaker of een complete dartset.' }
    ] },
  'cadeaus/voor-kinderen': {
    tekst: 'Speelgoed, boeken en knutselspullen voor kinderen van 0 tot 12 jaar, van bekende merken.',
    seoTitel: 'Cadeau voor kinderen: speelgoed, boeken en knutselen per leeftijd',
    seoTekst: 'Leuk cadeau voor een kind? Speelgoed, boeken, puzzels en knutselsets van LEGO, Playmobil, Schleich, SES en meer. Voor een verjaardag, Sinterklaas of Kerst.',
    gids: [
      { kop: 'Een cadeau dat bij de leeftijd past', tekst: 'Voor baby\'s en peuters kies je zacht speelgoed en stevige boekjes. Vanaf een jaar of vier wordt bouwen, knutselen en verkleden leuk. Kinderen vanaf acht jaar houden van spelletjes, grotere bouwsets en boeken waar ze zelf in kunnen lezen. Op de productpagina staat vaak vanaf welke leeftijd iets geschikt is.' },
      { kop: 'Niet te veel tegelijk', tekst: 'Eén goed cadeau is vaak leuker dan vijf kleine. Vraag de ouders wat het kind al heeft, of kies iets om samen te doen, zoals een spel of een knutselset.' }
    ] },
  'cadeaus/kerst': {
    tekst: 'Kerstcadeaus voor iedereen op je lijstje: van klein en lekker tot groot en luxe.',
    seoTitel: 'Kerstcadeaus: ideeën voor haar, hem, kinderen, opa en oma en collega\'s',
    seoTekst: 'Kerstcadeau nodig? Honderden kerstcadeaus voor haar, hem, kinderen, opa en oma en collega\'s. Van lekkers en kerstdecoratie tot cadeausets. Op tijd in huis voor de feestdagen.',
    gids: [
      { kop: 'Kerstcadeaus kiezen zonder stress', tekst: 'Maak een lijstje met voor wie je iets zoekt en wat je per persoon wilt uitgeven. Met de prijsknoppen hierboven zie je alleen cadeaus in dat budget. Koop grote cadeaus op tijd: rond half december raken populaire dingen snel uitverkocht.' },
      { kop: 'Onze kerstgidsen', tekst: 'Wil je liever een paar goede ideeën in plaats van honderden producten? Bekijk de cadeaugidsen voor Kerst: kerstcadeaus onder de 25 euro, voor haar, voor hem, voor opa en oma en voor collega\'s.' }
    ] },
  'cadeaus/sinterklaas': {
    tekst: 'Alles voor pakjesavond en de schoen: cadeautjes voor kinderen, lootjes voor volwassenen en lekkers.',
    seoTitel: 'Sinterklaascadeaus: voor de schoen, pakjesavond en lootjes',
    seoTekst: 'Sinterklaascadeaus voor kinderen en volwassenen: schoencadeautjes, speelgoed, spelletjes, kruidnoten en chocoladeletters. Ook ideeën voor lootjes en surprises.',
    gids: [
      { kop: 'Schoen, pakjesavond en lootjes', tekst: 'Voor de schoen zijn kleine cadeautjes onder de 5 euro genoeg: een figuurtje, stickers of iets lekkers. Op pakjesavond mag het groter. Trek je lootjes met volwassenen? Spreek een bedrag af en kijk bij de prijsknoppen.' },
      { kop: 'Op tijd bestellen', tekst: 'Vanaf half november worden populaire cadeaus snel schaars. Bestel liefst voor 1 december, dan heb je alles ruim op tijd in huis voor 5 december.' }
    ] },
  'cadeaus/sint-onder-15': {
    seoTitel: 'Sinterklaascadeaus onder €15: schoencadeautjes en kleine pakjes',
    seoTekst: 'Sinterklaascadeautjes onder de 15 euro: voor de schoen, voor lootjes en voor pakjesavond. Speelgoed, boekjes, knutselsets en lekkers van bekende merken.',
    gids: [
      { kop: 'Veel plezier voor weinig geld', tekst: 'Een cadeautje hoeft niet duur te zijn om leuk te zijn. Kleine bouwsetjes, een boekje, een spelletje of een knutselset: allemaal onder de 15 euro, en er wordt dagen mee gespeeld. Gebruik de prijsknop "tot €10" als je nog lager wilt zitten.' }
    ] },
  'cadeaus/adventskalenders': {
    tekst: 'Adventskalenders met chocolade, thee, beauty, speelgoed en meer: elke dag in december een verrassing.',
    seoTitel: 'Adventskalenders 2026: chocolade, thee, beauty, LEGO en meer',
    seoTekst: 'Adventskalender kopen? Kalenders met chocolade, thee, verzorging, LEGO, Playmobil en meer. Voor kinderen en volwassenen. Bestel op tijd, voor 1 december.',
    gids: [
      { kop: 'Welke adventskalender past bij wie?', tekst: 'Voor kinderen zijn kalenders met speelgoed of chocolade het leukst. Volwassenen kiezen vaker voor thee, koffie, verzorging of een geurkaars. Er zijn ook kalenders met puzzels of spelletjes voor het hele gezin.' },
      { kop: 'Bestel voor 1 december', tekst: 'Een adventskalender begint op 1 december. Bestel hem dus uiterlijk eind november, zodat hij op tijd in huis is. Veel kalenders zijn in november al uitverkocht.' }
    ] },
  'cadeaus/opa-oma': {
    tekst: 'Cadeaus voor opa en oma die ze echt gebruiken: spelletjes, iets warms, herinneringen en lekkers.',
    seoTitel: 'Cadeau voor opa en oma: ideeën voor verjaardag, Kerst en zomaar',
    seoTekst: 'Cadeau voor opa of oma nodig? Spelletjes om samen te doen, een warme plaid, een fotolijst, muziek van vroeger of iets lekkers. Van klein tot groot.',
    gids: [
      { kop: 'Opa en oma hebben alles al', tekst: 'Zeggen ze dat ze niets nodig hebben? Geef dan iets om samen te doen, zoals een spel of een puzzel, of iets met een herinnering, zoals een fotolijst. Iets warms voor de winter of iets lekkers bij de koffie valt ook altijd goed.' },
      { kop: 'Praktisch en veilig', tekst: 'Let bij oudere mensen op gemak: grote letters, een stevige greep, niet te zwaar. Een luisterboek of een cd met muziek van vroeger is een cadeau waar ze lang plezier van hebben.' }
    ] },
  'cadeaus/collega': { },
  'cadeaus/baby-kraam': {
    tekst: 'Kraamcadeaus en babycadeaus: knuffels, boekjes, speelgoed en mooie aandenkens aan de eerste tijd.',
    seoTitel: 'Kraamcadeau en babycadeau: knuffels, speelgoed en aandenkens',
    seoTekst: 'Op kraamvisite? Kraamcadeaus en babycadeaus: knuffels, speelgoed voor baby\'s, boekjes, een babyboek en cadeaus voor de nieuwe ouders. Voor jongens en meisjes.',
    gids: [
      { kop: 'Wat neem je mee op kraamvisite?', tekst: 'Een knuffel of een zacht boekje is klassiek en altijd welkom. Wil je iets voor later? Kies dan speelgoed voor een baby van zes maanden of ouder, daar hebben ze langer wat aan. Vergeet de ouders niet: iets lekkers of een mooie mok wordt enorm gewaardeerd.' },
      { kop: 'Veilig voor baby\'s', tekst: 'Kies voor baby\'s speelgoed zonder kleine losse onderdelen en van stevig materiaal. Op de productpagina staat vaak vanaf welke leeftijd iets geschikt is.' }
    ] },
  'cadeaus/onder-15': {
    tekst: 'Leuke cadeaus onder de 15 euro: voor lootjes, een bedankje of gewoon omdat het kan.',
    seoTitel: 'Cadeaus onder €15: leuke kleine cadeautjes voor iedereen',
    seoTekst: 'Cadeau onder de 15 euro? Kleine cadeautjes voor haar, hem en kinderen: lekkers, spelletjes, verzorging, mokken en meer. Ideaal voor lootjes en bedankjes.',
    gids: [
      { kop: 'Klein cadeau, groot effect', tekst: 'Een klein cadeau wordt leuk door de keuze, niet door de prijs. Kies iets wat bij de persoon past: zijn favoriete snoep, een mok van haar serie, een spelletje voor op reis. Hier staan alleen cadeaus onder de 15 euro, dus je zit nooit te hoog.' }
    ] },
  'cadeaus/met-naam': {
    tekst: 'Cadeaus met een naam of eigen tekst erop: persoonlijk en net even anders.',
    seoTitel: 'Cadeau met naam: persoonlijke cadeaus met naam of tekst',
    seoTekst: 'Persoonlijk cadeau met naam? Cadeaus waar je zelf een naam of tekst op laat zetten. Voor kinderen, volwassenen en als kraamcadeau.',
    gids: [
      { kop: 'Een cadeau met naam', tekst: 'Een cadeau met een naam erop is persoonlijk en wordt vaak jaren bewaard. Let op de levertijd: omdat het op maat gemaakt wordt, duurt het vaak een paar dagen langer. Controleer de spelling van de naam goed voordat je bestelt.' }
    ] },

  /* ---------------- SPEELGOED ---------------- */
  'speelgoed': {
    seoTitel: 'Speelgoed en spellen: LEGO, Playmobil, puzzels, bordspellen en meer',
    seoTekst: 'Speelgoed en spellen voor baby\'s, kinderen en volwassenen. Bouwen, puzzels, bordspellen, kaartspellen, buitenspeelgoed en knutselen. Van bekende merken.',
    gids: [
      { kop: 'Speelgoed kiezen', tekst: 'Kijk naar de leeftijd en naar wat het kind leuk vindt: bouwen, spelen met figuren, puzzelen of buiten bezig zijn. Op de productpagina staat vaak vanaf welke leeftijd iets geschikt is. Voor volwassenen vind je hier bordspellen en puzzels.' }
    ] },
  'speelgoed/baby-peuter': {
    tekst: 'Speelgoed voor baby\'s en peuters van 0 tot 3 jaar: zacht, stevig en veilig.',
    seoTitel: 'Babyspeelgoed en peuterspeelgoed: veilig speelgoed van 0 tot 3 jaar',
    seoTekst: 'Speelgoed voor baby\'s en peuters: knuffels, rammelaars, stapeltorens, badspeelgoed en eerste puzzels. Veilig en van bekende merken.',
    gids: [
      { kop: 'Speelgoed voor de allerkleinsten', tekst: 'Baby\'s ontdekken met hun handen en mond. Kies dus zacht speelgoed zonder kleine onderdelen. Peuters van één tot drie jaar houden van stapelen, duwen, trekken en nadoen: een stapeltoren, een loopwagen of een eenvoudig keukentje.' }
    ] },
  'speelgoed/bouwen': {
    tekst: 'Bouwspeelgoed van LEGO, Playmobil, Duplo en meer: voor kleine en grote bouwers.',
    seoTitel: 'Bouwspeelgoed: LEGO, Duplo, Playmobil en andere bouwsets',
    seoTekst: 'Bouwsets van LEGO, Duplo, Playmobil en meer. Voor peuters, kinderen en volwassenen. Kleine setjes voor in de schoen en grote sets voor een verjaardag.',
    gids: [
      { kop: 'Welke bouwset past bij welke leeftijd?', tekst: 'Duplo is voor peuters vanaf anderhalf jaar. Gewone LEGO en Playmobil beginnen rond vier jaar. Grote, ingewikkelde sets zijn voor kinderen vanaf tien jaar en voor volwassenen. Op elke doos staat de leeftijd.' },
      { kop: 'Klein of groot', tekst: 'Kleine setjes onder de 10 euro zijn ideaal voor de schoen of als extraatje. Voor een verjaardag of Kerst kun je een grotere set kiezen, of een paar kleine die bij elkaar passen.' }
    ] },
  'speelgoed/figuren-voertuigen': {
    seoTitel: 'Speelfiguren en voertuigen: Schleich, Hot Wheels, Funko Pop en meer',
    seoTekst: 'Speelfiguren en voertuigen: dieren van Schleich, auto\'s van Hot Wheels, verzamelfiguren en poppen. Voor kinderen en verzamelaars.',
    gids: [
      { kop: 'Figuren om mee te spelen en te verzamelen', tekst: 'Dieren van Schleich en auto\'s van Hot Wheels zijn klein, stevig en betaalbaar: perfect voor de schoen of als klein cadeau. Verzamelfiguren zoals Funko Pop zijn vooral leuk voor tieners en volwassenen die fan zijn van een film of serie.' }
    ] },
  'speelgoed/bordspellen': {
    tekst: 'Bordspellen en tafelspellen voor het hele gezin, voor kinderen en voor spelavonden met vrienden.',
    seoTitel: 'Bordspellen: de leukste gezelschapsspellen voor gezin en vrienden',
    seoTekst: 'Bordspellen en gezelschapsspellen voor kinderen, gezinnen en volwassenen. Klassiekers en nieuwe spellen, voor een spelletjesavond of de feestdagen.',
    gids: [
      { kop: 'Een spel voor iedereen', tekst: 'Kijk naar het aantal spelers en de leeftijd op de doos. Voor een gezin met jonge kinderen kies je een simpel spel dat in een half uur klaar is. Voor een avond met vrienden kan het spannender en langer. Klassiekers als Catan en Rummikub zijn een veilige keuze.' },
      { kop: 'Cadeau voor de feestdagen', tekst: 'Een bordspel is een fijn kerstcadeau: je kunt het meteen samen spelen op tweede kerstdag. Ook voor opa en oma is een spel leuk, zeker als de kleinkinderen mee kunnen doen.' }
    ] },
  'speelgoed/kaartspellen': {
    tekst: 'Kaartspellen en dobbelspellen: klein, snel te leren en makkelijk mee te nemen.',
    seoTitel: 'Kaartspellen en dobbelspellen: klein, snel en leuk voor onderweg',
    seoTekst: 'Kaartspellen en dobbelspellen voor kinderen en volwassenen. UNO, Skip-Bo, party-spellen en reisspellen. Klein genoeg voor de schoen of de koffer.',
    gids: [
      { kop: 'Klein maar leuk', tekst: 'Kaart- en dobbelspellen passen in een jaszak en kosten meestal minder dan 15 euro. Ideaal voor vakantie, de schoen of lootjes. Veel spellen leer je in een paar minuten, dus iedereen kan meteen meedoen.' }
    ] },
  'speelgoed/puzzels': {
    tekst: 'Puzzels voor kinderen en volwassenen: van 24 stukjes tot 1000 stukjes en 3D-puzzels.',
    seoTitel: 'Puzzels: legpuzzels, kinderpuzzels en 3D-puzzels',
    seoTekst: 'Puzzels voor jong en oud: kinderpuzzels, legpuzzels van 500 en 1000 stukjes, Jan van Haasteren, Wasgij en 3D-puzzels. Voor rustige avonden en de feestdagen.',
    gids: [
      { kop: 'Hoeveel stukjes?', tekst: 'Voor peuters zijn puzzels van 4 tot 24 stukjes geschikt. Kinderen van zes tot tien jaar puzzelen 100 tot 300 stukjes. Volwassenen kiezen meestal 500 of 1000 stukjes. Een puzzel van Jan van Haasteren of Wasgij is een leuk cadeau voor wie graag zoekt en lacht.' }
    ] },
  'speelgoed/buitenspeelgoed': {
    tekst: 'Buitenspeelgoed voor tuin, straat en strand: steppen, ballen, stoepkrijt en meer.',
    seoTitel: 'Buitenspeelgoed: steppen, ballen, stoepkrijt en zandspeelgoed',
    seoTekst: 'Buitenspeelgoed voor kinderen: steppen, loopfietsen, ballen, stoepkrijt, bellenblaas en speelgoed voor strand en tuin. Lekker naar buiten.',
    gids: [
      { kop: 'Lekker naar buiten', tekst: 'Buitenspeelgoed is een cadeau waar kinderen de hele zomer plezier van hebben, maar ook in de winter: een step of loopfiets kan het hele jaar mee. Voor kleine cadeautjes kijk je naar stoepkrijt, bellenblaas of een bal.' }
    ] },
  'speelgoed/knutselen': {
    tekst: 'Knutselsets voor kinderen van SES, Totum, Janod en meer: slijm, kralen, kleien en verven.',
    seoTitel: 'Knutselen voor kinderen: knutselsets van SES, Totum en Janod',
    seoTekst: 'Knutselsets voor kinderen: slijm maken, kralen rijgen, kleien, kraskaarten, verven en sieraden maken. Van SES, Totum, Janod en Crayola. Ideaal als klein cadeau.',
    gids: [
      { kop: 'Een middag zoet', tekst: 'Een knutselset is een cadeau waar een kind meteen mee aan de slag kan. Kies voor jonge kinderen een set met grote onderdelen en weinig stappen. Oudere kinderen vinden het leuk om iets te maken dat ze kunnen houden, zoals een armbandje of een beschilderde mok.' }
    ] },

  /* ---------------- ETEN & DRINKEN ---------------- */
  'eten-drinken': {
    seoTitel: 'Eten en drinken cadeau: chocolade, snoep, koffie, thee en pakketten',
    seoTekst: 'Lekkers om cadeau te geven: chocolade, drop en snoep, koffie en thee, BBQ-kruiden, borrelpakketten en lekkernijen. Voor elke gelegenheid.',
    gids: [
      { kop: 'Lekkers geven doet het altijd', tekst: 'Iets lekkers is een cadeau dat bijna iedereen fijn vindt, en je hoeft de smaak van iemand niet precies te kennen. Kies iets in een mooie verpakking, dan is het meteen een cadeau zonder inpakken.' }
    ] },
  'eten-drinken/chocolade-snoep': {
    tekst: 'Chocolade om cadeau te geven: Tony\'s, Lindt, Côte d\'Or, pralines en mooie cadeaudozen.',
    seoTitel: 'Chocolade cadeau: Tony\'s, Lindt, pralines en cadeaudozen',
    seoTekst: 'Chocolade cadeau geven? Tony\'s Chocolonely, Lindt, Côte d\'Or, Merci, pralines en chocoladeletters in mooie cadeauverpakkingen. Voor Sinterklaas, Kerst en bedankjes.',
    gids: [
      { kop: 'Chocolade als cadeau', tekst: 'Een doos pralines of een cadeaudoos van Tony\'s is een klein cadeau dat altijd goed valt. Voor Sinterklaas kies je een chocoladeletter, voor Kerst een mooie doos om te delen. Kijk bij warm weer naar de verzendnoot: chocolade smelt onderweg.' }
    ] },
  'eten-drinken/drop-snoep': {
    tekst: 'Drop en snoep in cadeauverpakking: grote potten, mixen en Hollandse klassiekers.',
    seoTitel: 'Drop en snoep cadeau: grote potten, mixen en klassiekers',
    seoTekst: 'Drop en snoep als cadeau: grote snoeppotten, dropmixen, Engelse drop, Haribo en Hollands snoep in cadeauverpakking. Leuk voor collega\'s en snoepers.',
    gids: [
      { kop: 'Voor de echte snoeper', tekst: 'Een grote pot drop of snoep is een grappig en lekker cadeau, zeker voor iemand die er geen genoeg van krijgt. Voor op kantoor is een grote mix leuk om te delen. Nederlanders in het buitenland worden blij van echte Hollandse drop.' }
    ] },
  'eten-drinken/bbq': {
    tekst: 'Cadeaus voor de barbecueliefhebber: kruiden, rubs, sauzen, rookhout en handig gereedschap.',
    seoTitel: 'BBQ cadeau: kruiden, rubs, sauzen, rookhout en gereedschap',
    seoTekst: 'Cadeau voor een BBQ-liefhebber? BBQ-kruiden en rubs, sauzen, rookhout, grillgereedschap en cadeausets. Voor Vaderdag, een verjaardag of Kerst.',
    gids: [
      { kop: 'Cadeau voor de barbecueër', tekst: 'Wie graag barbecuet, heeft meestal al een barbecue. Geef dus iets erbij: een set rubs en kruiden, goede sauzen, rookhout voor extra smaak, of een handige tang en thermometer. Een cadeauset met meerdere smaken is leuk om uit te proberen.' }
    ] },
  'eten-drinken/pakketten': {
    tekst: 'Borrelpakketten en cadeaupakketten: alles in één doos, klaar om te geven.',
    seoTitel: 'Borrelpakket en cadeaupakket: lekkers in één doos',
    seoTekst: 'Borrelpakket of cadeaupakket geven? Pakketten met kaas, worst, chocolade, koffie of thee, mooi verpakt. Voor collega\'s, een bedankje of de feestdagen.',
    gids: [
      { kop: 'Alles in één keer geregeld', tekst: 'Een pakket is het makkelijkste cadeau: het is al mooi verpakt en er zit van alles in. Een borrelpakket is leuk voor een stel of een gezin, een pakket met koffie of thee voor iemand die graag thuis zit. Ook ideaal als bedankje voor een collega of buurvrouw.' }
    ] },
  'eten-drinken/koffie-thee': {
    tekst: 'Koffie en thee om cadeau te geven: bijzondere bonen, cadeaudozen met thee en mooie blikken.',
    seoTitel: 'Koffie en thee cadeau: bonen, theedozen en cadeaublikken',
    seoTekst: 'Koffie of thee cadeau geven? Bijzondere koffiebonen, cadeaudozen met thee van Pukka, Dammann en Clipper, en mooie blikken van illy. Voor koffie- en theeliefhebbers.',
    gids: [
      { kop: 'Voor de koffie- of theedrinker', tekst: 'Een doos met verschillende theesoorten is leuk om te ontdekken. Voor koffiedrinkers kies je een proefpakket met bonen, of een mooi blik. Wil je er iets bij geven? Kijk bij Keuken voor mokken, kopjes en koffiemakers.' }
    ] },
  'eten-drinken/lekkernijen': {
    tekst: 'Koekjes, stroopwafels, marsepein en andere lekkernijen in cadeauverpakking.',
    seoTitel: 'Lekkernijen cadeau: koekjes, stroopwafels, marsepein en meer',
    seoTekst: 'Lekkernijen om cadeau te geven: stroopwafels, koekjes, marsepein, noten en Hollandse specialiteiten in mooie verpakking. Voor elke gelegenheid.',
    gids: [
      { kop: 'Iets lekkers bij de koffie', tekst: 'Een blik koekjes of een doos stroopwafels is een klein cadeau dat altijd op gaat. Leuk voor opa en oma, voor collega\'s of als je op visite gaat. Kies een mooie verpakking, dan hoef je niet meer in te pakken.' }
    ] },

  /* ---------------- HOBBY ---------------- */
  'hobby': {
    seoTitel: 'Hobby en creatief: tekenen, schilderen, haken, breien en modelbouw',
    seoTekst: 'Cadeaus voor creatieve mensen: tekenen en schilderen, haken en breien, knutselen en modelbouw. Voor beginners en gevorderden.',
    gids: [
      { kop: 'Cadeau voor iemand met een hobby', tekst: 'Iemand met een hobby is makkelijk blij te maken: goede materialen, een nieuw pakket of een boek met ideeën. Weet je niet wat iemand al heeft? Kies dan een compleet startpakket of een cadeaubon.' }
    ] },
  'hobby/tekenen-schilderen': {
    tekst: 'Potloden, verf, stiften en tekenblokken voor beginners en gevorderden.',
    seoTitel: 'Tekenen en schilderen: potloden, verf, stiften en sets',
    seoTekst: 'Cadeaus voor wie graag tekent of schildert: kleurpotloden, aquarelverf, acrylverf, stiften, schetsboeken en complete sets. Van Faber-Castell, Caran d\'Ache en meer.',
    gids: [
      { kop: 'Voor beginners en gevorderden', tekst: 'Begin je net? Een set met potloden of stiften en een goed schetsboek is genoeg. Voor wie al langer tekent of schildert, is een luxe set van een bekend merk een cadeau om blij van te worden. Schilderen op nummer is leuk voor wie het rustig aan wil doen.' }
    ] },
  'hobby/haken-breien': {
    tekst: 'Haakpakketten, breipakketten, boeken en goede naalden: voor beginners en voor wie al jaren haakt.',
    seoTitel: 'Haken en breien: haakpakketten, breipakketten en boeken',
    seoTekst: 'Cadeaus voor wie haakt of breit: amigurumi-haakpakketten, breipakketten, boeken voor beginners, haaknaalden en breinaalden. Alles om meteen te beginnen.',
    gids: [
      { kop: 'Beginnen met haken of breien', tekst: 'Een haak- of breipakket is het makkelijkste begin: garen, naald en uitleg zitten erin. Amigurumi (kleine gehaakte knuffels) is populair en snel klaar. Een boek voor beginners legt de eerste steken rustig uit.' },
      { kop: 'Voor wie al kan haken', tekst: 'Wie al langer haakt of breit, is blij met goede naalden, een mooi patronenboek of een pakket met een nieuwe uitdaging.' }
    ] },
  'hobby/knutselen': {
    tekst: 'Zelf iets maken: knutselsets, punch needle, kaarsen maken en andere creatieve pakketten voor volwassenen.',
    seoTitel: 'Zelf maken: creatieve pakketten en knutselsets voor volwassenen',
    seoTekst: 'Creatieve cadeaus om zelf iets te maken: punch needle, kaarsen gieten, zeep maken, borduren en andere doe-het-zelf pakketten voor volwassenen en tieners.',
    gids: [
      { kop: 'Een cadeau om zelf te maken', tekst: 'Een doe-pakket is een cadeau en een leuke middag tegelijk. Punch needle en borduren zijn rustgevend en makkelijk te leren. Kaarsen of zeep maken is leuk om samen te doen. Alles zit in het pakket, je hoeft niets apart te kopen.' }
    ] },
  'hobby/modelbouw': {
    tekst: 'Modelbouw en bouwpakketten voor volwassenen: houten modellen, metalen bouwsets en meer.',
    seoTitel: 'Modelbouw: bouwpakketten en modellen voor volwassenen',
    seoTekst: 'Modelbouw cadeau: houten bouwpakketten, metalen modellen, 3D-puzzels en bouwsets voor volwassenen en tieners. Uren bouwplezier.',
    gids: [
      { kop: 'Rustig bouwen', tekst: 'Modelbouw is een hobby voor mensen die graag met hun handen bezig zijn en geduld hebben. Let op het aantal onderdelen en de moeilijkheidsgraad op de doos. Voor een beginner is een set van een paar uur het leukst; gevorderden willen juist een groot project.' }
    ] },

  /* ---------------- MODE & BEAUTY ---------------- */
  'mode-beauty': {
    seoTitel: 'Mode en beauty cadeaus: horloges, geuren, verzorging, tassen en accessoires',
    seoTekst: 'Cadeaus in mode en beauty: horloges, parfum en cadeausets, verzorging, tassen, rugzakken, schoenen, kleding en accessoires. Voor haar en voor hem.',
    gids: [
      { kop: 'Mode en beauty als cadeau', tekst: 'Een geur, een horloge of een mooie tas is een cadeau dat elke dag gebruikt wordt. Twijfel je over smaak of maat? Een verzorgingsset of een accessoire zoals een sjaal of muts is veiliger dan kleding of schoenen.' }
    ] },
  'mode-beauty/horloges': {
    tekst: 'Horloges voor hem en haar van Casio, Fossil, Seiko en meer: van sportief tot klassiek.',
    seoTitel: 'Horloge cadeau: horloges voor hem en haar van Casio, Fossil en meer',
    seoTekst: 'Horloge cadeau geven? Horloges voor mannen en vrouwen van Casio, Fossil, Seiko, Daniel Wellington en meer. Sportief, klassiek of modern, in elke prijsklasse.',
    gids: [
      { kop: 'Een horloge kiezen', tekst: 'Kijk naar de stijl van de persoon: draagt hij of zij liever iets sportiefs of iets nets? Let op de maat van de kast: rond 38 mm is bescheiden, boven 42 mm is groot. Een horloge is een cadeau dat jaren meegaat, dus kies een merk dat je kent.' }
    ] },
  'mode-beauty/geuren': {
    tekst: 'Parfum en cadeausets voor haar en hem van bekende merken, vaak met douchegel of bodylotion erbij.',
    seoTitel: 'Parfum cadeau: geuren en cadeausets voor haar en hem',
    seoTekst: 'Parfum cadeau geven? Cadeausets met eau de parfum, douchegel en bodylotion van Hugo Boss, Versace, Armani, Rabanne, Gucci en meer. Voor haar en voor hem.',
    gids: [
      { kop: 'Een geur cadeau geven', tekst: 'Geef bij voorkeur een geur die iemand al draagt, of een nieuwe van hetzelfde merk. Een cadeauset is slim: je krijgt het parfum plus douchegel of lotion in een mooie doos, vaak voordeliger dan los. Twijfel je? Kies een frisse, lichte geur; die valt bij de meeste mensen goed.' }
    ] },
  'mode-beauty/verzorging': {
    tekst: 'Verwencadeaus: badsets, cadeausets van Rituals, Kneipp en The Body Shop, en verzorging voor hem.',
    seoTitel: 'Verzorging cadeau: badsets en cadeausets van Rituals, Kneipp en meer',
    seoTekst: 'Verwencadeau nodig? Cadeausets van Rituals, Kneipp, The Body Shop, Weleda en NIVEA. Badsets, douche-sets en verzorging voor haar en hem. Voor elk budget.',
    gids: [
      { kop: 'Verwennen zonder risico', tekst: 'Een verzorgingsset is een veilig cadeau: bijna iedereen gebruikt het, en je hoeft de maat of smaak niet te kennen. Voor haar zijn bad- en douchesets populair, voor hem een set met douchegel en deodorant. Kleine sets onder de 15 euro zijn ideaal voor lootjes.' }
    ] },
  'mode-beauty/tassen': {
    tekst: 'Handtassen en schoudertassen voor haar: klein en handig of groot en luxe.',
    seoTitel: 'Handtas of schoudertas cadeau: tassen voor haar',
    seoTekst: 'Handtassen en schoudertassen voor vrouwen: crossbody tassen, schoudertassen en kleine handtasjes van bekende merken. Van betaalbaar tot luxe.',
    gids: [
      { kop: 'Een tas als cadeau', tekst: 'Een kleine crossbody tas is het makkelijkst om te geven: hij past bij bijna alles en is handig voor telefoon en pasjes. Kies een neutrale kleur zoals zwart, bruin of beige als je haar smaak niet precies kent.' }
    ] },
  'mode-beauty/rugzakken-reistassen': {
    tekst: 'Rugzakken, weekendtassen en reistassen van Eastpak, Fjällräven, Herschel, Thule en meer.',
    seoTitel: 'Rugzak of reistas cadeau: Eastpak, Fjällräven, Herschel en Thule',
    seoTekst: 'Rugzakken, weekendtassen en reistassen van Eastpak, Fjällräven Kånken, Herschel, The North Face en Thule. Voor school, werk, wandelen en een weekend weg.',
    gids: [
      { kop: 'Welke tas voor wie?', tekst: 'Voor school of werk is een rugzak met laptopvak handig. Voor een weekendje weg kies je een weekendtas of een reistas die ook als rugzak kan. Een kleine heuptas of crossbody is fijn voor op stap. Bekende merken gaan jaren mee, dus dat is een cadeau met waarde.' }
    ] },
  'mode-beauty/schoenen': {
    tekst: 'Pantoffels, sloffen en schoenen om cadeau te geven: warm, comfortabel en van bekende merken.',
    seoTitel: 'Pantoffels en schoenen cadeau: warme sloffen en meer',
    seoTekst: 'Pantoffels, sloffen en schoenen als cadeau: warme pantoffels voor de winter, sloffen van bekende merken en comfortabele schoenen voor haar en hem.',
    gids: [
      { kop: 'Let op de maat', tekst: 'Schoenen en pantoffels zijn een fijn cadeau, maar de maat moet kloppen. Kijk stiekem in de kast, of kies pantoffels met een ruime pasvorm. Warme sloffen zijn een klassiek wintercadeau voor opa, oma, vader en moeder.' }
    ] },
  'mode-beauty/kleding': {
    tekst: 'Kleding om cadeau te geven: vrolijke sokken, warme mutsen, badjassen en meer.',
    seoTitel: 'Kleding cadeau: sokken, mutsen, badjassen en meer',
    seoTekst: 'Kleding als cadeau: vrolijke sokken van Happy Socks, warme mutsen en sjaals, badjassen en huispakken. Makkelijk te geven, ook als je de maat niet precies weet.',
    gids: [
      { kop: 'Kleding geven zonder maatzorgen', tekst: 'Sokken, mutsen, sjaals en badjassen passen bijna altijd. Daarom zijn het fijne cadeaus voor lootjes en Kerst. Vrolijke sokken zijn een klassieker voor hem; een zachte badjas of een warm huispak is een verwencadeau voor haar.' }
    ] },
  'mode-beauty/accessoires': {
    tekst: 'Accessoires voor haar en hem: sjaals, mutsen, handschoenen, portemonnees, riemen en zonnebrillen.',
    seoTitel: 'Accessoires cadeau: sjaals, mutsen, portemonnees en zonnebrillen',
    seoTekst: 'Accessoires als cadeau: sjaals, mutsen, handschoenen, portemonnees, riemen en zonnebrillen voor haar en hem. Van bekende merken, in elke prijsklasse.',
    gids: [
      { kop: 'Klein cadeau, elke dag gebruikt', tekst: 'Een accessoire is een cadeau dat iemand dagelijks gebruikt: een warme muts in de winter, een goede portemonnee, een zonnebril in de zomer. Kies een merk dat je kent en een kleur die bij de persoon past.' }
    ] },

  /* ---------------- SIERADEN ---------------- */
  'sieraden': {
    seoTitel: 'Sieraden cadeau: kettingen, oorbellen, ringen en armbanden',
    seoTekst: 'Sieraden om cadeau te geven: kettingen, oorbellen, ringen en armbanden in zilver, verguld, staal en echt goud. Voor haar en voor hem. Van betaalbaar tot luxe.',
    gids: [
      { kop: 'Een sieraad kiezen', tekst: 'Kijk eerst wat iemand al draagt: goudkleurig of zilverkleurig, fijn of opvallend. Een fijne ketting of kleine oorbellen passen bij bijna iedereen. Bij ringen moet de maat kloppen; een armband of ketting is makkelijker om te geven.' },
      { kop: 'Zilver, verguld of echt goud?', tekst: 'Zilver en verguld zijn betaalbaar en mooi voor dagelijks gebruik. Echt goud is duurder, maar verkleurt niet en gaat een leven lang mee. Staal is sterk en geschikt voor wie vaak sport of met de handen werkt.' }
    ] },
  'sieraden/kettingen': {
    tekst: 'Kettingen en hangers voor haar en hem: fijn en subtiel of met een opvallende hanger.',
    seoTitel: 'Ketting cadeau: kettingen en hangers in zilver, goud en staal',
    seoTekst: 'Ketting cadeau geven? Kettingen en hangers voor haar en hem in zilver, verguld, echt goud en staal. Met hartje, letter, steen of symbool.',
    gids: [
      { kop: 'Een ketting als cadeau', tekst: 'Een ketting is het makkelijkste sieraad om te geven: de maat maakt weinig uit. Een hanger met een letter, hartje of geboortesteen maakt het persoonlijk. Let op de lengte: 40 tot 45 cm valt net onder de hals, 50 tot 60 cm wat lager.' }
    ] },
  'sieraden/oorbellen': {
    tekst: 'Oorbellen voor haar: knopjes, ringetjes en hangers in zilver, goud en staal.',
    seoTitel: 'Oorbellen cadeau: knopjes, ringetjes en hangers',
    seoTekst: 'Oorbellen als cadeau: oorknopjes, oorringen en hangende oorbellen in zilver, verguld, echt goud en staal. Van klein en fijn tot opvallend.',
    gids: [
      { kop: 'Oorbellen kiezen', tekst: 'Kleine knopjes en ringetjes passen bij elke dag en bij iedereen. Hangende oorbellen zijn feestelijker. Heeft iemand een gevoelige huid? Kies dan echt zilver, goud of staal zonder nikkel.' }
    ] },
  'sieraden/ringen': {
    tekst: 'Ringen voor haar en hem: fijne ringen, zegelringen en ringen met steen.',
    seoTitel: 'Ring cadeau: ringen voor haar en hem in zilver, goud en staal',
    seoTekst: 'Ring cadeau geven? Ringen voor vrouwen en mannen: fijne ringen, zegelringen, ringen met steen en stapelringen. In zilver, verguld, echt goud en staal.',
    gids: [
      { kop: 'De juiste maat', tekst: 'Een ring moet passen, dus meet stiekem een ring die iemand al draagt of vraag het aan iemand die het weet. Twijfel je? Kies een verstelbare ring, of geef liever een ketting of armband.' }
    ] },
  'sieraden/armbanden': {
    tekst: 'Armbanden en enkelbandjes voor haar en hem: fijne schakels, bedels, leer en staal.',
    seoTitel: 'Armband cadeau: armbanden en enkelbandjes voor haar en hem',
    seoTekst: 'Armband als cadeau: fijne armbanden, bedelarmbanden, enkelbandjes en stoere armbanden van leer of staal. Voor haar en voor hem, in elke prijsklasse.',
    gids: [
      { kop: 'Een armband als cadeau', tekst: 'Armbanden zijn makkelijk te geven: de meeste zijn verstelbaar of hebben een ruime maat. Voor haar zijn fijne schakelarmbanden en bedels populair, voor hem leer of staal. Een enkelbandje is een leuk zomercadeau.' }
    ] },
  'sieraden/heren': {
    tekst: 'Sieraden voor mannen: armbanden van leer en staal, zegelringen en stoere kettingen.',
    seoTitel: 'Sieraden voor mannen: armbanden, kettingen en ringen voor hem',
    seoTekst: 'Sieraden voor mannen: stoere armbanden van leer en staal, zegelringen, schakelkettingen en hangers. Een cadeau voor hem dat hij elke dag kan dragen.',
    gids: [
      { kop: 'Sieraden voor hem', tekst: 'Steeds meer mannen dragen een armband of ketting. Kies iets simpels en stoers: een leren armband, een stalen schakelketting of een zegelring. Staal is sterk en krast niet snel, dus ook geschikt voor wie met zijn handen werkt.' }
    ] },
  'sieraden/echt-goud': {
    tekst: 'Echt gouden sieraden van 14 karaat: kettingen, oorbellen, ringen en armbanden die een leven lang meegaan.',
    seoTitel: 'Echt gouden sieraden: 14 karaat goud cadeau geven',
    seoTekst: 'Echt gouden sieraden als cadeau: kettingen, oorbellen, ringen en armbanden van 14 karaat goud. Voor een bijzondere gelegenheid, zoals een verjaardag, jubileum of geboorte.',
    gids: [
      { kop: 'Waarom echt goud?', tekst: 'Echt goud verkleurt niet, is goed voor een gevoelige huid en houdt zijn waarde. Daarom is het een cadeau voor een bijzonder moment: een 18e verjaardag, een jubileum of de geboorte van een kind. 14 karaat is in Nederland het gewone gehalte voor sieraden: sterk genoeg voor elke dag.' }
    ] },
  'sieraden/zilver': {
    tekst: 'Zilveren sieraden (925 sterling zilver): tijdloos, betaalbaar en geschikt voor elke dag.',
    seoTitel: 'Zilveren sieraden: 925 zilver kettingen, oorbellen en armbanden',
    seoTekst: 'Zilveren sieraden als cadeau: kettingen, oorbellen, ringen en armbanden van 925 sterling zilver. Tijdloos en betaalbaar, voor haar en hem.',
    gids: [
      { kop: 'Zilver als cadeau', tekst: 'Zilver is tijdloos en past bij bijna iedereen. 925 zilver (sterling zilver) is echt zilver dat jaren meegaat. Wordt het dof? Even poetsen met een zilverdoekje en het glanst weer.' }
    ] },
  'sieraden/verguld-staal': {
    tekst: 'Vergulde en stalen sieraden: de look van goud voor een vriendelijke prijs, sterk en kleurecht.',
    seoTitel: 'Vergulde en stalen sieraden: goudkleurig en betaalbaar',
    seoTekst: 'Vergulde sieraden en sieraden van edelstaal: goudkleurige kettingen, oorbellen, ringen en armbanden voor een vriendelijke prijs. Sterk en geschikt voor elke dag.',
    gids: [
      { kop: 'Verguld of staal?', tekst: 'Verguld is zilver of staal met een laagje goud: de goudlook zonder de prijs. Edelstaal is sterk, krast niet snel en verkleurt niet; ideaal voor dagelijks gebruik. Beide zijn een goede keuze als je wel iets moois wilt geven, maar geen honderden euro\'s wilt uitgeven.' }
    ] },

  /* ---------------- DRANKEN ---------------- */
  'dranken': {
    seoTitel: 'Dranken cadeau: whisky, gin, rum, cognac, champagne en meer',
    seoTekst: 'Een fles cadeau geven? Whisky, gin, rum, cognac, wodka, tequila, likeur, champagne en alcoholvrij. Mooie flessen en cadeausets voor de feestdagen en verjaardagen.',
    gids: [
      { kop: 'Een fles als cadeau', tekst: 'Een goede fles is een klassiek cadeau voor hem én haar. Kies iets wat iemand al graag drinkt, of een mooie cadeauset met glazen erbij. Voor wie geen alcohol drinkt, staan er alcoholvrije flessen bij. Alleen voor 18 jaar en ouder.' }
    ] },
  'dranken/whisky': {
    tekst: 'Whisky om cadeau te geven: Schotse single malts, blends, Ierse en Amerikaanse whisky en cadeausets.',
    seoTitel: 'Whisky cadeau: single malt, blends en cadeausets',
    seoTekst: 'Whisky cadeau geven? Schotse single malt, blended whisky, Ierse en Amerikaanse whiskey en cadeausets met glazen. Voor beginners en kenners.',
    gids: [
      { kop: 'Welke whisky geef je?', tekst: 'Voor een beginner is een zachte, toegankelijke whisky het leukst, zoals een Speyside single malt of een goede blend. Kenners waarderen iets bijzonders: een oudere fles of een rokerige whisky van Islay. Een cadeauset met glazen maakt het af.' }
    ] },
  'dranken/cognac-brandy': {
    tekst: 'Cognac en brandy: klassiek, warm en mooi om te geven na het eten.',
    seoTitel: 'Cognac en brandy cadeau: klassieke flessen en cadeausets',
    seoTekst: 'Cognac of brandy cadeau geven? Bekende huizen als Rémy Martin, Hennessy en Martell, plus Spaanse brandy en cadeausets. Een klassiek cadeau voor na het eten.',
    gids: [
      { kop: 'Cognac als cadeau', tekst: 'Cognac is een cadeau met klasse, vaak voor een vader, opa of een goede vriend. VS is jong en fris, VSOP wat ronder, XO rijk en lang gerijpt. Hoe meer letters, hoe duurder en hoe bijzonderder.' }
    ] },
  'dranken/rum': {
    tekst: 'Rum uit het Caribisch gebied en daarbuiten: wit, bruin, gekruid en gerijpt.',
    seoTitel: 'Rum cadeau: gerijpte rum, spiced rum en cadeausets',
    seoTekst: 'Rum cadeau geven? Gerijpte rum, spiced rum, witte rum en cadeausets uit Cuba, Jamaica, Barbados en meer. Voor cocktails of puur.',
    gids: [
      { kop: 'Welke rum?', tekst: 'Spiced rum (met kruiden en vanille) is zacht en populair bij wie net begint. Gerijpte bruine rum drink je puur, zoals whisky. Witte rum is voor cocktails. Kies een fles met een mooi verhaal of verpakking, dan is het meteen een cadeau.' }
    ] },
  'dranken/gin': {
    tekst: 'Gin voor de gin-tonic liefhebber: klassieke London Dry, kruidige gins en cadeausets met tonic.',
    seoTitel: 'Gin cadeau: gins en gin-tonic cadeausets',
    seoTekst: 'Gin cadeau geven? Bekende en bijzondere gins, gin-tonic pakketten met tonic en glazen, en cadeausets. Voor wie van een goede gin-tonic houdt.',
    gids: [
      { kop: 'Gin als cadeau', tekst: 'Gin is de laatste jaren enorm populair. Een gin-tonic pakket met tonic en een mooi glas is een compleet cadeau. Kies een klassieke droge gin voor de puurist, of een fruitige of kruidige gin voor wie van iets anders houdt.' }
    ] },
  'dranken/wodka': {
    tekst: 'Wodka in mooie flessen: zuiver, zacht en de basis van veel cocktails.',
    seoTitel: 'Wodka cadeau: bekende merken en bijzondere flessen',
    seoTekst: 'Wodka cadeau geven? Bekende merken als Grey Goose, Belvedere en Absolut, en bijzondere flessen. Voor cocktails of ijskoud puur.',
    gids: [
      { kop: 'Wodka geven', tekst: 'Bij wodka maakt de fles vaak het cadeau: kies een mooie of bijzondere fles. Premium wodka is zachter en drink je ijskoud puur. Voor de cocktailmaker is een klassieke fles een goede basis.' }
    ] },
  'dranken/tequila': {
    tekst: 'Tequila en mezcal uit Mexico: van blanco voor cocktails tot gerijpte añejo om puur te drinken.',
    seoTitel: 'Tequila cadeau: blanco, reposado, añejo en mezcal',
    seoTekst: 'Tequila of mezcal cadeau geven? Blanco voor cocktails, reposado en añejo om puur te drinken, en rokerige mezcal. Mooie flessen voor de liefhebber.',
    gids: [
      { kop: 'Tequila kiezen', tekst: 'Blanco is helder en fris, voor margarita\'s. Reposado heeft een paar maanden op hout gelegen en is zachter. Añejo is lang gerijpt en drink je puur, als een whisky. Mezcal is de rokerige broer van tequila, voor wie van bijzonder houdt.' }
    ] },
  'dranken/likeur': {
    tekst: 'Likeuren om te geven: romig, fruitig of kruidig, voor bij de koffie of in een cocktail.',
    seoTitel: 'Likeur cadeau: Baileys, limoncello, amaretto en meer',
    seoTekst: 'Likeur cadeau geven? Romige likeuren zoals Baileys, fruitige likeuren zoals limoncello, amaretto, Cointreau en cadeausets. Lekker bij de koffie of in een cocktail.',
    gids: [
      { kop: 'Likeur als cadeau', tekst: 'Likeur is zoeter en zachter dan sterke drank, en daardoor een toegankelijk cadeau. Romige likeur is lekker bij de koffie, limoncello na het eten, amaretto en Cointreau in cocktails. Ook leuk om samen met een paar glaasjes te geven.' }
    ] },
  'dranken/bubbels': {
    tekst: 'Champagne, cava en prosecco om te vieren: voor een verjaardag, jubileum of de feestdagen.',
    seoTitel: 'Champagne en bubbels cadeau: champagne, cava en prosecco',
    seoTekst: 'Bubbels cadeau geven? Champagne van bekende huizen, cava, prosecco en cadeausets met glazen. Om te vieren: verjaardag, jubileum, nieuw huis of de feestdagen.',
    gids: [
      { kop: 'Welke bubbels?', tekst: 'Champagne is het feestelijkst en komt alleen uit de Champagne-streek in Frankrijk. Cava (Spanje) en prosecco (Italië) zijn goedkoper en ook heel lekker. Voor een groot moment kies je champagne, voor een gezellige avond cava of prosecco.' }
    ] },
  'dranken/wijn': {
    tekst: 'Wijn om cadeau te geven: rood, wit, rosé en mooie cadeausets met twee of drie flessen.',
    seoTitel: 'Wijn cadeau: rode wijn, witte wijn en wijncadeausets',
    seoTekst: 'Wijn cadeau geven? Rode en witte wijn, rosé, wijnpakketten en cadeausets in een mooie kist. Voor een etentje, verjaardag of bedankje.',
    gids: [
      { kop: 'Een fles wijn als cadeau', tekst: 'Wijn is het klassieke cadeau als je ergens gaat eten of iemand wilt bedanken. Kies een fles in een mooie kist of een set van twee of drie flessen om te proeven. Weet je niet of iemand rood of wit drinkt? Een set met allebei lost dat op.' }
    ] },
  'dranken/wijnaccessoires': {
    tekst: 'Wijnaccessoires: kurkentrekkers, decanteerkaraffen, wijnglazen, koelers en cadeausets voor de wijnliefhebber.',
    seoTitel: 'Wijnaccessoires cadeau: kurkentrekkers, karaffen en wijnglazen',
    seoTekst: 'Cadeau voor een wijnliefhebber? Kurkentrekkers, decanteerkaraffen, wijnglazen, wijnkoelers, schenktuiten en cadeausets. Mooi erbij bij een goede fles.',
    gids: [
      { kop: 'Erbij bij een goede fles', tekst: 'Een goede kurkentrekker of een mooie karaf is een cadeau dat bij elke fles weer gebruikt wordt. Geef je een fles wijn? Doe er een set glazen of een wijnkoeler bij, dan is het meteen een compleet cadeau.' }
    ] },
  'dranken/alcoholvrij': {
    tekst: 'Alcoholvrije dranken om te geven: alcoholvrije gin, bubbels zonder alcohol en bijzondere limonades.',
    seoTitel: 'Alcoholvrij cadeau: alcoholvrije gin, bubbels en bijzondere dranken',
    seoTekst: 'Alcoholvrij cadeau geven? Alcoholvrije gin en bubbels, bijzondere limonades en siropen. Voor wie niet drinkt, zwanger is of moet rijden, en toch wil proosten.',
    gids: [
      { kop: 'Proosten zonder alcohol', tekst: 'Steeds meer mensen drinken geen alcohol, en daar zijn mooie cadeaus voor. Alcoholvrije gin smaakt in een tonic bijna als het echte werk, alcoholvrije bubbels zijn feestelijk bij een verjaardag of zwangerschap. Een bijzondere limonade is leuk voor kinderen en volwassenen.' }
    ] },

  /* ---------------- ELEKTRONICA ---------------- */
  'elektronica': {
    seoTitel: 'Elektronica en gadgets cadeau: audio, slimme gadgets, telefoon, gaming en foto',
    seoTekst: 'Gadgets en elektronica als cadeau: speakers en koptelefoons, slimme gadgets voor thuis, telefoonaccessoires, gaming en instant camera\'s. Voor jong en oud.',
    gids: [
      { kop: 'Een gadget cadeau geven', tekst: 'Gadgets zijn leuk voor wie van nieuwe dingen houdt. Kies iets wat echt gebruikt wordt: een goede speaker, een powerbank, een instant camera. Let bij telefoonaccessoires op of het bij het toestel past.' }
    ] },
  'elektronica/audio': {
    tekst: 'Speakers, koptelefoons en oordopjes van JBL, Marshall, Sony, Bose en meer.',
    seoTitel: 'Audio cadeau: bluetooth speakers, koptelefoons en oordopjes',
    seoTekst: 'Audio cadeau geven? Bluetooth speakers van JBL en Marshall, koptelefoons en oordopjes van Sony, Bose en JBL, platenspelers en meer. Voor muziekliefhebbers.',
    gids: [
      { kop: 'Speaker of koptelefoon?', tekst: 'Een bluetooth speaker is leuk voor in huis, op het balkon of op vakantie. Een koptelefoon met ruisonderdrukking is een cadeau voor wie veel reist of thuiswerkt. Oordopjes zijn handig voor sporten. Bekende merken klinken beter en gaan langer mee.' }
    ] },
  'elektronica/slimme-gadgets': {
    tekst: 'Slimme gadgets voor thuis: slimme lampen, wake-up lights, weerstations, trackers en meer.',
    seoTitel: 'Slimme gadgets cadeau: slimme lampen, weerstations en handige apparaten',
    seoTekst: 'Slimme gadgets als cadeau: slimme verlichting, wake-up lights, weerstations, trackers en handige apparaten voor thuis en onderweg. Voor wie van techniek houdt.',
    gids: [
      { kop: 'Handig en leuk', tekst: 'De beste gadgets zijn de dingen die je elke dag gebruikt: een wake-up light om rustig wakker te worden, slimme lampen die je met je telefoon bedient, een weerstation voor opa. Kijk of het werkt met wat iemand al heeft, zoals een iPhone of Android-telefoon.' }
    ] },
  'elektronica/telefoon': {
    tekst: 'Telefoonaccessoires: powerbanks, draadloze opladers, MagSafe-houders, selfiesticks en trackers.',
    seoTitel: 'Telefoonaccessoires cadeau: powerbanks, opladers en MagSafe',
    seoTekst: 'Cadeau voor bij de telefoon: powerbanks, draadloze opladers, MagSafe-accessoires, selfiesticks, trackers en houders. Van Belkin, Anker en meer.',
    gids: [
      { kop: 'Past het bij de telefoon?', tekst: 'Een powerbank of draadloze oplader werkt met bijna elke telefoon. MagSafe-accessoires zijn voor iPhones (vanaf de iPhone 12) of voor Android-telefoons met een magnetisch hoesje. Kijk dus even welk toestel iemand heeft.' }
    ] },
  'elektronica/gaming': {
    tekst: 'Cadeaus voor gamers: controllers, headsets, ledverlichting, accessoires en games.',
    seoTitel: 'Gaming cadeau: controllers, headsets en accessoires voor gamers',
    seoTekst: 'Cadeau voor een gamer? Controllers, headsets, ledverlichting voor achter het scherm, oplaadstations, muismatten en accessoires voor PlayStation, Xbox, Switch en pc.',
    gids: [
      { kop: 'Cadeau voor een gamer', tekst: 'Vraag eerst waarop iemand speelt: PlayStation, Xbox, Nintendo Switch of pc. Een extra controller, een goede headset of sfeerverlichting voor achter het scherm zijn veilige cadeaus. Weet je het niet? Een gamerstoel-kussen of een mok van zijn favoriete game kan ook.' }
    ] },
  'elektronica/foto-video': {
    tekst: 'Instant camera\'s, fotoprinters, webcams en actiecamera\'s van Fujifilm Instax, Polaroid, Canon en Insta360.',
    seoTitel: 'Foto en video cadeau: Instax, Polaroid, fotoprinters en webcams',
    seoTekst: 'Foto cadeau geven? Instant camera\'s van Fujifilm Instax en Polaroid, fotoprinters voor je telefoon, webcams en actiecamera\'s. Leuk voor tieners en volwassenen.',
    gids: [
      { kop: 'Foto\'s die je vast kunt houden', tekst: 'Een instant camera is een feestcadeau: je drukt af en hebt meteen een foto in je hand. Een fotoprinter voor je telefoon doet hetzelfde met foto\'s die je al hebt. Vergeet niet er fotopapier bij te geven; dat is apart te koop.' }
    ] },

  /* ---------------- SPORT & OUTDOOR ---------------- */
  'sport-outdoor': {
    seoTitel: 'Sport en outdoor cadeaus: fitness, wandelen, fietsen, kamperen, reizen, darts en golf',
    seoTekst: 'Cadeaus voor sportieve mensen: fitness, wandelen, fietsen, kamperen, reizen, darts, golf en metaaldetectie. Van klein cadeautje tot complete set.',
    gids: [
      { kop: 'Cadeau voor een sporter', tekst: 'Een sporter is blij met iets voor zijn sport: goede spullen gaan lang mee en worden elke week gebruikt. Weet je niet precies wat iemand al heeft? Kies dan iets kleins en handigs, zoals een drinkfles, een hoofdlamp of een goede sok.' }
    ] },
  'sport-outdoor/fitness': {
    tekst: 'Fitnessspullen voor thuis: halters, kettlebells, weerstandsbanden, yogamatten en massage-apparaten.',
    seoTitel: 'Fitness cadeau: halters, kettlebells, yogamatten en massage',
    seoTekst: 'Cadeau voor een sportieve thuis-trainer: dumbbells, kettlebells, weerstandsbanden, yogamatten, foamrollers en massagepistolen. Van Tunturi, adidas en meer.',
    gids: [
      { kop: 'Trainen zonder sportschool', tekst: 'Met een paar halters, een weerstandsband en een goede mat kun je thuis bijna alles doen. Een foamroller of massagepistool is een fijn cadeau voor na het sporten. Kies gewichten die passen bij het niveau: beginners starten licht.' }
    ] },
  'sport-outdoor/wandelen': {
    tekst: 'Voor de wandelaar: drinkflessen, hoofdlampen, verrekijkers, zakmessen, wandelsokken en rugzakken.',
    seoTitel: 'Wandelen cadeau: drinkflessen, hoofdlampen, verrekijkers en zakmessen',
    seoTekst: 'Cadeau voor een wandelaar? Drinkflessen van Hydro Flask en Dopper, hoofdlampen van Petzl en Ledlenser, verrekijkers, Victorinox zakmessen en warme wandelsokken.',
    gids: [
      { kop: 'Cadeau voor wie graag buiten is', tekst: 'Wandelaars gebruiken hun spullen vaak en lang. Een goede drinkfles, een hoofdlamp voor de donkere maanden of een compacte verrekijker worden echt gebruikt. Een Zwitsers zakmes is een klassiek cadeau dat een leven lang meegaat.' }
    ] },
  'sport-outdoor/fietsen': {
    tekst: 'Fietsaccessoires als cadeau: fietstassen, verlichting, fietscomputers, sloten, pompen en gereedschap.',
    seoTitel: 'Fietsen cadeau: fietstassen, verlichting, fietscomputers en sloten',
    seoTekst: 'Cadeau voor een fietser? Fietstassen van Basil, verlichting van BBB en Sigma, fietscomputers, sloten van ABUS, pompen en multitools. Voor de stadsfiets, e-bike en racefiets.',
    gids: [
      { kop: 'Voor elke fietser wat', tekst: 'Voor de dagelijkse fietser zijn goede verlichting, een stevig slot en een mooie fietstas het nuttigst. De racefietser of mountainbiker is blij met een fietscomputer, een kleine pomp of handig gereedschap. Kijk of het past op het type fiets.' }
    ] },
  'sport-outdoor/kamperen': {
    tekst: 'Kampeerspullen: hoofdlampen, koelboxen, campingstoelen, zakmessen en handige accessoires voor tent en camper.',
    seoTitel: 'Kamperen cadeau: hoofdlampen, koelboxen, stoelen en accessoires',
    seoTekst: 'Cadeau voor een kampeerder? Hoofdlampen, koelboxen, campingstoelen, zakmessen, koffiemakers voor onderweg en handige accessoires voor tent, caravan en camper.',
    gids: [
      { kop: 'Cadeau voor de kampeerder', tekst: 'Kampeerders houden van spullen die klein, licht en stevig zijn. Een hoofdlamp, een goede thermosfles of een compacte stoel wordt elke vakantie meegenomen. Voor de caravan of camper zijn gezellige dingen leuk, zoals een lichtsnoer of een mooi servies.' }
    ] },
  'sport-outdoor/reizen': {
    tekst: 'Reiscadeaus: koffers, toilettassen, nekkussens, inpakzakken, reisföhns en handige reisaccessoires.',
    seoTitel: 'Reizen cadeau: koffers, toilettassen, nekkussens en reisaccessoires',
    seoTekst: 'Cadeau voor iemand die graag reist? Handbagagekoffers, toilettassen, nekkussens, inpakzakken, reisföhns, bagagelabels en meer. Van Eastpak, Thule, Fjällräven en Samsonite.',
    gids: [
      { kop: 'Cadeau voor de reiziger', tekst: 'Handige reisspullen worden elke reis gebruikt: een goed nekkussen, inpakzakken om de koffer op orde te houden, een stevige toilettas. Een handbagagekoffer is een groter cadeau voor wie vaak een weekend weg gaat. Kijk bij koffers naar de maat: 55 cm past als handbagage bij de meeste maatschappijen.' }
    ] },
  'sport-outdoor/darts': {
    tekst: 'Alles voor de dartliefhebber: dartborden, dartpijlen van Winmau, Target en Harrows, kabinetten en accessoires.',
    seoTitel: 'Darts cadeau: dartborden, dartpijlen en dartkabinetten',
    seoTekst: 'Cadeau voor een darter? Dartborden van Winmau, dartpijlen van Target, Harrows en Red Dragon, dartkabinetten met verlichting, flights, shafts en scoreborden.',
    gids: [
      { kop: 'Cadeau voor een darter', tekst: 'Een beginner is blij met een compleet pakket: bord, pijlen en een kabinet of beschermring. Wie al dart, kiest zelf zijn pijlen, maar extra flights, shafts, een dartmat of een elektronisch scorebord zijn altijd welkom. Pijlen van bekende spelers zijn een leuk cadeau voor fans.' }
    ] },
  'sport-outdoor/golf': {
    tekst: 'Cadeaus voor golfers: oefenmateriaal, golfballen, handschoenen, accessoires en golfkleding.',
    seoTitel: 'Golf cadeau: golfballen, oefenmateriaal en accessoires voor golfers',
    seoTekst: 'Cadeau voor een golfer? Golfballen van Titleist en Callaway, oefenmatten en puttingtrainers, golfhandschoenen, handdoeken, zonnebrillen en golfaccessoires.',
    gids: [
      { kop: 'Cadeau voor een golfer', tekst: 'Golfers hebben hun clubs al, dus geef iets erbij: goede golfballen, een puttingmat om thuis te oefenen, een handschoen of een mooie golfhanddoek. Voor een groter cadeau is een golfzonnebril of een afstandsmeter een goede keuze.' }
    ] },
  'sport-outdoor/metaaldetectie': { },

  /* ---------------- WONEN ---------------- */
  'wonen': {
    seoTitel: 'Wonen en decoratie cadeau: kaarsen, huisgeuren, verlichting, plaids en woonaccessoires',
    seoTekst: 'Cadeaus voor in huis: geurkaarsen, kandelaars, huisgeuren, sfeerverlichting, plaids, kussens, woonaccessoires en kerstdecoratie. Mooi en gezellig.',
    gids: [
      { kop: 'Een cadeau voor in huis', tekst: 'Iets voor in huis is een cadeau waar iemand elke dag naar kijkt. Een geurkaars, een mooie lamp of een warme plaid past bij bijna elk interieur. Kies rustige kleuren als je de smaak van iemand niet precies kent.' }
    ] },
  'wonen/kaarsen-geur': {
    tekst: 'Geurkaarsen, kandelaars en kaarsen van Rituals, Yankee Candle, Bolsius en meer.',
    seoTitel: 'Kaarsen en kandelaars cadeau: geurkaarsen van Rituals, Yankee Candle en meer',
    seoTekst: 'Kaarsen als cadeau: geurkaarsen van Rituals, Yankee Candle, Ted Sparks en Bolsius, mooie kandelaars en kaarsensets. Voor een gezellig huis.',
    gids: [
      { kop: 'Een kaars als cadeau', tekst: 'Een geurkaars is een klein verwencadeau voor haar, voor collega\'s en als bedankje. Kies een geur die bij het seizoen past: fris in de zomer, warm en kruidig in de winter. Een mooie kandelaar is een cadeau dat blijft staan als de kaars op is.' }
    ] },
  'wonen/huisgeuren': {
    tekst: 'Huisgeuren: geurstokjes, huisparfum en diffusers van Rituals, Millefiori, Meraki en meer.',
    seoTitel: 'Huisgeuren cadeau: geurstokjes, huisparfum en diffusers',
    seoTekst: 'Huisgeur cadeau geven? Geurstokjes van Rituals, Millefiori, Yankee Candle en Meraki, huisparfum, roomsprays en cadeausets. Weken lang een lekker ruikend huis.',
    gids: [
      { kop: 'Geurstokjes of kaars?', tekst: 'Geurstokjes geuren de hele dag, zonder vuur, en gaan weken tot maanden mee. Daarom zijn ze een fijn cadeau voor wie niet graag kaarsen brandt. Kies een lichte geur voor de slaapkamer en iets warmers voor de woonkamer.' }
    ] },
  'wonen/woonaccessoires': {
    tekst: 'Woonaccessoires als cadeau: vazen, fotolijsten, dienbladen, klokken en kleine decoratie.',
    seoTitel: 'Woonaccessoires cadeau: vazen, fotolijsten, dienbladen en decoratie',
    seoTekst: 'Woonaccessoires om cadeau te geven: vazen, fotolijsten, dienbladen, klokken, boekensteunen en kleine decoratie voor in huis. Voor een nieuw huis of zomaar.',
    gids: [
      { kop: 'Cadeau voor een nieuw huis', tekst: 'Een vaas, een mooie fotolijst of een dienblad is een klassiek cadeau voor een housewarming of verjaardag. Kies iets tijdloos in een rustige kleur, dan past het bij bijna elk interieur.' }
    ] },
  'wonen/verlichting': {
    tekst: 'Sfeerverlichting: lavalampen, sterrenprojectors, slimme lampen, lichtsnoeren en tafellampen.',
    seoTitel: 'Sfeerverlichting cadeau: lavalampen, sterrenprojectors en slimme lampen',
    seoTekst: 'Sfeerverlichting als cadeau: lavalampen van Mathmos, sterrenprojectors, slimme lampen van Govee en Philips Hue, lichtsnoeren en tafellampen. Voor donkere avonden.',
    gids: [
      { kop: 'Licht voor donkere avonden', tekst: 'Een sfeerlamp maakt een kamer meteen gezelliger. Lavalampen zijn rustgevend, sterrenprojectors leuk voor kinderen en tieners, slimme lampen voor wie van gadgets houdt. Lees ook onze gids over sfeerlicht voor donkere avonden.' }
    ] },
  'wonen/plaids-kussens': {
    tekst: 'Warme plaids, zachte kussens en dekens om onder te kruipen op de bank.',
    seoTitel: 'Plaids en kussens cadeau: warme plaids, dekens en sierkussens',
    seoTekst: 'Plaid of kussen cadeau geven? Warme plaids, fleecedekens, verwarmde dekens en sierkussens voor op de bank. Een verwencadeau voor koude avonden.',
    gids: [
      { kop: 'Warm en zacht', tekst: 'Een plaid is een cadeau waar iemand de hele winter onder kruipt. Fleece is zacht en betaalbaar, wol en katoen zijn luxer. Een verwarmde deken is een cadeau voor wie het altijd koud heeft. Kies een kleur die bij de bank past.' }
    ] },
  'wonen/kerstdecoratie': {
    tekst: 'Kerstdecoratie: kerstverlichting, kersthangers, kandelaars, kerstdorpen en alles voor een gezellig kersthuis.',
    seoTitel: 'Kerstdecoratie: kerstverlichting, kersthangers en kerstversiering',
    seoTekst: 'Kerstdecoratie kopen? Kerstverlichting, kersthangers, kerstkandelaars, kerstdorpen, kerststerren en versiering voor binnen en buiten. Ook leuk als kerstcadeau.',
    gids: [
      { kop: 'Een gezellig kersthuis', tekst: 'Mooie kerstdecoratie is ook een leuk cadeau: een bijzondere kersthanger, een lichtsnoer of een kandelaar voor op tafel. Begin op tijd: vanaf half november is de keuze het grootst, in december raken populaire dingen snel op.' }
    ] },

  /* ---------------- KEUKEN ---------------- */
  'keuken': {
    seoTitel: 'Keuken en tafelen cadeau: koken, bakken, keukenapparaten, serveren en koffie',
    seoTekst: 'Cadeaus voor in de keuken: kookgerei, keukenapparaten, bakvormen, servies en serveerspullen, koffie- en theespullen en opbergen. Voor thuiskoks en bakkers.',
    gids: [
      { kop: 'Cadeau voor de thuiskok', tekst: 'Wie graag kookt of bakt, is blij met goede spullen: een scherp mes, een mooie pan, een handige bakvorm. Voor de koffiedrinker is een percolator of mooie mok een fijn cadeau. Kijk ook bij Eten & Drinken om er iets lekkers bij te geven.' }
    ] },
  'keuken/koken': {
    tekst: 'Kookgerei om cadeau te geven: messen, pannen, keukengerei en handige hulpjes van bekende merken.',
    seoTitel: 'Koken cadeau: messen, pannen en keukengerei voor thuiskoks',
    seoTekst: 'Cadeau voor iemand die graag kookt? Messen, pannen, keukengerei van KitchenAid, Le Creuset, WMF en meer, en handige hulpjes voor in de keuken.',
    gids: [
      { kop: 'Cadeau voor wie graag kookt', tekst: 'Een goed koksmes of een mooie pan is een cadeau voor jaren. Kleine hulpjes zoals een kookwekker, een rasp of een mooie set keukengerei zijn leuk voor een kleiner budget. Kies bekende merken: die gaan langer mee.' }
    ] },
  'keuken/keukenapparaten': {
    tekst: 'Keukenapparaten als cadeau: airfryers, blenders, koffiemachines, wafelijzers, waterkokers en meer.',
    seoTitel: 'Keukenapparaten cadeau: airfryer, blender, koffiemachine en meer',
    seoTekst: 'Keukenapparaat cadeau geven? Airfryers, blenders, staafmixers, koffiemachines van Nespresso en De\'Longhi, wafelijzers, gourmetstellen en waterkokers van Philips, Tefal en Bosch.',
    gids: [
      { kop: 'Een apparaat dat gebruikt wordt', tekst: 'Een keukenapparaat is een groot cadeau, dus kies iets wat iemand echt mist: een airfryer voor snel koken, een blender voor smoothies, een koffiemachine voor de koffieliefhebber. Een gourmetstel of wafelijzer is leuk voor gezinnen en voor de feestdagen.' }
    ] },
  'keuken/bakken': {
    tekst: 'Bakspullen als cadeau: bakvormen, mixers, spuitzakken, uitsteekvormen en bakboeken.',
    seoTitel: 'Bakken cadeau: bakvormen, uitsteekvormen en bakspullen',
    seoTekst: 'Cadeau voor iemand die graag bakt? Bakvormen van Dr. Oetker, KitchenAid en Nordic Ware, uitsteekvormen, spuitzakken, bakmatten en bakboeken. Voor beginners en echte bakkers.',
    gids: [
      { kop: 'Cadeau voor de thuisbakker', tekst: 'Een bijzondere bakvorm, zoals een tulband met een mooi patroon, is een cadeau dat meteen gebruikt wordt. Voor kinderen zijn uitsteekvormen en een kinderbakboek leuk. Geef je een bakset? Doe er een lekker recept bij.' }
    ] },
  'keuken/serveren': {
    tekst: 'Servies en serveerspullen: mooie borden, glazen, bekers, schalen en etagères om mee uit te pakken.',
    seoTitel: 'Serveren cadeau: servies, glazen, bekers en etagères',
    seoTekst: 'Servies en serveerspullen als cadeau: borden, mokken en bekers, glazen, schalen, etagères en tafelaccessoires van Villeroy & Boch, Blond Amsterdam en meer.',
    gids: [
      { kop: 'Mooi aan tafel', tekst: 'Een mooie beker, een set glazen of een etagère is een cadeau dat bij elk etentje op tafel komt. Vrolijk servies van Blond Amsterdam is leuk voor haar, geslepen glazen voor hem. Voor Kerst zijn er speciale kerstbekers en borden.' }
    ] },
  'keuken/koffie-thee': {
    tekst: 'Koffie- en theespullen: percolators, melkopschuimers, mooie mokken, theepotten en kopjes.',
    seoTitel: 'Koffie- en theespullen cadeau: percolators, mokken en theepotten',
    seoTekst: 'Cadeau voor de koffie- of theeliefhebber: Bialetti percolators, melkopschuimers, mooie mokken en kopjes, theepotten en cadeausets. Mooi om te geven, elke dag in gebruik.',
    gids: [
      { kop: 'Cadeau voor de koffie- of theedrinker', tekst: 'Een percolator van Bialetti is een klassiek cadeau voor wie van echte espresso houdt. Een mooie mok is klein en persoonlijk. Theedrinkers zijn blij met een goede theepot of een mooi kopje. Kijk bij Eten & Drinken voor koffie of thee om erbij te geven.' }
    ] },
  'keuken/opbergen': {
    tekst: 'Opbergen in de keuken: lunchboxen, bewaardozen, voorraadpotten en drinkflessen van Mepal en meer.',
    seoTitel: 'Opbergen cadeau: lunchboxen, bewaardozen en voorraadpotten',
    seoTekst: 'Handig cadeau voor de keuken: lunchboxen en broodtrommels van Mepal, bewaardozen, voorraadpotten, koekjespotten en drinkflessen. Voor kinderen en volwassenen.',
    gids: [
      { kop: 'Handig en mooi', tekst: 'Een goede lunchbox of broodtrommel is een cadeau dat elke dag mee gaat naar school of werk. Een mooie koekjespot of voorraadpot staat leuk op het aanrecht. Bewaardozen van Mepal zijn een praktisch cadeau voor wie graag vooruit kookt.' }
    ] },

  /* ---------------- TUIN & KLUSSEN ---------------- */
  'tuin-klussen': {
    seoTitel: 'Tuin en klussen cadeau: tuingereedschap, planten, gereedschap en buitenverlichting',
    seoTekst: 'Cadeaus voor de tuinier en de klusser: tuingereedschap van Gardena en Fiskars, planten en zaden, gereedschap van Bosch en Stanley, en buitenverlichting.',
    gids: [
      { kop: 'Cadeau voor de tuinier of klusser', tekst: 'Wie graag in de tuin werkt, is blij met een goede snoeischaar of handige set. De klusser wil goed gereedschap van een bekend merk. Buitenverlichting is een cadeau waar het hele gezin iets aan heeft.' }
    ] },
  'tuin-klussen/tuingereedschap': {
    tekst: 'Tuingereedschap van Gardena, Fiskars en Wolf-Garten: snoeischaren, heggenscharen, handgereedschap en sets.',
    seoTitel: 'Tuingereedschap cadeau: snoeischaren, heggenscharen en sets van Gardena en Fiskars',
    seoTekst: 'Cadeau voor de tuinier? Snoeischaren, heggenscharen, takkenscharen en handgereedschap van Gardena, Fiskars en Wolf-Garten. Ook tuinsets voor kinderen.',
    gids: [
      { kop: 'Goed gereedschap gaat jaren mee', tekst: 'Een scherpe snoeischaar van een bekend merk is een cadeau waar een tuinier elk seizoen plezier van heeft. Voor een groter budget is een heggenschaar of takkenschaar een goede keuze. Kinderen vinden een eigen tuinsetje geweldig.' }
    ] },
  'tuin-klussen/planten-zaden': {
    tekst: 'Planten, bollen, zaden en kweeksets om cadeau te geven, voor binnen en buiten.',
    seoTitel: 'Planten en zaden cadeau: kweeksets, bollen en bloemzaden',
    seoTekst: 'Groen cadeau geven? Kweeksets, bloembollen, zaden, kamerplanten en alles om zelf te kweken. Leuk voor beginners en voor wie al groene vingers heeft.',
    gids: [
      { kop: 'Zelf kweken', tekst: 'Een kweekset is een leuk cadeau voor wie wil beginnen met tuinieren, ook op een balkon. Bloembollen geef je in het najaar, zaden in het voorjaar. Voor kinderen zijn snelgroeiende zaden het leukst, dan zien ze snel resultaat.' }
    ] },
  'tuin-klussen/gereedschap': {
    tekst: 'Gereedschap als cadeau: boormachines, schroevendraaiers, multitools en gereedschapssets van Bosch, Stanley en meer.',
    seoTitel: 'Gereedschap cadeau: boormachines, multitools en gereedschapssets',
    seoTekst: 'Cadeau voor een klusser? Accuboormachines, gereedschapssets, multitools, zakmessen en handgereedschap van Bosch, Stanley, Victorinox en Leatherman.',
    gids: [
      { kop: 'Cadeau voor de klusser', tekst: 'Een compleet gereedschapsset is een goed begin voor wie net op zichzelf woont. De ervaren klusser is blij met een accuboormachine of een goede multitool. Kies bekende merken; goedkoop gereedschap gaat snel kapot.' }
    ] },
  'tuin-klussen/buitenverlichting': {
    tekst: 'Buitenverlichting op zonne-energie en op stroom: wandlampen, prikspots, lichtsnoeren en lantaarns.',
    seoTitel: 'Buitenverlichting cadeau: solar tuinverlichting, wandlampen en lichtsnoeren',
    seoTekst: 'Tuinverlichting als cadeau: solar lampen, wandlampen voor buiten, prikspots, lichtsnoeren en lantaarns van Philips en Calex. Gezellig licht in de tuin en op het terras.',
    gids: [
      { kop: 'Licht in de tuin', tekst: 'Solar lampen zijn het makkelijkst: geen kabel, gewoon neerzetten. Een lichtsnoer maakt een terras meteen gezellig. Voor bij de voordeur is een wandlamp met sensor handig. Let op of een lamp geschikt is voor buiten (waterdicht).' }
    ] },

  /* ---------------- METAALDETECTIE ---------------- */
  'metaaldetectie': {
    seoTitel: 'Metaaldetectie: metaaldetectors, pinpointers, scheppen en accessoires',
    seoTekst: 'Alles voor metaaldetectie: metaaldetectors van Garrett, Minelab, Nokta en XP, pinpointers, scheppen, magneetvissen, tassen en boeken. Voor beginners en gevorderden.',
    gids: [
      { kop: 'Beginnen met metaaldetectie', tekst: 'Metaaldetectie is een hobby voor buiten, met elke keer de kans op een mooie vondst. Een beginner heeft genoeg aan een eenvoudige detector, een pinpointer en een schep. Kijk ook even naar de regels: in Nederland mag je zoeken met toestemming van de grondeigenaar, en vondsten ouder dan 50 jaar moet je melden.' },
      { kop: 'Cadeau voor een zoeker', tekst: 'Wie al zoekt, heeft een detector. Geef dan iets erbij: een pinpointer, een goede schep, een vondstentas, een koptelefoon of een boek over munten en vondsten.' }
    ] },
  'metaaldetectie/detectors': {
    tekst: 'Metaaldetectors van Garrett, Minelab, Nokta, XP en Quest: voor land, strand en water.',
    seoTitel: 'Metaaldetector kopen: Garrett, Minelab, Nokta, XP en Quest',
    seoTekst: 'Metaaldetectors van Garrett, Minelab, Nokta Makro, XP en Quest. Voor beginners en gevorderden, voor land, strand en onder water. Met uitleg bij elke detector.',
    gids: [
      { kop: 'Welke detector past bij jou?', tekst: 'Een beginner kiest een detector die licht is en weinig instellingen heeft. Zoek je op het strand of in zout water? Kies dan een detector met meerdere frequenties, die werkt beter in zout. Draadloos en waterdicht is fijn, maar niet nodig om te beginnen.' }
    ] },
  'metaaldetectie/kinderen-beginners': {
    tekst: 'Metaaldetectors voor kinderen en beginners: licht, simpel en betaalbaar.',
    seoTitel: 'Metaaldetector voor kinderen en beginners',
    seoTekst: 'Metaaldetector voor kinderen of beginners? Lichte, eenvoudige detectors van Bresser, Garrett, Minelab en Nokta. Een hobby om samen buiten te doen.',
    gids: [
      { kop: 'Samen op schattenjacht', tekst: 'Een metaaldetector is een geweldig cadeau voor een kind: buiten, spannend, en elke keer anders. Kies een lichte detector die op de lengte van het kind is in te stellen. Voor jonge kinderen is een speelgoeddetector leuk; vanaf een jaar of acht kan een echte beginnersdetector.' }
    ] },
  'metaaldetectie/pinpointers': {
    tekst: 'Pinpointers om een vondst snel te vinden in het gat: Garrett, Minelab, Nokta en meer.',
    seoTitel: 'Pinpointer kopen: Garrett Pro-Pointer, Minelab, Nokta en meer',
    seoTekst: 'Pinpointers voor metaaldetectie: Garrett Pro-Pointer, Minelab Pro-Find, Nokta AccuPoint en meer. Vind je vondst sneller en graaf minder.',
    gids: [
      { kop: 'Waarom een pinpointer?', tekst: 'Een pinpointer is een kleine detector die je in het gat steekt om precies te vinden waar het voorwerp ligt. Je graaft kleiner en vindt sneller. Het is het eerste wat een beginner erbij koopt, en dus een goed cadeau.' }
    ] },
  'metaaldetectie/graven': {
    tekst: 'Scheppen, graafmessen en zandscheppen voor metaaldetectie: stevig en scherp.',
    seoTitel: 'Scheppen en graafmessen voor metaaldetectie',
    seoTekst: 'Scheppen, graafmessen en strandscheppen voor metaaldetectie. Stevig RVS, met gekartelde rand, van Garrett, Nokta, Quest en meer.',
    gids: [
      { kop: 'Een goede schep', tekst: 'Een gewone tuinschep is te zwak voor harde grond. Een detectieschep van RVS met een scherpe of gekartelde rand gaat jaren mee. Een graafmes is handig voor grasland, een zandschep met zeef voor het strand.' }
    ] },
  'metaaldetectie/magneetvissen': {
    tekst: 'Magneetvissen: vismagneten, touw, dreghaken en complete sets voor beginners.',
    seoTitel: 'Magneetvissen: vismagneten en complete sets',
    seoTekst: 'Magneetvissen beginnen? Vismagneten van Magnetar en Bondi Magnets, complete sets met touw en handschoenen, dreghaken en prikstokken. Voor beginners en gevorderden.',
    gids: [
      { kop: 'Beginnen met magneetvissen', tekst: 'Magneetvissen is een leuke hobby voor jong en oud: een sterke magneet aan een touw, en kijken wat er uit het water komt. Een complete set met touw en handschoenen is het makkelijkste begin. Let op de regels: in sommige gemeenten is magneetvissen verboden.' }
    ] },
  'metaaldetectie/accessoires': {
    tekst: 'Tassen, koptelefoons, draagsteunen en zoekschijven voor metaaldetectie.',
    seoTitel: 'Metaaldetectie accessoires: tassen, koptelefoons en zoekschijven',
    seoTekst: 'Accessoires voor metaaldetectie: rugzakken en tassen voor je detector, koptelefoons, draagsteunen, zoekschijven en beschermhoezen van Garrett, Minelab, XP en Nokta.',
    gids: [
      { kop: 'Handig erbij', tekst: 'Een goede koptelefoon laat je zachte signalen horen die je anders mist. Een tas beschermt je detector onderweg. Een draagsteun helpt bij lange zoekdagen. Kijk of het accessoire past bij het merk en type detector.' }
    ] },
  'metaaldetectie/vondsten': {
    tekst: 'Vondsten bewaren en bekijken: vondstentassen, loepen, muntboxen en boeken over munten en metaaldetectie.',
    seoTitel: 'Vondsten bewaren: vondstentassen, loepen, muntboxen en boeken',
    seoTekst: 'Alles om vondsten te bewaren en te bekijken: vondstentassen, loepen, muntboxen, schoonmaakspullen en boeken over munten en metaaldetectie.',
    gids: [
      { kop: 'Je vondsten goed bewaren', tekst: 'Een vondstentas aan je riem houdt je handen vrij. Thuis bekijk je munten met een loep en bewaar je ze in een muntbox. Een boek over munten helpt je om te zien wat je hebt gevonden. Leuke kleine cadeaus voor elke zoeker.' }
    ] },

  /* ---------------- DIEREN ---------------- */
  'dieren': {
    seoTitel: 'Cadeaus voor huisdieren: hond, kat, konijn, cavia en vogels',
    seoTekst: 'Cadeau voor een huisdier of de baas? Speeltjes, snacks, manden en accessoires voor honden, katten, konijnen, cavia\'s en vogels. Van bekende merken.',
    gids: [
      { kop: 'Cadeau voor het huisdier', tekst: 'Een cadeau voor het huisdier is ook een cadeau voor de baas. Speeltjes, een lekkere snack of een mooie mand doen het altijd goed. Let op de grootte van het dier en kies merken die veilig en stevig zijn.' }
    ] },
  'dieren/hond': {
    tekst: 'Cadeaus voor de hond: speeltjes van KONG, snacks, manden, riemen en kerstcadeaus voor de hond.',
    seoTitel: 'Cadeau voor de hond: speeltjes, snacks en accessoires',
    seoTekst: 'Cadeau voor een hond? Speeltjes van KONG en Trixie, snacks, manden, riemen en halsbanden, en leuke kerstcadeaus voor de hond. Voor kleine en grote honden.',
    gids: [
      { kop: 'Cadeau voor de hond', tekst: 'Honden zijn blij met alles wat je ze geeft, maar een stevig speeltje of een kauwsnack gaat het langst mee. Let op de maat: een speeltje voor een kleine hond is voor een grote hond te klein en onveilig. Voor Kerst zijn er speciale pakketten en kersttruien.' }
    ] },
  'dieren/kat': {
    tekst: 'Cadeaus voor de kat: krabpalen, speeltjes, snacks, manden en kerstspeelgoed voor katten.',
    seoTitel: 'Cadeau voor de kat: krabpalen, speeltjes en snacks',
    seoTekst: 'Cadeau voor een kat? Krabpalen en krabmatten, speeltjes, snacks, manden en kerstspeelgoed voor katten. Van Trixie, Beeztees en meer.',
    gids: [
      { kop: 'Cadeau voor de kat', tekst: 'Katten houden van krabben, jagen en verstoppen. Een krabmat, een speeltje aan een hengel of een kattentunnel is dus een goed cadeau. Snacks met kattenkruid zijn bij de meeste katten een succes.' }
    ] },
  'dieren/klein-dier': {
    tekst: 'Cadeaus voor konijnen, cavia\'s, hamsters en andere kleine dieren: speeltjes, knaagspullen, hokjes en snacks.',
    seoTitel: 'Cadeau voor konijn, cavia of hamster: speeltjes en knaagspullen',
    seoTekst: 'Cadeau voor een konijn, cavia of hamster? Knaagspeeltjes, tunnels, hooiruiven, huisjes en snacks voor kleine dieren. Veilig en van natuurlijke materialen.',
    gids: [
      { kop: 'Cadeau voor een klein dier', tekst: 'Konijnen en cavia\'s knagen graag en willen zich kunnen verstoppen. Speeltjes van wilgenhout, een tunnel of een huisje zijn daarom goede cadeaus. Kies natuurlijke materialen zonder verf of plastic.' }
    ] },
  'dieren/vogels': {
    tekst: 'Voor vogels in de tuin en in huis: voederhuisjes, vogelvoer, nestkastjes en speeltjes.',
    seoTitel: 'Cadeau voor vogelliefhebbers: voederhuisjes, nestkastjes en vogelvoer',
    seoTekst: 'Cadeau voor een vogelliefhebber? Voederhuisjes, vogelvoer, vetbollenhouders, nestkastjes en speeltjes voor vogels in de tuin en in huis.',
    gids: [
      { kop: 'Vogels in de tuin', tekst: 'Een voederhuisje of nestkastje is een leuk cadeau voor iemand die graag naar vogels kijkt, zoals opa en oma. In de winter zijn vetbollen en vogelvoer welkom. Hang een voederhuisje op een plek die je vanuit het raam ziet.' }
    ] },

  /* ---------------- BOEKEN & MEDIA ---------------- */
  'boeken-media': {
    seoTitel: 'Boeken en media cadeau: romans, kinderboeken, kookboeken, muziek en agenda\'s',
    seoTekst: 'Boeken en media om cadeau te geven: romans, kinderboeken, kookboeken, muziek op cd en lp, agenda\'s en notitieboeken. Voor lezers, luisteraars en schrijvers.',
    gids: [
      { kop: 'Een boek als cadeau', tekst: 'Een boek is een persoonlijk cadeau: je laat zien dat je weet wat iemand leuk vindt. Twijfel je? Een kookboek, een mooie agenda of een puzzelboek valt bij veel mensen goed. Voor kinderen staat bij elk boek vanaf welke leeftijd het geschikt is.' }
    ] },
  'boeken-media/romans': {
    tekst: 'Romans en spannende boeken om cadeau te geven: bestsellers, feelgood, thrillers en mooie edities.',
    seoTitel: 'Romans cadeau: bestsellers, feelgood en thrillers',
    seoTekst: 'Roman cadeau geven? Bestsellers, feelgood-boeken, thrillers en mooie luxe edities. Voor wie graag leest, voor vakantie of de feestdagen.',
    gids: [
      { kop: 'Een roman kiezen', tekst: 'Kijk wat iemand al leest: spannend, romantisch of literair. Een bestseller is een veilige keuze. Een luxe editie met harde kaft of mooie rand is een cadeau om te bewaren. Lees je samen? Geef dan twee exemplaren.' }
    ] },
  'boeken-media/kinderboeken': {
    tekst: 'Kinderboeken van baby tot tiener: prentenboeken, voorleesboeken, eerste leesboekjes en zoekboeken.',
    seoTitel: 'Kinderboeken cadeau: prentenboeken, voorleesboeken en leesboeken',
    seoTekst: 'Kinderboek cadeau geven? Prentenboeken voor peuters, voorleesboeken, eerste leesboekjes, zoekboeken en boeken voor oudere kinderen. Nijntje, Woezel & Pip, Jip en Janneke en meer.',
    gids: [
      { kop: 'Een boek voor elke leeftijd', tekst: 'Baby\'s en peuters houden van stevige boekjes met grote plaatjes. Kleuters willen voorgelezen worden, graag steeds hetzelfde boek. Vanaf zes jaar lezen kinderen zelf: kies dan boeken met korte zinnen en veel plaatjes. Bij elk boek staat vanaf welke leeftijd het geschikt is.' }
    ] },
  'boeken-media/kookboeken': {
    tekst: 'Kookboeken en bakboeken om cadeau te geven: van bekende koks, voor de airfryer, voor kinderen en voor elke dag.',
    seoTitel: 'Kookboek cadeau: kookboeken en bakboeken voor elke kok',
    seoTekst: 'Kookboek cadeau geven? Kookboeken van bekende koks, airfryer-kookboeken, bakboeken, kinderkookboeken en boeken voor snelle doordeweekse recepten.',
    gids: [
      { kop: 'Een kookboek kiezen', tekst: 'Kies een kookboek dat past bij hoe iemand kookt: snel en simpel door de week, uitgebreid in het weekend, of vooral bakken. Een airfryer-kookboek is leuk voor wie net een airfryer heeft. Voor kinderen zijn er bakboeken met makkelijke recepten.' }
    ] },
  'boeken-media/muziek': {
    tekst: 'Muziek op cd en lp, films en series: cadeaus voor luisteraars en kijkers.',
    seoTitel: 'Muziek en films cadeau: cd\'s, lp\'s en dvd\'s',
    seoTekst: 'Muziek of film cadeau geven? Cd\'s en lp\'s van bekende artiesten, kerstmuziek, films en series op dvd. Voor muziekliefhebbers, opa en oma en filmavonden.',
    gids: [
      { kop: 'Muziek als cadeau', tekst: 'Een lp is een mooi cadeau voor wie een platenspeler heeft: groot, tastbaar en met een mooie hoes. Voor opa en oma is een cd met muziek van vroeger een cadeau waar ze lang naar luisteren. Kerstmuziek maakt december gezellig.' }
    ] },
  'boeken-media/agendas': {
    tekst: 'Agenda\'s, notitieboeken en mooie pennen: voor school, werk en wie graag schrijft.',
    seoTitel: 'Agenda en notitieboek cadeau: agenda\'s, notitieboeken en pennen',
    seoTekst: 'Agenda of notitieboek cadeau geven? Weekagenda\'s, notitieboeken, dagboeken en mooie pennen van Parker, Faber-Castell en Pelikan. Voor school, werk en collega\'s.',
    gids: [
      { kop: 'Cadeau voor wie graag schrijft', tekst: 'Een mooie agenda of notitieboek is een fijn cadeau voor het nieuwe jaar, voor een collega of voor iemand die begint met een nieuwe baan of studie. Een goede pen erbij maakt het compleet.' }
    ] },
  'boeken-media/lezen': {
    tekst: 'Alles voor leesplezier: leeslampjes, boekenleggers, boekensteunen en cadeaus voor boekenwurmen.',
    seoTitel: 'Cadeau voor lezers: leeslampjes, boekenleggers en meer',
    seoTekst: 'Cadeau voor een boekenwurm? Leeslampjes, boekenleggers, boekensteunen, leeskussens en andere cadeaus voor wie graag leest.',
    gids: [
      { kop: 'Cadeau voor een echte lezer', tekst: 'Weet je niet welk boek iemand al heeft? Geef dan iets voor erbij: een leeslampje voor in bed, een mooie boekenlegger, een boekensteun of een leeskussen. Klein, persoonlijk en altijd gebruikt.' }
    ] },

  /* ---------------- CHRISTELIJK ---------------- */
  'christelijk': {
    seoTitel: 'Christelijke cadeaus: Bijbels, sieraden, wanddecoratie en cadeaus met Bijbeltekst',
    seoTekst: 'Christelijk cadeau zoeken? Bijbels (HSV, Statenvertaling, NBV21), sieraden met kruisje, tegeltjes en wandborden met Bijbeltekst, kaarten, kinderbijbels en cadeaus voor doop en belijdenis.',
    gids: [
      { kop: 'Een cadeau met betekenis', tekst: 'Een christelijk cadeau laat zien dat je aan iemand denkt, met een tekst of symbool dat echt iets zegt. Voor een doop of belijdenis is een Bijbel of dagboek een cadeau voor het leven. Voor een verjaardag of als bemoediging is een tegeltje, kaart of sieraad met een Bijbeltekst een mooie keuze.' },
      { kop: 'Welke vertaling?', tekst: 'In veel gereformeerde kerken wordt de Herziene Statenvertaling (HSV) of de Statenvertaling gebruikt. De Bijbel in Gewone Taal en de NBV21 zijn makkelijker te lezen. Weet je niet welke iemand gebruikt? Vraag het even na, of kies een dagboek of een cadeau met een losse tekst.' }
    ] },
  'christelijk/bijbeltekst': { },
  'christelijk/onder-25': { },
  'christelijk/kerst': {
    tekst: 'Christelijke kerstcadeaus en kerstdecoratie: kerststallen, engelen, kaarten en cadeaus met de kerstboodschap.',
    seoTitel: 'Christelijke kerstcadeaus: kerststallen, engelen en cadeaus met betekenis',
    seoTekst: 'Christelijk kerstcadeau zoeken? Kerststallen, engelen, kerstkaarten met Bijbeltekst, kerstboeken en cadeaus die de echte kerstboodschap vertellen.',
    gids: [
      { kop: 'Kerst met betekenis', tekst: 'Met Kerst vieren we de geboorte van Jezus. Een kerststal, een kaart met de kerstboodschap of een boek over het kerstverhaal houden dat in beeld, ook voor kinderen. Mooi om te geven én om zelf in huis te hebben.' }
    ] },
  'christelijk/bijbels': {
    tekst: 'Bijbels in de HSV, Statenvertaling, NBV21 en Bijbel in Gewone Taal: huisbijbels, jongerenbijbels en kinderbijbels.',
    seoTitel: 'Bijbel cadeau: HSV, Statenvertaling, NBV21 en kinderbijbels',
    seoTekst: 'Bijbel cadeau geven? Bijbels in de Herziene Statenvertaling, Statenvertaling, NBV21 en Bijbel in Gewone Taal. Huisbijbels, jongerenbijbels, kinderbijbels en Bijbels met psalmen.',
    gids: [
      { kop: 'Welke Bijbel geef je?', tekst: 'Voor een doop of belijdenis is een mooie Bijbel met harde kaft een cadeau voor het leven. Kies de vertaling die in de kerk van de ontvanger gebruikt wordt. Voor kinderen is een kinderbijbel met plaatjes het mooist; voor jongeren een jongerenbijbel met uitleg.' }
    ] },
  'christelijk/kaarten-posters': {
    tekst: 'Kaarten en posters met een Bijbeltekst: om te sturen, op te hangen of cadeau te doen.',
    seoTitel: 'Christelijke kaarten en posters met Bijbeltekst',
    seoTekst: 'Christelijke kaarten en posters met Bijbeltekst: wenskaarten, kaartensets, bemoedigingskaarten en posters voor aan de muur. Mooi om te sturen of cadeau te geven.',
    gids: [
      { kop: 'Een tekst die blijft', tekst: 'Een kaart met een Bijbeltekst is meer dan een kaart: mensen zetten hem neer en lezen de tekst nog eens. Een set kaarten is handig om in huis te hebben voor verjaardagen, ziekte of bemoediging. Een poster is een cadeau voor de kinderkamer of de studeerkamer.' }
    ] },
  'christelijk/sieraden': {
    tekst: 'Sieraden met een kruisje, visje of Bijbeltekst: kettingen, armbanden en oorbellen in zilver en goud.',
    seoTitel: 'Christelijke sieraden: kettingen en armbanden met kruisje',
    seoTekst: 'Christelijk sieraad cadeau geven? Kettingen met kruisje, armbanden met visje of Bijbeltekst, oorbellen en hangers in zilver, verguld en goud. Voor belijdenis, doop en verjaardag.',
    gids: [
      { kop: 'Een sieraad met betekenis', tekst: 'Een ketting met een kruisje of een armband met een tekst is een cadeau dat iemand elke dag draagt en ziet. Mooi voor een belijdenis, een 18e verjaardag of als aandenken. Kies zilver of goud voor een cadeau dat lang meegaat.' }
    ] },
  'christelijk/wanddecoratie': {
    tekst: 'Wanddecoratie met Bijbeltekst: tegeltjes, wandborden, posters en tekstborden voor in huis.',
    seoTitel: 'Christelijke wanddecoratie: tegeltjes en wandborden met Bijbeltekst',
    seoTekst: 'Wanddecoratie met Bijbeltekst: tegeltjes, houten wandborden, tekstborden en posters. Een tekst om elke dag te zien, voor in de woonkamer, keuken of kinderkamer.',
    gids: [
      { kop: 'Een tekst aan de muur', tekst: 'Een tegeltje of wandbord met een Bijbeltekst is een klassiek christelijk cadeau. Kies een tekst die past bij de gelegenheid: een zegen voor een nieuw huis, een belofte bij ziekte, een dankbare tekst voor de keuken.' }
    ] },
  'christelijk/voor-kinderen': {
    tekst: 'Christelijke cadeaus voor kinderen: kinderbijbels, voorleesboeken, puzzels en spelletjes met Bijbelverhalen. Alles in het Nederlands.',
    seoTitel: 'Christelijke cadeaus voor kinderen: kinderbijbels, boeken en spelletjes',
    seoTekst: 'Christelijk cadeau voor een kind? Kinderbijbels, voorleesboeken met Bijbelverhalen, puzzels, spelletjes en knuffels. Allemaal in het Nederlands, voor doop, verjaardag en Kerst.',
    gids: [
      { kop: 'Bijbelverhalen voor kinderen', tekst: 'Een kinderbijbel is vaak het eerste christelijke cadeau, bij de doop of de eerste verjaardag. Voor peuters zijn er stevige boekjes met Bijbelverhalen, voor oudere kinderen puzzels en spelletjes over de Bijbel. Alles hier is in het Nederlands.' }
    ] },
  'christelijk/boeken-muziek': {
    tekst: 'Christelijke boeken en muziek: dagboeken, psalmboekjes, bemoedigende boeken en cd\'s met psalmen en opwekking.',
    seoTitel: 'Christelijke boeken en muziek: dagboeken, psalmen en cd\'s',
    seoTekst: 'Christelijke boeken en muziek cadeau geven? Dagboeken, psalmboekjes, boeken over geloof en bemoediging, en cd\'s met psalmen, gezangen en opwekkingsliederen.',
    gids: [
      { kop: 'Elke dag een moment', tekst: 'Een dagboek met voor elke dag een Bijbeltekst en korte overdenking is een cadeau voor het hele jaar. Mooi voor een belijdenis, een verjaardag of als bemoediging. Een cd met psalmen is een fijn cadeau voor ouderen.' }
    ] },
  'christelijk/kerststal-engelen': {
    tekst: 'Kerststallen en engelen: houten kerststallen, kerstgroepen en engelen voor in huis.',
    seoTitel: 'Kerststallen en engelen: kerstgroepen en engelen voor in huis',
    seoTekst: 'Kerststal kopen of cadeau geven? Houten kerststallen, kerstgroepen met figuren en engelen voor in huis. Voor een Kerst met betekenis.',
    gids: [
      { kop: 'Een kerststal in huis', tekst: 'Een kerststal laat elk jaar weer het kerstverhaal zien, ook aan kinderen. Een houten stal met losse figuren is mooi om samen op te bouwen. Een engel is een klein cadeau dat het hele jaar mag blijven staan.' }
    ] },
  'christelijk/doop-belijdenis': {
    seoTitel: 'Cadeau voor doop en belijdenis: Bijbels, dagboeken en aandenkens',
    seoTekst: 'Cadeau voor een doop of belijdenis? Kinderbijbels, eerste Bijbels (HSV en Statenvertaling), Bijbels met psalmen, dagboeken, psalmboekjes en mooie aandenkens aan deze dag.',
    gids: [
      { kop: 'Cadeau voor een doop', tekst: 'Bij een doop geef je vaak iets voor later: een kinderbijbel, een doopkaars of een aandenken met de naam en datum. Ouders bewaren dat jaren. Een boekje met gebeden of een mooie kaart erbij maakt het compleet.' },
      { kop: 'Cadeau voor een belijdenis', tekst: 'Bij belijdenis is een eigen Bijbel het klassieke cadeau, in de vertaling van de kerk. Ook een dagboek, een psalmboekje of een sieraad met kruisje zijn mooie keuzes. Geef je samen met familie? Dan kun je een luxe Bijbel met naam kiezen.' }
    ] }
};
