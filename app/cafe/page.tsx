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
type MenuKey = "boissons"|"viennoiseries"|"desserts"|"repas"|"specials";
type MenuProduct = {id:string;fr:string;ar:string;descFr:string;descAr:string;price:number;image:string};

const customerImages = [1,2,3,4,5,6].map(n=>`/cafe-v31/assets/portrait-${n}.webp`);
const menuCategories: {key:MenuKey;fr:string;ar:string;cover:string;products:MenuProduct[]}[] = [
 {key:"boissons",fr:"Boissons",ar:"المشروبات",cover:"/cafe-v31/assets/drinks-1.webp",products:[
  {id:"the-vert",fr:"Thé vert",ar:"شاي أخضر",descFr:"Un thé léger aux feuilles vertes.",descAr:"شاي خفيف من الأوراق الخضراء.",price:3,image:"/cafe-v31/assets/drinks-4.webp"},
  {id:"jus-orange",fr:"Jus d’orange",ar:"عصير برتقال",descFr:"Un jus frais pressé à l’orange.",descAr:"عصير برتقال طازج.",price:4,image:"/cafe-v31/assets/drinks-6.webp"},
  {id:"chocolat",fr:"Chocolat chaud",ar:"شوكولاتة ساخنة",descFr:"Une boisson chaude au chocolat.",descAr:"مشروب ساخن بالشوكولاتة.",price:4,image:"/cafe-v31/assets/drinks-7.webp"},
  {id:"eau",fr:"Une bouteille d’eau",ar:"قارورة ماء",descFr:"De l’eau minérale fraîche.",descAr:"ماء معدني بارد.",price:2,image:"/cafe-v31/assets/drinks-8.webp"},
 ]},
 {key:"viennoiseries",fr:"Viennoiseries",ar:"المخبوزات",cover:"/cafe-v31/assets/bakery-2.webp",products:[
  {id:"croissant",fr:"Un croissant",ar:"كرواسون",descFr:"Une viennoiserie feuilletée et croustillante.",descAr:"مخبوزة مورقة ومقرمشة.",price:3,image:"/cafe-v31/assets/bakery-2.webp"},
  {id:"pain-chocolat",fr:"Un pain au chocolat",ar:"خبز بالشوكولاتة",descFr:"Une pâte feuilletée avec du chocolat.",descAr:"عجينة مورقة مع الشوكولاتة.",price:3,image:"/cafe-v31/assets/bakery-3.webp"},
  {id:"croissant-amandes",fr:"Un croissant aux amandes",ar:"كرواسون باللوز",descFr:"Un croissant garni de crème d’amande.",descAr:"كرواسون محشو بكريمة اللوز.",price:4,image:"/cafe-v31/assets/bakery-4.webp"},
  {id:"brioche",fr:"Une brioche",ar:"بريوش",descFr:"Un pain doux, léger et moelleux.",descAr:"خبز حلو خفيف وطري.",price:3,image:"/cafe-v31/assets/bakery-6.webp"},
 ]},
 {key:"desserts",fr:"Desserts",ar:"الحلويات",cover:"/cafe-v31/assets/desserts-1.webp",products:[
  {id:"gateau-chocolat",fr:"Gâteau au chocolat",ar:"كيك بالشوكولاتة",descFr:"Un gâteau moelleux au chocolat noir.",descAr:"كيك طري بالشوكولاتة الداكنة.",price:5,image:"/cafe-v31/assets/desserts-1.webp"},
  {id:"cheesecake",fr:"Cheesecake",ar:"تشيز كيك",descFr:"Un gâteau au fromage avec des fruits rouges.",descAr:"كيك بالجبن والفواكه الحمراء.",price:5,image:"/cafe-v31/assets/desserts-2.webp"},
  {id:"tiramisu",fr:"Tiramisu",ar:"تيراميسو",descFr:"Un dessert crémeux au café.",descAr:"حلوى كريمية بنكهة القهوة.",price:5,image:"/cafe-v31/assets/desserts-3.webp"},
  {id:"creme-brulee",fr:"Crème brûlée",ar:"كريم بروليه",descFr:"Une crème à la vanille avec du caramel.",descAr:"كريمة بالفانيليا وطبقة كراميل.",price:4,image:"/cafe-v31/assets/desserts-4.webp"},
  {id:"macarons",fr:"Macarons",ar:"ماكرون",descFr:"De petits biscuits aux amandes.",descAr:"قطع صغيرة من حلوى اللوز.",price:4,image:"/cafe-v31/assets/desserts-5.webp"},
  {id:"tarte-fruits",fr:"Tarte aux fruits",ar:"تارت الفواكه",descFr:"Une tarte avec de la crème et des fruits frais.",descAr:"تارت بالكريمة والفواكه الطازجة.",price:5,image:"/cafe-v31/assets/desserts-7.webp"},
 ]},
 {key:"repas",fr:"Repas légers",ar:"الوجبات الخفيفة",cover:"/cafe-v31/assets/bakery-7.webp",products:[
  {id:"sandwich",fr:"Un sandwich au poulet",ar:"ساندويتش دجاج",descFr:"Du poulet, de la salade et du fromage.",descAr:"دجاج وسلطة وجبن.",price:6,image:"/cafe-v31/assets/bakery-7.webp"},
  {id:"salade",fr:"Une salade",ar:"سلطة",descFr:"Des légumes frais et une sauce légère.",descAr:"خضروات طازجة وصلصة خفيفة.",price:5,image:"/cafe-v31/assets/drinks-5.webp"},
  {id:"soupe",fr:"Une soupe du jour",ar:"شوربة اليوم",descFr:"Une soupe chaude préparée aujourd’hui.",descAr:"شوربة ساخنة محضرة اليوم.",price:5,image:"/cafe-v31/assets/drinks-7.webp"},
  {id:"quiche",fr:"Une quiche",ar:"كيش",descFr:"Une tarte salée aux œufs et au fromage.",descAr:"فطيرة مالحة بالبيض والجبن.",price:6,image:"/cafe-v31/assets/meal-quiche.webp"},
 ]},
 {key:"specials",fr:"Cafés spéciaux",ar:"القهوة المختصة",cover:"/cafe-v31/assets/drinks-3.webp",products:[
  {id:"cafe-filtre",fr:"Un café filtre",ar:"قهوة مقطرة",descFr:"Un café doux préparé lentement.",descAr:"قهوة خفيفة محضرة ببطء.",price:5,image:"/cafe-v31/assets/drinks-1.webp"},
  {id:"cafe-lait",fr:"Un café au lait",ar:"قهوة بالحليب",descFr:"Du café chaud avec du lait.",descAr:"قهوة ساخنة مع الحليب.",price:4,image:"/cafe-v31/assets/drinks-2.webp"},
  {id:"cafe-glace",fr:"Un café glacé",ar:"قهوة مثلجة",descFr:"Du café froid servi avec des glaçons.",descAr:"قهوة باردة تقدم مع الثلج.",price:5,image:"/cafe-v31/assets/drinks-5.webp"},
  {id:"cafe-noisette",fr:"Un café noisette",ar:"قهوة مع قليل من الحليب",descFr:"Un espresso avec une touche de lait.",descAr:"إسبريسو مع لمسة حليب.",price:4,image:"/cafe-v31/assets/special-noisette.webp"},
 ]},
];

