/* Nieuwe indeling (afgesproken met Marius op 30-10-2026, vakje voor vakje op zoekvolume).
   Dit script verdeelt elk product over de nieuwe vakjes, op basis van de titel en het oude vakje.
   producten.js zelf blijft ongewijzigd: de rondes en de Productstudio mogen de oude vakjes blijven gebruiken.
   splits-producten.js roept deel() aan voor elk product dat in producten-lean.js komt.
   Een product kan 'vast' staan: zet dan "subVast": true in producten.js, dan blijft cat/sub zoals het staat. */

/* Per productgroep: de vakjes in volgorde van belangrijkheid bij het kiezen (niet de volgorde op de site).
   Elk vakje: [slug, regex op de titel]. Eerste match wint. Geen match: 'oud' bepaalt het vakje. */
const R = (s) => new RegExp(s, 'i');

const GROEPEN = {
  sieraden: {
    regels: [
      ['smartwatches', R('smart ?watch|activity ?tracker|fitness ?tracker|sporthorloge|hartslagmeter')],
      ['horloges', R('horloge|chronograaf|\\bwatch\\b')],
      ['sieradendozen', R('sieradendoos|sieradenkist|juwelendoos|juwelenkist|sieradenstandaard|sieraden ?(box|organizer|houder|bakje|rek)|ringdoos|sieradenetui|sieradenboom|oorbellenhouder|horlogedoos|horlogebox')],
      ['bedels', R('bedel|\\bcharms?\\b|pandora')],
      ['met-naam', R('met (je |jouw |eigen )?naam|naamketting|naam ?armband|gegraveerd|graveer|gravure|initia(a)?l|letterketting|letter ?hanger|gepersonaliseerd')],
      ['oorbellen', R('oorbel|oorknop|creol|oorhanger|ear ?cuff|oorringen|\\bstuds?\\b')],
      ['ringen', R('\\bring(en|etje|set)?\\b|zegelring|aanschuifring')],
      ['armbanden', R('armband|enkelband|bangle|slavenarmband|tennisarmband')],
      ['kettingen', R('ketting|hanger|collier|choker|medaillon')]
    ],
    oud: { kettingen: 'kettingen', oorbellen: 'oorbellen', ringen: 'ringen', armbanden: 'armbanden', heren: 'armbanden', 'echt-goud': 'echt-goud', zilver: 'zilver', viking: 'kettingen', 'verguld-staal': 'kettingen' },
    /* Materiaal: komt er als extra vakje bij (een gouden ring staat in Ringen én Echt goud). */
    extra: [
      ['echt-goud', R('(9|10|14|18) ?(k|kt|karaat)\\b|\\b585\\b|\\b750\\b|echt goud|geelgoud|witgoud|ros[eé]goud|massief goud'), R('verguld|plated|gold ?plated|doubl[eé]|staal')],
      ['zilver', R('zilver|\\b925\\b|sterling'), R('verzilverd|zilverkleur|silver ?plated|zilver(kleurig|look)')],
      ['parels', R('parel|pearl')]
    ]
  },
  'geuren-verzorging': {
    regels: [
      ['rituals', R('rituals')],
      ['tandenborstels', R('tandenborstel|oral-?b|sonicare|waterflosser|monddouche')],
      ['haarstylers', R('stijltang|krultang|f[oö]hn|haardroger|airwrap|airstyler|haarstyler|krulborstel|hot ?air|haar ?(krul|stijl)|warmteborstel|dyson')],
      ['scheren-baard', R('scheer|baard|trimmer|shaver|beard|ontharing|epilator|ladyshave|tondeuse')],
      ['massage', R('massage|massager|nekkussen|shiatsu|gua sha|jade ?roller|voetbad')],
      ['make-up-nagels', R('make-?up|mascara|lipstick|lippenstift|lipgloss|nagel|oogschaduw|foundation|kwasten|blush|palette|gellak|manicure|pedicure')],
      ['cadeausets', R('cadeauset|giftset|gift ?set|geschenkset|verwenpakket|verwenset|cadeaubox|gift ?box|cadeaupakket|adventskalender')],
      ['parfum', R('parfum|eau de|\\bedt\\b|\\bedp\\b|aftershave|cologne|bodymist|body ?mist|fragrance|\\bgeur\\b')],
      ['bad-douche', R('\\bbad\\b|badzout|badbruis|bruisbal|douche|shower|bath|scrub|zeep|badolie|badschuim')],
      ['huidverzorging', R('cr[eè]me|serum|gezicht|huid|masker|lotion|handcr|lippenbalsem|skincare|dagcr|nachtcr|oog')]
    ],
    oud: { geuren: 'parfum', verzorging: 'huidverzorging' }
  },
  'mode-beauty': {
    regels: [
      ['pantoffels-sokken', R('pantoffel|slof|sloffen|sokken|\\bsok\\b|slipper|huissok')],
      ['pyjamas', R('pyjama|badjas|onesie|ochtendjas|nachthemd|loungewear|kamerjas|nachtjapon|huispak')],
      ['schoenen', R('(?<!hand)schoen|sneaker|\\bboots?\\b|laars|laarzen|sandaal|sandalen|pump|loafer|klomp|instapper')],
      ['truien-hoodies', R('trui|hoodie|sweater|\\bvest\\b|cardigan|fleece|coltrui|sweatshirt|shirt|jas\\b|jack\\b|bodywarmer')],
      ['koffers', R('koffer|trolley|reistas|weekendtas|duffel|handbagage|weekender')],
      ['toilettassen', R('toilettas|make-?up ?tas|beautycase|toiletry|cosmeticatas')],
      ['rugzakken', R('rugzak|backpack|rugtas|schooltas')],
      ['portemonnees', R('portemonnee|portefeuille|pasjeshouder|kaarthouder|wallet|cardprotector|card ?holder|pashouder|cardholder|creditcardhouder')],
      ['zonnebrillen', R('zonnebril|brillenkoker|\\bbril\\b')],
      ['mutsen-sjaals', R('muts|sjaal|handschoen|\\bwanten\\b|beanie|oorwarmer|\\bcol\\b|omslagdoek|bivakmuts')],
      ['riemen-sleutelhangers', R('riem|sleutelhanger|paraplu|bretels|stropdas|manchetknop|keycord|keychain|haarclip|haarspeld|scrunchie|pet\\b|cap\\b|hoed')],
      ['tassen', R('\\btas\\b|tassen|handtas|schoudertas|shopper|crossbody|clutch|heuptas|\\bbag\\b|tasje|laptoptas|bucket')]
    ],
    oud: { tassen: 'tassen', 'rugzakken-reistassen': 'rugzakken', schoenen: 'schoenen', kleding: 'truien-hoodies', accessoires: 'riemen-sleutelhangers' }
  },
  elektronica: {
    regels: [
      ['platenspelers', R('platenspeler|turntable|grammofoon|pick-?up')],
      ['beamers', R('beamer|projector')],
      ['drones-vr', R('drone|vr[- ]?bril|meta quest|virtual reality|oculus')],
      ['tablets-ereaders', R('tablet|ipad|e-?reader|kobo|kindle|galaxy tab')],
      ['gaming', R('gaming|\\bgame|playstation|\\bps[45]\\b|xbox|nintendo|switch|controller|console|joystick|stuurwiel|racestuur')],
      ['cameras', R('camera|polaroid|instax|fototoestel|gopro|actioncam|dashcam|fotoprinter|kodak|lens')],
      ['koptelefoons', R('koptelefoon|headphone|oordop|earbud|airpods|headset|in-ear|oortjes|hoofdtelefoon|over-ear')],
      ['speakers', R('speaker|luidspreker|soundbar|\\bjbl\\b|radio|boombox|karaoke|marshall|sonos|bose')],
      ['telefoon-opladen', R('telefoon|oplader|powerbank|kabel|smartphone|iphone|samsung galaxy|hoesje|draadloos laden|magsafe|laadstation|laadpad|selfie')],
      ['sfeerlicht-smarthome', R('\\bled\\b|lamp|licht|smart ?home|slimme ?(stekker|lamp)|\\bhue\\b|wifi|alexa|google (home|nest)|\\bnest\\b|wekker|sunrise|lichtwekker|galaxy ?projector|sterrenhemel')],
      ['gadgets-trackers', R('tracker|airtag|\\btile\\b|gadget|smartwatch')]
    ],
    oud: { audio: 'speakers', 'slimme-gadgets': 'gadgets-trackers', telefoon: 'telefoon-opladen', gaming: 'gaming', 'foto-video': 'cameras' }
  },
  wonen: {
    regels: [
      ['kerst', R('kerst|christmas|xmas|sneeuwpop|rendier|piek\\b|nutcracker|notenkraker|adventskrans')],
      ['huisgeuren', R('geurstok|diffuser|huisparfum|roomspray|wax ?melt|geurzakje|geurolie|aroma|interieurparfum|geurverspreider')],
      ['kaarsen', R('kaars|kandelaar|waxine|theelicht|windlicht|lantaarn')],
      ['deurmatten', R('deurmat|droogloopmat')],
      ['vloerkleden', R('vloerkleed|karpet|tapijt|\\bkleed\\b|loper')],
      ['spiegels', R('spiegel')],
      ['klokken', R('\\bklok|wandklok|wekker|stationsklok|koekoek')],
      ['fotolijsten', R('fotolijst|fotoframe|fotokader|fotobord|fotolijn|fotoalbum')],
      ['lampen', R('lamp|verlichting|licht|\\bled\\b|lichtsnoer|nachtlamp|lichtbak|neon')],
      ['kussens-plaids', R('kussen|plaid|deken|sprei|fleecedeken|poef|zitzak|knuffeldeken')],
      ['vazen-bloemen', R('vaas|vazen|bloem|droogbloem|kunstbloem|kunstplant|bloempot|plantenpot|boeket|pampas|tulp|roos|rozen')],
      ['wanddecoratie', R('poster|schilderij|canvas|wanddecoratie|wandbord|muurdecoratie|\\bprint\\b|tekstbord|wandkleed|wanddeco|muursticker|wandpaneel|lijst|kunstwerk')],
      ['opbergen-dienbladen', R('dienblad|opberg|\\bmand|\\bdoos|\\bbak\\b|\\bkist|organizer|bewaar|krukje|rek\\b|plankje|kapstok|haak')]
    ],
    houd: ['kerstdecoratie'],
    oud: { 'kaarsen-geur': 'kaarsen', huisgeuren: 'huisgeuren', woonaccessoires: 'wanddecoratie', verlichting: 'lampen', 'plaids-kussens': 'kussens-plaids', kerstdecoratie: 'kerst' }
  },
  keuken: {
    regels: [
      ['airfryers', R('airfryer|air fryer|heteluchtfriteuse')],
      ['gezellig-tafelen', R('gourmet|fondue|raclette|steengrill|teppanyaki|tafelgrill|pizza ?oven|wokset|pizzaset|tapas')],
      ['tosti-wafel-ijs', R('tosti|wafel|ijsmachine|ijsmaker|\\bijs\\b|popcorn|suikerspin|chocoladefontein|sandwich ?maker|cr[eê]pe|pannenkoek|poffertje|donut|cakepop|slush|softijs|frozen yogurt')],
      ['keukenapparaten', R('blender|keukenmachine|foodprocessor|staafmixer|waterkoker|broodrooster|sapcentrifuge|slowjuicer|slowcooker|multicooker|sous ?vide|vacu[uü]m|stoomoven|kitchenaid|thermomix|rijstkoker|weegschaal|\\bmixer|hakmolen|frituurpan|vleesthermometer|soepmaker|eierkoker|smoothie')],
      ['koffie-thee', R('koffie|espresso|\\bthee|melkopschuimer|french press|moka|cafeti[eè]re|\\bmok\\b|mokken|kop en schotel|barista|nespresso|senseo|dolce gusto|latte|cappuccino|theeglas|theepot|theedoos')],
      ['messen-snijplanken', R('\\bmes\\b|messen|messenset|snijplank|messenblok|slijp|santoku|koksmes|vleesmes')],
      ['kaas-serveerplanken', R('kaasplank|serveerplank|tapasplank|borrelplank|kaasmes|kaasset|kaasschaaf|serveerbord|houten plank|charcuterie')],
      ['pannen', R('\\bpan\\b|pannen|koekenpan|braadpan|\\bwok\\b|hapjespan|steelpan|dutch oven|gietijzer|pannenset|snelkookpan|grillpan|ovenschaal')],
      ['drinkflessen-lunch', R('drinkfles|thermos|lunchbox|broodtrommel|isoleerfles|bidon|waterfles|lunch|bento|isoleerbeker|koffiebeker|to ?go|reisbeker|drinkbeker')],
      ['voorraadpotten', R('voorraad|weckpot|vershoud|bewaarpot|kruidenrek|kruidenpot|bewaarbak|opbergpot|voorraadbus|broodtrommel')],
      ['bakken', R('bakken|bakvorm|taart|cake|deeg|muffin|cupcake|koekjes|uitsteker|garde|spuitzak|bakset|bakpapier|bakmat|ovenwant|deegroller|springvorm')],
      ['glazen-servies', R('\\bglas|glazen|servies|\\bbord|borden|schaal|\\bkom\\b|kommen|bestek|karaf|\\bkop\\b|schotel|tafel|placemat|onderzetter|kandelaar|ontbijt|eierdop|presenteer|etagere')]
    ],
    oud: { koken: 'pannen', keukenapparaten: 'keukenapparaten', bakken: 'bakken', serveren: 'glazen-servies', 'koffie-thee': 'koffie-thee', opbergen: 'voorraadpotten' }
  },
  dranken: {
    regels: [
      ['wijnaccessoires', R('kurkentrekker|wijnrek|wijnkoeler|decanter|wijnglas|wijnglazen|wijnset|wijnkist|wijnstopper|wijnaccessoire|ijsemmer|flessenopener|whiskyglas|whiskeyglas|whisky stones|whiskystenen|bierglas|bierglazen|cocktailset|shaker|cocktailglas')],
      ['alcoholvrij', R('alcoholvrij|alcohol-?vrij|0[,.]0|non-?alcoholic|\\b0%')],
      ['jenever', R('jenever|genever|korenwijn|beerenburg|berenburg')],
      ['sake', R('\\bsake\\b|sak[eé]\\b')],
      ['bier', R('\\bbier(en|tje|tjes|pakket|brouw\\w*|krat|glas|glazen)?\\b|bierbrouw|\\bbeer\\b|\\bipa\\b|tripel|brouwerij|bierpakket|biertje|speciaalbier|\\bstout\\b')],
      ['wijn-port', R('\\bport\\b|porto|sherry')]
    ],
    houd: ['whisky', 'cognac-brandy', 'rum', 'gin', 'wodka', 'tequila', 'likeur', 'bubbels'],
    oud: { whisky: 'whisky', 'cognac-brandy': 'cognac', rum: 'rum', gin: 'gin-cocktails', wodka: 'wodka', tequila: 'tequila', likeur: 'likeuren', wijn: 'wijn-port', bubbels: 'champagne-bubbels', alcoholvrij: 'alcoholvrij', wijnaccessoires: 'wijnaccessoires' }
  },
  'eten-drinken': {
    regels: [
      ['adventskalenders', R('advent')],
      ['sinterklaas-lekkers', R('sinterklaas|chocoladeletter|pepernoot|pepernoten|kruidnoot|kruidnoten|speculaas|marsepein|schuimpje|taai ?taai|banketstaaf|banketletter|\\bsint\\b|\\bpiet\\b')],
      ['brievenbuscadeaus', R('brievenbus')],
      ['kerst-cadeaupakketten', R('pakket|kerstpakket|borrel|cadeaubox|giftbox|\\bbox\\b|\\bmand\\b|kerstmand|proeverij|tasting')],
      ['koekjes-stroopwafels', R('koek|stroopwafel|biscuit|cookie|speculoos|kano|spritsen|wafel')],
      ['drop-snoep', R('\\bdrop\\b|dropjes|snoep|lolly|zuurtje|gummy|winegum|spekjes|candy|\\bm&m|haribo|kauwgom')],
      ['chocolade', R('chocola|bonbon|pralin|truffel|tony|callebaut|leonidas|neuhaus|cacao|godiva|lindt|droste')],
      ['koffie-thee', R('koffie|\\bthee|espresso|bonen|cups|capsules|matcha|chai')],
      ['bbq-sauzen', R('bbq|barbecue|saus|\\brub\\b|rubs|kruiden|marinade|hot ?sauce|pepers|chili|sriracha|grill')]
    ],
    oud: { 'chocolade-snoep': 'chocolade', 'drop-snoep': 'drop-snoep', bbq: 'bbq-sauzen', pakketten: 'kerst-cadeaupakketten', 'koffie-thee': 'koffie-thee', lekkernijen: 'delicatessen', adventskalenders: 'adventskalenders' }
  },
  speelgoed: {
    regels: [
      ['pokemon-verzamelkaarten', R('pok[eé]mon|verzamelkaart|booster|trading ?card|yu-?gi|magic the gathering|one piece card|lorcana')],
      ['playmobil', R('playmobil')],
      ['lego', R('\\blego\\b|\\bduplo\\b')],
      ['knikkerbanen-magnetisch', R('knikkerbaan|gravitrax|magna-?tiles|magformers|magnetisch|connetix|geomag|magneetbouw|marble ?run')],
      ['knutselen-kleuren', R('knutsel|\\bses\\b|science4you|crayola|kraskaart|punnik|zelf .{0,20}(bouwen|maken)|strijkkralen|slijm|slime')],
      ['puzzels', R('puzzel|puzzle|wasgij|legpuzzel')],
      ['poppen-barbie', R('modepop|monster high|mirror mi|rainbow high|(?<!funko )\\bpop\\b(?![- ]?up)|poppen|barbie|babypop|baby ?born|poppenhuis|l\\.?o\\.?l\\.? surprise|rainbow high|polly|sylvanian|bratz|\\bken\\b|poppenwagen')],
      ['speelkeukens-verkleden', R('beauty|make-?up|tattoo|nagellak|kaphoofd|kassa|koffiezet|gereedschapskist|dierenarts|ijssalon|ijscokar|pizza speelset|winkeltje|speelkeuken|keukentje|verkleed|kostuum|prinsessenjurk|speelgoedkassa|winkeltje|doktersset|dokterskoffer|speelgoedgereedschap|werkbank|kinderkeuken|verkleedkleding|\\bmasker|kattenoren|haarband')],
      ['autos-treinen-rc', R('\\bauto(s|tje|baan|garage)?\\b|trein|\\brc\\b|bestuurbare|garage|hot ?wheels|racebaan|vrachtwagen|brandweer|tractor|vliegtuig|helikopter|bouwvoertuig|matchbox|\\bbrio\\b|graafmachine|politie|monstertruck|carrera|race')],
      ['knuffels-squishmallows', R('knuffel|squishmallow|pluche|teddy|\\bbeer\\b|jellycat|warmteknuffel')],
      ['puzzels', R('puzzel|wasgij|legpuzzel')],
      ['bord-kaartspellen', R('\\bspel\\b|spellen|bordspel|kaartspel|dobbel|quiz|kwartet|\\buno\\b|monopoly|party|escape|catan|rummikub|ganzenbord|schaak|dammen|stratego|kaarten|weerwolven|jenga|twister|cluedo|game\\b|30 seconds|triviant|codenames|exploding|ligretto|dixit|keezen|mens erger|\\bexit\\b|sjoel|yahtzee|kendama')],
      ['muziek-karaoke', R('karaoke|microfoon|keyboard|gitaar|drumstel|kidi ?dj|\\bdrums?\\b|muziekinstrument|xylofoon|\\bpiano')],
      ['buitenspeelgoed', R('buiten|\\bstep\\b|skelter|trampoline|zwembad|waterpistool|\\bbal\\b|voetbal|zandbak|schommel|glijbaan|stoep|bellenblaas|vlieger|loopfiets|skateboard|zeepbel|kinderfiets|nerf|frisbee|metaaldetector|zandspeelgoed|waterspeelgoed|speelhuis|\\btent\\b|verrekijker|insect|vlindernet|stelten|springtouw|klimrek')],
      ['knutselen-kleuren', R('knutsel|\\bklei\\b|kleur|teken|verf|stift|kralen|strijkkralen|slijm|slime|diamond|sticker|creatief|kleurboek|krijt|bouwpakket hout|naaien|borduren|weven|sieraden maken|armbandjes|kristallen kweken|experiment|proefjes|wetenschap')],
      ['baby-houten', R('\\bbaby|peuter|mijn eerste|rammelaar|stapeltoren|stapelbeker|sorteer|trekfiguur|activity|bijtring|loopwagen|badspeelgoed|\\b(0|1)\\+|vanaf (6|9|12|18) maanden|fisher|vtech baby|speelkleed|box ?mobiel|loopauto')],
      ['hypes-trends', R('funko|little live pets|furreal|funtasy|hex ?bots|robot|peekimo|kidisecrets|kidizoom|kindercamera|camera|wereldbol|globe|orboot|laptop|tiptoi|ik leer|electro|fidget|squishy|labubu|stitch|tamagotchi|bitzee|hype|trend|pop ?it|sensory|hatchimal|gabby|furby|bluey|stranger|minecraft|fortnite|roblox|squid|wednesday|harry potter|disney|marvel|frozen|paw patrol|unicorn|eenhoorn')]
    ],
    oud: { 'baby-peuter': 'baby-houten', bouwen: 'lego', 'figuren-voertuigen': 'hypes-trends', bordspellen: 'bord-kaartspellen', kaartspellen: 'bord-kaartspellen', puzzels: 'puzzels', buitenspeelgoed: 'buitenspeelgoed', knutselen: 'knutselen-kleuren' }
  },
  hobby: {
    regels: [
      ['diamond-painting', R('diamond ?paint|diamant ?schilder')],
      ['3d-pennen', R('3d[- ]?pen')],
      ['kaarsen-zeep-epoxy', R('kaarsen maken|kaars maken|zeep maken|\\bzeep|epoxy|resin|gietvorm|gieten|soja ?was|kaarsenwas')],
      ['klei-pottenbakken', R('\\bklei\\b|pottenbak|keramiek|boetseer|fimo|draaischijf|polymeerklei|airdry')],
      ['naaien-borduren', R('naai|borduur|punch ?needle|patchwork|quilt|lockmachine|kruissteek|stoffen|naaimachine')],
      ['kralen-sieraden-maken', R('kralen|sieraden maken|armbandjes maken|kettingen maken|bedels maken|rocailles')],
      ['modelbouw', R('modelbouw|robotime|rolife|miniatuur|bouwpakket|book ?nook|schip|scale|\\b1:\\d+|houten (model|3d)|mini ?huis|diy (huis|house)|maquette')],
      ['bullet-journal', R('bullet ?journal|kalligraf|handletter|brush ?pen|journal|lettering')],
      ['origami-scrapbooking', R('origami|scrapbook|papier|vouw|stempel|washi|kaarten maken|plakboek|ponser')],
      ['haken-breien', R('haak|haken|brei|garen|\\bwol\\b|amigurumi|macram[eé]|haakpakket|breipakket|tufting|weef')],
      ['schilderen', R('schilder|\\bverf|acryl|aquarel|penseel|canvas|ezel|paint ?by ?number|op nummer|gouache|olieverf|paletmes')],
      ['tekenen', R('teken|stift|potlood|marker|schetsboek|schets|kleurpotlood|posca|copic|\\bpen\\b|pennen|kleurboek|fineliner|houtskool|pastel')]
    ],
    oud: { 'tekenen-schilderen': 'tekenen', 'haken-breien': 'haken-breien', knutselen: 'origami-scrapbooking', modelbouw: 'modelbouw' }
  },
  'sport-outdoor': {
    regels: [
      ['darts', R('dart')],
      ['golf', R('golf')],
      ['padel-tennis', R('padel|tennis|tafeltennis|pingpong|badminton|squash')],
      ['vissen', R('\\bvis(sen|hengel|lijn|kist|tas|haak|stoel)|hengel|karper|\\baas\\b|werphengel|sportvis')],
      ['klimmen-boulderen', R('klim|boulder|crashpad|chalk|pofzak')],
      ['yoga', R('yoga|pilates|meditatie|balansbal')],
      ['skateboards-steps', R('skateboard|\\bstep\\b(?!.*aerobic)|steps|longboard|skate|rolschaats|inline|waveboard|penny ?board')],
      ['wintersport-schaatsen', R('schaats|\\bski|snowboard|\\bslee\\b|wintersport|skibril|skihelm|thermo ?ondergoed')],
      ['watersport-zwemmen', R('\\bsup\\b|supboard|kajak|zwem|snorkel|duik|surf|wetsuit|waterski|kano|opblaasbare boot|waterschoen')],
      ['fietsen', R('fiets|\\bbike|\\bmtb\\b|wielren|bidonhouder|kettingslot')],
      ['voetbal-balsporten', R('voetbal|hockey|basketbal|volleybal|\\bbal\\b|\\bdoel\\b|scheenbesch|keepers|rugby|honkbal|korfbal|handbal')],
      ['buitenspellen-picknick', R('jeu de boules|petanque|kubb|picknick|m[oö]lkky|cornhole|frisbee|beachball|spikeball|beach ?ball|werpspel|krokett')],
      ['hardlopen', R('hardloop|running|stappenteller|hartslag|loopvest|hardlopen|reflecterend')],
      ['fitness', R('fitness|dumbbell|halter|kettlebell|weerstand|\\bband(en)?\\b|springtouw|bokszak|boks|massage ?gun|hometrainer|loopband|roeitrainer|buikspier|ab ?roller|push ?up|sportmat|\\bgewicht(en)?\\b|crosstrainer|pull ?up|optrekstang|foam ?roller|stepper')],
      ['kamperen', R('kampeer|tent\\b|slaapzak|camping|zaklamp|hoofdlamp|gasbrander|hangmat|survival|kookset|matje|luchtbed|campingstoel|vuurstarter|bushcraft|bivak|lantaarn|outdoor ?kook|firesteel|campingkook')],
      ['wandelen', R('wandel|rugzak|verrekijker|drinkfles|thermosfles|nordic|kompas|regenjas|regenponcho|trekking|hiking')],
      ['reizen', R('reis|koffer|bagage|nekkussen|paspoort|adapter|travel|vakantie')]
    ],
    oud: { fitness: 'fitness', wandelen: 'wandelen', fietsen: 'fietsen', kamperen: 'kamperen', reizen: 'reizen', darts: 'darts', golf: 'golf' }
  },
  'tuin-klussen': {
    regels: [
      ['zwembaden-jacuzzis', R('zwembad|jacuzzi|hot ?tub|\\bspa\\b|lay-?z')],
      ['vuurschalen-terrasverwarmers', R('vuurschaal|vuurkorf|terrasverwarmer|vuurtafel|tuinhaard|vuurplaat|vuurpot')],
      ['bbq-buitenkoken', R('\\bbbq|barbecue|kamado|pizzaoven|pizza ?oven|buitenkeuken|\\bgrill|plancha|rookoven|houtskool|aansteek|weber|smoker|dutch oven')],
      ['tuinmeubelen', R('parasol|tuinstoel|tuinbank|loungeset|hangstoel|schommel|tuinkussen|tuintafel|ligbed|hangmat|tuinset|loungestoel|strandstoel')],
      ['tuinmachines', R('hogedrukreiniger|grasmaaier|robotmaaier|bladblazer|heggenschaar|kettingzaag|grastrimmer|kantenmaaier|verticuteer|bladzuiger|onkruidbrander|kärcher|karcher')],
      ['elektrisch-gereedschap', R('\\baccu|boormachine|schroefmachine|zaag|schuurmachine|makita|dewalt|\\bbosch\\b|einhell|ryobi|black ?\\+? ?decker|lijmpistool|soldeer|dremel|frees|klopboor|slagmoersleutel|multitool oscillerend|compressor|stofzuiger|bouwlamp|werklamp')],
      ['vogels-insecten', R('vogel|insect|nestkast|voeder|vlinder|bijen|egel|mezen|pindakaas|vetbol')],
      ['moestuin-kweken', R('moestuin|kweek|\\bkas\\b|broeikas|\\bzaad|zaden|bloembol|kiem|groente|kruidentuin|tomaat|tomaten|zaai|aardbei|tulpenbollen')],
      ['regentonnen-slangen-compost', R('regenton|tuinslang|gieter|compost|regenmeter|sproei|slangwagen|waterpomp\\b|irrigatie')],
      ['buitenverlichting', R('verlichting|solar|\\blamp|lantaarn|lichtsnoer|\\bled\\b|\\bspot|tuinlamp|lichtslinger')],
      ['tuindecoratie', R('kabouter|tuinbeeld|beeld\\b|thermometer|tuindecoratie|windgong|tuinsteker|zonnewijzer|tuinspiegel|windspinner|vogelbad')],
      ['tuingereedschap', R('schep|snoeischaar|snoeizaag|\\bhark|kruiwagen|tuinhandschoen|schoffel|spade|tuingereedschap|plantenschep|onkruid|tuinset|bladhark|tuinschort|knielkussen')],
      ['planten-potten', R('plant|\\bpot\\b|potten|bloempot|plantenbak|bonsai|cactus|vetplant|terrarium|orchidee|hangpot|bloembak|plantenstandaard')],
      ['handgereedschap-werkplaats', R('gereedschap|waterpas|schroevendraaier|hamer|\\btang|\\bbit|dopsleutel|steeksleutel|werkbank|gereedschapskist|multitool|rolmaat|zakmes|ratel|inbus|lasermeter|meetlint|werkhandschoen|hoofdlamp|zaklamp')]
    ],
    oud: { tuingereedschap: 'tuingereedschap', 'planten-zaden': 'planten-potten', gereedschap: 'handgereedschap-werkplaats', buitenverlichting: 'buitenverlichting' }
  },
  'boeken-media': {
    regels: [
      ['kookboeken', R('kookboek|recept|bakboek|\\bkoken\\b|keuken van')],
      ['kleurboeken', R('kleurboek|coloring|kleurplaten')],
      ['puzzelboeken', R('sudoku|kruiswoord|puzzelboek|breinbreker|denksport|woordzoeker|puzzels? ?voor|doolhof')],
      ['e-readers', R('e-?reader|\\bkobo\\b|kindle')],
      ['luisterboeken', R('luisterboek|audioboek|audiobook')],
      ['foto-invulboeken', R('invulboek|vertel eens|fotoboek|fotoalbum|plakboek|herinneringen|babyboek|vriendenboek|vertel ?me|mijn leven|levensboek')],
      ['boekenbonnen-abonnementen', R('boekenbon|cadeaukaart|abonnement|tijdschrift|cadeaubon')],
      ['agendas-planners-kalenders', R('agenda|planner|notitieboek|notebook|dagboek|kalender|journal|scheurkalender|schrift|bullet')],
      ['muziek', R('vinyl|\\blp\\b|\\bcd\\b|elpee|album|muziek|songbook|bladmuziek')],
      ['films-series', R('\\bdvd|blu-?ray|\\bfilm|\\bserie\\b')],
      ['strips-manga', R('strip|manga|graphic novel|suske|kuifje|asterix|donald duck|lucky luke|guust|jommeke|kiekeboe|garfield|dragon ball|naruto|one piece')],
      ['leesplezier', R('leeslamp|boekensteun|boekenlegger|leeskussen|boekenstandaard|boekenkast|book ?nook|leesbril|boekenhouder|leesstandaard|leesbord')],
      ['kinderboeken', R('prentenboek|voorlees|kinderboek|nijntje|dikkie|gruffalo|geronimo|harry potter|kleuter|peuter|\\bavi\\b|groep [345]|leren lezen|sprookje|dagboek van een muts|dagboek van een loser|tom poes|pluk|jip en janneke|kikker|rupsje|voelboek|kartonboek|geluidenboek|zoekboek|stickerboek|doeboek|weetboek')]
    ],
    oud: { romans: 'thrillers-romans', kinderboeken: 'kinderboeken', kookboeken: 'kookboeken', muziek: 'muziek', agendas: 'agendas-planners-kalenders', lezen: 'leesplezier' }
  },
  dieren: {
    regels: [
      ['paard', R('paard|pony|\\bruiter')],
      ['vissen-aquarium', R('aquarium|vissenkom|vijver|\\bvis(sen)?\\b')],
      ['reptielen-terrarium', R('terrarium|reptiel|schildpad|gekko|slang\\b|hagedis')],
      ['kippen', R('\\bkip\\b|kippen|hoender')],
      ['konijn-cavia-hamster', R('konijn|cavia|hamster|knaagdier|chinchilla|degoe')]
    ],
    houd: ['hond', 'kat'],
    oud: { hond: 'hond', kat: 'kat', 'klein-dier': 'konijn-cavia-hamster', vogels: 'vogels' }
  },
  metaaldetectie: {
    regels: [
      ['magneetvissen', R('magneet|vismagneet|neodymium')],
      ['munten-vondsten', R('munt|loep|vondst|album|\\bboek|vitrine|verzamel|archeolog|reinig|vergrootglas|determin')],
      ['pinpointers-uitrusting', R('pinpointer|pro ?pointer|schep|spade|lesche|koptelefoon|headphone|tas\\b|vondsttas|knie|spoel|cover|zoekspoel|draagsysteem|riem|handschoen|graaf|troffel|accu|oplader|hoofdlamp')],
      ['detectors', R('detector|metaalzoeker|deus|minelab|nokta|garrett|quest|equinox|manticore|x-terra|vanquish')]
    ],
    houd: ['detectors', 'kinderen-beginners', 'magneetvissen', 'vondsten', 'graven', 'pinpointers', 'accessoires'],
    oud: { detectors: 'detectors', 'kinderen-beginners': 'detectors', pinpointers: 'pinpointers-uitrusting', graven: 'pinpointers-uitrusting', magneetvissen: 'magneetvissen', accessoires: 'pinpointers-uitrusting', vondsten: 'munten-vondsten' }
  },
  christelijk: {
    regels: [
      ['kerst', R('kerstkaart|kerst ?kaart|kaart.*kerst|kersttegel')],
      ['psalmboeken', R('psalmboek|psalmen ?boek|liedboek|kerkboek|gezangen|zangbundel|weerklank|op toonhoogte|bijbel met (psalmen|kerkboek)|psalmenpalet|met de psalmen|kleur de psalmen|psalmen voor')],
      ['bijbels', R('^(?!.*(dagboek|liedjes|\\babc\\b|bidden|teksten|kaart|sleutelhanger)).*(\\bbijbel\\b|statenvertaling|studiebijbel|kinderbijbel|peuterbijbel|babybijbel|bijbelhoes|bijbeltas|bijbeletui|huisbijbel|trouwbijbel|schoolbijbel|kanttekeningen|\\bhsv\\b|herziene)')],
      ['kerststal-engelen', R('kerststal|\\bstal\\b|\\bengel(en|tje|tjes|beeld|beeldje)?\\b|kribbe|kerstgroep|heilige familie')],
      ['doop-belijdenis', R('\\bdoop|belijdenis|geloofsbelijdenis')],
      ['kerst', R('kerst|advent')],
      ['sieraden', R('ketting|hanger|armband|kruisje|ring\\b|oorbel|bedel|sieraad|sieraden|broche|speld')]
    ],
    oud: { kerst: 'kerst', bijbels: 'bijbels', 'kaarten-posters': 'bijbelteksten-wanddecoratie', sieraden: 'sieraden', wanddecoratie: 'bijbelteksten-wanddecoratie', 'voor-kinderen': 'voor-kinderen', 'boeken-muziek': 'boeken-muziek', 'kerststal-engelen': 'kerststal-engelen', 'doop-belijdenis': 'doop-belijdenis' },
    /* Deze oude vakjes zijn al precies goed: geen titelregels gebruiken (een kinderbijbel blijft bij 'Voor kinderen' als hij daar stond). */
    houd: ['voor-kinderen', 'doop-belijdenis', 'kerst']
  }
};

