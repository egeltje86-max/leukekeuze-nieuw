# (zoekwoord-regex, nette naam, groep). Langste/specifiekste eerst; eerste treffer in de titel wint.
D = [
 # huisdieren - honden
 (r'duitse herder','Duitse herder','huisdieren'),(r'australische herder','Australische herder','huisdieren'),(r'herder','Herdershond','huisdieren'),
 (r'border collie','Border collie','huisdieren'),(r'golden retriever','Golden retriever','huisdieren'),(r'labrador','Labrador','huisdieren'),
 (r'berner sennen','Berner sennen','huisdieren'),(r'border terri','Border terrier','huisdieren'),(r'boston terri','Boston terrier','huisdieren'),(r'yorkshire','Yorkshire terrier','huisdieren'),
 (r'jack russel','Jack russell','huisdieren'),(r'west highland|westie','Westie','huisdieren'),(r'terri[eë]r','Terrier','huisdieren'),
 (r'franse bulldog','Franse bulldog','huisdieren'),(r'engelse bulldog|britse bulldog','Engelse bulldog','huisdieren'),(r'bulldog','Bulldog','huisdieren'),
 (r'chihuahua','Chihuahua','huisdieren'),(r'teckel','Teckel','huisdieren'),(r'beagle','Beagle','huisdieren'),(r'dalmati','Dalmatiër','huisdieren'),
 (r'poedel','Poedel','huisdieren'),(r'pomeranian|keeshond','Pomeranian','huisdieren'),(r'husky','Husky','huisdieren'),(r'corgi','Corgi','huisdieren'),
 (r'shih ?tzu','Shih tzu','huisdieren'),(r'chow ?chow','Chowchow','huisdieren'),(r'boxer','Boxer','huisdieren'),(r'cocker|cockerpoo|spaniel','Spaniël','huisdieren'),
 (r'mopshond|\bmops\b|\bpug\b','Mopshond','huisdieren'),(r'sint bernard','Sint-bernard','huisdieren'),(r'puppy|pup\b','Puppy','huisdieren'),(r'\bhond(je|en)?\b','Hond','huisdieren'),
 # huisdieren - overig
 (r'perzische kat','Perzische kat','huisdieren'),(r'kitten|katje','Kitten','huisdieren'),(r'\bkat\b|\bpoes\b|katten','Kat','huisdieren'),
 (r'cavia','Cavia','huisdieren'),(r'hamster','Hamster','huisdieren'),(r'\bfret\b','Fret','huisdieren'),(r'\bmuis\b|muisje|muizen','Muis','huisdieren'),(r'\brat\b','Rat','huisdieren'),
 (r'hangoor','Hangoorkonijn','huisdieren'),(r'konijn|konijntje','Konijn','huisdieren'),
 # boerderij
 (r'lammetje|\blam\b','Lammetje','boerderij'),(r'schaap|schapen','Schaap','boerderij'),(r'kalf|kalfje','Kalfje','boerderij'),(r'\bkoe\b|koeien','Koe','boerderij'),
 (r'pony','Pony','boerderij'),(r'veulen','Veulen','boerderij'),(r'paard','Paard','boerderij'),(r'\bezel','Ezel','boerderij'),(r'kuiken','Kuiken','boerderij'),
 (r'\bhaan\b','Haan','boerderij'),(r'\bkip\b|kippen','Kip','boerderij'),(r'geit|\bbok\b','Geit','boerderij'),(r'biggetje|\bbig\b','Biggetje','boerderij'),(r'varken','Varken','boerderij'),
 (r'alpaca|\blama\b','Alpaca','boerderij'),(r'\bhaas\b','Haas','boerderij'),(r'\beend(je|jes)?\b','Eend','boerderij'),(r'\bgans\b','Gans','boerderij'),
 # bos
 (r'vliegende eekhoorn','Vliegende eekhoorn','bos'),(r'eekhoorn','Eekhoorn','bos'),(r'\begel','Egel','bos'),(r'hertje|\bhert\b|\bree\b|reekalf','Hert','bos'),(r'eland','Eland','pool'),
 (r'rendier','Rendier','pool'),(r'wasbeer','Wasbeer','bos'),(r'\bdas\b','Das','bos'),(r'marter','Marter','bos'),(r'hermelijn','Hermelijn','bos'),(r'wild zwijn|zwijn','Wild zwijn','bos'),
 (r'\blynx\b','Lynx','bos'),(r'poolvos','Poolvos','pool'),(r'woestijnvos|fennec','Woestijnvos','safari'),(r'\bvos\b|vosje|vossen','Vos','bos'),(r'poolwolf','Poolwolf','pool'),
 (r'\bwolf\b|wolven','Wolf','bos'),(r'\bmol\b','Mol','bos'),(r'stinkdier','Stinkdier','bos'),(r'marmot','Marmot','bos'),(r'vleermuis','Vleermuis','bos'),
 # beren
 (r'rode panda','Rode panda','beren'),(r'panda','Panda','beren'),(r'ijsbeer|ijsberen','IJsbeer','pool'),(r'koala','Koala','beren'),
 (r'teddy|knuffelbe(e|ren)r|\bbeertje\b','Teddybeer','beren'),(r'bruine beer|grizzly','Bruine beer','beren'),(r'zwarte beer','Zwarte beer','beren'),(r'\bbeer\b|beren','Beer','beren'),
 # pool
 (r'koningspinguin|konings pinguin','Koningspinguïn','pool'),(r'keizerspinguin|keizers pinguin','Keizerspinguïn','pool'),(r'pingu[iï]n','Pinguïn','pool'),
 (r'walrus','Walrus','pool'),(r'sneeuwuil','Sneeuwuil','pool'),(r'zeehond','Zeehond','zee'),(r'zeeleeuw','Zeeleeuw','zee'),
 # safari
 (r'sneeuwluipaard|sneeuw luipaard','Sneeuwluipaard','safari'),(r'jachtluipaard|cheetah','Jachtluipaard','safari'),(r'luipaard','Luipaard','safari'),(r'jaguar','Jaguar','safari'),
 (r'zwarte panter|panter','Panter','safari'),(r'witte tijger','Witte tijger','safari'),(r'sabeltand','Sabeltandtijger','dino'),(r'tijger','Tijger','safari'),(r'leeuw','Leeuw','safari'),
 (r'giraf','Giraf','safari'),(r'olifant','Olifant','safari'),(r'neushoorn','Neushoorn','safari'),(r'nijlpaard','Nijlpaard','safari'),(r'zebra','Zebra','safari'),(r'okapi','Okapi','safari'),
 (r'stokstaart','Stokstaartje','safari'),(r'hyena|wilde hond','Hyena','safari'),(r'gorilla','Gorilla','safari'),(r'orang','Orang-oetan','safari'),(r'chimpansee','Chimpansee','safari'),
 (r'gibbon','Gibbon','safari'),(r'ringstaart|maki|lemur','Ringstaartmaki','safari'),(r'luiaard','Luiaard','safari'),(r'\baap\b|aapje|apen','Aap','safari'),
 (r'kangoeroe','Kangoeroe','safari'),(r'wombat','Wombat','safari'),(r'vogelbekdier','Vogelbekdier','safari'),(r'miereneter','Miereneter','safari'),(r'gordeldier|armadillo','Gordeldier','safari'),
 (r'bizon|buffel','Bizon','safari'),(r'kameel|dromedaris','Kameel','safari'),(r'tapir','Tapir','safari'),(r'capibara|capybara','Capibara','safari'),(r'aardvarken','Aardvarken','safari'),
 # zee en water
 (r'hamerhaai','Hamerhaai','zee'),(r'walvishaai','Walvishaai','zee'),(r'witte haai','Witte haai','zee'),(r'\bhaai','Haai','zee'),(r'orka','Orka','zee'),(r'bultrug','Bultrug','zee'),
 (r'beluga','Beluga','zee'),(r'vinvis|walvis','Walvis','zee'),(r'dolfijn','Dolfijn','zee'),(r'bruinvis','Bruinvis','zee'),(r'adelaarsrog|manta|\brog\b|roggen','Rog','zee'),
 (r'octopus|inktvis','Octopus','zee'),(r'clownvis','Clownvis','zee'),(r'zeepaard','Zeepaardje','zee'),(r'kreeft','Kreeft','zee'),(r'\bkrab\b','Krab','zee'),(r'kwal','Kwal','zee'),
 (r'zeeschildpad','Zeeschildpad','zee'),(r'zee ?otter|\botter','Otter','zee'),(r'\bbever','Bever','zee'),(r'boomkikker|kikker','Kikker','zee'),(r'axolotl','Axolotl','zee'),(r'zeester','Zeester','zee'),
 # vogels
 (r'oehoe','Oehoe','vogels'),(r'kerkuil','Kerkuil','vogels'),(r'\buil','Uil','vogels'),(r'flamingo','Flamingo','vogels'),(r'ara\b|macaw','Ara','vogels'),(r'kaketoe','Kaketoe','vogels'),
 (r'papegaai|papagaai','Papegaai','vogels'),(r'parkiet','Parkiet','vogels'),(r'toekan','Toekan','vogels'),(r'zeearend|adelaar|arend','Arend','vogels'),(r'havik','Havik','vogels'),
 (r'valk','Valk','vogels'),(r'\bgier','Gier','vogels'),(r'ooievaar','Ooievaar','vogels'),(r'struisvogel|emoe','Struisvogel','vogels'),(r'\bpauw','Pauw','vogels'),(r'dodo','Dodo','vogels'),
 (r'kiwi','Kiwi','vogels'),(r'roodborst','Roodborstje','vogels'),(r'pimpelmees|koolmees|\bmees','Mees','vogels'),(r'ijsvogel','IJsvogel','vogels'),(r'mus\b|huismus','Mus','vogels'),
 (r'\bduif','Duif','vogels'),(r'meeuw','Meeuw','vogels'),(r'ekster','Ekster','vogels'),(r'kraai|raaf','Raaf','vogels'),(r'zwaan','Zwaan','vogels'),(r'reiger','Reiger','vogels'),
 (r'papegaaiduiker','Papegaaiduiker','vogels'),(r'kolibri','Kolibrie','vogels'),(r'\bvink','Vink','vogels'),(r'putter','Putter','vogels'),(r'nachtegaal','Nachtegaal','vogels'),(r'blauwborst','Blauwborst','vogels'),
 # dino en reptielen
 (r't-?rex','T-rex','dino'),(r'triceratops','Triceratops','dino'),(r'stego','Stegosaurus','dino'),(r'brachio|diplodocus|brontosaurus|apatosaurus','Langnekdino','dino'),
 (r'velociraptor|raptor','Velociraptor','dino'),(r'pterosaurus|pteranodon','Pterosaurus','dino'),(r'plesiosaurus','Plesiosaurus','dino'),(r'mammoet','Mammoet','dino'),(r'dino','Dinosaurus','dino'),
 (r'krokodil|alligator','Krokodil','dino'),(r'python|anaconda|cobra|boa\b|adder|slang','Slang','dino'),(r'leguaan','Leguaan','dino'),(r'kameleon','Kameleon','dino'),(r'gekko|hagedis','Hagedis','dino'),
 (r'schildpad','Schildpad','dino'),
 # fantasie
 (r'eenhoorn|unicorn','Eenhoorn','fantasie'),(r'draak|draken','Draak','fantasie'),(r'pegasus','Pegasus','fantasie'),(r'feniks|phoenix','Feniks','fantasie'),
 # insecten
 (r'tarantula|vogelspin','Vogelspin','insecten'),(r'\bspin\b|spinnen|kruisspin','Spin','insecten'),(r'honingbij|\bbij\b|bijen','Bij','insecten'),(r'wesp','Wesp','insecten'),(r'vlinder','Vlinder','insecten'),
 (r'lieveheersbeest','Lieveheersbeestje','insecten'),(r'libelle','Libelle','insecten'),(r'rups','Rups','insecten'),(r'slak','Slak','insecten'),(r'schorpioen','Schorpioen','insecten'),
 (r'bidsprinkhaan','Bidsprinkhaan','insecten'),(r'kever','Kever','insecten'),(r'duizendpoot','Duizendpoot','insecten'),
]
GROEPNAAM = {'huisdieren': 'Honden, katten en huisdieren', 'boerderij': 'Boerderijdieren', 'bos': 'Bosdieren', 'beren': 'Beren, panda\'s en koala\'s', 'pool': 'Pooldieren',
  'safari': 'Safari- en junglediertjes', 'zee': 'Zee- en waterdieren', 'vogels': 'Vogels', 'dino': 'Dino\'s en reptielen', 'fantasie': 'Eenhoorns en draken', 'insecten': 'Insecten en kriebelbeestjes'}
