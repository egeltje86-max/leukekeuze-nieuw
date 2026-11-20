/* CADEAUKEURMEESTER (19-11-2026, opdracht Nova via Marius: 'de juiste cadeaus bij de juiste mensen en gelegenheden').
   Past dit cadeau bij deze ontvanger en deze gelegenheid? Een vakje of label alleen is niet genoeg: we kijken ook naar wat er
   in de titel staat (dood, grof, een tekst voor een ander moment, iets heel persoonlijks, een potje uit de voorraadkast ...).

   Werking: elk product begint op 75 punten (het staat al in een passend vakje of heeft het label van de persoon).
   Elke regel hieronder trekt punten af voor een gelegenheid (g) of een ontvanger (p). Wat overblijft:
     75 en hoger = goed  ·  65 tot 74 = zacht: een paar rijen (24 plekken) naar achteren  ·  50 tot 64 = twijfel: onderaan  ·  onder 50 = niet op die pagina.
   Een cadeau dat Marius zelf voor een gelegenheid koos (ERBIJ-lijst gelegenheden 13-11, paginaregels met_de_hand) houdt daar zijn plek.
   Gebruikt door scripts/splits-producten.js (veld km in producten-lean.js), app.js (kmUit, kmOrde) en scripts/controle/keurmeester.js. */
'use strict';

/* Gelegenheden (g) en ontvangers (p) waar de regels over gaan. 'grappig' = de bezoeker koos zelf voor humor. */
const G = ['bedankt', 'afscheid', 'verjaardag', 'jubileum', 'housewarming', 'beterschap', 'geslaagd', 'juf', 'moederdag', 'vaderdag', 'uitdelen', 'kerst', 'sinterklaas', 'valentijn', 'lootjes', 'schoen', 'grappig'];
const PP = ['hem', 'haar', 'kinderen', 'tieners', 'opa-oma', 'collega', 'baby'];
const FEEST = ['bedankt', 'afscheid', 'jubileum', 'housewarming', 'beterschap', 'geslaagd', 'juf', 'moederdag', 'vaderdag', 'uitdelen', 'kerst', 'sinterklaas', 'valentijn', 'schoen'];
const KIND = ['kinderen', 'tieners', 'baby'];

