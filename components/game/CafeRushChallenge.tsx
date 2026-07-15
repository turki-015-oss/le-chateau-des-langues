"use client";

import { Clock3, Headphones, Play, RotateCcw, Trophy, Zap } from "lucide-react";

export type RushPrompt = {
  id: string;
  fr: string;
  ar: string;
  emoji: string;
};

type Props = {
  active: boolean;
  timeLeft: number;
  score: number;
  combo: number;
  bestScore: number;
  prompt: RushPrompt;
  options: RushPrompt[];
  feedback: "idle" | "correct" | "wrong";
  onStart: () => void;
  onPick: (id: string) => void;
  onSpeak: (text: string) => void;
};

export default function CafeRushChallenge({
  active,
  timeLeft,
  score,
  combo,
  bestScore,
  prompt,
  options,
  feedback,
  onStart,
  onPick,
  onSpeak,
}: Props) {
  return (
    <section className={`rush-challenge ${active ? "active" : ""}`}>
      <div className="rush-heading">
        <div>
          <span><Zap size={17} /> DÉFI EXPRESS</span>
          <h2>تحدي سرعة المقهى</h2>
          <p>استمع إلى الطلب واختر العنصر الصحيح قبل انتهاء الوقت.</p>
        </div>
        <div className="rush-stats">
          <span><Clock3 size={17} /> {timeLeft}s</span>
          <span>🔥 {combo}</span>
          <span><Trophy size={17} /> {bestScore}</span>
        </div>
      </div>

      {!active ? (
        <div className="rush-start-card">
          <div className="rush-cup">☕</div>
          <strong>30 ثانية · طلبات متتابعة · مكافآت XP</strong>
          <small>أفضل نتيجة محفوظة: {bestScore}</small>
          <button onClick={onStart}><Play size={18} /> ابدأ التحدي</button>
        </div>
      ) : (
        <>
          <div className={`rush-prompt ${feedback}`}>
            <button onClick={() => onSpeak(prompt.fr)} aria-label="استمع إلى الطلب">
              <Headphones size={22} /> استمع
            </button>
            <div>
              <span>Le client demande :</span>
              <h3>{prompt.fr}</h3>
              <p>{prompt.ar}</p>
            </div>
            <b>{score} pts</b>
          </div>

          <div className="rush-options">
            {options.map((item) => (
              <button key={item.id} onClick={() => onPick(item.id)}>
                <span>{item.emoji}</span>
                <strong>{item.fr}</strong>
                <small>{item.ar}</small>
              </button>
            ))}
          </div>
        </>
      )}

      {!active && score > 0 && (
        <button className="rush-retry" onClick={onStart}><RotateCcw size={17} /> إعادة المحاولة</button>
      )}
    </section>
  );
}
