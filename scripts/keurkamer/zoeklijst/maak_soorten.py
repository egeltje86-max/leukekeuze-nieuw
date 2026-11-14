# -*- coding: utf-8 -*-
"""Zoeklijst voor de Superkeurkamer (14-11-2026, opdracht Marius: 'maak categorieën die bij naam gezocht moeten worden').
Elke soort = een vaste knop met slimme zoekwoorden (OF), woorden die eruit moeten (NIET), een prijsband,
voor wie, hoeveel we er ongeveer willen (doel) en een tip waar je op let.
Prioriteit: A = verkoopt/scoort nu bij ons of wordt heel veel gezocht, B = goed cadeau, C = kleiner/apart.
Zoekvolumes (OpenSEO, NL, per maand, 14-11-2026) staan in 'vol' waar gemeten."""
import json, sys

NIET_TROEP = ['reserve', 'vervang', 'onderdeel', 'navulling', 'refill', 'adapter', 'kabel', 'schroef', 'bevestiging', 'montage']

G = []  # (groep, [soorten])
def S(naam, zoek, niet=(), mn=5, mx=60, voor=(), doel=15, prio='B', tip='', vol=None):
    return {'naam': naam, 'zoek': list(zoek), 'niet': list(niet), 'min': mn, 'max': mx, 'voor': list(voor), 'doel': doel,
            'prio': prio, 'tip': tip, **({'vol': vol} if vol else {})}

LAMP_NIET = ['lampenkap', 'gloeilamp', 'ledlamp e27', 'e27', 'e14', 'gu10', 'fietslamp', 'fietsverlichting', 'zaklamp', 'hoofdlamp', 'werklamp',
             'plafond', 'kroonluchter', 'buitenlamp', 'wandlamp buiten', 'grondspot', 'inbouw', 'tl-buis', 'lichtbron', 'dimmer', 'koplamp', 'achterlicht']
