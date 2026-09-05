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
type QuizQuestion={prompt:string;choices:string[];correctIndex:number;instruction?:string;speech?:string;explanation?:string};
type DescriptionPanel="family"|"physical"|"emotions";
type AdjectivePanel="appearance"|"hairEyes"|"personality";
type RevisionWorkshopPanel="dictation"|"builder"|"dialogue";
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

function normalizeExerciseText(value:string){
 return value.normalize("NFC").toLocaleLowerCase("fr").replace(/[’]/g,"'").replace(/[.,!?;:]/g,"").replace(/\s+/g," ").trim();
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
 {prompt:"Nous ___ le bus à huit heures.",speech:"Choisissez la bonne forme du verbe prendre.",instruction:"اختر التصريف الصحيح للفعل prendre.",choices:["prenons","prenez","prennent"],correctIndex:0,explanation:"مع الضمير nous يُصرّف prendre هكذا: nous prenons."},
 {prompt:"Elle ___ à sept heures chaque matin.",speech:"Choisissez le bon pronom et la bonne forme du verbe se lever.",instruction:"أكمل بالفعل الضميري الصحيح.",choices:["me lève","se lève","te lèves"],correctIndex:1,explanation:"الضمير الانعكاسي الموافق لـ elle هو se: elle se lève."},
 {prompt:"Il ne travaille ___ le dimanche.",speech:"Complétez la phrase négative.",instruction:"اختر كلمة النفي المناسبة لمعنى «أبدًا».",choices:["personne","rien","jamais"],correctIndex:2,explanation:"ne…jamais تعني «لا… أبدًا»، بينما rien للأشياء وpersonne للأشخاص."},
 {prompt:"___ habitez-vous ici ? — Depuis 2024.",speech:"Choisissez le mot interrogatif adapté à la réponse depuis deux mille vingt-quatre.",instruction:"اختر أداة السؤال المناسبة للإجابة المعطاة.",choices:["Depuis quand","Pourquoi","Combien"],correctIndex:0,explanation:"الإجابة التي تبدأ بـ depuis تحدد بداية مدة مستمرة؛ لذلك نسأل Depuis quand ؟"},
 {prompt:"On ___ souvent au parc après le travail.",speech:"Choisissez la bonne forme du verbe aller avec on.",instruction:"اختر تصريف aller الصحيح مع on.",choices:["allez","va","vont"],correctIndex:1,explanation:"الضمير on يأخذ تصريف المفرد الغائب: on va."},
 {prompt:"J’habite à Lyon ___ trois ans.",speech:"Complétez la phrase pour exprimer une durée qui continue.",instruction:"اختر الأداة التي تعبّر عن مدة ما زالت مستمرة.",choices:["pendant","il y a","depuis"],correctIndex:2,explanation:"depuis تربط مدة بدأت في الماضي وما زالت مستمرة في الحاضر."},
 {prompt:"Le magasin est fermé, ___ nous revenons demain.",speech:"Choisissez le connecteur qui exprime la conséquence.",instruction:"اختر الرابط الذي يعبّر عن النتيجة.",choices:["donc","mais","parce que"],correctIndex:0,explanation:"donc يقدّم النتيجة: المتجر مغلق، لذلك سنعود غدًا."},
 {prompt:"Quel jour Nadia ne travaille-t-elle jamais ?",speech:"Quel jour Nadia ne travaille-t-elle jamais ?",instruction:"أجب وفق نص «أسبوع ناديا».",choices:["Le mardi","Le lundi","Le samedi"],correctIndex:1,explanation:"ورد في النص صراحةً أنها لا تعمل يوم الاثنين."},
 {prompt:"Je ne veux rien acheter aujourd’hui.",speech:"Je ne veux rien acheter aujourd’hui.",instruction:"اختر المعنى العربي الصحيح.",choices:["لا أريد شراء أي شيء اليوم.","لم أعد أذهب إلى السوق اليوم.","لا أعرف أحدًا في المتجر."],correctIndex:0,explanation:"ne…rien تنفي الشيء، والمعنى هنا: لا أريد شراء أي شيء."},
 {prompt:"D’abord, je termine mon travail, ___ je rentre chez moi.",speech:"Complétez la suite logique de la phrase.",instruction:"اختر الرابط الذي يكمل ترتيب الأحداث.",choices:["parce que","puis","pourtant"],correctIndex:1,explanation:"بعد d’abord نستخدم puis لترتيب الحدث التالي: أولًا… ثم…"}
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

const A2_REVISION_DICTATION=[
 {speech:"Je me réveille à sept heures pendant la semaine.",ar:"أستيقظ الساعة السابعة خلال أيام الأسبوع."},
 {speech:"Nous ne prenons jamais le métro le dimanche.",ar:"لا نستقل المترو يوم الأحد أبدًا."},
 {speech:"D’abord, elle finit son travail, puis elle rentre chez elle.",ar:"تنهي عملها أولًا، ثم تعود إلى منزلها."}
];

const A2_REVISION_BUILDERS=[
 {tokens:["semaine.","tôt","Je","pendant","lève","la","me"],answer:["Je","me","lève","tôt","pendant","la","semaine."],ar:"أستيقظ مبكرًا خلال أيام الأسبوع."},
 {tokens:["télévision","jamais","matin.","Elle","la","regarde","le","ne"],answer:["Elle","ne","regarde","jamais","la","télévision","le","matin."],ar:"لا تشاهد التلفاز صباحًا أبدًا."},
 {tokens:["puis","repas,","table.","D’abord,","mettons","nous","le","la","préparons","nous"],answer:["D’abord,","nous","préparons","le","repas,","puis","nous","mettons","la","table."],ar:"نحضّر الطعام أولًا، ثم نرتب المائدة."}
];

const A2_REVISION_DIALOGUES=[
 {context:"Votre collègue demande : « Depuis quand travaillez-vous ici ? »",prompt:"ما الإجابة الطبيعية؟",choices:["Depuis deux ans.","Pendant mardi.","Il y a maintenant."],correctIndex:0,feedback:"تستخدم depuis مع مدة بدأت في الماضي وما زالت مستمرة."},
 {context:"Votre ami propose : « On se retrouve devant la gare à huit heures ? »",prompt:"كيف توافق وتؤكد الموعد؟",choices:["Je ne vois personne.","Oui, ça me va. À huit heures devant la gare.","Depuis huit heures."],correctIndex:1,feedback:"الإجابة تؤكد القبول والوقت والمكان بوضوح."},
 {context:"On vous demande : « Tu regardes la télévision le matin ? »",prompt:"كيف تنفي العادة تمامًا؟",choices:["Je ne la regarde jamais le matin.","Je ne regarde personne.","Je regarde depuis le matin."],correctIndex:0,feedback:"ne…jamais هي الصيغة المناسبة لنفي عادة بصورة تامة."}
];

const A2_PASSE_COMPOSE_PRACTICE_ITEMS:Example[]=[
 {fr:"Ce matin, j’ai oublié mes clés sur la table.",ar:"نسيت مفاتيحي على الطاولة هذا الصباح."},
 {fr:"Nous avons choisi un restaurant près de l’hôtel.",ar:"اخترنا مطعمًا قريبًا من الفندق."},
 {fr:"Elle est descendue du train à Marseille.",ar:"نزلت من القطار في مرسيليا."},
 {fr:"Mes amis sont venus dîner chez moi hier.",ar:"جاء أصدقائي لتناول العشاء في منزلي أمس."},
 {fr:"Vous n’avez pas répondu à mon message.",ar:"لم تردّوا على رسالتي."},
 {fr:"Est-ce que tu as trouvé ton portefeuille ?",ar:"هل وجدت محفظتك؟"},
 {fr:"Ils se sont levés avant six heures.",ar:"استيقظوا قبل الساعة السادسة."},
 {fr:"J’ai beaucoup aimé cette exposition.",ar:"أعجبني هذا المعرض كثيرًا."},
 {fr:"D’abord, elle a téléphoné, puis elle a envoyé un courriel.",ar:"اتصلت أولًا، ثم أرسلت بريدًا إلكترونيًا."},
 {fr:"Le spectacle a commencé en retard, mais il a été excellent.",ar:"بدأ العرض متأخرًا، لكنه كان ممتازًا."}
];

const A2_PASSE_COMPOSE_QUIZ_ITEMS:QuizQuestion[]=[
 {prompt:"Hier, nous ___ un film français.",speech:"Complétez la phrase avec le verbe regarder au passé composé.",instruction:"صرّف regarder في الماضي المركب مع nous.",choices:["avons regardé","sommes regardés","avez regardé"],correctIndex:0,explanation:"معظم الأفعال ومنها regarder تستخدم avoir: nous avons regardé."},
 {prompt:"Lina ___ à neuf heures.",speech:"Choisissez la forme correcte du verbe arriver au passé composé.",instruction:"اختر صيغة arriver الصحيحة مع Lina.",choices:["a arrivé","est arrivée","est arrivé"],correctIndex:1,explanation:"arriver يستخدم être، واسم المفعول يطابق Lina في المؤنث: arrivée."},
 {prompt:"Ils ont ___ le train de midi.",speech:"Choisissez le participe passé du verbe prendre.",instruction:"اختر اسم المفعول الصحيح من prendre.",choices:["prendu","prend","pris"],correctIndex:2,explanation:"اسم المفعول غير المنتظم من prendre هو pris."},
 {prompt:"Elles se sont ___ très tôt.",speech:"Complétez avec le participe passé du verbe se lever.",instruction:"اختر المطابقة الصحيحة مع جمع المؤنث.",choices:["levées","levé","levés"],correctIndex:0,explanation:"مع elles والفعل الضميري نضيف -es: elles se sont levées."},
 {prompt:"Je ___ pas compris la question.",speech:"Complétez la négation au passé composé.",instruction:"أكمل النفي بصورة صحيحة.",choices:["n’ai","ne suis","n’as"],correctIndex:0,explanation:"النفي يحيط بالفعل المساعد: je n’ai pas compris."},
 {prompt:"___ vous avez réservé une table ?",speech:"Choisissez le début de la question neutre.",instruction:"اختر بداية السؤال المحايد.",choices:["Pourquoi est","Est-ce que","Quand êtes"],correctIndex:1,explanation:"Est-ce que تسبق الجملة الخبرية لتكوين سؤال محايد."},
 {prompt:"Nous avons ___ terminé le projet.",speech:"Choisissez l’adverbe qui indique que l’action est accomplie.",instruction:"اختر الظرف المناسب لمعنى «بالفعل».",choices:["demain","déjà","pendant"],correctIndex:1,explanation:"déjà تأتي غالبًا بين المساعد واسم المفعول: avons déjà terminé."},
 {prompt:"Elle a sorti son téléphone.",speech:"Pourquoi le verbe sortir utilise-t-il avoir dans cette phrase ?",instruction:"لماذا استُخدم avoir هنا؟",choices:["لأن sortir أخذ مفعولًا مباشرًا.","لأن الفاعل مؤنث.","لأن الجملة منفية."],correctIndex:0,explanation:"عندما يعني sortir «أخرج شيئًا» ويأخذ مفعولًا مباشرًا، يستخدم avoir."},
 {prompt:"Le bus est arrivé, ___ nous sommes montés.",speech:"Choisissez le connecteur qui exprime la suite des événements.",instruction:"اختر رابط ترتيب الأحداث.",choices:["parce que","puis","jamais"],correctIndex:1,explanation:"puis تعني «ثم» وتربط حدثين متتابعين."},
 {prompt:"Hier soir, j’ai lu ce livre.",speech:"Choisissez la traduction arabe correcte.",instruction:"اختر الترجمة العربية المناسبة للسياق.",choices:["سأقرأ هذا الكتاب مساءً.","أقرأ هذا الكتاب كل مساء.","قرأت هذا الكتاب مساء أمس."],correctIndex:2,explanation:"j’ai lu ماضٍ مركب وhier soir تحدد الزمن: قرأت مساء أمس."}
];

const A2_PASSE_COMPOSE_READING={
 title:"Un samedi mouvementé",arTitle:"يوم سبت حافل",
 text:"Samedi dernier, Amine s’est réveillé tard parce qu’il n’a pas entendu son réveil. Il a pris un café rapidement, puis il est sorti de chez lui. À la station, il n’a pas trouvé sa carte de transport. Il est donc retourné à la maison. Finalement, il a pris le bus suivant et il est arrivé au rendez-vous avec vingt minutes de retard. Ses amis ont attendu devant le cinéma et ils ont choisi une séance plus tardive.",
 translation:"استيقظ أمين متأخرًا يوم السبت الماضي لأنه لم يسمع المنبّه. شرب قهوة بسرعة، ثم خرج من منزله. وفي المحطة لم يجد بطاقة المواصلات، فعاد إلى المنزل. وفي النهاية استقل الحافلة التالية ووصل إلى الموعد متأخرًا عشرين دقيقة. انتظره أصدقاؤه أمام السينما واختاروا عرضًا لاحقًا.",
 questions:[
  {question:"Pourquoi Amine s’est-il réveillé tard ?",answer:"Parce qu’il n’a pas entendu son réveil.",ar:"لأنه لم يسمع المنبّه."},
  {question:"Qu’a-t-il oublié à la maison ?",answer:"Il a oublié sa carte de transport.",ar:"نسي بطاقة المواصلات."},
  {question:"Quelle solution ses amis ont-ils choisie ?",answer:"Ils ont choisi une séance plus tardive.",ar:"اختاروا عرضًا سينمائيًا لاحقًا."}
 ]
};

const A2_PASSE_COMPOSE_LISTENING={
 title:"Le premier jour de Clara",arTitle:"يوم كلارا الأول",
 text:"Lundi, Clara a commencé un nouveau travail dans une agence de voyages. Elle est arrivée à huit heures quarante-cinq et sa responsable lui a présenté l’équipe. Ensuite, Clara a visité les bureaux et elle a reçu son ordinateur. À midi, elle a déjeuné avec deux collègues dans un petit restaurant. Elle n’est pas rentrée tard : elle a quitté l’agence à dix-sept heures trente. Le soir, elle a raconté sa journée à sa sœur.",
 questions:[
  {prompt:"Où Clara a-t-elle commencé à travailler ?",choices:["Dans une agence de voyages","Dans une gare","Dans un hôtel"],correctIndex:0},
  {prompt:"Qui lui a présenté l’équipe ?",choices:["Sa sœur","Sa responsable","Une cliente"],correctIndex:1},
  {prompt:"Avec qui a-t-elle déjeuné ?",choices:["Avec sa responsable","Avec sa famille","Avec deux collègues"],correctIndex:2},
  {prompt:"À quelle heure a-t-elle quitté l’agence ?",choices:["À dix-sept heures trente","À huit heures quarante-cinq","À midi"],correctIndex:0}
 ]
};

const A2_PASSE_COMPOSE_WRITING_MODEL="Samedi dernier, je me suis levé à huit heures. D’abord, j’ai pris mon petit-déjeuner, puis je suis allé au marché avec mon frère. Nous avons acheté des fruits et nous avons déjeuné dans un petit restaurant. L’après-midi, j’ai retrouvé mes amis au parc. Nous avons beaucoup discuté. Enfin, je suis rentré chez moi vers dix-neuf heures parce que la journée a été longue, mais j’ai passé un très bon moment.";

const A2_PASSE_COMPOSE_DICTATION=[
 {speech:"Hier, nous avons visité un quartier historique.",ar:"زرنا حيًا تاريخيًا أمس."},
 {speech:"Elle n’est pas arrivée à l’heure prévue.",ar:"لم تصل في الوقت المحدد."},
 {speech:"D’abord, ils ont réservé, puis ils sont partis.",ar:"حجزوا أولًا، ثم غادروا."}
];

const A2_PASSE_COMPOSE_BUILDERS=[
 {tokens:["hier.","avons","Nous","musée","visité","le"],answer:["Nous","avons","visité","le","musée","hier."],ar:"زرنا المتحف أمس."},
 {tokens:["pas","train.","n’est","Elle","du","descendue"],answer:["Elle","n’est","pas","descendue","du","train."],ar:"لم تنزل من القطار."},
 {tokens:["puis","fenêtres,","maison.","D’abord,","sommes","avons","les","de","fermé","nous","sortis","nous","la"],answer:["D’abord,","nous","avons","fermé","les","fenêtres,","puis","nous","sommes","sortis","de","la","maison."],ar:"أغلقنا النوافذ أولًا، ثم خرجنا من المنزل."}
];

const A2_PASSE_COMPOSE_DIALOGUES=[
 {context:"Votre ami demande : « Qu’est-ce que tu as fait hier soir ? »",prompt:"اختر إجابة مناسبة ومكتملة.",choices:["J’ai regardé un film chez moi.","Je regarde un film demain.","Je suis un film."],correctIndex:0,feedback:"السؤال عن حدث مكتمل، لذلك نجيب بالماضي المركب."},
 {context:"Votre collègue demande : « Est-ce que Lina est arrivée ? »",prompt:"كيف تنفي وصولها حتى الآن؟",choices:["Non, elle n’arrive jamais hier.","Non, elle n’est pas encore arrivée.","Non, elle n’a pas arrivée."],correctIndex:1,feedback:"arriver يستخدم être، وpas encore تعني «ليس بعد»."},
 {context:"On vous demande : « Pourquoi êtes-vous rentrés tôt ? »",prompt:"اختر السبب الطبيعي.",choices:["Parce que nous avons été fatigués demain.","Donc nous rentrons hier.","Parce que nous avons fini plus tôt."],correctIndex:2,feedback:"السبب حدث مكتمل أيضًا، لذلك جاء finir في الماضي المركب."}
];

const A2_IMPARFAIT_PRACTICE_ITEMS:Example[]=[
 {fr:"Quand j’avais dix ans, j’habitais près de la mer.",ar:"عندما كان عمري عشر سنوات، كنت أعيش قرب البحر."},
 {fr:"Nous dînions toujours ensemble le dimanche.",ar:"كنا نتناول العشاء معًا دائمًا يوم الأحد."},
 {fr:"Elle lisait pendant que son frère préparait le café.",ar:"كانت تقرأ بينما كان أخوها يحضّر القهوة."},
 {fr:"Il ne faisait pas chaud, mais le ciel était clair.",ar:"لم يكن الجو حارًا، لكن السماء كانت صافية."},
 {fr:"Vous alliez souvent au travail à pied.",ar:"كنتم تذهبون إلى العمل سيرًا على الأقدام كثيرًا."},
 {fr:"Les rues étaient calmes et les magasins fermaient tôt.",ar:"كانت الشوارع هادئة وكانت المتاجر تغلق مبكرًا."},
 {fr:"Je dormais quand quelqu’un a frappé à la porte.",ar:"كنت نائمًا عندما طرق أحدهم الباب."},
 {fr:"À cette époque, nous ne connaissions personne ici.",ar:"في ذلك الوقت لم نكن نعرف أحدًا هنا."},
 {fr:"Chaque été, ils partaient chez leurs grands-parents.",ar:"كانوا يذهبون إلى منزل أجدادهم كل صيف."},
 {fr:"Le serveur apportait les boissons quand les lumières se sont éteintes.",ar:"كان النادل يحضر المشروبات عندما انطفأت الأنوار."}
];

const A2_IMPARFAIT_QUIZ_ITEMS:QuizQuestion[]=[
 {prompt:"Nous ___ souvent au parc après l’école.",speech:"Conjuguez le verbe jouer à l’imparfait avec nous.",instruction:"صرّف jouer في الماضي الناقص مع nous.",choices:["jouions","jouaient","avons joué"],correctIndex:0,explanation:"نأخذ jouons ونحذف -ons ثم نضيف -ions: nous jouions."},
 {prompt:"Quand elle était petite, elle ___ à la campagne.",speech:"Choisissez la forme correcte du verbe vivre à l’imparfait.",instruction:"اختر تصريف vivre الصحيح مع elle.",choices:["vivais","vivait","a vécu"],correctIndex:1,explanation:"جذر nous vivons هو viv-، ونهاية elle في الماضي الناقص هي -ait."},
 {prompt:"Vous ___ vos devoirs après le dîner.",speech:"Conjuguez le verbe faire à l’imparfait avec vous.",instruction:"اختر تصريف faire الصحيح.",choices:["faisaient","avez fait","faisiez"],correctIndex:2,explanation:"من nous faisons نأخذ fais- ونضيف -iez: vous faisiez."},
 {prompt:"À huit heures, il ___ encore nuit.",speech:"Choisissez la forme du verbe faire utilisée pour décrire la météo.",instruction:"أكمل وصف الحالة في الماضي.",choices:["faisait","a fait","faisions"],correctIndex:0,explanation:"الوصف المستمر في الخلفية يستخدم الماضي الناقص: il faisait nuit."},
 {prompt:"Nous ___ au restaurant quand Paul est arrivé.",speech:"Complétez l’action en cours interrompue par l’arrivée de Paul.",instruction:"اختر الزمن المناسب للفعل الجاري.",choices:["avons dîné","dînions","dînerons"],correctIndex:1,explanation:"تناول العشاء كان جاريًا عندما وقع حدث الوصول؛ لذلك نستخدم dînions."},
 {prompt:"Hier, le bus ___ soudainement.",speech:"Choisissez le temps du fait ponctuel et terminé.",instruction:"اختر الزمن المناسب لحدث مفاجئ ومكتمل.",choices:["s’arrêtait","arrêtait","s’est arrêté"],correctIndex:2,explanation:"الحدث المفاجئ المكتمل يستخدم الماضي المركب: s’est arrêté."},
 {prompt:"Je ___ pas le chemin.",speech:"Complétez le verbe connaître à l’imparfait dans une phrase négative.",instruction:"أكمل النفي بالتصريف الصحيح.",choices:["ne connaissais","n’ai connu","ne connaissait"],correctIndex:0,explanation:"مع je نستخدم connaissais، ويوضع النفي حول الفعل البسيط: je ne connaissais pas."},
 {prompt:"Nous ___ le français à l’université.",speech:"Choisissez l’orthographe correcte du verbe étudier à l’imparfait.",instruction:"اختر الكتابة الصحيحة مع nous.",choices:["étudions","étudiions","étudiais"],correctIndex:1,explanation:"الصيغة الصحيحة هي nous étudiions باجتماع حرفي i."},
 {prompt:"Pendant que je travaillais, elle ___.",speech:"Choisissez une action simultanée et continue.",instruction:"اختر فعلًا متزامنًا ومستمرًا.",choices:["a téléphoné une fois","est partie soudain","préparait le repas"],correctIndex:2,explanation:"حدثان جاريان في الوقت نفسه يأتيان في الماضي الناقص مع pendant que."},
 {prompt:"Avant, je prenais le train tous les jours.",speech:"Choisissez la traduction arabe correcte.",instruction:"اختر الترجمة المناسبة للسياق.",choices:["في السابق، كنت أستقل القطار كل يوم.","استقلت القطار مرة واحدة أمس.","سأستقل القطار غدًا."],correctIndex:0,explanation:"avant وtous les jours يدلان هنا على عادة متكررة في الماضي."}
];

const A2_IMPARFAIT_READING={
 title:"Le quartier de mon enfance",arTitle:"حي طفولتي",
 text:"Quand j’étais enfant, j’habitais dans un quartier calme près d’un grand parc. Les maisons étaient petites et les voisins se connaissaient tous. Chaque matin, je marchais jusqu’à l’école avec ma sœur. Après les cours, nous jouions souvent sous les arbres pendant que nos parents discutaient devant la boulangerie. Un jour, une nouvelle famille est arrivée dans notre rue. Leur fils avait mon âge, et nous sommes rapidement devenus amis.",
 translation:"عندما كنت طفلًا، كنت أعيش في حي هادئ قرب حديقة كبيرة. كانت المنازل صغيرة وكان جميع الجيران يعرف بعضهم بعضًا. كنت أمشي كل صباح إلى المدرسة مع أختي. وبعد الدروس، كنا نلعب كثيرًا تحت الأشجار بينما كان والدانا يتحدثان أمام المخبز. وفي أحد الأيام وصلت عائلة جديدة إلى شارعنا. كان ابنهم في عمري، وسرعان ما أصبحنا صديقين.",
 questions:[
  {question:"Comment était le quartier ?",answer:"Il était calme et se trouvait près d’un grand parc.",ar:"كان هادئًا ويقع قرب حديقة كبيرة."},
  {question:"Que faisaient les enfants après les cours ?",answer:"Ils jouaient souvent sous les arbres.",ar:"كانوا يلعبون كثيرًا تحت الأشجار."},
  {question:"Quel événement a changé la situation ?",answer:"Une nouvelle famille est arrivée dans la rue.",ar:"وصلت عائلة جديدة إلى الشارع."}
 ]
};

const A2_IMPARFAIT_LISTENING={
 title:"Les vacances chez ma grand-mère",arTitle:"العطلة عند جدتي",
 text:"Avant, je passais toutes mes vacances d’été chez ma grand-mère. Elle vivait dans un village où tout le monde se connaissait. Le matin, nous préparions le petit-déjeuner ensemble, puis j’aidais dans le jardin. L’après-midi, mes cousins venaient jouer avec moi. Il faisait souvent très chaud, alors nous restions sous les arbres. Un soir, un orage a commencé soudainement et nous sommes tous rentrés en courant.",
 questions:[
  {prompt:"Où vivait la grand-mère ?",choices:["Dans un village","Près d’une gare","Dans une grande ville"],correctIndex:0},
  {prompt:"Que faisaient-ils le matin ?",choices:["Ils allaient au marché.","Ils préparaient le petit-déjeuner.","Ils jouaient sous les arbres."],correctIndex:1},
  {prompt:"Pourquoi restaient-ils sous les arbres ?",choices:["Parce qu’il pleuvait.","Parce qu’ils jardinaient.","Parce qu’il faisait très chaud."],correctIndex:2},
  {prompt:"Quel événement soudain s’est produit ?",choices:["Un orage a commencé.","Les cousins sont partis.","La grand-mère a déménagé."],correctIndex:0}
 ]
};

const A2_IMPARFAIT_WRITING_MODEL="Quand j’étais enfant, j’habitais dans une petite ville avec ma famille. Notre maison était près de l’école et je marchais chaque matin avec mon frère. Après les cours, nous jouions souvent au parc, puis nous rentrions pour dîner. Je ne regardais jamais la télévision avant de finir mes devoirs. Le week-end, mes grands-parents venaient nous voir et nous préparions un grand repas ensemble. J’aimais beaucoup cette période.";

const A2_IMPARFAIT_DICTATION=[
 {speech:"Quand j’étais enfant, je jouais souvent dehors.",ar:"عندما كنت طفلًا، كنت ألعب كثيرًا في الخارج."},
 {speech:"Nous ne connaissions pas ce quartier.",ar:"لم نكن نعرف هذا الحي."},
 {speech:"Il pleuvait pendant que nous attendions le bus.",ar:"كانت السماء تمطر بينما كنا ننتظر الحافلة."}
];

const A2_IMPARFAIT_BUILDERS=[
 {tokens:["matin.","prenais","Je","chaque","bus","le"],answer:["Je","prenais","le","bus","chaque","matin."],ar:"كنت أستقل الحافلة كل صباح."},
 {tokens:["pas","chemin.","connaissions","Nous","le","ne"],answer:["Nous","ne","connaissions","pas","le","chemin."],ar:"لم نكن نعرف الطريق."},
 {tokens:["quand","dînions","sonné.","Nous","téléphone","le","a"],answer:["Nous","dînions","quand","le","téléphone","a","sonné."],ar:"كنا نتناول العشاء عندما رن الهاتف."}
];

const A2_IMPARFAIT_DIALOGUES=[
 {context:"Votre ami demande : « Que faisais-tu après l’école ? »",prompt:"اختر إجابة تعبّر عن عادة قديمة.",choices:["Je jouais souvent au parc.","J’ai joué une fois demain.","Je vais au parc hier."],correctIndex:0,feedback:"السؤال بالماضي الناقص عن عادة، والإجابة الطبيعية تستخدم الزمن نفسه."},
 {context:"On vous demande : « Comment était votre ancien quartier ? »",prompt:"اختر وصفًا مناسبًا.",choices:["Il a été ouvert soudain.","Il était calme et agréable.","Il sera près du parc."],correctIndex:1,feedback:"وصف مكان في الماضي يأتي طبيعيًا بالماضي الناقص."},
 {context:"Votre collègue demande : « Que faisiez-vous quand l’alarme a sonné ? »",prompt:"اختر الفعل الذي كان جاريًا.",choices:["Nous avons commencé demain.","Nous finirons le travail.","Nous préparions la réunion."],correctIndex:2,feedback:"العمل الجاري عند وقوع الحدث يأتي في الماضي الناقص."}
];

const A2_FUTURE_PRACTICE_ITEMS:Example[]=[
 {fr:"Ce soir, je vais préparer mes affaires pour le voyage.",ar:"سأجهز أغراضي للرحلة هذا المساء."},
 {fr:"Nous partirons tôt pour éviter les embouteillages.",ar:"سنغادر مبكرًا لتجنب الازدحام."},
 {fr:"Elle ne va pas accepter cette proposition.",ar:"لن تقبل هذا الاقتراح."},
 {fr:"Vous recevrez les résultats la semaine prochaine.",ar:"ستتلقون النتائج الأسبوع المقبل."},
 {fr:"Ils vont se retrouver devant la bibliothèque.",ar:"سيلتقون أمام المكتبة."},
 {fr:"Est-ce que tu viendras à la réunion demain ?",ar:"هل ستحضر الاجتماع غدًا؟"},
 {fr:"Je vous enverrai l’adresse dès que je la connaîtrai.",ar:"سأرسل إليكم العنوان فور معرفتي به."},
 {fr:"Si le temps est agréable, nous déjeunerons dehors.",ar:"إذا كان الطقس لطيفًا، فسنتناول الغداء في الخارج."},
 {fr:"D’abord, nous allons réserver les billets, puis nous choisirons l’hôtel.",ar:"سنحجز التذاكر أولًا، ثم سنختار الفندق."},
 {fr:"À mon avis, les transports seront plus rapides dans quelques années.",ar:"في رأيي، ستكون وسائل النقل أسرع خلال بضع سنوات."}
];

const A2_FUTURE_QUIZ_ITEMS:QuizQuestion[]=[
 {prompt:"Demain, nous ___ le musée.",speech:"Conjuguez le verbe visiter au futur simple avec nous.",instruction:"صرّف visiter في المستقبل البسيط مع nous.",choices:["visiterons","allons visité","visitons hier"],correctIndex:0,explanation:"نحتفظ بمصدر visiter ونضيف نهاية nous، وهي -ons: nous visiterons."},
 {prompt:"Je ___ appeler le médecin cet après-midi.",speech:"Complétez la phrase au futur proche.",instruction:"أكمل الجملة بالمستقبل القريب.",choices:["vais","irai","ai"],correctIndex:0,explanation:"المستقبل القريب يتكوّن من aller في الحاضر ثم المصدر: je vais appeler."},
 {prompt:"Tu ___ terminer avant dix heures.",speech:"Conjuguez le verbe pouvoir au futur simple avec tu.",instruction:"اختر تصريف pouvoir الصحيح.",choices:["pouveras","pourras","vas pu"],correctIndex:1,explanation:"جذر pouvoir في المستقبل هو pourr-، ومع tu نضيف -as: tu pourras."},
 {prompt:"Choisissez le futur simple du verbe être avec ils.",speech:"Choisissez le futur simple du verbe être avec ils.",instruction:"اختر تصريف être الصحيح في المستقبل البسيط.",choices:["seront","étaient","ont été"],correctIndex:0,explanation:"جذر être في المستقبل هو ser-، ومع ils نضيف -ont: ils seront."},
 {prompt:"___ vous viendrez demain ?",speech:"Complétez cette question neutre.",instruction:"أكمل السؤال المحايد.",choices:["Est-ce que","Pourquoi est","Quand êtes"],correctIndex:0,explanation:"Est-ce que تسبق الجملة الخبرية لتكوين سؤال محايد: Est-ce que vous viendrez ?"},
 {prompt:"Si j’ai le temps, je vous ___.",speech:"Complétez la conséquence au futur simple avec le verbe appeler.",instruction:"أكمل نتيجة الشرط بالمستقبل البسيط.",choices:["appellerai","appelais","ai appelé"],correctIndex:0,explanation:"بعد si نستخدم الحاضر هنا، وفي النتيجة نستخدم المستقبل: si j’ai…, j’appellerai."},
 {prompt:"Quand tu ___, nous dînerons.",speech:"Conjuguez le verbe arriver pour parler d’un fait futur.",instruction:"اختر التصريف المناسب لحدث مستقبلي.",choices:["arriveras","arrivais","es arrivé"],correctIndex:0,explanation:"عندما يشير quand إلى المستقبل، يأتي الفعل هنا في المستقبل: quand tu arriveras."},
 {prompt:"Le ciel est noir : il ___ pleuvoir.",speech:"Complétez cette prévision fondée sur un signe présent.",instruction:"أكمل التوقع القريب.",choices:["va","a","allait demain"],correctIndex:0,explanation:"السحب الداكنة علامة حاضرة على حدث وشيك، لذلك نقول: il va pleuvoir."},
 {prompt:"Je vais lui envoyer le document.",speech:"Je vais lui envoyer le document.",instruction:"اختر الترجمة العربية المناسبة للسياق.",choices:["سأرسل إليه المستند.","أرسل إليّ المستند.","لقد أرسل إليهم المستند."],correctIndex:0,explanation:"lui تعني «إليه/إليها»، وvais envoyer تعبّر عن نية قريبة."},
 {prompt:"Choisissez la phrase qui exprime une promesse.",speech:"Choisissez la phrase qui exprime une promesse.",instruction:"اختر الجملة التي تعبّر عن وعد.",choices:["Ne t’inquiète pas, je te rappellerai ce soir.","Je t’appelais tous les soirs.","Je ne t’ai pas appelé hier."],correctIndex:0,explanation:"je te rappellerai في المستقبل البسيط يأتي هنا بوصفه وعدًا."}
];

const A2_FUTURE_READING={
 title:"Un projet de voyage",arTitle:"خطة لرحلة",
 text:"Le mois prochain, Salma et son frère vont passer quatre jours à Strasbourg. Ils partiront vendredi matin et prendront le train de sept heures. À leur arrivée, ils déposeront leurs bagages à l’hôtel, puis ils visiteront le centre historique. S’il fait beau, ils feront une promenade en bateau. Samedi soir, ils vont dîner chez une amie qui habite près de la cathédrale. Salma pense que ce court séjour sera une bonne occasion de pratiquer son français.",
 translation:"ستقضي سلمى وأخوها أربعة أيام في ستراسبورغ الشهر المقبل. سيغادران صباح الجمعة ويستقلان قطار الساعة السابعة. وعند وصولهما سيضعان حقائبهما في الفندق، ثم سيزوران وسط المدينة التاريخي. وإذا كان الطقس جميلًا، فسيذهبان في جولة بالقارب. وفي مساء السبت سيتناولان العشاء لدى صديقة تسكن قرب الكاتدرائية. وترى سلمى أن هذه الرحلة القصيرة ستكون فرصة جيدة لممارسة الفرنسية.",
 questions:[
  {question:"Quand partiront-ils ?",answer:"Ils partiront vendredi matin.",ar:"سيغادران صباح الجمعة."},
  {question:"Que feront-ils s’il fait beau ?",answer:"Ils feront une promenade en bateau.",ar:"سيذهبان في جولة بالقارب."},
  {question:"Pourquoi Salma attend-elle ce séjour ?",answer:"Parce qu’elle pourra pratiquer son français.",ar:"لأنها ستتمكن من ممارسة الفرنسية."}
 ]
};

const A2_FUTURE_LISTENING={
 title:"Le programme de la semaine prochaine",arTitle:"برنامج الأسبوع المقبل",
 text:"La semaine prochaine, Hugo va commencer une formation dans un nouvel établissement. Lundi, il arrivera à neuf heures et rencontrera son formateur. Mardi, il va participer à un atelier informatique. Mercredi après-midi, il n’aura pas de cours, alors il ira à la bibliothèque. Jeudi, son groupe préparera un projet, et vendredi ils présenteront leur travail. Hugo pense que la semaine sera chargée, mais très utile.",
 questions:[
  {prompt:"Où Hugo va-t-il commencer une formation ?",choices:["Dans un nouvel établissement","Dans un hôtel","Dans une gare"],correctIndex:0},
  {prompt:"Qui rencontrera-t-il lundi ?",choices:["Un ami","Son formateur","Un médecin"],correctIndex:1},
  {prompt:"Où ira-t-il mercredi après-midi ?",choices:["À l’atelier","Au restaurant","À la bibliothèque"],correctIndex:2},
  {prompt:"Que fera son groupe vendredi ?",choices:["Il présentera son travail.","Il commencera la formation.","Il préparera un repas."],correctIndex:0}
 ]
};

const A2_FUTURE_WRITING_MODEL="Le mois prochain, je vais commencer une nouvelle formation. D’abord, je préparerai mon emploi du temps et j’achèterai le matériel nécessaire. Je ne travaillerai pas le vendredi, alors je pourrai réviser à la bibliothèque. Le week-end, je vais pratiquer le français avec mes amis. Si j’ai assez de temps, je regarderai aussi des films en français. Je pense que cette organisation sera utile et que je progresserai rapidement.";

const A2_FUTURE_DICTATION=[
 {speech:"Demain, nous visiterons un nouvel appartement.",ar:"سنزور شقة جديدة غدًا."},
 {speech:"Elle ne va pas prendre le train ce soir.",ar:"لن تستقل القطار هذا المساء."},
 {speech:"Si vous réservez maintenant, vous paierez moins cher.",ar:"إذا حجزتم الآن، فستدفعون سعرًا أقل."}
];

const A2_FUTURE_BUILDERS=[
 {tokens:["matin.","partirons","Nous","demain","tôt"],answer:["Nous","partirons","tôt","demain","matin."],ar:"سنغادر مبكرًا صباح الغد."},
 {tokens:["pas","rendez-vous.","vais","Je","oublier","le","ne"],answer:["Je","ne","vais","pas","oublier","le","rendez-vous."],ar:"لن أنسى الموعد."},
 {tokens:["déjeunerons","est","dehors.","temps","agréable,","le","nous","Si"],answer:["Si","le","temps","est","agréable,","nous","déjeunerons","dehors."],ar:"إذا كان الطقس لطيفًا، فسنتناول الغداء في الخارج."}
];

const A2_FUTURE_DIALOGUES=[
 {context:"Votre ami demande : « Qu’est-ce que tu vas faire ce soir ? »",prompt:"اختر إجابة طبيعية عن خطة قريبة.",choices:["Je vais préparer ma présentation.","J’ai préparé demain.","Je préparais ce soir prochain."],correctIndex:0,feedback:"السؤال عن خطة هذا المساء، لذلك يناسبه المستقبل القريب."},
 {context:"Votre collègue demande : « Vous pourrez venir lundi ? »",prompt:"اختر إجابة مناسبة عن قدرتك المستقبلية.",choices:["Oui, j’étais disponible lundi prochain.","Oui, je serai disponible après quatorze heures.","Oui, j’ai disponible demain."],correctIndex:1,feedback:"serai هو تصريف être في المستقبل، ويقدّم موعدًا واضحًا."},
 {context:"On vous demande : « S’il pleut demain, que ferez-vous ? »",prompt:"اختر نتيجة الشرط الصحيحة.",choices:["Nous restons hier.","Nous sommes restés demain.","Nous resterons à la maison."],correctIndex:2,feedback:"بعد si + présent تأتي النتيجة هنا في المستقبل البسيط."}
];

const A2_PRONOUNS_PRACTICE_ITEMS:Example[]=[
 {fr:"Cette collègue, je la connais depuis deux ans.",ar:"أعرف هذه الزميلة منذ عامين."},
 {fr:"Mes lunettes ? Je ne les trouve plus.",ar:"نظارتي؟ لم أعد أجدها."},
 {fr:"Nous lui téléphonons chaque dimanche.",ar:"نتصل به كل يوم أحد."},
 {fr:"Le professeur leur explique la consigne.",ar:"يشرح المعلم لهم التعليمات."},
 {fr:"Je vais vous envoyer le programme ce soir.",ar:"سأرسل إليكم البرنامج هذا المساء."},
 {fr:"Tu peux me prêter ton dictionnaire ?",ar:"هل يمكنك أن تعيرني قاموسك؟"},
 {fr:"Cette robe, elle l’a achetée hier.",ar:"اشترت هذا الفستان أمس."},
 {fr:"Ne lui donne pas cette adresse.",ar:"لا تعطه هذا العنوان."},
 {fr:"Ces billets, montrez-les-moi, s’il vous plaît.",ar:"أروني هذه التذاكر، من فضلكم."},
 {fr:"Je le leur confirmerai demain matin.",ar:"سأؤكد لهم ذلك صباح الغد."}
];

const A2_PRONOUNS_QUIZ_ITEMS:QuizQuestion[]=[
 {prompt:"Je regarde cette série. → Je ___ regarde.",speech:"Remplacez cette série par un pronom complément.",instruction:"استبدل cette série بضمير مفعول مباشر.",choices:["la","lui","leur"],correctIndex:0,explanation:"regarder يأخذ مفعولًا مباشرًا، وsérie مؤنث مفرد؛ لذلك نستخدم la."},
 {prompt:"Nous écrivons à nos voisins. → Nous ___ écrivons.",speech:"Remplacez à nos voisins par le pronom correct.",instruction:"استبدل à nos voisins بالضمير الصحيح.",choices:["les","leur","lui"],correctIndex:1,explanation:"écrire à quelqu’un يأخذ مفعولًا غير مباشر، والجمع يُستبدل بـ leur."},
 {prompt:"Il va acheter les billets. → Il va ___ acheter.",speech:"Placez le pronom les dans cette phrase.",instruction:"ضع ضمير المفعول في مكانه الصحيح.",choices:["les","acheter les","leur"],correctIndex:0,explanation:"مع مصدر تابع لفعل آخر، يأتي الضمير قبل المصدر: il va les acheter."},
 {prompt:"J’ai rencontré Lina hier. → Je ___ ai rencontrée hier.",speech:"Complétez avec le pronom qui remplace Lina.",instruction:"أكمل بالضمير الذي يحل محل Lina.",choices:["lui","l’","la lui"],correctIndex:1,explanation:"Lina مفعول مباشر؛ نستخدم l’ قبل حرف متحرك، ويتوافق participe passé معها: rencontrée."},
 {prompt:"Tu parles à ton médecin. → Tu ___ parles.",speech:"Choisissez le pronom complément indirect.",instruction:"اختر ضمير المفعول غير المباشر.",choices:["le","lui","la"],correctIndex:1,explanation:"parler à quelqu’un يُستبدل مفعوله غير المباشر المفرد بـ lui."},
 {prompt:"Je ne connais pas ces personnes. → Je ne ___ connais pas.",speech:"Complétez la phrase négative.",instruction:"أكمل الجملة المنفية.",choices:["leur","lui","les"],correctIndex:2,explanation:"ces personnes مفعول مباشر جمع، والضمير les يأتي بين ne والفعل."},
 {prompt:"Donne le dossier à Paul. → Donne-___-___ .",speech:"Transformez cette phrase à l’impératif affirmatif.",instruction:"اختر ترتيب الضميرين في الأمر المثبت.",choices:["lui-le","le-lui","le-leur"],correctIndex:1,explanation:"في الأمر المثبت يأتي المفعول المباشر ثم غير المباشر: donne-le-lui."},
 {prompt:"Ne raconte pas cette histoire aux enfants. → Ne ___ raconte pas.",speech:"Placez les deux pronoms dans la phrase négative.",instruction:"اختر ترتيب الضميرين في النفي.",choices:["la leur","leur la","les lui"],correctIndex:0,explanation:"قبل الفعل يكون الترتيب هنا le/la/les ثم lui/leur: ne la leur raconte pas."},
 {prompt:"Elle nous attend devant la gare.",speech:"Elle nous attend devant la gare.",instruction:"ما وظيفة nous في هذه الجملة؟",choices:["مفعول مباشر","مفعول غير مباشر","فاعل"],correctIndex:0,explanation:"attendre quelqu’un دون à، لذلك nous مفعول مباشر."},
 {prompt:"Je lui ai répondu ce matin.",speech:"Je lui ai répondu ce matin.",instruction:"اختر الترجمة العربية المناسبة.",choices:["أجبته هذا الصباح.","رأيته هذا الصباح.","أرسلني هذا الصباح."],correctIndex:0,explanation:"répondre à quelqu’un يُستبدل مفعوله بـ lui، والمعنى: أجبته/أجبتها."}
];

const A2_PRONOUNS_READING={
 title:"Un service entre voisins",arTitle:"مساعدة بين الجيران",
 text:"Nadia part en déplacement demain et demande un service à son voisin Marc. Elle lui donne les clés de son appartement et lui explique tout. Son chat mange deux fois par jour : Marc devra le nourrir le matin et le soir. Les plantes du balcon ont aussi besoin d’eau ; il les arrosera mercredi. Nadia a préparé une liste et l’a posée sur la table. Marc la rassure : il connaît bien les animaux et il lui enverra un message chaque soir.",
 translation:"ستغادر ناديا غدًا في مهمة عمل وتطلب خدمة من جارها مارك. تعطيه مفاتيح شقتها وتشرح له كل شيء. يأكل قطها مرتين يوميًا، ولذلك سيتعين على مارك إطعامه صباحًا ومساءً. كما تحتاج نباتات الشرفة إلى الماء، وسيسقيها يوم الأربعاء. أعدت ناديا قائمة ووضعتها على الطاولة. يطمئنها مارك بأنه يعرف الحيوانات جيدًا، وأنه سيرسل إليها رسالة كل مساء.",
 questions:[
  {question:"Que donne Nadia à Marc ?",answer:"Elle lui donne les clés de son appartement.",ar:"تعطيه مفاتيح شقتها."},
  {question:"Quand Marc nourrira-t-il le chat ?",answer:"Il le nourrira le matin et le soir.",ar:"سيطعمه صباحًا ومساءً."},
  {question:"Comment Marc va-t-il rassurer Nadia ?",answer:"Il lui enverra un message chaque soir.",ar:"سيرسل إليها رسالة كل مساء."}
 ]
};

const A2_PRONOUNS_LISTENING={
 title:"Une invitation à confirmer",arTitle:"دعوة تحتاج إلى تأكيد",
 text:"Écoute, Karim, j’ai reçu l’invitation de Léa, mais je ne l’ai pas encore confirmée. Peux-tu lui répondre pour nous deux ? Dis-lui que nous viendrons samedi et demande-lui l’adresse exacte. Je connais déjà ses amis, mais Samir ne les connaît pas. Léa veut aussi apporter des desserts. Nous pouvons les acheter demain et les lui donner avant la fête. N’oublie pas de me montrer sa réponse.",
 questions:[
  {prompt:"Qu’est-ce qui n’est pas encore confirmé ?",choices:["L’invitation","L’adresse de Karim","Le dessert de Samir"],correctIndex:0},
  {prompt:"À qui Karim doit-il répondre ?",choices:["À Samir","À Léa","Aux amis"],correctIndex:1},
  {prompt:"Qui ne connaît pas les amis de Léa ?",choices:["Karim","La narratrice","Samir"],correctIndex:2},
  {prompt:"Que doivent-ils acheter demain ?",choices:["Des desserts","Des invitations","Des billets"],correctIndex:0}
 ]
};

const A2_PRONOUNS_WRITING_MODEL="Ma collègue m’a demandé des informations sur notre cours. Je lui ai répondu ce matin et je lui ai envoyé le programme. Elle ne connaissait pas les horaires, alors je les lui ai expliqués. Elle voulait aussi les exercices, mais je ne les avais pas avec moi. Je vais les retrouver ce soir et les lui transmettre demain. Si elle a encore des questions, elle pourra me téléphoner après dix-huit heures.";

const A2_PRONOUNS_DICTATION=[
 {speech:"Je lui expliquerai le problème demain.",ar:"سأشرح له المشكلة غدًا."},
 {speech:"Ces documents, nous ne les avons pas reçus.",ar:"لم نتلقَّ هذه المستندات."},
 {speech:"Montrez-les-moi, s’il vous plaît.",ar:"أروني إياها، من فضلكم."}
];

const A2_PRONOUNS_BUILDERS=[
 {tokens:["demain.","lui","Je","répondrai"],answer:["Je","lui","répondrai","demain."],ar:"سأجيبه غدًا."},
 {tokens:["pas.","les","Nous","connaissons","ne"],answer:["Nous","ne","les","connaissons","pas."],ar:"نحن لا نعرفهم."},
 {tokens:["plaît.","Donnez-le-lui,","vous","s’il"],answer:["Donnez-le-lui,","s’il","vous","plaît."],ar:"أعطوه إياه، من فضلكم."}
];

const A2_PRONOUNS_DIALOGUES=[
 {context:"Votre collègue demande : « Tu as vu mes clés ? »",prompt:"اختر إجابة مناسبة بضمير مباشر.",choices:["Oui, je les ai posées sur la table.","Oui, je leur ai parlé.","Oui, je lui pose demain."],correctIndex:0,feedback:"les يحل محل clés، ويتوافق معه participe passé: posées."},
 {context:"Votre ami demande : « Tu peux répondre à Lina ? »",prompt:"اختر إجابة مناسبة بضمير غير مباشر.",choices:["Oui, je peux la réponse.","Oui, je vais lui répondre.","Oui, je les réponds."],correctIndex:1,feedback:"répondre à quelqu’un يتطلب lui للمفرد."},
 {context:"Un agent vous demande : « Je vous rends vos passeports ? »",prompt:"اختر جواب الأمر الصحيح.",choices:["Oui, rendez-nous-les.","Oui, les nous rendez.","Oui, rendez-les-nous, s’il vous plaît."],correctIndex:2,feedback:"في الأمر المثبت يأتي ضمير المفعول المباشر قبل nous: rendez-les-nous."}
];

const A2_QUANTITY_PRACTICE_ITEMS:Example[]=[
 {fr:"Je voudrais du pain et de la confiture.",ar:"أود خبزًا ومربّى."},
 {fr:"Nous n’achetons pas de viande cette semaine.",ar:"لن نشتري لحمًا هذا الأسبوع."},
 {fr:"Tu veux des pommes ? Oui, j’en prends trois.",ar:"هل تريد تفاحًا؟ نعم، سآخذ ثلاثًا."},
 {fr:"Elle parle souvent de son voyage : elle en garde un excellent souvenir.",ar:"تتحدث كثيرًا عن رحلتها وتحتفظ منها بذكرى رائعة."},
 {fr:"Nous allons au marché et nous y retrouvons nos voisins.",ar:"نذهب إلى السوق ونلتقي بجيراننا هناك."},
 {fr:"Vous pensez à votre rendez-vous ? Oui, j’y pense.",ar:"هل تتذكرون موعدكم؟ نعم، أتذكره."},
 {fr:"Combien de billets avez-vous ? J’en ai deux.",ar:"كم تذكرة لديكم؟ لدي تذكرتان."},
 {fr:"Je vais y aller après le travail.",ar:"سأذهب إلى هناك بعد العمل."},
 {fr:"N’en ajoutez pas trop.",ar:"لا تضيفوا منه الكثير."},
 {fr:"Il y a assez de chaises, mais il n’y en a pas assez pour tout le monde.",ar:"توجد كراسٍ كافية، لكنها لا تكفي الجميع."}
];

const A2_QUANTITY_QUIZ_ITEMS:QuizQuestion[]=[
 {prompt:"Je bois ___ eau chaque matin.",speech:"Complétez avec l’article partitif correct.",instruction:"اختر أداة التجزئة الصحيحة.",choices:["de l’","du","des"],correctIndex:0,explanation:"eau اسم مفرد يبدأ بحرف متحرك، لذلك نستخدم de l’."},
 {prompt:"Nous achetons beaucoup ___ légumes.",speech:"Complétez l’expression de quantité.",instruction:"أكمل تركيب الكمية.",choices:["des","de","du"],correctIndex:1,explanation:"بعد تعبير الكمية beaucoup نستخدم de: beaucoup de légumes."},
 {prompt:"Elle ne mange pas ___ viande.",speech:"Complétez la phrase négative.",instruction:"اختر الأداة المناسبة بعد النفي.",choices:["de la","du","de"],correctIndex:2,explanation:"بعد النفي تصبح أداة التجزئة غالبًا de: elle ne mange pas de viande."},
 {prompt:"Tu veux du café ? Oui, j’___ veux.",speech:"Remplacez du café par le pronom correct.",instruction:"استبدل du café بالضمير الصحيح.",choices:["en","y","le"],correctIndex:0,explanation:"en يحل محل اسم سبقه de أو أداة تجزئة: j’en veux."},
 {prompt:"Combien de croissants prenez-vous ? J’___ prends deux.",speech:"Complétez la réponse avec le pronom correct.",instruction:"أكمل إجابة الكمية.",choices:["y","en","les"],correctIndex:1,explanation:"نستبدل الاسم بـ en ونُبقي العدد ظاهرًا: j’en prends deux."},
 {prompt:"Nous allons à la bibliothèque. → Nous ___ allons.",speech:"Remplacez à la bibliothèque par le pronom correct.",instruction:"استبدل المكان بالضمير المناسب.",choices:["en","la","y"],correctIndex:2,explanation:"y يحل محل مكان يسبقه à: nous y allons."},
 {prompt:"Il pense à son examen. → Il ___ pense.",speech:"Remplacez à son examen par le pronom correct.",instruction:"استبدل التركيب المسبوق بـ à.",choices:["y","en","lui"],correctIndex:0,explanation:"عندما يعود à على شيء، يُستبدل التركيب عادة بـ y: il y pense."},
 {prompt:"Je vais parler de ce problème. → Je vais ___ parler.",speech:"Placez le pronom en dans cette phrase.",instruction:"ضع en في موضعه الصحيح.",choices:["parler en","en","y"],correctIndex:1,explanation:"مع فعل مصرف يتبعه مصدر، يسبق الضمير المصدر الذي يتعلق به: je vais en parler."},
 {prompt:"Va au bureau ! → ___ !",speech:"Transformez la phrase avec le pronom y à l’impératif affirmatif.",instruction:"استبدل المكان بـ y في الأمر المثبت.",choices:["Y va","N’y va pas","Vas-y"],correctIndex:2,explanation:"في الأمر المثبت يأتي y بعد الفعل بشرطة، ونكتب vas-y."},
 {prompt:"Il n’y en a plus.",speech:"Il n’y en a plus.",instruction:"اختر الترجمة العربية المناسبة.",choices:["لم يعد هناك شيء منه.","سأذهب إلى هناك لاحقًا.","يوجد منه اثنان."],correctIndex:0,explanation:"il y a يعني «يوجد»، وen يستبدل الشيء، وne…plus تعني «لم يعد»."}
];

const A2_QUANTITY_READING={
 title:"Les courses pour le dîner",arTitle:"مشتريات العشاء",
 text:"Ce soir, Inès reçoit quatre amis. Elle va au marché parce qu’elle y trouve des produits frais. Pour la soupe, elle achète un kilo de tomates, deux oignons et un peu de crème. Elle prend aussi du fromage, mais elle n’achète pas de pain : elle en a encore à la maison. Le marchand propose des fraises. Inès en choisit deux barquettes pour le dessert. Avant de partir, elle pense aux boissons et en prend trois bouteilles.",
 translation:"ستستقبل إيناس أربعة أصدقاء هذا المساء. تذهب إلى السوق لأنها تجد هناك منتجات طازجة. ولإعداد الحساء تشتري كيلوغرامًا من الطماطم وبصلتين وقليلًا من الكريمة. وتأخذ بعض الجبن، لكنها لا تشتري خبزًا لأن لديها منه في المنزل. يعرض البائع الفراولة، فتختار إيناس عبوتين منها للتحلية. وقبل أن تغادر تتذكر المشروبات وتأخذ منها ثلاث زجاجات.",
 questions:[
  {question:"Pourquoi Inès va-t-elle au marché ?",answer:"Parce qu’elle y trouve des produits frais.",ar:"لأنها تجد هناك منتجات طازجة."},
  {question:"Pourquoi n’achète-t-elle pas de pain ?",answer:"Parce qu’elle en a encore à la maison.",ar:"لأن لديها منه في المنزل."},
  {question:"Combien de barquettes de fraises choisit-elle ?",answer:"Elle en choisit deux.",ar:"تختار عبوتين منها."}
 ]
};

const A2_QUANTITY_LISTENING={
 title:"Une recette très simple",arTitle:"وصفة سهلة جدًا",
 text:"Pour préparer cette salade, mettez d’abord trois tomates et un concombre dans un grand bol. Ajoutez un peu de sel, mais n’en mettez pas trop. Il faut aussi de l’huile d’olive : versez-en deux cuillères. Vous pouvez ajouter des olives si vous en avez. Ensuite, placez la salade au réfrigérateur et laissez-la-y pendant vingt minutes. J’en prépare souvent en été parce que cette recette est rapide et légère.",
 questions:[
  {prompt:"Combien de tomates faut-il ?",choices:["Trois","Deux","Quatre"],correctIndex:0},
  {prompt:"Que ne faut-il pas mettre en trop grande quantité ?",choices:["Les tomates","Le sel","Le concombre"],correctIndex:1},
  {prompt:"Combien de cuillères d’huile faut-il verser ?",choices:["Une","Trois","Deux"],correctIndex:2},
  {prompt:"Pourquoi cette recette est-elle souvent préparée en été ?",choices:["Parce qu’elle est rapide et légère.","Parce qu’elle est chaude.","Parce qu’elle demande beaucoup d’ingrédients."],correctIndex:0}
 ]
};

const A2_QUANTITY_WRITING_MODEL="Demain, je vais au marché pour préparer un déjeuner. J’y achèterai des légumes, du fromage et un peu de pain. Il me faut aussi deux bouteilles d’eau, mais je n’achèterai pas de jus parce que j’en ai déjà à la maison. Si je trouve des fraises, j’en prendrai deux barquettes. Ensuite, j’irai chez le boulanger et j’y choisirai quatre desserts. Je pense que ces quantités seront suffisantes pour six personnes.";

const A2_QUANTITY_DICTATION=[
 {speech:"Nous avons besoin d’un kilo de tomates.",ar:"نحتاج إلى كيلوغرام من الطماطم."},
 {speech:"Je n’en veux pas beaucoup.",ar:"لا أريد منه الكثير."},
 {speech:"Vous allez au marché ? Oui, nous y allons.",ar:"هل ستذهبون إلى السوق؟ نعم، سنذهب إليه."}
];

const A2_QUANTITY_BUILDERS=[
 {tokens:["légumes.","beaucoup","achetons","de","Nous"],answer:["Nous","achetons","beaucoup","de","légumes."],ar:"نشتري الكثير من الخضروات."},
 {tokens:["trois.","en","J’","prends"],answer:["J’","en","prends","trois."],ar:"سآخذ ثلاثًا منها."},
 {tokens:["demain.","y","Nous","retournerons"],answer:["Nous","y","retournerons","demain."],ar:"سنعود إلى هناك غدًا."}
];

const A2_QUANTITY_DIALOGUES=[
 {context:"Le vendeur demande : « Combien de pommes voulez-vous ? »",prompt:"اختر جوابًا يحافظ على العدد.",choices:["J’en voudrais six, s’il vous plaît.","Je les voudrais de.","J’y voudrais six."],correctIndex:0,feedback:"en يستبدل pommes بينما يبقى العدد ظاهرًا."},
 {context:"Votre ami demande : « Tu vas souvent à cette bibliothèque ? »",prompt:"اختر إجابة بضمير المكان.",choices:["Oui, j’en vais chaque semaine.","Oui, j’y vais chaque semaine.","Oui, je lui vais."],correctIndex:1,feedback:"y يحل محل à cette bibliothèque."},
 {context:"On vous demande : « Il reste du café ? »",prompt:"اختر الإجابة الطبيعية.",choices:["Oui, il y reste du.","Oui, je le reste.","Oui, il en reste un peu."],correctIndex:2,feedback:"en يستبدل du café، وتبقى الكمية un peu ظاهرة."}
];

const A2_COMPARISON_PRACTICE_ITEMS:Example[]=[
 {fr:"Ce quartier est plus calme que le centre-ville.",ar:"هذا الحي أهدأ من وسط المدينة."},
 {fr:"La chambre bleue est moins lumineuse que la blanche.",ar:"الغرفة الزرقاء أقل إضاءة من البيضاء."},
 {fr:"Le train est aussi confortable que l’autocar.",ar:"القطار مريح بقدر الحافلة."},
 {fr:"Nous avons plus de temps qu’hier.",ar:"لدينا وقت أكثر من الأمس."},
 {fr:"Elle travaille aussi efficacement que sa collègue.",ar:"تعمل بالكفاءة نفسها التي تعمل بها زميلتها."},
 {fr:"Cette solution fonctionne mieux que l’ancienne.",ar:"هذا الحل يعمل بصورة أفضل من الحل السابق."},
 {fr:"C’est le meilleur restaurant du quartier.",ar:"هذا أفضل مطعم في الحي."},
 {fr:"Parmi ces itinéraires, celui-ci est le moins long.",ar:"هذا المسار هو الأقصر بين هذه المسارات."},
 {fr:"Le service est assez rapide, mais la salle est un peu bruyante.",ar:"الخدمة سريعة إلى حدٍّ كافٍ، لكن القاعة صاخبة قليلًا."},
 {fr:"Le guide explique clairement et répond très patiemment.",ar:"يشرح المرشد بوضوح ويجيب بصبر كبير."}
];

const A2_COMPARISON_QUIZ_ITEMS:QuizQuestion[]=[
 {prompt:"Ce sac est ___ lourd que l’autre.",speech:"Complétez le comparatif de supériorité.",instruction:"أكمل مقارنة الزيادة.",choices:["plus","aussi de","le plus de"],correctIndex:0,explanation:"مع الصفة نستخدم plus + adjectif + que: plus lourd que."},
 {prompt:"Cette chambre est ___ chère que la première.",speech:"Complétez le comparatif d’infériorité.",instruction:"أكمل مقارنة النقصان.",choices:["le moins","moins","moins de"],correctIndex:1,explanation:"مع الصفة نستخدم moins + adjectif + que: moins chère que."},
 {prompt:"Il court ___ vite que son frère.",speech:"Complétez le comparatif d’égalité avec un adverbe.",instruction:"أكمل مقارنة التساوي.",choices:["autant de","le plus","aussi"],correctIndex:2,explanation:"مع الظرف vite نستخدم aussi…que للتساوي: aussi vite que."},
 {prompt:"Nous avons ___ clients qu’avant.",speech:"Complétez la comparaison d’une quantité.",instruction:"اختر صيغة مقارنة الاسم.",choices:["plus de","plus","aussi"],correctIndex:0,explanation:"عند مقارنة كمية اسم نستخدم plus de + nom + que."},
 {prompt:"Elle voyage ___ que moi.",speech:"Complétez la comparaison du verbe au degré d’égalité.",instruction:"اختر صيغة مقارنة الفعل.",choices:["aussi","autant","autant de"],correctIndex:1,explanation:"بعد الفعل نستخدم autant que للتساوي: elle voyage autant que moi."},
 {prompt:"Ce café est bon, mais celui-là est ___.",speech:"Choisissez le comparatif correct de bon.",instruction:"اختر مقارنة bon الصحيحة.",choices:["plus bien","mieux","meilleur"],correctIndex:2,explanation:"meilleur هو صيغة المقارنة للصفة bon."},
 {prompt:"Lina parle français ___ que moi.",speech:"Choisissez le comparatif correct de bien.",instruction:"اختر مقارنة bien الصحيحة.",choices:["mieux","meilleure","plus bonne"],correctIndex:0,explanation:"mieux هو صيغة المقارنة للظرف bien ويصف طريقة الكلام."},
 {prompt:"C’est ___ solution de toutes.",speech:"Complétez le superlatif de bon.",instruction:"أكمل صيغة التفضيل.",choices:["la mieux","la meilleure","la plus bonne"],correctIndex:1,explanation:"solution مؤنث، وصيغة تفضيل bon هي la meilleure."},
 {prompt:"Le serveur répond ___.",speech:"Formez l’adverbe à partir de poli.",instruction:"اختر الظرف المشتق من poli.",choices:["politesse","plus poli","poliment"],correctIndex:2,explanation:"الظرف الصحيح المشتق من poli هو poliment، ومعناه «بأدب»."},
 {prompt:"Le trajet est assez court.",speech:"Le trajet est assez court.",instruction:"اختر المعنى العربي المناسب لـ assez هنا.",choices:["المسار قصير إلى حدٍّ كافٍ.","المسار قصير جدًا.","المسار أقصر من الجميع."],correctIndex:0,explanation:"assez يعبّر هنا عن درجة كافية أو معتدلة، لا عن التفضيل."}
];

const A2_COMPARISON_READING={
 title:"Deux appartements à comparer",arTitle:"المقارنة بين شقتين",
 text:"Maya visite deux appartements. Le premier est plus grand et plus lumineux que le second, mais il est aussi plus cher. Il se trouve près du centre et les transports y sont meilleurs. Le second appartement a moins de pièces, mais il est aussi calme que le premier. Sa cuisine est plus moderne et le loyer est nettement moins élevé. Maya travaille souvent chez elle : pour elle, la lumière est le critère le plus important. Pourtant, elle pense que le second offre le meilleur rapport qualité-prix.",
 translation:"تزور مايا شقتين. الأولى أكبر وأكثر إضاءة من الثانية، لكنها أغلى أيضًا. تقع قرب وسط المدينة والمواصلات فيها أفضل. أما الشقة الثانية ففيها غرف أقل، لكنها هادئة بقدر الأولى. مطبخها أحدث وإيجارها أقل بوضوح. تعمل مايا كثيرًا من المنزل، ولذلك تُعد الإضاءة أهم معيار بالنسبة إليها. ومع ذلك، ترى أن الشقة الثانية تقدم أفضل قيمة مقابل السعر.",
 questions:[
  {question:"Quel appartement est le plus lumineux ?",answer:"Le premier appartement est le plus lumineux.",ar:"الشقة الأولى هي الأكثر إضاءة."},
  {question:"Quel avantage possède la cuisine du second ?",answer:"Elle est plus moderne.",ar:"مطبخ الشقة الثانية أحدث."},
  {question:"Pourquoi Maya hésite-t-elle ?",answer:"La lumière favorise le premier, mais le second offre un meilleur rapport qualité-prix.",ar:"الإضاءة ترجح الأولى، لكن الثانية تقدم قيمة أفضل مقابل السعر."}
 ]
};

const A2_COMPARISON_LISTENING={
 title:"Train ou autocar ?",arTitle:"القطار أم الحافلة؟",
 text:"Pour aller à Lyon, Samir compare le train et l’autocar. Le train est beaucoup plus rapide : le voyage dure deux heures au lieu de cinq. Il est également plus confortable, mais son billet coûte nettement plus cher. L’autocar part plus tôt et arrive moins près du centre. En revanche, il transporte autant de bagages sans supplément. Samir préfère voyager rapidement, mais son budget est assez limité. Finalement, il choisit l’autocar, car le prix est le critère le plus important pour lui.",
 questions:[
  {prompt:"Quel moyen de transport est le plus rapide ?",choices:["Le train","L’autocar","Ils sont aussi rapides"],correctIndex:0},
  {prompt:"Quel billet coûte nettement plus cher ?",choices:["Le billet d’autocar","Le billet de train","Les deux billets"],correctIndex:1},
  {prompt:"Quel avantage possède l’autocar ?",choices:["Il arrive plus près du centre.","Il dure deux heures.","Il accepte autant de bagages sans supplément."],correctIndex:2},
  {prompt:"Pourquoi Samir choisit-il l’autocar ?",choices:["Parce que le prix est prioritaire.","Parce qu’il est plus rapide.","Parce qu’il part plus tard."],correctIndex:0}
 ]
};

const A2_COMPARISON_WRITING_MODEL="J’ai comparé deux hôtels pour mon prochain voyage. Le premier est plus proche du centre et ses chambres sont plus grandes. Il est aussi mieux noté, mais il coûte beaucoup plus cher. Le second est moins moderne, pourtant il est aussi propre que le premier. Son petit-déjeuner est meilleur et le personnel répond très rapidement. Pour moi, le prix est le critère le plus important ; je choisirai donc le second hôtel, qui offre le meilleur équilibre.";

const A2_COMPARISON_DICTATION=[
 {speech:"Cette chambre est plus lumineuse que l’autre.",ar:"هذه الغرفة أكثر إضاءة من الأخرى."},
 {speech:"Le train coûte moins cher, mais il est aussi confortable.",ar:"القطار أقل سعرًا، لكنه مريح بالقدر نفسه."},
 {speech:"C’est la meilleure solution pour notre groupe.",ar:"هذا أفضل حل لمجموعتنا."}
];

const A2_COMPARISON_BUILDERS=[
 {tokens:["bus.","rapide","Le","plus","train","le","est","que"],answer:["Le","train","est","plus","rapide","que","le","bus."],ar:"القطار أسرع من الحافلة."},
 {tokens:["qu’avant.","avons","moins","temps","Nous","de"],answer:["Nous","avons","moins","de","temps","qu’avant."],ar:"لدينا وقت أقل من السابق."},
 {tokens:["quartier.","le","C’est","restaurant","meilleur","du"],answer:["C’est","le","meilleur","restaurant","du","quartier."],ar:"هذا أفضل مطعم في الحي."}
];

const A2_COMPARISON_DIALOGUES=[
 {context:"Votre ami demande : « Quel trajet est le plus court ? »",prompt:"اختر إجابة مقارنة واضحة.",choices:["Le trajet par le parc est plus court que l’autre.","Le trajet est aussi de court.","Le parc court mieux."],correctIndex:0,feedback:"plus court que يبني مقارنة صحيحة بين المسارين."},
 {context:"Une cliente demande : « Les deux chambres sont aussi calmes ? »",prompt:"اختر إجابة تنفي التساوي بأدب.",choices:["Oui, la première a aussi calme.","Non, la seconde est un peu moins calme.","Non, elle est moins de calme."],correctIndex:1,feedback:"un peu moins calme يحدد فرقًا صغيرًا بصورة طبيعية."},
 {context:"On vous demande : « Quel restaurant préférez-vous ? »",prompt:"اختر تفضيلًا مع سبب.",choices:["Je préfère le mieux restaurant.","Je préfère autant le restaurant.","Je préfère celui-ci : le service y est meilleur."],correctIndex:2,feedback:"meilleur يصف الاسم service، والجملة تذكر الاختيار وسببه."}
];

const A2_POLITENESS_PRACTICE_ITEMS:Example[]=[
 {fr:"Je voudrais réserver une table pour quatre personnes.",ar:"أود حجز طاولة لأربعة أشخاص."},
 {fr:"Pourriez-vous répéter un peu plus lentement ?",ar:"هل يمكنكم إعادة الكلام ببطء أكثر قليلًا؟"},
 {fr:"Est-ce que je peux essayer cette veste ?",ar:"هل يمكنني تجربة هذه السترة؟"},
 {fr:"Tu devrais te reposer avant le voyage.",ar:"ينبغي أن ترتاح قبل الرحلة."},
 {fr:"À votre place, je comparerais les deux offres.",ar:"لو كنت مكانكم لقارنت بين العرضين."},
 {fr:"Il faut présenter une pièce d’identité.",ar:"يجب إبراز إثبات هوية."},
 {fr:"Vous ne devez pas utiliser votre téléphone ici.",ar:"يجب ألا تستخدموا هاتفكم هنا."},
 {fr:"On pourrait prendre le train de huit heures.",ar:"يمكننا أن نستقل قطار الساعة الثامنة."},
 {fr:"Pourquoi ne pas demander un autre rendez-vous ?",ar:"لماذا لا نطلب موعدًا آخر؟"},
 {fr:"Je suis désolé, je ne pourrai pas vous aider aujourd’hui.",ar:"أنا آسف، لن أتمكن من مساعدتكم اليوم."}
];

const A2_POLITENESS_QUIZ_ITEMS:QuizQuestion[]=[
 {prompt:"Je ___ un renseignement, s’il vous plaît.",speech:"Complétez cette demande polie avec le verbe vouloir.",instruction:"أكمل الطلب المهذب.",choices:["voudrais","veux absolument","voulais hier"],correctIndex:0,explanation:"je voudrais صيغة مهذبة شائعة لطلب شيء أو معلومة."},
 {prompt:"___-vous m’indiquer le chemin ?",speech:"Complétez la demande au conditionnel de politesse.",instruction:"اختر الصيغة الأكثر تهذيبًا.",choices:["Pouvez hier","Pourriez","Deviez"],correctIndex:1,explanation:"pourriez-vous + infinitif طلب مهذب ورسمي."},
 {prompt:"Tu es très fatigué. Tu ___ te coucher plus tôt.",speech:"Complétez ce conseil avec devoir au conditionnel.",instruction:"أكمل النصيحة المناسبة.",choices:["dois hier","devras toujours","devrais"],correctIndex:2,explanation:"tu devrais يقدّم نصيحة لطيفة، لا أمرًا مباشرًا."},
 {prompt:"Pour entrer, ___ montrer son billet.",speech:"Exprimez une nécessité générale.",instruction:"اختر صيغة الضرورة العامة.",choices:["il faut","on voudrait","pourriez-vous"],correctIndex:0,explanation:"il faut + infinitif يعبّر عن قاعدة أو ضرورة عامة."},
 {prompt:"À votre place, je ___ cette option.",speech:"Complétez le conseil avec choisir au conditionnel.",instruction:"أكمل النصيحة غير المباشرة.",choices:["choisis hier","choisirais","choisirai certainement"],correctIndex:1,explanation:"À votre place, je choisirais… صيغة طبيعية لتقديم الرأي بوصفه نصيحة."},
 {prompt:"___ prendre un taxi ?",speech:"Choisissez une suggestion faite au groupe.",instruction:"اختر اقتراحًا مناسبًا للمجموعة.",choices:["Il faut interdit de","Vous devez toujours","Et si on prenait"],correctIndex:2,explanation:"Et si on + imparfait صيغة شائعة لاقتراح نشاط جماعي."},
 {prompt:"Dans cette salle, vous ___ parler fort.",speech:"Complétez cette interdiction.",instruction:"أكمل صيغة المنع.",choices:["ne devez pas","devriez de","pourriez pas de"],correctIndex:0,explanation:"ne devez pas + infinitif يعبّر عن منع أو تعليمات ملزمة."},
 {prompt:"Choisissez la réponse qui accepte poliment.",speech:"Choisissez la réponse qui accepte poliment.",instruction:"اختر رد القبول المهذب.",choices:["Non, jamais.","Bien sûr, avec plaisir.","Faites-le vous-même."],correctIndex:1,explanation:"Bien sûr, avec plaisir تقبل الطلب بوضوح وأدب."},
 {prompt:"Choisissez le refus poli.",speech:"Choisissez le refus poli.",instruction:"اختر الرفض المهذب.",choices:["Je refuse.","Ce n’est pas mon problème.","Je suis désolé, ce ne sera pas possible aujourd’hui."],correctIndex:2,explanation:"يبدأ الرد بالاعتذار ويشرح عدم الإمكان دون لهجة حادة."},
 {prompt:"Vous feriez mieux de réserver à l’avance.",speech:"Vous feriez mieux de réserver à l’avance.",instruction:"اختر الترجمة العربية المناسبة.",choices:["من الأفضل أن تحجزوا مسبقًا.","لقد حجزتم مسبقًا.","يُمنع الحجز مسبقًا."],correctIndex:0,explanation:"feriez mieux de + infinitif يقدّم توصية قوية نسبيًا."}
];

const A2_POLITENESS_READING={
 title:"Une demande à l’hôtel",arTitle:"طلب في الفندق",
 text:"À son arrivée à l’hôtel, Nour découvre que sa chambre donne sur une rue bruyante. Elle appelle la réception : « Bonjour, je voudrais savoir s’il serait possible de changer de chambre. Pourriez-vous vérifier si une chambre plus calme est disponible ? » Le réceptionniste lui conseille d’attendre jusqu’à midi et propose de garder ses bagages. Il ajoute : « Vous devriez visiter le quartier pendant ce temps. » Nour accepte la proposition et demande poliment qu’on la prévienne dès que la nouvelle chambre sera prête.",
 translation:"تكتشف نور عند وصولها إلى الفندق أن غرفتها تطل على شارع صاخب. فتتصل بالاستقبال وتطلب معرفة إمكانية تغيير الغرفة، وتسأل الموظف إن كانت هناك غرفة أكثر هدوءًا. ينصحها موظف الاستقبال بالانتظار حتى الظهر ويعرض الاحتفاظ بحقائبها. ويقترح عليها زيارة الحي في أثناء الانتظار. تقبل نور الاقتراح وتطلب بأدب إبلاغها فور تجهيز الغرفة الجديدة.",
 questions:[
  {question:"Pourquoi Nour veut-elle changer de chambre ?",answer:"Parce que sa chambre donne sur une rue bruyante.",ar:"لأن غرفتها تطل على شارع صاخب."},
  {question:"Que lui conseille le réceptionniste ?",answer:"Il lui conseille d’attendre jusqu’à midi et de visiter le quartier.",ar:"ينصحها بالانتظار حتى الظهر وزيارة الحي."},
  {question:"Quel service propose-t-il ?",answer:"Il propose de garder ses bagages.",ar:"يعرض الاحتفاظ بحقائبها."}
 ]
};

const A2_POLITENESS_LISTENING={
 title:"Des conseils avant un examen",arTitle:"نصائح قبل الاختبار",
 text:"Yanis téléphone à son amie parce qu’il est inquiet avant son examen. Elle lui dit : « Tu devrais préparer un programme simple et faire des pauses régulières. Il faut dormir suffisamment, alors ne travaille pas toute la nuit. Tu pourrais aussi réviser avec un camarade. » Yanis lui demande : « Est-ce que tu pourrais m’aider demain après-midi ? » Son amie accepte avec plaisir, mais elle lui conseille d’apporter ses notes et de préparer ses questions à l’avance.",
 questions:[
  {prompt:"Pourquoi Yanis téléphone-t-il à son amie ?",choices:["Parce qu’il est inquiet avant un examen.","Parce qu’il veut voyager.","Parce qu’il a perdu ses notes."],correctIndex:0},
  {prompt:"Que doit-il faire régulièrement ?",choices:["Téléphoner","Des pauses","Des voyages"],correctIndex:1},
  {prompt:"Que ne doit-il pas faire ?",choices:["Préparer ses questions.","Réviser avec un camarade.","Travailler toute la nuit."],correctIndex:2},
  {prompt:"Que lui demande-t-il ?",choices:["De l’aider demain après-midi.","De passer l’examen à sa place.","De lui acheter un livre."],correctIndex:0}
 ]
};

const A2_POLITENESS_WRITING_MODEL="Bonjour Sami, tu m’as dit que tu étais fatigué avant ton examen. Tu devrais organiser tes révisions et dormir au moins sept heures. À ta place, je préparerais une petite liste de priorités. Il ne faut pas travailler toute la nuit. On pourrait réviser ensemble samedi matin. Pourrais-tu m’envoyer les chapitres difficiles avant vendredi ? Je voudrais préparer quelques exercices pour toi. Dis-moi si cet horaire te convient. Bon courage !";

const A2_POLITENESS_DICTATION=[
 {speech:"Pourriez-vous m’envoyer les horaires, s’il vous plaît ?",ar:"هل يمكنكم إرسال المواعيد إليّ، من فضلكم؟"},
 {speech:"À votre place, je réserverais dès aujourd’hui.",ar:"لو كنت مكانكم لحجزت اليوم دون تأخير."},
 {speech:"Il ne faut pas utiliser cette porte.",ar:"يجب عدم استخدام هذا الباب."}
];

const A2_POLITENESS_BUILDERS=[
 {tokens:["plaît ?","répéter,","Pourriez-vous","vous","s’il"],answer:["Pourriez-vous","répéter,","s’il","vous","plaît ?"],ar:"هل يمكنكم إعادة الكلام، من فضلكم؟"},
 {tokens:["reposer.","devrais","Tu","te"],answer:["Tu","devrais","te","reposer."],ar:"ينبغي أن ترتاح."},
 {tokens:["réservait","si","Et","maintenant ?","on"],answer:["Et","si","on","réservait","maintenant ?"],ar:"ما رأيكم أن نحجز الآن؟"}
];

const A2_POLITENESS_DIALOGUES=[
 {context:"À la réception, vous avez besoin d’une information.",prompt:"اختر الطلب الأنسب للموقف الرسمي.",choices:["Pourriez-vous m’indiquer l’heure du départ ?","Dis-moi l’heure tout de suite.","Tu dois donner l’heure."],correctIndex:0,feedback:"Pourriez-vous… ? يحافظ على المسافة والتهذيب في موقف رسمي."},
 {context:"Votre ami hésite entre deux offres.",prompt:"اختر نصيحة لطيفة لا أمرًا.",choices:["Tu choisiras celle-ci, point final.","À ta place, je comparerais les conditions.","Il est interdit de comparer."],correctIndex:1,feedback:"À ta place, je… بالشرط الحاضر تعرض الرأي دون فرضه."},
 {context:"Un collègue demande votre aide, mais vous êtes occupé.",prompt:"اختر رفضًا مهذبًا مع بديل.",choices:["Non.","Débrouille-toi.","Je suis désolé, je ne peux pas maintenant, mais je pourrais vous aider demain."],correctIndex:2,feedback:"الاعتذار وذكر السبب واقتراح بديل يجعل الرفض واضحًا ومهذبًا."}
];

const A2_CONNECTORS_PRACTICE_ITEMS:Example[]=[
 {fr:"C’est la collègue qui organise la réunion.",ar:"هذه هي الزميلة التي تنظم الاجتماع."},
 {fr:"Voici le document que vous devez signer.",ar:"هذا هو المستند الذي يجب عليكم توقيعه."},
 {fr:"Nous cherchons un café où nous pouvons travailler.",ar:"نبحث عن مقهى يمكننا العمل فيه."},
 {fr:"C’est un projet dont je parle souvent.",ar:"هذا مشروع أتحدث عنه كثيرًا."},
 {fr:"Je prends le bus parce que ma voiture est en panne.",ar:"أستقل الحافلة لأن سيارتي معطلة."},
 {fr:"Le magasin était fermé, donc nous sommes revenus le lendemain.",ar:"كان المتجر مغلقًا، لذلك عدنا في اليوم التالي."},
 {fr:"La chambre est petite ; pourtant, elle est très confortable.",ar:"الغرفة صغيرة، لكنها مريحة جدًا رغم ذلك."},
 {fr:"D’abord, vérifiez l’adresse, puis envoyez le formulaire.",ar:"تحققوا من العنوان أولًا، ثم أرسلوا الاستمارة."},
 {fr:"Le quartier est calme et, de plus, il est bien desservi.",ar:"الحي هادئ، كما أن المواصلات تخدمه جيدًا."},
 {fr:"En résumé, cette solution est simple et économique.",ar:"باختصار، هذا الحل بسيط واقتصادي."}
];

const A2_CONNECTORS_QUIZ_ITEMS:QuizQuestion[]=[
 {prompt:"C’est un guide ___ parle trois langues.",speech:"Complétez avec le pronom relatif sujet.",instruction:"اختر الضمير النسبي الذي يقوم بدور الفاعل.",choices:["qui","que","où"],correctIndex:0,explanation:"الضمير هو فاعل parle، لذلك نستخدم qui."},
 {prompt:"Voici le livre ___ j’ai acheté hier.",speech:"Complétez avec le pronom relatif complément direct.",instruction:"اختر ضمير المفعول المباشر.",choices:["dont","que","qui"],correctIndex:1,explanation:"j’ai acheté quoi ? le livre؛ لذلك نستخدم que."},
 {prompt:"C’est la ville ___ nous avons étudié.",speech:"Complétez avec le pronom relatif de lieu.",instruction:"اختر ضمير المكان المناسب.",choices:["que","dont","où"],correctIndex:2,explanation:"يشير الضمير إلى المكان الذي درسنا فيه، لذلك نستخدم où."},
 {prompt:"Voilà le problème ___ nous parlons.",speech:"Complétez avec le pronom qui remplace de ce problème.",instruction:"اختر الضمير الذي يعوض تركيب de.",choices:["dont","qui","où"],correctIndex:0,explanation:"parler de quelque chose، ولذلك يحل dont محل de ce problème."},
 {prompt:"Je reste à la maison ___ je suis malade.",speech:"Complétez avec un connecteur de cause.",instruction:"أكمل بأداة السبب.",choices:["donc","parce que","pourtant"],correctIndex:1,explanation:"parce que يقدم سبب البقاء في المنزل."},
 {prompt:"Il pleuvait, ___ nous avons annulé la sortie.",speech:"Complétez avec un connecteur de conséquence.",instruction:"أكمل بأداة النتيجة.",choices:["car","même si","donc"],correctIndex:2,explanation:"إلغاء النزهة نتيجة للمطر، لذلك نستخدم donc."},
 {prompt:"Le trajet est long ; ___, il est très agréable.",speech:"Complétez avec un connecteur d’opposition.",instruction:"أكمل بأداة التعارض.",choices:["pourtant","par conséquent","d’abord"],correctIndex:0,explanation:"pourtant يقدم فكرة مخالفة لما قد نتوقعه من طول الطريق."},
 {prompt:"___, préparez les documents. Ensuite, prenez rendez-vous.",speech:"Choisissez le premier organisateur chronologique.",instruction:"اختر رابط بداية الترتيب.",choices:["Enfin","D’abord","Par exemple"],correctIndex:1,explanation:"D’abord يبدأ تسلسل الخطوات، ثم يأتي ensuite."},
 {prompt:"Les transports sont pratiques. ___, le métro passe toutes les cinq minutes.",speech:"Introduisez un exemple précis.",instruction:"اختر أداة تقديم المثال.",choices:["En revanche","C’est pourquoi","Par exemple"],correctIndex:2,explanation:"الجملة الثانية مثال يوضح كون المواصلات عملية."},
 {prompt:"Grâce au nouveau bus, j’arrive plus tôt.",speech:"Grâce au nouveau bus, j’arrive plus tôt.",instruction:"اختر المعنى الدقيق للرابط.",choices:["بفضل الحافلة الجديدة أصل مبكرًا.","بسبب سلبي للحافلة أصل متأخرًا.","رغم الحافلة لا أصل."],correctIndex:0,explanation:"grâce à يقدم سببًا ذا نتيجة إيجابية."}
];

const A2_CONNECTORS_READING={
 title:"Un projet de quartier",arTitle:"مشروع في الحي",
 text:"Dans notre quartier, il existe un jardin qui était rarement utilisé. Une association, dont plusieurs voisins sont membres, a proposé de le transformer. D’abord, les habitants ont nettoyé l’espace, puis ils ont installé des bancs. Ils ont aussi créé une petite zone où les enfants peuvent jouer. Le budget était limité ; pourtant, chacun a apporté du matériel. Grâce à cette coopération, le jardin est devenu plus accueillant. Les habitants s’y retrouvent maintenant chaque semaine, c’est pourquoi l’association souhaite organiser d’autres activités.",
 translation:"توجد في حينا حديقة كان استخدامها نادرًا. اقترحت جمعية ينتمي إليها عدد من الجيران تطويرها. نظف السكان المكان أولًا، ثم وضعوا مقاعد. وأنشؤوا أيضًا مساحة صغيرة يستطيع الأطفال اللعب فيها. كانت الميزانية محدودة، ومع ذلك أحضر كل شخص بعض المعدات. وبفضل هذا التعاون أصبحت الحديقة أكثر ترحيبًا بالزوار. يلتقي السكان فيها الآن كل أسبوع، ولذلك ترغب الجمعية في تنظيم أنشطة أخرى.",
 questions:[
  {question:"Qu’a proposé l’association ?",answer:"Elle a proposé de transformer le jardin.",ar:"اقترحت تطوير الحديقة."},
  {question:"Pourquoi le projet a-t-il avancé malgré le budget limité ?",answer:"Parce que chacun a apporté du matériel.",ar:"لأن كل شخص أحضر بعض المعدات."},
  {question:"Quelle conséquence a eue cette coopération ?",answer:"Le jardin est devenu plus accueillant et les habitants s’y retrouvent chaque semaine.",ar:"أصبحت الحديقة أكثر ترحيبًا وصار السكان يلتقون فيها أسبوعيًا."}
 ]
};

const A2_CONNECTORS_LISTENING={
 title:"Une journée pleine d’imprévus",arTitle:"يوم مليء بالمفاجآت",
 text:"Hier, nous devions visiter un musée qui se trouve près de la gare. D’abord, notre train est arrivé en retard à cause d’un problème technique. Ensuite, nous avons pris un bus, mais nous sommes descendus au mauvais arrêt. Une passante nous a montré le chemin, donc nous avons enfin trouvé le musée. Il était presque midi ; pourtant, nous avons pu suivre la dernière visite guidée. Après la visite, nous avons déjeuné dans un restaurant que notre guide nous avait conseillé. Finalement, la journée a été fatigante, mais très réussie.",
 questions:[
  {prompt:"Pourquoi le train est-il arrivé en retard ?",choices:["À cause d’un problème technique","Grâce au guide","Parce que le musée était fermé"],correctIndex:0},
  {prompt:"Quelle erreur ont-ils faite ensuite ?",choices:["Ils ont perdu leurs billets.","Ils sont descendus au mauvais arrêt.","Ils ont oublié le musée."],correctIndex:1},
  {prompt:"Qui leur a montré le chemin ?",choices:["Le guide","Le conducteur","Une passante"],correctIndex:2},
  {prompt:"Comment la journée s’est-elle terminée ?",choices:["Elle a été fatigante, mais réussie.","Ils n’ont jamais trouvé le musée.","La visite a été annulée."],correctIndex:0}
 ]
};

const A2_CONNECTORS_WRITING_MODEL="Samedi, j’ai participé à une activité qui était organisée dans mon quartier. D’abord, nous avons nettoyé le parc, puis nous avons planté des fleurs. Le matériel que la mairie avait fourni était très utile. Il faisait chaud ; pourtant, tout le monde a continué avec enthousiasme. Comme nous étions nombreux, le travail a donc avancé rapidement. De plus, les voisins ont préparé un repas. Finalement, cette journée m’a plu parce qu’elle nous a permis de mieux nous connaître.";

const A2_CONNECTORS_DICTATION=[
 {speech:"Voici le document que vous devez compléter.",ar:"هذا هو المستند الذي يجب عليكم إكماله."},
 {speech:"Le bus était en retard, donc j’ai pris le métro.",ar:"كانت الحافلة متأخرة، لذلك استقللت المترو."},
 {speech:"D’abord, nous avons réservé, puis nous avons confirmé l’adresse.",ar:"حجزنا أولًا، ثم أكدنا العنوان."}
];

const A2_CONNECTORS_BUILDERS=[
 {tokens:["parle.","qui","C’est","professeur","le"],answer:["C’est","le","professeur","qui","parle."],ar:"هذا هو المعلم الذي يتحدث."},
 {tokens:["annulée.","donc","pleut,","sortie","Il","la","est"],answer:["Il","pleut,","donc","la","sortie","est","annulée."],ar:"تمطر، ولذلك أُلغيت النزهة."},
 {tokens:["l’adresse.","D’abord,","puis","réservez,","confirmez"],answer:["D’abord,","réservez,","puis","confirmez","l’adresse."],ar:"احجزوا أولًا، ثم أكدوا العنوان."}
];

const A2_CONNECTORS_DIALOGUES=[
 {context:"On vous demande : « Pourquoi êtes-vous arrivé en retard ? »",prompt:"اختر جوابًا يوضح السبب.",choices:["Parce que mon train a été retardé.","Donc mon train arrive.","Pourtant je suis le train."],correctIndex:0,feedback:"parce que يجيب مباشرة عن سؤال السبب pourquoi."},
 {context:"Votre ami dit : « Cet hôtel est loin du centre. »",prompt:"أضف معلومة معارضة إيجابية.",choices:["C’est pourquoi il est loin.","Pourtant, il est très bien desservi.","D’abord, il est un hôtel."],correctIndex:1,feedback:"pourtant يربط البعد بميزة تخالف التوقع."},
 {context:"Vous expliquez comment envoyer un dossier.",prompt:"اختر تسلسلًا واضحًا.",choices:["Parce que, pourtant, qui.","Donc le dossier où.","D’abord, remplissez le formulaire ; ensuite, ajoutez les pièces ; enfin, envoyez le dossier."],correctIndex:2,feedback:"d’abord، ensuite، enfin ترتب الخطوات من البداية إلى النهاية."}
];

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
  description:"كوّن الماضي المركب بدقة، واختر الفعل المساعد الصحيح، وطابق اسم المفعول عند الحاجة، ثم استخدمه لسرد أحداث مكتملة ومترابطة.",
  sections:[
   section("Former le passé composé","تكوين الماضي المركب","يتكون الماضي المركب من فعل مساعد مصرّف في الحاضر، avoir أو être، يليه اسم المفعول. تبدأ بإتقان هذه البنية قبل الانتقال إلى المطابقة.",[
    "الصيغة الأساسية: sujet + auxiliaire au présent + participe passé.",
    "أفعال -er: parler → parlé، و-er تتحول إلى -é.",
    "أفعال -ir من نوع finir: finir → fini، و-ir تتحول إلى -i.",
    "أفعال -re المنتظمة: vendre → vendu، و-re تتحول غالبًا إلى -u.",
    "مع avoir يبقى اسم المفعول ثابتًا عادةً؛ ويطابق المفعول المباشر إذا سبقه: les lettres que j’ai écrites."
   ],[
    {fr:"Hier, j’ai visité le musée avec mes amis.",ar:"زرت المتحف أمس مع أصدقائي."},
    {fr:"Nous avons fini notre travail à dix-huit heures.",ar:"أنهينا عملنا الساعة السادسة مساءً."},
    {fr:"Tu as vendu ton ancien vélo la semaine dernière.",ar:"بعت دراجتك القديمة الأسبوع الماضي."}
   ]),
   section("Les participes passés fréquents","أسماء المفعول الشائعة","لا تتبع الأفعال غير المنتظمة قاعدة واحدة؛ لذلك تعلّم أسماء المفعول الأكثر استعمالًا داخل جمل وسياقات واضحة.",[
    "avoir → eu، être → été، faire → fait، lire → lu.",
    "prendre → pris، mettre → mis، écrire → écrit.",
    "voir → vu، boire → bu، recevoir → reçu.",
    "pouvoir → pu، vouloir → voulu، devoir → dû، venir → venu."
   ],[
    {fr:"Elle a pris le train de neuf heures.",ar:"استقلت قطار الساعة التاسعة."},
    {fr:"Vous avez reçu ma confirmation hier soir.",ar:"تلقيتم تأكيدي مساء أمس."},
    {fr:"On a fait les courses avant le déjeuner.",ar:"تسوّقنا قبل الغداء."}
   ]),
   section("Choisir l’auxiliaire être","اختيار الفعل المساعد être","تستخدم بعض الأفعال اللازمة الدالة على الحركة أو تغير الحالة être، وكذلك جميع الأفعال الضميرية. ويطابق اسم المفعول الفاعل في الجنس والعدد.",[
    "aller, venir, arriver, partir, entrer, sortir, naître, mourir تستخدم être عندما تكون لازمة.",
    "المذكر المفرد بلا إضافة: Il est parti؛ والمؤنث: Elle est partie.",
    "جمع المذكر: Ils sont arrivés؛ وجمع المؤنث: Elles sont arrivées.",
    "بعض الأفعال قد تستخدم avoir إذا أخذت مفعولًا مباشرًا: Elle a sorti son téléphone."
   ],[
    {fr:"Lina est rentrée chez elle après le cours.",ar:"عادت لينا إلى منزلها بعد الدرس."},
    {fr:"Mes parents sont arrivés samedi matin.",ar:"وصل والداي صباح السبت."},
    {fr:"Elles sont sorties ensemble après le travail.",ar:"خرجن معًا بعد العمل."}
   ]),
   section("Les verbes pronominaux au passé","الأفعال الضميرية في الماضي","تأخذ الأفعال الضميرية être في الماضي المركب. يأتي الضمير الانعكاسي قبل الفعل المساعد، وتظهر المطابقة في الحالات الأساسية التي يدرسها مستوى A2.",[
    "Je me suis levé(e)، tu t’es préparé(e)، elle s’est couchée.",
    "Nous nous sommes réveillés، vous vous êtes habillés، elles se sont reposées.",
    "في النفي: Elle ne s’est pas levée tôt.",
    "مع السؤال: À quelle heure vous êtes-vous réveillés ?"
   ],[
    {fr:"Je me suis réveillé tôt ce matin.",ar:"استيقظت مبكرًا هذا الصباح."},
    {fr:"Sara s’est préparée en vingt minutes.",ar:"استعدت سارة خلال عشرين دقيقة."},
    {fr:"Nous ne nous sommes pas couchés tard.",ar:"لم نخلد إلى النوم متأخرين."}
   ]),
   section("Négation, questions et adverbes","النفي والسؤال والظروف","ضع النفي حول الفعل المساعد، واستعمل صيغة السؤال المناسبة. تأتي ظروف قصيرة مثل bien وdéjà وbeaucoup غالبًا بين الفعل المساعد واسم المفعول.",[
    "النفي: sujet + ne/n’ + auxiliaire + pas/jamais/plus + participe passé.",
    "السؤال المحايد: Est-ce que vous avez réservé ?",
    "القلب: Avez-vous compris ? وOù êtes-vous allés ?",
    "الظرف القصير: J’ai bien compris؛ Nous avons déjà mangé."
   ],[
    {fr:"Je n’ai jamais essayé cette recette.",ar:"لم أجرّب هذه الوصفة قط."},
    {fr:"Est-ce que vous avez envoyé le document ?",ar:"هل أرسلتم المستند؟"},
    {fr:"Ils ont déjà réservé une chambre.",ar:"لقد حجزوا غرفة بالفعل."}
   ]),
   section("Raconter des événements terminés","سرد أحداث مكتملة","يستخدم الماضي المركب لحدث وقع وانتهى، أو لسلسلة أحداث متتابعة. رتّب السرد بعلامات زمنية وروابط واضحة.",[
    "مؤشرات شائعة: hier، ce matin، la semaine dernière، en 2025.",
    "ترتيب الأحداث: d’abord، ensuite، puis، enfin.",
    "السبب والنتيجة: parce que، alors، donc.",
    "لإجابة مترابطة: حدد الزمن، ثم الحدث، ثم النتيجة أو الانطباع."
   ],[
    {fr:"D’abord, nous avons acheté les billets, puis nous sommes entrés dans la salle.",ar:"اشترينا التذاكر أولًا، ثم دخلنا القاعة."},
    {fr:"Le bus est arrivé en retard, alors j’ai appelé mon collègue.",ar:"وصلت الحافلة متأخرة، لذلك اتصلت بزميلي."},
    {fr:"J’ai passé une excellente journée parce que j’ai découvert plusieurs endroits.",ar:"قضيت يومًا رائعًا لأنني اكتشفت عدة أماكن."}
   ])
  ]
 },
 {
  id:"imparfait",title:"L’imparfait et le récit",ar:"الماضي الناقص والسرد",icon:BookOpen,
  description:"كوّن الماضي الناقص بدقة، واستخدمه لوصف العادات والحالات والخلفية، ثم ميّزه عن الماضي المركب داخل سرد مترابط.",
  sections:[
   section("Former l’imparfait","تكوين الماضي الناقص","نأخذ صيغة nous في الحاضر، نحذف النهاية -ons، ثم نضيف نهايات الماضي الناقص نفسها إلى جميع الأفعال.",[
    "النهايات: -ais, -ais, -ait, -ions, -iez, -aient.",
    "nous parlons → parl- → je parlais؛ nous finissons → finiss- → ils finissaient.",
    "nous prenons → pren- → vous preniez؛ nous faisons → fais- → elle faisait.",
    "يحافظ كل ضمير على نهايته نفسها مهما كانت مجموعة الفعل."
   ],[
    {fr:"Je travaillais dans une librairie près de la gare.",ar:"كنت أعمل في مكتبة لبيع الكتب قرب المحطة."},
    {fr:"Nous choisissions toujours une table près de la fenêtre.",ar:"كنا نختار دائمًا طاولة قرب النافذة."},
    {fr:"Vous preniez le même bus chaque matin.",ar:"كنتم تستقلون الحافلة نفسها كل صباح."}
   ]),
   section("Être et les particularités d’écriture","فعل être وخصائص الكتابة","الفعل être هو الاستثناء الوحيد في تكوين الجذر؛ جذره ét-. كما تظهر تغييرات إملائية تحافظ على النطق في بعض الأفعال.",[
    "être: j’étais، tu étais، il était، nous étions، vous étiez، ils étaient.",
    "manger: je mangeais ولكن nous mangions؛ تحذف e قبل i.",
    "commencer: je commençais ولكن nous commencions؛ تتحول c إلى ç قبل a فقط.",
    "étudier: nous étudiions وvous étudiiez؛ اجتماع حرفي i صحيح."
   ],[
    {fr:"À cette époque, j’étais étudiant à Lyon.",ar:"في ذلك الوقت كنت طالبًا في ليون."},
    {fr:"Les enfants mangeaient dans la cuisine.",ar:"كان الأطفال يأكلون في المطبخ."},
    {fr:"Nous étudiions ensemble après les cours.",ar:"كنا ندرس معًا بعد الدروس."}
   ]),
   section("Habitudes et répétitions passées","العادات والتكرار في الماضي","نستخدم الماضي الناقص لما كان يحدث بانتظام أو يتكرر في فترة ماضية، دون التركيز على بداية الفعل أو نهايته.",[
    "مؤشرات شائعة: souvent، toujours، d’habitude، tous les jours، chaque semaine.",
    "avant وà cette époque تقدمان عادة أو وضعًا قديمًا.",
    "يمكن وصف روتين كامل بسلسلة أفعال في الماضي الناقص.",
    "السؤال عن العادة: Qu’est-ce que tu faisais le week-end ?"
   ],[
    {fr:"Quand j’étais enfant, je passais mes vacances à la campagne.",ar:"عندما كنت طفلًا، كنت أقضي عطلتي في الريف."},
    {fr:"Chaque samedi, mes parents faisaient les courses au marché.",ar:"كان والداي يتسوقان من السوق كل يوم سبت."},
    {fr:"Avant, nous ne regardions jamais la télévision le matin.",ar:"في السابق، لم نكن نشاهد التلفاز صباحًا أبدًا."}
   ]),
   section("Descriptions, états et arrière-plan","الوصف والحالات وخلفية الأحداث","يصف الماضي الناقص الأشخاص والأماكن والطقس والوقت والعمر والمشاعر، ويرسم الخلفية التي وقع داخلها الحدث.",[
    "الطقس والوقت: Il faisait beau؛ Il était huit heures.",
    "العمر والحالة: J’avais dix ans؛ Elle était fatiguée.",
    "الوصف: La rue était calme et les magasins étaient fermés.",
    "الأفعال الذهنية والحسية مثل aimer، penser، vouloir وsavoir تأتي كثيرًا في الماضي الناقص."
   ],[
    {fr:"Il faisait froid et le vent soufflait très fort.",ar:"كان الجو باردًا وكانت الرياح تهب بقوة."},
    {fr:"La salle était lumineuse et les invités semblaient heureux.",ar:"كانت القاعة مضيئة وبدا الضيوف سعداء."},
    {fr:"Je voulais partir, mais je ne connaissais pas le chemin.",ar:"كنت أريد المغادرة، لكنني لم أكن أعرف الطريق."}
   ]),
   section("Imparfait ou passé composé","التمييز بين الماضيين","يرسم الماضي الناقص الخلفية أو العادة أو الفعل الجاري، بينما يقدّم الماضي المركب حدثًا محددًا وقع واكتمل أو قطع فعلًا جاريًا.",[
    "الخلفية: Il pleuvait؛ والحدث المكتمل: Le bus est arrivé.",
    "الفعل الجاري + الحدث القاطع: Je dormais quand le téléphone a sonné.",
    "سلسلة أحداث منتهية تستخدم الماضي المركب، والوصف المحيط بها يستخدم الماضي الناقص.",
    "لا يحدد الظرف الزمن وحده؛ المعنى المقصود هو الذي يحدد الاختيار."
   ],[
    {fr:"Je préparais le dîner quand tu as appelé.",ar:"كنت أحضّر العشاء عندما اتصلت."},
    {fr:"Pendant qu’ils marchaient, il a commencé à pleuvoir.",ar:"بينما كانوا يمشون، بدأ المطر يهطل."},
    {fr:"La salle était silencieuse, puis la porte s’est ouverte.",ar:"كانت القاعة هادئة، ثم فُتح الباب."}
   ]),
   section("Organiser un récit au passé","تنظيم سرد في الماضي","امزج الزمنين لبناء مشهد واضح: ابدأ بالخلفية، قدّم الحدث الرئيس، ثم أضف النتيجة أو رد الفعل.",[
    "pendant que وalors que يربطان حدثين جاريين أو متزامنين.",
    "quand يقدم الحدث الذي وقع أثناء الوضع المستمر.",
    "soudain وtout à coup يقدمان حدثًا مفاجئًا بالماضي المركب.",
    "رتّب السرد: خلفية + حدث + نتيجة + انطباع."
   ],[
    {fr:"Pendant que je cherchais mon billet, le train est parti.",ar:"بينما كنت أبحث عن تذكرتي، غادر القطار."},
    {fr:"Les clients attendaient dehors quand le magasin a ouvert.",ar:"كان الزبائن ينتظرون في الخارج عندما فتح المتجر."},
    {fr:"Nous rentrions tranquillement quand nous avons entendu un bruit.",ar:"كنا عائدين بهدوء عندما سمعنا صوتًا."}
   ])
  ]
 },
 {
  id:"future",title:"Parler de l’avenir",ar:"التحدث عن المستقبل",icon:CalendarDays,
  description:"عبّر عن النية والخطة والموعد والتوقع والوعد باستخدام المستقبل القريب والبسيط، مع اختيار الصيغة المناسبة لكل سياق.",
  sections:[
   section("Le futur proche","المستقبل القريب","يتكوّن المستقبل القريب من aller في الحاضر ثم مصدر الفعل، ويعبّر غالبًا عن نية واضحة أو حدث قريب تدل عليه الظروف الحالية.",[
    "الصيغة: sujet + aller au présent + infinitif.",
    "je vais، tu vas، il va، nous allons، vous allez، ils vont + المصدر.",
    "الضمير يسبق المصدر: Je vais le réserver؛ Nous allons nous préparer.",
    "في النفي نحيط aller بـ ne…pas: Je ne vais pas sortir."
   ],[
    {fr:"Je vais appeler le médecin cet après-midi.",ar:"سأتصل بالطبيب بعد ظهر اليوم."},
    {fr:"Nous allons nous installer dans un autre quartier.",ar:"سننتقل للسكن في حي آخر."},
    {fr:"Elle ne va pas participer à la réunion.",ar:"لن تشارك في الاجتماع."}
   ]),
   section("Former le futur simple","تكوين المستقبل البسيط","نضيف نهايات المستقبل إلى المصدر في أفعال -er و-ir، ونحذف e الأخيرة من أفعال -re قبل إضافة النهايات.",[
    "النهايات: -ai, -as, -a, -ons, -ez, -ont.",
    "parler → je parlerai؛ finir → nous finirons.",
    "vendre → vous vendrez؛ attendre → ils attendront.",
    "النهايات هي نفسها لجميع الأفعال، لكن بعض الجذور غير منتظمة."
   ],[
    {fr:"Je terminerai ce rapport avant vendredi.",ar:"سأنهي هذا التقرير قبل يوم الجمعة."},
    {fr:"Vous choisirez la date qui vous convient.",ar:"ستختارون التاريخ الذي يناسبكم."},
    {fr:"Ils répondront à votre demande demain.",ar:"سيردّون على طلبكم غدًا."}
   ]),
   section("Les radicaux irréguliers","الجذور غير المنتظمة","تحافظ الأفعال غير المنتظمة على نهايات المستقبل نفسها، لكن جذرها يتغير ويجب تثبيته داخل أمثلة متداولة.",[
    "être → ser-، avoir → aur-، aller → ir-، faire → fer-.",
    "venir → viendr-، tenir → tiendr-، voir → verr-، envoyer → enverr-.",
    "pouvoir → pourr-، vouloir → voudr-، devoir → devr-، savoir → saur-.",
    "recevoir → recevr-، falloir → il faudra، pleuvoir → il pleuvra."
   ],[
    {fr:"Nous serons disponibles après quatorze heures.",ar:"سنكون متاحين بعد الساعة الثانية ظهرًا."},
    {fr:"Tu pourras récupérer ton dossier demain.",ar:"ستتمكن من استلام ملفك غدًا."},
    {fr:"Il faudra confirmer la réservation avant lundi.",ar:"سيكون من الضروري تأكيد الحجز قبل يوم الاثنين."}
   ]),
   section("Négation, questions et pronoms","النفي والسؤال والضمائر","ضع النفي حول الفعل المصرف، واختر صيغة السؤال المناسبة. ومع المستقبل القريب تبقى ضمائر المفعول قبل المصدر.",[
    "المستقبل البسيط: Je ne viendrai pas؛ Ils ne répondront jamais.",
    "المستقبل القريب: Nous n’allons pas partir؛ Je vais lui écrire.",
    "السؤال المحايد: Est-ce que vous viendrez demain ?",
    "القلب: Quand arrivera-t-il ? وOù irez-vous ?"
   ],[
    {fr:"Je ne pourrai pas vous accompagner demain.",ar:"لن أستطيع مرافقتكم غدًا."},
    {fr:"Est-ce que tu vas lui envoyer l’adresse ?",ar:"هل سترسل إليه العنوان؟"},
    {fr:"À quelle heure arriverez-vous à la gare ?",ar:"في أي ساعة ستصلون إلى المحطة؟"}
   ]),
   section("Projets, prévisions et promesses","الخطط والتوقعات والوعود","حدّد الزمن وأضف درجة اليقين أو الاحتمال. يُستخدم المستقبل للتخطيط، والتوقع، والوعد، وتقديم المساعدة.",[
    "الوقت: ce soir، demain، bientôt، la semaine prochaine، dans deux ans.",
    "التوقع: Je pense que…؛ probablement؛ peut-être.",
    "الوعد: Je te rappellerai؛ Nous vous aiderons.",
    "الخطة المنظمة: d’abord، ensuite، puis، enfin."
   ],[
    {fr:"La semaine prochaine, nous allons visiter trois appartements.",ar:"سنزور ثلاثة منازل الأسبوع المقبل."},
    {fr:"Je pense que le voyage sera très agréable.",ar:"أعتقد أن الرحلة ستكون ممتعة جدًا."},
    {fr:"Ne vous inquiétez pas, je vous préviendrai dès que possible.",ar:"لا تقلقوا، سأبلغكم في أقرب وقت ممكن."}
   ]),
   section("Choisir la forme et relier les idées","اختيار الصيغة وربط الأفكار","استخدم المستقبل القريب للنية أو الحدث الوشيك، والمستقبل البسيط للتوقع والوعد والحدث الأبعد. وقد تكون الصيغتان صحيحتين مع اختلاف النظرة إلى الحدث.",[
    "نية مقررة: Je vais changer de travail؛ توقع أو قرار: Je changerai un jour.",
    "مع si: si + présent، ثم futur: Si j’ai le temps, je viendrai.",
    "مع quand في الحديث عن المستقبل نستخدم المستقبل: Quand tu arriveras, nous dînerons.",
    "اربط الشرط أو الزمن بالنتيجة لتكوين إجابة كاملة."
   ],[
    {fr:"Si vous réservez aujourd’hui, vous paierez moins cher.",ar:"إذا حجزتم اليوم، فستدفعون سعرًا أقل."},
    {fr:"Quand nous arriverons à Nice, nous prendrons un taxi.",ar:"عندما نصل إلى نيس، سنستقل سيارة أجرة."},
    {fr:"Le ciel est très sombre : il va probablement pleuvoir.",ar:"السماء شديدة الظلمة؛ من المحتمل أن تمطر بعد قليل."}
   ])
  ]
 },
 {
  id:"pronouns",title:"Pronoms compléments",ar:"ضمائر المفعول",icon:Users,
  description:"استبدل الأشخاص والأشياء دون تكرار، وميّز بين المفعول المباشر وغير المباشر، ثم ضع الضمير في موضعه الصحيح مع الأزمنة والأمر.",
  sections:[
   section("Les pronoms COD","ضمائر المفعول المباشر","يحل ضمير المفعول المباشر محل اسم يتصل بالفعل دون حرف جر. اختر الضمير بحسب الشخص والجنس والعدد.",[
    "me/m’، te/t’، le/l’، la/l’، nous، vous، les.",
    "Je vois Lina → Je la vois؛ Il prend le dossier → Il le prend.",
    "قبل حرف متحرك نحذف حركة le أو la: Je l’attends؛ Je l’écoute.",
    "السؤال المساعد: qui ? أو quoi ? بعد الفعل دون à."
   ],[
    {fr:"Le directeur nous attend dans son bureau.",ar:"المدير ينتظرنا في مكتبه."},
    {fr:"Cette adresse, je ne la connais pas.",ar:"لا أعرف هذا العنوان."},
    {fr:"Vos billets, vous les recevrez par courriel.",ar:"ستتلقون تذاكركم عبر البريد الإلكتروني."}
   ]),
   section("Les pronoms COI","ضمائر المفعول غير المباشر","يحل ضمير المفعول غير المباشر محل شخص يسبقه à مع أفعال مثل parler à وrépondre à وtéléphoner à.",[
    "me/m’، te/t’، lui، nous، vous، leur.",
    "Je parle à Lina → Je lui parle؛ J’écris à mes parents → Je leur écris.",
    "lui للمفرد المذكر والمؤنث، وleur لجمع الأشخاص.",
    "السؤال المساعد: à qui ?"
   ],[
    {fr:"Je lui ai répondu dès mon arrivée.",ar:"أجبته فور وصولي."},
    {fr:"Nous leur téléphonons chaque semaine.",ar:"نتصل بهم كل أسبوع."},
    {fr:"Pouvez-vous me montrer le chemin ?",ar:"هل يمكنكم أن تدلوني على الطريق؟"}
   ]),
   section("COD ou COI ?","المباشر أم غير المباشر؟","لا تختَر الضمير من المعنى العربي وحده؛ تحقّق من تركيب الفعل الفرنسي ومن وجود à قبل الشخص.",[
    "attendre quelqu’un → l’attendre؛ écouter quelqu’un → l’écouter.",
    "parler à quelqu’un → lui parler؛ répondre à quelqu’un → lui répondre.",
    "me، te، nous، vous لها الشكل نفسه في الوظيفتين؛ الفعل هو الذي يحدد الوظيفة.",
    "أشياء مسبوقة بـ à لا تُستبدل عادة بـ lui/leur؛ سيأتي استعمال y في درس مستقل."
   ],[
    {fr:"J’attends mes amis : je les attends devant la gare.",ar:"أنتظر أصدقائي أمام المحطة."},
    {fr:"Je parle à mes amis : je leur parle du voyage.",ar:"أتحدث مع أصدقائي عن الرحلة."},
    {fr:"Elle nous écoute, puis elle nous répond.",ar:"تستمع إلينا، ثم تجيبنا."}
   ]),
   section("La place du pronom","موضع الضمير","يأتي الضمير غالبًا قبل الفعل الذي يتعلّق به. في الزمن المركب يسبق الفعل المساعد، ومع المصدر يسبق المصدر.",[
    "الحاضر والمستقبل: Je le prends؛ Je le prendrai.",
    "الزمن المركب: Je l’ai vu؛ Nous leur avons écrit.",
    "فعل + مصدر: Je vais le réserver؛ Tu peux lui répondre.",
    "النفي يحيط بالفعل المصرف: Je ne le prends pas؛ Je ne vais pas lui écrire."
   ],[
    {fr:"Nous ne les avons pas encore reçus.",ar:"لم نتلقَّها بعد."},
    {fr:"Elle veut vous présenter son projet.",ar:"تريد أن تعرض عليكم مشروعها."},
    {fr:"Je ne pourrai pas lui répondre ce soir.",ar:"لن أتمكن من الرد عليه هذا المساء."}
   ]),
   section("Deux pronoms et l’accord","ضميران واتفاق اسم المفعول","عند اجتماع ضميرين قبل الفعل نتبع ترتيبًا ثابتًا. ومع avoir يتوافق اسم المفعول مع المفعول المباشر إذا سبقه.",[
    "الترتيب الشائع: me/te/nous/vous ثم le/la/les: Il me le donne.",
    "مع الغائب: le/la/les ثم lui/leur: Je le lui explique؛ Je les leur envoie.",
    "COD قبل avoir: La lettre ? Je l’ai écrite؛ Les clés ? Je les ai trouvées.",
    "لا يفرض lui أو leur اتفاقًا: Je leur ai parlé."
   ],[
    {fr:"Ce formulaire, je vous le rendrai demain.",ar:"سأعيد إليكم هذه الاستمارة غدًا."},
    {fr:"Les photos, elle les a envoyées ce matin.",ar:"أرسلت الصور هذا الصباح."},
    {fr:"Cette règle, le professeur la leur explique clairement.",ar:"يشرح المعلم لهم هذه القاعدة بوضوح."}
   ]),
   section("Les pronoms à l’impératif","الضمائر مع صيغة الأمر","في الأمر المثبت يأتي الضمير بعد الفعل بشرطات ويتغيّر me إلى moi. وفي الأمر المنفي يعود الضمير قبل الفعل.",[
    "مثبت: Regarde-le؛ Téléphone-lui؛ Écoutez-moi.",
    "ضميران في المثبت: Donne-le-moi؛ Montrez-la-leur.",
    "منفي: Ne le regarde pas؛ Ne lui téléphonez pas.",
    "في المثبت يأتي le/la/les قبل moi/toi/lui/nous/vous/leur."
   ],[
    {fr:"Expliquez-la-moi encore une fois.",ar:"اشرحوها لي مرة أخرى."},
    {fr:"Ne leur montrez pas ce document.",ar:"لا تروهم هذا المستند."},
    {fr:"Ces clés, rendez-les-lui aujourd’hui.",ar:"أعيدوا إليه هذه المفاتيح اليوم."}
   ])
  ]
 },
 {
  id:"quantity",title:"Quantités, y et en",ar:"الكميات والضميران y وen",icon:ShoppingBag,
  description:"عبّر عن كمية محددة أو غير محددة، ثم استخدم en وy لتجنب التكرار مع الحفاظ على العدد والمعنى وموضع الضمير الصحيح.",
  sections:[
   section("Les articles partitifs","أدوات التجزئة","نستخدم أدوات التجزئة عندما نتحدث عن جزء أو كمية غير محددة من مادة أو طعام أو مفهوم لا يُعدّ مباشرة.",[
    "du مع المذكر: du pain؛ de la مع المؤنث: de la soupe.",
    "de l’ قبل حرف متحرك أو h صامت: de l’eau، de l’huile.",
    "des مع الجمع غير المحدد: des légumes، des informations.",
    "لا تعني الأداة «كل» الشيء، بل كمية غير محددة منه."
   ],[
    {fr:"Elle boit de l’eau pendant le repas.",ar:"تشرب ماءً أثناء الوجبة."},
    {fr:"Nous préparons de la soupe pour ce soir.",ar:"نحضّر حساءً لهذا المساء."},
    {fr:"Ils achètent du riz et des légumes.",ar:"يشترون أرزًا وخضروات."}
   ]),
   section("Exprimer une quantité","التعبير عن الكمية","بعد مقدار أو عدد أو تعبير كمية نستخدم de أو d’ قبل الاسم، سواء أكان الاسم مفردًا أم جمعًا.",[
    "un kilo de tomates، une bouteille d’eau، trois tranches de pain.",
    "beaucoup de، un peu de، assez de، trop de، moins de، plus de.",
    "السؤال: combien de… ? والجواب يذكر العدد أو المقدار.",
    "الأعداد المباشرة لا تحتاج de: deux pommes، cinq billets."
   ],[
    {fr:"Je voudrais deux cents grammes de fromage.",ar:"أود مئتي غرام من الجبن."},
    {fr:"Il y a trop de sucre dans cette boisson.",ar:"توجد كمية زائدة من السكر في هذا المشروب."},
    {fr:"Combien de places reste-t-il ?",ar:"كم مقعدًا متبقيًا؟"}
   ]),
   section("La quantité et la négation","الكمية مع النفي","بعد النفي تتحول du وde la وde l’ وdes غالبًا إلى de أو d’. لكن الأداة لا تتغير بعد être، وتبقى الكمية المحددة كما هي.",[
    "Je bois du café → Je ne bois pas de café.",
    "Elle achète des fruits → Elle n’achète pas de fruits.",
    "مع être: Ce n’est pas du café؛ Ce ne sont pas des pommes.",
    "العدد يبقى: Je n’ai pas deux billets، بل تذكرة واحدة."
   ],[
    {fr:"Nous ne mettons pas de sel dans cette recette.",ar:"لا نضيف ملحًا إلى هذه الوصفة."},
    {fr:"Ce n’est pas de l’huile, c’est du vinaigre.",ar:"هذا ليس زيتًا، بل خلّ."},
    {fr:"Elle n’a pas assez de temps pour cuisiner.",ar:"ليس لديها وقت كافٍ للطهي."}
   ]),
   section("Le pronom en","الضمير en","يحل en محل اسم أو تركيب يسبقه de، ويستبدل أيضًا أدوات التجزئة والاسم بعد العدد. عند وجود كمية، نحذف الاسم ونُبقي مقدارها.",[
    "Tu veux du thé ? Oui, j’en veux.",
    "Il parle de son projet → Il en parle.",
    "J’ai trois frères → J’en ai trois؛ Elle achète un kilo de pommes → Elle en achète un kilo.",
    "en لا يستبدل عادة شخصًا محددًا: Je parle de Lina → Je parle d’elle."
   ],[
    {fr:"Des tomates ? Il en faut six.",ar:"الطماطم؟ نحتاج إلى ست حبات منها."},
    {fr:"Cette expérience, elle en parle souvent.",ar:"تتحدث عن هذه التجربة كثيرًا."},
    {fr:"Nous n’en avons acheté qu’une bouteille.",ar:"لم نشترِ منه سوى زجاجة واحدة."}
   ]),
   section("Le pronom y","الضمير y","يحل y محل مكان سبقته à أو dans أو chez أو sur، كما يحل محل تركيب à + شيء مع أفعال مثل penser à وparticiper à.",[
    "Je vais à la gare → J’y vais؛ Il reste chez lui → Il y reste.",
    "Nous pensons à ce problème → Nous y pensons.",
    "مع الأشخاص نستخدم غالبًا الضمير المشدد: Je pense à Lina → Je pense à elle.",
    "لا نستخدم y إذا لم يوجد مرجع مفهوم في السياق."
   ],[
    {fr:"Cette bibliothèque est calme ; j’y travaille souvent.",ar:"هذه المكتبة هادئة، وأعمل فيها كثيرًا."},
    {fr:"Vous participez à la réunion ? Oui, j’y participe.",ar:"هل ستشاركون في الاجتماع؟ نعم، سأشارك فيه."},
    {fr:"Ils sont allés chez le médecin et ils y sont restés une heure.",ar:"ذهبوا إلى عيادة الطبيب وبقوا هناك ساعة."}
   ]),
   section("La place de y et en","موضع y وen","يأتي y وen قبل الفعل المصرف، وقبل المصدر الذي يتعلقان به. في الأمر المثبت يأتيان بعد الفعل، وفي النفي يعودان قبله.",[
    "الحاضر والمركب: J’y vais؛ J’en ai acheté؛ Nous y sommes restés.",
    "مع المصدر: Je vais y aller؛ Elle veut en parler.",
    "الأمر المثبت: Vas-y؛ Prenez-en؛ الأمر المنفي: N’y va pas؛ N’en prenez pas.",
    "عند اجتماعهما يأتي y قبل en: Il y en a؛ Je n’y en trouve plus."
   ],[
    {fr:"Nous allons y retourner la semaine prochaine.",ar:"سنعود إلى هناك الأسبوع المقبل."},
    {fr:"Achetez-en deux pour demain.",ar:"اشتروا اثنتين منه للغد."},
    {fr:"Dans ce magasin, il n’y en a plus.",ar:"لم يعد منه شيء في هذا المتجر."}
   ])
  ]
 },
 {
  id:"comparison",title:"Comparer et préciser",ar:"المقارنة والتحديد",icon:ListChecks,
  description:"قارن الصفات والكميات والأفعال وطرائق القيام بها، ثم حدّد الدرجة واستعمل التفضيل والصيغ غير المنتظمة بدقة.",
  sections:[
   section("Comparer des qualités","مقارنة الصفات","توضع أداة المقارنة قبل الصفة، ثم يأتي que قبل العنصر الثاني. تتوافق الصفة مع الاسم في الجنس والعدد.",[
    "الزيادة: plus + adjectif + que؛ plus grand que.",
    "النقصان: moins + adjectif + que؛ moins cher que.",
    "التساوي: aussi + adjectif + que؛ aussi pratique que.",
    "التوافق: une chambre plus lumineuse؛ des rues moins bruyantes."
   ],[
    {fr:"Cette rue est plus animée que la précédente.",ar:"هذا الشارع أكثر حيوية من الشارع السابق."},
    {fr:"Les chambres du fond sont moins bruyantes.",ar:"الغرف الخلفية أقل ضوضاء."},
    {fr:"Le second exercice est aussi utile que le premier.",ar:"التمرين الثاني مفيد بقدر التمرين الأول."}
   ]),
   section("Comparer quantités, actions et manières","مقارنة الكميات والأفعال والطرائق","تتغير بنية المقارنة بحسب ما نقارنه: اسمًا أو فعلًا أو ظرفًا يصف طريقة حدوث الفعل.",[
    "مع الاسم: plus de / moins de / autant de + nom + que.",
    "مع الفعل: verbe + plus / moins / autant + que.",
    "مع الظرف: plus / moins / aussi + adverbe + que.",
    "أمثلة: plus de temps؛ travaille autant؛ répond plus rapidement."
   ],[
    {fr:"Cette équipe a autant de clients que l’autre.",ar:"لدى هذا الفريق عدد العملاء نفسه لدى الفريق الآخر."},
    {fr:"Je voyage moins qu’avant.",ar:"أسافر أقل مما كنت أفعل سابقًا."},
    {fr:"Elle répond plus clairement que son collègue.",ar:"تجيب بوضوح أكبر من زميلها."}
   ]),
   section("Le superlatif","صيغة التفضيل","تحدد صيغة التفضيل أعلى درجة أو أدناها داخل مجموعة. تتوافق أداة التعريف مع الاسم، بينما يبقى الظرف ثابتًا.",[
    "مع الصفة: le/la/les plus أو le/la/les moins + adjectif.",
    "المجموعة تأتي غالبًا مع de: la plus grande de la ville.",
    "مع الظرف: le plus / le moins + adverbe؛ elle répond le plus clairement.",
    "يمكن ذكر معيار التفضيل لتجنب حكم غامض: le moins cher de ces hôtels."
   ],[
    {fr:"C’est la station la plus proche de l’hôtel.",ar:"هذه أقرب محطة إلى الفندق."},
    {fr:"Ces billets sont les moins chers du site.",ar:"هذه التذاكر هي الأقل سعرًا في الموقع."},
    {fr:"De toute l’équipe, Lina travaille le plus efficacement.",ar:"تعمل لينا بأعلى كفاءة بين أفراد الفريق."}
   ]),
   section("Meilleur, mieux et pire","الصيغ غير المنتظمة","لا نقول plus bon أو plus bien في الاستعمال المعياري؛ meilleur يصف اسمًا، أما mieux فيصف فعلًا أو حالة.",[
    "bon → meilleur / meilleure / meilleurs / meilleures.",
    "bien → mieux؛ Il travaille mieux؛ Je vais mieux.",
    "le meilleur يرافق اسمًا، وle mieux يرتبط بالفعل: le meilleur choix؛ il explique le mieux.",
    "mauvais → plus mauvais أو pire بحسب السياق؛ تجنب plus pire."
   ],[
    {fr:"Cette proposition est meilleure que la première.",ar:"هذا الاقتراح أفضل من الأول."},
    {fr:"Aujourd’hui, je comprends mieux la règle.",ar:"أفهم القاعدة اليوم بصورة أفضل."},
    {fr:"C’est le pire moment pour téléphoner.",ar:"هذا أسوأ وقت للاتصال."}
   ]),
   section("Préciser le degré","تحديد درجة الوصف","تضيف ظروف الدرجة فرقًا مهمًا: بعضها يقوّي الصفة أو يخففها، وبعضها يعني أن الدرجة تجاوزت الحد المناسب.",[
    "très وvraiment للتقوية: très utile، vraiment intéressant.",
    "assez لدرجة كافية أو معتدلة: assez grand.",
    "un peu للتخفيف: un peu loin؛ plutôt لانطباع نسبي: plutôt calme.",
    "trop يعني أكثر من اللازم: trop cher؛ beaucoup يقوي المقارنة: beaucoup plus rapide."
   ],[
    {fr:"L’hôtel est plutôt calme et très bien situé.",ar:"الفندق هادئ نسبيًا وموقعه ممتاز."},
    {fr:"Ce sac est un peu lourd pour moi.",ar:"هذه الحقيبة ثقيلة قليلًا بالنسبة إليّ."},
    {fr:"Le trajet est beaucoup plus court par le parc.",ar:"المسار أقصر بكثير عبر الحديقة."}
   ]),
   section("Former et placer les adverbes","تكوين الظروف ووضعها","تصف الظروف طريقة حدوث الفعل، وكثير منها ينتهي بـ -ment. اختر الصيغة الصحيحة ثم ضعها قريبًا من الفعل الذي تصفه.",[
    "غالبًا المؤنث + -ment: lent → lente → lentement؛ clair → clairement.",
    "إذا انتهت الصفة بـ -ant: constant → constamment؛ وبـ -ent: prudent → prudemment.",
    "صيغ شائعة يجب حفظها: bon → bien؛ gentil → gentiment؛ précis → précisément.",
    "بعد فعل بسيط غالبًا: Il parle clairement؛ ومع المقارنة: plus clairement que."
   ],[
    {fr:"Le réceptionniste nous accueille poliment.",ar:"يستقبلنا موظف الاستقبال بأدب."},
    {fr:"Veuillez répondre précisément à la question.",ar:"يرجى الإجابة عن السؤال بدقة."},
    {fr:"Elle conduit prudemment quand il pleut.",ar:"تقود بحذر عندما تمطر."}
   ])
  ]
 },
 {
  id:"politeness",title:"Demander et conseiller",ar:"الطلب والنصيحة",icon:MessageCircle,
  description:"اطلب خدمة أو إذنًا بدرجة مناسبة من التهذيب، وقدّم نصيحة أو اقتراحًا، وميّز بين التوصية والالتزام والمنع.",
  sections:[
   section("Demander poliment","الطلب المهذب","تخفف صيغة الشرط الحاضر مباشرة الطلب، وتناسب الخدمات والمواقف الرسمية. أضف التحية وs’il vous plaît عند الحاجة.",[
    "Je voudrais + nom أو infinitif: Je voudrais réserver.",
    "J’aimerais + nom أو infinitif: J’aimerais changer de chambre.",
    "Pourriez-vous + infinitif ? لطلب خدمة رسمي.",
    "Serait-il possible de + infinitif ? لصيغة أكثر رسمية."
   ],[
    {fr:"Je voudrais obtenir un rendez-vous cette semaine.",ar:"أود الحصول على موعد هذا الأسبوع."},
    {fr:"Pourriez-vous vérifier cette réservation ?",ar:"هل يمكنكم التحقق من هذا الحجز؟"},
    {fr:"Serait-il possible de payer par carte ?",ar:"هل يمكن الدفع بالبطاقة؟"}
   ]),
   section("Demander une permission ou un service","طلب الإذن أو الخدمة","اختر الصيغة حسب العلاقة: الحاضر مناسب للمواقف اليومية، والشرط ألطف، أما الأمر فيحتاج إلى عبارة تهذيب حتى لا يبدو حادًا.",[
    "Est-ce que je peux + infinitif ? لطلب إذن عادي.",
    "Vous pouvez + infinitif ? لطلب يومي؛ Pourriez-vous… ? ألطف وأكثر رسمية.",
    "Ça vous dérange si + présent ? للسؤال عن الإزعاج أو الاعتراض.",
    "الأمر المهذب: Veuillez patienter؛ Attendez ici, s’il vous plaît."
   ],[
    {fr:"Est-ce que je peux laisser mes bagages ici ?",ar:"هل يمكنني ترك حقائبي هنا؟"},
    {fr:"Ça vous dérange si j’ouvre la fenêtre ?",ar:"هل يزعجكم أن أفتح النافذة؟"},
    {fr:"Veuillez remplir ce formulaire, s’il vous plaît.",ar:"يرجى تعبئة هذه الاستمارة."}
   ]),
   section("Donner un conseil","تقديم النصيحة","قدّم النصيحة بوصفها اقتراحًا قابلًا للاختيار. devoir في الشرط وعبارات الرأي ألطف من الأمر أو devoir في الحاضر.",[
    "Tu devrais / Vous devriez + infinitif.",
    "À ta/votre place, je + conditionnel.",
    "Vous feriez mieux de + infinitif لتوصية أقوى نسبيًا.",
    "Je vous conseille de / Je te recommande de + infinitif."
   ],[
    {fr:"Vous devriez comparer les prix avant de réserver.",ar:"ينبغي أن تقارنوا الأسعار قبل الحجز."},
    {fr:"À ta place, je parlerais directement au responsable.",ar:"لو كنت مكانك لتحدثت مباشرة مع المسؤول."},
    {fr:"Je vous conseille d’arriver vingt minutes plus tôt.",ar:"أنصحكم بالوصول قبل الموعد بعشرين دقيقة."}
   ]),
   section("Obligation, interdiction et permission","الإلزام والمنع والإذن","ميّز بين نصيحة يمكن تجاهلها وقاعدة يجب اتباعها. يُحدَّد الفاعل مع devoir، بينما il faut يعبّر عن ضرورة عامة.",[
    "الالتزام المحدد: Vous devez présenter votre billet.",
    "الضرورة العامة: Il faut réserver؛ Il est nécessaire de confirmer.",
    "المنع: Vous ne devez pas…؛ Il ne faut pas…؛ Il est interdit de…",
    "الإذن: Vous pouvez entrer؛ Il est permis de prendre des photos."
   ],[
    {fr:"Les visiteurs doivent garder leur billet.",ar:"يجب على الزوار الاحتفاظ بتذكرتهم."},
    {fr:"Il est interdit de fumer dans le bâtiment.",ar:"يُمنع التدخين داخل المبنى."},
    {fr:"Vous pouvez utiliser cette salle jusqu’à dix-huit heures.",ar:"يمكنكم استخدام هذه القاعة حتى الساعة السادسة مساءً."}
   ]),
   section("Faire une suggestion","تقديم اقتراح","اجعل الاقتراح جماعيًا ومفتوحًا للنقاش. لكل صيغة درجة مختلفة قليلًا، لكن جميعها مناسبة في الحديث اليومي.",[
    "On pourrait + infinitif: On pourrait partir plus tôt.",
    "Et si on + imparfait ? مثل: Et si on prenait le train ?",
    "Pourquoi ne pas + infinitif ? مثل: Pourquoi ne pas appeler ?",
    "On peut aussi… / Je propose de… لإضافة خيار عملي."
   ],[
    {fr:"On pourrait reporter la réunion à jeudi.",ar:"يمكننا تأجيل الاجتماع إلى يوم الخميس."},
    {fr:"Et si on demandait une chambre plus calme ?",ar:"ما رأيكم أن نطلب غرفة أكثر هدوءًا؟"},
    {fr:"Pourquoi ne pas partager un taxi ?",ar:"لماذا لا نتشارك سيارة أجرة؟"}
   ]),
   section("Répondre avec tact","الرد بلباقة","لا يكفي أن يكون الطلب صحيحًا؛ يجب أن يكون الرد واضحًا أيضًا. اقبل بأدب، أو ارفض باعتذار وسبب مختصر وبديل إن أمكن.",[
    "القبول: Bien sûr؛ Avec plaisir؛ Oui, volontiers؛ Pas de problème.",
    "قبول مشروط: Oui, mais seulement après quinze heures.",
    "الرفض: Je suis désolé, ce ne sera pas possible؛ Je crains de ne pas pouvoir.",
    "البديل: En revanche, je pourrais vous aider demain."
   ],[
    {fr:"Bien sûr, je vais vous l’envoyer tout de suite.",ar:"بالتأكيد، سأرسله إليكم حالًا."},
    {fr:"Je suis désolée, je ne suis pas disponible ce matin.",ar:"أنا آسفة، لست متاحة هذا الصباح."},
    {fr:"Je ne peux pas mardi ; en revanche, je pourrais venir mercredi.",ar:"لا أستطيع الحضور يوم الثلاثاء، لكن يمكنني الحضور يوم الأربعاء."}
   ])
  ]
 },
 {
  id:"connectors",title:"Relier ses idées",ar:"ربط الأفكار",icon:NotebookTabs,
  description:"اجمع الجمل دون تكرار، ووضّح علاقة السبب والنتيجة والتعارض، ورتّب الأحداث والمعلومات لبناء فقرة مترابطة.",
  sections:[
   section("Qui, que, où et dont","الضمائر النسبية","تربط الضمائر النسبية جملتين حول الاسم نفسه. اختر الضمير بحسب وظيفة الاسم المحذوف في الجملة الثانية.",[
    "qui يكون فاعلًا ويتبعه فعل: la femme qui parle.",
    "que يكون مفعولًا مباشرًا ويتبعه فاعل: le livre que je lis.",
    "où يشير إلى مكان أو زمن: la ville où j’habite؛ le jour où je suis arrivé.",
    "dont يعوض de + nom: le projet dont je parle."
   ],[
    {fr:"Je connais une personne qui peut m’aider.",ar:"أعرف شخصًا يستطيع مساعدتي."},
    {fr:"Voici les photos que nous avons prises hier.",ar:"هذه هي الصور التي التقطناها أمس."},
    {fr:"C’est le quartier où j’ai grandi.",ar:"هذا هو الحي الذي نشأت فيه."}
   ]),
   section("Exprimer la cause","التعبير عن السبب","اختر الرابط بحسب ما يأتي بعده وبحسب موضعه. بعض الروابط يتبعها فعل، وبعضها يتبعها اسم.",[
    "parce que + جملة، وهو جواب طبيعي عن pourquoi.",
    "car + جملة يشرح الفكرة السابقة، ولا يبدأ به الكلام عادة.",
    "comme + جملة سبب في بداية العبارة: Comme il pleut, nous restons ici.",
    "à cause de + اسم لسبب سلبي؛ grâce à + اسم لسبب إيجابي."
   ],[
    {fr:"Nous sommes partis tôt parce que la route était longue.",ar:"غادرنا مبكرًا لأن الطريق كان طويلًا."},
    {fr:"Le vol est retardé à cause du mauvais temps.",ar:"تأخرت الرحلة بسبب سوء الأحوال الجوية."},
    {fr:"Grâce à votre aide, j’ai terminé à l’heure.",ar:"بفضل مساعدتكم أنهيت العمل في الموعد."}
   ]),
   section("Exprimer la conséquence","التعبير عن النتيجة","تأتي النتيجة بعد السبب أو المعلومة الأولى. استخدم رابطًا واضحًا ولا تكرر عدة روابط تؤدي الوظيفة نفسها.",[
    "donc بين السبب والنتيجة: Il pleut, donc je reste ici.",
    "c’est pourquoi تبدأ جملة نتيجة واضحة.",
    "alors شائع في الحديث لسرد نتيجة أو انتقال عملي.",
    "par conséquent أكثر رسمية ويُستعمل غالبًا في الكتابة."
   ],[
    {fr:"Le dernier bus est parti, donc nous prenons un taxi.",ar:"غادرت آخر حافلة، ولذلك سنستقل سيارة أجرة."},
    {fr:"Je n’ai pas reçu le message ; c’est pourquoi je n’ai pas répondu.",ar:"لم أتلقَّ الرسالة، ولذلك لم أرد."},
    {fr:"Le dossier est incomplet ; par conséquent, il faut ajouter ce document.",ar:"الملف غير مكتمل، وبناءً على ذلك يجب إضافة هذا المستند."}
   ]),
   section("Opposition et concession","التعارض والتنازل","اربط فكرتين مختلفتين أو نتيجة تخالف التوقع. بعض الروابط يأتي داخل الجملة، وبعضها يربط جملتين مستقلتين.",[
    "mais للتعارض البسيط؛ en revanche لإبراز جانب مقابل.",
    "pourtant وcependant لنتيجة تخالف المتوقع.",
    "même si + indicatif: Même s’il pleut, nous sortirons.",
    "بينما: alors que أو tandis que للمقارنة بين وضعين."
   ],[
    {fr:"Le logement est petit, mais il est bien situé.",ar:"المسكن صغير، لكن موقعه جيد."},
    {fr:"Il était fatigué ; pourtant, il a terminé son travail.",ar:"كان متعبًا، ومع ذلك أنهى عمله."},
    {fr:"Même si le billet est cher, je vais le réserver.",ar:"سأحجز التذكرة حتى لو كان سعرها مرتفعًا."}
   ]),
   section("Organiser le temps et les étapes","ترتيب الزمن والخطوات","تساعد روابط التسلسل القارئ أو المستمع على متابعة قصة أو تعليمات دون أن يضيع بين الأحداث.",[
    "البداية: d’abord، tout d’abord، au début.",
    "الاستمرار: ensuite، puis، après، pendant ce temps.",
    "التزامن: pendant que؛ والنهاية: enfin، finalement.",
    "لا تبدأ كل جملة بالرابط نفسه؛ اختره وفق العلاقة الزمنية الحقيقية."
   ],[
    {fr:"D’abord, remplissez le formulaire, puis signez-le.",ar:"عبئوا الاستمارة أولًا، ثم وقّعوها."},
    {fr:"Pendant que je préparais le repas, Lina mettait la table.",ar:"بينما كنت أحضّر الطعام، كانت لينا ترتب المائدة."},
    {fr:"Finalement, nous avons trouvé une solution acceptable.",ar:"في النهاية توصلنا إلى حل مقبول."}
   ]),
   section("Ajouter, illustrer et conclure","الإضافة وتقديم المثال والخاتمة","أضف معلومة جديدة أو مثالًا يوضحها، ثم اختم دون إدخال فكرة جديدة. هكذا تتحول الجمل المنفصلة إلى فقرة منظمة.",[
    "الإضافة: aussi، de plus، en plus؛ وتجنب تكرار et كثيرًا.",
    "المثال: par exemple؛ والتوضيح: c’est-à-dire.",
    "التلخيص: en résumé؛ والخاتمة: finalement، pour conclure.",
    "فقرة A2 جيدة: فكرة، سبب أو مثال، نتيجة أو تعارض، ثم خاتمة قصيرة."
   ],[
    {fr:"Le quartier est calme ; de plus, les transports sont pratiques.",ar:"الحي هادئ، كما أن المواصلات فيه عملية."},
    {fr:"On peut pratiquer dehors, par exemple dans le parc.",ar:"يمكننا التمرن في الخارج، مثلًا في الحديقة."},
    {fr:"En résumé, cette activité est utile et facile à organiser.",ar:"باختصار، هذا النشاط مفيد وسهل التنظيم."}
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
 const [revisionWorkshopPanel,setRevisionWorkshopPanel]=useState<RevisionWorkshopPanel>("dictation");
 const [revisionDictationIndex,setRevisionDictationIndex]=useState(0);
 const [revisionDictationText,setRevisionDictationText]=useState("");
 const [revisionDictationChecked,setRevisionDictationChecked]=useState(false);
 const [revisionBuilderIndex,setRevisionBuilderIndex]=useState(0);
 const [revisionBuilderSelection,setRevisionBuilderSelection]=useState<number[]>([]);
 const [revisionBuilderChecked,setRevisionBuilderChecked]=useState(false);
 const [revisionDialogueAnswers,setRevisionDialogueAnswers]=useState<Record<number,number>>({});
 const [revisionWritingText,setRevisionWritingText]=useState("");
 const [isRecording,setIsRecording]=useState(false);
 const [recordingUrl,setRecordingUrl]=useState("");
 const [recordingError,setRecordingError]=useState("");
 const mediaRecorderRef=useRef<MediaRecorder|null>(null);
 const recordingStreamRef=useRef<MediaStream|null>(null);
 const recordingChunksRef=useRef<Blob[]>([]);
 const activeModule=useMemo(()=>level.modules.find(item=>item.id===moduleId)??level.modules[0],[level,moduleId]);
 const isA2Revision=level.id==="A2"&&activeModule.id==="revision";
 const isA2PasseCompose=level.id==="A2"&&activeModule.id==="passe-compose";
 const isA2Imparfait=level.id==="A2"&&activeModule.id==="imparfait";
 const isA2Future=level.id==="A2"&&activeModule.id==="future";
 const isA2Pronouns=level.id==="A2"&&activeModule.id==="pronouns";
 const isA2Quantity=level.id==="A2"&&activeModule.id==="quantity";
 const isA2Comparison=level.id==="A2"&&activeModule.id==="comparison";
 const isA2Politeness=level.id==="A2"&&activeModule.id==="politeness";
 const isA2Connectors=level.id==="A2"&&activeModule.id==="connectors";
 const isEnhancedA2Lesson=isA2Revision||isA2PasseCompose||isA2Imparfait||isA2Future||isA2Pronouns||isA2Quantity||isA2Comparison||isA2Politeness||isA2Connectors;
 const activeA2Reading=isA2Connectors?A2_CONNECTORS_READING:isA2Politeness?A2_POLITENESS_READING:isA2Comparison?A2_COMPARISON_READING:isA2Quantity?A2_QUANTITY_READING:isA2Pronouns?A2_PRONOUNS_READING:isA2Future?A2_FUTURE_READING:isA2Imparfait?A2_IMPARFAIT_READING:isA2PasseCompose?A2_PASSE_COMPOSE_READING:A2_REVISION_READING;
 const activeA2Listening=isA2Connectors?A2_CONNECTORS_LISTENING:isA2Politeness?A2_POLITENESS_LISTENING:isA2Comparison?A2_COMPARISON_LISTENING:isA2Quantity?A2_QUANTITY_LISTENING:isA2Pronouns?A2_PRONOUNS_LISTENING:isA2Future?A2_FUTURE_LISTENING:isA2Imparfait?A2_IMPARFAIT_LISTENING:isA2PasseCompose?A2_PASSE_COMPOSE_LISTENING:A2_REVISION_LISTENING;
 const activeA2Dictation=isA2Connectors?A2_CONNECTORS_DICTATION:isA2Politeness?A2_POLITENESS_DICTATION:isA2Comparison?A2_COMPARISON_DICTATION:isA2Quantity?A2_QUANTITY_DICTATION:isA2Pronouns?A2_PRONOUNS_DICTATION:isA2Future?A2_FUTURE_DICTATION:isA2Imparfait?A2_IMPARFAIT_DICTATION:isA2PasseCompose?A2_PASSE_COMPOSE_DICTATION:A2_REVISION_DICTATION;
 const activeA2Builders=isA2Connectors?A2_CONNECTORS_BUILDERS:isA2Politeness?A2_POLITENESS_BUILDERS:isA2Comparison?A2_COMPARISON_BUILDERS:isA2Quantity?A2_QUANTITY_BUILDERS:isA2Pronouns?A2_PRONOUNS_BUILDERS:isA2Future?A2_FUTURE_BUILDERS:isA2Imparfait?A2_IMPARFAIT_BUILDERS:isA2PasseCompose?A2_PASSE_COMPOSE_BUILDERS:A2_REVISION_BUILDERS;
 const activeA2Dialogues=isA2Connectors?A2_CONNECTORS_DIALOGUES:isA2Politeness?A2_POLITENESS_DIALOGUES:isA2Comparison?A2_COMPARISON_DIALOGUES:isA2Quantity?A2_QUANTITY_DIALOGUES:isA2Pronouns?A2_PRONOUNS_DIALOGUES:isA2Future?A2_FUTURE_DIALOGUES:isA2Imparfait?A2_IMPARFAIT_DIALOGUES:isA2PasseCompose?A2_PASSE_COMPOSE_DIALOGUES:A2_REVISION_DIALOGUES;
 const activeA2WritingModel=isA2Connectors?A2_CONNECTORS_WRITING_MODEL:isA2Politeness?A2_POLITENESS_WRITING_MODEL:isA2Comparison?A2_COMPARISON_WRITING_MODEL:isA2Quantity?A2_QUANTITY_WRITING_MODEL:isA2Pronouns?A2_PRONOUNS_WRITING_MODEL:isA2Future?A2_FUTURE_WRITING_MODEL:isA2Imparfait?A2_IMPARFAIT_WRITING_MODEL:isA2PasseCompose?A2_PASSE_COMPOSE_WRITING_MODEL:A2_REVISION_WRITING_MODEL;
 const activeA2WritingTitle=isA2Connectors?"اكتب فقرة مترابطة":isA2Politeness?"اكتب رسالة طلب ونصيحة":isA2Comparison?"قارن بين خيارين واتخذ قرارًا":isA2Quantity?"اكتب قائمة مشتريات وخطة إعداد":isA2Pronouns?"اكتب رسالة تتجنب فيها التكرار":isA2Future?"اكتب عن خططك القادمة":isA2Imparfait?"اكتب ذكرى من الماضي":isA2PasseCompose?"اكتب عن يوم مضى":"اكتب عن روتينك اليومي";
 const activeA2WritingInstructions=isA2Connectors?"اكتب من 60 إلى 80 كلمة عن نشاط أو موقف مررت به. استخدم ضميرين نسبيين، ورابط سبب، ورابط نتيجة، ورابط تعارض، وثلاثة روابط لترتيب الأحداث.":isA2Politeness?"اكتب من 60 إلى 80 كلمة تنصح فيها صديقًا وتطلب منه معلومة أو مساعدة. استخدم طلبيْن مهذبين، وصيغتي نصيحة، وضرورة أو منعًا، واقتراحًا واحدًا.":isA2Comparison?"اكتب من 60 إلى 80 كلمة تقارن فيها بين مكانين أو خدمتين. استخدم plus وmoins وaussi، ومقارنة كمية أو فعل، وصيغة تفضيل، وظرفًا يحدد الدرجة.":isA2Quantity?"اكتب من 60 إلى 80 كلمة عن مشتريات وجبة أو مناسبة. استخدم أداتَي تجزئة، وتعبيرَي كمية، وصيغة نفي، والضميرين y وen في سياق واضح.":isA2Pronouns?"اكتب من 60 إلى 80 كلمة عن خدمة طلبها منك شخص أو معلومات أرسلتها إليه. استخدم خمسة ضمائر مفعول على الأقل، ومنها ضمير مباشر وغير مباشر، وضميرين معًا، وصيغة نفي.":isA2Future?"اكتب من 60 إلى 80 كلمة عن خططك القادمة. استخدم خمس صيغ مستقبلية على الأقل، واجمع بين المستقبل القريب والبسيط، وأضف نفيًا ومؤشرين زمنيين أو رابطين.":isA2Imparfait?"اكتب من 60 إلى 80 كلمة عن طفولتك أو مكان كنت تعرفه. استخدم خمسة أفعال في الماضي الناقص، ووصفًا، وعادة متكررة، وصيغة نفي.":isA2PasseCompose?"اكتب من 60 إلى 80 كلمة عن يوم أو نزهة انتهت. استخدم خمسة أفعال في الماضي المركب، وفعلًا مع être، وصيغة نفي، ورابطين على الأقل.":"اكتب من 60 إلى 80 كلمة. استخدم خمسة أفعال في الحاضر، وفعلًا ضميريًا، وصيغة نفي، ورابطين على الأقل.";
 const activeA2WritingPlaceholder=isA2Connectors?"Samedi, j’ai participé à…":isA2Politeness?"Bonjour, tu devrais…":isA2Comparison?"J’ai comparé deux…":isA2Quantity?"Demain, je vais au marché…":isA2Pronouns?"Mon ami m’a demandé…":isA2Future?"Le mois prochain, je vais…":isA2Imparfait?"Quand j’étais enfant, j’habitais…":isA2PasseCompose?"Samedi dernier, je me suis levé…":"En général, je me lève…";
 const activeA2SpeakingPrompt=isA2Connectors?"Racontez une activité récente en reliant clairement les étapes. Expliquez une cause, une conséquence et une difficulté qui n’a pas empêché la réussite.":isA2Politeness?"Votre ami vous demande conseil avant un voyage. Donnez-lui deux conseils, proposez une solution et formulez une demande polie.":isA2Comparison?"Comparez deux logements, transports ou services. Présentez leurs avantages et leurs limites, puis expliquez clairement lequel vous préférez.":isA2Quantity?"Présentez les achats nécessaires pour un repas. Précisez les quantités, dites ce que vous avez déjà et indiquez où vous allez acheter le reste.":isA2Pronouns?"Racontez un échange récent avec une personne. Remplacez les noms déjà mentionnés par des pronoms compléments pour éviter les répétitions.":isA2Future?"Présentez vos projets pour les prochaines semaines. Indiquez ce que vous allez faire, ce qui se passera ensuite et une condition possible.":isA2Imparfait?"Décrivez un souvenir de votre enfance. Présentez le lieu, vos habitudes et un événement précis qui s’est produit.":isA2PasseCompose?"Racontez une journée récente. Dites où vous êtes allé, ce que vous avez fait et ce que vous avez aimé ou moins aimé.":"Présentez votre journée habituelle, vos horaires et une activité que vous ne faites jamais. Expliquez pourquoi.";
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
 const revisionDictationItem=activeA2Dictation[revisionDictationIndex];
 const revisionDictationCorrect=revisionDictationChecked&&normalizeExerciseText(revisionDictationText)===normalizeExerciseText(revisionDictationItem.speech);
 const revisionBuilderItem=activeA2Builders[revisionBuilderIndex];
 const revisionBuilderWords=revisionBuilderSelection.map(index=>revisionBuilderItem.tokens[index]);
 const revisionBuilderCorrect=revisionBuilderChecked&&revisionBuilderWords.join(" ")===revisionBuilderItem.answer.join(" ");
 const revisionWordCount=(revisionWritingText.match(/[A-Za-zÀ-ÖØ-öø-ÿŒœ]+(?:['’-][A-Za-zÀ-ÖØ-öø-ÿŒœ]+)*/g)??[]).length;
 const passeComposeVerbCount=(revisionWritingText.match(/\b(?:j['’]ai|tu\s+as|(?:il|elle|on)\s+a|nous\s+avons|vous\s+avez|(?:ils|elles)\s+ont|je\s+(?:me\s+)?suis|tu\s+(?:t['’])?es|(?:il|elle|on)\s+(?:s['’])?est|nous\s+(?:nous\s+)?sommes|vous\s+(?:vous\s+)?êtes|(?:ils|elles)\s+(?:se\s+)?sont)\s+[a-zà-ÿ]+/gi)??[]).length;
 const imparfaitVerbCount=(revisionWritingText.match(/\b[a-zà-ÿ]+(?:ais|ait|ions|iez|aient)\b/gi)??[]).filter(word=>!["mais","jamais","français"].includes(word.toLocaleLowerCase("fr"))).length;
 const futureSimpleVerbCount=(revisionWritingText.match(/\b[a-zà-ÿ]+(?:rai|ras|ra|rons|rez|ront)\b/gi)??[]).length;
 const futureProcheVerbCount=(revisionWritingText.match(/\b(?:je vais|tu vas|(?:il|elle|on) va|nous allons|vous allez|(?:ils|elles) vont)\s+[a-zà-ÿ]+/gi)??[]).length;
 const objectPronounCount=(revisionWritingText.match(/(?:\b(?:me|te|le|la|les|lui|leur|nous|vous)\b|\b[mtl][’'][a-zà-ÿ]+)/gi)??[]).length;
 const revisionWritingChecks=isA2Connectors?[
  {label:"من 60 إلى 80 كلمة",passed:revisionWordCount>=60&&revisionWordCount<=80},
  {label:"ضميران نسبيان مختلفان",passed:[" qui "," que "," où "," dont "].filter(marker=>` ${revisionWritingText.toLocaleLowerCase("fr")} `.includes(marker)).length>=2},
  {label:"سبب ونتيجة",passed:/\b(?:parce que|car|comme|à cause de|grâce à)\b/i.test(revisionWritingText)&&/\b(?:donc|c’est pourquoi|c'est pourquoi|alors|par conséquent)\b/i.test(revisionWritingText)},
  {label:"تعارض أو تنازل",passed:/\b(?:mais|pourtant|cependant|en revanche|même si)\b/i.test(revisionWritingText)},
  {label:"ثلاثة روابط لترتيب الأحداث",passed:["d’abord","tout d’abord","ensuite","puis","après","pendant ce temps","enfin","finalement"].filter(marker=>revisionWritingText.toLocaleLowerCase("fr").includes(marker)).length>=3}
 ]:isA2Politeness?[
  {label:"من 60 إلى 80 كلمة",passed:revisionWordCount>=60&&revisionWordCount<=80},
  {label:"طلبان مهذبان",passed:["je voudrais","j’aimerais","pourrais-tu","pourriez-vous","serait-il possible","est-ce que tu pourrais","est-ce que vous pourriez"].filter(marker=>revisionWritingText.toLocaleLowerCase("fr").includes(marker)).length>=2},
  {label:"صيغتان للنصيحة",passed:["tu devrais","vous devriez","à ta place","à votre place","ferais mieux","feriez mieux","je te conseille","je vous conseille"].filter(marker=>revisionWritingText.toLocaleLowerCase("fr").includes(marker)).length>=2},
  {label:"ضرورة أو منع",passed:/\b(?:il faut|il ne faut pas|tu dois|vous devez|interdit de|nécessaire de)\b/i.test(revisionWritingText)},
  {label:"اقتراح واحد",passed:/\b(?:on pourrait|et si on|pourquoi ne pas|je propose de)\b/i.test(revisionWritingText)}
 ]:isA2Comparison?[
  {label:"من 60 إلى 80 كلمة",passed:revisionWordCount>=60&&revisionWordCount<=80},
  {label:"مقارنة بـ plus وmoins",passed:/\bplus\b/i.test(revisionWritingText)&&/\bmoins\b/i.test(revisionWritingText)},
  {label:"مقارنة مساواة بـ aussi أو autant",passed:/\b(?:aussi|autant)\b/i.test(revisionWritingText)},
  {label:"صيغة تفضيل واحدة",passed:/\b(?:le|la|les)\s+(?:plus|moins|meilleur|meilleure|meilleurs|meilleures)\b/i.test(revisionWritingText)},
  {label:"ظرف لتحديد الدرجة",passed:/\b(?:très|assez|trop|vraiment|plutôt|nettement|beaucoup|un peu)\b/i.test(revisionWritingText)}
 ]:isA2Quantity?[
  {label:"من 60 إلى 80 كلمة",passed:revisionWordCount>=60&&revisionWordCount<=80},
  {label:"أداتا تجزئة مختلفتان",passed:["du ","de la ","de l’","de l'","des "].filter(marker=>revisionWritingText.toLocaleLowerCase("fr").includes(marker)).length>=2},
  {label:"تعبيران عن الكمية",passed:["beaucoup de","un peu de","assez de","trop de","un kilo de","une bouteille de","deux ","trois ","quatre "].filter(marker=>revisionWritingText.toLocaleLowerCase("fr").includes(marker)).length>=2},
  {label:"استعمال صحيح لـ y وen",passed:/\by\b/i.test(revisionWritingText)&&/(?:\ben\b|\b[’']en\b)/i.test(revisionWritingText)},
  {label:"صيغة نفي واحدة على الأقل",passed:/\bne\s+|\bn[’'][a-zà-ÿ]+\s+(?:pas|jamais|plus|rien|personne)\b/i.test(revisionWritingText)}
 ]:isA2Pronouns?[
  {label:"من 60 إلى 80 كلمة",passed:revisionWordCount>=60&&revisionWordCount<=80},
  {label:"خمسة ضمائر مفعول على الأقل",passed:objectPronounCount>=5},
  {label:"ضمير مباشر: le أو la أو les",passed:/(?:\b(?:le|la|les)\b|\bl[’'][a-zà-ÿ]+)/i.test(revisionWritingText)},
  {label:"ضمير غير مباشر: lui أو leur",passed:/\b(?:lui|leur)\b/i.test(revisionWritingText)},
  {label:"ضميران متتاليان وصيغة نفي",passed:/(?:\b(?:me|te|nous|vous)\s+(?:le|la|les)\b|\b(?:le|la|les)\s+(?:lui|leur)\b)/i.test(revisionWritingText)&&/\bne\s+|\bn[’'][a-zà-ÿ]+\s+(?:pas|jamais|plus|rien|personne)\b/i.test(revisionWritingText)}
 ]:isA2Future?[
  {label:"من 60 إلى 80 كلمة",passed:revisionWordCount>=60&&revisionWordCount<=80},
  {label:"خمس صيغ مستقبلية على الأقل",passed:futureSimpleVerbCount+futureProcheVerbCount>=5},
  {label:"المستقبل القريب والبسيط معًا",passed:futureSimpleVerbCount>0&&futureProcheVerbCount>0},
  {label:"صيغة نفي واحدة على الأقل",passed:/\bne\s+|\bn[’'][a-zà-ÿ]+\s+(?:pas|jamais|plus|rien|personne)\b/i.test(revisionWritingText)},
  {label:"مؤشران زمنيان أو رابطان",passed:["demain","bientôt","la semaine prochaine","le mois prochain","dans","d’abord","puis","ensuite","enfin","si","quand","alors"].filter(marker=>revisionWritingText.toLocaleLowerCase("fr").includes(marker)).length>=2}
 ]:isA2Imparfait?[
  {label:"من 60 إلى 80 كلمة",passed:revisionWordCount>=60&&revisionWordCount<=80},
  {label:"خمسة أفعال في الماضي الناقص",passed:imparfaitVerbCount>=5},
  {label:"وصف أو حالة في الماضي",passed:/\b(?:était|étaient|avait|avaient|faisait|semblait|sembl[a-zà-ÿ]*aient)\b/i.test(revisionWritingText)},
  {label:"علامة على عادة متكررة",passed:["souvent","toujours","d’habitude","d'habitude","chaque","tous les","toutes les","avant"].some(marker=>revisionWritingText.toLocaleLowerCase("fr").includes(marker))},
  {label:"صيغة نفي واحدة على الأقل",passed:/\bne\s+|\bn[’'][a-zà-ÿ]+\s+(?:pas|jamais|plus|rien|personne)\b/i.test(revisionWritingText)}
 ]:isA2PasseCompose?[
  {label:"من 60 إلى 80 كلمة",passed:revisionWordCount>=60&&revisionWordCount<=80},
  {label:"خمسة أفعال في الماضي المركب",passed:passeComposeVerbCount>=5},
  {label:"فعل واحد على الأقل مع être",passed:/\b(?:je\s+(?:me\s+)?suis|tu\s+(?:t['’])?es|(?:il|elle|on)\s+(?:s['’])?est|nous\s+(?:nous\s+)?sommes|vous\s+(?:vous\s+)?êtes|(?:ils|elles)\s+(?:se\s+)?sont)\s+[a-zà-ÿ]+/i.test(revisionWritingText)},
  {label:"صيغة نفي واحدة على الأقل",passed:/\bne\s+|\bn[’'][a-zà-ÿ]+\s+(?:pas|jamais|plus|rien|personne)\b/i.test(revisionWritingText)},
  {label:"رابطان مختلفان على الأقل",passed:["d’abord","puis","ensuite","enfin","parce que","donc","mais","alors"].filter(link=>revisionWritingText.toLocaleLowerCase("fr").includes(link)).length>=2}
 ]:[
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
 if(level.id==="A2"&&activeModule.id==="passe-compose")return A2_PASSE_COMPOSE_PRACTICE_ITEMS.map(item=>({...item,speech:[item.fr]}));
 if(level.id==="A2"&&activeModule.id==="imparfait")return A2_IMPARFAIT_PRACTICE_ITEMS.map(item=>({...item,speech:[item.fr]}));
  if(level.id==="A2"&&activeModule.id==="future")return A2_FUTURE_PRACTICE_ITEMS.map(item=>({...item,speech:[item.fr]}));
  if(level.id==="A2"&&activeModule.id==="pronouns")return A2_PRONOUNS_PRACTICE_ITEMS.map(item=>({...item,speech:[item.fr]}));
  if(level.id==="A2"&&activeModule.id==="quantity")return A2_QUANTITY_PRACTICE_ITEMS.map(item=>({...item,speech:[item.fr]}));
  if(level.id==="A2"&&activeModule.id==="comparison")return A2_COMPARISON_PRACTICE_ITEMS.map(item=>({...item,speech:[item.fr]}));
  if(level.id==="A2"&&activeModule.id==="politeness")return A2_POLITENESS_PRACTICE_ITEMS.map(item=>({...item,speech:[item.fr]}));
  if(level.id==="A2"&&activeModule.id==="connectors")return A2_CONNECTORS_PRACTICE_ITEMS.map(item=>({...item,speech:[item.fr]}));
  return activeModule.sections.flatMap(item=>item.examples).slice(0,6).map(item=>({...item,speech:[item.fr]}));
 },[activeModule,level.id]);

 const quizQuestions=useMemo<QuizQuestion[]>(()=>{
  if(level.id==="A2"&&activeModule.id==="revision")return A2_REVISION_QUIZ_ITEMS;
  if(level.id==="A2"&&activeModule.id==="passe-compose")return A2_PASSE_COMPOSE_QUIZ_ITEMS;
  if(level.id==="A2"&&activeModule.id==="imparfait")return A2_IMPARFAIT_QUIZ_ITEMS;
  if(level.id==="A2"&&activeModule.id==="future")return A2_FUTURE_QUIZ_ITEMS;
  if(level.id==="A2"&&activeModule.id==="pronouns")return A2_PRONOUNS_QUIZ_ITEMS;
  if(level.id==="A2"&&activeModule.id==="quantity")return A2_QUANTITY_QUIZ_ITEMS;
  if(level.id==="A2"&&activeModule.id==="comparison")return A2_COMPARISON_QUIZ_ITEMS;
  if(level.id==="A2"&&activeModule.id==="politeness")return A2_POLITENESS_QUIZ_ITEMS;
  if(level.id==="A2"&&activeModule.id==="connectors")return A2_CONNECTORS_QUIZ_ITEMS;
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
  setRevisionWorkshopPanel("dictation");
  setRevisionDictationIndex(0);
  setRevisionDictationText("");
  setRevisionDictationChecked(false);
  setRevisionBuilderIndex(0);
  setRevisionBuilderSelection([]);
  setRevisionBuilderChecked(false);
  setRevisionDialogueAnswers({});
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
     <button className={lessonStage==="test"?"active":""} onClick={()=>setLessonStage("test")}><ListChecks/><span><b>{isEnhancedA2Lesson?"التمرين النهائي":"اختبر نفسك"}</b><small>{isEnhancedA2Lesson?"10 أسئلة ونتيجة":"أسئلة قصيرة"}</small></span></button>
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
    {isEnhancedA2Lesson&&<section className="a2-reading-workshop">
     <div className="university-stage-heading"><BookOpen/><div><span>Lire et comprendre</span><h3>قراءة موجهة</h3><p>اقرأ النص أولًا دون ترجمة، ثم أجب عن الأسئلة واكشف الحل بعد المحاولة.</p></div></div>
     <article className="a2-reading-text">
      <header><div><small>Texte A2</small><h4>{activeA2Reading.title}</h4><span>{activeA2Reading.arTitle}</span></div><button onClick={()=>void speakFrench(activeA2Reading.text,{rate:.76})}><Volume2/> استمع إلى النص</button></header>
      <p dir="ltr">{activeA2Reading.text}</p>
      <details><summary>عرض الترجمة بعد المحاولة</summary><p>{activeA2Reading.translation}</p></details>
     </article>
     <div className="a2-reading-questions">
      {activeA2Reading.questions.map((item,index)=><article key={item.question}><span>{index+1}</span><div><strong dir="ltr">{item.question}</strong><details><summary>تحقق من إجابتك</summary><p dir="ltr">{item.answer}</p><small>{item.ar}</small></details></div><button onClick={()=>void speakFrench(item.question,{rate:.76})} aria-label={`استمع إلى السؤال ${index+1}`}><Volume2/></button></article>)}
     </div>
    </section>}
    </>}

    {lessonStage==="practice"&&<section className="university-practice-stage">
     <div className="university-stage-heading"><Headphones/><div><span>Écouter et répéter</span><h3>استمع ثم كرّر</h3><p>استمع إلى الفرنسية، كرّرها بصوت مرتفع، واقرأ المعنى العربي عند الحاجة.</p></div></div>
     {isEnhancedA2Lesson&&<section className="a2-listening-lab">
      <header><div><span>Compréhension orale</span><h3>اختبار استماع بنص مخفي</h3><p>استمع مرتين، ثم أجب دون قراءة النص. يمكنك كشف النص بعد إنهاء المحاولة.</p></div><button onClick={()=>void speakFrench(activeA2Listening.text,{rate:.72})}><Headphones/> تشغيل المقطع الفرنسي</button></header>
      <div className="a2-listening-questions">
       {activeA2Listening.questions.map((question,index)=>{
        const selected=revisionListeningAnswers[index];
        return <article key={question.prompt}>
         <div><i>{index+1}</i><strong dir="ltr">{question.prompt}</strong><button onClick={()=>void speakFrench(question.prompt,{rate:.74})} aria-label={`استمع إلى سؤال الاستماع ${index+1}`}><Volume2/></button></div>
         <div className="a2-listening-choices" dir="ltr">{question.choices.map((choice,choiceIndex)=><button key={choice} className={selected===choiceIndex?(choiceIndex===question.correctIndex?"correct":"wrong"):""} onClick={()=>setRevisionListeningAnswers(current=>({...current,[index]:choiceIndex}))}><span>{String.fromCharCode(65+choiceIndex)}</span>{choice}</button>)}</div>
         {typeof selected==="number"&&<small className={selected===question.correctIndex?"correct":"wrong"}>{selected===question.correctIndex?"إجابة صحيحة":"حاول مرة أخرى واستمع إلى المقطع"}</small>}
        </article>;
       })}
      </div>
      <details className="a2-listening-transcript"><summary>إظهار النص الفرنسي بعد المحاولة</summary><h4>{activeA2Listening.title}</h4><p dir="ltr">{activeA2Listening.text}</p></details>
     </section>}
     {isEnhancedA2Lesson&&<section className="a2-interactive-workshop">
      <header><span>Atelier interactif</span><h3>مختبر التطبيق</h3><p>ثلاثة أنشطة قصيرة تنقل القاعدة من الفهم إلى الاستخدام.</p></header>
      <nav aria-label="أنشطة مختبر التطبيق">
       <button className={revisionWorkshopPanel==="dictation"?"active":""} onClick={()=>setRevisionWorkshopPanel("dictation")}><Headphones/><span><strong>إملاء صوتي</strong><small>Écouter et écrire</small></span></button>
       <button className={revisionWorkshopPanel==="builder"?"active":""} onClick={()=>setRevisionWorkshopPanel("builder")}><NotebookTabs/><span><strong>بناء الجملة</strong><small>Construire</small></span></button>
       <button className={revisionWorkshopPanel==="dialogue"?"active":""} onClick={()=>setRevisionWorkshopPanel("dialogue")}><MessageCircle/><span><strong>حوار تفاعلي</strong><small>Réagir</small></span></button>
      </nav>
      {revisionWorkshopPanel==="dictation"&&<article className="a2-dictation-panel">
       <div className="a2-workshop-progress"><span>الجملة {revisionDictationIndex+1} من {activeA2Dictation.length}</span><i><b style={{width:`${(revisionDictationIndex+1)/activeA2Dictation.length*100}%`}}/></i></div>
       <h4>استمع ثم اكتب الجملة الفرنسية</h4><p>يمكنك إعادة الصوت، ولا تظهر الجملة المكتوبة إلا بعد التحقق.</p>
       <button className="a2-workshop-audio" onClick={()=>void speakFrench(revisionDictationItem.speech,{rate:.7})}><Volume2/> استمع إلى الجملة</button>
       <input dir="ltr" value={revisionDictationText} onChange={event=>{setRevisionDictationText(event.target.value);setRevisionDictationChecked(false)}} placeholder="Écrivez la phrase ici…" aria-label="اكتب الجملة الفرنسية التي سمعتها"/>
       <div className="a2-workshop-actions"><button onClick={()=>setRevisionDictationChecked(true)} disabled={!revisionDictationText.trim()}><CheckCircle2/> تحقق</button>{revisionDictationIndex<activeA2Dictation.length-1&&<button className="secondary" onClick={()=>{setRevisionDictationIndex(index=>index+1);setRevisionDictationText("");setRevisionDictationChecked(false)}}>الجملة التالية <ChevronLeft/></button>}</div>
       {revisionDictationChecked&&<div className={`a2-workshop-feedback ${revisionDictationCorrect?"correct":"wrong"}`}><strong>{revisionDictationCorrect?"ممتاز، كتبتها بصورة صحيحة.":"راجع كتابتك وقارنها بالنموذج."}</strong><p dir="ltr">{revisionDictationItem.speech}</p><small>{revisionDictationItem.ar}</small></div>}
      </article>}
      {revisionWorkshopPanel==="builder"&&<article className="a2-builder-panel">
       <div className="a2-workshop-progress"><span>الجملة {revisionBuilderIndex+1} من {activeA2Builders.length}</span><i><b style={{width:`${(revisionBuilderIndex+1)/activeA2Builders.length*100}%`}}/></i></div>
       <h4>رتّب الكلمات لتكوين جملة صحيحة</h4><p>{revisionBuilderItem.ar}</p>
       <div className="a2-built-sentence" dir="ltr">{revisionBuilderWords.length?revisionBuilderSelection.map((tokenIndex,position)=><button key={`${tokenIndex}-${position}`} onClick={()=>{setRevisionBuilderSelection(current=>current.filter((_,itemIndex)=>itemIndex!==position));setRevisionBuilderChecked(false)}}>{revisionBuilderItem.tokens[tokenIndex]}</button>):<span>اضغط على الكلمات بالترتيب…</span>}</div>
       <div className="a2-word-bank" dir="ltr">{revisionBuilderItem.tokens.map((token,index)=><button key={`${token}-${index}`} disabled={revisionBuilderSelection.includes(index)} onClick={()=>{setRevisionBuilderSelection(current=>[...current,index]);setRevisionBuilderChecked(false)}}>{token}</button>)}</div>
       <div className="a2-workshop-actions"><button onClick={()=>setRevisionBuilderChecked(true)} disabled={revisionBuilderSelection.length!==revisionBuilderItem.tokens.length}><CheckCircle2/> تحقق</button><button className="secondary" onClick={()=>{setRevisionBuilderSelection([]);setRevisionBuilderChecked(false)}}><RotateCcw/> ابدأ من جديد</button>{revisionBuilderIndex<activeA2Builders.length-1&&<button className="secondary" onClick={()=>{setRevisionBuilderIndex(index=>index+1);setRevisionBuilderSelection([]);setRevisionBuilderChecked(false)}}>الجملة التالية <ChevronLeft/></button>}</div>
       {revisionBuilderChecked&&<div className={`a2-workshop-feedback ${revisionBuilderCorrect?"correct":"wrong"}`}><strong>{revisionBuilderCorrect?"ترتيب صحيح.":"الترتيب يحتاج إلى مراجعة."}</strong>{!revisionBuilderCorrect&&<p dir="ltr">{revisionBuilderItem.answer.join(" ")}</p>}</div>}
      </article>}
      {revisionWorkshopPanel==="dialogue"&&<div className="a2-dialogue-panel">
       {activeA2Dialogues.map((dialogue,index)=>{const selected=revisionDialogueAnswers[index];return <article key={dialogue.context}><div className="a2-dialogue-context"><i>{index+1}</i><div><strong dir="ltr">{dialogue.context}</strong><span>{dialogue.prompt}</span></div><button onClick={()=>void speakFrench(dialogue.context.replace(/^.*?«|»$/g,""),{rate:.72})} aria-label={`استمع إلى الموقف ${index+1}`}><Volume2/></button></div><div className="a2-dialogue-choices" dir="ltr">{dialogue.choices.map((choice,choiceIndex)=><button key={choice} className={selected===choiceIndex?(choiceIndex===dialogue.correctIndex?"correct":"wrong"):""} onClick={()=>setRevisionDialogueAnswers(current=>({...current,[index]:choiceIndex}))}><span>{String.fromCharCode(65+choiceIndex)}</span>{choice}</button>)}</div>{typeof selected==="number"&&<p className={selected===dialogue.correctIndex?"correct":"wrong"}><strong>{selected===dialogue.correctIndex?"اختيار مناسب.":"هذا الرد لا يناسب الموقف."}</strong> {dialogue.feedback}</p>}</article>})}
      </div>}
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
     {isEnhancedA2Lesson&&<div className="a2-production-grid">
      <article className="a2-writing-task"><span>Production écrite</span><h4>{activeA2WritingTitle}</h4><p>{activeA2WritingInstructions}</p><textarea dir="ltr" value={revisionWritingText} onChange={event=>setRevisionWritingText(event.target.value)} aria-label="مساحة الكتابة الفرنسية" placeholder={activeA2WritingPlaceholder} rows={7}/><div className={`a2-word-count ${revisionWordCount>=60&&revisionWordCount<=80?"ready":""}`}><strong>{revisionWordCount}</strong><span>كلمة من 60–80</span></div><ul className="a2-writing-checks">{revisionWritingChecks.map(item=><li key={item.label} className={item.passed?"passed":""}><CheckCircle2/>{item.label}</li>)}</ul><details className="a2-model-answer"><summary>عرض نموذج بعد إنهاء كتابتك</summary><p dir="ltr">{activeA2WritingModel}</p></details></article>
      <article className="a2-speaking-task"><span>Production orale</span><h4>تحدث لمدة 45 إلى 60 ثانية</h4><p dir="ltr">{activeA2SpeakingPrompt}</p><button onClick={()=>void speakFrench(activeA2SpeakingPrompt,{rate:.74})}><Volume2/> استمع إلى المهمة</button><ul>{isA2Connectors?<><li>رتّب البداية والوسط والنهاية.</li><li>اربط السبب بالنتيجة بوضوح.</li><li>اذكر صعوبة ثم نتيجة مخالفة لها.</li></>:isA2Politeness?<><li>ابدأ بفهم المشكلة أو الحاجة.</li><li>قدّم نصيحتين واقتراحًا عمليًا.</li><li>اختم بطلب مهذب واضح.</li></>:isA2Comparison?<><li>حدّد الخيارين ومعايير المقارنة.</li><li>استخدم الزيادة والنقصان والتساوي.</li><li>اختم بالأفضل وسبب اختيارك.</li></>:isA2Quantity?<><li>اذكر المنتجات ومقاديرها بوضوح.</li><li>استعمل en مع اسم سبق ذكره.</li><li>استعمل y للإشارة إلى المكان.</li></>:isA2Pronouns?<><li>اذكر الاسم أولًا ثم استبدله بضمير.</li><li>استخدم ضميرًا مباشرًا وآخر غير مباشر.</li><li>أدخل جملة فيها ضميران معًا.</li></>:isA2Future?<><li>حدّد موعد خططك القادمة.</li><li>استخدم المستقبل القريب والبسيط.</li><li>اذكر توقعًا أو شرطًا ممكنًا.</li></>:isA2Imparfait?<><li>ابدأ بوصف المكان والوقت.</li><li>اذكر عادة قديمة بالماضي الناقص.</li><li>اختم بحدث محدد في الماضي المركب.</li></>:isA2PasseCompose?<><li>حدد متى وأين وقع الحدث.</li><li>استخدم d’abord، puis، enfin.</li><li>اذكر النتيجة أو انطباعك في النهاية.</li></>:<><li>ابدأ بـ En général.</li><li>استخدم d’abord، puis، enfin.</li><li>اختم برأيك أو السبب.</li></>}</ul><div className="a2-recorder"><div>{!isRecording?<button onClick={()=>void startRevisionRecording()}><Mic2/> ابدأ التسجيل</button>:<button className="recording" onClick={stopRevisionRecording}><Square/> أوقف التسجيل</button>}{recordingUrl&&<button className="delete" onClick={deleteRevisionRecording}><Trash2/> احذف التسجيل</button>}</div>{isRecording&&<p><i/> التسجيل جارٍ الآن… تحدث بالفرنسية.</p>}{recordingUrl&&<audio src={recordingUrl} controls aria-label="تشغيل تسجيلك الفرنسي"/>}{recordingError&&<small className="error">{recordingError}</small>}</div></article>
     </div>}
     <button className="university-stage-next" onClick={()=>setLessonStage("test")}><ListChecks/> {isEnhancedA2Lesson?"الانتقال إلى التمرين النهائي":"الانتقال إلى الاختبار"} <ChevronLeft/></button>
    </section>}

    {lessonStage==="test"&&<section className="university-test-stage">
     <div className="university-stage-heading"><ListChecks/><div><span>Exercice final</span><h3>{isEnhancedA2Lesson?"التمرين النهائي":"اختبار الدرس"}</h3><p>عشرة أسئلة مختلفة من هذا الدرس. تظهر النتيجة بعد إجابة السؤال الأخير.</p></div></div>
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
      <span>{isEnhancedA2Lesson?"نتيجة التمرين النهائي":"نتيجة الاختبار"}</span>
      <strong dir="ltr">{quizScore} <small>/ {quizQuestions.length}</small></strong>
      <h3>{quizScore===10?"ممتاز، جميع إجاباتك صحيحة!":quizScore>=7?(isEnhancedA2Lesson?"أحسنت، اجتزت التمرين النهائي.":"أحسنت، اجتزت اختبار الدرس."):"راجع الدرس ثم أعد المحاولة."}</h3>
      <p>أجبت عن {quizScore} أسئلة صحيحة، و{quizQuestions.length-quizScore} أسئلة غير صحيحة.</p>
      {isEnhancedA2Lesson&&quizScore<quizQuestions.length&&<section className="a2-quiz-review"><header><ListChecks/><div><span>Révision ciblée</span><h4>راجع إجاباتك غير الصحيحة</h4></div></header>{quizQuestions.map((question,index)=>quizAnswers[index]!==question.correctIndex?<article key={question.prompt}><i>{index+1}</i><div><strong dir="ltr">{question.prompt}</strong><p className="chosen"><span>إجابتك</span><b>{question.choices[quizAnswers[index]]}</b></p><p className="correct"><span>الإجابة الصحيحة</span><b>{question.choices[question.correctIndex]}</b></p><small>{question.explanation}</small></div><button onClick={()=>void speakFrench(question.speech??question.prompt,{rate:.74})} aria-label={`استمع إلى السؤال ${index+1}`}><Volume2/></button></article>:null)}</section>}
      <button onClick={resetQuiz}><RotateCcw/> {isEnhancedA2Lesson?"أعد التمرين":"أعد الاختبار"}</button>
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
