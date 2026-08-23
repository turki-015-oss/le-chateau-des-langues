"use client";

import { useRouter } from "next/navigation";
import type { PointerEvent as ReactPointerEvent } from "react";
import {
  ArrowLeft,
  BookOpen,
  Building2,
  Castle,
  Clapperboard,
  Coffee,
  GraduationCap,
  Hotel,
  Landmark,
  Library,
  Plane,
  Scale,
  ShoppingBasket,
  Sparkles,
  Train,
  Trees,
  Trophy,
  Utensils,
} from "lucide-react";
import Link from "next/link";
import "./concept.css";

type ConceptDestination = {
  id: string;
  fr: string;
  ar: string;
  description: string;
  image: string;
  path: string;
  icon: React.ReactNode;
};

const destinations: ConceptDestination[] = [
  { id: "hospital", fr: "HÔPITAL", ar: "المستشفى", path: "/hospital", image: "/kingdom-portal-assets/destination-hospital.png", description: "الصحة والمواعيد وطلب المساعدة", icon: <Building2 /> },
  { id: "airport", fr: "AÉROPORT", ar: "المطار", path: "/entrance/airport", image: "/kingdom-portal-assets/destination-airport.png", description: "السفر والجوازات والرحلات", icon: <Plane /> },
  { id: "station", fr: "GARE", ar: "محطة القطار", path: "/entrance/station", image: "/kingdom-portal-assets/destination-station.png", description: "التذاكر والمواعيد والوجهات", icon: <Train /> },
  { id: "market", fr: "MARCHÉ", ar: "السوق الكبير", path: "/entrance/market", image: "/kingdom-portal-assets/destination-market.png", description: "المنتجات والمفردات والمحادثات", icon: <ShoppingBasket /> },
  { id: "cafe", fr: "CAFÉ", ar: "المقهى", path: "/entrance/cafe", image: "/kingdom-portal-assets/destination-cafe-v2.webp", description: "التحية والجلوس والطلب", icon: <Coffee /> },
  { id: "restaurant", fr: "RESTAURANT", ar: "المطعم", path: "/entrance/restaurant", image: "/kingdom-portal-assets/destination-restaurant-v2.webp", description: "الحجز والقائمة والمحادثة", icon: <Utensils /> },
  { id: "police", fr: "COMMISSARIAT", ar: "مركز الشرطة", path: "/entrance/police", image: "/kingdom-portal-assets/destination-police-v2.webp", description: "المساعدة والمواقف الأمنية", icon: <Landmark /> },
  { id: "zoo", fr: "ZOO", ar: "حديقة الحيوانات", path: "/entrance/zoo", image: "/kingdom-portal-assets/destination-zoo-v2.webp", description: "الحيوانات والطبيعة والاستكشاف", icon: <Trees /> },
  { id: "hotel", fr: "HÔTEL", ar: "الفندق", path: "/entrance/hotel", image: "/kingdom-portal-assets/destination-hotel-v2.webp", description: "الحجز والاستقبال والإقامة", icon: <Hotel /> },
  { id: "stadium", fr: "STADE", ar: "الملعب", path: "/entrance/stadium", image: "/kingdom-portal-assets/destination-stadium-v2.webp", description: "الرياضة والمباريات والجمهور", icon: <Trophy /> },
  { id: "cinema", fr: "CINÉMA", ar: "صالة السينما", path: "/entrance/cinema", image: "/kingdom-portal-assets/destination-cinema-v2.webp", description: "الأفلام والعروض والحوار الثقافي", icon: <Clapperboard /> },
  { id: "court", fr: "TRIBUNAL", ar: "المحكمة", path: "/court", image: "/maps/facades/civic-facade.webp", description: "القضايا والشهادة واللغة الرسمية", icon: <Scale /> },
];

function TiltCard({ item, index }: { item: ConceptDestination; index: number }) {
  const router = useRouter();

  const handlePointerMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (event.pointerType === "touch") return;
    const element = event.currentTarget;
    const bounds = element.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    element.style.setProperty("--rotate-x", `${(0.5 - y) * 10}deg`);
    element.style.setProperty("--rotate-y", `${(x - 0.5) * 12}deg`);
    element.style.setProperty("--light-x", `${x * 100}%`);
    element.style.setProperty("--light-y", `${y * 100}%`);
  };

  const resetTilt = (event: ReactPointerEvent<HTMLButtonElement>) => {
    event.currentTarget.style.setProperty("--rotate-x", "0deg");
    event.currentTarget.style.setProperty("--rotate-y", "0deg");
    event.currentTarget.style.setProperty("--light-x", "50%");
    event.currentTarget.style.setProperty("--light-y", "20%");
  };

  return (
    <button
      type="button"
      className="concept-tilt-card"
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
      onPointerCancel={resetTilt}
      onClick={() => router.push(item.path)}
      aria-label={`${item.fr} — ${item.ar}`}
    >
      <span className="concept-card-depth" aria-hidden="true" />
      <span className="concept-card-surface">
        <span className="concept-card-light" aria-hidden="true" />
        <span className="concept-card-number">{String(index + 1).padStart(2, "0")}</span>
        <span className="concept-card-icon">{item.icon}</span>
        <span className="concept-card-image-wrap">
          <img src={item.image} alt="" className="concept-card-image" />
        </span>
        <span className="concept-card-copy">
          <small>DESTINATION</small>
          <strong dir="ltr">{item.fr}</strong>
          <b>{item.ar}</b>
          <em>{item.description}</em>
        </span>
        <span className="concept-card-enter"><span>ENTRER</span><ArrowLeft /></span>
      </span>
    </button>
  );
}

