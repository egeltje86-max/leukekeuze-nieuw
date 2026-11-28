# -*- coding: utf-8 -*-
"""Marktlijst voor de Superkeurkamer (27-11-2026, opdracht Marius: 'maak de Superkeurkamer leeg en vul hem met alle producten
die we moeten hebben om alles te kunnen bieden wat er op de markt is; ik kies er alleen de beste van').

Drie lagen: categorie > pagina > blok. Een blok is één soort product (Boemerangs, Minecraft-lampjes, PS5-spellen) en zoekt
slim in alle partners: zoek = woorden (een van deze), niet = woorden die eruit moeten, min/max = prijs.
De volgorde van de blokken op een pagina is de volgorde op de site: eerst het hoofdproduct, daarnaast wat je er meteen
bij koopt, daaronder wat erbij hoort (bij PS5: console, controller, spellen, accessoires).
Let op: de zoekindex zoekt op stukjes woord (trigram): 'boog' vindt ook 'regenboog'. Kies vaste woordcombinaties of zet
het stoorwoord in niet. Een spatie aan het begin of eind telt mee (' gin ' vindt geen 'ging').

Gebruik: python3 maak_markt.py <uit.json>   (schrijft mijn-categorieen.json voor de Superkeurkamer)"""
import json, sys, datetime

BOOM = []


def B(naam, zoek, niet='', mn=None, mx=None, tip='', doel=6, ook='', winkels='', volg=None):
    """ook = tweede groep woorden waarvan er OOK een in moet staan (franchise x soort: 'hello kitty' + 'knuffel|pluche')."""
    return {'naam': naam, 'zoek': [w for w in zoek.split('|') if w], 'niet': [w for w in niet.split('|') if w],
            'ook': [w for w in ook.split('|') if w], 'winkels': [w for w in winkels.split('|') if w], 'min': mn, 'max': mx, 'tip': tip, 'doel': doel, 'volg': volg}


def P(naam, blokken, mn=3, mx=250, niet='', winkels=''):
    """winkels = alleen deze partners (bv. belevenissen alleen bij Doenkado en Vipio)."""
    for b in blokken:
        if winkels and not b['winkels']:
            b['winkels'] = winkels.split('|')
        if b['min'] is None:
            b['min'] = mn
        if b['max'] is None:
            b['max'] = mx
        b['niet'] += [w for w in niet.split('|') if w]
    return {'naam': naam, 'blokken': blokken}


def C(naam, paginas):
    BOOM.append({'naam': naam, 'paginas': paginas})


# ---------------------------------------------------------------- 1 SPEELGOED
C('Speelgoed', [
    P('Baby & peuter', [
        B('Rammelaars & bijtringen', 'rammelaar|bijtring|bijtspeelgoed|grijpring|knisper'),   # 28-11-2026: boekjes naar Babyboekjes
        B('Speelkleden & babygyms', 'babygym|speelkleed|speelmat baby|activity gym|play gym|speeltapijt', 'yoga|puzzelmat'),
        B('Activiteitenspeelgoed', 'activiteitenkubus|activity cube|activiteitencentrum|motoriekspeelgoed|motoriek|activiteitenbord|busy board|kralenspiraal|kralenframe'),
        B('Stapelen & sorteren', 'stapeltoren|stapelbekers|stapelringen|vormenstoof|vormensorteerder|sorteerdoos|stapelblokken|stapelspel baby', 'stapelstoel'),
        B('Loopwagens & duwspeelgoed', 'loopwagen|loopkar|duwkar|duwspeelgoed|trekfiguur|trekdier|loopfiets|loopauto', 'fietsdrager|bolderkar'),
        B('Badspeelgoed', 'badspeelgoed|badeend|badspeel|bath toy|badfiguren'),
        B('Houten speelgoed', 'houten speelgoed|houten puzzel|houten trein|houten auto|houten blokken|houten speel', 'meubel|kast'),
        B('Muziek voor de kleintjes', 'xylofoon|babypiano|baby piano|muziekdoosje|rammelei|trommeltje|muziekspeelgoed baby|speeldoos'),
    ], mn=5, mx=120, niet='boek|bijbel'),   # 28-11-2026 (Marius): boekjes horen bij Babyboekjes, niet tussen het speelgoed
    P('LEGO & bouwen', [
        B('LEGO City', 'lego city'), B('LEGO Friends', 'lego friends'), B('LEGO Technic', 'lego technic'),
        B('LEGO Star Wars', 'lego star wars'), B('LEGO Harry Potter', 'lego harry potter'), B('LEGO Minecraft', 'lego minecraft'),
        B('LEGO Super Mario', 'lego super mario|lego mario'), B('LEGO Ninjago', 'lego ninjago'),
        B('LEGO Speed Champions', 'lego speed champions'), B('LEGO Disney & Marvel', 'lego disney|lego marvel|lego spider|lego avengers|lego frozen|lego stitch'),
        B('LEGO bloemen & planten', 'lego botanical|lego bloem|lego roos|lego rozen|lego bonsai|lego boeket|lego orchidee|lego plant|lego cactus'),
        B('LEGO voor volwassenen', 'lego icons|lego ideas|lego architecture|lego art|lego creator expert|lego 18+'),
        B('LEGO DUPLO', 'duplo'),
        B('Magnetisch bouwen', 'magna-tiles|magnatiles|connetix|magnetische tegels|magnetisch bouw|magnetic tiles|geomag|magformers'),
        B('Knikkerbanen', 'knikkerbaan|gravitrax|marble run'),
        B('Andere bouwstenen', 'cobi|mega bloks|mega construx|bluebrixx|bouwstenen|bouwblokken|clics|k\'nex|knex', 'lego'),
    ], mn=5, mx=500, niet='minifiguur los|losse onderdelen|onderdelen'),
    P('Knuffels', [
        B('Grote knuffels (1 meter)', 'knuffel 100 cm|knuffel 1 meter|knuffel 120 cm|knuffel 150 cm|reuzenknuffel|xxl knuffel|grote knuffel|knuffel xxl|knuffel 90 cm|knuffel 80 cm'),
        B('Squishmallows', 'squishmallow'),
        B('Jellycat', 'jellycat'),
        B('Knuffelberen', 'knuffelbeer|teddybeer|teddy beer|beertje knuffel|teddy bear', 'teddy hoodie|deken'),
        B('Dino- en zeedierknuffels', 'dino knuffel|dinosaurus knuffel|knuffel dino|haai knuffel|knuffel haai|octopus knuffel|knuffel octopus|walvis knuffel|knuffel dolfijn|axolotl knuffel|knuffel axolotl'),
        B('Honden- en kattenknuffels', 'knuffel hond|hond knuffel|knuffelhond|knuffel kat|kat knuffel|poes knuffel|knuffel poes|puppy knuffel', 'hondenspeelgoed|kattenspeelgoed|voor honden'),
        B('Eenhoorns & fantasie', 'eenhoorn knuffel|unicorn knuffel|knuffel eenhoorn|draak knuffel|knuffel draak'),
        B('Knuffels van films & games', 'stitch knuffel|knuffel stitch|disney knuffel|mario knuffel|sonic knuffel|minecraft knuffel|bluey knuffel|nijntje knuffel|paw patrol knuffel|kirby knuffel', 'pokemon|hello kitty|kuromi'),
        B('Interactieve knuffels', 'furreal|little live pets|interactieve knuffel|interactief huisdier|robot huisdier|hatchimals'),
        B('Handpoppen', 'handpop|vingerpop|poppenkast'),
        B('Knuffeldoekjes & babyknuffels', 'knuffeldoek|knuffeldoekje|tuttel|speendoekje|slaapknuffel|babyknuffel'),
    ], mn=5, mx=150, niet='warmteknuffel|magnetron|kostuum|onesie|hondenspeeltje'),
    P('Poppen & rollenspel', [
        B('Babypoppen', 'babypop|baby pop|baby born|babyborn|baby annabell|poppenwagen|poppenbed|poppenkleding'),
        B('Barbie & modepoppen', 'barbie|rainbow high|bratz|modepop|tienerpop|polly pocket', 'barbie film dvd'),
        B('L.O.L. & verzamelpoppen', 'l.o.l. surprise|lol surprise|verrassingspop|sylvanian|gabby'),
        B('Poppenhuizen', 'poppenhuis|poppenhuismeubel|dollhouse', 'bouwpakket miniatuur|book nook'),
        B('Speelkeukens', 'speelkeuken|kinderkeuken|speelgoedeten|speelgoed eten|keukentje kinderen|speelgoed servies'),
        B('Winkeltjes & kassa\'s', 'speelgoedkassa|kassa speelgoed|winkeltje speelgoed|supermarkt speelgoed|speelgoedwinkel|ijskraam|speelgeld|kassa met|winkelkassa|kinderkassa|speelwinkel'),
        B('Dokterssets', 'doktersset|dokterskoffer|dierenarts set|ziekenhuis speelset'),
        B('Gereedschap & werkbank', 'speelgoedgereedschap|gereedschapsset kind|werkbank kind|kinderwerkbank|speelgoed werkbank|bouwvakker'),
        B('Verkleedkleding', 'verkleedkleding|verkleedpak|verkleedset|verkleedkostuum|prinsessenjurk|ridderpak|piratenpak|brandweerpak|politiepak|superheldenpak|kostuum kind|kinderkostuum|verkleedjurk|verkleedkist|cape kind', 'volwassen|heren|dames|sexy|diadeem|haarspray|feestpet|heuptas|pruik|schmink|masker los|hoedje|tiara los|snor|zonnebril|halloween|carnaval heren|maat xl'),
    ], mn=5, mx=200),
    P('Auto\'s & speelfiguren', [
        B('Speelgoedauto\'s & garages', 'speelgoedauto|garage speelgoed|parkeergarage|autogarage|takelwagen speelgoed|brandweerauto speelgoed|vrachtwagen speelgoed|tractor speelgoed', 'auto onderdelen'),
        B('Hot Wheels & Matchbox', 'hot wheels|matchbox|majorette|siku'),
        B('Racebanen', 'racebaan|carrera|scalextric|autobaan'),
        B('Treinen', ' brio|brio |houten trein|treinbaan|speelgoedtrein|treinset|trein set', 'modeltrein|märklin|marklin|wijn|reserva|cabrio|xylofoon|brioche'),
        B('Bestuurbare auto\'s voor kinderen', 'bestuurbare auto|rc auto kind|radiografisch|afstandsbestuurbaar|rc stunt|rc truck', 'nitro|brandstof|1:5|1:8|1:10|accu los|reserve'),
        B('Playmobil', 'playmobil'),
        B('Actiefiguren & superhelden', 'actiefiguur|action figure|actiefiguren|superheld figuur|spider-man figuur|batman figuur|transformers|power rangers|wwe'),
        B('Dino\'s & dierenfiguren', 'schleich|dinosaurus figuur|dinofiguur|dino figuur|papo|jurassic world figuur|speelfiguur dier|boerderijdieren'),
        B('Fidgets & stressballen', 'fidget|stressbal|stress bal|pop it|squishy|needoh|nee doh|simple dimple|anti-stress'),
        B('Tollen & Beyblades', 'beyblade|tol |speeltol|spinning top|bey blade'),
    ], mn=3, mx=200),
    P('Knutselen', [
        B('Tekenen & kleuren', 'kleurpotloden|stiften set|viltstiften|tekenset kind|stabilo|crayola|faber-castell|kleurset|krijtjes|waskrijt'),
        B('Klei & Play-Doh', 'play-doh|playdoh|klei set|boetseerklei|kinderklei|foam klei|zandklei|kinetic sand|kinetisch zand'),
        B('Slijm', 'slijm|slime'),
        B('Strijkkralen', 'strijkkralen|hama kralen|aquabeads|perler'),
        B('Sieraden maken', 'sieraden maken|armbandjes maken|kralenset|kralen set|letterkralen|vriendschapsarmband|kralendoos|bedelarmband maken|sieradenset maken|kralen maken|jewelry kit|kralenkoffer', 'volwassen|tang|naaidoos|opbergbox|losse kralen|52x stuks|64x'),
        B('Knutselsets', 'knutselset|knutseldoos|knutselpakket|knutselkoffer|knutselen kinderen|creatieve set|craft set'),
        B('Schilderen voor kinderen', 'verfset kind|vingerverf|plakkaatverf|schilderset kind|ezel kind|schildersezel kind|waterverf kind'),
        B('Stickers & tattoos', 'stickerboek|stickerset|stickers kinderen|tattoo kind|tattoos kinderen|plaktattoo|nageltattoo kind'),
    ], mn=3, mx=100),
    P('Ontdekken & leren', [
        B('Experimenteren & scheikunde', 'experimenteer|scheikunde|proefjes|wetenschap|science|chemie|vulkaan|kristallen kweken|kristal kweken|clementoni wetenschap|national geographic|stem ', 'boek|paperback|hardback|pruik|heupfles'),
        B('Opgraven & kristallen', 'uitbikken|opgraafset|graafset|dino opgraven|edelstenen opgraven|kristallen set|geode'),
        B('Microscopen', 'microscoop'),
        B('Telescopen', 'telescoop', 'mount los'),
        B('Robots & programmeren', 'programmeren|robot kind|codeer|coding robot|bouwrobot|lego education|ozobot|sphero'),
        B('Tiptoi & leersystemen', 'tiptoi|ravensburger leer|leerspel|leercomputer|vtech|leertablet'),
        B('Toniebox & luisterboxen', 'toniebox|tonies|tonie|luisterbox|kinderluisterbox|yoto'),
        B('Wereldbollen', 'wereldbol|globe kind|orboot|interactieve wereldbol'),
        B('Walkietalkies & spionage', 'walkie talkie|walkietalkie|spionage|spionnen|geheim agent|nachtkijker kind'),
        B('Muziekspeelgoed & karaoke', 'karaoke|kindermicrofoon|kinderkaraoke|speelgoedgitaar|kindergitaar|kinderdrumstel|keyboard kind|speelgoed microfoon|microfoon met speaker|bluetooth microfoon|zingende microfoon|kinderkeyboard|kinderpiano', 'trui|sweater|partybox 520|kersttrui'),
    ], mn=5, mx=200),
    P('Buiten spelen', [
        B('Pijl en boog', 'pijl en boog|handboog|boogschiet|archery|boog en pijl|boogschietset', 'boek|hardback|paperback|ersatz|vervangende pijlen|leer handboogschieten|workshop'),
        B('Boemerangs', 'boemerang|boomerang', 'salon|tafel|jukebox|snorkel|marvel|mcfarlane|t-shirt|petstages|chuckit|hond|kat |mok|lamp|bank|stoel|grill|traxxas|effect|principe|nagel|vijl|bouwstenen|surfplank|infanterie|luisterboek'),
        B('Knikkers', 'knikker', 'knikkerbaan|marble run|gravitrax'),
        B('Voetballen', 'voetbal maat|voetbal kinder|bal maat 5|bal maat 4|straatvoetbal|voetbal derbystar|voetbal adidas|voetbal nike|mini voetbal'),
        B('Hoepels', 'hoepel|hula hoop|hulahoop'),
        B('Waterpistolen', 'waterpistool|waterpistolen|watergeweer|water blaster|super soaker|waterspeelgoed'),
        B('Bellenblaas', 'bellenblaas|bellenblaasmachine|bubble machine|reuzenbellen'),
        B('Vliegers', 'vlieger', 'vliegerlijn los'),
        B('Stoepkrijt', 'stoepkrijt'),
        B('Springtouwen & elastiek', 'springtouw|springelastiek|elastiekspringen'),
        B('Frisbees & werpspellen', 'frisbee|werpschijf|ultimate disc'),
        B('Nerf & foam blasters', 'nerf|x-shot|foam blaster|dartblaster'),
        B('Steps & loopfietsen', 'kinderstep|step kind|driewielstep|loopfiets|balance bike|stuntstep', 'elektrische'),
        B('Trampolines', 'trampoline', 'rand los|vervangend'),
        B('Speelhuisjes & tenten', 'speelhuisje|speeltent|tipi kind|kindertent|speelhuis'),
        B('Zandbak & zandspeelgoed', 'zandbak|zandspeelgoed|strandspeelgoed|emmer en schep|zandtafel|watertafel'),
        B('Buitenspellen', 'kubb|mölkky|molkky|jeu de boules|cornhole|zaklopen|blikgooien|buitenspel|ladder golf|kegelspel'),
        B('Badminton & rackets', 'badmintonset|badminton set|beachball set|tennis set kind|speedminton'),
        B('Sleeën & sneeuwspeelgoed', 'slee|sneeuwschep kind|sneeuwbal maker|sneeuwballen|bobslee|glijplank', 'sleeve|sleep'),
        B('Skelters & trapauto\'s', 'skelter|trapauto|go-kart|gocart|trekker trap|trapper'),
    ], mn=3, mx=400, niet='hond|honden|kat |katten|t-shirt|piercing|marvel legends|mcfarlane|boek|hardback|paperback'),
])

