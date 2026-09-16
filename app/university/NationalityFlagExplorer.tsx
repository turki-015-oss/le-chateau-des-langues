"use client";

import {useEffect,useMemo,useState} from "react";
import {createPortal} from "react-dom";
import {Search,Volume2,X} from "lucide-react";
import {cancelFrenchSpeech,speakFrench,speakFrenchSequence} from "@/lib/frenchSpeech";
import {A1_COUNTRY_FLAGS,type CountryFlagEntry} from "./country-data";
import {A1_NATIONALITIES} from "./nationality-data";
import "./country-flags.css";

const flagPath=(code:string)=>`/images/university/country-flags/${code.toLowerCase()}.svg`;
const normalize=(value:string)=>value.toLocaleLowerCase("fr").normalize("NFD").replace(/[\u0300-\u036f]/g,"");

export default function NationalityFlagExplorer(){
 const [search,setSearch]=useState("");
 const [active,setActive]=useState<CountryFlagEntry|null>(null);
 const results=useMemo(()=>{
  const query=normalize(search.trim());
  if(!query)return A1_COUNTRY_FLAGS;
  return A1_COUNTRY_FLAGS.filter(country=>{
   const nationality=A1_NATIONALITIES[country.code];
   return normalize(`${country.fr} ${country.ar} ${nationality.m} ${nationality.f}`).includes(query);
  });
 },[search]);

 useEffect(()=>()=>cancelFrenchSpeech(),[]);
 useEffect(()=>{
  if(!active)return;
  const onKeyDown=(event:KeyboardEvent)=>{if(event.key==="Escape")close()};
  document.addEventListener("keydown",onKeyDown);
  return ()=>document.removeEventListener("keydown",onKeyDown);
 },[active]);

 const open=(country:CountryFlagEntry)=>{
  setActive(country);
  const forms=A1_NATIONALITIES[country.code];
  void speakFrenchSequence([country.fr,`Je suis ${forms.m}.`,`Je suis ${forms.f}.`],520,{rate:.78});
 };
 const close=()=>{cancelFrenchSpeech();setActive(null)};

 return <section className="a1-country-explorer a1-nationality-explorer" aria-label="الجنسيات بالفرنسية">
  <div className="a1-country-explorer-intro">
   <strong>اختر علمًا لتتعلّم الجنسية للمذكّر والمؤنّث</strong>
   <p>تعرّف إلى الصيغتين بالفرنسية، واستمع إلى كل مثال على حدة.</p>
  </div>
  <label className="a1-country-search">
   <Search aria-hidden="true"/>
   <input value={search} onChange={event=>setSearch(event.target.value)} placeholder="ابحث عن بلد أو جنسية بالعربية أو الفرنسية" aria-label="ابحث عن بلد أو جنسية بالعربية أو الفرنسية"/>
  </label>
  <div className="a1-country-flag-grid" aria-label="أعلام البلدان والجنسيات">
   {results.map(country=><button key={country.code} type="button" onClick={()=>open(country)} aria-label={`افتح جنسيتَي ${country.ar}`}>
    <img src={flagPath(country.code)} alt="" loading="lazy"/>
   </button>)}
   {!results.length&&<p className="a1-country-empty">لا توجد نتيجة مطابقة. جرّب اسمًا آخر.</p>}
  </div>
  <p className="a1-country-count">{results.length} {results.length===A1_COUNTRY_FLAGS.length?"علمًا":"نتيجة"}</p>

  {active&&createPortal(<div className="a1-country-dialog-backdrop" onMouseDown={event=>{if(event.target===event.currentTarget)close()}}>
   <article className="a1-country-dialog a1-nationality-dialog" role="dialog" aria-modal="true" aria-label={`جنسيات ${active.ar}`}>
    <button type="button" className="a1-country-dialog-close" onClick={close} aria-label="إغلاق بطاقة الجنسية"><X/></button>
    <div className="a1-country-dialog-flag">
     <img src={flagPath(active.code)} alt={`علم ${active.ar}`}/>
    </div>
    <div className="a1-country-dialog-content">
     <span className="a1-country-dialog-eyebrow">Les nationalités</span>
     <h3 dir="ltr">{active.fr}</h3>
     <p className="a1-country-dialog-ar">{active.ar}</p>
     <div className="a1-nationality-forms">
      {(["m","f"] as const).map(gender=>{
       const word=A1_NATIONALITIES[active.code][gender];
       const sentence=`Je suis ${word}.`;
       return <div className="a1-nationality-form" key={gender}>
        <div className="a1-nationality-form-head"><span>{gender==="m"?"المذكّر":"المؤنّث"}</span><strong dir="ltr">{word}</strong></div>
        <button type="button" onClick={()=>void speakFrench(sentence,{rate:.76})} aria-label={`استمع إلى ${sentence}`}>
         <Volume2 aria-hidden="true"/><span dir="ltr">{sentence}</span>
        </button>
        <p>المعنى: أنا من {active.ar}. <small>({gender==="m"?"بصيغة المذكّر":"بصيغة المؤنّث"})</small></p>
       </div>;
      })}
     </div>
    </div>
   </article>
  </div>,document.body)}
 </section>;
}