/* Producten die naar een andere productgroep verhuizen. [van cat/sub, naar cat] */
const VERHUIS = [
  ['mode-beauty/horloges', 'sieraden'],
  ['mode-beauty/geuren', 'geuren-verzorging'],
  ['mode-beauty/verzorging', 'geuren-verzorging'],
  ['cadeaus/adventskalenders', 'eten-drinken'],
  ['keuken/kookboeken', 'boeken-media']
];

/* Labels/tags: extra informatie voor de knoppen en de nieuwe vakjes. */
const MEISJE = R('meisje|meiden|\\bgirls?\\b|barbie|prinses|\\bdames\\b');
const JONGEN = R('jongen|\\bboys?\\b|\\bheren\\b');

function leeftijdUitTitel(t) {
  let m;
  if ((m = t.match(/(\d{1,2})\s*(?:-|tot|t\/m)\s*(\d{1,2})\s*jaar/i))) return [+m[1], +m[2]];
  if ((m = t.match(/(\d{1,2})\s*(?:\+|jaar\s*\+|jaar en ouder|plus)/i))) return [+m[1], 99];
  if ((m = t.match(/vanaf\s*(\d{1,2})\s*jaar/i))) return [+m[1], 99];
  if ((m = t.match(/(\d{1,2})\s*(?:-|tot)\s*(\d{1,2})\s*maanden/i))) return [0, Math.max(1, Math.ceil(+m[2] / 12))];
  if (/vanaf\s*\d{1,2}\s*maanden|\b0\+|newborn|baby/i.test(t)) return [0, 2];
  return null;
}