# ---------------------------------------------------------------- 2 SPELLEN, PUZZELS & BOEKEN
C('Spellen, puzzels & boeken', [
    P('Bordspellen', [
        B('Klassiekers', 'monopoly|rummikub|scrabble|risk|cluedo|mens erger je niet|stratego|levensweg|triominos|ganzenbord'),
        B('Catan & strategie', 'catan|carcassonne|ticket to ride|7 wonders|wingspan|azul|splendor|pandemie|cascadia|kingdomino|everdell'),
        B('Spellen voor twee', 'duel|voor 2 spelers|twee spelers|patchwork|jaipur|lost cities|7 wonders duel'),
        B('Coöperatieve spellen', 'coöperatief|cooperatief|samen spelen spel|pandemic|the crew|the mind'),
        B('Quizspellen', 'triviant|quizspel|quiz spel|quiz|trivial pursuit|weet jij het|wie is het|30 seconds|30 seconden|ken je dat|vragenspel', 'paperback|hardback|kaarten hond|mind quiz'),
        B('Escape- en detectivespellen', 'escape room spel|exit het spel|unlock|deckscape|detective spel|moordspel|murder mystery'),
    ], mn=10, mx=150, niet='uitbreiding|expansion|sleeves|insert|engelstalig|english edition'),
    P('Kaart- & partyspellen', [
        B('Kaartspellen', ' uno|uno |phase 10|skyjo|regenwormen|dobble|5 alive|halli galli|saboteur|kaartspel|exploding kittens|taco kat|hitster|dutch blitz|ligretto|bohnanza|the mind|love letter|regenwormen|kwartet', 'tefal|bremsscheibe|ultimate uno|wijn|reserva|kussen|lp)|(lp)|parfum|geschenkset|speelkaarten met eigen foto'),
        B('Partyspellen', 'exploding kittens|partyspel|wie is de mol|30 seconds|30 seconden|pictionary|taboo|weerwolven|zeg geen uhm|dixit|codenames'),
        B('Hitster & muziekspellen', 'hitster|muziekspel|songpop|music quiz'),
        B('Dobbelspellen', 'yahtzee|qwixx|dobbelspel|farkle|liar\'s dice|dobbelstenen set'),
        B('Schaken & dammen', 'schaakbord|schaakspel|schaakset|damspel|dambord|backgammon|schaakklok'),
        B('Poker & casino', 'pokerset|poker set|pokerchips|roulette|blackjack|casino set'),
        B('Speelkaarten', 'speelkaarten|kaartspel met foto|playing cards'),
    ], mn=5, mx=120, niet='uitbreiding|expansion|engelstalig|english edition|drinkspel|drankspel'),
    P('Kinderspellen', [
        B('Klassiekers voor kinderen', 'memory|kwartet|lotto|domino kinder|stapelgek|halli galli junior|ganzenbord kind'),
        B('Actie- en behendigheidsspellen', 'hungry hippos|bootje varen|jenga|kerplunk|pak de|vang het|stapelspel|hoedje van papier|wie is het'),
        B('Haba & coöperatieve kinderspellen', 'haba spel|boomgaard|kleine boomgaard|coöperatief kinderspel|selecta'),
        B('Leer- en rekenspellen', 'rekenspel|leerspel|taalspel|klokspel|letterspel|rekenen spel'),
        B('Smartgames & denkpuzzels', 'smartgames|smart games|denkspel|logica spel|iq spel|thinkfun|rush hour'),
        B('Spellen met films & figuren', 'paw patrol|bluey|disney|pokemon|minecraft|nijntje|frozen|super mario|harry potter|peppa|gabby', '', ook='spel |bordspel|kaartspel|memory|kwartet|domino|pim pam| uno|uno |monopoly|cluedo|ganzenbord|mens erger'),
    ], mn=5, mx=80, niet='uitbreiding|engelstalig'),
    P('Puzzels', [
        B('Puzzels 1000 stukjes', 'puzzel 1000|1000 stukjes|1000 stuks puzzel'),
        B('Puzzels 500 stukjes en minder', 'puzzel 500|500 stukjes|puzzel 300|300 stukjes|puzzel 250|grote stukjes'),
        B('Jan van Haasteren', 'jan van haasteren|jvh'),
        B('Wasgij', 'wasgij'),
        B('Kinderpuzzels', 'kinderpuzzel|puzzel kind|vloerpuzzel|legpuzzel kind|puzzel 24 stukjes|puzzel 48|puzzel 100 stukjes|houten puzzel'),
        B('Puzzels met eigen foto', 'fotopuzzel|puzzel met foto|puzzel eigen foto|gepersonaliseerde puzzel'),
        B('Bijzondere puzzels', 'ronde puzzel|mystery puzzel|moordmysterie|escape puzzel|puzzel zonder|houten puzzel|wentworth|wasgij|puzzelmysterie|impossible puzzle|onmogelijke puzzel|dubbelzijdige puzzel|vormpuzzel|silhouetpuzzel|pintoo'),
        B('Puzzelaccessoires', 'puzzelmat|puzzelrol|puzzelbord|puzzelplank|puzzellijm|puzzelkoffer'),
    ], mn=5, mx=100),
    P('3D-puzzels & breinbrekers', [
        B('3D-puzzels', '3d puzzel|3d-puzzel|puzzleball|3d puzzle'),
        B('Rubik\'s & kubussen', 'rubik|kubus puzzel|speedcube|magische kubus|gan cube'),
        B('Breinbrekers & IQ', 'breinbreker|hersenbreker|iq puzzel|metalen puzzel|houten breinbreker|puzzelbox|puzzeldoos'),
        B('Doolhofballen', 'perplexus|doolhofbal|doolhof bal|labyrinth bal|maze ball|doolhofspel|labyrinth|doolhof', 'boek|paperback|hardback|klimblok|tunnel'),
        B('Cryptex & geheime doosjes', 'cryptex|geheime doos|geldpuzzel|money maze|cadeaupuzzel|puzzeldoos|puzzelbox|trucdoos|geheim vakje|geheime bergplaats|geldkluis puzzel|cadeau doolhof'),
    ], mn=5, mx=120),
    P('Boeken & puzzelboeken', [
        B('Romans & thrillers', 'roman|thriller|detective boek|feelgood|literaire', 'kleurboek|puzzelboek|kinderboek'),
        B('Kookboeken', 'kookboek|receptenboek|bakboek'),
        B('Non-fictie & hobbyboeken', 'non-fictie|biografie|geschiedenisboek|natuurboek|vogelboek|reisgids|hobbyboek|tuinboek|wijnboek'),
        B('Strips', 'stripboek|strip album|suske en wiske|kuifje|asterix|lucky luke|guust|jommeke|donald duck', 'manga'),
        B('Puzzelboeken', 'puzzelboek|sudoku|woordzoeker|kruiswoord|denksport|breinbrekers boek|puzzel boek'),
        B('Koffietafelboeken', 'koffietafelboek|fotoboek natuur|atlas|kunstboek|hardcover foto'),
        B('Young adult', 'young adult|ya boek|colleen hoover|sarah j. maas|hunger games'),
    ], mn=5, mx=80),
    P('Invulboeken & dagboeken', [
        B('Invulboeken voor familie', 'invulboek|vertel eens|opa vertel|oma vertel|mama vertel|papa vertel|herinneringenboek'),
        B('Dagboeken & journals', 'dagboek|journal|5 jaar dagboek|vijfjarendagboek|dankbaarheid|gratitude', 'agenda'),
        B('Vriendenboekjes', 'vriendenboek|vriendenboekje'),
        B('Baby- en zwangerschapsboeken', 'babyboek|baby boek|zwangerschapsdagboek|eerste jaar boek|mijn eerste jaar'),
        B('Gastenboeken', 'gastenboek'),
        B('Bucketlists & bonnenboekjes', 'bucketlist|bucket list|bonnenboekje|waardebonnen boekje|kraskaart boek'),
        B('Reisdagboeken', 'reisdagboek|reisjournal|travel journal'),
    ], mn=5, mx=60),
    P('Kinderboeken & kleurboeken', [
        B('Prentenboeken', 'prentenboek|kartonboek|kartonnen boek|peuterboek'),
        B('Voorleesboeken', 'voorleesboek|voorleesverhalen|verhalenbundel|sprookjesboek'),
        B('Leesboeken 6 tot 9', 'leesboek|kinderboek|voorleesboek|avi m|avi e|avi-m|avi-e|dolfje|dikkie dik|mees kees|dummie|gozert|gruffalo|tom gates|dagboek van een muts|het leven van een loser|geronimo stilton|mees kees|juf braaksel', 'volwassen|paperback studie|studieboek|vaardigheden'),
        B('Leesboeken 9 tot 12', 'dagboek van een loser|harry potter boek|kinderboek 9|kinderboek 10|tom gates|geronimo stilton|kinderthriller'),
        B('Kleurboeken voor kinderen', 'kleurboek|kleurplaten|kleurblok|kleuren op nummer|doeboek|kleur- en doeboek', 'volwassenen|volwassen|mandala|manifesteren|glas-in-lood|mindful|zen|anti-stress|antistress'),
        B('Kleurboeken voor volwassenen', 'kleurboek volwassen|kleurboek voor volwassenen|mandala kleurboek|kleuren voor volwassenen'),
        B('Doe- en stickerboeken', 'doeboek|stickerboek|kijk en zoek|zoekboek|geluidenboek|flapjesboek'),
        B('Weetboeken & encyclopedieën', 'encyclopedie|weetboek|informatieboek|wereldatlas kind|dinoboek|ruimteboek'),
        B('Kinderbijbels', 'kinderbijbel|peuterbijbel|bijbel voor kinderen'),
        # 28-11-2026 (Marius: 'ik zie geen categorie babyboekjes'): achteraan voor vaste ids, maar bovenaan getoond (volg=0)
        B('Babyboekjes', 'knisperboek|knisperbijbel|badboek|stoffen boekje|buggyboek|voelboek|babyboekje|baby boekje|speelboekje|bijtboekje|kiekeboeboekje|zwart-wit boekje',
          'boekenlegger|invulboek|dagboek|ontbijt|zwangerschap|kookboek', mn=4, mx=60, tip='Knisper-, bad-, stoffen, buggy- en voelboekjes', volg=0),
    ], mn=4, mx=50),
])

