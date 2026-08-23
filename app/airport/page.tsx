"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { ArrowRight, ChevronLeft, Plane, Volume2, X } from "lucide-react";
import {speakFrench} from "@/lib/frenchSpeech";
import "./airport.css";

type Word={fr:string;ar:string;image:string};
type Section={id:string;fr:string;ar:string;thumbnail:string;words:Word[]};
type StoryWord={fr:string;ar:string;image:string};
type Story={id:string;title:string;arTitle:string;level:string;cover:string;paragraphs:string[];words:StoryWord[];phrases:{fr:string;ar:string}[];questions:{q:string;answers:string[];correct:number}[]};

const w=(fr:string,ar:string,image:string):Word=>({fr,ar,image:`/airport/assets/${image}.svg`});
const sections:Section[]=[
 {id:"entree",fr:"Arrivée à l’aéroport",ar:"الوصول إلى المطار",thumbnail:"/airport/sections/journey-arrival-v2.webp",words:[
  w("L’aéroport","المطار","airport"),w("Le voyageur","المسافر","traveler"),w("Les voyageurs","المسافرون","travelers"),w("Le parking","موقف السيارات","parking"),w("Le taxi","سيارة الأجرة","taxi"),w("La voiture","السيارة","car"),w("Le chariot à bagages","عربة الأمتعة","luggage-cart"),w("Les bagages","الأمتعة","luggage"),w("La valise","حقيبة السفر","suitcase"),w("Le sac à dos","حقيبة الظهر","backpack"),w("L’entrée","المدخل","entrance"),w("Le hall","صالة المطار","hall"),w("Le panneau d’information","لوحة المعلومات","info-board"),w("Le bureau d’information","مكتب الاستعلامات","information-desk"),w("L’écran des départs","شاشة المغادرة","departure-screen"),w("L’écran des arrivées","شاشة الوصول","arrival-screen")
 ]},
 {id:"checkin",fr:"Enregistrement",ar:"تسجيل الوصول",thumbnail:"/airport/sections/checkin-v2.webp",words:[
  w("Le passeport","جواز السفر","passport"),w("Le billet","تذكرة السفر","ticket"),w("La carte d’embarquement","بطاقة الصعود","boarding-pass"),w("Le comptoir d’enregistrement","كاونتر التسجيل","checkin-counter"),w("L’agent d’escale","موظف خدمات الركاب","agent"),w("Le bagage à main","حقيبة اليد","hand-luggage"),w("Le bagage enregistré","الحقيبة المشحونة","checked-baggage"),w("La balance à bagages","ميزان الأمتعة","baggage-scale"),w("L’étiquette à bagages","بطاقة الأمتعة","baggage-tag"),w("Le siège côté hublot","مقعد بجانب النافذة","window-seat")
 ]},
 {id:"security",fr:"Contrôle de sûreté",ar:"التفتيش الأمني",thumbnail:"/airport/sections/security-v2.webp",words:[
  w("L’agent de sécurité","موظف الأمن","security-agent"),w("Le détecteur de métaux","جهاز كشف المعادن","metal-detector"),w("Le scanner","جهاز الفحص","scanner"),w("Le bac","صينية التفتيش","tray"),w("La ceinture","الحزام","belt"),w("La veste","السترة","jacket"),w("Les poches","الجيوب","pockets"),w("Les liquides","السوائل","liquids"),w("L’ordinateur portable","الحاسوب المحمول","laptop"),w("La file de sécurité","طابور التفتيش","security-line")
 ]},
 {id:"waiting",fr:"Salle d’embarquement",ar:"صالة الانتظار",thumbnail:"/airport/sections/departure-gate-v2.webp",words:[
  w("La porte d’embarquement","بوابة الصعود","gate"),w("La salle d’attente","صالة الانتظار","waiting-room"),w("Le siège","المقعد","seat"),w("L’écran des vols","شاشة الرحلات","flight-screen"),w("L’annonce","الإعلان الصوتي","announcement"),w("Le retard","التأخير","delay"),w("Le vol annulé","الرحلة الملغاة","cancelled"),w("Les toilettes","دورة المياه","restroom"),w("La boutique","المتجر","shop"),w("Le café","المقهى","cafe")
 ]},
 {id:"boarding",fr:"Embarquement",ar:"الصعود إلى الطائرة",thumbnail:"/airport/sections/boarding-v2.webp",words:[
  w("L’embarquement","الصعود إلى الطائرة","boarding"),w("La file d’attente","طابور الانتظار","queue"),w("L’hôtesse de l’air","مضيفة الطيران","flight-attendant"),w("Le pilote","الطيار","pilot"),w("La passerelle","جسر الصعود","jet-bridge"),w("La porte de l’avion","باب الطائرة","aircraft-door"),w("L’embarquement prioritaire","الصعود بالأولوية","priority"),w("Le dernier appel","النداء الأخير","final-call")
 ]},
 {id:"plane",fr:"Dans l’avion",ar:"داخل الطائرة",thumbnail:"/airport/sections/cabin-v2.webp",words:[
  w("L’avion","الطائرة","airplane"),w("Le couloir","الممر","aisle"),w("Le hublot","نافذة الطائرة","window"),w("La ceinture de sécurité","حزام الأمان","seatbelt"),w("Le compartiment à bagages","خزانة الأمتعة العلوية","overhead-bin"),w("La tablette","طاولة المقعد","tray-table"),w("Le gilet de sauvetage","سترة النجاة","life-jacket"),w("Le plateau-repas","وجبة الطائرة","meal"),w("L’eau","الماء","water"),w("Les écouteurs","سماعات الأذن","headphones")
 ]},
 {id:"arrivals",fr:"Arrivée et bagages",ar:"الوصول واستلام الحقائب",thumbnail:"/airport/sections/arrivals-v2.webp",words:[
  w("Les arrivées","صالة الوصول","arrivals"),w("Le contrôle des passeports","الجوازات","passport-control"),w("La douane","الجمارك","customs"),w("La récupération des bagages","استلام الأمتعة","baggage-claim"),w("Le tapis à bagages","سير الحقائب","carousel"),w("Les bagages perdus","الأمتعة المفقودة","lost-luggage"),w("La sortie","المخرج","exit"),w("Le point de rencontre","نقطة الالتقاء","meeting-point"),w("Le bureau de change","مكتب تحويل العملات","currency-exchange"),w("La location de voitures","تأجير السيارات","car-rental")
 ]}
];

