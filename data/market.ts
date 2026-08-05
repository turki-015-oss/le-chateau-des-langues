export type MarketProduct={id:string;fr:string;ar:string;emoji:string;note?:string;image?:string};
export type MarketDepartment={id:string;fr:string;ar:string;description:string;emoji:string;kind:"shelf"|"basket";products:MarketProduct[]};
export type MarketDialogueLine={speaker:"Le vendeur"|"La cliente"|"Le client";fr:string;ar:string};
export type MarketConversation={id:string;title:string;ar:string;summary:string;lines:MarketDialogueLine[]};

const baseMarketDepartments:MarketDepartment[]=[
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

const extraProducts:Record<string,MarketProduct[]>={
 dairy:[
  {id:"whole-milk",fr:"le lait entier",ar:"الحليب كامل الدسم",emoji:"🥛"},{id:"semi-skimmed-milk",fr:"le lait demi-écrémé",ar:"الحليب شبه منزوع الدسم",emoji:"🥛"},{id:"skimmed-milk",fr:"le lait écrémé",ar:"الحليب منزوع الدسم",emoji:"🥛"},{id:"lactose-free-milk",fr:"le lait sans lactose",ar:"الحليب الخالي من اللاكتوز",emoji:"🥛"},{id:"plain-yogurt",fr:"le yaourt nature",ar:"الزبادي الطبيعي",emoji:"🥣"},{id:"fruit-yogurt",fr:"le yaourt aux fruits",ar:"زبادي الفواكه",emoji:"🥣"},{id:"greek-yogurt",fr:"le yaourt grec",ar:"الزبادي اليوناني",emoji:"🥣"},{id:"parmesan",fr:"le parmesan",ar:"جبن البارميزان",emoji:"🧀"},{id:"emmental",fr:"l’emmental",ar:"جبن الإمنتال",emoji:"🧀"},{id:"camembert",fr:"le camembert",ar:"جبن الكاممبير",emoji:"🧀"}
 ],
 bakery:[
  {id:"wholemeal-bread",fr:"le pain complet",ar:"خبز القمح الكامل",emoji:"🍞"},{id:"country-bread",fr:"le pain de campagne",ar:"الخبز الريفي",emoji:"🍞"},{id:"rye-bread",fr:"le pain de seigle",ar:"خبز الجاودار",emoji:"🍞"},{id:"multigrain-bread",fr:"le pain aux céréales",ar:"خبز الحبوب",emoji:"🍞"},{id:"pain-chocolat",fr:"le pain au chocolat",ar:"خبز بالشوكولاتة",emoji:"🥐"},{id:"apple-turnover",fr:"le chausson aux pommes",ar:"فطيرة التفاح الفرنسية",emoji:"🥧"},{id:"madeleine",fr:"la madeleine",ar:"كعكة المادلين",emoji:"🧁"},{id:"muffin",fr:"le muffin",ar:"المافن",emoji:"🧁"},{id:"doughnut",fr:"le beignet",ar:"الدونات",emoji:"🍩"},{id:"breadsticks",fr:"les gressins",ar:"أعواد الخبز",emoji:"🥖"}
 ],
 meat:[
  {id:"chicken-cutlet",fr:"l’escalope de poulet",ar:"شريحة صدر الدجاج",emoji:"🍗"},{id:"chicken-wings",fr:"les ailes de poulet",ar:"أجنحة الدجاج",emoji:"🍗"},{id:"chicken-thighs",fr:"les cuisses de poulet",ar:"أفخاذ الدجاج",emoji:"🍗"},{id:"lamb-chops",fr:"les côtelettes d’agneau",ar:"ريش الغنم",emoji:"🍖"},{id:"beef-fillet",fr:"le filet de bœuf",ar:"فيليه اللحم البقري",emoji:"🥩"},{id:"roast",fr:"le rôti",ar:"لحم الروستو",emoji:"🍖"},{id:"ham",fr:"le jambon",ar:"اللحم المدخن",emoji:"🍖"},{id:"bacon",fr:"le bacon",ar:"شرائح اللحم المقدد",emoji:"🥓"},{id:"merguez",fr:"la merguez",ar:"نقانق المرقاز",emoji:"🌭"},{id:"meatballs",fr:"les boulettes de viande",ar:"كرات اللحم",emoji:"🍖"}
 ],
 seafood:[
  {id:"sea-bream",fr:"la dorade",ar:"سمك الدنيس",emoji:"🐟"},{id:"sea-bass",fr:"le bar",ar:"سمك القاروص",emoji:"🐟"},{id:"cod",fr:"le cabillaud",ar:"سمك القد",emoji:"🐟"},{id:"trout",fr:"la truite",ar:"سمك السلمون المرقط",emoji:"🐟"},{id:"mackerel",fr:"le maquereau",ar:"سمك الإسقمري",emoji:"🐟"},{id:"mussels",fr:"les moules",ar:"بلح البحر",emoji:"🦪"},{id:"oysters",fr:"les huîtres",ar:"المحار",emoji:"🦪"},{id:"squid",fr:"le calamar",ar:"الحبار",emoji:"🦑"},{id:"scallops",fr:"les coquilles Saint-Jacques",ar:"الإسكالوب البحري",emoji:"🐚"},{id:"fish-fillet",fr:"le filet de poisson",ar:"فيليه السمك",emoji:"🐟"}
 ],
 grains:[
  {id:"bulgur",fr:"le boulgour",ar:"البرغل",emoji:"🌾"},{id:"quinoa",fr:"le quinoa",ar:"الكينوا",emoji:"🌾"},{id:"couscous",fr:"le couscous",ar:"الكسكس",emoji:"🍚"},{id:"barley",fr:"l’orge",ar:"الشعير",emoji:"🌾"},{id:"millet",fr:"le millet",ar:"الدخن",emoji:"🌾"},{id:"split-peas",fr:"les pois cassés",ar:"البازلاء المجففة",emoji:"🫘"},{id:"red-beans",fr:"les haricots rouges",ar:"الفاصوليا الحمراء",emoji:"🫘"},{id:"white-beans",fr:"les haricots blancs",ar:"الفاصوليا البيضاء",emoji:"🫘"},{id:"broad-beans",fr:"les fèves",ar:"الفول",emoji:"🫘"},{id:"chia",fr:"les graines de chia",ar:"بذور الشيا",emoji:"🌱"}
 ],
 pantry:[
  {id:"spaghetti",fr:"les spaghettis",ar:"السباغيتي",emoji:"🍝"},{id:"macaroni",fr:"les macaronis",ar:"المعكرونة القصيرة",emoji:"🍝"},{id:"noodles",fr:"les nouilles",ar:"النودلز",emoji:"🍜"},{id:"cornstarch",fr:"la fécule de maïs",ar:"نشا الذرة",emoji:"🌽"},{id:"yeast",fr:"la levure",ar:"الخميرة",emoji:"🧂"},{id:"cocoa",fr:"le cacao en poudre",ar:"مسحوق الكاكاو",emoji:"🍫"},{id:"brown-sugar",fr:"le sucre roux",ar:"السكر البني",emoji:"🟫"},{id:"maple-syrup",fr:"le sirop d’érable",ar:"شراب القيقب",emoji:"🍯"},{id:"peanut-butter",fr:"le beurre de cacahuète",ar:"زبدة الفول السوداني",emoji:"🥜"},{id:"breadcrumbs",fr:"la chapelure",ar:"فتات الخبز",emoji:"🍞"}
 ],
 preserves:[
  {id:"olives-jar",fr:"les olives en bocal",ar:"الزيتون المحفوظ",emoji:"🫒"},{id:"pickles",fr:"les cornichons",ar:"الخيار المخلل",emoji:"🥒"},{id:"canned-mushrooms",fr:"les champignons en conserve",ar:"الفطر المعلب",emoji:"🥫"},{id:"tomato-sauce",fr:"la sauce tomate",ar:"صلصة الطماطم",emoji:"🍅"},{id:"pesto",fr:"le pesto",ar:"صلصة البيستو",emoji:"🌿"},{id:"harissa",fr:"la harissa",ar:"الهريسة",emoji:"🌶️"},{id:"soy-sauce",fr:"la sauce soja",ar:"صلصة الصويا",emoji:"🫗"},{id:"curry",fr:"le curry",ar:"الكاري",emoji:"🟡"},{id:"turmeric",fr:"le curcuma",ar:"الكركم",emoji:"🟠"},{id:"herbs-provence",fr:"les herbes de Provence",ar:"أعشاب بروفانس",emoji:"🌿"}
 ],
 drinks:[
  {id:"grape-juice",fr:"le jus de raisin",ar:"عصير العنب",emoji:"🍇"},{id:"pineapple-juice",fr:"le jus d’ananas",ar:"عصير الأناناس",emoji:"🍍"},{id:"mango-juice",fr:"le jus de mangue",ar:"عصير المانجو",emoji:"🥭"},{id:"carrot-juice",fr:"le jus de carotte",ar:"عصير الجزر",emoji:"🥕"},{id:"coconut-water",fr:"l’eau de coco",ar:"ماء جوز الهند",emoji:"🥥"},{id:"herbal-tea",fr:"la tisane",ar:"شاي الأعشاب",emoji:"🍵"},{id:"espresso",fr:"l’expresso",ar:"قهوة الإسبريسو",emoji:"☕"},{id:"cappuccino",fr:"le cappuccino",ar:"الكابتشينو",emoji:"☕"},{id:"cola",fr:"le soda au cola",ar:"مشروب الكولا",emoji:"🥤"},{id:"energy-drink",fr:"la boisson énergisante",ar:"مشروب الطاقة",emoji:"🥫"}
 ],
 snacks:[
  {id:"dark-chocolate",fr:"le chocolat noir",ar:"الشوكولاتة الداكنة",emoji:"🍫"},{id:"milk-chocolate",fr:"le chocolat au lait",ar:"شوكولاتة الحليب",emoji:"🍫"},{id:"white-chocolate",fr:"le chocolat blanc",ar:"الشوكولاتة البيضاء",emoji:"🍫"},{id:"wafers",fr:"les gaufrettes",ar:"الويفر",emoji:"🧇"},{id:"cereal-bars",fr:"les barres de céréales",ar:"ألواح الحبوب",emoji:"🍫"},{id:"almonds",fr:"les amandes",ar:"اللوز",emoji:"🌰"},{id:"pistachios",fr:"les pistaches",ar:"الفستق",emoji:"🥜"},{id:"hazelnuts",fr:"les noisettes",ar:"البندق",emoji:"🌰"},{id:"raisins",fr:"les raisins secs",ar:"الزبيب",emoji:"🍇"},{id:"dried-apricots",fr:"les abricots secs",ar:"المشمش المجفف",emoji:"🟠"}
 ],
 frozen:[
  {id:"frozen-spinach",fr:"les épinards surgelés",ar:"السبانخ المجمدة",emoji:"🥬"},{id:"frozen-peas",fr:"les petits pois surgelés",ar:"البازلاء المجمدة",emoji:"🟢"},{id:"frozen-beans",fr:"les haricots verts surgelés",ar:"الفاصوليا الخضراء المجمدة",emoji:"🫛"},{id:"frozen-berries",fr:"les fruits rouges surgelés",ar:"التوت المجمد",emoji:"🫐"},{id:"nuggets",fr:"les nuggets de poulet",ar:"قطع الدجاج المقرمشة",emoji:"🍗"},{id:"frozen-burger",fr:"le steak haché surgelé",ar:"قرص اللحم المجمد",emoji:"🍔"},{id:"frozen-lasagna",fr:"les lasagnes surgelées",ar:"اللازانيا المجمدة",emoji:"🍝"},{id:"frozen-soup",fr:"la soupe surgelée",ar:"الشوربة المجمدة",emoji:"🥣"},{id:"frozen-croissants",fr:"les croissants surgelés",ar:"الكرواسون المجمد",emoji:"🥐"},{id:"pizza-dough",fr:"la pâte à pizza surgelée",ar:"عجينة البيتزا المجمدة",emoji:"🍕"}
 ],
 icecream:[
  {id:"caramel-ice",fr:"la glace au caramel",ar:"مثلجات الكراميل",emoji:"🍨"},{id:"coffee-ice",fr:"la glace au café",ar:"مثلجات القهوة",emoji:"🍨"},{id:"lemon-ice",fr:"la glace au citron",ar:"مثلجات الليمون",emoji:"🍧"},{id:"mango-ice",fr:"la glace à la mangue",ar:"مثلجات المانجو",emoji:"🍧"},{id:"raspberry-ice",fr:"la glace à la framboise",ar:"مثلجات التوت",emoji:"🍧"},{id:"mint-ice",fr:"la glace à la menthe",ar:"مثلجات النعناع",emoji:"🍨"},{id:"ice-sandwich",fr:"le sandwich glacé",ar:"ساندويتش المثلجات",emoji:"🍦"},{id:"ice-cake",fr:"le gâteau glacé",ar:"كعكة المثلجات",emoji:"🎂"},{id:"frozen-yogurt",fr:"le yaourt glacé",ar:"الزبادي المثلج",emoji:"🍦"},{id:"sugarfree-ice",fr:"la glace sans sucre",ar:"مثلجات دون سكر",emoji:"🍨"}
 ],
 plastic:[
  {id:"lunch-box",fr:"la boîte-repas",ar:"علبة الطعام",emoji:"🍱"},{id:"plastic-tub",fr:"le bac en plastique",ar:"الحوض البلاستيكي",emoji:"🧺"},{id:"bucket",fr:"le seau en plastique",ar:"الدلو البلاستيكي",emoji:"🪣"},{id:"reusable-bottle",fr:"la gourde réutilisable",ar:"قارورة قابلة لإعادة الاستخدام",emoji:"🧴"},{id:"colander",fr:"la passoire en plastique",ar:"المصفاة البلاستيكية",emoji:"🥣"},{id:"tray",fr:"le plateau en plastique",ar:"الصينية البلاستيكية",emoji:"🍽️"},{id:"cutlery",fr:"les couverts en plastique",ar:"أدوات المائدة البلاستيكية",emoji:"🍴"},{id:"straws",fr:"les pailles",ar:"مصاصات الشراب",emoji:"🥤"},{id:"food-clips",fr:"les pinces alimentaires",ar:"مشابك أكياس الطعام",emoji:"📎"},{id:"freezer-bags",fr:"les sacs de congélation",ar:"أكياس التجميد",emoji:"🛍️"}
 ],
 cleaning:[
  {id:"glass-cleaner",fr:"le nettoyant pour vitres",ar:"منظف الزجاج",emoji:"🪟"},{id:"bleach",fr:"l’eau de Javel",ar:"المبيّض",emoji:"🧴"},{id:"kitchen-cleaner",fr:"le nettoyant de cuisine",ar:"منظف المطبخ",emoji:"🧴"},{id:"bath-cleaner",fr:"le nettoyant de salle de bains",ar:"منظف الحمام",emoji:"🧴"},{id:"descaler",fr:"le détartrant",ar:"مزيل التكلس",emoji:"🧴"},{id:"microfiber",fr:"le chiffon en microfibre",ar:"قطعة قماش دقيقة",emoji:"🧽"},{id:"broom",fr:"le balai",ar:"المكنسة",emoji:"🧹"},{id:"mop",fr:"la serpillière",ar:"ممسحة الأرض",emoji:"🧹"},{id:"cleaning-brush",fr:"la brosse de nettoyage",ar:"فرشاة التنظيف",emoji:"🪥"},{id:"gloves",fr:"les gants de ménage",ar:"قفازات التنظيف",emoji:"🧤"}
 ],
 hygiene:[
  {id:"conditioner",fr:"l’après-shampooing",ar:"بلسم الشعر",emoji:"🧴"},{id:"body-lotion",fr:"le lait pour le corps",ar:"مرطب الجسم",emoji:"🧴"},{id:"face-cream",fr:"la crème pour le visage",ar:"كريم الوجه",emoji:"🧴"},{id:"cotton-buds",fr:"les cotons-tiges",ar:"أعواد القطن",emoji:"⚪"},{id:"cotton-pads",fr:"les disques de coton",ar:"قطع القطن",emoji:"⚪"},{id:"dental-floss",fr:"le fil dentaire",ar:"خيط الأسنان",emoji:"🦷"},{id:"mouthwash",fr:"le bain de bouche",ar:"غسول الفم",emoji:"🧴"},{id:"perfume",fr:"le parfum",ar:"العطر",emoji:"🌸"},{id:"sunscreen",fr:"la crème solaire",ar:"واقي الشمس",emoji:"☀️"},{id:"nail-clippers",fr:"le coupe-ongles",ar:"قصّاصة الأظافر",emoji:"✂️"}
 ],
 paper:[
  {id:"aluminum-foil",fr:"le papier aluminium",ar:"ورق الألمنيوم",emoji:"🧻"},{id:"gift-paper",fr:"le papier cadeau",ar:"ورق الهدايا",emoji:"🎁"},{id:"paper-tablecloth",fr:"la nappe en papier",ar:"مفرش ورقي",emoji:"◻️"},{id:"coffee-filters",fr:"les filtres à café",ar:"مرشحات القهوة",emoji:"☕"},{id:"paper-cups",fr:"les gobelets en carton",ar:"الأكواب الورقية",emoji:"🥤"},{id:"paper-plates",fr:"les assiettes en carton",ar:"الأطباق الورقية",emoji:"🍽️"},{id:"notebook",fr:"le cahier",ar:"الدفتر",emoji:"📓"},{id:"envelopes",fr:"les enveloppes",ar:"المغلفات",emoji:"✉️"},{id:"oven-bags",fr:"les sacs de cuisson",ar:"أكياس الطهي",emoji:"🛍️"},{id:"labels",fr:"les étiquettes adhésives",ar:"الملصقات الورقية",emoji:"🏷️"}
 ],
 vegetables:[
  {id:"cabbage",fr:"le chou",ar:"الملفوف",emoji:"🥬"},{id:"spinach",fr:"les épinards",ar:"السبانخ",emoji:"🥬"},{id:"peas",fr:"les petits pois",ar:"البازلاء",emoji:"🫛"},{id:"green-beans",fr:"les haricots verts",ar:"الفاصوليا الخضراء",emoji:"🫛"},{id:"mushroom",fr:"le champignon",ar:"الفطر",emoji:"🍄"},{id:"celery",fr:"le céleri",ar:"الكرفس",emoji:"🥬"},{id:"leek",fr:"le poireau",ar:"الكراث",emoji:"🥬"},{id:"radish",fr:"le radis",ar:"الفجل",emoji:"🔴"},{id:"turnip",fr:"le navet",ar:"اللفت",emoji:"🟣"},{id:"beet",fr:"la betterave",ar:"الشمندر",emoji:"🟣"},{id:"artichoke",fr:"l’artichaut",ar:"الخرشوف",emoji:"🌿"},{id:"asparagus",fr:"les asperges",ar:"الهليون",emoji:"🌱"},{id:"pumpkin",fr:"la citrouille",ar:"اليقطين",emoji:"🎃"},{id:"sweet-potato",fr:"la patate douce",ar:"البطاطا الحلوة",emoji:"🍠"}
 ],
 fruits:[
  {id:"kiwi",fr:"le kiwi",ar:"الكيوي",emoji:"🥝"},{id:"mango",fr:"la mangue",ar:"المانجو",emoji:"🥭"},{id:"avocado",fr:"l’avocat",ar:"الأفوكادو",emoji:"🥑"},{id:"pomegranate",fr:"la grenade",ar:"الرمان",emoji:"🔴"},{id:"fig",fr:"la figue",ar:"التين",emoji:"🟣"},{id:"apricot",fr:"l’abricot",ar:"المشمش",emoji:"🟠"},{id:"plum",fr:"la prune",ar:"البرقوق",emoji:"🟣"},{id:"raspberry",fr:"la framboise",ar:"توت العليق",emoji:"🫐"},{id:"blueberry",fr:"la myrtille",ar:"التوت الأزرق",emoji:"🫐"},{id:"coconut",fr:"la noix de coco",ar:"جوز الهند",emoji:"🥥"},{id:"grapefruit",fr:"le pamplemousse",ar:"الجريب فروت",emoji:"🍊"},{id:"mandarin",fr:"la mandarine",ar:"اليوسفي",emoji:"🍊"},{id:"papaya",fr:"la papaye",ar:"البابايا",emoji:"🟠"},{id:"passion-fruit",fr:"le fruit de la passion",ar:"فاكهة العاطفة",emoji:"🟣"}
 ]
};

type ProductVariant={id:string;fr:string;ar:string};

const productVariants:Record<string,ProductVariant[]>={
 dairy:[{id:"organic",fr:"biologique",ar:"العضوي"},{id:"farm",fr:"fermier",ar:"الريفي"},{id:"light",fr:"allégé",ar:"قليل الدسم"},{id:"calcium",fr:"enrichi en calcium",ar:"المدعّم بالكالسيوم"},{id:"family",fr:"format familial",ar:"بحجم عائلي"},{id:"local",fr:"d’origine locale",ar:"محلي المصدر"}],
 bakery:[{id:"artisan",fr:"artisanal",ar:"الحرفي"},{id:"organic",fr:"biologique",ar:"العضوي"},{id:"seeds",fr:"aux graines",ar:"بالبذور"},{id:"glutenfree",fr:"sans gluten",ar:"الخالي من الغلوتين"},{id:"fresh",fr:"du jour",ar:"المحضّر اليوم"},{id:"family",fr:"format familial",ar:"بحجم عائلي"}],
 meat:[{id:"fresh",fr:"frais",ar:"الطازج"},{id:"farm",fr:"fermier",ar:"من إنتاج المزارع"},{id:"seasoned",fr:"assaisonné",ar:"المتبّل"},{id:"lean",fr:"maigre",ar:"قليل الدهون"},{id:"family",fr:"format familial",ar:"بحجم عائلي"},{id:"portions",fr:"en portions",ar:"المقسّم إلى حصص"}],
 seafood:[{id:"fresh",fr:"frais",ar:"الطازج"},{id:"wild",fr:"sauvage",ar:"البري"},{id:"filleted",fr:"préparé en filets",ar:"المجهز كشرائح"},{id:"cleaned",fr:"nettoyé",ar:"المنظف"},{id:"local",fr:"de pêche locale",ar:"من صيد محلي"},{id:"portions",fr:"en portions",ar:"المقسّم إلى حصص"}],
 grains:[{id:"organic",fr:"biologique",ar:"العضوي"},{id:"whole",fr:"complet",ar:"الكامل"},{id:"quick",fr:"à cuisson rapide",ar:"سريع الطهي"},{id:"family",fr:"format familial",ar:"بحجم عائلي"},{id:"local",fr:"d’origine locale",ar:"محلي المصدر"},{id:"premium",fr:"de qualité supérieure",ar:"عالي الجودة"}],
 pantry:[{id:"organic",fr:"biologique",ar:"العضوي"},{id:"fine",fr:"fin",ar:"الناعم"},{id:"whole",fr:"complet",ar:"الكامل"},{id:"family",fr:"format familial",ar:"بحجم عائلي"},{id:"traditional",fr:"traditionnel",ar:"التقليدي"},{id:"premium",fr:"de qualité supérieure",ar:"عالي الجودة"}],
 preserves:[{id:"organic",fr:"biologique",ar:"العضوي"},{id:"mild",fr:"doux",ar:"المعتدل"},{id:"spicy",fr:"épicé",ar:"الحار"},{id:"nosalt",fr:"sans sel ajouté",ar:"دون ملح مضاف"},{id:"family",fr:"en grand format",ar:"بحجم كبير"},{id:"traditional",fr:"de recette traditionnelle",ar:"بالوصفة التقليدية"}],
 drinks:[{id:"organic",fr:"biologique",ar:"العضوي"},{id:"sugarfree",fr:"sans sucre ajouté",ar:"دون سكر مضاف"},{id:"light",fr:"léger",ar:"الخفيف"},{id:"cold",fr:"à servir frais",ar:"المخصص للتقديم باردًا"},{id:"family",fr:"format familial",ar:"بحجم عائلي"},{id:"natural",fr:"100 % naturel",ar:"الطبيعي بالكامل"}],
 snacks:[{id:"organic",fr:"biologique",ar:"العضوي"},{id:"salted",fr:"salé",ar:"المملح"},{id:"unsalted",fr:"sans sel",ar:"دون ملح"},{id:"sugarfree",fr:"sans sucre ajouté",ar:"دون سكر مضاف"},{id:"mini",fr:"en mini-portions",ar:"بحصص صغيرة"},{id:"family",fr:"format familial",ar:"بحجم عائلي"}],
 frozen:[{id:"organic",fr:"biologique",ar:"العضوي"},{id:"ready",fr:"prêt à cuire",ar:"الجاهز للطهي"},{id:"steam",fr:"pour cuisson vapeur",ar:"المخصص للطهي بالبخار"},{id:"family",fr:"format familial",ar:"بحجم عائلي"},{id:"individual",fr:"en portion individuelle",ar:"بحصة فردية"},{id:"seasoned",fr:"assaisonné",ar:"المتبّل"}],
 icecream:[{id:"artisan",fr:"artisanale",ar:"الحرفية"},{id:"organic",fr:"biologique",ar:"العضوية"},{id:"sugarfree",fr:"sans sucre ajouté",ar:"دون سكر مضاف"},{id:"mini",fr:"en mini-format",ar:"بحجم صغير"},{id:"family",fr:"format familial",ar:"بحجم عائلي"},{id:"vegan",fr:"végétale",ar:"النباتية"}],
 plastic:[{id:"recycled",fr:"en plastique recyclé",ar:"من البلاستيك المعاد تدويره"},{id:"reusable",fr:"réutilisable",ar:"القابل لإعادة الاستخدام"},{id:"transparent",fr:"transparent",ar:"الشفاف"},{id:"colored",fr:"coloré",ar:"الملون"},{id:"small",fr:"petit format",ar:"بالحجم الصغير"},{id:"large",fr:"grand format",ar:"بالحجم الكبير"}],
 cleaning:[{id:"lemon",fr:"parfum citron",ar:"برائحة الليمون"},{id:"lavender",fr:"parfum lavande",ar:"برائحة اللافندر"},{id:"sensitive",fr:"pour peaux sensibles",ar:"المناسب للبشرة الحساسة"},{id:"concentrated",fr:"concentré",ar:"المركّز"},{id:"eco",fr:"écologique",ar:"الصديق للبيئة"},{id:"family",fr:"grand format",ar:"بالحجم الكبير"}],
 hygiene:[{id:"sensitive",fr:"pour peaux sensibles",ar:"للبشرة الحساسة"},{id:"natural",fr:"aux ingrédients naturels",ar:"بمكونات طبيعية"},{id:"aloe",fr:"à l’aloe vera",ar:"بالألوفيرا"},{id:"unscented",fr:"sans parfum",ar:"دون عطر"},{id:"travel",fr:"format voyage",ar:"بحجم السفر"},{id:"family",fr:"grand format",ar:"بالحجم الكبير"}],
 paper:[{id:"recycled",fr:"en papier recyclé",ar:"من الورق المعاد تدويره"},{id:"white",fr:"blanc",ar:"الأبيض"},{id:"colored",fr:"coloré",ar:"الملون"},{id:"small",fr:"petit format",ar:"بالحجم الصغير"},{id:"large",fr:"grand format",ar:"بالحجم الكبير"},{id:"eco",fr:"écologique",ar:"الصديق للبيئة"}],
 vegetables:[{id:"organic",fr:"biologique",ar:"العضوي"},{id:"local",fr:"local",ar:"المحلي"},{id:"young",fr:"jeune",ar:"الصغير الطازج"},{id:"washed",fr:"lavé et prêt à utiliser",ar:"المغسول والجاهز"},{id:"season",fr:"de saison",ar:"الموسمي"},{id:"bundle",fr:"vendu en botte",ar:"المربوط في حزمة"}],
 fruits:[{id:"organic",fr:"biologique",ar:"العضوي"},{id:"local",fr:"local",ar:"المحلي"},{id:"ripe",fr:"bien mûr",ar:"الناضج"},{id:"season",fr:"de saison",ar:"الموسمي"},{id:"sweet",fr:"très sucré",ar:"شديد الحلاوة"},{id:"basket",fr:"présenté en barquette",ar:"المعبأ في علبة"}]
};

const variantPhrases:Record<string,string>={
 organic:"en version biologique",farm:"de production fermière",light:"en version allégée",calcium:"avec calcium ajouté",family:"en format familial",local:"d’origine locale",
 artisan:"de fabrication artisanale",seeds:"avec des graines",glutenfree:"sans gluten",fresh:"de l’arrivage du jour",marinated:"avec marinade",smoked:"au goût fumé",boneless:"sans os",portions:"en portions",lean:"à teneur réduite en matières grasses",
 wild:"de pêche sauvage",filleted:"en filets",cleaned:"après nettoyage",whole:"en version complète",quick:"à cuisson rapide",premium:"de qualité supérieure",fine:"en mouture fine",traditional:"selon la recette traditionnelle",
 mild:"au goût doux",spicy:"au goût épicé",nosalt:"sans sel ajouté",natural:"avec composition 100 % naturelle",sugarfree:"sans sucre ajouté",cold:"à servir frais",salted:"avec sel",unsalted:"sans sel",mini:"en mini-format",
 ready:"pour cuisson immédiate",steam:"pour cuisson vapeur",individual:"en portion individuelle",seasoned:"avec assaisonnement",vegan:"à base végétale",recycled:"en matière recyclée",reusable:"réutilisable",
 transparent:"en version transparente",colored:"en version colorée",small:"en petit format",large:"en grand format",lemon:"au parfum de citron",lavender:"au parfum de lavande",sensitive:"pour usage sensible",concentrated:"en formule concentrée",
 eco:"en version écologique",aloe:"à l’aloe vera",unscented:"sans parfum",travel:"en format voyage",white:"en couleur blanche",young:"de jeune récolte",washed:"après lavage et prêt à utiliser",season:"de saison",bundle:"en botte",
 ripe:"à pleine maturité",sweet:"à saveur très sucrée",basket:"en barquette"
};

function buildMarketDepartments(){
 const departments=baseMarketDepartments.map(department=>({
  ...department,
  products:[...department.products,...(extraProducts[department.id]??[])]
 }));
 const knownIds=new Set(departments.flatMap(department=>department.products.map(product=>product.id)));
 const knownNames=new Set(departments.flatMap(department=>department.products.map(product=>product.fr.toLocaleLowerCase("fr"))));
 const pools=departments.map(department=>{
  const variants=productVariants[department.id]??[];
  return department.products.flatMap(product=>variants.map(variant=>({
   id:`${product.id}-${variant.id}`,
   fr:`${product.fr} ${variantPhrases[variant.id]??variant.fr}`,
   ar:`${product.ar} — ${variant.ar}`,
   emoji:product.emoji,
   note:`${variant.fr} · ${variant.ar}`
  }))).filter(product=>!knownIds.has(product.id)&&!knownNames.has(product.fr.toLocaleLowerCase("fr")));
 });
 let total=departments.reduce((sum,department)=>sum+department.products.length,0);
 let round=0;
 while(total<900){
  let added=false;
  for(let index=0;index<departments.length&&total<900;index+=1){
   const candidate=pools[index][round];
   if(!candidate)continue;
   const normalized=candidate.fr.toLocaleLowerCase("fr");
   if(knownIds.has(candidate.id)||knownNames.has(normalized))continue;
   departments[index].products.push(candidate);
   knownIds.add(candidate.id);
   knownNames.add(normalized);
   total+=1;
   added=true;
  }
  if(!added)break;
  round+=1;
 }
 if(total!==900)throw new Error(`Le catalogue du marché contient ${total} produits au lieu de 900.`);
 const dairy=departments.find(department=>department.id==="dairy");
 if(dairy){
  dairy.products=dairy.products.map((product,index)=>({
   ...product,
   image:`/market/products/dairy/dairy-${String(index+1).padStart(2,"0")}.webp`
  }));
 }
 const bakery=departments.find(department=>department.id==="bakery");
 if(bakery){
  bakery.products=bakery.products.map((product,index)=>({
   ...product,
   image:`/market/products/bakery/bakery-${String(index+1).padStart(2,"0")}.webp`
  }));
 }
 const meat=departments.find(department=>department.id==="meat");
 if(meat){
  meat.products=meat.products.map((product,index)=>({
   ...product,
   image:`/market/products/meat/meat-${String(index+1).padStart(2,"0")}.webp`
  }));
 }
 return departments;
}

export const marketDepartments:MarketDepartment[]=buildMarketDepartments();

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
