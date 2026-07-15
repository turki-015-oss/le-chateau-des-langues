"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Castle,
  Coins,
  Crown,
  Library,
  Map,
  Settings,
  ShieldCheck,
  Sparkles,
  Star,
  Volume2,
  VolumeX
} from "lucide-react";

type World = {
  title: string;
  ar: string;
  path: string;
  level: string;
  icon: string;
  description: string;
  position: string;
  unlockKey?: string;
};

const worlds: World[] = [
  {
    title: "La Famille",
    ar: "العائلة",
    path: "/family",
    level: "A1",
    icon: "👨‍👩‍👧",
    description: "التحيات، أفراد العائلة، والحوار اليومي.",
    position: "north-west"
  },
  {
    title: "Le Grand Marché",
    ar: "السوق الكبير",
    path: "/market",
    level: "A1",
    icon: "🧺",
    description: "الأسعار، الأرقام، والشراء بالفرنسية.",
    position: "west"
  },
  {
    title: "Le Café",
    ar: "المقهى",
    path: "/cafe",
    level: "A1",
    icon: "☕",
    description: "الطلبات، المشروبات، والمجاملات.",
    position: "south-west"
  },
  {
    title: "Le Restaurant",
    ar: "المطعم",
    path: "/",
    level: "A2",
    icon: "🍽️",
    description: "الحجز، القائمة، والطلب من النادل.",
    position: "north-east"
  },
  {
    title: "L'Hôpital",
    ar: "المستشفى",
    path: "/",
    level: "B1",
    icon: "🏥",
    description: "الأعراض، المواعيد، وطلب المساعدة.",
    position: "east"
  },
  {
    title: "La Police",
    ar: "الشرطة",
    path: "/police",
    level: "B1",
    icon: "🛡️",
    description: "البلاغات، الطوارئ، والتعليمات.",
    position: "south-east"
  },
  {
    title: "Le Tribunal Royal",
    ar: "المحكمة الملكية",
    path: "/court",
    level: "B2",
    icon: "⚖️",
    description: "الشهادة، الأدلة، واللغة الرسمية.",
    position: "south"
  },
  {
    title: "Les Princes du Château",
    ar: "أمراء القلعة",
    path: "/princes",
    level: "C1",
    icon: "👑",
    description: "اللغة الراقية والمناسبات الرسمية.",
    position: "palace"
  }
];

export default function Home() {
  const [soundOn, setSoundOn] = useState(true);
  const [xp, setXp] = useState(20);
  const [coins, setCoins] = useState(30);
  const [completed, setCompleted] = useState(2);

  useEffect(() => {
    const totalXp =
      Number(localStorage.getItem("chateau-xp") || "20") +
      Number(localStorage.getItem("chateau-family-xp") || "0") +
      Number(localStorage.getItem("chateau-market-xp") || "0") +
      Number(localStorage.getItem("chateau-court-xp") || "0");

    setXp(totalXp);
    setCoins(Number(localStorage.getItem("chateau-coins") || "30"));

    const done = [
      localStorage.getItem("chateau-gate-completed"),
      localStorage.getItem("chateau-market-completed"),
      localStorage.getItem("chateau-court-completed")
    ].filter((value) => value === "true").length;

    setCompleted(Math.max(2, done));
  }, []);

  const completion = useMemo(
    () => Math.min(100, Math.round((completed / worlds.length) * 100)),
    [completed]
  );

  const enterWorld = (world: World) => {
    if (world.path === "/") return;
    window.location.href = world.path;
  };

  return (
    <main className="v08-world">
      <header className="v08-hud">
        <div className="v08-brand">
          <div className="stone-castle-logo" aria-label="شعار القلعة">
            <span className="tower left" />
            <span className="tower center" />
            <span className="tower right" />
            <span className="gate" />
          </div>
          <div>
            <strong>Le Château des Langues</strong>
            <small>مملكة تعلم الفرنسية</small>
          </div>
        </div>

        <div className="v08-progress">
          <div>
            <span>تقدم المملكة</span>
            <b>{completion}%</b>
          </div>
          <div className="v08-progress-track">
            <span style={{ width: `${completion}%` }} />
          </div>
        </div>

        <div className="v08-stats">
          <span><Star size={16} /> {xp} XP</span>
          <span><Coins size={16} /> {coins}</span>
          <button onClick={() => setSoundOn((value) => !value)} aria-label="الصوت">
            {soundOn ? <Volume2 size={19} /> : <VolumeX size={19} />}
          </button>
          <button aria-label="الإعدادات"><Settings size={19} /></button>
        </div>
      </header>

      <section className="v08-hero">
        <div className="v08-hero-overlay" />
        <div className="v08-hero-content">
          <span className="v08-kicker"><Sparkles size={17} /> المملكة تستيقظ</span>
          <h1>Le Château<br />des Langues</h1>
          <p>
            افتح البوابات، استكشف العوالم، وتعلم الفرنسية داخل مملكة واحدة مترابطة.
          </p>
          <a href="/kingdom"><Map size={19} /> افتح خريطة المملكة</a>
        </div>

        <div className="v08-palace-card">
          <div className="v08-palace-icon"><Castle size={62} /></div>
          <span>القصر الملكي</span>
          <strong>8 عوالم تعليمية</strong>
          <small>كل بوابة تفتح عالمًا جديدًا</small>
        </div>
      </section>

      <section id="map" className="v08-map-section">
        <div className="v08-section-heading">
          <div>
            <span>Royaume</span>
            <h2>خريطة المملكة</h2>
          </div>
          <p>اختر منطقة، ثم تابع طريقك نحو القصر.</p>
        </div>

        <div className="v08-map-board">
          <div className="map-river river-one" />
          <div className="map-river river-two" />
          <div className="map-road road-one" />
          <div className="map-road road-two" />
          <div className="map-road road-three" />

          <div className="central-castle">
            <Crown size={32} />
            <strong>Le Palais</strong>
            <small>القصر الملكي</small>
          </div>

          {worlds.map((world) => {
            const isLocked =
              world.unlockKey &&
              typeof window !== "undefined" &&
              localStorage.getItem(world.unlockKey) !== "true";

            return (
              <article
                key={world.title}
                className={`v08-world-node ${world.position} ${isLocked ? "locked" : ""}`}
              >
                <div className="node-icon">{world.icon}</div>
                <span>{world.level}</span>
                <h3>{world.title}</h3>
                <h4>{world.ar}</h4>
                <p>{world.description}</p>
                <button
                  disabled={Boolean(isLocked) || world.path === "/"}
                  onClick={() => enterWorld(world)}
                >
                  {isLocked ? "البوابة مغلقة" : world.path === "/" ? "قريبًا" : "دخول العالم"}
                </button>
              </article>
            );
          })}
        </div>
      </section>

      <section className="v08-features">
        <article>
          <ShieldCheck size={34} />
          <h3>بوابات متدرجة</h3>
          <p>تفتح العوالم مع تقدمك داخل المملكة.</p>
        </article>
        <article>
          <Library size={34} />
          <h3>تعلم من المواقف</h3>
          <p>حوارات واقعية بدل حفظ الكلمات فقط.</p>
        </article>
        <article>
          <Crown size={34} />
          <h3>طريق إلى القصر</h3>
          <p>كل عالم يقربك من المرحلة الملكية.</p>
        </article>
      </section>

      <footer>Le Château des Langues — v0.9.2</footer>
    </main>
  );
}