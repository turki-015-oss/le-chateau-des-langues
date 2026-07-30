"use client";

import Link from "next/link";
import {useMemo,useState} from "react";
import type {LucideIcon} from "lucide-react";
import {
 ArrowRight,BookOpen,Building2,CalendarDays,ChevronLeft,Clock3,Compass,
 GraduationCap,Languages,LibraryBig,ListChecks,Map,MessageCircle,Mic2,
 NotebookTabs,Play,School,ShoppingBag,Sparkles,Users,Volume2
} from "lucide-react";
import {speakFrench,speakFrenchWithPause} from "@/lib/frenchSpeech";

type Example={fr:string;ar:string};
type LessonSection={title:string;subtitle:string;explanation:string;points:string[];examples:Example[]};
type CourseModule={
 id:string;
 title:string;
 ar:string;
 description:string;
 icon:LucideIcon;
 sections:LessonSection[];
};
type Level={id:"A1"|"A2";label:string;ar:string;description:string;modules:CourseModule[]};

const section=(title:string,subtitle:string,explanation:string,points:string[],examples:Example[]):LessonSection=>({
 title,subtitle,explanation,points,examples
});

const A1_MODULES:CourseModule[]=[
 {
  id:"alphabet",title:"L’alphabet et les lettres",ar:"الأبجدية والحروف",icon:Languages,
  description:"ابدأ من الصفر: أسماء الحروف الفرنسية، شكلها، وطريقة استخدامها داخل كلمات بسيطة.",
  sections:[
   section("Les 26 lettres","الحروف الفرنسية الأساسية","تستخدم الفرنسية الحروف اللاتينية الستة والعشرين. تعلّم اسم كل حرف أولًا، ثم اربطه بكلمة واضحة. اسم الحرف لا يساوي دائمًا صوته داخل الكلمة؛ لذلك يأتي تدريب الأصوات في الوحدة التالية.",[
    "اضغط على أي حرف في اللوحة لسماع اسمه بالنطق الفرنسي.",
    "اقرأ الحرف الكبير والصغير معًا: A / a، B / b.",
    "كرّر الكلمة المصاحبة للحرف، ولا تحفظ الحرف منفصلًا فقط."
   ],[
    {fr:"A comme ami.",ar:"الحرف A مثل كلمة صديق."},
    {fr:"B comme bonjour.",ar:"الحرف B مثل كلمة مرحبًا."},
    {fr:"C comme café.",ar:"الحرف C مثل كلمة مقهى."}
   ]),
   section("Les signes français","العلامات والحروف الخاصة","العلامات مثل é وè وê وç لا تضيف حروفًا جديدة إلى الأبجدية، لكنها تغيّر النطق أو توضح شكل الكلمة. يجب تعلّم الكلمة مع علامتها منذ البداية.",[
    "é غالبًا صوت مغلق مثل été.",
    "è وê غالبًا صوت مفتوح مثل père وfête.",
    "ç يجعل الحرف c يُنطق مثل s أمام a وo وu.",
    "œ يظهر في كلمات مهمة مثل cœur وsœur."
   ],[
    {fr:"été",ar:"صيف"},
    {fr:"père",ar:"أب"},
    {fr:"français",ar:"فرنسي"},
    {fr:"cœur",ar:"قلب"}
   ])
  ]
 },
 {
  id:"sounds",title:"Les sons essentiels",ar:"الأصوات الأساسية",icon:Mic2,
  description:"قواعد النطق الأولى: الحروف المركبة، الحروف الصامتة، والربط بين الكلمات.",
  sections:[
   section("Voyelles et groupes de lettres","الحركات ومجموعات الحروف","في الفرنسية قد تصنع عدة حروف صوتًا واحدًا. معرفة المجموعات المتكررة تجعل قراءة الكلمات الجديدة أسهل بكثير.",[
    "ou يُنطق مثل صوت «و»: vous.",
    "oi قريب من «وا»: moi.",
    "au وeau غالبًا صوت o: eau، beau.",
    "on وan وin أصوات أنفية يخرج جزء منها من الأنف."
   ],[
    {fr:"Vous parlez français.",ar:"أنت تتحدث الفرنسية."},
    {fr:"Moi, je m’appelle Lina.",ar:"أنا، اسمي لينا."},
    {fr:"Il fait beau aujourd’hui.",ar:"الطقس جميل اليوم."}
   ]),
   section("Lettres finales et liaison","نهايات الكلمات والربط","كثير من الحروف في نهاية الكلمة لا تُنطق، لكن بعض الكلمات ترتبط بما بعدها عندما تبدأ الكلمة التالية بحركة.",[
    "الحروف s وt وd وx غالبًا صامتة في نهاية الكلمة.",
    "في les amis نربط s بصوت z: لي زامي.",
    "في un enfant يحدث ربط بين الكلمتين.",
    "لا تطبق الربط عشوائيًا؛ احفظه مع العبارات الشائعة."
   ],[
    {fr:"Les amis arrivent.",ar:"الأصدقاء يصلون."},
    {fr:"Un enfant intelligent.",ar:"طفل ذكي."},
    {fr:"Il est petit.",ar:"هو صغير."}
   ])
  ]
 },
 {
  id:"greetings",title:"Saluer et se présenter",ar:"التحية والتعريف بالنفس",icon:MessageCircle,
  description:"التحية، الاسم، البلد، اللغة، المهنة، وطرح الأسئلة الشخصية البسيطة.",
  sections:[
   section("Les salutations","عبارات التحية","تختلف التحية حسب الوقت ودرجة الرسمية. Bonjour مناسبة في أغلب المواقف، بينما Salut تستخدم مع الأصدقاء.",[
    "Bonjour للتحية الرسمية أو العامة نهارًا.",
    "Bonsoir من المساء.",
    "Salut غير رسمية وقد تعني مرحبًا أو إلى اللقاء.",
    "Au revoir للوداع، وÀ bientôt تعني أراك قريبًا."
   ],[
    {fr:"Bonjour madame, comment allez-vous ?",ar:"مرحبًا سيدتي، كيف حالك؟"},
    {fr:"Salut Sami, ça va ?",ar:"مرحبًا سامي، هل أنت بخير؟"},
    {fr:"Au revoir et à bientôt.",ar:"إلى اللقاء وأراك قريبًا."}
   ]),
   section("Parler de soi","التعريف بالنفس","استخدم Je m’appelle للاسم، Je suis للجنسية أو المهنة، وJ’habite à لمكان السكن. السؤال الرسمي يستخدم vous وغير الرسمي يستخدم tu.",[
    "Comment vous appelez-vous ? للسؤال الرسمي عن الاسم.",
    "D’où venez-vous ? للسؤال عن البلد.",
    "Quelle langue parlez-vous ? للسؤال عن اللغة.",
    "Quel est votre métier ? للسؤال عن المهنة."
   ],[
    {fr:"Je m’appelle Nora et je suis saoudienne.",ar:"اسمي نورة وأنا سعودية."},
    {fr:"J’habite à Riyad.",ar:"أسكن في الرياض."},
    {fr:"Je parle arabe et un peu français.",ar:"أتحدث العربية وقليلًا من الفرنسية."}
   ])
  ]
 },
 {
  id:"nouns",title:"Noms, articles et pluriel",ar:"الأسماء وأدوات التعريف والجمع",icon:NotebookTabs,
  description:"تمييز المذكر والمؤنث، أدوات التعريف والنكرة، وصناعة الجمع.",
  sections:[
   section("Le genre et les articles","الجنس وأدوات الاسم","كل اسم فرنسي مذكر أو مؤنث. احفظ الاسم مع أداته دائمًا، لأن شكل الاسم وحده لا يكفي لمعرفة جنسه.",[
    "un للمذكر وune للمؤنث في النكرة.",
    "le للمذكر وla للمؤنث في المعرفة.",
    "l’ قبل الحركة للمذكر والمؤنث.",
    "les للجمع المعرف وdes للجمع غير المعرف."
   ],[
    {fr:"C’est un livre.",ar:"هذا كتاب."},
    {fr:"C’est une table.",ar:"هذه طاولة."},
    {fr:"L’université est grande.",ar:"الجامعة كبيرة."}
   ]),
   section("Former le pluriel","تكوين الجمع","القاعدة العامة إضافة s إلى الاسم، وغالبًا لا تُنطق هذه الـs. توجد نهايات لها قواعد خاصة تُكتسب تدريجيًا.",[
    "un étudiant → des étudiants.",
    "une classe → des classes.",
    "بعض كلمات -al تصبح -aux مثل journal → journaux.",
    "الأداة هي أوضح علامة للجمع في الكلام."
   ],[
    {fr:"Les étudiants sont dans la classe.",ar:"الطلاب داخل الفصل."},
    {fr:"J’ai des livres français.",ar:"لدي كتب فرنسية."},
    {fr:"Voici deux journaux.",ar:"إليك صحيفتين."}
   ])
  ]
 },
 {
  id:"core-verbs",title:"Pronoms, être et avoir",ar:"الضمائر وفعلا être وavoir",icon:Users,
  description:"أساس بناء الجملة الفرنسية: ضمائر الفاعل وتصريف أهم فعلين.",
  sections:[
   section("Les pronoms sujets","ضمائر الفاعل","يظهر ضمير الفاعل عادة قبل الفعل. الفرنسية لا تحذف الضمير كما يحدث أحيانًا في العربية.",[
    "je أنا، tu أنت غير الرسمي، vous أنتم أو حضرتك.",
    "il هو وelle هي.",
    "nous نحن، ils هم، elles هن.",
    "on شائع جدًا بمعنى نحن في الحديث اليومي."
   ],[
    {fr:"Je suis étudiant.",ar:"أنا طالب."},
    {fr:"Nous parlons français.",ar:"نحن نتحدث الفرنسية."},
    {fr:"On va à la bibliothèque.",ar:"نحن ذاهبون إلى المكتبة."}
   ]),
   section("Être et avoir","يكون ويمتلك","être يصف الهوية والحالة والمكان، وavoir يعبّر عن الملكية ويستخدم في تعبيرات العمر والجوع والعطش.",[
    "être: suis, es, est, sommes, êtes, sont.",
    "avoir: ai, as, a, avons, avez, ont.",
    "العمر بالفرنسية مع avoir: J’ai vingt ans.",
    "الجوع والعطش أيضًا مع avoir: J’ai faim، J’ai soif."
   ],[
    {fr:"Elle est professeur.",ar:"هي معلمة."},
    {fr:"Nous avons un cours.",ar:"لدينا درس."},
    {fr:"J’ai vingt ans et j’ai faim.",ar:"عمري عشرون عامًا وأنا جائع."}
   ])
  ]
 },
 {
  id:"present",title:"Le présent et la négation",ar:"المضارع والنفي",icon:BookOpen,
  description:"تصريف أفعال الحاضر المنتظمة، أهم الأفعال الشائعة، وبناء النفي.",
  sections:[
   section("Verbes réguliers","الأفعال المنتظمة","لأفعال -er نحذف er ونضيف النهايات المناسبة. أفعال -ir و-re لها أنماط أخرى، ويجب تعلّم المجموعة مع أمثلة.",[
    "parler: parle, parles, parle, parlons, parlez, parlent.",
    "finir: finis, finis, finit, finissons, finissez, finissent.",
    "attendre: attends, attends, attend, attendons, attendez, attendent.",
    "النهايات المكتوبة لا تُنطق كلها؛ استمع إلى الجملة كاملة."
   ],[
    {fr:"Je travaille à l’université.",ar:"أعمل في الجامعة."},
    {fr:"Nous finissons le cours.",ar:"ننهي الدرس."},
    {fr:"Ils attendent le professeur.",ar:"هم ينتظرون المعلم."}
   ]),
   section("Négation et questions","النفي والسؤال","نضع ne قبل الفعل وpas بعده. وفي الكلام قد تسقط ne، لكن الأفضل كتابتها في المستوى الأول.",[
    "Je parle → Je ne parle pas.",
    "قبل الحركة تصبح ne إلى n’: Je n’habite pas ici.",
    "السؤال البسيط بالنبرة: Vous parlez français ?",
    "الصيغة الواضحة: Est-ce que vous parlez français ?"
   ],[
    {fr:"Je ne comprends pas.",ar:"أنا لا أفهم."},
    {fr:"Est-ce que tu étudies aujourd’hui ?",ar:"هل تدرس اليوم؟"},
    {fr:"Où habitez-vous ?",ar:"أين تسكن؟"}
   ])
  ]
 },
 {
  id:"numbers-time",title:"Nombres, heure et date",ar:"الأرقام والوقت والتاريخ",icon:Clock3,
  description:"العد، الأسعار، رقم الهاتف، الساعة، أيام الأسبوع، الأشهر والتاريخ.",
  sections:[
   section("Les nombres","الأعداد والاستخدام اليومي","تُستخدم الأرقام في العمر والسعر والهاتف والعنوان. بعد 69 تصبح البنية الفرنسية خاصة، مثل soixante-dix وquatre-vingts.",[
    "0–16 كلمات أساسية تُحفظ.",
    "17–19: dix-sept، dix-huit، dix-neuf.",
    "21: vingt et un، و31: trente et un.",
    "80: quatre-vingts، و81: quatre-vingt-un."
   ],[
    {fr:"Le livre coûte vingt euros.",ar:"سعر الكتاب عشرون يورو."},
    {fr:"J’ai trente-deux ans.",ar:"عمري اثنان وثلاثون عامًا."},
    {fr:"Mon numéro est le zéro six…",ar:"رقمي هو صفر ستة…"}
   ]),
   section("L’heure et le calendrier","الساعة والتقويم","للساعة نستخدم Il est، وللتاريخ نستخدم Nous sommes أو On est. أسماء الأيام والأشهر لا تبدأ بحرف كبير عادة.",[
    "Il est huit heures et demie: الثامنة والنصف.",
    "Il est midi: الظهر، Il est minuit: منتصف الليل.",
    "lundi إلى dimanche هي أيام الأسبوع.",
    "Aujourd’hui، demain، hier: اليوم، غدًا، أمس."
   ],[
    {fr:"Le cours commence à neuf heures.",ar:"يبدأ الدرس الساعة التاسعة."},
    {fr:"Nous sommes le cinq septembre.",ar:"نحن في الخامس من سبتمبر."},
    {fr:"Je travaille du lundi au jeudi.",ar:"أعمل من الاثنين إلى الخميس."}
   ])
  ]
 },
 {
  id:"description",title:"Famille et description",ar:"العائلة والوصف",icon:Users,
  description:"المفردات العائلية، صفات الملكية، وصف الأشخاص والأشياء.",
  sections:[
   section("La famille et la possession","العائلة والملكية","تتفق صفة الملكية مع الشيء المملوك لا مع صاحب الشيء. لذلك نقول mon père وma mère.",[
    "mon, ma, mes: لي.",
    "ton, ta, tes: لك.",
    "son, sa, ses: له أو لها.",
    "notre, votre, leur للمفرد وnos, vos, leurs للجمع."
   ],[
    {fr:"Voici ma sœur et mon frère.",ar:"هذه أختي وهذا أخي."},
    {fr:"Nos parents habitent à Djeddah.",ar:"والدانا يسكنان في جدة."},
    {fr:"Leur maison est grande.",ar:"منزلهم كبير."}
   ]),
   section("Les adjectifs","الصفات والمطابقة","غالبًا تأتي الصفة بعد الاسم وتتفق معه في التذكير والتأنيث والإفراد والجمع. توجد صفات شائعة تأتي قبل الاسم.",[
    "petit → petite، grand → grande.",
    "heureux → heureuse.",
    "beau, joli, jeune, vieux غالبًا قبل الاسم.",
    "في الجمع نضيف s غالبًا."
   ],[
    {fr:"C’est une petite maison blanche.",ar:"إنه منزل صغير أبيض."},
    {fr:"Mon frère est sérieux et calme.",ar:"أخي جاد وهادئ."},
    {fr:"Elle a de beaux yeux.",ar:"لديها عينان جميلتان."}
   ])
  ]
 },
 {
  id:"daily-life",title:"La vie quotidienne",ar:"الحياة اليومية",icon:CalendarDays,
  description:"الروتين، الأفعال الضميرية، التكرار، الدعوات، والأنشطة اليومية.",
  sections:[
   section("Les verbes pronominaux","الأفعال الضميرية","تأتي أفعال الروتين كثيرًا مع ضمير يعود على الفاعل: me, te, se, nous, vous, se.",[
    "Je me lève: أستيقظ/أنهض.",
    "Tu te prépares: تستعد.",
    "Nous nous reposons: نستريح.",
    "مع النفي: Je ne me couche pas tard."
   ],[
    {fr:"Je me lève à sept heures.",ar:"أنهض الساعة السابعة."},
    {fr:"Nous nous préparons pour le cours.",ar:"نستعد للدرس."},
    {fr:"Elle se couche tôt.",ar:"هي تنام مبكرًا."}
   ]),
   section("Fréquence et activités","التكرار والأنشطة","تساعد ظروف التكرار على وصف العادات. ضعها غالبًا بعد الفعل المصرف.",[
    "toujours دائمًا، souvent غالبًا، parfois أحيانًا.",
    "rarement نادرًا، jamais أبدًا.",
    "faire du sport، lire، regarder un film.",
    "للرغبة: Je voudrais… وللدعوة: Tu veux… ?"
   ],[
    {fr:"Je vais souvent à la bibliothèque.",ar:"أذهب غالبًا إلى المكتبة."},
    {fr:"Nous faisons du sport le soir.",ar:"نمارس الرياضة مساءً."},
    {fr:"Tu veux prendre un café ?",ar:"هل تريد تناول قهوة؟"}
   ])
  ]
 },
 {
  id:"situations",title:"Situations de la vie réelle",ar:"مواقف الحياة الواقعية",icon:Map,
  description:"المدينة والاتجاهات والمطعم والتسوق والسفر بعبارات A1 عملية.",
  sections:[
   section("Ville et directions","المدينة والاتجاهات","للسؤال عن مكان استخدم Où est… أو Comment aller à…؟ وللتوجيه استخدم أفعال الحركة وصيغ المكان.",[
    "à droite يمينًا، à gauche يسارًا، tout droit مباشرة.",
    "près de قريب من، loin de بعيد عن.",
    "devant أمام، derrière خلف، entre بين.",
    "Prenez la première rue: خذ الشارع الأول."
   ],[
    {fr:"Où est la gare, s’il vous plaît ?",ar:"أين المحطة من فضلك؟"},
    {fr:"Allez tout droit puis tournez à gauche.",ar:"اذهب مباشرة ثم انعطف يسارًا."},
    {fr:"La banque est en face du café.",ar:"البنك مقابل المقهى."}
   ]),
   section("Commander et acheter","الطلب والشراء","في المطعم والمتجر استخدم Je voudrais لصيغة مهذبة، وCombien للسعر أو الكمية.",[
    "Je voudrais… أودّ.",
    "Combien ça coûte ? كم سعره؟",
    "du, de la, de l’, des للكميات غير المحددة.",
    "بعد النفي تتحول غالبًا إلى de: Je ne veux pas de sucre."
   ],[
    {fr:"Je voudrais un café et un croissant.",ar:"أود قهوة وقطعة كرواسون."},
    {fr:"Combien coûte cette chemise ?",ar:"كم سعر هذا القميص؟"},
    {fr:"Je prends de l’eau sans sucre.",ar:"سآخذ ماءً دون سكر."}
   ])
  ]
 }
];

