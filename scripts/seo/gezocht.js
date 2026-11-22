/* MEEST GEZOCHT BOVENAAN (21-11-2026, opdracht Marius: 'zoek per subcategorie de 3 meest gezochte producten en zet die bovenaan';
   'ga voor cadeaus die mensen echt zoeken via Google, omdat wij iets van Ditverzinjeniet verkochten betekent niet dat iedereen daarop zit te wachten').

   Per groep en per vakje (/c/<afdeling>/<groep> en /c/<afdeling>/<groep>/<vakje>) kiest dit script de cadeaus waar in Nederland het meest
   op gezocht wordt in Google. Bron: het zoekvolume per maand (Google Ads-gegevens via OpenSEO/DataForSEO, opgehaald 21-11-2026) van
   - het merk of de productlijn ('jellycat', 'hitster', 'sol de janeiro', 'lego technic'),
   - merk + het eerste woord van het product ('apple watch', 'garmin forerunner', 'dyson airwrap'),
   - een figuur + soort product ('pokemon knuffel', 'minecraft lamp', 'harry potter puzzel').
   Het volume zelf staat NIET in git (keurkamer/data/zoekvolume.json); in git staan alleen de gekozen ids (LK_GEZOCHT in topkeuze.js).

   Regels:
   - een los merk telt half (een merk zegt minder dan merk + product), een figuur of serie alleen ('harry potter', 'minecraft') voor een
     tiende, en niet als het product ook een eigen 'figuur + soort'-zoekwoord heeft; woorden die ook iets anders betekenen ('valencia',
     'zilveren kruis', 'happy birthday') tellen niet (W hieronder);
   - een zoekwoord dat bijna alle producten op een pagina delen ('dartbord' bij Dartborden) zegt daar niets en telt daar niet;
   - hooguit 5 per pagina (de site toont de eerste 3 die op de pagina staan), elk met een ander zoekwoord, een ander merk en een andere serie;
   - minstens 100 zoekopdrachten per maand (na de weging), anders blijft de pagina zoals hij was;
   - niet: La Redoute, wenskaarten van een paar euro, grove grappen, wat niet goedgekeurd is of geen prijs heeft;
   - bij hetzelfde zoekwoord wint het cadeau dat al hoger in de handgekozen top van die pagina staat, dan een winkel die geen bol is.
   app.js (gezochtEerst in sorteer) zet ze vóór de vaste top; de vaste top zelf (picks.json) en de producten voor Google veranderen niet.
   Gebruik: node scripts/seo/gezocht.js [pad naar zoekvolume.json] [--droog]. Uit op de site: window.LK_GEZOCHT_UIT = true. */
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.resolve(__dirname, '../..');
const VOLF = process.argv.find((a, i) => i > 1 && !a.startsWith('--')) || path.join(ROOT, 'keurkamer/data/zoekvolume.json');
const DROOG = process.argv.includes('--droog');
const VOL = JSON.parse(fs.readFileSync(VOLF, 'utf8'));
VOL['mario kart game'] = VOL['mario kart'];

const ctx = { window: { dispatchEvent() {}, addEventListener() {} }, document: { createEvent() { return { initEvent() {} }; }, addEventListener() {} }, Event: function () {} };
ctx.window.window = ctx.window; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(ROOT, 'assets/js/producten-lean.js'), 'utf8'), ctx);
vm.runInContext(fs.readFileSync(path.join(ROOT, 'assets/js/topkeuze.js'), 'utf8'), ctx);
const ALLE = ctx.window.LK_PRODUCTEN || [];
const TOP = ctx.window.LK_TOPVAST || {};
const GROF_T = /f[u*]ck|\bkut\b|lekker pik|pleur op|sexy as hell|ben je dronken|piemel|borstmok|\bbitch(es)?\b|middelvinger|shit happens|bullshit|\bjoint\b/i;
function isKaartje(p) { return typeof p.prijs === 'number' && p.prijs < 5 && (p.shop === 'Kaartje2go' || /(^|\s)(kaart|kerstkaart|wenskaart|felicitatiekaart|doopkaart|sinterklaaskaart|verjaardagskaart)(\s|$|[:,])/i.test(p.titel || '')); }
const L = ALLE.filter(p => p.status === 'goedgekeurd' && p.prijs > 0 && !p.samengevoegd && p.shop !== 'La Redoute' && !isKaartje(p) && !GROF_T.test(p.titel || '') && !/rebul/i.test((p.titel || '') + ' ' + (p.merk || ''))); /* 22-11-2026 Marius: Atelier Rebul niet meer bovenaan */

