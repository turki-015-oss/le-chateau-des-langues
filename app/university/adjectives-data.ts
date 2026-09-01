import type {VisualVocabularyItem} from "./description-data";

export const APPEARANCE_ADJECTIVES:VisualVocabularyItem[]=[
 {id:"tall",fr:"grand — grande",ar:"طويل القامة — طويلة القامة",note:"المذكر ثم المؤنث",speech:["grand","grande"],spriteIndex:0,quizAr:"طويل القامة"},
 {id:"short",fr:"petit — petite",ar:"قصير القامة — قصيرة القامة",note:"المذكر ثم المؤنث",speech:["petit","petite"],spriteIndex:1,quizAr:"قصير القامة"},
 {id:"average-height",fr:"de taille moyenne",ar:"متوسط القامة",note:"تعبير ثابت",speech:["de taille moyenne"],spriteIndex:2},
 {id:"slim",fr:"mince",ar:"نحيف",note:"الصيغة نفسها للمذكر والمؤنث",speech:["mince"],spriteIndex:3},
 {id:"stocky",fr:"gros — grosse",ar:"ممتلئ الجسم — ممتلئة الجسم",note:"المذكر ثم المؤنث",speech:["gros","grosse"],spriteIndex:4,quizAr:"ممتلئ الجسم"},
 {id:"thin",fr:"maigre",ar:"نحيل جدًا",note:"الصيغة نفسها للمذكر والمؤنث",speech:["maigre"],spriteIndex:5},
 {id:"strong",fr:"fort — forte",ar:"قوي البنية — قوية البنية",note:"المذكر ثم المؤنث",speech:["fort","forte"],spriteIndex:6,quizAr:"قوي البنية"},
 {id:"muscular",fr:"musclé — musclée",ar:"مفتول العضلات — مفتولة العضلات",note:"المذكر ثم المؤنث",speech:["musclé","musclée"],spriteIndex:7,quizAr:"مفتول العضلات"},
 {id:"young",fr:"jeune",ar:"شاب — شابة",note:"الصيغة الفرنسية نفسها",speech:["jeune"],spriteIndex:8,quizAr:"شاب"},
 {id:"old",fr:"vieux — vieille",ar:"مسن — مسنة",note:"صيغة غير منتظمة",speech:["vieux","vieille"],spriteIndex:9,quizAr:"مسن"},
 {id:"handsome",fr:"beau — belle",ar:"جميل — جميلة",note:"صيغة غير منتظمة",speech:["beau","belle"],spriteIndex:10,quizAr:"جميل"},
 {id:"pretty",fr:"joli — jolie",ar:"حسن المظهر — حسنة المظهر",note:"المذكر ثم المؤنث",speech:["joli","jolie"],spriteIndex:11,quizAr:"حسن المظهر"},
 {id:"elegant",fr:"élégant — élégante",ar:"أنيق — أنيقة",note:"المذكر ثم المؤنث",speech:["élégant","élégante"],spriteIndex:12,quizAr:"أنيق"},
 {id:"athletic",fr:"sportif — sportive",ar:"رياضي — رياضية",note:"-if تصبح -ive",speech:["sportif","sportive"],spriteIndex:13,quizAr:"رياضي"},
 {id:"bald",fr:"chauve",ar:"أصلع",note:"الصيغة نفسها للمذكر والمؤنث",speech:["chauve"],spriteIndex:14},
 {id:"bearded",fr:"barbu",ar:"ملتحٍ",note:"وصف للمذكر",speech:["barbu"],spriteIndex:15}
];