# ---------------------------------------------------------------- 3 GAMING & FANS
GAME_NIET = 'hoesje voor telefoon|phone case|t-shirt|sticker|poster|mok |lamp|knuffel|sleutelhanger|mug|wekker|bookend|boekensteun|klok|kussen|deken|plaid|pet |muts|sokken|rugzak|funko|beker|glas |onderzetter|hoodie|trui|pyjama'
SW_NIET = 'dimmer|pressure|psi |hue |console|controller|joy-con|joycon|hoes|case|tas |screenprotector|oplader|laadstation|dock|adapter|camera|grip|stuur|wheel|kabel|headset|amiibo|tegoed|kaart|card|standaard|opberg'
SW_OOK = 'hoes|case|tas |screenprotector|dock|adapter|camera|grip|oplader|laadstation|kabel|standaard|stuur|wheel|headset|opberg'
PK = 'pokemon|pikachu|eevee|evoli|charizard|glurak|snorlax|gengar|squirtle|bulbasaur|charmander|jigglypuff|psyduck|lucario|mewtwo'
HK = 'hello kitty|kuromi|cinnamoroll|my melody|sanrio|pompompurin|pochacco|keroppi|badtz'
KP = 'kpop demon|k-pop demon|huntrix|saja boys|derpy|sussie'
C('Gaming & fans', [
    P('PlayStation 5', [
        B('PS5-consoles', 'playstation 5|ps5', 'controller|dualsense|game |headset|hoes|skin|faceplate|standaard|vr2|portal|schijfstation|disc drive', 350, 1200, ook='console|slim|pro|digital|disc edition|bundel'),
        B('PS5-controllers', 'dualsense|ps5 controller|playstation 5 controller|playstation controller', 'oplader|oplaadstation|laadstation|houder|skin|lader|grip|thumb|kabel|standaard', 40, 250),
        B('PS5-spellen', 'ps5|playstation 5', 'console|controller|dualsense|headset|oplaad|laadstation|standaard|skin|hoes|kabel|portal|vr2|faceplate|cover|grip|thumb|batterij|ventilator|koeler|disc drive|schijfstation|gift card|cadeaukaart|tegoed|psn|stand ', 10, 100),
        B('PlayStation VR2', 'playstation vr2|psvr2|ps vr2|vr2', '', 30, 700),
        B('PS5-headsets & accessoires', 'ps5|playstation 5|dualsense|playstation portal|pulse 3d|pulse elite|pulse explore', 'console', 10, 300, ook='headset|oplaad|laadstation|standaard|portal|pulse|hoes|tas|cover|faceplate|kabel|koptelefoon|stand'),
    ], niet=GAME_NIET),
    P('Nintendo Switch 2', [
        B('Switch 2-consoles', 'nintendo switch 2', 'game |spel |controller|joy-con', 380, 700),
        B('Switch 2-controllers', 'switch 2', 'oplader|laadstation|houder|grip|hoes|tas|case|console', 20, 120, ook='controller|joy-con|joycon'),
        B('Switch 2-spellen', 'switch 2', SW_NIET + '|mexx|maat |schoen|lichtschakelaar|schakelaar', 10, 100),
        B('Switch 2-accessoires', 'switch 2', 'mexx|maat |schoen|lichtschakelaar|schakelaar|console', 5, 150, ook=SW_OOK),
    ], niet=GAME_NIET),
    P('Nintendo Switch', [
        B('Switch-consoles', 'nintendo switch|switch oled|switch lite', 'switch 2|hoes|case|tas|game |screenprotector|controller|joy-con|dock', 150, 450, ook='oled|lite|console'),
        B('Switch-controllers', 'joy-con|joycon|switch pro controller|nintendo switch controller|switch controller', 'switch 2|oplader|laadstation|houder|grip|hoes', 15, 100),
        B('Switch-spellen', 'nintendo switch', 'switch 2|oled|lite|' + SW_NIET, 10, 90),
        B('Switch-accessoires', 'nintendo switch|switch oled|switch lite', 'switch 2', 5, 90, ook=SW_OOK),
    ], niet=GAME_NIET),
    P('Xbox', [
        B('Xbox-consoles', 'xbox series x|xbox series s', 'controller|game |headset|hoes|harde schijf|opslag|expansion|kabel|standaard|stand |thrustmaster|yoke|collector|edition|pack', 250, 800, ook='console|1tb|1 tb|512gb|512 gb|2tb|2 tb|digital|bundel'),
        B('Xbox-controllers', 'xbox controller|xbox wireless controller|xbox elite|xbox series controller|xbox draadloze controller', 'oplader|laadstation|houder|grip|skin|batterij', 30, 220),
        B('Xbox-spellen', 'xbox', 'console|controller|headset|oplaad|laadstation|batterij|hoes|kabel|standaard|harde schijf|opslag|expansion|game pass|tegoed|kaart|card|grip|skin|stuur|wheel', 10, 90),
        B('Xbox-accessoires', 'xbox', 'console', 5, 250, ook='headset|oplaad|laadstation|game pass|batterij|harde schijf|expansion|standaard|opberg|stuur|wheel'),
    ], niet=GAME_NIET),
    P('Retro & handheld', [
        B('Retroconsoles', 'retro console|snes mini|nes classic|atari|sega mega drive|retro spelcomputer|game console retro|evercade|8bitdo|game stick|gamestick|mini console|retro game'),
        B('Handhelds', 'handheld console|draagbare spelcomputer|anbernic|steam deck|game boy|retro handheld|handheld game|rog ally|legion go'),
        B('Arcadekasten & mini-arcade', 'arcadekast|arcade kast|mini arcade|arcade machine|arcade1up|bartop|arcade cabinet|arcade spel|arcadespel'),
        B('Spelletjes in je hand', 'tamagotchi|bitzee|keychain game|sleutelhanger game|tetris handheld|digipet|virtueel huisdier'),
    ], mn=10, mx=600),
    P('Gaming-accessoires', [
        B('Gaming-headsets', 'gaming headset|gaming-headset|game headset|gamingheadset'),
        B('Gaming-muizen', 'gaming muis|gaming-muis|gamingmuis|gaming mouse'),
        B('Gaming-toetsenborden', 'gaming toetsenbord|mechanisch toetsenbord|gaming keyboard|mechanical keyboard'),
        B('Gamestoelen', 'gamestoel|gaming stoel|gamingstoel|game stoel|gaming chair'),
        B('Racesturen', 'racestuur|race stuur|racing wheel|logitech g29|logitech g920|thrustmaster|moza|fanatec'),
        B('Streaming & opname', 'streaming microfoon|elgato|stream deck|capture card|gaming microfoon|usb microfoon'),
        B('Muismatten & bureau', 'muismat xxl|gaming muismat|deskmat|desk mat|gaming bureau'),
    ], mn=10, mx=500),
    P('Pokémon-kaarten', [
        B('Boosterpakjes', 'pokemon', 'display|booster box|boosterbox|bundle|bundel|elite trainer|tin |collection|collectie|blister|pencil|etui|case|3-pack|3 pack|premium|36 booster|18 booster', 3, 12, ook='booster'),
        B('Boosterbundels & blisters', 'pokemon', 'display|elite trainer|booster box|boosterbox', 8, 70, ook='booster bundle|booster bundel|blister|3-pack|3 pack|checklane|sleeved'),
        B('Elite Trainer Boxes', 'elite trainer', '', 25, 200),
        B('Tins & collecties', 'pokemon', 'elite trainer|opbergbox|lunchbox|display|booster box|boosterbox|binder|map |sleeves|deck box|sorteer|opbergdoos|toploader|knuffel|pluche|figuur', 10, 200, ook='tin|collection|collectie|premium|box'),
        B('Boosterdozen voor verzamelaars', 'pokemon', '', 80, 1500, ook='booster box|boosterbox|booster display|display'),
        B('Kaartmappen & sleeves', 'pokemon|ultra pro|ultra-pro|dragon shield', 'landkaart|wandkaart', 3, 80, ook='map|binder|portfolio|sleeves|deck box|deckbox|album|toploader|verzamelmap'),
        B('Japanse kaarten', 'pokemon', '', 3, 300, ook='japans|japanese|japan |jpn'),
    ]),
    P('Pokémon-cadeaus', [
        B('Pokémon-knuffels', PK, '', 5, 120, ook='knuffel|pluche|plush|squishmallow|squishy'),
        B('Pokémon-figuren & bouwen', PK, 'knuffel|pluche|plush', 5, 150, ook='figuur|figure|figuren|funko|mega construx|bouwset|bouwpakket|battle|select|clip n go|clip \'n\' go|poke ball|pokeball'),
        B('Pokémon-games', PK, 'hoes|case|tas |controller|knuffel|figuur|t-shirt|mok', 20, 90, ook='switch|game|nintendo'),
        B('Pokémon-kleding & tassen', PK, '', 8, 120, ook='rugzak|tas |tasje|pet |trui|t-shirt|hoodie|pyjama|portemonnee|sokken|muts|sjaal|onesie|sweater|badjas|cap '),
        B('Pokémon-mokken & drinkflessen', PK, '', 5, 60, ook='mok|beker|drinkfles|lunchbox|glas|bord |servies|bento'),
        B('Pokémon voor je kamer', PK, '', 5, 150, ook='lamp|lampje|poster|wekker|dekbed|kussen|klok|deken|plaid|nachtlamp|vloerkleed|wandkleed|lichtje'),
        B('Pokémon-spellen & school', PK, 'game|switch|knuffel', 5, 60, ook='puzzel|spel |monopoly|uno |cluedo|etui|schrift|pen |kleurboek|sticker|boek'),
    ], niet='booster|elite trainer|tcg|trading card|ruilkaart|verzamelkaart'),
    P('Hello Kitty', [
        B('Hello Kitty-knuffels', HK, 'rugzak|loungefly|tas |tasje|sleutelhanger', ook='knuffel|pluche|plush|squishmallow|squishy'),
        B('Hello Kitty-figuren', HK, 'knuffel|pluche|plush', ook='funko|figuur|figure|blind box|blindbox|vinyl|miniverse|bitty pop|verrassing|mini figure'),
        B('Hello Kitty-tassen', HK, '', ook='tas |tasje|rugzak|portemonnee|sleutelhanger|etui|toilettas|handtas|tashanger|bag|backpack'),
        B('Hello Kitty-sieraden', HK, 'sleutelhanger|tashanger', ook='ketting|armband|oorbel|oorsteker|ring |sieraad|bedel|charm'),
        B('Hello Kitty-mokken & lunch', HK, '', ook='mok|beker|lunchbox|drinkfles|bord |servies|bento|kom '),
        B('Hello Kitty voor je kamer', HK, '', ook='lamp|poster|kussen|deken|plaid|klok|wekker|dekbed|spiegel|nachtlamp|vloerkleed|lichtje'),
        B('Hello Kitty-beauty', HK, '', ook='make-up|makeup|nagellak|lipgloss|lip balm|lippenbalsem|nagel|beauty|haarborstel|haarclip|haarspeld|badbruis|douchegel|parfum|bodylotion|handcreme|spiegeltje'),
        B('Hello Kitty-kleding', HK, '', ook='pyjama|trui|t-shirt|hoodie|sweater|sokken|onesie|badjas|pantoffel|slof'),
    ], mn=3, mx=150),
    P('Anime & manga', [
        B('One Piece', 'one piece', 'bikini|badpak|jumpsuit|onesie|one-piece'),
        B('Naruto', 'naruto'), B('Dragon Ball', 'dragon ball'), B('Demon Slayer', 'demon slayer'),
        B('Jujutsu Kaisen', 'jujutsu kaisen'), B('Studio Ghibli', 'ghibli|totoro|spirited away|kiki\'s|no face|howl'),
        B('Manga-boeken', 'manga', 'mangaan|faber|marker|academy|style|xoomy|stift|teken|drawing|kleurboek|poster|mango'),
        B('Andere anime', 'my hero academia|attack on titan|chainsaw man|spy x family|frieren|bleach|hunter x hunter|sailor moon|solo leveling|haikyu|blue lock'),
    ], mn=3, mx=200),
    P('KPop Demon Hunters', [
        B('KPop-poppen & figuren', KP, 'knuffel|pluche|t-shirt|cd |vinyl|soundtrack', ook=' pop|doll|figuur|figure|funko|pocket pop|zingende|speelfiguur'),
        B('KPop-knuffels & speelgoed', KP, '', ook='knuffel|pluche|plush|squishmallow|lego|spel|puzzel|bitzee| uno|uno |squishy|speelgoed'),
        B('KPop-tassen & school', KP, '', ook='tas|rugzak|etui|stift|schrift|dagboek|pen |sleutelhanger|tashanger|lunchbox|drinkfles'),
        B('KPop-kleding, mokken & muziek', KP, '', ook='t-shirt|hoodie|trui|mok|beker|kop |cd |vinyl|lp |soundtrack|poster|pyjama'),
    ], mn=3, mx=100),
    P('Films, series & games', [
        B('Harry Potter', 'harry potter|zweinstein|hogwarts|griffoendor|zwadderich'),
        B('Star Wars', 'star wars|mandalorian|grogu|darth vader|yoda'),
        B('Marvel & DC', 'marvel|spider-man|spiderman|avengers|batman|superman|deadpool'),
        B('Disney & Stitch', 'stitch|disney|frozen|mickey|minnie', 'stitchen|cross stitch|borduur'),
        B('Minecraft', 'minecraft'), B('Super Mario & Nintendo', 'super mario|mario kart|zelda|kirby|donkey kong|luigi'),
        B('Lord of the Rings', 'lord of the rings|lotr|in de ban van de ring|hobbit'),
        B('Stranger Things & Wednesday', 'stranger things|wednesday addams|wednesday'),
        B('Friends & sitcoms', 'friends central perk|friends tv|central perk|the office|simpsons'),
        B('Funko Pops', 'funko pop|funko pocket pop|funko bitty pop|funko', 'sleutelhanger los|display case|opbergdoos|beschermdoos|protector'),
    ], mn=5, mx=200, niet='lego'),
])

