"use client";

import Link from "next/link";
import {useMemo,useState} from "react";
import type {CSSProperties} from "react";
import {
 Activity,ArrowRight,Baby,Bone,BookOpen,Brain,Building2,ChevronLeft,
 Eye,HeartPulse,Microscope,Pill,Search,ShieldCheck,Smile,Stethoscope,
 Syringe,Volume2
} from "lucide-react";
import {speakFrench} from "@/lib/frenchSpeech";
import "./hospital.css";

type Phrase={fr:string;ar:string};
type Department={id:string;fr:string;ar:string;tag:string;icon:string;phrases:Phrase[]};
type Tool={fr:string;ar:string};
type ToolRoom={id:string;fr:string;ar:string;icon:string;tools:Tool[]};
type AnatomyTerm={fr:string;ar:string;note:string};
type AnatomyZone={id:string;fr:string;ar:string;x:number;y:number;color:string;terms:AnatomyTerm[]};

const p=(fr:string,ar:string):Phrase=>({fr,ar});
const departments:Department[]=[
 {id:"accueil",fr:"Accueil et admissions",ar:"الاستقبال والتسجيل",tag:"Orientation",icon:"01",phrases:[
  p("Bonjour, j’ai un rendez-vous à dix heures.","مرحبًا، لدي موعد الساعة العاشرة."),
  p("Puis-je voir votre carte d’identité, s’il vous plaît ?","هل يمكنني رؤية بطاقة هويتك من فضلك؟"),
  p("Veuillez remplir ce formulaire d’admission.","يرجى تعبئة نموذج الدخول هذا."),
  p("La salle d’attente se trouve au premier étage.","تقع غرفة الانتظار في الطابق الأول."),
  p("Je vais vous indiquer le service de cardiologie.","سأرشدك إلى قسم أمراض القلب.")
 ]},
 {id:"urgences",fr:"Service des urgences",ar:"قسم الطوارئ",tag:"24 h / 24",icon:"02",phrases:[
  p("J’ai besoin d’une aide médicale urgente.","أحتاج إلى مساعدة طبية عاجلة."),
  p("Depuis quand avez-vous cette douleur ?","منذ متى تشعر بهذا الألم؟"),
  p("Le patient a du mal à respirer.","يعاني المريض صعوبة في التنفس."),
  p("Nous allons mesurer votre tension et votre température.","سنقيس ضغطك ودرجة حرارتك."),
  p("Restez calme, l’équipe médicale arrive.","ابقَ هادئًا، سيصل الفريق الطبي.")
 ]},
 {id:"dentaire",fr:"Soins dentaires et odontologie",ar:"الأسنان وطب الفم",tag:"Odontologie",icon:"03",phrases:[
  p("J’ai mal à une dent depuis hier.","أشعر بألم في أحد الأسنان منذ الأمس."),
  p("Le dentiste va examiner vos dents et vos gencives.","سيفحص طبيب الأسنان أسنانك ولثتك."),
  p("Cette dent présente une carie.","يوجد تسوس في هذا السن."),
  p("Nous devons faire une radiographie dentaire.","يجب أن نجري صورة أشعة للأسنان."),
  p("Ouvrez la bouche et respirez doucement.","افتح فمك وتنفس بهدوء.")
 ]},
 {id:"dermatologie",fr:"Dermatologie",ar:"الأمراض الجلدية",tag:"Peau",icon:"04",phrases:[
  p("Depuis quand avez-vous cette irritation ?","منذ متى لديك هذا التهيج؟"),
  p("Cette rougeur provoque-t-elle des démangeaisons ?","هل يسبب هذا الاحمرار حكة؟"),
  p("Le dermatologue examine la peau avec un dermatoscope.","يفحص طبيب الجلدية البشرة بمنظار الجلد."),
  p("Appliquez cette crème sur la zone concernée.","ضع هذا الكريم على المنطقة المصابة."),
  p("Protégez votre peau du soleil.","احمِ بشرتك من الشمس.")
 ]},
 {id:"interne",fr:"Médecine interne",ar:"الطب الباطني",tag:"Diagnostic",icon:"05",phrases:[
  p("Le médecin va reprendre vos antécédents médicaux.","سيراجع الطبيب تاريخك الطبي."),
  p("Avez-vous une maladie chronique ?","هل لديك مرض مزمن؟"),
  p("Nous allons demander une prise de sang.","سنطلب تحليل دم."),
  p("Vos symptômes nécessitent un examen complémentaire.","تتطلب أعراضك فحصًا إضافيًا."),
  p("Apportez la liste de vos médicaments.","أحضر قائمة أدويتك.")
 ]},
 {id:"chirurgie",fr:"Chirurgie",ar:"قسم الجراحة",tag:"Bloc opératoire",icon:"06",phrases:[
  p("Le chirurgien vous expliquera l’intervention.","سيشرح لك الجرّاح العملية."),
  p("Vous devez rester à jeun avant l’opération.","يجب أن تبقى صائمًا قبل العملية."),
  p("L’anesthésiste viendra vous voir avant la chirurgie.","سيزورك طبيب التخدير قبل الجراحة."),
  p("L’intervention s’est bien déroulée.","سارت العملية بصورة جيدة."),
  p("L’infirmière va refaire votre pansement.","ستغيّر الممرضة ضمادك.")
 ]},
 {id:"cardiologie",fr:"Cardiologie",ar:"أمراض القلب",tag:"Cœur",icon:"07",phrases:[
  p("Ressentez-vous une douleur dans la poitrine ?","هل تشعر بألم في الصدر؟"),
  p("Le cardiologue va réaliser un électrocardiogramme.","سيجري طبيب القلب تخطيطًا للقلب."),
  p("Votre rythme cardiaque est régulier.","نبض قلبك منتظم."),
  p("Nous allons surveiller votre tension artérielle.","سنراقب ضغط دمك."),
  p("Évitez les efforts intenses aujourd’hui.","تجنب المجهود الشديد اليوم.")
 ]},
 {id:"pneumologie",fr:"Pneumologie",ar:"الأمراض الصدرية والتنفسية",tag:"Poumons",icon:"08",phrases:[
  p("Avez-vous de la toux ou un essoufflement ?","هل لديك سعال أو ضيق في التنفس؟"),
  p("Inspirez profondément, puis expirez lentement.","خذ شهيقًا عميقًا ثم ازفر ببطء."),
  p("Le médecin écoute vos poumons.","يستمع الطبيب إلى رئتيك."),
  p("Nous allons mesurer votre saturation en oxygène.","سنقيس نسبة تشبع الأكسجين لديك."),
  p("Une radiographie du thorax est nécessaire.","يلزم إجراء صورة أشعة للصدر.")
 ]},
 {id:"pediatrie",fr:"Pédiatrie",ar:"طب الأطفال",tag:"Enfants",icon:"09",phrases:[
  p("Quel âge a votre enfant ?","كم عمر طفلك؟"),
  p("Depuis quand a-t-il de la fièvre ?","منذ متى لديه حمى؟"),
  p("Le pédiatre va examiner sa gorge et ses oreilles.","سيفحص طبيب الأطفال حلقه وأذنيه."),
  p("Votre enfant doit boire régulièrement.","يجب أن يشرب طفلك بانتظام."),
  p("Apportez son carnet de santé.","أحضر سجل طفلك الصحي.")
 ]},
 {id:"gynecologie",fr:"Gynécologie et obstétrique",ar:"النساء والولادة",tag:"Maternité",icon:"10",phrases:[
  p("Avez-vous pris rendez-vous avec la sage-femme ?","هل حجزت موعدًا مع القابلة؟"),
  p("La consultation prénatale est prévue demain.","موعد متابعة الحمل غدًا."),
  p("Nous allons vérifier la croissance du bébé.","سنتحقق من نمو الطفل."),
  p("La maternité se trouve dans le bâtiment B.","يقع قسم الولادة في المبنى ب."),
  p("Prévenez-nous si les contractions deviennent régulières.","أبلغينا إذا أصبحت الانقباضات منتظمة.")
 ]},
 {id:"ophtalmologie",fr:"Ophtalmologie",ar:"طب العيون",tag:"Vision",icon:"11",phrases:[
  p("Ma vision est floue depuis ce matin.","رؤيتي ضبابية منذ هذا الصباح."),
  p("Lisez les lettres sur le tableau.","اقرأ الحروف الموجودة على اللوحة."),
  p("L’ophtalmologue va examiner votre rétine.","سيفحص طبيب العيون شبكية عينك."),
  p("Regardez droit devant vous sans bouger.","انظر أمامك مباشرة دون حركة."),
  p("Ces gouttes peuvent brouiller temporairement la vue.","قد تسبب هذه القطرات تشوشًا مؤقتًا في الرؤية.")
 ]},
 {id:"orl",fr:"Oto-rhino-laryngologie",ar:"الأنف والأذن والحنجرة",tag:"ORL",icon:"12",phrases:[
  p("J’ai mal à la gorge et à l’oreille.","لدي ألم في الحلق والأذن."),
  p("Le médecin va examiner votre nez.","سيفحص الطبيب أنفك."),
  p("Avez-vous remarqué une baisse de l’audition ?","هل لاحظت ضعفًا في السمع؟"),
  p("Avalez doucement, s’il vous plaît.","ابتلع بهدوء من فضلك."),
  p("Un test auditif est recommandé.","يُنصح بإجراء اختبار للسمع.")
 ]},
 {id:"imagerie",fr:"Imagerie médicale",ar:"الأشعة والتصوير الطبي",tag:"IRM · Scanner",icon:"13",phrases:[
  p("Avez-vous une ordonnance pour cet examen ?","هل لديك وصفة لهذا الفحص؟"),
  p("Retirez vos objets métalliques avant l’IRM.","انزع الأشياء المعدنية قبل التصوير بالرنين."),
  p("Restez immobile pendant quelques secondes.","ابقَ دون حركة لبضع ثوانٍ."),
  p("Le radiologue examinera les images.","سيفحص اختصاصي الأشعة الصور."),
  p("Le compte rendu sera envoyé à votre médecin.","سيُرسل تقرير الفحص إلى طبيبك.")
 ]},
 {id:"laboratoire",fr:"Laboratoire de biologie médicale",ar:"مختبر التحاليل الطبية",tag:"Analyses",icon:"14",phrases:[
  p("Êtes-vous à jeun pour la prise de sang ?","هل أنت صائم لإجراء تحليل الدم؟"),
  p("L’infirmière va prélever un tube de sang.","ستسحب الممرضة أنبوبًا من الدم."),
  p("Posez votre bras sur l’accoudoir.","ضع ذراعك على مسند الذراع."),
  p("Les résultats seront disponibles cet après-midi.","ستتوفر النتائج بعد ظهر اليوم."),
  p("Présentez cette étiquette au laboratoire.","قدّم هذه البطاقة في المختبر.")
 ]},
 {id:"pharmacie",fr:"Pharmacie hospitalière",ar:"صيدلية المستشفى",tag:"Médicaments",icon:"15",phrases:[
  p("Voici votre ordonnance de sortie.","هذه وصفة خروجك من المستشفى."),
  p("Prenez ce médicament avec un verre d’eau.","خذ هذا الدواء مع كوب من الماء."),
  p("Respectez la dose indiquée sur l’ordonnance.","التزم بالجرعة المكتوبة في الوصفة."),
  p("Avez-vous des allergies médicamenteuses ?","هل لديك حساسية من أدوية؟"),
  p("Demandez conseil au pharmacien.","اطلب نصيحة الصيدلي.")
 ]},
 {id:"reanimation",fr:"Soins intensifs et réanimation",ar:"العناية المركزة والإنعاش",tag:"Surveillance",icon:"16",phrases:[
  p("Le patient est sous surveillance continue.","المريض تحت المراقبة المستمرة."),
  p("L’équipe contrôle ses constantes vitales.","يراقب الفريق علاماته الحيوية."),
  p("Les visites sont limitées dans cette unité.","الزيارات محدودة في هذه الوحدة."),
  p("Veuillez désinfecter vos mains avant d’entrer.","يرجى تعقيم يديك قبل الدخول."),
  p("Le médecin vous donnera des nouvelles du patient.","سيطلعك الطبيب على حالة المريض.")
 ]}
];

