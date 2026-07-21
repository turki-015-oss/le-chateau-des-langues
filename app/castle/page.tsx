"use client";

import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  Castle,
  ChevronLeft,
  Crown,
  DoorOpen,
  Library,
  LockKeyhole,
  Medal,
  Search,
  ClipboardCheck,
  Sparkles,
  Volume2
} from "lucide-react";

type Hall = {
  id: string;
  fr: string;
  ar: string;
  description: string;
  path?: string;
  open: boolean;
  icon: React.ReactNode;
  badge?: string;
};

const halls: Hall[] = [
  {
    id: "grand-hall",
    fr: "La Grande Salle",
    ar: "القاعة الكبرى",
    description: "ابدأ جولتك وتعلّم كلمات القلعة والتحية الملكية.",
    open: true,
    icon: <Crown />,
    badge: "Nouveau"
  },
  {
    id: "conjugation",
    fr: "La Salle de Conjugaison",
    ar: "قاعة تصريف الأفعال",
    description: "جميع تصريفات الأفعال الفرنسية مع بحث سريع عن أي فعل.",
    path: "/conjugation",
    open: true,
    icon: <Search />,
    badge: "Nouveau"
  },
  {
    id: "grammar",
    fr: "La Salle de Grammaire",
    ar: "قاعة القواعد",
    description: "رحلتك الكاملة لإتقان قواعد اللغة الفرنسية من A1 إلى C2.",
    path: "/grammar",
    open: true,
    icon: <BookOpen />
  },
  {
    id: "achievements",
    fr: "La Galerie des Exploits",
    ar: "قاعة الإنجازات",
    description: "شاهد الأوسمة والشهادات التي تجمعها في رحلتك.",
    open: true,
    icon: <Medal />
  },
  {
    id: "library",
    fr: "La Bibliothèque",
    ar: "المكتبة",
    description: "قصص، كتب قصيرة، ومهام قراءة داخل القلعة.",
    open: false,
    icon: <Library />
  },
  {
    id: "academy",
    fr: "La Salle des Tests",
    ar: "قاعة الاختبارات",
    description: "اختبر مستواك في اللغة الفرنسية وتابع تقدمك.",
    open: false,
    icon: <ClipboardCheck />
  }
];

const vocabulary = [
  ["le château", "القلعة"],
  ["la couronne", "التاج"],
  ["le roi", "الملك"],
  ["la reine", "الملكة"],
  ["le prince", "الأمير"],
  ["la grande salle", "القاعة الكبرى"]
];

function speak(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "fr-FR";
  utterance.rate = 0.88;
  window.speechSynthesis.speak(utterance);
}

export default function CastlePage() {
  const router = useRouter();

  const enterHall = (hall: Hall) => {
    if (!hall.open) return;
    if (hall.path) router.push(hall.path);
    else document.getElementById(hall.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className="castle-page" dir="rtl">
      <header className="castle-topbar">
        <button className="castle-back" onClick={() => router.push("/kingdom")} aria-label="العودة إلى الخريطة">
          <ChevronLeft />
          <span>الخريطة</span>
        </button>
        <div className="castle-brand">
          <Castle />
          <div>
            <strong>Le Château</strong>
            <small>القلعة</small>
          </div>
        </div>
      </header>

      <section className="castle-hero">
        <div className="castle-hero-glow" />
        <div className="castle-hero-content">
          <span className="castle-kicker"><Sparkles /> Bienvenue</span>
          <h1>Bienvenue</h1>
          <p className="castle-ar">مرحبًا بك</p>
          <p className="castle-intro">استكشف وتعلّم اللغة الفرنسية.</p>
          <button className="castle-listen" onClick={() => speak("Bienvenue. Entrez, s'il vous plaît.")}>
            <Volume2 /> استمع إلى الترحيب
          </button>
        </div>
        <div className="castle-crest" aria-hidden="true">
          <Crown />
          <Castle />
        </div>
      </section>

      <section className="castle-section">
        <div className="castle-section-heading">
          <div>
            <span>Explorez</span>
            <h2>قاعات القلعة</h2>
          </div>
          <DoorOpen />
        </div>

        <div className="castle-halls-grid">
          {halls.map((hall) => (
            <button
              key={hall.id}
              className={`castle-hall-card ${hall.open ? "is-open" : "is-locked"}`}
              onClick={() => enterHall(hall)}
              disabled={!hall.open}
            >
              <div className="castle-hall-icon">{hall.icon}</div>
              <div className="castle-hall-copy">
                <div className="castle-hall-title-row">
                  <h3>{hall.fr}</h3>
                  {hall.badge && <span>{hall.badge}</span>}
                </div>
                <strong>{hall.ar}</strong>
                <p>{hall.description}</p>
              </div>
              <div className="castle-hall-status">
                {hall.open ? <ArrowLeft /> : <LockKeyhole />}
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="castle-section castle-vocabulary" id="grand-hall">
        <div className="castle-section-heading">
          <div>
            <span>Premiers mots</span>
            <h2>مفردات القاعة الكبرى</h2>
          </div>
          <Volume2 />
        </div>
        <div className="castle-word-grid">
          {vocabulary.map(([fr, ar]) => (
            <button key={fr} className="castle-word" onClick={() => speak(fr)}>
              <Volume2 />
              <div>
                <strong dir="ltr">{fr}</strong>
                <span>{ar}</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="castle-royal-message">
        <Crown />
        <div>
          <span>Phrase royale</span>
          <h2 dir="ltr">Entrez, je vous en prie.</h2>
          <p>تفضل بالدخول.</p>
        </div>
        <button onClick={() => speak("Entrez, je vous en prie.")} aria-label="تشغيل الجملة"><Volume2 /></button>
      </section>
    </main>
  );
}
