"use client";

import { Coins, RotateCcw, Star, Trophy } from "lucide-react";

type Props = {
  served: number;
  total: number;
  score: number;
  reputation: number;
  onRestart: () => void;
};

export default function ServiceResults({ served, total, score, reputation, onRestart }: Props) {
  const stars = score >= total ? 3 : score >= Math.ceil(total / 2) ? 2 : 1;
  return (
    <section className="service-results">
      <Trophy size={58} />
      <span>Service terminé</span>
      <h2>اكتملت وردية المقهى</h2>
      <p>خدمت {served} من {total} زبائن، وسمعتك الحالية {reputation}%.</p>
      <div className="service-stars">
        {[1, 2, 3].map((value) => <Star key={value} className={value <= stars ? "earned" : ""} />)}
      </div>
      <div className="service-reward-row">
        <b><Coins size={18}/> +{10 + served * 4}</b>
        <b>+{20 + score * 10} XP</b>
      </div>
      <button onClick={onRestart}><RotateCcw size={18}/> إعادة الوردية</button>
    </section>
  );
}