function leeftijd(p, nieuwSub) {
  const t = p.titel || '';
  const uit = leeftijdUitTitel(t);
  if (uit && uit[0] <= 18) return uit;
  /* Leeftijd uit de specificaties of de beschrijving (bijv. 'Leeftijd: vanaf 8 jaar'). */
  const spec = (p.specs || []).find((r) => /leeftijd/i.test(r[0]));
  const uitSpec = spec && leeftijdUitTitel(String(spec[1]));
  if (uitSpec && uitSpec[0] <= 18) return uitSpec;
  const uitTekst = leeftijdUitTitel(p.waarom || '');
  if (uitTekst && uitTekst[0] <= 14 && !/baby/i.test(p.waarom || '') ) return uitTekst;
  if (/\bduplo\b/i.test(t)) return [1, 5];
  if (/lego.*(technic|ideas|icons|architecture|creator expert|star wars ultimate|botanical|art\b)/i.test(t)) return [9, 99];
  if (/\blego\b.*\bfriends\b|\blego\b.*\bcity\b|\blego\b.*\bninjago\b/i.test(t)) return [6, 12];
  if (/\blego\b/i.test(t)) return [6, 99];
  if (/playmobil.*(junior|1\.2\.3|123)/i.test(t)) return [1, 4];
  if (/playmobil/i.test(t)) return [4, 10];
  if (p.cat === 'speelgoed' && p.sub === 'baby-peuter') return [0, 3];
  if (nieuwSub === 'pokemon-verzamelkaarten') return [6, 99];
  if (nieuwSub === 'baby-houten') return [0, 3];
  return null;
}