G.append(('Licht, sfeer & wonen', [
    S('Nachtlampjes & figuurlampjes', ['nachtlamp', 'nachtlicht', 'night light', 'icon light', 'icon lamp', 'figuurlamp', 'lampje', 'boxlamp', 'light up'], LAMP_NIET, 5, 60,
      ['kind', 'tiener', 'haar'], 30, 'A', 'Figuurtjes uit games, films en dieren. Echte sfeerfoto met het licht aan. Paladone, Numskull en Fizz zijn goede merken.', 14800),
    S('Lavalampen & bewegend licht', ['lavalamp', 'lava lamp', 'glitterlamp', 'flow lamp', 'zandlamp', 'sandscape', 'kwallenlamp', 'jellyfish'], LAMP_NIET, 10, 70,
      ['tiener', 'haar', 'hem'], 15, 'A', 'Lava, glitter, zand of kwallen die bewegen: werkt heel goed op TikTok.', 9900),
    S('Sterrenprojectors & galaxy-lampen', ['sterrenprojector', 'projector ster', 'galaxy projector', 'galaxy lamp', 'galaxy light', 'sterrenhemel lamp', 'sterrenhemel projector', 'nebula', 'projectielamp', 'star projector'], ['beamer', 'filmprojector', 'samsung', 'hoesje', 'cover'] + LAMP_NIET, 8, 70,
      ['kind', 'tiener', 'haar'], 15, 'A', 'Sterren op het plafond. Liefst met foto van de kamer in het donker.', 590),
    S('Neonlampen & lichtborden', ['neonlamp', 'neon lamp', 'neon light', 'neon led', 'neon bord', 'neon sign', 'led bord', 'ledbord', 'lichtbord', 'lightbox', 'letterbak'], LAMP_NIET + ['neonkleur', 'neon geel', 'neon roze'], 10, 80,
      ['tiener', 'haar', 'hem'], 12, 'B', 'Regenboog, logo of tekst voor aan de muur.', 1900),
    S('Book nooks & miniatuurhuisjes', ['book nook', 'booknook', 'miniatuurhuis', 'miniatuur huis', 'diy huisje', 'boekensteun lamp', 'miniature'], ['poppenhuis meubel'], 15, 120,
      ['haar', 'tiener', 'hem'], 15, 'A', 'Zelf bouwen, met lampjes. Robotime/Rolife is het bekende merk.', 9900),
    S('Zoutlampen, maanlampen & sfeerlampen', ['zoutlamp', 'maanlamp', 'moon lamp', 'sfeerlamp', 'tulpenlamp', 'paddenstoellamp', 'mushroom lamp', 'smiley lamp', 'wolkenlamp'], LAMP_NIET, 10, 80,
      ['haar', 'iedereen'], 15, 'B', 'Mooi voor op de kast of het nachtkastje. Foto met licht aan.', 6600),
    S('Geurkaarsen', ['geurkaars', 'scented candle', 'kaars in glas', 'kaars in pot'], ['kaarsenhouder', 'waxinelichtjes 100', 'dinerkaars', 'stompkaars', 'theelicht', 'kaarslont'], 8, 60,
      ['haar', 'collega', 'opa-oma'], 20, 'A', 'Mooie pot of doos, bekende geur (Atelier Rebul eerst, dan Yankee/WoodWick/Rituals-achtig).', 9900),
    S('Geurstokjes & huisparfum', ['geurstokjes', 'diffuser', 'huisparfum', 'roomspray', 'room spray', 'kussenspray'], ['navulling', 'refill', 'auto'], 8, 70,
      ['haar', 'collega', 'opa-oma'], 12, 'B', 'Liefst een cadeaudoos.', 12100),
]))
G.append(('Knus & warm', [
    S('Hoodie-dekens & draagbare dekens', ['hoodie deken', 'hoodie-deken', 'snuggle', 'draagbare deken', 'deken met mouwen', 'oversized hoodie', 'teddy hoodie'], [], 10, 60,
      ['haar', 'tiener', 'kind', 'iedereen'], 15, 'A', 'De HEMA hoodie-deken is onze topper op TikTok.', 880),
    S('Plaids & fleecedekens', ['plaid', 'fleece deken', 'fleecedeken', 'knuffeldeken', 'sherpa deken', 'gebreide deken', 'teddy deken', 'verwarmde deken', 'elektrische deken'], ['paardendeken', 'hondendeken', 'kattendeken', 'brandwerend', 'isolatie'], 15, 90,
      ['haar', 'opa-oma', 'iedereen'], 15, 'A', 'Zacht en mooi van kleur of met een grappige print.', 9900),
    S('Pantoffels & sloffen', ['pantoffel', 'slof', 'slipper', 'huissok', 'magnetronslof', 'hot feet', 'dierensloffen', 'knuffelslof'], ['badslipper', 'teenslipper', 'werkschoen', 'slipper sok'], 8, 50,
      ['haar', 'hem', 'kind', 'opa-oma'], 20, 'A', 'Grappige vormen (popcorn, dieren) en magnetronsloffen doen het goed. Geen maten-gedoe: liefst one size of S/M/L.', 12100),
    S('Warmteknuffels & kruiken', ['warmteknuffel', 'kruik', 'warmtekussen', 'magnetronknuffel', 'warmies', 'cozy plush', 'warm knuffel'], ['kruikhoes los'], 8, 45,
      ['kind', 'haar', 'opa-oma'], 15, 'A', 'Knuffel die je in de magnetron opwarmt. Capibara en dieren scoren.', 14800),
    S('Badjassen & ochtendjassen', ['badjas', 'ochtendjas', 'kamerjas', 'bathrobe'], ['badjas kind'], 25, 100,
      ['haar', 'hem'], 8, 'B', 'Alleen als het echt een cadeau is: doos, borduursel of grappig model.', 18100),
    S('Cadeausokken & warme sokken', ['sokken in', 'sokken cadeau', 'giftbox sokken', 'happy socks', 'grappige sokken', 'bedsokken', 'huissokken', 'sokken met tekst'], ['compressie', 'werksok', 'sportsok'], 5, 35,
      ['hem', 'haar', 'collega'], 12, 'B', 'In een leuke doos of met tekst. Geen gewone multipacks.', 90),
    S('Handwarmers & warmtekussens', ['handwarmer', 'hand warmer', 'nekwarmer', 'nekkussen warm', 'oplaadbare handwarmer'], [], 5, 40,
      ['iedereen', 'collega', 'opa-oma'], 8, 'B', 'Oplaadbaar en mooi van vorm.'),
]))
G.append(('Verwennen & verzorging', [
    S('Bruisballen & badsets', ['bruisbal', 'badbruis', 'bath bomb', 'badparel', 'badset', 'bad cadeau', 'badzout'], ['badkamermeubel', 'badmat'], 4, 40,
      ['haar', 'kind', 'tiener'], 20, 'A', 'Grappige vormen (hartjes, gin, donuts) en mooie sets.', 1300),
    S('Verwenpakketten & giftboxen', ['verwenpakket', 'verwenbox', 'giftbox', 'gift box', 'cadeaubox', 'pamper', 'spa set', 'wellness set'], [], 10, 70,
      ['haar', 'collega'], 20, 'A', 'Bad + kaars + iets lekkers in één doos. Liefst niet bol.', 480),
    S('Giftsets voor haar', ['giftset', 'gift set', 'cadeauset', 'geschenkset', 'beauty set', 'verzorgingsset'], ['heren', 'men', 'man ', 'baard', 'scheer'], 10, 90,
      ['haar'], 20, 'A', 'Atelier Rebul eerst. Bekende merken in een cadeaudoos.', 1300),
    S('Giftsets voor hem & baardverzorging', ['giftset heren', 'giftset men', 'baardset', 'baard set', 'baardolie', 'baardverzorging', 'scheerset', 'beard', 'grooming'], ['dames', 'women'], 10, 90,
      ['hem'], 15, 'A', 'In een cadeaudoos. Mannen vragen dit veel (Lootjestrekken).', 1000),
    S('Parfum voor haar', ['eau de parfum', 'eau de toilette', 'parfum', 'perfume'], ['heren', 'men', 'pour homme', 'tester', 'deodorant', 'sample', 'auto'], 15, 120,
      ['haar'], 15, 'B', 'Alleen bekende geuren, geen testers.', 8100),
    S('Parfum voor hem', ['pour homme', 'for men', 'eau de toilette heren', 'parfum heren', 'aftershave'], ['dames', 'women', 'pour femme', 'tester', 'sample'], 15, 120,
      ['hem'], 12, 'B', 'Bekende geuren, mooie fles.', 8100),
    S('Handcrème, lotion & douchegel', ['handcreme', 'hand cream', 'bodylotion', 'body lotion', 'douchegel', 'shower gel', 'body scrub', 'bodyscrub', 'body butter'], ['1 liter', '5 liter', 'navul'], 5, 50,
      ['haar', 'collega', 'opa-oma'], 15, 'B', 'Klein cadeautje voor lootjes en collega\'s. Atelier Rebul, Sol de Janeiro.'),
    S('Slapen & ontspannen', ['slaapmasker', 'sleep mask', 'nekkussen', 'massagekussen', 'massage', 'zijden kussensloop', 'slaapspray', 'acupressuur'], ['massagetafel', 'massagestoel'], 5, 80,
      ['haar', 'opa-oma', 'collega'], 10, 'B', 'Ook goed voor beterschap.'),
]))
G.append(('Lekker & proosten', [
    S('Chocolade & bonbons', ['chocolade', 'bonbon', 'truffel', 'chocoladeletter', 'tony', 'lindt', 'chocolate'], ['chocoladefontein onderdeel', 'cacaopoeder', 'bakchocolade', 'hagelslag'], 4, 50,
      ['iedereen', 'collega', 'opa-oma'], 20, 'A', 'In een mooie verpakking of met een boodschap.', 1300),
    S('Snoep & drop door de brievenbus', ['brievenbus', 'droptelegram', 'snoeppakket', 'snoepbox', 'drop', 'zoete', 'candy box'], ['brievenbus bevestiging', 'brievenbusklep'], 5, 35,
      ['iedereen', 'collega'], 15, 'A', 'Met een kaartje of tekst. Past door de brievenbus.', 1000),
    S('Koffie & thee cadeaus', ['koffie cadeau', 'koffiebox', 'koffiepakket', 'thee cadeau', 'theebox', 'theepakket', 'thee proeverij', 'koffieproeverij', 'matcha set'], ['koffiezetapparaat', 'filterzakjes', 'koffiepads 100'], 8, 60,
      ['haar', 'hem', 'collega', 'opa-oma'], 12, 'B', 'Proeverij of cadeaudoos.', 590),
    S('Whisky, rum & sterke drank', ['whisky', 'whiskey', 'bourbon', 'single malt', ' rum ', 'spiced rum', 'dark rum', 'rhum', 'cognac', 'armagnac', 'wodka', 'vodka', 'likeur', 'jenever', 'tequila', 'mezcal', 'calvados', 'grappa', 'amaretto'], ['whiskyglas los', 'mixer', 'rumrozijnen', 'bonbon', 'chocolade'], 15, 200,
      ['hem'], 20, 'A', 'Drankpakket staat op 1 bij mannen. In geschenkdoos of met glazen.', 170),
    S('Gin & cocktails', ['gin ', 'gin-tonic', 'cocktailset', 'cocktail set', 'cocktailshaker', 'cocktail kit', 'mixology', 'cocktailrook'], [], 15, 120,
      ['haar', 'hem'], 15, 'B', 'Gin met glazen of een set om cocktails te maken.', 2400),
    S('Wijn, port & bubbels', ['wijnpakket', 'wijnkist', 'wijn cadeau', 'champagne', 'prosecco', 'cava', 'wijn in kist', 'wijnproeverij', 'rode wijn', 'witte wijn', 'rose wijn', 'riesling', 'rioja', 'chianti', 'bordeaux', 'merlot', 'cabernet', 'chardonnay', 'sauvignon', 'pinot', ' port', 'portwijn', 'tempranillo', 'primitivo', 'malbec', 'syrah', 'nero d avola', 'gamay', 'amarone', 'barolo'], ['wijnrek', 'wijnkoelkast', 'wijnglas', 'wijnglazen', 'kurkentrekker', 'wijnazijn', 'koken met'], 6, 150,
      ['haar', 'hem', 'collega', 'opa-oma'], 15, 'B', 'In een kist, met glazen of met een eigen etiket.', 590),
    S('Bier: pakketten & glazen', ['bierpakket', 'bierbox', 'bierproeverij', 'speciaalbier', 'bierbrouwpakket', 'bierglas', 'bierpul', 'bierkist'], ['bierkrat leeg', 'biertap onderdeel'], 8, 80,
      ['hem'], 12, 'B', 'Echte bierpakketten zijn schaars bij onze partners (Beerwulf aanmelden).', 3600),
    S('Borrelplanken & tapas', ['borrelplank', 'serveerplank', 'tapasplank', 'kaasplank', 'tapas set', 'borrelpakket', 'kaasset', 'charcuterie'], [], 10, 70,
      ['iedereen', 'haar', 'hem'], 15, 'A', 'Ook met naam of plattegrond van je stad.', 33100),
    S('Mooie glazen & karaffen', ['wijnglazen', 'champagneglazen', 'whiskyglazen', 'whisky glazen', 'karaf', 'decanteer', 'cocktailglazen', 'gin glazen'], ['onderdeel', 'los glas 1'], 15, 90,
      ['haar', 'hem', 'opa-oma'], 12, 'B', 'Een set in een mooie doos, of met tekst.', 12100),
    S('Lekkernijen & cadeaupakketten', ['cadeaupakket', 'kerstpakket', 'proeverij', 'olijfolie set', 'delicatesse', 'kruidenset', 'sauzenset', 'hot sauce'], [], 10, 80,
      ['iedereen', 'collega', 'opa-oma'], 15, 'B', 'Pakketten die je niet zomaar in de supermarkt koopt.', 1000),
]))
G.append(('Grappig & gek', [
    S('Grappige gadgets', ['grappig', 'gadget', 'useless box', 'nutteloos', 'gek ', 'novelty', 'prank', 'fopartikel'], ['schroef', 'onderdeel'], 4, 40,
      ['iedereen', 'tiener', 'hem', 'collega'], 30, 'A', 'Je moet meteen lachen als je de foto ziet. Ditverzinjeniet, CoolGift en Cadeau.nl verkopen goed.', 8100),
    S('Stressballen & squishies', ['stressbal', 'stress bal', 'squishy', 'squeeze', 'knijpbal', 'dumpling'], ['fysiotherapie', 'handtrainer'], 3, 20,
      ['kind', 'tiener', 'collega'], 15, 'A', 'Hamster, dumpling en bubble tea scoorden goed.', 5400),
    S('Fidgets & friemelspeeltjes', ['fidget', 'pop it', 'friemel', 'spinner', 'infinity cube', 'magnetisch speelgoed', 'kinetic'], [], 3, 25,
      ['kind', 'tiener'], 10, 'B', 'Kleine friemeldingen voor in de schoen.', 4400),
    S('Grappige mokken', ['mok ', 'beker ', 'mug'], ['mok met naam', 'thermosbeker', 'drinkfles', 'set van 6', 'set van 4', 'mokkenrek', 'koffiemok basic'], 6, 25,
      ['iedereen', 'collega', 'hem', 'haar'], 20, 'A', 'Met een grappige tekst, vorm of kleurwissel. De World\'s Best Boss-mok werd aangeklikt.', 6600),
    S('Tegeltjes & bordjes met tekst', ['tegeltje', 'tegel met tekst', 'tekstbord', 'bordje', 'spreuk', 'wandbord'], [], 5, 30,
      ['iedereen', 'collega', 'opa-oma'], 15, 'A', 'Het tegeltje koffie/bier is verkocht. Grappige Nederlandse teksten.', 5400),
    S('Foute kersttruien & feestkleding', ['foute kersttrui', 'kersttrui', 'ugly christmas', 'feesthoed', 'carnaval', 'gekke trui'], [], 10, 50,
      ['iedereen', 'hem', 'haar', 'collega'], 12, 'B', 'Zonder grove teksten. Ook voor kerstborrels.', 12100),
    S('Wc- en badkamerhumor', ['wc ', 'wc-', 'toilettimer', 'toiletgolf', 'wc golf', 'wc voetbal', 'pleerol', 'toiletrolhouder grappig', 'badeend', 'douchekop'], ['toiletpot', 'toiletbril vervangend', 'reiniger', 'wc-papier 24'], 4, 30,
      ['hem', 'collega', 'tiener'], 8, 'B', 'Wc-golf, toilettimer, wc-voetbal.'),
    S('Bureau- en kantoorhumor', ['collega', 'kantoor', 'office', 'bureaugadget', 'bureau gadget', 'pen in de vorm', 'grappige pen', 'notitieboek', 'bureautherapeut'], ['bureaustoel', 'printer', 'inkt', 'archief', 'ventilator', 'stofzuiger', 'agenda', 'kalender', 'bureauset', 'bureauonderlegger'], 4, 30,
      ['collega'], 12, 'B', 'Lootjes voor collega\'s: grappig, maar netjes.'),
]))
G.append(('Persoonlijk: met naam of foto', [
    S('Mokken met naam of foto', ['mok met naam', 'mok met foto', 'gepersonaliseerde mok', 'eigen tekst mok', 'mok met tekst naar keuze', 'geboortebloem'], [], 8, 30,
      ['iedereen', 'opa-oma', 'haar'], 12, 'A', 'Ook de mokken met namen van de kleinkinderen.', 1000),
    S('Fotocadeaus', ['fotopuzzel', 'fotokussen', 'fotolijst', 'foto op', 'met eigen foto', 'fotoblok', 'foto tegel', 'fotokalender'], ['fotopapier', 'fotocamera'], 8, 60,
      ['opa-oma', 'haar', 'iedereen'], 15, 'A', 'Wordt veel gezocht, vooral voor opa en oma.', 6600),
    S('Posters: sterrenhemel, stad & kaart', ['sterrenhemel', 'star map', 'stadsposter', 'stadskaart', 'plattegrond poster', 'poster met naam', 'kaart poster'], [], 15, 80,
      ['haar', 'hem', 'opa-oma'], 10, 'B', 'Persoonlijk en mooi voor jubileum of verjaardag.', 170),
    S('Spullen met naam (plank, deurmat, sleutelhanger)', ['met naam', 'gepersonaliseerd', 'gegraveerd', 'met eigen tekst', 'graveren', 'personalised'], ['sieraad', 'ketting', 'armband', 'ring'], 8, 70,
      ['iedereen', 'haar', 'hem'], 15, 'B', 'Snijplank, deurmat, heupfles met naam. Geen sieraden.'),
    S('Fotoboeken & kalenders', ['fotoboek', 'fotokalender', 'verjaardagskalender', 'invulboek', 'invulboekje', 'vertel eens'], [], 8, 60,
      ['opa-oma', 'haar', 'hem'], 10, 'C', '\'Opa, vertel eens\' en invulboekjes zijn mooi.', 9900),
]))
G.append(('Spellen & puzzels', [
    S('Bordspellen', ['bordspel', 'board game', 'spel ', 'catan', 'ticket to ride', 'azul', 'wingspan', 'carcassonne', 'cascadia', '7 wonders'], ['uitbreiding', 'expansion', 'sleeves', 'insert', 'organizer', 'english edition'], 15, 80,
      ['iedereen', 'haar', 'hem', 'tiener'], 25, 'A', 'Nederlandstalig, geen uitbreidingen. 999 Games en Boardgameshop.', 14800),
    S('Kaartspellen & partyspellen', ['kaartspel', 'partyspel', 'party game', 'exploding kittens', 'uno', 'hitster', 'lama', 'weerwolven', 'skipbo', 'pesten', 'kwartet'], ['speelkaarten los', 'sleeves'], 5, 35,
      ['iedereen', 'tiener', 'collega'], 20, 'A', 'Goedkoop en altijd raak voor lootjes.', 9900),
    S('Puzzels', ['puzzel', 'legpuzzel', 'jigsaw', 'wasgij', 'jan van haasteren'], ['puzzelmat', 'puzzellijm', '3d', 'kruiswoord', 'sudoku', 'puzzelboek'], 8, 40,
      ['opa-oma', 'haar', 'iedereen'], 20, 'A', 'Grappige of mooie afbeelding; Wasgij en Jan van Haasteren zijn bekend.', 40500),
    S('3D-puzzels & houten bouwpakketten', ['3d puzzel', '3d-puzzel', 'houten bouwpakket', 'robotime', 'ugears', 'rokr', 'metal earth', 'mechanisch model', 'bouwpakket hout'], [], 12, 120,
      ['hem', 'tiener', 'haar'], 15, 'A', 'Muziekdoosje maken en 3D-modellen werden veel bekeken.', 3600),
    S('Breinbrekers & escape-spellen', ['escape room', 'exit spel', 'escape spel', 'breinbreker', 'puzzeldoos', 'iq puzzel', 'raadsel', 'puzzle box', 'smartgames'], [], 5, 50,
      ['hem', 'tiener', 'iedereen'], 10, 'B', 'Voor wie van uitdaging houdt.', 1300),
    S('Diamond painting & schilderen op nummer', ['diamond painting', 'schilderen op nummer', 'paint by number', 'diamond art'], ['losse steentjes', 'pen los'], 8, 50,
      ['haar', 'opa-oma', 'tiener'], 10, 'B', 'Mooie afbeelding, compleet pakket.', 33100),
    S('Hobbypakketten voor volwassenen', ['zelf maken', 'diy kit', 'maak je eigen', 'kaarsen maken', 'zeep maken', 'haken pakket', 'borduurpakket', 'macrame', 'pottenbakken', 'kalligrafie'], [], 10, 70,
      ['haar', 'opa-oma'], 12, 'B', 'Kaarsen maken en muziekdoosje maken werden veel bekeken.', 1300),
]))
G.append(('Kinderen: speelgoed', [
    S('LEGO & DUPLO', ['lego', 'duplo'], ['lego compatibel', 'compatible', 'opbergbox', 'plaat los', 'minifiguren los', 'lijst voor'], 8, 450,
      ['kind', 'tiener', 'hem'], 30, 'A', 'Altijd de doosfoto. Op leeftijd van de doos.', 301000),
    S('Playmobil & speelfiguren', ['playmobil', 'speelfiguur', 'speelset', 'schleich', 'figurenset'], [], 8, 90,
      ['kind'], 12, 'B', '', 33100),
    S('Knuffels & Squishmallows', ['knuffel', 'squishmallow', 'pluche', 'plush', 'jellycat', 'teddybeer'], ['knuffeldoek los', 'reservekleding', 'hondenspeeltje', 'kattenspeeltje'], 5, 50,
      ['kind', 'tiener', 'haar', 'baby'], 25, 'A', 'Stitch, axolotl, capibara en chocomelk-knuffel scoorden.', 18100),
    S('Reuzenknuffels (vanaf 60 cm)', ['100 cm', '1 meter', '80 cm', '70 cm', '60 cm', 'xxl knuffel', 'reuzenknuffel', 'mega knuffel', 'giant plush'], ['deken', 'kussensloop'], 20, 120,
      ['kind', 'tiener', 'haar'], 10, 'B', 'Zet de maat in de titel.'),
    S('Slijm, kinetisch zand & klei', ['slijm', 'slime', 'kinetic sand', 'kinetisch zand', 'magisch zand', 'play-doh', 'speelklei', 'kleiset', 'klei set', 'boetseer', 'foam clay'], ['tegellijm', 'kit'], 4, 35,
      ['kind'], 15, 'A', 'Sushi-slijm en glow-slijm deden het goed.', 3600),
    S('Experimenteren & ontdekken', ['experimenteer', 'scheikunde', 'chemie', 'wetenschap', 'science', 'kristal', 'microscoop', 'opgraaf', 'dig kit', 'telescoop', 'stem', 'triops'], ['laboratorium apparatuur'], 8, 70,
      ['kind'], 15, 'A', 'Ook goed voor kinderen van 8 tot 12.', 20),
    S('Knutselen voor kinderen', ['knutsel', 'kralen', 'armbandjes maken', 'tekenset', 'stiften', 'kleurpotloden set', 'stickerboek', 'kleurboek', 'waterverf'], ['kantoor stiften 100', 'navulling'], 4, 40,
      ['kind'], 20, 'A', 'Vriendschapsarmbandjes en magische waterstiften scoorden.', 6600),
    S('Verkleden & rollenspel', ['verkleed', 'kostuum', 'verkleedkleren', 'speelkeuken', 'dokterset', 'gereedschapset kind', 'winkeltje', 'toverstaf', 'dinomasker', 'dinosaurus masker'], ['sexy', 'slaapmasker', 'gezichtsmasker', 'haarmasker'], 8, 70,
      ['kind'], 12, 'B', 'Dinosaurusmasker deed het goed.', 1300),
    S('Bestuurbare auto\'s, robots & drones', ['bestuurbare', 'radiografisch', 'rc auto', 'rc car', 'robot', 'drone', 'hexbug', 'stunt auto'], ['stofzuiger', 'robotmaaier', 'grasmaaier', 'keukenrobot', 'accu los', 'reserve', 'onderdeel', 'velg', 'band ', 'schokdemper', 'motor los', 'servo', 'lader'], 10, 150,
      ['kind', 'tiener', 'hem'], 20, 'A', 'Rijklaar, geen losse onderdelen. TopRC heeft aparte groep.', 9900),
    S('Buitenspelen & bellenblaas', ['bellenblaas', 'waterpistool', 'stoepkrijt', 'vlieger', 'springtouw', 'frisbee', 'boemerang', 'slee', 'zandbak', 'nerf'], [], 4, 60,
      ['kind'], 12, 'B', 'Bellenblaas-bazooka en -machine scoorden.'),
    S('Pokémon & verzamelkaarten', ['pokemon', 'booster', 'trading card', 'verzamelkaart', 'elite trainer', 'tcg'], ['sleeves', 'binder los', 'deckbox'], 5, 80,
      ['kind', 'tiener'], 15, 'A', 'Hype: Pokémon 30 jaar.', 49500),
    S('Kinderspellen', ['kinderspel', 'spel kind', 'memory spel', 'memoryspel', 'vier op een rij', 'kwartet', 'ganzenbord', 'domino', 'poepspel', 'junior spel'], ['uitbreiding', 'foam', 'geheugenkaart'], 5, 40,
      ['kind'], 15, 'A', 'Grappige spellen (poep, scheten) en klassiekers.'),
    S('Baby & peuter', ['rammelaar', 'bijtring', 'speelkleed', 'babygym', 'stapelblok', 'stapeltoren', 'vormenstoof', 'activiteiten', 'nijntje', 'woezel', 'bumba', 'trekfiguur', 'muziekdoos baby'], ['flesje', 'speen', 'luier', 'babyvoeding', 'kinderwagen'], 5, 80,
      ['baby', 'kind'], 25, 'A', 'Kraamcadeau en voor 1 tot 3 jaar. Woewoe en De Grote Speelgoedwinkel.', 6600),
    S('Rijden: loopfietsen, steps & loopauto\'s', ['loopfiets', 'loopauto', 'loopwagen', 'step kind', 'driewieler', 'skelter', 'hobbeldier', 'hobbelpaard'], ['onderdeel', 'band', 'remblok'], 25, 150,
      ['kind', 'baby'], 10, 'B', '', 12100),
    S('Spaarpotten, wekkers & kinderkamer', ['spaarpot', 'wekker kind', 'kinderwekker', 'groeimeter', 'wandsticker', 'sterren plafond', 'kinderkamer'], [], 5, 40,
      ['kind'], 12, 'B', 'Spaarmonster en Mario-spaarpot.', 9900),
]))
G.append(('Fans & hypes', [
    S('Stitch & Disney', ['stitch', 'disney', 'frozen', 'winnie', 'mickey', 'minnie', 'dombo', 'lilo'], ['dekbedovertrek', 'kostuum volwassen'], 5, 80,
      ['kind', 'tiener', 'haar'], 20, 'A', 'Stitch is een grote hype.', 49500),
    S('Minecraft', ['minecraft', 'creeper', 'piglin', 'enderman'], [], 5, 80,
      ['kind', 'tiener'], 15, 'A', 'Lampjes, LEGO en knuffels.', 480),
    S('Super Mario & Nintendo', ['mario', 'nintendo', 'zelda', 'luigi', 'yoshi', 'kirby', 'switch'], ['game los zonder doos'], 5, 100,
      ['kind', 'tiener', 'hem'], 15, 'A', 'Lampen, LEGO, spaarpotten.', 70),
    S('Harry Potter', ['harry potter', 'zweinstein', 'hogwarts', 'griffoendor', 'snaai', 'patronus'], [], 5, 100,
      ['tiener', 'haar', 'kind'], 15, 'A', 'De Gouden Snaai-lamp is verkocht.', 590),
    S('Gaming & consoles (PlayStation, Xbox)', ['playstation', 'xbox', 'controller', 'gamepad', 'gaming'], ['oplaadkabel', 'reserve', 'skin sticker'], 8, 100,
      ['tiener', 'hem', 'kind'], 15, 'A', 'Lampen, mokken, controllers en headsets.', 3600),
    S('Star Wars & Marvel', ['star wars', 'marvel', 'spider-man', 'spiderman', 'batman', 'avengers', 'grogu', 'stormtrooper'], [], 5, 100,
      ['tiener', 'hem', 'kind'], 12, 'B', '', 140),
    S('Anime & K-pop (One Piece, KPop Demon Hunters)', ['one piece', 'anime', 'naruto', 'dragon ball', 'kpop', 'k-pop', 'demon hunters', 'hello kitty', 'kuromi'], [], 5, 80,
      ['tiener', 'kind'], 12, 'B', 'Hypes onder tieners.', 49500),
    S('Labubu, blindboxes & verzamelfiguren', ['labubu', 'blind box', 'blindbox', 'pop mart', 'mystery', 'funko', 'verrassing'], ['nep', 'replica'], 5, 60,
      ['tiener', 'haar'], 10, 'B', 'Alleen echte merken.', 49500),
    S('F1, racing & voetbalclubs', ['formule 1', 'f1 ', 'red bull racing', 'verstappen', 'ferrari', 'ajax', 'psv', 'feyenoord', 'knvb'], [], 8, 120,
      ['hem', 'tiener', 'kind'], 12, 'B', 'Gezocht maar nog weinig op de site.', 1600),
]))
G.append(('Tech & gadgets', [
    S('Koptelefoons & oordopjes', ['koptelefoon', 'headphone', 'oordopjes', 'earbuds', 'airpods', 'in-ear', 'over-ear'], ['oordopjes slapen schuim', 'gehoorbescherming', 'vervangende', 'kussentjes'], 15, 300,
      ['tiener', 'hem', 'haar'], 15, 'A', 'JBL, Sony, Teufel, Apple.', 27100),
    S('Bluetooth speakers', ['speaker', 'luidspreker', 'jbl', 'boombox', 'bluetooth box'], ['inbouw', 'auto speaker', 'kabel'], 15, 250,
      ['tiener', 'hem', 'iedereen'], 12, 'A', 'JBL Go is een topper.', 12100),
    S('Instax, camera\'s & foto', ['instax', 'polaroid', 'instant camera', 'fotocamera', 'actioncam', 'fotoprinter'], ['film los', 'lens los', 'statief'], 25, 250,
      ['tiener', 'haar'], 10, 'A', '', 22200),
    S('Powerbanks & opladers', ['powerbank', 'draadloze oplader', 'oplaadstation', 'magsafe', 'wireless charger'], ['kabel 1m', 'stekker los'], 10, 80,
      ['iedereen', 'hem', 'tiener'], 10, 'B', 'Mooi of slim, geen saaie zwarte blokjes.', 60500),
    S('Smartwatches & horloges', ['smartwatch', 'horloge', 'activity tracker', 'garmin', 'fitbit'], ['bandje los', 'horlogeband', 'batterij', 'oplaadkabel'], 20, 350,
      ['hem', 'haar', 'tiener'], 20, 'B', 'Horloges staan los van sieraden.', 40500),
    S('Gaming-accessoires', ['gaming headset', 'gaming muis', 'toetsenbord gaming', 'controller', 'gamestoel', 'racestuur', 'mario kart stuur'], ['vervangende', 'kabel'], 10, 200,
      ['tiener', 'hem'], 12, 'A', '', 3600),
    S('Slimme gadgets voor thuis', ['gadget', 'slimme', 'airtag', 'tracker', 'smart home', 'handig', 'uitvinding'], ['kabel', 'adapter', 'e27', 'schakelaar', 'inbouw', 'stekkerdoos', 'camera beveiliging'], 10, 150,
      ['hem', 'iedereen'], 15, 'B', 'Dingen waarvan je niet wist dat ze bestonden.', 8100),
    S('Wekkers & klokken', ['wekker', 'klok', 'wake-up light', 'lichtwekker', 'flipklok'], ['klokwerk', 'uurwerk los'], 10, 100,
      ['iedereen', 'kind', 'tiener'], 10, 'B', '', 33100),
    S('Elektrische steps & fietsen', ['elektrische step', 'e-step', 'elektrische fiets', 'e-bike', 'fatbike'], ['accu los', 'lader', 'band'], 150, 1500,
      ['hem', 'tiener'], 8, 'C', 'iScooter. Altijd de regels van de RDW erbij.', 165000),
]))
G.append(('Koken, tafelen & drinken', [
    S('Keukengadgets', ['keuken gadget', 'keukengadget', 'pizzasnijder', 'hamburgerpers', 'eierkoker', 'kruidenmolen', 'ijsschep', 'flessenopener', 'kurkentrekker', 'spatel', 'snijder'], ['onderdeel', 'reserve', 'mes los 1'], 5, 50,
      ['iedereen', 'hem', 'haar'], 15, 'A', 'Grappig of slim: pizzabijl, machete-spatel.', 320),
    S('Fondue, gourmet & raclette', ['fondue', 'gourmet', 'raclette', 'steengrill', 'chocoladefontein'], ['vervangende', 'pannetjes los'], 20, 150,
      ['iedereen'], 10, 'B', 'Past bij de feestdagen.', 2900),
    S('Popcorn, wafels & snack-apparaten', ['popcornmachine', 'wafelijzer', 'tosti', 'suikerspin', 'ijsmachine', 'slushmachine', 'donut maker', 'cakepop'], ['onderdeel'], 15, 120,
      ['iedereen', 'kind'], 10, 'B', '', 12100),
    S('Kookboeken & bakken', ['kookboek', 'bakboek', 'bakset', 'bakvorm', 'taartvorm', 'cupcake', 'koekjes uitsteker'], [], 8, 50,
      ['haar', 'hem'], 10, 'B', 'Kookboeken bij een partner die geen bol is.', 8100),
    S('BBQ & buiten koken', ['bbq', 'barbecue', 'grill', 'rookhout', 'kamado', 'smoker', 'grilltang', 'bbq set'], ['hoes', 'onderdeel', 'rooster los', 'gasfles'], 10, 200,
      ['hem'], 15, 'A', 'BBQ-cadeaupakketten en hete sauzen ontbreken nog.', 2900),
    S('Messen, planken & snijden', ['messenset', 'koksmes', 'snijplank', 'santoku', 'messenblok', 'damast'], ['vervangend mes', 'slijpsteen los'], 15, 150,
      ['hem', 'haar'], 10, 'B', '', 8100),
    S('Drinkbekers & thermosflessen', ['stanley', 'owala', 'quencher', 'drinkbeker', 'thermosbeker', 'drinkfles', 'isoleerbeker', 'koffiebeker to go'], ['deksel los', 'rietje los'], 10, 60,
      ['tiener', 'haar', 'collega'], 10, 'A', 'Stanley en Owala zijn een hype bij meiden.'),
]))
G.append(('Hobby, sport & buiten', [
    S('Darts', ['dartbord', 'dartpijl', 'darts', 'dartkabinet', 'dartset', 'winmau', 'harrows'], ['shaft los', 'flight los', 'punt los', 'dartmat'], 10, 200,
      ['hem', 'tiener'], 15, 'A', 'Borden en sets, geen losse onderdelen.', 22200),
    S('Multitools & zakmessen', ['multitool', 'zakmes', 'leatherman', 'victorinox', 'zwitsers zakmes', 'bijl', 'opinel'], ['vervangend', 'holster los'], 15, 200,
      ['hem'], 12, 'A', '', 18100),
    S('Verrekijkers & natuur', ['verrekijker', 'telescoop', 'natuurgids', 'vogelboek', 'insectenhotel', 'egelhuis'], [], 15, 200,
      ['hem', 'opa-oma'], 10, 'B', '', 14800),
    S('Vogelhuisjes & tuincadeaus', ['vogelhuis', 'vogelvoeder', 'voederhuis', 'nestkast', 'vogelvoer', 'tuinstekker', 'plantenset', 'kweekset', 'zaden'], ['zak 20 kg', 'kunstmest'], 5, 70,
      ['opa-oma', 'hem', 'haar'], 15, 'A', 'Stijgend bij opa en oma (Lootjestrekken).', 14800),
    S('Planten & bloemen door de brievenbus', ['bloemen door de brievenbus', 'brievenbusbloemen', 'droogbloemen', 'plant cadeau', 'bonsai', 'vetplant', 'kamerplant'], ['kunstplant', 'potgrond'], 10, 60,
      ['haar', 'collega', 'opa-oma'], 10, 'B', '', 320),
    S('Voetbal & balsport', ['voetbal', 'voetbaldoel', 'tafelvoetbal', 'basketbal', 'padel', 'tafeltennis', 'pingpong'], ['voetbalschoen', 'scheenbeschermer', 'net los'], 8, 150,
      ['kind', 'tiener', 'hem'], 10, 'B', '', 1600),
    S('Fitness, yoga & gezond', ['yogamat', 'yoga', 'fitness', 'weerstandsband', 'massagegun', 'foam roller', 'springtouw'], [], 10, 150,
      ['haar', 'hem'], 8, 'C', '', 5400),
    S('Golf', ['golf', 'golfbal', 'golfset', 'putter'], ['golfkar', 'golfauto'], 10, 150,
      ['hem', 'opa-oma'], 6, 'C', 'Ook voor pensioen.', 320),
    S('Belevenissen & uitjes', ['belevenis', 'workshop', 'high tea', 'diner bon', 'uitje', 'overnachting', 'escape room bon', 'ballonvaart', 'quad', 'karten'], [], 20, 200,
      ['haar', 'hem', 'iedereen'], 12, 'B', 'Liefst overal in het land te gebruiken.', 40500),
    S('Metaaldetectie & schatzoeken', ['metaaldetector', 'pinpointer', 'schatzoeken', 'garrett', 'minelab', 'nokta'], ['rookmelder', 'co-melder', 'koolmonoxide', 'rookdetector'], 20, 500,
      ['hem', 'kind'], 6, 'C', '', 9900),
]))
G.append(('Seizoen & feestdagen', [
    S('Adventskalenders', ['adventskalender', 'advent calendar', 'kerstkalender', 'aftelkalender'], [], 10, 120,
      ['iedereen', 'kind', 'haar', 'hem'], 15, 'A', 'LEGO via Amazon is goedkoper dan LEGO zelf.', 33100),
    S('Kerstdecoratie & kerstverlichting', ['kerst', 'kerstbal', 'kerstverlichting', 'kerstfiguur', 'kerstdorp', 'rendier', 'kerstman', 'kerststal'], ['kerstboom 210', 'kunstkerstboom groot', 'piek los', 'lichtsnoer 500'], 8, 80,
      ['haar', 'opa-oma', 'iedereen'], 15, 'B', 'Mooie, verrassende stukken. Niet bij haar of collega op de persoonspagina.', 6600),
    S('Schoencadeautjes (tot € 10)', ['speelgoed', 'knuffel', 'lampje', 'stressbal', 'tashanger', 'sleutelhanger', 'slijm', 'kralen', 'booster'], ['onderdeel'], 2, 10,
      ['kind'], 25, 'A', 'Hypes tot € 10: Stitch, Pokémon, Mario Kart, Beyblade.', 3600),
    S('Uitdeelcadeautjes', ['uitdeel', 'traktatie', 'party favor', 'set van 6', 'set van 12', 'mini'], [], 1, 10,
      ['kind'], 6, 'C', 'Per stuk onder € 2 is schaars bij partners.'),
]))
G.append(('Tassen & accessoires', [
    S('Sleutelhangers & tashangers', ['sleutelhanger', 'tashanger', 'bag charm', 'keychain', 'keyring'], ['sleutelkastje', 'karabiner los'], 3, 25,
      ['tiener', 'kind', 'iedereen'], 15, 'A', 'Mario Kart-tashanger en Pokémon scoorden.', 18100),
    S('Portemonnees & pasjeshouders', ['portemonnee', 'pasjeshouder', 'cardholder', 'card holder', 'wallet', 'moneyclip'], [], 10, 90,
      ['hem', 'haar'], 10, 'B', 'Leer of slim (RFID). Geen modemerken in maten.', 22200),
    S('Rugzakken & tassen', ['rugzak', 'backpack', 'tas ', 'weekendtas', 'toilettas', 'kanken', 'shopper'], ['laptophoes los', 'schooltas set 5'], 15, 150,
      ['tiener', 'haar', 'hem'], 10, 'B', 'Kånken, toilettassen. Geen dure mode.', 18100),
    S('Sieraden- & horlogedozen', ['sieradendoos', 'sieradenkistje', 'horlogedoos', 'horlogebox', 'sieradenboom', 'juwelendoos'], [], 10, 80,
      ['haar', 'hem'], 8, 'B', '', 8100),
    S('Mutsen, sjaals & handschoenen (cadeau)', ['muts met', 'speakermuts', 'muts bluetooth', 'sjaal cadeau', 'touchscreen handschoen', 'oorwarmer'], [], 10, 50,
      ['tiener', 'hem', 'haar'], 6, 'C', 'Alleen als het een cadeau is (speakermuts), geen kleding in maten.', 12100),
]))

