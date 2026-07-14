"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Medal, Volume2 } from "lucide-react";

const dialogue = [
  { fr: "Bienvenue au Château des Langues.", ar: "مرحبًا بك في قلعة اللغات." },
  { fr: "Je suis Armand.", ar: "أنا أرمان." },
  { fr: "Chaque porte ouvre un nouveau monde.", ar: "كل بوابة تفتح عالمًا جديدًا." },
  { fr: "Va rencontrer Youssef.", ar: "اذهب لمقابلة يوسف." }
];

export default function GatePage() {
  const [step, setStep] = useState(0);
  const [showArabic, setShowArabic] = useState(true);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    setCompleted(localStorage.getItem("chateau-gate-completed") === "true");
  }, []);

  const speak = () => {
    const u = new SpeechSynthesisUtterance(dialogue[step].fr);
    u.lang = "fr-FR";
    u.rate = 0.82;
    speechSynthesis.speak(u);
  };

  const next = () => {
    if (step < dialogue.length - 1) {
      setStep((value) => value + 1);
      return;
    }
    localStorage.setItem("chateau-gate-completed", "true");
    localStorage.setItem("chateau-xp", "20");
    setCompleted(true);
  };

  return (
    <main className="gate-world">
      <header className="gate-header">
        <Link href="/" className="back-link"><ArrowRight size={20}/>العودة</Link>
        <strong>La Première Porte</strong>
        <button onClick={() => setShowArabic((value) => !value)}>
          {showArabic ? "FR فقط" : "إظهار الترجمة"}
        </button>
      </header>

      <section className="gate-scene">
        <div className="gate-shade" />
        <div className="armand-card">
          <div className="armand-portrait">🛡️</div>
          <span>Armand</span>
          <h1>{dialogue[step].fr}</h1>
          {showArabic && <p>{dialogue[step].ar}</p>}
          <div className="gate-actions">
            <button className="gate-listen" onClick={speak}><Volume2 size={20}/>استمع</button>
            <button className="gate-next" onClick={next}>
              {step === dialogue.length - 1 ? "افتح البوابة" : "التالي"}
            </button>
          </div>
        </div>
      </section>

      {completed && (
        <section className="achievement-card">
          <Medal size={52}/>
          <span>Premier Pas</span>
          <h2>الخطوة الأولى</h2>
          <p>حصلت على 20 XP وفتحت طريق الحي العائلي.</p>
          <Link href="/family">اذهب إلى Youssef</Link>
        </section>
      )}
    </main>
  );
}