const toolRooms:ToolRoom[]=[
 {id:"general",fr:"Médecine générale",ar:"الطبيب العام",icon:"A",tools:[["Le stéthoscope","سماعة الطبيب"],["Le tensiomètre","جهاز قياس الضغط"],["Le thermomètre","ميزان الحرارة"],["L’otoscope","منظار الأذن"],["L’oxymètre de pouls","مقياس التأكسج النبضي"],["L’abaisse-langue","خافض اللسان"]].map(([fr,ar])=>({fr,ar}))},
 {id:"dentiste",fr:"Cabinet dentaire",ar:"طبيب الأسنان",icon:"B",tools:[["Le miroir dentaire","مرآة الأسنان"],["La sonde dentaire","مسبار الأسنان"],["La pince dentaire","ملقط الأسنان"],["La turbine dentaire","قبضة الحفر السريعة"],["La fraise dentaire","رأس حفر الأسنان"],["L’aspirateur salivaire","شفاط اللعاب"]].map(([fr,ar])=>({fr,ar}))},
 {id:"chirurgien",fr:"Bloc opératoire",ar:"الجرّاح",icon:"C",tools:[["Le scalpel","المشرط"],["La pince chirurgicale","الملقط الجراحي"],["Les ciseaux chirurgicaux","المقص الجراحي"],["Le porte-aiguille","ماسك الإبرة"],["Le fil de suture","خيط الجراحة"],["L’écarteur","المُبعِد الجراحي"]].map(([fr,ar])=>({fr,ar}))},
 {id:"urgence",fr:"Urgences et soins infirmiers",ar:"الطوارئ والتمريض",icon:"D",tools:[["La seringue","الحقنة"],["La perfusion","المحلول الوريدي"],["Le pansement","الضماد"],["La compresse stérile","الشاش المعقم"],["Le défibrillateur","جهاز مزيل الرجفان"],["Le brancard","النقالة"]].map(([fr,ar])=>({fr,ar}))},
 {id:"dermato",fr:"Cabinet de dermatologie",ar:"طبيب الجلدية",icon:"E",tools:[["Le dermatoscope","منظار الجلد"],["La loupe médicale","العدسة الطبية"],["La lampe d’examen","مصباح الفحص"],["La curette dermatologique","المكشطة الجلدية"],["Le matériel de prélèvement","أدوات أخذ العينة"],["L’azote liquide","النيتروجين السائل"]].map(([fr,ar])=>({fr,ar}))},
 {id:"imagerie",fr:"Imagerie médicale",ar:"اختصاصي الأشعة",icon:"F",tools:[["L’appareil de radiographie","جهاز الأشعة السينية"],["L’échographe","جهاز الموجات فوق الصوتية"],["Le scanner","جهاز التصوير المقطعي"],["L’IRM","جهاز الرنين المغناطيسي"],["La sonde échographique","مسبار الموجات فوق الصوتية"],["Le tablier plombé","المئزر الواقي من الأشعة"]].map(([fr,ar])=>({fr,ar}))},
 {id:"laboratoire",fr:"Laboratoire",ar:"فني المختبر",icon:"G",tools:[["Le microscope","المجهر"],["Le tube à essai","أنبوب الاختبار"],["La pipette","الماصة"],["La centrifugeuse","جهاز الطرد المركزي"],["La lame de microscope","شريحة المجهر"],["Le flacon de prélèvement","عبوة العينة"]].map(([fr,ar])=>({fr,ar}))},
 {id:"ophtalmo",fr:"Cabinet d’ophtalmologie",ar:"طبيب العيون",icon:"H",tools:[["L’ophtalmoscope","منظار العين"],["La lampe à fente","المصباح الشقي"],["Le tonomètre","مقياس ضغط العين"],["Le tableau d’acuité visuelle","لوحة فحص النظر"],["Les gouttes oculaires","قطرات العين"],["La lentille d’examen","عدسة الفحص"]].map(([fr,ar])=>({fr,ar}))}
];

