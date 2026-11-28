/* llms.txt per seizoen (28-11-2026). De bron staat in scripts/seo/llms-bron.txt. Regels die beginnen met
   '[tot MM-DD] ', '[vanaf MM-DD] ' of '[vanaf MM-DD tot MM-DD] ' komen alleen in llms.txt in die periode (Nederlandse datum).
   Zo verdwijnen Black Friday en pakjesavond vanzelf en verschijnt kerst, ook zonder dat iemand iets hoeft te doen:
   de dagelijkse bouw (maak-paginas.js, ook de piloot op GitHub) draait dit script.
   De datum 'bijgewerkt op' verandert alleen als de inhoud echt verandert. Wijzig llms.txt dus niet met de hand maar de bron. */
const fs = require('fs'), path = require('path');
const R = path.join(__dirname, '..', '..');
const bron = path.join(__dirname, 'llms-bron.txt'), doel = path.join(R, 'llms.txt');
const nu = process.env.LK_DATUM ? new Date(process.env.LK_DATUM + 'T12:00:00') : new Date();
const md = new Intl.DateTimeFormat('nl-NL', { timeZone: 'Europe/Amsterdam', month: '2-digit', day: '2-digit' }).formatToParts(nu)
  .reduce((o, p) => (o[p.type] = p.value, o), {});
const vandaag = md.month + '-' + md.day;
const MAAND = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'];
const nlDatum = new Intl.DateTimeFormat('nl-NL', { timeZone: 'Europe/Amsterdam', day: 'numeric', month: 'numeric', year: 'numeric' }).formatToParts(nu)
  .reduce((o, p) => (o[p.type] = p.value, o), {});
const datumTekst = nlDatum.day + ' ' + MAAND[+nlDatum.month - 1] + ' ' + nlDatum.year;
const RE = /^\[(?:vanaf (\d\d-\d\d))?\s*(?:tot (\d\d-\d\d))?\] /;
const uit = fs.readFileSync(bron, 'utf8').split('\n').filter(r => {
  const m = r.match(RE); if (!m) return true;
  return (!m[1] || vandaag >= m[1]) && (!m[2] || vandaag <= m[2]);
}).map(r => r.replace(RE, '')).join('\n');
const DATUM = /Dit bestand is bijgewerkt op [^.]+\./;
const oud = fs.existsSync(doel) ? fs.readFileSync(doel, 'utf8') : '';
const zonder = s => s.replace(DATUM, '');
if (zonder(oud) !== zonder(uit)) {
  fs.writeFileSync(doel, uit.replace(DATUM, 'Dit bestand is bijgewerkt op ' + datumTekst + '.'));
  console.log('llms.txt bijgewerkt voor ' + vandaag);
} else console.log('llms.txt: niets veranderd (' + vandaag + ')');
