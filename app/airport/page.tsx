"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, ChevronLeft, Plane, Volume2, X } from "lucide-react";

type Word={fr:string;ar:string;image:string};
type Section={id:string;fr:string;ar:string;icon:string;words:Word[]};

const w=(fr:string,ar:string,image:string):Word=>({fr,ar,image:`/airport/assets/${image}.svg`});
const sections:Section[]=[
 {id:"entree",fr:"Arrivée à l’aéroport",ar:"الوصول إلى المطار",icon:"🚗",words:[
  w("L’aéroport","المطار","airport"),w("Le voyageur","المسافر","traveler"),w("Les voyageurs","المسافرون","travelers"),w("Le parking","موقف السيارات","parking"),w("Le taxi","سيارة الأجرة","taxi"),w("La voiture","السيارة","car"),w("Le chariot à bagages","عربة الأمتعة","luggage-cart"),w("Les bagages","الأمتعة","luggage"),w("La valise","حقيبة السفر","suitcase"),w("Le sac à dos","حقيبة الظهر","backpack"),w("L’entrée","المدخل","entrance"),w("Le hall","صالة المطار","hall"),w("Le panneau d’information","لوحة المعلومات","info-board"),w("Le bureau d’information","مكتب الاستعلامات","information-desk"),w("L’écran des départs","شاشة المغادرة","departure-screen"),w("L’écran des arrivées","شاشة الوصول","arrival-screen")
 ]},
 {id:"checkin",fr:"Enregistrement",ar:"تسجيل الوصول",icon:"🛂",words:[
  w("Le passeport","جواز السفر","passport"),w("Le billet","تذكرة السفر","ticket"),w("La carte d’embarquement","بطاقة الصعود","boarding-pass"),w("Le comptoir d’enregistrement","كاونتر التسجيل","checkin-counter"),w("L’agent d’escale","موظف خدمات الركاب","agent"),w("Le bagage à main","حقيبة اليد","hand-luggage"),w("Le bagage enregistré","الحقيبة المشحونة","checked-baggage"),w("La balance à bagages","ميزان الأمتعة","baggage-scale"),w("L’étiquette à bagages","بطاقة الأمتعة","baggage-tag"),w("Le siège côté hublot","مقعد بجانب النافذة","window-seat")
 ]},
 {id:"security",fr:"Contrôle de sécurité",ar:"التفتيش الأمني",icon:"🔍",words:[
  w("L’agent de sécurité","موظف الأمن","security-agent"),w("Le détecteur de métaux","جهاز كشف المعادن","metal-detector"),w("Le scanner","جهاز الفحص","scanner"),w("Le bac","صينية التفتيش","tray"),w("La ceinture","الحزام","belt"),w("La veste","السترة","jacket"),w("Les poches","الجيوب","pockets"),w("Les liquides","السوائل","liquids"),w("L’ordinateur portable","الحاسوب المحمول","laptop"),w("La file de sécurité","طابور التفتيش","security-line")
 ]},
 {id:"waiting",fr:"Salle d’embarquement",ar:"صالة الانتظار",icon:"🛋️",words:[
  w("La porte d’embarquement","بوابة الصعود","gate"),w("La salle d’attente","صالة الانتظار","waiting-room"),w("Le siège","المقعد","seat"),w("L’écran des vols","شاشة الرحلات","flight-screen"),w("L’annonce","الإعلان الصوتي","announcement"),w("Le retard","التأخير","delay"),w("Le vol annulé","الرحلة الملغاة","cancelled"),w("Les toilettes","دورة المياه","restroom"),w("La boutique","المتجر","shop"),w("Le café","المقهى","cafe")
 ]},
 {id:"boarding",fr:"Embarquement",ar:"الصعود إلى الطائرة",icon:"🛫",words:[
  w("L’embarquement","الصعود إلى الطائرة","boarding"),w("La file d’attente","طابور الانتظار","queue"),w("L’hôtesse de l’air","مضيفة الطيران","flight-attendant"),w("Le pilote","الطيار","pilot"),w("La passerelle","جسر الصعود","jet-bridge"),w("La porte de l’avion","باب الطائرة","aircraft-door"),w("L’embarquement prioritaire","الصعود بالأولوية","priority"),w("Le dernier appel","النداء الأخير","final-call")
 ]},
 {id:"plane",fr:"Dans l’avion",ar:"داخل الطائرة",icon:"✈️",words:[
  w("L’avion","الطائرة","airplane"),w("Le couloir","الممر","aisle"),w("Le hublot","نافذة الطائرة","window"),w("La ceinture de sécurité","حزام الأمان","seatbelt"),w("Le compartiment à bagages","خزانة الأمتعة العلوية","overhead-bin"),w("La tablette","طاولة المقعد","tray-table"),w("Le gilet de sauvetage","سترة النجاة","life-jacket"),w("Le plateau-repas","وجبة الطائرة","meal"),w("L’eau","الماء","water"),w("Les écouteurs","سماعات الأذن","headphones")
 ]},
 {id:"arrivals",fr:"Arrivée et bagages",ar:"الوصول واستلام الحقائب",icon:"🧳",words:[
  w("Les arrivées","صالة الوصول","arrivals"),w("Le contrôle des passeports","الجوازات","passport-control"),w("La douane","الجمارك","customs"),w("La récupération des bagages","استلام الأمتعة","baggage-claim"),w("Le tapis à bagages","سير الحقائب","carousel"),w("Les bagages perdus","الأمتعة المفقودة","lost-luggage"),w("La sortie","المخرج","exit"),w("Le point de rencontre","نقطة الالتقاء","meeting-point"),w("Le bureau de change","مكتب تحويل العملات","currency-exchange"),w("La location de voitures","تأجير السيارات","car-rental")
 ]}
];

