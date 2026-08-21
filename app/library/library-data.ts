export type DictionaryEntry = {
  id: string;
  letter: string;
  word: string;
  arabic: string;
  example: string;
  exampleArabic: string;
};

export const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export const dictionaryEntries: DictionaryEntry[] = [
  { id: "amour", letter: "A", word: "amour", arabic: "حُب", example: "L'amour rend la vie plus belle.", exampleArabic: "الحب يجعل الحياة أجمل." },
  { id: "arbre", letter: "A", word: "arbre", arabic: "شجرة", example: "Cet arbre est très ancien.", exampleArabic: "هذه الشجرة قديمة جدًا." },
  { id: "bonjour", letter: "B", word: "bonjour", arabic: "مرحبًا", example: "Bonjour, comment allez-vous ?", exampleArabic: "مرحبًا، كيف حالك؟" },
  { id: "bibliotheque", letter: "B", word: "bibliothèque", arabic: "مكتبة", example: "Je travaille à la bibliothèque.", exampleArabic: "أعمل في المكتبة." },
  { id: "chateau", letter: "C", word: "château", arabic: "قلعة", example: "Le château domine la ville.", exampleArabic: "تطل القلعة على المدينة." },
  { id: "cafe", letter: "C", word: "café", arabic: "قهوة / مقهى", example: "Nous prenons un café ensemble.", exampleArabic: "نشرب القهوة معًا." },
  { id: "dictionnaire", letter: "D", word: "dictionnaire", arabic: "قاموس", example: "Je cherche ce mot dans le dictionnaire.", exampleArabic: "أبحث عن هذه الكلمة في القاموس." },
  { id: "demain", letter: "D", word: "demain", arabic: "غدًا", example: "Nous partirons demain matin.", exampleArabic: "سنغادر صباح الغد." },
  { id: "ecole", letter: "E", word: "école", arabic: "مدرسة", example: "Les enfants vont à l'école.", exampleArabic: "يذهب الأطفال إلى المدرسة." },
  { id: "ecouter", letter: "E", word: "écouter", arabic: "يستمع", example: "J'aime écouter la radio française.", exampleArabic: "أحب الاستماع إلى الإذاعة الفرنسية." },
  { id: "famille", letter: "F", word: "famille", arabic: "عائلة", example: "Ma famille habite à Riyad.", exampleArabic: "تعيش عائلتي في الرياض." },
  { id: "francais", letter: "F", word: "français", arabic: "اللغة الفرنسية", example: "J'apprends le français chaque jour.", exampleArabic: "أتعلم الفرنسية كل يوم." },
  { id: "gare", letter: "G", word: "gare", arabic: "محطة قطار", example: "Le train arrive à la gare.", exampleArabic: "يصل القطار إلى المحطة." },
  { id: "garcon", letter: "G", word: "garçon", arabic: "ولد", example: "Le garçon lit un roman.", exampleArabic: "يقرأ الولد رواية." },
  { id: "hotel", letter: "H", word: "hôtel", arabic: "فندق", example: "Notre hôtel est près du musée.", exampleArabic: "فندقنا قريب من المتحف." },
  { id: "heureux", letter: "H", word: "heureux", arabic: "سعيد", example: "Je suis heureux de vous rencontrer.", exampleArabic: "أنا سعيد بلقائك." },
  { id: "idee", letter: "I", word: "idée", arabic: "فكرة", example: "C'est une excellente idée.", exampleArabic: "إنها فكرة ممتازة." },
  { id: "image", letter: "I", word: "image", arabic: "صورة", example: "Cette image raconte une histoire.", exampleArabic: "تحكي هذه الصورة قصة." },
  { id: "jardin", letter: "J", word: "jardin", arabic: "حديقة", example: "Les fleurs poussent dans le jardin.", exampleArabic: "تنمو الأزهار في الحديقة." },
  { id: "jour", letter: "J", word: "jour", arabic: "يوم", example: "Quel beau jour !", exampleArabic: "يا له من يوم جميل!" },
  { id: "kilo", letter: "K", word: "kilo", arabic: "كيلوغرام", example: "Je voudrais un kilo de pommes.", exampleArabic: "أريد كيلوغرامًا من التفاح." },
  { id: "livre", letter: "L", word: "livre", arabic: "كتاب", example: "Ce livre est passionnant.", exampleArabic: "هذا الكتاب ممتع." },
  { id: "langue", letter: "L", word: "langue", arabic: "لغة", example: "Le français est une belle langue.", exampleArabic: "الفرنسية لغة جميلة." },
  { id: "maison", letter: "M", word: "maison", arabic: "منزل", example: "La maison donne sur le parc.", exampleArabic: "يطل المنزل على الحديقة." },
  { id: "merci", letter: "M", word: "merci", arabic: "شكرًا", example: "Merci beaucoup pour votre aide.", exampleArabic: "شكرًا جزيلًا على مساعدتك." },
  { id: "nature", letter: "N", word: "nature", arabic: "طبيعة", example: "Nous protégeons la nature.", exampleArabic: "نحن نحمي الطبيعة." },
  { id: "nuit", letter: "N", word: "nuit", arabic: "ليل", example: "La ville brille la nuit.", exampleArabic: "تلمع المدينة ليلًا." },
  { id: "ouvrir", letter: "O", word: "ouvrir", arabic: "يفتح", example: "Pouvez-vous ouvrir la fenêtre ?", exampleArabic: "هل يمكنك فتح النافذة؟" },
  { id: "orange", letter: "O", word: "orange", arabic: "برتقالة", example: "Cette orange est très douce.", exampleArabic: "هذه البرتقالة حلوة جدًا." },
  { id: "parler", letter: "P", word: "parler", arabic: "يتحدث", example: "Elle parle français couramment.", exampleArabic: "هي تتحدث الفرنسية بطلاقة." },
  { id: "paris", letter: "P", word: "Paris", arabic: "باريس", example: "Paris est la capitale de la France.", exampleArabic: "باريس عاصمة فرنسا." },
  { id: "question", letter: "Q", word: "question", arabic: "سؤال", example: "J'ai une question importante.", exampleArabic: "لدي سؤال مهم." },
  { id: "quatre", letter: "Q", word: "quatre", arabic: "أربعة", example: "La table a quatre pieds.", exampleArabic: "للطاولة أربع أرجل." },
  { id: "regarder", letter: "R", word: "regarder", arabic: "يشاهد", example: "Nous regardons un film français.", exampleArabic: "نشاهد فيلمًا فرنسيًا." },
  { id: "restaurant", letter: "R", word: "restaurant", arabic: "مطعم", example: "Ce restaurant ouvre à midi.", exampleArabic: "يفتح هذا المطعم عند الظهر." },
  { id: "soleil", letter: "S", word: "soleil", arabic: "شمس", example: "Le soleil se lève tôt.", exampleArabic: "تشرق الشمس مبكرًا." },
  { id: "savoir", letter: "S", word: "savoir", arabic: "يعرف", example: "Je voudrais savoir la réponse.", exampleArabic: "أود معرفة الإجابة." },
  { id: "train", letter: "T", word: "train", arabic: "قطار", example: "Le train part à huit heures.", exampleArabic: "يغادر القطار الساعة الثامنة." },
  { id: "travail", letter: "T", word: "travail", arabic: "عمل", example: "Il aime son travail.", exampleArabic: "هو يحب عمله." },
  { id: "universite", letter: "U", word: "université", arabic: "جامعة", example: "Elle étudie à l'université.", exampleArabic: "هي تدرس في الجامعة." },
  { id: "utile", letter: "U", word: "utile", arabic: "مفيد", example: "Ce conseil est très utile.", exampleArabic: "هذه النصيحة مفيدة جدًا." },
  { id: "ville", letter: "V", word: "ville", arabic: "مدينة", example: "La ville est calme ce matin.", exampleArabic: "المدينة هادئة هذا الصباح." },
  { id: "voiture", letter: "V", word: "voiture", arabic: "سيارة", example: "La voiture est devant l'hôtel.", exampleArabic: "السيارة أمام الفندق." },
  { id: "wagon", letter: "W", word: "wagon", arabic: "عربة قطار", example: "Notre place est dans le dernier wagon.", exampleArabic: "مقعدنا في عربة القطار الأخيرة." },
  { id: "weekend", letter: "W", word: "week-end", arabic: "عطلة نهاية الأسبوع", example: "Nous voyageons ce week-end.", exampleArabic: "سنسافر في عطلة نهاية الأسبوع." },
  { id: "xylophone", letter: "X", word: "xylophone", arabic: "آلة إكسليفون", example: "L'enfant joue du xylophone.", exampleArabic: "يعزف الطفل على آلة الإكسليفون." },
  { id: "yaourt", letter: "Y", word: "yaourt", arabic: "زبادي", example: "Je mange un yaourt au petit-déjeuner.", exampleArabic: "آكل الزبادي في الإفطار." },
  { id: "yeux", letter: "Y", word: "yeux", arabic: "عيون", example: "Elle a les yeux bleus.", exampleArabic: "لديها عيون زرقاء." },
  { id: "zoo", letter: "Z", word: "zoo", arabic: "حديقة حيوانات", example: "Les enfants visitent le zoo.", exampleArabic: "يزور الأطفال حديقة الحيوانات." },
  { id: "zero", letter: "Z", word: "zéro", arabic: "صفر", example: "La température est de zéro degré.", exampleArabic: "درجة الحرارة صفر." },
];

