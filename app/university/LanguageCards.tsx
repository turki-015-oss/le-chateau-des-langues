"use client";

import {useEffect,useMemo,useState} from "react";
import {ChevronLeft,ChevronRight,Search,Volume2} from "lucide-react";
import {cancelFrenchSpeech,speakFrench} from "@/lib/frenchSpeech";
import "./language-cards.css";

type LanguageCard={fr:string;ar:string;glyph:string;article:string;accent:string};

const LANGUAGES:LanguageCard[]=[
 {fr:"arabe",ar:"العربية",glyph:"ع",article:"l’arabe",accent:"sand"},
 {fr:"français",ar:"الفرنسية",glyph:"é",article:"le français",accent:"blue"},
 {fr:"anglais",ar:"الإنجليزية",glyph:"A",article:"l’anglais",accent:"copper"},
 {fr:"espagnol",ar:"الإسبانية",glyph:"ñ",article:"l’espagnol",accent:"rose"},
 {fr:"allemand",ar:"الألمانية",glyph:"ß",article:"l’allemand",accent:"slate"},
 {fr:"italien",ar:"الإيطالية",glyph:"ì",article:"l’italien",accent:"green"},
 {fr:"portugais",ar:"البرتغالية",glyph:"ã",article:"le portugais",accent:"teal"},
 {fr:"chinois",ar:"الصينية",glyph:"文",article:"le chinois",accent:"red"},
 {fr:"japonais",ar:"اليابانية",glyph:"あ",article:"le japonais",accent:"plum"},
 {fr:"coréen",ar:"الكورية",glyph:"한",article:"le coréen",accent:"indigo"},
 {fr:"russe",ar:"الروسية",glyph:"Я",article:"le russe",accent:"ice"},
 {fr:"turc",ar:"التركية",glyph:"ç",article:"le turc",accent:"gold"},
];

export default function LanguageCards(){
 const [index,setIndex]=useState(0);
 const [search,setSearch]=useState("");
 const matches=useMemo(()=>{
  const query=search.trim().toLocaleLowerCase("fr").normalize("NFD").replace(/[\u0300-\u036f]/g,"");
  if(!query)return [];
  return LANGUAGES.map((language,position)=>({language,position})).filter(({language})=>`${language.fr} ${language.ar}`.toLocaleLowerCase("fr").normalize("NFD").replace(/[\u0300-\u036f]/g,"").includes(query));
 },[search]);
 const card=LANGUAGES[index];
 const speaking=`Je parle ${card.fr}.`;
 const learning=`J’apprends ${card.article}.`;
 const move=(step:number)=>{
  cancelFrenchSpeech();
  setIndex(current=>(current+step+LANGUAGES.length)%LANGUAGES.length);
 };
 useEffect(()=>()=>cancelFrenchSpeech(),[]);

 return <section className="a1-language-cards" aria-label="بطاقات التحدث عن اللغات">
  <div className="a1-language-intro">
   <strong>لغة واحدة، عبارتان مفيدتان</strong>
   <p>اضغط على الرمز لسماع اسم اللغة، أو على أي جملة لسماعها كاملة.</p>
  </div>
  <label className="a1-language-search"><Search aria-hidden="true"/><input value={search} onChange={event=>setSearch(event.target.value)} placeholder="ابحث عن لغة بالعربية أو الفرنسية" aria-label="ابحث عن لغة بالعربية أو الفرنسية"/></label>
  {search.trim()&&<div className="a1-language-search-results" aria-label="نتائج البحث عن اللغات">
   {matches.length?matches.map(({language,position})=><button type="button" key={language.fr} onClick={()=>{cancelFrenchSpeech();setIndex(position);setSearch("")}}><span lang="fr" dir="ltr">{language.fr}</span><span>{language.ar}</span></button>):<p>لا توجد لغة مطابقة.</p>}
  </div>}
  <div className="a1-language-stage" data-accent={card.accent}>
   <div className="a1-language-stage-glow" aria-hidden="true"/>
   <div className="a1-language-stage-top"><span>Parler · Apprendre</span><span>{String(index+1).padStart(2,"0")} / {String(LANGUAGES.length).padStart(2,"0")}</span></div>
   <article className="a1-language-card" key={card.fr}>
    <button className="a1-language-glyph" type="button" onClick={()=>void speakFrench(card.fr,{rate:.74})} aria-label={`استمع إلى اسم اللغة ${card.fr}`}>
     <span aria-hidden="true">{card.glyph}</span><i><Volume2 aria-hidden="true"/></i>
    </button>
    <div className="a1-language-name"><strong lang="fr" dir="ltr">{card.fr}</strong><span>{card.ar}</span></div>
    <div className="a1-language-phrases">
     <div className="a1-language-phrase">
      <small>أتحدث</small>
      <button type="button" onClick={()=>void speakFrench(speaking,{rate:.78})} aria-label={`استمع إلى ${speaking}`}><Volume2 aria-hidden="true"/><b lang="fr" dir="ltr">{speaking}</b></button>
      <span>أتحدث {card.ar}.</span>
     </div>
     <div className="a1-language-phrase">
      <small>أتعلم</small>
      <button type="button" onClick={()=>void speakFrench(learning,{rate:.78})} aria-label={`استمع إلى ${learning}`}><Volume2 aria-hidden="true"/><b lang="fr" dir="ltr">{learning}</b></button>
      <span>أتعلّم {card.ar}.</span>
     </div>
    </div>
   </article>
  </div>
  <nav className="a1-language-navigation" aria-label="التنقل بين اللغات">
   <button type="button" onClick={()=>move(-1)} aria-label="اللغة السابقة"><ChevronRight aria-hidden="true"/></button>
   <div className="a1-language-dots" aria-label={`البطاقة ${index+1} من ${LANGUAGES.length}`}>
    {LANGUAGES.map((language,position)=><button key={language.fr} type="button" className={position===index?"active":""} onClick={()=>{cancelFrenchSpeech();setIndex(position)}} aria-label={`اعرض ${language.ar}`} aria-current={position===index?"true":undefined}/>)}
   </div>
   <button type="button" onClick={()=>move(1)} aria-label="اللغة التالية"><ChevronLeft aria-hidden="true"/></button>
  </nav>
  <p className="a1-language-rule"><span lang="fr" dir="ltr">Je parle français.</span> من دون أداة، و<span lang="fr" dir="ltr">J’apprends le français.</span> مع أداة التعريف.</p>
 </section>;
}
