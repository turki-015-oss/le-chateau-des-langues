export type VisualVocabularyItem={
 id:string;
 fr:string;
 ar:string;
 note:string;
 speech:string[];
 spriteIndex:number;
 quizAr?:string;
};

export const FAMILY_VOCABULARY:VisualVocabularyItem[]=[
 {id:"father",fr:"le père",ar:"الأب",note:"مذكر",speech:["le père"],spriteIndex:0},
 {id:"mother",fr:"la mère",ar:"الأم",note:"مؤنث",speech:["la mère"],spriteIndex:1},
 {id:"parents",fr:"les parents",ar:"الوالدان",note:"جمع",speech:["les parents"],spriteIndex:2},
 {id:"son",fr:"le fils",ar:"الابن",note:"مذكر",speech:["le fils"],spriteIndex:3},
 {id:"daughter",fr:"la fille",ar:"الابنة",note:"مؤنث",speech:["la fille"],spriteIndex:4},
 {id:"children",fr:"les enfants",ar:"الأبناء أو الأطفال",note:"جمع",speech:["les enfants"],spriteIndex:5},
 {id:"brother",fr:"le frère",ar:"الأخ",note:"مذكر",speech:["le frère"],spriteIndex:6},
 {id:"sister",fr:"la sœur",ar:"الأخت",note:"مؤنث",speech:["la sœur"],spriteIndex:7},
 {id:"husband",fr:"le mari",ar:"الزوج",note:"مذكر",speech:["le mari"],spriteIndex:8},
 {id:"wife",fr:"la femme",ar:"الزوجة",note:"مؤنث",speech:["la femme"],spriteIndex:9},
 {id:"grandfather",fr:"le grand-père",ar:"الجد",note:"مذكر",speech:["le grand-père"],spriteIndex:10},
 {id:"grandmother",fr:"la grand-mère",ar:"الجدة",note:"مؤنث",speech:["la grand-mère"],spriteIndex:11},
 {id:"grandparents",fr:"les grands-parents",ar:"الأجداد",note:"جمع",speech:["les grands-parents"],spriteIndex:12},
 {id:"uncle",fr:"l’oncle",ar:"العم أو الخال",note:"مذكر",speech:["l’oncle"],spriteIndex:13},
 {id:"aunt",fr:"la tante",ar:"العمة أو الخالة",note:"مؤنث",speech:["la tante"],spriteIndex:14},
 {id:"male-cousin",fr:"le cousin",ar:"ابن العم أو الخال",note:"مذكر",speech:["le cousin"],spriteIndex:15},
 {id:"female-cousin",fr:"la cousine",ar:"بنت العم أو الخال",note:"مؤنث",speech:["la cousine"],spriteIndex:16},
 {id:"nephew",fr:"le neveu",ar:"ابن الأخ أو الأخت",note:"مذكر",speech:["le neveu"],spriteIndex:17},
 {id:"niece",fr:"la nièce",ar:"بنت الأخ أو الأخت",note:"مؤنث",speech:["la nièce"],spriteIndex:18},
 {id:"grandchildren",fr:"les petits-enfants",ar:"الأحفاد",note:"جمع",speech:["les petits-enfants"],spriteIndex:19}
];

