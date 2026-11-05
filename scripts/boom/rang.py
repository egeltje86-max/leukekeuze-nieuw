# Hoe goed is een product als cadeau om bovenaan te staan? (5-11-2026, wens Marius en Nova: de beste, meest gezochte cadeaus bovenaan, goed gemixt)
# Per vakje een cadeau-niveau: A = topcadeau waar veel mensen naar zoeken, C = nuttig maar zelden het cadeau dat je zoekt. De rest is B.
A = set('''LEGO|LEGO Duplo|Playmobil|Knuffels|Squishmallows|Verzamelkaarten (Pokémon)|Bordspellen voor het gezin|Partyspellen|Kinderspellen|Kaart- & dobbelspellen|Strategiespellen|
Speelgoedauto's & garages|Radiografisch bestuurbaar|Racebanen & treinen|Modepoppen|Babypoppen|Poppenhuizen & accessoires|Actiefiguren & superhelden|Dieren- & dinofiguren|Knutselsets|Klei & slijm|
Experimenteren & wetenschap|Luisterboxen (Toniebox)|Magnetisch bouwen|Knikkerbanen|Speelkeukens & winkeltjes|Verkleedkleding|Legpuzzels|Babygyms & activiteitenspeelgoed|Steps & loopfietsen|
Consoles|Games|Controllers & accessoires|Gaming-headsets|Koptelefoons|Oordopjes|Bluetooth-speakers|Smartwatches|Camera's & instant camera's|Platenspelers|Fun & retro gadgets|
Kettingen|Armbanden|Oorbellen|Sieraden met naam|Dameshorloges|Herenhorloges|Damesparfum|Herenparfum|Parfumsets|Giftsets voor haar|Giftsets voor hem|Bruisballen|Bad- & doucheproducten|
Geurkaarsen|Plaids|Pyjama's & badjassen|Pantoffels & sloffen|Sneakers|Handtassen|Chocolade|Chocoladeletters|Cadeaupakketten & manden|Brievenbuscadeaus|Whisky|Gin|Champagne|Rode wijn|Port & dessertwijn|
Dartpijlen|Dartborden|Metaaldetectors|Noodpakketten|Romans & thrillers|Kookboeken|Prentenboeken|Voorleesboeken|Hondenspeelgoed|Kattenspeelgoed|Elektrische tandenborstels|Massage|
Föhns & stijltangen|Scheerapparaten & trimmers|Koffiemachines|Sfeerlampen|Kerstverlichting|Kerststallen|Kerststallen & engelen|Bijbels|Fotoboeken|Diamond painting|Bierpakketten|Speciaalbier|Cocktailsets'''.replace('\n', '').split('|'))
C = set('''Moestuin & zaden|Regentonnen & compost|Handgereedschap tuin|Tuinmachines|Opbergen & voorraadpotten|Drinkflessen & lunchboxen|Deurmatten|Muziekaccessoires|Telefoonaccessoires|
Powerbanks & opladers|Reisaccessoires|Toilettassen|Sauzen & kruiden|Noten & zoutjes|Siropen & mocktails|Kaarten & posters|Borduren & punch needle|EHBO & brand|Water & eten|Koken & warmte|
Klimmen & boulderen|Aquarium|Kippen|Reptielen & terrarium|Dvd & Blu-ray|Cd's|Handgereedschap|Riemen & petten|Sokken|Notitieboeken|Flights & shafts|Opbergen & dienbladen|Glazen|Servies|Bakken|
Haarverzorging|Lichaamsverzorging|Nagels|Monddouches & flossers|Fietsaccessoires|Zaklampen & hoofdlampen|Konijn & knaagdier|Vogels|Paardrijden|Tassen & onderweg|Licht & stroom'''.replace('\n', '').split('|'))
def niveau(vak):
    if not vak: return 0.6
    return 1.0 if vak in A else 0.35 if vak in C else 0.65
def rang(vak, wil=None, topper=False, nieuw=False, hits=False, sfeer=False):
    """0 tot ongeveer 1,5. Hoger = hoger in 'Aanbevolen'."""
    w = (wil if isinstance(wil, (int, float)) else 60) / 100
    return round(0.45 * niveau(vak) + 0.35 * w + (0.2 if topper else 0) + (0.1 if nieuw else 0) + (0.15 if hits else 0) + (0.04 if sfeer else 0), 3)
