/* MINDER PRODUCTPAGINA'S IN GOOGLE (15-11-2026, GO Marius).
   Op 5 en 6 november kwamen er in twee dagen ruim 4.000 productpagina's bij; de dag erna zakten alle productpagina's in Google
   (van 100-370 vertoningen per dag naar 5-20). Google ziet dan een site die in een paar dagen verdubbelt met pagina's die vooral
   doorsturen. Daarom tonen we Google alleen de productpagina's waar we echt achter staan; de rest blijft op de site voor bezoekers,
   maar krijgt 'noindex, follow' en staat niet in de sitemap.

   Voor Google blijven:
   - de eerste 36 van elke vaste top (LK_TOPVAST in topkeuze.js: met de hand gekozen);
   - cadeaus die in app.js of data.js genoemd worden (gidsen, favorieten, homepage, topwinkels, reels);
   - producten met het vinkje 'favoriet';
   - keuzes van Marius uit de Superkeurkamer (herkomst 'superkeurkamer' in producten.js);
   - producten waar al bezoek op kwam (scripts/seo/google-houden.json);
   - producten waar een ander product naar doorstuurt (samengevoegd), zodat een oud adres nooit op een noindex-pagina uitkomt.
   Uitverkochte producten houden hun eigen regel (niet in de sitemap, wel te vinden).
   Komt een product later in een top, of kiest Marius het, dan staat het bij de volgende bouw vanzelf weer voor Google klaar.
   Alles weer voor Google: LK_ALLE_PRODUCTEN_GOOGLE=1 node scripts/maak-paginas.js, of AAN hieronder op false. */
const fs = require('fs'), path = require('path');
const AAN = true;
const NIEUW_VANAF = '2026-11-19'; /* GOOGLE-HERSTEL: vanaf deze datum eerst beoordelen, dan pas Google */

function googleProducten(ROOT, producten) {
  if (!AAN || process.env.LK_ALLE_PRODUCTEN_GOOGLE === '1') return null; /* null = alles mag */
  const goed = new Set(producten.filter(p => p.status === 'goedgekeurd').map(p => p.id));
  const houd = new Set();
  const zet = id => { if (goed.has(id)) houd.add(id); };
  /* vaste toppen: eerste 36 */
  const win = { dispatchEvent() {} };
  try { new Function('window', fs.readFileSync(path.join(ROOT, 'assets/js/topkeuze.js'), 'utf8'))(win); } catch (e) { console.error('google-producten: topkeuze.js niet gelezen:', e.message); return null; }
  for (const k of Object.keys(win.LK_TOPVAST || {})) (win.LK_TOPVAST[k] || []).slice(0, 36).forEach(zet);
  /* gidsen, favorieten, homepage */
  for (const f of ['assets/js/app.js', 'assets/js/data.js']) {
    const s = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const m of s.matchAll(/['"]([a-z0-9][a-z0-9-]{3,40})['"]/g)) zet(m[1]);
  }
  producten.forEach(p => { if (p.favoriet) zet(p.id); if (p.samengevoegd) zet(p.samengevoegd); });
  /* Superkeurkamer-keuzes van Marius */
  const src = fs.readFileSync(path.join(ROOT, 'assets/js/producten.js'), 'utf8');
  for (const m of src.matchAll(/"id":\s*"([^"]+)"[^}]*?"herkomst":\s*"superkeurkamer"/g)) zet(m[1]);
  /* al bezoek gehad */
  try { JSON.parse(fs.readFileSync(path.join(__dirname, 'google-houden.json'), 'utf8')).ids.forEach(zet); } catch (e) { console.error('google-producten: google-houden.json niet gelezen:', e.message); }
  /* GOOGLE-HERSTEL (19-11-2026, opdracht Marius): nieuwe productpagina's gaan standaard NIET naar Google tot ze beoordeeld zijn.
     Een product met 'sinds' op of na NIEUW_VANAF komt pas in Google als zijn id in google-beoordeeld.json staat
     (eigen tekst en advies, productgegevens nagekeken). Zo kan er nooit meer ongemerkt een grote reeks productpagina's tegelijk naar Google. */
  let beoordeeld = new Set();
  try { beoordeeld = new Set(JSON.parse(fs.readFileSync(path.join(__dirname, 'google-beoordeeld.json'), 'utf8')).ids); } catch (e) { console.error('google-producten: google-beoordeeld.json niet gelezen:', e.message); }
  let wacht = 0;
  producten.forEach(p => { if (p.sinds && p.sinds >= NIEUW_VANAF && houd.has(p.id) && !beoordeeld.has(p.id)) { houd.delete(p.id); wacht++; } });
  if (wacht) console.log('google-producten: ' + wacht + ' nieuwe productpagina\'s wachten op beoordeling (niet in Google)');
  /* veiligheidsslot: valt het ineens veel lager uit dan verwacht (kapot bestand), dan liever alles laten staan */
  if (houd.size < 1500) { console.error('google-producten: maar ' + houd.size + ' producten, dat klopt niet; alles blijft voor Google.'); return null; }
  return houd;
}
module.exports = { googleProducten };