const A2_MODULES:CourseModule[]=[
 {
  id:"revision",title:"Consolider le présent",ar:"تثبيت الحاضر والتواصل",icon:Sparkles,
  description:"مراجعة ذكية للحاضر مع أسئلة أكثر طبيعية وإجابات أطول.",
  sections:[
   section("Présent et verbes fréquents","الحاضر والأفعال الشائعة","في A2 ننتقل من الجملة القصيرة إلى فقرة مترابطة. ركّز على الأفعال غير المنتظمة الأكثر استعمالًا وعلى توافقها مع الفاعل.",[
    "aller, venir, prendre, mettre, pouvoir, vouloir, devoir.",
    "استخدم d’abord، ensuite، puis لترتيب الأفكار.",
    "اجمع العادة والرأي والسبب في إجابة واحدة.",
    "راجع النفي مع jamais، plus، rien."
   ],[
    {fr:"D’abord, je prends le métro, puis je marche jusqu’au bureau.",ar:"أولًا أستقل المترو، ثم أمشي حتى المكتب."},
    {fr:"Je ne travaille plus le samedi.",ar:"لم أعد أعمل يوم السبت."},
    {fr:"Nous devons partir parce que le magasin ferme.",ar:"يجب أن نغادر لأن المتجر يغلق."}
   ]),
   section("Questions naturelles","الأسئلة الطبيعية","تعلم اختيار صيغة السؤال المناسبة: نبرة الحديث، est-ce que، أو القلب في السياق الرسمي.",[
    "Tu viens demain ? شائع في الحديث.",
    "Est-ce que vous avez réservé ? واضح ومحايد.",
    "Où allez-vous ? مناسب ورسمي.",
    "استخدم pourquoi وcomment وdepuis quand لتوسيع الحوار."
   ],[
    {fr:"Depuis quand habitez-vous ici ?",ar:"منذ متى تسكن هنا؟"},
    {fr:"Pourquoi est-ce que tu apprends le français ?",ar:"لماذا تتعلم الفرنسية؟"},
    {fr:"Comment avez-vous trouvé cet appartement ?",ar:"كيف وجدت هذه الشقة؟"}
   ])
  ]
 },
 {
  id:"passe-compose",title:"Le passé composé",ar:"الماضي المركب",icon:Clock3,
  description:"رواية حدث مكتمل في الماضي باستخدام avoir أو être.",
  sections:[
   section("Avec avoir","الماضي مع avoir","نبني الماضي المركب من فعل مساعد في الحاضر واسم المفعول. معظم الأفعال تستخدم avoir.",[
    "parler → j’ai parlé.",
    "finir → j’ai fini.",
    "prendre → j’ai pris.",
    "في النفي: Je n’ai pas compris."
   ],[
    {fr:"Hier, j’ai visité le musée.",ar:"أمس زرت المتحف."},
    {fr:"Nous avons terminé le projet.",ar:"أنهينا المشروع."},
    {fr:"Elle n’a pas reçu le message.",ar:"لم تستلم الرسالة."}
   ]),
   section("Avec être","الماضي مع être","تستخدم مجموعة من أفعال الحركة وعموم الأفعال الضميرية être. يطابق اسم المفعول جنس الفاعل وعدده.",[
    "Elle est arrivée، Ils sont partis.",
    "Nous sommes restés à la maison.",
    "Elle s’est levée tôt.",
    "مع الجمع المؤنث: Elles sont arrivées."
   ],[
    {fr:"Marie est arrivée à huit heures.",ar:"وصلت ماري الساعة الثامنة."},
    {fr:"Ils sont partis en train.",ar:"غادروا بالقطار."},
    {fr:"Nous nous sommes rencontrés à Paris.",ar:"التقينا في باريس."}
   ])
  ]
 },
 {
  id:"imparfait",title:"L’imparfait et le récit",ar:"الماضي الناقص والسرد",icon:BookOpen,
  description:"وصف الماضي والعادات والتمييز بين الخلفية والحدث.",
  sections:[
   section("Former l’imparfait","تكوين الماضي الناقص","نأخذ جذر صيغة nous في الحاضر بعد حذف -ons ثم نضيف النهايات: ais, ais, ait, ions, iez, aient.",[
    "nous parlons → je parlais.",
    "nous finissons → elle finissait.",
    "être استثناء: j’étais.",
    "يستخدم للعادات والوصف والحالة المستمرة."
   ],[
    {fr:"Quand j’étais petit, je jouais dehors.",ar:"عندما كنت صغيرًا كنت ألعب في الخارج."},
    {fr:"Il faisait froid et la rue était calme.",ar:"كان الجو باردًا والشارع هادئًا."},
    {fr:"Nous allions souvent chez nos grands-parents.",ar:"كنا نذهب كثيرًا إلى بيت أجدادنا."}
   ]),
   section("Imparfait ou passé composé","التمييز بين الماضيين","الماضي الناقص يرسم الخلفية أو العادة، والماضي المركب يقدّم الحدث المحدد الذي وقع وانتهى.",[
    "الخلفية: Il pleuvait.",
    "الحدث: Le bus est arrivé.",
    "قد يجتمعان: Je dormais quand le téléphone a sonné.",
    "استخدم soudain للحدث المفاجئ وpendant que للخلفية."
   ],[
    {fr:"Je marchais quand j’ai vu Paul.",ar:"كنت أمشي عندما رأيت بول."},
    {fr:"Pendant qu’elle travaillait, son ami a appelé.",ar:"بينما كانت تعمل اتصل صديقها."},
    {fr:"La salle était pleine, puis le concert a commencé.",ar:"كانت القاعة ممتلئة، ثم بدأ الحفل."}
   ])
  ]
 },
 {
  id:"future",title:"Parler de l’avenir",ar:"التحدث عن المستقبل",icon:CalendarDays,
  description:"المستقبل القريب والبسيط والخطط والمواعيد والتوقعات.",
  sections:[
   section("Le futur proche","المستقبل القريب","نستخدم aller في الحاضر مع المصدر للخطط القريبة أو النية الواضحة.",[
    "Je vais étudier ce soir.",
    "Nous allons voyager en juin.",
    "في النفي: Je ne vais pas sortir.",
    "أضف bientôt، ce soir، la semaine prochaine."
   ],[
    {fr:"Je vais commencer un nouveau cours.",ar:"سأبدأ دورة جديدة."},
    {fr:"Nous allons déménager le mois prochain.",ar:"سننتقل إلى منزل آخر الشهر القادم."},
    {fr:"Il ne va pas travailler demain.",ar:"لن يعمل غدًا."}
   ]),
   section("Le futur simple","المستقبل البسيط","يستخدم للوعد أو التوقع أو حدث أبعد. نضيف النهايات ai, as, a, ons, ez, ont إلى المصدر غالبًا.",[
    "parler → je parlerai.",
    "finir → nous finirons.",
    "être → je serai، avoir → j’aurai.",
    "aller → j’irai، faire → je ferai."
   ],[
    {fr:"Un jour, je parlerai français couramment.",ar:"يومًا ما سأتحدث الفرنسية بطلاقة."},
    {fr:"Vous recevrez une réponse demain.",ar:"ستتلقى ردًا غدًا."},
    {fr:"Nous serons à Paris en juillet.",ar:"سنكون في باريس في يوليو."}
   ])
  ]
 },
 {
  id:"pronouns",title:"Pronoms compléments",ar:"ضمائر المفعول",icon:Users,
  description:"استبدال الأسماء لتجنب التكرار: le, la, les, lui, leur.",
  sections:[
   section("Complément direct","المفعول المباشر","ضمائر المفعول المباشر le, la, les تأتي قبل الفعل المصرف وتستبدل شخصًا أو شيئًا دون حرف جر.",[
    "Je vois Marie → Je la vois.",
    "Il achète le livre → Il l’achète.",
    "Nous invitons nos amis → Nous les invitons.",
    "في الماضي: Je l’ai acheté."
   ],[
    {fr:"Cette chanson, je l’écoute souvent.",ar:"هذه الأغنية أستمع إليها كثيرًا."},
    {fr:"Tes clés ? Je ne les trouve pas.",ar:"مفاتيحك؟ لا أجدها."},
    {fr:"Nous l’avons rencontré hier.",ar:"قابلناه أمس."}
   ]),
   section("Complément indirect","المفعول غير المباشر","lui وleur يستبدلان شخصًا يأتي عادة بعد à. لا يتغير lui حسب الجنس.",[
    "Je parle à Lina → Je lui parle.",
    "Il écrit à ses parents → Il leur écrit.",
    "الضمير يسبق الفعل.",
    "مع المصدر يبقى قبل المصدر: Je vais lui téléphoner."
   ],[
    {fr:"Je lui envoie un message.",ar:"أرسل له/لها رسالة."},
    {fr:"Nous leur expliquons le problème.",ar:"نشرح لهم المشكلة."},
    {fr:"Tu peux lui répondre demain.",ar:"يمكنك الرد عليه/عليها غدًا."}
   ])
  ]
 },
 {
  id:"quantity",title:"Quantités, y et en",ar:"الكميات والضميران y وen",icon:ShoppingBag,
  description:"التعبير عن الكمية واستبدال المكان أو الشيء المسبوق بـ de وà.",
  sections:[
   section("Articles partitifs et quantité","أدوات التجزئة والكمية","نستخدم du, de la, de l’, des لكمية غير محددة. بعد كمية محددة نستخدم de.",[
    "du pain، de la soupe، de l’eau، des légumes.",
    "un kilo de pommes، beaucoup de travail.",
    "بعد النفي غالبًا de: Je ne bois pas de café.",
    "السؤال عن الكمية: combien de… ?"
   ],[
    {fr:"Je voudrais un peu de fromage.",ar:"أود قليلًا من الجبن."},
    {fr:"Nous achetons beaucoup de légumes.",ar:"نشتري الكثير من الخضروات."},
    {fr:"Il ne mange pas de viande.",ar:"هو لا يأكل اللحم."}
   ]),
   section("Les pronoms y et en","الضميران y وen","y يستبدل مكانًا أو تركيبًا مع à، وen يستبدل تركيبًا مع de أو كمية.",[
    "Je vais à la gare → J’y vais.",
    "Je parle de ce projet → J’en parle.",
    "Tu veux du café ? Oui, j’en veux.",
    "مع المستقبل القريب: Je vais y aller."
   ],[
    {fr:"Tu vas à l’université ? Oui, j’y vais.",ar:"هل تذهب إلى الجامعة؟ نعم، أذهب إليها."},
    {fr:"Vous avez des questions ? J’en ai deux.",ar:"هل لديكم أسئلة؟ لدي سؤالان."},
    {fr:"Ce problème, nous en parlons demain.",ar:"هذه المشكلة سنتحدث عنها غدًا."}
   ])
  ]
 },
 {
  id:"comparison",title:"Comparer et préciser",ar:"المقارنة والتحديد",icon:ListChecks,
  description:"المقارنة، التفضيل، والظروف التي تجعل التعبير أدق.",
  sections:[
   section("Comparatif et superlatif","المقارنة والتفضيل","نستخدم plus… que للزيادة، moins… que للنقصان، aussi… que للتساوي. وصيغة التفضيل مع le/la/les plus.",[
    "plus grand que: أكبر من.",
    "moins cher que: أرخص من.",
    "aussi intéressant que: ممتع بالقدر نفسه.",
    "bon → meilleur، bien → mieux."
   ],[
    {fr:"Ce train est plus rapide que le bus.",ar:"هذا القطار أسرع من الحافلة."},
    {fr:"Cette chambre est moins chère.",ar:"هذه الغرفة أقل سعرًا."},
    {fr:"C’est le meilleur restaurant du quartier.",ar:"هذا أفضل مطعم في الحي."}
   ]),
   section("Adverbes et intensité","الظروف ودرجة الوصف","تحوّل ظروف كثيرة الصفة إلى وصف للفعل، وغالبًا تنتهي بـ -ment.",[
    "rapide → rapidement.",
    "sérieux → sérieusement.",
    "très, assez, trop, vraiment لدرجة الصفة.",
    "ضع الظرف بعد الفعل البسيط غالبًا."
   ],[
    {fr:"Elle parle lentement et clairement.",ar:"هي تتحدث ببطء ووضوح."},
    {fr:"Cet exercice est assez facile.",ar:"هذا التمرين سهل إلى حد ما."},
    {fr:"Il conduit trop rapidement.",ar:"هو يقود بسرعة زائدة."}
   ])
  ]
 },
 {
  id:"politeness",title:"Demander et conseiller",ar:"الطلب والنصيحة",icon:MessageCircle,
  description:"الشرط الحاضر للتهذيب والنصيحة والاقتراح والاحتمال.",
  sections:[
   section("Le conditionnel de politesse","الشرط للطلب المهذب","تظهر صيغ مثل je voudrais وpourriez-vous باستمرار في الخدمات والمواقف الرسمية.",[
    "Je voudrais… لطلب مهذب.",
    "Pourriez-vous… ? هل يمكنكم؟",
    "J’aimerais… أرغب في.",
    "صيغة الشرط أخف من الأمر المباشر."
   ],[
    {fr:"Je voudrais réserver une chambre.",ar:"أود حجز غرفة."},
    {fr:"Pourriez-vous parler moins vite ?",ar:"هل يمكنكم التحدث ببطء أكثر؟"},
    {fr:"J’aimerais changer de billet.",ar:"أرغب في تغيير التذكرة."}
   ]),
   section("Conseils et obligation","النصيحة والالتزام","نستخدم devoir للواجب، il faut للضرورة العامة، وpouvoir للإمكان أو الإذن.",[
    "Tu devrais… نصيحة لطيفة.",
    "Vous devez… واجب مباشر.",
    "Il faut + مصدر: يجب بشكل عام.",
    "On peut… اقتراح أو إمكانية."
   ],[
    {fr:"Tu devrais consulter un médecin.",ar:"ينبغي أن تستشير طبيبًا."},
    {fr:"Il faut apporter une pièce d’identité.",ar:"يجب إحضار إثبات هوية."},
    {fr:"On peut prendre le métro.",ar:"يمكننا استخدام المترو."}
   ])
  ]
 },
 {
  id:"connectors",title:"Relier ses idées",ar:"ربط الأفكار",icon:NotebookTabs,
  description:"الضمائر النسبية وأدوات السبب والنتيجة والتعارض لبناء فقرة A2.",
  sections:[
   section("Qui, que et où","الضمائر النسبية","تجمع الضمائر النسبية جملتين دون تكرار الاسم. qui يكون فاعلًا، que مفعولًا، وoù للمكان أو الزمن.",[
    "La femme qui parle… المرأة التي تتحدث.",
    "Le livre que je lis… الكتاب الذي أقرأه.",
    "La ville où j’habite… المدينة التي أسكن فيها.",
    "لا تترجم حرفيًا؛ حدّد وظيفة الاسم داخل الجملة الثانية."
   ],[
    {fr:"C’est un professeur qui explique très bien.",ar:"إنه معلم يشرح جيدًا جدًا."},
    {fr:"Voici le film que nous avons vu.",ar:"هذا هو الفيلم الذي شاهدناه."},
    {fr:"Paris est la ville où ils se sont rencontrés.",ar:"باريس هي المدينة التي التقيا فيها."}
   ]),
   section("Cause, conséquence et opposition","السبب والنتيجة والتعارض","تسمح الروابط ببناء حديث منظم يتجاوز الجمل المنفصلة.",[
    "parce que وcar للسبب.",
    "donc وc’est pourquoi للنتيجة.",
    "mais وpourtant للتعارض.",
    "d’abord, ensuite, enfin لترتيب الفقرة."
   ],[
    {fr:"Je reste chez moi parce qu’il pleut.",ar:"سأبقى في المنزل لأن الجو ممطر."},
    {fr:"Le train est annulé, donc nous prenons le bus.",ar:"أُلغي القطار، لذلك سنأخذ الحافلة."},
    {fr:"Le travail est difficile, pourtant il est intéressant.",ar:"العمل صعب، لكنه مع ذلك ممتع."}
   ])
  ]
 },
 {
  id:"themes",title:"Communiquer dans la vie réelle",ar:"التواصل في الحياة الواقعية",icon:Compass,
  description:"الصحة والسكن والعمل والسفر والمشكلات اليومية بمستوى A2.",
  sections:[
   section("Santé, logement et travail","الصحة والسكن والعمل","في A2 تستطيع وصف مشكلة بتفاصيلها، شرح مدتها، وطلب حل مناسب.",[
    "J’ai mal à… لوصف الألم.",
    "depuis لحدث ما زال مستمرًا.",
    "السكن: loyer, voisin, panne, chauffage.",
    "العمل: contrat, horaires, collègue, entretien."
   ],[
    {fr:"J’ai mal au dos depuis trois jours.",ar:"أشعر بألم في الظهر منذ ثلاثة أيام."},
    {fr:"Le chauffage ne fonctionne plus dans l’appartement.",ar:"لم تعد التدفئة تعمل في الشقة."},
    {fr:"J’ai un entretien d’embauche lundi matin.",ar:"لدي مقابلة عمل صباح الاثنين."}
   ]),
   section("Voyage et imprévus","السفر والمواقف الطارئة","تعلم شرح ما حدث، ما تحتاجه الآن، وما الحل الذي تقترحه.",[
    "وصف المشكلة بالماضي المركب.",
    "إضافة الخلفية بالماضي الناقص.",
    "طلب الحل بالشرط المهذب.",
    "تأكيد التفاصيل: رقم الحجز، الوقت، المكان."
   ],[
    {fr:"J’ai raté mon train parce que le bus était en retard.",ar:"فاتني القطار لأن الحافلة كانت متأخرة."},
    {fr:"Pourriez-vous me proposer un autre départ ?",ar:"هل يمكنكم اقتراح موعد مغادرة آخر؟"},
    {fr:"Ma valise n’est pas arrivée avec le vol.",ar:"لم تصل حقيبتي مع الرحلة."}
   ])
  ]
 },
 {
  id:"expression",title:"S’exprimer avec autonomie",ar:"التعبير باستقلالية",icon:GraduationCap,
  description:"الرأي والموافقة والاختلاف ورسالة أو فقرة منظمة في نهاية A2.",
  sections:[
   section("Donner son opinion","إبداء الرأي","ابدأ برأيك، أعط سببًا ومثالًا، ثم اختم بفكرة واضحة. هذه البنية مناسبة للكلام والكتابة.",[
    "À mon avis… في رأيي.",
    "Je pense que… أعتقد أن.",
    "Je suis d’accord / Je ne suis pas tout à fait d’accord.",
    "مثال: par exemple، خاتمة: finalement أو pour conclure."
   ],[
    {fr:"À mon avis, les transports publics sont très utiles.",ar:"في رأيي، وسائل النقل العامة مفيدة جدًا."},
    {fr:"Je suis d’accord, mais il faut améliorer les horaires.",ar:"أنا موافق، لكن يجب تحسين المواعيد."},
    {fr:"Pour conclure, cette solution est la plus pratique.",ar:"في الختام، هذا الحل هو الأكثر عملية."}
   ]),
   section("Écrire un message structuré","كتابة رسالة منظمة","تتكون الرسالة من تحية، سبب الكتابة، التفاصيل أو الطلب، ثم صيغة ختام مناسبة.",[
    "Bonjour Madame / Monsieur للسياق الرسمي.",
    "Je vous écris pour… أكتب إليكم من أجل.",
    "Merci d’avance pour votre réponse.",
    "Cordialement ختام رسمي، À bientôt ختام ودي."
   ],[
    {fr:"Je vous écris pour confirmer mon rendez-vous.",ar:"أكتب إليكم لتأكيد موعدي."},
    {fr:"Pourriez-vous m’envoyer les informations nécessaires ?",ar:"هل يمكنكم إرسال المعلومات اللازمة لي؟"},
    {fr:"Merci d’avance. Cordialement, Sara.",ar:"شكرًا مقدمًا. مع التحية، سارة."}
   ])
  ]
 }
];