# ---------------------------------------------------------------- 4 KNUS & SFEER
LAMP_NIET = 'horloge|wekker|lampenkap|gloeilamp|e27|e14|gu10|fietslamp|zaklamp|hoofdlamp|werklamp|plafondlamp|kroonluchter|buitenlamp|grondspot|inbouwspot|tl-buis|lichtbron|dimmer|koplamp|achterlicht|hanglamp|vloerlamp|wandlamp buiten'
LOOK = 'lamp|lampje|nachtlamp|light|licht |lichtje|neon|lantaarn|lantern|projector'
C('Knus & sfeer', [
    P('Lampjes', [
        B('Nachtlampjes', 'nachtlamp|nachtlampje|nachtlicht|night light'),
        B('Maanlampen', 'maanlamp|moon lamp|maan lamp|maanlampje|3d maan|moonlight lamp|lamp maan|maan nachtlamp|planeetlamp|planeet lamp|zonnestelsel lamp'),
        B('Lavalampen', 'lavalamp|lava lamp|glitterlamp|kwallenlamp|jellyfish lamp'),
        B('Sterrenprojectors', 'sterrenprojector|galaxy projector|sterrenhemel projector|star projector|nebula projector|galaxy lamp'),
        B('Zoutlampen', 'zoutlamp|himalaya zout|salt lamp'),
        B('Plasmabollen & bewegend licht', 'plasmabol|plasma bal|plasmalamp|plasma lamp|plasma ball|zandlamp|sandscape|golflamp|bewegend zand|zandschilderij|zandkunst|ocean wave|waterlamp|regenlamp|levitatie', 'tv|televisie|luchtfilter'),
        B('Figuurlampjes', 'figuurlamp|figuurlampje|boxlamp|icon light|icon lamp|paddenstoellamp|wolkenlamp|smiley lamp|tulpenlamp|eendlamp|eend lamp|dierenlamp', 'minecraft|mario|pokemon|harry potter|star wars|disney|stitch|marvel|zelda|playstation|xbox'),
        B('Wake-up lights', 'wake-up light|wake up light|wake-up-light|wakeup light|wekkerlamp|daglichtwekker|lichtwekker|sunrise alarm|slaaptrainer|sleep & wake|ok to wake'),
        B('Lampen met naam of foto', 'lamp|nachtlamp|lampje|lichtbak', '', ook='met naam|met foto|met eigen|naamlamp|gepersonaliseerd|met tekst|eigen foto|eigen tekst|spotify'),
        B('Design- en tafellampjes', 'tafellamp|bureaulamp design|sfeerlamp|oplaadbare tafellamp|paddenstoel lamp|lampje oplaadbaar', 'werklamp|minecraft|mario|pokemon'),
    ], mn=5, mx=150, niet=LAMP_NIET),
    P('Lampen van games & films', [
        B('Minecraft-lampjes', 'minecraft', ook=LOOK),
        B('Super Mario-lampen', 'super mario|mario kart|vraagtekenblok|question block|luigi|bowser|yoshi|nintendo', ook=LOOK),
        B('Pokémon-lampen', 'pokemon|pikachu|poke ball|pokeball|eevee|gengar', ook=LOOK),
        B('Zelda-lampen', 'zelda|triforce|hylian|master sword', ook=LOOK),
        B('PlayStation & Xbox-lampen', 'playstation|xbox|game controller|gamecontroller|game over|gamer', ook=LOOK),
        B('Harry Potter-lampen', 'harry potter|hedwig|snaai|zweinstein|hogwarts|patronus|platform 9', ook=LOOK),
        B('Star Wars-lampen', 'star wars|lightsaber|lichtzwaard|death star|darth vader|grogu|mandalorian|yoda', ook=LOOK),
        B('Disney & Stitch-lampen', 'stitch|disney|frozen|lilo|mickey|minnie|winnie', 'stitchen|cross stitch', ook=LOOK),
        B('Marvel & DC-lampen', 'marvel|batman|spider-man|spiderman|avengers|iron man|captain america|superman', ook=LOOK),
        B('Anime-lampen', 'one piece|naruto|dragon ball|anime|demon slayer|totoro|ghibli', ook=LOOK),
    ], mn=5, mx=150, niet=LAMP_NIET),
    P('Lichtsnoeren & neon', [
        B('Lichtsnoeren', 'lichtsnoer|lichtslinger|lichtjessnoer|fairy lights|led slinger', 'kerst|buiten 50 m|tuinverlichting'),
        B('Cotton ball lights', 'cotton ball|cottonball|katoenen bol|katoen bol|katoenen bal', '', ook='licht|lamp|snoer|led|slinger'),
        B('Fotosnoeren met knijpers', 'knijper|fotoclip|foto clip|fotoslinger|fotosnoer|foto snoer|foto lichtsnoer|polaroid slinger', 'wasknijper|was knijper|wasspelden|mini knijpertjes|knijpertjes - 50', ook='led|licht|lampjes|snoer|slinger'),
        B('Neonlampen', 'neonlamp|neon lamp|neon light|neon led|neon bord|neon sign', 'neon geel|neon roze|neonkleur'),
        B('Lichtborden & letterbakken', 'lichtbord|lightbox|letterbak|letterbord|led bord|ledbord'),
        B('Led-strips voor de kamer', 'led strip|ledstrip|led-strip', 'auto|vervang'),
    ], mn=4, mx=150),
    P('Kaarsen & geur', [
        B('Geurkaarsen', 'geurkaars|scented candle|kaars in glas|kaars in pot'),
        B('Geurstokjes & huisparfum', 'geurstokjes|diffuser|huisparfum|roomspray|room spray|interieurparfum', 'navulling|refill|auto'),
        B('Grappige kaarsen', 'kaars in de vorm|vormkaars|figuurkaars|grappige kaars|kaars bier|kaars kaas|kaars eten'),
        B('Kaarsen met tekst', 'kaars|kaarsen', 'kaarsenhouder|kandelaar|lantaarn|kaarsenstandaard|windlicht', ook='met tekst|met naam|met foto|met spreuk|met je eigen|gepersonaliseerd|bedrukt|eigen tekst|eigen foto|met quote|cijferkaars|happy birthday'),
        B('Kandelaars & windlichten', 'kandelaar|windlicht|kaarsenhouder|theelichthouder|kaarshouder'),
        B('Lantaarns', 'lantaarn|lantaarntje|lantern', 'zaklamp|camping|kampeer'),
        B('Wierook & geurbranders', 'wierook|geurbrander|incense|backflow'),
        B('Wax melts & aromadiffusers', 'wax melt|waxmelt|aroma diffuser|aromadiffuser|etherische olie|geurolie'),
    ], mn=4, mx=120),
    P('Pantoffels & sloffen', [
        B('Dierensloffen', 'dierenslof|dierensloffen|dieren pantoffel|knuffelslof|pantoffel dier|sloffen dier|axolotl slof|eenhoorn slof'),
        B('Magnetronsloffen', 'magnetronslof|magnetron slof|hot feet|warmteslof|verwarmde slof|opwarmbare slof'),
        B('Grappige pantoffels', 'pantoffel|slof|sloffen|slippers', 'babyslof|baby slof|inlegzool|teenslipper|badslipper|zwembad', ook='grappig|gek|popcorn|voor twee|pizza|avocado|banaan|haai|frietjes|friet|taco|sushi|donut|hamburger|bier|wortel|kip |tenen|monster|ufo|pluche|knuffel'),
        B('Pantoffels voor dames', 'pantoffels dames|dames pantoffel|damespantoffel|dames slof|sloffen dames'),
        B('Pantoffels voor heren', 'pantoffels heren|heren pantoffel|herenpantoffel|heren slof|sloffen heren'),
        B('Kinderpantoffels', 'pantoffel|slof|sloffen', 'babyslof|baby slof|dames|heren|volwassen', ook='kind|kinder|jongen|meisje|kids|junior|peuter'),
        B('Huissokken', 'huissok|huissokken|anti-slip sok|bedsok|bedsokken'),
        B('Babyslofjes', 'babyslof|baby slof|slofjes baby|babyslofjes'),
    ], mn=5, mx=90),
    P('Plaids, kruiken & warmte', [
        B('Plaids', 'plaid|fleecedeken|fleece deken|knuffeldeken|sherpa deken|teddy deken|gebreide deken', 'paard|hond|kat|isolatie|brandwerend'),
        B('Hoodie-dekens', 'hoodie deken|hoodie-deken|deken met mouwen|draagbare deken|oversized hoodie|snuggle'),
        B('Elektrische dekens', 'elektrische deken|verwarmde deken|warmtedeken|elektrische onderdeken|heated blanket'),
        B('Kruiken', 'kruik', 'hoes los'),
        B('Warmteknuffels', 'warmteknuffel|magnetronknuffel|warmies|cozy plush|warm knuffel'),
        B('Warmtekussens', 'warmtekussen|nekwarmer|magnetronkussen|kersenpitkussen|warmtekraag'),
        B('Handwarmers & voetenwarmers', 'handwarmer|hand warmer|voetenwarmer|voetwarmer|oplaadbare handwarmer'),
    ], mn=5, mx=150),
    P('Badjassen & pyjama\'s', [
        B('Badjassen voor dames', 'badjas dames|dames badjas|damesbadjas|ochtendjas dames|kimono dames|badjas vrouw'),
        B('Badjassen voor heren', 'badjas heren|heren badjas|herenbadjas|ochtendjas heren|badjas man'),
        B('Kinderbadjassen', 'kinderbadjas|badjas kind|badcape|badponcho|badjas met capuchon kind'),
        B('Onesies', 'onesie|jumpsuit huis|huispak|kigurumi'),
        B('Pyjama\'s', 'pyjama', 'pyjamazak|slaapzak'),
        B('Kerstpyjama\'s', 'pyjama|onesie|huispak|jumpsuit', 'pyjamazak|slaapzak', ook='kerst|christmas|xmas|rendier|elf |sneeuwpop|kerstman|grinch|winter'),
    ], mn=10, mx=150),
    P('Truien, sokken & mutsen', [
        B('Foute kersttruien', 'kersttrui|foute trui|christmas sweater|ugly sweater|kerst trui'),
        B('Hoodies & truien met print', 'hoodie met print|trui met print|grappige trui|sweater met tekst|hoodie met tekst'),
        B('Cadeausokken', 'happy socks|sokken cadeau|sokken in een|sokken giftbox|sokken in blik|sokken geschenk'),
        B('Grappige sokken', 'sokken|sok |sokjes', 'sokkenlade|sokkenhouder|steunkous|compressie|huissok|sokkenbol|sportsok|werksok|wandelsok|ski-sok|skisok', ook='grappig|tekst|print|foto|gek|bier|pizza|wijn|avocado|vis |kat |hond|happy socks|cadeau|giftbox|blik|frietjes|taco|sushi|donut|kerst|stripes|cartoon'),
        B('T-shirts met print', 't-shirt met print|grappig t-shirt|t-shirt met tekst|t-shirt met foto'),
        B('Mutsen & sjaals', 'muts|sjaal|beanie|colsjaal|pompon muts', 'mutsen kind los|helm'),
        B('Handschoenen & wanten', 'handschoenen|wanten|touchscreen handschoen', 'werkhandschoen|tuinhandschoen|wegwerp|nitril|latex'),
    ], mn=5, mx=100),
])

