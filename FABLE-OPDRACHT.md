# Grote opdracht voor Fable: LeukeKeuze.nl af en op de automatische piloot

Gemaakt op 8 november 2026 door Claude, op basis van de audit van Nova, een eigen controle van de site en de cijfers van GoatCounter en Search Console.
**Lees eerst `CLAUDE.md` helemaal.** Die werkafspraken gelden altijd. Waar deze opdracht iets anders zegt, gaat deze opdracht voor.

## Wat Marius wil
Marius wil vanaf nu zo min mogelijk zelf doen. Hij wil afwachten en reclame maken. Het vullen en keuren laat hij voorlopig los.
Jouw opdracht bestaat uit twee delen:
1. **Eén complete update** die de fouten en zwakke plekken hieronder oplost.
2. **Een automatische piloot**: elke dag onderhoud, elke dag nieuwe producten op basis van trends, en een dagelijkse check. Marius hoort alleen iets als er echt iets moet veranderen.

**Eerst moet alles kloppen, daarna moet het beter verkopen.** Bouw de site niet opnieuw en maak geen nieuw ontwerp. De luxe uitstraling, de huidige indeling, de handmatige keuringen en de bestaande URL's blijven.

## Hoe je met Marius omgaat in deze opdracht
- Marius heeft één GO gegeven voor dit hele pakket. Vraag niet per stap om toestemming.
- Toon hem **één keer één bundel voorbeelden** (schermafbeeldingen op de telefoon) van alles wat er zichtbaar verandert: het eerste scherm, de productpagina, Voor wie bovenaan, VONK en de rijmmachine. Na zijn "ja" mag het live, in delen.
- **Vraag wel eerst** bij: meer dan 50 producten tegelijk van de site halen, een nieuwe partner of nieuw geld of account, iets wat niet terug te draaien is, of een wijziging in de categorie-indeling.
- Elk deel: bouwen, controleren (`CLAUDE.md` §5), dan pas live. Elk deel moet terug te draaien zijn met een aparte commit.
- Meld na elk live gezet deel in 2 of 3 simpele Nederlandse zinnen wat er beter is.

## Deel 1 – De complete update (in deze volgorde)

### P0 – Eerst wat niet klopt (direct)
1. **Budgetgidsen houden zich aan hun budget.** Gevonden: in "Sinterklaas onder €10" staat Skip-Bo Junior (€13,95) en in "Kerst onder €25" staat Côte d'Or in houten kistje (€26,95). Controleer alle gidsen, collecties en prijsknoppen (onder €5, €10, €15, €25 ...). Wat te duur is gaat uit die selectie, het product blijft wel op de site. Vervang het door een passend product dat al goedgekeurd is.
2. **Leeftijd en veiligheid bij speelgoed.** Gevonden: LEGO Norbert (76477, officieel 9+, kleine onderdelen) kwam boven bij 0 tot 2 jaar. Haal de leeftijd uit betrouwbare productgegevens: de feed, de merkinformatie of een leeftijd in de titel zoals "9+" of "vanaf 3 jaar". Producten met kleine onderdelen of 3+ komen nooit in baby/peuter (0 tot 3). Weet je de leeftijd niet, laat het product dan weg uit leeftijdsselecties. Haal het product alleen uit de verkeerde selectie, gooi het niet van de site.
3. **Privacyverklaring klopt met de werkelijkheid.** De verklaring zegt dat er geen formulieren zijn en dat er niet naar namen wordt gevraagd. De Sint-rijmmachine vraagt wel een naam en eigenschappen, en stuurt die via een Supabase-functie naar een AI (OpenAI). Zoek uit wat VONK en de rijmmachine precies versturen, waarheen, en hoe lang het bewaard blijft. Pas de tekst daarop aan. Kijk ook of de hosting nog klopt (GitHub Pages). Zet een korte regel onder de invulvelden van de rijmmachine. Voeg geen cookiebanner toe en ga niet extra tracken.
4. **Eerlijke prijzen en claims.** Elk product krijgt een zichtbare datum waarop de prijs gecontroleerd is ("prijs gecontroleerd op …"). Is die ouder dan 7 dagen, dan staat er "bekijk de actuele prijs bij de winkel" en geen harde prijsbelofte. Beoordelingen of sterren zonder controleerbare bron haal je weg, of je zet de bron erbij. Korting tonen we alleen als er een echte van-prijs uit de feed is (ACM).
5. **Links die werken.** Controleer of elke winkelknop naar de juiste winkel en het juiste product gaat, met de partnercode. Kapotte links en uitverkochte producten gaan naar een controlelijst en uit de lijsten. Ze worden niet stilletjes verwijderd.

