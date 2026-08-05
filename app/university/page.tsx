"use client";

import Link from "next/link";
import {useMemo,useState} from "react";
import type {LucideIcon} from "lucide-react";
import {
 ArrowRight,BookOpen,Building2,CalendarDays,ChevronLeft,ChevronRight,Clock3,Compass,
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

const SMALL_FRENCH_NUMBERS=[
 "zéro","un","deux","trois","quatre","cinq","six","sept","huit","neuf",
 "dix","onze","douze","treize","quatorze","quinze","seize","dix-sept","dix-huit","dix-neuf"
];

function numberToFrench(value:number){
 if(value<20)return SMALL_FRENCH_NUMBERS[value];
 if(value===100)return "cent";
 if(value<70){
  const tens=Math.floor(value/10);
  const unit=value%10;
  const tensWord={2:"vingt",3:"trente",4:"quarante",5:"cinquante",6:"soixante"}[tens as 2|3|4|5|6];
  if(unit===0)return tensWord;
  if(unit===1)return `${tensWord} et un`;
  return `${tensWord}-${SMALL_FRENCH_NUMBERS[unit]}`;
 }
 if(value<80){
  const remainder=value-60;
  if(remainder===11)return "soixante et onze";
  return `soixante-${SMALL_FRENCH_NUMBERS[remainder]}`;
 }
 if(value===80)return "quatre-vingts";
 return `quatre-vingt-${SMALL_FRENCH_NUMBERS[value-80]}`;
}

const NUMBER_PAGES=[
 {label:"0 – 20",numbers:Array.from({length:21},(_,index)=>index)},
 {label:"21 – 40",numbers:Array.from({length:20},(_,index)=>index+21)},
 {label:"41 – 60",numbers:Array.from({length:20},(_,index)=>index+41)},
 {label:"61 – 80",numbers:Array.from({length:20},(_,index)=>index+61)},
 {label:"81 – 100",numbers:Array.from({length:20},(_,index)=>index+81)},
 {label:"الأعداد الكبيرة",numbers:[1000,2000,10000,1000000]}
].map(page=>({
 ...page,
 items:page.numbers.map(number=>({
  number,
  french:number===1000?"mille":number===2000?"deux mille":number===10000?"dix mille":number===1000000?"un million":numberToFrench(number)
 }))
}));

const INTRODUCTION_PAGES=[
 {
  label:"التحية وبدء الحديث",
  description:"عبارات مناسبة لفتح الحديث بطريقة رسمية أو ودية.",
  items:[
   {fr:"Bonjour, comment allez-vous ?",ar:"مرحبًا، كيف حالكم؟"},
   {fr:"Salut, comment vas-tu ?",ar:"مرحبًا، كيف حالك؟"},
   {fr:"Bonsoir, je suis heureux de vous rencontrer.",ar:"مساء الخير، سعيد بلقائكم."},
   {fr:"Enchanté de faire votre connaissance.",ar:"تشرّفت بمعرفتكم."},
   {fr:"Je suis ravi de vous rencontrer aujourd’hui.",ar:"يسعدني لقاؤكم اليوم."},
   {fr:"Bienvenue, permettez-moi de me présenter.",ar:"أهلًا بكم، اسمحوا لي أن أعرّف بنفسي."},
   {fr:"Bonjour à tous, merci de m’accueillir.",ar:"مرحبًا بالجميع، شكرًا لاستقبالكم لي."},
   {fr:"C’est un plaisir de faire votre connaissance.",ar:"من دواعي سروري التعرّف إليكم."}
  ]
 },
 {
  label:"الاسم والعمر والأصل",
  description:"جمل أساسية لذكر الاسم والعمر والمدينة والجنسية.",
  items:[
   {fr:"Je m’appelle Lina.",ar:"اسمي لينا."},
   {fr:"Mon prénom est Sami et mon nom est Al-Harbi.",ar:"اسمي الأول سامي واسم عائلتي الحربي."},
   {fr:"J’ai vingt-deux ans.",ar:"عمري اثنان وعشرون عامًا."},
   {fr:"Je suis saoudienne.",ar:"أنا سعودية."},
   {fr:"Je viens de Riyad.",ar:"أنا من الرياض."},
   {fr:"Je suis né à Djeddah.",ar:"وُلدت في جدة."},
   {fr:"Ma ville natale est Abha.",ar:"مدينتي الأصلية هي أبها."},
   {fr:"Je suis originaire d’Arabie saoudite.",ar:"أنا من المملكة العربية السعودية."}
  ]
 },
 {
  label:"السكن واللغات",
  description:"التعريف بمكان السكن واللغات التي تتحدث بها.",
  items:[
   {fr:"J’habite à Lyon depuis six mois.",ar:"أسكن في ليون منذ ستة أشهر."},
   {fr:"Je vis avec ma famille dans un appartement.",ar:"أعيش مع عائلتي في شقة."},
   {fr:"Mon quartier est calme et agréable.",ar:"حيّي هادئ ولطيف."},
   {fr:"Je parle arabe couramment.",ar:"أتحدث العربية بطلاقة."},
   {fr:"J’apprends le français à l’université.",ar:"أتعلم الفرنسية في الجامعة."},
   {fr:"Je comprends un peu l’anglais.",ar:"أفهم الإنجليزية قليلًا."},
   {fr:"Ma langue maternelle est l’arabe.",ar:"لغتي الأم هي العربية."},
   {fr:"Je voudrais parler français avec confiance.",ar:"أرغب في التحدث بالفرنسية بثقة."}
  ]
 },
 {
  label:"الدراسة والعمل",
  description:"جمل متنوعة لتقديم تخصصك ودراستك أو مهنتك.",
  items:[
   {fr:"Je suis étudiant en informatique.",ar:"أنا طالب في تخصص الحاسب."},
   {fr:"J’étudie la médecine à l’université.",ar:"أدرس الطب في الجامعة."},
   {fr:"Je suis en première année.",ar:"أنا في السنة الأولى."},
   {fr:"Je travaille comme ingénieur.",ar:"أعمل مهندسًا."},
   {fr:"Je suis professeur dans une école.",ar:"أنا معلّم في مدرسة."},
   {fr:"Mon travail commence à huit heures.",ar:"يبدأ عملي الساعة الثامنة."},
   {fr:"Je cherche actuellement un nouvel emploi.",ar:"أبحث حاليًا عن وظيفة جديدة."},
   {fr:"Mon domaine préféré est le design.",ar:"مجالي المفضل هو التصميم."}
  ]
 },
 {
  label:"العائلة والهوايات",
  description:"إضافة معلومات شخصية بسيطة تجعل التعريف أكثر طبيعية.",
  items:[
   {fr:"J’ai deux frères et une sœur.",ar:"لدي أخوان وأخت."},
   {fr:"Je suis mariée et j’ai un enfant.",ar:"أنا متزوجة ولدي طفل."},
   {fr:"Pendant mon temps libre, je lis des romans.",ar:"في وقت فراغي أقرأ الروايات."},
   {fr:"J’aime voyager et découvrir de nouvelles cultures.",ar:"أحب السفر واكتشاف ثقافات جديدة."},
   {fr:"Mon sport préféré est le football.",ar:"رياضتي المفضلة هي كرة القدم."},
   {fr:"Je joue du piano le week-end.",ar:"أعزف البيانو في عطلة نهاية الأسبوع."},
   {fr:"Je m’intéresse à la photographie.",ar:"أهتم بالتصوير."},
   {fr:"J’adore cuisiner avec mes amis.",ar:"أحب كثيرًا الطبخ مع أصدقائي."}
  ]
 },
 {
  label:"تعريفات كاملة",
  description:"نماذج أطول تجمع عدة معلومات في تقديم واحد.",
  items:[
   {fr:"Bonjour, je m’appelle Nora, j’ai dix-neuf ans et je viens de Dammam.",ar:"مرحبًا، اسمي نورة، عمري تسعة عشر عامًا وأنا من الدمام."},
   {fr:"Salut, moi c’est Omar. Je suis étudiant et j’habite à Paris.",ar:"مرحبًا، أنا عمر. أنا طالب وأسكن في باريس."},
   {fr:"Je m’appelle Sarah, je travaille dans un hôpital et j’aime aider les autres.",ar:"اسمي سارة، أعمل في مستشفى وأحب مساعدة الآخرين."},
   {fr:"Je suis Khaled, ingénieur de profession et passionné de technologie.",ar:"أنا خالد، مهندس وأهتم كثيرًا بالتقنية."},
   {fr:"Mon nom est Amal. Je parle arabe, anglais et j’apprends maintenant le français.",ar:"اسمي أمل. أتحدث العربية والإنجليزية وأتعلم الفرنسية الآن."},
   {fr:"Je viens de La Mecque, mais je vis actuellement à Toulouse pour mes études.",ar:"أنا من مكة، لكنني أعيش حاليًا في تولوز من أجل دراستي."},
   {fr:"Je suis une personne calme, curieuse et toujours prête à apprendre.",ar:"أنا شخص هادئ وفضولي ومستعد دائمًا للتعلم."},
   {fr:"Merci de m’avoir écouté, j’espère mieux vous connaître bientôt.",ar:"شكرًا لاستماعكم إليّ، وآمل أن أتعرّف إليكم أكثر قريبًا."}
  ]
 }
];

const NOUN_ARTICLE_PAGES=[
 {
  label:"أداتا النكرة un و une",
  description:"استخدم un قبل الاسم المذكر المفرد وune قبل الاسم المؤنث المفرد.",
  items:[
   {fr:"un livre",ar:"كتاب",note:"مذكر مفرد"},
   {fr:"une table",ar:"طاولة",note:"مؤنث مفرد"},
   {fr:"un garçon",ar:"ولد",note:"مذكر مفرد"},
   {fr:"une fille",ar:"فتاة",note:"مؤنث مفرد"},
   {fr:"un ami",ar:"صديق",note:"مذكر مفرد"},
   {fr:"une amie",ar:"صديقة",note:"مؤنث مفرد"},
   {fr:"un hôtel",ar:"فندق",note:"مذكر مفرد"},
   {fr:"une école",ar:"مدرسة",note:"مؤنث مفرد"}
  ]
 },
 {
  label:"أدوات المعرفة le و la و l’",
  description:"استخدم le للمذكر وla للمؤنث، وتتحول كلتاهما إلى l’ قبل حرف متحرك أو h صامت.",
  items:[
   {fr:"le jardin",ar:"الحديقة",note:"مذكر معرف"},
   {fr:"la maison",ar:"المنزل",note:"مؤنث معرف"},
   {fr:"le professeur",ar:"المعلّم",note:"مذكر معرف"},
   {fr:"la professeure",ar:"المعلّمة",note:"مؤنث معرف"},
   {fr:"l’homme",ar:"الرجل",note:"مذكر يبدأ بصوت متحرك"},
   {fr:"l’université",ar:"الجامعة",note:"مؤنث يبدأ بصوت متحرك"},
   {fr:"l’enfant",ar:"الطفل",note:"أداة مختصرة"},
   {fr:"l’heure",ar:"الساعة",note:"أداة مختصرة"}
  ]
 },
 {
  label:"من النكرة إلى المعرفة",
  description:"نستخدم النكرة عند ذكر الشيء أول مرة، ثم المعرفة عندما يصبح معروفًا في الحديث.",
  items:[
   {fr:"J’ai un livre. Le livre est intéressant.",ar:"لدي كتاب. الكتاب ممتع.",note:"un ← le"},
   {fr:"Elle achète une robe. La robe est bleue.",ar:"تشتري فستانًا. الفستان أزرق.",note:"une ← la"},
   {fr:"Nous visitons un musée. Le musée est ancien.",ar:"نزور متحفًا. المتحف قديم.",note:"un ← le"},
   {fr:"Il cherche une pharmacie. La pharmacie est ouverte.",ar:"يبحث عن صيدلية. الصيدلية مفتوحة.",note:"une ← la"},
   {fr:"C’est un enfant. L’enfant s’appelle Adam.",ar:"هذا طفل. اسم الطفل آدم.",note:"un ← l’"},
   {fr:"Voici une école. L’école est moderne.",ar:"هذه مدرسة. المدرسة حديثة.",note:"une ← l’"},
   {fr:"J’entends un avion. L’avion est très loin.",ar:"أسمع طائرة. الطائرة بعيدة جدًا.",note:"un ← l’"},
   {fr:"Elle a une idée. L’idée est excellente.",ar:"لديها فكرة. الفكرة ممتازة.",note:"une ← l’"}
  ]
 },
 {
  label:"المذكر والمؤنث",
  description:"احفظ كل اسم مع أداته؛ فالأداة هي أوضح علامة لمعرفة جنس الاسم.",
  items:[
   {fr:"un étudiant",ar:"طالب",note:"مذكر"},
   {fr:"une étudiante",ar:"طالبة",note:"مؤنث"},
   {fr:"un voisin",ar:"جار",note:"مذكر"},
   {fr:"une voisine",ar:"جارة",note:"مؤنث"},
   {fr:"un acteur",ar:"ممثل",note:"مذكر"},
   {fr:"une actrice",ar:"ممثلة",note:"مؤنث"},
   {fr:"un serveur",ar:"نادل",note:"مذكر"},
   {fr:"une serveuse",ar:"نادلة",note:"مؤنث"}
  ]
 },
 {
  label:"تكوين الجمع الأساسي",
  description:"غالبًا نضيف s إلى الاسم، ونستخدم des للنكرة وles للمعرفة في الجمع.",
  items:[
   {fr:"un livre, des livres",ar:"كتاب، كتب",note:"إضافة s"},
   {fr:"une chaise, des chaises",ar:"كرسي، كراسٍ",note:"إضافة s"},
   {fr:"un étudiant, des étudiants",ar:"طالب، طلاب",note:"إضافة s"},
   {fr:"une voiture, des voitures",ar:"سيارة، سيارات",note:"إضافة s"},
   {fr:"le livre, les livres",ar:"الكتاب، الكتب",note:"le ← les"},
   {fr:"la fenêtre, les fenêtres",ar:"النافذة، النوافذ",note:"la ← les"},
   {fr:"l’ami, les amis",ar:"الصديق، الأصدقاء",note:"l’ ← les"},
   {fr:"l’école, les écoles",ar:"المدرسة، المدارس",note:"l’ ← les"}
  ]
 },
 {
  label:"جموع خاصة داخل جمل",
  description:"بعض النهايات تتغير عند الجمع، وبعض الكلمات تبقى كتابتها كما هي.",
  items:[
   {fr:"Je lis un journal. Je lis des journaux.",ar:"أقرأ صحيفة. أقرأ صحفًا.",note:"-al ← -aux"},
   {fr:"Il voit un animal. Il voit des animaux.",ar:"يرى حيوانًا. يرى حيوانات.",note:"-al ← -aux"},
   {fr:"Voici un cheval. Voici des chevaux.",ar:"هذا حصان. هذه خيول.",note:"-al ← -aux"},
   {fr:"Nous avons un bateau. Nous avons des bateaux.",ar:"لدينا قارب. لدينا قوارب.",note:"-eau ← -eaux"},
   {fr:"L’enfant choisit un jeu. Les enfants choisissent des jeux.",ar:"يختار الطفل لعبة. يختار الأطفال ألعابًا.",note:"-eu ← -eux"},
   {fr:"Le magasin affiche un prix. Il affiche plusieurs prix.",ar:"يعرض المتجر سعرًا. يعرض عدة أسعار.",note:"لا يتغير"},
   {fr:"Le bus arrive. Les bus arrivent.",ar:"تصل الحافلة. تصل الحافلات.",note:"لا يتغير"},
   {fr:"Les enfants jouent dans les jardins.",ar:"يلعب الأطفال في الحدائق.",note:"جمع داخل جملة"}
  ]
 }
];

const CORE_VERB_PAGES=[
 {
  label:"ضمائر الفاعل",
  description:"يأتي ضمير الفاعل قبل الفعل، ويحدد الشخص الذي يتكلم أو يقوم بالفعل.",
  items:[
   {fr:"Je",ar:"أنا",note:"المتكلم المفرد"},
   {fr:"Tu",ar:"أنت",note:"مفرد غير رسمي"},
   {fr:"Il",ar:"هو",note:"مذكر مفرد"},
   {fr:"Elle",ar:"هي",note:"مؤنث مفرد"},
   {fr:"On",ar:"نحن أو المرء",note:"شائع في الحديث"},
   {fr:"Nous",ar:"نحن",note:"جمع المتكلم"},
   {fr:"Vous",ar:"أنتم أو حضرتك",note:"جمع أو رسمي"},
   {fr:"Ils",ar:"هم",note:"مذكر أو مختلط"},
   {fr:"Elles",ar:"هنّ",note:"مؤنث جمع"}
  ]
 },
 {
  label:"تصريف فعل être",
  description:"فعل être يعني يكون، ويُستخدم للهوية والصفة والحالة والمكان.",
  items:[
   {fr:"Je suis",ar:"أنا أكون",note:"être مع je"},
   {fr:"Tu es",ar:"أنت تكون",note:"être مع tu"},
   {fr:"Il est",ar:"هو يكون",note:"être مع il"},
   {fr:"Elle est",ar:"هي تكون",note:"être مع elle"},
   {fr:"On est",ar:"نحن نكون",note:"être مع on"},
   {fr:"Nous sommes",ar:"نحن نكون",note:"être مع nous"},
   {fr:"Vous êtes",ar:"أنتم تكونون",note:"être مع vous"},
   {fr:"Ils sont",ar:"هم يكونون",note:"être مع ils"},
   {fr:"Elles sont",ar:"هنّ يكنّ",note:"être مع elles"}
  ]
 },
 {
  label:"تصريف فعل avoir",
  description:"فعل avoir يعني يملك، ويُستخدم كذلك مع العمر وتعبيرات جسدية كثيرة.",
  items:[
   {fr:"J’ai",ar:"لديّ",note:"avoir مع je"},
   {fr:"Tu as",ar:"لديك",note:"avoir مع tu"},
   {fr:"Il a",ar:"لديه",note:"avoir مع il"},
   {fr:"Elle a",ar:"لديها",note:"avoir مع elle"},
   {fr:"On a",ar:"لدينا",note:"avoir مع on"},
   {fr:"Nous avons",ar:"لدينا",note:"avoir مع nous"},
   {fr:"Vous avez",ar:"لديكم",note:"avoir مع vous"},
   {fr:"Ils ont",ar:"لديهم",note:"avoir مع ils"},
   {fr:"Elles ont",ar:"لديهنّ",note:"avoir مع elles"}
  ]
 },
 {
  label:"être داخل جمل",
  description:"استخدم être لوصف الشخص أو حالته أو مهنته أو مكانه.",
  items:[
   {fr:"Je suis à l’université.",ar:"أنا في الجامعة.",note:"المكان"},
   {fr:"Tu es en classe.",ar:"أنت في الفصل.",note:"المكان"},
   {fr:"Il est médecin.",ar:"هو طبيب.",note:"المهنة"},
   {fr:"Elle est française.",ar:"هي فرنسية.",note:"الجنسية"},
   {fr:"On est ensemble.",ar:"نحن معًا.",note:"الحالة"},
   {fr:"Nous sommes prêts.",ar:"نحن مستعدون.",note:"الصفة"},
   {fr:"Vous êtes très calme.",ar:"أنتم هادئون جدًا.",note:"الصفة"},
   {fr:"Ils sont dans la bibliothèque.",ar:"هم في المكتبة.",note:"المكان"}
  ]
 },
 {
  label:"avoir في التعبيرات اليومية",
  description:"لا تُترجم avoir دائمًا بكلمة يملك؛ فهو يُستخدم مع العمر والجوع والعطش والحاجة.",
  items:[
   {fr:"J’ai vingt ans.",ar:"عمري عشرون عامًا.",note:"العمر"},
   {fr:"Tu as faim.",ar:"أنت جائع.",note:"الجوع"},
   {fr:"Il a soif.",ar:"هو عطشان.",note:"العطش"},
   {fr:"Elle a peur.",ar:"هي خائفة.",note:"الخوف"},
   {fr:"On a besoin d’aide.",ar:"نحن بحاجة إلى مساعدة.",note:"الحاجة"},
   {fr:"Nous avons cours aujourd’hui.",ar:"لدينا درس اليوم.",note:"الامتلاك"},
   {fr:"Vous avez raison.",ar:"أنتم على حق.",note:"تعبير ثابت"},
   {fr:"Ils ont chaud.",ar:"هم يشعرون بالحر.",note:"الإحساس"}
  ]
 },
 {
  label:"الفرق بين être و avoir",
  description:"اختر être للهوية والحالة، واختر avoir للملكية والعمر والتعبيرات الثابتة.",
  items:[
   {fr:"Je suis étudiant et j’ai un livre.",ar:"أنا طالب ولدي كتاب.",note:"هوية + ملكية"},
   {fr:"Tu es fatigué et tu as besoin de repos.",ar:"أنت متعب وتحتاج إلى الراحة.",note:"حالة + حاجة"},
   {fr:"Il est jeune et il a dix-huit ans.",ar:"هو شاب وعمره ثمانية عشر عامًا.",note:"صفة + عمر"},
   {fr:"Elle est professeure et elle a une classe.",ar:"هي معلمة ولديها فصل.",note:"مهنة + ملكية"},
   {fr:"On est à la maison et on a faim.",ar:"نحن في المنزل ونحن جائعون.",note:"مكان + جوع"},
   {fr:"Nous sommes amis et nous avons un projet.",ar:"نحن أصدقاء ولدينا مشروع.",note:"هوية + ملكية"},
   {fr:"Vous êtes en retard, mais vous avez une excuse.",ar:"أنتم متأخرون، لكن لديكم عذر.",note:"حالة + ملكية"},
   {fr:"Ils sont heureux parce qu’ils ont des vacances.",ar:"هم سعداء لأن لديهم إجازة.",note:"حالة + امتلاك"}
  ]
 }
];

const PRESENT_NEGATION_PAGES=[
 {
  label:"أفعال -er: parler",
  description:"احذف -er ثم أضف النهاية المناسبة: e، es، e، ons، ez، ent.",
  items:[
   {fr:"Je parle",ar:"أنا أتحدث",note:"نهاية -e"},
   {fr:"Tu parles",ar:"أنت تتحدث",note:"نهاية -es"},
   {fr:"Il parle",ar:"هو يتحدث",note:"نهاية -e"},
   {fr:"Elle parle",ar:"هي تتحدث",note:"نهاية -e"},
   {fr:"On parle",ar:"نحن نتحدث",note:"نهاية -e"},
   {fr:"Nous parlons",ar:"نحن نتحدث",note:"نهاية -ons"},
   {fr:"Vous parlez",ar:"أنتم تتحدثون",note:"نهاية -ez"},
   {fr:"Ils parlent",ar:"هم يتحدثون",note:"نهاية -ent"},
   {fr:"Elles parlent",ar:"هنّ يتحدثن",note:"نهاية -ent"}
  ]
 },
 {
  label:"أفعال -ir: finir",
  description:"في نمط finir نستخدم is، is، it، issons، issez، issent.",
  items:[
   {fr:"Je finis",ar:"أنا أنهي",note:"نهاية -is"},
   {fr:"Tu finis",ar:"أنت تنهي",note:"نهاية -is"},
   {fr:"Il finit",ar:"هو ينهي",note:"نهاية -it"},
   {fr:"Elle finit",ar:"هي تنهي",note:"نهاية -it"},
   {fr:"On finit",ar:"نحن ننهي",note:"نهاية -it"},
   {fr:"Nous finissons",ar:"نحن ننهي",note:"نهاية -issons"},
   {fr:"Vous finissez",ar:"أنتم تنهون",note:"نهاية -issez"},
   {fr:"Ils finissent",ar:"هم ينهون",note:"نهاية -issent"},
   {fr:"Elles finissent",ar:"هنّ ينهين",note:"نهاية -issent"}
  ]
 },
 {
  label:"أفعال -re: attendre",
  description:"في نمط attendre نحذف -re ثم نستخدم s، s، لا شيء، ons، ez، ent.",
  items:[
   {fr:"J’attends",ar:"أنا أنتظر",note:"نهاية -s"},
   {fr:"Tu attends",ar:"أنت تنتظر",note:"نهاية -s"},
   {fr:"Il attend",ar:"هو ينتظر",note:"دون إضافة"},
   {fr:"Elle attend",ar:"هي تنتظر",note:"دون إضافة"},
   {fr:"On attend",ar:"نحن ننتظر",note:"دون إضافة"},
   {fr:"Nous attendons",ar:"نحن ننتظر",note:"نهاية -ons"},
   {fr:"Vous attendez",ar:"أنتم تنتظرون",note:"نهاية -ez"},
   {fr:"Ils attendent",ar:"هم ينتظرون",note:"نهاية -ent"},
   {fr:"Elles attendent",ar:"هنّ ينتظرن",note:"نهاية -ent"}
  ]
 },
 {
  label:"الفعلان aller و faire",
  description:"aller يعني يذهب وfaire يعني يفعل أو يصنع، وكلاهما غير منتظم.",
  items:[
   {fr:"Je vais. Je fais.",ar:"أنا أذهب. أنا أفعل.",note:"je"},
   {fr:"Tu vas. Tu fais.",ar:"أنت تذهب. أنت تفعل.",note:"tu"},
   {fr:"Il va. Il fait.",ar:"هو يذهب. هو يفعل.",note:"il"},
   {fr:"Elle va. Elle fait.",ar:"هي تذهب. هي تفعل.",note:"elle"},
   {fr:"On va. On fait.",ar:"نحن نذهب. نحن نفعل.",note:"on"},
   {fr:"Nous allons. Nous faisons.",ar:"نحن نذهب. نحن نفعل.",note:"nous"},
   {fr:"Vous allez. Vous faites.",ar:"أنتم تذهبون. أنتم تفعلون.",note:"vous"},
   {fr:"Ils vont. Ils font.",ar:"هم يذهبون. هم يفعلون.",note:"ils"},
   {fr:"Elles vont. Elles font.",ar:"هنّ يذهبن. هنّ يفعلن.",note:"elles"}
  ]
 },
 {
  label:"الفعلان venir و prendre",
  description:"venir يعني يأتي وprendre يعني يأخذ، ولهما جذور تتغير مع بعض الضمائر.",
  items:[
   {fr:"Je viens. Je prends.",ar:"أنا آتي. أنا آخذ.",note:"je"},
   {fr:"Tu viens. Tu prends.",ar:"أنت تأتي. أنت تأخذ.",note:"tu"},
   {fr:"Il vient. Il prend.",ar:"هو يأتي. هو يأخذ.",note:"il"},
   {fr:"Elle vient. Elle prend.",ar:"هي تأتي. هي تأخذ.",note:"elle"},
   {fr:"On vient. On prend.",ar:"نحن نأتي. نحن نأخذ.",note:"on"},
   {fr:"Nous venons. Nous prenons.",ar:"نحن نأتي. نحن نأخذ.",note:"nous"},
   {fr:"Vous venez. Vous prenez.",ar:"أنتم تأتون. أنتم تأخذون.",note:"vous"},
   {fr:"Ils viennent. Ils prennent.",ar:"هم يأتون. هم يأخذون.",note:"ils"},
   {fr:"Elles viennent. Elles prennent.",ar:"هنّ يأتين. هنّ يأخذن.",note:"elles"}
  ]
 },
 {
  label:"المضارع في الحياة اليومية",
  description:"تدرّب على الأفعال المنتظمة وغير المنتظمة داخل جمل طبيعية.",
  items:[
   {fr:"Je travaille à la bibliothèque.",ar:"أعمل في المكتبة.",note:"travailler -er"},
   {fr:"Tu choisis un livre français.",ar:"تختار كتابًا فرنسيًا.",note:"choisir -ir"},
   {fr:"Elle répond au professeur.",ar:"هي تجيب المعلم.",note:"répondre -re"},
   {fr:"On va au marché le matin.",ar:"نذهب إلى السوق صباحًا.",note:"aller"},
   {fr:"Nous faisons nos devoirs ensemble.",ar:"نؤدي واجباتنا معًا.",note:"faire"},
   {fr:"Vous venez en bus aujourd’hui.",ar:"تأتون بالحافلة اليوم.",note:"venir"},
   {fr:"Ils prennent le train à huit heures.",ar:"يستقلون القطار الساعة الثامنة.",note:"prendre"},
   {fr:"Elles finissent le cours à midi.",ar:"ينهين الدرس عند الظهر.",note:"finir -ir"}
  ]
 },
 {
  label:"بناء النفي ne … pas",
  description:"ضع ne قبل الفعل وpas بعده، وتصبح ne هي n’ قبل حرف متحرك.",
  items:[
   {fr:"Je ne parle pas anglais.",ar:"أنا لا أتحدث الإنجليزية.",note:"ne + فعل + pas"},
   {fr:"Tu ne finis pas maintenant.",ar:"أنت لا تنهي الآن.",note:"ne + فعل + pas"},
   {fr:"Il n’attend pas le bus.",ar:"هو لا ينتظر الحافلة.",note:"ne ← n’"},
   {fr:"Elle ne va pas au travail.",ar:"هي لا تذهب إلى العمل.",note:"ne + فعل + pas"},
   {fr:"On ne fait pas de bruit.",ar:"نحن لا نُحدث ضجيجًا.",note:"ne + فعل + pas"},
   {fr:"Nous ne venons pas demain.",ar:"نحن لا نأتي غدًا.",note:"ne + فعل + pas"},
   {fr:"Vous ne prenez pas le métro.",ar:"أنتم لا تستقلون المترو.",note:"ne + فعل + pas"},
   {fr:"Ils n’aiment pas le café.",ar:"هم لا يحبون القهوة.",note:"ne ← n’"}
  ]
 },
 {
  label:"من الإثبات إلى النفي",
  description:"استمع إلى الجملة المثبتة ثم صورتها المنفية ولاحظ موضع ne وpas.",
  items:[
   {fr:"Je parle français. Je ne parle pas espagnol.",ar:"أتحدث الفرنسية. لا أتحدث الإسبانية.",note:"إثبات ← نفي"},
   {fr:"Tu travailles lundi. Tu ne travailles pas vendredi.",ar:"تعمل يوم الاثنين. لا تعمل يوم الجمعة.",note:"إثبات ← نفي"},
   {fr:"Il finit son repas. Il ne finit pas son café.",ar:"ينهي وجبته. لا ينهي قهوته.",note:"إثبات ← نفي"},
   {fr:"Elle attend sa sœur. Elle n’attend pas son frère.",ar:"تنتظر أختها. لا تنتظر أخاها.",note:"إثبات ← نفي"},
   {fr:"On va à Paris. On ne va pas à Lyon.",ar:"نذهب إلى باريس. لا نذهب إلى ليون.",note:"إثبات ← نفي"},
   {fr:"Nous faisons du sport. Nous ne faisons pas de tennis.",ar:"نمارس الرياضة. لا نلعب التنس.",note:"إثبات ← نفي"},
   {fr:"Vous venez ce soir. Vous ne venez pas demain.",ar:"تأتون هذا المساء. لا تأتون غدًا.",note:"إثبات ← نفي"},
   {fr:"Elles prennent le bus. Elles ne prennent pas le train.",ar:"يستقللن الحافلة. لا يستقللن القطار.",note:"إثبات ← نفي"}
  ]
 }
];

const TIME_DATE_PAGES=[
 {
  label:"السؤال عن الوقت",
  description:"استخدم Quelle heure est-il ? للسؤال العام، وÀ quelle heure… ? للسؤال عن موعد محدد.",
  items:[
   {fr:"Quelle heure est-il ?",ar:"كم الساعة؟",note:"سؤال عام"},
   {fr:"Il est quelle heure ?",ar:"كم الساعة؟",note:"حديث يومي"},
   {fr:"Vous avez l’heure, s’il vous plaît ?",ar:"هل لديكم الوقت من فضلكم؟",note:"سؤال مهذب"},
   {fr:"À quelle heure commence le cours ?",ar:"في أي ساعة يبدأ الدرس؟",note:"موعد البداية"},
   {fr:"À quelle heure finit le travail ?",ar:"في أي ساعة ينتهي العمل؟",note:"موعد النهاية"},
   {fr:"Le train part à quelle heure ?",ar:"في أي ساعة يغادر القطار؟",note:"موعد المغادرة"},
   {fr:"Quand est notre rendez-vous ?",ar:"متى موعدنا؟",note:"سؤال عن موعد"},
   {fr:"Il est exactement huit heures.",ar:"الساعة الثامنة تمامًا.",note:"إجابة كاملة"}
  ]
 },
 {
  label:"الساعات الكاملة",
  description:"نستخدم Il est une heure للمفرد وIl est … heures مع بقية الساعات.",
  items:[
   {fr:"Il est une heure.",ar:"الساعة الواحدة.",note:"heure مفرد"},
   {fr:"Il est deux heures.",ar:"الساعة الثانية.",note:"heures جمع"},
   {fr:"Il est sept heures.",ar:"الساعة السابعة.",note:"صباحًا أو مساءً"},
   {fr:"Il est huit heures.",ar:"الساعة الثامنة.",note:"ساعة كاملة"},
   {fr:"Il est dix heures.",ar:"الساعة العاشرة.",note:"ساعة كاملة"},
   {fr:"Il est midi.",ar:"الساعة الثانية عشرة ظهرًا.",note:"منتصف النهار"},
   {fr:"Il est dix-huit heures.",ar:"الساعة السادسة مساءً.",note:"نظام 24 ساعة"},
   {fr:"Il est minuit.",ar:"الساعة الثانية عشرة ليلًا.",note:"منتصف الليل"}
  ]
 },
 {
  label:"النصف والربع والدقائق",
  description:"استخدم et quart للربع وet demie للنصف وmoins le quart إلا مع midi وminuit.",
  items:[
   {fr:"Il est neuf heures et quart.",ar:"الساعة التاسعة والربع.",note:"et quart"},
   {fr:"Il est dix heures et demie.",ar:"الساعة العاشرة والنصف.",note:"et demie"},
   {fr:"Il est onze heures moins le quart.",ar:"الساعة الحادية عشرة إلا ربعًا.",note:"moins le quart"},
   {fr:"Il est trois heures cinq.",ar:"الساعة الثالثة وخمس دقائق.",note:"+ 5 دقائق"},
   {fr:"Il est quatre heures dix.",ar:"الساعة الرابعة وعشر دقائق.",note:"+ 10 دقائق"},
   {fr:"Il est six heures vingt.",ar:"الساعة السادسة وعشرون دقيقة.",note:"+ 20 دقيقة"},
   {fr:"Il est huit heures moins dix.",ar:"الساعة الثامنة إلا عشر دقائق.",note:"- 10 دقائق"},
   {fr:"Il est midi et demi.",ar:"الساعة الثانية عشرة والنصف ظهرًا.",note:"demi مع midi"}
  ]
 },
 {
  label:"المواعيد وفترات اليوم",
  description:"اربط الساعة بالنشاط واستخدم du matin وde l’après-midi وdu soir عند الحاجة.",
  items:[
   {fr:"Je me réveille à six heures du matin.",ar:"أستيقظ الساعة السادسة صباحًا.",note:"الصباح"},
   {fr:"Le cours commence à huit heures et demie.",ar:"يبدأ الدرس الساعة الثامنة والنصف.",note:"بداية موعد"},
   {fr:"Nous déjeunons à midi.",ar:"نتناول الغداء عند الظهر.",note:"منتصف النهار"},
   {fr:"J’ai un rendez-vous à deux heures de l’après-midi.",ar:"لدي موعد الساعة الثانية بعد الظهر.",note:"بعد الظهر"},
   {fr:"Le magasin ferme à dix-neuf heures.",ar:"يغلق المتجر الساعة السابعة مساءً.",note:"نظام 24 ساعة"},
   {fr:"Le film commence à neuf heures du soir.",ar:"يبدأ الفيلم الساعة التاسعة مساءً.",note:"المساء"},
   {fr:"Le train arrive à vingt-deux heures quinze.",ar:"يصل القطار الساعة العاشرة والربع مساءً.",note:"وقت دقيق"},
   {fr:"Je me couche vers minuit.",ar:"أنام قرابة منتصف الليل.",note:"وقت تقريبي"}
  ]
 },
 {
  label:"أيام الأسبوع",
  description:"تُكتب أيام الأسبوع بحرف صغير، ويبدأ الأسبوع عادةً بيوم lundi.",
  items:[
   {fr:"lundi",ar:"الاثنين",note:"بداية الأسبوع"},
   {fr:"mardi",ar:"الثلاثاء",note:"اليوم الثاني"},
   {fr:"mercredi",ar:"الأربعاء",note:"اليوم الثالث"},
   {fr:"jeudi",ar:"الخميس",note:"اليوم الرابع"},
   {fr:"vendredi",ar:"الجمعة",note:"اليوم الخامس"},
   {fr:"samedi",ar:"السبت",note:"نهاية الأسبوع"},
   {fr:"dimanche",ar:"الأحد",note:"نهاية الأسبوع"},
   {fr:"Aujourd’hui, nous sommes mercredi.",ar:"اليوم هو الأربعاء.",note:"ذكر اليوم"},
   {fr:"Demain, ce sera jeudi.",ar:"غدًا سيكون الخميس.",note:"اليوم التالي"},
   {fr:"Hier, c’était mardi.",ar:"أمس كان الثلاثاء.",note:"اليوم السابق"}
  ]
 },
 {
  label:"أشهر السنة",
  description:"تُكتب أسماء الأشهر بحرف صغير، ونستخدم en قبل اسم الشهر غالبًا.",
  items:[
   {fr:"janvier",ar:"يناير",note:"الشهر 1"},
   {fr:"février",ar:"فبراير",note:"الشهر 2"},
   {fr:"mars",ar:"مارس",note:"الشهر 3"},
   {fr:"avril",ar:"أبريل",note:"الشهر 4"},
   {fr:"mai",ar:"مايو",note:"الشهر 5"},
   {fr:"juin",ar:"يونيو",note:"الشهر 6"},
   {fr:"juillet",ar:"يوليو",note:"الشهر 7"},
   {fr:"août",ar:"أغسطس",note:"الشهر 8"},
   {fr:"septembre",ar:"سبتمبر",note:"الشهر 9"},
   {fr:"octobre",ar:"أكتوبر",note:"الشهر 10"},
   {fr:"novembre",ar:"نوفمبر",note:"الشهر 11"},
   {fr:"décembre",ar:"ديسمبر",note:"الشهر 12"}
  ]
 },
 {
  label:"الفصول وقراءة التاريخ",
  description:"صيغة التاريخ هي le ثم رقم اليوم ثم الشهر ثم السنة، ويُقال premier لليوم الأول فقط.",
  items:[
   {fr:"le printemps",ar:"فصل الربيع",note:"فصل السنة"},
   {fr:"l’été",ar:"فصل الصيف",note:"فصل السنة"},
   {fr:"l’automne",ar:"فصل الخريف",note:"فصل السنة"},
   {fr:"l’hiver",ar:"فصل الشتاء",note:"فصل السنة"},
   {fr:"Nous sommes le premier janvier.",ar:"نحن في الأول من يناير.",note:"اليوم الأول"},
   {fr:"Nous sommes le cinq août.",ar:"نحن في الخامس من أغسطس.",note:"يوم + شهر"},
   {fr:"Nous sommes le quatorze juillet.",ar:"نحن في الرابع عشر من يوليو.",note:"يوم + شهر"},
   {fr:"Nous sommes le cinq août deux mille vingt-six.",ar:"التاريخ هو الخامس من أغسطس 2026.",note:"تاريخ كامل"}
  ]
 },
 {
  label:"الميلاد والمواعيد والتواريخ",
  description:"استخدم le مع يوم محدد، وen مع الشهر أو السنة، وà مع الساعة.",
  items:[
   {fr:"Mon anniversaire est le douze mars.",ar:"عيد ميلادي في الثاني عشر من مارس.",note:"تاريخ الميلاد"},
   {fr:"Je suis né le vingt avril.",ar:"وُلدت في العشرين من أبريل.",note:"مذكر"},
   {fr:"Elle est née en septembre.",ar:"وُلدت في سبتمبر.",note:"مؤنث"},
   {fr:"Le rendez-vous est le lundi dix août.",ar:"الموعد يوم الاثنين العاشر من أغسطس.",note:"يوم + تاريخ"},
   {fr:"La réunion commence à neuf heures le mardi.",ar:"يبدأ الاجتماع الساعة التاسعة يوم الثلاثاء.",note:"ساعة + يوم"},
   {fr:"Nous partons en vacances en juillet.",ar:"نسافر في إجازة خلال يوليو.",note:"en + شهر"},
   {fr:"Le semestre finit en décembre.",ar:"ينتهي الفصل الدراسي في ديسمبر.",note:"en + شهر"},
   {fr:"Le prochain cours est vendredi à dix heures.",ar:"الدرس القادم يوم الجمعة الساعة العاشرة.",note:"يوم + ساعة"}
  ]
 }
];

const FAMILY_DESCRIPTION_PAGES=[
 {
  label:"العائلة القريبة",
  description:"احفظ اسم فرد العائلة مع أداة التعريف لتعرف جنسه ونطقه الصحيح.",
  items:[
   {fr:"le père",ar:"الأب",note:"مذكر"},
   {fr:"la mère",ar:"الأم",note:"مؤنث"},
   {fr:"les parents",ar:"الوالدان",note:"جمع"},
   {fr:"le fils",ar:"الابن",note:"الحرف l لا يُنطق"},
   {fr:"la fille",ar:"الابنة",note:"مؤنث"},
   {fr:"les enfants",ar:"الأبناء أو الأطفال",note:"جمع"},
   {fr:"le frère",ar:"الأخ",note:"مذكر"},
   {fr:"la sœur",ar:"الأخت",note:"مؤنث"},
   {fr:"le mari",ar:"الزوج",note:"مذكر"},
   {fr:"la femme",ar:"الزوجة",note:"مؤنث"}
  ]
 },
 {
  label:"العائلة الممتدة",
  description:"تشمل العائلة الممتدة الأجداد والأعمام والأخوال وأبناءهم والأحفاد.",
  items:[
   {fr:"le grand-père",ar:"الجد",note:"مذكر"},
   {fr:"la grand-mère",ar:"الجدة",note:"مؤنث"},
   {fr:"les grands-parents",ar:"الأجداد",note:"جمع"},
   {fr:"l’oncle",ar:"العم أو الخال",note:"مذكر"},
   {fr:"la tante",ar:"العمة أو الخالة",note:"مؤنث"},
   {fr:"le cousin",ar:"ابن العم أو الخال",note:"مذكر"},
   {fr:"la cousine",ar:"بنت العم أو الخال",note:"مؤنث"},
   {fr:"le neveu",ar:"ابن الأخ أو الأخت",note:"مذكر"},
   {fr:"la nièce",ar:"بنت الأخ أو الأخت",note:"مؤنث"},
   {fr:"les petits-enfants",ar:"الأحفاد",note:"جمع"}
  ]
 },
 {
  label:"أدوات الملكية",
  description:"تتوافق أداة الملكية مع جنس الشيء المملوك وعدده، وليس مع جنس صاحبه.",
  items:[
   {fr:"mon père",ar:"أبي",note:"mon + مذكر"},
   {fr:"ma mère",ar:"أمي",note:"ma + مؤنث"},
   {fr:"mes parents",ar:"والداي",note:"mes + جمع"},
   {fr:"ton frère",ar:"أخوك",note:"ton + مذكر"},
   {fr:"ta sœur",ar:"أختك",note:"ta + مؤنث"},
   {fr:"tes enfants",ar:"أبناؤك",note:"tes + جمع"},
   {fr:"son oncle",ar:"عمه أو خاله",note:"son + مذكر"},
   {fr:"sa tante",ar:"عمته أو خالته",note:"sa + مؤنث"},
   {fr:"ses cousins",ar:"أبناء عمه أو خاله",note:"ses + جمع"},
   {fr:"mon amie",ar:"صديقتي",note:"mon قبل صوت متحرك"}
  ]
 },
 {
  label:"وصف الشكل الخارجي",
  description:"استخدم être مع الطول والبنية، وavoir مع الشعر والعينين والعمر.",
  items:[
   {fr:"Il est grand et mince.",ar:"هو طويل ونحيف.",note:"être + صفة"},
   {fr:"Elle est petite et sportive.",ar:"هي قصيرة ورياضية.",note:"مؤنث"},
   {fr:"Il est de taille moyenne.",ar:"هو متوسط الطول.",note:"الطول"},
   {fr:"Elle a les cheveux longs.",ar:"شعرها طويل.",note:"avoir + شعر"},
   {fr:"Il a les cheveux courts et noirs.",ar:"شعره قصير وأسود.",note:"الشعر"},
   {fr:"Elle a les yeux bleus.",ar:"عيناها زرقاوان.",note:"avoir + عينين"},
   {fr:"Il a les yeux marron.",ar:"عيناه بنيتان.",note:"marron لا يتغير"},
   {fr:"Elle porte des lunettes.",ar:"هي ترتدي نظارة.",note:"علامة مميزة"}
  ]
 },
 {
  label:"وصف الشخصية والطباع",
  description:"تأتي صفات الشخصية بعد être، ويتغير شكل معظمها مع المؤنث والجمع.",
  items:[
   {fr:"Mon père est calme et patient.",ar:"أبي هادئ وصبور.",note:"صفات مذكرة"},
   {fr:"Ma mère est gentille et généreuse.",ar:"أمي لطيفة وكريمة.",note:"صفات مؤنثة"},
   {fr:"Mon frère est drôle et sociable.",ar:"أخي مرح واجتماعي.",note:"طباع"},
   {fr:"Ma sœur est sérieuse et organisée.",ar:"أختي جادة ومنظمة.",note:"طباع"},
   {fr:"Mon grand-père est courageux.",ar:"جدي شجاع.",note:"مذكر -eux"},
   {fr:"Ma grand-mère est curieuse.",ar:"جدتي فضولية.",note:"مؤنث -euse"},
   {fr:"Mes cousins sont très actifs.",ar:"أبناء عمي نشيطون جدًا.",note:"جمع مذكر"},
   {fr:"Mes cousines sont créatives.",ar:"بنات عمي مبدعات.",note:"جمع مؤنث"}
  ]
 },
 {
  label:"الألوان والملابس",
  description:"تتوافق معظم الألوان مع الاسم، وتأتي غالبًا بعد اسم قطعة الملابس.",
  items:[
   {fr:"une chemise blanche",ar:"قميص أبيض",note:"مؤنث"},
   {fr:"un pantalon noir",ar:"بنطال أسود",note:"مذكر"},
   {fr:"une robe rouge",ar:"فستان أحمر",note:"مؤنث"},
   {fr:"un manteau gris",ar:"معطف رمادي",note:"مذكر"},
   {fr:"des chaussures marron",ar:"أحذية بنية",note:"marron ثابت"},
   {fr:"une veste verte",ar:"سترة خضراء",note:"vert ← verte"},
   {fr:"un chapeau bleu",ar:"قبعة زرقاء",note:"مذكر"},
   {fr:"des lunettes violettes",ar:"نظارة بنفسجية",note:"جمع مؤنث"},
   {fr:"Elle porte une jupe jaune.",ar:"هي ترتدي تنورة صفراء.",note:"جملة كاملة"},
   {fr:"Il porte un pull orange.",ar:"هو يرتدي كنزة برتقالية.",note:"orange ثابت"}
  ]
 },
 {
  label:"توافق الصفات",
  description:"نضيف غالبًا e للمؤنث وs للجمع، لكن بعض الصفات يتغير شكلها أكثر.",
  items:[
   {fr:"un garçon intelligent",ar:"ولد ذكي",note:"مذكر مفرد"},
   {fr:"une fille intelligente",ar:"فتاة ذكية",note:"مؤنث مفرد"},
   {fr:"des garçons intelligents",ar:"أولاد أذكياء",note:"مذكر جمع"},
   {fr:"des filles intelligentes",ar:"فتيات ذكيات",note:"مؤنث جمع"},
   {fr:"un homme heureux",ar:"رجل سعيد",note:"-eux مذكر"},
   {fr:"une femme heureuse",ar:"امرأة سعيدة",note:"-euse مؤنث"},
   {fr:"un beau garçon",ar:"ولد جميل",note:"beau مذكر"},
   {fr:"une belle fille",ar:"فتاة جميلة",note:"belle مؤنث"}
  ]
 },
 {
  label:"تقديم العائلة ووصفها",
  description:"نماذج كاملة تجمع القرابة والملكية والشكل والشخصية في وصف طبيعي.",
  items:[
   {fr:"Voici ma famille : mes parents, mon frère et ma sœur.",ar:"هذه عائلتي: والداي وأخي وأختي.",note:"تقديم العائلة"},
   {fr:"Mon père s’appelle Karim et il est professeur.",ar:"اسم أبي كريم وهو معلم.",note:"اسم + مهنة"},
   {fr:"Ma mère a les cheveux noirs et les yeux marron.",ar:"شعر أمي أسود وعيناها بنيتان.",note:"وصف الشكل"},
   {fr:"Mon frère est grand, sportif et très drôle.",ar:"أخي طويل ورياضي ومرح جدًا.",note:"صفات متعددة"},
   {fr:"Ma sœur porte une robe bleue et des chaussures blanches.",ar:"أختي ترتدي فستانًا أزرق وحذاءً أبيض.",note:"ملابس وألوان"},
   {fr:"Mes grands-parents habitent dans une petite maison.",ar:"يعيش أجدادي في منزل صغير.",note:"جمع"},
   {fr:"J’ai deux cousins gentils et une cousine généreuse.",ar:"لدي ابنا عم لطيفان وبنت عم كريمة.",note:"عدد + صفات"},
   {fr:"Nous sommes une famille unie et nous aimons voyager ensemble.",ar:"نحن عائلة مترابطة ونحب السفر معًا.",note:"وصف كامل"}
  ]
 }
];

const DAILY_LIFE_PAGES=[
 {
  label:"الأفعال الانعكاسية اليومية",
  description:"يعود الفعل الانعكاسي على الفاعل، ويتغير ضميره إلى me وte وse وnous وvous وse.",
  items:[
   {fr:"se réveiller",ar:"يستيقظ",note:"فعل انعكاسي"},
   {fr:"se lever",ar:"ينهض من السرير",note:"فعل انعكاسي"},
   {fr:"se laver",ar:"يغتسل",note:"فعل انعكاسي"},
   {fr:"se brosser les dents",ar:"يفرّش أسنانه",note:"عناية شخصية"},
   {fr:"s’habiller",ar:"يرتدي ملابسه",note:"se ← s’"},
   {fr:"se coiffer",ar:"يمشّط شعره",note:"عناية شخصية"},
   {fr:"se préparer",ar:"يستعد",note:"فعل انعكاسي"},
   {fr:"se coucher",ar:"يذهب إلى الفراش",note:"روتين مسائي"},
   {fr:"s’endormir",ar:"يغفو أو ينام",note:"se ← s’"}
  ]
 },
 {
  label:"الروتين الصباحي",
  description:"استخدم المضارع مع الساعة لوصف الأنشطة التي تقوم بها كل صباح.",
  items:[
   {fr:"Je me réveille à six heures.",ar:"أستيقظ الساعة السادسة.",note:"استيقاظ"},
   {fr:"Je me lève quelques minutes plus tard.",ar:"أنهض بعد عدة دقائق.",note:"نهوض"},
   {fr:"Je me lave le visage.",ar:"أغسل وجهي.",note:"نظافة"},
   {fr:"Je me brosse les dents.",ar:"أفرّش أسناني.",note:"نظافة"},
   {fr:"Je prends une douche rapide.",ar:"آخذ حمامًا سريعًا.",note:"استحمام"},
   {fr:"Je m’habille pour aller au travail.",ar:"أرتدي ملابسي للذهاب إلى العمل.",note:"ملابس"},
   {fr:"Je me coiffe devant le miroir.",ar:"أمشّط شعري أمام المرآة.",note:"استعداد"},
   {fr:"Je prépare mon sac avant de sortir.",ar:"أجهّز حقيبتي قبل الخروج.",note:"تجهيز"}
  ]
 },
 {
  label:"الدراسة والعمل",
  description:"هذه العبارات تصف بداية يوم الدراسة أو العمل والأنشطة الأساسية خلاله.",
  items:[
   {fr:"Je commence le travail à huit heures.",ar:"أبدأ العمل الساعة الثامنة.",note:"بداية العمل"},
   {fr:"Elle arrive à l’université en avance.",ar:"تصل إلى الجامعة مبكرًا.",note:"الوصول"},
   {fr:"Nous assistons au cours de français.",ar:"نحضر درس اللغة الفرنسية.",note:"الدراسة"},
   {fr:"Tu prends des notes dans ton cahier.",ar:"تدوّن ملاحظات في دفترك.",note:"الدراسة"},
   {fr:"Il répond à ses messages le matin.",ar:"يرد على رسائله صباحًا.",note:"العمل"},
   {fr:"Je travaille avec mes collègues.",ar:"أعمل مع زملائي.",note:"العمل الجماعي"},
   {fr:"Vous faites une pause à dix heures.",ar:"تأخذون استراحة الساعة العاشرة.",note:"استراحة"},
   {fr:"Elles finissent leurs cours à trois heures.",ar:"ينهين دروسهن الساعة الثالثة.",note:"نهاية الدراسة"}
  ]
 },
 {
  label:"الوجبات خلال اليوم",
  description:"نستخدم prendre مع الوجبات، ويمكن أيضًا استخدام déjeuner وdîner كفعلين.",
  items:[
   {fr:"Je prends mon petit-déjeuner à la maison.",ar:"أتناول إفطاري في المنزل.",note:"الإفطار"},
   {fr:"Elle boit un café sans sucre.",ar:"تشرب قهوة دون سكر.",note:"مشروب"},
   {fr:"Nous déjeunons à midi.",ar:"نتناول الغداء عند الظهر.",note:"الغداء"},
   {fr:"Il mange une salade au déjeuner.",ar:"يأكل سلطة في الغداء.",note:"طعام"},
   {fr:"Je prends un goûter vers quatre heures.",ar:"أتناول وجبة خفيفة قرابة الرابعة.",note:"وجبة خفيفة"},
   {fr:"La famille dîne ensemble le soir.",ar:"تتناول العائلة العشاء معًا مساءً.",note:"العشاء"},
   {fr:"Tu prépares le repas dans la cuisine.",ar:"تحضّر الوجبة في المطبخ.",note:"تحضير الطعام"},
   {fr:"Après le dîner, nous buvons du thé.",ar:"بعد العشاء نشرب الشاي.",note:"بعد الوجبة"}
  ]
 },
 {
  label:"التنقل اليومي",
  description:"استخدم en مع وسيلة النقل وà pied للمشي، واربطها بفعل aller أو prendre.",
  items:[
   {fr:"Je vais au travail en voiture.",ar:"أذهب إلى العمل بالسيارة.",note:"en voiture"},
   {fr:"Tu vas à l’école à pied.",ar:"تذهب إلى المدرسة مشيًا.",note:"à pied"},
   {fr:"Elle prend le bus chaque matin.",ar:"تستقل الحافلة كل صباح.",note:"prendre le bus"},
   {fr:"Nous allons à l’université en métro.",ar:"نذهب إلى الجامعة بالمترو.",note:"en métro"},
   {fr:"Il se déplace souvent à vélo.",ar:"يتنقل غالبًا بالدراجة.",note:"à vélo"},
   {fr:"Vous prenez le train de sept heures.",ar:"تستقلون قطار الساعة السابعة.",note:"prendre le train"},
   {fr:"Elles attendent le taxi devant la maison.",ar:"ينتظرن سيارة الأجرة أمام المنزل.",note:"انتظار"},
   {fr:"Je rentre chez moi en fin d’après-midi.",ar:"أعود إلى منزلي في نهاية فترة الظهر.",note:"العودة"}
  ]
 },
 {
  label:"التكرار والعادات",
  description:"يأتي ظرف التكرار غالبًا بعد الفعل المصرف، بينما jamais يُستخدم عادة مع ne.",
  items:[
   {fr:"Je me lève toujours tôt.",ar:"أنهض دائمًا مبكرًا.",note:"toujours دائمًا"},
   {fr:"Nous prenons souvent le métro.",ar:"نستقل المترو غالبًا.",note:"souvent غالبًا"},
   {fr:"Elle cuisine régulièrement le soir.",ar:"تطبخ بانتظام مساءً.",note:"régulièrement"},
   {fr:"Tu regardes parfois la télévision.",ar:"تشاهد التلفاز أحيانًا.",note:"parfois أحيانًا"},
   {fr:"Il mange rarement au restaurant.",ar:"نادرًا ما يأكل في المطعم.",note:"rarement نادرًا"},
   {fr:"Je ne bois jamais de café le soir.",ar:"لا أشرب القهوة مساءً أبدًا.",note:"ne … jamais"},
   {fr:"Vous faites du sport deux fois par semaine.",ar:"تمارسون الرياضة مرتين أسبوعيًا.",note:"عدد المرات"},
   {fr:"Elles visitent leur famille chaque vendredi.",ar:"يزرن عائلتهن كل يوم جمعة.",note:"chaque كل"}
  ]
 },
 {
  label:"ترتيب أحداث اليوم",
  description:"استخدم روابط الترتيب لتقديم الأنشطة بوضوح من البداية حتى النهاية.",
  items:[
   {fr:"D’abord, je me réveille.",ar:"أولًا، أستيقظ.",note:"d’abord أولًا"},
   {fr:"Ensuite, je me lève et je me lave.",ar:"بعد ذلك، أنهض وأغتسل.",note:"ensuite بعدها"},
   {fr:"Puis, je prends mon petit-déjeuner.",ar:"ثم أتناول إفطاري.",note:"puis ثم"},
   {fr:"Après, je m’habille rapidement.",ar:"بعدها أرتدي ملابسي بسرعة.",note:"après بعدها"},
   {fr:"Avant de partir, je vérifie mon sac.",ar:"قبل المغادرة أتفقد حقيبتي.",note:"avant de قبل"},
   {fr:"Pendant la journée, je travaille.",ar:"خلال النهار أعمل.",note:"pendant خلال"},
   {fr:"Après le travail, je rentre chez moi.",ar:"بعد العمل أعود إلى منزلي.",note:"après بعد"},
   {fr:"Enfin, je me couche vers onze heures.",ar:"أخيرًا أذهب إلى الفراش قرابة الحادية عشرة.",note:"enfin أخيرًا"}
  ]
 },
 {
  label:"المساء ووقت الفراغ",
  description:"صف ما تفعله بعد الدراسة أو العمل وفي نهاية الأسبوع باستخدام المضارع.",
  items:[
   {fr:"Le soir, je me repose un peu.",ar:"في المساء أرتاح قليلًا.",note:"الراحة"},
   {fr:"Je fais mes devoirs après le dîner.",ar:"أؤدي واجباتي بعد العشاء.",note:"الدراسة"},
   {fr:"Nous regardons un film en famille.",ar:"نشاهد فيلمًا مع العائلة.",note:"نشاط عائلي"},
   {fr:"Elle lit un roman avant de dormir.",ar:"تقرأ رواية قبل النوم.",note:"قراءة"},
   {fr:"Il téléphone à ses amis.",ar:"يتصل بأصدقائه.",note:"تواصل"},
   {fr:"Je prépare mes vêtements pour demain.",ar:"أجهّز ملابسي للغد.",note:"استعداد"},
   {fr:"Le week-end, nous faisons une promenade.",ar:"في عطلة نهاية الأسبوع نتمشى.",note:"نهاية الأسبوع"},
   {fr:"Avant minuit, je me couche et je m’endors.",ar:"قبل منتصف الليل أذهب إلى الفراش وأنام.",note:"نهاية اليوم"}
  ]
 },
 {
  label:"وصف يوم كامل",
  description:"نماذج مترابطة تجمع الوقت والروتين والتنقل والعمل والوجبات والراحة.",
  items:[
   {fr:"Je me réveille à six heures, puis je me prépare pour le travail.",ar:"أستيقظ الساعة السادسة ثم أستعد للعمل.",note:"صباح كامل"},
   {fr:"Après le petit-déjeuner, je prends le bus jusqu’à l’université.",ar:"بعد الإفطار أستقل الحافلة إلى الجامعة.",note:"وجبة + تنقل"},
   {fr:"Le matin, j’assiste aux cours et je prends beaucoup de notes.",ar:"صباحًا أحضر الدروس وأدوّن ملاحظات كثيرة.",note:"دراسة"},
   {fr:"À midi, je déjeune avec mes amis près du campus.",ar:"عند الظهر أتناول الغداء مع أصدقائي قرب الحرم.",note:"غداء"},
   {fr:"L’après-midi, je travaille à la bibliothèque jusqu’à cinq heures.",ar:"بعد الظهر أعمل في المكتبة حتى الخامسة.",note:"عمل + وقت"},
   {fr:"En rentrant, je fais quelques courses et je prépare le dîner.",ar:"عند عودتي أتسوق قليلًا وأحضّر العشاء.",note:"عودة + مهام"},
   {fr:"Après le dîner, je me détends et je parle avec ma famille.",ar:"بعد العشاء أسترخي وأتحدث مع عائلتي.",note:"مساء"},
   {fr:"Enfin, je me brosse les dents et je me couche à onze heures.",ar:"أخيرًا أفرّش أسناني وأنام الساعة الحادية عشرة.",note:"نهاية اليوم"}
  ]
 }
];

export default function UniversityPage(){
 const [levelId,setLevelId]=useState<"A1"|"A2">("A1");
 const level=LEVELS.find(item=>item.id===levelId)!;
 const [moduleId,setModuleId]=useState(A1_MODULES[0].id);
 const [activeLetter,setActiveLetter]=useState("A");
 const [numberPageIndex,setNumberPageIndex]=useState(0);
 const [introductionPageIndex,setIntroductionPageIndex]=useState(0);
 const [nounPageIndex,setNounPageIndex]=useState(0);
 const [coreVerbPageIndex,setCoreVerbPageIndex]=useState(0);
 const [presentPageIndex,setPresentPageIndex]=useState(0);
 const [timeDatePageIndex,setTimeDatePageIndex]=useState(0);
 const [familyPageIndex,setFamilyPageIndex]=useState(0);
 const [dailyPageIndex,setDailyPageIndex]=useState(0);
 const activeModule=useMemo(()=>level.modules.find(item=>item.id===moduleId)??level.modules[0],[level,moduleId]);
 const ActiveModuleIcon=activeModule.icon;
 const numberPage=NUMBER_PAGES[numberPageIndex];
 const introductionPage=INTRODUCTION_PAGES[introductionPageIndex];
 const nounPage=NOUN_ARTICLE_PAGES[nounPageIndex];
 const coreVerbPage=CORE_VERB_PAGES[coreVerbPageIndex];
 const presentPage=PRESENT_NEGATION_PAGES[presentPageIndex];
 const timeDatePage=TIME_DATE_PAGES[timeDatePageIndex];
 const familyPage=FAMILY_DESCRIPTION_PAGES[familyPageIndex];
 const dailyPage=DAILY_LIFE_PAGES[dailyPageIndex];

 const selectLevel=(id:"A1"|"A2")=>{
  const next=LEVELS.find(item=>item.id===id)!;
  setLevelId(id);
  setModuleId(next.modules[0].id);
  setNumberPageIndex(0);
  setIntroductionPageIndex(0);
  setNounPageIndex(0);
  setCoreVerbPageIndex(0);
  setPresentPageIndex(0);
  setTimeDatePageIndex(0);
  setFamilyPageIndex(0);
  setDailyPageIndex(0);
  window.setTimeout(()=>document.getElementById("university-course")?.scrollIntoView({behavior:"smooth",block:"start"}),30);
 };

 const selectModule=(id:string)=>{
  setModuleId(id);
  if(id==="numbers-time"){setNumberPageIndex(0);setTimeDatePageIndex(0)}
  if(id==="greetings")setIntroductionPageIndex(0);
  if(id==="nouns")setNounPageIndex(0);
  if(id==="core-verbs")setCoreVerbPageIndex(0);
  if(id==="present")setPresentPageIndex(0);
  if(id==="description")setFamilyPageIndex(0);
  if(id==="daily-life")setDailyPageIndex(0);
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

    {activeModule.id==="greetings"&&<section className="university-introduction-board">
     <div className="university-subheading">
      <div><span>Présentations interactives</span><h3>اضغط على الجملة لسماع نطقها كاملًا</h3></div>
      <MessageCircle/>
     </div>
     <div className="university-phrase-grid">
      {introductionPage.items.map((item,index)=><button key={item.fr} onClick={()=>void speakFrench(item.fr,{rate:.78})} aria-label={`استمع إلى: ${item.fr}`}>
       <i>{String(index+1).padStart(2,"0")}</i>
       <div><strong dir="ltr">{item.fr}</strong><span>{item.ar}</span></div>
       <Volume2/>
      </button>)}
     </div>
     <div className="university-number-pagination university-phrase-pagination" dir="ltr">
      <button onClick={()=>setIntroductionPageIndex(index=>Math.max(0,index-1))} disabled={introductionPageIndex===0} aria-label="أمثلة التعريف السابقة"><ChevronLeft/><span>السابق</span></button>
      <div><small>موضوع الأمثلة</small><strong>{introductionPage.label}</strong><em>{introductionPageIndex+1} / {INTRODUCTION_PAGES.length}</em></div>
      <button onClick={()=>setIntroductionPageIndex(index=>Math.min(INTRODUCTION_PAGES.length-1,index+1))} disabled={introductionPageIndex===INTRODUCTION_PAGES.length-1} aria-label="أمثلة التعريف التالية"><span>التالي</span><ChevronRight/></button>
     </div>
     <p className="university-phrase-note">{introductionPage.description} جميع الجمل مختلفة ومفتوحة للتدريب دون اختبار.</p>
    </section>}

    {activeModule.id==="nouns"&&<section className="university-introduction-board university-grammar-board">
     <div className="university-subheading">
      <div><span>Grammaire interactive</span><h3>اضغط على الكلمة أو الجملة لسماع نطقها</h3></div>
      <NotebookTabs/>
     </div>
     <div className="university-phrase-grid">
      {nounPage.items.map((item,index)=><button key={item.fr} onClick={()=>void speakFrench(item.fr,{rate:.76})} aria-label={`استمع إلى: ${item.fr}`}>
       <i>{String(index+1).padStart(2,"0")}</i>
       <div><strong dir="ltr">{item.fr}</strong><span>{item.ar}</span><em>{item.note}</em></div>
       <Volume2/>
      </button>)}
     </div>
     <div className="university-number-pagination university-phrase-pagination" dir="ltr">
      <button onClick={()=>setNounPageIndex(index=>Math.max(0,index-1))} disabled={nounPageIndex===0} aria-label="أمثلة الأسماء السابقة"><ChevronLeft/><span>السابق</span></button>
      <div><small>قسم القاعدة</small><strong>{nounPage.label}</strong><em>{nounPageIndex+1} / {NOUN_ARTICLE_PAGES.length}</em></div>
      <button onClick={()=>setNounPageIndex(index=>Math.min(NOUN_ARTICLE_PAGES.length-1,index+1))} disabled={nounPageIndex===NOUN_ARTICLE_PAGES.length-1} aria-label="أمثلة الأسماء التالية"><span>التالي</span><ChevronRight/></button>
     </div>
     <p className="university-phrase-note">{nounPage.description} جميع الأمثلة مختلفة ومفتوحة للتدريب دون اختبار.</p>
    </section>}

    {activeModule.id==="core-verbs"&&<section className="university-introduction-board university-grammar-board">
     <div className="university-subheading">
      <div><span>Conjugaison interactive</span><h3>اضغط على الضمير أو التصريف أو الجملة لسماع النطق</h3></div>
      <Users/>
     </div>
     <div className="university-phrase-grid">
      {coreVerbPage.items.map((item,index)=><button key={item.fr} onClick={()=>void speakFrench(item.fr,{rate:.75})} aria-label={`استمع إلى: ${item.fr}`}>
       <i>{String(index+1).padStart(2,"0")}</i>
       <div><strong dir="ltr">{item.fr}</strong><span>{item.ar}</span><em>{item.note}</em></div>
       <Volume2/>
      </button>)}
     </div>
     <div className="university-number-pagination university-phrase-pagination" dir="ltr">
      <button onClick={()=>setCoreVerbPageIndex(index=>Math.max(0,index-1))} disabled={coreVerbPageIndex===0} aria-label="أمثلة الضمائر السابقة"><ChevronLeft/><span>السابق</span></button>
      <div><small>قسم التصريف</small><strong>{coreVerbPage.label}</strong><em>{coreVerbPageIndex+1} / {CORE_VERB_PAGES.length}</em></div>
      <button onClick={()=>setCoreVerbPageIndex(index=>Math.min(CORE_VERB_PAGES.length-1,index+1))} disabled={coreVerbPageIndex===CORE_VERB_PAGES.length-1} aria-label="أمثلة الضمائر التالية"><span>التالي</span><ChevronRight/></button>
     </div>
     <p className="university-phrase-note">{coreVerbPage.description} جميع الأمثلة مختلفة ومفتوحة للتدريب دون اختبار.</p>
    </section>}

    {activeModule.id==="present"&&<section className="university-introduction-board university-grammar-board">
     <div className="university-subheading">
      <div><span>Présent interactif</span><h3>اضغط على التصريف أو الجملة لسماع النطق</h3></div>
      <BookOpen/>
     </div>
     <div className="university-phrase-grid">
      {presentPage.items.map((item,index)=><button key={item.fr} onClick={()=>void speakFrench(item.fr,{rate:.74})} aria-label={`استمع إلى: ${item.fr}`}>
       <i>{String(index+1).padStart(2,"0")}</i>
       <div><strong dir="ltr">{item.fr}</strong><span>{item.ar}</span><em>{item.note}</em></div>
       <Volume2/>
      </button>)}
     </div>
     <div className="university-number-pagination university-phrase-pagination" dir="ltr">
      <button onClick={()=>setPresentPageIndex(index=>Math.max(0,index-1))} disabled={presentPageIndex===0} aria-label="أمثلة المضارع السابقة"><ChevronLeft/><span>السابق</span></button>
      <div><small>قسم المضارع</small><strong>{presentPage.label}</strong><em>{presentPageIndex+1} / {PRESENT_NEGATION_PAGES.length}</em></div>
      <button onClick={()=>setPresentPageIndex(index=>Math.min(PRESENT_NEGATION_PAGES.length-1,index+1))} disabled={presentPageIndex===PRESENT_NEGATION_PAGES.length-1} aria-label="أمثلة المضارع التالية"><span>التالي</span><ChevronRight/></button>
     </div>
     <p className="university-phrase-note">{presentPage.description} جميع الأمثلة مختلفة ومفتوحة للتدريب دون اختبار.</p>
    </section>}

    {activeModule.id==="numbers-time"&&<section className="university-numbers">
     <div className="university-subheading">
      <div><span>Nombres interactifs</span><h3>اضغط على الرقم لسماع نطقه بالفرنسية</h3></div>
      <Volume2/>
     </div>
     <div className={`university-number-grid ${numberPageIndex===NUMBER_PAGES.length-1?"large":""}`}>
      {numberPage.items.map(item=><button key={item.number} onClick={()=>void speakFrench(item.french,{rate:.75})} aria-label={`استمع إلى الرقم ${item.number} بالفرنسية`}>
       <b>{item.number.toLocaleString("en-US")}</b>
       <span dir="ltr">{item.french}</span>
       <small><Volume2/> اضغط للاستماع</small>
      </button>)}
     </div>
     <div className="university-number-pagination" dir="ltr">
      <button onClick={()=>setNumberPageIndex(index=>Math.max(0,index-1))} disabled={numberPageIndex===0} aria-label="الأرقام السابقة"><ChevronLeft/><span>السابق</span></button>
      <div><small>مجموعة الأرقام</small><strong>{numberPage.label}</strong><em>{numberPageIndex+1} / {NUMBER_PAGES.length}</em></div>
      <button onClick={()=>setNumberPageIndex(index=>Math.min(NUMBER_PAGES.length-1,index+1))} disabled={numberPageIndex===NUMBER_PAGES.length-1} aria-label="الأرقام التالية"><span>التالي</span><ChevronRight/></button>
     </div>
     <p className="university-number-note">ينطق الزر الرقم الفرنسي فقط. استخدم السهمين للتنقل من الصفر حتى المليون دون اختبار أو قفل.</p>
    </section>}

    {activeModule.id==="numbers-time"&&<section className="university-introduction-board university-grammar-board">
     <div className="university-subheading">
      <div><span>Heure et date interactives</span><h3>اضغط على الكلمة أو الجملة لسماع النطق</h3></div>
      <CalendarDays/>
     </div>
     <div className="university-phrase-grid">
      {timeDatePage.items.map((item,index)=><button key={item.fr} onClick={()=>void speakFrench(item.fr,{rate:.74})} aria-label={`استمع إلى: ${item.fr}`}>
       <i>{String(index+1).padStart(2,"0")}</i>
       <div><strong dir="ltr">{item.fr}</strong><span>{item.ar}</span><em>{item.note}</em></div>
       <Volume2/>
      </button>)}
     </div>
     <div className="university-number-pagination university-phrase-pagination" dir="ltr">
      <button onClick={()=>setTimeDatePageIndex(index=>Math.max(0,index-1))} disabled={timeDatePageIndex===0} aria-label="أمثلة الوقت السابقة"><ChevronLeft/><span>السابق</span></button>
      <div><small>قسم الوقت والتاريخ</small><strong>{timeDatePage.label}</strong><em>{timeDatePageIndex+1} / {TIME_DATE_PAGES.length}</em></div>
      <button onClick={()=>setTimeDatePageIndex(index=>Math.min(TIME_DATE_PAGES.length-1,index+1))} disabled={timeDatePageIndex===TIME_DATE_PAGES.length-1} aria-label="أمثلة الوقت التالية"><span>التالي</span><ChevronRight/></button>
     </div>
     <p className="university-phrase-note">{timeDatePage.description} جميع الأمثلة مختلفة ومفتوحة للتدريب دون اختبار.</p>
    </section>}

    {activeModule.id==="description"&&<section className="university-introduction-board university-grammar-board">
     <div className="university-subheading">
      <div><span>Famille interactive</span><h3>اضغط على الكلمة أو الجملة لسماع النطق</h3></div>
      <Users/>
     </div>
     <div className="university-phrase-grid">
      {familyPage.items.map((item,index)=><button key={item.fr} onClick={()=>void speakFrench(item.fr,{rate:.74})} aria-label={`استمع إلى: ${item.fr}`}>
       <i>{String(index+1).padStart(2,"0")}</i>
       <div><strong dir="ltr">{item.fr}</strong><span>{item.ar}</span><em>{item.note}</em></div>
       <Volume2/>
      </button>)}
     </div>
     <div className="university-number-pagination university-phrase-pagination" dir="ltr">
      <button onClick={()=>setFamilyPageIndex(index=>Math.max(0,index-1))} disabled={familyPageIndex===0} aria-label="أمثلة العائلة السابقة"><ChevronLeft/><span>السابق</span></button>
      <div><small>قسم العائلة والوصف</small><strong>{familyPage.label}</strong><em>{familyPageIndex+1} / {FAMILY_DESCRIPTION_PAGES.length}</em></div>
      <button onClick={()=>setFamilyPageIndex(index=>Math.min(FAMILY_DESCRIPTION_PAGES.length-1,index+1))} disabled={familyPageIndex===FAMILY_DESCRIPTION_PAGES.length-1} aria-label="أمثلة العائلة التالية"><span>التالي</span><ChevronRight/></button>
     </div>
     <p className="university-phrase-note">{familyPage.description} جميع الأمثلة مختلفة ومفتوحة للتدريب دون اختبار.</p>
    </section>}

    {activeModule.id==="daily-life"&&<section className="university-introduction-board university-grammar-board">
     <div className="university-subheading">
      <div><span>Routine interactive</span><h3>اضغط على الفعل أو الجملة لسماع النطق</h3></div>
      <CalendarDays/>
     </div>
     <div className="university-phrase-grid">
      {dailyPage.items.map((item,index)=><button key={item.fr} onClick={()=>void speakFrench(item.fr,{rate:.74})} aria-label={`استمع إلى: ${item.fr}`}>
       <i>{String(index+1).padStart(2,"0")}</i>
       <div><strong dir="ltr">{item.fr}</strong><span>{item.ar}</span><em>{item.note}</em></div>
       <Volume2/>
      </button>)}
     </div>
     <div className="university-number-pagination university-phrase-pagination" dir="ltr">
      <button onClick={()=>setDailyPageIndex(index=>Math.max(0,index-1))} disabled={dailyPageIndex===0} aria-label="أمثلة الروتين السابقة"><ChevronLeft/><span>السابق</span></button>
      <div><small>قسم الحياة اليومية</small><strong>{dailyPage.label}</strong><em>{dailyPageIndex+1} / {DAILY_LIFE_PAGES.length}</em></div>
      <button onClick={()=>setDailyPageIndex(index=>Math.min(DAILY_LIFE_PAGES.length-1,index+1))} disabled={dailyPageIndex===DAILY_LIFE_PAGES.length-1} aria-label="أمثلة الروتين التالية"><span>التالي</span><ChevronRight/></button>
     </div>
     <p className="university-phrase-note">{dailyPage.description} جميع الأمثلة مختلفة ومفتوحة للتدريب دون اختبار.</p>
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
