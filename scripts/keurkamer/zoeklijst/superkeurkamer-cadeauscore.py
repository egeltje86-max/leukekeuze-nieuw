# -*- coding: utf-8 -*-
"""Cadeau-stoplicht voor de Superkeurkamer (28-11-2026).

Marius: 'niet ieder winkelproduct is een goed cadeau'. Per product een cijfer van 0 tot 100 en een kleur:
  groen  = lijkt op wat je eerder koos of op de site liet staan
  oranje = twijfel
  rood   = lijkt op wat je weggooide, of het is geen cadeau (vaste regel, met de reden erbij)

Twee lagen:
  1. Vaste regels: soorten die geen cadeau zijn (powerbank, airfryer, onderdelen, kleding in maten ...). Altijd rood, met de reden.
  2. Leren van jouw keuzes: woorden in de naam, het merk, de winkel en de prijs, uit
       - wat je in de Superkeurkamer koos (ook oude lijsten in 'reservekopie' en 'bewaard-*.json')   -> ja
       - wat op leukekeuze.nl staat (goedgekeurd)                                                  -> ja (lichter)
       - wat je van de site haalde (afgekeurd)                                                      -> nee
     Naive Bayes met afvlakking: elk woord krijgt een gewicht, het product de som (gemiddeld, zodat lange namen niet winnen).

Alleen advies: de keurkamer zet rood onderaan bij 'beste eerst', maar haalt niets weg.
"""
import json, math, os, re, unicodedata, time
from collections import Counter

STOP = set('de het een en van voor met in op je jouw jij u uw te om aan bij of als die dat dit deze zijn is ook tot uit naar over door per '
           'the and for with to of a an by from your you on at x st stuks stuk pcs pc cm mm nl be'.split())

# 1. Vaste regels: (woord-regex, reden). Komt het in de naam voor, dan is het rood. Stuk voor stuk uit de WEG-rondes van Marius
#    ('geen cadeau', 24-11-2026) en de keurmeester. Uitzonderingen in NIET_ROOD (dan wel een cadeau, bv. een grappige powerbank-knuffel).
REGELS = [
    (r'\bpowerbank', 'powerbank (geen cadeau)'),
    (r'\b(oplaadkabel|usb[- ]?kabel|usb[- ]?c kabel|hdmi[- ]?kabel|verlengkabel|oplader|laadkabel|adapter|stekkerdoos)\b', 'kabel of oplader'),
    (r'\b(telefoonhouder|autohouder|screen ?protector|screenprotector|beschermglas|tempered glass)\b', 'telefoonaccessoire'),
    (r'\b(vuurkorf|vuurschaal|terrasverwarmer)\b', 'vuurkorf of terrasverwarmer'),
    (r'\b(hondenmand|kattenmand|hondenkussen|krabpaal|kattenbak|kattenluik|hondenhok|kennel|hondenriem|halsband|voerbak|drinkbak)\b', 'dierenspullen'),
    (r'\b(fietsbel|fietspomp|fietsslot|bagagedrager|spatbord|binnenband|buitenband|fietsstandaard|fietsverlichting|kettingslot)\b', 'fietsonderdeel'),
    (r'\b(dartflights|dartshafts|dartpunten|soft ?tips|steeltips|dartmat|surround ring)\b', 'dartonderdeel'),
    (r'\b(airfryer|heteluchtfriteuse|friteuse|keukenmachine|staafmixer|blender|waterkoker|broodrooster|tosti ?ijzer|wafelijzer|stoomoven|magnetron|vaatwasser|wasmachine|droger|koelkast|vriezer|inductie|kookplaat)\b', 'keukenapparaat'),
    (r'\b(koffiemachine|espressomachine|koffiezetapparaat|koffiezetter|melkopschuimer|koffiecapsules|nespresso capsules|dolce gusto capsules|koffiepads)\b', 'koffieapparaat of capsules'),
    (r'\b(koekenpan|braadpan|hapjespan|pannenset|wokpan|steelpan|snelkookpan|kookpan)\b', 'pan'),
    (r'\b(bakvorm|bakplaat|taartvorm|muffinvorm|springvorm|bakblik|cakevorm|bakmat)\b', 'bakspullen'),
    (r'\b(servies|bordenset|dinerborden|ontbijtborden|schaaltjesset|bestekset|bestekbak)\b', 'servies of bestek'),
    (r'\b(boormachine|accuboormachine|schroefmachine|klopboormachine|decoupeerzaag|cirkelzaag|haakse slijper|schuurmachine|multitool oscillerend|bits ?set|boren ?set|zaagblad)\b', 'gereedschap'),
    (r'\b(grasmaaier|heggenschaar|bladblazer|hogedrukreiniger|grastrimmer|kettingzaag|tuinslang|regenton|kruiwagen|tuinstoel|tuintafel|parasol|loungeset)\b', 'tuinmachine of tuinmeubel'),
    (r'\b(robotstofzuiger|stofzuiger|steelstofzuiger|dweilrobot|luchtontvochtiger|luchtbevochtiger|luchtreiniger|ventilator|kachel|radiator|thermostaat)\b', 'huishoudapparaat'),
    (r'\b(tandenborstel|monddouche|flosser|opzetborstels?|scheerapparaat|scheerkoppen|trimmer|tondeuse|epilator|ladyshave|fohn|fohnborstel|stijltang|krultang)\b', 'verzorgingsapparaat'),
    (r'\b(trolley|handbagagekoffer|kofferset|reiskoffer|harde koffer|spinner koffer|ruimbagage)\b', 'koffer'),
    (r'\b(vloerkleed|tapijt|deurmat binnen|loper|matras|topper|kussensloop|hoeslaken|dekbedovertrek|gordijn|vitrage|rolgordijn|jaloezie|plisse)\b', 'woontextiel of raamdecoratie'),
    (r'\b(losse gloeilamp|led ?lamp e27|e27 fitting|gu10|ledstrip ?voeding|lichtschakelaar|stopcontact|wandcontactdoos)\b', 'lamp of elektra-onderdeel'),
    (r'\b(reserveonderdeel|vervangende|vervangingsset|navulling|refill|cartridge|toner|inktpatroon|onderdelenset)\b', 'onderdeel of navulling'),
    (r'\b(sneakers?|laarzen|boots|pumps|sandalen|slippers|instappers|veterschoenen)\b', 'schoenen in maten'),
    (r'\b(spijkerbroek|jeans|pantalon|chino|legging|jurk|blouse|overhemd|colbert|blazer|winterjas|parka|bodywarmer|ondergoed|boxershorts|beha|bh|string|panty)\b', 'kleding in maten'),
    (r'\bmaat (xs|s|m|l|xl|xxl|\d{2,3})\b', 'kleding in maten'),
    (r'\b(wapen|kruisboog|vlindermes|stiletto|boksbeugel|werpster|springmes|luchtbuks|airsoft)\b', 'wapen'),
    (r'\b(sexy|erotisch|erotiek|vibrator|seksspel|penis|piemel)\b', 'erotiek'),
]
NIET_ROOD = re.compile(r'\b(knuffel|pluche|grappig|cadeauset|giftset|geschenkset|cadeaudoos|kinder|speelgoed|lego|playmobil|pantoffel|slof|sloffen|onesie|badjas|kerst|mini|warmte\w*|lavendel|nachtlampje|lamp|wekker)\b')
REGELS_C = [(re.compile(r), w) for r, w in REGELS]