# ---------------------------------------------------------------- 5 VERWENNEN
C('Verwennen', [
    P('Parfum', [
        B('Damesparfum', 'eau de parfum dames|damesparfum|parfum voor vrouwen|eau de parfum women|eau de parfum for her|pour femme'),
        B('Herenparfum', 'herenparfum|eau de toilette heren|parfum voor mannen|pour homme|eau de parfum men|for him'),
        B('Parfumsets', 'parfumset|parfum set|parfum giftset|geschenkset parfum|eau de parfum set|coffret'),
        B('Miniaturen & proefsets', 'parfum miniatuur|miniaturen set|discovery set|proefset parfum|reisformaat parfum|parfum mini'),
        B('Bodymist', 'body mist|bodymist|haarparfum|hair mist'),
    ], mn=10, mx=250, niet='tester|testers|zonder doos|navulling|refill'),
    P('Verzorgingssets', [
        B('Giftsets voor haar', 'giftset dames|giftset voor haar|cadeauset dames|geschenkset dames|beauty set|verzorgingsset vrouw', 'heren|men|baard'),
        B('Giftsets voor hem', 'giftset heren|giftset voor hem|cadeauset heren|geschenkset heren|verzorgingsset man|men set', 'dames|women'),
        B('Beauty-adventskalenders', 'adventskalender|advent calendar|adventkalender', 'chocolade|lego|playmobil|speelgoed|thee|bier|wijn|gin |snoep|funko|pokemon|hot wheels|kinder', ook='beauty|make-up|makeup|verzorging|skincare|parfum|nagel|bath|bad |body|cosmetica|lush|rituals|nivea|essence|catrice|douglas|sol de janeiro|yves rocher|kiko|loreal|l\'oreal|garnier|the body shop|douche|lip'),
        B('Handverzorging', 'handcrème|handcreme|hand cream|handzeep set|handverzorging'),
        B('Lichaamsverzorging', 'bodylotion|body lotion|bodyscrub|body scrub|body butter|douchegel set|douche set'),
        B('Gezichtsverzorging', 'gezichtscrème|gezichtscreme|serum|gezichtsmasker|skincare set|gezichtsverzorging set'),
        B('Lipverzorging', 'lippenbalsem|lip balm|lipverzorging|lip oil|lipolie'),
    ], mn=5, mx=200),
    P('Bad, spa & massage', [
        B('Bruisballen', 'bruisbal|bath bomb|badbruis|badbom'),
        B('Badzout & badolie', 'badzout|badolie|badmelk|bath salt|badparels|badschuim'),
        B('Spa- en verwenpakketten', 'verwenpakket|spa pakket|spa set|wellness set|wellness pakket|pamper box|verwenbox|spa box'),
        B('Massageapparaten', 'massagekussen|massage apparaat|massagepistool|massage gun|nekmassage|voetmassage|shiatsu'),
        B('Voetverzorging & voetbaden', 'voetbad|voetverzorging|voetcrème|voetmasker|voetenbad'),
        B('Slaap & ontspanning', 'slaapmasker|kussenspray|slaap spray|ontspanningsset|slaapset|pillow spray'),
    ], mn=4, mx=200),
    P('Make-up & haar', [
        B('Make-upsets', 'make-up set|make up set|makeupset|make-upset|oogschaduw palet|eyeshadow palette'),
        B('Lippen', 'lipstick|lipgloss|lip gloss|lippenstift|lip liner'),
        B('Make-upkwasten & spiegels', 'make-up kwast|kwastenset|make up brush|make-up spiegel|spiegel met verlichting'),
        B('Nagels', 'nagellak|nagelset|nagellakset|gellak set|nail art|nageldroger'),
        B('Haarverzorging', 'haarolie|haarmasker|haarverzorging set|shampoo set|hair oil|haarserum'),
        B('Haarborstels & kammen', 'haarborstel|ontwarborstel|tangle teezer|mason pearson|kam set'),
        B('Haaraccessoires', 'haarklem|scrunchie|haarband|haarspeld|claw clip|haaraccessoires'),
        B('Make-uptassen & toilettassen', 'make-up tas|make up tas|toilettas|beauty case|cosmetic bag'),
    ], mn=4, mx=150),
    P('Scheren & baard', [
        B('Baardolie & baardsets', 'baardolie|baard olie|baardset|baard set|baardbalsem|beard oil|baardverzorging'),
        B('Scheersets & scheerzeep', 'scheerset|scheerzeep|scheercrème|scheerschuim set|scheer set|shaving set'),
        B('Scheerkwasten & scheermessen', 'scheerkwast|safety razor|scheermes|double edge|klassiek scheren'),
        B('Aftershave', 'aftershave|after shave'),
    ], mn=5, mx=150),
])

# ---------------------------------------------------------------- 6 ETEN & DRINKEN
C('Eten & drinken', [
    P('Chocolade & snoep', [
        B('Chocoladecadeaus', 'chocolade|bonbon|tony\'s|lindt|neuhaus|leonidas|godiva|truffels', 'fontein|smelter|fondue|chocoladeletter|vorm |mal |siliconen|koekjes|melk |chocolademelk|eiwit|proteine|reep 100 g', ook='cadeau|giftbox|gift box|geschenk|telegram|met tekst|met naam|doos|box|assortiment|selectie|proeverij|pakket|blik'),
        B('Bonbons & truffels', 'bonbons|bonbon|truffels chocolade|pralines|neuhaus|leonidas|godiva|lindt'),
        B('Tony\'s Chocolonely', 'tony\'s chocolonely|tonys chocolonely|tony chocolonely'),
        B('Chocoladeletters', 'chocoladeletter|chocolade letter'),
        B('Snoepboxen & snoep', 'snoepbox|snoeppakket|snoep cadeau|snoeptaart|snoepjes box|candy box|snoeppot'),
        B('Drop', 'drop ', 'dropshipping|druppel|dropper|drop-in|backdrop'),
        B('Snoep met een boodschap', 'snoep met tekst|droptelegram|snoep telegram|snoep met boodschap|het spijt me|beterschap snoep'),
        B('Marsepein & Sinterklaaslekkers', 'marsepein|kruidnoten|pepernoten|speculaas|banketstaaf|taaitaai'),
    ], mn=3, mx=80),
    P('Koek & stroopwafels', [
        B('Stroopwafels', 'stroopwafel'),
        B('Koekjes & koektrommels', 'koekjes cadeau|koektrommel|koekjesblik|koekjes giftbox|boterkoek|koekjes in blik|cookies box'),
        B('Taart & gebak per post', 'taart door de brievenbus|brievenbustaart|taart bezorgen|cake cadeau|brownies|brievenbus brownie'),
        B('Kerst- en feestlekkers', 'kerststol|kerstkransje|kerstkoek|panettone|stollen'),
    ], mn=3, mx=60),
    P('Koffie & thee', [
        B('Koffie', 'koffiebonen|koffie cadeau|koffiepakket|koffie proeverij|speciality coffee|koffie giftbox|koffiebox'),
        B('Thee', 'theedoos|thee cadeau|theepakket|theebox|thee proeverij|losse thee|theezakjes cadeau|thee giftbox'),
        B('Warme chocolademelk', 'warme chocolademelk|hot chocolate|chocolademelk cadeau|chocolate bomb|chocomel cadeau'),
        B('Koffie- en theepakketten met mok', 'koffie|thee', 'koffiezetapparaat|waterkoker|machine|bonen 1 kg', ook='met mok|met beker|pakket|cadeau|giftbox|gift box|geschenk|proeverij|proefpakket|cadeauset|kistje|selectie'),
    ], mn=4, mx=80),
    P('Delicatessen', [
        B('Kaas', 'kaas', 'kaasschaaf|kaasmes|kaasplank|kaasrasp|fondue|raclette|kaasstolp|kaasvorm|ham|chips|saus|kaaskop|kostuum|muts', ook='pakket|cadeau|proeverij|proefpakket|box|kist|geschenk|selectie|wiel|stolp'),
        B('Worst & vleeswaren', 'worst cadeau|worstenpakket|droge worst|chorizo|salami|ham pakket|vleespakket'),
        B('Sauzen & BBQ-rubs', 'hot sauce|hete saus|bbq saus|bbq rub|sauzenpakket|chilisaus|sauzen set|barbecuesaus'),
        B('Truffel', 'truffel', 'chocolade truffel|truffels chocolade|bonbon'),
        B('Olijfolie & azijn', 'olijfolie|balsamico|olijfolie cadeau|olijfolie proeverij'),
        B('Honing & jam', 'honing|jam cadeau|confiture|lemon curd|curd'),
        B('Noten & zoutjes', 'notenmix|noten cadeau|cashew|pistache|borrelnootjes|nootjes'),
        B('Kruiden & specerijen', 'kruidenset|specerijen set|kruiden cadeau|kruidenmix|specerijen'),
    ], mn=3, mx=80),
    P('Cadeaupakketten & brievenbus', [
        B('Cadeaupakketten', 'cadeaupakket|cadeau pakket|geschenkpakket|giftbox|gift box|cadeaubox|cadeaumand|geschenkmand'),
        B('Brievenbuscadeaus', 'brievenbuscadeau|brievenbus cadeau|brievenbuspakket|door de brievenbus|brievenbusdoos'),
        B('Bloemen per post', 'bloemen door de brievenbus|brievenbusbloemen|bloemen bezorgen|boeket|rozen per post|tulpen per post'),
        B('Droogbloemen & eeuwige rozen', 'droogbloemen|gedroogde bloemen|eeuwige roos|longlife roos|roos in glas|forever rose'),
        B('Kerstpakketten', 'kerstpakket|kerstbox|kerst pakket|kerstmand'),
        B('Borrelpakketten', 'borrelpakket|borrel pakket|borrelbox|apero box|tapas pakket'),
    ], mn=5, mx=150),
    P('Wijn & bubbels', [
        B('Rode wijn', 'rode wijn|rioja|bordeaux|primitivo|malbec|merlot|cabernet|chianti|amarone|pinot noir', 'pullover|trui|shirt|jurk|broek|sok|tas |schoen|jas |sjaal|muts|verf|kleur bordeaux|bordeauxrood|bordeaux rood|velours|fluweel|kussen|plaid|deken|handdoek'),
        B('Witte wijn', 'witte wijn|chardonnay|sauvignon blanc|pinot grigio|riesling|verdejo|chablis'),
        B('Rosé', 'rosé|rose|rosado|rosato', 'rosegoud|rosé goud|rose gold|roségoud|rosékleurig|rose kleur|kleur rose|cardigan|coat|longsleeve|sweater|paraplu|scrub|cubes|steamer|shower|douche|prosecco|glas|ketting|armband|horloge|ring|oorbel|jurk|shirt|tas|schoen|verf|bloem|plant|kaars|mok|vaas|bril|parfum|eau de|hipster|slip|boxer|pink|roze', ook='wijn|0.75|75 cl|75cl|igp|aoc|doc |dop |provence|cotes|brut|cava|vol%|% vol|vino|vin |wine'),
        B('Champagne', 'champagne', 'champagneglas|champagneglazen|champagnekoeler'),
        B('Prosecco & cava', 'prosecco|cava|crémant|cremant|mousserende wijn', 'proseccoglas|sokken'),
        B('Port & dessertwijn', 'portwijn|port wijn|tawny|ruby port|white port|lbv|vintage port|dessertwijn|sherry|madeira|moscatel|pedro ximenez|tokaji|sauternes', 'sport|transport|support|deport|passport|import|export|portemonnee|portret|portier|portable'),
        B('Wijnpakketten', 'wijnpakket|wijn cadeau|wijnkist|wijn met glazen|wijn giftbox|wijnproeverij'),
    ], mn=8, mx=200, niet='wijnglas|wijnglazen|wijnrek|wijnkoeler|wijnopener|kurkentrekker'),
    P('Bier & sterke drank', [
        B('Bierpakketten', 'bierpakket|bier pakket|bierbox|bier cadeau|bierproeverij|speciaalbier pakket'),
        B('Speciaalbier', 'speciaalbier|trappist|ipa bier|tripel|dubbel bier|bockbier'),
        B('Whisky', 'whisky|whiskey|bourbon|single malt|scotch', 'whiskyglas|whiskyglazen|whisky stenen|whiskystones|karaf'),
        B('Gin', ' gin |gin tonic pakket|gin giftset|gin pakket|london dry', 'ginger|ginseng'),
        B('Rum', ' rum |rum giftset|spiced rum', 'rumrozijn'),
        B('Cognac & brandy', 'cognac|brandy|armagnac|calvados'),
        B('Wodka & tequila', 'wodka|vodka|tequila|mezcal'),
        B('Likeur', 'likeur|limoncello|amaretto|baileys|jägermeister|jagermeister|advocaat'),
    ], mn=10, mx=250, niet='glas|glazen|karaf|kaars|mok|sokken|parfum'),
    P('Alcoholvrij', [
        B('Alcoholvrije wijn & bubbels', 'alcoholvrije wijn|alcoholvrij wijn|0.0 wijn|alcoholvrije bubbels|alcoholvrije prosecco|alcoholvrije champagne'),
        B('Alcoholvrij bier', 'alcoholvrij|alcoholvrije|0.0|0,0%|0.0%|alcohol-free|non-alcoholic', 'wijn|gin |rum|whisky|mocktail|siroop|frisdrank|thee', ook='bier|beer|pils|ipa |weizen|tripel|blond'),
        B('Alcoholvrije gin & mocktails', 'alcoholvrije gin|mocktail|alcoholvrije cocktail|0.0 gin|alcoholvrije spirit'),
        B('Siropen & limonades', 'siroop|limonadesiroop|cocktailsiroop|limonade cadeau'),
    ], mn=4, mx=80),
])