export default function KingdomConceptPage() {
  const scrollToDestinations = () => document.getElementById("concept-destinations")?.scrollIntoView({ behavior: "smooth" });

  return (
    <main className="kingdom-concept" dir="rtl">
      <header className="concept-topbar">
        <div className="concept-brand">
          <Castle />
          <span><strong dir="ltr">LE CHÂTEAU</strong><small>القلعة الفرنسية</small></span>
        </div>
        <span className="concept-badge"><Sparkles /> CONCEPT 3D</span>
      </header>

      <section className="concept-hero">
        <img src="/kingdom-portal-assets/castle-facade.png" alt="واجهة القلعة" className="concept-hero-image" />
        <div className="concept-hero-shade" />
        <div className="concept-hero-copy">
          <span><Sparkles /> UNE LANGUE · UN MONDE</span>
          <h1 dir="ltr">Entrez dans<br /><em>le français vivant</em></h1>
          <p>رحلة تعليمية متكاملة؛ تختار مكانك، تدخل عالمه، وتتعلّم الفرنسية من مواقف حقيقية داخل القلعة.</p>
          <button type="button" onClick={scrollToDestinations}>استكشف الوجهات ثلاثية الأبعاد <ArrowLeft /></button>
        </div>
        <div className="concept-hero-stat"><b>15</b><span>وجهة تعليمية</span></div>
      </section>

      <section className="concept-primary" aria-label="الجامعة والمكتبة">
        <div className="concept-section-heading">
          <span>LE LIVRE DES SAVOIRS</span>
          <h2>الجامعة والمكتبة جزء من كتاب القلعة</h2>
          <p>النصوص محفورة بصريًا داخل الورق، وصورة كل مبنى مطبوعة داخل صفحته لتبدو جزءًا حقيقيًا من الكتاب.</p>
        </div>
        <div className="concept-open-book" dir="ltr">
          <img className="concept-book-base" src="/kingdom-portal-assets/open-book-realistic-v1.webp" alt="كتاب القلعة المفتوح" />
          <div className="concept-book-pages">
            <Link href="/entrance/university" className="concept-book-page concept-book-university" aria-label="UNIVERSITÉ — الجامعة">
              <span className="concept-book-engraving"><strong>UNIVERSITÉ</strong><b dir="rtl">الجامعة</b></span>
              <img src="/kingdom-portal-assets/university-campus.png" alt="مبنى الجامعة" />
              <span className="concept-book-seal"><GraduationCap /><small>ENTRER</small></span>
            </Link>
            <Link href="/entrance/library" className="concept-book-page concept-book-library" aria-label="BIBLIOTHÈQUE — المكتبة">
              <span className="concept-book-engraving"><strong>BIBLIOTHÈQUE</strong><b dir="rtl">المكتبة</b></span>
              <img src="/kingdom-portal-assets/library-facade.png" alt="مبنى المكتبة" />
              <span className="concept-book-seal"><Library /><small>ENTRER</small></span>
            </Link>
          </div>
          <span className="concept-book-glow" aria-hidden="true" />
        </div>
      </section>

      <section className="concept-destinations" id="concept-destinations">
        <div className="concept-section-heading concept-section-heading-light">
          <span>EXPLOREZ LA CITÉ</span>
          <h2>اختر المكان الذي تريد التعلّم داخله</h2>
          <p>كل بطاقة مبنى مستقلة بطبقات 3D، وصورة ثابتة مطابقة لاسم الوجهة، ودخول مباشر إلى قسمها.</p>
        </div>
        <div className="concept-card-grid">
          {destinations.map((item, index) => <TiltCard key={item.id} item={item} index={index} />)}
        </div>
      </section>

      <footer className="concept-footer">
        <BookOpen />
        <span><strong>نسخة تجريبية مستقلة للاعتماد</strong><small>لم يتم تغيير صفحة القلعة الحالية</small></span>
      </footer>
    </main>
  );
}