function norm(t) { return String(t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[’'"“”™®]/g, '').replace(/[^a-z0-9& ]+/g, ' ').replace(/\s+/g, ' ').trim(); }
const SHOP = new Set(L.map(p => norm(p.shop)));
const merkN = {}; L.forEach(p => { const m = norm(p.merk); if (m) merkN[m] = (merkN[m] || 0) + 1; });

/* figuren en series: alleen (zonder soort product) tellen ze voor een tiende */
const FR = ['harry potter', 'hello kitty', 'kuromi', 'stitch', 'minecraft', 'super mario', 'mario kart', 'mario', 'pokemon', 'pikachu', 'kpop demon hunters', 'one piece', 'naruto', 'dragon ball', 'star wars', 'marvel', 'spider man', 'frozen', 'disney', 'paw patrol', 'bluey', 'peppa pig', 'nijntje', 'sonic', 'fortnite', 'zelda', 'barbie', 'squishmallow', 'jellycat', 'lego', 'playmobil', 'wednesday', 'stranger things', 'grinch', 'toy story', 'batman', 'f1', 'max verstappen', 'ajax', 'feyenoord', 'psv'];
const FRAN = new Set(FR.filter(f => !['squishmallow', 'jellycat', 'lego', 'playmobil', 'barbie'].includes(f)).concat(['studio ghibli', 'demon slayer', 'jujutsu kaisen', 'chainsaw man', 'lilo & stitch', 'disney stitch', 'woezel en pip', 'bumba', 'dikkie dik', 'dolfje weerwolfje', 'pieter konijn', 'mega mindy', 'transformers', 'lucky luke', 'star wars stormtrooper', 'disney princess', 'disney classics', 'disney frozen', 'my melody', 'nickelodeon', 'national geographic']));
const NOUN = ['nachtlampje', 'lampje', 'lamp', 'neonlamp', 'mok', 'beker', 'drinkfles', 'lunchbox', 'knuffel', 'pluche', 'rugzak', 'tas', 'schoudertas', 'portemonnee', 'kussen', 'puzzel', 'deken', 'plaid', 'sloffen', 'pantoffels', 'pyjama', 'badjas', 'onesie', 'poster', 'sleutelhanger', 'spaarpot', 'horloge', 'wekker', 'klok', 'paraplu', 'kersttrui', 'trui', 'hoodie', 'pet', 'muts', 'sokken', 'figuur', 'beeldje', 'spel', 'kaartspel', 'bordspel', 'kerstbal', 'kaars', 'lego', 'adventskalender', 'kostuum', 'pen', 'etui', 'agenda', 'notitieboek', 'speaker', 'koptelefoon', 'controller', 'game'];

/* productlijnen die we zelf op de titel herkennen (volume uit zoekvolume.json onder dezelfde naam) */
const CUR = [
  ['airpods', /\bairpods\b/], ['nee doh', /\bnee ?doh\b|\bneedoh\b/], ['labubu', /\blabubu\b/],
  ['ps5 controller', /\bdualsense\b|\b(ps5|playstation 5) controller\b/, /oplaad|station|lader|hoes|houder|standaard|wekker|lamp|mok\b/], ['stanley cup', /\bstanley\b.*\b(quencher|cup|tumbler|drinkbeker|beker)\b/],
  ['lego technic', /\blego\b.*\btechnic\b/], ['elektrische deken', /\belektrische (deken|onderdeken|bovendeken|plaid|warmtedeken)\b/],
  ['lego bloemen', /\blego\b.*\b(bloem\w*|boeket|rozen|roos|orchidee\w*|bonsai|botanical\w*|succulent\w*|tulp\w*|zonnebloem\w*|kersenbloesem|lavendel|chrysant\w*|pioen\w*)\b/, /hamster|creator 3in1/],
  ['rummikub', /\brummikub\b/], ['monopoly', /\bmonopoly\b/], ['polaroid camera', /\bpolaroid\b.*\b(camera|now|go|flip|i ?2)\b/],
  ['jbl speaker', /\bjbl\b.*\b(speaker|go|flip|charge|clip|boombox|partybox|xtreme|grip)\b/], ['lego friends', /\blego\b.*\bfriends\b/], ['owala', /\bowala\b/],
  ['uno', /^uno\b|\buno (flip|show|kaartspel|no mercy|all wild|minimalista|deluxe|junior|kaarten)\b|\bmattel uno\b/], ['jellycat', /\bjellycat\b/],
  ['lego city', /\blego\b.*\bcity\b/], ['squishmallows', /\bsquishmallow/], ['tamagotchi', /\btamagotchi\b/], ['ticket to ride', /\bticket to ride\b/],
  ['lavalamp', /\blava ?lamp/], ['catan', /\bcatan\b/], ['azul', /\bazul\b/, /clase azul|tequila/], ['instax mini', /\binstax\b.*\bmini\b/], ['instax', /\binstax\b/],
  ['wingspan', /\bwingspan\b/], ['dobble', /\bdobble\b/], ['lego duplo', /\bduplo\b/], ['lego icons', /\blego\b.*\bicons\b/], ['jbl go', /\bjbl go\b/],
  ['hitster', /\bhitster\b/], ['exploding kittens', /\bexploding kittens\b/], ['cards against humanity', /\bcards against humanity\b/], ['stratego', /\bstratego\b/],
  ['rubiks cube', /\brubik/], ['kapla', /\bkapla\b/], ['plus plus', /\bplus[ -]plus\b/], ['connetix', /\bconnetix\b/], ['magna tiles', /\bmagna[ -]?tiles\b/],
  ['smartmax', /\bsmartmax\b/], ['gravitrax', /\bgravitrax\b/], ['furby', /\bfurby\b/], ['little live pets', /\blittle live pets\b/], ['hatchimals', /\bhatchimals\b/],
  ['tiptoi', /\btiptoi\b/], ['beyblade', /\bbeyblade\b/], ['funko pop', /\bfunko\b.*\bpop\b|\bpop!/], ['pokemon tcg', /\bpokemon\b.*\b(booster|elite trainer|tcg|tin|blister|collection)\b/],
  ['crocs', /\bcrocs\b/], ['ugg tasman', /\bugg\b.*\btasman\b/], ['sol de janeiro', /\bsol de janeiro\b/], ['dyson airwrap', /\bairwrap\b/],
  ['lego star wars', /\blego\b.*\bstar wars\b/], ['lego harry potter', /\blego\b.*\bharry potter\b/], ['lego pokemon', /\blego\b.*\bpokemon\b/], ['lego minecraft', /\blego\b.*\bminecraft\b/],
  ['lego f1', /\blego\b.*\b(f1|formule 1|formula 1)\b/], ['lego disney', /\blego\b.*\bdisney\b/], ['lego batman', /\blego\b.*\bbatman\b/], ['lego mario', /\blego\b.*\bmario\b/],
  ['lego one piece', /\blego\b.*\bone piece\b/], ['lego stitch', /\blego\b.*\bstitch\b/], ['lego adventskalender', /\blego\b.*\badventskalender\b/],
  ['sylvanian families', /\bsylvanian\b/], ['hot wheels', /\bhot wheels\b/], ['schleich', /\bschleich\b/], ['nijntje knuffel', /\bnijntje\b.*\bknuffel\b/],
  ['yankee candle', /\byankee candle\b/], ['rituals adventskalender', /\brituals\b.*\badventskalender\b/], ['rituals cadeauset', /\brituals\b.*\b(cadeauset|giftset|geschenkset)\b/],
  ['kobo clara', /\bkobo clara\b/], ['meta quest', /\bmeta quest\b|\bquest 3/], ['ray ban meta', /\bray ?ban\b.*\bmeta\b/], ['ninja slushi', /\bslushi\b/],
  ['philips oneblade', /\boneblade\b/], ['tangle teezer', /\btangle teezer\b/], ['opblaasbare jacuzzi', /\bopblaasbare jacuzzi\b|\b(bestway|intex)\b.*\bspa\b/],
  ['mini beamer', /\bmini ?beamer\b/], ['sterrenhemel projector', /\bsterrenhemel ?projector\b|\bsterren ?projector\b/],
  ['pokemon kaarten', /\bpokemon\b.*\bkaarten\b/], ['mario kart', /\bmario kart\b/], ['bose quietcomfort', /\bquietcomfort\b/], ['philips sonicare', /\bsonicare\b/],
  ['oral b io', /\boral[ -]?b\b.*\bio\b/], ['escape room spel', /\bescape room\b.*\b(spel|game|box|puzzel)\b/], ['puzzel 1000 stukjes', /\b1000 (stukjes|stuks)\b/],
  ['smartwatch kinderen', /\bkinder ?smartwatch\b|\bsmartwatch\b.*\bkinderen\b/],
  ['nintendo switch 2', /^nintendo switch 2\b/, /hoes|case|camera|game|controller|joy ?con|\btas\b|adapter|lader|dock|houder|cover|protector|grip|stand|kabel|\+/],
  ['mario kart game', /\bmario kart (world|8|deluxe|live)\b/, null, 'mario kart'],
];

/* weging van woorden die ook iets anders betekenen (0 = telt niet) of vooral over iets anders gaan */
const W = {
  'amsterdam': 0, 'flight': 0, 'max': 0, 'napoleon': 0.1, 'flamingo': 0.1, 'sigma': 0.2, 'zeppelin': 0.1, 'moon': 0, 'mus': 0, 'lebowski': 0.2, 'balans': 0,
  'alert': 0, 'inside': 0, 'nox': 0.3, 'torres': 0, 'kong': 0.3, 'sector': 0, 'generiek': 0, 'la source': 0, 'valencia': 0, 'hamilton': 0.1, 'cougar': 0,
  'buffalo': 0.1, 'bulls': 0.2, 'hermes': 0.1, 'sage': 0.3, 'ninja': 0.5, 'guess': 0.5, 'benefit': 0.3, 'atmosphere': 0, 'lucardi': 0.1, 'vidaxl': 0, 'therme': 0.3,
  'ariana grande': 0.3, 'billie eilish': 0.3, 'pink floyd': 0.2, 'metallica': 0.2, 'ac dc': 0.2, 'iron maiden': 0.2, 'nirvana': 0.2, 'ozzy osbourne': 0.2,
  'warner bros': 0, 'ubisoft': 0.2, 'take two interactive': 0, 'mindscape': 0, 'annapurna': 0, 'sega': 0.2, 'mojang': 0.2, 'supergiant games': 0.2, 'team17': 0.2,
  'jakks': 0.2, 'dragon fly': 0, 'infantino': 0.1, 'global': 0.1, 'unicorn': 0.1, 'venom': 0.2, 'ami': 0, 'merci': 0.5, 'pico': 0.2, 'equinox': 0, 'clipper': 0.5,
  'philos': 0.2, 'lena': 0, 'adler': 0, 'mustard': 0, 'blu': 0, 'gan': 0, 'wurm': 0, 'thomson': 0.2, 'roberts': 0, 'villa': 0, 'meta': 0.1, 'memphis': 0, 'ets': 0,
  'moxy': 0, 'denver': 0, 'gunther': 0, 'schmidt': 0.2, 'mga': 0, 'mejane': 0, 'present time': 0.3, 'agfa': 0.3, 'lyo': 0, 'nextime': 0.3, 'bitten': 0, 'smarty': 0.2,
  'querido': 0.3, 'robertson': 0, 'nbg': 0, 'playos': 0, 'out of the blue': 0, 'tiamo': 0, 'bouwman': 0, 'konami': 0.2, 'high peak': 0.3, 'little stars': 0,
  'zakje geluk': 0.3, 'scratch': 0, 'muse': 0, 'happy birthday': 0, 'zilveren kruis': 0, 'bubble tea': 0.2, 'moscow mule': 0.2, 'delfts blauw': 0.3, 'lapis lazuli': 0.2,
  'matcha latte': 0.1, 'jelly bean': 0.2, 'zij lacht': 0.3, 'gin tonic': 0.1, 'black box': 0, 'black rock': 0, 'st georges': 0, 'jordan smith': 0, 'pretty pink': 0,
  'girls frontline': 0, 'nice ice': 0, 'inspiratie opdoen': 0, 'drie uur': 0, 'big baby': 0, 'cat selfie': 0.3, 'my hero': 0.3, 'black dragon': 0.2, 'movie night': 0.3,
  'happy hands': 0.2, 'its beautiful': 0, 'kom naar': 0, 'ga mee': 0, 'little creations': 0.3, 'volkswagen t1': 0.3, 'man bag': 0.3, 'katoenen tas': 0.5,
  'rode rozen': 0.5, 'houten nachtkastje': 0.5, 'goudkleurige ketting': 0.5, 'leren sleutelhanger': 0.5, 'e bike': 0.5, 'mario kart': 0.5, 'funko kpop': 0, 'iq test': 0,
  'van gogh': 0.1, 'bbq': 0, 'stanley': 0.3, 'bolero': 0.3, 'yamaha': 0.3, 'backbone': 0.3, 'gerber': 0.3, 'bambam': 0.3, 'mendes': 0.2, 'b living': 0.3, 'buki': 0.3,
  'oliphant': 0.2, 'westwing collection': 0.3, 'casa pro': 0, 'ses': 0.3, 'borges': 0.2, 'san marzano': 0.3, 'carpinus': 0.3, 'lamotte': 0.3, 'totum': 0.3, 'yogi': 0.3,
  'national geographic': 0.2, 'disney classics': 0.2, 'nickelodeon': 0.1, 'relaxwonen': 0, 'denksport puzzelboeken': 1, 'toon hermans': 0.5,
  /* uitgevers en groothandels zijn geen merk waar iemand op zoekt */
  'de geus': 0, 'manteau': 0, 'lannoo': 0, 'billy bones': 0, 'palmslag': 0, 'ploegsma': 0, 'de vier windstreken': 0, 'nijgh & van ditmar': 0, 'becht': 0,
  'bertus distributie': 0, 'nutcrackers': 0, 'engelhart': 0, 'tiki bar': 0, 'escape room': 0.05, 'puzzel 1000 stukjes': 0.3, 'nintendo switch': 0.2,
  'samsung galaxy': 0.3, 'nintendo eshop': 0.3,
};
['pink floyd', 'metallica', 'ac dc', 'iron maiden', 'nirvana', 'ozzy osbourne', 'billie eilish'].forEach(k => { W[k] = 0.05; });
['e bike'].forEach(k => { W[k] = 0; }); W['stanley'] = 0.05; W['lucardi'] = 0.01; W['napoleon'] = 0.05; W['sigma'] = 0.1; W['delfts blauw'] = 0.1; W['pokemon game'] = 0.1;
delete W['mario kart'];
/* een los merk telt voor 0,3, een figuur of serie alleen voor 0,03; buiten zijn eigen hoek telt elk zoekwoord voor een tiende (zie thuis hieronder),
   een los merk buiten zijn eigen hoek maar voor 0,02 ('Little Dutch' bij Boeken, 'Philips' bij Koptelefoons) */
/* De eerste twee woorden van de titel ('Blond Amsterdam', 'Houten kerstboom') zijn vaak een merk zonder merkveld: die tellen ook voor 0,3.
   Een figuur of serie alleen telt voor 0,005, behalve bij Boeken & media (daar is het boek of de film zelf het product). */
function gewicht(k, merk, thuisHier, soort, afd) {
  const isMerk = k === merk || merkN[k] > 0 || soort === 'begin';
  let g = (k in W) ? W[k] : FRAN.has(k) ? (afd === 'boeken-media' ? 0.03 : 0.005) : isMerk ? 0.3 : 1;
  if (!thuisHier) g = isMerk ? Math.min(g, 0.02) : g * 0.1;
  return g;
}

/* zoekwoorden per product */
const sleutels = {};
for (const p of L) {
  const t = norm(String(p.titel || '').split(/\s[–—-]\s|:|\(|,/)[0]); const w = t.split(' '); const tt = norm(p.titel) + ' ' + norm(p.merk);
  const ks = new Map(); /* sleutel -> soort */
  const m = /^(merkloos|onbekend|generic|no brand|geen merk|overig)$/.test(norm(p.merk)) ? '' : norm(p.merk);
  if (m && !SHOP.has(m) && m.length > 2) {
    if (merkN[m] <= 80 && (' ' + norm(p.titel) + ' ').includes(' ' + m + ' ')) ks.set(m, 'merk');
    if (t.indexOf(m) === 0) { const rest = t.slice(m.length).trim().split(' ').filter(x => x && !/^(de|het|een|met|voor|van|en|in|set)$/.test(x) && !/^\d{4,}$/.test(x)); if (rest[0] && rest[0] !== m) ks.set(m + ' ' + rest[0], 'merk+'); }
  }
  for (const f of FR) { if ((' ' + t + ' ').includes(' ' + f + ' ')) { for (const n of NOUN) { if (w.includes(n) && n !== f) { ks.set(n === 'lego' ? ('lego ' + f) : (f + ' ' + n), 'fig+'); break; } } } }
  for (const [k, re, niet] of CUR) if (re.test(tt) && !(niet && niet.test(tt))) ks.set(k, 'lijn');
  const w2 = w.filter(x => x && !/^\d{4,}$/.test(x));
  if (w2.length >= 2) { const k = w2[0] + ' ' + w2[1]; if (!ks.has(k) && VOL[k] && !SHOP.has(k)) ks.set(k, 'begin'); }
  sleutels[p.id] = { m, ks };
}

/* vakjes die Marius uit het menu haalde (17-11-2026: televisies, tandenborstels, koffers ...) tellen niet mee */
const WEG = new Set();
try { const V = JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts/boom/verhuizing.json'), 'utf8'));
  (V.afdelingen || []).forEach(a => (a.groepen || []).forEach(g => (g.weg || []).forEach(v => WEG.add(a.slug + '/' + g.slug + '/' + v)))); } catch (e) { console.error('gezocht: verhuizing.json niet gelezen:', e.message); }
for (let i = L.length - 1; i >= 0; i--) if (WEG.has(L[i].afd + '/' + L[i].groep + '/' + L[i].vak)) L.splice(i, 1);

/* pagina's: groep en vakje, ook de tweede plek in de fanhoeken (p2..p5) */
const HOEK = { p2: ['spellen-puzzels', 'pokemon-verzamelkaarten'], p3: ['speelgoed', 'hello-kitty'], p4: ['speelgoed', 'kpop-demon-hunters'], p5: ['speelgoed', 'one-piece-anime'] };
const pag = {};
const zet = (k, p) => { (pag[k] = pag[k] || []).push(p); };
for (const p of L) {
  if (p.afd && p.groep) { zet('/c/' + p.afd + '/' + p.groep, p); if (p.vak) zet('/c/' + p.afd + '/' + p.groep + '/' + p.vak, p); }
  for (const h of Object.keys(HOEK)) if (p[h]) { const [a, g] = HOEK[h]; zet('/c/' + a + '/' + g, p); zet('/c/' + a + '/' + g + '/' + p[h], p); }
}

/* thuis van een zoekwoord: de groepen waar minstens 15% van zijn producten staat (of de grootste). Een Squishmallows-lamp bij Verlichting
   of een Harry Potter-tuinlamp krijgt zo niet het volle zoekvolume van de knuffel of de boeken. */
const kGroep = {};
for (const p of L) { const gr = new Set(); if (p.afd && p.groep) gr.add('/c/' + p.afd + '/' + p.groep); for (const h of Object.keys(HOEK)) if (p[h]) gr.add('/c/' + HOEK[h].join('/'));
  sleutels[p.id].ks.forEach((x, k) => { const o = kGroep[k] = kGroep[k] || {}; gr.forEach(g => { o[g] = (o[g] || 0) + 1; }); }); }
const THUIS = {};
for (const k of Object.keys(kGroep)) { const o = kGroep[k], tot = Object.values(o).reduce((a, b) => a + b, 0), mx = Math.max(...Object.values(o));
  THUIS[k] = new Set(Object.keys(o).filter(g => o[g] === mx || (o[g] >= 2 && o[g] >= 0.15 * tot))); }
const fr = k => { for (const f of FRAN) if (k === f || k.startsWith(f + ' ')) return f; return ''; };
const UIT = {}; let nPag = 0, nGeen = 0;
for (const sl of Object.keys(pag).sort()) {
  const lijst = [...new Map(pag[sl].map(p => [p.id, p])).values()];
  if (lijst.length < 4) continue;
  /* zoekwoorden die bijna de hele pagina delen tellen hier niet */
  const tel = {}; lijst.forEach(p => sleutels[p.id].ks.forEach((s, k) => { tel[k] = (tel[k] || 0) + 1; }));
  const generiek = k => lijst.length >= 6 && tel[k] / lijst.length >= 0.4;
  const top = TOP[sl] || []; const plek = {}; top.forEach((id, i) => { plek[id] = i; });
  const groepVan = sl.split('/').slice(0, 4).join('/');
  const kand = [];
  for (const p of lijst) {
    const S = sleutels[p.id]; let best = null;
    const heeftFig = [...S.ks.keys()].filter(k => S.ks.get(k) === 'fig+' && VOL[k]);
    for (const k of S.ks.keys()) {
      if (!VOL[k] || generiek(k)) continue;
      if (FRAN.has(k) && heeftFig.some(f => f.startsWith(k + ' '))) continue;
      let sc = VOL[k] * gewicht(k, S.m, THUIS[k] && THUIS[k].has(groepVan), S.ks.get(k), sl.split('/')[2]);
      if (/\b(uitbreiding|expansion|navulling|refill)\b/i.test(p.titel)) sc *= 0.3;
      if (!best || sc > best.sc) best = { k, sc };
    }
    if (best && best.sc >= 100) kand.push({ p, k: best.k, sc: best.sc, m: S.m, f: fr(best.k) || fr(S.m) });
  }
  kand.sort((a, b) => b.sc - a.sc || (plek[a.p.id] ?? 999) - (plek[b.p.id] ?? 999) || ((a.p.shop === 'bol') - (b.p.shop === 'bol')) || ((b.p.zk ? 1 : 0) - (a.p.zk ? 1 : 0)) || a.p.prijs - b.p.prijs);
  const mt = {}; lijst.forEach(p => { const m = sleutels[p.id].m; if (m) mt[m] = (mt[m] || 0) + 1; });
  const algemeen = m => mt[m] / lijst.length >= 0.4; /* LEGO-vakje: daar mogen er meer van LEGO zijn */
  const kies = [], gk = new Set(), gm = new Set(), gf = new Set(), gt = new Set();
  for (const c of kand) {
    const tk = norm(c.p.titel).split(' ').slice(0, 4).join(' ');
    if (gk.has(c.k) || (c.m && gm.has(c.m) && !algemeen(c.m)) || (c.f && gf.has(c.f)) || gt.has(tk)) continue;
    kies.push(c); gk.add(c.k); if (c.m) gm.add(c.m); if (c.f) gf.add(c.f); gt.add(tk);
    if (kies.length === 5) break;
  }
  if (kies.length) { UIT[sl] = kies.map(c => c.p.id); nPag++; if (DROOG) console.log(sl + '  ' + kies.slice(0, 3).map(c => c.k + ' (' + Math.round(c.sc) + ') ' + c.p.titel.slice(0, 40)).join(' | ')); }
  else nGeen++;
}
console.log('meest gezocht: ' + nPag + " pagina's met een keuze, " + nGeen + ' zonder (te weinig zoekvolume)');
/* 22-11-2026: per product de gewogen vraag (zoekvolume per maand, zelfde weging, in zijn eigen hoek), voor scripts/top/belang.js.
   Niet in git (keurkamer/data/vraag.json): alleen de volgorde die eruit komt staat in picks.json. */
{ const VR = {};
  for (const p of L) { const S = sleutels[p.id]; let b = 0;
    for (const k of S.ks.keys()) { if (!VOL[k]) continue; let sc = VOL[k] * gewicht(k, S.m, true, S.ks.get(k), p.afd); if (/\b(uitbreiding|expansion|navulling|refill)\b/i.test(p.titel)) sc *= 0.3; if (sc > b) b = sc; }
    if (b >= 50) VR[p.id] = Math.round(b); }
  fs.writeFileSync(path.join(ROOT, 'keurkamer/data/vraag.json'), JSON.stringify(VR)); console.log('vraag per product: ' + Object.keys(VR).length); }
if (DROOG) process.exit(0);

const f = path.join(ROOT, 'assets/js/topkeuze.js');
let s = fs.readFileSync(f, 'utf8');
const BEGIN = '\n/* MEEST GEZOCHT (21-11-2026)', EIND = '/* EINDE MEEST GEZOCHT */\n';
const i = s.indexOf(BEGIN); if (i !== -1) { const j = s.indexOf(EIND, i); s = s.slice(0, i) + s.slice(j + EIND.length - 1); }
const blok = BEGIN + ', opdracht Marius: per groep en vakje de cadeaus waar het meest op gezocht wordt in Google bovenaan.\n   Gemaakt met scripts/seo/gezocht.js; app.js (gezochtEerst) zet de eerste 3 die op de pagina staan vóór de vaste top. */\nwindow.LK_GEZOCHT = ' + JSON.stringify(UIT) + ';\n' + EIND;
const v = s.indexOf('\n/* VASTE TOP');
s = v === -1 ? s.replace(/\s+$/, '') + blok : s.slice(0, v) + blok.replace(/\n$/, '') + s.slice(v);
fs.writeFileSync(f, s);
console.log('LK_GEZOCHT in topkeuze.js gezet');