const T = (p) => (p.titel || '');
const R = {
  /* Dood als grap (grafsteen-verjaardagskaars, doodskist, R.I.P.). Grappig voor sommigen, maar nooit als bedankje, troost of feest. */
  doodGrap: /grafsteen|grafzerk|doodskist|lijkkist|basically dead|\br\.?i\.?p\.?\b|begraaf|begrafenis|kerkhof|over the hill|bijna dood|te oud om/i,
  /* Echte rouw: hoort bij Sterkte, niet bij een feest. */
  rouw: /condoleance|rouwkaart|\brouw\b|in memoriam|herinneringsurn|\burn\b|gedenk(steen|kaars|lampje)|sterrenkind/i,
  /* Doodshoofden en Halloween: past bij fans en stoere sieraden, niet bij een bedankje, een baby of oma. */
  schedel: /doodshoofd|schedel|skull|skelet(?!ool)/i, /* 20-11: niet de Leatherman Skeletool */
  dino: /dino|triceratops|t-?rex|fossiel|jurassic/i,
  /* Grof of seks: zelfde woorden als plaats.js (GROF) plus erotiek. */
  grof: /f[u*]ck|\bkut\b|lekker pik|pleur op|sexy as hell|ben je dronken|piemel|borstmok|\bbitch(es)?\b|middelvinger|shit happens|bullshit|\bjoint\b|\bseks|\bsex(y|toy)?\b|erotisch|\bpenis|vagina|tieten|condoom|vibrator|kamasutra|stripper|willy\b|\b18\+|kinky|naakt/i,
  /* 'Is het eindelijk Sinterklaas / 25 jaar getrouwd, krijg ik zo'n kut tegeltje': Marius liet de Sinterklaas-versie bewust staan (plaats.js GROF_MAG). Zelfde reeks = alleen niet bij kinderen. */
  grofZacht: /zo'?n kut (tegeltje|mok)/i,
  drinkspel: /drinking game|drankspel|drinkspel|drinkmaster|drink ?roulette|shotglas ?roulette|beer ?pong|bierpong/i,
  /* Heel persoonlijke verzorging: geen cadeau voor een collega of als bedankje. */
  intiem: /deodorant|\bdeo\b|anti-?transpirant|scheerapparaat|scheermes|scheerset|ontharing|epilator|ladyshave|tandenborstel|monddouche|tongschraper|neushaar|oorhaar|eelt|likdoorn|nagelknipper|aambei|intiem|menstruatie|tampon|incontinent|lichaamshaar|bikinilijn|trimmer/i,
  /* Massage-apparaten en -rollers: fijn voor jezelf of je partner, bij een collega iets te persoonlijk. */
  massage: /massage|massager|shiatsu|nekroller|nekmassage|acupressuur/i,
  /* Bad en bruisballen: als bedankje voor een collega te persoonlijk (handcrème en zeep wel). */
  bad: /bruisbal|bath ?bomb|badbom|badzout|badolie|badparel|badschuim|bubbelbad|bad ?bruis/i,
  /* Kleding die je op je huid draagt of in maten koopt: niet voor een collega. */
  ondergoed: /lingerie|ondergoed|boxershort|\bslip\b|\bbh\b|beha\b|string\b|pyjama|nachthemd|badjas|ochtendjas|kamerjas|onesie|badpak|bikini|zwembroek/i,
  /* Een potje of fles uit de voorraadkast: lekker, maar als cadeau voor een collega of als bedankje te kaal (een pakket of proeverij wel). */
  voorraad: /olijfolie|\bolie\b|azijn|balsamico|truffel ?(crème|creme|olie|saus|zout|tapenade)|crema tartufata|tartufata|\bpesto\b|tapenade|pastasaus|\bsaus\b|sauce\b|ketchup|mayonaise|mosterd|marinade|dressing|bouillon|specerij|kruidenmix|kruiden ?mix|\bzout\b|zeezout|\bpeper\b|pasta\b|risotto|\brijst\b|\bmeel\b|bakmix|siroop|pistache ?(crème|creme|pasta|spread)|notenpasta|pindakaas/i,
  pakket: /pakket|cadeau|gift|geschenk|\bset\b|proeverij|proefdoos|box\b|\bdoos\b|\bmand\b|kistje|trio|duo\b|selectie|assortiment|\b(twee|drie|vier|vijf|zes|[2-9]) (smaken|soorten|flesjes|potjes)|\b[2-9] ?x ?\d/i, /* 20-11: 'olijfolie in drie smaken (3 x 250 ml)' is een pakketje */
  /* Dieren: een kauwbot of krabpaal is geen kindercadeau (Nova: 'verwarring tussen cadeaus voor kinderen en huisdieren'). */
  dier: /voor (je |jouw |de )?(hond|kat|huisdier|konijn|cavia|vogel)|honden(speelgoed|snack|koekje|bed|mand|riem|knuffel|bal|jas|trui)|katten(speelgoed|snack|bed|mand|kruid|tunnel)|kauwbot|kauwspeelgoed|krabpaal|halsband|hondenriem|kattenkruid|knaagdier|voor huisdieren|snuffelmat|likmat|dierenspeelgoed/i,
  /* Een titel die een ander moment noemt. */
  verjaardag: /verjaardag|\bjarig|happy b-?day|birthday|hiep hiep|taartkaars|taarttopper|cake topper/i,
  /* Seizoen: een chocoladeletter of 'Merry Christmas' hoort niet bij een afscheid of een bedankje in juni (de gelegenheden filteren al op 'kerst' en 'sinterklaas', niet op deze woorden). */
  sint: /\bsint\b|sinterklaas|chocoladeletter|letterrepen|chocolade ?letter|pepernoten|kruidnoten|strooigoed|schoencadeau|\bpiet(en)?\b|pakjesavond/i,
  kerstWoord: /christmas|\bxmas|kerst|\bsanta\b(?! fe| montefiore| cruz| barbara| maria)|kerstman|sneeuwpop|merry christmas/i, /* 20-11: niet de schrijfster Santa Montefiore */
  volwassen: /voor volwassenen|\b18\+|\(18\)|adults? only/i,
  /* Geen voorraad: stellen, molens, strooiers en chocolade-truffels. */
  geenVoorraad: /stel\b|molen|strooier|vaatje|shaker|houder|kaars|geur|\bthee|zeep|chocola|bonbon|praline|truffels\b|karamel|toffee|snoep|\bdrop\b|kookboek|boek\b/i,
  /* ---- Fase 2 (20-11-2026, Nova's herkeuring): zachte regels. Deze cadeaus blijven op de pagina, maar schuiven een paar rijen naar achteren
     (aftrek 1 tot 10: app.js zet ze 24 plekken later), zodat eerst de cadeaus staan die bij bijna iedereen passen. ---- */
  /* Een hobby of smaak die je moet kennen: als algemeen bedankje of voor een collega pas na de neutrale cadeaus. */
  hobby: /\bgamer|gaming|game ?controller|\bcontroller\b|playstation|\bps5\b|\bxbox\b|nintendo|minecraft|fortnite|whisk(e)?y|\bbier|biertje|\bbeer\b|\bgolf|\bdarts?\b|\bdart(pijl|bord)|sigaar|sigaren|formule ?1|\bf1\b|voetbal|\bvissen\b|hengel|taylor swift|swiftie/i,
  /* Iets voor op je huid of in bad: persoonlijke smaak, als bedankje voor de juf of iemand die je niet goed kent pas na de neutrale cadeaus. */
  huid: /body ?scrub|\bscrub\b|\bzeep(?!bel)|zeepjes|zeepnoedel|douchegel|showergel|body ?lotion|\blotion\b|body ?butter|badparel|bruisbal|bath ?bomb|badzout|badolie|scheerschuim|gezichtsmasker|sheet ?mask/i,
  pakketStreng: /pakket|giftset|gift ?set|cadeauset|cadeaubox|geschenkset|verwenset|\bset\b|\bbox\b|\bmand\b|\bduo\b|\btrio\b/i,
  /* Een jubileum van een bepaald aantal jaar, of humor over het huwelijk: past, maar niet bij iedereen. */
  jubileumJaar: /\b\d+([,.]5)? ?jaar (getrouwd|samen)|koperen bruiloft|zilveren bruiloft|gouden bruiloft|robijnen bruiloft|\b\d+ jaar huwelijk/i,
  relatieGrap: /huwelijk is|getrouwd, krijg|zo'?n k[u*]t|mijn man is|mijn vrouw is/i,
  /* Een kroonjaar (Abraham, 50 jaar): hoort bij die leeftijd, op de gewone verjaardagspagina pas na de algemene cadeaus. */
  kroonjaar: /\babraham\b|\bsarah\b|\b(18|21|25|30|40|50|60|65|70|75|80|90) ?jaar\b|\bhoera \d{2}\b/i,
  /* Voor een stel of je partner (Mr & Mrs, I love you): op de gewone pagina's voor hem en haar pas na de rest; bij Valentijn en jubileum gewoon. */
  stel: /\bmr\.? ?(&|and|en) ?mrs\b|\bi love you\b|\blove you\b|\bsamenwonen|his ?(&|and) ?hers|voor mijn (vrouw|man|vriend|vriendin)\b/i,
  /* Veel snoep in één verpakking (om uit te delen): voor iemand die ziek is of als bedankje voor één persoon te veel. */
  veelSnoep: /\b(1[0-9]|[2-9][0-9]|[1-9][0-9]{2}) ?(stuks|lolly|lollies|lolly's|snoep|hartjes|repen|zakjes|doosjes|ringen)\b|\b(24|30|40|50|60|100|200) (lolly|snoep|ring)/i,
  snoep: /snoep|lolly|lollies|lolly's|\bdrop\b|chocola|hartjes|ring pop|candy|marshmallow|gummy|zuurtje/i,
  /* Een gokspelletje voor kinderen. */
  kansspel: /gokkast|jackpot|casino|roulette|\bpoker\b|\bbingo\b/i,
  /* Uitdelen: een multipack of iets van een paar euro. */
  uitdeelPak: /\b\d+ ?(stuks|st\.)|set van \d|uitdeel|traktatie|feestzakje|goodie ?bag|multipack|\b\d+-pack\b/i,
  /* Een los bord- of kaartspel (oude en nieuwe indeling); verzamelkaarten en boosterpakjes zijn geen spel. */
  losSpel: (p) => !/verzamelkaart|booster|ruilkaart|toploader/i.test(p.titel || '') && (
    (p.afd === 'speelgoed' && p.groep === 'spellen' && /^(bordspellen-voor-het-gezin|strategiespellen|kaart-dobbelspellen|partyspellen|kinderspellen)$/.test(p.vak || '')) ||
    (p.afd === 'spellen-puzzels' && /^(bordspellen|kaart-partyspellen|kinderspellen)$/.test(p.groep || '')) ||
    (p.cat === 'speelgoed' && p.sub === 'bord-kaartspellen' && !p.afd)),
  /* Romans voor volwassenen met expliciete scènes. */
  volwassenBoek: /colleen hoover|sarah j\.? maas|rebecca yarros|\bana huang\b|hof van (doorns|mist|vleugels|ijs|zilveren|versplinterde)|fourth wing|iron flame|onyx storm/i
};
/* Merken en producten die Marius zelf vooraan wil (CLAUDE.md): krijgen geen aftrek van de zachte regels.
   Atelier Rebul (merk van familie; 'zet in een nieuwe top voor geur, kaarsen of verzorging eerst een cadeau van Atelier Rebul'),
   en wat echt verkocht is ('verkochte producten vooraan', 12/16/17-11-2026). */
const ZACHT_VRIJ_MERK = /^atelier rebul\b/i;
const VERKOCHT = new Set(['dvzn-995816', 'dvzn-c15dcffb40', 'cl-hema-heren-pyjama', 'hema-efaa95f521', 'bol-9300000302102741']);
/* Groepen (nieuwe indeling) die als bedankje of collegacadeau vanzelf passen: geeft geen aftrek, alleen bewijs voor het rapport. */
const BEDANK_BEWIJS = /bedankt|dankjewel|dank je|thank|merci|top collega|beste collega|super collega|goud waard/i;

/* Een regel = { naam, test(p) -> bool, g: {gelegenheid: aftrek}, p: {ontvanger: aftrek}, uitleg, voorstel } */
function regels(smalPag) {
  const alleG = (n, behalve) => { const o = {}; G.forEach((g) => { if (!(behalve || []).includes(g)) o[g] = n; }); return o; };
  const feestG = (n, extra) => Object.assign(Object.fromEntries(FEEST.map((g) => [g, n])), extra || {});
  const L = [
    { naam: 'dood-als-grap', test: (p) => R.doodGrap.test(T(p)),
      g: feestG(40, { verjaardag: 20, lootjes: 20 }), p: { collega: 20, 'opa-oma': 40, kinderen: 40, tieners: 30, baby: 40 },
      uitleg: 'Grap over de dood (grafsteen, doodskist). Kan als verjaardagsgrap tussen vrienden, maar niet als bedankje, troost of feestcadeau.',
      voorstel: 'Alleen bij Grappige cadeaus, in zijn eigen vakje en lager bij Verjaardag.' },
    { naam: 'rouw', test: (p) => R.rouw.test(T(p)),
      g: Object.assign(alleG(40, ['beterschap']), { grappig: 50 }), p: { kinderen: 30, tieners: 30, baby: 40 },
      uitleg: 'Rouwproduct. Hoort bij Beterschap & sterkte, niet bij een feest of bedankje.',
      voorstel: 'Alleen bij Beterschap & sterkte en in zijn eigen vakje.' },
    { naam: 'doodshoofd', test: (p) => R.schedel.test(T(p)) && !R.doodGrap.test(T(p)) && !R.dino.test(T(p)),
      g: { bedankt: 30, juf: 30, beterschap: 30, moederdag: 30, jubileum: 30, housewarming: 15, afscheid: 15, valentijn: 30, kerst: 5, sinterklaas: 15, uitdelen: 15, schoen: 15 }, p: { baby: 40, 'opa-oma': 30, collega: 15 }, /* 20-11: kerst 5 (een foute kersttrui met een skelet is een klassieke collegagrap) */
      uitleg: 'Doodshoofd, skelet of Halloween. Stoer voor een fan, maar vreemd als bedankje, bij een baby of voor opa en oma.',
      voorstel: 'Wel bij hem, tieners en grappige cadeaus; niet bij bedankjes, baby, oma en moederdag.' },
    { naam: 'grof-of-seks', test: (p) => R.grof.test(T(p)) && !R.grofZacht.test(T(p)) && p.id !== 'dvzn-871551',
      g: Object.assign(alleG(40, ['grappig', 'verjaardag', 'valentijn']), { verjaardag: 15, valentijn: 15 }), p: { collega: 20, 'opa-oma': 40, kinderen: 60, tieners: 60, baby: 60 },
      uitleg: 'Scheldwoord, gebaar of seksgrap. Alleen als de bezoeker zelf voor humor kiest.',
      voorstel: 'Alleen bij Grappige cadeaus, in zijn eigen vakje en bij hem en haar.' },
    { naam: 'grap-met-kut-tegeltje', test: (p) => R.grofZacht.test(T(p)) && p.id !== 'dvzn-871551',
      g: { uitdelen: 60, schoen: 60, bedankt: 30, juf: 40, beterschap: 30 }, p: { kinderen: 60, tieners: 40, baby: 60 },
      uitleg: 'Grap met een scheldwoord op een tegeltje of mok voor een feest. Marius liet de Sinterklaas-versie bewust staan; bij kinderen en als bedankje niet.',
      voorstel: 'Wel op zijn eigen feest (jubileum, Sinterklaas) en bij Grappige cadeaus.' },
    { naam: 'drankspel', test: (p) => R.drinkspel.test(T(p)),
      g: { uitdelen: 60, schoen: 60, juf: 40, beterschap: 30, bedankt: 15 }, p: { kinderen: 60, tieners: 60, baby: 60, collega: 15 },
      uitleg: 'Een drankspel: alleen voor volwassenen die feesten.',
      voorstel: 'Niet bij kinderen, tieners en bedankjes.' },
    { naam: 'heel-persoonlijk', test: (p) => R.intiem.test(T(p)),
      g: { bedankt: 35, juf: 35, afscheid: 20, uitdelen: 40, schoen: 30 }, p: { collega: 35 },
      uitleg: 'Heel persoonlijke verzorging (scheren, ontharen, deodorant, tandenborstel). Geef je niet aan een collega of als bedankje.',
      voorstel: 'Wel bij hem en haar, niet bij collega’s en bedankjes.' },
    { naam: 'massage', test: (p) => R.massage.test(T(p)),
      g: { bedankt: 15, juf: 20, uitdelen: 30, afscheid: 8 }, p: { collega: 15 },
      uitleg: 'Massage-apparaat of -roller. Fijn cadeau voor een partner of ouder, voor een collega iets te persoonlijk.',
      voorstel: 'Lager bij collega’s en bedankjes.' },
    { naam: 'bad-en-bruisballen', test: (p) => R.bad.test(T(p)) && !R.pakket.test(T(p)),
      g: {}, p: { collega: 15 },
      uitleg: 'Losse bruisballen of badzout. Als bedankje voor een collega persoonlijker dan een kaarsje of handcrème.',
      voorstel: 'Lager bij collega’s; wel bij haar, Bedankt en Beterschap.' },
    { naam: 'ondergoed-en-nachtkleding', test: (p) => R.ondergoed.test(T(p)),
      g: { bedankt: 30, juf: 30, afscheid: 15, geslaagd: 15 }, p: { collega: 30 },
      uitleg: 'Ondergoed, pyjama of badjas: draag je op je huid en koop je in een maat. Geen collegacadeau of bedankje.',
      voorstel: 'Wel bij hem, haar en Kerst; niet bij collega’s en bedankjes.' },
    { naam: 'potje-uit-de-voorraadkast', test: (p) => R.voorraad.test(T(p)) && !R.pakket.test(T(p)) && !R.geenVoorraad.test(T(p)),
      g: { bedankt: 20, juf: 20, afscheid: 15, lootjes: 15, schoen: 30, uitdelen: 30, geslaagd: 20, jubileum: 15 }, p: { collega: 20, kinderen: 30, tieners: 25 },
      uitleg: 'Een losse fles olie, potje truffelcrème, saus of kruiden. Lekker, maar als bedankje of collegacadeau te kaal; een pakket of proeverij werkt beter.',
      voorstel: 'Lager bij bedankjes en collega’s; wel bij hem, haar, opa en oma en bij Lekkernijen.' },
    { naam: 'dierenspullen', test: (p) => (R.dier.test(T(p)) || p.afd === 'dieren') && !/vogelhuis|voederhuis|voedersilo|voederplek|vetbol|nestkast|insect|egelhuis|vogelbad|vlinder|pindakaas voor vogels|vogels kijken|verrekijker/i.test(T(p)),
      g: { bedankt: 30, juf: 30, afscheid: 30, geslaagd: 30, uitdelen: 40, schoen: 40, jubileum: 30, moederdag: 20, vaderdag: 20, beterschap: 30, lootjes: 20, sinterklaas: 20, kerst: 10 }, p: { kinderen: 40, tieners: 40, baby: 40, collega: 30 },
      uitleg: 'Iets voor een huisdier. Op een pagina voor kinderen of als bedankje denkt de bezoeker dat het voor een mens is.',
      voorstel: 'Alleen bij Dieren en op de algemene pagina’s voor hem en haar.' },
    { naam: 'ander-moment-verjaardag', test: (p) => R.verjaardag.test(T(p)) && !/verjaardagskalender|verjaardags?kalender/i.test(T(p)),
      g: { bedankt: 30, afscheid: 30, beterschap: 40, juf: 30, housewarming: 30, jubileum: 20, geslaagd: 20, moederdag: 20, vaderdag: 20, valentijn: 20 }, p: {},
      uitleg: 'De titel noemt een verjaardag. Op een andere gelegenheid klopt dat niet.',
      voorstel: 'Alleen bij Verjaardag en in zijn eigen vakje.' },
    { naam: 'seizoen-sinterklaas', test: (p) => R.sint.test(T(p)),
      g: { afscheid: 40, jubileum: 40, housewarming: 30, beterschap: 30, geslaagd: 40, juf: 40, moederdag: 50, vaderdag: 50, valentijn: 50, verjaardag: 20, kerst: 15 }, p: {},
      uitleg: 'Iets voor Sinterklaas (chocoladeletter, pepernoten). Op een afscheid, jubileum of examenfeest klopt dat niet.',
      voorstel: 'Bij Sinterklaas en Schoencadeautjes; bij andere gelegenheden niet of onderaan.' },
    { naam: 'seizoen-kerst', test: (p) => R.kerstWoord.test(T(p)),
      g: { afscheid: 30, jubileum: 30, housewarming: 20, beterschap: 20, geslaagd: 40, juf: 40, moederdag: 50, vaderdag: 50, valentijn: 40, verjaardag: 20, sinterklaas: 15, uitdelen: 20 }, p: {},
      uitleg: 'Iets voor Kerst. Op een afscheid, examenfeest of Moederdag klopt dat niet.',
      voorstel: 'Bij Kerst; bij andere gelegenheden niet of onderaan.' },
    { naam: 'voor-volwassenen', test: (p) => R.volwassen.test(T(p)),
      g: { uitdelen: 50, schoen: 50 }, p: { kinderen: 50, baby: 50 },
      uitleg: 'Volgens de titel voor volwassenen.',
      voorstel: 'Niet bij kinderen en tieners.' },
    { naam: 'leeftijd-tiener', test: (p) => Array.isArray(p.leeftijd) && p.leeftijd[0] >= 13 && p.leeftijd[0] < 16,
      g: { uitdelen: 20, schoen: 20 }, p: { kinderen: 20 },
      uitleg: 'Volgens de leeftijd vanaf 13 jaar: past bij een tiener, voor een kind te oud. Staat bij kinderen wel, maar onderaan.',
      voorstel: 'Bij tieners vooraan, bij kinderen onderaan.' },
    { naam: 'leeftijd-volwassen', test: (p) => Array.isArray(p.leeftijd) && p.leeftijd[0] >= 16 && !(p.voor || []).includes('baby'),
      g: { uitdelen: 40, schoen: 40 }, p: { kinderen: 40 },
      uitleg: 'Volgens de leeftijd voor 16 jaar en ouder: geen kindercadeau.',
      voorstel: 'Niet bij kinderen.' },
    { naam: 'leeftijd-te-jong', test: (p) => Array.isArray(p.leeftijd) && p.leeftijd[1] <= 6 && p.leeftijd[0] <= 3,
      g: {}, p: { tieners: 40 },
      uitleg: 'Speelgoed voor peuters en kleuters: niets voor een tiener.',
      voorstel: 'Bij kinderen en baby, niet bij tieners.' },
    /* ---- Fase 2 (20-11-2026): zachte regels (aftrek 1 tot 10 = een paar rijen naar achteren, niet weg). ---- */
    { naam: 'hobby-of-smaak', zacht: true, test: (p) => R.hobby.test(T(p)) && !BEDANK_BEWIJS.test(T(p)) && !/boek|puzzel/i.test(T(p)),
      g: {}, p: {}, gp: { bedankt_: 8, bedankt_hem: 8, bedankt_haar: 8, bedankt_collega: 8, 'bedankt_opa-oma': 8, juf_: 8, juf_hem: 8, juf_haar: 8,
        beterschap_: 8, beterschap_hem: 8, beterschap_haar: 8, beterschap_collega: 8, 'beterschap_opa-oma': 8, afscheid_collega: 8 }, /* niet bij tieners en kinderen: daar is gamen gewoon */
      uitleg: 'Past bij een bepaalde hobby of smaak (gamen, whisky, bier, golf, voetbal). Mooi als je die kent, maar als algemeen bedankje of voor een collega pas na de cadeaus die bij iedereen passen.',
      voorstel: 'Bij Bedankt, Juf & meester, Beterschap en collega’s een paar rijen lager.' },
    { naam: 'huid-en-bad', zacht: true, test: (p) => R.huid.test(T(p)) && !R.pakketStreng.test(T(p)),
      /* 20-11-2026: niet bij Bedankt voor kinderen: grappige bruisballen zijn daar speelgoed voor in bad (Nova: dinopoep-bruisballen goed). */
      g: {}, p: {}, gp: { bedankt_: 8, bedankt_hem: 8, bedankt_haar: 8, bedankt_tieners: 8, bedankt_collega: 8, 'bedankt_opa-oma': 8, juf_: 8, juf_hem: 8, juf_haar: 8 },
      uitleg: 'Scrub, zeep of bruisballen: persoonlijke smaak. Als bedankje pas na de neutrale cadeaus.',
      voorstel: 'Bij Bedankt en Juf & meester een paar rijen lager.' },
    { naam: 'jubileum-van-een-bepaald-jaar', zacht: true, test: (p) => R.jubileumJaar.test(T(p)),
      g: { jubileum: 8 }, p: {},
      uitleg: 'Voor een bepaald aantal jaar getrouwd (12,5, 25, 40 jaar). Op de algemene jubileumpagina na de cadeaus die bij elk jubileum passen.',
      voorstel: 'Bij Trouwen & jubileum een paar rijen lager.' },
    { naam: 'grap-over-het-huwelijk', zacht: true, test: (p) => R.relatieGrap.test(T(p)),
      g: { jubileum: 8 }, p: {},
      uitleg: 'Een grap over het huwelijk: leuk voor wie zo’n grap waardeert, niet voor iedereen.',
      voorstel: 'Bij Trouwen & jubileum een paar rijen lager.' },
    { naam: 'kroonjaar', zacht: true, test: (p) => R.kroonjaar.test(T(p)) && !/getrouwd|jubileum|huwelijk/i.test(T(p)),
      g: { verjaardag: 8 }, p: {},
      uitleg: 'Voor één leeftijd (Abraham, 50 jaar). Op de gewone verjaardagspagina pas na de cadeaus voor elke leeftijd; met de knop voor die leeftijd staat het vooraan.',
      voorstel: 'Bij Verjaardag een paar rijen lager.' },
    { naam: 'voor-een-stel', zacht: true, test: (p) => R.stel.test(T(p)),
      g: {}, p: {}, gp: { _hem: 8, _haar: 8, housewarming_hem: 8, housewarming_haar: 8, bedankt_hem: 8, bedankt_haar: 8 }, /* bij Valentijn en Jubileum gewoon; 20-11-2026: ook op de gewone Housewarming-pagina (samenwonen is daar juist het onderwerp; Nova: serveerplank 'Samenwonen' goed) */
      uitleg: 'Voor een stel of je partner (Mr & Mrs, I love you). Op de gewone pagina’s voor hem en haar pas na de rest; bij Valentijn en Jubileum gewoon vooraan.',
      voorstel: 'Bij hem en haar een paar rijen lager.' },
    { naam: 'veel-snoep-in-een-keer', zacht: true, test: (p) => R.veelSnoep.test(T(p)) && R.snoep.test(T(p)),
      g: { beterschap: 10 }, p: {},
      uitleg: 'Een grote verpakking snoep om uit te delen. Voor iemand die ziek is veel.',
      voorstel: 'Bij Beterschap een paar rijen lager; bij Bedankt (de klas) en Uitdeelcadeautjes gewoon.' },
    { naam: 'gokspelletje', zacht: true, test: (p) => R.kansspel.test(T(p)),
      g: {}, p: {}, gp: { _kinderen: 8, bedankt_kinderen: 8, beterschap_kinderen: 8, uitdelen_: 8 }, /* bij Grappige cadeaus gewoon */
      uitleg: 'Een gokspelletje (gokkast, casino). Bij kinderen niet vooraan.',
      voorstel: 'Bij kinderen een paar rijen lager.' },
    /* Alleen waar zo'n duur cadeau kan staan: Bedankje voor collega's (Bedankt en Juf & meester gaan tot 25 euro). */
    { naam: 'duur-voor-een-bedankje', zacht: true, test: (p) => typeof p.prijs === 'number' && p.prijs > 35 && (p.tags || []).includes('collega-bedankje'),
      gFn: (p, g) => g === 'bedankt' ? (p.prijs > 50 ? 15 : 8) : 0, p: {},
      uitleg: 'Meer dan 35 euro: als bedankje voor één persoon veel; eerder een teamcadeau.',
      voorstel: 'Bij Bedankt en Juf & meester lager.' },
    { naam: 'duur-voor-de-lootjes', zacht: true, test: (p) => typeof p.prijs === 'number' && p.prijs > 25 && p.prijs <= 50, /* 20-11-2026: Kleine cadeautjes gaat nu tot 25 euro (maxPrijs in data.js); deze regel geldt nog voor Lootjes bij collega */
      g: { lootjes: 8 }, p: {},
      uitleg: 'Meer dan 25 euro: bij Kleine cadeautjes en de lootjes eerst de echt kleine cadeaus.',
      voorstel: 'Bij Kleine cadeautjes en Lootjes een paar rijen lager.' },
    /* 20-11-2026 (Marius: 'Uitdeelcadeautjes: geen losse bord- en kaartspellen'). Een uitdeelpak of multipack (tag 'uitdelen', '12 stuks') mag wel;
       verzamelkaarten (Pokémon-pakjes) zijn geen spel en vallen er niet onder. */
    { naam: 'los-bord-of-kaartspel', test: (p) => R.losSpel(p) && !((p.tags || []).includes('uitdelen')) && !R.uitdeelPak.test(T(p)),
      g: { uitdelen: 40 }, p: {},
      uitleg: 'Een los bord- of kaartspel (UNO, partyspel, spel in een blikje): geen uitdeelcadeautje.',
      voorstel: 'Niet bij Uitdeelcadeautjes; wel bij spellen, Sinterklaas, lootjes en de personen.' },
    /* 20-11-2026 (Marius: 'Volwassen boeken alleen bij oudere tieners als ze geschikt zijn'). Romans met expliciete scènes (Colleen Hoover,
       Sarah J. Maas, Rebecca Yarros, Ana Huang; Common Sense Media: Verity 17+, Hof van versplinterde harmonieën 16+). Voor tieners maakt de site
       geen onderscheid in leeftijd, dus bij tieners onderaan (voor de oudere tieners) en nooit bij kinderen. */
    { naam: 'boek-voor-oudere-tieners', test: (p) => R.volwassenBoek.test(T(p) + ' ' + (p.merk || '')),
      g: { schoen: 60, uitdelen: 60 }, p: { tieners: 15, kinderen: 60, baby: 60 },
      uitleg: 'Een roman voor volwassenen met expliciete scènes: past bij een oudere tiener (vanaf 16), niet bij een jonge tiener of een kind.',
      voorstel: 'Bij tieners onderaan, niet bij kinderen.' },
    /* Alleen wat op Uitdeelcadeautjes kan staan: tot 10 euro, voor kinderen of tieners. */
    { naam: 'los-om-uit-te-delen', zacht: true, test: (p) => !((p.tags || []).includes('uitdelen')) && !R.uitdeelPak.test(T(p)) && typeof p.prijs === 'number' && p.prijs > 5 && p.prijs <= 10 && (p.voor || []).some((v) => /^(kind|kinderen|tiener)$/.test(v)),
      g: { uitdelen: 8 }, p: {},
      uitleg: 'Eén los spel of speeltje van meer dan 5 euro: om uit te delen eerst de multipacks en de kleine dingen.',
      voorstel: 'Bij Uitdeelcadeautjes een paar rijen lager.' }
  ];
  /* Een cadeau met een tekst voor één soort persoon of moment (paginaregels.json smal: pensioen, opa/oma, mama/papa, juf, zwanger,
     geslaagd, beterschap, sorry ...). Op een Voor wie-pagina regelt app.js dat al; hier ook op de gelegenheden: op een gelegenheid die er
     niet bij past staat het niet meer (was: alleen naar onderen). Nova: 'mama-sieraden en opa/oma-boeken bij Afscheid & pensioen'. */
  const PAG_G = { bedankt: 'bedank', afscheid: 'afscheid pensioen', verjaardag: 'verjaardag', jubileum: 'jubileum', housewarming: 'housewarming', beterschap: 'beterschap',
    geslaagd: 'geslaagd', juf: 'juf-meester', moederdag: 'moederdag', vaderdag: 'vaderdag', uitdelen: 'uitdeelcadeautjes', kerst: 'kerst', sinterklaas: 'sinterklaas', valentijn: 'valentijn',
    lootjes: 'lootjes kleine-cadeautjes', schoen: 'schoencadeautjes', grappig: 'grappige-cadeaus' };
  L.push({ naam: 'tekst-voor-ander-moment', test: (p) => !!p.smal && !!smalPag[p.smal],
    gFn: (p, g) => { if (['lootjes', 'schoen', 'grappig', 'kerst', 'sinterklaas'].includes(g)) return 0; /* daar zakt het al naar onderen (app.js smalOnder) */
      /* 20-11-2026 (Nova): een bedankt-mok voor mama of voor opa en oma mag bij Bedankt, maar na de bedankjes die bij iedereen passen. */
      if (g === 'bedankt' && (p.smal === 'ouder' || p.smal === 'grootouder')) return 10;
      const re = smalPag[p.smal]; const woorden = PAG_G[g].split(' '); if (woorden.some((w) => re.test(w))) return 0;
      if (p.smal === 'ouder' || p.smal === 'grootouder') return g === 'verjaardag' ? 15 : 30;
      return 30; },
    pFn: (p, k) => (k === 'opa-oma' && p.smal === 'grootouder') ? -10 : 0, p: {},
    uitleg: 'De tekst op het cadeau is voor een ander moment of iemand anders (mama, opa, pensioen, juf, geslaagd ...).',
    voorstel: 'Alleen op de gelegenheid en bij de persoon waar de tekst over gaat.' });
  return L;
}

/* Alle aftrekken van één product: { g: {gelegenheid: [punten, regel]}, p: {...} }. Bij meer regels voor dezelfde g telt de zwaarste plus de helft van de rest. */
/* Krijgt dit product geen aftrek van de zachte regels? (Atelier Rebul, verkochte producten.) */
function zachtVrij(p) { return VERKOCHT.has(p.id) || ZACHT_VRIJ_MERK.test(T(p)) || /^atelier rebul$/i.test(p.merk || ''); }
function aftrek(p, smalPag, L) {
  L = L || regels(smalPag);
  /* g/p = gewone regels (kunnen een cadeau van een pagina halen); zg/zp = zachte regels (alleen een paar rijen lager, nooit weg). */
  const uit = { g: {}, p: {}, zg: {}, zp: {}, zx: {}, regels: [] };
  const zet = (soort, k, n, naam) => { if (!n) return; const o = uit[soort][k] || (uit[soort][k] = []); o.push([n, naam]); };
  const vrij = zachtVrij(p);
  for (const r of L) {
    if (r.zacht && vrij) continue;
    if (!r.test(p)) continue;
    uit.regels.push(r.naam);
    const z = r.zacht ? 'z' : '';
    for (const g of G) { const n = r.gFn ? r.gFn(p, g) : (r.g[g] || 0); zet(z + 'g', g, n, r.naam); }
    for (const k of PP) zet(z + 'p', k, r.pFn ? r.pFn(p, k) : (r.p[k] || 0), r.naam);
    /* gp: één bepaalde pagina (gelegenheid_ontvanger; leeg = geen). Alleen voor zachte regels. */
    if (r.gp) for (const [k, n] of Object.entries(r.gp)) zet('zx', k, n, r.naam);
  }
  /* Bij meer regels: de zwaarste plus de helft van de rest; een negatief getal (Valentijn bij een cadeau voor een stel) telt helemaal. */
  const som = (lijst) => { const s = lijst.map((x) => x[0]).filter((x) => x > 0).sort((a, b) => b - a); const min = lijst.map((x) => x[0]).filter((x) => x < 0).reduce((a, b) => a + b, 0);
    return (s.length ? s[0] + Math.round(s.slice(1).reduce((a, b) => a + b, 0) / 2) : 0) + min; };
  const kort = {};
  for (const s of ['g', 'p', 'zg', 'zp', 'zx']) for (const k of Object.keys(uit[s])) { const n = som(uit[s][k]); if (n) kort[s + '.' + k] = [n, uit[s][k].map((x) => x[1])]; }
  return { kort, regels: uit.regels };
}
/* Compact voor producten-lean.js: 'g.bedankt40,p.collega20,zg.lootjes8' (aftrek per gelegenheid/ontvanger; z = zacht). */
function compact(kort, vrij) {
  /* Een keuze van Marius (vrij) haalt de aftrek voor die gelegenheid of ontvanger weg, ook in de combinaties (zx.bedankt_hem). */
  const vrijX = (k) => { if (!vrij) return false; const m = /^zx\.([a-z-]*)_([a-z-]*)$/.exec(k); return m ? !!(vrij['g.' + m[1]] || vrij['p.' + m[2]]) : !!vrij[k.replace(/^z/, '')]; };
  return Object.keys(kort).filter((k) => !(kort[k][0] > 0 && vrijX(k))).sort().map((k) => k + kort[k][0]).join(',');
}
/* Score van een product op een pagina met gelegenheid g en ontvanger pe (allebei mag leeg). */
/* Zachte aftrek haalt een cadeau nooit van een pagina: hooguit 10 punten, en nooit onder de 50. */
function score(kort, g, pe) {
  const waarom = []; let hard = 0, zacht = 0;
  for (const [k, z] of [['g.' + g, 0], ['p.' + pe, 0], ['zg.' + g, 1], ['zp.' + pe, 1], ['zx.' + (g || '') + '_' + (pe || ''), 2]]) { const x = kort[k]; if (!x || (z < 2 && k.endsWith('.'))) continue; if (z) zacht += x[0]; else hard += x[0]; waarom.push(...x[1]); }
  let s = 75 - hard - (zacht > 0 ? Math.min(zacht, 10) : 0);
  if (hard < 26) s = Math.max(s, 50);
  return { score: Math.min(75, Math.max(0, s)), regels: [...new Set(waarom)] };
}
/* Welke gelegenheid en ontvanger hoort bij een adres? Zelfde als kmCtx in app.js. */
function context(pad) {
  const [pd, q] = String(pad).split('?'); const d = pd.split('/').filter(Boolean); const voor = q && (/(?:^|&)voor=([^&]+)/.exec(q) || [])[1];
  const GMAP = { bedankt: 'bedankt', 'afscheid-pensioen': 'afscheid', verjaardag: 'verjaardag', jubileum: 'jubileum', housewarming: 'housewarming', beterschap: 'beterschap',
    geslaagd: 'geslaagd', 'juf-meester': 'juf', moederdag: 'moederdag', vaderdag: 'vaderdag', uitdeelcadeautjes: 'uitdelen' };
  const SUBG = { bedankje: 'bedankt', 'afscheid-pensioen': 'afscheid', lootjes: 'lootjes' };
  const CG = { 'grappige-cadeaus': 'grappig', 'kleine-cadeautjes': 'lootjes', schoencadeautjes: 'schoen', 'op-tijd-voor-pakjesavond': 'sinterklaas' };
  const CC = { kerst: 'kerst', sinterklaas: 'sinterklaas', 'sint-onder-10': 'sinterklaas', 'sint-onder-15': 'sinterklaas', 'onder-10': 'lootjes', 'onder-15': 'lootjes', grappig: 'grappig', schoencadeautjes: 'schoen', collega: '', 'voor-kinderen': '', 'voor-haar': '', 'voor-hem': '', 'opa-oma': '', 'baby-kraam': '', valentijn: 'valentijn' };
  const CP = { collega: 'collega', 'voor-kinderen': 'kinderen', 'voor-haar': 'haar', 'voor-hem': 'hem', 'opa-oma': 'opa-oma', 'baby-kraam': 'baby', schoencadeautjes: 'kinderen' };
  let g = '', pe = '';
  if (d[0] === 'voor') { pe = d[1] || ''; g = SUBG[d[2]] || ''; }
  else if (d[0] === 'gelegenheid') { g = GMAP[d[1]] || ''; pe = d[2] || ''; }
  else if (d[0] === 'collectie') { g = CG[d[1]] || ''; pe = d[2] || ''; }
  else if (d[0] === 'c' && d[1] === 'cadeaus') { g = CC[d[2]] || ''; pe = CP[d[2]] || ''; }
  else if (d[0] === 'c' && d[1] === 'valentijn') g = 'valentijn';
  if (voor) pe = voor === 'kind' ? 'kinderen' : voor;
  if (pe && PP.indexOf(pe) === -1) pe = '';
  return { g, pe };
}
module.exports = { G, PP, R, BEDANK_BEWIJS, VERKOCHT, zachtVrij, regels, aftrek, compact, score, context };
