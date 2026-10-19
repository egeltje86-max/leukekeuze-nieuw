# LeukeKeuze – nieuwe site (testversie)

Volledig nieuwe LeukeKeuze in stijl **Luxe & Premium** (donker + goud), op basis van Nova's ontwerp.
Niets van de oude site overgenomen. **Status: test. Niets gaat live zonder GO van Marius.**

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

**Ronde 2: nodig**
Per categorie een tegel `categorie-<naam>.webp` (800×800) en een banner `banner-cat-<naam>.webp` (1920×640):
wonen · elektronica · keuken · mode-beauty · sport-outdoor · tuin-klussen · dieren · hobby · boeken-media · eten-drinken
Plus: `banner-cat-christelijk.webp` en `banner-cat-speelgoed.webp`.

**Ronde 3: later**
Subcategorie-rondjes (600×600) voor de andere categorieën, neutrale homebanners (na de feestdagen),
`deel-afbeelding.webp` (1200×630).

Tot een plaatje er is, toont de site een gouden icoon. Plaatje toevoegen = bestandsnaam invullen in `data.js`.