function kies(groep, p, titel) {
  for (const [slug, re] of groep.regels) if (re.test(titel)) return slug;
  return null;
}

const T = (p) => (p.titel || '') + ' ' + (p.zoek || '');

function deel(p0) {
  const p = Object.assign({}, p0);
  p.ookIn = (p.ookIn || []).slice();
  p.voor = (p.voor || []).slice();
  const tags = new Set(p.tags || []);
  const titel = T(p);
  const oud = p.cat + '/' + p.sub;

  if (!p.subVast) {
    const verhuis = VERHUIS.find((v) => v[0] === oud);
    if (verhuis) p.cat = verhuis[1];
    /* Vogelhuisjes uit Dieren horen in de tuin. */
    if (oud === 'dieren/vogels' && /vogelhuis|nestkast|voeder|vogelvoer|pindakaas|mezen|vetbol|vogelbad|insect|egel/i.test(titel)) p.cat = 'tuin-klussen';

    const g = GROEPEN[p.cat];
    if (g) {
      const houd = g.houd && g.houd.indexOf(p.sub) !== -1 && p.cat === p0.cat;
      let nieuw = houd ? null : kies(g, p, titel);
      if (!nieuw) nieuw = g.oud[p.sub] || (p.cat !== p0.cat ? g.oud[p0.sub] : null);
      if (!nieuw && p.cat === 'eten-drinken' && p0.cat === 'cadeaus') nieuw = 'adventskalenders';
      if (!nieuw && p.cat === 'boeken-media') nieuw = 'kookboeken';
      if (!nieuw && p.cat === 'sieraden') nieuw = 'horloges';
      if (!nieuw && p.cat === 'geuren-verzorging') nieuw = 'huidverzorging';
      if (!nieuw && p.cat === 'tuin-klussen') nieuw = 'vogels-insecten';
      if (nieuw) p.sub = nieuw;
      /* Materiaal-vakjes bij sieraden (komt er extra bij). */
      if (g.extra) for (const [slug, ja, nee] of g.extra) if (ja.test(titel) && !(nee && nee.test(titel)) && slug !== p.sub) p.ookIn.push(p.cat + '/' + slug);
    }
    /* Rituals staat ook bij het soort product (parfum, bad & douche ...). */
    if (p.cat === 'geuren-verzorging' && p.sub === 'rituals') {
      const rest = GROEPEN['geuren-verzorging'].regels.filter((r) => r[0] !== 'rituals');
      const ander = kies({ regels: rest }, p, titel);
      if (ander) p.ookIn.push('geuren-verzorging/' + ander);
    }
  }

  /* Oude ookIn-verwijzingen naar vakjes die nu anders heten. */
  p.ookIn = p.ookIn.map((x) => OOKIN_HERNOEM[x] || x);

  /* Jongen/meisje: alleen als het duidelijk één van de twee is. */
  const kindProduct = p.voor.some((v) => v === 'kind' || v === 'kinderen' || v === 'tiener') || p.cat === 'speelgoed';
  if (kindProduct) {
    const m = MEISJE.test(titel), j = JONGEN.test(titel);
    if (m && !j) tags.add('meisje');
    if (j && !m) tags.add('jongen');
  }
  /* Leeftijd (alleen bij kinderspullen). */
  if (kindProduct || p.cat === 'speelgoed') { const l = leeftijd(p, p.sub); if (l) p.leeftijd = l; }

  /* Baby: label goed zetten. */
  const babyTekst = /\bbaby|kraam|newborn|rammelaar|\b0\+|0-6 maanden|bijtring|speelkleed|romper|rompertje|slab(betje)?|swaddle|hydrofiel|geboorte|knuffeldoek|speendoek|box ?mobiel|zwanger|babyshower|luiertaart|babygym/i;
  if (babyTekst.test(titel) && !/babyfoon|babyolie|\bbaby ?(born|annabell|pop)\b|babypop/i.test(titel) && p.cat !== 'christelijk') {
    if (p.voor.indexOf('baby') === -1) p.voor.push('baby');
  }
  if (p.voor.indexOf('baby') !== -1 || oud === 'cadeaus/baby-kraam') {
    if (/babyshower|zwanger|gender ?reveal|aanstaande|mama to be|mom to be|mommy/i.test(titel)) tags.add('baby-babyshower');
    if (/kraam|pakket|cadeaubox|cadeauset|giftset|gift ?box|luiertaart|geboorte|cadeaumand/i.test(titel) || oud === 'cadeaus/baby-kraam') tags.add('baby-kraampakketten');
    if (/romper|kleding|pakje|\bslab|mutsje|dekentje|\bdeken|hydrofiel|swaddle|slofjes|schoentjes|sokjes|badcape|omslagdoek|kruippakje|pyjama|boxpakje/i.test(titel)) tags.add('baby-kleding');
    if (/speelkleed|rammelaar|bijtring|mobiel|activity|knisper|babygym|badspeelgoed|stapel|sorteer|muziekdoos|speelboog|loopwagen|houten/i.test(titel) || oud === 'speelgoed/baby-peuter') tags.add('baby-speelgoed');
    if (/knuffel|met naam|naam|knuffeldoek|gepersonaliseerd|tutteldoek/i.test(titel)) tags.add('baby-knuffels-naam');
  }

  /* Warm & comfortabel (opa & oma). */
  if (/warmte|kruik|verwarmd|elektrische deken|warmtekussen|voetenwarmer|bedsokken|fleece|plaid|pantoffel|sloffen|huissok|badjas|ochtendjas|kamerjas/i.test(titel)) tags.add('warm');
  /* Zakmessen (voor hem). */
  if (/zakmes|multitool|victorinox|leatherman|opinel|\bmes\b.*(zak|klap)|klapmes|vouwmes|survivalmes|outdoormes/i.test(titel)) tags.add('zakmes');
  /* Brievenbus. */
  if (/brievenbus/i.test(titel)) tags.add('brievenbus');
  /* Cadeaupakketten & verwenpakketten. */
  if (/cadeaupakket|verwenpakket|verwenset|giftset|gift ?set|geschenkset|cadeauset|cadeaubox|gift ?box|cadeaumand|kerstpakket|proefpakket|borrelpakket|wellness ?pakket|spa ?pakket/i.test(titel)) tags.add('pakket');
  /* Cadeaubonnen en belevenissen. */
  if (/cadeaubon|cadeaukaart|giftcard|gift ?card|boekenbon|vvv/i.test(titel)) tags.add('cadeaubon');
  if (/belevenis|ervaring|workshop|ballonvaart|high ?tea arrangement|overnachting|dagje uit|escape ?room|uitje|wellness ?arrangement|bongo/i.test(titel)) tags.add('belevenis');
  /* Origineel: heel bijzondere of opvallende cadeaus. */
  if (/origineel|uniek|bijzonder|grappig|gek|apart|opvallend|ludiek|verrassend|mini |miniatuur|book ?nook|levitat|zwevend|sterrenkaart|star ?map|moon ?lamp|maanlamp|3d|lichtgevend|in ?glas|terrarium|kraskaart|scratch|wereldkaart|kweekset|grow ?your ?own|bonsai/i.test(titel)) tags.add('origineel');

  /* Metaaldetectie: niveau. */
  if (p.cat === 'metaaldetectie' && p.sub === 'detectors') {
    if (/kind|junior|kids|jeugd|tieners?/i.test(titel) || (p0.sub === 'kinderen-beginners' && p.prijs < 100)) tags.add('niveau-kinderen');
    else if (p0.sub === 'kinderen-beginners' || p.prijs <= 300) tags.add('niveau-beginner');
    else tags.add('niveau-gevorderd');
  }

  /* Collega: waarom geef je het (afscheid, bedankje, lootjes). Meer dan één mag. */
  if (p.voor.indexOf('collega') !== -1 || oud === 'cadeaus/collega' || (p0.ookIn || []).indexOf('cadeaus/collega') !== -1) {
    const lekker = /^(eten-drinken|dranken)$/.test(p.cat) || /bloem|plant|kaars|geurstok|bonbon|chocola|thee|koffie|handcr|zeep|bad|bedankt|dankjewel|thank/i.test(titel);
    const blijvend = /^(boeken-media|wonen|keuken|hobby|tuin-klussen|elektronica|sport-outdoor|speelgoed|sieraden|mode-beauty|cadeaus)$/.test(p.cat) || /afscheid|pensioen|met naam|gegraveerd|gepersonaliseerd/i.test(titel);
    if (/afscheid|pensioen|vaarwel|nieuwe baan|succes|farewell/i.test(titel) || (blijvend && p.prijs >= 15)) tags.add('collega-afscheid');
    if (/bedankt|dankjewel|thank|merci|top collega|beste collega/i.test(titel) || (lekker && p.prijs <= 40)) tags.add('collega-bedankje');
    if (p.prijs <= 25) tags.add('collega-lootjes');
    if (![...tags].some((t) => t.indexOf('collega-') === 0)) tags.add(p.prijs <= 25 ? 'collega-lootjes' : 'collega-afscheid');
  }

  /* Verjaardag: leeftijd in de titel (18, 30, 40, 50, 60, 65 jaar; Abraham en Sarah = 50). */
  const jr = titel.match(/\b(18|21|25|30|40|50|60|65|70|80)(\s*jaar|ste|e verjaardag|\b)/i);
  if (/abraham|sarah\b/i.test(titel)) tags.add('jaar-50');
  else if (jr && /jaar|verjaardag|jarig|birthday|happy/i.test(titel)) tags.add('jaar-' + jr[1]);
  if (/verjaardag|jarig|birthday|happy b-?day|hiep hiep/i.test(titel)) tags.add('verjaardag');
  /* Overige gelegenheden. */
  if (/housewarming|nieuwe woning|nieuw huis|nieuwe huis|verhuiz|thuis\b|home sweet home/i.test(titel)) tags.add('housewarming');
  if (/\bjuf\b|meester|leerkracht|leraar|lerares|juffrouw|onderwijzer|einde schooljaar|schoolverlater|\bteacher/i.test(titel)) tags.add('juf-meester');
  if (/uitdeel|traktatie|kinderfeestje|feestzakje|goodiebag|goodie ?bag|uitdelen/i.test(titel)) tags.add('uitdelen');
  if (/beterschap|sterkte|get well|herstel|beter worden|condoleance|troost|in gedachten|denk aan je|knuffel ?(op afstand|in een doosje)|hug in a box|zorg goed voor/i.test(titel)) tags.add('beterschap');
  if (/geslaagd|diploma|rijbewijs|afgestudeerd|graduat|examen|cum laude|nieuwe auto|eerste auto/i.test(titel)) tags.add('geslaagd');
  if (/trouw|huwelijk|bruid|bruiloft|wedding|getrouwd|jubileum|jarig getrouwd|\bmr ?(&|and) ?mrs|verloving|engagement|vrijgezel/i.test(titel)) tags.add('trouwen');

  if (tags.size) p.tags = [...tags]; else delete p.tags;
  return p;
}

