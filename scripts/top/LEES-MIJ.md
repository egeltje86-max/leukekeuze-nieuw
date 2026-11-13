# Vaste top per pagina (10-11-2026, opdracht Marius: de eerste indruk moet kloppen)

De bovenkant van de belangrijkste pagina's is met de hand nagekeken en vastgezet. Die staat in
`assets/js/topkeuze.js` als `window.LK_TOPVAST` en wordt gemaakt uit `picks.json` in deze map.
`app.js` (functie `bovenaan`) laat die top precies zo staan; alleen wat eronder staat wordt nog geschud.

Zo werk je een pagina bij (kost weinig):
1. `node scripts/top/kand.js /voor/hem 80` – toont genummerde kandidaten (K = stond al in de oude top, A = apart cadeau, F = favoriet, % = korting).
2. Lees de titels zelf. Kies alleen cadeaus die zeker bij de pagina passen, mooi en leuk genoeg zijn, en zet ze in deze volgorde, steeds opnieuw:
   verrassing, bekend merk, goedkope "ja", duurder pronkstuk, persoonlijk of grappig, topper/korting. Geen twee dezelfde soort naast elkaar,
   geen roze foto's op mannenpagina's, geen schoenen/kleding met maat bovenaan, geen tekstcadeaus voor één soort persoon.
3. `node scripts/top/pick.js /voor/hem 3,25,44,...` – bewaart de keuze in `picks.json`.
4. `node scripts/top/pasToe.js` – zet alles in `topkeuze.js`. Daarna bouwen + controleren, dan pas pushen.

Paden: `/voor/<persoon>[/<onderwerp>]`, `/gelegenheid/<naam>`, `/collectie/<naam>`, `/c/<afdeling>[/<groep>[/<vak>]]`, `/c/cadeaus/<oud vakje>`.

`node scripts/top/afleid.js` maakt de vaste top voor pagina's als "Verjaardag voor hem" en "Grappige cadeaus voor haar" (lijst in `gsubs.txt`):
alleen uit cadeaus die al met de hand zijn nagekeken voor die gelegenheid én voor die persoon. Draai hem opnieuw nadat je een Voor wie-pagina of gelegenheid hebt bijgewerkt.
De 313 losse vakjes (bijv. Dartpijlen) hebben geen vaste top; die zijn op 10-11-2026 wel allemaal nagelezen (eerste 7 producten).
Uitzondering (11-11-2026): het vakje Hondenspeelgoed heeft wel een vaste top, omdat er ook verwensets en een fotoalbum in zitten en die bovenaan stonden; nu staat echt speelgoed eerst.

Uitzondering (11-11-2026): 'Grappige cadeaus voor kinderen' en '... voor tieners' staan niet meer in `gsubs.txt`. Hun top is met de hand gekozen (opdracht Marius: meer grappige cadeaus voor kinderen en tieners), dus `afleid.js` blijft ervan af.
Ook 'Grappige cadeaus voor hem', '... voor haar' en '... voor collega' staan sinds 11-11-2026 niet meer in `gsubs.txt`: daar zijn met de hand nieuwe grappige cadeaus tussengevoegd.

13-11-2026 (Marius: 'elke tegel van een gelegenheid apart uitzoeken, niet universeel'): alle 32 pagina's 'gelegenheid x persoon'
(Verjaardag voor hem, Bedankt voor collega, Beterschap voor opa en oma …) zijn met de hand gekozen en staan niet meer in `gsubs.txt`.
Ook 'Kerst voor hem/haar/tieners/collega/opa en oma' en 'Sinterklaas voor hem/haar' hebben een eigen top: sleutel `/c/cadeaus/kerst?voor=hem`
(app.js gebruikt die als hij bestaat). Een product dat in een top hoort maar niet op de pagina staat: `correcties.json` → `ookInErbij`
(bijv. `cadeaus/kerst`, `valentijn/voor-haar`) of `voorErbij` (persoon). Een cadeau met een tekst voor één moment (juf, trouw, pensioen,
geslaagd) mag op zijn eigen gelegenheid ook per persoon staan (app.js `voorFilter`, kand.js).
