"use client";

import Link from "next/link";
import {useMemo,useState} from "react";
import {ArrowLeft,ArrowRight,BookOpen,ChevronLeft,ChevronRight,LayoutGrid,MessageCircle,PauseCircle,Store,Volume2} from "lucide-react";
import {marketConversations,marketDepartments} from "@/data/market";
import {cancelFrenchSpeech,speakFrench} from "@/lib/frenchSpeech";

const DIALOGUE_PAGE_SIZE=6;
const PRODUCT_PAGE_SIZE=24;

export default function MarketPage(){
 const [departmentId,setDepartmentId]=useState<string|null>(null);
 const [conversationId,setConversationId]=useState<string|null>(null);
 const [dialoguePage,setDialoguePage]=useState(0);
 const [productPage,setProductPage]=useState(0);
 const [speakingId,setSpeakingId]=useState<string|null>(null);
 const department=marketDepartments.find(item=>item.id===departmentId)??null;
 const conversation=marketConversations.find(item=>item.id===conversationId)??null;
 const shelves=marketDepartments.filter(item=>item.kind==="shelf");
 const baskets=marketDepartments.filter(item=>item.kind==="basket");
 const dialoguePages=conversation?Math.ceil(conversation.lines.length/DIALOGUE_PAGE_SIZE):0;
 const productPages=department?Math.ceil(department.products.length/PRODUCT_PAGE_SIZE):0;
 const visibleLines=useMemo(()=>conversation?.lines.slice(dialoguePage*DIALOGUE_PAGE_SIZE,(dialoguePage+1)*DIALOGUE_PAGE_SIZE)??[],[conversation,dialoguePage]);
 const visibleProducts=useMemo(()=>department?.products.slice(productPage*PRODUCT_PAGE_SIZE,(productPage+1)*PRODUCT_PAGE_SIZE)??[],[department,productPage]);

 const scrollToContent=()=>window.setTimeout(()=>document.getElementById("market-learning")?.scrollIntoView({behavior:"smooth",block:"start"}),30);
 const openDepartment=(id:string)=>{cancelFrenchSpeech();setConversationId(null);setDepartmentId(id);setProductPage(0);setSpeakingId(null);scrollToContent()};
 const openConversation=(id:string)=>{cancelFrenchSpeech();setDepartmentId(null);setConversationId(id);setDialoguePage(0);setSpeakingId(null);scrollToContent()};
 const goHome=()=>{cancelFrenchSpeech();setDepartmentId(null);setConversationId(null);setDialoguePage(0);setProductPage(0);setSpeakingId(null);scrollToContent()};
 const speak=(id:string,text:string,rate=.76)=>{
  setSpeakingId(id);
  void speakFrench(text,{rate,onEnd:()=>setSpeakingId(current=>current===id?null:current),onError:()=>setSpeakingId(null)});
 };
 const playFullConversation=()=>{
  if(!conversation)return;
  const text=conversation.lines.map(line=>line.fr).join(" … ");
  speak(`conversation-${conversation.id}`,text,.7);
 };

 return <main className="market-world" dir="rtl">
  <header className="market-header">
   <Link href="/" className="back-link"><ArrowRight size={20}/> المملكة</Link>
   <div className="market-brand"><Store/><div><strong>السوق الكبير</strong><span>Le Grand Marché</span></div></div>
   <button className="market-all-button" onClick={goHome}><LayoutGrid/><span>كل الأقسام</span></button>
  </header>

  <section className="market-hero">
   <div className="market-overlay"/>
   <div className="market-copy">
    <span>Vocabulaire interactif · مفردات تفاعلية</span>
    <h1>السوق الكبير</h1>
    <p>تجوّل بين الأرفف والسلال، واضغط على صورة أي منتج لتسمع اسمه بالفرنسية.</p>
    <button onClick={()=>{goHome();scrollToContent()}}><BookOpen/> ابدأ التعلّم</button>
   </div>
  </section>

  <section id="market-learning" className="market-learning">
   {!department&&!conversation&&<>
    <div className="market-learning-heading">
     <div><span>Les produits</span><h2>المنتجات</h2><p>اختر رفًا لفتحه والتعرّف على جميع المنتجات داخله.</p></div>
     <strong>{marketDepartments.reduce((sum,item)=>sum+item.products.length,0)} كلمة مصوّرة</strong>
    </div>

    <section className="market-shelf-zone">
     <div className="market-zone-title"><span>01</span><div><small>Les rayons</small><h3>الأرفف</h3></div></div>
     <div className="market-department-grid">
      {shelves.map((item,index)=><button key={item.id} className="market-department-card" onClick={()=>openDepartment(item.id)} aria-label={`فتح رف ${item.ar}`}>
       <i>{String(index+1).padStart(2,"0")}</i><div className="market-department-visual"><span>{item.emoji}</span></div>
       <div className="market-department-copy"><small>{item.fr}</small><strong>{item.ar}</strong><p>{item.description}</p><em>{item.products.length} منتجات</em></div>
       <ArrowLeft/>
      </button>)}
     </div>
    </section>

    <section className="market-basket-zone">
     <div className="market-zone-title"><span>02</span><div><small>Les corbeilles fraîches</small><h3>السلال الطازجة</h3></div></div>
     <div className="market-basket-grid">
      {baskets.map(item=><button key={item.id} className="market-basket-card" onClick={()=>openDepartment(item.id)} aria-label={`فتح ${item.ar}`}>
       <div className="market-basket-fruit">{item.emoji}</div><div><small>{item.fr}</small><strong>{item.ar}</strong><p>{item.description}</p><em>{item.products.length} منتجات طازجة</em></div><ArrowLeft/>
      </button>)}
     </div>
    </section>

    <section className="market-seller-zone">
     <div className="market-zone-title"><span>03</span><div><small>Le vendeur</small><h3>قسم البائع والمحادثات</h3></div></div>
     <div className="market-conversation-covers">
      {marketConversations.map((item,index)=><button key={item.id} onClick={()=>openConversation(item.id)} aria-label={`فتح المحادثة ${index+1}: ${item.ar}`}>
       <div className="market-seller-portrait"><span>👨🏻‍🌾</span><MessageCircle/></div>
       <div><small>Conversation {index+1}</small><strong>{item.ar}</strong><h4>{item.title}</h4><p>{item.summary}</p><em>{item.lines.length} جملة صوتية</em></div><ArrowLeft/>
      </button>)}
     </div>
    </section>
   </>}

   {department&&<section className={`market-department-detail ${department.kind==="basket"?"is-basket":""}`}>
    <button className="market-back-sections" onClick={goHome}><ArrowRight/> العودة إلى جميع الأقسام</button>
    <div className="market-detail-heading">
     <div className="market-detail-icon">{department.emoji}</div>
     <div><span>{department.kind==="basket"?"Corbeille fraîche":"Rayon du marché"}</span><h2>{department.ar}</h2><h3>{department.fr}</h3><p>{department.description} اضغط على صورة المنتج لسماع نطقه.</p></div>
     <strong>{department.products.length} منتجات</strong>
    </div>
    <div className="market-product-learning-grid">
     {visibleProducts.map((item,index)=>{
      const id=`product-${item.id}`;const active=speakingId===id;
      return <button key={item.id} className={active?"is-speaking":""} onClick={()=>speak(id,item.fr)} aria-label={`استمع إلى ${item.fr}`}>
       <i>{String(productPage*PRODUCT_PAGE_SIZE+index+1).padStart(2,"0")}</i><div className="market-product-picture"><span>{item.emoji}</span>{active&&<b><Volume2/></b>}</div>
       <div><strong dir="ltr">{item.fr}</strong><span>{item.ar}</span><em>{item.note??"اضغط لسماع النطق"}</em></div><Volume2 className="market-product-volume"/>
      </button>})}
    </div>
    {productPages>1&&<div className="market-dialogue-pagination market-product-pagination" dir="ltr">
     <button onClick={()=>setProductPage(page=>Math.max(0,page-1))} disabled={productPage===0} aria-label="صفحة المنتجات السابقة"><ChevronLeft/><span>السابق</span></button>
     <div><small>صفحة المنتجات</small><strong>{productPage+1} / {productPages}</strong><em>{productPage*PRODUCT_PAGE_SIZE+1}–{Math.min((productPage+1)*PRODUCT_PAGE_SIZE,department.products.length)} من {department.products.length}</em></div>
     <button onClick={()=>setProductPage(page=>Math.min(productPages-1,page+1))} disabled={productPage===productPages-1} aria-label="صفحة المنتجات التالية"><span>التالي</span><ChevronRight/></button>
    </div>}
   </section>}

   {conversation&&<section className="market-dialogue-room">
    <button className="market-back-sections" onClick={goHome}><ArrowRight/> العودة إلى جميع الأقسام</button>
    <div className="market-dialogue-heading">
     <div className="market-seller-portrait"><span>👨🏻‍🌾</span><MessageCircle/></div>
     <div><span>Conversation {marketConversations.findIndex(item=>item.id===conversation.id)+1}</span><h2>{conversation.ar}</h2><h3>{conversation.title}</h3><p>{conversation.summary}</p></div>
     <button className="market-play-full" onClick={()=>speakingId===`conversation-${conversation.id}`?(cancelFrenchSpeech(),setSpeakingId(null)):playFullConversation()}>
      {speakingId===`conversation-${conversation.id}`?<PauseCircle/>:<Volume2/>}<span>{speakingId===`conversation-${conversation.id}`?"إيقاف":"استمع إلى المحادثة كاملة"}</span>
     </button>
    </div>
    <div className="market-dialogue-progress"><span style={{width:`${((dialoguePage+1)/dialoguePages)*100}%`}}/></div>
    <div className="market-dialogue-lines">
     {visibleLines.map((line,index)=>{
      const absoluteIndex=dialoguePage*DIALOGUE_PAGE_SIZE+index;const id=`line-${conversation.id}-${absoluteIndex}`;const seller=line.speaker==="Le vendeur";
      return <button key={id} className={`${seller?"seller-line":"visitor-line"} ${speakingId===id?"is-speaking":""}`} onClick={()=>speak(id,line.fr,.72)} aria-label={`استمع إلى: ${line.fr}`}>
       <div className="market-speaker-badge">{seller?"👨🏻‍🌾":"👤"}</div><div><small>{line.speaker}</small><strong dir="ltr">{line.fr}</strong><span>{line.ar}</span></div><Volume2/>
      </button>})}
    </div>
    <div className="market-dialogue-pagination" dir="ltr">
     <button onClick={()=>setDialoguePage(page=>Math.max(0,page-1))} disabled={dialoguePage===0} aria-label="صفحة المحادثة السابقة"><ChevronLeft/><span>السابق</span></button>
     <div><small>جزء المحادثة</small><strong>{dialoguePage+1} / {dialoguePages}</strong><em>{dialoguePage*DIALOGUE_PAGE_SIZE+1}–{Math.min((dialoguePage+1)*DIALOGUE_PAGE_SIZE,conversation.lines.length)} من {conversation.lines.length}</em></div>
     <button onClick={()=>setDialoguePage(page=>Math.min(dialoguePages-1,page+1))} disabled={dialoguePage===dialoguePages-1} aria-label="صفحة المحادثة التالية"><span>التالي</span><ChevronRight/></button>
    </div>
    <p className="market-dialogue-tip">اضغط على أي جملة لسماعها منفردة، ثم كررها بصوت مرتفع قبل الانتقال إلى الجزء التالي.</p>
   </section>}
  </section>
 </main>;
}