### P1 – Daarna: makkelijker kiezen, meer doorkliks
6. **Het eerste scherm op de telefoon.** Bijna alle bezoekers gebruiken een telefoon. Nu zie je op het eerste scherm geen product: de Sint-balk, het logo, de grote zoekbalk, het kruimelpad en de foto nemen alles in. Zorg dat op elke productpagina de **prijs, winkel en knop "Bekijk bij winkel"** zonder scrollen zichtbaar zijn. Zorg ook dat op lijstpagina's (Black Friday, Voor wie, collecties) de **eerste producten** op het eerste scherm staan. Doe eerst onderzoek naar verkooppsychologie.
7. **Voor wie bovenaan.** Voor haar heeft ongeveer 4.700 producten en voor hem 3.800. Zet bovenaan elke Voor wie-pagina **de 6 beste**: passend, goed geprijsd, leverbaar en met een goede foto. Gebruik `topkeuze.js` en `rang`. Daaronder blijft alles zoals het was.
8. **Collecties doen wat ze beloven.** In Grappige cadeaus staan ook gewone bordspellen en kinderboeken. Ga Grappig, Origineel, Toppers van nu, Kinderen, Tieners en Persoonlijk na. Een product hoort er alleen in als het echt past. Haal verkeerd ingedeelde producten uit die collectie, maar laat ze op de site.
9. **Productpagina, vaste opbouw:** foto, naam, prijs en winkel, "waarom gekozen", knop "Bekijk bij winkel", en daarna maximaal 4 echt passende alternatieven. Geen lange verkooppraat. Vergelijk prijzen bij meerdere winkels alleen als het product echt hetzelfde is (zelfde EAN/GTIN).
10. **VONK.** Maximaal 3 simpele vragen, dan 6 voorstellen met prijs en winkel. Per voorstel de knoppen "Niet leuk", "Toon andere", "Goedkoper" en "Bewaren". Het scherm springt niet naar boven. Er is een duidelijke laadstatus en foutmeldingen staan in gewoon Nederlands.
11. **Zoeken.** Test minstens "cadeau oma tot €25", "lego", spelfouten en synoniemen. Een budget in de zoekvraag moet ook echt binnen dat budget blijven. Geeft een zoekvraag niets, toon dan iets bruikbaars in plaats van een lege pagina.
12. **Black Friday.** De bovenste 12 zijn de deals die Marius zelf koos (`LK_TOPKEUZE["/collectie/black-friday"]`). Hou dat zo. Zorg dat de rest gemixt is en dat er een echte van-prijs is. Geen nep-urgentie.
13. **Sint-rijmmachine.** De stappen worden: naam, wie is het, iets grappigs, maak gedicht. Daarna komen de 3 cadeaus. Het gedicht kun je kopiëren of via WhatsApp delen. Test het met iemand die weinig met websites doet.

### P2 – Daarna: gevonden worden
14. **AI-assistenten.** ChatGPT stuurt nu ongeveer 4x zoveel bezoekers als Google (2 tot 8 november: 138 tegen 37). Onderzoek hoe ChatGPT, Perplexity, Gemini en Google AI Overviews bronnen kiezen. Pas daarna het beste toe: een `llms.txt`, duidelijke gidspagina's met korte antwoorden op echte vragen zoals "cadeau collega max €15", gestructureerde data, en een datum en eerlijkheid bij elke gids.
15. **Google.** De sitemap heeft ongeveer 11.600 adressen. Kijk in Search Console welke pagina's worden vertoond of aangeklikt; vooral productpagina's leveren nu bezoekers op. Controleer canonicals, titels, beschrijvingen, redirects en interne links. Kijk of producten achter "Toon meer" voor Google te vinden zijn. Gebruik Product-structured data die past bij een informatiepagina (wij verkopen zelf niet). Haal **nooit** in bulk pagina's weg zonder analyse en akkoord van Marius.
16. **Snelheid en toegankelijkheid.** Op de telefoon gelden deze doelen: LCP ≤ 2,5 s, INP ≤ 200 ms, CLS ≤ 0,1. Knoppen zijn met één hand te bedienen, tekst is leesbaar zonder inzoomen en het contrast voldoet aan WCAG 2.2 AA. Geen pop-ups en geen drukke animaties.