export const HAIR_EYES_ADJECTIVES:VisualVocabularyItem[]=[
 {id:"long-hair",fr:"les cheveux longs",ar:"شعر طويل",note:"longs توافق cheveux",speech:["les cheveux longs"],spriteIndex:0},
 {id:"short-hair",fr:"les cheveux courts",ar:"شعر قصير",note:"courts توافق cheveux",speech:["les cheveux courts"],spriteIndex:1},
 {id:"curly-hair",fr:"les cheveux frisés",ar:"شعر مجعد",note:"صفة جمع",speech:["les cheveux frisés"],spriteIndex:2,quizAr:"شعر مجعد"},
 {id:"wavy-hair",fr:"les cheveux bouclés",ar:"شعر مموج",note:"صفة جمع",speech:["les cheveux bouclés"],spriteIndex:3},
 {id:"straight-hair",fr:"les cheveux lisses",ar:"شعر ناعم مستقيم",note:"صفة جمع",speech:["les cheveux lisses"],spriteIndex:4},
 {id:"blond-hair",fr:"les cheveux blonds",ar:"شعر أشقر",note:"صفة جمع",speech:["les cheveux blonds"],spriteIndex:5},
 {id:"brown-hair",fr:"les cheveux bruns",ar:"شعر بني داكن",note:"صفة جمع",speech:["les cheveux bruns"],spriteIndex:6},
 {id:"black-hair",fr:"les cheveux noirs",ar:"شعر أسود",note:"صفة جمع",speech:["les cheveux noirs"],spriteIndex:7},
 {id:"red-hair",fr:"les cheveux roux",ar:"شعر أحمر",note:"roux لا تتغير هنا",speech:["les cheveux roux"],spriteIndex:8},
 {id:"gray-hair",fr:"les cheveux gris",ar:"شعر رمادي",note:"صفة جمع",speech:["les cheveux gris"],spriteIndex:9},
 {id:"blue-eyes",fr:"les yeux bleus",ar:"عينان زرقاوان",note:"صفة جمع",speech:["les yeux bleus"],spriteIndex:10},
 {id:"green-eyes",fr:"les yeux verts",ar:"عينان خضراوان",note:"صفة جمع",speech:["les yeux verts"],spriteIndex:11},
 {id:"brown-eyes",fr:"les yeux marron",ar:"عينان بنيتان",note:"marron لا تتغير",speech:["les yeux marron"],spriteIndex:12,quizAr:"عينان بنيتان"},
 {id:"black-eyes",fr:"les yeux noirs",ar:"عينان سوداوان",note:"صفة جمع",speech:["les yeux noirs"],spriteIndex:13},
 {id:"gray-eyes",fr:"les yeux gris",ar:"عينان رماديتان",note:"صفة جمع",speech:["les yeux gris"],spriteIndex:14}
];