# ---------------------------------------------------------------- 7 SIERADEN & ACCESSOIRES
SIER_NIET = 'hondenhalsband|sleutelring los|bedelarmband hond|piercing|navelpiercing|tongpiercing'
C('Sieraden & accessoires', [
    P('Oorbellen', [
        B('Oorknopjes', 'oorknop|oorstekers|studs|oorknopjes'),
        B('Oorringen', 'oorringen|oorring|creolen|hoops'),
        B('Oorhangers', 'oorhangers|oorhanger|oorbellen hanger|statement oorbellen'),
        B('Kinderoorbellen', 'oorbel|oorbellen|oorknop|oorstekers|oorsteker', 'volwassen|dames 18', ook='kind|meisje|meiden|kids|junior|eenhoorn|vlinder|kinderen'),
    ], mn=8, mx=300, niet=SIER_NIET),
    P('Ringen', [
        B('Ringen voor dames', 'ring dames|damesring|zilveren ring|gouden ring|ring met steen|stapelring|aanschuifring'),
        B('Ringen voor heren', 'herenring|heren ring|ring heren|zegelring|wolfraam ring|stalen ring heren'),
        B('Ringen met naam of afdruk', 'ring met naam|ring graveren|ring met vingerafdruk|ring met afdruk|naamring'),
    ], mn=10, mx=500, niet=SIER_NIET + '|ringband|ringmap|ringbinder|sleutelring|ringlamp|ring light|deurbel'),
    P('Kettingen', [
        B('Kettingen met hanger', 'ketting met hanger|hanger ketting|collier|ketting dames|zilveren ketting|gouden ketting'),
        B('Kettingen met naam', 'ketting met naam|naamketting|naam ketting|ketting graveren|ketting met letter|initiaal ketting'),
        B('Medaillons', 'medaillon|fotomedaillon|locket'),
        B('Kettingen voor heren', 'herenketting|heren ketting|ketting heren|schakelketting heren'),
        B('Kettingen met kruis', 'ketting met kruis|kruisje ketting|kruis hanger|kruisketting'),
    ], mn=8, mx=500, niet=SIER_NIET + '|fietsketting|sneeuwketting|hondenketting|sleutelketting'),
    P('Armbanden & bedels', [
        B('Armbanden voor dames', 'armband dames|damesarmband|zilveren armband|gouden armband|schakelarmband|bangle'),
        B('Armbanden voor heren', 'herenarmband|heren armband|armband heren|leren armband heren|kralenarmband heren'),
        B('Bedels & bedelarmbanden', 'bedel|bedelarmband| charm |charms|pandora', 'charmander|mega construx|game|ps5|xbox|playstation|switch'),
        B('Armbanden met naam', 'armband met naam|naamarmband|armband graveren|armband met tekst'),
        B('Sieradendozen', 'sieradendoos|sieradenkistje|sieradenbox|sieradenhouder|juwelendoos|sieradenstandaard'),
    ], mn=8, mx=400, niet=SIER_NIET + '|horlogeband|zweetband|polsband ziekenhuis|armband hond'),
    P('Horloges', [
        B('Dameshorloges', 'dameshorloge|horloge dames|damenuhr|ladies watch'),
        B('Herenhorloges', 'herenhorloge|horloge heren|herrenuhr|mens watch|chronograaf'),
        B('Kinderhorloges', 'kinderhorloge|horloge kind|leerhorloge|kinder horloge|kids horloge|kids watch|horloge voor kinderen|jongenshorloge|meisjeshorloge|prisma kids|flik flak|flikflak'),
        B('Horlogedozen & -opwinders', 'horlogedoos|horlogebox|horloge opwinder|watchwinder|horlogekist'),
    ], mn=15, mx=1500, niet='smartwatch|horlogeband los|bandje|reserveband'),
    P('Tassen & sleutelhangers', [
        B('Handtassen & schoudertassen', 'handtas|schoudertas|crossbody|tote bag|shopper tas'),
        B('Rugzakken', 'rugzak|rugtas|backpack', 'kinderstoel|wandel 60l|kampeer'),
        B('Portemonnees & pasjeshouders', 'portemonnee|pasjeshouder|cardholder|secrid|pasjesetui|knipportemonnee'),
        B('Sleutelhangers met naam', 'sleutelhanger met naam|sleutelhanger graveren|sleutelhanger met foto|naam sleutelhanger'),
        B('Grappige sleutelhangers', 'grappige sleutelhanger|sleutelhanger figuur|sleutelhanger pluche|tashanger|sleutelhanger 3d'),
        B('Toilettassen & reisspullen', 'toilettas|reistas|weekendtas|paspoorthoes|bagagelabel|reiskussen'),
    ], mn=5, mx=300),
    P('Paraplu\'s', [
        B('Paraplu\'s', 'paraplu', 'kinderparaplu|parapluhouder los|parasol'),
        B('Kinderparaplu\'s', 'kinderparaplu|paraplu kind|paraplu kinderen'),
        B('Stormparaplu\'s & opvouwbaar', 'stormparaplu|storm paraplu|opvouwbare paraplu|zakparaplu|windproof'),
    ], mn=5, mx=100),
])

# ---------------------------------------------------------------- 8 WONEN & KEUKEN
C('Wonen & keuken', [
    P('Mokken & bekers', [
        B('Mokken met tekst', 'mok|beker', 'met naam -|keramiek - a|mama|papa|opa|oma|moeder|vader', ook='met tekst|spreuk|quote|grappig|collega|baas|maandag|weekend|world\'s best|warme meuk|koffie eerst|tekst|shitshow|manager|teamleider|juf |meester'),
        B('Grappige mokken', 'grappige mok|mok grappig|3d mok|mok in de vorm|mok met ogen|warmtegevoelige mok|magische mok|kleur veranderende mok'),
        B('Mokken met naam of foto', 'mok met naam|mok met foto|fotomok|gepersonaliseerde mok|naammok'),
        B('Mokken van films & games', 'harry potter mok|star wars mok|minecraft mok|disney mok|marvel mok|mario mok|playstation mok|friends mok|stitch mok'),
        B('Mokken voor mama, papa, opa en oma', 'mok|beker', 'met voornaam|met naam -|keramiek - a', ook='mama|papa|opa|oma|moeder|vader|grootvader|grootmoeder|liefste|beste'),
        B('Thermosbekers & to-go', 'thermosbeker|koffiebeker to go|to go beker|thermosfles|isoleerbeker|tumbler|stanley quencher|owala'),
        B('Drinkflessen & lunchboxen', 'drinkfles|waterfles|lunchbox|broodtrommel|bento'),
    ], mn=5, mx=80),
    P('Borrel & bar', [
        B('Borrelplanken', 'borrelplank|serveerplank|tapasplank|kaasplank|houten plank met'),
        B('Kaasplanken & kaasmessen', 'kaasmes|kaasmessen|kaasschaaf|kaasset|kaasstolp'),
        B('Whiskyglazen & karaffen', 'whiskyglas|whiskyglazen|whisky karaf|whiskykaraf|karaf|whisky stenen|whisky stones|tumbler glas'),
        B('Wijnglazen & wijnaccessoires', 'wijnglas|wijnglazen|wijnkoeler|wijnopener|kurkentrekker|wijnrek|decanteer|wijnstopper'),
        B('Cocktailsets & barspullen', 'cocktailset|cocktail set|shaker|barset|cocktailshaker|ijsemmer|barspullen|cocktailglazen'),
        B('Bierglazen & bierpullen', 'bierglas|bierglazen|bierpul|bierpot|tapbier|biertap|bierkrat'),
        B('Flesopeners', 'flesopener|bieropener|fles opener'),
    ], mn=5, mx=200),
    P('Koken & tafelen', [
        B('Messen & messensets', 'koksmes|messenset|messenblok|santoku|keukenmes|vleesmes'),
        B('Snijplanken', 'snijplank|hakblok|broodplank'),
        B('Fondue, gourmet & raclette', 'fondue|gourmetset|raclette|steengrill|teppanyaki'),
        B('Theepotten & koffie zetten', 'theepot|theeglas|french press|cafetière|percolator|moka pot|melkopschuimer|koffiemolen'),
        B('Keukengadgets', 'keukengadget|keuken gadget|pizzasnijder|avocado|eiersnijder|kruidenmolen|knoflookpers|grappige keuken'),
        B('Schorten & ovenwanten', 'schort|keukenschort|ovenwant|pannenlap|bbq schort|barbecueschort|keukenset textiel', 'met voornaam|met naam -|verfschort|werkschort|kapperscape|kappersschort|tuinschort'),
    ], mn=5, mx=250),
    P('Decoratie & klokken', [
        B('Tegeltjes met tekst', 'tegeltje|tegel met tekst|delfts blauw tegel|spreukentegel'),
        B('Posters & wanddecoratie', 'poster|wanddecoratie|muurdecoratie|wandbord|canvas|print met lijst|muurcirkel', 'posterlijst los|plakband'),
        B('Klokken & wekkers', 'wandklok|klok |wekker|koekoeksklok|tafelklok|stationsklok'),
        B('Beeldjes', 'beeldje|beeld van|decoratiefiguur|figuur decoratie|kay bojesen|houten figuur|boeddha'),
        B('Vazen', 'vaas|vazen|bloemenvaas'),
        B('Sneeuwbollen & muziekdozen', 'sneeuwbol|sneeuwglobe|snow globe|muziekdoos|speeldoos'),
        B('Kunstbloemen & -planten', 'kunstbloem|kunstplant|kunstbloemen|zijden bloem'),
    ], mn=5, mx=200),
    P('Fotolijsten & fotoboeken', [
        B('Fotolijsten', 'fotolijst|fotolijstje|foto lijst|fotocollage lijst|digitale fotolijst'),
        B('Fotoboeken & albums', 'fotoboek|fotoalbum|fotoalbum insteek|plakboek|scrapbook album'),
        B('Foto op canvas & glas', 'foto op canvas|foto op glas|foto op hout|foto op aluminium|foto op plexiglas'),
        B('Fotokalenders', 'fotokalender|kalender met foto|verjaardagskalender'),
    ], mn=5, mx=150),
    P('Kussens & deurmatten', [
        B('Sierkussens', 'sierkussen|kussen met tekst|kussen met print|kussenhoes|knuffelkussen|vormkussen'),
        B('Grappige deurmatten', 'deurmat|deur mat|droogloopmat|welkomstmat', 'antislip ondermat|rubber ondermat|schoonloopmat pvc|schoonloopmat 60', ook='grappig|tekst|welkom|go away|not again|oh no|hoi|home sweet|ga weg|bel niet|you again|hey|hallo|kat |hond|bier|wijn|koffie|ajax|feyenoord|psv|star wars|harry potter|rammstein|game'),
        B('Deurmatten met naam', 'deurmat|deur mat|droogloopmat', '', ook='met naam|met foto|eigen tekst|eigen foto|gepersonaliseerd|met tekst naar keuze|met je eigen|bedrukken'),
        B('Vloerkleden voor de kinderkamer', 'vloerkleed kinderkamer|speelkleed auto|kindervloerkleed|vloerkleed kinderen'),
    ], mn=5, mx=150),
    P('Spaarpotten', [
        B('Spaarpotten voor kinderen', 'spaarpot kind|spaarpot kinderen|spaarpot dier|kinderspaarpot|spaarvarken'),
        B('Grappige spaarpotten', 'spaarpot|spaarvarken|geldkluis|spaarkist', 'met voornaam|met naam|keramiek - a', ook='grappig|in de vorm|met geluid|stelende|kat |hond|monster|panda|dino|varken|kluis|piggy|bankje|mario|minecraft|stitch|pokemon|tetris|teller|digitaal'),
        B('Spaarpotten met naam', 'spaarpot|spaarvarken', '', ook='met naam|graveren|gepersonaliseerd|eigen naam|met foto|bedrukken'),
        B('Kluisjes & geldkistjes', 'kluis kind|kluisje|geldkistje|spaarkluis|digitale spaarpot'),
    ], mn=4, mx=80),
    P('Kerstversiering', [
        B('Kerstballen & hangers', 'kerstbal|kerstballen|kersthanger|kerstornament|kerstboomhanger|ornament', 'piek los|cotton balls|kerstballen set 100|onbreekbare kerstballen 100|plastic kerstballen'),
        B('Kerstfiguren & kerstdorpen', 'kerstfiguur|kerstdorp|kerstman figuur|rendier decoratie|kerstkabouter|gnome kerst|sneeuwpop decoratie'),
        B('Kerststallen', 'kerststal|kribbe|kerstgroep'),
        B('Kerstverlichting', 'kerstverlichting|kerstlampjes|kerstlicht|lichtgordijn|kerst lichtsnoer|led kerst'),
        B('Kleine kerstbomen & kransen', 'kerstboompje|mini kerstboom|tafelkerstboom|kerstkrans|deurkrans kerst'),
        B('Adventskalenders', 'adventskalender'),
        B('Kerstsokken & kerstservies', 'kerstsok|kerstsokken|kerst servies|kerstbord|kerstmok|kerst placemat'),
    ], mn=3, mx=150),
])

