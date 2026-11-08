# Werkopdracht voor Nova: Sint-rijmmachine verbeteren (8-11-2026)

## Waar de code staat
- Broncode: `scripts/rijmmachine/sint-rijm.ts` op de branch `main` van de openbare repo `egeltje86-max/leukekeuze-nieuw`.
  Direct: https://github.com/egeltje86-max/leukekeuze-nieuw/blob/main/scripts/rijmmachine/sint-rijm.ts
- Live functie: `sint-rijm` (versie live-15). Testfunctie: `sint-rijm-test` (nu precies dezelfde code, versie "test-15 (kopie van live-15)").
- De OpenAI-sleutel staat alleen in de geheimen van Supabase. De functie leest hem zelf; je hebt hem niet nodig.

## Harde afspraken
1. Je past alleen `scripts/rijmmachine/sint-rijm.ts` aan. Niets anders, ook niet `assets/js/app.js`.
2. Testen alleen in `sint-rijm-test`. Nooit `sint-rijm` (live) aanpassen.
3. Niets zelf live zetten en niet naar `main` pushen. Lever je versie als bestand of op een eigen branch (bijv. `nova-rijm`).
4. Geen API-sleutels, tokens of andere geheimen in code, in git of in de chat.
5. Houd de invoer en uitvoer hetzelfde (het formulier op de site verandert niet):
   invoer: naam, relatie, geslacht, type, gekop, typisch, budget, stand (lief/hilarisch/genadeloos), optioneel test{}.
   uitvoer: titel, gedicht, cadeaus[1], meer[max 6], totaal, en bij test{} ook oordeel/tijd.
6. Laat de veiligheid staan: GRENZEN (geen grappen over uiterlijk, ziekte enz.), kindvriendelijk bij kinderen, de bezoekerslimiet en de catalogus-filters.
7. Elke wijziging met een korte uitleg bovenaan het bestand (wat en waarom), zodat het te controleren is.

## Waar je aan werkt
- Natuurlijk Nederlands: zinnen zoals een mens ze zegt, geen omgekeerde volgorde om te rijmen.
- Zuiver eindrijm (klemtoon op het rijm, geen bijna-rijm), regelmatig ritme (9 tot 11 lettergrepen).
- Betere humor en herkenbare persoonlijke grappen op basis van wat de klant invult. Niets verzinnen dat niet is ingevuld.
- Vloeiend: elke regel een afgerond stuk zin.
- Snelheid: nu 26 tot 37 seconden. Liever niet langzamer.

## Hoe we vergelijken
- Vaste testset: `scripts/rijmmachine/testset.json` (10 personen). Niet aanpassen.
- `python scripts/rijmmachine/vergelijk.py sint-rijm` (live) en `python scripts/rijmmachine/vergelijk.py sint-rijm-test` (jouw versie).
- We kijken naar: punten van de rijmcontrole (0 = geen fouten gevonden), tijd, en Marius leest de gedichten zelf (lachen, klopt het Nederlands).
- Claude controleert de code (alleen dit bestand veranderd, regels hierboven) voordat er iets live gaat. Marius beslist.
