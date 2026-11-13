# Keuring: hulpjes om de hele site na te kijken (grote keuring van 13-11-2026)

Alles draait tegen een lokale server en houdt elk verzoek buiten localhost tegen. Er wordt dus nooit op een partnerlink geklikt
en er komt geen telling in GoatCounter. Start eerst de server(s):

    node scripts/controle/keuring/server.js /home/claude/leukekeuze-nieuw 8765     # de werkmap (nieuw)
    node scripts/controle/keuring/server.js /home/claude/lk-kopie 8767             # een kopie van wat live staat (oud)

Een kopie van live maak je vóór je iets verandert: `cp -r` van de werkmap zonder `.git`, `images/` en `p/` (die twee als symlink).
Gebruik `NODE_PATH=$(npm root -g)` als playwright niet gevonden wordt. Draai zware proeven niet tegelijk met een bouw.

| Hulpje | Wat het doet |
|---|---|
| `gelijk3.js <paden> <breedte> <a of b> [wacht-ms]` | Tekent elke pagina met de oude code (8767) en de nieuwe (8765) en vergelijkt de hele inhoud. Moet 0 verschillen geven na een wijziging die niets aan de producten mag veranderen. `NORM=utm` haalt utm_source uit links. |
| `morphtest.js <paden> <breedte> [parallel]` | Laadt elke pagina vers, één keer met morph en één keer met alles opnieuw tekenen, en vergelijkt. `WZ=b` voor de nieuwe opzet van de proef WIJZER. |
| `flits.js <pad>` | Vergelijkt de pagina op drie momenten (alleen HTML, app.js binnen, app gestart): staat hij meteen goed en verspringt er niets? |
| `snel.js <poort> <pad...>` | Meet zoals een trage telefoon (1,6 Mbit/s, processor 4x trager): eerste beeld, grootste beeld, verspringen, knoppen werken. `NET=gewoon` = gewone 4G. `snelmed.js <N> <pad...>` neemt de middelste van N metingen, oud en nieuw om en om. |
| `sprong.js` | Springt de pagina terug naar boven als de app start terwijl je al gescrold had? |
| `voorstart.js <pad>` | Welke knoppen werken al voordat de productlijst binnen is? |
| `flow.js`, `flow2.js` | Verlanglijstje, terugknop, sorteren, filteren, meer tonen, verras me, zoeken met tips en typfout, kieshulp, rijmmachine. |
| `tik.js <breedte> <uit.jsonl> <pad...>` | Tikt op een pagina elke soort knop en link één keer aan en schrijft op wat er gebeurt (duurt lang: ongeveer 4 minuten per pagina). |
| `kruip.js <paden> <breedte> <uit.jsonl> [parallel]` | Loopt een lijst pagina's langs: fouten in de console, kapotte plaatjes en links, tekst buiten het kader, dubbele producten, de eerste 12 cadeaus. Productpagina's met parallel 2. |
| `profiel.js <pad>` | Waar gaat de rekentijd heen bij het starten van een pagina? |
| `beelden.js <poort> <pad>` | Welke plaatjes haalt een pagina op voor de app start? |
| `toplijst.js <uit.json> <pad...>` en `vel.py` | De eerste cadeaus van een pagina in de volgorde van de bezoeker, en een contactvel met foto's om ze te bekijken (`MEER=3` = 144 stuks). |

Padenlijsten: `lijst-paden.txt` (698 lijstpagina's), `p-paden.txt` (200 productpagina's), `b-paden.txt` (homepage en Voor wie, voor de proef WIJZER),
`var-paden.txt` (filters en sorteren), `zoek-paden.txt` (de 461 zoekwoorden), `vonk-paden.txt`. Maak ze opnieuw als de indeling verandert.