export const PERSONALITY_ADJECTIVES:VisualVocabularyItem[]=[
 {id:"kind",fr:"gentil — gentille",ar:"لطيف — لطيفة",note:"صيغة غير منتظمة",speech:["gentil","gentille"],spriteIndex:0,quizAr:"لطيف"},
 {id:"friendly",fr:"sympathique",ar:"ودود — ودودة",note:"الصيغة الفرنسية نفسها",speech:["sympathique"],spriteIndex:1},
 {id:"approachable",fr:"aimable",ar:"بشوش — بشوشة",note:"الصيغة الفرنسية نفسها",speech:["aimable"],spriteIndex:2},
 {id:"polite",fr:"poli — polie",ar:"مؤدب — مؤدبة",note:"المذكر ثم المؤنث",speech:["poli","polie"],spriteIndex:3,quizAr:"مؤدب"},
 {id:"sociable",fr:"sociable",ar:"اجتماعي — اجتماعية",note:"الصيغة الفرنسية نفسها",speech:["sociable"],spriteIndex:4},
 {id:"serious",fr:"sérieux — sérieuse",ar:"جاد — جادة",note:"-eux تصبح -euse",speech:["sérieux","sérieuse"],spriteIndex:5,quizAr:"جاد"},
 {id:"patient",fr:"patient — patiente",ar:"صبور — صبورة",note:"المذكر ثم المؤنث",speech:["patient","patiente"],spriteIndex:6},
 {id:"generous",fr:"généreux — généreuse",ar:"كريم — كريمة",note:"-eux تصبح -euse",speech:["généreux","généreuse"],spriteIndex:7},
 {id:"funny",fr:"drôle",ar:"مرح — مرحة",note:"الصيغة الفرنسية نفسها",speech:["drôle"],spriteIndex:8},
 {id:"amusing",fr:"amusant — amusante",ar:"مسلٍّ ومرح — مسلية ومرحة",note:"المذكر ثم المؤنث",speech:["amusant","amusante"],spriteIndex:9},
 {id:"intelligent",fr:"intelligent — intelligente",ar:"ذكي — ذكية",note:"المذكر ثم المؤنث",speech:["intelligent","intelligente"],spriteIndex:10},
 {id:"hardworking",fr:"travailleur — travailleuse",ar:"مجتهد — مجتهدة",note:"-eur تصبح -euse",speech:["travailleur","travailleuse"],spriteIndex:11,quizAr:"مجتهد"},
 {id:"active",fr:"actif — active",ar:"نشيط — نشيطة",note:"-if تصبح -ive",speech:["actif","active"],spriteIndex:12},
 {id:"brave",fr:"courageux — courageuse",ar:"شجاع — شجاعة",note:"-eux تصبح -euse",speech:["courageux","courageuse"],spriteIndex:13},
 {id:"honest",fr:"honnête",ar:"صادق — صادقة",note:"الصيغة الفرنسية نفسها",speech:["honnête"],spriteIndex:14},
 {id:"creative",fr:"créatif — créative",ar:"مبدع — مبدعة",note:"-if تصبح -ive",speech:["créatif","créative"],spriteIndex:15},
 {id:"organized",fr:"organisé — organisée",ar:"منظم — منظمة",note:"المذكر ثم المؤنث",speech:["organisé","organisée"],spriteIndex:16},
 {id:"shy",fr:"timide",ar:"خجول — خجولة",note:"الصيغة الفرنسية نفسها",speech:["timide"],spriteIndex:17},
 {id:"reserved",fr:"réservé — réservée",ar:"متحفظ — متحفظة",note:"المذكر ثم المؤنث",speech:["réservé","réservée"],spriteIndex:18},
 {id:"talkative",fr:"bavard — bavarde",ar:"كثير الكلام — كثيرة الكلام",note:"المذكر ثم المؤنث",speech:["bavard","bavarde"],spriteIndex:19},
 {id:"quiet",fr:"silencieux — silencieuse",ar:"قليل الكلام — قليلة الكلام",note:"-eux تصبح -euse",speech:["silencieux","silencieuse"],spriteIndex:20},
 {id:"strict",fr:"strict — stricte",ar:"صارم — صارمة",note:"المذكر ثم المؤنث",speech:["strict","stricte"],spriteIndex:21},
 {id:"gentle",fr:"doux — douce",ar:"لطيف الطباع — لطيفة الطباع",note:"صيغة غير منتظمة",speech:["doux","douce"],spriteIndex:22},
 {id:"lazy",fr:"paresseux — paresseuse",ar:"كسول — كسولة",note:"-eux تصبح -euse",speech:["paresseux","paresseuse"],spriteIndex:23},
 {id:"disorganized",fr:"désordonné — désordonnée",ar:"غير منظم — غير منظمة",note:"المذكر ثم المؤنث",speech:["désordonné","désordonnée"],spriteIndex:24},
 {id:"rude",fr:"impoli — impolie",ar:"غير مؤدب — غير مؤدبة",note:"المذكر ثم المؤنث",speech:["impoli","impolie"],spriteIndex:25},
 {id:"mean",fr:"méchant — méchante",ar:"سيئ الطباع — سيئة الطباع",note:"المذكر ثم المؤنث",speech:["méchant","méchante"],spriteIndex:26},
 {id:"impatient",fr:"impatient — impatiente",ar:"غير صبور — غير صبورة",note:"المذكر ثم المؤنث",speech:["impatient","impatiente"],spriteIndex:27},
 {id:"selfish",fr:"égoïste",ar:"أناني — أنانية",note:"الصيغة الفرنسية نفسها",speech:["égoïste"],spriteIndex:28},
 {id:"stubborn",fr:"têtu — têtue",ar:"عنيد — عنيدة",note:"المذكر ثم المؤنث",speech:["têtu","têtue"],spriteIndex:29,quizAr:"عنيد"}
];

export const ADJECTIVE_PRACTICE_ITEMS=[
 APPEARANCE_ADJECTIVES[0],APPEARANCE_ADJECTIVES[9],APPEARANCE_ADJECTIVES[12],
 HAIR_EYES_ADJECTIVES[2],HAIR_EYES_ADJECTIVES[12],
 PERSONALITY_ADJECTIVES[0],PERSONALITY_ADJECTIVES[3],PERSONALITY_ADJECTIVES[5],PERSONALITY_ADJECTIVES[11],PERSONALITY_ADJECTIVES[29]
];

export const ADJECTIVE_QUIZ_ITEMS=[...ADJECTIVE_PRACTICE_ITEMS];
