"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Search, Volume2, X } from "lucide-react";

type Animal = { fr: string; ar: string; slug: string };
type Category = { id: string; fr: string; ar: string; icon: string; animals: Animal[] };

const categories: Category[] = [
  { id:"mammals", fr:"Les mammifères", ar:"الثدييات", icon:"🦁", animals:[
    ["Le lion","الأسد","lion"],["Le tigre","النمر","tiger"],["Le léopard","الفهد المرقط","leopard"],["Le guépard","الفهد الصياد","cheetah"],["L'éléphant","الفيل","elephant"],["La girafe","الزرافة","giraffe"],["Le zèbre","الحمار الوحشي","zebra"],["Le rhinocéros","وحيد القرن","rhinoceros"],["L'hippopotame","فرس النهر","hippopotamus"],["Le chameau","الجمل","camel"],["Le gorille","الغوريلا","gorilla"],["Le chimpanzé","الشمبانزي","chimpanzee"],["L'ours brun","الدب البني","brown-bear"],["L'ours polaire","الدب القطبي","polar-bear"],["Le panda géant","الباندا العملاقة","giant-panda"],["Le loup","الذئب","wolf"],["Le renard","الثعلب","fox"],["Le kangourou","الكنغر","kangaroo"]
  ].map(([fr,ar,slug])=>({fr,ar,slug}))},
  { id:"birds", fr:"Les oiseaux", ar:"الطيور", icon:"🦅", animals:[
    ["L'aigle","النسر","eagle"],["Le faucon","الصقر","falcon"],["Le hibou","البومة","owl"],["Le perroquet","الببغاء","parrot"],["Le paon","الطاووس","peacock"],["Le flamant rose","طائر الفلامنجو","flamingo"],["L'autruche","النعامة","ostrich"],["Le pélican","البجع","pelican"],["Le cygne","البجعة","swan"],["Le pingouin","البطريق","penguin"],["La cigogne","اللقلق","stork"],["Le toucan","الطوقان","toucan"]
  ].map(([fr,ar,slug])=>({fr,ar,slug}))},
  { id:"reptiles", fr:"Les reptiles", ar:"الزواحف", icon:"🐍", animals:[
    ["Le crocodile","التمساح","crocodile"],["L'alligator","القاطور","alligator"],["Le cobra","الكوبرا","cobra"],["Le python","الأصلة","python-snake"],["Le varan","الورل","monitor-lizard"],["L'iguane","الإغوانا","iguana"],["Le caméléon","الحرباء","chameleon"],["La tortue terrestre","السلحفاة البرية","tortoise"],["La tortue marine","السلحفاة البحرية","sea-turtle"],["Le gecko","الوزغ","gecko"]
  ].map(([fr,ar,slug])=>({fr,ar,slug}))},
  { id:"marine", fr:"Les animaux marins", ar:"الحيوانات البحرية", icon:"🐬", animals:[
    ["Le dauphin","الدلفين","dolphin"],["La baleine bleue","الحوت الأزرق","blue-whale"],["L'orque","الحوت القاتل","orca"],["Le requin blanc","القرش الأبيض","great-white-shark"],["La raie manta","شيطان البحر","manta-ray"],["Le phoque","الفقمة","seal"],["Le morse","حصان البحر","walrus"],["La pieuvre","الأخطبوط","octopus"],["La méduse","قنديل البحر","jellyfish"],["L'hippocampe","فرس البحر","seahorse"]
  ].map(([fr,ar,slug])=>({fr,ar,slug}))},
  { id:"farm", fr:"Les animaux de la ferme", ar:"حيوانات المزرعة", icon:"🐄", animals:[
    ["La vache","البقرة","cow"],["Le cheval","الحصان","horse"],["Le mouton","الخروف","sheep"],["La chèvre","الماعز","goat"],["L'âne","الحمار","donkey"],["Le cochon","الخنزير","pig"],["Le lapin","الأرنب","rabbit"],["La poule","الدجاجة","chicken"],["Le canard","البطة","duck"],["La dinde","الديك الرومي","turkey"]
  ].map(([fr,ar,slug])=>({fr,ar,slug}))},
  { id:"insects", fr:"Les insectes", ar:"الحشرات", icon:"🦋", animals:[
    ["Le papillon","الفراشة","butterfly"],["L'abeille","النحلة","bee"],["La fourmi","النملة","ant"],["La coccinelle","الدعسوقة","ladybug"],["La libellule","اليعسوب","dragonfly"],["Le scarabée","الخنفساء","beetle"],["La sauterelle","الجندب","grasshopper"],["La mante religieuse","فرس النبي","praying-mantis"],["Le phasme","الحشرة العصوية","stick-insect"],["Le bourdon","النحلة الطنانة","bumblebee"]
  ].map(([fr,ar,slug])=>({fr,ar,slug}))}
];

function speak(text:string){ if(typeof window==="undefined") return; window.speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(text); u.lang="fr-FR"; u.rate=.86; window.speechSynthesis.speak(u); }

export default function ZooPage(){
 const [active,setActive]=useState(categories[0]);
 const [query,setQuery]=useState("");
 const animals=useMemo(()=>active.animals.filter(a=>`${a.fr} ${a.ar}`.toLowerCase().includes(query.toLowerCase())),[active,query]);
 return <main className="zoo-world" dir="rtl">
  <header className="zoo-header"><Link href="/kingdom" className="zoo-back"><ArrowLeft/> الخريطة</Link><strong>Le Château des Langues</strong><div className="zoo-avatar">🧑🏻‍🎓</div></header>
  <section className="zoo-hero"><img src="/images/zoo-hero.png" alt="حديقة حيوانات عالمية وجمل يمشي في وسطها"/><div className="zoo-hero-shade"/><div className="zoo-hero-copy"><span>Le Zoo</span><h1>حديقة الحيوانات</h1><p>اكتشف الحيوانات بالفرنسية داخل أقسام منظمة، مع صورة ونطق وترجمة لكل حيوان.</p></div></section>
  <nav className="zoo-categories" aria-label="أقسام الحيوانات">{categories.map(c=><button key={c.id} className={active.id===c.id?"active":""} onClick={()=>{setActive(c);setQuery("")}}><b>{c.icon}</b><span>{c.fr}<small>{c.ar}</small></span></button>)}</nav>
  <section className="zoo-content">
   <div className="zoo-title"><div><span>{active.fr}</span><h2>{active.ar}</h2><p>{active.animals.length} حيوانًا دون تكرار</p></div><label><Search/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="ابحث عن حيوان..."/>{query&&<button onClick={()=>setQuery("")}><X/></button>}</label></div>
   <div className="animal-grid">{animals.map((a,i)=><article key={a.slug} className="animal-card"><div className="animal-photo"><img loading="lazy" src={`https://loremflickr.com/720/520/${a.slug}?lock=${active.id}-${i+1}`} alt={`${a.fr} - ${a.ar}`}/><button onClick={()=>speak(a.fr)} aria-label={`استمع إلى ${a.fr}`}><Volume2/></button></div><div><h3 dir="ltr">{a.fr}</h3><p>{a.ar}</p></div></article>)}</div>
  </section>
 </main>
}
