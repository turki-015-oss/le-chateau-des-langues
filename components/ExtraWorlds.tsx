"use client";

import { Coffee, Crown, Scale, ShieldCheck } from "lucide-react";

const worlds = [
  {
    title: "Le Café",
    ar: "المقهى",
    path: "/cafe",
    level: "A1",
    description: "الطلبات، المشروبات، والحوار اليومي.",
    icon: Coffee
  },
  {
    title: "La Police",
    ar: "الشرطة",
    path: "/police",
    level: "B1",
    description: "طلب المساعدة، البلاغات، والتعليمات.",
    icon: ShieldCheck
  },
  {
    title: "Le Tribunal Royal",
    ar: "المحكمة الملكية",
    path: "/court",
    level: "B2",
    description: "الشهادة، الأدلة، والحوار الرسمي.",
    icon: Scale
  },
  {
    title: "Les Princes du Château",
    ar: "أمراء القلعة",
    path: "/princes",
    level: "C1",
    description: "اللغة الراقية والمناسبات الرسمية.",
    icon: Crown
  }
];

export default function ExtraWorlds() {
  return (
    <section className="extra-worlds-section">
      <div className="extra-worlds-heading">
        <span>مناطق جديدة</span>
        <h2>Nouveaux mondes</h2>
        <p>اختر عالمك التالي وواصل رحلتك داخل المملكة.</p>
      </div>

      <div className="extra-worlds-grid">
        {worlds.map((world) => {
          const Icon = world.icon;

          return (
            <article key={world.path} className="extra-world-card">
              <div className="extra-world-icon">
                <Icon size={38} />
              </div>

              <span className="extra-world-level">{world.level}</span>
              <h3>{world.title}</h3>
              <h4>{world.ar}</h4>
              <p>{world.description}</p>

              <button onClick={() => (window.location.href = world.path)}>
                Entrer dans ce monde
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}