# ---------------------------------------------------------------- 9 GADGETS & ELEKTRONICA
C('Gadgets & elektronica', [
    P('Fun gadgets', [
        B('Bureaugadgets', 'bureaugadget|bureau gadget|newton|useless box|desk toy|bureauspeeltje|mini basketbal bureau'),
        B('Zwevende & magische gadgets', 'zwevend|levitatie|magnetisch zwevend|zwevende plant|zwevende maan|magic|hologram'),
        B('Retro gadgets', 'retro gadget|retro speler|retro radio|cassettespeler|walkman|polaroid', 'console'),
        B('Grappige gadgets', 'grappig gadget|grappige gadget|fun gadget|nutteloos|scheten|knop met geluid|grappen'),
        B('Mini-arcade & spelletjes', 'mini arcade|mini-arcade|arcade spel|handheld spel|tetris|pacman spel'),
        B('Gadgets voor bier en borrel', 'bier gadget|biergadget|bierhelm|bierschieter|flessen schieter|shotglas spel'),
    ], mn=5, mx=120),
    P('Handige gadgets', [
        B('AirTags & trackers', 'airtag|tracker sleutel|keyfinder|smart tag|chipolo|tile mate'),
        B('Tablets & e-readers', 'ipad|e-reader|ereader|kobo|kindle|galaxy tab|lenovo tab|kindertablet|tablet |tablet-', 'hoes|screenprotector|tekentablet|tabletten|tabletworld|bruistablet|reinigingstablet|vaatwastablet|houder|standaard|toetsenbord|stylus|pen |kabel|lader', 60, 900),
        B('Slimme speakers & slim wonen', 'slimme speaker|google nest|echo dot|alexa|slimme lamp|philips hue|slim stopcontact'),
        B('Handige gadgets voor in huis', 'handig gadget|handige gadget|oplaadbaar|draagbaar|mini ventilator|usb gadget'),
    ], mn=10, mx=500),
    P('Koptelefoons & speakers', [
        B('Koptelefoons', 'koptelefoon|headphone|hoofdtelefoon|over-ear|on-ear', 'gaming|kinder'),
        B('Oordopjes', 'oordopjes|earbuds|airpods|in-ear draadloos|true wireless'),
        B('Bluetooth-speakers', 'bluetooth speaker|draadloze speaker|jbl|marshall|bose soundlink|partybox|speaker waterdicht'),
        B('Kinderkoptelefoons', 'koptelefoon|hoofdtelefoon|headphones|headphone|oordopjes', 'gehoorbescherming|oorkappen|gehoorkap', ook='kind|kinderen|kids|junior|onanoff|buddyphones|jbl junior|volume begrensd|85 db|85db'),
        B('Speakers met licht of vorm', 'speaker|luidspreker', 'auto|inbouw|plafond|vervang|kabel|standaard|beugel|monitor|soundbar|subwoofer|pa-speaker|pa speaker|studio', ook='met licht|lamp|led|retro|in de vorm|muts|douche|bluetooth eend|astronaut|disco|karaoke|partybox|lichteffect|rgb'),
    ], mn=10, mx=500),
    P('Platenspelers, radio & vinyl', [
        B('Platenspelers', 'platenspeler|draaitafel|turntable|koffer platenspeler'),
        B('Retro radio\'s', 'radio retro|retro radio|dab radio|dab+ radio|wekkerradio|internetradio'),
        B('Vinyl', 'vinyl|lp |elpee|langspeelplaat|grammofoonplaat', 'nagellak|vinylux|vinyl sticker|vinylvloer|vinyl tafelkleed|vinyl muursticker|vinylplank|vinyl behang|vinyl handschoen|vinyl figuur|funko|vinylfolie|wrap|plakfolie|tafelzeil|vloer', ook='lp|vinyl|album|soundtrack|elpee|plaat|editie|edition|reissue|remaster'),
        B('Cd\'s', ' cd |cd box|cd album|compact disc', 'cd-speler|cd speler|cd rek|cd hoes'),
        B('Vinylaccessoires', 'platenkast|lp opbergen|vinyl opbergen|platenborstel|platenrek|vinyl reiniging'),
    ], mn=10, mx=400),
    P('Smartwatches', [
        B('Smartwatches', 'smartwatch|apple watch|galaxy watch|garmin|amazfit|huawei watch', 'bandje|hoesje|screenprotector|kinder'),
        B('Activity trackers', 'activity tracker|stappenteller|fitbit|sporthorloge|oura|smart ring'),
        B('Kindersmartwatches', 'smartwatch|smart watch|gps horloge|gps-horloge|kinderhorloge', 'dames|heren', ook='kind|kinderen|kids|junior|vtech|kidizoom|xplora'),
    ], mn=20, mx=800),
    P('Camera\'s & drones', [
        B('Instant camera\'s', 'instax|polaroid camera|instant camera|kodak smile|kodak printomatic'),
        B('Fotopapier & instax-albums', 'instax|polaroid|fotoprinter|fotopapier|zink papier|kodak', 'camera met|cameratas', ook='film|papier|album|printer|fotolijst|tas|hoes|case|frame'),
        B('Drones', 'drone', 'dronebatterij los|propeller los'),
        B('Actioncams & vlogcamera\'s', 'actioncam|action camera|gopro|vlog camera|dji osmo'),
        B('Kindercamera\'s', 'kindercamera|camera kind|fotocamera kinderen|vtech kidizoom|kidizoom'),
    ], mn=10, mx=1000),
])

# ---------------------------------------------------------------- 10 HOBBY & CREATIEF
C('Hobby & creatief', [
    P('Schilderen & tekenen', [
        B('Schilderen op nummer', 'schilderen op nummer|paint by number|verven op nummer'),
        B('Diamond painting', 'diamond painting|diamondpainting|diamant schilderen'),
        B('Verf & schildersets', 'acrylverf set|aquarelverf|olieverf set|schildersset|schilderset|schildersezel|canvasdoek set|gouache'),
        B('Tekenen & schetsen', 'schetsboek|tekenset|tekenpotloden|houtskool|tekenkoffer|schetsset|teken set'),
        B('Handlettering & kalligrafie', 'handlettering|kalligrafie|brush pen|brushpen|lettering set'),
        B('Stiften & markers', 'alcoholmarker|alcohol marker|posca|copic|promarker|markers set|stiftenset'),
    ], mn=5, mx=200),
    P('Haken, breien & borduren', [
        B('Haakpakketten', 'haakpakket|haakset|amigurumi|haken pakket|haak pakket'),
        B('Breipakketten', 'breipakket|breiset|breien|haakpakket|haakset|haken|wolpakket|amigurumi|garen pakket|beginnersset breien|beginnersset haken', 'boek|paperback|hardback|breinaalden - 2x|breinaalden nr'),
        B('Borduren & punch needle', 'borduurpakket|borduren|punch needle|borduurset|kruissteek'),
        B('Naaien & naaimachines', 'naaimachine|naaiset|naaidoos|naaipakket|lockmachine'),
        B('Macramé & weven', 'macramé|macrame|weefraam|weven set|tufting'),
    ], mn=5, mx=400),
    P('Zelf maken', [
        B('Kaarsen maken', 'kaarsen maken|kaarsenmaakset|kaars maken|kaarsen gieten|maak je eigen kaars|candle making|kaarsenwas|kaarsvet|kaarsen pakket|kaarsen set maken', 'kaarsenbord|plateau|schaal|kaarsenhouder'),
        B('Zeep maken', 'zeep maken|zeepmaakset|zeep gieten|zeep set maken|maak je eigen zeep|bruisballen maken|lippenbalsem maken|badbommen maken|kaarsen maken|kaarsenmaakset|parfum maken', 'workshop|zeepsnijder'),
        B('Sieraden maken', 'sieraden maken volwassen|sieraden maken set|kralen rijgen|edelstenen kralen|armbanden maken set'),
        B('Klei & pottenbakken', 'pottenbakken|boetseren|klei volwassen|draaischijf|polymeerklei|fimo'),
        B('Epoxy & resin', 'epoxy|resin|giethars'),
        B('3D-pennen', '3d pen|3d-pen|3doodler|3d tekenpen|3d printpen|3d-tekenpen', 'navulling|vulling|filament los|refill'),
        B('Bloemen & terrarium maken', 'terrarium maken|bloemen persen|bloempers|droogbloemen maken|terrarium set'),
    ], mn=5, mx=200),
    P('Book nooks & miniaturen', [
        B('Book nooks', 'book nook|booknook|boekensteun miniatuur|bookshelf insert'),
        B('Miniatuurhuisjes', 'miniatuurhuis|miniatuur huis|diy huisje|miniature house|rolife|robotime'),
        B('Houten modelbouw', 'ugears|houten bouwpakket|houten modelbouw|mechanisch bouwpakket|houten puzzel 3d'),
    ], mn=10, mx=250),
    P('Modelbouw & RC', [
        B('Bouwpakketten', 'revell|bouwpakket auto|bouwpakket vliegtuig|bouwpakket schip|airfix|tamiya|modelbouw set'),
        B('Modeltreinen', 'modeltrein|märklin|marklin|piko|treinset|trein set|h0 schaal|spoor h0|elektrische trein|houten treinbaan|treinbaan|lionel|hornby|lgb', 'treinkaart|ns '),
        B('Elektrische RC-auto\'s', 'rc auto|rc-auto|rc car|radiografisch bestuurbare auto|bestuurbare auto|monstertruck rc|rc truck|crawler', 'onderdeel|reserve|accu los|lader los|band|velg|chassis|as |axle|shaft|tandwiel|motor los|servo|draagarm|schokdemper|body los|kap los|bumper|lager|brandstof|nitro', ook='rtr|kant-en-klaar|afstandsbediening|elektrisch|brushless|ready to run|met accu|incl. accu'),
        B('RC op brandstof', 'nitro rc|nitro auto|rc brandstof|benzine rc|1:5 rc|petrol rc'),
        B('RC-boten & vliegtuigen', 'rc boot|rc vliegtuig|rc helikopter|bestuurbare boot|bestuurbaar vliegtuig'),
    ], mn=15, mx=1000),
    P('Muziek maken', [
        B('Keyboards & piano\'s', 'keyboard|digitale piano|digitaal piano|stagepiano', 'toetsenbord|gaming|computer|pc'),
        B('Gitaren', 'gitaar|guitar|ukelele|ukulele', 'boek|anthology|wah|effect|pedaal|versterker|element|snaren|snaar|pickup|kam |zadel|stemmechaniek|plectrum|gitaarband|strap|kabel|stemapparaat|capo|tas los|statief|speelgoed|kinder gitaar speelgoed|koffer los|gigbag|hoes'),
        B('Ukeleles', 'ukelele|ukulele'),
        B('Drums & percussie', 'drumstel|cajon|elektronisch drumstel|djembe|drum pad'),
        B('Microfoons & karaoke', 'karaoke set|karaokemachine|karaoke microfoon|karaoke speaker|draadloze microfoon'),
        B('Muziekaccessoires', 'stemapparaat|capo|metronoom|plectrum|gitaarstandaard|muziekstandaard|gitaartas'),
    ], mn=10, mx=1000),
    P('Agenda\'s & notitieboeken', [
        B('Agenda\'s 2027', 'agenda 2027|weekagenda|dagagenda|bureau agenda|agenda 2026-2027|schoolagenda'),
        B('Planners', 'planner|weekplanner|maandplanner|budget planner|maaltijdplanner'),
        B('Notitieboeken', 'notitieboek|notebook|notitieblok|leuchtturm|moleskine'),
        B('Bullet journal', 'bullet journal|dotted notebook|stippelboek|journal set'),
        B('Pennen & vulpennen', 'vulpen|balpen set|pennenset|lamy|parker pen|kalligrafiepen'),
        B('Bureauaccessoires', 'bureau organizer|pennenbak|bureauset|bureaulegger|bureau accessoire'),
    ], mn=3, mx=150),
])

