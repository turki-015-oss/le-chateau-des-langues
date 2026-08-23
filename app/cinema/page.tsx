"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Clapperboard, DoorOpen, Film, Sparkles, Ticket, Volume2 } from "lucide-react";
import "./cinema.css";

const areas = [
  {
    id: "tickets",
    fr: "LA BILLETTERIE",
    ar: "شباك التذاكر",
    icon: <Ticket />,
    phrases: [
      ["Je voudrais une place pour la séance de vingt heures.", "أريد تذكرة لعرض الساعة الثامنة مساءً."],
      ["À quelle heure commence le film ?", "في أي وقت يبدأ الفيلم؟"],
      ["Il reste des places au milieu de la salle ?", "هل بقيت مقاعد في وسط القاعة؟"],
    ],
  },
  {
    id: "lobby",
    fr: "LE HALL D’ACCUEIL",
    ar: "بهو الاستقبال",
    icon: <DoorOpen />,
    phrases: [
      ["Où se trouve la salle numéro trois ?", "أين توجد القاعة رقم ثلاثة؟"],
      ["Puis-je entrer maintenant ?", "هل يمكنني الدخول الآن؟"],
      ["La séance va commencer dans dix minutes.", "سيبدأ العرض بعد عشر دقائق."],
    ],
  },
  {
    id: "auditorium",
    fr: "LA SALLE",
    ar: "قاعة العرض",
    icon: <Film />,
    phrases: [
      ["Cette place est-elle libre ?", "هل هذا المقعد شاغر؟"],
      ["Pourriez-vous parler moins fort, s’il vous plaît ?", "هل يمكنك خفض صوتك من فضلك؟"],
      ["L’écran est très grand.", "الشاشة كبيرة جدًا."],
    ],
  },
  {
    id: "projection",
    fr: "LA PROJECTION",
    ar: "العرض السينمائي",
    icon: <Clapperboard />,
    phrases: [
      ["La projection commence.", "يبدأ العرض الآن."],
      ["L’image est nette et le son est clair.", "الصورة واضحة والصوت نقي."],
      ["Il y a une courte bande-annonce avant le film.", "يوجد إعلان قصير قبل الفيلم."],
    ],
  },
  {
    id: "discussion",
    fr: "APRÈS LE FILM",
    ar: "بعد الفيلم",
    icon: <Sparkles />,
    phrases: [
      ["J’ai beaucoup aimé ce film.", "أعجبني هذا الفيلم كثيرًا."],
      ["L’histoire était touchante.", "كانت القصة مؤثرة."],
      ["Quel personnage avez-vous préféré ?", "أي شخصية أعجبتك أكثر؟"],
    ],
  },
  {
    id: "exit",
    fr: "LA SORTIE",
    ar: "الخروج",
    icon: <ArrowLeft />,
    phrases: [
      ["Où est la sortie ?", "أين المخرج؟"],
      ["Le film vient de se terminer.", "انتهى الفيلم للتو."],
      ["Nous pouvons discuter du film dans le hall.", "يمكننا مناقشة الفيلم في البهو."],
    ],
  },
] as const;

function speak(text: string) {
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "fr-FR";
  utterance.rate = 0.86;
  window.speechSynthesis.speak(utterance);
}

export default function CinemaPage() {
  const router = useRouter();
  const [activeId, setActiveId] = useState<(typeof areas)[number]["id"]>(areas[0].id);
  const active = areas.find(({ id }) => id === activeId) ?? areas[0];

  return (
    <main className="cinema-world" dir="rtl">
      <header className="cinema-header">
        <button data-portal-return onClick={() => router.push("/kingdom")} aria-label="العودة إلى القلعة"><ArrowLeft /></button>
        <div><Clapperboard /><span><strong>LE CINÉMA</strong><small>صالة السينما</small></span></div>
        <button onClick={() => document.getElementById("cinema-areas")?.scrollIntoView({ behavior: "smooth" })}><Sparkles /><span>ابدأ الجولة</span></button>
      </header>

      <section className="cinema-hero">
        <div className="cinema-hero-copy">
          <span>UNE SOIRÉE AU CINÉMA</span>
          <h1>LE CINÉMA</h1>
          <h2>صالة السينما</h2>
          <p>تعلّم الفرنسية من شباك التذاكر حتى مناقشة الفيلم، بجمل واضحة يمكن سماعها جملةً جملة.</p>
          <button onClick={() => document.getElementById("cinema-areas")?.scrollIntoView({ behavior: "smooth" })}><Film /> اكتشف أقسام السينما</button>
        </div>
      </section>

      <section className="cinema-learning" id="cinema-areas">
        <div className="cinema-title">
          <span>01</span>
          <div><small>PARCOURS D’APPRENTISSAGE</small><h2>أقسام صالة السينما</h2><p>اختر القسم لتظهر جمله التعليمية في الأسفل.</p></div>
        </div>

        <div className="cinema-area-grid">
          {areas.map((area) => (
            <button key={area.id} className={activeId === area.id ? "active" : ""} onClick={() => {
              setActiveId(area.id);
              window.setTimeout(() => document.getElementById("cinema-phrases")?.scrollIntoView({ behavior: "smooth", block: "center" }), 80);
            }}>
              <i>{area.icon}</i><strong>{area.fr}</strong><span>{area.ar}</span>
            </button>
          ))}
        </div>

        <section className="cinema-phrase-room" id="cinema-phrases">
          <div className="cinema-phrase-heading"><i>{active.icon}</i><div><small>{active.fr}</small><h3>{active.ar}</h3></div></div>
          <div className="cinema-phrases">
            {active.phrases.map(([fr, ar], index) => (
              <button key={fr} onClick={() => speak(fr)}>
                <em>{String(index + 1).padStart(2, "0")}</em>
                <span><strong>{fr}</strong><small>{ar}</small></span>
                <Volume2 />
              </button>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