def plat(s):
    s = unicodedata.normalize('NFKD', str(s or '')).encode('ascii', 'ignore').decode('ascii').lower()
    return re.sub(r'[^a-z0-9]+', ' ', s).strip()


def regel(titel):
    """Geeft de reden als het product volgens de vaste regels geen cadeau is, anders ''."""
    t = ' ' + plat(titel) + ' '
    for r, w in REGELS_C:
        if r.search(t):
            if NIET_ROOD.search(t) and w not in ('wapen', 'erotiek', 'onderdeel of navulling'):
                return ''
            return w
    return ''


def winkel_kern(w):
    return re.sub(r'[^a-z0-9]', '', plat(w).replace(' nl', '').replace(' be', ''))


def prijsband(p):
    try:
        p = float(p or 0)
    except Exception:
        return 'p?'
    for g, n in ((5, 'p<5'), (10, 'p<10'), (15, 'p<15'), (25, 'p<25'), (40, 'p<40'), (60, 'p<60'), (100, 'p<100'), (200, 'p<200')):
        if p < g:
            return n
    return 'p200+'


def stam(w):
    """Grof enkelvoud: knisperboekjes -> knisperboekje, knuffels -> knuffel, lampen -> lamp."""
    if w.endswith('jes'):
        return w[:-1]
    if len(w) > 4 and w.endswith('s') and not w.endswith('ss'):
        return w[:-1]
    if len(w) > 5 and w.endswith('en'):
        return w[:-2]
    return w


def tokens(titel, merk='', winkel='', prijs=None):
    w = [stam(x) for x in plat(titel).split() if len(x) >= 3 and x not in STOP and not x.isdigit()]
    uit = set(w)
    # twee woorden achter elkaar ('harry potter', 'lego technic') zeggen vaak meer dan los
    uit |= {a + '_' + b for a, b in zip(w, w[1:])}
    # alleen de naam: winkel, merk en prijs kennen we niet van elk product op de site, dan zou bv. 'bol' alleen als 'ja' tellen
    return uit


