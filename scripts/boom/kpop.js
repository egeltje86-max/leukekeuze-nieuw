/* KPOP DEMON HUNTERS-HOEK (17-11-2026, Marius: 'ga verder met de volgende, dezelfde wijze').
   De groep /c/speelgoed/kpop-demon-hunters heeft een vakje per soort (blok KPOP DEMON HUNTERS-HOEK in data.js).
   Een KPop-product in een ander vakje (Squishmallows, LEGO, UNO, Mokken ...) blijft daar staan en krijgt bij het bouwen
   het veld p4 = het vakje in de hoek waar het óók bij hoort (zelfde werkwijze als p2 Pokémon en p3 Hello Kitty).
   Let op: 'derpy' en 'sussie' alleen als heel woord (anders telt 'kinderpyjama' mee). */
const GROEP = 'speelgoed/kpop-demon-hunters';
const IS = /k-?pop demon|demon hunters|huntr\/?x|huntrix|saja boys?|\bderpy\b|\bsussie\b/i;
const VAK = {
  modepoppen: 'poppen-figuren', 'actiefiguren-superhelden': 'poppen-figuren',
  squishmallows: 'speelgoed', knuffels: 'speelgoed', lego: 'speelgoed', 'kaart-dobbelspellen': 'speelgoed', 'bordspellen-voor-het-gezin': 'speelgoed',
  kinderpuzzels: 'speelgoed', legpuzzels: 'speelgoed',
  rugzakken: 'tassen', handtassen: 'tassen', sleutelhangers: 'tassen',
  knutselsets: 'school-knutselen', 'tekenen-kleuren': 'school-knutselen', kleurboeken: 'school-knutselen', 'invulboeken-dagboeken': 'school-knutselen', notitieboeken: 'school-knutselen',
  'mokken-theeglazen': 'keuken', 'drinkflessen-lunchboxen': 'keuken',
  vinyl: 'kamer', 'cd-s': 'kamer', 'wanddecoratie-posters': 'kamer', sfeerlampen: 'kamer',
  't-shirts-met-print': 'kleding'
};
function vierdePlek(p) {
  if (!p || !p.afd || !IS.test(p.titel || '')) return null;
  if (p.afd + '/' + p.groep === GROEP) return null;
  return VAK[p.vak] || null;
}
module.exports = { GROEP, IS, VAK, vierdePlek };