export const PHYSICAL_STATE_VOCABULARY:VisualVocabularyItem[]=[
 {id:"tired",fr:"Je suis fatigué — Je suis fatiguée",ar:"أنا متعب — أنا متعبة",note:"المذكر ثم المؤنث",speech:["Je suis fatigué.","Je suis fatiguée."],spriteIndex:0,quizAr:"أنا متعب."},
 {id:"sleepy",fr:"J’ai sommeil",ar:"أشعر بالنعاس",note:"حالة جسدية",speech:["J’ai sommeil."],spriteIndex:1},
 {id:"hungry",fr:"J’ai faim",ar:"أنا جائع",note:"تعبير ثابت مع avoir",speech:["J’ai faim."],spriteIndex:2},
 {id:"thirsty",fr:"J’ai soif",ar:"أنا عطشان",note:"تعبير ثابت مع avoir",speech:["J’ai soif."],spriteIndex:3},
 {id:"hot",fr:"J’ai chaud",ar:"أشعر بالحر",note:"تعبير ثابت مع avoir",speech:["J’ai chaud."],spriteIndex:4},
 {id:"cold",fr:"J’ai froid",ar:"أشعر بالبرد",note:"تعبير ثابت مع avoir",speech:["J’ai froid."],spriteIndex:5},
 {id:"fit",fr:"Je suis en forme",ar:"أنا نشيط وبحالة جيدة",note:"حالة عامة",speech:["Je suis en forme."],spriteIndex:6},
 {id:"feel-well",fr:"Je me sens bien",ar:"أشعر أنني بخير",note:"إحساس عام",speech:["Je me sens bien."],spriteIndex:7},
 {id:"feel-unwell",fr:"Je me sens mal",ar:"أشعر أنني لست بخير",note:"إحساس عام",speech:["Je me sens mal."],spriteIndex:8},
 {id:"sick",fr:"Je suis malade",ar:"أنا مريض",note:"الصفة لا تتغير هنا",speech:["Je suis malade."],spriteIndex:9},
 {id:"weak",fr:"Je suis faible",ar:"أنا ضعيف",note:"الصفة لا تتغير هنا",speech:["Je suis faible."],spriteIndex:10},
 {id:"pain",fr:"J’ai mal",ar:"أشعر بألم",note:"ألم عام",speech:["J’ai mal."],spriteIndex:11},
 {id:"headache",fr:"J’ai mal à la tête",ar:"رأسي يؤلمني",note:"ألم الرأس",speech:["J’ai mal à la tête."],spriteIndex:12},
 {id:"stomachache",fr:"J’ai mal au ventre",ar:"بطني يؤلمني",note:"ألم البطن",speech:["J’ai mal au ventre."],spriteIndex:13},
 {id:"backache",fr:"J’ai mal au dos",ar:"ظهري يؤلمني",note:"ألم الظهر",speech:["J’ai mal au dos."],spriteIndex:14},
 {id:"toothache",fr:"J’ai mal aux dents",ar:"أسناني تؤلمني",note:"ألم الأسنان",speech:["J’ai mal aux dents."],spriteIndex:15},
 {id:"fever",fr:"J’ai de la fièvre",ar:"لدي حمى",note:"عرض صحي",speech:["J’ai de la fièvre."],spriteIndex:16},
 {id:"cold-illness",fr:"Je suis enrhumé — Je suis enrhumée",ar:"أنا مصاب بالزكام — أنا مصابة بالزكام",note:"المذكر ثم المؤنث",speech:["Je suis enrhumé.","Je suis enrhumée."],spriteIndex:17,quizAr:"أنا مصاب بالزكام."},
 {id:"coughing",fr:"Je tousse",ar:"أنا أسعل",note:"فعل في المضارع",speech:["Je tousse."],spriteIndex:18},
 {id:"sneezing",fr:"J’éternue",ar:"أنا أعطس",note:"فعل في المضارع",speech:["J’éternue."],spriteIndex:19},
 {id:"injured",fr:"Je suis blessé — Je suis blessée",ar:"أنا مصاب — أنا مصابة",note:"المذكر ثم المؤنث",speech:["Je suis blessé.","Je suis blessée."],spriteIndex:20,quizAr:"أنا مصاب."},
 {id:"need-rest",fr:"J’ai besoin de repos",ar:"أحتاج إلى الراحة",note:"حاجة يومية",speech:["J’ai besoin de repos."],spriteIndex:21},
 {id:"ready",fr:"Je suis prêt — Je suis prête",ar:"أنا مستعد — أنا مستعدة",note:"المذكر ثم المؤنث",speech:["Je suis prêt.","Je suis prête."],spriteIndex:22,quizAr:"أنا مستعد."},
 {id:"hurry",fr:"Je suis pressé — Je suis pressée",ar:"أنا مستعجل — أنا مستعجلة",note:"المذكر ثم المؤنث",speech:["Je suis pressé.","Je suis pressée."],spriteIndex:23,quizAr:"أنا مستعجل."},
 {id:"busy",fr:"Je suis occupé — Je suis occupée",ar:"أنا مشغول — أنا مشغولة",note:"المذكر ثم المؤنث",speech:["Je suis occupé.","Je suis occupée."],spriteIndex:24,quizAr:"أنا مشغول."}
];

