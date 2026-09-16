"use client";

import {useEffect,useMemo,useState} from "react";
import {createPortal} from "react-dom";
import {Search,Volume2,X} from "lucide-react";
import {cancelFrenchSpeech,speakFrenchSequence} from "@/lib/frenchSpeech";
import {A1_COUNTRY_FLAGS,countryOriginSentence,countryStaySentence,type CountryFlagEntry} from "./country-data";
import "./country-flags.css";

const flagPath=(code:string)=>`/images/university/country-flags/${code.toLowerCase()}.svg`;
const normalizeSearch=(text:string)=>text.toLocaleLowerCase("fr").normalize("NFD").replace(/[\u0300-\u036f]/g,"");

export default function CountryFlagExplorer(){
 const [search,setSearch]=useState("");
 const [active,setActive]=useState<CountryFlagEntry|null>(null);
 const [audioStage,setAudioStage]=useState(0);
 const results=useMemo(()=>{
  const query=normalizeSearch(search.trim());
  if(!query)return A1_COUNTRY_FLAGS;
  return A1_COUNTRY_FLAGS.filter(country=>normalizeSearch(`${country.fr} ${country.ar}`).includes(query));
 },[search]);

 useEffect(()=>()=>cancelFrenchSpeech(),[]);
 useEffect(()=>{
  if(!active)return;
  const onKeyDown=(event:KeyboardEvent)=>{
   if(event.key==="Escape"){
    cancelFrenchSpeech();
    setActive(null);
   }
  };
  document.addEventListener("keydown",onKeyDown);
  return ()=>document.removeEventListener("keydown",onKeyDown);
 },[active]);

 const play=(country:CountryFlagEntry)=>{
  setActive(country);
  setAudioStage(0);
  void speakFrenchSequence(
   [country.fr,countryStaySentence(country),countryOriginSentence(country)],
   650,
   {rate:.76},
   index=>setAudioStage(index)
  );
 };
 const close=()=>{
  cancelFrenchSpeech();
  setActive(null);
 };

 return <section className="a1-country-explorer" aria-label="أعلام البلدان ونطقها بالفرنسية">
  <div className="a1-country-explorer-intro">
   <strong>اختر علمًا لتسمع اسم البلد وجملتين عنه</strong>
   <p>استمع إلى اسم البلد، ثم كيف تقول «أسكن في…» و«أنا من…» بالفرنسية.</p>
  </div>
  <label className="a1-country-search">
   <Search aria-hidden="true"/>
   <input value={search} onChange={event=>setSearch(event.target.value)} placeholder="ابحث باسم البلد بالعربية أو الفرنسية" aria-label="ابحث باسم البلد بالعربية أو الفرنسية"/>
  </label>
  <div className="a1-country-flag-grid" aria-label="قائمة أعلام البلدان">
   {results.map(country=><button key={country.code} type="button" onClick={()=>play(country)} aria-label={`افتح بطاقة ${country.ar} واستمع إلى اسمها بالفرنسية`}>
    <img src={flagPath(country.code)} alt="" loading="lazy"/>
   </button>)}
   {!results.length&&<p className="a1-country-empty">لا توجد نتيجة مطابقة. جرّب اسمًا آخر.</p>}
  </div>
  <p className="a1-country-count">{results.length} {results.length===A1_COUNTRY_FLAGS.length?"علمًا":"نتيجة"}</p>

  {active&&createPortal(<div className="a1-country-dialog-backdrop" onMouseDown={event=>{if(event.target===event.currentTarget)close()}}>
   <article className="a1-country-dialog" role="dialog" aria-modal="true" aria-label={`بطاقة ${active.ar}`}>
    <button type="button" className="a1-country-dialog-close" onClick={close} aria-label="إغلاق بطاقة البلد"><X/></button>
    <button type="button" className="a1-country-dialog-flag" onClick={()=>play(active)} aria-label={`أعد نطق ${active.fr} والجملتين`}>
     <img src={flagPath(active.code)} alt={`علم ${active.ar}`}/>
     <span><Volume2/> إعادة الاستماع</span>
    </button>
    <div className="a1-country-dialog-content">
     <span className="a1-country-dialog-eyebrow">Écouter et découvrir</span>
     <h3 dir="ltr">{active.fr}</h3>
     <p className="a1-country-dialog-ar">{active.ar}</p>
     <div className="a1-country-phrases" aria-live="polite">
      {audioStage>=1&&<div className="a1-country-phrase"><strong dir="ltr">{countryStaySentence(active)}</strong><span>أسكن في {active.ar}.</span></div>}
      {audioStage>=2&&<div className="a1-country-phrase"><strong dir="ltr">{countryOriginSentence(active)}</strong><span>أنا من {active.ar}.</span></div>}
     </div>
    </div>
   </article>
  </div>,document.body)}
 </section>;
}
