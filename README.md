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

**Ronde 2: binnen ✔**
Alle 13 categorieën: tegel (`categorie-<naam>.webp`, 800×800) en banner (`banner-cat-<naam>.webp`, 1920×640).
Nova's originelen staan in `images/nova-origineel/`.

**Ronde 3: subcategorieën binnen ✔**
Alle 66 subcategorie-rondjes (`images/sub/sub-<categorie>-<sub>.webp`, 600×600).

**Nog open**
- `deel-afbeelding.webp` (1200×630): plaatje bij delen via WhatsApp/Facebook
- Neutrale homebanners voor na de feestdagen

Tot een plaatje er is, toont de site een gouden icoon. Plaatje toevoegen = bestandsnaam invullen in `data.js`.