export const EMOTION_VOCABULARY:VisualVocabularyItem[]=[
 {id:"content",fr:"Je suis content — Je suis contente",ar:"أنا مسرور — أنا مسرورة",note:"المذكر ثم المؤنث",speech:["Je suis content.","Je suis contente."],spriteIndex:0,quizAr:"أنا مسرور."},
 {id:"happy",fr:"Je suis heureux — Je suis heureuse",ar:"أنا سعيد — أنا سعيدة",note:"المذكر ثم المؤنث",speech:["Je suis heureux.","Je suis heureuse."],spriteIndex:1,quizAr:"أنا سعيد."},
 {id:"joyful",fr:"Je suis joyeux — Je suis joyeuse",ar:"أنا مبتهج — أنا مبتهجة",note:"المذكر ثم المؤنث",speech:["Je suis joyeux.","Je suis joyeuse."],spriteIndex:2,quizAr:"أنا مبتهج."},
 {id:"delighted",fr:"Je suis ravi — Je suis ravie",ar:"أنا مسرور جدًا — أنا مسرورة جدًا",note:"المذكر ثم المؤنث",speech:["Je suis ravi.","Je suis ravie."],spriteIndex:3,quizAr:"أنا مسرور جدًا."},
 {id:"sad",fr:"Je suis triste",ar:"أنا حزين",note:"الصفة لا تتغير هنا",speech:["Je suis triste."],spriteIndex:4},
 {id:"angry",fr:"Je suis en colère",ar:"أنا غاضب",note:"تعبير ثابت",speech:["Je suis en colère."],spriteIndex:5},
 {id:"upset",fr:"Je suis fâché — Je suis fâchée",ar:"أنا منزعج — أنا منزعجة",note:"المذكر ثم المؤنث",speech:["Je suis fâché.","Je suis fâchée."],spriteIndex:6,quizAr:"أنا منزعج."},
 {id:"afraid",fr:"J’ai peur",ar:"أنا خائف",note:"تعبير ثابت مع avoir",speech:["J’ai peur."],spriteIndex:7},
 {id:"worried",fr:"Je suis inquiet — Je suis inquiète",ar:"أنا قلق — أنا قلقة",note:"المذكر ثم المؤنث",speech:["Je suis inquiet.","Je suis inquiète."],spriteIndex:8,quizAr:"أنا قلق."},
 {id:"stressed",fr:"Je suis stressé — Je suis stressée",ar:"أنا متوتر — أنا متوترة",note:"المذكر ثم المؤنث",speech:["Je suis stressé.","Je suis stressée."],spriteIndex:9,quizAr:"أنا متوتر."},
 {id:"calm",fr:"Je suis calme",ar:"أنا هادئ",note:"الصفة لا تتغير هنا",speech:["Je suis calme."],spriteIndex:10},
 {id:"surprised",fr:"Je suis surpris — Je suis surprise",ar:"أنا متفاجئ — أنا متفاجئة",note:"المذكر ثم المؤنث",speech:["Je suis surpris.","Je suis surprise."],spriteIndex:11,quizAr:"أنا متفاجئ."},
 {id:"enthusiastic",fr:"Je suis enthousiaste",ar:"أنا متحمس",note:"الصفة لا تتغير هنا",speech:["Je suis enthousiaste."],spriteIndex:12},
 {id:"bored",fr:"Je m’ennuie",ar:"أنا أشعر بالملل",note:"فعل في المضارع",speech:["Je m’ennuie."],spriteIndex:13},
 {id:"embarrassed",fr:"Je suis gêné — Je suis gênée",ar:"أنا محرج — أنا محرجة",note:"المذكر ثم المؤنث",speech:["Je suis gêné.","Je suis gênée."],spriteIndex:14,quizAr:"أنا محرج."},
 {id:"proud",fr:"Je suis fier — Je suis fière",ar:"أنا فخور — أنا فخورة",note:"المذكر ثم المؤنث",speech:["Je suis fier.","Je suis fière."],spriteIndex:15,quizAr:"أنا فخور."},
 {id:"disappointed",fr:"Je suis déçu — Je suis déçue",ar:"أنا خائب الأمل — أنا خائبة الأمل",note:"المذكر ثم المؤنث",speech:["Je suis déçu.","Je suis déçue."],spriteIndex:16,quizAr:"أنا خائب الأمل."},
 {id:"relieved",fr:"Je suis soulagé — Je suis soulagée",ar:"أنا مرتاح — أنا مرتاحة",note:"المذكر ثم المؤنث",speech:["Je suis soulagé.","Je suis soulagée."],spriteIndex:17,quizAr:"أنا مرتاح."},
 {id:"satisfied",fr:"Je suis satisfait — Je suis satisfaite",ar:"أنا راضٍ — أنا راضية",note:"المذكر ثم المؤنث",speech:["Je suis satisfait.","Je suis satisfaite."],spriteIndex:18,quizAr:"أنا راضٍ."},
 {id:"curious",fr:"Je suis curieux — Je suis curieuse",ar:"أنا فضولي — أنا فضولية",note:"المذكر ثم المؤنث",speech:["Je suis curieux.","Je suis curieuse."],spriteIndex:19,quizAr:"أنا فضولي."},
 {id:"motivated",fr:"Je suis motivé — Je suis motivée",ar:"أنا متحفز — أنا متحفزة",note:"المذكر ثم المؤنث",speech:["Je suis motivé.","Je suis motivée."],spriteIndex:20,quizAr:"أنا متحفز."},
 {id:"lonely",fr:"Je me sens seul — Je me sens seule",ar:"أشعر بالوحدة",note:"المذكر ثم المؤنث",speech:["Je me sens seul.","Je me sens seule."],spriteIndex:21},
 {id:"in-love",fr:"Je suis amoureux — Je suis amoureuse",ar:"أنا واقع في الحب — أنا واقعة في الحب",note:"المذكر ثم المؤنث",speech:["Je suis amoureux.","Je suis amoureuse."],spriteIndex:22,quizAr:"أنا واقع في الحب."},
 {id:"good-mood",fr:"Je suis de bonne humeur",ar:"مزاجي جيد",note:"تعبير ثابت",speech:["Je suis de bonne humeur."],spriteIndex:23},
 {id:"bad-mood",fr:"Je suis de mauvaise humeur",ar:"مزاجي سيئ",note:"تعبير ثابت",speech:["Je suis de mauvaise humeur."],spriteIndex:24},
 {id:"sorry",fr:"Je suis désolé — Je suis désolée",ar:"أنا آسف — أنا آسفة",note:"المذكر ثم المؤنث",speech:["Je suis désolé.","Je suis désolée."],spriteIndex:25,quizAr:"أنا آسف."},
 {id:"smiling",fr:"Je souris",ar:"أنا أبتسم",note:"فعل في المضارع",speech:["Je souris."],spriteIndex:26},
 {id:"laughing",fr:"Je ris",ar:"أنا أضحك",note:"فعل في المضارع",speech:["Je ris."],spriteIndex:27},
 {id:"crying",fr:"Je pleure",ar:"أنا أبكي",note:"فعل في المضارع",speech:["Je pleure."],spriteIndex:28},
 {id:"pleased",fr:"Ça me fait plaisir",ar:"هذا يسعدني",note:"تعبير ثابت",speech:["Ça me fait plaisir."],spriteIndex:29}
];

export const DESCRIPTION_QUIZ_ITEMS=[
 FAMILY_VOCABULARY[0],FAMILY_VOCABULARY[6],FAMILY_VOCABULARY[13],
 PHYSICAL_STATE_VOCABULARY[0],PHYSICAL_STATE_VOCABULARY[2],PHYSICAL_STATE_VOCABULARY[12],PHYSICAL_STATE_VOCABULARY[21],
 EMOTION_VOCABULARY[1],EMOTION_VOCABULARY[7],EMOTION_VOCABULARY[10]
];

export const DESCRIPTION_PRACTICE_ITEMS=[
 FAMILY_VOCABULARY[0],FAMILY_VOCABULARY[1],FAMILY_VOCABULARY[6],
 PHYSICAL_STATE_VOCABULARY[0],PHYSICAL_STATE_VOCABULARY[2],PHYSICAL_STATE_VOCABULARY[12],PHYSICAL_STATE_VOCABULARY[21],
 EMOTION_VOCABULARY[1],EMOTION_VOCABULARY[7],EMOTION_VOCABULARY[10]
];