const term=(fr:string,ar:string,note:string):AnatomyTerm=>({fr,ar,note});
const anatomyZones:AnatomyZone[]=[
 {id:"head",fr:"La tête",ar:"الرأس",x:50,y:7,color:"#d9a56d",terms:[term("Le crâne","الجمجمة","عظام تحمي الدماغ"),term("Le cerveau","الدماغ","عضو الجهاز العصبي المركزي"),term("Le visage","الوجه","الجزء الأمامي من الرأس"),term("Le front","الجبهة","أعلى الوجه"),term("Les cheveux","الشعر","يغطي فروة الرأس")]},
 {id:"senses",fr:"Les organes des sens",ar:"أعضاء الحواس",x:57,y:14,color:"#78a7c8",terms:[term("L’œil","العين","عضو البصر"),term("L’oreille","الأذن","عضو السمع والتوازن"),term("Le nez","الأنف","عضو الشم"),term("La langue","اللسان","عضو التذوق والكلام"),term("Les dents","الأسنان","تقطع الطعام وتطحنه")]},
 {id:"thorax",fr:"Le thorax",ar:"الصدر",x:50,y:32,color:"#bd6a6a",terms:[term("Le cœur","القلب","يضخ الدم في الجسم"),term("Le poumon","الرئة","عضو التنفس"),term("Les côtes","الأضلاع","تحمي أعضاء الصدر"),term("Le sternum","عظم القص","عظم أمامي في القفص الصدري"),term("Le diaphragme","الحجاب الحاجز","عضلة أساسية للتنفس")]},
 {id:"abdomen",fr:"L’abdomen",ar:"البطن",x:50,y:48,color:"#d5a84b",terms:[term("L’estomac","المعدة","عضو من الجهاز الهضمي"),term("Le foie","الكبد","عضو استقلابي كبير"),term("L’intestin","الأمعاء","تمتص المغذيات والماء"),term("Le rein","الكلية","ترشح الدم وتنتج البول"),term("Le pancréas","البنكرياس","غدة هضمية وصماء")]},
 {id:"upper",fr:"Le membre supérieur",ar:"الطرف العلوي",x:24,y:37,color:"#789c78",terms:[term("L’épaule","الكتف","تصل الذراع بالجذع"),term("Le bras","العضد","بين الكتف والمرفق"),term("Le coude","المرفق","مفصل الذراع"),term("Le poignet","الرسغ","مفصل اليد"),term("La main","اليد","نهاية الطرف العلوي"),term("Les doigts","الأصابع","أجزاء اليد المتحركة")]},
 {id:"lower",fr:"Le membre inférieur",ar:"الطرف السفلي",x:62,y:72,color:"#758bb3",terms:[term("La hanche","الورك","مفصل الحوض والفخذ"),term("La cuisse","الفخذ","بين الورك والركبة"),term("Le genou","الركبة","مفصل الطرف السفلي"),term("La jambe","الساق","بين الركبة والكاحل"),term("La cheville","الكاحل","مفصل القدم"),term("Le pied","القدم","قاعدة الطرف السفلي"),term("Les orteils","أصابع القدم","أجزاء مقدمة القدم")]},
 {id:"skeleton",fr:"Le système squelettique",ar:"الجهاز الهيكلي",x:38,y:59,color:"#b29a7a",terms:[term("L’os","العظم","نسيج صلب من الهيكل"),term("L’articulation","المفصل","منطقة اتصال العظام"),term("Le cartilage","الغضروف","نسيج مرن داخل المفاصل"),term("La colonne vertébrale","العمود الفقري","محور الهيكل العظمي"),term("Le bassin","الحوض","حلقة عظمية أسفل الجذع")]},
 {id:"muscles",fr:"Le système musculaire",ar:"الجهاز العضلي",x:73,y:45,color:"#b95f55",terms:[term("Le muscle","العضلة","نسيج ينتج الحركة"),term("Le tendon","الوتر","يربط العضلة بالعظم"),term("Le ligament","الرباط","يثبت المفصل"),term("La contraction","الانقباض","قصر ألياف العضلة"),term("La force musculaire","القوة العضلية","قدرة العضلة على بذل القوة")]},
 {id:"nervous",fr:"Le système nerveux",ar:"الجهاز العصبي",x:34,y:23,color:"#8871b1",terms:[term("Le nerf","العصب","ينقل الإشارات العصبية"),term("La moelle épinière","الحبل الشوكي","يمتد داخل العمود الفقري"),term("Le neurone","الخلية العصبية","وحدة الجهاز العصبي"),term("La sensation","الإحساس","استقبال المثيرات"),term("Le mouvement","الحركة","استجابة عضلية منسقة")]},
 {id:"circulation",fr:"La circulation",ar:"الدورة الدموية",x:66,y:26,color:"#b8424b",terms:[term("Le sang","الدم","سائل يدور في الأوعية"),term("L’artère","الشريان","ينقل الدم من القلب"),term("La veine","الوريد","يعيد الدم إلى القلب"),term("Le vaisseau sanguin","الوعاء الدموي","قناة يسري فيها الدم"),term("Le pouls","النبض","موجة ناتجة عن ضربات القلب")]}
];

