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
