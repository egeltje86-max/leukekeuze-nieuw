# Keurkamer – zo werkt het (voor Marius en voor Claude)

Doel: alleen **leuke keuzes** op leukekeuze.nl. Elke categorie en elk vakje wordt opnieuw gekeurd, met hulp van
regels en een AI-keurmeester, maar Marius beslist. Wat weg is, blijft weg (ook als een feed het later weer aanbiedt).

## De zes stappen

1. **Regelmotor** (`scripts/keurkamer/effectief.js` + `verzamel.py`)
   Zet alle producten neer zoals de site ze echt toont (eigen vakje + extra vakjes) en controleert ze op regels:
   dubbelen, foto te klein/wazig/leeg, Engelse of te korte teksten, drank buiten Dranken, kaarsen buiten Kaarsen,
   christelijk buiten Christelijk, Mijn Hummeltje, links zonder partnercode, prijs 0, oude persoon-vakjes.
   Uitkomst: `keurkamer/data/catalogus.json` (niet in git, groot).

2. **AI-keurmeester** (`scripts/keurkamer/ai-keur.py` + `keurkamer/ai/OPDRACHT.md`)
   `ai-keur.py maak` knipt alles in porties (`keurkamer/ai/in-NNN.json`, ±90 producten per portie, per vakje).
   Elke portie wordt gekeurd door Claude (agents) of door OpenAI (`ai-keur.py openai`, sleutel via OPENAI_API_KEY,
   nooit uit een bestand). Per product per vakje: past (0-100), leuk (0-100), vertrouwen, advies
   (houden / verplaatsen / niet-hier / weg / twijfel) en een reden van één zin.
   `ai-keur.py controleer NNN` keurt het antwoordbestand af bij fouten; `ai-keur.py verwerk` zet alles in
   `keurkamer/ai-oordelen.json`. Voor nieuwe rondes: `ai-keur.py maak --alleen-nieuw`.
   Lessen: na elke keuring van Marius schrijft `verwerk.py` naar `keurkamer/ai/LESSEN.md` waar hij het anders zag;
   de AI leest dat de volgende keer mee.

3. **Keurkamer-app** (`scripts/keurkamer/keurkamer.html`, gemaakt met `maak-keurkamer.py`)
   Staat op de laptop in `Desktop\Keurkamer LeukeKeuze\` ("Keurkamer openen.html"). Overzicht van alle vakjes
   met wat de AI vond, keuren met 24 kaartjes per pagina (aandacht eerst), knoppen Houden / Verplaatsen (of Niet hier)
   / Weg / Twijfel, ster voor toppers, tekst verbeteren, "Volg AI-advies", vakje afronden met checklist.
   Bewaart vanzelf in de browser; "Download mijn keuring" geeft `keurkamer-JJJJ-MM-DD.json`.

4. **Verwerken** (`scripts/keurkamer/verwerk.py <export.json> [--toepassen]`)
   Laat eerst zien wat er verandert (rapport in `keurkamer/rapporten/`). Met `--toepassen`: oordelen blijvend in
   `keurkamer/oordelen.json`, `producten.js` aangepast (weg = afgekeurd, verplaatst = nieuw vakje + subVast,
   niet-hier = uit ookIn, topper = favoriet, tekst), taken voor Claude in `keurkamer/taken.json`, twijfel apart.
   Daarna: `node scripts/splits-producten.js`, bouwen, en na de GO van Marius online.

5. **Bouwslot** (in `scripts/splits-producten.js`)
   Bij elke bouw worden de oordelen afgedwongen: weg blijft weg, nietIn blijft eruit, en een product met dezelfde
   winkelpagina als een afgekeurd product (zwarte lijst) komt niet live. Ook als een nieuwe ronde het weer aanbiedt.

6. **Bewaking**
   - `scripts/keurkamer/wacht.py` (op de laptop, waar de feeds staan): prijs veranderd, uitverkocht, niet meer in de feed.
     Uitkomst `keurkamer/wacht/wacht-laatste.json`; het Sitewacht-rapport neemt het mee.
   - `scripts/keurkamer/sitewacht.py`: elke maandag een rapport met een sitecijfer (Google · Winkel · Techniek),
     de Search Console-cijfers (klikken, vertoningen, kansen), de staat van de catalogus en een top-10 actielijst.
     Rapporten in `keurkamer/rapporten/` (niet in git); Marius krijgt ze per bericht.

## Wat in git staat en wat niet
In git: de scripts, `keurkamer/vakjes-lijst.json` en `vakjes.json` (wat hoort waar), `keurkamer/ai/OPDRACHT.md`,
`keurkamer/oordelen.json` (het geheugen; nodig voor het bouwslot), `taken.json`, `leer.json`.
Niet in git (openbare repo): `keurkamer/data/`, `keurkamer/app/`, AI-porties en -antwoorden, rapporten en Google-cijfers.
Kopie van de app en de AI-oordelen staat op de laptop van Marius.

## Regels van Marius (staan ook in OPDRACHT.md)
Geen Mijn Hummeltje. Christelijk alleen in Christelijk. Drank alleen in Dranken. Kaarsen alleen in Wonen > Kaarsen.
Mix van goedkoop en duur. Geen dubbelen: dezelfde soort producten samenvoegen als keuzes. Bij twijfel: weg.
Dierencadeaus voor liefhebbers mogen bij Dieren. Alles wat zichtbaar is krijgt eerst een voorbeeld en de GO van Marius.