# 14-11-2026 (Marius: 'sieraden met al hun vormen zoals ringen, oorbellen, armbanden, kettingen, broche mogen er allemaal bij;
# ik vond de uitgekozen niet mooi, er zijn natuurlijk wel mooie'). Achteraan gezet zodat de nummers van de andere soorten gelijk blijven.
SIER_NIET = ['sieradendoos', 'sieradenbox', 'opbergen', 'reiniger', 'poetsdoek', 'ringmaat', 'sluiting los', 'kettingslot', 'fietsketting',
             'sneeuwketting', 'hondenketting', 'kettingzaag', 'lichtketting', 'sleutelring', 'gordijnring', 'servetring', 'o-ring', 'horlogeband', 'zweetband',
             'festivalband', 'piercing', 'nep', 'replica', 'gordijn', 'jaloezie', 'vouwgordijn']
G.append(('Sieraden', [
    S('Kettingen & hangers', ['ketting', 'collier', 'hanger', 'necklace', 'choker'], SIER_NIET + ['kerstbal hanger', 'kledinghanger', 'deurhanger', 'tashanger', 'sleutelhanger'], 10, 150,
      ['haar'], 20, 'A', 'Kies alleen wat jij echt mooi vindt: fijn, tijdloos of bijzonder. Liefst echt zilver, goud of edelstaal dat niet verkleurt, en een mooie foto.', 18100),
    S('Oorbellen', ['oorbel', 'oorknop', 'creool', 'oorhanger', 'ear cuff', 'earring'], SIER_NIET, 8, 120,
      ['haar', 'tiener'], 20, 'A', 'Kleine knopjes en creolen zijn het makkelijkst als cadeau.', 27100),
    S('Armbanden', ['armband', 'bracelet', 'bangle', 'schakelarmband', 'tennisarmband'], SIER_NIET + ['horloge', 'fitness', 'activity'], 8, 150,
      ['haar', 'hem', 'tiener'], 20, 'A', 'Ook armbanden voor heren (leer, kralen, staal).', 8100),
    S('Ringen', ['zilveren ring', 'gouden ring', 'ring zilver', 'ring goud', 'edelstaal ring', 'stalen ring', 'verstelbare ring', 'damesring', 'herenring', 'ring dames', 'ring heren', 'ringset', 'zegelring', 'aanschuifring', 'solitaire ring', 'zirkonia ring', 'statement ring'], SIER_NIET + ['ringband', 'ringmap', 'ringbandmap', 'oorring', 'boxring', 'ring light', 'ringlamp', 'ringleiding', 'ringbinder', 'bijtring', 'zwemring', 'basketbalring', 'ringtoss', 'string', 'kandelaar', 'kerst', 'spel'], 10, 150,
      ['haar', 'hem'], 15, 'B', 'Verstelbaar is handig als cadeau (je weet de maat vaak niet).', 40500),
    S('Broches & speldjes', ['broche', 'pin badge', 'reverspin', 'enamel pin', 'emaille speld', 'speldje'], SIER_NIET + ['veiligheidsspeld', 'kopspeld', 'punaise', 'haarspeld', 'speldenkussen'], 5, 80,
      ['haar', 'opa-oma'], 8, 'C', 'Mooi voor oma of voor op een jas.'),
    S('Sieraden met naam of letter', ['naamketting', 'naam ketting', 'naamarmband', 'naam armband', 'letterketting', 'initiaal ketting', 'initiaal armband', 'letter ketting', 'geboortesteen', 'coordinaten armband', 'gegraveerde ring', 'gegraveerde ketting', 'gegraveerde armband', 'graveer ketting'], SIER_NIET, 15, 120,
      ['haar', 'hem'], 12, 'B', 'Persoonlijk en geliefd voor moederdag, jubileum en verjaardag. Myka is een bekend merk.'),
    S('Bedels & bedelarmbanden', ['bedel', 'charms', 'bedelarmband'], SIER_NIET + ['bag charm', 'telefoon'], 8, 100,
      ['haar', 'tiener'], 8, 'C', ''),
    S('Kindersieraden', ['kinderketting', 'kinderarmband', 'kinderoorbellen', 'kindersieraden', 'meisjes ketting', 'meisjes armband', 'oorbellen kind', 'armband kind', 'ketting kind', 'kids necklace', 'kids bracelet'], SIER_NIET, 5, 50,
      ['kind'], 8, 'C', 'Alleen met ketting, armband of oorbel in de naam; let op kleine onderdelen.'),
]))


