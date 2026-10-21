# LeukeKeuze – nieuwe site (testversie)

Volledig nieuwe LeukeKeuze in stijl **Luxe & Premium** (donker + goud), op basis van Nova's ontwerp.
Niets van de oude site overgenomen. **Status: klaar voor livegang (GO van Marius, 19-10-2026).**

## Wie doet wat
- **Marius**: eigenaar, beoordeelt en beslist.
- **Claude**: code, techniek, mobiel/desktop, navigatie, GitHub.
- **Nova**: banners, categoriebeelden, beeldstijl, productpresentatie.

## Pagina's (alles werkt via het adres na #)
| Adres | Pagina |
|---|---|
| `#/` | Home |
| `#/categorieen` | Alle categorieën |
| `#/c/cadeaus` | Categorie (met subcategorieën, budget, sorteren) |
| `#/c/cadeaus/voor-haar` | Subcategorie |
| `#/p/vb-01` | Productpagina |
| `#/zoek?q=kaars` | Zoeken |
| `#/vonk` | VONK cadeauzoeker (3 vragen) |
| `#/favorieten` | Bewaarde producten (hartje) |
| `#/info/...` | Hoe werkt het, Over ons, Contact, Privacy, Disclaimer |

## Bestanden
| Bestand | Wat |
|---|---|
| `assets/js/data.js` | Categorieën, subcategorieën, banner-teksten, VONK-vragen |
| `assets/js/producten.js` | Producten (nu voorbeelden) |
| `assets/css/stijl.css` | Vormgeving |
| `images/` | Plaatjes van Nova (WebP) |

## Afbeeldingen (Nova)
Stijl: donker, warm goudlicht, geen tekst, geen merken/logo's, onderwerp in het midden.

**Ronde 1: binnen ✔**
banners home (desktop + mobiel), banner Cadeaus, tegels Cadeaus/Christelijk/Speelgoed,
8 subcategorieën Cadeaus, 8 voorbeeld-productfoto's.

**Ronde 2: binnen ✔**
Alle 13 categorieën: tegel (`categorie-<naam>.webp`, 800×800) en banner (`banner-cat-<naam>.webp`, 1920×640).
Nova's originelen staan in `images/nova-origineel/`.

**Ronde 3: subcategorieën binnen ✔**
Alle 66 subcategorie-rondjes (`images/sub/sub-<categorie>-<sub>.webp`, 600×600).

**Deelplaatje binnen ✔**
`images/deel-afbeelding.jpg` (1200×630), gekoppeld in index.html (og:image).
Let op: het adres in og:url/og:image is nu het testadres; bij livegang aanpassen naar leukekeuze.nl.

**Nog open**
- Neutrale homebanners voor na de feestdagen

Tot een plaatje er is, toont de site een gouden icoon. Plaatje toevoegen = bestandsnaam invullen in `data.js`.