const airportPhrases:Record<string,{fr:string;ar:string}[]>={
 entree:[
  {fr:"Où se trouve le terminal des départs ?",ar:"أين تقع صالة المغادرة؟"},
  {fr:"Je voudrais prendre un chariot à bagages.",ar:"أود أخذ عربة للأمتعة."},
  {fr:"Le comptoir d’information se trouve dans le hall.",ar:"يقع مكتب الاستعلامات في الصالة."},
  {fr:"Pouvez-vous m’indiquer l’entrée du terminal ?",ar:"هل يمكنك إرشادي إلى مدخل صالة المطار؟"},
  {fr:"Je consulte l’écran des départs.",ar:"أطّلع على شاشة الرحلات المغادرة."}
 ],
 checkin:[
  {fr:"Je voudrais m’enregistrer pour le vol de Paris.",ar:"أود تسجيل الوصول لرحلة باريس."},
  {fr:"Voici mon passeport et ma réservation.",ar:"هذا جواز سفري وحجزي."},
  {fr:"Avez-vous un bagage à enregistrer ?",ar:"هل لديك حقيبة تريد شحنها؟"},
  {fr:"Puis-je avoir un siège côté hublot ?",ar:"هل يمكنني الحصول على مقعد بجانب النافذة؟"},
  {fr:"Votre porte d’embarquement figure sur la carte.",ar:"بوابة صعودك موضحة على البطاقة."}
 ],
 security:[
  {fr:"Veuillez présenter votre carte d’embarquement.",ar:"يرجى إبراز بطاقة الصعود."},
  {fr:"Placez votre ordinateur dans un bac séparé.",ar:"ضع حاسوبك في صينية منفصلة."},
  {fr:"Retirez votre veste avant de passer le portique.",ar:"انزع سترتك قبل المرور عبر البوابة."},
  {fr:"Les bagages de cabine passent dans le scanner.",ar:"تمر أمتعة المقصورة عبر جهاز الفحص."},
  {fr:"Suivez les consignes de l’agent de sûreté.",ar:"اتبع تعليمات موظف الأمن."}
 ],
 waiting:[
  {fr:"À quelle heure commence l’embarquement ?",ar:"في أي وقت يبدأ الصعود؟"},
  {fr:"Notre vol est affiché à la porte vingt-deux.",ar:"رحلتنا معروضة عند البوابة اثنتين وعشرين."},
  {fr:"Le vol est retardé de trente minutes.",ar:"تأخرت الرحلة ثلاثين دقيقة."},
  {fr:"Veuillez écouter les annonces.",ar:"يرجى الاستماع إلى الإعلانات."},
  {fr:"Nous attendons près de la porte d’embarquement.",ar:"ننتظر بالقرب من بوابة الصعود."}
 ],
 boarding:[
  {fr:"L’embarquement est maintenant ouvert.",ar:"بدأ الصعود إلى الطائرة الآن."},
  {fr:"Préparez votre passeport et votre carte d’embarquement.",ar:"جهّز جواز سفرك وبطاقة الصعود."},
  {fr:"Les passagers prioritaires embarquent en premier.",ar:"يصعد أصحاب الأولوية أولًا."},
  {fr:"Nous allons rejoindre l’avion par la passerelle.",ar:"سنتجه إلى الطائرة عبر جسر الصعود."},
  {fr:"C’est le dernier appel pour ce vol.",ar:"هذا هو النداء الأخير لهذه الرحلة."}
 ],
 plane:[
  {fr:"Mon siège se trouve côté couloir.",ar:"مقعدي بجانب الممر."},
  {fr:"Veuillez attacher votre ceinture de sécurité.",ar:"يرجى ربط حزام الأمان."},
  {fr:"Placez votre bagage dans le compartiment supérieur.",ar:"ضع حقيبتك في الخزانة العلوية."},
  {fr:"Puis-je avoir un verre d’eau, s’il vous plaît ?",ar:"هل يمكنني الحصول على كوب ماء من فضلك؟"},
  {fr:"Veuillez relever votre tablette avant le décollage.",ar:"يرجى رفع طاولة المقعد قبل الإقلاع."}
 ],
 arrivals:[
  {fr:"Où se trouve le contrôle des passeports ?",ar:"أين يقع قسم الجوازات؟"},
  {fr:"Je vais récupérer ma valise au tapis numéro cinq.",ar:"سأستلم حقيبتي من السير رقم خمسة."},
  {fr:"Mon bagage n’est pas arrivé.",ar:"لم تصل حقيبتي."},
  {fr:"Je dois déclarer cet article à la douane.",ar:"يجب أن أصرّح عن هذا الغرض للجمارك."},
  {fr:"Le point de rencontre se trouve après la sortie.",ar:"تقع نقطة الالتقاء بعد المخرج."}
 ]
};


