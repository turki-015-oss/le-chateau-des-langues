"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Coffee, Headphones, MessageCircle, Mic2, Play, Puzzle, Sparkles, Timer, Volume2, X } from "lucide-react";
import { cafeCustomers, cafeMenu } from "@/data/cafe";
import CafeLearningJournal from "@/components/game/CafeLearningJournal";
import CafeRushChallenge from "@/components/game/CafeRushChallenge";
import CafeSentenceBuilder from "@/components/game/CafeSentenceBuilder";
import CafeListeningLab from "@/components/game/CafeListeningLab";
import { cafeLearningPhrases, cafeSentencePuzzles, cafeListeningPrompts } from "@/data/cafeCurriculum";
import { speakFrench } from "@/engine/audioEngine";

type Activity = "clients"|"menu"|"journal"|"rush"|"sentences"|"listening"|null;
const customerImages = [1,2,3,4,5,6].map(n=>`/cafe-v31/customer-${n}.png`);

export default function CafePage(){
 const [activity,setActivity]=useState<Activity>(null);
 const [customerIndex,setCustomerIndex]=useState(0);
 const [order,setOrder]=useState<string[]>([]);
 const [message,setMessage]=useState("");
 const [aiText,setAiText]=useState("Bonjour ! Je suis Luc. Je peux vous aider à servir les clients et à corriger votre français.");
 const customer=cafeCustomers[customerIndex];
 const rushPrompts=useMemo(()=>cafeMenu.map(i=>({id:i.id,fr:`Je voudrais ${i.fr.toLowerCase()}, s'il vous plaît.`,ar:`أريد ${i.ar} من فضلك.`,emoji:i.emoji})),[]);
 const nextCustomer=()=>{setCustomerIndex((customerIndex+1)%cafeCustomers.length);setOrder([]);setMessage("")};
 const serve=()=>{
  const ok=[...order].sort().join("|")===[...customer.order].sort().join("|");
  setMessage(ok?"Très bien ! La commande est correcte.":"Presque… vérifiez la commande du client.");
  speakFrench(ok?"Très bien, merci beaucoup !":"Presque. Vérifiez la commande.");
 };
 return <main className="c31-page">
  <header className="c31-top"><Link href="/" className="c31-back"><ArrowRight/> <span><b>Carte du Royaume</b><small>خريطة المملكة</small></span></Link><div className="c31-brand"><Coffee/><div><b>Chez Luc</b><small>مقهى لوك</small></div></div></header>
  <section className="c31-hero">
   <Image src="/cafe-v31/luc-hero.png" alt="Luc" fill priority className="c31-hero-img"/>
   <div className="c31-hero-shade"/>
   <div className="c31-luc-copy"><span><Sparkles/> Assistant intelligent</span><h1>Bonjour, je suis Luc.</h1><small>مرحبًا، أنا لوك.</small><p>{aiText}</p><button onClick={()=>speakFrench(aiText)}><Volume2/> Écouter <small>استمع</small></button></div>
  </section>
  <section className="c31-grid">
   <button className="c31-main-card clients" onClick={()=>setActivity("clients")}><Image src="/cafe-v31/customer-game.png" alt="Clients" fill/><span><b>Jeu des clients</b><small>لعبة الزبائن</small></span></button>
   <button className="c31-main-card menu" onClick={()=>setActivity("menu")}><Image src="/cafe-v31/menu-bilingual.png" alt="Menu" fill/><span><b>Menu du Café</b><small>قائمة المقهى</small></span></button>
  </section>
  <section className="c31-activities"><div className="c31-section-title"><h2>Activités du Café</h2><small>أنشطة المقهى</small></div><div className="c31-activity-grid">
   <button onClick={()=>setActivity("sentences")}><Puzzle/><b>Atelier de phrases</b><small>ورشة تركيب الجمل</small></button>
   <button onClick={()=>setActivity("listening")}><Headphones/><b>Laboratoire d'écoute</b><small>مختبر الاستماع</small></button>
   <button onClick={()=>setActivity("journal")}><MessageCircle/><b>Carnet d'apprentissage</b><small>دفتر التعلم</small></button>
   <button onClick={()=>setActivity("rush")}><Timer/><b>Défi de vitesse</b><small>تحدي السرعة</small></button>
   <button onClick={()=>setActivity("clients")}><Coffee/><b>Jeu des clients</b><small>لعبة الزبائن</small></button>
  </div></section>
  {activity&&<div className="c31-modal"><div className="c31-panel"><button className="c31-close" onClick={()=>setActivity(null)}><X/></button>
   {activity==="clients"&&<section className="c31-client-game"><div className="c31-client-head"><button onClick={()=>setCustomerIndex((customerIndex-1+cafeCustomers.length)%cafeCustomers.length)}><ChevronRight/></button><div className="c31-customer-portrait"><Image src={customerImages[customerIndex]} alt={customer.name} fill/></div><button onClick={nextCustomer}><ChevronLeft/></button></div><div className="c31-client-name"><h2>{customer.name}</h2><p>{customer.personality}</p><small>{customer.level} · Patience {customer.patience}%</small></div><div className="c31-request"><button onClick={()=>speakFrench(customer.requestFr)}><Volume2/></button><h3>{customer.requestFr}</h3><small>{customer.requestAr}</small></div><div className="c31-menu-picks">{cafeMenu.map(item=><button key={item.id} className={order.includes(item.id)?"active":""} onClick={()=>setOrder(v=>v.includes(item.id)?v.filter(x=>x!==item.id):[...v,item.id])}><span>{item.emoji}</span><b>{item.fr}</b><small>{item.ar}</small><i>{item.price}</i></button>)}</div><div className="c31-client-actions"><button onClick={serve}><Play/> Servir <small>تقديم الطلب</small></button><button onClick={()=>{const t="Bonjour, que désirez-vous aujourd'hui ?";setAiText(t);speakFrench(t)}}><Mic2/> Parler avec Luc <small>تحدث مع لوك</small></button></div>{message&&<p className="c31-message">{message}</p>}</section>}
   {activity==="menu"&&<section className="c31-menu-screen"><div className="c31-section-title"><h2>Menu du Café</h2><small>قائمة المقهى</small></div><div className="c31-category-grid">{[
    ["Boissons","المشروبات","/cafe-v31/menu-drinks.png"],["Viennoiseries","المخبوزات","/cafe-v31/menu-bakery.png"],["Desserts","الحلويات","/cafe-v31/menu-desserts.png"],["Repas légers","الوجبات الخفيفة","/cafe-v31/menu-bilingual.png"],["Cafés spéciaux","القهوة المختصة","/cafe-v31/menu-drinks.png"]].map(([fr,ar,img])=><button key={fr} onClick={()=>speakFrench(fr)}><Image src={img} alt={fr} fill/><span><b>{fr}</b><small>{ar}</small><Volume2/></span></button>)}</div></section>}
   {activity==="journal"&&<CafeLearningJournal phrases={cafeLearningPhrases} masteredIds={[]} difficultIds={[]} reviewIndex={0} reviewAnswer="" reviewResult="idle" onAnswerChange={()=>{}} onToggleMastery={()=>{}} onSpeak={(text)=>speakFrench(text)} onCheck={()=>{}} onNext={()=>{}}/>}
   {activity==="rush"&&<CafeRushChallenge active={false} timeLeft={30} score={0} combo={0} bestScore={0} prompt={rushPrompts[0]} feedback="idle" options={rushPrompts} onStart={()=>{}} onPick={()=>{}} onSpeak={(text)=>speakFrench(text)}/>}
   {activity==="sentences"&&<CafeSentenceBuilder puzzle={cafeSentencePuzzles[0]} selectedWords={[]} result="idle" solved={0} total={cafeSentencePuzzles.length} best={0} onPick={()=>{}} onRemove={()=>{}} onCheck={()=>{}} onNext={()=>{}} onReset={()=>{}} onSpeak={(text)=>speakFrench(text)}/>}
   {activity==="listening"&&<CafeListeningLab prompt={cafeListeningPrompts[0]} answer="" result="idle" solved={0} total={cafeListeningPrompts.length} best={0} showHint={false} onAnswerChange={()=>{}} onListen={()=>speakFrench(cafeListeningPrompts[0].fr)} onCheck={()=>{}} onNext={()=>{}} onToggleHint={()=>{}}/>}
  </div></div>}
 </main>
}