## Echte producten
- Ronde 1 (19-10-2026): 32 producten van Ditverzinjeniet (Daisycon 11208), allemaal goedgekeurd door Marius.
- Ronde 2 (19-10-2026): 44 producten van 999Games, Bloompost, Teufel en La Redoute, allemaal goedgekeurd. La Redoute-foto's komen rechtstreeks van hun CDN (zij blokkeren downloaden).
- Ronde 3 (19-10-2026): 21 christelijke cadeaus via bol (partnerprogramma, site 1545784) en Kaartje2go (Daisycon 19520). 3 afgewezen. Bol-links: partner.bol.com/click/click?t=url&s=1545784&f=txl&name=LeukeKeuze&url=<bol-pagina>.
- Ronde 4 (20-10-2026): 37 producten Keuken & Tafelen via bol, allemaal goedgekeurd.
- Ronde 5 (20-10-2026): 32 producten Sport, Outdoor & Reizen via bol, allemaal goedgekeurd. Nieuwe subcategorie Darts (plaatje van Marius/Nova).
- Ronde 6 (20-10-2026): 12 darts-producten via bol, allemaal goedgekeurd.
- Ronde 7 (20-10-2026): 19 producten Eten & Drinken via Dropwinkel (Daisycon 18019), allemaal goedgekeurd. Veld verzendNoot = klein regeltje op productpagina.
- Ronde 8 (20-10-2026): 31 producten Ditverzinjeniet (Dieren, Tuin & Klussen, Hobby, Wonen, Gadgets), allemaal goedgekeurd.
- "Onder €10" vult zich nu vanzelf op prijs (gedeeld.js, hoortBij). Nooit meer handmatig onder-10 zetten.
- Ronde 9 (20-10-2026): 27 producten Speelgoed & Spellen (bol, 999Games, Ditverzinjeniet), allemaal goedgekeurd.
- Ronde 10 (20-10-2026): 27 producten Wonen en Mode & Beauty via bol, allemaal goedgekeurd.
- Ronde 11 (20-10-2026): 22 producten Boeken & Media + Tassen (bol, Ditverzinjeniet), allemaal goedgekeurd.
- Ronde 12 (20-10-2026): 8 tassen via bol, allemaal goedgekeurd.
- Ronde 13 (20-10-2026): 9 tassen voor heren via bol, allemaal goedgekeurd. De Samsonite-tas stond er al (bij Reizen) en is nu ook bij Tassen te zien.
- Ronde 14 (20-10-2026): 17 producten Dieren, Elektronica en Tuinlampen (Ditverzinjeniet, bol), allemaal goedgekeurd. Nieuw veld "letOp": een "Let op:"-regel op de productpagina (bv. beamer alleen voor Android).
- Ronde 15 (20-10-2026): 25 producten van Dille & Kamille (Daisycon 7059): eten & drinken, speelgoed, hobby. Verzendnoot: €5,95, ophalen in winkel gratis.
- Ronde 16 (20-10-2026): 21 producten Dille & Kamille: wonen, verzorging, tuin. Adventskrans: titel "(zonder kaarsjes)" omdat de foto kaarsjes toont.
- Ronde 17 (20-10-2026): 20 producten (films, hobby, gadgets, klussen, christelijk; Ditverzinjeniet + bol). Mini-hamertje 7-in-1 weggelaten: lijkt te veel op de 10-in-1 houten hamer.
- Ronde 18 (20-10-2026): 11 producten geuren, sieraden, accessoires (bol). Regel van Marius: alleen positieve extra info vermelden (bv. "ook voor touchscreen"), niet wat iets níet kan als dat duidelijk is; materiaal/metaal wel vermelden.
- Ronde 19 (20-10-2026): 19 producten dieren (vogels, hond, kat), muziek, pakketten (Dille & Kamille, Ditverzinjeniet, Dropwinkel). 6 gasstellen (bol) nog in de Keurkamer.
- Ronde 20 (20-10-2026): 6 gasstellen (bol), 3 inbouw en 3 los, in Keuken > Koken.
- Ronde 21 (20-10-2026): 8 producten (gaming, telefoon, foto, tekenen, tuinlicht) via bol.
- Ronde 22 (20-10-2026): 10 producten christelijk, knutselen, konijn & cavia (bol).
- Ronde 23 (20-10-2026): 14 boeken (6 kookboeken, 8 romans) via bol.
- Ronde 24 (20-10-2026): 7 producten tekenen, modelbouw, buitenspel (bol).
- Ronde 25 (20-10-2026): 3 fietsproducten (bol, Ditverzinjeniet).
- Ronde 26 (20-10-2026): 21 producten baby & kraam, agenda's 2027, pakketten & borrel (19 via Daisycon).
- Ronde 27 (20-10-2026): 24 producten filmavond, foto, gaming, zelf maken, tuin (Daisycon). Afgewezen: teckel-markeerstiften, houten kerstboompjes, rotan lantaarn, verplantschepje (niet mooi/stevig).
- Ronde 28 (20-10-2026): 10 producten klein dier, christelijk, horloge, telefoon (7 bol, 3 Ditverzinjeniet).
- Ronde 29 (20-10-2026): 17 producten Sinterklaas en Kerst (Daisycon). Afgewezen: adventskaarsen week 1-4, emaille kerstmok, kerstman-bellenblaas.
- Ronde 30 (20-10-2026): 15 producten: 8 spellen van 999 Games en 7 brievenbuscadeaus van Bloompost (Daisycon).
- Ronde 31 (20-10-2026): 7 producten horloges en sieraden voor hem (6 bol, 1 Ditverzinjeniet). Marius: bol is prima voor stoere kwaliteitsspullen voor mannen.
- Ronde 32 (20-10-2026): 8 producten Teufel (oordopjes, koptelefoons, speakers), Daisycon.
- Ronde 33 (20-10-2026): 15 cadeaus tussen 25 en 50 euro (Daisycon). Afgewezen: raclette-setje, kattenkruik, groene theepot (ook bij de Action).
- Herkeuring (20-10-2026): 76 simpel ogende producten opnieuw gekeurd in de Productstudio. 36 eraf gehaald (met foto), 40 blijven. Nu 562 producten.
- Ronde 34 (20-10-2026): 15 bijzondere woonspullen en kerst met klasse (AM.PM/La Redoute, Ditverzinjeniet). Afgewezen: Cefalu-kandelaar, gebreide plaid, kranskandelaar, sterrenslinger (Dille & Kamille). Nu 577 producten.
- Ronde 35 (20-10-2026): 15 cadeaus voor hem, stoer met klasse (La Redoute merken, bol kwaliteit, Ditverzinjeniet whisky). Alles goedgekeurd. Nu 592 producten.
- Herkeuring 2 (20-10-2026): 124 producten streng op luxe gekeurd. 58 eraf, 66 blijven (deels andere categorie). Seizoenslabels kerst/sinterklaas na de feestdagen weer opruimen. Nu 534 producten.
- Ronde 36 (20-10-2026): 10 cadeaus voor haar met klasse (La Redoute). VONK: dierenspullen niet meer bij een bepaald persoon, echte matches eerst. Wens: Michael Kors zoeken.
- Ronde 37 (21-10-2026): 8 producten: Michael Kors tasje (bol), Ralph Lauren, AM.PM vazen en plaid. Nu 552 producten.
- Ronde 38 (21-10-2026): 24 cadeaus voor opa en oma, alles goedgekeurd. Nieuwe sub Christelijk > Kerst (verborgen tot er producten in staan). Nu 576 producten.
- Ronde 39 (21-10-2026): 12 christelijke kerstspullen (vilten kerststal, engelen, kaarten). 3 oude christelijke kerstkaarten ook in Christelijk > Kerst. Nu 588 producten.
- Ronde 40 (21-10-2026): 5 AM.PM-producten. Regel van Marius: kaarsen staan ALLEEN bij Wonen > Kaarsen & kandelaars, zonder "ook in". Nu 593 producten.
- Winkelpagina #/winkels (21-10-2026): partnerwinkels met homepage-link (LK_WINKELS in data.js). Ook tegels onderaan elke hoofdcategorie. I-KOOK staat klaar maar is verborgen tot de Daisycon-link erin staat.
- Ronde 41 (21-10-2026): 8 Zadig & Voltaire (Franse site). FOREO afgekeurd (lelijke feedfoto's). Casio blauw horloge kreeg betere foto. Nu 601 producten.
- Ronde 42 (21-10-2026): 17 flessen topdrank van Decantalo (nieuwe sub Eten & drinken > Whisky & sterke drank, zonder ookIn) en 9 Dr. Martens schoenen en leren tassen (nieuwe sub Mode & beauty > Schoenen). Sub-plaatjes tijdelijk gemaakt van productfoto's.
- Nieuwe hoofdcategorie Dranken (21-10-2026), na Eten & drinken, icoon 'glas', subs whisky, cognac-brandy, rum, gin, wodka, tequila, likeur, wijn, bubbels, wijnaccessoires (lege subs blijven verborgen). De 17 Decantalo-flessen verhuisd uit eten-drinken/drank. Tegel en sub-plaatjes tijdelijk van productfoto's.
- Ronde 43 (21-10-2026): 104 dranken van Decantalo, verdeeld over alle subs van Dranken (zonder ookIn).
- Homepage opgepimpt (21-10-2026): reclameblokken (LK_INSTELLINGEN.acties, met 'tot'-datum, op telefoon een veegrij), etalage met topflessen (LK_INSTELLINGEN.etalage), chip Dranken bij Populair, en Dranken in plaats van Christelijke cadeaus bij Populaire categorieën.
- Ronde 44 (21-10-2026): 58 wijnen en bubbels van Decantalo (Protos afgewezen). 8 productfoto's vervangen door de nette versies van Nova (Muga rood/wit, Viña Alberdi, Studio by Miraval, Conde de Haro, Gramona, Taylor's 10, Ramos Pinto); Dr. Loosen en Fonterutoli houden de winkelfoto omdat Nova het etiket verkeerd schreef.
- Homepage (21-10-2026): zoekbalk uit de hero gehaald (zoeken blijft via het vergrootglas), VONK als compacte balk.
- Verbouwing (21-10-2026): homepage met Voor wie (LK_INSTELLINGEN.voorWie), compacte Alle categorieën met aantallen, veegrijen voor producten, 'Toon meer' per 24 in categorieën, label Onze favoriet (veld favoriet in producten.js), lagere hero.
- Ronde 45 (21-10-2026): 24 winterspullen: 12 Dr. Martens (gevoerde laarzen, Wintergrip, tassen) en 12 Zadig & Voltaire (tassen, sieraden, sjaal, kasjmier trui).
- Ronde 46 (21-10-2026): 25 producten: 16 spellen van 999 Games, 4 hobby, 5 tuin/vogels/buiten (Dille & Kamille).
- Ronde 47 (21-10-2026): 16 producten: 10 kerstdecoratie/kaarsen (La Redoute, Dille & Kamille) en 6 Teufel.
- Herkeuring 3 schoenen (21-10-2026): 6 afgekeurd en verwijderd (3 pantoffels van Birkenstock/Ralph Lauren, 3 Dr. Martens loafers/instappers).
- Ronde 48 (21-10-2026): 20 cadeaus onder 10 euro (Dille & Kamille, Dropwinkel); 2 kersthangers afgekeurd.
- Zoeken in alle winkels (21-10-2026): assets/zoek/winkels.json (gemaakt door scripts/maak-zoekindex.py uit de Daisycon-feeds, zonder Mijn Hummeltje). Zoekpagina toont eerst '★ Door ons gekozen', dan 'Meer in onze winkels' (niet gekeurd) en een knop om op bol te zoeken. Elke nacht bijgewerkt door scripts/nachtelijk.py via de Taakplanner op de laptop.
- Fossil Minimalist en Grant (21-10-2026): nieuwe foto's van Marius; Grant-titel aangepast naar zwart met blauw.
- Categorievolgorde (20-10-2026): Cadeaus, Speelgoed, Wonen, Hobby, Elektronica, Mode, Keuken, Eten, Tuin, Sport, Dieren, Boeken, Christelijk (achteraan, niet meer uitgelicht). Knoppen lichter gemaakt (--knop-bg).
- Regel (20-10-2026, Marius): christelijke producten staan alleen in de categorie Christelijke cadeaus. Afgedwongen in hoortBij (gedeeld.js) en in home-lijstjes, VONK en "misschien ook leuk" (app.js). Zoeken vindt ze wel.
- Herindeling (20-10-2026, goedgekeurd door Marius): nieuwe subs Adventskalenders, Baby & kraam (Cadeaus), Kaart- & dobbelspellen, Huisgeuren, Keukenapparaten (gasstellen), Horloges, Rugzakken & reistassen, Drop & snoep, Agenda's & notitieboeken. Hernoemd: Films & series → Filmavond, Tassen → Hand- & schoudertassen, Kaarsen & geur → Kaarsen & kandelaars, Chocolade & snoep → Chocolade, Pakketten → Pakketten & borrel, Knutselen → Knutselen voor kinderen / Zelf maken. Lege subs (bv. Met naam) worden automatisch verborgen. Nieuwe subs hebben nog geen plaatje (gouden icoon) tot Nova ze maakt: images/sub/sub-<cat>-<sub>.webp, 600x600. La Redoute-foto's staan nu lokaal.
- Keuren gebeurt in de losse Keurkamer op Marius' bureaublad ("Keurkamer LeukeKeuze (nieuw)"). Die exporteert een keuringen-bestand; Claude zet de goedgekeurde producten in `assets/js/producten.js`.
- `url` = partnerlink (telt als klik). `winkelUrl` = gewone winkelpagina, gebruikt voor controles en in de Keurkamer (telt niet als klik).
- Alle partnerlinks hebben `rel="sponsored nofollow noopener"`, zodat robots ze niet volgen.
- Productfoto's: `images/producten/dvzn-<sku>.webp` (1000px) en `-klein.webp` (500px), uit de productfeed van de winkel.
- Voorbeeldproducten staan er nog, maar niet meer in de cadeau-rubrieken die nu echte producten hebben.

## Livegang (19-10-2026)
- Geen noindex meer; robots.txt staat alles toe; sitemap.xml; canonical = https://leukekeuze.nl/
- Voorbeeldproducten en voorbeeldfoto's verwijderd. Alleen echte, goedgekeurde producten.
- Keurkamer van de site verwijderd. Het keurprogramma heet nu de Productstudio en staat los op het bureaublad van Marius (map "Productstudio LeukeKeuze (nieuw)").
- Netlify: `netlify.toml` (geen build, publish = .), `_redirects` voor oude adressen, `404.html` stuurt naar home.
- Contact: leukekeuze.nl@gmail.com. Nog te doen door Marius: privacy- en disclaimertekst nalezen.
