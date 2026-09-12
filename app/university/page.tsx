"use client";

import Link from "next/link";
import {useRouter} from "next/navigation";
import {useEffect,useLayoutEffect,useMemo,useRef,useState,type CSSProperties} from "react";
import type {LucideIcon} from "lucide-react";
import {
 Activity,ArrowRight,AudioLines,BadgeCheck,Blocks,BookOpen,Building2,CalendarClock,CalendarDays,CaseUpper,CheckCircle2,
 ChevronDown,ChevronLeft,ChevronRight,CircleHelp,CircleMinus,ClipboardPenLine,Clock3,CloudSun,Coffee,Earth,EyeOff,FastForward,Gauge,
 GraduationCap,Hand,HandHeart,Headphones,History,House,Languages,Layers3,LibraryBig,Link2,ListChecks,MapPin,MapPinned,
 MessageCircle,MessagesSquare,Mic2,Navigation,NotebookTabs,Orbit,Play,RefreshCw,Repeat2,Replace,Rocket,RotateCcw,
 Scale,School,ScrollText,ShoppingBag,ShoppingBasket,SlidersHorizontal,Speech,Sparkles,Square,Stethoscope,
 Tags,Telescope,Trash2,Trophy,UserRoundCog,Users,UsersRound,Volume2,WandSparkles
} from "lucide-react";
import {cancelFrenchSpeech,speakFrench,speakFrenchSequence,speakFrenchWithPause} from "@/lib/frenchSpeech";
import {
 DESCRIPTION_PRACTICE_ITEMS,DESCRIPTION_QUIZ_ITEMS,EMOTION_VOCABULARY,FAMILY_VOCABULARY,
 PHYSICAL_STATE_VOCABULARY,type VisualVocabularyItem
} from "./description-data";
import {
 ADJECTIVE_PRACTICE_ITEMS,ADJECTIVE_QUIZ_ITEMS,APPEARANCE_ADJECTIVES,HAIR_EYES_ADJECTIVES,
 PERSONALITY_ADJECTIVES
} from "./adjectives-data";
import "./university-future.css";

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
type QuizQuestion={prompt:string;choices:string[];correctIndex:number;instruction?:string;translation?:string;speech?:string;explanation?:string};
type DescriptionPanel="family"|"physical"|"emotions";
type AdjectivePanel="appearance"|"hairEyes"|"personality";
type RevisionWorkshopPanel="dictation"|"builder"|"dialogue";
type UniversityPageProps={initialLevelId?:string;initialModuleId?:string;levelPage?:boolean;lessonPage?:boolean};
type SoundLearningExample={word:string;ar:string;ipa:string;phoneme:string;focus:string;parts:[string,string,string];image:string;rule:string};
type SoundLearningGroup={fr:string;ar:string;note:string;frNote:string;examples:SoundLearningExample[]};
type SoundLearningSection={fr:string;ar:string;intro:string;frIntro:string;groups:SoundLearningGroup[]};
type VowelTableKind="oral"|"nasal"|"rounded"|"unrounded"|"closed"|"mid"|"open"|"semij"|"semiw"|"semiu";
type VowelTableExample={word:string;ar:string;ipa:string;phoneme:string;focus:string;parts:[string,string,string];image:string;explanation:string};
type VowelClassificationBranch={fr:string;ar:string;explanation:string;frExplanation:string;table?:VowelTableKind};
type VowelClassification={fr:string;ar:string;explanation:string;frExplanation:string;branches:VowelClassificationBranch[]};
const DESCRIPTION_VISUAL_PAGE_SIZE=8;
const ADJECTIVE_VISUAL_PAGE_SIZE=8;
const ALPHABET_PRACTICE_STEPS=["الاستماع","الإملاء الصوتي","بناء الجملة","الحوار التفاعلي","جمل مفيدة","اكتب"];
const ALPHABET_PRACTICE_ICONS=[Headphones,AudioLines,Blocks,MessagesSquare,ScrollText,ClipboardPenLine];
const ALPHABET_PRACTICE_ORIGINS=[["50%","0%"],["100%","20%"],["100%","80%"],["50%","100%"],["0%","80%"],["0%","20%"]];
const ALPHABET_LISTENING_CLIPS=[
 {letter:"A",word:"ami",ar:"صديق"},{letter:"B",word:"bateau",ar:"قارب"},{letter:"C",word:"café",ar:"مقهى"},{letter:"D",word:"dimanche",ar:"الأحد"},{letter:"E",word:"école",ar:"مدرسة"}
];
const A1_SOUNDS_LISTENING_CLIPS=[
 {letter:"/œ̃/",word:"un",ar:"واحد",hiddenSpeech:"un"},
 {letter:"/i/",word:"lit",ar:"سرير",hiddenSpeech:"i"},
 {letter:"/y/",word:"lune",ar:"قمر",hiddenSpeech:"u"},
 {letter:"/ɛ̃/",word:"pain",ar:"خبز",hiddenSpeech:"ain"},
 {letter:"/ø/",word:"feu",ar:"نار",hiddenSpeech:"eu"},
 {letter:"/u/",word:"rouge",ar:"أحمر",hiddenSpeech:"ou"},
 {letter:"/ɥ/",word:"huit",ar:"ثمانية",hiddenSpeech:"hui"},
 {letter:"/o/",word:"zéro",ar:"صفر",hiddenSpeech:"o"},
 {letter:"/u/",word:"tout",ar:"كلّ",hiddenSpeech:"ou"},
 {letter:"/ɛ/",word:"père",ar:"أب",hiddenSpeech:"è"},
 {letter:"/a/",word:"chat",ar:"قط",hiddenSpeech:"a"},
 {letter:"/j/",word:"pied",ar:"قدم",hiddenSpeech:"yé"},
 {letter:"/w/",word:"oui",ar:"نعم",hiddenSpeech:"oua"},
 {letter:"/o/",word:"bateau",ar:"قارب",hiddenSpeech:"eau"},
 {letter:"/ɲ/",word:"agneau",ar:"خروف صغير",hiddenSpeech:"gne"},
 {letter:"/e/",word:"parlez",ar:"تحدّثوا",hiddenSpeech:"é"},
 {letter:"/ɑ̃/",word:"grand",ar:"كبير",hiddenSpeech:"an"}
];
const A1_COUNTRIES_LISTENING_CLIPS=[
 {letter:"France",word:"français",ar:"فرنسا — فرنسي",hiddenSpeech:"France"},
 {letter:"Maroc",word:"marocaine",ar:"المغرب — مغربية",hiddenSpeech:"Maroc"},
 {letter:"Japon",word:"japonais",ar:"اليابان — ياباني",hiddenSpeech:"Japon"},
 {letter:"Arabie saoudite",word:"saoudienne",ar:"السعودية — سعودية",hiddenSpeech:"Arabie saoudite"},
 {letter:"États-Unis",word:"américain",ar:"الولايات المتحدة — أمريكي",hiddenSpeech:"États-Unis"}
];
const A1_STUDIES_LISTENING_CLIPS=[
 {letter:"professeur",word:"école",ar:"معلّم — مدرسة",hiddenSpeech:"professeur"},
 {letter:"médecin",word:"hôpital",ar:"طبيب — مستشفى",hiddenSpeech:"médecin"},
 {letter:"cuisinier",word:"restaurant",ar:"طاهٍ — مطعم",hiddenSpeech:"cuisinier"},
 {letter:"vendeuse",word:"magasin",ar:"بائعة — متجر",hiddenSpeech:"vendeuse"},
 {letter:"étudiante",word:"université",ar:"طالبة — جامعة",hiddenSpeech:"étudiante"}
];
const A1_TASTES_LISTENING_CLIPS=[
 {letter:"J’aime",word:"lire",ar:"أحب القراءة",hiddenSpeech:"J’aime lire"},
 {letter:"J’adore",word:"voyager",ar:"أعشق السفر",hiddenSpeech:"J’adore voyager"},
 {letter:"Je préfère",word:"le thé",ar:"أفضل الشاي",hiddenSpeech:"Je préfère le thé"},
 {letter:"Je n’aime pas",word:"courir",ar:"لا أحب الجري",hiddenSpeech:"Je n’aime pas courir"},
 {letter:"Je déteste",word:"le bruit",ar:"أكره الضوضاء",hiddenSpeech:"Je déteste le bruit"}
];

const A1_VOWEL_CLASSIFICATIONS:VowelClassification[]=[
 {
  fr:"Voyelles orales et nasales",ar:"الأصوات الفموية والأنفية",
  explanation:"تُصنَّف من حيث مخرج الهواء أثناء النطق: فموي أو أنفي.",
  frExplanation:"Elles se distinguent selon le passage de l’air pendant la prononciation : par la bouche ou par la bouche et le nez.",
  branches:[
   {fr:"Voyelles orales",ar:"الأصوات الفموية",explanation:"يخرج الهواء أثناء النطق من الفم فقط.",frExplanation:"Pendant la prononciation, l’air sort uniquement par la bouche.",table:"oral"},
   {fr:"Voyelles nasales",ar:"الأصوات الأنفية",explanation:"يمر الهواء أثناء النطق من الفم والأنف معًا.",frExplanation:"Pendant la prononciation, l’air passe à la fois par la bouche et par le nez.",table:"nasal"}
  ]
 },
 {
  fr:"Voyelles arrondies et non arrondies",ar:"الأصوات المتحركة المدورة والمبسوطة",
  explanation:"تُصنَّف بحسب وضع الشفتين وحركتهما عند النطق.",
  frExplanation:"Elles se distinguent selon la position et le mouvement des lèvres pendant la prononciation.",
  branches:[
   {fr:"Voyelles arrondies",ar:"الأصوات المدورة",explanation:"تُنطق بضم الشفتين وتدويرهما إلى الأمام.",frExplanation:"Elles se prononcent avec les lèvres arrondies et projetées vers l’avant.",table:"rounded"},
   {fr:"Voyelles non arrondies",ar:"الأصوات غير المدورة — المبسوطة",explanation:"تُنطق مع بسط الشفتين في وضع قريب من الابتسامة.",frExplanation:"Elles se prononcent avec les lèvres étirées, dans une position proche du sourire.",table:"unrounded"}
  ]
 },
 {
  fr:"Selon le degré d’ouverture de la bouche",ar:"من حيث درجة فتح الفم",
  explanation:"تُصنَّف الأصوات بحسب ارتفاع اللسان ودرجة انفتاح الفم أثناء النطق.",
  frExplanation:"Les voyelles se classent selon la hauteur de la langue et le degré d’ouverture de la bouche.",
  branches:[
   {fr:"Voyelles fermées",ar:"أصوات مغلقة",explanation:"يكون اللسان قريبًا من سقف الفم، ويكون الفم شبه مغلق.",frExplanation:"La langue est proche du palais et la bouche est presque fermée.",table:"closed"},
   {fr:"Voyelles moyennes",ar:"أصوات متوسطة",explanation:"يكون الفم مفتوحًا بدرجة متوسطة، وتنقسم إلى متوسطة مغلقة ومتوسطة مفتوحة.",frExplanation:"La bouche est moyennement ouverte ; ces voyelles se divisent en mi-fermées et mi-ouvertes.",table:"mid"},
   {fr:"Voyelles ouvertes",ar:"أصوات مفتوحة",explanation:"ينخفض اللسان إلى الأسفل، ويكون الفم مفتوحًا بدرجة كبيرة.",frExplanation:"La langue s’abaisse et la bouche est largement ouverte.",table:"open"}
  ]
 },
 {
  fr:"Les semi-voyelles",ar:"أشباه حروف العلة",
  explanation:"تقع بين حروف العلة والحروف الساكنة؛ وأصلها أصوات عِلّة تُنطق بسرعة فتتحول إلى صوت قريب من الياء أو الواو.",
  frExplanation:"Elles se situent entre les voyelles et les consonnes : ce sont à l’origine des voyelles prononcées rapidement, proches du son de y ou de w.",
  branches:[
   {fr:"Le son /j/ — Y",ar:"صوت الياء /j/",explanation:"صوت قريب من الياء، كما في كلمة yeux.",frExplanation:"Un son proche du y, comme dans le mot « yeux ».",table:"semij"},
   {fr:"Le son /w/ — W",ar:"صوت الواو /w/",explanation:"صوت قريب من الواو، كما في كلمة oui.",frExplanation:"Un son proche du w, comme dans le mot « oui ».",table:"semiw"},
   {fr:"Le son /ɥ/ — U",ar:"صوت الواو الأمامية الخفيفة /ɥ/",explanation:"صوت فرنسي بين الياء والواو المدورة، كما في كلمة huit.",frExplanation:"Un son français produit avec les lèvres arrondies, comme dans le mot « huit ».",table:"semiu"}
  ]
 }
];

const A1_ORAL_VOWEL_EXAMPLES:VowelTableExample[]=[
 {word:"lit",ar:"سرير",ipa:"/li/",phoneme:"/i/",focus:"i",parts:["l","i","t"],image:"/images/university/a1-sounds/lit.webp",explanation:"الحرف i يعطي الصوت الفموي الصافي /i/، ولا يُنطق الحرف t في آخر الكلمة."},
 {word:"lune",ar:"قمر",ipa:"/lyn/",phoneme:"/y/",focus:"u",parts:["l","u","ne"],image:"/images/university/a1-sounds/lune.webp",explanation:"الحرف u يعطي /y/: اللسان في وضع /i/ تقريبًا مع تدوير الشفتين."},
 {word:"rouge",ar:"أحمر",ipa:"/ʁuʒ/",phoneme:"/u/",focus:"ou",parts:["r","ou","ge"],image:"/images/university/a1-sounds/rouge.webp",explanation:"المجموعة ou تعطي صوتًا واحدًا /u/ مع تدوير الشفتين إلى الأمام."},
 {word:"été",ar:"صيف",ipa:"/e.te/",phoneme:"/e/",focus:"é",parts:["","é","té"],image:"/images/university/a1-sounds/ete.webp",explanation:"الحرف é يُنطق /e/ بصوت مغلق وواضح، ويظهر الصوت نفسه في مقطعي الكلمة."},
 {word:"père",ar:"أب",ipa:"/pɛʁ/",phoneme:"/ɛ/",focus:"è",parts:["p","è","re"],image:"/images/university/a1-sounds/pere.webp",explanation:"الحرف è يعطي الصوت /ɛ/، وهو أكثر انفتاحًا من /e/."},
 {word:"feu",ar:"نار",ipa:"/fø/",phoneme:"/ø/",focus:"eu",parts:["f","eu",""],image:"/images/university/a1-sounds/feu.webp",explanation:"المجموعة eu في هذه الكلمة تعطي /ø/؛ صوت مدوّر مع فتحة فم ضيقة نسبيًا."},
 {word:"cœur",ar:"قلب",ipa:"/kœʁ/",phoneme:"/œ/",focus:"œu",parts:["c","œu","r"],image:"/images/university/a1-sounds/coeur.webp",explanation:"المجموعة œu تعطي /œ/؛ صوت مدوّر وأكثر انفتاحًا من /ø/."},
 {word:"bateau",ar:"قارب",ipa:"/ba.to/",phoneme:"/o/",focus:"eau",parts:["bat","eau",""],image:"/images/university/a1-sounds/bateau.webp",explanation:"المجموعة eau تعطي صوتًا واحدًا /o/، ولا تُنطق حروفها منفصلة."},
 {word:"pomme",ar:"تفاحة",ipa:"/pɔm/",phoneme:"/ɔ/",focus:"o",parts:["p","o","mme"],image:"/images/university/a1-sounds/pomme.webp",explanation:"الحرف o هنا يعطي /ɔ/، وهو صوت مدوّر وأكثر انفتاحًا من /o/."},
 {word:"chat",ar:"قط",ipa:"/ʃa/",phoneme:"/a/",focus:"a",parts:["ch","a","t"],image:"/images/university/a1-sounds/chat.webp",explanation:"الحرف a يعطي الصوت المفتوح /a/، بينما لا يُنطق الحرف t في النهاية."}
];

const A1_NASAL_VOWEL_EXAMPLES:VowelTableExample[]=[
 {word:"enfant",ar:"طفل",ipa:"/ɑ̃.fɑ̃/",phoneme:"/ɑ̃/",focus:"en · an",parts:["","en","fant"],image:"/images/university/a1-sounds/enfant.webp",explanation:"المجموعتان en وan تعطيان /ɑ̃/ في هذه الكلمة؛ يمر الهواء من الفم والأنف معًا."},
 {word:"gant",ar:"قفاز",ipa:"/ɡɑ̃/",phoneme:"/ɑ̃/",focus:"an",parts:["g","an","t"],image:"/images/university/a1-sounds/gant.webp",explanation:"المجموعة an تعطي /ɑ̃/، ولا يُنطق الحرف t في نهاية الكلمة."},
 {word:"pain",ar:"خبز",ipa:"/pɛ̃/",phoneme:"/ɛ̃/",focus:"ain",parts:["p","ain",""],image:"/images/university/a1-sounds/pain.webp",explanation:"المجموعة ain تعطي الصوت الأنفي /ɛ̃/ كوحدة صوتية واحدة."},
 {word:"lapin",ar:"أرنب",ipa:"/la.pɛ̃/",phoneme:"/ɛ̃/",focus:"in",parts:["lap","in",""],image:"/images/university/a1-sounds/lapin.webp",explanation:"المجموعة in في آخر الكلمة تعطي الصوت الأنفي /ɛ̃/."},
 {word:"pont",ar:"جسر",ipa:"/pɔ̃/",phoneme:"/ɔ̃/",focus:"on",parts:["p","on","t"],image:"/images/university/a1-sounds/pont.webp",explanation:"المجموعة on تعطي /ɔ̃/، ولا يُنطق الحرف t في نهاية الكلمة."},
 {word:"maison",ar:"منزل",ipa:"/mɛ.zɔ̃/",phoneme:"/ɔ̃/",focus:"on",parts:["mais","on",""],image:"/images/university/a1-sounds/maison.webp",explanation:"المجموعة on في المقطع الأخير تعطي الصوت الأنفي /ɔ̃/."},
 {word:"parfum",ar:"عطر",ipa:"/paʁ.fœ̃/",phoneme:"/œ̃/",focus:"um",parts:["parf","um",""],image:"/images/university/a1-sounds/parfum.webp",explanation:"المجموعة um تعطي /œ̃/ في النطق المعياري؛ وقد يقترب هذا الصوت من /ɛ̃/ في نطق فرنسي حديث شائع."},
 {word:"brun",ar:"بني",ipa:"/bʁœ̃/",phoneme:"/œ̃/",focus:"un",parts:["br","un",""],image:"/images/university/a1-sounds/brun.webp",explanation:"المجموعة un تعطي /œ̃/ في النطق المعياري؛ وقد تُنطق قريبة من /ɛ̃/ عند بعض المتحدثين."}
];

const A1_ROUNDED_VOWEL_EXAMPLES:VowelTableExample[]=[
 {...A1_ORAL_VOWEL_EXAMPLES[1],explanation:"في lune تُضم الشفتان وتُدفعان قليلًا إلى الأمام لإنتاج /y/، مع بقاء اللسان في مقدمة الفم."},
 {...A1_ORAL_VOWEL_EXAMPLES[2],explanation:"في rouge تُدوَّر الشفتان بوضوح لإنتاج /u/، بينما يرتفع الجزء الخلفي من اللسان."},
 {...A1_ORAL_VOWEL_EXAMPLES[5],explanation:"في feu تُدوَّر الشفتان لإنتاج /ø/ مع فتحة فم ضيقة نسبيًا."},
 {...A1_ORAL_VOWEL_EXAMPLES[6],explanation:"في cœur تبقى الشفتان مدوّرتين لإنتاج /œ/، لكن الفم يكون أكثر انفتاحًا من /ø/."},
 {...A1_ORAL_VOWEL_EXAMPLES[7],explanation:"في bateau تُدوَّر الشفتان ويكون الصوت /o/ مغلقًا وواضحًا."},
 {...A1_ORAL_VOWEL_EXAMPLES[8],explanation:"في pomme تُدوَّر الشفتان لإنتاج /ɔ/ مع فتحة فم أوسع من /o/."},
 {...A1_NASAL_VOWEL_EXAMPLES[5],explanation:"في maison تُدوَّر الشفتان لإنتاج /ɔ̃/، ويمر الهواء من الفم والأنف معًا."},
 {...A1_NASAL_VOWEL_EXAMPLES[7],explanation:"في brun تُدوَّر الشفتان لإنتاج /œ̃/ الأنفي؛ وقد يقترب من /ɛ̃/ في نطق فرنسي حديث شائع."}
];

const A1_UNROUNDED_VOWEL_EXAMPLES:VowelTableExample[]=[
 {...A1_ORAL_VOWEL_EXAMPLES[0],explanation:"في lit لا تُضم الشفتان؛ تُبسطان قليلًا لإنتاج الصوت الأمامي /i/."},
 {...A1_ORAL_VOWEL_EXAMPLES[3],explanation:"في été تبقى الشفتان غير مدوّرتين، ويُنتج الحرف é الصوت الأمامي المغلق /e/."},
 {...A1_ORAL_VOWEL_EXAMPLES[4],explanation:"في père تُبسط الشفتان دون تدوير لإنتاج /ɛ/، مع فتحة أوسع من /e/."},
 {...A1_ORAL_VOWEL_EXAMPLES[9],explanation:"في chat لا تُدوَّر الشفتان؛ ينفتح الفم بوضوح لإنتاج /a/."},
 {...A1_NASAL_VOWEL_EXAMPLES[0],explanation:"في enfant تبقى الشفتان غير مدوّرتين لإنتاج /ɑ̃/، مع مرور الهواء من الفم والأنف."},
 {...A1_NASAL_VOWEL_EXAMPLES[2],explanation:"في pain تُبسط الشفتان لإنتاج /ɛ̃/ الأنفي، ولا تُنطق حروف ain منفصلة."}
];

const A1_CLOSED_VOWEL_EXAMPLES:VowelTableExample[]=[
 {...A1_ORAL_VOWEL_EXAMPLES[0],explanation:"في lit يرتفع مقدّم اللسان قريبًا من سقف الفم، وتبقى فتحة الفم ضيقة لإنتاج /i/."},
 {...A1_ORAL_VOWEL_EXAMPLES[1],explanation:"في lune يرتفع مقدّم اللسان ويكاد الفم ينغلق، مع تدوير الشفتين لإنتاج /y/."},
 {...A1_ORAL_VOWEL_EXAMPLES[2],explanation:"في rouge يرتفع مؤخر اللسان قريبًا من الحنك، وتُضم الشفتان لإنتاج /u/."}
];

const A1_MID_VOWEL_EXAMPLES:VowelTableExample[]=[
 {...A1_ORAL_VOWEL_EXAMPLES[3],explanation:"في été يكون /e/ متوسطًا مغلقًا: يرتفع اللسان نسبيًا وتبقى الشفتان غير مدوّرتين."},
 {...A1_ORAL_VOWEL_EXAMPLES[5],explanation:"في feu يكون /ø/ متوسطًا مغلقًا، مع تدوير الشفتين وفتحة فم معتدلة تميل إلى الضيق."},
 {...A1_ORAL_VOWEL_EXAMPLES[7],explanation:"في bateau يكون /o/ متوسطًا مغلقًا خلفيًا، مع تدوير الشفتين."},
 {...A1_ORAL_VOWEL_EXAMPLES[4],explanation:"في père يكون /ɛ/ متوسطًا مفتوحًا: ينخفض اللسان قليلًا ويتسع الفم أكثر من /e/."},
 {...A1_ORAL_VOWEL_EXAMPLES[6],explanation:"في cœur يكون /œ/ متوسطًا مفتوحًا، مع تدوير الشفتين واتساع أكبر من /ø/."},
 {...A1_ORAL_VOWEL_EXAMPLES[8],explanation:"في pomme يكون /ɔ/ متوسطًا مفتوحًا خلفيًا، مع تدوير الشفتين واتساع أكبر من /o/."},
 {...A1_NASAL_VOWEL_EXAMPLES[2],explanation:"في pain يكون /ɛ̃/ صوتًا أنفيًا متوسطًا مفتوحًا؛ يمر الهواء من الفم والأنف."},
 {...A1_NASAL_VOWEL_EXAMPLES[5],explanation:"في maison يكون /ɔ̃/ صوتًا أنفيًا متوسطًا مفتوحًا ومدوّرًا."},
 {...A1_NASAL_VOWEL_EXAMPLES[7],explanation:"في brun يمثل /œ̃/ صوتًا أنفيًا متوسطًا مفتوحًا ومدوّرًا في النطق المعياري."}
];

const A1_OPEN_VOWEL_EXAMPLES:VowelTableExample[]=[
 {...A1_ORAL_VOWEL_EXAMPLES[9],explanation:"في chat ينخفض اللسان ويتسع الفم بوضوح لإنتاج الصوت المفتوح /a/."},
 {...A1_NASAL_VOWEL_EXAMPLES[0],explanation:"في enfant ينخفض اللسان ويكون الفم مفتوحًا لإنتاج /ɑ̃/، مع مرور الهواء من الفم والأنف."},
 {...A1_NASAL_VOWEL_EXAMPLES[1],explanation:"في gant تعطي المجموعة an الصوت المفتوح الأنفي /ɑ̃/، ولا يُنطق الحرف t الأخير."}
];

const A1_SEMIVOWEL_J_EXAMPLES:VowelTableExample[]=[
 {word:"pied",ar:"قدم",ipa:"/pje/",phoneme:"/j/",focus:"i",parts:["p","i","ed"],image:"/images/university/a1-sounds/pied.webp",explanation:"في pied ينزلق الصوت /i/ سريعًا نحو /e/ فيتحول إلى شبه حرف العلة /j/، وتُنطق الكلمة مقطعًا واحدًا."},
 {word:"fille",ar:"فتاة",ipa:"/fij/",phoneme:"/j/",focus:"ill",parts:["f","ill","e"],image:"/images/university/a1-sounds/fille.webp",explanation:"في fille تعطي المجموعة ill صوت /j/ بعد /i/؛ لا تُنطق الحروف الثلاثة منفصلة."}
];

const A1_SEMIVOWEL_W_EXAMPLES:VowelTableExample[]=[
 {word:"oiseau",ar:"طائر",ipa:"/wa.zo/",phoneme:"/w/",focus:"oi",parts:["","oi","seau"],image:"/images/university/a1-sounds/oiseau.webp",explanation:"في oiseau تبدأ المجموعة oi بانزلاق /w/ ثم /a/، فتُسمع البداية /wa/."},
 {word:"oui",ar:"نعم",ipa:"/wi/",phoneme:"/w/",focus:"ou",parts:["","ou","i"],image:"/images/university/a1-sounds/oui.webp",explanation:"في oui يتحول /u/ إلى الانزلاق /w/ لأنه يسبق الصوت /i/، وتُنطق الكلمة مقطعًا واحدًا."},
 {word:"voiture",ar:"سيارة",ipa:"/vwa.tyʁ/",phoneme:"/w/",focus:"oi",parts:["v","oi","ture"],image:"/images/university/a1-sounds/voiture.webp",explanation:"في voiture تعطي المجموعة oi البداية /wa/؛ ينتقل النطق سريعًا من /w/ إلى /a/."}
];

const A1_SEMIVOWEL_U_EXAMPLES:VowelTableExample[]=[
 {word:"huit",ar:"ثمانية",ipa:"/ɥit/",phoneme:"/ɥ/",focus:"u",parts:["h","u","it"],image:"/images/university/a1-sounds/huit.webp",explanation:"في huit تُدوَّر الشفتان كما في /y/ ثم ينتقل الصوت سريعًا إلى /i/، فينتج شبه حرف العلة /ɥ/."},
 {word:"pluie",ar:"مطر",ipa:"/plɥi/",phoneme:"/ɥ/",focus:"u",parts:["pl","u","ie"],image:"/images/university/a1-sounds/pluie.webp",explanation:"في pluie يأتي /ɥ/ بين /l/ و/i/؛ حافظ على تدوير الشفتين وانتقل مباشرة إلى /i/."},
 {word:"nuit",ar:"ليل",ipa:"/nɥi/",phoneme:"/ɥ/",focus:"u",parts:["n","u","it"],image:"/images/university/a1-sounds/lune.webp",explanation:"في nuit يتحول /y/ إلى انزلاق قصير /ɥ/ قبل /i/، وتُنطق الكلمة في مقطع واحد."}
];

const A1_VOWEL_TABLES:Record<VowelTableKind,VowelTableExample[]>={oral:A1_ORAL_VOWEL_EXAMPLES,nasal:A1_NASAL_VOWEL_EXAMPLES,rounded:A1_ROUNDED_VOWEL_EXAMPLES,unrounded:A1_UNROUNDED_VOWEL_EXAMPLES,closed:A1_CLOSED_VOWEL_EXAMPLES,mid:A1_MID_VOWEL_EXAMPLES,open:A1_OPEN_VOWEL_EXAMPLES,semij:A1_SEMIVOWEL_J_EXAMPLES,semiw:A1_SEMIVOWEL_W_EXAMPLES,semiu:A1_SEMIVOWEL_U_EXAMPLES};

const A1_SOUNDS_LEARNING_SECTIONS:SoundLearningSection[]=[
 {
  fr:"Les groupes de lettres",ar:"تركيبات الحروف الخاصة",
  intro:"قد تجتمع حروف متعددة لتنتج صوتًا واحدًا، وقد تختفي بعض الحروف في نهاية الكلمة. تعلّم كل تركيب داخل كلمة وصورة.",
  frIntro:"Plusieurs lettres peuvent former un seul son, et certaines lettres finales peuvent rester muettes.",
  groups:[
   {fr:"Combinaisons vocaliques",ar:"تركيبات حروف العلة",note:"تجتمع حروف العلة لتكتب صوتًا واحدًا؛ لا تنطق حروف التركيب منفصلة.",frNote:"Plusieurs voyelles peuvent écrire un seul son : prononcez le groupe comme une unité.",examples:[
    {word:"maison",ar:"منزل",ipa:"/mɛ.zɔ̃/",phoneme:"/ɛ/",focus:"ai",parts:["m","ai","son"],image:"/images/university/a1-sounds/maison.webp",rule:"في maison تعطي المجموعة ai الصوت /ɛ/، ثم تعطي on صوتًا أنفيًا في نهاية الكلمة."},
    {word:"bateau",ar:"قارب",ipa:"/ba.to/",phoneme:"/o/",focus:"eau",parts:["bat","eau",""],image:"/images/university/a1-sounds/bateau.webp",rule:"في bateau تعطي الحروف eau صوتًا واحدًا /o/، ولا تُنطق الحروف الثلاثة منفصلة."},
    {word:"rouge",ar:"أحمر",ipa:"/ʁuʒ/",phoneme:"/u/",focus:"ou",parts:["r","ou","ge"],image:"/images/university/a1-sounds/rouge.webp",rule:"في rouge تعطي المجموعة ou الصوت /u/ مع تدوير الشفتين إلى الأمام."},
    {word:"feu",ar:"نار",ipa:"/fø/",phoneme:"/ø/",focus:"eu",parts:["f","eu",""],image:"/images/university/a1-sounds/feu.webp",rule:"في feu تعطي المجموعة eu الصوت المدوّر /ø/، وتُنطق الكلمة مقطعًا واحدًا."}
   ]},
   {fr:"Combinaisons consonantiques",ar:"تركيبات الحروف الساكنة",note:"قد يكتب حرفان ساكنان صوتًا واحدًا مختلفًا عن نطق كل حرف منفردًا.",frNote:"Deux consonnes peuvent représenter un seul son différent de leur prononciation isolée.",examples:[
    {word:"chat",ar:"قط",ipa:"/ʃa/",phoneme:"/ʃ/",focus:"ch",parts:["","ch","at"],image:"/images/university/a1-sounds/chat.webp",rule:"في chat تعطي المجموعة ch الصوت /ʃ/ المشابه لصوت «ش»، ولا يُنطق الحرف t الأخير."},
    {word:"téléphone",ar:"هاتف",ipa:"/te.le.fɔn/",phoneme:"/f/",focus:"ph",parts:["télé","ph","one"],image:"/police-v39/vocab-phone.webp",rule:"في téléphone تعطي المجموعة ph الصوت /f/، ولا تُنطق p وh كصوتين منفصلين."},
    {word:"agneau",ar:"خروف صغير",ipa:"/a.ɲo/",phoneme:"/ɲ/",focus:"gn",parts:["a","gn","eau"],image:"/zoo/animals/sheep.webp",rule:"في agneau تعطي المجموعة gn الصوت /ɲ/ القريب من «ني»، ثم تعطي eau الصوت /o/."}
   ]},
   {fr:"Terminaisons fréquentes",ar:"النهايات الصوتية الشائعة",note:"تتكرر هذه النهايات كثيرًا، لكن كتابتها لا تطابق دائمًا عدد الأصوات التي نسمعها.",frNote:"Ces terminaisons sont fréquentes, mais leur écriture ne correspond pas toujours aux sons entendus.",examples:[
    {word:"parler",ar:"يتحدث",ipa:"/paʁ.le/",phoneme:"/e/",focus:"er",parts:["parl","er",""],image:"/images/university/a1-sounds/fille.webp",rule:"في مصدر الفعل parler تُنطق النهاية er بالصوت /e/."},
    {word:"parlez",ar:"تحدثوا",ipa:"/paʁ.le/",phoneme:"/e/",focus:"ez",parts:["parl","ez",""],image:"/images/university/a1-sounds/garcon.webp",rule:"في parlez تُنطق النهاية ez بالصوت /e/، ولا يُنطق الحرف z منفصلًا."},
    {word:"billet",ar:"تذكرة",ipa:"/bi.jɛ/",phoneme:"/ɛ/",focus:"et",parts:["bill","et",""],image:"/station-assets/ticket.webp",rule:"في billet تُنطق النهاية et بالصوت /ɛ/، ولا يُنطق الحرف t الأخير."},
    {word:"station",ar:"محطة",ipa:"/sta.sjɔ̃/",phoneme:"/sjɔ̃/",focus:"tion",parts:["sta","tion",""],image:"/kingdom-portal-assets/destination-station.png",rule:"في station تُنطق النهاية tion عادة /sjɔ̃/، وتنتهي بصوت أنفي."}
   ]},
   {fr:"Lettres finales muettes",ar:"الحروف الأخيرة التي لا تُنطق",note:"تُكتب بعض الحروف في نهاية الكلمات الفرنسية لكنها لا تُنطق غالبًا في هذه الأمثلة.",frNote:"Certaines lettres finales s’écrivent, mais ne se prononcent pas dans ces mots.",examples:[
    {word:"chat",ar:"قط",ipa:"/ʃa/",phoneme:"∅",focus:"t",parts:["cha","t",""],image:"/images/university/a1-sounds/chat.webp",rule:"في chat يُكتب الحرف t في النهاية لكنه لا يُنطق."},
    {word:"grand",ar:"كبير",ipa:"/ɡʁɑ̃/",phoneme:"∅",focus:"d",parts:["gran","d",""],image:"/castle-hall-icons/grand-hall.webp",rule:"في grand بصيغة المذكر المفرد لا يُنطق الحرف d الأخير."},
    {word:"nez",ar:"أنف",ipa:"/ne/",phoneme:"∅",focus:"z",parts:["ne","z",""],image:"/images/university/a1-sounds/garcon.webp",rule:"في nez لا يُنطق الحرف z الأخير، وتُنطق الكلمة /ne/."},
    {word:"petit",ar:"صغير",ipa:"/pə.ti/",phoneme:"∅",focus:"t",parts:["peti","t",""],image:"/images/university/a1-sounds/garcon.webp",rule:"في petit بصيغة المذكر المفرد لا يُنطق الحرف t الأخير."}
   ]}
  ]
 }
];

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

function alphabetSpeechSegments(text:string){
 const cleanText=text.replace(/[.!?]+$/g,"").trim();
 const alphabetExample=cleanText.match(/^([A-ZÀ-Ÿ])\s+comme\s+(.+)$/i);
 if(alphabetExample){
  const letter=alphabetExample[1].toLocaleUpperCase("fr");
  const alphabetItem=ALPHABET.find(item=>item[0]===letter);
  return [LETTER_SPEECH_OVERRIDES[letter]??alphabetItem?.[1]??letter.toLocaleLowerCase("fr"),"comme",alphabetExample[2]];
 }
 const words=cleanText.split(/\s+/).filter(Boolean);
 const segments:string[]=[];
 for(let index=0;index<words.length;index+=3)segments.push(words.slice(index,index+3).join(" "));
 return segments;
}

function playAlphabetLearningText(text:string,pauseMs=360){
 return speakFrenchSequence(alphabetSpeechSegments(text),pauseMs,{rate:.62});
}

function alphabetNaturalSpeechText(text:string){
 return text.replace(/(?<!\p{L})[A-Z](?!\p{L})/gu,letter=>{
  const alphabetItem=ALPHABET.find(item=>item[0]===letter);
  return LETTER_SPEECH_OVERRIDES[letter]??alphabetItem?.[1]??letter.toLocaleLowerCase("fr");
 });
}

function playPedagogicalFrench(text:string,slow=false){
 const cleanText=alphabetNaturalSpeechText(text).replace(/\s+/g," ").trim();
 const isQuestion=cleanText.endsWith("?");
 return speakFrench(cleanText,{
  rate:slow?(isQuestion ? .53 : .56):(isQuestion ? .72 : .76),
  pitch:isQuestion?1.04:.98,
  volume:1
 });
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
  id:"alphabet",title:"L’alphabet et les lettres",ar:"الأبجدية والحروف",icon:CaseUpper,
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
  id:"sounds",title:"Les sons et les groupes de lettres",ar:"الأصوات ومجموعات الحروف",icon:AudioLines,
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
  id:"greetings",title:"Saluer et se présenter",ar:"التحية والتعريف بالنفس",icon:Hand,
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
  id:"countries-languages",title:"Les pays, les nationalités et les langues",ar:"البلدان والجنسيات واللغات",icon:Earth,
  description:"ذكر البلد والأصل والجنسية واللغة، مع اختيار حرف الجر والصيغة المذكرة أو المؤنثة بصورة صحيحة.",
  sections:[
   section("Les pays et les prépositions","البلدان وحروف الجر","لكل اسم بلد جنس أو عدد نحوي يؤثر في حرف الجر. نستخدم en غالبًا مع البلد المؤنث أو الذي يبدأ بصوت متحرك، وau مع البلد المذكر، وaux مع البلد الجمع.",[
    "en France، en Arabie saoudite، en Égypte، en Italie.",
    "au Maroc، au Canada، au Japon، au Royaume-Uni.",
    "aux États-Unis، aux Émirats arabes unis.",
    "للتعبير عن الأصل نستعمل de / d’، du أو des: de France، du Maroc، des États-Unis."
   ],[
    {fr:"J’habite en Arabie saoudite.",ar:"أسكن في المملكة العربية السعودية."},
    {fr:"Il travaille au Canada.",ar:"هو يعمل في كندا."},
    {fr:"Nous voyageons aux États-Unis.",ar:"نحن نسافر إلى الولايات المتحدة."},
    {fr:"Elle vient du Maroc.",ar:"هي من المغرب."}
   ]),
   section("Les nationalités","الجنسيات","تُكتب الجنسية بحرف صغير عندما تكون صفة، وتتوافق مع الشخص في التذكير والتأنيث. كثير من الصيغ المؤنثة تُبنى بإضافة e، وقد يتغير شكل الكلمة أو نطقها.",[
    "saoudien → saoudienne، français → française.",
    "marocain → marocaine، égyptien → égyptienne.",
    "japonais → japonaise، espagnol → espagnole.",
    "نستعمل être قبل الجنسية: Je suis saoudien. Elle est française."
   ],[
    {fr:"Je suis saoudienne.",ar:"أنا سعودية."},
    {fr:"Omar est égyptien.",ar:"عمر مصري."},
    {fr:"Lina est marocaine.",ar:"لينا مغربية."},
    {fr:"Kenji est japonais.",ar:"كينجي ياباني."}
   ]),
   section("Parler des langues","التحدث عن اللغات","بعد فعل parler نذكر اللغة عادة من دون أداة، بينما نستعمل أداة التعريف عند الحديث عن تعلم اللغة أو دراستها بوصفها مادة.",[
    "Je parle arabe et français: أتحدث العربية والفرنسية.",
    "Tu parles anglais ? هل تتحدث الإنجليزية؟",
    "J’apprends le français: أتعلم اللغة الفرنسية.",
    "Quelle langue parlez-vous ? ما اللغة التي تتحدثونها؟"
   ],[
    {fr:"Je parle arabe et un peu français.",ar:"أتحدث العربية وقليلًا من الفرنسية."},
    {fr:"Elle apprend le français.",ar:"هي تتعلم اللغة الفرنسية."},
    {fr:"Nous parlons anglais au travail.",ar:"نتحدث الإنجليزية في العمل."},
    {fr:"Quelles langues parlez-vous ?",ar:"ما اللغات التي تتحدثونها؟"}
   ])
  ]
 },
 {
  id:"nouns",title:"Noms, articles et pluriel",ar:"الأسماء وأدوات التعريف والجمع",icon:Tags,
  description:"تمييز المذكر والمؤنث، أدوات التعريف والنكرة، تكوين الجمع، واستعمال صفات الملكية.",
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
   ]),
   section("Les déterminants possessifs","صفات الملكية","تأتي صفة الملكية قبل الاسم وتتوافق مع الشيء المملوك في الجنس والعدد، لا مع جنس صاحبه. ويستعمل mon وton وson قبل الاسم المؤنث الذي يبدأ بصوت متحرك أو h صامت لتسهيل النطق.",[
    "mon، ma، mes للمتكلم المفرد؛ ton، ta، tes للمخاطب المفرد.",
    "son، sa، ses تعني ملكيته أو ملكيتها، ويحدد الاسم المملوك الصيغة المناسبة.",
    "notre / nos، votre / vos، leur / leurs مع بقية الأشخاص.",
    "نقول mon amie وton école وson adresse رغم أن الأسماء مؤنثة."
   ],[
    {fr:"Voici mon livre et ma trousse.",ar:"هذا كتابي وهذه مقلمتي."},
    {fr:"Nora cherche ses clés.",ar:"تبحث نورة عن مفاتيحها."},
    {fr:"Nous visitons notre université.",ar:"نزور جامعتنا."},
    {fr:"Elle parle avec son amie.",ar:"تتحدث مع صديقتها."}
   ])
  ]
 },
 {
  id:"core-verbs",title:"Pronoms, être et avoir",ar:"الضمائر وفعلا être وavoir",icon:UserRoundCog,
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
  id:"structures",title:"Présenter, montrer et situer",ar:"التقديم والإشارة وتحديد المكان",icon:MapPin,
  description:"استخدام C’est وCe sont وIl y a وأدوات الإشارة لتقديم الأشخاص والأشياء والإشارة إليها وتحديد وجودها.",
  sections:[
   section("C’est, ce sont et la négation","التقديم بالمفرد والجمع","نستخدم C’est لتقديم شخص أو شيء مفرد، ونستخدم Ce sont لتقديم أكثر من شخص أو شيء. وفي النفي نقول Ce n’est pas وCe ne sont pas.",[
    "C’est + اسم مفرد: C’est une étudiante.",
    "Ce sont + اسم جمع: Ce sont mes voisins.",
    "Ce n’est pas + اسم مفرد: Ce n’est pas mon sac.",
    "Ce ne sont pas + اسم جمع: Ce ne sont pas mes clés."
   ],[
    {fr:"C’est mon professeur de français.",ar:"هذا معلّم اللغة الفرنسية لديّ."},
    {fr:"Ce sont mes nouveaux voisins.",ar:"هؤلاء جيراني الجدد."},
    {fr:"Ce n’est pas notre salle.",ar:"هذه ليست قاعتنا."},
    {fr:"Ce ne sont pas mes lunettes.",ar:"هذه ليست نظارتي."}
   ]),
   section("Il y a et il n’y a pas","التعبير عن وجود شيء","نستخدم Il y a بمعنى يوجد أو توجد، وهي صيغة ثابتة لا تتغير مع المفرد أو الجمع. بعد النفي نستعمل غالبًا de أو d’ بدل أداة النكرة.",[
    "Il y a + مفرد: Il y a un café ici.",
    "Il y a + جمع: Il y a deux fenêtres.",
    "Il n’y a pas de… للنفي: Il n’y a pas de bus.",
    "Est-ce qu’il y a… ? للسؤال عن وجود شيء."
   ],[
    {fr:"Il y a une pharmacie près d’ici.",ar:"توجد صيدلية بالقرب من هنا."},
    {fr:"Il y a trois livres sur la table.",ar:"توجد ثلاثة كتب على الطاولة."},
    {fr:"Il n’y a pas de gare dans ce village.",ar:"لا توجد محطة قطار في هذه القرية."},
    {fr:"Est-ce qu’il y a un ascenseur dans l’hôtel ?",ar:"هل يوجد مصعد في الفندق؟"}
   ]),
   section("Les déterminants démonstratifs","صفات الإشارة","تأتي صفة الإشارة قبل الاسم وتتوافق معه في الجنس والعدد. نستخدم cet مع الاسم المذكر الذي يبدأ بصوت متحرك أو h صامت.",[
    "ce مع المذكر المفرد: ce livre.",
    "cet مع المذكر قبل صوت متحرك: cet hôtel.",
    "cette مع المؤنث المفرد: cette maison.",
    "ces مع جمع المذكر والمؤنث: ces étudiants، ces voitures."
   ],[
    {fr:"Ce livre est facile.",ar:"هذا الكتاب سهل."},
    {fr:"Cet appartement est lumineux.",ar:"هذه الشقة مضيئة."},
    {fr:"Cette rue est très calme.",ar:"هذا الشارع هادئ جدًا."},
    {fr:"Ces chaussures sont confortables.",ar:"هذه الأحذية مريحة."}
   ])
  ]
 },
 {
  id:"questions",title:"Poser des questions et répondre",ar:"طرح الأسئلة والإجابة عنها",icon:CircleHelp,
  description:"تكوين أسئلة نعم أو لا، استخدام أدوات الاستفهام، واختيار quel وquelle وquels وquelles وفق الاسم.",
  sections:[
   section("Les questions fermées","أسئلة نعم أو لا","يمكن تكوين السؤال البسيط بالنبرة الصاعدة أو بوضع Est-ce que قبل جملة مثبتة. تكون الإجابة نعم أو لا، ويُفضّل إضافة جملة قصيرة توضحها.",[
    "بالنبرة: Vous habitez ici ?",
    "مع Est-ce que: Est-ce que vous habitez ici ?",
    "الإجابة المثبتة: Oui, j’habite ici.",
    "الإجابة المنفية: Non, je n’habite pas ici."
   ],[
    {fr:"Tu parles français ? — Oui, un peu.",ar:"هل تتحدث الفرنسية؟ — نعم، قليلًا."},
    {fr:"Est-ce que vous travaillez aujourd’hui ?",ar:"هل تعملون اليوم؟"},
    {fr:"Oui, nous commençons à neuf heures.",ar:"نعم، نبدأ الساعة التاسعة."},
    {fr:"Non, elle ne prend pas le bus.",ar:"لا، هي لا تستقل الحافلة."}
   ]),
   section("Les mots interrogatifs","أدوات الاستفهام","تحدد أداة الاستفهام نوع المعلومة المطلوبة. ضعها في بداية السؤال، ثم استخدم صيغة بسيطة تناسب مستوى A1.",[
    "qui مَن، que / qu’est-ce que ماذا، où أين.",
    "quand متى، comment كيف، pourquoi لماذا.",
    "combien كم، combien de كم من.",
    "للسبب نجيب غالبًا بـ parce que."
   ],[
    {fr:"Qui est votre professeur ?",ar:"من معلّمكم؟"},
    {fr:"Qu’est-ce que tu fais ce soir ?",ar:"ماذا ستفعل هذا المساء؟"},
    {fr:"Où habite votre famille ?",ar:"أين تسكن عائلتكم؟"},
    {fr:"Pourquoi apprenez-vous le français ?",ar:"لماذا تتعلمون الفرنسية؟"}
   ]),
   section("Quel, quelle, quels et quelles","السؤال عن اختيار أو معلومة","تأتي quel قبل اسم، وتتوافق معه في التذكير والتأنيث والإفراد والجمع. نستخدمها للسؤال عن الاسم أو الوقت أو الاختيار أو النوع.",[
    "quel + مذكر مفرد: Quel jour ?",
    "quelle + مؤنث مفرد: Quelle heure ?",
    "quels + مذكر جمع: Quels sports ?",
    "quelles + مؤنث جمع: Quelles langues ?"
   ],[
    {fr:"Quel est votre nom ?",ar:"ما اسمكم؟"},
    {fr:"Quelle heure est-il ?",ar:"كم الساعة؟"},
    {fr:"Quels sports est-ce que tu pratiques ?",ar:"ما الرياضات التي تمارسها؟"},
    {fr:"Quelles langues parlez-vous ?",ar:"ما اللغات التي تتحدثونها؟"}
   ])
  ]
 },
 {
 id:"present",title:"Le présent et la négation",ar:"المضارع والنفي",icon:Activity,
  description:"فهم المضارع الفرنسي، تصريف أفعال المجموعة الأولى والأفعال الشائعة، ثم بناء الجملة المثبتة والمنفية.",
  sections:[
   section("Introduction au présent","مقدمة المضارع","نستخدم المضارع الفرنسي للحديث عما يحدث الآن، وما يتكرر، والحقائق والحالات المستمرة. يتغير شكل الفعل بحسب ضمير الفاعل، لذلك نتعلم الفعل مع تصريفه داخل جملة كاملة.",[
    "الترتيب الأساسي هو: ضمير الفاعل + فعل مصرّف + مكمّل.",
    "قد يعبّر المضارع عن فعل يقع الآن أو عادة تتكرر كل يوم.",
    "يجب إظهار ضمير الفاعل في الجملة الفرنسية.",
    "بعض النهايات تكتب ولا تنطق؛ لذلك نربط التصريف بالنطق منذ البداية."
   ],[
    {fr:"Je travaille aujourd’hui.",ar:"أنا أعمل اليوم."},
    {fr:"Nous parlons français en classe.",ar:"نتحدث الفرنسية في الفصل."},
    {fr:"Elle habite à Lyon.",ar:"هي تسكن في ليون."}
   ]),
   section("Les verbes du premier groupe","أفعال المجموعة الأولى","تنتهي أفعال المجموعة الأولى في المصدر بـ -er، باستثناء aller. نحذف -er لنحصل على الجذر، ثم نضيف النهاية المناسبة لكل ضمير.",[
    "النهايات هي: -e، -es، -e، -ons، -ez، -ent.",
    "parler: je parle، tu parles، il parle، nous parlons، vous parlez، ils parlent.",
    "النهايات -e و-es و-ent لا تُنطق غالبًا، فتتشابه صيغ كثيرة في السماع.",
    "في manger نكتب nous mangeons، وفي commencer نكتب nous commençons للمحافظة على النطق."
   ],[
    {fr:"J’aime apprendre le français.",ar:"أحب تعلم الفرنسية."},
    {fr:"Tu écoutes le professeur.",ar:"أنت تستمع إلى المعلم."},
    {fr:"Nous mangeons à midi.",ar:"نتناول الطعام عند الظهر."},
    {fr:"Vous commencez le cours.",ar:"تبدؤون الدرس."}
   ]),
   section("Verbes fréquents","أفعال شائعة","بعض الأفعال كثيرة الاستخدام لا تتبع نهايات الأفعال المنتظمة؛ نتعلم تصريفها داخل جمل قصيرة.",[
    "aller: vais, vas, va, allons, allez, vont.",
    "faire: fais, fais, fait, faisons, faites, font.",
    "prendre: prends, prends, prend, prenons, prenez, prennent.",
    "venir: viens, viens, vient, venons, venez, viennent."
   ],[
    {fr:"Je vais au travail en bus.",ar:"أذهب إلى العمل بالحافلة."},
    {fr:"Vous faites du sport le samedi.",ar:"تمارسون الرياضة يوم السبت."},
    {fr:"Elle prend le métro chaque matin.",ar:"تستقل المترو كل صباح."},
    {fr:"Mes amis viennent ce soir.",ar:"سيأتي أصدقائي هذا المساء."}
   ]),
   section("La négation au présent","النفي في المضارع","نضع ne قبل الفعل المصرف وpas بعده. تتحول ne إلى n’ قبل صوت متحرك، وتبقى صيغة الفعل متوافقة مع الفاعل.",[
    "Je parle → Je ne parle pas.",
    "قبل الحركة تصبح ne إلى n’: Je n’habite pas ici.",
    "مع الفعل الضميري يأتي الضمير داخل النفي: Je ne me lève pas tôt.",
    "في الكتابة التعليمية نحتفظ بـ ne حتى لو حُذفت أحيانًا في الكلام اليومي."
   ],[
    {fr:"Je ne comprends pas.",ar:"أنا لا أفهم."},
    {fr:"Elle n’habite pas ici.",ar:"هي لا تسكن هنا."},
    {fr:"Nous ne travaillons pas le vendredi.",ar:"نحن لا نعمل يوم الجمعة."}
   ])
  ]
 },
 {
  id:"studies-professions",title:"Les études et les professions",ar:"الدراسة والمهن",icon:School,
  description:"التحدث عن الدراسة والتخصص والمهنة ومكان العمل بعبارات فرنسية بسيطة وصحيحة.",
  sections:[
   section("Les études","الدراسة والتخصص","نستخدم étudier للحديث عن الدراسة، وêtre étudiant أو étudiante للتعريف بالصفة الدراسية. ويمكن ذكر المؤسسة أو المادة أو التخصص بعبارة قصيرة.",[
    "Je suis étudiant / étudiante: أنا طالب / طالبة.",
    "J’étudie à l’université: أدرس في الجامعة.",
    "J’étudie le français: أدرس اللغة الفرنسية.",
    "faire des études de + مجال: دراسة تخصص معين."
   ],[
    {fr:"Je suis étudiante à l’université.",ar:"أنا طالبة في الجامعة."},
    {fr:"Nous étudions le français.",ar:"نحن ندرس اللغة الفرنسية."},
    {fr:"Il fait des études de médecine.",ar:"هو يدرس الطب."},
    {fr:"Mon cours commence à neuf heures.",ar:"يبدأ درسي الساعة التاسعة."}
   ]),
   section("Les professions","المهن وصيغها","بعد فعل être تُذكر المهنة عادة من دون أداة: Je suis médecin. وتتغير بعض أسماء المهن بين المذكر والمؤنث، بينما تبقى أسماء أخرى بالشكل نفسه.",[
    "un étudiant → une étudiante، un infirmier → une infirmière.",
    "un vendeur → une vendeuse، un cuisinier → une cuisinière.",
    "professeur / professeure صيغتان مستعملتان بحسب الشخص.",
    "نقول Il est médecin، ولا نقول عادة Il est un médecin عند ذكر المهنة وحدها."
   ],[
    {fr:"Elle est professeure.",ar:"هي معلّمة."},
    {fr:"Omar est ingénieur.",ar:"عمر مهندس."},
    {fr:"Lina est infirmière.",ar:"لينا ممرضة."},
    {fr:"Mon frère est cuisinier.",ar:"أخي طاهٍ."}
   ]),
   section("Le lieu de travail","مكان العمل والنشاط","نستخدم travailler à مع مؤسسة محددة، وdans مع نوع المكان، وcomme قبل المهنة عندما نوضح طبيعة العمل.",[
    "travailler à l’hôpital / à l’école: العمل في مؤسسة محددة.",
    "travailler dans un magasin / un restaurant: العمل داخل نوع من الأماكن.",
    "travailler comme + مهنة: العمل بصفة أو مهنة معينة.",
    "Où travaillez-vous ? وما مهنتكم؟ Quel est votre métier ?"
   ],[
    {fr:"Je travaille dans un hôtel.",ar:"أعمل في فندق."},
    {fr:"Elle travaille comme vendeuse.",ar:"تعمل بائعة."},
    {fr:"Il travaille à l’hôpital.",ar:"هو يعمل في المستشفى."},
    {fr:"Quel est votre métier ?",ar:"ما مهنتكم؟"}
   ])
  ]
 },
 {
  id:"tastes-preferences",title:"Exprimer ses goûts et ses préférences",ar:"التعبير عن الأذواق والميول",icon:HandHeart,
  description:"التعبير عن الأشياء والأنشطة التي نحبها أو نفضلها أو لا نحبها، وشرح الاختيار بجملة بسيطة.",
  sections:[
   section("Aimer, adorer et détester","الحب والإعجاب وعدم الإعجاب","نستعمل aimer وadorer وdétester للتعبير عن درجة الميل. يأتي بعدها اسم مع أداته أو فعل في المصدر، ويتغير الفعل بحسب ضمير الفاعل.",[
    "aimer: يحب، adorer: يعشق، détester: يكره.",
    "مع الاسم: J’aime la musique.",
    "مع الفعل في المصدر: J’aime lire.",
    "في النفي نضع ne… pas حول الفعل: Je n’aime pas courir."
   ],[
    {fr:"J’aime la musique française.",ar:"أحب الموسيقى الفرنسية."},
    {fr:"Elle adore voyager.",ar:"هي تعشق السفر."},
    {fr:"Nous n’aimons pas le bruit.",ar:"نحن لا نحب الضوضاء."},
    {fr:"Ils détestent attendre.",ar:"هم يكرهون الانتظار."}
   ]),
   section("Préférer et choisir","التفضيل والاختيار","نستعمل préférer عندما نقارن بين خيارين أو نحدد الخيار الأقرب إلينا. ويمكن استعمال préféré أو préférée قبل الاسم أو بعده حسب التركيب.",[
    "Je préfère le thé au café: أفضل الشاي على القهوة.",
    "Tu préfères lire ou regarder un film ? للسؤال عن خيارين.",
    "Mon sport préféré est le football: رياضتي المفضلة كرة القدم.",
    "préférer يتغير مع الضمير: je préfère، nous préférons، ils préfèrent."
   ],[
    {fr:"Je préfère le thé au café.",ar:"أفضل الشاي على القهوة."},
    {fr:"Tu préfères lire ou regarder un film ?",ar:"هل تفضل القراءة أم مشاهدة فيلم؟"},
    {fr:"Son activité préférée est la natation.",ar:"نشاطها المفضل هو السباحة."},
    {fr:"Nous préférons rester à la maison.",ar:"نحن نفضل البقاء في المنزل."}
   ]),
   section("Donner une raison simple","ذكر سبب بسيط","بعد التعبير عن الذوق يمكن إضافة سبب باستعمال parce que. نستخدم c’est مع اسم أو وصف عام، ونستخدم الفعل المناسب عندما نتحدث عن نشاط.",[
    "parce que تعني لأن وتربط الذوق بالسبب.",
    "J’aime ce livre parce qu’il est intéressant.",
    "Je préfère marcher parce que c’est calme.",
    "للسؤال نقول: Pourquoi est-ce que tu aimes… ?"
   ],[
    {fr:"J’aime ce film parce qu’il est drôle.",ar:"أحب هذا الفيلم لأنه مضحك."},
    {fr:"Elle adore cuisiner parce que c’est créatif.",ar:"هي تعشق الطبخ لأنه نشاط إبداعي."},
    {fr:"Pourquoi est-ce que tu aimes le français ?",ar:"لماذا تحب اللغة الفرنسية؟"},
    {fr:"Je préfère le train parce qu’il est confortable.",ar:"أفضل القطار لأنه مريح."}
   ])
  ]
 },
 {
  id:"modal-verbs",title:"Pouvoir, vouloir et devoir",ar:"القدرة والرغبة والضرورة",icon:Gauge,
  description:"تصريف ثلاثة أفعال أساسية للتعبير عن الاستطاعة والرغبة والواجب، واستخدام il faut للنصيحة والضرورة العامة.",
  sections:[
   section("Pouvoir","الاستطاعة والإذن","يأتي pouvoir قبل فعل في المصدر للتعبير عن القدرة أو الإمكانية، ويُستخدم في السؤال لطلب الإذن أو المساعدة.",[
    "je peux، tu peux، il / elle / on peut.",
    "nous pouvons، vous pouvez، ils / elles peuvent.",
    "pouvoir + مصدر: Je peux venir.",
    "Est-ce que je peux… ? لطلب الإذن."
   ],[
    {fr:"Je peux parler un peu français.",ar:"أستطيع التحدث بالفرنسية قليلًا."},
    {fr:"Est-ce que je peux entrer ?",ar:"هل يمكنني الدخول؟"},
    {fr:"Nous pouvons vous aider.",ar:"يمكننا مساعدتكم."},
    {fr:"Elle ne peut pas venir aujourd’hui.",ar:"لا تستطيع الحضور اليوم."}
   ]),
   section("Vouloir","الرغبة والطلب","يأتي vouloir قبل اسم أو فعل في المصدر للتعبير عن الرغبة. وعند الطلب من شخص آخر يكون Je voudrais ألطف من Je veux.",[
    "je veux، tu veux، il / elle / on veut.",
    "nous voulons، vous voulez، ils / elles veulent.",
    "vouloir + مصدر: Nous voulons partir.",
    "Je voudrais… صيغة مهذبة شائعة للطلب."
   ],[
    {fr:"Je veux apprendre le français.",ar:"أريد تعلم الفرنسية."},
    {fr:"Tu veux prendre un café ?",ar:"هل تريد تناول قهوة؟"},
    {fr:"Ils veulent visiter le musée.",ar:"يريدون زيارة المتحف."},
    {fr:"Je voudrais un billet pour Lyon, s’il vous plaît.",ar:"أرغب في تذكرة إلى ليون، من فضلك."}
   ]),
   section("Devoir et il faut","الواجب والضرورة","نستخدم devoir عندما يرتبط الواجب بشخص محدد، ونستخدم il faut للتعبير عن قاعدة أو ضرورة عامة دون تحديد شخص.",[
    "je dois، tu dois، il / elle / on doit.",
    "nous devons، vous devez، ils / elles doivent.",
    "devoir + مصدر: Vous devez attendre.",
    "Il faut + مصدر، والنفي Il ne faut pas + مصدر."
   ],[
    {fr:"Je dois finir mes devoirs.",ar:"يجب عليّ إنهاء واجباتي."},
    {fr:"Vous devez présenter votre passeport.",ar:"يجب عليكم إبراز جواز سفركم."},
    {fr:"Il faut arriver à l’heure.",ar:"يجب الوصول في الموعد."},
    {fr:"Il ne faut pas fumer ici.",ar:"يُمنع التدخين هنا."}
   ])
  ]
 },
 {
  id:"future-imperative",title:"Le futur proche et l’impératif",ar:"المستقبل القريب وصيغة الأمر",icon:FastForward,
  description:"التحدث عن خطة قريبة باستخدام aller مع المصدر، وإعطاء تعليمات أو نصائح قصيرة بصيغة الأمر المثبتة والمنفية.",
  sections:[
   section("Former le futur proche","تكوين المستقبل القريب","يتكوّن المستقبل القريب من فعل aller مصرّفًا في الحاضر، ثم فعل آخر في المصدر. الذي يتغير مع الفاعل هو aller فقط.",[
    "je vais، tu vas، il / elle / on va + مصدر.",
    "nous allons، vous allez، ils / elles vont + مصدر.",
    "Je vais travailler: سأعمل.",
    "Nous allons partir: سنغادر."
   ],[
    {fr:"Je vais préparer le dîner.",ar:"سأحضّر العشاء."},
    {fr:"Tu vas prendre le bus.",ar:"ستستقل الحافلة."},
    {fr:"Nous allons visiter le château.",ar:"سنزور القلعة."},
    {fr:"Elles vont commencer le cours.",ar:"سيبدأن الدرس."}
   ]),
   section("Le temps et la négation","الزمن والنفي","نستخدم المستقبل القريب مع وقت قريب أو خطة مقررة. في النفي نضع ne وpas حول فعل aller، ويبقى الفعل الثاني في المصدر.",[
    "ce soir، demain، bientôt: هذا المساء، غدًا، قريبًا.",
    "la semaine prochaine: الأسبوع المقبل.",
    "Je ne vais pas sortir: لن أخرج.",
    "Ils ne vont pas venir: لن يأتوا."
   ],[
    {fr:"Ce soir, on va regarder un film.",ar:"سنشاهد فيلمًا هذا المساء."},
    {fr:"Demain, vous allez rencontrer le directeur.",ar:"ستقابلون المدير غدًا."},
    {fr:"Je ne vais pas travailler samedi.",ar:"لن أعمل يوم السبت."},
    {fr:"Ils ne vont pas voyager cette semaine.",ar:"لن يسافروا هذا الأسبوع."}
   ]),
   section("Donner une instruction","إعطاء التعليمات بصيغة الأمر","تُستعمل صيغة الأمر مع tu وnous وvous من دون كتابة ضمير الفاعل. وفي أفعال -er نحذف s من صيغة tu غالبًا.",[
    "tu: Regarde !، Finis !، Attends !",
    "nous: Regardons !، Finissons !، Attendons !",
    "vous: Regardez !، Finissez !، Attendez !",
    "في النفي: Ne parle pas !، N’oubliez pas !"
   ],[
    {fr:"Tournez à droite après la banque.",ar:"انعطفوا يمينًا بعد البنك."},
    {fr:"Prends ton passeport avec toi.",ar:"خذ جواز سفرك معك."},
    {fr:"Allons au marché ensemble.",ar:"لنذهب إلى السوق معًا."},
    {fr:"Ne fermez pas cette porte.",ar:"لا تغلقوا هذا الباب."}
   ])
  ]
 },
 {
  id:"food-shopping",title:"L’alimentation et les achats",ar:"الطعام والتسوق",icon:ShoppingBasket,
  description:"اختيار أدوات التجزئة، التعبير عن الكمية، وطلب الطعام وشراء المنتجات بعبارات بسيطة ومهذبة.",
  sections:[
   section("Du, de la, de l’ et des","أدوات التجزئة","نستخدم أدوات التجزئة عندما نتحدث عن كمية غير محددة من طعام أو شراب. تتغير الأداة بحسب جنس الاسم وبدايته، بينما des تستخدم مع جمع أشياء معدودة.",[
    "du قبل الاسم المذكر: du pain.",
    "de la قبل الاسم المؤنث: de la soupe.",
    "de l’ قبل صوت متحرك: de l’eau، de l’huile.",
    "des قبل الاسم الجمع: des tomates."
   ],[
    {fr:"Je mange du pain au petit-déjeuner.",ar:"أتناول الخبز في الإفطار."},
    {fr:"Elle prépare de la soupe pour le dîner.",ar:"تحضّر الحساء للعشاء."},
    {fr:"Nous buvons de l’eau avec le repas.",ar:"نشرب الماء مع الوجبة."},
    {fr:"Ils achètent des tomates au marché.",ar:"يشترون الطماطم من السوق."}
   ]),
   section("La négation et les quantités","النفي والتعبير عن الكمية","بعد النفي تتحول أداة التجزئة غالبًا إلى de أو d’. وبعد مقدار محدد نستخدم de أيضًا بين المقدار واسم المنتج.",[
    "Je bois du café → Je ne bois pas de café.",
    "قبل صوت متحرك نكتب d’: Je ne bois pas d’eau.",
    "un kilo de، une bouteille de، un verre de.",
    "مع aimer نستخدم أداة المعرفة: J’aime le fromage."
   ],[
    {fr:"Je ne prends pas de sucre.",ar:"لا أتناول السكر."},
    {fr:"Il n’achète pas de viande aujourd’hui.",ar:"لا يشتري اللحم اليوم."},
    {fr:"Je voudrais un kilo de pommes.",ar:"أرغب في كيلوغرام من التفاح."},
    {fr:"Nous avons besoin d’une bouteille d’huile.",ar:"نحتاج إلى زجاجة من الزيت."}
   ]),
   section("Commander et payer","الطلب والدفع","استخدم Je voudrais لطلب شيء بأدب، ثم اسأل عن السعر أو وسيلة الدفع بعبارات قصيرة واضحة.",[
    "Je voudrais… أودّ أو أرغب في…",
    "Vous désirez autre chose ? هل ترغبون في شيء آخر؟",
    "Combien coûte… ? للسؤال عن سعر شيء مفرد.",
    "Je paie par carte / en espèces: أدفع بالبطاقة / نقدًا."
   ],[
    {fr:"Je voudrais un sandwich et un jus d’orange, s’il vous plaît.",ar:"أرغب في شطيرة وعصير برتقال، من فضلك."},
    {fr:"Combien coûte cette baguette ?",ar:"كم سعر خبز الباغيت هذا؟"},
    {fr:"Ça fait huit euros cinquante.",ar:"المجموع ثمانية يورو وخمسون سنتًا."},
    {fr:"Je paie par carte, merci.",ar:"سأدفع بالبطاقة، شكرًا."}
   ])
  ]
 },
 {
  id:"city-directions",title:"Se repérer en ville",ar:"التنقل وتحديد المكان في المدينة",icon:Navigation,
  description:"تحديد الوجهة والموقع، السؤال عن الطريق، وفهم تعليمات الاتجاه الأساسية داخل المدينة.",
  sections:[
   section("À, au, à la et aux","الذهاب إلى مكان","نستخدم à للتعبير عن الوجهة. تندمج à مع le فتصبح au، ومع les فتصبح aux، بينما تبقى à la وà l’ دون دمج.",[
    "à + le = au: Je vais au marché.",
    "à + la = à la: Elle va à la banque.",
    "à + l’ = à l’: Nous allons à l’aéroport.",
    "à + les = aux: Ils vont aux urgences."
   ],[
    {fr:"Je vais au centre-ville en bus.",ar:"أذهب إلى وسط المدينة بالحافلة."},
    {fr:"Elle marche jusqu’à la pharmacie.",ar:"تمشي حتى الصيدلية."},
    {fr:"Nous allons à l’hôtel à pied.",ar:"نذهب إلى الفندق مشيًا."},
    {fr:"Ils vont aux magasins en métro.",ar:"يذهبون إلى المتاجر بالمترو."}
   ]),
   section("De, du, de la et des","القدوم من مكان","نستخدم de للتعبير عن نقطة الانطلاق أو المصدر. تندمج de مع le فتصبح du، ومع les فتصبح des، بينما تبقى de la وde l’ دون دمج.",[
    "de + le = du: Je viens du marché.",
    "de + la = de la: Elle sort de la gare.",
    "de + l’ = de l’: Nous revenons de l’aéroport.",
    "de + les = des: Ils arrivent des magasins."
   ],[
    {fr:"Le bus part du centre-ville.",ar:"تنطلق الحافلة من وسط المدينة."},
    {fr:"Je sors de la bibliothèque.",ar:"أخرج من المكتبة."},
    {fr:"Le taxi arrive de l’aéroport.",ar:"تصل سيارة الأجرة من المطار."},
    {fr:"Nous revenons des urgences.",ar:"نعود من قسم الطوارئ."}
   ]),
   section("Demander et indiquer le chemin","السؤال عن الطريق وإعطاء الاتجاه","ابدأ بسؤال مهذب عن المكان، ثم استخدم أفعالًا واضحة مثل aller وtourner وtraverser وprendre لإعطاء الطريق خطوة خطوة.",[
    "Où se trouve… ? أين يوجد…؟",
    "Pour aller à… ? كيف أصل إلى…؟",
    "Allez tout droit، ثم Tournez à droite / à gauche.",
    "الموقع: devant، derrière، entre، à côté de، en face de."
   ],[
    {fr:"Excusez-moi, où se trouve la gare ?",ar:"عذرًا، أين توجد محطة القطار؟"},
    {fr:"Allez tout droit jusqu’au feu.",ar:"اذهب مباشرة حتى إشارة المرور."},
    {fr:"Tournez à gauche après la banque.",ar:"انعطف يسارًا بعد البنك."},
    {fr:"Le musée est en face du parc.",ar:"يقع المتحف مقابل الحديقة."}
   ])
  ]
 },
 {
  id:"numbers-time",title:"Nombres, heure et date",ar:"الأرقام والوقت والتاريخ",icon:CalendarClock,
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
  id:"weather-clothes",title:"La météo, les saisons et les vêtements",ar:"الطقس والفصول والملابس",icon:CloudSun,
  description:"فهم نشرة جوية بسيطة، تسمية الفصول، واختيار الملابس المناسبة باستخدام عبارات يومية واضحة.",
  sections:[
   section("Parler de la météo","وصف حالة الطقس","نستخدم Quel temps fait-il ؟ للسؤال عن الطقس، ثم نجيب بتراكيب ثابتة مع il fait وil y a، أو بأفعال مثل pleuvoir وneiger.",[
    "Il fait beau / mauvais: الطقس جميل / سيئ.",
    "Il fait chaud / froid: الجو حار / بارد.",
    "Il pleut / Il neige: تمطر / تثلج.",
    "Il y a du vent / des nuages: توجد رياح / غيوم."
   ],[
    {fr:"Quel temps fait-il aujourd’hui ?",ar:"كيف حال الطقس اليوم؟"},
    {fr:"Il fait beau et il y a du soleil.",ar:"الطقس جميل ومشمس."},
    {fr:"Il pleut depuis ce matin.",ar:"تمطر منذ هذا الصباح."},
    {fr:"Il fait dix-huit degrés à Lyon.",ar:"درجة الحرارة ثماني عشرة درجة في ليون."}
   ]),
   section("Les quatre saisons","الفصول الأربعة","أسماء الفصول مذكرة في الفرنسية. نقول au printemps، لكننا نستخدم en مع été وautomne وhiver.",[
    "au printemps: في فصل الربيع.",
    "en été: في فصل الصيف.",
    "en automne: في فصل الخريف.",
    "en hiver: في فصل الشتاء."
   ],[
    {fr:"Au printemps, les jardins sont fleuris.",ar:"في الربيع تكون الحدائق مزهرة."},
    {fr:"En été, les journées sont longues.",ar:"في الصيف تكون الأيام طويلة."},
    {fr:"En automne, il y a souvent du vent.",ar:"في الخريف تهب الرياح كثيرًا."},
    {fr:"En hiver, il neige dans les montagnes.",ar:"في الشتاء تتساقط الثلوج في الجبال."}
   ]),
   section("Choisir ses vêtements","اختيار الملابس","نستخدم porter لوصف الملابس التي يرتديها الشخص، ونستخدم mettre عندما يرتدي قطعة أو يضعها استعدادًا للخروج.",[
    "porter un pantalon / une robe: ارتداء بنطال / فستان.",
    "mettre un manteau: ارتداء معطف.",
    "prendre un parapluie: أخذ مظلة.",
    "اتفاق اللون: un pull noir، une veste noire."
   ],[
    {fr:"Je porte un pantalon bleu et une chemise blanche.",ar:"أرتدي بنطالًا أزرق وقميصًا أبيض."},
    {fr:"Mets ton manteau, il fait froid.",ar:"ارتدِ معطفك، فالجو بارد."},
    {fr:"Elle prend son parapluie parce qu’il pleut.",ar:"تأخذ مظلتها لأن الجو ممطر."},
    {fr:"Ces chaussures sont confortables pour marcher.",ar:"هذه الأحذية مريحة للمشي."}
   ])
  ]
 },
 {
  id:"home-housing",title:"Le logement et la maison",ar:"السكن والمنزل",icon:House,
  description:"تسمية أنواع السكن والغرف والأثاث، وتحديد موضع الأشياء، ووصف المنزل والعنوان بعبارات بسيطة.",
  sections:[
   section("Les types de logement et les pièces","أنواع السكن والغرف","يمكنك تقديم مسكنك بفعل habiter، ثم تسمية الغرف باستخدام Il y a. احفظ كل اسم مع أداته لمعرفة جنسه.",[
    "une maison، un appartement، un studio: منزل، شقة، استوديو.",
    "un salon، une chambre، une cuisine: غرفة جلوس، غرفة نوم، مطبخ.",
    "une salle de bains، un balcon، un jardin.",
    "J’habite dans… أسكن في…، Chez moi… في منزلي…"
   ],[
    {fr:"J’habite dans un appartement calme.",ar:"أسكن في شقة هادئة."},
    {fr:"Notre maison a trois chambres.",ar:"يحتوي منزلنا على ثلاث غرف نوم."},
    {fr:"La cuisine est à côté du salon.",ar:"يقع المطبخ بجوار غرفة الجلوس."},
    {fr:"Il y a un petit balcon devant la chambre.",ar:"توجد شرفة صغيرة أمام غرفة النوم."}
   ]),
   section("Les meubles et leur place","الأثاث ومواقع الأشياء","استخدم Il y a لتذكر الأثاث، ثم أضف حرف مكان لتوضح موضعه. تأتي عبارات المكان غالبًا بعد الشيء الذي نصفه.",[
    "un lit، une armoire، une table، un canapé.",
    "sur فوق، sous تحت، dans داخل.",
    "devant أمام، derrière خلف، entre بين.",
    "à côté de بجوار، en face de مقابل."
   ],[
    {fr:"Le livre est sur la table.",ar:"الكتاب فوق الطاولة."},
    {fr:"Les chaussures sont sous le lit.",ar:"الحذاء تحت السرير."},
    {fr:"L’armoire est en face de la fenêtre.",ar:"تقع الخزانة مقابل النافذة."},
    {fr:"Le canapé est entre les deux fauteuils.",ar:"تقع الأريكة بين المقعدين."}
   ]),
   section("Décrire son logement","وصف المسكن","للوصف البسيط اذكر مكان السكن وحجمه وغرفه وما يعجبك فيه. استخدم être للصفة وavoir أو Il y a لذكر المكونات.",[
    "Mon adresse est… عنواني هو…",
    "J’habite au deuxième étage: أسكن في الطابق الثاني.",
    "L’appartement est grand / petit / lumineux.",
    "Ma pièce préférée est… غرفتي المفضلة هي…"
   ],[
    {fr:"Mon adresse est le douze, rue des Fleurs.",ar:"عنواني هو 12 شارع الزهور."},
    {fr:"J’habite au deuxième étage avec ma famille.",ar:"أسكن في الطابق الثاني مع عائلتي."},
    {fr:"L’appartement est petit, mais lumineux.",ar:"الشقة صغيرة لكنها مضيئة."},
    {fr:"Ma pièce préférée est le salon.",ar:"غرفتي المفضلة هي غرفة الجلوس."}
   ])
  ]
 },
 {
  id:"description",title:"Famille, états et émotions",ar:"العائلة والحالة والمشاعر",icon:UsersRound,
  description:"مفردات العائلة، الحالات الجسدية اليومية، والمشاعر في أقسام مستقلة.",
  sections:[
   section("La famille en contexte","العائلة في سياق","طبّق صفات الملكية التي تعلمتها سابقًا لتقديم أفراد العائلة وذكر صلة القرابة ومكان السكن. الهدف هنا استعمال المفردات داخل جمل قصيرة، لا إعادة شرح قاعدة الملكية.",[
    "قدّم شخصًا بعبارة Voici mon père / ma mère.",
    "اذكر صلة القرابة بوضوح: C’est la sœur de Sami.",
    "استعمل être للوصف وhabiter لمكان السكن.",
    "اربط فردين أو أكثر باستعمال et."
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
  id:"health-needs",title:"La santé et les besoins essentiels",ar:"الصحة والاحتياجات الأساسية",icon:Stethoscope,
  description:"وصف عرض صحي بسيط، تحديد موضع الألم، وفهم الأسئلة والتعليمات الأساسية عند الطبيب أو الصيدلي.",
  sections:[
   section("Dire ce qu’on a","وصف الأعراض","نستخدم avoir مع كثير من الأعراض، ونستخدم être مع الحالة العامة. ولتحديد الألم نقول avoir mal à ثم نختار الأداة الموافقة لعضو الجسم.",[
    "J’ai de la fièvre / de la toux: لدي حمى / سعال.",
    "Je suis malade / fatigué: أنا مريض / متعب.",
    "J’ai mal à la tête، au ventre، au dos.",
    "J’ai mal aux dents: أسناني تؤلمني."
   ],[
    {fr:"J’ai de la fièvre et je suis très fatigué.",ar:"لدي حمى وأشعر بتعب شديد."},
    {fr:"Elle a mal à la gorge.",ar:"تشعر بألم في حلقها."},
    {fr:"Mon fils a mal au ventre.",ar:"يشعر ابني بألم في بطنه."},
    {fr:"J’ai mal aux dents depuis hier.",ar:"أشعر بألم في أسناني منذ أمس."}
   ]),
   section("Chez le médecin et à la pharmacie","عند الطبيب وفي الصيدلية","ابدأ بشرح المشكلة بجملة قصيرة، ثم أجب عن أسئلة الطبيب المتعلقة ببداية العرض والدواء. وفي الصيدلية اطلب ما تحتاجه بأدب.",[
    "Qu’est-ce que vous avez ? ما المشكلة الصحية التي تعانون منها؟",
    "Depuis quand ? منذ متى؟",
    "Je voudrais prendre rendez-vous: أود حجز موعد.",
    "Prenez ce médicament matin et soir: تناولوا هذا الدواء صباحًا ومساءً."
   ],[
    {fr:"Je voudrais prendre rendez-vous avec un médecin.",ar:"أود حجز موعد مع طبيب."},
    {fr:"Depuis quand avez-vous mal à la tête ?",ar:"منذ متى تشعرون بألم في الرأس؟"},
    {fr:"Prenez un comprimé après le repas.",ar:"تناولوا قرصًا واحدًا بعد الوجبة."},
    {fr:"Je cherche une pharmacie ouverte.",ar:"أبحث عن صيدلية مفتوحة."}
   ]),
   section("Demander de l’aide","طلب المساعدة","في الموقف الصحي استخدم عبارة قصيرة ومباشرة، واذكر الشخص الذي يحتاج إلى المساعدة والمشكلة إن استطعت.",[
    "J’ai besoin d’aide: أحتاج إلى مساعدة.",
    "Appelez un médecin / une ambulance.",
    "Où sont les urgences ? أين قسم الطوارئ؟",
    "Je suis allergique à… لدي حساسية تجاه…"
   ],[
    {fr:"Excusez-moi, j’ai besoin d’aide.",ar:"عذرًا، أحتاج إلى مساعدة."},
    {fr:"Appelez une ambulance, s’il vous plaît.",ar:"اتصلوا بسيارة إسعاف، من فضلكم."},
    {fr:"Où se trouve le service des urgences ?",ar:"أين يقع قسم الطوارئ؟"},
    {fr:"Je suis allergique à ce médicament.",ar:"لدي حساسية تجاه هذا الدواء."}
   ])
  ]
 },
 {
  id:"adjectives",title:"Les adjectifs et la description",ar:"الصفات الشخصية والمظهر",icon:WandSparkles,
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
 id:"daily-life",title:"La vie quotidienne",ar:"الحياة اليومية",icon:Repeat2,
  description:"وصف الروتين اليومي، والأفعال الضميرية، وترتيب الأنشطة والتعبير عن تكرارها.",
  sections:[
   section("Les verbes pronominaux","الأفعال الضميرية","تأتي أفعال الروتين كثيرًا مع ضمير يعود على الفاعل: me, te, se, nous, vous, se.",[
    "Je me lève: أستيقظ/أنهض.",
    "Tu te prépares: تستعد.",
    "Nous nous reposons: نستريح.",
    "مع النفي: Je ne me couche pas tard."
   ],[
    {fr:"Je me lève à sept heures.",ar:"أنهض الساعة السابعة."},
    {fr:"Nous nous préparons pour le cours.",ar:"نستعد للدرس."},
    {fr:"Elle se couche tôt.",ar:"تخلد إلى النوم مبكرًا."}
   ]),
   section("Fréquence et activités","التكرار والأنشطة","تساعد ظروف التكرار على وصف العادات. تأتي غالبًا بعد الفعل المصرف، أما jamais فتأتي في النفي مع ne.",[
    "toujours دائمًا، souvent غالبًا، parfois أحيانًا.",
    "rarement نادرًا، ne… jamais أبدًا.",
    "faire du sport، lire، regarder un film.",
    "faire les courses، préparer le repas، ranger la maison."
   ],[
    {fr:"Je vais souvent à la bibliothèque.",ar:"أذهب غالبًا إلى المكتبة."},
    {fr:"Nous faisons du sport le soir.",ar:"نمارس الرياضة مساءً."},
    {fr:"Elle ne regarde jamais la télévision le matin.",ar:"لا تشاهد التلفاز صباحًا أبدًا."}
   ]),
   section("Organiser sa journée","ترتيب أحداث اليوم","استخدم روابط زمنية قصيرة لعرض الأنشطة بترتيب واضح، وأضف وقتًا أو جزءًا من اليوم عند الحاجة.",[
    "d’abord: أولًا، puis / ensuite: ثم، enfin: وأخيرًا.",
    "le matin، l’après-midi، le soir: صباحًا، بعد الظهر، مساءً.",
    "avant le travail / après le cours: قبل العمل / بعد الدرس.",
    "ابدأ بالفعل المصرف: Ensuite, je prends le bus."
   ],[
    {fr:"D’abord, je prends mon petit-déjeuner.",ar:"أولًا، أتناول فطوري."},
    {fr:"Ensuite, je pars au travail.",ar:"ثم أذهب إلى العمل."},
    {fr:"Enfin, je me repose à la maison.",ar:"وأخيرًا، أستريح في المنزل."}
   ])
  ]
 },
 {
 id:"situations",title:"Entre amis",ar:"مواقف مع الأصدقاء",icon:Coffee,
  description:"توجيه الدعوات وقبولها أو الاعتذار عنها، وتنظيم المواعيد والتعبير عن الرأي في حوارات طبيعية مع الأصدقاء.",
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
   section("Accepter, refuser et proposer","القبول والاعتذار واقتراح بديل","أجب بوضوح على الدعوة. عند عدم القدرة على الحضور، اذكر السبب باختصار واقترح موعدًا أو نشاطًا بديلًا.",[
    "Avec plaisir ! / Bonne idée ! للقبول بحماس.",
    "Désolé, je ne peux pas… للاعتذار بلطف.",
    "Je préfère… / On peut plutôt… لاقتراح بديل.",
    "Et dimanche, tu es libre ? للسؤال عن موعد آخر."
   ],[
    {fr:"Avec plaisir ! J’adore ce restaurant.",ar:"بكل سرور! أحب هذا المطعم."},
    {fr:"Désolé, je ne peux pas venir ce soir.",ar:"آسف، لا أستطيع الحضور هذا المساء."},
    {fr:"On peut plutôt se voir dimanche ?",ar:"هل يمكن أن نلتقي يوم الأحد بدلًا من ذلك؟"}
   ]),
   section("Parler et réagir","الحوار والتفاعل","حافظ على حوار طبيعي بالتعبير عن الرأي والموافقة أو الاختلاف والاعتذار وتقديم اقتراح بديل.",[
    "Je pense que… أعتقد أن…",
    "Je suis d’accord: أنا موافق.",
    "Je ne suis pas tout à fait d’accord: لست موافقًا تمامًا.",
    "Désolé, je suis en retard: آسف، أنا متأخر."
   ],[
    {fr:"À mon avis, ce film est très drôle.",ar:"في رأيي، هذا الفيلم مضحك جدًا."},
    {fr:"Moi aussi, je suis d’accord avec toi.",ar:"وأنا أيضًا أتفق معك."},
    {fr:"Je suis désolé, on peut changer l’heure ?",ar:"أنا آسف، هل يمكننا تغيير الوقت؟"}
   ])
  ]
 },
 {
  id:"messages-forms",title:"Messages, formulaires et informations pratiques",ar:"الرسائل والنماذج والمعلومات اليومية",icon:ClipboardPenLine,
  description:"قراءة البيانات واللوحات الشائعة، تعبئة نموذج بسيط، وكتابة رسالة قصيرة واضحة للتحية أو الموعد أو الاعتذار.",
  sections:[
   section("Remplir un formulaire","تعبئة نموذج بسيط","اقرأ اسم كل خانة قبل الكتابة. في الفرنسية يختلف prénom، أي الاسم الأول، عن nom de famille، أي اسم العائلة.",[
    "prénom: الاسم الأول، nom de famille: اسم العائلة.",
    "date de naissance: تاريخ الميلاد، nationalité: الجنسية.",
    "adresse، code postal، ville: العنوان، الرمز البريدي، المدينة.",
    "numéro de téléphone، adresse électronique: رقم الهاتف، البريد الإلكتروني."
   ],[
    {fr:"Mon prénom est Nora et mon nom de famille est Alami.",ar:"اسمي الأول نورة واسم عائلتي العلمي."},
    {fr:"Ma date de naissance est le quinze mars deux mille.",ar:"تاريخ ميلادي هو الخامس عشر من مارس عام 2000."},
    {fr:"J’habite au vingt, rue Victor-Hugo, à Lyon.",ar:"أسكن في 20 شارع فيكتور هوغو في ليون."},
    {fr:"Mon adresse électronique est nora@example.com.",ar:"عنوان بريدي الإلكتروني هو nora@example.com."}
   ]),
   section("Écrire un message court","كتابة رسالة قصيرة","ابدأ بتحية مناسبة، ثم اذكر سبب الرسالة والمعلومة المهمة مثل الوقت أو المكان، واختم بعبارة وداع واسمك.",[
    "Bonjour رسمي أو عام، Salut ودي.",
    "Je vous écris pour… أكتب إليكم من أجل…",
    "Rendez-vous à… موعدنا في…",
    "Merci، À bientôt، Cordialement: شكرًا، إلى لقاء قريب، مع التحية."
   ],[
    {fr:"Bonjour, je confirme notre rendez-vous de demain à dix heures.",ar:"مرحبًا، أؤكد موعدنا غدًا الساعة العاشرة."},
    {fr:"Salut Lina, je suis devant la bibliothèque.",ar:"مرحبًا لينا، أنا أمام المكتبة."},
    {fr:"Désolé, je vais arriver dix minutes en retard.",ar:"آسف، سأتأخر عشر دقائق."},
    {fr:"Merci pour votre message. Cordialement, Sami.",ar:"شكرًا على رسالتكم. مع التحية، سامي."}
   ]),
   section("Comprendre les informations pratiques","فهم المعلومات واللوحات","تعرض اللوحات اليومية كلمات قصيرة عن المكان والوقت والتعليمات. اربط الكلمة بالموقف بدل ترجمتها منفردة فقط.",[
    "entrée / sortie: دخول / خروج.",
    "ouvert / fermé: مفتوح / مغلق.",
    "horaires: أوقات العمل، gratuit: مجاني، complet: مكتمل العدد.",
    "interdit de… ممنوع…، en panne: معطّل."
   ],[
    {fr:"La bibliothèque est ouverte de neuf heures à dix-huit heures.",ar:"المكتبة مفتوحة من التاسعة صباحًا حتى السادسة مساءً."},
    {fr:"Le musée est fermé le lundi.",ar:"المتحف مغلق يوم الاثنين."},
    {fr:"Entrée gratuite pour les enfants.",ar:"الدخول مجاني للأطفال."},
    {fr:"L’ascenseur est en panne.",ar:"المصعد معطّل."}
   ])
  ]
 }
];

// This order is shared by the journey cards and previous/next lesson navigation.
// New A1 modules will be inserted into their reserved pedagogical positions in later batches.
const A1_MODULE_ORDER=[
 "alphabet","sounds","greetings","countries-languages","nouns","core-verbs",
 "present","studies-professions","tastes-preferences","structures","questions","numbers-time","adjectives","modal-verbs","future-imperative",
 "description","home-housing","daily-life","food-shopping","city-directions","weather-clothes",
 "health-needs","situations","messages-forms"
] as const;
const A1_ORDERED_MODULES=A1_MODULE_ORDER
 .map(moduleId=>A1_MODULES.find(module=>module.id===moduleId))
 .filter((module):module is CourseModule=>Boolean(module));

const A1_ALPHABET_PRACTICE_ITEMS:Example[]=[
 {fr:"Comment s’écrit ce mot ?",ar:"كيف تُكتب هذه الكلمة؟"},
 {fr:"Pouvez-vous épeler ce mot, s’il vous plaît ?",ar:"هل يمكنك تهجئة هذه الكلمة، من فضلك؟"},
 {fr:"Tu peux épeler ce mot, s’il te plaît ?",ar:"هل يمكنك تهجئة هذه الكلمة، من فضلك؟"},
 {fr:"Je vais épeler mon prénom.",ar:"سأتهجّى اسمي الأول."},
 {fr:"Mon prénom commence par la lettre N.",ar:"يبدأ اسمي الأول بحرف N."},
 {fr:"Quelle est la première lettre de ce mot ?",ar:"ما الحرف الأول في هذه الكلمة؟"},
 {fr:"La première lettre est A.",ar:"الحرف الأول هو A."},
 {fr:"Quelle lettre vient après le B ?",ar:"ما الحرف الذي يأتي بعد الحرف B؟"},
 {fr:"Quelle lettre vient avant le D ?",ar:"ما الحرف الذي يأتي قبل الحرف D؟"},
 {fr:"Écris ce mot en lettres majuscules.",ar:"اكتب هذه الكلمة بأحرف كبيرة."},
 {fr:"Écris ce mot en lettres minuscules.",ar:"اكتب هذه الكلمة بأحرف صغيرة."},
 {fr:"Répète cette lettre, s’il te plaît.",ar:"كرّر هذا الحرف، من فضلك."},
 {fr:"Il y a vingt-six lettres dans l’alphabet français.",ar:"توجد ستة وعشرون حرفًا في الأبجدية الفرنسية."}
];

const A1_ALPHABET_QUIZ_ITEMS:QuizQuestion[]=[
 {prompt:"Quelle est la première lettre du mot « ami » ?",translation:"ما الحرف الأول في كلمة «ami»؟",instruction:"اختر الإجابة الصحيحة.",choices:["A","E","M"],correctIndex:0,explanation:"تبدأ كلمة ami بالحرف A."},
 {prompt:"Quelle est la première lettre du mot « bateau » ?",translation:"ما الحرف الأول في كلمة «bateau»؟",instruction:"اختر الإجابة الصحيحة.",choices:["D","B","P"],correctIndex:1,explanation:"تبدأ كلمة bateau بالحرف B."},
 {prompt:"Quelle est la première lettre du mot « café » ?",translation:"ما الحرف الأول في كلمة «café»؟",instruction:"اختر الإجابة الصحيحة.",choices:["S","K","C"],correctIndex:2,explanation:"تبدأ كلمة café بالحرف C."},
 {prompt:"Quelle est la première lettre du mot « dimanche » ?",translation:"ما الحرف الأول في كلمة «dimanche»؟",instruction:"اختر الإجابة الصحيحة.",choices:["D","B","T"],correctIndex:0,explanation:"تبدأ كلمة dimanche بالحرف D."},
 {prompt:"Quelle est la première lettre du mot « école » ?",translation:"ما الحرف الأول في كلمة «école»؟",instruction:"اختر الإجابة الصحيحة.",choices:["A","E","L"],correctIndex:1,explanation:"تبدأ كلمة école بالحرف E."},
 {prompt:"Quelle est la première lettre du mot « famille » ?",translation:"ما الحرف الأول في كلمة «famille»؟",instruction:"اختر الإجابة الصحيحة.",choices:["V","P","F"],correctIndex:2,explanation:"تبدأ كلمة famille بالحرف F."},
 {prompt:"Quelle est la première lettre du mot « garçon » ?",translation:"ما الحرف الأول في كلمة «garçon»؟",instruction:"اختر الإجابة الصحيحة.",choices:["G","J","C"],correctIndex:0,explanation:"تبدأ كلمة garçon بالحرف G."},
 {prompt:"Quelle est la première lettre du mot « hôtel » ?",translation:"ما الحرف الأول في كلمة «hôtel»؟",instruction:"اختر الإجابة الصحيحة.",choices:["O","H","A"],correctIndex:1,explanation:"تبدأ كلمة hôtel بالحرف H."},
 {prompt:"Quelle est la première lettre du mot « image » ?",translation:"ما الحرف الأول في كلمة «image»؟",instruction:"اختر الإجابة الصحيحة.",choices:["J","E","I"],correctIndex:2,explanation:"تبدأ كلمة image بالحرف I."},
 {prompt:"Quelle est la première lettre du mot « jardin » ?",translation:"ما الحرف الأول في كلمة «jardin»؟",instruction:"اختر الإجابة الصحيحة.",choices:["J","G","I"],correctIndex:0,explanation:"تبدأ كلمة jardin بالحرف J."},
 {prompt:"Quelle est la première lettre du mot « kilo » ?",translation:"ما الحرف الأول في كلمة «kilo»؟",instruction:"اختر الإجابة الصحيحة.",choices:["Q","K","C"],correctIndex:1,explanation:"تبدأ كلمة kilo بالحرف K."},
 {prompt:"Quelle est la première lettre du mot « livre » ?",translation:"ما الحرف الأول في كلمة «livre»؟",instruction:"اختر الإجابة الصحيحة.",choices:["R","V","L"],correctIndex:2,explanation:"تبدأ كلمة livre بالحرف L."},
 {prompt:"Quelle est la première lettre du mot « maison » ?",translation:"ما الحرف الأول في كلمة «maison»؟",instruction:"اختر الإجابة الصحيحة.",choices:["M","N","L"],correctIndex:0,explanation:"تبدأ كلمة maison بالحرف M."},
 {prompt:"Quelle est la première lettre du mot « nature » ?",translation:"ما الحرف الأول في كلمة «nature»؟",instruction:"اختر الإجابة الصحيحة.",choices:["M","N","R"],correctIndex:1,explanation:"تبدأ كلمة nature بالحرف N."},
 {prompt:"Quel mot commence par la lettre O ?",translation:"أي كلمة تبدأ بالحرف O؟",instruction:"اختر الإجابة الصحيحة.",choices:["ami","école","orange"],correctIndex:2,explanation:"تبدأ كلمة orange بالحرف O."},
 {prompt:"Quel mot commence par la lettre V ?",translation:"أي كلمة تبدأ بالحرف V؟",instruction:"اختر الإجابة الصحيحة.",choices:["vélo","livre","bateau"],correctIndex:0,explanation:"تبدأ كلمة vélo بالحرف V."},
 {prompt:"Quelle lettre vient juste avant X ?",translation:"ما الحرف الذي يأتي مباشرة قبل X؟",instruction:"اختر الإجابة الصحيحة.",choices:["V","W","Y"],correctIndex:1,explanation:"ترتيب هذه الحروف هو V ثم W ثم X."},
 {prompt:"Quelle lettre vient juste après X ?",translation:"ما الحرف الذي يأتي مباشرة بعد X؟",instruction:"اختر الإجابة الصحيحة.",choices:["W","Z","Y"],correctIndex:2,explanation:"ترتيب نهاية الأبجدية هو W ثم X ثم Y ثم Z."},
 {prompt:"Comment s’appelle la lettre Z en français ?",translation:"ما اسم الحرف Z بالفرنسية؟",instruction:"اختر الإجابة الصحيحة.",choices:["zède","i grec","double vé"],correctIndex:0,explanation:"اسم الحرف Z بالفرنسية هو zède."},
 {prompt:"Combien de lettres compte l’alphabet français ?",translation:"كم حرفًا تتكوّن منه الأبجدية الفرنسية؟",instruction:"اختر الإجابة الصحيحة.",choices:["24","26","28"],correctIndex:1,explanation:"تتكوّن الأبجدية الفرنسية من 26 حرفًا."}
];

const A1_SOUNDS_PRACTICE_ITEMS:Example[]=[
 {fr:"La voiture rouge roule doucement.",ar:"تسير السيارة الحمراء بهدوء."},
 {fr:"Moi, je bois trois cafés par jour.",ar:"أنا أشرب ثلاثة أكواب من القهوة يوميًا."},
 {fr:"Le bateau blanc est très beau.",ar:"القارب الأبيض جميل جدًا."},
 {fr:"Mon oncle habite à Lyon.",ar:"يسكن عمي في ليون."},
 {fr:"Un enfant attend devant l’école.",ar:"ينتظر طفل أمام المدرسة."},
 {fr:"Ce matin, le train arrive à cinq heures.",ar:"يصل القطار هذا الصباح الساعة الخامسة."},
 {fr:"Le chat cherche sa chaussure.",ar:"تبحث القطة عن حذائها."},
 {fr:"Le garçon français mange une glace.",ar:"يتناول الصبي الفرنسي مثلجات."},
 {fr:"Le petit chat dort sur le lit.",ar:"تنام القطة الصغيرة على السرير."},
 {fr:"Les enfants arrivent à onze heures.",ar:"يصل الأطفال الساعة الحادية عشرة."}
];

const A1_SOUNDS_QUIZ_ITEMS:QuizQuestion[]=[
 {prompt:"Quel groupe de lettres produit le son /u/ dans « vous » ?",speech:"Écoutez le mot vous. Quel groupe de lettres produit le son entendu ?",translation:"ما مجموعة الحروف التي تنتج صوت «و» في كلمة «vous»؟",instruction:"اختر مجموعة الحروف الصحيحة.",choices:["oi","ou","au"],correctIndex:1,explanation:"تنتج المجموعة ou الصوت ‎/u/‎ في كلمة vous."},
 {prompt:"Comment se prononce le groupe « oi » dans « moi » ?",speech:"Écoutez le mot moi. Comment se prononce le groupe de lettres oi ?",translation:"كيف تُنطق مجموعة الحروف «oi» في كلمة «moi»؟",instruction:"اختر الصوت الصحيح.",choices:["/wa/","/u/","/ɔ̃/"],correctIndex:0,explanation:"تُنطق المجموعة oi بالصوت ‎/wa/‎ في كلمة moi."},
 {prompt:"Quel groupe de lettres produit le son /o/ à la fin de « bateau » ?",speech:"Écoutez le mot bateau. Quel groupe de lettres produit le son final ?",translation:"ما مجموعة الحروف التي تنتج صوت «o» في نهاية كلمة «bateau»؟",instruction:"اختر مجموعة الحروف الصحيحة.",choices:["ou","eu","eau"],correctIndex:2,explanation:"تُنطق المجموعة eau بالصوت ‎/o/‎ في كلمة bateau."},
 {prompt:"Quel mot contient le groupe nasal « on » ?",speech:"Écoutez les mots bonjour, merci et salut. Quel mot contient le groupe nasal on ?",translation:"أي كلمة تحتوي على مجموعة الحروف الأنفية «on»؟",instruction:"اختر الكلمة الصحيحة.",choices:["bonjour","merci","salut"],correctIndex:0,explanation:"تحتوي كلمة bonjour على المجموعة الأنفية on."},
 {prompt:"Quelle est la première graphie nasale dans « enfant » ?",speech:"Écoutez le mot enfant. Quelle est la première graphie nasale ?",translation:"ما أول كتابة لصوت أنفي في كلمة «enfant»؟",instruction:"اختر الكتابة الصحيحة.",choices:["in","en","on"],correctIndex:1,explanation:"تبدأ كلمة enfant بالمجموعة en، ثم تحتوي لاحقًا على an؛ وكلتاهما تمثلان هنا الصوت الأنفي ‎/ɑ̃/‎."},
 {prompt:"Quel groupe de lettres représente le son nasal /ɛ̃/ dans « matin » ?",speech:"Écoutez le mot matin. Quel groupe de lettres représente le son nasal final ?",translation:"ما مجموعة الحروف التي تمثل الصوت الأنفي الأخير في كلمة «matin»؟",instruction:"اختر مجموعة الحروف الصحيحة.",choices:["an","on","in"],correctIndex:2,explanation:"تمثل المجموعة in الصوت الأنفي ‎/ɛ̃/‎ في نهاية كلمة matin."},
 {prompt:"Quel groupe de lettres produit le son /ʃ/ dans « chat » ?",speech:"Écoutez le mot chat. Quel groupe de lettres produit le son entendu ?",translation:"ما مجموعة الحروف التي تنتج صوت «ش» في كلمة «chat»؟",instruction:"اختر مجموعة الحروف الصحيحة.",choices:["ch","ph","gn"],correctIndex:0,explanation:"تُنطق المجموعة ch بالصوت ‎/ʃ/‎ في كلمة chat."},
 {prompt:"Quel son produit la lettre « ç » dans « garçon » ?",speech:"Écoutez le mot garçon. Quel son produit la lettre c cédille ?",translation:"ما الصوت الذي ينتجه الحرف «ç» في كلمة «garçon»؟",instruction:"اختر الصوت الصحيح.",choices:["Le son /k/","Le son /s/","Le son /g/"],correctIndex:1,explanation:"تجعل علامة السديلة (ç) الحرف c يُنطق ‎/s/‎ أمام a في كلمة garçon."},
 {prompt:"Quelle lettre finale est muette dans « petit » ?",speech:"Écoutez le mot petit. Quelle lettre finale est muette ?",translation:"ما الحرف الأخير الصامت في كلمة «petit»؟",instruction:"اختر الحرف الصحيح.",choices:["p","i","t"],correctIndex:2,explanation:"لا يُنطق الحرف t الأخير عادةً في صيغة المذكر petit."},
 {prompt:"Quel son entendez-vous pendant la liaison dans « les amis » ?",speech:"Écoutez la liaison dans les amis. Quel son entendez-vous entre les deux mots ?",translation:"ما الصوت الذي تسمعه عند الربط في عبارة «les amis»؟",instruction:"اختر صوت الربط الصحيح.",choices:["Le son /z/","Le son /t/","Aucun son"],correctIndex:0,explanation:"تُنطق s في les بالصوت ‎/z/‎ عند الربط مع amis."},
 {prompt:"Quel son commun entendez-vous dans « rouge » et « jour » ?",speech:"Écoutez les mots rouge et jour. Quel son commun entendez-vous ?",translation:"ما الصوت المشترك الذي تسمعه في كلمتي «rouge» و«jour»؟",instruction:"اختر الصوت الصحيح.",choices:["Le son /o/","Le son /u/","Le son /wa/"],correctIndex:1,explanation:"تحتوي الكلمتان rouge وjour على المجموعة ou التي تُنطق ‎/u/‎."},
 {prompt:"Quel groupe de lettres produit le son /wa/ dans « trois » ?",speech:"Écoutez le mot trois. Quel groupe de lettres produit le son wa ?",translation:"ما مجموعة الحروف التي تنتج صوت «وا» في كلمة «trois»؟",instruction:"اختر مجموعة الحروف الصحيحة.",choices:["ou","on","oi"],correctIndex:2,explanation:"تُنطق المجموعة oi بالصوت ‎/wa/‎ في كلمة trois."},
 {prompt:"Quel mot se termine par le même son que « bateau » ?",speech:"Écoutez le mot bateau. Quel mot se termine par le même son ? Beau, vous ou pain ?",translation:"أي كلمة تنتهي بالصوت نفسه الذي تنتهي به كلمة «bateau»؟",instruction:"اختر الكلمة الصحيحة.",choices:["beau","vous","pain"],correctIndex:0,explanation:"تنتهي كلمتا bateau وbeau بالصوت ‎/o/‎ المكتوب eau."},
 {prompt:"Quel son de liaison entendez-vous dans « un enfant » ?",speech:"Écoutez la liaison dans un enfant. Quel son apparaît entre les deux mots ?",translation:"ما صوت الربط الذي تسمعه في عبارة «un enfant»؟",instruction:"اختر الصوت الصحيح.",choices:["Le son /z/","Le son /n/","Le son /t/"],correctIndex:1,explanation:"يظهر صوت ‎/n/‎ عند الربط بين un وenfant."},
 {prompt:"Quelle lettre finale ne se prononce pas dans « vous » ?",speech:"Écoutez le mot vous. Quelle lettre finale ne se prononce pas ?",translation:"ما الحرف الأخير الذي لا يُنطق في كلمة «vous»؟",instruction:"اختر الحرف الصحيح.",choices:["v","u","s"],correctIndex:2,explanation:"لا يُنطق الحرف s في نهاية كلمة vous عندما تُنطق منفردة."},
 {prompt:"Quelle lettre finale est muette dans « grand » au masculin ?",speech:"Écoutez le mot grand au masculin. Quelle lettre finale est muette ?",translation:"ما الحرف الأخير الصامت في كلمة «grand» بصيغة المذكر؟",instruction:"اختر الحرف الصحيح.",choices:["d","n","r"],correctIndex:0,explanation:"لا يُنطق الحرف d الأخير عادةً في كلمة grand بصيغة المذكر."},
 {prompt:"Dans quel mot la lettre « t » se prononce-t-elle ?",speech:"Écoutez les mots petit et petite. Dans quel mot prononce-t-on la lettre t ?",translation:"في أي كلمة يُنطق الحرف «t»؟",instruction:"اختر الكلمة الصحيحة.",choices:["petit","petite","في الكلمتين لا يُنطق"],correctIndex:1,explanation:"يظهر نطق t في صيغة المؤنث petite، بينما يكون صامتًا عادةً في petit."},
 {prompt:"Quel son de liaison entendez-vous dans « ils arrivent » ?",speech:"Écoutez la liaison dans ils arrivent. Quel son entendez-vous entre les deux mots ?",translation:"ما صوت الربط الذي تسمعه في عبارة «ils arrivent»؟",instruction:"اختر الصوت الصحيح.",choices:["Le son /t/","Le son /n/","Le son /z/"],correctIndex:2,explanation:"تُنطق s في ils بالصوت ‎/z/‎ قبل الفعل الذي يبدأ بصوت متحرك."},
 {prompt:"Quelle lettre finale est muette dans « français » ?",speech:"Écoutez le mot français. Quelle lettre finale est muette ?",translation:"ما الحرف الأخير الصامت في كلمة «français»؟",instruction:"اختر الحرف الصحيح.",choices:["s","ç","f"],correctIndex:0,explanation:"لا يُنطق الحرف s الأخير في كلمة français."},
 {prompt:"Quel mot contient le groupe « ch » prononcé /ʃ/ ?",speech:"Écoutez les mots maison, chaussure et garçon. Quel mot contient le son produit par le groupe ch ?",translation:"أي كلمة تحتوي على مجموعة «ch» المنطوقة بصوت «ش»؟",instruction:"اختر الكلمة الصحيحة.",choices:["maison","chaussure","garçon"],correctIndex:1,explanation:"تبدأ كلمة chaussure بالمجموعة ch التي تُنطق ‎/ʃ/‎."}
];

const A1_GREETINGS_PRACTICE_ITEMS:Example[]=[
 {fr:"Bonjour monsieur, comment allez-vous ?",ar:"مرحبًا سيدي، كيف حالكم؟"},
 {fr:"Salut Karim, comment vas-tu ?",ar:"مرحبًا كريم، كيف حالك؟"},
 {fr:"Je m’appelle Youssef et j’ai vingt ans.",ar:"اسمي يوسف وعمري عشرون عامًا."},
 {fr:"Je viens du Maroc et j’habite à Nice.",ar:"أنا من المغرب وأسكن في نيس."},
 {fr:"Je suis infirmier dans un hôpital.",ar:"أنا ممرض في مستشفى."},
 {fr:"Je parle arabe et un peu français.",ar:"أتحدث العربية وقليلًا من الفرنسية."},
 {fr:"Pendant mon temps libre, j’aime nager.",ar:"أحب السباحة في وقت فراغي."},
 {fr:"Comment vous appelez-vous ?",ar:"ما اسمكم؟"},
 {fr:"Enchanté, bienvenue dans notre classe.",ar:"تشرفت بمعرفتكم، أهلًا بكم في فصلنا."},
 {fr:"Au revoir madame, à demain !",ar:"إلى اللقاء سيدتي، أراكِ غدًا!"}
];

const A1_GREETINGS_QUIZ_ITEMS:QuizQuestion[]=[
 {prompt:"Il est neuf heures du matin. Je dis : ___.",speech:"Il est neuf heures du matin. Quelle formule de salutation choisissez-vous ?",instruction:"اختر التحية المناسبة في الصباح.",choices:["Bonsoir","Bonjour","Bonne nuit"],correctIndex:1,explanation:"Bonjour هي التحية المناسبة نهارًا."},
 {prompt:"Je parle à un ami. Je dis : ___.",speech:"Je parle à un ami. Quelle formule familière choisissez-vous ?",instruction:"اختر التحية الودية المناسبة لصديق.",choices:["Salut","Bonjour madame","Au revoir monsieur"],correctIndex:0,explanation:"Salut تحية غير رسمية تستخدم مع الأصدقاء."},
 {prompt:"Comment vous ___-vous ?",speech:"Complétez la question. Comment vous appelez-vous ?",instruction:"أكمل السؤال الرسمي عن الاسم.",choices:["habitez","appelez","parlez"],correctIndex:1,explanation:"Comment vous appelez-vous ؟ تعني ما اسمكم؟"},
 {prompt:"Je ___ Lina.",speech:"Complétez la phrase. Je m’appelle Lina.",instruction:"اختر الصيغة الصحيحة لذكر الاسم.",choices:["m’appelle","s’appelle","t’appelles"],correctIndex:0,explanation:"مع je نقول je m’appelle."},
 {prompt:"J’___ vingt-deux ans.",speech:"Complétez la phrase. J’ai vingt-deux ans.",instruction:"اختر الفعل الصحيح لذكر العمر.",choices:["est","suis","ai"],correctIndex:2,explanation:"العمر في الفرنسية يستخدم فعل avoir: j’ai."},
 {prompt:"Je ___ de Djeddah.",speech:"Complétez la phrase. Je viens de Djeddah.",instruction:"اختر الفعل المناسب لذكر المكان الذي أتيت منه.",choices:["viens","habite","parle"],correctIndex:0,explanation:"venir de يستخدم لذكر الأصل أو المكان الذي يأتي منه الشخص."},
 {prompt:"J’___ à Toulouse.",speech:"Complétez la phrase. J’habite à Toulouse.",instruction:"اختر الفعل المناسب لذكر مكان السكن.",choices:["aime","habite","étudie de"],correctIndex:1,explanation:"habiter à يستخدم مع اسم المدينة."},
 {prompt:"Je suis ___.",speech:"Je travaille dans une école. Je suis professeur.",instruction:"اختر المهنة المناسبة لشخص يعمل في مدرسة.",choices:["pharmacien","serveur","professeur"],correctIndex:2,explanation:"الشخص الذي يدرّس في المدرسة هو professeur."},
 {prompt:"Je parle arabe et ___ français.",speech:"Complétez la phrase. Je parle arabe et un peu français.",instruction:"اختر العبارة التي تعني «قليلًا من».",choices:["un peu","beaucoup de","jamais"],correctIndex:0,explanation:"un peu تعني قليلًا."},
 {prompt:"Au revoir et à bientôt.",speech:"Au revoir et à bientôt.",instruction:"اختر المعنى العربي الصحيح.",choices:["مرحبًا وتشرفت بمعرفتك.","إلى اللقاء وأراك قريبًا.","مساء الخير وكيف حالك؟"],correctIndex:1,explanation:"Au revoir et à bientôt عبارة وداع تعني إلى اللقاء وأراك قريبًا."}
];

const A1_COUNTRIES_PRACTICE_ITEMS:Example[]=[
 {fr:"Je viens d’Arabie saoudite.",ar:"أنا من المملكة العربية السعودية."},
 {fr:"J’habite en France.",ar:"أسكن في فرنسا."},
 {fr:"Elle vient du Maroc.",ar:"هي من المغرب."},
 {fr:"Nous voyageons au Japon.",ar:"نحن نسافر إلى اليابان."},
 {fr:"Ils habitent aux États-Unis.",ar:"هم يسكنون في الولايات المتحدة."},
 {fr:"Je suis saoudienne et je parle arabe.",ar:"أنا سعودية وأتحدث العربية."},
 {fr:"Mon ami est français.",ar:"صديقي فرنسي."},
 {fr:"Maya est japonaise.",ar:"مايا يابانية."},
 {fr:"Quelle est votre nationalité ?",ar:"ما جنسيتكم؟"},
 {fr:"Quelles langues parlez-vous ?",ar:"ما اللغات التي تتحدثونها؟"}
];

const A1_COUNTRIES_QUIZ_ITEMS:QuizQuestion[]=[
 {prompt:"J’habite ___ France.",speech:"Complétez la phrase. J’habite en France.",instruction:"اختر حرف الجر الصحيح مع France.",translation:"أسكن في فرنسا.",choices:["au","en","aux"],correctIndex:1,explanation:"France بلد مؤنث؛ لذلك نقول en France."},
 {prompt:"Nous voyageons ___ Maroc.",speech:"Complétez la phrase. Nous voyageons au Maroc.",instruction:"اختر حرف الجر الصحيح مع Maroc.",translation:"نسافر إلى المغرب.",choices:["au","en","aux"],correctIndex:0,explanation:"Maroc بلد مذكر؛ لذلك نقول au Maroc."},
 {prompt:"Elle travaille ___ États-Unis.",speech:"Complétez la phrase. Elle travaille aux États-Unis.",instruction:"اختر حرف الجر الصحيح مع États-Unis.",translation:"هي تعمل في الولايات المتحدة.",choices:["en","au","aux"],correctIndex:2,explanation:"États-Unis اسم جمع؛ لذلك نقول aux États-Unis."},
 {prompt:"Je viens ___ France.",speech:"Complétez la phrase. Je viens de France.",instruction:"اختر الصيغة الصحيحة لذكر الأصل.",translation:"أنا من فرنسا.",choices:["de","du","des"],correctIndex:0,explanation:"نقول de France عند ذكر الأصل من بلد مؤنث."},
 {prompt:"Il vient ___ Maroc.",speech:"Complétez la phrase. Il vient du Maroc.",instruction:"اختر الصيغة الصحيحة مع بلد مذكر.",translation:"هو من المغرب.",choices:["de la","des","du"],correctIndex:2,explanation:"de + le تصبح du: du Maroc."},
 {prompt:"Ils viennent ___ États-Unis.",speech:"Complétez la phrase. Ils viennent des États-Unis.",instruction:"اختر الصيغة الصحيحة مع بلد جمع.",translation:"هم من الولايات المتحدة.",choices:["des","du","d’"],correctIndex:0,explanation:"de + les تصبح des: des États-Unis."},
 {prompt:"Nora est ___.",speech:"Nora est française.",instruction:"اختر صيغة الجنسية المؤنثة الصحيحة.",translation:"نورة فرنسية.",choices:["français","française","France"],correctIndex:1,explanation:"مع امرأة نقول française."},
 {prompt:"Sami est ___.",speech:"Sami est saoudien.",instruction:"اختر صيغة الجنسية المذكرة الصحيحة.",translation:"سامي سعودي.",choices:["saoudien","saoudienne","Arabie saoudite"],correctIndex:0,explanation:"مع رجل نقول saoudien."},
 {prompt:"Yuki est ___.",speech:"Yuki est japonaise.",instruction:"اختر صيغة الجنسية المؤنثة الصحيحة.",translation:"يوكي يابانية.",choices:["Japon","japonais","japonaise"],correctIndex:2,explanation:"الصيغة المؤنثة من japonais هي japonaise."},
 {prompt:"Je parle ___.",speech:"Je parle français.",instruction:"اختر الصياغة الصحيحة بعد parler.",translation:"أتحدث الفرنسية.",choices:["le français","français","au français"],correctIndex:1,explanation:"بعد parler نذكر اللغة عادة من دون أداة: parler français."},
 {prompt:"J’apprends ___.",speech:"J’apprends le français.",instruction:"اختر الصياغة الصحيحة مع apprendre.",translation:"أتعلم اللغة الفرنسية.",choices:["le français","français à","du français langue"],correctIndex:0,explanation:"نقول apprendre le français عند تعلم اللغة."},
 {prompt:"Elle vient d’Égypte. Elle est ___.",speech:"Elle vient d’Égypte. Elle est égyptienne.",instruction:"اختر الجنسية المناسبة.",translation:"هي من مصر، وهي مصرية.",choices:["égyptien","Égypte","égyptienne"],correctIndex:2,explanation:"الصيغة المؤنثة الصحيحة هي égyptienne."},
 {prompt:"En Espagne, on parle ___.",speech:"En Espagne, on parle espagnol.",instruction:"اختر اسم اللغة الصحيح.",translation:"في إسبانيا يتحدثون الإسبانية.",choices:["espagnole","espagnol","Espagne"],correctIndex:1,explanation:"اسم اللغة هو espagnol ويكتب بحرف صغير."},
 {prompt:"Il vient d’Allemagne. Il est ___.",speech:"Il vient d’Allemagne. Il est allemand.",instruction:"اختر الجنسية المناسبة.",translation:"هو من ألمانيا، وهو ألماني.",choices:["allemand","allemande","Allemagne"],correctIndex:0,explanation:"الصيغة المذكرة الصحيحة هي allemand."},
 {prompt:"___ venez-vous ?",speech:"D’où venez-vous ?",instruction:"أكمل السؤال عن البلد أو الأصل.",translation:"من أين أنتم؟",choices:["Quelle","D’où","Comment"],correctIndex:1,explanation:"D’où venez-vous ؟ سؤال مباشر عن الأصل."},
 {prompt:"___ langue parlez-vous ?",speech:"Quelle langue parlez-vous ?",instruction:"اختر أداة السؤال الموافقة لكلمة langue.",translation:"ما اللغة التي تتحدثونها؟",choices:["Quel","Quels","Quelle"],correctIndex:2,explanation:"langue مؤنث مفرد؛ لذلك نقول quelle langue."},
 {prompt:"Elle habite ___ Italie.",speech:"Elle habite en Italie.",instruction:"اختر حرف الجر الصحيح.",translation:"هي تسكن في إيطاليا.",choices:["en","au","aux"],correctIndex:0,explanation:"Italie بلد مؤنث يبدأ بصوت متحرك؛ لذلك نقول en Italie."},
 {prompt:"Nous habitons ___ Canada.",speech:"Nous habitons au Canada.",instruction:"اختر حرف الجر الصحيح.",translation:"نسكن في كندا.",choices:["aux","au","en"],correctIndex:1,explanation:"Canada بلد مذكر؛ لذلك نقول au Canada."},
 {prompt:"Ils viennent ___ Japon.",speech:"Ils viennent du Japon.",instruction:"اختر الصيغة الصحيحة لذكر الأصل.",translation:"هم من اليابان.",choices:["de","des","du"],correctIndex:2,explanation:"Japon بلد مذكر؛ لذلك نقول du Japon."},
 {prompt:"Je suis marocaine et je parle arabe.",speech:"Je suis marocaine et je parle arabe.",instruction:"اختر المعنى العربي الصحيح.",choices:["أنا مغربية وأتحدث العربية.","أنا مصرية وأتعلم الفرنسية.","أنا فرنسية وأسكن في المغرب."],correctIndex:0,explanation:"marocaine تعني مغربية وje parle arabe تعني أتحدث العربية."}
];

const A1_STUDIES_PRACTICE_ITEMS:Example[]=[
 {fr:"Je suis étudiant à l’université.",ar:"أنا طالب في الجامعة."},
 {fr:"Nora étudie le français.",ar:"تدرس نورا اللغة الفرنسية."},
 {fr:"Nous avons un cours à dix heures.",ar:"لدينا درس الساعة العاشرة."},
 {fr:"Elle est professeure dans une école.",ar:"هي معلّمة في مدرسة."},
 {fr:"Mon frère est ingénieur.",ar:"أخي مهندس."},
 {fr:"Il travaille à l’hôpital.",ar:"هو يعمل في المستشفى."},
 {fr:"Maya travaille comme vendeuse.",ar:"تعمل مايا بائعة."},
 {fr:"Je travaille dans un restaurant.",ar:"أعمل في مطعم."},
 {fr:"Qu’est-ce que vous étudiez ?",ar:"ماذا تدرسون؟"},
 {fr:"Quel est votre métier ?",ar:"ما مهنتكم؟"}
];

const A1_STUDIES_QUIZ_ITEMS:QuizQuestion[]=[
 {prompt:"Je ___ le français.",speech:"Complétez la phrase. J’étudie le français.",instruction:"اختر الفعل المناسب للحديث عن الدراسة.",translation:"أدرس اللغة الفرنسية.",choices:["travaille","étudie","habite"],correctIndex:1,explanation:"étudier يعني يدرس."},
 {prompt:"Nous ___ à l’université.",speech:"Complétez la phrase. Nous étudions à l’université.",instruction:"اختر تصريف étudier الصحيح مع nous.",translation:"نحن ندرس في الجامعة.",choices:["étudions","étudiez","étudient"],correctIndex:0,explanation:"مع nous نقول nous étudions."},
 {prompt:"Elle est ___.",speech:"Elle est étudiante.",instruction:"اختر الصيغة المؤنثة الصحيحة.",translation:"هي طالبة.",choices:["étudiant","études","étudiante"],correctIndex:2,explanation:"الصيغة المؤنثة هي étudiante."},
 {prompt:"Il fait des études de ___.",speech:"Il fait des études de médecine.",instruction:"اختر الكلمة المناسبة لتخصص الطب.",translation:"هو يدرس الطب.",choices:["médecine","médecin","hôpital"],correctIndex:0,explanation:"médecine اسم مجال الدراسة، أما médecin فهو الطبيب."},
 {prompt:"Mon cours ___ à neuf heures.",speech:"Mon cours commence à neuf heures.",instruction:"اختر الفعل المناسب.",translation:"يبدأ درسي الساعة التاسعة.",choices:["parle","commence","vient"],correctIndex:1,explanation:"commencer يعني يبدأ."},
 {prompt:"Elle est ___. Elle enseigne le français.",speech:"Elle est professeure. Elle enseigne le français.",instruction:"اختر المهنة المناسبة.",translation:"هي تعلّم الفرنسية.",choices:["vendeuse","infirmière","professeure"],correctIndex:2,explanation:"الشخص الذي يدرّس هو professeur أو professeure."},
 {prompt:"Lina soigne les malades. Elle est ___.",speech:"Lina soigne les malades. Elle est infirmière.",instruction:"اختر المهنة المناسبة.",translation:"تعالج لينا المرضى.",choices:["infirmière","cuisinière","étudiante"],correctIndex:0,explanation:"infirmière تعني ممرضة."},
 {prompt:"Il prépare les repas. Il est ___.",speech:"Il prépare les repas. Il est cuisinier.",instruction:"اختر المهنة المناسبة.",translation:"هو يحضّر الوجبات.",choices:["ingénieur","cuisinier","vendeur"],correctIndex:1,explanation:"cuisinier هو الطاهي."},
 {prompt:"Elle travaille dans un magasin. Elle est ___.",speech:"Elle travaille dans un magasin. Elle est vendeuse.",instruction:"اختر المهنة المناسبة.",translation:"هي تعمل في متجر.",choices:["médecin","professeure","vendeuse"],correctIndex:2,explanation:"vendeuse هي بائعة تعمل في متجر."},
 {prompt:"Je suis ___ ingénieur.",speech:"Je suis ingénieur.",instruction:"اختر الصياغة الصحيحة بعد être عند ذكر المهنة.",translation:"أنا مهندس.",choices:["ingénieur","un ingénieur","de ingénieur"],correctIndex:0,explanation:"تُذكر المهنة عادة من دون أداة بعد être."},
 {prompt:"Il travaille ___ l’hôpital.",speech:"Il travaille à l’hôpital.",instruction:"اختر حرف الجر الصحيح مع المؤسسة المحددة.",translation:"هو يعمل في المستشفى.",choices:["dans","à","comme"],correctIndex:1,explanation:"نقول travailler à l’hôpital."},
 {prompt:"Elle travaille ___ un restaurant.",speech:"Elle travaille dans un restaurant.",instruction:"اختر حرف الجر الصحيح مع نوع المكان.",translation:"هي تعمل في مطعم.",choices:["à la","comme","dans"],correctIndex:2,explanation:"نستعمل dans قبل مكان غير محدد مسبوق بأداة."},
 {prompt:"Je travaille ___ professeur.",speech:"Je travaille comme professeur.",instruction:"اختر الكلمة التي تسبق المهنة.",translation:"أعمل معلّمًا.",choices:["comme","dans","au"],correctIndex:0,explanation:"نستعمل comme قبل المهنة عند وصف طبيعة العمل."},
 {prompt:"Où ___-vous ?",speech:"Où travaillez-vous ?",instruction:"أكمل السؤال عن مكان العمل.",translation:"أين تعملون؟",choices:["étudie","travaillez","travaille"],correctIndex:1,explanation:"مع vous نقول travaillez-vous."},
 {prompt:"Quel est votre ___ ?",speech:"Quel est votre métier ?",instruction:"أكمل السؤال عن المهنة.",translation:"ما مهنتكم؟",choices:["cours","école","métier"],correctIndex:2,explanation:"métier تعني مهنة."},
 {prompt:"Qu’est-ce que vous ___ ?",speech:"Qu’est-ce que vous étudiez ?",instruction:"أكمل السؤال عن مجال الدراسة.",translation:"ماذا تدرسون؟",choices:["étudiez","étudions","étudient"],correctIndex:0,explanation:"مع vous نقول vous étudiez."},
 {prompt:"Je suis médecin.",speech:"Je suis médecin.",instruction:"اختر المعنى العربي الصحيح.",choices:["أنا معلّم.","أنا طبيب.","أنا طالب."],correctIndex:1,explanation:"médecin تعني طبيبًا أو طبيبة بحسب الشخص."},
 {prompt:"Elle travaille dans une école.",speech:"Elle travaille dans une école.",instruction:"اختر المعنى العربي الصحيح.",choices:["هي تدرس في المستشفى.","هي تسكن قرب المدرسة.","هي تعمل في مدرسة."],correctIndex:2,explanation:"travailler dans une école تعني العمل في مدرسة."},
 {prompt:"Nous avons un cours de français.",speech:"Nous avons un cours de français.",instruction:"اختر المعنى العربي الصحيح.",choices:["لدينا درس في اللغة الفرنسية.","نعمل معلّمين للفرنسية.","نبحث عن جامعة فرنسية."],correctIndex:0,explanation:"avoir un cours تعني أن لدينا درسًا."},
 {prompt:"Je ne travaille pas aujourd’hui.",speech:"Je ne travaille pas aujourd’hui.",instruction:"اختر المعنى العربي الصحيح.",choices:["أبدأ العمل اليوم.","لا أعمل اليوم.","أدرس بعد العمل."],correctIndex:1,explanation:"ne travaille pas تنفي العمل في هذا اليوم."}
];

const A1_TASTES_PRACTICE_ITEMS:Example[]=[
 {fr:"J’aime écouter de la musique.",ar:"أحب الاستماع إلى الموسيقى."},
 {fr:"Elle adore voyager en train.",ar:"هي تعشق السفر بالقطار."},
 {fr:"Nous aimons le cinéma français.",ar:"نحن نحب السينما الفرنسية."},
 {fr:"Je n’aime pas courir le matin.",ar:"لا أحب الجري صباحًا."},
 {fr:"Ils détestent attendre longtemps.",ar:"هم يكرهون الانتظار طويلًا."},
 {fr:"Je préfère le thé au café.",ar:"أفضل الشاي على القهوة."},
 {fr:"Tu préfères lire ou regarder un film ?",ar:"هل تفضل القراءة أم مشاهدة فيلم؟"},
 {fr:"Mon activité préférée est la natation.",ar:"نشاطي المفضل هو السباحة."},
 {fr:"J’aime ce livre parce qu’il est intéressant.",ar:"أحب هذا الكتاب لأنه ممتع."},
 {fr:"Pourquoi est-ce que vous aimez le français ?",ar:"لماذا تحبون اللغة الفرنسية؟"}
];

const A1_TASTES_QUIZ_ITEMS:QuizQuestion[]=[
 {prompt:"J’___ la musique.",speech:"Complétez la phrase. J’aime la musique.",instruction:"اختر الفعل المناسب للتعبير عن الإعجاب.",translation:"أحب الموسيقى.",choices:["aime","aimes","aimons"],correctIndex:0,explanation:"مع je نقول j’aime."},
 {prompt:"Elle ___ voyager.",speech:"Complétez la phrase. Elle adore voyager.",instruction:"اختر التصريف الصحيح.",translation:"هي تعشق السفر.",choices:["adores","adorons","adore"],correctIndex:2,explanation:"مع elle نقول elle adore."},
 {prompt:"Nous ___ le bruit.",speech:"Complétez la phrase. Nous détestons le bruit.",instruction:"اختر التصريف الصحيح مع nous.",translation:"نحن نكره الضوضاء.",choices:["détestent","détestons","déteste"],correctIndex:1,explanation:"مع nous تكون الصيغة détestons."},
 {prompt:"Je n’___ pas courir.",speech:"Complétez la phrase. Je n’aime pas courir.",instruction:"أكمل جملة النفي الصحيحة.",translation:"لا أحب الجري.",choices:["aime","adore","préfères"],correctIndex:0,explanation:"نضع n’ قبل aime وpas بعده."},
 {prompt:"Tu aimes ___ ?",speech:"Tu aimes lire ?",instruction:"اختر الفعل في صيغة المصدر.",translation:"هل تحب القراءة؟",choices:["lis","lire","lisez"],correctIndex:1,explanation:"بعد aimer يأتي الفعل الثاني في المصدر: lire."},
 {prompt:"J’aime ___ cinéma.",speech:"J’aime le cinéma.",instruction:"اختر الأداة الصحيحة قبل الاسم.",translation:"أحب السينما.",choices:["la","un","le"],correctIndex:2,explanation:"cinéma اسم مذكر؛ لذلك نقول le cinéma."},
 {prompt:"Elle aime ___ natation.",speech:"Elle aime la natation.",instruction:"اختر الأداة الصحيحة.",translation:"هي تحب السباحة.",choices:["la","le","les"],correctIndex:0,explanation:"natation اسم مؤنث؛ لذلك نقول la natation."},
 {prompt:"Je ___ le thé au café.",speech:"Je préfère le thé au café.",instruction:"اختر فعل التفضيل المناسب.",translation:"أفضل الشاي على القهوة.",choices:["déteste","préfère","adore"],correctIndex:1,explanation:"préférer يعبّر عن تفضيل خيار على آخر."},
 {prompt:"Nous ___ rester ici.",speech:"Nous préférons rester ici.",instruction:"اختر تصريف préférer مع nous.",translation:"نحن نفضل البقاء هنا.",choices:["préférez","préfèrent","préférons"],correctIndex:2,explanation:"مع nous نقول préférons."},
 {prompt:"Tu préfères lire ___ regarder un film ?",speech:"Tu préfères lire ou regarder un film ?",instruction:"اختر أداة الربط بين الخيارين.",translation:"هل تفضل القراءة أم مشاهدة فيلم؟",choices:["ou","et","parce que"],correctIndex:0,explanation:"ou تعني أم أو أو بين خيارين."},
 {prompt:"Mon sport ___ est le football.",speech:"Mon sport préféré est le football.",instruction:"اختر الصفة المناسبة.",translation:"رياضتي المفضلة هي كرة القدم.",choices:["préférée","préféré","préférer"],correctIndex:1,explanation:"sport مذكر؛ لذلك نقول préféré."},
 {prompt:"Mon activité ___ est la lecture.",speech:"Mon activité préférée est la lecture.",instruction:"اختر صيغة الصفة الموافقة.",translation:"نشاطي المفضل هو القراءة.",choices:["préféré","préférer","préférée"],correctIndex:2,explanation:"activité مؤنث؛ لذلك نقول préférée."},
 {prompt:"J’aime ce film ___ il est drôle.",speech:"J’aime ce film parce qu’il est drôle.",instruction:"اختر الرابط الذي يقدم السبب.",translation:"أحب هذا الفيلم لأنه مضحك.",choices:["parce qu’","mais","ou"],correctIndex:0,explanation:"parce que تصبح parce qu’ قبل صوت متحرك."},
 {prompt:"Pourquoi aimes-tu ce livre ?",speech:"Pourquoi aimes-tu ce livre ?",instruction:"اختر الإجابة التي تقدم سببًا.",translation:"لماذا تحب هذا الكتاب؟",choices:["À la bibliothèque.","Parce qu’il est intéressant.","Avec mon ami."],correctIndex:1,explanation:"السؤال بـ pourquoi يُجاب عنه بسبب يبدأ غالبًا بـ parce que."},
 {prompt:"Je déteste attendre.",speech:"Je déteste attendre.",instruction:"اختر المعنى العربي الصحيح.",choices:["أفضل الانتظار.","أحب الانتظار.","أكره الانتظار."],correctIndex:2,explanation:"détester يعني يكره."},
 {prompt:"Elle adore cuisiner.",speech:"Elle adore cuisiner.",instruction:"اختر المعنى العربي الصحيح.",choices:["هي تعشق الطبخ.","هي لا تحب الطعام.","هي تفضل المطعم."],correctIndex:0,explanation:"adorer أقوى من aimer وتعني يعشق."},
 {prompt:"Nous n’aimons pas le café.",speech:"Nous n’aimons pas le café.",instruction:"اختر المعنى العربي الصحيح.",choices:["نحن نفضل القهوة.","نحن لا نحب القهوة.","نحن نشرب القهوة."],correctIndex:1,explanation:"ne… pas تنفي فعل aimer."},
 {prompt:"Quel est votre loisir préféré ?",speech:"Quel est votre loisir préféré ?",instruction:"اختر الإجابة المناسبة للسؤال.",translation:"ما هوايتكم المفضلة؟",choices:["J’habite à Paris.","Il est neuf heures.","Mon loisir préféré est la lecture."],correctIndex:2,explanation:"الإجابة تحدد الهواية المفضلة مباشرة."},
 {prompt:"Vous aimez faire du sport ?",speech:"Vous aimez faire du sport ?",instruction:"اختر الإجابة الطبيعية.",translation:"هل تحبون ممارسة الرياضة؟",choices:["Oui, j’aime beaucoup nager.","Je suis un sport.","À cinq heures hier."],correctIndex:0,explanation:"يمكن تأكيد الذوق ثم ذكر النشاط في المصدر."},
 {prompt:"Je préfère marcher parce que c’est calme.",speech:"Je préfère marcher parce que c’est calme.",instruction:"اختر المعنى العربي الصحيح.",choices:["أكره المشي لأنه متعب.","أفضل المشي لأنه هادئ.","أحب القطار لأنه سريع."],correctIndex:1,explanation:"الجملة تعبّر عن التفضيل ثم تذكر السبب."}
];

const A1_NOUNS_PRACTICE_ITEMS:Example[]=[
 {fr:"C’est un ordinateur portable.",ar:"هذا حاسوب محمول."},
 {fr:"Voilà une fenêtre ouverte.",ar:"تلك نافذة مفتوحة."},
 {fr:"Le directeur est dans son bureau.",ar:"المدير في مكتبه."},
 {fr:"La bibliothèque ferme à dix-huit heures.",ar:"تغلق المكتبة الساعة السادسة مساءً."},
 {fr:"L’étudiante attend devant l’université.",ar:"تنتظر الطالبة أمام الجامعة."},
 {fr:"J’achète des cahiers pour le cours.",ar:"أشتري دفاتر للدرس."},
 {fr:"Les cahiers sont dans mon sac.",ar:"الدفاتر داخل حقيبتي."},
 {fr:"Ce quartier a plusieurs nouveaux bureaux.",ar:"يضم هذا الحي عدة مكاتب جديدة."},
 {fr:"Les travaux commencent lundi matin.",ar:"تبدأ الأعمال صباح الاثنين."},
 {fr:"Deux autobus passent devant la gare.",ar:"تمر حافلتان أمام المحطة."}
];

const A1_NOUNS_QUIZ_ITEMS:QuizQuestion[]=[
 {prompt:"C’est ___ livre.",speech:"Complétez la phrase. C’est un livre.",instruction:"اختر أداة النكرة المناسبة لاسم مذكر مفرد.",choices:["une","un","des"],correctIndex:1,explanation:"livre اسم مذكر مفرد؛ لذلك نستخدم un."},
 {prompt:"Voilà ___ chaise.",speech:"Complétez la phrase. Voilà une chaise.",instruction:"اختر أداة النكرة المناسبة لاسم مؤنث مفرد.",choices:["une","un","le"],correctIndex:0,explanation:"chaise اسم مؤنث مفرد؛ لذلك نستخدم une."},
 {prompt:"___ école est près d’ici.",speech:"Complétez la phrase. L’école est près d’ici.",instruction:"اختر أداة المعرفة قبل اسم يبدأ بصوت متحرك.",choices:["La","Le","L’"],correctIndex:2,explanation:"نستخدم l’ قبل الاسم الذي يبدأ بصوت متحرك."},
 {prompt:"J’achète ___ pommes.",speech:"Complétez la phrase. J’achète des pommes.",instruction:"اختر أداة الجمع غير المعرف عند ذكر الأشياء أول مرة.",choices:["des","les","une"],correctIndex:0,explanation:"des أداة جمع غير معرف."},
 {prompt:"J’ai des pommes. ___ pommes sont rouges.",speech:"Complétez la deuxième phrase. Les pommes sont rouges.",instruction:"اختر أداة الجمع المعرف بعد أن أصبحت الثمار معروفة.",choices:["Des","Les","Le"],correctIndex:1,explanation:"نستخدم les لأن pommes ذُكرت وأصبحت معروفة."},
 {prompt:"Un étudiant, deux ___.",speech:"Mettez le nom au pluriel. Un étudiant, deux étudiants.",instruction:"اختر جمع étudiant الصحيح.",choices:["étudiantes","étudiants","étudiant"],correctIndex:1,explanation:"الجمع المذكر العادي يضاف إليه s: étudiants."},
 {prompt:"Un journal, des ___.",speech:"Mettez le nom au pluriel. Un journal, des journaux.",instruction:"اختر جمع journal الصحيح.",choices:["journals","journales","journaux"],correctIndex:2,explanation:"journal من الكلمات التي تتحول فيها -al إلى -aux."},
 {prompt:"Un bateau, des ___.",speech:"Mettez le nom au pluriel. Un bateau, des bateaux.",instruction:"اختر جمع bateau الصحيح.",choices:["bateaux","bateaus","bataux"],correctIndex:0,explanation:"الأسماء المنتهية بـ -eau تأخذ x غالبًا في الجمع."},
 {prompt:"Un prix, plusieurs ___.",speech:"Mettez le nom au pluriel. Un prix, plusieurs prix.",instruction:"اختر جمع prix الصحيح.",choices:["prises","prixs","prix"],correctIndex:2,explanation:"prix ينتهي أصلًا بـ x ولا تتغير كتابته في الجمع."},
 {prompt:"Les enfants jouent dans les jardins.",speech:"Les enfants jouent dans les jardins.",instruction:"اختر المعنى العربي الصحيح.",choices:["يلعب الأطفال في الحدائق.","يقرأ الطلاب في المكتبة.","ينتظر الآباء أمام المدرسة."],correctIndex:0,explanation:"les enfants تعني الأطفال وles jardins تعني الحدائق."}
];

const A1_CORE_VERBS_PRACTICE_ITEMS:Example[]=[
 {fr:"Je suis disponible cet après-midi.",ar:"أنا متاح بعد ظهر اليوم."},
 {fr:"Tu es dans la bonne salle.",ar:"أنت في القاعة الصحيحة."},
 {fr:"On est prêts pour le cours.",ar:"نحن مستعدون للدرس."},
 {fr:"Nous sommes voisins depuis peu.",ar:"نحن جيران منذ وقت قريب."},
 {fr:"Elles sont étudiantes en médecine.",ar:"هن طالبات في كلية الطب."},
 {fr:"J’ai un vélo rouge.",ar:"لدي دراجة حمراء."},
 {fr:"Il a trente ans aujourd’hui.",ar:"بلغ اليوم ثلاثين عامًا."},
 {fr:"Nous avons rendez-vous à dix heures.",ar:"لدينا موعد الساعة العاشرة."},
 {fr:"Vous avez faim après le voyage ?",ar:"هل تشعرون بالجوع بعد الرحلة؟"},
 {fr:"Ils ont besoin d’un taxi.",ar:"يحتاجون إلى سيارة أجرة."}
];

const A1_CORE_VERBS_QUIZ_ITEMS:QuizQuestion[]=[
 {prompt:"Je ___ à la gare.",speech:"Complétez la phrase. Je suis à la gare.",instruction:"اختر تصريف être الصحيح مع je.",choices:["suis","es","ai"],correctIndex:0,explanation:"مع je يُصرّف être هكذا: je suis."},
 {prompt:"Tu ___ très calme.",speech:"Complétez la phrase. Tu es très calme.",instruction:"اختر تصريف être الصحيح مع tu.",choices:["est","es","as"],correctIndex:1,explanation:"مع tu يُصرّف être هكذا: tu es."},
 {prompt:"Elle ___ professeure.",speech:"Complétez la phrase. Elle est professeure.",instruction:"اختر تصريف être الصحيح مع elle.",choices:["a","êtes","est"],correctIndex:2,explanation:"مع elle يُصرّف être هكذا: elle est."},
 {prompt:"Nous ___ en retard.",speech:"Complétez la phrase. Nous sommes en retard.",instruction:"اختر تصريف être الصحيح مع nous.",choices:["sommes","avons","sont"],correctIndex:0,explanation:"مع nous يُصرّف être هكذا: nous sommes."},
 {prompt:"Vous ___ au premier étage.",speech:"Complétez la phrase. Vous êtes au premier étage.",instruction:"اختر تصريف être الصحيح مع vous.",choices:["avez","êtes","sont"],correctIndex:1,explanation:"مع vous يُصرّف être هكذا: vous êtes."},
 {prompt:"Ils ___ dans le jardin.",speech:"Complétez la phrase. Ils sont dans le jardin.",instruction:"اختر تصريف être الصحيح مع ils.",choices:["ont","est","sont"],correctIndex:2,explanation:"مع ils يُصرّف être هكذا: ils sont."},
 {prompt:"J’___ vingt-cinq ans.",speech:"Complétez la phrase. J’ai vingt-cinq ans.",instruction:"اختر تصريف avoir الصحيح لذكر العمر.",choices:["ai","suis","as"],correctIndex:0,explanation:"مع je يُصرّف avoir هكذا: j’ai، ونستخدمه لذكر العمر."},
 {prompt:"On ___ une réservation.",speech:"Complétez la phrase. On a une réservation.",instruction:"اختر تصريف avoir الصحيح مع on.",choices:["est","a","avons"],correctIndex:1,explanation:"مع on يُصرّف avoir هكذا: on a."},
 {prompt:"Nous ___ deux enfants.",speech:"Complétez la phrase. Nous avons deux enfants.",instruction:"اختر تصريف avoir الصحيح مع nous.",choices:["sommes","ont","avons"],correctIndex:2,explanation:"مع nous يُصرّف avoir هكذا: nous avons."},
 {prompt:"Elles ont froid.",speech:"Elles ont froid.",instruction:"اختر المعنى العربي الصحيح في هذا السياق.",choices:["يشعرن بالبرد.","هن في الخارج.","لديهن معاطف."],correctIndex:0,explanation:"avoir froid تعبير ثابت يعني الشعور بالبرد."}
];

const A1_PRESENT_PRACTICE_ITEMS:Example[]=[
 {fr:"Je prépare le dîner à la maison.",ar:"أُحضّر العشاء في المنزل."},
 {fr:"Tu finis ton travail à cinq heures.",ar:"تنهي عملك الساعة الخامسة."},
 {fr:"Le bus arrive devant la gare.",ar:"تصل الحافلة أمام المحطة."},
 {fr:"Nous choisissons une table près de la fenêtre.",ar:"نختار طاولة قرب النافذة."},
 {fr:"Vous attendez votre tour.",ar:"تنتظرون دوركم."},
 {fr:"Elles prennent le train chaque matin.",ar:"يستقللن القطار كل صباح."},
 {fr:"Je ne travaille pas le dimanche.",ar:"لا أعمل يوم الأحد."},
 {fr:"Il n’habite pas dans ce quartier.",ar:"هو لا يسكن في هذا الحي."},
 {fr:"Est-ce que vous parlez français ?",ar:"هل تتحدثون الفرنسية؟"},
 {fr:"Pourquoi est-ce qu’elle rentre tôt ?",ar:"لماذا تعود مبكرًا؟"}
];

const A1_PRESENT_QUIZ_ITEMS:QuizQuestion[]=[
 {prompt:"Je ___ français avec mes collègues.",speech:"Complétez la phrase. Je parle français avec mes collègues.",instruction:"اختر تصريف parler الصحيح مع je.",choices:["parle","parles","parlons"],correctIndex:0,explanation:"مع je يأخذ الفعل parler النهاية -e: je parle."},
 {prompt:"Nous ___ le cours à midi.",speech:"Complétez la phrase. Nous finissons le cours à midi.",instruction:"اختر تصريف finir الصحيح مع nous.",choices:["finissez","finissons","finissent"],correctIndex:1,explanation:"مع nous يُصرّف finir هكذا: nous finissons."},
 {prompt:"Ils ___ devant le cinéma.",speech:"Complétez la phrase. Ils attendent devant le cinéma.",instruction:"اختر تصريف attendre الصحيح مع ils.",choices:["attend","attendez","attendent"],correctIndex:2,explanation:"مع ils يأخذ attendre النهاية -ent: ils attendent."},
 {prompt:"Tu ___ le bus numéro dix.",speech:"Complétez la phrase. Tu prends le bus numéro dix.",instruction:"اختر تصريف prendre الصحيح مع tu.",choices:["prends","prend","prenez"],correctIndex:0,explanation:"مع tu يُصرّف prendre هكذا: tu prends."},
 {prompt:"Vous ___ vos devoirs le soir.",speech:"Complétez la phrase. Vous faites vos devoirs le soir.",instruction:"اختر تصريف faire الصحيح مع vous.",choices:["faisons","faites","font"],correctIndex:1,explanation:"مع vous يُصرّف faire هكذا: vous faites."},
 {prompt:"Elle ___ au marché à pied.",speech:"Complétez la phrase. Elle va au marché à pied.",instruction:"اختر تصريف aller الصحيح مع elle.",choices:["vas","vont","va"],correctIndex:2,explanation:"مع elle يُصرّف aller هكذا: elle va."},
 {prompt:"Je ___ comprends ___ cette phrase.",speech:"Complétez la phrase négative. Je ne comprends pas cette phrase.",instruction:"اختر أداتي النفي المناسبتين.",choices:["ne … pas","pas … ne","n’ … jamais"],correctIndex:0,explanation:"في النفي البسيط نضع ne قبل الفعل وpas بعده: je ne comprends pas."},
 {prompt:"Il ___ habite pas ici.",speech:"Complétez la phrase. Il n’habite pas ici.",instruction:"اختر الصيغة الصحيحة قبل الفعل المبدوء بحرف متحرك.",choices:["ne","n’","pas"],correctIndex:1,explanation:"تتحول ne إلى n’ قبل حرف متحرك: il n’habite pas."},
 {prompt:"___ vous travaillez aujourd’hui ?",speech:"Complétez la question. Est-ce que vous travaillez aujourd’hui ?",instruction:"اختر بداية السؤال الصحيحة.",choices:["Qu’est-ce","Est-ce qui","Est-ce que"],correctIndex:2,explanation:"Est-ce que تسبق الجملة المثبتة لتكوين سؤال واضح."},
 {prompt:"Nous ne prenons pas la voiture aujourd’hui.",speech:"Nous ne prenons pas la voiture aujourd’hui.",instruction:"اختر المعنى العربي الصحيح في هذا السياق.",choices:["لن نذهب بالسيارة اليوم.","نبحث عن السيارة اليوم.","نغسل السيارة اليوم."],correctIndex:0,explanation:"prendre la voiture يعني الذهاب بالسيارة، والجملة هنا تنفي ذلك اليوم."}
];

const A1_NUMBERS_TIME_PRACTICE_ITEMS:Example[]=[
 {fr:"Le billet coûte quarante-deux euros.",ar:"سعر التذكرة اثنان وأربعون يورو."},
 {fr:"J’habite au numéro soixante et onze.",ar:"أسكن في المبنى رقم واحد وسبعين."},
 {fr:"Mon numéro de téléphone commence par zéro six.",ar:"يبدأ رقم هاتفي بصفر ستة."},
 {fr:"Il est huit heures et quart.",ar:"الساعة الثامنة والربع."},
 {fr:"Le magasin ferme à dix-neuf heures trente.",ar:"يُغلق المتجر الساعة السابعة والنصف مساءً."},
 {fr:"Le train arrive à midi moins dix.",ar:"يصل القطار قبل الظهر بعشر دقائق."},
 {fr:"Nous sommes le premier avril.",ar:"اليوم هو الأول من أبريل."},
 {fr:"Mon rendez-vous est le jeudi douze octobre.",ar:"موعدي يوم الخميس الثاني عشر من أكتوبر."},
 {fr:"Je pars en vacances au mois d’août.",ar:"أسافر في إجازة خلال شهر أغسطس."},
 {fr:"La bibliothèque est ouverte du lundi au samedi.",ar:"المكتبة مفتوحة من الاثنين إلى السبت."}
];

const A1_NUMBERS_TIME_QUIZ_ITEMS:QuizQuestion[]=[
 {prompt:"72",speech:"Soixante-douze.",instruction:"اختر كتابة العدد 72 بالفرنسية.",choices:["soixante-douze","soixante-deux","quatre-vingt-douze"],correctIndex:0,explanation:"72 يُبنى من soixante + douze: soixante-douze."},
 {prompt:"81",speech:"Quatre-vingt-un.",instruction:"اختر كتابة العدد 81 بالفرنسية.",choices:["quatre-vingts-un","quatre-vingt-un","quatre et vingt-un"],correctIndex:1,explanation:"في 81 لا نكتب s في vingt ولا نضيف et: quatre-vingt-un."},
 {prompt:"Il est 9 h 30.",speech:"Il est neuf heures et demie.",instruction:"اختر التعبير الفرنسي المطابق للوقت.",choices:["Il est neuf heures moins le quart.","Il est dix heures et demie.","Il est neuf heures et demie."],correctIndex:2,explanation:"9 h 30 تعني neuf heures et demie."},
 {prompt:"Il est midi moins cinq.",speech:"Il est midi moins cinq.",instruction:"اختر الوقت الرقمي الصحيح.",choices:["11 h 55","12 h 05","12 h 50"],correctIndex:0,explanation:"midi moins cinq يعني خمس دقائق قبل الظهر: 11 h 55."},
 {prompt:"Le cours commence ___ huit heures.",speech:"Le cours commence à huit heures.",instruction:"اختر حرف الجر المستخدم مع الساعة.",choices:["en","à","le"],correctIndex:1,explanation:"نستخدم à قبل الساعة: à huit heures."},
 {prompt:"اليوم هو الأول من مايو.",speech:"Nous sommes le premier mai.",instruction:"اختر الترجمة الفرنسية الصحيحة.",choices:["Nous sommes le un mai.","Nous avons premier mai.","Nous sommes le premier mai."],correctIndex:2,explanation:"مع اليوم الأول من الشهر نستخدم premier: le premier mai."},
 {prompt:"Je travaille du lundi au vendredi.",speech:"Je travaille du lundi au vendredi.",instruction:"اختر المعنى العربي الصحيح.",choices:["أعمل من الاثنين إلى الجمعة.","أعمل يومي الاثنين والجمعة فقط.","لا أعمل من الاثنين إلى الجمعة."],correctIndex:0,explanation:"du … au … تعني من … إلى … ضمن مدة متصلة."},
 {prompt:"Quel jour vient après mercredi ?",speech:"Quel jour vient après mercredi ? Jeudi.",instruction:"أي يوم يأتي بعد mercredi؟",choices:["mardi","jeudi","vendredi"],correctIndex:1,explanation:"اليوم الذي يلي الأربعاء mercredi هو الخميس jeudi."},
 {prompt:"Quel mois vient avant décembre ?",speech:"Quel mois vient avant décembre ? Novembre.",instruction:"أي شهر يأتي قبل décembre؟",choices:["octobre","janvier","novembre"],correctIndex:2,explanation:"الشهر الذي يسبق ديسمبر décembre هو نوفمبر novembre."},
 {prompt:"Le musée ouvre à quatorze heures.",speech:"Le musée ouvre à quatorze heures.",instruction:"اختر الوقت المقابل بنظام 12 ساعة.",choices:["الثانية بعد الظهر.","الرابعة بعد الظهر.","الثانية صباحًا."],correctIndex:0,explanation:"14 h تساوي الثانية بعد الظهر في نظام 12 ساعة."}
];

const A1_DAILY_LIFE_PRACTICE_ITEMS:Example[]=[
 {fr:"Je me réveille à six heures et demie.",ar:"أستيقظ الساعة السادسة والنصف."},
 {fr:"Après la douche, je m’habille rapidement.",ar:"بعد الاستحمام، أرتدي ملابسي بسرعة."},
 {fr:"Mon frère prend son petit-déjeuner dans la cuisine.",ar:"يتناول أخي فطوره في المطبخ."},
 {fr:"Nous partons au travail à huit heures.",ar:"نغادر إلى العمل الساعة الثامنة."},
 {fr:"Elle déjeune souvent avec ses collègues.",ar:"غالبًا ما تتناول الغداء مع زملائها."},
 {fr:"Je fais les courses après le travail.",ar:"أتسوق بعد العمل."},
 {fr:"Les enfants font leurs devoirs avant le dîner.",ar:"ينجز الأطفال واجباتهم قبل العشاء."},
 {fr:"Le soir, nous nous reposons dans le salon.",ar:"في المساء، نستريح في غرفة الجلوس."},
 {fr:"Il ne se couche jamais après minuit.",ar:"لا يخلد إلى النوم بعد منتصف الليل أبدًا."},
 {fr:"Enfin, je prépare mes affaires pour demain.",ar:"وأخيرًا، أجهّز أغراضي للغد."}
];

const A1_DAILY_LIFE_QUIZ_ITEMS:QuizQuestion[]=[
 {prompt:"Je ___ lève à sept heures.",speech:"Complétez la phrase. Je me lève à sept heures.",instruction:"اختر الضمير الانعكاسي الصحيح مع je.",choices:["me","te","se"],correctIndex:0,explanation:"مع je نستخدم الضمير الانعكاسي me: je me lève."},
 {prompt:"Nous ___ préparons pour sortir.",speech:"Complétez la phrase. Nous nous préparons pour sortir.",instruction:"اختر الضمير الانعكاسي الصحيح مع nous.",choices:["vous","nous","se"],correctIndex:1,explanation:"مع nous يأتي الضمير الانعكاسي nous: nous nous préparons."},
 {prompt:"Elles ___ couchent tôt.",speech:"Complétez la phrase. Elles se couchent tôt.",instruction:"اختر الضمير الانعكاسي الصحيح مع elles.",choices:["me","nous","se"],correctIndex:2,explanation:"مع elles نستخدم se: elles se couchent."},
 {prompt:"Je ___ prends ___ le bus le dimanche.",speech:"Complétez la phrase. Je ne prends jamais le bus le dimanche.",instruction:"اختر صيغة «أبدًا» الصحيحة.",choices:["ne … jamais","jamais … ne","ne … souvent"],correctIndex:0,explanation:"نحيط الفعل بـ ne وjamais: je ne prends jamais."},
 {prompt:"Je vais ___ à la bibliothèque.",speech:"Complétez la phrase. Je vais souvent à la bibliothèque.",instruction:"اختر ظرف التكرار الذي يعني «غالبًا».",choices:["enfin","souvent","demain"],correctIndex:1,explanation:"souvent تعني غالبًا وتأتي هنا بعد الفعل المصرف."},
 {prompt:"___, je me brosse les dents et je me couche.",speech:"Complétez la phrase. Enfin, je me brosse les dents et je me couche.",instruction:"اختر الرابط المناسب لنهاية تسلسل الأحداث.",choices:["D’abord","Ensuite","Enfin"],correctIndex:2,explanation:"Enfin تعني «وأخيرًا» وتقدم آخر حدث في التسلسل."},
 {prompt:"Je rentre à la maison après le travail.",speech:"Je rentre à la maison après le travail.",instruction:"اختر المعنى العربي الصحيح.",choices:["أعود إلى المنزل بعد العمل.","أغادر المنزل قبل العمل.","أعمل من المنزل اليوم."],correctIndex:0,explanation:"rentrer à la maison يعني العودة إلى المنزل، وaprès تعني بعد."},
 {prompt:"قبل العشاء",speech:"Avant le dîner.",instruction:"اختر التعبير الفرنسي الصحيح.",choices:["après le dîner","avant le dîner","pendant le dîner"],correctIndex:1,explanation:"avant le dîner تعني قبل العشاء."},
 {prompt:"Elle fait les courses le samedi.",speech:"Elle fait les courses le samedi.",instruction:"ماذا تفعل يوم السبت؟",choices:["تستريح في المنزل.","تعد الغداء.","تتسوق."],correctIndex:2,explanation:"faire les courses تعني التسوق وشراء الاحتياجات."},
 {prompt:"D’abord, je consulte mes messages, puis je commence mon travail.",speech:"D’abord, je consulte mes messages, puis je commence mon travail.",instruction:"اختر الترجمة العربية الطبيعية في السياق.",choices:["أولًا، أتفقد رسائلي، ثم أبدأ عملي.","أبدأ عملي قبل قراءة الرسائل.","أنهي عملي ثم أرسل رسالة."],correctIndex:0,explanation:"D’abord تعني أولًا أو في البداية، وpuis تعني ثم."}
];

const A1_FRIENDS_PRACTICE_ITEMS:Example[]=[
 {fr:"Ça te dit d’aller au cinéma vendredi ?",ar:"ما رأيك أن نذهب إلى السينما يوم الجمعة؟"},
 {fr:"Avec plaisir ! À quelle heure commence le film ?",ar:"بكل سرور! في أي ساعة يبدأ الفيلم؟"},
 {fr:"On se retrouve devant le cinéma à sept heures.",ar:"نلتقي أمام السينما الساعة السابعة."},
 {fr:"Je suis désolé, je ne suis pas libre ce soir.",ar:"أنا آسف، لست متفرغًا هذا المساء."},
 {fr:"Ce n’est pas grave. Et demain, tu peux ?",ar:"لا بأس. وهل تستطيع غدًا؟"},
 {fr:"Je préfère prendre un café en terrasse.",ar:"أفضّل أن نتناول قهوة في الجلسة الخارجية."},
 {fr:"À mon avis, ce jeu est très amusant.",ar:"في رأيي، هذه اللعبة ممتعة جدًا."},
 {fr:"Je ne suis pas tout à fait d’accord avec toi.",ar:"لا أتفق معك تمامًا."},
 {fr:"Excuse-moi pour mon retard. Il y a beaucoup de circulation.",ar:"اعذرني على التأخير؛ فالازدحام شديد."},
 {fr:"Merci pour cette belle soirée, à bientôt !",ar:"شكرًا على هذه الأمسية الجميلة، أراك قريبًا!"}
];

const A1_FRIENDS_QUIZ_ITEMS:QuizQuestion[]=[
 {prompt:"___ d’aller au parc cet après-midi ?",speech:"Complétez l’invitation. Ça te dit d’aller au parc cet après-midi ?",instruction:"اختر العبارة الطبيعية لدعوة صديق.",choices:["Ça te dit","Est-ce que tu es","À mon avis"],correctIndex:0,explanation:"Ça te dit de + مصدر صيغة شائعة وغير رسمية لاقتراح نشاط على صديق."},
 {prompt:"— Tu veux venir avec nous ? — Oui, ___.",speech:"Tu veux venir avec nous ? Oui, avec plaisir.",instruction:"اختر الرد المناسب لقبول الدعوة.",choices:["je suis désolé","avec plaisir","je ne peux pas"],correctIndex:1,explanation:"Avec plaisir تعبير طبيعي لقبول الدعوة بسرور."},
 {prompt:"Je ne peux pas samedi. On peut ___ se voir dimanche ?",speech:"Je ne peux pas samedi. On peut plutôt se voir dimanche ?",instruction:"اختر الكلمة التي تقدم اقتراحًا بديلًا.",choices:["jamais","aussi","plutôt"],correctIndex:2,explanation:"plutôt تعني هنا «بدلًا من ذلك» وتقدم خيارًا بديلًا."},
 {prompt:"On se retrouve ___ la gare à dix heures.",speech:"On se retrouve devant la gare à dix heures.",instruction:"اختر كلمة المكان الصحيحة: أمام المحطة.",choices:["devant","pendant","avec"],correctIndex:0,explanation:"devant la gare تعني أمام المحطة."},
 {prompt:"À mon avis, ce restaurant est excellent.",speech:"À mon avis, ce restaurant est excellent.",instruction:"اختر المعنى العربي الصحيح.",choices:["لا أعرف هذا المطعم.","في رأيي، هذا المطعم ممتاز.","هذا المطعم مغلق اليوم."],correctIndex:1,explanation:"À mon avis تُستخدم لتقديم الرأي وتعني «في رأيي»."},
 {prompt:"Moi aussi, je suis d’accord.",speech:"Moi aussi, je suis d’accord.",instruction:"ماذا يعبّر المتحدث؟",choices:["عن الاعتذار.","عن رفض الدعوة.","عن الموافقة."],correctIndex:2,explanation:"je suis d’accord تعني أن المتحدث موافق."},
 {prompt:"___, je suis en retard.",speech:"Complétez la phrase. Désolé, je suis en retard.",instruction:"اختر كلمة الاعتذار المناسبة.",choices:["Désolé","Bienvenue","Bravo"],correctIndex:0,explanation:"Désolé تُستخدم للاعتذار، وهنا الاعتذار عن التأخر."},
 {prompt:"À quelle heure ?",speech:"À quelle heure ?",instruction:"اختر السؤال العربي المطابق.",choices:["في أي يوم؟","في أي ساعة؟","في أي مكان؟"],correctIndex:1,explanation:"À quelle heure ? سؤال عن الساعة أو الموعد."},
 {prompt:"Je ne suis pas libre ce soir.",speech:"Je ne suis pas libre ce soir.",instruction:"اختر الرد الأنسب للحفاظ على الحوار.",choices:["Le film est intéressant.","Je prends le métro.","Et demain, tu es libre ?"],correctIndex:2,explanation:"عند تعذر الموعد، من الطبيعي اقتراح وقت آخر بالسؤال عن الغد."},
 {prompt:"Merci pour l’invitation, mais je dois travailler.",speech:"Merci pour l’invitation, mais je dois travailler.",instruction:"اختر الترجمة العربية الطبيعية في السياق.",choices:["شكرًا على الدعوة، لكن يجب أن أعمل.","سأرسل لك دعوة بعد العمل.","أحب العمل مع أصدقائي."],correctIndex:0,explanation:"المتحدث يشكر على الدعوة ثم يعتذر عنها بسبب العمل."}
];

const A1_STRUCTURES_PRACTICE_ITEMS:Example[]=[
 {fr:"C’est ma carte d’étudiant.",ar:"هذه بطاقتي الجامعية."},
 {fr:"Ce sont les parents de Lina.",ar:"هذان والدا لينا."},
 {fr:"Ce n’est pas mon téléphone.",ar:"هذا ليس هاتفي."},
 {fr:"Ce ne sont pas nos places.",ar:"هذه ليست أماكننا."},
 {fr:"Il y a un arrêt de bus devant l’école.",ar:"توجد محطة حافلات أمام المدرسة."},
 {fr:"Il n’y a pas de toilettes à cet étage.",ar:"لا توجد دورات مياه في هذا الطابق."},
 {fr:"Est-ce qu’il y a une boulangerie près d’ici ?",ar:"هل يوجد مخبز بالقرب من هنا؟"},
 {fr:"Ce restaurant est ouvert aujourd’hui.",ar:"هذا المطعم مفتوح اليوم."},
 {fr:"Cet homme est le directeur de l’hôtel.",ar:"هذا الرجل هو مدير الفندق."},
 {fr:"Ces fleurs sont pour ma mère.",ar:"هذه الزهور لأمي."}
];

const A1_STRUCTURES_QUIZ_ITEMS:QuizQuestion[]=[
 {prompt:"___ une étudiante française.",speech:"Choisissez entre C’est et Ce sont. C’est une étudiante française.",instruction:"اختر صيغة التقديم الصحيحة للمفرد.",choices:["C’est","Ce sont","Il y a"],correctIndex:0,explanation:"نستخدم C’est قبل الاسم المفرد."},
 {prompt:"___ mes deux frères.",speech:"Choisissez entre C’est et Ce sont. Ce sont mes deux frères.",instruction:"اختر صيغة التقديم الصحيحة للجمع.",choices:["C’est","Ce sont","Cette"],correctIndex:1,explanation:"نستخدم Ce sont لتقديم اسم جمع."},
 {prompt:"Ce ___ pas mon passeport.",speech:"Complétez la négation. Ce n’est pas mon passeport.",instruction:"أكمل نفي C’est بصورة صحيحة.",choices:["ne sont","n’est","n’y a"],correctIndex:1,explanation:"نفي C’est هو Ce n’est pas."},
 {prompt:"___ une banque près de la gare.",speech:"Complétez avec Il y a. Il y a une banque près de la gare.",instruction:"اختر التعبير الذي يعني «توجد».",choices:["Il est","C’est","Il y a"],correctIndex:2,explanation:"Il y a تعني يوجد أو توجد."},
 {prompt:"Il n’y a pas ___ métro ici.",speech:"Complétez la phrase négative. Il n’y a pas de métro ici.",instruction:"اختر الأداة الصحيحة بعد النفي.",choices:["de","un","du"],correctIndex:0,explanation:"بعد Il n’y a pas نستخدم de قبل الاسم."},
 {prompt:"___ livre est intéressant.",speech:"Choisissez l’adjectif démonstratif. Ce livre est intéressant.",instruction:"اختر أداة الإشارة المناسبة لاسم مذكر مفرد يبدأ بصامت.",choices:["Cette","Ces","Ce"],correctIndex:2,explanation:"livre مذكر مفرد يبدأ بصامت؛ لذلك نستخدم ce."},
 {prompt:"___ hôtel est moderne.",speech:"Choisissez l’adjectif démonstratif. Cet hôtel est moderne.",instruction:"اختر أداة الإشارة المناسبة لاسم مذكر يبدأ بـ h صامت.",choices:["Cet","Ce","Cette"],correctIndex:0,explanation:"نستخدم cet قبل الاسم المذكر الذي يبدأ بصوت متحرك."},
 {prompt:"___ maison est grande.",speech:"Choisissez l’adjectif démonstratif. Cette maison est grande.",instruction:"اختر أداة الإشارة المناسبة لاسم مؤنث مفرد.",choices:["Ce","Cette","Ces"],correctIndex:1,explanation:"maison مؤنث مفرد؛ لذلك نستخدم cette."},
 {prompt:"___ enfants jouent dans le jardin.",speech:"Choisissez l’adjectif démonstratif. Ces enfants jouent dans le jardin.",instruction:"اختر أداة الإشارة المناسبة للجمع.",choices:["Cet","Cette","Ces"],correctIndex:2,explanation:"نستخدم ces مع جميع أسماء الجمع."},
 {prompt:"Est-ce qu’___ un ascenseur ?",speech:"Complétez la question. Est-ce qu’il y a un ascenseur ?",instruction:"أكمل السؤال عن وجود المصعد.",choices:["il est","il y a","c’est"],correctIndex:1,explanation:"صيغة السؤال هي Est-ce qu’il y a… ?"}
];

const A1_FOOD_SHOPPING_PRACTICE_ITEMS:Example[]=[
 {fr:"Au petit-déjeuner, je bois du lait.",ar:"أشرب الحليب في الإفطار."},
 {fr:"Tu veux de la salade avec le poisson ?",ar:"هل تريد سلطة مع السمك؟"},
 {fr:"Elle met de l’huile dans la poêle.",ar:"تضع الزيت في المقلاة."},
 {fr:"Nous achetons des légumes frais.",ar:"نشتري خضراوات طازجة."},
 {fr:"Je ne mange pas de viande.",ar:"لا أتناول اللحم."},
 {fr:"Il faut deux cents grammes de fromage.",ar:"نحتاج إلى مئتي غرام من الجبن."},
 {fr:"Je voudrais une tasse de thé, s’il vous plaît.",ar:"أرغب في كوب من الشاي، من فضلك."},
 {fr:"Vous avez du pain complet ?",ar:"هل لديكم خبز كامل الحبوب؟"},
 {fr:"Combien coûtent ces oranges ?",ar:"كم سعر هذه البرتقالات؟"},
 {fr:"Je vais payer en espèces.",ar:"سأدفع نقدًا."}
];

const A1_FOOD_SHOPPING_QUIZ_ITEMS:QuizQuestion[]=[
 {prompt:"Je mange ___ pain.",speech:"Complétez la phrase. Je mange du pain.",instruction:"اختر أداة التجزئة المناسبة للاسم المذكر.",choices:["de la","du","des"],correctIndex:1,explanation:"pain اسم مذكر؛ لذلك نستخدم du."},
 {prompt:"Elle prépare ___ soupe.",speech:"Complétez la phrase. Elle prépare de la soupe.",instruction:"اختر أداة التجزئة المناسبة للاسم المؤنث.",choices:["de la","du","de l’"],correctIndex:0,explanation:"soupe اسم مؤنث؛ لذلك نستخدم de la."},
 {prompt:"Nous buvons ___ eau.",speech:"Complétez la phrase. Nous buvons de l’eau.",instruction:"اختر الأداة المناسبة قبل الاسم الذي يبدأ بصوت متحرك.",choices:["des","du","de l’"],correctIndex:2,explanation:"نستخدم de l’ قبل الاسم الذي يبدأ بصوت متحرك."},
 {prompt:"Ils achètent ___ fraises.",speech:"Complétez la phrase. Ils achètent des fraises.",instruction:"اختر الأداة المناسبة لاسم الجمع.",choices:["des","de la","du"],correctIndex:0,explanation:"fraises اسم جمع؛ لذلك نستخدم des."},
 {prompt:"Je ne prends pas ___ sucre.",speech:"Complétez la négation. Je ne prends pas de sucre.",instruction:"اختر الأداة الصحيحة بعد النفي.",choices:["du","de","le"],correctIndex:1,explanation:"بعد النفي تتحول أداة التجزئة إلى de."},
 {prompt:"Une bouteille ___ jus de pomme.",speech:"Complétez l’expression de quantité. Une bouteille de jus de pomme.",instruction:"اختر حرف الربط الصحيح بعد المقدار.",choices:["du","de la","de"],correctIndex:2,explanation:"بعد تعبير الكمية une bouteille نستخدم de."},
 {prompt:"J’aime ___ fromage.",speech:"Complétez la phrase. J’aime le fromage.",instruction:"اختر الأداة الصحيحة بعد فعل الإعجاب للتحدث عن الطعام عمومًا.",choices:["le","du","de"],correctIndex:0,explanation:"بعد aimer نستخدم أداة المعرفة عند الحديث عن الشيء بصفة عامة."},
 {prompt:"___ un café, s’il vous plaît.",speech:"Formulez une demande polie. Je voudrais un café, s’il vous plaît.",instruction:"اختر العبارة المهذبة المناسبة للطلب.",choices:["Je vais","Je voudrais","Je suis"],correctIndex:1,explanation:"Je voudrais صيغة بسيطة ومهذبة لطلب شيء."},
 {prompt:"___ coûte ce fromage ?",speech:"Posez la question du prix. Combien coûte ce fromage ?",instruction:"اختر أداة السؤال عن السعر.",choices:["Comment","Pourquoi","Combien"],correctIndex:2,explanation:"Combien coûte… ؟ تعني كم سعر…؟"},
 {prompt:"Je paie par carte.",speech:"Je paie par carte.",instruction:"اختر المعنى العربي الصحيح.",choices:["سأدفع بالبطاقة.","أحتاج إلى بطاقة.","سعر البطاقة مرتفع."],correctIndex:0,explanation:"payer par carte تعني الدفع بالبطاقة."}
];

const A1_CITY_DIRECTIONS_PRACTICE_ITEMS:Example[]=[
 {fr:"Je vais à la poste à pied.",ar:"أذهب إلى مكتب البريد مشيًا."},
 {fr:"Nous prenons le train à la gare centrale.",ar:"نستقل القطار من المحطة المركزية."},
 {fr:"Elle revient du supermarché en voiture.",ar:"تعود من السوبرماركت بالسيارة."},
 {fr:"Le métro arrive de l’aéroport.",ar:"يصل المترو من المطار."},
 {fr:"Excusez-moi, pour aller à l’hôpital ?",ar:"عذرًا، كيف أصل إلى المستشفى؟"},
 {fr:"Continuez tout droit pendant deux minutes.",ar:"تابع السير مباشرة لمدة دقيقتين."},
 {fr:"Prenez la première rue à droite.",ar:"اسلك أول شارع على اليمين."},
 {fr:"Traversez la place devant la mairie.",ar:"اعبر الساحة أمام مبنى البلدية."},
 {fr:"La boulangerie est entre la banque et le café.",ar:"يقع المخبز بين البنك والمقهى."},
 {fr:"L’arrêt de bus est à côté de l’école.",ar:"تقع محطة الحافلات بجوار المدرسة."}
];

const A1_CITY_DIRECTIONS_QUIZ_ITEMS:QuizQuestion[]=[
 {prompt:"Je vais ___ marché.",speech:"Complétez la phrase. Je vais au marché.",instruction:"اختر الشكل الصحيح لـ à مع اسم مذكر معرف.",choices:["à le","au","du"],correctIndex:1,explanation:"تندمج à مع le وتصبح au."},
 {prompt:"Elle va ___ banque.",speech:"Complétez la phrase. Elle va à la banque.",instruction:"اختر حرف الجر والأداة المناسبين للاسم المؤنث.",choices:["à la","au","de la"],correctIndex:0,explanation:"مع الاسم المؤنث نقول à la."},
 {prompt:"Nous allons ___ aéroport.",speech:"Complétez la phrase. Nous allons à l’aéroport.",instruction:"اختر الشكل المناسب قبل الاسم الذي يبدأ بصوت متحرك.",choices:["au","à l’","aux"],correctIndex:1,explanation:"نستخدم à l’ قبل الاسم الذي يبدأ بصوت متحرك."},
 {prompt:"Ils vont ___ magasins.",speech:"Complétez la phrase. Ils vont aux magasins.",instruction:"اختر الشكل الصحيح لـ à مع اسم جمع معرف.",choices:["aux","à les","des"],correctIndex:0,explanation:"تندمج à مع les وتصبح aux."},
 {prompt:"Le bus part ___ centre-ville.",speech:"Complétez la phrase. Le bus part du centre-ville.",instruction:"اختر الشكل الصحيح لـ de مع اسم مذكر معرف.",choices:["de le","au","du"],correctIndex:2,explanation:"تندمج de مع le وتصبح du."},
 {prompt:"Nous revenons ___ magasins.",speech:"Complétez la phrase. Nous revenons des magasins.",instruction:"اختر الشكل الصحيح لـ de مع اسم جمع معرف.",choices:["aux","des","de les"],correctIndex:1,explanation:"تندمج de مع les وتصبح des."},
 {prompt:"___ se trouve la gare ?",speech:"Posez la question. Où se trouve la gare ?",instruction:"اختر أداة السؤال عن المكان.",choices:["Quand","Où","Combien"],correctIndex:1,explanation:"Où تستخدم للسؤال عن المكان."},
 {prompt:"Allez tout ___.",speech:"Complétez l’instruction. Allez tout droit.",instruction:"أكمل تعليمات السير مباشرة.",choices:["droit","droite","devant"],correctIndex:0,explanation:"التعبير الثابت هو aller tout droit."},
 {prompt:"Tournez ___ gauche après le café.",speech:"Complétez l’instruction. Tournez à gauche après le café.",instruction:"اختر حرف الجر الصحيح مع الاتجاه.",choices:["de","en","à"],correctIndex:2,explanation:"نقول à gauche وà droite."},
 {prompt:"Le musée est en face du parc.",speech:"Le musée est en face du parc.",instruction:"اختر المعنى العربي الصحيح.",choices:["يقع المتحف خلف الحديقة.","يقع المتحف مقابل الحديقة.","يقع المتحف داخل الحديقة."],correctIndex:1,explanation:"en face de تعني مقابل."}
];

const A1_WEATHER_CLOTHES_PRACTICE_ITEMS:Example[]=[
 {fr:"Ce matin, le ciel est gris et il fait froid.",ar:"هذا الصباح السماء غائمة والجو بارد."},
 {fr:"Il y a beaucoup de vent près de la mer.",ar:"تهب رياح قوية بالقرب من البحر."},
 {fr:"Demain, il va pleuvoir dans le nord.",ar:"ستمطر غدًا في الشمال."},
 {fr:"La température est de vingt-cinq degrés.",ar:"درجة الحرارة خمس وعشرون درجة."},
 {fr:"Au printemps, je me promène dans les parcs.",ar:"في الربيع أتنزه في الحدائق."},
 {fr:"En été, nous allons souvent à la plage.",ar:"في الصيف نذهب كثيرًا إلى الشاطئ."},
 {fr:"En automne, les feuilles changent de couleur.",ar:"في الخريف يتغير لون أوراق الأشجار."},
 {fr:"En hiver, je porte un manteau chaud.",ar:"في الشتاء أرتدي معطفًا دافئًا."},
 {fr:"Il fait chaud, mets un tee-shirt léger.",ar:"الجو حار، ارتدِ قميصًا خفيفًا."},
 {fr:"N’oublie pas ton parapluie aujourd’hui.",ar:"لا تنسَ مظلتك اليوم."}
];

const A1_WEATHER_CLOTHES_QUIZ_ITEMS:QuizQuestion[]=[
 {prompt:"Quel temps ___-il ?",speech:"Complétez la question. Quel temps fait-il ?",instruction:"أكمل السؤال الشائع عن الطقس.",choices:["est","fait","a"],correctIndex:1,explanation:"السؤال الثابت هو Quel temps fait-il ؟"},
 {prompt:"Il ___ froid aujourd’hui.",speech:"Complétez la phrase. Il fait froid aujourd’hui.",instruction:"اختر الفعل الصحيح لوصف برودة الجو.",choices:["fait","est","a"],correctIndex:0,explanation:"نستخدم il fait مع chaud وfroid."},
 {prompt:"Il y a ___ vent.",speech:"Complétez la phrase. Il y a du vent.",instruction:"اختر الأداة الصحيحة في التعبير عن وجود الرياح.",choices:["de la","des","du"],correctIndex:2,explanation:"التعبير الثابت هو Il y a du vent."},
 {prompt:"Il ___ depuis ce matin.",speech:"Complétez la phrase. Il pleut depuis ce matin.",instruction:"اختر الفعل الذي يعني أن المطر يهطل.",choices:["pleut","neige","porte"],correctIndex:0,explanation:"Il pleut تعني تمطر."},
 {prompt:"___ printemps, les fleurs apparaissent.",speech:"Complétez la phrase. Au printemps, les fleurs apparaissent.",instruction:"اختر حرف الجر الصحيح مع فصل الربيع.",choices:["En","À la","Au"],correctIndex:2,explanation:"نقول au printemps."},
 {prompt:"___ été, il fait chaud.",speech:"Complétez la phrase. En été, il fait chaud.",instruction:"اختر حرف الجر الصحيح مع فصل الصيف.",choices:["En","Au","Aux"],correctIndex:0,explanation:"نقول en été."},
 {prompt:"Je ___ un manteau noir.",speech:"Complétez la phrase. Je porte un manteau noir.",instruction:"اختر الفعل المناسب لوصف الملابس التي ترتديها.",choices:["pleut","porte","fait"],correctIndex:1,explanation:"porter يستخدم لوصف الملابس التي يرتديها الشخص."},
 {prompt:"Mets ton manteau, ___ il fait froid.",speech:"Complétez la phrase. Mets ton manteau, parce qu’il fait froid.",instruction:"اختر الرابط الذي يوضح السبب.",choices:["mais","puis","parce qu’"],correctIndex:2,explanation:"parce que يقدّم سبب ارتداء المعطف."},
 {prompt:"une veste ___.",speech:"Choisissez l’accord correct. Une veste noire.",instruction:"اختر صيغة اللون الموافقة للاسم المؤنث.",choices:["noire","noir","noirs"],correctIndex:0,explanation:"veste مؤنث مفرد، ولذلك تصبح noir إلى noire."},
 {prompt:"Elle prend son parapluie.",speech:"Elle prend son parapluie.",instruction:"اختر المعنى العربي الصحيح.",choices:["ترتدي حذاءها.","تأخذ مظلتها.","تغلق نافذتها."],correctIndex:1,explanation:"prendre son parapluie تعني أخذ المظلة."}
];

const A1_HOME_HOUSING_PRACTICE_ITEMS:Example[]=[
 {fr:"Je vis dans une petite maison avec un jardin.",ar:"أعيش في منزل صغير له حديقة."},
 {fr:"Mon appartement se trouve au troisième étage.",ar:"تقع شقتي في الطابق الثالث."},
 {fr:"Il y a deux chambres et une salle de bains.",ar:"توجد غرفتا نوم وحمام واحد."},
 {fr:"Nous mangeons dans la cuisine.",ar:"نتناول الطعام في المطبخ."},
 {fr:"La télévision est devant le canapé.",ar:"يقع التلفاز أمام الأريكة."},
 {fr:"La lampe est à côté du lit.",ar:"يقع المصباح بجوار السرير."},
 {fr:"Mes vêtements sont dans l’armoire.",ar:"ملابسي داخل الخزانة."},
 {fr:"Le chat dort sous la chaise.",ar:"تنام القطة تحت الكرسي."},
 {fr:"Ma chambre est claire et confortable.",ar:"غرفة نومي مضيئة ومريحة."},
 {fr:"Chez moi, le salon donne sur le jardin.",ar:"في منزلي، تطل غرفة الجلوس على الحديقة."}
];

const A1_HOME_HOUSING_QUIZ_ITEMS:QuizQuestion[]=[
 {prompt:"J’___ dans un appartement.",speech:"Complétez la phrase. J’habite dans un appartement.",instruction:"اختر الفعل المناسب للتعبير عن مكان السكن.",choices:["habite","porte","tourne"],correctIndex:0,explanation:"habiter يعني يسكن."},
 {prompt:"Il y a un lit dans la ___.",speech:"Complétez la phrase. Il y a un lit dans la chambre.",instruction:"اختر الغرفة التي يوجد فيها السرير عادةً.",choices:["cuisine","chambre","salle de bains"],correctIndex:1,explanation:"un lit يوجد عادةً في une chambre."},
 {prompt:"Nous préparons le repas dans la ___.",speech:"Complétez la phrase. Nous préparons le repas dans la cuisine.",instruction:"اختر اسم الغرفة المناسب.",choices:["cuisine","chambre","balcon"],correctIndex:0,explanation:"نحضّر الطعام في المطبخ: la cuisine."},
 {prompt:"Le livre est ___ la table.",speech:"Complétez la phrase. Le livre est sur la table.",instruction:"اختر حرف المكان الذي يعني «فوق».",choices:["sous","dans","sur"],correctIndex:2,explanation:"sur تعني فوق أو على."},
 {prompt:"Les chaussures sont ___ le lit.",speech:"Complétez la phrase. Les chaussures sont sous le lit.",instruction:"اختر حرف المكان الذي يعني «تحت».",choices:["devant","sous","entre"],correctIndex:1,explanation:"sous تعني تحت."},
 {prompt:"La table est ___ les deux chaises.",speech:"Complétez la phrase. La table est entre les deux chaises.",instruction:"اختر حرف المكان الذي يعني «بين».",choices:["entre","derrière","sur"],correctIndex:0,explanation:"entre تعني بين."},
 {prompt:"L’armoire est en face ___ lit.",speech:"Complétez la phrase. L’armoire est en face du lit.",instruction:"اختر الشكل الصحيح بعد en face de مع اسم مذكر معرف.",choices:["au","du","le"],correctIndex:1,explanation:"de مع le تندمج لتصبح du."},
 {prompt:"J’habite ___ deuxième étage.",speech:"Complétez la phrase. J’habite au deuxième étage.",instruction:"اختر حرف الجر والأداة الصحيحين مع الطابق.",choices:["du","aux","au"],correctIndex:2,explanation:"نقول au deuxième étage."},
 {prompt:"L’appartement est petit, ___ lumineux.",speech:"Complétez la phrase. L’appartement est petit, mais lumineux.",instruction:"اختر الرابط المناسب للجمع بين صفتين متقابلتين.",choices:["mais","ou","parce que"],correctIndex:0,explanation:"mais تعني لكن وتربط فكرتين متقابلتين."},
 {prompt:"Ma pièce préférée est le salon.",speech:"Ma pièce préférée est le salon.",instruction:"اختر المعنى العربي الصحيح.",choices:["غرفة نومي بجوار الصالة.","غرفتي المفضلة هي غرفة الجلوس.","منزلي لا يحتوي على غرفة جلوس."],correctIndex:1,explanation:"la pièce préférée تعني الغرفة المفضلة."}
];

const A1_MODAL_VERBS_PRACTICE_ITEMS:Example[]=[
 {fr:"Tu peux répéter plus lentement ?",ar:"هل يمكنك التكرار ببطء أكثر؟"},
 {fr:"On peut prendre le métro jusqu’au centre.",ar:"يمكننا استقلال المترو حتى وسط المدينة."},
 {fr:"Vous pouvez payer par carte.",ar:"يمكنكم الدفع بالبطاقة."},
 {fr:"Je ne peux pas ouvrir cette porte.",ar:"لا أستطيع فتح هذا الباب."},
 {fr:"Nous voulons réserver une chambre pour deux nuits.",ar:"نريد حجز غرفة لليلتين."},
 {fr:"Elle veut acheter une veste bleue.",ar:"تريد شراء سترة زرقاء."},
 {fr:"Vous voulez autre chose ?",ar:"هل ترغبون في شيء آخر؟"},
 {fr:"Je dois prendre ce médicament le matin.",ar:"يجب عليّ تناول هذا الدواء صباحًا."},
 {fr:"Nous devons partir avant huit heures.",ar:"يجب علينا المغادرة قبل الساعة الثامنة."},
 {fr:"Il faut traverser au passage piéton.",ar:"يجب العبور من ممر المشاة."}
];

const A1_MODAL_VERBS_QUIZ_ITEMS:QuizQuestion[]=[
 {prompt:"Je ___ parler français.",speech:"Complétez la phrase. Je peux parler français.",instruction:"اختر تصريف pouvoir الصحيح مع je.",choices:["peut","peux","pouvons"],correctIndex:1,explanation:"مع je نقول je peux."},
 {prompt:"Nous ___ vous aider.",speech:"Complétez la phrase. Nous pouvons vous aider.",instruction:"اختر تصريف pouvoir الصحيح مع nous.",choices:["pouvons","pouvez","peuvent"],correctIndex:0,explanation:"مع nous نقول nous pouvons."},
 {prompt:"Ils ne ___ pas venir.",speech:"Complétez la phrase. Ils ne peuvent pas venir.",instruction:"اختر تصريف pouvoir الصحيح مع ils.",choices:["pouvez","peut","peuvent"],correctIndex:2,explanation:"مع ils نقول ils peuvent."},
 {prompt:"Tu ___ prendre un café ?",speech:"Complétez la phrase. Tu veux prendre un café ?",instruction:"اختر تصريف vouloir الصحيح مع tu.",choices:["veux","veut","voulez"],correctIndex:0,explanation:"مع tu نقول tu veux."},
 {prompt:"Elles ___ visiter Paris.",speech:"Complétez la phrase. Elles veulent visiter Paris.",instruction:"اختر تصريف vouloir الصحيح مع elles.",choices:["voulons","veulent","voulez"],correctIndex:1,explanation:"مع elles نقول elles veulent."},
 {prompt:"___ un verre d’eau, s’il vous plaît.",speech:"Formulez une demande polie. Je voudrais un verre d’eau, s’il vous plaît.",instruction:"اختر الصيغة الأكثر تهذيبًا للطلب.",choices:["Je suis","Je dois","Je voudrais"],correctIndex:2,explanation:"Je voudrais صيغة مهذبة للطلب."},
 {prompt:"Je ___ partir maintenant.",speech:"Complétez la phrase. Je dois partir maintenant.",instruction:"اختر تصريف devoir الصحيح مع je.",choices:["dois","doit","devons"],correctIndex:0,explanation:"مع je نقول je dois."},
 {prompt:"Vous ___ attendre ici.",speech:"Complétez la phrase. Vous devez attendre ici.",instruction:"اختر تصريف devoir الصحيح مع vous.",choices:["doivent","devez","dois"],correctIndex:1,explanation:"مع vous نقول vous devez."},
 {prompt:"Il ___ respecter les règles.",speech:"Complétez la nécessité générale. Il faut respecter les règles.",instruction:"اختر التعبير عن ضرورة عامة.",choices:["peut","veut","faut"],correctIndex:2,explanation:"Il faut + مصدر يعبّر عن ضرورة عامة."},
 {prompt:"Il ne faut pas fumer ici.",speech:"Il ne faut pas fumer ici.",instruction:"اختر المعنى العربي الصحيح.",choices:["لا يمكنني الانتظار هنا.","يُمنع التدخين هنا.","أريد الخروج من هنا."],correctIndex:1,explanation:"Il ne faut pas fumer تعني أن التدخين ممنوع."}
];

const A1_FUTURE_IMPERATIVE_PRACTICE_ITEMS:Example[]=[
 {fr:"Je vais appeler le médecin cet après-midi.",ar:"سأتصل بالطبيب بعد ظهر اليوم."},
 {fr:"Elle va acheter les billets en ligne.",ar:"ستشتري التذاكر عبر الإنترنت."},
 {fr:"Vous allez arriver à neuf heures.",ar:"ستصلون الساعة التاسعة."},
 {fr:"Nous allons dîner chez nos amis demain.",ar:"سنتناول العشاء عند أصدقائنا غدًا."},
 {fr:"Tu ne vas pas oublier ton rendez-vous.",ar:"لن تنسى موعدك."},
 {fr:"Ils ne vont pas prendre la voiture.",ar:"لن يستقلوا السيارة."},
 {fr:"Écoutez attentivement la question.",ar:"استمعوا إلى السؤال بانتباه."},
 {fr:"Ouvre le livre à la page dix.",ar:"افتح الكتاب على الصفحة العاشرة."},
 {fr:"Prenons une pause de cinq minutes.",ar:"لنأخذ استراحة لمدة خمس دقائق."},
 {fr:"Ne traversez pas quand le feu est rouge.",ar:"لا تعبروا عندما تكون الإشارة حمراء."}
];

const A1_FUTURE_IMPERATIVE_QUIZ_ITEMS:QuizQuestion[]=[
 {prompt:"Je ___ préparer le repas.",speech:"Complétez le futur proche. Je vais préparer le repas.",instruction:"اختر تصريف aller الصحيح مع je.",choices:["va","vais","allons"],correctIndex:1,explanation:"المستقبل القريب مع je يبدأ بـ je vais."},
 {prompt:"Nous ___ visiter le musée.",speech:"Complétez le futur proche. Nous allons visiter le musée.",instruction:"اختر تصريف aller الصحيح مع nous.",choices:["allons","allez","vont"],correctIndex:0,explanation:"مع nous نقول nous allons + المصدر."},
 {prompt:"Elles ___ commencer le cours.",speech:"Complétez le futur proche. Elles vont commencer le cours.",instruction:"اختر تصريف aller الصحيح مع elles.",choices:["vas","va","vont"],correctIndex:2,explanation:"مع elles نقول elles vont + المصدر."},
 {prompt:"Je ne vais pas ___ samedi.",speech:"Complétez la phrase négative. Je ne vais pas travailler samedi.",instruction:"اختر شكل الفعل الذي يأتي بعد aller.",choices:["travaille","travailler","travaillé"],correctIndex:1,explanation:"بعد aller يأتي الفعل في المصدر: travailler."},
 {prompt:"___, nous allons prendre le train.",speech:"Complétez avec un indicateur de temps futur. Demain, nous allons prendre le train.",instruction:"اختر مؤشر الزمن المناسب لخطة مستقبلية.",choices:["Hier","Maintenant","Demain"],correctIndex:2,explanation:"demain تعني غدًا وتناسب المستقبل القريب."},
 {prompt:"___ le livre !",speech:"Donnez l’instruction avec tu. Ouvre le livre !",instruction:"اختر صيغة الأمر من ouvrir مع tu.",choices:["Ouvre","Ouvres","Ouvrez"],correctIndex:0,explanation:"صيغة الأمر مع tu هي ouvre من دون ضمير."},
 {prompt:"___ la question !",speech:"Donnez l’instruction avec vous. Écoutez la question !",instruction:"اختر صيغة الأمر من écouter مع vous.",choices:["Écoute","Écoutons","Écoutez"],correctIndex:2,explanation:"صيغة الأمر مع vous هي écoutez."},
 {prompt:"___ au parc ensemble !",speech:"Faites une proposition avec nous. Allons au parc ensemble !",instruction:"اختر صيغة الأمر من aller مع nous.",choices:["Allez","Allons","Vont"],correctIndex:1,explanation:"صيغة الأمر من aller مع nous هي allons."},
 {prompt:"Ne ___ pas cette porte !",speech:"Donnez l’ordre négatif. Ne fermez pas cette porte !",instruction:"اختر صيغة الأمر المنفي مع vous.",choices:["fermez","fermer","fermons"],correctIndex:0,explanation:"نضع ne وpas حول صيغة الأمر: Ne fermez pas."},
 {prompt:"Ce soir, on va regarder un film.",speech:"Ce soir, on va regarder un film.",instruction:"اختر المعنى العربي الصحيح.",choices:["شاهدنا فيلمًا مساء أمس.","نشاهد الأفلام كل مساء.","سنشاهد فيلمًا هذا المساء."],correctIndex:2,explanation:"aller + المصدر هنا يعبّر عن خطة هذا المساء."}
];

const A1_HEALTH_NEEDS_PRACTICE_ITEMS:Example[]=[
 {fr:"Je ne me sens pas bien ce matin.",ar:"لا أشعر أنني بخير هذا الصباح."},
 {fr:"Il a un rhume et il tousse beaucoup.",ar:"لديه زكام ويسعل كثيرًا."},
 {fr:"Nous avons mal au dos.",ar:"نشعر بألم في الظهر."},
 {fr:"Elle a mal à l’oreille droite.",ar:"تشعر بألم في أذنها اليمنى."},
 {fr:"Est-ce que vous avez de la fièvre ?",ar:"هل لديكم حمى؟"},
 {fr:"Le médecin est disponible à quinze heures.",ar:"الطبيب متاح الساعة الثالثة عصرًا."},
 {fr:"J’ai une ordonnance pour ce médicament.",ar:"لدي وصفة طبية لهذا الدواء."},
 {fr:"Prenez ce sirop trois fois par jour.",ar:"تناولوا هذا الشراب ثلاث مرات يوميًا."},
 {fr:"Mon ami ne peut pas marcher.",ar:"لا يستطيع صديقي المشي."},
 {fr:"Je suis allergique aux noix.",ar:"لدي حساسية تجاه المكسرات."}
];

const A1_HEALTH_NEEDS_QUIZ_ITEMS:QuizQuestion[]=[
 {prompt:"J’___ de la fièvre.",speech:"Complétez la phrase. J’ai de la fièvre.",instruction:"اختر الفعل الصحيح مع الحمى.",choices:["ai","suis","fais"],correctIndex:0,explanation:"نقول avoir de la fièvre: j’ai de la fièvre."},
 {prompt:"Je ___ malade.",speech:"Complétez la phrase. Je suis malade.",instruction:"اختر الفعل الصحيح لوصف الحالة العامة.",choices:["fais","ai","suis"],correctIndex:2,explanation:"نستخدم être مع malade: je suis malade."},
 {prompt:"Elle a mal ___ tête.",speech:"Complétez la phrase. Elle a mal à la tête.",instruction:"اختر حرف الجر والأداة المناسبين مع الرأس.",choices:["au","à la","aux"],correctIndex:1,explanation:"tête مؤنث؛ لذلك نقول à la tête."},
 {prompt:"Il a mal ___ ventre.",speech:"Complétez la phrase. Il a mal au ventre.",instruction:"اختر الشكل الصحيح مع اسم مذكر معرف.",choices:["au","à la","aux"],correctIndex:0,explanation:"à مع le تندمج وتصبح au."},
 {prompt:"J’ai mal ___ dents.",speech:"Complétez la phrase. J’ai mal aux dents.",instruction:"اختر الشكل الصحيح مع اسم جمع معرف.",choices:["des","aux","à la"],correctIndex:1,explanation:"à مع les تندمج وتصبح aux."},
 {prompt:"___ quand avez-vous mal ?",speech:"Posez la question. Depuis quand avez-vous mal ?",instruction:"اختر الكلمة التي تسأل عن بداية الألم.",choices:["Depuis","Comment","Combien"],correctIndex:0,explanation:"Depuis quand ؟ تعني منذ متى؟"},
 {prompt:"Je voudrais ___ rendez-vous.",speech:"Complétez la phrase. Je voudrais prendre rendez-vous.",instruction:"اختر الفعل المستخدم مع حجز الموعد.",choices:["faire un","prendre","avoir à"],correctIndex:1,explanation:"التعبير الصحيح هو prendre rendez-vous."},
 {prompt:"Prenez ce médicament ___ le repas.",speech:"Complétez l’instruction. Prenez ce médicament après le repas.",instruction:"اختر الكلمة المناسبة لتوقيت تناول الدواء.",choices:["entre","sous","après"],correctIndex:2,explanation:"après le repas تعني بعد الوجبة."},
 {prompt:"J’ai besoin ___ aide.",speech:"Complétez la phrase. J’ai besoin d’aide.",instruction:"اختر الصيغة الصحيحة بعد avoir besoin.",choices:["d’","à l’","de l’"],correctIndex:0,explanation:"نقول avoir besoin de، وتصبح d’ قبل صوت متحرك."},
 {prompt:"Je suis allergique à ce médicament.",speech:"Je suis allergique à ce médicament.",instruction:"اختر المعنى العربي الصحيح.",choices:["نسيت تناول هذا الدواء.","أحتاج إلى وصفة لهذا الدواء.","لدي حساسية تجاه هذا الدواء."],correctIndex:2,explanation:"être allergique à تعني أن لدى الشخص حساسية تجاه شيء."}
];

const A1_QUESTIONS_PRACTICE_ITEMS:Example[]=[
 {fr:"Est-ce que tu habites près d’ici ?",ar:"هل تسكن بالقرب من هنا؟"},
 {fr:"Vous avez une réservation ? — Oui, au nom de Sami.",ar:"هل لديكم حجز؟ — نعم، باسم سامي."},
 {fr:"Elle vient avec nous ? — Non, elle travaille.",ar:"هل ستأتي معنا؟ — لا، إنها تعمل."},
 {fr:"Qui est cette personne ?",ar:"من هذا الشخص؟"},
 {fr:"Où se trouve la station de métro ?",ar:"أين توجد محطة المترو؟"},
 {fr:"Quand commence le prochain cours ?",ar:"متى يبدأ الدرس القادم؟"},
 {fr:"Comment allez-vous à l’université ?",ar:"كيف تذهبون إلى الجامعة؟"},
 {fr:"Combien coûte ce billet ?",ar:"كم سعر هذه التذكرة؟"},
 {fr:"Quel bus va au centre-ville ?",ar:"أي حافلة تذهب إلى وسط المدينة؟"},
 {fr:"Quelle couleur préfères-tu ?",ar:"أي لون تفضل؟"}
];

const A1_QUESTIONS_QUIZ_ITEMS:QuizQuestion[]=[
 {prompt:"___ vous habitez ici ?",speech:"Complétez la question. Est-ce que vous habitez ici ?",instruction:"اختر بداية سؤال نعم أو لا.",choices:["Est-ce que","Qu’est-ce que","Pourquoi est-ce que"],correctIndex:0,explanation:"Est-ce que توضع قبل جملة لتكوين سؤال نعم أو لا."},
 {prompt:"Tu parles français ? — ___, un peu.",speech:"Complétez la réponse affirmative. Oui, un peu.",instruction:"اختر إجابة الإثبات المناسبة.",choices:["Non","Oui","Pourquoi"],correctIndex:1,explanation:"Oui تستخدم للإجابة المثبتة."},
 {prompt:"___ est votre professeur ?",speech:"Complétez la question. Qui est votre professeur ?",instruction:"اختر أداة السؤال عن شخص.",choices:["Où","Quand","Qui"],correctIndex:2,explanation:"Qui تعني مَن."},
 {prompt:"___ habitez-vous ?",speech:"Complétez la question. Où habitez-vous ?",instruction:"اختر أداة السؤال عن المكان.",choices:["Où","Comment","Combien"],correctIndex:0,explanation:"Où تعني أين."},
 {prompt:"___ commence le film ?",speech:"Complétez la question. Quand commence le film ?",instruction:"اختر أداة السؤال عن الوقت.",choices:["Qui","Quand","Que"],correctIndex:1,explanation:"Quand تعني متى."},
 {prompt:"___ allez-vous au travail ? — En métro.",speech:"Complétez la question. Comment allez-vous au travail ?",instruction:"اختر أداة السؤال عن الكيفية.",choices:["Pourquoi","Où","Comment"],correctIndex:2,explanation:"Comment تعني كيف، والإجابة هنا وسيلة النقل."},
 {prompt:"___ coûte cette veste ?",speech:"Complétez la question. Combien coûte cette veste ?",instruction:"اختر أداة السؤال عن السعر.",choices:["Combien","Quelle","Quand"],correctIndex:0,explanation:"Combien تستخدم للسؤال عن السعر أو العدد."},
 {prompt:"___ jour sommes-nous ?",speech:"Complétez la question. Quel jour sommes-nous ?",instruction:"اختر صيغة quel الموافقة لاسم مذكر مفرد.",choices:["Quelle","Quel","Quels"],correctIndex:1,explanation:"jour مذكر مفرد؛ لذلك نستخدم quel."},
 {prompt:"___ heure est-il ?",speech:"Complétez la question. Quelle heure est-il ?",instruction:"اختر صيغة quel الموافقة لاسم مؤنث مفرد.",choices:["Quelles","Quel","Quelle"],correctIndex:2,explanation:"heure مؤنث مفرد؛ لذلك نستخدم quelle."},
 {prompt:"Quelles langues parlez-vous ?",speech:"Quelles langues parlez-vous ?",instruction:"اختر المعنى العربي الصحيح.",choices:["ما اللغات التي تتحدثونها؟","كم ساعة تدرسون؟","أين تتعلمون اللغة؟"],correctIndex:0,explanation:"quelles langues تعني ما اللغات."}
];

const A1_MESSAGES_FORMS_PRACTICE_ITEMS:Example[]=[
 {fr:"Écrivez votre nom et votre prénom ici.",ar:"اكتبوا اسم العائلة والاسم الأول هنا."},
 {fr:"Quel est votre numéro de téléphone ?",ar:"ما رقم هاتفكم؟"},
 {fr:"Ma nationalité est saoudienne.",ar:"جنسيتي سعودية."},
 {fr:"Le code postal est six neuf zéro zéro deux.",ar:"الرمز البريدي هو 69002."},
 {fr:"Bonjour, je voudrais déplacer mon rendez-vous.",ar:"مرحبًا، أود تغيير موعدي."},
 {fr:"Je suis disponible vendredi après-midi.",ar:"أنا متاح بعد ظهر الجمعة."},
 {fr:"À bientôt et bonne journée !",ar:"إلى لقاء قريب ويوم سعيد!"},
 {fr:"La gare ouvre à cinq heures trente.",ar:"تفتح المحطة الساعة الخامسة والنصف."},
 {fr:"Le train de Marseille est complet.",ar:"قطار مرسيليا مكتمل العدد."},
 {fr:"Il est interdit de manger dans cette salle.",ar:"يُمنع تناول الطعام في هذه القاعة."}
];

const A1_MESSAGES_FORMS_QUIZ_ITEMS:QuizQuestion[]=[
 {prompt:"Prénom",speech:"Prénom.",instruction:"اختر معنى هذه الخانة في النموذج.",choices:["اسم العائلة","الاسم الأول","الجنسية"],correctIndex:1,explanation:"prénom يعني الاسم الأول."},
 {prompt:"Nom de famille",speech:"Nom de famille.",instruction:"اختر معنى هذه الخانة في النموذج.",choices:["اسم العائلة","تاريخ الميلاد","رقم الهاتف"],correctIndex:0,explanation:"nom de famille يعني اسم العائلة."},
 {prompt:"Date de naissance",speech:"Date de naissance.",instruction:"اختر المعلومة المطلوبة في هذه الخانة.",choices:["مكان السكن","البريد الإلكتروني","تاريخ الميلاد"],correctIndex:2,explanation:"date de naissance تعني تاريخ الميلاد."},
 {prompt:"Je vous écris ___ confirmer le rendez-vous.",speech:"Complétez la phrase. Je vous écris pour confirmer le rendez-vous.",instruction:"اختر الكلمة التي توضح سبب الرسالة.",choices:["pour","dans","chez"],correctIndex:0,explanation:"pour + مصدر يوضح الغرض من الكتابة."},
 {prompt:"Désolé, je vais arriver en ___.",speech:"Complétez le message. Désolé, je vais arriver en retard.",instruction:"أكمل عبارة الاعتذار عن التأخر.",choices:["panne","avance","retard"],correctIndex:2,explanation:"arriver en retard تعني الوصول متأخرًا."},
 {prompt:"Merci pour votre message. ___.",speech:"Choisissez une formule de fin. Merci pour votre message. Cordialement.",instruction:"اختر خاتمة مناسبة لرسالة مهذبة.",choices:["Quel âge avez-vous","Cordialement","Entrée gratuite"],correctIndex:1,explanation:"Cordialement خاتمة مهذبة شائعة في الرسائل."},
 {prompt:"Ouvert",speech:"Ouvert.",instruction:"اختر معنى الكلمة على لوحة المكان.",choices:["مفتوح","مغلق","مكتمل العدد"],correctIndex:0,explanation:"ouvert تعني مفتوح."},
 {prompt:"Entrée gratuite",speech:"Entrée gratuite.",instruction:"اختر معنى العبارة.",choices:["الدخول ممنوع","الدخول من الجهة الأخرى","الدخول مجاني"],correctIndex:2,explanation:"gratuit تعني مجاني."},
 {prompt:"L’ascenseur est en panne.",speech:"L’ascenseur est en panne.",instruction:"اختر المعنى العربي الصحيح.",choices:["المصعد معطّل.","المصعد في الطابق الأول.","المصعد مخصص للموظفين."],correctIndex:0,explanation:"en panne تعني معطّل."},
 {prompt:"Le musée est fermé le lundi.",speech:"Le musée est fermé le lundi.",instruction:"متى يكون المتحف مغلقًا؟",choices:["يوم الجمعة","يوم الاثنين","كل صباح"],correctIndex:1,explanation:"le lundi تعني يوم الاثنين."}
];

const A2_REVISION_PRACTICE_ITEMS:Example[]=[
 {fr:"Tous les jours, je me réveille à six heures et demie.",ar:"أستيقظ كل يوم في السادسة والنصف."},
 {fr:"Nous mettons nos manteaux avant de sortir.",ar:"نرتدي معاطفنا قبل الخروج."},
 {fr:"Elle ne regarde jamais la télévision le matin.",ar:"لا تشاهد التلفاز صباحًا أبدًا."},
 {fr:"Depuis quand travaillez-vous dans cette entreprise ?",ar:"منذ متى تعملون في هذه الشركة؟"},
 {fr:"Est-ce que vous prenez le métro pour aller au travail ?",ar:"هل تستقلون المترو للذهاب إلى العمل؟"},
 {fr:"Je ne veux rien acheter aujourd’hui.",ar:"لا أريد شراء أي شيء اليوم."},
 {fr:"On va souvent au marché le samedi.",ar:"غالبًا ما نذهب إلى السوق يوم السبت."},
 {fr:"D’abord, ils préparent le repas, puis ils mettent la table.",ar:"أولًا، يُحضّرون الطعام، ثم يرتبون المائدة."},
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

const A1_ALPHABET_READING={
 title:"Les premières lettres",
 arTitle:"الحروف الأولى",
 text:"Amine a un ami. Lina lit un livre. Zoé a un vélo. Les mots « ami », « livre » et « vélo » commencent par des lettres différentes.",
 translation:"لدى أمين صديق. تقرأ لينا كتابًا. لدى زوي دراجة. تبدأ كلمات «ami» و«livre» و«vélo» بحروف مختلفة.",
 questions:[
  {question:"Quelle est la première lettre du mot « ami » ?",translation:"ما الحرف الأول في كلمة «ami»؟",answer:"La première lettre est A.",ar:"الحرف الأول هو A."},
  {question:"Quel mot commence par la lettre L ?",translation:"ما الكلمة التي تبدأ بالحرف L؟",answer:"Le mot « livre » commence par la lettre L.",ar:"تبدأ كلمة «livre» بالحرف L."},
  {question:"Le mot « vélo » commence-t-il par V ou par Z ?",translation:"هل تبدأ كلمة «vélo» بالحرف V أم بالحرف Z؟",answer:"Il commence par la lettre V.",ar:"تبدأ الكلمة بالحرف V."}
 ]
};

const A1_ALPHABET_LISTENING={
 title:"Les lettres et les mots",
 arTitle:"الحروف والكلمات",
 text:"A, ami. B, bateau. C, café. D, dimanche. E, école.",
 questions:[
  {prompt:"Par quelle lettre commence le mot « ami » ?",translation:"بأي حرف تبدأ كلمة «ami»؟",choices:["A","E","M"],correctIndex:0},
  {prompt:"Quel mot entendez-vous ?",translation:"ما الكلمة التي تسمعها؟",choices:["café","bateau","ami"],correctIndex:1},
  {prompt:"Quelle est la première lettre du mot entendu ?",translation:"ما الحرف الأول في الكلمة التي سمعتها؟",choices:["G","K","C"],correctIndex:2},
  {prompt:"Quel mot commence par la lettre D ?",translation:"أي كلمة تبدأ بالحرف D؟",choices:["dimanche","bateau","école"],correctIndex:0},
  {prompt:"Quelle lettre et quel mot entendez-vous ?",translation:"ما الحرف والكلمة اللذان تسمعهما؟",choices:["A — ami","D — dimanche","E — école"],correctIndex:2}
 ]
};

const A1_ALPHABET_WRITING_MODEL="ami: صديق، bateau: قارب، café: مقهى، dimanche: الأحد، école: مدرسة، famille: عائلة، garçon: فتى، hôtel: فندق";
const A1_ALPHABET_WRITING_TRANSLATIONS=[
 {fr:"ami",ar:"صديق"},
 {fr:"bateau",ar:"قارب"},
 {fr:"café",ar:"مقهى"},
 {fr:"dimanche",ar:"الأحد"},
 {fr:"école",ar:"مدرسة"},
 {fr:"famille",ar:"عائلة"},
 {fr:"garçon",ar:"فتى"},
 {fr:"hôtel",ar:"فندق"}
];

const A1_ALPHABET_DICTATION=[
 {kind:"letter",speech:"E",ar:"الحرف E."},
 {kind:"letter",speech:"C",ar:"الحرف C."},
 {kind:"letter",speech:"G",ar:"الحرف G."},
 {kind:"letter",speech:"H",ar:"الحرف H."},
 {kind:"letter",speech:"I",ar:"الحرف I."},
 {kind:"letter",speech:"J",ar:"الحرف J."},
 {kind:"letter",speech:"K",ar:"الحرف K."},
 {kind:"letter",speech:"O",ar:"الحرف O."},
 {kind:"letter",speech:"R",ar:"الحرف R."},
 {kind:"letter",speech:"W",ar:"الحرف W."},
 {kind:"letter",speech:"Y",ar:"الحرف Y."},
 {kind:"word",speech:"Ami",ar:"صديق — تبدأ الكلمة بحرف A."},
 {kind:"word",speech:"Café",ar:"مقهى — تبدأ الكلمة بحرف C."},
 {kind:"word",speech:"Vélo",ar:"دراجة — تبدأ الكلمة بحرف V."}
];

const A1_ALPHABET_BUILDERS=[
 {tokens:["comme","A","ami."],answer:["A","comme","ami."],ar:"A مثل ami."},
 {tokens:["bateau.","comme","B"],answer:["B","comme","bateau."],ar:"B مثل bateau."},
 {tokens:["C","café.","comme"],answer:["C","comme","café."],ar:"C مثل café."}
];

const A1_ALPHABET_DIALOGUES=[
 {context:"Quelle est la première lettre du mot « ami » ?",translation:"ما الحرف الأول في كلمة «ami»؟",prompt:"اختر الإجابة الصحيحة.",choices:["C’est A.","C’est B.","C’est M."],correctIndex:0,feedback:"تبدأ كلمة «ami» بالحرف A."},
 {context:"Quel mot commence par la lettre B ?",translation:"أي كلمة تبدأ بالحرف B؟",prompt:"اختر الإجابة الصحيحة.",choices:["Café.","Bateau.","École."],correctIndex:1,feedback:"تبدأ كلمة «bateau» بالحرف B."},
 {context:"Comment s’épelle le mot « Paris » ?",translation:"كيف تُهجّى كلمة «Paris»؟",prompt:"اختر الإجابة الصحيحة.",choices:["P – A – R – I – S","B – A – R – I – S","P – E – R – I – S"],correctIndex:0,feedback:"تُهجّى كلمة «Paris» هكذا: P، A، R، I، S."}
];

const A1_SOUNDS_READING={
 title:"Écouter les sons",
 arTitle:"الاستماع إلى الأصوات",
 text:"Lina écoute et répète. Elle entend le son « ou » dans jour, le son « on » dans bonjour et le son « oi » dans trois. Elle prononce chaque mot lentement.",
 translation:"تستمع لينا وتكرّر. تسمع صوت ou في كلمة jour، وصوت on في bonjour، وصوت oi في trois. وتنطق كل كلمة ببطء.",
 questions:[
  {question:"Quel son entend-on dans « jour » ?",answer:"On entend le son « ou ».",ar:"نسمع صوت ou."},
  {question:"Dans quel mot entend-on le son « on » ?",answer:"On l’entend dans « bonjour ».",ar:"نسمعه في كلمة bonjour."},
  {question:"Lina prononce-t-elle les mots vite ou lentement ?",answer:"Elle les prononce lentement.",ar:"تنطق الكلمات ببطء."}
 ]
};

const A1_SOUNDS_LISTENING={
 title:"Reconnaître les sons essentiels",
 arTitle:"تمييز الأصوات الأساسية",
 text:"Un. Lit. Lune. Pain. Feu. Rouge. Huit. Zéro. Tout. Père. Chat. Pied. Oui. Bateau. Agneau. Parlez. Grand.",
 questions:[
  {prompt:"Dans le mot « un », comment classe-t-on la voyelle /œ̃/ ?",speech:"Dans le mot un, comment classe-t-on la voyelle ?",translation:"كيف يُصنَّف الصوت المتحرك /œ̃/ في كلمة «un»؟",choices:["Orale et non arrondie — فمي وغير مدوّر","Nasale et arrondie — أنفي ومدوّر","Orale et arrondie — فمي ومدوّر","Nasale et non arrondie — أنفي وغير مدوّر"],correctIndex:1,explanationAr:"الصوت /œ̃/ أنفي لأن الهواء يمر من الفم والأنف، ومدوّر لأن الشفتين تضمان إلى الأمام.",explanationFr:"Le son /œ̃/ est nasal, car l’air passe par la bouche et le nez, et arrondi, car les lèvres se projettent vers l’avant."},
  {prompt:"Dans le mot « lit », comment classe-t-on la voyelle /i/ ?",speech:"Dans le mot lit, comment classe-t-on la voyelle ?",translation:"كيف يُصنَّف الصوت المتحرك /i/ في كلمة «lit»؟",choices:["Orale et non arrondie — فمي وغير مدوّر (مبسوط)","Nasale et arrondie — أنفي ومدوّر","Orale et arrondie — فمي ومدوّر","Nasale et non arrondie — أنفي وغير مدوّر"],correctIndex:0,explanationAr:"الصوت /i/ فمي لأن الهواء يمر من الفم، وغير مدوّر لأن الشفتين تكونان مبسوطتين.",explanationFr:"Le son /i/ est oral, car l’air passe par la bouche, et non arrondi, car les lèvres sont étirées."},
  {prompt:"Dans le mot « lune », comment classe-t-on la voyelle /y/ ?",speech:"Dans le mot lune, comment classe-t-on la voyelle ?",translation:"كيف يُصنَّف الصوت المتحرك /y/ في كلمة «lune»؟",choices:["Nasale et non arrondie — أنفي وغير مدوّر","Orale et non arrondie — فمي وغير مدوّر","Orale et arrondie — فمي ومدوّر","Nasale et arrondie — أنفي ومدوّر"],correctIndex:2,explanationAr:"الصوت /y/ فمي لأن الهواء يمر من الفم، ومدوّر لأن الشفتين تضمان إلى الأمام.",explanationFr:"Le son /y/ est oral, car l’air passe par la bouche, et arrondi, car les lèvres se projettent vers l’avant."},
  {prompt:"Lequel des sons suivants est à la fois nasal et non arrondi ?",speech:"Lequel des sons suivants est à la fois nasal et non arrondi ?",translation:"أيّ الأصوات التالية أنفي وغير مدوّر (مبسوط)؟",choices:["Le son /ɛ̃/ dans « pain » — الصوت في «pain» (خبز)","Le son /ɔ̃/ dans « bon » — الصوت في «bon» (جيد)","Le son /o/ dans « moto » — الصوت في «moto» (دراجة نارية)","Le son /a/ dans « chat » — الصوت في «chat» (قط)"],correctIndex:0,explanationAr:"الصوت /ɛ̃/ أنفي لأن الهواء يمر من الفم والأنف، ومبسوط لأن الشفتين لا تضمان إلى الأمام.",explanationFr:"Le son /ɛ̃/ est nasal, car l’air passe par la bouche et le nez, et non arrondi, car les lèvres ne s’arrondissent pas."},
  {prompt:"Lequel des sons suivants est à la fois oral et arrondi ?",speech:"Lequel des sons suivants est à la fois oral et arrondi ?",translation:"أيّ الأصوات التالية فمي ومدوّر في الوقت نفسه؟",choices:["Le son /ɛ̃/ dans « pain » — الصوت في «pain»","Le son /i/ dans « lit » — الصوت في «lit»","Le son /ø/ dans « feu » — الصوت في «feu»","Le son /a/ dans « chat » — الصوت في «chat»"],correctIndex:2,explanationAr:"الصوت /ø/ فمي لأن الهواء يمر من الفم، ومدوّر لأن الشفتين تضمان إلى الأمام.",explanationFr:"Le son /ø/ est oral, car l’air passe par la bouche, et arrondi, car les lèvres se projettent vers l’avant."},
  {prompt:"Dans lequel de ces mots entend-on une voyelle fermée ?",speech:"Dans lequel de ces mots entend-on une voyelle fermée ?",translation:"في أيّ كلمة من الكلمات التالية نسمع صوتًا متحركًا مغلقًا؟",choices:["Le son /a/ dans « chat »","Le son /ɛ/ dans « père »","Le son /u/ dans « rouge »","Le son /ɔ/ dans « pomme »"],correctIndex:2,explanationAr:"الصوت /u/ مغلق لأن اللسان يكون مرتفعًا والفم شبه مغلق.",explanationFr:"Le son /u/ est fermé, car la langue est haute et la bouche est presque fermée."},
  {prompt:"Lequel des mots suivants contient la semi-voyelle antérieure et arrondie /ɥ/ ?",speech:"Lequel des mots suivants contient la semi-voyelle antérieure et arrondie ?",translation:"أيّ الكلمات التالية تحتوي على شبه حرف العلة الأمامي المدوّر /ɥ/، المعروف بصوت الواو الفرنسية الخفيفة؟",choices:["« pied » — قدم","« oui » — نعم","« huit » — ثمانية","« lit » — سرير"],correctIndex:2,explanationAr:"في كلمة «huit»، تتحول /y/ إلى انزلاق سريع /ɥ/ قبل الصوت /i/، مع تدوير الشفتين.",explanationFr:"Dans « huit », le son /y/ devient la semi-voyelle /ɥ/ devant /i/, avec les lèvres arrondies."},
  {prompt:"Lequel des sons suivants est une voyelle arrondie, prononcée avec les lèvres projetées vers l’avant ?",speech:"Lequel des sons suivants est une voyelle arrondie ?",translation:"أيّ الأصوات التالية يُعدّ صوتًا مدوّرًا، تتحرك فيه الشفتان بشكل دائري إلى الأمام؟",choices:["Le son /i/ dans « lit »","Le son /a/ dans « chat »","Le son /o/ dans « zéro »","Le son /ɛ/ dans « père »"],correctIndex:2,explanationAr:"الصوت /o/ في كلمة «zéro» مدوّر لأن الشفتين تضمان وتتحركان إلى الأمام عند نطقه.",explanationFr:"Dans « zéro », le son /o/ est arrondi, car les lèvres s’arrondissent et se projettent vers l’avant."},
  {prompt:"Lequel des mots suivants contient une voyelle arrondie, prononcée avec les lèvres projetées vers l’avant ?",speech:"Lequel des mots suivants contient une voyelle arrondie ?",translation:"أيّ الكلمات التالية تحتوي على صوت متحرك مدوّر، تتحرك فيه الشفتان بشكل دائري إلى الأمام؟",choices:["« lit » — سرير","« père » — أب","« tout » — كلّ","« chat » — قط"],correctIndex:2,explanationAr:"الصوت /u/ في كلمة «tout» مدوّر لأن الشفتين تضمان وتتجهان إلى الأمام.",explanationFr:"Dans « tout », le son /u/ est arrondi, car les lèvres s’arrondissent et se projettent vers l’avant."},
  {prompt:"Dans lequel de ces mots entend-on une voyelle moyenne ouverte ?",speech:"Dans lequel de ces mots entend-on une voyelle moyenne ouverte ?",translation:"في أيّ كلمة نسمع صوتًا متحركًا متوسطًا مفتوحًا؟",choices:["Le son /i/ dans « lit »","Le son /e/ dans « été »","Le son /ɛ/ dans « père »","Le son /a/ dans « chat »"],correctIndex:2,explanationAr:"الصوت /ɛ/ متوسط مفتوح؛ يكون اللسان في ارتفاع متوسط والفم مفتوحًا نسبيًا.",explanationFr:"Le son /ɛ/ est une voyelle moyenne ouverte : la langue est à mi-hauteur et la bouche est relativement ouverte."},
  {prompt:"Dans lequel de ces mots entend-on une voyelle ouverte ?",speech:"Dans lequel de ces mots entend-on une voyelle ouverte ?",translation:"في أيّ كلمة نسمع صوتًا متحركًا مفتوحًا؟",choices:["Le son /i/ dans « lit »","Le son /ø/ dans « feu »","Le son /ɛ/ dans « père »","Le son /a/ dans « chat »"],correctIndex:3,explanationAr:"الصوت /a/ مفتوح لأن اللسان ينخفض ويُفتح الفم بدرجة كبيرة.",explanationFr:"Le son /a/ est ouvert, car la langue s’abaisse et la bouche s’ouvre largement."},
  {prompt:"Lequel des mots suivants contient la semi-voyelle /j/, comme dans « yeux » ?",speech:"Lequel des mots suivants contient la semi-voyelle comme dans yeux ?",translation:"أيّ الكلمات التالية تحتوي على شبه حرف العلة /j/ القريب من صوت الياء، كما في كلمة «yeux»؟",choices:["« oui » — نعم","« pied » — قدم","« huit » — ثمانية","« lit » — سرير"],correctIndex:1,explanationAr:"في كلمة «pied»، يتحول الصوت /i/ إلى انزلاق سريع /j/ قبل الصوت /e/.",explanationFr:"Dans « pied », le son /i/ devient la semi-voyelle /j/ devant /e/."},
  {prompt:"Lequel des mots suivants contient la semi-voyelle /w/ ?",speech:"Lequel des mots suivants contient la semi-voyelle ou ?",translation:"أيّ الكلمات التالية تحتوي على شبه حرف العلة /w/ القريب من صوت الواو؟",choices:["« pied » — قدم","« huit » — ثمانية","« oui » — نعم","« lit » — سرير"],correctIndex:2,explanationAr:"في كلمة «oui»، يتحول الصوت /u/ إلى انزلاق سريع /w/ قبل الصوت /i/.",explanationFr:"Dans « oui », le son /u/ devient la semi-voyelle /w/ devant /i/."},
  {prompt:"Dans « bateau », quel groupe de lettres représente le son /o/ ?",speech:"Dans bateau, quel groupe de lettres représente le son o ?",translation:"في كلمة «bateau»، أيّ مجموعة حروف تمثل الصوت /o/؟",choices:["« ou »","« eu »","« au »","« eau »"],correctIndex:3,explanationAr:"في كلمة «bateau»، تجتمع الحروف «eau» لتمثل صوتًا واحدًا هو /o/.",explanationFr:"Dans « bateau », les lettres « eau » forment un seul son : /o/."},
  {prompt:"Dans « agneau », quel groupe de lettres représente le son /ɲ/ ?",speech:"Dans agneau, quel groupe de lettres représente le son entendu ?",translation:"في كلمة «agneau»، أيّ مجموعة حروف تمثل الصوت /ɲ/ القريب من «ني»؟",choices:["« ch »","« ph »","« gn »","« th »"],correctIndex:2,explanationAr:"في كلمة «agneau»، تجتمع «g» و«n» لتمثلا صوتًا واحدًا هو /ɲ/.",explanationFr:"Dans « agneau », les lettres « gn » forment un seul son : /ɲ/."},
  {prompt:"Dans « parlez », quelle terminaison représente le son /e/ ?",speech:"Dans parlez, quelle terminaison représente le son é ?",translation:"في كلمة «parlez»، أيّ نهاية تمثل الصوت /e/؟",choices:["« et »","« tion »","« ez »","« er »"],correctIndex:2,explanationAr:"في كلمة «parlez»، تُنطق النهاية «ez» صوتًا واحدًا هو /e/، ولا يُنطق حرف «z» منفصلًا.",explanationFr:"Dans « parlez », la terminaison « ez » se prononce /e/ ; la lettre « z » ne se prononce pas séparément."},
  {prompt:"Dans le mot « grand », quelle lettre finale s’écrit mais ne se prononce pas ?",speech:"Dans le mot grand, quelle lettre finale s’écrit mais ne se prononce pas ?",translation:"في كلمة «grand»، ما الحرف الأخير الذي يُكتب ولا يُنطق؟",choices:["« t »","« d »","« z »","« s »"],correctIndex:1,explanationAr:"في كلمة «grand» بصيغة المذكر المفرد، يُكتب الحرف «d» في النهاية لكنه لا يُنطق.",explanationFr:"Dans « grand » au masculin singulier, la lettre finale « d » s’écrit, mais ne se prononce pas."}
 ]
};

const A1_SOUNDS_WRITING_MODEL="bonjour, rouge, voiture, pain, chat, jour, maison, français";
const A1_SOUNDS_WRITING_TRANSLATIONS=[
 {fr:"rouge",ar:"أحمر"},
 {fr:"voiture",ar:"سيارة"},
 {fr:"bateau",ar:"قارب"},
 {fr:"bonjour",ar:"مرحبًا"},
 {fr:"enfant",ar:"طفل"},
 {fr:"matin",ar:"صباح"},
 {fr:"chat",ar:"قط"},
 {fr:"garçon",ar:"صبي"}
];

const A1_SOUNDS_DICTATION=[
 {speech:"Rouge",ar:"أحمر — تحتوي الكلمة على ou."},
 {speech:"Voiture",ar:"سيارة — تحتوي الكلمة على oi."},
 {speech:"Bateau",ar:"قارب — تحتوي الكلمة على eau."},
 {speech:"Bonjour",ar:"مرحبًا — تحتوي الكلمة على on."},
 {speech:"Enfant",ar:"طفل — تحتوي الكلمة على en وan."},
 {speech:"Matin",ar:"صباح — تحتوي الكلمة على in."},
 {speech:"Chat",ar:"قط — تحتوي الكلمة على ch."},
 {speech:"Garçon",ar:"صبي — تجعل ç الحرف يُنطق مثل s."}
];

const A1_SOUNDS_BUILDERS=[
 {tokens:["pain.","du","mange","enfant","Un"],answer:["Un","enfant","mange","du","pain."],ar:"طفل يأكل خبزًا.",soundNotes:[{word:"Un",detail:"un → /œ̃/"},{word:"enfant",detail:"en وan → /ɑ̃/"},{word:"pain",detail:"ain → /ɛ̃/"}]},
 {tokens:["l’eau.","de","boit","Paul"],answer:["Paul","boit","de","l’eau."],ar:"بول يشرب الماء.",soundNotes:[{word:"Paul",detail:"au → /o/"},{word:"boit",detail:"oi → /wa/"},{word:"eau",detail:"eau → /o/"}]},
 {tokens:["vélo.","un","a","Léo"],answer:["Léo","a","un","vélo."],ar:"ليو لديه دراجة.",soundNotes:[{word:"Léo",detail:"é → /e/"},{word:"un",detail:"un → /œ̃/"},{word:"vélo",detail:"é → /e/ وo → /o/"}]},
 {tokens:["bleue.","jupe","une","portes","Tu"],answer:["Tu","portes","une","jupe","bleue."],ar:"أنت ترتدي تنورة زرقاء.",soundNotes:[{word:"Tu",detail:"u → /y/"},{word:"jupe",detail:"u → /y/"},{word:"bleue",detail:"eu → /ø/"}]},
 {tokens:["pomme.","une","mangeons","Nous"],answer:["Nous","mangeons","une","pomme."],ar:"نحن نأكل تفاحة.",soundNotes:[{word:"Nous",detail:"ou → /u/"},{word:"mangeons",detail:"on → /ɔ̃/"},{word:"pomme",detail:"o → /ɔ/"}]},
 {tokens:["lit.","le","sur","dort","chat","Le"],answer:["Le","chat","dort","sur","le","lit."],ar:"القط ينام على السرير.",soundNotes:[{word:"chat",detail:"a → /a/"},{word:"dort",detail:"o → /ɔ/"},{word:"sur",detail:"u → /y/"},{word:"lit",detail:"i → /i/"}]},
 {tokens:["voitures.","trois","voit","Il"],answer:["Il","voit","trois","voitures."],ar:"هو يرى ثلاث سيارات.",soundNotes:[{word:"voit",detail:"oi → /wa/"},{word:"trois",detail:"oi → /wa/"},{word:"voitures",detail:"oi → /wa/"}]},
 {tokens:["jardin.","le","dans","joue","Louis"],answer:["Louis","joue","dans","le","jardin."],ar:"لوي يلعب في الحديقة.",soundNotes:[{word:"joue",detail:"ou → /u/"},{word:"dans",detail:"an → /ɑ̃/"},{word:"jardin",detail:"in → /ɛ̃/"}]},
 {tokens:["ciel.","le","dans","volent","oiseaux","Huit"],answer:["Huit","oiseaux","volent","dans","le","ciel."],ar:"ثمانية طيور تطير في السماء.",soundNotes:[{word:"Huit",detail:"ui → /ɥi/"},{word:"oiseaux",detail:"oi → /wa/ وeau → /o/"},{word:"dans",detail:"an → /ɑ̃/"}]},
 {tokens:["pain.","du","achète","garçon","Le"],answer:["Le","garçon","achète","du","pain."],ar:"الصبي يشتري خبزًا.",soundNotes:[{word:"garçon",detail:"on → /ɔ̃/"},{word:"achète",detail:"è → /ɛ/"},{word:"du",detail:"u → /y/"},{word:"pain",detail:"ain → /ɛ̃/"}]}
];

const A1_SOUNDS_DIALOGUES=[
 {context:"Quel groupe de lettres entendez-vous dans « rouge » ?",translation:"ما مجموعة الحروف التي تسمعها في كلمة «rouge»؟",prompt:"اختر الإجابة المناسبة.",choices:["J’entends le groupe « ou ».","J’entends le groupe « oi ».","J’entends le groupe « on »."],correctIndex:0,feedback:"تحتوي كلمة rouge على المجموعة ou."},
 {context:"Comment se prononce le groupe « oi » dans « voiture » ?",translation:"كيف تُنطق مجموعة الحروف «oi» في كلمة «voiture»؟",prompt:"اختر الإجابة المناسبة.",choices:["Elle se prononce /u/.","Elle se prononce /wa/.","Elle se prononce /o/."],correctIndex:1,feedback:"تُنطق oi بالصوت ‎/wa/‎ في كلمة voiture."},
 {context:"Quelle graphie représente le son nasal /ɛ̃/ dans « pain » ?",translation:"ما الكتابة التي تمثل الصوت الأنفي في كلمة «pain»؟",prompt:"اختر الإجابة المناسبة.",choices:["La graphie « on ».","La graphie « an ».","La graphie « ain »."],correctIndex:2,feedback:"يُمثَّل الصوت الأنفي ‎/ɛ̃/‎ بالمجموعة ain في كلمة pain."},
 {context:"Quelle lettre finale est muette dans « petit » ?",translation:"ما الحرف الأخير الصامت في كلمة «petit»؟",prompt:"اختر الإجابة المناسبة.",choices:["La lettre t.","La lettre i.","La lettre p."],correctIndex:0,feedback:"لا يُنطق الحرف t الأخير عادةً في كلمة petit."},
 {context:"Quel son entendez-vous pendant la liaison dans « les amis » ?",translation:"ما الصوت الذي تسمعه عند الربط في عبارة «les amis»؟",prompt:"اختر الإجابة المناسبة.",choices:["Le son /s/.","Le son /z/.","Le son /t/."],correctIndex:1,feedback:"تُنطق s في les بالصوت ‎/z/‎ عند الربط مع amis."}
];

const A1_GREETINGS_READING={
 title:"Une première rencontre",
 arTitle:"لقاء أول",
 text:"Nora entre dans une boulangerie. Elle dit : « Bonjour madame. Je m’appelle Nora. Comment allez-vous ? » La vendeuse répond : « Très bien, merci. Enchantée, Nora. »",
 translation:"تدخل نورا إلى مخبز. تقول: «مرحبًا سيدتي. اسمي نورا. كيف حالك؟» فتجيب البائعة: «بخير جدًا، شكرًا. سعيدة بلقائك يا نورا.»",
 questions:[
  {question:"Où entre Nora ?",answer:"Elle entre dans une boulangerie.",ar:"تدخل إلى مخبز."},
  {question:"Comment Nora se présente-t-elle ?",answer:"Elle dit : « Je m’appelle Nora. »",ar:"تقول: اسمي نورا."},
  {question:"Comment va la vendeuse ?",answer:"Elle va très bien.",ar:"إنها بخير جدًا."}
 ]
};

const A1_GREETINGS_LISTENING={
 title:"Je me présente",
 arTitle:"أعرّف بنفسي",
 text:"Bonjour, je m’appelle Sami. Je suis étudiant et j’habite à Lyon. Je parle arabe et un peu français. Enchanté de vous rencontrer.",
 questions:[
  {prompt:"Comment s’appelle la personne ?",choices:["Sami","Amine","Lucas"],correctIndex:0},
  {prompt:"Où habite Sami ?",choices:["À Paris","À Lyon","À Nantes"],correctIndex:1},
  {prompt:"Quelles langues parle-t-il ?",choices:["Arabe et un peu français","Seulement français","Anglais et espagnol"],correctIndex:0}
 ]
};

const A1_GREETINGS_WRITING_MODEL="Bonjour, je m’appelle Sami. Je suis étudiant. J’habite à Lyon et je parle arabe. Enchanté de vous rencontrer.";

const A1_GREETINGS_DICTATION=[
 {speech:"Bonjour, je m’appelle Sami.",ar:"مرحبًا، اسمي سامي."},
 {speech:"Comment allez-vous ?",ar:"كيف حالك؟ بصيغة رسمية."},
 {speech:"Enchanté de vous rencontrer.",ar:"سعيد بلقائك."}
];

const A1_GREETINGS_BUILDERS=[
 {tokens:["m’appelle","Bonjour,","Nora.","je"],answer:["Bonjour,","je","m’appelle","Nora."],ar:"مرحبًا، اسمي نورا."},
 {tokens:["allez-vous","Comment","aujourd’hui ?"],answer:["Comment","allez-vous","aujourd’hui ?"],ar:"كيف حالك اليوم؟"},
 {tokens:["vous","de","Enchanté","rencontrer."],answer:["Enchanté","de","vous","rencontrer."],ar:"سعيد بلقائك."}
];

const A1_GREETINGS_DIALOGUES=[
 {context:"Une personne vous dit : « Bonjour ! »",prompt:"اختر الرد الطبيعي.",choices:["Bonjour !","Au revoir !","Je ne sais pas."],correctIndex:0,feedback:"نرد على Bonjour بالتحية نفسها."},
 {context:"On vous demande : « Comment vous appelez-vous ? »",prompt:"كيف تعرّف باسمك؟",choices:["J’habite à Lille.","Je m’appelle Lina.","Très bien, merci."],correctIndex:1,feedback:"Je m’appelle… هي الصيغة الأساسية لذكر الاسم."},
 {context:"Votre professeur dit : « Enchanté de vous rencontrer. »",prompt:"اختر الرد المهذب.",choices:["Enchanté également.","Je suis à Paris.","À demain matin ?"],correctIndex:0,feedback:"Enchanté également تعني: وأنا سعيد بلقائك أيضًا."}
];

const A1_COUNTRIES_READING={
 title:"Une classe internationale",
 arTitle:"فصل دولي",
 text:"Dans la classe de français, Nora vient d’Arabie saoudite et parle arabe. Adam vient du Maroc. Il parle arabe et français. Yuki vient du Japon et apprend le français. Les trois étudiants habitent à Lyon.",
 translation:"في فصل اللغة الفرنسية، نورا من المملكة العربية السعودية وتتحدث العربية. آدم من المغرب، ويتحدث العربية والفرنسية. يوكي من اليابان وتتعلم الفرنسية. ويسكن الطلاب الثلاثة في ليون.",
 questions:[
  {question:"D’où vient Nora ?",translation:"من أين نورا؟",answer:"Nora vient d’Arabie saoudite.",ar:"نورا من المملكة العربية السعودية."},
  {question:"Quelles langues parle Adam ?",translation:"ما اللغات التي يتحدثها آدم؟",answer:"Il parle arabe et français.",ar:"يتحدث العربية والفرنسية."},
  {question:"Quelle langue apprend Yuki ?",translation:"ما اللغة التي تتعلمها يوكي؟",answer:"Yuki apprend le français.",ar:"تتعلم يوكي الفرنسية."}
 ]
};

const A1_COUNTRIES_LISTENING={
 title:"Pays et nationalités",
 arTitle:"البلدان والجنسيات",
 text:"France. Maroc. Japon. Arabie saoudite. États-Unis.",
 questions:[
  {prompt:"Quel pays entendez-vous ?",choices:["La France","Le Maroc","Le Japon"],correctIndex:0},
  {prompt:"Quel pays entendez-vous ?",choices:["Le Canada","Le Maroc","L’Italie"],correctIndex:1},
  {prompt:"Quel pays entendez-vous ?",choices:["L’Espagne","L’Égypte","Le Japon"],correctIndex:2},
  {prompt:"Quel pays entendez-vous ?",choices:["L’Arabie saoudite","La France","L’Allemagne"],correctIndex:0},
  {prompt:"Quel pays entendez-vous ?",choices:["Les Émirats arabes unis","Les États-Unis","Le Royaume-Uni"],correctIndex:1}
 ]
};

const A1_COUNTRIES_WRITING_MODEL="Je viens d’Arabie saoudite. Je suis saoudien. J’habite à Riyad. Je parle arabe et j’apprends le français.";
const A1_COUNTRIES_WRITING_TRANSLATIONS=[
 {fr:"France",ar:"فرنسا"},{fr:"Maroc",ar:"المغرب"},{fr:"Japon",ar:"اليابان"},{fr:"Arabie saoudite",ar:"المملكة العربية السعودية"},
 {fr:"français",ar:"الفرنسية"},{fr:"arabe",ar:"العربية"},{fr:"anglais",ar:"الإنجليزية"},{fr:"espagnol",ar:"الإسبانية"}
];

const A1_COUNTRIES_DICTATION=[
 {speech:"France",ar:"فرنسا"},
 {speech:"Maroc",ar:"المغرب"},
 {speech:"Japon",ar:"اليابان"},
 {speech:"saoudienne",ar:"سعودية"},
 {speech:"français",ar:"الفرنسية"}
];

const A1_COUNTRIES_BUILDERS=[
 {tokens:["viens","Je","saoudite.","d’Arabie"],answer:["Je","viens","d’Arabie","saoudite."],ar:"أنا من المملكة العربية السعودية."},
 {tokens:["France.","habite","en","Elle"],answer:["Elle","habite","en","France."],ar:"هي تسكن في فرنسا."},
 {tokens:["est","Mon","marocain.","ami"],answer:["Mon","ami","est","marocain."],ar:"صديقي مغربي."},
 {tokens:["parlons","Nous","français.","arabe","et"],answer:["Nous","parlons","arabe","et","français."],ar:"نتحدث العربية والفرنسية."},
 {tokens:["langue","Quelle","parlez-vous ?"],answer:["Quelle","langue","parlez-vous ?"],ar:"ما اللغة التي تتحدثونها؟"}
];

const A1_COUNTRIES_DIALOGUES=[
 {context:"D’où venez-vous ?",translation:"من أين أنتم؟",prompt:"اختر الإجابة المناسبة.",choices:["Je viens du Maroc.","Je parle français.","Je m’appelle Lina."],correctIndex:0,feedback:"للإجابة عن الأصل نستعمل venir de مع اسم البلد."},
 {context:"Quelle est votre nationalité ?",translation:"ما جنسيتكم؟",prompt:"اختر الإجابة المناسبة.",choices:["J’habite à Paris.","Je suis saoudienne.","Je parle arabe."],correctIndex:1,feedback:"نستعمل être مع صفة الجنسية."},
 {context:"Quelles langues parlez-vous ?",translation:"ما اللغات التي تتحدثونها؟",prompt:"اختر الإجابة المناسبة.",choices:["Je viens de France.","Je suis étudiant.","Je parle arabe et français."],correctIndex:2,feedback:"بعد parler نذكر اللغة عادة من دون أداة."},
 {context:"Vous habitez dans quel pays ?",translation:"في أي بلد تسكنون؟",prompt:"اختر الإجابة المناسبة.",choices:["J’habite au Canada.","Je suis canadien.","J’apprends l’anglais."],correctIndex:0,feedback:"habiter مع حرف الجر واسم البلد يجيب عن مكان السكن."},
 {context:"Vous apprenez quelle langue ?",translation:"ما اللغة التي تتعلمونها؟",prompt:"اختر الإجابة المناسبة.",choices:["Je viens d’Italie.","J’apprends le français.","Je suis italienne."],correctIndex:1,feedback:"نقول apprendre le français عند الحديث عن تعلم اللغة."}
];

const A1_STUDIES_READING={
 title:"À l’université et au travail",
 arTitle:"في الجامعة والعمل",
 text:"Nora est étudiante à l’université. Elle étudie le français le matin. Son frère Sami est infirmier et travaille à l’hôpital. Leur amie Lina est cuisinière dans un restaurant. Elle commence son travail à onze heures.",
 translation:"نورا طالبة في الجامعة وتدرس الفرنسية صباحًا. أخوها سامي ممرض ويعمل في المستشفى. صديقتهما لينا طاهية في مطعم، وتبدأ عملها الساعة الحادية عشرة.",
 questions:[
  {question:"Qu’est-ce que Nora étudie ?",translation:"ماذا تدرس نورا؟",answer:"Nora étudie le français.",ar:"تدرس نورا اللغة الفرنسية."},
  {question:"Où travaille Sami ?",translation:"أين يعمل سامي؟",answer:"Sami travaille à l’hôpital.",ar:"يعمل سامي في المستشفى."},
  {question:"Quel est le métier de Lina ?",translation:"ما مهنة لينا؟",answer:"Lina est cuisinière.",ar:"لينا طاهية."}
 ]
};

const A1_STUDIES_LISTENING={
 title:"Métiers et lieux",
 arTitle:"المهن وأماكنها",
 text:"Professeur. Médecin. Cuisinier. Vendeuse. Étudiante.",
 questions:[
  {prompt:"Quel métier entendez-vous ?",choices:["Professeur","Médecin","Cuisinier"],correctIndex:0},
  {prompt:"Quel métier entendez-vous ?",choices:["Vendeur","Médecin","Professeur"],correctIndex:1},
  {prompt:"Quel métier entendez-vous ?",choices:["Infirmier","Ingénieur","Cuisinier"],correctIndex:2},
  {prompt:"Quel métier entendez-vous ?",choices:["Vendeuse","Étudiante","Professeure"],correctIndex:0},
  {prompt:"Quel statut entendez-vous ?",choices:["Cuisinière","Étudiante","Médecin"],correctIndex:1}
 ]
};

const A1_STUDIES_WRITING_MODEL="Je suis étudiant à l’université. J’étudie le français. Mon frère est médecin et travaille à l’hôpital.";
const A1_STUDIES_WRITING_TRANSLATIONS=[
 {fr:"étudiant",ar:"طالب"},{fr:"étudiante",ar:"طالبة"},{fr:"professeur",ar:"معلّم"},{fr:"médecin",ar:"طبيب"},
 {fr:"infirmière",ar:"ممرضة"},{fr:"ingénieur",ar:"مهندس"},{fr:"cuisinier",ar:"طاهٍ"},{fr:"vendeuse",ar:"بائعة"}
];

const A1_STUDIES_DICTATION=[
 {speech:"étudiant",ar:"طالب"},
 {speech:"professeur",ar:"معلّم"},
 {speech:"médecin",ar:"طبيب"},
 {speech:"infirmière",ar:"ممرضة"},
 {speech:"cuisinier",ar:"طاهٍ"}
];

const A1_STUDIES_BUILDERS=[
 {tokens:["étudiante","Je","suis","à","l’université."],answer:["Je","suis","étudiante","à","l’université."],ar:"أنا طالبة في الجامعة."},
 {tokens:["français.","le","étudions","Nous"],answer:["Nous","étudions","le","français."],ar:"نحن ندرس اللغة الفرنسية."},
 {tokens:["médecin.","frère","Mon","est"],answer:["Mon","frère","est","médecin."],ar:"أخي طبيب."},
 {tokens:["travaille","Elle","un","dans","magasin."],answer:["Elle","travaille","dans","un","magasin."],ar:"هي تعمل في متجر."},
 {tokens:["votre","Quel","métier ?","est"],answer:["Quel","est","votre","métier ?"],ar:"ما مهنتكم؟"}
];

const A1_STUDIES_DIALOGUES=[
 {context:"Qu’est-ce que vous étudiez ?",translation:"ماذا تدرسون؟",prompt:"اختر الإجابة المناسبة.",choices:["J’étudie le français.","Je suis à Lyon.","Je viens du Maroc."],correctIndex:0,feedback:"نجيب عن مجال الدراسة باستعمال étudier."},
 {context:"Quel est votre métier ?",translation:"ما مهنتكم؟",prompt:"اختر الإجابة المناسبة.",choices:["J’étudie le soir.","Je suis ingénieur.","J’habite en France."],correctIndex:1,feedback:"نستعمل être ثم اسم المهنة من دون أداة."},
 {context:"Où travaillez-vous ?",translation:"أين تعملون؟",prompt:"اختر الإجابة المناسبة.",choices:["Je parle français.","Je suis infirmière.","Je travaille à l’hôpital."],correctIndex:2,feedback:"السؤال يطلب مكان العمل."},
 {context:"À quelle heure commence votre cours ?",translation:"في أي ساعة يبدأ درسكم؟",prompt:"اختر الإجابة المناسبة.",choices:["Il commence à neuf heures.","Je suis professeur.","C’est une université."],correctIndex:0,feedback:"نستخدم commencer à ثم الساعة."},
 {context:"Vous travaillez comme professeur ?",translation:"هل تعملون معلّمين؟",prompt:"اختر الإجابة المناسبة.",choices:["À l’université.","Oui, je suis professeur de français.","J’étudie à dix heures."],correctIndex:1,feedback:"الإجابة تؤكد المهنة وتحدد المادة."}
];

const A1_TASTES_READING={
 title:"Les goûts de Lina et Sami",
 arTitle:"أذواق لينا وسامي",
 text:"Lina aime lire et elle adore la musique. Elle préfère le thé au café parce que le thé est léger. Sami aime le cinéma, mais il n’aime pas les films tristes. Son activité préférée est la natation.",
 translation:"تحب لينا القراءة وتعشق الموسيقى. وهي تفضل الشاي على القهوة لأن الشاي خفيف. يحب سامي السينما، لكنه لا يحب الأفلام الحزينة. ونشاطه المفضل هو السباحة.",
 questions:[
  {question:"Qu’est-ce que Lina aime faire ?",translation:"ماذا تحب لينا أن تفعل؟",answer:"Lina aime lire.",ar:"تحب لينا القراءة."},
  {question:"Pourquoi préfère-t-elle le thé ?",translation:"لماذا تفضل الشاي؟",answer:"Parce que le thé est léger.",ar:"لأن الشاي خفيف."},
  {question:"Quelle est l’activité préférée de Sami ?",translation:"ما نشاط سامي المفضل؟",answer:"Son activité préférée est la natation.",ar:"نشاطه المفضل هو السباحة."}
 ]
};

const A1_TASTES_LISTENING={
 title:"Goûts et préférences",
 arTitle:"الأذواق والتفضيلات",
 text:"J’aime lire. J’adore voyager. Je préfère le thé. Je n’aime pas courir. Je déteste le bruit.",
 questions:[
  {prompt:"Quelle activité la personne aime-t-elle ?",choices:["Lire","Nager","Cuisiner"],correctIndex:0},
  {prompt:"Qu’est-ce que la personne adore faire ?",choices:["Attendre","Voyager","Courir"],correctIndex:1},
  {prompt:"Quelle boisson préfère-t-elle ?",choices:["Le café","L’eau","Le thé"],correctIndex:2},
  {prompt:"Quelle activité n’aime-t-elle pas ?",choices:["Courir","Lire","Voyager"],correctIndex:0},
  {prompt:"Qu’est-ce que la personne déteste ?",choices:["Le thé","Le bruit","La musique"],correctIndex:1}
 ]
};

const A1_TASTES_WRITING_MODEL="J’aime lire et écouter de la musique. Je préfère le thé au café. Je n’aime pas courir parce que c’est fatigant. Mon activité préférée est la natation.";
const A1_TASTES_WRITING_TRANSLATIONS=[
 {fr:"lire",ar:"القراءة"},{fr:"voyager",ar:"السفر"},{fr:"la musique",ar:"الموسيقى"},{fr:"le cinéma",ar:"السينما"},
 {fr:"le thé",ar:"الشاي"},{fr:"le café",ar:"القهوة"},{fr:"la natation",ar:"السباحة"},{fr:"courir",ar:"الجري"}
];

const A1_TASTES_DICTATION=[
 {speech:"musique",ar:"موسيقى"},
 {speech:"voyager",ar:"يسافر"},
 {speech:"thé",ar:"شاي"},
 {speech:"courir",ar:"يجري"},
 {speech:"bruit",ar:"ضوضاء"}
];

const A1_TASTES_BUILDERS=[
 {tokens:["lire.","J’aime","soir","le"],answer:["J’aime","lire","le","soir."],ar:"أحب القراءة مساءً."},
 {tokens:["voyager.","adore","Elle"],answer:["Elle","adore","voyager."],ar:"هي تعشق السفر."},
 {tokens:["café.","au","thé","le","préfère","Je"],answer:["Je","préfère","le","thé","au","café."],ar:"أفضل الشاي على القهوة."},
 {tokens:["pas","Nous","bruit.","n’aimons","le"],answer:["Nous","n’aimons","pas","le","bruit."],ar:"نحن لا نحب الضوضاء."},
 {tokens:["aimes-tu","Pourquoi","français ?","le"],answer:["Pourquoi","aimes-tu","le","français ?"],ar:"لماذا تحب اللغة الفرنسية؟"}
];

const A1_TASTES_DIALOGUES=[
 {context:"Qu’est-ce que tu aimes faire ?",translation:"ماذا تحب أن تفعل؟",prompt:"اختر الإجابة المناسبة.",choices:["J’aime écouter de la musique.","Je suis à la maison.","Il est huit heures."],correctIndex:0,feedback:"بعد aimer يمكن ذكر نشاط في صيغة المصدر."},
 {context:"Tu préfères le thé ou le café ?",translation:"هل تفضل الشاي أم القهوة؟",prompt:"اختر الإجابة المناسبة.",choices:["Je déteste voyager.","Je préfère le thé.","La tasse est petite."],correctIndex:1,feedback:"السؤال يقدم خيارين، والإجابة تحدد الخيار المفضل."},
 {context:"Pourquoi aimes-tu ce film ?",translation:"لماذا تحب هذا الفيلم؟",prompt:"اختر الإجابة المناسبة.",choices:["Au cinéma.","Avec ma sœur.","Parce qu’il est drôle."],correctIndex:2,feedback:"نجيب عن pourquoi بسبب يبدأ بـ parce que."},
 {context:"Vous aimez faire du sport ?",translation:"هل تحبون ممارسة الرياضة؟",prompt:"اختر الإجابة المناسبة.",choices:["Oui, j’adore nager.","Je suis une piscine.","Le lundi est demain."],correctIndex:0,feedback:"الإجابة تؤكد الميل وتذكر النشاط."},
 {context:"Quel est votre loisir préféré ?",translation:"ما هوايتكم المفضلة؟",prompt:"اختر الإجابة المناسبة.",choices:["Je n’aime pas le café.","Mon loisir préféré est la lecture.","J’habite près du parc."],correctIndex:1,feedback:"نستعمل loisir préféré لتحديد الهواية المفضلة."}
];

const A1_NOUNS_READING={
 title:"Dans la salle de classe",
 arTitle:"داخل قاعة الدراسة",
 text:"Dans la classe, il y a un livre, une table et des chaises. Le professeur montre le livre. Les élèves regardent les images et ouvrent leurs cahiers.",
 translation:"يوجد داخل الفصل كتاب وطاولة وكراسٍ. يعرض المعلم الكتاب. ينظر الطلاب إلى الصور ويفتحون دفاترهم.",
 questions:[
  {question:"Quel article accompagne le mot « livre » la première fois ?",answer:"L’article « un » accompagne le mot « livre ».",ar:"تسبق كلمة livre أداة التنكير un."},
  {question:"Quel nom féminin trouve-t-on dans le texte ?",answer:"Le nom « table » est féminin.",ar:"كلمة table اسم مؤنث."},
  {question:"Quels noms sont au pluriel ?",answer:"Les noms « chaises », « élèves », « images » et « cahiers » sont au pluriel.",ar:"الأسماء chaises وélèves وimages وcahiers في صيغة الجمع."}
 ]
};

const A1_NOUNS_LISTENING={
 title:"Les objets du bureau",
 arTitle:"أغراض المكتب",
 text:"Sur le bureau, il y a un stylo bleu, une lampe blanche et deux petits livres. Les cahiers sont dans le sac.",
 questions:[
  {prompt:"Quel objet est bleu ?",choices:["La lampe","Le stylo","Le sac"],correctIndex:1},
  {prompt:"Quel article accompagne « lampe » ?",choices:["Un","Une","Des"],correctIndex:1},
  {prompt:"Où sont les cahiers ?",choices:["Dans le sac","Sur la chaise","Sous la lampe"],correctIndex:0}
 ]
};

const A1_NOUNS_WRITING_MODEL="Dans ma chambre, il y a un lit, une table et des livres. Le lit est près de la fenêtre. Les livres sont sur la table.";

const A1_NOUNS_DICTATION=[
 {speech:"Il y a un livre sur la table.",ar:"يوجد كتاب على الطاولة."},
 {speech:"La chaise est près de la fenêtre.",ar:"الكرسي قريب من النافذة."},
 {speech:"Les cahiers sont dans le sac.",ar:"الدفاتر داخل الحقيبة."}
];

const A1_NOUNS_BUILDERS=[
 {tokens:["livre","un","C’est","français."],answer:["C’est","un","livre","français."],ar:"هذا كتاب فرنسي."},
 {tokens:["table","La","petite.","est"],answer:["La","table","est","petite."],ar:"الطاولة صغيرة."},
 {tokens:["dans","sont","Les","sac.","cahiers","le"],answer:["Les","cahiers","sont","dans","le","sac."],ar:"الدفاتر داخل الحقيبة."}
];

const A1_NOUNS_DIALOGUES=[
 {context:"On vous montre un livre et demande : « Qu’est-ce que c’est ? »",prompt:"اختر الإجابة الصحيحة.",choices:["C’est un livre.","C’est une livre.","Ce sont livre."],correctIndex:0,feedback:"livre مذكر، لذلك نقول un livre."},
 {context:"Votre professeur montre plusieurs chaises.",prompt:"اختر المجموعة الاسمية الصحيحة.",choices:["La chaise.","Une chaises.","Les chaises."],correctIndex:2,feedback:"في الجمع نستخدم les مع chaises."},
 {context:"On vous demande : « Il y a une lampe ? »",prompt:"اختر إجابة صحيحة ومختصرة.",choices:["Oui, il y a une lampe.","Oui, il y a un lampe.","Oui, les lampe."],correctIndex:0,feedback:"lampe مؤنث، لذلك نستخدم une."}
];

const A1_CORE_VERBS_READING={
 title:"Une famille à Lyon",
 arTitle:"عائلة في ليون",
 text:"Je suis Lina et j’ai vingt ans. Mon frère est étudiant. Il a un cours de français aujourd’hui. Nous sommes à Lyon et nous avons un petit appartement. Nos parents sont à Marseille.",
 translation:"أنا لينا وعمري عشرون عامًا. أخي طالب، ولديه درس في اللغة الفرنسية اليوم. نحن في ليون ولدينا شقة صغيرة، أما والدانا فهما في مرسيليا.",
 questions:[
  {question:"Quel âge a Lina ?",answer:"Lina a vingt ans.",ar:"عمر لينا عشرون عامًا."},
  {question:"Qui est étudiant ?",answer:"Son frère est étudiant.",ar:"أخوها هو الطالب."},
  {question:"Où sont les parents ?",answer:"Les parents sont à Marseille.",ar:"الوالدان في مرسيليا."}
 ]
};

const A1_CORE_VERBS_LISTENING={
 title:"Dans la classe",
 arTitle:"داخل الفصل",
 text:"Bonjour, je suis Adam. Nous sommes dans la classe numéro trois. J’ai un livre et Sara a deux cahiers. Nous avons un cours à neuf heures.",
 questions:[
  {prompt:"Comment s’appelle le garçon ?",choices:["Adam","Sami","Nabil"],correctIndex:0},
  {prompt:"Combien de cahiers Sara a-t-elle ?",choices:["Un cahier","Deux cahiers","Trois cahiers"],correctIndex:1},
  {prompt:"À quelle heure est le cours ?",choices:["À huit heures","À neuf heures","À dix heures"],correctIndex:1}
 ]
};

const A1_CORE_VERBS_WRITING_MODEL="Je suis étudiant et j’ai vingt-deux ans. Ma sœur est professeure. Nous sommes à Riyad et nous avons un cours de français le lundi.";

const A1_CORE_VERBS_DICTATION=[
 {speech:"Je suis étudiant.",ar:"أنا طالب."},
 {speech:"Elle a vingt ans.",ar:"عمرها عشرون عامًا."},
 {speech:"Nous avons un cours de français.",ar:"لدينا درس في اللغة الفرنسية."}
];

const A1_CORE_VERBS_BUILDERS=[
 {tokens:["suis","Je","étudiant."],answer:["Je","suis","étudiant."],ar:"أنا طالب."},
 {tokens:["un","Elle","livre.","a"],answer:["Elle","a","un","livre."],ar:"لديها كتاب."},
 {tokens:["à","sommes","Nous","Lyon."],answer:["Nous","sommes","à","Lyon."],ar:"نحن في ليون."}
];

const A1_CORE_VERBS_DIALOGUES=[
 {context:"Votre professeur demande : « Vous êtes étudiant ? »",prompt:"اختر الرد الصحيح.",choices:["Oui, je suis étudiant.","Oui, j’ai étudiant.","Oui, je sommes étudiant."],correctIndex:0,feedback:"لوصف الهوية مع je نستخدم je suis."},
 {context:"On vous demande : « Quel âge avez-vous ? »",prompt:"اختر الإجابة الطبيعية.",choices:["Je suis vingt ans.","J’ai vingt ans.","Je vingt ans."],correctIndex:1,feedback:"العمر في الفرنسية يُعبّر عنه بالفعل avoir: J’ai vingt ans."},
 {context:"Votre ami demande : « Vous avez un cours aujourd’hui ? »",prompt:"اختر الرد المناسب.",choices:["Oui, nous avons un cours.","Oui, nous sommes un cours.","Oui, nous avez un cours."],correctIndex:0,feedback:"مع nous يكون تصريف avoir هو avons."}
];

const A1_STRUCTURES_READING={
 title:"Dans le nouvel appartement",
 arTitle:"داخل الشقة الجديدة",
 text:"C’est mon nouvel appartement. Il y a un salon et deux chambres. Cette pièce est la cuisine et ce petit espace est le balcon. Ces fenêtres donnent sur le jardin. Ce ne sont pas mes meubles : ce sont les meubles du propriétaire.",
 translation:"هذه شقتي الجديدة. فيها غرفة جلوس وغرفتا نوم. هذه الغرفة هي المطبخ، وهذا المكان الصغير هو الشرفة. تطل هذه النوافذ على الحديقة. هذا الأثاث ليس لي؛ بل يعود إلى المالك.",
 questions:[
  {question:"Combien de chambres y a-t-il ?",answer:"Il y a deux chambres.",ar:"توجد غرفتا نوم."},
  {question:"Quelle pièce est la cuisine ?",answer:"Cette pièce est la cuisine.",ar:"هذه الغرفة هي المطبخ."},
  {question:"À qui sont les meubles ?",answer:"Les meubles sont au propriétaire.",ar:"الأثاث يعود إلى المالك."}
 ]
};

const A1_STRUCTURES_LISTENING={
 title:"Près de l’université",
 arTitle:"بالقرب من الجامعة",
 text:"Voici mon quartier. Il y a une boulangerie près de l’université. Ce bâtiment blanc est la bibliothèque et cette grande porte est l’entrée. Il n’y a pas de pharmacie ici.",
 questions:[
  {prompt:"Qu’est-ce qu’il y a près de l’université ?",choices:["Une boulangerie","Une pharmacie","Un hôtel"],correctIndex:0},
  {prompt:"Quel bâtiment est la bibliothèque ?",choices:["Le bâtiment rouge","Le bâtiment blanc","Le petit bâtiment"],correctIndex:1},
  {prompt:"Qu’est-ce qu’il n’y a pas dans le quartier ?",choices:["Une entrée","Une université","Une pharmacie"],correctIndex:2}
 ]
};

const A1_STRUCTURES_WRITING_MODEL="C’est mon quartier. Il y a un café et une petite bibliothèque. Cette rue est calme. Ces bâtiments sont modernes, mais il n’y a pas de pharmacie près d’ici.";

const A1_STRUCTURES_DICTATION=[
 {speech:"C’est mon nouveau quartier.",ar:"هذا حيي الجديد."},
 {speech:"Il y a une bibliothèque près d’ici.",ar:"توجد مكتبة بالقرب من هنا."},
 {speech:"Ces maisons sont très anciennes.",ar:"هذه المنازل قديمة جدًا."}
];

const A1_STRUCTURES_BUILDERS=[
 {tokens:["mon","C’est","professeur."],answer:["C’est","mon","professeur."],ar:"هذا معلمي."},
 {tokens:["une","a","ici.","Il y","pharmacie"],answer:["Il y","a","une","pharmacie","ici."],ar:"توجد صيدلية هنا."},
 {tokens:["sont","Ces","modernes.","bâtiments"],answer:["Ces","bâtiments","sont","modernes."],ar:"هذه المباني حديثة."}
];

const A1_STRUCTURES_DIALOGUES=[
 {context:"Votre ami montre plusieurs personnes et demande : « Qui sont-ils ? »",prompt:"اختر جواب الجمع الصحيح.",choices:["C’est mes voisins.","Ce sont mes voisins.","Il y a mon voisin."],correctIndex:1,feedback:"لتقديم أشخاص أو أشياء في الجمع نستخدم Ce sont."},
 {context:"On demande : « Est-ce qu’il y a un ascenseur ? »",prompt:"اختر جواب النفي الصحيح.",choices:["Non, il n’y a pas d’ascenseur.","Non, ce n’est ascenseur.","Non, il y a pas un ascenseur."],correctIndex:0,feedback:"بعد il n’y a pas نستخدم de أو d’ قبل الاسم."},
 {context:"Vous montrez une maison féminine singulière.",prompt:"اختر أداة الإشارة الصحيحة.",choices:["Ce maison","Cet maison","Cette maison"],correctIndex:2,feedback:"maison مؤنث مفرد، لذلك نقول cette maison."}
];

const A1_QUESTIONS_READING={
 title:"À l’accueil de l’université",
 arTitle:"في استقبال الجامعة",
 text:"— Bonjour, comment vous appelez-vous ? — Je m’appelle Nour. — D’où venez-vous ? — Je viens de Djeddah. — Quelle langue parlez-vous ? — Je parle arabe et un peu français. — Pourquoi apprenez-vous le français ? — Parce que j’aime voyager.",
 translation:"— مرحبًا، ما اسمك؟ — اسمي نور. — من أين أتيتِ؟ — أتيت من جدة. — ما اللغة التي تتحدثينها؟ — أتحدث العربية وقليلًا من الفرنسية. — لماذا تتعلمين الفرنسية؟ — لأنني أحب السفر.",
 questions:[
  {question:"D’où vient Nour ?",answer:"Nour vient de Djeddah.",ar:"نور من جدة."},
  {question:"Quelles langues parle-t-elle ?",answer:"Elle parle arabe et un peu français.",ar:"تتحدث العربية وقليلًا من الفرنسية."},
  {question:"Pourquoi apprend-elle le français ?",answer:"Parce qu’elle aime voyager.",ar:"لأنها تحب السفر."}
 ]
};

const A1_QUESTIONS_LISTENING={
 title:"Une inscription au club",
 arTitle:"التسجيل في النادي",
 text:"Bonjour. Quel est votre nom ? Vous habitez où ? Est-ce que vous êtes étudiant ? Quand êtes-vous libre ? Très bien, le cours commence mardi à dix-huit heures.",
 questions:[
  {prompt:"Pourquoi pose-t-on ces questions ?",choices:["Pour une inscription","Pour commander un repas","Pour acheter un billet"],correctIndex:0},
  {prompt:"Quel jour commence le cours ?",choices:["Lundi","Mardi","Jeudi"],correctIndex:1},
  {prompt:"À quelle heure commence-t-il ?",choices:["À seize heures","À dix-sept heures","À dix-huit heures"],correctIndex:2}
 ]
};

const A1_QUESTIONS_WRITING_MODEL="Bonjour ! Comment vous appelez-vous ? Où habitez-vous ? Quelle langue parlez-vous ? Pourquoi apprenez-vous le français ? Est-ce que vous aimez voyager ?";

const A1_QUESTIONS_DICTATION=[
 {speech:"Comment vous appelez-vous ?",ar:"ما اسمك؟"},
 {speech:"Où habitez-vous ?",ar:"أين تسكن؟"},
 {speech:"Est-ce que vous parlez français ?",ar:"هل تتحدث الفرنسية؟"}
];

const A1_QUESTIONS_BUILDERS=[
 {tokens:["vous","Comment","appelez-vous","?"],answer:["Comment","vous","appelez-vous","?"],ar:"ما اسمك؟"},
 {tokens:["habitez","Où","vous","?"],answer:["Où","habitez","vous","?"],ar:"أين تسكن؟"},
 {tokens:["français","Est-ce que","parlez","vous","?"],answer:["Est-ce que","vous","parlez","français","?"],ar:"هل تتحدث الفرنسية؟"}
];

const A1_QUESTIONS_DIALOGUES=[
 {context:"Vous voulez connaître le lieu de résidence d’une personne.",prompt:"اختر السؤال المناسب.",choices:["Où habitez-vous ?","Quand partez-vous ?","Pourquoi travaillez-vous ?"],correctIndex:0,feedback:"Où تُستخدم للسؤال عن المكان."},
 {context:"Votre professeur demande : « Est-ce que vous comprenez ? »",prompt:"اختر إجابة واضحة.",choices:["Oui, je comprends.","À Paris.","Parce que lundi."],correctIndex:0,feedback:"السؤال المغلق بـ Est-ce que يُجاب عنه بـ oui أو non مع توضيح قصير."},
 {context:"Vous demandez le nom d’une formation : « … formation choisissez-vous ? »",prompt:"اختر الصيغة الصحيحة.",choices:["Quel","Quelle","Quels"],correctIndex:1,feedback:"formation مؤنث مفرد، لذلك نستخدم quelle."}
];

const A1_PRESENT_READING={
 title:"La journée de Karim",
 arTitle:"يوم كريم",
 text:"Karim travaille dans une librairie. Il commence à neuf heures et finit à dix-sept heures. À midi, il prend son déjeuner avec ses collègues. Il ne rentre pas en voiture : il prend le métro. Le soir, ses amis viennent parfois chez lui.",
 translation:"يعمل كريم في مكتبة لبيع الكتب. يبدأ عمله الساعة التاسعة وينتهي الساعة الخامسة مساءً. عند الظهر يتناول الغداء مع زملائه. لا يعود بالسيارة، بل يستقل المترو. وفي المساء يأتي أصدقاؤه أحيانًا إلى منزله.",
 questions:[
  {question:"Où travaille Karim ?",answer:"Karim travaille dans une librairie.",ar:"يعمل كريم في مكتبة لبيع الكتب."},
  {question:"Comment rentre-t-il chez lui ?",answer:"Il rentre chez lui en métro.",ar:"يعود إلى منزله بالمترو."},
  {question:"Qui vient parfois chez lui ?",answer:"Ses amis viennent parfois chez lui.",ar:"يأتي أصدقاؤه أحيانًا إلى منزله."}
 ]
};

const A1_PRESENT_LISTENING={
 title:"Une matinée habituelle",
 arTitle:"صباح معتاد",
 text:"Chaque matin, je me lève à sept heures. Je prépare un café, puis je vais au travail à pied. Je ne prends jamais le bus. Mes collègues arrivent à huit heures et nous commençons ensemble.",
 questions:[
  {prompt:"À quelle heure la personne se lève-t-elle ?",choices:["À six heures","À sept heures","À huit heures"],correctIndex:1},
  {prompt:"Comment va-t-elle au travail ?",choices:["À pied","En bus","En voiture"],correctIndex:0},
  {prompt:"Que font les collègues à huit heures ?",choices:["Ils déjeunent","Ils arrivent","Ils rentrent"],correctIndex:1}
 ]
};

const A1_PRESENT_WRITING_MODEL="Le matin, je commence le travail à huit heures. Je parle avec mes collègues et nous prenons un café. Je ne déjeune pas au bureau. Le soir, je rentre en métro, puis je fais du sport.";

const A1_PRESENT_DICTATION=[
 {speech:"Je travaille à l’université.",ar:"أعمل في الجامعة."},
 {speech:"Nous finissons le cours à midi.",ar:"ننهي الدرس عند الظهر."},
 {speech:"Elle ne prend pas le bus.",ar:"هي لا تستقل الحافلة."}
];

const A1_PRESENT_BUILDERS=[
 {tokens:["français.","parlons","Nous"],answer:["Nous","parlons","français."],ar:"نحن نتحدث الفرنسية."},
 {tokens:["pas","ne","ici.","travaille","Il"],answer:["Il","ne","travaille","pas","ici."],ar:"هو لا يعمل هنا."},
 {tokens:["métro","prend","le","Elle","matin.","chaque"],answer:["Elle","prend","le","métro","chaque","matin."],ar:"تستقل المترو كل صباح."}
];

const A1_PRESENT_DIALOGUES=[
 {context:"Votre ami demande : « Vous travaillez le samedi ? »",prompt:"اختر إجابة منفية صحيحة.",choices:["Non, je ne travaille pas le samedi.","Non, je travaille ne pas le samedi.","Non, je ne pas travaille le samedi."],correctIndex:0,feedback:"في النفي يحيط ne وpas بالفعل المصرف."},
 {context:"Complétez : « Nous … le cours à midi. »",prompt:"اختر تصريف finir مع nous.",choices:["finissons","finissez","finissent"],correctIndex:0,feedback:"تصريف finir مع nous هو finissons."},
 {context:"Complétez : « Mes amis … ce soir. »",prompt:"اختر تصريف venir مع ils.",choices:["vient","venez","viennent"],correctIndex:2,feedback:"تصريف venir مع ils هو viennent."}
];

const A1_MODAL_VERBS_READING={
 title:"Avant le voyage",
 arTitle:"قبل الرحلة",
 text:"Demain, Sami veut partir à Lyon. Il doit préparer sa valise et il faut arriver à la gare avant huit heures. Il peut acheter son billet sur Internet. Sa sœur ne peut pas venir, mais elle veut l’aider ce soir.",
 translation:"يريد سامي السفر إلى ليون غدًا. عليه تجهيز حقيبته، ويجب الوصول إلى المحطة قبل الساعة الثامنة. يمكنه شراء تذكرته عبر الإنترنت. لا تستطيع أخته الحضور، لكنها تريد مساعدته هذا المساء.",
 questions:[
  {question:"Où Sami veut-il aller ?",answer:"Sami veut aller à Lyon.",ar:"يريد سامي الذهاب إلى ليون."},
  {question:"Que doit-il préparer ?",answer:"Il doit préparer sa valise.",ar:"عليه تجهيز حقيبته."},
  {question:"Comment peut-il acheter son billet ?",answer:"Il peut acheter son billet sur Internet.",ar:"يمكنه شراء التذكرة عبر الإنترنت."}
 ]
};

const A1_MODAL_VERBS_LISTENING={
 title:"À la bibliothèque",
 arTitle:"في المكتبة",
 text:"Vous pouvez travailler ici, mais vous devez parler doucement. Si vous voulez utiliser un ordinateur, il faut présenter votre carte. Vous ne pouvez pas manger dans la salle.",
 questions:[
  {prompt:"Que doit-on faire doucement ?",choices:["Parler","Manger","Marcher"],correctIndex:0},
  {prompt:"Que faut-il présenter pour utiliser un ordinateur ?",choices:["Un billet","Une carte","Un livre"],correctIndex:1},
  {prompt:"Qu’est-ce qui est interdit dans la salle ?",choices:["Travailler","Utiliser un ordinateur","Manger"],correctIndex:2}
 ]
};

const A1_MODAL_VERBS_WRITING_MODEL="Je veux apprendre le français. Je peux étudier trente minutes chaque soir. Je dois écouter des phrases simples et il faut pratiquer régulièrement. Le week-end, je veux parler avec un ami.";

const A1_MODAL_VERBS_DICTATION=[
 {speech:"Je peux parler un peu français.",ar:"أستطيع التحدث بالفرنسية قليلًا."},
 {speech:"Nous voulons visiter le musée.",ar:"نريد زيارة المتحف."},
 {speech:"Il faut arriver à l’heure.",ar:"يجب الوصول في الموعد."}
];

const A1_MODAL_VERBS_BUILDERS=[
 {tokens:["vous","Je","aider.","peux"],answer:["Je","peux","vous","aider."],ar:"أستطيع مساعدتك."},
 {tokens:["apprendre","voulons","Nous","français.","le"],answer:["Nous","voulons","apprendre","le","français."],ar:"نريد تعلم الفرنسية."},
 {tokens:["attendre.","devez","Vous"],answer:["Vous","devez","attendre."],ar:"يجب عليكم الانتظار."}
];

const A1_MODAL_VERBS_DIALOGUES=[
 {context:"Vous demandez la permission d’entrer.",prompt:"اختر السؤال المناسب.",choices:["Est-ce que je peux entrer ?","Est-ce que je dois entrée ?","Je veux entré ?"],correctIndex:0,feedback:"لطلب الإذن نستخدم pouvoir متبوعًا بالفعل في المصدر."},
 {context:"Au café, vous commandez poliment.",prompt:"اختر الطلب الأكثر تهذيبًا.",choices:["Je voudrais un café, s’il vous plaît.","Je dois un café.","Je peux café."],correctIndex:0,feedback:"Je voudrais صيغة شائعة ومهذبة عند الطلب."},
 {context:"Une règle concerne tout le monde.",prompt:"أكمل الجملة: « … respecter le silence. »",choices:["Il faut","Je veux","Tu peux"],correctIndex:0,feedback:"Il faut تعبّر عن ضرورة عامة غير مرتبطة بشخص محدد."}
];

const A1_FUTURE_IMPERATIVE_READING={
 title:"Le programme de demain",
 arTitle:"برنامج الغد",
 text:"Demain, nous allons visiter le château. Nous allons partir à neuf heures, mais Lina ne va pas prendre le bus avec nous. Le professeur écrit : « Prenez une bouteille d’eau, arrivez à l’heure et n’oubliez pas votre billet ! »",
 translation:"سنزور القلعة غدًا. سنغادر الساعة التاسعة، لكن لينا لن تستقل الحافلة معنا. يكتب المعلم: «خذوا زجاجة ماء، واحضروا في الموعد، ولا تنسوا تذكرتكم!»",
 questions:[
  {question:"Qu’est-ce que le groupe va visiter ?",answer:"Le groupe va visiter le château.",ar:"ستزور المجموعة القلعة."},
  {question:"Comment Lina ne va-t-elle pas voyager ?",answer:"Lina ne va pas prendre le bus.",ar:"لن تستقل لينا الحافلة."},
  {question:"Que faut-il apporter ?",answer:"Il faut apporter une bouteille d’eau et le billet.",ar:"يجب إحضار زجاجة ماء والتذكرة."}
 ]
};

const A1_FUTURE_IMPERATIVE_LISTENING={
 title:"Avant de sortir",
 arTitle:"قبل الخروج",
 text:"Ce soir, tu vas dîner chez tes amis. Prépare ton sac, prends ton téléphone et ferme la fenêtre. Ne pars pas sans tes clés. Demain matin, vous allez prendre le train ensemble.",
 questions:[
  {prompt:"Où la personne va-t-elle dîner ?",choices:["Au restaurant","Chez ses amis","À la gare"],correctIndex:1},
  {prompt:"Que doit-elle fermer ?",choices:["La porte","Le sac","La fenêtre"],correctIndex:2},
  {prompt:"Quel transport vont-ils prendre demain ?",choices:["Le train","Le bus","Le métro"],correctIndex:0}
 ]
};

const A1_FUTURE_IMPERATIVE_WRITING_MODEL="Demain, nous allons visiter Lyon. Nous allons partir tôt et je ne vais pas prendre la voiture. Prenez vos billets, arrivez à huit heures et n’oubliez pas votre passeport !";

const A1_FUTURE_IMPERATIVE_DICTATION=[
 {speech:"Demain, je vais préparer le dîner.",ar:"سأحضّر العشاء غدًا."},
 {speech:"Nous allons visiter le château.",ar:"سنزور القلعة."},
 {speech:"N’oubliez pas votre billet !",ar:"لا تنسوا تذكرتكم!"}
];

const A1_FUTURE_IMPERATIVE_BUILDERS=[
 {tokens:["visiter","allons","Nous","château.","le"],answer:["Nous","allons","visiter","le","château."],ar:"سنزور القلعة."},
 {tokens:["pas","vais","Je","sortir.","ne"],answer:["Je","ne","vais","pas","sortir."],ar:"لن أخرج."},
 {tokens:["droite","Tournez","à","!"],answer:["Tournez","à","droite","!"],ar:"انعطفوا يمينًا!"}
];

const A1_FUTURE_IMPERATIVE_DIALOGUES=[
 {context:"Vous parlez d’un projet pour ce soir.",prompt:"اختر صيغة المستقبل القريب الصحيحة.",choices:["Je vais regarder un film.","Je va regarder un film.","Je vais regardé un film."],correctIndex:0,feedback:"مع je نستخدم vais ثم الفعل في المصدر regarder."},
 {context:"Vous donnez une instruction polie à plusieurs personnes.",prompt:"أكمل: « … ici, s’il vous plaît. »",choices:["Attendez","Attends","Attendons"],correctIndex:0,feedback:"مع vous تكون صيغة الأمر من attendre هي Attendez."},
 {context:"Vous interdisez de fermer la porte.",prompt:"اختر الأمر المنفي الصحيح.",choices:["Ne fermez pas la porte.","Fermez ne pas la porte.","Ne pas fermez la porte."],correctIndex:0,feedback:"في الأمر المنفي نضع ne قبل الفعل وpas بعده."}
];

const A1_FOOD_SHOPPING_READING={
 title:"Au marché du quartier",
 arTitle:"في سوق الحي",
 text:"Samira prépare le dîner. Au marché, elle achète du pain, de la soupe, des tomates et une bouteille d’huile. Elle ne prend pas de viande aujourd’hui. À la caisse, elle demande : « Combien coûte le fromage ? Est-ce que je peux payer par carte ? »",
 translation:"تحضّر سميرة العشاء. تشتري من السوق خبزًا وحساءً وطماطم وزجاجة زيت. لا تشتري اللحم اليوم. وعند صندوق المحاسبة تسأل: «كم سعر الجبن؟ وهل يمكنني الدفع بالبطاقة؟»",
 questions:[
  {question:"Qu’est-ce que Samira achète ?",answer:"Elle achète du pain, de la soupe, des tomates et une bouteille d’huile.",ar:"تشتري خبزًا وحساءً وطماطم وزجاجة زيت."},
  {question:"Qu’est-ce qu’elle ne prend pas ?",answer:"Elle ne prend pas de viande.",ar:"لا تشتري اللحم."},
  {question:"Comment veut-elle payer ?",answer:"Elle veut payer par carte.",ar:"تريد الدفع بالبطاقة."}
 ]
};

const A1_FOOD_SHOPPING_LISTENING={
 title:"À la boulangerie",
 arTitle:"في المخبز",
 text:"Bonjour, je voudrais deux baguettes et trois croissants, s’il vous plaît. Je prends aussi un litre de lait. Combien ça coûte ? — Cela fait neuf euros cinquante. — Je paie en espèces.",
 questions:[
  {prompt:"Combien de baguettes le client demande-t-il ?",choices:["Une","Deux","Trois"],correctIndex:1},
  {prompt:"Combien coûte la commande ?",choices:["Huit euros cinquante","Neuf euros","Neuf euros cinquante"],correctIndex:2},
  {prompt:"Comment le client paie-t-il ?",choices:["Par carte","En espèces","Par téléphone"],correctIndex:1}
 ]
};

const A1_FOOD_SHOPPING_WRITING_MODEL="Pour le dîner, je voudrais du pain, de la soupe et des tomates. Il me faut aussi une bouteille d’eau et un kilo de pommes. Je ne prends pas de viande. Je vais payer par carte.";

const A1_FOOD_SHOPPING_DICTATION=[
 {speech:"Je voudrais un kilo de pommes.",ar:"أرغب في كيلوغرام من التفاح."},
 {speech:"Nous achetons du pain et des tomates.",ar:"نشتري خبزًا وطماطم."},
 {speech:"Je ne prends pas de sucre.",ar:"لا أتناول السكر."}
];

const A1_FOOD_SHOPPING_BUILDERS=[
 {tokens:["pain.","du","J’achète"],answer:["J’achète","du","pain."],ar:"أشتري خبزًا."},
 {tokens:["pommes,","kilo","voudrais","de","Je","un","s’il vous plaît."],answer:["Je","voudrais","un","kilo","de","pommes,","s’il vous plaît."],ar:"أرغب في كيلوغرام من التفاح، من فضلك."},
 {tokens:["pas","café.","ne","de","prends","Je"],answer:["Je","ne","prends","pas","de","café."],ar:"لا أتناول القهوة."}
];

const A1_FOOD_SHOPPING_DIALOGUES=[
 {context:"Vous commandez poliment une boisson.",prompt:"اختر العبارة المناسبة.",choices:["Je voudrais de l’eau, s’il vous plaît.","Je veux de eau.","Je voudrais du eau."],correctIndex:0,feedback:"قبل eau نستخدم de l’، وJe voudrais تجعل الطلب مهذبًا."},
 {context:"Le vendeur demande : « Vous prenez du sucre ? »",prompt:"اختر جواب النفي الصحيح.",choices:["Non, je ne prends pas de sucre.","Non, je ne prends pas du sucre.","Non, je prends ne pas sucre."],correctIndex:0,feedback:"بعد النفي تتحول أداة التجزئة إلى de."},
 {context:"Vous voulez connaître le prix.",prompt:"اختر السؤال الطبيعي.",choices:["Combien ça coûte ?","Quel ça mange ?","Où ça paie ?"],correctIndex:0,feedback:"Combien ça coûte ? هو السؤال الشائع عن السعر."}
];

const A1_CITY_DIRECTIONS_READING={
 title:"De l’hôtel à la gare",
 arTitle:"من الفندق إلى محطة القطار",
 text:"Nora sort de l’hôtel et va à la gare à pied. Elle marche tout droit jusqu’au feu, puis elle tourne à gauche après la banque. La gare est en face du parc, à côté d’un café. Le train part à dix heures.",
 translation:"تخرج نورا من الفندق وتتجه إلى محطة القطار مشيًا. تسير مباشرة حتى إشارة المرور، ثم تنعطف يسارًا بعد البنك. تقع المحطة مقابل الحديقة وبجوار مقهى. ينطلق القطار الساعة العاشرة.",
 questions:[
  {question:"D’où part Nora ?",answer:"Nora part de l’hôtel.",ar:"تنطلق نورا من الفندق."},
  {question:"Où tourne-t-elle à gauche ?",answer:"Elle tourne à gauche après la banque.",ar:"تنعطف يسارًا بعد البنك."},
  {question:"Où se trouve la gare ?",answer:"La gare est en face du parc, à côté d’un café.",ar:"تقع المحطة مقابل الحديقة وبجوار مقهى."}
 ]
};

const A1_CITY_DIRECTIONS_LISTENING={
 title:"Pour aller à la pharmacie",
 arTitle:"للوصول إلى الصيدلية",
 text:"Excusez-moi, pour aller à la pharmacie ? — Allez tout droit, traversez la place et tournez à droite. La pharmacie est entre la boulangerie et la banque, juste devant l’arrêt de bus.",
 questions:[
  {prompt:"Que faut-il traverser ?",choices:["Le parc","La place","La rue"],correctIndex:1},
  {prompt:"De quel côté faut-il tourner ?",choices:["À droite","À gauche","Derrière"],correctIndex:0},
  {prompt:"Où est la pharmacie ?",choices:["Derrière la banque","Entre la boulangerie et la banque","À côté du parc"],correctIndex:1}
 ]
};

const A1_CITY_DIRECTIONS_WRITING_MODEL="Je pars de l’hôtel et je vais à la gare. Allez tout droit jusqu’au feu, puis tournez à gauche. La gare est en face du parc, à côté de la banque.";

const A1_CITY_DIRECTIONS_DICTATION=[
 {speech:"Je vais au centre-ville en bus.",ar:"أذهب إلى وسط المدينة بالحافلة."},
 {speech:"Tournez à gauche après la banque.",ar:"انعطفوا يسارًا بعد البنك."},
 {speech:"Le musée est en face du parc.",ar:"يقع المتحف مقابل الحديقة."}
];

const A1_CITY_DIRECTIONS_BUILDERS=[
 {tokens:["à","vais","gare.","la","Je"],answer:["Je","vais","à","la","gare."],ar:"أذهب إلى محطة القطار."},
 {tokens:["tout","feu.","Allez","droit","jusqu’au"],answer:["Allez","tout","droit","jusqu’au","feu."],ar:"اذهبوا مباشرة حتى إشارة المرور."},
 {tokens:["parc.","du","face","musée","en","Le","est"],answer:["Le","musée","est","en","face","du","parc."],ar:"يقع المتحف مقابل الحديقة."}
];

const A1_CITY_DIRECTIONS_DIALOGUES=[
 {context:"Vous cherchez la gare.",prompt:"اختر السؤال المهذب المناسب.",choices:["Excusez-moi, où se trouve la gare ?","La gare combien ?","Pourquoi la gare est ?"],correctIndex:0,feedback:"Où se trouve… ? صيغة واضحة ومهذبة للسؤال عن المكان."},
 {context:"Vous indiquez de continuer sans tourner.",prompt:"اختر التعليمة الصحيحة.",choices:["Allez tout droit.","Tournez derrière.","Venez du parc."],correctIndex:0,feedback:"Allez tout droit تعني: اذهب مباشرة."},
 {context:"Complétez : « Le bus part … centre-ville. »",prompt:"اختر حرف الجر الصحيح.",choices:["au","du","aux"],correctIndex:1,feedback:"de + le تصبح du للتعبير عن نقطة الانطلاق."}
];

const A1_NUMBERS_TIME_READING={
 title:"Une journée bien organisée",
 arTitle:"يوم منظّم",
 text:"Aujourd’hui, nous sommes le mardi 12 mars. Lina commence son cours à huit heures et demie. À midi, elle achète un déjeuner à quinze euros. Son rendez-vous est à quatorze heures vingt. Le soir, elle appelle sa mère au zéro six, vingt et un, trente, quarante-deux, cinquante.",
 translation:"اليوم هو الثلاثاء 12 مارس. تبدأ لينا درسها عند الثامنة والنصف. وعند الظهر تشتري وجبة غداء بسعر خمسة عشر يورو. موعدها عند الثانية وعشرين دقيقة بعد الظهر. وفي المساء تتصل بوالدتها على الرقم: صفر ستة، واحد وعشرون، ثلاثون، اثنان وأربعون، خمسون.",
 questions:[
  {question:"Quel jour sommes-nous ?",answer:"Nous sommes le mardi 12 mars.",ar:"اليوم هو الثلاثاء 12 مارس."},
  {question:"À quelle heure commence le cours ?",answer:"Le cours commence à huit heures et demie.",ar:"يبدأ الدرس عند الثامنة والنصف."},
  {question:"Combien coûte le déjeuner ?",answer:"Le déjeuner coûte quinze euros.",ar:"سعر وجبة الغداء خمسة عشر يورو."}
 ]
};

const A1_NUMBERS_TIME_LISTENING={
 title:"Les horaires du samedi",
 arTitle:"مواعيد يوم السبت",
 text:"Samedi 20 avril, le musée ouvre à neuf heures quinze et ferme à dix-huit heures. La visite guidée commence à onze heures. Le billet adulte coûte douze euros et le billet enfant coûte sept euros.",
 questions:[
  {prompt:"À quelle heure ouvre le musée ?",choices:["À neuf heures","À neuf heures quinze","À dix heures quinze"],correctIndex:1},
  {prompt:"Quand commence la visite guidée ?",choices:["À onze heures","À midi","À dix-huit heures"],correctIndex:0},
  {prompt:"Combien coûte le billet enfant ?",choices:["Sept euros","Douze euros","Vingt euros"],correctIndex:0}
 ]
};

const A1_NUMBERS_TIME_WRITING_MODEL="Lundi 8 avril, je commence le travail à huit heures trente. Mon rendez-vous est à onze heures. À midi, j’achète un repas à douze euros. Le soir, mon cours finit à dix-neuf heures.";

const A1_NUMBERS_TIME_DICTATION=[
 {speech:"Il est huit heures et demie.",ar:"الساعة الثامنة والنصف."},
 {speech:"Nous sommes le quinze mai.",ar:"اليوم هو الخامس عشر من مايو."},
 {speech:"Le billet coûte vingt et un euros.",ar:"سعر التذكرة واحد وعشرون يورو."}
];

const A1_NUMBERS_TIME_BUILDERS=[
 {tokens:["heures","Il","et","est","demie.","huit"],answer:["Il","est","huit","heures","et","demie."],ar:"الساعة الثامنة والنصف."},
 {tokens:["le","avril.","sommes","Nous","douze"],answer:["Nous","sommes","le","douze","avril."],ar:"اليوم هو الثاني عشر من أبريل."},
 {tokens:["euros.","coûte","livre","vingt","Le"],answer:["Le","livre","coûte","vingt","euros."],ar:"سعر الكتاب عشرون يورو."}
];

const A1_NUMBERS_TIME_DIALOGUES=[
 {context:"On vous demande : « Quelle heure est-il ? »",prompt:"اختر الإجابة الصحيحة للساعة 8:30.",choices:["Il est huit heures et demie.","Nous sommes huit heures.","Il a huit et demie."],correctIndex:0,feedback:"لذكر الوقت نبدأ بـ Il est ثم الساعة."},
 {context:"Vous annoncez la date du 1er juin.",prompt:"اختر الصيغة الصحيحة.",choices:["Nous sommes le premier juin.","Nous sommes le un juin.","Il est premier juin."],correctIndex:0,feedback:"اليوم الأول من الشهر يُقال le premier."},
 {context:"Le vendeur dit : « Cela fait trente-deux euros. »",prompt:"ما السعر المذكور؟",choices:["22 €","32 €","42 €"],correctIndex:1,feedback:"trente-deux تعني اثنين وثلاثين."}
];

const A1_WEATHER_CLOTHES_READING={
 title:"Un week-end à Annecy",
 arTitle:"عطلة نهاية الأسبوع في آنسي",
 text:"Ce week-end, Lina va à Annecy. Samedi matin, il fait frais et il y a des nuages. L’après-midi, il pleut et la température est de douze degrés. Lina porte un pantalon noir, un pull chaud et une veste imperméable. Elle prend aussi son parapluie.",
 translation:"تذهب لينا إلى آنسي في عطلة نهاية هذا الأسبوع. يكون الجو منعشًا صباح السبت وتوجد غيوم. وفي فترة بعد الظهر تمطر وتبلغ الحرارة اثنتي عشرة درجة. ترتدي لينا بنطالًا أسود وكنزة دافئة وسترة مقاومة للمطر، وتأخذ مظلتها أيضًا.",
 questions:[
  {question:"Quel temps fait-il samedi matin ?",answer:"Il fait frais et il y a des nuages.",ar:"الجو منعش وتوجد غيوم."},
  {question:"Quelle est la température l’après-midi ?",answer:"La température est de douze degrés.",ar:"درجة الحرارة اثنتا عشرة درجة."},
  {question:"Pourquoi Lina prend-elle un parapluie ?",answer:"Elle prend un parapluie parce qu’il pleut.",ar:"تأخذ مظلة لأن الجو ممطر."}
 ]
};

const A1_WEATHER_CLOTHES_LISTENING={
 title:"La météo de demain",
 arTitle:"طقس الغد",
 text:"Demain matin, il va faire froid à Paris : huit degrés et beaucoup de vent. À midi, il va y avoir du soleil, mais le soir, il va pleuvoir. Prenez un manteau et un parapluie.",
 questions:[
  {prompt:"Quelle température est annoncée le matin ?",choices:["Huit degrés","Douze degrés","Dix-huit degrés"],correctIndex:0},
  {prompt:"Quel temps va-t-il faire à midi ?",choices:["Il va neiger","Il va y avoir du soleil","Il va pleuvoir"],correctIndex:1},
  {prompt:"Quels objets faut-il prendre ?",choices:["Un pull et des lunettes","Un manteau et un parapluie","Une chemise et un chapeau"],correctIndex:1}
 ]
};

const A1_WEATHER_CLOTHES_WRITING_MODEL="En hiver, il fait froid et il y a souvent du vent. Aujourd’hui, il pleut et il fait neuf degrés. Je porte un pantalon noir, un pull chaud et une veste imperméable. Je prends mon parapluie.";

const A1_WEATHER_CLOTHES_DICTATION=[
 {speech:"Aujourd’hui, il fait beau et chaud.",ar:"الطقس اليوم جميل وحار."},
 {speech:"En automne, il y a souvent du vent.",ar:"تهب الرياح كثيرًا في الخريف."},
 {speech:"Je porte un manteau et des chaussures noires.",ar:"أرتدي معطفًا وأحذية سوداء."}
];

const A1_WEATHER_CLOTHES_BUILDERS=[
 {tokens:["beau","Il","aujourd’hui.","fait"],answer:["Il","fait","beau","aujourd’hui."],ar:"الطقس جميل اليوم."},
 {tokens:["hiver,","neige.","En","il"],answer:["En","hiver,","il","neige."],ar:"تتساقط الثلوج في الشتاء."},
 {tokens:["veste","porte","bleue.","une","Elle"],answer:["Elle","porte","une","veste","bleue."],ar:"ترتدي سترة زرقاء."}
];

const A1_WEATHER_CLOTHES_DIALOGUES=[
 {context:"On vous demande : « Quel temps fait-il ? »",prompt:"اختر الإجابة الطبيعية.",choices:["Il fait froid et il y a du vent.","Je suis le froid.","Le vent porte un manteau."],correctIndex:0,feedback:"نصف الطقس بتراكيب ثابتة مثل il fait وil y a."},
 {context:"Il pleut avant de sortir.",prompt:"اختر النصيحة المناسبة.",choices:["Prends ton parapluie.","Mets tes lunettes de soleil.","Porte un maillot de bain."],correctIndex:0,feedback:"عند المطر نأخذ المظلة: un parapluie."},
 {context:"Complétez : « Elle porte une chemise … »",prompt:"اختر اتفاق اللون الصحيح.",choices:["blanc","blanche","blancs"],correctIndex:1,feedback:"chemise مؤنث مفرد، لذلك تصبح blanc: blanche."}
];

const A1_HOME_HOUSING_READING={
 title:"Le nouvel appartement de Youssef",
 arTitle:"شقة يوسف الجديدة",
 text:"Youssef habite au 24, rue des Fleurs, à Nantes. Son appartement est au troisième étage. Il y a un salon, une cuisine, deux chambres et un petit balcon. Dans le salon, le canapé est devant la fenêtre et la lampe est à côté de la bibliothèque.",
 translation:"يسكن يوسف في 24 شارع دي فلور بمدينة نانت. تقع شقته في الطابق الثالث. فيها غرفة جلوس ومطبخ وغرفتا نوم وشرفة صغيرة. في غرفة الجلوس تقع الأريكة أمام النافذة، والمصباح بجوار خزانة الكتب.",
 questions:[
  {question:"Quelle est l’adresse de Youssef ?",answer:"Il habite au 24, rue des Fleurs, à Nantes.",ar:"يسكن في 24 شارع دي فلور بمدينة نانت."},
  {question:"Combien de chambres y a-t-il ?",answer:"Il y a deux chambres.",ar:"توجد غرفتا نوم."},
  {question:"Où est la lampe ?",answer:"La lampe est à côté de la bibliothèque.",ar:"المصباح بجوار خزانة الكتب."}
 ]
};

const A1_HOME_HOUSING_LISTENING={
 title:"Un studio à louer",
 arTitle:"استوديو للإيجار",
 text:"Ce studio est au deuxième étage, près du centre-ville. Il y a une grande pièce, une petite cuisine et une salle de bains. Le lit est près de la fenêtre et la table est entre le lit et la porte. Le loyer est de six cents euros par mois.",
 questions:[
  {prompt:"À quel étage est le studio ?",choices:["Au premier étage","Au deuxième étage","Au troisième étage"],correctIndex:1},
  {prompt:"Où est la table ?",choices:["Sous le lit","Entre le lit et la porte","Derrière la cuisine"],correctIndex:1},
  {prompt:"Quel est le loyer mensuel ?",choices:["500 euros","600 euros","700 euros"],correctIndex:1}
 ]
};

const A1_HOME_HOUSING_WRITING_MODEL="J’habite dans un appartement au 15, rue Victor-Hugo. Il y a un salon, une chambre et une cuisine. Dans le salon, le canapé est devant la fenêtre et la table est à côté de la porte.";

const A1_HOME_HOUSING_DICTATION=[
 {speech:"J’habite dans un appartement calme.",ar:"أسكن في شقة هادئة."},
 {speech:"Il y a deux chambres et un balcon.",ar:"توجد غرفتا نوم وشرفة."},
 {speech:"La table est à côté de la fenêtre.",ar:"الطاولة بجوار النافذة."}
];

const A1_HOME_HOUSING_BUILDERS=[
 {tokens:["une","dans","maison.","J’habite"],answer:["J’habite","dans","une","maison."],ar:"أسكن في منزل."},
 {tokens:["petit","a","balcon.","un","Il y"],answer:["Il y","a","un","petit","balcon."],ar:"توجد شرفة صغيرة."},
 {tokens:["sous","chaise","La","table.","la","est"],answer:["La","chaise","est","sous","la","table."],ar:"الكرسي تحت الطاولة."}
];

const A1_HOME_HOUSING_DIALOGUES=[
 {context:"On vous demande : « Vous habitez où ? »",prompt:"اختر إجابة كاملة.",choices:["J’habite dans un appartement à Lyon.","Je suis un appartement Lyon.","J’habite au troisième chambre."],correctIndex:0,feedback:"نستخدم habiter dans مع نوع المسكن، ثم à مع المدينة."},
 {context:"Vous décrivez une pièce avec un canapé.",prompt:"اختر الجملة الصحيحة.",choices:["Il y a un canapé dans le salon.","Le salon a il canapé.","Il est canapé au salon."],correctIndex:0,feedback:"Il y a تقدّم شيئًا موجودًا داخل المكان."},
 {context:"La lampe se trouve près du lit.",prompt:"اختر التعبير المناسب.",choices:["La lampe est à côté du lit.","La lampe est entre le lit.","La lampe est sous à lit."],correctIndex:0,feedback:"à côté de تعني بجوار، وتصبح du قبل الاسم المذكر المعرف."}
];

const A1_DESCRIPTION_READING={
 title:"Un dimanche en famille",
 arTitle:"يوم أحد مع العائلة",
 text:"Aujourd’hui, Sami déjeune avec sa famille. Son père est calme et sa mère est contente. Sa sœur a faim parce qu’elle arrive tard. Son petit frère est fatigué, mais il est heureux de voir ses grands-parents. Toute la famille est réunie.",
 translation:"يتناول سامي الغداء اليوم مع عائلته. والده هادئ ووالدته سعيدة. أخته جائعة لأنها وصلت متأخرة. أخوه الصغير متعب، لكنه سعيد برؤية جدّيه. اجتمعت العائلة كلها.",
 questions:[
  {question:"Comment est le père de Sami ?",answer:"Son père est calme.",ar:"والد سامي هادئ."},
  {question:"Pourquoi sa sœur a-t-elle faim ?",answer:"Elle a faim parce qu’elle arrive tard.",ar:"هي جائعة لأنها وصلت متأخرة."},
  {question:"Qui est fatigué ?",answer:"Son petit frère est fatigué.",ar:"أخوه الصغير متعب."}
 ]
};

const A1_DESCRIPTION_LISTENING={
 title:"Des nouvelles de la famille",
 arTitle:"أخبار العائلة",
 text:"Mon frère est très content aujourd’hui : il a un nouveau travail. Mes parents sont fiers de lui. Ma grand-mère est un peu fatiguée et elle a froid, alors nous lui préparons une boisson chaude.",
 questions:[
  {prompt:"Pourquoi le frère est-il content ?",choices:["Il a un nouveau travail","Il part en voyage","Il achète une maison"],correctIndex:0},
  {prompt:"Comment sont les parents ?",choices:["Tristes","Fiers","Malades"],correctIndex:1},
  {prompt:"Que prépare la famille pour la grand-mère ?",choices:["Un repas froid","Une boisson chaude","Un médicament"],correctIndex:1}
 ]
};

const A1_DESCRIPTION_WRITING_MODEL="Dans ma famille, mon père est calme et ma mère est très gentille. Mon frère est content aujourd’hui, mais il est fatigué. Ma sœur a faim et mes grands-parents sont heureux de nous voir.";

const A1_DESCRIPTION_DICTATION=[
 {speech:"Voici ma sœur et mon frère.",ar:"هذه أختي وهذا أخي."},
 {speech:"Je suis fatigué, mais je suis content.",ar:"أنا متعب، لكنني سعيد."},
 {speech:"Mon grand-père a faim et ma grand-mère a soif.",ar:"جدي جائع وجدتي عطشى."}
];

const A1_DESCRIPTION_BUILDERS=[
 {tokens:["frère.","mon","Voici"],answer:["Voici","mon","frère."],ar:"هذا أخي."},
 {tokens:["très","mère","contente.","Ma","est"],answer:["Ma","mère","est","très","contente."],ar:"والدتي سعيدة جدًا."},
 {tokens:["faim.","parents","ont","Mes"],answer:["Mes","parents","ont","faim."],ar:"والداي جائعان."}
];

const A1_DESCRIPTION_DIALOGUES=[
 {context:"On vous montre une femme de la famille et demande : « Qui est-ce ? »",prompt:"اختر الإجابة الصحيحة.",choices:["C’est ma sœur.","C’est mon sœur.","Ce sont ma sœur."],correctIndex:0,feedback:"sœur مؤنث، لذلك نستخدم ma sœur."},
 {context:"Votre ami demande : « Comment vas-tu ? »",prompt:"اختر جوابًا يصف حالة جسدية.",choices:["Je suis fatigué.","Je suis mon frère.","J’ai le dimanche."],correctIndex:0,feedback:"être + fatigué يصف حالة جسدية عامة."},
 {context:"Une personne veut dire qu’elle a peur.",prompt:"اختر التعبير الفرنسي الصحيح.",choices:["J’ai peur.","Je suis peur.","Je fais peur de moi."],correctIndex:0,feedback:"الخوف يُعبّر عنه بالتركيب الثابت avoir peur."}
];

const A1_HEALTH_NEEDS_READING={
 title:"Chez le médecin",
 arTitle:"عند الطبيب",
 text:"Le médecin demande : « Qu’est-ce que vous avez ? » Adam répond : « J’ai de la fièvre et j’ai mal à la gorge depuis hier. Je suis aussi très fatigué. » Le médecin examine Adam et lui conseille de se reposer et de boire de l’eau.",
 translation:"يسأل الطبيب: «ما المشكلة؟» يجيب آدم: «لدي حمى وأشعر بألم في الحلق منذ أمس، كما أنني متعب جدًا». يفحص الطبيب آدم وينصحه بالراحة وشرب الماء.",
 questions:[
  {question:"Quels symptômes Adam a-t-il ?",answer:"Il a de la fièvre, mal à la gorge et il est fatigué.",ar:"لديه حمى وألم في الحلق ويشعر بالتعب."},
  {question:"Depuis quand a-t-il mal à la gorge ?",answer:"Il a mal à la gorge depuis hier.",ar:"يشعر بألم في الحلق منذ أمس."},
  {question:"Que lui conseille le médecin ?",answer:"Le médecin lui conseille de se reposer et de boire de l’eau.",ar:"ينصحه الطبيب بالراحة وشرب الماء."}
 ]
};

const A1_HEALTH_NEEDS_LISTENING={
 title:"À la pharmacie",
 arTitle:"في الصيدلية",
 text:"Bonjour, je suis malade. J’ai de la toux et mal à la tête depuis deux jours. Je voudrais parler au pharmacien, s’il vous plaît. — Bien sûr. Est-ce que vous prenez déjà un médicament ?",
 questions:[
  {prompt:"Quels problèmes la personne décrit-elle ?",choices:["De la toux et mal à la tête","De la fièvre et mal au dos","Mal aux dents"],correctIndex:0},
  {prompt:"Depuis combien de temps ?",choices:["Depuis hier","Depuis deux jours","Depuis une semaine"],correctIndex:1},
  {prompt:"À qui veut-elle parler ?",choices:["Au médecin","À l’infirmier","Au pharmacien"],correctIndex:2}
 ]
};

const A1_HEALTH_NEEDS_WRITING_MODEL="Bonjour, je voudrais prendre rendez-vous avec un médecin. J’ai de la fièvre et mal à la tête depuis hier. Je suis très fatigué. Est-ce que vous avez une place demain matin, s’il vous plaît ?";

const A1_HEALTH_NEEDS_DICTATION=[
 {speech:"J’ai mal à la tête depuis hier.",ar:"أشعر بألم في الرأس منذ أمس."},
 {speech:"Je voudrais prendre rendez-vous avec un médecin.",ar:"أود حجز موعد مع طبيب."},
 {speech:"Appelez une ambulance, s’il vous plaît.",ar:"اتصلوا بسيارة إسعاف، من فضلكم."}
];

const A1_HEALTH_NEEDS_BUILDERS=[
 {tokens:["tête.","la","à","mal","J’ai"],answer:["J’ai","mal","à","la","tête."],ar:"أشعر بألم في الرأس."},
 {tokens:["deux","toux","la","jours.","depuis","J’ai","de"],answer:["J’ai","de","la","toux","depuis","deux","jours."],ar:"لدي سعال منذ يومين."},
 {tokens:["besoin","J’ai","d’aide."],answer:["J’ai","besoin","d’aide."],ar:"أحتاج إلى مساعدة."}
];

const A1_HEALTH_NEEDS_DIALOGUES=[
 {context:"Le médecin demande : « Qu’est-ce que vous avez ? »",prompt:"اختر الإجابة الواضحة.",choices:["J’ai de la fièvre et mal à la gorge.","Je suis la fièvre.","J’ai depuis médecin."],correctIndex:0,feedback:"نذكر العرض بـ avoir، ونحدد الألم بـ avoir mal à."},
 {context:"Vous avez mal aux dents.",prompt:"اختر الأداة الصحيحة.",choices:["J’ai mal à les dents.","J’ai mal aux dents.","J’ai mal au dents."],correctIndex:1,feedback:"à + les تصبح aux: avoir mal aux dents."},
 {context:"Vous voulez fixer une consultation.",prompt:"اختر الطلب المهذب.",choices:["Je voudrais prendre rendez-vous.","Je prends médecin maintenant.","Je veux rendez-vous prend."],correctIndex:0,feedback:"Je voudrais prendre rendez-vous صيغة مهذبة وطبيعية."}
];

const A1_ADJECTIVES_READING={
 title:"Deux personnes différentes",
 arTitle:"شخصان مختلفان",
 text:"Mon ami Nabil est grand et mince. Il a les cheveux courts et les yeux noirs. Il est calme, gentil et très patient. Ma cousine Leïla est petite et sportive. Elle a les cheveux longs. Elle est sérieuse, organisée et sociable.",
 translation:"صديقي نبيل طويل ونحيف، وشعره قصير وعيناه سوداوان. وهو هادئ ولطيف وصبور جدًا. أما ابنة عمي ليلى فهي قصيرة ورياضية وشعرها طويل، وهي جادة ومنظمة واجتماعية.",
 questions:[
  {question:"Comment est Nabil physiquement ?",answer:"Nabil est grand et mince, avec les cheveux courts et les yeux noirs.",ar:"نبيل طويل ونحيف، وشعره قصير وعيناه سوداوان."},
  {question:"Quel est son caractère ?",answer:"Il est calme, gentil et patient.",ar:"هو هادئ ولطيف وصبور."},
  {question:"Comment est Leïla ?",answer:"Elle est petite, sportive, sérieuse, organisée et sociable.",ar:"هي قصيرة ورياضية وجادة ومنظمة واجتماعية."}
 ]
};

const A1_ADJECTIVES_LISTENING={
 title:"Deviner la personne",
 arTitle:"تعرّف على الشخص",
 text:"Cette personne est grande et sportive. Elle a les cheveux courts et bruns. Elle est très sociable, mais aussi sérieuse et organisée. Elle porte une veste bleue.",
 questions:[
  {prompt:"Comment est cette personne physiquement ?",choices:["Grande et sportive","Petite et mince","Grande et fatiguée"],correctIndex:0},
  {prompt:"Comment sont ses cheveux ?",choices:["Longs et noirs","Courts et bruns","Courts et blonds"],correctIndex:1},
  {prompt:"De quelle couleur est sa veste ?",choices:["Blanche","Noire","Bleue"],correctIndex:2}
 ]
};

const A1_ADJECTIVES_WRITING_MODEL="Mon frère est grand et sportif. Il a les cheveux courts et il est calme et patient. Ma sœur est petite et sportive. Elle a les cheveux longs et elle est sérieuse, gentille et sociable.";

const A1_ADJECTIVES_DICTATION=[
 {speech:"Il est grand, calme et patient.",ar:"هو طويل وهادئ وصبور."},
 {speech:"Elle est petite, sérieuse et organisée.",ar:"هي قصيرة وجادة ومنظمة."},
 {speech:"Elles ont les cheveux longs et noirs.",ar:"شعرهن طويل وأسود."}
];

const A1_ADJECTIVES_BUILDERS=[
 {tokens:["et","grand","Il","mince.","est"],answer:["Il","est","grand","et","mince."],ar:"هو طويل ونحيف."},
 {tokens:["organisée.","est","sérieuse","Elle","et"],answer:["Elle","est","sérieuse","et","organisée."],ar:"هي جادة ومنظمة."},
 {tokens:["intelligentes.","filles","sont","Ces"],answer:["Ces","filles","sont","intelligentes."],ar:"هؤلاء الفتيات ذكيات."}
];

const A1_ADJECTIVES_DIALOGUES=[
 {context:"Vous décrivez une femme de petite taille.",prompt:"اختر الصفة المتوافقة.",choices:["Elle est petit.","Elle est petite.","Elle est petits."],correctIndex:1,feedback:"نضيف e غالبًا إلى الصفة مع المؤنث المفرد: petite."},
 {context:"Vous parlez de plusieurs garçons intelligents.",prompt:"اختر المجموعة الصحيحة.",choices:["des garçons intelligent","des garçons intelligents","des garçon intelligentes"],correctIndex:1,feedback:"الصفة مع جمع المذكر تأخذ غالبًا s: intelligents."},
 {context:"Vous décrivez les cheveux d’une personne.",prompt:"اختر التركيب الطبيعي.",choices:["Elle a les cheveux longs.","Elle est les cheveux longs.","Elle a cheveux longue."],correctIndex:0,feedback:"لوصف الشعر نستخدم avoir: avoir les cheveux longs."}
];

const A1_DAILY_LIFE_READING={
 title:"La journée de Mehdi",
 arTitle:"يوم مهدي",
 text:"En général, Mehdi se lève à six heures trente. D’abord, il se prépare et prend son petit-déjeuner. Ensuite, il va au travail en métro. Il déjeune souvent avec ses collègues. Le soir, il fait parfois du sport, puis il rentre chez lui. Il ne se couche jamais après minuit.",
 translation:"يستيقظ مهدي عادةً عند السادسة والنصف. يستعد أولًا ويتناول فطوره، ثم يذهب إلى العمل بالمترو. غالبًا ما يتناول الغداء مع زملائه. وفي المساء يمارس الرياضة أحيانًا، ثم يعود إلى منزله. ولا ينام بعد منتصف الليل أبدًا.",
 questions:[
  {question:"À quelle heure Mehdi se lève-t-il ?",answer:"Il se lève à six heures trente.",ar:"يستيقظ عند السادسة والنصف."},
  {question:"Comment va-t-il au travail ?",answer:"Il va au travail en métro.",ar:"يذهب إلى العمل بالمترو."},
  {question:"Quand fait-il parfois du sport ?",answer:"Il fait parfois du sport le soir.",ar:"يمارس الرياضة أحيانًا في المساء."}
 ]
};

const A1_DAILY_LIFE_LISTENING={
 title:"Une matinée à la maison",
 arTitle:"صباح في المنزل",
 text:"Le samedi, nous nous levons à huit heures. D’abord, nous préparons le petit-déjeuner. Puis, les enfants s’habillent et rangent leur chambre. Nous faisons souvent les courses ensemble, mais nous ne déjeunons jamais avant midi.",
 questions:[
  {prompt:"À quelle heure la famille se lève-t-elle ?",choices:["À sept heures","À huit heures","À neuf heures"],correctIndex:1},
  {prompt:"Que font les enfants après le petit-déjeuner ?",choices:["Ils s’habillent et rangent leur chambre","Ils vont à l’école","Ils se couchent"],correctIndex:0},
  {prompt:"Quand la famille déjeune-t-elle ?",choices:["Toujours avant midi","Jamais avant midi","À huit heures"],correctIndex:1}
 ]
};

const A1_DAILY_LIFE_WRITING_MODEL="En général, je me lève à sept heures. D’abord, je me prépare et je prends mon petit-déjeuner. Ensuite, je vais au travail. Je déjeune souvent à midi. Le soir, je me repose, puis je lis. Je ne me couche jamais tard.";

const A1_DAILY_LIFE_DICTATION=[
 {speech:"Je me lève à sept heures.",ar:"أستيقظ الساعة السابعة."},
 {speech:"Nous faisons souvent du sport le soir.",ar:"نمارس الرياضة غالبًا في المساء."},
 {speech:"Elle ne se couche jamais tard.",ar:"هي لا تنام متأخرة أبدًا."}
];

const A1_DAILY_LIFE_BUILDERS=[
 {tokens:["sept","Je","à","lève","heures.","me"],answer:["Je","me","lève","à","sept","heures."],ar:"أستيقظ الساعة السابعة."},
 {tokens:["souvent","Nous","sport.","du","faisons"],answer:["Nous","faisons","souvent","du","sport."],ar:"نمارس الرياضة غالبًا."},
 {tokens:["jamais","ne","tard.","couche","Elle","se"],answer:["Elle","ne","se","couche","jamais","tard."],ar:"هي لا تنام متأخرة أبدًا."}
];

const A1_DAILY_LIFE_DIALOGUES=[
 {context:"On vous demande : « À quelle heure vous levez-vous ? »",prompt:"اختر الإجابة الصحيحة.",choices:["Je me lève à sept heures.","Je se lève à sept heures.","Je lève me à sept heures."],correctIndex:0,feedback:"مع je يكون الضمير المنعكس me قبل الفعل."},
 {context:"Vous dites que vous ne regardez la télévision à aucun moment.",prompt:"اختر الجملة الصحيحة.",choices:["Je ne regarde jamais la télévision.","Je jamais ne regarde la télévision.","Je ne regarde pas jamais la télévision."],correctIndex:0,feedback:"مع jamais نضع ne قبل الفعل وjamais بعده."},
 {context:"Vous organisez trois actions dans l’ordre.",prompt:"اختر مجموعة الروابط المناسبة.",choices:["D’abord, puis, enfin","Souvent, jamais, très","Parce que, mais, avec"],correctIndex:0,feedback:"D’abord وpuis وenfin ترتب أحداث اليوم."}
];

const A1_SITUATIONS_READING={
 title:"Une invitation entre amis",
 arTitle:"دعوة بين صديقين",
 text:"Lina écrit à Rami : « Salut ! Ça te dit d’aller au cinéma samedi soir ? Le film commence à dix-neuf heures. » Rami répond : « Désolé, je ne peux pas samedi parce que je travaille. On peut plutôt y aller dimanche après-midi ? » Lina accepte : « Bonne idée ! On se retrouve devant le cinéma à quinze heures. »",
 translation:"تكتب لينا إلى رامي: «مرحبًا! ما رأيك أن نذهب إلى السينما مساء السبت؟ يبدأ الفيلم الساعة السابعة». يجيب رامي: «آسف، لا أستطيع يوم السبت لأنني أعمل. هل يمكن أن نذهب بدلًا من ذلك بعد ظهر الأحد؟» فتوافق لينا: «فكرة جيدة! نلتقي أمام السينما الساعة الثالثة».",
 questions:[
  {question:"Quelle activité Lina propose-t-elle ?",answer:"Elle propose d’aller au cinéma.",ar:"تقترح الذهاب إلى السينما."},
  {question:"Pourquoi Rami refuse-t-il samedi ?",answer:"Il refuse parce qu’il travaille.",ar:"يعتذر لأنه يعمل."},
  {question:"Quand et où vont-ils se retrouver ?",answer:"Ils vont se retrouver dimanche à quinze heures devant le cinéma.",ar:"سيلتقيان يوم الأحد الساعة الثالثة أمام السينما."}
 ]
};

const A1_SITUATIONS_LISTENING={
 title:"Changer l’heure du rendez-vous",
 arTitle:"تغيير موعد اللقاء",
 text:"Salut Nour, je suis désolé, je vais arriver en retard. Notre bus est à la gare. On peut se retrouver au café à cinq heures au lieu de quatre heures ? Appelle-moi, s’il te plaît. À tout à l’heure !",
 questions:[
  {prompt:"Pourquoi la personne appelle-t-elle ?",choices:["Pour annuler un voyage","Pour changer l’heure","Pour choisir un film"],correctIndex:1},
  {prompt:"Où propose-t-elle de se retrouver ?",choices:["À la gare","Au cinéma","Au café"],correctIndex:2},
  {prompt:"Quelle est la nouvelle heure ?",choices:["Quatre heures","Cinq heures","Six heures"],correctIndex:1}
 ]
};

const A1_SITUATIONS_WRITING_MODEL="Salut Sami ! Ça te dit de prendre un café samedi à quatre heures ? — Désolé, je ne peux pas samedi parce que je travaille. On peut plutôt se voir dimanche ? — Avec plaisir ! On se retrouve devant le café à cinq heures.";

const A1_SITUATIONS_DICTATION=[
 {speech:"Tu veux sortir avec nous samedi ?",ar:"هل تريد الخروج معنا يوم السبت؟"},
 {speech:"Désolé, je ne peux pas venir ce soir.",ar:"آسف، لا أستطيع الحضور هذا المساء."},
 {speech:"On se retrouve devant le café à cinq heures.",ar:"نلتقي أمام المقهى الساعة الخامسة."}
];

const A1_SITUATIONS_BUILDERS=[
 {tokens:["samedi","sortir","Tu","veux","?"],answer:["Tu","veux","sortir","samedi","?"],ar:"هل تريد الخروج يوم السبت؟"},
 {tokens:["venir","peux","ne","Je","pas","soir.","ce"],answer:["Je","ne","peux","pas","venir","ce","soir."],ar:"لا أستطيع الحضور هذا المساء."},
 {tokens:["retrouve","heures.","On","quatre","à","se"],answer:["On","se","retrouve","à","quatre","heures."],ar:"نلتقي الساعة الرابعة."}
];

const A1_SITUATIONS_DIALOGUES=[
 {context:"Un ami vous invite au restaurant et vous acceptez.",prompt:"اختر الإجابة الطبيعية.",choices:["Avec plaisir ! À quelle heure ?","Je ne restaurant jamais.","Parce que je suis heure."],correctIndex:0,feedback:"Avec plaisir تقبل الدعوة، ثم يمكن السؤال عن الوقت."},
 {context:"Vous ne pouvez pas venir samedi.",prompt:"اختر الاعتذار مع اقتراح بديل.",choices:["Désolé, je ne peux pas samedi. Et dimanche ?","Non, jamais, au revoir.","Je suis samedi mais dimanche."],correctIndex:0,feedback:"الاعتذار القصير مع موعد بديل يحافظ على حوار طبيعي."},
 {context:"Votre ami dit : « À mon avis, ce film est drôle. »",prompt:"اختر رد الموافقة.",choices:["Je suis d’accord avec toi.","Je vais à huit heures.","Je ne peux pas le mardi."],correctIndex:0,feedback:"Je suis d’accord تُستخدم للتعبير عن الموافقة."}
];

const A1_MESSAGES_FORMS_READING={
 title:"Une inscription à la médiathèque",
 arTitle:"التسجيل في المكتبة العامة",
 text:"Formulaire d’inscription — Prénom : Nora. Nom de famille : Alami. Date de naissance : 15 mars 2000. Nationalité : saoudienne. Adresse : 20, rue Victor-Hugo, 69002 Lyon. Téléphone : 06 24 18 35 70. Adresse électronique : nora@example.com. La médiathèque est ouverte du mardi au samedi, de neuf heures à dix-huit heures.",
 translation:"نموذج تسجيل — الاسم الأول: نورة. اسم العائلة: العلمي. تاريخ الميلاد: 15 مارس 2000. الجنسية: سعودية. العنوان: 20 شارع فيكتور هوغو، 69002 ليون. الهاتف: 06 24 18 35 70. البريد الإلكتروني: nora@example.com. تفتح المكتبة العامة من الثلاثاء إلى السبت، من التاسعة صباحًا حتى السادسة مساءً.",
 questions:[
  {question:"Quel est le nom de famille de Nora ?",answer:"Son nom de famille est Alami.",ar:"اسم عائلتها العلمي."},
  {question:"Quelle est son adresse ?",answer:"Elle habite au 20, rue Victor-Hugo, à Lyon.",ar:"تسكن في 20 شارع فيكتور هوغو بمدينة ليون."},
  {question:"Quels jours la médiathèque est-elle ouverte ?",answer:"Elle est ouverte du mardi au samedi.",ar:"تفتح من الثلاثاء إلى السبت."}
 ]
};

const A1_MESSAGES_FORMS_LISTENING={
 title:"Un message vocal",
 arTitle:"رسالة صوتية",
 text:"Bonjour Sami, je vous appelle pour confirmer votre rendez-vous de demain à dix heures. Le cabinet se trouve au 8, avenue de la Gare. Si vous êtes en retard, appelez le 04 70 22 15 10. Merci et à demain.",
 questions:[
  {prompt:"Pourquoi la personne appelle-t-elle ?",choices:["Pour annuler une réservation","Pour confirmer un rendez-vous","Pour demander une adresse"],correctIndex:1},
  {prompt:"À quelle heure est le rendez-vous ?",choices:["À huit heures","À neuf heures","À dix heures"],correctIndex:2},
  {prompt:"Où se trouve le cabinet ?",choices:["8, avenue de la Gare","20, rue Victor-Hugo","4, place du Marché"],correctIndex:0}
 ]
};

const A1_MESSAGES_FORMS_WRITING_MODEL="Bonjour Madame, je vous écris pour confirmer mon rendez-vous du mardi 12 mai à dix heures. Je vais arriver au cabinet à neuf heures cinquante. Pouvez-vous me répondre par courriel pour confirmer l’adresse, s’il vous plaît ? Merci. Cordialement, Sami Alami.";

const A1_MESSAGES_FORMS_DICTATION=[
 {speech:"Mon nom de famille est Alami.",ar:"اسم عائلتي العلمي."},
 {speech:"Je confirme notre rendez-vous de demain à dix heures.",ar:"أؤكد موعدنا غدًا الساعة العاشرة."},
 {speech:"La bibliothèque est fermée le lundi.",ar:"المكتبة مغلقة يوم الاثنين."}
];

const A1_MESSAGES_FORMS_BUILDERS=[
 {tokens:["famille","Mon","Alami.","nom","est","de"],answer:["Mon","nom","de","famille","est","Alami."],ar:"اسم عائلتي العلمي."},
 {tokens:["rendez-vous","Je","demain.","confirme","notre","de"],answer:["Je","confirme","notre","rendez-vous","de","demain."],ar:"أؤكد موعدنا غدًا."},
 {tokens:["lundi.","musée","fermé","Le","est","le"],answer:["Le","musée","est","fermé","le","lundi."],ar:"المتحف مغلق يوم الاثنين."}
];

const A1_MESSAGES_FORMS_DIALOGUES=[
 {context:"Un formulaire demande « prénom » puis « nom de famille ».",prompt:"ما الذي تكتبه في خانة prénom؟",choices:["Votre prénom personnel","Votre nom de famille","Votre adresse complète"],correctIndex:0,feedback:"prénom هو الاسم الأول، وnom de famille هو اسم العائلة."},
 {context:"Vous écrivez pour confirmer une rencontre.",prompt:"اختر الرسالة الواضحة.",choices:["Bonjour, je confirme notre rendez-vous de demain à dix heures.","Rendez-vous bonjour peut-être.","Je suis dix heures adresse."],correctIndex:0,feedback:"الرسالة الواضحة تجمع التحية وسبب الرسالة والموعد."},
 {context:"Une affiche indique : « Ascenseur en panne ».",prompt:"ما معنى المعلومة؟",choices:["L’ascenseur est gratuit.","L’ascenseur ne fonctionne pas.","L’ascenseur est ouvert."],correctIndex:1,feedback:"en panne تعني أن الجهاز معطل ولا يعمل."}
];

const A1_ENHANCED_CONTENT={
 alphabet:{
  reading:A1_ALPHABET_READING,listening:A1_ALPHABET_LISTENING,dictation:A1_ALPHABET_DICTATION,builders:A1_ALPHABET_BUILDERS,dialogues:A1_ALPHABET_DIALOGUES,
  writingModel:A1_ALPHABET_WRITING_MODEL,writingTitle:"اكتب",writingInstructions:"اكتب الكلمات الآتية بالفرنسية: ami، bateau، café، dimanche، école، famille، garçon، hôtel.",writingPlaceholder:"اكتب الكلمات الثماني هنا…",writingMinimum:8,writingMaximum:8,
  speakingPrompt:"Prononcez les lettres A, B, C et D, puis dites : A comme ami, B comme bateau.",speakingDuration:"تحدث لمدة 15 إلى 30 ثانية",speakingTips:["انطق كل حرف بوضوح.","توقف قليلًا بين الحرف والكلمة.","أعد المحاولة وقارن نطقك بالنموذج."],dictationUnit:"word"
 },
 sounds:{
  reading:A1_SOUNDS_READING,listening:A1_SOUNDS_LISTENING,dictation:A1_SOUNDS_DICTATION,builders:A1_SOUNDS_BUILDERS,dialogues:A1_SOUNDS_DIALOGUES,
  writingModel:A1_SOUNDS_WRITING_MODEL,writingTitle:"اكتب كلمات تحتوي أصواتًا مختلفة",writingInstructions:"اكتب من 8 إلى 12 كلمة فرنسية بسيطة، وأدخل كلمات تحتوي على الأصوات ou وon وoi وin.",writingPlaceholder:"bonjour, rouge, voiture, pain…",writingMinimum:8,writingMaximum:12,
  speakingPrompt:"Prononcez lentement : bonjour, rouge, voiture, trois et pain. Répétez chaque mot deux fois.",speakingDuration:"تحدث لمدة 15 إلى 30 ثانية",speakingTips:["استمع إلى كل كلمة قبل نطقها.","ركّز على الصوت المشترك داخل الكلمة.","كرّر كل كلمة مرتين بسرعة هادئة."],dictationUnit:"word"
 },
 greetings:{
  reading:A1_GREETINGS_READING,listening:A1_GREETINGS_LISTENING,dictation:A1_GREETINGS_DICTATION,builders:A1_GREETINGS_BUILDERS,dialogues:A1_GREETINGS_DIALOGUES,
  writingModel:A1_GREETINGS_WRITING_MODEL,writingTitle:"اكتب تعريفًا قصيرًا بنفسك",writingInstructions:"اكتب من 15 إلى 25 كلمة: ابدأ بتحية، اذكر اسمك ومكان سكنك أو لغتك، ثم اختم بعبارة لطيفة.",writingPlaceholder:"Bonjour, je m’appelle…",writingMinimum:15,writingMaximum:25,
  speakingPrompt:"Bonjour, je m’appelle Sami. J’habite à Lyon et je parle arabe. Enchanté de vous rencontrer.",speakingDuration:"تحدث لمدة 20 إلى 30 ثانية",speakingTips:["ابدأ بتحية واضحة.","اذكر اسمك ومعلومة بسيطة عنك.","اختم بعبارة مهذبة."],dictationUnit:"sentence"
 },
 "countries-languages":{
  reading:A1_COUNTRIES_READING,listening:A1_COUNTRIES_LISTENING,dictation:A1_COUNTRIES_DICTATION,builders:A1_COUNTRIES_BUILDERS,dialogues:A1_COUNTRIES_DIALOGUES,
  writingModel:A1_COUNTRIES_WRITING_MODEL,writingTitle:"اكتب عن بلدك ولغتك",writingInstructions:"اكتب من 15 إلى 25 كلمة: اذكر بلدك وجنسيتك ومكان سكنك واللغة التي تتحدثها أو تتعلمها.",writingPlaceholder:"Je viens de… Je suis…",writingMinimum:15,writingMaximum:25,
  speakingPrompt:"Je viens d’Arabie saoudite. Je suis saoudien. J’habite à Riyad. Je parle arabe et j’apprends le français.",speakingDuration:"تحدث لمدة 20 إلى 30 ثانية",speakingTips:["استخدم venir de لذكر الأصل.","طابق الجنسية مع المتحدث.","اذكر اللغة بعد parler من دون أداة."],dictationUnit:"word"
 },
 "studies-professions":{
  reading:A1_STUDIES_READING,listening:A1_STUDIES_LISTENING,dictation:A1_STUDIES_DICTATION,builders:A1_STUDIES_BUILDERS,dialogues:A1_STUDIES_DIALOGUES,
  writingModel:A1_STUDIES_WRITING_MODEL,writingTitle:"اكتب عن دراستك أو مهنتك",writingInstructions:"اكتب من 15 إلى 25 كلمة: اذكر ما تدرسه أو مهنتك ومكان الدراسة أو العمل ووقت البداية.",writingPlaceholder:"Je suis… J’étudie…",writingMinimum:15,writingMaximum:25,
  speakingPrompt:"Je suis étudiant à l’université. J’étudie le français. Mon frère est médecin et travaille à l’hôpital.",speakingDuration:"تحدث لمدة 20 إلى 30 ثانية",speakingTips:["اذكر صفتك الدراسية أو مهنتك.","استخدم étudier أو travailler بصورة صحيحة.","أضف مكان الدراسة أو العمل."],dictationUnit:"word"
 },
 "tastes-preferences":{
  reading:A1_TASTES_READING,listening:A1_TASTES_LISTENING,dictation:A1_TASTES_DICTATION,builders:A1_TASTES_BUILDERS,dialogues:A1_TASTES_DIALOGUES,
  writingModel:A1_TASTES_WRITING_MODEL,writingTitle:"اكتب عن أذواقك وتفضيلاتك",writingInstructions:"اكتب من 20 إلى 30 كلمة: اذكر نشاطين تحبهما، شيئًا لا تحبه، وخيارًا تفضله مع سبب بسيط.",writingPlaceholder:"J’aime… Je préfère…",writingMinimum:20,writingMaximum:30,
  speakingPrompt:"J’aime lire et écouter de la musique. Je préfère le thé au café. Je n’aime pas courir parce que c’est fatigant.",speakingDuration:"تحدث لمدة 20 إلى 30 ثانية",speakingTips:["اذكر ما تحبه وما لا تحبه.","استعمل préférer للمقارنة بين خيارين.","أضف سببًا بسيطًا باستعمال parce que."],dictationUnit:"word"
 },
 nouns:{
  reading:A1_NOUNS_READING,listening:A1_NOUNS_LISTENING,dictation:A1_NOUNS_DICTATION,builders:A1_NOUNS_BUILDERS,dialogues:A1_NOUNS_DIALOGUES,
  writingModel:A1_NOUNS_WRITING_MODEL,writingTitle:"صِف أشياء مكان قريب منك",writingInstructions:"اكتب من 18 إلى 30 كلمة عن أشياء في غرفتك أو فصلك. استخدم un وune وdes، ثم استخدم اسمًا واحدًا على الأقل في صيغة الجمع.",writingPlaceholder:"Dans ma chambre, il y a…",writingMinimum:18,writingMaximum:30,
  speakingPrompt:"Dans ma chambre, il y a un lit, une table et des livres. Les livres sont sur la table.",speakingDuration:"تحدث لمدة 20 إلى 30 ثانية",speakingTips:["اذكر ثلاثة أشياء على الأقل.","استخدم أداة مناسبة قبل كل اسم.","أضف اسمًا واحدًا في صيغة الجمع."],dictationUnit:"sentence"
 },
 "core-verbs":{
  reading:A1_CORE_VERBS_READING,listening:A1_CORE_VERBS_LISTENING,dictation:A1_CORE_VERBS_DICTATION,builders:A1_CORE_VERBS_BUILDERS,dialogues:A1_CORE_VERBS_DIALOGUES,
  writingModel:A1_CORE_VERBS_WRITING_MODEL,writingTitle:"عرّف بنفسك وبأسرتك",writingInstructions:"اكتب من 20 إلى 35 كلمة عنك وعن شخص من أسرتك. استخدم ضميرين مختلفين على الأقل، وفعلَي être وavoir استعمالًا صحيحًا.",writingPlaceholder:"Je suis… et j’ai…",writingMinimum:20,writingMaximum:35,
  speakingPrompt:"Je suis étudiant et j’ai vingt-deux ans. Ma sœur est professeure. Nous sommes à Riyad et nous avons un cours de français.",speakingDuration:"تحدث لمدة 25 إلى 35 ثانية",speakingTips:["ابدأ بجملة مع je suis.","أضف العمر أو الملكية باستعمال avoir.","استخدم ضميرًا آخر مثل il أو elle أو nous."],dictationUnit:"sentence"
 },
 structures:{
  reading:A1_STRUCTURES_READING,listening:A1_STRUCTURES_LISTENING,dictation:A1_STRUCTURES_DICTATION,builders:A1_STRUCTURES_BUILDERS,dialogues:A1_STRUCTURES_DIALOGUES,
  writingModel:A1_STRUCTURES_WRITING_MODEL,writingTitle:"قدّم مكانًا وأشر إلى ما فيه",writingInstructions:"اكتب من 25 إلى 40 كلمة عن منزلك أو حيّك. استخدم C’est أو Ce sont، وجملة مع Il y a، وأداة إشارة واحدة على الأقل.",writingPlaceholder:"C’est mon quartier. Il y a…",writingMinimum:25,writingMaximum:40,
  speakingPrompt:"C’est mon quartier. Il y a un café et une bibliothèque. Cette rue est calme et ces bâtiments sont modernes.",speakingDuration:"تحدث لمدة 25 إلى 40 ثانية",speakingTips:["قدّم المكان باستعمال C’est.","اذكر ما يوجد فيه باستعمال Il y a.","أشر إلى شيء باستعمال ce أو cet أو cette أو ces."],dictationUnit:"sentence"
 },
 questions:{
  reading:A1_QUESTIONS_READING,listening:A1_QUESTIONS_LISTENING,dictation:A1_QUESTIONS_DICTATION,builders:A1_QUESTIONS_BUILDERS,dialogues:A1_QUESTIONS_DIALOGUES,
  writingModel:A1_QUESTIONS_WRITING_MODEL,writingTitle:"اكتب أسئلة تعارف قصيرة",writingInstructions:"اكتب من 25 إلى 40 كلمة تتضمن خمسة أسئلة مختلفة للتعارف. استخدم Est-ce que، وأداتين مختلفتين من comment وoù وquand وpourquoi، وصيغة quel المناسبة.",writingPlaceholder:"Bonjour ! Comment vous appelez-vous ?…",writingMinimum:25,writingMaximum:40,
  speakingPrompt:"Bonjour ! Comment vous appelez-vous ? Où habitez-vous ? Quelle langue parlez-vous ? Est-ce que vous aimez voyager ?",speakingDuration:"تحدث لمدة 25 إلى 40 ثانية",speakingTips:["استخدم نبرة السؤال بوضوح.","نوّع بين Est-ce que وأدوات الاستفهام.","اترك وقفة قصيرة بعد كل سؤال."],dictationUnit:"sentence"
 },
 present:{
  reading:A1_PRESENT_READING,listening:A1_PRESENT_LISTENING,dictation:A1_PRESENT_DICTATION,builders:A1_PRESENT_BUILDERS,dialogues:A1_PRESENT_DIALOGUES,
  writingModel:A1_PRESENT_WRITING_MODEL,writingTitle:"صِف روتينك في الحاضر",writingInstructions:"اكتب من 30 إلى 45 كلمة عن يومك المعتاد. استخدم خمسة أفعال في المضارع مع ضميرين مختلفين، وجملة منفية واحدة، ورابطًا مثل puis أو mais.",writingPlaceholder:"Le matin, je…",writingMinimum:30,writingMaximum:45,
  speakingPrompt:"Le matin, je commence le travail à huit heures. Je parle avec mes collègues. Je ne déjeune pas au bureau. Le soir, je rentre en métro.",speakingDuration:"تحدث لمدة 30 إلى 45 ثانية",speakingTips:["رتّب يومك من الصباح إلى المساء.","صرّف الفعل وفق ضمير الفاعل.","أضف جملة منفية باستعمال ne… pas."],dictationUnit:"sentence"
 },
 "modal-verbs":{
  reading:A1_MODAL_VERBS_READING,listening:A1_MODAL_VERBS_LISTENING,dictation:A1_MODAL_VERBS_DICTATION,builders:A1_MODAL_VERBS_BUILDERS,dialogues:A1_MODAL_VERBS_DIALOGUES,
  writingModel:A1_MODAL_VERBS_WRITING_MODEL,writingTitle:"اكتب خطة تعلم قصيرة",writingInstructions:"اكتب من 30 إلى 45 كلمة عن هدف تريد تحقيقه. استخدم pouvoir وvouloir، ثم عبّر عن واجب شخصي بـ devoir أو ضرورة عامة بـ il faut.",writingPlaceholder:"Je veux… Je peux…",writingMinimum:30,writingMaximum:45,
  speakingPrompt:"Je veux apprendre le français. Je peux étudier chaque soir. Je dois écouter des phrases simples et il faut pratiquer régulièrement.",speakingDuration:"تحدث لمدة 30 إلى 45 ثانية",speakingTips:["اذكر ما تريد فعله باستعمال vouloir.","وضّح ما تستطيع فعله باستعمال pouvoir.","اختم بواجب أو ضرورة باستعمال devoir أو il faut."],dictationUnit:"sentence"
 },
 "future-imperative":{
  reading:A1_FUTURE_IMPERATIVE_READING,listening:A1_FUTURE_IMPERATIVE_LISTENING,dictation:A1_FUTURE_IMPERATIVE_DICTATION,builders:A1_FUTURE_IMPERATIVE_BUILDERS,dialogues:A1_FUTURE_IMPERATIVE_DIALOGUES,
  writingModel:A1_FUTURE_IMPERATIVE_WRITING_MODEL,writingTitle:"اكتب خطة وتعليمات قصيرة",writingInstructions:"اكتب من 30 إلى 45 كلمة عن نشاط قريب. استخدم جملتين في المستقبل القريب، ثم أضف أمرين أحدهما منفي.",writingPlaceholder:"Demain, nous allons…",writingMinimum:30,writingMaximum:45,
  speakingPrompt:"Demain, nous allons visiter Lyon. Nous allons partir tôt. Prenez vos billets, arrivez à huit heures et n’oubliez pas votre passeport !",speakingDuration:"تحدث لمدة 30 إلى 45 ثانية",speakingTips:["حدّد الوقت ثم اذكر الخطة بـ aller والمصدر.","أعطِ تعليمتين من دون ضمير فاعل.","اجعل إحدى التعليمات منفية بـ ne… pas."],dictationUnit:"sentence"
 },
 "food-shopping":{
  reading:A1_FOOD_SHOPPING_READING,listening:A1_FOOD_SHOPPING_LISTENING,dictation:A1_FOOD_SHOPPING_DICTATION,builders:A1_FOOD_SHOPPING_BUILDERS,dialogues:A1_FOOD_SHOPPING_DIALOGUES,
  writingModel:A1_FOOD_SHOPPING_WRITING_MODEL,writingTitle:"اكتب قائمة مشتريات وطلبًا قصيرًا",writingInstructions:"اكتب من 30 إلى 45 كلمة لشراء طعام. استخدم أداتَي تجزئة مختلفتين، وتعبير كمية، وطلبًا مهذبًا، وجملة منفية.",writingPlaceholder:"Pour le dîner, je voudrais…",writingMinimum:30,writingMaximum:45,
  speakingPrompt:"Bonjour, je voudrais du pain, de la soupe et un kilo de pommes, s’il vous plaît. Je ne prends pas de viande. Combien ça coûte ?",speakingDuration:"تحدث لمدة 30 إلى 45 ثانية",speakingTips:["ابدأ بطلب مهذب باستعمال Je voudrais.","اذكر المنتجات وكمياتها بوضوح.","اختم بالسؤال عن السعر أو طريقة الدفع."],dictationUnit:"sentence"
 },
 "city-directions":{
  reading:A1_CITY_DIRECTIONS_READING,listening:A1_CITY_DIRECTIONS_LISTENING,dictation:A1_CITY_DIRECTIONS_DICTATION,builders:A1_CITY_DIRECTIONS_BUILDERS,dialogues:A1_CITY_DIRECTIONS_DIALOGUES,
  writingModel:A1_CITY_DIRECTIONS_WRITING_MODEL,writingTitle:"اكتب مسارًا داخل المدينة",writingInstructions:"اكتب من 30 إلى 45 كلمة توضّح الطريق من مكان إلى آخر. اذكر نقطة الانطلاق والوجهة، وأعطِ تعليمتين، واستخدم تعبيرًا واحدًا لتحديد موقع المكان.",writingPlaceholder:"Je pars de… et je vais à…",writingMinimum:30,writingMaximum:45,
  speakingPrompt:"Excusez-moi, pour aller à la gare ? Allez tout droit jusqu’au feu, puis tournez à gauche. La gare est en face du parc.",speakingDuration:"تحدث لمدة 30 إلى 45 ثانية",speakingTips:["ابدأ بسؤال مهذب عن الطريق.","رتّب التعليمات خطوةً خطوة.","اختم بتحديد موقع الوجهة."],dictationUnit:"sentence"
 },
 "numbers-time":{
  reading:A1_NUMBERS_TIME_READING,listening:A1_NUMBERS_TIME_LISTENING,dictation:A1_NUMBERS_TIME_DICTATION,builders:A1_NUMBERS_TIME_BUILDERS,dialogues:A1_NUMBERS_TIME_DIALOGUES,
  writingModel:A1_NUMBERS_TIME_WRITING_MODEL,writingTitle:"اكتب برنامج يوم بالمواعيد",writingInstructions:"اكتب من 30 إلى 45 كلمة عن برنامج يوم واحد. اذكر اليوم والتاريخ، وموعدين مختلفين على الأقل، وسعرًا أو رقم هاتف.",writingPlaceholder:"Lundi 8 avril, je…",writingMinimum:30,writingMaximum:45,
  speakingPrompt:"Lundi 8 avril, je commence à huit heures trente. Mon rendez-vous est à onze heures. À midi, j’achète un repas à douze euros.",speakingDuration:"تحدث لمدة 30 إلى 45 ثانية",speakingTips:["اذكر اليوم والتاريخ أولًا.","انطق كل موعد بوضوح وبسرعة هادئة.","أضف سعرًا أو رقم هاتف في النهاية."],dictationUnit:"sentence"
 },
 "weather-clothes":{
  reading:A1_WEATHER_CLOTHES_READING,listening:A1_WEATHER_CLOTHES_LISTENING,dictation:A1_WEATHER_CLOTHES_DICTATION,builders:A1_WEATHER_CLOTHES_BUILDERS,dialogues:A1_WEATHER_CLOTHES_DIALOGUES,
  writingModel:A1_WEATHER_CLOTHES_WRITING_MODEL,writingTitle:"صِف الطقس وملابسك المناسبة",writingInstructions:"اكتب من 30 إلى 45 كلمة عن طقس يوم في فصل تختاره. اذكر حالة الطقس والحرارة، ثم اذكر ثلاث قطع ملابس أو أشياء مناسبة للجو.",writingPlaceholder:"En hiver, il fait…",writingMinimum:30,writingMaximum:45,
  speakingPrompt:"Aujourd’hui, il fait froid et il y a du vent. Il fait neuf degrés. Je porte un pantalon, un pull chaud et une veste. Je prends aussi mon parapluie.",speakingDuration:"تحدث لمدة 30 إلى 45 ثانية",speakingTips:["ابدأ بوصف الطقس ودرجة الحرارة.","اذكر الفصل إذا كان ذلك مناسبًا.","اربط الملابس بحالة الجو."],dictationUnit:"sentence"
 },
 "home-housing":{
  reading:A1_HOME_HOUSING_READING,listening:A1_HOME_HOUSING_LISTENING,dictation:A1_HOME_HOUSING_DICTATION,builders:A1_HOME_HOUSING_BUILDERS,dialogues:A1_HOME_HOUSING_DIALOGUES,
  writingModel:A1_HOME_HOUSING_WRITING_MODEL,writingTitle:"صِف مسكنك وموقع الأثاث",writingInstructions:"اكتب من 30 إلى 45 كلمة عن مسكن حقيقي أو متخيّل. اذكر نوع المسكن والعنوان، وغرفتين أو أكثر، وقطعتَي أثاث مع تحديد موقعهما.",writingPlaceholder:"J’habite dans…",writingMinimum:30,writingMaximum:45,
  speakingPrompt:"J’habite dans un appartement à Nantes. Il y a un salon, une chambre et une cuisine. Le canapé est devant la fenêtre et la table est à côté de la porte.",speakingDuration:"تحدث لمدة 30 إلى 45 ثانية",speakingTips:["ابدأ بنوع المسكن والمدينة.","اذكر الغرف باستعمال Il y a.","حدّد موقع قطعتين من الأثاث."],dictationUnit:"sentence"
 },
 description:{
  reading:A1_DESCRIPTION_READING,listening:A1_DESCRIPTION_LISTENING,dictation:A1_DESCRIPTION_DICTATION,builders:A1_DESCRIPTION_BUILDERS,dialogues:A1_DESCRIPTION_DIALOGUES,
  writingModel:A1_DESCRIPTION_WRITING_MODEL,writingTitle:"صِف أفرادًا من عائلتك وحالاتهم",writingInstructions:"اكتب من 30 إلى 45 كلمة عن ثلاثة أفراد من عائلتك. استخدم صفات ملكية، وحالة جسدية واحدة، وشعورين مختلفين على الأقل.",writingPlaceholder:"Dans ma famille, mon père…",writingMinimum:30,writingMaximum:45,
  speakingPrompt:"Dans ma famille, mon père est calme et ma mère est contente. Mon frère est fatigué aujourd’hui, mais ma sœur est heureuse. Mes grands-parents ont faim.",speakingDuration:"تحدث لمدة 30 إلى 45 ثانية",speakingTips:["قدّم كل شخص بصفة ملكية مناسبة.","فرّق بين être مع الصفة وavoir مع التعبير الثابت.","اذكر حالة جسدية وشعورًا بوضوح."],dictationUnit:"sentence"
 },
 "health-needs":{
  reading:A1_HEALTH_NEEDS_READING,listening:A1_HEALTH_NEEDS_LISTENING,dictation:A1_HEALTH_NEEDS_DICTATION,builders:A1_HEALTH_NEEDS_BUILDERS,dialogues:A1_HEALTH_NEEDS_DIALOGUES,
  writingModel:A1_HEALTH_NEEDS_WRITING_MODEL,writingTitle:"اكتب رسالة قصيرة لحجز موعد",writingInstructions:"اكتب من 30 إلى 45 كلمة إلى عيادة أو صيدلية. اذكر عرضًا صحيًا وموضع ألم والمدة، ثم اطلب موعدًا أو مساعدة بأدب.",writingPlaceholder:"Bonjour, je voudrais…",writingMinimum:30,writingMaximum:45,
  speakingPrompt:"Bonjour, je suis malade. J’ai de la fièvre et mal à la tête depuis hier. Je voudrais prendre rendez-vous avec un médecin, s’il vous plaît.",speakingDuration:"تحدث لمدة 30 إلى 45 ثانية",speakingTips:["ابدأ بالحالة أو العرض الرئيسي.","حدّد موضع الألم والمدة.","اختم بطلب موعد أو مساعدة بوضوح."],dictationUnit:"sentence"
 },
 adjectives:{
  reading:A1_ADJECTIVES_READING,listening:A1_ADJECTIVES_LISTENING,dictation:A1_ADJECTIVES_DICTATION,builders:A1_ADJECTIVES_BUILDERS,dialogues:A1_ADJECTIVES_DIALOGUES,
  writingModel:A1_ADJECTIVES_WRITING_MODEL,writingTitle:"صِف شخصين وصفًا واضحًا",writingInstructions:"اكتب من 35 إلى 50 كلمة تصف رجلًا وامرأة. اذكر المظهر والشعر، ثم استخدم صفتين للشخصية لكل شخص مع مراعاة المذكر والمؤنث.",writingPlaceholder:"Mon frère est… Ma sœur est…",writingMinimum:35,writingMaximum:50,
  speakingPrompt:"Mon ami est grand et sportif. Il a les cheveux courts. Il est calme et patient. Ma cousine est petite et sportive. Elle est sérieuse, gentille et sociable.",speakingDuration:"تحدث لمدة 35 إلى 50 ثانية",speakingTips:["ابدأ بالمظهر باستخدام être.","صف الشعر أو العينين باستخدام avoir.","غيّر نهاية الصفة عند الانتقال إلى المؤنث."],dictationUnit:"sentence"
 },
 "daily-life":{
  reading:A1_DAILY_LIFE_READING,listening:A1_DAILY_LIFE_LISTENING,dictation:A1_DAILY_LIFE_DICTATION,builders:A1_DAILY_LIFE_BUILDERS,dialogues:A1_DAILY_LIFE_DIALOGUES,
  writingModel:A1_DAILY_LIFE_WRITING_MODEL,writingTitle:"رتّب أحداث يومك المعتاد",writingInstructions:"اكتب من 35 إلى 50 كلمة عن يومك. استخدم ثلاثة أفعال ضميرية، وظرفَي تكرار، وثلاثة روابط زمنية، وجملة منفية واحدة.",writingPlaceholder:"En général, je me lève…",writingMinimum:35,writingMaximum:50,
  speakingPrompt:"En général, je me lève à sept heures. D’abord, je me prépare. Ensuite, je vais au travail. Le soir, je me repose, puis je lis. Je ne me couche jamais tard.",speakingDuration:"تحدث لمدة 35 إلى 50 ثانية",speakingTips:["استخدم الضمير المنعكس المناسب قبل الفعل.","أضف ظروفًا توضّح تكرار النشاط.","رتّب يومك بروابط زمنية واضحة."],dictationUnit:"sentence"
 },
 situations:{
  reading:A1_SITUATIONS_READING,listening:A1_SITUATIONS_LISTENING,dictation:A1_SITUATIONS_DICTATION,builders:A1_SITUATIONS_BUILDERS,dialogues:A1_SITUATIONS_DIALOGUES,
  writingModel:A1_SITUATIONS_WRITING_MODEL,writingTitle:"اكتب دعوة وردًا مناسبًا",writingInstructions:"اكتب حوارًا من 35 إلى 50 كلمة: وجّه دعوة مع اليوم والوقت، ثم اقبلها أو اعتذر مع سبب، واقترح بديلًا واتفق على مكان اللقاء.",writingPlaceholder:"Salut ! Ça te dit de…",writingMinimum:35,writingMaximum:50,
  speakingPrompt:"Salut ! Ça te dit de prendre un café samedi ? Désolé, je ne peux pas samedi parce que je travaille. On peut plutôt se voir dimanche ? Avec plaisir !",speakingDuration:"تحدث لمدة 35 إلى 50 ثانية",speakingTips:["اجعل الدعوة واضحة وحدد النشاط.","اقبل أو اعتذر بلطف مع سبب.","اقترح موعدًا بديلًا وحدد مكان اللقاء."],dictationUnit:"sentence"
 },
 "messages-forms":{
  reading:A1_MESSAGES_FORMS_READING,listening:A1_MESSAGES_FORMS_LISTENING,dictation:A1_MESSAGES_FORMS_DICTATION,builders:A1_MESSAGES_FORMS_BUILDERS,dialogues:A1_MESSAGES_FORMS_DIALOGUES,
  writingModel:A1_MESSAGES_FORMS_WRITING_MODEL,writingTitle:"اكتب رسالة عملية قصيرة",writingInstructions:"اكتب من 35 إلى 50 كلمة لتأكيد موعد أو الاعتذار عنه. ابدأ بتحية، واذكر سبب الرسالة واليوم والوقت والمكان، ثم اختم بعبارة مناسبة واسمك.",writingPlaceholder:"Bonjour, je vous écris pour…",writingMinimum:35,writingMaximum:50,
  speakingPrompt:"Bonjour, je vous appelle pour confirmer mon rendez-vous de demain à dix heures. Le cabinet se trouve au 8, avenue de la Gare. Merci et à demain.",speakingDuration:"تحدث لمدة 35 إلى 50 ثانية",speakingTips:["ابدأ بتحية واذكر سبب الاتصال.","انطق اليوم والوقت والعنوان بوضوح.","اختم بالشكر وعبارة وداع."],dictationUnit:"sentence"
 }
} as const;

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
 {speech:"D’abord, elle finit son travail, puis elle rentre chez elle.",ar:"أولًا، تنهي عملها، ثم تعود إلى منزلها."}
];

const A2_REVISION_BUILDERS=[
 {tokens:["semaine.","tôt","Je","pendant","lève","la","me"],answer:["Je","me","lève","tôt","pendant","la","semaine."],ar:"أستيقظ مبكرًا خلال أيام الأسبوع."},
 {tokens:["télévision","jamais","matin.","Elle","la","regarde","le","ne"],answer:["Elle","ne","regarde","jamais","la","télévision","le","matin."],ar:"لا تشاهد التلفاز صباحًا أبدًا."},
 {tokens:["puis","repas,","table.","D’abord,","mettons","nous","le","la","préparons","nous"],answer:["D’abord,","nous","préparons","le","repas,","puis","nous","mettons","la","table."],ar:"أولًا، نحضّر الطعام، ثم نرتب المائدة."}
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
 {fr:"D’abord, elle a téléphoné, puis elle a envoyé un courriel.",ar:"أولًا، اتصلت، ثم أرسلت بريدًا إلكترونيًا."},
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
 {speech:"D’abord, ils ont réservé, puis ils sont partis.",ar:"أولًا، أجروا الحجز، ثم غادروا."}
];

const A2_PASSE_COMPOSE_BUILDERS=[
 {tokens:["hier.","avons","Nous","musée","visité","le"],answer:["Nous","avons","visité","le","musée","hier."],ar:"زرنا المتحف أمس."},
 {tokens:["pas","train.","n’est","Elle","du","descendue"],answer:["Elle","n’est","pas","descendue","du","train."],ar:"لم تنزل من القطار."},
 {tokens:["puis","fenêtres,","maison.","D’abord,","sommes","avons","les","de","fermé","nous","sortis","nous","la"],answer:["D’abord,","nous","avons","fermé","les","fenêtres,","puis","nous","sommes","sortis","de","la","maison."],ar:"أولًا، أغلقنا النوافذ، ثم خرجنا من المنزل."}
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
 {fr:"Vous alliez souvent au travail à pied.",ar:"كنتم غالبًا تذهبون إلى العمل سيرًا على الأقدام."},
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
  translation:"عندما كنت طفلًا، كنت أعيش في حي هادئ قرب حديقة كبيرة. كانت المنازل صغيرة وكان جميع الجيران يعرف بعضهم بعضًا. كنت أمشي كل صباح إلى المدرسة مع أختي. وبعد الدروس، كنا غالبًا نلعب تحت الأشجار بينما كان والدانا يتحدثان أمام المخبز. وفي أحد الأيام وصلت عائلة جديدة إلى شارعنا. كان ابنهم في عمري، وسرعان ما أصبحنا صديقين.",
 questions:[
  {question:"Comment était le quartier ?",answer:"Il était calme et se trouvait près d’un grand parc.",ar:"كان هادئًا ويقع قرب حديقة كبيرة."},
  {question:"Que faisaient les enfants après les cours ?",answer:"Ils jouaient souvent sous les arbres.",ar:"كانوا غالبًا يلعبون تحت الأشجار."},
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
 {speech:"Quand j’étais enfant, je jouais souvent dehors.",ar:"عندما كنت طفلًا، كنت غالبًا ألعب في الخارج."},
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
 {fr:"D’abord, nous allons réserver les billets, puis nous choisirons l’hôtel.",ar:"أولًا، سنحجز التذاكر، ثم سنختار الفندق."},
 {fr:"À mon avis, les transports seront plus rapides dans quelques années.",ar:"في رأيي، ستكون وسائل النقل أسرع بعد بضع سنوات."}
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
  translation:"ستقضي سلمى وأخوها أربعة أيام في ستراسبورغ الشهر المقبل. سيغادران صباح الجمعة ويستقلان قطار الساعة السابعة. وعند وصولهما سيضعان حقائبهما في الفندق، ثم سيزوران وسط المدينة التاريخي. وإذا كان الطقس جميلًا، فسيذهبان في جولة بالقارب. وفي مساء السبت سيتناولان العشاء لدى صديقة تسكن قرب الكاتدرائية. وترى سلمى أن هذه الرحلة القصيرة ستكون فرصة جيدة للتدرّب على الفرنسية.",
 questions:[
  {question:"Quand partiront-ils ?",answer:"Ils partiront vendredi matin.",ar:"سيغادران صباح الجمعة."},
  {question:"Que feront-ils s’il fait beau ?",answer:"Ils feront une promenade en bateau.",ar:"سيذهبان في جولة بالقارب."},
  {question:"Pourquoi Salma attend-elle ce séjour ?",answer:"Parce qu’elle pourra pratiquer son français.",ar:"لأنها ستتمكن من التدرّب على الفرنسية."}
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
 {fr:"Nous n’achetons pas de viande cette semaine.",ar:"لا نشتري لحمًا هذا الأسبوع."},
 {fr:"Tu veux des pommes ? Oui, j’en prends trois.",ar:"هل تريد تفاحًا؟ نعم، سآخذ ثلاثًا."},
 {fr:"Elle parle souvent de son voyage : elle en garde un excellent souvenir.",ar:"تتحدث كثيرًا عن رحلتها، ولا تزال تحتفظ بذكرى رائعة عنها."},
 {fr:"Nous allons au marché et nous y retrouvons nos voisins.",ar:"نذهب إلى السوق ونلتقي بجيراننا هناك."},
 {fr:"Vous pensez à votre rendez-vous ? Oui, j’y pense.",ar:"هل تفكرون في موعدكم؟ نعم، أفكر فيه."},
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
  {speech:"Vous allez au marché ? Oui, nous y allons.",ar:"هل أنتم ذاهبون إلى السوق؟ نعم، نحن ذاهبون إليه."}
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
 {fr:"Nous avons plus de temps qu’hier.",ar:"لدينا وقت أكثر مما كان لدينا أمس."},
 {fr:"Elle travaille aussi efficacement que sa collègue.",ar:"تعمل بالكفاءة نفسها التي تعمل بها زميلتها."},
 {fr:"Cette solution fonctionne mieux que l’ancienne.",ar:"هذا الحل يعمل بصورة أفضل من الحل السابق."},
 {fr:"C’est le meilleur restaurant du quartier.",ar:"هذا أفضل مطعم في الحي."},
 {fr:"Parmi ces itinéraires, celui-ci est le moins long.",ar:"هذا المسار هو الأقصر بين هذه المسارات."},
 {fr:"Le service est assez rapide, mais la salle est un peu bruyante.",ar:"الخدمة سريعة إلى حدٍّ ما، لكن القاعة صاخبة قليلًا."},
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
 {fr:"D’abord, vérifiez l’adresse, puis envoyez le formulaire.",ar:"أولًا، تحققوا من العنوان، ثم أرسلوا الاستمارة."},
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
  title:"Une journée pleine d’imprévus",arTitle:"يوم مليء بالأحداث غير المتوقعة",
 text:"Hier, nous devions visiter un musée qui se trouve près de la gare. D’abord, notre train est arrivé en retard à cause d’un problème technique. Ensuite, nous avons pris un bus, mais nous sommes descendus au mauvais arrêt. Une passante nous a montré le chemin, donc nous avons enfin trouvé le musée. Il était presque midi ; pourtant, nous avons pu suivre la dernière visite guidée. Après la visite, nous avons déjeuné dans un restaurant que notre guide nous avait conseillé. Finalement, la journée a été fatigante, mais très réussie.",
 questions:[
  {prompt:"Pourquoi le train est-il arrivé en retard ?",choices:["À cause d’un problème technique","Grâce au guide","Parce que le musée était fermé"],correctIndex:0},
  {prompt:"Quelle erreur ont-ils faite ensuite ?",choices:["Ils ont perdu leurs billets.","Ils sont descendus au mauvais arrêt.","Ils ont oublié le musée."],correctIndex:1},
  {prompt:"Qui leur a montré le chemin ?",choices:["Le guide","Le conducteur","Une passante"],correctIndex:2},
  {prompt:"Comment la journée s’est-elle terminée ?",choices:["Elle a été fatigante, mais réussie.","Ils n’ont jamais trouvé le musée.","La visite a été annulée."],correctIndex:0}
 ]
};

const A2_CONNECTORS_WRITING_MODEL="Samedi, j’ai participé à une activité qui était organisée dans mon quartier. D’abord, nous avons nettoyé le parc, puis nous avons planté des fleurs. Le matériel que la mairie avait fourni était très utile. Il faisait chaud ; pourtant, tout le monde a continué avec enthousiasme. Comme nous étions nombreux, le travail a avancé rapidement. De plus, les voisins ont préparé un repas. Finalement, cette journée m’a plu parce qu’elle nous a permis de mieux nous connaître.";

const A2_CONNECTORS_DICTATION=[
 {speech:"Voici le document que vous devez compléter.",ar:"هذا هو المستند الذي يجب عليكم إكماله."},
 {speech:"Le bus était en retard, donc j’ai pris le métro.",ar:"كانت الحافلة متأخرة، لذلك استقللت المترو."},
 {speech:"D’abord, nous avons réservé, puis nous avons confirmé l’adresse.",ar:"أولًا، أجرينا الحجز، ثم أكدنا العنوان."}
];

const A2_CONNECTORS_BUILDERS=[
 {tokens:["parle.","qui","C’est","professeur","le"],answer:["C’est","le","professeur","qui","parle."],ar:"هذا هو المعلم الذي يتحدث."},
 {tokens:["annulée.","donc","pleut,","sortie","Il","la","est"],answer:["Il","pleut,","donc","la","sortie","est","annulée."],ar:"تمطر، ولذلك أُلغيت النزهة."},
 {tokens:["l’adresse.","D’abord,","puis","réservez,","confirmez"],answer:["D’abord,","réservez,","puis","confirmez","l’adresse."],ar:"أولًا، أجروا الحجز، ثم أكدوا العنوان."}
];

const A2_CONNECTORS_DIALOGUES=[
 {context:"On vous demande : « Pourquoi êtes-vous arrivé en retard ? »",prompt:"اختر جوابًا يوضح السبب.",choices:["Parce que mon train a été retardé.","Donc mon train arrive.","Pourtant je suis le train."],correctIndex:0,feedback:"parce que يجيب مباشرة عن سؤال السبب pourquoi."},
 {context:"Votre ami dit : « Cet hôtel est loin du centre. »",prompt:"أضف معلومة معارضة إيجابية.",choices:["C’est pourquoi il est loin.","Pourtant, il est très bien desservi.","D’abord, il est un hôtel."],correctIndex:1,feedback:"pourtant يربط البعد بميزة تخالف التوقع."},
 {context:"Vous expliquez comment envoyer un dossier.",prompt:"اختر تسلسلًا واضحًا.",choices:["Parce que, pourtant, qui.","Donc le dossier où.","D’abord, remplissez le formulaire ; ensuite, ajoutez les pièces ; enfin, envoyez le dossier."],correctIndex:2,feedback:"d’abord، ensuite، enfin ترتب الخطوات من البداية إلى النهاية."}
];

const A2_REAL_LIFE_PRACTICE_ITEMS:Example[]=[
 {fr:"J’ai mal à la gorge depuis trois jours.",ar:"أعاني من ألم في الحلق منذ ثلاثة أيام."},
 {fr:"Je voudrais prendre rendez-vous avec un médecin.",ar:"أود حجز موعد مع طبيب."},
 {fr:"Le chauffage de mon appartement ne fonctionne plus.",ar:"لم تعد التدفئة تعمل في شقتي."},
 {fr:"Pourriez-vous envoyer quelqu’un pour vérifier la fuite ?",ar:"هل يمكنكم إرسال شخص لفحص التسرّب؟"},
 {fr:"Mes horaires ont changé à partir de lundi.",ar:"تغيّرت ساعات عملي ابتداءً من يوم الاثنين."},
 {fr:"J’ai un entretien d’embauche jeudi à dix heures.",ar:"لدي مقابلة عمل يوم الخميس الساعة العاشرة."},
 {fr:"Je voudrais confirmer ma réservation pour deux nuits.",ar:"أود تأكيد حجزي لليلتين."},
 {fr:"J’ai raté mon train à cause du retard du bus.",ar:"فاتني القطار بسبب تأخر الحافلة."},
 {fr:"Ma valise n’est pas arrivée avec mon vol.",ar:"لم تصل حقيبتي مع رحلتي الجوية."},
 {fr:"Cet appareil ne fonctionne pas ; je voudrais l’échanger.",ar:"هذا الجهاز لا يعمل، وأود استبداله."}
];

const A2_REAL_LIFE_QUIZ_ITEMS:QuizQuestion[]=[
 {prompt:"Vous avez mal au dos depuis deux jours. Que dites-vous au médecin ?",speech:"Vous avez mal au dos depuis deux jours. Que dites-vous au médecin ?",instruction:"اختر العبارة التي تصف المشكلة والمدة.",choices:["J’ai mal au dos depuis deux jours.","J’aurai le dos dans deux jours.","Je suis le médecin du dos."],correctIndex:0,explanation:"J’ai mal à… يحدد موضع الألم، وdepuis يبين مدة حالة ما زالت مستمرة."},
 {prompt:"Le robinet fuit dans votre appartement. Quelle demande est adaptée ?",speech:"Le robinet fuit dans votre appartement. Quelle demande est adaptée ?",instruction:"اختر طلب الصيانة المناسب.",choices:["Le robinet travaille bien.","Pourriez-vous envoyer un plombier ?","Je voudrais acheter le voisin."],correctIndex:1,explanation:"الجملة تصف الحل المطلوب بأدب: إرسال سباك."},
 {prompt:"Votre responsable demande quand vous êtes disponible.",speech:"Votre responsable demande quand vous êtes disponible.",instruction:"اختر إجابة مهنية واضحة.",choices:["Je suis un horaire.","Hier sera possible.","Je suis disponible mardi après-midi."],correctIndex:2,explanation:"الإجابة تحدد يومًا وفترة زمنية واضحة دون معلومات غير ضرورية."},
 {prompt:"Vous voulez vérifier une réservation d’hôtel. Quelle information donnez-vous d’abord ?",speech:"Vous voulez vérifier une réservation d’hôtel. Quelle information donnez-vous d’abord ?",instruction:"اختر المعلومة الأكثر فائدة.",choices:["Le nom de réservation et les dates.","Votre couleur préférée.","Le prix d’un autre hôtel."],correctIndex:0,explanation:"الاسم والتواريخ يمكّنان الموظف من العثور على الحجز."},
 {prompt:"Votre train est annulé. Que demandez-vous ?",speech:"Votre train est annulé. Que demandez-vous ?",instruction:"اختر طلب الحل المناسب.",choices:["Pourquoi le train était bleu ?","Pourriez-vous me proposer un autre départ ?","Je veux une chambre d’hôpital."],correctIndex:1,explanation:"عند إلغاء الرحلة نطلب بديلًا محددًا ومهذبًا."},
 {prompt:"Votre bagage manque à l’aéroport. Quelle phrase est correcte ?",speech:"Votre bagage manque à l’aéroport. Quelle phrase est correcte ?",instruction:"اختر وصف المشكلة الصحيح.",choices:["Ma valise va dans le billet.","Je suis arrivé dans la valise.","Ma valise n’est pas arrivée avec le vol."],correctIndex:2,explanation:"الجملة تذكر بوضوح أن الحقيبة لم تصل مع الرحلة."},
 {prompt:"Un produit acheté hier ne fonctionne pas. Que devez-vous apporter ?",speech:"Un produit acheté hier ne fonctionne pas. Que devez-vous apporter ?",instruction:"اختر ما يساعد في طلب الاستبدال.",choices:["Le produit et le ticket de caisse.","Une ordonnance médicale.","Un billet de train."],correctIndex:0,explanation:"المنتج وإثبات الشراء هما المعلومتان المرتبطتان بعملية الإرجاع أو الاستبدال."},
 {prompt:"Vous écrivez pour signaler une panne. Quel ordre est le plus clair ?",speech:"Vous écrivez pour signaler une panne. Quel ordre est le plus clair ?",instruction:"اختر ترتيب الرسالة الوظيفي.",choices:["حل، تحية، مشكلة مجهولة","تحية، تعريف بالمكان، وصف المشكلة، طلب الحل","شكوى بلا عنوان أو طلب"],correctIndex:1,explanation:"هذا الترتيب يساعد المستلم على فهم المكان والمشكلة والإجراء المطلوب."},
 {prompt:"Le pharmacien demande : « Depuis quand avez-vous ces symptômes ? »",speech:"Depuis quand avez-vous ces symptômes ?",instruction:"اختر جوابًا يحدد بداية الحالة.",choices:["Pour demain matin.","À la pharmacie.","Depuis lundi soir."],correctIndex:2,explanation:"depuis lundi soir يحدد متى بدأت الأعراض التي لا تزال مستمرة."},
 {prompt:"Je suis disponible au 06 12 34 56 78 après dix-sept heures.",speech:"Je suis disponible par téléphone après dix-sept heures.",instruction:"ما وظيفة هذه العبارة في رسالة المشكلة؟",choices:["تحديد وسيلة ووقت التواصل","وصف سبب العطل","طلب استرداد تذكرة"],correctIndex:0,explanation:"تتيح العبارة للجهة المعنية معرفة متى وكيف يمكن التواصل مع المرسل."}
];

const A2_REAL_LIFE_READING={
 title:"Une panne dans l’appartement",arTitle:"عطل في الشقة",
 text:"Mardi matin, Adam remarque que le chauffage de son appartement ne fonctionne plus. Il vérifie les radiateurs, mais ils restent froids. Comme la température baisse, il écrit immédiatement à l’agence. Il indique son nom, son adresse et le numéro de l’appartement. Il explique que la panne a commencé pendant la nuit et précise qu’un enfant vit dans le logement. Il demande si un technicien pourrait venir dans la journée. L’agence répond une heure plus tard et confirme un passage entre quatorze et seize heures. Adam restera chez lui pour ouvrir la porte.",
 translation:"يلاحظ آدم صباح الثلاثاء أن التدفئة في شقته توقفت عن العمل. يفحص أجهزة التدفئة، لكنها تظل باردة. ولأن درجة الحرارة تنخفض، يكتب إلى الوكالة فورًا. يذكر اسمه وعنوانه ورقم الشقة، ويوضح أن العطل بدأ أثناء الليل وأن طفلًا يعيش في المسكن. ويسأل إن كان بإمكان فني الحضور خلال اليوم. ترد الوكالة بعد ساعة وتؤكد زيارة بين الثانية والرابعة بعد الظهر. وسيبقى آدم في المنزل لفتح الباب.",
 questions:[
  {question:"Quel problème Adam signale-t-il ?",answer:"Le chauffage de son appartement ne fonctionne plus.",ar:"توقفت التدفئة في شقته عن العمل."},
  {question:"Quelles informations donne-t-il à l’agence ?",answer:"Il donne son nom, son adresse, le numéro de l’appartement et le moment où la panne a commencé.",ar:"يذكر اسمه وعنوانه ورقم الشقة ووقت بدء العطل."},
  {question:"Quand le technicien doit-il passer ?",answer:"Il doit passer entre quatorze et seize heures.",ar:"سيحضر بين الثانية والرابعة بعد الظهر."}
 ]
};

const A2_REAL_LIFE_LISTENING={
 title:"Une valise qui n’est pas arrivée",arTitle:"حقيبة لم تصل",
 text:"Bonjour, je viens d’arriver par le vol trois cent vingt en provenance de Madrid, mais ma valise n’est pas sur le tapis. C’est une grande valise noire avec une étiquette rouge. Mon nom et mon numéro de téléphone sont écrits sur l’étiquette. Voici mon reçu de bagage. Je reste à l’hôtel Central jusqu’à vendredi. Pourriez-vous me contacter dès que vous aurez retrouvé la valise ? Je peux aussi venir la chercher à l’aéroport demain matin.",
 questions:[
  {prompt:"Quel est le numéro du vol ?",choices:["Trois cent vingt","Deux cent trente","Trois cent douze"],correctIndex:0},
  {prompt:"D’où vient le vol ?",choices:["De Rome","De Madrid","De Lyon"],correctIndex:1},
  {prompt:"Comment est la valise ?",choices:["Petite et rouge","Bleue avec une étiquette noire","Grande et noire avec une étiquette rouge"],correctIndex:2},
  {prompt:"Jusqu’à quand la personne reste-t-elle à l’hôtel ?",choices:["Jusqu’à vendredi","Jusqu’à demain soir","Jusqu’à lundi"],correctIndex:0}
 ]
};

const A2_REAL_LIFE_WRITING_MODEL="Bonjour, je vous écris au sujet de ma réservation numéro 4582 pour le 12 septembre. À mon arrivée, la chambre n’était pas prête et la climatisation ne fonctionnait pas. Comme il faisait très chaud, je n’ai pas pu y rester. Pourriez-vous me proposer une autre chambre aujourd’hui ou modifier ma réservation sans frais ? Je suis disponible par téléphone après quinze heures. Merci de me confirmer la solution dès que possible. Cordialement, Sami Alami.";

const A2_REAL_LIFE_DICTATION=[
 {speech:"J’ai mal à la gorge depuis trois jours.",ar:"أعاني من ألم في الحلق منذ ثلاثة أيام."},
 {speech:"Le chauffage ne fonctionne plus dans mon appartement.",ar:"لم تعد التدفئة تعمل في شقتي."},
 {speech:"Pourriez-vous me proposer un autre départ ?",ar:"هل يمكنكم اقتراح موعد مغادرة آخر؟"}
];

const A2_REAL_LIFE_BUILDERS=[
 {tokens:["jours.","dos","J’ai","depuis","au","deux","mal"],answer:["J’ai","mal","au","dos","depuis","deux","jours."],ar:"أعاني من ألم في الظهر منذ يومين."},
 {tokens:["fonctionne","chauffage","plus.","Le","ne"],answer:["Le","chauffage","ne","fonctionne","plus."],ar:"لم تعد التدفئة تعمل."},
 {tokens:["départ ?","autre","proposer","Pourriez-vous","un","me"],answer:["Pourriez-vous","me","proposer","un","autre","départ ?"],ar:"هل يمكنكم اقتراح موعد مغادرة آخر؟"}
];

const A2_REAL_LIFE_DIALOGUES=[
 {context:"Chez le médecin, on vous demande : « Qu’est-ce qui vous arrive ? »",prompt:"اختر وصفًا مفيدًا للحالة.",choices:["J’ai de la fièvre et je tousse depuis hier soir.","Je suis une ordonnance demain.","Le médecin est un billet."],correctIndex:0,feedback:"العبارة تحدد عرضين ووقت بدايتهما، وهي معلومات يحتاجها الطبيب."},
 {context:"Vous appelez l’agence pour une fuite d’eau.",prompt:"اختر شرحًا وطلبًا واضحين.",choices:["L’eau est intéressante.","Il y a une fuite sous l’évier. Pourriez-vous envoyer quelqu’un aujourd’hui ?","Je veux changer de train."],correctIndex:1,feedback:"الجملة تحدد مكان العطل والإجراء المطلوب والموعد."},
 {context:"À la gare, votre train est supprimé.",prompt:"اختر التفاعل الذي يقود إلى حل.",choices:["Je ne dis rien.","Le train était confortable.","Quel est le prochain départ, et puis-je utiliser le même billet ?"],correctIndex:2,feedback:"السؤالان يطلبان معلومات عملية عن البديل وصلاحية التذكرة."}
];

const A2_EXPRESSION_PRACTICE_ITEMS=[
 {fr:"À mon avis, ce quartier est agréable parce qu’il est calme.",ar:"في رأيي، السكن في هذا الحي مريح لأنه هادئ."},
 {fr:"Je suis tout à fait d’accord avec cette proposition.",ar:"أنا موافق تمامًا على هذا الاقتراح."},
 {fr:"Je comprends votre point de vue, mais je préfère une autre solution.",ar:"أتفهم وجهة نظركم، لكنني أفضل حلًا آخر."},
 {fr:"D’abord, je vais présenter le problème, puis je proposerai une solution.",ar:"أولًا، سأعرض المشكلة، ثم سأقترح حلًا."},
 {fr:"Par exemple, nous pourrions prolonger les horaires le samedi.",ar:"يمكننا مثلًا تمديد ساعات العمل يوم السبت."},
 {fr:"En résumé, cette activité est utile et facile à organiser.",ar:"خلاصة القول: هذا النشاط مفيد وسهل التنظيم."},
 {fr:"Je vous écris pour demander des informations sur la formation.",ar:"أكتب إليكم للاستفسار عن الدورة التدريبية."},
 {fr:"L’année dernière, j’ai participé à un projet qui m’a beaucoup plu.",ar:"شاركت العام الماضي في مشروع أعجبني كثيرًا."},
 {fr:"Le mois prochain, je vais commencer un nouveau cours.",ar:"سأبدأ دورة جديدة الشهر المقبل."},
 {fr:"Excusez-moi, pourriez-vous reformuler la dernière question ?",ar:"عذرًا، هل يمكنكم إعادة صياغة السؤال الأخير؟"}
];

const A2_EXPRESSION_QUIZ_ITEMS:QuizQuestion[]=[
 {prompt:"… , cette idée est intéressante.",speech:"À mon avis, cette idée est intéressante.",instruction:"اختر العبارة التي تبدأ رأيًا شخصيًا بصورة طبيعية.",choices:["À mon avis","À cause de","Tout à coup"],correctIndex:0,explanation:"À mon avis تعني «في رأيي» وتقدّم وجهة نظر شخصية."},
 {prompt:"Je préfère le train … il est plus confortable.",speech:"Je préfère le train parce qu’il est plus confortable.",instruction:"اختر الرابط الذي يعلل الرأي.",choices:["pourtant","parce qu’","ensuite"],correctIndex:1,explanation:"parce que يقدّم سببًا، وتصبح قبل il: parce qu’il."},
 {prompt:"Je comprends votre idée, … je ne suis pas tout à fait d’accord.",speech:"Je comprends votre idée, mais je ne suis pas tout à fait d’accord.",instruction:"أكمل الاختلاف المهذب بالرابط المناسب.",choices:["donc","mais","d’abord"],correctIndex:1,explanation:"mais يربط بين تفهم الرأي ثم مخالفته بأدب."},
 {prompt:"… je présente le sujet ; ensuite, je donne un exemple.",speech:"D’abord, je présente le sujet ; ensuite, je donne un exemple.",instruction:"اختر رابط بداية الترتيب.",choices:["D’abord,","Enfin,","Parce que"],correctIndex:0,explanation:"D’abord يفتتح الخطوة الأولى، ثم تأتي ensuite للخطوة التالية."},
 {prompt:"Quel connecteur introduit un exemple ?",speech:"Par exemple, on peut organiser une réunion le samedi.",instruction:"اختر الرابط الذي يقدّم مثالًا.",choices:["Par exemple","En résumé","Cependant"],correctIndex:0,explanation:"Par exemple تعني «على سبيل المثال» وتوضّح الفكرة بمثال."},
 {prompt:"Je vous écris … demander des renseignements.",speech:"Je vous écris pour demander des renseignements.",instruction:"أكمل سبب كتابة الرسالة.",choices:["pour","mais","depuis"],correctIndex:0,explanation:"pour + مصدر يعبّر عن الغرض: أكتب إليكم من أجل طلب معلومات."},
 {prompt:"L’an dernier, j’ai suivi une formation qui m’a beaucoup aidé.",instruction:"ماذا تفعل هذه الجملة؟",choices:["تحكي تجربة سابقة","تطلب توضيحًا","تعلن موعدًا مستقبليًا"],correctIndex:0,explanation:"المؤشر L’an dernier والماضي المركب يقدّمان تجربة انتهت في الماضي."},
 {prompt:"Le mois prochain, je vais participer à un nouveau projet.",instruction:"ماذا تعبّر الجملة؟",choices:["عن عادة قديمة","عن مشروع قادم","عن اختلاف في الرأي"],correctIndex:1,explanation:"المستقبل القريب مع Le mois prochain يقدّم خطة قادمة."},
 {prompt:"Vous n’avez pas compris un mot. Que dites-vous ?",speech:"Excusez-moi, qu’est-ce que ce mot veut dire ?",instruction:"اختر طلب التوضيح المناسب.",choices:["Je suis tout à fait d’accord.","Qu’est-ce que ce mot veut dire ?","Pour conclure, merci."],correctIndex:1,explanation:"هذا السؤال يطلب معنى الكلمة مباشرة وبأدب."},
 {prompt:"Pour conclure, cette solution répond à nos besoins.",instruction:"ما وظيفة Pour conclure؟",choices:["عرض السبب","إنهاء الكلام بخلاصة","تصحيح سوء فهم"],correctIndex:1,explanation:"Pour conclure يعلن الخاتمة ويلخّص الموقف النهائي."}
];

const A2_EXPRESSION_READING={
 title:"Un avis sur un nouvel espace",arTitle:"رأي في مساحة جديدة",
 text:"La mairie veut transformer une ancienne salle en espace de travail partagé. Lina répond à l’enquête du quartier. À son avis, ce projet est utile parce que beaucoup d’habitants travaillent chez eux. Elle propose, par exemple, d’installer de grandes tables et une connexion internet rapide. Elle comprend que certains voisins préfèrent une salle de sport, mais elle pense que les deux activités peuvent partager le même bâtiment. Pour conclure, Lina soutient le projet si l’espace reste ouvert le soir et le samedi.",
 translation:"تريد البلدية تحويل قاعة قديمة إلى مساحة عمل مشتركة. تجيب لينا عن استطلاع الحي. وترى أن المشروع مفيد لأن كثيرًا من السكان يعملون من منازلهم. وتقترح مثلًا توفير طاولات كبيرة واتصال سريع بالإنترنت. وهي تتفهم أن بعض الجيران يفضلون قاعة رياضية، لكنها ترى أن النشاطين يمكن أن يتقاسما المبنى نفسه. وفي الختام، تؤيد لينا المشروع بشرط أن تظل المساحة مفتوحة مساءً ويوم السبت.",
 questions:[
  {question:"Pourquoi Lina trouve-t-elle le projet utile ?",answer:"Parce que beaucoup d’habitants travaillent chez eux.",ar:"لأن كثيرًا من السكان يعملون من منازلهم."},
  {question:"Quels équipements propose-t-elle ?",answer:"Elle propose de grandes tables et une connexion internet rapide.",ar:"تقترح طاولات كبيرة واتصالًا سريعًا بالإنترنت."},
  {question:"À quelle condition soutient-elle le projet ?",answer:"Elle le soutient si l’espace reste ouvert le soir et le samedi.",ar:"تؤيده إذا ظلت المساحة مفتوحة مساءً ويوم السبت."}
 ]
};

const A2_EXPRESSION_LISTENING={
 title:"Une expérience et un nouveau projet",arTitle:"تجربة ومشروع جديد",
 text:"L’année dernière, j’ai suivi un atelier de photographie dans mon quartier. Au début, je trouvais les exercices difficiles, mais le professeur expliquait chaque étape avec patience. Ensuite, j’ai commencé à prendre de meilleures photos et j’ai présenté mon travail à une petite exposition. Cette expérience m’a donné confiance. Le mois prochain, je vais rejoindre un groupe qui prépare un reportage sur notre ville. À mon avis, ce projet sera une excellente occasion de progresser et de rencontrer d’autres passionnés.",
 questions:[
  {prompt:"Quel atelier la personne a-t-elle suivi ?",choices:["Un atelier de théâtre","Un atelier de photographie","Un atelier de cuisine"],correctIndex:1},
  {prompt:"Comment trouvait-elle les exercices au début ?",choices:["Faciles","Inutiles","Difficiles"],correctIndex:2},
  {prompt:"Qu’a-t-elle présenté à une exposition ?",choices:["Son travail","Un livre","Un projet sportif"],correctIndex:0},
  {prompt:"Quel projet va-t-elle rejoindre ?",choices:["Un reportage sur la ville","Un voyage à la campagne","Une nouvelle formation en ligne"],correctIndex:0}
 ]
};

const A2_EXPRESSION_WRITING_MODEL="Bonjour Madame, je vous écris pour donner mon avis sur les nouveaux horaires de la bibliothèque. À mon avis, l’ouverture le samedi est très utile parce que beaucoup d’étudiants travaillent en semaine. Je comprends que cela demande plus de personnel ; pourtant, on pourrait ouvrir seulement le matin. Par exemple, un horaire de neuf à treize heures serait suffisant. Pour conclure, je suis favorable à ce changement. Pourriez-vous me dire quand la décision sera annoncée ? Cordialement, Lina Benali.";

const A2_EXPRESSION_DICTATION=[
 {speech:"À mon avis, cette solution est la plus pratique.",ar:"في رأيي، هذا الحل هو الأكثر ملاءمة."},
 {speech:"Je comprends votre idée, mais je ne suis pas tout à fait d’accord.",ar:"أتفهم فكرتكم، لكنني لا أوافقكم الرأي بالكامل."},
 {speech:"Pourriez-vous répéter la dernière question ?",ar:"هل يمكنكم إعادة السؤال الأخير؟"}
];

const A2_EXPRESSION_BUILDERS=[
 {tokens:["calme.","parce","quartier","J’aime","qu’il","est","ce"],answer:["J’aime","ce","quartier","parce","qu’il","est","calme."],ar:"أحب هذا الحي لأنه هادئ."},
 {tokens:["je","Ensuite,","un","donnerai","exemple."],answer:["Ensuite,","je","donnerai","un","exemple."],ar:"بعد ذلك، سأقدّم مثالًا."},
 {tokens:["reformuler","Pourriez-vous","question ?","cette"],answer:["Pourriez-vous","reformuler","cette","question ?"],ar:"هل يمكنكم إعادة صياغة هذا السؤال؟"}
];

const A2_EXPRESSION_DIALOGUES=[
 {context:"Un collègue vous demande : « Que pensez-vous du nouvel horaire ? »",prompt:"اختر رأيًا معللًا.",choices:["À mon avis, il est pratique parce que nous finissons plus tôt.","Demain était lundi.","Je ne comprends une chaise."],correctIndex:0,feedback:"الإجابة تعرض رأيًا واضحًا ثم تبرره بسبب مباشر."},
 {context:"Votre ami propose une solution qui ne vous convient pas.",prompt:"اختر اختلافًا مهذبًا.",choices:["C’est faux et inutile.","Je comprends ton idée, mais je préférerais une solution plus simple.","Par exemple, hier."],correctIndex:1,feedback:"تبدأ العبارة بتفهم الاقتراح ثم تعرض تفضيلًا بديلًا دون حدة."},
 {context:"Vous n’avez pas compris la dernière consigne.",prompt:"اختر العبارة التي تحافظ على الحوار.",choices:["Pour conclure, je pars.","Je suis contre la question.","Excusez-moi, pourriez-vous l’expliquer autrement ?"],correctIndex:2,feedback:"طلب إعادة الشرح بطريقة أخرى يصلح سوء الفهم ويتيح استمرار التفاعل."}
];

const A2_MODULES:CourseModule[]=[
 {
  id:"revision",title:"Consolider le présent",ar:"تثبيت الحاضر والتواصل",icon:RefreshCw,
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
    {fr:"D’abord, je consulte mes messages, puis je commence mon travail.",ar:"أولًا، أتفقّد رسائلي، ثم أبدأ عملي."},
    {fr:"Je préfère marcher parce que mon bureau est près de chez moi.",ar:"أفضل المشي لأن مكتبي قريب من منزلي."},
    {fr:"Le trajet est long, mais le quartier est très agréable.",ar:"الطريق طويل، لكن الحي لطيف جدًا."}
   ])
  ]
 },
 {
  id:"passe-compose",title:"Le passé composé",ar:"الماضي المركب",icon:History,
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
    {fr:"D’abord, nous avons acheté les billets, puis nous sommes entrés dans la salle.",ar:"أولًا، اشترينا التذاكر، ثم دخلنا القاعة."},
    {fr:"Le bus est arrivé en retard, alors j’ai appelé mon collègue.",ar:"وصلت الحافلة متأخرة، لذلك اتصلت بزميلي."},
    {fr:"J’ai passé une excellente journée parce que j’ai découvert plusieurs endroits.",ar:"قضيت يومًا رائعًا لأنني اكتشفت عدة أماكن."}
   ])
  ]
 },
 {
  id:"imparfait",title:"L’imparfait et le récit",ar:"الماضي الناقص والسرد",icon:ScrollText,
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
  id:"future",title:"Parler de l’avenir",ar:"التحدث عن المستقبل",icon:Telescope,
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
  id:"pronouns",title:"Pronoms compléments",ar:"ضمائر المفعول",icon:Replace,
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
    {fr:"Ne leur montrez pas ce document.",ar:"لا تعرضوا عليهم هذا المستند."},
    {fr:"Ces clés, rendez-les-lui aujourd’hui.",ar:"أعيدوا إليه هذه المفاتيح اليوم."}
   ])
  ]
 },
 {
  id:"quantity",title:"Quantités, y et en",ar:"الكميات والضميران y وen",icon:SlidersHorizontal,
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
    {fr:"Vous participez à la réunion ? Oui, j’y participe.",ar:"هل تشاركون في الاجتماع؟ نعم، أشارك فيه."},
    {fr:"Ils sont allés chez le médecin et ils y sont restés une heure.",ar:"ذهبوا إلى عيادة الطبيب وبقوا هناك ساعة."}
   ]),
   section("La place de y et en","موضع y وen","يأتي y وen قبل الفعل المصرف، وقبل المصدر الذي يتعلقان به. في الأمر المثبت يأتيان بعد الفعل، وفي النفي يعودان قبله.",[
    "الحاضر والمركب: J’y vais؛ J’en ai acheté؛ Nous y sommes restés.",
    "مع المصدر: Je vais y aller؛ Elle veut en parler.",
    "الأمر المثبت: Vas-y؛ Prenez-en؛ الأمر المنفي: N’y va pas؛ N’en prenez pas.",
    "عند اجتماعهما يأتي y قبل en: Il y en a؛ Je n’y en trouve plus."
   ],[
    {fr:"Nous allons y retourner la semaine prochaine.",ar:"سنعود إلى هناك الأسبوع المقبل."},
    {fr:"Achetez-en deux pour demain.",ar:"اشتروا اثنتين منها للغد."},
    {fr:"Dans ce magasin, il n’y en a plus.",ar:"لم يعد منه شيء في هذا المتجر."}
   ])
  ]
 },
 {
  id:"comparison",title:"Comparer et préciser",ar:"المقارنة والتحديد",icon:Scale,
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
    {fr:"Cette équipe a autant de clients que l’autre.",ar:"لدى هذا الفريق عدد من العملاء يساوي عدد عملاء الفريق الآخر."},
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
  id:"politeness",title:"Demander et conseiller",ar:"الطلب والنصيحة",icon:HandHeart,
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
    {fr:"Je ne peux pas mardi ; en revanche, je pourrais venir mercredi.",ar:"لا أستطيع الحضور يوم الثلاثاء؛ أما يوم الأربعاء فيمكنني الحضور."}
   ])
  ]
 },
 {
  id:"connectors",title:"Relier ses idées",ar:"ربط الأفكار",icon:Link2,
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
    {fr:"Le vol est retardé à cause du mauvais temps.",ar:"الرحلة متأخرة بسبب سوء الأحوال الجوية."},
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
    {fr:"D’abord, remplissez le formulaire, puis signez-le.",ar:"أولًا، عبّئوا الاستمارة، ثم وقّعوها."},
    {fr:"Pendant que je préparais le repas, Lina mettait la table.",ar:"بينما كنت أحضّر الطعام، كانت لينا ترتب المائدة."},
    {fr:"Finalement, nous avons trouvé une solution acceptable.",ar:"في النهاية توصلنا إلى حل مقبول."}
   ]),
   section("Ajouter, illustrer et conclure","الإضافة وتقديم المثال والخاتمة","أضف معلومة جديدة أو مثالًا يوضحها، ثم اختم دون إدخال فكرة جديدة. هكذا تتحول الجمل المنفصلة إلى فقرة منظمة.",[
    "الإضافة: aussi، de plus، en plus؛ وتجنب تكرار et كثيرًا.",
    "المثال: par exemple؛ والتوضيح: c’est-à-dire.",
    "التلخيص: en résumé؛ والخاتمة: finalement، pour conclure.",
    "فقرة A2 جيدة: فكرة، سبب أو مثال، نتيجة أو تعارض، ثم خاتمة قصيرة."
   ],[
    {fr:"Le quartier est calme ; de plus, les transports sont pratiques.",ar:"الحي هادئ، كما أن وسائل النقل فيه ملائمة."},
    {fr:"On peut pratiquer dehors, par exemple dans le parc.",ar:"يمكننا التمرن في الخارج، مثلًا في الحديقة."},
    {fr:"En résumé, cette activité est utile et facile à organiser.",ar:"باختصار، هذا النشاط مفيد وسهل التنظيم."}
   ])
  ]
 },
 {
  id:"themes",title:"Communiquer dans la vie réelle",ar:"التواصل في الحياة الواقعية",icon:Earth,
  description:"تعامل مع مواقف A2 اليومية: اشرح وضعك، قدّم التفاصيل اللازمة، افهم الرد، واطلب إجراءً واضحًا في الصحة والسكن والعمل والسفر والخدمات.",
  sections:[
   section("Santé et rendez-vous","الصحة وحجز الموعد","ابدأ بالعرض الأساسي، ثم حدّد مكانه ووقت بدايته وشدته. اطلب موعدًا أو نصيحة، وافهم التعليمات البسيطة دون محاولة تشخيص نفسك.",[
    "العرض: J’ai mal à…؛ J’ai de la fièvre؛ Je tousse؛ Je suis allergique à…",
    "المدة: depuis hier، depuis trois jours؛ البداية: depuis lundi soir.",
    "الموعد: Je voudrais prendre rendez-vous؛ Avez-vous une disponibilité aujourd’hui ?",
    "التعليمات: prenez…، reposez-vous، avant/après les repas، deux fois par jour."
   ],[
    {fr:"J’ai de la fièvre et je tousse depuis hier.",ar:"أعاني من الحمى والسعال منذ الأمس."},
    {fr:"Avez-vous un rendez-vous disponible cet après-midi ?",ar:"هل لديكم موعد متاح بعد ظهر اليوم؟"},
    {fr:"Prenez ce médicament après les repas.",ar:"تناولوا هذا الدواء بعد الوجبات."}
   ]),
   section("Logement et réparations","السكن والصيانة","عند الإبلاغ عن مشكلة في المسكن، اذكر العنوان أو رقم الشقة، ومكان العطل، ووقت ظهوره، وأثره، ثم اطلب موعدًا للتدخل.",[
    "الأعطال: une panne، une fuite، le chauffage، l’électricité، la serrure.",
    "المكان: sous l’évier، dans la salle de bains، près de la fenêtre.",
    "الزمن: depuis ce matin؛ la panne a commencé cette nuit.",
    "الطلب: Pourriez-vous envoyer un technicien ? Quand peut-il passer ?"
   ],[
    {fr:"Il y a une fuite d’eau sous l’évier.",ar:"يوجد تسرّب للماء تحت حوض المطبخ."},
    {fr:"La panne a commencé pendant la nuit.",ar:"بدأ العطل أثناء الليل."},
    {fr:"Je serai chez moi entre quatorze et dix-sept heures.",ar:"سأكون في المنزل بين الثانية والخامسة مساءً."}
   ]),
   section("Travail et démarches professionnelles","العمل والإجراءات المهنية","تبادل معلومات مباشرة عن المواعيد والمهام والخبرة. في الرسائل المهنية استخدم تحية وموضوعًا واضحًا وختامًا مناسبًا.",[
    "الوقت: horaires، disponibilité، temps plein/partiel، commencer à، finir à.",
    "العمل: contrat، poste، expérience، équipe، responsable، tâche.",
    "الموعد: Je confirme l’entretien de jeudi à dix heures.",
    "الخبرة البسيطة: J’ai travaillé…؛ Je sais utiliser…؛ Je peux commencer…"
   ],[
    {fr:"Je suis disponible du lundi au vendredi.",ar:"أنا متاح من الاثنين إلى الجمعة."},
    {fr:"Je vous confirme notre entretien de jeudi matin.",ar:"أؤكد لكم موعد مقابلتنا صباح الخميس."},
    {fr:"J’ai travaillé deux ans dans le service client.",ar:"عملت لمدة عامين في خدمة العملاء."}
   ]),
   section("Voyage et hébergement","السفر والإقامة","قبل الطلب اجمع المعلومات التي ستحتاجها الجهة: التاريخ والوجهة والاسم ورقم الحجز. ثم تأكد من السعر والوقت والشروط.",[
    "النقل: départ، arrivée، correspondance، quai، retard، billet aller-retour.",
    "الإقامة: réservation، chambre، deux nuits، petit-déjeuner compris، départ avant…",
    "التأكيد: Je voudrais confirmer…؛ La réservation est au nom de…",
    "الاستيضاح: À quelle heure… ? Où dois-je changer ? Le prix comprend-il… ?"
   ],[
    {fr:"La réservation est au nom de Salim Haddad.",ar:"الحجز باسم سليم حداد."},
    {fr:"Où dois-je changer de train ?",ar:"أين يجب أن أبدّل القطار؟"},
    {fr:"Le petit-déjeuner est-il compris dans le prix ?",ar:"هل الإفطار مشمول في السعر؟"}
   ]),
   section("Services, achats et réclamations","الخدمات والمشتريات والشكاوى","في المتجر أو البنك أو البريد، اذكر العملية المطلوبة والمبلغ أو المنتج. وعند وجود مشكلة صفها بهدوء واطلب حلًا محددًا.",[
    "الشراء: taille، modèle، prix، paiement، reçu، garantie.",
    "الخدمات: envoyer un colis، retirer de l’argent، ouvrir un compte، remplir un formulaire.",
    "المشكلة: ne fonctionne pas، abîmé، incorrect، je n’ai pas reçu…",
    "الحل: échanger، rembourser، corriger، renvoyer؛ مع ticket de caisse أو numéro de dossier."
   ],[
    {fr:"Je voudrais envoyer ce colis en courrier suivi.",ar:"أود إرسال هذا الطرد ببريد يمكن تتبعه."},
    {fr:"Cette veste est abîmée ; puis-je l’échanger ?",ar:"هذه السترة تالفة، هل يمكنني استبدالها؟"},
    {fr:"Voici le ticket de caisse et la garantie.",ar:"هذا إيصال الشراء وشهادة الضمان."}
   ]),
   section("Expliquer un imprévu et obtenir une solution","شرح موقف طارئ والحصول على حل","نظّم كلامك في أربع خطوات: عرّف بنفسك أو بملفك، اشرح ما حدث، بيّن حاجتك الحالية، ثم اطلب حلًا وتأكد من الخطوة التالية.",[
    "1. المرجع: رقم الرحلة أو الحجز أو الملف والاسم.",
    "2. الحدث: J’ai raté…؛ Ma valise n’est pas arrivée؛ le train a été supprimé.",
    "3. الحاجة: Je dois arriver avant…؛ Je reste à l’hôtel jusqu’à…",
    "4. الحل والمتابعة: Que dois-je faire ? Pourriez-vous me contacter ?"
   ],[
    {fr:"Mon vol a été annulé et je dois arriver ce soir.",ar:"أُلغيت رحلتي ويجب أن أصل هذا المساء."},
    {fr:"Voici mon reçu de bagage et mon numéro de vol.",ar:"هذا إيصال الأمتعة ورقم رحلتي."},
    {fr:"Pourriez-vous me prévenir dès que vous aurez une réponse ?",ar:"هل يمكنكم إبلاغي فور حصولكم على رد؟"}
   ])
  ]
 },
  {
   id:"expression",title:"S’exprimer avec autonomie",ar:"التعبير باستقلالية",icon:Speech,
   description:"عبّر عن رأيك بثقة، علّله، ناقش غيرك بأدب، ونظّم رسالة أو حديثًا واضحًا في مواقف A2.",
   sections:[
    section("Donner son opinion et la justifier","إبداء الرأي وتعليله","لا يكفي أن تقول ما تفضله؛ قدّم رأيًا مفهومًا، ثم سببًا ومثالًا قصيرًا يساعدان المستمع أو القارئ على متابعة فكرتك.",[
     "ابدأ بـ À mon avis, Pour moi, Je pense que أو Je trouve que.",
     "علّل رأيك بـ parce que أو car، ولا تكرر صيغة الرأي في كل جملة.",
     "وضّح الفكرة بمثال يبدأ بـ par exemple أو comme.",
     "البنية العملية: رأي ← سبب ← مثال."
    ],[
     {fr:"Je trouve ce service pratique parce qu’il est disponible le soir.",ar:"أرى أن هذه الخدمة مناسبة لأنها متاحة مساءً."},
     {fr:"Pour moi, apprendre en groupe est plus motivant.",ar:"بالنسبة إليّ، التعلم ضمن مجموعة أكثر تحفيزًا."},
     {fr:"Par exemple, nous pouvons réviser ensemble après le cours.",ar:"يمكننا مثلًا أن نراجع معًا بعد الدرس."}
    ]),
    section("Être d’accord ou nuancer","الموافقة والاختلاف بأدب","تفاعل مع رأي الطرف الآخر قبل أن تعرض موقفك. وتجنب الرفض الحاد، خصوصًا في الحوار الرسمي أو عند مناقشة اقتراح.",[
     "للموافقة: Je suis d’accord، Tout à fait، Vous avez raison.",
     "للموافقة الجزئية: Je suis plutôt d’accord، C’est vrai, mais…",
     "للاختلاف بأدب: Je comprends votre point de vue, mais…",
     "Je ne suis pas tout à fait d’accord ألطف من قول C’est faux."
    ],[
     {fr:"Vous avez raison : il faut mieux informer les habitants.",ar:"أنتم محقون؛ يجب إبلاغ السكان بصورة أفضل."},
     {fr:"C’est vrai, mais le prix reste encore trop élevé.",ar:"هذا صحيح، لكن السعر لا يزال مرتفعًا جدًا."},
     {fr:"Je comprends ton choix ; pourtant, je préfère attendre.",ar:"أتفهم اختيارك، ومع ذلك أفضل الانتظار."}
    ]),
    section("Organiser une prise de parole","تنظيم الحديث","قدّم فكرة واحدة في كل خطوة، واستخدم روابط واضحة كي لا يبدو كلامك مجموعة جمل منفصلة.",[
     "قدّم الموضوع: Je vais parler de… أو Aujourd’hui, je voudrais présenter…",
     "رتّب الأفكار بـ d’abord، ensuite، puis وenfin.",
     "أضف فكرة بـ de plus، وقابلها بـ mais أو pourtant.",
     "اختم بـ en résumé أو pour conclure مع موقف نهائي واضح."
    ],[
     {fr:"Aujourd’hui, je voudrais présenter une activité de mon quartier.",ar:"أود اليوم أن أعرّف بنشاط يقام في حيي."},
     {fr:"D’abord, je décrirai le projet ; ensuite, j’expliquerai son intérêt.",ar:"أولًا، سأصف المشروع، ثم سأوضح أهميته."},
     {fr:"En résumé, cette proposition répond à nos besoins.",ar:"وخلاصة القول أن هذا الاقتراح يلبي احتياجاتنا."}
    ]),
    section("Écrire un message adapté","كتابة رسالة ملائمة للموقف","اختر التحية والختام بحسب المخاطَب، ثم اجعل سبب الرسالة والتفاصيل والطلب سهلة العثور عليها.",[
     "ودي: Bonjour Lina / Salut Karim؛ رسمي: Bonjour Madame, Bonjour Monsieur.",
     "اذكر الغرض مبكرًا: Je vous écris pour… أو Je voudrais vous informer que…",
     "نظّم التفاصيل في فقرات قصيرة، ثم صغ طلبًا محددًا ومهذبًا.",
     "اختم بـ À bientôt مع المقربين، أو Cordialement في المراسلات الرسمية."
    ],[
     {fr:"Je vous écris pour donner mon avis sur les nouveaux horaires.",ar:"أكتب إليكم لإبداء رأيي في المواعيد الجديدة."},
     {fr:"Serait-il possible d’ouvrir la salle le samedi matin ?",ar:"هل يمكن فتح القاعة صباح السبت؟"},
     {fr:"Merci pour votre attention. Cordialement, Nour.",ar:"شكرًا لاهتمامكم. مع خالص التحية، نور."}
    ]),
    section("Raconter une expérience et présenter un projet","وصف تجربة وعرض مشروع","اجمع ما تعلمته في A2: صف خلفية في الماضي الناقص، احكِ أحداثًا منتهية بالماضي المركب، ثم قدّم خطة قادمة.",[
     "الخلفية: Il faisait beau، J’étais débutant، Nous habitions près du centre.",
     "الحدث المنتهي: J’ai participé، Nous avons terminé، Elle est arrivée.",
     "عبّر عن الانطباع: Cette expérience m’a plu / m’a beaucoup appris.",
     "قدّم المشروع بـ je vais + مصدر أو المستقبل البسيط مع موعد واضح."
    ],[
     {fr:"Au début, j’étais inquiet, mais l’équipe était très accueillante.",ar:"كنت قلقًا في البداية، لكن الفريق كان ودودًا جدًا."},
     {fr:"J’ai appris à organiser mon travail et à parler en public.",ar:"تعلمت تنظيم عملي والتحدث أمام الجمهور."},
     {fr:"L’été prochain, je participerai à un autre projet.",ar:"سأشارك في مشروع آخر الصيف المقبل."}
    ]),
    section("Maintenir et réparer l’échange","متابعة الحوار وتصحيح الفهم","الاستقلالية لا تعني فهم كل شيء من المرة الأولى؛ بل أن تعرف كيف تطلب التكرار أو المعنى أو إعادة الصياغة وتؤكد ما فهمته.",[
     "اطلب التكرار: Pardon ? أو Pourriez-vous répéter, s’il vous plaît ?",
     "اسأل عن المعنى: Qu’est-ce que ce mot veut dire ?",
     "تحقق من الفهم: Vous voulez dire que… ? أو Si j’ai bien compris…",
     "اطلب صياغة أخرى: Pourriez-vous l’expliquer autrement ? ثم أعد الفكرة بكلماتك."
    ],[
     {fr:"Excusez-moi, je n’ai pas bien compris la dernière phrase.",ar:"عذرًا، لم أفهم الجملة الأخيرة جيدًا."},
     {fr:"Si j’ai bien compris, la réunion commence à neuf heures.",ar:"حسب ما فهمت، يبدأ الاجتماع الساعة التاسعة."},
     {fr:"Vous voulez dire que je dois envoyer le document aujourd’hui ?",ar:"هل تقصدون أن عليّ إرسال المستند اليوم؟"}
    ])
   ]
  }
];

const B1_MODULES:CourseModule[]=[
 {
  id:"past-tenses",title:"Maîtriser les temps du passé",ar:"إتقان أزمنة الماضي",icon:History,
  description:"ميّز بين الماضي المركب والناقص وما قبل الماضي لتروي أحداثًا واضحة ومترابطة.",
  sections:[
   section("Passé composé et imparfait","الماضي المركب والناقص","استخدم الماضي الناقص للوصف والعادات والخلفية، والماضي المركب للأحداث المنتهية التي تدفع القصة إلى الأمام.",["حدّد الخلفية أولًا ثم الحدث الرئيس.","استعمل pendant que لحدثين متزامنين."],[{fr:"Il pleuvait quand nous sommes sortis.",ar:"كانت السماء تمطر عندما خرجنا."},{fr:"Pendant que je travaillais, le téléphone a sonné.",ar:"بينما كنت أعمل، رن الهاتف."}]),
   section("Plus-que-parfait","ما قبل الماضي","استعمل ما قبل الماضي لحدث وقع قبل حدث آخر في الماضي: فعل مساعد في الناقص ثم اسم المفعول.",["اختر avoir أو être وفق الفعل.","رتّب الحدثين بوضوح باستخدام déjà وavant."],[{fr:"Le train était déjà parti quand nous sommes arrivés.",ar:"كان القطار قد غادر عندما وصلنا."},{fr:"Elle avait réservé la chambre avant son voyage.",ar:"كانت قد حجزت الغرفة قبل سفرها."}])
  ]
 },
 {
  id:"narration",title:"Raconter et structurer",ar:"السرد وتنظيم الأحداث",icon:ScrollText,
  description:"ابنِ قصة لها بداية وتطور ونهاية باستخدام روابط زمنية ووصف دقيق.",
  sections:[
   section("Organiser un récit","تنظيم قصة","رتّب القصة إلى وضع أولي وحدث مفاجئ وتتابع للأحداث ثم نتيجة.",["ابدأ بتحديد الزمان والمكان.","استخدم soudain وensuite وfinalement."],[{fr:"Tout à coup, nous avons entendu un bruit étrange.",ar:"فجأة سمعنا صوتًا غريبًا."},{fr:"Finalement, tout s’est bien terminé.",ar:"وفي النهاية انتهى كل شيء على ما يرام."}]),
   section("Décrire avec précision","الوصف بدقة","أضف أوصافًا تخدم القصة، وتجنب تراكم الصفات من دون وظيفة.",["صف المكان والشعور والحركة.","استخدم qui وoù لإضافة معلومات مفيدة."],[{fr:"La rue où nous marchions était complètement vide.",ar:"كان الشارع الذي كنا نسير فيه خاليًا تمامًا."},{fr:"J’étais inquiet, mais je suis resté calme.",ar:"كنت قلقًا، لكنني بقيت هادئًا."}])
  ]
 },
 {
  id:"future-hypothesis",title:"Parler de l’avenir et faire des hypothèses",ar:"المستقبل والافتراض",icon:Telescope,
  description:"تحدث عن الخطط والتوقعات والاحتمالات باستعمال المستقبل وصيغ الشرط الأساسية.",
  sections:[
   section("Futur simple et futur proche","المستقبل البسيط والقريب","اختر المستقبل القريب لخطة قريبة أو مؤكدة، والمستقبل البسيط لتوقع أو حدث أبعد.",["اربط الخطة بوقت واضح.","تدرّب على جذور الأفعال غير المنتظمة."],[{fr:"Je vais commencer une formation lundi.",ar:"سأبدأ دورة تدريبية يوم الاثنين."},{fr:"Dans dix ans, les villes seront différentes.",ar:"بعد عشر سنوات ستكون المدن مختلفة."}]),
   section("Si + présent","الشرط الواقعي","للاحتمال الواقعي استعمل si مع الحاضر، ثم المستقبل أو الأمر في الجملة الثانية.",["لا تضع المستقبل مباشرة بعد si.","اجعل النتيجة منطقية ومحددة."],[{fr:"Si j’ai le temps, je viendrai avec vous.",ar:"إذا كان لدي وقت فسآتي معكم."},{fr:"Si tu arrives tôt, appelle-moi.",ar:"إذا وصلت مبكرًا فاتصل بي."}])
  ]
 },
 {
  id:"conditional",title:"Utiliser le conditionnel",ar:"استخدام صيغة الشرط",icon:WandSparkles,
  description:"عبّر عن الرغبة والاقتراح والطلب المهذب والنتيجة الافتراضية.",
  sections:[
   section("Demandes et souhaits","الطلبات والرغبات","استخدم الشرط الحاضر لتلطيف الطلب أو التعبير عن رغبة.",["ابدأ بـ je voudrais أو pourriez-vous.","حافظ على نبرة مهذبة في المواقف الرسمية."],[{fr:"Je voudrais modifier ma réservation.",ar:"أود تعديل حجزي."},{fr:"Pourriez-vous m’envoyer les informations ?",ar:"هل يمكنكم إرسال المعلومات إليّ؟"}]),
   section("Si + imparfait","الافتراض غير المؤكد","استعمل si مع الماضي الناقص، ثم الشرط الحاضر للحديث عن حالة افتراضية.",["لا تستخدم الشرط بعد si.","ميّز بين الشرط الواقعي والافتراضي."],[{fr:"Si j’avais plus de temps, je voyagerais davantage.",ar:"لو كان لدي وقت أكثر لسافرت أكثر."},{fr:"Nous sortirions s’il faisait beau.",ar:"سنخرج لو كان الطقس جميلًا."}])
  ]
 },
 {
  id:"relative-pronouns",title:"Relier avec les pronoms relatifs",ar:"الربط بالضمائر النسبية",icon:Link2,
  description:"اربط الجمل باستخدام qui وque وoù وdont وتجنب تكرار الأسماء.",
  sections:[
   section("Qui, que et où","الضمائر qui وque وoù","اختر qui للفاعل وque للمفعول المباشر وoù للمكان أو الزمان.",["ابحث عن وظيفة الاسم داخل الجملة الثانية.","انتبه إلى حذف حرف العلة في qu’."],[{fr:"C’est un livre qui explique l’histoire de la ville.",ar:"هذا كتاب يشرح تاريخ المدينة."},{fr:"Voici le quartier où j’ai grandi.",ar:"هذا هو الحي الذي نشأت فيه."}]),
   section("Le pronom dont","الضمير dont","استخدم dont عندما يرتبط الفعل أو التعبير بحرف الجر de.",["استبدل de + اسم بـ dont.","استعمله أيضًا للتعبير عن الملكية."],[{fr:"C’est le projet dont je t’ai parlé.",ar:"هذا هو المشروع الذي حدثتك عنه."},{fr:"Elle connaît une famille dont le fils travaille ici.",ar:"تعرف عائلة يعمل ابنها هنا."}])
  ]
 },
 {
  id:"subjunctive",title:"Découvrir le subjonctif",ar:"مدخل إلى صيغة التمني والشك",icon:Sparkles,
  description:"استخدم الصيغة المناسبة بعد الضرورة والرغبة والمشاعر والشك في أكثر التراكيب شيوعًا.",
  sections:[
   section("Nécessité et volonté","الضرورة والإرادة","يأتي المضارع المنصوب غالبًا بعد que عندما يختلف فاعلا الجملتين.",["تعلّم صيغ être وavoir وfaire وaller.","ابدأ بتراكيب il faut que وje veux que."],[{fr:"Il faut que vous soyez à l’heure.",ar:"يجب أن تكونوا في الموعد."},{fr:"Je veux que tu viennes avec nous.",ar:"أريدك أن تأتي معنا."}]),
   section("Émotions et doute","المشاعر والشك","استخدم الصيغة بعد تعبيرات الفرح والخوف والشك وعدم اليقين.",["اربط السبب العاطفي بجملة تبدأ بـ que.","بعد اليقين المثبت يُستخدم الإخباري غالبًا."],[{fr:"Je suis content que tu sois ici.",ar:"أنا سعيد لأنك هنا."},{fr:"Je ne pense pas qu’il puisse venir.",ar:"لا أظن أنه يستطيع الحضور."}])
  ]
 },
 {
  id:"logical-links",title:"Construire un discours logique",ar:"بناء خطاب مترابط",icon:Layers3,
  description:"نظّم السبب والنتيجة والهدف والتعارض والتنازل بروابط مناسبة.",
  sections:[
   section("Cause, conséquence et but","السبب والنتيجة والهدف","اختر الرابط بحسب العلاقة التي تريد توضيحها بين فكرتين.",["للسبب: parce que، puisque، grâce à، à cause de.","للنتيجة والهدف: donc، c’est pourquoi، pour، afin de."],[{fr:"Le vol est retardé à cause du brouillard.",ar:"تأخرت الرحلة بسبب الضباب."},{fr:"Je prends des notes afin de mieux mémoriser.",ar:"أدوّن ملاحظات لكي أتذكر بصورة أفضل."}]),
   section("Opposition et concession","التعارض والتنازل","استخدم mais وpourtant للتعارض، وmême si وbien que للتنازل.",["ميّز بين مقارنة فكرتين ونتيجة غير متوقعة.","يأتي bien que مع صيغة التمني والشك."],[{fr:"Le trajet est long ; pourtant, il est agréable.",ar:"الطريق طويل، ومع ذلك فهو ممتع."},{fr:"Même s’il pleut, nous sortirons.",ar:"حتى لو أمطرت فسنخرج."}])
  ]
 },
 {
  id:"argumentation",title:"Exprimer et défendre une opinion",ar:"التعبير عن الرأي والدفاع عنه",icon:Speech,
  description:"قدّم موقفًا واضحًا وادعمه بسبب ومثال، ثم ناقش رأيًا مختلفًا بأدب.",
  sections:[
   section("Présenter son point de vue","عرض وجهة النظر","ابدأ بموقف واضح ثم دعمه بحجة ومثال واقعي.",["استخدم à mon avis وselon moi.","تجنب تكرار je pense que في كل جملة."],[{fr:"À mon avis, les transports publics devraient être moins chers.",ar:"في رأيي ينبغي أن تكون المواصلات العامة أقل تكلفة."},{fr:"Par exemple, cela aiderait les étudiants.",ar:"فمثلًا سيساعد ذلك الطلاب."}]),
   section("Nuancer et répondre","التلطيف والرد","اعترف بجزء من رأي الطرف الآخر قبل تقديم اعتراضك.",["استخدم je comprends, mais…", "اختم باقتراح أو حل مشترك."],[{fr:"Je comprends cet argument, mais il faut considérer le coût.",ar:"أتفهم هذه الحجة، لكن يجب مراعاة التكلفة."},{fr:"Nous pourrions chercher une solution plus équilibrée.",ar:"يمكننا البحث عن حل أكثر توازنًا."}])
  ]
 },
 {
  id:"formal-communication",title:"Communiquer dans un cadre formel",ar:"التواصل في السياق الرسمي",icon:NotebookTabs,
  description:"اكتب رسائل منظمة وشارك في محادثات رسمية تتعلق بالعمل والخدمات والدراسة.",
  sections:[
   section("Courriels et réclamations","البريد والشكاوى","رتّب الرسالة إلى موضوع وسبب وتفاصيل وطلب وختام مناسب.",["استخدم التحية والختام الرسميين.","اجعل طلبك محددًا وقابلًا للتنفيذ."],[{fr:"Je vous écris au sujet de ma commande.",ar:"أكتب إليكم بخصوص طلبي."},{fr:"Je vous remercie de bien vouloir vérifier mon dossier.",ar:"أشكركم على التكرم بمراجعة ملفي."}]),
   section("Entretiens et rendez-vous","المقابلات والمواعيد","قدّم خبرتك وهدفك واطلب التوضيح عند الحاجة.",["حضّر تعريفًا موجزًا بنفسك.","استخدم أسئلة رسمية واضحة."],[{fr:"J’ai travaillé deux ans dans le secteur du tourisme.",ar:"عملت سنتين في قطاع السياحة."},{fr:"Pourriez-vous préciser les horaires du poste ?",ar:"هل يمكنكم توضيح ساعات العمل؟"}])
  ]
 },
 {
  id:"social-life",title:"Agir dans la vie quotidienne",ar:"التصرف باستقلالية في الحياة اليومية",icon:UsersRound,
  description:"حل المشكلات واشرح احتياجاتك وتفاوض في مواقف السفر والسكن والصحة والخدمات.",
  sections:[
   section("Expliquer un problème","شرح مشكلة","قدّم السياق ثم المشكلة وأثرها والحل الذي تنتظره.",["اذكر الأرقام والتواريخ والمراجع بدقة.","اطلب تأكيد الخطوة التالية."],[{fr:"Mon appartement n’a plus de chauffage depuis hier.",ar:"لم تعد التدفئة تعمل في شقتي منذ أمس."},{fr:"Quand un technicien pourra-t-il intervenir ?",ar:"متى يستطيع الفني الحضور؟"}]),
   section("Négocier une solution","التفاوض على حل","اقترح بديلًا وقارن الخيارات وتوصل إلى اتفاق واضح.",["استخدم si possible وsinon.","أعد صياغة الاتفاق في النهاية."],[{fr:"Si cette chambre n’est pas disponible, je peux changer de date.",ar:"إذا لم تكن هذه الغرفة متاحة فيمكنني تغيير التاريخ."},{fr:"D’accord, je confirme donc la deuxième option.",ar:"حسنًا، أؤكد إذن الخيار الثاني."}])
  ]
 },
 {
  id:"media-culture",title:"Comprendre les médias et la culture",ar:"فهم الإعلام والثقافة",icon:Earth,
  description:"افهم الأخبار والمقابلات والآراء الأساسية وتحدث عن كتاب أو فيلم أو حدث ثقافي.",
  sections:[
   section("Repérer l’information","استخراج المعلومات","ميّز بين الحدث والفاعل والمكان والوقت والسبب في نص أو تسجيل.",["ابدأ بالفكرة العامة قبل التفاصيل.","تحقق من مصدر الرأي ومن يتحدث."],[{fr:"Selon le reportage, le festival accueillera vingt artistes.",ar:"بحسب التقرير سيستضيف المهرجان عشرين فنانًا."},{fr:"L’interview explique pourquoi le projet a changé.",ar:"توضح المقابلة سبب تغير المشروع."}]),
   section("Présenter une œuvre","عرض عمل ثقافي","لخّص الموضوع وعبّر عن انطباعك وقدّم توصية معللة.",["لا تكشف النهاية عند تلخيص قصة.","ادعم رأيك بمشهد أو عنصر محدد."],[{fr:"Ce film raconte l’histoire d’une famille qui quitte son village.",ar:"يروي هذا الفيلم قصة عائلة تغادر قريتها."},{fr:"Je le recommande parce que les personnages sont convaincants.",ar:"أوصي به لأن الشخصيات مقنعة."}])
  ]
 },
 {
  id:"b1-synthesis",title:"Projet final B1",ar:"المشروع الختامي B1",icon:Trophy,
  description:"ادمج الفهم والسرد والرأي والتفاعل والكتابة في مهام متكاملة بمستوى B1.",
  sections:[
   section("Comprendre et reformuler","الفهم وإعادة الصياغة","التقط الفكرة الأساسية والمعلومات المهمة، ثم عبّر عنها بكلماتك من دون نسخ النص.",["دوّن الكلمات المفتاحية فقط.","حافظ على المعنى عند إعادة الصياغة."],[{fr:"Le document présente plusieurs solutions au même problème.",ar:"يعرض المستند عدة حلول للمشكلة نفسها."},{fr:"En résumé, les habitants demandent un meilleur service.",ar:"باختصار، يطالب السكان بخدمة أفضل."}]),
   section("Produire et interagir","الإنتاج والتفاعل","قدّم موضوعًا منظمًا، أجب عن الأسئلة، واكتب نصًا واضحًا مترابطًا.",["خطط للمقدمة والفكرتين والخاتمة.","راجع الأزمنة والروابط والاتفاق قبل الإنهاء."],[{fr:"Je vais présenter mon expérience, puis expliquer ce que j’ai appris.",ar:"سأعرض تجربتي ثم أوضح ما تعلمته."},{fr:"Pour conclure, ce projet m’a permis de devenir plus autonome.",ar:"وفي الختام أتاح لي هذا المشروع أن أصبح أكثر استقلالية."}])
  ]
 }
];

const LEVELS:Level[]=[
 {id:"A1",label:"Débutant",ar:"المستوى المبتدئ",description:"من الأبجدية والنطق إلى التواصل في المواقف اليومية الأساسية.",modules:A1_ORDERED_MODULES},
 {id:"A2",label:"Élémentaire",ar:"المستوى الأساسي المتقدم",description:"بناء سرد أوضح، استخدام الأزمنة، والتعامل باستقلالية أكبر.",modules:A2_MODULES},
 {id:"B1",label:"Intermédiaire",ar:"المستوى المتوسط",description:"السرد المتماسك، التعبير عن الرأي، والتصرف باستقلالية في المواقف المتنوعة.",modules:B1_MODULES}
];

const COURSE_PHASES:Record<string,JourneyPhase[]>={
 A1:[
  {title:"البداية الصحيحة",fr:"Premiers pas",description:"الحروف والأصوات والتحية، ثم البلد واللغة والأسماء والضمائر الأساسية.",moduleIds:["alphabet","sounds","greetings","countries-languages","nouns","core-verbs"]},
  {title:"بناء الجملة",fr:"Construire la langue",description:"المضارع والدراسة والمهن والأذواق والتفضيلات والتقديم والأسئلة والزمن والصفات والقدرة والرغبة والمستقبل القريب.",moduleIds:["present","studies-professions","tastes-preferences","structures","questions","numbers-time","adjectives","modal-verbs","future-imperative"]},
  {title:"التواصل اليومي",fr:"Communiquer au quotidien",description:"العائلة والسكن والروتين والطعام والمدينة والطقس والصحة والمواقف والرسائل.",moduleIds:["description","home-housing","daily-life","food-shopping","city-directions","weather-clothes","health-needs","situations","messages-forms"]}
 ],
  A2:[
   {title:"تثبيت الأساس",fr:"Consolider les acquis",description:"مراجعة الحاضر ثم الحديث عن الماضي والمستقبل.",moduleIds:["revision","passe-compose","imparfait","future"]},
   {title:"دقة التعبير",fr:"Préciser son expression",description:"الضمائر والكميات والمقارنة والطلب المهذب.",moduleIds:["pronouns","quantity","comparison","politeness"]},
   {title:"التواصل المستقل",fr:"Communiquer avec autonomie",description:"ربط الأفكار والتصرف في المواقف والتعبير بثقة.",moduleIds:["connectors","themes","expression"]}
  ],
  B1:[
   {title:"إتقان السرد",fr:"Maîtriser le récit",description:"أزمنة الماضي وتنظيم القصة والمستقبل والافتراض.",moduleIds:["past-tenses","narration","future-hypothesis","conditional"]},
   {title:"تطوير اللغة",fr:"Développer la langue",description:"الضمائر النسبية والصيغة المنصوبة والروابط والحجاج.",moduleIds:["relative-pronouns","subjunctive","logical-links","argumentation"]},
   {title:"الاستقلال المتقدم",fr:"Gagner en autonomie",description:"التواصل الرسمي والحياة اليومية والإعلام والمشروع الختامي.",moduleIds:["formal-communication","social-life","media-culture","b1-synthesis"]}
  ]
};

const COURSE_PHASE_ICONS:Record<string,LucideIcon[]>={
 A1:[Rocket,Blocks,MessagesSquare],
 A2:[BadgeCheck,Layers3,Orbit],
 B1:[History,Link2,Trophy]
};

const REVISION_SECTION_ICONS:LucideIcon[]=[Activity,Repeat2,CircleMinus,CircleHelp,CalendarClock,Link2];

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

let practiceCorrectAudio:HTMLAudioElement|null=null;
let practiceErrorAudio:HTMLAudioElement|null=null;

function preparePracticeFeedbackAudio(){
 if(typeof window==="undefined")return;
 if(!practiceCorrectAudio){
  practiceCorrectAudio=new Audio("/audio/practice-correct.mp3");
  practiceCorrectAudio.preload="auto";
  practiceCorrectAudio.volume=1;
  practiceCorrectAudio.load();
 }
 if(!practiceErrorAudio){
  practiceErrorAudio=new Audio("/audio/practice-error-reject.mp3");
  practiceErrorAudio.preload="auto";
  practiceErrorAudio.volume=1;
  practiceErrorAudio.load();
 }
}

function playPracticeChoiceFeedback(correct:boolean){
 if(typeof window==="undefined")return;
 if(!correct&&"vibrate" in navigator)navigator.vibrate(55);
 preparePracticeFeedbackAudio();
 const audio=correct?practiceCorrectAudio:practiceErrorAudio;
 if(!audio)return;
 audio.pause();
 audio.currentTime=0;
 audio.volume=1;
 void audio.play().catch(()=>undefined);
}

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
 const [vowelCardIndex,setVowelCardIndex]=useState<Record<VowelTableKind,number>>({oral:0,nasal:0,rounded:0,unrounded:0,closed:0,mid:0,open:0,semij:0,semiw:0,semiu:0});
 const [soundGroupCardIndex,setSoundGroupCardIndex]=useState<Record<string,number>>({});
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
 const [soundsDictationWordVisible,setSoundsDictationWordVisible]=useState(false);
 const [soundsDictationWritingEnabled,setSoundsDictationWritingEnabled]=useState(false);
 const soundsDictationRevealTimerRef=useRef<number|null>(null);
 const [revisionBuilderIndex,setRevisionBuilderIndex]=useState(0);
 const [revisionBuilderSelection,setRevisionBuilderSelection]=useState<number[]>([]);
 const [revisionBuilderChecked,setRevisionBuilderChecked]=useState(false);
 const [revisionDialogueAnswers,setRevisionDialogueAnswers]=useState<Record<number,number>>({});
 const [revisionWritingText,setRevisionWritingText]=useState("");
 const [alphabetWritingIndex,setAlphabetWritingIndex]=useState(0);
 const [alphabetWritingInput,setAlphabetWritingInput]=useState("");
 const [alphabetWritingState,setAlphabetWritingState]=useState<"idle"|"correct"|"wrong">("idle");
 const [alphabetPracticeStep,setAlphabetPracticeStep]=useState(0);
 const [alphabetHighestPracticeStep,setAlphabetHighestPracticeStep]=useState(0);
 const [alphabetPracticeOpen,setAlphabetPracticeOpen]=useState(false);
 const [alphabetPracticeClosing,setAlphabetPracticeClosing]=useState(false);
 const [alphabetListeningClipIndex,setAlphabetListeningClipIndex]=useState(0);
 const [alphabetListeningQuestionIndex,setAlphabetListeningQuestionIndex]=useState(0);
 const [alphabetListeningPlaying,setAlphabetListeningPlaying]=useState(false);
 const [alphabetListeningSegment,setAlphabetListeningSegment]=useState(-1);
 const practiceStageRef=useRef<HTMLElement>(null);
 const alphabetProgressLoadedRef=useRef(false);
 const [usefulSentencesOpen,setUsefulSentencesOpen]=useState(false);
 const usefulSentencesRef=useRef<HTMLElement>(null);
 const [isRecording,setIsRecording]=useState(false);
 const [recordingUrl,setRecordingUrl]=useState("");
 const [recordingError,setRecordingError]=useState("");
 const mediaRecorderRef=useRef<MediaRecorder|null>(null);
 const recordingStreamRef=useRef<MediaStream|null>(null);
 const recordingChunksRef=useRef<Blob[]>([]);
 const activeModule=useMemo(()=>level.modules.find(item=>item.id===moduleId)??level.modules[0],[level,moduleId]);
 const isA2Revision=level.id==="A2"&&activeModule.id==="revision";
 const isA1Alphabet=level.id==="A1"&&activeModule.id==="alphabet";
 const isA1Sounds=level.id==="A1"&&activeModule.id==="sounds";
 const isA1Greetings=level.id==="A1"&&activeModule.id==="greetings";
 const isA1Countries=level.id==="A1"&&activeModule.id==="countries-languages";
 const isA1Studies=level.id==="A1"&&activeModule.id==="studies-professions";
 const isA1Tastes=level.id==="A1"&&activeModule.id==="tastes-preferences";
 const isA1OrbitLesson=isA1Alphabet||isA1Sounds||isA1Countries||isA1Studies||isA1Tastes;
 const isA1Nouns=level.id==="A1"&&activeModule.id==="nouns";
 const isA1CoreVerbs=level.id==="A1"&&activeModule.id==="core-verbs";
 const isA1Structures=level.id==="A1"&&activeModule.id==="structures";
 const isA1Questions=level.id==="A1"&&activeModule.id==="questions";
 const isA1Present=level.id==="A1"&&activeModule.id==="present";
 const isA1ModalVerbs=level.id==="A1"&&activeModule.id==="modal-verbs";
 const isA1FutureImperative=level.id==="A1"&&activeModule.id==="future-imperative";
 const isA1FoodShopping=level.id==="A1"&&activeModule.id==="food-shopping";
 const isA1CityDirections=level.id==="A1"&&activeModule.id==="city-directions";
 const isA1NumbersTime=level.id==="A1"&&activeModule.id==="numbers-time";
 const isA1WeatherClothes=level.id==="A1"&&activeModule.id==="weather-clothes";
 const isA1HomeHousing=level.id==="A1"&&activeModule.id==="home-housing";
 const isA1Description=level.id==="A1"&&activeModule.id==="description";
 const isA1HealthNeeds=level.id==="A1"&&activeModule.id==="health-needs";
 const isA1Adjectives=level.id==="A1"&&activeModule.id==="adjectives";
 const isA1DailyLife=level.id==="A1"&&activeModule.id==="daily-life";
 const isA1Situations=level.id==="A1"&&activeModule.id==="situations";
 const isA1MessagesForms=level.id==="A1"&&activeModule.id==="messages-forms";
 const isA2PasseCompose=level.id==="A2"&&activeModule.id==="passe-compose";
 const isA2Imparfait=level.id==="A2"&&activeModule.id==="imparfait";
 const isA2Future=level.id==="A2"&&activeModule.id==="future";
 const isA2Pronouns=level.id==="A2"&&activeModule.id==="pronouns";
 const isA2Quantity=level.id==="A2"&&activeModule.id==="quantity";
 const isA2Comparison=level.id==="A2"&&activeModule.id==="comparison";
 const isA2Politeness=level.id==="A2"&&activeModule.id==="politeness";
 const isA2Connectors=level.id==="A2"&&activeModule.id==="connectors";
 const isA2RealLife=level.id==="A2"&&activeModule.id==="themes";
 const isA2Expression=level.id==="A2"&&activeModule.id==="expression";
 const isEnhancedA2Lesson=isA2Revision||isA2PasseCompose||isA2Imparfait||isA2Future||isA2Pronouns||isA2Quantity||isA2Comparison||isA2Politeness||isA2Connectors||isA2RealLife||isA2Expression;
 const activeA1EnhancedContent=level.id==="A1"?A1_ENHANCED_CONTENT[activeModule.id as keyof typeof A1_ENHANCED_CONTENT]:undefined;
 const isEnhancedA1Lesson=Boolean(activeA1EnhancedContent);
 const isEnhancedLesson=isEnhancedA2Lesson||isEnhancedA1Lesson;
 const activeA2Reading=activeA1EnhancedContent?.reading??(isA2Expression?A2_EXPRESSION_READING:isA2RealLife?A2_REAL_LIFE_READING:isA2Connectors?A2_CONNECTORS_READING:isA2Politeness?A2_POLITENESS_READING:isA2Comparison?A2_COMPARISON_READING:isA2Quantity?A2_QUANTITY_READING:isA2Pronouns?A2_PRONOUNS_READING:isA2Future?A2_FUTURE_READING:isA2Imparfait?A2_IMPARFAIT_READING:isA2PasseCompose?A2_PASSE_COMPOSE_READING:A2_REVISION_READING);
 const activeA2Listening=activeA1EnhancedContent?.listening??(isA2Expression?A2_EXPRESSION_LISTENING:isA2RealLife?A2_REAL_LIFE_LISTENING:isA2Connectors?A2_CONNECTORS_LISTENING:isA2Politeness?A2_POLITENESS_LISTENING:isA2Comparison?A2_COMPARISON_LISTENING:isA2Quantity?A2_QUANTITY_LISTENING:isA2Pronouns?A2_PRONOUNS_LISTENING:isA2Future?A2_FUTURE_LISTENING:isA2Imparfait?A2_IMPARFAIT_LISTENING:isA2PasseCompose?A2_PASSE_COMPOSE_LISTENING:A2_REVISION_LISTENING);
 const activeA2Dictation=activeA1EnhancedContent?.dictation??(isA2Expression?A2_EXPRESSION_DICTATION:isA2RealLife?A2_REAL_LIFE_DICTATION:isA2Connectors?A2_CONNECTORS_DICTATION:isA2Politeness?A2_POLITENESS_DICTATION:isA2Comparison?A2_COMPARISON_DICTATION:isA2Quantity?A2_QUANTITY_DICTATION:isA2Pronouns?A2_PRONOUNS_DICTATION:isA2Future?A2_FUTURE_DICTATION:isA2Imparfait?A2_IMPARFAIT_DICTATION:isA2PasseCompose?A2_PASSE_COMPOSE_DICTATION:A2_REVISION_DICTATION);
 const activeA2Builders=activeA1EnhancedContent?.builders??(isA2Expression?A2_EXPRESSION_BUILDERS:isA2RealLife?A2_REAL_LIFE_BUILDERS:isA2Connectors?A2_CONNECTORS_BUILDERS:isA2Politeness?A2_POLITENESS_BUILDERS:isA2Comparison?A2_COMPARISON_BUILDERS:isA2Quantity?A2_QUANTITY_BUILDERS:isA2Pronouns?A2_PRONOUNS_BUILDERS:isA2Future?A2_FUTURE_BUILDERS:isA2Imparfait?A2_IMPARFAIT_BUILDERS:isA2PasseCompose?A2_PASSE_COMPOSE_BUILDERS:A2_REVISION_BUILDERS);
 const activeA2Dialogues=activeA1EnhancedContent?.dialogues??(isA2Expression?A2_EXPRESSION_DIALOGUES:isA2RealLife?A2_REAL_LIFE_DIALOGUES:isA2Connectors?A2_CONNECTORS_DIALOGUES:isA2Politeness?A2_POLITENESS_DIALOGUES:isA2Comparison?A2_COMPARISON_DIALOGUES:isA2Quantity?A2_QUANTITY_DIALOGUES:isA2Pronouns?A2_PRONOUNS_DIALOGUES:isA2Future?A2_FUTURE_DIALOGUES:isA2Imparfait?A2_IMPARFAIT_DIALOGUES:isA2PasseCompose?A2_PASSE_COMPOSE_DIALOGUES:A2_REVISION_DIALOGUES);
 const activeA2WritingModel=activeA1EnhancedContent?.writingModel??(isA2Expression?A2_EXPRESSION_WRITING_MODEL:isA2RealLife?A2_REAL_LIFE_WRITING_MODEL:isA2Connectors?A2_CONNECTORS_WRITING_MODEL:isA2Politeness?A2_POLITENESS_WRITING_MODEL:isA2Comparison?A2_COMPARISON_WRITING_MODEL:isA2Quantity?A2_QUANTITY_WRITING_MODEL:isA2Pronouns?A2_PRONOUNS_WRITING_MODEL:isA2Future?A2_FUTURE_WRITING_MODEL:isA2Imparfait?A2_IMPARFAIT_WRITING_MODEL:isA2PasseCompose?A2_PASSE_COMPOSE_WRITING_MODEL:A2_REVISION_WRITING_MODEL);
 const activeA2WritingTitle=activeA1EnhancedContent?.writingTitle??(isA2Expression?"اكتب رأيًا منظمًا":isA2RealLife?"اكتب رسالة لحل مشكلة واقعية":isA2Connectors?"اكتب فقرة مترابطة":isA2Politeness?"اكتب رسالة طلب ونصيحة":isA2Comparison?"قارن بين خيارين واتخذ قرارًا":isA2Quantity?"اكتب قائمة مشتريات وخطة إعداد":isA2Pronouns?"اكتب رسالة تتجنب فيها التكرار":isA2Future?"اكتب عن خططك القادمة":isA2Imparfait?"اكتب ذكرى من الماضي":isA2PasseCompose?"اكتب عن يوم مضى":"اكتب عن روتينك اليومي");
 const activeA2WritingInstructions=activeA1EnhancedContent?.writingInstructions??(isA2Expression?"اكتب من 60 إلى 80 كلمة لإبداء رأيك في تغيير داخل مكتبة أو حي أو مركز تعليمي. اذكر رأيك وسببًا ومثالًا، أضف مخالفة أو تحفظًا مهذبًا، ثم اختم بموقف واضح وطلب مناسب.":isA2RealLife?"اكتب من 60 إلى 80 كلمة إلى فندق أو وكالة أو جهة خدمة. اذكر مرجعًا أو تاريخًا، واشرح المشكلة وأثرها، واطلب حلًا مهذبًا، وحدد طريقة أو وقت التواصل.":isA2Connectors?"اكتب من 60 إلى 80 كلمة عن نشاط أو موقف مررت به. استخدم ضميرين نسبيين، ورابط سبب، ورابط نتيجة، ورابط تعارض، وثلاثة روابط لترتيب الأحداث.":isA2Politeness?"اكتب من 60 إلى 80 كلمة تنصح فيها صديقًا وتطلب منه معلومة أو مساعدة. استخدم طلبيْن مهذبين، وصيغتي نصيحة، وضرورة أو منعًا، واقتراحًا واحدًا.":isA2Comparison?"اكتب من 60 إلى 80 كلمة تقارن فيها بين مكانين أو خدمتين. استخدم plus وmoins وaussi، ومقارنة كمية أو فعل، وصيغة تفضيل، وظرفًا يحدد الدرجة.":isA2Quantity?"اكتب من 60 إلى 80 كلمة عن مشتريات وجبة أو مناسبة. استخدم أداتَي تجزئة، وتعبيرَي كمية، وصيغة نفي، والضميرين y وen في سياق واضح.":isA2Pronouns?"اكتب من 60 إلى 80 كلمة عن خدمة طلبها منك شخص أو معلومات أرسلتها إليه. استخدم خمسة ضمائر مفعول على الأقل، ومنها ضمير مباشر وغير مباشر، وضميرين معًا، وصيغة نفي.":isA2Future?"اكتب من 60 إلى 80 كلمة عن خططك القادمة. استخدم خمس صيغ مستقبلية على الأقل، واجمع بين المستقبل القريب والبسيط، وأضف نفيًا ومؤشرين زمنيين أو رابطين.":isA2Imparfait?"اكتب من 60 إلى 80 كلمة عن طفولتك أو مكان كنت تعرفه. استخدم خمسة أفعال في الماضي الناقص، ووصفًا، وعادة متكررة، وصيغة نفي.":isA2PasseCompose?"اكتب من 60 إلى 80 كلمة عن يوم أو نزهة انتهت. استخدم خمسة أفعال في الماضي المركب، وفعلًا مع être، وصيغة نفي، ورابطين على الأقل.":"اكتب من 60 إلى 80 كلمة. استخدم خمسة أفعال في الحاضر، وفعلًا ضميريًا، وصيغة نفي، ورابطين على الأقل.");
 const activeA2WritingPlaceholder=activeA1EnhancedContent?.writingPlaceholder??(isA2Expression?"Bonjour, je vous écris pour donner mon avis sur…":isA2RealLife?"Bonjour, je vous écris au sujet de…":isA2Connectors?"Samedi, j’ai participé à…":isA2Politeness?"Bonjour, tu devrais…":isA2Comparison?"J’ai comparé deux…":isA2Quantity?"Demain, je vais au marché…":isA2Pronouns?"Mon ami m’a demandé…":isA2Future?"Le mois prochain, je vais…":isA2Imparfait?"Quand j’étais enfant, j’habitais…":isA2PasseCompose?"Samedi dernier, je me suis levé…":"En général, je me lève…");
 const activeA2SpeakingPrompt=activeA1EnhancedContent?.speakingPrompt??(isA2Expression?"Donnez votre avis sur une nouvelle activité dans votre quartier. Présentez le sujet, expliquez votre position avec une raison et un exemple, réagissez poliment à une opinion différente, puis concluez.":isA2RealLife?"Vous rencontrez un problème pendant un voyage. Donnez les informations de référence, expliquez ce qui s’est passé, précisez votre besoin et demandez une solution.":isA2Connectors?"Racontez une activité récente en reliant clairement les étapes. Expliquez une cause, une conséquence et une difficulté qui n’a pas empêché la réussite.":isA2Politeness?"Votre ami vous demande conseil avant un voyage. Donnez-lui deux conseils, proposez une solution et formulez une demande polie.":isA2Comparison?"Comparez deux logements, transports ou services. Présentez leurs avantages et leurs limites, puis expliquez clairement lequel vous préférez.":isA2Quantity?"Présentez les achats nécessaires pour un repas. Précisez les quantités, dites ce que vous avez déjà et indiquez où vous allez acheter le reste.":isA2Pronouns?"Racontez un échange récent avec une personne. Remplacez les noms déjà mentionnés par des pronoms compléments pour éviter les répétitions.":isA2Future?"Présentez vos projets pour les prochaines semaines. Indiquez ce que vous allez faire, ce qui se passera ensuite et une condition possible.":isA2Imparfait?"Décrivez un souvenir de votre enfance. Présentez le lieu, vos habitudes et un événement précis qui s’est produit.":isA2PasseCompose?"Racontez une journée récente. Dites où vous êtes allé, ce que vous avez fait et ce que vous avez aimé ou moins aimé.":"Présentez votre journée habituelle, vos horaires et une activité que vous ne faites jamais. Expliquez pourquoi.");
 const activeA1SpeakingDuration=activeA1EnhancedContent?.speakingDuration;
 const activeA1SpeakingTips=activeA1EnhancedContent?.speakingTips;
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
 const revisionDialogueComplete=activeA2Dialogues.every((dialogue,index)=>revisionDialogueAnswers[index]===dialogue.correctIndex);
 const orbitStepIncomplete=(alphabetPracticeStep===1&&(revisionDictationIndex<activeA2Dictation.length-1||!revisionDictationCorrect))||(alphabetPracticeStep===2&&(revisionBuilderIndex<activeA2Builders.length-1||!revisionBuilderCorrect))||(alphabetPracticeStep===3&&!revisionDialogueComplete);
 const revisionWritingWords=revisionWritingText.match(/[A-Za-zÀ-ÖØ-öø-ÿŒœ]+(?:['’-][A-Za-zÀ-ÖØ-öø-ÿŒœ]+)*/g)??[];
 const orbitWritingTranslations=isA1Sounds?A1_SOUNDS_WRITING_TRANSLATIONS:isA1Countries?A1_COUNTRIES_WRITING_TRANSLATIONS:isA1Studies?A1_STUDIES_WRITING_TRANSLATIONS:isA1Tastes?A1_TASTES_WRITING_TRANSLATIONS:A1_ALPHABET_WRITING_TRANSLATIONS;
 const alphabetWritingItem=orbitWritingTranslations[alphabetWritingIndex];
 const revisionWordCount=revisionWritingWords.length;
 const revisionWritingTokens=(revisionWritingText.toLocaleLowerCase("fr").match(/\p{L}+/gu)??[]) as string[];
 const alphabetInitialCount=new Set(revisionWritingWords.map(word=>word[0].toLocaleLowerCase("fr"))).size;
 const soundPatternCount=["ou","on","oi","in"].filter(sound=>revisionWritingText.toLocaleLowerCase("fr").includes(sound)).length;
 const isA1WordDictation=activeA1EnhancedContent?.dictationUnit==="word";
 const isAlphabetLetterDictation=isA1Alphabet&&(revisionDictationItem as {kind?:string}).kind==="letter";
 const isTimedOrbitWordDictation=isA1OrbitLesson&&!isA1Alphabet&&isA1WordDictation;
 const dictationUnit=isAlphabetLetterDictation?"الحرف":isA1WordDictation?"الكلمة":"الجملة";
 const dictationPlaceholder=isAlphabetLetterDictation?"Écrivez la lettre ici…":isA1WordDictation?"Écrivez le mot ici…":"Écrivez la phrase ici…";
 const alphabetDictationPronunciation=isAlphabetLetterDictation
  ?(()=>{const item=ALPHABET.find(value=>value[0]===revisionDictationItem.speech.toLocaleUpperCase("fr"));return LETTER_SPEECH_OVERRIDES[revisionDictationItem.speech]??item?.[1]??revisionDictationItem.speech.toLocaleLowerCase("fr")})()
  :"";
 const writingMinimum=activeA1EnhancedContent?.writingMinimum??60;
 const writingMaximum=activeA1EnhancedContent?.writingMaximum??80;
 const passeComposeVerbCount=(revisionWritingText.match(/\b(?:j['’]ai|tu\s+as|(?:il|elle|on)\s+a|nous\s+avons|vous\s+avez|(?:ils|elles)\s+ont|je\s+(?:me\s+)?suis|tu\s+(?:t['’])?es|(?:il|elle|on)\s+(?:s['’])?est|nous\s+(?:nous\s+)?sommes|vous\s+(?:vous\s+)?êtes|(?:ils|elles)\s+(?:se\s+)?sont)\s+[a-zà-ÿ]+/gi)??[]).length;
 const imparfaitVerbCount=(revisionWritingText.match(/\b[a-zà-ÿ]+(?:ais|ait|ions|iez|aient)\b/gi)??[]).filter(word=>!["mais","jamais","français"].includes(word.toLocaleLowerCase("fr"))).length;
 const futureSimpleVerbCount=(revisionWritingText.match(/\b[a-zà-ÿ]+(?:rai|ras|ra|rons|rez|ront)\b/gi)??[]).length;
 const futureProcheVerbCount=(revisionWritingText.match(/\b(?:je vais|tu vas|(?:il|elle|on) va|nous allons|vous allez|(?:ils|elles) vont)\s+[a-zà-ÿ]+/gi)??[]).length;
 const objectPronounCount=(revisionWritingText.match(/(?:\b(?:me|te|le|la|les|lui|leur|nous|vous)\b|\b[mtl][’'][a-zà-ÿ]+)/gi)??[]).length;
 const revisionWritingChecks=isA1Alphabet?[
  {label:"كتابة الكلمات الثماني المطلوبة",passed:revisionWordCount===8},
  {label:"ثمانية أحرف أولى مختلفة",passed:alphabetInitialCount===8},
  {label:"الاحتفاظ بالعلامات الفرنسية في café وécole وhôtel",passed:["café","école","hôtel"].every(word=>revisionWritingTokens.includes(word))}
 ]:isA1Sounds?[
  {label:"من 8 إلى 12 كلمة",passed:revisionWordCount>=8&&revisionWordCount<=12},
  {label:"ثماني كلمات فرنسية على الأقل",passed:revisionWordCount>=8},
  {label:"ثلاثة أصوات مستهدفة مختلفة على الأقل",passed:soundPatternCount>=3}
 ]:isA1Greetings?[
  {label:"من 15 إلى 25 كلمة",passed:revisionWordCount>=15&&revisionWordCount<=25},
  {label:"تحية مناسبة",passed:/\b(?:bonjour|bonsoir|salut)\b/i.test(revisionWritingText)},
  {label:"ذكر الاسم",passed:/\bje\s+m[’']appelle\b/i.test(revisionWritingText)},
 {label:"معلومة شخصية بسيطة",passed:/\b(?:j[’']habite|je\s+suis|je\s+parle)\b/i.test(revisionWritingText)},
 {label:"خاتمة لطيفة",passed:/\b(?:enchanté|enchantée|au revoir|à bientôt)\b/i.test(revisionWritingText)}
 ]:isA1Countries?[
  {label:"من 15 إلى 25 كلمة",passed:revisionWordCount>=15&&revisionWordCount<=25},
  {label:"ذكر البلد أو الأصل",passed:/\b(?:viens|habite)\s+(?:de|du|des|d[’']|en|au|aux|à)\b/i.test(revisionWritingText)},
  {label:"ذكر الجنسية",passed:/\bje\s+suis\s+[a-zà-ÿ]+\b/i.test(revisionWritingText)},
  {label:"ذكر لغة",passed:/\b(?:parle|apprends)\s+(?:le\s+)?[a-zà-ÿ]+\b/i.test(revisionWritingText)}
 ]:isA1Studies?[
  {label:"من 15 إلى 25 كلمة",passed:revisionWordCount>=15&&revisionWordCount<=25},
  {label:"ذكر الدراسة أو المهنة",passed:/\b(?:étudie|étudiant|étudiante|professeur|professeure|médecin|infirmier|infirmière|ingénieur|cuisinier|cuisinière|vendeur|vendeuse)\b/i.test(revisionWritingText)},
  {label:"ذكر مكان الدراسة أو العمل",passed:/\b(?:université|école|hôpital|magasin|restaurant|hôtel)\b/i.test(revisionWritingText)},
  {label:"استعمال étudier أو travailler",passed:/\b(?:étudie|étudies|étudions|étudiez|étudient|travaille|travailles|travaillons|travaillez|travaillent)\b/i.test(revisionWritingText)}
 ]:isA1Tastes?[
  {label:"من 20 إلى 30 كلمة",passed:revisionWordCount>=20&&revisionWordCount<=30},
  {label:"ذكر نشاطين محبوبين",passed:(revisionWritingText.match(/\b(?:aime|adore)\s+[a-zà-ÿ]+/gi)??[]).length>=2},
  {label:"ذكر شيء لا تحبه",passed:/\bn[’']aime\s+pas\b/i.test(revisionWritingText)},
  {label:"ذكر تفضيل",passed:/\b(?:préfère|préférons|préférez|préfèrent)\b/i.test(revisionWritingText)},
  {label:"إضافة سبب بسيط",passed:/\bparce\s+qu(?:e|[’'])\b/i.test(revisionWritingText)}
 ]:isA1Nouns?[
  {label:"من 18 إلى 30 كلمة",passed:revisionWordCount>=18&&revisionWordCount<=30},
 {label:"استخدام un وune وdes",passed:/\bun\b/i.test(revisionWritingText)&&/\bune\b/i.test(revisionWritingText)&&/\bdes\b/i.test(revisionWritingText)},
 {label:"اسم جمع واحد على الأقل",passed:/\b(?:livres|chaises|cahiers|images|objets|fenêtres|tables)\b/i.test(revisionWritingText)},
 {label:"جملة وجود باستعمال il y a",passed:/\bil\s+y\s+a\b/i.test(revisionWritingText)}
 ]:isA1CoreVerbs?[
  {label:"من 20 إلى 35 كلمة",passed:revisionWordCount>=20&&revisionWordCount<=35},
 {label:"استخدام صحيح لفعل être",passed:/\b(?:je\s+suis|tu\s+es|(?:il|elle|on)\s+est|nous\s+sommes|vous\s+êtes|(?:ils|elles)\s+sont)\b/i.test(revisionWritingText)},
 {label:"استخدام صحيح لفعل avoir",passed:/\b(?:j[’']ai|tu\s+as|(?:il|elle|on)\s+a|nous\s+avons|vous\s+avez|(?:ils|elles)\s+ont)\b/i.test(revisionWritingText)},
 {label:"ضميران مختلفان على الأقل",passed:new Set((revisionWritingText.match(/\b(?:je|tu|il|elle|on|nous|vous|ils|elles)\b/gi)??[]).map(item=>item.toLocaleLowerCase("fr"))).size>=2}
 ]:isA1Structures?[
  {label:"من 25 إلى 40 كلمة",passed:revisionWordCount>=25&&revisionWordCount<=40},
 {label:"التقديم باستعمال C’est أو Ce sont",passed:/\b(?:c[’']est|ce\s+sont)\b/i.test(revisionWritingText)},
 {label:"ذكر وجود شيء باستعمال Il y a",passed:/\bil\s+y\s+a\b/i.test(revisionWritingText)},
 {label:"أداة إشارة واحدة على الأقل",passed:/\b(?:ce|cet|cette|ces)\b/i.test(revisionWritingText)}
 ]:isA1Questions?[
  {label:"من 25 إلى 40 كلمة",passed:revisionWordCount>=25&&revisionWordCount<=40},
  {label:"خمسة أسئلة مختلفة",passed:(revisionWritingText.match(/\?/g)??[]).length>=5},
 {label:"سؤال باستعمال Est-ce que",passed:/\best-ce\s+que\b/i.test(revisionWritingText)},
 {label:"أداتا استفهام مختلفتان على الأقل",passed:["comment","où","quand","pourquoi"].filter(word=>revisionWritingTokens.includes(word)).length>=2},
 {label:"صيغة صحيحة من quel",passed:/\b(?:quel|quelle|quels|quelles)\b/i.test(revisionWritingText)}
 ]:isA1Present?[
  {label:"من 30 إلى 45 كلمة",passed:revisionWordCount>=30&&revisionWordCount<=45},
  {label:"خمسة أفعال في المضارع على الأقل",passed:revisionWritingTokens.filter(word=>["travaille","travailles","travaillons","travaillez","travaillent","parle","parles","parlons","parlez","parlent","finis","finit","finissons","finissez","finissent","attends","attend","attendons","attendez","attendent","vais","vas","va","allons","allez","vont","fais","fait","faisons","faites","font","prends","prend","prenons","prenez","prennent","viens","vient","venons","venez","viennent","commence","commences","commençons","commencez","commencent","rentre","rentres","rentrons","rentrez","rentrent","prépare","prépares","préparons","préparez","préparent"].includes(word)).length>=5},
  {label:"ضميران مختلفان على الأقل",passed:new Set(revisionWritingTokens.filter(word=>["je","tu","il","elle","on","nous","vous","ils","elles"].includes(word))).size>=2},
  {label:"جملة منفية باستعمال ne… pas",passed:/\bn[’']?e?\s*[a-zà-ÿ’']+\s+pas\b/i.test(revisionWritingText)},
  {label:"رابط واحد على الأقل",passed:revisionWritingTokens.some(word=>["puis","mais","ensuite","enfin"].includes(word))}
 ]:isA1ModalVerbs?[
  {label:"من 30 إلى 45 كلمة",passed:revisionWordCount>=30&&revisionWordCount<=45},
  {label:"التعبير عن القدرة باستعمال pouvoir",passed:/\b(?:peux|peut|pouvons|pouvez|peuvent)\b/i.test(revisionWritingText)},
  {label:"التعبير عن الرغبة باستعمال vouloir",passed:/\b(?:veux|veut|voulons|voulez|veulent|voudrais)\b/i.test(revisionWritingText)},
  {label:"واجب أو ضرورة باستعمال devoir أو il faut",passed:/\b(?:dois|doit|devons|devez|doivent)\b/i.test(revisionWritingText)||/\bil\s+faut\b/i.test(revisionWritingText)},
  {label:"فعل في المصدر بعد الفعل المصرف",passed:/\b(?:peux|peut|pouvons|pouvez|peuvent|veux|veut|voulons|voulez|veulent|voudrais|dois|doit|devons|devez|doivent|faut)\s+[a-zà-ÿ]+(?:er|ir|re)\b/i.test(revisionWritingText)}
 ]:isA1FutureImperative?[
  {label:"من 30 إلى 45 كلمة",passed:revisionWordCount>=30&&revisionWordCount<=45},
  {label:"جملتان في المستقبل القريب",passed:(revisionWritingText.match(/\b(?:vais|vas|va|allons|allez|vont)\s+[a-zà-ÿ]+(?:er|ir|re)\b/gi)??[]).length>=2},
  {label:"أمران على الأقل",passed:revisionWritingTokens.filter(word=>["prépare","préparez","prends","prenez","arrive","arrivez","regarde","regardez","attends","attendez","tourne","tournez","ferme","fermez","finis","finissez","oublie","oubliez","pars","partez"].includes(word)).length>=2},
  {label:"أمر منفي باستعمال ne… pas",passed:/\bn[’']?e?\s*(?:oublie|oubliez|pars|partez|ferme|fermez|attends|attendez|prends|prenez|tourne|tournez)\s+pas\b/i.test(revisionWritingText)}
 ]:isA1FoodShopping?[
  {label:"من 30 إلى 45 كلمة",passed:revisionWordCount>=30&&revisionWordCount<=45},
  {label:"أداتا تجزئة مختلفتان على الأقل",passed:[/\bdu\b/i,/\bde\s+la\b/i,/\bde\s+l[’']/i,/\bdes\b/i].filter(pattern=>pattern.test(revisionWritingText)).length>=2},
  {label:"تعبير كمية واضح",passed:/\b(?:un|une|deux|trois)\s+(?:kilo(?:gramme)?s?|litres?|bouteilles?|verres?|paquets?)\s+de\b/i.test(revisionWritingText)},
  {label:"طلب مهذب",passed:/\bje\s+voudrais\b/i.test(revisionWritingText)||/s[’']il\s+vous\s+plaît/i.test(revisionWritingText)},
  {label:"جملة منفية مع de أو d’",passed:/\bn[’']?e?\s*[a-zà-ÿ]+\s+pas\s+d(?:e|[’'])/i.test(revisionWritingText)}
 ]:isA1CityDirections?[
  {label:"من 30 إلى 45 كلمة",passed:revisionWordCount>=30&&revisionWordCount<=45},
  {label:"نقطة انطلاق باستعمال de",passed:/\b(?:pars?|sors?|viens|partons|sortons|venons|partez|sortez|venez)\s+(?:du|de\s+la|de\s+l[’']|des)\b/i.test(revisionWritingText)},
  {label:"وجهة باستعمال à",passed:/\b(?:vais|vas|va|allons|allez|vont)\s+(?:au|à\s+la|à\s+l[’']|aux)\b/i.test(revisionWritingText)},
  {label:"تعليمتان للاتجاه على الأقل",passed:revisionWritingTokens.filter(word=>["allez","tournez","traversez","prenez","continuez","marchez"].includes(word)).length>=2},
  {label:"تعبير لتحديد الموقع",passed:/\b(?:en\s+face\s+de|à\s+côté\s+de|devant|derrière|entre)\b/i.test(revisionWritingText)}
 ]:isA1NumbersTime?[
  {label:"من 30 إلى 45 كلمة",passed:revisionWordCount>=30&&revisionWordCount<=45},
  {label:"يوم من أيام الأسبوع",passed:revisionWritingTokens.some(word=>["lundi","mardi","mercredi","jeudi","vendredi","samedi","dimanche"].includes(word))},
  {label:"تاريخ يتضمن اسم شهر",passed:revisionWritingTokens.some(word=>["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"].includes(word))},
  {label:"موعدان مختلفان على الأقل",passed:(revisionWritingText.match(/\bà\s+(?:midi|minuit|\d{1,2}(?::\d{2}|\s*h(?:\d{2})?|\s+heures?)|(?:une|deux|trois|quatre|cinq|six|sept|huit|neuf|dix|onze|douze|treize|quatorze|quinze|seize|dix-sept|dix-huit|dix-neuf|vingt)\s+heures?)\b/gi)??[]).length>=2},
  {label:"سعر أو رقم هاتف",passed:/\b(?:euros?|numéro|téléphone)\b/i.test(revisionWritingText)||/\b0\d(?:[ .-]?\d{2}){4}\b/.test(revisionWritingText)}
 ]:isA1WeatherClothes?[
  {label:"من 30 إلى 45 كلمة",passed:revisionWordCount>=30&&revisionWordCount<=45},
  {label:"ذكر فصل من فصول السنة",passed:revisionWritingTokens.some(word=>["printemps","été","automne","hiver"].includes(word))},
  {label:"وصف واضح لحالة الطقس",passed:/\bil\s+(?:fait|pleut|neige|y\s+a)\b/i.test(revisionWritingText)},
  {label:"ذكر درجة الحرارة",passed:/\b(?:degré|degrés)\b/i.test(revisionWritingText)},
  {label:"ثلاث قطع ملابس أو أشياء مناسبة",passed:new Set(revisionWritingTokens.filter(word=>["pantalon","robe","pull","veste","manteau","chemise","chaussures","chapeau","écharpe","parapluie","lunettes"].includes(word))).size>=3}
 ]:isA1HomeHousing?[
  {label:"من 30 إلى 45 كلمة",passed:revisionWordCount>=30&&revisionWordCount<=45},
  {label:"ذكر نوع المسكن",passed:revisionWritingTokens.some(word=>["maison","appartement","studio"].includes(word))},
  {label:"عنوان أو مدينة",passed:/\b\d+\s*,?\s*(?:rue|avenue|boulevard)\b/i.test(revisionWritingText)||/\bà\s+[A-ZÀ-ÖØ-Ý][a-zà-ÿ-]+/.test(revisionWritingText)},
  {label:"غرفتان مختلفتان على الأقل",passed:new Set(revisionWritingTokens.filter(word=>["salon","chambre","cuisine","balcon","jardin","bureau"].includes(word))).size>=2},
  {label:"قطعتا أثاث مع تحديد الموقع",passed:new Set(revisionWritingTokens.filter(word=>["lit","armoire","table","canapé","chaise","lampe","bibliothèque"].includes(word))).size>=2&&/\b(?:sur|sous|dans|devant|derrière|entre|près\s+de|à\s+côté\s+de|en\s+face\s+de)\b/i.test(revisionWritingText)}
 ]:isA1Description?[
  {label:"من 30 إلى 45 كلمة",passed:revisionWordCount>=30&&revisionWordCount<=45},
  {label:"ثلاثة أفراد من العائلة على الأقل",passed:new Set(revisionWritingTokens.filter(word=>["père","mère","frère","sœur","parents","fils","fille","grand-père","grand-mère","grands-parents","oncle","tante","cousin","cousine"].includes(word))).size>=3},
  {label:"صفة ملكية واحدة على الأقل",passed:revisionWritingTokens.some(word=>["mon","ma","mes","ton","ta","tes","son","sa","ses","notre","nos","votre","vos","leur","leurs"].includes(word))},
  {label:"حالة جسدية واحدة",passed:/\b(?:suis|es|est|sommes|êtes|sont)\s+(?:fatigué|fatiguée|malade|prêt|prête)\b/i.test(revisionWritingText)||/\b(?:ai|as|a|avons|avez|ont)\s+(?:faim|soif|froid|chaud|mal)\b/i.test(revisionWritingText)},
  {label:"شعوران مختلفان على الأقل",passed:[/\bcontent(?:e)?\b/i,/\bheureu(?:x|se)\b/i,/\btriste\b/i,/\bcalme\b/i,/\b(?:fier|fière)\b/i,/\bpeur\b/i,/\bsurpris(?:e)?\b/i].filter(pattern=>pattern.test(revisionWritingText)).length>=2}
 ]:isA1HealthNeeds?[
  {label:"من 30 إلى 45 كلمة",passed:revisionWordCount>=30&&revisionWordCount<=45},
  {label:"ذكر عرض صحي",passed:/\b(?:fièvre|toux|rhume|allergie|malade|fatigué|fatiguée)\b/i.test(revisionWritingText)},
  {label:"تحديد موضع الألم",passed:/\bmal\s+(?:à\s+la|à\s+l[’']|au|aux)\s+[a-zà-ÿ]+/i.test(revisionWritingText)},
  {label:"ذكر مدة العرض",passed:/\bdepuis\s+(?:hier|ce\s+matin|\d+|un|une|deux|trois|quatre|cinq)\b/i.test(revisionWritingText)},
  {label:"طلب موعد أو مساعدة بأدب",passed:/\bje\s+voudrais\s+(?:prendre\s+rendez-vous|parler|voir)\b/i.test(revisionWritingText)||/\bj[’']ai\s+besoin\s+d[’']aide\b/i.test(revisionWritingText)}
 ]:isA1Adjectives?[
  {label:"من 35 إلى 50 كلمة",passed:revisionWordCount>=35&&revisionWordCount<=50},
  {label:"وصف شخصين باستعمال il وelle",passed:/\bil\s+est\b/i.test(revisionWritingText)&&/\belle\s+est\b/i.test(revisionWritingText)},
  {label:"صفتان للمظهر على الأقل",passed:new Set(revisionWritingTokens.filter(word=>["grand","grande","petit","petite","mince","sportif","sportive","beau","belle"].includes(word))).size>=2},
  {label:"وصف الشعر أو العينين باستعمال avoir",passed:/\b(?:il|elle)\s+a\s+les\s+(?:cheveux|yeux)\b/i.test(revisionWritingText)},
  {label:"أربع صفات شخصية على الأقل",passed:new Set(revisionWritingTokens.filter(word=>["calme","gentil","gentille","sérieux","sérieuse","organisé","organisée","sociable","patient","patiente","courageux","courageuse","curieux","curieuse"].includes(word))).size>=4}
 ]:isA1DailyLife?[
  {label:"من 35 إلى 50 كلمة",passed:revisionWordCount>=35&&revisionWordCount<=50},
  {label:"ثلاثة أفعال ضميرية على الأقل",passed:(revisionWritingText.match(/\b(?:me|te|se|nous|vous)\s+[a-zà-ÿ]+/gi)??[]).length>=3},
  {label:"ظرفا تكرار مختلفان",passed:new Set(revisionWritingTokens.filter(word=>["toujours","souvent","parfois","rarement","jamais"].includes(word))).size>=2},
  {label:"ثلاثة روابط زمنية مختلفة",passed:[/\bd[’']abord\b/i,/\bpuis\b/i,/\bensuite\b/i,/\benfin\b/i].filter(pattern=>pattern.test(revisionWritingText)).length>=3},
  {label:"جملة منفية واحدة",passed:/\bn[’']?e?\s*(?:me|te|se|nous|vous)?\s*[a-zà-ÿ]+\s+(?:pas|jamais)\b/i.test(revisionWritingText)}
 ]:isA1Situations?[
  {label:"من 35 إلى 50 كلمة",passed:revisionWordCount>=35&&revisionWordCount<=50},
  {label:"صيغة دعوة واضحة",passed:/\btu\s+veux\b/i.test(revisionWritingText)||/\bça\s+te\s+dit\s+de\b/i.test(revisionWritingText)},
  {label:"يوم ووقت للقاء",passed:revisionWritingTokens.some(word=>["lundi","mardi","mercredi","jeudi","vendredi","samedi","dimanche"].includes(word))&&/\bà\s+(?:midi|minuit|\d{1,2}(?::\d{2}|\s*h(?:\d{2})?|\s+heures?)|(?:une|deux|trois|quatre|cinq|six|sept|huit|neuf|dix|onze|douze|treize|quatorze|quinze|seize|dix-sept|dix-huit|dix-neuf|vingt)\s+heures?)\b/i.test(revisionWritingText)},
  {label:"قبول أو اعتذار مهذب",passed:/\b(?:avec\s+plaisir|bonne\s+idée|désolé|désolée)\b/i.test(revisionWritingText)},
  {label:"سبب أو اقتراح بديل",passed:/\bparce\s+que\b/i.test(revisionWritingText)&&/\b(?:plutôt|on\s+peut|et\s+(?:lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche))\b/i.test(revisionWritingText)},
  {label:"مكان اللقاء",passed:/\bon\s+se\s+retrouve\b/i.test(revisionWritingText)&&/\b(?:devant|au|à\s+la|à\s+l[’'])\b/i.test(revisionWritingText)}
 ]:isA1MessagesForms?[
  {label:"من 35 إلى 50 كلمة",passed:revisionWordCount>=35&&revisionWordCount<=50},
  {label:"تحية مناسبة",passed:/^(?:\s*)(?:bonjour|salut|bonsoir)\b/i.test(revisionWritingText)},
  {label:"سبب الرسالة واضح",passed:/\b(?:je\s+vous\s+écris\s+pour|je\s+vous\s+appelle\s+pour|je\s+confirme|je\s+suis\s+désolé|je\s+suis\s+désolée)\b/i.test(revisionWritingText)},
  {label:"اليوم والوقت",passed:revisionWritingTokens.some(word=>["lundi","mardi","mercredi","jeudi","vendredi","samedi","dimanche","aujourd’hui","demain"].includes(word))&&/\bà\s+(?:midi|minuit|\d{1,2}(?::\d{2}|\s*h(?:\d{2})?|\s+heures?)|(?:une|deux|trois|quatre|cinq|six|sept|huit|neuf|dix|onze|douze|treize|quatorze|quinze|seize|dix-sept|dix-huit|dix-neuf|vingt)\s+heures?)\b/i.test(revisionWritingText)},
  {label:"مكان أو عنوان",passed:/\b(?:cabinet|bureau|gare|bibliothèque|restaurant|café|école|université|rue|avenue|boulevard|place)\b/i.test(revisionWritingText)},
  {label:"خاتمة واسم",passed:/\b(?:cordialement|merci|à\s+bientôt|à\s+demain)[,!.]?\s+[A-ZÀ-ÖØ-Ý][a-zà-ÿ-]+/i.test(revisionWritingText)}
 ]:isA2Expression?[
  {label:"من 60 إلى 80 كلمة",passed:revisionWordCount>=60&&revisionWordCount<=80},
  {label:"رأي واضح مع تعليل",passed:/\b(?:à mon avis|pour moi|je pense que|je trouve que|je crois que)\b/i.test(revisionWritingText)&&/\b(?:parce que|car|comme|grâce à|à cause de)\b/i.test(revisionWritingText)},
  {label:"مثال يوضّح الفكرة",passed:/\b(?:par exemple|comme exemple|notamment)\b/i.test(revisionWritingText)},
  {label:"اختلاف أو تحفظ مهذب",passed:/\b(?:je comprends|mais|pourtant|cependant|en revanche|je ne suis pas tout à fait d’accord)\b/i.test(revisionWritingText)},
  {label:"خاتمة وطلب مناسب",passed:/\b(?:en résumé|pour conclure|finalement)\b/i.test(revisionWritingText)&&/\b(?:pourriez-vous|serait-il possible|je voudrais|j’aimerais|j'aimerais)\b/i.test(revisionWritingText)}
 ]:isA2RealLife?[
  {label:"من 60 إلى 80 كلمة",passed:revisionWordCount>=60&&revisionWordCount<=80},
  {label:"مرجع أو تاريخ واضح",passed:/\b(?:réservation|dossier|vol|train|commande|numéro|lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche|janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)\b/i.test(revisionWritingText)},
  {label:"وصف المشكلة وأثرها",passed:/\b(?:ne fonctionne|n’est pas|n'est pas|en panne|annulé|annulée|retard|perdu|perdue|raté|abîmé|abîmée|fuite|problème)\b/i.test(revisionWritingText)&&/\b(?:donc|alors|parce que|comme|je ne peux|je n’ai pas pu|je n'ai pas pu)\b/i.test(revisionWritingText)},
  {label:"طلب حل مهذب",passed:/\b(?:pourriez-vous|serait-il possible|je voudrais|j’aimerais|j'aimerais)\b/i.test(revisionWritingText)},
  {label:"طريقة أو وقت للتواصل",passed:/\b(?:téléphone|courriel|e-mail|email|joindre|contacter|disponible|après|avant|entre)\b/i.test(revisionWritingText)}
 ]:isA2Connectors?[
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
  if(level.id==="A1"&&activeModule.id==="alphabet")return A1_ALPHABET_PRACTICE_ITEMS.map(item=>({...item,speech:[item.fr]}));
  if(level.id==="A1"&&activeModule.id==="sounds")return A1_SOUNDS_PRACTICE_ITEMS.map(item=>({...item,speech:[item.fr]}));
  if(level.id==="A1"&&activeModule.id==="greetings")return A1_GREETINGS_PRACTICE_ITEMS.map(item=>({...item,speech:[item.fr]}));
  if(level.id==="A1"&&activeModule.id==="countries-languages")return A1_COUNTRIES_PRACTICE_ITEMS.map(item=>({...item,speech:[item.fr]}));
  if(level.id==="A1"&&activeModule.id==="studies-professions")return A1_STUDIES_PRACTICE_ITEMS.map(item=>({...item,speech:[item.fr]}));
  if(level.id==="A1"&&activeModule.id==="tastes-preferences")return A1_TASTES_PRACTICE_ITEMS.map(item=>({...item,speech:[item.fr]}));
  if(level.id==="A1"&&activeModule.id==="nouns")return A1_NOUNS_PRACTICE_ITEMS.map(item=>({...item,speech:[item.fr]}));
  if(level.id==="A1"&&activeModule.id==="core-verbs")return A1_CORE_VERBS_PRACTICE_ITEMS.map(item=>({...item,speech:[item.fr]}));
  if(level.id==="A1"&&activeModule.id==="present")return A1_PRESENT_PRACTICE_ITEMS.map(item=>({...item,speech:[item.fr]}));
  if(level.id==="A1"&&activeModule.id==="numbers-time")return A1_NUMBERS_TIME_PRACTICE_ITEMS.map(item=>({...item,speech:[item.fr]}));
  if(level.id==="A1"&&activeModule.id==="daily-life")return A1_DAILY_LIFE_PRACTICE_ITEMS.map(item=>({...item,speech:[item.fr]}));
  if(level.id==="A1"&&activeModule.id==="situations")return A1_FRIENDS_PRACTICE_ITEMS.map(item=>({...item,speech:[item.fr]}));
  if(activeModule.id==="description")return DESCRIPTION_PRACTICE_ITEMS.map(item=>({fr:item.fr,ar:item.ar,speech:item.speech}));
  if(activeModule.id==="adjectives")return ADJECTIVE_PRACTICE_ITEMS.map(item=>({fr:item.fr,ar:item.ar,speech:item.speech}));
  if(level.id==="A1"&&activeModule.id==="structures")return A1_STRUCTURES_PRACTICE_ITEMS.map(item=>({...item,speech:[item.fr]}));
  if(level.id==="A1"&&activeModule.id==="city-directions")return A1_CITY_DIRECTIONS_PRACTICE_ITEMS.map(item=>({...item,speech:[item.fr]}));
  if(level.id==="A1"&&activeModule.id==="food-shopping")return A1_FOOD_SHOPPING_PRACTICE_ITEMS.map(item=>({...item,speech:[item.fr]}));
  if(level.id==="A1"&&activeModule.id==="weather-clothes")return A1_WEATHER_CLOTHES_PRACTICE_ITEMS.map(item=>({...item,speech:[item.fr]}));
  if(level.id==="A1"&&activeModule.id==="home-housing")return A1_HOME_HOUSING_PRACTICE_ITEMS.map(item=>({...item,speech:[item.fr]}));
  if(level.id==="A1"&&activeModule.id==="modal-verbs")return A1_MODAL_VERBS_PRACTICE_ITEMS.map(item=>({...item,speech:[item.fr]}));
  if(level.id==="A1"&&activeModule.id==="future-imperative")return A1_FUTURE_IMPERATIVE_PRACTICE_ITEMS.map(item=>({...item,speech:[item.fr]}));
  if(level.id==="A1"&&activeModule.id==="health-needs")return A1_HEALTH_NEEDS_PRACTICE_ITEMS.map(item=>({...item,speech:[item.fr]}));
  if(level.id==="A1"&&activeModule.id==="questions")return A1_QUESTIONS_PRACTICE_ITEMS.map(item=>({...item,speech:[item.fr]}));
  if(level.id==="A1"&&activeModule.id==="messages-forms")return A1_MESSAGES_FORMS_PRACTICE_ITEMS.map(item=>({...item,speech:[item.fr]}));
 if(level.id==="A2"&&activeModule.id==="revision")return A2_REVISION_PRACTICE_ITEMS.map(item=>({...item,speech:[item.fr]}));
 if(level.id==="A2"&&activeModule.id==="passe-compose")return A2_PASSE_COMPOSE_PRACTICE_ITEMS.map(item=>({...item,speech:[item.fr]}));
 if(level.id==="A2"&&activeModule.id==="imparfait")return A2_IMPARFAIT_PRACTICE_ITEMS.map(item=>({...item,speech:[item.fr]}));
  if(level.id==="A2"&&activeModule.id==="future")return A2_FUTURE_PRACTICE_ITEMS.map(item=>({...item,speech:[item.fr]}));
  if(level.id==="A2"&&activeModule.id==="pronouns")return A2_PRONOUNS_PRACTICE_ITEMS.map(item=>({...item,speech:[item.fr]}));
  if(level.id==="A2"&&activeModule.id==="quantity")return A2_QUANTITY_PRACTICE_ITEMS.map(item=>({...item,speech:[item.fr]}));
  if(level.id==="A2"&&activeModule.id==="comparison")return A2_COMPARISON_PRACTICE_ITEMS.map(item=>({...item,speech:[item.fr]}));
  if(level.id==="A2"&&activeModule.id==="politeness")return A2_POLITENESS_PRACTICE_ITEMS.map(item=>({...item,speech:[item.fr]}));
  if(level.id==="A2"&&activeModule.id==="connectors")return A2_CONNECTORS_PRACTICE_ITEMS.map(item=>({...item,speech:[item.fr]}));
  if(level.id==="A2"&&activeModule.id==="themes")return A2_REAL_LIFE_PRACTICE_ITEMS.map(item=>({...item,speech:[item.fr]}));
  if(level.id==="A2"&&activeModule.id==="expression")return A2_EXPRESSION_PRACTICE_ITEMS.map(item=>({...item,speech:[item.fr]}));
  return activeModule.sections.flatMap(item=>item.examples).slice(0,6).map(item=>({...item,speech:[item.fr]}));
 },[activeModule,level.id]);

 const quizQuestions=useMemo<QuizQuestion[]>(()=>{
  if(level.id==="A1"&&activeModule.id==="alphabet")return A1_ALPHABET_QUIZ_ITEMS;
  if(level.id==="A1"&&activeModule.id==="sounds")return A1_SOUNDS_QUIZ_ITEMS;
  if(level.id==="A1"&&activeModule.id==="greetings")return A1_GREETINGS_QUIZ_ITEMS;
  if(level.id==="A1"&&activeModule.id==="countries-languages")return A1_COUNTRIES_QUIZ_ITEMS;
  if(level.id==="A1"&&activeModule.id==="studies-professions")return A1_STUDIES_QUIZ_ITEMS;
  if(level.id==="A1"&&activeModule.id==="tastes-preferences")return A1_TASTES_QUIZ_ITEMS;
  if(level.id==="A1"&&activeModule.id==="nouns")return A1_NOUNS_QUIZ_ITEMS;
  if(level.id==="A1"&&activeModule.id==="core-verbs")return A1_CORE_VERBS_QUIZ_ITEMS;
  if(level.id==="A1"&&activeModule.id==="present")return A1_PRESENT_QUIZ_ITEMS;
  if(level.id==="A1"&&activeModule.id==="numbers-time")return A1_NUMBERS_TIME_QUIZ_ITEMS;
  if(level.id==="A1"&&activeModule.id==="daily-life")return A1_DAILY_LIFE_QUIZ_ITEMS;
  if(level.id==="A1"&&activeModule.id==="situations")return A1_FRIENDS_QUIZ_ITEMS;
  if(level.id==="A1"&&activeModule.id==="structures")return A1_STRUCTURES_QUIZ_ITEMS;
  if(level.id==="A1"&&activeModule.id==="city-directions")return A1_CITY_DIRECTIONS_QUIZ_ITEMS;
  if(level.id==="A1"&&activeModule.id==="food-shopping")return A1_FOOD_SHOPPING_QUIZ_ITEMS;
  if(level.id==="A1"&&activeModule.id==="weather-clothes")return A1_WEATHER_CLOTHES_QUIZ_ITEMS;
  if(level.id==="A1"&&activeModule.id==="home-housing")return A1_HOME_HOUSING_QUIZ_ITEMS;
  if(level.id==="A1"&&activeModule.id==="modal-verbs")return A1_MODAL_VERBS_QUIZ_ITEMS;
  if(level.id==="A1"&&activeModule.id==="future-imperative")return A1_FUTURE_IMPERATIVE_QUIZ_ITEMS;
  if(level.id==="A1"&&activeModule.id==="health-needs")return A1_HEALTH_NEEDS_QUIZ_ITEMS;
  if(level.id==="A1"&&activeModule.id==="questions")return A1_QUESTIONS_QUIZ_ITEMS;
  if(level.id==="A1"&&activeModule.id==="messages-forms")return A1_MESSAGES_FORMS_QUIZ_ITEMS;
  if(level.id==="A2"&&activeModule.id==="revision")return A2_REVISION_QUIZ_ITEMS;
  if(level.id==="A2"&&activeModule.id==="passe-compose")return A2_PASSE_COMPOSE_QUIZ_ITEMS;
  if(level.id==="A2"&&activeModule.id==="imparfait")return A2_IMPARFAIT_QUIZ_ITEMS;
  if(level.id==="A2"&&activeModule.id==="future")return A2_FUTURE_QUIZ_ITEMS;
  if(level.id==="A2"&&activeModule.id==="pronouns")return A2_PRONOUNS_QUIZ_ITEMS;
  if(level.id==="A2"&&activeModule.id==="quantity")return A2_QUANTITY_QUIZ_ITEMS;
  if(level.id==="A2"&&activeModule.id==="comparison")return A2_COMPARISON_QUIZ_ITEMS;
  if(level.id==="A2"&&activeModule.id==="politeness")return A2_POLITENESS_QUIZ_ITEMS;
  if(level.id==="A2"&&activeModule.id==="connectors")return A2_CONNECTORS_QUIZ_ITEMS;
  if(level.id==="A2"&&activeModule.id==="themes")return A2_REAL_LIFE_QUIZ_ITEMS;
  if(level.id==="A2"&&activeModule.id==="expression")return A2_EXPRESSION_QUIZ_ITEMS;
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
 const quizPassScore=Math.ceil(quizQuestions.length*.7);
 const quizPassed=quizFinished&&quizScore>=quizPassScore;

 useEffect(()=>{
  preparePracticeFeedbackAudio();
 },[]);

 const selectPracticeChoice=(button:HTMLButtonElement,correct:boolean,select:()=>void)=>{
  select();
  playPracticeChoiceFeedback(correct);
  const feedbackClass=correct?"practice-choice-correct":"practice-choice-wrong";
  button.classList.remove("practice-choice-correct","practice-choice-wrong");
  void button.offsetWidth;
  button.classList.add(feedbackClass);
  window.setTimeout(()=>button.classList.remove(feedbackClass),520);
 };

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
  setUsefulSentencesOpen(false);
  setRevisionBuilderIndex(0);
  setRevisionBuilderSelection([]);
  setRevisionBuilderChecked(false);
  setRevisionDialogueAnswers({});
  setRevisionWritingText("");
  setAlphabetWritingIndex(0);
  setAlphabetWritingInput("");
  setAlphabetWritingState("idle");
  setAlphabetPracticeStep(0);
  setAlphabetHighestPracticeStep(0);
  setAlphabetPracticeOpen(false);
  setAlphabetPracticeClosing(false);
  setAlphabetListeningClipIndex(0);
  setAlphabetListeningQuestionIndex(0);
  setRevisionDictationIndex(0);
  setRevisionDictationText("");
  setRevisionDictationChecked(false);
  setAlphabetWritingIndex(0);
  setAlphabetWritingInput("");
  setAlphabetWritingState("idle");
  setAlphabetListeningPlaying(false);
  setAlphabetListeningSegment(-1);
  setUsefulSentencesOpen(false);
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
  if(!isA1OrbitLesson)return;
  alphabetProgressLoadedRef.current=false;
  try{
   const saved=Number(window.localStorage.getItem(`university-a1-${activeModule.id}-practice-step`)??0);
   if(Number.isInteger(saved))setAlphabetHighestPracticeStep(Math.max(0,Math.min(ALPHABET_PRACTICE_STEPS.length-1,saved)));
  }catch{}
  setAlphabetPracticeStep(0);
  setAlphabetPracticeOpen(false);
  setRevisionListeningAnswers({});
  setAlphabetListeningClipIndex(0);
  setAlphabetListeningQuestionIndex(0);
  const readyTimer=window.setTimeout(()=>{alphabetProgressLoadedRef.current=true},0);
  return ()=>window.clearTimeout(readyTimer);
 },[activeModule.id,isA1OrbitLesson]);

 useEffect(()=>{
  if(!isA1OrbitLesson||!alphabetProgressLoadedRef.current)return;
  window.localStorage.setItem(`university-a1-${activeModule.id}-practice-step`,String(alphabetHighestPracticeStep));
 },[activeModule.id,alphabetHighestPracticeStep,isA1OrbitLesson]);

 useEffect(()=>{
  if(soundsDictationRevealTimerRef.current!==null){
   window.clearTimeout(soundsDictationRevealTimerRef.current);
   soundsDictationRevealTimerRef.current=null;
  }
  setSoundsDictationWordVisible(false);
  setSoundsDictationWritingEnabled(false);
 },[activeModule.id,revisionDictationIndex,alphabetPracticeOpen,alphabetPracticeStep]);

 useEffect(()=>()=>{
  if(soundsDictationRevealTimerRef.current!==null)window.clearTimeout(soundsDictationRevealTimerRef.current);
 },[]);

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
 const toggleJourneyPhase=(phaseIndex:number)=>{
  const willOpen=openPhaseIndex!==phaseIndex;
  setOpenPhaseIndex(willOpen?phaseIndex:-1);
  window.setTimeout(()=>{
   document.getElementById(`university-phase-node-${phaseIndex}`)?.scrollIntoView({
    behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",
    block:"start"
   });
  },willOpen?90:0);
 };
 const toggleLessonSection=(sectionIndex:number)=>{
  const willOpen=openSectionIndex!==sectionIndex;
  setOpenSectionIndex(willOpen?sectionIndex:-1);
  window.setTimeout(()=>{
   document.getElementById(`university-lesson-section-${sectionIndex}`)?.scrollIntoView({
    behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",
    block:"start"
   });
  },willOpen?90:0);
 };
 const toggleUsefulSentences=()=>{
  const willOpen=!usefulSentencesOpen;
  setUsefulSentencesOpen(willOpen);
  if(willOpen)window.setTimeout(()=>usefulSentencesRef.current?.scrollIntoView({
   behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",
   block:"start"
  }),100);
 };
 const selectAlphabetPracticeStep=(step:number)=>{
  if(alphabetPracticeClosing)return;
  const nextStep=Math.max(0,Math.min(ALPHABET_PRACTICE_STEPS.length-1,step));
  if(nextStep>alphabetHighestPracticeStep)return;
  setAlphabetPracticeStep(nextStep);
  setAlphabetPracticeOpen(true);
  if(nextStep===1)setRevisionWorkshopPanel("dictation");
  if(nextStep===2)setRevisionWorkshopPanel("builder");
  if(nextStep===3)setRevisionWorkshopPanel("dialogue");
  if(nextStep===4)setUsefulSentencesOpen(true);
  window.setTimeout(()=>practiceStageRef.current?.scrollIntoView({
   behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",
   block:"start"
  }),60);
 };
 const advanceAlphabetPractice=()=>{
  if(alphabetPracticeClosing)return;
  cancelFrenchSpeech();
  setAlphabetListeningPlaying(false);
  setAlphabetListeningSegment(-1);
  const nextStep=Math.min(ALPHABET_PRACTICE_STEPS.length-1,alphabetPracticeStep+1);
  setAlphabetPracticeClosing(true);
  window.setTimeout(()=>{
   setAlphabetHighestPracticeStep(current=>Math.max(current,nextStep));
   setAlphabetPracticeStep(nextStep);
   setAlphabetPracticeOpen(false);
   setAlphabetPracticeClosing(false);
   if(nextStep===1)setRevisionWorkshopPanel("dictation");
   if(nextStep===2)setRevisionWorkshopPanel("builder");
   if(nextStep===3)setRevisionWorkshopPanel("dialogue");
   practiceStageRef.current?.scrollIntoView({
    behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",
    block:"start"
   });
  },300);
 };
 const closeAlphabetPractice=()=>{
  if(alphabetPracticeClosing)return;
  cancelFrenchSpeech();
  setAlphabetListeningPlaying(false);
  setAlphabetListeningSegment(-1);
  setAlphabetPracticeClosing(true);
  window.setTimeout(()=>{
   setAlphabetPracticeOpen(false);
   setAlphabetPracticeClosing(false);
   practiceStageRef.current?.scrollIntoView({
    behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",
    block:"start"
   });
  },300);
 };
 const resetAlphabetPractice=()=>{
  cancelFrenchSpeech();
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
  setAlphabetWritingIndex(0);
  setAlphabetWritingInput("");
  setAlphabetWritingState("idle");
  setAlphabetListeningClipIndex(0);
  setAlphabetListeningQuestionIndex(0);
  setAlphabetListeningPlaying(false);
  setAlphabetListeningSegment(-1);
  setAlphabetPracticeStep(0);
  setAlphabetHighestPracticeStep(0);
  setAlphabetPracticeOpen(false);
  setAlphabetPracticeClosing(false);
  setUsefulSentencesOpen(false);
 };
 const activeOrbitListeningClips=isA1Sounds?A1_SOUNDS_LISTENING_CLIPS:isA1Countries?A1_COUNTRIES_LISTENING_CLIPS:isA1Studies?A1_STUDIES_LISTENING_CLIPS:isA1Tastes?A1_TASTES_LISTENING_CLIPS:ALPHABET_LISTENING_CLIPS;
 const playAlphabetOrbitClip=(rate:"slow"|"normal",clipIndex=alphabetListeningClipIndex)=>{
  const clip=activeOrbitListeningClips[clipIndex];
  if(isA1Sounds){
   setAlphabetListeningPlaying(true);
   setAlphabetListeningSegment(1);
   void speakFrench(clip.word,{
    rate:rate==="slow"?.5:.72,
    onEnd:()=>{setAlphabetListeningPlaying(false);setAlphabetListeningSegment(-1)},
    onError:()=>{setAlphabetListeningPlaying(false);setAlphabetListeningSegment(-1)}
   });
   return;
  }
  const alphabetItem=isA1Alphabet?ALPHABET.find(item=>item[0]===clip.letter):undefined;
  const letterSpeech=LETTER_SPEECH_OVERRIDES[clip.letter]??alphabetItem?.[1]??clip.letter.toLocaleLowerCase("fr");
  const speechSegments=[letterSpeech,clip.word];
  setAlphabetListeningPlaying(true);
  setAlphabetListeningSegment(0);
  void speakFrenchSequence(speechSegments,rate==="slow"?720:420,{
   rate:rate==="slow"?.58:.8,
   onEnd:()=>{setAlphabetListeningPlaying(false);setAlphabetListeningSegment(-1)},
   onError:()=>{setAlphabetListeningPlaying(false);setAlphabetListeningSegment(-1)}
   },setAlphabetListeningSegment);
 };
 const playOrbitHiddenSound=(clipIndex=alphabetListeningClipIndex)=>{
  const clip=activeOrbitListeningClips[clipIndex];
  const hiddenSpeech="hiddenSpeech" in clip&&typeof clip.hiddenSpeech==="string"?clip.hiddenSpeech:(LETTER_SPEECH_OVERRIDES[clip.letter]??clip.letter.toLocaleLowerCase("fr"));
  setAlphabetListeningPlaying(true);
  setAlphabetListeningSegment(0);
  void speakFrench(hiddenSpeech,{
   rate:.48,
   onEnd:()=>{setAlphabetListeningPlaying(false);setAlphabetListeningSegment(-1)},
   onError:()=>{setAlphabetListeningPlaying(false);setAlphabetListeningSegment(-1)}
  });
 };
 const playOrbitDictation=(slow=false)=>{
  if(isTimedOrbitWordDictation&&!soundsDictationWritingEnabled&&!soundsDictationWordVisible){
   setSoundsDictationWordVisible(true);
   soundsDictationRevealTimerRef.current=window.setTimeout(()=>{
    setSoundsDictationWordVisible(false);
    setSoundsDictationWritingEnabled(true);
    soundsDictationRevealTimerRef.current=null;
   },10000);
  }
  if(isAlphabetLetterDictation){
   return speakFrenchSequence(["Lettre",alphabetDictationPronunciation],slow?760:620,{rate:slow?.54:.62});
  }
  return speakFrench(revisionDictationItem.speech,{rate:slow?.55:.74});
 };

 return <main className={`university-world ${levelPage?"university-level-world":"university-main-world"}`} dir="rtl">
  <header className="university-topbar">
   <Link href={backHref} aria-label={lessonPage?`العودة إلى منهج ${level.id}`:levelPage?"العودة إلى مستويات الجامعة":"العودة إلى واجهة القلعة"}><ArrowRight/></Link>
   <div><span>الجامعة</span><strong>L’Université</strong></div>
   <div className="university-seal"><GraduationCap/></div>
  </header>

  {!levelPage&&<>
  <section className="university-hero">
   <img src="/university/interior-campus.jpg" alt="ردهة داخلية حديثة في جامعة"/>
   <div className="university-hero-shade"/>
   <div className="university-hero-copy">
    <span><School/> Campus académique</span>
    <h1>L’Université</h1>
    <h2>الجامعة</h2>
    <p>تعلّم الفرنسية داخل قاعات الجامعة خطوة بخطوة.</p>
    <a href="#university-levels"><BookOpen/> دخول قاعات الدراسة</a>
   </div>
  </section>

  <section className="university-intro">
   <article><Building2/><div><strong>بيئة جامعية داخلية</strong><span>قاعات، وحدات، وشروح منظمة</span></div></article>
   <article><LibraryBig/><div><strong>منهج كامل</strong><span>من A1 إلى B1</span></div></article>
   <article><Volume2/><div><strong>نطق تفاعلي</strong><span>الحروف والأمثلة بصوت فرنسي</span></div></article>
  </section>

  <section className="university-level-section" id="university-levels">
   <div className="university-section-heading">
     <span>Choisissez votre niveau</span>
     <h2>اختر مستواك</h2>
   </div>
   <div className="university-level-grid">
    {LEVELS.map(item=><button key={item.id} data-level={item.id} onClick={()=>router.push(`/university/${item.id.toLocaleLowerCase("fr")}`)}>
     <div className="university-level-code">{item.id}</div>
     <div><span>{item.label}</span><h3>{item.ar}</h3><p>{item.description}</p><small>{item.modules.length} وحدات · شرح وأمثلة ونطق</small></div>
     <ChevronLeft/>
    </button>)}
   </div>
  </section>
  </>}

  {levelPage&&!lessonPage&&<section className="university-level-entry">
   <div>
    <Link className="university-levels-visual-link" href="/university"><ArrowRight/><span>جميع المستويات</span></Link>
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
    <Link className="university-resume-visual-link" href={`/university/${level.id.toLocaleLowerCase("fr")}/${resumeModule.id}`}><Play/><span>متابعة الدرس</span></Link>
   </div>
   <div className="university-progress-card">
    <div><span>تقدمك في المستوى</span><strong>{completedModuleIds.length} من {level.modules.length} وحدات</strong></div>
    <div className="university-progress-track"><i style={{width:`${Math.round(completedModuleIds.length/level.modules.length*100)}%`}}/></div>
    <b>{Math.round(completedModuleIds.length/level.modules.length*100)}%</b>
   </div>
   <div className="university-journey-heading"><span>Parcours d’apprentissage</span><h2>رحلة تعلّم</h2><p>افتح مرحلة واحدة، ثم ادخل الدرس المطلوب.</p></div>
   <div className="university-phase-console">
    <div className="university-phase-dock" aria-label="مراحل رحلة التعلم">
     {phases.map((phase,phaseIndex)=>{
      const phaseModules=phase.moduleIds.map(id=>level.modules.find(item=>item.id===id)).filter((item):item is CourseModule=>Boolean(item));
      const phaseCompleted=phaseModules.filter(item=>completedModuleIds.includes(item.id)).length;
      const PhaseIcon=COURSE_PHASE_ICONS[level.id]?.[phaseIndex]??BookOpen;
      const isOpen=openPhaseIndex===phaseIndex;
      return <section id={`university-phase-node-${phaseIndex}`} key={phase.title} className={`university-phase-node ${isOpen?"open":""}`}>
       <button type="button" aria-expanded={isOpen} aria-controls={`university-phase-${phaseIndex}`} className={isOpen?"active":""} onClick={()=>toggleJourneyPhase(phaseIndex)}>
        <span className="university-phase-app"><PhaseIcon/><b>{String(phaseIndex+1).padStart(2,"0")}</b></span>
        <span className="university-phase-dock-copy"><strong>{phase.fr}</strong><small>{phase.title}</small></span>
        <span className="university-phase-dock-progress"><i style={{width:`${phaseModules.length?phaseCompleted/phaseModules.length*100:0}%`}}/><em>{phaseCompleted}/{phaseModules.length}</em></span>
        <ChevronDown className="university-phase-chevron"/>
       </button>
       <div className={`university-phase-workspace-shell ${isOpen?"open":""}`} aria-hidden={!isOpen} inert={!isOpen}>
       <div id={`university-phase-${phaseIndex}`} className="university-phase-workspace">
        <header>
         <div><span>Étape {String(phaseIndex+1).padStart(2,"0")}</span><h3>{phase.fr}</h3><h4>{phase.title}</h4><p>{phase.description}</p></div>
         <aside><strong>{phaseCompleted}</strong><span>من {phaseModules.length}</span><small>دروس مكتملة</small></aside>
        </header>
        <div className="university-phase-modules">
         {phaseModules.map(module=>{
          const Icon=module.icon;
          const moduleIndex=level.modules.findIndex(item=>item.id===module.id);
          const completed=completedModuleIds.includes(module.id);
          return <Link key={module.id} href={`/university/${level.id.toLocaleLowerCase("fr")}/${module.id}`}>
           <i className={completed?"completed":""}><Icon/>{completed&&<CheckCircle2 className="university-module-check"/>}</i>
           <div><small>Cours {String(moduleIndex+1).padStart(2,"0")}</small><span>{module.title}</span><strong>{module.ar}</strong></div>
           <ChevronLeft/>
          </Link>;
         })}
        </div>
       </div>
       </div>
      </section>;
     })}
    </div>
   </div>
  </section>}

  {lessonPage&&<section className={`university-course university-course-focused ${isA1Alphabet||isA1Sounds||isA1Greetings||isA1Countries||isA1Studies||isA1Tastes||isA1Nouns||isA1CoreVerbs||isA1Structures||isA1Questions||isA1Present||isA1ModalVerbs||isA1FutureImperative||isA1FoodShopping||isA1CityDirections||isA1NumbersTime||isA1WeatherClothes||isA1HomeHousing||isA1Description||isA1HealthNeeds||isA1Adjectives||isA1DailyLife||isA1Situations||isA1MessagesForms||isA2Revision||isA2PasseCompose||isA2Imparfait||isA2Future||isA2Pronouns||isA2Quantity||isA2Comparison||isA2Politeness||isA2Connectors?"university-course-revision":""}`} id="university-course">
   <aside className="university-lesson-guide">
    <Link href={`/university/${level.id.toLocaleLowerCase("fr")}`}><ArrowRight/> منهج {level.id}</Link>
    <div><span>الدرس {activeModuleIndex+1} من {level.modules.length}</span><h2>{activeModule.ar}</h2><p>{activeModule.title}</p></div>
    <nav aria-label="مراحل الدرس">
     <button className={`stage-learn ${lessonStage==="learn"?"active":""}`} onClick={()=>setLessonStage("learn")}><GraduationCap/><span><b>تعلّم</b><small>الشرح والأمثلة</small></span></button>
     <button className={`stage-practice ${lessonStage==="practice"?"active":""}`} onClick={()=>setLessonStage("practice")}><Repeat2/><span><b>تدرّب</b><small>استمع وكرّر</small></span></button>
     <button className={`stage-final ${lessonStage==="test"?"active":""}`} onClick={()=>setLessonStage("test")}><ClipboardPenLine/><span><b>{isEnhancedLesson?"التمرين النهائي":"اختبر نفسك"}</b><small>{quizQuestions.length} أسئلة ونتيجة</small></span></button>
    </nav>
   </aside>

   <article className="university-lesson" id="university-lesson">
    {(!isA1Alphabet||lessonStage==="learn")&&<header>
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
    </header>}

    {lessonStage==="learn"&&<>
    {activeModule.id==="alphabet"&&<section className="university-alphabet">
     <div className="university-subheading"><div><span>Alphabet interactif</span><h3>اضغط على الحرف لسماع نطقه</h3></div><Volume2/></div>
     <div className="university-letter-grid">
      {ALPHABET.map(([letter,pronunciation,word,meaning])=><button key={letter} className={activeLetter===letter?"active":""} aria-label={`استمع إلى الحرف ${letter} ثم كلمة ${word}`} onClick={()=>{setActiveLetter(letter);void speakFrenchSequence([LETTER_SPEECH_OVERRIDES[letter]??pronunciation,word],460,{rate:LETTER_SPEECH_RATES[letter]??.66})}}>
       <b>{letter}</b><span>{pronunciation}</span><small>{word}</small><em>{meaning}</em>
      </button>)}
     </div>
     <div className="university-letter-focus">
      <div><span>الحرف المحدد</span><b>{activeLetter}</b></div>
      <p>اضغط مرة أخرى وكرّر اسم الحرف بصوت مرتفع، ثم استمع إلى الكلمة المرتبطة به.</p>
     <button onClick={()=>{const item=ALPHABET.find(value=>value[0]===activeLetter)!;void speakFrenchSequence([LETTER_SPEECH_OVERRIDES[item[0]]??item[1],item[2]],460,{rate:LETTER_SPEECH_RATES[item[0]]??.66})}}><Play/> نطق الحرف ثم الكلمة</button>
     </div>
    </section>}

    {activeModule.id==="sounds"&&<section className="a1-sounds-learning-studio">
     <div className="a1-sounds-learning-sections">
      <details className="a1-sounds-learning-section" open>
       <summary>
        <span><i>01</i><AudioLines/></span>
        <div><strong dir="ltr">Les voyelles et les sons vocaliques</strong><b>حروف العلة والأصوات المتحركة</b><small>{A1_VOWEL_CLASSIFICATIONS.length} تصنيفات رئيسية</small></div>
        <ChevronDown/>
       </summary>
       <div className="a1-sounds-learning-section-body a1-vowel-classification-body">
        <div className="a1-vowel-section-intro">
         <div><strong dir="ltr">Les voyelles se classent selon la prononciation, le passage de l’air, la position des lèvres et le degré d’ouverture de la bouche.</strong><p>تُصنَّف حروف العلة بحسب طريقة النطق ومخرج الهواء ووضع الشفتين ودرجة فتح الفم.</p></div>
        </div>
        <div className="a1-vowel-classifications">
         {A1_VOWEL_CLASSIFICATIONS.map((classification,classificationIndex)=><details key={classification.fr} className="a1-vowel-classification" open={classificationIndex===0}>
          <summary><span><i>{String(classificationIndex+1).padStart(2,"0")}</i><strong dir="ltr">{classification.fr}</strong><b>{classification.ar}</b></span><ChevronDown/></summary>
          <div className="a1-vowel-classification-content">
           <div className="a1-vowel-bilingual-explanation"><div><p>{classification.explanation}</p><small dir="ltr">{classification.frExplanation}</small></div><button type="button" onClick={()=>void speakFrench(`${classification.fr}. ${classification.frExplanation}`,{rate:.68})} aria-label={`استمع إلى ${classification.fr}`}><Volume2/></button></div>
           <div className="a1-vowel-branches">
            {classification.branches.map(branch=><details key={branch.fr} className="a1-vowel-branch">
             <summary><span><strong dir="ltr">{branch.fr}</strong><b>{branch.ar}</b></span><ChevronDown/></summary>
             <div className="a1-vowel-branch-content">
              <div><p>{branch.explanation}</p><small dir="ltr">{branch.frExplanation}</small></div>
              <button type="button" onClick={()=>void speakFrench(`${branch.fr}. ${branch.frExplanation}`,{rate:.66})} aria-label={`استمع إلى ${branch.fr}`}><Volume2/><span>نطق الشرح</span></button>
              {branch.table&&(()=>{
               const tableKind=branch.table;
               const examples=A1_VOWEL_TABLES[tableKind];
               const currentIndex=vowelCardIndex[tableKind];
               const example=examples[currentIndex];
               const moveCard=(direction:-1|1)=>setVowelCardIndex(current=>({...current,[tableKind]:(current[tableKind]+direction+examples.length)%examples.length}));
               return <div className={`a1-vowel-example-table ${tableKind}`} role="region" aria-label={`بطاقات ${branch.ar}`}>
               <div className="a1-vowel-example-table-title">
                <div><span dir="ltr">Tableau phonétique illustré</span><strong>الأصوات داخل كلمات واضحة</strong></div>
                <Layers3/>
               </div>
               <div className="a1-vowel-carousel-stage">
                <article key={`${tableKind}-${example.word}`} className="a1-vowel-example-row">
                 <button type="button" className="a1-vowel-example-image" onClick={()=>void speakFrench(example.word,{rate:.74})} aria-label={`استمع إلى نطق ${example.word}`}>
                  <img src={example.image} alt={`صورة توضيحية لكلمة ${example.word}`} loading="lazy"/>
                  <span><Volume2/> اضغط للنطق</span>
                 </button>
                 <div className="a1-vowel-example-identity">
                  <span className="a1-vowel-phoneme" dir="ltr">{example.phoneme}</span>
                  <strong dir="ltr">{example.parts[0]}<mark>{example.parts[1]}</mark>{example.parts[2]}</strong>
                  <span dir="ltr">{example.ipa}</span>
                  <b>{example.ar}</b>
                  <em dir="ltr">{example.focus}</em>
                 </div>
                 <p>{example.explanation}</p>
                 <div className="a1-vowel-example-audio">
                  <button type="button" onClick={()=>void speakFrench(example.word,{rate:.38})}><AudioLines/><span><b>نطق بطيء</b><small>Lentement</small></span></button>
                 </div>
                </article>
               </div>
               <div className="a1-vowel-carousel-navigation" dir="ltr">
                <button type="button" onClick={()=>moveCard(-1)} aria-label="المثال السابق"><ChevronLeft/></button>
                <div className="a1-vowel-carousel-progress" aria-label={`المثال ${currentIndex+1} من ${examples.length}`}>
                 <strong>{currentIndex+1}</strong><span>/</span><b>{examples.length}</b>
                 <div>{examples.map((item,index)=><button key={item.word} type="button" className={index===currentIndex?"active":""} onClick={()=>setVowelCardIndex(current=>({...current,[tableKind]:index}))} aria-label={`افتح مثال ${item.word}`}/>)}</div>
                </div>
                <button type="button" onClick={()=>moveCard(1)} aria-label="المثال التالي"><ChevronRight/></button>
               </div>
              </div>})()}
             </div>
            </details>)}
           </div>
          </div>
         </details>)}
        </div>
       </div>
      </details>
      {A1_SOUNDS_LEARNING_SECTIONS.map((sectionItem,sectionIndex)=><details key={sectionItem.fr} className="a1-sounds-learning-section">
       <summary>
        <span><i>{String(sectionIndex+2).padStart(2,"0")}</i><AudioLines/></span>
        <div><strong dir="ltr">{sectionItem.fr}</strong><b>{sectionItem.ar}</b><small>{sectionItem.groups.length} فروع تعليمية</small></div>
        <ChevronDown/>
       </summary>
       <div className="a1-sounds-learning-section-body a1-vowel-classification-body">
        <div className="a1-vowel-section-intro">
         <div><strong dir="ltr">{sectionItem.frIntro}</strong><p>{sectionItem.intro}</p></div>
        </div>
        <div className="a1-vowel-classifications">
         {sectionItem.groups.map((group,groupIndex)=><details key={group.fr} className="a1-vowel-classification" open={groupIndex===0}>
          <summary><span><i>{String(groupIndex+1).padStart(2,"0")}</i><strong dir="ltr">{group.fr}</strong><b>{group.ar}</b></span><ChevronDown/></summary>
          <div className="a1-vowel-classification-content">
           <div className="a1-vowel-bilingual-explanation">
            <div><p>{group.note}</p><small dir="ltr">{group.frNote}</small></div>
            <button type="button" onClick={()=>void speakFrench(`${group.fr}. ${group.frNote}`,{rate:.66})} aria-label={`استمع إلى ${group.fr}`}><Volume2/></button>
           </div>
           {(()=>{
            const currentIndex=soundGroupCardIndex[group.fr]??0;
            const example=group.examples[currentIndex];
            const moveCard=(direction:-1|1)=>setSoundGroupCardIndex(current=>({...current,[group.fr]:(currentIndex+direction+group.examples.length)%group.examples.length}));
            return <div className="a1-vowel-example-table sound-combination" role="region" aria-label={`بطاقات ${group.ar}`}>
             <div className="a1-vowel-example-table-title">
              <div><span dir="ltr">Tableau phonétique illustré</span><strong>الأصوات داخل كلمات واضحة</strong></div>
              <Layers3/>
             </div>
             <div className="a1-vowel-carousel-stage">
              <article key={`${group.fr}-${example.word}`} className="a1-vowel-example-row">
               <button type="button" className="a1-vowel-example-image" onClick={()=>void speakFrench(example.word,{rate:.74})} aria-label={`استمع إلى نطق ${example.word}`}>
                <img src={example.image} alt={`صورة توضيحية لكلمة ${example.word}`} loading="lazy"/>
                <span><Volume2/> اضغط للنطق</span>
               </button>
               <div className="a1-vowel-example-identity">
                <span className="a1-vowel-phoneme" dir="ltr">{example.phoneme}</span>
                <strong dir="ltr">{example.parts[0]}<mark>{example.parts[1]}</mark>{example.parts[2]}</strong>
                <span dir="ltr">{example.ipa}</span>
                <b>{example.ar}</b>
                <em dir="ltr">{example.focus}</em>
               </div>
               <p>{example.rule}</p>
               <div className="a1-vowel-example-audio">
                <button type="button" onClick={()=>void speakFrench(example.word,{rate:.38})}><AudioLines/><span><b>نطق بطيء</b><small>Lentement</small></span></button>
               </div>
              </article>
             </div>
             <div className="a1-vowel-carousel-navigation" dir="ltr">
              <button type="button" onClick={()=>moveCard(-1)} aria-label="المثال السابق"><ChevronLeft/></button>
              <div className="a1-vowel-carousel-progress" aria-label={`المثال ${currentIndex+1} من ${group.examples.length}`}>
               <strong>{currentIndex+1}</strong><span>/</span><b>{group.examples.length}</b>
               <div>{group.examples.map((item,index)=><button key={item.word} type="button" className={index===currentIndex?"active":""} onClick={()=>setSoundGroupCardIndex(current=>({...current,[group.fr]:index}))} aria-label={`افتح مثال ${item.word}`}/>)}</div>
              </div>
              <button type="button" onClick={()=>moveCard(1)} aria-label="المثال التالي"><ChevronRight/></button>
             </div>
            </div>;
           })()}
          </div>
         </details>)}
        </div>
       </div>
      </details>)}
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

    {activeModule.id!=="sounds"&&<div className="university-sections">
     {activeModule.sections.map((item,index)=>{const SectionIcon=activeModule.id==="revision"?REVISION_SECTION_ICONS[index]:undefined;const isOpen=openSectionIndex===index;return <section id={`university-lesson-section-${index}`} key={item.title} className={`university-explanation ${isOpen?"open":""}`}>
      <div className="university-explanation-title">
       <button className="university-section-toggle" onClick={()=>toggleLessonSection(index)} aria-expanded={isOpen} aria-controls={`university-lesson-section-body-${index}`}>
        <span>{SectionIcon?<SectionIcon/>:String(index+1).padStart(2,"0")}{SectionIcon&&<b>{String(index+1).padStart(2,"0")}</b>}</span>
        <div><h3>{item.title}</h3><small>{item.subtitle}</small></div>
        <ChevronDown/>
       </button>
       <button onClick={()=>void speakFrench(item.title)} aria-label={`استمع إلى ${item.title}`}><Volume2/><b>نطق العنوان</b></button>
      </div>
      <div className={`university-explanation-body-shell ${isOpen?"open":""}`} aria-hidden={!isOpen} inert={!isOpen}>
      <div id={`university-lesson-section-body-${index}`} className="university-explanation-body">
       <p className="university-explanation-text">{item.explanation}</p>
       <div className="university-rule-list">{item.points.map(point=><p key={point}><i>✓</i>{point}</p>)}</div>
       <div className="university-example-list">
        <h4><MessageCircle/> Exemples expliqués</h4>
        {item.examples.map(example=><article key={example.fr}>
         <button onClick={()=>void (isA1Alphabet?playAlphabetLearningText(example.fr):speakFrench(example.fr))} aria-label={`استمع إلى ${example.fr}`}><Volume2/><b>استمع</b></button>
         <div><strong dir="ltr">{example.fr}</strong><span>{example.ar}</span></div>
        </article>)}
       </div>
      </div>
      </div>
     </section>})}
    </div>}
    {isEnhancedLesson&&<section className="a2-reading-workshop">
     <div className="university-stage-heading"><BookOpen/><div><span>Lire et comprendre</span><h3>قراءة موجهة</h3><p>اقرأ النص أولًا دون ترجمة، ثم أجب عن الأسئلة واكشف الحل بعد المحاولة.</p></div></div>
     <article className="a2-reading-text">
      <header><div><small>Texte {level.id}</small><h4>{activeA2Reading.title}</h4><span>{activeA2Reading.arTitle}</span></div><button onClick={()=>void speakFrench(activeA2Reading.text,{rate:isA1Alphabet?.78:isEnhancedA1Lesson?.68:.76})}><Volume2/> استمع إلى النص</button></header>
      {isA1Alphabet?<div className="a1-reading-sentence-icons" dir="ltr">{(activeA2Reading.text.match(/[^.!?]+[.!?]+|[^.!?]+$/g)??[activeA2Reading.text]).map((sentence,index)=><button type="button" key={`${sentence}-${index}`} onClick={()=>void speakFrench(sentence.trim(),{rate:.78})} aria-label={`استمع إلى الجملة ${index+1}`}><i>{index+1}</i><span>{sentence.trim()}</span><Volume2/></button>)}</div>:<p dir="ltr">{activeA2Reading.text}</p>}
      <details><summary>عرض الترجمة بعد المحاولة</summary><p>{activeA2Reading.translation}</p></details>
     </article>
     <div className="a2-reading-questions">
      {activeA2Reading.questions.map((item,index)=><article key={item.question}><span>{index+1}</span><div><strong dir="ltr">{item.question}</strong>{"translation" in item&&typeof item.translation==="string"&&<p className="university-question-translation">{item.translation}</p>}<details><summary>تحقق من إجابتك</summary><p dir="ltr">{item.answer}</p><small>{item.ar}</small></details></div><button onClick={()=>void speakFrench(item.question,{rate:.76})} aria-label={`استمع إلى السؤال ${index+1}`}><Volume2/></button></article>)}
     </div>
    </section>}
    </>}

    {lessonStage==="practice"&&<section ref={practiceStageRef} className={`university-practice-stage ${alphabetPracticeClosing?"a1-orbit-panel-closing":""}`} style={isA1OrbitLesson?{"--practice-origin-x":ALPHABET_PRACTICE_ORIGINS[alphabetPracticeStep][0],"--practice-origin-y":ALPHABET_PRACTICE_ORIGINS[alphabetPracticeStep][1]} as CSSProperties:undefined}>
     {!isA1OrbitLesson&&<div className="university-stage-heading"><Headphones/><div><span>Écouter et répéter</span><h3>استمع ثم كرّر</h3><p>استمع إلى الفرنسية، كرّرها بصوت مرتفع، واقرأ المعنى العربي عند الحاجة.</p></div></div>}
     {isA1OrbitLesson&&<section className={`a1-orbit-map ${alphabetPracticeOpen?"activity-open":""} ${alphabetPracticeOpen&&alphabetPracticeStep===0?"listening-open":""}`} aria-label="خريطة مراحل التدريب">
      <header><button type="button" className="a1-orbit-reset" onClick={resetAlphabetPractice} aria-label="إعادة جميع تمارين الخريطة من البداية" title="إعادة التمارين"><RotateCcw/></button><span>{ALPHABET_PRACTICE_STEPS[alphabetPracticeStep]}</span><strong>{alphabetPracticeStep+1} / {ALPHABET_PRACTICE_STEPS.length}</strong></header>
      <div className="a1-orbit-stage">
       <i className="orbit-ring ring-one"/><i className="orbit-ring ring-two"/><i className="orbit-ring ring-three"/>
       <button type="button" className={`a1-orbit-core ${alphabetPracticeOpen?"open":""}`} onClick={()=>selectAlphabetPracticeStep(alphabetPracticeStep)}><Orbit/><b>تدرّب</b><small>{ALPHABET_PRACTICE_STEPS[alphabetPracticeStep]}</small></button>
       {ALPHABET_PRACTICE_STEPS.map((step,index)=>{const StepIcon=ALPHABET_PRACTICE_ICONS[index];const angle=index*60-90;const locked=index>alphabetHighestPracticeStep;const completed=index<alphabetHighestPracticeStep&&index!==alphabetPracticeStep;return <div key={step} className="a1-orbit-node-position" style={{"--orbit-angle":`${angle}deg`,"--orbit-angle-inverse":`${-angle}deg`} as CSSProperties}><button type="button" className={`a1-orbit-node ${alphabetPracticeStep===index?"active":""} ${completed?"completed":""} ${locked?"locked":""}`} onClick={()=>selectAlphabetPracticeStep(index)} disabled={locked} aria-current={alphabetPracticeStep===index?"step":undefined} aria-label={`${step}${locked?" — لم تُفتح بعد":""}`}><span>{completed?<CheckCircle2/>:<StepIcon/>}</span><b>{step}</b><small>{locked?"مغلقة":alphabetPracticeStep===index?"ابدأ الآن":"مكتملة"}</small></button></div>})}
      </div>
      {alphabetPracticeOpen&&alphabetPracticeStep===0&&(()=>{const clip=activeOrbitListeningClips[alphabetListeningClipIndex];const question=activeA2Listening.questions[alphabetListeningQuestionIndex];const selected=revisionListeningAnswers[alphabetListeningQuestionIndex];const answeredCorrectly=selected===question.correctIndex;const correctCount=activeA2Listening.questions.reduce((total,item,index)=>total+(revisionListeningAnswers[index]===item.correctIndex?1:0),0);return <section className={`a1-orbit-listening-overlay ${isA1Sounds?"sounds-listening":""}`} aria-label="تدريب الاستماع الذكي">
       <header><div className="a1-listening-title"><i><Headphones/></i><div><span>{isA1Sounds?"Écoute phonétique":"Écoute intelligente"}</span><h3>استمع</h3></div></div><button type="button" onClick={closeAlphabetPractice} aria-label="العودة إلى خريطة التدريب"><ChevronRight/></button></header>
       <div className="a1-smart-audio-card">
        <div className={`a1-smart-audio-segments ${answeredCorrectly?"revealed":"concealed"}`} dir="ltr">
         <strong className={alphabetListeningSegment===0?"speaking":""}>{answeredCorrectly?clip.letter:<span><Headphones/><small>{isA1Sounds?"استمع إلى الصوت":"الحرف مخفي"}</small></span>}</strong>
         <strong className={alphabetListeningSegment===1?"speaking":""}>{answeredCorrectly?clip.word:<span><AudioLines/><small>الكلمة مخفية</small></span>}</strong>
        </div>
        <small>{answeredCorrectly?clip.ar:"استمع إلى الصوت، ثم اختر الإجابة الصحيحة لتظهر الكلمة."}</small>
        <div className={`a1-smart-wave ${alphabetListeningPlaying?"playing":""}`} aria-hidden="true">{Array.from({length:19},(_,index)=><i key={index} style={{"--wave-index":index} as CSSProperties}/>)}</div>
        <div className="a1-smart-audio-actions">{answeredCorrectly?<><button type="button" onClick={()=>playAlphabetOrbitClip("slow")}><span><AudioLines/></span><div><b>بطيء</b><small>نطق تعليمي</small></div></button><button type="button" className="primary" onClick={()=>playAlphabetOrbitClip("normal")}><span><Headphones/></span><div><b>استمع</b><small>نطق طبيعي</small></div></button></>:<button type="button" className="primary" onClick={()=>playOrbitHiddenSound()}><span><Headphones/></span><div><b>استمع إلى الصوت</b><small>الصوت المستهدف فقط</small></div></button>}</div>
        <nav aria-label="المقاطع الصوتية">{activeOrbitListeningClips.map((item,index)=><button type="button" key={`${item.letter}-${item.word}-${index}`} className={alphabetListeningQuestionIndex===index?"active":""} onClick={()=>{cancelFrenchSpeech();setAlphabetListeningQuestionIndex(index);setAlphabetListeningClipIndex(index);setAlphabetListeningPlaying(false);setAlphabetListeningSegment(-1)}} aria-label={`الانتقال إلى المقطع ${index+1}`}>{index+1}</button>)}</nav>
       </div>
       {answeredCorrectly?<details className="a1-smart-transcript"><summary>إظهار النص</summary><p dir="ltr">{clip.letter} — {clip.word}</p></details>:<div className="a1-smart-transcript-locked"><EyeOff/> إظهار النص بعد الإجابة الصحيحة</div>}
        <article key={alphabetListeningQuestionIndex} className="a1-smart-question">
        <div><span>السؤال {alphabetListeningQuestionIndex+1} من {activeA2Listening.questions.length}</span><b>{Math.round(correctCount/activeA2Listening.questions.length*100)}%</b></div>
        <div className="a1-smart-question-prompt"><strong dir="ltr">{question.prompt}</strong><button type="button" onClick={()=>void speakFrench("speech" in question&&typeof question.speech==="string"?question.speech:alphabetNaturalSpeechText(question.prompt),{rate:.72})} aria-label="الاستماع إلى السؤال الفرنسي" title="الاستماع إلى السؤال"><Volume2/><span>استمع للسؤال</span></button></div>
        {"translation" in question&&typeof question.translation==="string"&&<p className="university-question-translation">{question.translation}</p>}
        <div className="a1-smart-choices" dir="ltr">{question.choices.map((choice,choiceIndex)=>{const correct=choiceIndex===question.correctIndex;return <button type="button" key={choice} disabled={answeredCorrectly} className={selected===choiceIndex?(correct?"correct":"wrong"):""} onClick={event=>selectPracticeChoice(event.currentTarget,correct,()=>{setRevisionListeningAnswers(current=>({...current,[alphabetListeningQuestionIndex]:choiceIndex}));if(correct)window.setTimeout(()=>playAlphabetOrbitClip("slow",alphabetListeningQuestionIndex),620)})}><span>{String.fromCharCode(65+choiceIndex)}</span>{choice}</button>})}</div>
        {typeof selected==="number"&&<p className={selected===question.correctIndex?"correct":"wrong"}>{selected===question.correctIndex?"إجابة صحيحة":"استمع مرة أخرى ثم حاول."}</p>}
        {answeredCorrectly&&"explanationAr" in question&&typeof question.explanationAr==="string"&&<div className="a1-smart-answer-explanation"><p>{question.explanationAr}</p>{"explanationFr" in question&&typeof question.explanationFr==="string"&&<small dir="ltr">{question.explanationFr}</small>}</div>}
        {alphabetListeningQuestionIndex<activeA2Listening.questions.length-1&&<button type="button" className="a1-smart-next-question" disabled={!answeredCorrectly} onClick={()=>{const nextIndex=alphabetListeningQuestionIndex+1;cancelFrenchSpeech();setAlphabetListeningQuestionIndex(nextIndex);setAlphabetListeningClipIndex(nextIndex);setAlphabetListeningPlaying(false);setAlphabetListeningSegment(-1)}}>السؤال التالي <ChevronLeft/></button>}
       </article>
       <footer><button type="button" onClick={advanceAlphabetPractice} disabled={correctCount<activeA2Listening.questions.length}><CheckCircle2/> إنهاء الاستماع والعودة إلى الخريطة</button></footer>
      </section>})()}
      <p>{alphabetPracticeOpen&&alphabetPracticeStep===0?"نشاط الاستماع مفتوح داخل الخريطة.":alphabetPracticeOpen?"النشاط الحالي مفتوح.":"اضغط على المرحلة المضيئة أو على مركز الدائرة لبدء التدريب."}</p>
     </section>}
     {(!isA1OrbitLesson||(alphabetPracticeOpen&&alphabetPracticeStep!==0))&&<div className={isA1OrbitLesson?"a1-orbit-activity-overlay":"university-practice-content"}>
     {isA1OrbitLesson&&<header className="a1-orbit-activity-header"><button type="button" onClick={closeAlphabetPractice} aria-label="العودة إلى خريطة التدريب"><ChevronRight/></button><div><span>{["","Dictée intelligente","Construction guidée","Dialogue intelligent","Phrases utiles","Écriture guidée"][alphabetPracticeStep]}</span><h3>{ALPHABET_PRACTICE_STEPS[alphabetPracticeStep]}</h3></div><strong>{alphabetPracticeStep+1} / {ALPHABET_PRACTICE_STEPS.length}</strong></header>}
     {isEnhancedLesson&&(!isA1OrbitLesson||alphabetPracticeStep===0)&&<section className="a2-listening-lab a1-practice-step-panel">
      <header><div><span>Compréhension orale</span><h3>اختبار استماع بنص مخفي</h3><p>استمع مرتين، ثم أجب دون قراءة النص. يمكنك كشف النص بعد إنهاء المحاولة.</p></div><button onClick={()=>void (isA1Alphabet?speakFrenchSequence(["A","comme","ami","B","comme","bateau","C","comme","café","D","comme","dimanche","E","comme","école"],460,{rate:.62}):speakFrench(activeA2Listening.text,{rate:isEnhancedA1Lesson?.66:.72}))}><Headphones/> {isA1Alphabet?"تشغيل المقطع الصوتي":"تشغيل المقطع الفرنسي"}</button></header>
      {isA1Alphabet&&<details className="a2-listening-transcript"><summary>إظهار النص</summary><h4>{activeA2Listening.title}</h4><p dir="ltr">{activeA2Listening.text}</p></details>}
      <div className="a2-listening-questions">
       {activeA2Listening.questions.map((question,index)=>{
        const selected=revisionListeningAnswers[index];
        return <article key={question.prompt}>
         <div><i>{index+1}</i><div><strong dir="ltr">{question.prompt}</strong>{"translation" in question&&typeof question.translation==="string"&&<p className="university-question-translation">{question.translation}</p>}</div><button onClick={()=>void speakFrench(question.prompt,{rate:.74})} aria-label={`استمع إلى سؤال الاستماع ${index+1}`}><Volume2/></button></div>
         <div className="a2-listening-choices" dir="ltr">{question.choices.map((choice,choiceIndex)=><button key={choice} className={selected===choiceIndex?(choiceIndex===question.correctIndex?"correct":"wrong"):""} onClick={event=>selectPracticeChoice(event.currentTarget,choiceIndex===question.correctIndex,()=>setRevisionListeningAnswers(current=>({...current,[index]:choiceIndex})))}><span>{String.fromCharCode(65+choiceIndex)}</span>{choice}</button>)}</div>
         {typeof selected==="number"&&<small className={selected===question.correctIndex?"correct":"wrong"}>{selected===question.correctIndex?"إجابة صحيحة":"حاول مرة أخرى واستمع إلى المقطع"}</small>}
        </article>;
       })}
      </div>
      {!isA1Alphabet&&<details className="a2-listening-transcript"><summary>إظهار النص الفرنسي بعد المحاولة</summary><h4>{activeA2Listening.title}</h4><p dir="ltr">{activeA2Listening.text}</p></details>}
     </section>}
     {isEnhancedLesson&&(!isA1OrbitLesson||(alphabetPracticeStep>=1&&alphabetPracticeStep<=3))&&<section className="a2-interactive-workshop a1-practice-step-panel">
      <header><span>{isA1OrbitLesson?["Dictée","Construire","Réagir"][alphabetPracticeStep-1]:"Exercice pratique"}</span><h3>{isA1OrbitLesson?ALPHABET_PRACTICE_STEPS[alphabetPracticeStep]:"تمرين تطبيقي"}</h3><p>{isA1OrbitLesson?"أكمل النشاط الحالي، ثم انتقل إلى الخطوة التالية.":"ثلاثة أنشطة قصيرة تنقل القاعدة من الفهم إلى الاستخدام."}</p></header>
      {!isA1OrbitLesson&&<nav aria-label="أنشطة التمرين التطبيقي">
       <button className={revisionWorkshopPanel==="dictation"?"active":""} onClick={()=>setRevisionWorkshopPanel("dictation")}><Headphones/><span><strong>إملاء صوتي</strong><small>Écouter et écrire</small></span></button>
       <button className={revisionWorkshopPanel==="builder"?"active":""} onClick={()=>setRevisionWorkshopPanel("builder")}><NotebookTabs/><span><strong>بناء الجملة</strong><small>Construire</small></span></button>
       <button className={revisionWorkshopPanel==="dialogue"?"active":""} onClick={()=>setRevisionWorkshopPanel("dialogue")}><MessageCircle/><span><strong>حوار تفاعلي</strong><small>Réagir</small></span></button>
      </nav>}
      {(!isA1OrbitLesson?revisionWorkshopPanel==="dictation":alphabetPracticeStep===1)&&<article className="a2-dictation-panel">
       <div className="a2-workshop-progress"><span>{dictationUnit} {revisionDictationIndex+1} من {activeA2Dictation.length}</span><i><b style={{width:`${(revisionDictationIndex+1)/activeA2Dictation.length*100}%`}}/></i></div>
       <h4>استمع ثم اكتب {dictationUnit}</h4><p className={isTimedOrbitWordDictation?"a1-sounds-dictation-instruction":undefined}>{isTimedOrbitWordDictation?"اضغط على استمع لسماع النطق ثم اكتب دون ظهور الكلمة":"يمكنك إعادة الصوت، ولا تظهر الإجابة المكتوبة إلا بعد التحقق."}</p>
       {isA1OrbitLesson?<div className="a1-dictation-audio-actions"><button type="button" onClick={()=>void playOrbitDictation(false)}><Headphones/><span><b>استمع</b><small>نطق طبيعي</small></span></button><button type="button" onClick={()=>void playOrbitDictation(true)}><Gauge/><span><b>بطيء</b><small>نطق تعليمي</small></span></button></div>:<button className="a2-workshop-audio" onClick={()=>void speakFrench(revisionDictationItem.speech,{rate:isEnhancedA1Lesson?.64:.7})}><Volume2/> استمع إلى {dictationUnit}</button>}
       {isTimedOrbitWordDictation&&soundsDictationWordVisible&&<strong className="a1-sounds-dictation-preview" dir="ltr">{revisionDictationItem.speech}</strong>}
       <input dir="ltr" value={revisionDictationText} disabled={isTimedOrbitWordDictation&&!soundsDictationWritingEnabled} onChange={event=>{setRevisionDictationText(event.target.value);setRevisionDictationChecked(false)}} placeholder={isTimedOrbitWordDictation&&!soundsDictationWritingEnabled?"استمع أولًا…":dictationPlaceholder} aria-label={`اكتب ${dictationUnit} الذي سمعته`}/>
       <div className="a2-workshop-actions"><button onClick={()=>setRevisionDictationChecked(true)} disabled={!revisionDictationText.trim()||(isTimedOrbitWordDictation&&!soundsDictationWritingEnabled)}><CheckCircle2/> تحقق</button>{revisionDictationIndex<activeA2Dictation.length-1&&<button className="secondary" disabled={isA1OrbitLesson&&!revisionDictationCorrect} onClick={()=>{setRevisionDictationIndex(index=>index+1);setRevisionDictationText("");setRevisionDictationChecked(false)}}>التالي <ChevronLeft/></button>}</div>
       {revisionDictationChecked&&<div className={`a2-workshop-feedback ${revisionDictationCorrect?"correct":"wrong"}`}><strong>{revisionDictationCorrect?"ممتاز، كتبتها بصورة صحيحة.":isA1OrbitLesson?"الكتابة غير صحيحة؛ أعد الاستماع ثم حاول مرة أخرى.":"راجع كتابتك وقارنها بالنموذج."}</strong>{(!isA1OrbitLesson||revisionDictationCorrect)&&<><p dir="ltr">{revisionDictationItem.speech}</p><small>{revisionDictationItem.ar}</small></>}</div>}
      </article>}
      {(!isA1OrbitLesson?revisionWorkshopPanel==="builder":alphabetPracticeStep===2)&&<article className="a2-builder-panel">
       <div className="a2-workshop-progress"><span>الجملة {revisionBuilderIndex+1} من {activeA2Builders.length}</span><i><b style={{width:`${(revisionBuilderIndex+1)/activeA2Builders.length*100}%`}}/></i></div>
       <h4>رتّب الكلمات لتكوين جملة صحيحة</h4><p>{revisionBuilderItem.ar}</p>
       <div className="a2-built-sentence" dir="ltr">{revisionBuilderWords.length?revisionBuilderSelection.map((tokenIndex,position)=><button key={`${tokenIndex}-${position}`} onClick={()=>{setRevisionBuilderSelection(current=>current.filter((_,itemIndex)=>itemIndex!==position));setRevisionBuilderChecked(false)}}>{revisionBuilderItem.tokens[tokenIndex]}</button>):<span>اضغط على الكلمات بالترتيب…</span>}</div>
       <div className="a2-word-bank" dir="ltr">{revisionBuilderItem.tokens.map((token,index)=><button key={`${token}-${index}`} disabled={revisionBuilderSelection.includes(index)} onClick={()=>{setRevisionBuilderSelection(current=>[...current,index]);setRevisionBuilderChecked(false)}}>{token}</button>)}</div>
       <div className={`a2-workshop-actions ${isA1Sounds?"a1-sounds-builder-actions":""}`}><button onClick={()=>setRevisionBuilderChecked(true)} disabled={revisionBuilderSelection.length!==revisionBuilderItem.tokens.length}><CheckCircle2/> تحقق</button><button className="secondary" onClick={()=>{setRevisionBuilderSelection([]);setRevisionBuilderChecked(false)}}><RotateCcw/> ابدأ من جديد</button>{isA1Sounds?<button className="secondary a1-builder-next" disabled={!revisionBuilderCorrect} onClick={()=>{if(revisionBuilderIndex===activeA2Builders.length-1){advanceAlphabetPractice();return}setRevisionBuilderIndex(index=>index+1);setRevisionBuilderSelection([]);setRevisionBuilderChecked(false)}}>{revisionBuilderIndex===activeA2Builders.length-1?<>إنهاء بناء الجمل <Orbit/></>:<>الجملة التالية <ChevronLeft/></>}</button>:revisionBuilderIndex<activeA2Builders.length-1&&<button className="secondary" disabled={isA1OrbitLesson&&!revisionBuilderCorrect} onClick={()=>{setRevisionBuilderIndex(index=>index+1);setRevisionBuilderSelection([]);setRevisionBuilderChecked(false)}}>الجملة التالية <ChevronLeft/></button>}</div>
       {revisionBuilderChecked&&<div className={`a2-workshop-feedback ${revisionBuilderCorrect?"correct":"wrong"} ${isA1Sounds&&revisionBuilderCorrect?"a1-sounds-builder-feedback":""}`}><strong>{revisionBuilderCorrect?"ترتيب صحيح.":"الترتيب يحتاج إلى مراجعة دون كشف الحل."}</strong>{revisionBuilderCorrect&&isA1Sounds&&"soundNotes" in revisionBuilderItem&&Array.isArray(revisionBuilderItem.soundNotes)&&<div className="a1-sounds-builder-explanation"><header><div><b dir="ltr">{revisionBuilderItem.answer.join(" ")}</b><span>{revisionBuilderItem.ar}</span></div><button type="button" onClick={()=>void speakFrench(revisionBuilderItem.answer.join(" "),{rate:.7})} aria-label="استمع إلى الجملة الصحيحة"><Volume2/> استمع</button></header><ul>{revisionBuilderItem.soundNotes.map(note=><li key={`${note.word}-${note.detail}`}><b dir="ltr">{note.word}</b><span dir="ltr">{note.detail}</span></li>)}</ul></div>}{!revisionBuilderCorrect&&!isA1Sounds&&<p dir="ltr">{revisionBuilderItem.answer.join(" ")}</p>}</div>}
      </article>}
      {(!isA1OrbitLesson?revisionWorkshopPanel==="dialogue":alphabetPracticeStep===3)&&<div className="a2-dialogue-panel">
       {activeA2Dialogues.map((dialogue,index)=>{const selected=revisionDialogueAnswers[index];return <article key={dialogue.context}><div className="a2-dialogue-context"><i>{index+1}</i><div><strong dir="ltr">{dialogue.context}</strong>{"translation" in dialogue&&typeof dialogue.translation==="string"&&<small className="university-question-translation">{dialogue.translation}</small>}<span>{dialogue.prompt}</span></div><button onClick={()=>void speakFrench(isA1OrbitLesson?dialogue.context:dialogue.context.replace(/^.*?«|»$/g,""),{rate:.72})} aria-label={`استمع إلى الموقف ${index+1}`}><Volume2/></button></div><div className="a2-dialogue-choices" dir="ltr">{dialogue.choices.map((choice,choiceIndex)=><button key={choice} className={selected===choiceIndex?(choiceIndex===dialogue.correctIndex?"correct":"wrong"):""} onClick={event=>selectPracticeChoice(event.currentTarget,choiceIndex===dialogue.correctIndex,()=>setRevisionDialogueAnswers(current=>({...current,[index]:choiceIndex})))}><span>{String.fromCharCode(65+choiceIndex)}</span>{choice}</button>)}</div>{typeof selected==="number"&&<p className={selected===dialogue.correctIndex?"correct":"wrong"}><strong>{selected===dialogue.correctIndex?"اختيار مناسب.":"هذا الرد لا يناسب الموقف."}</strong> {dialogue.feedback}</p>}</article>})}
      </div>}
     </section>}
     {isA1OrbitLesson&&alphabetPracticeStep===4&&<section ref={usefulSentencesRef} className={`a1-useful-sentences a1-practice-step-panel ${usefulSentencesOpen?"open":""}`}>
      <button type="button" className="a1-useful-sentences-toggle" onClick={toggleUsefulSentences} aria-expanded={usefulSentencesOpen} aria-controls="a1-useful-sentences-list">
       <span><MessageCircle/></span><div><small>Phrases utiles</small><h3>جمل مفيدة</h3></div><ChevronDown/>
      </button>
      <div id="a1-useful-sentences-list" className="a1-useful-sentences-reveal"><div>
     <div className="university-practice-list">
      {practiceExamples.map((example,index)=><article key={`${example.fr}-${index}`}>
       <i>{String(index+1).padStart(2,"0")}</i>
       <div><strong dir="ltr">{example.fr}</strong><span>{example.ar}</span></div>
       <div className="university-dual-audio">
        {isA1OrbitLesson?<>
         <button onClick={()=>void playPedagogicalFrench(example.speech.join(" "))} aria-label={`استمع إلى الجملة الفرنسية بنطق طبيعي: ${example.fr}`} title="نطق طبيعي"><Volume2/><b>عادي</b></button>
         <button onClick={()=>void playPedagogicalFrench(example.speech.join(" "),true)} aria-label={`استمع إلى الجملة الفرنسية بنطق بطيء: ${example.fr}`} title="نطق بطيء"><Gauge/><b>بطيء</b></button>
        </>:<button onClick={()=>playVocabularySpeech(example.speech)} aria-label={`استمع إلى الجملة الفرنسية ${example.speech.join(" ثم ")}`}><Volume2/><b>FR</b></button>}
       </div>
     </article>)}
     </div>
      </div></div>
     </section>}
     {!isA1OrbitLesson&&<div className="university-practice-list">
      {practiceExamples.map((example,index)=><article key={`${example.fr}-${index}`}>
       <i>{String(index+1).padStart(2,"0")}</i>
       <div><strong dir="ltr">{example.fr}</strong><span>{example.ar}</span></div>
       <div className="university-dual-audio">
        <button onClick={()=>playVocabularySpeech(example.speech)} aria-label={`استمع إلى الجملة الفرنسية ${example.speech.join(" ثم ")}`}><Volume2/><b>FR</b></button>
       </div>
      </article>)}
     </div>}
     {isEnhancedLesson&&isA1OrbitLesson&&alphabetPracticeStep===5&&<section className="a1-smart-writing a1-practice-step-panel">
      <div className="a1-smart-writing-progress"><div><span>الكلمة {alphabetWritingIndex+1} من {orbitWritingTranslations.length}</span><strong>{Math.round((alphabetWritingIndex+1)/orbitWritingTranslations.length*100)}%</strong></div><i><b style={{width:`${(alphabetWritingIndex+1)/orbitWritingTranslations.length*100}%`}}/></i></div>
      <div className="a1-smart-writing-prompt"><small>Écrivez le mot</small><h4>{alphabetWritingItem.ar}</h4><button type="button" onClick={()=>void speakFrench(alphabetWritingItem.fr,{rate:.62})} aria-label={`استمع إلى كلمة ${alphabetWritingItem.fr}`}><Volume2/></button></div>
      <form onSubmit={event=>{event.preventDefault();setAlphabetWritingState(normalizeExerciseText(alphabetWritingInput)===normalizeExerciseText(alphabetWritingItem.fr)?"correct":"wrong")}}>
       <label htmlFor="alphabet-smart-writing">اكتب الكلمة بالفرنسية</label>
       <input id="alphabet-smart-writing" dir="ltr" lang="fr" autoComplete="off" autoCorrect="off" spellCheck={false} value={alphabetWritingInput} className={alphabetWritingState} onChange={event=>{setAlphabetWritingInput(event.target.value);setAlphabetWritingState("idle")}} placeholder="Écrivez ici…" autoFocus/>
       <button type="submit" disabled={!alphabetWritingInput.trim()}><CheckCircle2/> تحقق</button>
      </form>
      <div className={`a1-smart-writing-feedback ${alphabetWritingState}`} aria-live="polite">{alphabetWritingState==="correct"?<><CheckCircle2/><div><strong>ممتاز، الكلمة صحيحة</strong><span dir="ltr">{alphabetWritingItem.fr}</span></div></>:alphabetWritingState==="wrong"?<><CircleMinus/><div><strong>الكلمة غير صحيحة</strong><span>راجع الحروف والعلامات ثم حاول مجددًا.</span></div></>:<><NotebookTabs/><div><strong>اكتبها بدقة</strong><span>تحقق من ترتيب الحروف والعلامات الفرنسية.</span></div></>}</div>
      <div className="a1-smart-writing-actions">
       {alphabetWritingIndex<orbitWritingTranslations.length-1?<button type="button" className="next" disabled={alphabetWritingState!=="correct"} onClick={()=>{setAlphabetWritingIndex(index=>index+1);setAlphabetWritingInput("");setAlphabetWritingState("idle")}}>الكلمة التالية <ChevronLeft/></button>:<button type="button" className="next complete" disabled={alphabetWritingState!=="correct"} onClick={()=>{setAlphabetWritingIndex(0);setAlphabetWritingInput("");setAlphabetWritingState("idle")}}><RotateCcw/> أعد الكلمات</button>}
      </div>
     </section>}
     {isEnhancedLesson&&!isA1OrbitLesson&&<div className="a2-production-grid a1-practice-step-panel">
      <article className="a2-writing-task"><span>{isA1Alphabet?"Écrivez":"Production écrite"}</span><h4>{activeA2WritingTitle}</h4><p>{activeA2WritingInstructions}</p><textarea dir="ltr" value={revisionWritingText} onChange={event=>setRevisionWritingText(event.target.value)} aria-label="مساحة الكتابة الفرنسية" placeholder={activeA2WritingPlaceholder} rows={7}/><div className={`a2-word-count ${revisionWordCount>=writingMinimum&&revisionWordCount<=writingMaximum?"ready":""}`}><strong>{revisionWordCount}</strong><span>{isA1Alphabet?"من 8 كلمات":"كلمة من "+writingMinimum+"–"+writingMaximum}</span></div><ul className="a2-writing-checks">{revisionWritingChecks.map(item=><li key={item.label} className={item.passed?"passed":""}><CheckCircle2/>{item.label}</li>)}</ul><details className="a2-model-answer"><summary>{isA1Alphabet?"عرض الترجمة":"عرض نموذج بعد إنهاء كتابتك"}</summary>{isA1Alphabet?<div className="a1-writing-translation-list">{A1_ALPHABET_WRITING_TRANSLATIONS.map(item=><div key={item.fr}><strong dir="ltr">{item.fr}</strong><span>{item.ar}</span></div>)}</div>:<p dir="ltr">{activeA2WritingModel}</p>}</details></article>
      {!isA1Alphabet&&<article className="a2-speaking-task"><span>Production orale</span><h4>{activeA1SpeakingDuration??"تحدث لمدة 45 إلى 60 ثانية"}</h4><p dir="ltr">{activeA2SpeakingPrompt}</p><button onClick={()=>void speakFrench(activeA2SpeakingPrompt,{rate:isEnhancedA1Lesson?.66:.74})}><Volume2/> استمع إلى المهمة</button><ul>{activeA1SpeakingTips?activeA1SpeakingTips.map(tip=><li key={tip}>{tip}</li>):isA2Expression?<><li>قدّم الموضوع ثم عبّر عن رأيك.</li><li>أضف سببًا ومثالًا واضحًا.</li><li>ناقش رأيًا مختلفًا بأدب ثم اختم.</li></>:isA2RealLife?<><li>ابدأ بالمرجع والوقت والمكان.</li><li>اشرح المشكلة وأثرها الحالي.</li><li>اطلب حلًا وتأكد من الخطوة التالية.</li></>:isA2Connectors?<><li>رتّب البداية والوسط والنهاية.</li><li>اربط السبب بالنتيجة بوضوح.</li><li>اذكر صعوبة ثم نتيجة مخالفة لها.</li></>:isA2Politeness?<><li>ابدأ بفهم المشكلة أو الحاجة.</li><li>قدّم نصيحتين واقتراحًا عمليًا.</li><li>اختم بطلب مهذب واضح.</li></>:isA2Comparison?<><li>حدّد الخيارين ومعايير المقارنة.</li><li>استخدم الزيادة والنقصان والتساوي.</li><li>اختم بالأفضل وسبب اختيارك.</li></>:isA2Quantity?<><li>اذكر المنتجات ومقاديرها بوضوح.</li><li>استعمل en مع اسم سبق ذكره.</li><li>استعمل y للإشارة إلى المكان.</li></>:isA2Pronouns?<><li>اذكر الاسم أولًا ثم استبدله بضمير.</li><li>استخدم ضميرًا مباشرًا وآخر غير مباشر.</li><li>أدخل جملة فيها ضميران معًا.</li></>:isA2Future?<><li>حدّد موعد خططك القادمة.</li><li>استخدم المستقبل القريب والبسيط.</li><li>اذكر توقعًا أو شرطًا ممكنًا.</li></>:isA2Imparfait?<><li>ابدأ بوصف المكان والوقت.</li><li>اذكر عادة قديمة بالماضي الناقص.</li><li>اختم بحدث محدد في الماضي المركب.</li></>:isA2PasseCompose?<><li>حدد متى وأين وقع الحدث.</li><li>استخدم d’abord، puis، enfin.</li><li>اذكر النتيجة أو انطباعك في النهاية.</li></>:<><li>ابدأ بـ En général.</li><li>استخدم d’abord، puis، enfin.</li><li>اختم برأيك أو السبب.</li></>}</ul><div className="a2-recorder"><div>{!isRecording?<button onClick={()=>void startRevisionRecording()}><Mic2/> ابدأ التسجيل</button>:<button className="recording" onClick={stopRevisionRecording}><Square/> أوقف التسجيل</button>}{recordingUrl&&<button className="delete" onClick={deleteRevisionRecording}><Trash2/> احذف التسجيل</button>}</div>{isRecording&&<p><i/> التسجيل جارٍ الآن… تحدث بالفرنسية.</p>}{recordingUrl&&<audio src={recordingUrl} controls aria-label="تشغيل تسجيلك الفرنسي"/>}{recordingError&&<small className="error">{recordingError}</small>}</div></article>}
     </div>}
     {isA1OrbitLesson?<div className="a1-practice-navigation">
      <button type="button" className="map" onClick={closeAlphabetPractice}><Orbit/> خريطة التدريب</button>
      <button type="button" onClick={()=>selectAlphabetPracticeStep(alphabetPracticeStep-1)} disabled={alphabetPracticeStep===0}><ChevronRight/> السابق</button>
      {alphabetPracticeStep<ALPHABET_PRACTICE_STEPS.length-1?<button type="button" className="primary" disabled={orbitStepIncomplete} onClick={advanceAlphabetPractice}>إنهاء والعودة للخريطة <Orbit/></button>:<button type="button" className="primary" disabled={alphabetWritingIndex<orbitWritingTranslations.length-1||alphabetWritingState!=="correct"} onClick={()=>setLessonStage("test")}><ClipboardPenLine/> إنهاء والانتقال للتمرين النهائي <ChevronLeft/></button>}
     </div>:<button className="university-stage-next" onClick={()=>setLessonStage("test")}><ClipboardPenLine/> {isEnhancedLesson?"الانتقال إلى التمرين النهائي":"الانتقال إلى الاختبار"} <ChevronLeft/></button>}
     </div>}
    </section>}

    {lessonStage==="test"&&<section className="university-test-stage">
     <div className="university-stage-heading"><ClipboardPenLine/><div><span>Exercice final</span><h3>{isEnhancedLesson?"التمرين النهائي":"اختبار الدرس"}</h3><p>{quizQuestions.length===20?"عشرون سؤالًا مختلفًا من هذا الدرس.":`${quizQuestions.length} أسئلة مختلفة من هذا الدرس.`} تظهر النتيجة بعد إجابة السؤال الأخير.</p></div></div>
     {!quizFinished&&quizQuestions[quizQuestionIndex]&&(()=>{
      const question=quizQuestions[quizQuestionIndex];
      const selected=quizAnswers[quizQuestionIndex];
      return <div className="university-quiz-sequence">
       <div className="university-quiz-progress"><div><span>السؤال {quizQuestionIndex+1} من {quizQuestions.length}</span><strong>{Math.round((quizQuestionIndex+1)/quizQuestions.length*100)}%</strong></div><i><b style={{width:`${(quizQuestionIndex+1)/quizQuestions.length*100}%`}}/></i></div>
       <article className="university-current-question">
        <header>
         <div><span>{question.instruction??"استمع إلى العبارة الفرنسية، ثم اختر معناها الصحيح."}</span><strong dir="ltr">{question.prompt}</strong>{question.translation&&<p className="university-question-translation">{question.translation}</p>}</div>
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
      <span>{isEnhancedLesson?"نتيجة التمرين النهائي":"نتيجة الاختبار"}</span>
      <strong dir="ltr">{quizScore} <small>/ {quizQuestions.length}</small></strong>
      <h3>{quizScore===quizQuestions.length?"ممتاز، جميع إجاباتك صحيحة!":quizScore>=quizPassScore?(isEnhancedLesson?"أحسنت، اجتزت التمرين النهائي.":"أحسنت، اجتزت اختبار الدرس."):"راجع الدرس ثم أعد المحاولة."}</h3>
      <p>أجبت عن {quizScore} أسئلة صحيحة، و{quizQuestions.length-quizScore} أسئلة غير صحيحة.</p>
      {isEnhancedLesson&&quizScore<quizQuestions.length&&<section className="a2-quiz-review"><header><ListChecks/><div><span>Révision ciblée</span><h4>راجع إجاباتك غير الصحيحة</h4></div></header>{quizQuestions.map((question,index)=>quizAnswers[index]!==question.correctIndex?<article key={question.prompt}><i>{index+1}</i><div><strong dir="ltr">{question.prompt}</strong>{question.translation&&<p className="university-question-translation">{question.translation}</p>}<p className="chosen"><span>إجابتك</span><b>{question.choices[quizAnswers[index]]}</b></p><p className="correct"><span>الإجابة الصحيحة</span><b>{question.choices[question.correctIndex]}</b></p><small>{question.explanation}</small></div><button onClick={()=>void speakFrench(question.speech??question.prompt,{rate:.74})} aria-label={`استمع إلى السؤال ${index+1}`}><Volume2/></button></article>:null)}</section>}
      <button onClick={resetQuiz}><RotateCcw/> {isEnhancedLesson?"أعد التمرين":"أعد الاختبار"}</button>
     </div>}
    </section>}

    {!(isA1OrbitLesson&&lessonStage==="practice"&&alphabetPracticeOpen)&&<footer className="university-lesson-footer university-lesson-navigation">
     {previousModule?<button onClick={()=>selectModule(previousModule.id)}><ChevronRight/><span><small>الدرس السابق</small><strong>{previousModule.ar}</strong></span></button>:<span/>}
     <Link href={`/university/${level.id.toLocaleLowerCase("fr")}`}><LibraryBig/><span><small>العودة إلى</small><strong>مسار {level.id}</strong></span></Link>
     {nextModule?<button onClick={()=>selectModule(nextModule.id)}><span><small>الدرس التالي</small><strong>{nextModule.ar}</strong></span><ChevronLeft/></button>:<span/>}
    </footer>}
   </article>
  </section>}
 </main>;
}
