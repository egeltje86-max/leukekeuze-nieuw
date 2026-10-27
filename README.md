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
- Echte pagina's (22-10-2026): adressen zonder #, elke categorie/product een eigen HTML-pagina voor Google. Na elke wijziging aan producten of categorieen: `node scripts/maak-paginas.js` draaien (opmaak aanpassen in sjabloon.html, niet in index.html).
- Herkeuring 4 (22-10-2026): Cadeaus en Speelgoed, 111 goed, 4 afgekeurd (fotolijstje, handzaag-notitieboek, tafelbowling, dino-bloempot); veel spellen ook bij kerst/sinterklaas.
- Herkeuring 5 (22-10-2026): Wonen en Hobby, 90 goed, 19 afgekeurd (o.a. bijna alle huisgeuren). 'Onder €10' is nu 'Onder €15' (oud adres stuurt door).
- Ronde 49 (22-10-2026): nieuwe categorie Metaaldetectie, 46 producten van bol, alle goedgekeurd. Productpagina kan nu meerdere foto's tonen (veld 'fotos') en specificaties (veld 'specs').
- Ronde 51 (22-10-2026): 62 LEGO-sets rechtstreeks van LEGO (Daisycon 18488). Hoofdfoto is de doos zoals in de winkel (van lego.com), daarna de set en extra foto's in de fotorij. Bij 42688 had LEGO geen doosfoto.
- Ronde 52 (22-10-2026): 88 producten live: Westwing (lampen, kandelaars, kaarsen, huisgeuren, vazen, deco, kussens, mokken) en nieuwe kerstdecoratie van Kerstland en Westwing. De 27 oude kerstdecoratie-producten (Dille & Kamille, La Redoute, bol) zijn weg, op verzoek van Marius.
- Ronde 53 (22-10-2026): 33 producten van Wijnkring (wijn, port, bubbels, glazen). Losse flessen op een zachte achtergrond gezet (scripts op de laptop: wijn-mooi.py). Svinando niet gebruikt: bezorgt alleen in België.
- Aanbevolen-volgorde (22-10-2026): favorieten eerst, daarna een mix van goedkoop en duur en verschillende winkels om en om; nieuwe producten iets naar voren. Schuift elke week vanzelf een beetje (functie mix in app.js).
- Ronde 54 (22-10-2026): 41 sieraden van MYKA (met naam, voor haar, hem, kinderen en stelletjes).
- Ronde 55 (22-10-2026): 77 sieraden van MYKA en Prydligt (Céleste, Canard, Tom Cole).
- Nieuwe hoofdcategorie Sieraden (22-10-2026): subs kettingen, oorbellen, ringen, armbanden, voor hem, en op materiaal: echt goud, zilver, verguld & staal. Oude /c/mode-beauty/sieraden verwijst door. Producten met naam staan in Cadeaus > Met naam en ook bij Sieraden.
- Ronde 56 (22-10-2026): 54 sieraden (echt goud, zilver, Canard, Céleste). Dunne kettingen kregen een uitvergrote hoofdfoto zodat je de schakels ziet (laptop: ketting-zoom.py).
- Plaatjes (22-10-2026): tegel, banner en subplaatjes voor Sieraden en Metaaldetectie (gemaakt door Nova).
- Ronde 57 (22-10-2026): 27 producten live. Nieuwe sub Dranken > Alcoholvrij (Kantinewinkel, Wijnkring: kinderchampagne, 0,0% gin, mocktails, alcoholvrije wijn en witbier) met Nova-plaatje. WoodWick geurkaarsen in Wonen; foto Holiday Garland hersteld.
- Ronde 58 (22-10-2026): 48 producten van Bartogi live (Hunter-regenlaarzen, Crocs, vilten sloffen, Toni Pons, Sockwell-sokken, HEYDUDE, KEEN). Fotos bijgesneden zodat het product groot staat.
- Meer in onze winkels (22-10-2026): per (sub)categorie ook woorden die NIET in de titel mogen (LK_NIETWOORDEN in data.js), zodat bv. "gordijn met ringen" niet meer bij Ringen staat. Zoekwoorden opgeschoond; lege onderdelen (zoals Echt goud, Zilver) worden verborgen.
- Kleding & sokken (22-10-2026): nieuwe sub mode-beauty/kleding. Kasjmier trui en Sockwell-sokken erheen verplaatst. Plaatje van Nova.
- Ronde 59 (22-10-2026): 33 producten van Timberland (Duitse webshop) en AllSaints live. Truien, jack en Timberland-sokken in Kleding & sokken; AllSaints-ketting met ingezoomde hoofdfoto.
- Ronde 60 (22-10-2026): 27 producten van Kantinewinkel live (BBQ-kruiden, Monin, Tony's). Nieuwe sub Eten & Drinken > BBQ & kruiden met Nova-plaatje; vleesthermometer, BBQ-set en brandijzer daar ook te zien.
- Ronde 61 (22-10-2026): 31 horloges live (Invicta met oude prijs doorgestreept, en betaalbare horloges van Prydligt).
- Ronde 62 (22-10-2026): 21 van 39 goedgekeurd live (dieren, tuin, hobby: haaksets en punch needle).
- Ronde 63 (22-10-2026): 89 LEGO-sets live (Technic, Icons, Botanicals, Architecture, Ideas, kinder-thema's), met doosfoto en extra fotos.
- Ronde 64 live (22-10-2026): 63 producten (Razer gaming, Teufel, themalampen en wekkers, Dille & Kamille keuken).
- Ronde 65 live (22-10-2026): 91 producten (lezen, buiten, hobby, tuin). Nieuwe subs: boeken-media/lezen (Leesplezier) en sport-outdoor/golf, met Nova-plaatjes.
- Ronde 66 live (22-10-2026): 55 Westwing-producten (plaids, kersthangers, kaarshouders); 6 dubbelen eruit gehaald.
- Ronde 67 live (22-10-2026): 54 producten dieren en dierenvrienden (Westwing, Ditverzinjeniet). Afmetingen (specs) toegevoegd waar de winkel ze geeft.
- Ronde 68 live (22-10-2026): 16 metaaldetectie-producten van bol (detectors, grasmessen, pinpointer, accessoires). Prijzen uit zoekresultaten (bol blokkeert uitlezen).
- Afmetingen (22-10-2026): bij 385 producten een regel "Afmetingen" in specs, uit de feedgegevens (Ditverzinjeniet, Dille & Kamille, 999Games, Kerstland, Westwing, Kaartje2go, Prydligt). Bol, LEGO, wijn en kleding zonder.
- Ronde 69 live (22-10-2026): 33 producten christelijk (sieraden, kerstkaarten) en Sinterklaas.
- Ronde 70 (22-10-2026): 57 christelijke sieraden, rozenkransen en kaarten live (bol-feed, MYKA, Kaartje2go).
- Ronde 71 (22-10-2026): 80 christelijke cadeaus live (kerststallen, engelen, beelden, tegels, doop & communie, bijbels) + 3 nieuwe subs: Kerststallen & engelen, Doop & communie, Beelden & kruisen.
- Ronde 72 (22-10-2026): 58 eetcadeaus live (chocolade, thee & koffie, olijfolie, truffel, BBQ, pakketten; bol-feed).
- Ronde 73 (23-10-2026): 27 christelijke armbanden live (leer, natuursteen, zilver; bol-feed).
- Grote controle (23-10-2026, nacht): 4 dubbele producten weg (LEGO 42688 en 10313 stonden ook via bol, Angus & Oink stond ook bij Kantinewinkel, Tommy-cadeauset dubbel); 17 producten uit ronde 71 hadden onbekende momenten (doop/communie) → standaard; 'onder-15' uit ookIn bij 18 producten boven €15; 3 producten met sub 'onder-15' naar echte sub; 120 producten: voor/moment aangevuld zodat VONK ze ook vindt bij Kerst/Sinterklaas/kind; spelfouten (tijgeroog, raceauto's, knusse sokken, 'meest luxe'); 'Nu €X goedkoper' uit teksten (veroudert). Nieuw veld 'sinds' (datum op de site): het label Nieuw geldt 3 weken, 'Nieuwste eerst' sorteert op datum. 'Ook leuk' op productpagina toont eerst dezelfde subcategorie. Winkelpagina: alle 25 winkels met producten staan er nu op, en elke categorie heeft minstens één winkel bij 'Ook leuk om rond te kijken'. CSS: 'Meer in onze winkels' liep op mobiel buiten het scherm (gefixt). Zoeken kent nu ook woorden als vrouw/man/kind/jongen/meisje/schoencadeau/parfum (synoniemen bij voor/moment/sub).
- Ronde 74 (23-10-2026): 48 kaarten van Art by Claudia live via Den Hertog (directe link, géén partnerprogramma, wens van Marius). Nieuwe bron 'H' in maak-alg.py voor directe winkellinks.
- Ronde 75 (23-10-2026): 38 producten voor dunne groepen (magneetvissen, vondsten, likeur, golf, fitness, klein dier, gereedschap, kinderboeken, muziek).
- Ronde 76 (23-10-2026): 36 producten (gereedschap, Sinterklaas onder 10 euro, huisgeuren Westwing, kinderboeken).
- Ronde 77 (23-10-2026): 31 Pokémon-producten (kaarten van bol zelf, knuffels, LEGO, boeken, schoolspullen).
- Ronde 78 (23-10-2026): 35 producten van Bluey, Squishmallows, Minecraft, Stitch en Harry Potter.
- Eigen kleurboeken (23-10-2026): 6 dino-kleurboeken van Marius (Amazon) met vaste plek op de homepage (LK_INSTELLINGEN.eigen) en label "Van LeukeKeuze".
- Juridisch (23-10-2026): colofon, privacyverklaring en algemene voorwaarden toegevoegd (eis Daisycon/Amazon); links in de footer.
- Amazon partner-ID leukekeuze-21 (23-10-2026) in de links van de eigen kleurboeken.
- Ronde 79 (23-10-2026): 31 producten (17 adventskalenders, 14 opa & oma).
- Ronde 80 (23-10-2026): 47 producten (foto-video, telefoon, keukenapparaten, opbergen, buitenverlichting, haken, metaaldetectie, wodka/tequila/rum/gin).
- Aftelbalk (23-10-2026): smalle balk bovenaan die aftelt tot pakjesavond en daarna tot kerst (gedeeld.js, images/aftel). Vanaf 1 oktober tot 26 december.
- Ronde 81 (23-10-2026): 26 Sinterklaas-producten (lekkers, sinterklaasboeken, schoencadeautjes).
- Subcategorie Filmavond (films-series) verwijderd (23-10-2026); de 8 producten verhuisd naar keuken, wonen en schoenen.
- Ronde 82 (23-10-2026): 30 producten (geschenksets, parfumsets, audio, kerst voor hond en kat).
- Ronde 83 (23-10-2026): 24 parfum- en verzorgingssets voor kerst.
- Ronde 84 (23-10-2026): 25 producten kerst in huis (Kerstland, Dille & Kamille).
- Ronde 85 – Lekkere cadeaus (23-10-2026): 22 producten (chocolade, koffie, thee).
- Ronde 86 – Gadgets (23-10-2026): 22 producten (foto, slimme gadgets, telefoon, beamers, kinderen).
- Ronde 87 – Drop, fitness, keuken, tuin en golf (23-10-2026): 27 producten voor dunne groepen.
- Ronde 88 – Metaaldetectie (23-10-2026): 39 producten (ook partnerverkopers op bol).
- Ronde 89 – Goedkope Sinterklaas-cadeautjes (23-10-2026): 24 schoencadeautjes.
- Sint onder €15 (23-10-2026): nieuwe rubriek naast Sinterklaas, vult zich automatisch met alles uit Sinterklaas onder de 15 euro.
- Ronde 90 – Baby & peuter (23-10-2026): 36 producten (rammelaars, rolspeelgoed, mobielen, vormenstoven, nachtlampjes, babyfoons).
- Eigen kleurboek 7 (23-10-2026): Superhero Dinos (amz-b0hp27j6v7, €9,99), nu te koop voor €10,89; eigen blok toont 7 boeken naast elkaar op desktop.
- VONK (23-10-2026): toont nu alle passende cadeaus met "Toon meer" (was 12), eerst wat echt voor haar/hem gekozen is, en wisselt af per soort (geuren, sieraden, drank, tech, ...).
- Meer in onze winkels (23-10-2026): geen grens van 240 meer, Toon meer laat steeds 48 extra zien tot alles; Best passend is een mix van winkels en prijzen.
- Meer in onze winkels (23-10-2026): eigen prijsknoppen (Alles, Tot €10/€25/€50, €50+).
- Ronde 91 – Voor opa & oma (23-10-2026): 29 producten (invulboeken, fotolijsten, warm, spellen, radio/platenspelers, vogels, thee).
- Ronde 92 – Agenda's en kalenders 2027 (23-10-2026): 17 producten (scheurkalenders, agenda's, planners, notitieboeken, 3 christelijk).
- Homepage (24-10-2026): "Voor wie" vervangen door "Shop per categorie" (schuifrij met pijltjes op desktop); onderste lijst Alle categorieën weg.
- Meer in onze winkels (24-10-2026): Myka, Prydligt en Invicta toegevoegd aan de zoekindex; zoekwoorden sieraden (heren, echt goud, zilver, verguld) verbeterd, zodat elke sieraden-groep eigen winkelproducten toont.
- Ronde 93 – Kleine huisdieren (24-10-2026): 22 producten (konijn, cavia, hamster).
- Zoeken (24-10-2026): resultaten op relevantie (titel > categorie > uitlegtekst), zodat bij "fiets" eerst echte fietsspullen komen.
- Ronde 94 – Tekenen & schilderen (24-10-2026): 39 producten (kinder- en kunstenaarssets, verf, pastels, schetsboeken, ezel).
- Ronde 95 live (24-10-2026): 26 loopfietsen, steps, driewielers, loopwagens en kinderfietsjes (Puky, Micro, Globber, Kinderkraft e.a.). Totaal 2704 producten.
- Ronde 96 live (24-10-2026): 29 christelijke cadeaus (kinderen, dagboeken, Sela-cd's, doop/belijdenis). Totaal 2733 producten.
- Metaaldetectie hangt nu onder Sport, Outdoor & Reizen (24-10-2026): eigen categorie met `onder`, rondje bij Sport, niet meer los in menu en catrij.
- Ronde 97 live (24-10-2026): 32 sportproducten (wandelschoenen, dumbbells, kampeerspullen, tenten goedkoop-duur, Wilson-putters). Totaal 2765 producten.
- Ronde 98 live (24-10-2026): 32 producten darts (Winmau/Harrows), drop (Venco, Klene, Katja, Haribo) en vogels (Elho, Trixie). Totaal 2797 producten.
- Grote checkup (24-10-2026): (1) scripts/nachtelijk.py miste Myka, Prydligt en Invicta, waardoor de nachtelijke zoekindex die winkels wegliet (sieraden-groepen zonder "Meer in onze winkels"); nu erin, plus 6 nieuwe feeds: WoodWick, Wijnkring, Kerstland, Fietsparadijs, Fietstas.com, Svinando (Eastpak heeft geen feed). (2) scripts/maak-zoekindex.py maakt nu ook assets/zoek/w/<cat>--<sub>.json: per (sub)categorie een klein bestand (max 2500 rijen, om en om per winkel) met dezelfde regels als vulAlleWinkels; categoriepagina's laden dat i.p.v. het hele winkels.json (12 MB). Zoekpagina laadt het hele bestand op mobiel pas na een knop. (3) Mobiel: terugknop vanaf product herstelt scrollpositie en "Toon meer"; plakbalk met prijs+winkelknop onderin productpagina; "Bekijk ook:" categorie-tips boven zoekresultaten; kleinere banners (-mobiel.webp) op telefoons; grotere tikdoelen (chips 40px); kortere hero en compactere categoriekop; eerste 4 productfoto's niet lazy; home-banner alleen op home voorgeladen. (4) Dubbele kaarttitel Hertog gesplitst; winkeltegels Fietsparadijs, Fietstas.com, Svinando.
- Mobiel (24-10-2026): balken bovenaan dunner (header 58px, aftelbalk 42px), logo iets kleiner.
- Mobiel (24-10-2026): knop "Filter & sorteren" onderin (verschijnt als de werkbalk uit beeld is) met paneel voor budget en sortering; na kiezen terug naar begin van de lijst.
- Daisycon-pauze (24-10-2026): media afgekeurd => Daisycon stuurt klikken door naar een vreemde site (joinpanels). LK_INSTELLINGEN.daisyconPauze = true: productknoppen gaan naar winkelUrl (zonder partnerlink), "Meer in onze winkels" verborgen, winkeltegels naar de gewone winkelsite. Na goedkeuring: op false zetten en opnieuw bouwen.
- Daisycon tweede afkeuring (24-10-2026): wettelijke pagina's tweetalig gemaakt (Colofon (Imprint), Privacyverklaring (Privacy Policy), Algemene voorwaarden (Terms)) met Engelse samenvattingen; naam en adres onderaan elke pagina met links Imprint / Privacy Policy / Terms; aliassen /info/imprint, /info/privacy-policy, /info/terms.
- Ronde 99 live (24-10-2026): 33 bol-producten (huisgeuren Millefiori/Yankee, SMEG/KitchenAid/Sage/Princess apparaten, Brabantia/Mepal/Weck opbergen, kookboeken). Totaal 2830 producten.
- Ronde 100 live (24-10-2026): 28 kerstproducten van bol (12 adventskalenders, Villeroy & Boch/Blond Amsterdam kersttafel, kerstpuzzels en kerstspeelgoed). Totaal 2858 producten.
- Ronde 101 (24-10-2026): 42 bol-producten live – haken & breien, zelf maken, telefoon, buitenverlichting, tuingereedschap, rugzakken & reistassen, kleding & sokken.
- Ronde 102 (24-10-2026): 42 bol-producten live – wijnaccessoires, koffie & thee, fietsen, gereedschap.
- Ronde 103 (24-10-2026): 36 bol-producten live – sieraden voor hem, foto & video, schrijven, fitness, wandelen.
- Ronde 104 (24-10-2026): 45 bol-producten live – lp’s, kookboeken, bakken, bbq, reizen, verzorging, opbergen.
- Ronde 105 (24-10-2026): 45 bol-producten live – slimme gadgets, gaming, keukenapparaten, darts, huisgeuren, dieren.
- Ronde 106 (24-10-2026): 51 bol-producten live – tassen, parfums, kinderboeken, lezen, plaids & kussens, planten, puzzels, koken.
- Ronde 107 (24-10-2026): 47 bol-producten live – serveren, buitenspeelgoed, horloges, accessoires, kaartspellen, audio.
- Ronde 108 (25-10-2026): 46 bol-producten live – baby & peuter, bouwen, bordspellen, verlichting, woonaccessoires, kamperen, pantoffels.
- Ronde 109 (25-10-2026): 42 bol-producten live – snoep & drop, sieraden (zilver, echt goud), tekenen & schilderen, modelbouw, poppen.
- Ronde 110 (25-10-2026): 30 bol-producten live – kaarsen, tuinvogels, yoga & zwemmen, zaden & kweeksets.
- Ronde 111 (25-10-2026): 49 producten van bol: proefjes en wetenschap, speelgoedvoertuigen, knuffels en kinder-elektronica.
- Ronde 112 (25-10-2026): 82 producten via Daisycon: wodka en sterke drank (Decantalo), adventskalenders (Dropwinkel, Ditverzinjeniet, Dille & Kamille), cadeaus voor honden (Ditverzinjeniet, Westwing, Dille & Kamille), zaden en kiemgroente (Dille & Kamille, Bloompost, Ditverzinjeniet).
- Ronde 113 (25-10-2026): 51 cadeaus voor collega (Ditverzinjeniet, Dille & Kamille, Bloompost, Dropwinkel). Productstudio zette 17 bureau-cadeaus per ongeluk op boeken-media/romans; bij livegang gezet op cadeaus/collega.
- Ronde 114 (25-10-2026): 44 kerstcadeaus onder 25 euro (Dille & Kamille, Ditverzinjeniet, Kerstland, Westwing). 5 goedgekeurde varianten weggelaten omdat er al bijna dezelfde op staat (Norton-krans, vilten kerstballen, geurkaars, winterthee, kerstman-pop).
- Ronde 115 (25-10-2026): 44 kerstcadeaus onder 25 euro van bol (vanaf nu vooral bol, Daisycon staat op pauze).
- Ronde 116 (25-10-2026): 35 Sinterklaas-schoencadeautjes onder 15 euro van bol.
- Ronde 117 (25-10-2026): 17 christelijke cadeaus van bol (muziek, sieraden, kerststal, Ark van Noach).
- Zoekbalk (25-10-2026): witte zoekbalk onder het menu op elke pagina (niet op /zoek). Tips met foto en prijs tijdens het typen (pijltjes en Esc werken). Zoeken negeert accenten en vergeeft één tikfout (fiest → fiets, lgeo → lego). Hele woorden in de titel tellen zwaarder.
- Ronde 118 (25-10-2026): 21 cadeaus voor collega van bol.
- Ronde 120 (25-10-2026): christelijk in gereformeerde stijl – doop & belijdenis, dagboeken, Nederlandse kinderboeken en Bijbelteksten (HSV/SV), bol (29 nieuw; HSV Bijbel met psalmen ook in Doop & belijdenis).
- Ronde 121 (25-10-2026): cadeaus voor collega's – pauzespellen, werkplek, lunch, bedankt en kerst, bol (22 producten).
- Ronde 122 (25-10-2026): sfeer en snoep – lavalampen, popcorn en filmavond, sterrenprojectors, geurbalsem, fondue, bol (27 producten).
- Ronde 123 (25-10-2026): dunne vakken – nieuwe Nederlandse romans en thrillers, haken & breien, knutselen, telefoon, bol (30 producten).
- Ronde 124 (25-10-2026): cadeaus voor collega's – kerst/sint lekkers, afscheid met humor, warm op kantoor, planten, bol (18 producten).
- Over ons uitgebreid en cadeaugidsen toegevoegd (/gids: Sinterklaas onder €15, collega, opa & oma, sfeerlicht) (25-10-2026).
- Ronde 125 (25-10-2026): geuren (parfumsets, bodymist, geurbalsem) en dieren (hond, kat, klein dier, vogels), bol (33 producten).
- Ronde 126 (26-10-2026): Sinterklaas – sint-boeken, puzzels en schoencadeautjes onder €15, bol (30 producten).
- Ronde 127 (26-10-2026): 29 producten sport, reizen en keuken (golf, fiets, wandelen, fitness, reizen, keukenapparaten, bakken, foto-video), alleen bol zelf.
- Ronde 128 (26-10-2026): 26 producten dunne vakken (buitenverlichting, tuingereedschap, tassen, haken-breien, huisgeuren, telefoon, kookboeken), alleen bol zelf.
- Opschoning (26-10-2026): 55 bol-producten weggehaald (niet meer in feeds / niet leverbaar), 171 prijzen bijgewerkt uit de feeds. Script: check-dood.py op de laptop.
- Gidsen en seizoen (26-10-2026): 6 nieuwe cadeaugidsen (sint onder €10, sint volwassenen, kerst onder €25, kerst haar/hem/collega); op de homepage staan de seizoensblokken en een gidsenrij nu direct onder de hero.
- Categorieteksten (26-10-2026): assets/js/teksten.js met per (sub)categorie een intro, Google-titel, omschrijving en tips onder de producten. app.js leest ze als data.js niets heeft. Ook /babycadeaus doorgestuurd.
- Technische check (26-10-2026): 32 te lange Google-titels ingekort; hoofdfoto productpagina laadt direct (fetchpriority high); Product-schema met availability en itemCondition; teksten.js versie gelijkgetrokken.
- Winkellinks-check (26-10-2026): 19 producten weg (404 bij Westwing, WoodWick, Kerstland). Script check-winkels.py op de laptop; Decantalo, LEGO, La Redoute, Den Hertog, Timberland en Dr. Martens blokkeren de check.
- Lees ook (26-10-2026): elke gids heeft 'vakken'; in die vakken staat onder de subcategorieën een balk 'Lees ook' met max. 3 gidsen.
- Subplaatjes (26-10-2026): 16 nieuwe plaatjes van Nova (o.a. alle cadeaus-subs, schoenen, golf, christelijk kerst/bijbels, whisky, adventskalenders, figuren & voertuigen). Bestandsnamen eindigen op -2026b.
- Werkwijze (26-10-2026): zie WERKWIJZE.txt in deze map – alle afspraken en hoe we werken, in gewone taal (ook als LEES-MIJ op Marius' bureaublad). Lees dit eerst in een nieuw gesprek.
- Ronde 129 (27-10-2026): 28 producten 'Wat Nederland nu zoekt' (Speelgoed van het Jaar 2026, Tamagotchi, blind boxes, kindertech, geur-trends). 7 stuks stonden in de keuring per ongeluk op boeken-media/romans (Productstudio miste figuren-voertuigen) en zijn op speelgoed/figuren-voertuigen gezet; Productstudio-categorieën bijgewerkt.
- Gids Speelgoed van het Jaar 2026 (27-10-2026): 16 winnaars in 4 delen; tweede op de homepage; vakken speelgoed, voor-kinderen, sinterklaas.
- Gidsen hypes-2026 en geuren-trends-2026 (27-10-2026), elk 16 producten.
- Ronde 130 (27-10-2026): 21 producten (Replica Jazz Club vervangen door Replica Lazy Sunday Morning: bol-foto van Jazz Club toonde By the Fireplace) 'Virale cadeaus 2026' (Stanley, Ninja CREAMi, Cosori Twinfry, JBL, Bose, Polaroid Pikachu, ghd Wave, 4 LEGO Botanicals, beauty-hits als Sol de Janeiro, Laneige, Dior, Kayali). Alles goedgekeurd.
- Gids virale-cadeaus-2026 (27-10-2026): 16 TikTok-hits voor volwassenen in 4 delen (apparaten, audio, LEGO Botanicals, beauty); beeld LEGO-magnolia; niet op de homepage.
- Sfeerfoto's (27-10-2026, wens Marius): 386 producten met echte sfeerfoto (met de hand bekeken) hebben "sfeer": 1 in producten.js; foto vult de kaart (cover) en ze staan vooraan in gidsdelen en Uitgelicht (sfeerEerst in app.js). Witte foto's krijgen overal een warme studio-achtergrond (radial-gradient + mix-blend-mode multiply + schaduw), ook op de productpagina bij één foto (klasse studio). Ook in de vakken ('Aanbevolen'): mix() geeft sfeer-producten -0.6 op _mix (vooraan binnen elke prijsbak, prijsmix en winkelafwisseling blijven), favorieten met sfeer eerst.
- Menu Alle categorieën (27-10-2026): toonde max. 6 subs per categorie (24 vielen weg) en was niet te scrollen (onderkant viel weg). Nu alle subs in kolommen (column-count 4/5) en max-height = schermhoogte met scrollen.
- Pakketten & borrel (27-10-2026): 17 bestaande geschenkdozen (Dammann, Tony's, Côte d'Or, Pukka, Chupa Chups kerstbox e.a.) kregen ookIn eten-drinken/pakketten (20 -> 37). bol verkoopt zelf bijna geen echte kerstpakketten.
- Ronde 131 (27-10-2026): 6 borrelproducten (kaasplank Blond Amsterdam, Leopold Vienna borrelplank, Kikkerland kaasmesjes, Winkee Bottle Boards, Vilde serveerplank, Serax Pascale Naessens), keuken/serveren met ookIn pakketten/collega/kerst. Pakketten & borrel nu 43.
- Categorievolgorde (24-10-2026, wens Marius): Cadeaus, Speelgoed, Eten & Drinken, Hobby, Mode & Beauty, Sieraden, Dranken, Elektronica, Sport, Wonen, Keuken, Tuin, Metaaldetectie, Boeken, Dieren, Christelijk.
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
- Ronde 132 (27-10-2026): eerste TradeTracker-ronde (site-ID 516846). 38 live: IJzersterke geschenken (14 metalen beroepsbeeldjes), Place the Moment (4 posters), CoolGift (8 met naam/foto), Gadgets en trends (6), Wijny (6). Weg: CoolGift-mok met huisdier (feedfoto hoort bij ander product), Repeat-sjaal (zwart op zwart, niet te zien); 5 Repeat afgekeurd. Cadeau.nl = zelfde assortiment als Ditverzinjeniet (overslaan), Yesgifts/Kado-versturen = goedkope relatiegeschenken (overslaan). Ditverzinjeniet (339) loopt nu via TradeTracker. LET OP bij feeds: foto's in TradeTracker-feeds kloppen niet altijd (CoolGift PERS-producten); elke foto naast de titel controleren.
- Ronde 133 (27-10-2026): 19 mooie merken via TradeTracker (Wrendale, Riviera Maison, Bunzlau Castle via Countrylifestyle; Lucide via Lamponline; 5 LEGO via De Grote Speelgoedwinkel). Afgekeurd: Riviera Maison karaf Vino Aqua. Foto's vooraf met de hand bekeken.
- Ronde 134 (27-10-2026): Kerst in huis, 17 producten (Bellatio-verlichting en kerstdorpen, Riviera Maison, PiP Studio, Wrendale, Bunzlau, Ashleigh & Burwood). Alles goedgekeurd.
- Ronde 135 (27-10-2026): Verwenmomenten en mooi wonen, 18 producten (Ashleigh & Burwood, Bridgewater, PiP Studio, Riviera Maison, Light & Living, Homebound). Alles goedgekeurd. Pins van de met 'pin' gemarkeerde producten: Bureaublad\PIN\pin 1 (neutrale achtergrond, zonder prijs).
- Ronde 136 (27-10-2026): Spellen en speelgoed, 15 producten van De Grote Speelgoedwinkel (Ravensburger 3D-puzzels, Stratego, Carcassonne, Ticket to Ride, Azul, Dixit, Tiptoi, Schleich, Playmobil, Furby). Alles goedgekeurd. 9 pins: Bureaublad\PIN\pin 2. De Productstudio heeft nu een pin-vinkje (toets P); de keuring krijgt dan "pin": true.
- Ronde 137 (27-10-2026): Klassiek en stoer, 14 producten van Countrylifestyle (Authentic Models messing/hout, Belpo wollen plaids, Riviera Maison whiskyset, Gien mokken). Alles goedgekeurd. 11 pins: Bureaublad\PIN\pin 3. Vanaf pin 3 nieuwe pinstijl (Marius): witte achtergrond, grote foto zonder lijst, korte titel erboven, klein logo onderaan in het midden. Let op: de site van Countrylifestyle toont 'uitverkocht'-tekst ook bij producten die wel leverbaar zijn; echt uitverkocht = 'Deze maat is uitverkocht'. 'Alleen af te halen' = niet opnemen.