const LEVELS:Level[]=[
 {id:"A1",label:"Débutant",ar:"المستوى المبتدئ",description:"من الأبجدية والنطق إلى التواصل في المواقف اليومية الأساسية.",modules:A1_MODULES},
 {id:"A2",label:"Élémentaire",ar:"المستوى الأساسي المتقدم",description:"بناء سرد أوضح، استخدام الأزمنة، والتعامل باستقلالية أكبر.",modules:A2_MODULES}
];

const ALPHABET=[
 ["A","a","ami","صديق"],["B","bé","bonjour","مرحبًا"],["C","cé","café","مقهى"],
 ["D","dé","deux","اثنان"],["E","e","école","مدرسة"],["F","effe","famille","عائلة"],
 ["G","gé","gare","محطة"],["H","ache","hôtel","فندق"],["I","i","ici","هنا"],
 ["J","ji","jour","يوم"],["K","ka","kilo","كيلو"],["L","elle","livre","كتاب"],
 ["M","emme","maison","منزل"],["N","enne","nom","اسم"],["O","o","orange","برتقال"],
 ["P","pé","porte","باب"],["Q","ku","question","سؤال"],["R","erre","restaurant","مطعم"],
 ["S","esse","salut","مرحبًا"],["T","té","train","قطار"],["U","u","université","جامعة"],
 ["V","vé","ville","مدينة"],["W","double vé","wagon","عربة"],["X","iks","taxi","سيارة أجرة"],
 ["Y","i grec","stylo","قلم"],["Z","zède","zoo","حديقة حيوانات"]
];