class Model:
    def __init__(self):
        self.ja, self.nee = Counter(), Counter()
        self.nja = self.nnee = 0.0
        self.gemaakt = 0
        self.bronnen = {}

    def leer(self, toks, ja, gewicht=1.0):
        c = self.ja if ja else self.nee
        for t in toks:
            c[t] += gewicht
        if ja:
            self.nja += gewicht
        else:
            self.nnee += gewicht

    def klaar(self):
        a = 1.0
        V = len(set(self.ja) | set(self.nee)) or 1
        self.lo = {}
        for t in set(self.ja) | set(self.nee):
            j, n = self.ja.get(t, 0), self.nee.get(t, 0)
            if j + n < 3:                                     # een of twee keer gezien zegt niets
                continue
            pj = (j + a) / (self.nja + a * 2)
            pn = (n + a) / (self.nnee + a * 2)
            # een woord dat we weinig zagen telt minder mee ('zeg', 'waar' in een boektitel zeggen niets)
            self.lo[t] = max(-3.0, min(3.0, math.log(pj / pn))) * min(1.0, (j + n) / 12.0)
        self.prior = math.log((self.nja + 1) / (self.nnee + 1))
        self.gemaakt = time.time()

    def cijfer(self, titel, merk='', winkel='', prijs=None):
        """0 tot 100, plus de woorden die het meest meetelden (voor de uitleg)."""
        ts = tokens(titel, merk, winkel, prijs)
        bijdr = [(self.lo[t], t) for t in ts if t in self.lo]
        if not bijdr:
            return 55, []
        s = sum(x for x, _ in bijdr) / math.sqrt(len(bijdr)) + 0.3 * self.prior
        p = 1 / (1 + math.exp(-s))
        bijdr.sort()
        return int(round(100 * p)), bijdr

    def bewaar(self, pad):
        json.dump({'lo': self.lo, 'prior': self.prior, 'gemaakt': self.gemaakt, 'bronnen': self.bronnen}, open(pad + '.tmp', 'w', encoding='utf-8'))
        os.replace(pad + '.tmp', pad)

    @classmethod
    def laad(cls, pad):
        d = json.load(open(pad, encoding='utf-8'))
        m = cls()
        m.lo, m.prior, m.gemaakt, m.bronnen = d['lo'], d['prior'], d['gemaakt'], d.get('bronnen', {})
        return m


def kleur(cijfer, reden):
    if reden:
        # een vaste regel maakt het rood, behalve als het verder sterk lijkt op wat Marius koos: dan twijfel (oranje), met de reden erbij
        return 'oranje' if cijfer >= 62 else 'rood'
    return 'groen' if cijfer >= 62 else ('oranje' if cijfer >= 36 else 'rood')


def leesbaar(bijdr, n=3):
    """De woorden die het meest voor en tegen telden, in gewone taal."""
    def mooi(t):
        if t.startswith('w:'):
            return 'winkel ' + t[2:]
        if t.startswith('m:'):
            return 'merk ' + t[2:]
        if t.startswith('p'):
            return {'p<5': 'onder € 5', 'p<10': 'onder € 10', 'p<15': 'onder € 15', 'p<25': 'onder € 25', 'p<40': 'onder € 40', 'p<60': 'onder € 60',
                    'p<100': 'onder € 100', 'p<200': 'onder € 200', 'p200+': 'boven € 200'}.get(t, t)
        return "'" + t.replace('_', ' ') + "'"
    tegen = [mooi(t) for x, t in bijdr if x < -0.4][:n]
    voor = [mooi(t) for x, t in reversed(bijdr) if x > 0.4][:n]
    return voor, tegen


def train(site_alle, keuze_bestanden):
    """site_alle: lijst {t, m, p, w, s, sm}; keuze_bestanden: paden naar json met {'producten': [...]}."""
    m = Model()
    gezien = set()
    nk = 0
    for f in keuze_bestanden:
        try:
            d = json.load(open(f, encoding='utf-8'))
        except Exception:
            continue
        for x in d.get('producten', []):
            k = plat(x.get('titel'))
            if not k or k in gezien:
                continue
            gezien.add(k)
            m.leer(tokens(x.get('titel'), x.get('merk'), x.get('winkel') or x.get('partner'), x.get('prijs')), True, 2.0)
            nk += 1
    nj = nn = 0
    for x in site_alle:
        if x.get('sm') or x.get('s') == 'samengevoegd':
            continue
        if x.get('s') == 'goedgekeurd':
            m.leer(tokens(x['t'], x.get('m'), x.get('w'), x.get('p')), True, 1.0); nj += 1
        elif x.get('s') == 'afgekeurd':
            m.leer(tokens(x['t'], x.get('m'), x.get('w'), x.get('p')), False, 1.6); nn += 1
    m.bronnen = {'keuzes': nk, 'site_ja': nj, 'site_nee': nn}
    m.klaar()
    return m
