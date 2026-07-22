"use client";

import { BookOpen, Castle, MapPin, MessageCircle, Sparkles, Volume2 } from "lucide-react";
import { useRouter } from "next/navigation";

const features = [
  { icon: BookOpen, text: "تعلّم الفرنسية" },
  { icon: MapPin, text: "جولة حول الأماكن" },
  { icon: Sparkles, text: "أساسيات اللغة عن طريق القلعة" },
  { icon: MessageCircle, text: "مفردات وجمل واختبارات" },
];

function speakWelcome() {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(
    "Bienvenue au Château des Langues. Apprenez le français, explorez les lieux et progressez à travers des mots, des phrases et des tests."
  );
  utterance.lang = "fr-FR";
  utterance.rate = 0.88;
  window.speechSynthesis.speak(utterance);
}

export default function EntryPage() {
  const router = useRouter();

  return (
    <main className="v69-entry" aria-label="المدخل الرئيسي لتطبيق القلعة">
      <div className="v69-entry-bg" aria-hidden="true" />
      <div className="v69-glow v69-glow-one" aria-hidden="true" />
      <div className="v69-glow v69-glow-two" aria-hidden="true" />
      <div className="v69-sparkles" aria-hidden="true">
        {Array.from({ length: 18 }).map((_, i) => (
          <i key={i} style={{ "--x": `${(i * 47) % 100}%`, "--y": `${(i * 31) % 100}%`, "--delay": `${i * -0.35}s`, "--duration": `${4 + (i % 5)}s` } as React.CSSProperties} />
        ))}
      </div>

      <section className="v69-entry-panel">
        <div className="v69-brand-mark" aria-hidden="true"><Castle /></div>
        <p className="v69-brand-fr">Le Château</p>
        <h1>القلعة</h1>
        <div className="v69-divider"><span /></div>
        <h2>Bienvenue</h2>
        <p className="v69-welcome-ar">مرحبًا بك</p>
        <p className="v69-description">تجربة فرنسية فاخرة للتعلّم والاستكشاف داخل عالم القلعة.</p>

        <div className="v69-feature-list">
          {features.map(({ icon: Icon, text }) => (
            <div key={text} className="v69-feature-row">
              <Icon aria-hidden="true" />
              <span>{text}</span>
            </div>
          ))}
        </div>

        <button className="v69-primary" onClick={() => router.push("/castle")}>دخول العالم</button>
        <button className="v69-secondary" onClick={speakWelcome}>
          <Volume2 aria-hidden="true" />
          استمع إلى الترحيب
        </button>
      </section>
    </main>
  );
}
