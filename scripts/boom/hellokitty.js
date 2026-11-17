/* HELLO KITTY-HOEK (17-11-2026, wens Marius: 'maak net zo'n leuke hoek als Pokémon ervan').
   De groep /c/speelgoed/hello-kitty (Hello Kitty & vriendjes) heeft een vakje per soort (zie het blok HELLO KITTY-HOEK in data.js).
   Een Hello Kitty-product dat in een ander vakje staat (Squishmallows, Paraplu's, Sfeerlampen, Games ...) blijft daar staan, maar krijgt
   bij het bouwen het veld p3 = het vakje in de Hello Kitty-hoek waar het óók bij hoort. hoortBij() in gedeeld.js en de pagina
   'Zoek een product' tellen p3 mee. Zelfde werkwijze als p2 bij de Pokémon-hoek (scripts/boom/pokemon.js). */
const GROEP = 'speelgoed/hello-kitty';
const IS = /hello ?kitty|kuromi|cinnamoroll|my melody|pompompurin|sanrio|pochacco|keroppi|badtz|chococat/i;
/* vakje (4.0) waar het product nu staat -> vakje in de Hello Kitty-hoek */
const VAK = {
  knuffels: 'knuffels', squishmallows: 'knuffels',
  'actiefiguren-superhelden': 'figuren', modepoppen: 'figuren', 'fidgets-tollen': 'figuren',
  rugzakken: 'tassen', handtassen: 'tassen', portemonnees: 'tassen', sleutelhangers: 'tassen',
  'mokken-theeglazen': 'keuken', 'drinkflessen-lunchboxen': 'keuken',
  sfeerlampen: 'kamer', klokken: 'kamer', kussens: 'kamer', 'wanddecoratie-posters': 'kamer', spaarpotten: 'kamer',
  games: 'games-spellen', 'controllers-accessoires': 'kamer', kinderpuzzels: 'games-spellen', legpuzzels: 'games-spellen', 'bordspellen-voor-het-gezin': 'games-spellen',
  knutselsets: 'school-knutselen', 'tekenen-kleuren': 'school-knutselen', kleurboeken: 'school-knutselen', notitieboeken: 'school-knutselen',
  paraplus: 'kleding', 'pyjama-s-badjassen': 'kleding', 't-shirts-met-print': 'kleding',
  damesparfum: 'beauty', kinderparfum: 'beauty'
};
function derdePlek(p) {
  if (!p || !p.afd || !IS.test(p.titel || '')) return null;
  if (/pok[eé]mon|pikachu/i.test(p.titel || '')) return null;
  if (p.afd + '/' + p.groep === GROEP) return null;
  return VAK[p.vak] || null;
}
module.exports = { GROEP, IS, VAK, derdePlek };
