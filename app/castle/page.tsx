"use client";

import { ArrowLeft, BookOpen, CheckSquare, Crown, LibraryBig, Map as MapIcon, Menu, Settings, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

const halls = [
  { fr: "La Grande Salle", ar: "القاعة الكبرى", desc: "ابدأ بالتحيات والعبارات الأساسية والخطوات الأولى.", path: "/family", icon: Crown },
  { fr: "La Salle de Conjugaison", ar: "قاعة تصريف الأفعال", desc: "أتقن تصريف الأفعال الفرنسية في جميع الأزمنة.", path: "/conjugation", icon: BookOpen },
  { fr: "La Salle de Grammaire", ar: "قاعة القواعد", desc: "تعلّم القواعد الفرنسية من A1 إلى C2.", path: "/grammar", icon: Sparkles },
  { fr: "La Bibliothèque", ar: "المكتبة", desc: "اقرأ القصص والمقالات ووسّع مفرداتك.", path: "/library", icon: LibraryBig },
  { fr: "La Salle des Tests", ar: "قاعة الاختبارات", desc: "اختبر مستواك وتابع تقدمك.", path: "/tests", icon: CheckSquare },
];

export default function CastlePage() {
  const router = useRouter();

  return (
    <main className="v69-castle" aria-label="القاعات الداخلية للقلعة">
      <div className="v69-castle-bg" aria-hidden="true" />
      <header className="v69-castle-header">
        <button onClick={() => router.push("/kingdom")} aria-label="العودة"><ArrowLeft /></button>
        <div>
          <p>Le Château</p>
          <span>القلعة</span>
        </div>
        <button aria-label="القائمة"><Menu /></button>
      </header>

      <section className="v69-castle-shell">
        <div className="v69-castle-title">
          <small>EXPLOREZ</small>
          <h1>قاعات القلعة</h1>
          <p>اختر القاعة المناسبة وابدأ رحلتك في اللغة الفرنسية.</p>
        </div>

        <div className="v69-halls-list">
          {halls.map(({ fr, ar, desc, path, icon: Icon }, index) => (
            <button key={fr} className="v69-hall-card" onClick={() => router.push(path)}>
              <span className="v69-hall-index">0{index + 1}</span>
              <span className="v69-hall-icon"><Icon /></span>
              <span className="v69-hall-copy">
                <strong>{fr}</strong>
                <b>{ar}</b>
                <small>{desc}</small>
              </span>
              <span className="v69-hall-arrow">‹</span>
            </button>
          ))}
        </div>
      </section>

      <nav className="v69-bottom-nav" aria-label="التنقل الرئيسي">
        <button onClick={() => router.push("/kingdom")}><MapIcon /><span>الخريطة</span></button>
        <button onClick={() => router.push("/library")}><BookOpen /><span>محفوظاتي</span></button>
        <button onClick={() => router.push("/achievements")}><Crown /><span>تقدمي</span></button>
        <button onClick={() => router.push("/tests")}><CheckSquare /><span>اختباراتي</span></button>
        <button onClick={() => alert("سيتم إضافة الإعدادات في إصدار لاحق.")}><Settings /><span>الإعدادات</span></button>
      </nav>
    </main>
  );
}
