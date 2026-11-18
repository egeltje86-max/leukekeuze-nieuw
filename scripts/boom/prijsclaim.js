// Geen kortingsbeloftes in vaste teksten (18-11-2026, gevonden door Marius).
// Aanleiding: in de gids 'Cadeau voor je vader' stond bij de G-Shock 'Nu 30% korting', terwijl de kaart €99 naar €93 liet zien (ongeveer 6%).
// Een korting of oude prijs in een tekst klopt na een paar dagen niet meer. Korting tonen we alleen via een echte van-prijs
// (die rekent de site zelf uit en die verdwijnt als de prijs ouder is dan 7 dagen). Daarom haalt de bouw elke zin met zo'n belofte
// uit 'waarom' (en dus ook uit 'kort'). Gebruikt in plaats.js; de controle prijsclaim.js kijkt of er nog iets over is.
const CLAIM = [
  /\d+\s?%\s*(korting|goedkoper|lager|off)\b/i,                                              // 'Nu 30% korting', '40% goedkoper'
  /\b(flinke|mooie|forse|grote|hoge|extra|tijdelijke?)\s+korting/i,                          // 'Flinke korting'
  /\b(nu|tijdelijk|even)\b[^.!?]{0,40}\b(korting|goedkoper|afgeprijsd|in de aanbieding|voordeliger)\b/i, // 'nu een stuk goedkoper'
  /\b(bijna|ruim|zo'?n|ongeveer|meer dan)\s+(de\s+)?(helft|\d+\s?%)\s+(korting|goedkoper)/i,  // 'Ruim de helft goedkoper'
  /\b(in de aanbieding|afgeprijsd|halve prijs|voor de helft van de prijs|actieprijs|prijs verlaagd|in prijs verlaagd|laagste prijs ooit|scherpe? prijs|nu met korting)\b/i,
  /\b(was|van)\s*(€|eur)\s?\d[\d.,]*[^.!?]{0,25}\b(naar|nu|voor)\s+(rond de\s+|ongeveer\s+|maar\s+|slechts\s+)?(€|eur)\s?\d/i, // 'Van €30 naar €18', 'Was €45, nu €20'
  /\bgoedkoper dan\b/i,                                                                      // 'goedkoper dan de adviesprijs / dan elders / dan Dyson'
  /\bkorting\b/i,
];
function zinnen(t) { return String(t).split(/(?<=[.!?])\s+(?=[A-ZÀ-Ý0-9'‘"(])/); }
function isClaim(z) { return CLAIM.some((r) => r.test(z)); }
function heeftClaim(t) { return !!t && zinnen(t).some(isClaim); }
/* Haalt de zinnen met een belofte weg. Blijft er niets over, dan de tekst leeg (de pagina toont dan geen 'waarom'): schrijf in dat geval
   een nieuwe tekst in correcties.json -> tekst. */
function zonderClaim(t) {
  if (!t || typeof t !== 'string') return t;
  const z = zinnen(t); const over = z.filter((s) => !isClaim(s));
  return over.length === z.length ? t : over.join(' ').trim();
}
module.exports = { CLAIM, isClaim, heeftClaim, zonderClaim, zinnen };
