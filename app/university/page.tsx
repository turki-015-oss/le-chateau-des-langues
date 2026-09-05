"use client";

import Link from "next/link";
import {useRouter} from "next/navigation";
import {useEffect,useLayoutEffect,useMemo,useRef,useState,type CSSProperties} from "react";
import type {LucideIcon} from "lucide-react";
import {
 ArrowRight,BookOpen,Building2,CalendarDays,CheckCircle2,ChevronDown,ChevronLeft,ChevronRight,Clock3,Compass,
 GraduationCap,Headphones,Languages,LibraryBig,ListChecks,MapPinned,MessageCircle,Mic2,
 NotebookTabs,Play,RotateCcw,School,ShoppingBag,Sparkles,Square,Trash2,Trophy,Users,Volume2
} from "lucide-react";
import {speakFrench,speakFrenchWithPause} from "@/lib/frenchSpeech";
import {
 DESCRIPTION_PRACTICE_ITEMS,DESCRIPTION_QUIZ_ITEMS,EMOTION_VOCABULARY,FAMILY_VOCABULARY,
 PHYSICAL_STATE_VOCABULARY,type VisualVocabularyItem
} from "./description-data";
import {
 ADJECTIVE_PRACTICE_ITEMS,ADJECTIVE_QUIZ_ITEMS,APPEARANCE_ADJECTIVES,HAIR_EYES_ADJECTIVES,
 PERSONALITY_ADJECTIVES
} from "./adjectives-data";

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
type Level={id:string;label:string;ar:string;description:string;modules:CourseModule[]};
type JourneyPhase={title:string;fr:string;description:string;moduleIds:string[]};
type LessonStage="learn"|"practice"|"test";
type QuizQuestion={prompt:string;choices:string[];correctIndex:number;instruction?:string;speech?:string};
type DescriptionPanel="family"|"physical"|"emotions";
type AdjectivePanel="appearance"|"hairEyes"|"personality";
type UniversityPageProps={initialLevelId?:string;initialModuleId?:string;levelPage?:boolean;lessonPage?:boolean};
const DESCRIPTION_VISUAL_PAGE_SIZE=8;
const ADJECTIVE_VISUAL_PAGE_SIZE=8;

const section=(title:string,subtitle:string,explanation:string,points:string[],examples:Example[]):LessonSection=>({
 title,subtitle,explanation,points,examples
});

function playVocabularySpeech(speech:string[]){
 if(speech.length>1){
  void speakFrenchWithPause(speech[0],speech[1],760,{rate:.72});
  return;
 }
 void speakFrench(speech[0],{rate:.72});
}

function spriteBackground(path:string,index:number,columns:number,rows:number):CSSProperties{
 const column=index%columns;
 const row=Math.floor(index/columns);
 return {
  backgroundImage:`url("${path}")`,
  backgroundSize:`${columns*100}% ${rows*100}%`,
  backgroundPosition:`${columns===1?0:column/(columns-1)*100}% ${rows===1?0:row/(rows-1)*100}%`
 };
}

function preciseEmotionPageThreeLayer(path:string,index:number):CSSProperties{
 const sourceWidth=1024;
 const sourceHeight=1536;
 const rowTop=1022;
 const rowHeight=231;
 const visibleSourceWidth=rowHeight*(4/5);
 const columnBounds=[0,205,410,614,819,1024];
 const column=index%5;
 const columnWidth=columnBounds[column+1]-columnBounds[column];
 const sourceLeft=columnBounds[column]+(columnWidth-visibleSourceWidth)/2;
 return {
  width:`${sourceWidth/visibleSourceWidth*100}%`,
  height:`${sourceHeight/rowHeight*100}%`,
  left:`-${sourceLeft/visibleSourceWidth*100}%`,
  top:`-${rowTop/rowHeight*100}%`,
  backgroundImage:`url("${path}")`
 };
}