const sw=(fr:string,ar:string,image:string):StoryWord=>({fr,ar,image:`/airport/assets/${image}.svg`});
const stories:Story[]=[
 {id:"karim-airport",title:"Karim à l’aéroport",arTitle:"كريم في المطار",level:"A1",cover:"/airport/sections/journey-arrival-v2.webp",paragraphs:[
  "Karim arrive à l’aéroport deux heures avant son vol. Il porte une petite valise et un sac à dos. D’abord, il regarde le tableau des départs pour trouver la porte d’embarquement. Ensuite, il enregistre ses bagages et passe le contrôle de sécurité.",
  "Après cela, il s’assoit près de sa porte et achète un café. Pendant qu’il attend, il lit un livre et écoute les annonces. Quelques minutes plus tard, les passagers sont invités à embarquer.",
  "Karim montre son passeport et sa carte d’embarquement. Il monte dans l’avion, trouve son siège près de la fenêtre et attache sa ceinture. Il est heureux, car il va passer une semaine de vacances en France."
 ],words:[sw("L’aéroport","المطار","airport"),sw("Le vol","الرحلة الجوية","airplane"),sw("La valise","حقيبة السفر","suitcase"),sw("Le sac à dos","حقيبة الظهر","backpack"),sw("Le tableau des départs","لوحة المغادرة","departure-screen"),sw("La porte d’embarquement","بوابة الصعود","gate"),sw("Le contrôle de sécurité","التفتيش الأمني","metal-detector"),sw("Le passeport","جواز السفر","passport"),sw("La carte d’embarquement","بطاقة الصعود","boarding-pass"),sw("Le siège","المقعد","seat"),sw("La ceinture de sécurité","حزام الأمان","seatbelt"),sw("Les vacances","الإجازة","vacation")],phrases:[
  {fr:"Karim arrive à l’aéroport deux heures avant son vol.",ar:"يصل كريم إلى المطار قبل رحلته بساعتين."},
  {fr:"Il enregistre ses bagages.",ar:"يسجّل أمتعته."},
  {fr:"Il passe le contrôle de sécurité.",ar:"يمر عبر التفتيش الأمني."},
  {fr:"Il monte dans l’avion.",ar:"يصعد إلى الطائرة."}
 ],questions:[
  {q:"Quand Karim arrive-t-il à l’aéroport ?",answers:["Une heure avant","Deux heures avant","Après le départ"],correct:1},
  {q:"Que regarde Karim d’abord ?",answers:["Le tableau des départs","Son téléphone","Le menu du café"],correct:0},
  {q:"Où est son siège ?",answers:["Près de la fenêtre","Près de la porte","Dans le couloir"],correct:0}
 ]},
 {id:"karim-missed",title:"Karim rate son vol",arTitle:"كريم يتأخر عن الرحلة",level:"A1+",cover:"/airport/sections/checkin-v2.webp",paragraphs:[
  "Karim se réveille en retard. Il regarde l’heure et se dépêche de préparer sa valise. Sur la route, il y a beaucoup de circulation et le taxi avance très lentement.",
  "Quand Karim arrive à l’aéroport, le comptoir d’enregistrement est déjà fermé. Il court jusqu’à la porte d’embarquement, mais il est trop tard. L’avion est déjà parti.",
  "Karim est déçu, mais il reste calme. Il va au comptoir de la compagnie aérienne et demande un autre billet. Heureusement, il trouve un vol pour le lendemain matin.",
  "Cette fois, il décide d’arriver trois heures avant son départ."
 ],words:[sw("En retard","متأخر","delay"),sw("Se dépêcher","يستعجل","running"),sw("La circulation","حركة المرور","traffic"),sw("Le taxi","سيارة الأجرة","taxi"),sw("Le comptoir","الكاونتر","checkin-counter"),sw("Fermé","مغلق","closed"),sw("Courir","يركض","running"),sw("Trop tard","فات الأوان","too-late"),sw("Le billet","التذكرة","ticket"),sw("La compagnie aérienne","شركة الطيران","airline"),sw("Le lendemain","اليوم التالي","tomorrow"),sw("Heureusement","لحسن الحظ","luck")],phrases:[
  {fr:"Karim se réveille en retard.",ar:"يستيقظ كريم متأخرًا."},
  {fr:"Il rate son vol.",ar:"تفوت كريم رحلته."},
  {fr:"Il demande un autre billet.",ar:"يطلب تذكرة أخرى."},
  {fr:"Il trouve un vol pour le lendemain.",ar:"يجد رحلة لليوم التالي."}
 ],questions:[
  {q:"Pourquoi Karim arrive-t-il en retard ?",answers:["Il y a beaucoup de circulation","Il perd son passeport","Le taxi est annulé"],correct:0},
  {q:"Que trouve-t-il à l’aéroport ?",answers:["Le comptoir est fermé","L’avion l’attend","La porte est ouverte"],correct:0},
  {q:"Quand est le nouveau vol ?",answers:["Le soir même","Le lendemain matin","La semaine suivante"],correct:1}
 ]}
];

