# NOVA REBEL – voorbeeld (18-11-2026)

Nova leverde 'NOVA REBEL – DUTCH OVERDRIVE, deel 1': acht icoontjes voor Voor wie (zwart, knalgeel, rood-wit-blauwe streep).
Marius vroeg: 'hoe ziet de site eruit als je de kleuren meeneemt, alleen het uiterlijk, maak een voorbeeld'.

- `rebel.css`: alleen uiterlijk, alles hangt aan `html.rebel`. Zonder die klasse verandert er niets.
- `rond/`: de acht icoontjes van Nova rond uitgesneden (384 en 240 px), zelfde namen als `images/sub/rond/voor-*`.
- `shoot2.js`: maakt schermafbeeldingen op 390 px met de stijl erin geplakt (lokale server op poort 8765).
  `NODE_PATH=$(npm root -g) node scripts/rebel/shoot2.js rb scripts/rebel/rebel.css 2`

Niets hiervan staat live. Pas na GO van Marius: eerst een testlink (`?proef=rebel`, alleen voor wie de link opent),
dan voor iedereen. Let op paragraaf 8 van CLAUDE.md (huisstijl): die verandert dan mee.

## Levering 001 en 002 (18-11-2026, avond)
- 001 hoofdcategorieën (15, `a-*.png`, RGB met zwarte hoeken) en 002 gelegenheden (16, `o-*.png`, doorzichtige hoeken). Namen kloppen precies met `lijst-alle-bestanden.csv` van het dossier (31 van 31).
- In `rond/`: `cat-<slug>.webp` en `gel-<slug>.webp` (384 en 240 `-klein`), rond uitgesneden op de gele cirkel zelf (de zwarte hoeken vallen weg). Zelfde namen als de huidige beelden: `images/categorieen/rond/cat-*` en `images/sub/rond/gel-*`.
- `shoot2.js` vervangt nu `voor-`, `cat-` en `gel-` (5e argument: alleen bepaalde pagina's, bijv. `home,gelegenheden,producten`).
- `rebel.css` kreeg regels voor de tegels op /gelegenheid/ (`.keuzerond`) en Zoek een product (`.srt-blok`, `.srt-vt`).
- Opmerking voor Nova: Boeken & muziek en Christelijke cadeaus zijn allebei een open boek (met een muzieknoot of een kruis); op 44 px lijken ze op elkaar. 'Vaak gezocht' toont nog de oude plaatjes tot die reeks binnen is.
- Live zetten (na GO): de webp's uit `rond/` over de oude beelden zetten (de oude eerst bewaren). Let op: een plaatje met dezelfde naam kan bij vaste bezoekers nog uit het geheugen van hun telefoon komen; kijk na of de bouw er een versie achter zet, anders nieuwe bestandsnamen gebruiken.
- **Mening Marius (18-11-2026 avond):** 'heel eerlijk, ik vind het echt lelijk, dat gele'. Het knalgele vlak (kop, blok achter 'Voor wie', knoppen) gaat zo niet live. Geef dit door aan Nova voordat er meer in deze stijl wordt gemaakt.
