export type MarketProduct={id:string;fr:string;ar:string;emoji:string;note?:string};
export type MarketDepartment={id:string;fr:string;ar:string;description:string;emoji:string;kind:"shelf"|"basket";products:MarketProduct[]};
export type MarketDialogueLine={speaker:"Le vendeur"|"La cliente"|"Le client";fr:string;ar:string};
export type MarketConversation={id:string;title:string;ar:string;summary:string;lines:MarketDialogueLine[]};

export const marketDepartments:MarketDepartment[]=[
 {id:"dairy",fr:"Les produits laitiers",ar:"الأجبان والألبان",description:"الحليب والأجبان ومشتقات الألبان اليومية.",emoji:"🧀",kind:"shelf",products:[
  {id:"milk",fr:"le lait",ar:"الحليب",emoji:"🥛"},{id:"yogurt",fr:"le yaourt",ar:"الزبادي",emoji:"🥣"},{id:"butter",fr:"le beurre",ar:"الزبدة",emoji:"🧈"},{id:"cream",fr:"la crème",ar:"القشطة",emoji:"🥛"},{id:"cheese",fr:"le fromage",ar:"الجبن",emoji:"🧀"},{id:"goat-cheese",fr:"le fromage de chèvre",ar:"جبن الماعز",emoji:"🧀"},{id:"mozzarella",fr:"la mozzarella",ar:"جبن موزاريلا",emoji:"⚪"},{id:"eggs",fr:"les œufs",ar:"البيض",emoji:"🥚"},{id:"fresh-cheese",fr:"le fromage frais",ar:"الجبن الطازج",emoji:"🧀"},{id:"whipped-cream",fr:"la crème fouettée",ar:"الكريمة المخفوقة",emoji:"🍦"}
 ]},
 {id:"bakery",fr:"La boulangerie",ar:"المخبوزات",description:"أنواع الخبز والمخبوزات الفرنسية.",emoji:"🥖",kind:"shelf",products:[
  {id:"baguette",fr:"la baguette",ar:"خبز الباغيت",emoji:"🥖"},{id:"bread",fr:"le pain",ar:"الخبز",emoji:"🍞"},{id:"toast",fr:"le pain de mie",ar:"خبز التوست",emoji:"🍞"},{id:"croissant",fr:"le croissant",ar:"الكرواسون",emoji:"🥐"},{id:"brioche",fr:"la brioche",ar:"خبز البريوش",emoji:"🍞"},{id:"roll",fr:"le petit pain",ar:"رغيف صغير",emoji:"🥯"},{id:"cake",fr:"le gâteau",ar:"الكعكة",emoji:"🍰"},{id:"tart",fr:"la tarte",ar:"الفطيرة",emoji:"🥧"}
 ]},
 {id:"meat",fr:"Les viandes",ar:"اللحوم",description:"أسماء اللحوم والدواجن الشائعة.",emoji:"🥩",kind:"shelf",products:[
  {id:"beef",fr:"le bœuf",ar:"لحم البقر",emoji:"🥩"},{id:"lamb",fr:"l’agneau",ar:"لحم الغنم",emoji:"🍖"},{id:"chicken",fr:"le poulet",ar:"الدجاج",emoji:"🍗"},{id:"turkey",fr:"la dinde",ar:"الديك الرومي",emoji:"🦃"},{id:"minced",fr:"la viande hachée",ar:"اللحم المفروم",emoji:"🥩"},{id:"steak",fr:"le steak",ar:"شريحة اللحم",emoji:"🥩"},{id:"sausage",fr:"la saucisse",ar:"النقانق",emoji:"🌭"},{id:"veal",fr:"le veau",ar:"لحم العجل",emoji:"🍖"},{id:"duck",fr:"le canard",ar:"لحم البط",emoji:"🍗"}
 ]},
 {id:"seafood",fr:"Les poissons et fruits de mer",ar:"الأسماك والمأكولات البحرية",description:"الأسماك والمحار والمأكولات البحرية.",emoji:"🐟",kind:"shelf",products:[
  {id:"fish",fr:"le poisson",ar:"السمك",emoji:"🐟"},{id:"salmon",fr:"le saumon",ar:"السلمون",emoji:"🐟"},{id:"tuna",fr:"le thon",ar:"التونة",emoji:"🐟"},{id:"sardine",fr:"la sardine",ar:"السردين",emoji:"🐟"},{id:"shrimp",fr:"les crevettes",ar:"الروبيان",emoji:"🦐"},{id:"crab",fr:"le crabe",ar:"سرطان البحر",emoji:"🦀"},{id:"lobster",fr:"le homard",ar:"جراد البحر",emoji:"🦞"},{id:"octopus",fr:"le poulpe",ar:"الأخطبوط",emoji:"🐙"}
 ]},
 {id:"grains",fr:"Les céréales et légumineuses",ar:"الحبوب والبقوليات",description:"الحبوب والبقول المستخدمة في الوجبات اليومية.",emoji:"🌾",kind:"shelf",products:[
  {id:"rice",fr:"le riz",ar:"الأرز",emoji:"🍚"},{id:"oats",fr:"l’avoine",ar:"الشوفان",emoji:"🌾"},{id:"wheat",fr:"le blé",ar:"القمح",emoji:"🌾"},{id:"lentils",fr:"les lentilles",ar:"العدس",emoji:"🫘"},{id:"beans",fr:"les haricots secs",ar:"الفاصوليا المجففة",emoji:"🫘"},{id:"chickpeas",fr:"les pois chiches",ar:"الحمص",emoji:"🫘"},{id:"corn",fr:"le maïs",ar:"الذرة",emoji:"🌽"},{id:"cereal",fr:"les céréales",ar:"حبوب الإفطار",emoji:"🥣"}
 ]},
 {id:"pantry",fr:"Les produits de base",ar:"المواد الأساسية",description:"مكونات أساسية موجودة في كل مطبخ.",emoji:"🫙",kind:"shelf",products:[
  {id:"pasta",fr:"les pâtes",ar:"المعكرونة",emoji:"🍝"},{id:"flour",fr:"la farine",ar:"الدقيق",emoji:"🌾"},{id:"sugar",fr:"le sucre",ar:"السكر",emoji:"🧂"},{id:"salt",fr:"le sel",ar:"الملح",emoji:"🧂"},{id:"oil",fr:"l’huile",ar:"الزيت",emoji:"🫗"},{id:"olive-oil",fr:"l’huile d’olive",ar:"زيت الزيتون",emoji:"🫒"},{id:"honey",fr:"le miel",ar:"العسل",emoji:"🍯"},{id:"vinegar",fr:"le vinaigre",ar:"الخل",emoji:"🫗"},{id:"pepper",fr:"le poivre",ar:"الفلفل الأسود",emoji:"🧂"},{id:"semolina",fr:"la semoule",ar:"السميد",emoji:"🌾"}
 ]},
 {id:"preserves",fr:"Les conserves, sauces et épices",ar:"المعلبات والصلصات والتوابل",description:"معلبات وصلصات وتوابل لتنويع الطعام.",emoji:"🥫",kind:"shelf",products:[
  {id:"tomato-can",fr:"les tomates en conserve",ar:"الطماطم المعلبة",emoji:"🥫"},{id:"tuna-can",fr:"le thon en conserve",ar:"التونة المعلبة",emoji:"🥫"},{id:"peas-can",fr:"les petits pois en conserve",ar:"البازلاء المعلبة",emoji:"🥫"},{id:"ketchup",fr:"le ketchup",ar:"الكاتشب",emoji:"🍅"},{id:"mustard",fr:"la moutarde",ar:"الخردل",emoji:"🟡"},{id:"mayonnaise",fr:"la mayonnaise",ar:"المايونيز",emoji:"⚪"},{id:"cinnamon",fr:"la cannelle",ar:"القرفة",emoji:"🪵"},{id:"cumin",fr:"le cumin",ar:"الكمون",emoji:"🧂"},{id:"paprika",fr:"le paprika",ar:"البابريكا",emoji:"🌶️"},{id:"jam",fr:"la confiture",ar:"المربى",emoji:"🫙"}
 ]},
 {id:"drinks",fr:"Les boissons",ar:"المشروبات",description:"مشروبات باردة وساخنة شائعة.",emoji:"🧃",kind:"shelf",products:[
  {id:"water",fr:"l’eau",ar:"الماء",emoji:"💧"},{id:"sparkling",fr:"l’eau gazeuse",ar:"الماء الفوّار",emoji:"🫧"},{id:"orange-juice",fr:"le jus d’orange",ar:"عصير البرتقال",emoji:"🍊"},{id:"apple-juice",fr:"le jus de pomme",ar:"عصير التفاح",emoji:"🧃"},{id:"tea",fr:"le thé",ar:"الشاي",emoji:"🍵"},{id:"coffee",fr:"le café",ar:"القهوة",emoji:"☕"},{id:"hot-chocolate",fr:"le chocolat chaud",ar:"الشوكولاتة الساخنة",emoji:"☕"},{id:"lemonade",fr:"la limonade",ar:"الليمونادة",emoji:"🍋"},{id:"soft-drink",fr:"la boisson gazeuse",ar:"المشروب الغازي",emoji:"🥤"}
 ]},
 {id:"snacks",fr:"Les biscuits et confiseries",ar:"الحلويات والوجبات الخفيفة",description:"بسكويت وشوكولاتة ووجبات خفيفة.",emoji:"🍪",kind:"shelf",products:[
  {id:"biscuits",fr:"les biscuits",ar:"البسكويت",emoji:"🍪"},{id:"chocolate",fr:"le chocolat",ar:"الشوكولاتة",emoji:"🍫"},{id:"candy",fr:"les bonbons",ar:"الحلوى",emoji:"🍬"},{id:"chips",fr:"les chips",ar:"رقائق البطاطس",emoji:"🥔"},{id:"popcorn",fr:"le pop-corn",ar:"الفشار",emoji:"🍿"},{id:"nuts",fr:"les noix",ar:"المكسرات",emoji:"🥜"},{id:"dates",fr:"les dattes",ar:"التمر",emoji:"🌴"},{id:"cracker",fr:"les crackers",ar:"المقرمشات",emoji:"🍘"}
 ]},
 {id:"frozen",fr:"Les produits surgelés",ar:"الأطعمة المجمدة",description:"أطعمة محفوظة في قسم التجميد.",emoji:"❄️",kind:"shelf",products:[
  {id:"frozen-veg",fr:"les légumes surgelés",ar:"الخضروات المجمدة",emoji:"🥦"},{id:"frozen-fruit",fr:"les fruits surgelés",ar:"الفواكه المجمدة",emoji:"🫐"},{id:"frozen-pizza",fr:"la pizza surgelée",ar:"البيتزا المجمدة",emoji:"🍕"},{id:"fries",fr:"les frites surgelées",ar:"البطاطس المقلية المجمدة",emoji:"🍟"},{id:"fish-fingers",fr:"les bâtonnets de poisson",ar:"أصابع السمك",emoji:"🐟"},{id:"frozen-chicken",fr:"le poulet surgelé",ar:"الدجاج المجمد",emoji:"🍗"},{id:"frozen-pastry",fr:"la pâte feuilletée",ar:"العجينة المورقة",emoji:"🥐"},{id:"ice-cubes",fr:"les glaçons",ar:"مكعبات الثلج",emoji:"🧊"}
 ]},
 {id:"icecream",fr:"Les glaces",ar:"المثلجات",description:"نكهات وأشكال مختلفة من المثلجات.",emoji:"🍦",kind:"shelf",products:[
  {id:"vanilla",fr:"la glace à la vanille",ar:"مثلجات الفانيليا",emoji:"🍦"},{id:"chocolate-ice",fr:"la glace au chocolat",ar:"مثلجات الشوكولاتة",emoji:"🍨"},{id:"strawberry-ice",fr:"la glace à la fraise",ar:"مثلجات الفراولة",emoji:"🍧"},{id:"pistachio",fr:"la glace à la pistache",ar:"مثلجات الفستق",emoji:"🍨"},{id:"cone",fr:"le cornet de glace",ar:"مخروط المثلجات",emoji:"🍦"},{id:"ice-pop",fr:"l’esquimau",ar:"مثلجات على عصا",emoji:"🍡"},{id:"ice-box",fr:"le bac de glace",ar:"علبة مثلجات عائلية",emoji:"🍨"},{id:"sorbet",fr:"le sorbet aux fruits",ar:"شربات الفواكه",emoji:"🍧"}
 ]},
 {id:"plastic",fr:"Les produits en plastique",ar:"المنتجات البلاستيكية",description:"أدوات منزلية بلاستيكية قابلة للاستخدام اليومي.",emoji:"🧺",kind:"shelf",products:[
  {id:"bags",fr:"les sacs en plastique",ar:"الأكياس البلاستيكية",emoji:"🛍️"},{id:"box",fr:"la boîte de conservation",ar:"علبة الحفظ",emoji:"📦"},{id:"cups",fr:"les gobelets",ar:"الأكواب البلاستيكية",emoji:"🥤"},{id:"plates",fr:"les assiettes en plastique",ar:"الأطباق البلاستيكية",emoji:"🍽️"},{id:"spoons",fr:"les cuillères en plastique",ar:"الملاعق البلاستيكية",emoji:"🥄"},{id:"bottle",fr:"la bouteille en plastique",ar:"القارورة البلاستيكية",emoji:"🧴"},{id:"basket",fr:"le panier en plastique",ar:"السلة البلاستيكية",emoji:"🧺"},{id:"cling-film",fr:"le film alimentaire",ar:"غلاف حفظ الطعام",emoji:"🧻"}
 ]},
 {id:"cleaning",fr:"Les savons et produits d’entretien",ar:"الصابون ومنتجات التنظيف",description:"أنواع الصابون ومنظفات المنزل.",emoji:"🧼",kind:"shelf",products:[
  {id:"soap",fr:"le savon",ar:"الصابون",emoji:"🧼"},{id:"liquid-soap",fr:"le savon liquide",ar:"الصابون السائل",emoji:"🧴"},{id:"hand-soap",fr:"le savon pour les mains",ar:"صابون اليدين",emoji:"🫧"},{id:"dish-liquid",fr:"le liquide vaisselle",ar:"سائل غسل الصحون",emoji:"🧴"},{id:"laundry",fr:"la lessive",ar:"مسحوق الغسيل",emoji:"🧺"},{id:"softener",fr:"l’adoucissant",ar:"منعّم الملابس",emoji:"🧴"},{id:"disinfectant",fr:"le désinfectant",ar:"المطهر",emoji:"🧴"},{id:"floor-cleaner",fr:"le nettoyant pour le sol",ar:"منظف الأرضيات",emoji:"🪣"},{id:"sponge",fr:"l’éponge",ar:"الإسفنجة",emoji:"🧽"},{id:"trash-bags",fr:"les sacs-poubelle",ar:"أكياس النفايات",emoji:"🗑️"}
 ]},
 {id:"hygiene",fr:"L’hygiène personnelle",ar:"العناية الشخصية",description:"منتجات النظافة والعناية اليومية.",emoji:"🪥",kind:"shelf",products:[
  {id:"toothpaste",fr:"le dentifrice",ar:"معجون الأسنان",emoji:"🪥"},{id:"toothbrush",fr:"la brosse à dents",ar:"فرشاة الأسنان",emoji:"🪥"},{id:"shampoo",fr:"le shampooing",ar:"الشامبو",emoji:"🧴"},{id:"shower-gel",fr:"le gel douche",ar:"جل الاستحمام",emoji:"🧴"},{id:"deodorant",fr:"le déodorant",ar:"مزيل العرق",emoji:"🧴"},{id:"comb",fr:"le peigne",ar:"المشط",emoji:"🪮"},{id:"razor",fr:"le rasoir",ar:"شفرة الحلاقة",emoji:"🪒"},{id:"hand-cream",fr:"la crème pour les mains",ar:"كريم اليدين",emoji:"🧴"}
 ]},
 {id:"paper",fr:"Les produits en papier",ar:"المنتجات الورقية",description:"منتجات ورقية للمنزل والنظافة.",emoji:"🧻",kind:"shelf",products:[
  {id:"tissues",fr:"les mouchoirs",ar:"المناديل",emoji:"🤧"},{id:"paper-towels",fr:"l’essuie-tout",ar:"ورق المطبخ",emoji:"🧻"},{id:"toilet-paper",fr:"le papier toilette",ar:"ورق الحمام",emoji:"🧻"},{id:"napkins",fr:"les serviettes en papier",ar:"مناديل المائدة",emoji:"◻️"},{id:"baking-paper",fr:"le papier cuisson",ar:"ورق الخَبز",emoji:"📜"},{id:"paper-bags",fr:"les sacs en papier",ar:"الأكياس الورقية",emoji:"🛍️"}
 ]},
 {id:"vegetables",fr:"Les légumes",ar:"سلة الخضروات",description:"خضروات طازجة مرتبة في سلال السوق.",emoji:"🥕",kind:"basket",products:[
  {id:"tomato",fr:"la tomate",ar:"الطماطم",emoji:"🍅"},{id:"potato",fr:"la pomme de terre",ar:"البطاطس",emoji:"🥔"},{id:"carrot",fr:"la carotte",ar:"الجزر",emoji:"🥕"},{id:"cucumber",fr:"le concombre",ar:"الخيار",emoji:"🥒"},{id:"onion",fr:"l’oignon",ar:"البصل",emoji:"🧅"},{id:"garlic",fr:"l’ail",ar:"الثوم",emoji:"🧄"},{id:"pepper-veg",fr:"le poivron",ar:"الفلفل الحلو",emoji:"🫑"},{id:"lettuce",fr:"la laitue",ar:"الخس",emoji:"🥬"},{id:"eggplant",fr:"l’aubergine",ar:"الباذنجان",emoji:"🍆"},{id:"broccoli",fr:"le brocoli",ar:"البروكلي",emoji:"🥦"},{id:"cauliflower",fr:"le chou-fleur",ar:"القرنبيط",emoji:"🥦"},{id:"zucchini",fr:"la courgette",ar:"الكوسا",emoji:"🥒"}
 ]},
 {id:"fruits",fr:"Les fruits",ar:"سلة الفواكه",description:"فواكه طازجة وملونة في سلال مستقلة.",emoji:"🍎",kind:"basket",products:[
  {id:"apple",fr:"la pomme",ar:"التفاح",emoji:"🍎"},{id:"orange",fr:"l’orange",ar:"البرتقال",emoji:"🍊"},{id:"banana",fr:"la banane",ar:"الموز",emoji:"🍌"},{id:"grapes",fr:"le raisin",ar:"العنب",emoji:"🍇"},{id:"strawberry",fr:"la fraise",ar:"الفراولة",emoji:"🍓"},{id:"watermelon",fr:"la pastèque",ar:"البطيخ",emoji:"🍉"},{id:"melon",fr:"le melon",ar:"الشمام",emoji:"🍈"},{id:"pear",fr:"la poire",ar:"الكمثرى",emoji:"🍐"},{id:"peach",fr:"la pêche",ar:"الخوخ",emoji:"🍑"},{id:"pineapple",fr:"l’ananas",ar:"الأناناس",emoji:"🍍"},{id:"lemon",fr:"le citron",ar:"الليمون",emoji:"🍋"},{id:"cherries",fr:"les cerises",ar:"الكرز",emoji:"🍒"}
 ]}
];