# 14-11-2026 (avond): soorten die de site nu al heeft maar die in de eerste zoeklijst ontbraken (3.377 producten vielen nergens in).
# Ze krijgen een plek in een bestaande groep, maar hun nummers komen achteraan (z1121 ...), zodat de eerdere nummers niet verschuiven.
EXTRA_G = ['Boeken, schrijven & geloof', 'Dieren']   # worden z16 en z17
EXTRA = [
    ('z8', S('Bouwen: knikkerbanen & magnetisch', ['knikkerbaan', 'marble run', 'marble rush', 'magna-tiles', 'magna tiles', 'geomag', 'connetix', 'magnetische bouw', 'magnetisch bouw', 'plus-plus', 'meccano', 'k nex'], [], 10, 150,
      ['kind'], 12, 'B', 'Bouwen zonder LEGO: knikkerbanen en magnetische tegels zijn geliefd.')),
    ('z8', S('Speelgoedauto\'s, treinen & racebanen', ['hot wheels', 'matchbox', 'bruder', 'dickie', 'brio', 'racebaan', 'carrera', 'treinbaan', 'houten trein', 'speelgoedauto', 'speelgoedgarage', 'garage met'], ['onderdeel', 'losse rails 2'], 5, 150,
      ['kind'], 15, 'A', 'Bruder, BRIO en Hot Wheels zijn bekende merken.')),
    ('z16', S('Boeken voor volwassenen', ['thriller', 'bestseller', 'biografie', 'literaire', 'detectiveroman', 'feelgoodroman', 'feelgood roman', 'spannende roman', 'historische roman'], ['t-shirt', ' lp', '(lp)', 'vinyl', 'romance', 'romantic', 'romancing', 'romano', 'romani', 'romantisch', 'dagger', 'ballon', 'figure', 'wijn', 'game', 'ps5', 'switch', 'xbox', 'douchegel', 'showergel', 'sticker', 'kleurboek', 'kookboek', 'puzzelboek', 'fotoboek', 'notitieboek', 'invulboek', 'boekensteun', 'boeklamp', 'e-reader', 'kinderboek', 'prentenboek', 'bijbel'], 8, 60,
      ['haar', 'hem', 'opa-oma'], 15, 'B', 'Een boek staat bovenaan de verlanglijstjes. Liefst een partner die geen bol is.', 1000)),
    ('z8', S('Kinderboeken', ['kinderboek', 'prentenboek', 'voorleesboek', 'leesboek', 'dikkie dik', 'gruffalo', 'geronimo stilton', 'dagboek van een loser', 'kartonboek', 'flapjesboek', 'zoekboek', 'geluidenboek'], ['kleurboek', 'stickerboek'], 5, 40,
      ['kind', 'baby'], 15, 'B', 'Voorlezen en zelf lezen, op leeftijd.')),
    ('z16', S('Bijbels & christelijke boeken', ['kinderbijbel', 'nbv21', 'nbv ', 'statenvertaling', 'studiebijbel', 'huisbijbel', 'jongerenbijbel', 'bijbel in gewone taal', 'basisbijbel', 'bijbel hsv', 'bijbel nbg', 'liedboek', 'psalmen', 'gebedenboek', 'christelijk dagboek', 'bijbels dagboek', 'andachtsboek'], ['katholiek', 'rozenkrans', 'ketting', 'armband', 'oorbel', 'hanger', 'heupflacon', 'wildbijbel', 'wokbijbel', 'vleesbijbel', 'sausbijbel', 'airfryer', 'bbq', 'barbecue', 'bakbijbel', 'soepbijbel', 'kookbijbel', 'cocktail', 'wijnbijbel', 'whisky', 'kaas', 'groente', 'vegan', 'pasta', 'tapas', 'tuinbijbel', 'plantenbijbel'], 8, 100,
      ['iedereen', 'kind', 'opa-oma'], 12, 'B', 'Gereformeerd breder, geen katholieke spullen.')),
    ('z16', S('Christelijke cadeaus', ['christelijk', 'bijbeltekst', 'bijbelvers', 'geloof', 'gezegend', 'zegen', 'kerststal', 'doopkaars', 'doop', 'belijdenis', 'kruisje', 'god is'], ['katholiek', 'rozenkrans', 'maria', 'heilige', 'communie', 'kruisbeeld', 'ketting', 'armband', 'oorbel', 'hanger'], 5, 80,
      ['iedereen', 'opa-oma', 'kind'], 15, 'B', 'Tegeltjes, kaarsen, kerststallen en doopcadeaus. Geen katholieke spullen.')),
    ('z17', S('Voor hondenliefhebbers', ['hond ', 'honden', 'puppy', 'teckel', 'labrador', 'border collie', 'franse bulldog'], ['hondenvoer', 'brokken', 'kauwstaaf', 'vlooien', 'teken', 'ontworming', 'hondenbench', 'hondenhok', 'tuigje', 'riem ', 'halsband', 'hondenmand', 'hondenkussen'], 5, 60,
      ['haar', 'hem', 'iedereen'], 10, 'B', 'Cadeaus voor wie gek is op zijn hond (mok, tegel, speeltje), geen voer of verzorging.')),
    ('z17', S('Voor kattenliefhebbers', ['kat ', 'katten', 'poes', 'kitten'], ['kattenvoer', 'kattenbak', 'kattenbakvulling', 'brokken', 'vlooien', 'krabpaal', 'kattenluik', 'kattenmand'], 5, 60,
      ['haar', 'iedereen'], 10, 'B', 'Cadeaus voor kattengekken: mok, lampje, sokken, puzzel.')),
    ('z1', S('Woondecoratie', ['vaas', 'beeldje', 'beeld ', 'wanddecoratie', 'wandspiegel', 'boekensteun', 'windlicht', 'lantaarn', 'kandelaar', 'bloempot', 'schaal', 'dienblad', 'pip studio', 'riviera maison', 'house doctor', 'balvi'], ['onderdeel', 'tuinbeeld groot', 'plantenschaal plastic', 'weegschaal', 'schaal 1:'], 8, 120,
      ['haar', 'opa-oma', 'iedereen'], 20, 'B', 'Mooi en bijzonder, niet wat elke woonwinkel heeft.')),
    ('z3', S('Haar & make-up', ['fohn', 'stijltang', 'krultang', 'airwrap', 'air styler', 'tangle teezer', 'haarborstel', 'make up', 'make-up', 'lipgloss', 'lippenstift', 'oogschaduw', 'mascara', 'nagellak', 'manicure', 'make-up spiegel', 'ghd', 'dyson'], ['stofzuiger', 'ventilator', 'luchtreiniger'], 8, 500,
      ['haar', 'tiener'], 15, 'B', 'HEMA-stijltang en ghd-föhn staan al in de toppen.')),
    ('z11', S('Koffie- & theeapparaten en theepotten', ['koffiezetapparaat', 'espressomachine', 'espresso machine', 'senseo', 'nespresso', 'dolce gusto', 'melkopschuimer', 'theepot', 'theeset', 'thee-ei', 'v60', 'cold brew', 'french press', 'moka', 'percolator'], ['ontkalker', 'filterzakjes', 'koffiepads', 'capsules 100', 'onderdeel'], 8, 400,
      ['iedereen', 'haar', 'opa-oma'], 12, 'B', 'Philips 2200 en Senseo staan al in de toppen.')),
    ('z10', S('Radio\'s & platenspelers', ['platenspeler', 'radio', 'dab', 'jukebox', 'vinyl', 'cassettespeler'], ['radiografisch', 'autoradio', 'portofoon', 'radiator', 'babyfoon', 'radiostation'], 20, 400,
      ['opa-oma', 'hem', 'haar'], 10, 'B', 'Crosley en Lenco; makkelijk te bedienen voor opa en oma.')),
    ('z16', S('Agenda\'s, kalenders & notitieboeken', ['scheurkalender', 'agenda', 'planner', 'notitieboek', 'paperblanks', 'journal', 'bullet journal', 'weekplanner', 'familieplanner'], ['bureaukalender bedrukken'], 5, 50,
      ['haar', 'collega', 'tiener'], 12, 'B', 'Scheurkalenders van bekende Nederlanders zijn populair rond de feestdagen.')),
    ('z12', S('Tekenen, schilderen & handwerken', ['brushpen', 'aquarel', 'acrylverf', 'schildersset', 'tekenset', 'markers', 'haakpakket', 'breipakket', 'borduurpakket', 'punch needle', 'kalligrafie', 'handlettering', 'zelf beschilderen'], ['muurverf', 'lakverf', 'grondverf'], 8, 80,
      ['haar', 'opa-oma', 'tiener'], 12, 'B', 'Compleet pakket om meteen te beginnen.')),
    ('z12', S('Survival & noodpakketten', ['survival', 'noodpakket', 'noodradio', 'vuurstarter', 'paracord', 'kompas', 'overlevings', 'bushcraft'], ['tent ', 'slaapzak', 'luchtbed', 'code in a box', 'ps5', 'ps4', 'xbox', 'switch', 'nintendo', 'game', 'the survivalists', 'survival series'], 10, 150,
      ['hem'], 8, 'C', 'Marius hield zakmessen en noodpakketten; tenten en kampeerspullen gingen eruit.')),
    ('z11', S('Mooie keukenspullen & bakken', ['etagere', 'taartplateau', 'keukenschort', 'schort', 'theedoek', 'ovenschaal', 'le creuset', 'pip studio', 'joseph joseph', 'bakvorm', 'taartvorm', 'mengkom'], ['onderdeel', 'reserve'], 8, 100,
      ['haar', 'opa-oma'], 10, 'C', 'Alleen wat mooi is om te geven; geen gewone pannen.')),
    ('z12', S('Muziek maken & karaoke', ['ukelele', 'ukulele', 'gitaar', 'keyboard', 'piano', 'karaoke', 'speelgoedmicrofoon', 'drumstel', 'xylofoon', 'mondharmonica', 'kalimba', 'handpan'], ['gitaarsnaar', 'snaren', 'statief los', 'plectrum', 'kabel', 'mechanical', 'gaming', 'toetsenbord', 'bluetooth keyboard', 'draadloos keyboard', '8bitdo'], 10, 200,
      ['kind', 'tiener', 'hem', 'haar'], 10, 'B', 'Karaoke en een kalimba of ukelele zijn leuke cadeaus.')),
    ('z4', S('Alcoholvrije drankjes', ['alcoholvrij', 'alcoholvrije', '0.0', '0,0%', 'kinderchampagne', 'mocktail', 'zero alcohol'], ['deodorant', 'deo ', 'parfum', 'eau de', 'aftershave', 'mondwater', 'haarlak', 'toner', 'spray', 'lotion', 'creme', 'gel ', 'zeep', 'doekjes', 'reiniging'], 5, 60,
      ['iedereen', 'collega', 'kind'], 8, 'C', 'Voor wie niet drinkt, en kinderchampagne voor oud en nieuw.')),
]