export default function UniversityPage(){
 const [levelId,setLevelId]=useState<"A1"|"A2">("A1");
 const level=LEVELS.find(item=>item.id===levelId)!;
 const [moduleId,setModuleId]=useState(A1_MODULES[0].id);
 const [activeLetter,setActiveLetter]=useState("A");
 const activeModule=useMemo(()=>level.modules.find(item=>item.id===moduleId)??level.modules[0],[level,moduleId]);
 const ActiveModuleIcon=activeModule.icon;

 const selectLevel=(id:"A1"|"A2")=>{
  const next=LEVELS.find(item=>item.id===id)!;
  setLevelId(id);
  setModuleId(next.modules[0].id);
  window.setTimeout(()=>document.getElementById("university-course")?.scrollIntoView({behavior:"smooth",block:"start"}),30);
 };

 const selectModule=(id:string)=>{
  setModuleId(id);
  window.setTimeout(()=>document.getElementById("university-lesson")?.scrollIntoView({behavior:"smooth",block:"start"}),30);
 };

 return <main className="university-world" dir="rtl">
  <header className="university-topbar">
   <Link href="/kingdom" aria-label="العودة إلى الخريطة"><ArrowRight/></Link>
   <div><span>جامعة القلعة</span><strong>L’Université Royale</strong></div>
   <div className="university-seal"><GraduationCap/></div>
  </header>

  <section className="university-hero">
   <img src="/university/interior-campus.jpg" alt="ردهة داخلية حديثة في جامعة"/>
   <div className="university-hero-shade"/>
   <div className="university-hero-copy">
    <span><School/> Campus académique</span>
    <h1>L’Université Royale</h1>
    <h2>جامعة القلعة</h2>
    <p>تعلّم الفرنسية داخل قاعات الجامعة خطوة بخطوة، مع شرح عربي واضح ونطق فرنسي للكلمات والجمل في كل وحدة.</p>
    <a href="#university-levels"><BookOpen/> دخول قاعات الدراسة</a>
   </div>
  </section>

  <section className="university-intro">
   <article><Building2/><div><strong>بيئة جامعية داخلية</strong><span>قاعات، وحدات، وشروح منظمة</span></div></article>
   <article><LibraryBig/><div><strong>منهج كامل</strong><span>من A1 إلى نهاية A2</span></div></article>
   <article><Volume2/><div><strong>نطق تفاعلي</strong><span>الحروف والأمثلة بصوت فرنسي</span></div></article>
  </section>

  <section className="university-level-section" id="university-levels">
   <div className="university-section-heading">
    <span>Facultés de langue</span>
    <h2>اختر المستوى الدراسي</h2>
    <p>جميع الوحدات مفتوحة، ولا توجد اختبارات. انتقل بينها بالترتيب أو اختر ما تحتاجه مباشرة.</p>
   </div>
   <div className="university-level-grid">
    {LEVELS.map(item=><button key={item.id} className={levelId===item.id?"active":""} onClick={()=>selectLevel(item.id)}>
     <div className="university-level-code">{item.id}</div>
     <div><span>{item.label}</span><h3>{item.ar}</h3><p>{item.description}</p><small>{item.modules.length} وحدات · شرح وأمثلة ونطق</small></div>
     <ChevronLeft/>
    </button>)}
   </div>
  </section>

  <section className="university-course" id="university-course">
   <aside className="university-sidebar">
    <div><span>Programme {level.id}</span><h2>{level.ar}</h2><p>{level.description}</p></div>
    <nav aria-label={`وحدات المستوى ${level.id}`}>
     {level.modules.map((item,index)=>{
      const Icon=item.icon;
      return <button key={item.id} className={activeModule.id===item.id?"active":""} onClick={()=>selectModule(item.id)}>
       <i><Icon/></i><span><small>الوحدة {index+1}</small><strong>{item.ar}</strong><em>{item.title}</em></span><ChevronLeft/>
      </button>;
     })}
    </nav>
   </aside>

   <article className="university-lesson" id="university-lesson">
    <header>
     <div className="university-lesson-icon"><ActiveModuleIcon/></div>
     <div>
      <span>{level.id} · Cours {level.modules.findIndex(item=>item.id===activeModule.id)+1}</span>
      <h2>{activeModule.ar}</h2>
      <div className="university-spoken-title">
       <h3>{activeModule.title}</h3>
       <button onClick={()=>void speakFrench(activeModule.title)} aria-label={`استمع إلى ${activeModule.title}`}><Volume2/><b>استمع</b></button>
      </div>
      <p>{activeModule.description}</p>
     </div>
    </header>

    {activeModule.id==="alphabet"&&<section className="university-alphabet">
     <div className="university-subheading"><div><span>Alphabet interactif</span><h3>اضغط على الحرف لسماع نطقه</h3></div><Volume2/></div>
     <div className="university-letter-grid">
      {ALPHABET.map(([letter,pronunciation,word,meaning])=><button key={letter} className={activeLetter===letter?"active":""} aria-label={`استمع إلى الحرف ${letter} ثم كلمة ${word}`} onClick={()=>{setActiveLetter(letter);void speakFrenchWithPause(pronunciation,word,700,{rate:.72})}}>
       <b>{letter}</b><span>{pronunciation}</span><small>{word}</small><em>{meaning}</em>
      </button>)}
     </div>
     <div className="university-letter-focus">
      <div><span>الحرف المحدد</span><b>{activeLetter}</b></div>
      <p>اضغط مرة أخرى وكرّر اسم الحرف بصوت مرتفع، ثم استمع إلى الكلمة المرتبطة به.</p>
      <button onClick={()=>{const item=ALPHABET.find(value=>value[0]===activeLetter)!;void speakFrenchWithPause(item[1],item[2],700,{rate:.72})}}><Play/> نطق الحرف ثم الكلمة</button>
     </div>
    </section>}

    <div className="university-sections">
     {activeModule.sections.map((item,index)=><section key={item.title} className="university-explanation">
      <div className="university-explanation-title">
       <span>{String(index+1).padStart(2,"0")}</span>
       <div><h3>{item.title}</h3><small>{item.subtitle}</small></div>
       <button onClick={()=>void speakFrench(item.title)} aria-label={`استمع إلى ${item.title}`}><Volume2/><b>نطق العنوان</b></button>
      </div>
      <p className="university-explanation-text">{item.explanation}</p>
      <div className="university-rule-list">{item.points.map(point=><p key={point}><i>✓</i>{point}</p>)}</div>
      <div className="university-example-list">
       <h4><MessageCircle/> Exemples expliqués</h4>
       {item.examples.map(example=><article key={example.fr}>
        <button onClick={()=>void speakFrench(example.fr)} aria-label={`استمع إلى ${example.fr}`}><Volume2/><b>استمع</b></button>
        <div><strong dir="ltr">{example.fr}</strong><span>{example.ar}</span></div>
       </article>)}
      </div>
     </section>)}
    </div>

    <footer className="university-lesson-footer">
     <LibraryBig/><div><strong>نهاية شرح هذه الوحدة</strong><span>اختر الوحدة التالية من قائمة المنهج. لا يوجد اختبار أو قفل للمحتوى.</span></div>
    </footer>
   </article>
  </section>
 </main>;
}
