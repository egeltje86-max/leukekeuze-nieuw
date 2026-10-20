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
| `keurkamer/` | Keurkamer (verborgen, nog niet op slot) |

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
- Keuren gebeurt in de losse Keurkamer op Marius' bureaublad ("Keurkamer LeukeKeuze (nieuw)"). Die exporteert een keuringen-bestand; Claude zet de goedgekeurde producten in `assets/js/producten.js`.
- `url` = partnerlink (telt als klik). `winkelUrl` = gewone winkelpagina, gebruikt voor controles en in de Keurkamer (telt niet als klik).
- Alle partnerlinks hebben `rel="sponsored nofollow noopener"`, zodat robots ze niet volgen.
- Productfoto's: `images/producten/dvzn-<sku>.webp` (1000px) en `-klein.webp` (500px), uit de productfeed van de winkel.
- Voorbeeldproducten staan er nog, maar niet meer in de cadeau-rubrieken die nu echte producten hebben.

## Livegang (19-10-2026)
- Geen noindex meer; robots.txt staat alles toe; sitemap.xml; canonical = https://leukekeuze.nl/
- Voorbeeldproducten en voorbeeldfoto's verwijderd. Alleen echte, goedgekeurde producten.
- Keurkamer van de site verwijderd (staat nu los op het bureaublad van Marius).
- Netlify: `netlify.toml` (geen build, publish = .), `_redirects` voor oude adressen, `404.html` stuurt naar home.
- Contact: leukekeuze.nl@gmail.com. Nog te doen door Marius: privacy- en disclaimertekst nalezen.
