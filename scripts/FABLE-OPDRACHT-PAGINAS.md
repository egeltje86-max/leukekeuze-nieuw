# Opdracht voor Fable: elke pagina klopt én verkoopt

Gemaakt op 10 november 2026 door Claude, in opdracht van Marius.
**Lees eerst `CLAUDE.md` helemaal.** Die afspraken gaan altijd voor. Waar dit document strenger is, geldt dit document.

---

## 0. Wat Marius wil, in één alinea

Geen enkele klant mag nog een product zien dat niet op die pagina hoort: geen koekjes bij parfum, geen gereedschap bij "voor haar", geen bouwplaat bij Duplo, geen herengeur bij "voor haar", geen roze bij "voor hem". En op elke pagina moet het eerste scherm zo goed zijn dat mensen meteen denken "dit is 'm" en klikken, zonder verder te zoeken. De volgorde moet op koop-psychologie gebaseerd zijn: verrassing, herkenning, een makkelijke ja, en eerlijk.

## 1. Zuinig werken (credits)

Marius betaalt per stukje werk. Werk daarom zo:

1. **Nooit `assets/js/producten.js` (13 MB) of `producten-lean.js` helemaal lezen.** Schrijf kleine node- of python-scripts die tellingen en korte lijstjes printen (maximaal 40 regels uitvoer per keer).
2. **Regels, geen handwerk.** Leg alles vast in data, zoals regels per pagina, woordlijsten en scores. Eén script past het toe op alle 11.000 producten. Kies alleen met de hand voor de eerste 6 plekken van de 25 drukste pagina's, en ook dan met een script dat kandidaten voorstelt.
3. **Eén bouw per fase.** De volledige bouw met controle duurt ongeveer 12 minuten. Verzamel eerst alle wijzigingen van een fase en bouw dan één keer.
4. **Screenshots alleen van het eerste telefoonscherm (390 px).** Doe dat voor de 25 drukste pagina's, aan het eind van een fase. Geen schermafbeeldingen van hele pagina's.
5. **Geen hulp-AI's of sub-agents starten.** Alles zelf doen, in deze volgorde.
6. **Klaar is klaar.** Maak het niet mooier dan gevraagd.

## 2. Wat er al is (gebruik dit, bouw niets dubbel)