export default function CafePage(){
 const [activity,setActivity]=useState<Activity>(null);
 const [customerIndex,setCustomerIndex]=useState(0);
 const [order,setOrder]=useState<string[]>([]);
 const [message,setMessage]=useState("");
 const [aiText,setAiText]=useState("Bonjour ! Je suis Luc. Je peux vous aider à servir les clients et à corriger votre français.");
 const [menuKey,setMenuKey]=useState<MenuKey|null>(null);
 const customer=cafeCustomers[customerIndex];
 const rushPrompts=useMemo(()=>cafeMenu.map(i=>({id:i.id,fr:`Je voudrais ${i.fr.toLowerCase()}, s'il vous plaît.`,ar:`أريد ${i.ar} من فضلك.`,emoji:i.emoji})),[]);
 const nextCustomer=()=>{setCustomerIndex((customerIndex+1)%cafeCustomers.length);setOrder([]);setMessage("")};
 const serve=()=>{const ok=[...order].sort().join("|")===[...customer.order].sort().join("|");setMessage(ok?"Très bien ! La commande est correcte.":"Presque… vérifiez la commande du client.");speakFrench(ok?"Très bien, merci beaucoup !":"Presque. Vérifiez la commande.")};
 const activeCategory=menuCategories.find(c=>c.key===menuKey);
 return <main className="c31-page">
  <header className="c31-top"><Link href="/" className="c31-back"><ArrowRight/> <span><b>Carte du Royaume</b><small>خريطة المملكة</small></span></Link><div className="c31-brand"><Coffee/><div><b>Chez Luc</b><small>مقهى لوك</small></div></div></header>
  <section className="c31-hero"><Image src="/cafe-v31/luc-hero.png" alt="Luc" fill priority className="c31-hero-img"/><div className="c31-hero-shade"/><div className="c31-luc-copy"><span><Sparkles/> Assistant intelligent</span><h1>Bonjour, je suis Luc.</h1><small>مرحبًا، أنا لوك.</small><p>{aiText}</p><button onClick={()=>speakFrench(aiText)}><Volume2/> Écouter <small>استمع</small></button></div></section>
  <section className="c31-grid"><button className="c31-main-card clients" onClick={()=>setActivity("clients")}><Image src="/cafe-v31/assets/portrait-1.webp" alt="Clients" fill/><span><b>Jeu des clients</b><small>لعبة الزبائن</small></span></button><button className="c31-main-card menu" onClick={()=>{setMenuKey(null);setActivity("menu")}}><Image src="/cafe-v31/assets/desserts-2.webp" alt="Menu" fill/><span><b>Menu du Café</b><small>قائمة المقهى</small></span></button></section>
  <section className="c31-activities"><div className="c31-section-title"><h2>Activités du Café</h2><small>أنشطة المقهى</small></div><div className="c31-activity-grid"><button onClick={()=>setActivity("sentences")}><Puzzle/><b>Atelier de phrases</b><small>ورشة تركيب الجمل</small></button><button onClick={()=>setActivity("listening")}><Headphones/><b>Laboratoire d'écoute</b><small>مختبر الاستماع</small></button><button onClick={()=>setActivity("journal")}><MessageCircle/><b>Carnet d'apprentissage</b><small>دفتر التعلم</small></button><button onClick={()=>setActivity("rush")}><Timer/><b>Défi de vitesse</b><small>تحدي السرعة</small></button><button onClick={()=>setActivity("clients")}><Coffee/><b>Jeu des clients</b><small>لعبة الزبائن</small></button></div></section>
  {activity&&<div className="c31-modal"><div className="c31-panel"><button className="c31-close" onClick={()=>setActivity(null)}><X/></button>
   {activity==="clients"&&<section className="c31-client-game"><div className="c31-client-head"><button onClick={()=>setCustomerIndex((customerIndex-1+cafeCustomers.length)%cafeCustomers.length)}><ChevronRight/></button><div className="c31-customer-portrait"><Image src={customerImages[customerIndex]} alt={customer.name} fill/></div><button onClick={nextCustomer}><ChevronLeft/></button></div><div className="c31-client-name"><h2>{customer.name}</h2><p>{customer.personality}</p><small>{customer.level} · Patience {customer.patience}%</small></div><div className="c31-request"><button onClick={()=>speakFrench(customer.requestFr)}><Volume2/></button><h3>{customer.requestFr}</h3><small>{customer.requestAr}</small></div><div className="c31-menu-picks">{cafeMenu.map(item=><button key={item.id} className={order.includes(item.id)?"active":""} onClick={()=>setOrder(v=>v.includes(item.id)?v.filter(x=>x!==item.id):[...v,item.id])}><span>{item.emoji}</span><b>{item.fr}</b><small>{item.ar}</small><i>{item.price}</i></button>)}</div><div className="c31-client-actions"><button onClick={serve}><Play/> Servir <small>تقديم الطلب</small></button><button onClick={()=>{const t="Bonjour, que désirez-vous aujourd'hui ?";setAiText(t);speakFrench(t)}}><Mic2/> Parler avec Luc <small>تحدث مع لوك</small></button></div>{message&&<p className="c31-message">{message}</p>}</section>}
   {activity==="menu"&&<section className="c31-menu-screen">{!activeCategory?<><div className="c31-section-title"><h2>Menu du Café</h2><small>قائمة المقهى</small></div><div className="c31-category-grid">{menuCategories.map(cat=><button key={cat.key} onClick={()=>setMenuKey(cat.key)}><Image src={cat.cover} alt={cat.fr} fill/><span><b>{cat.fr}</b><small>{cat.ar}</small><i onClick={(e)=>{e.stopPropagation();speakFrench(cat.fr)}}><Volume2/></i></span></button>)}</div></>:<><button className="c31-menu-back" onClick={()=>setMenuKey(null)}><ChevronRight/><span><b>Menu du Café</b><small>قائمة المقهى</small></span></button><div className="c31-section-title"><h2>{activeCategory.fr}</h2><small>{activeCategory.ar}</small><button onClick={()=>speakFrench(activeCategory.fr)}><Volume2/></button></div><div className="c31-product-grid">{activeCategory.products.map(product=><article key={product.id}><div className="c31-product-image"><Image src={product.image} alt={product.fr} fill/></div><div className="c31-product-copy"><div><h3>{product.fr}</h3><small>{product.ar}</small></div><button onClick={()=>speakFrench(`${product.fr}. ${product.descFr}`)}><Volume2/></button><p>{product.descFr}</p><small>{product.descAr}</small><b>{product.price}</b></div></article>)}</div></>}</section>}
   {activity==="journal"&&<CafeLearningJournal phrases={cafeLearningPhrases} masteredIds={[]} difficultIds={[]} reviewIndex={0} reviewAnswer="" reviewResult="idle" onAnswerChange={()=>{}} onToggleMastery={()=>{}} onSpeak={(text)=>speakFrench(text)} onCheck={()=>{}} onNext={()=>{}}/>}
   {activity==="rush"&&<CafeRushChallenge active={false} timeLeft={30} score={0} combo={0} bestScore={0} prompt={rushPrompts[0]} feedback="idle" options={rushPrompts} onStart={()=>{}} onPick={()=>{}} onSpeak={(text)=>speakFrench(text)}/>} 
   {activity==="sentences"&&<CafeSentenceBuilder puzzle={cafeSentencePuzzles[0]} selectedWords={[]} result="idle" solved={0} total={cafeSentencePuzzles.length} best={0} onPick={()=>{}} onRemove={()=>{}} onCheck={()=>{}} onNext={()=>{}} onReset={()=>{}} onSpeak={(text)=>speakFrench(text)}/>} 
   {activity==="listening"&&<CafeListeningLab prompt={cafeListeningPrompts[0]} answer="" result="idle" solved={0} total={cafeListeningPrompts.length} best={0} showHint={false} onAnswerChange={()=>{}} onListen={()=>speakFrench(cafeListeningPrompts[0].fr)} onCheck={()=>{}} onNext={()=>{}} onToggleHint={()=>{}}/>}
  </div></div>}
 </main>
}
