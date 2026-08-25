"use client";

import Link from "next/link";
import {useMemo,useRef,useState} from "react";
import {AlertTriangle,ArrowLeft,BookOpen,Check,ChevronRight,ExternalLink,Search,Sparkles,Volume2,X} from "lucide-react";
import {speakFrench} from "@/lib/frenchSpeech";
import {a1Lessons,type GrammarLesson} from "../grammarData";
import "../grammar.css";

const levelNames:Record<string,[string,string]>={a1:["Fondations","التأسيس"],a2:["Structures essentielles","التراكيب الأساسية"],b1:["Intermédiaire","المتوسط"],b2:["Précision et nuance","الدقة والأسلوب"],c1:["Avancé","المتقدم"],c2:["Maîtrise","الإتقان"]};
const separatorBetween=(current:string,next?:string)=>!next||current.endsWith("’")||current.endsWith("'")||next.startsWith("-")?"":" ";
const finalPunctuation=(sentence:string)=>{const mark=sentence.trim().match(/[.!?…]$/)?.[0]??"";return mark==="?"?" ?":mark};

export default function GrammarLevelClient({level}:{level:string}){
 const [query,setQuery]=useState("");const [activeId,setActiveId]=useState(level==="a1"?a1Lessons[0].id:"");const detailRef=useRef<HTMLElement>(null);const lessons=level==="a1"?a1Lessons:[];
 const filtered=useMemo(()=>{const q=query.trim().toLocaleLowerCase("fr");return q?lessons.filter(l=>[l.titleFr,l.titleAr,l.category,l.summary,l.rule,l.formula,...l.examples.flatMap(example=>[example.fr,example.ar])].join(" ").toLocaleLowerCase("fr").includes(q)):lessons},[lessons,query]);
 const active=lessons.find(l=>l.id===activeId)??filtered[0];
 const openLesson=(lesson:GrammarLesson)=>{setActiveId(lesson.id);window.setTimeout(()=>detailRef.current?.scrollIntoView({behavior:"smooth",block:"start"}),80)};
 if(level!=="a1")return <main className="grammar-level-empty" dir="rtl"><div><span>{level.toUpperCase()}</span><h1>{levelNames[level]?.[0]}</h1><h2>{levelNames[level]?.[1]}</h2><p>سيُبنى هذا المستوى بعد اعتماد منهج A1، بنفس بنية الشرح والمراجع والنطق.</p><Link href="/grammar"><ChevronRight/> العودة إلى قاعة القواعد</Link></div></main>;
 return <main className="grammar-course" dir="rtl">
  <header className="grammar-course-header"><Link href="/grammar"><ChevronRight/><span><b>قاعة القواعد</b><small>SALLE DE GRAMMAIRE</small></span></Link><div><span>A1</span><h1>LES FONDATIONS</h1><h2>المنهج الكامل لقواعد A1</h2><p>{lessons.length} درسًا متدرجًا، بأمثلة فرنسية وترجمة عربية سياقية مدققة.</p></div></header>
  <section className="grammar-course-layout">
   <aside className="grammar-index"><div className="grammar-search"><Search/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="ابحث عن قاعدة… مثال: النفي أو articles" aria-label="البحث في قواعد A1"/>{query&&<button onClick={()=>setQuery("")} aria-label="مسح البحث"><X/></button>}</div><div className="grammar-index-heading"><span>فهرس A1</span><small>{filtered.length} من {lessons.length} درسًا</small></div><div className="grammar-index-list">{filtered.map(lesson=><button key={lesson.id} className={active?.id===lesson.id?"active":""} onClick={()=>openLesson(lesson)}><i>{String(lesson.number).padStart(2,"0")}</i><span><b dir="ltr">{lesson.titleFr}</b><small>{lesson.titleAr}</small></span><ArrowLeft/></button>)}{!filtered.length&&<p>لا توجد قاعدة مطابقة. جرّب كلمة أخرى.</p>}</div></aside>
   {active&&<article className="grammar-lesson" ref={detailRef}><div className="grammar-lesson-top"><span>LEÇON {String(active.number).padStart(2,"0")} · {active.category}</span><button onClick={()=>void speakFrench(active.titleFr,{rate:.76})}><Volume2/> نطق العنوان</button></div><h1 dir="ltr">{active.titleFr}</h1><h2>{active.titleAr}</h2><p className="grammar-lesson-summary">{active.summary}</p>
    <section className="grammar-rule-block"><div><BookOpen/><b>القاعدة</b></div><p>{active.rule}</p><code dir="ltr">{active.formula}</code></section>
    <section className="grammar-examples"><header><Sparkles/><div><b>أمثلة محللة</b><small>كل ترجمة تنقل معنى الجملة في سياقها، وليست ترجمة كلمة بكلمة. اضغط على الصوت لسماع الفرنسية.</small></div></header>{active.examples.map((example,index)=><div className="grammar-example" key={example.fr}><button onClick={()=>void speakFrench(example.fr,{rate:.72})} aria-label={`نطق الجملة ${example.fr}`}><Volume2/></button><div><p dir="ltr">{example.parts.map((part,partIndex)=><span key={`${part.text}-${partIndex}`} className={`role-${part.role}`}>{part.text}{separatorBetween(part.text,example.parts[partIndex+1]?.text)}</span>)}{finalPunctuation(example.fr)}</p><small><b>المعنى:</b> {example.ar}</small></div><i>{index+1}</i></div>)}<div className="grammar-role-key"><span className="role-subject">الفاعل</span><span className="role-verb">الفعل</span><span className="role-object">المكمل</span><span className="role-marker">الأداة</span><span className="role-adjective">الصفة</span></div></section>
    <section className="grammar-compare"><div className="correct"><Check/><span><b>صحيح</b><p dir="ltr">{active.correct}</p><small><b>المعنى:</b> {active.correctAr}</small><button onClick={()=>void speakFrench(active.correct,{rate:.72})}><Volume2/></button></span></div><div className="incorrect"><X/><span><b>غير صحيح</b><p dir="ltr">{active.incorrect}</p><small><b>السبب:</b> {active.incorrectReason}</small></span></div></section>
    <section className="grammar-note"><AlertTriangle/><div><b>انتبه</b><p>{active.note}</p></div></section>
    <footer className="grammar-sources"><div><b>المراجع المعتمدة لهذا المنهج</b><small>تُراجع القواعد والأمثلة وفق الفرنسية المعيارية وكفاءات CECRL A1.</small></div><a href="https://www.academie-francaise.fr/questions-de-langue" target="_blank" rel="noreferrer">Académie française <ExternalLink/></a><a href="https://eduscol.education.fr/document/45262/download?attachment=" target="_blank" rel="noreferrer">Éduscol <ExternalLink/></a><a href="https://www.france-education-international.fr/document/cecrldescripteursa1" target="_blank" rel="noreferrer">CECRL A1 <ExternalLink/></a><a href="https://www.france-education-international.fr/document/cecrl" target="_blank" rel="noreferrer">Inventaire A1 <ExternalLink/></a></footer>
   </article>}
  </section>
 </main>
}
