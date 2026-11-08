# De automatische piloot (8-11-2026)

Elke dag, zonder dat Marius iets hoeft te doen:

1. **03:30, laptop** (`scripts/nachtelijk.py`, Taakplanner): verse feeds, zoekindex, en een nachtrapport met prijzen en voorraad (`keurkamer/nazorg/wacht-laatste.json`) in de repo.
2. **06:43, cloud** (geplande taak "LeukeKeuze piloot dagelijks"): `python3 scripts/piloot/dag.py`
   - nieuwste code ophalen, nachtrapport toepassen (nazorg.py met veiligheidsgrenzen), bouwen, alle controles (`scripts/controle/alles.js`), en alleen bij "schoon" live zetten.
   - daarna, als de laptop aan staat: maximaal 15 nieuwe producten op basis van trends (`kandidaten.py` → agent kiest en schrijft teksten → `haalfotos.py` op de laptop → `voegtoe.py` → nog een bouw + controle + live).
   - regel in `PILOOT-LOGBOEK.md`; Marius krijgt alleen een bericht als er echt iets is.
3. **Maandag 08:10, cloud** (geplande taak "LeukeKeuze weekoverzicht"): 5 regels voor Marius (bezoekers per bron, kliks, beste pagina's, wat de piloot deed, 1 reclametip).

Handmatig draaien: `python3 scripts/piloot/dag.py [--niet-pushen] [--alleen-controle]`.
Controles los: `node scripts/controle/alles.js . keurkamer/data` (budget, leeftijd, links, doelgroep, en de gewone controle).
