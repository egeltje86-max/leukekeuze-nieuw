/* ONE PIECE & ANIME-HOEK (17-11-2026). De groep /c/speelgoed/one-piece-anime heeft een vakje per serie (blok in data.js).
   Een anime-product in een ander vakje (lampen, mokken, manga, LEGO, games ...) blijft daar staan en krijgt bij het bouwen het veld
   p5 = het vakje van zijn serie in de hoek (zelfde werkwijze als p2 Pokémon, p3 Hello Kitty en p4 KPop Demon Hunters).
   Hier telt de serie in de titel, niet het vakje waar het product staat. 'luffy' en 'zoro' alleen als heel woord (anders telt 'fluffy' mee). */
const GROEP = 'speelgoed/one-piece-anime';
const SERIE = [
  ['one-piece', /one piece|\bluffy\b|\bzoro\b|strohoed van luffy/i],
  ['naruto', /naruto|akatsuki/i],
  ['dragon-ball', /dragon ?ball|\bgoku\b/i],
  ['demon-slayer', /demon slayer|kimetsu/i],
  ['jujutsu-kaisen', /jujutsu kaisen/i],
  ['ghibli', /ghibli|totoro/i],
  ['andere-anime', /spy ?x ?family|chainsaw man|attack on titan|my hero academia/i]
];
function vijfdePlek(p) {
  if (!p || !p.afd || p.afd + '/' + p.groep === GROEP) return null;
  const t = p.titel || '';
  if (/pok[eé]mon|pikachu/i.test(t)) return null;
  for (const [vak, re] of SERIE) if (re.test(t)) return vak;
  return null;
}
module.exports = { GROEP, SERIE, vijfdePlek };