## Deel 2 – De automatische piloot (bouw dit als laatste en laat het daarna draaien)

### Dagelijkse controle (geplande taak, elke ochtend)
Maak een vaste geplande taak die elke dag deze checks draait en een kort rapport maakt:
- de gewone controle (`scripts/controle/check.js`): alles 0
- geen product boven het budget van een gids, collectie of prijsknop
- geen product met een onjuiste leeftijd in baby, peuter of kinderen
- geen winkelknop zonder partnercode of met een verkeerde bestemming
- geen korting zonder echte van-prijs, en geen verlopen kortingscode
- geen kapotte foto's, geen dubbele producten
- geen handmatige keuring kwijt (status en vak uit `correcties.json` blijven staan)
- geen waardevolle pagina verdwenen (oude Google-adressen werken nog)

Kleine dingen los je zelf op, binnen de regels van `CLAUDE.md`, en die zet je live na bouwen en controleren. Denk aan een prijs bijwerken, een uitverkocht product uit een lijst halen of een product uit een verkeerde selectie halen.
**Marius krijgt alleen een bericht als het echt moet:** als iets niet automatisch kan, als een partner stopt, bij een grote daling van bezoekers of kliks, of bij iets wat geld of veiligheid raakt. Schrijf dan in 3 zinnen wat er is en wat jij voorstelt.

### Dagelijks onderhoud
- Gebruik het bestaande nachtwerk (`scripts/nachtelijk.py`, 03:30 op de laptop): prijzen en voorraad uit de verse feeds. Neem die zelf over via `scripts/keurkamer/nazorg.py`, met de veiligheidsgrenzen die erin zitten.
- Wat uitverkocht is gaat uit de lijsten. Een prijs die meer dan verdubbelt of halveert wordt niet overgenomen maar gemeld.

### Dagelijks nieuwe producten op basis van trends
- Kijk elke dag wat nu gevraagd wordt: het seizoen (Sint, kerst, Valentijn ...), wat bezoekers zoeken (GoatCounter en Search Console), wat aanslaat bij partners, en trends van nu zoals KPop Demon Hunters, Squishmallows, Instax en Stitch.
- Voeg **maximaal 15 producten per dag** toe, alleen van partners (geen bol-scraping, alleen officiële feeds), met een goede foto, een eerlijke prijs en een korte "waarom".
- Strenge poort: past in een vak, geen dubbel, geen troep, partnercode aanwezig, leeftijd en budget kloppen. Twijfel je, dan voeg je het niet toe.
- Zet elke toevoeging in het rapport, zodat Marius altijd kan terugkijken en terugdraaien.

### Elke week (maandag) één kort overzicht voor Marius
Geef 5 regels in gewoon Nederlands:
- bezoekers per bron (ChatGPT, Google, rechtstreeks, Pinterest)
- kliks naar winkels
- de beste pagina's en producten
- wat er automatisch is gedaan
- 1 tip voor reclame die week

## Verplichte praktijktests voordat je klaar bent
1. Sinterklaas onder €10: alles onder €10.
2. Kerst onder €25: alles binnen het budget.
3. Leeftijd 0 tot 2 jaar: geen LEGO 9+ en niets met kleine onderdelen.
4. "cadeau oma tot €25": alleen passende cadeaus tot €25.
5. "lego": bruikbare LEGO-resultaten.
6. VONK: antwoord wijzigen zonder dat het scherm springt.
7. Verlanglijstje: bewaren, verwijderen, herladen en delen.
8. Mobiele navigatie: geen knoppen over elkaar heen.
9. Productknop: de juiste winkel, het juiste product en de partnercode.
10. Productprijs: de controledatum is zichtbaar.
11. Oude Google-adressen: werken nog.
12. Telefoon: op het eerste scherm van een productpagina zie je prijs en knop.

## Opleveren
- Een kort plan vooraf: wat je gaat doen, in welke volgorde, en hoe je het controleert.
- Eén bundel voorbeelden voor Marius (zie boven), dan de uitvoering in delen.
- Daarna draait de piloot. Marius hoort alleen iets als het echt moet, plus het weekoverzicht op maandag.