/* ookIn-adressen die door de nieuwe indeling anders heten. */
const OOKIN_HERNOEM = {
  'cadeaus/adventskalenders': 'eten-drinken/adventskalenders',
  'mode-beauty/horloges': 'sieraden/horloges',
  'mode-beauty/geuren': 'geuren-verzorging/parfum',
  'mode-beauty/verzorging': 'geuren-verzorging/huidverzorging',
  'keuken/kookboeken': 'boeken-media/kookboeken',
  'speelgoed/bouwen': 'speelgoed/lego',
  'speelgoed/baby-peuter': 'speelgoed/baby-houten',
  'speelgoed/bordspellen': 'speelgoed/bord-kaartspellen',
  'speelgoed/kaartspellen': 'speelgoed/bord-kaartspellen',
  'speelgoed/figuren-voertuigen': 'speelgoed/autos-treinen-rc',
  'speelgoed/knutselen': 'speelgoed/knutselen-kleuren',
  'wonen/kaarsen-geur': 'wonen/kaarsen',
  'wonen/woonaccessoires': 'wonen/wanddecoratie',
  'wonen/verlichting': 'wonen/lampen',
  'wonen/plaids-kussens': 'wonen/kussens-plaids',
  'wonen/kerstdecoratie': 'wonen/kerst',
  'keuken/koken': 'keuken/pannen',
  'keuken/serveren': 'keuken/glazen-servies',
  'keuken/opbergen': 'keuken/voorraadpotten',
  'dranken/cognac-brandy': 'dranken/cognac',
  'dranken/gin': 'dranken/gin-cocktails',
  'dranken/likeur': 'dranken/likeuren',
  'dranken/wijn': 'dranken/wijn-port',
  'dranken/bubbels': 'dranken/champagne-bubbels',
  'eten-drinken/chocolade-snoep': 'eten-drinken/chocolade',
  'eten-drinken/bbq': 'eten-drinken/bbq-sauzen',
  'eten-drinken/pakketten': 'eten-drinken/kerst-cadeaupakketten',
  'eten-drinken/lekkernijen': 'eten-drinken/delicatessen',
  'hobby/tekenen-schilderen': 'hobby/tekenen',
  'hobby/knutselen': 'hobby/origami-scrapbooking',
  'tuin-klussen/planten-zaden': 'tuin-klussen/planten-potten',
  'tuin-klussen/gereedschap': 'tuin-klussen/handgereedschap-werkplaats',
  'boeken-media/romans': 'boeken-media/thrillers-romans',
  'boeken-media/agendas': 'boeken-media/agendas-planners-kalenders',
  'boeken-media/lezen': 'boeken-media/leesplezier',
  'dieren/klein-dier': 'dieren/konijn-cavia-hamster',
  'metaaldetectie/kinderen-beginners': 'metaaldetectie/detectors',
  'metaaldetectie/pinpointers': 'metaaldetectie/pinpointers-uitrusting',
  'metaaldetectie/graven': 'metaaldetectie/pinpointers-uitrusting',
  'metaaldetectie/accessoires': 'metaaldetectie/pinpointers-uitrusting',
  'metaaldetectie/vondsten': 'metaaldetectie/munten-vondsten',
  'elektronica/audio': 'elektronica/speakers',
  'elektronica/slimme-gadgets': 'elektronica/gadgets-trackers',
  'elektronica/telefoon': 'elektronica/telefoon-opladen',
  'elektronica/foto-video': 'elektronica/cameras',
  'mode-beauty/rugzakken-reistassen': 'mode-beauty/rugzakken',
  'mode-beauty/kleding': 'mode-beauty/truien-hoodies',
  'mode-beauty/accessoires': 'mode-beauty/riemen-sleutelhangers',
  'christelijk/kaarten-posters': 'christelijk/bijbelteksten-wanddecoratie',
  'christelijk/wanddecoratie': 'christelijk/bijbelteksten-wanddecoratie'
};

module.exports = { deel, GROEPEN, OOKIN_HERNOEM };
