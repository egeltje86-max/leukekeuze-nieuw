// Doelgroepcontrole (8-11-2026, Fable P1-8): past een product bij het 'voor wie'-label dat het draagt?
// Alcohol bij kinderen of tieners, babyspul bij tieners, herenspul bij 'voor haar', enz.
// Gebruik: node scripts/controle/doelgroep.js <repo> [rapport.json]   -> exit 1 bij fouten.
const fs = require('fs'), path = require('path');
const R = path.resolve(process.argv[2] || '.'); const UIT = process.argv[3];
global.window = { dispatchEvent() {} }; global.Event = function () {};
require(path.join(R, 'assets/js/producten-lean.js'));
const P = window.LK_PRODUCTEN.filter(p => p.status === 'goedgekeurd');
const ALC = /\b(wijn|wine|bier|whisky|whiskey|gin|rum|wodka|vodka|likeur|liqueur|champagne|prosecco|cava|port|cognac|tequila|jenever|amaretto|baileys|aperol|limoncello|sake|cider|spritz|brandy|calvados|drankspel|shotglas|shotglaasjes)\b|wijnglas|bierglas|cocktail/i;
const ALCOK = /alcoholvrij|0[,.]0|kinderchampagne|mocktail|chocolade|thee|koffie|kaars|boek|puzzel|sokken|\bmok\b|shirt|zeep|bad|kookboek|geur|siroop|limonade/i;
const isAlc = p => ALC.test(p.titel) && !ALCOK.test(p.titel) && !/^(speelgoed|boeken-media)$/.test(p.afd) || /^eten-drinken\/(wijn|bier|sterke-drank|bubbels)$/.test(p.afd + '/' + p.groep);
const REGELS = {
  kind: [[isAlc, 'alcohol bij kinderen'], [p => /\b(dames|heren|vrouwen|mannen|lingerie|\bbh\b|scheer|baard|eau de (parfum|toilette)|aftershave|tabak|sigaar|18\+)/i.test(p.titel), 'volwassen bij kinderen']],
  tiener: [[isAlc, 'alcohol bij tieners'], [p => /\b(baby|peuter|dreumes|duplo|rammelaar|bijtring|kraam|knuffeldoekje|speen)\b/i.test(p.titel) || (p.leeftijd && p.leeftijd[1] <= 5), 'te jong voor tieners']],
  baby: [[p => /\b(wijn|bier|parfum|game|playstation|switch|darts?)\b/i.test(p.titel) || isAlc(p), 'niet voor baby']],
  haar: [[p => /\b(heren|mannen|voor hem|baard|scheerapparaat|trimmer|aftershave|herenparfum|for men|pour homme|boxershort)\b/i.test(p.titel) && !/dames|unisex/i.test(p.titel), 'herenproduct bij voor haar']].map(x => [p => x[0](p) && !/venus|gillette venus/i.test(p.titel), x[1]]),
  hem: [[p => /\b(dames|vrouwen|voor haar|make-up|nagellak|lipstick|mascara|\bbh\b|for women|pour femme|damesparfum)\b/i.test(p.titel) && !/heren|unisex/i.test(p.titel), 'damesproduct bij voor hem']],
  'opa-oma': [[p => /\b(rammelaar|bijtring|fortnite|roblox)\b/i.test(p.titel), 'past niet bij opa en oma']]
};
const fouten = [];
for (const p of P) for (const v of (p.voor || [])) for (const [test, wat] of (REGELS[v] || [])) if (test(p)) fouten.push({ label: v, wat, id: p.id, titel: p.titel, vak: p.afd + '/' + p.vak });
const rap = { datum: new Date().toISOString().slice(0, 10), fouten: fouten.length, lijst: fouten };
if (UIT) fs.writeFileSync(UIT, JSON.stringify(rap, null, 1));
const per = {}; fouten.forEach(f => { per[f.wat] = (per[f.wat] || 0) + 1; });
console.log('doelgroep: fouten', fouten.length, JSON.stringify(per));
fouten.slice(0, 60).forEach(f => console.log(' ', f.wat, '|', f.id, '|', f.titel.slice(0, 60), '|', f.vak));
process.exit(fouten.length ? 1 : 0);