| Onderdeel | Waar | Wat het doet |
|---|---|---|
| Plaatsing | `scripts/boom/plaats.js` | Zet elk product in afdeling > groep > vakje. Vaste regels: budgetvakken, speelgoed 3+ niet bij baby, oude cat `geuren-verzorging` alleen voor beauty. |
| Correcties | `scripts/boom/correcties.json` | `vak[id]`, `nietIn[id]`, `voorWeg[id]`, `voorErbij[id]`, `status[id]`, `tagErbij`. Altijd `indent=1, ensure_ascii=False` en een regel in `_uitleg`. |
| Voor wie | `assets/js/data.js` → `LK_PERSONEN` | hem, haar, kinderen, tieners, opa-oma, collega, baby, elk met `subs` en `vakken`. |
| Gelegenheden | `LK_GELEGENHEDEN` (16) | moederdag, vaderdag, kerst, geboorte, valentijn, verjaardag, jubileum, housewarming, sinterklaas, bedankt, juf-meester, uitdeelcadeautjes, beterschap, geslaagd, afscheid-pensioen, doop-belijdenis. |
| Collecties | `LK_COLLECTIES` (13) | aanbiedingen, kortingscodes, black-friday, toppers-van-nu, persoonlijke, brievenbus, kleine-cadeautjes, originele, adventskalenders, cadeaupakketten, grappige, belevenissen (cadeaubonnen verborgen). |
| Volgorde | `assets/js/app.js` → `apartEerst()`, `metTopkeuze()`, `mix()` | Aparte cadeaus bovenaan (bij brede pagina's 1 per groep). Toppers per pagina staan in `assets/js/topkeuze.js`. |
| Controle | `scripts/controle/doelgroep.js`, `leeftijd.js`, `budget.js` | Draaien mee in `alles.js`. |
| Product-velden | lean | `voor`, `moment`, `tags`, `soort`, `prijs`, `oudePrijs`/`van` (echte korting), `leeftijd`, `merk`, `populair`, `favoriet`, `rang`, `afd/groep/vak`. |

Wat er nu in de data zit: 10.975 zichtbare producten.

| Veld | Aantallen |
|---|---|
| `voor` | haar 4797 · hem 3663 · iedereen 3330 · tiener 2310 · opa-oma 847 · collega 797 · kind 793 · baby 334 |
| `moment` | vooral kerst, verjaardag en sinterklaas. Moederdag, vaderdag, bedankt en geboorte zijn bijna leeg. Daar zit werk. |

## Klaargezet door Claude (scheelt jou werk)
- `scripts/boom/paginaregels-concept.json`: alle 329 pagina's (Voor wie + subs, gelegenheden, collecties, categorie-groepen) met de vakken die er nu aan hangen, `nooit_woorden` per doelgroep, prijsgrenzen en de regex voor losse onderdelen. Controleer, vul aan, hernoem naar `paginaregels.json`.
- `scripts/boom/volgorde-concept.json`: de scoreformule, de 6 rollen van de heldenrij, de blokregels en de afspraken per drukke pagina. Hernoem naar `volgorde.json` en gebruik het in `ordenPagina()`.

## 3. Fase A: elk product op de goede plek (eerst dit)

### A1. Eén regelbestand per pagina

Maak `scripts/boom/paginaregels.json`. Elke pagina (Voor wie + sub, gelegenheid, collectie en afdeling/groep) krijgt deze velden:

```json
"voor/haar/parfum-verzorging": {
  "mag": { "afd": ["beauty-verzorging"], "groep": ["parfum","giftsets","bad-douche","huid-gezicht","make-up-nagels","haar","wellness"] },
  "nooit_woorden": ["heren","for men","pour homme","baard","scheer","gereedschap","koek","servies","sushi","cocktail"],
  "nooit_vak": ["herenparfum","scheerapparaten-trimmers"],
  "prijs": [5, 250],
  "leeftijd": null,
  "kleur_niet": []
}
```

- **Script `scripts/boom/paginaregels.js`:** draait in `plaats.js` en past de regels toe. Breekt een product een regel, dan komt het **automatisch** in `nietIn` van die pagina. Dus niet met de hand per product.
- **Uitbreiding van `scripts/controle/doelgroep.js`:** dezelfde regels worden ook gecontroleerd. Elke overtreding is een fout, en dan is de bouw niet SCHOON.
- **Woordlijsten:** gebruik dezelfde woordlijsten als de zoekfunctie (`LK_NIETWOORDEN`, `scripts/boom/vakwoorden.py`), zodat het één systeem blijft.

### A2. Vaste regels per doelgroep (gelden voor alle subs)

| Pagina | Hoort er | Hoort er nooit |
|---|---|---|
| **Voor hem** | horloges, darts, zakmessen, whisky/bier, gadgets, gaming, LEGO voor volwassenen, BBQ, herenparfum, portemonnees, pantoffels heren | dameskleding/-sieraden/-parfum, make-up, roze productfoto's (gebruik `beeldHem`), baby-/kinderspeelgoed, bloemen, tampons/verzorging voor vrouwen |
| **Voor haar** | sieraden, parfum dames + unisex, wonen/sfeer, bloemen, tassen, wijn/bubbels, creatief, yoga, puzzels | herengeur (behalve unisex: CK One, Tom Ford Oud Wood mogen), baard/scheer, gereedschap, darts, gaming-headsets, auto-accessoires |
| **Kinderen (4–12)** | speelgoed met leeftijd 3–12, kinderboeken, knutselen, buiten, kinderkleding | alcohol, messen/zakmessen (behalve "My First Victorinox" vanaf 8), kleurboeken voor volwassenen, horror, 18+, baby 0–2-speelgoed, cadeaubonnen voor volwassenen |
| **Tieners (12–18)** | gaming, gadgets, mode, geuren, LEGO, sieraden, kamer, journals | alcohol, baby/peuter, "mijn eerste…", kinderprentenboeken, opa/oma-dingen (leesloep, rollator, rooster) |
| **Opa & oma** | puzzels, foto & herinnering, tuin/vogels, warm & comfortabel, radio, koffie/thee, klokken, boeken, lekkers | gaming, tiener-mode, speelgoed, energiedrank, ingewikkelde tech zonder uitleg |
| **Collega** | lootjes €5–25, bedankje, afscheid, mokken met tekst, lekkers, brievenbus | dure luxe (> €50 bij lootjes), lingerie/intiem, alcohol > €40, grappen die kwetsen |
| **Baby** | kraam, kleding 0–2, rammelaars, knuffels met naam, babyshower | speelgoed 3+ of met kleine onderdelen (bestaat al als regel), snoep, schermen |

**Gelegenheden.** Zorg dat `moment` klopt via regels op vakjes en tags. Voorbeelden:

| Gelegenheid | Regel |
|---|---|
| moederdag | haar-producten met tag/vak sieraden, bloemen, wellness, wonen, met-naam |
| vaderdag | hem-producten (zelfde logica) |
| geboorte | baby |
| beterschap | warm, lekkers, puzzels, boeken, bloemen; nooit wijn |
| geslaagd | tieners + volwassen, persoonlijk, horloge, rugzak, cadeaubon |
| juf-meester | onder €20, mokken, lekkers, bedankjes |
| uitdeelcadeautjes | onder €5 per stuk of sets |
| sinterklaas | schoencadeautjes en onder €15 eerst |
| kerst | kerstsfeer + de grote cadeaus |

Lege gelegenheden mogen niet live staan. Komen er minder dan 24 producten in, dan gaat de pagina uit het menu en de sitemap, met een redirect naar de beste ouderpagina.

**Bekende fouten die nooit meer mogen voorkomen** (maak voor elk een regel én een test in de controle):

- koekjes, servies, sushi- en cocktailsets op parfumpagina's
- herengeur bij Voor haar
- losse onderdelen (rails, uitbreidingssets, bouwplaten, navullingen, borstelkoppen) in speelgoed- en cadeauvakken; die horen alleen in "accessoires/uitbreidingen" als dat vak bestaat, en anders weg
- kleurboeken voor volwassenen bij kinderboeken
- boekensteunen bij Klussen
- roze foto's op pagina's voor mannen
- dubbele producten (zelfde EAN of bijna dezelfde titel bij dezelfde winkel)

## 4. Fase B: de volgorde, koop-psychologie per pagina

### B1. Waarom (het onderzoek, kort)

- **Bijna iedereen zit op de telefoon.** Het eerste scherm toont 4 tot 6 kaarten. Wat daar staat beslist of iemand blijft. De eerste en laatste dingen in een rij onthoud je het best (*serial position effect*). Zet dus het sterkste product eerst en sluit elk blok sterk af.
- **Te veel keuze verlamt** (*choice overload*). Een kleine, goed gekozen bovenrij verkoopt beter dan een grote lijst. Daarom eerst 6 echt goede, dan pas de rest.
- **Een duur ankerproduct** (bijvoorbeeld een Dyson of een Seiko) laat de middenprijzen redelijk voelen. Een makkelijke ja onder €15 haalt de twijfelaar binnen. Wissel goedkoop en duur af; dat is ook de vaste regel van Marius.
- **Het geluksgevoel bij cadeaus komt vooral uit:**
  - **verrassing:** "wist je dat dit bestond?"
  - **herkenning:** "dat is precies hém"
  - **humor**
  - **iets persoonlijks:** een naam of foto
  - **een mooi plaatje:** het product zelf op een witte of sfeervolle foto
  Gebruik die gevoelens in de bovenrij.
- **Eerlijk blijft onze kracht (ACM).**
  - geen nep-schaarste ("nog 2!")
  - geen nep-reviews of sterren
  - korting alleen met een echte van-prijs
  - geen "populair" zonder bron
  Wel mag:
  - "Bestseller bij [winkel]" als de feed dat zegt (`populair`)
  - "Eigen keuze van Marius" (`favoriet`)
  - "Prijs gecontroleerd op <datum>"

### B2. De vaste bouw van elke productenlijst (één generieke functie)

Vervang de losse trucjes door **één** functie in `app.js`: `ordenPagina(lijst, paginaSleutel)`. Die gebruikt een schema uit `scripts/boom/volgorde.json` (wordt in `data.js` gezet).

**Het eerste scherm (plek 1–6): de heldenrij.** Elke plek heeft een eigen rol:

| Plek | Rol | Wat erin komt |
|---|---|---|
| 1 | De wow | Het sterkste, meest verrassende of mooiste product, met een duidelijke foto. Vaak een `apart`/`origineel`- of `favoriet`-product. |
| 2 | De herkenning | Een bekend merk of bestseller (`populair`, of een bekend merk uit de merklijst) in de middenprijs. |
| 3 | De makkelijke ja | Onder €15 (onder €10 bij collega en uitdelen), leuk en meteen te snappen. |
| 4 | Het anker | De luxe versie, duurder dan de rest (het topsegment van die pagina). |
| 5 | Persoonlijk of humor | Met naam of foto, of grappig, afhankelijk van de pagina (zie B3). |
| 6 | Echte korting of seizoen | Echte korting van minstens 15%, of het seizoensproduct (Sint/kerst). |

Rond de heldenrij gelden deze regels:
- **Blokken van 6:** daarna komen blokken van 6. Per blok hooguit 2 producten van dezelfde soort (vakje) en hooguit 2 van dezelfde winkel. De prijzen wisselen af: laag, midden, hoog, midden, laag, hoog.
- **Lagere kwaliteit lager:** onderaan komen vervangers, accessoires, dure niche en producten met een zwakke foto.
- **Ritme in elk blok:** minstens 1 product onder €20 en 1 boven €40 (als de pagina die heeft).
- **Kwaliteitsscore:** de score die bepaalt wie een plek krijgt, staat in één formule in `volgorde.json`. Deze onderdelen tellen mee:

  | Onderdeel | Gewicht |
  |---|---|
  | `favoriet` (gekozen door Marius) | +40 |
  | `populair` (bestseller volgens de feed) | +25 |
  | `apart`/`origineel` | +20 |
  | echte korting ≥ 15% | +15 |
  | grote, scherpe foto | +10 |
  | korte, duidelijke titel ≤ 60 tekens | +5 |
  | nieuw (`sinds` < 14 dagen) | +5 |
  | lange titel met specs (`8GB`, `IPX4`, `(2 stuks)`) | −10 |
  | "Los onderdeel" | −50 |
  | foto mist of is klein | −30 |
  | dezelfde titel-stam staat al hoger | −20 |

  Toppers in `topkeuze.js` blijven voorgaan.

- **Gelijke scores:** komen twee producten op dezelfde score uit, dan wint het product met de beste klik-data (GoatCounter-kliks naar de winkel, als die er zijn). Gebruik géén Search Console-data in git (de repo is openbaar). Zet kliktellingen alleen als getal per product-id in een bestand dat niet wordt gecommit, of laat dit weg.

### B3. Per pagina: wat boven, wat midden, wat onder

Het schema per pagina in `volgorde.json` zegt welke vakjes/tags de rollen vullen. **Plek 1–6** gebruikt de rollen uit B2 en vult die met:

**Voor wie**

| Pagina | Plek 1–6 (wow · herkenning · makkelijke ja · anker · persoonlijk/humor · korting of seizoen) | Midden (mix) | Onder | Let op |
|---|---|---|---|---|
| **voor/hem** | apart gadget (stormglas, boekkluis) · Seiko/Casio of whisky-proefset · grappige mok/stressbal < €15 · horloge of Theragun/Dyson-man · gegraveerd zakmes/portemonnee met naam · darts of sokken-actie | darts, gaming, BBQ, LEGO volwassen, drank | pantoffels, accessoires, boeken | nooit roze foto; geen dameswoorden |
| **voor/haar** | sieraad dat blij maakt (ketting met naam/geboortebloem) · Rituals/Good Girl · sfeerkaars/bruisbal-set < €15 · Dyson Airwrap of echt goud · persoonlijk (fototegeltje/naamketting) · bloemen/long-life roos of echte korting | wonen-sfeer, wellness, wijn, creatief | sport, agenda's, keuken | geen herengeur, geen gereedschap |
| **voor/kinderen** | het "wauw"-speelgoed (GraviTrax/LEGO-starter) · bekend merk (Paw Patrol, Pokémon) · klein & leuk < €15 (schoencadeautje) · grote speelset · knuffel met naam of grappig boek · Sint-kader in nov. | per leeftijd afwisselen (4–6, 7–9, 10–12) | puzzels, kleding | alleen complete sets, geen losse onderdelen; leeftijdslabel zichtbaar |
| **voor/tieners** | gaming-gadget of LED-lamp · trending merk (Stanley, Squishmallow, Pokémon) · < €15 (stickers, sokken, gadgets) · koptelefoon/console-accessoire · "precies jij"-cadeau (sieraad met letter, journal) · trend van de maand | gaming, mode, geuren, LEGO | boeken, sport | geen kinderachtige dingen ("mijn eerste") |
| **voor/opa-oma** | fotoboek/foto-cadeau met eigen foto · bekend (Rummikub, Douwe Egberts, Bolletje) · lekkers < €15 · mooie klok/radio · puzzel met eigen foto · warm (plaid/kruik) in de winter | tuin/vogels, koffie/thee, boeken | keuken | groot lettertype-vriendelijk, geen ingewikkelde tech |
| **voor/collega** | grappige werkmok · bekende lekkernij (Tony's, Lindt) · < €10 · luxe bedankje (€25–35) · persoonlijk bedankt-tegeltje · brievenbuscadeau | lootjes €5–25 | afscheid/pensioen | budget eerlijk tonen |
| **voor/baby** | knuffel met naam · bekend merk (Little Dutch, Nijntje) · < €15 rammelaar/slab · luxe kraampakket · geboortetegel/-poster · babyshower-set | kleding, speelkleden | — | nooit 3+ |

**Gelegenheden.** De hoofdpagina's volgen het schema hierboven. Daarbij:

- **Sinterklaas:** schoencadeautjes < €15 bovenaan, chocoladeletter of pepernoot-iets op plek 3, daarna grote cadeaus.
- **Kerst:** sfeer (adventskalenders, kerstdecoratie) gemengd met de grote cadeaus. In december schuift "last-minute: brievenbus/digitaal" naar plek 6.
- **Valentijn en Moederdag:** rozen, sieraden en persoonlijk bovenaan.
- **Beterschap:** zacht, lekker en lezen.
- **Geslaagd:** horloge, rugzak en persoonlijk.
- **Afscheid/pensioen:** persoonlijk en humor.
- **Housewarming:** wonen, planten en borrel.
- **Geboorte:** zoals baby.
- **Juf-meester:** onder €15.

**Collecties**

| Collectie | Bovenaan | Daarna |
|---|---|---|
| **Grappige cadeaus** (goed verkopend!) | de 6 grappigste, waarvan 3 onder €15. Humor die iedereen snapt eerst, nichehumor lager. | om en om voor hem, voor haar en neutraal |
| **Originele cadeaus** | de 18 "wist je dat dit bestond?"-producten | — |
| **Kleine cadeautjes** | alles < €15, gesorteerd op wow | — |
| **Adventskalenders** | per doelgroep gemengd (kind, vrouw, man, lekker, drank), elke rij met andere doelgroepen | — |
| **Aanbiedingen / Black Friday** | grootste echte korting op bekende merken (Marius' eigen deals eerst, bestaat al) | — |
| **Persoonlijke cadeaus** | naam/foto-producten met het voorbeeldbeeld | — |
| **Cadeaupakketten** | duidelijke inhoudsfoto's eerst | — |

**Categorieën (afdeling > groep).** Bovenaan staat de bestseller of het herkenbare merk per groep, niet acht keer hetzelfde soort product. Dit zijn de verplichte "eerste rij"-groepen per afdeling:

| Afdeling | Eerste rij |
|---|---|
| Parfum & verzorging | damesparfum, giftset, bad & douche, haar, wellness, make-up, maximaal 1 bruisbal |
| Sieraden | ketting, oorbellen, armband, ring, met naam, sieradendoos |
| Wonen | kaars/geur, sfeerlamp, plaid, decoratie, klok, kerst (in nov/dec) |
| Speelgoed | LEGO, knuffel, spel, knutsel, buiten, leren |
| Elektronica | koptelefoon, smartwatch, speaker, gadget, gaming, camera |
| Eten & drinken | chocolade, pakket, wijn/bubbels, sterke drank, delicatessen, koffie/thee |

### B4. Het eerste scherm van een pagina zelf

Volg daarbij de vaste NOVA-huisstijl uit CLAUDE.md §8: geen nieuwe ontwerpen.

- De kop zegt in één zin wat de pagina belooft.
- De intro blijft kort, met "Lees meer" (bestaat al).
- Binnen 1 scherm staan de eerste producten.
- Filters en sorteren blijven zoals NOVA-009.

## 5. Volgorde van werken en oplevering

| Fase | Wat |
|---|---|
| **A1** | `paginaregels.json` + script + controle-uitbreiding. Bouw. Rapport: aantal producten dat per pagina verdween, met per pagina 5 voorbeelden. |
| **A2** | Gelegenheden aanvullen (`moment` via regels), lege pagina's netjes uit het menu. Bouw. |
| **B1** | `volgorde.json` + `ordenPagina()`. Eerst achter `?proef=volgorde` (zoals NOVA-proeven: `sessionStorage`, `window.LK_VOLGORDE`). |
| **B2** | Screenshots (390 px, eerste scherm) van de 25 drukste pagina's, voor en na, in één overzicht voor Marius. **Stop hier en wacht op zijn GO.** Daarna live. |

**De 25 drukste pagina's:**
- homepage
- de Voor wie-pagina's: voor/tieners (+ gaming-gadgets), voor/haar (+ sieraden, parfum-verzorging), voor/hem (+ horloges-sieraden, gadgets-gaming), voor/kinderen (+ bouwen), voor/collega (+ lootjes), voor/opa-oma
- de collecties: grappige-cadeaus, originele-cadeaus, kleine-cadeautjes, adventskalenders, aanbiedingen, black-friday
- de gelegenheden: sinterklaas, sint-onder-15, kerst, verjaardag
- de categorieën: c/speelgoed, c/wonen

**Klaar is pas klaar als:**
- de controle SCHOON is (`alles.js` inclusief de nieuwe paginaregels)
- 0 overtredingen van A2 voorkomen
- op de 25 pagina's de eerste 6 plekken elk een andere rol vervullen en er geen twee van dezelfde soort naast elkaar staan
- Marius GO heeft gezegd

**Verslag aan Marius:** Nederlands, simpel, maximaal 10 regels. Daarna het Keurbord bijwerken.

## 6. Harde regels (niet onderhandelbaar)

- Partnercodes in elke link (CLAUDE.md §4). Niets pushen dat niet gebouwd en gecontroleerd is.
- Geen nep-labels, sterren, voorraad- of tijdsdruk. Korting alleen met echte van-prijs (ACM, 30-dagen-regel).
- Niets in bulk weggooien op product-id. Weghalen van producten gaat alleen via een WEG-lijst die Marius aantikt. Van een pagina halen (`nietIn`) mag wel met regels.
- Geen GoatCounter- of Search Console-cijfers in git.
- Nova-huisstijl blijft. Geen extra lettertypes, libraries of animaties.
