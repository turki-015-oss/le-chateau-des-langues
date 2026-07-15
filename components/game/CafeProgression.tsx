"use client";

import { Award, CheckCircle2, Coffee, LockKeyhole, Sparkles, Star } from "lucide-react";

export type CafeAchievement = {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
};

type Props = {
  level: number;
  served: number;
  totalServed: number;
  dailyTarget: number;
  achievements: CafeAchievement[];
};

export default function CafeProgression({ level, served, totalServed, dailyTarget, achievements }: Props) {
  const dailyProgress = Math.min(100, Math.round((served / Math.max(1, dailyTarget)) * 100));
  const upgrades = [
    { level: 1, title: "ركن القهوة", icon: "☕" },
    { level: 2, title: "طاولات إضافية", icon: "🪑" },
    { level: 3, title: "آلة إسبريسو ملكية", icon: "⚙️" },
    { level: 4, title: "ردهة كبار الزوار", icon: "👑" },
  ];

  return (
    <section className="cafe-progression">
      <div className="progression-heading">
        <div>
          <span><Sparkles size={16}/> Café Progression</span>
          <h2>تطور المقهى</h2>
        </div>
        <b>المستوى {level}</b>
      </div>

      <div className="daily-challenge">
        <div>
          <Coffee size={22}/>
          <div>
            <strong>التحدي اليومي</strong>
            <span>اخدم {dailyTarget} زبائن في وردية واحدة</span>
          </div>
        </div>
        <b>{served}/{dailyTarget}</b>
        <div className="daily-track"><span style={{ width: `${dailyProgress}%` }} /></div>
      </div>

      <div className="upgrade-grid">
        {upgrades.map((upgrade) => {
          const unlocked = level >= upgrade.level;
          return (
            <article key={upgrade.level} className={unlocked ? "unlocked" : "locked"}>
              <span>{upgrade.icon}</span>
              <div>
                <strong>{upgrade.title}</strong>
                <small>المستوى {upgrade.level}</small>
              </div>
              {unlocked ? <CheckCircle2 size={18}/> : <LockKeyhole size={18}/>}
            </article>
          );
        })}
      </div>

      <div className="achievement-board">
        <div className="achievement-title"><Award size={20}/><strong>الإنجازات</strong><span>{achievements.filter((item) => item.unlocked).length}/{achievements.length}</span></div>
        <div className="achievement-list">
          {achievements.map((item) => (
            <article key={item.id} className={item.unlocked ? "unlocked" : "locked"}>
              <Star size={18}/>
              <div><strong>{item.title}</strong><small>{item.description}</small></div>
            </article>
          ))}
        </div>
      </div>
      <p className="career-total">إجمالي الزبائن الذين خدمتهم: <b>{totalServed}</b></p>
    </section>
  );
}