function speak(text:string){
 if(typeof window==="undefined"||!("speechSynthesis" in window))return;
 window.speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(text);u.lang="fr-FR";u.rate=.82;window.speechSynthesis.speak(u);
}

export default function AirportPage(){
 const [activeId,setActiveId]=useState<string|null>(null);
 const active=useMemo(()=>sections.find(s=>s.id===activeId)??null,[activeId]);
 return <main className="airport-page">
  <header className="airport-topbar">
   <Link href="/kingdom" className="airport-back"><ArrowRight/><span><b>Carte du Royaume</b><small>خريطة المملكة</small></span></Link>
   <div className="airport-logo"><Plane/><span><b>L’Aéroport</b><small>المطار</small></span></div>
  </header>

  <section className="airport-hero">
   <Image src="/airport/terminal-main.png" alt="Terminal de l'aéroport" fill priority className="airport-hero-image"/>
   <div className="airport-hero-overlay"/>
   <div className="airport-hero-copy"><span>LE CHÂTEAU DES LANGUES</span><h1>L’Aéroport</h1><small>المطار</small><p>Entrez dans chaque section pour apprendre le vocabulaire essentiel du voyage.</p><em>ادخل إلى كل قسم لتعلّم مفردات السفر الأساسية.</em></div>
  </section>

  <section className="airport-content">
   <div className="airport-title"><div><span>✦ PARCOURS DE VOYAGE ✦</span><h2>Les sections de l’aéroport</h2><small>أقسام المطار</small></div><p>{sections.reduce((n,s)=>n+s.words.length,0)} mots illustrés · مفردة مصورة</p></div>
   <div className="airport-sections">{sections.map((s,i)=><button key={s.id} className="airport-section-card" onClick={()=>setActiveId(s.id)}>
    <div className="airport-section-number">{String(i+1).padStart(2,"0")}</div><div className="airport-section-icon">{s.icon}</div><div><h3>{s.fr}</h3><small>{s.ar}</small><p>{s.words.length} mots</p></div><ChevronLeft/>
   </button>)}</div>
  </section>

  {active&&<div className="airport-modal" role="dialog" aria-modal="true"><section className="airport-panel">
   <div className="airport-panel-head"><button onClick={()=>setActiveId(null)} aria-label="Fermer"><X/></button><div><span>{active.icon}</span><h2>{active.fr}</h2><small>{active.ar}</small></div></div>
   <div className="airport-vocab-grid">{active.words.map((word)=><article className="airport-word" key={word.fr}>
    <div className="airport-word-image"><Image src={word.image} alt={word.fr} fill sizes="(max-width:700px) 48vw, 240px"/></div>
    <div className="airport-word-copy"><button onClick={()=>speak(word.fr)} aria-label={`Écouter ${word.fr}`}><Volume2/></button><h3>{word.fr}</h3><small>{word.ar}</small></div>
   </article>)}</div>
  </section></div>}
 </main>
}