export const marketConversations:MarketConversation[]=[
 {id:"discovery",title:"Découvrir les rayons",ar:"التعرّف على أقسام السوق",summary:"محادثة طويلة للتعرّف على الأرفف والسلال وأسماء المنتجات.",lines:[
  {speaker:"Le vendeur",fr:"Bonjour madame, bienvenue au Grand Marché.",ar:"مرحبًا سيدتي، أهلًا بكِ في السوق الكبير."},
  {speaker:"La cliente",fr:"Bonjour monsieur, c’est ma première visite ici.",ar:"مرحبًا سيدي، هذه زيارتي الأولى هنا."},
  {speaker:"Le vendeur",fr:"Je vais vous présenter les différents rayons.",ar:"سأعرّفكِ على الأقسام المختلفة."},
  {speaker:"La cliente",fr:"Merci, je voudrais surtout apprendre le nom des produits.",ar:"شكرًا، أريد خصوصًا تعلم أسماء المنتجات."},
  {speaker:"Le vendeur",fr:"Commençons par le rayon des produits laitiers.",ar:"لنبدأ برف منتجات الألبان."},
  {speaker:"La cliente",fr:"Je vois du lait, du beurre et plusieurs fromages.",ar:"أرى الحليب والزبدة وعدة أنواع من الجبن."},
  {speaker:"Le vendeur",fr:"Exactement, il y a aussi du yaourt et de la crème.",ar:"بالضبط، يوجد أيضًا الزبادي والقشطة."},
  {speaker:"La cliente",fr:"Comment s’appelle ce fromage rond ?",ar:"ما اسم هذا الجبن الدائري؟"},
  {speaker:"Le vendeur",fr:"C’est un fromage de chèvre frais.",ar:"إنه جبن ماعز طازج."},
  {speaker:"La cliente",fr:"Et où se trouve le rayon de la boulangerie ?",ar:"وأين يوجد رف المخبوزات؟"},
  {speaker:"Le vendeur",fr:"Il est juste à côté, avec les baguettes et les croissants.",ar:"إنه بجواره مباشرة، مع خبز الباغيت والكرواسون."},
  {speaker:"La cliente",fr:"La brioche a l’air très moelleuse.",ar:"يبدو خبز البريوش طريًا جدًا."},
  {speaker:"Le vendeur",fr:"Oui, et le pain est préparé chaque matin.",ar:"نعم، ويُحضّر الخبز كل صباح."},
  {speaker:"La cliente",fr:"Quels produits trouve-t-on dans le rayon suivant ?",ar:"ما المنتجات الموجودة في الرف التالي؟"},
  {speaker:"Le vendeur",fr:"Ce sont les céréales et les légumineuses.",ar:"إنها الحبوب والبقوليات."},
  {speaker:"La cliente",fr:"Je reconnais le riz, les lentilles et les pois chiches.",ar:"أتعرف على الأرز والعدس والحمص."},
  {speaker:"Le vendeur",fr:"Très bien, vous pouvez aussi voir l’avoine et le blé.",ar:"جيد جدًا، ويمكنكِ أيضًا رؤية الشوفان والقمح."},
  {speaker:"La cliente",fr:"Les boissons sont-elles au fond du marché ?",ar:"هل المشروبات في آخر السوق؟"},
  {speaker:"Le vendeur",fr:"Oui, l’eau, les jus, le thé et le café sont au fond.",ar:"نعم، الماء والعصائر والشاي والقهوة في الخلف."},
  {speaker:"La cliente",fr:"J’aime beaucoup la manière dont les rayons sont organisés.",ar:"تعجبني كثيرًا طريقة تنظيم الأرفف."},
  {speaker:"Le vendeur",fr:"Les produits frais sont séparés des produits d’entretien.",ar:"المنتجات الطازجة منفصلة عن منتجات التنظيف."},
  {speaker:"La cliente",fr:"C’est pratique et très clair pour apprendre.",ar:"هذا عملي وواضح جدًا للتعلم."},
  {speaker:"Le vendeur",fr:"Regardez maintenant les grandes corbeilles devant vous.",ar:"انظري الآن إلى السلال الكبيرة أمامكِ."},
  {speaker:"La cliente",fr:"La première contient des légumes de toutes les couleurs.",ar:"الأولى تحتوي على خضروات من جميع الألوان."},
  {speaker:"Le vendeur",fr:"Il y a des tomates, des carottes, des concombres et des poivrons.",ar:"يوجد طماطم وجزر وخيار وفلفل حلو."},
  {speaker:"La cliente",fr:"Dans l’autre corbeille, je vois des pommes et des oranges.",ar:"في السلة الأخرى أرى التفاح والبرتقال."},
  {speaker:"Le vendeur",fr:"Vous trouverez aussi des bananes, du raisin et des fraises.",ar:"ستجدين أيضًا الموز والعنب والفراولة."},
  {speaker:"La cliente",fr:"Je connais maintenant beaucoup plus de mots français.",ar:"أعرف الآن كلمات فرنسية أكثر بكثير."},
  {speaker:"Le vendeur",fr:"Vous pouvez toucher chaque image pour écouter sa prononciation.",ar:"يمكنكِ الضغط على كل صورة لسماع نطقها."},
  {speaker:"La cliente",fr:"Merci pour cette visite complète et très utile.",ar:"شكرًا على هذه الجولة الكاملة والمفيدة جدًا."},
  {speaker:"Le vendeur",fr:"Avec plaisir, revenez quand vous voulez pour réviser.",ar:"بكل سرور، عودي متى شئتِ للمراجعة."},
  {speaker:"La cliente",fr:"À bientôt, et bonne journée !",ar:"إلى اللقاء، ويومًا سعيدًا!"}
 ]},
 {id:"quality",title:"Parler des produits",ar:"الحديث عن المنتجات",summary:"محادثة مختلفة عن الطزاجة والحفظ والمكونات والتفضيلات الغذائية.",lines:[
  {speaker:"Le vendeur",fr:"Bonjour monsieur, puis-je vous renseigner ?",ar:"مرحبًا سيدي، هل يمكنني مساعدتك بالمعلومات؟"},
  {speaker:"Le client",fr:"Bonjour, je voudrais comprendre comment reconnaître un produit frais.",ar:"مرحبًا، أود أن أفهم كيف أتعرف على المنتج الطازج."},
  {speaker:"Le vendeur",fr:"Pour les légumes, observez la couleur et la fermeté.",ar:"بالنسبة للخضروات، لاحظ اللون والتماسك."},
  {speaker:"Le client",fr:"Une tomate fraîche doit donc être ferme et bien rouge.",ar:"إذًا يجب أن تكون الطماطم الطازجة متماسكة وحمراء جيدًا."},
  {speaker:"Le vendeur",fr:"Oui, et ses feuilles ne doivent pas être sèches.",ar:"نعم، ويجب ألا تكون أوراقها جافة."},
  {speaker:"Le client",fr:"Comment choisissez-vous les fruits mûrs ?",ar:"كيف تختارون الفواكه الناضجة؟"},
  {speaker:"Le vendeur",fr:"Nous regardons leur couleur, leur parfum et leur texture.",ar:"ننظر إلى لونها ورائحتها وملمسها."},
  {speaker:"Le client",fr:"Je préfère les fruits légèrement mûrs, mais pas trop mous.",ar:"أفضل الفواكه الناضجة قليلًا، ولكن ليست طرية جدًا."},
  {speaker:"Le vendeur",fr:"C’est un bon choix pour les pommes, les poires et les pêches.",ar:"هذا اختيار جيد للتفاح والكمثرى والخوخ."},
  {speaker:"Le client",fr:"Quels aliments faut-il conserver au réfrigérateur ?",ar:"ما الأطعمة التي يجب حفظها في الثلاجة؟"},
  {speaker:"Le vendeur",fr:"Le lait, le yaourt, le beurre, la viande et le poisson.",ar:"الحليب والزبادي والزبدة واللحوم والأسماك."},
  {speaker:"Le client",fr:"Et les œufs, où est-il préférable de les ranger ?",ar:"والبيض، أين يُفضل حفظه؟"},
  {speaker:"Le vendeur",fr:"Gardez-les au frais dans leur boîte d’origine.",ar:"احتفظ به باردًا داخل علبته الأصلية."},
  {speaker:"Le client",fr:"Je vois aussi de nombreux produits surgelés.",ar:"أرى أيضًا الكثير من المنتجات المجمدة."},
  {speaker:"Le vendeur",fr:"Ils doivent rester au congélateur sans interruption.",ar:"يجب أن تبقى في المجمد دون انقطاع."},
  {speaker:"Le client",fr:"Quelle est la différence entre une glace et un sorbet ?",ar:"ما الفرق بين المثلجات وشربات الفواكه؟"},
  {speaker:"Le vendeur",fr:"La glace contient généralement du lait ou de la crème.",ar:"تحتوي المثلجات عادةً على الحليب أو القشطة."},
  {speaker:"Le vendeur",fr:"Le sorbet est surtout préparé avec des fruits et de l’eau.",ar:"أما الشربات فيُحضّر أساسًا من الفاكهة والماء."},
  {speaker:"Le client",fr:"Je comprends mieux, merci pour l’explication.",ar:"أفهم الآن بصورة أفضل، شكرًا على الشرح."},
  {speaker:"Le vendeur",fr:"Lisez aussi la liste des ingrédients sur l’emballage.",ar:"اقرأ أيضًا قائمة المكونات على العبوة."},
  {speaker:"Le client",fr:"Je cherche souvent des produits avec peu de sucre.",ar:"أبحث غالبًا عن منتجات قليلة السكر."},
  {speaker:"Le vendeur",fr:"Vous pouvez comparer les ingrédients de plusieurs produits.",ar:"يمكنك مقارنة مكونات عدة منتجات."},
  {speaker:"Le client",fr:"Pour le petit-déjeuner, j’aime l’avoine avec du yaourt.",ar:"في الإفطار أحب الشوفان مع الزبادي."},
  {speaker:"Le vendeur",fr:"Vous pouvez ajouter une banane, des fraises ou quelques noix.",ar:"يمكنك إضافة موزة أو فراولة أو بعض المكسرات."},
  {speaker:"Le client",fr:"Pour le déjeuner, je prépare souvent du riz et des légumes.",ar:"للغداء أحضّر غالبًا الأرز والخضروات."},
  {speaker:"Le vendeur",fr:"Ajoutez des lentilles ou des pois chiches pour varier.",ar:"أضف العدس أو الحمص للتنويع."},
  {speaker:"Le client",fr:"Et quelles épices vont bien avec ces aliments ?",ar:"وما التوابل التي تناسب هذه الأطعمة؟"},
  {speaker:"Le vendeur",fr:"Le cumin, le paprika et le poivre sont très courants.",ar:"الكمون والبابريكا والفلفل الأسود شائعة جدًا."},
  {speaker:"Le client",fr:"Cette conversation m’aide à décrire mes habitudes alimentaires.",ar:"تساعدني هذه المحادثة على وصف عاداتي الغذائية."},
  {speaker:"Le vendeur",fr:"C’est excellent, répétez les phrases à voix haute.",ar:"هذا ممتاز، كرر الجمل بصوت مرتفع."},
  {speaker:"Le client",fr:"Merci, je vais continuer à apprendre rayon par rayon.",ar:"شكرًا، سأواصل التعلم رفًا بعد رف."},
  {speaker:"Le vendeur",fr:"Bonne révision et à très bientôt au Grand Marché !",ar:"مراجعة موفقة وإلى لقاء قريب في السوق الكبير!"}
 ]}
];