# 14-11-2026 19:00: nog meer soorten, zodat alles wat nu op de site staat een soort heeft.
EXTRA += [
    ('z1', S('Tafellampen, bureaulampen & lichtsnoeren', ['tafellamp', 'bureaulamp', 'leeslamp', 'vloerlamp', 'oplaadbare lamp', 'lichtsnoer', 'lichtgordijn', 'solar lamp', 'lampion'], LAMP_NIET, 15, 200,
      ['haar', 'hem', 'iedereen'], 15, 'B', 'Mooie lampen om te geven: design, oplaadbaar of een lichtsnoer.')),
    ('z1', S('Kaarsen, wierook & kandelaars', ['dinerkaars', 'ledkaars', 'kaars in de vorm', 'designkaars', 'wierook', 'kandelaar', 'lantaarn', 'theelichthouder', 'kaarsenhouder'], ['geurkaars'], 5, 60,
      ['haar', 'collega', 'opa-oma'], 15, 'B', 'Gewone en gekke kaarsen, wierook en houders (geurkaarsen hebben een eigen soort).')),
    ('z1', S('Kussens, vloerkleden & deurmatten', ['sierkussen', 'kussenhoes', 'vloerkleed', 'kindervloerkleed', 'deurmat', 'kokosmat'], ['hondenkussen', 'zitkussen tuin'], 8, 150,
      ['haar', 'iedereen'], 15, 'B', 'Een grappige deurmat of een mooi kussen. Grote vloerkleden alleen als ze echt bijzonder zijn.')),
    ('z11', S('Servies, mokken & theeglazen', ['serveerkom', 'serveerschaal', 'ontbijtbord', 'servies', 'theeglas', 'theeglazen', 'koffiekop', 'kop en schotel', 'theemok', 'bunzlau', 'wrendale', 'villeroy'], ['met naam', 'met foto', 'grappig'], 8, 100,
      ['haar', 'opa-oma', 'collega'], 15, 'B', 'Mooi servies en mokken (grappige mokken en mokken met naam hebben een eigen soort).')),
    ('z11', S('Pannen & keukengerei', ['pannenset', 'koekenpan', 'braadpan', 'keukengerei', 'keukenschaar', 'microplane', 'rasp', 'wokpan', 'gietijzeren pan'], ['reserve', 'deksel los'], 10, 200,
      ['haar', 'hem'], 10, 'C', 'Alleen merken en sets die je cadeau geeft.')),
    ('z11', S('Keukenapparaten & airfryers', ['airfryer', 'pizzamaker', 'pastamachine', 'keukenweegschaal', 'poffertjespan', 'vleesthermometer', 'blender', 'staafmixer', 'keukenmachine', 'waterkoker', 'broodrooster', 'sapcentrifuge'], ['onderdeel', 'reserve', 'filter los'], 15, 250,
      ['haar', 'hem'], 10, 'C', 'Apparaten die mensen graag krijgen (airfryer, pizzamaker, pastamachine).')),
    ('z11', S('Voorraadpotten, lunchboxen & opbergen', ['voorraadpot', 'voorraadbus', 'koektrommel', 'kruidenpotjes', 'broodtrommel', 'lunchbox', 'bento'], [], 5, 50,
      ['haar', 'kind'], 8, 'C', 'Mooie potten en trommels, en lunchboxen voor kinderen.')),
    ('z8', S('Speelfiguren & speelsets (Bluey, PAW Patrol)', ['bluey', 'paw patrol', 'beyblade', 'spidey', 'actiefiguur', 'speelset', 'peppa pig', 'gabby', 'schleich', 'dinofiguur'], ['kleding', 'pyjama', 'rugzak', 'beker', 'puzzel'], 5, 80,
      ['kind'], 20, 'A', 'Figuren en speelsets uit series die kinderen nu kijken.')),
    ('z8', S('Schommels, trampolines & zandbak', ['trampoline', 'schommel', 'nestschommel', 'glijbaan', 'zandbak', 'watertafel', 'speelhuisje', 'zandspeelgoed', 'blikgooien'], ['onderdeel', 'veerafdekking', 'overtrek', 'springmat', 'ladder', 'veiligheidsnet', 'beschermrand', 'rand '], 10, 400,
      ['kind'], 10, 'C', 'Buiten spelen in de tuin.')),
    ('z8', S('Poppen & poppenhuizen', ['poppenhuis', 'babypop', 'barbie', 'modepop', 'poppenwagen', 'baby born', 'sylvanian'], ['kleding los'], 8, 150,
      ['kind'], 15, 'A', 'Poppen, poppenhuizen en wat erbij hoort.')),
    ('z8', S('Toniebox, tiptoi & leren', ['toniebox', 'tonie ', 'tonies', 'tiptoi', 'microscoop', 'telescoop', 'wereldbol', 'leerspel'], [], 8, 120,
      ['kind'], 12, 'B', 'Luisteren en leren: Toniebox met figuurtjes, tiptoi, microscoop.')),
    ('z10', S('Tablets, e-readers & tv-spullen', ['tablet', 'ipad', 'e-reader', 'kobo', 'kindle', 'soundbar', 'beamer', 'robotstofzuiger', 'telefoonhouder', 'telefoonhoesje', 'slimme speaker'], ['hoesje tablet los', 'screenprotector', 'tabletten', 'tabletop', 'sleeve', 'hoes '], 20, 500,
      ['hem', 'haar', 'opa-oma'], 10, 'C', 'Grotere tech-cadeaus.')),
    ('z12', S('Kamperen, wandelen & zaklampen', ['campingtafel', 'kampvuur', 'campingbestek', 'thermosfles', 'zaklamp', 'hoofdlamp', 'wandelschoenen', 'hangmat', 'hengel', 'visset'], ['batterij los'], 10, 200,
      ['hem'], 10, 'C', 'Buiten op avontuur. Marius haalde tenten en kampeerspullen eerder weg: alleen echte cadeaus.')),
    ('z12', S('Fiets, zwemmen & wintersport', ['fietsbel', 'fietsverlichting', 'fietshelm', 'fietscomputer', 'fietsmand', 'zwembril', 'duikbril', 'slee ', 'sleetje', 'skibril'], ['band ', 'binnenband', 'ketting fiets', 'remblok'], 8, 120,
      ['kind', 'hem'], 8, 'C', 'Leuke fietsbellen, helmen en spullen voor zwemmen en sneeuw.')),
    ('z12', S('Tuin, planten & buiten zitten', ['windgong', 'tuinkabouter', 'vogelbad', 'tuindecoratie', 'plantenpot', 'bloempot', 'moestuin', 'zaden', 'kweekset', 'vuurkorf', 'terrasverwarmer', 'tuinmeubel', 'tuinthermometer'], ['kunstmest', 'onkruid'], 5, 200,
      ['opa-oma', 'haar', 'hem'], 12, 'B', 'Opa en oma krijgen steeds vaker iets voor de tuin.')),
    ('z12', S('Gereedschap & klussen', ['accuboormachine', 'boormachine', 'schroevendraaier', 'bitset', 'dopsleutelset', 'gereedschapsset', 'gereedschapskoffer', 'combinatietang', 'heggenschaar', 'grasmaaier', 'bladblazer', 'hogedrukreiniger'], ['accu los', 'boor los', 'reserve'], 15, 250,
      ['hem'], 10, 'C', 'Alleen voor Voor hem en Vaderdag; niet in de toppers.')),
    ('z3', S('Gezicht, bad & lichaam', ['gezichtsverzorging', 'serum', 'gezichtsreiniger', 'dagcreme', 'nachtcreme', 'badolie', 'badmelk', 'shampoobar', 'zeep', 'bodylotion', 'body butter', 'massage', 'elektrische tandenborstel', 'monddouche'], ['navulling', 'opzetborstel'], 5, 120,
      ['haar', 'hem'], 15, 'B', 'Verzorging van bekende merken (The Ordinary, CeraVe, Weleda, Kneipp).')),
    ('z3', S('Scheerapparaten & trimmers', ['scheerapparaat', 'trimmer', 'oneblade', 'multigroom', 'baardtrimmer', 'ontharing', 'ipl ontharing'], ['mesjes', 'opzetstuk los', 'reserve', 'gopro', 'pack'], 20, 300,
      ['hem'], 8, 'C', 'Philips en Braun.')),
    ('z4', S('Wijn- & baraccessoires', ['wijnkoeler', 'schenktuit', 'kurkentrekker', 'wijnset', 'decanteer', 'karaf', 'ijsballenvorm', 'whisky stones', 'cocktailset', 'wijnfleshouder'], [], 8, 150,
      ['hem', 'haar', 'collega'], 10, 'B', 'Voor wie van wijn of een borrel houdt.')),
    ('z14', S('Zonnebrillen, petten & riemen', ['zonnebril', 'ray-ban', 'oakley', 'pet ', 'cap ', 'riem '], ['brillenkoord', 'reserve glazen', 'masker', 'tegeltje', 'kostuum'], 10, 200,
      ['hem', 'haar', 'tiener'], 8, 'C', 'Merken die mensen graag krijgen.')),
    ('z14', S('Kleding met tekst & pyjama\'s', ['t-shirt met', 'rompertje', 'slabbetje', 'sweater', 'pyjama', 'onesie', 'big sister', 'big brother'], [], 8, 50,
      ['iedereen', 'baby', 'kind'], 10, 'C', 'Alleen kleding die een grap of cadeau is (Marius haalde gewone kleding in maten weg).')),
    ('z14', S('Schoenen & sneakers', ['sneaker', 'laarzen', 'boots', 'kinderschoen'], ['tegeltje', 'waszak', 'kong', 'customization', 'schoenpoets', 'veters'], 15, 150,
      ['kind', 'tiener'], 5, 'C', 'Marius haalde bijna alle schoenen weg; alleen kinderschoenen en een paar bijzondere.')),
    ('z16', S('Strips, puzzelboeken & weetboeken', ['kuifje', 'asterix', 'lucky luke', 'suske en wiske', 'donald duck', 'manga', 'stripboek', 'puzzelboek', 'kruiswoord', 'denksport', 'sudoku', 'weetboek'], ['kleurboek', 'ps4', 'ps5', 'switch', 'xbox', 'move compatible', 'game'], 5, 60,
      ['opa-oma', 'kind', 'tiener', 'hem'], 12, 'B', 'Strips voor jong en oud en puzzelboeken voor opa en oma.')),
    ('z16', S('Muziek & films (cd, lp, dvd)', [' cd', '(cd)', ' lp', '(lp)', 'vinyl', ' dvd', 'blu-ray'], ['cd-speler', 'lp-speler', 't-shirt', 'hoodie'], 10, 80,
      ['hem', 'haar', 'tiener'], 8, 'C', 'Nieuwe albums en films.')),
    ('z17', S('Kleine huisdieren, paarden & kippen', ['hamster', 'konijn', 'cavia', 'knaagdier', 'kippenhok', 'paardrijden', 'paard ', 'terrarium', 'aquarium', 'vogelkooi'], ['voer', 'hooi los', 'zaagsel', 'kostuum', 'hamsterz', 'hamster heroes', 'ps5', 'switch', 'game'], 5, 150,
      ['kind', 'iedereen'], 8, 'C', 'Speeltjes en spullen voor kleine huisdieren en paardenmeisjes.')),
]

