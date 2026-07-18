"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, BookOpen, CalendarClock, ChevronLeft, CircleParking, Clock3, Headphones, Info, Luggage, MapPinned, Menu, Route, ScanLine, Ticket, TrainFront, Volume2 } from "lucide-react";

const sections = [
  { id: "arrival", fr: "Arrivée à la gare", ar: "الوصول إلى المحطة", icon: MapPinned, image: "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1200&q=88" },
  { id: "ticket", fr: "Acheter un billet", ar: "شراء التذكرة", icon: Ticket, image: "https://images.unsplash.com/photo-1535535112387-56ffe8db21ff?auto=format&fit=crop&w=1200&q=88" },
  { id: "board", fr: "Tableau des départs", ar: "لوحة المغادرات", icon: CalendarClock, image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=88" },
  { id: "platform", fr: "Le quai", ar: "الرصيف", icon: CircleParking, image: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=1200&q=88" },
  { id: "control", fr: "Contrôle du billet", ar: "فحص التذكرة", icon: ScanLine, image: "https://images.unsplash.com/photo-1473445361085-b9a07f55608b?auto=format&fit=crop&w=1200&q=88" },
  { id: "boarding", fr: "Monter dans le train", ar: "الصعود إلى القطار", icon: TrainFront, image: "https://images.unsplash.com/photo-1556695736-d287caebc48e?auto=format&fit=crop&w=1200&q=88" },
  { id: "inside", fr: "Dans le train", ar: "داخل القطار", icon: Luggage, image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=88" },
  { id: "connection", fr: "Arrivée et correspondance", ar: "الوصول وتغيير القطار", icon: Route, image: "https://images.unsplash.com/photo-1516939884455-1445c8652f83?auto=format&fit=crop&w=1200&q=88" },
];

const dialogues: Record<string, [string, string][]> = {
  arrival: [["Bonjour, où se trouve le hall principal ?", "مرحبًا، أين توجد الصالة الرئيسية؟"], ["Le hall est juste devant vous.", "الصالة أمامك مباشرة."], ["Où puis-je consulter les départs ?", "أين يمكنني رؤية مواعيد المغادرة؟"]],
  ticket: [["Je voudrais un billet pour Lyon, s'il vous plaît.", "أريد تذكرة إلى ليون من فضلك."], ["Aller simple ou aller-retour ?", "ذهاب فقط أم ذهاب وعودة؟"], ["À quelle heure part le prochain train ?", "متى ينطلق القطار القادم؟"]],
  board: [["Mon train est-il à l'heure ?", "هل قطاري في موعده؟"], ["Il a quinze minutes de retard.", "متأخر خمس عشرة دقيقة."], ["Quel est le numéro du train ?", "ما رقم القطار؟"]],
  platform: [["De quel quai part le train ?", "من أي رصيف ينطلق القطار؟"], ["Il part du quai numéro six.", "ينطلق من الرصيف رقم ستة."], ["Le quai est-il loin d'ici ?", "هل الرصيف بعيد من هنا؟"]],
  control: [["Votre billet, s'il vous plaît.", "تذكرتك من فضلك."], ["Voici mon billet électronique.", "هذه تذكرتي الإلكترونية."], ["Merci, bon voyage.", "شكرًا، رحلة سعيدة."]],
  boarding: [["Est-ce le train pour Paris ?", "هل هذا القطار المتجه إلى باريس؟"], ["Oui, montez dans la voiture huit.", "نعم، اصعد إلى العربة رقم ثمانية."], ["Les portes vont fermer.", "الأبواب ستغلق."]],
  inside: [["Où se trouve mon siège ?", "أين يوجد مقعدي؟"], ["Votre siège est près de la fenêtre.", "مقعدك بجانب النافذة."], ["Puis-je mettre ma valise ici ?", "هل أستطيع وضع حقيبتي هنا؟"]],
  connection: [["Où dois-je changer de train ?", "أين يجب أن أغير القطار؟"], ["Vous changez à Dijon.", "تغيّر القطار في ديجون."], ["Vous avez vingt minutes pour la correspondance.", "لديك عشرون دقيقة للتبديل."]],
};

const vocab = [
  ["Le billet", "التذكرة", Ticket], ["Le quai", "الرصيف", CircleParking], ["La gare", "محطة القطار", TrainFront],
  ["Le retard", "التأخير", Clock3], ["La correspondance", "تغيير القطار", Route], ["La valise", "الحقيبة", Luggage],
] as const;

const stories = [
  { title: "Karim à la gare", ar: "كريم في محطة القطار", text: "Karim arrive à la gare une heure avant le départ. Il achète son billet, consulte le tableau des départs et trouve le quai numéro quatre. Il monte dans le train et s'assoit près de la fenêtre." },
  { title: "Karim rate son train", ar: "كريم يفوّت القطار", text: "Karim arrive en retard à la gare. Quand il atteint le quai, les portes sont déjà fermées. Il va au guichet, explique la situation et réserve un autre train pour l'après-midi." },
];

export default function StationPage() {
  const [active, setActive] = useState("arrival");
  const [story, setStory] = useState(0);
  const [answer, setAnswer] = useState<number | null>(null);
  const current = useMemo(() => sections.find((s) => s.id === active) ?? sections[0], [active]);
  const speak = (text: string) => {
    if (typeof window === "undefined") return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text); u.lang = "fr-FR"; u.rate = 0.82; window.speechSynthesis.speak(u);
  };

  return <main className="station-world">
    <header className="station-topbar">
      <Link href="/kingdom" className="station-nav-icon" aria-label="Retour à la carte"><ArrowRight size={22}/></Link>
      <div><span>محطة القطار</span><strong>La Gare Royale</strong></div>
      <button className="station-nav-icon" aria-label="Menu"><Menu size={22}/></button>
    </header>

    <section className="station-hero">
      <img src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=92" alt="Gare ferroviaire premium"/>
      <div className="station-hero-shade"/>
      <div className="station-hero-copy"><span><TrainFront size={18}/> Nouveau monde</span><h1>La Gare Royale</h1><p>تعلّم الفرنسية في رحلة متكاملة من شراء التذكرة حتى الوصول.</p><button onClick={() => speak("Bienvenue à la gare royale. Préparez votre billet et bon voyage.")}><Volume2 size={20}/> Écouter l'accueil</button></div>
    </section>

    <section className="station-section-grid">
      {sections.map(({id, fr, ar, image, icon: Icon}, index) => <button key={id} onClick={() => { setActive(id); document.getElementById("station-lesson")?.scrollIntoView({behavior:"smooth"}); }} className={`station-section-card ${active === id ? "active" : ""}`}><img src={image} alt={fr}/><span className="station-card-index">{String(index + 1).padStart(2,"0")}</span><div className="station-card-copy"><span className="station-red-icon"><Icon size={21}/></span><strong>{fr}</strong><small>{ar}</small></div></button>)}
    </section>

    <section id="station-lesson" className="station-panel">
      <div className="station-panel-title"><div><span>{current.ar}</span><h2>{current.fr}</h2></div><button onClick={() => speak(current.fr)}><Volume2 size={20}/></button></div>
      <div className="station-lesson-layout"><img src={current.image} alt={current.fr}/><div className="station-dialogues">{(dialogues[active] || dialogues.arrival).map(([fr, ar], i) => <button key={fr} className={i % 2 ? "staff" : "traveler"} onClick={() => speak(fr)}><span><strong>{fr}</strong><small>{ar}</small></span><Volume2 size={18}/></button>)}</div></div>
    </section>

    <section className="station-panel"><div className="station-panel-title"><div><span>المفردات الأساسية</span><h2>Vocabulaire essentiel</h2></div><BookOpen size={24}/></div><div className="station-vocab-grid">{vocab.map(([fr, ar, Icon]) => <article key={fr}><span className="station-vocab-icon"><Icon size={28}/></span><div><strong>{fr}</strong><small>{ar}</small></div><button onClick={() => speak(fr)}><Volume2 size={17}/></button></article>)}</div></section>

    <section className="station-stories"><div className="station-story-visual"><img src={story === 0 ? "https://images.unsplash.com/photo-1473445361085-b9a07f55608b?auto=format&fit=crop&w=1200&q=88" : "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=1200&q=88"} alt={stories[story].title}/><span>Histoire A1+</span></div><div className="station-story-copy"><span>قصص الرحلة</span><h2>{stories[story].title}</h2><small>{stories[story].ar}</small><p>{stories[story].text}</p><div className="station-story-actions"><button onClick={() => speak(stories[story].text)}><Headphones size={19}/> Écouter</button><button onClick={() => setStory(story === 0 ? 1 : 0)}><ChevronLeft size={18}/> Histoire suivante</button></div></div></section>

    <section className="station-panel station-quiz"><div className="station-panel-title"><div><span>اختبار سريع</span><h2>Compréhension</h2></div><Info size={24}/></div><h3>Où Karim trouve-t-il les informations sur son train ?</h3><p>أين يجد كريم معلومات قطاره؟</p><div className="station-answer-grid">{["Au café", "Sur le tableau des départs", "Dans le taxi"].map((x,i)=><button key={x} className={answer===i?(i===1?"correct":"wrong"):""} onClick={()=>setAnswer(i)}>{x}</button>)}</div></section>
  </main>;
}
