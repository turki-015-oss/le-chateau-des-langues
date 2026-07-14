"use client";
import {useState} from "react";
import {Volume2} from "lucide-react";

const worlds=[
["La Famille","العائلة","Bonjour ! Comment s'appelle ton frère ?","مرحبًا! ما اسم أخيك؟","18% 55%","A1"],
["Le Marché","السوق الشعبي","Bonjour ! Qu'est-ce que vous désirez ?","مرحبًا! ماذا ترغب؟","48% 58%","A1"],
["Le Restaurant","المطعم","Bonsoir. Avez-vous une réservation ?","مساء الخير. هل لديكم حجز؟","78% 58%","A2"],
["L'Hôpital","المستشفى","Où avez-vous mal ?","أين تشعر بالألم؟","82% 33%","B1"],
["Les Transports","المواصلات","À quelle heure part le prochain train ?","متى ينطلق القطار التالي؟","52% 82%","A2"],
["La Bibliothèque Royale","المكتبة الملكية","Je cherche un livre sur l'histoire de France.","أبحث عن كتاب عن تاريخ فرنسا.","22% 30%","C1"]
];

export default function Home(){
 const [entered,setEntered]=useState(false);
 const [mode,setMode]=useState<"beginner"|"intermediate"|"immersion">("beginner");
 const [selected,setSelected]=useState<number|null>(null);
 const showArabic=mode==="beginner";
 const speak=(t:string)=>{const u=new SpeechSynthesisUtterance(t);u.lang="fr-FR";u.rate=mode==="beginner"?.78:mode==="intermediate"?.92:1;speechSynthesis.speak(u)};
 return <main>
 {!entered&&<section className="intro"><div className="shade"/><div className="introbox"><div className="shield"/><span>Bienvenue dans</span><h1>Le Château des Langues</h1><p>Chaque mot ouvre une porte.</p><small>كل كلمة تفتح بابًا.</small><button onClick={()=>setEntered(true)}>Entrer dans le Royaume</button></div><button className="skip" onClick={()=>setEntered(true)}>تخطي المقدمة</button></section>}
 <header><div className="brand"><div className="shield small"/><div><b>Le Château des Langues</b><span>القلعة اللغوية</span></div></div><nav><a href="#kingdom">المملكة</a><a href="#modes">وضع التعلم</a></nav><strong>A1 · Français</strong></header>
 <section className="hero"><div><span className="label">المملكة مكتملة وتنتظرك</span><h2>عِش الفرنسية<br/><em>داخل عالم عربي حي</em></h2><p>جميع الشخصيات تتحدث الفرنسية. تظهر الترجمة العربية فقط في وضع المبتدئ.</p><a href="#kingdom">اكتشف المملكة</a></div>
 <aside id="modes"><h3>وضع التعلم</h3>
 <button className={mode==="beginner"?"active":""} onClick={()=>setMode("beginner")}>مبتدئ<small>فرنسية + عربية</small></button>
 <button className={mode==="intermediate"?"active":""} onClick={()=>setMode("intermediate")}>متوسط<small>فرنسية مع تلميحات</small></button>
 <button className={mode==="immersion"?"active":""} onClick={()=>setMode("immersion")}>انغماس كامل<small>Français uniquement</small></button>
 </aside></section>
 <section id="kingdom" className="kingdom"><div className="title"><div><span>كل المناطق مفتوحة</span><h2>Choisissez votre monde</h2></div><p>اختر أي منطقة وتعلّم من المواقف الواقعية.</p></div>
 <div className="grid">{worlds.map((w,i)=><article key={w[0]} style={{backgroundPosition:w[4]}}><div className="top"><span>{w[5]}</span><button onClick={()=>speak(w[2])}><Volume2 size={18}/></button></div><div className="content"><h3>{w[0]}</h3><h4>{w[1]}</h4><div className="dialog"><b>{w[2]}</b>{showArabic&&<span>{w[3]}</span>}</div><button onClick={()=>w[0]==="La Famille" ? window.location.href="/family" : setSelected(i)}>Entrer dans ce monde</button></div></article>)}</div></section>
 {selected!==null&&<div className="modal" onClick={()=>setSelected(null)}><div className="box" onClick={e=>e.stopPropagation()}><button className="x" onClick={()=>setSelected(null)}>×</button><span className="level">{worlds[selected][5]}</span><h2>{worlds[selected][0]}</h2><h3>{worlds[selected][1]}</h3><button className="listen" onClick={()=>speak(worlds[selected][2])}><Volume2/> استمع</button><p>{worlds[selected][2]}</p>{showArabic&&<small>{worlds[selected][3]}</small>}<button className="start">Commencer la mission</button></div></div>}
 <footer>Le Château des Langues — v0.3</footer>
 </main>
}