# Elke vakje-plek op de site hoort bij precies een soort (voor stap 2: de producten van de site ernaast leggen).
# Het langste stuk dat past wint; staat een product ook bij een soort met zoekwoorden, dan telt die ook.
VAK = {
    'Tafellampen, bureaulampen & lichtsnoeren': ['wonen/verlichting/tafellampen', 'wonen/verlichting/lichtsnoeren', 'tuin-klussen/buiten-leven/buitenverlichting', 'elektronica/tablets-tv-slim-wonen/slimme-lampen-sfeerlicht'],
    'Zoutlampen, maanlampen & sfeerlampen': ['wonen/verlichting'],
    'Kaarsen, wierook & kandelaars': ['wonen/kaarsen-geur/kaarsen', 'wonen/kaarsen-geur/wierook', 'wonen/kaarsen-geur/kandelaars-lantaarns'],
    'Geurkaarsen': ['wonen/kaarsen-geur/geurkaarsen'], 'Geurstokjes & huisparfum': ['wonen/kaarsen-geur/huisgeuren-geurstokjes'],
    'Kussens, vloerkleden & deurmatten': ['wonen/woontextiel'], 'Plaids & fleecedekens': ['wonen/woontextiel/plaids'], 'Warmteknuffels & kruiken': ['wonen/woontextiel/kruiken-warmte'],
    'Woondecoratie': ['wonen/woondecoratie'], 'Fotocadeaus': ['wonen/foto-persoonlijk'], 'Fotoboeken & kalenders': ['wonen/foto-persoonlijk/fotoboeken'],
    'Kerstdecoratie & kerstverlichting': ['wonen/kerstdecoratie'],
    'Servies, mokken & theeglazen': ['koken-tafelen/tafelen-borrel/servies', 'koken-tafelen/mokken-glazen'], 'Borrelplanken & tapas': ['koken-tafelen/tafelen-borrel'],
    'Pannen & keukengerei': ['koken-tafelen/koken-bakken/pannen-messen'], 'Keukenapparaten & airfryers': ['koken-tafelen/koken-bakken/keukenapparaten', 'koken-tafelen/koken-bakken/airfryers'],
    'Voorraadpotten, lunchboxen & opbergen': ['koken-tafelen/koken-bakken/opbergen-voorraadpotten', 'koken-tafelen/koken-bakken/drinkflessen-lunchboxen'],
    'Mooie keukenspullen & bakken': ['koken-tafelen/koken-bakken'], 'Koffie- & theeapparaten en theepotten': ['koken-tafelen/koffie-thee-zetten'],
    'Speelfiguren & speelsets (Bluey, PAW Patrol)': ['speelgoed/speelfiguren-voertuigen'], 'Speelgoedauto\'s, treinen & racebanen': ['speelgoed/speelfiguren-voertuigen/racebanen-treinen'],
    'Schommels, trampolines & zandbak': ['speelgoed/buiten-spelen'], 'Rijden: loopfietsen, steps & loopauto\'s': ['speelgoed/buiten-spelen/steps-loopfietsen', 'sport-outdoor/fietsen-steps/skateboards'],
    'Poppen & poppenhuizen': ['speelgoed/poppen-knuffels'], 'Knuffels & Squishmallows': ['speelgoed/poppen-knuffels/knuffels'],
    'Toniebox, tiptoi & leren': ['speelgoed/leren-ontdekken'], 'Baby & peuter': ['speelgoed/baby-peuter'],
    'Bouwen: knikkerbanen & magnetisch': ['speelgoed/bouwen'], 'LEGO & DUPLO': ['speelgoed/bouwen/lego'], 'Verkleden & rollenspel': ['speelgoed/rollenspel-verkleden'],
    'Kinderspellen': ['spellen-puzzels/kinderspellen'], 'Bordspellen': ['spellen-puzzels/bordspellen'], 'Puzzels': ['spellen-puzzels/puzzels'], '3D-puzzels & houten bouwpakketten': ['spellen-puzzels/puzzels/3d-puzzels', 'hobby/modelbouw'],
    'Pokémon & verzamelkaarten': ['spellen-puzzels/pokemon-verzamelkaarten'],
    'Gaming & consoles (PlayStation, Xbox)': ['elektronica/gaming'], 'Gaming-accessoires': ['elektronica/gaming/controllers-accessoires', 'elektronica/gaming/gaming-headsets', 'elektronica/gaming/gamestoelen', 'elektronica/gaming/vr-brillen'],
    'Tablets, e-readers & tv-spullen': ['elektronica/tablets-tv-slim-wonen'], 'Instax, camera\'s & foto': ['elektronica/foto-video'], 'Smartwatches & horloges': ['elektronica/smartwatches', 'mode-sieraden/horloges'],
    'Bluetooth speakers': ['elektronica/audio/bluetooth-speakers'], 'Radio\'s & platenspelers': ['elektronica/audio/platenspelers', 'elektronica/audio/radio-s'],
    'Slimme gadgets voor thuis': ['elektronica/gadgets/handige-gadgets'], 'Grappige gadgets': ['elektronica/gadgets/fun-retro-gadgets'],
    'Kamperen, wandelen & zaklampen': ['sport-outdoor/outdoor-avontuur'], 'Multitools & zakmessen': ['sport-outdoor/outdoor-avontuur/messen-multitools'], 'Verrekijkers & natuur': ['sport-outdoor/outdoor-avontuur/verrekijkers'], 'Survival & noodpakketten': ['sport-outdoor/outdoor-avontuur/noodpakket-survival'],
    'Fiets, zwemmen & wintersport': ['sport-outdoor/fietsen-steps/fietsaccessoires', 'sport-outdoor/fietsen-steps/fietshelmen', 'sport-outdoor/water-wintersport'], 'Elektrische steps & fietsen': ['sport-outdoor/fietsen-steps/elektrische'],
    'Darts': ['sport-outdoor/darts'], 'Metaaldetectie & schatzoeken': ['sport-outdoor/metaaldetectie'], 'Voetbal & balsport': ['sport-outdoor/balsport-spel'], 'Golf': ['sport-outdoor/balsport-spel/golf'], 'Belevenissen & uitjes': ['belevenissen'],
    'Tuin, planten & buiten zitten': ['tuin-klussen/tuin-planten', 'tuin-klussen/buiten-leven'], 'BBQ & buiten koken': ['tuin-klussen/buiten-leven/bbq-buitenkoken'], 'Gereedschap & klussen': ['tuin-klussen/klussen', 'tuin-klussen/tuingereedschap'],
    'Gezicht, bad & lichaam': ['beauty-verzorging/bad-huid-spa'], 'Slapen & ontspannen': ['beauty-verzorging/bad-huid-spa/spa-ontspanning', 'beauty-verzorging/bad-huid-spa/massage'],
    'Scheerapparaten & trimmers': ['beauty-verzorging/scheren-baard'], 'Giftsets voor hem & baardverzorging': ['beauty-verzorging/giftsets/giftsets-voor-hem', 'beauty-verzorging/scheren-baard/baardverzorging'], 'Giftsets voor haar': ['beauty-verzorging/giftsets/giftsets-voor-haar'],
    'Parfum voor haar': ['beauty-verzorging/parfum/damesparfum', 'beauty-verzorging/parfum/parfumsets'], 'Parfum voor hem': ['beauty-verzorging/parfum/herenparfum'], 'Haar & make-up': ['beauty-verzorging/make-up-haar'],
    'Lekkernijen & cadeaupakketten': ['eten-drinken/lekkernijen', 'eten-drinken/cadeaupakketten', 'eten-drinken/chocolade-snoep/koekjes-stroopwafels'], 'Koffie & thee cadeaus': ['eten-drinken/lekkernijen/thee', 'eten-drinken/lekkernijen/koffie'],
    'Chocolade & bonbons': ['eten-drinken/chocolade-snoep'], 'Wijn, port & bubbels': ['eten-drinken/wijn-bubbels'], 'Whisky, rum & sterke drank': ['eten-drinken/bier-sterke-drank'], 'Bier: pakketten & glazen': ['eten-drinken/bier-sterke-drank/bierpakketten'],
    'Wijn- & baraccessoires': ['eten-drinken/drankaccessoires'],
    'Zonnebrillen, petten & riemen': ['mode-sieraden/accessoires'], 'Mutsen, sjaals & handschoenen (cadeau)': ['mode-sieraden/accessoires/sjaals-mutsen', 'mode-sieraden/accessoires/handschoenen'], 'Sleutelhangers & tashangers': ['mode-sieraden/accessoires/sleutelhangers'],
    'Kleding met tekst & pyjama\'s': ['mode-sieraden/kleding'], 'Cadeausokken & warme sokken': ['mode-sieraden/kleding/sokken'], 'Foute kersttruien & feestkleding': ['mode-sieraden/kleding/kersttruien'],
    'Schoenen & sneakers': ['mode-sieraden/schoenen-sloffen'], 'Pantoffels & sloffen': ['mode-sieraden/schoenen-sloffen/pantoffels-sloffen'],
    'Rugzakken & tassen': ['mode-sieraden/tassen-portemonnees'], 'Portemonnees & pasjeshouders': ['mode-sieraden/tassen-portemonnees/portemonnees-pasjeshouders'],
    'Kettingen & hangers': ['mode-sieraden/sieraden/kettingen', 'christelijk/sieraden/kettingen'], 'Oorbellen': ['mode-sieraden/sieraden/oorbellen'], 'Armbanden': ['mode-sieraden/sieraden/armbanden', 'christelijk/sieraden/armbanden'],
    'Ringen': ['mode-sieraden/sieraden/ringen'], 'Sieraden met naam of letter': ['mode-sieraden/sieraden/sieraden-met-naam'], 'Sieraden- & horlogedozen': ['mode-sieraden/sieraden/sieradendozen'],
    'Boeken voor volwassenen': ['boeken-media/boeken'], 'Strips, puzzelboeken & weetboeken': ['boeken-media/boeken/strips-manga', 'boeken-media/boeken/puzzelboeken'], 'Muziek & films (cd, lp, dvd)': ['boeken-media/muziek-films'],
    'Christelijke cadeaus': ['christelijk'],
    'Voor hondenliefhebbers': ['dieren/hond'], 'Voor kattenliefhebbers': ['dieren/kat'], 'Kleine huisdieren, paarden & kippen': ['dieren/andere-dieren'],
    'Tekenen, schilderen & handwerken': ['hobby/schilderen-tekenen', 'hobby/handwerken', 'hobby/zelf-maken'],
    'Kaartspellen & partyspellen': ['spellen-puzzels/kaart-partyspellen'], 'Breinbrekers & escape-spellen': ['spellen-puzzels/breinbrekers-escape'],
    'Knutselen voor kinderen': ['speelgoed/knutselen'], 'Slijm, kinetisch zand & klei': ['speelgoed/knutselen/klei-slijm'],
    "Agenda's, kalenders & notitieboeken": ['hobby/papier-planners'], 'Kinderboeken': ['boeken-media/kinderboeken'],
    'Koptelefoons & oordopjes': ['elektronica/audio/koptelefoons', 'elektronica/audio/oordopjes'], 'Fitness, yoga & gezond': ['sport-outdoor/fitness-yoga'],
    'Alcoholvrije drankjes': ['eten-drinken/alcoholvrij'], 'Bedels & bedelarmbanden': ['mode-sieraden/sieraden/bedels'], 'Muziek maken & karaoke': ['hobby/muziek-maken'], "Bestuurbare auto's, robots & drones": ['hobby/rc-auto-s'],
}