function precisePhysicalStateLayer(path:string,index:number):CSSProperties{
 const sourceSize=1254;
 const columnBounds:[[number,number],[number,number],[number,number],[number,number],[number,number]]=[
  [0,249],[252,500],[503,751],[754,1002],[1005,1254]
 ];
 const rowBounds:[[number,number],[number,number],[number,number],[number,number],[number,number]]=[
  [0,248],[251,497],[500,738],[742,979],[983,1254]
 ];
 const column=index%5;
 const row=Math.floor(index/5);
 const [columnStart,columnEnd]=columnBounds[column];
 const [rowStart,rowEnd]=rowBounds[row];
 const columnWidth=columnEnd-columnStart;
 const rowHeight=rowEnd-rowStart;
 const visibleSourceSize=Math.min(columnWidth,rowHeight);
 const sourceLeft=columnStart+(columnWidth-visibleSourceSize)/2;
 const sourceTop=rowStart+(rowHeight-visibleSourceSize)/2;
 return {
  width:`${sourceSize/visibleSourceSize*100}%`,
  height:`${sourceSize/visibleSourceSize*100}%`,
  left:`-${sourceLeft/visibleSourceSize*100}%`,
  top:`-${sourceTop/visibleSourceSize*100}%`,
  backgroundImage:`url("${path}")`
 };
}

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
  id:"description",title:"Famille, états et émotions",ar:"العائلة والحالة والمشاعر",icon:Users,
  description:"مفردات العائلة، الحالات الجسدية اليومية، والمشاعر في أقسام مستقلة.",
  sections:[
   section("La famille et la possession","العائلة والملكية","تعلّم أسماء أفراد العائلة أولًا، ثم استخدم صفات الملكية معها. تتفق صفة الملكية مع الشيء المملوك لا مع صاحب الشيء؛ لذلك نقول mon père وma mère.",[
    "mon, ma, mes: لي.",
    "ton, ta, tes: لك.",
    "son, sa, ses: له أو لها.",
    "notre, votre, leur للمفرد وnos, vos, leurs للجمع."
   ],[
    {fr:"Voici ma sœur et mon frère.",ar:"هذه أختي وهذا أخي."},
    {fr:"Nos parents habitent à Djeddah.",ar:"والدانا يسكنان في جدة."},
    {fr:"Leur maison est grande.",ar:"منزلهم كبير."}
   ]),
   section("Les états physiques","الحالات الجسدية واليومية","تُعبّر الفرنسية عن الحالات اليومية إما مع être مثل Je suis fatigué، أو مع avoir في عبارات ثابتة مثل J’ai faim وJ’ai soif.",[
    "استخدم avoir مع الجوع والعطش والحر والبرد والألم.",
    "استخدم être مع صفات مثل fatigué وmalade وprêt.",
    "عند اختلاف المذكر والمؤنث تعلّم الصيغتين معًا.",
    "اضغط على البطاقة لسماع المذكر، ثم وقفة قصيرة، ثم المؤنث دون نطق الشرطة."
   ],[
    {fr:"Je suis fatigué.",ar:"أنا متعب."},
    {fr:"J’ai faim.",ar:"أنا جائع."},
    {fr:"J’ai mal à la tête.",ar:"رأسي يؤلمني."}
   ]),
   section("Les émotions","المشاعر الأساسية","تساعدك هذه العبارات على وصف شعورك بوضوح في مواقف الحياة اليومية. بعض الصفات تتغير بين المذكر والمؤنث، وبعضها يبقى ثابتًا.",[
    "Je suis content / contente للتعبير عن السرور.",
    "J’ai peur تعبير ثابت عن الخوف.",
    "Je suis calme وJe suis triste لهما الشكل نفسه للمذكر والمؤنث.",
    "استخدم الصور والنطق معًا لربط العبارة بالحالة الصحيحة."
   ],[
    {fr:"Je suis heureux.",ar:"أنا سعيد."},
    {fr:"J’ai peur.",ar:"أنا خائف."},
    {fr:"Je suis calme.",ar:"أنا هادئ."}
   ])
  ]
 },
 {
  id:"adjectives",title:"Les adjectifs et la description",ar:"الصفات الشخصية والمظهر",icon:Sparkles,
  description:"درس مستقل لوصف المظهر والشخصية، مع صيغ المذكر والمؤنث وتوافق الصفة مع الاسم.",
  sections:[
   section("La description physique","وصف المظهر","استخدم être مع صفات الطول والبنية، واستخدم avoir مع الشعر والعينين. تتغير الصفة لتوافق الشخص الموصوف.",[
    "grand → grande، petit → petite.",
    "استخدم être مع الطول والبنية: Il est grand.",
    "استخدم avoir مع الشعر والعينين: Elle a les cheveux longs.",
    "صفات الألوان تأتي غالبًا بعد الاسم."
   ],[
    {fr:"Il est grand et mince.",ar:"هو طويل ونحيف."},
    {fr:"Elle est petite et sportive.",ar:"هي قصيرة ورياضية."},
    {fr:"Il a les cheveux courts et noirs.",ar:"شعره قصير وأسود."}
   ]),
   section("La personnalité et le caractère","الصفات الشخصية والطباع","تأتي صفات الشخصية غالبًا بعد فعل être. تعلّم الصفتين المذكرة والمؤنثة معًا، ولا تخلط بين الصفة الدائمة والشعور المؤقت.",[
    "gentil → gentille، sérieux → sérieuse.",
    "calme وsociable لهما الشكل نفسه للمذكر والمؤنث.",
    "courageux → courageuse، curieux → curieuse.",
    "المشاعر المؤقتة تبقى في درس المشاعر السابق."
   ],[
    {fr:"Il est gentil et sociable.",ar:"هو لطيف واجتماعي."},
    {fr:"Elle est sérieuse et organisée.",ar:"هي جادة ومنظمة."},
    {fr:"Mon ami est calme et patient.",ar:"صديقي هادئ وصبور."}
   ]),
   section("L’accord des adjectifs","توافق الصفات","تتوافق الصفة مع الاسم في التذكير والتأنيث والإفراد والجمع. نضيف غالبًا e للمؤنث وs للجمع، مع وجود صيغ غير منتظمة.",[
    "petit → petite → petits → petites.",
    "heureux → heureuse، beau → belle.",
    "عادة لا تُنطق s الجمع في نهاية الصفة.",
    "احفظ كل صفة داخل مثال قصير واضح."
   ],[
    {fr:"un garçon intelligent",ar:"ولد ذكي"},
    {fr:"une fille intelligente",ar:"فتاة ذكية"},
    {fr:"des filles intelligentes",ar:"فتيات ذكيات"}
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
  id:"situations",title:"Entre amis",ar:"مواقف مع الأصدقاء",icon:MessageCircle,
  description:"الدعوات والمواعيد والهوايات والآراء والرسائل والاعتذار في حوارات طبيعية مع الأصدقاء.",
  sections:[
   section("Inviter et organiser","الدعوة وتنظيم اللقاء","استخدم Tu veux… ؟ أو Ça te dit de… ؟ لدعوة صديق، ثم اتفقا على اليوم والوقت بطريقة واضحة.",[
    "Tu veux… ? هل تريد…؟",
    "Ça te dit de… ? ما رأيك أن…؟",
    "On se retrouve à… نلتقي عند…",
    "Je suis libre / Je ne suis pas libre: أنا متفرغ / غير متفرغ."
   ],[
    {fr:"Tu veux sortir avec nous samedi ?",ar:"هل تريد الخروج معنا يوم السبت؟"},
    {fr:"Oui, avec plaisir. À quelle heure ?",ar:"نعم، بكل سرور. في أي ساعة؟"},
    {fr:"On se retrouve vers quatre heures.",ar:"نلتقي قرابة الساعة الرابعة."}
   ]),
   section("Parler et réagir","الحوار والتفاعل","حافظ على حوار طبيعي بالتعبير عن الرأي والموافقة أو الاختلاف والاعتذار وتقديم اقتراح بديل.",[
    "Je pense que… أعتقد أن…",
    "Je suis d’accord: أنا موافق.",
    "Je ne suis pas tout à fait d’accord: لست موافقًا تمامًا.",
    "Désolé, je suis en retard: آسف، أنا متأخر."
   ],[
    {fr:"À mon avis, ce film est très drôle.",ar:"في رأيي، هذا الفيلم مضحك جدًا."},
    {fr:"Moi aussi, je suis d’accord avec toi.",ar:"وأنا أيضًا، أتفق معك."},
    {fr:"Je suis désolé, on peut changer l’heure ?",ar:"أنا آسف، هل يمكننا تغيير الوقت؟"}
   ])
  ]
 }
];

const A2_REVISION_PRACTICE_ITEMS:Example[]=[
 {fr:"Tous les jours, je me réveille à six heures et demie.",ar:"أستيقظ كل يوم في السادسة والنصف."},
 {fr:"Nous mettons nos manteaux avant de sortir.",ar:"نرتدي معاطفنا قبل الخروج."},
 {fr:"Elle ne regarde jamais la télévision le matin.",ar:"لا تشاهد التلفاز صباحًا أبدًا."},
 {fr:"Depuis quand travaillez-vous dans cette entreprise ?",ar:"منذ متى تعملون في هذه الشركة؟"},
 {fr:"Est-ce que vous prenez le métro pour aller au travail ?",ar:"هل تستقلون المترو للذهاب إلى العمل؟"},
 {fr:"Je ne veux rien acheter aujourd’hui.",ar:"لا أريد شراء أي شيء اليوم."},
 {fr:"On va souvent au marché le samedi.",ar:"نذهب كثيرًا إلى السوق يوم السبت."},
 {fr:"D’abord, ils préparent le repas, puis ils mettent la table.",ar:"يُحضّرون الطعام أولًا، ثم يرتبون المائدة."},
 {fr:"Mes enfants se couchent vers neuf heures.",ar:"يخلد أطفالي إلى النوم قرابة الساعة التاسعة."},
 {fr:"À mon avis, ce quartier est pratique parce qu’il est bien desservi.",ar:"في رأيي، هذا الحي عملي لأن وسائل النقل تصل إليه جيدًا."}
];

const A2_REVISION_QUIZ_ITEMS:QuizQuestion[]=[
 {prompt:"Nous ___ le bus à huit heures.",speech:"Choisissez la bonne forme du verbe prendre.",instruction:"اختر التصريف الصحيح للفعل prendre.",choices:["prenons","prenez","prennent"],correctIndex:0},
 {prompt:"Elle ___ à sept heures chaque matin.",speech:"Choisissez le bon pronom et la bonne forme du verbe se lever.",instruction:"أكمل بالفعل الضميري الصحيح.",choices:["me lève","se lève","te lèves"],correctIndex:1},
 {prompt:"Il ne travaille ___ le dimanche.",speech:"Complétez la phrase négative.",instruction:"اختر كلمة النفي المناسبة لمعنى «أبدًا».",choices:["personne","rien","jamais"],correctIndex:2},
 {prompt:"___ habitez-vous ici ? — Depuis 2024.",speech:"Choisissez le mot interrogatif adapté à la réponse depuis deux mille vingt-quatre.",instruction:"اختر أداة السؤال المناسبة للإجابة المعطاة.",choices:["Depuis quand","Pourquoi","Combien"],correctIndex:0},
 {prompt:"On ___ souvent au parc après le travail.",speech:"Choisissez la bonne forme du verbe aller avec on.",instruction:"اختر تصريف aller الصحيح مع on.",choices:["allez","va","vont"],correctIndex:1},
 {prompt:"J’habite à Lyon ___ trois ans.",speech:"Complétez la phrase pour exprimer une durée qui continue.",instruction:"اختر الأداة التي تعبّر عن مدة ما زالت مستمرة.",choices:["pendant","il y a","depuis"],correctIndex:2},
 {prompt:"Le magasin est fermé, ___ nous revenons demain.",speech:"Choisissez le connecteur qui exprime la conséquence.",instruction:"اختر الرابط الذي يعبّر عن النتيجة.",choices:["donc","mais","parce que"],correctIndex:0},
 {prompt:"Quel jour Nadia ne travaille-t-elle jamais ?",speech:"Quel jour Nadia ne travaille-t-elle jamais ?",instruction:"أجب وفق نص «أسبوع ناديا».",choices:["Le mardi","Le lundi","Le samedi"],correctIndex:1},
 {prompt:"Je ne veux rien acheter aujourd’hui.",speech:"Je ne veux rien acheter aujourd’hui.",instruction:"اختر المعنى العربي الصحيح.",choices:["لا أريد شراء أي شيء اليوم.","لم أعد أذهب إلى السوق اليوم.","لا أعرف أحدًا في المتجر."],correctIndex:0},
 {prompt:"D’abord, je termine mon travail, ___ je rentre chez moi.",speech:"Complétez la suite logique de la phrase.",instruction:"اختر الرابط الذي يكمل ترتيب الأحداث.",choices:["parce que","puis","pourtant"],correctIndex:1}
];

const A2_REVISION_READING={
 title:"La semaine de Nadia",
 arTitle:"أسبوع ناديا",
 text:"Nadia habite à Toulouse depuis deux ans. Elle travaille dans une librairie du mardi au samedi. Chaque matin, elle se lève à sept heures, prend son petit-déjeuner, puis va au travail en bus parce que la librairie est loin de chez elle. Elle ne travaille jamais le lundi. Ce jour-là, elle fait ses courses et retrouve parfois une amie au café.",
 translation:"تعيش ناديا في تولوز منذ عامين. تعمل في مكتبة لبيع الكتب من الثلاثاء إلى السبت. تستيقظ كل صباح الساعة السابعة، وتتناول فطورها، ثم تذهب إلى العمل بالحافلة لأن المكتبة بعيدة عن منزلها. لا تعمل يوم الاثنين أبدًا؛ ففي ذلك اليوم تتسوق وتلتقي أحيانًا بصديقة في المقهى.",
 questions:[
  {question:"Depuis quand Nadia habite-t-elle à Toulouse ?",answer:"Elle habite à Toulouse depuis deux ans.",ar:"تعيش في تولوز منذ عامين."},
  {question:"Pourquoi va-t-elle au travail en bus ?",answer:"Parce que la librairie est loin de chez elle.",ar:"لأن المكتبة بعيدة عن منزلها."},
  {question:"Que fait-elle parfois le lundi ?",answer:"Elle retrouve parfois une amie au café.",ar:"تلتقي أحيانًا بصديقة في المقهى."}
 ]
};

const A2_REVISION_LISTENING={
 title:"Une matinée bien organisée",
 arTitle:"صباح منظّم",
 text:"Bonjour, je m’appelle Lucas. J’habite à Nantes depuis trois ans et je travaille dans un hôtel près de la gare. En semaine, je me réveille à six heures et demie. Je prends toujours un café, mais je ne mange jamais à la maison. Je pars à sept heures et je vais au travail à vélo parce que c’est rapide. Le lundi, je commence plus tard, donc je fais mes courses avant de partir.",
 questions:[
  {prompt:"Depuis combien de temps Lucas habite-t-il à Nantes ?",choices:["Depuis trois ans","Depuis six mois","Depuis sept ans"],correctIndex:0},
  {prompt:"Où travaille Lucas ?",choices:["Dans une librairie","Dans un hôtel","Dans une gare"],correctIndex:1},
  {prompt:"Que ne fait-il jamais à la maison ?",choices:["Il ne boit jamais de café.","Il ne fait jamais ses courses.","Il ne mange jamais."],correctIndex:2},
  {prompt:"Pourquoi va-t-il au travail à vélo ?",choices:["Parce que c’est rapide.","Parce qu’il commence tard.","Parce qu’il habite à la gare."],correctIndex:0}
 ]
};

const A2_REVISION_WRITING_MODEL="En général, je me lève à six heures et demie. D’abord, je prends mon petit-déjeuner, puis je me prépare pour aller au travail. Je pars à sept heures et je prends souvent le bus. Je ne travaille jamais le vendredi. Après le travail, je fais mes courses ou je retrouve un ami. Enfin, je rentre chez moi parce que j’aime passer une soirée calme avec ma famille.";

const A2_MODULES:CourseModule[]=[
 {
  id:"revision",title:"Consolider le présent",ar:"تثبيت الحاضر والتواصل",icon:Sparkles,
  description:"ثبّت أساس A2: الحاضر، الأفعال الضميرية، النفي، السؤال، الزمن، وبناء إجابة مترابطة في مواقف الحياة اليومية.",
  sections:[
   section("Le présent bien construit","بناء الحاضر بصورة صحيحة","ابدأ بتثبيت نهايات الأفعال المنتظمة، ثم اربطها بأكثر الأفعال غير المنتظمة استعمالًا. يجب أن يتوافق التصريف دائمًا مع الفاعل.",[
    "أفعال -er: je parle، tu parles، il parle، nous parlons، vous parlez، ils parlent.",
    "أفعال -ir من نوع finir: je finis، nous finissons، ils finissent.",
    "ثبّت تصريف aller, venir, faire, prendre, mettre, pouvoir, vouloir وdevoir.",
    "مع on نستخدم تصريف المفرد الغائب: On prend، On va، On fait."
   ],[
    {fr:"Chaque matin, je pars à sept heures et je prends le bus.",ar:"أغادر كل صباح الساعة السابعة وأستقل الحافلة."},
    {fr:"Ma sœur finit ses cours à quatre heures.",ar:"تنهي أختي دروسها الساعة الرابعة."},
    {fr:"Nous pouvons vous aider après le déjeuner.",ar:"يمكننا مساعدتكم بعد الغداء."}
   ]),
   section("Les verbes pronominaux","الأفعال الضميرية والروتين","تأتي الضمائر me, te, se, nous, vous, se قبل الفعل، وتتغير مع الفاعل. تستخدم هذه الأفعال كثيرًا لوصف اليوم والعادات.",[
    "Je me lève، tu te lèves، elle se lève.",
    "Nous nous préparons، vous vous préparez، ils se préparent.",
    "في النفي نحيط الضمير والفعل بـ ne…pas: Je ne me couche pas tard.",
    "قبل حرف صوتي تصبح me وte وse: m’, t’, s’."
   ],[
    {fr:"Je me lève tôt pendant la semaine.",ar:"أستيقظ مبكرًا خلال أيام الأسبوع."},
    {fr:"Vous vous préparez avant de sortir.",ar:"تستعدون قبل الخروج."},
    {fr:"On se retrouve devant la bibliothèque.",ar:"نلتقي أمام المكتبة."}
   ]),
   section("La négation précise","النفي بصورة أدق","لا يقتصر النفي في A2 على ne…pas؛ اختر الصيغة التي تنقل المعنى المقصود، وضع جزأي النفي حول الفعل المصرف.",[
    "ne…jamais: أبدًا، وne…plus: لم يعد.",
    "ne…rien: لا شيء، وne…personne: لا أحد.",
    "مع المصدر: Je préfère ne rien dire.",
    "في الحديث قد تُحذف ne، لكن تعلّم الصيغة الكاملة في الكتابة."
   ],[
    {fr:"Il ne prend jamais de café le soir.",ar:"لا يشرب القهوة مساءً أبدًا."},
    {fr:"Nous ne travaillons plus dans ce quartier.",ar:"لم نعد نعمل في هذا الحي."},
    {fr:"Je ne connais personne dans cette ville.",ar:"لا أعرف أحدًا في هذه المدينة."}
   ]),
   section("Poser une question naturelle","طرح سؤال طبيعي","اختر صيغة السؤال بحسب الموقف: نبرة الحديث مع المقربين، est-ce que في الاستعمال المحايد، أو القلب في السياق الأكثر رسمية.",[
    "Tu viens demain ? شائع في الحديث.",
    "Est-ce que vous avez réservé ? واضح ومحايد.",
    "Où allez-vous ? مناسب ورسمي.",
    "استخدم qui, que, où, quand, comment, pourquoi, combien وdepuis quand للحصول على معلومة محددة."
   ],[
    {fr:"À quelle heure commence le cours ?",ar:"في أي ساعة يبدأ الدرس؟"},
    {fr:"Est-ce que tu peux venir avec nous ?",ar:"هل يمكنك المجيء معنا؟"},
    {fr:"Pourquoi choisissez-vous ce trajet ?",ar:"لماذا تختارون هذا الطريق؟"}
   ]),
   section("Le temps, la durée et la fréquence","الزمن والمدة والتكرار","حدّد متى يحدث الفعل وكم مرة ومدة استمراره. هذه العناصر تحول الإجابة القصيرة إلى معلومة واضحة.",[
    "depuis + مدة أو بداية لحدث ما زال مستمرًا.",
    "toujours, souvent, parfois, rarement, jamais للتكرار.",
    "une fois / deux fois par semaine لتحديد العدد.",
    "en général, tous les jours, le week-end لتنظيم الحديث عن العادة."
   ],[
    {fr:"Je travaille ici depuis six mois.",ar:"أعمل هنا منذ ستة أشهر."},
    {fr:"Nous faisons du sport deux fois par semaine.",ar:"نمارس الرياضة مرتين في الأسبوع."},
    {fr:"Il déjeune parfois avec ses collègues.",ar:"يتناول الغداء أحيانًا مع زملائه."}
   ]),
   section("Construire une réponse liée","بناء إجابة مترابطة","في A2 لا تكتفِ بجمل منفصلة. رتّب الفكرة، أضف سببًا أو تعارضًا، ثم اختم بمعلومة واضحة.",[
    "d’abord, ensuite, puis, enfin لترتيب الأحداث.",
    "parce que وcar لذكر السبب، donc لذكر النتيجة.",
    "mais وpourtant لإظهار التعارض.",
    "ابنِ فقرة قصيرة: عادة + تفصيل + سبب + رأي."
   ],[
    {fr:"D’abord, je consulte mes messages, puis je commence mon travail.",ar:"أطّلع أولًا على رسائلي، ثم أبدأ عملي."},
    {fr:"Je préfère marcher parce que mon bureau est près de chez moi.",ar:"أفضل المشي لأن مكتبي قريب من منزلي."},
    {fr:"Le trajet est long, mais le quartier est très agréable.",ar:"الطريق طويل، لكن الحي لطيف جدًا."}
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

const COURSE_PHASES:Record<string,JourneyPhase[]>={
 A1:[
  {title:"البداية الصحيحة",fr:"Premiers pas",description:"الحروف والأصوات والتحية الأولى.",moduleIds:["alphabet","sounds","greetings"]},
  {title:"بناء الجملة",fr:"Construire la langue",description:"الأسماء والضمائر والأفعال والحاضر.",moduleIds:["nouns","core-verbs","present"]},
  {title:"التواصل اليومي",fr:"Communiquer au quotidien",description:"العدد والزمن والعائلة والصفات والحياة والمواقف.",moduleIds:["numbers-time","description","adjectives","daily-life","situations"]}
 ],
 A2:[
  {title:"تثبيت الأساس",fr:"Consolider les acquis",description:"مراجعة الحاضر ثم الحديث عن الماضي والمستقبل.",moduleIds:["revision","passe-compose","imparfait","future"]},
  {title:"دقة التعبير",fr:"Préciser son expression",description:"الضمائر والكميات والمقارنة والطلب المهذب.",moduleIds:["pronouns","quantity","comparison","politeness"]},
  {title:"التواصل المستقل",fr:"Communiquer avec autonomie",description:"ربط الأفكار والتصرف في المواقف والتعبير بثقة.",moduleIds:["connectors","themes","expression"]}
 ]
};

const ALPHABET=[
 ["A","a","ami","صديق"],["B","bé","bonjour","مرحبًا"],["C","cé","café","مقهى"],
 ["D","dé","deux","اثنان"],["E","e","école","مدرسة"],["F","effe","famille","عائلة"],
 ["G","gé","gare","محطة"],["H","ache","hôtel","فندق"],["I","i","ici","هنا"],
 ["J","ji","jour","يوم"],["K","ka","kilo","كيلو"],["L","elle","livre","كتاب"],
 ["M","emme","maison","منزل"],["N","enne","nom","اسم"],["O","o","orange","برتقال"],
 ["P","pé","porte","باب"],["Q","ku","question","سؤال"],["R","erre","restaurant","مطعم"],
 ["S","esse","salut","مرحبًا"],["T","té","train","قطار"],["U","u","université","جامعة"],
 ["V","vé","ville","مدينة"],["W","double vé","wagon","عربة"],["X","ixe","xérus","سنجاب"],
 ["Y","i grec","yaourt","زبادي"],["Z","zède","zoo","حديقة حيوانات"]
];

// Keep the conventional written letter name in the lesson, while giving
// speech engines a phonetic spelling for names they commonly mispronounce.
const LETTER_SPEECH_OVERRIDES:Record<string,string>={N:"ène",T:"tée",X:"ixe"};
const LETTER_SPEECH_RATES:Record<string,number>={T:.58,X:.62};

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

const DAYS_OF_WEEK=[
 {fr:"lundi",ar:"الاثنين"},{fr:"mardi",ar:"الثلاثاء"},{fr:"mercredi",ar:"الأربعاء"},
 {fr:"jeudi",ar:"الخميس"},{fr:"vendredi",ar:"الجمعة"},{fr:"samedi",ar:"السبت"},{fr:"dimanche",ar:"الأحد"}
];

const MONTHS_OF_YEAR=[
 {fr:"janvier",ar:"يناير"},{fr:"février",ar:"فبراير"},{fr:"mars",ar:"مارس"},{fr:"avril",ar:"أبريل"},
 {fr:"mai",ar:"مايو"},{fr:"juin",ar:"يونيو"},{fr:"juillet",ar:"يوليو"},{fr:"août",ar:"أغسطس"},
 {fr:"septembre",ar:"سبتمبر"},{fr:"octobre",ar:"أكتوبر"},{fr:"novembre",ar:"نوفمبر"},{fr:"décembre",ar:"ديسمبر"}
];

const CALENDAR_WORDS=[
 {fr:"le jour",ar:"اليوم",note:"مذكر"},{fr:"la semaine",ar:"الأسبوع",note:"مؤنث"},
 {fr:"le week-end",ar:"عطلة نهاية الأسبوع",note:"مذكر"},{fr:"le mois",ar:"الشهر",note:"مذكر"},
 {fr:"l’année",ar:"السنة",note:"مؤنث"},{fr:"les vacances",ar:"الإجازة أو العطلة",note:"جمع مؤنث"},
 {fr:"aujourd’hui",ar:"اليوم",note:"ظرف زمان"},{fr:"hier",ar:"أمس",note:"ظرف زمان"},
 {fr:"demain",ar:"غدًا",note:"ظرف زمان"},{fr:"la date",ar:"التاريخ",note:"مؤنث"}
];

const TIME_DATE_APPLICATION_PAGES=TIME_DATE_PAGES.filter(page=>page.label!=="أيام الأسبوع"&&page.label!=="أشهر السنة");

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

const ADJECTIVE_DESCRIPTION_PAGES=FAMILY_DESCRIPTION_PAGES.slice(3,7);

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

const FRIENDS_SITUATIONS_PAGES=[
 {
  label:"دعوة صديق",
  description:"استخدم سؤالًا بسيطًا أو اقتراحًا لطيفًا لدعوة صديق إلى نشاط مشترك.",
  items:[
   {fr:"Tu veux sortir avec moi samedi ?",ar:"هل تريد الخروج معي يوم السبت؟",note:"دعوة مباشرة"},
   {fr:"Ça te dit de regarder un film ensemble ?",ar:"ما رأيك أن نشاهد فيلمًا معًا؟",note:"اقتراح ودي"},
   {fr:"Est-ce que tu veux jouer au football cet après-midi ?",ar:"هل تريد لعب كرة القدم بعد ظهر اليوم؟",note:"دعوة بنشاط"},
   {fr:"On pourrait faire une promenade ce soir.",ar:"يمكننا أن نتمشى هذا المساء.",note:"اقتراح"},
   {fr:"Tu es libre demain après-midi ?",ar:"هل أنت متفرغ غدًا بعد الظهر؟",note:"سؤال عن التفرغ"},
   {fr:"J’aimerais passer du temps avec toi ce week-end.",ar:"أرغب في قضاء وقت معك نهاية هذا الأسبوع.",note:"رغبة"},
   {fr:"Viens chez moi, on va écouter de la musique.",ar:"تعال إلى منزلي، سنستمع إلى الموسيقى.",note:"دعوة ودية"},
   {fr:"Ça te ferait plaisir de voir nos amis dimanche ?",ar:"هل يسعدك لقاء أصدقائنا يوم الأحد؟",note:"دعوة مهذبة"}
  ]
 },
 {
  label:"قبول الدعوة أو رفضها",
  description:"اقبل بحماس، أو ارفض بأدب مع سبب قصير واقتراح وقت بديل إن أمكن.",
  items:[
   {fr:"Oui, avec plaisir !",ar:"نعم، بكل سرور!",note:"قبول مهذب"},
   {fr:"Bonne idée, je suis partant !",ar:"فكرة جيدة، أنا موافق!",note:"قبول متحمس"},
   {fr:"D’accord, ça me va.",ar:"حسنًا، هذا يناسبني.",note:"قبول"},
   {fr:"Super, j’aimerais beaucoup venir.",ar:"رائع، أود الحضور كثيرًا.",note:"قبول متحمس"},
   {fr:"Désolé, je ne peux pas venir aujourd’hui.",ar:"آسف، لا أستطيع الحضور اليوم.",note:"رفض مهذب"},
   {fr:"Je suis occupé samedi, mais je suis libre dimanche.",ar:"أنا مشغول السبت، لكنني متفرغ الأحد.",note:"وقت بديل"},
   {fr:"Merci pour l’invitation, mais j’ai déjà un programme.",ar:"شكرًا على الدعوة، لكن لدي برنامج مسبق.",note:"رفض مع سبب"},
   {fr:"Pas cette fois, peut-être la semaine prochaine.",ar:"ليس هذه المرة، ربما الأسبوع القادم.",note:"تأجيل"}
  ]
 },
 {
  label:"تحديد وقت اللقاء",
  description:"اتفقا على اليوم والساعة وطريقة الوصول، ثم أكّدا الموعد بعبارة قصيرة.",
  items:[
   {fr:"À quelle heure est-ce qu’on se retrouve ?",ar:"في أي ساعة نلتقي؟",note:"سؤال عن الوقت"},
   {fr:"On se retrouve à quatre heures.",ar:"نلتقي الساعة الرابعة.",note:"تحديد الساعة"},
   {fr:"Est-ce que cinq heures te convient ?",ar:"هل الساعة الخامسة تناسبك؟",note:"التأكد من الوقت"},
   {fr:"Je passe chez toi vers six heures.",ar:"سأمر بمنزلك قرابة السادسة.",note:"وقت تقريبي"},
   {fr:"On se voit samedi ou dimanche ?",ar:"هل نلتقي السبت أم الأحد؟",note:"اختيار اليوم"},
   {fr:"Dimanche matin, c’est parfait pour moi.",ar:"صباح الأحد مناسب تمامًا لي.",note:"تأكيد اليوم"},
   {fr:"Envoie-moi un message quand tu arrives.",ar:"أرسل لي رسالة عندما تصل.",note:"تنسيق الوصول"},
   {fr:"C’est confirmé : demain à trois heures.",ar:"تم التأكيد: غدًا الساعة الثالثة.",note:"تأكيد الموعد"}
  ]
 },
 {
  label:"الهوايات والاهتمامات",
  description:"اسأل صديقك عما يحب، ثم شارك هوايتك وسبب إعجابك بها.",
  items:[
   {fr:"Qu’est-ce que tu aimes faire pendant ton temps libre ?",ar:"ماذا تحب أن تفعل في وقت فراغك؟",note:"سؤال مفتوح"},
   {fr:"J’aime lire des romans et écouter de la musique.",ar:"أحب قراءة الروايات والاستماع إلى الموسيقى.",note:"هوايتان"},
   {fr:"Mon activité préférée, c’est la photographie.",ar:"نشاطي المفضل هو التصوير.",note:"تفضيل"},
   {fr:"Tu pratiques quel sport ?",ar:"أي رياضة تمارس؟",note:"سؤال عن الرياضة"},
   {fr:"Je joue au football avec mes amis chaque semaine.",ar:"ألعب كرة القدم مع أصدقائي كل أسبوع.",note:"عادة"},
   {fr:"Elle adore dessiner et créer de nouvelles choses.",ar:"هي تعشق الرسم وابتكار أشياء جديدة.",note:"اهتمام إبداعي"},
   {fr:"Nous partageons la même passion pour les voyages.",ar:"نتشارك الشغف نفسه بالسفر.",note:"اهتمام مشترك"},
   {fr:"Pourquoi est-ce que tu aimes cette activité ?",ar:"لماذا تحب هذا النشاط؟",note:"سؤال عن السبب"}
  ]
 },
 {
  label:"اقتراح أنشطة مشتركة",
  description:"استخدم On peut أو On pourrait لعرض نشاط، ثم دع صديقك يختار.",
  items:[
   {fr:"On peut regarder un film chez moi.",ar:"يمكننا مشاهدة فيلم في منزلي.",note:"اقتراح بسيط"},
   {fr:"On pourrait préparer le dîner ensemble.",ar:"يمكننا تحضير العشاء معًا.",note:"اقتراح ودي"},
   {fr:"Tu préfères jouer aux cartes ou aux jeux vidéo ?",ar:"هل تفضل لعب الورق أم ألعاب الفيديو؟",note:"اختيار"},
   {fr:"Faisons une promenade avant le coucher du soleil.",ar:"لنتمشَّ قبل غروب الشمس.",note:"اقتراح جماعي"},
   {fr:"Pourquoi ne pas organiser un pique-nique ?",ar:"لماذا لا ننظم نزهة؟",note:"Pourquoi ne pas"},
   {fr:"J’apporte les boissons et tu prépares les sandwichs.",ar:"سأحضر المشروبات وأنت تحضّر الشطائر.",note:"تقسيم المهام"},
   {fr:"Invitons aussi Lina et Sami.",ar:"لندعُ لينا وسامي أيضًا.",note:"دعوة آخرين"},
   {fr:"Choisis l’activité que tu préfères.",ar:"اختر النشاط الذي تفضله.",note:"منح الاختيار"}
  ]
 },
 {
  label:"الرأي والموافقة والاختلاف",
  description:"عبّر عن رأيك بوضوح، ووافق أو اختلف بلطف مع احترام رأي صديقك.",
  items:[
   {fr:"À mon avis, cette idée est excellente.",ar:"في رأيي، هذه الفكرة ممتازة.",note:"إبداء الرأي"},
   {fr:"Je pense que ce film est très drôle.",ar:"أعتقد أن هذا الفيلم مضحك جدًا.",note:"Je pense que"},
   {fr:"Je suis tout à fait d’accord avec toi.",ar:"أتفق معك تمامًا.",note:"موافقة كاملة"},
   {fr:"Moi aussi, j’aime beaucoup cette chanson.",ar:"وأنا أيضًا أحب هذه الأغنية كثيرًا.",note:"موافقة"},
   {fr:"Je comprends ton avis, mais je préfère autre chose.",ar:"أفهم رأيك، لكنني أفضل شيئًا آخر.",note:"اختلاف مهذب"},
   {fr:"Je ne suis pas vraiment d’accord.",ar:"أنا لا أوافق حقًا.",note:"اختلاف مباشر"},
   {fr:"Pour moi, la deuxième option est meilleure.",ar:"بالنسبة لي، الخيار الثاني أفضل.",note:"تفضيل"},
   {fr:"On peut choisir une solution qui nous convient à tous.",ar:"يمكننا اختيار حل يناسبنا جميعًا.",note:"حل مشترك"}
  ]
 },
 {
  label:"المكالمات والرسائل",
  description:"استخدم عبارات قصيرة لبدء الاتصال وطلب الرد وإرسال معلومات الموعد.",
  items:[
   {fr:"Allô, salut ! Tu peux parler maintenant ?",ar:"مرحبًا! هل يمكنك التحدث الآن؟",note:"بدء مكالمة"},
   {fr:"Je t’appelle pour notre programme de demain.",ar:"أتصل بك بخصوص برنامجنا غدًا.",note:"سبب الاتصال"},
   {fr:"Je ne peux pas parler, je te rappelle plus tard.",ar:"لا أستطيع التحدث، سأتصل بك لاحقًا.",note:"تأجيل المكالمة"},
   {fr:"Tu as reçu mon message ?",ar:"هل استلمت رسالتي؟",note:"التأكد من الرسالة"},
   {fr:"Oui, je viens de le lire.",ar:"نعم، قرأتها للتو.",note:"رد على رسالة"},
   {fr:"Envoie-moi l’heure exacte, s’il te plaît.",ar:"أرسل لي الوقت الدقيق من فضلك.",note:"طلب معلومة"},
   {fr:"Je t’écris quand je suis prêt.",ar:"سأكتب لك عندما أكون مستعدًا.",note:"وعد بالرسالة"},
   {fr:"À tout à l’heure, prends soin de toi !",ar:"أراك بعد قليل، اعتنِ بنفسك!",note:"إنهاء ودي"}
  ]
 },
 {
  label:"الاعتذار وتغيير الموعد",
  description:"اعتذر باختصار، اشرح السبب دون إطالة، واقترح موعدًا بديلًا.",
  items:[
   {fr:"Je suis désolé, je suis en retard.",ar:"أنا آسف، لقد تأخرت.",note:"اعتذار"},
   {fr:"Excuse-moi, j’ai oublié de te répondre.",ar:"اعذرني، نسيت أن أرد عليك.",note:"اعتذار لصديق"},
   {fr:"Ce n’est pas grave, ne t’inquiète pas.",ar:"لا بأس، لا تقلق.",note:"قبول الاعتذار"},
   {fr:"Je ne me sens pas bien, je préfère rester chez moi.",ar:"لا أشعر أنني بخير، أفضل البقاء في المنزل.",note:"سبب التغيير"},
   {fr:"Est-ce qu’on peut reporter notre rencontre ?",ar:"هل يمكننا تأجيل لقائنا؟",note:"طلب التأجيل"},
   {fr:"On peut changer l’heure si tu veux.",ar:"يمكننا تغيير الوقت إن أردت.",note:"مرونة"},
   {fr:"Demain à la même heure, ça te va ?",ar:"غدًا في الوقت نفسه، هل يناسبك؟",note:"موعد بديل"},
   {fr:"Merci de me prévenir, on se voit demain.",ar:"شكرًا لإخباري، نلتقي غدًا.",note:"تأكيد جديد"}
  ]
 },
 {
  label:"خطط عطلة نهاية الأسبوع",
  description:"تحدث مع أصدقائك عن رغباتكم وخططكم ثم اتفقوا على برنامج بسيط.",
  items:[
   {fr:"Qu’est-ce que tu fais ce week-end ?",ar:"ماذا ستفعل نهاية هذا الأسبوع؟",note:"سؤال عن الخطة"},
   {fr:"Samedi, je vais passer la journée avec mes amis.",ar:"السبت سأقضي اليوم مع أصدقائي.",note:"خطة السبت"},
   {fr:"Dimanche, je veux me reposer à la maison.",ar:"الأحد أريد أن أرتاح في المنزل.",note:"خطة الأحد"},
   {fr:"Nous allons jouer au football le matin.",ar:"سنلعب كرة القدم صباحًا.",note:"خطة جماعية"},
   {fr:"L’après-midi, on peut préparer un goûter ensemble.",ar:"بعد الظهر يمكننا تحضير وجبة خفيفة معًا.",note:"اقتراح"},
   {fr:"S’il fait beau, nous ferons une longue promenade.",ar:"إذا كان الجو جميلًا فسنتمشى طويلًا.",note:"خطة مشروطة"},
   {fr:"Je préfère un programme calme cette semaine.",ar:"أفضل برنامجًا هادئًا هذا الأسبوع.",note:"تفضيل"},
   {fr:"Parfait, notre week-end est organisé !",ar:"ممتاز، تم تنظيم عطلة نهاية أسبوعنا!",note:"تأكيد الخطة"}
  ]
 },
 {
  label:"حوارات كاملة بين صديقين",
  description:"استمع إلى كل تبادل كامل ولاحظ كيف يبدأ الحوار ويتطور وينتهي طبيعيًا.",
  items:[
   {fr:"Nora : Salut Sami, tu es libre samedi ? Sami : Oui, pourquoi ?",ar:"نورة: مرحبًا سامي، هل أنت متفرغ السبت؟ سامي: نعم، لماذا؟",note:"بدء حوار"},
   {fr:"Nora : Ça te dit de regarder un film ? Sami : Oui, avec plaisir.",ar:"نورة: ما رأيك أن نشاهد فيلمًا؟ سامي: نعم، بكل سرور.",note:"دعوة وقبول"},
   {fr:"Sami : À quelle heure on se retrouve ? Nora : Vers quatre heures.",ar:"سامي: في أي ساعة نلتقي؟ نورة: قرابة الرابعة.",note:"تحديد الوقت"},
   {fr:"Lina : Tu préfères quel film ? Amal : J’aime les comédies.",ar:"لينا: أي فيلم تفضلين؟ أمل: أحب الأفلام الكوميدية.",note:"سؤال عن التفضيل"},
   {fr:"Omar : Je ne suis pas d’accord. Khaled : D’accord, choisissons ensemble.",ar:"عمر: أنا لا أوافق. خالد: حسنًا، لنختر معًا.",note:"اختلاف وحل"},
   {fr:"Sarah : Désolée, je vais être en retard. Nora : Ce n’est pas grave.",ar:"سارة: آسفة، سأتأخر. نورة: لا بأس.",note:"اعتذار"},
   {fr:"Sami : Envoie-moi un message quand tu arrives. Omar : Bien sûr.",ar:"سامي: أرسل لي رسالة عندما تصل. عمر: بالتأكيد.",note:"تنسيق الوصول"},
   {fr:"Nora : Merci pour cette belle journée ! Lina : Moi aussi, je suis très contente.",ar:"نورة: شكرًا على هذا اليوم الجميل! لينا: وأنا أيضًا سعيدة جدًا.",note:"إنهاء الحوار"}
  ]
 }
];

export default function UniversityPage({initialLevelId,initialModuleId,levelPage=false,lessonPage=false}:UniversityPageProps={}){
 const router=useRouter();
 const level=LEVELS.find(item=>item.id.toLocaleLowerCase("fr")===initialLevelId?.toLocaleLowerCase("fr"))??LEVELS[0];
 const requestedModule=level.modules.find(item=>item.id===initialModuleId)??level.modules[0];
 const [moduleId,setModuleId]=useState(requestedModule.id);
 const [lessonStage,setLessonStage]=useState<LessonStage>("learn");
 const [openSectionIndex,setOpenSectionIndex]=useState(0);
 const [openPhaseIndex,setOpenPhaseIndex]=useState(0);
 const [quizAnswers,setQuizAnswers]=useState<Record<number,number>>({});
 const [quizQuestionIndex,setQuizQuestionIndex]=useState(0);
 const [quizFinished,setQuizFinished]=useState(false);
 const [completedModuleIds,setCompletedModuleIds]=useState<string[]>([]);
 const [lastModuleId,setLastModuleId]=useState(level.modules[0].id);
 const [activeLetter,setActiveLetter]=useState("A");
 const [numberPageIndex,setNumberPageIndex]=useState(0);
 const [introductionPageIndex,setIntroductionPageIndex]=useState(0);
 const [nounPageIndex,setNounPageIndex]=useState(0);
 const [coreVerbPageIndex,setCoreVerbPageIndex]=useState(0);
 const [presentPageIndex,setPresentPageIndex]=useState(0);
 const [timeDatePageIndex,setTimeDatePageIndex]=useState(0);
 const [descriptionPanel,setDescriptionPanel]=useState<DescriptionPanel>("family");
 const [descriptionVisualPageIndex,setDescriptionVisualPageIndex]=useState(0);
 const descriptionPaginationRef=useRef<HTMLDivElement>(null);
 const descriptionPaginationTopRef=useRef<number|null>(null);
 const [adjectivePageIndex,setAdjectivePageIndex]=useState(0);
 const [adjectivePanel,setAdjectivePanel]=useState<AdjectivePanel>("appearance");
 const [adjectiveVisualPageIndex,setAdjectiveVisualPageIndex]=useState(0);
 const adjectivePaginationRef=useRef<HTMLDivElement>(null);
 const adjectivePaginationTopRef=useRef<number|null>(null);
 const [dailyPageIndex,setDailyPageIndex]=useState(0);
 const [friendsPageIndex,setFriendsPageIndex]=useState(0);
 const [revisionListeningAnswers,setRevisionListeningAnswers]=useState<Record<number,number>>({});
 const [revisionWritingText,setRevisionWritingText]=useState("");
 const [isRecording,setIsRecording]=useState(false);
 const [recordingUrl,setRecordingUrl]=useState("");
 const [recordingError,setRecordingError]=useState("");
 const mediaRecorderRef=useRef<MediaRecorder|null>(null);
 const recordingStreamRef=useRef<MediaStream|null>(null);
 const recordingChunksRef=useRef<Blob[]>([]);
 const activeModule=useMemo(()=>level.modules.find(item=>item.id===moduleId)??level.modules[0],[level,moduleId]);
 const phases=COURSE_PHASES[level.id]??[{title:"مسار المستوى",fr:`Programme ${level.id}`,description:level.description,moduleIds:level.modules.map(item=>item.id)}];
 const ActiveModuleIcon=activeModule.icon;
 const numberPage=NUMBER_PAGES[numberPageIndex];
 const introductionPage=INTRODUCTION_PAGES[introductionPageIndex];
 const nounPage=NOUN_ARTICLE_PAGES[nounPageIndex];
 const coreVerbPage=CORE_VERB_PAGES[coreVerbPageIndex];
 const presentPage=PRESENT_NEGATION_PAGES[presentPageIndex];
 const timeDatePage=TIME_DATE_APPLICATION_PAGES[timeDatePageIndex];
 const adjectivePage=ADJECTIVE_DESCRIPTION_PAGES[adjectivePageIndex];
 const dailyPage=DAILY_LIFE_PAGES[dailyPageIndex];
 const friendsPage=FRIENDS_SITUATIONS_PAGES[friendsPageIndex];
 const revisionWordCount=(revisionWritingText.match(/[A-Za-zÀ-ÖØ-öø-ÿŒœ]+(?:['’-][A-Za-zÀ-ÖØ-öø-ÿŒœ]+)*/g)??[]).length;
 const revisionWritingChecks=[
  {label:"من 60 إلى 80 كلمة",passed:revisionWordCount>=60&&revisionWordCount<=80},
  {label:"فعل ضميري واحد على الأقل",passed:/\b(?:je\s+m[’']|tu\s+t[’']|(?:il|elle|on)\s+s[’']|nous\s+nous\s|vous\s+vous\s|(?:ils|elles)\s+se\s)/i.test(revisionWritingText)},
  {label:"صيغة نفي واحدة على الأقل",passed:/\bne\s+|\bn[’'][a-zà-ÿ]+\s+(?:pas|jamais|plus|rien|personne)\b/i.test(revisionWritingText)},
  {label:"رابطان مختلفان على الأقل",passed:["d’abord","puis","ensuite","enfin","parce que","donc","mais"].filter(link=>revisionWritingText.toLocaleLowerCase("fr").includes(link)).length>=2}
 ];
 const descriptionVisualConfig=descriptionPanel==="physical"
  ?{items:PHYSICAL_STATE_VOCABULARY,path:"/university/vocabulary/physical-states-sprite.png",columns:5,rows:5,aspect:"1 / 1",label:"الحالات الجسدية واليومية",fr:"États physiques"}
  :descriptionPanel==="emotions"
   ?{items:EMOTION_VOCABULARY,path:"/university/vocabulary/emotions-sprite.png",columns:5,rows:6,aspect:"4 / 5",label:"المشاعر",fr:"Émotions"}
   :{items:FAMILY_VOCABULARY,path:"/university/vocabulary/family-sprite-frameless.png",columns:5,rows:4,aspect:"1 / 1",label:"أفراد العائلة",fr:"La famille"};
 const descriptionVisualPageCount=Math.max(1,Math.ceil(descriptionVisualConfig.items.length/DESCRIPTION_VISUAL_PAGE_SIZE));
 const descriptionVisualItems=descriptionVisualConfig.items.slice(descriptionVisualPageIndex*DESCRIPTION_VISUAL_PAGE_SIZE,descriptionVisualPageIndex*DESCRIPTION_VISUAL_PAGE_SIZE+DESCRIPTION_VISUAL_PAGE_SIZE);
 const adjectiveVisualConfig=adjectivePanel==="hairEyes"
  ?{items:HAIR_EYES_ADJECTIVES,path:"/university/vocabulary/adjectives-hair-eyes-sprite.png",columns:4,rows:4,aspect:"1 / 1",label:"الشعر والعينان",fr:"Cheveux et yeux"}
  :adjectivePanel==="personality"
   ?{items:PERSONALITY_ADJECTIVES,path:"/university/vocabulary/adjectives-personality-sprite.png",columns:5,rows:6,aspect:"4 / 5",label:"الصفات الشخصية والطباع",fr:"Personnalité et caractère"}
   :{items:APPEARANCE_ADJECTIVES,path:"/university/vocabulary/adjectives-appearance-sprite.png",columns:4,rows:4,aspect:"1 / 1",label:"المظهر العام",fr:"Apparence générale"};
 const adjectiveVisualPageCount=Math.max(1,Math.ceil(adjectiveVisualConfig.items.length/ADJECTIVE_VISUAL_PAGE_SIZE));
 const adjectiveVisualItems=adjectiveVisualConfig.items.slice(adjectiveVisualPageIndex*ADJECTIVE_VISUAL_PAGE_SIZE,adjectiveVisualPageIndex*ADJECTIVE_VISUAL_PAGE_SIZE+ADJECTIVE_VISUAL_PAGE_SIZE);

 const moveDescriptionVisualPage=(nextPageIndex:number)=>{
  descriptionPaginationTopRef.current=descriptionPaginationRef.current?.getBoundingClientRect().top??null;
  setDescriptionVisualPageIndex(nextPageIndex);
 };

 const moveAdjectiveVisualPage=(nextPageIndex:number)=>{
  adjectivePaginationTopRef.current=adjectivePaginationRef.current?.getBoundingClientRect().top??null;
  setAdjectiveVisualPageIndex(nextPageIndex);
 };

 useLayoutEffect(()=>{
  const previousTop=descriptionPaginationTopRef.current;
  if(previousTop===null)return;
  const nextTop=descriptionPaginationRef.current?.getBoundingClientRect().top;
  descriptionPaginationTopRef.current=null;
  if(nextTop===undefined)return;
  window.scrollBy({top:nextTop-previousTop,left:0,behavior:"auto"});
 },[descriptionVisualPageIndex]);

 useLayoutEffect(()=>{
  const previousTop=adjectivePaginationTopRef.current;
  if(previousTop===null)return;
  const nextTop=adjectivePaginationRef.current?.getBoundingClientRect().top;
  adjectivePaginationTopRef.current=null;
  if(nextTop===undefined)return;
  window.scrollBy({top:nextTop-previousTop,left:0,behavior:"auto"});
 },[adjectiveVisualPageIndex]);

 const practiceExamples=useMemo(()=>{
  if(activeModule.id==="description")return DESCRIPTION_PRACTICE_ITEMS.map(item=>({fr:item.fr,ar:item.ar,speech:item.speech}));
  if(activeModule.id==="adjectives")return ADJECTIVE_PRACTICE_ITEMS.map(item=>({fr:item.fr,ar:item.ar,speech:item.speech}));
  if(level.id==="A2"&&activeModule.id==="revision")return A2_REVISION_PRACTICE_ITEMS.map(item=>({...item,speech:[item.fr]}));
  return activeModule.sections.flatMap(item=>item.examples).slice(0,6).map(item=>({...item,speech:[item.fr]}));
 },[activeModule,level.id]);

 const quizQuestions=useMemo(()=>{
  if(level.id==="A2"&&activeModule.id==="revision")return A2_REVISION_QUIZ_ITEMS;
  const examples=activeModule.sections.flatMap(item=>item.examples);
  const seeds=(activeModule.id==="description"
   ?DESCRIPTION_QUIZ_ITEMS.map(item=>({prompt:item.speech[0],answer:item.quizAr??item.ar}))
   :activeModule.id==="adjectives"
    ?ADJECTIVE_QUIZ_ITEMS.map(item=>({prompt:item.speech[0],answer:item.quizAr??item.ar.split(" — ")[0]}))
    :[
    {prompt:activeModule.title,answer:activeModule.ar},
    ...activeModule.sections.map(item=>({prompt:item.title,answer:item.subtitle})),
    ...examples.map(example=>({prompt:example.fr,answer:example.ar})),
    {prompt:`${activeModule.title} — ${activeModule.sections[0]?.title??activeModule.title}`,answer:`${activeModule.ar} — ${activeModule.sections[0]?.subtitle??activeModule.ar}`}
   ]).filter((item,index,array)=>array.findIndex(candidate=>candidate.prompt===item.prompt)===index).slice(0,10);
  const answerPool=seeds.map(item=>item.answer);
  return seeds.map((item,index)=>{
   const distractors=answerPool.filter(answer=>answer!==item.answer);
   const first=distractors[(index*2)%distractors.length];
   const second=distractors[(index*2+1)%distractors.length];
   const raw=[item.answer,first,second];
   const shift=index%raw.length;
   const choices=[...raw.slice(shift),...raw.slice(0,shift)];
   return {prompt:item.prompt,choices,correctIndex:choices.indexOf(item.answer),instruction:"استمع إلى العبارة الفرنسية، ثم اختر معناها الصحيح.",speech:item.prompt};
  });
 },[activeModule,level.id]);

 const activeModuleIndex=level.modules.findIndex(item=>item.id===activeModule.id);
 const previousModule=activeModuleIndex>0?level.modules[activeModuleIndex-1]:null;
 const nextModule=activeModuleIndex<level.modules.length-1?level.modules[activeModuleIndex+1]:null;
 const quizScore=quizQuestions.reduce((score,question,index)=>score+(quizAnswers[index]===question.correctIndex?1:0),0);
 const quizPassed=quizFinished&&quizScore>=7;

 useEffect(()=>{
  const nextModule=level.modules.find(item=>item.id===initialModuleId)??level.modules[0];
  setModuleId(nextModule.id);
  setLessonStage("learn");
  setOpenSectionIndex(0);
  setQuizAnswers({});
  setQuizQuestionIndex(0);
  setQuizFinished(false);
  setDescriptionPanel("family");
  setDescriptionVisualPageIndex(0);
  setAdjectivePageIndex(0);
  setAdjectivePanel("appearance");
  setAdjectiveVisualPageIndex(0);
  setRevisionListeningAnswers({});
  setRevisionWritingText("");
 },[initialModuleId,level]);

 useEffect(()=>()=>{
  recordingStreamRef.current?.getTracks().forEach(track=>track.stop());
  if(recordingUrl)URL.revokeObjectURL(recordingUrl);
 },[recordingUrl]);

 useEffect(()=>{
  try{
   const saved=window.localStorage.getItem(`university-progress-${level.id}`);
   const parsed=saved?JSON.parse(saved):[];
   setCompletedModuleIds(Array.isArray(parsed)?parsed:[]);
   const last=window.localStorage.getItem(`university-last-${level.id}`);
   if(last&&level.modules.some(item=>item.id===last))setLastModuleId(last);
  }catch{setCompletedModuleIds([])}
 },[level]);

 useEffect(()=>{
  if(!lessonPage)return;
  setLastModuleId(activeModule.id);
  window.localStorage.setItem(`university-last-${level.id}`,activeModule.id);
 },[activeModule.id,lessonPage,level.id]);

 useEffect(()=>{
  if(!lessonPage||!quizPassed||completedModuleIds.includes(activeModule.id))return;
  const next=[...completedModuleIds,activeModule.id];
  setCompletedModuleIds(next);
  window.localStorage.setItem(`university-progress-${level.id}`,JSON.stringify(next));
 },[activeModule.id,completedModuleIds,lessonPage,level.id,quizPassed]);

 const selectModule=(id:string)=>{
  router.push(`/university/${level.id.toLocaleLowerCase("fr")}/${id}`);
 };

 const resetQuiz=()=>{
  setQuizAnswers({});
  setQuizQuestionIndex(0);
  setQuizFinished(false);
 };

 const advanceQuiz=()=>{
  if(typeof quizAnswers[quizQuestionIndex]!=="number")return;
  if(quizQuestionIndex===quizQuestions.length-1)setQuizFinished(true);
  else setQuizQuestionIndex(index=>index+1);
 };

 const startRevisionRecording=async()=>{
  setRecordingError("");
  if(!navigator.mediaDevices?.getUserMedia||typeof MediaRecorder==="undefined"){
   setRecordingError("التسجيل غير مدعوم في هذا المتصفح. افتح الدرس في Safari أو Chrome وحدّث الصفحة.");
   return;
  }
  try{
   const stream=await navigator.mediaDevices.getUserMedia({audio:true});
   const recorder=new MediaRecorder(stream);
   recordingStreamRef.current=stream;
   recordingChunksRef.current=[];
   recorder.ondataavailable=event=>{if(event.data.size>0)recordingChunksRef.current.push(event.data)};
   recorder.onstop=()=>{
    const blob=new Blob(recordingChunksRef.current,{type:recorder.mimeType||"audio/webm"});
    setRecordingUrl(previous=>{if(previous)URL.revokeObjectURL(previous);return URL.createObjectURL(blob)});
    stream.getTracks().forEach(track=>track.stop());
    recordingStreamRef.current=null;
    setIsRecording(false);
   };
   mediaRecorderRef.current=recorder;
   recorder.start();
   setIsRecording(true);
  }catch{
   setRecordingError("تعذّر تشغيل الميكروفون. اسمح للموقع باستخدامه من إعدادات المتصفح ثم حاول مجددًا.");
  }
 };

 const stopRevisionRecording=()=>{
  if(mediaRecorderRef.current?.state==="recording")mediaRecorderRef.current.stop();
 };

 const deleteRevisionRecording=()=>{
  if(recordingUrl)URL.revokeObjectURL(recordingUrl);
  setRecordingUrl("");
  setRecordingError("");
 };

 const backHref=lessonPage?`/university/${level.id.toLocaleLowerCase("fr")}`:levelPage?"/university":"/kingdom";
 const resumeModule=level.modules.find(item=>item.id===lastModuleId)??level.modules[0];

 return <main className={`university-world ${levelPage?"university-level-world":""}`} dir="rtl">
  <header className="university-topbar">
   <Link href={backHref} aria-label={lessonPage?`العودة إلى منهج ${level.id}`:levelPage?"العودة إلى مستويات الجامعة":"العودة إلى واجهة القلعة"}><ArrowRight/></Link>
   <div><span>جامعة القلعة</span><strong>L’Université Royale</strong></div>
   <div className="university-seal"><GraduationCap/></div>
  </header>

  {!levelPage&&<>
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
    {LEVELS.map(item=><button key={item.id} onClick={()=>router.push(`/university/${item.id.toLocaleLowerCase("fr")}`)}>
     <div className="university-level-code">{item.id}</div>
     <div><span>{item.label}</span><h3>{item.ar}</h3><p>{item.description}</p><small>{item.modules.length} وحدات · شرح وأمثلة ونطق</small></div>
     <ChevronLeft/>
    </button>)}
   </div>
  </section>
  </>}

  {levelPage&&!lessonPage&&<section className="university-level-entry">
   <div>
    <Link href="/university"><ArrowRight/> جميع المستويات</Link>
    <span>Programme {level.id}</span>
    <h1>{level.ar}</h1>
    <h2>{level.label}</h2>
    <p>{level.description}</p>
   </div>
   <aside><b>{level.id}</b><span>{level.modules.length} وحدات تعليمية</span><small>شرح · أمثلة · نطق</small></aside>
  </section>}

  {levelPage&&!lessonPage&&<section className="university-journey" aria-label={`مسار المستوى ${level.id}`}>
   <div className="university-resume-card">
    <div className="university-resume-icon"><MapPinned/></div>
    <div><span>تابع من حيث توقفت</span><h2>{resumeModule.ar}</h2><p>{resumeModule.title}</p></div>
    <Link href={`/university/${level.id.toLocaleLowerCase("fr")}/${resumeModule.id}`}><Play/> متابعة الدرس</Link>
   </div>
   <div className="university-progress-card">
    <div><span>تقدمك في المستوى</span><strong>{completedModuleIds.length} من {level.modules.length} وحدات</strong></div>
    <div className="university-progress-track"><i style={{width:`${Math.round(completedModuleIds.length/level.modules.length*100)}%`}}/></div>
    <b>{Math.round(completedModuleIds.length/level.modules.length*100)}%</b>
   </div>
   <div className="university-journey-heading"><span>Parcours guidé</span><h2>رحلة التعلّم الموجّهة</h2><p>افتح مرحلة واحدة، ثم ادخل الدرس المطلوب. لن تظهر محتويات الدروس كلها في الصفحة نفسها.</p></div>
   <div className="university-phase-list">
    {phases.map((phase,phaseIndex)=>{
     const phaseModules=phase.moduleIds.map(id=>level.modules.find(item=>item.id===id)).filter((item):item is CourseModule=>Boolean(item));
     const phaseCompleted=phaseModules.filter(item=>completedModuleIds.includes(item.id)).length;
     return <details key={phase.title} className="university-phase" open={openPhaseIndex===phaseIndex}>
      <summary onClick={event=>{event.preventDefault();setOpenPhaseIndex(current=>current===phaseIndex?-1:phaseIndex)}}>
       <i>{String(phaseIndex+1).padStart(2,"0")}</i>
       <div><span>{phase.fr}</span><h3>{phase.title}</h3><p>{phase.description}</p></div>
       <em>{phaseCompleted}/{phaseModules.length}</em><ChevronDown/>
      </summary>
      <div className="university-phase-modules">
       {phaseModules.map(module=>{
        const Icon=module.icon;
        const moduleIndex=level.modules.findIndex(item=>item.id===module.id);
        const completed=completedModuleIds.includes(module.id);
        return <Link key={module.id} href={`/university/${level.id.toLocaleLowerCase("fr")}/${module.id}`}>
         <i className={completed?"completed":""}>{completed?<CheckCircle2/>:<Icon/>}</i>
         <div><small>الدرس {moduleIndex+1}</small><strong>{module.ar}</strong><span>{module.title}</span></div>
         <ChevronLeft/>
        </Link>;
       })}
      </div>
     </details>;
    })}
   </div>
  </section>}

  {lessonPage&&<section className="university-course university-course-focused" id="university-course">
   <aside className="university-lesson-guide">
    <Link href={`/university/${level.id.toLocaleLowerCase("fr")}`}><ArrowRight/> منهج {level.id}</Link>
    <div><span>الدرس {activeModuleIndex+1} من {level.modules.length}</span><h2>{activeModule.ar}</h2><p>{activeModule.title}</p></div>
    <nav aria-label="مراحل الدرس">
     <button className={lessonStage==="learn"?"active":""} onClick={()=>setLessonStage("learn")}><BookOpen/><span><b>تعلّم</b><small>الشرح والأمثلة</small></span></button>
     <button className={lessonStage==="practice"?"active":""} onClick={()=>setLessonStage("practice")}><Headphones/><span><b>تدرّب</b><small>استمع وكرّر</small></span></button>
     <button className={lessonStage==="test"?"active":""} onClick={()=>setLessonStage("test")}><ListChecks/><span><b>اختبر نفسك</b><small>أسئلة قصيرة</small></span></button>
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

    {lessonStage==="learn"&&<>
    {activeModule.id==="alphabet"&&<section className="university-alphabet">
     <div className="university-subheading"><div><span>Alphabet interactif</span><h3>اضغط على الحرف لسماع نطقه</h3></div><Volume2/></div>
     <div className="university-letter-grid">
      {ALPHABET.map(([letter,pronunciation,word,meaning])=><button key={letter} className={activeLetter===letter?"active":""} aria-label={`استمع إلى الحرف ${letter} ثم كلمة ${word}`} onClick={()=>{setActiveLetter(letter);void speakFrenchWithPause(LETTER_SPEECH_OVERRIDES[letter]??pronunciation,word,800,{rate:LETTER_SPEECH_RATES[letter]??.72})}}>
       <b>{letter}</b><span>{pronunciation}</span><small>{word}</small><em>{meaning}</em>
      </button>)}
     </div>
     <div className="university-letter-focus">
      <div><span>الحرف المحدد</span><b>{activeLetter}</b></div>
      <p>اضغط مرة أخرى وكرّر اسم الحرف بصوت مرتفع، ثم استمع إلى الكلمة المرتبطة به.</p>
      <button onClick={()=>{const item=ALPHABET.find(value=>value[0]===activeLetter)!;void speakFrenchWithPause(LETTER_SPEECH_OVERRIDES[item[0]]??item[1],item[2],800,{rate:LETTER_SPEECH_RATES[item[0]]??.72})}}><Play/> نطق الحرف ثم الكلمة</button>
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
      <div><span>Les jours de la semaine</span><h3>أيام الأسبوع</h3></div>
      <CalendarDays/>
     </div>
     <p className="university-calendar-intro">تبدأ أيام الأسبوع بيوم الاثنين وتنتهي بيوم الأحد.</p>
     <div className="university-calendar-grid days" dir="ltr">
      {DAYS_OF_WEEK.map((item,index)=><button key={item.fr} onClick={()=>void speakFrench(item.fr,{rate:.7})} aria-label={`استمع إلى ${item.fr}`}><i>{index+1}</i><strong>{item.fr}</strong><span dir="rtl">{item.ar}</span><Volume2/></button>)}
     </div>
    </section>}

    {activeModule.id==="numbers-time"&&<section className="university-introduction-board university-grammar-board">
     <div className="university-subheading">
      <div><span>Les mois de l’année</span><h3>أشهر السنة</h3></div>
      <CalendarDays/>
     </div>
     <p className="university-calendar-intro">الأشهر الاثنا عشر في قائمة مستقلة، وكل شهر له نطق منفصل.</p>
     <div className="university-calendar-grid months" dir="ltr">
      {MONTHS_OF_YEAR.map((item,index)=><button key={item.fr} onClick={()=>void speakFrench(item.fr,{rate:.7})} aria-label={`استمع إلى ${item.fr}`}><i>{String(index+1).padStart(2,"0")}</i><strong>{item.fr}</strong><span dir="rtl">{item.ar}</span><Volume2/></button>)}
     </div>
    </section>}

    {activeModule.id==="numbers-time"&&<section className="university-introduction-board university-grammar-board">
     <div className="university-subheading">
      <div><span>Le calendrier</span><h3>كلمات التقويم الأساسية</h3></div>
      <Clock3/>
     </div>
     <p className="university-calendar-intro">اليوم والأسبوع والشهر والسنة والإجازة في قائمتها المخصصة قبل الجمل التطبيقية.</p>
     <div className="university-calendar-grid terms" dir="ltr">
      {CALENDAR_WORDS.map((item,index)=><button key={item.fr} onClick={()=>void speakFrench(item.fr,{rate:.72})} aria-label={`استمع إلى ${item.fr}`}><i>{String(index+1).padStart(2,"0")}</i><strong>{item.fr}</strong><span dir="rtl">{item.ar}</span><em dir="rtl">{item.note}</em><Volume2/></button>)}
     </div>
    </section>}

    {activeModule.id==="numbers-time"&&<section className="university-introduction-board university-grammar-board">
     <div className="university-subheading">
      <div><span>Heure et date en contexte</span><h3>الجمل التطبيقية للوقت والتاريخ</h3></div>
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
      <div><small>قسم الجمل التطبيقية</small><strong>{timeDatePage.label}</strong><em>{timeDatePageIndex+1} / {TIME_DATE_APPLICATION_PAGES.length}</em></div>
      <button onClick={()=>setTimeDatePageIndex(index=>Math.min(TIME_DATE_APPLICATION_PAGES.length-1,index+1))} disabled={timeDatePageIndex===TIME_DATE_APPLICATION_PAGES.length-1} aria-label="أمثلة الوقت التالية"><span>التالي</span><ChevronRight/></button>
     </div>
     <p className="university-phrase-note">{timeDatePage.description} جميع الأمثلة مختلفة ومفتوحة للتدريب دون اختبار.</p>
    </section>}

    {activeModule.id==="description"&&<section className="university-introduction-board university-description-studio">
     <div className="university-subheading university-description-heading">
      <div><span>Vocabulaire visuel A1</span><h3>العائلة والحالة والمشاعر</h3><p>اختر القسم، ثم اضغط على أي بطاقة لمشاهدة الصورة وسماع الفرنسية.</p></div>
      <Users/>
     </div>

     <div className="university-description-tabs" role="tablist" aria-label="أقسام درس العائلة والحالة والمشاعر">
      <button className={descriptionPanel==="family"?"active":""} onClick={()=>{setDescriptionPanel("family");setDescriptionVisualPageIndex(0)}} role="tab" aria-selected={descriptionPanel==="family"}><Users/><span><strong>العائلة</strong><small>La famille</small></span></button>
      <button className={descriptionPanel==="physical"?"active":""} onClick={()=>{setDescriptionPanel("physical");setDescriptionVisualPageIndex(0)}} role="tab" aria-selected={descriptionPanel==="physical"}><Mic2/><span><strong>الحالة الجسدية</strong><small>États physiques</small></span></button>
      <button className={descriptionPanel==="emotions"?"active":""} onClick={()=>{setDescriptionPanel("emotions");setDescriptionVisualPageIndex(0)}} role="tab" aria-selected={descriptionPanel==="emotions"}><Sparkles/><span><strong>المشاعر</strong><small>Les émotions</small></span></button>
     </div>

     <>
      <div className="university-description-section-title">
       <div><small>{descriptionVisualConfig.fr}</small><h4>{descriptionVisualConfig.label}</h4></div>
       <span>{descriptionVisualConfig.items.length} عبارة</span>
      </div>
      <div className={`university-visual-vocabulary-grid ${descriptionPanel}`}>
       {descriptionVisualItems.map((item:VisualVocabularyItem,index)=><button key={item.id} className="university-visual-vocabulary-card" onClick={()=>playVocabularySpeech(item.speech)} aria-label={`استمع إلى ${item.speech.join(" ثم ")}`}>
        {descriptionPanel==="physical"&&descriptionVisualPageIndex*DESCRIPTION_VISUAL_PAGE_SIZE+index>=6&&descriptionVisualPageIndex*DESCRIPTION_VISUAL_PAGE_SIZE+index<=19
         ?<span className="university-visual-vocabulary-image" role="img" aria-label={`صورة توضيحية ثابتة: ${item.ar}`} style={{aspectRatio:descriptionVisualConfig.aspect}}><span className="university-visual-vocabulary-sprite-layer" aria-hidden="true" style={precisePhysicalStateLayer(descriptionVisualConfig.path,item.spriteIndex)}/></span>
         :descriptionPanel==="emotions"&&descriptionVisualPageIndex===2&&index>=4
         ?<span className="university-visual-vocabulary-image" role="img" aria-label={`صورة توضيحية ثابتة: ${item.ar}`} style={{aspectRatio:descriptionVisualConfig.aspect}}><span className="university-visual-vocabulary-sprite-layer" aria-hidden="true" style={preciseEmotionPageThreeLayer(descriptionVisualConfig.path,item.spriteIndex)}/></span>
         :<span className="university-visual-vocabulary-image" role="img" aria-label={`صورة توضيحية ثابتة: ${item.ar}`} style={{...spriteBackground(descriptionVisualConfig.path,item.spriteIndex,descriptionVisualConfig.columns,descriptionVisualConfig.rows),aspectRatio:descriptionVisualConfig.aspect}}/>}
        <span className="university-visual-vocabulary-copy">
         <i>{String(descriptionVisualPageIndex*DESCRIPTION_VISUAL_PAGE_SIZE+index+1).padStart(2,"0")}</i>
         <strong dir="ltr">{item.fr}</strong>
         <b>{item.ar}</b>
         <em>{item.note}</em>
        </span>
        <span className="university-visual-vocabulary-audio"><Volume2/><small>FR</small></span>
       </button>)}
      </div>
      <div ref={descriptionPaginationRef} className="university-number-pagination university-phrase-pagination university-description-pagination" dir="ltr">
       <button onClick={()=>moveDescriptionVisualPage(Math.max(0,descriptionVisualPageIndex-1))} disabled={descriptionVisualPageIndex===0} aria-label="الصفحة السابقة"><ChevronLeft/><span>السابق</span></button>
       <div><small>{descriptionVisualConfig.fr}</small><strong>{descriptionVisualConfig.label}</strong><em>{descriptionVisualPageIndex+1} / {descriptionVisualPageCount}</em></div>
       <button onClick={()=>moveDescriptionVisualPage(Math.min(descriptionVisualPageCount-1,descriptionVisualPageIndex+1))} disabled={descriptionVisualPageIndex===descriptionVisualPageCount-1} aria-label="الصفحة التالية"><span>التالي</span><ChevronRight/></button>
      </div>
      <p className="university-phrase-note">في العبارات التي لها مذكر ومؤنث، ينطق الزر صيغة المذكر ثم يصمت قليلًا وينطق صيغة المؤنث؛ ولا ينطق الشرطة الظاهرة بينهما.</p>
     </>
    </section>}

    {activeModule.id==="adjectives"&&<section className="university-introduction-board university-description-studio university-adjectives-studio">
     <div className="university-subheading university-description-heading">
      <div><span>Vocabulaire visuel A1</span><h3>الصفات الشخصية والمظهر</h3><p>اختر القسم، ثم اضغط على أي بطاقة لمشاهدة الصورة وسماع الفرنسية.</p></div>
      <Sparkles/>
     </div>
     <div className="university-description-tabs university-adjective-tabs" role="tablist" aria-label="أقسام درس الصفات الشخصية والمظهر">
      <button className={adjectivePanel==="appearance"?"active":""} onClick={()=>{setAdjectivePanel("appearance");setAdjectiveVisualPageIndex(0)}} role="tab" aria-selected={adjectivePanel==="appearance"}><Users/><span><strong>المظهر العام</strong><small>Apparence</small></span></button>
      <button className={adjectivePanel==="hairEyes"?"active":""} onClick={()=>{setAdjectivePanel("hairEyes");setAdjectiveVisualPageIndex(0)}} role="tab" aria-selected={adjectivePanel==="hairEyes"}><Sparkles/><span><strong>الشعر والعينان</strong><small>Cheveux et yeux</small></span></button>
      <button className={adjectivePanel==="personality"?"active":""} onClick={()=>{setAdjectivePanel("personality");setAdjectiveVisualPageIndex(0)}} role="tab" aria-selected={adjectivePanel==="personality"}><NotebookTabs/><span><strong>الصفات الشخصية</strong><small>Personnalité</small></span></button>
     </div>
     <div className="university-description-section-title">
      <div><small>{adjectiveVisualConfig.fr}</small><h4>{adjectiveVisualConfig.label}</h4></div>
      <span>{adjectiveVisualConfig.items.length} صفة</span>
     </div>
     <div className={`university-visual-vocabulary-grid adjective-${adjectivePanel}`}>
      {adjectiveVisualItems.map((item,index)=><button key={item.id} className="university-visual-vocabulary-card" onClick={()=>playVocabularySpeech(item.speech)} aria-label={`استمع إلى ${item.speech.join(" ثم ")}`}>
       <span className="university-visual-vocabulary-image" role="img" aria-label={`صورة توضيحية ثابتة: ${item.ar}`} style={{...spriteBackground(adjectiveVisualConfig.path,item.spriteIndex,adjectiveVisualConfig.columns,adjectiveVisualConfig.rows),aspectRatio:adjectiveVisualConfig.aspect}}/>
       <span className="university-visual-vocabulary-copy">
        <i>{String(adjectiveVisualPageIndex*ADJECTIVE_VISUAL_PAGE_SIZE+index+1).padStart(2,"0")}</i>
        <strong dir="ltr">{item.fr}</strong>
        <b>{item.ar}</b>
        <em>{item.note}</em>
       </span>
       <span className="university-visual-vocabulary-audio"><Volume2/><small>FR</small></span>
      </button>)}
     </div>
     <div ref={adjectivePaginationRef} className="university-number-pagination university-phrase-pagination university-description-pagination" dir="ltr">
      <button onClick={()=>moveAdjectiveVisualPage(Math.max(0,adjectiveVisualPageIndex-1))} disabled={adjectiveVisualPageIndex===0} aria-label="الصفحة السابقة"><ChevronLeft/><span>السابق</span></button>
      <div><small>{adjectiveVisualConfig.fr}</small><strong>{adjectiveVisualConfig.label}</strong><em>{adjectiveVisualPageIndex+1} / {adjectiveVisualPageCount}</em></div>
      <button onClick={()=>moveAdjectiveVisualPage(Math.min(adjectiveVisualPageCount-1,adjectiveVisualPageIndex+1))} disabled={adjectiveVisualPageIndex===adjectiveVisualPageCount-1} aria-label="الصفحة التالية"><span>التالي</span><ChevronRight/></button>
     </div>
     <p className="university-phrase-note">في الصفات التي لها مذكر ومؤنث، ينطق الزر صيغة المذكر ثم يصمت قليلًا وينطق صيغة المؤنث؛ ولا ينطق الشرطة الظاهرة بينهما.</p>
     <div className="university-description-section-title">
      <div><small>Adjectifs et description</small><h4>{adjectivePage.label}</h4></div>
      <span>{ADJECTIVE_DESCRIPTION_PAGES.length} مجموعات</span>
     </div>
     <div className="university-phrase-grid">
      {adjectivePage.items.map((item,index)=><button key={item.fr} onClick={()=>void speakFrench(item.fr,{rate:.74})} aria-label={`استمع إلى: ${item.fr}`}>
       <i>{String(index+1).padStart(2,"0")}</i>
       <div><strong dir="ltr">{item.fr}</strong><span>{item.ar}</span><em>{item.note}</em></div>
       <Volume2/>
      </button>)}
     </div>
     <div className="university-number-pagination university-phrase-pagination" dir="ltr">
      <button onClick={()=>setAdjectivePageIndex(index=>Math.max(0,index-1))} disabled={adjectivePageIndex===0} aria-label="مجموعة الصفات السابقة"><ChevronLeft/><span>السابق</span></button>
      <div><small>قسم الصفات والوصف</small><strong>{adjectivePage.label}</strong><em>{adjectivePageIndex+1} / {ADJECTIVE_DESCRIPTION_PAGES.length}</em></div>
      <button onClick={()=>setAdjectivePageIndex(index=>Math.min(ADJECTIVE_DESCRIPTION_PAGES.length-1,index+1))} disabled={adjectivePageIndex===ADJECTIVE_DESCRIPTION_PAGES.length-1} aria-label="مجموعة الصفات التالية"><span>التالي</span><ChevronRight/></button>
     </div>
     <p className="university-phrase-note">{adjectivePage.description}</p>
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

    {activeModule.id==="situations"&&<section className="university-introduction-board university-grammar-board">
     <div className="university-subheading">
      <div><span>Entre amis</span><h3>اضغط على العبارة أو الحوار لسماع النطق</h3></div>
      <MessageCircle/>
     </div>
     <div className="university-phrase-grid">
      {friendsPage.items.map((item,index)=><button key={item.fr} onClick={()=>void speakFrench(item.fr,{rate:.73})} aria-label={`استمع إلى: ${item.fr}`}>
       <i>{String(index+1).padStart(2,"0")}</i>
       <div><strong dir="ltr">{item.fr}</strong><span>{item.ar}</span><em>{item.note}</em></div>
       <Volume2/>
      </button>)}
     </div>
     <div className="university-number-pagination university-phrase-pagination" dir="ltr">
      <button onClick={()=>setFriendsPageIndex(index=>Math.max(0,index-1))} disabled={friendsPageIndex===0} aria-label="مواقف الأصدقاء السابقة"><ChevronLeft/><span>السابق</span></button>
      <div><small>قسم مواقف الأصدقاء</small><strong>{friendsPage.label}</strong><em>{friendsPageIndex+1} / {FRIENDS_SITUATIONS_PAGES.length}</em></div>
      <button onClick={()=>setFriendsPageIndex(index=>Math.min(FRIENDS_SITUATIONS_PAGES.length-1,index+1))} disabled={friendsPageIndex===FRIENDS_SITUATIONS_PAGES.length-1} aria-label="مواقف الأصدقاء التالية"><span>التالي</span><ChevronRight/></button>
     </div>
     <p className="university-phrase-note">{friendsPage.description} جميع الأمثلة اجتماعية مع الأصدقاء ومفتوحة للتدريب دون اختبار.</p>
    </section>}

    <div className="university-sections">
     {activeModule.sections.map((item,index)=><section key={item.title} className={`university-explanation ${openSectionIndex===index?"open":""}`}>
      <div className="university-explanation-title">
       <button className="university-section-toggle" onClick={()=>setOpenSectionIndex(current=>current===index?-1:index)} aria-expanded={openSectionIndex===index}>
        <span>{String(index+1).padStart(2,"0")}</span>
        <div><h3>{item.title}</h3><small>{item.subtitle}</small></div>
        <ChevronDown/>
       </button>
       <button onClick={()=>void speakFrench(item.title)} aria-label={`استمع إلى ${item.title}`}><Volume2/><b>نطق العنوان</b></button>
      </div>
      {openSectionIndex===index&&<div className="university-explanation-body">
       <p className="university-explanation-text">{item.explanation}</p>
       <div className="university-rule-list">{item.points.map(point=><p key={point}><i>✓</i>{point}</p>)}</div>
       <div className="university-example-list">
        <h4><MessageCircle/> Exemples expliqués</h4>
        {item.examples.map(example=><article key={example.fr}>
         <button onClick={()=>void speakFrench(example.fr)} aria-label={`استمع إلى ${example.fr}`}><Volume2/><b>استمع</b></button>
         <div><strong dir="ltr">{example.fr}</strong><span>{example.ar}</span></div>
        </article>)}
       </div>
      </div>}
     </section>)}
    </div>
    {level.id==="A2"&&activeModule.id==="revision"&&<section className="a2-reading-workshop">
     <div className="university-stage-heading"><BookOpen/><div><span>Lire et comprendre</span><h3>قراءة موجهة</h3><p>اقرأ النص أولًا دون ترجمة، ثم أجب عن الأسئلة واكشف الحل بعد المحاولة.</p></div></div>
     <article className="a2-reading-text">
      <header><div><small>Texte A2</small><h4>{A2_REVISION_READING.title}</h4><span>{A2_REVISION_READING.arTitle}</span></div><button onClick={()=>void speakFrench(A2_REVISION_READING.text,{rate:.76})}><Volume2/> استمع إلى النص</button></header>
      <p dir="ltr">{A2_REVISION_READING.text}</p>
      <details><summary>عرض الترجمة بعد المحاولة</summary><p>{A2_REVISION_READING.translation}</p></details>
     </article>
     <div className="a2-reading-questions">
      {A2_REVISION_READING.questions.map((item,index)=><article key={item.question}><span>{index+1}</span><div><strong dir="ltr">{item.question}</strong><details><summary>تحقق من إجابتك</summary><p dir="ltr">{item.answer}</p><small>{item.ar}</small></details></div><button onClick={()=>void speakFrench(item.question,{rate:.76})} aria-label={`استمع إلى السؤال ${index+1}`}><Volume2/></button></article>)}
     </div>
    </section>}
    </>}

    {lessonStage==="practice"&&<section className="university-practice-stage">
     <div className="university-stage-heading"><Headphones/><div><span>Écouter et répéter</span><h3>استمع ثم كرّر</h3><p>استمع إلى الفرنسية، كرّرها بصوت مرتفع، واقرأ المعنى العربي عند الحاجة.</p></div></div>
     {level.id==="A2"&&activeModule.id==="revision"&&<section className="a2-listening-lab">
      <header><div><span>Compréhension orale</span><h3>اختبار استماع بنص مخفي</h3><p>استمع مرتين، ثم أجب دون قراءة النص. يمكنك كشف النص بعد إنهاء المحاولة.</p></div><button onClick={()=>void speakFrench(A2_REVISION_LISTENING.text,{rate:.72})}><Headphones/> تشغيل المقطع الفرنسي</button></header>
      <div className="a2-listening-questions">
       {A2_REVISION_LISTENING.questions.map((question,index)=>{
        const selected=revisionListeningAnswers[index];
        return <article key={question.prompt}>
         <div><i>{index+1}</i><strong dir="ltr">{question.prompt}</strong><button onClick={()=>void speakFrench(question.prompt,{rate:.74})} aria-label={`استمع إلى سؤال الاستماع ${index+1}`}><Volume2/></button></div>
         <div className="a2-listening-choices" dir="ltr">{question.choices.map((choice,choiceIndex)=><button key={choice} className={selected===choiceIndex?(choiceIndex===question.correctIndex?"correct":"wrong"):""} onClick={()=>setRevisionListeningAnswers(current=>({...current,[index]:choiceIndex}))}><span>{String.fromCharCode(65+choiceIndex)}</span>{choice}</button>)}</div>
         {typeof selected==="number"&&<small className={selected===question.correctIndex?"correct":"wrong"}>{selected===question.correctIndex?"إجابة صحيحة":"حاول مرة أخرى واستمع إلى المقطع"}</small>}
        </article>;
       })}
      </div>
      <details className="a2-listening-transcript"><summary>إظهار النص الفرنسي بعد المحاولة</summary><h4>{A2_REVISION_LISTENING.title}</h4><p dir="ltr">{A2_REVISION_LISTENING.text}</p></details>
     </section>}
     <div className="university-practice-list">
      {practiceExamples.map((example,index)=><article key={`${example.fr}-${index}`}>
       <i>{String(index+1).padStart(2,"0")}</i>
       <div><strong dir="ltr">{example.fr}</strong><span>{example.ar}</span></div>
       <div className="university-dual-audio">
        <button onClick={()=>playVocabularySpeech(example.speech)} aria-label={`استمع إلى الجملة الفرنسية ${example.speech.join(" ثم ")}`}><Volume2/><b>FR</b></button>
       </div>
     </article>)}
     </div>
     {level.id==="A2"&&activeModule.id==="revision"&&<div className="a2-production-grid">
      <article className="a2-writing-task"><span>Production écrite</span><h4>اكتب عن روتينك اليومي</h4><p>اكتب من 60 إلى 80 كلمة. استخدم خمسة أفعال في الحاضر، وفعلًا ضميريًا، وصيغة نفي، ورابطين على الأقل.</p><textarea dir="ltr" value={revisionWritingText} onChange={event=>setRevisionWritingText(event.target.value)} aria-label="مساحة كتابة فقرة عن الروتين اليومي" placeholder="En général, je me lève…" rows={7}/><div className={`a2-word-count ${revisionWordCount>=60&&revisionWordCount<=80?"ready":""}`}><strong>{revisionWordCount}</strong><span>كلمة من 60–80</span></div><ul className="a2-writing-checks">{revisionWritingChecks.map(item=><li key={item.label} className={item.passed?"passed":""}><CheckCircle2/>{item.label}</li>)}</ul><details className="a2-model-answer"><summary>عرض نموذج بعد إنهاء كتابتك</summary><p dir="ltr">{A2_REVISION_WRITING_MODEL}</p></details></article>
      <article className="a2-speaking-task"><span>Production orale</span><h4>تحدث لمدة 45 إلى 60 ثانية</h4><p dir="ltr">Présentez votre journée habituelle, vos horaires et une activité que vous ne faites jamais. Expliquez pourquoi.</p><button onClick={()=>void speakFrench("Présentez votre journée habituelle, vos horaires et une activité que vous ne faites jamais. Expliquez pourquoi.",{rate:.74})}><Volume2/> استمع إلى المهمة</button><ul><li>ابدأ بـ En général.</li><li>استخدم d’abord، puis، enfin.</li><li>اختم برأيك أو السبب.</li></ul><div className="a2-recorder"><div>{!isRecording?<button onClick={()=>void startRevisionRecording()}><Mic2/> ابدأ التسجيل</button>:<button className="recording" onClick={stopRevisionRecording}><Square/> أوقف التسجيل</button>}{recordingUrl&&<button className="delete" onClick={deleteRevisionRecording}><Trash2/> احذف التسجيل</button>}</div>{isRecording&&<p><i/> التسجيل جارٍ الآن… تحدث بالفرنسية.</p>}{recordingUrl&&<audio src={recordingUrl} controls aria-label="تشغيل تسجيلك الفرنسي"/>}{recordingError&&<small className="error">{recordingError}</small>}</div></article>
     </div>}
     <button className="university-stage-next" onClick={()=>setLessonStage("test")}><ListChecks/> الانتقال إلى الاختبار <ChevronLeft/></button>
    </section>}

    {lessonStage==="test"&&<section className="university-test-stage">
     <div className="university-stage-heading"><ListChecks/><div><span>Compréhension</span><h3>اختبار الدرس</h3><p>عشرة أسئلة مختلفة من هذا الدرس. تظهر النتيجة بعد إجابة السؤال الأخير.</p></div></div>
     {!quizFinished&&quizQuestions[quizQuestionIndex]&&(()=>{
      const question=quizQuestions[quizQuestionIndex];
      const selected=quizAnswers[quizQuestionIndex];
      return <div className="university-quiz-sequence">
       <div className="university-quiz-progress"><div><span>السؤال {quizQuestionIndex+1} من {quizQuestions.length}</span><strong>{Math.round((quizQuestionIndex+1)/quizQuestions.length*100)}%</strong></div><i><b style={{width:`${(quizQuestionIndex+1)/quizQuestions.length*100}%`}}/></i></div>
       <article className="university-current-question">
        <header>
         <div><span>{question.instruction??"استمع إلى العبارة الفرنسية، ثم اختر معناها الصحيح."}</span><strong dir="ltr">{question.prompt}</strong></div>
         <button onClick={()=>void speakFrench(question.speech??question.prompt,{rate:.74})} aria-label={`نطق السؤال ${quizQuestionIndex+1}`}><Volume2/><b>نطق السؤال</b></button>
        </header>
        <div className="university-answer-list">
         {question.choices.map((choice,choiceIndex)=><div key={choice} className={selected===choiceIndex?"selected":""}>
          <button className="university-answer-select" onClick={()=>setQuizAnswers(current=>({...current,[quizQuestionIndex]:choiceIndex}))} aria-pressed={selected===choiceIndex}><i>{String.fromCharCode(65+choiceIndex)}</i><span>{choice}</span></button>
         </div>)}
        </div>
       </article>
       <div className="university-quiz-navigation">
        <button onClick={()=>setQuizQuestionIndex(index=>Math.max(0,index-1))} disabled={quizQuestionIndex===0}><ChevronRight/> السؤال السابق</button>
        <button className="primary" onClick={advanceQuiz} disabled={typeof selected!=="number"}>{quizQuestionIndex===quizQuestions.length-1?"عرض النتيجة":"السؤال التالي"}<ChevronLeft/></button>
       </div>
      </div>;
     })()}
     {quizFinished&&<div className="university-quiz-result">
      <Trophy/>
      <span>نتيجة الاختبار</span>
      <strong dir="ltr">{quizScore} <small>/ {quizQuestions.length}</small></strong>
      <h3>{quizScore===10?"ممتاز، جميع إجاباتك صحيحة!":quizScore>=7?"أحسنت، اجتزت اختبار الدرس.":"راجع الدرس ثم أعد المحاولة."}</h3>
      <p>أجبت عن {quizScore} أسئلة صحيحة، و{quizQuestions.length-quizScore} أسئلة غير صحيحة.</p>
      <button onClick={resetQuiz}><RotateCcw/> أعد الاختبار</button>
     </div>}
    </section>}

    <footer className="university-lesson-footer university-lesson-navigation">
     {previousModule?<button onClick={()=>selectModule(previousModule.id)}><ChevronRight/><span><small>الدرس السابق</small><strong>{previousModule.ar}</strong></span></button>:<span/>}
     <Link href={`/university/${level.id.toLocaleLowerCase("fr")}`}><LibraryBig/><span><small>العودة إلى</small><strong>مسار {level.id}</strong></span></Link>
     {nextModule?<button onClick={()=>selectModule(nextModule.id)}><span><small>الدرس التالي</small><strong>{nextModule.ar}</strong></span><ChevronLeft/></button>:<span/>}
    </footer>
   </article>
  </section>}
 </main>;
}