const navItems=[
 {id:"departments",fr:"Services hospitaliers",ar:"أقسام المستشفى",Icon:Building2},
 {id:"tools",fr:"Instruments médicaux",ar:"الأدوات حسب التخصص",Icon:Stethoscope},
 {id:"anatomy",fr:"Corps humain",ar:"علم جسم الإنسان",Icon:Activity}
] as const;

export default function HospitalPage(){
 const [view,setView]=useState<(typeof navItems)[number]["id"]>("departments");
 const [activeDepartment,setActiveDepartment]=useState("accueil");
 const [activeToolRoom,setActiveToolRoom]=useState("general");
 const [activeZone,setActiveZone]=useState("head");
 const [query,setQuery]=useState("");
 const currentDepartment=departments.find(item=>item.id===activeDepartment)??departments[0];
 const currentToolRoom=toolRooms.find(item=>item.id===activeToolRoom)??toolRooms[0];
 const currentZone=anatomyZones.find(item=>item.id===activeZone)??anatomyZones[0];
 const filteredDepartments=useMemo(()=>{
  const q=query.trim().toLocaleLowerCase("fr");
  return q?departments.filter(item=>`${item.fr} ${item.ar} ${item.tag}`.toLocaleLowerCase("fr").includes(q)):departments;
 },[query]);
 const speak=(text:string)=>void speakFrench(text,{rate:.76});

 return <main className="hospital-world" dir="rtl">
  <header className="hospital-topbar">
   <Link href="/kingdom" aria-label="العودة إلى واجهة القلعة"><ArrowRight/></Link>
   <div><HeartPulse/><span><strong>L’HÔPITAL</strong><small>المستشفى التعليمي</small></span></div>
   <div className="hospital-status"><i/> Ouvert 24 h / 24</div>
  </header>

  <section className="hospital-hero">
   <img src="/kingdom-portal-assets/destination-hospital.png" alt="مبنى المستشفى"/>
   <div className="hospital-hero-glow"/>
   <div className="hospital-hero-copy">
    <span><ShieldCheck/> Parcours linguistique médical</span>
    <h1>Entrez dans<br/><b>l’hôpital</b></h1>
    <p>تعلّم الفرنسية داخل أقسام مستشفى متكامل: الاستقبال، التخصصات، الأدوات، وجسم الإنسان.</p>
    <button onClick={()=>speak("Bonjour, bienvenue à l’hôpital. Comment pouvons-nous vous aider ?")}><Volume2/> استمع إلى جملة الترحيب</button>
   </div>
   <div className="hospital-hero-stats"><div><b>16</b><span>قسمًا طبيًا</span></div><div><b>48</b><span>أداة متخصصة</span></div><div><b>53</b><span>مصطلحًا تشريحيًا</span></div></div>
  </section>

  <nav className="hospital-main-nav" aria-label="أقسام التعلم">
   {navItems.map(({id,fr,ar,Icon})=><button key={id} className={view===id?"active":""} onClick={()=>setView(id)}><Icon/><span><strong>{fr}</strong><small>{ar}</small></span></button>)}
  </nav>

  {view==="departments"&&<section className="hospital-learning-section">
   <div className="hospital-section-title"><span>01 · Services</span><h2>أقسام المستشفى</h2><p>اختر القسم، ثم اضغط على أي جملة لسماع نطقها الفرنسي الصحيح.</p></div>
   <label className="hospital-search"><Search/><input value={query} onChange={event=>setQuery(event.target.value)} placeholder="ابحث عن قسم…  Rechercher un service"/></label>
   <div className="hospital-department-grid">
    {filteredDepartments.map(item=><button key={item.id} className={activeDepartment===item.id?"active":""} onClick={()=>setActiveDepartment(item.id)}><i>{item.icon}</i><span><strong>{item.fr}</strong><small>{item.ar}</small><em>{item.tag}</em></span><ChevronLeft/></button>)}
   </div>
   <article className="hospital-department-room">
    <header><div><span>{currentDepartment.tag}</span><h3>{currentDepartment.fr}</h3><p>{currentDepartment.ar}</p></div><button onClick={()=>speak(currentDepartment.fr)} aria-label="نطق اسم القسم"><Volume2/></button></header>
    <div className="hospital-phrase-list">
     {currentDepartment.phrases.map((item,index)=><button key={item.fr} onClick={()=>speak(item.fr)}><i>{String(index+1).padStart(2,"0")}</i><span><strong dir="ltr">{item.fr}</strong><small>{item.ar}</small></span><Volume2/></button>)}
    </div>
   </article>
  </section>}

  {view==="tools"&&<section className="hospital-learning-section hospital-tools-section">
   <div className="hospital-section-title"><span>02 · Instruments</span><h2>جناح الأدوات الطبية</h2><p>الأدوات مرتبة حسب صاحب الاختصاص واستعمالها داخل بيئة المستشفى.</p></div>
   <div className="hospital-tool-tabs">
    {toolRooms.map(item=><button key={item.id} className={activeToolRoom===item.id?"active":""} onClick={()=>setActiveToolRoom(item.id)}><i>{item.icon}</i><span><strong>{item.fr}</strong><small>{item.ar}</small></span></button>)}
   </div>
   <article className="hospital-tool-cabinet">
    <header><div><Stethoscope/><span><small>Armoire spécialisée</small><h3>{currentToolRoom.fr}</h3><p>{currentToolRoom.ar}</p></span></div><button onClick={()=>speak(currentToolRoom.fr)}><Volume2/></button></header>
    <div className="hospital-tool-grid">
     {currentToolRoom.tools.map((item,index)=><button key={item.fr} onClick={()=>speak(item.fr)}><div className="hospital-tool-visual"><span/><i>{String(index+1).padStart(2,"0")}</i></div><strong dir="ltr">{item.fr}</strong><small>{item.ar}</small><em><Volume2/> اضغط للاستماع</em></button>)}
    </div>
   </article>
  </section>}

  {view==="anatomy"&&<section className="hospital-learning-section hospital-anatomy-section">
   <div className="hospital-section-title"><span>03 · Anatomie humaine</span><h2>جسم الإنسان التفاعلي</h2><p>اضغط على العلامات في الرسم، ثم استكشف الكلمات التفصيلية لكل منطقة.</p></div>
   <div className="hospital-anatomy-layout">
    <div className="hospital-body-card">
     <div className="hospital-body-heading"><div><Activity/><span><strong>Le corps humain</strong><small>جسم الإنسان · Vue antérieure</small></span></div><b>INTERACTIF</b></div>
     <div className="hospital-body-stage">
      <img className="hospital-anatomy-render" src="/hospital/human-anatomy-v1.png" alt="تصوير تشريحي طبي واقعي لجسم الإنسان من الأمام"/>
      {anatomyZones.map(zone=><button key={zone.id} className={activeZone===zone.id?"active":""} style={{left:`${zone.x}%`,top:`${zone.y}%`,borderColor:zone.color}} onClick={()=>setActiveZone(zone.id)} aria-label={`${zone.fr}، ${zone.ar}`}><i style={{background:zone.color}}/><span>{zone.fr}<small>{zone.ar}</small></span></button>)}
     </div>
    </div>
    <article className="hospital-anatomy-detail" style={{"--zone-color":currentZone.color} as CSSProperties}>
     <header><div><span>Zone sélectionnée</span><h3>{currentZone.fr}</h3><p>{currentZone.ar}</p></div><button onClick={()=>speak(currentZone.fr)}><Volume2/></button></header>
     <div className="hospital-anatomy-terms">
      {currentZone.terms.map((item,index)=><button key={item.fr} onClick={()=>speak(item.fr)}><i>{index+1}</i><span><strong dir="ltr">{item.fr}</strong><b>{item.ar}</b><small>{item.note}</small></span><Volume2/></button>)}
     </div>
     <p className="hospital-anatomy-note"><BookOpen/> رسم تعليمي مبسّط لتعلّم المفردات، وليس مرجعًا للتشخيص الطبي.</p>
    </article>
   </div>
  </section>}

  <section className="hospital-sources">
   <div><ShieldCheck/><span><strong>مصادر المصطلحات والتنظيم</strong><small>Sources médicales de référence</small></span></div>
   <p>رُوجعت أسماء الأقسام والمصطلحات الطبية وفق مصادر مؤسسية، وصيغت الجمل لأغراض تعليم اللغة الفرنسية.</p>
   <div className="hospital-source-links">
    <a href="https://www.chu-lyon.fr/hopital-edouard-herriot" target="_blank" rel="noreferrer">Hospices Civils de Lyon · Services hospitaliers</a>
    <a href="https://www.chu-lyon.fr/service-soins-dentaires-odontologie-hospitaliere" target="_blank" rel="noreferrer">HCL · Odontologie hospitalière</a>
    <a href="https://dictionnaire.academie-medecine.fr/" target="_blank" rel="noreferrer">Académie nationale de médecine · Dictionnaire</a>
    <a href="https://terminologia-anatomica.org/en" target="_blank" rel="noreferrer">Terminologia Anatomica · Nomenclature</a>
   </div>
  </section>
 </main>;
}