# ---------------------------------------------------------------- 11 SPORT, BUITEN & DIER
C('Sport, buiten & dier', [
    P('Darts', [
        B('Dartborden', 'dartbord|dartboard|sisal dartbord', 'elektronisch|elektrisch|led'),
        B('Elektronische dartborden', 'elektronisch dartbord|elektrisch dartbord|led dartbord|dartbord elektronisch|granboard'),
        B('Dartpijlen', 'dartpijlen|darts pijlen|steeltip|softtip|dartpijl'),
        B('Dartkasten & surrounds', 'dartkast|dart kabinet|dart cabinet|surround|dartbord kast'),
        B('Dartverlichting', 'dartverlichting|dart verlichting|dartlicht|dartbordverlichting|led ring|lichtring|dartbord met verlichting|surround met led|dart led|led surround'),
        B('Dartmatten & oches', 'dartmat|dart mat|oche'),
        B('Flights, shafts & cases', 'flights|shafts|dartcase|dart case|dartetui|dart accessoires'),
    ], mn=5, mx=600),
    P('Sport & fitness', [
        B('Voetbal', 'voetbaldoel|voetbaltrainer|voetbal|clubshirt|ajax|psv|feyenoord', 'tafelvoetbal'),
        B('Padel & tennis', 'padel|tennisracket|tennisballen|padelracket|padelballen'),
        B('Golf', 'golfbal|golfballen|golfset|golfclub|putter|golftas|golf cadeau|puttingmat'),
        B('Tafeltennis & tafelvoetbal', 'tafeltennis|pingpong|tafelvoetbal|voetbaltafel|airhockey|pooltafel|biljart'),
        B('Fitness thuis', 'dumbbell|halter|kettlebell|weerstandsband|fitnessmat|hometrainer|loopband|roeitrainer|ab roller'),
        B('Yoga & pilates', 'yogamat|yoga mat|yoga set|yogablok|pilates|meditatiekussen'),
        B('Boksen', 'bokshandschoen|bokszak|boksbal|bokshandschoenen|boks set'),
        B('Basketbal & andere balsporten', 'basketbal|basketbalpaal|volleybal|handbal|rugby bal|honkbal'),
    ], mn=5, mx=600),
    P('Outdoor & kamperen', [
        B('Zaklampen & hoofdlampen', 'zaklamp|hoofdlamp|ledlenser|maglite|kampeerlamp'),
        B('Verrekijkers', 'verrekijker|binoculars|monokijker'),
        B('Kampeerspullen', 'kampeer|campingset| tent|tent |slaapzak|kampeerservies|campingstoel|kampvuur|kampeertent|koepeltent|tunneltent|hangmat', 'speeltent|kindertent|kinderbed|boek|paperback|hardback|competent|beachshelter|strandtent'),
        B('Survival & noodpakketten', 'survival|noodpakket|bushcraft|vuurstarter|paracord|ehbo kit'),
        B('Wandelen', 'wandelstok|wandelstokken|rugzak wandel|hydratatie|wandelsokken|wandelkaart'),
        B('Vissen', 'hengel|visset|vishengel|kunstaas|visdoos|karperhengel'),
        B('Schaatsen & winter', 'schaatsen|noren|glij-ijzers|skibril|snowboard|sneeuwschoenen|sleeën|houten slee|kinderslee|bobslee|rodelslee|slee met|slee voor|sneeuwschep|ijshockey|skihelm|ski-handschoen|skihandschoen|sneeuwbal maker|sneeuwballen maker|ski set kind', 'ski-jas|skipiste|skippy|skim|ski-pak'),
        B('Zwemmen & strand', 'zwembril|snorkelset|snorkel|duikbril|strandlaken|strandtent|waterschoenen|opblaasbaar zwembad'),
    ], mn=5, mx=400),
    P('Messen & multitools', [
        B('Zakmessen', 'zakmes|victorinox|opinel|zwitsers zakmes|pocket knife|buck knife|spyderco'),
        B('Multitools', 'multitool|leatherman|multi-tool|gerber'),
        B('Outdoormessen', 'outdoormes|outdoor mes|survivalmes|morakniv|mora|bushcraft mes'),
        B('Bijlen', 'bijl|hakbijl|fiskars bijl|kloofbijl'),
    ], mn=10, mx=300, niet='keukenmes|koksmes|vleesmes|tafelmes|kindermes|myfirst|dolk|vlindermes|stiletto|springmes|machete'),
    P('Steps & fietsen', [
        B('Elektrische steps', 'elektrische step|e-step|escooter|e-scooter|electric scooter|elektrische scooter', 'onderdeel|band|lader'),
        B('Elektrische fietsen', 'elektrische fiets|e-bike|ebike|fatbike', 'onderdeel|accu los|lader|slot'),
        B('Steps', 'step |stunt step|stuntstep|autoped|microstep|micro step', 'elektrisch|e-step'),
        B('Skateboards & waveboards', 'skateboard|waveboard|longboard|penny board|cruiserboard'),
    ], mn=10, mx=3000),
    P('Tuin & vogels', [
        B('Vogelhuisjes', 'vogelhuisje|nestkast|vogelhuis'),
        B('Voedersilo\'s & vogelvoer', 'voedersilo|vogelvoer|pindakaaspot|voederhuisje|vogelvoederhuis|vetbollen'),
        B('Insectenhotels & egelhuisjes', 'insectenhotel|bijenhotel|egelhuis|egelhuisje|vlinderhuis|vleermuiskast'),
        B('Planten & potten', 'kamerplant|bloempot|plantenpot|cactus|vetplant|bonsai|orchidee', 'kunstplant|kunst'),
        B('Kweeksets & moestuin', 'kweekset|zaden set|moestuin|kruidentuin|groeikit|kweekbak|moestuinbak'),
        B('Tuindecoratie', 'tuinbeeld|tuindecoratie|tuinkabouter|tuinsteker|windgong|tuinbord'),
        B('Tuingereedschap als cadeau', 'tuingereedschap set|tuinset|snoeischaar|tuinhandschoenen|plantschepje|gieter'),
    ], mn=5, mx=250),
    P('BBQ & buitenkoken', [
        B('BBQ-accessoires', 'bbq gereedschap|bbq set|barbecue set|bbq tang|grillborstel|vleesthermometer|bbq accessoires'),
        B('Barbecues', 'barbecue|bbq |kamado|houtskoolbarbecue|tafelbarbecue|weber|gasbarbecue|elektrische barbecue|big green egg|pizzaoven', mx=2500, mn=60, niet='rooksnipper|pellets|warmhoudrek|pan |montage|recepten|boek|hardback|paperback|saus|rub|kruiden|schort|hoes|beschermhoes|rooster los|briketten|houtskool zak|aanmaak|thermometer|tang|borstel|spies|reiniger|grill pan|vervang|onderdeel|brander|plaat los|gasslang|drukregelaar'),
        B('Pizzaovens', 'pizzaoven|pizza oven|pizzasteen|ooni'),
        B('Kampvuurkoken & dutch oven', 'dutch oven|kampvuur pan|popcorn kampvuur|marshmallow|tosti ijzer kampvuur'),
    ], mn=10, mx=1000),
    P('Hond & kat', [
        B('Hondenspeelgoed', 'hondenspeelgoed|hondenspeeltje|speelgoed hond|kauwspeelgoed|hondenbal|snuffelmat', 'knuffel kind'),
        B('Kattenspeelgoed', 'kattenspeelgoed|kattenspeeltje|speelgoed kat|krabplank|kattenhengel|laserpen kat'),
        B('Huisdier met naam of foto', 'huisdierportret|portret van je hond|portret van je kat|hondenpenning|naampenning|halsband met naam'),
        B('Snacks & verwennen', 'hondensnack|kattensnack|hondenkoekjes|kattensnoepjes|adventskalender hond|adventskalender kat'),
    ], mn=3, mx=200),
])

# ---------------------------------------------------------------- 12 BELEVENISSEN
BELEEF = 'doenkado|vipio|naturesgift'
C('Belevenissen', [
    P('Rijden, vliegen & water', [
        B('Rijden in een sportauto', 'lamborghini|ferrari|porsche rijden|sportauto rijden|race rijden|circuit rijden|supercar|rally rijden|4x4 rijden|quad rijden|slipcursus'),
        B('Vliegen & helikopter', 'helikoptervlucht|rondvlucht|vliegles|zweefvliegen|paragliden|parachute|windtunnel|indoor skydiven'),
        B('Ballonvaart', 'ballonvaart|luchtballon'),
        B('Boottochten & zeilen', 'boottocht|rondvaart|zeilen|sloep|speedboot|whisper boat|bootje huren'),
        B('Watersport', 'kano|sup |suppen|waterskiën|wakeboard|flyboard|kitesurf|duiken|rafting'),
    ], mn=10, mx=1000, winkels=BELEEF),
    P('Overnachten & wellness', [
        B('Bijzondere overnachtingen', 'overnachting|overnachten|boomhut|glamping|vakantiehuis|tiny house|hotel arrangement|weekendje weg'),
        B('Wellness & sauna', 'wellness|sauna|spa dag|thermen|massage arrangement'),
    ], mn=20, mx=1000, winkels=BELEEF),
    P('Dagjes uit & natuur', [
        B('Dieren kijken & knuffelen', 'alpaca|lama wandeling|lama\'s|dierentuin|zeehonden|husky|roofvogel|dieren knuffelen|wolven|uilen|valkerij|boerderij|safari'),
        B('Dagje uit', 'dagje uit|uitje|attractiepark|pretpark|museum|bioscoopbon|toegangskaart'),
        B('Wandel- & fietstochten', 'wandeltocht|fietstocht|e-chopper|fatbike tour|segway|step tour'),
    ], mn=10, mx=500, winkels=BELEEF),
    P('Workshops, escape & proeven', [
        B('Workshops', 'workshop|cursus|masterclass|kookworkshop|schilderworkshop|keramiek workshop'),
        B('Escape rooms', 'escape room|escaperoom|exit room'),
        B('Puzzel- & speurtochten', 'speurtocht|puzzeltocht|stadsspel|vossenjacht|crazy 88'),
        B('Proeverijen & diners', 'proeverij|wijnproeverij|bierproeverij|high tea|diner voor twee|dinerbon|eettour|food tour'),
    ], mn=10, mx=500, winkels=BELEEF),
])


def maak(uit):
    cats, n = [], 0
    for ci, c in enumerate(BOOM, 1):
        cid = 'm%02d' % ci
        cats.append({'id': cid, 'naam': c['naam'], 'ouder': None, 'volgorde': ci})
        for pi, p in enumerate(c['paginas'], 1):
            pid = '%s%02d' % (cid, pi)
            cats.append({'id': pid, 'naam': p['naam'], 'ouder': cid, 'volgorde': pi})
            for bi, b in enumerate(p['blokken'], 1):
                n += 1
                k = {'id': '%s%02d' % (pid, bi), 'ouder': pid, 'volgorde': bi if b.get('volg') is None else b['volg'],   # volg: eerder tonen zonder de ids te verschuiven
                     'naam': b['naam'], 'zoek': b['zoek'], 'niet': b['niet'],
                     'min': b['min'], 'max': b['max'], 'doel': b['doel'], 'prio': '', 'tip': b['tip'], 'voor': []}
                if b['ook']:
                    k['ook'] = b['ook']
                if b['winkels']:
                    k['winkels'] = b['winkels']
                cats.append(k)
    data = {'uitleg': 'Marktlijst LeukeKeuze (%s). Categorie > pagina > blok. Een blok zoekt slim in alle partners: zoek = woorden (een van deze), ook = daarnaast een van deze, '
                      'niet = woorden die eruit moeten, min/max = prijs. Volgorde van de blokken = volgorde op de site.' % datetime.date.today().isoformat(),
            'cats': cats, 'volgende': 5001}
    json.dump(data, open(uit, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print('categorieën', len(BOOM), '| pagina\'s', sum(len(c['paginas']) for c in BOOM), '| blokken', n)


if __name__ == '__main__':
    maak(sys.argv[1] if len(sys.argv) > 1 else 'mijn-categorieen.json')
