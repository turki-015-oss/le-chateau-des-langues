"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, BookOpen, ChevronLeft, Layers3, MessageSquareText, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

type Level = {
  code: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  fr: string;
  ar: string;
  summary: string;
  topics: string[];
};

const levels: Level[] = [
  { code:"A1", fr:"Débutant", ar:"المبتدئ", summary:"الأساس الواضح لبناء الجملة الفرنسية وفهم عناصرها الأولى.", topics:["بناء الجملة البسيطة", "أدوات التعريف والتنكير", "المذكر والمؤنث والجمع", "المضارع والأفعال الأساسية", "النفي والاستفهام", "الملكية والإشارة"] },
  { code:"A2", fr:"Les bases", ar:"الأساسيات", summary:"تثبيت القواعد الأساسية والتوسع في الأزمنة والضمائر والاستعمال اليومي.", topics:["الماضي المركب", "الماضي الناقص", "المستقبل البسيط", "ضمائر المفعول", "الضميران y و en", "المقارنة والتفضيل"] },
  { code:"B1", fr:"Intermédiaire", ar:"المتوسط", summary:"الانتقال إلى الجمل المترابطة والسرد والشرط والتعبير الدقيق.", topics:["الأزمنة السردية", "الماضي الأسبق", "الشرط الحاضر", "التابع الحاضر", "الكلام المنقول", "أدوات الربط"] },
  { code:"B2", fr:"Intermédiaire supérieur", ar:"فوق المتوسط", summary:"فهم التراكيب المتقدمة والتمييز الدقيق بين الصيغ والأزمنة.", topics:["التابع بالتفصيل", "الشرط الماضي", "الجمل الشرطية المتقدمة", "الضمائر الموصولة المركبة", "مطابقة اسم المفعول", "السبب والنتيجة والتنازل"] },
  { code:"C1", fr:"Avancé", ar:"المتقدم", summary:"صقل الأسلوب والتحكم في التراكيب الدقيقة والكتابة الرسمية والأكاديمية.", topics:["الماضي البسيط", "الماضي السابق", "التابع المتقدم", "التقديم والتأخير", "الحذف النحوي", "الأسلوب الأكاديمي"] },
  { code:"C2", fr:"Maîtrise", ar:"الإتقان", summary:"التحكم الكامل في القواعد والفروق الأسلوبية والسجلات اللغوية.", topics:["الفروق الدقيقة بين الصيغ", "الأسلوب الأدبي", "إزالة الغموض", "الإيقاع وبناء الجملة", "إعادة الصياغة المتقدمة", "التصحيح والتحرير"] }
];

export default function GrammarPage(){
  const router=useRouter();
  const [selected,setSelected]=useState<Level["code"]>("A1");
  const current=useMemo(()=>levels.find(level=>level.code===selected)!,[selected]);

  return <main className="grammar-page" dir="rtl">
    <header className="grammar-topbar">
      <button onClick={()=>router.push("/castle")} aria-label="العودة"><ChevronLeft/></button>
      <div><strong>Le Château</strong><small>القلعة</small></div>
    </header>

    <section className="grammar-hero">
      <div className="grammar-hero-shade"/>
      <div className="grammar-hero-copy">
        <span><Sparkles/> A1 • A2 • B1 • B2 • C1 • C2</span>
        <h1>La Salle de<br/>Grammaire</h1>
        <h2>قاعة القواعد</h2>
      </div>
    </section>

    <section className="grammar-shell">
      <div className="grammar-intro">
        <BookOpen/>
        <div>
          <h2>رحلتك الكاملة لإتقان قواعد اللغة الفرنسية من A1 إلى C2</h2>
          <p dir="ltr">Votre parcours complet pour maîtriser la grammaire française de A1 à C2</p>
          <p>تعلّم قواعد اللغة الفرنسية بطريقة واضحة ومتدرجة، مع شرح مبسط وصيغ دقيقة وأمثلة صحيحة وملاحظات تساعدك على الفهم والإتقان.</p>
        </div>
      </div>

      <div className="grammar-level-grid">
        {levels.map(level=><button key={level.code} className={selected===level.code?"is-active":""} onClick={()=>setSelected(level.code)}>
          <span className="grammar-level-code">{level.code}</span>
          <strong dir="ltr">{level.fr}</strong>
          <small>{level.ar}</small>
          <span className="grammar-level-open"><BookOpen/><ArrowLeft/></span>
        </button>)}
      </div>

      <section className="grammar-detail" aria-live="polite">
        <div className="grammar-detail-heading">
          <span>{current.code}</span>
          <div><h2 dir="ltr">{current.fr}</h2><p>{current.ar}</p></div>
        </div>
        <p className="grammar-detail-summary">{current.summary}</p>
        <div className="grammar-topic-grid">
          {current.topics.map((topic,index)=><article key={topic}><span>{String(index+1).padStart(2,"0")}</span><Layers3/><h3>{topic}</h3><p>شرح القاعدة، الصيغة، الأمثلة، الملاحظات والاستثناءات.</p></article>)}
        </div>
      </section>

      <footer className="grammar-note"><MessageSquareText/><p>كل مستوى يقرّبك خطوة من الإتقان. القواعد هي مفتاح التعبير الصحيح.</p></footer>
    </section>
  </main>
}