function speak(text:string){
 void speakFrench(text);
}

export default function AirportPage(){
 const [activeId,setActiveId]=useState<string>("entree");
 const [storyListOpen,setStoryListOpen]=useState(false);
 const [activeStoryId,setActiveStoryId]=useState<string|null>(null);
 const [answers,setAnswers]=useState<Record<number,number>>({});
 const sectionDetailRef=useRef<HTMLElement>(null);
 const active=useMemo(()=>sections.find(s=>s.id===activeId)??sections[0],[activeId]);
 const activeStory=useMemo(()=>stories.find(s=>s.id===activeStoryId)??null,[activeStoryId]);
 const openSection=(id:string)=>{
  setActiveId(id);
  window.setTimeout(()=>sectionDetailRef.current?.scrollIntoView({behavior:"smooth",block:"start"}),0);
 };
 return <main className="airport-page">
  <header className="airport-topbar">
   <Link href="/kingdom" className="airport-back"><ArrowRight/><span><b>Portail du Château</b><small>واجهة القلعة</small></span></Link>
   <div className="airport-logo"><Plane/><span><b>L’Aéroport</b><small>المطار</small></span></div>
  </header>

  <section className="airport-hero">
   <Image src="/airport/terminal-main.png" alt="Terminal de l'aéroport" fill priority className="airport-hero-image"/>
   <div className="airport-hero-overlay"/>
   <div className="airport-hero-copy"><span>LE CHÂTEAU DES LANGUES</span><h1>L’Aéroport</h1><small>المطار</small><p>Entrez dans chaque section pour apprendre le vocabulaire essentiel du voyage.</p><em>ادخل إلى كل قسم لتعلّم مفردات السفر الأساسية.</em></div>
  </section>

  <section className="airport-content">
   <div className="airport-title"><div><span>✦ PARCOURS DE VOYAGE ✦</span><h2>Les sections de l’aéroport</h2><small>أقسام المطار</small></div><p>{sections.reduce((n,s)=>n+s.words.length,0)} mots illustrés · مفردة مصورة</p></div>
   <div className="airport-sections">{sections.map((s,i)=><button key={s.id} className={`airport-section-card ${activeId===s.id?"active":""}`} onClick={()=>openSection(s.id)}>
    <div className="airport-section-number">{String(i+1).padStart(2,"0")}</div>
    <div className="airport-section-copy"><h3>{s.fr}</h3><small>{s.ar}</small><p>{s.words.length} mots</p></div>
    <div className="airport-section-thumb"><Image src={s.thumbnail} alt={s.fr} fill sizes="(max-width:560px) 42vw, 300px"/></div><ChevronLeft/>
   </button>)}
   <button className="airport-section-card airport-story-entry" onClick={()=>setStoryListOpen(true)}>
    <div className="airport-section-number">08</div><div className="airport-section-copy"><h3>Histoires courtes</h3><small>قصص مصغرة للقراءة</small><p>{stories.length} histoires</p></div>
    <div className="airport-section-thumb"><Image src="/airport/sections/journey-arrival-v2.webp" alt="Histoires courtes" fill sizes="(max-width:560px) 42vw, 300px"/></div><ChevronLeft/>
   </button></div>
  </section>

  <section ref={sectionDetailRef} className="airport-journey-detail">
   <div className="airport-journey-visual"><Image src={active.thumbnail} alt={active.fr} fill sizes="(max-width:760px) 100vw, 50vw" priority={active.id==="entree"}/><div/><span>ÉTAPE {String(sections.findIndex(section=>section.id===active.id)+1).padStart(2,"0")}</span></div>
   <header className="airport-journey-head"><div><small>PARCOURS DU PASSAGER</small><h2>{active.fr}</h2><p>{active.ar}</p></div><button onClick={()=>speak(active.fr)} aria-label={`Écouter ${active.fr}`}><Volume2/></button></header>
   <div className="airport-journey-learning">
    <section className="airport-vocab-room"><div className="airport-room-title"><span>01</span><div><h3>Vocabulaire essentiel</h3><small>المفردات الأساسية</small></div></div><div className="airport-vocab-list">{active.words.map((word,index)=><button key={word.fr} onClick={()=>speak(word.fr)}><i>{String(index+1).padStart(2,"0")}</i><span><strong dir="ltr">{word.fr}</strong><small>{word.ar}</small></span><Volume2/></button>)}</div></section>
    <section className="airport-phrase-room"><div className="airport-room-title"><span>02</span><div><h3>Phrases en situation</h3><small>جمل عملية داخل المطار</small></div></div><div className="airport-phrase-list">{airportPhrases[active.id].map((phrase,index)=><button key={phrase.fr} onClick={()=>speak(phrase.fr)}><i>{String(index+1).padStart(2,"0")}</i><span><strong dir="ltr">{phrase.fr}</strong><small>{phrase.ar}</small></span><Volume2/></button>)}</div></section>
   </div>
   <aside className="airport-official-sources"><div><b>Contenu vérifié</b><span>محتوى مبني على مسار المسافر وإرشادات الطيران الرسمية</span></div><nav><a href="https://www.ecologie.gouv.fr/politiques-publiques/articles-reglementes-interdits-avion-helicoptere" target="_blank" rel="noreferrer">DGAC · Bagages et sûreté</a><a href="https://www.service-public.fr/particuliers/vosdroits/F591" target="_blank" rel="noreferrer">Service-Public · Documents de voyage</a><a href="https://www.service-public.fr/particuliers/vosdroits/F11370" target="_blank" rel="noreferrer">Service-Public · Bagages</a></nav></aside>
  </section>

  {storyListOpen&&!activeStory&&<div className="airport-modal" role="dialog" aria-modal="true"><section className="airport-panel story-list-panel">
   <div className="airport-panel-head"><button onClick={()=>setStoryListOpen(false)} aria-label="Fermer"><X/></button><div><h2>Histoires courtes</h2><small>قصص مصغرة للقراءة</small></div></div>
   <div className="airport-story-list">{stories.map((story,i)=><button key={story.id} className="airport-story-card" onClick={()=>{setActiveStoryId(story.id);setAnswers({});}}>
    <div className="airport-story-cover"><Image src={story.cover} alt={story.title} fill sizes="(max-width:700px) 100vw, 420px"/></div>
    <div><span>HISTOIRE {String(i+1).padStart(2,"0")} · {story.level}</span><h3>{story.title}</h3><small>{story.arTitle}</small><p>Lire, écouter et apprendre les mots importants.</p></div><ChevronLeft/>
   </button>)}</div>
  </section></div>}

  {activeStory&&<div className="airport-modal" role="dialog" aria-modal="true"><section className="airport-panel story-reader-panel">
   <div className="airport-panel-head story-head"><button onClick={()=>setActiveStoryId(null)} aria-label="Retour"><ArrowRight/></button><div><h2>{activeStory.title}</h2><small>{activeStory.arTitle} · {activeStory.level}</small></div></div>
   <article className="airport-story-reader">
    <div className="story-reader-actions"><button onClick={()=>speak(activeStory.paragraphs.join(' '))}><Volume2/> Écouter toute l’histoire</button></div>
    <h3>À l’aéroport</h3>{activeStory.paragraphs.map((p,i)=><p key={i}>{p}<button className="story-line-audio" onClick={()=>speak(p)} aria-label="Écouter le paragraphe"><Volume2/></button></p>)}
   </article>
   <section className="story-learning"><div className="story-section-title"><h3>Les mots importants</h3><small>الكلمات المهمة</small></div>
    <div className="airport-vocab-grid story-word-grid">{activeStory.words.map(word=><article className="airport-word" key={word.fr}><div className="airport-word-image"><Image src={word.image} alt={word.fr} fill sizes="(max-width:700px) 48vw, 240px"/></div><div className="airport-word-copy"><button onClick={()=>speak(word.fr)}><Volume2/></button><h3>{word.fr}</h3><small>{word.ar}</small></div></article>)}</div>
   </section>
   <section className="story-learning"><div className="story-section-title"><h3>Les phrases importantes</h3><small>الجمل المهمة</small></div><div className="story-phrases">{activeStory.phrases.map(x=><article key={x.fr}><button onClick={()=>speak(x.fr)}><Volume2/></button><h4>{x.fr}</h4><p>{x.ar}</p></article>)}</div></section>
   <section className="story-learning story-quiz"><div className="story-section-title"><h3>Compréhension</h3><small>فهم القصة</small></div>{activeStory.questions.map((q,qi)=><article key={q.q}><h4>{qi+1}. {q.q}</h4><div>{q.answers.map((a,ai)=><button key={a} className={answers[qi]===ai?(ai===q.correct?'correct':'wrong'):''} onClick={()=>setAnswers(v=>({...v,[qi]:ai}))}>{a}</button>)}</div></article>)}</section>
  </section></div>}
 </main>
}
