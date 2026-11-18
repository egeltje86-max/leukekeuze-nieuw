# NOVA REBEL – voorbeeld (18-11-2026)

Nova leverde 'NOVA REBEL – DUTCH OVERDRIVE, deel 1': acht icoontjes voor Voor wie (zwart, knalgeel, rood-wit-blauwe streep).
Marius vroeg: 'hoe ziet de site eruit als je de kleuren meeneemt, alleen het uiterlijk, maak een voorbeeld'.

- `rebel.css`: alleen uiterlijk, alles hangt aan `html.rebel`. Zonder die klasse verandert er niets.
- `rond/`: de acht icoontjes van Nova rond uitgesneden (384 en 240 px), zelfde namen als `images/sub/rond/voor-*`.
- `shoot2.js`: maakt schermafbeeldingen op 390 px met de stijl erin geplakt (lokale server op poort 8765).
  `NODE_PATH=$(npm root -g) node scripts/rebel/shoot2.js rb scripts/rebel/rebel.css 2`

Niets hiervan staat live. Pas na GO van Marius: eerst een testlink (`?proef=rebel`, alleen voor wie de link opent),
dan voor iedereen. Let op paragraaf 8 van CLAUDE.md (huisstijl): die verandert dan mee.
