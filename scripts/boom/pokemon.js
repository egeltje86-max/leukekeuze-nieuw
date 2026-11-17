/* POKÉMON-HOEK (17-11-2026, wens Marius: 'ik wil een aparte Pokémon-hoek, gesorteerd').
   De groep /c/spellen-puzzels/pokemon-verzamelkaarten (Pokémon) heeft een vakje per soort (zie het blok POKÉMON-HOEK in data.js).
   Een Pokémon-product dat in een ander vakje staat (Knuffels, Mokken, LEGO, Games ...) blijft daar staan, maar krijgt bij het bouwen
   het veld p2 = het vakje in de Pokémon-hoek waar het óók bij hoort. hoortBij() in gedeeld.js en de pagina 'Zoek een product' tellen p2 mee.
   Zo zie je alle Pokémon-spullen in de hoek, en blijft bijvoorbeeld een Pikachu-knuffel ook gewoon bij de knuffels staan. */
const GROEP = 'spellen-puzzels/pokemon-verzamelkaarten';
const IS = /pok[eé]mon|pikachu/i;
/* vakje (4.0) waar het product nu staat -> vakje in de Pokémon-hoek */
const VAK = {
  knuffels: 'knuffels', squishmallows: 'knuffels',
  'actiefiguren-superhelden': 'figuren', 'fidgets-tollen': 'figuren', lego: 'figuren', 'andere-bouwstenen': 'figuren',
  'mokken-theeglazen': 'mokken-keuken', 'drinkflessen-lunchboxen': 'mokken-keuken',
  games: 'games', 'controllers-accessoires': 'games', consoles: 'games', 'gaming-headsets': 'games',
  rugzakken: 'tassen', handtassen: 'tassen', portemonnees: 'tassen',
  kersttruien: 'kleding', 't-shirts-met-print': 'kleding', 'riemen-petten': 'kleding', smartwatches: 'kleding', paraplus: 'kleding',
  sfeerlampen: 'kamer', klokken: 'kamer', kussens: 'kamer', 'wanddecoratie-posters': 'kamer',
  '3d-puzzels': 'spellen-school', legpuzzels: 'spellen-school', kinderpuzzels: 'spellen-school', 'bordspellen-voor-het-gezin': 'spellen-school',
  kinderspellen: 'spellen-school', 'tekenen-kleuren': 'spellen-school', kleurboeken: 'spellen-school', leesboeken: 'spellen-school',
  prentenboeken: 'spellen-school', notitieboeken: 'spellen-school', 'muziekspeelgoed-karaoke': 'spellen-school'
};
function tweedePlek(p) {
  if (!p || !p.afd || !IS.test(p.titel || '')) return null;
  if (p.afd + '/' + p.groep === GROEP) return null;
  return VAK[p.vak] || null;
}
module.exports = { GROEP, IS, VAK, tweedePlek };