def cats():
    out, n = [], 1000
    for gi, (gnaam, soorten) in enumerate(G, 1):
        gid = 'z%d' % gi
        out.append({'id': gid, 'naam': gnaam, 'ouder': None, 'volgorde': gi})
        for si, s in enumerate(soorten, 1):
            n += 1
            d = {'id': 'z%d' % n, 'ouder': gid, 'volgorde': si}
            d.update(s)
            out.append(d)
    for gi, gnaam in enumerate(EXTRA_G, len(G) + 1):
        out.append({'id': 'z%d' % gi, 'naam': gnaam, 'ouder': None, 'volgorde': gi})
    for gid, s in EXTRA:
        n += 1
        d = {'id': 'z%d' % n, 'ouder': gid, 'volgorde': 50 + n}
        d.update(s)
        out.append(d)
    namen = {d['naam']: d for d in out if d['ouder']}
    for naam, vakken in VAK.items():
        assert naam in namen, naam
        namen[naam]['vak'] = vakken
    return out

if __name__ == '__main__':
    c = cats()
    data = {'uitleg': 'Zoeklijst LeukeKeuze (14-11-2026). Elke soort zoekt slim in alle partners: zoek = woorden (een van deze), niet = woorden die eruit moeten, min/max = prijs, doel = ongeveer hoeveel we er willen, prio A/B/C.',
            'cats': c, 'volgende': 2000}
    json.dump(data, open(sys.argv[1], 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    s = [x for x in c if x['ouder']]
    print('groepen', len(G), 'soorten', len(s), 'doel totaal', sum(x['doel'] for x in s),
          'A', sum(1 for x in s if x['prio'] == 'A'), 'B', sum(1 for x in s if x['prio'] == 'B'), 'C', sum(1 for x in s if x['prio'] == 'C'))
