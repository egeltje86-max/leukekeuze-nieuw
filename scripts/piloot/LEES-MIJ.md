# De automatische piloot (8-11-2026)

Elke dag, zonder dat Marius iets hoeft te doen:

1. **09:00, laptop: de ochtendrun** (sinds 21-11-2026, op verzoek van Marius: 's ochtends wordt er nog weinig gekocht; was 21:00, daarvoor 03:30; bij een gemiste beurt draait de taak zodra de laptop weer aan gaat; tijdslimiet 3 uur) (`scripts/nachtelijk.py`, Taakplanner-taak 'LeukeKeuze zoekindex'):
   - bol-feeds verversen (`Documents\LeukeKeuze-Bol\VERNIEUW-BOL-FEEDS.cmd`, alleen als ze ouder zijn dan 20 uur; het script leest zelf de inloggegevens, wij lezen het niet);
   - feeds van Daisycon, TradeTracker en Awin, zoekindex;
   - prijs en voorraad van alle producten op de site (`scripts/keurkamer/wacht.py`): bol op het productnummer in de link, de partnerfeeds, en de feeds van de Superkeurkamer (om 05:10 ververst) voor winkels die niet in de ochtendrun zitten;
   - de gewone winkelpagina van wat in geen feed staat (`winkelcheck.py`, elke dag);
   - het rapport (`keurkamer/nazorg/wacht-laatste.json`) in de repo.
   - De linktest (partnerlinks naklikken) staat uit sinds 21-11-2026 (`LINKTEST = False`).
2. **10:17, cloud** (geplande taak "LeukeKeuze piloot dagelijks", tweede beurt 13:17 met `--inhaal`): `python3 scripts/piloot/dag.py`
   - nieuwste code ophalen, ochtendrapport toepassen (nazorg.py met veiligheidsgrenzen), bouwen, alle controles (`scripts/controle/alles.js`), en alleen bij "schoon" live zetten.
   - nazorg (sinds 21-11-2026): bol-producten die niet meer in de complete, verse bol-feeds staan gaan op uitverkocht (hooguit 4% per dag); alles wat de controle zelf op uitverkocht zet staat in `scripts/keurkamer/auto-uitverkocht.json` en komt vanzelf terug zodra een feed het weer leverbaar heeft. Wat met de hand op uitverkocht of afgekeurd staat, komt nooit vanzelf terug.
   - welk rapport al is toegepast: `keurkamer/nazorg/toegepast.json`. De inhaalrun doet alleen iets als er een nieuw rapport van vandaag is (laptop stond om 09:00 uit).
   - nieuwe producten: niet tijdens het Google-herstel (paragraaf 54 van CLAUDE.md).
   - regel in `PILOOT-LOGBOEK.md`; Marius krijgt alleen een bericht als er echt iets is.
3. **Maandag 08:10, cloud** (geplande taak "LeukeKeuze weekoverzicht"): 5 regels voor Marius (bezoekers per bron, kliks, beste pagina's, wat de piloot deed, 1 reclametip).

Handmatig draaien: `python3 scripts/piloot/dag.py [--niet-pushen] [--alleen-controle] [--inhaal]`.
Controles los: `node scripts/controle/alles.js . keurkamer/data` (budget, leeftijd, links, doelgroep, en de gewone controle).
