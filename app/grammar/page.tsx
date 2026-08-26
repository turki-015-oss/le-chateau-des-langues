"use client";

import Link from "next/link";
import { ArrowLeft, BookOpen, Castle, ChevronRight, GraduationCap, Search, Sparkles } from "lucide-react";
import "./grammar.css";

const levels = [
  { id: "a1", fr: "Fondations", ar: "تأسيس القواعد", count: 41, status: "جاهز", active: true },
  { id: "a2", fr: "Structures essentielles", ar: "التراكيب الأساسية", count: 42, status: "جاهز", active: true },
  { id: "b1", fr: "Grammaire intermédiaire", ar: "القواعد المتوسطة", count: 16, status: "قريبًا" },
  { id: "b2", fr: "Précision et nuance", ar: "الدقة والأسلوب", count: 16, status: "قريبًا" },
  { id: "c1", fr: "Grammaire avancée", ar: "القواعد المتقدمة", count: 18, status: "قريبًا" },
  { id: "c2", fr: "Maîtrise", ar: "الإتقان اللغوي", count: 18, status: "قريبًا" },
];

export default function GrammarPage() {
  return (
    <main className="grammar-hall" dir="rtl">
      <header className="grammar-hall-hero">
        <div className="grammar-hall-bg" aria-hidden="true" />
        <nav className="grammar-hall-nav">
          <Link href="/castle"><ChevronRight /><span><b>قاعات القلعة</b><small>LES SALLES DU CHÂTEAU</small></span></Link>
          <span className="grammar-hall-mark"><Castle /><b>LE CHÂTEAU</b></span>
        </nav>
        <div className="grammar-hall-title">
          <span><Sparkles /> SALLE D’ÉTUDE</span>
          <h1>LA SALLE DE GRAMMAIRE</h1>
          <h2>قاعة القواعد</h2>
          <p>منهج فرنسي متدرج يشرح القاعدة، تركيبها، استعمالها واستثناءاتها بأمثلة مسموعة وتحليل واضح.</p>
          <a href="#grammar-levels"><BookOpen /> ابدأ من المستوى المناسب <ArrowLeft /></a>
        </div>
      </header>

      <section className="grammar-hall-intro">
        <div><GraduationCap /><span><b>منهج متدرج</b><small>من A1 حتى C2</small></span></div>
        <div><Search /><span><b>فهرس وبحث</b><small>وصول مباشر إلى القاعدة</small></span></div>
        <div><BookOpen /><span><b>شرح موثّق</b><small>قاعدة وصيغة وأمثلة</small></span></div>
      </section>

      <section className="grammar-levels" id="grammar-levels">
        <div className="grammar-section-heading">
          <span>PARCOURS GRAMMATICAL</span>
          <h2>مسارات القواعد</h2>
          <p>ابدأ بـ A1، وستُفتح المستويات التالية تدريجيًا بنفس طريقة الشرح المعتمدة.</p>
        </div>
        <div className="grammar-level-grid">
          {levels.map((level, index) => (
            <Link key={level.id} href={`/grammar/${level.id}`} className={`grammar-level-card ${level.active ? "active" : "planned"}`} aria-disabled={!level.active}>
              <i>{String(index + 1).padStart(2, "0")}</i>
              <span className="grammar-level-badge">{level.id.toUpperCase()}</span>
              <div><strong>{level.fr}</strong><b>{level.ar}</b></div>
              <small>{level.count} درسًا منظمًا</small>
              <em>{level.status}</em>
              <ArrowLeft />
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
